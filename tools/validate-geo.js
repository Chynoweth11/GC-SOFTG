#!/usr/bin/env node
/* ============================================================================
 * tools/validate-geo.js — validate every market against official county data.
 *
 * Checks each market's countyFips against the Census FIPS master, confirms the
 * declared county name matches, and measures the distance between the market's
 * stated coordinates and the county's population-weighted centroid. A large
 * distance is legitimate for a sub-county market (30A is a beach strip, not a
 * county centre) but on a whole-county market it is an error.
 * ==========================================================================*/
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

global.LCDOS_DATA = require(path.join(ROOT, 'src/data/markets.js'));
['mtn-a','mtn-b','west','se-fl','se-atl','central','ne-mw'].forEach(f => require(path.join(ROOT, 'src/data/markets-' + f + '.js')));
const D = global.LCDOS_DATA;

function csv(file) {
  const txt = fs.readFileSync(path.join(ROOT, 'data/reference', file), 'utf8').trim();
  const [head, ...lines] = txt.split(/\r?\n/);
  const cols = head.split(',');
  return lines.map(l => {
    const out = []; let cur = '', q = false;
    for (const ch of l) {
      if (ch === '"') q = !q;
      else if (ch === ',' && !q) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return Object.fromEntries(cols.map((c, i) => [c, out[i]]));
  });
}

const FIPS = new Map();
csv('county_fips_master.csv').forEach(r => {
  FIPS.set(String(r.fips).padStart(5, '0'),
    { name: r.county_name, state: r.state_abbr, region: r.region_name, division: r.division_name });
});
const CENTER = new Map();
csv('county_centers.csv').forEach(r => {
  CENTER.set(String(r.fips).padStart(5, '0'), { lon: +r.pclon10, lat: +r.pclat10 });
});

function haversine(a, b) {
  const R = 3958.8, t = Math.PI / 180;
  const dLat = (b.lat - a.lat) * t, dLon = (b.lon - a.lon) * t;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function baseNames(s) {
  return s.replace(/\bCounties\b/g, '').replace(/\bCounty\b/g, '')
          .replace(/\bParish(es)?\b/g, '').replace(/\bBorough\b/g, '')
          .split(/\s*(?:&|\band\b)\s*/).map(x => x.trim().toLowerCase()).filter(Boolean);
}

let errors = 0, warns = 0;
const rows = [];
D.MARKETS.forEach(m => {
  const off = FIPS.get(m.countyFips);
  const ctr = CENTER.get(m.countyFips);
  const r = { id: m.id, name: m.name, fips: m.countyFips, declared: m.county, scope: m.geoScope, lat: m.lat, lon: m.lon };

  if (!off) { r.status = 'FIPS NOT FOUND'; errors++; rows.push(r); return; }
  r.official = off.name + ', ' + off.state;

  if (off.state !== m.state) { r.status = 'STATE MISMATCH (' + m.state + ' vs ' + off.state + ')'; errors++; }
  else {
    const declared = baseNames(m.county);
    const official = off.name.replace(/\b(County|Parish|Borough|Census Area|Municipality|city)\b/gi, '').trim().toLowerCase();
    if (!declared.some(d => d === official)) { r.status = 'NAME MISMATCH'; warns++; }
  }

  if (ctr) {
    r.miles = Math.round(haversine({ lat: m.lat, lon: m.lon }, ctr));
    r.centroid = ctr;
    const limit = m.geoScope === 'sub' ? 70 : 45;
    if (r.miles > limit) { r.status = (r.status ? r.status + '; ' : '') + 'COORD ' + r.miles + 'mi FROM CENTROID'; warns++; }
  }
  r.status = r.status || 'ok';
  rows.push(r);
});

const bad = rows.filter(r => r.status !== 'ok');
console.log('\n' + D.MARKETS.length + ' markets checked against the Census county FIPS master and');
console.log('population-weighted county centroids.\n');
if (!bad.length) console.log('  All markets validate cleanly.');
bad.forEach(r => {
  console.log('  ' + r.status.padEnd(36) + r.name);
  console.log('      declared: ' + r.fips + ' ' + r.declared + (r.official ? '   official: ' + r.official : ''));
  if (r.miles != null) console.log('      coords (' + r.lat + ', ' + r.lon + ') are ' + r.miles + ' mi from centroid (' +
    r.centroid.lat.toFixed(3) + ', ' + r.centroid.lon.toFixed(3) + ')');
});
console.log('\n  ' + (rows.length - bad.length) + ' clean · ' + warns + ' warnings · ' + errors + ' errors\n');

fs.writeFileSync(path.join(ROOT, 'data/reference/validation.json'), JSON.stringify(rows, null, 2));
process.exit(errors ? 1 : 0);

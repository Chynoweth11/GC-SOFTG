#!/usr/bin/env node
/* ============================================================================
 * tools/check.js — dataset and model integrity checks.
 * Run before every commit: node tools/check.js
 * ==========================================================================*/
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.LCDOS_DATA = require(path.join(ROOT, 'src/data/markets.js'));
['mtn-a', 'mtn-b', 'west', 'se-fl', 'se-atl', 'central', 'ne-mw']
  .forEach(f => require(path.join(ROOT, 'src/data/markets-' + f + '.js')));
const MODEL = require(path.join(ROOT, 'src/data/model.js'));
const SC = require(path.join(ROOT, 'src/js/scoring.js'));
const PIPE = require(path.join(ROOT, 'src/data/pipeline.js'));
const GEO = require(path.join(ROOT, 'src/data/geo.js'));

let fail = 0, warn = 0;
function bad(m) { console.log('  FAIL  ' + m); fail++; }
function soft(m) { console.log('  warn  ' + m); warn++; }
function ok(m) { console.log('  ok    ' + m); }

console.log('\n— model —');
let tw = 0;
MODEL.CATEGORIES.forEach(c => {
  tw += c.weight;
  const iw = c.indicators.reduce((a, b) => a + b.w, 0);
  if (iw !== 100) bad(c.id + ' indicator weights sum to ' + iw);
});
tw === 100 ? ok('category weights sum to 100') : bad('category weights sum to ' + tw);
[['GC_TERMS', MODEL.GC_TERMS], ['DEV_TERMS', MODEL.DEV_TERMS],
 ['MOMENTUM_TERMS', MODEL.MOMENTUM_TERMS], ['RISK_TERMS', MODEL.RISK_TERMS]].forEach(([n, t]) => {
  const s = t.reduce((a, b) => a + b.w, 0);
  s === 100 ? ok(n + ' sums to 100') : bad(n + ' sums to ' + s);
});
ok(MODEL.CATEGORIES.reduce((a, c) => a + c.indicators.length, 0) + ' indicators defined');

console.log('\n— dataset —');
const D = global.LCDOS_DATA;
const fields = Object.keys(D.FIELD_PROV);
const ids = new Set();
D.MARKETS.forEach(m => {
  if (ids.has(m.id)) bad('duplicate market id ' + m.id);
  ids.add(m.id);
  fields.forEach(f => { if (m.p[f] === undefined) bad(m.id + ' missing field ' + f); });
  Object.keys(m.p).forEach(f => {
    if (!D.FIELD_PROV[f]) bad(m.id + ' has undeclared field ' + f);
    if (typeof m.p[f] !== 'number' || !isFinite(m.p[f])) bad(m.id + '.' + f + ' is not a finite number');
  });
  ['id','name','state','stateFips','county','countyFips','lat','lon','region','archetype','tier','blurb']
    .forEach(k => { if (m[k] === undefined) bad(m.id + ' missing meta ' + k); });
  if (!D.ARCHETYPES[m.archetype]) bad(m.id + ' unknown archetype ' + m.archetype);
  if (!D.TIER_LABELS[m.tier]) bad(m.id + ' unknown tier ' + m.tier);
  if (!GEO.counties.some(c => c.id === m.countyFips)) soft(m.id + ' countyFips ' + m.countyFips + ' not in geo');
  (m.anchors || []).forEach((a, i) => {
    if (!a.fact || !a.src || !a.date) bad(m.id + ' anchor ' + i + ' incomplete');
  });
});
ok(D.MARKETS.length + ' markets, ' + fields.length + ' fields each = ' + (D.MARKETS.length * fields.length) + ' values');

console.log('\n— scoring —');
let minC = 100, maxC = 0;
D.MARKETS.forEach(m => {
  const e = SC.evaluate(m);
  ['lcdos','gce','dev','cls','flu','gap','momentum','risk','f5','f10','f20'].forEach(k => {
    if (e[k] == null || isNaN(e[k])) bad(m.id + ' ' + k + ' is not a number');
    else if (e[k] < 0 || e[k] > 100) bad(m.id + ' ' + k + ' out of range: ' + e[k]);
  });
  MODEL.CATEGORIES.forEach(c => {
    const v = e.cat[c.id];
    if (v == null || isNaN(v) || v < 0 || v > 100) bad(m.id + ' category ' + c.id + ' = ' + v);
  });
  const spec = e.derived.specMarginPct;
  if (spec < -5) soft(m.id + ' spec margin ' + spec.toFixed(1) + '% — construction + land exceed sale price');
  const c = SC.confidence(m, D.FIELD_PROV, e);
  minC = Math.min(minC, c.score); maxC = Math.max(maxC, c.score);
  const h = SC.history(e, 2021, 2031, 2026);
  if (h.length !== 11) bad(m.id + ' history length ' + h.length);
  if (h.filter(x => x.kind === 'observed').length !== 1) bad(m.id + ' history has no single observed year');
});
ok('all scores in range for ' + D.MARKETS.length + ' markets');
ok('confidence range ' + minC + '–' + maxC);
if (maxC >= 75) soft('a market claims underwriting-grade confidence — verify that is intended');

console.log('\n— pipeline —');
PIPE.PROJECTS.forEach(p => {
  if (!ids.has(p.market)) bad('project "' + p.name + '" references unknown market ' + p.market);
  if (!['verified','reported','estimated'].includes(p.conf)) bad('project "' + p.name + '" bad conf tier');
  if (!p.src) bad('project "' + p.name + '" has no source');
});
ok(PIPE.PROJECTS.length + ' projects across ' + Object.keys(PIPE.BY_MARKET).length + ' markets');

console.log('\n— geography —');
ok(GEO.states.length + ' states, ' + GEO.counties.length + ' counties');

console.log('\n' + (fail ? 'FAILED: ' + fail + ' errors' : 'PASSED') + (warn ? ' (' + warn + ' warnings)' : ''));
process.exit(fail ? 1 : 0);

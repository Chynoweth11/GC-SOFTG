#!/usr/bin/env node
/* ============================================================================
 * tools/ingest/selftest.js — prove the ingest path end to end without network.
 *
 * Primes the HTTP cache with fixtures in the exact wire format each source
 * publishes, runs the real fetchers and the real aggregation, and asserts the
 * resulting values — including share apportionment for sub-county markets and
 * population-weighted averaging for rate fields across multi-county markets.
 *
 *   node tools/ingest/selftest.js
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');
const { CACHE } = require('../ingest/lib/http');

function cachePath(url) {
  const safe = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.\-_]/gi, '_').slice(0, 180);
  return path.join(CACHE, safe);
}
function prime(url, body) {
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(cachePath(url), body);
  return cachePath(url);
}

const YEAR = new Date().getUTCFullYear();
const written = [];

/* ---- ACS fixture: 5 counties, real variable layout ---------------------- */
const acsVars = 'B01003_001E,B11001_001E,B19013_001E,B25001_001E,B25004_006E';
const acsUrl = `https://api.census.gov/data/${YEAR - 2}/acs/acs5?get=NAME,${acsVars}&for=county:*&in=state:*`;
written.push(prime(acsUrl, JSON.stringify([
  ['NAME', 'B01003_001E', 'B11001_001E', 'B19013_001E', 'B25001_001E', 'B25004_006E', 'state', 'county'],
  ['Wasatch County, Utah',   '39000',  '12100', '104000', '18000', '5200',  '49', '051'],
  ['Maricopa County, Arizona','4600000','1720000','86000','2000000','60000', '04', '013'],
  ['Nevada County, California','102000','42000',  '92000', '52000','7000',  '06', '057'],
  ['Placer County, California','420000','160000','108000','180000','9000',  '06', '061'],
  ['Collier County, Florida', '400000','168000',  '90000','230000','60000', '12', '021']
])));

/* ---- Zillow ZHVI fixture: header + 61 monthly columns ------------------- */
const zUrl = 'https://files.zillowstatic.com/research/public_csvs/zhvi/County_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv';
const months = [];
for (let i = 60; i >= 0; i--) {
  const d = new Date(Date.UTC(YEAR, 6 - i, 1));
  months.push(d.toISOString().slice(0, 10));
}
function series(from, to) {
  return months.map((_, i) => Math.round(from + (to - from) * (i / (months.length - 1)))).join(',');
}
written.push(prime(zUrl,
  'RegionID,SizeRank,RegionName,RegionType,StateName,State,Metro,StateCodeFIPS,MunicipalCodeFIPS,' + months.join(',') + '\n' +
  '1,1,Wasatch County,county,Utah,UT,Heber,49,051,' + series(600000, 1080000) + '\n' +
  '2,2,Maricopa County,county,Arizona,AZ,Phoenix,04,013,' + series(320000, 470000) + '\n' +
  '3,3,Collier County,county,Florida,FL,Naples,12,021,' + series(480000, 760000) + '\n'
));

/* ---- BPS fixture: county annual layout, 1-unit UNITS in column 8 -------- */
function bps(year, rows) {
  const head = 'Date,FIPS State,FIPS County,Region,Division,County,Bldgs1,Units1x,Units,Value,B2,U2,V2,B34,U34,V34,B5,U5,V5\n';
  return head + rows.map(r => `${year},${r.st},${r.co},4,8,X,${r.u},${r.u},${r.u},0,0,0,0,0,0,0,0,0,0`).join('\n') + '\n';
}
for (const [y, mult] of [[YEAR - 1, 1], [YEAR - 4, 0.72]]) {
  written.push(prime(`https://www2.census.gov/econ/bps/County/co${y}a.txt`, bps(y, [
    { st: '49', co: '051', u: Math.round(1180 * mult) },
    { st: '04', co: '013', u: Math.round(30000 * mult) },
    { st: '12', co: '021', u: Math.round(3300 * mult) }
  ])));
}

/* ------------------------------------------------------------------------ */
const { execFileSync } = require('child_process');
console.log('\nprimed ' + written.length + ' cache fixtures\n');

/* The committed observed.js is real repository content. Set it aside so the
   fixture run cannot destroy it, and put it back on the way out. */
const OBS_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'observed.js');
const OBS_SAVED = fs.existsSync(OBS_PATH) ? fs.readFileSync(OBS_PATH) : null;
/* Same for the manifest: a fixture run must never leave behind a record that
   reads as though six live sources answered. */
const MAN_PATH = path.join(__dirname, '..', '..', 'data', 'reference', 'ingest-manifest.json');
const MAN_SAVED = fs.existsSync(MAN_PATH) ? fs.readFileSync(MAN_PATH) : null;
const out = execFileSync('node', [path.join(__dirname, 'index.js'),
  '--only=census_acs,zillow_zhvi,census_bps'], { encoding: 'utf8' });
console.log(out);

const OBS = require(OBS_PATH);
const m = OBS.markets;
let fail = 0;
function check(label, actual, expected, tol) {
  const ok = actual != null && Math.abs(actual - expected) <= tol;
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + label.padEnd(58) +
    (actual == null ? 'missing' : (Math.round(actual * 100) / 100)) + '   expected ~' + expected);
  if (!ok) fail++;
}

console.log('assertions:\n');
/* Whole-county market takes the county value unchanged. */
check('heber-wasatch pop = Wasatch County population', m['heber-wasatch'].pop.v, 39000, 1);
check('heber-wasatch medVal = Wasatch ZHVI latest', m['heber-wasatch'].medVal.v, 1080000, 1);
check('heber-wasatch apprec5 over 60 months', m['heber-wasatch'].apprec5.v, 80, 0.5);
check('heber-wasatch sfPermits from BPS', m['heber-wasatch'].sfPermits.v, 1180, 1);
check('heber-wasatch permitCagr3 (1180 from 850)', m['heber-wasatch'].permitCagr3.v, 11.5, 0.6);

/* Sub-county market applies the share to LEVEL fields only. */
check('scottsdale pop = Maricopa x 0.068 share', m['scottsdale'].pop.v, 4600000 * 0.068, 1);
check('scottsdale medInc unscaled (rate field)', m['scottsdale'].medInc.v, 86000, 1);
check('scottsdale sfPermits = Maricopa x 0.068', m['scottsdale'].sfPermits.v, 30000 * 0.068, 1);

/* Multi-county market: levels sum, rates weight by population. */
const expPop = 102000 * 0.35 + 420000 * 0.05;
check('truckee-tahoe pop = Nevada x.35 + Placer x.05', m['truckee-tahoe'].pop.v, expPop, 1);
const w1 = 102000 * 0.35, w2 = 420000 * 0.05;
check('truckee-tahoe medInc population-weighted', m['truckee-tahoe'].medInc.v,
  (92000 * w1 + 108000 * w2) / (w1 + w2), 1);

/* Seasonal share derived from two ACS variables. */
check('naples shShare = seasonal / total units', m['naples'].shShare.v, 60000 / 230000 * 100, 0.1);

/* Provenance is carried through. */
const t = m['heber-wasatch'].pop;
console.log('  ' + (t.tier === 'verified' && t.src === 'census_acs' ? 'PASS' : 'FAIL') +
  '  provenance carried through'.padEnd(60) + t.src + ' / ' + t.tier + ' / as of ' + t.asOf);
if (t.tier !== 'verified') fail++;

console.log('\n' + (fail ? '  ' + fail + ' ASSERTION(S) FAILED\n' : '  all assertions passed\n'));

/* Clean up: fixtures must never be mistaken for real data, and the committed
   observed.js goes back exactly as it was. */
written.forEach(f => { try { fs.unlinkSync(f); } catch (e) {} });
if (OBS_SAVED) fs.writeFileSync(OBS_PATH, OBS_SAVED);
else fs.unlinkSync(OBS_PATH);
if (MAN_SAVED) fs.writeFileSync(MAN_PATH, MAN_SAVED);
else { try { fs.unlinkSync(MAN_PATH); } catch (e) {} }
console.log('  fixtures removed; observed.js ' + (OBS_SAVED ? 'restored' : 'removed') +
  ', manifest ' + (MAN_SAVED ? 'restored' : 'removed') + '\n');
process.exit(fail ? 1 : 0);

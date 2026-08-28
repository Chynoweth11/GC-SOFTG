#!/usr/bin/env node
/* ============================================================================
 * tools/ingest/index.js — refresh the observed data layer from official sources.
 *
 *   node tools/ingest            run every source
 *   node tools/ingest --only=census_acs,zillow_zhvi
 *   node tools/ingest --dry      fetch and report, write nothing
 *
 * Writes src/data/observed.js. At runtime that file overrides the analyst
 * estimates in markets*.js field by field and upgrades each overridden field's
 * provenance tier, so Data Confidence Scores rise automatically as real data
 * arrives. Any source that fails leaves its fields untouched and is recorded in
 * the manifest — the application then shows exactly which fields are live and
 * which are still carried by the analyst layer.
 *
 * NOTE ON NETWORK ACCESS: every source below is a public, unauthenticated
 * government or research endpoint. Some sandboxed environments block .gov
 * egress; the pipeline handles that correctly by reporting the source as
 * unreachable rather than by inventing values.
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MAP = require('./map');

const SOURCES = [
  require('./sources/census-acs'),
  require('./sources/census-pep'),
  require('./sources/census-bps'),
  require('./sources/bls-qcew'),
  require('./sources/irs-soi'),
  require('./sources/zillow-zhvi'),
  require('./sources/fema-nri')
];

const args = process.argv.slice(2);
const only = (args.find(a => a.startsWith('--only=')) || '').split('=')[1];
const dry = args.includes('--dry');
const onlyIds = only ? only.split(',').map(s => s.trim()) : null;

function pad(s, n) { return String(s).padEnd(n); }

async function main() {
  const started = new Date();
  const ctx = { year: started.getUTCFullYear(), fips: MAP.allFips() };

  console.log('\nLCDOS data ingest');
  console.log('  ' + ctx.fips.length + ' counties across ' + Object.keys(MAP.MARKET_COUNTIES).length + ' markets');
  console.log('  reference year ' + ctx.year + '\n');

  const manifest = { generatedAt: started.toISOString(), sources: {}, fieldCounts: {} };
  const observed = {};   // marketId -> field -> {v, src, asOf, tier}
  let popByFips = null;

  for (const src of SOURCES) {
    if (onlyIds && onlyIds.indexOf(src.id) < 0) continue;
    process.stdout.write('  ' + pad(src.id, 16));
    let res;
    const t0 = Date.now();
    try { res = await src.run(ctx); }
    catch (e) { res = { ok: false, error: e.message }; }
    const secs = ((Date.now() - t0) / 1000).toFixed(1);

    if (!res.ok) {
      console.log('UNREACHABLE  ' + (res.error || '').slice(0, 88));
      manifest.sources[src.id] = { ok: false, label: src.label, url: src.url, error: res.error, seconds: +secs };
      continue;
    }

    /* ACS population doubles as the weight for every rate-type aggregation. */
    if (src.id === 'census_acs' && res.byField.pop) popByFips = res.byField.pop;

    let written = 0;
    for (const f of src.fields) {
      const byFips = res.byField[f.key];
      if (!byFips) continue;
      const perMarket = MAP.aggregate(byFips, f.kind, popByFips);
      for (const [mid, v] of Object.entries(perMarket)) {
        if (v == null || !isFinite(v)) continue;
        (observed[mid] = observed[mid] || {})[f.key] =
          { v: Math.round(v * 1000) / 1000, src: src.id, asOf: res.asOf, tier: f.tier, kind: f.kind };
        written++;
      }
      manifest.fieldCounts[f.key] = (manifest.fieldCounts[f.key] || 0) + Object.keys(perMarket).length;
    }
    console.log('ok           ' + pad(res.rows + ' county rows', 20) + written + ' market values · as of ' + res.asOf + ' · ' + secs + 's');
    manifest.sources[src.id] = { ok: true, label: src.label, url: src.url, asOf: res.asOf, countyRows: res.rows, marketValues: written, seconds: +secs };
  }

  const live = Object.values(manifest.sources).filter(s => s.ok).length;
  const total = Object.keys(manifest.sources).length;
  const marketsCovered = Object.keys(observed).length;
  const valueCount = Object.values(observed).reduce((a, m) => a + Object.keys(m).length, 0);

  console.log('\n  ' + live + ' of ' + total + ' sources live · ' +
              valueCount + ' observed values across ' + marketsCovered + ' markets\n');

  manifest.summary = { sourcesLive: live, sourcesTotal: total, marketsCovered, valueCount };

  if (dry) { console.log('  --dry: nothing written\n'); return; }

  const banner =
`/* GENERATED FILE - do not edit by hand.
 * Produced by: node tools/ingest
 * Generated:   ${started.toISOString()}
 * Sources live: ${live}/${total} · ${valueCount} observed values across ${marketsCovered} markets
 *
 * Each entry overrides the analyst estimate for that field in markets*.js and
 * carries the provenance tier of the source it came from. Fields absent here
 * are still carried by the analyst layer.
 */
`;
  fs.writeFileSync(path.join(ROOT, 'src/data/observed.js'),
    banner + 'var LCDOS_OBSERVED = ' + JSON.stringify({ manifest, markets: observed }, null, 0) + ';\n' +
    "if (typeof module === 'object' && module.exports) module.exports = LCDOS_OBSERVED;\n");

  fs.writeFileSync(path.join(ROOT, 'data/reference/ingest-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('  wrote src/data/observed.js and data/reference/ingest-manifest.json\n');
}

main().catch(e => { console.error('\ningest failed:', e); process.exit(1); });

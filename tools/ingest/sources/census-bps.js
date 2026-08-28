/* Census Building Permits Survey — county annual files.
 * The authoritative county-level source for single-family permits. Files are
 * published at www2.census.gov/econ/bps/County/co{YYYY}a.txt as CSV with a
 * two-line header. Column layout (1-unit section) is documented at
 * https://www.census.gov/construction/bps/txt/bpsfoot.txt */
'use strict';
const { get } = require('../lib/http');
const { parse, num } = require('../lib/csv');

function parseYear(text) {
  const rows = parse(text).filter(r => r.length > 12);
  const out = {};
  for (const r of rows) {
    /* Layout: Survey Date, State FIPS, County FIPS, Region, Division, ...,
     * then Bldgs/Units/Value for 1-unit, 2-unit, 3-4 unit, 5+ unit. */
    const st = String(r[1] || '').trim().padStart(2, '0');
    const co = String(r[2] || '').trim().padStart(3, '0');
    if (!/^\d{2}$/.test(st) || !/^\d{3}$/.test(co)) continue;
    const units1 = num(r[8]);            // 1-unit UNITS
    if (units1 == null) continue;
    out[st + co] = units1;
  }
  return out;
}

module.exports = {
  id: 'census_bps',
  label: 'U.S. Census Bureau — Building Permits Survey (county annual)',
  url: 'https://www2.census.gov/econ/bps/County/',
  fields: [
    { key: 'sfPermits',   kind: 'level', tier: 'verified' },
    { key: 'permitCagr3', kind: 'rate',  tier: 'verified' }
  ],

  async run(ctx) {
    const latest = ctx.year - 1;
    const wanted = [latest, latest - 1, latest - 2, latest - 3];
    const series = {};
    let asOf = null, got = 0;

    for (const y of wanted) {
      const r = await get(`https://www2.census.gov/econ/bps/County/co${y}a.txt`, { maxAgeHours: 24 * 30 });
      if (!r.ok) continue;
      series[y] = parseYear(r.body);
      if (Object.keys(series[y]).length) { got++; if (asOf == null) asOf = String(y); }
    }
    if (!got) return { ok: false, error: 'no BPS county files reachable' };

    const byField = { sfPermits: {}, permitCagr3: {} };
    const newest = Math.max(...Object.keys(series).map(Number));
    const base = newest - 3;

    for (const [fips, v] of Object.entries(series[newest] || {})) {
      byField.sfPermits[fips] = v;
      const b = series[base] && series[base][fips];
      if (b && b > 20 && v > 0) {
        byField.permitCagr3[fips] = (Math.pow(v / b, 1 / 3) - 1) * 100;
      }
    }
    return { ok: true, asOf, byField, rows: Object.keys(byField.sfPermits).length };
  }
};

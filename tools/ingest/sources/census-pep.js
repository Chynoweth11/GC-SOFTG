/* Census Population Estimates Program — population change and net domestic
 * migration by county. Supplies popCagr5 and netMig. */
'use strict';
const { get } = require('../lib/http');
const { toObjects, num } = require('../lib/csv');

module.exports = {
  id: 'census_pep',
  label: 'U.S. Census Bureau — Population Estimates Program',
  url: 'https://www2.census.gov/programs-surveys/popest/datasets/',
  fields: [
    { key: 'popCagr5', kind: 'rate', tier: 'verified' },
    { key: 'netMig',   kind: 'rate', tier: 'verified' }
  ],

  async run(ctx) {
    /* co-est{vintage}-alldata.csv carries POPESTIMATE{year} and
     * DOMESTICMIG{year} for every county in one file. */
    const vintages = [ctx.year - 1, ctx.year - 2];
    let rows = null, asOf = null;

    for (const v of vintages) {
      const url = `https://www2.census.gov/programs-surveys/popest/datasets/2020-${v}/counties/totals/co-est${v}-alldata.csv`;
      const r = await get(url, { maxAgeHours: 24 * 30 });
      if (r.ok && r.body.length > 5000) { rows = toObjects(r.body); asOf = String(v); break; }
    }
    if (!rows) return { ok: false, error: 'no PEP county file reachable' };

    const yr = Number(asOf);
    const byField = { popCagr5: {}, netMig: {} };

    for (const r of rows) {
      if (String(r.SUMLEV) !== '050') continue;
      const fips = String(r.STATE).padStart(2, '0') + String(r.COUNTY).padStart(3, '0');
      const now = num(r['POPESTIMATE' + yr]);
      const then = num(r['POPESTIMATE' + (yr - 5)]) || num(r['ESTIMATESBASE2020']);
      if (now && then && then > 0) {
        const span = num(r['POPESTIMATE' + (yr - 5)]) ? 5 : (yr - 2020);
        if (span > 0) byField.popCagr5[fips] = (Math.pow(now / then, 1 / span) - 1) * 100;
      }
      const dom = num(r['DOMESTICMIG' + yr]);
      if (dom != null && now) byField.netMig[fips] = dom / now * 1000;
    }
    return { ok: true, asOf, byField, rows: Object.keys(byField.popCagr5).length };
  }
};

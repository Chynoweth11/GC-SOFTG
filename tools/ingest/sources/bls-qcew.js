/* BLS Quarterly Census of Employment and Wages — county annual averages.
 * Supplies employment growth. One CSV per county per year; only the 91
 * counties the market map needs are fetched. */
'use strict';
const { get } = require('../lib/http');
const { toObjects, num } = require('../lib/csv');

function totalEmp(text) {
  /* own_code 0 = total covered, industry_code 10 = all industries */
  for (const r of toObjects(text)) {
    if (String(r.own_code) === '0' && String(r.industry_code) === '10') {
      return num(r.annual_avg_emplvl);
    }
  }
  return null;
}

module.exports = {
  id: 'bls_qcew',
  label: 'Bureau of Labor Statistics — Quarterly Census of Employment and Wages',
  url: 'https://data.bls.gov/cew/data/api/',
  fields: [{ key: 'empCagr5', kind: 'rate', tier: 'verified' }],

  async run(ctx) {
    const latest = ctx.year - 1, base = latest - 5;
    const byField = { empCagr5: {} };
    let asOf = null, ok = 0, tried = 0;

    for (const fips of ctx.fips) {
      tried++;
      const [a, b] = await Promise.all([
        get(`https://data.bls.gov/cew/data/api/${latest}/a/area/${fips}.csv`, { maxAgeHours: 24 * 30, retries: 1 }),
        get(`https://data.bls.gov/cew/data/api/${base}/a/area/${fips}.csv`, { maxAgeHours: 24 * 90, retries: 1 })
      ]);
      if (!a.ok || !b.ok) continue;
      const e1 = totalEmp(a.body), e0 = totalEmp(b.body);
      if (e1 && e0 && e0 > 0) {
        byField.empCagr5[fips] = (Math.pow(e1 / e0, 1 / 5) - 1) * 100;
        asOf = String(latest); ok++;
      }
    }
    if (!ok) return { ok: false, error: 'QCEW unreachable (' + tried + ' counties attempted)' };
    return { ok: true, asOf, byField, rows: ok };
  }
};

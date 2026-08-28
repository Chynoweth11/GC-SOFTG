/* IRS Statistics of Income — county-to-county migration.
 * Supplies net AGI inflow per net in-migrating return, which is the cleanest
 * available measure of whether a market is gaining WEALTHY households rather
 * than merely gaining people. */
'use strict';
const { get } = require('../lib/http');
const { toObjects, num } = require('../lib/csv');

/* Rows where y1 is "Total Migration-US and Foreign" summarise each county. */
function summarise(rows, destKey) {
  const out = {};
  for (const r of rows) {
    const st = String(r[destKey.st] || '').padStart(2, '0');
    const co = String(r[destKey.co] || '').padStart(3, '0');
    if (!/^\d{2}$/.test(st) || !/^\d{3}$/.test(co)) continue;
    const name = String(r.y1_countyname || r.y2_countyname || '');
    if (!/Total Migration-US and Foreign/i.test(name)) continue;
    out[st + co] = { returns: num(r.n1) || 0, agi: (num(r.agi) || 0) * 1000 };
  }
  return out;
}

module.exports = {
  id: 'irs_soi',
  label: 'IRS Statistics of Income — county-to-county migration',
  url: 'https://www.irs.gov/statistics/soi-tax-stats-migration-data',
  fields: [{ key: 'agiIn', kind: 'rate', tier: 'verified' }],

  async run(ctx) {
    /* SOI runs roughly two years behind; try the latest few filing pairs. */
    const pairs = [];
    for (let y = ctx.year - 2; y >= ctx.year - 5; y--) {
      pairs.push([String(y - 1).slice(2), String(y).slice(2)]);
    }

    for (const [a, b] of pairs) {
      const [inR, outR] = await Promise.all([
        get(`https://www.irs.gov/pub/irs-soi/countyinflow${a}${b}.csv`, { maxAgeHours: 24 * 60, retries: 1 }),
        get(`https://www.irs.gov/pub/irs-soi/countyoutflow${a}${b}.csv`, { maxAgeHours: 24 * 60, retries: 1 })
      ]);
      if (!inR.ok || !outR.ok) continue;

      const inflow = summarise(toObjects(inR.body), { st: 'y2_statefips', co: 'y2_countyfips' });
      const outflow = summarise(toObjects(outR.body), { st: 'y1_statefips', co: 'y1_countyfips' });
      const byField = { agiIn: {} };

      for (const fips of Object.keys(inflow)) {
        const i = inflow[fips], o = outflow[fips];
        if (!o) continue;
        const netReturns = i.returns - o.returns;
        const netAgi = i.agi - o.agi;
        /* Below ~150 net returns the ratio is too noisy to be meaningful. */
        if (Math.abs(netReturns) >= 150) byField.agiIn[fips] = netAgi / netReturns;
      }
      if (Object.keys(byField.agiIn).length) {
        return { ok: true, asOf: '20' + b, byField, rows: Object.keys(byField.agiIn).length };
      }
    }
    return { ok: false, error: 'no SOI migration file reachable' };
  }
};

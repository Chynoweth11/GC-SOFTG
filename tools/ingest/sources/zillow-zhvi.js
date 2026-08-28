/* Zillow Home Value Index — county, smoothed & seasonally adjusted.
 * Supplies median home value and five-year appreciation. */
'use strict';
const { get } = require('../lib/http');
const { parse, num } = require('../lib/csv');

const URL = 'https://files.zillowstatic.com/research/public_csvs/zhvi/' +
            'County_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv';

module.exports = {
  id: 'zillow_zhvi',
  label: 'Zillow Research — Home Value Index (county)',
  url: 'https://www.zillow.com/research/data/',
  fields: [
    { key: 'medVal',  kind: 'rate', tier: 'reported' },
    { key: 'apprec5', kind: 'rate', tier: 'reported' }
  ],

  async run() {
    const r = await get(URL, { maxAgeHours: 24 * 7 });
    if (!r.ok) return { ok: false, error: r.error };

    const rows = parse(r.body);
    if (rows.length < 2) return { ok: false, error: 'empty ZHVI file' };
    const head = rows[0];
    const iState = head.indexOf('StateCodeFIPS');
    const iCounty = head.indexOf('MunicipalCodeFIPS');
    /* Date columns are the trailing YYYY-MM-DD headers. */
    const dateCols = head.map((h, i) => ({ h, i })).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.h));
    if (iState < 0 || !dateCols.length) return { ok: false, error: 'unexpected ZHVI layout' };

    const last = dateCols[dateCols.length - 1];
    const backIdx = Math.max(0, dateCols.length - 61);   // 60 months back
    const back = dateCols[backIdx];

    const byField = { medVal: {}, apprec5: {} };
    for (const row of rows.slice(1)) {
      const st = String(row[iState] || '').padStart(2, '0');
      const co = String(row[iCounty] || '').padStart(3, '0');
      if (!/^\d{2}$/.test(st) || !/^\d{3}$/.test(co)) continue;
      const now = num(row[last.i]), then = num(row[back.i]);
      if (now) byField.medVal[st + co] = now;
      if (now && then && then > 0) byField.apprec5[st + co] = (now / then - 1) * 100;
    }
    return { ok: true, asOf: last.h.slice(0, 7), byField, rows: Object.keys(byField.medVal).length };
  }
};

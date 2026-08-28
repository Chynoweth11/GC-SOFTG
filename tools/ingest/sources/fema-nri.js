/* FEMA National Risk Index — county composite.
 * Supplies the physical climate/hazard risk score used in the long-run risk
 * model. NRI's RISK_SCORE is already a 0-100 national percentile-style index,
 * which maps directly onto the model's convention (higher = riskier). */
'use strict';
const { get } = require('../lib/http');
const { toObjects, num } = require('../lib/csv');
const { readTextMatching } = require('../lib/unzip');

const URL = 'https://hazards.fema.gov/nri/Content/StaticDocuments/DataDownload/' +
            'NRI_Table_Counties/NRI_Table_Counties.zip';

module.exports = {
  id: 'fema_nri',
  label: 'FEMA — National Risk Index (county table)',
  url: 'https://hazards.fema.gov/nri/data-resources',
  fields: [{ key: 'climIdx', kind: 'rate', tier: 'verified' }],

  async run() {
    const r = await get(URL, { maxAgeHours: 24 * 90, binary: true, timeoutMs: 180000 });
    if (!r.ok) return { ok: false, error: r.error };

    let text;
    try { text = readTextMatching(r.body, /\.csv$/i); }
    catch (e) { return { ok: false, error: 'unzip failed: ' + e.message }; }

    const rows = toObjects(text);
    const byField = { climIdx: {} };
    for (const row of rows) {
      const fips = String(row.STCOFIPS || '').padStart(5, '0');
      if (!/^\d{5}$/.test(fips)) continue;
      const v = num(row.RISK_SCORE);
      if (v != null) byField.climIdx[fips] = Math.max(0, Math.min(100, v));
    }
    if (!Object.keys(byField.climIdx).length) return { ok: false, error: 'no RISK_SCORE rows parsed' };
    return { ok: true, asOf: '2025', byField, rows: Object.keys(byField.climIdx).length };
  }
};

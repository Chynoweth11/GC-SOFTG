/* Census American Community Survey, 5-year estimates — county level.
 * Supplies population, households, median household income, and the
 * seasonal/recreational-use share of housing units. */
'use strict';
const { getJson } = require('../lib/http');

const VARS = {
  pop:      'B01003_001E',   // total population
  hh:       'B11001_001E',   // households
  medInc:   'B19013_001E',   // median household income
  units:    'B25001_001E',   // total housing units
  seasonal: 'B25004_006E'    // vacant: for seasonal, recreational or occasional use
};

module.exports = {
  id: 'census_acs',
  label: 'U.S. Census Bureau — American Community Survey 5-year',
  url: 'https://api.census.gov/data/{year}/acs/acs5',
  fields: [
    { key: 'pop',     kind: 'level', tier: 'verified' },
    { key: 'hh',      kind: 'level', tier: 'verified' },
    { key: 'medInc',  kind: 'rate',  tier: 'verified' },
    { key: 'shShare', kind: 'rate',  tier: 'verified' }
  ],

  async run(ctx) {
    /* Walk back from the most recent plausible vintage until one answers. */
    const years = [ctx.year - 1, ctx.year - 2, ctx.year - 3];
    const get = Object.values(VARS).join(',');
    let data = null, asOf = null, lastErr = null;

    for (const y of years) {
      const url = `https://api.census.gov/data/${y}/acs/acs5?get=NAME,${get}&for=county:*&in=state:*`;
      const r = await getJson(url, { maxAgeHours: 24 * 30 });
      if (r.ok && Array.isArray(r.json)) { data = r.json; asOf = String(y); break; }
      lastErr = r.error || ('no data for ' + y);
    }
    if (!data) return { ok: false, error: lastErr };

    const head = data[0];
    const ix = Object.fromEntries(head.map((h, i) => [h, i]));
    const byField = { pop: {}, hh: {}, medInc: {}, shShare: {} };

    for (const row of data.slice(1)) {
      const fips = row[ix.state] + row[ix.county];
      const n = k => { const v = Number(row[ix[VARS[k]]]); return isFinite(v) && v > -666666666 ? v : null; };
      const pop = n('pop'), hh = n('hh'), inc = n('medInc'), units = n('units'), seas = n('seasonal');
      if (pop != null) byField.pop[fips] = pop;
      if (hh != null) byField.hh[fips] = hh;
      if (inc != null) byField.medInc[fips] = inc;
      if (units && seas != null) byField.shShare[fips] = seas / units * 100;
    }
    return { ok: true, asOf, byField, rows: data.length - 1 };
  }
};

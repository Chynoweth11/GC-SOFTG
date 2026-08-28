/* ============================================================================
 * ingest/map.js — market → county composition.
 *
 * Every market is expressed as a list of counties with a share. For a
 * whole-county market the share is 1. For a sub-county market (30A inside
 * Walton, Scottsdale inside Maricopa) the share is the market's estimated
 * portion of that county, and it is applied ONLY to level-type fields —
 * population, households, permit counts. Rate-type fields (growth rates,
 * medians, indices) transfer directly, because a median does not scale.
 *
 * The shares are analyst estimates and are declared here rather than buried in
 * a fetcher, so they can be argued with. `basis` states what each is derived
 * from.
 * ==========================================================================*/
'use strict';

const M = {
  /* ---- whole-county markets ------------------------------------------- */
  'heber-wasatch':      [['49051', 1]],
  'park-city':          [['49043', 1]],
  'st-george':          [['49053', 1]],
  'bozeman':            [['30031', 1]],
  'whitefish':          [['30029', 1]],
  'missoula':           [['30063', 1]],
  'jackson-hole':       [['56039', 1]],
  'sheridan-wy':        [['56033', 1]],
  'cda':                [['16055', 1]],
  'sandpoint':          [['16017', 1]],
  'sun-valley':         [['16013', 1]],
  'mccall':             [['16085', 1]],
  'boise':              [['16001', 1]],
  'aspen':              [['08097', 1]],
  'vail':               [['08037', 1]],
  'steamboat':          [['08107', 1]],
  'telluride':          [['08113', 1]],
  'crested-butte':      [['08051', 1]],
  'summit-co':          [['08117', 1]],
  'durango':            [['08067', 1]],
  'boulder':            [['08013', 1]],
  'reno-tahoe':         [['32031', 1], ['32005', 1]],
  'santa-fe':           [['35049', 1]],
  'flagstaff':          [['04005', 1]],
  'bend':               [['41017', 1]],
  'napa-sonoma':        [['06055', 1]],
  'san-juan-islands':   [['53055', 1]],
  'chelan-leavenworth': [['53007', 1]],
  'maui':               [['15009', 1]],
  '30a-walton':         [['12131', 1]],
  'naples':             [['12021', 1]],
  'sarasota-lwr':       [['12115', 1], ['12081', 1]],
  'palm-beach':         [['12099', 1]],
  'miami-gables':       [['12086', 1]],
  'vero-beach':         [['12061', 1]],
  'ponte-vedra':        [['12109', 1]],
  'amelia-island':      [['12089', 1]],
  'destin':             [['12091', 1]],
  'charleston':         [['45019', 1]],
  'hilton-head':        [['45013', 1]],
  'greenville-sc':      [['45045', 1]],
  'lake-keowee':        [['45073', 1], ['45077', 1]],
  'aiken':              [['45003', 1]],
  'sea-island':         [['13127', 1]],
  'asheville':          [['37021', 1]],
  'blowing-rock':       [['37189', 1], ['37011', 1]],
  'lake-norman':        [['37097', 1]],
  'wilmington-nc':      [['37129', 1]],
  'fairhope':           [['01003', 1]],
  'austin-hill':        [['48453', 1]],
  'fredericksburg':     [['48171', 1]],
  'nashville':          [['47037', 1]],
  'franklin-tn':        [['47187', 1]],
  'chattanooga':        [['47065', 1]],
  'bentonville':        [['05007', 1]],
  'nantucket':          [['25019', 1]],
  'marthas-vineyard':   [['25007', 1]],
  'cape-cod':           [['25001', 1]],
  'greenwich':          [['09001', 1]],
  'newport-ri':         [['44005', 1]],
  'camden-me':          [['23013', 1], ['23009', 1]],
  'charlottesville':    [['51003', 1], ['51540', 1]],
  'lake-geneva':        [['55127', 1]],
  'door-county':        [['55029', 1]],
  'harbor-springs':     [['26047', 1]],
  'traverse-city':      [['26055', 1], ['26089', 1]],

  /* ---- sub-county markets: share applies to LEVEL fields only ---------- */
  'ogden-valley':       [['49057', 0.070]],
  'big-sky':            [['30031', 0.018], ['30057', 0.160]],
  'truckee-tahoe':      [['06057', 0.350], ['06061', 0.050]],
  'sedona':             [['04025', 0.250], ['04005', 0.030]],
  'scottsdale':         [['04013', 0.068]],
  'montecito':          [['06083', 0.205]],
  'carmel':             [['06053', 0.240]],
  'palm-springs':       [['06065', 0.155]],
  'boca-grande':        [['12071', 0.020], ['12015', 0.030]],
  'cashiers-highlands': [['37099', 0.280], ['37113', 0.250]],
  'dallas-park-cities': [['48113', 0.090], ['48439', 0.050]],
  'houston-woodlands':  [['48201', 0.130], ['48339', 0.250]],
  'hamptons':           [['36103', 0.050]]
};

/* Why each sub-county share is what it is. */
const BASIS = {
  'ogden-valley':       'Ogden Valley CDPs (Eden, Huntsville, Liberty) plus unincorporated valley, against Weber County total.',
  'big-sky':            'Big Sky CDP straddles the Gallatin/Madison line; shares follow the CDP population split.',
  'truckee-tahoe':      'Truckee plus the Nevada County east-slope, plus the Placer County north-shore communities.',
  'sedona':             'Sedona city straddles the Yavapai/Coconino line; share covers Sedona plus the Verde Valley communities.',
  'scottsdale':         'Scottsdale and Paradise Valley municipal populations against Maricopa County total.',
  'montecito':          'Santa Barbara city plus Montecito and Summerland against Santa Barbara County total.',
  'carmel':             'Carmel, Pebble Beach, Monterey and Pacific Grove against Monterey County total.',
  'palm-springs':       'The nine Coachella Valley cities against Riverside County total.',
  'boca-grande':        'Boca Grande, Gasparilla and Sanibel/Captiva against the Lee and Charlotte County totals.',
  'cashiers-highlands': 'Cashiers, Highlands and the plateau townships across the Jackson/Macon line.',
  'dallas-park-cities': 'Highland Park, University Park and Preston Hollow, plus Westlake and Southlake in Tarrant.',
  'houston-woodlands':  'Memorial, River Oaks, West University and Tanglewood in Harris; The Woodlands in Montgomery.',
  'hamptons':           'The five East End towns against Suffolk County total.'
};

/** All distinct county FIPS the pipeline needs to fetch. */
function allFips() {
  const s = new Set();
  Object.values(M).forEach(list => list.forEach(([f]) => s.add(f)));
  return Array.from(s).sort();
}

/** Aggregate a per-county value map into a per-market value.
 *  kind 'level' → share-weighted SUM.  kind 'rate' → population-weighted MEAN. */
function aggregate(byFips, kind, popByFips) {
  const out = {};
  for (const [id, list] of Object.entries(M)) {
    let sum = 0, wsum = 0, n = 0;
    for (const [fips, share] of list) {
      const v = byFips[fips];
      if (v == null || !isFinite(v)) continue;
      if (kind === 'level') { sum += v * share; n++; }
      else {
        const w = (popByFips && popByFips[fips] ? popByFips[fips] : 1) * share;
        sum += v * w; wsum += w; n++;
      }
    }
    if (!n) continue;
    out[id] = kind === 'level' ? sum : (wsum ? sum / wsum : null);
  }
  return out;
}

module.exports = { MARKET_COUNTIES: M, BASIS, allFips, aggregate };

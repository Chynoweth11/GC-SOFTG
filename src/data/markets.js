/* ============================================================================
 * markets.js — The LCDOS market dataset.
 * ----------------------------------------------------------------------------
 * 78 U.S. markets, each described by 68 primitive quantities. Scores are never
 * stored here; they are computed from these primitives by src/js/scoring.js.
 *
 * READ THIS BEFORE USING ANY NUMBER IN THIS FILE
 * ----------------------------------------------
 * This is a v1.0 analyst data layer, not a production data feed. Every field
 * carries a provenance tier:
 *
 *   verified   primary statistical agency / regulator / SEC filing, cross-checked
 *   reported   named industry source, single-sourced
 *   modelled   computed from other fields by a documented transform
 *   estimated  analyst estimate calibrated against comparable markets
 *   rubric     structured qualitative assessment on a written 0-100 scale
 *
 * The majority of the luxury-transaction, pipeline and contractor-count fields
 * are ESTIMATED. They are directionally reliable and internally consistent, and
 * they are good enough to rank markets against one another - which is what this
 * system is for. They are NOT good enough to underwrite a specific transaction.
 * docs/METHODOLOGY.md lists, field by field, the public endpoint that should
 * replace each estimate before this model is used to commit capital.
 *
 * Where a specific figure was verified against a named public source during
 * research, it is recorded in that market's `anchors` array with a citation and
 * a date, and it raises the market's Data Confidence Score.
 * ==========================================================================*/
var LCDOS_DATA = (function () {
  'use strict';

  /* ======================================================================
   * SOURCE REGISTRY
   * ==================================================================== */
  var SOURCES = {
    census_pep:    { name: 'U.S. Census Bureau, Population Estimates Program', kind: 'agency', url: 'https://www.census.gov/programs-surveys/popest.html' },
    census_acs:    { name: 'U.S. Census Bureau, American Community Survey 5-yr', kind: 'agency', url: 'https://www.census.gov/programs-surveys/acs' },
    census_bps:    { name: 'U.S. Census Bureau, Building Permits Survey', kind: 'agency', url: 'https://www.census.gov/construction/bps/' },
    census_nrc:    { name: 'U.S. Census Bureau, New Residential Construction', kind: 'agency', url: 'https://www.census.gov/construction/nrc/' },
    census_bfs:    { name: 'U.S. Census Bureau, Business Formation Statistics', kind: 'agency', url: 'https://www.census.gov/econ/bfs/' },
    bls_qcew:      { name: 'Bureau of Labor Statistics, QCEW', kind: 'agency', url: 'https://www.bls.gov/cew/' },
    bea_regional:  { name: 'Bureau of Economic Analysis, Regional Accounts', kind: 'agency', url: 'https://www.bea.gov/data/economic-accounts/regional' },
    irs_soi:       { name: 'IRS Statistics of Income, County-to-County Migration', kind: 'agency', url: 'https://www.irs.gov/statistics/soi-tax-stats-migration-data' },
    faa_atads:     { name: 'FAA Air Traffic Activity System (ATADS) / TFMSC', kind: 'agency', url: 'https://aspm.faa.gov/' },
    faa_carrier:   { name: 'Published airline schedules / airport authority', kind: 'agency', url: 'https://www.transtats.bts.gov/' },
    fema_nri:      { name: 'FEMA National Risk Index', kind: 'agency', url: 'https://hazards.fema.gov/nri/' },
    tax_foundation:{ name: 'Tax Foundation, state & local tax data', kind: 'research', url: 'https://taxfoundation.org/' },
    zillow_zhvi:   { name: 'Zillow Home Value Index / Zillow Research', kind: 'market', url: 'https://www.zillow.com/research/data/' },
    redfin:        { name: 'Redfin Data Center', kind: 'market', url: 'https://www.redfin.com/news/data-center/' },
    mls_composite: { name: 'Local MLS / REALTOR association statistics (composite)', kind: 'market', url: null },
    str_composite: { name: 'Lodging performance composite (STR-style metrics, reconstructed)', kind: 'market', url: null },
    tourism_office:{ name: 'State & local destination marketing organisations', kind: 'industry', url: null },
    henley_usa:    { name: 'Henley & Partners USA Wealth Report 2025', kind: 'research', url: 'https://www.henleyglobal.com/publications/usa-wealth-report-2025' },
    abc_backlog:   { name: 'Associated Builders & Contractors, Construction Backlog Indicator', kind: 'industry', url: 'https://www.abc.org/News-Media/News-Releases' },
    planning_dept: { name: 'County & municipal planning departments, development applications', kind: 'government', url: null },
    airport_cip:   { name: 'Airport authority capital improvement programmes', kind: 'government', url: null },
    sec_filings:   { name: 'SEC filings (10-K / 8-K / investor presentations)', kind: 'regulator', url: 'https://www.sec.gov/edgar' },
    developer_pr:  { name: 'Developer press releases & project websites', kind: 'industry', url: null },
    trade_press:   { name: 'Construction & real estate trade press', kind: 'industry', url: null },
    lcdos_model:   { name: 'LCDOS internal model (documented transform)', kind: 'internal', url: null },
    lcdos_rubric:  { name: 'LCDOS analyst rubric (written 0-100 scale)', kind: 'internal', url: null }
  };

  /* ======================================================================
   * FIELD PROVENANCE DEFAULTS
   * The tier that applies to a field unless a market overrides it.
   * `sub` gives the tier that applies when a market is sub-county in scope
   * (e.g. 30A, Cashiers-Highlands, Big Sky) and Census-derived figures must
   * be apportioned rather than read directly.
   * ==================================================================== */
  var FIELD_PROV = {
    pop:            { tier: 'reported',  sub: 'estimated', src: 'census_pep',   asOf: '2025-07' },
    hh:             { tier: 'reported',  sub: 'estimated', src: 'census_acs',   asOf: '2024' },
    popCagr5:       { tier: 'reported',  sub: 'estimated', src: 'census_pep',   asOf: '2025-07' },
    netMig:         { tier: 'reported',  sub: 'estimated', src: 'census_pep',   asOf: '2025-07' },
    empCagr5:       { tier: 'reported',  sub: 'estimated', src: 'bls_qcew',     asOf: '2025-Q4' },
    bizFormIdx:     { tier: 'estimated', src: 'census_bfs',    asOf: '2025' },
    medInc:         { tier: 'reported',  sub: 'estimated', src: 'census_acs',   asOf: '2024' },
    incCagr5:       { tier: 'estimated', src: 'census_acs',    asOf: '2024' },

    hnwiPer1k:      { tier: 'estimated', src: 'lcdos_model',   asOf: '2026-Q2' },
    hnwiG10:        { tier: 'estimated', src: 'henley_usa',    asOf: '2025' },
    agiIn:          { tier: 'reported',  sub: 'estimated', src: 'irs_soi',      asOf: '2023' },
    uhnwIdx:        { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    shShare:        { tier: 'reported',  sub: 'estimated', src: 'census_acs',   asOf: '2024' },
    wealthInfraIdx: { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },

    medVal:         { tier: 'reported',  sub: 'estimated', src: 'zillow_zhvi',  asOf: '2026-06' },
    luxPpsf:        { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    apprec5:        { tier: 'reported',  sub: 'estimated', src: 'zillow_zhvi',  asOf: '2026-06' },
    dom:            { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    cashShare:      { tier: 'estimated', src: 'redfin',        asOf: '2026-Q1' },
    tx2m:           { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    tx5m:           { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    tx10m:          { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    lotPrice:       { tier: 'estimated', src: 'mls_composite', asOf: '2026-Q2' },
    landShare:      { tier: 'modelled',  src: 'lcdos_model',   asOf: '2026-Q2' },

    sfPermits:      { tier: 'reported',  sub: 'estimated', src: 'census_bps',   asOf: '2025' },
    permitCagr3:    { tier: 'reported',  sub: 'estimated', src: 'census_bps',   asOf: '2025' },
    customShare:    { tier: 'estimated', src: 'lcdos_model',   asOf: '2026' },
    remodelIdx:     { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    costPsf:        { tier: 'estimated', src: 'trade_press',   asOf: '2026-Q2' },
    gcMargin:       { tier: 'estimated', src: 'trade_press',   asOf: '2026' },
    luxGcCount:     { tier: 'estimated', src: 'lcdos_model',   asOf: '2026-Q2' },
    tradeIdx:       { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    backlog:        { tier: 'estimated', src: 'abc_backlog',   asOf: '2026-Q2' },
    buildMonths:    { tier: 'estimated', src: 'lcdos_model',   asOf: '2026' },

    pipelineM:      { tier: 'estimated', src: 'planning_dept', asOf: '2026-Q2' },
    commercialM:    { tier: 'estimated', src: 'planning_dept', asOf: '2026-Q2' },
    infraM:         { tier: 'estimated', src: 'planning_dept', asOf: '2026-Q2' },
    entitledLots:   { tier: 'estimated', src: 'planning_dept', asOf: '2026-Q2' },
    landIdx:        { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    entMonths:      { tier: 'estimated', src: 'planning_dept', asOf: '2026' },
    permitDays:     { tier: 'estimated', src: 'planning_dept', asOf: '2026' },
    waterIdx:       { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    topoIdx:        { tier: 'rubric',    src: 'lcdos_rubric',  asOf: '2026-08' },
    shortageIdx:    { tier: 'modelled',  src: 'lcdos_model',   asOf: '2026-Q2' },

    visitorsM:      { tier: 'reported',  src: 'tourism_office', asOf: '2025' },
    visitorG:       { tier: 'estimated', src: 'tourism_office', asOf: '2025' },
    visitSpendM:    { tier: 'reported',  src: 'tourism_office', asOf: '2025' },
    luxRooms:       { tier: 'estimated', src: 'str_composite',  asOf: '2026-Q2' },
    adr:            { tier: 'estimated', src: 'str_composite',  asOf: '2026-Q1' },
    occ:            { tier: 'estimated', src: 'str_composite',  asOf: '2025' },
    seasonIdx:      { tier: 'rubric',    src: 'lcdos_rubric',   asOf: '2026-08' },

    repIdx:         { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    clubIdx:        { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    celebIdx:       { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    hospIdx:        { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    retailIdx:      { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    schoolIdx:      { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    privacyIdx:     { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },
    entryBarIdx:    { tier: 'rubric', src: 'lcdos_rubric', asOf: '2026-08' },

    jetOps:         { tier: 'reported',  src: 'faa_atads',    asOf: '2025' },
    nonstops:       { tier: 'verified',  src: 'faa_carrier',  asOf: '2026-06' },
    metroMin:       { tier: 'verified',  src: 'lcdos_model',  asOf: '2026' },
    roadIdx:        { tier: 'rubric',    src: 'lcdos_rubric', asOf: '2026-08' },
    airInvestM:     { tier: 'reported',  src: 'airport_cip',  asOf: '2026' },

    propTax:        { tier: 'reported',  src: 'tax_foundation', asOf: '2025' },
    incomeTax:      { tier: 'verified',  src: 'tax_foundation', asOf: '2026' },
    insIdx:         { tier: 'estimated', src: 'lcdos_model',    asOf: '2026-Q2' },
    regIdx:         { tier: 'rubric',    src: 'lcdos_rubric',   asOf: '2026-08' },
    climIdx:        { tier: 'estimated', src: 'fema_nri',       asOf: '2025' },
    structIdx:      { tier: 'rubric',    src: 'lcdos_rubric',   asOf: '2026-08' }
  };

  /* ======================================================================
   * MARKET CONSTRUCTOR
   * ==================================================================== */
  var MARKETS = [];

  function M(cfg) {
    /* Downgrade Census-derived tiers one step for sub-county markets. */
    var prov = cfg.prov || {};
    if (cfg.geoScope === 'sub') {
      for (var f in FIELD_PROV) {
        if (FIELD_PROV[f].sub && !prov[f]) {
          prov[f] = { tier: FIELD_PROV[f].sub, src: FIELD_PROV[f].src, asOf: FIELD_PROV[f].asOf, note: 'Apportioned to a sub-county market boundary.' };
        }
      }
    }
    cfg.prov = prov;
    cfg.anchors = cfg.anchors || [];
    MARKETS.push(cfg);
    return cfg;
  }

  var ARCHETYPES = {
    'ski':          { label: 'Ski / Alpine resort',       color: '#5aa9f5' },
    'mountain':     { label: 'Mountain town',             color: '#7fd1c1' },
    'lake':         { label: 'Lake community',            color: '#4fc3e8' },
    'coastal':      { label: 'Coastal / beach',           color: '#f2b544' },
    'island':       { label: 'Island',                    color: '#f08a5d' },
    'golf':         { label: 'Golf & club community',     color: '#9ad14e' },
    'desert':       { label: 'Desert resort',             color: '#e8734f' },
    'wine':         { label: 'Wine country',              color: '#c96ea8' },
    'suburb':       { label: 'High-growth luxury suburb', color: '#a884f3' },
    'metro':        { label: 'Metropolitan luxury core',  color: '#f2545b' },
    'smalltown':    { label: 'Wealthy small town',        color: '#8fa3bd' }
  };

  var TIER_LABELS = {
    'mature':     'Mature luxury — high prestige, constrained supply',
    'established':'Established luxury — deep market, active growth',
    'emerging':   'Emerging luxury — re-rating now',
    'frontier':   'Frontier — pre-recognition'
  };

  /* ======================================================================
   * OBSERVED-DATA OVERRIDE
   * src/data/observed.js is written by `node tools/ingest` from official
   * sources. Where it carries a field, it replaces the analyst estimate and
   * upgrades that field's provenance tier — so Data Confidence Scores rise on
   * their own as real data arrives. The file is optional: with no ingest run,
   * the analyst layer stands and the application says so.
   * ==================================================================== */
  var OBSERVED_STATUS = { ran: false, applied: 0, markets: 0, manifest: null };

  function applyObserved(OBS) {
    /* An empty observed set is the same as no ingest: the analyst layer stands
       and the status stays honest rather than claiming a live data layer. */
    if (!OBS || !OBS.markets || !Object.keys(OBS.markets).length) return OBSERVED_STATUS;
    var applied = 0, touched = 0;
    MARKETS.forEach(function (m) {
      var o = OBS.markets[m.id];
      if (!o) return;
      var any = false;
      for (var f in o) {
        if (!Object.prototype.hasOwnProperty.call(o, f)) continue;
        if (!FIELD_PROV[f]) continue;                 // ignore fields we do not model
        var rec = o[f];
        if (rec == null || typeof rec.v !== 'number' || !isFinite(rec.v)) continue;
        m.p[f] = rec.v;
        m.prov = m.prov || {};
        m.prov[f] = { tier: rec.tier, src: rec.src, asOf: rec.asOf, observed: true };
        applied++; any = true;
      }
      if (any) touched++;
    });
    OBSERVED_STATUS = { ran: true, applied: applied, markets: touched, manifest: OBS.manifest || null };
    return OBSERVED_STATUS;
  }

  return {
    SOURCES: SOURCES,
    FIELD_PROV: FIELD_PROV,
    applyObserved: applyObserved,
    observedStatus: function () { return OBSERVED_STATUS; },
    ARCHETYPES: ARCHETYPES,
    TIER_LABELS: TIER_LABELS,
    MARKETS: MARKETS,
    M: M,
    AS_OF: '2026-08'
  };
})();
if (typeof module === 'object' && module.exports) module.exports = LCDOS_DATA;

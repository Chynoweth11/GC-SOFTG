/* ============================================================================
 * store.js — application state, derived rankings, signals and alerts.
 * ==========================================================================*/
var STORE = (function (DATA, MODEL, SC, PIPE, U) {
  'use strict';

  var listeners = [];
  function sub(fn) { listeners.push(fn); }
  function emit(what) { listeners.forEach(function (f) { f(what); }); }

  var S = {
    view: 'terminal',
    selected: null,
    compare: [],
    hover: null,

    /* map */
    layer: 'lcdos',
    mapZoom: { k: 1, x: 0, y: 0 },
    drill: { level: 'nation', state: null, county: null },
    showCounties: false,
    showLabels: true,
    labelTop: 22,


    /* scenario */
    scenario: {},
    scenarioOn: false,

    /* company profile for the expansion simulator */
    company: {
      capital: 500000, employees: 5, minProject: 2000000, maxProject: 8000000,
      luxPct: 70, remodelPct: 20, commPct: 10, targetRevenue: 20000000, targetMargin: 16,
      relocate: true, riskAppetite: 55
    },

    /* developer pro-forma */
    deal: {
      acres: 20, landCost: 8000000, lots: 30, avgHome: 4000000, buildCost: 2200000,
      infra: 10000000, softPct: 8, sellPct: 5, years: 5, absorb: 8, debtPct: 60, rate: 8.5,
      market: 'heber-wasatch'
    },

    sortKey: 'lcdos', sortDir: -1
  };

  /* ------------------------------------------------------- evaluation cache */
  var EV = {}, CONF = {}, HIST = {};

  function scenarioActive() {
    if (!S.scenarioOn) return null;
    var any = false;
    for (var k in S.scenario) if (S.scenario[k]) { any = true; break; }
    return any ? S.scenario : null;
  }

  function recompute() {
    var sc = scenarioActive();
    EV = {}; CONF = {}; HIST = {};
    DATA.MARKETS.forEach(function (m) {
      var e = SC.evaluate(m, { scenario: sc });
      EV[m.id] = e;
      CONF[m.id] = SC.confidence(m, DATA.FIELD_PROV, e);
      HIST[m.id] = SC.history(e, 2021, 2031, 2026);
    });
    buildDerived();
  }

  /* ------------------------------------------------------------- derived */
  var DER = { ranked: [], byId: {}, pctl: {}, alerts: [], signals: {} };

  var PCTL_KEYS = ['lcdos', 'gce', 'dev', 'cls', 'flu', 'gap', 'momentum', 'risk', 'demandIdx', 'capacityIdx'];

  function buildDerived() {
    var rows = DATA.MARKETS.map(function (m) {
      var e = EV[m.id], c = CONF[m.id];
      return {
        id: m.id, m: m, e: e, conf: c,
        lcdos: e.lcdos, gce: e.gce, dev: e.dev, cls: e.cls, flu: e.flu, gap: e.gap,
        momentum: e.momentum, momentumRate: e.momentumRate, risk: e.risk,
        f5: e.f5, f10: e.f10, f20: e.f20,
        demandIdx: e.demandIdx, capacityIdx: e.capacityIdx, entryAlert: e.entryAlert,
        confidence: c.score
      };
    });
    rows.sort(function (a, b) { return b.lcdos - a.lcdos; });
    rows.forEach(function (r, i) { r.rank = i + 1; });

    DER.ranked = rows;
    DER.byId = {};
    rows.forEach(function (r) { DER.byId[r.id] = r; });

    /* percentile lookups for every headline metric */
    DER.pctl = {};
    PCTL_KEYS.forEach(function (k) {
      var sorted = rows.map(function (r) { return r[k]; }).sort(function (a, b) { return a - b; });
      DER.pctl[k] = sorted;
    });

    /* per-market ranks on the secondary scores */
    ['gce', 'dev', 'gap', 'momentum'].forEach(function (k) {
      var s = rows.slice().sort(function (a, b) { return b[k] - a[k]; });
      s.forEach(function (r, i) { r['rank_' + k] = i + 1; });
    });

    buildSignals();
  }

  function pctlOf(key, v) { return U.pctRank(DER.pctl[key] || [], v); }

  /* ============================== SIGNALS ==============================
   * The Emerging Market Radar. Each rule is a stated, testable condition on
   * the underlying data - not a model output - so a flag can always be traced
   * to the number that raised it.
   * ==================================================================== */
  var RULES = [
    { id: 'entry', label: 'Possible GC supply shortage', sev: 3, kind: 'opportunity',
      test: function (r) { return r.e.entryAlert; },
      why: function (r) { return 'Demand index ' + U.n0(r.demandIdx) + ' against contractor capacity ' + U.n0(r.capacityIdx) +
        ' — backlog ' + U.n1(r.m.p.backlog) + ' months with ' + r.m.p.luxGcCount + ' established luxury GCs.'; } },
    { id: 'permits', label: 'Construction demand accelerating', sev: 3, kind: 'opportunity',
      test: function (r) { return r.m.p.permitCagr3 >= 5.5; },
      why: function (r) { return 'Single-family permits compounding at ' + U.pctS(r.m.p.permitCagr3) + ' a year over three years.'; } },
    { id: 'wealth', label: 'Millionaire migration accelerating', sev: 3, kind: 'opportunity',
      test: function (r) { return r.m.p.hnwiG10 >= 140 || r.m.p.agiIn >= 85000; },
      why: function (r) { return 'Resident millionaires up ' + U.pct(r.m.p.hnwiG10, 0) + ' over ten years; net AGI inflow ' +
        U.usdFull(r.m.p.agiIn) + ' per return.'; } },
    { id: 'lux', label: 'Luxury home values accelerating', sev: 2, kind: 'opportunity',
      test: function (r) { return r.m.p.apprec5 >= 70; },
      why: function (r) { return 'Five-year appreciation of ' + U.pct(r.m.p.apprec5, 0) + ' (' + U.pctS(r.e.derived.apprecAnnual) + ' a year).'; } },
    { id: 'majordev', label: 'Major development announced', sev: 3, kind: 'opportunity',
      test: function (r) { return r.e.derived.pipelinePerCap >= 14000; },
      why: function (r) { return U.usdM(r.m.p.pipelineM) + ' of announced pipeline — ' + U.usdFull(r.e.derived.pipelinePerCap) + ' per resident.'; } },
    { id: 'resort', label: 'New resort or hospitality development', sev: 2, kind: 'opportunity',
      test: function (r) { return r.m.p.commercialM / r.m.p.pop * 1e6 >= 7000 && r.m.p.luxRooms >= 200; },
      why: function (r) { return U.usdM(r.m.p.commercialM) + ' of commercial and hospitality pipeline against ' + U.n0(r.m.p.luxRooms) + ' existing luxury rooms.'; } },
    { id: 'aviation', label: 'Private aviation growth', sev: 2, kind: 'opportunity',
      test: function (r) { return r.m.p.jetOps >= 28 || r.m.p.airInvestM >= 200; },
      why: function (r) { return U.n0(r.m.p.jetOps) + 'k general-aviation jet operations a year; ' + U.usdM(r.m.p.airInvestM) + ' committed airport capital.'; } },
    { id: 'land', label: 'Land development opportunity detected', sev: 3, kind: 'opportunity',
      test: function (r) { return r.dev >= 60 && r.m.p.landIdx >= 58 && r.m.p.entMonths <= 18; },
      why: function (r) { return 'Developer score ' + U.n0(r.dev) + ' with land availability ' + r.m.p.landIdx + '/100 and a ' + r.m.p.entMonths + '-month entitlement path.'; } },
    { id: 'emerging', label: 'Emerging luxury market detected', sev: 3, kind: 'opportunity',
      test: function (r) { return r.gap >= 64 && r.cls < 62 && r.momentum >= 52; },
      why: function (r) { return 'Opportunity gap ' + U.n0(r.gap) + ': future upside ' + U.n0(r.flu) + ' running well ahead of current luxury maturity ' + U.n0(r.cls) + '.'; } },
    { id: 'momentum', label: 'Momentum breakout', sev: 3, kind: 'opportunity',
      test: function (r) { return r.momentum >= 68; },
      why: function (r) { return 'Momentum index ' + U.n0(r.momentum) + ' — fundamentals improving at a blended ' + U.pctS(r.momentumRate) + ' a year.'; } },
    { id: 'landbuy', label: 'Major land acquisition environment', sev: 2, kind: 'opportunity',
      test: function (r) { return r.m.p.landShare <= 24 && r.e.derived.specMarginPct >= 14; },
      why: function (r) { return 'Land is only ' + r.m.p.landShare + '% of finished value and gross spec margin models at ' + U.pct(r.e.derived.specMarginPct) + '.'; } },
    { id: 'shortage', label: 'Severe housing shortage', sev: 2, kind: 'opportunity',
      test: function (r) { return r.m.p.shortageIdx >= 84; },
      why: function (r) { return 'Housing shortage severity ' + r.m.p.shortageIdx + '/100.'; } },

    /* ---- risk flags ---- */
    { id: 'insurance', label: 'Insurance market stress', sev: 3, kind: 'risk',
      test: function (r) { return r.m.p.insIdx >= 78; },
      why: function (r) { return 'Insurance stress ' + r.m.p.insIdx + '/100. Premium and availability are now a material line in every pro-forma here.'; } },
    { id: 'water', label: 'Water constraint', sev: 3, kind: 'risk',
      test: function (r) { return r.m.p.waterIdx <= 36; },
      why: function (r) { return 'Water and utility headroom ' + r.m.p.waterIdx + '/100 — the most common reason entitlements fail in this market.'; } },
    { id: 'entitlement', label: 'Entitlement risk', sev: 2, kind: 'risk',
      test: function (r) { return r.m.p.entMonths >= 28 || r.m.p.regIdx >= 80; },
      why: function (r) { return r.m.p.entMonths + ' months to entitle a subdivision; regulatory burden ' + r.m.p.regIdx + '/100.'; } },
    { id: 'landout', label: 'Land exhaustion', sev: 2, kind: 'risk',
      test: function (r) { return r.m.p.landIdx <= 20; },
      why: function (r) { return 'Developable land availability ' + r.m.p.landIdx + '/100 with ' + U.n0(r.m.p.entitledLots) + ' entitled lots remaining.'; } },
    { id: 'climate', label: 'Elevated physical risk', sev: 2, kind: 'risk',
      test: function (r) { return r.m.p.climIdx >= 74; },
      why: function (r) { return 'Physical climate risk ' + r.m.p.climIdx + '/100.'; } },
    { id: 'trades', label: 'Trade base too thin to scale', sev: 2, kind: 'risk',
      test: function (r) { return r.m.p.tradeIdx <= 30; },
      why: function (r) { return 'Subcontractor availability ' + r.m.p.tradeIdx + '/100 — a hard ceiling on concurrent projects.'; } },
    { id: 'saturated', label: 'Contractor market saturated', sev: 2, kind: 'risk',
      test: function (r) { return r.e.derived.startsPerIncumbent <= 3 && r.m.p.luxGcCount >= 25; },
      why: function (r) { return U.n1(r.e.derived.startsPerIncumbent) + ' luxury starts per established GC across ' + r.m.p.luxGcCount + ' incumbents.'; } },
    { id: 'lowconf', label: 'Low data confidence', sev: 1, kind: 'risk',
      test: function (r) { return r.confidence < 36; },
      why: function (r) { return 'Data confidence ' + r.confidence + '/100 (' + U.confBand(r.confidence).label + '). Treat every figure here as a hypothesis.'; } },
    { id: 'spec', label: 'Spec economics do not clear', sev: 2, kind: 'risk',
      test: function (r) { return r.e.derived.specMarginPct < 8; },
      why: function (r) { return 'Modelled gross spec margin ' + U.pct(r.e.derived.specMarginPct) + ' — below the level that compensates for the risk.'; } }
  ];

  function buildSignals() {
    DER.signals = {};
    DER.alerts = [];
    DER.ranked.forEach(function (r) {
      var hits = [];
      RULES.forEach(function (rule) {
        var ok = false;
        try { ok = rule.test(r); } catch (e) { ok = false; }
        if (ok) {
          var sig = { id: rule.id, label: rule.label, sev: rule.sev, kind: rule.kind, why: rule.why(r) };
          hits.push(sig);
          DER.alerts.push({ market: r.id, name: r.m.name, state: r.m.state, rank: r.rank, sig: sig, score: r.lcdos });
        }
      });
      DER.signals[r.id] = hits;
    });
    DER.alerts.sort(function (a, b) {
      if (b.sig.sev !== a.sig.sev) return b.sig.sev - a.sig.sev;
      return b.score - a.score;
    });
  }

  /* --------------------------------------------------------------- filters */
  var filtersReady = false;
  function ensureFilters() {
    if (filtersReady || typeof FILTERS === 'undefined') return;
    FILTERS.init(DER.ranked, API);
    filtersReady = true;
  }
  function passes(r) {
    if (typeof FILTERS === 'undefined') return true;
    ensureFilters();
    return FILTERS.match(r, API);
  }
  function filtered() { ensureFilters(); return DER.ranked.filter(passes); }

  /* ------------------------------------------------------------- accessors */
  function get(id) { return DER.byId[id]; }
  function market(id) { return DER.byId[id] ? DER.byId[id].m : null; }
  function hist(id) { return HIST[id]; }
  function projects(id) { return PIPE.BY_MARKET[id] || []; }

  function set(patch, what) {
    for (var k in patch) S[k] = patch[k];
    emit(what || 'state');
  }
  function setScenario(id, v) {
    S.scenario[id] = v;
    S.scenarioOn = true;
    recompute(); emit('scenario');
  }
  function resetScenario() {
    S.scenario = {}; S.scenarioOn = false;
    recompute(); emit('scenario');
  }

  function selectMarket(id) { S.selected = id; emit('select'); }
  function toggleCompare(id) {
    var i = S.compare.indexOf(id);
    if (i >= 0) S.compare.splice(i, 1);
    else if (S.compare.length < 10) S.compare.push(id);
    emit('compare');
  }

  var API = {
    S: S, DER: DER, RULES: RULES,
    DATA: DATA, MODEL: MODEL, PIPE: PIPE,
    ev: function (id) { return EV[id]; },
    conf: function (id) { return CONF[id]; },
    hist: hist, projects: projects,
    get: get, market: market,
    observed: function () { return DATA.observedStatus(); },
    filtered: filtered, passes: passes,
    pctlOf: pctlOf,
    recompute: recompute, set: set, sub: sub, emit: emit,
    setScenario: setScenario, resetScenario: resetScenario,
    selectMarket: selectMarket, toggleCompare: toggleCompare
  };

  /* Merge any observed data before the first evaluation. */
  if (typeof LCDOS_OBSERVED !== 'undefined') DATA.applyObserved(LCDOS_OBSERVED);

  recompute();

  return API;
})(LCDOS_DATA, LCDOS_MODEL, LCDOS_SCORING, LCDOS_PIPELINE, U);

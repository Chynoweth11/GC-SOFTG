/* ============================================================================
 * views/method.js — Methodology, formula inspector, data dictionary,
 * provenance audit and the ingest roadmap.
 * ==========================================================================*/
var V_METHOD = (function (ST, U, CH) {
  'use strict';
  var body = null, tab = 'model';

  /* Public endpoints that should replace each estimated field before the model
   * is used to commit capital. This is the honest path from v1.0 to production. */
  var INGEST = [
    { field: 'sfPermits, permitCagr3', now: 'reported', target: 'verified',
      src: 'Census Building Permits Survey', how: 'https://api.census.gov/data/timeseries/eits/bps — county-level annual series, no key required for low volume.' },
    { field: 'pop, popCagr5, netMig, hh', now: 'reported', target: 'verified',
      src: 'Census PEP + ACS', how: 'https://api.census.gov/data/2024/acs/acs5 and .../pep/population — county components of change.' },
    { field: 'agiIn', now: 'reported', target: 'verified',
      src: 'IRS SOI county-to-county migration', how: 'https://www.irs.gov/statistics/soi-tax-stats-migration-data — annual flat files; ~2-year lag.' },
    { field: 'empCagr5', now: 'reported', target: 'verified',
      src: 'BLS QCEW', how: 'https://data.bls.gov/cew/data/api — county employment and wages by quarter.' },
    { field: 'bizFormIdx', now: 'estimated', target: 'verified',
      src: 'Census Business Formation Statistics', how: 'https://www.census.gov/econ/bfs — county-level business applications.' },
    { field: 'medVal, apprec5', now: 'reported', target: 'verified',
      src: 'Zillow ZHVI / FHFA HPI', how: 'Zillow Research county CSVs; FHFA all-transactions index for cross-check.' },
    { field: 'luxPpsf, dom, cashShare, tx2m, tx5m, tx10m', now: 'estimated', target: 'reported',
      src: 'Local MLS / RPR / brokerage feeds', how: 'Requires per-market MLS data licences. Highest-value replacement in the entire dataset — these fields drive four of the ten categories.' },
    { field: 'jetOps', now: 'reported', target: 'verified',
      src: 'FAA ATADS / TFMSC', how: 'https://aspm.faa.gov/opsnet/sys/Airport.asp — tower counts; TFMSC for GA itinerant operations by aircraft class.' },
    { field: 'nonstops', now: 'verified', target: 'verified',
      src: 'BTS T-100 / published schedules', how: 'https://www.transtats.bts.gov — segment data by origin airport.' },
    { field: 'climIdx', now: 'estimated', target: 'verified',
      src: 'FEMA National Risk Index', how: 'https://hazards.fema.gov/nri/data-resources — county composite risk scores.' },
    { field: 'propTax, incomeTax', now: 'reported / verified', target: 'verified',
      src: 'Tax Foundation / state DOR', how: 'Annual state and local tax burden tables; county effective rates from assessor rolls.' },
    { field: 'pipelineM, commercialM, infraM, entitledLots', now: 'estimated', target: 'reported',
      src: 'County & municipal planning departments', how: 'Active development-application registers, CIP budgets and approved-but-unbuilt lot inventories. Manual per-market collection; no national feed exists.' },
    { field: 'luxGcCount, tradeIdx, backlog, costPsf', now: 'estimated', target: 'reported',
      src: 'State contractor licence boards + ABC backlog + RSMeans', how: 'Licence registries give the contractor count; ABC CBI gives regional backlog; RSMeans city cost indices give cost per square foot.' },
    { field: 'visitorsM, visitSpendM', now: 'reported', target: 'verified',
      src: 'State tourism offices / NPS visitation', how: 'Annual DMO economic-impact studies; NPS IRMA portal for park visitation.' },
    { field: 'luxRooms, adr, occ', now: 'estimated', target: 'reported',
      src: 'STR / CoStar hospitality', how: 'Subscription market reports by submarket.' },
    { field: 'hnwiPer1k, hnwiG10, uhnwIdx', now: 'estimated', target: 'reported',
      src: 'Henley & Partners / Wealth-X / IRS SOI high-AGI counts', how: 'Henley city-level counts for large metros; IRS SOI returns above $1M AGI as a county-level proxy elsewhere.' },
    { field: 'All rubric fields', now: 'rubric', target: 'rubric',
      src: 'LCDOS analyst panel', how: 'These stay judgement-based by design. What should change is governance: two independent scorers per market with a documented reconciliation, which converts a single opinion into a reproducible measurement.' }
  ];

  function modelTab() {
    return '<div class="callout"><b>Nothing in this system asserts a market\'s score.</b>' +
      '<p style="margin:5px 0 0;font-size:12.5px">Every score is computed from primitive quantities by an explicit transform. ' +
      'The source text of every transform is printed below. Any number on screen can be traced to the primitives it consumed, ' +
      'the formula that combined them, and the provenance tier of each input.</p></div>' +

      '<h2>Weighted categories</h2>' +
      '<div class="panel mb16"><div class="pad">' +
      CH.hbars(ST.MODEL.CATEGORIES.map(function (c) {
        return { label: c.key + ' · ' + c.label, v: c.weight, display: c.weight + '%', color: '#3fd9ad' };
      }), { width: 700, labelW: 300, valW: 50, rowH: 24, max: 20 }) + '</div></div>' +

      ST.MODEL.CATEGORIES.map(function (c) {
        return '<div class="panel" style="margin-bottom:10px"><header>' +
          '<h3>' + c.key + ' · ' + U.esc(c.label) + '</h3><span class="pill">weight ' + c.weight + '%</span></header>' +
          '<div class="pad"><p class="dim" style="font-size:12.5px;margin:0 0 10px;line-height:1.6">' + U.esc(c.blurb) + '</p>' +
          '<table class="grid"><thead><tr><th class="l">Indicator</th><th>Weight in category</th><th class="l">Transform</th></tr></thead><tbody>' +
          c.indicators.map(function (i) {
            var src = i.fn ? i.fn.toString().replace(/^function\s*\([^)]*\)\s*\{\s*return\s*/, '').replace(/;\s*\}$/, '') : '(derived — see Derived scores)';
            return '<tr style="cursor:default"><td class="l"><b style="font-weight:520;font-size:12.5px">' + U.esc(i.label) + '</b>' +
              '<div class="dim2" style="font-size:11.5px;line-height:1.5;margin-top:3px">' + U.esc(i.why) + '</div></td>' +
              '<td>' + i.w + '%</td>' +
              '<td class="l"><code style="font-family:var(--mono);font-size:10.5px;color:var(--violet);word-break:break-word">' +
              U.esc(src) + '</code></td></tr>';
          }).join('') + '</tbody></table></div></div>';
      }).join('');
  }

  function derivedTab() {
    var D = ST.MODEL.DERIVED;
    var fns = ['luxShareOfCustom', 'newBuildShareOfLux', 'luxStartsSupply', 'luxStartsDemand', 'luxStarts',
      'luxStartsDispersion', 'luxStartsVolumeM', 'startsPerIncumbent', 'specMarginPct', 'lotRunwayYears',
      'avgProjectValueM', 'apprecAnnual', 'hnwiAnnual', 'pipelinePerCap', 'permitsPer1kHH'];

    return '<h2>Modelled intermediates</h2>' +
      '<p class="dim" style="font-size:12.5px;max-width:80ch;line-height:1.6">Quantities that are not observed directly but derived from ' +
      'primitives by a stated heuristic. Everywhere one of these surfaces in the product it is labelled <span class="prov modelled">modelled</span>.</p>' +
      '<div class="panel mb16"><div class="pad">' +
      fns.map(function (k) {
        if (typeof D[k] !== 'function') return '';
        return '<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--line)">' +
          '<b class="mono" style="color:var(--teal);font-size:12px">' + U.esc(k) + '</b>' +
          '<pre style="margin:5px 0 0;font-family:var(--mono);font-size:11px;color:var(--ink-2);white-space:pre-wrap;line-height:1.55">' +
          U.esc(D[k].toString()) + '</pre></div>';
      }).join('') + '</div></div>' +

      '<h2>Derived scores</h2>' +
      '<div class="gridcards g2">' +
      card('Current Luxury Strength (CLS)',
        'Level indicators only — no rates of change. 34% luxury market levels (median value, $/sf, $2M/$5M/$10M transaction counts, lot pricing), ' +
        '34% prestige (recognition, clubs, celebrity, hospitality, retail, privacy), 18% wealth levels (density, UHNW presence, second homes), ' +
        '14% luxury lodging depth and ultra-luxury construction depth.') +
      card('Future Luxury Upside (FLU)',
        '24% development pipeline, 20% wealth-migration change (millionaire growth, net AGI inflow, second-home formation), 18% growth and ' +
        'demographics, 22% land and developer opportunity, 16% long-term future potential.') +
      card('Opportunity Gap',
        'clamp(50 + (FLU − CLS) × 1.15, 0, 100). Centred at 50. Above 50 means demand is forming faster than the market\'s existing luxury ' +
        'infrastructure and builder base can serve it. Below 50 means the market is already mature relative to its remaining runway.') +
      card('Momentum Index',
        'A rate-of-change composite: permit growth 22%, millionaire growth 18%, population growth 16%, price appreciation 14%, pipeline ' +
        'formation 12%, visitation growth 10%, employment growth 8%. Also reported as a blended annual rate of fundamental improvement, ' +
        'which is what makes "score 74, momentum +19%" legible.') +
      card('GC Entry Opportunity Score',
        'Addressable luxury volume 20%, demand growth and pipeline 14%, competitive whitespace 16%, capacity shortfall 14%, client wealth ' +
        'and ticket size 12%, trade availability 10%, permitting friction 8%, relationship barrier 6%. Competitive whitespace is measured as ' +
        'annual luxury construction dollars per established luxury GC.') +
      card('Developer Opportunity Score',
        'Land availability and runway 18%, entitlement feasibility 14%, growth and wealth demand 16%, value-creation spread 14%, housing ' +
        'shortage 12%, infrastructure and water 10%, spec and subdivision economics 10%, investor and capital demand 6%.') +
      card('Forecast horizons',
        '5-year = 55% momentum + 25% pipeline + 20% structural alignment — over five years, what is already funded dominates. ' +
        '10-year = 35% momentum + 25% land runway + 25% structural + 15% wealth growth. ' +
        '20-year = 30% structural + 30% land runway + 20% momentum + 20% inverted long-run risk — over twenty years, climate, water, ' +
        'insurance and land exhaustion dominate everything else.') +
      card('Long-run risk',
        'Climate and physical risk 30%, insurance stress 22%, regulatory burden 20%, water scarcity 16%, economic concentration 12% ' +
        '(small single-industry markets are fragile, scored on inverted log population).') +
      card('Data Confidence Score',
        '60% provenance-weighted tier score (verified 100, reported 86, modelled 62, rubric 52, estimated 46), 22% externally cited figures ' +
        '(13 points each, capped), 18% source recency. Then reduced by up to 12 points where the two independent luxury-starts estimators ' +
        'disagree — an internal-consistency check on the market\'s own data.') +
      card('Score history',
        'The dataset holds one observation date. Prior years are reconstructed by unwinding momentum-implied drift with 0.94 annual damping; ' +
        'forward years project the drift with 0.87 decay, a saturation term as the score approaches the practical ceiling, and a land-runway ' +
        'constraint that decelerates markets running out of developable ground. Both are model output, not measurement, and are labelled as such.') +
      '</div>';
  }

  function card(t, d) {
    return '<div class="panel"><header><h3>' + U.esc(t) + '</h3></header><div class="pad">' +
      '<p class="dim" style="font-size:12.5px;margin:0;line-height:1.62">' + U.esc(d) + '</p></div></div>';
  }

  function qualityTab() {
    var rows = ST.DER.ranked;
    var bands = U.CONF_BANDS.map(function (b) {
      return { b: b, n: rows.filter(function (r) { return U.confBand(r.confidence).label === b.label; }).length };
    });
    var tierTotals = {};
    rows.forEach(function (r) {
      var c = r.conf;
      for (var t in c.counts) tierTotals[t] = (tierTotals[t] || 0) + c.counts[t];
    });
    var allFields = U.sum(Object.keys(tierTotals), function (k) { return tierTotals[k]; });

    var confs = rows.map(function (r) { return r.confidence; }).sort(function (a, b) { return a - b; });

    return '<div class="callout red"><b>Read this before using any figure in this system to commit capital.</b>' +
      '<p style="margin:6px 0 0;font-size:12.5px;line-height:1.6">LCDOS v' + ST.MODEL.VERSION + ' ships with an analyst-estimated data layer. ' +
      'Median market confidence is <b>' + U.n0(U.quantile(confs, 0.5)) + ' of 100</b> and the highest in the universe is <b>' +
      U.n0(confs[confs.length - 1]) + '</b>. <b>No market currently reaches underwriting grade.</b> The model is built to rank and shortlist ' +
      'markets against one another, and it does that reliably because the estimates are internally consistent and applied uniformly. ' +
      'It is not built to underwrite a specific transaction. The ingest roadmap below names the public endpoint that should replace each ' +
      'estimated field.</p></div>' +

      '<div class="gridcards g4 mt16 mb16">' +
      '<div class="kpi"><div class="k">Markets</div><div class="v">' + rows.length + '</div><div class="s">across 10 weighted categories</div></div>' +
      '<div class="kpi"><div class="k">Input fields scored</div><div class="v">' + U.n0(allFields) + '</div><div class="s">70 primitives × ' + rows.length + ' markets</div></div>' +
      '<div class="kpi"><div class="k">Median confidence</div><div class="v" style="color:' + U.confBand(U.quantile(confs, 0.5)).color + '">' +
      U.n0(U.quantile(confs, 0.5)) + '</div><div class="s">screening grade</div></div>' +
      '<div class="kpi"><div class="k">Externally cited figures</div><div class="v">' +
      U.sum(rows, function (r) { return (r.m.anchors || []).length; }) + '</div><div class="s">with source and date</div></div>' +
      '</div>' +

      '<div class="gridcards g2 mb16">' +
      '<div class="panel"><header><h3>Confidence bands</h3></header><div class="pad">' +
      bands.map(function (x) {
        return '<div style="margin-bottom:11px"><div class="flex between center" style="margin-bottom:3px">' +
          '<b style="color:' + x.b.color + ';font-size:12.5px">' + U.esc(x.b.label) + '</b>' +
          '<span class="mono dim">' + x.n + ' markets · ' + U.pct(x.n / rows.length * 100, 0) + '</span></div>' +
          U.bar(x.n / rows.length * 100, x.b.color) +
          '<p class="dim2" style="font-size:11px;margin:4px 0 0;line-height:1.45">' + U.esc(x.b.desc) + '</p></div>';
      }).join('') + '</div></div>' +
      '<div class="panel"><header><h3>Provenance mix across the whole dataset</h3></header><div class="pad">' +
      Object.keys(ST.MODEL.TIERS).map(function (t) {
        var n = tierTotals[t] || 0;
        var tt = ST.MODEL.TIERS[t];
        return '<div style="margin-bottom:11px"><div class="flex between center" style="margin-bottom:3px">' +
          '<span class="prov ' + t + '" style="margin:0">' + U.esc(tt.label) + ' · weight ' + tt.w + '</span>' +
          '<span class="mono dim">' + U.n0(n) + ' fields · ' + U.pct(n / allFields * 100, 0) + '</span></div>' +
          U.bar(n / allFields * 100, t === 'verified' ? '#3fd9ad' : t === 'reported' ? '#5aa9f5' : t === 'modelled' ? '#a884f3' : t === 'estimated' ? '#f2b544' : '#6c7d94') +
          '<p class="dim2" style="font-size:11px;margin:4px 0 0;line-height:1.45">' + U.esc(tt.desc) + '</p></div>';
      }).join('') + '</div></div></div>' +

      '<div class="panel mb16"><header><h3>Confidence by market</h3>' +
      '<span class="tiny">estimator disagreement is an internal consistency check, not an external one</span></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr><th class="l">Market</th><th>Confidence</th><th>Band</th>' +
      '<th>Tier score</th><th>Cited figures</th><th>Recency</th><th>Estimator ratio</th><th>Penalty</th></tr></thead><tbody>' +
      rows.slice().sort(function (a, b) { return b.confidence - a.confidence; }).map(function (r) {
        var c = r.conf, b = U.confBand(c.score);
        return '<tr data-id="' + r.id + '"><td class="l">' + U.esc(r.m.name) + '</td>' +
          '<td><span class="mono" style="color:' + b.color + '">' + c.score + '</span></td>' +
          '<td class="dim">' + U.esc(b.label) + '</td><td>' + c.tierScore + '</td><td>' + c.anchors + '</td><td>' + c.recency + '</td>' +
          '<td class="' + (c.dispersion > 4 || c.dispersion < 0.25 ? 'down' : '') + '">' + U.n2(c.dispersion) + 'x</td>' +
          '<td class="dim">' + (c.dispersionPenalty ? '−' + U.n1(c.dispersionPenalty) : '—') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +

      '<h2>Ingest roadmap — replacing the estimates</h2>' +
      '<div class="panel"><div class="scrollx"><table class="grid"><thead><tr>' +
      '<th class="l">Field(s)</th><th class="l">Current tier</th><th class="l">Target</th><th class="l">Source</th><th class="l">How</th>' +
      '</tr></thead><tbody>' +
      INGEST.map(function (x) {
        return '<tr style="cursor:default"><td class="l mono" style="font-size:11px;color:var(--teal)">' + U.esc(x.field) + '</td>' +
          '<td class="l"><span class="prov ' + x.now.split(' ')[0] + '" style="margin:0">' + U.esc(x.now) + '</span></td>' +
          '<td class="l"><span class="prov ' + x.target + '" style="margin:0">' + U.esc(x.target) + '</span></td>' +
          '<td class="l" style="font-size:12px">' + U.esc(x.src) + '</td>' +
          '<td class="l dim" style="font-size:11.5px;line-height:1.5">' + U.esc(x.how) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function sourcesTab() {
    var S = ST.DATA.SOURCES;
    var byKind = {};
    Object.keys(S).forEach(function (k) { (byKind[S[k].kind] = byKind[S[k].kind] || []).push([k, S[k]]); });
    var anchors = [];
    ST.DER.ranked.forEach(function (r) {
      (r.m.anchors || []).forEach(function (a) { anchors.push({ m: r.m, a: a }); });
    });
    ST.PIPE.PROJECTS.forEach(function (p) {
      if (p.url) anchors.push({ m: { name: (ST.market(p.market) || {}).name || p.market }, a: { fact: p.name + ' — ' + p.note, src: p.src, date: String(p.start), url: p.url } });
    });

    return '<h2>Source registry</h2>' +
      Object.keys(byKind).map(function (kind) {
        return '<div class="panel" style="margin-bottom:10px"><header><h3>' + U.esc(kind) + '</h3></header>' +
          '<table class="grid"><tbody>' + byKind[kind].map(function (x) {
            return '<tr style="cursor:default"><td class="l mono" style="width:170px;color:var(--teal);font-size:11px">' + U.esc(x[0]) + '</td>' +
              '<td class="l">' + U.esc(x[1].name) + (x[1].url ? ' · <a href="' + U.esc(x[1].url) + '" target="_blank" rel="noopener">link</a>' : '') + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      }).join('') +

      '<h2>Every externally verified figure in the dataset <span class="dim2">' + anchors.length + '</span></h2>' +
      '<p class="dim" style="font-size:12.5px;max-width:80ch;line-height:1.6">These are the figures that were checked against a named public ' +
      'source during research. They are what raise a market\'s Data Confidence Score above the floor. Everything not listed here is either a ' +
      'reported statistic carried at its default provenance tier or an analyst estimate.</p>' +
      anchors.map(function (x) {
        return '<div class="anchor"><div class="f"><b style="color:var(--ink)">' + U.esc(x.m.name) + '</b> — ' + U.esc(x.a.fact) + '</div>' +
          '<div class="s">' + U.esc(x.a.src) + ' · ' + U.esc(x.a.date) +
          (x.a.url ? ' · <a href="' + U.esc(x.a.url) + '" target="_blank" rel="noopener">source</a>' : '') + '</div></div>';
      }).join('');
  }

  function simTab() {
    return '<h2>Expansion simulator — company fit model</h2>' +
      '<div class="panel mb16"><div class="pad">' +
      '<p class="dim" style="font-size:12.5px;line-height:1.62;max-width:82ch">The fit model asks a different question from LCDOS. ' +
      'LCDOS asks how good a market is. Fit asks whether <em>this specific company</em>, with this capital, this headcount and this target ' +
      'project size, can build the revenue it wants there. A market can score 70 on LCDOS and 40 on fit because its average project is ' +
      '$12M and the company is capitalised for $3M jobs.</p>' +
      '<pre style="margin:12px 0 0;font-family:var(--mono);font-size:11px;color:var(--ink-2);white-space:pre-wrap;line-height:1.6">' +
      U.esc(V_SIM.fit.toString()) + '</pre></div></div>' +

      '<h2>Developer pro-forma</h2>' +
      '<div class="panel"><div class="pad">' +
      '<p class="dim" style="font-size:12.5px;line-height:1.62;max-width:82ch">An annual cash-flow model. Land closes in year 0; ' +
      'infrastructure is spent 60/40 across years 0 and 1; soft costs follow the horizontal spend. Homes are delivered at the absorption ' +
      'rate, each carrying its construction cost and its net sale proceeds in the same year. Horizontal debt is drawn against land and ' +
      'infrastructure and amortises as lots are released; vertical construction financing is drawn and repaid inside each year, so only its ' +
      'carry cost reaches the cash flow. IRR is solved on the equity column by bisection.</p>' +
      '<pre style="margin:12px 0 0;font-family:var(--mono);font-size:11px;color:var(--ink-2);white-space:pre-wrap;line-height:1.6">' +
      U.esc(V_SIM.proforma.toString()) + '</pre></div></div>';
  }

  var TABS = [
    { id: 'model', l: 'Scoring model' },
    { id: 'derived', l: 'Derived scores' },
    { id: 'quality', l: 'Data quality & ingest roadmap' },
    { id: 'sim', l: 'Simulator models' },
    { id: 'sources', l: 'Sources & citations' }
  ];

  function render(root) {
    body = root;
    var content = tab === 'model' ? modelTab() : tab === 'derived' ? derivedTab() :
      tab === 'quality' ? qualityTab() : tab === 'sim' ? simTab() : sourcesTab();
    body.innerHTML = '<div class="stage"><div class="scrollstage"><div class="profile" style="max-width:1400px">' +
      '<div class="tiny">LCDOS v' + ST.MODEL.VERSION + ' · data as of ' + ST.DATA.AS_OF + '</div>' +
      '<h1>Methodology</h1>' +
      '<p class="lede">The Luxury Construction &amp; Development Opportunity Score is a weighted composite of ten categories and ' +
      ST.MODEL.CATEGORIES.reduce(function (a, c) { return a + c.indicators.length; }, 0) +
      ' indicators, computed from 70 primitive quantities per market. This module prints the entire model — every weight, every formula, ' +
      'every source, and an honest account of what the data can and cannot support.</p>' +
      '<div class="flex gap6 mb16" style="flex-wrap:wrap;border-bottom:1px solid var(--line-2);padding-bottom:10px">' +
      TABS.map(function (t) {
        return '<button class="chip' + (tab === t.id ? ' on' : '') + '" data-mt="' + t.id + '">' + U.esc(t.l) + '</button>';
      }).join('') + '</div>' + content + '</div></div></div>';
    U.on(body, 'click', '[data-mt]', function (e, t) { tab = t.dataset.mt; render(body); });
    U.on(body, 'click', 'tr[data-id]', function (e, t) { ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view'); });
  }

  return { render: render, onEvent: function () {} };
})(STORE, U, CH);

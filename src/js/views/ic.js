/* ============================================================================
 * views/ic.js — Investment Committee view.
 * Generates a presentation-quality thesis for a single market, composed from
 * the model output rather than from prose stored in advance, so it stays
 * consistent with whatever scenario is currently loaded.
 * ==========================================================================*/
var V_IC = (function (ST, U, CH) {
  'use strict';
  var body = null;

  function rankWord(n, total) {
    if (n <= 3) return 'the ' + U.ordinal(n) + '-ranked market in the universe';
    if (n <= 10) return 'a top-ten market';
    if (n <= 25) return 'a top-quartile market';
    return 'ranked ' + n + ' of ' + total;
  }

  function whyMarket(r) {
    var e = r.e, p = r.m.p, out = [];
    out.push('<b>' + U.esc(r.m.name) + '</b> scores <b>' + U.n1(e.lcdos) + ' of 100</b> on the LCDOS model, making it ' +
      rankWord(r.rank, ST.DER.ranked.length) + '. It is a ' + U.esc(ST.DATA.ARCHETYPES[r.m.archetype].label.toLowerCase()) +
      ' classified as ' + U.esc(ST.DATA.TIER_LABELS[r.m.tier].toLowerCase()) + '.');
    var top = e.catRows.slice().sort(function (a, b) { return b.v - a.v; }).slice(0, 3);
    out.push('The score is carried by ' + top.map(function (c) { return '<b>' + U.esc(c.label.toLowerCase()) + '</b> (' + U.n0(c.v) + ')'; }).join(', ') +
      '. Its weakest category is <b>' + U.esc(e.catRows.slice().sort(function (a, b) { return a.v - b.v; })[0].label.toLowerCase()) +
      '</b>, and the case has to survive that.');
    return out;
  }

  function whyNow(r) {
    var e = r.e, p = r.m.p, out = [];
    out.push('Momentum stands at <b>' + U.n0(e.momentum) + '</b> — fundamentals improving at a blended <b>' + U.pctS(e.momentumRate) +
      ' a year</b>, against a universe median of ' + U.n0(U.quantile(ST.DER.pctl.momentum, 0.5)) + '. ' +
      'Permits are compounding at ' + U.pctS(p.permitCagr3) + ' over three years, resident millionaires are up ' +
      U.pct(p.hnwiG10, 0) + ' over ten, and net AGI inflow runs at ' + U.usdFull(p.agiIn) + ' per return.');
    out.push('The opportunity gap — future upside minus current maturity — is <b>' + U.n1(e.gap) + '</b> ' +
      (e.gap >= 62 ? 'which is the signature of a market where demand is forming faster than the luxury infrastructure and builder base can serve it. That window is the reason to move now rather than later.'
        : e.gap >= 45 ? 'which is broadly balanced: the market is being priced roughly in line with what it is becoming.'
        : 'which means the market is already mature relative to its remaining runway. The case here is about access and margin, not about being early.'));
    var pl = U.usdM(p.pipelineM);
    out.push('There is <b>' + pl + '</b> of announced five-year development pipeline — ' + U.usdFull(e.derived.pipelinePerCap) +
      ' per resident — plus ' + U.usdM(p.infraM) + ' of committed public infrastructure and ' + U.usdM(p.airInvestM) + ' of airport capital.');
    return out;
  }

  function whyConstruction(r) {
    var e = r.e, p = r.m.p, out = [];
    out.push('The addressable market is <b>' + U.n0(e.derived.luxStarts) + ' new homes a year above $2M</b>, worth roughly <b>' +
      U.usdM(e.derived.luxStartsVolumeM) + '</b> in annual construction value, against <b>' + p.luxGcCount +
      ' established luxury general contractors</b>. That is ' + U.n1(e.derived.startsPerIncumbent) + ' starts per incumbent' +
      (e.derived.startsPerIncumbent >= 8 ? ' — every capable builder in the market is full, and clients are waiting.'
        : e.derived.startsPerIncumbent >= 5 ? ' — incumbents are busy but not overwhelmed.'
        : ' — the incumbent bench is deep relative to the work, so entry has to be won on differentiation rather than availability.'));
    out.push('Contractor backlog is <b>' + U.n1(p.backlog) + ' months</b> and subcontractor availability scores ' + p.tradeIdx +
      ' of 100. Typical luxury construction cost is <b>$' + U.n0(p.costPsf) + ' per square foot</b>, and an average luxury project runs <b>' +
      U.usdM(e.derived.avgProjectValueM) + '</b> — so a $20M revenue book is roughly ' +
      U.n1(20 / e.derived.avgProjectValueM) + ' concurrent jobs, not dozens.');
    out.push('High-end remodel intensity scores ' + p.remodelIdx + ' of 100. ' +
      (p.remodelIdx >= 65 ? 'That matters more than it looks: remodels are how a new firm builds a reference book without land, entitlements or a construction loan.'
        : 'The remodel market here is thinner than the new-build market, so the entry path runs through new construction and therefore through relationships with landowners and architects.'));
    return out;
  }

  function whyLuxury(r) {
    var p = r.m.p, e = r.e, out = [];
    out.push('The market clears <b>' + U.n0(p.tx2m) + ' transactions above $2M</b> a year, <b>' + U.n0(p.tx5m) + ' above $5M</b> and <b>' +
      U.n0(p.tx10m) + ' above $10M</b>, at a top-decile <b>$' + U.n0(p.luxPpsf) + ' per square foot</b>. ' +
      'Five-year appreciation is ' + U.pct(p.apprec5, 0) + '; ' + U.pct(p.cashShare, 0) + ' of purchases close for cash, which is what insulated resort luxury through the 2022-24 rate cycle.');
    out.push('Prestige scores ' + U.n1(e.cat.prestige) + ' of 100 — private clubs ' + p.clubIdx + ', recognition ' + p.repIdx +
      ', privacy ' + p.privacyIdx + ', difficulty of entry ' + p.entryBarIdx + '. ' +
      (p.entryBarIdx >= 75 ? 'The last of those cuts both ways: it is a moat for whoever is already inside, and the single largest obstacle for anyone who is not.'
        : 'The referral network here is comparatively open, which materially shortens the ramp for a well-run entrant.'));
    out.push('Wealth density is ' + U.n0(p.hnwiPer1k) + ' millionaire households per 1,000, with second homes at ' +
      U.pct(p.shShare, 0) + ' of the housing stock. Second-home owners build more expensively per square foot, remodel more often, and are far less rate-sensitive than primary buyers.');
    return out;
  }

  function whyDevelopment(r) {
    var p = r.m.p, e = r.e, out = [];
    out.push('The Developer Opportunity Score is <b>' + U.n1(e.dev) + '</b> (rank #' + r.rank_dev + '). Developable land availability scores ' +
      p.landIdx + ' of 100 with <b>' + U.n0(p.entitledLots) + ' entitled but unbuilt lots</b> — ' + U.n1(e.derived.lotRunwayYears) +
      ' years of runway at the current build rate.');
    out.push('Entitlement takes about <b>' + p.entMonths + ' months</b> and a residential permit about ' + p.permitDays + ' days. ' +
      'Land is ' + U.pct(p.landShare, 0) + ' of finished home value, which leaves a modelled gross spec margin of <b>' +
      U.pct(e.derived.specMarginPct) + '</b>' +
      (e.derived.specMarginPct >= 15 ? ' — comfortably enough to compensate for the risk, and the reason a contractor here can credibly become a developer.'
        : e.derived.specMarginPct >= 9 ? ' — workable, but it does not forgive a mistake on price or programme.'
        : ' — below the level that compensates for the risk. A development business here would have to be built on entitlement value or fee work, not on spec margin.'));
    out.push('Water and utility headroom scores ' + p.waterIdx + ' of 100 and physical developability ' + (100 - p.topoIdx) +
      '. ' + (p.waterIdx <= 40 ? 'Water is the binding constraint on this thesis and should be diligenced before any land is tied up.'
        : 'Neither is the binding constraint here.'));
    return out;
  }

  function whyUs(r) {
    var e = r.e, p = r.m.p, out = [];
    var co = ST.S.company;
    var f = V_SIM.fit(r, {
      capital: co.capital, employees: co.employees, minProject: co.minProject, maxProject: co.maxProject,
      targetRevenue: co.targetRevenue, targetMargin: co.targetMargin,
      luxPct: co.luxPct, remodelPct: co.remodelPct, commPct: co.commPct
    });
    out.push('Against the company profile currently loaded — <b>' + U.usd(co.capital) + ' of capital, ' + co.employees +
      ' people, ' + U.usd(co.minProject) + ' to ' + U.usd(co.maxProject) + ' projects, targeting ' + U.usd(co.targetRevenue) +
      ' of revenue</b> — this market scores <b>' + U.n1(f.score) + ' of 100</b> for fit.');
    out.push('Roughly <b>' + U.n1(f.addressable) + ' projects a year</b> fall inside the target size band. At a realistic new-entrant share of ' +
      U.pct(f.share * 100) + ', that is <b>' + U.n1(f.winnable) + ' winnable jobs</b> against the <b>' + U.n1(f.jobsNeeded) +
      '</b> needed to hit the revenue target — ' +
      (f.feasibility >= 1 ? 'so the target is achievable on this market alone.'
        : f.feasibility >= 0.7 ? 'so the target is nearly achievable here, but the last stretch would have to come from an adjacent market or a larger average project.'
        : 'so this market cannot carry the full revenue target by itself.'));
    out.push('Working capital plus a year of loaded overhead models at <b>' + U.usd(f.capitalNeed) + '</b> against ' + U.usd(co.capital) +
      ' available' + (f.capitalRatio >= 1 ? ' — funded.' : ' — a shortfall of ' + U.usd(f.capitalNeed - co.capital) + '.') +
      ' Implied ramp to target: <b>' + U.n1(f.rampYears) + ' years</b>. The first thing that binds is <b>' + U.esc(f.binding.l.toLowerCase()) + '</b>.');
    return out;
  }

  function risks(r) {
    var sigs = (ST.DER.signals[r.id] || []).filter(function (s) { return s.kind === 'risk'; });
    var p = r.m.p;
    var extra = [];
    if (p.buildMonths <= 8) extra.push({ label: 'Short construction season', why: 'A ' + p.buildMonths + '-month practical building season compresses the schedule, raises carry cost and makes weather delay a margin event rather than an inconvenience.' });
    if (p.metroMin >= 150) extra.push({ label: 'Distance from a trade base', why: p.metroMin + ' minutes to the nearest metro above 500,000. Specialty subcontractors and material supply have to be imported, and that is a per-job cost.' });
    if (p.propTax >= 1.4) extra.push({ label: 'High property tax', why: 'Effective property tax of ' + U.pct(p.propTax, 2) + ' is a permanent drag on carrying inventory and on the second-home buyer\'s total cost.' });
    return sigs.concat(extra.map(function (x) { return { label: x.label, why: x.why, sev: 2 }; }));
  }

  function upside(r) {
    var e = r.e, p = r.m.p;
    var vol = e.derived.luxStartsVolumeM;
    var share5 = 0.05, share10 = 0.10;
    var growth10 = Math.pow(1 + Math.max(p.permitCagr3, 0) / 100, 10);
    return [
      'Annual luxury construction value in this market is roughly <b>' + U.usdM(vol) + '</b> today. At the current permit trajectory it models to <b>' +
      U.usdM(vol * growth10) + '</b> within ten years.',
      'A firm holding <b>5%</b> of that market builds a <b>' + U.usdM(vol * share5) + '</b> revenue book today, or <b>' +
      U.usdM(vol * growth10 * share5) + '</b> in ten years. At <b>10%</b> — achievable in markets where the incumbent bench is thin — those figures are <b>' +
      U.usdM(vol * share10) + '</b> and <b>' + U.usdM(vol * growth10 * share10) + '</b>.',
      'At a ' + U.pct(p.gcMargin, 0) + ' gross margin, a ' + U.usdM(vol * share10) + ' book produces <b>' + U.usdM(vol * share10 * p.gcMargin / 100) +
      '</b> of gross profit a year before overhead. The developer layer sits on top of that: at a modelled ' + U.pct(e.derived.specMarginPct) +
      ' gross spec margin, a single 30-lot programme at ' + U.usdFull(p.lotPrice * 2.6) + ' average sale price is <b>' +
      U.usdM(30 * p.lotPrice * 2.6 * e.derived.specMarginPct / 100 / 1e6) + '</b> of gross profit.'
    ];
  }

  function render(root) {
    body = root;
    var id = ST.S.selected || ST.DER.ranked[0].id;
    var r = ST.get(id);
    var e = r.e, band = U.confBand(r.confidence);
    var P = (typeof LCDOS_PROFILES !== 'undefined') ? LCDOS_PROFILES[id] : null;

    function sec(title, paras) {
      return '<section><h2>' + U.esc(title) + '</h2>' + paras.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>';
    }

    body.innerHTML = '<div class="stage"><div class="scrollstage"><div class="ic">' +
      '<div class="flex between center printhide mb16" style="gap:10px">' +
      '<span class="pill live">Investment committee mode</span>' +
      '<div class="flex gap6"><button class="btn" data-act="profile">Full profile</button>' +
      '<button class="btn" data-act="print">Print / PDF</button></div></div>' +

      '<div class="sub">' + U.esc(r.m.state) + ' · ' + U.esc(r.m.county) + ' · LCDOS ' + ST.MODEL.VERSION + ' · data as of ' + ST.DATA.AS_OF + '</div>' +
      '<h1>' + U.esc(r.m.name) + '</h1>' +
      '<p class="thesis">' + U.esc(P && P.thesis ? P.thesis : r.m.blurb) + '</p>' +

      '<div class="gridcards g4 mt24">' +
      [['LCDOS', e.lcdos, '#' + r.rank + ' of ' + ST.DER.ranked.length],
       ['GC entry', e.gce, '#' + r.rank_gce],
       ['Developer', e.dev, '#' + r.rank_dev],
       ['Opportunity gap', e.gap, 'upside ' + U.n0(e.flu) + ' / maturity ' + U.n0(e.cls)],
       ['Momentum', e.momentum, U.pctS(e.momentumRate) + ' a year'],
       ['5-year outlook', e.f5, ''], ['10-year outlook', e.f10, ''], ['20-year outlook', e.f20, '']
      ].map(function (x) {
        return '<div class="kpi"><div class="k">' + U.esc(x[0]) + '</div><div class="v" style="color:' + U.scoreColor(x[1]) + '">' +
          U.n1(x[1]) + '</div>' + (x[2] ? '<div class="s">' + U.esc(x[2]) + '</div>' : '') + '</div>';
      }).join('') + '</div>' +

      sec('Why this market', whyMarket(r)) +
      sec('Why now', whyNow(r)) +
      sec('Why construction', whyConstruction(r)) +
      sec('Why luxury', whyLuxury(r)) +
      sec('Why development', whyDevelopment(r)) +
      sec('Why us', whyUs(r)) +

      '<section><h2>What could go wrong</h2>' +
      risks(r).map(function (x) {
        return '<div class="risk"><b>' + U.esc(x.label) + '</b><p>' + U.esc(x.why) + '</p></div>';
      }).join('') +
      (P && P.sections ? (function () {
        var rs = P.sections.filter(function (s) { return s.risks; })[0];
        return rs ? rs.risks.map(function (rk) { return '<div class="risk"><b>' + U.esc(rk.t) + '</b><p>' + rk.d + '</p></div>'; }).join('') : '';
      })() : '') +
      '</section>' +

      '<section><h2>What the upside is</h2>' + upside(r).map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>' +

      '<section><h2>Evidence & data quality</h2>' +
      '<p>This market\'s Data Confidence Score is <b style="color:' + band.color + '">' + r.confidence + ' of 100 — ' + U.esc(band.label) +
      '</b>. ' + U.esc(band.desc) + '</p>' +
      '<p>' + (r.m.anchors && r.m.anchors.length
        ? r.m.anchors.length + ' figures in this profile were verified against named public sources during research. They are listed below with citations. Everything else is either a reported statistic carried at its default provenance tier or an analyst estimate, and is tagged as such throughout the platform.'
        : 'No figures in this profile were individually verified against a named public source. Every number is either a reported statistic carried at its default provenance tier or an analyst estimate. This market should be treated as a screening candidate, not an underwriting candidate.') + '</p>' +
      (r.m.anchors || []).map(function (a) {
        return '<div class="anchor"><div class="f">' + U.esc(a.fact) + '</div><div class="s">' + U.esc(a.src) + ' · ' + U.esc(a.date) +
          (a.url ? ' · <a href="' + U.esc(a.url) + '" target="_blank" rel="noopener">source</a>' : '') + '</div></div>';
      }).join('') +
      '<div class="callout amber mt16"><b>Standing limitation.</b><p style="margin:5px 0 0;font-size:12.5px">' +
      'LCDOS v' + ST.MODEL.VERSION + ' ships with an analyst-estimated data layer. It is built to rank and shortlist markets against one ' +
      'another, and it does that reliably. It is not built to underwrite a specific transaction, and no market in the universe currently ' +
      'reaches underwriting-grade confidence. The ingest roadmap in the Methodology module names the public endpoint that should replace ' +
      'each estimated field.</p></div>' +
      '</section>' +

      '<section class="printhide"><h2>Model decomposition</h2>' +
      '<div class="gridcards g2">' +
      '<div class="panel"><div class="pad">' + CH.waterfall(e.catRows.map(function (c) {
        return { label: c.label, v: c.contrib, w: c.weight, score: c.v };
      }), { width: 560 }) + '</div></div>' +
      '<div class="panel"><div class="pad" style="display:flex;justify-content:center">' +
      CH.radar(ST.MODEL.CATEGORIES.map(function (c) { return { label: c.label, short: c.key }; }),
        [{ values: ST.MODEL.CATEGORIES.map(function (c) { return e.cat[c.id]; }), color: U.scoreColor(e.lcdos) }], { size: 340 }) +
      '</div></div></div></section>' +

      '</div></div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', '[data-act="profile"]', function () { ST.set({ view: 'market' }, 'view'); });
    U.on(body, 'click', '[data-act="print"]', function () { window.print(); });
  }

  return { render: render, onEvent: function (w) { if (body && (w === 'select' || w === 'scenario')) render(body); } };
})(STORE, U, CH);

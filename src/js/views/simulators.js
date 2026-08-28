/* ============================================================================
 * views/simulators.js — Expansion Simulator + Developer Pro-Forma.
 *
 * Both models are stated in full below and rendered in the Methodology module,
 * because a pro-forma nobody can audit is worth nothing to an investment
 * committee.
 * ==========================================================================*/
var V_SIM = (function (ST, U, CH) {
  'use strict';
  var body = null, tab = 'expansion';

  /* ======================================================================
   * 1. COMPANY FIT MODEL
   * ==================================================================== */
  var FIT_WEIGHTS = [
    { id: 'feasibility', w: 30, l: 'Revenue feasibility' },
    { id: 'capital', w: 18, l: 'Capital adequacy' },
    { id: 'margin', w: 14, l: 'Margin achievability' },
    { id: 'team', w: 10, l: 'Team capacity' },
    { id: 'trades', w: 10, l: 'Trade availability' },
    { id: 'growth', w: 6, l: 'Market growth' },
    { id: 'permitting', w: 6, l: 'Permitting friction' },
    { id: 'access', w: 6, l: 'Relationship access' }
  ];

  function fit(r, co) {
    var p = r.m.p, d = r.e.derived;
    var avgProject = (co.minProject + co.maxProject) / 2;

    /* How well the market's typical luxury project sits inside the target band.
     * Lognormal overlap between the market's average project value and the
     * company's band midpoint; sigma 0.45 approximates the spread of custom
     * project values within a single market. */
    var mktAvg = d.avgProjectValueM * 1e6;
    var z = (Math.log(mktAvg) - Math.log(avgProject)) / 0.45;
    var bandFit = Math.exp(-z * z / 2);

    /* Addressable jobs per year inside the band, by work type. High-end
     * remodels are modelled at 60% of new-build count, scaled by the market's
     * remodel intensity. Commercial reach for a residential-led firm is small. */
    var aNew = d.luxStarts * bandFit;
    var aRemodel = d.luxStarts * 0.6 * (p.remodelIdx / 100) * bandFit;
    var aComm = (p.commercialM * 1e6 / avgProject) * 0.04;
    var addressable = aNew * (co.luxPct / 100) + aRemodel * (co.remodelPct / 100) + aComm * (co.commPct / 100);

    /* Share a well-run new entrant can realistically win by year three. */
    var share = 0.04
      * (1 + (d.startsPerIncumbent - 6) / 40)
      * (1 - (p.entryBarIdx - 40) / 220)
      * U.clamp(p.tradeIdx / 60, 0.4, 1.35);
    share = U.clamp(share, 0.005, 0.18);
    var winnable = addressable * share;

    var jobsNeeded = co.targetRevenue / avgProject;
    var feasibility = U.clamp(winnable / Math.max(jobsNeeded, 0.01), 0, 1.4);

    /* Working capital. Duration is a CALENDAR figure, not a build figure: a
     * seven-month practical season stretches a fourteen-month build across two
     * years, and permit time is dead carry on top of that. Both are market
     * attributes, which is why capital need differs market to market for the
     * same company and the same job size. A GC carries roughly 11% of live
     * work-in-progress before draws catch up, plus nine months of
     * fully-loaded overhead at $145k per head. */
    var buildMo = U.clamp(10 + (avgProject / 1e6) * 1.6, 9, 30);
    var seasonStretch = 12 / U.clamp(p.buildMonths, 5, 12);
    var permitCarry = p.permitDays / 30;
    var durationMo = U.clamp(buildMo * seasonStretch + permitCarry, 9, 54);
    var wip = co.targetRevenue * (durationMo / 12);
    var overhead = co.employees * 145000 * 0.75;
    var capitalNeed = 0.11 * wip + overhead;
    var capitalRatio = co.capital / Math.max(capitalNeed, 1);

    var marginGap = p.gcMargin - co.targetMargin;

    var concurrent = jobsNeeded * (durationMo / 12);
    var pmNeeded = concurrent / 2.5;
    var teamRatio = (co.employees * 0.45) / Math.max(pmNeeded, 0.2);

    var parts = {
      feasibility: U.clamp(feasibility / 1.2, 0, 1) * 100,
      capital: U.clamp(Math.log(Math.max(capitalRatio, 0.05)) / Math.log(3) * 50 + 50, 0, 100),
      margin: U.clamp(50 + marginGap * 9, 0, 100),
      team: U.clamp(Math.log(Math.max(teamRatio, 0.05)) / Math.log(3) * 50 + 50, 0, 100),
      trades: p.tradeIdx,
      growth: r.e.cat.growth,
      permitting: U.clamp(100 - (p.permitDays - 15) / 1.85, 0, 100),
      access: U.clamp(100 - (p.entryBarIdx - 20) / 0.75, 0, 100)
    };

    var s = 0, w = 0;
    FIT_WEIGHTS.forEach(function (f) { s += parts[f.id] * f.w; w += f.w; });

    /* What binds first. */
    var binding = FIT_WEIGHTS.slice().sort(function (a, b) {
      return (parts[a.id] * a.w) - (parts[b.id] * b.w);
    })[0];

    var rampYears = U.clamp(2.2 + (1 - feasibility) * 3.2 + (p.entryBarIdx - 40) / 34, 1.5, 9);
    var revenueCapacity = winnable * avgProject;

    return {
      score: s / w, parts: parts, binding: binding,
      addressable: addressable, winnable: winnable, share: share,
      jobsNeeded: jobsNeeded, feasibility: feasibility,
      capitalNeed: capitalNeed, capitalRatio: capitalRatio,
      marginGap: marginGap, teamRatio: teamRatio, pmNeeded: pmNeeded,
      durationMo: durationMo, buildMo: buildMo, seasonStretch: seasonStretch, permitCarry: permitCarry,
      rampYears: rampYears, revenueCapacity: revenueCapacity, avgProject: avgProject
    };
  }

  /* ======================================================================
   * 2. DEVELOPER PRO-FORMA
   * ==================================================================== */
  function irr(cf) {
    function npv(r) { var s = 0; for (var i = 0; i < cf.length; i++) s += cf[i] / Math.pow(1 + r, i); return s; }
    var lo = -0.95, hi = 4, f0 = npv(lo);
    if (f0 * npv(hi) > 0) return null;
    for (var i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2;
      if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
  }

  /* Annual cash-flow model.
   *
   * Timing is what makes or breaks a development pro-forma, so it is explicit:
   *   Year 0   land closes; 60% of horizontal infrastructure; half of soft costs
   *   Year 1   remaining infrastructure and soft costs; first homes START
   *   Year k   homes started in year k-1 DELIVER and settle
   * The one-year delivery lag is the reason a developer needs real equity: a
   * home's construction cost is spent a full year before its sale proceeds
   * arrive. A model without that lag reports IRRs several times too high.
   *
   * Financing:
   *   horizontal  drawn against land + infrastructure at the leverage ratio,
   *               interest accrues annually, amortises as lots are released
   *   vertical    drawn at start, repaid out of proceeds on delivery; interest
   *               accrues on the outstanding balance
   */
  function proforma(d) {
    var dp = d.debtPct / 100, rate = d.rate / 100;
    var soft = (d.landCost + d.infra) * d.softPct / 100;
    var devCost = d.landCost + d.infra + soft;
    var costPerLot = devCost / d.lots;
    var buildTotal = d.lots * d.buildCost;
    var revenue = d.lots * d.avgHome;
    var selling = revenue * d.sellPct / 100;
    var netPerHome = d.avgHome * (1 - d.sellPct / 100);

    var T = Math.ceil(d.lots / d.absorb) + 2;
    var horiz = [], starts = [], deliveries = [];
    for (var t = 0; t <= T; t++) { horiz[t] = 0; starts[t] = 0; deliveries[t] = 0; }
    horiz[0] = d.landCost + d.infra * 0.6 + soft * 0.5;
    horiz[1] = d.infra * 0.4 + soft * 0.5;

    var remaining = d.lots;
    for (var y = 1; y <= T && remaining > 0; y++) {
      starts[y] = Math.min(d.absorb, remaining);
      remaining -= starts[y];
    }
    for (var y2 = 1; y2 <= T; y2++) deliveries[y2] = starts[y2 - 1] || 0;

    var hBal = 0, vBal = 0, cf = [], interestTotal = 0;
    for (var k = 0; k <= T; k++) {
      /* horizontal */
      var hDraw = horiz[k] * dp;
      var hEquity = horiz[k] - hDraw;
      hBal += hDraw;
      var hInterest = hBal * rate;

      /* vertical: draw on start, repay on delivery */
      var vDraw = starts[k] * d.buildCost * dp;
      var vEquity = starts[k] * d.buildCost * (1 - dp);
      var vRepay = deliveries[k] * d.buildCost * dp;
      var vAvg = vBal + vDraw / 2;
      var vInterest = Math.max(vAvg, 0) * rate;
      vBal = Math.max(0, vBal + vDraw - vRepay);

      /* proceeds and horizontal amortisation */
      var proceeds = deliveries[k] * netPerHome;
      var release = Math.min(hBal, deliveries[k] * costPerLot * dp);
      hBal -= release;

      interestTotal += hInterest + vInterest;
      cf[k] = proceeds - vRepay - vEquity - hEquity - hInterest - vInterest - release;
    }

    var totalCost = devCost + buildTotal + selling + interestTotal;
    var grossProfit = revenue - devCost - buildTotal - selling;
    var netProfit = revenue - totalCost;

    var equityIn = 0, equityOut = 0;
    cf.forEach(function (v) { if (v < 0) equityIn += -v; else equityOut += v; });

    /* Homes that must settle before the development cost is recovered. */
    var contributionPerHome = netPerHome - d.buildCost;
    var breakEvenLots = contributionPerHome > 0 ? devCost / contributionPerHome : null;

    return {
      soft: soft, devCost: devCost, costPerLot: costPerLot, buildTotal: buildTotal,
      revenue: revenue, selling: selling, totalCost: totalCost, totalInterest: interestTotal,
      grossProfit: grossProfit, netProfit: netProfit,
      margin: grossProfit / revenue * 100, netMargin: netProfit / revenue * 100,
      cf: cf, irr: irr(cf), multiple: equityIn > 0 ? equityOut / equityIn : null,
      equityIn: equityIn, years: T, breakEvenLots: breakEvenLots,
      starts: starts, deliveries: deliveries, sales: deliveries
    };
  }

  /* Transfer the same physical project into another market. */
  function transfer(d, baseR, r) {
    var b = baseR.m.p, p = r.m.p;
    var d2 = {};
    for (var k in d) d2[k] = d[k];
    d2.landCost = d.landCost * (p.lotPrice / b.lotPrice);
    d2.buildCost = d.buildCost * (p.costPsf / b.costPsf);
    d2.avgHome = d.avgHome * (p.luxPpsf / b.luxPpsf);
    d2.infra = d.infra * (1 + (p.topoIdx - b.topoIdx) / 140) * (1 + (60 - p.waterIdx) / 220);
    d2.absorb = Math.max(1, Math.round(d.absorb * U.clamp(r.e.demandIdx / Math.max(baseR.e.demandIdx, 1), 0.4, 1.9)));
    return d2;
  }

  /* ======================================================================
   * 3. RENDER — EXPANSION
   * ==================================================================== */
  function expansionRail() {
    var c = ST.S.company;
    function num(id, label, val, step, min, max, fmt) {
      return '<div class="ctl"><label>' + label + ' <b>' + fmt(val) + '</b></label>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-co="' + id + '"></div>';
    }
    return '<div class="railsec"><h4>Company profile</h4>' +
      num('capital', 'Starting capital', c.capital, 50000, 100000, 15000000, U.usd) +
      num('employees', 'Employees', c.employees, 1, 1, 120, function (v) { return v; }) +
      num('minProject', 'Minimum project', c.minProject, 250000, 250000, 20000000, U.usd) +
      num('maxProject', 'Maximum project', c.maxProject, 500000, 1000000, 60000000, U.usd) +
      num('targetRevenue', 'Target annual revenue', c.targetRevenue, 1000000, 2000000, 400000000, U.usd) +
      num('targetMargin', 'Target gross margin', c.targetMargin, 0.5, 8, 32, function (v) { return v + '%'; }) +
      '</div>' +
      '<div class="railsec"><h4>Work mix</h4>' +
      num('luxPct', 'Luxury residential', c.luxPct, 5, 0, 100, function (v) { return v + '%'; }) +
      num('remodelPct', 'High-end remodel', c.remodelPct, 5, 0, 100, function (v) { return v + '%'; }) +
      num('commPct', 'Commercial', c.commPct, 5, 0, 100, function (v) { return v + '%'; }) +
      '<p class="dim2" style="font-size:10.5px;margin:6px 0 0">Mix is normalised to 100% when scoring.</p>' +
      '</div>' +
      '<div class="railsec"><h4>Presets</h4><div class="chips">' +
      '<button class="chip" data-cop="startup">Startup GC</button>' +
      '<button class="chip" data-cop="regional">Regional builder</button>' +
      '<button class="chip" data-cop="remodel">Remodel-led</button>' +
      '<button class="chip" data-cop="scale">Scaled operator</button>' +
      '</div></div>';
  }

  function expansionStage() {
    var c = ST.S.company;
    var tot = c.luxPct + c.remodelPct + c.commPct || 1;
    var co = {
      capital: c.capital, employees: c.employees, minProject: c.minProject, maxProject: c.maxProject,
      targetRevenue: c.targetRevenue, targetMargin: c.targetMargin,
      luxPct: c.luxPct / tot * 100, remodelPct: c.remodelPct / tot * 100, commPct: c.commPct / tot * 100
    };
    var rows = ST.filtered().map(function (r) { return { r: r, f: fit(r, co) }; })
      .sort(function (a, b) { return b.f.score - a.f.score; });

    var best = rows[0];
    var feasible = rows.filter(function (x) { return x.f.feasibility >= 1; }).length;
    var funded = rows.filter(function (x) { return x.f.capitalRatio >= 1; }).length;

    return '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">Expansion simulator</h2>' +
      '<div class="dim" style="font-size:11.5px">Ranks all ' + rows.length +
      ' markets for this specific company profile — not for a generic operator.</div></div></div>' +

      '<div class="gridcards g4 mb16">' +
      '<div class="kpi"><div class="k">Best-fit market</div><div class="v" style="font-size:16px;color:' +
      U.scoreColor(best.f.score) + '">' + U.esc(best.r.m.name.replace(/ (&|and) .*$/, '')) + '</div>' +
      '<div class="s">fit score ' + U.n1(best.f.score) + ' / 100</div></div>' +
      '<div class="kpi"><div class="k">Markets that can carry the revenue target</div><div class="v">' + feasible + '</div>' +
      '<div class="s">of ' + rows.length + ' at ' + U.usd(co.targetRevenue) + '/yr</div></div>' +
      '<div class="kpi"><div class="k">Markets the capital covers</div><div class="v">' + funded + '</div>' +
      '<div class="s">working capital + 9 months overhead</div></div>' +
      '<div class="kpi"><div class="k">Implied ramp</div><div class="v">' + U.n1(best.f.rampYears) + ' yrs</div>' +
      '<div class="s">to target revenue in the best-fit market</div></div>' +
      '</div>' +

      '<div class="panel mb16"><header><h3>Ranked for this company</h3>' +
      '<span class="tiny">' + U.usd(co.minProject) + '–' + U.usd(co.maxProject) + ' projects · ' +
      Math.round(co.luxPct) + '/' + Math.round(co.remodelPct) + '/' + Math.round(co.commPct) + ' mix</span></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr>' +
      '<th style="width:34px">#</th><th class="l">Market</th><th>Fit</th><th>LCDOS</th><th>GC entry</th>' +
      '<th>Addressable jobs/yr</th><th>Winnable</th><th>Jobs needed</th><th>Revenue capacity</th>' +
      '<th>Capital need</th><th>Ramp</th><th class="l">Binding constraint</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(function (x, i) {
        var f = x.f;
        return '<tr data-id="' + x.r.id + '"><td><span class="rank">' + (i + 1) + '</span></td>' +
          '<td class="l"><b style="font-weight:550">' + U.esc(x.r.m.name) + '</b><br><span class="dim2 mono" style="font-size:9.5px">' +
          U.esc(x.r.m.state) + '</span></td>' +
          '<td>' + U.scoreChip(f.score) + '</td><td>' + U.scoreChip(x.r.lcdos) + '</td><td>' + U.scoreChip(x.r.gce) + '</td>' +
          '<td>' + U.n1(f.addressable) + '</td>' +
          '<td class="' + (f.winnable >= f.jobsNeeded ? 'up' : 'down') + '">' + U.n1(f.winnable) + '</td>' +
          '<td>' + U.n1(f.jobsNeeded) + '</td>' +
          '<td>' + U.usd(f.revenueCapacity) + '</td>' +
          '<td class="' + (f.capitalRatio >= 1 ? 'up' : 'down') + '">' + U.usd(f.capitalNeed) + '</td>' +
          '<td>' + U.n1(f.rampYears) + 'y</td>' +
          '<td class="l dim" style="font-size:11px">' + U.esc(f.binding.l) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +

      '<div class="gridcards g2">' +
      '<div class="panel"><header><h3>Fit decomposition — ' + U.esc(best.r.m.name) + '</h3></header><div class="pad">' +
      CH.hbars(FIT_WEIGHTS.map(function (f) {
        return { label: f.l, v: best.f.parts[f.id], w: f.w };
      }), { width: 520, labelW: 200, valW: 44, rowH: 23 }) +
      '<div class="sep"></div>' +
      '<div class="stat"><span class="sl">Average project in band</span><span class="sv">' + U.usd(best.f.avgProject) + '</span></div>' +
      '<div class="stat"><span class="sl">Market average luxury project</span><span class="sv">' + U.usdM(best.r.e.derived.avgProjectValueM) + '</span></div>' +
      '<div class="stat"><span class="sl">Realistic new-entrant share</span><span class="sv">' + U.pct(best.f.share * 100) + '</span></div>' +
      '<div class="stat"><span class="sl">Concurrent jobs at target</span><span class="sv">' + U.n1(best.f.jobsNeeded * best.f.durationMo / 12) + '</span></div>' +
      '<div class="stat"><span class="sl">Project managers required</span><span class="sv">' + U.n1(best.f.pmNeeded) + '</span></div>' +
      '<div class="stat"><span class="sl">Build duration</span><span class="sv">' + U.n0(best.f.buildMo) + ' months</span></div>' +
      '<div class="stat"><span class="sl">Calendar duration</span><span class="sv">' + U.n0(best.f.durationMo) + ' months <span class="dim" style="font-size:10.5px">(' +
      U.n1(best.f.seasonStretch) + 'x season, +' + U.n0(best.f.permitCarry) + ' mo permitting)</span></span></div>' +
      '</div></div>' +
      '<div class="panel"><header><h3>Fit against overall opportunity</h3>' +
      '<span class="tiny">where company fit and market quality diverge</span></header><div class="pad" style="padding:6px">' +
      CH.scatter(rows.map(function (x) {
        return {
          id: x.r.id, x: x.r.lcdos, y: x.f.score,
          r: 3 + 6 * U.clamp(Math.log(Math.max(x.f.revenueCapacity / 1e6, 1)) / Math.log(400), 0, 1),
          color: U.scoreColor(x.f.score), label: x.r.m.name.replace(/ (&|and) .*$/, '').slice(0, 16),
          showLabel: x.f.score >= 62 || x.r.lcdos >= 66
        };
      }), {
        width: 560, height: 420, xDomain: [35, 78], yDomain: [25, 85], midX: 56, midY: 55,
        xLabel: 'LCDOS  →', yLabel: 'FIT FOR THIS COMPANY  →',
        quadrants: [
          { x: 'lo', y: 'hi', label: 'Fits you, under-rated', color: U.cssvar('--s3', '#e8b13c') },
          { x: 'hi', y: 'hi', label: 'Target', color: U.cssvar('--s1', '#3f9e8c') },
          { x: 'hi', y: 'lo', label: 'Good market, wrong company', color: U.cssvar('--s0', '#4a6fa5') },
          { x: 'lo', y: 'lo', label: 'Avoid', color: U.cssvar('--ink-3', '#767c87') }
        ]
      }) + '</div></div></div>';
  }

  /* ======================================================================
   * 4. RENDER — DEVELOPER
   * ==================================================================== */
  function devRail() {
    var d = ST.S.deal;
    function num(id, label, val, step, min, max, fmt) {
      return '<div class="ctl"><label>' + label + ' <b>' + fmt(val) + '</b></label>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-deal="' + id + '"></div>';
    }
    return '<div class="railsec"><h4>Base market</h4>' +
      '<select data-deal="market">' + ST.DER.ranked.map(function (r) {
        return '<option value="' + r.id + '"' + (d.market === r.id ? ' selected' : '') + '>' + U.esc(r.m.name) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="railsec"><h4>Land & programme</h4>' +
      num('acres', 'Acres', d.acres, 1, 2, 800, function (v) { return v + ' ac'; }) +
      num('landCost', 'Land cost', d.landCost, 250000, 250000, 150000000, U.usd) +
      num('lots', 'Lots', d.lots, 1, 3, 500, function (v) { return v; }) +
      num('infra', 'Infrastructure', d.infra, 250000, 0, 200000000, U.usd) +
      '</div>' +
      '<div class="railsec"><h4>Homes</h4>' +
      num('avgHome', 'Average home price', d.avgHome, 100000, 400000, 40000000, U.usd) +
      num('buildCost', 'Construction cost / home', d.buildCost, 50000, 200000, 25000000, U.usd) +
      '</div>' +
      '<div class="railsec"><h4>Costs & capital</h4>' +
      num('softPct', 'Soft costs', d.softPct, 0.5, 0, 25, function (v) { return v + '%'; }) +
      num('sellPct', 'Selling costs', d.sellPct, 0.5, 0, 12, function (v) { return v + '%'; }) +
      num('debtPct', 'Leverage', d.debtPct, 5, 0, 80, function (v) { return v + '%'; }) +
      num('rate', 'Interest rate', d.rate, 0.25, 3, 16, function (v) { return v + '%'; }) +
      num('absorb', 'Absorption', d.absorb, 1, 1, 120, function (v) { return v + ' lots/yr'; }) +
      '</div>';
  }

  function devStage() {
    var d = ST.S.deal;
    var baseR = ST.get(d.market) || ST.DER.ranked[0];
    var pf = proforma(d);

    /* sensitivity grid: price x cost */
    var deltas = [-20, -10, 0, 10, 20];
    var heatRows = deltas.slice().reverse().map(function (pd) {
      return {
        label: 'Price ' + (pd > 0 ? '+' : '') + pd + '%',
        cells: deltas.map(function (cd) {
          var dd = {}; for (var k in d) dd[k] = d[k];
          dd.avgHome = d.avgHome * (1 + pd / 100);
          dd.buildCost = d.buildCost * (1 + cd / 100);
          var r2 = proforma(dd);
          return { v: U.clamp(r2.irr == null ? 0 : r2.irr * 100 * 3.4, 0, 100), display: r2.irr == null ? 'n/m' : U.pct(r2.irr * 100, 0) };
        })
      };
    });

    /* cross-market run */
    var cross = ST.filtered().map(function (r) {
      var dd = transfer(d, baseR, r);
      var pf2 = proforma(dd);
      return { r: r, d: dd, pf: pf2 };
    }).sort(function (a, b) { return (b.pf.irr == null ? -9 : b.pf.irr) - (a.pf.irr == null ? -9 : a.pf.irr); });

    var cfSeries = [{
      name: 'Equity cash flow', color: U.cssvar('--s1', '#3f9e8c'),
      points: pf.cf.map(function (v, i) { return { x: i, y: v / 1e6, kind: 'observed' }; })
    }];

    return '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">Developer pro-forma</h2>' +
      '<div class="dim" style="font-size:11.5px">Base market: ' + U.esc(baseR.m.name) +
      ' · the identical physical project is then re-priced into every other market.</div></div></div>' +

      '<div class="gridcards g4 mb16">' +
      '<div class="kpi"><div class="k">Total development cost</div><div class="v">' + U.usd(pf.totalCost) + '</div>' +
      '<div class="s">incl. ' + U.usd(pf.totalInterest) + ' financing</div></div>' +
      '<div class="kpi"><div class="k">Revenue</div><div class="v">' + U.usd(pf.revenue) + '</div>' +
      '<div class="s">' + d.lots + ' homes @ ' + U.usd(d.avgHome) + '</div></div>' +
      '<div class="kpi"><div class="k">Development margin</div><div class="v" style="color:' + U.scoreColor(pf.margin * 3.3) + '">' +
      U.pct(pf.margin) + '</div><div class="s">net of financing ' + U.pct(pf.netMargin) + '</div></div>' +
      '<div class="kpi"><div class="k">Levered IRR</div><div class="v" style="color:' +
      U.scoreColor(pf.irr == null ? 0 : pf.irr * 100 * 3.4) + '">' + (pf.irr == null ? 'n/m' : U.pct(pf.irr * 100)) + '</div>' +
      '<div class="s">' + (pf.multiple == null ? '—' : U.n2(pf.multiple) + 'x equity') + ' over ' + pf.years + ' yrs</div></div>' +
      '</div>' +

      '<div class="gridcards g2 mb16">' +
      '<div class="panel"><header><h3>Sources & uses</h3></header><div class="pad">' +
      row('Land', d.landCost) + row('Infrastructure', d.infra) + row('Soft costs (' + d.softPct + '%)', pf.soft) +
      '<div class="stat" style="border-top:1px solid var(--hairline-2)"><span class="sl"><b>Development cost</b></span><span class="sv"><b>' + U.usd(pf.devCost) + '</b></span></div>' +
      row('Cost per lot', pf.costPerLot) +
      row('Homebuilding (' + d.lots + ' × ' + U.usd(d.buildCost) + ')', pf.buildTotal) +
      row('Selling costs (' + d.sellPct + '%)', pf.selling) +
      row('Financing carry', pf.totalInterest) +
      '<div class="stat" style="border-top:1px solid var(--hairline-2)"><span class="sl"><b>Total cost</b></span><span class="sv"><b>' + U.usd(pf.totalCost) + '</b></span></div>' +
      '<div class="stat"><span class="sl">Gross revenue</span><span class="sv">' + U.usd(pf.revenue) + '</span></div>' +
      '<div class="stat"><span class="sl"><b>Gross profit</b></span><span class="sv up"><b>' + U.usd(pf.grossProfit) + '</b></span></div>' +
      '<div class="stat"><span class="sl"><b>Profit after financing</b></span><span class="sv ' + (pf.netProfit > 0 ? 'up' : 'down') + '"><b>' + U.usd(pf.netProfit) + '</b></span></div>' +
      '<div class="stat"><span class="sl">Peak equity</span><span class="sv">' + U.usd(pf.equityIn) + '</span></div>' +
      '<div class="stat"><span class="sl">Break-even homes settled</span><span class="sv">' +
      (pf.breakEvenLots == null ? '<span class="down">never — build cost exceeds net sale price</span>'
        : U.n1(pf.breakEvenLots) + ' of ' + d.lots) + '</span></div>' +
      '</div></div>' +
      '<div class="panel"><header><h3>Equity cash flow</h3><span class="tiny">$M by year</span></header><div class="pad">' +
      CH.lines(cfSeries, { width: 540, height: 210, xTicks: pf.cf.map(function (_, i) { return i; }), fmtY: function (v) { return U.n0(v); } }) +
      '<div class="sep"></div>' +
      CH.vbars(pf.cf.map(function (v, i) { return { label: 'Y' + i, short: 'Y' + i, v: v / 1e6, color: v >= 0 ? U.cssvar('--s1', '#3f9e8c') : U.cssvar('--s5', '#b8442a') }; }),
        { width: 540, height: 160, fmtY: function (v) { return U.n0(v); } }) +
      '</div></div></div>' +

      '<div class="panel mb16"><header><h3>Sensitivity — levered IRR</h3>' +
      '<span class="tiny">home price against construction cost</span></header><div class="pad scrollx">' +
      CH.heat(deltas.map(function (c) { return 'Cost ' + (c > 0 ? '+' : '') + c + '%'; }), heatRows, { cellW: 88, cellH: 28, labelW: 100 }) +
      '</div></div>' +

      '<div class="panel"><header><h3>The same project, run in every market</h3>' +
      '<span class="tiny">land, build cost, pricing, infrastructure and absorption re-based to each market</span></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr>' +
      '<th style="width:34px">#</th><th class="l">Market</th><th>Land</th><th>Build / home</th><th>Home price</th>' +
      '<th>Infra</th><th>Absorption</th><th>Revenue</th><th>Margin</th><th>IRR</th><th>Multiple</th><th>Yrs</th></tr></thead><tbody>' +
      cross.slice(0, 40).map(function (x, i) {
        return '<tr data-id="' + x.r.id + '"' + (x.r.id === d.market ? ' class="sel"' : '') + '>' +
          '<td><span class="rank">' + (i + 1) + '</span></td>' +
          '<td class="l"><b style="font-weight:550">' + U.esc(x.r.m.name) + '</b><br><span class="dim2 mono" style="font-size:9.5px">' + U.esc(x.r.m.state) + '</span></td>' +
          '<td>' + U.usd(x.d.landCost) + '</td><td>' + U.usd(x.d.buildCost) + '</td><td>' + U.usd(x.d.avgHome) + '</td>' +
          '<td>' + U.usd(x.d.infra) + '</td><td>' + x.d.absorb + '/yr</td>' +
          '<td>' + U.usd(x.pf.revenue) + '</td>' +
          '<td class="' + (x.pf.margin > 15 ? 'up' : x.pf.margin < 5 ? 'down' : '') + '">' + U.pct(x.pf.margin) + '</td>' +
          '<td class="' + (x.pf.irr != null && x.pf.irr > 0.18 ? 'up' : x.pf.irr == null || x.pf.irr < 0.08 ? 'down' : '') + '">' +
          (x.pf.irr == null ? 'n/m' : U.pct(x.pf.irr * 100)) + '</td>' +
          '<td>' + (x.pf.multiple == null ? '—' : U.n2(x.pf.multiple) + 'x') + '</td><td>' + x.pf.years + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function row(l, v) {
    return '<div class="stat"><span class="sl">' + U.esc(l) + '</span><span class="sv">' + U.usd(v) + '</span></div>';
  }

  /* ------------------------------------------------------------------ shell */
  function render(root) {
    body = root;
    if (tab === 'scenario') { V_SCENARIO.render(root); wireTabsOnly(root); return; }
    body.innerHTML = '<div class="rail">' +
      '<div class="railsec fsticky"><div class="modules fill">' +
      '<button class="mod' + (tab === 'expansion' ? ' on' : '') + '" data-tab="expansion">Expansion</button>' +
      '<button class="mod' + (tab === 'developer' ? ' on' : '') + '" data-tab="developer">Developer</button>' +
      '<button class="mod' + (tab === 'scenario' ? ' on' : '') + '" data-tab="scenario">Scenario</button>' +
      '</div></div>' +
      (tab === 'expansion' ? expansionRail() : devRail()) + '</div>' +
      '<div class="stage"><div class="scrollstage viewfade" style="padding:24px 28px 72px">' +
      (tab === 'expansion' ? expansionStage() : devStage()) + '</div></div>';
    wire();
  }

  function refreshStage() {
    var st = body.querySelector('.scrollstage'); if (!st) return;
    var y = st.scrollTop;
    st.innerHTML = tab === 'expansion' ? expansionStage() : devStage();
    st.scrollTop = y;
  }

  /* When Scenario is showing, only the tab switcher belongs to this module. */
  function wireTabsOnly(root) {
    var rail = root.querySelector('.rail');
    if (rail) {
      rail.insertAdjacentHTML('afterbegin',
        '<div class="railsec fsticky"><div class="modules fill">' +
        '<button class="mod" data-tab="expansion">Expansion</button>' +
        '<button class="mod" data-tab="developer">Developer</button>' +
        '<button class="mod on" data-tab="scenario">Scenario</button>' +
        '</div></div>');
    }
    U.on(root, 'click', '[data-tab]', function (e, t) { tab = t.dataset.tab; render(root); });
  }

  function wire() {
    U.on(body, 'click', '[data-tab]', function (e, t) { tab = t.dataset.tab; render(body); });
    U.on(body, 'click', '[data-cop]', function (e, t) {
      var P = {
        startup: { capital: 500000, employees: 5, minProject: 2000000, maxProject: 8000000, targetRevenue: 20000000, targetMargin: 16, luxPct: 70, remodelPct: 20, commPct: 10 },
        regional: { capital: 3500000, employees: 22, minProject: 3000000, maxProject: 15000000, targetRevenue: 65000000, targetMargin: 15, luxPct: 60, remodelPct: 15, commPct: 25 },
        remodel: { capital: 350000, employees: 4, minProject: 600000, maxProject: 3500000, targetRevenue: 9000000, targetMargin: 19, luxPct: 25, remodelPct: 70, commPct: 5 },
        scale: { capital: 15000000, employees: 65, minProject: 6000000, maxProject: 40000000, targetRevenue: 180000000, targetMargin: 14, luxPct: 55, remodelPct: 10, commPct: 35 }
      }[t.dataset.cop];
      for (var k in P) ST.S.company[k] = P[k];
      render(body);
    });
    U.on(body, 'input', '[data-co]', function (e, t) {
      ST.S.company[t.dataset.co] = +t.value;
      var lv = t.previousElementSibling && t.previousElementSibling.querySelector('b');
      if (lv) {
        var id = t.dataset.co, v = +t.value;
        lv.textContent = (id === 'employees') ? v : (id.indexOf('Pct') > 0 || id === 'targetMargin') ? v + '%' : U.usd(v);
      }
      refreshStage();
    });
    U.on(body, 'input', '[data-deal]', function (e, t) {
      var id = t.dataset.deal;
      ST.S.deal[id] = id === 'market' ? t.value : +t.value;
      var lv = t.previousElementSibling && t.previousElementSibling.querySelector('b');
      if (lv) {
        var v = +t.value;
        lv.textContent = (id === 'acres') ? v + ' ac' : (id === 'lots') ? v :
          (id === 'absorb') ? v + ' lots/yr' :
          (id === 'softPct' || id === 'sellPct' || id === 'debtPct' || id === 'rate') ? v + '%' : U.usd(v);
      }
      refreshStage();
    });
    U.on(body, 'change', 'select[data-deal]', function (e, t) { ST.S.deal.market = t.value; refreshStage(); });
    U.on(body, 'click', 'tr[data-id]', function (e, t) { ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view'); });
    U.on(body, 'click', 'g.pt', function (e, t) { ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view'); });
  }

  return { render: render, fit: fit, proforma: proforma, FIT_WEIGHTS: FIT_WEIGHTS,
    onEvent: function (w) {
      if (!body) return;
      if (tab === 'scenario') { if (V_SCENARIO.onEvent) V_SCENARIO.onEvent(w); return; }
      if (w === 'scenario') refreshStage();
    } };
})(STORE, U, CH);

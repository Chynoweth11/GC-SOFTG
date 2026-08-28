/* ============================================================================
 * views/market.js — the full market intelligence profile.
 * Renders the data-driven sections for every market, plus the long-form
 * institutional deep dive where one exists (see src/data/profiles.js).
 * ==========================================================================*/
var V_MARKET = (function (ST, U, CH) {
  'use strict';
  var body = null;

  function provTag(field, m) {
    var pr = (m.prov && m.prov[field]) || ST.DATA.FIELD_PROV[field];
    if (!pr) return '';
    var t = ST.MODEL.TIERS[pr.tier];
    var src = ST.DATA.SOURCES[pr.src];
    return '<span class="prov ' + pr.tier + '" title="' + U.esc((t ? t.desc : '') + ' Source: ' + (src ? src.name : pr.src) + '. As of ' + pr.asOf + '.') + '">' +
      U.esc(pr.tier) + '</span>';
  }

  var DATA_GROUPS = [
    { l: 'Scale & demographics', f: [
      ['pop', 'Population', function (p) { return U.n0(p.pop); }],
      ['hh', 'Households', function (p) { return U.n0(p.hh); }],
      ['popCagr5', 'Population growth (5-yr CAGR)', function (p) { return U.pctS(p.popCagr5); }],
      ['netMig', 'Net domestic migration', function (p) { return U.pctS(p.netMig, 0) + ' per 1,000'; }],
      ['empCagr5', 'Employment growth', function (p) { return U.pctS(p.empCagr5); }],
      ['medInc', 'Median household income', function (p) { return U.usdFull(p.medInc); }],
      ['incCagr5', 'Income growth', function (p) { return U.pctS(p.incCagr5); }],
      ['bizFormIdx', 'Business formation index', function (p) { return p.bizFormIdx + ' (US median 50)'; }]
    ] },
    { l: 'Wealth', f: [
      ['hnwiPer1k', 'Millionaire households', function (p) { return U.n0(p.hnwiPer1k) + ' per 1,000 HH'; }],
      ['hnwiG10', 'Millionaire growth (10-yr)', function (p) { return U.pct(p.hnwiG10, 0); }],
      ['agiIn', 'Net AGI inflow per return', function (p) { return U.usdFull(p.agiIn); }],
      ['uhnwIdx', 'UHNW & billionaire presence', function (p) { return p.uhnwIdx + ' / 100'; }],
      ['shShare', 'Second-home share of units', function (p) { return U.pct(p.shShare, 0); }],
      ['wealthInfraIdx', 'Wealth-management presence', function (p) { return p.wealthInfraIdx + ' / 100'; }]
    ] },
    { l: 'Luxury real estate', f: [
      ['medVal', 'Median home value', function (p) { return U.usdFull(p.medVal); }],
      ['luxPpsf', 'Luxury price per sq ft (top decile)', function (p) { return '$' + U.n0(p.luxPpsf); }],
      ['apprec5', 'Five-year appreciation', function (p) { return U.pct(p.apprec5, 0); }],
      ['dom', 'Days on market (luxury)', function (p) { return U.n0(p.dom); }],
      ['cashShare', 'Cash purchase share', function (p) { return U.pct(p.cashShare, 0); }],
      ['tx2m', '$2M+ closings per year', function (p) { return U.n0(p.tx2m); }],
      ['tx5m', '$5M+ closings per year', function (p) { return U.n0(p.tx5m); }],
      ['tx10m', '$10M+ closings per year', function (p) { return U.n0(p.tx10m); }],
      ['lotPrice', 'Premium lot price', function (p) { return U.usdFull(p.lotPrice); }],
      ['landShare', 'Land share of finished value', function (p) { return U.pct(p.landShare, 0); }]
    ] },
    { l: 'Construction', f: [
      ['sfPermits', 'Single-family permits per year', function (p) { return U.n0(p.sfPermits); }],
      ['permitCagr3', 'Permit growth (3-yr CAGR)', function (p) { return U.pctS(p.permitCagr3); }],
      ['customShare', 'Custom / semi-custom share', function (p) { return U.pct(p.customShare, 0); }],
      ['remodelIdx', 'High-end remodel intensity', function (p) { return p.remodelIdx + ' / 100'; }],
      ['costPsf', 'Luxury construction cost', function (p) { return '$' + U.n0(p.costPsf) + '/sf'; }],
      ['gcMargin', 'Typical GC gross margin', function (p) { return U.pct(p.gcMargin, 0); }],
      ['luxGcCount', 'Established luxury GCs', function (p) { return U.n0(p.luxGcCount); }],
      ['tradeIdx', 'Subcontractor availability', function (p) { return p.tradeIdx + ' / 100'; }],
      ['backlog', 'Contractor backlog', function (p) { return U.n1(p.backlog) + ' months'; }],
      ['buildMonths', 'Practical construction season', function (p) { return p.buildMonths + ' months/yr'; }]
    ] },
    { l: 'Pipeline & land', f: [
      ['pipelineM', 'Announced 5-yr pipeline', function (p) { return U.usdM(p.pipelineM); }],
      ['commercialM', 'Commercial & hospitality pipeline', function (p) { return U.usdM(p.commercialM); }],
      ['infraM', 'Committed public infrastructure', function (p) { return U.usdM(p.infraM); }],
      ['entitledLots', 'Entitled but unbuilt lots', function (p) { return U.n0(p.entitledLots); }],
      ['landIdx', 'Developable land availability', function (p) { return p.landIdx + ' / 100'; }],
      ['entMonths', 'Months to entitle a subdivision', function (p) { return p.entMonths; }],
      ['permitDays', 'Days to a residential permit', function (p) { return p.permitDays; }],
      ['waterIdx', 'Water & utility headroom', function (p) { return p.waterIdx + ' / 100'; }],
      ['topoIdx', 'Topographic constraint', function (p) { return p.topoIdx + ' / 100'; }],
      ['shortageIdx', 'Housing shortage severity', function (p) { return p.shortageIdx + ' / 100'; }]
    ] },
    { l: 'Tourism & destination', f: [
      ['visitorsM', 'Annual visitors', function (p) { return U.n1(p.visitorsM) + 'M'; }],
      ['visitorG', 'Visitation growth', function (p) { return U.pctS(p.visitorG); }],
      ['visitSpendM', 'Visitor spending', function (p) { return U.usdM(p.visitSpendM); }],
      ['luxRooms', 'Luxury hotel rooms', function (p) { return U.n0(p.luxRooms); }],
      ['adr', 'Peak luxury ADR', function (p) { return U.usdFull(p.adr); }],
      ['occ', 'Annual occupancy', function (p) { return U.pct(p.occ, 0); }],
      ['seasonIdx', 'Year-round demand balance', function (p) { return p.seasonIdx + ' / 100'; }]
    ] },
    { l: 'Prestige & exclusivity', f: [
      ['repIdx', 'National / international recognition', function (p) { return p.repIdx + ' / 100'; }],
      ['clubIdx', 'Private club ecosystem', function (p) { return p.clubIdx + ' / 100'; }],
      ['celebIdx', 'Billionaire & celebrity presence', function (p) { return p.celebIdx + ' / 100'; }],
      ['hospIdx', 'Five-star hotels & dining', function (p) { return p.hospIdx + ' / 100'; }],
      ['retailIdx', 'Luxury retail & galleries', function (p) { return p.retailIdx + ' / 100'; }],
      ['schoolIdx', 'Private schools', function (p) { return p.schoolIdx + ' / 100'; }],
      ['privacyIdx', 'Privacy & discretion', function (p) { return p.privacyIdx + ' / 100'; }],
      ['entryBarIdx', 'Difficulty of entry', function (p) { return p.entryBarIdx + ' / 100'; }]
    ] },
    { l: 'Access & infrastructure', f: [
      ['jetOps', 'GA jet operations', function (p) { return U.n0(p.jetOps) + 'k per year'; }],
      ['nonstops', 'Nonstop destinations', function (p) { return U.n0(p.nonstops); }],
      ['metroMin', 'Drive to nearest metro >500k', function (p) { return p.metroMin + ' min'; }],
      ['roadIdx', 'Road & highway access', function (p) { return p.roadIdx + ' / 100'; }],
      ['airInvestM', 'Committed airport capital', function (p) { return U.usdM(p.airInvestM); }]
    ] },
    { l: 'Business environment & risk', f: [
      ['propTax', 'Effective property tax', function (p) { return U.pct(p.propTax, 2); }],
      ['incomeTax', 'Top state income tax', function (p) { return U.pct(p.incomeTax, 2); }],
      ['insIdx', 'Insurance stress', function (p) { return p.insIdx + ' / 100'; }],
      ['regIdx', 'Regulatory burden', function (p) { return p.regIdx + ' / 100'; }],
      ['climIdx', 'Physical climate risk', function (p) { return p.climIdx + ' / 100'; }],
      ['structIdx', 'Structural tailwind alignment', function (p) { return p.structIdx + ' / 100'; }]
    ] }
  ];

  function dataTables(r) {
    var m = r.m, p = m.p;
    return DATA_GROUPS.map(function (g) {
      return '<div class="panel" style="margin-bottom:10px"><header><h3>' + U.esc(g.l) + '</h3></header>' +
        '<table class="grid"><tbody>' +
        g.f.map(function (f) {
          var pctile = null;
          return '<tr style="cursor:default"><td class="l dim" style="width:56%">' + U.esc(f[1]) + provTag(f[0], m) + '</td>' +
            '<td>' + U.esc(f[2](p)) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }).join('');
  }

  function pipelineSection(r) {
    var projs = ST.projects(r.id);
    var itemised = U.sum(projs, function (x) { return x.valueM; });
    var total = r.m.p.pipelineM;
    var gap = Math.max(0, total - itemised);

    var head = '<div class="gridcards g3 mb10">' +
      '<div class="kpi"><div class="k">Announced pipeline</div><div class="v">' + U.usdM(total) + '</div><div class="s">five-year, estimated</div></div>' +
      '<div class="kpi"><div class="k">Named & sourced projects</div><div class="v">' + projs.length + '</div><div class="s">' + U.usdM(itemised) + ' itemised</div></div>' +
      '<div class="kpi"><div class="k">Un-itemised</div><div class="v">' + U.usdM(gap) + '</div><div class="s">' +
      (total > 0 ? U.pct(gap / total * 100, 0) : '—') + ' of the estimate</div></div></div>';

    if (!projs.length) {
      return head + '<div class="callout amber"><b>No individually-sourced projects recorded for this market.</b>' +
        '<p style="margin:5px 0 0;font-size:12.5px">The pipeline figure above is an analyst estimate built from county and municipal ' +
        'development-application volumes, not from a verified project list. Before this number is used in an investment case it should be ' +
        'replaced with the planning department\'s active application register.</p></div>';
    }

    return head + projs.map(function (x) {
      return '<div class="panel" style="margin-bottom:8px"><div class="pad">' +
        '<div class="flex between center" style="gap:10px;flex-wrap:wrap;margin-bottom:5px">' +
        '<b style="font-size:13.5px">' + U.esc(x.name) + '</b>' +
        '<div class="flex gap6"><span class="pill">' + U.esc(x.status) + '</span>' +
        '<span class="pill ' + (x.conf === 'verified' ? 'live' : x.conf === 'reported' ? '' : 'warn') + '">' + U.esc(x.conf) + ' value</span>' +
        '<span class="pill hot">' + U.usdM(x.valueM) + '</span></div></div>' +
        '<div class="dim mono" style="font-size:10.5px;margin-bottom:5px">' + U.esc(x.developer) + ' · ' + U.esc(x.type) +
        (x.units ? ' · ' + U.n0(x.units) + ' units' : '') + ' · ' + x.start + '–' + x.complete + '</div>' +
        '<p class="dim" style="font-size:12px;margin:0 0 5px;line-height:1.55">' + U.esc(x.note) + '</p>' +
        '<div class="dim2 mono" style="font-size:10px">' + U.esc(x.src) +
        (x.url ? ' · <a href="' + U.esc(x.url) + '" target="_blank" rel="noopener">source</a>' : '') + '</div>' +
        '</div></div>';
    }).join('');
  }

  function anchorsSection(r) {
    var a = r.m.anchors || [];
    if (!a.length) {
      return '<div class="callout red"><b>No externally verified figures recorded for this market.</b>' +
        '<p style="margin:5px 0 0;font-size:12.5px">Every number in the profile above is either a reported statistic carried at its ' +
        'default provenance tier or an analyst estimate. The data confidence score of ' + r.confidence +
        ' reflects that. Treat this market as a screening candidate only.</p></div>';
    }
    return a.map(function (x) {
      return '<div class="anchor"><div class="f">' + U.esc(x.fact) + '</div>' +
        '<div class="s">' + U.esc(x.src) + ' · ' + U.esc(x.date) +
        (x.url ? ' · <a href="' + U.esc(x.url) + '" target="_blank" rel="noopener">source</a>' : '') + '</div></div>';
    }).join('');
  }

  function confidenceSection(r) {
    var c = r.conf, band = U.confBand(c.score);
    var counts = c.counts, tiers = ST.MODEL.TIERS;
    return '<div class="gridcards g2">' +
      '<div class="panel"><header><h3>Data confidence</h3></header><div class="pad">' +
      '<div class="flex gap14 center mb10">' + CH.gauge(c.score, { size: 108, color: band.color, label: 'CONFIDENCE' }) +
      '<div><b style="color:' + band.color + ';font-size:14px">' + U.esc(band.label) + '</b>' +
      '<p class="dim" style="font-size:12px;margin:5px 0 0;line-height:1.55">' + U.esc(band.desc) + '</p></div></div>' +
      '<div class="stat"><span class="sl">Provenance-weighted tier score</span><span class="sv">' + c.tierScore + ' / 100</span></div>' +
      '<div class="stat"><span class="sl">Externally cited figures</span><span class="sv">' + c.anchors + '</span></div>' +
      '<div class="stat"><span class="sl">Source recency</span><span class="sv">' + c.recency + ' / 100</span></div>' +
      '<div class="stat"><span class="sl">Estimator disagreement</span><span class="sv">' + U.n2(c.dispersion) + 'x' +
      (c.dispersionPenalty ? ' <span class="down">−' + U.n1(c.dispersionPenalty) + '</span>' : '') + '</span></div>' +
      '<p class="dim2" style="font-size:11px;margin:9px 0 0;line-height:1.5">The luxury-starts figure is estimated two independent ways — ' +
      'from permits and from closings. The ratio between them is shown above; the further from 1.0, the more the market\'s permit data and ' +
      'its transaction data disagree, and the more the confidence score is reduced.</p>' +
      '</div></div>' +
      '<div class="panel"><header><h3>Provenance mix</h3><span class="tiny">' + c.fieldCount + ' input fields</span></header><div class="pad">' +
      Object.keys(tiers).map(function (t) {
        var n = counts[t] || 0;
        if (!n) return '';
        return '<div style="margin-bottom:9px"><div class="flex between center" style="margin-bottom:3px">' +
          '<span class="prov ' + t + '" style="margin:0">' + U.esc(tiers[t].label) + '</span>' +
          '<span class="mono dim">' + n + ' fields · ' + U.pct(n / c.fieldCount * 100, 0) + '</span></div>' +
          U.bar(n / c.fieldCount * 100, t === 'verified' ? U.cssvar('--s1', '#3f9e8c') : t === 'reported' ? U.cssvar('--s0', '#4a6fa5') : t === 'modelled' ? U.cssvar('--accent', '#1c5fd4') : t === 'estimated' ? U.cssvar('--s3', '#e8b13c') : U.cssvar('--ink-3', '#767c87')) +
          '<p class="dim2" style="font-size:10.5px;margin:4px 0 0;line-height:1.45">' + U.esc(tiers[t].desc) + '</p></div>';
      }).join('') + '</div></div></div>';
  }

  function scoreSection(r) {
    var e = r.e;
    var wf = e.catRows.map(function (c) {
      return { label: c.label, v: c.contrib, w: c.weight, score: c.v };
    });
    return '<div class="gridcards g2 mb16">' +
      '<div class="panel"><header><h3>How the LCDOS score is built</h3>' +
      '<span class="tiny">weighted contribution of each category</span></header><div class="pad">' +
      CH.waterfall(wf, { width: 620 }) + '</div></div>' +
      '<div class="panel"><header><h3>Category profile</h3></header><div class="pad" style="display:flex;justify-content:center">' +
      CH.radar(ST.MODEL.CATEGORIES.map(function (c) {
        return { label: c.label, short: c.key };
      }), [{ values: ST.MODEL.CATEGORIES.map(function (c) { return e.cat[c.id]; }), color: U.scoreColor(e.lcdos) }], { size: 360 }) +
      '</div></div></div>';
  }

  function indicatorDetail(r) {
    var e = r.e;
    return ST.MODEL.CATEGORIES.map(function (c) {
      var parts = e.catParts[c.id];
      return '<div class="panel" style="margin-bottom:10px"><header>' +
        '<h3>' + c.key + ' · ' + U.esc(c.label) + '</h3>' +
        '<div class="flex gap6 center"><span class="pill">weight ' + c.weight + '%</span>' + U.scoreChip(e.cat[c.id]) + '</div></header>' +
        '<div class="pad"><p class="dim" style="font-size:12px;margin:0 0 10px;line-height:1.55">' + U.esc(c.blurb) + '</p>' +
        '<table class="grid"><thead><tr><th class="l">Indicator</th><th>Weight</th><th>Value</th><th>Score</th><th style="width:110px">vs universe</th></tr></thead><tbody>' +
        parts.map(function (pt) {
          var ind = c.indicators.filter(function (x) { return x.id === pt.id; })[0];
          var unit = e.indUnit[pt.id];
          return '<tr style="cursor:default"><td class="l"><b style="font-weight:520;font-size:12px">' + U.esc(pt.label) + '</b>' +
            '<div class="dim2" style="font-size:11px;line-height:1.45;margin-top:2px">' + U.esc(ind ? ind.why : '') + '</div></td>' +
            '<td class="dim">' + pt.w + '%</td>' +
            '<td>' + U.esc(unit || '—') + '</td>' +
            '<td>' + U.scoreChip(pt.v) + '</td>' +
            '<td>' + U.bar(pt.v) + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }).join('');
  }

  function historySection(r) {
    var h = ST.hist(r.id);
    return '<div class="gridcards g2">' +
      '<div class="panel"><header><h3>Score history & projection</h3>' +
      '<span class="tiny">solid = modelled reconstruction · dashed = projection</span></header><div class="pad">' +
      CH.lines([{ name: r.m.name, color: U.scoreColor(r.lcdos), points: h.map(function (x) { return { x: x.year, y: x.score, kind: x.kind }; }) }],
        { width: 560, height: 240, xTicks: [2021, 2023, 2026, 2028, 2031], markX: 2026, markLabel: 'OBSERVED', yDomain: [30, 92] }) +
      '<div class="callout amber" style="margin-top:10px"><b>These are not historical observations.</b>' +
      '<p style="margin:4px 0 0;font-size:12px">The dataset holds a single observation date (' + ST.DATA.AS_OF + '). Years before it are ' +
      'reconstructed by unwinding the market\'s momentum; years after it are projected forward with the drift decaying and constrained by ' +
      'remaining land runway. Both are model output, not measurement.</p></div>' +
      '</div></div>' +
      '<div class="panel"><header><h3>Forecast horizons</h3></header><div class="pad">' +
      '<div class="flex gap14" style="justify-content:space-around;margin-bottom:12px">' +
      CH.gauge(r.f5, { size: 104, label: '5-YEAR' }) + CH.gauge(r.f10, { size: 104, label: '10-YEAR' }) + CH.gauge(r.f20, { size: 104, label: '20-YEAR' }) +
      '</div>' +
      '<div class="stat"><span class="sl">Momentum index</span><span class="sv">' + U.scoreChip(r.momentum) + ' <span class="dim mono" style="font-size:11px">' + U.pctS(r.momentumRate) + '/yr</span></span></div>' +
      '<div class="stat"><span class="sl">Land runway</span><span class="sv">' + U.scoreChip(r.e.landRunway) + '</span></div>' +
      '<div class="stat"><span class="sl">Structural alignment</span><span class="sv">' + U.scoreChip(r.m.p.structIdx) + '</span></div>' +
      '<div class="stat"><span class="sl">Long-run risk</span><span class="sv">' + U.scoreChip(100 - r.risk) + ' <span class="dim" style="font-size:11px">(inverted)</span></span></div>' +
      '<div class="sep"></div>' +
      CH.hbars(r.e.riskParts.map(function (p) { return { label: p.label, v: p.v, w: p.w, color: U.scoreColor(100 - p.v) }; }),
        { width: 500, labelW: 190, valW: 44, rowH: 22 }) +
      '</div></div></div>';
  }

  function narrative(r) {
    var P = (typeof LCDOS_PROFILES !== 'undefined') ? LCDOS_PROFILES[r.id] : null;
    if (!P) {
      return '<div class="callout"><b>No long-form deep dive has been written for this market.</b>' +
        '<p style="margin:5px 0 0;font-size:12.5px">Institutional profiles are written for the top-ranked markets. ' +
        'Everything below is generated directly from the data and the model, and is complete regardless.</p></div>';
    }
    var out = [];
    P.sections.forEach(function (s) {
      out.push('<h2 id="sec-' + U.esc(s.id) + '">' + U.esc(s.title) + '</h2>');
      if (s.lede) out.push('<p class="lede">' + s.lede + '</p>');
      (s.paras || []).forEach(function (p) { out.push('<p>' + p + '</p>'); });
      if (s.bullets) out.push('<ul>' + s.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>');
      if (s.chain) {
        out.push('<div class="stage-chain">' + s.chain.map(function (c, i) {
          return '<div class="sc"><div class="n">STAGE ' + (i + 1) + ' · ' + U.esc(c.when) + '</div>' +
            '<div class="t">' + U.esc(c.title) + '</div><div class="d">' + U.esc(c.desc) + '</div></div>';
        }).join('') + '</div>');
      }
      if (s.risks) {
        out.push(s.risks.map(function (rk) {
          return '<div class="risk"><b>' + U.esc(rk.t) + '</b><p>' + rk.d + '</p></div>';
        }).join(''));
      }
    });
    return out.join('');
  }

  var tabs = [
    { id: 'brief', l: 'Briefing' },
    { id: 'scores', l: 'Score build-up' },
    { id: 'indicators', l: 'All 70 indicators' },
    { id: 'data', l: 'Underlying data' },
    { id: 'pipeline', l: 'Development pipeline' },
    { id: 'outlook', l: 'History & outlook' },
    { id: 'quality', l: 'Data quality' }
  ];
  var tab = 'brief';

  function render(root) {
    body = root;
    var id = ST.S.selected || ST.DER.ranked[0].id;
    var r = ST.get(id);
    var m = r.m, e = r.e;
    var sigs = ST.DER.signals[id] || [];

    var content;
    if (tab === 'brief') {
      content = '<div class="gridcards g4 mb16">' +
        '<div class="kpi"><div class="k">LCDOS overall</div><div class="v" style="color:' + U.scoreColor(e.lcdos) + '">' + U.n1(e.lcdos) + '</div><div class="s">rank #' + r.rank + ' of ' + ST.DER.ranked.length + '</div></div>' +
        '<div class="kpi"><div class="k">GC entry opportunity</div><div class="v" style="color:' + U.scoreColor(e.gce) + '">' + U.n1(e.gce) + '</div><div class="s">rank #' + r.rank_gce + '</div></div>' +
        '<div class="kpi"><div class="k">Developer opportunity</div><div class="v" style="color:' + U.scoreColor(e.dev) + '">' + U.n1(e.dev) + '</div><div class="s">rank #' + r.rank_dev + '</div></div>' +
        '<div class="kpi"><div class="k">Opportunity gap</div><div class="v" style="color:' + U.scoreColor(e.gap) + '">' + U.n1(e.gap) + '</div><div class="s">upside ' + U.n0(e.flu) + ' vs maturity ' + U.n0(e.cls) + '</div></div>' +
        '</div>' +
        (sigs.length ? '<div class="gridcards g3 mb16">' + sigs.map(function (s) {
          return '<div class="alert sev' + s.sev + '"><h5>' +
            (s.kind === 'risk' ? '<span style="color:var(--neg)">▲</span>' : '<span style="color:var(--accent)">●</span>') +
            U.esc(s.label) + '</h5><p>' + U.esc(s.why) + '</p></div>';
        }).join('') + '</div>' : '') +
        narrative(r);
    } else if (tab === 'scores') {
      content = scoreSection(r) + '<h2>Score components</h2>' +
        '<div class="gridcards g3">' +
        e.catRows.map(function (c) {
          return '<div class="kpi"><div class="k">' + U.esc(c.label) + ' · ' + c.weight + '%</div>' +
            '<div class="v" style="color:' + U.scoreColor(c.v) + '">' + U.n1(c.v) + '</div>' +
            '<div class="s">contributes ' + U.n1(c.contrib) + ' points</div></div>';
        }).join('') + '</div>' +
        '<h2>Derived scores</h2><div class="gridcards g4">' +
        [['Current luxury strength', e.cls], ['Future luxury upside', e.flu], ['Opportunity gap', e.gap],
         ['Momentum', e.momentum], ['5-year outlook', e.f5], ['10-year outlook', e.f10],
         ['20-year outlook', e.f20], ['Long-run risk (inverted)', 100 - e.risk]].map(function (x) {
          return '<div class="kpi"><div class="k">' + U.esc(x[0]) + '</div><div class="v" style="color:' + U.scoreColor(x[1]) + '">' + U.n1(x[1]) + '</div></div>';
        }).join('') + '</div>';
    } else if (tab === 'indicators') {
      content = indicatorDetail(r);
    } else if (tab === 'data') {
      content = '<div class="callout"><b>Every field carries its provenance tier.</b>' +
        '<p style="margin:5px 0 0;font-size:12.5px">Hover any tag for the source and as-of date. ' +
        '<span class="prov verified">verified</span> and <span class="prov reported">reported</span> fields come from named sources; ' +
        '<span class="prov modelled">modelled</span> fields are computed from other fields by a documented transform; ' +
        '<span class="prov estimated">estimated</span> and <span class="prov rubric">rubric</span> fields are analyst judgement.</p></div>' +
        '<div class="gridcards g2 mt16">' + dataTables(r) + '</div>' +
        '<h2>Externally verified figures</h2>' + anchorsSection(r);
    } else if (tab === 'pipeline') {
      content = pipelineSection(r);
    } else if (tab === 'outlook') {
      content = historySection(r);
    } else {
      content = confidenceSection(r) + '<h2>Externally verified figures</h2>' + anchorsSection(r);
    }

    body.innerHTML = '<div class="stage"><div class="scrollstage">' +
      '<div class="profile">' +
      '<div class="flex between center" style="flex-wrap:wrap;gap:10px">' +
      '<div><div class="tiny">' + U.esc(m.state) + ' · ' + U.esc(m.county) + ' · rank #' + r.rank + '</div>' +
      '<h1>' + U.esc(m.name) + '</h1></div>' +
      '<div class="flex gap6 printhide">' +
      '<button class="btn" data-act="map">Show on map</button>' +
      '<button class="btn" data-act="cmp">' + (ST.S.compare.indexOf(id) >= 0 ? '✓ In comparison' : '+ Compare') + '</button>' +
      '<button class="btn on" data-act="ic">Investment thesis</button>' +
      '</div></div>' +
      '<div class="tagrow">' +
      '<span class="pill">' + U.esc(ST.DATA.ARCHETYPES[m.archetype].label) + '</span>' +
      '<span class="pill">' + U.esc(ST.DATA.TIER_LABELS[m.tier]) + '</span>' +
      '<span class="pill">' + U.esc(m.region) + '</span>' +
      (e.entryAlert ? '<span class="pill hot">Entry opportunity alert</span>' : '') +
      '<span class="pill" style="color:' + U.confBand(r.confidence).color + '">Confidence ' + r.confidence + ' · ' + U.esc(U.confBand(r.confidence).label) + '</span>' +
      '</div>' +
      '<p class="lede">' + U.esc(m.blurb) + '</p>' +
      '<div class="flex gap6 mb16 printhide" style="flex-wrap:wrap;border-bottom:1px solid var(--hairline-2);padding-bottom:10px">' +
      tabs.map(function (t) {
        return '<button class="chip' + (tab === t.id ? ' on' : '') + '" data-mtab="' + t.id + '">' + U.esc(t.l) + '</button>';
      }).join('') + '</div>' +
      content +
      '</div></div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', '[data-mtab]', function (e, t) { tab = t.dataset.mtab; render(body); });
    U.on(body, 'click', '[data-act]', function (e, t) {
      var a = t.dataset.act, id = ST.S.selected;
      if (a === 'map') { ST.set({ view: 'terminal' }, 'view'); setTimeout(function () { MAP.focusMarket(id); }, 60); }
      else if (a === 'cmp') { ST.toggleCompare(id); render(body); }
      else if (a === 'ic') ST.set({ view: 'ic' }, 'view');
    });
  }

  return { render: render, setTab: function (t) { tab = t; }, onEvent: function (w) { if (body && (w === 'select' || w === 'scenario')) render(body); } };
})(STORE, U, CH);

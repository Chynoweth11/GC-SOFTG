/* ============================================================================
 * views/overview.js — the home surface.
 * Leads with the answer, then the evidence. Everything here is a doorway into
 * a deeper module, so the product can be understood in one screen and operated
 * from one screen.
 * ==========================================================================*/
var V_OVERVIEW = (function (ST, U, CH) {
  'use strict';
  var body = null;

  function answerCard(kicker, question, rows, scoreKey, note) {
    var top = rows[0];
    return '<div class="panel ansc">' +
      '<div class="pad">' +
      '<div class="tiny" style="margin-bottom:6px">' + U.esc(kicker) + '</div>' +
      '<div class="ansq">' + U.esc(question) + '</div>' +
      '<button class="ansbig" data-id="' + top.id + '">' +
      '<span class="ansrk">1</span>' +
      '<span class="ansname">' + U.esc(top.m.name) + '</span>' +
      '<span class="ansmeta">' + U.esc(top.m.state) + ' · ' + U.esc(top.m.county) + '</span>' +
      '<span class="ansscore"><b>' + U.n1(top[scoreKey]) + '</b>' +
      '<i style="background:' + U.scoreColor(top[scoreKey]) + '"></i></span>' +
      '</button>' +
      '<div class="ansrest">' +
      rows.slice(1, 5).map(function (r, i) {
        return '<button class="ansrow" data-id="' + r.id + '">' +
          '<span class="ansrk">' + (i + 2) + '</span>' +
          '<span class="ansrn">' + U.esc(r.m.name) + '</span>' +
          '<span class="ansscore sm"><b>' + U.n1(r[scoreKey]) + '</b>' +
          '<i style="background:' + U.scoreColor(r[scoreKey]) + '"></i></span>' +
          '</button>';
      }).join('') +
      '</div>' +
      '<p class="dim" style="font-size:12px;margin:12px 0 0;line-height:1.55">' + note + '</p>' +
      '</div></div>';
  }

  function dataStatus() {
    var obs = ST.observed ? ST.observed() : { ran: false };
    var rows = ST.DER.ranked;
    var confs = rows.map(function (r) { return r.confidence; }).sort(function (a, b) { return a - b; });
    var median = U.quantile(confs, 0.5);
    var band = U.confBand(median);

    var body_ = obs.ran
      ? '<div class="stat"><span class="sl">Observed values applied</span><span class="sv">' + U.n0(obs.applied) + ' across ' + obs.markets + ' markets</span></div>' +
        (obs.manifest && obs.manifest.sources ? Object.keys(obs.manifest.sources).map(function (k) {
          var s = obs.manifest.sources[k];
          return '<div class="stat"><span class="sl">' + U.esc(k) + '</span><span class="sv">' +
            (s.ok ? '<span class="up">live</span> <span class="dim">as of ' + U.esc(s.asOf) + '</span>'
                  : '<span class="down">unreachable</span>') + '</span></div>';
        }).join('') : '')
      : '<p class="dim" style="font-size:12.5px;margin:0 0 10px;line-height:1.6">No ingest has run in this build, so every figure is carried by the ' +
        'analyst layer. Run <code class="mono">node tools/ingest</code> to pull Census, BLS, IRS, FEMA and Zillow data; ' +
        'the values and their provenance tiers update automatically and confidence scores rise on their own.</p>';

    return '<div class="panel"><header><h3>Data status</h3>' +
      '<span class="pill ' + (obs.ran ? 'live' : 'warn') + '">' + (obs.ran ? 'Observed layer active' : 'Analyst layer') + '</span></header>' +
      '<div class="pad">' + body_ +
      '<div class="sep"></div>' +
      '<div class="flex between center" style="gap:12px">' +
      '<div><div class="tiny">Median data confidence</div>' +
      '<div class="mono" style="font-size:22px;font-weight:600;color:' + band.color + ';letter-spacing:-.02em">' +
      U.n0(median) + '<span class="dim" style="font-size:12px;font-weight:400"> / 100</span></div>' +
      '<div class="dim" style="font-size:12px">' + U.esc(band.label) + '</div></div>' +
      '<div style="flex:1 1 auto;max-width:220px">' + U.bar(median, band.color) +
      '<p class="dim2" style="font-size:11px;margin:8px 0 0;line-height:1.45">' + U.esc(band.desc) + '</p></div>' +
      '</div></div></div>';
  }

  function alertsPanel() {
    var top = ST.DER.alerts.filter(function (a) { return a.sig.sev >= 3 && a.sig.kind === 'opportunity'; }).slice(0, 6);
    return '<div class="panel"><header><h3>Priority signals</h3>' +
      '<button class="flink" data-go="analysis">See all ' + ST.DER.alerts.length + ' →</button></header>' +
      '<div class="pad" style="display:flex;flex-direction:column;gap:8px">' +
      top.map(function (a) {
        return '<div class="alert sev' + a.sig.sev + '" data-id="' + a.market + '" style="cursor:pointer">' +
          '<h5>' + U.esc(a.sig.label) + '<span class="tag" style="margin-left:auto">' + U.esc(a.name.split(' &')[0]) + '</span></h5>' +
          '<p>' + U.esc(a.sig.why) + '</p></div>';
      }).join('') + '</div></div>';
  }

  function topTable() {
    var rows = ST.DER.ranked.slice(0, 10);
    return '<div class="panel"><header><h3>Top 10 by overall opportunity</h3>' +
      '<button class="flink" data-go="rankings">Full league table →</button></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr>' +
      '<th style="width:34px">#</th><th class="l">Market</th><th>LCDOS</th><th>GC entry</th><th>Developer</th>' +
      '<th>Opp gap</th><th>Momentum</th><th>10-yr</th><th>Conf</th><th>Trend</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var h = ST.hist(r.id);
        return '<tr data-id="' + r.id + '"><td><span class="rank">' + r.rank + '</span></td>' +
          '<td class="l"><b style="font-weight:600">' + U.esc(r.m.name) + '</b>' +
          '<div class="dim2" style="font-size:11px">' + U.esc(r.m.state + ' · ' + ST.DATA.ARCHETYPES[r.m.archetype].label) + '</div></td>' +
          '<td>' + U.scoreChip(r.lcdos) + '</td><td>' + U.scoreChip(r.gce) + '</td><td>' + U.scoreChip(r.dev) + '</td>' +
          '<td>' + U.scoreChip(r.gap) + '</td><td>' + U.scoreChip(r.momentum) + '</td><td>' + U.scoreChip(r.f10) + '</td>' +
          '<td><span class="mono" style="color:' + U.confBand(r.confidence).color + '">' + r.confidence + '</span></td>' +
          '<td>' + CH.spark(h.map(function (x) { return x.score; }), { width: 60, height: 16, color: U.scoreColor(r.lcdos) }) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function render(root) {
    body = root;
    var rows = ST.DER.ranked;
    var byGce = rows.slice().sort(function (a, b) { return b.gce - a.gce; });
    var byDev = rows.slice().sort(function (a, b) { return b.dev - a.dev; });
    var byGap = rows.slice().filter(function (r) { return r.cls < 65; }).sort(function (a, b) { return b.gap - a.gap; });

    var volume = U.sum(rows, function (r) { return r.e.derived.luxStartsVolumeM; });
    var pipeline = U.sum(rows, function (r) { return r.m.p.pipelineM; });
    var alerts = rows.filter(function (r) { return r.e.entryAlert; }).length;

    body.innerHTML = '<div class="stage"><div class="scrollstage viewfade">' +
      '<div class="ovwrap">' +

      '<header class="ovhero"><div class="hrow">' +
      '<div><div class="tiny">LCDOS ' + ST.MODEL.VERSION + ' · ' + rows.length + ' markets · data as of ' + ST.DATA.AS_OF + '</div>' +
      '<h1>Where to build a high-end construction and development business.</h1></div>' +
      '<div><p>Seventy-nine U.S. markets scored on ten weighted categories and seventy indicators.</p>' +
      '<p>The overall score answers which markets are strongest. That is not the same question as where <em>you</em> should start — ' +
      'so the model reports that separately, and separately again for where to acquire land.</p></div>' +
      '</div></header>' +

      '<div class="gridcards g3 mb16">' +
      answerCard('Question one', 'Where should we start our GC today?', byGce, 'gce',
        'Ranked on addressable luxury volume against incumbent capacity, client wealth, trade availability, permitting friction and how closed the referral network is.') +
      answerCard('Question two', 'Where should we acquire land now?', byDev, 'dev',
        'Ranked on land availability and runway, entitlement feasibility, the value-creation spread, housing shortage, water and infrastructure.') +
      answerCard('Question three', 'Where is it not obvious yet?', byGap, 'gap',
        'The Opportunity Gap: how far future upside runs ahead of current luxury maturity. Above 50 means demand is forming faster than the market can serve it.') +
      '</div>' +

      '<div class="gridcards g4 mb16">' +
      kpi('Addressable luxury construction', U.usdM(volume), 'modelled annual $2M+ volume across all markets') +
      kpi('Announced development pipeline', U.usdM(pipeline), 'five-year, all 79 markets') +
      kpi('Entry opportunity alerts', String(alerts), 'high demand against low contractor capacity') +
      kpi('Active signals', String(ST.DER.alerts.length), 'across 21 rules on the underlying data') +
      '</div>' +

      topTable() +

      '<div class="gridcards g2 mt16">' + alertsPanel() + dataStatus() + '</div>' +

      '<div class="ovnav mt24">' +
      [['map', 'Map', 'Explore all 79 markets geographically, with 37 data layers and county drill-down.'],
       ['rankings', 'Rankings', 'The full league table, sortable on any column, with CSV export.'],
       ['analysis', 'Analysis', 'The opportunity matrix, supply-vs-demand, and the emerging-market radar.'],
       ['compare', 'Compare', 'Two to ten markets side by side across every score and input.'],
       ['simulate', 'Simulate', 'Company fit, developer pro-forma, and scenario stress tests.'],
       ['method', 'Method', 'Every weight, every formula, every source, and an honest data-quality account.']
      ].map(function (x) {
        return '<button class="ovnavcard" data-go="' + x[0] + '">' +
          '<b>' + U.esc(x[1]) + '</b><span>' + U.esc(x[2]) + '</span></button>';
      }).join('') +
      '</div>' +

      '</div></div></div>';
    wire();
  }

  function kpi(k, v, s) {
    return '<div class="kpi"><div class="k">' + U.esc(k) + '</div><div class="v">' + v + '</div><div class="s">' + U.esc(s) + '</div></div>';
  }

  function wire() {
    U.on(body, 'click', '[data-id]', function (e, t) {
      ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view');
    });
    U.on(body, 'click', '[data-go]', function (e, t) { ST.set({ view: t.dataset.go }, 'view'); });
  }

  return { render: render, onEvent: function (w) { if (body && (w === 'scenario')) render(body); } };
})(STORE, U, CH);

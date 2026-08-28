/* ============================================================================
 * views/radar.js — Emerging Market Radar + alert feed + momentum index.
 * ==========================================================================*/
var V_RADAR = (function (ST, U, CH) {
  'use strict';
  var body = null;
  var filterKind = 'all', filterRule = null;

  /* A market is "flagged" when its fundamentals are accelerating well ahead of
   * its recognition — momentum and opportunity gap both high, current luxury
   * maturity still moderate. */
  function flagged() {
    return ST.filtered().filter(function (r) {
      return r.momentum >= 55 && r.gap >= 58 && r.cls < 70;
    }).sort(function (a, b) {
      return (b.momentum * 0.55 + b.gap * 0.45) - (a.momentum * 0.55 + a.gap * 0.45);
    });
  }

  function radarCard(r) {
    var sigs = (ST.DER.signals[r.id] || []).filter(function (s) { return s.kind === 'opportunity'; });
    var risks = (ST.DER.signals[r.id] || []).filter(function (s) { return s.kind === 'risk'; });
    var h = ST.hist(r.id);
    return '<div class="panel" style="margin-bottom:10px" data-id="' + r.id + '">' +
      '<header><h3>' + U.esc(r.m.name) + ' <span class="dim2">' + U.esc(r.m.state) + '</span></h3>' +
      '<div class="flex gap6 center">' +
      CH.spark(h.map(function (x) { return x.score; }), { width: 72, height: 16, color: U.scoreColor(r.lcdos) }) +
      '<span class="pill">#' + r.rank + '</span>' + U.scoreChip(r.lcdos) + '</div></header>' +
      '<div class="pad">' +
      '<div class="gridcards g4 mb10">' +
      mini('Momentum', U.n0(r.momentum), U.pctS(r.momentumRate) + '/yr', U.scoreColor(r.momentum)) +
      mini('Opportunity gap', U.n0(r.gap), 'upside ' + U.n0(r.flu) + ' vs maturity ' + U.n0(r.cls), U.scoreColor(r.gap)) +
      mini('GC entry', U.n0(r.gce), 'rank #' + r.rank_gce, U.scoreColor(r.gce)) +
      mini('Developer', U.n0(r.dev), 'rank #' + r.rank_dev, U.scoreColor(r.dev)) +
      '</div>' +
      '<div class="flex" style="flex-wrap:wrap;gap:5px;margin-bottom:8px">' +
      sigs.map(function (s) { return '<span class="pill live">' + U.esc(s.label) + '</span>'; }).join('') +
      risks.map(function (s) { return '<span class="pill warn">' + U.esc(s.label) + '</span>'; }).join('') +
      '</div>' +
      '<p class="dim" style="font-size:11.5px;margin:0;line-height:1.55">' + U.esc(r.m.blurb) + '</p>' +
      '</div></div>';
  }
  function mini(k, v, s, c) {
    return '<div class="kpi" style="padding:8px 10px"><div class="k">' + U.esc(k) + '</div>' +
      '<div class="v" style="font-size:18px;color:' + c + '">' + v + '</div>' +
      '<div class="s" style="font-size:10px">' + U.esc(s) + '</div></div>';
  }

  function alertFeed() {
    var list = ST.DER.alerts.filter(function (a) {
      if (!ST.passes(ST.get(a.market))) return false;
      if (filterKind !== 'all' && a.sig.kind !== filterKind) return false;
      if (filterRule && a.sig.id !== filterRule) return false;
      return true;
    });
    if (!list.length) return '<div class="empty">No alerts match the current filters.</div>';
    return list.slice(0, 260).map(function (a) {
      return '<div class="alert sev' + a.sig.sev + '" style="margin-bottom:6px;cursor:pointer" data-id="' + a.market + '">' +
        '<h5>' + (a.sig.kind === 'risk' ? '<span style="color:var(--neg)">▲</span>' : '<span style="color:var(--accent)">●</span>') +
        U.esc(a.sig.label) + '<span class="tag" style="margin-left:auto">' + U.esc(a.name) + '</span></h5>' +
        '<p>' + U.esc(a.sig.why) + '</p></div>';
    }).join('');
  }

  function ruleFilters() {
    var counts = {};
    ST.DER.alerts.forEach(function (a) { counts[a.sig.id] = (counts[a.sig.id] || 0) + 1; });
    return ST.RULES.map(function (r) {
      if (!counts[r.id]) return '';
      return '<button class="chip' + (filterRule === r.id ? ' on' : '') + '" data-rule="' + r.id + '">' +
        U.esc(r.label) + ' <span class="dim2">' + counts[r.id] + '</span></button>';
    }).join('');
  }

  function momentumChart() {
    var rows = ST.filtered().slice().sort(function (a, b) { return b.momentum - a.momentum; }).slice(0, 24);
    return CH.hbars(rows.map(function (r) {
      return { label: r.m.name.replace(/ (&|and) .*$/, '').slice(0, 26), v: r.momentum, display: U.n0(r.momentum) + '  ' + U.pctS(r.momentumRate) };
    }), { width: 640, labelW: 210, valW: 96, rowH: 21 });
  }

  function scoreVsMomentum() {
    var pts = ST.filtered().map(function (r) {
      return {
        id: r.id, x: r.lcdos, y: r.momentum,
        r: 3.2 + 7 * U.clamp(Math.log(Math.max(r.e.derived.luxStartsVolumeM, 1) + 1) / Math.log(3200), 0, 1),
        color: U.scoreColor(r.gap), label: r.m.name.replace(/ (&|and) .*$/, '').slice(0, 18),
        showLabel: r.momentum >= 58 || r.lcdos >= 64, sel: r.id === ST.S.selected
      };
    });
    return CH.scatter(pts, {
      width: 980, height: 500, xDomain: [35, 80], yDomain: [20, 95], midX: 57, midY: 55,
      xLabel: 'LCDOS SCORE (level)  →', yLabel: 'MOMENTUM (rate of change)  →',
      quadrants: [
        { x: 'lo', y: 'hi', label: 'Early — accelerating, not yet priced', color: U.cssvar('--s4', '#a96434'), emphasis: true },
        { x: 'hi', y: 'hi', label: 'Compounding leaders', color: U.cssvar('--s1', '#3f9e8c') },
        { x: 'hi', y: 'lo', label: 'Established, slowing', color: U.cssvar('--s0', '#4a6fa5') },
        { x: 'lo', y: 'lo', label: 'Dormant', color: U.cssvar('--ink-3', '#767c87') }
      ]
    });
  }

  function render(root) {
    body = root;
    var fl = flagged();
    body.innerHTML =
      '<div class="rail"><div class="railsec"><h4>Radar logic</h4>' +
      '<p class="dim" style="font-size:11.5px;line-height:1.55;margin:0 0 8px">A market is flagged when three conditions hold at once: ' +
      'momentum index at or above 55, opportunity gap at or above 58, and current luxury maturity still below 70. ' +
      'That combination describes a market whose fundamentals are accelerating faster than its reputation.</p>' +
      '<p class="dim2" style="font-size:11px;line-height:1.5;margin:0">Every signal below is a stated condition on the underlying data, ' +
      'not a model output — so each flag can be traced back to the number that raised it.</p></div>' +
      '<div class="railsec"><h4>Alert kind</h4><div class="chips">' +
      ['all', 'opportunity', 'risk'].map(function (k) {
        return '<button class="chip' + (filterKind === k ? ' on' : '') + '" data-kind="' + k + '">' + U.esc(k) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="railsec"><h4>Signal type</h4><div class="chips">' +
      '<button class="chip' + (!filterRule ? ' on' : '') + '" data-rule="">All</button>' + ruleFilters() + '</div></div>' +
      '</div>' +

      '<div class="stage"><div class="scrollstage" style="padding:16px 18px 60px">' +
      '<div class="mb16"><h2 style="margin:0;font-size:18px;font-weight:600">Emerging market radar</h2>' +
      '<div class="dim" style="font-size:11.5px">' + fl.length + ' markets currently flagged · ' +
      ST.DER.alerts.length + ' active signals across the universe</div></div>' +

      '<div class="gridcards g2 mb16">' +
      '<div class="panel"><header><h3>Score against momentum</h3><span class="tiny">colour = opportunity gap</span></header>' +
      '<div class="pad" style="padding:6px">' + scoreVsMomentum() + '</div></div>' +
      '<div class="panel"><header><h3>Momentum index — top 24</h3><span class="tiny">rate of change, not level</span></header>' +
      '<div class="pad">' + momentumChart() + '</div></div>' +
      '</div>' +

      '<div class="gridcards g2">' +
      '<div><h3 style="font-size:12px;font-family:var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0 0 10px">Flagged markets</h3>' +
      (fl.length ? fl.map(radarCard).join('') : '<div class="empty">No markets flagged under the current filters.</div>') + '</div>' +
      '<div><h3 style="font-size:12px;font-family:var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0 0 10px">Signal feed</h3>' +
      '<div id="feed">' + alertFeed() + '</div></div>' +
      '</div></div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', '[data-kind]', function (e, t) { filterKind = t.dataset.kind; render(body); });
    U.on(body, 'click', '[data-rule]', function (e, t) { filterRule = t.dataset.rule || null; render(body); });
    U.on(body, 'click', '[data-id]', function (e, t) {
      ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view');
    });
    U.on(body, 'click', 'g.pt', function (e, t) { ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view'); });
  }

  return { render: render, onEvent: function (w) { if (body && (w === 'scenario')) render(body); } };
})(STORE, U, CH);

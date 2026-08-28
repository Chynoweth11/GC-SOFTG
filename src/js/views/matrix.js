/* ============================================================================
 * views/matrix.js — Opportunity Matrix and Construction Supply vs Demand.
 * ==========================================================================*/
var V_MATRIX = (function (ST, U, CH) {
  'use strict';
  var body = null;
  var mode = 'opportunity';

  /* Quadrant hues come from the hypsometric ramp so the chart reads as one
     system with the map and the score chips, in either theme. */
  function Q(name, fb) { return U.cssvar(name, fb); }
  var QC = {
    elite:   function () { return Q('--s1', '#3f9e8c'); },
    emerge:  function () { return Q('--s3', '#e8b13c'); },
    mature:  function () { return Q('--s0', '#4a6fa5'); },
    spec:    function () { return Q('--ink-3', '#767c87'); },
    alert:   function () { return Q('--s4', '#df7a33'); },
    served:  function () { return Q('--s0', '#4a6fa5'); },
    thin:    function () { return Q('--ink-3', '#767c87'); },
    over:    function () { return Q('--s5', '#b8442a'); }
  };

  function points(kind) {
    var sel = ST.S.selected, cmp = ST.S.compare;
    return ST.filtered().map(function (r) {
      var x, y;
      if (kind === 'opportunity') { x = r.cls; y = r.flu; }
      else { x = r.demandIdx; y = r.capacityIdx; }
      return {
        id: r.id, x: x, y: y,
        r: 3.2 + 8 * U.clamp(Math.log(Math.max(r.e.derived.luxStartsVolumeM, 1) + 1) / Math.log(3200), 0, 1),
        color: U.scoreColor(kind === 'opportunity' ? r.lcdos : (r.e.entryAlert ? 88 : r.gce)),
        label: r.m.name.replace(/ (&|and) .*$/, '').slice(0, 20),
        sel: r.id === sel || cmp.indexOf(r.id) >= 0,
        showLabel: r.lcdos >= 62 || r.id === sel || cmp.indexOf(r.id) >= 0
      };
    });
  }

  function chartOpportunity() {
    return CH.scatter(points('opportunity'), {
      width: 1000, height: 600, xDomain: [20, 95], yDomain: [35, 85], midX: 60, midY: 62,
      xLabel: 'CURRENT LUXURY MATURITY  →', yLabel: 'FUTURE GROWTH POTENTIAL  →',
      quadrants: [
        { x: 'hi', y: 'hi', label: 'Elite established', color: QC.elite() },
        { x: 'lo', y: 'hi', label: 'Emerging luxury', color: QC.emerge(), emphasis: true },
        { x: 'hi', y: 'lo', label: 'Mature luxury', color: QC.mature() },
        { x: 'lo', y: 'lo', label: 'Speculative', color: QC.spec() }
      ]
    });
  }

  function chartSupplyDemand() {
    return CH.scatter(points('supply'), {
      width: 1000, height: 600, xDomain: [25, 85], yDomain: [15, 80], midX: 58, midY: 48,
      xLabel: 'CONSTRUCTION DEMAND  →', yLabel: 'CONTRACTOR CAPACITY  →',
      quadrants: [
        { x: 'hi', y: 'lo', label: 'Entry opportunity alert', color: QC.alert(), emphasis: true },
        { x: 'hi', y: 'hi', label: 'Served — competitive', color: QC.served() },
        { x: 'lo', y: 'lo', label: 'Thin on both sides', color: QC.thin() },
        { x: 'lo', y: 'hi', label: 'Oversupplied contractors', color: QC.over() }
      ]
    });
  }

  function quadrantList() {
    var rows = ST.filtered();
    function q(fn) { return rows.filter(fn).sort(function (a, b) { return b.lcdos - a.lcdos; }); }
    var groups;
    if (mode === 'opportunity') {
      groups = [
        { l: 'Emerging luxury — the quadrant that matters', c: QC.emerge(), rows: q(function (r) { return r.cls < 60 && r.flu >= 62; }),
          d: 'Lower current luxury maturity, high future growth. Demand is forming faster than the market\'s luxury infrastructure and builder base can serve it. This is where a new firm compounds fastest.' },
        { l: 'Elite established', c: QC.elite(), rows: q(function (r) { return r.cls >= 60 && r.flu >= 62; }),
          d: 'High on both. Real work, real prestige, and real competition — the strongest markets to expand into once you have a reference book, not to start in.' },
        { l: 'Mature luxury', c: QC.mature(), rows: q(function (r) { return r.cls >= 60 && r.flu < 62; }),
          d: 'Extraordinary luxury strength, limited runway. Excellent remodel and teardown markets; almost no land development business available.' },
        { l: 'Speculative', c: QC.spec(), rows: q(function (r) { return r.cls < 60 && r.flu < 62; }),
          d: 'Neither established nor clearly accelerating. Some are genuinely early; most are simply small. Read the confidence score before acting on anything here.' }
      ];
    } else {
      groups = [
        { l: 'Entry opportunity alert — high demand, low capacity', c: QC.alert(), rows: q(function (r) { return r.demandIdx >= 58 && r.capacityIdx <= 48; }),
          d: 'Clients here cannot get a builder. This is a raw supply/demand screen, not a recommendation — check the GC Entry Score beside each name, because some of these markets are hard to be let into.' },
        { l: 'Served and competitive', c: QC.served(), rows: q(function (r) { return r.demandIdx >= 58 && r.capacityIdx > 48; }),
          d: 'Deep demand with a deep incumbent bench. Winnable, but on differentiation rather than availability.' },
        { l: 'Thin on both sides', c: QC.thin(), rows: q(function (r) { return r.demandIdx < 58 && r.capacityIdx <= 48; }),
          d: 'Small markets where the builder base matches the work. A firm can own one of these, but it will cap out.' },
        { l: 'Contractor oversupply', c: QC.over(), rows: q(function (r) { return r.demandIdx < 58 && r.capacityIdx > 48; }),
          d: 'More capable builders than luxury work. The hardest place to establish pricing power.' }
      ];
    }

    return groups.map(function (g) {
      return '<div class="panel" style="margin-bottom:12px"><header><h3 style="color:' + g.c + '">' + U.esc(g.l) +
        ' <span class="dim2">' + g.rows.length + '</span></h3></header><div class="pad">' +
        '<p class="dim" style="font-size:11.5px;margin:0 0 9px;line-height:1.55">' + U.esc(g.d) + '</p>' +
        '<div class="flex" style="flex-wrap:wrap;gap:5px">' +
        g.rows.map(function (r) {
          return '<button class="chip" data-id="' + r.id + '" style="border-color:' + U.scoreColor(r.lcdos) + '44">' +
            U.esc(r.m.name.replace(/ (&|and) .*$/, '')) +
            ' <span class="mono" style="color:' + U.scoreColor(mode === 'opportunity' ? r.lcdos : r.gce) + '">' +
            U.n0(mode === 'opportunity' ? r.lcdos : r.gce) + '</span></button>';
        }).join('') + '</div></div></div>';
    }).join('');
  }

  function render(root) {
    body = root;
    var isOpp = mode === 'opportunity';
    body.innerHTML =
      '<div class="stage"><div class="scrollstage" style="padding:16px 18px 60px">' +
      '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">' +
      (isOpp ? 'Opportunity matrix' : 'Construction supply versus demand') + '</h2>' +
      '<div class="dim" style="font-size:11.5px">' +
      (isOpp ? 'Current luxury maturity against future growth potential. Node size is annual $2M+ construction volume.'
             : 'Where luxury construction demand exceeds the capacity of the contractors serving it.') + '</div></div>' +
      '</div>' +
      '<div class="panel mb16"><div class="pad" style="padding:6px"><div style="max-width:1180px;margin:0 auto">' +
      (isOpp ? chartOpportunity() : chartSupplyDemand()) + '</div></div></div>' +
      quadrantList() +
      '</div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', '[data-mode]', function (e, t) { mode = t.dataset.mode; render(body); });
    U.on(body, 'click', '[data-id]', function (e, t) {
      ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view');
    });
    U.on(body, 'click', 'g.pt', function (e, t) {
      ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view');
    });
  }

  return {
    render: render,
    setMode: function (m) { mode = m; },
    onEvent: function (w) { if (body && (w === 'scenario' || w === 'select')) render(body); }
  };
})(STORE, U, CH);

/* ============================================================================
 * views/scenario.js — the Scenario Simulator.
 * Change the assumptions; the entire model re-solves and re-ranks.
 * ==========================================================================*/
var V_SCENARIO = (function (ST, U, CH, SC) {
  'use strict';
  var body = null, baseline = null;

  function snapshot() {
    var snap = {};
    ST.DER.ranked.forEach(function (r) {
      snap[r.id] = { rank: r.rank, lcdos: r.lcdos, gce: r.gce, dev: r.dev, gap: r.gap, momentum: r.momentum, f10: r.f10 };
    });
    return snap;
  }

  function ensureBaseline() {
    if (baseline) return;
    var keep = ST.S.scenario, keepOn = ST.S.scenarioOn;
    ST.S.scenario = {}; ST.S.scenarioOn = false;
    ST.recompute();
    baseline = snapshot();
    ST.S.scenario = keep; ST.S.scenarioOn = keepOn;
    ST.recompute();
  }

  var PRESETS = [
    { id: 'idaho', label: 'Idaho wealth migration +20%',
      desc: 'The brief\'s worked example. Applies a 20% uplift to wealth-migration inputs across the whole universe, then shows which markets move most — Idaho\'s cluster is the first place to look.',
      set: { wealthMigration: 20 } },
    { id: 'rates', label: 'Rates +200bp',
      desc: 'Longer days on market, compressed appreciation, fewer permits, a higher cash-buyer share of whatever still trades.',
      set: { rates: 200 } },
    { id: 'ratecut', label: 'Rates −150bp',
      desc: 'The reflation case: permits recover, appreciation resumes, absorption shortens.',
      set: { rates: -150 } },
    { id: 'costshock', label: 'Construction costs +25%',
      desc: 'Tariff and labour shock. Directly compresses spec margin and development feasibility everywhere, hardest where land is already a large share of value.',
      set: { costs: 25 } },
    { id: 'boom', label: 'Resort capital cycle',
      desc: 'Infrastructure +80%, tourism +25%, luxury demand +30%. What a full resort-investment cycle does to the ranking.',
      set: { infrastructure: 80, tourism: 25, luxuryDemand: 30 } },
    { id: 'crunch', label: 'Labour crunch',
      desc: 'Trade labour supply −30%. Tests which markets can physically absorb more work and which are already at capacity.',
      set: { labour: -30 } },
    { id: 'entitlement', label: 'Approvals liberalised',
      desc: 'Development approvals +60%: faster entitlement, shorter permit times, more released lots, lower regulatory burden.',
      set: { approvals: 60 } },
    { id: 'landspike', label: 'Land repricing +60%',
      desc: 'Land appreciates faster than end values. The clearest test of which markets still leave a developer any margin.',
      set: { landPrices: 60 } }
  ];

  function levers() {
    return SC.SCENARIO_LEVERS.map(function (lv) {
      var v = ST.S.scenario[lv.id] || 0;
      return '<div class="ctl"><label title="' + U.esc(lv.desc) + '">' + U.esc(lv.label) +
        ' <b>' + (v > 0 ? '+' : '') + v + lv.unit + '</b></label>' +
        '<input type="range" min="' + lv.min + '" max="' + lv.max + '" step="' + lv.step + '" value="' + v + '" data-lever="' + lv.id + '">' +
        '</div>';
    }).join('');
  }

  function movers() {
    ensureBaseline();
    var rows = ST.DER.ranked.map(function (r) {
      var b = baseline[r.id] || {};
      return {
        r: r, dRank: (b.rank || r.rank) - r.rank,
        dScore: r.lcdos - (b.lcdos == null ? r.lcdos : b.lcdos),
        dGce: r.gce - (b.gce == null ? r.gce : b.gce),
        dDev: r.dev - (b.dev == null ? r.dev : b.dev),
        base: b
      };
    });
    /* At baseline every delta is zero, and two identical tables of zeros say
       nothing. Ask for a lever instead. */
    var moved = rows.some(function (x) { return Math.abs(x.dScore) > 0.05 || x.dRank !== 0; });
    if (!moved) {
      return '<div class="panel"><header><h3>Movers</h3><span class="pill">Baseline</span></header>' +
        '<div class="pad"><p class="dim" style="font-size:12.5px;margin:0;line-height:1.65">' +
        'Nothing has moved because no lever has moved. Pull an assumption on the left, or load one of ' +
        'the presets, and this panel ranks every market by how far its score and rank travel against ' +
        'the baseline.</p></div></div>';
    }
    var up = rows.slice().sort(function (a, b) { return b.dScore - a.dScore; })
      .filter(function (x) { return x.dScore > 0.05; }).slice(0, 12);
    var down = rows.slice().sort(function (a, b) { return a.dScore - b.dScore; })
      .filter(function (x) { return x.dScore < -0.05; }).slice(0, 12);

    function tbl(list, title) {
      return '<div class="panel"><header><h3>' + title + '</h3></header><div class="scrollx">' +
        '<table class="grid"><thead><tr><th class="l">Market</th><th>Rank</th><th>Δ rank</th><th>LCDOS</th><th>Δ score</th><th>Δ GC</th><th>Δ DEV</th></tr></thead><tbody>' +
        list.map(function (x) {
          return '<tr data-id="' + x.r.id + '"><td class="l">' + U.esc(x.r.m.name) +
            '<br><span class="dim2 mono" style="font-size:9.5px">' + U.esc(x.r.m.state) + '</span></td>' +
            '<td>' + x.r.rank + '</td>' +
            '<td>' + (x.dRank === 0 ? '<span class="dim2">—</span>' : U.deltaHtml(x.dRank, '')) + '</td>' +
            '<td>' + U.scoreChip(x.r.lcdos) + '</td>' +
            '<td>' + U.deltaHtml(x.dScore, '') + '</td>' +
            '<td>' + U.deltaHtml(x.dGce, '') + '</td>' +
            '<td>' + U.deltaHtml(x.dDev, '') + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }
    return '<div class="gridcards g2">' +
      (up.length ? tbl(up, 'Largest gains') : '') +
      (down.length ? tbl(down, 'Largest losses') : '') + '</div>';
  }

  function idahoWatch() {
    var ids = ['boise', 'mccall', 'cda', 'sun-valley', 'sandpoint'];
    ensureBaseline();
    return '<div class="panel mb16"><header><h3>Worked example — the Idaho cluster</h3>' +
      '<span class="tiny">Boise · McCall · Coeur d\'Alene · Sun Valley · Sandpoint</span></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr><th class="l">Market</th><th>Baseline</th><th>Scenario</th><th>Δ</th>' +
      '<th>Rank</th><th>GC entry</th><th>Developer</th><th>10-yr</th></tr></thead><tbody>' +
      ids.map(function (id) {
        var r = ST.get(id); if (!r) return '';
        var b = baseline[id] || {};
        return '<tr data-id="' + id + '"><td class="l">' + U.esc(r.m.name) + '</td>' +
          '<td class="dim">' + U.n1(b.lcdos) + '</td><td>' + U.scoreChip(r.lcdos) + '</td>' +
          '<td>' + U.deltaHtml(r.lcdos - (b.lcdos || r.lcdos), '') + '</td>' +
          '<td>#' + r.rank + (b.rank && b.rank !== r.rank ? ' <span class="dim2">(was ' + b.rank + ')</span>' : '') + '</td>' +
          '<td>' + U.scoreChip(r.gce) + '</td><td>' + U.scoreChip(r.dev) + '</td><td>' + U.scoreChip(r.f10) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function render(root) {
    body = root;
    ensureBaseline();
    var active = [];
    SC.SCENARIO_LEVERS.forEach(function (lv) { if (ST.S.scenario[lv.id]) active.push(lv.label + ' ' + (ST.S.scenario[lv.id] > 0 ? '+' : '') + ST.S.scenario[lv.id] + lv.unit); });

    body.innerHTML =
      '<div class="rail">' +
      '<div class="railsec"><h4>Presets</h4><div class="chips">' +
      PRESETS.map(function (p) { return '<button class="chip" data-preset="' + p.id + '" title="' + U.esc(p.desc) + '">' + U.esc(p.label) + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="railsec"><h4>Assumptions</h4>' + levers() +
      '<button class="btn wide mt10" data-act="reset">Reset to baseline</button></div>' +
      '</div>' +

      '<div class="stage"><div class="scrollstage" style="padding:16px 18px 60px">' +
      '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">Scenario simulator</h2>' +
      '<div class="dim" style="font-size:11.5px">Every lever feeds the primitives, not the scores. The whole model re-solves and re-ranks.</div></div>' +
      (active.length ? '<span class="pill hot">' + U.esc(active.join(' · ')) + '</span>' : '<span class="pill">Baseline</span>') +
      '</div>' +
      idahoWatch() +
      movers() +
      '<div class="panel mt16"><header><h3>How the levers work</h3></header><div class="pad">' +
      '<div class="gridcards g2">' +
      SC.SCENARIO_LEVERS.map(function (lv) {
        return '<div style="padding:7px 0;border-bottom:1px solid var(--hairline)"><b style="font-size:12px">' + U.esc(lv.label) + '</b>' +
          '<p class="dim" style="font-size:11.5px;margin:3px 0 0;line-height:1.5">' + U.esc(lv.desc) + '</p></div>';
      }).join('') + '</div></div></div>' +
      '</div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'input', '[data-lever]', function (e, t) {
      ST.S.scenario[t.dataset.lever] = +t.value;
      ST.S.scenarioOn = true;
      ST.recompute();
      var lab = t.previousElementSibling && t.previousElementSibling.querySelector('b');
      var lv = SC.SCENARIO_LEVERS.filter(function (x) { return x.id === t.dataset.lever; })[0];
      if (lab) lab.textContent = (+t.value > 0 ? '+' : '') + t.value + lv.unit;
      refresh();
    });
    U.on(body, 'click', '[data-preset]', function (e, t) {
      var p = PRESETS.filter(function (x) { return x.id === t.dataset.preset; })[0];
      ST.S.scenario = {}; for (var k in p.set) ST.S.scenario[k] = p.set[k];
      ST.S.scenarioOn = true; ST.recompute(); render(body); ST.emit('scenario-quiet');
    });
    U.on(body, 'click', '[data-act="reset"]', function () { ST.resetScenario(); render(body); });
    U.on(body, 'click', 'tr[data-id]', function (e, t) { ST.selectMarket(t.dataset.id); ST.set({ view: 'market' }, 'view'); });
  }

  function refresh() {
    var st = body.querySelector('.scrollstage');
    if (!st) return;
    var y = st.scrollTop;
    var active = [];
    SC.SCENARIO_LEVERS.forEach(function (lv) { if (ST.S.scenario[lv.id]) active.push(lv.label + ' ' + (ST.S.scenario[lv.id] > 0 ? '+' : '') + ST.S.scenario[lv.id] + lv.unit); });
    st.innerHTML =
      '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">Scenario simulator</h2>' +
      '<div class="dim" style="font-size:11.5px">Every lever feeds the primitives, not the scores. The whole model re-solves and re-ranks.</div></div>' +
      (active.length ? '<span class="pill hot">' + U.esc(active.join(' · ')) + '</span>' : '<span class="pill">Baseline</span>') +
      '</div>' + idahoWatch() + movers();
    st.scrollTop = y;
  }

  return { render: render, onEvent: function (w) { if (body && w === 'scenario') refresh(); } };
})(STORE, U, CH, LCDOS_SCORING);

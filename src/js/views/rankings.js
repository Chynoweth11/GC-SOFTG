/* ============================================================================
 * views/rankings.js — the full ranked league table.
 * ==========================================================================*/
var V_RANKINGS = (function (ST, U, CH) {
  'use strict';
  var body = null;

  var COLS = [
    { k: 'rank', l: '#', w: 34, fmt: function (r) { return '<span class="rank">' + r.rank + '</span>'; }, sort: function (r) { return -r.lcdos; } },
    { k: 'name', l: 'Market', cls: 'l', fmt: function (r) {
        return '<b style="font-weight:550">' + U.esc(r.m.name) + '</b><br><span class="dim2 mono" style="font-size:9.5px">' +
          U.esc(r.m.state + ' · ' + r.m.county) + '</span>'; },
      sort: function (r) { return r.m.name; } },
    { k: 'type', l: 'Type', cls: 'l', fmt: function (r) {
        return '<span class="dim" style="font-size:11px">' + U.esc(ST.DATA.ARCHETYPES[r.m.archetype].label) + '</span>'; },
      sort: function (r) { return r.m.archetype; } },
    { k: 'tier', l: 'Tier', cls: 'l', fmt: function (r) { return '<span class="dim" style="font-size:11px">' + U.esc(r.m.tier) + '</span>'; },
      sort: function (r) { return r.m.tier; } },
    { k: 'lcdos', l: 'LCDOS', fmt: function (r) { return U.scoreChip(r.lcdos); }, sort: function (r) { return r.lcdos; } },
    { k: 'gce', l: 'GC Entry', fmt: function (r) { return U.scoreChip(r.gce); }, sort: function (r) { return r.gce; } },
    { k: 'dev', l: 'Developer', fmt: function (r) { return U.scoreChip(r.dev); }, sort: function (r) { return r.dev; } },
    { k: 'flu', l: 'Lux Growth', fmt: function (r) { return U.scoreChip(r.flu); }, sort: function (r) { return r.flu; } },
    { k: 'cls', l: 'Current Lux', fmt: function (r) { return U.scoreChip(r.cls); }, sort: function (r) { return r.cls; } },
    { k: 'gap', l: 'Opp Gap', fmt: function (r) { return U.scoreChip(r.gap); }, sort: function (r) { return r.gap; } },
    { k: 'momentum', l: 'Momentum', fmt: function (r) {
        return U.scoreChip(r.momentum) + '<br><span class="dim2 mono" style="font-size:9.5px">' + U.pctS(r.momentumRate) + '/yr</span>'; },
      sort: function (r) { return r.momentum; } },
    { k: 'f5', l: '5-Yr', fmt: function (r) { return U.scoreChip(r.f5); }, sort: function (r) { return r.f5; } },
    { k: 'f10', l: '10-Yr', fmt: function (r) { return U.scoreChip(r.f10); }, sort: function (r) { return r.f10; } },
    { k: 'f20', l: '20-Yr', fmt: function (r) { return U.scoreChip(r.f20); }, sort: function (r) { return r.f20; } },
    { k: 'trend', l: 'Trend 21→31', fmt: function (r) {
        var h = ST.hist(r.id);
        return CH.spark(h.map(function (x) { return x.score; }), { width: 66, height: 16, color: U.scoreColor(r.lcdos) }); },
      sort: function (r) { var h = ST.hist(r.id); return h[h.length - 1].score - h[0].score; } },
    { k: 'confidence', l: 'Conf', fmt: function (r) {
        var b = U.confBand(r.confidence);
        return '<span class="mono" style="color:' + b.color + '">' + r.confidence + '</span>'; },
      sort: function (r) { return r.confidence; } },
    { k: 'sig', l: 'Signals', fmt: function (r) {
        var s = ST.DER.signals[r.id] || [];
        var o = s.filter(function (x) { return x.kind === 'opportunity'; }).length;
        var k = s.length - o;
        return '<span class="up mono">' + o + '</span><span class="dim2"> / </span><span class="down mono">' + k + '</span>'; },
      sort: function (r) { var s = ST.DER.signals[r.id] || []; return s.filter(function (x) { return x.kind === 'opportunity'; }).length; } }
  ];

  function rowsSorted() {
    var rows = ST.filtered().slice();
    var col = COLS.filter(function (c) { return c.k === ST.S.sortKey; })[0] || COLS[4];
    var dir = ST.S.sortDir;
    rows.sort(function (a, b) {
      var av = col.sort(a), bv = col.sort(b);
      if (typeof av === 'string') return dir * av.localeCompare(bv);
      return dir * (av - bv);
    });
    return rows;
  }

  function table() {
    var rows = rowsSorted();
    var top10 = {};
    ST.DER.ranked.slice(0, 10).forEach(function (r) { top10[r.id] = 1; });
    return '<table class="grid"><thead><tr>' +
      COLS.map(function (c) {
        return '<th class="' + (c.cls || '') + (ST.S.sortKey === c.k ? ' sorted' : '') + '" data-sort="' + c.k + '"' +
          (c.w ? ' style="width:' + c.w + 'px"' : '') + '>' + U.esc(c.l) +
          (ST.S.sortKey === c.k ? (ST.S.sortDir < 0 ? ' ▾' : ' ▴') : '') + '</th>';
      }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr data-id="' + r.id + '" class="' + (top10[r.id] ? 'top10 ' : '') + (ST.S.selected === r.id ? 'sel' : '') + '">' +
          COLS.map(function (c) { return '<td class="' + (c.cls || '') + '">' + c.fmt(r) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  function summary() {
    var rows = ST.filtered();
    var alerts = rows.filter(function (r) { return r.e.entryAlert; }).length;
    var emerging = rows.filter(function (r) { return r.gap >= 64 && r.cls < 62; }).length;
    var volume = U.sum(rows, function (r) { return r.e.derived.luxStartsVolumeM; });
    var pipeline = U.sum(rows, function (r) { return r.m.p.pipelineM; });
    return '<div class="gridcards g4" style="margin-bottom:14px">' +
      kpi('Markets in view', rows.length + '', ST.DER.ranked.length + ' in universe') +
      kpi('Addressable luxury construction', U.usdM(volume), 'modelled annual $2M+ volume') +
      kpi('Announced pipeline', U.usdM(pipeline), 'five-year, all markets in view') +
      kpi('Entry opportunity alerts', alerts + '', emerging + ' emerging-luxury flags') +
      '</div>';
  }
  function kpi(k, v, s) {
    return '<div class="kpi"><div class="k">' + U.esc(k) + '</div><div class="v">' + v + '</div><div class="s">' + U.esc(s) + '</div></div>';
  }

  function presets() {
    var P = [
      { k: 'lcdos', l: 'Overall opportunity' },
      { k: 'gce', l: 'Where to start a GC' },
      { k: 'dev', l: 'Where to buy land' },
      { k: 'gap', l: 'Before it is obvious' },
      { k: 'momentum', l: 'Fastest accelerating' },
      { k: 'f20', l: '20-year position' }
    ];
    return P.map(function (p) {
      return '<button class="chip' + (ST.S.sortKey === p.k ? ' on' : '') + '" data-preset="' + p.k + '">' + U.esc(p.l) + '</button>';
    }).join('');
  }

  function csv() {
    var rows = rowsSorted();
    var head = ['rank', 'market', 'state', 'county', 'type', 'tier', 'lcdos', 'gc_entry', 'developer',
      'future_luxury_upside', 'current_luxury_strength', 'opportunity_gap', 'momentum', 'momentum_rate_pct',
      'outlook_5y', 'outlook_10y', 'outlook_20y', 'risk', 'confidence',
      'modelled_2m_starts', 'lux_volume_musd', 'lux_gcs', 'starts_per_gc', 'spec_margin_pct',
      'pipeline_musd', 'permit_cagr3_pct', 'land_index', 'entitlement_months'];
    var lines = [head.join(',')];
    rows.forEach(function (r) {
      lines.push([r.rank, '"' + r.m.name + '"', r.m.state, '"' + r.m.county + '"', r.m.archetype, r.m.tier,
        r.lcdos.toFixed(2), r.gce.toFixed(2), r.dev.toFixed(2), r.flu.toFixed(2), r.cls.toFixed(2),
        r.gap.toFixed(2), r.momentum.toFixed(2), r.momentumRate.toFixed(2),
        r.f5.toFixed(2), r.f10.toFixed(2), r.f20.toFixed(2), r.risk.toFixed(2), r.confidence,
        Math.round(r.e.derived.luxStarts), Math.round(r.e.derived.luxStartsVolumeM), r.m.p.luxGcCount,
        r.e.derived.startsPerIncumbent.toFixed(2), r.e.derived.specMarginPct.toFixed(2),
        r.m.p.pipelineM, r.m.p.permitCagr3, r.m.p.landIdx, r.m.p.entMonths].join(','));
    });
    return lines.join('\n');
  }

  function render(root) {
    body = root;
    body.innerHTML =
      '<div class="stage"><div class="scrollstage" style="padding:16px 18px 60px">' +
      '<div class="flex between center mb16" style="flex-wrap:wrap;gap:10px">' +
      '<div><h2 style="margin:0;font-size:18px;font-weight:600">Market league table</h2>' +
      '<div class="dim" style="font-size:11.5px">79 U.S. markets scored on the LCDOS model · click any row for the full profile</div></div>' +
      '<div class="flex gap6"><button class="btn" data-act="csv">Export CSV</button></div></div>' +
      summary() +
      '<div class="flex gap6 mb10" style="flex-wrap:wrap"><span class="tiny" style="align-self:center;margin-right:4px">Rank by</span>' + presets() + '</div>' +
      '<div class="panel"><div class="scrollx">' + table() + '</div></div>' +
      '</div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', 'th[data-sort]', function (e, t) {
      var k = t.dataset.sort;
      if (ST.S.sortKey === k) ST.S.sortDir *= -1;
      else { ST.S.sortKey = k; ST.S.sortDir = (k === 'name' || k === 'type' || k === 'tier') ? 1 : -1; }
      render(body);
    });
    U.on(body, 'click', '[data-preset]', function (e, t) {
      ST.S.sortKey = t.dataset.preset; ST.S.sortDir = -1; render(body);
    });
    U.on(body, 'click', 'tbody tr[data-id]', function (e, t) {
      ST.selectMarket(t.dataset.id);
      ST.set({ view: 'market' }, 'view');
    });
    U.on(body, 'click', '[data-act="csv"]', openExport);
  }


  /* Export panel.
   * A download link is not a reliable affordance here: the same build is served
   * from a repo, opened from the filesystem, and published as a hosted page, and
   * the hosted viewer never grants pages download permission — the link would
   * silently do nothing. Copy-to-clipboard works in all three, and the textarea
   * is the manual fallback when the clipboard API is unavailable (it needs a
   * secure context). */
  function openExport() {
    var text = csv();
    var rows = ST.filtered().length;
    var ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML =
      '<div class="palette" style="width:min(880px,94vw)">' +
      '<div class="flex between center" style="padding:12px 15px;border-bottom:1px solid var(--line-2);background:var(--panel-2)">' +
      '<div><b style="font-size:13.5px">Export rankings</b>' +
      '<div class="dim" style="font-size:11px">' + rows + ' markets · 28 columns · CSV, current sort and filters</div></div>' +
      '<div class="flex gap6"><button class="btn on" data-x="copy">Copy CSV</button>' +
      '<button class="btn" data-x="close">Close</button></div></div>' +
      '<textarea readonly spellcheck="false" style="width:100%;height:46vh;border:0;border-radius:0;resize:none;' +
      'background:var(--bg-2);color:var(--ink-2);font-family:var(--mono);font-size:10.5px;line-height:1.5;padding:12px 15px">' +
      U.esc(text) + '</textarea>' +
      '<div class="dim2" style="padding:9px 15px;font-size:10.5px;border-top:1px solid var(--line)">' +
      'Every column is documented in docs/DATA-DICTIONARY.md. Scores recompute under the active scenario, so an export taken with a scenario loaded reflects that scenario.</div>' +
      '</div>';
    document.body.appendChild(ov);
    var ta = ov.querySelector('textarea');

    function close() { ov.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', esc);

    ov.addEventListener('click', function (e) {
      if (e.target === ov) return close();
      var b = e.target.closest('[data-x]');
      if (!b) return;
      if (b.dataset.x === 'close') return close();
      var btn = ov.querySelector('[data-x="copy"]');
      function done(ok) {
        btn.textContent = ok ? 'Copied' : 'Select and copy';
        setTimeout(function () { btn.textContent = 'Copy CSV'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () {
          ta.focus(); ta.select(); done(false);
        });
      } else { ta.focus(); ta.select(); done(false); }
    });
  }

  return { render: render, onEvent: function (w) { if (body && (w === 'scenario' || w === 'select')) render(body); } };
})(STORE, U, CH);

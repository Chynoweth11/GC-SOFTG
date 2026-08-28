/* ============================================================================
 * app.js — shell, router and command palette.
 * ==========================================================================*/
(function (ST, U) {
  'use strict';

  var MODULES = [
    { id: 'terminal', label: 'Terminal', view: function () { return V_TERMINAL; } },
    { id: 'rankings', label: 'Rankings', view: function () { return V_RANKINGS; } },
    { id: 'matrix', label: 'Matrix', view: function () { return V_MATRIX; } },
    { id: 'radar', label: 'Radar', view: function () { return V_RADAR; } },
    { id: 'compare', label: 'Compare', view: function () { return V_COMPARE; } },
    { id: 'market', label: 'Market', view: function () { return V_MARKET; } },
    { id: 'sim', label: 'Simulators', view: function () { return V_SIM; } },
    { id: 'scenario', label: 'Scenario', view: function () { return V_SCENARIO; } },
    { id: 'ic', label: 'IC Mode', view: function () { return V_IC; } },
    { id: 'method', label: 'Methodology', view: function () { return V_METHOD; } }
  ];

  var bodyEl, current = null;

  function topbar() {
    var scOn = ST.S.scenarioOn && Object.keys(ST.S.scenario).some(function (k) { return ST.S.scenario[k]; });
    var alerts = ST.DER.alerts.filter(function (a) { return a.sig.sev >= 3; }).length;
    return '<div class="brand"><div class="brand-mark">L</div><div class="brand-text">' +
      '<b>LCDOS</b><span>Terminal v' + ST.MODEL.VERSION + '</span></div></div>' +
      '<div class="modules">' + MODULES.map(function (m) {
        return '<button class="mod' + (ST.S.view === m.id ? ' on' : '') + '" data-view="' + m.id + '">' + U.esc(m.label) + '</button>';
      }).join('') + '</div>' +
      '<div class="topright">' +
      '<button class="searchbtn" id="cmdbtn"><span>⌕</span><span>Search markets…</span><kbd>⌘K</kbd></button>' +
      (scOn ? '<span class="pill hot">Scenario active</span>' : '') +
      '<span class="pill warn">' + alerts + ' priority alerts</span>' +
      '<span class="pill live">' + ST.DER.ranked.length + ' markets · ' + ST.DATA.AS_OF + '</span>' +
      '</div>';
  }

  function route() {
    var m = MODULES.filter(function (x) { return x.id === ST.S.view; })[0] || MODULES[0];
    current = m.view();
    bodyEl.innerHTML = '';
    current.render(bodyEl);
    U.$$('.mod').forEach(function (b) { b.classList.toggle('on', b.dataset.view === ST.S.view); });
    try { location.hash = ST.S.view + (ST.S.selected ? '/' + ST.S.selected : ''); } catch (e) {}
  }

  /* ---------------------------------------------------- command palette */
  var palette = null, palIdx = 0, palRows = [];

  function openPalette() {
    if (palette) return;
    palette = document.createElement('div');
    palette.className = 'overlay';
    palette.innerHTML = '<div class="palette"><input type="text" id="palq" placeholder="Search markets, states, market types, modules…" autocomplete="off"><div class="results" id="palr"></div></div>';
    document.body.appendChild(palette);
    var q = document.getElementById('palq');
    q.focus();
    renderPal('');
    q.addEventListener('input', function () { palIdx = 0; renderPal(q.value); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { palIdx = Math.min(palIdx + 1, palRows.length - 1); paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { palIdx = Math.max(palIdx - 1, 0); paint(); e.preventDefault(); }
      else if (e.key === 'Enter') { pick(palRows[palIdx]); }
      else if (e.key === 'Escape') closePalette();
    });
    palette.addEventListener('click', function (e) {
      if (e.target === palette) return closePalette();
      var r = e.target.closest('.r');
      if (r) pick(palRows[+r.dataset.i]);
    });
  }
  function closePalette() { if (palette) { palette.remove(); palette = null; } }

  function renderPal(q) {
    q = (q || '').toLowerCase().trim();
    var out = [];
    MODULES.forEach(function (m) {
      if (!q || m.label.toLowerCase().indexOf(q) >= 0) out.push({ kind: 'module', id: m.id, title: m.label, sub: 'Module' });
    });
    ST.DER.ranked.forEach(function (r) {
      var hay = (r.m.name + ' ' + r.m.state + ' ' + r.m.county + ' ' + r.m.region + ' ' + r.m.archetype + ' ' + r.m.tier).toLowerCase();
      if (!q || hay.indexOf(q) >= 0) {
        out.push({ kind: 'market', id: r.id, title: r.m.name, sub: r.m.state + ' · ' + r.m.county + ' · #' + r.rank, score: r.lcdos });
      }
    });
    MAP.LAYERS.forEach(function (l) {
      if (q && l.label.toLowerCase().indexOf(q) >= 0) out.push({ kind: 'layer', id: l.id, title: l.label, sub: 'Map layer · ' + l.g });
    });
    palRows = out.slice(0, 40);
    paint();
  }
  function paint() {
    var el = document.getElementById('palr');
    if (!el) return;
    el.innerHTML = palRows.map(function (r, i) {
      return '<div class="r' + (i === palIdx ? ' on' : '') + '" data-i="' + i + '">' +
        '<span class="mono dim2" style="font-size:9.5px;width:56px">' + U.esc(r.kind.toUpperCase()) + '</span>' +
        '<span class="rn"><b>' + U.esc(r.title) + '</b><span>' + U.esc(r.sub) + '</span></span>' +
        (r.score != null ? U.scoreChip(r.score) : '') + '</div>';
    }).join('');
    var on = el.querySelector('.r.on');
    if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
  }
  function pick(r) {
    if (!r) return;
    closePalette();
    if (r.kind === 'module') ST.set({ view: r.id }, 'view');
    else if (r.kind === 'market') { ST.selectMarket(r.id); ST.set({ view: 'market' }, 'view'); }
    else if (r.kind === 'layer') { ST.S.layer = r.id; ST.set({ view: 'terminal' }, 'view'); }
  }

  /* ------------------------------------------------------------ bootstrap */
  function boot() {
    document.getElementById('topbar').innerHTML = topbar();
    bodyEl = document.getElementById('body');

    /* deep link */
    var h = (location.hash || '').replace(/^#/, '').split('/');
    if (h[0] && MODULES.some(function (m) { return m.id === h[0]; })) ST.S.view = h[0];
    if (h[1] && ST.get(h[1])) ST.S.selected = h[1];
    if (!ST.S.selected) ST.S.selected = ST.DER.ranked[0].id;

    route();

    U.on(document.getElementById('topbar'), 'click', '[data-view]', function (e, t) {
      ST.set({ view: t.dataset.view }, 'view');
    });
    document.getElementById('cmdbtn').addEventListener('click', openPalette);

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
      else if (e.key === 'Escape') closePalette();
      else if (!palette && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        var idx = '123456789'.indexOf(e.key);
        if (idx >= 0 && idx < MODULES.length) ST.set({ view: MODULES[idx].id }, 'view');
      }
    });

    ST.sub(function (what) {
      if (what === 'view') { route(); document.getElementById('topbar').innerHTML = topbar(); }
      else if (what === 'scenario') {
        document.getElementById('topbar').innerHTML = topbar();
        if (current && current.onEvent) current.onEvent('scenario');
      } else if (current && current.onEvent) current.onEvent(what);
    });

    window.addEventListener('resize', U.debounce(function () {
      if (ST.S.view === 'terminal' && current) current.render(bodyEl);
    }, 220));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(STORE, U);

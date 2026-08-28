/* ============================================================================
 * views/analysis.js — hosts the four analytical surfaces under one module:
 * the opportunity matrix, supply-vs-demand, the emerging-market radar and the
 * signal feed. Ten top-level modules was too many to hold in your head; these
 * four all answer "where is the opportunity", so they belong together.
 * ==========================================================================*/
var V_ANALYSIS = (function (ST, U) {
  'use strict';
  var body = null, tab = 'matrix';

  var TABS = [
    { id: 'matrix',  label: 'Opportunity matrix', host: function () { return V_MATRIX; }, mode: 'opportunity' },
    { id: 'supply',  label: 'Supply vs demand',   host: function () { return V_MATRIX; }, mode: 'supply' },
    { id: 'radar',   label: 'Emerging radar',     host: function () { return V_RADAR; } }
  ];

  function subnav() {
    return '<div class="subnav">' + TABS.map(function (t) {
      return '<button class="subtab' + (tab === t.id ? ' on' : '') + '" data-antab="' + t.id + '">' +
        U.esc(t.label) + '</button>';
    }).join('') + '</div>';
  }

  function render(root) {
    body = root;
    var t = TABS.filter(function (x) { return x.id === tab; })[0] || TABS[0];
    var host = t.host();
    if (t.mode && host.setMode) host.setMode(t.mode);
    host.render(root);

    var st = root.querySelector('.scrollstage');
    if (st) st.insertAdjacentHTML('afterbegin', subnav());
    U.on(root, 'click', '[data-antab]', function (e, el) {
      tab = el.dataset.antab; render(body);
    });
  }

  return {
    render: render,
    onEvent: function (w) {
      if (!body) return;
      var t = TABS.filter(function (x) { return x.id === tab; })[0] || TABS[0];
      var host = t.host();
      if (host.onEvent) host.onEvent(w);
    }
  };
})(STORE, U);

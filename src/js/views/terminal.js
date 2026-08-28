/* ============================================================================
 * views/terminal.js — the main interactive map module.
 * ==========================================================================*/
var V_TERMINAL = (function (ST, U, CH) {
  'use strict';

  var body = null;

  function layerRail() {
    var groups = {}, order = [];
    MAP.LAYERS.forEach(function (l) {
      if (!groups[l.g]) { groups[l.g] = []; order.push(l.g); }
      groups[l.g].push(l);
    });
    return order.map(function (g) {
      return '<div class="railsec"><h4>' + U.esc(g) + '</h4><div class="chips">' +
        groups[g].map(function (l) {
          return '<button class="chip' + (ST.S.layer === l.id ? ' on' : '') + '" data-layer="' + l.id + '">' + U.esc(l.label) + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }

  var railTab = 'layers';

  function railHead() {
    return '<div class="railsec fsticky" style="padding-bottom:12px">' +
      '<div class="modules fill">' +
      '<button class="mod' + (railTab === 'layers' ? ' on' : '') + '" data-railtab="layers">Layers</button>' +
      '<button class="mod' + (railTab === 'filters' ? ' on' : '') + '" data-railtab="filters">Filters' +
      (FILTERS.activeCount() ? ' <span class="fcount">' + FILTERS.activeCount() + '</span>' : '') + '</button>' +
      '</div></div>';
  }

  /* ------------------------------------------------------------ inspector */
  function inspector() {
    var id = ST.S.selected;
    if (!id) {
      return '<div class="railsec"><h4>Market inspector</h4>' +
        '<p class="dim" style="font-size:12px;line-height:1.55;margin:0">Select a node to open its intelligence profile. ' +
        'Scroll to zoom, drag to pan, click a state to drill into its counties.</p></div>' +
        '<div class="railsec"><h4>Node encoding</h4>' + encodingHtml() + '</div>' +
        '<div class="railsec"><h4>Top of book</h4>' + topOfBook() + '</div>';
    }
    var r = ST.get(id), m = r.m, e = r.e, c = r.conf;
    var sigs = ST.DER.signals[id] || [];
    var band = U.confBand(c.score);

    var SHORT = {
      construction: 'Construction', pipeline: 'Pipeline', wealth: 'Wealth & migration',
      luxury: 'Luxury market', growth: 'Growth', tourism: 'Tourism', prestige: 'Prestige',
      land: 'Land & developer', access: 'Accessibility', future: 'Future potential'
    };
    var cats = e.catRows.map(function (cr) {
      return { label: SHORT[cr.id] || cr.label, v: cr.v, w: cr.weight };
    });

    return '<div class="railsec">' +
      '<div class="flex between center mb6"><h4 style="margin:0">' + U.esc(m.state) + ' · ' + U.esc(m.county) + '</h4>' +
      '<span class="pill">#' + r.rank + ' of ' + ST.DER.ranked.length + '</span></div>' +
      '<div style="font-size:17px;font-weight:600;line-height:1.25;margin-bottom:6px">' + U.esc(m.name) + '</div>' +
      '<div class="tagrow">' +
      '<span class="pill">' + U.esc(ST.DATA.ARCHETYPES[m.archetype].label) + '</span>' +
      '<span class="pill">' + U.esc(m.tier) + '</span>' +
      (e.entryAlert ? '<span class="pill hot">Entry alert</span>' : '') +
      '</div>' +
      '<p class="dim" style="font-size:11.5px;line-height:1.55;margin:0 0 4px">' + U.esc(m.blurb) + '</p>' +
      '</div>' +

      '<div class="railsec"><div class="flex gap6" style="justify-content:space-around">' +
      CH.gauge(e.lcdos, { size: 92, label: 'LCDOS' }) +
      CH.gauge(e.gce, { size: 92, label: 'GC ENTRY' }) +
      CH.gauge(e.dev, { size: 92, label: 'DEVELOPER' }) +
      '</div>' +
      '<div class="sep"></div>' +
      '<div class="stat"><span class="sl">Current luxury strength</span><span class="sv">' + U.scoreChip(e.cls) + '</span></div>' +
      '<div class="stat"><span class="sl">Future luxury upside</span><span class="sv">' + U.scoreChip(e.flu) + '</span></div>' +
      '<div class="stat"><span class="sl">Opportunity gap</span><span class="sv">' + U.scoreChip(e.gap) + '</span></div>' +
      '<div class="stat"><span class="sl">Momentum</span><span class="sv">' + U.scoreChip(e.momentum) + ' <span class="dim mono" style="font-size:10.5px">' + U.pctS(e.momentumRate) + '/yr</span></span></div>' +
      '<div class="stat"><span class="sl">Data confidence</span><span class="sv"><span style="color:' + band.color + '">' + c.score + '</span> <span class="dim" style="font-size:10.5px">' + band.label + '</span></span></div>' +
      '</div>' +

      '<div class="railsec"><h4>Category scores</h4>' +
      CH.hbars(cats, { width: 348, labelW: 152, valW: 46, rowH: 22 }) + '</div>' +

      '<div class="railsec"><h4>Operating picture</h4>' +
      '<div class="stat"><span class="sl">Modelled $2M+ starts</span><span class="sv">' + U.n0(e.derived.luxStarts) + '/yr</span></div>' +
      '<div class="stat"><span class="sl">Luxury construction volume</span><span class="sv">' + U.usdM(e.derived.luxStartsVolumeM) + '/yr</span></div>' +
      '<div class="stat"><span class="sl">Established luxury GCs</span><span class="sv">' + m.p.luxGcCount + '</span></div>' +
      '<div class="stat"><span class="sl">Starts per incumbent</span><span class="sv">' + U.n1(e.derived.startsPerIncumbent) + '</span></div>' +
      '<div class="stat"><span class="sl">Avg luxury project</span><span class="sv">' + U.usdM(e.derived.avgProjectValueM) + '</span></div>' +
      '<div class="stat"><span class="sl">Construction cost</span><span class="sv">$' + m.p.costPsf + '/sf</span></div>' +
      '<div class="stat"><span class="sl">Gross spec margin</span><span class="sv">' + U.pct(e.derived.specMarginPct) + '</span></div>' +
      '<div class="stat"><span class="sl">Contractor backlog</span><span class="sv">' + U.n1(m.p.backlog) + ' months</span></div>' +
      '</div>' +

      (sigs.length ? '<div class="railsec"><h4>Signals <span class="dim2">' + sigs.length + '</span></h4>' +
        sigs.slice(0, 7).map(function (s) {
          return '<div class="alert sev' + s.sev + '" style="margin-bottom:6px"><h5>' +
            (s.kind === 'risk' ? '<span style="color:var(--neg)">▲</span>' : '<span style="color:var(--accent)">●</span>') +
            U.esc(s.label) + '</h5><p>' + U.esc(s.why) + '</p></div>';
        }).join('') + '</div>' : '') +

      '<div class="railsec"><div class="flex gap6">' +
      '<button class="btn wide" data-act="profile" data-id="' + id + '">Open full profile</button>' +
      '<button class="btn" data-act="focus" data-id="' + id + '" title="Zoom map to market">⌖</button>' +
      '</div>' +
      '<div class="flex gap6 mt6">' +
      '<button class="btn wide" data-act="ic" data-id="' + id + '">Investment thesis</button>' +
      '<button class="btn" data-act="cmp" data-id="' + id + '" title="Add to comparison">' +
      (ST.S.compare.indexOf(id) >= 0 ? '✓' : '+') + '</button>' +
      '</div></div>';
  }

  function encodingHtml() {
    var lo = U.cssvar('--s0', '#4a6fa5'), hi = U.cssvar('--s4', '#df7a33'),
        up = U.cssvar('--s2', '#7fbf5a'), dn = U.cssvar('--s5', '#b8442a'),
        ink = U.cssvar('--ink-3', '#767c87');
    function dot(a) { return '<svg width="46" height="18">' + a + '</svg>'; }
    return '<table style="width:100%;font-size:11px;color:var(--ink-3)">' +
      '<tr><td style="padding:3px 0;width:52px">' +
      dot('<circle cx="10" cy="9" r="3.5" fill="' + ink + '"/><circle cx="32" cy="9" r="8" fill="' + ink + '"/>') +
      '</td><td>Size — annual $2M+ construction volume</td></tr>' +
      '<tr><td style="padding:3px 0">' +
      dot('<circle cx="12" cy="9" r="6" fill="' + lo + '"/><circle cx="34" cy="9" r="6" fill="' + hi + '"/>') +
      '</td><td>Fill — active layer value, low to high</td></tr>' +
      '<tr><td style="padding:3px 0">' +
      dot('<circle cx="12" cy="9" r="6" fill="none" stroke="' + dn + '" stroke-width="2"/><circle cx="34" cy="9" r="6" fill="none" stroke="' + up + '" stroke-width="2"/>') +
      '</td><td>Ring — permit growth, falling to rising</td></tr>' +
      '<tr><td style="padding:3px 0">' +
      dot('<circle cx="22" cy="9" r="4" fill="' + hi + '"/><circle cx="22" cy="9" r="8" fill="none" stroke="' + hi + '" opacity=".4"/>') +
      '</td><td>Pulse — momentum index above 66</td></tr></table>';
  }

  function topOfBook() {
    return '<table class="grid" style="font-size:11.5px">' +
      ST.filtered().slice(0, 12).map(function (r) {
        return '<tr data-act="select" data-id="' + r.id + '"><td class="l" style="padding:4px 0">' +
          '<span class="rank">' + r.rank + '</span> ' + U.esc(r.m.name.length > 26 ? r.m.name.slice(0, 25) + '…' : r.m.name) +
          '</td><td style="padding:4px 0">' + U.scoreChip(r.lcdos) + '</td></tr>';
      }).join('') + '</table>';
  }

  /* ---------------------------------------------------------------- shell */
  function breadcrumb() {
    var d = MAP.getDrill();
    var bits = ['<b data-act="drillnation" style="cursor:pointer">UNITED STATES</b>'];
    if (d.state) bits.push('<span>›</span><b data-act="drillstate" data-f="' + d.state + '" style="cursor:pointer">' + U.esc(MAP.stateName(d.state).toUpperCase()) + '</b>');
    if (d.county) bits.push('<span>›</span><b>' + U.esc(MAP.countyName(d.county).toUpperCase()) + '</b>');
    return bits.join('');
  }

  function legend() {
    var layer = MAP.LAYER_BY_ID[ST.S.layer] || MAP.LAYERS[0];
    var vis = ST.filtered();
    return '<div class="legendrow" style="margin-bottom:5px"><span class="tiny" style="letter-spacing:.1em">' + U.esc(layer.label) + '</span></div>' +
      '<div class="legendrow"><span class="mono dim2" style="font-size:9px">LOW</span><span class="rampbar"></span><span class="mono dim2" style="font-size:9px">HIGH</span></div>' +
      '<div class="legendrow mt6"><span class="mono dim2" style="font-size:10px">' + vis.length + ' of ' + ST.DER.ranked.length + ' markets' +
      (FILTERS.activeCount() ? ' · ' + FILTERS.activeCount() + ' filters' : '') + '</span></div>';
  }

  function render(root) {
    body = root;
    body.innerHTML =
      '<div class="rail" id="mapRail">' + railHead() +
      (railTab === 'layers'
        ? ('<div class="railsec"><h4>Display</h4>' +
           '<div class="toggle' + (ST.S.showLabels ? ' on' : '') + '" data-act="tglabels"><span class="sw"></span>Market labels</div>' +
           '<div class="toggle' + (ST.S.showCounties ? ' on' : '') + '" data-act="tgcounties"><span class="sw"></span>County boundaries</div>' +
           '<div class="ctl mt10"><label>Labels shown <b>' + ST.S.labelTop + '</b></label>' +
           '<input type="range" min="0" max="79" step="1" value="' + ST.S.labelTop + '" data-th="labelTop"></div></div>' +
           layerRail())
        : FILTERS.render()) +
      '</div>' +
      '<div class="stage"><div class="mapwrap" id="mapWrap"></div>' +
      '<div class="mapctl tl"><div class="breadcrumb" id="crumb">' + breadcrumb() + '</div></div>' +
      '<div class="mapctl bl" id="legend">' + legend() + '</div>' +
      '<div class="mapctl br">' +
      '<button class="btn sm" data-act="zin">+</button>' +
      '<button class="btn sm" data-act="zout">−</button>' +
      '<button class="btn sm" data-act="zreset">RESET</button>' +
      '</div></div>' +
      '<div class="rail right" id="inspector">' + inspector() + '</div>';

    MAP.render(document.getElementById('mapWrap'), {
      onSelect: function (id) { ST.selectMarket(id); },
      onDrill: function () { var c = document.getElementById('crumb'); if (c) c.innerHTML = breadcrumb(); }
    });
    wire();
  }

  function redrawMap() {
    MAP.render(document.getElementById('mapWrap'), {
      onSelect: function (id) { ST.selectMarket(id); },
      onDrill: function () { var c = document.getElementById('crumb'); if (c) c.innerHTML = breadcrumb(); }
    });
    var lg = document.getElementById('legend'); if (lg) lg.innerHTML = legend();
  }

  function refreshInspector() {
    var el = document.getElementById('inspector');
    if (el) el.innerHTML = inspector();
  }

  function wire() {
    U.on(body, 'click', '[data-railtab]', function (e, t) {
      railTab = t.dataset.railtab; render(body);
    });
    if (railTab === 'filters') {
      var rail = document.getElementById('mapRail');
      if (rail) FILTERS.wire(rail, function () {
        redrawMap(); refreshInspector();
        var b = rail.querySelector('[data-railtab="filters"] .fcount');
        var n = FILTERS.activeCount();
        if (b) { if (n) b.textContent = n; else b.remove(); }
        else if (n) {
          var btn = rail.querySelector('[data-railtab="filters"]');
          if (btn) btn.insertAdjacentHTML('beforeend', ' <span class="fcount">' + n + '</span>');
        }
      });
    }
    U.on(body, 'click', '[data-layer]', function (e, t) {
      ST.S.layer = t.dataset.layer;
      U.$$('[data-layer]', body).forEach(function (b) { b.classList.toggle('on', b.dataset.layer === ST.S.layer); });
      redrawMap();
    });
    U.on(body, 'click', '[data-act]', function (e, t) {
      var a = t.dataset.act, id = t.dataset.id;
      if (a === 'zin') MAP.zoomBy(1.5);
      else if (a === 'zout') MAP.zoomBy(1 / 1.5);
      else if (a === 'zreset') MAP.reset();
      else if (a === 'drillnation') MAP.reset();
      else if (a === 'drillstate') MAP.enterState(t.dataset.f);
      else if (a === 'select') ST.selectMarket(id);
      else if (a === 'focus') MAP.focusMarket(id);
      else if (a === 'profile') { ST.selectMarket(id); ST.set({ view: 'market' }, 'view'); }
      else if (a === 'ic') { ST.selectMarket(id); ST.set({ view: 'ic' }, 'view'); }
      else if (a === 'cmp') { ST.toggleCompare(id); refreshInspector(); }
      else if (a === 'tglabels') { ST.S.showLabels = !ST.S.showLabels; t.classList.toggle('on'); redrawMap(); }
      else if (a === 'tgcounties') { ST.S.showCounties = !ST.S.showCounties; t.classList.toggle('on'); redrawMap(); }
    });
    U.on(body, 'input', '[data-th]', function (e, t) {
      if (t.dataset.th !== 'labelTop') return;
      ST.S.labelTop = +t.value;
      var lab = t.previousElementSibling && t.previousElementSibling.querySelector('b');
      if (lab) lab.textContent = t.value;
      redrawMap();
    });
  }

  return {
    render: render,
    onEvent: function (what) {
      if (!body) return;
      if (what === 'select') { refreshInspector(); redrawMap(); }
      else if (what === 'scenario' || what === 'compare') { redrawMap(); refreshInspector(); }
    }
  };
})(STORE, U, CH);

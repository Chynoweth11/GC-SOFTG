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

  function filterRail() {
    var D = ST.DATA;
    var regions = {}, archs = {}, tiers = {};
    D.MARKETS.forEach(function (m) { regions[m.region] = 1; archs[m.archetype] = 1; tiers[m.tier] = 1; });
    var f = ST.S.filters;

    function chipset(obj, key, labelFn) {
      return Object.keys(obj).sort().map(function (k) {
        return '<button class="chip' + (f[key].indexOf(k) >= 0 ? ' on' : '') + '" data-f="' + key + '" data-v="' + U.esc(k) + '">' +
          U.esc(labelFn ? labelFn(k) : k) + '</button>';
      }).join('');
    }

    return '<div class="railsec"><h4>Region</h4><div class="chips">' + chipset(regions, 'regions') + '</div></div>' +
      '<div class="railsec"><h4>Market type</h4><div class="chips">' +
      chipset(archs, 'archetypes', function (k) { return D.ARCHETYPES[k] ? D.ARCHETYPES[k].label : k; }) + '</div></div>' +
      '<div class="railsec"><h4>Maturity tier</h4><div class="chips">' + chipset(tiers, 'tiers') + '</div></div>' +
      '<div class="railsec"><h4>Thresholds</h4>' +
      '<div class="ctl"><label>Minimum LCDOS <b>' + f.minScore + '</b></label>' +
      '<input type="range" min="0" max="80" step="1" value="' + f.minScore + '" data-th="minScore"></div>' +
      '<div class="ctl"><label>Minimum confidence <b>' + f.minConf + '</b></label>' +
      '<input type="range" min="0" max="80" step="1" value="' + f.minConf + '" data-th="minConf"></div>' +
      '<button class="btn wide" data-act="clearfilters">Clear all filters</button></div>';
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
      CH.hbars(cats, { width: 366, labelW: 168, valW: 40, rowH: 21 }) + '</div>' +

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
            (s.kind === 'risk' ? '<span style="color:var(--red)">▲</span>' : '<span style="color:var(--teal)">●</span>') +
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
    return '<table style="width:100%;font-size:11px;color:var(--ink-3)">' +
      '<tr><td style="padding:3px 0;width:52px"><svg width="46" height="18"><circle cx="10" cy="9" r="3.5" fill="#2fae91"/><circle cx="32" cy="9" r="8" fill="#2fae91"/></svg></td>' +
      '<td>Size — annual $2M+ construction volume</td></tr>' +
      '<tr><td style="padding:3px 0"><svg width="46" height="18"><circle cx="12" cy="9" r="6" fill="#2d4257"/><circle cx="34" cy="9" r="6" fill="#ff7a45"/></svg></td>' +
      '<td>Fill — active layer value</td></tr>' +
      '<tr><td style="padding:3px 0"><svg width="46" height="18"><circle cx="12" cy="9" r="6" fill="none" stroke="#f2545b" stroke-width="2"/><circle cx="34" cy="9" r="6" fill="none" stroke="#3fd9ad" stroke-width="2"/></svg></td>' +
      '<td>Ring — permit growth (red falling, teal rising)</td></tr>' +
      '<tr><td style="padding:3px 0"><svg width="46" height="18"><circle cx="22" cy="9" r="4" fill="#3fd9ad"/><circle cx="22" cy="9" r="8" fill="none" stroke="#3fd9ad" opacity=".4"/></svg></td>' +
      '<td>Pulse — momentum index above 66</td></tr></table>';
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
      '<div class="legendrow mt6"><span class="mono dim2" style="font-size:9.5px">' + vis.length + ' of ' + ST.DER.ranked.length + ' markets shown</span></div>';
  }

  function render(root) {
    body = root;
    body.innerHTML =
      '<div class="rail" id="mapRail">' +
      '<div class="railsec"><h4>Map layer</h4>' +
      '<div class="toggle' + (ST.S.showLabels ? ' on' : '') + '" data-act="tglabels"><span class="sw"></span>Market labels</div>' +
      '<div class="ctl mt6"><label>Labels shown <b>' + ST.S.labelTop + '</b></label>' +
      '<input type="range" min="0" max="79" step="1" value="' + ST.S.labelTop + '" data-th="labelTop"></div></div>' +
      layerRail() + filterRail() +
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
    U.on(body, 'click', '[data-layer]', function (e, t) {
      ST.S.layer = t.dataset.layer;
      U.$$('[data-layer]', body).forEach(function (b) { b.classList.toggle('on', b.dataset.layer === ST.S.layer); });
      redrawMap();
    });
    U.on(body, 'click', '[data-f][data-v]', function (e, t) {
      var arr = ST.S.filters[t.dataset.f], v = t.dataset.v, i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1); else arr.push(v);
      t.classList.toggle('on');
      redrawMap(); refreshInspector();
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
      else if (a === 'clearfilters') {
        ST.S.filters = { regions: [], archetypes: [], tiers: [], minScore: 0, minConf: 0, q: '' };
        render(body);
      }
    });
    U.on(body, 'input', '[data-th]', function (e, t) {
      var k = t.dataset.th, v = +t.value;
      if (k === 'labelTop') ST.S.labelTop = v; else ST.S.filters[k] = v;
      var lab = t.previousElementSibling && t.previousElementSibling.querySelector('b');
      if (lab) lab.textContent = v;
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

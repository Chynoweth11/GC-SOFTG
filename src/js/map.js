/* ============================================================================
 * map.js — the interactive U.S. intelligence map.
 * ----------------------------------------------------------------------------
 * Nodes encode four dimensions at once:
 *   size      market opportunity — annual $2M+ construction volume (log-scaled)
 *   intensity the active layer's value, on the LCDOS ramp
 *   ring      construction momentum — 3-yr permit CAGR
 *   pulse     acceleration — markets whose momentum index clears the threshold
 *
 * Drill path: NATION -> STATE -> COUNTY. County geometry fades in above the
 * zoom threshold, or immediately when a state is entered.
 * ==========================================================================*/
var MAP = (function (GEO, ST, U) {
  'use strict';

  var W = GEO.box[0], H = GEO.box[1];

  /* ------------------------------------------------------------ bounding */
  var BBOX = {};
  function bboxOf(d) {
    var nums = d.match(/-?[\d.]+/g);
    if (!nums) return null;
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    for (var i = 0; i < nums.length; i += 2) {
      var x = +nums[i], y = +nums[i + 1];
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
    return [minx, miny, maxx, maxy];
  }
  GEO.states.forEach(function (s) { BBOX['S' + s.id] = bboxOf(s.d); });
  GEO.counties.forEach(function (c) { BBOX['C' + c.id] = bboxOf(c.d); });

  var COUNTIES_BY_STATE = {};
  GEO.counties.forEach(function (c) { (COUNTIES_BY_STATE[c.s] = COUNTIES_BY_STATE[c.s] || []).push(c); });

  /* ============================== LAYERS ============================== */
  function d(x) { return function (r) { return r.e.derived[x]; }; }
  function p(x) { return function (r) { return r.m.p[x]; }; }

  var LAYERS = [
    { g: 'Scores', id: 'lcdos', label: 'LCDOS overall score',
      v: function (r) { return r.lcdos; }, txt: function (r) { return U.n1(r.lcdos) + ' / 100'; } },
    { g: 'Scores', id: 'gce', label: 'GC entry opportunity',
      v: function (r) { return r.gce; }, txt: function (r) { return U.n1(r.gce) + ' / 100'; } },
    { g: 'Scores', id: 'dev', label: 'Developer opportunity',
      v: function (r) { return r.dev; }, txt: function (r) { return U.n1(r.dev) + ' / 100'; } },
    { g: 'Scores', id: 'gap', label: 'Opportunity gap',
      v: function (r) { return r.gap; }, txt: function (r) { return U.n1(r.gap) + ' (50 = neutral)'; } },
    { g: 'Scores', id: 'momentum', label: 'Momentum index',
      v: function (r) { return r.momentum; }, txt: function (r) { return U.n0(r.momentum) + ' · ' + U.pctS(r.momentumRate) + '/yr'; } },
    { g: 'Scores', id: 'cls', label: 'Current luxury strength',
      v: function (r) { return r.cls; }, txt: function (r) { return U.n1(r.cls) + ' / 100'; } },
    { g: 'Scores', id: 'confidence', label: 'Data confidence',
      v: function (r) { return r.confidence; }, txt: function (r) { return r.confidence + ' — ' + U.confBand(r.confidence).label; } },
    { g: 'Scores', id: 'risk', label: 'Long-run risk (inverted)',
      v: function (r) { return 100 - r.risk; }, txt: function (r) { return 'risk ' + U.n0(r.risk) + ' / 100'; } },

    { g: 'Wealth', id: 'wealth', label: 'Millionaire density',
      v: function (r) { return r.e.ind['w.density']; }, txt: function (r) { return U.n0(r.m.p.hnwiPer1k) + ' per 1,000 households'; } },
    { g: 'Wealth', id: 'wealthgrowth', label: 'Millionaire migration',
      v: function (r) { return r.e.ind['w.growth']; }, txt: function (r) { return U.pct(r.m.p.hnwiG10, 0) + ' over 10 years'; } },
    { g: 'Wealth', id: 'agi', label: 'Net AGI inflow',
      v: function (r) { return r.e.ind['w.agiInflow']; }, txt: function (r) { return U.usdFull(r.m.p.agiIn) + ' per return'; } },
    { g: 'Wealth', id: 'billionaire', label: 'UHNW & billionaire presence',
      v: p('uhnwIdx'), txt: function (r) { return r.m.p.uhnwIdx + ' / 100'; } },
    { g: 'Wealth', id: 'secondhome', label: 'Second-home ownership',
      v: function (r) { return r.e.ind['w.secondHome']; }, txt: function (r) { return U.pct(r.m.p.shShare, 0) + ' of units'; } },

    { g: 'Construction', id: 'permits', label: 'Permit density',
      v: function (r) { return r.e.ind['c.permitDensity']; }, txt: function (r) { return U.n1(r.e.derived.permitsPer1kHH) + ' per 1k HH'; } },
    { g: 'Construction', id: 'permitgrowth', label: 'Permit growth',
      v: function (r) { return r.e.ind['c.permitGrowth']; }, txt: function (r) { return U.pctS(r.m.p.permitCagr3) + ' a year'; } },
    { g: 'Construction', id: 'luxconstruction', label: 'Luxury construction volume',
      v: function (r) { return r.e.ind['c.luxNewBuild']; }, txt: function (r) { return U.n0(r.e.derived.luxStarts) + ' starts · ' + U.usdM(r.e.derived.luxStartsVolumeM); } },
    { g: 'Construction', id: 'remodel', label: 'High-end remodel activity',
      v: p('remodelIdx'), txt: function (r) { return r.m.p.remodelIdx + ' / 100'; } },
    { g: 'Construction', id: 'saturation', label: 'Incumbent saturation',
      v: function (r) { return r.e.ind['c.capacityGap']; }, txt: function (r) { return U.n1(r.e.derived.startsPerIncumbent) + ' starts per luxury GC'; } },
    { g: 'Construction', id: 'trades', label: 'Trade availability',
      v: p('tradeIdx'), txt: function (r) { return r.m.p.tradeIdx + ' / 100 · backlog ' + U.n1(r.m.p.backlog) + ' mo'; } },
    { g: 'Construction', id: 'cost', label: 'Construction cost',
      v: function (r) { return U.clamp((r.m.p.costPsf - 250) / 11, 0, 100); }, txt: function (r) { return '$' + r.m.p.costPsf + '/sf'; } },

    { g: 'Development', id: 'pipeline', label: 'Development pipeline',
      v: function (r) { return r.e.ind['p.pipelinePerCap']; }, txt: function (r) { return U.usdM(r.m.p.pipelineM) + ' · ' + U.usdFull(r.e.derived.pipelinePerCap) + '/resident'; } },
    { g: 'Development', id: 'infra', label: 'Infrastructure investment',
      v: function (r) { return r.e.ind['p.infrastructure']; }, txt: function (r) { return U.usdM(r.m.p.infraM) + ' committed'; } },
    { g: 'Development', id: 'entitled', label: 'Entitled lot inventory',
      v: function (r) { return r.e.ind['p.entitledSupply']; }, txt: function (r) { return U.n0(r.m.p.entitledLots) + ' lots · ' + U.n1(r.e.derived.lotRunwayYears) + ' yrs runway'; } },
    { g: 'Development', id: 'land', label: 'Land availability',
      v: p('landIdx'), txt: function (r) { return r.m.p.landIdx + ' / 100'; } },
    { g: 'Development', id: 'scarcity', label: 'Land scarcity',
      v: function (r) { return 100 - r.m.p.landIdx; }, txt: function (r) { return 'availability ' + r.m.p.landIdx + ' / 100'; } },
    { g: 'Development', id: 'restrictions', label: 'Development restrictions',
      v: p('regIdx'), txt: function (r) { return 'burden ' + r.m.p.regIdx + '/100 · ' + r.m.p.entMonths + ' mo to entitle'; } },
    { g: 'Development', id: 'shortage', label: 'Housing shortage',
      v: p('shortageIdx'), txt: function (r) { return r.m.p.shortageIdx + ' / 100'; } },
    { g: 'Development', id: 'spec', label: 'Spec-home margin',
      v: function (r) { return r.e.ind['d.specEconomics']; }, txt: function (r) { return U.pct(r.e.derived.specMarginPct) + ' gross'; } },

    { g: 'Market', id: 'appreciation', label: 'Home appreciation (5-yr)',
      v: function (r) { return r.e.ind['l.apprec']; }, txt: function (r) { return U.pct(r.m.p.apprec5, 0) + ' over 5 years'; } },
    { g: 'Market', id: 'ppsf', label: 'Luxury price per sq ft',
      v: function (r) { return r.e.ind['l.luxPpsf']; }, txt: function (r) { return '$' + U.n0(r.m.p.luxPpsf) + '/sf'; } },
    { g: 'Market', id: 'tx5m', label: '$5M+ transaction depth',
      v: function (r) { return r.e.ind['l.tx5m']; }, txt: function (r) { return U.n0(r.m.p.tx5m) + ' closings a year'; } },
    { g: 'Market', id: 'popgrowth', label: 'Population growth',
      v: function (r) { return r.e.ind['g.popGrowth']; }, txt: function (r) { return U.pctS(r.m.p.popCagr5) + ' a year'; } },

    { g: 'Destination', id: 'tourism', label: 'Visitor intensity',
      v: function (r) { return r.e.ind['t.intensity']; }, txt: function (r) { return U.n1(r.e.derived.visitorsPerCap) + 'x population · ' + U.n1(r.m.p.visitorsM) + 'M visitors'; } },
    { g: 'Destination', id: 'luxhotels', label: 'Luxury hotel depth',
      v: function (r) { return r.e.ind['t.luxLodging']; }, txt: function (r) { return U.n0(r.m.p.luxRooms) + ' rooms @ $' + r.m.p.adr + ' ADR'; } },
    { g: 'Destination', id: 'clubs', label: 'Private club ecosystem',
      v: p('clubIdx'), txt: function (r) { return r.m.p.clubIdx + ' / 100'; } },
    { g: 'Destination', id: 'prestige', label: 'Prestige & exclusivity',
      v: function (r) { return r.e.cat.prestige; }, txt: function (r) { return U.n1(r.e.cat.prestige) + ' / 100'; } },
    { g: 'Destination', id: 'aviation', label: 'Private aviation',
      v: function (r) { return r.e.ind['a.privateAir']; }, txt: function (r) { return U.n0(r.m.p.jetOps) + 'k jet ops a year'; } },
    { g: 'Destination', id: 'access', label: 'Accessibility',
      v: function (r) { return r.e.cat.access; }, txt: function (r) { return U.n1(r.e.cat.access) + ' / 100 · ' + r.m.p.nonstops + ' nonstops'; } }
  ];
  var LAYER_BY_ID = {};
  LAYERS.forEach(function (l) { LAYER_BY_ID[l.id] = l; });

  /* Node radius encodes annual $2M+ construction volume, log-scaled. */
  function nodeR(r) {
    var volM = r.e.derived.luxStartsVolumeM;
    return 3.1 + 8.4 * U.clamp(Math.log(Math.max(volM, 1) + 1) / Math.log(3200), 0, 1);
  }

  /* ============================== RENDER ============================== */
  var el = null, svg = null, gZoom = null, tip = null, onSelect = null;
  var view = { k: 1, x: 0, y: 0 };
  var drill = { level: 'nation', state: null, county: null };

  function project(m) {
    return window.Albers ? window.Albers.albersUsa(1300, [487.5, 305]).point(m.lon, m.lat) : null;
  }
  var PROJ = window.Albers ? window.Albers.albersUsa(1300, [487.5, 305]) : null;

  function xy(m) {
    var q = PROJ ? PROJ.point(m.lon, m.lat) : null;
    return q ? { x: q[0], y: q[1] } : { x: -999, y: -999 };
  }

  function applyTransform() {
    gZoom.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.k + ')');
    /* Counter-scale nodes and labels so they keep a constant screen size. */
    var inv = 1 / view.k;
    var nodes = svg.querySelectorAll('.node');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.setAttribute('transform', 'translate(' + n.dataset.x + ',' + n.dataset.y + ') scale(' + inv + ')');
    }
    var cg = svg.querySelector('#counties');
    if (cg) {
      var showC = drill.level !== 'nation' || view.k >= 2.4;
      cg.style.opacity = showC ? U.clamp((view.k - 1.2) / 1.6, 0.25, 1) : 0;
    }
  }

  function fitTo(box, padFrac) {
    if (!box) return;
    var pad = padFrac == null ? 0.12 : padFrac;
    var bw = box[2] - box[0], bh = box[3] - box[1];
    var k = Math.min(W / (bw * (1 + pad)), H / (bh * (1 + pad)));
    k = U.clamp(k, 1, 26);
    view.k = k;
    view.x = W / 2 - k * (box[0] + bw / 2);
    view.y = H / 2 - k * (box[1] + bh / 2);
    applyTransform();
  }

  function reset() {
    drill = { level: 'nation', state: null, county: null };
    view = { k: 1, x: 0, y: 0 };
    applyTransform();
    if (onDrill) onDrill(drill);
  }

  var onDrill = null;

  function enterState(fips) {
    drill = { level: 'state', state: fips, county: null };
    fitTo(BBOX['S' + fips], 0.18);
    if (onDrill) onDrill(drill);
  }
  function enterCounty(fips) {
    drill = { level: 'county', state: fips.slice(0, 2), county: fips };
    fitTo(BBOX['C' + fips], 0.6);
    if (onDrill) onDrill(drill);
  }

  /* --------------------------------------------------------------- build */
  function render(container, opts) {
    el = container;
    onSelect = opts.onSelect;
    onDrill = opts.onDrill;

    var layer = LAYER_BY_ID[ST.S.layer] || LAYERS[0];
    var rows = ST.filtered();
    var allRows = ST.DER.ranked;
    var selId = ST.S.selected;

    /* markets with data, keyed by county fips, for county tinting */
    var byCounty = {};
    allRows.forEach(function (r) { byCounty[r.m.countyFips] = r; });

    var parts = [];
    parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">');
    parts.push('<defs>' +
      '<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">' +
      '<feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>');
    parts.push('<g id="zoom">');

    /* states */
    parts.push('<g id="states">');
    GEO.states.forEach(function (s) {
      var hot = drill.state === s.id;
      parts.push('<path class="st-path' + (hot ? ' hot' : '') + '" data-state="' + s.id + '" d="' + s.d + '"><title>' + U.esc(s.name) + '</title></path>');
    });
    parts.push('</g>');

    /* counties */
    parts.push('<g id="counties" style="opacity:0">');
    var cList = drill.state ? (COUNTIES_BY_STATE[drill.state] || []) : GEO.counties;
    cList.forEach(function (c) {
      var r = byCounty[c.id];
      var fill = '';
      if (r) {
        var v = layer.v(r);
        fill = ' fill="' + U.scoreColor(v) + '" fill-opacity="0.13"';
      }
      parts.push('<path class="co-path' + (r ? ' data' : '') + '" data-county="' + c.id + '" d="' + c.d + '"' + fill + '><title>' +
        U.esc(c.n) + '</title></path>');
    });
    parts.push('</g>');

    parts.push('<path class="nation" d="' + GEO.nation + '"/>');

    /* nodes — drawn small-to-large so the biggest sit on top */
    parts.push('<g id="nodes">');
    var visible = rows.slice().sort(function (a, b) { return nodeR(a) - nodeR(b); });
    var dim = rows.length < allRows.length;
    if (dim) {
      allRows.filter(function (r) { return !ST.passes(r); }).forEach(function (r) {
        var q = xy(r.m);
        parts.push('<g class="node" data-id="' + r.id + '" data-x="' + q.x.toFixed(2) + '" data-y="' + q.y.toFixed(2) + '" opacity=".16">' +
          '<circle class="core" r="2.4" fill="#3b4757"/></g>');
      });
    }

    /* label priority: top N by the active layer's value */
    var labelSet = {};
    if (ST.S.showLabels) {
      visible.slice().sort(function (a, b) { return layer.v(b) - layer.v(a); })
        .slice(0, ST.S.labelTop).forEach(function (r) { labelSet[r.id] = 1; });
      if (selId) labelSet[selId] = 1;
    }

    visible.forEach(function (r) {
      var q = xy(r.m), v = layer.v(r), col = U.scoreColor(v), R = nodeR(r);
      var mom = r.m.p.permitCagr3;
      var ringCol = mom >= 4 ? '#3fd9ad' : mom >= 1 ? '#5aa9f5' : mom >= -1 ? '#4a5769' : '#f2545b';
      var ringW = U.clamp(0.8 + Math.abs(mom) * 0.16, 0.8, 2.6);
      var pulse = r.momentum >= 66;
      var sel = r.id === selId;

      var g = ['<g class="node' + (sel ? ' sel' : '') + '" data-id="' + r.id + '" data-x="' + q.x.toFixed(2) + '" data-y="' + q.y.toFixed(2) + '">'];
      g.push('<circle class="halo" r="' + (R + 7).toFixed(1) + '" fill="' + col + '"/>');
      if (pulse) {
        g.push('<circle fill="none" stroke="' + col + '" stroke-width="1.1" opacity="0">' +
          '<animate attributeName="r" values="' + (R + 2).toFixed(1) + ';' + (R + 17).toFixed(1) + '" dur="2.6s" repeatCount="indefinite"/>' +
          '<animate attributeName="opacity" values="0.62;0" dur="2.6s" repeatCount="indefinite"/></circle>');
      }
      g.push('<circle class="ring" r="' + (R + 3.2).toFixed(1) + '" stroke="' + ringCol + '" stroke-width="' + ringW.toFixed(2) + '" stroke-opacity=".85"/>');
      g.push('<circle class="core" r="' + R.toFixed(1) + '" fill="' + col + '"' + (v >= 72 ? ' filter="url(#glow)"' : '') + '/>');
      if (labelSet[r.id]) {
        g.push('<text class="lbl" x="0" y="' + (-(R + 6.5)).toFixed(1) + '" text-anchor="middle">' + U.esc(shortName(r.m.name)) + '</text>');
      }
      g.push('</g>');
      parts.push(g.join(''));
    });
    parts.push('</g>');

    parts.push('</g></svg>');

    el.innerHTML = parts.join('');
    svg = el.querySelector('svg');
    gZoom = svg.querySelector('#zoom');
    applyTransform();
    wire();
  }

  function shortName(n) {
    return n.replace(/ (&|and) .*$/, '').replace(/,.*$/, '').slice(0, 22);
  }

  /* ------------------------------------------------------------- events */
  var wired = false;
  function wire() {
    if (!svg) return;

    /* wheel zoom about the cursor */
    svg.onwheel = function (e) {
      e.preventDefault();
      var rect = svg.getBoundingClientRect();
      var sx = (e.clientX - rect.left) / rect.width * W;
      var sy = (e.clientY - rect.top) / rect.height * H;
      var f = Math.exp(-e.deltaY * 0.0016);
      var k2 = U.clamp(view.k * f, 1, 30);
      f = k2 / view.k;
      view.x = sx - f * (sx - view.x);
      view.y = sy - f * (sy - view.y);
      view.k = k2;
      if (view.k <= 1.02) { view.k = 1; view.x = 0; view.y = 0; }
      applyTransform();
    };

    /* drag pan */
    var dragging = false, last = null, moved = 0;
    svg.onmousedown = function (e) { dragging = true; moved = 0; last = [e.clientX, e.clientY]; svg.classList.add('drag'); };
    window.addEventListener('mouseup', function () { dragging = false; if (svg) svg.classList.remove('drag'); });
    svg.onmousemove = function (e) {
      if (dragging && last) {
        var rect = svg.getBoundingClientRect();
        var dx = (e.clientX - last[0]) / rect.width * W;
        var dy = (e.clientY - last[1]) / rect.height * H;
        moved += Math.abs(dx) + Math.abs(dy);
        view.x += dx; view.y += dy;
        last = [e.clientX, e.clientY];
        applyTransform();
      }
    };

    /* hover tooltip */
    svg.addEventListener('mousemove', function (e) {
      var g = e.target.closest ? e.target.closest('.node') : null;
      if (g && g.dataset.id) showTip(g.dataset.id, e);
      else hideTip();
    });
    svg.addEventListener('mouseleave', hideTip);

    svg.addEventListener('click', function (e) {
      if (moved > 6) { moved = 0; return; }
      var g = e.target.closest ? e.target.closest('.node') : null;
      if (g && g.dataset.id) { if (onSelect) onSelect(g.dataset.id); return; }
      var cp = e.target.closest ? e.target.closest('[data-county]') : null;
      if (cp && drill.level === 'state') { enterCounty(cp.dataset.county); return; }
      var sp = e.target.closest ? e.target.closest('[data-state]') : null;
      if (sp) { enterState(sp.dataset.state); }
    });
  }

  function showTip(id, e) {
    var r = ST.get(id); if (!r) return;
    var layer = LAYER_BY_ID[ST.S.layer] || LAYERS[0];
    if (!tip) { tip = document.createElement('div'); tip.className = 'maptip'; el.appendChild(tip); }
    var sigs = (ST.DER.signals[id] || []).filter(function (s) { return s.kind === 'opportunity'; }).length;
    tip.innerHTML =
      '<h5>' + U.esc(r.m.name) + ' <span class="dim2 mono" style="font-size:10px">' + r.m.state + '</span></h5>' +
      '<div class="flex between center" style="margin-bottom:5px">' +
      '<span class="tiny">' + U.esc(layer.label) + '</span>' + U.scoreChip(layer.v(r)) + '</div>' +
      '<div class="dim" style="font-size:11px;margin-bottom:6px">' + U.esc(layer.txt(r)) + '</div>' +
      '<div class="flex gap6" style="font-size:10px;flex-wrap:wrap">' +
      '<span class="pill">#' + r.rank + ' LCDOS ' + U.n1(r.lcdos) + '</span>' +
      '<span class="pill">GC ' + U.n0(r.gce) + '</span>' +
      '<span class="pill">DEV ' + U.n0(r.dev) + '</span>' +
      (r.e.entryAlert ? '<span class="pill hot">ENTRY ALERT</span>' : '') +
      (sigs ? '<span class="pill live">' + sigs + ' signals</span>' : '') +
      '</div>';
    var rect = el.getBoundingClientRect();
    var x = e.clientX - rect.left + 14, y = e.clientY - rect.top + 14;
    if (x + 320 > rect.width) x = e.clientX - rect.left - 320;
    if (y + 150 > rect.height) y = e.clientY - rect.top - 150;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.style.display = 'block';
  }
  function hideTip() { if (tip) tip.style.display = 'none'; }

  function zoomBy(f) {
    var k2 = U.clamp(view.k * f, 1, 30);
    var g = k2 / view.k;
    view.x = W / 2 - g * (W / 2 - view.x);
    view.y = H / 2 - g * (H / 2 - view.y);
    view.k = k2;
    if (view.k <= 1.02) { view.k = 1; view.x = 0; view.y = 0; }
    applyTransform();
  }

  function focusMarket(id) {
    var r = ST.get(id); if (!r) return;
    var q = xy(r.m);
    view.k = Math.max(view.k, 5.5);
    view.x = W / 2 - view.k * q.x;
    view.y = H / 2 - view.k * q.y;
    drill = { level: 'county', state: r.m.stateFips, county: r.m.countyFips };
    applyTransform();
    if (onDrill) onDrill(drill);
  }

  return {
    LAYERS: LAYERS, LAYER_BY_ID: LAYER_BY_ID,
    render: render, reset: reset, zoomBy: zoomBy,
    enterState: enterState, enterCounty: enterCounty, focusMarket: focusMarket,
    getDrill: function () { return drill; },
    getView: function () { return view; },
    stateName: function (f) { var s = GEO.states.filter(function (x) { return x.id === f; })[0]; return s ? s.name : f; },
    countyName: function (f) { var c = GEO.counties.filter(function (x) { return x.id === f; })[0]; return c ? c.n : f; },
    nodeR: nodeR
  };
})(GEO, STORE, U);

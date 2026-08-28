/* ============================================================================
 * charts.js — dependency-free SVG chart primitives.
 * Every function returns an SVG string. Colours resolve from the active theme's
 * CSS tokens, so a score reads the same everywhere in the product.
 * ==========================================================================*/
var CH = (function (U) {
  'use strict';

  /* Colours resolve from CSS tokens so every chart follows the active theme. */
  function T(name, fb) { return U.cssvar(name, fb); }
  var INK  = function () { return T('--ink', '#15171c'); };
  var INK2 = function () { return T('--ink-2', '#4d525b'); };
  var INK3 = function () { return T('--ink-3', '#767c87'); };
  var INK4 = function () { return T('--ink-4', '#9aa0ab'); };
  var LINE = function () { return T('--hairline', '#e2e4e9'); };
  var LINE2= function () { return T('--hairline-2', '#d3d6dd'); };
  var ACC  = function () { return T('--accent', '#1c5fd4'); };
  var PANEL= function () { return T('--surface', '#ffffff'); };
  var CANVAS = function () { return T('--canvas', '#f4f5f7'); };
  function seriesColors() {
    return [T('--accent', '#1c5fd4'), T('--s1', '#3f9e8c'), T('--s3', '#e8b13c'), '#7c5cd6',
            T('--s4', '#df7a33'), '#c9559b', T('--s2', '#7fbf5a'), T('--neg', '#c0392f'),
            T('--s0', '#4a6fa5'), T('--ink-3', '#767c87')];
  }

  function esc(s) { return U.esc(s); }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ------------------------------------------------------------------ radar */
  function radar(axes, series, opts) {
    opts = opts || {};
    var size = opts.size || 300, cx = size / 2, cy = size / 2,
        R = size / 2 - (opts.pad || 46), n = axes.length;
    var out = ['<svg class="chart" viewBox="0 0 ' + size + ' ' + size + '" role="img">'];

    /* rings */
    [20, 40, 60, 80, 100].forEach(function (lv) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n, rr = R * lv / 100;
        pts.push(r2(cx + rr * Math.cos(a)) + ',' + r2(cy + rr * Math.sin(a)));
      }
      out.push('<polygon points="' + pts.join(' ') + '" fill="none" stroke="' + (lv === 100 ? LINE2() : LINE()) + '" stroke-width="1"/>');
    });

    /* spokes + labels */
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      out.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + r2(cx + R * Math.cos(a)) + '" y2="' + r2(cy + R * Math.sin(a)) + '" stroke="' + LINE() + '"/>');
      var lx = cx + (R + 16) * Math.cos(a), ly = cy + (R + 16) * Math.sin(a);
      var anchor = Math.abs(Math.cos(a)) < 0.25 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
      out.push('<text x="' + r2(lx) + '" y="' + r2(ly + 3) + '" text-anchor="' + anchor +
        '" fill="' + INK3() + '" font-family="var(--mono)" font-size="9">' + esc(axes[i].short || axes[i].label) + '</text>');
    }

    /* series */
    series.forEach(function (s, si) {
      var col = s.color || seriesColors()[si % 10], pts = [];
      for (var j = 0; j < n; j++) {
        var aa = -Math.PI / 2 + j * 2 * Math.PI / n;
        var v = U.clamp(s.values[j] == null ? 0 : s.values[j], 0, 100), rr = R * v / 100;
        pts.push(r2(cx + rr * Math.cos(aa)) + ',' + r2(cy + rr * Math.sin(aa)));
      }
      out.push('<polygon points="' + pts.join(' ') + '" fill="' + col + '" fill-opacity="' + (series.length > 1 ? 0.11 : 0.18) +
        '" stroke="' + col + '" stroke-width="1.8" stroke-linejoin="round"/>');
      pts.forEach(function (p) {
        var xy = p.split(',');
        out.push('<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="2.4" fill="' + col + '"/>');
      });
    });

    out.push('</svg>');
    return out.join('');
  }

  /* ------------------------------------------------------------- h-bars */
  function hbars(items, opts) {
    opts = opts || {};
    var w = opts.width || 420, rowH = opts.rowH || 22, labelW = opts.labelW || 168,
        valW = opts.valW || 46, h = items.length * rowH + 6;
    var max = opts.max || 100;
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img">'];
    items.forEach(function (it, i) {
      var y = i * rowH + 4, bw = w - labelW - valW - 8;
      var v = it.v == null ? 0 : it.v;
      var col = it.color || U.scoreColor(v / max * 100);
      out.push('<text x="0" y="' + (y + 11) + '" fill="' + INK2() + '" font-size="10.5" font-family="var(--sans)">' + esc(it.label) + '</text>');
      if (it.w != null) {
        out.push('<text x="' + (labelW - 6) + '" y="' + (y + 11) + '" text-anchor="end" fill="' + INK4() +
          '" font-size="9" font-family="var(--mono)">' + it.w + '%</text>');
      }
      out.push('<rect x="' + labelW + '" y="' + (y + 3.5) + '" width="' + bw + '" height="7" rx="3.5" fill="' + LINE() + '"/>');
      out.push('<rect x="' + labelW + '" y="' + (y + 3.5) + '" width="' + r2(Math.max(0, Math.min(1, v / max)) * bw) + '" height="7" rx="3.5" fill="' + col + '"/>');
      out.push('<text x="' + w + '" y="' + (y + 11) + '" text-anchor="end" fill="' + INK() + '" font-size="10.5" font-family="var(--mono)">' +
        (it.display != null ? esc(it.display) : U.n1(v)) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* ------------------------------------------------------------- scatter */
  /* points: {x,y,r,label,color,id,sel} in data units. opts: xDomain,yDomain,
     xLabel,yLabel,quadrants:[{x,y,label,color}] */
  function scatter(points, opts) {
    opts = opts || {};
    var w = opts.width || 900, h = opts.height || 560,
        m = opts.margin || { t: 26, r: 26, b: 46, l: 56 };
    var xd = opts.xDomain || [0, 100], yd = opts.yDomain || [0, 100];
    var iw = w - m.l - m.r, ih = h - m.t - m.b;
    function sx(v) { return m.l + (v - xd[0]) / (xd[1] - xd[0]) * iw; }
    function sy(v) { return m.t + ih - (v - yd[0]) / (yd[1] - yd[0]) * ih; }

    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img">'];

    /* quadrant shading + labels */
    if (opts.quadrants) {
      var mx = opts.midX != null ? opts.midX : (xd[0] + xd[1]) / 2;
      var my = opts.midY != null ? opts.midY : (yd[0] + yd[1]) / 2;
      opts.quadrants.forEach(function (q) {
        var x0 = q.x === 'hi' ? sx(mx) : m.l, x1 = q.x === 'hi' ? m.l + iw : sx(mx);
        var y0 = q.y === 'hi' ? m.t : sy(my), y1 = q.y === 'hi' ? sy(my) : m.t + ih;
        out.push('<rect class="quad-fill" x="' + r2(x0) + '" y="' + r2(y0) + '" width="' + r2(x1 - x0) + '" height="' + r2(y1 - y0) + '" fill="' + q.color + '"/>');
        var tx = q.x === 'hi' ? x1 - 10 : x0 + 10, ta = q.x === 'hi' ? 'end' : 'start';
        var ty = q.y === 'hi' ? y0 + 16 : y1 - 8;
        out.push('<text class="quad-label" x="' + r2(tx) + '" y="' + r2(ty) + '" text-anchor="' + ta + '" fill="' + q.color + '" opacity=".72">' + esc(q.label) + '</text>');
      });
      out.push('<line x1="' + r2(sx(mx)) + '" y1="' + m.t + '" x2="' + r2(sx(mx)) + '" y2="' + (m.t + ih) + '" stroke="' + LINE2() + '" stroke-dasharray="3 3"/>');
      out.push('<line x1="' + m.l + '" y1="' + r2(sy(my)) + '" x2="' + (m.l + iw) + '" y2="' + r2(sy(my)) + '" stroke="' + LINE2() + '" stroke-dasharray="3 3"/>');
    }

    /* axes */
    var ticks = opts.ticks || 5, i;
    for (i = 0; i <= ticks; i++) {
      var xv = xd[0] + (xd[1] - xd[0]) * i / ticks, yv = yd[0] + (yd[1] - yd[0]) * i / ticks;
      out.push('<line class="gridline" x1="' + m.l + '" y1="' + r2(sy(yv)) + '" x2="' + (m.l + iw) + '" y2="' + r2(sy(yv)) + '"/>');
      out.push('<text x="' + (m.l - 8) + '" y="' + r2(sy(yv) + 3) + '" text-anchor="end" fill="' + INK4() + '" font-size="9" font-family="var(--mono)">' + (opts.fmtY ? opts.fmtY(yv) : Math.round(yv)) + '</text>');
      out.push('<text x="' + r2(sx(xv)) + '" y="' + (m.t + ih + 16) + '" text-anchor="middle" fill="' + INK4() + '" font-size="9" font-family="var(--mono)">' + (opts.fmtX ? opts.fmtX(xv) : Math.round(xv)) + '</text>');
    }
    out.push('<line x1="' + m.l + '" y1="' + (m.t + ih) + '" x2="' + (m.l + iw) + '" y2="' + (m.t + ih) + '" stroke="' + LINE2() + '"/>');
    out.push('<line x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (m.t + ih) + '" stroke="' + LINE2() + '"/>');
    out.push('<text x="' + (m.l + iw / 2) + '" y="' + (h - 8) + '" text-anchor="middle" class="chart-title" fill="' + INK3() + '" font-family="var(--mono)" font-size="10">' + esc(opts.xLabel || '') + '</text>');
    out.push('<text transform="translate(13,' + (m.t + ih / 2) + ') rotate(-90)" text-anchor="middle" class="chart-title" fill="' + INK3() + '" font-family="var(--mono)" font-size="10">' + esc(opts.yLabel || '') + '</text>');

    /* Label placement: a greedy placer that tries four anchors around each
       point and drops a label rather than let two overlap. Bigger and selected
       markets get first claim on the space. */
    var placed = [], labels = [];
    /* Every node is an obstacle: a label may never sit on top of a point. */
    points.forEach(function (p) {
      var cx = sx(p.x), cy = sy(p.y), rr = (p.r || 5) + 1.5;
      placed.push({ x0: cx - rr, x1: cx + rr, y0: cy - rr, y1: cy + rr });
    });
    function hits(b) {
      for (var j = 0; j < placed.length; j++) {
        var o = placed[j];
        if (b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0) return true;
      }
      return false;
    }
    points.slice().sort(function (a, b) {
      return (b.sel ? 1 : 0) - (a.sel ? 1 : 0) || (b.r || 5) - (a.r || 5);
    }).forEach(function (p) {
      if (!p.showLabel) return;
      var cx = sx(p.x), cy = sy(p.y), rr = p.r || 5;
      var tw = esc(p.label).length * 5.45, th = 11;
      var cands = [
        { x: cx, y: cy - rr - 6, a: 'middle', x0: cx - tw / 2, x1: cx + tw / 2 },
        { x: cx, y: cy + rr + 12, a: 'middle', x0: cx - tw / 2, x1: cx + tw / 2 },
        { x: cx + rr + 5, y: cy + 3.5, a: 'start', x0: cx + rr + 5, x1: cx + rr + 5 + tw },
        { x: cx - rr - 5, y: cy + 3.5, a: 'end', x0: cx - rr - 5 - tw, x1: cx - rr - 5 }
      ];
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i];
        var box = { x0: c.x0 - 1.5, x1: c.x1 + 1.5, y0: c.y - th + 1, y1: c.y + 3 };
        if (box.x0 < m.l || box.x1 > m.l + iw || box.y0 < m.t || box.y1 > m.t + ih) continue;
        if (hits(box)) continue;
        placed.push(box);
        labels.push({ id: p.id, x: c.x, y: c.y, a: c.a });
        return;
      }
    });
    var labelBy = {};
    labels.forEach(function (l) { labelBy[l.id] = l; });

    /* points */
    points.forEach(function (p) {
      var cx = sx(p.x), cy = sy(p.y), rr = p.r || 5;
      out.push('<g class="pt" data-id="' + esc(p.id) + '" style="cursor:pointer">');
      if (p.sel) out.push('<circle cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="' + (rr + 5) + '" fill="none" stroke="' + INK() + '" stroke-width="1.2" opacity=".55"/>');
      out.push('<circle cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="' + (rr + 4) + '" fill="' + p.color + '" opacity=".14"/>');
      out.push('<circle cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="' + rr + '" fill="' + p.color + '" stroke="' + PANEL() + '" stroke-width=".7"><title>' + esc(p.label) + '</title></circle>');
      var lb = labelBy[p.id];
      if (lb) {
        out.push('<text x="' + r2(lb.x) + '" y="' + r2(lb.y) + '" text-anchor="' + lb.a + '" class="ptlbl" font-size="9" fill="' + INK2() +
          '" paint-order="stroke" stroke="' + CANVAS() + '" stroke-width="3.5" stroke-linejoin="round">' + esc(p.label) + '</text>');
      }
      out.push('</g>');
    });

    out.push('</svg>');
    return out.join('');
  }

  /* ---------------------------------------------------------------- lines */
  /* series: [{name,color,points:[{x,y,kind}]}] */
  function lines(series, opts) {
    opts = opts || {};
    var w = opts.width || 800, h = opts.height || 260,
        m = opts.margin || { t: 16, r: 18, b: 30, l: 40 };
    var iw = w - m.l - m.r, ih = h - m.t - m.b;
    var allX = [], allY = [];
    series.forEach(function (s) { s.points.forEach(function (p) { allX.push(p.x); allY.push(p.y); }); });
    var xd = opts.xDomain || [Math.min.apply(null, allX), Math.max.apply(null, allX)];
    var yd = opts.yDomain || [Math.min.apply(null, allY), Math.max.apply(null, allY)];
    if (yd[0] === yd[1]) yd = [yd[0] - 1, yd[1] + 1];
    function sx(v) { return m.l + (v - xd[0]) / (xd[1] - xd[0] || 1) * iw; }
    function sy(v) { return m.t + ih - (v - yd[0]) / (yd[1] - yd[0] || 1) * ih; }

    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img">'], i;
    for (i = 0; i <= 4; i++) {
      var yv = yd[0] + (yd[1] - yd[0]) * i / 4;
      out.push('<line class="gridline" x1="' + m.l + '" y1="' + r2(sy(yv)) + '" x2="' + (m.l + iw) + '" y2="' + r2(sy(yv)) + '"/>');
      out.push('<text x="' + (m.l - 6) + '" y="' + r2(sy(yv) + 3) + '" text-anchor="end" fill="' + INK4() + '" font-size="9" font-family="var(--mono)">' + (opts.fmtY ? opts.fmtY(yv) : Math.round(yv)) + '</text>');
    }
    if (opts.xTicks) {
      opts.xTicks.forEach(function (t) {
        out.push('<text x="' + r2(sx(t)) + '" y="' + (m.t + ih + 15) + '" text-anchor="middle" fill="' + INK4() + '" font-size="9" font-family="var(--mono)">' + t + '</text>');
      });
    }
    if (opts.markX != null) {
      out.push('<line x1="' + r2(sx(opts.markX)) + '" y1="' + m.t + '" x2="' + r2(sx(opts.markX)) + '" y2="' + (m.t + ih) +
        '" stroke="' + ACC() + '" stroke-width="1" stroke-dasharray="3 3" opacity=".65"/>');
      out.push('<text x="' + r2(sx(opts.markX) + 4) + '" y="' + (m.t + 10) + '" fill="' + ACC() + '" font-size="8.5" font-family="var(--mono)" opacity=".85">' + esc(opts.markLabel || 'NOW') + '</text>');
    }

    series.forEach(function (s, si) {
      var col = s.color || seriesColors()[si % 10];
      /* split into observed/reconstructed vs projected for dash styling */
      var solid = [], dashed = [];
      s.points.forEach(function (p, idx) {
        var xy = [r2(sx(p.x)), r2(sy(p.y))];
        if (p.kind === 'projected') {
          if (!dashed.length && idx > 0) { var pv = s.points[idx - 1]; dashed.push([r2(sx(pv.x)), r2(sy(pv.y))]); }
          dashed.push(xy);
        } else solid.push(xy);
      });
      function path(pts) { return pts.map(function (p, k) { return (k ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(''); }
      if (solid.length > 1) out.push('<path d="' + path(solid) + '" fill="none" stroke="' + col + '" stroke-width="2" stroke-linejoin="round"/>');
      if (dashed.length > 1) out.push('<path d="' + path(dashed) + '" fill="none" stroke="' + col + '" stroke-width="2" stroke-dasharray="4 3" opacity=".75"/>');
      s.points.forEach(function (p) {
        out.push('<circle cx="' + r2(sx(p.x)) + '" cy="' + r2(sy(p.y)) + '" r="' + (p.kind === 'observed' ? 3.6 : 2.4) + '" fill="' +
          (p.kind === 'observed' ? col : PANEL()) + '" stroke="' + col + '" stroke-width="1.4"><title>' + p.x + ': ' + U.n1(p.y) + '</title></circle>');
      });
    });
    out.push('</svg>');
    return out.join('');
  }

  /* ------------------------------------------------------------ sparkline */
  function spark(values, opts) {
    opts = opts || {};
    var w = opts.width || 74, h = opts.height || 18, col = opts.color || ACC();
    if (!values || values.length < 2) return '<svg width="' + w + '" height="' + h + '"></svg>';
    var mn = Math.min.apply(null, values), mx = Math.max.apply(null, values), rg = (mx - mn) || 1;
    var d = values.map(function (v, i) {
      return (i ? 'L' : 'M') + r2(i / (values.length - 1) * (w - 2) + 1) + ' ' + r2(h - 2 - (v - mn) / rg * (h - 4));
    }).join('');
    return '<svg width="' + w + '" height="' + h + '" style="vertical-align:middle">' +
      '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.4"/></svg>';
  }

  /* --------------------------------------------------------------- gauge */
  function gauge(v, opts) {
    opts = opts || {};
    var size = opts.size || 120, cx = size / 2, cy = size / 2, R = size / 2 - 9;
    var col = opts.color || U.scoreColor(v);
    var a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    function arc(from, to, r, sw, colr, op) {
      var x0 = cx + r * Math.cos(from), y0 = cy + r * Math.sin(from);
      var x1 = cx + r * Math.cos(to), y1 = cy + r * Math.sin(to);
      var large = (to - from) > Math.PI ? 1 : 0;
      return '<path d="M' + r2(x0) + ' ' + r2(y0) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + r2(x1) + ' ' + r2(y1) +
        '" fill="none" stroke="' + colr + '" stroke-width="' + sw + '" stroke-linecap="round"' + (op ? ' opacity="' + op + '"' : '') + '/>';
    }
    var frac = U.clamp(v, 0, 100) / 100;
    /* The label sits BELOW the dial, not inside it: at the 0.75pi/2.25pi
     * opening the arc ends cut straight through the middle of the glyphs. */
    var vh = size + (opts.label ? 13 : 0);
    return '<svg class="chart" viewBox="0 0 ' + size + ' ' + vh + '" style="width:' + size + 'px;height:' + vh + 'px">' +
      arc(a0, a1, R, 7, LINE()) +
      (frac > 0.001 ? arc(a0, a0 + (a1 - a0) * frac, R, 7, col) : '') +
      '<text x="' + cx + '" y="' + (cy + 6) + '" text-anchor="middle" fill="' + col +
      '" font-family="var(--mono)" font-size="' + (size / 4.0) + '" font-weight="700">' + (v == null ? '—' : Math.round(v)) + '</text>' +
      (opts.label ? '<text x="' + cx + '" y="' + (size + 8) + '" text-anchor="middle" fill="' + INK4() +
        '" font-family="var(--mono)" font-size="8.5" letter-spacing="1.1">' + esc(opts.label) + '</text>' : '') +
      '</svg>';
  }

  /* ------------------------------------------------------------- heatmap */
  /* rows: [{label, cells:[{v, display}]}], cols: [labels] */
  function heat(cols, rows, opts) {
    opts = opts || {};
    var cw = opts.cellW || 76, ch = opts.cellH || 26, lw = opts.labelW || 190;
    var w = lw + cols.length * cw, h = 30 + rows.length * ch;
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" style="min-width:' + w + 'px">'];
    cols.forEach(function (c, i) {
      out.push('<text x="' + (lw + i * cw + cw / 2) + '" y="18" text-anchor="middle" fill="' + INK3() +
        '" font-size="9.5" font-family="var(--mono)">' + esc(c) + '</text>');
    });
    rows.forEach(function (r, ri) {
      var y = 30 + ri * ch;
      out.push('<text x="0" y="' + (y + ch / 2 + 3.5) + '" fill="' + INK2() + '" font-size="10.5">' + esc(r.label) + '</text>');
      r.cells.forEach(function (cell, ci) {
        var x = lw + ci * cw, col = cell.v == null ? T('--surface-3', '#eef0f3') : U.scoreColor(cell.v);
        out.push('<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="' + (cw - 2) + '" height="' + (ch - 2) +
          '" rx="2" fill="' + col + '" fill-opacity="' + (cell.v == null ? .5 : .2) + '" stroke="' + col + '" stroke-opacity="' + (cell.v == null ? .3 : .55) + '"/>');
        out.push('<text x="' + (x + cw / 2) + '" y="' + (y + ch / 2 + 3.5) + '" text-anchor="middle" fill="' + (cell.v == null ? INK4() : col) +
          '" font-size="10.5" font-family="var(--mono)" font-weight="600">' + esc(cell.display != null ? cell.display : U.n1(cell.v)) + '</text>');
      });
    });
    out.push('</svg>');
    return out.join('');
  }

  /* ------------------------------------------------------------ waterfall */
  /* Contribution of each weighted category to the headline score. */
  function waterfall(items, opts) {
    opts = opts || {};
    var w = opts.width || 700, rowH = 20, h = items.length * rowH + 34;
    var total = U.sum(items, function (i) { return i.v; });
    var max = Math.max.apply(null, items.map(function (i) { return i.v; }));
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '">'];
    var acc = 0, labelW = 200, barArea = w - labelW - 92;
    items.forEach(function (it, i) {
      var y = i * rowH + 4;
      var x0 = labelW + acc / total * barArea, bw = it.v / total * barArea;
      out.push('<text x="0" y="' + (y + 12) + '" fill="' + INK2() + '" font-size="10.5">' + esc(it.label) + '</text>');
      out.push('<rect x="' + r2(x0) + '" y="' + (y + 3) + '" width="' + r2(Math.max(bw, 1)) + '" height="13" rx="2" fill="' + (it.color || U.scoreColor(it.score)) + '" fill-opacity=".85"/>');
      out.push('<text x="' + w + '" y="' + (y + 13) + '" text-anchor="end" fill="' + INK() + '" font-size="10.5" font-family="var(--mono)">+' + U.n1(it.v) + '</text>');
      out.push('<text x="' + (w - 46) + '" y="' + (y + 13) + '" text-anchor="end" fill="' + INK4() + '" font-size="9" font-family="var(--mono)">' + it.w + '%</text>');
      acc += it.v;
    });
    var yT = items.length * rowH + 8;
    out.push('<line x1="' + labelW + '" y1="' + yT + '" x2="' + w + '" y2="' + yT + '" stroke="' + LINE2() + '"/>');
    out.push('<text x="0" y="' + (yT + 15) + '" fill="' + INK() + '" font-size="11" font-weight="600">LCDOS</text>');
    out.push('<text x="' + w + '" y="' + (yT + 15) + '" text-anchor="end" fill="' + ACC() + '" font-size="12.5" font-family="var(--mono)" font-weight="700">' + U.n1(total) + '</text>');
    out.push('</svg>');
    return out.join('');
  }

  /* ---------------------------------------------------------- vertical bars */
  function vbars(items, opts) {
    opts = opts || {};
    var w = opts.width || 460, h = opts.height || 170, m = { t: 12, r: 8, b: 34, l: 34 };
    var iw = w - m.l - m.r, ih = h - m.t - m.b;
    var max = opts.max != null ? opts.max : Math.max.apply(null, items.map(function (i) { return Math.abs(i.v); })) * 1.1 || 1;
    var min = opts.min != null ? opts.min : Math.min(0, Math.min.apply(null, items.map(function (i) { return i.v; })));
    var bw = iw / items.length;
    function sy(v) { return m.t + ih - (v - min) / (max - min || 1) * ih; }
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '">'];
    [0, .25, .5, .75, 1].forEach(function (f) {
      var yv = min + (max - min) * f;
      out.push('<line class="gridline" x1="' + m.l + '" y1="' + r2(sy(yv)) + '" x2="' + (m.l + iw) + '" y2="' + r2(sy(yv)) + '"/>');
      out.push('<text x="' + (m.l - 5) + '" y="' + r2(sy(yv) + 3) + '" text-anchor="end" fill="' + INK4() + '" font-size="8.5" font-family="var(--mono)">' + (opts.fmtY ? opts.fmtY(yv) : Math.round(yv)) + '</text>');
    });
    items.forEach(function (it, i) {
      var x = m.l + i * bw + bw * 0.18, bwid = bw * 0.64;
      var y0 = sy(Math.max(0, it.v)), y1 = sy(Math.min(0, it.v));
      out.push('<rect x="' + r2(x) + '" y="' + r2(y0) + '" width="' + r2(bwid) + '" height="' + r2(Math.max(1, y1 - y0)) + '" rx="2" fill="' +
        (it.color || U.scoreColor(it.v)) + '" fill-opacity=".85"><title>' + esc(it.label + ': ' + U.n1(it.v)) + '</title></rect>');
      out.push('<text x="' + r2(x + bwid / 2) + '" y="' + (m.t + ih + 13) + '" text-anchor="middle" fill="' + INK4() +
        '" font-size="8.5" font-family="var(--mono)">' + esc(it.short || it.label) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  return { radar: radar, hbars: hbars, scatter: scatter, lines: lines, spark: spark, gauge: gauge,
    heat: heat, waterfall: waterfall, vbars: vbars,
    get SERIES() { return seriesColors(); } };
})(typeof U !== 'undefined' ? U : require('./util.js'));
if (typeof module === 'object' && module.exports) module.exports = CH;

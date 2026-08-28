/* ============================================================================
 * albers.js — d3-compatible Albers USA composite projection (dependency-free)
 * ----------------------------------------------------------------------------
 * Ports d3-geo's geoAlbersUsa() so that (a) the build script can pre-project
 * TopoJSON boundaries into SVG paths and (b) the browser can project market
 * lat/lon into the exact same pixel space at runtime. One implementation,
 * used by both, guarantees nodes land on the right piece of coastline.
 *
 * Reference frame: scale 1300, translate [487.5, 305] => viewBox 0 0 975 610
 * (the canonical us-atlas rendering box).
 * ==========================================================================*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Albers = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var RAD = Math.PI / 180, PI = Math.PI, TAU = 2 * PI;

  /* Conic equal-area raw projection (d3-geo conicEqualAreaRaw). */
  function conicEqualAreaRaw(y0, y1) {
    var sy0 = Math.sin(y0), n = (sy0 + Math.sin(y1)) / 2;
    if (Math.abs(n) < 1e-6) {
      var cy0 = Math.cos(y0);
      return function (x, y) { return [x * cy0, Math.sin(y) / cy0]; };
    }
    var c = 1 + sy0 * (2 * n - sy0), r0 = Math.sqrt(c) / n;
    return function (x, y) {
      var r = Math.sqrt(c - 2 * n * Math.sin(y)) / n, a = x * n;
      return [r * Math.sin(a), r0 - r * Math.cos(a)];
    };
  }

  /* A single conic equal-area projection with rotation, center, scale, translate.
   *
   * NOTE on `center`: d3 feeds the center through the RAW projection only, not
   * through the pre-rotation. So d3's geoAlbers center of [-0.6, 38.7] with
   * rotate([96, 0]) denotes true longitude -96.6, not -0.6. Getting this wrong
   * throws the whole continent off the canvas.
   */
  function conic(parallels, rotateDeg, centerDeg, k, translate) {
    var raw = conicEqualAreaRaw(parallels[0] * RAD, parallels[1] * RAD),
        dl = rotateDeg[0] * RAD;

    function rotated(lon, lat) {
      var l = lon * RAD + dl;
      if (l > PI) l -= TAU; else if (l < -PI) l += TAU;
      return raw(l, lat * RAD);
    }

    var pc = raw(centerDeg[0] * RAD, centerDeg[1] * RAD),
        dx = translate[0] - k * pc[0],
        dy = translate[1] + k * pc[1];

    return function (lon, lat) {
      var p = rotated(lon, lat);
      return [dx + k * p[0], dy - k * p[1]];
    };
  }

  /* Composite Albers USA. Returns { point, lower48, alaska, hawaii, box }. */
  function albersUsa(k, translate) {
    k = k == null ? 1300 : k;
    translate = translate || [487.5, 305];
    var tx = translate[0], ty = translate[1];

    var lower48 = conic([29.5, 45.5], [96, 0], [-0.6, 38.7], k, [tx, ty]),
        alaska  = conic([55, 65],    [154, 0], [-2, 58.5],   k * 0.35,
                        [tx - 0.307 * k, ty + 0.201 * k]),
        hawaii  = conic([8, 18],     [157, 0], [-3, 19.9],   k,
                        [tx - 0.205 * k, ty + 0.212 * k]);

    /* Clip extents, exactly as d3 lays out the composite inset boxes. */
    var boxes = {
      lower48: [tx - 0.455 * k, ty - 0.238 * k, tx + 0.455 * k, ty + 0.238 * k],
      alaska:  [tx - 0.425 * k, ty + 0.120 * k, tx - 0.214 * k, ty + 0.234 * k],
      hawaii:  [tx - 0.214 * k, ty + 0.166 * k, tx - 0.115 * k, ty + 0.234 * k]
    };
    function inBox(p, b) {
      return p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3];
    }

    /* Pick the sub-projection by FIPS state code (02 = AK, 15 = HI). */
    function forState(fips) {
      if (fips === '02') return alaska;
      if (fips === '15') return hawaii;
      return lower48;
    }

    /* Runtime entry point: lon/lat -> [x, y] or null if outside every inset.
     * Mirrors d3's dispatch order: lower 48 first, then the AK and HI insets. */
    function point(lon, lat) {
      var p = lower48(lon, lat);
      if (inBox(p, boxes.lower48)) return p;
      p = alaska(lon, lat);
      if (inBox(p, boxes.alaska)) return p;
      p = hawaii(lon, lat);
      if (inBox(p, boxes.hawaii)) return p;
      return null;
    }

    return {
      point: point, forState: forState,
      lower48: lower48, alaska: alaska, hawaii: hawaii,
      boxes: boxes, inBox: inBox,
      scale: k, translate: translate,
      box: { w: 975, h: 610 }
    };
  }

  return { albersUsa: albersUsa, conic: conic, RAD: RAD };
}));

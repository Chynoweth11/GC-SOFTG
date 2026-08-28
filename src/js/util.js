/* ============================================================================
 * util.js — formatting, colour ramps, DOM helpers.
 * ==========================================================================*/
var U = (function () {
  'use strict';

  /* ------------------------------------------------------------ formatting */
  function n0(v) { return v == null || isNaN(v) ? '—' : Math.round(v).toLocaleString(); }
  function n1(v) { return v == null || isNaN(v) ? '—' : (Math.round(v * 10) / 10).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function n2(v) { return v == null || isNaN(v) ? '—' : (Math.round(v * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pct(v, d) { return v == null || isNaN(v) ? '—' : (v >= 0 ? '' : '') + (Math.round(v * Math.pow(10, d || 1)) / Math.pow(10, d || 1)) + '%'; }
  function pctS(v, d) { return v == null || isNaN(v) ? '—' : (v > 0 ? '+' : '') + (Math.round(v * Math.pow(10, d || 1)) / Math.pow(10, d || 1)) + '%'; }

  function usd(v) {
    if (v == null || isNaN(v)) return '—';
    var a = Math.abs(v);
    if (a >= 1e12) return '$' + (v / 1e12).toFixed(2) + 'T';
    if (a >= 1e9) return '$' + (v / 1e9).toFixed(a >= 1e10 ? 1 : 2) + 'B';
    if (a >= 1e6) return '$' + (v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
    if (a >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'k';
    return '$' + Math.round(v);
  }
  function usdM(m) { return usd((m || 0) * 1e6); }
  function usdFull(v) { return v == null || isNaN(v) ? '—' : '$' + Math.round(v).toLocaleString(); }

  function compact(v) {
    if (v == null || isNaN(v)) return '—';
    var a = Math.abs(v);
    if (a >= 1e9) return (v / 1e9).toFixed(1) + 'B';
    if (a >= 1e6) return (v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
    if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + 'k';
    return String(Math.round(v));
  }

  /* -------------------------------------------------------------- colours */
  var RAMP = ['#2d4257', '#2e7f96', '#2fae91', '#7cc95a', '#f0b83f', '#ff7a45'];
  var STOPS = [0, 38, 52, 66, 78, 90];

  function hex2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function rgb2hex(c) {
    return '#' + c.map(function (x) { var s = Math.round(Math.max(0, Math.min(255, x))).toString(16); return s.length < 2 ? '0' + s : s; }).join('');
  }

  /** Continuous 0-100 -> ramp colour. */
  function scoreColor(v) {
    if (v == null || isNaN(v)) return '#394453';
    v = Math.max(0, Math.min(100, v));
    for (var i = STOPS.length - 1; i >= 0; i--) {
      if (v >= STOPS[i]) {
        if (i === STOPS.length - 1) return RAMP[i];
        var t = (v - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
        var a = hex2rgb(RAMP[i]), b = hex2rgb(RAMP[i + 1]);
        return rgb2hex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
      }
    }
    return RAMP[0];
  }

  /** Colour with a low-alpha fill, for score chips. */
  function scoreChip(v, cls) {
    var c = scoreColor(v);
    return '<span class="score ' + (cls || '') + '" style="color:' + c + ';border-color:' + c + '44;background:' + c + '14">' +
      (v == null || isNaN(v) ? '—' : Math.round(v * 10) / 10) + '</span>';
  }

  function bar(v, color) {
    var c = color || scoreColor(v);
    return '<span class="bar" style="display:block"><i style="width:' + Math.max(0, Math.min(100, v || 0)) + '%;background:' + c + '"></i></span>';
  }

  function deltaHtml(v, suffix, invert) {
    if (v == null || isNaN(v)) return '<span class="delta dim">—</span>';
    var good = invert ? v < 0 : v > 0;
    var cls = Math.abs(v) < 0.05 ? 'dim' : good ? 'up' : 'down';
    return '<span class="delta ' + cls + '">' + (v > 0 ? '▲' : v < 0 ? '▼' : '') + ' ' + Math.abs(Math.round(v * 10) / 10) + (suffix || '') + '</span>';
  }

  /* Confidence banding — a hard rule about what a score may be used for. */
  var CONF_BANDS = [
    { min: 75, label: 'Underwriting-grade', desc: 'Sufficient to support a specific transaction decision.', color: '#3fd9ad' },
    { min: 55, label: 'Analysis-grade', desc: 'Sufficient to build an investment case; verify key inputs before committing.', color: '#7cc95a' },
    { min: 35, label: 'Screening-grade', desc: 'Sufficient to rank and shortlist markets. Not sufficient to underwrite.', color: '#f0b83f' },
    { min: 0, label: 'Indicative', desc: 'Directional only. Treat every figure as a hypothesis to be tested.', color: '#ff7a45' }
  ];
  function confBand(v) {
    for (var i = 0; i < CONF_BANDS.length; i++) if (v >= CONF_BANDS[i].min) return CONF_BANDS[i];
    return CONF_BANDS[CONF_BANDS.length - 1];
  }

  /* ---------------------------------------------------------------- DOM */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Event delegation: on(root, 'click', '[data-x]', handler). */
  function on(root, type, sel, fn) {
    root.addEventListener(type, function (e) {
      var t = e.target.closest ? e.target.closest(sel) : null;
      if (t && root.contains(t)) fn(e, t);
    });
  }

  function debounce(fn, ms) {
    var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
  }

  /* ------------------------------------------------------------- helpers */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function sum(arr, f) { var s = 0; for (var i = 0; i < arr.length; i++) s += f ? f(arr[i]) : arr[i]; return s; }
  function mean(arr, f) { return arr.length ? sum(arr, f) / arr.length : 0; }
  function quantile(sorted, q) {
    if (!sorted.length) return 0;
    var p = (sorted.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (p - lo);
  }
  function pctRank(sortedAsc, v) {
    var lo = 0, hi = sortedAsc.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (sortedAsc[m] < v) lo = m + 1; else hi = m; }
    return sortedAsc.length ? lo / (sortedAsc.length - 1 || 1) * 100 : 0;
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return {
    n0: n0, n1: n1, n2: n2, pct: pct, pctS: pctS, usd: usd, usdM: usdM, usdFull: usdFull, compact: compact,
    scoreColor: scoreColor, scoreChip: scoreChip, bar: bar, deltaHtml: deltaHtml,
    RAMP: RAMP, CONF_BANDS: CONF_BANDS, confBand: confBand,
    esc: esc, $: $, $$: $$, on: on, debounce: debounce,
    clamp: clamp, sum: sum, mean: mean, quantile: quantile, pctRank: pctRank, ordinal: ordinal
  };
})();
if (typeof module === 'object' && module.exports) module.exports = U;

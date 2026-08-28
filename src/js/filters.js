/* ============================================================================
 * filters.js — the shared filter engine.
 *
 * Every dimension the product displays is filterable, every group can be
 * selected, cleared or reset independently, and the whole set resets at once.
 * One engine drives the map, the league table, the analysis plots and the
 * comparison picker, so a filter set carries across the whole application.
 * ==========================================================================*/
var FILTERS = (function (U) {
  'use strict';

  /* ---- definitions -----------------------------------------------------
   * kind 'set'   multi-select over discrete values
   * kind 'range' numeric min/max
   * kind 'flag'  boolean switch
   * ------------------------------------------------------------------- */
  var GROUPS = [
    {
      id: 'geography', label: 'Geography', open: true, items: [
        { id: 'regions',    kind: 'set', label: 'Region',      of: function (r) { return r.m.region; } },
        { id: 'states',     kind: 'set', label: 'State',       of: function (r) { return r.m.state; }, compact: true },
        { id: 'archetypes', kind: 'set', label: 'Market type', of: function (r) { return r.m.archetype; },
          name: function (v, D) { return D.ARCHETYPES[v] ? D.ARCHETYPES[v].label : v; } },
        { id: 'tiers',      kind: 'set', label: 'Maturity tier', of: function (r) { return r.m.tier; } }
      ]
    },
    {
      id: 'scores', label: 'Scores', open: true, items: [
        { id: 'lcdos',      kind: 'range', label: 'LCDOS overall',        min: 0, max: 100, of: function (r) { return r.lcdos; } },
        { id: 'gce',        kind: 'range', label: 'GC entry',             min: 0, max: 100, of: function (r) { return r.gce; } },
        { id: 'dev',        kind: 'range', label: 'Developer',            min: 0, max: 100, of: function (r) { return r.dev; } },
        { id: 'gap',        kind: 'range', label: 'Opportunity gap',      min: 0, max: 100, of: function (r) { return r.gap; } },
        { id: 'momentum',   kind: 'range', label: 'Momentum',             min: 0, max: 100, of: function (r) { return r.momentum; } },
        { id: 'cls',        kind: 'range', label: 'Current luxury',       min: 0, max: 100, of: function (r) { return r.cls; } },
        { id: 'f10',        kind: 'range', label: '10-year outlook',      min: 0, max: 100, of: function (r) { return r.f10; } },
        { id: 'f20',        kind: 'range', label: '20-year outlook',      min: 0, max: 100, of: function (r) { return r.f20; } },
        { id: 'risk',       kind: 'range', label: 'Long-run risk',        min: 0, max: 100, of: function (r) { return r.risk; } },
        { id: 'confidence', kind: 'range', label: 'Data confidence',      min: 0, max: 100, of: function (r) { return r.confidence; } }
      ]
    },
    {
      id: 'construction', label: 'Construction & competition', items: [
        { id: 'luxStarts',  kind: 'range', label: '$2M+ starts / yr',     min: 0, max: 1200, step: 10, of: function (r) { return r.e.derived.luxStarts; }, fmt: U.n0 },
        { id: 'luxGc',      kind: 'range', label: 'Established luxury GCs', min: 0, max: 200, step: 1, of: function (r) { return r.m.p.luxGcCount; }, fmt: U.n0 },
        { id: 'perGc',      kind: 'range', label: 'Starts per incumbent', min: 0, max: 30, step: 0.5, of: function (r) { return r.e.derived.startsPerIncumbent; }, fmt: U.n1 },
        { id: 'backlog',    kind: 'range', label: 'Backlog (months)',     min: 0, max: 16, step: 0.5, of: function (r) { return r.m.p.backlog; }, fmt: U.n1 },
        { id: 'trades',     kind: 'range', label: 'Trade availability',   min: 0, max: 100, of: function (r) { return r.m.p.tradeIdx; } },
        { id: 'costPsf',    kind: 'range', label: 'Build cost $/sf',      min: 250, max: 1500, step: 10, of: function (r) { return r.m.p.costPsf; }, fmt: function (v) { return '$' + U.n0(v); } },
        { id: 'entryBar',   kind: 'range', label: 'Difficulty of entry',  min: 0, max: 100, of: function (r) { return r.m.p.entryBarIdx; } }
      ]
    },
    {
      id: 'land', label: 'Land & development', items: [
        { id: 'landIdx',    kind: 'range', label: 'Land availability',    min: 0, max: 100, of: function (r) { return r.m.p.landIdx; } },
        { id: 'specMargin', kind: 'range', label: 'Spec margin %',        min: -10, max: 30, step: 0.5, of: function (r) { return r.e.derived.specMarginPct; }, fmt: U.n1 },
        { id: 'entMonths',  kind: 'range', label: 'Entitlement (months)', min: 0, max: 48, step: 1, of: function (r) { return r.m.p.entMonths; }, fmt: U.n0 },
        { id: 'landShare',  kind: 'range', label: 'Land % of value',      min: 10, max: 60, step: 1, of: function (r) { return r.m.p.landShare; }, fmt: U.n0 },
        { id: 'water',      kind: 'range', label: 'Water headroom',       min: 0, max: 100, of: function (r) { return r.m.p.waterIdx; } },
        { id: 'shortage',   kind: 'range', label: 'Housing shortage',     min: 0, max: 100, of: function (r) { return r.m.p.shortageIdx; } }
      ]
    },
    {
      id: 'market', label: 'Market & wealth', items: [
        { id: 'pop',        kind: 'range', label: 'Population',           min: 0, max: 2800000, step: 5000, of: function (r) { return r.m.p.pop; }, fmt: U.compact },
        { id: 'medVal',     kind: 'range', label: 'Median home value',    min: 0, max: 3600000, step: 25000, of: function (r) { return r.m.p.medVal; }, fmt: U.usd },
        { id: 'luxPpsf',    kind: 'range', label: 'Luxury $/sf',          min: 300, max: 2800, step: 25, of: function (r) { return r.m.p.luxPpsf; }, fmt: function (v) { return '$' + U.n0(v); } },
        { id: 'tx5m',       kind: 'range', label: '$5M+ closings / yr',   min: 0, max: 1000, step: 5, of: function (r) { return r.m.p.tx5m; }, fmt: U.n0 },
        { id: 'hnwi',       kind: 'range', label: 'Millionaires / 1k HH', min: 0, max: 360, step: 5, of: function (r) { return r.m.p.hnwiPer1k; }, fmt: U.n0 },
        { id: 'popCagr',    kind: 'range', label: 'Population growth %',  min: -1, max: 5, step: 0.1, of: function (r) { return r.m.p.popCagr5; }, fmt: U.n1 },
        { id: 'incomeTax',  kind: 'range', label: 'State income tax %',   min: 0, max: 14, step: 0.25, of: function (r) { return r.m.p.incomeTax; }, fmt: U.n1 },
        { id: 'propTax',    kind: 'range', label: 'Property tax %',       min: 0, max: 2, step: 0.05, of: function (r) { return r.m.p.propTax; }, fmt: U.n2 }
      ]
    },
    {
      id: 'flags', label: 'Flags & signals', items: [
        { id: 'entryAlert', kind: 'flag', label: 'Entry opportunity alert only', of: function (r) { return !!r.e.entryAlert; } },
        { id: 'hasAnchors', kind: 'flag', label: 'Has externally verified figures', of: function (r) { return (r.m.anchors || []).length > 0; } },
        { id: 'hasProjects',kind: 'flag', label: 'Has named development projects', of: function (r, ST) { return ST.projects(r.id).length > 0; } },
        { id: 'hasProfile', kind: 'flag', label: 'Has a written deep dive', of: function (r) { return typeof LCDOS_PROFILES !== 'undefined' && !!LCDOS_PROFILES[r.id]; } },
        { id: 'signals',    kind: 'set',  label: 'Signal present', of: null, signal: true }
      ]
    }
  ];

  var ITEMS = {};
  GROUPS.forEach(function (g) { g.items.forEach(function (it) { it.group = g.id; ITEMS[it.id] = it; }); });

  /* ---- state ---------------------------------------------------------- */
  var state = {};      /* itemId -> {sel:Set-like obj} | {lo,hi} | true */
  var domains = {};    /* itemId -> for sets: sorted values; for ranges: [min,max] observed */
  var query = '';

  function init(rows, ST) {
    domains = {};
    GROUPS.forEach(function (g) {
      g.items.forEach(function (it) {
        if (it.kind === 'set') {
          if (it.signal) {
            var s = {};
            (ST.RULES || []).forEach(function (r) { s[r.id] = r.label; });
            domains[it.id] = Object.keys(s).map(function (k) { return { v: k, label: s[k] }; });
          } else {
            var seen = {};
            rows.forEach(function (r) { seen[it.of(r)] = 1; });
            domains[it.id] = Object.keys(seen).sort().map(function (v) { return { v: v, label: it.name ? it.name(v, ST.DATA) : v }; });
          }
        } else if (it.kind === 'range') {
          var lo = Infinity, hi = -Infinity;
          rows.forEach(function (r) { var v = it.of(r); if (v == null || !isFinite(v)) return; if (v < lo) lo = v; if (v > hi) hi = v; });
          if (!isFinite(lo)) { lo = it.min; hi = it.max; }
          /* snap outward to a round step so the handles sit at sensible stops */
          var st = it.step || 1;
          domains[it.id] = [Math.floor(lo / st) * st, Math.ceil(hi / st) * st];
        }
      });
    });
    ready = true;
    reset();
  }

  function reset() {
    state = {};
    query = '';
    GROUPS.forEach(function (g) {
      g.items.forEach(function (it) {
        if (it.kind === 'set') state[it.id] = {};                       /* empty = no constraint */
        else if (it.kind === 'range') state[it.id] = { lo: domains[it.id][0], hi: domains[it.id][1] };
        else state[it.id] = false;
      });
    });
  }

  var ready = false;

  function isDefault(it) {
    var s = state[it.id], d = domains[it.id];
    if (s == null) return true;                       /* not initialised yet */
    /* Nothing selected and everything selected constrain the universe
       identically, so both read as "no filter" in the count and the summary. */
    if (it.kind === 'set') {
      var k = Object.keys(s).length;
      return !k || k >= (d || []).length;
    }
    if (it.kind === 'range') return !d || (s.lo <= d[0] && s.hi >= d[1]);
    return !s;
  }

  function activeCount() {
    if (!ready) return 0;
    var n = 0;
    GROUPS.forEach(function (g) { g.items.forEach(function (it) { if (!isDefault(it)) n++; }); });
    if (query) n++;
    return n;
  }

  function resetGroup(gid) {
    var g = GROUPS.filter(function (x) { return x.id === gid; })[0];
    if (!g) return;
    g.items.forEach(function (it) {
      if (it.kind === 'set') state[it.id] = {};
      else if (it.kind === 'range') state[it.id] = { lo: domains[it.id][0], hi: domains[it.id][1] };
      else state[it.id] = false;
    });
  }

  function selectAll(itemId) {
    var it = ITEMS[itemId]; if (!it || it.kind !== 'set') return;
    var s = {}; (domains[itemId] || []).forEach(function (d) { s[d.v] = 1; });
    state[itemId] = s;
  }
  function clearItem(itemId) {
    var it = ITEMS[itemId]; if (!it) return;
    if (it.kind === 'set') state[itemId] = {};
    else if (it.kind === 'range') state[itemId] = { lo: domains[itemId][0], hi: domains[itemId][1] };
    else state[itemId] = false;
  }
  function toggleValue(itemId, v) {
    var s = state[itemId];
    if (s[v]) delete s[v]; else s[v] = 1;
  }
  function setRange(itemId, lo, hi) {
    var d = domains[itemId];
    state[itemId] = { lo: Math.max(d[0], Math.min(lo, hi)), hi: Math.min(d[1], Math.max(lo, hi)) };
  }
  function setFlag(itemId, v) { state[itemId] = !!v; }
  function setQuery(q) { query = q || ''; }
  function getQuery() { return query; }

  /* ---- matching ------------------------------------------------------- */
  function match(r, ST) {
    if (!ready) return true;
    if (query) {
      var q = query.toLowerCase();
      var hay = (r.m.name + ' ' + r.m.state + ' ' + r.m.county + ' ' + r.m.region + ' ' +
                 r.m.archetype + ' ' + r.m.tier).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    for (var i = 0; i < GROUPS.length; i++) {
      var items = GROUPS[i].items;
      for (var j = 0; j < items.length; j++) {
        var it = items[j], s = state[it.id];
        if (it.kind === 'set') {
          var keys = Object.keys(s);
          if (!keys.length) continue;
          if (it.signal) {
            var sig = (ST.DER.signals[r.id] || []).map(function (x) { return x.id; });
            if (!keys.some(function (k) { return sig.indexOf(k) >= 0; })) return false;
          } else if (!s[it.of(r)]) return false;
        } else if (it.kind === 'range') {
          if (isDefault(it)) continue;
          var v = it.of(r);
          if (v == null || !isFinite(v)) return false;
          if (v < s.lo - 1e-9 || v > s.hi + 1e-9) return false;
        } else if (s) {
          if (!it.of(r, ST)) return false;
        }
      }
    }
    return true;
  }

  /* ---- rendering ------------------------------------------------------ */
  function fmt(it, v) { return it.fmt ? it.fmt(v) : (Math.round(v * 10) / 10); }

  function renderItem(it) {
    var s = state[it.id], d = domains[it.id], def = isDefault(it);
    if (it.kind === 'flag') {
      return '<div class="toggle' + (s ? ' on' : '') + '" data-fl="' + it.id + '" role="switch" aria-checked="' + !!s + '" tabindex="0">' +
        '<span class="sw"></span><span>' + U.esc(it.label) + '</span></div>';
    }
    if (it.kind === 'set') {
      var vals = d || [];
      return '<div class="fitem">' +
        '<div class="fhead"><span class="flabel">' + U.esc(it.label) +
        (def ? '' : ' <span class="fcount">' + Object.keys(s).length + '</span>') + '</span>' +
        '<span class="facts">' +
        '<button class="flink" data-all="' + it.id + '">All</button>' +
        '<button class="flink" data-none="' + it.id + '">None</button>' +
        '</span></div>' +
        '<div class="chips' + (it.compact ? ' compact' : '') + '">' +
        vals.map(function (o) {
          return '<button class="chip' + (s[o.v] ? ' on' : '') + '" data-set="' + it.id + '" data-v="' + U.esc(o.v) + '">' +
            U.esc(o.label) + '</button>';
        }).join('') + '</div></div>';
    }
    /* range */
    var span = d[1] - d[0] || 1;
    var lp = (s.lo - d[0]) / span * 100, hp = (s.hi - d[0]) / span * 100;
    return '<div class="fitem">' +
      '<div class="fhead"><span class="flabel">' + U.esc(it.label) + '</span>' +
      '<span class="frange mono">' + fmt(it, s.lo) + ' – ' + fmt(it, s.hi) + '</span></div>' +
      '<div class="dualrange" data-dr="' + it.id + '">' +
      '<span class="dtrack"></span><span class="dfill" style="left:' + lp + '%;right:' + (100 - hp) + '%"></span>' +
      '<input type="range" class="dlo" min="' + d[0] + '" max="' + d[1] + '" step="' + (it.step || 1) + '" value="' + s.lo + '" aria-label="' + U.esc(it.label) + ' minimum">' +
      '<input type="range" class="dhi" min="' + d[0] + '" max="' + d[1] + '" step="' + (it.step || 1) + '" value="' + s.hi + '" aria-label="' + U.esc(it.label) + ' maximum">' +
      '</div></div>';
  }

  function render(opts) {
    opts = opts || {};
    var n = activeCount();
    var out = ['<div class="filters">'];

    out.push('<div class="railsec fsticky">' +
      '<div class="flex between center mb10">' +
      '<h4 style="margin:0">Filters' + (n ? ' <span class="fcount">' + n + '</span>' : '') + '</h4>' +
      '<button class="flink strong" data-reset-all="1"' + (n ? '' : ' disabled') + '>Reset all</button>' +
      '</div>' +
      '<input type="search" data-fq value="' + U.esc(query) + '" placeholder="Search markets…">' +
      '</div>');

    GROUPS.forEach(function (g) {
      var gn = g.items.filter(function (it) { return !isDefault(it); }).length;
      out.push('<details class="fgroup"' + (g.open || gn ? ' open' : '') + '>' +
        '<summary><span class="fgtitle">' + U.esc(g.label) +
        (gn ? ' <span class="fcount">' + gn + '</span>' : '') + '</span>' +
        '<span class="fchev">›</span></summary>' +
        '<div class="fgbody">' +
        (gn ? '<button class="flink gclear" data-reset-group="' + g.id + '">Clear this group</button>' : '') +
        g.items.map(renderItem).join('') +
        '</div></details>');
    });

    out.push('</div>');
    return out.join('');
  }

  /* Wire a rendered filter panel. onChange fires after each mutation. */
  function wire(root, onChange) {
    function changed() { onChange && onChange(); }

    U.on(root, 'click', '[data-set]', function (e, t) { toggleValue(t.dataset.set, t.dataset.v); t.classList.toggle('on'); changed(); });
    U.on(root, 'click', '[data-all]', function (e, t) { selectAll(t.dataset.all); changed(); });
    U.on(root, 'click', '[data-none]', function (e, t) { clearItem(t.dataset.none); changed(); });
    U.on(root, 'click', '[data-reset-group]', function (e, t) { resetGroup(t.dataset.resetGroup); changed(); });
    U.on(root, 'click', '[data-reset-all]', function () { reset(); changed(); });
    U.on(root, 'click', '[data-fl]', function (e, t) { setFlag(t.dataset.fl, !state[t.dataset.fl]); t.classList.toggle('on'); changed(); });
    U.on(root, 'keydown', '[data-fl]', function (e, t) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlag(t.dataset.fl, !state[t.dataset.fl]); t.classList.toggle('on'); changed(); }
    });

    U.on(root, 'input', '.dualrange input', function (e, t) {
      var wrap = t.closest('.dualrange'), id = wrap.dataset.dr;
      var lo = +wrap.querySelector('.dlo').value, hi = +wrap.querySelector('.dhi').value;
      if (t.classList.contains('dlo') && lo > hi) { hi = lo; wrap.querySelector('.dhi').value = hi; }
      if (t.classList.contains('dhi') && hi < lo) { lo = hi; wrap.querySelector('.dlo').value = lo; }
      setRange(id, lo, hi);
      var it = ITEMS[id], d = domains[id], span = d[1] - d[0] || 1;
      var fill = wrap.querySelector('.dfill');
      fill.style.left = ((lo - d[0]) / span * 100) + '%';
      fill.style.right = (100 - (hi - d[0]) / span * 100) + '%';
      var lab = wrap.parentNode.querySelector('.frange');
      if (lab) lab.textContent = fmt(it, lo) + ' – ' + fmt(it, hi);
      changed();
    });

    var q = root.querySelector('[data-fq]');
    if (q) q.addEventListener('input', U.debounce(function () { setQuery(q.value); changed(); }, 140));
  }

  /* A short human summary of what is currently constrained. */
  function summary() {
    var bits = [];
    if (query) bits.push('“' + query + '”');
    GROUPS.forEach(function (g) {
      g.items.forEach(function (it) {
        if (isDefault(it)) return;
        if (it.kind === 'set') {
          var keys = Object.keys(state[it.id]);
          bits.push(it.label + ': ' + (keys.length > 3 ? keys.length + ' selected' : keys.join(', ')));
        } else if (it.kind === 'range') {
          bits.push(it.label + ' ' + fmt(it, state[it.id].lo) + '–' + fmt(it, state[it.id].hi));
        } else bits.push(it.label);
      });
    });
    return bits;
  }

  return {
    GROUPS: GROUPS, ITEMS: ITEMS,
    init: init, reset: reset, resetGroup: resetGroup, selectAll: selectAll, clearItem: clearItem,
    toggleValue: toggleValue, setRange: setRange, setFlag: setFlag,
    setQuery: setQuery, getQuery: getQuery,
    match: match, render: render, wire: wire,
    activeCount: activeCount, summary: summary, isReady: function () { return ready; },
    state: function () { return state; }, domains: function () { return domains; }
  };
})(U);

/* ============================================================================
 * views/compare.js — side-by-side comparison of 2-10 markets.
 * ==========================================================================*/
var V_COMPARE = (function (ST, U, CH) {
  'use strict';
  var body = null;

  var AXES = [
    { id: 'construction', short: 'CONSTR' }, { id: 'pipeline', short: 'PIPE' },
    { id: 'wealth', short: 'WEALTH' }, { id: 'luxury', short: 'LUX' },
    { id: 'growth', short: 'GROWTH' }, { id: 'tourism', short: 'TOUR' },
    { id: 'prestige', short: 'PRESTIGE' }, { id: 'land', short: 'LAND' },
    { id: 'access', short: 'ACCESS' }, { id: 'future', short: 'FUTURE' }
  ];

  var METRICS = [
    { l: 'LCDOS overall', f: function (r) { return r.lcdos; } },
    { l: 'GC entry opportunity', f: function (r) { return r.gce; } },
    { l: 'Developer opportunity', f: function (r) { return r.dev; } },
    { l: 'Current luxury strength', f: function (r) { return r.cls; } },
    { l: 'Future luxury upside', f: function (r) { return r.flu; } },
    { l: 'Opportunity gap', f: function (r) { return r.gap; } },
    { l: 'Momentum', f: function (r) { return r.momentum; } },
    { l: '5-year outlook', f: function (r) { return r.f5; } },
    { l: '10-year outlook', f: function (r) { return r.f10; } },
    { l: '20-year outlook', f: function (r) { return r.f20; } },
    { l: 'Long-run risk (inverted)', f: function (r) { return 100 - r.risk; } },
    { l: 'Data confidence', f: function (r) { return r.confidence; } }
  ];

  var RAWS = [
    { l: 'Population', f: function (r) { return U.n0(r.m.p.pop); } },
    { l: 'Population growth', f: function (r) { return U.pctS(r.m.p.popCagr5) + '/yr'; } },
    { l: 'Median home value', f: function (r) { return U.usd(r.m.p.medVal); } },
    { l: 'Luxury $/sf (top decile)', f: function (r) { return '$' + U.n0(r.m.p.luxPpsf); } },
    { l: 'Construction cost $/sf', f: function (r) { return '$' + U.n0(r.m.p.costPsf); } },
    { l: 'Gross spec margin', f: function (r) { return U.pct(r.e.derived.specMarginPct); } },
    { l: '$2M+ closings / yr', f: function (r) { return U.n0(r.m.p.tx2m); } },
    { l: '$5M+ closings / yr', f: function (r) { return U.n0(r.m.p.tx5m); } },
    { l: '$10M+ closings / yr', f: function (r) { return U.n0(r.m.p.tx10m); } },
    { l: 'Modelled $2M+ starts / yr', f: function (r) { return U.n0(r.e.derived.luxStarts); } },
    { l: 'Luxury construction volume', f: function (r) { return U.usdM(r.e.derived.luxStartsVolumeM); } },
    { l: 'Established luxury GCs', f: function (r) { return U.n0(r.m.p.luxGcCount); } },
    { l: 'Starts per incumbent GC', f: function (r) { return U.n1(r.e.derived.startsPerIncumbent); } },
    { l: 'Avg luxury project value', f: function (r) { return U.usdM(r.e.derived.avgProjectValueM); } },
    { l: 'Contractor backlog', f: function (r) { return U.n1(r.m.p.backlog) + ' mo'; } },
    { l: 'Trade availability', f: function (r) { return r.m.p.tradeIdx + '/100'; } },
    { l: 'Announced pipeline', f: function (r) { return U.usdM(r.m.p.pipelineM); } },
    { l: 'Entitled lots', f: function (r) { return U.n0(r.m.p.entitledLots); } },
    { l: 'Entitlement time', f: function (r) { return r.m.p.entMonths + ' mo'; } },
    { l: 'Permit time', f: function (r) { return r.m.p.permitDays + ' days'; } },
    { l: 'Premium lot price', f: function (r) { return U.usd(r.m.p.lotPrice); } },
    { l: 'Land share of value', f: function (r) { return U.pct(r.m.p.landShare, 0); } },
    { l: 'Millionaires / 1k HH', f: function (r) { return U.n0(r.m.p.hnwiPer1k); } },
    { l: 'Millionaire growth (10y)', f: function (r) { return U.pct(r.m.p.hnwiG10, 0); } },
    { l: 'Net AGI inflow / return', f: function (r) { return U.usdFull(r.m.p.agiIn); } },
    { l: 'Second homes', f: function (r) { return U.pct(r.m.p.shShare, 0); } },
    { l: 'Annual visitors', f: function (r) { return U.n1(r.m.p.visitorsM) + 'M'; } },
    { l: 'GA jet operations', f: function (r) { return U.n0(r.m.p.jetOps) + 'k/yr'; } },
    { l: 'Nonstop destinations', f: function (r) { return U.n0(r.m.p.nonstops); } },
    { l: 'Build season', f: function (r) { return r.m.p.buildMonths + ' months'; } },
    { l: 'Effective property tax', f: function (r) { return U.pct(r.m.p.propTax, 2); } },
    { l: 'Top state income tax', f: function (r) { return U.pct(r.m.p.incomeTax, 2); } },
    { l: 'Insurance stress', f: function (r) { return r.m.p.insIdx + '/100'; } },
    { l: 'Regulatory burden', f: function (r) { return r.m.p.regIdx + '/100'; } },
    { l: 'Physical climate risk', f: function (r) { return r.m.p.climIdx + '/100'; } }
  ];

  function picker() {
    var rows = ST.DER.ranked;
    return '<div class="railsec"><h4>Markets <span class="dim2">' + ST.S.compare.length + ' / 10</span></h4>' +
      '<input type="search" id="cmpq" placeholder="Filter markets…" style="margin-bottom:8px">' +
      '<div style="max-height:62vh;overflow-y:auto" id="cmplist">' +
      rows.map(function (r) {
        var on = ST.S.compare.indexOf(r.id) >= 0;
        return '<div class="toggle' + (on ? ' on' : '') + '" data-cmp="' + r.id + '" data-name="' +
          U.esc((r.m.name + ' ' + r.m.state).toLowerCase()) + '"><span class="sw"></span>' +
          '<span style="flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + U.esc(r.m.name) + '</span>' +
          '<span class="mono dim2" style="font-size:10px">' + U.n0(r.lcdos) + '</span></div>';
      }).join('') + '</div>' +
      '<button class="btn wide mt10" data-act="clearcmp">Clear selection</button>' +
      '<button class="btn wide mt6" data-act="top6">Load top 6</button></div>';
  }

  /* Quick-start sets — the comparisons worth running before you know the data. */
  var SETS = [
    { id: 'top6',   label: 'Top 6 overall' },
    { id: 'gc',     label: 'Best places to start a GC' },
    { id: 'land',   label: 'Best places to buy land' },
    { id: 'gap',    label: 'Biggest opportunity gaps' },
    { id: 'ski',    label: 'Ski markets' },
    { id: 'coast',  label: 'Coastal markets' }
  ];

  function setIds(id) {
    var R = ST.DER.ranked, by = function (f) {
      return R.slice().sort(function (a, b) { return f(b) - f(a); });
    };
    if (id === 'gc')   return by(function (r) { return r.gce; }).slice(0, 6).map(function (r) { return r.id; });
    if (id === 'land') return by(function (r) { return r.dev; }).slice(0, 6).map(function (r) { return r.id; });
    if (id === 'gap')  return by(function (r) { return r.gap; }).slice(0, 6).map(function (r) { return r.id; });
    if (id === 'ski')  return R.filter(function (r) { return r.m.archetype === 'ski'; }).slice(0, 6).map(function (r) { return r.id; });
    if (id === 'coast') return R.filter(function (r) { return r.m.archetype === 'coastal'; }).slice(0, 6).map(function (r) { return r.id; });
    return R.slice(0, 6).map(function (r) { return r.id; });
  }

  function content() {
    var ids = ST.S.compare;
    if (ids.length < 2) {
      return '<div class="emptywrap"><div class="emptycard">' +
        '<h3>Compare markets side by side</h3>' +
        '<p>Pick two to ten markets from the list on the left. Every category score, ' +
        'construction figure and outlook recalculates under the active scenario.</p>' +
        '<div class="emptysets">' +
        SETS.map(function (st) {
          return '<button class="btn" data-set="' + st.id + '">' + U.esc(st.label) + '</button>';
        }).join('') +
        '</div></div></div>';
    }
    var rows = ids.map(function (id) { return ST.get(id); }).filter(Boolean);
    var colors = CH.SERIES;

    var radarSeries = rows.map(function (r, i) {
      return { name: r.m.name, color: colors[i % colors.length], values: AXES.map(function (a) { return r.e.cat[a.id]; }) };
    });

    var heatRows = METRICS.map(function (mt) {
      return { label: mt.l, cells: rows.map(function (r) { var v = mt.f(r); return { v: v, display: U.n0(v) }; }) };
    });

    var histSeries = rows.map(function (r, i) {
      return {
        name: r.m.name, color: colors[i % colors.length],
        points: ST.hist(r.id).map(function (h) { return { x: h.year, y: h.score, kind: h.kind }; })
      };
    });

    return '<div class="flex gap6 mb16" style="flex-wrap:wrap">' +
      rows.map(function (r, i) {
        return '<span class="pill" style="border-color:' + colors[i % colors.length] + '66;color:' + colors[i % colors.length] + '">' +
          U.esc(r.m.name) + '</span>';
      }).join('') + '</div>' +

      '<div class="gridcards g2 mb16">' +
      '<div class="panel"><header><h3>Category profile</h3><span class="tiny">ten weighted categories</span></header>' +
      '<div class="pad" style="display:flex;justify-content:center">' +
      CH.radar(AXES.map(function (a) {
        var c = ST.MODEL.CATEGORIES.filter(function (x) { return x.id === a.id; })[0];
        return { label: c.label, short: a.short };
      }), radarSeries, { size: 430 }) + '</div></div>' +
      '<div class="panel"><header><h3>Score trajectory 2021 → 2031</h3>' +
      '<span class="tiny">solid = modelled reconstruction · dashed = projection</span></header>' +
      '<div class="pad">' + CH.lines(histSeries, {
        width: 560, height: 380, xTicks: [2021, 2023, 2026, 2028, 2031], markX: 2026, markLabel: 'OBSERVED',
        yDomain: [30, 92]
      }) + '</div></div></div>' +

      '<div class="panel mb16"><header><h3>Score comparison</h3><span class="tiny">0-100, LCDOS ramp</span></header>' +
      '<div class="pad scrollx">' + CH.heat(rows.map(function (r) { return r.m.state + ' ' + r.m.name.replace(/ (&|and) .*$/, '').slice(0, 12); }),
        heatRows, { cellW: 92, cellH: 25, labelW: 210 }) + '</div></div>' +

      '<div class="panel"><header><h3>Underlying data</h3><span class="tiny">as observed / estimated, not scored</span></header>' +
      '<div class="scrollx"><table class="grid"><thead><tr><th class="l">Metric</th>' +
      rows.map(function (r) { return '<th>' + U.esc(r.m.name.replace(/ (&|and) .*$/, '')) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      RAWS.map(function (mt) {
        return '<tr><td class="l dim">' + U.esc(mt.l) + '</td>' +
          rows.map(function (r) { return '<td>' + U.esc(mt.f(r)) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function render(root) {
    body = root;
    body.innerHTML = '<div class="rail">' + picker() + '</div>' +
      '<div class="stage"><div class="scrollstage" style="padding:16px 18px 60px">' +
      '<div class="mb16"><h2 style="margin:0;font-size:18px;font-weight:600">Market comparison</h2>' +
      '<div class="dim" style="font-size:11.5px">Select 2 to 10 markets. Everything recalculates under the active scenario.</div></div>' +
      content() + '</div></div>';
    wire();
  }

  function wire() {
    U.on(body, 'click', '[data-cmp]', function (e, t) { ST.toggleCompare(t.dataset.cmp); render(body); });
    U.on(body, 'click', '[data-act="clearcmp"]', function () { ST.S.compare = []; render(body); });
    U.on(body, 'click', '[data-act="top6"]', function () {
      ST.S.compare = setIds('top6'); render(body);
    });
    U.on(body, 'click', '[data-set]', function (e, t) {
      ST.S.compare = setIds(t.dataset.set); render(body);
    });
    var q = document.getElementById('cmpq');
    if (q) q.addEventListener('input', function () {
      var v = q.value.toLowerCase();
      U.$$('#cmplist [data-cmp]').forEach(function (el) {
        el.style.display = !v || el.dataset.name.indexOf(v) >= 0 ? '' : 'none';
      });
    });
  }

  return { render: render, onEvent: function (w) { if (body && (w === 'scenario' || w === 'compare')) render(body); } };
})(STORE, U, CH);

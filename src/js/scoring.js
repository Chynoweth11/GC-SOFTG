/* ============================================================================
 * scoring.js — Evaluates the LCDOS model against the market dataset.
 * ----------------------------------------------------------------------------
 * Pure functions. Given primitives + the model, produces every score the
 * application displays. Deterministic: the same primitives always yield the
 * same scores, which is what makes the model auditable.
 *
 * Evaluation order matters, because the 10th category (Long-Term Future
 * Potential) is derived from the other nine plus momentum and risk:
 *
 *   1. indicators for C1-C9
 *   2. categories C1-C9
 *   3. momentum, risk, land runway
 *   4. forecast horizons -> C10 indicators -> C10
 *   5. LCDOS, CLS, FLU, Opportunity Gap, GC Entry, Developer, Confidence
 * ==========================================================================*/
var LCDOS_SCORING = (function (M) {
  'use strict';

  var N = M.N, D = M.DERIVED;

  function round1(v) { return v == null ? null : Math.round(v * 10) / 10; }

  /* Weighted mean over an indicator map for a list of ids. */
  function meanOf(ind, ids) {
    var s = 0, n = 0;
    for (var i = 0; i < ids.length; i++) {
      var v = ind[ids[i]];
      if (v == null || isNaN(v)) continue;
      s += v; n++;
    }
    return n ? s / n : null;
  }

  /* -------------------------------------------------------------------- */

  function evaluate(mkt, opts) {
    opts = opts || {};
    var p = applyScenario(mkt.p, opts.scenario);
    var ind = {}, indUnit = {}, cat = {}, catParts = {};

    /* 1-2. Indicators and categories for C1-C9. */
    M.CATEGORIES.forEach(function (c) {
      if (c.id === 'future') return;
      var s = 0, w = 0, parts = [];
      c.indicators.forEach(function (it) {
        var v = it.fn ? it.fn(p, D, ind, cat) : null;
        ind[it.id] = v;
        if (it.unit) { try { indUnit[it.id] = it.unit(p, D); } catch (e) { indUnit[it.id] = null; } }
        parts.push({ id: it.id, label: it.label, w: it.w, v: v });
        if (v != null && !isNaN(v)) { s += v * it.w; w += it.w; }
      });
      cat[c.id] = w ? s / w : null;
      catParts[c.id] = parts;
    });

    /* 3. Momentum — rate of change, as both a 0-100 score and a blended
     *    annual rate of fundamental improvement. */
    var mS = 0, mW = 0, mRate = 0, mRateW = 0, momParts = [];
    M.MOMENTUM_TERMS.forEach(function (t) {
      var v = t.norm(p, D);
      var r = t.rate ? t.rate(p, D) : null;
      momParts.push({ id: t.id, label: t.label, w: t.w, v: v, rate: r });
      if (v != null) { mS += v * t.w; mW += t.w; }
      if (r != null) { mRate += r * t.w; mRateW += t.w; }
    });
    var momentum = mW ? mS / mW : null;
    var momentumRate = mRateW ? mRate / mRateW : null;

    /* Risk composite (higher = riskier). */
    var rS = 0, rW = 0, riskParts = [];
    M.RISK_TERMS.forEach(function (t) {
      var v = t.fn(p);
      riskParts.push({ id: t.id, label: t.label, w: t.w, v: v });
      if (v != null) { rS += v * t.w; rW += t.w; }
    });
    var risk = rW ? rS / rW : null;

    /* Land runway — can this market physically keep building for decades? */
    var landRunway = N.mix(
      ind['d.landAvail'], 0.35,
      ind['d.water'], 0.25,
      ind['p.absorption'], 0.20,
      ind['d.topography'], 0.20
    );

    /* 4. Forecast horizons -> C10. */
    var f5 = N.mix(momentum, 0.55, cat.pipeline, 0.25, p.structIdx, 0.20);
    var f10 = N.mix(momentum, 0.35, landRunway, 0.25, p.structIdx, 0.25, ind['w.growth'], 0.15);
    var f20 = N.mix(p.structIdx, 0.30, landRunway, 0.30, momentum, 0.20, 100 - risk, 0.20);

    ind['f.fiveYear'] = f5;
    ind['f.tenYear'] = f10;
    ind['f.twentyYear'] = f20;
    ind['f.structural'] = p.structIdx;

    var fc = M.CATEGORIES.filter(function (c) { return c.id === 'future'; })[0];
    var fS = 0, fW = 0, fParts = [];
    fc.indicators.forEach(function (it) {
      var v = ind[it.id];
      fParts.push({ id: it.id, label: it.label, w: it.w, v: v });
      if (v != null) { fS += v * it.w; fW += it.w; }
    });
    cat.future = fW ? fS / fW : null;
    catParts.future = fParts;

    /* 5. Headline scores. */
    var lS = 0, lW = 0, catRows = [];
    M.CATEGORIES.forEach(function (c) {
      var v = cat[c.id];
      catRows.push({ id: c.id, key: c.key, label: c.label, weight: c.weight, v: v, contrib: v == null ? 0 : v * c.weight / 100 });
      if (v != null) { lS += v * c.weight; lW += c.weight; }
    });
    var lcdos = lW ? lS / lW : null;

    /* Current Luxury Strength — levels only. */
    var clsS = 0, clsW = 0;
    M.CLS_TERMS.forEach(function (t) {
      var v = meanOf(ind, t.ids);
      if (v != null) { clsS += v * t.w; clsW += t.w; }
    });
    var cls = clsW ? clsS / clsW : null;

    /* Future Luxury Upside — change, capacity, runway. */
    var fluS = 0, fluW = 0;
    M.FLU_TERMS.forEach(function (t) {
      var v = t.cat ? cat[t.cat] : meanOf(ind, t.ids);
      if (v != null) { fluS += v * t.w; fluW += t.w; }
    });
    var flu = fluW ? fluS / fluW : null;

    /* Opportunity Gap — how far future upside runs ahead of current maturity.
     * Centred at 50: above 50 means demand is forming faster than the market's
     * existing luxury infrastructure and builder base can serve it. */
    var gap = N.clamp(50 + (flu - cls) * 1.15, 0, 100);

    /* GC Entry Opportunity Score. */
    var gS = 0, gW = 0, gcParts = [];
    M.GC_TERMS.forEach(function (t) {
      var v = t.fn(p, D, ind, cat);
      gcParts.push({ id: t.id, label: t.label, w: t.w, v: v, why: t.why });
      if (v != null) { gS += v * t.w; gW += t.w; }
    });
    var gce = gW ? gS / gW : null;

    /* Developer Opportunity Score. */
    var dS = 0, dW = 0, devParts = [];
    M.DEV_TERMS.forEach(function (t) {
      var v = t.fn(p, D, ind, cat);
      devParts.push({ id: t.id, label: t.label, w: t.w, v: v, why: t.why });
      if (v != null) { dS += v * t.w; dW += t.w; }
    });
    var dev = dW ? dS / dW : null;

    /* Supply / demand framing for the Entry Opportunity Alert. */
    var demandIdx = N.mix(ind['c.luxNewBuild'], 0.34, cat.pipeline, 0.24, ind['c.remodel'], 0.20, cat.growth, 0.22);
    var capacityIdx = N.mix(
      N.logn(p.luxGcCount, 2, 260), 0.42,
      p.tradeIdx, 0.34,
      N.inv(p.backlog, 2, 14), 0.24
    );

    return {
      id: mkt.id,
      p: p,
      ind: ind, indUnit: indUnit,
      cat: cat, catParts: catParts, catRows: catRows,
      lcdos: lcdos,
      momentum: momentum, momentumRate: momentumRate, momParts: momParts,
      risk: risk, riskParts: riskParts,
      landRunway: landRunway,
      f5: f5, f10: f10, f20: f20,
      cls: cls, flu: flu, gap: gap,
      gce: gce, gcParts: gcParts,
      dev: dev, devParts: devParts,
      demandIdx: demandIdx, capacityIdx: capacityIdx,
      entryAlert: demandIdx >= 58 && capacityIdx <= 48,
      derived: {
        luxStarts: D.luxStarts(p),
        luxStartsVolumeM: D.luxStartsVolumeM(p),
        startsPerIncumbent: D.startsPerIncumbent(p),
        specMarginPct: D.specMarginPct(p),
        lotRunwayYears: D.lotRunwayYears(p),
        avgProjectValueM: D.avgProjectValueM(p),
        apprecAnnual: D.apprecAnnual(p),
        hnwiAnnual: D.hnwiAnnual(p),
        pipelinePerCap: D.pipelinePerCap(p),
        visitorsPerCap: D.visitorsPerCap(p),
        permitsPer1kHH: D.permitsPer1kHH(p)
      }
    };
  }

  /* ======================================================================
   * SCENARIO ENGINE
   * Applies multiplicative or additive shocks to primitives before scoring,
   * so the whole model re-solves under changed assumptions.
   * ==================================================================== */

  var SCENARIO_LEVERS = [
    { id: 'wealthMigration', label: 'Wealth migration', unit: '%', min: -50, max: 100, step: 5, def: 0,
      desc: 'Scales millionaire growth, net AGI inflow and second-home share.',
      apply: function (p, x) {
        var k = 1 + x / 100;
        p.hnwiG10 *= k; p.agiIn *= k; p.shShare = Math.min(p.shShare * (1 + x / 250), 85);
        p.uhnwIdx = Math.min(p.uhnwIdx * (1 + x / 400), 100);
      } },
    { id: 'population', label: 'Population growth', unit: '%', min: -60, max: 100, step: 5, def: 0,
      desc: 'Scales population, employment and net migration rates.',
      apply: function (p, x) { var k = 1 + x / 100; p.popCagr5 *= k; p.empCagr5 *= k; p.netMig *= k; } },
    { id: 'construction', label: 'Construction activity', unit: '%', min: -50, max: 100, step: 5, def: 0,
      desc: 'Scales permit volume and permit growth.',
      apply: function (p, x) { var k = 1 + x / 100; p.sfPermits *= k; p.permitCagr3 *= k; } },
    { id: 'rates', label: 'Interest rates', unit: 'bp', min: -300, max: 400, step: 25, def: 0,
      desc: 'Basis-point shift. Higher rates lengthen days on market, compress appreciation and permits, and raise the cash-buyer share of what still trades.',
      apply: function (p, x) {
        var b = x / 100;
        p.dom = Math.max(12, p.dom * (1 + b * 0.14));
        p.apprec5 = p.apprec5 - b * 6.5;
        p.sfPermits = Math.max(10, p.sfPermits * (1 - b * 0.075));
        p.permitCagr3 = p.permitCagr3 - b * 1.7;
        p.cashShare = Math.min(92, p.cashShare * (1 + b * 0.045));
      } },
    { id: 'landPrices', label: 'Land appreciation', unit: '%', min: -40, max: 120, step: 5, def: 0,
      desc: 'Scales lot pricing and land share of finished value - directly compresses or expands development margin.',
      apply: function (p, x) {
        var k = 1 + x / 100;
        p.lotPrice *= k; p.landShare = Math.min(p.landShare * (1 + x / 190), 72);
      } },
    { id: 'luxuryDemand', label: 'Luxury demand', unit: '%', min: -50, max: 120, step: 5, def: 0,
      desc: 'Scales $2M / $5M / $10M+ transaction volume and luxury price per square foot.',
      apply: function (p, x) {
        var k = 1 + x / 100;
        p.tx2m *= k; p.tx5m *= k; p.tx10m *= k; p.luxPpsf *= (1 + x / 320);
      } },
    { id: 'tourism', label: 'Tourism', unit: '%', min: -50, max: 100, step: 5, def: 0,
      desc: 'Scales visitation, visitor spend and occupancy.',
      apply: function (p, x) {
        var k = 1 + x / 100;
        p.visitorsM *= k; p.visitSpendM *= k; p.visitorG *= k;
        p.occ = Math.min(92, p.occ * (1 + x / 380));
      } },
    { id: 'infrastructure', label: 'Infrastructure investment', unit: '%', min: -60, max: 200, step: 10, def: 0,
      desc: 'Scales committed public infrastructure, airport capital programmes and the announced pipeline.',
      apply: function (p, x) {
        var k = 1 + x / 100;
        p.infraM *= k; p.airInvestM *= k; p.pipelineM *= (1 + x / 220);
      } },
    { id: 'approvals', label: 'Development approvals', unit: '%', min: -60, max: 120, step: 10, def: 0,
      desc: 'Faster approvals shorten entitlement, cut permit days, release entitled lots and reduce regulatory burden.',
      apply: function (p, x) {
        var k = 1 - x / 220;
        p.entMonths = Math.max(3, p.entMonths * k);
        p.permitDays = Math.max(10, p.permitDays * k);
        p.entitledLots *= (1 + x / 130);
        p.regIdx = Math.max(5, p.regIdx * k);
      } },
    { id: 'costs', label: 'Construction costs', unit: '%', min: -25, max: 60, step: 5, def: 0,
      desc: 'Scales construction cost per square foot - the direct hit to spec margin and development feasibility.',
      apply: function (p, x) { p.costPsf *= (1 + x / 100); } },
    { id: 'labour', label: 'Trade labour supply', unit: '%', min: -50, max: 80, step: 5, def: 0,
      desc: 'Scales subcontractor availability and shortens or lengthens contractor backlog.',
      apply: function (p, x) {
        p.tradeIdx = Math.min(100, Math.max(3, p.tradeIdx * (1 + x / 100)));
        p.backlog = Math.max(1, p.backlog * (1 - x / 260));
      } }
  ];

  function applyScenario(base, sc) {
    if (!sc) return base;
    var keys = Object.keys(sc), any = false;
    for (var i = 0; i < keys.length; i++) if (sc[keys[i]]) { any = true; break; }
    if (!any) return base;

    var p = {};
    for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) p[k] = base[k];

    /* Global levers first, then per-market state/region multipliers if given. */
    SCENARIO_LEVERS.forEach(function (lv) {
      var x = sc[lv.id];
      if (x) lv.apply(p, x);
    });
    return p;
  }

  /* ======================================================================
   * SCORE HISTORY
   * The dataset holds one observation date. Anything before it is a MODELLED
   * RECONSTRUCTION, and anything after it is a PROJECTION. Both are produced
   * here, deterministically, from the market's momentum and its remaining
   * runway - and both are labelled as such everywhere they are displayed.
   * ==================================================================== */

  function history(ev, fromYear, toYear, baseYear) {
    baseYear = baseYear || 2026;
    var drift = (ev.momentum - 50) * 0.085;          // score points per year
    var out = [];

    /* Backward reconstruction: unwind the drift, damped, and floor it. */
    var back = {};
    var s = ev.lcdos;
    for (var y = baseYear; y >= fromYear; y--) {
      back[y] = N.clamp(s, 3, 99);
      s = s - drift * Math.pow(0.94, baseYear - y);
    }

    /* Forward projection: drift decays and saturates as the score approaches
     * the practical ceiling - no market compounds at +4 points a year forever. */
    var fwd = {}, f = ev.lcdos;
    for (var y2 = baseYear + 1; y2 <= toYear; y2++) {
      var k = y2 - baseYear;
      var step = drift * Math.pow(0.87, k - 1) * (1 - f / 100) * 1.75;
      /* Runway constraint: markets that are running out of land decelerate. */
      step *= (0.55 + 0.45 * (ev.landRunway / 100));
      f = N.clamp(f + step, 3, 99);
      fwd[y2] = f;
    }

    for (var y3 = fromYear; y3 <= toYear; y3++) {
      var v = y3 <= baseYear ? back[y3] : fwd[y3];
      out.push({
        year: y3,
        score: Math.round(v * 10) / 10,
        kind: y3 < baseYear ? 'reconstructed' : y3 === baseYear ? 'observed' : 'projected'
      });
    }
    return out;
  }

  /* ======================================================================
   * DATA CONFIDENCE
   * A market carried by analyst estimates must never present as being as
   * reliable as one carried by filings and named sources.
   * ==================================================================== */

  function confidence(mkt, fieldProv, ev) {
    var tw = 0, n = 0, counts = {};
    var fields = Object.keys(mkt.p);

    fields.forEach(function (f) {
      var pr = (mkt.prov && mkt.prov[f]) || fieldProv[f];
      if (!pr) return;
      var t = M.TIERS[pr.tier];
      if (!t) return;
      tw += t.w; n++;
      counts[pr.tier] = (counts[pr.tier] || 0) + 1;
    });

    var tierScore = n ? tw / n : 40;
    var anchors = (mkt.anchors || []).length;
    var anchorScore = Math.min(anchors * 13, 100);

    /* Recency: how stale is the newest cited anchor, in months, as of 2026-08.
     * With no anchors the market still inherits the dataset's own vintage
     * (inputs are 2025-2026), which is worth a baseline but not a good score. */
    var BASE_RECENCY = 60, newest = BASE_RECENCY;
    (mkt.anchors || []).forEach(function (a) {
      var y = parseInt(String(a.date).slice(0, 4), 10) || 2023;
      var mo = parseInt(String(a.date).slice(5, 7), 10) || 6;
      var age = (2026 - y) * 12 + (8 - mo);
      var s2 = N.inv(age, 0, 42);
      if (s2 > newest) newest = s2;
    });

    var conf = 0.60 * tierScore + 0.22 * anchorScore + 0.18 * newest;

    /* Internal-consistency penalty. The luxury-starts figure is estimated two
     * independent ways - from permits and from closings. When those two
     * estimators disagree materially, the market's permit data and its
     * transaction data are telling different stories, and every downstream
     * construction score inherits that uncertainty. Some divergence is
     * structural - starts lead closings - so the penalty is gentle and capped
     * at 12 points. */
    var dispersion = null, penalty = 0;
    if (ev) {
      dispersion = M.DERIVED.luxStartsDispersion(ev.p);
      penalty = Math.min(12, Math.abs(Math.log(dispersion)) * 6.5);
      conf -= penalty;
    }

    return {
      score: Math.round(N.clamp(conf, 0, 100)),
      tierScore: Math.round(tierScore),
      anchors: anchors,
      recency: Math.round(newest),
      counts: counts,
      fieldCount: n,
      dispersion: dispersion,
      dispersionPenalty: Math.round(penalty * 10) / 10
    };
  }

  return {
    evaluate: evaluate,
    history: history,
    confidence: confidence,
    applyScenario: applyScenario,
    SCENARIO_LEVERS: SCENARIO_LEVERS,
    round1: round1
  };
})(typeof LCDOS_MODEL !== 'undefined' ? LCDOS_MODEL : require('../data/model.js'));
if (typeof module === 'object' && module.exports) module.exports = LCDOS_SCORING;

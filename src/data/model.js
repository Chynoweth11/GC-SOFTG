/* ============================================================================
 * model.js — The LCDOS scoring model.
 * ----------------------------------------------------------------------------
 * LCDOS = Luxury Construction & Development Opportunity Score (0-100).
 *
 * Design principle: NOTHING in this file asserts a market's score. Every score
 * is COMPUTED from primitive quantities held in markets.js by an explicit,
 * inspectable transform. The application renders the source text of each
 * transform in the Methodology module, so any number on screen can be traced
 * back to (a) the primitives it consumed, (b) the formula that combined them,
 * and (c) the provenance tier of each primitive.
 *
 * Structure:
 *   primitives  ->  indicators (0-100)  ->  categories (0-100)  ->  LCDOS
 *                                       \-> GC Entry Score
 *                                       \-> Developer Score
 *                                       \-> Current Luxury Strength
 *                                       \-> Future Luxury Upside -> Opportunity Gap
 *                                       \-> Momentum, Risk, Confidence
 * ==========================================================================*/
var LCDOS_MODEL = (function () {
  'use strict';

  /* ======================================================================
   * 1. NORMALISATION PRIMITIVES
   * Every transform is bounded 0-100 and monotonic. Bounds are chosen from
   * the observed national distribution of each variable (documented in
   * docs/METHODOLOGY.md) so that ~5th percentile maps near 0 and ~97th
   * percentile maps near 100.
   * ==================================================================== */

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function clamp01(v) { return clamp(v, 0, 1); }

  /** Linear rescale: lo -> 0, hi -> 100. */
  function lin(v, lo, hi) {
    if (v == null || isNaN(v)) return null;
    return clamp01((v - lo) / (hi - lo)) * 100;
  }

  /** Inverted linear: lo -> 100, hi -> 0. Used where "less is better". */
  function inv(v, lo, hi) {
    if (v == null || isNaN(v)) return null;
    return 100 - clamp01((v - lo) / (hi - lo)) * 100;
  }

  /** Log rescale — for variables spanning orders of magnitude (transaction
   *  counts, dollar pipelines, jet operations). */
  function logn(v, lo, hi) {
    if (v == null || isNaN(v)) return null;
    var e = 1e-9;
    var a = Math.log(Math.max(v, e) + 1), b = Math.log(lo + 1), c = Math.log(hi + 1);
    return clamp01((a - b) / (c - b)) * 100;
  }

  /** Piecewise-linear band — for variables where the optimum is interior
   *  (e.g. entitled-lot runway: too little is a constraint, too much is
   *  oversupply). pts = [[x, score], ...] ascending in x. */
  function band(v, pts) {
    if (v == null || isNaN(v)) return null;
    if (v <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (v <= pts[i][0]) {
        var t = (v - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
        return pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]);
      }
    }
    return pts[pts.length - 1][1];
  }

  /** Weighted blend of already-normalised 0-100 components. */
  function mix() {
    var s = 0, w = 0;
    for (var i = 0; i < arguments.length; i += 2) {
      var v = arguments[i], k = arguments[i + 1];
      if (v == null || isNaN(v)) continue;
      s += v * k; w += k;
    }
    return w ? s / w : null;
  }

  var N = { clamp: clamp, lin: lin, inv: inv, logn: logn, band: band, mix: mix };

  /* ======================================================================
   * 2. MODELLED INTERMEDIATES
   * Quantities that are not observed directly but are derived from
   * primitives by a stated heuristic. These are labelled MODELLED wherever
   * they surface in the UI.
   * ==================================================================== */

  var DERIVED = {
    /* Share of custom starts that clear $2M, inferred from realised pricing.
     * `luxPpsf` is the TOP-DECILE realised price per square foot, so it
     * overstates the typical custom build. A representative custom home is
     * taken at 70% of the top-decile rate (roughly the 72nd-75th percentile)
     * on ~4,000 finished sf. The share of custom starts clearing $2M then
     * follows the ratio raised to 1.6 - a convex taper that reproduces a
     * right-skewed price distribution far better than a linear or square-root
     * one, which both badly overstate the tail in mid-priced markets. */
    REP_PPSF_FACTOR: 0.70,
    REP_SF: 4000,
    luxShareOfCustom: function (p) {
      var repValue = p.luxPpsf * DERIVED.REP_PPSF_FACTOR * DERIVED.REP_SF;
      return clamp(Math.pow(clamp01(repValue / 2000000), 1.6), 0, 0.95);
    },

    /* Share of $2M+ closings that are new construction rather than resale.
     * Rises with build intensity: a market permitting 60 homes per 1,000
     * households is delivering most of its own high end; one permitting 10 is
     * mostly trading existing stock. */
    newBuildShareOfLux: function (p) {
      return clamp(0.20 + 0.50 * (DERIVED.permitsPer1kHH(p) / 60), 0.15, 0.70);
    },

    /* Modelled annual starts of new homes that will be valued $2M+.
     *
     * Two INDEPENDENT estimators are reconciled by geometric mean:
     *   supply side  = permits x custom share x share clearing $2M
     *   demand side  = $2M+ closings x new-construction share
     * Taken alone, the supply estimator overstates mid-priced growth markets
     * (it counts every custom start as luxury) and the demand estimator
     * understates markets whose pipeline has not yet closed. Their geometric
     * mean is materially more stable than either, and disagreement between
     * the two is itself reported as a data-quality signal. */
    luxStartsSupply: function (p) {
      return p.sfPermits * (p.customShare / 100) * DERIVED.luxShareOfCustom(p);
    },
    luxStartsDemand: function (p) {
      return p.tx2m * DERIVED.newBuildShareOfLux(p);
    },
    luxStarts: function (p) {
      var a = DERIVED.luxStartsSupply(p), b = DERIVED.luxStartsDemand(p);
      return Math.sqrt(Math.max(a, 0.1) * Math.max(b, 0.1));
    },
    /* Ratio between the two estimators. Far from 1.0 means the market's permit
     * data and its transaction data are telling different stories. */
    luxStartsDispersion: function (p) {
      var a = DERIVED.luxStartsSupply(p), b = DERIVED.luxStartsDemand(p);
      return Math.max(a, 0.1) / Math.max(b, 0.1);
    },

    /* Modelled annual dollar volume of $2M+ new construction, $M. */
    luxStartsVolumeM: function (p) {
      var avgSf = 4200;
      return DERIVED.luxStarts(p) * avgSf * p.costPsf / 1e6;
    },

    /* Luxury starts carried per established luxury GC — the single best
     * proxy for whether incumbents can absorb the demand in front of them. */
    startsPerIncumbent: function (p) {
      return DERIVED.luxStarts(p) / Math.max(p.luxGcCount, 1);
    },

    /* Gross spec-home margin before financing/soft costs, as a % of sale
     * price:  1 - (construction cost share) - (land cost share). */
    specMarginPct: function (p) {
      if (!p.luxPpsf) return 0;
      return (1 - (p.costPsf / p.luxPpsf) - (p.landShare / 100)) * 100;
    },

    /* Years of entitled-lot runway at the current absorption rate. */
    lotRunwayYears: function (p) {
      return p.entitledLots / Math.max(p.sfPermits, 1);
    },

    /* Average luxury project value, $M — sets the revenue-per-job a new GC
     * can expect and therefore how few jobs it takes to reach scale. */
    avgProjectValueM: function (p) {
      return 4200 * p.costPsf / 1e6;
    },

    /* Annualised equivalents of multi-year change primitives. */
    apprecAnnual: function (p) { return (Math.pow(1 + p.apprec5 / 100, 1 / 5) - 1) * 100; },
    hnwiAnnual: function (p) { return (Math.pow(1 + p.hnwiG10 / 100, 1 / 10) - 1) * 100; },

    /* Per-capita normalisations. */
    pipelinePerCap: function (p) { return p.pipelineM * 1e6 / p.pop; },
    infraPerCap: function (p) { return p.infraM * 1e6 / p.pop; },
    commercialPerCap: function (p) { return p.commercialM * 1e6 / p.pop; },
    visitorsPerCap: function (p) { return p.visitorsM * 1e6 / p.pop; },
    spendPerCap: function (p) { return p.visitSpendM * 1e6 / p.pop; },
    permitsPer1kHH: function (p) { return p.sfPermits / p.hh * 1000; },
    lotsPer1kHH: function (p) { return p.entitledLots / p.hh * 1000; }
  };

  /* ======================================================================
   * 3. INDICATORS
   * id, label, weight-within-category, why it matters, and the transform.
   * `fn(p, d)` receives the market's primitives and the DERIVED helpers.
   * ==================================================================== */

  function I(id, label, w, why, fn, unitFn) {
    return { id: id, label: label, w: w, why: why, fn: fn, unit: unitFn || null };
  }

  var CATEGORIES = [
    {
      id: 'construction', label: 'Construction Opportunity', weight: 20, key: 'C1',
      blurb: 'Can a new high-end GC find enough work, at enough margin, against beatable competition?',
      indicators: [
        I('c.permitDensity', 'Permit density', 12,
          'Single-family permits per 1,000 households measures how much building actually happens per unit of local market, independent of city size. A small resort county issuing 40 permits per 1,000 households is a far denser opportunity than a large metro issuing 6.',
          function (p, d) { return lin(d.permitsPer1kHH(p), 2, 60); },
          function (p, d) { return d.permitsPer1kHH(p).toFixed(1) + ' /1k HH'; }),
        I('c.permitGrowth', 'Permit growth (3-yr CAGR)', 12,
          'Rate of change in authorised construction. A GC entering a market wants the second derivative on its side: growth in permits leads growth in subcontractor demand by roughly two to four quarters.',
          function (p) { return lin(p.permitCagr3, -8, 18); },
          function (p) { return (p.permitCagr3 > 0 ? '+' : '') + p.permitCagr3.toFixed(1) + '%/yr'; }),
        I('c.customIntensity', 'Custom / semi-custom share', 12,
          'Production builders do not hire high-end GCs. The share of single-family starts that are custom or semi-custom defines the slice of the permit count that is actually addressable.',
          function (p) { return lin(p.customShare, 5, 55); },
          function (p) { return p.customShare.toFixed(0) + '% of SF starts'; }),
        I('c.luxNewBuild', 'Luxury new-build starts ($2M+)', 14,
          'The core addressable market: modelled count of new homes started each year that will be valued above $2M, reconciled by geometric mean from an independent supply-side (permits) and demand-side (closings) estimator. This is the number that determines whether a GC can build a $20M+ revenue book.',
          function (p, d) { return logn(d.luxStarts(p), 3, 900); },
          function (p, d) { return Math.round(d.luxStarts(p)) + ' starts/yr (modelled)'; }),
        I('c.ultraLux', 'Ultra-luxury depth ($5M / $10M+)', 8,
          'Depth at the very top sets the ceiling on project size. A market that closes $10M+ transactions supports $6M-$12M construction contracts, where a single job can carry a firm for a year.',
          function (p) { return logn(p.tx5m + p.tx10m * 2, 1, 400); },
          function (p) { return p.tx5m + ' @ $5M+, ' + p.tx10m + ' @ $10M+'; }),
        I('c.remodel', 'High-end remodel intensity', 12,
          'Remodels are how a new GC gets its first references without land, entitlements or a construction loan. Markets with a deep stock of ageing luxury homes generate continuous eight-figure renovation demand.',
          function (p) { return p.remodelIdx; },
          function (p) { return p.remodelIdx + ' / 100'; }),
        I('c.commercial', 'Commercial & hospitality pipeline', 8,
          'Non-residential work smooths the residential cycle and builds bonding capacity. Measured as announced commercial and hospitality construction dollars per resident.',
          function (p, d) { return logn(d.commercialPerCap(p), 100, 25000); },
          function (p, d) { return '$' + Math.round(d.commercialPerCap(p)).toLocaleString() + '/resident'; }),
        I('c.capacityGap', 'Incumbent saturation', 12,
          'Luxury starts divided by the count of established luxury GCs. A high ratio means every capable builder in town is already full and clients are waiting - the single clearest signal that a market will take a new entrant.',
          function (p, d) { return lin(d.startsPerIncumbent(p), 1, 25); },
          function (p, d) { return d.startsPerIncumbent(p).toFixed(1) + ' starts per luxury GC'; }),
        I('c.tradeAvail', 'Subcontractor availability', 6,
          'A GC is only as good as the trades it can schedule. Thin sub bases cap how many jobs can run in parallel and are the most common reason a well-capitalised entrant stalls at three concurrent projects.',
          function (p) { return p.tradeIdx; },
          function (p) { return p.tradeIdx + ' / 100'; }),
        I('c.backlog', 'Contractor backlog', 4,
          'Backlog in months. Long backlogs are a demand signal, not a warning: they mean clients cannot get a builder, which is precisely the condition a new firm needs to win work at price.',
          function (p) { return lin(p.backlog, 2, 14); },
          function (p) { return p.backlog.toFixed(1) + ' months'; })
      ]
    },

    {
      id: 'pipeline', label: 'Future Development Pipeline', weight: 12, key: 'C2',
      blurb: 'Where are billions of dollars of future work already forming, before it shows up in permit data?',
      indicators: [
        I('p.pipelinePerCap', 'Announced pipeline per resident', 24,
          'Total announced five-year development value per resident. Normalising by population is what separates a genuine transformation (Heber Valley, Bentonville) from a big number in a big city.',
          function (p, d) { return logn(d.pipelinePerCap(p), 200, 60000); },
          function (p, d) { return '$' + Math.round(d.pipelinePerCap(p)).toLocaleString() + '/resident'; }),
        I('p.entitledSupply', 'Entitled lot inventory', 16,
          'Entitled but unbuilt lots per 1,000 households. Entitled land is the raw material of a homebuilding operation and the clearest evidence that private capital has already committed to the market.',
          function (p, d) { return lin(d.lotsPer1kHH(p), 20, 900); },
          function (p, d) { return Math.round(d.lotsPer1kHH(p)) + ' lots /1k HH'; }),
        I('p.resortHotel', 'Resort, hotel & golf pipeline', 16,
          'Absolute scale of announced commercial and hospitality construction. Resort expansion is the leading indicator of luxury residential demand: lifts, clubhouses and hotel keys precede homes by three to seven years.',
          function (p) { return logn(p.commercialM, 40, 8000); },
          function (p) { return '$' + p.commercialM.toLocaleString() + 'M announced'; }),
        I('p.infrastructure', 'Public infrastructure commitment', 20,
          'Committed public spending on roads, water, sewer and utilities per resident. Infrastructure is what converts raw acreage into developable land, and it is budgeted years before the land trades.',
          function (p, d) { return logn(d.infraPerCap(p), 100, 12000); },
          function (p, d) { return '$' + Math.round(d.infraPerCap(p)).toLocaleString() + '/resident'; }),
        I('p.airportInvest', 'Airport capital programme', 10,
          'Committed airport investment. In destination markets, terminal and FBO capacity is the binding constraint on how many wealthy households the market can absorb.',
          function (p) { return logn(p.airInvestM, 5, 800); },
          function (p) { return '$' + p.airInvestM.toLocaleString() + 'M'; }),
        I('p.absorption', 'Supply / absorption balance', 14,
          'Years of entitled-lot runway at the current build rate. Scored as a band: under two years is a hard supply constraint that caps volume; over fifteen signals oversupply and price risk. Three to eight years is the developer sweet spot.',
          function (p, d) { return band(d.lotRunwayYears(p), [[0, 40], [2, 78], [4, 95], [8, 92], [14, 62], [25, 28], [40, 15]]); },
          function (p, d) { return d.lotRunwayYears(p).toFixed(1) + ' yrs runway'; })
      ]
    },

    {
      id: 'wealth', label: 'Wealth & HNW Migration', weight: 12, key: 'C3',
      blurb: 'Not where wealthy people already live - where wealthy people are actively moving.',
      indicators: [
        I('w.density', 'Millionaire density', 16,
          'Millionaire households per 1,000 households. Establishes the existing client base a GC can sell into from day one.',
          function (p) { return logn(p.hnwiPer1k, 15, 220); },
          function (p) { return p.hnwiPer1k + ' /1k HH'; }),
        I('w.growth', 'Millionaire growth (10-yr)', 20,
          'The heaviest-weighted wealth variable, deliberately. A market whose millionaire count doubled in a decade is creating new construction clients faster than its builder base can grow into them.',
          function (p) { return lin(p.hnwiG10, 10, 200); },
          function (p) { return '+' + p.hnwiG10 + '% (10yr)'; }),
        I('w.agiInflow', 'Net AGI inflow per return', 18,
          'IRS Statistics of Income migration flows: the average adjusted gross income each net in-migrating household brings. Distinguishes markets gaining wealthy households from markets merely gaining people.',
          function (p) { return lin(p.agiIn, -15000, 90000); },
          function (p) { return '$' + Math.round(p.agiIn).toLocaleString() + '/return'; }),
        I('w.uhnw', 'UHNW & billionaire presence', 12,
          'Centi-millionaire and billionaire presence. UHNW households drive the $10M+ construction contracts and, more importantly, the private club and resort investment that re-rates an entire market.',
          function (p) { return p.uhnwIdx; },
          function (p) { return p.uhnwIdx + ' / 100'; }),
        I('w.secondHome', 'Second-home ownership', 14,
          'Seasonal and second-home share of housing units. Second-home owners build more expensively per square foot, remodel more often, and are far less price-sensitive than primary-residence buyers.',
          function (p) { return lin(p.shShare, 1, 60); },
          function (p) { return p.shShare + '% of units'; }),
        I('w.incomeGrowth', 'Household income growth', 10,
          'Five-year median household income CAGR - the broad-based wealth creation that supports the $1M-$3M tier below the trophy market.',
          function (p) { return lin(p.incCagr5, 1.0, 7.0); },
          function (p) { return '+' + p.incCagr5.toFixed(1) + '%/yr'; }),
        I('w.wealthInfra', 'Wealth infrastructure', 10,
          'Family offices, private banks, RIAs and private equity presence. Where wealth is administered, wealth stays - and the referral network that wins luxury construction work is built inside it.',
          function (p) { return p.wealthInfraIdx; },
          function (p) { return p.wealthInfraIdx + ' / 100'; })
      ]
    },

    {
      id: 'luxury', label: 'Luxury Real Estate Market', weight: 12, key: 'C4',
      blurb: 'The depth, pricing and liquidity of the existing high-end housing market.',
      indicators: [
        I('l.medianValue', 'Median home value', 10,
          'The base of the market. Matters less than the top decile for a luxury GC, but sets land economics and the floor under spec pricing.',
          function (p) { return logn(p.medVal, 250000, 3500000); },
          function (p) { return '$' + (p.medVal / 1000).toFixed(0) + 'k'; }),
        I('l.luxPpsf', 'Luxury price per square foot', 14,
          'Top-decile realised $/sf. The single most important number in a spec or development pro-forma: it is the revenue line against which construction cost is measured.',
          function (p) { return logn(p.luxPpsf, 220, 3000); },
          function (p) { return '$' + p.luxPpsf + '/sf'; }),
        I('l.tx2m', '$2M+ transaction volume', 16,
          'Annual closings above $2M. Directly proportional to the number of clients capable of commissioning a high-end build or a gut renovation.',
          function (p) { return logn(p.tx2m, 5, 4000); },
          function (p) { return p.tx2m.toLocaleString() + ' /yr'; }),
        I('l.tx5m', '$5M+ transaction volume', 12,
          'The trophy tier. Markets with sustained $5M+ liquidity support the project sizes where GC margin dollars become material.',
          function (p) { return logn(p.tx5m, 1, 600); },
          function (p) { return p.tx5m.toLocaleString() + ' /yr'; }),
        I('l.tx10m', '$10M+ transaction volume', 8,
          'Ultra-prime depth. Thin here in most of the country; where it exists it signals a market that can absorb genuinely uncapped budgets.',
          function (p) { return logn(p.tx10m, 1, 200); },
          function (p) { return p.tx10m.toLocaleString() + ' /yr'; }),
        I('l.apprec', 'Five-year appreciation', 14,
          'Total price growth over five years. Appreciation is what makes spec building and land banking work; it is also the clearest evidence that demand is outrunning supply.',
          function (p) { return lin(p.apprec5, 5, 110); },
          function (p) { return '+' + p.apprec5 + '% (5yr)'; }),
        I('l.dom', 'Days on market', 8,
          'Median days on market in the luxury segment, inverted. Fast absorption de-risks spec inventory and shortens the capital cycle.',
          function (p) { return inv(p.dom, 25, 220); },
          function (p) { return p.dom + ' days'; }),
        I('l.cash', 'Cash purchase share', 8,
          'Share of transactions closing without financing. High cash share means the market is insulated from rate shocks - the reason resort luxury held through 2022-2024 while production housing did not.',
          function (p) { return lin(p.cashShare, 15, 78); },
          function (p) { return p.cashShare + '% cash'; }),
        I('l.lotValue', 'Premium lot pricing', 10,
          'Typical price of a premium building lot. High lot values prove the market prices scarcity, which is the precondition for a land development business.',
          function (p) { return logn(p.lotPrice, 80000, 6000000); },
          function (p) { return '$' + (p.lotPrice / 1000).toFixed(0) + 'k'; })
      ]
    },

    {
      id: 'growth', label: 'Growth & Demographics', weight: 8, key: 'C5',
      blurb: 'Underlying economic momentum: does the market keep generating new households and new jobs?',
      indicators: [
        I('g.popGrowth', 'Population growth (5-yr CAGR)', 22,
          'The base rate of new household formation and therefore of structural construction demand.',
          function (p) { return lin(p.popCagr5, -0.5, 5.0); },
          function (p) { return (p.popCagr5 > 0 ? '+' : '') + p.popCagr5.toFixed(1) + '%/yr'; }),
        I('g.migration', 'Net domestic migration', 16,
          'Net domestic in-migration per 1,000 residents. Migration-led growth skews wealthier and older than birth-led growth, and buys rather than rents.',
          function (p) { return lin(p.netMig, -8, 35); },
          function (p) { return (p.netMig > 0 ? '+' : '') + p.netMig + ' /1k'; }),
        I('g.employment', 'Employment growth', 16,
          'Five-year employment CAGR. Job growth underwrites the trade base a GC depends on as much as it underwrites housing demand.',
          function (p) { return lin(p.empCagr5, -0.5, 5.0); },
          function (p) { return (p.empCagr5 > 0 ? '+' : '') + p.empCagr5.toFixed(1) + '%/yr'; }),
        I('g.bizFormation', 'Business formation', 12,
          'New business application intensity indexed to the national median (50). Business owners are the single largest source of custom-home clients.',
          function (p) { return p.bizFormIdx; },
          function (p) { return p.bizFormIdx + ' (US med. 50)'; }),
        I('g.income', 'Median household income', 10,
          'Income level, log-scaled. Sets the depth of the move-up market beneath the luxury tier.',
          function (p) { return logn(p.medInc, 45000, 200000); },
          function (p) { return '$' + (p.medInc / 1000).toFixed(0) + 'k'; }),
        I('g.shortage', 'Housing shortage severity', 14,
          'Estimated gap between household formation plus replacement demand and delivered supply. Shortage is what converts population growth into pricing power and keeps builders busy through soft cycles.',
          function (p) { return p.shortageIdx; },
          function (p) { return p.shortageIdx + ' / 100'; }),
        I('g.incomeGrowth', 'Income growth', 10,
          'Real household income growth. Deliberately double-counted with the wealth category at a lower weight: it is both a wealth-creation and a demographic-momentum signal.',
          function (p) { return lin(p.incCagr5, 1.0, 7.0); },
          function (p) { return '+' + p.incCagr5.toFixed(1) + '%/yr'; })
      ]
    },

    {
      id: 'tourism', label: 'Tourism & Destination Growth', weight: 8, key: 'C6',
      blurb: 'Can the destination keep importing outside wealth, year after year?',
      indicators: [
        I('t.intensity', 'Visitor intensity', 22,
          'Annual visitors per resident. The mechanism by which a small town accesses a national client base: every visitor is a prospective second-home buyer, and conversion rates in the top markets run roughly 1 in 2,000.',
          function (p, d) { return logn(d.visitorsPerCap(p), 0.5, 200); },
          function (p, d) { return d.visitorsPerCap(p).toFixed(1) + 'x population'; }),
        I('t.growth', 'Visitation growth', 16,
          'Year-over-year growth in visitation. Rising visitation precedes rising second-home demand by two to five years.',
          function (p) { return lin(p.visitorG, -1, 10); },
          function (p) { return (p.visitorG > 0 ? '+' : '') + p.visitorG.toFixed(1) + '%/yr'; }),
        I('t.spend', 'Visitor spend per resident', 18,
          'Tourism spending per resident. Separates high-yield destinations from high-volume ones: 2 million affluent visitors are worth more than 8 million day-trippers.',
          function (p, d) { return logn(d.spendPerCap(p), 200, 60000); },
          function (p, d) { return '$' + Math.round(d.spendPerCap(p)).toLocaleString() + '/resident'; }),
        I('t.luxLodging', 'Luxury lodging depth', 22,
          'Four- and five-star room count blended with peak ADR. Luxury hotels are both a construction market in themselves and the funnel through which UHNW buyers first experience a destination.',
          function (p) { return mix(logn(p.luxRooms, 20, 12000), 0.55, logn(p.adr, 180, 1800), 0.45); },
          function (p) { return p.luxRooms.toLocaleString() + ' rooms @ $' + p.adr + ' ADR'; }),
        I('t.occupancy', 'Occupancy strength', 12,
          'Annual occupancy. Sustained high occupancy is the trigger for new hotel and resort development, which is the highest-value commercial work available to a regional GC.',
          function (p) { return lin(p.occ, 40, 80); },
          function (p) { return p.occ + '%'; }),
        I('t.seasonBalance', 'Season length', 10,
          'Year-round demand balance (100 = no seasonality). Single-season markets cannot support a full-time trade base, which caps how large any GC in them can grow.',
          function (p) { return p.seasonIdx; },
          function (p) { return p.seasonIdx + ' / 100'; })
      ]
    },

    {
      id: 'prestige', label: 'Prestige, Exclusivity & Social Capital', weight: 8, key: 'C7',
      blurb: 'Not where the wealthy live - where the wealthy want to be associated with living.',
      indicators: [
        I('x.reputation', 'National / international recognition', 18,
          'How widely the market is recognised as a status address. Recognition is what lets a market price a lot at a multiple of its replacement cost and is the hardest attribute for a competitor to manufacture.',
          function (p) { return p.repIdx; }, function (p) { return p.repIdx + ' / 100'; }),
        I('x.clubs', 'Private club ecosystem', 18,
          'Density and exclusivity of private golf, yacht, ski and social clubs. Clubs are the distribution channel for luxury construction: in plateau and ski markets, most $5M+ jobs are referred inside a clubhouse.',
          function (p) { return p.clubIdx; }, function (p) { return p.clubIdx + ' / 100'; }),
        I('x.celebrity', 'Billionaire & celebrity presence', 14,
          'Visible UHNW and celebrity ownership. Drives aspirational demand from the tier below, which is where transaction volume actually sits.',
          function (p) { return p.celebIdx; }, function (p) { return p.celebIdx + ' / 100'; }),
        I('x.hospitality', 'Five-star hotels & dining', 12,
          'Forbes/AAA top-tier hotels and serious restaurants. Hospitality quality is the most reliable leading indicator of a market moving up a status tier.',
          function (p) { return p.hospIdx; }, function (p) { return p.hospIdx + ' / 100'; }),
        I('x.retail', 'Luxury retail & galleries', 10,
          'Presence of luxury retail and a real art market. Retail follows wealth with a lag and confirms it has become permanent rather than seasonal.',
          function (p) { return p.retailIdx; }, function (p) { return p.retailIdx + ' / 100'; }),
        I('x.schools', 'Private schools', 8,
          'Independent school quality and depth. The variable that converts second-home owners into primary residents - and primary residents build bigger.',
          function (p) { return p.schoolIdx; }, function (p) { return p.schoolIdx + ' / 100'; }),
        I('x.privacy', 'Privacy & discretion', 12,
          'Ability to own without visibility: gated communities, large-acreage zoning, weak press interest, discreet brokerage culture. Increasingly the top-ranked attribute among UHNW buyers.',
          function (p) { return p.privacyIdx; }, function (p) { return p.privacyIdx + ' / 100'; }),
        I('x.barrier', 'Difficulty of entry', 8,
          'How hard the market is to enter socially - club waitlists, referral-gated brokers, closed builder networks. Scored positively as a moat for those already inside; penalised separately in the GC Entry Score.',
          function (p) { return p.entryBarIdx; }, function (p) { return p.entryBarIdx + ' / 100'; })
      ]
    },

    {
      id: 'land', label: 'Land & Developer Opportunity', weight: 10, key: 'C8',
      blurb: 'The category that decides whether a contractor can ever become a developer here.',
      indicators: [
        I('d.landAvail', 'Developable land availability', 18,
          'Remaining developable acreage relative to demand. The binding constraint on every mature resort market and the reason a builder in Aspen can never become a developer in Aspen.',
          function (p) { return p.landIdx; }, function (p) { return p.landIdx + ' / 100'; }),
        I('d.landMargin', 'Land cost headroom', 14,
          'Land as a share of finished home value, inverted. Where land is 15% of value a developer captures the entitlement and horizontal spread; where it is 45% the seller has already taken it.',
          function (p) { return inv(p.landShare, 12, 55); },
          function (p) { return p.landShare + '% of finished value'; }),
        I('d.entitlement', 'Entitlement velocity', 14,
          'Months to entitle a subdivision. Entitlement time is carry cost and risk; it is also a moat once you have learned to navigate it.',
          function (p) { return inv(p.entMonths, 4, 42); },
          function (p) { return p.entMonths + ' months'; }),
        I('d.water', 'Water & utility headroom', 12,
          'Availability of water rights, sewer capacity and power. In the Mountain West and Southwest this is now the first question on any land deal and the most common reason entitlements fail.',
          function (p) { return p.waterIdx; }, function (p) { return p.waterIdx + ' / 100'; }),
        I('d.topography', 'Physical developability', 8,
          'Topographic and environmental constraint, inverted. Steep ground, wetlands, floodplain and protected land raise horizontal cost per lot and shrink yield.',
          function (p) { return inv(p.topoIdx, 10, 90); },
          function (p) { return p.topoIdx + ' / 100 constrained'; }),
        I('d.shortage', 'Housing shortage', 12,
          'Severity of the supply deficit. Shortage is the developer\'s tailwind: it shortens absorption, supports price and gives political cover for entitlements.',
          function (p) { return p.shortageIdx; }, function (p) { return p.shortageIdx + ' / 100'; }),
        I('d.subdivision', 'Subdivision & MPC potential', 12,
          'Composite of land availability, entitled inventory and population growth - the conditions under which a builder can assemble and plat rather than buy finished lots.',
          function (p, d) {
            return mix(p.landIdx, 0.40, lin(d.lotsPer1kHH(p), 20, 900), 0.30, lin(p.popCagr5, -0.5, 5.0), 0.30);
          }, null),
        I('d.specEconomics', 'Spec-home economics', 10,
          'Gross spec margin: 1 minus construction cost share minus land share of sale price. Below about 18% spec building does not compensate for the risk; above 30% it is the fastest path from contractor to developer.',
          function (p, d) { return lin(d.specMarginPct(p), 0, 40); },
          function (p, d) { return d.specMarginPct(p).toFixed(1) + '% gross margin'; })
      ]
    },

    {
      id: 'access', label: 'Accessibility & Infrastructure', weight: 5, key: 'C9',
      blurb: 'How easily can capital physically get there - especially by private aircraft?',
      indicators: [
        I('a.privateAir', 'Private aviation', 30,
          'Annual general-aviation jet operations. The heaviest-weighted access variable because private aviation, not commercial service, determines whether a UHNW household will treat a market as a realistic second home.',
          function (p) { return logn(p.jetOps, 2, 200); },
          function (p) { return p.jetOps.toFixed(0) + 'k ops/yr'; }),
        I('a.commercialAir', 'Commercial air service', 26,
          'Nonstop destinations from the market\'s primary commercial airport. Nonstops from the wealth-source cities - New York, Los Angeles, Dallas, Chicago, San Francisco - matter far more than total seat count.',
          function (p) { return logn(p.nonstops, 0, 120); },
          function (p) { return p.nonstops + ' nonstop destinations'; }),
        I('a.metroProximity', 'Metro proximity', 16,
          'Drive time to the nearest metro above 500,000. Determines access to a deep trade base, material suppliers and specialty subs - the quiet constraint on how fast a GC can scale in a remote market.',
          function (p) { return inv(p.metroMin, 10, 240); },
          function (p) { return p.metroMin + ' min drive'; }),
        I('a.roads', 'Road & highway access', 12,
          'Quality and redundancy of surface access. Single-highway resort markets carry real seasonal and event risk.',
          function (p) { return p.roadIdx; }, function (p) { return p.roadIdx + ' / 100'; }),
        I('a.plannedInvest', 'Committed transport investment', 16,
          'Airport capital programmes plus the transport share of public infrastructure. Signals that capacity constraints are being removed rather than tightening.',
          function (p) { return logn(p.airInvestM + p.infraM * 0.3, 10, 2000); },
          function (p) { return '$' + Math.round(p.airInvestM + p.infraM * 0.3).toLocaleString() + 'M'; })
      ]
    },

    {
      id: 'future', label: 'Long-Term Future Potential', weight: 5, key: 'C10',
      blurb: 'Forecast horizons, derived from momentum, structural alignment, land runway and risk.',
      indicators: [
        I('f.fiveYear', '5-year outlook', 25,
          'Derived. Weighted from current momentum (55%), the committed development pipeline (25%) and structural tailwind alignment (20%). Over five years, what is already funded dominates.',
          null, null),
        I('f.tenYear', '10-year outlook', 30,
          'Derived. Momentum (35%), land runway (25%), structural alignment (25%) and wealth-migration growth (15%). Over ten years, whether the market can still physically build starts to bind.',
          null, null),
        I('f.twentyYear', '20-year outlook', 30,
          'Derived. Structural alignment (30%), land runway (30%), residual momentum (20%) and inverted long-run risk (20%). Over twenty years, climate, water, insurance and land exhaustion dominate everything else.',
          null, null),
        I('f.structural', 'Structural tailwind alignment', 15,
          'Analyst rubric scoring alignment with the durable forces reshaping U.S. wealth geography: tax migration, remote work, private aviation, outdoor recreation, climate migration, and institutional capital formation in resort residential.',
          function (p) { return p.structIdx; }, function (p) { return p.structIdx + ' / 100'; })
      ]
    }
  ];

  /* ======================================================================
   * 4. DERIVED SCORE DEFINITIONS
   * ==================================================================== */

  /* Momentum: rate-of-change composite. Also reported as a blended annual
   * rate of fundamental improvement (%/yr), which is the figure that makes
   * "score 74, momentum +19%" legible. */
  var MOMENTUM_TERMS = [
    { id: 'permits',   label: 'Permit growth',        w: 22, rate: function (p) { return p.permitCagr3; },                norm: function (p) { return lin(p.permitCagr3, -8, 18); } },
    { id: 'wealth',    label: 'Millionaire growth',   w: 18, rate: function (p, d) { return d.hnwiAnnual(p); },           norm: function (p, d) { return lin(d.hnwiAnnual(p), 0, 12); } },
    { id: 'population',label: 'Population growth',    w: 16, rate: function (p) { return p.popCagr5; },                   norm: function (p) { return lin(p.popCagr5, -0.5, 5.0); } },
    { id: 'price',     label: 'Price appreciation',   w: 14, rate: function (p, d) { return d.apprecAnnual(p); },         norm: function (p, d) { return lin(d.apprecAnnual(p), 0, 16); } },
    { id: 'pipeline',  label: 'Pipeline formation',   w: 12, rate: null,                                                 norm: function (p, d) { return logn(d.pipelinePerCap(p), 200, 60000); } },
    { id: 'tourism',   label: 'Visitation growth',    w: 10, rate: function (p) { return p.visitorG; },                   norm: function (p) { return lin(p.visitorG, -1, 10); } },
    { id: 'jobs',      label: 'Employment growth',    w: 8,  rate: function (p) { return p.empCagr5; },                   norm: function (p) { return lin(p.empCagr5, -0.5, 5.0); } }
  ];

  /* Long-run risk composite. Higher = riskier. */
  var RISK_TERMS = [
    { id: 'climate',      label: 'Climate & physical risk', w: 30, fn: function (p) { return p.climIdx; } },
    { id: 'insurance',    label: 'Insurance stress',        w: 22, fn: function (p) { return p.insIdx; } },
    { id: 'regulatory',   label: 'Regulatory burden',       w: 20, fn: function (p) { return p.regIdx; } },
    { id: 'water',        label: 'Water scarcity',          w: 16, fn: function (p) { return 100 - p.waterIdx; } },
    { id: 'concentration',label: 'Economic concentration',  w: 12, fn: function (p) { return inv(Math.log10(Math.max(p.pop, 1000)), 3.6, 6.2); } }
  ];

  /* GC Entry Opportunity Score. */
  var GC_TERMS = [
    { id: 'volume',      label: 'Addressable luxury volume', w: 20,
      why: 'Modelled $2M+ new-build starts, weighted with remodel intensity and ultra-luxury depth. This is the work that actually exists to be won.',
      fn: function (p, d, ind) { return mix(ind['c.luxNewBuild'], 0.50, ind['c.remodel'], 0.30, ind['c.ultraLux'], 0.20); } },
    { id: 'growth',      label: 'Demand growth & pipeline', w: 14,
      why: 'Permit growth blended with the committed development pipeline. A new firm needs the market to be adding capacity demand faster than incumbents add capacity.',
      fn: function (p, d, ind, cat) { return mix(ind['c.permitGrowth'], 0.50, cat.pipeline, 0.50); } },
    { id: 'whitespace',  label: 'Competitive whitespace', w: 16,
      why: 'Annual luxury construction dollars per established luxury GC. High values mean the incumbent bench is thin relative to the money in the market - the clearest structural opening for an entrant.',
      fn: function (p, d) { return logn(d.luxStartsVolumeM(p) / Math.max(p.luxGcCount, 1), 1.5, 60); } },
    { id: 'shortfall',   label: 'Capacity shortfall', w: 14,
      why: 'Contractor backlog combined with permit growth. Long backlogs plus accelerating permits is the signature of a market where clients cannot get a builder.',
      fn: function (p, d, ind) { return mix(lin(p.backlog, 2, 14), 0.55, ind['c.permitGrowth'], 0.45); } },
    { id: 'clients',     label: 'Client wealth & ticket size', w: 12,
      why: 'Wealth density and average project value. Larger average contracts mean fewer client relationships are needed to build a $20M+ revenue book.',
      fn: function (p, d, ind) { return mix(ind['w.density'], 0.35, ind['w.uhnw'], 0.25, logn(d.avgProjectValueM(p), 0.6, 6), 0.40); } },
    { id: 'trades',      label: 'Trade & labour availability', w: 10,
      why: 'Subcontractor depth. The most common hard ceiling on a young GC: without subs you cannot run more than three jobs at once regardless of demand.',
      fn: function (p) { return p.tradeIdx; } },
    { id: 'permitting',  label: 'Permitting friction', w: 8,
      why: 'Days to a residential building permit, inverted. Permit time is carry cost on every job and disproportionately punishes an under-capitalised entrant.',
      fn: function (p) { return inv(p.permitDays, 15, 200); } },
    { id: 'access',      label: 'Relationship barrier', w: 6,
      why: 'How closed the referral network is, inverted. Some of the most profitable markets are also the hardest to be let into - this term prices that in.',
      fn: function (p) { return inv(p.entryBarIdx, 20, 95); } }
  ];

  /* Developer Opportunity Score. */
  var DEV_TERMS = [
    { id: 'land',        label: 'Land availability & runway', w: 18,
      why: 'Developable acreage plus entitled inventory and growth. Without land there is no development business, however strong the demand.',
      fn: function (p, d, ind) { return mix(p.landIdx, 0.60, ind['d.subdivision'], 0.40); } },
    { id: 'entitlement', label: 'Entitlement feasibility', w: 14,
      why: 'Entitlement duration and regulatory burden. Determines carry cost, risk and how much of the value chain a developer can actually capture.',
      fn: function (p, d, ind) { return mix(ind['d.entitlement'], 0.60, inv(p.regIdx, 15, 90), 0.40); } },
    { id: 'demand',      label: 'Growth & wealth demand', w: 16,
      why: 'Demographic momentum plus wealth in-migration. The absorption assumption underneath every lot-sale pro-forma.',
      fn: function (p, d, ind, cat) { return mix(cat.growth, 0.50, ind['w.growth'], 0.28, ind['w.agiInflow'], 0.22); } },
    { id: 'spread',      label: 'Value-creation spread', w: 14,
      why: 'Spec margin plus the ratio of premium lot price to median home value. Measures how much value entitlement and horizontal work actually create here.',
      fn: function (p, d, ind) { return mix(ind['d.specEconomics'], 0.55, logn(p.lotPrice / Math.max(p.medVal, 1), 0.12, 2.2), 0.45); } },
    { id: 'shortage',    label: 'Housing shortage', w: 12,
      why: 'Supply deficit severity - the developer\'s tailwind on absorption, price and political approval.',
      fn: function (p) { return p.shortageIdx; } },
    { id: 'infra',       label: 'Infrastructure & water', w: 10,
      why: 'Water rights, sewer capacity, power and roads. In the West this is the most common reason a good land deal never becomes a project.',
      fn: function (p, d, ind) { return mix(p.waterIdx, 0.50, ind['p.infrastructure'], 0.30, p.roadIdx, 0.20); } },
    { id: 'spececon',    label: 'Spec & subdivision economics', w: 10,
      why: 'Gross spec margin combined with the supply/absorption balance - whether lots can be sold as fast as they are made.',
      fn: function (p, d, ind) { return mix(ind['d.specEconomics'], 0.55, ind['p.absorption'], 0.45); } },
    { id: 'capital',     label: 'Investor & capital demand', w: 6,
      why: 'Depth of local capital, family offices and institutional appetite for resort residential - who buys the project, or funds it.',
      fn: function (p, d, ind, cat) { return mix(p.wealthInfraIdx, 0.50, cat.pipeline, 0.50); } }
  ];

  /* Current Luxury Strength: LEVEL indicators only (no rates of change). */
  var CLS_TERMS = [
    { w: 0.34, ids: ['l.medianValue', 'l.luxPpsf', 'l.tx2m', 'l.tx5m', 'l.tx10m', 'l.lotValue'] },
    { w: 0.34, ids: ['x.reputation', 'x.clubs', 'x.celebrity', 'x.hospitality', 'x.retail', 'x.privacy'] },
    { w: 0.18, ids: ['w.density', 'w.uhnw', 'w.secondHome'] },
    { w: 0.14, ids: ['t.luxLodging', 'c.ultraLux'] }
  ];

  /* Future Luxury Upside: change, capacity and runway. */
  var FLU_TERMS = [
    { w: 0.24, cat: 'pipeline' },
    { w: 0.20, ids: ['w.growth', 'w.agiInflow', 'w.secondHome'] },
    { w: 0.18, cat: 'growth' },
    { w: 0.22, cat: 'land' },
    { w: 0.16, cat: 'future' }
  ];

  /* ======================================================================
   * 5. PROVENANCE
   * Tier weights feed the Data Confidence Score. A market supported by
   * verified filings and named sources must never look as reliable as one
   * carried by analyst estimates.
   * ==================================================================== */

  var TIERS = {
    verified:   { w: 100, label: 'Verified',    desc: 'Published by a primary statistical agency, regulator or SEC filer; cross-checked against a second source.' },
    reported:   { w: 86,  label: 'Reported',    desc: 'Published by a named industry source (MLS/board, brokerage report, tourism authority, planning department) without independent cross-check.' },
    modelled:   { w: 62,  label: 'Modelled',    desc: 'Computed from other fields by a documented transform stated in this file. Not observed.' },
    estimated:  { w: 46,  label: 'Estimated',   desc: 'Analyst estimate calibrated to comparable markets. Directionally reliable, not precise.' },
    rubric:     { w: 52,  label: 'Rubric',      desc: 'Structured qualitative assessment against a written 0-100 scale. Reproducible but judgement-based.' }
  };

  return {
    N: N,
    DERIVED: DERIVED,
    CATEGORIES: CATEGORIES,
    MOMENTUM_TERMS: MOMENTUM_TERMS,
    RISK_TERMS: RISK_TERMS,
    GC_TERMS: GC_TERMS,
    DEV_TERMS: DEV_TERMS,
    CLS_TERMS: CLS_TERMS,
    FLU_TERMS: FLU_TERMS,
    TIERS: TIERS,
    VERSION: '1.0.0',
    AS_OF: '2026-08'
  };
})();
if (typeof module === 'object' && module.exports) module.exports = LCDOS_MODEL;

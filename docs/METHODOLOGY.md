# LCDOS Methodology

**Luxury Construction & Development Opportunity Score, v1.0.0 · data as of 2026-08**

---

## 1. What this model is for

LCDOS ranks U.S. markets by how well they suit a firm that intends to start as a
high-end general contractor and grow into a real estate developer. It is a
**screening and capital-allocation instrument**, not a valuation model. It
answers three questions the application reports separately:

| Question | Score |
| --- | --- |
| Which markets have the strongest combination of all ten factors? | **LCDOS** |
| Where should a new high-end GC start? | **GC Entry Opportunity Score** |
| Where should land be acquired for the next 10–20 years? | **Developer Opportunity Score** |

A market can rank first on LCDOS and fifteenth on GC Entry. Big Sky does exactly
that, and understanding why is the point of separating them.

## 2. Design principle: nothing asserts a score

Every score in this system is **computed** from primitive quantities by an
explicit transform. No market has a score typed into a file. The chain is:

```
70 primitive quantities per market
        ↓  documented transform (src/data/model.js)
70 indicators, each normalised 0–100
        ↓  weights within category
10 categories, each 0–100
        ↓  category weights
LCDOS  +  GC Entry  +  Developer  +  CLS / FLU / Gap  +  Momentum  +  Risk  +  Confidence
```

The application prints the source text of every transform under
**Methodology → Scoring model**, so any number on screen can be traced to the
primitives it consumed, the formula that combined them, and the provenance tier
of each input. That is deliberate: a scoring model an investment committee
cannot audit is worth nothing to an investment committee.

## 3. Normalisation

Four transforms, bounded 0–100 and monotonic:

| Transform | Used for |
| --- | --- |
| `lin(v, lo, hi)` | linear rescale; rates and shares |
| `inv(v, lo, hi)` | inverted linear; variables where less is better (days on market, entitlement months) |
| `logn(v, lo, hi)` | log rescale; variables spanning orders of magnitude (transaction counts, dollar pipelines, jet operations) |
| `band(v, points)` | piecewise linear; variables with an interior optimum (entitled-lot runway: too little is a supply constraint, too much is oversupply) |

Bounds are set from the observed national distribution of each variable so that
roughly the 5th percentile maps near 0 and the 97th near 100.

## 4. The ten weighted categories

| # | Category | Weight | Indicators | What it answers |
| - | --- | ---: | ---: | --- |
| C1 | Construction Opportunity | 20% | 10 | Can a new high-end GC find enough work, at enough margin, against beatable competition? |
| C2 | Future Development Pipeline | 12% | 6 | Where are billions of dollars of future work already forming? |
| C3 | Wealth & HNW Migration | 12% | 7 | Not where the wealthy live — where they are moving. |
| C4 | Luxury Real Estate Market | 12% | 9 | Depth, pricing and liquidity of the existing high end. |
| C5 | Growth & Demographics | 8% | 7 | Is there underlying economic momentum? |
| C6 | Tourism & Destination | 8% | 6 | Can the destination keep importing outside wealth? |
| C7 | Prestige & Exclusivity | 8% | 8 | Where do the wealthy want to be associated with living? |
| C8 | Land & Developer Opportunity | 10% | 8 | Can a contractor here ever become a developer? |
| C9 | Accessibility & Infrastructure | 5% | 5 | How easily can capital physically get there — especially by private aircraft? |
| C10 | Long-Term Future Potential | 5% | 4 | Derived forecasts at 5, 10 and 20 years. |

Weights follow the brief's specified framework exactly. The full indicator list
with weights, rationale and formula is printed in the application.

### Deliberate double-counting

Income growth appears in both C3 (weight 10 within category) and C5 (weight 10).
This is intentional and disclosed: it is simultaneously a wealth-creation signal
and a demographic-momentum signal, and the model treats it as both at a reduced
weight in each rather than forcing a single classification.

## 5. Modelled intermediates

Some quantities are not observed and are derived by stated heuristic. Everywhere
they surface they are labelled **modelled**.

### Luxury starts — the most important derived number

The count of new homes started each year that will be valued above $2M drives
four separate scores. It is estimated **two independent ways** and reconciled by
geometric mean:

```
supply side  =  sfPermits × customShare × share of custom clearing $2M
demand side  =  tx2m × new-construction share of the $2M+ market
luxStarts    =  √(supply × demand)
```

- *Share of custom clearing $2M* is derived from realised pricing. `luxPpsf` is
  the **top-decile** rate, so a representative custom home is taken at 70% of it
  on ~4,000 finished square feet. The share then follows that ratio raised to
  1.6 — a convex taper that reproduces a right-skewed price distribution far
  better than a linear or square-root one, both of which badly overstate the
  tail in mid-priced markets.
- *New-construction share* rises with build intensity: a market permitting 60
  homes per 1,000 households is delivering most of its own high end; one
  permitting 10 is mostly trading existing stock.

Taken alone the supply estimator overstates mid-priced growth markets and the
demand estimator understates markets whose pipeline has not yet closed. **The
ratio between them is itself reported as a data-quality signal** and reduces the
market's Data Confidence Score when the two disagree — an internal consistency
check on the market's own data.

### Spec margin

```
gross spec margin % = 1 − (construction cost ÷ realised $/sf) − (land share of value)
```

Where `luxPpsf` is top-decile realised $/sf on new and recently-built luxury
product, `costPsf` is all-in luxury custom construction cost per square foot,
and `landShare` is finished-lot cost as a share of finished sale price.

Below about 18% spec building does not compensate for the risk; above 30% it is
the fastest path from contractor to developer. The observed range across the
dataset runs from roughly 1% (Aspen, Telluride) to 21% (30A).

## 6. Derived scores

**Current Luxury Strength (CLS)** — level indicators only, no rates of change.
34% luxury market levels, 34% prestige, 18% wealth levels, 14% luxury lodging
and ultra-luxury construction depth.

**Future Luxury Upside (FLU)** — 24% pipeline, 20% wealth-migration change, 18%
growth and demographics, 22% land and developer opportunity, 16% long-term
future potential.

**Opportunity Gap** — `clamp(50 + (FLU − CLS) × 1.15, 0, 100)`. Centred at 50.
Above 50 means demand is forming faster than the market's existing luxury
infrastructure and builder base can serve it.

**Momentum Index** — a rate-of-change composite: permit growth 22%, millionaire
growth 18%, population growth 16%, price appreciation 14%, pipeline formation
12%, visitation growth 10%, employment growth 8%. Also reported as a blended
annual rate of fundamental improvement, which makes "score 74, momentum +19%"
legible.

**GC Entry Opportunity Score** — addressable luxury volume 20%, demand growth
and pipeline 14%, competitive whitespace 16%, capacity shortfall 14%, client
wealth and ticket size 12%, trade availability 10%, permitting friction 8%,
relationship barrier 6%. *Competitive whitespace* is annual luxury construction
dollars per established luxury GC.

**Developer Opportunity Score** — land availability and runway 18%, entitlement
feasibility 14%, growth and wealth demand 16%, value-creation spread 14%,
housing shortage 12%, infrastructure and water 10%, spec and subdivision
economics 10%, investor and capital demand 6%.

**Forecast horizons** —
5-year = 55% momentum + 25% pipeline + 20% structural alignment. Over five
years, what is already funded dominates.
10-year = 35% momentum + 25% land runway + 25% structural + 15% wealth growth.
20-year = 30% structural + 30% land runway + 20% momentum + 20% inverted
long-run risk. Over twenty years, climate, water, insurance and land exhaustion
dominate everything else.

**Long-run risk** — climate and physical risk 30%, insurance stress 22%,
regulatory burden 20%, water scarcity 16%, economic concentration 12% (small
single-industry markets are fragile, scored on inverted log population).

## 7. Score history

The dataset holds **one** observation date. Years before it are reconstructed by
unwinding momentum-implied drift with 0.94 annual damping. Years after it
project that drift forward with 0.87 decay, a saturation term as the score
approaches the practical ceiling, and a land-runway constraint that decelerates
markets running out of developable ground.

**Both are model output, not measurement**, and are labelled as such everywhere
they appear. The historical series in this system is a reconstruction, not a
record. The correct fix is to snapshot the computed scores each quarter going
forward; the reconstruction exists so the trend chart is not empty on day one.

<a name="data-quality"></a>
## 8. Data quality — read this before committing capital

LCDOS v1.0.0 ships with an **analyst-estimated data layer**. That is a
deliberate, disclosed limitation, not an oversight.

- 79 markets × 70 fields = **5,530 input values**
- Median market confidence: **40 / 100** (screening grade)
- Highest market confidence: **61 / 100** (Naples) — analysis grade
- **No market reaches underwriting grade (75+)**

### Confidence bands

| Band | Range | What it supports |
| --- | --- | --- |
| Underwriting-grade | 75–100 | A specific transaction decision |
| Analysis-grade | 55–74 | Building an investment case; verify key inputs before committing |
| Screening-grade | 35–54 | Ranking and shortlisting markets. **Not** underwriting |
| Indicative | 0–34 | Directional only; treat every figure as a hypothesis |

### How confidence is computed

```
0.60 × provenance-weighted tier score
0.22 × externally cited figures (13 points each, capped at 100)
0.18 × source recency
  −  up to 12 points where the two luxury-starts estimators disagree
```

Tier weights: verified 100, reported 86, modelled 62, rubric 52, estimated 46.

### Why the model is still useful at this confidence level

The estimates are **internally consistent and applied uniformly**. Every market
was scored by the same analyst against the same rubrics in the same session, so
the *relative* ordering is far more reliable than any individual figure. That is
exactly what a screening instrument needs to be. It is not what an underwriting
instrument needs to be, and the system says so on every market page.

### Ingest roadmap

The application's **Methodology → Data quality** view lists, field by field, the
public endpoint that should replace each estimate. In priority order:

1. **MLS / brokerage transaction feeds** (`luxPpsf`, `tx2m`, `tx5m`, `tx10m`,
   `dom`, `cashShare`) — these drive four of the ten categories and are the
   single highest-value replacement in the dataset. Requires per-market data
   licences; no national free source exists.
2. **County & municipal planning registers** (`pipelineM`, `entitledLots`,
   `infraM`) — manual per-market collection; no national feed exists.
3. **Census BPS / PEP / ACS / BFS, BLS QCEW, IRS SOI, FAA ATADS, FEMA NRI** —
   all free APIs, all mechanically ingestible, and together they move roughly
   20 fields from *reported* to *verified*.
4. **State contractor licence registries + ABC backlog + RSMeans** for
   `luxGcCount`, `backlog` and `costPsf`.

Rubric fields stay judgement-based by design. What should change is governance:
two independent scorers per market with a documented reconciliation, which
converts a single opinion into a reproducible measurement.

## 9. Simulator models

### Company fit (Expansion Simulator)

Asks a different question from LCDOS: not how good a market is, but whether
*this specific company* — this capital, this headcount, this target project size
— can build the revenue it wants there.

Key mechanics:
- **Band fit** — lognormal overlap between the market's average luxury project
  value and the company's target band midpoint (σ = 0.45).
- **Realistic new-entrant share** — base 4%, adjusted upward where incumbents
  are saturated, downward where the referral network is closed, and capped by
  subcontractor availability. Clamped to 0.5%–18%.
- **Calendar duration** — build duration × (12 ÷ practical build season) +
  permit time. This is why capital need differs market to market for the same
  company and the same job size: a seven-month season stretches a fourteen-month
  build across two years.
- **Working capital** — 11% of live work-in-progress plus nine months of
  fully-loaded overhead at $145k per head.

### Developer pro-forma

An annual cash-flow model with an explicit one-year delivery lag:

```
Year 0   land closes; 60% of horizontal infrastructure; half of soft costs
Year 1   remaining infrastructure and soft costs; first homes START
Year k   homes started in year k−1 DELIVER and settle
```

The delivery lag is the reason a developer needs real equity: a home's
construction cost is spent a full year before its sale proceeds arrive. A model
without that lag reports IRRs several times too high.

Horizontal debt is drawn against land and infrastructure, accrues interest
annually and amortises as lots are released. Vertical construction financing is
drawn at start and repaid out of proceeds on delivery. IRR is solved on the
equity column by bisection.

The **cross-market run** re-prices the identical physical project into every
other market: land by lot-price ratio, construction by cost-per-square-foot
ratio, sale price by luxury $/sf ratio, infrastructure by topographic and water
constraint, and absorption by relative demand index.

## 10. Known limitations

1. **Single observation date.** No true time series. The trend charts are
   reconstruction and projection, labelled as such.
2. **Sub-county markets.** Fourteen markets (30A, Big Sky, Cashiers-Highlands,
   Scottsdale, the Hamptons and others) are sub-county in scope, so their
   Census-derived figures are apportioned. Their provenance tiers are
   automatically downgraded one step and their confidence scores reflect it.
3. **Contractor counts are estimates.** `luxGcCount` drives the competitive
   whitespace and incumbent saturation terms and is not sourced from licence
   registries in v1.0.
4. **Rubric scores are one analyst's judgement.** Reproducible against a written
   scale, but not independently validated.
5. **Absolute-scale credit.** Several indicators (transaction counts,
   hospitality pipeline) are log-scaled absolute figures, which advantages large
   metros. This is deliberate — transaction depth is genuinely a level attribute
   of a luxury market — but it is why the LCDOS top ten mixes big markets with
   fast ones, and why GC Entry and Opportunity Gap are reported separately.
6. **No competitor-firm database.** Contractor landscape sections describe
   market structure and name firms only where verified against a public source.
   A fabricated competitor list would be worse than none.

## 11. Reproducing everything

```bash
node tools/check.js        # model + dataset integrity (must pass before commit)
node tools/build-geo.js    # regenerate projected geography from data/raw/
node tools/build-docs.js   # regenerate TOP-10.md and DATA-DICTIONARY.md
node tools/build.js        # inline everything into dist/
```

The application has no runtime dependencies. It loads plain scripts in
dependency order and runs from the filesystem with zero external requests.

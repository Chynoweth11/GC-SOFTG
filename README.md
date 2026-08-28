# LCDOS Terminal

**A market-intelligence engine for deciding where to deploy construction and real-estate capital in the United States.**

79 markets · 70 indicators · 10 weighted categories · a fully auditable scoring model
· 13 institutional deep dives · zero runtime dependencies

---

## What this is

LCDOS — the **Luxury Construction & Development Opportunity Score** — ranks U.S.
markets by how well they suit a firm that intends to start as a high-end general
contractor and grow into a real estate developer.

It answers three separate questions, and reports them as three separate scores:

| Question | Score | Today's leader |
| --- | --- | --- |
| Which markets have the strongest combination of all ten factors? | **LCDOS** | Big Sky, MT — 71.4 |
| Where should a new high-end GC start? | **GC Entry Opportunity** | Heber Valley, UT — 70.6 |
| Where should land be acquired for the next 10–20 years? | **Developer Opportunity** | Bentonville, AR — 70.9 |

A market can rank first on overall opportunity and fifteenth on entry
opportunity. Big Sky does exactly that. Keeping those questions apart is the
central design decision of the whole system.

**→ [The Top 10 and the full league table](docs/TOP-10.md)**
**→ [Methodology](docs/METHODOLOGY.md)** · **[Data dictionary](docs/DATA-DICTIONARY.md)**

## Running it

```bash
# any static server
python3 -m http.server 8080
# then open http://localhost:8080

# or build a single self-contained file that opens straight from disk
node tools/build.js && open dist/index.html
```

No build step is required for development. No package installs, no bundler, no
framework — the application loads plain scripts in dependency order. There are
**no network requests at all**: the two typefaces (Spectral and IBM Plex Mono) are
inlined as `woff2` data URIs by `tools/build-fonts.js`, and every byte the page
needs ships with it. It runs offline, from a file:// URL, or from any static
host without change.

## Design

The interface is built as a **survey sheet, not a dashboard**. The subject is
land, so the reference is the thing a surveyor actually reads: a quadrangle
sheet. Three rules follow from that, and they are enforced throughout
`src/css/app.css`:

1. **Structure is ruled, not boxed.** There are no cards, no drop shadows and no
   rounded corners in the stylesheet. Sections are bands of the sheet opened by
   a hairline and a marginal label; grid columns are divided by a rule and
   nothing else.
2. **Colour encodes, it never decorates.** The score ramp is a genuine
   hypsometric tint sequence — low ground green, through olive and ochre, to
   high brown — because a score *is* an elevation, and the same ramp tints the
   map. A score in a table is an ink figure with that tint on a 2px rule
   beneath it, never a filled pastel lozenge. Series colours in comparison
   charts come from a separate *categorical* set of muted survey inks, so a
   palette that carries order is never confused with one that doesn't.
3. **Words are serif, figures are mono.** Spectral carries a 54px headline and
   13px body copy from one family; IBM Plex Mono takes every number, column
   header and marginal label. Both ship inlined as `woff2` data URIs.

The full light and dark palettes are defined as tokens at the top of
`src/css/app.css`, and every component draws from them, so neither theme has a
colour whose only definition sits behind a media query.

## The seven modules

| Module | What it does |
| --- | --- |
| **Overview** | The answer surface. The three questions above, each with its leading market and runners-up; the four headline aggregates; the Top 10; the live signal feed; and the data-status panel that states, in plain terms, what the numbers are currently made of. |
| **Map** | Full-screen U.S. map. Nodes encode four dimensions at once: size = annual $2M+ construction volume, fill = the active layer, ring = permit growth, pulse = momentum above 66. Zoom from nation → state → county with real Census boundaries. 37 switchable data layers, and the full filter panel in the same rail. |
| **Rankings** | The full league table with every score, sortable on any column, with one-click presets for each of the three questions above. CSV export. |
| **Analysis** | Three plots under one roof. **Opportunity matrix** — current luxury maturity × future growth. **Supply vs demand** — where luxury construction demand exceeds the contractors serving it, raising Entry Opportunity Alerts. **Emerging radar** — 21 signal rules, each a stated condition on the underlying data, producing a live feed of ~340 signals. |
| **Compare** | 2–10 markets side by side: radar profile, score trajectory, a scored heatmap and 35 rows of underlying data. Six quick-start sets for the comparisons worth running first. |
| **Simulate** | **Expansion** — ranks all 79 markets for a specific company profile (capital, headcount, project size, work mix, revenue target) and names the binding constraint. **Developer** — a full annual-cash-flow pro-forma with IRR, equity multiple, sensitivity grid, and a cross-market run of the identical project in every market. **Scenario** — eleven assumption levers feeding the primitives, not the scores; move one and the whole model re-solves and re-ranks, with before/after deltas. |
| **Method** | The entire model printed: every weight, every formula's source text, every source, the confidence distribution, and the field-by-field ingest roadmap. |

Two further surfaces open contextually from any of the seven, and are routable
but deliberately not in the switcher:

| Surface | What it does |
| --- | --- |
| **Market** | The full intelligence profile: briefing, score build-up, all 70 indicators with formulas, underlying data with provenance tags, development pipeline, history and outlook, data quality. |
| **Investment thesis** | A presentation-quality IC memo generated live from the model: why this market, why now, why construction, why luxury, why development, why us, what could go wrong, what the upside is. Print/PDF ready. |

`⌘K` / `Ctrl+K` opens a command palette over markets, modules and map layers.
Keys `1`–`7` jump between modules. The theme control in the top bar cycles
system → light → dark and remembers the choice.

## Filtering

One filter engine (`src/js/filters.js`) drives the map, the league table, the
analysis plots and the comparison picker, so a filter set carries across the
whole application. It exposes **40 dimensions in six groups**:

| Group | Dimensions |
| --- | --- |
| Geography | region, state, market type, maturity tier |
| Scores | LCDOS, GC entry, developer, opportunity gap, momentum, current luxury, 10-year, 20-year, long-run risk, data confidence |
| Construction & competition | $2M+ starts/yr, established luxury GCs, starts per incumbent, backlog, trade availability, build cost $/sf, difficulty of entry |
| Land & development | land availability, spec margin, entitlement months, land % of value, water headroom, housing shortage |
| Market & wealth | millionaire density and growth, net AGI inflow, luxury $/sf, appreciation, second-home share, population growth, announced pipeline |
| Flags & signals | entry-opportunity alert, emerging-luxury flag, momentum breakout, land-acquisition environment, and any of the 21 signal rules |

Discrete dimensions get **All / None** per item, every group gets its own reset,
and one **Reset all** clears the lot. Selecting every value in a set reads as no
constraint, which is what it is.

## How the scoring works

```
70 primitive quantities per market
        ↓  documented transform
70 indicators, normalised 0–100
        ↓  weights within category
10 categories (Construction 20%, Pipeline 12%, Wealth 12%, Luxury 12%,
   Growth 8%, Tourism 8%, Prestige 8%, Land 10%, Access 5%, Future 5%)
        ↓
LCDOS · GC Entry · Developer · Current Luxury Strength · Future Luxury Upside
· Opportunity Gap · Momentum · Risk · Data Confidence
```

**Nothing in this system asserts a score.** No market has a score typed into a
file — every score is computed, and the application prints the source text of
every transform so any number on screen can be traced back to the primitives it
consumed and the provenance tier of each one.

## Honest limitations

This ships with an **analyst-estimated data layer**, and the system says so on
every market page.

- Median market data confidence: **40 / 100 — screening grade**
- Highest in the universe: **61** (Naples)
- **No market reaches underwriting grade**

The estimates are internally consistent and applied uniformly, which is what a
screening instrument needs: the *relative* ordering is far more reliable than any
individual figure. It is not what an underwriting instrument needs.
[METHODOLOGY.md §8](docs/METHODOLOGY.md#data-quality) sets out the confidence
bands and the field-by-field roadmap for replacing each estimate with a public
endpoint — Census BPS, IRS SOI, BLS QCEW, FAA ATADS, FEMA NRI and the rest.

### How that improves

`node tools/ingest` replaces analyst estimates with retrieved values, field by
field, and raises each field's provenance tier as it goes — so confidence scores
rise on their own as real data arrives. It pulls:

| Source | What it carries |
| --- | --- |
| Census Building Permits Survey | permit counts and permit growth |
| Census ACS 5-year | households, population, income, second-home share, housing stock |
| BLS QCEW | construction establishments and employment — the contractor base |
| IRS SOI county migration | net AGI inflow and high-AGI household movement |
| FEMA National Risk Index | climate and hazard exposure |
| Zillow ZHVI | home-value levels and appreciation |

Each county series is apportioned onto the 79 markets by `tools/ingest/map.js`,
which carries an explicit share and a written basis for every one of the 91
county↔market relationships, and which aggregates *levels* by sum and *rates* by
population weight rather than treating them alike.

**A source that cannot be reached is reported as unreachable.** Nothing is
substituted, interpolated or invented to fill a gap; the manifest records what
was retrieved, when, and what failed, and the Overview prints it. The committed
`src/data/observed.js` is the empty state — no ingest has been run against live
sources in this build, so the analyst layer stands and the application says so.

`.github/workflows/refresh-data.yml` runs the ingest weekly, revalidates the
geography, rebuilds `dist/`, and commits only when something actually changed.

Two further things worth stating plainly:

- **The score history is a reconstruction, not a record.** The dataset holds one
  observation date; earlier years are back-cast from momentum and later years
  projected. Both are labelled as model output everywhere they appear.
- **Contractor landscape write-ups name firms only where verified.** Everywhere
  else they describe market structure — how many firms operate at each tier, who
  controls access to work, how a job is actually won — because a fabricated
  competitor list is worse than no competitor list.

## Repository layout

```
index.html                  application shell (script load order lives here)
src/css/app.css             design system
src/js/albers.js            Albers USA composite projection, shared by build and runtime
src/js/util.js              formatting, colour ramp, DOM helpers
src/js/charts.js            dependency-free SVG charts (radar, scatter, lines, heat, gauge…)
src/js/scoring.js           model evaluation, scenario engine, history, confidence
src/js/store.js             state, derived rankings, 21 signal rules
src/js/map.js               interactive map, 37 layers, drill-down
src/js/filters.js           the shared filter engine — 40 dimensions, 6 groups
src/js/views/*.js           the seven modules and two contextual surfaces
src/data/model.js           THE MODEL — categories, indicators, weights, formulas
src/data/markets.js         provenance framework + source registry
src/data/markets-*.js       the 79-market dataset
src/data/pipeline.js        27 sourced development projects
src/data/profiles*.js       13 institutional deep dives (~20,000 words)
src/data/observed.js        GENERATED by tools/ingest — the observed-data layer
src/data/geo.js             generated: projected state + county boundaries
src/css/fonts.css           GENERATED by tools/build-fonts.js — 7 faces as data URIs
data/raw/                   vendored us-atlas TopoJSON (Census TIGER/Line)
data/reference/             Census FIPS master, county centroids, ingest manifest
tools/build-geo.js          TopoJSON → projected SVG paths
tools/build-fonts.js        Google Fonts → inlined woff2 data URIs
tools/build-docs.js         model → docs/TOP-10.md + docs/DATA-DICTIONARY.md
tools/build.js              inline everything → dist/
tools/check.js              integrity checks — run before every commit
tools/validate-geo.js       every market's counties against the Census FIPS master
tools/ingest/               the refresh pipeline: orchestrator, county→market map,
                            HTTP/CSV/zip helpers, one fetcher per source, self-test
.github/workflows/          weekly scheduled refresh
docs/                       methodology, top-10 report, data dictionary
```

## Checks

```bash
node tools/check.js            # the model and the dataset
node tools/validate-geo.js     # every market against official Census geography
node tools/ingest/selftest.js  # the ingest pipeline against wire-format fixtures
```

`check.js` validates that category and sub-score weights sum to 100, every market
carries every declared field as a finite number, no undeclared fields exist,
every computed score lands in 0–100, county FIPS codes resolve against the
geography, every pipeline project references a real market and carries a source,
and every anchor has a citation and a date.

`validate-geo.js` checks all 79 markets against the Census county FIPS master and
population-weighted county centroids — that each named county exists, belongs to
the state claimed for it, and sits where the map plots it. All 79 validate
cleanly.

`selftest.js` runs each source fetcher against recorded wire-format fixtures, so
the parsing, apportionment and aggregation paths are exercised without network
access.

## Credits

Geographic boundaries from [us-atlas](https://github.com/topojson/us-atlas)
(ISC), derived from U.S. Census Bureau TIGER/Line cartographic boundary files
(public domain). All other sources are listed in the application under
**Methodology → Sources & citations** and in
[DATA-DICTIONARY.md](docs/DATA-DICTIONARY.md).

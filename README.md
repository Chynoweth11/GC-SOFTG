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
framework. The application loads plain scripts in dependency order and makes
**zero external network requests**.

## The ten modules

| Module | What it does |
| --- | --- |
| **Terminal** | Full-screen U.S. map. Nodes encode four dimensions at once: size = annual $2M+ construction volume, fill = the active layer, ring = permit growth, pulse = momentum above 66. Zoom from nation → state → county with real Census boundaries. 37 switchable data layers. |
| **Rankings** | The full league table with every score, sortable on any column, with one-click presets for each of the three questions above. CSV export. |
| **Matrix** | The four-quadrant Opportunity Matrix (current luxury maturity × future growth) and the Construction Supply-vs-Demand plot that raises Entry Opportunity Alerts. |
| **Radar** | The Emerging Market Radar. 21 signal rules, each a stated condition on the underlying data, producing a live alert feed of ~340 signals across the universe. |
| **Compare** | 2–10 markets side by side: radar profile, score trajectory, a scored heatmap and 35 rows of underlying data. |
| **Market** | The full intelligence profile: briefing, score build-up, all 70 indicators with formulas, underlying data with provenance tags, development pipeline, history and outlook, data quality. |
| **Simulators** | **Expansion** — ranks all 79 markets for a specific company profile (capital, headcount, project size, work mix, revenue target) and names the binding constraint. **Developer** — a full annual-cash-flow pro-forma with IRR, equity multiple, sensitivity grid, and a cross-market run of the identical project in every market. |
| **Scenario** | Eleven assumption levers feeding the primitives, not the scores. Move one and the whole model re-solves and re-ranks, with before/after deltas. |
| **IC Mode** | A presentation-quality investment thesis generated live from the model: why this market, why now, why construction, why luxury, why development, why us, what could go wrong, what the upside is. Print/PDF ready. |
| **Methodology** | The entire model printed: every weight, every formula's source text, every source, the confidence distribution, and the field-by-field ingest roadmap. |

`⌘K` / `Ctrl+K` opens a command palette over markets, modules and map layers.
Keys `1`–`9` jump between modules.

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
src/js/views/*.js           the ten modules
src/data/model.js           THE MODEL — categories, indicators, weights, formulas
src/data/markets.js         provenance framework + source registry
src/data/markets-*.js       the 79-market dataset
src/data/pipeline.js        27 sourced development projects
src/data/profiles*.js       13 institutional deep dives (~20,000 words)
src/data/geo.js             generated: projected state + county boundaries
data/raw/                   vendored us-atlas TopoJSON (Census TIGER/Line)
tools/build-geo.js          TopoJSON → projected SVG paths
tools/build-docs.js         model → docs/TOP-10.md + docs/DATA-DICTIONARY.md
tools/build.js              inline everything → dist/
tools/check.js              integrity checks — run before every commit
docs/                       methodology, top-10 report, data dictionary
```

## Checks

```bash
node tools/check.js
```

Validates category and sub-score weights sum to 100, every market carries every
declared field as a finite number, no undeclared fields exist, every computed
score lands in 0–100, county FIPS codes resolve against the geography, every
pipeline project references a real market and carries a source, and every
anchor has a citation and a date.

## Credits

Geographic boundaries from [us-atlas](https://github.com/topojson/us-atlas)
(ISC), derived from U.S. Census Bureau TIGER/Line cartographic boundary files
(public domain). All other sources are listed in the application under
**Methodology → Sources & citations** and in
[DATA-DICTIONARY.md](docs/DATA-DICTIONARY.md).

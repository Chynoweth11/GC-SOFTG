# Data dictionary

Every market carries **70 primitive fields**. Scores are never stored — they are
computed from these by `src/js/scoring.js` against the model in
`src/data/model.js`.

## Provenance tiers

| Tier | Weight | Meaning |
| ---- | -----: | ------- |
| `verified` | 100 | Published by a primary statistical agency, regulator or SEC filer; cross-checked against a second source. |
| `reported` | 86 | Published by a named industry source (MLS/board, brokerage report, tourism authority, planning department) without independent cross-check. |
| `modelled` | 62 | Computed from other fields by a documented transform stated in this file. Not observed. |
| `estimated` | 46 | Analyst estimate calibrated to comparable markets. Directionally reliable, not precise. |
| `rubric` | 52 | Structured qualitative assessment against a written 0-100 scale. Reproducible but judgement-based. |

Markets whose boundary is smaller than a county (`geoScope: 'sub'`) have their
Census-derived fields automatically downgraded one tier, because those figures
are apportioned rather than read directly.

## Fields

| Field | Default tier | Default source | As of |
| ----- | ------------ | -------------- | ----- |
| `pop` | reported (sub: estimated) | U.S. Census Bureau, Population Estimates Program | 2025-07 |
| `hh` | reported (sub: estimated) | U.S. Census Bureau, American Community Survey 5-yr | 2024 |
| `popCagr5` | reported (sub: estimated) | U.S. Census Bureau, Population Estimates Program | 2025-07 |
| `netMig` | reported (sub: estimated) | U.S. Census Bureau, Population Estimates Program | 2025-07 |
| `empCagr5` | reported (sub: estimated) | Bureau of Labor Statistics, QCEW | 2025-Q4 |
| `bizFormIdx` | estimated | U.S. Census Bureau, Business Formation Statistics | 2025 |
| `medInc` | reported (sub: estimated) | U.S. Census Bureau, American Community Survey 5-yr | 2024 |
| `incCagr5` | estimated | U.S. Census Bureau, American Community Survey 5-yr | 2024 |
| `hnwiPer1k` | estimated | LCDOS internal model (documented transform) | 2026-Q2 |
| `hnwiG10` | estimated | Henley & Partners USA Wealth Report 2025 | 2025 |
| `agiIn` | reported (sub: estimated) | IRS Statistics of Income, County-to-County Migration | 2023 |
| `uhnwIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `shShare` | reported (sub: estimated) | U.S. Census Bureau, American Community Survey 5-yr | 2024 |
| `wealthInfraIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `medVal` | reported (sub: estimated) | Zillow Home Value Index / Zillow Research | 2026-06 |
| `luxPpsf` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `apprec5` | reported (sub: estimated) | Zillow Home Value Index / Zillow Research | 2026-06 |
| `dom` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `cashShare` | estimated | Redfin Data Center | 2026-Q1 |
| `tx2m` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `tx5m` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `tx10m` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `lotPrice` | estimated | Local MLS / REALTOR association statistics (composite) | 2026-Q2 |
| `landShare` | modelled | LCDOS internal model (documented transform) | 2026-Q2 |
| `sfPermits` | reported (sub: estimated) | U.S. Census Bureau, Building Permits Survey | 2025 |
| `permitCagr3` | reported (sub: estimated) | U.S. Census Bureau, Building Permits Survey | 2025 |
| `customShare` | estimated | LCDOS internal model (documented transform) | 2026 |
| `remodelIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `costPsf` | estimated | Construction & real estate trade press | 2026-Q2 |
| `gcMargin` | estimated | Construction & real estate trade press | 2026 |
| `luxGcCount` | estimated | LCDOS internal model (documented transform) | 2026-Q2 |
| `tradeIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `backlog` | estimated | Associated Builders & Contractors, Construction Backlog Indicator | 2026-Q2 |
| `buildMonths` | estimated | LCDOS internal model (documented transform) | 2026 |
| `pipelineM` | estimated | County & municipal planning departments, development applications | 2026-Q2 |
| `commercialM` | estimated | County & municipal planning departments, development applications | 2026-Q2 |
| `infraM` | estimated | County & municipal planning departments, development applications | 2026-Q2 |
| `entitledLots` | estimated | County & municipal planning departments, development applications | 2026-Q2 |
| `landIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `entMonths` | estimated | County & municipal planning departments, development applications | 2026 |
| `permitDays` | estimated | County & municipal planning departments, development applications | 2026 |
| `waterIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `topoIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `shortageIdx` | modelled | LCDOS internal model (documented transform) | 2026-Q2 |
| `visitorsM` | reported | State & local destination marketing organisations | 2025 |
| `visitorG` | estimated | State & local destination marketing organisations | 2025 |
| `visitSpendM` | reported | State & local destination marketing organisations | 2025 |
| `luxRooms` | estimated | Lodging performance composite (STR-style metrics, reconstructed) | 2026-Q2 |
| `adr` | estimated | Lodging performance composite (STR-style metrics, reconstructed) | 2026-Q1 |
| `occ` | estimated | Lodging performance composite (STR-style metrics, reconstructed) | 2025 |
| `seasonIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `repIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `clubIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `celebIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `hospIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `retailIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `schoolIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `privacyIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `entryBarIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `jetOps` | reported | FAA Air Traffic Activity System (ATADS) / TFMSC | 2025 |
| `nonstops` | verified | Published airline schedules / airport authority | 2026-06 |
| `metroMin` | verified | LCDOS internal model (documented transform) | 2026 |
| `roadIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `airInvestM` | reported | Airport authority capital improvement programmes | 2026 |
| `propTax` | reported | Tax Foundation, state & local tax data | 2025 |
| `incomeTax` | verified | Tax Foundation, state & local tax data | 2026 |
| `insIdx` | estimated | LCDOS internal model (documented transform) | 2026-Q2 |
| `regIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |
| `climIdx` | estimated | FEMA National Risk Index | 2025 |
| `structIdx` | rubric | LCDOS analyst rubric (written 0-100 scale) | 2026-08 |

## Provenance mix across the dataset

| Tier | Fields | Share |
| ---- | -----: | ----: |
| Verified | 237 | 4.3% |
| Reported | 1,190 | 21.5% |
| Modelled | 158 | 2.9% |
| Estimated | 2,444 | 44.2% |
| Rubric | 1,501 | 27.1% |
| **Total** | **5,530** | |

## Externally verified figures

46 figures were checked against a named public source during research and
are stored with a citation and a date. They are what lift a market's Data
Confidence Score above the floor. Markets carrying them:

| Market | Cited figures | Confidence |
| ------ | ------------: | ---------: |
| Heber Valley & Wasatch Back, UT | 5 | 59 |
| Bentonville & Northwest Arkansas, AR | 5 | 55 |
| Naples & Collier County, FL | 4 | 61 |
| Franklin & Williamson County, TN | 4 | 60 |
| 30A & South Walton, FL | 3 | 53 |
| Cashiers & the Highlands Plateau, NC | 3 | 49 |
| Greenville & the Upstate, SC | 3 | 50 |
| Coeur d'Alene & North Idaho, ID | 3 | 49 |
| Ogden Valley & Powder Mountain, UT | 2 | 45 |
| Bozeman & the Gallatin Valley, MT | 2 | 52 |
| Truckee & North Lake Tahoe, CA | 2 | 50 |
| St. George & Greater Zion, UT | 2 | 48 |
| Bend & Central Oregon, OR | 2 | 49 |
| Palm Beach, Jupiter Island & Wellington, FL | 1 | 48 |
| Scottsdale & Paradise Valley, AZ | 1 | 46 |
| Park City & Snyderville Basin, UT | 1 | 53 |
| Miami, Coral Gables & Key Biscayne, FL | 1 | 47 |
| Austin & the Hill Country, TX | 1 | 42 |
| Whitefish & the Flathead Valley, MT | 1 | 44 |

60 of 79 markets carry **no** externally verified figure. Every number in
those profiles is either a reported statistic at its default tier or an analyst
estimate, and their confidence scores reflect that.

## Named development projects

27 projects across 11 markets, each with a source. Where a market's
aggregate pipeline estimate exceeds the sum of its named projects, the
Development Intelligence view states the un-itemised difference explicitly
rather than inventing projects to close the gap.

---
*Generated by `node tools/build-docs.js`. Do not edit by hand.*

# Sources

The application lists every source and every externally verified figure under
**Methodology → Sources & citations**. This file is the static index.

## Primary statistical agencies

| Key | Source | Used for |
| --- | --- | --- |
| `census_pep` | [Census Population Estimates Program](https://www.census.gov/programs-surveys/popest.html) | population, growth, net migration |
| `census_acs` | [Census American Community Survey 5-yr](https://www.census.gov/programs-surveys/acs) | households, income, seasonal housing share |
| `census_bps` | [Census Building Permits Survey](https://www.census.gov/construction/bps/) | single-family permits, permit growth |
| `census_nrc` | [Census New Residential Construction](https://www.census.gov/construction/nrc/) | national construction context |
| `census_bfs` | [Census Business Formation Statistics](https://www.census.gov/econ/bfs/) | business formation index |
| `bls_qcew` | [BLS Quarterly Census of Employment and Wages](https://www.bls.gov/cew/) | employment growth |
| `bea_regional` | [BEA Regional Accounts](https://www.bea.gov/data/economic-accounts/regional) | regional income context |
| `irs_soi` | [IRS SOI County-to-County Migration](https://www.irs.gov/statistics/soi-tax-stats-migration-data) | net AGI inflow per return |
| `faa_atads` | [FAA ATADS / TFMSC](https://aspm.faa.gov/) | general-aviation jet operations |
| `faa_carrier` | [BTS TranStats](https://www.transtats.bts.gov/) | nonstop destinations |
| `fema_nri` | [FEMA National Risk Index](https://hazards.fema.gov/nri/) | physical climate risk |
| `sec_filings` | [SEC EDGAR](https://www.sec.gov/edgar) | The St. Joe Company (NYSE: JOE) disclosures |

## Research and market

| Key | Source |
| --- | --- |
| `henley_usa` | [Henley & Partners, USA Wealth Report 2025](https://www.henleyglobal.com/publications/usa-wealth-report-2025) |
| `tax_foundation` | [Tax Foundation](https://taxfoundation.org/) — state and local tax data |
| `zillow_zhvi` | [Zillow Research](https://www.zillow.com/research/data/) — Home Value Index |
| `redfin` | [Redfin Data Center](https://www.redfin.com/news/data-center/) |
| `abc_backlog` | [ABC Construction Backlog Indicator](https://www.abc.org/News-Media/News-Releases) |
| `mls_composite` | Local MLS / REALTOR association statistics (composite) |
| `str_composite` | Lodging performance composite (STR-style metrics, reconstructed) |
| `tourism_office` | State & local destination marketing organisations |
| `planning_dept` | County & municipal planning departments |
| `airport_cip` | Airport authority capital improvement programmes |

## Geographic boundaries

[us-atlas](https://github.com/topojson/us-atlas) at 1:10,000,000, ISC licensed,
derived from U.S. Census Bureau TIGER/Line cartographic boundary files (public
domain). Vendored in `data/raw/` so `tools/build-geo.js` reproduces offline.

## Externally verified figures

Every figure checked against a named public source during research is stored in
the dataset with its citation, date and URL, and is listed in
[DATA-DICTIONARY.md](DATA-DICTIONARY.md#externally-verified-figures) and in the
application. Markets carrying the most: Heber Valley (5), Bentonville (5),
Franklin (4), Naples (4), 30A (3), Cashiers-Highlands (3), Coeur d'Alene (3),
Greenville (3).

## What is *not* sourced

Roughly 60% of the 5,530 input values are analyst estimates or structured
rubrics. They are tagged as such throughout the application and they carry a
lower weight in the Data Confidence Score. See
[METHODOLOGY.md §8](METHODOLOGY.md#data-quality).

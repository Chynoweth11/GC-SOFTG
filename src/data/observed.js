/* ============================================================================
 * src/data/observed.js — the observed-data layer.
 *
 * This file is GENERATED. `node tools/ingest` fetches Census BPS and ACS, BLS
 * QCEW, IRS SOI migration, FEMA NRI and Zillow ZHVI, apportions each county
 * series onto the 79 LCDOS markets, and rewrites this file with the values it
 * actually retrieved plus the provenance tier and as-of date of each one.
 *
 * Committed here is the empty state: no ingest has been run against live
 * sources in this build, so every primitive is carried by the analyst layer and
 * the application says so on the Overview and on every market page. Nothing is
 * substituted for data that was not retrieved.
 * ==========================================================================*/
var LCDOS_OBSERVED = { manifest: null, markets: {} };
if (typeof module === 'object' && module.exports) module.exports = LCDOS_OBSERVED;

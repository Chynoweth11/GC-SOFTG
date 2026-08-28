/* ============================================================================
 * pipeline.js — Named development projects.
 * ----------------------------------------------------------------------------
 * ONLY projects that were verified against a named public source during
 * research, or that are matters of established public record, appear here.
 * Where a market's aggregate pipeline figure in markets.js is larger than the
 * sum of its named projects, the difference is un-itemised: the Development
 * Intelligence module states that explicitly rather than inventing projects to
 * close the gap.
 *
 * status:  construction | approved | proposed | planning | complete
 * conf:    verified | reported | estimated   (of the VALUE figure specifically)
 * ==========================================================================*/
var LCDOS_PIPELINE = (function () {
  'use strict';

  var P = [];
  function add(o) { P.push(o); return o; }

  /* ---- Heber Valley / Wasatch Back ------------------------------------- */
  add({ market: 'heber-wasatch', name: 'Deer Valley East Village', developer: 'Extell Development / Alterra Mountain Co.',
    type: 'Resort village & residential', valueM: 5000, status: 'construction', conf: 'reported',
    units: 6000, start: 2024, complete: 2035, lat: 40.560, lon: -111.400,
    note: 'Disclosed $5B programme. 800+ hotel rooms, ~1,700 private residences, 250,000 sf retail and 68,000 sf recreation in the first phases; 6,000+ residential units and hotel rooms at full buildout.',
    src: 'Utah Business / Extell', url: 'https://extell.com/portfolio/deer-valley-east-village' });
  add({ market: 'heber-wasatch', name: 'Four Seasons Resort & Residences, Deer Valley East', developer: 'Extell Development',
    type: 'Luxury hotel & branded residences', valueM: 600, status: 'construction', conf: 'estimated',
    units: 0, start: 2025, complete: 2028, lat: 40.559, lon: -111.398,
    note: 'Under construction with a late-2028 opening announced.', src: 'Deer Valley Expanded Excellence', url: 'https://expandedexcellence.deervalley.com/' });
  add({ market: 'heber-wasatch', name: 'Waldorf Astoria, Deer Valley East', developer: 'Extell Development',
    type: 'Luxury hotel & branded residences', valueM: 520, status: 'construction', conf: 'estimated',
    units: 0, start: 2025, complete: 2028, lat: 40.561, lon: -111.401,
    note: 'Under construction with a late-2028 opening announced.', src: 'Forbes / Deer Valley', url: 'https://www.forbes.com/sites/everettpotter/2025/02/15/expanded-elegance-deer-valley-resort-will-more-than-double-in-size/' });
  add({ market: 'heber-wasatch', name: 'Canopy by Hilton, Deer Valley East Village', developer: 'Extell Development',
    type: 'Hotel', valueM: 140, status: 'construction', conf: 'estimated',
    units: 0, start: 2024, complete: 2026, lat: 40.558, lon: -111.404,
    note: 'Scheduled to open August 2026 — the first hotel keys delivered in the East Village.', src: 'Utah Business', url: 'https://www.utahbusiness.com/industry/2025/11/04/deer-valley-east-village-ski-season-tourism-park-city-utah/' });
  add({ market: 'heber-wasatch', name: 'Deer Valley terrain expansion', developer: 'Alterra Mountain Company',
    type: 'Ski infrastructure', valueM: 250, status: 'construction', conf: 'estimated',
    units: 0, start: 2023, complete: 2027, lat: 40.590, lon: -111.430,
    note: '3,700+ acres of new terrain, 16 new lifts including a 10-passenger gondola, 80 new runs — more than doubling skiable acreage.',
    src: 'ENR', url: 'https://www.enr.com/articles/61636-utahs-deer-valley-resort-doubles-skiable-acreage-fulfilling-longtime-vision' });

  /* ---- Ogden Valley ----------------------------------------------------- */
  add({ market: 'ogden-valley', name: 'Powder Haven expansion', developer: 'Reed Hastings / Powder Mountain',
    type: 'Private ski club & residential', valueM: 157, status: 'construction', conf: 'reported',
    units: 73, start: 2025, complete: 2028, lat: 41.379, lon: -111.780,
    note: 'Two new chairlifts for the 2026-27 season taking the private network to six lifts over 3,300+ acres, plus a large clubhouse. First 39 lots sold before roads were paved; next release is 34 lots of 2-5 acres, ski-in/ski-out averaging ~$4M.',
    src: 'SnowBrains / KPCW', url: 'https://snowbrains.com/powder-mountain-private-area-expansion/' });

  /* ---- Bozeman ---------------------------------------------------------- */
  add({ market: 'bozeman', name: 'Bozeman Yellowstone International Airport expansion', developer: 'Gallatin Airport Authority',
    type: 'Aviation infrastructure', valueM: 180, status: 'construction', conf: 'reported',
    units: 0, start: 2024, complete: 2029, lat: 45.777, lon: -111.153,
    note: 'Terminal and airfield programme announced explicitly on the strength of sustained private-aviation growth.',
    src: 'NBC Montana', url: 'https://nbcmontana.com/news/local/bozeman-airport-sees-increase-in-private-jet-usage-brings-boost-to-local-economy' });

  /* ---- 30A / South Walton ----------------------------------------------- */
  add({ market: '30a-walton', name: 'Watersound West Bay Center', developer: 'The St. Joe Company (NYSE: JOE)',
    type: 'Mixed-use commercial', valueM: 420, status: 'construction', conf: 'estimated',
    units: 0, start: 2024, complete: 2032, lat: 30.397, lon: -85.983,
    note: 'Planned for approximately 500,000 sf of commercial space. A standalone 18,000 sf multi-tenant building reached occupancy in early 2026; a Publix-anchored phase has commenced.',
    src: 'St. Joe / BusinessWire', url: 'https://secure.businesswire.com/news/home/20251210569938/en/The-St.-Joe-Company-Announces-Commencement-of-Development-of-the-Publix-Super-Market-at-Watersound-West-Bay-Center' });
  add({ market: '30a-walton', name: 'Watersound Town Center', developer: 'The St. Joe Company (NYSE: JOE)',
    type: 'Lifestyle retail centre', valueM: 180, status: 'construction', conf: 'estimated',
    units: 0, start: 2021, complete: 2028, lat: 30.278, lon: -86.001,
    note: 'Open-air lifestyle centre at the entrance to Watersound Origins, adding national tenants through 2025-26.',
    src: 'St. Joe', url: 'https://watersound.com/watersound-stories/watersound-town-center-announces-another-national-retailer/' });
  add({ market: '30a-walton', name: 'Latitude Margaritaville Watersound', developer: 'The St. Joe Company / Minto',
    type: 'Master-planned community', valueM: 1600, status: 'construction', conf: 'estimated',
    units: 3500, start: 2021, complete: 2031, lat: 30.352, lon: -85.937,
    note: '2,170 homes completed since sales opened in 2021 against a Phase 1 plan of 3,500.',
    src: 'St. Joe investor materials', url: 'https://ir.joe.com/news-releases' });
  add({ market: '30a-walton', name: 'Watersound Camp Creek', developer: 'The St. Joe Company (NYSE: JOE)',
    type: 'Gated custom-home community', valueM: 320, status: 'construction', conf: 'estimated',
    units: 320, start: 2021, complete: 2029, lat: 30.312, lon: -86.010,
    note: 'Gated community of custom homesites from roughly a quarter-acre to just under an acre.',
    src: 'St. Joe', url: 'https://ir.joe.com/news-releases/news-release-details/st-joe-company-announces-commencement-development-watersound' });

  /* ---- Bentonville / NWA ------------------------------------------------ */
  add({ market: 'bentonville', name: 'Walmart Home Office campus', developer: 'Walmart Inc.',
    type: 'Corporate campus', valueM: 1500, status: 'complete', conf: 'estimated',
    units: 0, start: 2019, complete: 2025, lat: 36.352, lon: -94.190,
    note: 'A 350-400 acre home office campus opened January 2025 — the anchor of the regional relocation wave.',
    src: 'Talk Business & Politics', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' });
  add({ market: 'bentonville', name: 'Alice L. Walton School of Medicine & Heartland Whole Health Institute', developer: 'Walton family philanthropies',
    type: 'Medical & education campus', valueM: 800, status: 'complete', conf: 'estimated',
    units: 0, start: 2021, complete: 2025, lat: 36.381, lon: -94.201,
    note: 'Opened 2025 on the 134-acre Bentonville campus shared with Crystal Bridges.',
    src: 'Talk Business & Politics', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' });
  add({ market: 'bentonville', name: 'Crystal Bridges Museum expansion', developer: 'Crystal Bridges / Walton Family Foundation',
    type: 'Cultural', valueM: 200, status: 'construction', conf: 'estimated',
    units: 0, start: 2023, complete: 2026, lat: 36.383, lon: -94.201,
    note: '114,000 sf expansion of the museum.', src: 'Talk Business & Politics', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' });
  add({ market: 'bentonville', name: 'Downtown Bentonville 300-unit multifamily', developer: 'Private',
    type: 'Multifamily', valueM: 42.3, status: 'construction', conf: 'verified',
    units: 300, start: 2025, complete: 2027, lat: 36.372, lon: -94.208,
    note: 'A $42.26 million building permit was issued for a five-storey, 300-unit complex serving the medical school and the wider community.',
    src: 'Talk Business & Politics', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' });

  /* ---- Greenville ------------------------------------------------------- */
  add({ market: 'greenville-sc', name: 'County Square redevelopment', developer: 'RocaPoint Partners',
    type: 'Mixed-use district', valueM: 1000, status: 'construction', conf: 'reported',
    units: 28, start: 2023, complete: 2032, lat: 34.837, lon: -82.399,
    note: 'A $1 billion redevelopment across more than 40 acres — one of the largest projects in Greenville history. 28 luxury townhomes confirmed on the site in October 2025.',
    src: 'Greenville development reporting', url: 'https://www.livingingreenvillesc.com/blog/greenville-2026-new-developments' });
  add({ market: 'greenville-sc', name: 'Isuzu North America manufacturing plant', developer: 'Isuzu North America Corporation',
    type: 'Industrial', valueM: 280, status: 'construction', conf: 'reported',
    units: 0, start: 2025, complete: 2027, lat: 34.767, lon: -82.383,
    note: '$280 million plant creating 700+ jobs in a 1 million sf facility on 200+ acres on Augusta Road.',
    src: 'Upstate SC construction reporting', url: 'https://www.yahoo.com/news/articles/five-2026-key-upstate-sc-100953470.html' });
  add({ market: 'greenville-sc', name: 'Bolden Street District', developer: 'Private',
    type: 'Mixed-use district', valueM: 450, status: 'approved', conf: 'estimated',
    units: 0, start: 2026, complete: 2032, lat: 34.828, lon: -82.363,
    note: 'Site work on the 90-acre Laurens Road development begins mid-2026.',
    src: 'Greenville development reporting', url: 'https://www.livingingreenvillesc.com/blog/greenville-2026-new-projects' });

  /* ---- Franklin / Williamson -------------------------------------------- */
  add({ market: 'franklin-tn', name: 'The Margin District', developer: 'Private',
    type: 'Mixed-use with luxury residences', valueM: 165, status: 'construction', conf: 'reported',
    units: 25, start: 2025, complete: 2028, lat: 35.921, lon: -86.869,
    note: '$165M mixed-use scheme one block south of Five Points including retail, executive office and 25 luxury residences starting just above $2M.',
    src: 'Franklin development reporting', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' });
  add({ market: 'franklin-tn', name: 'Wyelea', developer: 'Private',
    type: 'Estate-lot community', valueM: 340, status: 'approved', conf: 'estimated',
    units: 68, start: 2026, complete: 2031, lat: 35.949, lon: -86.926,
    note: '68 estate homesites across nearly 600 acres off Del Rio Pike.',
    src: 'Franklin development reporting', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' });
  add({ market: 'franklin-tn', name: 'Franklin Ridge', developer: 'Toll Brothers',
    type: 'Luxury single-family community', valueM: 60, status: 'construction', conf: 'estimated',
    units: 34, start: 2026, complete: 2029, lat: 35.898, lon: -86.858,
    note: '34 luxury single-family homes near I-65.', src: 'Franklin development reporting', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' });
  add({ market: 'franklin-tn', name: 'In-N-Out Burger Eastern Territory HQ', developer: 'In-N-Out Burger',
    type: 'Corporate campus', valueM: 130, status: 'construction', conf: 'estimated',
    units: 0, start: 2024, complete: 2026, lat: 35.867, lon: -86.855,
    note: 'Approximately 100,000 sf campus adjacent to Berry Farms off I-65, targeted for completion in late 2026.',
    src: 'Franklin development reporting', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' });

  /* ---- Truckee / Tahoe --------------------------------------------------- */
  add({ market: 'truckee-tahoe', name: 'Palisades Tahoe Village expansion', developer: 'Alterra Mountain Company',
    type: 'Resort village', valueM: 1000, status: 'approved', conf: 'estimated',
    units: 850, start: 2026, complete: 2050, lat: 39.197, lon: -120.235,
    note: 'A 25-year Village expansion plan was finalised in July 2025; the Base-to-Base Gondola continues to support pricing on both sides of the resort.',
    src: 'Truckee-North Tahoe market reporting', url: 'https://chrisfajkosrealestate.com/real-estate-blog/2025-truckee-tahoe-mid-year-market-update/' });
  add({ market: 'truckee-tahoe', name: 'Former Mourelatos Lakeshore Resort acquisition', developer: 'Martis Camp Club',
    type: 'Private club lakefront amenity', valueM: 60, status: 'planning', conf: 'estimated',
    units: 0, start: 2026, complete: 2029, lat: 39.239, lon: -120.055,
    note: 'A 3.2-acre lakefront parcel with a 32-unit hotel, a four-bedroom residence and 275 feet of Lake Tahoe shoreline, acquired for private member use.',
    src: 'SFGATE', url: 'https://www.sfgate.com/renotahoe/article/martis-camp-buys-lake-tahoe-resort-21197298.php' });

  /* ---- St. George -------------------------------------------------------- */
  add({ market: 'st-george', name: 'Black Desert Resort & Desert Color', developer: 'Reef Capital Partners / Shivwits Band partnership',
    type: 'Resort, golf & master-planned community', valueM: 2000, status: 'construction', conf: 'estimated',
    units: 12000, start: 2019, complete: 2040, lat: 37.157, lon: -113.617,
    note: 'Master-planned resort community anchored by the Black Desert golf resort, developed in partnership with the Shivwits Band of Paiutes.',
    src: 'Black Desert Resort / CoralTree Hospitality', url: 'https://www.blackdesertresort.com/' });

  /* ---- Naples ------------------------------------------------------------ */
  add({ market: 'naples', name: 'Four Seasons & Rosewood branded residences', developer: 'Multiple',
    type: 'Branded luxury condominium', valueM: 1400, status: 'construction', conf: 'estimated',
    units: 260, start: 2023, complete: 2026, lat: 26.130, lon: -81.807,
    note: 'Closings from the Rosewood and Four Seasons condominium projects are expected later in 2026, which local brokerage expects to make 2026 one of the biggest years Naples has had since 2021-22.',
    src: 'The Real Deal', url: 'https://therealdeal.com/magazine/may-2026/inside-naples-ultra-luxury-shift/' });

  /* ---- Asheville --------------------------------------------------------- */
  add({ market: 'asheville', name: 'Asheville Regional Airport expansion', developer: 'Greater Asheville Regional Airport Authority',
    type: 'Aviation infrastructure', valueM: 400, status: 'construction', conf: 'estimated',
    units: 0, start: 2022, complete: 2028, lat: 35.436, lon: -82.542,
    note: 'Terminal replacement and airfield programme running through the late 2020s.', src: 'Airport authority capital programme', url: null });

  /* ------------------------------------------------------------------------ */

  /* Index by market for fast lookup. */
  var BY_MARKET = {};
  P.forEach(function (x) { (BY_MARKET[x.market] = BY_MARKET[x.market] || []).push(x); });

  return { PROJECTS: P, BY_MARKET: BY_MARKET };
})();
if (typeof module === 'object' && module.exports) module.exports = LCDOS_PIPELINE;

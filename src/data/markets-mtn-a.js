/* Market dataset — Mountain West A: Utah, Montana, Wyoming, Idaho.
 * See markets.js for the provenance contract governing every field here. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'heber-wasatch', name: 'Heber Valley & Wasatch Back', state: 'UT', stateFips: '49',
    county: 'Wasatch County', countyFips: '49051', lat: 40.507, lon: -111.413,
    region: 'Mountain West', archetype: 'ski', tier: 'emerging', geoScope: 'county',
    blurb: 'The single largest new alpine development programme in North America is being built on the cheap side of a mountain range from Park City, in a county whose builder base was sized for a farming town.',
    p: {
      pop: 44000, hh: 13800, popCagr5: 5.2, netMig: 34, empCagr5: 4.6, bizFormIdx: 76, medInc: 106000, incCagr5: 5.2,
      hnwiPer1k: 88, hnwiG10: 175, agiIn: 41000, uhnwIdx: 74, shShare: 33, wealthInfraIdx: 52,
      medVal: 1120000, luxPpsf: 980, apprec5: 78, dom: 68, cashShare: 42, tx2m: 240, tx5m: 38, tx10m: 8, lotPrice: 1300000, landShare: 21,
      sfPermits: 1250, permitCagr3: 12.0, customShare: 34, remodelIdx: 50, costPsf: 620, gcMargin: 17, luxGcCount: 24, tradeIdx: 56, backlog: 9.5, buildMonths: 8,
      pipelineM: 7200, commercialM: 1900, infraM: 620, entitledLots: 11500, landIdx: 72, entMonths: 15, permitDays: 48, waterIdx: 46, topoIdx: 50, shortageIdx: 78,
      visitorsM: 3.4, visitorG: 8.5, visitSpendM: 690, luxRooms: 900, adr: 880, occ: 56, seasonIdx: 62,
      repIdx: 58, clubIdx: 76, celebIdx: 55, hospIdx: 64, retailIdx: 42, schoolIdx: 44, privacyIdx: 68, entryBarIdx: 44,
      jetOps: 34, nonstops: 0, metroMin: 40, roadIdx: 68, airInvestM: 95,
      propTax: 0.52, incomeTax: 4.55, insIdx: 26, regIdx: 34, climIdx: 30, structIdx: 90
    },
    prov: {
      pipelineM: { tier: 'reported', src: 'developer_pr', asOf: '2025-11', note: 'Anchored on the disclosed $5B Deer Valley East Village programme plus county-level applications.' }
    },
    anchors: [
      { fact: 'Deer Valley East Village, developed by Extell with Alterra, is a disclosed $5 billion programme in Wasatch County.', src: 'Utah Business / Extell Development', date: '2025-11', url: 'https://www.utahbusiness.com/industry/2025/11/04/deer-valley-east-village-ski-season-tourism-park-city-utah/' },
      { fact: 'At full buildout East Village is planned for more than 6,000 residential units and hotel rooms, ~800 hotel rooms and ~1,700 private residences in the first phases, plus 250,000 sf of retail.', src: 'Extell Development / Deer Valley', date: '2025-02', url: 'https://extell.com/portfolio/deer-valley-east-village' },
      { fact: 'Four Seasons and Waldorf Astoria are under construction with late-2028 openings; Canopy by Hilton opens August 2026.', src: 'Deer Valley "Expanded Excellence" / Forbes', date: '2025-02', url: 'https://www.forbes.com/sites/everettpotter/2025/02/15/expanded-elegance-deer-valley-resort-will-more-than-double-in-size/' },
      { fact: 'The expansion more than doubles Deer Valley skiable terrain, adding 3,700+ acres, 16 lifts and 80 runs, with Heber Valley, Hideout and Kamas now minutes from a base area.', src: 'ENR / TownLift', date: '2025-07', url: 'https://www.enr.com/articles/61636-utahs-deer-valley-resort-doubles-skiable-acreage-fulfilling-longtime-vision' },
      { fact: 'Heber Valley real estate is appreciating faster than both Park City and Salt Lake City.', src: 'Go Heber Valley newsroom', date: '2025', url: 'https://www.gohebervalley.com/newsroom-deer-valley-east-village-new-alpine-destination/' }
    ]
  });

  M({
    id: 'park-city', name: 'Park City & Snyderville Basin', state: 'UT', stateFips: '49',
    county: 'Summit County', countyFips: '49043', lat: 40.646, lon: -111.498,
    region: 'Mountain West', archetype: 'ski', tier: 'established', geoScope: 'county',
    blurb: 'A fully-formed billion-dollar luxury construction market with a deep incumbent builder bench and almost no developable land left inside the basin.',
    p: {
      pop: 43000, hh: 15500, popCagr5: 1.6, netMig: 9, empCagr5: 2.2, bizFormIdx: 63, medInc: 128000, incCagr5: 4.2,
      hnwiPer1k: 215, hnwiG10: 105, agiIn: 62000, uhnwIdx: 84, shShare: 48, wealthInfraIdx: 66,
      medVal: 1650000, luxPpsf: 1350, apprec5: 62, dom: 88, cashShare: 52, tx2m: 520, tx5m: 105, tx10m: 24, lotPrice: 2400000, landShare: 30,
      sfPermits: 380, permitCagr3: 1.5, customShare: 50, remodelIdx: 74, costPsf: 800, gcMargin: 16, luxGcCount: 58, tradeIdx: 44, backlog: 10.5, buildMonths: 8,
      pipelineM: 3400, commercialM: 900, infraM: 280, entitledLots: 2600, landIdx: 34, entMonths: 24, permitDays: 85, waterIdx: 42, topoIdx: 66, shortageIdx: 74,
      visitorsM: 5.6, visitorG: 2.5, visitSpendM: 1450, luxRooms: 3400, adr: 1050, occ: 58, seasonIdx: 68,
      repIdx: 86, clubIdx: 84, celebIdx: 82, hospIdx: 84, retailIdx: 66, schoolIdx: 56, privacyIdx: 62, entryBarIdx: 68,
      jetOps: 30, nonstops: 0, metroMin: 35, roadIdx: 74, airInvestM: 60,
      propTax: 0.55, incomeTax: 4.55, insIdx: 28, regIdx: 52, climIdx: 30, structIdx: 78
    },
    anchors: [
      { fact: 'Park City custom construction runs $625-$1,500+/sf, with Deer Valley, The Colony and Promontory routinely above $1,000/sf.', src: 'Park City builder cost surveys (R.M. Koemans, Real Estate in Park City)', date: '2026-01', url: 'https://www.realestateinparkcity.com/blog/real-estate-information-on-building-in-the-park-city-utah-area-newly-built-homes-and-lots-for-sale.html' }
    ]
  });

  M({
    id: 'ogden-valley', name: 'Ogden Valley & Powder Mountain', state: 'UT', stateFips: '49',
    county: 'Weber County', countyFips: '49057', lat: 41.298, lon: -111.777,
    region: 'Mountain West', archetype: 'ski', tier: 'frontier', geoScope: 'sub',
    blurb: 'A private billionaire-funded ski build-out inside 45 minutes of Salt Lake International, in a valley that has never had a luxury builder base.',
    p: {
      pop: 18500, hh: 6200, popCagr5: 3.4, netMig: 22, empCagr5: 2.8, bizFormIdx: 62, medInc: 108000, incCagr5: 4.6,
      hnwiPer1k: 92, hnwiG10: 150, agiIn: 34000, uhnwIdx: 62, shShare: 38, wealthInfraIdx: 38,
      medVal: 950000, luxPpsf: 880, apprec5: 82, dom: 78, cashShare: 44, tx2m: 95, tx5m: 22, tx10m: 4, lotPrice: 1600000, landShare: 24,
      sfPermits: 420, permitCagr3: 16.5, customShare: 46, remodelIdx: 40, costPsf: 560, gcMargin: 18, luxGcCount: 14, tradeIdx: 58, backlog: 8.5, buildMonths: 8,
      pipelineM: 2100, commercialM: 520, infraM: 190, entitledLots: 3400, landIdx: 62, entMonths: 16, permitDays: 55, waterIdx: 44, topoIdx: 58, shortageIdx: 70,
      visitorsM: 1.4, visitorG: 9.0, visitSpendM: 260, luxRooms: 220, adr: 720, occ: 50, seasonIdx: 55,
      repIdx: 44, clubIdx: 58, celebIdx: 52, hospIdx: 42, retailIdx: 26, schoolIdx: 32, privacyIdx: 78, entryBarIdx: 40,
      jetOps: 12, nonstops: 2, metroMin: 45, roadIdx: 58, airInvestM: 70,
      propTax: 0.55, incomeTax: 4.55, insIdx: 26, regIdx: 36, climIdx: 30, structIdx: 84
    },
    anchors: [
      { fact: 'Reed Hastings committed an additional $157M to Powder Haven for lifts, real estate and a clubhouse; two new chairlifts open for the 2026-27 season, taking the private network to six lifts over 3,300+ acres.', src: 'SnowBrains / KPCW', date: '2025-11', url: 'https://snowbrains.com/powder-mountain-private-area-expansion/' },
      { fact: 'The first 39 Powder Haven lots sold before roads were paved; the next release of 34 custom lots (2-5 acres) prices ski-in/ski-out at roughly $4M each.', src: 'KPCW / Mountain Luxury Real Estate', date: '2025-11', url: 'https://www.kpcw.org/ski-resorts/2025-11-12/second-round-of-properties-for-in-powder-mountains-private-neighborhood' }
    ]
  });

  M({
    id: 'st-george', name: 'St. George & Greater Zion', state: 'UT', stateFips: '49',
    county: 'Washington County', countyFips: '49053', lat: 37.096, lon: -113.568,
    region: 'Mountain West', archetype: 'desert', tier: 'emerging', geoScope: 'county',
    blurb: 'One of the fastest-growing counties in the United States, now building genuine resort product — with water rights as the single binding constraint on the twenty-year thesis.',
    p: {
      pop: 210000, hh: 72000, popCagr5: 3.9, netMig: 27, empCagr5: 4.0, bizFormIdx: 72, medInc: 79000, incCagr5: 4.4,
      hnwiPer1k: 52, hnwiG10: 128, agiIn: 26000, uhnwIdx: 40, shShare: 22, wealthInfraIdx: 36,
      medVal: 565000, luxPpsf: 500, apprec5: 58, dom: 82, cashShare: 38, tx2m: 190, tx5m: 24, tx10m: 3, lotPrice: 480000, landShare: 19,
      sfPermits: 3100, permitCagr3: 6.5, customShare: 16, remodelIdx: 36, costPsf: 335, gcMargin: 15, luxGcCount: 26, tradeIdx: 68, backlog: 7.5, buildMonths: 12,
      pipelineM: 5200, commercialM: 1300, infraM: 780, entitledLots: 22000, landIdx: 74, entMonths: 13, permitDays: 40, waterIdx: 34, topoIdx: 40, shortageIdx: 66,
      visitorsM: 5.2, visitorG: 4.0, visitSpendM: 1050, luxRooms: 780, adr: 480, occ: 62, seasonIdx: 72,
      repIdx: 46, clubIdx: 52, celebIdx: 30, hospIdx: 50, retailIdx: 32, schoolIdx: 30, privacyIdx: 48, entryBarIdx: 26,
      jetOps: 9, nonstops: 7, metroMin: 115, roadIdx: 76, airInvestM: 110,
      propTax: 0.52, incomeTax: 4.55, insIdx: 24, regIdx: 28, climIdx: 44, structIdx: 72
    },
    anchors: [
      { fact: 'Desert Color is a master-planned resort community anchored by the Black Desert Resort and golf course, developed in partnership with the Shivwits Band.', src: 'Black Desert Resort / CoralTree Hospitality', date: '2025', url: 'https://www.blackdesertresort.com/' },
      { fact: 'The $1M+ segment in St. George softened mid-2025, with average luxury sale prices down roughly 8.6% while the mid-market held firm.', src: 'St. George market reporting', date: '2025-07', url: 'https://amesteamutah.com/st-george-real-estate-guide/' }
    ]
  });

  M({
    id: 'bozeman', name: 'Bozeman & the Gallatin Valley', state: 'MT', stateFips: '30',
    county: 'Gallatin County', countyFips: '30031', lat: 45.680, lon: -111.038,
    region: 'Mountain West', archetype: 'mountain', tier: 'established', geoScope: 'county',
    blurb: 'The Mountain West market that pairs genuine UHNW demand with a real economy, a university, and an airport that has become a national private-aviation hub.',
    p: {
      pop: 135000, hh: 54000, popCagr5: 3.2, netMig: 21, empCagr5: 3.6, bizFormIdx: 76, medInc: 89000, incCagr5: 5.0,
      hnwiPer1k: 96, hnwiG10: 168, agiIn: 44000, uhnwIdx: 72, shShare: 16, wealthInfraIdx: 48,
      medVal: 810000, luxPpsf: 800, apprec5: 74, dom: 76, cashShare: 40, tx2m: 260, tx5m: 46, tx10m: 9, lotPrice: 850000, landShare: 22,
      sfPermits: 1250, permitCagr3: 4.5, customShare: 26, remodelIdx: 46, costPsf: 520, gcMargin: 17, luxGcCount: 34, tradeIdx: 54, backlog: 9.0, buildMonths: 8,
      pipelineM: 3600, commercialM: 1100, infraM: 480, entitledLots: 8600, landIdx: 66, entMonths: 17, permitDays: 62, waterIdx: 52, topoIdx: 42, shortageIdx: 80,
      visitorsM: 4.8, visitorG: 5.5, visitSpendM: 1150, luxRooms: 900, adr: 590, occ: 60, seasonIdx: 66,
      repIdx: 66, clubIdx: 62, celebIdx: 70, hospIdx: 58, retailIdx: 40, schoolIdx: 38, privacyIdx: 70, entryBarIdx: 42,
      jetOps: 46, nonstops: 22, metroMin: 240, roadIdx: 66, airInvestM: 180,
      propTax: 0.74, incomeTax: 5.9, insIdx: 32, regIdx: 32, climIdx: 34, structIdx: 86
    },
    anchors: [
      { fact: 'Bozeman Yellowstone International announced a $180 million infrastructure upgrade and expansion, explicitly framed around sustained private-aviation growth.', src: 'NBC Montana / airport authority', date: '2024', url: 'https://nbcmontana.com/news/local/bozeman-airport-sees-increase-in-private-jet-usage-brings-boost-to-local-economy' },
      { fact: 'U.S. private jet departures reached 2.63 million in 2025, up 5% year over year and 29% above 2019 — the demand backdrop for BZN, JAC and BJC-class fields.', src: 'Paramount Business Jets research', date: '2026-07', url: 'https://www.paramountbusinessjets.com/blog/research-and-trends/business-jet-traffic-wealth-migration' }
    ]
  });

  M({
    id: 'big-sky', name: 'Big Sky, Moonlight & Yellowstone Club', state: 'MT', stateFips: '30',
    county: 'Madison & Gallatin Counties', countyFips: '30031', lat: 45.284, lon: -111.401,
    region: 'Mountain West', archetype: 'ski', tier: 'established', geoScope: 'sub',
    blurb: 'The highest-priced private ski real estate in North America, served by a trade base of a few thousand people two hours from a metro of any size.',
    p: {
      pop: 3600, hh: 1500, popCagr5: 4.6, netMig: 30, empCagr5: 4.2, bizFormIdx: 66, medInc: 116000, incCagr5: 5.4,
      hnwiPer1k: 340, hnwiG10: 155, agiIn: 88000, uhnwIdx: 94, shShare: 66, wealthInfraIdx: 44,
      medVal: 2350000, luxPpsf: 1950, apprec5: 92, dom: 120, cashShare: 66, tx2m: 150, tx5m: 60, tx10m: 20, lotPrice: 4200000, landShare: 30,
      sfPermits: 130, permitCagr3: 7.5, customShare: 84, remodelIdx: 44, costPsf: 1050, gcMargin: 15, luxGcCount: 26, tradeIdx: 32, backlog: 12.5, buildMonths: 7,
      pipelineM: 2600, commercialM: 780, infraM: 210, entitledLots: 1500, landIdx: 38, entMonths: 22, permitDays: 75, waterIdx: 46, topoIdx: 74, shortageIdx: 86,
      visitorsM: 1.6, visitorG: 4.5, visitSpendM: 720, luxRooms: 1150, adr: 1250, occ: 54, seasonIdx: 58,
      repIdx: 76, clubIdx: 92, celebIdx: 88, hospIdx: 76, retailIdx: 34, schoolIdx: 30, privacyIdx: 92, entryBarIdx: 88,
      jetOps: 46, nonstops: 0, metroMin: 240, roadIdx: 48, airInvestM: 180,
      propTax: 0.72, incomeTax: 5.9, insIdx: 34, regIdx: 36, climIdx: 36, structIdx: 78
    }
  });

  M({
    id: 'whitefish', name: 'Whitefish & the Flathead Valley', state: 'MT', stateFips: '30',
    county: 'Flathead County', countyFips: '30029', lat: 48.411, lon: -114.337,
    region: 'Mountain West', archetype: 'lake', tier: 'emerging', geoScope: 'county',
    blurb: 'Ski hill, big lake and a national park in one valley — currently in a genuine buyer\'s market, which is when land gets assembled.',
    p: {
      pop: 112000, hh: 46000, popCagr5: 2.4, netMig: 18, empCagr5: 2.6, bizFormIdx: 64, medInc: 76000, incCagr5: 4.6,
      hnwiPer1k: 88, hnwiG10: 148, agiIn: 39000, uhnwIdx: 62, shShare: 28, wealthInfraIdx: 34,
      medVal: 690000, luxPpsf: 740, apprec5: 70, dom: 92, cashShare: 46, tx2m: 145, tx5m: 26, tx10m: 5, lotPrice: 780000, landShare: 21,
      sfPermits: 900, permitCagr3: 1.0, customShare: 30, remodelIdx: 42, costPsf: 500, gcMargin: 17, luxGcCount: 22, tradeIdx: 52, backlog: 8.0, buildMonths: 7,
      pipelineM: 1500, commercialM: 420, infraM: 220, entitledLots: 5200, landIdx: 62, entMonths: 16, permitDays: 58, waterIdx: 62, topoIdx: 48, shortageIdx: 74,
      visitorsM: 3.2, visitorG: 2.0, visitSpendM: 720, luxRooms: 480, adr: 620, occ: 54, seasonIdx: 52,
      repIdx: 60, clubIdx: 56, celebIdx: 58, hospIdx: 50, retailIdx: 34, schoolIdx: 30, privacyIdx: 76, entryBarIdx: 40,
      jetOps: 18, nonstops: 14, metroMin: 240, roadIdx: 56, airInvestM: 120,
      propTax: 0.74, incomeTax: 5.9, insIdx: 34, regIdx: 30, climIdx: 36, structIdx: 76
    },
    anchors: [
      { fact: 'Whitefish Q1-2026 median sale price was $825,000 against $653,000 for Flathead County overall; Realtor.com classified Whitefish a buyer\'s market in March 2026 with 86 median days on market and homes selling ~5.3% below asking.', src: 'Whitefish / Flathead market reporting', date: '2026-03', url: 'https://montanalivingbykim.com/blog/understanding-the-luxury-real-estate-market-in-whitefish' }
    ]
  });

  M({
    id: 'missoula', name: 'Missoula & the Bitterroot', state: 'MT', stateFips: '30',
    county: 'Missoula County', countyFips: '30063', lat: 46.872, lon: -113.994,
    region: 'Mountain West', archetype: 'mountain', tier: 'frontier', geoScope: 'county',
    blurb: 'A university town with real amenity value and a thin luxury tier — included as the control case for what Bozeman looked like fifteen years ago.',
    p: {
      pop: 123000, hh: 52000, popCagr5: 1.2, netMig: 8, empCagr5: 1.9, bizFormIdx: 58, medInc: 71000, incCagr5: 4.0,
      hnwiPer1k: 54, hnwiG10: 110, agiIn: 21000, uhnwIdx: 34, shShare: 9, wealthInfraIdx: 32,
      medVal: 585000, luxPpsf: 520, apprec5: 62, dom: 78, cashShare: 32, tx2m: 48, tx5m: 7, tx10m: 1, lotPrice: 380000, landShare: 18,
      sfPermits: 560, permitCagr3: -1.5, customShare: 20, remodelIdx: 34, costPsf: 410, gcMargin: 16, luxGcCount: 12, tradeIdx: 58, backlog: 7.0, buildMonths: 7,
      pipelineM: 900, commercialM: 340, infraM: 190, entitledLots: 3800, landIdx: 58, entMonths: 18, permitDays: 62, waterIdx: 66, topoIdx: 46, shortageIdx: 66,
      visitorsM: 1.6, visitorG: 2.2, visitSpendM: 380, luxRooms: 180, adr: 340, occ: 58, seasonIdx: 62,
      repIdx: 40, clubIdx: 34, celebIdx: 32, hospIdx: 34, retailIdx: 26, schoolIdx: 28, privacyIdx: 58, entryBarIdx: 24,
      jetOps: 11, nonstops: 12, metroMin: 240, roadIdx: 60, airInvestM: 90,
      propTax: 0.78, incomeTax: 5.9, insIdx: 30, regIdx: 34, climIdx: 36, structIdx: 62
    }
  });

  M({
    id: 'jackson-hole', name: 'Jackson Hole', state: 'WY', stateFips: '56',
    county: 'Teton County', countyFips: '56039', lat: 43.479, lon: -110.762,
    region: 'Mountain West', archetype: 'ski', tier: 'mature', geoScope: 'county',
    blurb: 'The highest per-return wealth inflow in the country, into a county that is 97% federal land — the definitive example of extreme luxury strength with no developer runway.',
    p: {
      pop: 23500, hh: 9400, popCagr5: 0.5, netMig: 4, empCagr5: 1.4, bizFormIdx: 62, medInc: 128000, incCagr5: 4.4,
      hnwiPer1k: 300, hnwiG10: 96, agiIn: 118000, uhnwIdx: 96, shShare: 42, wealthInfraIdx: 78,
      medVal: 2650000, luxPpsf: 2050, apprec5: 66, dom: 118, cashShare: 68, tx2m: 300, tx5m: 96, tx10m: 32, lotPrice: 5200000, landShare: 38,
      sfPermits: 175, permitCagr3: -2.0, customShare: 76, remodelIdx: 72, costPsf: 1150, gcMargin: 15, luxGcCount: 42, tradeIdx: 26, backlog: 13.5, buildMonths: 7,
      pipelineM: 1200, commercialM: 420, infraM: 210, entitledLots: 620, landIdx: 12, entMonths: 30, permitDays: 120, waterIdx: 52, topoIdx: 82, shortageIdx: 94,
      visitorsM: 4.2, visitorG: 1.5, visitSpendM: 1650, luxRooms: 1450, adr: 1350, occ: 60, seasonIdx: 64,
      repIdx: 92, clubIdx: 84, celebIdx: 92, hospIdx: 86, retailIdx: 62, schoolIdx: 46, privacyIdx: 84, entryBarIdx: 88,
      jetOps: 32, nonstops: 15, metroMin: 240, roadIdx: 50, airInvestM: 130,
      propTax: 0.48, incomeTax: 0, insIdx: 30, regIdx: 62, climIdx: 32, structIdx: 74
    }
  });

  M({
    id: 'sheridan-wy', name: 'Sheridan & the Bighorns', state: 'WY', stateFips: '56',
    county: 'Sheridan County', countyFips: '56033', lat: 44.797, lon: -106.956,
    region: 'Mountain West', archetype: 'smalltown', tier: 'frontier', geoScope: 'county',
    blurb: 'No income tax, cheap land, serious ranch buyers and a polo culture — the least-recognised of the Wyoming wealth destinations.',
    p: {
      pop: 32500, hh: 14000, popCagr5: 1.0, netMig: 9, empCagr5: 1.4, bizFormIdx: 52, medInc: 72000, incCagr5: 3.8,
      hnwiPer1k: 62, hnwiG10: 112, agiIn: 32000, uhnwIdx: 48, shShare: 12, wealthInfraIdx: 30,
      medVal: 470000, luxPpsf: 460, apprec5: 58, dom: 96, cashShare: 44, tx2m: 26, tx5m: 6, tx10m: 2, lotPrice: 320000, landShare: 15,
      sfPermits: 210, permitCagr3: 3.0, customShare: 30, remodelIdx: 28, costPsf: 370, gcMargin: 17, luxGcCount: 7, tradeIdx: 54, backlog: 6.5, buildMonths: 7,
      pipelineM: 420, commercialM: 160, infraM: 120, entitledLots: 1800, landIdx: 76, entMonths: 12, permitDays: 40, waterIdx: 62, topoIdx: 40, shortageIdx: 52,
      visitorsM: 0.9, visitorG: 3.0, visitSpendM: 165, luxRooms: 90, adr: 320, occ: 52, seasonIdx: 54,
      repIdx: 34, clubIdx: 44, celebIdx: 40, hospIdx: 30, retailIdx: 20, schoolIdx: 24, privacyIdx: 84, entryBarIdx: 26,
      jetOps: 5, nonstops: 1, metroMin: 240, roadIdx: 54, airInvestM: 40,
      propTax: 0.55, incomeTax: 0, insIdx: 26, regIdx: 22, climIdx: 32, structIdx: 66
    }
  });

  M({
    id: 'cda', name: "Coeur d'Alene & North Idaho", state: 'ID', stateFips: '16',
    county: 'Kootenai County', countyFips: '16055', lat: 47.678, lon: -116.780,
    region: 'Mountain West', archetype: 'lake', tier: 'emerging', geoScope: 'county',
    blurb: 'A deep-water lake, a strong aquifer, a 45-minute commercial airport and the most sustained high-equity in-migration of any lake market in the West.',
    p: {
      pop: 189000, hh: 74000, popCagr5: 2.6, netMig: 22, empCagr5: 3.0, bizFormIdx: 70, medInc: 78000, incCagr5: 4.8,
      hnwiPer1k: 74, hnwiG10: 158, agiIn: 42000, uhnwIdx: 58, shShare: 14, wealthInfraIdx: 38,
      medVal: 585000, luxPpsf: 680, apprec5: 72, dom: 93, cashShare: 42, tx2m: 165, tx5m: 30, tx10m: 6, lotPrice: 620000, landShare: 20,
      sfPermits: 1650, permitCagr3: 3.5, customShare: 20, remodelIdx: 42, costPsf: 420, gcMargin: 17, luxGcCount: 20, tradeIdx: 60, backlog: 8.0, buildMonths: 8,
      pipelineM: 2400, commercialM: 640, infraM: 420, entitledLots: 11000, landIdx: 68, entMonths: 14, permitDays: 45, waterIdx: 72, topoIdx: 44, shortageIdx: 72,
      visitorsM: 3.4, visitorG: 3.5, visitSpendM: 640, luxRooms: 520, adr: 470, occ: 56, seasonIdx: 56,
      repIdx: 52, clubIdx: 58, celebIdx: 46, hospIdx: 48, retailIdx: 32, schoolIdx: 34, privacyIdx: 70, entryBarIdx: 32,
      jetOps: 14, nonstops: 20, metroMin: 45, roadIdx: 70, airInvestM: 85,
      propTax: 0.62, incomeTax: 5.695, insIdx: 26, regIdx: 26, climIdx: 30, structIdx: 84
    },
    anchors: [
      { fact: 'For the three months ending July 2025, 780 existing homes sold in Kootenai County, 9% above the prior year, with the average sale price up 7% to $741,000 and the county median at $545,000.', src: "Coeur d'Alene Press / HUD Market at a Glance", date: '2025-08', url: 'https://cdapress.com/news/2025/aug/07/kootenai-county-housing-market-holds-strong/' },
      { fact: 'New-construction luxury condominiums in Coeur d\'Alene sold at an average $1,097 per square foot in November 2025, at 99% of asking price.', src: 'North Idaho luxury market reporting', date: '2025-11', url: 'https://www.barndochick.com/post/the-north-idaho-luxury-build-window-is-open-here-s-why-it-won-t-stay-that-way' },
      { fact: 'Idaho ranked first in the nation for inbound migration in 2024; Kootenai is the third-fastest-growing county in the state, with out-of-state buyers led by California and Washington.', src: 'Relocation reporting / PNW Home Sales', date: '2026-01', url: 'https://www.pr.com/press-release/967276' }
    ]
  });

  M({
    id: 'sandpoint', name: 'Sandpoint & Lake Pend Oreille', state: 'ID', stateFips: '16',
    county: 'Bonner County', countyFips: '16017', lat: 48.276, lon: -116.553,
    region: 'Mountain West', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'Idaho\'s largest lake plus a ski mountain, an hour and a half north of a commercial airport, with a builder base that has not yet been rebuilt for eight-figure clients.',
    p: {
      pop: 52000, hh: 22000, popCagr5: 2.2, netMig: 20, empCagr5: 2.4, bizFormIdx: 62, medInc: 68000, incCagr5: 4.6,
      hnwiPer1k: 72, hnwiG10: 152, agiIn: 38000, uhnwIdx: 52, shShare: 30, wealthInfraIdx: 26,
      medVal: 620000, luxPpsf: 660, apprec5: 76, dom: 108, cashShare: 48, tx2m: 62, tx5m: 12, tx10m: 2, lotPrice: 640000, landShare: 22,
      sfPermits: 430, permitCagr3: 2.5, customShare: 40, remodelIdx: 34, costPsf: 440, gcMargin: 18, luxGcCount: 9, tradeIdx: 46, backlog: 8.5, buildMonths: 7,
      pipelineM: 620, commercialM: 190, infraM: 130, entitledLots: 2400, landIdx: 70, entMonths: 15, permitDays: 50, waterIdx: 74, topoIdx: 56, shortageIdx: 70,
      visitorsM: 1.3, visitorG: 4.5, visitSpendM: 250, luxRooms: 150, adr: 430, occ: 50, seasonIdx: 50,
      repIdx: 42, clubIdx: 42, celebIdx: 44, hospIdx: 36, retailIdx: 24, schoolIdx: 26, privacyIdx: 84, entryBarIdx: 28,
      jetOps: 4, nonstops: 20, metroMin: 90, roadIdx: 56, airInvestM: 35,
      propTax: 0.62, incomeTax: 5.695, insIdx: 28, regIdx: 26, climIdx: 32, structIdx: 80
    }
  });

  M({
    id: 'sun-valley', name: 'Sun Valley & Ketchum', state: 'ID', stateFips: '16',
    county: 'Blaine County', countyFips: '16013', lat: 43.697, lon: -114.352,
    region: 'Mountain West', archetype: 'ski', tier: 'mature', geoScope: 'county',
    blurb: 'Original American ski aristocracy, an annual gathering of the media and technology elite, and a valley floor with almost nothing left to entitle.',
    p: {
      pop: 24500, hh: 10500, popCagr5: 0.9, netMig: 7, empCagr5: 1.6, bizFormIdx: 58, medInc: 92000, incCagr5: 4.2,
      hnwiPer1k: 205, hnwiG10: 108, agiIn: 74000, uhnwIdx: 84, shShare: 52, wealthInfraIdx: 46,
      medVal: 1450000, luxPpsf: 1250, apprec5: 68, dom: 112, cashShare: 62, tx2m: 175, tx5m: 42, tx10m: 11, lotPrice: 1900000, landShare: 28,
      sfPermits: 210, permitCagr3: 1.0, customShare: 64, remodelIdx: 62, costPsf: 820, gcMargin: 16, luxGcCount: 24, tradeIdx: 34, backlog: 11.0, buildMonths: 7,
      pipelineM: 720, commercialM: 260, infraM: 140, entitledLots: 900, landIdx: 26, entMonths: 24, permitDays: 90, waterIdx: 48, topoIdx: 72, shortageIdx: 86,
      visitorsM: 1.4, visitorG: 2.5, visitSpendM: 560, luxRooms: 700, adr: 880, occ: 52, seasonIdx: 60,
      repIdx: 76, clubIdx: 74, celebIdx: 84, hospIdx: 70, retailIdx: 46, schoolIdx: 44, privacyIdx: 88, entryBarIdx: 76,
      jetOps: 16, nonstops: 6, metroMin: 165, roadIdx: 46, airInvestM: 60,
      propTax: 0.58, incomeTax: 5.695, insIdx: 28, regIdx: 44, climIdx: 32, structIdx: 70
    }
  });

  M({
    id: 'mccall', name: 'McCall & Payette Lakes', state: 'ID', stateFips: '16',
    county: 'Valley County', countyFips: '16085', lat: 44.911, lon: -116.099,
    region: 'Mountain West', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'Idaho\'s second-home lake for Boise money, with the highest seasonal-housing share of any market in the state and essentially no luxury contractor bench.',
    p: {
      pop: 13200, hh: 5400, popCagr5: 2.8, netMig: 24, empCagr5: 2.8, bizFormIdx: 58, medInc: 74000, incCagr5: 5.0,
      hnwiPer1k: 96, hnwiG10: 165, agiIn: 44000, uhnwIdx: 50, shShare: 58, wealthInfraIdx: 24,
      medVal: 780000, luxPpsf: 720, apprec5: 84, dom: 105, cashShare: 54, tx2m: 48, tx5m: 9, tx10m: 1, lotPrice: 720000, landShare: 23,
      sfPermits: 290, permitCagr3: 6.0, customShare: 55, remodelIdx: 30, costPsf: 470, gcMargin: 19, luxGcCount: 8, tradeIdx: 40, backlog: 9.5, buildMonths: 6,
      pipelineM: 640, commercialM: 180, infraM: 95, entitledLots: 2100, landIdx: 64, entMonths: 15, permitDays: 52, waterIdx: 68, topoIdx: 58, shortageIdx: 78,
      visitorsM: 1.1, visitorG: 5.5, visitSpendM: 190, luxRooms: 140, adr: 480, occ: 48, seasonIdx: 52,
      repIdx: 38, clubIdx: 44, celebIdx: 34, hospIdx: 34, retailIdx: 20, schoolIdx: 22, privacyIdx: 80, entryBarIdx: 26,
      jetOps: 3, nonstops: 0, metroMin: 115, roadIdx: 48, airInvestM: 30,
      propTax: 0.58, incomeTax: 5.695, insIdx: 28, regIdx: 26, climIdx: 32, structIdx: 78
    }
  });

  M({
    id: 'boise', name: 'Boise, Eagle & the Treasure Valley', state: 'ID', stateFips: '16',
    county: 'Ada County', countyFips: '16001', lat: 43.615, lon: -116.202,
    region: 'Mountain West', archetype: 'suburb', tier: 'emerging', geoScope: 'county',
    blurb: 'The metro engine behind Idaho\'s wealth story: Eagle and the Boise foothills now support a real $2M-$5M custom market with a still-thin high-end builder bench.',
    p: {
      pop: 530000, hh: 200000, popCagr5: 2.2, netMig: 15, empCagr5: 3.2, bizFormIdx: 74, medInc: 88000, incCagr5: 4.6,
      hnwiPer1k: 64, hnwiG10: 142, agiIn: 33000, uhnwIdx: 52, shShare: 4, wealthInfraIdx: 52,
      medVal: 585000, luxPpsf: 500, apprec5: 60, dom: 62, cashShare: 30, tx2m: 260, tx5m: 38, tx10m: 5, lotPrice: 520000, landShare: 19,
      sfPermits: 4900, permitCagr3: 2.0, customShare: 14, remodelIdx: 44, costPsf: 350, gcMargin: 15, luxGcCount: 30, tradeIdx: 66, backlog: 7.5, buildMonths: 10,
      pipelineM: 6800, commercialM: 2100, infraM: 950, entitledLots: 31000, landIdx: 62, entMonths: 15, permitDays: 48, waterIdx: 50, topoIdx: 34, shortageIdx: 70,
      visitorsM: 5.6, visitorG: 3.0, visitSpendM: 980, luxRooms: 620, adr: 350, occ: 66, seasonIdx: 80,
      repIdx: 50, clubIdx: 54, celebIdx: 38, hospIdx: 48, retailIdx: 40, schoolIdx: 40, privacyIdx: 48, entryBarIdx: 28,
      jetOps: 22, nonstops: 30, metroMin: 10, roadIdx: 78, airInvestM: 250,
      propTax: 0.58, incomeTax: 5.695, insIdx: 24, regIdx: 26, climIdx: 30, structIdx: 78
    }
  });

})(LCDOS_DATA);

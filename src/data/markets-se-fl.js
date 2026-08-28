/* Market dataset — Florida. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: '30a-walton', name: '30A & South Walton', state: 'FL', stateFips: '12',
    county: 'Walton County', countyFips: '12131', lat: 30.324, lon: -86.176,
    region: 'Southeast', archetype: 'coastal', tier: 'emerging', geoScope: 'county',
    blurb: 'A single public developer controls the land bank, the town centres and the airport catchment — and the spec margins here are the best of any coastal market in the country.',
    p: {
      pop: 82000, hh: 34000, popCagr5: 3.4, netMig: 28, empCagr5: 3.8, bizFormIdx: 72, medInc: 82000, incCagr5: 4.8,
      hnwiPer1k: 122, hnwiG10: 175, agiIn: 78000, uhnwIdx: 68, shShare: 62, wealthInfraIdx: 34,
      medVal: 920000, luxPpsf: 1050, apprec5: 76, dom: 118, cashShare: 62, tx2m: 420, tx5m: 92, tx10m: 18, lotPrice: 1350000, landShare: 30,
      sfPermits: 1900, permitCagr3: 5.5, customShare: 42, remodelIdx: 46, costPsf: 520, gcMargin: 18, luxGcCount: 34, tradeIdx: 52, backlog: 9.0, buildMonths: 12,
      pipelineM: 5800, commercialM: 1600, infraM: 520, entitledLots: 24000, landIdx: 66, entMonths: 14, permitDays: 55, waterIdx: 58, topoIdx: 30, shortageIdx: 72,
      visitorsM: 5.2, visitorG: 4.0, visitSpendM: 5100, luxRooms: 2400, adr: 780, occ: 62, seasonIdx: 58,
      repIdx: 78, clubIdx: 66, celebIdx: 62, hospIdx: 62, retailIdx: 48, schoolIdx: 44, privacyIdx: 62, entryBarIdx: 40,
      jetOps: 24, nonstops: 24, metroMin: 90, roadIdx: 62, airInvestM: 220,
      propTax: 0.86, incomeTax: 0, insIdx: 74, regIdx: 32, climIdx: 74, structIdx: 78
    },
    prov: {
      pipelineM: { tier: 'reported', src: 'sec_filings', asOf: '2026-Q1', note: 'Anchored on St. Joe Company (NYSE: JOE) disclosed project inventory.' },
      entitledLots: { tier: 'reported', src: 'sec_filings', asOf: '2026-Q1', note: 'St. Joe entitled residential inventory plus Walton County applications.' }
    },
    anchors: [
      { fact: 'Watersound Town Center has a built-in pipeline of affluent year-round customers reinforced by more than five million annual visitors to South Walton.', src: 'The St. Joe Company (NYSE: JOE)', date: '2025-05', url: 'https://www.businesswire.com/news/home/20250528741676/en/The-St.-Joe-Company-Announces-Johnnie-O-as-the-Latest-National-Retail-Tenant-to-Join-Watersound-Town-Center' },
      { fact: 'Watersound West Bay Center is planned for approximately 500,000 square feet of commercial space, with a Publix-anchored phase commencing development.', src: 'The St. Joe Company', date: '2025-12', url: 'https://secure.businesswire.com/news/home/20251210569938/en/The-St.-Joe-Company-Announces-Commencement-of-Development-of-the-Publix-Super-Market-at-Watersound-West-Bay-Center' },
      { fact: 'Latitude Margaritaville Watersound has completed 2,170 homes since sales opened in 2021, against a Phase 1 plan of 3,500.', src: 'The St. Joe Company', date: '2025', url: 'https://ir.joe.com/news-releases' }
    ]
  });

  M({
    id: 'naples', name: 'Naples & Collier County', state: 'FL', stateFips: '12',
    county: 'Collier County', countyFips: '12021', lat: 26.142, lon: -81.795,
    region: 'Southeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'The deepest club ecosystem in America and a genuine $20M+ tier, with a hurricane insurance market that now prices like a second mortgage.',
    p: {
      pop: 405000, hh: 175000, popCagr5: 1.6, netMig: 16, empCagr5: 2.2, bizFormIdx: 68, medInc: 92000, incCagr5: 4.4,
      hnwiPer1k: 235, hnwiG10: 118, agiIn: 96000, uhnwIdx: 90, shShare: 42, wealthInfraIdx: 76,
      medVal: 780000, luxPpsf: 1250, apprec5: 58, dom: 106, cashShare: 66, tx2m: 1650, tx5m: 380, tx10m: 92, lotPrice: 2400000, landShare: 32,
      sfPermits: 3400, permitCagr3: 1.0, customShare: 32, remodelIdx: 78, costPsf: 620, gcMargin: 16, luxGcCount: 78, tradeIdx: 56, backlog: 9.5, buildMonths: 12,
      pipelineM: 8200, commercialM: 2600, infraM: 900, entitledLots: 26000, landIdx: 44, entMonths: 18, permitDays: 70, waterIdx: 52, topoIdx: 44, shortageIdx: 62,
      visitorsM: 2.2, visitorG: 2.0, visitSpendM: 3100, luxRooms: 4200, adr: 780, occ: 62, seasonIdx: 62,
      repIdx: 88, clubIdx: 94, celebIdx: 74, hospIdx: 84, retailIdx: 78, schoolIdx: 66, privacyIdx: 72, entryBarIdx: 70,
      jetOps: 52, nonstops: 20, metroMin: 45, roadIdx: 76, airInvestM: 260,
      propTax: 0.78, incomeTax: 0, insIdx: 88, regIdx: 40, climIdx: 82, structIdx: 68
    },
    anchors: [
      { fact: 'A waterfront estate sold for $85 million in April 2025, a Collier County record.', src: 'The Real Deal', date: '2025-04', url: 'https://therealdeal.com/magazine/may-2026/inside-naples-ultra-luxury-shift/' },
      { fact: 'The $20M-and-up segment rose 75% year over year, from four closings to seven, in the November 2025 to April 2026 window.', src: 'The Real Deal', date: '2026-05', url: 'https://therealdeal.com/magazine/may-2026/inside-naples-ultra-luxury-shift/' },
      { fact: 'Naples carried 2,213 active $1M-plus listings in November 2025, 35.8% of all listings, up 3.5% year over year.', src: 'Naples market reporting', date: '2025-11', url: 'https://naplesgolfguy.com/naples-real-estate-market-report-may-2026/' },
      { fact: 'May 2026 closed sales rose 13.9% and pending sales 12.1% year over year; two ultra-luxury sales closed at $15.9M, one a newly-constructed residence in Olde Naples.', src: 'Naples Area Board of REALTORS reporting', date: '2026-05', url: 'https://naplesgolfguy.com/naples-real-estate-market-report-may-2026/' }
    ]
  });

  M({
    id: 'sarasota-lwr', name: 'Sarasota & Lakewood Ranch', state: 'FL', stateFips: '12',
    county: 'Sarasota & Manatee Counties', countyFips: '12115', lat: 27.336, lon: -82.531,
    region: 'Southeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'Home to the best-selling master-planned community in the United States, with an entitled lot bank measured in the tens of thousands.',
    p: {
      pop: 480000, hh: 215000, popCagr5: 1.8, netMig: 17, empCagr5: 2.4, bizFormIdx: 70, medInc: 78000, incCagr5: 4.4,
      hnwiPer1k: 148, hnwiG10: 126, agiIn: 72000, uhnwIdx: 68, shShare: 30, wealthInfraIdx: 56,
      medVal: 520000, luxPpsf: 820, apprec5: 54, dom: 98, cashShare: 58, tx2m: 720, tx5m: 130, tx10m: 26, lotPrice: 900000, landShare: 26,
      sfPermits: 5200, permitCagr3: 2.5, customShare: 18, remodelIdx: 60, costPsf: 480, gcMargin: 16, luxGcCount: 46, tradeIdx: 62, backlog: 8.5, buildMonths: 12,
      pipelineM: 7600, commercialM: 2200, infraM: 1100, entitledLots: 42000, landIdx: 62, entMonths: 16, permitDays: 60, waterIdx: 54, topoIdx: 34, shortageIdx: 56,
      visitorsM: 4.2, visitorG: 2.5, visitSpendM: 2400, luxRooms: 2200, adr: 480, occ: 64, seasonIdx: 68,
      repIdx: 70, clubIdx: 76, celebIdx: 54, hospIdx: 66, retailIdx: 58, schoolIdx: 56, privacyIdx: 56, entryBarIdx: 42,
      jetOps: 26, nonstops: 34, metroMin: 45, roadIdx: 78, airInvestM: 220,
      propTax: 0.86, incomeTax: 0, insIdx: 86, regIdx: 36, climIdx: 80, structIdx: 70
    }
  });

  M({
    id: 'palm-beach', name: 'Palm Beach, Jupiter Island & Wellington', state: 'FL', stateFips: '12',
    county: 'Palm Beach County', countyFips: '12099', lat: 26.706, lon: -80.037,
    region: 'Southeast', archetype: 'coastal', tier: 'mature', geoScope: 'county',
    blurb: 'The single largest concentration of relocated financial wealth in the United States — and roughly 145 established luxury GCs already competing for it.',
    p: {
      pop: 1520000, hh: 610000, popCagr5: 1.2, netMig: 13, empCagr5: 2.4, bizFormIdx: 76, medInc: 82000, incCagr5: 4.6,
      hnwiPer1k: 165, hnwiG10: 112, agiIn: 108000, uhnwIdx: 98, shShare: 22, wealthInfraIdx: 96,
      medVal: 620000, luxPpsf: 1650, apprec5: 62, dom: 92, cashShare: 58, tx2m: 3200, tx5m: 820, tx10m: 260, lotPrice: 4800000, landShare: 38,
      sfPermits: 6200, permitCagr3: 1.5, customShare: 24, remodelIdx: 88, costPsf: 720, gcMargin: 16, luxGcCount: 145, tradeIdx: 56, backlog: 10.0, buildMonths: 12,
      pipelineM: 18000, commercialM: 6800, infraM: 2400, entitledLots: 38000, landIdx: 34, entMonths: 20, permitDays: 90, waterIdx: 50, topoIdx: 40, shortageIdx: 70,
      visitorsM: 9.2, visitorG: 2.5, visitSpendM: 6200, luxRooms: 7800, adr: 820, occ: 66, seasonIdx: 66,
      repIdx: 96, clubIdx: 96, celebIdx: 94, hospIdx: 90, retailIdx: 92, schoolIdx: 82, privacyIdx: 74, entryBarIdx: 92,
      jetOps: 74, nonstops: 42, metroMin: 10, roadIdx: 82, airInvestM: 480,
      propTax: 0.94, incomeTax: 0, insIdx: 92, regIdx: 46, climIdx: 86, structIdx: 76
    },
    anchors: [
      { fact: 'West Palm Beach recorded a 112% increase in resident millionaires over the past decade.', src: 'Henley & Partners, USA Wealth Report 2025', date: '2025-05', url: 'https://www.henleyglobal.com/publications/usa-wealth-report-2025/city-snapshots-where-wealth-lives-america' }
    ]
  });

  M({
    id: 'miami-gables', name: 'Miami, Coral Gables & Key Biscayne', state: 'FL', stateFips: '12',
    county: 'Miami-Dade County', countyFips: '12086', lat: 25.761, lon: -80.192,
    region: 'Southeast', archetype: 'metro', tier: 'mature', geoScope: 'county',
    blurb: 'The largest luxury construction market in the Southeast, the most competitive contractor field in this dataset, and the highest physical-risk profile.',
    p: {
      pop: 2680000, hh: 940000, popCagr5: 0.2, netMig: -2, empCagr5: 2.2, bizFormIdx: 82, medInc: 74000, incCagr5: 4.8,
      hnwiPer1k: 128, hnwiG10: 94, agiIn: 88000, uhnwIdx: 96, shShare: 12, wealthInfraIdx: 94,
      medVal: 610000, luxPpsf: 1450, apprec5: 66, dom: 110, cashShare: 52, tx2m: 4200, tx5m: 980, tx10m: 280, lotPrice: 3600000, landShare: 40,
      sfPermits: 3400, permitCagr3: -1.0, customShare: 18, remodelIdx: 82, costPsf: 700, gcMargin: 15, luxGcCount: 180, tradeIdx: 60, backlog: 9.5, buildMonths: 12,
      pipelineM: 32000, commercialM: 14000, infraM: 4200, entitledLots: 26000, landIdx: 22, entMonths: 26, permitDays: 140, waterIdx: 44, topoIdx: 48, shortageIdx: 82,
      visitorsM: 28.0, visitorG: 2.0, visitSpendM: 22000, luxRooms: 16000, adr: 620, occ: 72, seasonIdx: 74,
      repIdx: 96, clubIdx: 82, celebIdx: 96, hospIdx: 92, retailIdx: 96, schoolIdx: 78, privacyIdx: 48, entryBarIdx: 80,
      jetOps: 96, nonstops: 160, metroMin: 5, roadIdx: 70, airInvestM: 1400,
      propTax: 0.94, incomeTax: 0, insIdx: 94, regIdx: 62, climIdx: 90, structIdx: 70
    },
    anchors: [
      { fact: 'Miami millionaire growth reached 94% over the decade to 2024.', src: 'Henley & Partners, USA Wealth Report 2025', date: '2025-05', url: 'https://www.henleyglobal.com/publications/usa-wealth-report-2025/top-10-wealthiest-cities-usa' }
    ]
  });

  M({
    id: 'vero-beach', name: 'Vero Beach & Indian River', state: 'FL', stateFips: '12',
    county: 'Indian River County', countyFips: '12061', lat: 27.639, lon: -80.397,
    region: 'Southeast', archetype: 'golf', tier: 'established', geoScope: 'county',
    blurb: 'John\'s Island, Windsor and Orchid Island give this small county a private-club density out of all proportion to its size — and almost no luxury builder competition.',
    p: {
      pop: 175000, hh: 78000, popCagr5: 1.4, netMig: 15, empCagr5: 1.8, bizFormIdx: 58, medInc: 70000, incCagr5: 4.2,
      hnwiPer1k: 148, hnwiG10: 108, agiIn: 76000, uhnwIdx: 66, shShare: 28, wealthInfraIdx: 40,
      medVal: 470000, luxPpsf: 780, apprec5: 56, dom: 104, cashShare: 62, tx2m: 210, tx5m: 42, tx10m: 8, lotPrice: 780000, landShare: 26,
      sfPermits: 1400, permitCagr3: 2.0, customShare: 26, remodelIdx: 52, costPsf: 460, gcMargin: 17, luxGcCount: 18, tradeIdx: 58, backlog: 8.0, buildMonths: 12,
      pipelineM: 1600, commercialM: 460, infraM: 280, entitledLots: 9200, landIdx: 62, entMonths: 15, permitDays: 55, waterIdx: 54, topoIdx: 30, shortageIdx: 58,
      visitorsM: 1.1, visitorG: 2.0, visitSpendM: 480, luxRooms: 480, adr: 480, occ: 58, seasonIdx: 60,
      repIdx: 58, clubIdx: 82, celebIdx: 56, hospIdx: 52, retailIdx: 42, schoolIdx: 54, privacyIdx: 84, entryBarIdx: 68,
      jetOps: 14, nonstops: 6, metroMin: 90, roadIdx: 66, airInvestM: 70,
      propTax: 0.86, incomeTax: 0, insIdx: 84, regIdx: 34, climIdx: 78, structIdx: 68
    }
  });

  M({
    id: 'ponte-vedra', name: 'Ponte Vedra, Nocatee & St. Johns', state: 'FL', stateFips: '12',
    county: 'St. Johns County', countyFips: '12109', lat: 30.240, lon: -81.386,
    region: 'Southeast', archetype: 'suburb', tier: 'emerging', geoScope: 'county',
    blurb: 'One of the fastest-growing counties in America, a top-ten national master-planned community in Nocatee, and TPC Sawgrass anchoring the prestige tier.',
    p: {
      pop: 320000, hh: 118000, popCagr5: 4.2, netMig: 33, empCagr5: 4.2, bizFormIdx: 74, medInc: 108000, incCagr5: 4.8,
      hnwiPer1k: 128, hnwiG10: 152, agiIn: 68000, uhnwIdx: 62, shShare: 14, wealthInfraIdx: 52,
      medVal: 640000, luxPpsf: 640, apprec5: 62, dom: 76, cashShare: 42, tx2m: 420, tx5m: 68, tx10m: 12, lotPrice: 780000, landShare: 24,
      sfPermits: 5600, permitCagr3: 4.0, customShare: 14, remodelIdx: 48, costPsf: 420, gcMargin: 16, luxGcCount: 32, tradeIdx: 66, backlog: 8.0, buildMonths: 12,
      pipelineM: 6400, commercialM: 1800, infraM: 1400, entitledLots: 46000, landIdx: 68, entMonths: 14, permitDays: 50, waterIdx: 58, topoIdx: 28, shortageIdx: 54,
      visitorsM: 4.6, visitorG: 3.0, visitSpendM: 1500, luxRooms: 1600, adr: 520, occ: 64, seasonIdx: 74,
      repIdx: 66, clubIdx: 84, celebIdx: 56, hospIdx: 62, retailIdx: 46, schoolIdx: 72, privacyIdx: 58, entryBarIdx: 46,
      jetOps: 22, nonstops: 36, metroMin: 30, roadIdx: 80, airInvestM: 260,
      propTax: 0.86, incomeTax: 0, insIdx: 72, regIdx: 30, climIdx: 70, structIdx: 78
    }
  });

  M({
    id: 'amelia-island', name: 'Amelia Island & Nassau County', state: 'FL', stateFips: '12',
    county: 'Nassau County', countyFips: '12089', lat: 30.669, lon: -81.462,
    region: 'Southeast', archetype: 'island', tier: 'emerging', geoScope: 'county',
    blurb: 'Ritz-Carlton and Omni anchor an island market forty minutes from a major airport, with a 24,000-acre timber-company master plan on the mainland behind it.',
    p: {
      pop: 100000, hh: 42000, popCagr5: 2.6, netMig: 24, empCagr5: 2.8, bizFormIdx: 62, medInc: 84000, incCagr5: 4.6,
      hnwiPer1k: 118, hnwiG10: 132, agiIn: 62000, uhnwIdx: 56, shShare: 34, wealthInfraIdx: 30,
      medVal: 560000, luxPpsf: 720, apprec5: 62, dom: 96, cashShare: 54, tx2m: 130, tx5m: 24, tx10m: 4, lotPrice: 720000, landShare: 25,
      sfPermits: 1400, permitCagr3: 5.0, customShare: 26, remodelIdx: 42, costPsf: 450, gcMargin: 18, luxGcCount: 14, tradeIdx: 56, backlog: 8.0, buildMonths: 12,
      pipelineM: 2200, commercialM: 620, infraM: 420, entitledLots: 14000, landIdx: 72, entMonths: 14, permitDays: 50, waterIdx: 60, topoIdx: 30, shortageIdx: 56,
      visitorsM: 1.2, visitorG: 3.5, visitSpendM: 620, luxRooms: 900, adr: 620, occ: 62, seasonIdx: 66,
      repIdx: 62, clubIdx: 66, celebIdx: 44, hospIdx: 68, retailIdx: 34, schoolIdx: 44, privacyIdx: 70, entryBarIdx: 42,
      jetOps: 8, nonstops: 36, metroMin: 40, roadIdx: 68, airInvestM: 60,
      propTax: 0.82, incomeTax: 0, insIdx: 74, regIdx: 30, climIdx: 72, structIdx: 74
    }
  });

  M({
    id: 'boca-grande', name: 'Boca Grande, Sanibel & the Islands', state: 'FL', stateFips: '12',
    county: 'Lee & Charlotte Counties', countyFips: '12071', lat: 26.749, lon: -82.264,
    region: 'Southeast', archetype: 'island', tier: 'mature', geoScope: 'sub',
    blurb: 'Old-money island discretion at the extreme end of the privacy scale, rebuilding after Ian into the most expensive insurance environment in the United States.',
    p: {
      pop: 24000, hh: 12000, popCagr5: 0.6, netMig: 6, empCagr5: 0.8, bizFormIdx: 50, medInc: 108000, incCagr5: 4.0,
      hnwiPer1k: 320, hnwiG10: 96, agiIn: 104000, uhnwIdx: 88, shShare: 68, wealthInfraIdx: 34,
      medVal: 1850000, luxPpsf: 1450, apprec5: 44, dom: 140, cashShare: 78, tx2m: 175, tx5m: 52, tx10m: 14, lotPrice: 3400000, landShare: 34,
      sfPermits: 210, permitCagr3: 12.0, customShare: 70, remodelIdx: 84, costPsf: 850, gcMargin: 18, luxGcCount: 14, tradeIdx: 30, backlog: 12.0, buildMonths: 12,
      pipelineM: 620, commercialM: 160, infraM: 220, entitledLots: 320, landIdx: 10, entMonths: 26, permitDays: 120, waterIdx: 42, topoIdx: 56, shortageIdx: 90,
      visitorsM: 1.4, visitorG: 1.0, visitSpendM: 620, luxRooms: 320, adr: 1150, occ: 52, seasonIdx: 48,
      repIdx: 74, clubIdx: 88, celebIdx: 76, hospIdx: 68, retailIdx: 32, schoolIdx: 32, privacyIdx: 96, entryBarIdx: 94,
      jetOps: 10, nonstops: 20, metroMin: 75, roadIdx: 40, airInvestM: 90,
      propTax: 0.86, incomeTax: 0, insIdx: 96, regIdx: 44, climIdx: 92, structIdx: 54
    }
  });

  M({
    id: 'destin', name: 'Destin & Miramar Beach', state: 'FL', stateFips: '12',
    county: 'Okaloosa County', countyFips: '12091', lat: 30.394, lon: -86.496,
    region: 'Southeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'Enormous rental-driven visitation next door to 30A, at roughly two-thirds of the price per square foot and with a far shallower luxury tier.',
    p: {
      pop: 220000, hh: 88000, popCagr5: 1.4, netMig: 12, empCagr5: 2.0, bizFormIdx: 62, medInc: 74000, incCagr5: 4.2,
      hnwiPer1k: 78, hnwiG10: 128, agiIn: 46000, uhnwIdx: 44, shShare: 46, wealthInfraIdx: 26,
      medVal: 480000, luxPpsf: 720, apprec5: 62, dom: 112, cashShare: 54, tx2m: 190, tx5m: 34, tx10m: 5, lotPrice: 620000, landShare: 26,
      sfPermits: 1500, permitCagr3: 2.0, customShare: 22, remodelIdx: 44, costPsf: 440, gcMargin: 17, luxGcCount: 16, tradeIdx: 58, backlog: 8.0, buildMonths: 12,
      pipelineM: 1900, commercialM: 620, infraM: 320, entitledLots: 8600, landIdx: 48, entMonths: 15, permitDays: 55, waterIdx: 58, topoIdx: 30, shortageIdx: 62,
      visitorsM: 5.0, visitorG: 2.5, visitSpendM: 3600, luxRooms: 1400, adr: 520, occ: 60, seasonIdx: 52,
      repIdx: 58, clubIdx: 46, celebIdx: 38, hospIdx: 46, retailIdx: 34, schoolIdx: 38, privacyIdx: 48, entryBarIdx: 28,
      jetOps: 18, nonstops: 26, metroMin: 60, roadIdx: 62, airInvestM: 160,
      propTax: 0.82, incomeTax: 0, insIdx: 78, regIdx: 30, climIdx: 76, structIdx: 66
    }
  });

})(LCDOS_DATA);

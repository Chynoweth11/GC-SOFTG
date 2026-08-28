/* Market dataset — Texas, Mid-South, Arkansas. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'austin-hill', name: 'Austin & the Hill Country', state: 'TX', stateFips: '48',
    county: 'Travis County', countyFips: '48453', lat: 30.267, lon: -97.743,
    region: 'Central', archetype: 'metro', tier: 'established', geoScope: 'county',
    blurb: 'Enormous wealth creation and the deepest trade base in this dataset, running through a genuine post-2022 permit correction.',
    p: {
      pop: 1370000, hh: 540000, popCagr5: 1.6, netMig: 12, empCagr5: 3.0, bizFormIdx: 88, medInc: 98000, incCagr5: 4.6,
      hnwiPer1k: 118, hnwiG10: 92, agiIn: 62000, uhnwIdx: 78, shShare: 6, wealthInfraIdx: 82,
      medVal: 520000, luxPpsf: 720, apprec5: 42, dom: 88, cashShare: 34, tx2m: 980, tx5m: 175, tx10m: 34, lotPrice: 900000, landShare: 26,
      sfPermits: 9800, permitCagr3: -4.0, customShare: 13, remodelIdx: 66, costPsf: 420, gcMargin: 15, luxGcCount: 62, tradeIdx: 70, backlog: 7.5, buildMonths: 12,
      pipelineM: 24000, commercialM: 9500, infraM: 4200, entitledLots: 62000, landIdx: 62, entMonths: 18, permitDays: 95, waterIdx: 40, topoIdx: 44, shortageIdx: 58,
      visitorsM: 22.0, visitorG: 2.0, visitSpendM: 9500, luxRooms: 4600, adr: 420, occ: 64, seasonIdx: 84,
      repIdx: 82, clubIdx: 66, celebIdx: 78, hospIdx: 74, retailIdx: 66, schoolIdx: 62, privacyIdx: 50, entryBarIdx: 44,
      jetOps: 62, nonstops: 90, metroMin: 5, roadIdx: 66, airInvestM: 1800,
      propTax: 1.68, incomeTax: 0, insIdx: 52, regIdx: 42, climIdx: 58, structIdx: 76
    },
    anchors: [
      { fact: 'Austin recorded 90% millionaire growth over the decade to 2024, among the highest of any large U.S. city.', src: 'Henley & Partners, USA Wealth Report 2025', date: '2025-05', url: 'https://www.henleyglobal.com/publications/usa-wealth-report-2025/top-10-wealthiest-cities-usa' }
    ]
  });

  M({
    id: 'fredericksburg', name: 'Fredericksburg & the Texas Hill Country', state: 'TX', stateFips: '48',
    county: 'Gillespie County', countyFips: '48171', lat: 30.275, lon: -98.872,
    region: 'Central', archetype: 'wine', tier: 'frontier', geoScope: 'county',
    blurb: 'Texas wine country, an hour and a quarter from two major metros, with a seasonal-housing share above 30% and groundwater as the hard limit.',
    p: {
      pop: 27500, hh: 11500, popCagr5: 1.2, netMig: 13, empCagr5: 1.6, bizFormIdx: 58, medInc: 72000, incCagr5: 4.4,
      hnwiPer1k: 110, hnwiG10: 138, agiIn: 58000, uhnwIdx: 48, shShare: 32, wealthInfraIdx: 20,
      medVal: 620000, luxPpsf: 660, apprec5: 66, dom: 116, cashShare: 58, tx2m: 62, tx5m: 12, tx10m: 2, lotPrice: 620000, landShare: 26,
      sfPermits: 260, permitCagr3: 4.0, customShare: 56, remodelIdx: 32, costPsf: 390, gcMargin: 20, luxGcCount: 9, tradeIdx: 42, backlog: 8.5, buildMonths: 11,
      pipelineM: 380, commercialM: 130, infraM: 85, entitledLots: 1400, landIdx: 72, entMonths: 12, permitDays: 45, waterIdx: 32, topoIdx: 44, shortageIdx: 66,
      visitorsM: 2.4, visitorG: 3.0, visitSpendM: 520, luxRooms: 260, adr: 480, occ: 54, seasonIdx: 66,
      repIdx: 58, clubIdx: 40, celebIdx: 42, hospIdx: 52, retailIdx: 34, schoolIdx: 24, privacyIdx: 82, entryBarIdx: 32,
      jetOps: 5, nonstops: 0, metroMin: 75, roadIdx: 52, airInvestM: 25,
      propTax: 1.42, incomeTax: 0, insIdx: 48, regIdx: 22, climIdx: 54, structIdx: 70
    }
  });

  M({
    id: 'dallas-park-cities', name: 'Dallas Park Cities & Westlake', state: 'TX', stateFips: '48',
    county: 'Dallas & Tarrant Counties', countyFips: '48113', lat: 32.836, lon: -96.803,
    region: 'Central', archetype: 'suburb', tier: 'established', geoScope: 'sub',
    blurb: 'The largest teardown-and-rebuild market in America, with roughly 88 established luxury GCs and the deepest corporate-relocation demand in the country.',
    p: {
      pop: 340000, hh: 130000, popCagr5: 1.4, netMig: 12, empCagr5: 3.0, bizFormIdx: 82, medInc: 132000, incCagr5: 4.6,
      hnwiPer1k: 195, hnwiG10: 118, agiIn: 82000, uhnwIdx: 88, shShare: 4, wealthInfraIdx: 92,
      medVal: 1050000, luxPpsf: 880, apprec5: 48, dom: 72, cashShare: 40, tx2m: 1450, tx5m: 260, tx10m: 46, lotPrice: 1900000, landShare: 34,
      sfPermits: 3200, permitCagr3: 0.5, customShare: 24, remodelIdx: 84, costPsf: 470, gcMargin: 15, luxGcCount: 88, tradeIdx: 68, backlog: 8.5, buildMonths: 12,
      pipelineM: 22000, commercialM: 11000, infraM: 3800, entitledLots: 34000, landIdx: 46, entMonths: 14, permitDays: 70, waterIdx: 56, topoIdx: 26, shortageIdx: 54,
      visitorsM: 29.0, visitorG: 2.5, visitSpendM: 12000, luxRooms: 7200, adr: 420, occ: 66, seasonIdx: 86,
      repIdx: 82, clubIdx: 88, celebIdx: 74, hospIdx: 80, retailIdx: 88, schoolIdx: 88, privacyIdx: 56, entryBarIdx: 76,
      jetOps: 88, nonstops: 190, metroMin: 5, roadIdx: 84, airInvestM: 2200,
      propTax: 1.62, incomeTax: 0, insIdx: 58, regIdx: 26, climIdx: 52, structIdx: 74
    }
  });

  M({
    id: 'houston-woodlands', name: 'Houston, Memorial & The Woodlands', state: 'TX', stateFips: '48',
    county: 'Harris & Montgomery Counties', countyFips: '48201', lat: 29.760, lon: -95.370,
    region: 'Central', archetype: 'metro', tier: 'established', geoScope: 'sub',
    blurb: 'Enormous energy wealth, essentially no zoning, and the cheapest entitlement path of any large market in America — offset by flood risk that reprices every five years.',
    p: {
      pop: 780000, hh: 280000, popCagr5: 1.6, netMig: 11, empCagr5: 2.4, bizFormIdx: 78, medInc: 122000, incCagr5: 4.2,
      hnwiPer1k: 175, hnwiG10: 96, agiIn: 66000, uhnwIdx: 88, shShare: 5, wealthInfraIdx: 88,
      medVal: 620000, luxPpsf: 700, apprec5: 40, dom: 88, cashShare: 36, tx2m: 1250, tx5m: 220, tx10m: 42, lotPrice: 1200000, landShare: 28,
      sfPermits: 6800, permitCagr3: 0.0, customShare: 16, remodelIdx: 76, costPsf: 400, gcMargin: 15, luxGcCount: 82, tradeIdx: 72, backlog: 8.0, buildMonths: 12,
      pipelineM: 26000, commercialM: 12000, infraM: 4600, entitledLots: 58000, landIdx: 68, entMonths: 12, permitDays: 60, waterIdx: 58, topoIdx: 24, shortageIdx: 46,
      visitorsM: 24.0, visitorG: 2.0, visitSpendM: 9200, luxRooms: 5600, adr: 380, occ: 62, seasonIdx: 86,
      repIdx: 70, clubIdx: 82, celebIdx: 62, hospIdx: 76, retailIdx: 82, schoolIdx: 84, privacyIdx: 54, entryBarIdx: 68,
      jetOps: 82, nonstops: 180, metroMin: 5, roadIdx: 78, airInvestM: 2600,
      propTax: 1.78, incomeTax: 0, insIdx: 76, regIdx: 20, climIdx: 76, structIdx: 66
    }
  });

  M({
    id: 'bentonville', name: 'Bentonville & Northwest Arkansas', state: 'AR', stateFips: '05',
    county: 'Benton County', countyFips: '05007', lat: 36.372, lon: -94.208,
    region: 'Central', archetype: 'suburb', tier: 'emerging', geoScope: 'county',
    blurb: 'A single family is deliberately building a cultural capital in the Ozarks — museum, medical school, trail network, airport — and the luxury tier is quadrupling off a base of almost nothing.',
    p: {
      pop: 320000, hh: 118000, popCagr5: 3.0, netMig: 24, empCagr5: 3.6, bizFormIdx: 78, medInc: 82000, incCagr5: 5.2,
      hnwiPer1k: 96, hnwiG10: 185, agiIn: 54000, uhnwIdx: 84, shShare: 5, wealthInfraIdx: 72,
      medVal: 420000, luxPpsf: 520, apprec5: 71, dom: 62, cashShare: 32, tx2m: 240, tx5m: 40, tx10m: 7, lotPrice: 480000, landShare: 22,
      sfPermits: 4400, permitCagr3: 6.5, customShare: 14, remodelIdx: 42, costPsf: 315, gcMargin: 17, luxGcCount: 18, tradeIdx: 62, backlog: 9.0, buildMonths: 10,
      pipelineM: 8600, commercialM: 3600, infraM: 1400, entitledLots: 28000, landIdx: 76, entMonths: 12, permitDays: 45, waterIdx: 74, topoIdx: 38, shortageIdx: 76,
      visitorsM: 7.2, visitorG: 6.0, visitSpendM: 1400, luxRooms: 620, adr: 320, occ: 64, seasonIdx: 80,
      repIdx: 58, clubIdx: 62, celebIdx: 62, hospIdx: 56, retailIdx: 40, schoolIdx: 58, privacyIdx: 64, entryBarIdx: 40,
      jetOps: 26, nonstops: 24, metroMin: 5, roadIdx: 74, airInvestM: 320,
      propTax: 0.62, incomeTax: 3.9, insIdx: 38, regIdx: 22, climIdx: 46, structIdx: 84
    },
    anchors: [
      { fact: 'Walmart opened its new 350-400 acre home office campus in Bentonville in January 2025, the company\'s largest single investment in the region.', src: 'Talk Business & Politics / Yahoo Finance', date: '2025-01', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' },
      { fact: 'The Alice L. Walton School of Medicine and the Heartland Whole Health Institute opened in 2025 on the 134-acre Bentonville campus that also holds Crystal Bridges, which is undergoing a 114,000 sf expansion.', src: 'Talk Business & Politics', date: '2025', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' },
      { fact: 'Homes sold above $1M in Benton County increased more than fourfold in five years; 370 new listings above $1M were recorded year-to-date in 2025.', src: 'NWA Look luxury market analysis', date: '2025', url: 'https://www.nwalook.com/million-dollar-momentum-past-5-years-of-luxury-market-growth-in-northwest-arkansas/' },
      { fact: 'Regional home prices rose 70.9% and median multifamily rents nearly 50% over the study period, against population growth outpacing housing availability.', src: 'Walton Family Foundation NWA housing report', date: '2025', url: 'https://www.waltonfamilyfoundation.org/new-housing-report-highlights-action-needed-in-northwest-arkansas-as-population-growth-outpaces-housing-availability' },
      { fact: 'Bentonville issued a $42.26 million permit for a five-storey, 300-unit multifamily complex serving the medical school and wider community.', src: 'Talk Business & Politics', date: '2025', url: 'https://talkbusiness.net/2026/01/year-in-review-top-10-nwa-stories-of-2025/' }
    ]
  });

  M({
    id: 'nashville', name: 'Nashville & Belle Meade', state: 'TN', stateFips: '47',
    county: 'Davidson County', countyFips: '47037', lat: 36.163, lon: -86.781,
    region: 'Central', archetype: 'metro', tier: 'established', geoScope: 'county',
    blurb: 'No state income tax, a huge corporate relocation pipeline and 17 million visitors — with a permit count that has been falling for three years.',
    p: {
      pop: 700000, hh: 300000, popCagr5: 0.8, netMig: 5, empCagr5: 2.4, bizFormIdx: 78, medInc: 76000, incCagr5: 4.6,
      hnwiPer1k: 108, hnwiG10: 132, agiIn: 52000, uhnwIdx: 76, shShare: 5, wealthInfraIdx: 76,
      medVal: 470000, luxPpsf: 680, apprec5: 52, dom: 74, cashShare: 32, tx2m: 420, tx5m: 70, tx10m: 14, lotPrice: 750000, landShare: 26,
      sfPermits: 3200, permitCagr3: -3.0, customShare: 18, remodelIdx: 68, costPsf: 390, gcMargin: 16, luxGcCount: 44, tradeIdx: 64, backlog: 8.5, buildMonths: 11,
      pipelineM: 16000, commercialM: 7200, infraM: 2800, entitledLots: 22000, landIdx: 44, entMonths: 16, permitDays: 70, waterIdx: 68, topoIdx: 40, shortageIdx: 68,
      visitorsM: 17.0, visitorG: 3.0, visitSpendM: 9800, luxRooms: 4200, adr: 380, occ: 68, seasonIdx: 86,
      repIdx: 82, clubIdx: 68, celebIdx: 88, hospIdx: 74, retailIdx: 58, schoolIdx: 72, privacyIdx: 48, entryBarIdx: 56,
      jetOps: 44, nonstops: 100, metroMin: 5, roadIdx: 72, airInvestM: 1800,
      propTax: 0.74, incomeTax: 0, insIdx: 46, regIdx: 34, climIdx: 50, structIdx: 78
    }
  });

  M({
    id: 'franklin-tn', name: 'Franklin & Williamson County', state: 'TN', stateFips: '47',
    county: 'Williamson County', countyFips: '47187', lat: 35.925, lon: -86.869,
    region: 'Central', archetype: 'suburb', tier: 'emerging', geoScope: 'county',
    blurb: 'The wealthiest county in Tennessee, the best schools in the state, no income tax, and a $165M downtown mixed-use scheme pricing residences above $2M.',
    p: {
      pop: 270000, hh: 96000, popCagr5: 2.6, netMig: 21, empCagr5: 3.2, bizFormIdx: 76, medInc: 138000, incCagr5: 4.8,
      hnwiPer1k: 205, hnwiG10: 158, agiIn: 88000, uhnwIdx: 76, shShare: 4, wealthInfraIdx: 72,
      medVal: 920000, luxPpsf: 640, apprec5: 58, dom: 68, cashShare: 36, tx2m: 480, tx5m: 78, tx10m: 14, lotPrice: 900000, landShare: 26,
      sfPermits: 2600, permitCagr3: 2.0, customShare: 20, remodelIdx: 52, costPsf: 375, gcMargin: 16, luxGcCount: 34, tradeIdx: 62, backlog: 8.5, buildMonths: 11,
      pipelineM: 5600, commercialM: 1900, infraM: 900, entitledLots: 18000, landIdx: 52, entMonths: 18, permitDays: 60, waterIdx: 66, topoIdx: 40, shortageIdx: 72,
      visitorsM: 3.2, visitorG: 3.5, visitSpendM: 1100, luxRooms: 620, adr: 340, occ: 66, seasonIdx: 84,
      repIdx: 62, clubIdx: 68, celebIdx: 78, hospIdx: 52, retailIdx: 46, schoolIdx: 88, privacyIdx: 62, entryBarIdx: 42,
      jetOps: 20, nonstops: 100, metroMin: 25, roadIdx: 78, airInvestM: 380,
      propTax: 0.56, incomeTax: 0, insIdx: 44, regIdx: 32, climIdx: 48, structIdx: 82
    },
    anchors: [
      { fact: 'The Margin District is a $165 million mixed-use development one block from Five Points in downtown Franklin, including 25 luxury residences starting just above $2 million.', src: 'Franklin development reporting', date: '2026-01', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' },
      { fact: 'Two new residential communities launched in 2026: Franklin Ridge by Toll Brothers (34 luxury single-family homes) and Wyelea (68 estate homesites on nearly 600 acres off Del Rio Pike).', src: 'Franklin development reporting', date: '2026-01', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' },
      { fact: 'New-construction four- and five-bedroom homes in Franklin\'s top school zones average roughly $1.2 million in 2026; Franklin\'s 2026 median is $919,000 across 2,114 closings.', src: 'Williamson County market reporting', date: '2026', url: 'https://nashvillehome.guru/luxury-homes-in-franklin-tn-williamson-county/' },
      { fact: 'In-N-Out Burger is building its Eastern Territory corporate headquarters, an approximately 100,000 sf campus adjacent to Berry Farms, targeted for completion in late 2026.', src: 'Franklin development reporting', date: '2026-01', url: 'https://www.wallacegrouptn.com/blog/new-developments-franklin-tn-2026' }
    ]
  });

  M({
    id: 'chattanooga', name: 'Chattanooga & Lookout Mountain', state: 'TN', stateFips: '47',
    county: 'Hamilton County', countyFips: '47065', lat: 35.046, lon: -85.310,
    region: 'Central', archetype: 'mountain', tier: 'frontier', geoScope: 'county',
    blurb: 'Gigabit fibre, a serious outdoor-recreation identity, automotive manufacturing next door, and land at a third of Nashville pricing.',
    p: {
      pop: 380000, hh: 155000, popCagr5: 1.0, netMig: 9, empCagr5: 1.8, bizFormIdx: 64, medInc: 68000, incCagr5: 4.2,
      hnwiPer1k: 76, hnwiG10: 112, agiIn: 38000, uhnwIdx: 54, shShare: 6, wealthInfraIdx: 42,
      medVal: 340000, luxPpsf: 500, apprec5: 56, dom: 68, cashShare: 34, tx2m: 110, tx5m: 18, tx10m: 3, lotPrice: 380000, landShare: 22,
      sfPermits: 2100, permitCagr3: 2.5, customShare: 16, remodelIdx: 44, costPsf: 305, gcMargin: 17, luxGcCount: 14, tradeIdx: 64, backlog: 8.0, buildMonths: 11,
      pipelineM: 5200, commercialM: 2200, infraM: 1100, entitledLots: 14000, landIdx: 66, entMonths: 15, permitDays: 55, waterIdx: 74, topoIdx: 52, shortageIdx: 58,
      visitorsM: 6.8, visitorG: 2.5, visitSpendM: 1600, luxRooms: 620, adr: 300, occ: 62, seasonIdx: 80,
      repIdx: 52, clubIdx: 60, celebIdx: 34, hospIdx: 46, retailIdx: 32, schoolIdx: 56, privacyIdx: 62, entryBarIdx: 34,
      jetOps: 12, nonstops: 14, metroMin: 5, roadIdx: 78, airInvestM: 220,
      propTax: 0.62, incomeTax: 0, insIdx: 40, regIdx: 26, climIdx: 48, structIdx: 74
    }
  });

})(LCDOS_DATA);

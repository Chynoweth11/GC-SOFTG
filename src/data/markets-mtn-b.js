/* Market dataset — Mountain West B: Colorado, Sierra Nevada, New Mexico, Arizona. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'aspen', name: 'Aspen & the Roaring Fork', state: 'CO', stateFips: '08',
    county: 'Pitkin County', countyFips: '08097', lat: 39.191, lon: -106.818,
    region: 'Mountain West', archetype: 'ski', tier: 'mature', geoScope: 'county',
    blurb: 'The most expensive residential real estate in the United States, a fourteen-month contractor backlog, and roughly 260 entitled lots left in the entire county.',
    p: {
      pop: 17500, hh: 7800, popCagr5: 0.2, netMig: 1, empCagr5: 0.8, bizFormIdx: 56, medInc: 122000, incCagr5: 4.0,
      hnwiPer1k: 310, hnwiG10: 88, agiIn: 132000, uhnwIdx: 98, shShare: 58, wealthInfraIdx: 74,
      medVal: 3450000, luxPpsf: 2650, apprec5: 72, dom: 128, cashShare: 74, tx2m: 340, tx5m: 145, tx10m: 58, lotPrice: 7500000, landShare: 44,
      sfPermits: 95, permitCagr3: -3.0, customShare: 80, remodelIdx: 84, costPsf: 1450, gcMargin: 15, luxGcCount: 48, tradeIdx: 22, backlog: 14.0, buildMonths: 7,
      pipelineM: 900, commercialM: 320, infraM: 180, entitledLots: 260, landIdx: 8, entMonths: 34, permitDays: 150, waterIdx: 50, topoIdx: 88, shortageIdx: 96,
      visitorsM: 2.1, visitorG: 0.8, visitSpendM: 1350, luxRooms: 1650, adr: 1750, occ: 58, seasonIdx: 66,
      repIdx: 98, clubIdx: 86, celebIdx: 98, hospIdx: 94, retailIdx: 92, schoolIdx: 50, privacyIdx: 62, entryBarIdx: 94,
      jetOps: 28, nonstops: 12, metroMin: 210, roadIdx: 40, airInvestM: 220,
      propTax: 0.42, incomeTax: 4.4, insIdx: 34, regIdx: 74, climIdx: 34, structIdx: 66
    }
  });

  M({
    id: 'vail', name: 'Vail Valley & Eagle County', state: 'CO', stateFips: '08',
    county: 'Eagle County', countyFips: '08037', lat: 39.640, lon: -106.374,
    region: 'Mountain West', archetype: 'ski', tier: 'mature', geoScope: 'county',
    blurb: 'A mature, fully-built resort corridor where the work is remodels and teardowns, and the developable ground sits down-valley in Edwards and Gypsum.',
    p: {
      pop: 55500, hh: 22000, popCagr5: 0.6, netMig: 3, empCagr5: 1.4, bizFormIdx: 56, medInc: 108000, incCagr5: 4.0,
      hnwiPer1k: 178, hnwiG10: 92, agiIn: 68000, uhnwIdx: 86, shShare: 54, wealthInfraIdx: 54,
      medVal: 1450000, luxPpsf: 1650, apprec5: 64, dom: 108, cashShare: 62, tx2m: 420, tx5m: 105, tx10m: 26, lotPrice: 2600000, landShare: 34,
      sfPermits: 320, permitCagr3: -1.0, customShare: 58, remodelIdx: 76, costPsf: 950, gcMargin: 15, luxGcCount: 46, tradeIdx: 32, backlog: 12.0, buildMonths: 7,
      pipelineM: 1600, commercialM: 560, infraM: 280, entitledLots: 1400, landIdx: 20, entMonths: 28, permitDays: 110, waterIdx: 46, topoIdx: 84, shortageIdx: 92,
      visitorsM: 3.4, visitorG: 1.2, visitSpendM: 1750, luxRooms: 3100, adr: 1150, occ: 56, seasonIdx: 64,
      repIdx: 90, clubIdx: 80, celebIdx: 78, hospIdx: 84, retailIdx: 70, schoolIdx: 48, privacyIdx: 60, entryBarIdx: 80,
      jetOps: 22, nonstops: 14, metroMin: 150, roadIdx: 62, airInvestM: 140,
      propTax: 0.44, incomeTax: 4.4, insIdx: 34, regIdx: 68, climIdx: 34, structIdx: 68
    }
  });

  M({
    id: 'steamboat', name: 'Steamboat Springs & Routt County', state: 'CO', stateFips: '08',
    county: 'Routt County', countyFips: '08107', lat: 40.485, lon: -106.831,
    region: 'Mountain West', archetype: 'ski', tier: 'established', geoScope: 'county',
    blurb: 'A working ranch valley that has been re-rated by a nine-figure base-area reinvestment, with more developable ground than any other Colorado ski town of its class.',
    p: {
      pop: 25500, hh: 11000, popCagr5: 1.3, netMig: 10, empCagr5: 1.8, bizFormIdx: 58, medInc: 96000, incCagr5: 4.4,
      hnwiPer1k: 132, hnwiG10: 118, agiIn: 54000, uhnwIdx: 62, shShare: 46, wealthInfraIdx: 36,
      medVal: 1180000, luxPpsf: 1100, apprec5: 74, dom: 102, cashShare: 54, tx2m: 145, tx5m: 30, tx10m: 6, lotPrice: 1250000, landShare: 27,
      sfPermits: 260, permitCagr3: 4.0, customShare: 52, remodelIdx: 52, costPsf: 700, gcMargin: 17, luxGcCount: 18, tradeIdx: 40, backlog: 10.0, buildMonths: 7,
      pipelineM: 1500, commercialM: 480, infraM: 160, entitledLots: 2400, landIdx: 46, entMonths: 22, permitDays: 85, waterIdx: 56, topoIdx: 66, shortageIdx: 86,
      visitorsM: 1.5, visitorG: 3.5, visitSpendM: 640, luxRooms: 900, adr: 780, occ: 52, seasonIdx: 58,
      repIdx: 68, clubIdx: 58, celebIdx: 52, hospIdx: 58, retailIdx: 38, schoolIdx: 36, privacyIdx: 72, entryBarIdx: 50,
      jetOps: 12, nonstops: 12, metroMin: 210, roadIdx: 52, airInvestM: 90,
      propTax: 0.46, incomeTax: 4.4, insIdx: 32, regIdx: 58, climIdx: 34, structIdx: 72
    }
  });

  M({
    id: 'telluride', name: 'Telluride & San Miguel County', state: 'CO', stateFips: '08',
    county: 'San Miguel County', countyFips: '08113', lat: 37.937, lon: -107.812,
    region: 'Mountain West', archetype: 'ski', tier: 'mature', geoScope: 'county',
    blurb: 'Extreme prestige and extreme physical constraint: a box canyon with almost no buildable ground and a trade base that has to be flown or driven in.',
    p: {
      pop: 8200, hh: 3600, popCagr5: 0.7, netMig: 5, empCagr5: 1.2, bizFormIdx: 54, medInc: 92000, incCagr5: 4.2,
      hnwiPer1k: 265, hnwiG10: 96, agiIn: 92000, uhnwIdx: 90, shShare: 62, wealthInfraIdx: 34,
      medVal: 2450000, luxPpsf: 2050, apprec5: 82, dom: 132, cashShare: 70, tx2m: 130, tx5m: 46, tx10m: 15, lotPrice: 3200000, landShare: 38,
      sfPermits: 70, permitCagr3: 1.0, customShare: 80, remodelIdx: 62, costPsf: 1250, gcMargin: 16, luxGcCount: 16, tradeIdx: 20, backlog: 13.0, buildMonths: 6,
      pipelineM: 420, commercialM: 150, infraM: 90, entitledLots: 380, landIdx: 12, entMonths: 32, permitDays: 130, waterIdx: 52, topoIdx: 92, shortageIdx: 94,
      visitorsM: 0.6, visitorG: 2.0, visitSpendM: 420, luxRooms: 620, adr: 1250, occ: 50, seasonIdx: 56,
      repIdx: 82, clubIdx: 62, celebIdx: 82, hospIdx: 76, retailIdx: 46, schoolIdx: 34, privacyIdx: 92, entryBarIdx: 84,
      jetOps: 8, nonstops: 5, metroMin: 240, roadIdx: 30, airInvestM: 55,
      propTax: 0.44, incomeTax: 4.4, insIdx: 32, regIdx: 70, climIdx: 34, structIdx: 62
    }
  });

  M({
    id: 'crested-butte', name: 'Crested Butte & the Gunnison Valley', state: 'CO', stateFips: '08',
    county: 'Gunnison County', countyFips: '08051', lat: 38.869, lon: -106.988,
    region: 'Mountain West', archetype: 'ski', tier: 'emerging', geoScope: 'county',
    blurb: 'The last relatively affordable Colorado ski town, appreciating faster than any of them, with a contractor base of roughly a dozen firms.',
    p: {
      pop: 17500, hh: 7400, popCagr5: 1.1, netMig: 9, empCagr5: 1.6, bizFormIdx: 54, medInc: 78000, incCagr5: 4.4,
      hnwiPer1k: 118, hnwiG10: 122, agiIn: 48000, uhnwIdx: 58, shShare: 52, wealthInfraIdx: 24,
      medVal: 1050000, luxPpsf: 1100, apprec5: 88, dom: 118, cashShare: 60, tx2m: 78, tx5m: 16, tx10m: 3, lotPrice: 950000, landShare: 26,
      sfPermits: 140, permitCagr3: 5.0, customShare: 64, remodelIdx: 40, costPsf: 720, gcMargin: 18, luxGcCount: 11, tradeIdx: 26, backlog: 11.5, buildMonths: 6,
      pipelineM: 480, commercialM: 160, infraM: 85, entitledLots: 900, landIdx: 34, entMonths: 26, permitDays: 95, waterIdx: 54, topoIdx: 82, shortageIdx: 92,
      visitorsM: 0.7, visitorG: 4.0, visitSpendM: 260, luxRooms: 320, adr: 720, occ: 46, seasonIdx: 50,
      repIdx: 60, clubIdx: 44, celebIdx: 50, hospIdx: 46, retailIdx: 26, schoolIdx: 28, privacyIdx: 86, entryBarIdx: 52,
      jetOps: 6, nonstops: 6, metroMin: 240, roadIdx: 32, airInvestM: 45,
      propTax: 0.44, incomeTax: 4.4, insIdx: 32, regIdx: 62, climIdx: 34, structIdx: 68
    }
  });

  M({
    id: 'summit-co', name: 'Breckenridge & Summit County', state: 'CO', stateFips: '08',
    county: 'Summit County', countyFips: '08117', lat: 39.482, lon: -106.039,
    region: 'Mountain West', archetype: 'ski', tier: 'established', geoScope: 'county',
    blurb: 'The highest-volume Colorado ski county by visitation, ninety minutes from Denver, and effectively out of developable land inside the county line.',
    p: {
      pop: 31500, hh: 13000, popCagr5: 0.8, netMig: 5, empCagr5: 1.4, bizFormIdx: 56, medInc: 96000, incCagr5: 4.0,
      hnwiPer1k: 128, hnwiG10: 98, agiIn: 46000, uhnwIdx: 62, shShare: 64, wealthInfraIdx: 34,
      medVal: 1150000, luxPpsf: 1150, apprec5: 62, dom: 96, cashShare: 56, tx2m: 240, tx5m: 42, tx10m: 7, lotPrice: 1150000, landShare: 28,
      sfPermits: 210, permitCagr3: -2.0, customShare: 48, remodelIdx: 66, costPsf: 730, gcMargin: 16, luxGcCount: 26, tradeIdx: 34, backlog: 11.0, buildMonths: 6,
      pipelineM: 800, commercialM: 300, infraM: 160, entitledLots: 800, landIdx: 16, entMonths: 26, permitDays: 100, waterIdx: 50, topoIdx: 86, shortageIdx: 94,
      visitorsM: 3.6, visitorG: 1.0, visitSpendM: 1150, luxRooms: 1200, adr: 720, occ: 56, seasonIdx: 62,
      repIdx: 74, clubIdx: 52, celebIdx: 50, hospIdx: 58, retailIdx: 40, schoolIdx: 34, privacyIdx: 52, entryBarIdx: 56,
      jetOps: 9, nonstops: 0, metroMin: 90, roadIdx: 66, airInvestM: 60,
      propTax: 0.46, incomeTax: 4.4, insIdx: 32, regIdx: 66, climIdx: 34, structIdx: 64
    }
  });

  M({
    id: 'durango', name: 'Durango & the Animas Valley', state: 'CO', stateFips: '08',
    county: 'La Plata County', countyFips: '08067', lat: 37.275, lon: -107.880,
    region: 'Mountain West', archetype: 'mountain', tier: 'frontier', geoScope: 'county',
    blurb: 'Southwest Colorado\'s only real town, with genuine amenity value and a luxury tier that has never had more than about ten capable builders.',
    p: {
      pop: 57000, hh: 23500, popCagr5: 1.0, netMig: 8, empCagr5: 1.6, bizFormIdx: 56, medInc: 76000, incCagr5: 4.2,
      hnwiPer1k: 74, hnwiG10: 112, agiIn: 34000, uhnwIdx: 44, shShare: 24, wealthInfraIdx: 26,
      medVal: 720000, luxPpsf: 660, apprec5: 62, dom: 92, cashShare: 44, tx2m: 52, tx5m: 9, tx10m: 2, lotPrice: 480000, landShare: 22,
      sfPermits: 340, permitCagr3: 1.5, customShare: 32, remodelIdx: 34, costPsf: 450, gcMargin: 17, luxGcCount: 10, tradeIdx: 48, backlog: 8.0, buildMonths: 8,
      pipelineM: 620, commercialM: 220, infraM: 140, entitledLots: 2600, landIdx: 54, entMonths: 20, permitDays: 70, waterIdx: 48, topoIdx: 62, shortageIdx: 72,
      visitorsM: 1.4, visitorG: 2.5, visitSpendM: 380, luxRooms: 260, adr: 420, occ: 54, seasonIdx: 62,
      repIdx: 46, clubIdx: 40, celebIdx: 34, hospIdx: 40, retailIdx: 26, schoolIdx: 30, privacyIdx: 70, entryBarIdx: 30,
      jetOps: 7, nonstops: 6, metroMin: 240, roadIdx: 44, airInvestM: 90,
      propTax: 0.46, incomeTax: 4.4, insIdx: 30, regIdx: 52, climIdx: 36, structIdx: 66
    }
  });

  M({
    id: 'boulder', name: 'Boulder & the Front Range Foothills', state: 'CO', stateFips: '08',
    county: 'Boulder County', countyFips: '08013', lat: 40.015, lon: -105.271,
    region: 'Mountain West', archetype: 'metro', tier: 'mature', geoScope: 'county',
    blurb: 'Deep wealth, world-class remodel demand, and the most restrictive growth-control regime in the Mountain West — the negative control for land opportunity.',
    p: {
      pop: 330000, hh: 132000, popCagr5: 0.1, netMig: -3, empCagr5: 1.2, bizFormIdx: 72, medInc: 106000, incCagr5: 4.0,
      hnwiPer1k: 148, hnwiG10: 94, agiIn: 28000, uhnwIdx: 66, shShare: 5, wealthInfraIdx: 72,
      medVal: 1020000, luxPpsf: 850, apprec5: 42, dom: 58, cashShare: 34, tx2m: 420, tx5m: 62, tx10m: 10, lotPrice: 900000, landShare: 32,
      sfPermits: 480, permitCagr3: -4.0, customShare: 28, remodelIdx: 72, costPsf: 540, gcMargin: 15, luxGcCount: 32, tradeIdx: 46, backlog: 8.5, buildMonths: 9,
      pipelineM: 1900, commercialM: 900, infraM: 380, entitledLots: 2200, landIdx: 14, entMonths: 30, permitDays: 120, waterIdx: 44, topoIdx: 60, shortageIdx: 88,
      visitorsM: 4.2, visitorG: 1.5, visitSpendM: 1050, luxRooms: 620, adr: 380, occ: 62, seasonIdx: 82,
      repIdx: 68, clubIdx: 44, celebIdx: 44, hospIdx: 54, retailIdx: 48, schoolIdx: 52, privacyIdx: 40, entryBarIdx: 52,
      jetOps: 14, nonstops: 200, metroMin: 30, roadIdx: 74, airInvestM: 120,
      propTax: 0.52, incomeTax: 4.4, insIdx: 32, regIdx: 88, climIdx: 36, structIdx: 52
    }
  });

  M({
    id: 'truckee-tahoe', name: 'Truckee & North Lake Tahoe', state: 'CA', stateFips: '06',
    county: 'Nevada & Placer Counties', countyFips: '06057', lat: 39.328, lon: -120.183,
    region: 'West', archetype: 'ski', tier: 'established', geoScope: 'sub',
    blurb: 'A tier-one private club ecosystem — Martis Camp, Lahontan, Schaffer\'s Mill — sitting inside California\'s wildfire insurance crisis and the TRPA regulatory regime.',
    p: {
      pop: 46000, hh: 19000, popCagr5: 0.6, netMig: 4, empCagr5: 1.2, bizFormIdx: 58, medInc: 112000, incCagr5: 4.0,
      hnwiPer1k: 195, hnwiG10: 104, agiIn: 62000, uhnwIdx: 82, shShare: 56, wealthInfraIdx: 48,
      medVal: 1180000, luxPpsf: 1250, apprec5: 54, dom: 108, cashShare: 56, tx2m: 300, tx5m: 72, tx10m: 16, lotPrice: 1900000, landShare: 32,
      sfPermits: 240, permitCagr3: -3.0, customShare: 64, remodelIdx: 66, costPsf: 780, gcMargin: 15, luxGcCount: 32, tradeIdx: 30, backlog: 11.5, buildMonths: 6,
      pipelineM: 1600, commercialM: 620, infraM: 240, entitledLots: 1600, landIdx: 20, entMonths: 32, permitDays: 140, waterIdx: 54, topoIdx: 82, shortageIdx: 92,
      visitorsM: 5.8, visitorG: 1.0, visitSpendM: 1650, luxRooms: 1400, adr: 880, occ: 54, seasonIdx: 64,
      repIdx: 80, clubIdx: 82, celebIdx: 74, hospIdx: 70, retailIdx: 44, schoolIdx: 40, privacyIdx: 78, entryBarIdx: 82,
      jetOps: 24, nonstops: 0, metroMin: 45, roadIdx: 46, airInvestM: 80,
      propTax: 0.72, incomeTax: 13.3, insIdx: 76, regIdx: 92, climIdx: 62, structIdx: 50
    },
    anchors: [
      { fact: 'Martis Camp Club purchased the former Mourelatos Lakeshore Resort, a 3.2-acre lakefront parcel with 275 feet of Lake Tahoe shoreline, for private member use.', src: 'SFGATE', date: '2026-01', url: 'https://www.sfgate.com/renotahoe/article/martis-camp-buys-lake-tahoe-resort-21197298.php' },
      { fact: 'Palisades Tahoe finalised a 25-year Village expansion plan in July 2025; the Base-to-Base Gondola continues to support pricing on both sides of the resort.', src: 'Truckee-North Tahoe mid-year market report', date: '2025-07', url: 'https://chrisfajkosrealestate.com/real-estate-blog/2025-truckee-tahoe-mid-year-market-update/' }
    ]
  });

  M({
    id: 'reno-tahoe', name: 'Reno, Incline Village & Douglas', state: 'NV', stateFips: '32',
    county: 'Washoe & Douglas Counties', countyFips: '32031', lat: 39.530, lon: -119.814,
    region: 'West', archetype: 'metro', tier: 'emerging', geoScope: 'county',
    blurb: 'The no-income-tax side of the same lake, with an industrial base, a real airport and thirty times the developable land of the California shore.',
    p: {
      pop: 510000, hh: 200000, popCagr5: 1.4, netMig: 11, empCagr5: 2.6, bizFormIdx: 70, medInc: 82000, incCagr5: 4.6,
      hnwiPer1k: 92, hnwiG10: 138, agiIn: 52000, uhnwIdx: 74, shShare: 12, wealthInfraIdx: 62,
      medVal: 590000, luxPpsf: 720, apprec5: 52, dom: 74, cashShare: 36, tx2m: 320, tx5m: 66, tx10m: 14, lotPrice: 750000, landShare: 24,
      sfPermits: 3200, permitCagr3: 1.5, customShare: 14, remodelIdx: 48, costPsf: 470, gcMargin: 15, luxGcCount: 26, tradeIdx: 62, backlog: 8.0, buildMonths: 10,
      pipelineM: 7200, commercialM: 3200, infraM: 900, entitledLots: 26000, landIdx: 60, entMonths: 16, permitDays: 55, waterIdx: 40, topoIdx: 44, shortageIdx: 74,
      visitorsM: 5.6, visitorG: 3.0, visitSpendM: 1400, luxRooms: 1900, adr: 320, occ: 66, seasonIdx: 78,
      repIdx: 58, clubIdx: 68, celebIdx: 58, hospIdx: 54, retailIdx: 42, schoolIdx: 40, privacyIdx: 62, entryBarIdx: 40,
      jetOps: 34, nonstops: 26, metroMin: 10, roadIdx: 76, airInvestM: 260,
      propTax: 0.48, incomeTax: 0, insIdx: 42, regIdx: 34, climIdx: 46, structIdx: 80
    }
  });

  M({
    id: 'santa-fe', name: 'Santa Fe', state: 'NM', stateFips: '35',
    county: 'Santa Fe County', countyFips: '35049', lat: 35.687, lon: -105.938,
    region: 'Mountain West', archetype: 'smalltown', tier: 'established', geoScope: 'county',
    blurb: 'Real cultural prestige and a serious art market attached to a slow-growth economy and the most binding water constraint of any market in this set.',
    p: {
      pop: 158000, hh: 68000, popCagr5: 0.4, netMig: 4, empCagr5: 1.0, bizFormIdx: 52, medInc: 74000, incCagr5: 3.8,
      hnwiPer1k: 118, hnwiG10: 86, agiIn: 46000, uhnwIdx: 58, shShare: 20, wealthInfraIdx: 38,
      medVal: 620000, luxPpsf: 660, apprec5: 48, dom: 96, cashShare: 52, tx2m: 165, tx5m: 26, tx10m: 4, lotPrice: 520000, landShare: 24,
      sfPermits: 620, permitCagr3: 0.5, customShare: 38, remodelIdx: 58, costPsf: 425, gcMargin: 17, luxGcCount: 20, tradeIdx: 48, backlog: 8.0, buildMonths: 10,
      pipelineM: 900, commercialM: 340, infraM: 220, entitledLots: 5200, landIdx: 56, entMonths: 22, permitDays: 90, waterIdx: 30, topoIdx: 48, shortageIdx: 72,
      visitorsM: 3.2, visitorG: 2.0, visitSpendM: 1150, luxRooms: 900, adr: 480, occ: 60, seasonIdx: 72,
      repIdx: 76, clubIdx: 52, celebIdx: 66, hospIdx: 68, retailIdx: 74, schoolIdx: 42, privacyIdx: 72, entryBarIdx: 48,
      jetOps: 11, nonstops: 8, metroMin: 60, roadIdx: 62, airInvestM: 70,
      propTax: 0.62, incomeTax: 5.9, insIdx: 34, regIdx: 58, climIdx: 48, structIdx: 56
    }
  });

  M({
    id: 'sedona', name: 'Sedona & the Verde Valley', state: 'AZ', stateFips: '04',
    county: 'Yavapai & Coconino Counties', countyFips: '04025', lat: 34.870, lon: -111.761,
    region: 'West', archetype: 'desert', tier: 'established', geoScope: 'sub',
    blurb: 'Extraordinary destination recognition inside a boundary that cannot expand — Sedona is ringed by national forest on every side.',
    p: {
      pop: 78000, hh: 34000, popCagr5: 1.0, netMig: 12, empCagr5: 1.4, bizFormIdx: 54, medInc: 72000, incCagr5: 4.0,
      hnwiPer1k: 104, hnwiG10: 108, agiIn: 44000, uhnwIdx: 48, shShare: 32, wealthInfraIdx: 26,
      medVal: 820000, luxPpsf: 680, apprec5: 54, dom: 104, cashShare: 58, tx2m: 78, tx5m: 12, tx10m: 2, lotPrice: 620000, landShare: 26,
      sfPermits: 260, permitCagr3: -1.0, customShare: 48, remodelIdx: 44, costPsf: 440, gcMargin: 18, luxGcCount: 12, tradeIdx: 46, backlog: 8.5, buildMonths: 11,
      pipelineM: 420, commercialM: 180, infraM: 110, entitledLots: 900, landIdx: 22, entMonths: 24, permitDays: 90, waterIdx: 34, topoIdx: 74, shortageIdx: 84,
      visitorsM: 3.4, visitorG: 1.5, visitSpendM: 1050, luxRooms: 780, adr: 620, occ: 64, seasonIdx: 78,
      repIdx: 74, clubIdx: 42, celebIdx: 54, hospIdx: 66, retailIdx: 44, schoolIdx: 26, privacyIdx: 62, entryBarIdx: 44,
      jetOps: 6, nonstops: 0, metroMin: 110, roadIdx: 48, airInvestM: 30,
      propTax: 0.56, incomeTax: 2.5, insIdx: 30, regIdx: 62, climIdx: 46, structIdx: 58
    }
  });

  M({
    id: 'scottsdale', name: 'Scottsdale & Paradise Valley', state: 'AZ', stateFips: '04',
    county: 'Maricopa County', countyFips: '04013', lat: 33.494, lon: -111.926,
    region: 'West', archetype: 'desert', tier: 'established', geoScope: 'sub',
    blurb: 'The fastest millionaire growth in North America over the past decade, one of the busiest general-aviation fields in the country, and a heat-and-water question that only bites after 2040.',
    p: {
      pop: 320000, hh: 140000, popCagr5: 1.2, netMig: 14, empCagr5: 2.6, bizFormIdx: 78, medInc: 108000, incCagr5: 4.4,
      hnwiPer1k: 175, hnwiG10: 125, agiIn: 74000, uhnwIdx: 80, shShare: 18, wealthInfraIdx: 78,
      medVal: 985000, luxPpsf: 820, apprec5: 58, dom: 78, cashShare: 48, tx2m: 1450, tx5m: 260, tx10m: 52, lotPrice: 1450000, landShare: 28,
      sfPermits: 2600, permitCagr3: 2.0, customShare: 20, remodelIdx: 72, costPsf: 490, gcMargin: 15, luxGcCount: 70, tradeIdx: 64, backlog: 8.5, buildMonths: 11,
      pipelineM: 9500, commercialM: 3800, infraM: 1200, entitledLots: 18000, landIdx: 34, entMonths: 18, permitDays: 65, waterIdx: 30, topoIdx: 40, shortageIdx: 64,
      visitorsM: 11.5, visitorG: 2.5, visitSpendM: 3400, luxRooms: 9500, adr: 620, occ: 66, seasonIdx: 68,
      repIdx: 84, clubIdx: 88, celebIdx: 76, hospIdx: 86, retailIdx: 84, schoolIdx: 62, privacyIdx: 58, entryBarIdx: 58,
      jetOps: 78, nonstops: 100, metroMin: 10, roadIdx: 82, airInvestM: 340,
      propTax: 0.52, incomeTax: 2.5, insIdx: 30, regIdx: 40, climIdx: 52, structIdx: 70
    },
    anchors: [
      { fact: 'Scottsdale is the fastest-growing millionaire hub in North America over the past decade, with resident millionaires up 125% (figures include neighbouring Paradise Valley).', src: 'Henley & Partners, USA Wealth Report 2025', date: '2025-05', url: 'https://www.henleyglobal.com/publications/usa-wealth-report-2025/city-snapshots-where-wealth-lives-america' }
    ]
  });

  M({
    id: 'flagstaff', name: 'Flagstaff & Northern Arizona', state: 'AZ', stateFips: '04',
    county: 'Coconino County', countyFips: '04005', lat: 35.198, lon: -111.651,
    region: 'West', archetype: 'mountain', tier: 'frontier', geoScope: 'county',
    blurb: 'A high-altitude escape from Phoenix heat with a severe housing shortage — and almost no privately-held developable land, because the county is 87% public.',
    p: {
      pop: 148000, hh: 55000, popCagr5: 0.6, netMig: 5, empCagr5: 1.4, bizFormIdx: 54, medInc: 72000, incCagr5: 4.0,
      hnwiPer1k: 56, hnwiG10: 96, agiIn: 26000, uhnwIdx: 32, shShare: 26, wealthInfraIdx: 22,
      medVal: 680000, luxPpsf: 560, apprec5: 52, dom: 84, cashShare: 40, tx2m: 42, tx5m: 6, tx10m: 1, lotPrice: 420000, landShare: 20,
      sfPermits: 340, permitCagr3: 0.0, customShare: 26, remodelIdx: 30, costPsf: 400, gcMargin: 16, luxGcCount: 8, tradeIdx: 44, backlog: 8.0, buildMonths: 8,
      pipelineM: 620, commercialM: 260, infraM: 180, entitledLots: 1600, landIdx: 26, entMonths: 22, permitDays: 80, waterIdx: 36, topoIdx: 62, shortageIdx: 84,
      visitorsM: 5.6, visitorG: 1.5, visitSpendM: 940, luxRooms: 320, adr: 300, occ: 62, seasonIdx: 66,
      repIdx: 48, clubIdx: 30, celebIdx: 26, hospIdx: 34, retailIdx: 24, schoolIdx: 30, privacyIdx: 56, entryBarIdx: 26,
      jetOps: 5, nonstops: 3, metroMin: 130, roadIdx: 62, airInvestM: 45,
      propTax: 0.56, incomeTax: 2.5, insIdx: 30, regIdx: 60, climIdx: 44, structIdx: 56
    }
  });

})(LCDOS_DATA);

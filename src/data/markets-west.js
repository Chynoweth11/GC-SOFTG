/* Market dataset — West Coast & Pacific. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'bend', name: 'Bend & Central Oregon', state: 'OR', stateFips: '41',
    county: 'Deschutes County', countyFips: '41017', lat: 44.058, lon: -121.315,
    region: 'West', archetype: 'mountain', tier: 'established', geoScope: 'county',
    blurb: 'A genuine year-round outdoor destination with a real luxury tier — constrained less by geography than by Oregon\'s urban growth boundary regime.',
    p: {
      pop: 210000, hh: 84000, popCagr5: 2.0, netMig: 15, empCagr5: 2.6, bizFormIdx: 68, medInc: 84000, incCagr5: 4.4,
      hnwiPer1k: 86, hnwiG10: 132, agiIn: 44000, uhnwIdx: 52, shShare: 16, wealthInfraIdx: 38,
      medVal: 745000, luxPpsf: 660, apprec5: 54, dom: 78, cashShare: 40, tx2m: 210, tx5m: 32, tx10m: 5, lotPrice: 680000, landShare: 24,
      sfPermits: 1350, permitCagr3: -1.0, customShare: 24, remodelIdx: 46, costPsf: 420, gcMargin: 16, luxGcCount: 22, tradeIdx: 56, backlog: 8.0, buildMonths: 8,
      pipelineM: 2200, commercialM: 700, infraM: 420, entitledLots: 7200, landIdx: 38, entMonths: 26, permitDays: 75, waterIdx: 46, topoIdx: 44, shortageIdx: 82,
      visitorsM: 4.6, visitorG: 2.5, visitSpendM: 1150, luxRooms: 620, adr: 420, occ: 62, seasonIdx: 74,
      repIdx: 66, clubIdx: 58, celebIdx: 44, hospIdx: 52, retailIdx: 36, schoolIdx: 38, privacyIdx: 60, entryBarIdx: 34,
      jetOps: 16, nonstops: 14, metroMin: 165, roadIdx: 58, airInvestM: 110,
      propTax: 0.86, incomeTax: 9.9, insIdx: 34, regIdx: 74, climIdx: 50, structIdx: 64
    },
    anchors: [
      { fact: 'Deschutes County recorded 488 sales above $1M year-to-date in 2026 against 468 in 2025, at an average sale price of $1,615,570.', src: 'Central Oregon market reporting', date: '2026-05', url: 'https://www.movetobend.com/blog/bend-oregon-housing-market-updated-may-2026/' },
      { fact: 'The $1M-$2M segment shows 292 active listings against 22 pending sales, a supply-demand ratio strongly favouring buyers at the upper end.', src: 'Bend luxury market analysis', date: '2026-02', url: 'https://www.luxuryrealestate.com/blog/2026/02/19/24670-bend-oregon-luxury-real-estate-a-market-defined-by-intentional-demand' }
    ]
  });

  M({
    id: 'montecito', name: 'Montecito & Santa Barbara', state: 'CA', stateFips: '06',
    county: 'Santa Barbara County', countyFips: '06083', lat: 34.437, lon: -119.632,
    region: 'West', archetype: 'coastal', tier: 'mature', geoScope: 'sub',
    blurb: 'Among the deepest $10M+ markets in the country, paired with a Coastal Commission entitlement path and an insurance market in genuine crisis.',
    p: {
      pop: 92000, hh: 36000, popCagr5: -0.2, netMig: -2, empCagr5: 0.8, bizFormIdx: 58, medInc: 106000, incCagr5: 3.8,
      hnwiPer1k: 240, hnwiG10: 82, agiIn: 58000, uhnwIdx: 94, shShare: 18, wealthInfraIdx: 66,
      medVal: 2250000, luxPpsf: 1750, apprec5: 44, dom: 96, cashShare: 58, tx2m: 520, tx5m: 175, tx10m: 52, lotPrice: 4200000, landShare: 42,
      sfPermits: 210, permitCagr3: -5.0, customShare: 54, remodelIdx: 88, costPsf: 950, gcMargin: 15, luxGcCount: 44, tradeIdx: 40, backlog: 11.0, buildMonths: 12,
      pipelineM: 700, commercialM: 320, infraM: 200, entitledLots: 380, landIdx: 8, entMonths: 40, permitDays: 200, waterIdx: 34, topoIdx: 78, shortageIdx: 96,
      visitorsM: 7.5, visitorG: 1.0, visitSpendM: 2100, luxRooms: 2100, adr: 950, occ: 68, seasonIdx: 86,
      repIdx: 92, clubIdx: 76, celebIdx: 96, hospIdx: 90, retailIdx: 74, schoolIdx: 72, privacyIdx: 78, entryBarIdx: 90,
      jetOps: 18, nonstops: 12, metroMin: 90, roadIdx: 58, airInvestM: 90,
      propTax: 0.72, incomeTax: 13.3, insIdx: 88, regIdx: 96, climIdx: 66, structIdx: 42
    }
  });

  M({
    id: 'napa-sonoma', name: 'Napa & Sonoma Valley', state: 'CA', stateFips: '06',
    county: 'Napa County', countyFips: '06055', lat: 38.508, lon: -122.470,
    region: 'West', archetype: 'wine', tier: 'mature', geoScope: 'county',
    blurb: 'Global brand prestige with a development regime — the Agricultural Preserve — expressly designed to prevent the subdivision business from existing.',
    p: {
      pop: 136000, hh: 50000, popCagr5: -0.5, netMig: -6, empCagr5: 0.4, bizFormIdx: 54, medInc: 110000, incCagr5: 3.6,
      hnwiPer1k: 165, hnwiG10: 74, agiIn: 42000, uhnwIdx: 80, shShare: 12, wealthInfraIdx: 58,
      medVal: 950000, luxPpsf: 1150, apprec5: 26, dom: 104, cashShare: 48, tx2m: 280, tx5m: 78, tx10m: 20, lotPrice: 2200000, landShare: 34,
      sfPermits: 190, permitCagr3: -6.0, customShare: 50, remodelIdx: 72, costPsf: 700, gcMargin: 15, luxGcCount: 30, tradeIdx: 42, backlog: 8.0, buildMonths: 11,
      pipelineM: 900, commercialM: 420, infraM: 220, entitledLots: 620, landIdx: 10, entMonths: 42, permitDays: 180, waterIdx: 40, topoIdx: 62, shortageIdx: 88,
      visitorsM: 3.9, visitorG: 0.5, visitSpendM: 2400, luxRooms: 2600, adr: 850, occ: 62, seasonIdx: 76,
      repIdx: 94, clubIdx: 70, celebIdx: 76, hospIdx: 96, retailIdx: 66, schoolIdx: 52, privacyIdx: 72, entryBarIdx: 86,
      jetOps: 12, nonstops: 0, metroMin: 60, roadIdx: 62, airInvestM: 60,
      propTax: 0.72, incomeTax: 13.3, insIdx: 90, regIdx: 96, climIdx: 68, structIdx: 40
    }
  });

  M({
    id: 'carmel', name: 'Carmel, Pebble Beach & Monterey', state: 'CA', stateFips: '06',
    county: 'Monterey County', countyFips: '06053', lat: 36.555, lon: -121.923,
    region: 'West', archetype: 'golf', tier: 'mature', geoScope: 'sub',
    blurb: 'The strongest golf-club ecosystem in America sitting on top of the tightest water moratorium in America — extraordinary demand, almost no permissible supply.',
    p: {
      pop: 105000, hh: 42000, popCagr5: -0.3, netMig: -3, empCagr5: 0.6, bizFormIdx: 52, medInc: 96000, incCagr5: 3.6,
      hnwiPer1k: 205, hnwiG10: 76, agiIn: 48000, uhnwIdx: 86, shShare: 30, wealthInfraIdx: 48,
      medVal: 1650000, luxPpsf: 1550, apprec5: 34, dom: 106, cashShare: 60, tx2m: 380, tx5m: 105, tx10m: 26, lotPrice: 3200000, landShare: 40,
      sfPermits: 170, permitCagr3: -4.0, customShare: 58, remodelIdx: 80, costPsf: 880, gcMargin: 15, luxGcCount: 34, tradeIdx: 38, backlog: 10.0, buildMonths: 12,
      pipelineM: 620, commercialM: 280, infraM: 180, entitledLots: 320, landIdx: 8, entMonths: 40, permitDays: 190, waterIdx: 22, topoIdx: 70, shortageIdx: 96,
      visitorsM: 8.2, visitorG: 0.8, visitSpendM: 3300, luxRooms: 3200, adr: 1050, occ: 68, seasonIdx: 82,
      repIdx: 92, clubIdx: 88, celebIdx: 82, hospIdx: 90, retailIdx: 68, schoolIdx: 58, privacyIdx: 82, entryBarIdx: 92,
      jetOps: 16, nonstops: 8, metroMin: 75, roadIdx: 54, airInvestM: 80,
      propTax: 0.72, incomeTax: 13.3, insIdx: 72, regIdx: 96, climIdx: 52, structIdx: 44
    }
  });

  M({
    id: 'palm-springs', name: 'Palm Springs & the Coachella Valley', state: 'CA', stateFips: '06',
    county: 'Riverside County', countyFips: '06065', lat: 33.830, lon: -116.545,
    region: 'West', archetype: 'desert', tier: 'established', geoScope: 'sub',
    blurb: 'Enormous seasonal wealth, the deepest private-club bench outside Florida, and genuine developable acreage — offset by summer heat and Colorado River allocation risk.',
    p: {
      pop: 385000, hh: 165000, popCagr5: 1.2, netMig: 11, empCagr5: 1.8, bizFormIdx: 60, medInc: 76000, incCagr5: 4.0,
      hnwiPer1k: 108, hnwiG10: 96, agiIn: 46000, uhnwIdx: 66, shShare: 42, wealthInfraIdx: 44,
      medVal: 640000, luxPpsf: 660, apprec5: 46, dom: 96, cashShare: 56, tx2m: 420, tx5m: 78, tx10m: 14, lotPrice: 700000, landShare: 24,
      sfPermits: 2400, permitCagr3: 0.5, customShare: 18, remodelIdx: 64, costPsf: 420, gcMargin: 15, luxGcCount: 32, tradeIdx: 60, backlog: 7.5, buildMonths: 11,
      pipelineM: 4200, commercialM: 1600, infraM: 620, entitledLots: 24000, landIdx: 62, entMonths: 20, permitDays: 80, waterIdx: 34, topoIdx: 34, shortageIdx: 56,
      visitorsM: 14.5, visitorG: 2.0, visitSpendM: 5200, luxRooms: 6800, adr: 480, occ: 62, seasonIdx: 54,
      repIdx: 76, clubIdx: 86, celebIdx: 78, hospIdx: 74, retailIdx: 62, schoolIdx: 42, privacyIdx: 70, entryBarIdx: 52,
      jetOps: 42, nonstops: 30, metroMin: 90, roadIdx: 72, airInvestM: 200,
      propTax: 0.85, incomeTax: 13.3, insIdx: 52, regIdx: 74, climIdx: 62, structIdx: 48
    }
  });

  M({
    id: 'san-juan-islands', name: 'San Juan Islands', state: 'WA', stateFips: '53',
    county: 'San Juan County', countyFips: '53055', lat: 48.535, lon: -123.020,
    region: 'West', archetype: 'island', tier: 'frontier', geoScope: 'county',
    blurb: 'The most private saltwater market in the Lower 48 — and the hardest place in this dataset to physically deliver a construction project.',
    p: {
      pop: 18000, hh: 8200, popCagr5: 0.8, netMig: 8, empCagr5: 1.0, bizFormIdx: 52, medInc: 82000, incCagr5: 3.8,
      hnwiPer1k: 175, hnwiG10: 88, agiIn: 62000, uhnwIdx: 74, shShare: 44, wealthInfraIdx: 26,
      medVal: 1050000, luxPpsf: 950, apprec5: 52, dom: 128, cashShare: 62, tx2m: 78, tx5m: 18, tx10m: 4, lotPrice: 950000, landShare: 28,
      sfPermits: 130, permitCagr3: 0.0, customShare: 74, remodelIdx: 44, costPsf: 600, gcMargin: 19, luxGcCount: 9, tradeIdx: 18, backlog: 13.0, buildMonths: 8,
      pipelineM: 180, commercialM: 60, infraM: 55, entitledLots: 700, landIdx: 32, entMonths: 26, permitDays: 110, waterIdx: 26, topoIdx: 66, shortageIdx: 92,
      visitorsM: 1.1, visitorG: 1.5, visitSpendM: 260, luxRooms: 180, adr: 620, occ: 52, seasonIdx: 42,
      repIdx: 62, clubIdx: 34, celebIdx: 62, hospIdx: 48, retailIdx: 24, schoolIdx: 26, privacyIdx: 96, entryBarIdx: 58,
      jetOps: 5, nonstops: 0, metroMin: 150, roadIdx: 22, airInvestM: 20,
      propTax: 0.72, incomeTax: 0, insIdx: 34, regIdx: 82, climIdx: 26, structIdx: 54
    }
  });

  M({
    id: 'chelan-leavenworth', name: 'Lake Chelan & Leavenworth', state: 'WA', stateFips: '53',
    county: 'Chelan County', countyFips: '53007', lat: 47.839, lon: -120.017,
    region: 'West', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'Seattle\'s wine-and-water weekend market, with a seasonal-housing share above a third and effectively no high-end contractor bench.',
    p: {
      pop: 82000, hh: 32000, popCagr5: 0.7, netMig: 6, empCagr5: 1.2, bizFormIdx: 54, medInc: 74000, incCagr5: 4.0,
      hnwiPer1k: 66, hnwiG10: 104, agiIn: 32000, uhnwIdx: 38, shShare: 34, wealthInfraIdx: 20,
      medVal: 620000, luxPpsf: 660, apprec5: 58, dom: 108, cashShare: 48, tx2m: 46, tx5m: 8, tx10m: 1, lotPrice: 520000, landShare: 24,
      sfPermits: 420, permitCagr3: 2.0, customShare: 38, remodelIdx: 30, costPsf: 425, gcMargin: 18, luxGcCount: 8, tradeIdx: 42, backlog: 8.5, buildMonths: 8,
      pipelineM: 380, commercialM: 130, infraM: 95, entitledLots: 1900, landIdx: 46, entMonths: 20, permitDays: 75, waterIdx: 62, topoIdx: 66, shortageIdx: 76,
      visitorsM: 3.2, visitorG: 2.5, visitSpendM: 520, luxRooms: 220, adr: 420, occ: 52, seasonIdx: 54,
      repIdx: 48, clubIdx: 32, celebIdx: 30, hospIdx: 36, retailIdx: 22, schoolIdx: 22, privacyIdx: 74, entryBarIdx: 24,
      jetOps: 3, nonstops: 4, metroMin: 150, roadIdx: 46, airInvestM: 40,
      propTax: 0.78, incomeTax: 0, insIdx: 34, regIdx: 66, climIdx: 52, structIdx: 60
    }
  });

  M({
    id: 'maui', name: 'Wailea, Kapalua & Maui', state: 'HI', stateFips: '15',
    county: 'Maui County', countyFips: '15009', lat: 20.798, lon: -156.332,
    region: 'Pacific', archetype: 'island', tier: 'mature', geoScope: 'county',
    blurb: 'A severe housing emergency and a multi-billion-dollar reconstruction programme sitting inside the slowest entitlement regime in the United States.',
    p: {
      pop: 165000, hh: 58000, popCagr5: -0.4, netMig: -4, empCagr5: 0.2, bizFormIdx: 48, medInc: 96000, incCagr5: 3.6,
      hnwiPer1k: 145, hnwiG10: 84, agiIn: 52000, uhnwIdx: 84, shShare: 32, wealthInfraIdx: 34,
      medVal: 1180000, luxPpsf: 1550, apprec5: 42, dom: 130, cashShare: 62, tx2m: 320, tx5m: 96, tx10m: 26, lotPrice: 2400000, landShare: 34,
      sfPermits: 340, permitCagr3: 8.0, customShare: 40, remodelIdx: 78, costPsf: 880, gcMargin: 17, luxGcCount: 24, tradeIdx: 24, backlog: 14.0, buildMonths: 12,
      pipelineM: 3400, commercialM: 900, infraM: 850, entitledLots: 2600, landIdx: 22, entMonths: 44, permitDays: 220, waterIdx: 34, topoIdx: 62, shortageIdx: 98,
      visitorsM: 2.5, visitorG: -1.0, visitSpendM: 5200, luxRooms: 7200, adr: 1150, occ: 62, seasonIdx: 88,
      repIdx: 88, clubIdx: 66, celebIdx: 82, hospIdx: 88, retailIdx: 62, schoolIdx: 44, privacyIdx: 76, entryBarIdx: 78,
      jetOps: 14, nonstops: 22, metroMin: 240, roadIdx: 40, airInvestM: 240,
      propTax: 0.28, incomeTax: 11.0, insIdx: 78, regIdx: 94, climIdx: 72, structIdx: 40
    }
  });

})(LCDOS_DATA);

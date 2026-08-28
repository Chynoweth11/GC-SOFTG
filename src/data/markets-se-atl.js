/* Market dataset — Carolinas, Georgia, Alabama. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'charleston', name: 'Charleston, Kiawah & Daniel Island', state: 'SC', stateFips: '45',
    county: 'Charleston County', countyFips: '45019', lat: 32.777, lon: -79.931,
    region: 'Southeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'Genuine international prestige, a serious hospitality economy and real developable ground on the outer islands and up the Neck.',
    p: {
      pop: 430000, hh: 175000, popCagr5: 1.6, netMig: 15, empCagr5: 2.6, bizFormIdx: 74, medInc: 82000, incCagr5: 4.6,
      hnwiPer1k: 128, hnwiG10: 138, agiIn: 62000, uhnwIdx: 72, shShare: 20, wealthInfraIdx: 54,
      medVal: 610000, luxPpsf: 850, apprec5: 62, dom: 78, cashShare: 46, tx2m: 620, tx5m: 120, tx10m: 24, lotPrice: 1050000, landShare: 28,
      sfPermits: 3400, permitCagr3: 3.0, customShare: 24, remodelIdx: 72, costPsf: 490, gcMargin: 17, luxGcCount: 52, tradeIdx: 58, backlog: 9.0, buildMonths: 11,
      pipelineM: 7400, commercialM: 2600, infraM: 1600, entitledLots: 32000, landIdx: 56, entMonths: 20, permitDays: 80, waterIdx: 52, topoIdx: 52, shortageIdx: 72,
      visitorsM: 7.8, visitorG: 3.0, visitSpendM: 4200, luxRooms: 3400, adr: 620, occ: 70, seasonIdx: 78,
      repIdx: 88, clubIdx: 82, celebIdx: 66, hospIdx: 88, retailIdx: 62, schoolIdx: 62, privacyIdx: 62, entryBarIdx: 62,
      jetOps: 30, nonstops: 42, metroMin: 5, roadIdx: 70, airInvestM: 380,
      propTax: 0.52, incomeTax: 6.2, insIdx: 76, regIdx: 44, climIdx: 78, structIdx: 74
    }
  });

  M({
    id: 'hilton-head', name: 'Hilton Head, Bluffton & Palmetto Bluff', state: 'SC', stateFips: '45',
    county: 'Beaufort County', countyFips: '45013', lat: 32.216, lon: -80.752,
    region: 'Southeast', archetype: 'golf', tier: 'established', geoScope: 'county',
    blurb: 'A 20,000-acre institutionally-owned master plan at Palmetto Bluff is quietly building the Lowcountry\'s answer to Sea Island, forty-five minutes from Savannah.',
    p: {
      pop: 200000, hh: 84000, popCagr5: 2.2, netMig: 21, empCagr5: 2.4, bizFormIdx: 64, medInc: 82000, incCagr5: 4.4,
      hnwiPer1k: 168, hnwiG10: 122, agiIn: 78000, uhnwIdx: 66, shShare: 40, wealthInfraIdx: 40,
      medVal: 620000, luxPpsf: 780, apprec5: 58, dom: 96, cashShare: 60, tx2m: 340, tx5m: 60, tx10m: 10, lotPrice: 850000, landShare: 26,
      sfPermits: 2400, permitCagr3: 4.0, customShare: 30, remodelIdx: 62, costPsf: 460, gcMargin: 17, luxGcCount: 30, tradeIdx: 56, backlog: 8.5, buildMonths: 12,
      pipelineM: 4600, commercialM: 1100, infraM: 620, entitledLots: 22000, landIdx: 64, entMonths: 16, permitDays: 60, waterIdx: 56, topoIdx: 44, shortageIdx: 62,
      visitorsM: 3.4, visitorG: 2.5, visitSpendM: 2200, luxRooms: 2400, adr: 620, occ: 62, seasonIdx: 68,
      repIdx: 76, clubIdx: 88, celebIdx: 54, hospIdx: 74, retailIdx: 48, schoolIdx: 52, privacyIdx: 78, entryBarIdx: 56,
      jetOps: 16, nonstops: 30, metroMin: 45, roadIdx: 68, airInvestM: 190,
      propTax: 0.52, incomeTax: 6.2, insIdx: 76, regIdx: 40, climIdx: 76, structIdx: 74
    }
  });

  M({
    id: 'greenville-sc', name: 'Greenville & the Upstate', state: 'SC', stateFips: '45',
    county: 'Greenville County', countyFips: '45045', lat: 34.853, lon: -82.394,
    region: 'Southeast', archetype: 'metro', tier: 'emerging', geoScope: 'county',
    blurb: 'A billion-dollar downtown redevelopment, sustained industrial recruitment and low taxes — the strongest inland Southeast growth story that is not yet a luxury market.',
    p: {
      pop: 560000, hh: 220000, popCagr5: 1.8, netMig: 15, empCagr5: 2.8, bizFormIdx: 72, medInc: 76000, incCagr5: 4.6,
      hnwiPer1k: 86, hnwiG10: 138, agiIn: 44000, uhnwIdx: 52, shShare: 6, wealthInfraIdx: 48,
      medVal: 380000, luxPpsf: 520, apprec5: 62, dom: 62, cashShare: 32, tx2m: 240, tx5m: 34, tx10m: 5, lotPrice: 480000, landShare: 22,
      sfPermits: 5200, permitCagr3: 3.5, customShare: 14, remodelIdx: 48, costPsf: 330, gcMargin: 16, luxGcCount: 26, tradeIdx: 68, backlog: 8.5, buildMonths: 11,
      pipelineM: 6800, commercialM: 3200, infraM: 1200, entitledLots: 34000, landIdx: 70, entMonths: 14, permitDays: 50, waterIdx: 72, topoIdx: 36, shortageIdx: 60,
      visitorsM: 4.2, visitorG: 3.0, visitSpendM: 1600, luxRooms: 900, adr: 320, occ: 66, seasonIdx: 84,
      repIdx: 56, clubIdx: 62, celebIdx: 34, hospIdx: 58, retailIdx: 42, schoolIdx: 54, privacyIdx: 48, entryBarIdx: 32,
      jetOps: 22, nonstops: 22, metroMin: 5, roadIdx: 82, airInvestM: 260,
      propTax: 0.52, incomeTax: 6.2, insIdx: 38, regIdx: 30, climIdx: 42, structIdx: 78
    },
    anchors: [
      { fact: 'The County Square redevelopment is a $1 billion project covering more than 40 acres, one of the largest in Greenville\'s history; RocaPoint confirmed 28 luxury townhomes on the site.', src: 'Greenville development reporting', date: '2025-10', url: 'https://www.livingingreenvillesc.com/blog/greenville-2026-new-developments' },
      { fact: 'Isuzu North America is building a $280 million plant creating more than 700 jobs, on a 1 million sf facility across 200+ acres in Greenville County.', src: 'Upstate SC construction reporting', date: '2026-01', url: 'https://www.yahoo.com/news/articles/five-2026-key-upstate-sc-100953470.html' },
      { fact: 'Site work on the 90-acre Bolden Street District on Laurens Road begins mid-2026.', src: 'Greenville development reporting', date: '2026-01', url: 'https://www.livingingreenvillesc.com/blog/greenville-2026-new-projects' }
    ]
  });

  M({
    id: 'lake-keowee', name: 'Lake Keowee & the Cliffs', state: 'SC', stateFips: '45',
    county: 'Oconee & Pickens Counties', countyFips: '45073', lat: 34.826, lon: -82.909,
    region: 'Southeast', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'A seven-club portfolio community on a clean Duke Energy lake, fifty minutes from a commercial airport, with roughly a dozen capable builders.',
    p: {
      pop: 92000, hh: 40000, popCagr5: 1.6, netMig: 16, empCagr5: 1.8, bizFormIdx: 56, medInc: 68000, incCagr5: 4.2,
      hnwiPer1k: 108, hnwiG10: 138, agiIn: 62000, uhnwIdx: 50, shShare: 30, wealthInfraIdx: 24,
      medVal: 460000, luxPpsf: 680, apprec5: 68, dom: 104, cashShare: 56, tx2m: 130, tx5m: 22, tx10m: 3, lotPrice: 750000, landShare: 28,
      sfPermits: 900, permitCagr3: 5.0, customShare: 46, remodelIdx: 34, costPsf: 390, gcMargin: 19, luxGcCount: 12, tradeIdx: 50, backlog: 8.5, buildMonths: 11,
      pipelineM: 1200, commercialM: 260, infraM: 190, entitledLots: 6200, landIdx: 66, entMonths: 14, permitDays: 55, waterIdx: 76, topoIdx: 46, shortageIdx: 58,
      visitorsM: 1.6, visitorG: 3.0, visitSpendM: 320, luxRooms: 180, adr: 380, occ: 52, seasonIdx: 60,
      repIdx: 50, clubIdx: 78, celebIdx: 38, hospIdx: 42, retailIdx: 22, schoolIdx: 34, privacyIdx: 82, entryBarIdx: 48,
      jetOps: 6, nonstops: 22, metroMin: 50, roadIdx: 58, airInvestM: 45,
      propTax: 0.52, incomeTax: 6.2, insIdx: 36, regIdx: 26, climIdx: 40, structIdx: 76
    }
  });

  M({
    id: 'aiken', name: 'Aiken & the Horse Country', state: 'SC', stateFips: '45',
    county: 'Aiken County', countyFips: '45003', lat: 33.560, lon: -81.720,
    region: 'Southeast', archetype: 'smalltown', tier: 'frontier', geoScope: 'county',
    blurb: 'Deep equestrian social capital, the cheapest land of any market in this dataset, and a multi-billion-dollar federal mission next door at the Savannah River Site.',
    p: {
      pop: 178000, hh: 72000, popCagr5: 1.2, netMig: 11, empCagr5: 1.8, bizFormIdx: 56, medInc: 66000, incCagr5: 4.0,
      hnwiPer1k: 72, hnwiG10: 108, agiIn: 40000, uhnwIdx: 46, shShare: 10, wealthInfraIdx: 24,
      medVal: 300000, luxPpsf: 460, apprec5: 52, dom: 78, cashShare: 40, tx2m: 62, tx5m: 10, tx10m: 2, lotPrice: 320000, landShare: 20,
      sfPermits: 1100, permitCagr3: 4.5, customShare: 20, remodelIdx: 32, costPsf: 295, gcMargin: 17, luxGcCount: 9, tradeIdx: 64, backlog: 8.0, buildMonths: 11,
      pipelineM: 3400, commercialM: 1600, infraM: 620, entitledLots: 8200, landIdx: 78, entMonths: 12, permitDays: 45, waterIdx: 74, topoIdx: 26, shortageIdx: 50,
      visitorsM: 1.2, visitorG: 2.5, visitSpendM: 280, luxRooms: 160, adr: 260, occ: 58, seasonIdx: 78,
      repIdx: 48, clubIdx: 66, celebIdx: 42, hospIdx: 36, retailIdx: 24, schoolIdx: 42, privacyIdx: 82, entryBarIdx: 54,
      jetOps: 5, nonstops: 8, metroMin: 30, roadIdx: 68, airInvestM: 60,
      propTax: 0.48, incomeTax: 6.2, insIdx: 34, regIdx: 24, climIdx: 40, structIdx: 68
    }
  });

  M({
    id: 'sea-island', name: 'Sea Island & St. Simons', state: 'GA', stateFips: '13',
    county: 'Glynn County', countyFips: '13127', lat: 31.196, lon: -81.335,
    region: 'Southeast', archetype: 'island', tier: 'mature', geoScope: 'county',
    blurb: 'One of the most exclusive resort addresses in the American South, on an island with almost nothing left to plat.',
    p: {
      pop: 86000, hh: 36000, popCagr5: 0.8, netMig: 8, empCagr5: 1.2, bizFormIdx: 52, medInc: 68000, incCagr5: 4.0,
      hnwiPer1k: 145, hnwiG10: 104, agiIn: 68000, uhnwIdx: 76, shShare: 34, wealthInfraIdx: 28,
      medVal: 480000, luxPpsf: 980, apprec5: 56, dom: 118, cashShare: 66, tx2m: 145, tx5m: 34, tx10m: 8, lotPrice: 1400000, landShare: 30,
      sfPermits: 620, permitCagr3: 3.0, customShare: 48, remodelIdx: 52, costPsf: 550, gcMargin: 18, luxGcCount: 14, tradeIdx: 46, backlog: 9.5, buildMonths: 12,
      pipelineM: 900, commercialM: 320, infraM: 180, entitledLots: 2600, landIdx: 32, entMonths: 18, permitDays: 65, waterIdx: 56, topoIdx: 52, shortageIdx: 70,
      visitorsM: 2.6, visitorG: 2.0, visitSpendM: 1200, luxRooms: 800, adr: 1050, occ: 60, seasonIdx: 66,
      repIdx: 78, clubIdx: 88, celebIdx: 66, hospIdx: 88, retailIdx: 34, schoolIdx: 48, privacyIdx: 92, entryBarIdx: 82,
      jetOps: 12, nonstops: 12, metroMin: 70, roadIdx: 58, airInvestM: 70,
      propTax: 0.82, incomeTax: 5.19, insIdx: 76, regIdx: 36, climIdx: 76, structIdx: 66
    }
  });

  M({
    id: 'cashiers-highlands', name: 'Cashiers & the Highlands Plateau', state: 'NC', stateFips: '37',
    county: 'Jackson & Macon Counties', countyFips: '37099', lat: 35.098, lon: -83.098,
    region: 'Southeast', archetype: 'mountain', tier: 'emerging', geoScope: 'sub',
    blurb: 'Fifteen private clubs inside twenty-five miles, a median sale price above $2M, and the highest privacy score in the dataset — the wealthiest market in America that most Americans have never heard of.',
    p: {
      pop: 22000, hh: 11000, popCagr5: 1.4, netMig: 14, empCagr5: 1.4, bizFormIdx: 52, medInc: 78000, incCagr5: 4.8,
      hnwiPer1k: 245, hnwiG10: 148, agiIn: 92000, uhnwIdx: 82, shShare: 64, wealthInfraIdx: 26,
      medVal: 1250000, luxPpsf: 1050, apprec5: 96, dom: 128, cashShare: 72, tx2m: 190, tx5m: 46, tx10m: 9, lotPrice: 1250000, landShare: 26,
      sfPermits: 260, permitCagr3: 6.5, customShare: 80, remodelIdx: 48, costPsf: 600, gcMargin: 20, luxGcCount: 14, tradeIdx: 28, backlog: 12.5, buildMonths: 8,
      pipelineM: 780, commercialM: 190, infraM: 110, entitledLots: 1400, landIdx: 30, entMonths: 16, permitDays: 55, waterIdx: 62, topoIdx: 84, shortageIdx: 88,
      visitorsM: 1.3, visitorG: 3.0, visitSpendM: 380, luxRooms: 320, adr: 780, occ: 48, seasonIdx: 42,
      repIdx: 62, clubIdx: 96, celebIdx: 62, hospIdx: 62, retailIdx: 32, schoolIdx: 26, privacyIdx: 98, entryBarIdx: 92,
      jetOps: 4, nonstops: 14, metroMin: 120, roadIdx: 34, airInvestM: 30,
      propTax: 0.58, incomeTax: 4.25, insIdx: 40, regIdx: 30, climIdx: 44, structIdx: 72
    },
    anchors: [
      { fact: 'Average home sale price rose 88.8% between 2020 and 2024, from $1.05 million to $1.98 million; by February 2025 the median sale price reached $2.2 million, up 11% year over year.', src: 'Highlands-Cashiers plateau market reporting', date: '2025-02', url: 'https://mountainlifere.com/blog/highlands-and-cashiers-real-estate-market-stability-and-growth-in-equilibrium' },
      { fact: 'There are at least 15 private clubs on the roughly 25-mile Highlands-Cashiers Plateau, including Wade Hampton, Chattooga, High Hampton and Mountaintop; membership typically requires property ownership plus initiation upward of $100,000.', src: 'Cashiers luxury market reporting', date: '2026-01', url: 'https://nthliving.com/blog/the-quiet-billionaires-of-cashiers-nc' },
      { fact: 'The clubs supply the roads, water and sewer systems that make luxury home construction possible on the plateau; the defining 2026 market story is the absolute scarcity of buildable land.', src: 'Cashiers luxury market reporting', date: '2026-01', url: 'https://nthliving.com/blog/the-quiet-billionaires-of-cashiers-nc' }
    ]
  });

  M({
    id: 'asheville', name: 'Asheville & Biltmore Forest', state: 'NC', stateFips: '37',
    county: 'Buncombe County', countyFips: '37021', lat: 35.595, lon: -82.552,
    region: 'Southeast', archetype: 'mountain', tier: 'established', geoScope: 'county',
    blurb: 'Strong destination brand and a large federally-funded reconstruction programme post-Helene, against a permanently repriced flood-risk picture.',
    p: {
      pop: 275000, hh: 118000, popCagr5: 0.6, netMig: 6, empCagr5: 1.0, bizFormIdx: 62, medInc: 66000, incCagr5: 4.0,
      hnwiPer1k: 88, hnwiG10: 112, agiIn: 44000, uhnwIdx: 50, shShare: 14, wealthInfraIdx: 32,
      medVal: 480000, luxPpsf: 620, apprec5: 58, dom: 88, cashShare: 42, tx2m: 145, tx5m: 24, tx10m: 4, lotPrice: 480000, landShare: 24,
      sfPermits: 1100, permitCagr3: -2.0, customShare: 28, remodelIdx: 52, costPsf: 390, gcMargin: 17, luxGcCount: 20, tradeIdx: 48, backlog: 10.5, buildMonths: 9,
      pipelineM: 3200, commercialM: 900, infraM: 1400, entitledLots: 5600, landIdx: 40, entMonths: 20, permitDays: 75, waterIdx: 58, topoIdx: 74, shortageIdx: 84,
      visitorsM: 13.8, visitorG: 1.0, visitSpendM: 2600, luxRooms: 1200, adr: 380, occ: 60, seasonIdx: 68,
      repIdx: 74, clubIdx: 56, celebIdx: 48, hospIdx: 66, retailIdx: 44, schoolIdx: 48, privacyIdx: 58, entryBarIdx: 40,
      jetOps: 12, nonstops: 26, metroMin: 110, roadIdx: 54, airInvestM: 400,
      propTax: 0.60, incomeTax: 4.25, insIdx: 48, regIdx: 44, climIdx: 60, structIdx: 58
    }
  });

  M({
    id: 'blowing-rock', name: 'Blowing Rock & Banner Elk', state: 'NC', stateFips: '37',
    county: 'Watauga & Avery Counties', countyFips: '37189', lat: 36.135, lon: -81.678,
    region: 'Southeast', archetype: 'mountain', tier: 'frontier', geoScope: 'county',
    blurb: 'The North Carolina High Country: Linville Ridge, Grandfather and Elk River give it real club depth, on a seasonal calendar that caps how large any builder can grow.',
    p: {
      pop: 62000, hh: 26000, popCagr5: 0.9, netMig: 9, empCagr5: 1.2, bizFormIdx: 52, medInc: 62000, incCagr5: 4.2,
      hnwiPer1k: 118, hnwiG10: 124, agiIn: 56000, uhnwIdx: 52, shShare: 52, wealthInfraIdx: 20,
      medVal: 560000, luxPpsf: 680, apprec5: 72, dom: 118, cashShare: 62, tx2m: 82, tx5m: 14, tx10m: 2, lotPrice: 520000, landShare: 24,
      sfPermits: 420, permitCagr3: 4.0, customShare: 58, remodelIdx: 36, costPsf: 410, gcMargin: 19, luxGcCount: 9, tradeIdx: 34, backlog: 10.0, buildMonths: 7,
      pipelineM: 480, commercialM: 130, infraM: 90, entitledLots: 1600, landIdx: 44, entMonths: 15, permitDays: 50, waterIdx: 62, topoIdx: 82, shortageIdx: 78,
      visitorsM: 2.4, visitorG: 2.5, visitSpendM: 480, luxRooms: 220, adr: 480, occ: 48, seasonIdx: 48,
      repIdx: 52, clubIdx: 74, celebIdx: 44, hospIdx: 46, retailIdx: 26, schoolIdx: 28, privacyIdx: 86, entryBarIdx: 62,
      jetOps: 3, nonstops: 26, metroMin: 100, roadIdx: 40, airInvestM: 25,
      propTax: 0.58, incomeTax: 4.25, insIdx: 40, regIdx: 30, climIdx: 46, structIdx: 66
    }
  });

  M({
    id: 'lake-norman', name: 'Lake Norman & North Charlotte', state: 'NC', stateFips: '37',
    county: 'Iredell & Mecklenburg Counties', countyFips: '37097', lat: 35.492, lon: -80.899,
    region: 'Southeast', archetype: 'lake', tier: 'emerging', geoScope: 'county',
    blurb: 'A 520-mile shoreline attached to a top-five U.S. banking centre, with an airport that flies nonstop almost everywhere.',
    p: {
      pop: 320000, hh: 125000, popCagr5: 2.4, netMig: 20, empCagr5: 2.8, bizFormIdx: 70, medInc: 96000, incCagr5: 4.4,
      hnwiPer1k: 128, hnwiG10: 132, agiIn: 58000, uhnwIdx: 62, shShare: 12, wealthInfraIdx: 62,
      medVal: 560000, luxPpsf: 620, apprec5: 60, dom: 68, cashShare: 34, tx2m: 380, tx5m: 62, tx10m: 10, lotPrice: 700000, landShare: 24,
      sfPermits: 4200, permitCagr3: 3.0, customShare: 18, remodelIdx: 52, costPsf: 370, gcMargin: 16, luxGcCount: 30, tradeIdx: 66, backlog: 8.0, buildMonths: 11,
      pipelineM: 6200, commercialM: 2400, infraM: 1400, entitledLots: 30000, landIdx: 66, entMonths: 15, permitDays: 55, waterIdx: 72, topoIdx: 32, shortageIdx: 62,
      visitorsM: 3.2, visitorG: 2.5, visitSpendM: 900, luxRooms: 620, adr: 300, occ: 64, seasonIdx: 82,
      repIdx: 56, clubIdx: 70, celebIdx: 56, hospIdx: 46, retailIdx: 40, schoolIdx: 56, privacyIdx: 60, entryBarIdx: 36,
      jetOps: 26, nonstops: 160, metroMin: 25, roadIdx: 80, airInvestM: 620,
      propTax: 0.68, incomeTax: 4.25, insIdx: 40, regIdx: 28, climIdx: 42, structIdx: 78
    }
  });

  M({
    id: 'wilmington-nc', name: 'Wilmington & Figure Eight Island', state: 'NC', stateFips: '37',
    county: 'New Hanover County', countyFips: '37129', lat: 34.226, lon: -77.945,
    region: 'Southeast', archetype: 'coastal', tier: 'emerging', geoScope: 'county',
    blurb: 'A genuinely underbuilt Carolina coastal market with a film economy, a university and a private barrier island most of the country has never heard of.',
    p: {
      pop: 240000, hh: 100000, popCagr5: 1.6, netMig: 15, empCagr5: 2.2, bizFormIdx: 64, medInc: 72000, incCagr5: 4.4,
      hnwiPer1k: 96, hnwiG10: 122, agiIn: 50000, uhnwIdx: 52, shShare: 22, wealthInfraIdx: 32,
      medVal: 480000, luxPpsf: 700, apprec5: 60, dom: 82, cashShare: 44, tx2m: 210, tx5m: 34, tx10m: 5, lotPrice: 620000, landShare: 26,
      sfPermits: 2200, permitCagr3: 2.5, customShare: 24, remodelIdx: 48, costPsf: 410, gcMargin: 17, luxGcCount: 22, tradeIdx: 60, backlog: 8.0, buildMonths: 12,
      pipelineM: 3200, commercialM: 1100, infraM: 620, entitledLots: 16000, landIdx: 54, entMonths: 16, permitDays: 60, waterIdx: 58, topoIdx: 40, shortageIdx: 66,
      visitorsM: 5.6, visitorG: 2.5, visitSpendM: 1400, luxRooms: 800, adr: 380, occ: 62, seasonIdx: 66,
      repIdx: 58, clubIdx: 66, celebIdx: 42, hospIdx: 50, retailIdx: 36, schoolIdx: 46, privacyIdx: 66, entryBarIdx: 40,
      jetOps: 14, nonstops: 14, metroMin: 130, roadIdx: 62, airInvestM: 180,
      propTax: 0.62, incomeTax: 4.25, insIdx: 72, regIdx: 32, climIdx: 74, structIdx: 70
    }
  });

  M({
    id: 'fairhope', name: 'Fairhope & the Eastern Shore', state: 'AL', stateFips: '01',
    county: 'Baldwin County', countyFips: '01003', lat: 30.523, lon: -87.903,
    region: 'Southeast', archetype: 'coastal', tier: 'frontier', geoScope: 'county',
    blurb: 'One of the fastest-growing counties in the Gulf South, with the cheapest developable acreage on the coast and an insurance market that will decide the thesis.',
    p: {
      pop: 270000, hh: 108000, popCagr5: 2.8, netMig: 25, empCagr5: 3.0, bizFormIdx: 64, medInc: 72000, incCagr5: 4.4,
      hnwiPer1k: 82, hnwiG10: 130, agiIn: 48000, uhnwIdx: 42, shShare: 26, wealthInfraIdx: 22,
      medVal: 380000, luxPpsf: 520, apprec5: 60, dom: 92, cashShare: 44, tx2m: 130, tx5m: 20, tx10m: 3, lotPrice: 420000, landShare: 22,
      sfPermits: 3600, permitCagr3: 5.0, customShare: 16, remodelIdx: 34, costPsf: 320, gcMargin: 17, luxGcCount: 14, tradeIdx: 64, backlog: 8.0, buildMonths: 12,
      pipelineM: 3600, commercialM: 1200, infraM: 720, entitledLots: 26000, landIdx: 78, entMonths: 12, permitDays: 45, waterIdx: 72, topoIdx: 26, shortageIdx: 52,
      visitorsM: 8.2, visitorG: 3.0, visitSpendM: 2400, luxRooms: 900, adr: 380, occ: 58, seasonIdx: 56,
      repIdx: 44, clubIdx: 52, celebIdx: 30, hospIdx: 40, retailIdx: 26, schoolIdx: 42, privacyIdx: 62, entryBarIdx: 24,
      jetOps: 8, nonstops: 12, metroMin: 40, roadIdx: 70, airInvestM: 140,
      propTax: 0.36, incomeTax: 5.0, insIdx: 82, regIdx: 24, climIdx: 82, structIdx: 68
    }
  });

})(LCDOS_DATA);

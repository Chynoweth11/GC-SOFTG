/* Market dataset — Northeast & Midwest. */
(function (D) {
  'use strict';
  var M = D.M;

  M({
    id: 'nantucket', name: 'Nantucket', state: 'MA', stateFips: '25',
    county: 'Nantucket County', countyFips: '25019', lat: 41.284, lon: -70.100,
    region: 'Northeast', archetype: 'island', tier: 'mature', geoScope: 'county',
    blurb: 'A fifteen-month backlog, a Historic District Commission that reviews every façade, and roughly 180 entitled lots left on the entire island.',
    p: {
      pop: 14500, hh: 5200, popCagr5: 0.8, netMig: 6, empCagr5: 1.2, bizFormIdx: 54, medInc: 118000, incCagr5: 4.0,
      hnwiPer1k: 330, hnwiG10: 82, agiIn: 138000, uhnwIdx: 94, shShare: 62, wealthInfraIdx: 36,
      medVal: 3200000, luxPpsf: 2100, apprec5: 48, dom: 148, cashShare: 76, tx2m: 240, tx5m: 88, tx10m: 26, lotPrice: 3600000, landShare: 40,
      sfPermits: 130, permitCagr3: -2.0, customShare: 82, remodelIdx: 88, costPsf: 1150, gcMargin: 18, luxGcCount: 26, tradeIdx: 18, backlog: 15.0, buildMonths: 8,
      pipelineM: 380, commercialM: 110, infraM: 140, entitledLots: 180, landIdx: 8, entMonths: 30, permitDays: 140, waterIdx: 40, topoIdx: 60, shortageIdx: 98,
      visitorsM: 0.9, visitorG: 1.0, visitSpendM: 1050, luxRooms: 620, adr: 1650, occ: 46, seasonIdx: 30,
      repIdx: 92, clubIdx: 82, celebIdx: 88, hospIdx: 78, retailIdx: 62, schoolIdx: 36, privacyIdx: 88, entryBarIdx: 94,
      jetOps: 18, nonstops: 12, metroMin: 240, roadIdx: 20, airInvestM: 90,
      propTax: 0.32, incomeTax: 9.0, insIdx: 62, regIdx: 88, climIdx: 66, structIdx: 48
    }
  });

  M({
    id: 'marthas-vineyard', name: "Martha's Vineyard", state: 'MA', stateFips: '25',
    county: 'Dukes County', countyFips: '25007', lat: 41.389, lon: -70.612,
    region: 'Northeast', archetype: 'island', tier: 'mature', geoScope: 'county',
    blurb: 'The highest seasonal-housing share in the dataset at 70%, and an island commission with the power to stop almost any project.',
    p: {
      pop: 21000, hh: 8600, popCagr5: 1.0, netMig: 8, empCagr5: 1.2, bizFormIdx: 52, medInc: 96000, incCagr5: 4.0,
      hnwiPer1k: 265, hnwiG10: 84, agiIn: 108000, uhnwIdx: 88, shShare: 70, wealthInfraIdx: 28,
      medVal: 1450000, luxPpsf: 1450, apprec5: 52, dom: 145, cashShare: 72, tx2m: 175, tx5m: 52, tx10m: 14, lotPrice: 2200000, landShare: 32,
      sfPermits: 180, permitCagr3: -1.0, customShare: 78, remodelIdx: 76, costPsf: 880, gcMargin: 19, luxGcCount: 20, tradeIdx: 18, backlog: 14.0, buildMonths: 8,
      pipelineM: 280, commercialM: 90, infraM: 110, entitledLots: 260, landIdx: 12, entMonths: 30, permitDays: 130, waterIdx: 44, topoIdx: 56, shortageIdx: 96,
      visitorsM: 1.0, visitorG: 1.0, visitSpendM: 720, luxRooms: 380, adr: 1050, occ: 44, seasonIdx: 28,
      repIdx: 88, clubIdx: 66, celebIdx: 92, hospIdx: 66, retailIdx: 44, schoolIdx: 34, privacyIdx: 92, entryBarIdx: 88,
      jetOps: 10, nonstops: 8, metroMin: 240, roadIdx: 22, airInvestM: 60,
      propTax: 0.42, incomeTax: 9.0, insIdx: 60, regIdx: 90, climIdx: 64, structIdx: 46
    }
  });

  M({
    id: 'cape-cod', name: 'Cape Cod', state: 'MA', stateFips: '25',
    county: 'Barnstable County', countyFips: '25001', lat: 41.679, lon: -70.294,
    region: 'Northeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'A multi-billion-dollar mandated wastewater programme is quietly rewriting what can be built here — the largest infrastructure-driven entitlement shift in the Northeast.',
    p: {
      pop: 232000, hh: 108000, popCagr5: 0.4, netMig: 4, empCagr5: 0.6, bizFormIdx: 52, medInc: 88000, incCagr5: 3.8,
      hnwiPer1k: 152, hnwiG10: 86, agiIn: 68000, uhnwIdx: 62, shShare: 38, wealthInfraIdx: 34,
      medVal: 720000, luxPpsf: 900, apprec5: 48, dom: 96, cashShare: 58, tx2m: 320, tx5m: 62, tx10m: 12, lotPrice: 900000, landShare: 28,
      sfPermits: 900, permitCagr3: 0.5, customShare: 38, remodelIdx: 72, costPsf: 550, gcMargin: 18, luxGcCount: 28, tradeIdx: 40, backlog: 10.0, buildMonths: 8,
      pipelineM: 1900, commercialM: 520, infraM: 900, entitledLots: 3600, landIdx: 30, entMonths: 24, permitDays: 100, waterIdx: 40, topoIdx: 44, shortageIdx: 92,
      visitorsM: 5.6, visitorG: 0.5, visitSpendM: 1900, luxRooms: 900, adr: 620, occ: 50, seasonIdx: 38,
      repIdx: 78, clubIdx: 72, celebIdx: 62, hospIdx: 60, retailIdx: 40, schoolIdx: 48, privacyIdx: 72, entryBarIdx: 66,
      jetOps: 12, nonstops: 8, metroMin: 90, roadIdx: 44, airInvestM: 70,
      propTax: 0.72, incomeTax: 9.0, insIdx: 64, regIdx: 78, climIdx: 62, structIdx: 48
    }
  });

  M({
    id: 'greenwich', name: 'Greenwich & Fairfield County', state: 'CT', stateFips: '09',
    county: 'Fairfield County', countyFips: '09001', lat: 41.027, lon: -73.629,
    region: 'Northeast', archetype: 'suburb', tier: 'mature', geoScope: 'county',
    blurb: 'The densest concentration of investment-management wealth in the world, ninety-six luxury GCs deep, and effectively closed to new entrants without a relationship.',
    p: {
      pop: 960000, hh: 350000, popCagr5: 0.3, netMig: 1, empCagr5: 1.0, bizFormIdx: 60, medInc: 108000, incCagr5: 3.8,
      hnwiPer1k: 195, hnwiG10: 72, agiIn: 88000, uhnwIdx: 94, shShare: 6, wealthInfraIdx: 96,
      medVal: 620000, luxPpsf: 900, apprec5: 44, dom: 82, cashShare: 42, tx2m: 1250, tx5m: 260, tx10m: 62, lotPrice: 2600000, landShare: 34,
      sfPermits: 1400, permitCagr3: -3.0, customShare: 30, remodelIdx: 88, costPsf: 550, gcMargin: 16, luxGcCount: 96, tradeIdx: 52, backlog: 9.5, buildMonths: 9,
      pipelineM: 6200, commercialM: 3200, infraM: 1600, entitledLots: 5200, landIdx: 20, entMonths: 26, permitDays: 110, waterIdx: 56, topoIdx: 44, shortageIdx: 84,
      visitorsM: 6.2, visitorG: 1.0, visitSpendM: 1900, luxRooms: 900, adr: 420, occ: 62, seasonIdx: 82,
      repIdx: 90, clubIdx: 92, celebIdx: 84, hospIdx: 66, retailIdx: 78, schoolIdx: 94, privacyIdx: 76, entryBarIdx: 90,
      jetOps: 44, nonstops: 30, metroMin: 20, roadIdx: 62, airInvestM: 260,
      propTax: 1.78, incomeTax: 6.99, insIdx: 48, regIdx: 76, climIdx: 44, structIdx: 46
    }
  });

  M({
    id: 'hamptons', name: 'The Hamptons & the East End', state: 'NY', stateFips: '36',
    county: 'Suffolk County', countyFips: '36103', lat: 40.963, lon: -72.184,
    region: 'Northeast', archetype: 'coastal', tier: 'mature', geoScope: 'sub',
    blurb: 'The deepest $10M+ resort market in the country, on a twelve-week season, with an airport now under use restrictions and 900 entitled lots left.',
    p: {
      pop: 78000, hh: 34000, popCagr5: 0.6, netMig: 5, empCagr5: 1.0, bizFormIdx: 54, medInc: 108000, incCagr5: 3.8,
      hnwiPer1k: 285, hnwiG10: 84, agiIn: 145000, uhnwIdx: 96, shShare: 58, wealthInfraIdx: 62,
      medVal: 2100000, luxPpsf: 1750, apprec5: 46, dom: 132, cashShare: 66, tx2m: 620, tx5m: 220, tx10m: 78, lotPrice: 3800000, landShare: 42,
      sfPermits: 420, permitCagr3: -2.0, customShare: 76, remodelIdx: 86, costPsf: 950, gcMargin: 17, luxGcCount: 62, tradeIdx: 32, backlog: 12.5, buildMonths: 8,
      pipelineM: 1400, commercialM: 380, infraM: 320, entitledLots: 900, landIdx: 14, entMonths: 30, permitDays: 150, waterIdx: 42, topoIdx: 46, shortageIdx: 92,
      visitorsM: 3.2, visitorG: 1.0, visitSpendM: 2100, luxRooms: 900, adr: 1450, occ: 44, seasonIdx: 34,
      repIdx: 96, clubIdx: 92, celebIdx: 96, hospIdx: 76, retailIdx: 82, schoolIdx: 56, privacyIdx: 74, entryBarIdx: 94,
      jetOps: 26, nonstops: 0, metroMin: 100, roadIdx: 26, airInvestM: 60,
      propTax: 1.72, incomeTax: 10.9, insIdx: 62, regIdx: 92, climIdx: 64, structIdx: 44
    }
  });

  M({
    id: 'newport-ri', name: 'Newport & Aquidneck Island', state: 'RI', stateFips: '44',
    county: 'Newport County', countyFips: '44005', lat: 41.490, lon: -71.313,
    region: 'Northeast', archetype: 'coastal', tier: 'established', geoScope: 'county',
    blurb: 'The most concentrated yachting social capital in America, on an island where the buildable inventory ran out a century ago.',
    p: {
      pop: 84000, hh: 36000, popCagr5: 0.2, netMig: 2, empCagr5: 0.8, bizFormIdx: 52, medInc: 92000, incCagr5: 3.8,
      hnwiPer1k: 145, hnwiG10: 84, agiIn: 62000, uhnwIdx: 66, shShare: 26, wealthInfraIdx: 28,
      medVal: 720000, luxPpsf: 940, apprec5: 52, dom: 108, cashShare: 56, tx2m: 145, tx5m: 32, tx10m: 7, lotPrice: 1100000, landShare: 30,
      sfPermits: 240, permitCagr3: 0.0, customShare: 42, remodelIdx: 78, costPsf: 550, gcMargin: 18, luxGcCount: 16, tradeIdx: 38, backlog: 9.5, buildMonths: 8,
      pipelineM: 900, commercialM: 320, infraM: 260, entitledLots: 900, landIdx: 20, entMonths: 24, permitDays: 100, waterIdx: 46, topoIdx: 44, shortageIdx: 86,
      visitorsM: 3.6, visitorG: 1.5, visitSpendM: 1100, luxRooms: 620, adr: 620, occ: 56, seasonIdx: 48,
      repIdx: 82, clubIdx: 84, celebIdx: 62, hospIdx: 66, retailIdx: 42, schoolIdx: 56, privacyIdx: 66, entryBarIdx: 76,
      jetOps: 8, nonstops: 22, metroMin: 40, roadIdx: 52, airInvestM: 90,
      propTax: 1.28, incomeTax: 5.99, insIdx: 58, regIdx: 74, climIdx: 58, structIdx: 50
    }
  });

  M({
    id: 'camden-me', name: 'Camden, Mount Desert & Midcoast Maine', state: 'ME', stateFips: '23',
    county: 'Knox & Hancock Counties', countyFips: '23013', lat: 44.210, lon: -69.065,
    region: 'Northeast', archetype: 'coastal', tier: 'frontier', geoScope: 'county',
    blurb: 'Genuine old-money discretion, cheap land by Northeast standards, and a construction season of about six months.',
    p: {
      pop: 42000, hh: 19000, popCagr5: 0.6, netMig: 7, empCagr5: 0.8, bizFormIdx: 50, medInc: 68000, incCagr5: 4.0,
      hnwiPer1k: 128, hnwiG10: 96, agiIn: 62000, uhnwIdx: 66, shShare: 42, wealthInfraIdx: 22,
      medVal: 520000, luxPpsf: 760, apprec5: 62, dom: 122, cashShare: 62, tx2m: 78, tx5m: 18, tx10m: 4, lotPrice: 620000, landShare: 24,
      sfPermits: 260, permitCagr3: 2.0, customShare: 58, remodelIdx: 62, costPsf: 470, gcMargin: 19, luxGcCount: 12, tradeIdx: 30, backlog: 11.0, buildMonths: 6,
      pipelineM: 320, commercialM: 90, infraM: 85, entitledLots: 900, landIdx: 56, entMonths: 16, permitDays: 60, waterIdx: 72, topoIdx: 56, shortageIdx: 80,
      visitorsM: 3.2, visitorG: 2.0, visitSpendM: 620, luxRooms: 260, adr: 620, occ: 46, seasonIdx: 34,
      repIdx: 62, clubIdx: 62, celebIdx: 62, hospIdx: 52, retailIdx: 28, schoolIdx: 42, privacyIdx: 92, entryBarIdx: 62,
      jetOps: 4, nonstops: 10, metroMin: 100, roadIdx: 42, airInvestM: 40,
      propTax: 1.12, incomeTax: 7.15, insIdx: 38, regIdx: 62, climIdx: 32, structIdx: 62
    }
  });

  M({
    id: 'charlottesville', name: 'Charlottesville & Keswick', state: 'VA', stateFips: '51',
    county: 'Albemarle County', countyFips: '51003', lat: 38.030, lon: -78.478,
    region: 'Northeast', archetype: 'smalltown', tier: 'established', geoScope: 'county',
    blurb: 'Virginia hunt country with a top-tier university attached — steady, high-income, and structurally supply-constrained by rural-area zoning.',
    p: {
      pop: 165000, hh: 66000, popCagr5: 0.8, netMig: 7, empCagr5: 1.4, bizFormIdx: 60, medInc: 92000, incCagr5: 4.0,
      hnwiPer1k: 128, hnwiG10: 102, agiIn: 52000, uhnwIdx: 62, shShare: 10, wealthInfraIdx: 44,
      medVal: 560000, luxPpsf: 580, apprec5: 50, dom: 74, cashShare: 42, tx2m: 130, tx5m: 22, tx10m: 4, lotPrice: 480000, landShare: 24,
      sfPermits: 900, permitCagr3: 1.0, customShare: 32, remodelIdx: 52, costPsf: 370, gcMargin: 17, luxGcCount: 18, tradeIdx: 52, backlog: 8.5, buildMonths: 10,
      pipelineM: 1900, commercialM: 700, infraM: 420, entitledLots: 6200, landIdx: 46, entMonths: 20, permitDays: 75, waterIdx: 62, topoIdx: 46, shortageIdx: 74,
      visitorsM: 3.2, visitorG: 2.0, visitSpendM: 780, luxRooms: 420, adr: 420, occ: 62, seasonIdx: 76,
      repIdx: 68, clubIdx: 68, celebIdx: 58, hospIdx: 62, retailIdx: 34, schoolIdx: 66, privacyIdx: 78, entryBarIdx: 58,
      jetOps: 8, nonstops: 6, metroMin: 70, roadIdx: 60, airInvestM: 60,
      propTax: 0.72, incomeTax: 5.75, insIdx: 34, regIdx: 56, climIdx: 38, structIdx: 62
    }
  });

  M({
    id: 'lake-geneva', name: 'Lake Geneva & Walworth County', state: 'WI', stateFips: '55',
    county: 'Walworth County', countyFips: '55127', lat: 42.592, lon: -88.433,
    region: 'Midwest', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'Chicago\'s historic lake retreat, an hour and a half from the Loop, where lakefront lots trade at more than three times the county median home value.',
    p: {
      pop: 108000, hh: 42000, popCagr5: 0.8, netMig: 8, empCagr5: 1.2, bizFormIdx: 52, medInc: 76000, incCagr5: 4.0,
      hnwiPer1k: 118, hnwiG10: 108, agiIn: 58000, uhnwIdx: 62, shShare: 30, wealthInfraIdx: 24,
      medVal: 420000, luxPpsf: 780, apprec5: 62, dom: 96, cashShare: 52, tx2m: 110, tx5m: 26, tx10m: 6, lotPrice: 1400000, landShare: 30,
      sfPermits: 480, permitCagr3: 3.0, customShare: 44, remodelIdx: 52, costPsf: 430, gcMargin: 18, luxGcCount: 12, tradeIdx: 48, backlog: 8.5, buildMonths: 7,
      pipelineM: 620, commercialM: 220, infraM: 130, entitledLots: 2200, landIdx: 58, entMonths: 15, permitDays: 55, waterIdx: 74, topoIdx: 34, shortageIdx: 62,
      visitorsM: 3.4, visitorG: 2.0, visitSpendM: 720, luxRooms: 620, adr: 420, occ: 54, seasonIdx: 58,
      repIdx: 54, clubIdx: 74, celebIdx: 52, hospIdx: 50, retailIdx: 26, schoolIdx: 38, privacyIdx: 82, entryBarIdx: 62,
      jetOps: 6, nonstops: 60, metroMin: 60, roadIdx: 68, airInvestM: 40,
      propTax: 1.48, incomeTax: 7.65, insIdx: 32, regIdx: 40, climIdx: 28, structIdx: 58
    }
  });

  M({
    id: 'door-county', name: 'Door County', state: 'WI', stateFips: '55',
    county: 'Door County', countyFips: '55029', lat: 45.089, lon: -87.152,
    region: 'Midwest', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'A 58% seasonal-housing share and seven capable builders — the clearest capacity shortfall of any small market in the Midwest, on a very short season.',
    p: {
      pop: 30500, hh: 14000, popCagr5: 0.3, netMig: 5, empCagr5: 0.6, bizFormIdx: 48, medInc: 68000, incCagr5: 3.8,
      hnwiPer1k: 96, hnwiG10: 92, agiIn: 46000, uhnwIdx: 38, shShare: 58, wealthInfraIdx: 16,
      medVal: 420000, luxPpsf: 620, apprec5: 62, dom: 128, cashShare: 62, tx2m: 42, tx5m: 7, tx10m: 1, lotPrice: 480000, landShare: 24,
      sfPermits: 260, permitCagr3: 2.0, customShare: 56, remodelIdx: 38, costPsf: 390, gcMargin: 19, luxGcCount: 7, tradeIdx: 34, backlog: 9.5, buildMonths: 6,
      pipelineM: 190, commercialM: 60, infraM: 55, entitledLots: 900, landIdx: 56, entMonths: 14, permitDays: 50, waterIdx: 68, topoIdx: 44, shortageIdx: 72,
      visitorsM: 2.3, visitorG: 1.5, visitSpendM: 420, luxRooms: 180, adr: 420, occ: 44, seasonIdx: 32,
      repIdx: 48, clubIdx: 42, celebIdx: 30, hospIdx: 40, retailIdx: 22, schoolIdx: 24, privacyIdx: 86, entryBarIdx: 34,
      jetOps: 3, nonstops: 8, metroMin: 45, roadIdx: 46, airInvestM: 20,
      propTax: 1.32, incomeTax: 7.65, insIdx: 30, regIdx: 42, climIdx: 26, structIdx: 54
    }
  });

  M({
    id: 'harbor-springs', name: 'Harbor Springs & Petoskey', state: 'MI', stateFips: '26',
    county: 'Emmet County', countyFips: '26047', lat: 45.431, lon: -84.991,
    region: 'Midwest', archetype: 'lake', tier: 'frontier', geoScope: 'county',
    blurb: 'Wequetonsing, Harbor Point and Bay Harbor give northern Michigan a club density most people would not believe — attached to nine capable builders.',
    p: {
      pop: 35500, hh: 15500, popCagr5: 0.7, netMig: 8, empCagr5: 1.0, bizFormIdx: 50, medInc: 72000, incCagr5: 4.0,
      hnwiPer1k: 132, hnwiG10: 98, agiIn: 58000, uhnwIdx: 56, shShare: 54, wealthInfraIdx: 18,
      medVal: 480000, luxPpsf: 640, apprec5: 66, dom: 118, cashShare: 64, tx2m: 78, tx5m: 16, tx10m: 3, lotPrice: 620000, landShare: 24,
      sfPermits: 320, permitCagr3: 3.0, customShare: 60, remodelIdx: 46, costPsf: 420, gcMargin: 19, luxGcCount: 9, tradeIdx: 34, backlog: 10.0, buildMonths: 6,
      pipelineM: 320, commercialM: 90, infraM: 65, entitledLots: 1100, landIdx: 54, entMonths: 14, permitDays: 50, waterIdx: 76, topoIdx: 48, shortageIdx: 74,
      visitorsM: 1.8, visitorG: 2.0, visitSpendM: 380, luxRooms: 260, adr: 480, occ: 46, seasonIdx: 40,
      repIdx: 50, clubIdx: 82, celebIdx: 48, hospIdx: 44, retailIdx: 24, schoolIdx: 30, privacyIdx: 94, entryBarIdx: 78,
      jetOps: 5, nonstops: 4, metroMin: 240, roadIdx: 44, airInvestM: 30,
      propTax: 1.28, incomeTax: 4.25, insIdx: 30, regIdx: 38, climIdx: 26, structIdx: 58
    }
  });

  M({
    id: 'traverse-city', name: 'Traverse City & Leelanau', state: 'MI', stateFips: '26',
    county: 'Grand Traverse County', countyFips: '26055', lat: 44.763, lon: -85.620,
    region: 'Midwest', archetype: 'lake', tier: 'emerging', geoScope: 'county',
    blurb: 'The Midwest\'s most complete four-season lake market — wine, water, a real airport and the best population growth in northern Michigan.',
    p: {
      pop: 98000, hh: 42000, popCagr5: 1.0, netMig: 10, empCagr5: 1.4, bizFormIdx: 56, medInc: 74000, incCagr5: 4.2,
      hnwiPer1k: 96, hnwiG10: 112, agiIn: 48000, uhnwIdx: 46, shShare: 26, wealthInfraIdx: 24,
      medVal: 470000, luxPpsf: 610, apprec5: 66, dom: 88, cashShare: 48, tx2m: 96, tx5m: 16, tx10m: 3, lotPrice: 520000, landShare: 24,
      sfPermits: 720, permitCagr3: 3.5, customShare: 36, remodelIdx: 42, costPsf: 380, gcMargin: 18, luxGcCount: 12, tradeIdx: 48, backlog: 8.5, buildMonths: 7,
      pipelineM: 900, commercialM: 300, infraM: 190, entitledLots: 3200, landIdx: 60, entMonths: 15, permitDays: 55, waterIdx: 78, topoIdx: 40, shortageIdx: 70,
      visitorsM: 3.4, visitorG: 3.0, visitSpendM: 780, luxRooms: 420, adr: 380, occ: 54, seasonIdx: 50,
      repIdx: 58, clubIdx: 56, celebIdx: 40, hospIdx: 54, retailIdx: 30, schoolIdx: 38, privacyIdx: 74, entryBarIdx: 32,
      jetOps: 10, nonstops: 12, metroMin: 240, roadIdx: 52, airInvestM: 90,
      propTax: 1.24, incomeTax: 4.25, insIdx: 30, regIdx: 40, climIdx: 26, structIdx: 66
    }
  });

})(LCDOS_DATA);

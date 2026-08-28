/* Deep dives, part B — the alpine and coastal anchors. */
(function (P) {
  'use strict';

  P['big-sky'] = {
    thesis: 'The highest-priced private ski real estate in North America, delivered by a trade base of a few thousand people two hours from a metro of any size. Extraordinary demand, extraordinary constraint, and a ceiling that is physical rather than commercial.',
    sections: [
      { id: 'overview', title: 'Market overview',
        lede: 'Big Sky ranks first on LCDOS at 71.4 — and fifteenth on GC Entry. That divergence is the most important thing to understand about this market.',
        paras: [
          'Big Sky spans Madison and Gallatin counties an hour south of Bozeman, holding Big Sky Resort, Moonlight Basin, Spanish Peaks and the Yellowstone Club. Permanent population is roughly 3,600. Second homes are an estimated 66% of the housing stock. Millionaire density is an estimated 340 households per 1,000 — the second-highest in the dataset after Nantucket.',
          'It leads the universe on overall opportunity because it maxes out on luxury depth, wealth concentration, private-club prestige and construction intensity per household simultaneously. It does not lead on entry because the same characteristics that produce that score — a closed referral network scoring 88 of 100 on difficulty of entry, subcontractor availability of 32, and a twelve-and-a-half-month backlog — make it one of the hardest markets in the country for a new firm to break into.'
        ] },
      { id: 'wealth', title: 'Why wealth is moving there',
        paras: [
          'The Yellowstone Club is the single most effective wealth-concentration mechanism in American resort real estate: private skiing, a membership screened by invitation and net worth, and a property requirement that makes ownership a precondition of belonging. Around it, Spanish Peaks and Moonlight offer the same proposition at a step down in exclusivity and price.',
          'Montana has no sales tax and a top income tax rate of 5.9% recently cut by a full percentage point. Net AGI inflow runs an estimated $88,000 per return. But the dominant flow here is not tax migration — it is the concentration effect of a club that has become a fixed point in the calendars of a specific and very wealthy population.',
          'Bozeman Yellowstone International, an hour north, has become a genuine national private-aviation hub; the airport announced a $180 million infrastructure programme explicitly framed around sustained private-jet growth. U.S. private jet departures reached 2.63 million in 2025, 29% above 2019. Big Sky is a direct beneficiary of that structural shift.'
        ] },
      { id: 'construction', title: 'Construction environment',
        paras: [
          'An estimated 130 single-family permits a year against roughly 1,500 households — 87 per 1,000, among the highest ratios anywhere. An estimated 84% of starts are genuine custom. The model reconciles to about <b>107 new homes a year above $2M</b>, worth roughly <b>$460M</b> in annual construction value in a community of 3,600 people.',
          'Construction cost runs an estimated $1,050 per square foot — third-highest in the dataset behind Aspen and Jackson — against a top-decile realisation near $1,950. That produces a modelled gross spec margin of about 16%, which is genuinely attractive, but it is earned in the hardest operating environment in the top ten.'
        ],
        bullets: [
          'Seven-month practical construction season at 7,500 feet. Winter work requires enclosure and heat, and both are priced accordingly.',
          'Subcontractor availability scores 32 of 100. Most trades commute from Bozeman or are housed on site; crew housing is a real line item, not an afterthought.',
          'Backlog runs an estimated 12.5 months — a demand signal, but also evidence that incumbents are already turning work away rather than losing it.',
          'Average luxury project value is an estimated $4.4M, the second-highest in the top ten. Few clients, very large jobs.'
        ] },
      { id: 'luxury', title: 'Luxury market',
        paras: [
          'An estimated 150 transactions above $2M a year, 60 above $5M and 20 above $10M — remarkable depth for a community of this size and the reason Current Luxury Strength scores 78. Median value is roughly $2.35M; five-year appreciation an estimated 92%, the second-highest in the dataset.',
          'Private club density scores 92 of 100 and privacy 92. This is a market where discretion is the product. Transactions are frequently off-market, the brokerage culture is referral-gated, and construction work is awarded inside the same network. The Opportunity Gap of 49 — below the neutral 50 — correctly says the market is already priced for what it is.'
        ] },
      { id: 'pipeline', title: 'Development pipeline',
        paras: [
          'An estimated $2.6B five-year pipeline against 3,600 residents — the highest per-capita figure in the dataset by a wide margin, at over $700,000 per resident. That number reflects continued buildout at Spanish Peaks and Moonlight, the resort\'s own lift and base-area programme, and the Yellowstone Club\'s ongoing expansion.',
          'Estimated entitled but unbuilt lots stand at roughly 1,500 against 130 permits a year — eleven years of runway, but almost all of it inside private communities where the developer relationship, not the open market, controls access.'
        ] },
      { id: 'contractors', title: 'Contractor landscape',
        paras: [
          'The model estimates 26 firms capable of luxury delivery here, most of them Bozeman-based with a Big Sky operation. The market is well served relative to its size: about four luxury starts per incumbent, less than half Heber\'s ratio.',
          'RK Builders is one publicly identified example of the tier that operates inside the Yellowstone Club, Moonlight Basin and Gallatin Valley\'s gated communities, offering bespoke construction and private estate management. Firms at this level are approved by the clubs, hold long-standing architect relationships, and are effectively pre-selected before an owner starts interviewing.'
        ] },
      { id: 'gap', title: 'Competitive opportunity',
        paras: [
          'The honest reading is that there is no large structural gap in Big Sky\'s contractor market. The Entry Opportunity Alert fires here because demand is high and capacity is low — but capacity is low because of physical labour scarcity, not because incumbents are absent or weak.',
          'What does exist is a service gap in estate management and post-completion work: owners who are on site four weeks a year need someone to hold the asset, and the firms doing that well are few. It is a lower-margin business than construction, but it is the only realistic way into the network from outside, and it converts into build work over three to five years.'
        ] },
      { id: 'land', title: 'Land',
        paras: [
          'Land availability scores 38 of 100 and topographic constraint 74. Almost all developable ground sits inside private master plans; the open-market parcel simply is not a category here in the way it is in Heber or Bozeman. Premium lots run an estimated $4.2M and land is about 30% of finished value.',
          'This is the central limitation of the Big Sky thesis for a firm that intends to become a developer. The construction business is excellent. The development business largely does not exist, because the land is already spoken for by three or four master developers.'
        ] },
      { id: 'tourism', title: 'Tourism',
        paras: [
          'An estimated 1.6 million visitors a year — 444 per resident — with visitor spending of roughly $720M and a luxury room base of about 1,150 at an estimated $1,250 average daily rate in peak season. Yellowstone National Park\'s west entrance is an hour south, which gives the summer season genuine depth.',
          'Season balance scores 58: better than Crested Butte or Nantucket, weaker than Heber or Park City. Shoulder seasons in April-May and October-November are close to dead, which is a real constraint on maintaining a full-time crew.'
        ] },
      { id: 'infra', title: 'Infrastructure',
        paras: [
          'There is no commercial air service in Big Sky itself; everything routes through Bozeman Yellowstone International an hour north, which handles an estimated 46,000 general-aviation operations a year and has 22 nonstop destinations. The $180M airport programme is the single most important infrastructure fact in the market.',
          'US-191 through the Gallatin Canyon is the only surface access, and it is subject to closure. Road access scores 48. Any construction programme here needs contingency for material delivery, not just weather.'
        ] },
      { id: 'entry', title: 'How to enter as a new GC',
        paras: [
          'Big Sky should be understood as an expansion market rather than a founding market. The model ranks it fifteenth for GC entry precisely because the barriers are relational and physical rather than commercial.'
        ],
        bullets: [
          '<b>Enter from Bozeman, not into Big Sky.</b> Establish in the Gallatin Valley where the trade base, the housing and the year-round work are, then move up-canyon on the strength of a delivered reference set. Nearly every incumbent did exactly this.',
          '<b>Get club-approved before selling.</b> Yellowstone Club, Spanish Peaks and Moonlight maintain approved-builder relationships. Without one, an owner conversation cannot become a contract.',
          '<b>Lead with estate management.</b> It is the one service the market is short of, it is relationship-forming, and it converts.',
          '<b>Solve crew housing before bidding.</b> This is the operational constraint that separates firms that can run four jobs from firms that can run one.'
        ] },
      { id: 'strategy', title: 'Long-term strategy',
        chain: [
          { when: 'Years 1-3', title: 'General contractor (Bozeman)', desc: 'Build the Gallatin Valley business first: $2M-$5M custom homes, year-round crews, real trade relationships. Big Sky is the graduate school, not the entry exam.' },
          { when: 'Years 3-6', title: 'Luxury custom builder', desc: 'Club approval and up-canyon delivery at $5M-$12M. Two to four concurrent jobs is the realistic ceiling given crew and season constraints. $20M-$40M revenue.' },
          { when: 'Years 5-10', title: 'Estate management & selective spec', desc: 'A recurring-revenue estate business smooths the seasonal cycle. Spec is possible at a 16% modelled margin but lots are scarce and expensive; one at a time.' },
          { when: 'Years 8-15', title: 'Land developer — in the Gallatin Valley', desc: 'The development runway is down-canyon, not up. Bozeman and the Gallatin corridor carry a 66 land-availability score and 8,600 entitled lots against Big Sky\'s 38 and 1,500.' },
          { when: 'Years 12-20', title: 'Regional developer', desc: 'A Bozeman-anchored development platform with a Big Sky luxury construction arm. The construction business buys the relationships; the valley business buys the land.' }
        ] },
      { id: 'risks', title: 'Risks',
        risks: [
          { t: 'No developer runway', d: 'Land availability of 38 with the developable ground inside private master plans means the contractor-to-developer path largely does not exist in Big Sky itself. If becoming a developer is the objective, the land has to be bought somewhere else.' },
          { t: 'Labour', d: 'Subcontractor availability of 32 and no local workforce housing. This is the operational constraint, and it worsens as the resort builds out.' },
          { t: 'Concentration', d: 'A community of 3,600 people whose economy is one resort complex and one private club. The economic-concentration term in the risk model scores this market accordingly.' },
          { t: 'Closed network', d: 'Difficulty of entry scores 88. Work is awarded inside a referral system that takes years to enter and can be closed by a single bad job.' },
          { t: 'Data confidence', d: 'Confidence scores 43 — screening grade, with no externally verified anchors and Census figures apportioned to a sub-county boundary.' }
        ] },
      { id: 'outlook', title: '5, 10 and 20-year outlook',
        paras: [
          '<b>Five years (score 80).</b> Momentum of 79 carries this horizon. Expect continued buildout across the private communities, further $10M+ transaction depth, and construction costs rising further as regional trade capacity tightens against Bozeman\'s own growth.',
          '<b>Ten years (score 69).</b> The score decays because land runway binds. Big Sky remains an outstanding construction market and a poor development market. The firms that compound fastest over this horizon are those that used Big Sky\'s margins to buy land in the Gallatin Valley.',
          '<b>Twenty years (score 63).</b> The lowest twenty-year score in the top five, and correctly so. Structural alignment is strong at 78 — private aviation, mountain recreation, tax migration — but the land is finite, the trade base is finite, and the market is one resort complex. It stays extremely valuable and stops getting bigger.'
        ] }
    ]
  };

  P['30a-walton'] = {
    thesis: 'A single publicly listed developer controls the land bank, the town centres and the airport catchment along thirty miles of the best beach in the South. The spec margins here are the strongest of any coastal market in the dataset, and the land position is genuinely available.',
    sections: [
      { id: 'overview', title: 'Market overview',
        lede: 'Second overall on LCDOS at 69.9, second on Developer Opportunity at 68.9, and the highest modelled spec margin of any market in the top ten.',
        paras: [
          'Scenic Highway 30A runs thirty miles along the Walton County coast between Destin and Panama City Beach, threading a series of new-urbanist beach towns — Seaside, Alys Beach, Rosemary Beach, WaterColor, WaterSound — that between them created the American aesthetic of the planned coastal community. Behind them, The St. Joe Company (NYSE: JOE) holds one of the largest private land positions in Florida.',
          'The market scores an opportunity gap of 62 with momentum of 72 and Current Luxury Strength of 67. It is neither early nor mature: it is a market in the middle of a decade-long institutional build-out, with the land, the entitlements and the capital already assembled and disclosed in SEC filings.'
        ] },
      { id: 'wealth', title: 'Why wealth is moving there',
        paras: [
          'Walton County\'s population is compounding at an estimated 3.4% a year with net domestic migration around 28 per 1,000 — the strongest combination of any coastal market in this dataset. Estimated net AGI inflow is $78,000 per return, and second homes are an estimated 62% of the housing stock.',
          'Florida\'s zero income tax is the structural driver, and 30A specifically captures a Southern professional and business-owner buyer — Birmingham, Atlanta, Nashville, Dallas, Memphis — for whom this is a four-hour drive rather than a flight. That drive-market characteristic is what makes 30A resilient: it does not depend on airlift the way Naples or Palm Beach do.',
          'Estimated millionaire growth of 175% over the decade is among the highest in the dataset, and it is coming off a base that barely existed twenty years ago.'
        ] },
      { id: 'construction', title: 'Construction environment',
        paras: [
          'An estimated 1,900 single-family permits a year against roughly 34,000 households — 56 per 1,000 — with permits compounding at an estimated 5.5%. Custom and semi-custom work is an estimated 42% of starts, unusually high for a Florida coastal market, because 30A\'s design codes effectively prohibit production product.',
          'The model reconciles to roughly <b>460 new homes a year above $2M</b>, worth about <b>$1.0B</b> in annual construction value — the largest addressable luxury construction market in the top three. Construction cost runs an estimated $520 per square foot against top-decile realisation near $1,050, producing a modelled gross spec margin of about <b>20.5%</b>, the highest in the top ten.'
        ],
        bullets: [
          'Twelve-month construction season. No winter shutdown, which roughly doubles the effective annual throughput of a crew relative to any mountain market.',
          'Subcontractor availability scores 52 — the constraint here is not the absence of trades but competition for them across a corridor building at capacity.',
          'The architectural review boards in Alys, Rosemary and WaterColor are exacting. Firms that can navigate them hold a durable advantage; firms that cannot are simply not eligible for the best work.',
          'Backlog runs an estimated 9.0 months and permit time about 55 days.'
        ] },
      { id: 'luxury', title: 'Luxury market',
        paras: [
          'An estimated 420 transactions above $2M a year, 92 above $5M and 18 above $10M, at a top-decile $1,050 per square foot — higher than Naples, higher than Charleston, and comparable to Park City. Median value is about $920,000 and five-year appreciation an estimated 76%.',
          'Prestige is real but regional: recognition scores 78, private clubs 66, celebrity presence 62. 30A is a nationally recognised aesthetic rather than a nationally recognised address, which is precisely why the price per square foot has room to converge on markets with more established names.'
        ] },
      { id: 'pipeline', title: 'Development pipeline',
        paras: [
          'The St. Joe Company is the pipeline. Watersound Town Center is an open-air lifestyle centre at the entrance to Watersound Origins, adding national tenants through 2025-26, with what the company describes as a built-in pipeline of affluent year-round customers reinforced by more than five million annual visitors to South Walton.',
          'Watersound West Bay Center is planned for approximately <b>500,000 square feet</b> of commercial space, with a standalone 18,000 sf multi-tenant building reaching occupancy in early 2026 and a Publix-anchored phase commenced. Latitude Margaritaville Watersound has completed 2,170 homes since sales opened in 2021 against a Phase 1 plan of 3,500. Watersound Camp Creek is delivering gated custom homesites from a quarter-acre to just under an acre.',
          'The estimated total five-year pipeline is roughly $5.8B against an estimated 24,000 entitled but unbuilt lots — thirteen years of runway at current absorption. Because the owner is a public company, the disclosure quality here is materially better than in any private-developer market in the dataset.'
        ] },
      { id: 'contractors', title: 'Contractor landscape',
        paras: [
          'The model estimates 34 firms capable of $2M-plus custom delivery along the corridor — a genuine bench, but thin against 460 modelled luxury starts a year. That is roughly <b>thirteen luxury starts per incumbent</b>, the second-highest ratio in the top ten after Heber.',
          'The structure is distinctive. Because the towns are design-coded, the firms that dominate are those with existing relationships to the review boards and to the small group of architects working repeatedly inside them. There is a second tier of Destin and Panama City contractors who work the corridor opportunistically, and a third of out-of-region firms that arrive after storms.'
        ] },
      { id: 'gap', title: 'Competitive opportunity',
        paras: [
          'The gap is capacity, not capability. Thirteen luxury starts per incumbent means every good builder on 30A is turning down work or extending schedules. A firm that can genuinely run six to eight concurrent jobs — which requires a real superintendent bench, not just a good owner — takes share immediately.',
          'The second gap is on the St. Joe side of the corridor. The Watersound communities are newer, larger and less saturated with established builder relationships than Alys or Rosemary. A firm that builds a position inside the St. Joe communities early is positioning against a thirteen-year entitled inventory.'
        ] },
      { id: 'land', title: 'Land',
        paras: [
          'Land availability scores 66 of 100 — high for a coastal market and the direct result of St. Joe\'s land bank. Entitlement runs an estimated 14 months and permits about 55 days: Walton County is a comparatively permissive jurisdiction. Premium lots run an estimated $1.35M and land is about 30% of finished value.',
          'The nuance is that much of the developable ground is owned by one company. That is a double-edged fact: it means the entitlements are already in place and the infrastructure is coming, and it means a competing developer buys land from, or competes with, a public company with a lower cost of capital. The realistic developer path here is smaller infill parcels, teardown-and-replace on the beach side, and joint venture rather than confrontation.'
        ] },
      { id: 'tourism', title: 'Tourism',
        paras: [
          'More than five million annual visitors to South Walton — an estimated 63 per resident — with visitor spending of roughly $5.1B, the highest per-resident tourism economy of any market in the top ten. Luxury lodging stands at an estimated 2,400 rooms at a peak average daily rate around $780.',
          'Season balance scores 58. The corridor is genuinely busy March through October and quiet January through February. That is a better profile than a ski market but weaker than a year-round metro, and it shapes how a contractor staffs.'
        ] },
      { id: 'infra', title: 'Infrastructure',
        paras: [
          'Northwest Florida Beaches International (ECP) sits at the eastern end of the corridor with an estimated 24 nonstop destinations and a capital programme estimated at $220M; Destin-Fort Walton Beach serves the western end. Combined general-aviation jet operations are estimated at 24,000 a year and growing.',
          'The corridor\'s structural weakness is that 30A itself is a two-lane road along the entire beach, with US-98 as the only parallel route. Traffic is the most consistent local complaint and the most likely constraint on further densification.'
        ] },
      { id: 'entry', title: 'How to enter as a new GC',
        paras: [
          'This is the strongest coastal entry case in the dataset, and the operating environment is materially easier than any mountain market: twelve-month season, permissive jurisdiction, deep addressable volume and the best spec margin in the top ten.'
        ],
        bullets: [
          '<b>Position inside the St. Joe communities.</b> Watersound Origins, Camp Creek and the West Bay corridor are where the entitled inventory is and where builder relationships are least entrenched.',
          '<b>Hire for the review boards.</b> A project manager who has taken homes through Alys or Rosemary design review is worth more than one with twice the construction experience elsewhere.',
          '<b>Build a superintendent bench immediately.</b> The constraint on share here is concurrency, and concurrency is a staffing problem.',
          '<b>Underwrite insurance honestly.</b> Insurance stress scores 74 and physical climate risk 74. Wind exposure is priced into everything — the client\'s carry, the lender\'s terms and the builder\'s own general liability.',
          '<b>Take spec early.</b> A 20.5% modelled gross margin is the best in the top ten. This is the market where the contractor-to-developer transition is fastest.'
        ] },
      { id: 'strategy', title: 'Long-term strategy',
        chain: [
          { when: 'Years 1-2', title: 'General contractor', desc: 'Three to five concurrent custom homes at $2M-$5M inside the Watersound communities. $12M-$20M revenue. Twelve-month season means the ramp is faster here than anywhere in the Mountain West.' },
          { when: 'Years 2-4', title: 'Luxury custom builder', desc: 'Six to eight concurrent jobs including beach-side teardowns at $5M-$12M. $35M-$60M revenue. Design-review fluency is the differentiator.' },
          { when: 'Years 3-7', title: 'Spec-home developer', desc: 'The 20.5% modelled spec margin supports a programmatic spec business rather than a selective one. Three to six a year, self-funded then bank-financed.' },
          { when: 'Years 5-12', title: 'Land developer', desc: 'Infill assembly north of 98 and teardown-and-subdivide on the beach side. Fourteen-month entitlement and a permissive county make the carry manageable.' },
          { when: 'Years 10-20', title: 'Master-planned developer', desc: 'The realistic top of the ladder here is a 100-400 acre community north of the corridor, potentially in joint venture with the landowner rather than against it.' }
        ] },
      { id: 'risks', title: 'Risks',
        risks: [
          { t: 'Insurance and wind', d: 'Insurance stress scores 74 and physical climate risk 74. A single major hurricane repriced Southwest Florida\'s insurance market within a year. This is the largest single risk to the thesis and it is not diversifiable.' },
          { t: 'Single-landowner market', d: 'St. Joe controls the land bank, the town centres and much of the commercial pipeline. A competing developer operates on the terms of a public company with a lower cost of capital and a longer time horizon.' },
          { t: 'Drive-market concentration', d: 'The buyer base is regional — Birmingham, Atlanta, Nashville, Dallas. That is a resilience advantage in a rate shock and a concentration risk in a Southern regional downturn.' },
          { t: 'Traffic and densification limits', d: 'A two-lane road serving thirty miles of beach towns. The physical constraint on further growth is real and politically contested.' },
          { t: 'Data confidence', d: 'Confidence scores 53 — screening grade, though the St. Joe SEC disclosures make the pipeline figure materially more reliable than in most markets.' }
        ] },
      { id: 'outlook', title: '5, 10 and 20-year outlook',
        paras: [
          '<b>Five years (score 76).</b> Watersound West Bay commercial delivery, continued Latitude Margaritaville absorption toward its 3,500-home Phase 1, and the maturing of the Camp Creek custom market. Expect $2M+ transaction depth to grow materially and top-decile pricing to converge further on Naples.',
          '<b>Ten years (score 74).</b> The thirteen-year entitled inventory means this market keeps building through this entire horizon regardless of cycle. The question is whether 30A converts from a regionally recognised aesthetic into a nationally recognised address — which would re-rate pricing across the corridor.',
          '<b>Twenty years (score 66).</b> Structural alignment scores 78, but the twenty-year figure is held down by physical risk. Climate risk of 74 and insurance stress of 74 are the terms on which this thesis will ultimately be judged. A corridor that adapts — elevation standards, hardened construction, a functioning insurance market — remains one of the best coastal markets in America. One that does not becomes uninsurable at the waterfront and retreats inland, which would favour whoever holds the land north of 98.'
        ] }
    ]
  };

})(LCDOS_PROFILES);

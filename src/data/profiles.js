/* ============================================================================
 * profiles.js — long-form institutional deep dives.
 * ----------------------------------------------------------------------------
 * Written for the LCDOS top ten plus the three markets that top the secondary
 * rankings (GC entry, developer opportunity, opportunity gap) without appearing
 * in the top ten by overall score.
 *
 * A note on the Contractor Landscape sections: firms are named only where the
 * firm was verified against a public source during research. Everywhere else
 * the landscape is described structurally — how many firms operate at each
 * tier, who controls access to work, and how a job is actually won — because a
 * fabricated competitor list is worse than no competitor list.
 * ==========================================================================*/
var LCDOS_PROFILES = (function () {
  'use strict';
  var P = {};
  function add(id, o) { P[id] = o; return o; }

  /* ==================================================================== */
  add('heber-wasatch', {
    thesis: 'The largest new alpine development programme in North America is being built on the far side of a ridgeline from Park City, in a county whose contractor base was sized for a farming town of 20,000. The gap between what is funded and what can be built is the opportunity.',
    sections: [
      { id: 'overview', title: 'Market overview',
        lede: 'Wasatch County is the fastest-growing county in Utah and the single clearest case in this dataset of committed capital arriving faster than local construction capacity can absorb it.',
        paras: [
          'Heber Valley sits at 5,600 feet between the Wasatch Back and the Uinta range, forty minutes from Salt Lake City International and — since the Deer Valley expansion opened its eastern terrain — minutes from a base area of a top-five North American ski resort. For most of its history it was an agricultural valley that happened to be near Park City. That relationship has now inverted: Park City is built out and constrained by Summit County\'s entitlement regime, and the developable ground, the entitled lot inventory and the new resort base are all on the Wasatch County side.',
          'The market scores <b>69.7</b> on LCDOS, third overall, but it leads the universe on the two scores that matter most to a firm that does not yet exist here: <b>GC Entry at 70.6 (first of 79)</b> and <b>Developer Opportunity at 70.0 (second)</b>. Its momentum index of 88 is the highest of any market in the dataset, and its opportunity gap of 71 says the same thing in a different way — future upside is running a long way ahead of current luxury maturity.'
        ] },
      { id: 'wealth', title: 'Why wealth is moving there',
        paras: [
          'Three separate flows converge on this valley. The first is Utah\'s own wealth creation: the Silicon Slopes corridor from Lehi to Draper has produced a dense population of founders and early employees who want mountain property within an hour of the office, and who are priced out of, or bored by, Park City proper.',
          'The second is out-of-state tax migration. Utah\'s flat income tax has been cut to 4.55% and effective property tax in Wasatch County is roughly 0.52% — among the lowest combinations in the Mountain West. Net AGI inflow runs at an estimated $41,000 per return, and resident millionaire households have grown an estimated 175% over the decade.',
          'The third is the resort flow, and it is the one that changes the character of the market. Extell and Alterra are not building a subdivision; they are building a village with Four Seasons and Waldorf Astoria flags. Branded residences at that level draw a buyer who has never previously considered Utah, and who arrives with a construction budget rather than a shopping list.'
        ] },
      { id: 'construction', title: 'Construction environment',
        paras: [
          'The county authorises roughly 1,250 single-family permits a year against about 13,800 households — a permit density of 91 per 1,000 households, which is roughly thirteen times the national rate. Permits have compounded at an estimated 12% a year over three years. Custom and semi-custom work is around 34% of starts, and the model reconciles supply-side and demand-side estimators to about <b>260 new homes a year that will be valued above $2M</b>, worth roughly <b>$680M</b> in annual construction value.',
          'Construction cost for genuine luxury custom runs an estimated $620 per square foot — materially below Park City\'s $800 and less than half of Aspen\'s $1,450 — while top-decile new product realises around $980 per square foot. That spread is the whole thesis in one line: it produces a modelled gross spec margin of about <b>16%</b>, which is enough to make spec building work, and it is why a contractor here has a credible path to becoming a developer.'
        ],
        bullets: [
          'Practical construction season is about eight months; winter shutdown is a scheduling fact, not a surprise, and it is priced into every local contract.',
          'Contractor backlog runs an estimated 9.5 months. Long backlogs are a demand signal for an entrant, not a warning — they mean clients cannot get a builder.',
          'Subcontractor availability scores 56 of 100. Thin, but far better than Big Sky (32) or Jackson (26), because Salt Lake\'s trade base is forty minutes away.',
          'Permit time is an estimated 48 days and entitlement about 15 months — fast by Mountain West standards and dramatically faster than Summit County next door.'
        ] },
      { id: 'luxury', title: 'Luxury market',
        paras: [
          'The county clears an estimated 240 transactions above $2M a year, 38 above $5M and 8 above $10M. Median home value is about $1.12M and five-year appreciation about 78%. Go Heber Valley reports that valley real estate is appreciating faster than both Park City and Salt Lake City — which is what you would expect when the supply of new resort-adjacent product arrives before the price has adjusted.',
          'Current Luxury Strength scores 59 — genuinely mid-tier, well below Park City\'s 77 or Jackson\'s 82. That is not a weakness in this context; it is the reason the opportunity exists. The market has the demand and the capital of a top-tier resort and the prices, competition and prestige infrastructure of a second-tier one. Those converge over the next decade, and the firms that are already operating when they do capture the re-rating.'
        ] },
      { id: 'pipeline', title: 'Development pipeline',
        paras: [
          'Deer Valley East Village is a disclosed <b>$5 billion</b> programme from Extell Development in partnership with Alterra Mountain Company. The first phases carry more than 800 hotel rooms, roughly 1,700 private residences, 250,000 square feet of retail and 68,000 square feet of recreation; full buildout contemplates more than 6,000 residential units and hotel rooms.',
          'The ski infrastructure supporting it is already largely delivered: over 3,700 acres of new terrain, sixteen new lifts including a ten-passenger gondola, and eighty new runs, more than doubling Deer Valley\'s skiable acreage. Canopy by Hilton opens in August 2026; Four Seasons and Waldorf Astoria are under construction for late 2028.',
          'That single programme is most of the county\'s estimated $7.2B five-year pipeline — about $164,000 of announced development per resident, the second-highest ratio in the dataset. Around it sit Red Ledges, the Jordanelle basin, the Hideout and Kamas corridors, and the ordinary subdivision activity of the fastest-growing county in the state.'
        ] },
      { id: 'contractors', title: 'Contractor landscape',
        paras: [
          'The model estimates roughly 24 firms in Wasatch County capable of delivering a $2M-plus custom home to resort standard. Most are small: owner-operator builders of three to fifteen people who came up building on the valley floor and have moved up-market with the land. A second group commutes over the pass from Park City, where the established luxury bench is far deeper — around 58 firms — but where overheads are set by Summit County pricing.',
          'At 260 modelled luxury starts against 24 capable firms, that is roughly <b>11 luxury starts per incumbent</b>, one of the highest ratios in the dataset and more than double what Park City\'s builders carry. The vertical work inside East Village itself will be let to a small number of national and regional contractors qualified for branded hospitality; the residential work around it will not be, and that is the addressable market.'
        ] },
      { id: 'gap', title: 'Competitive opportunity',
        paras: [
          'The specific weakness in this market is the middle. There are competent small builders who top out around $3M and cannot staff three concurrent jobs, and there are Park City firms who will take a Heber project but price it as an away game and staff it second. There is very little in between: a firm that is genuinely local, genuinely capable at $4M-$10M, and set up to run four to six jobs at once.',
          'The second gap is programme management. Owners arriving from out of state with a Four Seasons-adjacent lot expect construction management, transparent cost reporting and a real schedule. That is a service standard rather than a trade skill, and it is the cheapest possible way for a new firm to differentiate in a market where the incumbents are craft-led.'
        ] },
      { id: 'land', title: 'Land',
        paras: [
          'Land availability scores 72 of 100 — high for a resort market and the single largest structural difference between this valley and Park City. Roughly 11,500 entitled but unbuilt lots exist against about 1,250 permits a year, giving nine years of runway. Premium lots run an estimated $1.3M and land is about 21% of finished home value, which is what leaves room for a developer margin.',
          'The binding constraint is water, not ground. Water and utility headroom scores 46 of 100. Wasatch County sits on the Provo River system with senior downstream rights, and the Jordanelle basin\'s service districts are the practical gatekeepers on any large entitlement. Any land position taken here should be diligenced on water first and topography second.'
        ] },
      { id: 'tourism', title: 'Tourism',
        paras: [
          'The valley draws an estimated 3.4 million visitors a year — about 77 per resident — growing at roughly 8.5%, the fastest of any market in the top ten. Visitor spending runs about $690M. Luxury lodging is currently thin at an estimated 900 four- and five-star rooms, but that is precisely the number East Village is about to change: 800-plus rooms in the first phases alone would nearly double it.',
          'The seasonality profile is better than most ski markets. Heber sits between Deer Valley and the Uintas with a genuine summer economy — Jordanelle and Deer Creek reservoirs, the Provo River, and mountain biking — which is why the season-balance score of 62 is above Big Sky\'s 58 and Crested Butte\'s 50. That matters more than it looks: single-season markets cannot support a full-time trade base, which caps how large any builder in them can grow.'
        ] },
      { id: 'infra', title: 'Infrastructure',
        paras: [
          'Salt Lake City International is forty minutes away with more than a hundred nonstop destinations, which puts this valley in a different accessibility class from Big Sky, Jackson or Sun Valley. Heber Valley Airport handles an estimated 34,000 general-aviation operations a year and is the practical private-aviation field for the entire Wasatch Back; its capital programme is estimated at $95M.',
          'US-40 is the single surface corridor and it is already congested at peak. The estimated $620M of committed public infrastructure includes the highway, water and sewer capacity for the Jordanelle basin. Watch this closely: in a valley where the constraint is water and road capacity rather than land, the infrastructure budget is a leading indicator of which parcels become entitled.'
        ] },
      { id: 'entry', title: 'How to enter as a new GC',
        paras: [
          'This is the market where the model would place a new high-end general contractor today, and the entry path is unusually legible because the demand is arriving on a published schedule.'
        ],
        bullets: [
          '<b>Establish before the hotels open.</b> Canopy opens August 2026; Four Seasons and Waldorf Astoria in late 2028. The residential absorption that follows branded-hotel openings runs two to five years behind them. A firm that is licensed, staffed and holding references by 2027 is positioned for that wave; a firm that arrives in 2029 is competing for it.',
          '<b>Enter through renovation and completion work.</b> Remodel intensity scores only 50 here, so the classic remodel-led entry is weaker than it would be in Park City. The equivalent is finish-out and completion work on shell-delivered product, plus the substantial re-build market in Midway and older Heber.',
          '<b>Base in Heber, not Park City.</b> Local licensure, a Heber address and a crew that does not commute over the pass is a real differentiator with owners and a real cost advantage against Summit County firms.',
          '<b>Solve subcontractors first.</b> Trade availability is 56 of 100 and it is the binding constraint on scale. Secure framing, mechanical and finish carpentry capacity with standing commitments before taking the fourth concurrent job, not after.',
          '<b>Sell programme management, not craft.</b> The incumbent bench is craft-led and thin on reporting. Cost transparency, real schedules and a single point of contact is what an out-of-state owner is actually buying.'
        ] },
      { id: 'strategy', title: 'Long-term strategy',
        chain: [
          { when: 'Years 1-2', title: 'General contractor', desc: 'Two to four concurrent custom homes at $2M-$5M. Build the subcontractor bench and a photographable reference set. Target $8M-$14M of revenue and a working relationship with three architects.' },
          { when: 'Years 2-5', title: 'Luxury custom builder', desc: 'Five to seven concurrent jobs at $4M-$10M including work inside Red Ledges and the Jordanelle communities. $25M-$40M revenue. This is where the firm becomes the local default rather than the local alternative.' },
          { when: 'Years 4-8', title: 'Spec-home developer', desc: 'A 16% modelled gross spec margin supports two to four spec homes a year on purchased lots. Self-fund the first, bank the second, syndicate the third. This is the step that converts a contracting business into a balance sheet.' },
          { when: 'Years 6-12', title: 'Land developer', desc: 'Assemble and entitle 20-60 acre parcels in the Jordanelle basin or the Kamas corridor. Nine years of entitled-lot runway county-wide means the market will absorb new lots; a 15-month entitlement path means the carry is survivable.' },
          { when: 'Years 10-20', title: 'Master-planned developer', desc: 'Vertically integrated: entitle, horizontally develop, build and sell. The precedent is exactly what Extell is doing at scale — and the residential parcels around East Village are the natural second-order opportunity.' }
        ] },
      { id: 'risks', title: 'Risks',
        risks: [
          { t: 'Single-programme dependence', d: 'A very large share of the pipeline is one developer\'s project. If Extell slows East Village — through capital markets, a change in Alterra\'s posture, or simple phasing — the demand curve this thesis rests on flattens. Diligence the actual construction draw schedule, not the press release.' },
          { t: 'Water', d: 'Water and utility headroom scores 46 of 100. Jordanelle basin service capacity is the gate on every large entitlement. A land position taken without confirmed water is not a land position.' },
          { t: 'Trade base', d: 'Subcontractor availability of 56 is workable but not deep. If East Village\'s vertical work absorbs regional trade capacity at hospitality rates, residential subcontractor pricing rises and availability falls exactly when demand peaks.' },
          { t: 'Price convergence', d: 'The margin here comes from a $620/sf cost against a $980/sf realisation. If Park City-scale cost inflation crosses the pass faster than pricing does, the spec-margin case erodes. Watch cost per square foot quarterly.' },
          { t: 'Data confidence', d: 'The market\'s Data Confidence Score is 59 — analysis-grade, the third-highest in the dataset, but still short of underwriting grade. The pipeline figure in particular is anchored on a disclosed developer number rather than on a county application register.' }
        ] },
      { id: 'outlook', title: '5, 10 and 20-year outlook',
        paras: [
          '<b>Five years (score 88, highest in the dataset).</b> The funded pipeline dominates this horizon and it is already under construction. Canopy opens in 2026, Four Seasons and Waldorf Astoria in 2028. Expect luxury transaction depth to roughly double, the $5M+ tier to thicken materially, and construction cost per square foot to rise toward Park City\'s as regional trade capacity tightens. The window for establishing at today\'s cost base closes inside this horizon.',
          '<b>Ten years (score 82).</b> Heber Valley converges on Park City in price and prestige while retaining a materially better land position. Current Luxury Strength should move from the high 50s into the low 70s. The firms that matter in 2036 are the ones that hold land today; the contracting business becomes the operating arm of a development business rather than the whole company.',
          '<b>Twenty years (score 76).</b> The structural case — tax migration, private aviation growth, four-season mountain recreation, remote work — is as strong here as anywhere in the country, and the model scores structural alignment at 90 of 100, the highest in the dataset. The binding twenty-year question is water. If the Jordanelle basin\'s allocation supports the buildout contemplated today, this becomes a genuine peer of Park City with more ground. If it does not, the valley stops where the water stops, and the value accrues entirely to whoever already holds entitled, served parcels.'
        ] }
    ]
  });

  /* ==================================================================== */
  add('ogden-valley', {
    thesis: 'A billionaire is privately funding a members-only ski resort forty-five minutes from Salt Lake International, in a valley that has never had a luxury builder base. Ski-in lots are already selling at roughly $4M and there are an estimated fourteen firms in the county capable of building on them.',
    sections: [
      { id: 'overview', title: 'Market overview',
        lede: 'Ogden Valley is the least-recognised market in the top fifteen and the one where the ratio of committed private capital to local construction capacity is most extreme.',
        paras: [
          'The valley sits behind Ogden at the north end of the Wasatch, holding three ski areas — Powder Mountain, Snowbasin and Nordic Valley — and a permanent population of roughly 18,500 across Eden, Huntsville and Liberty. It has always been the cheap alternative to Park City. Reed Hastings\' 2023 acquisition of Powder Mountain, and the private members\' club he is building inside it, has changed what the valley is for.',
          'LCDOS ranks it <b>eleventh overall at 62.7</b>, but <b>fourth on GC Entry at 66.7</b> and it carries an opportunity gap of 69 with the second-highest momentum index in the dataset at 83. Current Luxury Strength is only 51. That combination — high momentum, high gap, low current maturity — is the exact signature the Emerging Market Radar is built to find.'
        ] },
      { id: 'wealth', title: 'Why wealth is moving there',
        paras: [
          'Powder Haven is the mechanism. The private side of Powder Mountain offers members-only skiing across a terrain base most public resorts cannot match. The first 39 lots sold before the roads were paved. The next release is 34 custom lots of two to five acres, with ski-in/ski-out parcels averaging roughly $4M each.',
          'That price point does not attract Utah money; it attracts the same national technology and finance buyers who would otherwise be in Aspen or Yellowstone Club, at a fraction of the entry cost and forty-five minutes from a major international airport. Estimated millionaire growth of 150% over the decade and net AGI inflow of $34,000 per return understate what is happening, because the buyers arriving now are above the threshold those measures capture.',
          'Snowbasin — Sun Valley Company\'s Utah resort and a 2002 Olympic venue — is the second engine, and Salt Lake City\'s confirmed 2034 Winter Olympics gives the entire Wasatch a decade-long infrastructure and attention cycle.'
        ] },
      { id: 'construction', title: 'Construction environment',
        paras: [
          'The valley authorises an estimated 420 single-family permits a year against roughly 6,200 households — 68 per 1,000, extremely high — and permits have compounded at an estimated 16.5% a year, the fastest growth rate of any market in the top fifteen. Custom and semi-custom work is an estimated 46% of starts.',
          'The model reconciles to roughly <b>125 new homes a year above $2M</b>. Against an estimated fourteen capable luxury firms, that is about nine luxury starts per incumbent. Construction cost runs an estimated $560 per square foot against top-decile realisation near $880, producing a modelled gross spec margin of about 12.4%.',
          'Subcontractor availability scores 58 of 100 — better than most resort markets, because Ogden and Layton are twenty-five minutes down the canyon and carry a real industrial trade base. That is the single most underrated attribute of this market: the labour problem that constrains Big Sky and Jackson does not bind here in the same way.'
        ] },
      { id: 'luxury', title: 'Luxury market',
        paras: [
          'The valley clears an estimated 95 transactions above $2M, 22 above $5M and 4 above $10M — thin in absolute terms, and that is the point: this is a market in the process of forming a luxury tier rather than one that has had one for thirty years. Median value is about $950,000 and five-year appreciation an estimated 82%, the strongest in the Utah set.',
          'Prestige scores are correspondingly low: recognition 44, hospitality 42, retail 26. The valley has almost no luxury service infrastructure. That is a genuine constraint on absorption in the near term and the largest single upside if the Powder Haven programme delivers the clubhouse, dining and lodging it has announced.'
        ] },
      { id: 'pipeline', title: 'Development pipeline',
        paras: [
          'Hastings has committed a further <b>$157 million</b> to Powder Haven for lift infrastructure, real estate and a large-scale clubhouse. Two new chairlifts open for the 2026-27 season, taking the private network to six lifts serving more than 3,300 acres of exclusive terrain.',
          'Around that, the model estimates roughly $2.1B of five-year development pipeline across the valley — about $114,000 per resident — including Snowbasin\'s base-area programme and the ordinary subdivision activity of Weber County\'s fastest-growing area. Estimated entitled but unbuilt lots stand at about 3,400 against 420 permits a year: eight years of runway.'
        ] },
      { id: 'contractors', title: 'Contractor landscape',
        paras: [
          'This is the thinnest capable contractor bench of any market scoring above 60 on LCDOS. The model estimates fourteen firms able to deliver a $2M-plus custom home in the valley. Most came up building second homes for Ogden and Salt Lake families at $700,000 to $1.5M, and the step from that to a $6M ski-in residence on a steep site at 8,000 feet is not incremental — it is a different business.',
          'Park City firms will take Ogden Valley work but treat it as an away game: it is an hour and forty minutes by road with no direct route. That distance is a moat for a genuinely local operator in a way that the forty-minute Heber-to-Park City gap is not.'
        ] },
      { id: 'gap', title: 'Competitive opportunity',
        paras: [
          'The gap is at the top. There is essentially no firm in Ogden Valley whose reference set says "we have delivered a $6M mountain-modern residence on a difficult site to a client who lives in California." The first firm that can say that credibly will be the default builder for the Powder Haven lot releases, and there are 73 lots already sold or releasing.',
          'The second gap is winter logistics. At this elevation with this snow load, the firms that can genuinely build through winter — heated enclosures, staged material delivery, crew housing — hold a scheduling advantage that owners will pay a premium for, because the alternative is a two-season build.'
        ] },
      { id: 'land', title: 'Land',
        paras: [
          'Land availability scores 62 of 100 — good for an alpine market. Weber County\'s Ogden Valley planning framework is more permissive than Summit County\'s, with an estimated 16-month entitlement path and 55-day permit turnaround. Premium lots run an estimated $1.6M valley-wide, though the ski-in Powder Haven parcels are multiples of that.',
          'Water headroom scores 44 and topographic constraint 58. The valley floor around Pineview Reservoir is the constrained part; the benches have more room. As in Heber, water rights and sewer district capacity are the practical gate on anything at scale.'
        ] },
      { id: 'tourism', title: 'Tourism',
        paras: [
          'An estimated 1.4 million visitors a year — 76 per resident — growing at roughly 9%, the fastest visitation growth of any market in the dataset. Visitor spending is only about $260M, which tells you the current visitor is a day-tripping skier from the Wasatch Front rather than a destination guest.',
          'That is the conversion this market is undergoing. Luxury lodging stands at an estimated 220 rooms. If the Powder Haven clubhouse and the Snowbasin base programme deliver, the visitor mix shifts materially, and second-home demand follows visitation with a two-to-five year lag.'
        ] },
      { id: 'infra', title: 'Infrastructure',
        paras: [
          'Salt Lake City International is forty-five minutes away. Ogden-Hinckley handles an estimated 12,000 general-aviation operations and has an estimated $70M capital programme; it is the natural private-aviation field for the valley and is materially under-used relative to Heber.',
          'Access is the weakness. Ogden Canyon and Trappers Loop are the two routes in, both two-lane, both weather-exposed. Road access scores 58 of 100. Any material increase in resort volume forces a canyon capacity conversation, and that conversation is a leading indicator worth tracking.'
        ] },
      { id: 'entry', title: 'How to enter as a new GC',
        paras: [
          'Ogden Valley is the highest-conviction early-entry market in the dataset for a firm willing to accept lower current volume in exchange for a near-empty competitive field.'
        ],
        bullets: [
          '<b>Target the Powder Haven lot buyers directly.</b> Seventy-three lots are sold or releasing at roughly $4M. Every one of them needs a builder, and there is no obvious incumbent. This is a finite, identifiable, high-value client list — the rarest thing in this business.',
          '<b>Build the winter capability first.</b> Heated enclosure, staged logistics and crew accommodation are capital-light differentiators that compress an owner\'s schedule by a full season.',
          '<b>Recruit from Ogden and Layton, not Park City.</b> The industrial trade base down the canyon is real, cheaper than Summit County, and has never been organised around luxury residential work. A firm that trains and retains that labour owns the constraint.',
          '<b>Take land early.</b> With entitlement at sixteen months and land at 24% of finished value, the developer step is available here far sooner than in a mature resort market.'
        ] },
      { id: 'strategy', title: 'Long-term strategy',
        chain: [
          { when: 'Years 1-2', title: 'General contractor', desc: 'One to three Powder Haven or Snowbasin-adjacent custom homes. Revenue $6M-$12M. The objective is not volume; it is being the firm with the first delivered $5M+ residence in the valley.' },
          { when: 'Years 2-5', title: 'Luxury custom builder', desc: 'Four to six concurrent jobs, $18M-$30M revenue, and the default position on the private-club lot releases. Winter capability is the moat.' },
          { when: 'Years 4-9', title: 'Spec-home developer', desc: 'A 12% modelled spec margin is workable but not generous — spec here should be selective and site-specific rather than programmatic. One or two a year on bench parcels with confirmed water.' },
          { when: 'Years 6-14', title: 'Land developer', desc: 'Assemble bench land in Eden and Liberty. The valley\'s land availability score of 62 and 16-month entitlement path make this materially easier than anywhere else in the Wasatch.' },
          { when: 'Years 12-20', title: 'Master-planned developer', desc: 'If Powder Haven succeeds, Ogden Valley becomes a genuine peer of Park City with an order of magnitude more developable ground. The firm holding entitled parcels at that point is holding the market.' }
        ] },
      { id: 'risks', title: 'Risks',
        risks: [
          { t: 'Single-owner dependence', d: 'This thesis is substantially one individual\'s capital and intent. Private ownership means no disclosure obligation, no public financing signal, and no obligation to continue. That is a materially different risk profile from a public developer like St. Joe or a listed operator like Alterra.' },
          { t: 'No luxury service infrastructure', d: 'Retail scores 26, hospitality 42, private schools 32. A $4M lot buyer expects somewhere to eat and somewhere to send children. If the service tier does not follow the real estate, absorption slows regardless of the skiing.' },
          { t: 'Canyon access', d: 'Two two-lane weather-exposed routes. This is a genuine constraint on how large the valley can become and a real risk to construction logistics in winter.' },
          { t: 'Thin transaction depth', d: 'An estimated 95 transactions above $2M a year is a small market. A firm sized for it must be sized honestly — this supports an excellent $15M-$30M business, not a $100M one, until the market deepens.' },
          { t: 'Data confidence', d: 'Confidence scores 45 — screening grade. This is a sub-county market with apportioned Census figures and only two externally verified anchors. Everything here should be re-verified on the ground before capital is committed.' }
        ] },
      { id: 'outlook', title: '5, 10 and 20-year outlook',
        paras: [
          '<b>Five years (score 82).</b> The two new Powder Haven lifts open for 2026-27 and the clubhouse follows. Expect the $2M+ transaction count to roughly double from a small base, luxury lodging to move from negligible to meaningful, and the first genuine luxury contractor hierarchy to form. This is the window.',
          '<b>Ten years (score 76).</b> Ogden Valley either becomes a recognised national ski address or it does not, and the answer is largely determined by whether the service tier follows the real estate. If it does, Current Luxury Strength moves from 51 toward 65 and land values re-rate across the whole valley, not just the private parcels.',
          '<b>Twenty years (score 72).</b> Salt Lake\'s 2034 Winter Olympics sits inside this horizon and will pull infrastructure and international attention across the entire Wasatch. The structural alignment score of 84 reflects genuine tailwinds — tax migration, private aviation, four-season recreation, proximity to a major airport. The constraint is physical: canyon access and water. A valley that solves both is a peer of Park City; one that solves neither is a very good regional ski area with expensive houses.'
        ] }
    ]
  });

  return P;
})();
if (typeof module === 'object' && module.exports) module.exports = LCDOS_PROFILES;

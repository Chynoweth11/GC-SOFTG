#!/usr/bin/env node
/* Generates docs/TOP-10.md and docs/DATA-DICTIONARY.md directly from the model
 * and the dataset, so the written report can never drift from the code. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.LCDOS_DATA = require(path.join(ROOT, 'src/data/markets.js'));
['mtn-a','mtn-b','west','se-fl','se-atl','central','ne-mw'].forEach(f => require(path.join(ROOT, 'src/data/markets-' + f + '.js')));
const MODEL = require(path.join(ROOT, 'src/data/model.js'));
const SC = require(path.join(ROOT, 'src/js/scoring.js'));
const PIPE = require(path.join(ROOT, 'src/data/pipeline.js'));
const D = global.LCDOS_DATA;

const rows = D.MARKETS.map(m => {
  const e = SC.evaluate(m), c = SC.confidence(m, D.FIELD_PROV, e);
  return { m, e, c, lcdos: e.lcdos, gce: e.gce, dev: e.dev, cls: e.cls, flu: e.flu, gap: e.gap,
           momentum: e.momentum, f5: e.f5, f10: e.f10, f20: e.f20, conf: c.score };
}).sort((a, b) => b.lcdos - a.lcdos);
rows.forEach((r, i) => r.rank = i + 1);
const byGce = rows.slice().sort((a,b)=>b.gce-a.gce);
const byDev = rows.slice().sort((a,b)=>b.dev-a.dev);
const byGap = rows.slice().sort((a,b)=>b.gap-a.gap);
const byMom = rows.slice().sort((a,b)=>b.momentum-a.momentum);
const n1 = v => (Math.round(v*10)/10).toFixed(1);

/* ------------------------------------------------------------ TOP-10.md */
let t = `# The Top 10 — U.S. Luxury Construction & Development Opportunity

**LCDOS v${MODEL.VERSION} · data as of ${D.AS_OF} · ${rows.length} markets screened**

> **Read the confidence column before acting on anything here.** This ranking is
> built to shortlist markets against one another, and it does that reliably. No
> market in the universe currently reaches underwriting-grade data confidence.
> See [METHODOLOGY.md](METHODOLOGY.md#data-quality) for what that means and how
> to fix it.

## The ranked Top 10

| Rank | Market | Overall Score | GC Opportunity | Developer Potential | Luxury Growth | Current Luxury | 5-Year Outlook | 10-Year Outlook | 20-Year Outlook |
| ---- | ------ | ------------: | -------------: | ------------------: | ------------: | -------------: | -------------: | --------------: | --------------: |
`;
rows.slice(0, 10).forEach(r => {
  t += `| ${r.rank} | **${r.m.name}**, ${r.m.state} | ${n1(r.lcdos)} | ${n1(r.gce)} | ${n1(r.dev)} | ${n1(r.flu)} | ${n1(r.cls)} | ${n1(r.f5)} | ${n1(r.f10)} | ${n1(r.f20)} |\n`;
});

t += `
### The same ten, with the decision context

| Rank | Market | Opp. Gap | Momentum | Modelled $2M+ starts/yr | Luxury GCs | Starts per GC | Spec margin | Land avail. | Confidence |
| ---- | ------ | -------: | -------: | ----------------------: | ---------: | ------------: | ----------: | ----------: | ---------: |
`;
rows.slice(0, 10).forEach(r => {
  t += `| ${r.rank} | ${r.m.name} | ${n1(r.gap)} | ${n1(r.momentum)} (${r.e.momentumRate>0?'+':''}${n1(r.e.momentumRate)}%/yr) | ${Math.round(r.e.derived.luxStarts)} | ${r.m.p.luxGcCount} | ${n1(r.e.derived.startsPerIncumbent)} | ${n1(r.e.derived.specMarginPct)}% | ${r.m.p.landIdx}/100 | ${r.conf} |\n`;
});

t += `
## The three questions the brief actually asks

The overall LCDOS score answers "which markets have the strongest combination of
all ten factors". It is not the same question as "where should *I* start", and
the model reports the other two separately.

### 1. Where should we start our general contracting company today?

Rank by **GC Entry Opportunity Score**.

| # | Market | GC Entry | LCDOS rank | Why |
| - | ------ | -------: | ---------: | --- |
`;
byGce.slice(0, 10).forEach((r, i) => {
  const d = r.e.derived;
  t += `| ${i+1} | ${r.m.name}, ${r.m.state} | ${n1(r.gce)} | #${r.rank} | ${Math.round(d.luxStarts)} luxury starts against ${r.m.p.luxGcCount} capable firms; ${n1(r.m.p.backlog)}-month backlog |\n`;
});

t += `
### 2. Where should we expand over the next 5 to 10 years?

Rank by **10-year outlook**, filtered to markets with a positive opportunity gap.

| # | Market | 10-Yr | 20-Yr | Opp. Gap | Land runway |
| - | ------ | ----: | ----: | -------: | ----------: |
`;
rows.filter(r => r.gap >= 50).sort((a,b)=>b.f10-a.f10).slice(0, 10).forEach((r, i) => {
  t += `| ${i+1} | ${r.m.name}, ${r.m.state} | ${n1(r.f10)} | ${n1(r.f20)} | ${n1(r.gap)} | ${n1(r.e.landRunway)} |\n`;
});

t += `
### 3. Where should we begin acquiring land today?

Rank by **Developer Opportunity Score**.

| # | Market | Developer | Land avail. | Entitlement | Land share of value | Spec margin | Entitled lots |
| - | ------ | --------: | ----------: | ----------: | ------------------: | ----------: | ------------: |
`;
byDev.slice(0, 10).forEach((r, i) => {
  t += `| ${i+1} | ${r.m.name}, ${r.m.state} | ${n1(r.dev)} | ${r.m.p.landIdx}/100 | ${r.m.p.entMonths} mo | ${r.m.p.landShare}% | ${n1(r.e.derived.specMarginPct)}% | ${r.m.p.entitledLots.toLocaleString()} |\n`;
});

t += `
## Before it is obvious — the highest Opportunity Gap scores

The Opportunity Gap measures how far future upside runs ahead of current luxury
maturity. Above 50 means demand is forming faster than the market's existing
luxury infrastructure and builder base can serve it.

| # | Market | Opp. Gap | Current Luxury | Future Upside | LCDOS | Momentum |
| - | ------ | -------: | -------------: | ------------: | ----: | -------: |
`;
byGap.filter(r => r.cls < 65).slice(0, 12).forEach((r, i) => {
  t += `| ${i+1} | ${r.m.name}, ${r.m.state} | ${n1(r.gap)} | ${n1(r.cls)} | ${n1(r.flu)} | ${n1(r.lcdos)} | ${n1(r.momentum)} |\n`;
});

t += `
## Fastest accelerating — the Momentum Index

Momentum measures rate of change, not level. A market scoring 74 with momentum
of +19% can represent a better early entry than one scoring 89 with +3%.

| # | Market | Momentum | Blended rate | LCDOS | Permit growth | Millionaire growth (10y) |
| - | ------ | -------: | -----------: | ----: | ------------: | -----------------------: |
`;
byMom.slice(0, 12).forEach((r, i) => {
  t += `| ${i+1} | ${r.m.name}, ${r.m.state} | ${n1(r.momentum)} | ${r.e.momentumRate>0?'+':''}${n1(r.e.momentumRate)}%/yr | ${n1(r.lcdos)} | ${r.m.p.permitCagr3>0?'+':''}${r.m.p.permitCagr3}%/yr | +${r.m.p.hnwiG10}% |\n`;
});

t += `
## Entry Opportunity Alerts — high demand, low contractor capacity

These markets clear the raw supply/demand screen: construction demand index at
or above 58 against contractor capacity at or below 48. **This is a screen, not
a recommendation** — some of these markets are extremely hard to be let into,
which is why the GC Entry Score is shown beside each one.

| Market | Demand | Capacity | GC Entry | Backlog | Trade availability | Difficulty of entry |
| ------ | -----: | -------: | -------: | ------: | -----------------: | ------------------: |
`;
rows.filter(r => r.e.entryAlert).sort((a,b)=>b.gce-a.gce).forEach(r => {
  t += `| ${r.m.name}, ${r.m.state} | ${Math.round(r.e.demandIdx)} | ${Math.round(r.e.capacityIdx)} | ${n1(r.gce)} | ${n1(r.m.p.backlog)} mo | ${r.m.p.tradeIdx}/100 | ${r.m.p.entryBarIdx}/100 |\n`;
});

t += `
## Full league table — all ${rows.length} markets

| # | Market | State | Type | Tier | LCDOS | GC | DEV | Gap | Mom | 5y | 10y | 20y | Conf |
| - | ------ | ----- | ---- | ---- | ----: | -: | --: | --: | --: | -: | --: | --: | ---: |
`;
rows.forEach(r => {
  t += `| ${r.rank} | ${r.m.name} | ${r.m.state} | ${D.ARCHETYPES[r.m.archetype].label} | ${r.m.tier} | ${n1(r.lcdos)} | ${n1(r.gce)} | ${n1(r.dev)} | ${n1(r.gap)} | ${n1(r.momentum)} | ${n1(r.f5)} | ${n1(r.f10)} | ${n1(r.f20)} | ${r.conf} |\n`;
});

t += `
## Deep dives

Full institutional profiles — market overview, why wealth is moving there,
construction environment, luxury market, development pipeline, contractor
landscape, competitive opportunity, land, tourism, infrastructure, entry
strategy, the GC-to-developer path, risks and 5/10/20-year outlooks — are
written for thirteen markets and are read inside the application under
**Market → Briefing**:

`;
const profOrder = ['heber-wasatch','ogden-valley','big-sky','30a-walton','park-city','bentonville','cda',
                   'dallas-park-cities','palm-beach','naples','houston-woodlands','scottsdale','ponte-vedra'];
profOrder.forEach(id => {
  const r = rows.find(x => x.m.id === id);
  if (r) t += `- **${r.m.name}, ${r.m.state}** — LCDOS #${r.rank} (${n1(r.lcdos)}) · GC #${byGce.findIndex(x=>x.m.id===id)+1} · DEV #${byDev.findIndex(x=>x.m.id===id)+1}\n`;
});

t += `
---
*Generated by \`node tools/build-docs.js\` from the live model. Do not edit by hand.*
`;
fs.writeFileSync(path.join(ROOT, 'docs/TOP-10.md'), t);

/* --------------------------------------------------- DATA-DICTIONARY.md */
let dd = `# Data dictionary

Every market carries **${Object.keys(D.FIELD_PROV).length} primitive fields**. Scores are never stored — they are
computed from these by \`src/js/scoring.js\` against the model in
\`src/data/model.js\`.

## Provenance tiers

| Tier | Weight | Meaning |
| ---- | -----: | ------- |
`;
Object.keys(MODEL.TIERS).forEach(k => {
  dd += `| \`${k}\` | ${MODEL.TIERS[k].w} | ${MODEL.TIERS[k].desc} |\n`;
});

dd += `
Markets whose boundary is smaller than a county (\`geoScope: 'sub'\`) have their
Census-derived fields automatically downgraded one tier, because those figures
are apportioned rather than read directly.

## Fields

| Field | Default tier | Default source | As of |
| ----- | ------------ | -------------- | ----- |
`;
Object.keys(D.FIELD_PROV).forEach(f => {
  const p = D.FIELD_PROV[f];
  const s = D.SOURCES[p.src];
  dd += `| \`${f}\` | ${p.tier}${p.sub ? ' (sub: ' + p.sub + ')' : ''} | ${s ? s.name : p.src} | ${p.asOf} |\n`;
});

dd += `
## Provenance mix across the dataset

`;
const tot = {};
rows.forEach(r => { for (const k in r.c.counts) tot[k] = (tot[k]||0) + r.c.counts[k]; });
const all = Object.values(tot).reduce((a,b)=>a+b,0);
dd += `| Tier | Fields | Share |\n| ---- | -----: | ----: |\n`;
Object.keys(MODEL.TIERS).forEach(k => {
  if (!tot[k]) return;
  dd += `| ${MODEL.TIERS[k].label} | ${tot[k].toLocaleString()} | ${(tot[k]/all*100).toFixed(1)}% |\n`;
});
dd += `| **Total** | **${all.toLocaleString()}** | |\n`;

dd += `
## Externally verified figures

${rows.reduce((a,r)=>a+(r.m.anchors||[]).length,0)} figures were checked against a named public source during research and
are stored with a citation and a date. They are what lift a market's Data
Confidence Score above the floor. Markets carrying them:

| Market | Cited figures | Confidence |
| ------ | ------------: | ---------: |
`;
rows.filter(r => (r.m.anchors||[]).length).sort((a,b)=>b.m.anchors.length-a.m.anchors.length).forEach(r => {
  dd += `| ${r.m.name}, ${r.m.state} | ${r.m.anchors.length} | ${r.conf} |\n`;
});

dd += `
${rows.filter(r => !(r.m.anchors||[]).length).length} of ${rows.length} markets carry **no** externally verified figure. Every number in
those profiles is either a reported statistic at its default tier or an analyst
estimate, and their confidence scores reflect that.

## Named development projects

${PIPE.PROJECTS.length} projects across ${Object.keys(PIPE.BY_MARKET).length} markets, each with a source. Where a market's
aggregate pipeline estimate exceeds the sum of its named projects, the
Development Intelligence view states the un-itemised difference explicitly
rather than inventing projects to close the gap.

---
*Generated by \`node tools/build-docs.js\`. Do not edit by hand.*
`;
fs.writeFileSync(path.join(ROOT, 'docs/DATA-DICTIONARY.md'), dd);

console.log('docs/TOP-10.md and docs/DATA-DICTIONARY.md written');

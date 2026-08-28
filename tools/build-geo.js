#!/usr/bin/env node
/* ============================================================================
 * tools/build-geo.js
 * ----------------------------------------------------------------------------
 * Decodes the vendored us-atlas TopoJSON, projects every ring through the same
 * Albers USA composite the browser uses (src/js/albers.js), simplifies with
 * Douglas-Peucker, and emits src/data/geo.js as pre-computed SVG path data.
 *
 * Zero runtime dependencies: the TopoJSON decoder is implemented inline so the
 * repo regenerates offline from data/raw/.
 *
 *   node tools/build-geo.js
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const Albers = require('../src/js/albers.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'data', 'geo.js');
const proj = Albers.albersUsa(1300, [487.5, 305]);

/* ---------------------------------------------------------------- topojson */

function decodeArcs(topo) {
  const { scale: s, translate: t } = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map((d) => {
      x += d[0]; y += d[1];
      return [x * s[0] + t[0], y * s[1] + t[1]];
    });
  });
}

/* Resolve a ring (list of arc indices, negatives meaning reversed) to lon/lat. */
function ringCoords(arcIdx, arcs) {
  const out = [];
  for (const i of arcIdx) {
    const arc = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    // Consecutive arcs share an endpoint; drop the duplicate.
    for (let j = out.length ? 1 : 0; j < arc.length; j++) out.push(arc[j]);
  }
  return out;
}

function polygons(geom) {
  if (geom.type === 'Polygon') return [geom.arcs];
  if (geom.type === 'MultiPolygon') return geom.arcs;
  return [];
}

/* --------------------------------------------------------------- geometry */

function projectRing(ring, project) {
  const out = [];
  for (const p of ring) {
    const q = project(p[0], p[1]);
    if (!q || !isFinite(q[0]) || !isFinite(q[1])) continue;
    out.push(q);
  }
  return out;
}

/* Iterative Douglas-Peucker. */
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  const t2 = tol * tol;

  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const ax = pts[a][0], ay = pts[a][1], bx = pts[b][0], by = pts[b][1];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    let best = -1, bestD = t2;

    for (let i = a + 1; i < b; i++) {
      const px = pts[i][0], py = pts[i][1];
      let d;
      if (len2 === 0) {
        d = (px - ax) * (px - ax) + (py - ay) * (py - ay);
      } else {
        let u = ((px - ax) * dx + (py - ay) * dy) / len2;
        u = u < 0 ? 0 : u > 1 ? 1 : u;
        const cx = ax + u * dx, cy = ay + u * dy;
        d = (px - cx) * (px - cx) + (py - cy) * (py - cy);
      }
      if (d > bestD) { bestD = d; best = i; }
    }
    if (best > -1) { keep[best] = 1; stack.push([a, best], [best, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

function ringArea(pts) {
  let a = 0;
  for (let i = 0, n = pts.length, j = n - 1; i < n; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
}

function toPath(rings, dp) {
  const f = (v) => {
    const r = Math.round(v * dp) / dp;
    return String(r);
  };
  let d = '';
  for (const r of rings) {
    if (r.length < 3) continue;
    d += 'M' + f(r[0][0]) + ' ' + f(r[0][1]);
    for (let i = 1; i < r.length; i++) d += 'L' + f(r[i][0]) + ' ' + f(r[i][1]);
    d += 'Z';
  }
  return d;
}

/* Build an SVG path for one TopoJSON geometry. */
function geomPath(geom, arcs, project, opts) {
  const rings = [];
  let cx = 0, cy = 0, wsum = 0;

  for (const poly of polygons(geom)) {
    for (let k = 0; k < poly.length; k++) {
      const raw = ringCoords(poly[k], arcs);
      let pts = projectRing(raw, project);
      if (pts.length < 4) continue;
      const area = ringArea(pts);
      // Drop specks, but keep genuine small islands (Nantucket, San Juans...).
      if (area < opts.minArea && k === 0) continue;
      if (k > 0 && area < opts.minArea * 2) continue;   // trivial holes
      pts = simplify(pts, opts.tol);
      if (pts.length < 4) continue;
      rings.push(pts);
      if (k === 0) {
        // Area-weighted centroid of outer rings, for label placement.
        let sx = 0, sy = 0;
        for (const p of pts) { sx += p[0]; sy += p[1]; }
        cx += (sx / pts.length) * area; cy += (sy / pts.length) * area; wsum += area;
      }
    }
  }
  if (!rings.length) return null;
  return {
    d: toPath(rings, opts.dp),
    c: wsum ? [Math.round(cx / wsum * 10) / 10, Math.round(cy / wsum * 10) / 10] : null
  };
}

/* ------------------------------------------------------------------- codes */

const FIPS_TO_USPS = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
  '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
  '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
  '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY'
};

/* --------------------------------------------------------------------- run */

function main() {
  const statesTopo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/raw/us-states-10m.json'), 'utf8'));
  const countiesTopo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/raw/us-counties-10m.json'), 'utf8'));

  const sArcs = decodeArcs(statesTopo);
  const cArcs = decodeArcs(countiesTopo);

  /* -- states ------------------------------------------------------------ */
  const states = [];
  for (const g of statesTopo.objects.states.geometries) {
    const fips = String(g.id).padStart(2, '0');
    const usps = FIPS_TO_USPS[fips];
    if (!usps) continue;                       // drop PR/VI/GU/AS/MP as d3 does
    const r = geomPath(g, sArcs, proj.forState(fips), { tol: 0.3, minArea: 0.4, dp: 10 });
    if (!r) continue;
    states.push({ id: fips, code: usps, name: g.properties.name, d: r.d, c: r.c });
  }
  states.sort((a, b) => a.id.localeCompare(b.id));

  /* -- nation ------------------------------------------------------------ */
  const nationGeom = statesTopo.objects.nation.geometries[0];
  const nation = geomPath(nationGeom, sArcs, proj.lower48, { tol: 0.45, minArea: 1.2, dp: 10 });

  /* -- counties ---------------------------------------------------------- */
  const counties = [];
  for (const g of countiesTopo.objects.counties.geometries) {
    const fips = String(g.id).padStart(5, '0');
    const sf = fips.slice(0, 2);
    if (!FIPS_TO_USPS[sf]) continue;
    const r = geomPath(g, cArcs, proj.forState(sf), { tol: 0.55, minArea: 0.12, dp: 10 });
    if (!r) continue;
    counties.push({ id: fips, n: g.properties.name, s: sf, d: r.d, c: r.c });
  }
  counties.sort((a, b) => a.id.localeCompare(b.id));

  /* -- emit -------------------------------------------------------------- */
  const banner =
`/* GENERATED FILE - do not edit by hand.
 * Produced by tools/build-geo.js from data/raw/us-{states,counties}-10m.json
 * (us-atlas @ 1:10m, Census TIGER/Line cartographic boundaries), projected
 * through Albers USA composite at scale 1300 / translate [487.5, 305].
 * Coordinate space: viewBox "0 0 975 610".
 * Regenerate with: npm run geo
 */
`;
  const body =
    banner +
    'var GEO = ' + JSON.stringify({
      box: [975, 610],
      projection: { type: 'albersUsa', scale: 1300, translate: [487.5, 305] },
      nation: nation ? nation.d : '',
      states: states,
      counties: counties
    }) + ';\n' +
    "if (typeof module === 'object' && module.exports) module.exports = GEO;\n";

  fs.writeFileSync(OUT, body);
  const kb = (Buffer.byteLength(body) / 1024).toFixed(0);
  console.log(`geo.js written: ${states.length} states, ${counties.length} counties, ${kb} KB`);
}

main();

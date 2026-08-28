/* ingest/lib/csv.js — RFC-4180 CSV parser (quoted fields, embedded commas and
 * newlines, doubled quotes). The government files need all of it. */
'use strict';

function parse(text) {
  const rows = [];
  let row = [], field = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/** Parse to objects keyed by header row. */
function toObjects(text) {
  const rows = parse(text);
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r.length > 1)
    .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
}

function num(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[$,%\s]/g, ''));
  return isFinite(n) ? n : null;
}

module.exports = { parse, toObjects, num };

#!/usr/bin/env node
/* ============================================================================
 * tools/build-fonts.js — inline the web fonts as data URIs.
 *
 * Fetches the latin subsets from Google Fonts and emits src/css/fonts.css with
 * every face embedded. That removes the last external request, guarantees the
 * typography renders identically offline, in the repo, and in a published
 * artifact, and eliminates the flash of fallback text.
 *
 *   node tools/build-fonts.js
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FAMILIES = [
  'Archivo:wght@400;500;600;700',
  'IBM+Plex+Mono:wght@400;500;600'
];

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
  return r.text();
}
async function fetchBuf(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  const url = 'https://fonts.googleapis.com/css2?family=' + FAMILIES.join('&family=') + '&display=swap';
  const css = await fetchText(url);

  /* Latin only. The product's copy is English; latin-ext, Greek, Cyrillic and
   * Vietnamese together double the payload for glyphs it never renders. */
  const blocks = css.split('/*').map(b => '/*' + b).filter(b => /@font-face/.test(b));
  const keep = blocks.filter(b => /^\/\*\s*latin\s*\*\//.test(b.trim()));

  let out = '/* GENERATED FILE - do not edit by hand.\n' +
            ' * Produced by tools/build-fonts.js from Google Fonts.\n' +
            ' * Archivo (Omnibus-Type) and IBM Plex Mono (IBM) are both SIL Open Font\n' +
            ' * License 1.1. Latin and latin-ext subsets only, embedded as data URIs so\n' +
            ' * the application makes no external requests at all.\n' +
            ' */\n';

  let bytes = 0, faces = 0;
  for (const block of keep) {
    const m = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    if (!m) continue;
    const buf = await fetchBuf(m[1]);
    bytes += buf.length; faces++;
    const b64 = buf.toString('base64');
    out += block.replace(m[1], 'data:font/woff2;base64,' + b64).trim() + '\n';
  }

  fs.writeFileSync(path.join(ROOT, 'src/css/fonts.css'), out);
  console.log('src/css/fonts.css: ' + faces + ' faces, ' +
              (bytes / 1024).toFixed(0) + ' KB of font data, ' +
              (Buffer.byteLength(out) / 1024).toFixed(0) + ' KB written');
}

main().catch(e => { console.error('font build failed:', e.message); process.exit(1); });

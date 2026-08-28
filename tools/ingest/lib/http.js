/* ============================================================================
 * ingest/lib/http.js — fetch with timeout, retry, and an on-disk cache.
 *
 * The cache matters for two reasons: several sources publish 50-200MB files
 * that should not be re-pulled on every run, and a cached copy lets the
 * pipeline still produce a complete dataset when one source is down.
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CACHE = path.join(__dirname, '..', '..', '..', 'data', 'cache');

function cachePath(url) {
  const safe = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.\-_]/gi, '_').slice(0, 180);
  return path.join(CACHE, safe);
}

function ageHours(file) {
  try { return (Date.now() - fs.statSync(file).mtimeMs) / 36e5; } catch (e) { return Infinity; }
}

/** GET with retry/backoff. Returns { ok, body, from, status, error }. */
async function get(url, opts = {}) {
  const { maxAgeHours = 24 * 7, retries = 3, timeoutMs = 120000, binary = false } = opts;
  fs.mkdirSync(CACHE, { recursive: true });
  const cf = cachePath(url);

  if (ageHours(cf) < maxAgeHours) {
    return { ok: true, body: binary ? fs.readFileSync(cf) : fs.readFileSync(cf, 'utf8'), from: 'cache', status: 200 };
  }

  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt) await new Promise(r => setTimeout(r, 1500 * Math.pow(2, attempt - 1)));
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctl.signal,
        headers: { 'User-Agent': 'LCDOS-ingest/1.0 (+https://github.com/Chynoweth11/GC-SOFTG)' }
      });
      clearTimeout(timer);
      if (!res.ok) { lastErr = new Error('HTTP ' + res.status); if (res.status < 500 && res.status !== 429) break; continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(cf, buf);
      return { ok: true, body: binary ? buf : buf.toString('utf8'), from: 'network', status: res.status };
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
    }
  }

  /* Network failed. A stale cached copy is far better than nothing — say so. */
  if (fs.existsSync(cf)) {
    return { ok: true, body: binary ? fs.readFileSync(cf) : fs.readFileSync(cf, 'utf8'),
             from: 'stale-cache', status: 0, error: String(lastErr && lastErr.message || lastErr) };
  }
  return { ok: false, error: String(lastErr && lastErr.message || lastErr), from: 'none', status: 0 };
}

async function getJson(url, opts) {
  const r = await get(url, opts);
  if (!r.ok) return r;
  try { return Object.assign({}, r, { json: JSON.parse(r.body) }); }
  catch (e) { return { ok: false, error: 'invalid JSON: ' + e.message, from: r.from }; }
}

function gunzip(buf) { return zlib.gunzipSync(buf).toString('utf8'); }

module.exports = { get, getJson, gunzip, CACHE };

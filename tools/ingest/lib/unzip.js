/* ingest/lib/unzip.js — minimal ZIP reader (stored + deflate) built on zlib.
 * FEMA publishes the National Risk Index county table only as a zip, and
 * pulling a dependency for one archive is not worth it. */
'use strict';
const zlib = require('zlib');

function readEntries(buf) {
  /* Locate the End Of Central Directory record. */
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip archive (no EOCD)');

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = [];

  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    entries.push({ name, method, compSize, localOff });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extract(buf, entry) {
  const lo = entry.localOff;
  if (buf.readUInt32LE(lo) !== 0x04034b50) throw new Error('bad local header');
  const nameLen = buf.readUInt16LE(lo + 26);
  const extraLen = buf.readUInt16LE(lo + 28);
  const start = lo + 30 + nameLen + extraLen;
  const raw = buf.subarray(start, start + entry.compSize);
  if (entry.method === 0) return raw;
  if (entry.method === 8) return zlib.inflateRawSync(raw);
  throw new Error('unsupported compression method ' + entry.method);
}

/** Extract the first entry whose name matches `re`, as UTF-8 text. */
function readTextMatching(buf, re) {
  const entries = readEntries(buf);
  const hit = entries.find(e => re.test(e.name));
  if (!hit) throw new Error('no entry matching ' + re + ' (' + entries.map(e => e.name).join(', ') + ')');
  return extract(buf, hit).toString('utf8');
}

module.exports = { readEntries, extract, readTextMatching };

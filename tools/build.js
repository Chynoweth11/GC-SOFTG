#!/usr/bin/env node
/* ============================================================================
 * tools/build.js — inlines the whole application into single files.
 *
 *   dist/index.html     standalone page; opens from the filesystem, no server
 *   dist/artifact.html  body-content only, for publishing as a Claude Artifact
 *
 * No bundler, no transpiler: the sources are already plain ES5-compatible
 * scripts loaded in dependency order, so "building" means concatenating them
 * in exactly the order index.html declares.
 * ==========================================================================*/
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

/* Guard against a source file accidentally closing the inline script block. */
function safeJs(src) { return src.replace(/<\/script>/gi, '<\\/script>'); }

let out = html;

/* stylesheets */
out = out.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) =>
  '<style>\n' + read(href) + '\n</style>');

/* scripts, in declared order */
out = out.replace(/<script src="([^"]+)"><\/script>/g, (_, src) =>
  '<script>\n/* ==== ' + src + ' ==== */\n' + safeJs(read(src)) + '\n</script>');

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist/index.html'), out);

/* ---- artifact variant: content only, no document scaffolding -------------- */
const title = (out.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'LCDOS Terminal';
const head = out.slice(out.indexOf('<head>') + 6, out.indexOf('</head>'));
const body = out.slice(out.indexOf('<body>') + 6, out.lastIndexOf('</body>'));
const styles = (head.match(/<style>[\s\S]*?<\/style>/g) || []).join('\n');

const artifact =
  '<title>' + title + '</title>\n' +
  styles + '\n' +
  '<div id="lcdos-root">' + body + '</div>\n';

fs.writeFileSync(path.join(ROOT, 'dist/artifact.html'), artifact);

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log('dist/index.html    ' + kb(Buffer.byteLength(out)));
console.log('dist/artifact.html ' + kb(Buffer.byteLength(artifact)));

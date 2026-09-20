#!/usr/bin/env node
/**
 * tools/build-lesson.js <lesson-slug>
 *
 * Runs the whole pipeline for one lesson, in the order CLAUDE.md documents:
 *
 *   build/<slug>.js            writes out/<Lesson Name>.pptx
 *   spec/<slug>-spec.js        writes spec/<slug>.anim.json
 *   lib/animate.js             writes <p:timing> into the deck
 *   lib/autoplay-media.js      makes the timer video its own clock
 *   tools/validate.js          structural + speaker-notes check
 *
 * then renders it so it can actually be looked at:
 *
 *   tools/make-preview.py      QA copy with show="0" stripped
 *   soffice --convert-to pdf   PDF
 *   pdftoppm                   one PNG per slide, in out/preview-png/<slug>/
 *
 * Stops at the first failure — nothing downstream of a broken step runs,
 * and the reason is printed, not just a stack trace.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function fail(msg) {
  console.error(`\n✗ BUILD FAILED — ${msg}\n`);
  process.exit(1);
}

function which(cmd) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd]);
  return r.status === 0;
}

/** Run a command with output streamed live; abort the pipeline on any failure. */
function step(label, cmd, args) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (r.error) fail(`${label} could not be run — ${r.error.message}`);
  if (r.status !== 0) fail(`${label} failed (exit code ${r.status})`);
}

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node tools/build-lesson.js <lesson-slug>');
  console.error('       npm run lesson -- <lesson-slug>');
  process.exit(1);
}

const buildScript = path.join(ROOT, 'build', `${slug}.js`);
const specScript = path.join(ROOT, 'spec', `${slug}-spec.js`);
const specJson = path.join(ROOT, 'spec', `${slug}.anim.json`);

if (!fs.existsSync(buildScript)) fail(`no deck builder at build/${slug}.js`);
if (!fs.existsSync(specScript)) fail(`no spec generator at spec/${slug}-spec.js`);

/* ---- 1. deck ------------------------------------------------------ */
step('deck builder', 'node', [`build/${slug}.js`]);

/* ---- 2. animation spec -------------------------------------------- */
step('spec generator', 'node', [`spec/${slug}-spec.js`]);
if (!fs.existsSync(specJson)) {
  fail(`spec/${slug}-spec.js did not write spec/${slug}.anim.json — `
    + `check it writes to that exact path`);
}

/* ---- resolve the deck path the spec actually points at ------------ */
let spec;
try {
  spec = JSON.parse(fs.readFileSync(specJson, 'utf8'));
} catch (e) {
  fail(`spec/${slug}.anim.json is not valid JSON — ${e.message}`);
}
const deckRel = spec.output || spec.deck;
if (!deckRel) fail(`spec/${slug}.anim.json has no "deck" or "output" field`);
const deckPath = path.resolve(ROOT, deckRel);
if (!fs.existsSync(deckPath)) {
  fail(`deck builder did not produce ${deckRel} (spec/${slug}.anim.json points at it, `
    + `but build/${slug}.js wrote somewhere else)`);
}

/* ---- 3. animate ----------------------------------------------------- */
step('animator', 'node', ['lib/animate.js', `spec/${slug}.anim.json`]);

/* ---- 4. autoplay ------------------------------------------------- */
step('autoplay injector', 'node', ['lib/autoplay-media.js', deckRel]);

/* ---- 5. validate ---------------------------------------------------- */
step('validator', 'node', ['tools/validate.js', deckRel]);

/* ---- 6. render: PDF, then one PNG per slide ------------------------ */
if (!which('python3')) fail('python3 not found on PATH — needed for tools/make-preview.py');
if (!which('soffice')) fail('LibreOffice (soffice) not found on PATH — brew install --cask libreoffice');
if (!which('pdftoppm')) fail('pdftoppm not found on PATH — brew install poppler');

const lessonName = path.basename(deckPath, '.pptx');
const previewPptxRel = path.join('out', `${lessonName}.preview.pptx`);
const previewPdfRel = path.join('out', `${lessonName}.preview.pdf`);
const previewDirRel = path.join('out', 'preview-png', slug);
const previewDir = path.join(ROOT, previewDirRel);

step('preview copy (un-hide slide 1)', 'python3', ['tools/make-preview.py', deckRel, previewPptxRel]);

step('convert to PDF', 'soffice', ['--headless', '--convert-to', 'pdf', '--outdir', 'out', previewPptxRel]);
if (!fs.existsSync(path.join(ROOT, previewPdfRel))) {
  fail(`LibreOffice did not produce ${previewPdfRel}`);
}

fs.mkdirSync(previewDir, { recursive: true });
step('render PNGs', 'pdftoppm', ['-png', '-r', '110', previewPdfRel, path.join(previewDirRel, 'slide')]);

const pngs = fs.readdirSync(previewDir).filter((f) => f.endsWith('.png')).sort();
if (!pngs.length) fail(`pdftoppm produced no PNGs in ${previewDirRel}/`);

console.log(`\n✓ ${lessonName} built, validated and rendered`);
console.log(`  deck:   ${deckRel}`);
console.log(`  pdf:    ${previewPdfRel}`);
console.log(`  slides: ${pngs.length} PNGs in ${previewDirRel}/`);

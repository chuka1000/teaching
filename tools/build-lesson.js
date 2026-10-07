#!/usr/bin/env node
/**
 * tools/build-lesson.js <lesson-slug>
 *
 * Runs the whole pipeline for one lesson, in the order CLAUDE.md documents:
 *
 *   build/<slug>.js            writes out/<Lesson Name>/<Lesson Name>.pptx
 *   spec/<slug>-spec.js        writes spec/<slug>.anim.json
 *   lib/animate.js             writes <p:timing> into the deck
 *   lib/autoplay-media.js      makes the timer video its own clock
 *   tools/validate.js          structural + speaker-notes check
 *   tools/check-builds.py      every click build and transition the spec asks for is in the deck
 *   tools/check-timers.py      a timer on every slide, running outside the click sequence
 *   tools/record-lesson.py     records class, unit, lesson in reference/MANIFEST.tsv
 *
 * then renders it so it can actually be looked at:
 *
 *   tools/make-preview.py      QA copy with show="0" stripped
 *   soffice --convert-to pdf   PDF
 *   pdftoppm                   one PNG per slide
 *
 * Per CLAUDE.md's output layout, everything from the render step goes in
 * out/<Lesson Name>/_check/ — build artefacts for looking at the deck before
 * handing it over, not deliverables. Delete that folder once a lesson passes;
 * keep it if something looked wrong and needs showing.
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
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, LESSON_PIPELINE: '1' } });
  if (r.error) fail(`${label} could not be run — ${r.error.message}`);
  if (r.status !== 0) fail(`${label} failed (exit code ${r.status})`);
}

const slug = process.argv[2];
const extra = process.argv.slice(3);   // optional: --class C --unit U --lesson N, passed to record-lesson.py
if (!slug) {
  console.error('usage: node tools/build-lesson.js <lesson-slug> [--class C] [--unit U] [--lesson N]');
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

/* ---- 5a. the deck must really be animated --------------------------------
 * A deck with no builds renders fine and passes validate.js, but its Do Now answers all show at
 * once. These two checks fail the build if the animations or the timers are not there. */
step('builds and transitions match the spec', 'python3', ['tools/check-builds.py', deckRel]);
step('timers', 'python3', ['tools/check-timers.py', deckRel]);

/* ---- 5b. record ------------------------------------------------------
 * Written to reference/MANIFEST.tsv from the deck's OWN dc:title and dc:subject, while it is
 * still exactly as built. Re-saving a deck later in Keynote or PowerPoint cannot touch this.
 * The subject is '<Year> <Subject> · <Unit> · Lesson <N> · <class code>' (see CLAUDE.md). A deck
 * whose class cannot be worked out stops the build: an unrecorded lesson is how the index went wrong. */
step('record in reference/MANIFEST.tsv', 'python3', ['tools/record-lesson.py', '--deck', deckRel, ...extra]);

/* ---- 6. render: PDF, then one PNG per slide ------------------------ */
if (!which('python3')) fail('python3 not found on PATH — needed for tools/make-preview.py');
if (!which('soffice')) fail('LibreOffice (soffice) not found on PATH — brew install --cask libreoffice');
if (!which('pdftoppm')) fail('pdftoppm not found on PATH — brew install poppler');

const lessonName = path.basename(deckPath, '.pptx');
const lessonDirRel = path.relative(ROOT, path.dirname(deckPath));
const checkDirRel = path.join(lessonDirRel, '_check');
const checkDir = path.join(ROOT, checkDirRel);
fs.mkdirSync(checkDir, { recursive: true });

const previewPptxRel = path.join(checkDirRel, `${lessonName}.preview.pptx`);
const previewPdfRel = path.join(checkDirRel, `${lessonName}.preview.pdf`);

step('preview copy (un-hide slide 1)', 'python3', ['tools/make-preview.py', deckRel, previewPptxRel]);

step('convert to PDF', 'soffice', ['--headless', '--convert-to', 'pdf', '--outdir', checkDirRel, previewPptxRel]);
if (!fs.existsSync(path.join(ROOT, previewPdfRel))) {
  fail(`LibreOffice did not produce ${previewPdfRel}`);
}

step('render PNGs', 'pdftoppm', ['-png', '-r', '110', previewPdfRel, path.join(checkDirRel, 'slide')]);

const pngs = fs.readdirSync(checkDir).filter((f) => f.endsWith('.png')).sort();
if (!pngs.length) fail(`pdftoppm produced no PNGs in ${checkDirRel}/`);

/* phase minutes, read from the finished deck, in SLIDE order: no need to re-run build/<slug>.js to see them */
{
  const names = (spawnSync('unzip', ['-Z1', deckPath], { encoding: 'utf8' }).stdout || '').split('\n')
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
  const mins = names.map((n) => {
    const x = spawnSync('unzip', ['-p', deckPath, n], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout || '';
    const m = x.match(/<a:t>[A-Z][A-Z ]+ · (\d+) MIN<\/a:t>/); return m ? +m[1] : 0;
  });
  console.log(`\nphase minutes: ${mins.join(', ')} = ${mins.reduce((a, b) => a + b, 0)} min`);
}

console.log(`\n✓ ${lessonName} built, validated and rendered`);
console.log(`  deck:   ${deckRel}`);
console.log(`  check:  ${checkDirRel}/  (${pngs.length} PNGs — delete this folder once the deck looks right)`);

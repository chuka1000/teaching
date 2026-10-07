/**
 * Greyscale copies of the unit's pictures for the Living things assessment (ASSESSMENT.md: printed in black and white,
 * and photographs must survive greyscale). Every key the paper or the feedback sheet uses, from the photograph the class
 * saw (or the drawing, for the few that have no photograph), normalised so a dark photo still prints.
 *
 *   node build/living-things-assessment-pictures.js     -> assets/assessment/living/g_<key>.png
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { picFile } = require('./living-things-kit');
const { QUESTIONS, FEEDBACK, PIC } = require('./living-things-assessment-content');

const OUT = path.join(__dirname, '..', 'assets', 'assessment', 'living');
fs.mkdirSync(OUT, { recursive: true });
const keys = new Set(Object.values(PIC));
const walk = (b) => {
  if (!b || typeof b !== 'object') return;
  for (const v of Object.values(b)) {
    if (typeof v === 'string' && v.startsWith('g_')) keys.add(v);
    else if (Array.isArray(v)) v.forEach((x) => (typeof x === 'string' && x.startsWith('g_') ? keys.add(x) : walk(x)));
    else if (typeof v === 'object') walk(v);
  }
};
QUESTIONS.forEach((q) => walk(q.blocks));
FEEDBACK.forEach((f) => ['S', 'C', 'E'].forEach((v) => walk(f[v])));
// the sort and order blocks name plain keys: they need greyscale copies too
const plain = (list) => list.forEach((b) => { if (b.k === 'sort' || b.k === 'order') b.items.forEach((k) => keys.add(`g_${k}`)); });
QUESTIONS.forEach((q) => plain(q.blocks));
FEEDBACK.forEach((f) => ['S', 'C', 'E'].forEach((v) => plain(f[v])));

(async () => {
  for (const g of [...keys].sort()) {
    const key = g.slice(2);
    const src = picFile(key);
    await sharp(src).flatten({ background: '#ffffff' }).resize(400, 400, { fit: 'contain', background: '#ffffff' })
      .grayscale().normalise().png().toFile(path.join(OUT, `${g}.png`));
  }
  console.log(`${keys.size} greyscale pictures in assets/assessment/living/`);
})();

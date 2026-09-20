/**
 * T3 Developing Science (CLIL) — Atoms, Lesson 3 worksheet.
 * Word-bank + writing-line style throughout — no line-drawing matching tasks.
 * Mirrors the section-lettering Drawing an Atom's worksheet used (A-F).
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, PAGE_W, p, runs, t, h1, cell, table, ruledBox, blankBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, TextRun, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber } = D;

const OUT = path.join(__dirname, '..', 'out');
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can point to the nucleus.',
  'I can say what a proton is.',
  'I can say what a neutron is.',
  'I can say: "The nucleus is made of protons and neutrons."',
];

const head = (right) => new Header({ children: [runs([
  t('T3 · Atoms · The nucleus  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('The nucleus'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));
  k.push(ragGrid(SUCCESS));

  k.push(boxed(p('The nucleus is made of protons and neutrons.', {
    size: 15, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 8, fill: 'FDF3DC' }));

  k.push(runs([
    t('Word bank: ', { bold: true, size: 10.5 }),
    t('nucleus · proton · neutron', { size: 10.5, italic: true }),
    t('.  Point first, then say the whole sentence.', { size: 10.5 }),
  ], { before: 160, after: 160 }));

  /* ---- A: DO NOW ---- */
  k.push(q('A1', 'Is an atom tiny?', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('A2', 'Is the nucleus the centre or the outside of the atom?', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('A3', 'Complete: "The nucleus is in the ___ of the atom."', { marks: 1 }));
  k.push(ruledBox(1));

  /* ---- B: DRAW ---- */
  k.push(q('B', 'Draw the model. Draw a circle. Draw the nucleus inside it.', { marks: 2 }));
  k.push(blankBox(2600));

  /* ---- C: COLOUR + LABEL ---- */
  k.push(q('C', 'Colour the protons one colour. Colour the neutrons a different colour. Label: nucleus, proton, neutron.', { marks: 3 }));

  /* ---- D: POINT AND SAY ---- */
  k.push(q('D', 'Point to a proton. Point to a neutron. Then say the whole sentence to your partner.', { marks: 1 }));
  k.push(runs([
    t('The nucleus is made of ', { size: 10.5 }),
    t('_'.repeat(14), { color: C.rule, size: 10.5 }),
    t(' and ', { size: 10.5 }),
    t('_'.repeat(14), { color: C.rule, size: 10.5 }),
    t('.', { size: 10.5 }),
  ], { before: 60, after: 100 }));
  k.push(p('Partner check: did they point first? Did they use the whole sentence?',
    { size: 9.5, italic: true, color: C.soft, after: 160 }));

  /* ---- E: EXPLAIN (open — comes last) ---- */
  k.push(q('E', 'What is inside the nucleus?', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- F: EXTRA CHALLENGE ---- */
  k.push(p('F · Extra challenge', { size: 10.5, bold: true, color: C.dark, after: 40 }));
  k.push(p('Draw a second atom. Add 3 protons and 2 neutrons. Label it without the word bank.',
    { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(blankBox(2200));

  k.push(p('', { after: 120 }));
  k.push(boxed(p('Gemini: ask it to check whether you placed the protons and neutrons in the right place. Do not ask it what a proton is — saying that yourself is the point of today.',
    { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F8FA' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = 'The Nucleus worksheet.docx';
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

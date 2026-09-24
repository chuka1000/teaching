/**
 * T3 Developing Science (CLIL) — Atoms: the words and the picture, worksheet.
 * Word bank and writing line throughout, no line-drawing matching (CLIL.md).
 * Every picture is one the class has already seen (assets/atoms/, extracted
 * from the three reference decks by tools/extract-atoms-assets.py). No new
 * word. Sections A to D mirror the slide: A words (objective 1), B draw and
 * label (objective 2), C sentences (objective 3), D point and say.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, PAGE_W, p, runs, t, h1, cell, table, blankBox, ragGrid, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, ImageRun, AlignmentType, HeightRule, BorderStyle, VerticalAlign, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Atoms The Words And The Picture';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const IMG = (n) => path.join(__dirname, '..', 'assets', 'atoms', n);

const SUCCESS = [
  'I can match the words to the pictures.',
  'I can draw an atom and label the centre and the outside.',
  'I can write the sentences.',
];

/** A picture as an inline image. `type: 'png'` is required or Word shows nothing. */
function pic(file, box) {
  const b = fs.readFileSync(IMG(file));
  const iw = b.readUInt32BE(16), ih = b.readUInt32BE(20);
  const k = Math.min(box / iw, box / ih);
  return new ImageRun({ type: 'png', data: b, transformation: { width: Math.round(iw * k), height: Math.round(ih * k) } });
}
const picPara = (files, box, o = {}) => new Paragraph({
  alignment: o.align || AlignmentType.CENTER, spacing: { before: o.before ?? 40, after: o.after ?? 40 },
  children: files.flatMap((f, i) => (i ? [new TextRun({ text: '  ' }), pic(f, box)] : [pic(f, box)])),
});

const head = (right) => new Header({ children: [runs([
  t('T3 · Atoms · the words and the picture  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

const sect = (letter, text) => runs([
  t(`${letter}  `, { bold: true, size: 12, color: C.accent }),
  t(text, { bold: true, size: 11.5, color: C.dark }),
], { before: 200, after: 80, keepNext: true });

/** Section A: ten pictures in a mixed order, a writing line under each. */
const A_ORDER = [
  ['part.png', 'part'], ['proton.png', 'proton'], ['electron.png', 'electron'], ['matter.png', 'matter'], ['outside.png', 'outside'],
  ['atom_green.png', 'atom'], ['neutron.png', 'neutron'], ['nucleus.png', 'nucleus'], ['tiny.png', 'tiny'], ['centre.png', 'centre'],
];
function pictureGrid() {
  const w = Math.floor(PAGE_W / 5);
  const rows = [];
  for (let g = 0; g < 2; g++) {
    const slice = A_ORDER.slice(g * 5, g * 5 + 5);
    rows.push(new TableRow({
      height: { value: 1250, rule: HeightRule.ATLEAST },
      children: slice.map(([f], i) => cell(picPara([f], 62), { w, valign: VerticalAlign.CENTER })),
    }));
    rows.push(new TableRow({
      height: { value: 620, rule: HeightRule.EXACT },
      children: slice.map((_, i) => cell(
        [new Paragraph({ children: [new TextRun({ text: `${g * 5 + i + 1}`, size: 14, color: C.soft, font: FONT })] })],
        { w, valign: VerticalAlign.BOTTOM })),
    }));
  }
  return table(rows, Array(5).fill(w));
}

/** Section C: a picture, then the sentence with gaps to fill. */
const C_ROWS = [
  { files: ['tiny.png'], text: ['An atom is a tiny ', 12, ' of ', 10, '.'] },
  { files: ['water.png'], text: [null, 16, ' is made of atoms.'] },
  { files: ['apple.png'], text: [null, 16, ' is made of atoms.'] },
  { files: ['centre.png'], text: ['The nucleus is in the ', 10, ' of the atom.'] },
  { files: ['electron.png'], text: ['The electron is ', 12, ' the nucleus.'] },
  { files: ['proton.png', 'neutron.png'], text: ['The nucleus is made of ', 12, ' and ', 12, '.'] },
];
function sentenceTable() {
  const w1 = 2100, w2 = PAGE_W - w1;
  const rows = C_ROWS.map((r, ri) => {
    const kids = [];
    r.text.forEach((piece) => {
      if (piece === null) return;
      if (typeof piece === 'number') kids.push(t('_'.repeat(piece), { size: 12, color: C.dark }));
      else kids.push(t(piece, { size: 12 }));
    });
    return new TableRow({
      cantSplit: true,
      height: { value: 900, rule: HeightRule.ATLEAST },
      children: [
        cell(picPara(r.files, 46), { w: w1, valign: VerticalAlign.CENTER }),
        cell([runs([t(`${ri + 1}   `, { bold: true, size: 11, color: C.accent }), ...kids], { after: 0, line: 300 })],
          { w: w2, valign: VerticalAlign.CENTER }),
      ],
    });
  });
  return table(rows, [w1, w2]);
}

function worksheet() {
  const k = [];
  k.push(h1('Atoms: the words and the picture'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 160 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 100 }));
  k.push(ragGrid(SUCCESS));

  k.push(boxed(p('atom · matter · tiny · part · nucleus · centre · electron · outside · proton · neutron', {
    size: 12.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 8, fill: 'FDF3DC' }));
  k.push(runs([
    t('Word bank. ', { bold: true, size: 10.5 }),
    t('Point first, then say the whole sentence.', { size: 10.5 }),
  ], { before: 100, after: 40 }));

  /* ---- A ---- */
  k.push(sect('A', 'Look and write'));
  k.push(p('Look at the picture. Write the word. Use the word bank.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(pictureGrid());

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- B ---- */
  k.push(sect('B', 'Draw and label'));
  k.push(p('Draw an atom. Label the centre and the outside.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(blankBox(2900));
  k.push(runs([
    t('Use these words: ', { size: 10.5, bold: true }), t('centre · outside · nucleus · electron', { size: 10.5, italic: true }),
  ], { before: 80, after: 60 }));

  /* ---- C ---- */
  k.push(sect('C', 'Write the sentences'));
  k.push(p('Look at the picture. Write the missing words. Say each sentence.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(sentenceTable());

  /* ---- D ---- */
  k.push(sect('D', 'Point and say'));
  k.push(p('Point to a part of your atom. Say the sentence to your partner. Do it three times.', { size: 10.5, after: 60 }));
  k.push(p('Partner check: did they point first? Did they say the whole sentence?', { size: 9.5, italic: true, color: C.soft, after: 60 }));

  k.push(boxed(p('Finished? Same sentence. Three more pictures: a rock, a chair, my hand.  ______  is made of atoms.', {
    size: 10.5, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F8FA' }));
  k.push(picPara(['matter.png', 'part.png', 'hand.png'], 46, { before: 60 }));

  k.push(p('', { after: 20 }));
  k.push(boxed(p('Gemini: ask it to check your sentences. Do not ask it to write them for you.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F8FA' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

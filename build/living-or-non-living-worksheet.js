/**
 * T3 Developing Science (CLIL), Unit 4 Lesson 1: Living Or Non-Living, worksheet.
 * Picture-led, a word bank and writing lines, no line-drawing matching (CLIL.md). Every picture is the one on the slides.
 * A: the four new words from their picture sets. B: the sorting chart from the unit plan (living / non-living boxes).
 * C: the sentence frame, one gap, then the whole sentence. D: point and say. Every classification comes from
 * build/living-or-non-living-answers.js, which also gives the answers printed UPSIDE DOWN at the end.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('meadow');
const { D, C, FONT, PAGE_W, p, runs, t, h1, cell, table, ragGrid, boxed, writeLines } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, ImageRun, AlignmentType, HeightRule, VerticalAlign, Header, Footer, PageNumber, TextRun, BorderStyle } = D;
const ANS = require('./living-or-non-living-answers');
const { WORDS, SHEET_A, SHEET_B, SHEET_C, name } = ANS;

const LESSON = 'Living Or Non-Living';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 964, right: 964 } };
const { picFile } = require('./living-things-kit');   // the photograph if there is one, else the drawing
const PIC = (n) => picFile(n);
const LIVE_FILL = '237D38', STONE_FILL = '5E6B78';

/** A picture as an inline image. `type` is required or Word shows nothing. The pictures are square. */
const pic = (k, px) => new ImageRun({ type: PIC(k).endsWith('.jpg') ? 'jpg' : 'png', data: fs.readFileSync(PIC(k)), transformation: { width: px, height: px } });
const picPara = (keys, px, o = {}) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: o.before ?? 40, after: o.after ?? 20 },
  children: keys.flatMap((k, i) => (i ? [new TextRun({ text: '   ' }), pic(k, px)] : [pic(k, px)])),
});
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };

const head = (right) => new Header({ children: [runs([
  t('T3 Developing Science  ·  Living things, Lesson 1  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });
const sect = (letter, text) => runs([
  t(`${letter}  `, { bold: true, size: 14, color: C.accent }),
  t(text, { bold: true, size: 13, color: C.dark }),
], { before: 160, after: 40, keepNext: true });
const how = (text) => p(text, { size: 11, italic: true, color: C.soft, after: 60, keepNext: true });

/** A: four picture sets, two by two, a number and a writing line under each. */
function sectionA() {
  const w = Math.floor(PAGE_W / 2);
  const rows = [];
  for (let r = 0; r < 2; r++) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [0, 1].map((c) => {
        const i = r * 2 + c;
        return cell([
          runs([t(`${i + 1}`, { bold: true, size: 12, color: C.accent })], { after: 0 }),
          picPara(WORDS[SHEET_A[i]], 46, { before: 0, after: 10 }),
          ...writeLines(1, w - 900, { keepNext: false }),
        ], { w, valign: VerticalAlign.TOP });
      }),
    }));
  }
  return table(rows, [w, w]);
}

/** B: twelve pictures with their names, then the two boxes to write them in. */
function sectionB() {
  const w = Math.floor(PAGE_W / 6);
  const rows = [0, 1].map((r) => new TableRow({
    cantSplit: true,
    children: SHEET_B.slice(r * 6, r * 6 + 6).map((k) => cell([
      picPara([k], 40, { before: 10, after: 30 }),
      p(name(k), { size: 12, bold: true, align: AlignmentType.CENTER, after: 0 }),
    ], { w })),
  }));
  // the two boxes: six slots in each, one word per slot
  const q4 = Math.floor(PAGE_W / 4);
  const box = (label, fill) => cell([
    p(label, { size: 13, bold: true, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 }),
  ], { w: 2 * q4, span: 2, fill });
  const slot = () => cell(writeLines(1, q4 - 300, { keepNext: false, height: 40 }), { w: q4 });
  return [
    table(rows, Array(6).fill(w)),
    p('', { size: 4, after: 100, keepNext: true }),
    table([new TableRow({ cantSplit: true, children: [box('living', LIVE_FILL), box('non-living', STONE_FILL)] }),
           ...[0, 1, 2].map(() => new TableRow({ cantSplit: true, children: [slot(), slot(), slot(), slot()] }))], [q4, q4, q4, q4]),
  ];
}

/** C: a picture, then the sentence with one gap; the last two rows are the whole sentence. */
function sectionC() {
  const w1 = 1500, w2 = PAGE_W - w1;
  const rows = SHEET_C.map((r, i) => new TableRow({
    cantSplit: true,
    height: { value: 860, rule: HeightRule.ATLEAST },
    children: [
      cell(picPara([r.key], 46, { before: 20, after: 20 }), { w: w1, valign: VerticalAlign.CENTER }),
      cell(r.whole
        ? [runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t('Write the whole sentence.', { size: 11, italic: true, color: C.soft })], { after: 40 }),
           ...writeLines(1, w2 - 400, { keepNext: false })]
        : [runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t(r.pre, { size: 14 }),
                 t('_'.repeat(14), { size: 14, color: C.dark }), t('.', { size: 14 })], { after: 0, line: 320 })],
      { w: w2, valign: VerticalAlign.CENTER }),
    ],
  }));
  return table(rows, [w1, w2]);
}

function worksheet(answers) {
  const k = [];
  k.push(h1('Living or non-living?'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 140 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, after: 80 }));
  k.push(ragGrid([
    'I can say living, non-living, plant and animal.',
    'I can sort things: living or non-living.',
    'I can write the sentence: A dog is living.',
  ]));
  k.push(p('', { size: 4, after: 60 }));
  k.push(boxed(p('living   ·   non-living   ·   plant   ·   animal', {
    size: 16, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 8, fill: 'FFF4D6' }));
  k.push(runs([t('Word bank. ', { bold: true, size: 11 }), t('Point first, then say the whole sentence.', { size: 11 })], { before: 80, after: 40 }));

  k.push(sect('A', 'Look and write'));
  k.push(how('Look at the pictures. Write the word. Use the word bank.'));
  k.push(sectionA());

  k.push(sect('B', 'Sort'));
  k.push(how('Is it living or non-living? Write each word in the right box.'));
  k.push(...sectionB());

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(sect('C', 'Write the sentence'));
  k.push(how('Look at the picture. Write the missing word. Say the sentence.'));
  k.push(sectionC());

  k.push(sect('D', 'Point and say'));
  k.push(p('Point at a picture. Your partner says the sentence. Then swap.', { size: 12, after: 40 }));
  k.push(p('Partner check: did they say the whole sentence?', { size: 10, italic: true, color: C.soft, after: 120 }));

  k.push(boxed([
    p('Finished? Look around the room. Write two more sentences.', { size: 11.5, bold: true, after: 60 }),
    ...writeLines(2, PAGE_W - 400, { keepNext: false }),
  ], { colour: C.rule, weight: 4, fill: 'F4F8EF' }));
  k.push(p('', { size: 4, after: 80 }));
  k.push(boxed(p('Gemini: ask it to check your sentences. Do not ask it to write them for you.', { size: 10, after: 0 }),
    { colour: C.rule, weight: 4, fill: 'F4F8EF' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 22, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(ANS, { before: 200 });
  const buf = await Packer.toBuffer(worksheet(answers));
  const file = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log('written:', file, Math.round(buf.length / 1024) + ' KB');
})();

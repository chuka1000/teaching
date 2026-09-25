/**
 * Y8 Maths, Putting Numbers In, worksheet (8CN). The fallback for the game.
 * Questions 1-10 match the Answers slide exactly, in order. Non-calculator,
 * positive whole numbers only, no fractions, no division (the brief said AVOID
 * negatives and fractions). Every answer is checked in
 * build/putting-numbers-in-check.py. Q9 and Q10 are the bracket skill the
 * class found hard: multiplying each term by the outside factor.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Putting Numbers In';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can substitute a positive whole number into a one-step formula.',
  'I can substitute into a two-step formula and multiply before I add.',
  'I can substitute into a formula with brackets.',
  'I can substitute into a formula with two letters.',
];

const head = (right) => new Header({ children: [runs([
  t('Y8 Maths  ·  Algebra, Lesson 4  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Putting Numbers In'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 140 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 80 }));
  k.push(ragGrid(SUCCESS));

  k.push(runs([
    t('Non-calculator. ', { bold: true, size: 10.5 }),
    t('Swap the letter for the number, then work it out. Write each step. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 60 }));
  k.push(boxed(p('Swap the letter for the number.  Multiply before you add.  The bracket multiplies everything inside.', {
    size: 11.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 8, fill: 'F2F0F8' }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('One step, then two steps.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Find the value of 4n when n = 7.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Find the value of 12 − n when n = 5.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Find the value of 5n + 3 when n = 4.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'Find the value of 2 + 6n when n = 3.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Brackets, subtraction and two letters.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Find the value of 4(n + 2) when n = 3.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Find the value of 30 − 4n when n = 5.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Find the value of 5a + 2b when a = 3 and b = 4.', { marks: 2 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'The perimeter of a rectangle is P = 2(l + w). Find P when l = 8 and w = 5.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'A student says: "When x = 4, 3(x + 2) = 3 × 4 + 2 = 14." Find the mistake, then work out the correct value.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Expand 5(n + 3). Then find the value of 5(n + 3) and the value of your expansion when n = 4. Show that they agree.', { marks: 4 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 40 }));
  k.push(boxed(p('Gemini: ask it to check a finished solution. Do not ask it to solve a question you have not tried. Check anything it says against your notes.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F0F8' }));
  k.push(...answers);                       // the answers, upside down, at the end

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./putting-numbers-in-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

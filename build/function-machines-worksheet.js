/**
 * Y8 Maths, Function Machines, worksheet (8CN). The fallback for the game.
 * Questions 1-10 match the Answers slide exactly, in order. Non-calculator, every
 * number a positive whole number, pitched a step above the last lesson because
 * the class found it too easy: two-step machines from the first question, brackets
 * in the rules, and a Gold section that goes past the lesson (the same two boxes in
 * two orders, an input that equals its output, a rule found from a table). Every
 * answer is checked in build/function-machines-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed, table, cell } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun, TableRow } = D;

const LESSON = 'Function Machines';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can find the output of a two-step function machine.',
  'I can write the rule for a machine as a formula.',
  'I can find the input when I am given the output.',
  'I can explain why the order of the steps matters.',
];

const head = (right) => new Header({ children: [runs([
  t('Y8 Maths  ·  Algebra, Lesson 5  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** a small Input / Output table for question 10 (a top-level table, so it survives Google Docs) */
function inOut() {
  const w = 1500, w2 = 1100;
  const row = (label, vals, bold) => new TableRow({ children: [
    cell(p(label, { size: 10.5, bold: true, after: 0 }), { w, fill: 'F2F0F8' }),
    ...vals.map((v) => cell(p(String(v), { size: 10.5, bold: !!bold, after: 0, align: AlignmentType.CENTER }), { w: w2 })),
  ] });
  return table([row('Input', [2, 5, 8]), row('Output', [7, 16, 25])], [w, w2, w2, w2]);
}

function worksheet(answers) {
  const k = [];
  k.push(h1('Function Machines'));
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
    t('Write each step. In a machine, the boxes are done in order from left to right. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 60 }));
  k.push(boxed(p('Follow the boxes in order.  The rule uses n for the input.  To go backwards, undo the last step first.', {
    size: 11.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 8, fill: 'F2F0F8' }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Outputs and rules.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'A machine does × 5, then + 3. Find the output when the input is 6.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'A machine does ÷ 3, then − 2. Find the output when the input is 21.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Write the rule as a formula for a machine that multiplies by 4, then subtracts 5.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'The rule is 3n + 4. Find the output when n = 9.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Brackets, and working backwards.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Write the rule as a formula for a machine that adds 3, then multiplies by 5.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'A machine does × 4, then + 7. The output is 39. Find the input.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('7', 'The rule is 2(n − 5). The output is 14. Find the input.', { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'Machine A does × 3, then + 4. Machine B does + 4, then × 3. Write the rule for each machine as a formula. Find the output of each when the input is 5. Explain why they are different.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('9', 'A machine does × 3, then − 8. Find the input that gives an output equal to the input. Show that your answer works.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A machine has two steps. The table shows some inputs and outputs. Find the rule as a formula. Then find the output when the input is 20.', { marks: 4 }));
  k.push(inOut());
  k.push(p('', { after: 60 }));
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
  const answers = await DP.answersBlock(require('./function-machines-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

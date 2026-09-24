/**
 * Y7 Science, Burning Food, printed recording sheet (7B).
 * Chuka asked for printed sheets to record the question, independent,
 * dependent and control variables, hypothesis, results and conclusion.
 * Questions 1-10 match the Answers slide exactly, in order. Bronze is Plan it
 * (Q1-4), Silver is Test it (Q5-7), Gold is Explain it (Q8-10). It is a
 * sequence, so everyone does all three. Results table is Q6.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Burning Food';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can name the independent variable.',
  'I can name the dependent variable.',
  'I can name the control variables.',
  'I can record repeat results and explain why we repeat.',
];

const head = (right) => new Header({ children: [runs([
  t('Y7 Science  ·  Burning Food  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** Q6: three trials, four rows. The rise is highest minus starting. */
function resultsTable() {
  const w1 = 3300, wt = Math.floor((PAGE_W - w1) / 3);
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const rowFor = (label, note) => new TableRow({
    height: { value: 560, rule: HeightRule.ATLEAST },
    children: [
      cell([runs([t(label, { bold: true, size: 10.5, color: C.dark }), ...(note ? [t(`  ${note}`, { size: 8.5, color: C.soft })] : [])], { after: 0 })], { w: w1 }),
      cell(p('', { after: 0 }), { w: wt }), cell(p('', { after: 0 }), { w: wt }), cell(p('', { after: 0 }), { w: wt }),
    ],
  });
  return table([
    new TableRow({ children: [hdr('', w1), hdr('Trial 1', wt), hdr('Trial 2', wt), hdr('Trial 3', wt)] }),
    rowFor('Mass of food (g)'),
    rowFor('Starting temperature (°C)'),
    rowFor('Highest temperature (°C)'),
    rowFor('Rise (°C)', 'highest minus start'),
  ], [w1, wt, wt, wt]);
}

/** Q8: the class averages, one row per food. */
function classTable() {
  const w1 = 3300, w2 = PAGE_W - w1;
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const rowFor = (name) => new TableRow({
    height: { value: 480, rule: HeightRule.ATLEAST },
    children: [
      cell(p(name, { bold: true, size: 10.5, after: 0, color: C.dark }), { w: w1 }),
      cell(p('', { after: 0 }), { w: w2 }),
    ],
  });
  return table([
    new TableRow({ children: [hdr('Food', w1), hdr('Class average rise (°C)', w2)] }),
    ...['Bread', 'Corn flakes', 'Crisps', 'Crackers'].map(rowFor),
  ], [w1, w2]);
}

function worksheet() {
  const k = [];
  k.push(h1('Burning Food'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 160 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 100 }));
  k.push(ragGrid(SUCCESS));

  k.push(runs([
    t('Your food: ', { bold: true, size: 11 }), t('_'.repeat(28), { color: C.rule, size: 11 }),
  ], { before: 200, after: 60 }));
  k.push(boxed(p('Change one thing. Measure one thing. Keep the rest the same. Then do it again.', {
    size: 12, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FFF6CC' }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Plan it. Fill this in before you touch any food.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Write the question you are investigating.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Name the independent variable.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Name the dependent variable.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Name three control variables.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Test it. Write your hypothesis first, then record every trial.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Write a hypothesis. Use "if, then, because".', { marks: 3 }));
  k.push(p('If I burn ____________, then the water ____________________, because ____________________.',
    { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Record your results. Do three trials of your food.', { marks: 3 }));
  k.push(resultsTable());
  k.push(p('', { after: 100 }));
  k.push(q('7', 'Calculate the average rise for your food.', { marks: 2 }));
  k.push(runs([
    t('Average rise = (trial 1 + trial 2 + trial 3) ÷ 3 = ', { size: 10.5 }), t('_'.repeat(14), { color: C.rule, size: 10.5 }), t(' °C', { size: 10.5 }),
  ], { after: 100 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Explain it. Copy the class averages first.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(classTable());
  k.push(p('', { after: 100 }));
  k.push(q('8', 'Write a conclusion. Say which food heated the water the most, and quote the numbers.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Explain why you repeated each burn.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'State one thing that made your test less fair. Say how you would improve it.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q2 and Q3 are the right way round. Do not ask it to write your conclusion. Using the numbers yourself is the point.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F6FB' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Recording sheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

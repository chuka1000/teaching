/**
 * Y10 Equations of Motion worksheet.
 *
 * Questions 1 to 10 match the ANSWERS slide exactly, in order, so students
 * mark their own. Every numeric answer was checked with sympy before being
 * written into either file.
 */
const fs = require('fs');
const path = require('path');
const DP = require('./lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, PAGE_W, p, runs, t, h1, h2, tier, cell, table, ruledBox, ragGrid, q,
        line, none, boxed } = DP;
const { Document, Packer, Paragraph, TextRun, TableRow, PageBreak, AlignmentType,
        HeightRule, VerticalAlign, Header, Footer, PageNumber } = D;

const OUT = path.join(__dirname, 'out');
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can write down both equations of motion from memory.',
  'I can substitute numbers into v = u + at.',
  'I can substitute numbers into s = \u00BD(u + v)t.',
  'I can find v first and then use it to find s.',
  'I can say when these equations stop working.',
];

const head = (right) => new Header({ children: [runs([
  t('Y10 Physics  \u00b7  Equations of Motion  \u00b7  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** The u v a s t box students fill in before choosing an equation. */
function suvatBox() {
  const cols = ['u', 'v', 'a', 's', 't'];
  const w = Math.floor(PAGE_W / 5);
  return table([
    new TableRow({
      tableHeader: true,
      children: cols.map((c) => cell(
        p(c, { bold: true, size: 12, after: 0, align: AlignmentType.CENTER, color: C.dark }),
        { w, fill: C.headFill })),
    }),
    new TableRow({
      height: { value: 520, rule: HeightRule.ATLEAST },
      cantSplit: true,
      children: cols.map(() => cell(p('', { after: 0 }), { w })),
    }),
  ], Array(5).fill(w));
}

function worksheet() {
  const k = [];
  k.push(h1('Equations of Motion'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(34), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 120 }));
  k.push(ragGrid(SUCCESS));

  k.push(boxed(p('v = u + at                    s = \u00BD(u + v)t', {
    size: 17, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FFEFE2' }));

  k.push(runs([
    t('Non-calculator. Units on every answer. ', { bold: true, size: 10.5 }),
    t('Write down u, v, a, s and t before you choose an equation \u2014 then pick the one with three things you already know. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Substitute \u2014 the numbers go straight in.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Write down the equation that links v, u, a and t.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Write down the equation for s that uses u, v and t.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'An object starts from rest and accelerates at 3.0 m s\u207B\u00B2 for 5.0 s. Find v.', { marks: 2 }));
  k.push(suvatBox());
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('4', 'A car speeds up from 8.0 m s\u207B\u00B9 to 20 m s\u207B\u00B9 in 4.0 s. Find its acceleration.', { marks: 2 }));
  k.push(suvatBox());
  k.push(ruledBox(2));

  k.push(q('5', 'A cyclist starts from rest and reaches 24 m s\u207B\u00B9 after 6.0 s. How far does she travel?', { marks: 2 }));
  k.push(suvatBox());
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Two steps \u2014 find v first, then use it.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('6', 'A boat travelling at 5.0 m s\u207B\u00B9 accelerates at 2.0 m s\u207B\u00B2 for 8.0 s. Find its final velocity, then how far it travels.', { marks: 4 }));
  k.push(suvatBox());
  k.push(ruledBox(4));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('7', 'A train slows from 30 m s\u207B\u00B9 to 12 m s\u207B\u00B9 in 6.0 s. Find its acceleration and the distance it covers. Think carefully about the sign.', { marks: 4 }));
  k.push(suvatBox());
  k.push(ruledBox(4));

  k.push(q('8', 'A car starts from rest and travels 100 m in 8.0 s. Find its final velocity.', { marks: 3 }));
  k.push(suvatBox());
  k.push(ruledBox(4));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('9', 'A runner travels at 12 m s\u207B\u00B9 and is still doing 12 m s\u207B\u00B9 ten seconds later. Find the acceleration and the distance covered.', { marks: 3 }));
  k.push(suvatBox());
  k.push(ruledBox(3));

  k.push(q('10', 'A cyclist moving at 4.0 m s\u207B\u00B9 accelerates at 1.5 m s\u207B\u00B2 for 6.0 s. How far does he travel in that time?', { marks: 4 }));
  k.push(suvatBox());
  k.push(ruledBox(4));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Reason \u2014 these are not on the answer slide. We will take them out loud.',
    { size: 10, italic: true, color: C.alert, after: 60 }));

  k.push(q('11', 'Show how  s = \u00BD(u + v)t  comes from the area of a trapezium under a velocity\u2013time graph. Sketch the graph and label u, v and t.', { marks: 4 }));
  k.push(ruledBox(5));

  k.push(q('12', 'Show how  v = u + at  comes from the gradient of the same graph.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(q('13', ['A student calculates the distance in question 7 as ', t('30 \u00D7 6 = 180 m', { bold: true, size: 10.5 }),
                  t('. Explain what they have done and why their answer is too large.', { size: 10.5 })], { marks: 3 }));
  k.push(ruledBox(4));

  k.push(q('14', 'Rearrange  s = \u00BD(u + v)t  to make t the subject. Then use it: a car slows from 20 m s\u207B\u00B9 to 10 m s\u207B\u00B9 over 60 m. How long did it take?', { marks: 4 }));
  k.push(ruledBox(5));

  k.push(q('15', 'Both equations stop working in one situation. Say what it is, and sketch the velocity\u2013time graph of an object where you could not use them.', { marks: 4 }));
  k.push(ruledBox(5));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check a calculation you have already done, or to challenge your reasoning on the Gold questions. Do not ask it which equation to use \u2014 choosing is the skill being assessed.',
    { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F6FB' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = 'Equations of Motion worksheet.docx';
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

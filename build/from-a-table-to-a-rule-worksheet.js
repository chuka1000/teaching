/**
 * Y8 Maths, From A Table To A Rule, worksheet (8CN). The You Do. Per TEMPLATE.md, in each tier a fully worked
 * example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that
 * step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q13). Non-calculator. Only x and y.
 * The answers are printed UPSIDE DOWN on the last page (there is no Answers slide). The tables are read from
 * build/from-a-table-to-a-rule-answers.js, the same constants the answers use, so sheet and answers cannot
 * disagree; every rule is re-derived with sympy in build/from-a-table-to-a-rule-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed, table, cell } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, TableRow } = D;
const A = require('./from-a-table-to-a-rule-answers');
const { T, R, fmt } = A;

const LESSON = 'From A Table To A Rule';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y8 Maths  ·  Algebra, Lesson 6  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** An x / y table of values (a top-level table, so it survives Google Docs). */
function xy(tb) {
  const lw = 900, vw = 900;
  const row = (label, vals, fill) => new TableRow({ children: [
    cell(p(label, { size: 10.5, bold: true, after: 0, align: AlignmentType.CENTER, keepNext: true }), { w: lw, fill: C.headFill }),
    ...vals.map((v) => cell(p(String(v), { size: 10.5, after: 0, align: AlignmentType.CENTER, keepNext: true }), { w: vw, fill })),
  ] });
  return [table([row('x', tb.x), row('y', tb.y)], [lw, ...tb.x.map(() => vw)]), sp()];
}
const gap = () => p('', { after: 60 });
/** A thin paragraph between two tables. Without it Word and Google Docs MERGE adjacent tables into one. */
function sp() { return p('', { size: 4, after: 40, keepNext: true }); }

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F2F0F8' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 140 }));
  k.push(boxed(p('Find the multiplier, then the number added, and check with another pair.', { size: 12.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 8, fill: 'F2F0F8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can find the rule for a linear function from a table of values.', 'I can write the rule as a formula.', 'I can check a rule against a second pair of values.']));
  k.push(runs([t('Non-calculator. ', { bold: true, size: 10.5 }), t('Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. The input is x and the output is y.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Find the rule when x goes up by 1.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`y goes up by ${R.bw.yStep}, so the multiplier is ${R.bw.m}. ${R.bw.m} × 1 = ${R.bw.m}, but y is ${T.bw.y[0]}, so add ${R.bw.c}. ${fmt(R.bw)}.`, `Check with a pair you did not use, x = ${A.last(T.bw).x}: ${R.bw.m} × ${A.last(T.bw).x} + ${R.bw.c} = ${A.last(T.bw).y}. It fits.`]));
  k.push(...xy(T.bw));
  k.push(gap());
  k.push(q('1', `Half-worked. Find the rule. y goes up by ____, so the multiplier is ____. ____ × 1 = ____, but y is ${T.b1.y[0]}, so add ____. y = ____ . Check with x = ${A.last(T.b1).x}: ____ × ${A.last(T.b1).x} + ____ = ____ .`, { marks: 4 }));
  k.push(...xy(T.b1));
  k.push(ruledBox(1));
  k.push(q('2', 'A machine does × 5, then − 4. Write its rule as a formula, using y and x.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Find the rule as a formula. Then check it with a pair you did not use.', { marks: 4 }));
  k.push(...xy(T.b3));
  k.push(ruledBox(3));
  k.push(q('4', 'The rule is y = 5x + 2. Find y when x = 6.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('5', 'Does the rule y = 3x + 2 fit the pair x = 5, y = 17? Show your working.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Bigger steps in x, and checking.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`x goes up by ${R.sw.xStep} and y goes up by ${R.sw.yStep}. For each 1 in x, y goes up by ${R.sw.yStep} ÷ ${R.sw.xStep} = ${R.sw.m}. The multiplier is ${R.sw.m}.`, `${R.sw.m} × ${T.sw.x[0]} = ${R.sw.m * T.sw.x[0]}, but y is ${T.sw.y[0]}, so add ${R.sw.c}. ${fmt(R.sw)}. Check x = ${A.last(T.sw).x}: ${R.sw.m} × ${A.last(T.sw).x} + ${R.sw.c} = ${A.last(T.sw).y}. It fits.`]));
  k.push(...xy(T.sw));
  k.push(gap());
  k.push(q('6', 'Half-worked. Find the rule. y goes up by ____ when x goes up by ____, so by ____ for each 1. The multiplier is ____. ____ × 1 = ____, but y is 5, so add ____ . y = ____ .', { marks: 4 }));
  k.push(...xy(T.s6));
  k.push(ruledBox(1));
  k.push(q('7', 'Find the rule as a formula. Check it with the last pair.', { marks: 4 }));
  k.push(...xy(T.s7));
  k.push(ruledBox(3));
  k.push(q('8', 'Why does that step work? In the worked example y goes up by 4 when x goes up by 2. Why do we divide 4 by 2 to get the multiplier?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', `A student looks at the first pair only (x = 1, y = ${T.s9.y[0]}) and says the rule is y = ${A.STUDENT.m}x + ${A.STUDENT.c}. Check the student's rule with the second pair. Is it right? If not, find the correct rule.`, { marks: 4 }));
  k.push(...xy(T.s9));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Brackets, and past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['A machine adds 2, then multiplies by 3, so y = 3(x + 2). Expand it: the 3 multiplies EVERY term inside the bracket, so 3x + 6.', `The table for that machine is below. From the table: y goes up by ${R.gw.yStep}, so the multiplier is ${R.gw.m}; ${R.gw.m} × 1 = ${R.gw.m}, but y is ${T.gw.y[0]}, so add ${R.gw.c}. ${fmt(R.gw)}. It is the same rule as 3(x + 2).`]));
  k.push(...xy(T.gw));
  k.push(gap());
  k.push(q('10', 'Half-worked. A machine subtracts 1, then multiplies by 4, so y = 4(x − 1). Expand it: y = 4x − ____ . Complete the table for x = 1, 2 and 3. Then find the rule from your table, using the method from the lesson. Do the two rules agree?', { marks: 4 }));
  k.push(...xy({ x: T.g10.x, y: ['____', '____', '____'] }));
  k.push(ruledBox(3));
  k.push(q('11', 'This table has x going up by 2, and it does not start at 1. Find the rule as a formula. Check it with the last pair.', { marks: 4 }));
  k.push(...xy(T.g11));
  k.push(ruledBox(3));
  k.push(q('12', 'Show, using x = 1 and x = 2, that y = 2(x + 3) and y = 2x + 3 are different rules. Then expand 2(x + 3) to explain why.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('13', 'Where would you meet this idea outside the lesson? Describe a real situation where you pay a fixed amount plus an amount for each unit. Say what the multiplier is and what the fixed number is. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('14', `The rule is y = ${A.REV.m}x − ${-A.REV.c}. The output is y = ${A.REV.y}. Find x. Check your answer.`, { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished solution, especially Q9 and Q12. Do not ask it to solve a question you have not tried. Check anything it says against your notes.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F0F8' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./from-a-table-to-a-rule-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

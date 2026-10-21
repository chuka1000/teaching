/**
 * Y8 Maths, Expressions From Shapes And Prices, worksheet (8CN). The You Do. Per TEMPLATE.md, in each tier a fully
 * worked example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does
 * that step work?" prompt (Q12) and one "where would you meet this outside the lesson?" (Q18). Non-calculator.
 * The answers are printed UPSIDE DOWN on the last page (there is no Answers slide). Every shape, price, age and
 * table is read from build/shapes-and-prices-answers.js, the same constants the answers use, so sheet and answers
 * cannot disagree; build/shapes-and-prices-check.py re-derives every expression with sympy.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed, table, cell } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, TableRow, ImageRun } = D;
const A = require('./shapes-and-prices-answers');
const { SHAPES, COST, AGES, T, RULE } = A;

const LESSON = 'Expressions From Shapes And Prices';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const PICS = path.join(__dirname, '..', 'assets', 'worksheets', 'expressions');

const head = (right) => new Header({ children: [runs([t('Y8 Maths  ·  Algebra, Lesson 8  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** A shape picture, as an inline image (type: 'png' is required, CLAUDE.md "Things that will bite you", 3). */
function pic(name, alt, w = 230) {
  const data = fs.readFileSync(path.join(PICS, `${name}.png`));
  const h = Math.round(w * 340 / 520);
  return new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 0, after: 60 }, children: [new ImageRun({
    type: 'png', data, transformation: { width: w, height: h }, altText: { name: name, title: alt, description: alt },
  })] });
}

/** An x / y table of values (a top-level table, so it survives Google Docs). blank: hide the y values so the student fills them in. */
function xy(tb, blank = false) {
  const lw = 900, vw = 900;
  const row = (label, vals, fill) => new TableRow({ children: [
    cell(p(label, { size: 10.5, bold: true, after: 0, align: AlignmentType.CENTER, keepNext: true }), { w: lw, fill: C.headFill }),
    ...vals.map((v) => cell(p(String(v), { size: 10.5, after: 0, align: AlignmentType.CENTER, keepNext: true }), { w: vw, fill })),
  ] });
  return [table([row('x', tb.x), row('y', blank ? tb.y.map(() => '') : tb.y)], [lw, ...tb.x.map(() => vw)]), sp()];
}
const gap = () => p('', { after: 60 });
/** A thin paragraph between two tables. Without it Word and Google Docs MERGE adjacent tables into one. */
function sp() { return p('', { size: 4, after: 40, keepNext: true }); }
const sidesText = (sides) => sides.join(', ');

function worksheet(answers) {
  const k = [];
  /** A worked example. Its picture sits INSIDE the box, so the two can never be split across a page. */
  const box = (title, lines, picture) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 })), ...(picture ? [picture] : [])], { colour: C.rule, weight: 4, fill: 'F2F0F8' }), sp()];
  const sh = SHAPES;
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 140 }));
  k.push(boxed(p('Write it from the words. Simplify it. Check it with a number.', { size: 12.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 8, fill: 'F2F0F8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can write and simplify an expression for the perimeter of a shape.', 'I can write an expression for a total cost or a total age.', 'I can find the rule from a table, and say what the number added means.']));
  k.push(runs([t('Non-calculator. ', { bold: true, size: 10.5 }), t('Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. For a rule from a table the input is x and the output is y. Shapes are not drawn to scale.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Add up a perimeter, write a price and an age, and find a rule from a table.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A triangle has sides ${sidesText(sh.bw.sides.slice(0, 2))} and ${sh.bw.sides[2]}. Add the sides: (${sh.bw.sides[0]}) + (${sh.bw.sides[1]}) + ${sh.bw.sides[2]}.`,
    `x terms: x + x + 2x = 4x. Numbers: 1 + 1 = 2. Perimeter = ${sh.bw.ans}.`,
    `Check x = ${sh.bw.chk}: the sides are 4, 4 and 6, so 4 + 4 + 6 = ${A.sum(sh.bw.sides, sh.bw.chk)}, and 4 × ${sh.bw.chk} + 2 = ${A.at('4*x + 2', sh.bw.chk)}. It matches.`,
  ], pic('tri_bw', 'A triangle with sides x + 1, x + 1 and 2x')));
  k.push(q('1', `Half-worked. A rectangle has sides ${sh.b1.sides[0]} and ${sh.b1.sides[1]}. Perimeter = (${sh.b1.sides[0]}) + ${sh.b1.sides[1]} + (${sh.b1.sides[0]}) + ${sh.b1.sides[1]}. The x terms: ____ x. The numbers: ____ . Perimeter = ____ . Check with x = ${sh.b1.chk}: the sides are ____ and ____ , so the perimeter is ____ , and ____ × ${sh.b1.chk} + ____ = ____ .`, { marks: 4 }));
  k.push(pic('rect_b1', 'A rectangle with sides x + 2 and 3x'));
  k.push(ruledBox(1));
  k.push(q('2', `A square has side ${sh.b2.side}. Write its perimeter and simplify it. Check with x = ${sh.b2.chk}.`, { marks: 3 }));
  k.push(pic('sq_b2', 'A square with side 2x + 3'));
  k.push(ruledBox(2));
  k.push(q('3', `A bottle of juice costs x pence. Write an expression for the cost of 3 bottles and a 50p sandwich.`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('4', `Ravi is r years old. His sister is 3 years older. Write an expression for their total age.`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('5', 'A taxi charges a fixed £4, and then £2 for each km. Complete the table. Then find the rule as a formula, using y and x. What does the 4 stand for?', { marks: 4 }));
  k.push(...xy(T.b5, true));
  k.push(ruledBox(3));
  k.push(q('6', `A student says the perimeter of a rectangle with sides x + 2 and 3 is ${A.STUDENT.b6}. Find the mistake and give the correct perimeter.`, { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Bigger shapes, a bracket in a price, and a table that goes up in steps of 2.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A rectangle has sides ${sh.sw.sides[0]} and ${sh.sw.sides[1]}. There are two of each side, so the perimeter is 2(${sh.sw.sides[0]}) + 2(${sh.sw.sides[1]}) = 4x + 2 + 2x + 8 = ${sh.sw.ans}.`,
    `Check x = ${sh.sw.chk}: the sides are 5 and 6, so 5 + 6 + 5 + 6 = ${A.sum(sh.sw.sides, sh.sw.chk)}, and 6 × ${sh.sw.chk} + 10 = ${A.at('6*x + 10', sh.sw.chk)}. It matches.`,
  ], pic('rect_sw', 'A rectangle with sides 2x + 1 and x + 4')));
  k.push(q('7', `Half-worked. A triangle has sides ${sh.s7.sides[0]}, ${sh.s7.sides[1]} and ${sh.s7.sides[2]}. Perimeter = (${sh.s7.sides[0]}) + (${sh.s7.sides[1]}) + (${sh.s7.sides[2]}). The x terms: ____ x. The numbers: 2 − 1 + 5 = ____ . Perimeter = ____ . Check with x = ${sh.s7.chk}.`, { marks: 4 }));
  k.push(pic('tri_s7', 'A triangle with sides 3x + 2, x − 1 and 2x + 5'));
  k.push(ruledBox(2));
  k.push(q('8', `Write and simplify the perimeter of the pentagon. Check with x = ${sh.s8.chk}.`, { marks: 4 }));
  k.push(pic('pent_s8', 'A pentagon with sides x, x + 2, 2x − 1, x + 2 and 2x − 1'));
  k.push(ruledBox(3));
  k.push(q('9', 'A sandwich costs s pounds. A drink costs £2 less than a sandwich. Write an expression for the cost of 3 sandwiches and 2 drinks. Simplify it.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('10', 'Ana is a years old. Her sister is twice as old as Ana. Her mum is 25 years older than Ana. Write an expression for their total age. Simplify it.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('11', 'This table has x going up by 2. Find the rule as a formula. Then find the value of y when x = 0.', { marks: 4 }));
  k.push(...xy(T.s11));
  k.push(ruledBox(3));
  k.push(q('12', 'Why does that step work? The table x = 1, 2, 3 and y = 8, 10, 12 has the rule y = 2x + 6. A student says: "The 6 is the value of y when x is 0." Explain why that is true.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('13', `A student looks at the table below and says the rule is ${A.STUDENT.s13}. Check the student's rule with the second pair. Is it right? If not, find the correct rule.`, { marks: 4 }));
  k.push(...xy(T.s13));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Past the lesson: an L-shape, real prices, and working backwards.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A regular hexagon has six equal sides, each ${sh.gw.side}. Perimeter = 6(${sh.gw.side}) = ${sh.gw.ans}.`,
    `Check x = ${sh.gw.chk}: each side is 3, so 6 × 3 = 18, and 12 × ${sh.gw.chk} − 6 = ${A.at('12*x - 6', sh.gw.chk)}. It matches.`,
  ], pic('hex_gw', 'A regular hexagon with each side 2x − 1')));
  k.push(q('14', `Half-worked. An isosceles triangle has two sides of ${sh.g14.sides[0]} and a base of ${sh.g14.sides[2]}. Perimeter = 2(${sh.g14.sides[0]}) + (${sh.g14.sides[2]}) = 4x + ____ + x − 1 = ____ . Check with x = ${sh.g14.chk}.`, { marks: 4 }));
  k.push(pic('tri_g14', 'An isosceles triangle with two sides 2x + 3 and a base x − 1'));
  k.push(ruledBox(1));
  k.push(q('15', `(a) Write and simplify the perimeter of the L-shape. Check with x = ${sh.g15.chk}. (b) Find the perimeter of the rectangle ${A.L_BOX.sides[0]} by ${A.L_BOX.sides[1]} that surrounds it. What do you notice?`, { marks: 5 }));
  k.push(pic('L_g15', 'An L-shape with sides 3x + 2, x + 2, x, 2, 2x + 2 and x + 4'));
  k.push(ruledBox(4));
  k.push(q('16', 'A gym charges a £15 joining fee and £8 for each month. (a) Write an expression for the total cost after x months. (b) Complete the table for x = 1, 2 and 3, and find the rule from the table. Does it match your expression? (c) What does the 15 stand for?', { marks: 5 }));
  k.push(...xy(T.g16, true));
  k.push(ruledBox(4));
  k.push(q('17', 'Firm A charges a fixed £3 and £2 for each km. Firm B charges a fixed £5 and £1 for each km. (a) Write an expression for each firm. (b) Complete the tables for 1 to 4 km. (c) Which firm is cheaper for 1 km? For 4 km? At how many km do they cost the same?', { marks: 6 }));
  k.push(p('Firm A', { size: 10, bold: true, after: 20, keepNext: true }));
  k.push(...xy(T.g17a, true));
  k.push(p('Firm B', { size: 10, bold: true, after: 20, keepNext: true }));
  k.push(...xy(T.g17b, true));
  k.push(ruledBox(4));
  k.push(q('18', 'Where would you meet this idea outside the lesson? Describe a real situation with a fixed part and a part for each unit. Write the expression and say what the fixed number is. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('19', `The perimeter of a square is ${A.STUDENT.g19}. Write an expression for one side. Check with x = 1.`, { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Finished early? Play the Find The Rule game on Google Classroom. It is about tables, and it gets very hard.', { size: 10, after: 0 }), { colour: C.accent, weight: 6, fill: 'F2F0F8' }));
  k.push(sp());
  k.push(boxed(p('Gemini: ask it to check a finished solution, especially Q13 and Q15. Do not ask it to solve a question you have not tried. Check anything it says against your notes.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F0F8' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./shapes-and-prices-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

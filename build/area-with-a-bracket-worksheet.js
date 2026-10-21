/**
 * Y8 Maths, Area With A Bracket, worksheet (8CN). The You Do. Per TEMPLATE.md, in each tier a fully worked example,
 * a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?"
 * prompt (Q12) and one "where would you meet this outside the lesson?" (Q17). Non-calculator. The Period 2 FINISHER
 * (draw a shape with algebraic sides, swap with a partner, each writes and simplifies the other's perimeter) is on
 * the last page, above the answers. The answers are printed UPSIDE DOWN at the foot of the last page. Every
 * rectangle, bracket and table is read from build/area-with-a-bracket-answers.js, the same constants the answers
 * use; build/area-with-a-bracket-check.py re-derives every expression with sympy.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed, table, cell, blankBox } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, TableRow, ImageRun } = D;
const A = require('./area-with-a-bracket-answers');
const { AREA, BOTH, EXPAND, BEDS, S13, T } = A;

const LESSON = 'Area With A Bracket';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const PICS = path.join(__dirname, '..', 'assets', 'worksheets', 'expressions');

const head = (right) => new Header({ children: [runs([t('Y8 Maths  ·  Algebra, Lesson 9  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** A rectangle picture, as an inline image (type: 'png' is required, CLAUDE.md "Things that will bite you", 3). */
function pic(name, alt, w = 230) {
  const data = fs.readFileSync(path.join(PICS, `${name}.png`));
  const h = Math.round(w * data.readUInt32BE(20) / data.readUInt32BE(16));         // from the PNG header: height / width
  return new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 0, after: 60 }, children: [new ImageRun({
    type: 'png', data, transformation: { width: w, height: h }, altText: { name, title: alt, description: alt },
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
/** A thin paragraph between two tables. Without it Word and Google Docs MERGE adjacent tables into one. */
function sp() { return p('', { size: 4, after: 40, keepNext: true }); }

function worksheet(answers) {
  const k = [];
  /** A worked example. Its picture sits INSIDE the box, so the two can never be split across a page. */
  const box = (title, lines, picture) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 })), ...(picture ? [picture] : [])], { colour: C.rule, weight: 4, fill: 'F2F0F8' }), sp()];
  const ar = AREA;
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 140 }));
  k.push(boxed(p('Perimeter adds the sides. Area multiplies two of them. Check with a number.', { size: 12.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 8, fill: 'F2F0F8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can write the area of a rectangle with an algebraic side as a bracket.', 'I can expand the bracket to write the area as a simple expression.', 'I can tell the perimeter and the area apart, and write both.']));
  k.push(runs([t('Non-calculator. ', { bold: true, size: 10.5 }), t('Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. Areas are in cm² or m². Shapes are not drawn to scale.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Write an area as a bracket, expand it, and tell it from a perimeter.', { size: 10, italic: true, color: C.soft, after: 60, keepNext: true }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A rectangle is ${ar.bw.w} cm wide and (${ar.bw.len}) cm long. Area = width × length = ${ar.bw.w}(${ar.bw.len}).`,
    `Expand: 3 × x = 3x and 3 × 6 = 18, so ${ar.bw.w}(${ar.bw.len}) = ${ar.bw.ans} ${ar.bw.unit}.`,
    `Check x = ${ar.bw.chk}: the length is 8, so the area is 3 × 8 = ${A.at('3*(x + 6)', ar.bw.chk)}, and 3 × ${ar.bw.chk} + 18 = ${A.at('3*x + 18', ar.bw.chk)}. It matches.`,
  ], pic('rt_bw', 'A rectangle 3 wide and x + 6 long')));
  k.push(q('1', `Half-worked. A rectangle is ${ar.b1.w} cm wide and (${ar.b1.len}) cm long. Area = ${ar.b1.w}(x + ____ ) = 2x + ____ cm². Check x = ${ar.b1.chk}: the length is ____ , so the area is 2 × ____ = ____ , and 2 × ${ar.b1.chk} + ____ = ____ .`, { marks: 4 }));
  k.push(pic('rt_b1', 'A rectangle 2 wide and x + 7 long'));
  k.push(ruledBox(1));
  k.push(q('2', `Expand ${EXPAND.b2.expr}.`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('3', `A rectangle is ${ar.b3.w} m by (${ar.b3.len}) m. Write its area as a bracket, then expand it. Check with x = ${ar.b3.chk}.`, { marks: 3 }));
  k.push(pic('rt_b3', 'A rectangle 5 by x + 1'));
  k.push(ruledBox(2));
  k.push(q('4', `A rectangle has sides ${BOTH.b4.a} and ${BOTH.b4.b}. (a) Write its perimeter and simplify it. (b) Write its area and expand it. Check both with x = ${BOTH.b4.chk}.`, { marks: 5 }));
  k.push(pic('rt_b4', 'A rectangle with sides 3 and x + 4'));
  k.push(ruledBox(4));
  k.push(q('5', 'A rectangle is 2 cm by (x + 3) cm. Complete the table of its area for x = 1, 2 and 3. Then find the rule from the table. What do you notice about your rule and 2(x + 3)?', { marks: 4 }));
  k.push(pic('rt_b5', 'A rectangle 2 by x + 3'));
  k.push(...xy(T.b5, true));
  k.push(ruledBox(3));
  k.push(q('6', `A student says ${EXPAND.b6.expr} = ${EXPAND.b6.wrong}. Find the mistake and give the correct answer.`, { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('A minus inside the bracket, a perimeter and an area, and a table that goes up in 2s.', { size: 10, italic: true, color: C.soft, after: 60, keepNext: true }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A path is ${ar.sw.w} m by (${ar.sw.len}) m. Area = ${ar.sw.w}(${ar.sw.len}).`,
    `Expand: 5 × x = 5x and 5 × (−3) = −15, so ${ar.sw.w}(${ar.sw.len}) = ${ar.sw.ans} ${ar.sw.unit}.`,
    `Check x = ${ar.sw.chk}: the width is 3, so the area is 5 × 3 = ${A.at('5*(x - 3)', ar.sw.chk)}, and 5 × ${ar.sw.chk} − 15 = ${A.at('5*x - 15', ar.sw.chk)}. It matches.`,
  ], pic('rt_sw', 'A rectangle 5 by x − 3')));
  k.push(q('7', `Half-worked. A poster is ${ar.s7.w} cm by (${ar.s7.len}) cm. Area = ${ar.s7.w}(${ar.s7.len}) = 4x − ____ cm². Check x = ${ar.s7.chk}: the width is ____ , so the area is 4 × ____ = ____ , and 4 × ${ar.s7.chk} − ____ = ____ .`, { marks: 4 }));
  k.push(pic('rt_s7', 'A rectangle 4 by x − 2'));
  k.push(ruledBox(1));
  k.push(q('8', `Expand ${EXPAND.s8a.expr} and ${EXPAND.s8b.expr}.`, { marks: 4 }));
  k.push(ruledBox(2));
  k.push(q('9', `A rectangle has sides ${BOTH.s9.a} and ${BOTH.s9.b}. (a) Write its perimeter and simplify it. (b) Write its area and expand it. Check both with x = ${BOTH.s9.chk}.`, { marks: 5 }));
  k.push(pic('rt_s9', 'A rectangle with sides 4 and 2x − 1'));
  k.push(ruledBox(4));
  k.push(q('10', `Two garden beds sit side by side. Both are 3 m wide. Bed A is (x + 2) m long and Bed B is (x + 5) m long. Write an expression for the total area, then expand and simplify it. Check with x = ${BEDS.chk}.`, { marks: 4 }));
  k.push(pic('beds_s10', 'Two beds side by side, 3 m wide, x + 2 and x + 5 long'));
  k.push(ruledBox(3));
  k.push(q('11', 'A rectangle is 4 cm by (x + 1) cm. The table shows its area. x goes up by 2. Find the rule from the table. What do you notice about your rule and 4(x + 1)?', { marks: 4 }));
  k.push(pic('rt_s11', 'A rectangle 4 by x + 1'));
  k.push(...xy(T.s11));
  k.push(ruledBox(3));
  k.push(q('12', 'Why does that step work? The rectangle below is 4 high and (x + 5) long, split into two pieces. Explain why the 4 has to multiply the 5 as well as the x.', { marks: 2 }));
  k.push(pic('split_s12', 'A rectangle 4 high, split into a piece x long and a piece 5 long'));
  k.push(ruledBox(3));
  k.push(q('13', `A student says the area of a rectangle with sides 3 and x + 4 is ${S13.student}. Which has the student found, the perimeter or the area? Find the real area.`, { marks: 3 }));
  k.push(pic('rt_s13', 'A rectangle with sides 3 and x + 4'));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('A letter outside the bracket, a rule written as a bracket, and working back from an area.', { size: 10, italic: true, color: C.soft, after: 60, keepNext: true }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
    `A rectangle is x m by (${ar.gw.len}) m. Area = x(${ar.gw.len}).`,
    `Expand: x × x = x² and x × 4 = 4x, so x(${ar.gw.len}) = ${ar.gw.ans} ${ar.gw.unit}.`,
    `Check x = ${ar.gw.chk}: the length is 7, so the area is 3 × 7 = ${A.at('x*(x + 4)', ar.gw.chk)}, and 3² + 4 × 3 = 9 + 12 = ${A.at('x**2 + 4*x', ar.gw.chk)}. It matches.`,
  ], pic('rt_gw', 'A rectangle x by x + 4')));
  k.push(q('14', `Half-worked. A rectangle is x m by (${ar.g14.len}) m. Area = x(${ar.g14.len}) = x² + ____ x m². Check x = ${ar.g14.chk}: the length is ____ , so the area is 2 × ____ = ____ , and 2² + 7 × 2 = ____ .`, { marks: 4 }));
  k.push(pic('rt_g14', 'A rectangle x by x + 7'));
  k.push(ruledBox(1));
  k.push(q('15', `A rectangle is 2x cm by (3x − 1) cm. Write its area and expand it. Check with x = ${EXPAND.g15.chk}.`, { marks: 3 }));
  k.push(pic('rt_g15', 'A rectangle 2x by 3x − 1'));
  k.push(ruledBox(3));
  k.push(q('16', 'The table gives the area of a rectangle that is 6 cm wide. Find the rule from the table. Then write your rule as 6( ... ) to find the length of the rectangle.', { marks: 5 }));
  k.push(...xy(T.g16));
  k.push(ruledBox(4));
  k.push(q('17', 'Where would you meet this idea outside the lesson? Describe a real situation where an area has a side that is a total, such as a floor, a wall or a garden. Say what x stands for and why the length needs a bracket. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('18', `A rectangle has sides ${BOTH.g18.a} and ${BOTH.g18.b}. Write its perimeter and simplify it. Write its area and expand it. Check both with x = ${BOTH.g18.chk}.`, { marks: 5 }));
  k.push(pic('rt_g18', 'A rectangle with sides x and x + 5'));
  k.push(ruledBox(4));
  k.push(q('19', `The area of a rectangle is ${A.REVERSE.area} and its width is ${A.REVERSE.w}. Write an expression for its length. Check by expanding.`, { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- THE FINISHER ---- */
  k.push(p('', { after: 60 }));
  k.push(boxed([
    p('FINISHER. Finished early? Do this.', { size: 10.5, bold: true, color: C.dark, after: 40 }),
    p('Draw a shape in the box with algebraic sides. Give every side a length like x + 2 or 3x − 1. Swap with a partner. Each of you writes and simplifies the other\'s perimeter. Check your partner\'s answer by putting x = 3 in. Gold: if your shape is a rectangle, write its area too.', { size: 10, after: 0 }),
  ], { colour: C.accent, weight: 6, fill: 'F2F0F8' }));
  k.push(sp());
  k.push(blankBox(3000));
  k.push(sp());
  k.push(boxed(p('Finished early? The Find The Rule game is on Google Classroom. It is about tables, and it gets very hard.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F0F8' }));
  k.push(sp());
  k.push(boxed(p('Gemini: ask it to check a finished solution, especially Q12 and Q13. Do not ask it to solve a question you have not tried. Check anything it says against your notes.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F0F8' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./area-with-a-bracket-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

/**
 * Y8 Algebra L3 worksheet, built to the shape of the Lesson 2 sheet Chuka
 * wrote himself: four tiers (Bronze / Silver / Gold / Stretch), marks on every
 * question, success criteria with START and END RAG, and question TYPES that
 * go well beyond "expand this one too" — reverse-engineering, verification by
 * substitution, counterexamples, and generalisation.
 */
const fs = require('fs');
const path = require('path');
const DP = require('/home/claude/build/lib/docparts');
const { D, C, FONT, PAGE_W, p, runs, t, h1, h2, tier, cell, table, ruledBox, q,
        line, none, boxed } = DP;
const { Document, Packer, Paragraph, TextRun, TableRow, PageBreak, AlignmentType,
        HeightRule, VerticalAlign, Header, Footer, PageNumber } = D;

DP.useDocPalette('prasae');
Object.assign(C, {
  dark: '2B2350', accent: 'B9531F', support: '1F6FB2', alert: 'C0392B',
  ink: '221C3C', soft: '5E5A70', rule: 'CFCADF', tint: 'F2F0F8', headFill: 'E7E3F2',
  bronze: 'A8632F', silver: '6C7680', gold: '9A6B00',
});

const OUT = __dirname;
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y8 Maths  \u00b7  Algebra, Lesson 3  \u00b7  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** Success criteria grid with START / END RAG and a tier column. */
function criteria(rows) {
  const W1 = 6179, W2 = 1500, W3 = 1500, W4 = 800;
  const rag = (txt) => p(txt, { size: 8.5, bold: true, after: 0, align: AlignmentType.CENTER, color: C.soft });
  const out = [new TableRow({ tableHeader: true, children: [
    cell(p('Success criteria', { bold: true, size: 9.5, after: 0, color: C.dark }), { w: W1, fill: C.headFill }),
    cell(rag('START'), { w: W2, fill: C.headFill }),
    cell(rag('END'), { w: W3, fill: C.headFill }),
    cell(rag('Tier'), { w: W4, fill: C.headFill }),
  ] })];
  rows.forEach(([text, tr]) => out.push(new TableRow({
    cantSplit: true,
    height: { value: 420, rule: HeightRule.ATLEAST },
    children: [
      cell(p(text, { size: 9.5, after: 0 }), { w: W1, valign: VerticalAlign.CENTER }),
      cell(rag('R   A   G'), { w: W2, valign: VerticalAlign.CENTER }),
      cell(rag('R   A   G'), { w: W3, valign: VerticalAlign.CENTER }),
      cell(p(tr, { size: 9, bold: true, after: 0, align: AlignmentType.CENTER, color: C.accent }),
           { w: W4, valign: VerticalAlign.CENTER }),
    ],
  })));
  return table(out, [W1, W2, W3, W4]);
}

/** A numbered question with its mark allocation and working space. */
function Q(n, text, marks, lines) {
  const out = [];
  out.push(runs([
    t(`${n})  `, { bold: true, size: 11, color: C.accent }),
    ...(Array.isArray(text) ? text : [t(text, { size: 11 })]),
    t(`  [${marks}]`, { size: 9, bold: true, color: C.soft }),
  ], { before: 140, after: 70, keepNext: true }));
  out.push(ruledBox(lines));
  return out;
}
const M_ = (s) => t(s, { size: 11.5, bold: true, color: C.dark });   // maths, inline
const I_ = (s) => t(s, { size: 11, italic: true });

/* =================================================================== *
 * WORKSHEET
 * =================================================================== */
function worksheet() {
  const k = [];
  k.push(h1('Expand and simplify'));
  k.push(p('Challenge worksheet \u2014 execute, reverse-engineer, check, generalise.',
    { size: 10.5, italic: true, color: C.soft, after: 180 }));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(34), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(criteria([
    ['I can expand a bracket and then collect the like terms.', 'B'],
    ['I can expand two brackets that are added together.', 'S'],
    ['I can subtract a bracket without losing a sign.', 'S'],
    ['I can work backwards to find a missing number in the question.', 'S'],
    ['I can test whether two expressions are equivalent, and say why one value is not enough.', 'G'],
  ]));

  k.push(runs([
    t('Non-calculator. ', { bold: true, size: 10.5 }),
    t('Expand first, then collect \u2014 show both steps. Write enough working that someone else could follow it. You do NOT need to finish every tier.', { size: 10.5 }),
  ], { before: 180, after: 40 }));

  /* ---------------- BRONZE ---------------- */
  k.push(tier('BRONZE'));
  k.push(p('Fluency \u2014 one bracket, one loose term, and the signs that come with them.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  [
    ['1', 'Expand and simplify:  3(x + 4) + 2x', 2, 2],
    ['2', 'Expand and simplify:  5(a + 2) + 3a', 2, 2],
    ['3', 'Expand and simplify:  4(y + 3) \u2212 y', 2, 2],
    ['4', 'Expand and simplify:  2(m \u2212 5) + 7m', 2, 2],
    ['5', 'Expand and simplify:  6(2p + 1) \u2212 3p', 2, 2],
    ['6', 'Expand and simplify:  4(k + 3) \u2212 9', 2, 2],
    ['7', 'Expand and simplify:  \u22122(t + 4) + 5t', 3, 2],
  ].forEach(([n, txt, marks, lines]) => k.push(...Q(n, txt, marks, lines)));

  k.push(...Q('8', ['Which is correct?  ', M_('3(x + 2) + 4x = 7x + 2'), t('  OR  ', { size: 11 }),
                    M_('7x + 6'), t('  Explain why the other one is wrong.', { size: 11 })], 3, 3));

  /* ---------------- SILVER ---------------- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('SILVER'));
  k.push(p('Two brackets, working backwards, and checking your own answer.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  [
    ['9', 'Expand and simplify:  2(x + 3) + 3(x + 1)', 3, 2],
    ['10', 'Expand and simplify:  5(a + 4) \u2212 2(a + 1)', 3, 2],
    ['11', 'Expand and simplify:  4(2y \u2212 1) \u2212 3(y \u2212 2)', 4, 3],
    ['12', 'Expand and simplify:  \u00bd(6m + 8) + 2(m \u2212 1)', 4, 3],
  ].forEach(([n, txt, marks, lines]) => k.push(...Q(n, txt, marks, lines)));

  k.push(...Q('13', ['Complete:  ', M_('3(x + 5) + 2x  =  5x + ____')], 2, 2));
  k.push(...Q('14', ['Find the missing multiplier:  ', M_('____(y + 2) + 3y  =  7y + 8')], 3, 3));
  k.push(...Q('15', ['Find the missing number:  ', M_('6(a \u2212 ____) \u2212 2a  =  4a \u2212 18')], 3, 3));
  k.push(...Q('16', ['Expand and simplify  ', M_('4(x + 3) \u2212 (x + 5)'),
                     t('. There is no number in front of the second bracket \u2014 explain what number is really there.', { size: 11 })], 4, 3));
  k.push(...Q('17', ['Expand and simplify  ', M_('3(y \u2212 2) + 2(y + 4)'),
                     t('. Then substitute  y = 5  into BOTH the original and your answer, and show they agree.', { size: 11 })], 4, 4));
  k.push(...Q('18', ['A student writes:  ', M_('5(a + 2) \u2212 3(a + 1) = 2a + 7'),
                     t('. Check their working. Is it right? Show how you know.', { size: 11 })], 4, 3));

  /* ---------------- GOLD ---------------- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Equivalence, counterexamples, structure and proof.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(...Q('19', ['The simplified answer is  ', M_('7x + 12'),
                     t('. Write a question of the form  a(x + b) + cx  that gives it. Explain how you chose your numbers.', { size: 11 })], 4, 4));
  k.push(...Q('20', ['Ben says: ', I_('"4(x + 1) \u2212 2(x + 3) simplifies to 2x + 10, because 4 \u2212 2 = 2 and 4 + 6 = 10."'),
                     t(' Find the real answer and explain exactly which step of his reasoning fails.', { size: 11 })], 5, 4));
  k.push(...Q('21', ['Maya checks that  ', M_('3(x + 2) + x'), t('  and  ', { size: 11 }), M_('4x + 6'),
                     t('  are equal when  x = 0, and concludes they are equivalent. Her conclusion is right but her reasoning is not enough. Explain why.', { size: 11 })], 4, 4));
  k.push(...Q('22', ['Find  ', M_('c'), t('  and  ', { size: 11 }), M_('d'), t('  if  ', { size: 11 }),
                     M_('c(x + d) \u2212 2x = 3x + 20'), t('. Explain how comparing the x terms tells you c first.', { size: 11 })], 5, 4));
  k.push(...Q('23', ['Show that  ', M_('n(x + 3) \u2212 3n'), t('  simplifies to  ', { size: 11 }), M_('nx'),
                     t('  for every value of n. What does that mean about the original expression?', { size: 11 })], 5, 4));
  k.push(...Q('24', ['Write an expression of the form  ', M_('a(x + b) \u2212 c(x + d)'),
                     t('  that simplifies to just  ', { size: 11 }), M_('12'),
                     t('  \u2014 with no x term at all. Explain what must be true of a and c.', { size: 11 })], 5, 4));

  /* ---------------- STRETCH ---------------- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(h2('Stretch'));
  k.push(p('These are deliberately nastier. Try them only after Gold.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(...Q('25', ['Can  ', M_('5(x + 2) + 3x'), t('  and  ', { size: 11 }), M_('8x + 12'),
                     t('  ever give the same value? Answer without trying random numbers.', { size: 11 })], 4, 4));
  k.push(...Q('26', ['A student simplifies  ', M_('2(x + 6) \u2212 (x + 4)'), t('  to  ', { size: 11 }), M_('x + 16'),
                     t('. Find the value of x for which they are accidentally correct, then explain why one matching value proves nothing.', { size: 11 })], 5, 4));
  k.push(...Q('27', ['Expand and simplify  ', M_('x(x + 3) + 2(x + 3)'),
                     t('. You will meet this shape again in Year 9 \u2014 what do you notice about the two brackets?', { size: 11 })], 5, 4));
  k.push(...Q('28', ['Find all pairs of positive whole numbers  ', M_('a'), t('  and  ', { size: 11 }), M_('b'),
                     t('  for which  ', { size: 11 }), M_('a(x + b) \u2212 2(x + 3) = 4x + 6'), t('.', { size: 11 })], 5, 5));

  /* ---------------- Gemini ---------------- */
  k.push(p('', { after: 200 }));
  k.push(boxed(p('Gemini: ask it to challenge your reasoning or check a completed solution. Do not ask it to solve an unanswered question. Check anything it says against your notes \u2014 it is careless with minus signs.',
    { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F6F5FA' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

/* =================================================================== *
 * ANSWERS
 * =================================================================== */
function answers() {
  const k = [];
  k.push(h1('Answers \u2014 teacher copy'));
  k.push(p('Y8 Maths \u00b7 Expand and simplify. Every answer checked symbolically. The right-hand column is the one worth reading before you teach it.',
    { size: 10, italic: true, color: C.soft, after: 180 }));

  k.push(h2('Bronze and Silver \u2014 short answers'));
  const SHORT = [
    ['1', '5x + 12'], ['2', '8a + 10'], ['3', '3y + 12'], ['4', '9m \u2212 10'],
    ['5', '9p + 6'], ['6', '4k + 3'], ['7', '3t \u2212 8'],
    ['9', '5x + 9'], ['10', '3a + 18'], ['11', '5y + 2'], ['12', '5m + 2'],
    ['13', '15'], ['14', '4'], ['15', '3'], ['16', '3x + 7'],
    ['17', '5y + 2'], ['18', '2a + 7 is wrong; 2a + 5'],
  ];
  const cols = 4, cw = Math.floor(PAGE_W / cols);
  const rows = [];
  for (let r = 0; r < SHORT.length; r += cols) {
    rows.push(new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: SHORT.slice(r, r + cols).map(([n, a]) => cell(
        runs([t(`${n})  `, { bold: true, size: 10, color: C.accent }),
              t(a, { bold: true, size: 11, color: C.dark })], { after: 0 }),
        { w: cw, valign: VerticalAlign.CENTER })),
    }));
  }
  k.push(table(rows, Array(cols).fill(cw)));

  k.push(p('', { after: 140 }));
  k.push(boxed(p('Q11 is the one to check while marking: 8y \u2212 4 \u2212 3y + 6 = 5y + 2. The \u22123 \u00d7 \u22122 gives +6, so the number goes UP. Expect 5y \u2212 10. Q12 needs \u00bd of 6m and \u00bd of 8 before anything else. Q16 has an invisible 1 in front of the second bracket \u2014 that question exists entirely for that.',
    { size: 10, after: 0 }), { colour: C.alert, fill: 'FBEEEC' }));

  k.push(p('', { after: 200 }));
  k.push(h2('Written answers'));

  const W1 = 700, W2 = 4300, W3 = 4979;
  const arows = [new TableRow({ tableHeader: true, children: [
    cell(p('Q', { bold: true, size: 9.5, after: 0, color: C.dark }), { w: W1, fill: C.headFill }),
    cell(p('Answer', { bold: true, size: 9.5, after: 0, color: C.dark }), { w: W2, fill: C.headFill }),
    cell(p('Marking, and what to watch for', { bold: true, size: 9.5, after: 0, color: C.dark }), { w: W3, fill: C.headFill }),
  ] })];
  const add = (code, a, n) => arows.push(new TableRow({ cantSplit: true, children: [
    cell(p(code, { bold: true, size: 9.5, after: 0, color: C.dark }), { w: W1, valign: VerticalAlign.TOP }),
    cell(a, { w: W2, valign: VerticalAlign.TOP }),
    cell(n, { w: W3, valign: VerticalAlign.TOP }),
  ] }));
  const A = (s) => p(s, { size: 9.5, after: 40, line: 230 });
  const N = (s) => p(s, { size: 9.5, after: 40, line: 230 });
  const X = (s) => runs([t('\u2717 ', { color: C.alert, bold: true, size: 9.5 }), t(s, { size: 9.5, color: C.ink })], { after: 40, line: 230 });

  add('8', [A('7x + 6 is correct. The other answer never multiplied the 2 by the 3.')],
      [N('3 marks: picks 7x + 6 (1); says the 3 must multiply both terms (1); names what the wrong answer did (1).'),
       X('"Because 7x + 6 is the right answer." Circular. Ask what the other student DID.')]);
  add('13', [A('15.  3x + 15 + 2x = 5x + 15.')],
      [N('2 marks. Some will answer 5 by looking only at the bracket.')]);
  add('14', [A('4.  4(y + 2) + 3y = 4y + 8 + 3y = 7y + 8.')],
      [N('3 marks: uses the 8 to find the multiplier (1); checks it against the y terms (1); states 4 (1).'),
       N('THE GOOD METHOD is to use the constant: the only source of the 8 is multiplier \u00d7 2. Then check 4 + 3 = 7. Point this out \u2014 it is the key to Q22.')]);
  add('15', [A('3.  6(a \u2212 3) \u2212 2a = 6a \u2212 18 \u2212 2a = 4a \u2212 18.')],
      [N('3 marks.'),
       X('Answering \u22123. The bracket already has a minus in it, so the missing number is positive.')]);
  add('16', [A('4x + 12 \u2212 x \u2212 5 = 3x + 7.'),
             A('The invisible number is 1. A bracket with nothing in front of it is multiplied by 1, so \u2212(x + 5) means \u22121(x + 5).')],
      [N('4 marks: expands the first bracket (1); treats the second as \u22121 \u00d7 (1); correct answer (1); explains the invisible 1 (1).'),
       N('THIS IS THE MOST IMPORTANT QUESTION ON THE SHEET. It is the commonest lost mark in the whole topic at GCSE.'),
       X('3x + 17, from subtracting only the x.')]);
  add('17', [A('3y \u2212 6 + 2y + 8 = 5y + 2.'),
             A('Check at y = 5: original 3(3) + 2(9) = 9 + 18 = 27. Answer 25 + 2 = 27. They agree.')],
      [N('4 marks: 2 for the simplification, 2 for a substitution that is actually carried out on BOTH.'),
       N('Insist they evaluate both sides. Writing "they agree" without the arithmetic gets one mark.')]);
  add('18', [A('They are RIGHT. 5a + 10 \u2212 3a \u2212 3 = 2a + 7.'),
             A('Full marks need the working shown, not just "yes".')],
      [N('THE ANSWER IS CORRECT and the question is built on that. Every other check-the-student question on this sheet has an error in it, so most of the class will hunt for one and invent it.'),
       N('THIS IS DELIBERATE and it is the best question in Silver. A student who checks properly and says "they are right" has done better work than one who invents an error to please you. Give full marks for that, and say so out loud.'),
       X('Inventing a mistake because the question implied there was one. That is the habit this question exists to break.')]);

  add('19', [A('Any a, b, c with a + c = 7 and ab = 12. For example 3(x + 4) + 4x, or 1(x + 12) + 6x, or 6(x + 2) + x.')],
      [N('4 marks: a working example (2); an explanation that separates the x terms from the constant (2).'),
       N('The strongest answers say the constant comes only from a \u00d7 b, so pick a factor pair of 12 first, then make the x terms add to 7.')]);
  add('20', [A('Real answer: 4x + 4 \u2212 2x \u2212 6 = 2x \u2212 2.'),
             A('His x term is right by luck. His constant is wrong: \u22122 \u00d7 3 is \u22126, not +6, so it is 4 \u2212 6 = \u22122, not 4 + 6.')],
      [N('5 marks: correct answer (2); identifies that the x term happens to be right (1); names the sign error on the constant (1); clear (1).'),
       N('Ben\u2019s method LOOKS like a shortcut and gives the right first term, which is exactly why it is dangerous.')]);
  add('21', [A('3x + 6 + x = 4x + 6, so they are equivalent \u2014 but testing x = 0 does not show that.'),
             A('Two different expressions can agree at one value and differ everywhere else. One test point proves nothing; you have to expand and compare, or test enough values to pin down every coefficient.')],
      [N('4 marks: confirms they are equivalent by expanding (1); says one value is not enough (1); explains why, ideally with a counterexample of her method (1); clear (1).'),
       N('x = 0 is the worst possible test value, because it hides every x term. Worth saying.')]);
  add('22', [A('c = 5 and d = 4.'),
             A('The x terms give cx \u2212 2x = 3x, so c = 5. Then the constant gives cd = 20, so d = 4.')],
      [N('5 marks: c = 5 with reasoning (2); d = 4 (2); explains why c must come first (1).'),
       N('c FIRST because the constant term depends on both c and d, while the x term depends only on c. That is the transferable idea.')]);
  add('23', [A('nx + 3n \u2212 3n = nx. The 3n terms cancel for any n.'),
             A('It means the expression was really just nx all along, however it was written.')],
      [N('5 marks: expands with n as a letter (2); shows the constants cancel (1); says it holds for every n (1); interprets it (1).'),
       N('THIS IS THE FIRST TIME they multiply out with a letter as the multiplier. A big step, and a good one.')]);
  add('24', [A('Any a = c with ab \u2212 cd = 12. For example 5(x + 4) \u2212 5(x + 1.6), or more neatly 4(x + 5) \u2212 4(x + 2).'),
             A('a and c must be equal, so the x terms cancel.')],
      [N('5 marks: a valid example (3); states a = c and explains why (2).'),
       N('Accept any correct pair. 4(x + 5) \u2212 4(x + 2) gives 4x + 20 \u2212 4x \u2212 8 = 12.')]);

  add('25', [A('5x + 10 + 3x = 8x + 10. So the two expressions differ by 2, always.'),
             A('They can never be equal, because 8x + 10 = 8x + 12 would mean 10 = 12.')],
      [N('4 marks: simplifies the first (2); compares constants (1); concludes never, with a reason (1).'),
       X('Trying values and saying "it never worked". The question rules that out on purpose.')]);
  add('26', [A('2x + 12 \u2212 x \u2212 4 = x + 8. They wrote x + 16.'),
             A('x + 8 = x + 16 has no solution \u2014 so there is NO value of x that makes them agree.')],
      [N('5 marks, and the twist is the point: the student is never accidentally correct, because the x terms match and the constants do not.'),
       N('A STUDENT WHO SPOTS THAT has understood something real. Expect several to hunt for a value and give up; ask them what they concluded from failing to find one.'),
       X('Guessing a value and claiming it works. Make them substitute it.')]);
  add('27', [A('x\u00b2 + 3x + 2x + 6 = x\u00b2 + 5x + 6.'),
             A('Both brackets are (x + 3). The expression is really (x + 3) multiplied by (x + 2).')],
      [N('5 marks: correct expansion including x\u00b2 (3); notices the repeated bracket (2).'),
       N('THIS IS FACTORISING AND DOUBLE BRACKETS arriving a year early. Do not teach it \u2014 just let whoever notices feel clever.')]);
  add('28', [A('a(x + b) \u2212 2(x + 3) = ax + ab \u2212 2x \u2212 6 = 4x + 6.'),
             A('x terms: a \u2212 2 = 4, so a = 6. Constants: 6b \u2212 6 = 6, so b = 2.'),
             A('The only pair is a = 6, b = 2.')],
      [N('5 marks: sets up both comparisons (2); a = 6 (1); b = 2 (1); states it is the only pair (1).'),
       N('"Find ALL pairs" is doing work: the answer is that there is exactly one, and saying so is part of the answer.')]);

  k.push(table(arows, [W1, W2, W3]));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Teacher copy') }, footers: { default: foot() }, children: k }],
  });
}

const jobs = [
  ['Expand and Simplify worksheet.docx', worksheet()],
  ['Expand and Simplify answers.docx', answers()],
];
(async () => {
  for (const [name, doc] of jobs) {
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
  }
})();

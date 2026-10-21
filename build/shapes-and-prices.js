/**
 * Y8 Maths, Algebra, Lesson 8: Expressions From Shapes And Prices. Class 8CN. Single, 50 minutes. PART 1 OF 2.
 * Maths track: 10 x 5.625 canvas, Number Revision palette. Shared furniture: build/expressions-kit.js.
 *
 * DATE: Tuesday 20 October 2026, the lesson date in the brief ("today"). CHANGE IT if the lesson moves.
 *
 * PREVIOUS, per the brief: the attached deck, now reference/Brackets and Beyond.pptx (Lesson 7). Read in full. A
 * 95-minute double, taught Monday 19 October: Do Now 8, then expand a bracket (area model), expand and simplify
 * (two brackets), Spot The Mistake, Cold Call, worksheet part 1 (16 min), Mark, a 5-minute break, a 4-minute
 * retrieval, subtract a bracket (numbers first, then letters), Rank And Conquer, the Spot The Error game, worksheet
 * part 2, Mark and a Plenary. Vocabulary it fixed: "Expand first. Collect second.", "the number outside multiplies
 * EVERY term inside", "a minus before a bracket changes every sign inside". Its closing line promised nothing (the
 * next lesson was not known). Its We Do modes were Spot The Mistake and Rank And Conquer, and Lesson 6 (From A Table
 * To A Rule) used Finish It Off, so TODAY IS FINISH IT OFF. Its notes name the two things the class found hard:
 * the outside number reaching only the first term, and signs after the exam.
 *
 * THEY FOUND HARD (brief): going from x = 1, 2, 3 and y = 8, 10, 12 to y = 2x + 6. That is Lesson 6's skill, and the
 * class has not kept it. It is BAKED IN here rather than taught again from the top: Do Now Q3 retrieves it, Do Now Q6
 * previews it as a TAXI (what would 0 km cost?), the We Do settles that taxi with a NEW route (go back one step to
 * x = 0: the number added is what y is when x is 0, the fixed charge), Cold Call Q4, the worksheet in every tier, and
 * the Plenary. The standalone Find The Rule game is the big practice (Chuka chose "standalone": homework, early
 * finishers, a spare 15 minutes).
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6,
 * You Do 14, Mark 3, Plenary 3. Objective 1 (perimeter, both routes) is I Do 1; objective 2 (a total cost, a total age)
 * is I Do 2; objective 3 (the rule from a table, and what the number added means) is the We Do's third row, the
 * Do Now, the Cold Call and the worksheet. The area with a bracket (the brief's third objective) is Lesson 9.
 *
 * Every number is checked in build/shapes-and-prices-check.py (sympy), which also reads the deck back.
 */
const K = require('./expressions-kit')({
  lesson: 'Expressions From Shapes And Prices',
  date: 'Tuesday 20 October 2026',
  subject: 'Y8 Maths · Algebra · Lesson 8 · 8CN',
});
const { S, C, F, M, RIGHT, CW, H, newSlide, pill, title, subtitle, card, banner, expr, worked, qGrid, video, N, L, V, SOFTT, G } = K;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = newSlide(10);
  K.doNowHead(s);
  qGrid(s, { p: 'd', y0: 1.02, ch: 1.38, gap: 0.13, qh: 0.72, size: 13, asize: 11.5, preview: 5, qs: [
    ['Expand and simplify 2(x + 6) − 3(x − 1).', '2x + 12 − 3x + 3 = −x + 15'],
    ['A student writes 8 − (x + 3) = 8 − x + 3. Find the mistake and give the correct answer.', '8 − x − 3 = 5 − x. The minus changes every sign.'],
    ['x = 1, 2, 3 and y = 12, 17, 22. Find the rule.', 'y = 5x + 7. Up by 5, 5 × 1 = 5, and 12 − 5 = 7.'],
    ['Find 4x − 3y when x = 5 and y = 2.', '4 × 5 − 3 × 2 = 14'],
    ['Work out the perimeter of a rectangle that is 9 cm by 4 cm.', '9 + 4 + 9 + 4 = 26 cm'],
    ['A taxi costs £8 for 1 km, £10 for 2 km and £12 for 3 km. Suggest what a 0 km journey costs.', '£6. The fare goes up £2 a km, so go back one step: 8 − 2 = 6.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/Brackets and Beyond.pptx (the attached deck, Lesson 7), reference/Function Machines.pptx and reference/Putting Numbers In.pptx, and checked every question against the last four Do Nows and cold calls in the class (Brackets and Beyond, From A Table To A Rule, Function Machines, Putting Numbers In). Nothing repeats: a new subtract-a-bracket with two brackets, a new bracket slip, a new table (5x + 7: the number added is bigger than the multiplier, as in your 2x + 6), a new substitution with a minus, and a rectangle with numbers.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (two brackets with a minus between; the minus before a bracket changes every sign). Q3 and Q4 are earlier in the unit (the rule from a table, Lesson 6; putting numbers in, Lesson 4). Q5 is from last year (perimeter of a rectangle). Q6 previews today and is not taught yet: its card is SHADED, and its answer box says the answer outright. Say "suggest". Accept any attempt, write them on the board and leave them there: the We Do settles it.\n\n'
    + 'Q1: 2(x + 6) = 2x + 12 and −3(x − 1) = −3x + 3, so 2x + 12 − 3x + 3 = −x + 15. Check x = 2: 2 × 8 − 3 × 1 = 13, and −2 + 15 = 13. Expect −x − 9 or x + 15 (a lost sign). Q2: the student changed only the first sign. 8 − (x + 3) = 8 − x − 3 = 5 − x. Ask "does the 3 stay a plus?". Q4: 4 × 5 = 20 and 3 × 2 = 6, so 20 − 6 = 14. Expect 26 (the minus lost) from the room. Q5: 9 + 4 + 9 + 4 = 26 cm, or 2 × (9 + 4). Today starts from this: perimeter is the distance all the way round.\n\n'
    + 'Q3 IS THE ONE YOU FLAGGED. y goes up by 5, so the multiplier is 5; 5 × 1 = 5 and y is 12, so add 7: y = 5x + 7. Do not rush it, and do not just tell it: ask "how much does y go up when x goes up by 1?" and then "what is left over?". Expect y = 5x + 12 (the first y used as the number added) and y = 5x. Say "that is not the rule; check it with the second pair" and let them find it. This is the slip the worksheet and the game both go after.\n\n'
    + 'Q6 IS INTUITIVE. £8, £10, £12: the fare goes up by £2 each km. A 0 km journey is one step back from 1 km, so £6. Some will say £0 (nothing to pay for no distance) or £8. Both are sensible guesses and neither is wrong to say. The number it lands on, £6, is the fixed charge: what you pay before the taxi has gone anywhere. The We Do, row 3, settles it and gives it a name.\n\n'
    + 'THEY FOUND HARD: the table to the rule (Q3 and Q6) and the lost sign (Q1 and Q2). Both come back all lesson.\n\n'
    + 'CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
K.today(
  [
    'Write an expression for the perimeter of a shape with algebraic sides, then simplify it.',
    'Write an expression for a total cost or a total age.',
    'Find the rule from a table, and say what the number added means.',
  ],
  [['Write', true], [' it from the words. ', false], ['Simplify', true], [' it. ', false], ['Check', true], [' it with a number.', false]],
  'OBJECTIVES. 1 minute. Four clicks.\n\n'
  + 'THE FIRST TWO OBJECTIVES ARE YOUR WORDING, word for word. THE THIRD IS MINE, AND IT IS THE ONE YOU ASKED ME TO BAKE IN: "find the rule from a table, and say what the number added means". Your brief asked for the area with a bracket as well. That is the NEXT lesson (Area With A Bracket): three ideas plus real work on the table was too much for one 50-minute slot, so it is a two-part lesson, as you allowed. Say so: "today it is the shapes you can walk round, and the prices; next time it is the space inside".\n\n'
  + 'THE BANNER IS THE LESSON: write it from the words, simplify it, check it with a number. It is the same method three times: a perimeter, a price, a table. Say it twice. The check is the habit from Expand and Simplify ("put x = 2 in and see if they match"), now with a number that makes sense for the shape.\n\n'
  + 'THEY HAVE NOT BEEN GIVEN A NEW WORD TODAY. "Expression" they have. "Perimeter" they have from last year (Do Now Q5). "Fixed" appears in the We Do, in plain words: "a part that never changes".'
);

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook(
  'A rectangle has sides x + 3 and 2x. Which expression gives its perimeter?',
  [['A', '3x + 3'], ['B', '6x + 6'], ['C', '4x + 6']],
  'HOOK. 2 minutes. Three clicks: the question with its rectangle, then the three options together.\n\n'
  + 'Take a show of hands for each option and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 1 settles it, pointing at the tally.\n\n'
  + 'ANSWER, FOR YOU: B, 6x + 6. The sides are x + 3, 2x, x + 3 and 2x, and adding all four gives 6x + 6. A (3x + 3) is the commonest slip: only two sides added, (x + 3) + 2x. C (4x + 6) doubles the x + 3 but counts the 2x once: 2(x + 3) + 2x. Expect A and C to get a lot of votes, because the picture shows a rectangle and they remember "perimeter" as a number, not as four sides to add. Say nothing; ask "what did you add?" and let them say "the top and the side". That is the lesson said by a student.\n\n'
  + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md), so do not tell them. Do not do the sum yet: it is the next slide.\n\n'
  + 'THIS IS YOUR EXAMPLE (sides x + 3 and 2x, perimeter 6x + 6), and it is used again in I Do 1 so the Hook is settled with the same numbers.',
  (s) => {
    const rx = RIGHT - 2.60, ry = 1.58, rw = 1.80, rh = 0.88;
    s.addShape(S.rect, { x: rx, y: ry, w: rw, h: rh, fill: { color: 'FFFFFF' }, line: { color: C.dark, width: 2.2 }, objectName: 'hk_rect' });
    const lab = (txt, x, y, w, name) => s.addText(txt, { x, y, w, h: 0.30, color: C.blue, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: name });
    lab('x + 3', rx, ry - 0.34, rw, 'hk_t');
    lab('x + 3', rx, ry + rh + 0.04, rw, 'hk_b');
    lab('2x', rx - 0.62, ry + rh / 2 - 0.15, 0.56, 'hk_l');
    lab('2x', rx + rw + 0.06, ry + rh / 2 - 0.15, 0.56, 'hk_r');
  }
);

/* ================================================================== *
 * 4. I DO · 3: perimeter with letters (objective 1)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Perimeter with letters');
  subtitle(s, 'Add every side, then collect the like terms.');
  worked(s, {
    name: 'ea', x: M, y: 1.72, w: 4.50, h: 3.56, size: 15, step: 0.37, head: 'Find the perimeter of the rectangle.', lines: [
      { head: 'ROUTE 1: ADD ALL FOUR SIDES' },
      [N('('), L('x'), N(' + 3) + 2'), L('x'), N(' + ('), L('x'), N(' + 3) + 2'), L('x')],
      [N('= '), V('6x + 6')],
      { head: 'ROUTE 2: TWO OF EACH SIDE' },
      [N('2('), L('x'), N(' + 3) + 2(2'), L('x'), N(') = 2'), L('x'), N(' + 6 + 4'), L('x')],
      [N('= '), V('6x + 6')],
      [N('Check '), L('x'), N(' = 4: 7 + 8 + 7 + 8 = 30')],
      [N('6 × 4 + 6 = 30. '), G('They match.')],
    ],
  });
  const vx = M + 4.65, vw = RIGHT - vx, vh = vw * 540 / 960;
  video(s, 'shapes-and-prices-perimeter', vx, 1.72, vw, vh, 'vid_perim');
  banner(s, [['Add ', false], ['every side', true], [', or use ', false], ['two of each', true], ['. Both routes agree.', false]], { x: vx, y: 1.72 + vh + 0.16, w: vw, h: 0.60, size: 12.5, name: 'ea_banner' });
  s.addNotes(
    'I DO. 3 minutes. Seven clicks: route 1 (two clicks), route 2 (two clicks), the check (one), the animation (ON CLICK, so say the idea first), then the banner.\n\n'
    + 'OBJECTIVE 1. THE RECTANGLE IS THE HOOK\'S: sides x + 3 and 2x. SETTLE THE HOOK, POINTING AT THE TALLY: B, 6x + 6. ROUTE 1 IS THE SLOW, SURE ONE: write all four sides in a row, (x + 3) + 2x + (x + 3) + 2x, then collect: the x terms are x + 2x + x + 2x = 6x and the numbers are 3 + 3 = 6. ROUTE 2 IS THE SHORT ONE, AND IT IS A BRACKET: a rectangle has two of each side, so 2(x + 3) + 2(2x). Expand: 2x + 6 + 4x, and collect: 6x + 6. SAY "THE TWO ROUTES AGREE", THEN SAY WHY: route 2 is route 1 with the matching sides grouped. A student who can do both has checked one against the other.\n\n'
    + 'THE CHECK IS THE HABIT. Put a number in: x = 4 makes the sides 7 and 8, so the perimeter is 7 + 8 + 7 + 8 = 30, and the answer gives 6 × 4 + 6 = 30. If the two numbers differ, the expression is wrong. One matching value is a check, not a proof, and a good check number is one that gives sensible sides (not x = 0, where the 2x side vanishes).\n\n'
    + 'THE ANIMATION (about 31 seconds) does the same thing slowly and PAUSES at every step: a dot walks round the rectangle one side at a time and the running total grows beside it (x + 3, then 3x + 3, then 4x + 6, then 6x + 6); then the two x + 3 sides are lit together and the two 2x sides together, and the shorter sum is written; then the sides turn into the numbers 7 and 8 and the check is done. Talk over the pauses. You can click it to play it again.\n\n'
    + 'THE MISTAKES TO NAME, said out loud: (1) leaving a side out (the Hook\'s A: only two sides added); (2) counting the 2x only once in route 2 (the Hook\'s C); (3) writing 2(x + 3) as 2x + 3, the old slip from Expanding Brackets: ask "does the 2 reach the 3?". (4) A shape with no picture: always draw it first and write the lengths on it.\n\n'
    + 'POINT FORWARD: "next time the rectangle gets a different question: the space inside it".\n\n'
    + 'IF THEY ARE QUICK, ask for the perimeter of a square with side 2x + 1 (4(2x + 1) = 8x + 4) and for the perimeter of a rectangle with sides x and x + 5 (4x + 10).'
  );
}

/* ================================================================== *
 * 5. I DO · 3: write the total (objective 2)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Write the total');
  subtitle(s, 'Say what each part is. Then add the parts.');
  const cw = (CW - 0.24) / 2, y0 = 1.70, h = 2.72;
  const cardOf = (name, x, label, sit, lines) => {
    card(s, { x, y: y0, w: cw, h, name });
    s.addText(label, { x: x + 0.20, y: y0 + 0.08, w: cw - 0.40, h: 0.26, color: C.soft, fontFace: F.body, fontSize: 10, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `${name}_h` });
    s.addText(sit, { x: x + 0.20, y: y0 + 0.36, w: cw - 0.40, h: 0.62, color: C.dark, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 16, objectName: `${name}_s` });
    lines.forEach((parts, i) => expr(s, { x: x + 0.22, y: y0 + 1.02 + i * 0.32, w: cw - 0.40, h: 0.30, size: 14, parts, name: `${name}_l${i}` }));
  };
  cardOf('co', M, 'COST', 'A pen costs x pence. Write the cost of 4 pens and a 30p ruler.', [
    [N('Pens: 4 × '), L('x'), N(' = 4'), L('x'), ['    grows with x', C.soft, 10.5]],
    [N('Ruler: 30'), ['    never changes', C.soft, 10.5]],
    [N('Total: '), V('4x + 30')],
    [N('Check '), L('x'), N(' = 10: 40 + 30 = 70p')],
  ]);
  cardOf('ag', M + cw + 0.24, 'AGE', 'Mia is m. Her brother is 4 years older. Her dad is three times her age. Write their total age.', [
    [N('Mia: '), L('m')],
    [N('Brother: '), L('m'), N(' + 4')],
    [N('Dad: 3 × '), L('m'), N(' = 3'), L('m')],
    [N('Total: '), L('m'), N(' + ('), L('m'), N(' + 4) + 3'), L('m'), N(' = '), V('5m + 4')],
    [N('Check '), L('m'), N(' = 12: 12 + 16 + 36 = 64')],
  ]);
  banner(s, [['Write ', false], ['each part', true], ['. ', false], ['Add', true], [' them. ', false], ['Collect', true], [' the like terms. ', false], ['Check', true], [' with a number.', false]], { y: 4.58, h: 0.56, size: 13, name: 'co_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the cost card (its first two lines), its total and check, the age card (its first three lines), its total and check, then the banner.\n\n'
    + 'OBJECTIVE 2. BOTH EXAMPLES ARE YOURS, WORD FOR WORD: 4 pens at x pence and a 30p ruler; Mia is m, her brother is 4 years older, her dad is three times her age. THE METHOD IS THE SAME AS THE PERIMETER: write each part on its own line, then add, then collect. A total is a perimeter with no picture.\n\n'
    + 'COST. 4 pens at x pence each cost 4 × x = 4x. The ruler is 30. Total 4x + 30. Check x = 10 (a pen costs 10p): 4 × 10 = 40, plus 30 is 70p, and 4 × 10 + 30 = 70. THE TWO PARTS BEHAVE DIFFERENTLY and it is worth saying so: 4x grows when the price of a pen grows, and the 30 never changes whatever a pen costs. That is the "fixed part" and it comes back in the We Do (the taxi). They met this very question in Do Now Q4 of the last lesson but one (6 October), so say "you wrote this one on 6 October; now we say why".\n\n'
    + 'AGE. Mia is m. Her brother is 4 years OLDER, so m + 4 (not 4m: "older" means add). Her dad is THREE TIMES her age, so 3 × m = 3m (not m + 3: "times" means multiply). Total: m + (m + 4) + 3m. Collect: m + m + 3m = 5m, and the number is 4, so 5m + 4. Check m = 12: Mia 12, brother 16, dad 36, which is 64, and 5 × 12 + 4 = 64. THE TWO LANGUAGE TRAPS: "older" is a plus and "times" is a multiply; ask which is which. Expect m + 4m + 3m (4 years older read as four times) and 4m + 3 (the numbers and letters mixed up).\n\n'
    + 'DO NOT USE THE LETTER AS THE PERSON. Say "m is Mia\'s age in years", not "m is Mia". A letter stands for a number, and that is the idea under every expression in the unit.\n\n'
    + 'POINT FORWARD: "the We Do has one of each: a shape, an age and a table", and "the table is the one from the Do Now".\n\n'
    + 'IF THEY ARE QUICK, ask for the total of 3 pens at x pence, a 40p ruler and a 25p rubber (3x + 65), and for the family if the dad were 5 years older than Mia (m + (m + 4) + (m + 5) = 3m + 9).'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: "Finish it off" (objectives 1, 2 and 3, one row each)
 * ================================================================== */
{
  const mono = (xs, ys) => `x   ${xs.map((v) => String(v).padStart(2)).join('  ')}\ny   ${ys.map((v) => String(v).padStart(2)).join('  ')}`;
  K.finishItOff({
    title: 'What is the missing step?',
    sub: 'Finish this one. One row for each idea.',
    heads: ['THE PROBLEM', 'WRITE IT', 'ANSWER', 'CHECK'],
    widths: [2.20, 2.00, 1.70, 2.05],
    rowH: 0.98, size: 11, asize: 11,
    rows: [
      [['A triangle has sides x\u00A0+\u00A02, x\u00A0+\u00A02 and 2x\u00A0−\u00A01.'], ['(x + 2) + (x + 2) + (2x − 1)'], ['?', '4x + 3'], ['?', 'x = 5: 7 + 7 + 9 = 23 and 4 × 5 + 3 = 23. It fits.']],
      [['Sam is s. His sister is 2 years younger. His mum is 4 times his age. Write their total age.'], ['?', 's + (s − 2) + 4s'], ['?', '6s − 2'], ['s = 10: 10 + 8 + 40 = 58 and 6 × 10 − 2 = 58. It fits.']],
      [[mono([1, 2, 3], [8, 10, 12]) + '\nFind the rule.', 'mono'], ['?', '× 2, then + 6. Back one step: 8 − 2 = 6 when x = 0.'], ['?', 'y = 2x + 6'], ['x = 3: 2 × 3 + 6 = 12. It fits.']],
    ],
    notes:
      'WE DO. 5 minutes. Three clicks, one per row. THE MODE IS "FINISH IT OFF" (TEMPLATE.md): three partly worked solutions, and the class supplies the missing steps. Lesson 6 (From A Table To A Rule) used Finish It Off and Lesson 7 used Spot The Mistake and Rank And Conquer, so this is the one that has not been used in the last lesson; Lesson 9 uses Rank And Conquer. It practises all three objectives, one row each.\n\n'
      + 'THEY COMMIT BEFORE EACH REVEAL. Ask each pair to agree the missing step and say it, then click. ASK WHAT THEY DID, not just the answer: "which step was missing?" Naming the step is the point.\n\n'
      + 'ROW 1, A PERIMETER (OBJECTIVE 1): the triangle is x + 2, x + 2 and 2x − 1. The "write it" is given. The missing steps are the answer and the check. x terms: x + x + 2x = 4x. Numbers: 2 + 2 − 1 = 3. So 4x + 3. THE −1 IS THE POINT: it is the same sign slip as last lesson, so ask "what is 2 + 2 − 1?". Expect 4x + 5 (the 1 added). CHECK with x = 5: the sides are 7, 7 and 9, which make 23, and 4 × 5 + 3 = 23. If someone checks with x = 1, the sides are 3, 3 and 1, which is a triangle; if with x = 0 it is not (the sides are 2, 2 and −1), so say "pick a number that gives sides that exist".\n\n'
      + 'ROW 2, AN AGE (OBJECTIVE 2): the translation is missing, and that is the hard step. Sam is s. His sister is 2 years YOUNGER, so s − 2. His mum is 4 TIMES his age, so 4s. So s + (s − 2) + 4s, which collects to 6s − 2 (the s terms 1 + 1 + 4 = 6, the number −2). The check is given: s = 10, the sister is 8 and mum 40, so 10 + 8 + 40 = 58, and 6 × 10 − 2 = 58. Ask "younger: plus or minus?" and "times: add or multiply?".\n\n'
      + 'ROW 3, THE TABLE (OBJECTIVE 3), AND IT SETTLES DO NOW Q6. x = 1, 2, 3 and y = 8, 10, 12, YOUR EXAMPLE. Two questions, in the lesson 6 method: how much does y go up when x goes up by 1? 2, so the multiplier is 2. 2 × 1 = 2 but y is 8, so add 6: y = 2x + 6. THEN THE NEW THING, AND IT IS THE ANSWER TO Q6: the number added is what y is when x is 0. Go back one step from x = 1 to x = 0: y goes down by 2, from 8 to 6. So a 0 km journey costs £6, and the 6 in y = 2x + 6 is exactly that. In a taxi it is the fixed charge (what you pay before it has moved) and 2x is the price for the distance. THE X = 0 ROUTE IS A SECOND WAY TO FIND THE NUMBER ADDED: it is the same sum (8 − 2), seen on the table. Use the lesson 6 method if that is the one they own; use the x = 0 route if the "5 × 1 = 5 but y is 12, so add 7" step is the one that slips. Check x = 3: 2 × 3 + 6 = 12.\n\n'
      + 'THE MISTAKE THAT CATCHES THEM: using the FIRST y as the number added (8 here, so 2x + 8). The x = 0 route removes it: the first y is the value at x = 1, not at x = 0. Check with the second pair: 2 × 2 + 8 = 12, not 10.\n\n'
      + 'IF THEY ARE QUICK, ask them to make up a taxi table of their own for a partner to find the rule of. IF SHORT OF TIME, do rows 2 and 3 only.',
  });
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'Cold Call', 6);
  qGrid(s, { p: 'c', y0: 0.86, ch: 1.44, gap: 0.10, qh: 0.84, size: 13, asize: 11.5, qs: [
    ['A rectangle has sides x + 5 and x. Write its perimeter and simplify it.', '2(x + 5) + 2x = 4x + 10'],
    ['A triangle has sides 2x, 2x + 1 and x − 4. Write its perimeter and simplify it.', '2x + (2x + 1) + (x − 4) = 5x − 3'],
    ['A bun costs x pence. Write an expression for the cost of 5 buns and a 40p drink.', '5x + 40'],
    ['x = 1, 2, 3 and y = 9, 15, 21. Find y when x = 0, then write the rule.', 'y = 3 when x = 0. y = 6x + 3'],
    ['Expand −6(2x − 1).', '−12x + 6. −6 × (−1) = +6.'],
    ['Expand and simplify 5(x + 2) + 3(x − 4).', '5x + 10 + 3x − 12 = 8x − 2'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Give thinking time, then ask for the working out loud: "which step do you do first, and why?" Students have no mini whiteboards, so the working is spoken.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (a negative outside, from Brackets and Beyond: −6 × (−1) = +6) and Q6 (expand and simplify, from Expand and Simplify). Q1 to Q4 are today: two perimeters, a price and a table.\n\n'
    + 'Q1 IS OBJECTIVE 1: the sides are x + 5, x, x + 5 and x, so 2(x + 5) + 2x = 2x + 10 + 2x = 4x + 10. Expect 3x + 5 (two sides only, the Hook\'s slip). Q2: (2x) + (2x + 1) + (x − 4): the x terms are 5x and the numbers are 1 − 4 = −3, so 5x − 3. Expect 5x + 5 (the −4 taken as +4). Q3 IS OBJECTIVE 2: 5 × x = 5x, plus 40, so 5x + 40. Watch for 45x or 540x (the 40 stuck to the x). Q4 IS OBJECTIVE 3: y goes up by 6, so the multiplier is 6; going back one step from x = 1 (y = 9) gives y = 3 at x = 0, so y = 6x + 3. Check x = 3: 6 × 3 + 3 = 21. Expect y = 6x + 9 (the first y as the number added). Ask "what is y when x is 0?" and let the table answer.\n\n'
    + 'Q5: −6 × 2x = −12x and −6 × (−1) = +6, so −12x + 6. THE COMMON MISTAKE IS −12x − 6: ask "what is a negative times a negative?". Q6: 5x + 10 and 3x − 12, so 8x − 2 (10 − 12 = −2). Expect 8x + 2.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q2 and Q4 and ask them to write a table of their own. IF SHORT OF TIME, cut Q6.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14: the worksheet
 * ================================================================== */
K.youDo(14, 'Expressions From Shapes And Prices worksheet',
  [
    ['BRONZE', 'Add and write', 'Perimeters to add up, a price, an age and a taxi table. Then find a student’s mistake.', 'EEEAF8'],
    ['SILVER', 'Bigger shapes', 'A pentagon, a café and a family. A table in steps of 2. Why the number added is y at x = 0.', 'FDF0EE'],
    ['GOLD', 'Real life', 'An L-shape, a gym and two taxi firms. Where would you meet this? Work backwards from a perimeter.', 'F6D9D4'],
  ],
  'Choose a tier. The questions are mixed on purpose: you have to decide which method each one needs.',
  'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note. THE WORKSHEET IS THE TASK. The Find The Rule game is NOT today\'s You Do (you chose "standalone"): it is for homework, for early finishers and for a spare 15 minutes, and it is on the Classroom stream as a separate file.\n\n'
  + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md). Each tier opens with a fully worked example (with a picture of the shape), then a half-worked one, then blanks. BRONZE (Q1 to Q6): a half-worked rectangle, a square (4 × a bracket), a price, an age, a taxi table with "what does the 4 stand for?" and a student\'s perimeter with one 3 missing (Q6). SILVER (Q7 to Q13): a triangle with a subtraction in a side, a pentagon, a café price with a bracket, a family\'s ages, a table that goes up in 2s with "find y when x = 0", "why does that step work?" (Q12, why the number added is y at x = 0) and a student who used the first y as the number added (Q13). GOLD (Q14 to Q19): a half-worked isosceles triangle, an L-shape (and the rectangle round it), a gym with a joining fee, two taxi firms, "where would you meet this outside the lesson?" (Q18) and working backwards from a perimeter, (12x + 8) ÷ 4. AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student. The class has found maths easy before, so Gold goes past the lesson on purpose.\n\n'
  + 'THE QUESTIONS ARE MIXED ON PURPOSE (interleaved): a shape, a price, an age, a table, so each needs a decision about which method. The sheet says so. It feels harder and is meant to.\n\n'
  + 'THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page.\n\n'
  + 'CIRCULATE WITH ONE QUESTION: "which part of the table is the number added: the first y, or the y when x is 0?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
);

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark(
  [
    'You counted every side of the shape, then collected the x terms and the numbers.',
    'A price has a part that changes with x and a part that never changes.',
    'In a table rule, the multiplier comes first and then the number added, which is y when x is 0.',
    'You checked with a number. Write the correct answer next to anything wrong. Do not rub it out.',
  ],
  'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
  + 'THE ANSWERS ARE PRINTED UPSIDE DOWN at the foot of the worksheet\'s last page. Most are exact (the expressions, the check values, the rules); Q12 (why the number added is y at x = 0), Q13 (the student who used the first y) and Q18 (where would you meet this) say what a good answer contains.\n\n'
  + 'WALK ROUND reading for the three commonest mistakes: a side left out of a perimeter (Bronze Q1 and Q6, Silver Q7 and Q8); the number added taken from the first y of the table (Bronze Q5, Silver Q11 and Q13, Gold Q16); and "older" or "times" read the wrong way in an age (Bronze Q4, Silver Q10). If someone has made one, ask them to put a number in and see the two values disagree.'
);

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary(
  [
    ['A rectangle has sides x + 3 and 2x. Its perimeter is 3x + 3.', 'FALSE'],
    ['4 pens at x pence each and a 30p ruler cost 4x + 30 pence.', 'TRUE'],
    ['Mia is m and her dad is three times her age. Together they are 3m + 1.', 'FALSE'],
    ['x = 1, 2, 3 and y = 8, 10, 12 gives the rule y = 2x + 8.', 'FALSE'],
    ['In y = 2x + 6, the number added, 6, is the value of y when x is 0.', 'TRUE'],
  ],
  'Next: the area of a rectangle, and where the brackets come in.',
  'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
  + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1 is the Hook\'s A: only two sides were added; the perimeter is 6x + 6. Q3: m + 3m is 4m, not 3m + 1 (the "3 times" multiplies Mia\'s age, it does not add 3). Q4 IS THE ONE YOU FLAGGED: 2x + 8 uses the first y (8) as the number added; check with the second pair, 2 × 2 + 8 = 12, not 10. The rule is y = 2x + 6. THE TWO TRUES: Q2 (4 pens at x pence and a 30p ruler: 4x + 30) and Q5 (in y = 2x + 6, put x = 0: 2 × 0 + 6 = 6). Q4 AND Q5 ARE THE APPLIED ITEMS (TEMPLATE.md asks for at least one): each needs a table or a rule worked with, not recalled. Ask them to say the check out loud.\n\n'
  + 'THE HOOK WAS SETTLED IN I DO 1 (the perimeter, B). DO NOW Q6 WAS SETTLED IN THE WE DO (a 0 km journey costs £6). IF THE ROOM SPLITS on Q4, that is the first thing to retrieve at the start of the next lesson, and the Find The Rule game is the practice.\n\n'
  + 'THE CLOSING LINE POINTS AT THE NEXT LESSON, Area With A Bracket, which is built: the area of a rectangle with a bracket (3(x + 2)), expanded, and the perimeter and the area told apart. CHANGE THE LINE if the order of lessons changes.'
);

K.finish();

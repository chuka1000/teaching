/**
 * Y8 Maths, Algebra, Lesson 9: Area With A Bracket. Class 8CN. Single, 50 minutes. PART 2 OF 2 of the brief
 * "Expressions From Shapes And Prices". Maths track: 10 x 5.625 canvas, Number Revision palette. Shared furniture:
 * build/expressions-kit.js (the same as Lesson 8, so the two look alike).
 *
 * DATE: left blank for the teacher to type ("Date: ____"). The brief gave no date for the second part, and the next
 * 8CN slot is not written down in TIMETABLE.md.
 *
 * PREVIOUS: Lesson 8, Expressions From Shapes And Prices (built the same day, in out/ and not yet in reference/), and
 * Lesson 7, reference/Brackets and Beyond.pptx. Lesson 8 taught: the perimeter of a shape with algebraic sides (add all
 * four sides, or two of each: 2(x + 3) + 2(2x) = 6x + 6), a total cost or age (4x + 30; m + (m + 4) + 3m = 5m + 4), and
 * the rule from a table with the NUMBER ADDED as y when x = 0 (the fixed charge). Its plenary promised "the area of a
 * rectangle, and where the brackets come in": this lesson keeps that promise. Its We Do was Finish It Off, so TODAY IS
 * RANK AND CONQUER (Lesson 7 used Spot The Mistake and Rank And Conquer, Lesson 6 Finish It Off).
 *
 * THE BRIEF'S THIRD OBJECTIVE ("write an expression for an area that needs a bracket, then expand it") is objectives 1
 * and 2 here. The third objective is mine: tell the perimeter and the area apart and write both. It is the Hook's wrong
 * option A (2x + 18 is the PERIMETER of the garden), it is I Do 1, and it is what the Period 2 finisher practises.
 *
 * THE TABLE TO THE RULE (the thing they found hard) comes back as AREAS: a rectangle 2 by (x + 3) has areas 8, 10, 12 when
 * x = 1, 2, 3 (your table), and the rule from the table, y = 2x + 6, is the same expression as the expanded bracket
 * 2(x + 3) = 2x + 6. That is Bronze Q5, the Plenary's last item and Gold Q16, which goes the other way (a table, then
 * the bracket). Do Now Q3, Cold Call Q5 and Plenary Q4 are plain tables.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14,
 * Mark 3, Plenary 3. I Do 1 teaches objectives 1 and 3 (area as a bracket; area against perimeter), I Do 2 teaches
 * objective 2 (expand, with a plus and with a minus). The You Do is the worksheet; the Period 2 finisher is on its last page.
 *
 * Every number is checked in build/area-with-a-bracket-check.py (sympy), which also reads the deck back.
 */
const K = require('./expressions-kit')({
  lesson: 'Area With A Bracket',
  date: null,
  subject: 'Y8 Maths · Algebra · Lesson 9 · 8CN',
});
const { S, C, F, M, RIGHT, CW, H, newSlide, pill, title, subtitle, card, banner, expr, worked, qGrid, video, N, L, V, SOFTT, G } = K;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = newSlide(10);
  K.doNowHead(s);
  qGrid(s, { p: 'd', y0: 1.02, ch: 1.38, gap: 0.13, qh: 0.72, size: 13, asize: 11.5, preview: 5, qs: [
    ['A rectangle has sides x + 6 and 3x. Write its perimeter and simplify it.', '2(x + 6) + 2(3x) = 8x + 12'],
    ['Dev is d years old. His brother is 5 years older and his mum is four times his age. Write their total age.', 'd + (d + 5) + 4d = 6d + 5'],
    ['x = 1, 2, 3 and y = 14, 18, 22. Find the rule.', 'y = 4x + 10. Up by 4, 4 × 1 = 4, and 14 − 4 = 10.'],
    ['Expand and simplify 3(x + 4) − (x − 2).', '3x + 12 − x + 2 = 2x + 14'],
    ['Work out the area of a rectangle that is 8 cm by 5 cm.', '8 × 5 = 40 cm²'],
    ['A rectangle is 5 cm wide and x cm long. Suggest an expression for its area.', '5x cm². Area is width × length: 5 × x.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ the previous lessons in the class: Lesson 8 (Expressions From Shapes And Prices, built for the same brief) and reference/Brackets and Beyond.pptx, and checked every question against the last four Do Nows and cold calls (Expressions From Shapes And Prices, Brackets and Beyond, From A Table To A Rule, Function Machines). Nothing repeats: the same skills with new numbers (a new rectangle, a new family, a new table, a new subtract-a-bracket) and a first area.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (a perimeter with letters; a total age). Q3 and Q4 are earlier in the unit (the rule from a table, Lessons 6 and 8; a bracket taken away, Lesson 7). Q5 is from last year (the area of a rectangle). Q6 previews today and is not taught yet: its card is SHADED, and its answer box says the answer outright. Say "suggest". Accept any attempt, write them on the board and leave them there: I Do 1 settles it.\n\n'
    + 'Q1: 2(x + 6) + 2(3x) = 2x + 12 + 6x = 8x + 12, or all four sides added: (x + 6) + 3x + (x + 6) + 3x. Check x = 1: the sides are 7 and 3, so 7 + 3 + 7 + 3 = 20, and 8 + 12 = 20. Expect 4x + 6 (two sides only). Q2: "5 years older" is d + 5 and "four times his age" is 4d, so d + (d + 5) + 4d: the d terms are 6d and the number is 5, so 6d + 5. The traps are "older" (add) and "times" (multiply). Q4: 3x + 12 − x + 2 = 2x + 14. Expect 2x + 10 (the −2 not changed to +2): "the minus changes every sign".\n\n'
    + 'Q3 IS THE ONE YOU FLAGGED, AGAIN. y goes up by 4, so the multiplier is 4; 4 × 1 = 4 and y is 14, so add 10: y = 4x + 10. Or go back one step to x = 0: 14 − 4 = 10, the number added (the route from the last lesson). Expect y = 4x + 14 (the first y used as the number added): say "check it with the second pair" and let them find it: 4 × 2 + 14 = 22, not 18. Do not just tell it.\n\n'
    + 'Q5: 8 × 5 = 40, and the unit is cm², not cm: say it now, because I Do 1 is about it. Q6 IS INTUITIVE: 5 cm wide and x cm long, so 5 × x = 5x cm². Almost all will say 5x. The Hook is the same idea with a total as the length, and that is where the bracket arrives.\n\n'
    + 'THEY FOUND HARD: the table to the rule (Q3) and the lost sign (Q4). Both come back all lesson.\n\n'
    + 'THE DATE IS BLANK: type it in before you teach. The next 8CN slot is not written down, so it could not be filled in.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
K.today(
  [
    'Write an expression for the area of a rectangle with an algebraic side.',
    'Expand the bracket to write the area as a simple expression.',
    'Tell the perimeter and the area of a rectangle apart, and write both.',
  ],
  [['Perimeter', true], [' adds the sides. ', false], ['Area', true], [' multiplies two of them.', false]],
  'OBJECTIVES. 1 minute. Four clicks.\n\n'
  + 'THE FIRST TWO OBJECTIVES ARE YOUR THIRD ONE, SPLIT IN TWO: "write an expression for an area that needs a bracket, then expand it" is objective 1 (write it as a bracket) and objective 2 (expand it). THE THIRD IS MINE: tell the perimeter and the area apart. Last lesson was the perimeter; today is the area, and the commonest mistake is writing one when the question asked for the other (the Hook\'s A). This is part 2 of the two-part lesson you allowed.\n\n'
  + 'SAY WHAT LAST LESSON PROMISED: "last time we added the sides of a shape; today we multiply two of them". THE BANNER IS THE LESSON: perimeter adds the sides, area multiplies two of them. Say it twice. It is also the check: put a number in and see which one you have.\n\n'
  + 'ONE NEW WORD THAT IS NOT NEW: AREA. They know it from Do Now Q5. The new part is that a side can be a total, x + 5, and a total goes in a bracket. Units are new in emphasis: cm² and m², not cm and m.'
);

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook(
  'A garden is 4 m wide and (x + 5) m long. Which expression gives its area?',
  [['A', '2x + 18'], ['B', '4x + 5'], ['C', '4x + 20']],
  'HOOK. 2 minutes. Three clicks: the question with its rectangle, then the three options together.\n\n'
  + 'Take a show of hands for each option and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 1 settles A, and I Do 2 settles B and C.\n\n'
  + 'ANSWER, FOR YOU: C, 4x + 20. The area is width × length = 4 × (x + 5), and the 4 multiplies BOTH the x and the 5, so 4x + 20. A (2x + 18) is the PERIMETER of the garden: 2(4) + 2(x + 5) = 8 + 2x + 10 = 2x + 18. It is the right answer to a different question, and it is the commonest wrong vote, because they did a perimeter last lesson. B (4x + 5) is the slip you flagged all unit: the 4 multiplied the x and "forgot" the 5. Expect A and B to get most of the votes. Say nothing; ask "what did you do?" and let them say "I added the sides" or "I multiplied the 4 by the x". That is the lesson said by a student.\n\n'
  + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md), so do not tell them. Do not do the sum yet: it is the next slide.',
  (s) => {
    const rx = RIGHT - 2.60, ry = 1.58, rw = 1.80, rh = 0.88;
    s.addShape(S.rect, { x: rx, y: ry, w: rw, h: rh, fill: { color: 'FFFFFF' }, line: { color: C.dark, width: 2.2 }, objectName: 'hk_rect' });
    const lab = (txt, x, y, w, name) => s.addText(txt, { x, y, w, h: 0.30, color: C.blue, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: name });
    lab('x + 5', rx, ry - 0.34, rw, 'hk_t');
    lab('x + 5', rx, ry + rh + 0.04, rw, 'hk_b');
    lab('4', rx - 0.38, ry + rh / 2 - 0.15, 0.30, 'hk_l');
    lab('4', rx + rw + 0.08, ry + rh / 2 - 0.15, 0.30, 'hk_r');
  }
);

/* ================================================================== *
 * 4. I DO · 3: area, and not perimeter (objectives 1 and 3)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Area, and not perimeter');
  subtitle(s, 'The same garden, 4 m wide and (x + 5) m long, and two different questions.');
  const cw = (CW - 0.24) / 2, y0 = 1.70, h = 2.70;
  const cardOf = (name, x, label, sub, lines) => {
    card(s, { x, y: y0, w: cw, h, name });
    s.addText(label, { x: x + 0.20, y: y0 + 0.08, w: cw - 0.40, h: 0.26, color: C.soft, fontFace: F.body, fontSize: 10, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `${name}_h` });
    s.addText(sub, { x: x + 0.20, y: y0 + 0.38, w: cw - 0.40, h: 0.30, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: `${name}_s` });
    lines.forEach((parts, i) => expr(s, { x: x + 0.22, y: y0 + 0.82 + i * 0.40, w: cw - 0.40, h: 0.34, size: 14.5, parts, name: `${name}_l${i}` }));
  };
  cardOf('ar', M, 'AREA: THE SPACE INSIDE', 'Multiply the width by the length.', [
    [N('width × length')],
    [N('4 × ('), L('x'), N(' + 5) = '), V('4(x + 5)')],
    [N('Check '), L('x'), N(' = 3: 4 × 8 = 32 m²')],
    [N('Area is in '), V('m²'), N(', square metres.')],
  ]);
  cardOf('pe', M + cw + 0.24, 'PERIMETER: THE DISTANCE ROUND', 'Add all four sides.', [
    [N('4 + ('), L('x'), N(' + 5) + 4 + ('), L('x'), N(' + 5)')],
    [N('= '), V('2x + 18')],
    [N('Check '), L('x'), N(' = 3: 4 + 8 + 4 + 8 = 24 m')],
    [N('Perimeter is in '), V('m'), N('.')],
  ]);
  banner(s, [['Perimeter', true], [' adds the sides. ', false], ['Area', true], [' multiplies two of them.', false]], { y: 4.58, h: 0.56, size: 13.5, name: 'ar_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the area card (two lines), its check and unit, the perimeter card (two lines), its check and unit, then the banner.\n\n'
    + 'OBJECTIVES 1 AND 3. THE GARDEN IS THE HOOK\'S: 4 m wide and (x + 5) m long. TWO QUESTIONS ABOUT ONE SHAPE. AREA: the space inside, so width × length = 4 × (x + 5). Write it 4(x + 5). WHY A BRACKET: the length is x + 5, a total, ONE length, so the whole of it is multiplied by 4, and a bracket says "the whole of this". Without the bracket, 4 × x + 5 would mean something else. PERIMETER: the distance round, so add all four sides: 4 + (x + 5) + 4 + (x + 5) = 2x + 18.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: A (2x + 18) is the PERIMETER. It is the right answer to a different question. The area waits for the next slide, where it is expanded: 4(x + 5) = 4x + 20, which is C.\n\n'
    + 'THE CHECK TELLS THEM APART. Put x = 3 in: the length is 8, so the area is 4 × 8 = 32 and the perimeter is 4 + 8 + 4 + 8 = 24. Two different numbers from the same garden. THE UNITS TELL THEM APART TOO: a perimeter is a length, in m; an area is a number of squares, in m² (square metres). Expect "m" for both: ask "how many squares fit inside?".\n\n'
    + 'THE MISTAKES TO NAME, said out loud: (1) adding when the question asked for the area (the Hook\'s A); (2) multiplying when the question asked for the perimeter; (3) writing 4 × x + 5 with no bracket; (4) the unit m for an area.\n\n'
    + 'POINT FORWARD: "next slide: the bracket, expanded, and what happens when there is a minus inside it".\n\n'
    + 'IF THEY ARE QUICK, ask for the area and the perimeter of a rectangle 3 by (x + 2): 3(x + 2) and 2x + 10.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: expand the area (objective 2)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Expand the area');
  subtitle(s, 'Split the length into two pieces. Multiply each piece by the width.');
  worked(s, {
    name: 'ex', x: M, y: 1.72, w: 4.50, h: 3.56, size: 14.5, step: 0.37, head: 'Write the area as a simple expression.', lines: [
      { head: 'SPLIT THE RECTANGLE: 4(x + 5)' },
      [N('4 × '), L('x'), N(' = 4'), L('x'), N('   and   4 × 5 = 20')],
      [N('4('), L('x'), N(' + 5) = '), V('4x + 20 m²')],
      [N('Check '), L('x'), N(' = 3: 4 × 8 = 32, and 12 + 20 = 32')],
      { head: 'WITH A MINUS: 5(x − 3)' },
      [N('5 × '), L('x'), N(' = 5'), L('x'), N('   and   5 × (−3) = −15')],
      [N('5('), L('x'), N(' − 3) = '), V('5x − 15 m²')],
      [N('Check '), L('x'), N(' = 6: 5 × 3 = 15, and 30 − 15 = 15')],
    ],
  });
  const vx = M + 4.65, vw = RIGHT - vx, vh = vw * 540 / 960;
  video(s, 'area-with-a-bracket-split', vx, 1.72, vw, vh, 'vid_split');
  banner(s, [['Split', true], [' the length. ', false], ['Multiply', true], [' each piece by the width.', false]], { x: vx, y: 1.72 + vh + 0.16, w: vw, h: 0.60, size: 12.5, name: 'ex_banner' });
  s.addNotes(
    'I DO. 3 minutes. Seven clicks: the plus example (three clicks), the minus example (two clicks), the animation (ON CLICK, so say the idea first), then the banner.\n\n'
    + 'OBJECTIVE 2. EXPAND THE AREA FROM THE LAST SLIDE: 4(x + 5). THE PICTURE IS THE REASON: split the garden\'s length into x and 5, so the rectangle splits into two. One piece is 4 by x, area 4 × x = 4x. The other is 4 by 5, area 4 × 5 = 20. The garden is both pieces, so 4x + 20. SAY "the 4 is the height of BOTH pieces": that is why it multiplies both terms, and it is the answer to the slip you flagged (the 4 multiplying only the x). SETTLE THE HOOK, POINTING AT THE TALLY: C, 4x + 20, and B (4x + 5) is the rectangle with the second piece missing.\n\n'
    + 'THE CHECK: x = 3 makes the length 8, so the area is 4 × 8 = 32, and 4 × 3 + 20 = 12 + 20 = 32. THEY MATCH. If they did not, the expansion would be wrong. (A perimeter check would give 24, which is how they know they have the area.)\n\n'
    + 'THE MINUS CASE, 5(x − 3): the area model cannot show a negative piece, so say so, and use the sign rule you taught last lesson: 5 × x = 5x and 5 × (−3) = −15, so 5x − 15. THE SIGN GOES WITH THE TERM: the −3 is a negative three, and the 5 times it is −15. Think of it as a 5 by x rectangle with a 5 by 3 strip cut off. Check x = 6: the width is 3 (6 − 3), so the area is 5 × 3 = 15, and 5 × 6 − 15 = 15. THE x MUST BE BIGGER THAN 3, or the width would be negative: say so, it is why the check uses x = 6.\n\n'
    + 'THE ANIMATION (about 28 seconds) does the plus case slowly and PAUSES at every step: the rectangle 4 high and x + 5 wide, a line that splits the length into x and 5, the two areas written one at a time (4 × x = 4x and 4 × 5 = 20), the total 4x + 20, and then the check with x = 3 (the pieces are 12 and 20, and 32 in all). Talk over the pauses. You can click it to play it again.\n\n'
    + 'THE MISTAKES TO NAME: (1) 4x + 5, the 4 reaching the first term only; (2) 5x − 3 for 5(x − 3), the same slip; (3) 5x + 15, a lost sign. ASK "which term did the 5 multiply?" and take "both".\n\n'
    + 'IF THEY ARE QUICK, ask for 8(x + 3) and 2(5x − 4): 8x + 24 and 10x − 8.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Rank And Conquer (objectives 2 and 3)
 * ================================================================== */
{
  /** Rank And Conquer must not give the game away by length (Chuka, 2026-10-18; TEMPLATE.md): the best answer is neither the longest nor the shortest, and all four are within a quarter of each other. */
  function checkLengths(answers) {
    const lens = answers.map((a) => a.text.length), max = Math.max(...lens), min = Math.min(...lens);
    const best = answers.find((a) => a.rank === 1), bl = best.text.length;
    const detail = answers.map((a, i) => `${'ABCD'[i]} (rank ${a.rank}) ${a.text.length}`).join(', ');
    if (max > 150) throw new Error(`Rank And Conquer: an answer is ${max} characters; keep each to 150 or fewer so it fits three lines`);
    if (bl >= max) throw new Error(`Rank And Conquer: the best answer is the longest, which gives the game away. Pad the weak ones. Lengths: ${detail}`);
    if (bl <= min) throw new Error(`Rank And Conquer: the best answer is the shortest, which is a cue too. Lengths: ${detail}`);
    if (max / min > 1.3) throw new Error(`Rank And Conquer: the four answers differ by more than a quarter in length (${(max / min).toFixed(2)}x). Lengths: ${detail}`);
    console.log('Rank And Conquer lengths:', detail);
  }
  const ANSWERS = [
    { text: 'Area = height × width = 6(x − 2) = 6x − 2. The 6 multiplies the x, so I have finished the bracket.', rank: 3, marks: 2, why: '2 marks. The bracket and the 6x are right. The 6 never reached the −2, and there is no unit.' },
    { text: 'Area = 6 × x − 2 = 6x − 2. The minus belongs to the x, so only the x is multiplied by 6 and the 2 stays.', rank: 4, marks: 1, why: '1 mark. No bracket, so the 6 multiplies only the x. The 6x is the one mark. No unit.' },
    { text: 'Area = height × width = 6(x − 2) = 6x − 12 cm². The 6 multiplies the x and the −2, and an area is in cm².', rank: 1, marks: 4, why: '4 marks. The bracket, the 6x, the −12 and the unit are all there.' },
    { text: 'Area = height × width = 6(x − 2) = 6x − 12. The 6 multiplies the x and the −2, so both terms change inside the bracket.', rank: 2, marks: 3, why: '3 marks. Everything is right except the unit: an area is in cm², not nothing.' },
  ];
  checkLengths(ANSWERS);
  const UPGRADED = 'Area = 6(x − 2) = 6x − 12 cm². The 6 multiplies both terms.';

  const s = newSlide(5);
  pill(s, 'We Do', 5);
  title(s, 'Rank the four answers', null, { size: 24 });
  s.addText([
    { text: 'A poster is 6 cm tall and (x − 2) cm wide. Write its area and expand it. ', options: { bold: true, color: C.dark } },
    { text: 'Four marks: the bracket, the 6x, the −12, the unit.', options: { color: C.soft } },
  ], { x: M, y: 1.28, w: CW, h: 0.52, fontFace: F.body, fontSize: 12.5, valign: 'middle', margin: 0, lineSpacing: 16, objectName: 'rc_q' });
  const cw = (CW - 0.20) / 2, ch = 1.40, y0 = 1.88, gap = 0.10;
  ANSWERS.forEach((a, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.20), y = y0 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `rc${i}` });
    s.addText('ABCD'[i], { x: x + 0.16, y: y + 0.10, w: 0.30, h: 0.30, color: C.answer, fontFace: F.title, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `rc${i}_k` });
    s.addText(a.text, { x: x + 0.52, y: y + 0.08, w: cw - 0.70, h: 0.66, color: C.dark, fontFace: F.body, fontSize: 11.5, valign: 'top', margin: 0, lineSpacing: 14.5, objectName: `rc${i}_t` });
    const chip = ['1st', '2nd', '3rd', '4th'][a.rank - 1];
    s.addText(chip, { shape: S.roundRect, rectRadius: 0.10, x: x + 0.16, y: y + ch - 0.58, w: 0.62, h: 0.40, fill: { color: a.rank === 1 ? C.green : a.rank === 4 ? C.answer : C.dark }, line: { color: 'FFFFFF', width: 0 }, color: 'FFFFFF', fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rc${i}_rank` });
    s.addText(a.why, { x: x + 0.90, y: y + ch - 0.66, w: cw - 1.06, h: 0.56, color: C.dark, fontFace: F.body, fontSize: 10.5, bold: true, valign: 'middle', margin: 0, lineSpacing: 13, objectName: `rc${i}_why` });
  });
  s.addText([{ text: 'CONQUER: upgrade B. ', options: { bold: true, color: C.accent } }, { text: UPGRADED, options: { color: C.white, bold: true } }], {
    shape: S.roundRect, rectRadius: 0.08, x: M, y: y0 + 2 * (ch + gap) + 0.06, w: CW, h: 0.50, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    fontFace: F.body, fontSize: 12, align: 'left', valign: 'middle', margin: 9, objectName: 'rc_conquer',
  });
  s.addNotes(
    'WE DO. 5 minutes. Five clicks: card C, card D, card A, card B (best first), then the upgrade. THE MODE IS RANK AND CONQUER (TEMPLATE.md). Lesson 8 used Finish It Off, and Lesson 7 used Spot The Mistake and Rank And Conquer, so this is not the last lesson\'s mode. It practises objective 2 (expanding, with a minus) and the bracket from objective 1.\n\n'
    + 'THE QUESTION IS 6(x − 2) (4 marks): the area written as a product with a bracket, 6(x − 2) (1); the 6 multiplying the x, 6x (1); the 6 multiplying the −2, giving −12 (1); the unit, cm² (1). THE RANKING COMES FROM THAT MARK SCHEME, NOT TASTE. Count what each answer has: C has all four (4 marks). D has the first three and no unit (3 marks). A has the bracket and the 6x, then the 6 never reaches the −2, and no unit (2 marks). B has no bracket, so the 6 multiplies only the x (6x is the one mark) and the 2 stays, and no unit (1 mark). The order is C, D, A, B.\n\n'
    + 'THE FOUR ANSWERS ARE ABOUT THE SAME LENGTH ON PURPOSE (TEMPLATE.md, Chuka 2026-10-18): the best answer is NOT the longest. D is the longest and is second; C is the best and sits between A and D. Students rank by length when they can, so do not let them. The build refuses a version where this is not true.\n\n'
    + 'RANK. BEFORE THE FIRST CLICK the class commits, by a show of hands, to the WEAKEST and the STRONGEST. Expect many to name D as the strongest ("it has the most words") and A as the weakest ("it is wrong"). Then click the ranking one card at a time, each with one reason: C 4 marks, D 3, A 2, B 1. Ask what each student did, not what the right answer is.\n\n'
    + 'CONQUER. B HOLDS THE LESSON\'S MISCONCEPTION (the 6 multiplies only the x), so upgrade it together until it would rank first: write the bracket, 6(x − 2); the 6 multiplies the x and the −2, so 6x − 12; and the unit, cm². The upgraded answer is the LAST click. Check with x = 5: the width is 3, so the area is 6 × 3 = 18, and 6 × 5 − 12 = 18; B gives 30 − 2 = 28.\n\n'
    + 'IF YOU HAVE TIME, two cold-call questions (your layout has no Cold Call in this half): "what is the unit of an area?" (cm²) and "which is bigger, the perimeter or the area, when x = 5?" (the perimeter is 2(6) + 2(3) = 18 and the area is 18: equal for this poster at x = 5, a coincidence, so say "a number check can hide a mix-up if the two happen to agree": use x = 4: perimeter 16, area 12).'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'Cold Call', 6);
  qGrid(s, { p: 'c', y0: 0.86, ch: 1.44, gap: 0.10, qh: 0.84, size: 13, asize: 11.5, qs: [
    ['A rectangle is 7 m long and (x + 2) m wide. Write its area as a bracket.', '7(x + 2) m²'],
    ['Expand 7(x + 2).', '7x + 14'],
    ['A rectangle is 3 cm wide and (2x − 1) cm long. Write its area and expand it.', '3(2x − 1) = 6x − 3 cm²'],
    ['A rectangle has sides 5 and x + 3. Write its perimeter and its area, both simplified.', 'Perimeter 2x + 16. Area 5x + 15.'],
    ['x = 1, 2, 3 and y = 9, 13, 17. Find y when x = 0, then write the rule.', 'y = 5 when x = 0. y = 4x + 5'],
    ['Expand −7(x − 4).', '−7x + 28. −7 × (−4) = +28.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Give thinking time, then ask for the working out loud: "which step do you do first, and why?" Students have no mini whiteboards, so the working is spoken.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (the table to the rule, Lessons 6 and 8) and Q6 (a negative outside the bracket, Lesson 7). Q1 to Q4 are today: an area as a bracket, expanded; a minus inside; a perimeter and an area together.\n\n'
    + 'Q1 IS OBJECTIVE 1: width × length = 7 × (x + 2) = 7(x + 2) m². Expect 7x + 2 m (the bracket missing and the unit wrong). Q2 IS OBJECTIVE 2: 7x + 14. THE COMMON MISTAKE IS 7x + 2: ask "what did the 7 multiply?". Q3: 3(2x − 1) = 6x − 3 (3 × 2x = 6x and 3 × (−1) = −3). Check x = 2: the length is 3, so 3 × 3 = 9, and 12 − 3 = 9. Expect 6x − 1. Q4 IS OBJECTIVE 3: perimeter = 2(5) + 2(x + 3) = 10 + 2x + 6 = 2x + 16, area = 5(x + 3) = 5x + 15. Ask "which one adds?". Check x = 3: the sides are 5 and 6, so the perimeter is 22 = 2 × 3 + 16, and the area is 30 = 5 × 3 + 15.\n\n'
    + 'Q5 IS THE THING YOU FLAGGED: y goes up by 4, so the multiplier is 4; going back one step from x = 1 (y = 9) gives y = 5 at x = 0, so y = 4x + 5. Check x = 3: 4 × 3 + 5 = 17. Expect y = 4x + 9 (the first y as the number added). Ask "what is y when x is 0?" and let the table answer. Q6: −7 × x = −7x and −7 × (−4) = +28, so −7x + 28. THE COMMON MISTAKE IS −7x − 28: ask "what is a negative times a negative?".\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q3 and Q5 and ask them to write a table of areas of their own. IF SHORT OF TIME, cut Q6.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14: the worksheet
 * ================================================================== */
K.youDo(14, 'Area With A Bracket worksheet',
  [
    ['BRONZE', 'Area with a bracket', 'Write an area as a bracket and expand it. Tell the area from the perimeter. A table of areas.', 'EEEAF8'],
    ['SILVER', 'Minus and beds', 'A minus inside the bracket. Two garden beds added together. A table that goes up in 2s.', 'FDF0EE'],
    ['GOLD', 'A letter outside', 'x(x + 4), a rule written as a bracket, and working back from an area.', 'F6D9D4'],
  ],
  'Choose a tier. The questions are mixed on purpose: you have to decide which method each one needs. Finished early? The finisher is on the last page.',
  'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note. THE WORKSHEET IS THE TASK. The Find The Rule game (the standalone game on tables) is NOT in this slot: it is for homework, early finishers and a spare 15 minutes.\n\n'
  + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md). Each tier opens with a fully worked example (with a picture of the rectangle), then a half-worked one, then blanks. BRONZE (Q1 to Q6): a half-worked area with a bracket, expanding 4(x + 9), a rectangle with a letter for the width, the perimeter AND the area of one rectangle (Q4), a table of areas (Q5: 8, 10, 12, your table, which is 2(x + 3) = 2x + 6), and a student\'s 5(x + 2) = 5x + 2 (Q6). SILVER (Q7 to Q13): a half-worked area with a minus, expanding with a minus, a perimeter and an area, two garden beds added (Q10), a table in steps of 2 (Q11), "why does that step work?" (Q12, why the 4 multiplies the 5 as well, from the picture) and a student who found the perimeter when asked for the area (Q13). GOLD (Q14 to Q19): THE LETTER OUTSIDE THE BRACKET, x(x + 7) = x² + 7x (Gold only: they met x × x = x² in Expand and Simplify), 2x(3x − 1), a table that gives a rule you write as a bracket (Q16), "where would you meet this outside the lesson?" (Q17), a rectangle x by (x + 5), and the length from an area (Q19). AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student.\n\n'
  + 'THE FINISHER (YOURS, FOR THE END OF THE LESSON): students draw their own shape with algebraic sides on the last page, swap with a partner, and each writes and simplifies the other\'s perimeter. If it is a rectangle, a partner may also write the area (Gold). It is for whoever finishes the tier early, and it is the thing to do if the Mark slide arrives and the tier is not finished.\n\n'
  + 'THE QUESTIONS ARE MIXED ON PURPOSE (interleaved): an area, a perimeter, a table, a bracket with a minus. The sheet says so. THE WORKSHEET HAS A RAG GRID at the top. Answers are printed UPSIDE DOWN on the last page.\n\n'
  + 'CIRCULATE WITH ONE QUESTION: "is that the one that adds, or the one that multiplies?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.'
);

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark(
  [
    'You wrote the area as width × length, with the length in a bracket.',
    'The number outside multiplied every term inside, and a minus stayed with its term.',
    'You did not mix up the perimeter (add the sides) and the area (multiply two of them), and the area has square units.',
    'You checked with a number. Write the correct answer next to anything wrong. Do not rub it out.',
  ],
  'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
  + 'THE ANSWERS ARE PRINTED UPSIDE DOWN at the foot of the worksheet\'s last page (the finisher is above them, and is not marked from the back). Most are exact; Q12 (why the 4 multiplies the 5), Q17 (where would you meet this) and Q13 (the student who found the perimeter) say what a good answer contains.\n\n'
  + 'WALK ROUND reading for the three commonest mistakes: the outside number reaching only the first term (Bronze Q2 and Q6, Silver Q8); a perimeter written when the area was asked for, or the other way round (Bronze Q4, Silver Q9 and Q13); and a lost sign when the bracket has a minus (Silver Q7 and Q8). If someone has made one, ask them to put a number in and see which of the two values it matches.'
);

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary(
  [
    ['A rectangle is 4 m wide and (x + 5) m long. Its area is 2x + 18.', 'FALSE'],
    ['4(x + 5) = 4x + 20.', 'TRUE'],
    ['6(x − 2) = 6x − 2.', 'FALSE'],
    ['x = 1, 2, 3 and y = 9, 13, 17 gives the rule y = 4x + 9.', 'FALSE'],
    ['A 3 by (x + 2) rectangle has areas 9, 12, 15 when x = 1, 2, 3. So y = 3x + 6.', 'TRUE'],
  ],
  'Perimeter adds the sides. Area multiplies two of them. Check with a number.',
  'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
  + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1 is the Hook\'s A: 2x + 18 is the PERIMETER, not the area (the area is 4x + 20). Q3: the 6 multiplies the −2 as well, so 6(x − 2) = 6x − 12. Q4 IS THE ONE YOU FLAGGED: 4x + 9 uses the first y (9) as the number added; the rule is y = 4x + 5, because going back one step from x = 1 gives y = 5 at x = 0. Check with the second pair: 4 × 2 + 9 = 17, not 13. THE TWO TRUES: Q2 (4(x + 5) = 4x + 20) and Q5 (a rectangle 3 by (x + 2) has areas 3 × 3 = 9, 3 × 4 = 12, 3 × 5 = 15; y goes up by 3, 3 × 1 = 3 and 9 − 3 = 6, so y = 3x + 6, which is 3(x + 2) expanded). Q4 AND Q5 ARE THE APPLIED ITEMS (TEMPLATE.md asks for at least one): each needs a table worked with, not recalled. Q5 IS THE LINK THE WHOLE UNIT HAS BEEN BUILDING TO: the rule you find from a table of areas and the bracket you expand from the shape are the same expression. Ask them to say the check out loud.\n\n'
  + 'THE HOOK WAS SETTLED IN THE I DOs (A in the first, B and C in the second). DO NOW Q6 WAS SETTLED IN I DO 1 (area is width × length).\n\n'
  + 'THE CLOSING LINE REPEATS THE BANNER AND ADDS THE CHECK. TEMPLATE.md asks for what the NEXT lesson does, and the next lesson is not known, so it is not guessed: CHANGE THIS LINE once you have decided it. A natural next step is solving equations (the area of a garden is 32 m²: what is x?), which would use every check done this unit as the way to know an answer is right.'
);

K.finish();

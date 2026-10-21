/**
 * Expressions From Shapes And Prices (8CN, Lesson 8): the worksheet data and the answers, in ONE place. The
 * answers are printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide), and the
 * worksheet reads its shapes, prices and tables from the same constants, so the sheet and the answers cannot
 * disagree. build/shapes-and-prices-check.py then re-derives EVERY expression below with sympy (it sums the
 * sides, expands the brackets, fits every table) and compares it with the string typed here.
 *
 * Expressions are written with the same characters as the slides: "x", "×", "−" (a real minus), and a space on
 * each side of + and −.
 */
const SHAPES = {
  // Bronze
  bw:  { name: 'triangle',  sides: ['x + 1', 'x + 1', '2x'],                ans: '4x + 2',   chk: 3 },
  b1:  { name: 'rectangle', sides: ['x + 2', '3x', 'x + 2', '3x'],          ans: '8x + 4',   chk: 2 },
  b2:  { name: 'square',    side: '2x + 3', n: 4,                           ans: '8x + 12',  chk: 1 },
  // Silver
  sw:  { name: 'rectangle', sides: ['2x + 1', 'x + 4', '2x + 1', 'x + 4'],  ans: '6x + 10',  chk: 2 },
  s7:  { name: 'triangle',  sides: ['3x + 2', 'x − 1', '2x + 5'],           ans: '6x + 6',   chk: 3 },
  s8:  { name: 'pentagon',  sides: ['x', 'x + 2', '2x − 1', 'x + 2', '2x − 1'], ans: '7x + 2', chk: 3 },
  // Gold
  gw:  { name: 'hexagon',   side: '2x − 1', n: 6,                           ans: '12x − 6',  chk: 2 },
  g14: { name: 'triangle',  sides: ['2x + 3', '2x + 3', 'x − 1'],           ans: '5x + 5',   chk: 3 },
  g15: { name: 'L-shape',   sides: ['3x + 2', 'x + 2', 'x', '2', '2x + 2', 'x + 4'], ans: '8x + 12', chk: 3 },
};
// The rectangle that surrounds the L-shape (Gold Q15 part b): 3x + 2 by x + 4
const L_BOX = { sides: ['3x + 2', 'x + 4', '3x + 2', 'x + 4'], ans: '8x + 12' };

const COST = {
  b3:  { text: '3 bottles of juice at x pence each and a 50p sandwich', parts: ['3x', '50'],           ans: '3x + 50',     chk: 20 },
  s9:  { text: '3 sandwiches at s pounds each and 2 drinks, each £2 cheaper than a sandwich', parts: ['3s', '2(s − 2)'], ans: '5s − 4', chk: 5 },
  g16: { text: 'a £15 joining fee and £8 for each month', parts: ['8x', '15'],                          ans: '8x + 15',     chk: 4 },
};
const AGES = {
  b4:  { text: 'Ravi is r. His sister is 3 years older.', parts: ['r', 'r + 3'],                         ans: '2r + 3',      chk: 10 },
  s10: { text: 'Ana is a. Her sister is twice her age. Her mum is 25 years older than Ana.', parts: ['a', '2a', 'a + 25'], ans: '4a + 25', chk: 10 },
};

const T = {
  b5:  { x: [1, 2, 3],       y: [6, 8, 10] },        // Bronze 5:  taxi, £2 a km and £4 fixed:  y = 2x + 4
  s11: { x: [2, 4, 6, 8],    y: [9, 15, 21, 27] },   // Silver 11: y = 3x + 3, step 2 in x
  s13: { x: [1, 2, 3],       y: [10, 13, 16] },      // Silver 13: y = 3x + 7 (the student wrote 3x + 10)
  g16: { x: [1, 2, 3],       y: [23, 31, 39] },      // Gold 16:   gym, y = 8x + 15
  g17a: { x: [1, 2, 3, 4],   y: [5, 7, 9, 11] },     // Gold 17:   Firm A, £3 + £2 a km
  g17b: { x: [1, 2, 3, 4],   y: [6, 7, 8, 9] },      //            Firm B, £5 + £1 a km
  tx:  { x: [1, 2, 3],       y: [8, 10, 12] },       // the lesson's taxi (Do Now 6, We Do 3): y = 2x + 6
};
const RULE = { b5: 'y = 2x + 4', s11: 'y = 3x + 3', s13: 'y = 3x + 7', g16: 'y = 8x + 15', g17a: 'y = 2x + 3', g17b: 'y = x + 5', tx: 'y = 2x + 6' };
const STUDENT = { b6: '2x + 7', b6ans: '2x + 10', s13: 'y = 3x + 10', g19: '12x + 8' };

/** Sum the lengths by hand, for a check line: only used with a number put in, so it is plain arithmetic. */
const at = (s, v) => {
  const e = s.replace(/−/g, '-').replace(/(\d)([a-z])/g, '$1*$2').replace(/(\d)\(/g, '$1*(').replace(/[a-z]/g, `(${v})`);
  return Function(`"use strict"; return (${e});`)();
};
const sum = (sides, v) => sides.reduce((a, s) => a + at(s, v), 0);

const A = {
  1: `x terms: x + 3x + x + 3x = 8x. Numbers: 2 + 2 = 4. Perimeter = ${SHAPES.b1.ans}. Check x = 2: the sides are 4 and 6, so 4 + 6 + 4 + 6 = ${sum(SHAPES.b1.sides, 2)}, and 8 × 2 + 4 = ${at(SHAPES.b1.ans.replace('8x', '8*x'), 2)}.`,
  2: `4(2x + 3) = 8x + 12. Check x = 1: the side is 5, so 4 × 5 = 20, and 8 + 12 = 20.`,
  3: `3 bottles cost 3 × x = 3x. Add the sandwich: 3x + 50.`,
  4: `Ravi is r and his sister is r + 3, so r + (r + 3) = 2r + 3.`,
  5: `6, 8, 10. y goes up by 2 each km, so the multiplier is 2. 2 × 1 = 2, but y is 6, so add 4. y = 2x + 4. The 4 is the fixed charge: the fare for 0 km, before the taxi has gone anywhere.`,
  6: `The student counted the 3 only once. The sides are x + 2, 3, x + 2 and 3, so (x + 2) + 3 + (x + 2) + 3 = 2x + 10. The student's 2x + 7 has one 3 missing.`,
  7: `(3x + 2) + (x − 1) + (2x + 5): x terms 3x + x + 2x = 6x, numbers 2 − 1 + 5 = 6. Perimeter = 6x + 6. Check x = 3: the sides are 11, 2 and 11, so ${sum(SHAPES.s7.sides, 3)}, and 6 × 3 + 6 = 24.`,
  8: `x + (x + 2) + (2x − 1) + (x + 2) + (2x − 1): x terms 7x, numbers 2 − 1 + 2 − 1 = 2. Perimeter = 7x + 2. Check x = 3: the sides are 3, 5, 5, 5 and 5, so ${sum(SHAPES.s8.sides, 3)}, and 7 × 3 + 2 = 23.`,
  9: `3 sandwiches cost 3s. A drink costs s − 2, so 2 drinks cost 2(s − 2) = 2s − 4. Total 3s + 2s − 4 = 5s − 4. Check s = 5: 15 + 6 = 21, and 5 × 5 − 4 = 21.`,
  10: `Ana is a. Her sister is 2a. Her mum is a + 25. Total a + 2a + (a + 25) = 4a + 25. Check a = 10: 10 + 20 + 35 = 65, and 4 × 10 + 25 = 65.`,
  11: `y goes up by 6 when x goes up by 2, so by 3 for each 1: the multiplier is 3. 3 × 2 = 6, but y is 9, so add 3. y = 3x + 3. When x = 0: go back from x = 2 to x = 0, so y goes down by 6, and 9 − 6 = 3. y = 3.`,
  12: `Put x = 0 into y = 2x + 6: 2 × 0 + 6 = 6. The 2x part is 0 when x is 0, so only the 6 is left. In the table, going back one step from x = 1 (y = 8) to x = 0 takes away 2, which gives 6. The number added is what you start with, before any x.`,
  13: `3 × 2 + 10 = 16, not 13, so the student's rule fails the second pair. The student used the first y (10) as the number added. The multiplier is 3, 3 × 1 = 3, and 10 − 3 = 7. y = 3x + 7. Check x = 3: 3 × 3 + 7 = 16.`,
  14: `2(2x + 3) + (x − 1) = 4x + 6 + x − 1 = 5x + 5. Check x = 3: the sides are 9, 9 and 2, so ${sum(SHAPES.g14.sides, 3)}, and 5 × 3 + 5 = 20.`,
  15: `(a) (3x + 2) + (x + 2) + x + 2 + (2x + 2) + (x + 4): x terms 8x, numbers 2 + 2 + 2 + 2 + 4 = 12. Perimeter = 8x + 12. Check x = 3: 11 + 5 + 3 + 2 + 8 + 7 = ${sum(SHAPES.g15.sides, 3)}, and 8 × 3 + 12 = 36. (b) 2(3x + 2) + 2(x + 4) = 6x + 4 + 2x + 8 = 8x + 12. It is the same: the L-shape has the same perimeter as the rectangle around it.`,
  16: `8x + 15. The table is 23, 31, 39: y goes up by 8, 8 × 1 = 8, and 23 − 8 = 15, so y = 8x + 15. It matches. The 15 is the joining fee: what you pay for 0 months.`,
  17: `Firm A: 2x + 3. Firm B: x + 5. At 1 km A costs £5 and B costs £6, so A is cheaper. At 2 km both cost £7. At 4 km A costs £11 and B costs £9, so B is cheaper.`,
  18: `Any real example in your own words with a fixed part and a part that grows with x: a phone plan, a gym, a delivery charge, a taxi. Say what the multiplier is and what the fixed number is.`,
  19: `(12x + 8) ÷ 4 = 3x + 2. Check x = 1: the side is 5, 4 × 5 = 20, and 12 + 8 = 20.`,
};

module.exports = Object.entries(A);
Object.assign(module.exports, { SHAPES, L_BOX, COST, AGES, T, RULE, STUDENT, at, sum, A });

/**
 * Area With A Bracket (8CN, Lesson 9): the worksheet data and the answers, in ONE place. The answers are printed
 * UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide), and the worksheet reads its
 * rectangles, brackets and tables from the same constants, so the sheet and the answers cannot disagree.
 * build/area-with-a-bracket-check.py then re-derives EVERY expression below with sympy (it multiplies the sides,
 * expands the brackets, adds the sides for a perimeter, fits every table) and compares it with the string typed here.
 *
 * Expressions use the same characters as the slides: "x", "×", "−" (a real minus), a space round + and −.
 */
// A rectangle with one side that is a bracket: area = w × (len). unit is the area unit.
const AREA = {
  bw:  { w: '3', len: 'x + 6',  ans: '3x + 18',  chk: 2, unit: 'cm²' },   // Bronze worked
  b1:  { w: '2', len: 'x + 7',  ans: '2x + 14',  chk: 3, unit: 'cm²' },
  b3:  { w: '5', len: 'x + 1',  ans: '5x + 5',   chk: 2, unit: 'm²'  },
  sw:  { w: '5', len: 'x − 3',  ans: '5x − 15',  chk: 6, unit: 'm²'  },   // Silver worked
  s7:  { w: '4', len: 'x − 2',  ans: '4x − 8',   chk: 5, unit: 'cm²' },
  gw:  { w: 'x', len: 'x + 4',  ans: 'x² + 4x',  chk: 3, unit: 'm²'  },   // Gold worked: a letter outside
  g14: { w: 'x', len: 'x + 7',  ans: 'x² + 7x',  chk: 2, unit: 'm²'  },
};
// Perimeter AND area of one rectangle (the two told apart)
const BOTH = {
  b4:  { a: '3',  b: 'x + 4',  per: '2x + 14',  area: '3x + 12',  chk: 3 },
  s9:  { a: '4',  b: '2x − 1', per: '4x + 6',   area: '8x − 4',   chk: 3 },
  g18: { a: 'x',  b: 'x + 5',  per: '4x + 10',  area: 'x² + 5x',  chk: 2 },
};
const EXPAND = {
  b2:   { expr: '4(x + 9)',   ans: '4x + 36' },
  b6:   { expr: '5(x + 2)',   ans: '5x + 10', wrong: '5x + 2' },
  s8a:  { expr: '6(2x + 1)',  ans: '12x + 6' },
  s8b:  { expr: '3(4x − 5)',  ans: '12x − 15' },
  g15:  { expr: '2x(3x − 1)', ans: '6x² − 2x', chk: 2 },
};
const BEDS = { a: '3(x + 2)', b: '3(x + 5)', ans: '6x + 21', chk: 2 };     // Silver Q10: two beds, one width
const REVERSE = { area: '3x + 12', w: '3', len: 'x + 4' };                  // Gold Q19: the length from the area
const S13 = { student: '2x + 14', real: '3x + 12' };                         // Silver Q13: the perimeter written as the area

// Tables of areas: width w, length x + c, so the area is w(x + c) = wx + wc
const T = {
  b5:  { x: [1, 2, 3],    y: [8, 10, 12],   w: 2, c: 3 },    // Bronze 5:  y = 2x + 6 = 2(x + 3)  (the table from last lesson, now an area)
  s11: { x: [2, 4, 6, 8], y: [12, 20, 28, 36], w: 4, c: 1 }, // Silver 11: y = 4x + 4 = 4(x + 1), x goes up by 2
  g16: { x: [1, 2, 3],    y: [18, 24, 30],  w: 6, c: 2 },    // Gold 16:   y = 6x + 12 = 6(x + 2)
};
const RULE = { b5: 'y = 2x + 6', s11: 'y = 4x + 4', g16: 'y = 6x + 12' };
const BRACKET = { b5: '2(x + 3)', s11: '4(x + 1)', g16: '6(x + 2)' };

const at = (s, v) => {
  const e = s.replace(/−/g, '-').replace(/²/g, '**2').replace(/(\d)([a-z])/g, '$1*$2').replace(/(\d|\))\(/g, '$1*(').replace(/([a-z])\(/g, '$1*(').replace(/(\d)([a-z])/g, '$1*$2').replace(/[a-z]/g, `(${v})`);
  return Function(`"use strict"; return (${e});`)();
};

const A = {
  1: `Area = width × length = 2(x + 7) = 2x + 14 cm². Check x = 3: the length is 10, so the area is 2 × 10 = ${at('2*(x + 7)', 3)}, and 2 × 3 + 14 = ${at('2*x + 14', 3)}.`,
  2: `4(x + 9) = 4 × x + 4 × 9 = 4x + 36.`,
  3: `Area = 5(x + 1) = 5x + 5 m². Check x = 2: the width is 3, so the area is 5 × 3 = ${at('5*(x + 1)', 2)}, and 5 × 2 + 5 = ${at('5*x + 5', 2)}.`,
  4: `(a) Perimeter = 2(3) + 2(x + 4) = 6 + 2x + 8 = 2x + 14. (b) Area = 3(x + 4) = 3x + 12. Check x = 3: the sides are 3 and 7, so the perimeter is 3 + 7 + 3 + 7 = ${at('2*x + 14', 3)} and the area is 3 × 7 = ${at('3*x + 12', 3)}. The perimeter adds, the area multiplies.`,
  5: `x = 1: 2 × (1 + 3) = 8. x = 2: 2 × 5 = 10. x = 3: 2 × 6 = 12, so the table is 8, 10, 12. y goes up by 2, so the multiplier is 2; 2 × 1 = 2, and 8 − 2 = 6, so y = 2x + 6. It is the same as 2(x + 3) expanded: 2 × x + 2 × 3. The rule from the table and the expanded bracket are the same expression.`,
  6: `The 5 has multiplied the x but not the 2. The 5 multiplies EVERY term inside the bracket: 5 × x = 5x and 5 × 2 = 10, so 5(x + 2) = 5x + 10. Check x = 1: 5 × 3 = 15, and 5 + 10 = 15 (the student's 5 + 2 = 7 does not match).`,
  7: `Area = 4(x − 2) = 4x − 8 cm². Check x = 5: the width is 3, so the area is 4 × 3 = ${at('4*(x - 2)', 5)}, and 4 × 5 − 8 = ${at('4*x - 8', 5)}.`,
  8: `6(2x + 1) = 12x + 6. 3(4x − 5) = 12x − 15 (3 × (−5) = −15).`,
  9: `(a) Perimeter = 2(4) + 2(2x − 1) = 8 + 4x − 2 = 4x + 6. (b) Area = 4(2x − 1) = 8x − 4. Check x = 3: the sides are 4 and 5, so the perimeter is 4 + 5 + 4 + 5 = ${at('4*x + 6', 3)} and the area is 4 × 5 = ${at('8*x - 4', 3)}.`,
  10: `3(x + 2) + 3(x + 5) = 3x + 6 + 3x + 15 = 6x + 21 m². Check x = 2: the beds are 3 × 4 = 12 and 3 × 7 = 21, so ${at('3*(x + 2) + 3*(x + 5)', 2)}, and 6 × 2 + 21 = ${at('6*x + 21', 2)}.`,
  11: `x = 2, 4, 6, 8 gives 4 × 3, 4 × 5, 4 × 7, 4 × 9 = 12, 20, 28, 36. y goes up by 8 when x goes up by 2, so by 4 for each 1: the multiplier is 4. 4 × 2 = 8, and 12 − 8 = 4, so y = 4x + 4. It is 4(x + 1) expanded: the same rule.`,
  12: `The rectangle splits into two smaller rectangles: one is 4 by x (area 4x) and the other is 4 by 5 (area 20). Both are 4 high, so both areas are 4 times something. If the 4 only multiplied the x, the 5-wide piece would be missing. The area is 4x + 20, so the 4 multiplies both terms.`,
  13: `The student has found the PERIMETER: 3 + (x + 4) + 3 + (x + 4) = 2x + 14. The area is width × length = 3(x + 4) = 3x + 12. Perimeter is the distance round (add the sides). Area is the space inside (multiply two sides).`,
  14: `x(x + 7) = x × x + x × 7 = x² + 7x m². Check x = 2: the length is 9, so the area is 2 × 9 = ${at('x*(x + 7)', 2)}, and 2 × 2 + 14 = ${at('x**2 + 7*x', 2)} (x² = 4, 7x = 14).`,
  15: `2x(3x − 1) = 2x × 3x + 2x × (−1) = 6x² − 2x. Check x = 2: 4 × 5 = ${at('2*x*(3*x - 1)', 2)}, and 6 × 4 − 4 = ${at('6*x**2 - 2*x', 2)}.`,
  16: `x = 1, 2, 3 gives 18, 24, 30. y goes up by 6, so ×6; 6 × 1 = 6 and 18 − 6 = 12, so y = 6x + 12. As a bracket: 6x + 12 = 6(x + 2). The rectangle is 6 by (x + 2). Check x = 3: 6 × 5 = 30.`,
  17: `Any real example in your own words where an area has one side that is a total: a floor or a wall to tile or paint, a garden bed, a poster with a border. Say what x stands for and why the length needs a bracket.`,
  18: `Perimeter = 2(x) + 2(x + 5) = 2x + 2x + 10 = 4x + 10. Area = x(x + 5) = x² + 5x. Check x = 2: the sides are 2 and 7, so the perimeter is ${at('4*x + 10', 2)} and the area is ${at('x**2 + 5*x', 2)}.`,
  19: `The area is width × length, so 3 × length = 3x + 12. Divide by 3: length = x + 4. Check: 3(x + 4) = 3x + 12.`,
};

module.exports = Object.entries(A);
Object.assign(module.exports, { AREA, BOTH, EXPAND, BEDS, REVERSE, S13, T, RULE, BRACKET, at, A });

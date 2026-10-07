/**
 * From A Table To A Rule: the worksheet answers, in ONE place. They are printed UPSIDE DOWN at the foot
 * of the worksheet's last page (there is no Answers slide), and the worksheet reads its tables from the
 * same constants, so the sheet and the answers cannot disagree. Every rule is FOUND here from the table
 * (not typed in), asserted to fit every pair, and then re-derived independently with sympy in
 * build/from-a-table-to-a-rule-check.py.
 */
const T = {
  bw:  { x: [1, 2, 3, 4], y: [6, 10, 14, 18] },        // Bronze worked:  y = 4x + 2
  b1:  { x: [1, 2, 3, 4], y: [4, 7, 10, 13] },         // Bronze 1:       y = 3x + 1
  b3:  { x: [1, 2, 3, 4], y: [3, 8, 13, 18] },         // Bronze 3:       y = 5x - 2
  sw:  { x: [2, 4, 6, 8], y: [5, 9, 13, 17] },         // Silver worked:  y = 2x + 1
  s6:  { x: [1, 3, 5, 7], y: [5, 11, 17, 23] },        // Silver 6:       y = 3x + 2
  s7:  { x: [2, 4, 6, 8], y: [11, 19, 27, 35] },       // Silver 7:       y = 4x + 3
  s9:  { x: [1, 2, 3], y: [9, 13, 17] },               // Silver 9:       y = 4x + 5
  gw:  { x: [1, 2, 3], y: [9, 12, 15] },               // Gold worked:    y = 3x + 6 = 3(x + 2)
  g10: { x: [1, 2, 3], y: [0, 4, 8] },                 // Gold 10:        y = 4x - 4 = 4(x - 1)
  g11: { x: [3, 5, 7, 9], y: [8, 14, 20, 26] },        // Gold 11:        y = 3x - 1
};

/** Find m and c in y = mx + c from the first two pairs, then CHECK every pair. */
function rule(t) {
  const m = (t.y[1] - t.y[0]) / (t.x[1] - t.x[0]);
  const c = t.y[0] - m * t.x[0];
  if (!Number.isInteger(m) || !Number.isInteger(c)) throw new Error(`not whole numbers: ${JSON.stringify(t)}`);
  t.x.forEach((x, i) => { if (m * x + c !== t.y[i]) throw new Error(`rule ${m}x + ${c} fails at x = ${x}: ${JSON.stringify(t)}`); });
  return { m, c, xStep: t.x[1] - t.x[0], yStep: t.y[1] - t.y[0] };
}
const fmt = ({ m, c }) => `y = ${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
const R = Object.fromEntries(Object.entries(T).map(([k, t]) => [k, rule(t)]));
const last = (t) => ({ x: t.x[t.x.length - 1], y: t.y[t.y.length - 1] });

const STUDENT = { m: 8, c: 1 };                  // Silver 9: found from the first pair only (8 x 1 + 1 = 9)
const S9_FAIL = STUDENT.m * T.s9.x[1] + STUDENT.c;   // 17, not 13
const BR = { m: 4, c: 3, x: 31 };
const REV = { m: 6, c: -5, y: 31 };              // Gold 14: y = 6x - 5, y = 31
const REV_X = (REV.y - REV.c) / REV.m;           // 6

module.exports = [
  ['1', `y goes up by ${R.b1.yStep}, so the multiplier is ${R.b1.m}. ${R.b1.m} × 1 = ${R.b1.m}, and y is ${T.b1.y[0]}, so add ${R.b1.c}. ${fmt(R.b1)}. Check x = 4: ${R.b1.m} × 4 + ${R.b1.c} = ${last(T.b1).y}.`],
  ['2', `Multiply by 5 first, then subtract 4: y = 5x − 4.`],
  ['3', `y goes up by ${R.b3.yStep}, so the multiplier is ${R.b3.m}. ${R.b3.m} × 1 = ${R.b3.m}, and y is ${T.b3.y[0]}, so subtract ${-R.b3.c}. ${fmt(R.b3)}. Check x = 4: ${R.b3.m} × 4 − ${-R.b3.c} = ${last(T.b3).y}.`],
  ['4', `5 × 6 + 2 = 30 + 2 = 32.`],
  ['5', `Yes. 3 × 5 + 2 = 15 + 2 = 17, and y is 17.`],
  ['6', `y goes up by ${R.s6.yStep} when x goes up by ${R.s6.xStep}, so by ${R.s6.yStep / R.s6.xStep} for each 1: the multiplier is ${R.s6.m}. ${R.s6.m} × 1 = ${R.s6.m}, and y is ${T.s6.y[0]}, so add ${R.s6.c}. ${fmt(R.s6)}.`],
  ['7', `y goes up by ${R.s7.yStep} when x goes up by ${R.s7.xStep}, so the multiplier is ${R.s7.yStep} ÷ ${R.s7.xStep} = ${R.s7.m}. ${R.s7.m} × 2 = ${R.s7.m * 2}, and y is ${T.s7.y[0]}, so add ${R.s7.c}. ${fmt(R.s7)}. Check x = 8: ${R.s7.m} × 8 + ${R.s7.c} = ${last(T.s7).y}.`],
  ['8', `Because the multiplier is how much y goes up for ONE step of x. Two steps of x make y go up by 4, so one step makes it go up by 4 ÷ 2 = 2.`],
  ['9', `No. ${STUDENT.m} × 2 + ${STUDENT.c} = ${S9_FAIL}, not ${T.s9.y[1]}. The student only used the first pair. The right rule is ${fmt(R.s9)}: y goes up by ${R.s9.yStep}, 4 × 1 = 4, and ${T.s9.y[0]} − 4 = ${R.s9.c}. Check x = 3: 4 × 3 + ${R.s9.c} = ${last(T.s9).y}.`],
  ['10', `y = 4x − 4. The table is x = 1, 2, 3 and y = 0, 4, 8. From the table: y goes up by ${R.g10.yStep}, so ×${R.g10.m}; ${R.g10.m} × 1 = ${R.g10.m} and y is 0, so subtract ${-R.g10.c}: ${fmt(R.g10)}. They agree, because expanding 4(x − 1) multiplies BOTH terms in the bracket by 4.`],
  ['11', `y goes up by ${R.g11.yStep} when x goes up by ${R.g11.xStep}, so the multiplier is ${R.g11.yStep} ÷ ${R.g11.xStep} = ${R.g11.m}. ${R.g11.m} × 3 = ${R.g11.m * 3}, and y is ${T.g11.y[0]}, so subtract ${-R.g11.c}. ${fmt(R.g11)}. Check x = 9: ${R.g11.m} × 9 − ${-R.g11.c} = ${last(T.g11).y}.`],
  ['12', `x = 1: 2(1 + 3) = 8 but 2 × 1 + 3 = 5. x = 2: 2(2 + 3) = 10 but 2 × 2 + 3 = 7. They give different values, so they are different rules. Expanding: 2(x + 3) = 2x + 6, and 6 is not 3.`],
  ['13', `Any real example in your own words with a fixed part and a part that grows with x: a taxi (a fixed charge plus a price for each kilometre), a phone plan, a gym. Say what the multiplier is and what the fixed number is.`],
  ['14', `Undo the last step first: ${REV.y} + 5 = ${REV.y - REV.c}, then ${REV.y - REV.c} ÷ 6 = ${REV_X}. x = ${REV_X}. Check: 6 × ${REV_X} − 5 = ${REV.m * REV_X + REV.c}.`],
];
Object.assign(module.exports, { T, R, fmt, last, S9_FAIL, STUDENT, REV, REV_X });

/**
 * How Prokaryotes Live: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const D = DATA.doubling;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', `${D.h1.minutes} ÷ ${D.h1.gen} = ${D.h1.divisions} divisions. 2 × 2 × 2 = ${D.h1.cells} bacteria.`],
  ['2', `80 min: 16. 100 min: 32. 120 min: 64. (The number doubles every 20 minutes.)`],
  ['3', 'One cell, no nucleus, very small, divide in two (binary fission), found in almost every habitat. (Any four, with very small given.)'],
  ['4', 'The DNA copies itself. The cell grows and the copies move apart. A new wall forms across the middle. The cell splits into two identical cells.'],
  ['5', 'Very small.'],
  ['6', `${D.h2_30.minutes} ÷ ${D.h2_30.gen} = ${D.h2_30.divisions} divisions. 2 × 2 × 2 × 2 = ${D.h2_30.cells} bacteria.`],
  ['7', `20 minutes: ${D.h3.minutes} ÷ ${D.h3.gen} = ${D.h3.divisions} divisions, 2^9 = ${D.h3.cells}. 30 minutes: ${D.h3_30.minutes} ÷ ${D.h3_30.gen} = ${D.h3_30.divisions} divisions, 2^6 = ${D.h3_30.cells}. ${D.h3.cells} − ${D.h3_30.cells} = ${D.h3.cells - D.h3_30.cells} more for the 20-minute bacterium.`],
  ['8', 'Each division turns every cell into two, so the number doubles each time. We multiply by 2 for each division. Adding 2 each time would be much too small.'],
  ['9', 'Food, space and other things they need run out, and waste builds up, so the cells stop dividing and die. (Any sensible reason.)'],
  ['10', 'Any real example: milk or food going off in the warm, a wound getting infected, a school bin, a pond going green. Say what you saw and why it spreads fast.'],
  ['11', `6 × 60 = 360 minutes. 360 ÷ 20 = ${D.h6.divisions} divisions. 2^${D.h6.divisions} = ${n(D.h6.cells)} bacteria.`],
  ['12', `4 × 60 = ${D.h4.minutes} minutes. ${D.h4.minutes} ÷ 20 = ${D.h4.divisions} divisions. 2^${D.h4.divisions} = ${n(D.h4.cells)} bacteria.`],
  ['13', `10 × 60 = ${D.h10.minutes} minutes. ${D.h10.minutes} ÷ 20 = ${D.h10.divisions} divisions. 2^${D.h10.divisions} = ${n(D.h10.cells)}, which is more than a billion (1,000,000,000).`],
  ['14', 'They are very small, so they reach tiny places. They divide fast, so a few become many. They live in almost every habitat, including hot springs, ice and rock. (Any three linked reasons.)'],
];
module.exports.DATA = DATA;

/**
 * Resultant Forces: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no
 * Answers slide). Every resultant here is the sum of the forces to the right (or up) minus the sum of the forces to the left (or down),
 * computed from the same data the worksheet prints, and re-derived independently in build/resultant-forces-check.py.
 */
const net = (plus, minus) => plus.reduce((a, b) => a + b, 0) - minus.reduce((a, b) => a + b, 0);
const D = {
  q3: { weight: 10, reaction: 10 },                                // Bronze 3: a book on a table
  q4: { right: [30], left: [20] },                                 // Bronze 4: push 30 N, friction 20 N
  q5: { right: [12, 9], left: [] },                                // Bronze 5: 12 N and 9 N, both to the right
  w:  { right: [60], left: [25, 15] },                             // Silver worked example
  q6: { right: [90], left: [30, 20] },                             // Silver 6: thrust 90 N, drag 30 N, friction 20 N
  q7: { right: [200], left: [150, 20] },                           // Silver 7: boat
  q9: { up: [45], down: [45] },                                    // Silver 9
  gw: { right: [80], resultant: 30 },                              // Gold worked example: 80 N right, X left, resultant 30 N right
  q10: { right: [70], resultant: 25 },                             // Gold 10
  q11: { up: [4200], down: [4000] },                               // Gold 11: a lift
  q13: { a: [6, 400], b: [5, 450] },                               // Gold 13: tug of war, people x newtons each
  q14: { mass: 5, g: 9.8, tension: 60 },                           // Gold 14
};
const R = {
  q4: net(D.q4.right, D.q4.left), q5: net(D.q5.right, D.q5.left), w: net(D.w.right, D.w.left), q6: net(D.q6.right, D.q6.left), q7: net(D.q7.right, D.q7.left),
  q9: net(D.q9.up, D.q9.down), gwX: D.gw.right[0] - D.gw.resultant, q10X: D.q10.right[0] - D.q10.resultant, q11: net(D.q11.up, D.q11.down),
  q13a: D.q13.a[0] * D.q13.a[1], q13b: D.q13.b[0] * D.q13.b[1],
};
R.q13 = R.q13a - R.q13b;
R.q14w = Math.round(D.q14.mass * D.q14.g * 10) / 10; R.q14 = Math.round((D.q14.tension - R.q14w) * 10) / 10;

module.exports = [
  ['1', 'Weight: non-contact. Tension: contact. Magnetic force: non-contact. (Friction, done for you: contact.)'],
  ['2', 'Air is made of particles. They touch the object and push on it as it moves, so air resistance is a contact force. You cannot see air, but it is there.'],
  ['3', `Two arrows from the book: weight, ${D.q3.weight} N, downwards, and the reaction force from the table, ${D.q3.reaction} N, upwards. They are the same length. The resultant is ${D.q3.weight} − ${D.q3.reaction} = 0 N.`],
  ['4', `${D.q4.right[0]} − ${D.q4.left[0]} = ${R.q4} N to the right (the way of the bigger force).`],
  ['5', `Both point the same way, so add: ${D.q5.right[0]} + ${D.q5.right[1]} = ${R.q5} N to the right.`],
  ['6', `Right: ${D.q6.right[0]} N. Left: ${D.q6.left[0]} + ${D.q6.left[1]} = ${D.q6.left[0] + D.q6.left[1]} N. ${D.q6.right[0]} − ${D.q6.left[0] + D.q6.left[1]} = ${R.q6} N to the right.`],
  ['7', `Right: ${D.q7.right[0]} N. Left: ${D.q7.left[0]} + ${D.q7.left[1]} = ${D.q7.left[0] + D.q7.left[1]} N. ${D.q7.right[0]} − ${D.q7.left[0] + D.q7.left[1]} = ${R.q7} N to the right.`],
  ['8', 'The resultant is the one force that has the same effect as all the forces together. A force to the left undoes part of a force to the right, so it takes away from it.'],
  ['9', `Resultant: ${D.q9.up[0]} − ${D.q9.down[0]} = 0 N, so the forces are balanced. The student is wrong: forces ARE acting (45 N up and 45 N down). It is the RESULTANT force that is zero, because they cancel.`],
  ['10', `${D.q10.right[0]} − X = ${D.q10.resultant}, so X = ${D.q10.right[0]} − ${D.q10.resultant} = ${R.q10X} N.`],
  ['11', `${D.q11.up[0]} − ${D.q11.down[0]} = ${R.q11} N upwards.`],
  ['12', 'Any real example in your own words. Balanced: a book on a table, a car at a steady speed on a flat road. Not balanced: a car speeding up, a ball falling. Name the forces and say which way each one acts.'],
  ['13', `Team A: ${D.q13.a[0]} × ${D.q13.a[1]} = ${R.q13a} N. Team B: ${D.q13.b[0]} × ${D.q13.b[1]} = ${R.q13b} N. ${R.q13a} − ${R.q13b} = ${R.q13} N towards team A.`],
  ['14', `Weight = ${D.q14.mass} × ${D.q14.g} = ${R.q14w} N downwards. Tension ${D.q14.tension} N upwards. ${D.q14.tension} − ${R.q14w} = ${R.q14} N upwards.`],
];
Object.assign(module.exports, { D, R });

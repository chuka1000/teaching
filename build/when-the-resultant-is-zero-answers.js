/**
 * When The Resultant Is Zero: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no
 * Answers slide). The numbers are the same data the worksheet prints and the free-body diagrams draw, and build/when-the-resultant-is-zero-check.py
 * re-derives them independently. At a steady speed (or at rest) the resultant is zero, so the forces one way equal the forces the other way.
 */
const D = {
  w:  { push: 30, friction: 30 },                                  // Bronze worked example: a box at a steady speed
  q3: { weight: 12, reaction: 12 },                                // Bronze 3: a book on a table
  q4: { right: [45], left: [25, 20] },                             // Bronze 4: the trolley at a steady speed (diagram)
  q5: { driving: 900 },                                            // Bronze 5: a car at a steady speed
  sw: { weight: 750 },                                             // Silver worked example: a skydiver at a steady speed
  q6: { right: [200], left: [150], unknown: 'X' },                 // Silver 6: the boat at a steady speed (diagram), find X
  gw: { speed: 3 },                                                // Gold worked example: a probe in deep space, 3 km/s
  q10: { before: 3, after: 8 },                                    // Gold 10: the probe speeds up, then the engine goes off
  q11: { mass: 500, g: 9.8 },                                      // Gold 11: a lift at a steady speed
  q13: { steady: 60, new: 85 },                                    // Gold 13: the push is increased
};
const R = {
  q3: D.q3.weight - D.q3.reaction,
  q4: D.q4.right.reduce((a, b) => a + b, 0) - D.q4.left.reduce((a, b) => a + b, 0),
  q5: D.q5.driving,
  q6X: D.q6.right[0] - D.q6.left[0],
  q10: D.q10.after,
  q11: Math.round(D.q11.mass * D.q11.g * 10) / 10,
  q13: D.q13.new - D.q13.steady,
};

module.exports = [
  ['1', 'rest. Constant speed. Straight line. Resultant. (An object stays at rest, or keeps moving at a constant speed in a straight line, unless a resultant force acts on it.)'],
  ['2', 'An object stays at rest, or keeps moving at a constant speed in a straight line, unless a resultant force acts on it.'],
  ['3', `Reaction force: ${D.q3.reaction} N, upwards (the same as the weight). Resultant: ${D.q3.weight} − ${D.q3.reaction} = ${R.q3} N. The book is at rest, so it stays at rest: nothing changes its motion.`],
  ['4', `Right: ${D.q4.right[0]} N. Left: ${D.q4.left[0]} + ${D.q4.left[1]} = ${D.q4.left[0] + D.q4.left[1]} N. Resultant: ${D.q4.right[0]} − ${D.q4.left[0] + D.q4.left[1]} = ${R.q4} N. The speed stays the same (it is steady).`],
  ['5', `${R.q5} N. A steady speed means the resultant is 0 N, so the total resistive force equals the driving force.`],
  ['6', `Steady speed, so the resultant is 0 N. Right: ${D.q6.right[0]} N. Left: ${D.q6.left[0]} + X. ${D.q6.right[0]} = ${D.q6.left[0]} + X, so X = ${D.q6.right[0]} − ${D.q6.left[0]} = ${R.q6X} N.`],
  ['7', 'A force acts on the puck: friction (and a little air resistance) pushes against its motion. There is a resultant force backwards, so the speed falls until it stops. Without friction it would keep going at a constant speed.'],
  ['8', 'The first law: with no resultant force the motion does not change. A steady speed is no change in motion, so there cannot be a resultant force. The forces are still there: they cancel.'],
  ['9', 'The student is wrong. The book is at rest because the forces on it cancel, not because there are none. Weight acts down and the reaction force from the table acts up. They are equal and opposite, so the resultant is zero.'],
  ['10', `Not zero while the engine is on (the speed changes). Zero after it switches off. It moves at ${R.q10} km/s in a straight line, for ever: nothing changes its motion.`],
  ['11', `Steady speed, so the resultant is zero and the tension equals the weight. Weight = ${D.q11.mass} × ${D.q11.g} = ${R.q11} N. Tension = ${R.q11} N, upwards.`],
  ['12', 'Any real example in your own words. Forces cancel: a car at a steady speed on a flat road (driving force = air resistance + friction), a book on a table, a skydiver at a steady speed. Name the forces and say which way each acts.'],
  ['13', `Before: the push equals the friction, ${D.q13.steady} N. Now: ${D.q13.new} − ${D.q13.steady} = ${R.q13} N forwards. The resultant is not zero, so the crate speeds up.`],
  ['14', 'A resultant of zero means the forces are there but they cancel (a book on a table: weight and reaction force). No forces at all means nothing pushes or pulls (a probe in deep space, far from everything). In both the motion does not change.'],
];
Object.assign(module.exports, { D, R });

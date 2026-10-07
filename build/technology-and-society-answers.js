/**
 * Technology And Society: the worksheet answers, in ONE place. They are printed UPSIDE DOWN at the
 * foot of the last page. A design task has no single right answer, so most entries say what a good
 * answer contains, with an example. The exact ones (the mean, the three directions) are checked in
 * build/technology-and-society-check.py.
 */
const DATA = require('./technology-and-society.data.json');
const B = (id) => DATA.briefs.find((b) => b.id === id);
const cyc = B('cyclist'), farm = B('farmer');
const statement = (b) => `${b.user} needs a way to ${b.need}, because ${b.reason}.`;
const SCORES = [3, 4, 2, 3];
const MEAN = SCORES.reduce((a, b) => a + b, 0) / SCORES.length;

module.exports = [
  ['1', '(b) A solution: it says how to fix it. (c) Too vague: it does not say who, or what is needed.'],
  ['2', `drivers who cannot see a cyclist may not stop in time. (Full sentence: "${statement(cyc)}")`],
  ['3', `Who has the problem, what they need (not the fix), and why. Example: "${statement(farm)}"`],
  ['4', 'If you name the fix too early you stop thinking of other ideas, and you cannot compare ideas fairly in step 2 of the design process.'],
  ['5', 'A sketch with at least three labelled parts, each with its job, that would really solve your problem from Q3.'],
  ['6', `(${SCORES.join(' + ')}) ÷ ${SCORES.length} = ${SCORES.reduce((a, b) => a + b, 0)} ÷ ${SCORES.length} = ${MEAN}. The mean is ${MEAN}, which is more than 2, so the design does not yet work and needs improving.`],
  ['7', `Repeat 3 times with the same driver and the same road, and keep the same lighting. It works if the mean distance at which the driver sees the cyclist is above a number you choose, for example 100 m. (The measure is ${cyc.measure}.)`],
  ['8', 'Five parts: how you will test it; what you will measure, with a unit; how many times (at least 3); what stays the same; what result means it works, with a number.'],
  ['9', 'It names a feature and says how it meets the rule. Example for "made mostly from recycled materials": the body is a used plastic bottle and the strap is an old belt.'],
  ['10', 'How society changed: people can bank, read the news and call from almost anywhere. Society\'s response: governments wrote new rules for mobile banking.'],
  ['11', 'Say what failed and the one change: for example, cover it with a waterproof layer. Then test again in the rain with the same plan, 3 times.'],
  ['12', 'A specific person helped, a specific person who might be harmed or left out (for example, someone who cannot afford it, or a worker whose job changes), and one change to daily life.'],
  ['13', 'Any real example in your own words: a technology you use, the problem it solves, and one way it changed life or one way society changed it.'],
];
module.exports.statement = statement; module.exports.SCORES = SCORES; module.exports.MEAN = MEAN;

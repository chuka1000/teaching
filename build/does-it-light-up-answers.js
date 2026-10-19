/**
 * Does It Light Up? (T3, Unit 8 Lesson 3, Friday 6 November, P7): every answer in the lesson, in ONE place. The deck's answer
 * chips and notes, the worksheet and the upside-down answers at its foot all read this module.
 * What each thing IS comes from build/periodic-words.js. The results are what a normal school circuit board gives with these
 * samples: the metals light the bulb, sulfur does not, and the pencil lead (graphite, a form of carbon) does, which is the
 * one exception the lesson shows.
 */
const { name, cls, symbolOf, EL, capital } = require('./periodic-words');

/** The five things tested, in the order the lesson meets them: [picture key]. Element names come from the table. */
const TESTED = ['wire', 'nail', 'aluminium', 'sulfur', 'pencil'];
const element = (k) => EL[symbolOf(k)].name;
const conducts = (k) => EL[symbolOf(k)].conducts;
const on = (k) => (conducts(k) ? 'ON' : 'OFF');
const say = (k) => `${capital(element(k))} ${conducts(k) ? 'conducts' : 'does not conduct'} electricity.`;

/** Slide 3: yesterday, picture first. [picture, word or sentence]. Row 1 are samples, row 2 are words. */
const REMEMBER = [['copper', 'copper'], ['carbon', 'carbon'], ['sulfur', 'sulfur'], ['silicon', 'silicon'], ['iron', 'iron'],
  ['gold', 'metal'], ['helium', 'non-metal'], ['aluminium', 'shiny'], ['rock', 'hard'], ['teddy', 'soft']];
const REMEMBER_SENTENCE = {
  copper: 'This is copper. It is a metal. It is shiny.', carbon: 'This is carbon. It is a non-metal. It is not shiny.',
  sulfur: 'This is sulfur. It is a non-metal. It is not shiny.', silicon: 'This is silicon. It is a non-metal. It is shiny.',
  iron: 'This is iron. It is a metal. It is hard.',
};

/** Slide 7: predict. Hands: thumbs up (yes, it lights up) or thumbs down. No answers on this slide: the test gives them. */
const PREDICT = TESTED;

/** Slide 9: the test. Results the teacher checks against the class's own boards (notes). */
const RESULTS = TESTED.map((k) => ({ key: k, on: conducts(k), chip: on(k), say: say(k) }));

/** Worksheet. A: predict, test, record (the results table). B: finish the sentence. C: sort the five names. */
const SHEET_A = TESTED;
const SHEET_B = ['wire', 'sulfur', 'nail', 'pencil'];
const SHEET_C = TESTED;
const BANK = ['conducts', 'does not conduct', 'electricity', 'bulb', 'circuit', 'ON', 'OFF'];

const ANSWERS = [
  ...SHEET_A.map((k, i) => [`A${i + 1}`, `${name(k)}: bulb ${on(k)}`]),
  ...SHEET_B.map((k, i) => [`B${i + 1}`, `${capital(element(k))} ${conducts(k) ? 'conducts' : 'does not conduct'} electricity.`]),
  ['C', `conducts electricity: ${SHEET_C.filter(conducts).map(element).join(', ')}.  does not conduct: ${SHEET_C.filter((k) => !conducts(k)).map(element).join(', ')}.`],
];

module.exports = ANSWERS;
Object.assign(module.exports, { TESTED, REMEMBER, REMEMBER_SENTENCE, PREDICT, RESULTS, SHEET_A, SHEET_B, SHEET_C, BANK, element, conducts, on, say, name, cls });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));

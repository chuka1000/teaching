/**
 * Metal Or Non-Metal (T3, Unit 8 Lesson 2, Thursday 5 November): every answer in the lesson, in ONE place. The deck's answer
 * chips and notes, the worksheet and the upside-down answers at its foot all read this module.
 * What each thing IS (its element, metal or non-metal) comes from build/periodic-words.js.
 */
const { name, cls, symbolOf, EL, capital } = require('./periodic-words');

/** Slide 3: Lesson 1, picture first. [picture, word]. The pictures are the ones the class saw on 9 October. */
const REMEMBER = [['atom', 'atom'], ['tile_Au', 'element'], ['tile_Fe', 'symbol'], ['gold', 'metal'], ['helium', 'gas'],
  ['tile_He', 'He'], ['tile_O', 'O'], ['tile_Fe', 'Fe'], ['tile_Cu', 'Cu'], ['tile_Au', 'Au']];
const REMEMBER_SENTENCE = { He: 'Helium is a gas. Its symbol is He.', O: 'Oxygen is a gas. Its symbol is O.', Fe: 'Iron is a metal. Its symbol is Fe.', Cu: 'Copper is a metal. Its symbol is Cu.', Au: 'Gold is a metal. Its symbol is Au.' };

/** The four samples of the sealed vials, in the order the lesson meets them. */
const SAMPLES = ['copper', 'carbon', 'sulfur', 'silicon'];
const sentence = (k) => {
  const e = EL[symbolOf(k)];
  const a = e.cls === 'metal' ? 'a metal' : 'a non-metal';
  return `This is ${e.name}. It is ${a}. It is ${e.look}.`;
};
const short = (k) => `This is ${name(k)}. It is ${cls(k) === 'metal' ? 'a metal' : 'a non-metal'}.`;

/** Slide 8, yes or no. `key` is the picture; the question and the answer both come from here. */
const YES_NO = [
  { key: 'copper', q: 'Is copper a metal?', yes: true, say: 'Yes. Copper is a metal.' },
  { key: 'sulfur', q: 'Is sulfur a metal?', yes: false, say: 'No. Sulfur is a non-metal.' },
  { key: 'silicon', q: 'Is silicon shiny?', yes: true, say: 'Yes. Silicon is shiny.' },
  { key: 'iron', q: 'Is iron hard?', yes: true, say: 'Yes. Iron is hard.' },
  { key: 'gold', q: 'Is gold a non-metal?', yes: false, say: 'No. Gold is a metal.' },
  { key: 'helium', q: 'Is helium a non-metal?', yes: true, say: 'Yes. Helium is a non-metal. It is a gas.' },
];

/** Slide 9, metal or non-metal? The order is mixed on purpose. */
const EITHER = ['sulfur', 'gold', 'silicon', 'iron', 'helium', 'carbon'].map((k) => ({ key: k, cls: cls(k), say: `${capital(name(k))} is ${cls(k) === 'metal' ? 'a metal' : 'a non-metal'}.` }));

/** Slide 10, open. The four samples, and what to say about each. */
const OPEN = SAMPLES.map((k) => ({ key: k, say: sentence(k) }));

/** Worksheet. A: look and write the name and circle metal or non-metal. B: shiny or not shiny. C: write the sentence. */
const SHEET_A = ['carbon', 'copper', 'silicon', 'sulfur'];
const SHEET_B = ['sulfur', 'silicon', 'copper', 'carbon'];
const SHEET_C = ['copper', 'sulfur'];
const BANK = ['copper', 'carbon', 'sulfur', 'silicon'];

const ANSWERS = [
  ...SHEET_A.map((k, i) => [`A${i + 1}`, `${name(k)}, ${cls(k)}`]),
  ...SHEET_B.map((k, i) => [`B${i + 1}`, `${EL[symbolOf(k)].look}`]),
  ['C1', sentence('copper')],
  ['C2', sentence('sulfur')],
];

module.exports = ANSWERS;
Object.assign(module.exports, { REMEMBER, REMEMBER_SENTENCE, SAMPLES, YES_NO, EITHER, OPEN, SHEET_A, SHEET_B, SHEET_C, BANK, sentence, short, name, cls });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));

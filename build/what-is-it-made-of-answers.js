/**
 * What Is It Made Of? (T3, Unit 8 Lessons 4 and 5, THE DOUBLE, Tuesday 10 November): every answer in the lesson, in ONE place.
 * The deck's answer chips and notes, both worksheet pages and the upside-down answers at the foot of the second all read this
 * module. What each thing IS (its element, metal or not) comes from build/periodic-words.js.
 *
 * Solids are "made of" an element; a gas in a container is "full of" it ("A tank is full of oxygen"). Both are in the frame.
 */
const { name, cls, symbolOf, EL, capital } = require('./periodic-words');

/** What an object is called on the slides: short, so the frame reads "A nail is made of iron." */
const OBJ = { nail: 'nail', pan: 'pan', ring: 'ring', wire: 'wire', tank: 'tank', balloons: 'balloon' };
const objName = (k) => OBJ[k];
const element = (k) => EL[symbolOf(k)].name;
const isGas = (k) => EL[symbolOf(k)].form === 'gas';
const verb = (k) => (isGas(k) ? 'is full of' : 'is made of');
const sentence = (k) => `A ${objName(k)} ${verb(k)} ${element(k)}.`;
const withClass = (k) => `${sentence(k)} ${capital(element(k))} is ${EL[symbolOf(k)].cls === 'metal' ? 'a metal' : 'a non-metal'}.`;
/** The chip colour class: a metal is blue, a gas is green (the table's colours). */
const chipClass = (k) => (isGas(k) ? 'gas' : 'metal');

/** Slide 3, Lessons 2 and 3: picture first. [picture, word]. */
const REMEMBER = [['gold', 'metal'], ['helium', 'non-metal'], ['aluminium', 'shiny'], ['rock', 'hard'], ['teddy', 'soft'],
  ['lightning', 'electricity'], ['bulb', 'bulb'], ['circuit_gap', 'circuit'], ['circuit_on', 'conduct'], ['tile_Fe', 'symbol']];

/** Slide 5, look and say: six objects, each made of or full of an element. */
const OBJECTS = ['nail', 'ring', 'wire', 'pan', 'tank', 'balloons'];

/** Slide 6, yes or no. */
const YES_NO = [
  { key: 'nail', q: 'Is a nail made of iron?', yes: true, say: 'Yes. A nail is made of iron.' },
  { key: 'ring', q: 'Is a ring made of iron?', yes: false, say: 'No. A ring is made of gold.' },
  { key: 'wire', q: 'Is a wire made of copper?', yes: true, say: 'Yes. A wire is made of copper.' },
  { key: 'pan', q: 'Is a pan made of gold?', yes: false, say: 'No. A pan is made of iron.' },
  { key: 'tank', q: 'Is a tank full of oxygen?', yes: true, say: 'Yes. A tank is full of oxygen.' },
  { key: 'balloons', q: 'Is a balloon full of oxygen?', yes: false, say: 'No. A balloon is full of helium.' },
];

/** Slide 7, either/or: "Iron or gold?" The order is mixed on purpose. */
const EITHER = ['ring', 'tank', 'nail', 'wire', 'balloons', 'pan'].map((k) => ({ key: k, element: element(k), cls: chipClass(k), say: sentence(k) }));

/** Slide 8, open: "What is it made of?" Solids only: the gases have their own frame. */
const OPEN = ['pan', 'wire', 'ring', 'nail'].map((k) => ({ key: k, say: withClass(k) }));

/** Slide 9, sort: by what they are made of. Each box is an element (or the two gases together). Two things in each. */
const SORT = [
  { head: 'iron', tiles: ['Fe'], items: ['nail', 'pan'] },
  { head: 'gold', tiles: ['Au'], items: ['ring', 'gold'] },
  { head: 'gas', tiles: ['O', 'He'], items: ['tank', 'balloons'] },
];
const SORT_POOL = ['ring', 'tank', 'nail', 'gold', 'balloons', 'pan'];

/** Worksheet page 1. A: the frame from a picture. B: put each thing in its box. C: right or wrong. */
const SHEET_A = ['nail', 'ring', 'wire', 'tank'];
const SHEET_B = ['pan', 'balloons', 'ring', 'nail', 'tank', 'wire'];
const SHEET_B_BOXES = ['iron', 'gold', 'copper', 'gas'];
const boxOf = (k) => (isGas(k) ? 'gas' : element(k));
const SHEET_C = [{ key: 'pan', text: 'A pan is made of iron.', right: true }, { key: 'ring', text: 'A ring is made of copper.', right: false }, { key: 'balloons', text: 'A balloon is full of helium.', right: true }];

/** Worksheet page 2, after the break: describe the four samples (the oral check's four). */
const SAMPLES = ['copper', 'carbon', 'sulfur', 'silicon'];
const describe = (k) => {
  const e = EL[symbolOf(k)];
  return `This is ${e.name}. It is ${e.cls === 'metal' ? 'a metal' : 'a non-metal'}. It is ${e.look}.`;
};

const ANSWERS = [
  ...SHEET_A.map((k, i) => [`A${i + 1}`, sentence(k)]),
  ...SHEET_B.map((k, i) => [`B${i + 1}`, `${objName(k)}: ${boxOf(k)}`]),
  ...SHEET_C.map((r, i) => [`C${i + 1}`, `${r.right ? 'Right' : 'Wrong'}${r.right ? '' : `: ${sentence(r.key)}`}`]),
  ...SAMPLES.map((k, i) => [`D${i + 1}`, describe(k)]),
];

module.exports = ANSWERS;
Object.assign(module.exports, { OBJ, objName, element, isGas, verb, sentence, withClass, chipClass, REMEMBER, OBJECTS, YES_NO, EITHER, OPEN, SORT, SORT_POOL, SHEET_A, SHEET_B, SHEET_B_BOXES, boxOf, SHEET_C, SAMPLES, describe, name, cls });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));

/**
 * Why Is It Living? (T3, Unit 4 Lessons 4 and 5, the Tuesday double): every answer in the deck, in ONE place. The deck's
 * answer chips and notes, the worksheet and the upside-down answers at its foot all read this module.
 * What each thing IS comes from build/living-things-words.js.
 *
 * The reasons a thing is living are the unit's own verbs, in the third person: grows, eats, changes, needs water / food /
 * air. The reasons a thing is non-living are the same with "does not". Nothing else counts as a reason in this unit.
 * "It moves" is NOT a reason: the car, the robot and the kite all move (Lesson 1).
 */
const { name, kind, article } = require('./living-things-words');
const A = (k) => (article(k) === 'an' ? 'An' : 'A');

/** Slide 3: all ten unit words, picture first. [picture, word]. */
const REMEMBER = [['dog', 'living'], ['rock', 'non-living'], ['tree', 'plant'], ['cat', 'animal'], ['watering', 'need'],
  ['food', 'food'], ['water', 'water'], ['air', 'air'], ['puppy', 'grow'], ['caterpillar', 'change']];

/** Slide 5: the teacher builds three sentences, chunk by chunk. */
const MODEL = [
  ['dog', ['A dog', 'is living', 'because', 'it grows.']],
  ['grazing', ['A cow', 'is living', 'because', 'it eats.']],
  ['rock', ['A rock', 'is non-living', 'because', 'it does not eat.']],
];

/** Slide 6, yes or no: is the sentence right? */
const RIGHT = [
  ['dog', 'A dog is living because it grows.', true],
  ['rock', 'A rock is living because it eats.', false],
  ['tree', 'A tree is living because it needs water.', true],
  ['car', 'A car is living because it moves.', false],
  ['cat', 'A cat is non-living because it eats.', false],
  ['phone', 'A phone is non-living because it does not grow.', true],
].map(([key, say, yes]) => ({ key, say, yes }));

/** Slide 7, either/or: grows or does not grow? */
const EITHER = ['horse', 'ball', 'flower', 'robot', 'bird', 'teddy', 'fish', 'kite'].map((k) => ({
  key: k, living: kind(k) === 'living', say: `${A(k)} ${name(k)} is ${kind(k)} because it ${kind(k) === 'living' ? 'grows' : 'does not grow'}.`,
}));

/** Slide 8, open: why? Two good answers for each, for the notes and the click. */
const OPEN = [
  ['cow', ['it eats.', 'it needs water.']],
  ['cactus', ['it grows.', 'it needs water.']],
  ['bicycle', ['it does not grow.', 'it does not eat.']],
  ['butterfly', ['it changes.', 'it needs food.']],
].map(([key, why]) => ({ key, why, say: why.map((w) => `${A(key)} ${name(key)} is ${kind(key)} because ${w}`) }));

/** Slide 16, rehearsal for Thursday: one item in each of the paper's formats. */
const REHEARSE = {
  yesNo: { key: 'snail', q: 'Is a snail living?', a: 'Yes' },
  either: { key: 'clock', q: 'A clock is living / non-living.', a: 'non-living' },
  because: { key: 'frog', q: 'A frog is living because it ______.', a: 'grows (or eats, changes, needs water, food or air)' },
  sort: ['cup', 'ant', 'sunflower', 'pencil'],
};

/** Worksheet, part 1. A: complete with grows / does not grow. B: write the because sentence. C: right or wrong? */
const SHEET_A = ['cat', 'rock', 'cactus', 'chair'].map((k) => ({ key: k, pre: `${A(k)} ${name(k)} is ${kind(k)} because it `, gap: kind(k) === 'living' ? 'grows' : 'does not grow' }));
const SHEET_B = ['horse', 'phone', 'butterfly'].map((k) => ({ key: k, living: kind(k) === 'living' }));
const SHEET_C = [
  ['frog', 'A frog is living because it grows.', true],
  ['kite', 'A kite is living because it moves.', false],
  ['flower', 'A flower is non-living because it needs water.', false],
].map(([key, say, yes]) => ({ key, say, yes }));

const ANSWERS = [
  ...SHEET_A.map((r, i) => [`A${i + 1}`, `${r.pre}${r.gap}.`]),
  ...SHEET_B.map((r, i) => [`B${i + 1}`, `${A(r.key)} ${name(r.key)} is ${kind(r.key)} because it ${r.living ? 'grows' : 'does not grow'}. Also right: ${r.living ? 'eats, changes, needs water / food / air' : 'does not eat, does not need water / food / air'}.`]),
  ...SHEET_C.map((r, i) => [`C${i + 1}`, r.yes ? 'Right.' : `Wrong. ${A(r.key)} ${name(r.key)} is ${kind(r.key)} because it ${kind(r.key) === 'living' ? 'grows' : 'does not grow'}.`]),
  ['Hunt', 'Anything true. Living: people, plants, insects. Non-living: desks, pens, bags, the window. A wooden desk is non-living now.'],
];

module.exports = ANSWERS;
Object.assign(module.exports, { REMEMBER, MODEL, RIGHT, EITHER, OPEN, REHEARSE, SHEET_A, SHEET_B, SHEET_C, A, name, kind });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(5), a));

/**
 * What Living Things Need (T3, Unit 4 Lesson 2): every answer in the lesson, in ONE place. The deck's answer chips and
 * notes, the worksheet and the upside-down answers at its foot all read this module.
 * What each thing IS (living or not, plant or animal) comes from build/living-things-words.js.
 */
const { name, kind } = require('./living-things-words');

/** Slide 3: the four Lesson 1 words, with the SAME picture sets as Lesson 1 (build/living-or-non-living-answers.js). */
const L1 = require('./living-or-non-living-answers');
const REMEMBER = ['living', 'non-living', 'plant', 'animal'].map((w) => [w, L1.WORDS[w]]);

/** Slide 4: sort again. Every one was on a Lesson 1 slide. */
const SORT_AGAIN = ['tree', 'robot', 'horse', 'book', 'cactus', 'kite', 'fish', 'clock'];

/** The three needs, and the new words' pictures. */
const NEEDS = ['food', 'water', 'air'];

/** Slide 6, the teacher's model sentences: [picture, sentence]. */
const MODEL = [
  ['watering', 'Plants need water.'],
  ['grazing', 'Animals need food.'],
  ['breathing', 'We need air.'],
];

/** Slide 7, yes or no: "Do ___ need ___?" [thing, need, question plural, answer]. Living things: yes. Non-living: no. */
const YES_NO = [
  ['flower', 'water', 'flowers'], ['rock', 'water', 'rocks'], ['dog', 'food', 'dogs'],
  ['car', 'food', 'cars'], ['cat', 'air', 'cats'], ['teddy', 'food', 'teddies'],
].map(([k, need, plural]) => ({ key: k, need, plural, yes: kind(k) === 'living' }));

/** Slide 8, either/or: [left, right]; the one that is food, water or air is the answer. */
const EITHER = [['water', 'phone'], ['ball', 'food'], ['air', 'book'], ['teddy', 'water'], ['food', 'chair'], ['kite', 'air']]
  .map(([a, b]) => ({ a, b, answer: NEEDS.includes(a) ? a : b }));

/** Slide 9, open: what do they need? Living things need all three; the robot is the one with no answer. */
const OPEN = ['cow', 'sunflower', 'bird', 'robot'];

/** Worksheet. A: write the word under each picture. B: living or non-living (retrieval). C: complete the sentence. */
const SHEET_A = ['water', 'air', 'food'];
const SHEET_B = ['horse', 'clock', 'cactus', 'kite', 'frog', 'teddy', 'flower', 'phone'];
const SHEET_C = [
  { key: 'watering', pre: 'Plants need ', gap: 'water', post: '.' },
  { key: 'grazing', pre: 'Animals need ', gap: 'food', post: '.' },
  { key: 'breathing', pre: 'We need ', gap: 'air', post: '.' },
  { key: 'cat', pre: 'Cats need ', gap: 'food', post: '.', accept: 'water, air' },
  { key: 'rock', pre: 'A rock is ', gap: kind('rock'), post: '.' },
  { key: ['dog', 'tree'], pre: 'Living things need food, ', gap: 'water', post: ' and air.' },
  { key: 'dog', whole: 'Dogs need food.', accept: 'Dogs need water. Dogs need air.' },
];

const sorted = (want) => SHEET_B.filter((k) => kind(k) === want).map(name).join(', ');
const ANSWERS = [
  ['A', SHEET_A.map((w, i) => `${i + 1} ${w}`).join('  ·  ')],
  ['B', `Living: ${sorted('living')}.  Non-living: ${sorted('non-living')}.`],
  ...SHEET_C.map((r, i) => [`C${i + 1}`, `${r.whole || `${r.pre}${r.gap}${r.post}`}${r.accept ? ` Also right: ${r.accept}` : ''}`]),
];

module.exports = ANSWERS;
Object.assign(module.exports, { REMEMBER, SORT_AGAIN, NEEDS, MODEL, YES_NO, EITHER, OPEN, SHEET_A, SHEET_B, SHEET_C, name, kind });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));

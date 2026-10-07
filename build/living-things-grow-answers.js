/**
 * Living Things Grow (T3, Unit 4 Lesson 3): every answer in the lesson, in ONE place. The deck's answer chips and notes,
 * the worksheet and the upside-down answers at its foot all read this module.
 * What each thing IS (living or not, plant or animal) comes from build/living-things-words.js.
 */
const { name, kind, article } = require('./living-things-words');

/** Slide 3: Lessons 1 and 2, picture first. [picture, word]. The pictures are the ones those lessons used. */
const REMEMBER = [['dog', 'living'], ['rock', 'non-living'], ['tree', 'plant'], ['cat', 'animal'],
  ['watering', 'need'], ['food', 'food'], ['water', 'water'], ['air', 'air']];

/** Slide 4: the new words, each with a pair of pictures: before and after. */
const GROW = ['puppy', 'dog'];
const CHANGE = ['caterpillar', 'butterfly'];

/** Slide 6: the teacher orders two sequences and says the frame. */
const MODEL = [
  { seq: ['seed', 'seedling', 'sunflower'], say: 'A seed grows into a plant.' },
  { seq: ['egg', 'chick', 'chicken'], say: 'A chick grows into a chicken.' },
];

/** Slide 7, yes or no: "Do ___ grow?" Living things grow; non-living things do not. */
const YES_NO = [['tree', 'trees'], ['rock', 'rocks'], ['puppy', 'puppies'], ['car', 'cars'], ['kitten', 'kittens'], ['ball', 'balls']]
  .map(([k, plural]) => ({ key: k, plural, yes: kind(k) === 'living' }));

/** Slide 8, which is first? Each pair is [young, grown]; `flip` shows it the wrong way round on the slide. */
const ORDER = [
  { young: 'tadpole', grown: 'frog', flip: true },
  { young: 'kitten', grown: 'cat', flip: false },
  { young: 'caterpillar', grown: 'butterfly', flip: true },
  { young: 'seedling', grown: 'sunflower', flip: true },
];
const frame = (young, grown) => `${article(young) === 'an' ? 'An' : 'A'} ${name(young)} grows into ${article(grown)} ${name(grown)}.`;

/** Slide 9, stand up (living: it grows) or sit still (non-living). All from Lessons 1 and 2. */
const STAND = ['tree', 'phone', 'cat', 'rock', 'frog', 'teddy', 'flower', 'car', 'bird', 'ball'];

/** Worksheet. A: number the pictures in order (shown jumbled). B: the frame from a picture pair. C: grow, yes or no. */
const SHEET_A = [
  { shown: ['sunflower', 'seed', 'seedling'], order: ['seed', 'seedling', 'sunflower'] },
  { shown: ['chick', 'chicken', 'egg'], order: ['egg', 'chick', 'chicken'] },
  { shown: ['frog', 'tadpole'], order: ['tadpole', 'frog'] },
];
const SHEET_B = [['puppy', 'dog'], ['kitten', 'cat'], ['tadpole', 'frog']];
const SHEET_C = [['tree', 'trees'], ['phone', 'phones'], ['cat', 'cats'], ['rock', 'rocks']].map(([k, plural]) => ({ key: k, plural, yes: kind(k) === 'living' }));

const ANSWERS = [
  ...SHEET_A.map((r, i) => [`A${i + 1}`, r.shown.map((k) => `${name(k)} ${r.order.indexOf(k) + 1}`).join(', ')]),
  ...SHEET_B.map(([y, g], i) => [`B${i + 1}`, frame(y, g)]),
  ...SHEET_C.map((r, i) => [`C${i + 1}`, `${r.yes ? 'Yes' : 'No'}. ${r.yes ? `${r.plural[0].toUpperCase()}${r.plural.slice(1)} grow.` : `${article(r.key) === 'an' ? 'An' : 'A'} ${name(r.key)} is non-living.`}`]),
];

module.exports = ANSWERS;
Object.assign(module.exports, { REMEMBER, GROW, CHANGE, MODEL, YES_NO, ORDER, STAND, SHEET_A, SHEET_B, SHEET_C, frame, name, kind });

if (require.main === module) ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));

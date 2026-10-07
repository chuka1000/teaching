/**
 * Living Or Non-Living (T3, Unit 4 Lesson 1): every classification in the lesson, in ONE place.
 * The deck's answer chips, the worksheet's sorting task and the upside-down answers at the foot of the worksheet all
 * read KIND, so a picture cannot be "living" on a slide and "non-living" on the sheet.
 */

/** What every pictured thing is: the unit's one list (build/living-things-words.js). */
const { KIND, name, kind } = require('./living-things-words');

/** The four new words, each with the three pictures that show it (the same three on the slide and the sheet). */
const WORDS = {
  living: ['dog', 'tree', 'girl'],
  'non-living': ['rock', 'chair', 'ball'],
  plant: ['tree', 'flower', 'cactus'],
  animal: ['dog', 'bird', 'fish'],
};

/** Worksheet A: the four picture sets in a mixed order. Worksheet B: twelve things to sort. */
const SHEET_A = ['plant', 'non-living', 'animal', 'living'];
const SHEET_B = ['cat', 'rock', 'flower', 'car', 'fish', 'phone', 'tree', 'ball', 'bird', 'book', 'cactus', 'robot'];

/**
 * Worksheet C: complete the sentence. `gap` is what goes in the gap; a row with no `pre` is a whole sentence to write.
 * Rows 1 to 4 and 7: living or non-living. Rows 5 and 6: plant or animal. Rows 8 and 9: the whole sentence.
 */
const SHEET_C = [
  { key: 'dog', pre: 'A dog is ', gap: kind('dog') },
  { key: 'rock', pre: 'A rock is ', gap: kind('rock') },
  { key: 'tree', pre: 'A tree is ', gap: kind('tree') },
  { key: 'car', pre: 'A car is ', gap: kind('car') },
  { key: 'cactus', pre: 'A cactus is a ', gap: KIND.cactus[2] },
  { key: 'frog', pre: 'A frog is an ', gap: KIND.frog[2] },
  { key: 'teddy', pre: 'A teddy is ', gap: kind('teddy') },
  { key: 'fish', whole: `A fish is ${kind('fish')}.` },
  { key: 'phone', whole: `A phone is ${kind('phone')}.` },
];

const sorted = (want) => SHEET_B.filter((k) => kind(k) === want).map(name).join(', ');
const ANSWERS = [
  ['A', SHEET_A.map((w, i) => `${i + 1} ${w}`).join('  ·  ')],
  ['B', `Living: ${sorted('living')}.  Non-living: ${sorted('non-living')}.`],
  ...SHEET_C.map((r, i) => [`C${i + 1}`, r.whole || `${r.pre}${r.gap}.`]),
];

module.exports = ANSWERS;
Object.assign(module.exports, { KIND, WORDS, SHEET_A, SHEET_B, SHEET_C, name, kind });

if (require.main === module) {
  // sanity: every picture the sheet needs exists
  const { picFile } = require('./living-things-kit');
  [...Object.values(WORDS).flat(), ...SHEET_B, ...SHEET_C.map((r) => r.key)].forEach((k) => picFile(k));
  ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));
}

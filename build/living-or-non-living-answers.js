/**
 * Living Or Non-Living (T3, Unit 4 Lesson 1): every classification in the lesson, in ONE place.
 * The deck's answer chips, the worksheet's sorting task and the upside-down answers at the foot of the worksheet all
 * read KIND, so a picture cannot be "living" on a slide and "non-living" on the sheet.
 */

/** Every thing pictured in the lesson: what it is, and its group if it is living. Picture files: assets/pictures/<key>.png */
const KIND = {
  dog: ['dog', 'living', 'animal'], cat: ['cat', 'living', 'animal'], bird: ['bird', 'living', 'animal'],
  fish: ['fish', 'living', 'animal'], frog: ['frog', 'living', 'animal'], horse: ['horse', 'living', 'animal'],
  snail: ['snail', 'living', 'animal'], butterfly: ['butterfly', 'living', 'animal'],
  girl: ['girl', 'living', 'animal'], walker: ['person', 'living', 'animal'],
  tree: ['tree', 'living', 'plant'], flower: ['flower', 'living', 'plant'], cactus: ['cactus', 'living', 'plant'],
  rock: ['rock', 'non-living'], chair: ['chair', 'non-living'], ball: ['ball', 'non-living'], car: ['car', 'non-living'],
  phone: ['phone', 'non-living'], book: ['book', 'non-living'], robot: ['robot', 'non-living'],
  teddy: ['teddy', 'non-living'], bicycle: ['bicycle', 'non-living'], clock: ['clock', 'non-living'],
  kite: ['kite', 'non-living'], sun: ['sun', 'non-living'], cloud: ['cloud', 'non-living'],
};
const name = (k) => KIND[k][0];
const kind = (k) => KIND[k][1];

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
  // sanity: every key has a picture, and both groups in the sort are the same size
  const fs = require('fs'), path = require('path');
  const missing = Object.keys(KIND).filter((k) => !fs.existsSync(path.join(__dirname, '..', 'assets', 'pictures', `${k}.png`)));
  if (missing.length) { console.error('no picture for:', missing.join(', ')); process.exit(1); }
  ANSWERS.forEach(([n, a]) => console.log(n.padEnd(3), a));
}

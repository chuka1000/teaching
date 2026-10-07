/**
 * T3 Unit 4, What is a living organism?: every thing pictured in the unit, in ONE place. What it is called on the slides,
 * whether it is living, and (if living) whether it is a plant or an animal. Every deck, worksheet and the assessment
 * read this, so a thing cannot be living in one lesson and non-living in the next.
 *
 * The picture for a key is assets/photos/<key>.jpg (a photograph) or assets/pictures/<key>.png (a drawing).
 *
 * The unit's words, in the order taught, and their gestures (fixed in Lesson 1, and on first teaching after that):
 */
const UNIT_WORDS = [
  // [word, lesson, syllables, gesture]
  ['living', 1, 'LIV-ing', 'both hands up, wiggle all ten fingers'],
  ['non-living', 1, 'non-LIV-ing', 'two fists, one on top of the other, held completely still'],
  ['plant', 1, 'PLANT', 'palms together at the chest, then open them upwards like two leaves'],
  ['animal', 1, 'AN-i-mal', 'hands as paws, scratch the air twice'],
  ['need', 2, 'NEED', 'both hands pull in towards the chest'],
  ['food', 2, 'FOOD', 'fingers to the mouth'],
  ['water', 2, 'WA-ter', 'drink from an invisible cup'],
  ['air', 2, 'AIR', 'a big breath in, hands rising up the chest'],
  ['grow', 3, 'GROW', 'a flat palm rising slowly from the desk to above the head'],
  ['change', 3, 'CHANGE', 'hands rolling over each other'],
];

const KIND = {
  // living: animals
  dog: ['dog', 'living', 'animal'], cat: ['cat', 'living', 'animal'], bird: ['bird', 'living', 'animal'],
  fish: ['fish', 'living', 'animal'], frog: ['frog', 'living', 'animal'], horse: ['horse', 'living', 'animal'],
  snail: ['snail', 'living', 'animal'], butterfly: ['butterfly', 'living', 'animal'], cow: ['cow', 'living', 'animal'],
  elephant: ['elephant', 'living', 'animal'], chicken: ['chicken', 'living', 'animal'], ant: ['ant', 'living', 'animal'],
  girl: ['girl', 'living', 'animal'], walker: ['person', 'living', 'animal'], child: ['child', 'living', 'animal'],
  puppy: ['puppy', 'living', 'animal'], kitten: ['kitten', 'living', 'animal'], chick: ['chick', 'living', 'animal'],
  tadpole: ['tadpole', 'living', 'animal'], caterpillar: ['caterpillar', 'living', 'animal'], baby: ['baby', 'living', 'animal'],
  // living: plants
  tree: ['tree', 'living', 'plant'], flower: ['flower', 'living', 'plant'], cactus: ['cactus', 'living', 'plant'],
  grass: ['grass', 'living', 'plant'], seedling: ['seedling', 'living', 'plant'], seed: ['seed', 'living', 'plant'],
  sunflower: ['sunflower', 'living', 'plant'], potplant: ['plant', 'living', 'plant'],
  // non-living
  rock: ['rock', 'non-living'], chair: ['chair', 'non-living'], ball: ['ball', 'non-living'], car: ['car', 'non-living'],
  phone: ['phone', 'non-living'], book: ['book', 'non-living'], robot: ['robot', 'non-living'],
  teddy: ['teddy', 'non-living'], bicycle: ['bicycle', 'non-living'], clock: ['clock', 'non-living'],
  kite: ['kite', 'non-living'], sun: ['sun', 'non-living'], cloud: ['cloud', 'non-living'], cup: ['cup', 'non-living'],
  pencil: ['pencil', 'non-living'], bag: ['bag', 'non-living'], balloon: ['balloon', 'non-living'],
  // only in the assessment (Q9, the unfamiliar context): never shown in a lesson
  goat: ['goat', 'living', 'animal'], umbrella: ['umbrella', 'non-living'],
  // what living things need (things, not living or non-living answers)
  water: ['water', 'non-living'], food: ['food', null], air: ['air', 'non-living'], egg: ['egg', 'living', 'animal'],
  // photographs of a need being met (Lesson 2): what they show, not things to sort
  watering: ['plants', 'living', 'plant'], grazing: ['cow', 'living', 'animal'], breathing: ['girl', 'living', 'animal'],
  forest: ['forest', null], question: ['why?', null], magnifier: ['look', null],
};

const entry = (k) => {
  if (!KIND[k]) throw new Error(`living-things-words: no entry for "${k}"`);
  return KIND[k];
};
const name = (k) => entry(k)[0];
const kind = (k) => entry(k)[1];
const group = (k) => entry(k)[2] || null;
/** "a dog", "an elephant": the article the frame needs. */
const article = (k) => (/^[aeiou]/.test(name(k)) ? 'an' : 'a');
const gesture = (w) => (UNIT_WORDS.find((x) => x[0] === w) || [])[3];

module.exports = { KIND, UNIT_WORDS, name, kind, group, article, gesture };

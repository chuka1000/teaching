/**
 * T3 Unit 8, The Periodic Table: every element, sample and object pictured in the unit, in ONE place. What it is called on
 * the slides, which element it is, whether that element is a metal, what it looks like. Every deck, worksheet, answers
 * module and the game read this, so a thing cannot be a metal in one lesson and a non-metal in the next.
 *
 * Lesson 1 (Friday 9 October, taught before this toolkit built the unit) gave: element, symbol, metal, gas; the five
 * elements He, O, Fe, Cu, Au; the frame "___ is a ___. Its symbol is ___."; the table colours (blue metal, green gas,
 * grey other). Nothing here contradicts it.
 *
 * "Non-metal" means "not a metal": it covers the green gases AND the grey elements on the table. That is the one
 * simplification the unit makes (the grey elements include a few in between, such as silicon; the table decides).
 *
 * The picture for a key is assets/photos/<key>.jpg (a photograph) or assets/pictures/<key>.png (a drawing); the element
 * tiles are assets/pictures/tile_<Symbol>.png and the table pictures pt_*.png (tools/make-periodic-table.py).
 */

/** The unit's words in the order taught, with the gesture that goes with each. Lesson 0 = Atoms (T3 Unit 2). */
const UNIT_WORDS = [
  // [word, lesson, syllables, gesture]
  ['atom', 0, 'AT-om', 'fingers circling'],
  ['tiny', 0, 'TY-ni', 'pinch the fingers together'],
  ['part', 0, 'PART', 'a chopping hand'],
  ['made of', 0, 'MADE of', 'hands building, one on top of the other'],
  ['element', 1, 'EL-e-ment', 'both hands make a small box around ONE thing'],
  ['symbol', 1, 'SIM-bol', 'write a letter in the air with one finger'],
  ['metal', 1, 'MET-al', 'knock twice on the desk with a fist: "knock-knock"'],
  ['gas', 1, 'GAS', 'wiggle the fingers upwards and let the hands float up'],
  ['non-metal', 2, 'non-MET-al', 'the metal knock, then sweep both hands apart, like "no"'],
  ['shiny', 2, 'SHY-ni', 'open and close both hands beside the face, like a sparkle'],
  ['hard', 2, 'HARD', 'a tight fist held up'],
  ['soft', 2, 'SOFT', 'squeeze an invisible sponge with open fingers'],
  ['electricity', 3, 'e-lec-TRIS-i-ty', 'a zigzag in the air with one finger, like lightning'],
  ['bulb', 3, 'BULB', 'a fist held above the head, then open the fingers: the light comes on'],
  ['circuit', 3, 'SUR-kit', 'one finger draws a square in the air: a loop'],
  ['conduct', 3, 'con-DUCT', 'run one finger along the other forearm, like a wire'],
  ['sort', 4, 'SORT', 'sweep the hands to the left and to the right, into two piles'],
  ['full', 4, 'FULL', 'both arms rounded in front, holding a big full balloon'],
  ['recycle', 5, 're-CY-cle', 'both index fingers chase each other round in a circle'],
];
const gesture = (w) => (UNIT_WORDS.find((x) => x[0] === w) || [])[3];
const say = (w) => (UNIT_WORDS.find((x) => x[0] === w) || [])[2];

/**
 * The elements the unit meets. `cls` is metal or non-metal (a gas is a non-metal); `form` is how it appears;
 * `look` is what students may say about a sample they can SEE (shiny or not shiny), and nothing they cannot check
 * through glass. `table` is the colour of its box on the taught table.
 */
const EL = {
  He: { name: 'helium', n: 2, cls: 'non-metal', form: 'gas', table: 'green', say: 'HEE-lee-um' },
  O: { name: 'oxygen', n: 8, cls: 'non-metal', form: 'gas', table: 'green', say: 'OK-si-jen' },
  Fe: { name: 'iron', n: 26, cls: 'metal', form: 'solid', table: 'blue', say: 'EYE-un', look: 'hard', conducts: true },
  Cu: { name: 'copper', n: 29, cls: 'metal', form: 'solid', table: 'blue', say: 'KOP-er', look: 'shiny', conducts: true },
  Au: { name: 'gold', n: 79, cls: 'metal', form: 'solid', table: 'blue', say: 'GOHLD', look: 'shiny' },
  Al: { name: 'aluminium', n: 13, cls: 'metal', form: 'solid', table: 'blue', say: 'al-yu-MIN-i-um', look: 'shiny', conducts: true },
  C: { name: 'carbon', n: 6, cls: 'non-metal', form: 'solid', table: 'grey', say: 'KAR-bon', look: 'not shiny', conducts: true /* graphite, in a pencil: the exception */ },
  S: { name: 'sulfur', n: 16, cls: 'non-metal', form: 'solid', table: 'grey', say: 'SUL-fer', look: 'not shiny', conducts: false },
  Si: { name: 'silicon', n: 14, cls: 'non-metal', form: 'solid', table: 'grey', say: 'SIL-i-kon', look: 'shiny' },
};
const BY_NAME = Object.fromEntries(Object.entries(EL).map(([sym, e]) => [e.name, sym]));

/**
 * Every picture key, as [name on the slide, element symbol or null, kind of picture]. `sample` is a photograph of the
 * element itself; `object` is something made of it; `word` is a picture for a new word.
 */
const PICS = {
  // the elements as samples
  copper: ['copper', 'Cu', 'sample'], gold: ['gold', 'Au', 'sample'], iron: ['iron', 'Fe', 'sample'],
  aluminium: ['aluminium foil', 'Al', 'sample'], carbon: ['carbon', 'C', 'sample'], sulfur: ['sulfur', 'S', 'sample'],
  silicon: ['silicon', 'Si', 'sample'], helium: ['helium', 'He', 'sample'], oxygen: ['oxygen', 'O', 'sample'],
  // things made of an element (the double, Lesson 4 and 5)
  wire: ['copper wire', 'Cu', 'object'], nail: ['iron nail', 'Fe', 'object'], pencil: ['pencil lead', 'C', 'object'],
  ring: ['gold ring', 'Au', 'object'], pan: ['iron pan', 'Fe', 'object'], tank: ['oxygen tank', 'O', 'object'], balloons: ['helium balloon', 'He', 'object'],
};
const entry = (k) => {
  if (!PICS[k]) throw new Error(`periodic-words: no entry for "${k}"`);
  return PICS[k];
};
const name = (k) => entry(k)[0];
const symbolOf = (k) => entry(k)[1];
const cls = (k) => (symbolOf(k) ? EL[symbolOf(k)].cls : null);
/** "a nail", "an anchor". */
const article = (k) => (/^[aeiou]/.test(name(k)) ? 'an' : 'a');
const capital = (s) => s[0].toUpperCase() + s.slice(1);

module.exports = { UNIT_WORDS, gesture, say, EL, BY_NAME, PICS, name, symbolOf, cls, article, capital };

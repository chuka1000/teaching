/**
 * T3 Developing Science (CLIL), Unit 8 Lessons 4 and 5: the sentence-builder game for "What Is It Made Of".
 * One self-contained HTML file (GAMES.md): no internet, no accounts, nothing stored, no sound, no lives. Source:
 * build/what-is-it-made-of-game.html. This script injects the words, the pictures and the facts, all read from the unit's own modules
 * (build/periodic-words.js, build/does-it-light-up-answers.js, build/what-is-it-made-of-answers.js) so the game cannot disagree with the
 * decks, writes the nucleus palette into the CSS, and copies the file to the lesson folder.
 *
 * Three rounds of six, the CLIL order (CLIL.md): words (yes/no, then either/or), samples (metal or non-metal, conducts or does not),
 * then sentences built from tiles. Nothing is in it that the class has not been taught, across all five lessons of the unit.
 *
 *   node build/what-is-it-made-of-game.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PALETTES } = require('../lib/theme');
const W = require('./periodic-words');
const LIGHT = require('./does-it-light-up-answers');
const MADE = require('./what-is-it-made-of-answers');
const { picFile } = require('./periodic-kit');

const LESSON = 'What Is It Made Of';
const OUT = path.join(__dirname, '..', 'out', LESSON);
const SRC = path.join(__dirname, 'what-is-it-made-of-game.html');

/** The unit's fifteen words, the picture the decks used for each, and its one-line meaning from the decks. */
const WORD_PIC = {
  element: ['tile_Au', 'One kind of atom. Gold is an element.'], symbol: ['tile_Fe', 'A short name. The symbol for iron is Fe.'],
  metal: ['gold', 'Gold is a metal. Iron is a metal.'], gas: ['oxygen', 'Oxygen is a gas.'], 'non-metal': ['sulfur', 'Not a metal. Sulfur is a non-metal.'],
  shiny: ['aluminium', 'Gold is shiny.'], hard: ['rock', 'A rock is hard.'], soft: ['teddy', 'A teddy is soft.'],
  electricity: ['lightning', 'Lightning is electricity.'], bulb: ['bulb', 'The bulb is on.'], circuit: ['circuit_gap', 'Electricity goes round.'],
  conduct: ['circuit_on', 'Copper conducts electricity.'], sort: ['sort', 'Sort the things.'], full: ['balloons', 'A balloon is full of helium.'],
  recycle: ['recycle', 'We recycle metal.'],
};
const ORDER = Object.keys(WORD_PIC);
const CONFUSE = {
  element: ['symbol'], symbol: ['element'], metal: ['non-metal'], 'non-metal': ['metal'], gas: ['full', 'non-metal'], shiny: ['hard'], hard: ['soft', 'shiny'], soft: ['hard'],
  electricity: ['bulb', 'circuit'], bulb: ['circuit', 'electricity'], circuit: ['conduct', 'bulb'], conduct: ['circuit', 'electricity'], sort: ['full', 'recycle'], full: ['sort', 'gas'], recycle: ['sort'],
};
const HARD = ['conduct', 'non-metal'];          // the two the class is most likely to lose: in every game
const TODAY = ['sort', 'full', 'recycle'];       // from the double

const SAMPLE_KEYS = ['copper', 'gold', 'iron', 'aluminium', 'sulfur', 'carbon', 'silicon', 'helium'];
const samples = Object.fromEntries(SAMPLE_KEYS.map((k) => {
  const sym = W.symbolOf(k), e = W.EL[sym];
  return [k, { name: e.name === 'aluminium' ? 'aluminium' : e.name, cls: e.cls, look: e.look || null, sym }];
}));
// helium is a gas, with nothing to see: it is only ever asked as metal or non-metal
const conductPool = LIGHT.TESTED.map((k) => ({ key: k, name: W.name(k), element: LIGHT.element(k), conducts: LIGHT.conducts(k) }));
const objects = Object.fromEntries(['nail', 'ring', 'wire', 'pan', 'tank', 'balloons'].map((k) => [k, { name: MADE.objName(k), element: MADE.element(k), gas: MADE.isGas(k) }]));

const PICS = [...new Set([
  ...Object.values(WORD_PIC).map((x) => x[0]), ...SAMPLE_KEYS, ...conductPool.map((c) => c.key), ...Object.keys(objects), 'circuit_on', 'circuit_off', 'circuit_gap',
])];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const images = {};
  for (const key of PICS) {
    const file = picFile(key);
    const base = sharp(file).resize(320, 320, { fit: 'inside', withoutEnlargement: true });
    if (file.endsWith('.jpg')) images[key] = 'data:image/jpeg;base64,' + (await base.jpeg({ quality: 78 }).toBuffer()).toString('base64');
    else images[key] = 'data:image/png;base64,' + (await base.png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer()).toString('base64');
  }
  const data = {
    words: Object.fromEntries(ORDER.map((w) => [w, { pic: WORD_PIC[w][0], say: W.say(w), mean: WORD_PIC[w][1], gest: W.gesture(w) }])),
    order: ORDER, confuse: CONFUSE, hard: HARD, today: TODAY, samples, classPool: SAMPLE_KEYS, sampleNames: ['copper', 'carbon', 'sulfur', 'silicon'],
    conductPool, objects, elementNames: ['iron', 'gold', 'copper', 'oxygen', 'helium'],
  };
  const P = PALETTES.nucleus;
  const css = ':root {\n' + Object.entries({
    dark: P.dark, accent: P.accent, accentInk: P.accentInk, support: P.support, alert: P.alert, tint: P.tint,
    tintDeep: P.tintDeep, ink: P.ink, inkSoft: P.inkSoft, white: P.white,
  }).map(([k, v]) => `    --${k}: #${v};`).join('\n') + '\n  }';
  let html = fs.readFileSync(SRC, 'utf8');
  html = html.replace('/*PALETTE*/', css).replace('/*IMAGES*/', () => JSON.stringify(images)).replace('/*DATA*/', () => JSON.stringify(data));
  const stripped = html.replace(/data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+/g, '');
  if (/https?:\/\//.test(stripped.replace('http://www.w3.org/2000/svg', ''))) throw new Error('external reference in the game');
  if (/localStorage|sessionStorage/.test(stripped)) throw new Error('the game must not store anything');
  if (/—/.test(stripped)) throw new Error('an em dash in the game');
  const dest = path.join(OUT, `${LESSON} game.html`);
  fs.writeFileSync(dest, html, 'utf8');
  console.log(`${path.basename(dest)}: ${Math.round(html.length / 1024)} KB, ${Object.keys(images).length} pictures`);
})();

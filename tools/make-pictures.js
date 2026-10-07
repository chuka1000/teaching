/**
 * Renders colour pictures of everyday things (a dog, a tree, a rock, a chair) to PNG, one file per word, into
 * assets/pictures/<word>.png. For the T3 CLIL decks and worksheets, where every word needs a picture a beginner
 * can read at a glance, in colour.
 *
 * The pictures are Google's Noto emoji (Apache 2.0, github.com/googlefonts/noto-emoji), read from the SVG sprite
 * in the @svgmoji/noto package (MIT), so they render sharp at any size. A photograph is still the first choice
 * (CLAUDE.md, "Media"); these are for when one cannot be had. Wikimedia was unreachable from the build
 * environment when Unit 4 (What is a living organism?) was built, and colour drawings beat one-colour icons for
 * this group.
 *
 *   node tools/make-pictures.js          # every picture in the list below
 *   node tools/make-pictures.js dog rock # just these
 *
 * Add a word by adding its emoji code point (as named in the sprite: upper-case hex, joined with '-') below.
 * LOOK at the PNG before using it: the picture must match the word exactly.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SPRITE = path.join(__dirname, '..', 'node_modules', '@svgmoji', 'noto', 'sprites', 'all.svg');
const OUT = path.join(__dirname, '..', 'assets', 'pictures');
const SIZE = 512;

const PICTURES = {
  // living: animals
  dog: '1F415', cat: '1F408', bird: '1F426', fish: '1F41F', elephant: '1F418', cow: '1F404', ant: '1F41C',
  butterfly: '1F98B', snail: '1F40C', frog: '1F438', horse: '1F40E', chicken: '1F414',
  // living: plants
  tree: '1F333', flower: '1F337', sunflower: '1F33B', cactus: '1F335', seedling: '1F331', potplant: '1FAB4',
  herb: '1F33F', palm: '1F334',
  // living: people
  girl: '1F467', boy: '1F466', child: '1F9D2', baby: '1F476', woman: '1F469', man: '1F468', walker: '1F6B6',
  // non-living
  rock: '1FAA8', chair: '1FA91', ball: '26BD', car: '1F697', phone: '1F4F1', pencil: '270F', book: '1F4D5',
  bag: '1F392', teddy: '1F9F8', robot: '1F916', brick: '1F9F1', cup: '1F964', sun: '2600',
  cloud: '2601', clock: '23F0', key: '1F511', scissors: '2702', bicycle: '1F6B2', kite: '1FA81',
  // what living things need, and growing (Unit 4, later lessons)
  water: '1F4A7', apple: '1F34E', bread: '1F35E', wind: '1F32C', lungs: '1FAC1', egg: '1F95A', chick: '1F424',
  watering: '1FAB4', grazing: '1F404', breathing: '1F32C',
  goat: '1F410', umbrella: '2602', tadpole: '1F438', chicken: '1F414', sunflower: '1F33B', seedling: '1F331', grass: '1F33F', balloon: '1F388', cup: '1F964', pencil: '270F', bag: '1F392', ant: '1F41C', cow: '1F404',
  food: '1F957', air: '1F32C', puppy: '1F436', kitten: '1F431', caterpillar: '1F41B', seed: '1F330', forest: '1F3DE',
  hatching: '1F423', earth: '1F30D',
  // classroom routines
  eyes: '1F440', speech: '1F4AC', writing: '270D', tick: '2705', cross: '274C', question: '2753', ear: '1F442',
  pair: '1F46B', hand: '270B', point: '1F449', sort: '1F5C2', target: '1F3AF', star: '2B50', magnifier: '1F50D', link: '1F517',
};

/** One emoji's <svg> out of the sprite. The sprite nests one 128 x 128 svg per emoji, each with its own ids. */
function extract(sprite, code) {
  const ids = [code, `${code}-FE0F`];
  for (const id of ids) {
    const at = sprite.indexOf(`id="${id}"`);
    if (at < 0) continue;
    const start = sprite.lastIndexOf('<svg', at);
    const end = sprite.indexOf('</svg>', at) + '</svg>'.length;
    let svg = sprite.slice(start, end);
    if (!/xmlns=/.test(svg.slice(0, svg.indexOf('>')))) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    if (!/xmlns:xlink=/.test(svg) && /xlink:/.test(svg)) svg = svg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    return svg.replace(/viewBox="0 0 128 128"/, `viewBox="0 0 128 128" width="${SIZE}" height="${SIZE}"`);
  }
  throw new Error(`no emoji ${code} in the sprite`);
}

(async () => {
  if (!fs.existsSync(SPRITE)) throw new Error('run npm install: the @svgmoji/noto sprite is missing');
  const sprite = fs.readFileSync(SPRITE, 'utf8');
  fs.mkdirSync(OUT, { recursive: true });
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PICTURES);
  for (const name of want) {
    if (!PICTURES[name]) throw new Error(`no picture called ${name}: add it to PICTURES`);
    const svg = extract(sprite, PICTURES[name]);
    await sharp(Buffer.from(svg), { density: 300 }).resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toFile(path.join(OUT, `${name}.png`));
  }
  console.log(`${want.length} pictures in assets/pictures/`);
})().catch((e) => { console.error(e.message); process.exit(1); });

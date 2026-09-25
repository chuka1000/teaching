/**
 * T3 Developing Science (CLIL): the game for "Atoms The Words And The Picture".
 * One self-contained HTML file (GAMES.md): no internet, no accounts, nothing
 * stored, no sound, no lives. Source: build/atoms-words-and-picture-game.html.
 * This script embeds the pictures (the ones from assets/atoms/, all from
 * Atoms 1, Drawing an Atom and The Nucleus, so nothing is new to the class),
 * writes the Nucleus palette into the CSS, and copies the file to the lesson folder.
 *
 *   node build/atoms-words-and-picture-game.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PALETTES } = require('../lib/theme');

const LESSON = 'Atoms The Words And The Picture';
const OUT = path.join(__dirname, '..', 'out', LESSON);
const SRC = path.join(__dirname, 'atoms-words-and-picture-game.html');
const A = (f) => path.join(__dirname, '..', 'assets', 'atoms', f);

// game key -> picture file
const PICS = {
  atom: 'atom_green.png', matter: 'matter.png', tiny: 'tiny.png', part: 'part.png', nucleus: 'nucleus.png',
  centre: 'centre.png', electron: 'electron.png', outside: 'outside.png', proton: 'proton.png', neutron: 'neutron.png',
  water: 'water.png', apple: 'apple.png', air: 'air.png', hand: 'hand.png',
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const images = {};
  for (const [key, file] of Object.entries(PICS)) {
    const buf = await sharp(A(file)).resize(320, 320, { fit: 'inside', withoutEnlargement: true })
      .png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
    images[key] = 'data:image/png;base64,' + buf.toString('base64');
  }
  const P = PALETTES.nucleus;
  const css = ':root {\n' + Object.entries({
    dark: P.dark, accent: P.accent, accentInk: P.accentInk, support: P.support, alert: P.alert, tint: P.tint,
    tintDeep: P.tintDeep, ink: P.ink, inkSoft: P.inkSoft, white: P.white,
  }).map(([k, v]) => `    --${k}: #${v};`).join('\n') + '\n  }';
  let html = fs.readFileSync(SRC, 'utf8');
  html = html.replace('/*PALETTE*/', css).replace('/*IMAGES*/', JSON.stringify(images));
  const stripped = html.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, '').replace('http://www.w3.org/2000/svg', '');
  if (/https?:\/\//.test(stripped)) throw new Error('external reference in the game');
  if (/localStorage|sessionStorage/.test(stripped)) throw new Error('the game must not store anything');
  const dest = path.join(OUT, `${LESSON} game.html`);
  fs.writeFileSync(dest, html, 'utf8');
  console.log(`${path.basename(dest)}: ${Math.round(html.length / 1024)} KB, ${Object.keys(images).length} pictures`);
})();

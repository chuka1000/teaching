/**
 * Renders a handful of react-icons to PNG, one file per icon/palette-role
 * pair, into assets/icons/ (repo root — every deck reads from here).
 *
 * Asked for after Y7 Lesson 1: "add images, even if small or just icons —
 * not everyone would know what a spanner is." Icons sit next to the concrete
 * nouns so a word nobody knows still has a picture attached.
 *
 * Colours come from lib/theme.js's PALETTES rather than a hardcoded set, so
 * a new deck's icons always match its own palette instead of an old one.
 */
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Fa = require('react-icons/fa');
const Gi = require('react-icons/gi');
const { PALETTES } = require('../lib/theme');

const OUT = path.join(__dirname, '..', 'assets', 'icons');
fs.mkdirSync(OUT, { recursive: true });

const ICONS = {
  thermometer: Fa.FaThermometerHalf,
  mountain:    Fa.FaMountain,
  apple:       Fa.FaAppleAlt,
  magnet:      Fa.FaMagnet,
  seedling:    Fa.FaSeedling,
  microscope:  Fa.FaMicroscope,
  ruler:       Fa.FaRulerCombined,
  lightbulb:   Fa.FaLightbulb,
  balance:     Fa.FaBalanceScale,
  atom:        Fa.FaAtom,
  question:    Fa.FaQuestionCircle,
  book:        Fa.FaBookOpen,
  sun:         Fa.FaSun,
  dna:         Fa.FaDna,
  star:        Fa.FaStar,
  rocket:      Fa.FaRocket,
  leaf:        Fa.FaLeaf,
  boiling:     Gi.GiBoilingBubbles,
  duck:        Gi.GiDuck,
  rice:        Gi.GiBowlOfRice,
  globe:       Fa.FaGlobeAmericas,
  bolt:        Fa.FaBolt,
  compass:     Fa.FaCompass,
  satellite:   Fa.FaSatelliteDish,
};

// Which palettes to render icons for, and which roles within each. 'white'
// is fixed (not a palette role) for icons that sit on a dark or coloured fill.
const PALETTE_NAMES = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PALETTES);
const ROLES = ['dark', 'accent', 'accentInk', 'support', 'alert', 'ink'];

(async () => {
  const missing = Object.entries(ICONS).filter(([, I]) => !I).map(([n]) => n);
  if (missing.length) throw new Error(`no such icon export: ${missing.join(', ')}`);
  let count = 0;
  for (const palName of PALETTE_NAMES) {
    const pal = PALETTES[palName];
    if (!pal) throw new Error(`unknown palette: ${palName}`);
    const colours = { white: '#FFFFFF', ...Object.fromEntries(ROLES.map((r) => [r, `#${pal[r]}`])) };
    for (const [name, Icon] of Object.entries(ICONS)) {
      for (const [cname, hex] of Object.entries(colours)) {
        const svg = ReactDOMServer.renderToStaticMarkup(
          React.createElement(Icon, { color: hex, size: 512 })
        );
        const file = path.join(OUT, `${name}_${palName}_${cname}.png`);
        await sharp(Buffer.from(svg)).resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        }).png().toFile(file);
        count++;
      }
    }
  }
  console.log(`rendered ${count} icon PNGs into ${OUT}`);
})();

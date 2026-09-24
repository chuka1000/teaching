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
 *
 *   node tools/make-icons.js            # every palette
 *   node tools/make-icons.js signal     # one palette
 *
 * Icons the sets do not have (tweezers, measuring cylinder) are drawn here as
 * small React SVG components. Prefer a real photograph where one would show
 * the thing better (see "Media" in CLAUDE.md); icons are the fallback.
 */
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Fa = require('react-icons/fa');
const Gi = require('react-icons/gi');
const Tb = require('react-icons/tb');
const Lu = require('react-icons/lu');
const { PALETTES } = require('../lib/theme');

const OUT = path.join(__dirname, '..', 'assets', 'icons');
fs.mkdirSync(OUT, { recursive: true });

/** Tweezers: no icon set has them, so this one is drawn. Two arms, tips meeting. */
const Tweezers = ({ color, size }) => React.createElement('svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512', width: size, height: size },
  React.createElement('path', {
    d: 'M244 70 Q150 260 246 476 M268 70 Q362 260 266 476',
    stroke: color, strokeWidth: 34, fill: 'none', strokeLinecap: 'round',
  }),
  React.createElement('rect', { x: 226, y: 28, width: 60, height: 70, rx: 22, fill: color }));

/** Measuring cylinder: no icon set has a good one, so this one is drawn. */
const Cylinder = ({ color, size }) => React.createElement('svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512', width: size, height: size },
  React.createElement('rect', { x: 190, y: 40, width: 132, height: 390, rx: 14, stroke: color, strokeWidth: 30, fill: 'none' }),
  React.createElement('rect', { x: 205, y: 260, width: 102, height: 155, fill: color, opacity: 0.35 }),
  ...[110, 170, 230, 290, 350].map((y) => React.createElement('line', { key: y, x1: 190, x2: 250, y1: y, y2: y, stroke: color, strokeWidth: 20 })),
  React.createElement('rect', { x: 130, y: 440, width: 252, height: 42, rx: 16, fill: color }));

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
  paperplane:  Fa.FaPaperPlane,
  repeat:      Fa.FaRedo,
  envelope:    Fa.FaEnvelope,
  ship:        Fa.FaShip,
  tree:        Fa.FaTree,
  gem:         Fa.FaGem,
  oilcan:      Fa.FaOilCan,
  wind:        Fa.FaWind,
  rain:        Fa.FaCloudRain,
  tractor:     Fa.FaTractor,
  cow:         Gi.GiCow,
  roots:       Gi.GiTreeRoots,
  hourglass:   Gi.GiSandsOfTime,
  city:        Fa.FaCity,
  road:        Fa.FaRoad,
  water:       Fa.FaTint,
  tweezers:    Tweezers,
  spoon:       Gi.GiSpoon,
  fork:        Tb.TbGrillFork,
  bean:        Lu.LuBean,
  finch:       Gi.GiFinch,
  bacteria:    Fa.FaBacteria,
  pills:       Fa.FaPills,
  stopwatch:   Gi.GiStopwatch,
  flame:       Fa.FaFire,
  bread:       Fa.FaBreadSlice,
  cereal:      Tb.TbBowlSpoonFilled,
  potato:      Gi.GiPotato,
  cracker:     Fa.FaCookie,
  glasses:     Fa.FaGlasses,
  calculator:  Fa.FaCalculator,
  car:         Fa.FaCarSide,
  cylinder:    Cylinder,
  pendulum:    Tb.TbPendulum,
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

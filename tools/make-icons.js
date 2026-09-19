/**
 * Renders a handful of react-icons to PNG for the Y7 decks.
 *
 * Asked for after Lesson 1: "add images, even if small or just icons — not
 * everyone would know what a spanner is." Icons sit next to the concrete
 * nouns so a word nobody knows still has a picture attached.
 */
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Fa = require('react-icons/fa');
const Gi = require('react-icons/gi');

const OUT = path.join(__dirname, 'assets/icons');
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
};

const COLOURS = {
  dark: '#4A2C6F', accent: '#F2A03D', support: '#2BA6A0',
  alert: '#D94F6A', tint: '#F7F4FB', white: '#FFFFFF', ink: '#241535',
};

(async () => {
  const missing = Object.entries(ICONS).filter(([, I]) => !I).map(([n]) => n);
  if (missing.length) throw new Error(`no such icon export: ${missing.join(', ')}`);
  for (const [name, Icon] of Object.entries(ICONS)) {
    for (const [cname, hex] of Object.entries(COLOURS)) {
      const svg = ReactDOMServer.renderToStaticMarkup(
        React.createElement(Icon, { color: hex, size: 512 })
      );
      const file = path.join(OUT, `${name}_${cname}.png`);
      await sharp(Buffer.from(svg)).resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }).png().toFile(file);
    }
  }
  const made = fs.readdirSync(OUT).filter((f) => f.endsWith('.png'));
  console.log(`rendered ${made.length} icon PNGs into ${OUT}`);
})();

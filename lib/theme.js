// "Prasae Estuary" palette — one object, change here to reskin the whole deck.
const PALETTE = {
  dark:    '0E3A3F', // Deep Tidal
  accent:  'F5B301', // Prong Gold
  support: '2E9E6B', // Mangrove Green
  tint:    'FAF4E6', // Mudflat Cream
  alert:   'E2572B', // Fiddler Coral
  // derived tints
  darkSoft:  '17505A',
  tintDeep:  'F0E4C8',
  ink:       '14282B',
  inkSoft:   '4A6165',
  white:     'FFFFFF',
};

const F = { title: 'Georgia', body: 'Arial' };

const W = 13.333, H = 7.5;
const M = 0.55;                 // page margin
const PILL_Y = 0.30, PILL_H = 0.38;
const TITLE_Y = 1.00;
const BODY_Y = 1.98;
const CONTENT_W = W - 2 * M;

/**
 * Other palettes. furniture.js and shapes.js hold a reference to the PALETTE
 * object above, so a reskin has to MUTATE that object rather than replace it —
 * assigning a new object would leave every helper pointing at the old colours.
 */
const PALETTES = {
  prasae: { ...PALETTE },

  // "First Question" — Y7 Unit 1, The World of Science. Curiosity colours:
  // deep violet, amber, teal.
  firstq: {
    dark:    '4A2C6F',
    accent:  'F2A03D',
    support: '2BA6A0',
    tint:    'F7F4FB',
    alert:   'D94F6A',
    darkSoft:  '6B4E96',
    tintDeep:  'E3DAF0',
    ink:       '241535',
    inkSoft:   '6A6180',
    white:     'FFFFFF',
  },


  // "Nucleus" — Y7 CLIL Atoms unit. Petrol blue, sunflower, emerald, rose.
  // High contrast and only four colours: this is for beginner EAL readers.
  nucleus: {
    dark:    '123B54',
    accent:  'FFD166',
    support: '06A77D',
    tint:    'F4F8FA',
    alert:   'EF476F',
    darkSoft:  '2D5F7C',
    tintDeep:  'D3E3EB',
    ink:       '0E2A3B',
    inkSoft:   '5B7484',
    white:     'FFFFFF',
  },

  // "Night Highway" — A.1 Kinematics. Road at dusk: asphalt, sodium lamps,
  // signal cyan, brake lights.
  motion: {
    dark:    '17203F', // Night Asphalt
    accent:  'FF8A3D', // Sodium Orange
    support: '1FB6BC', // Signal Cyan
    tint:    'F2F4FA', // Chalk
    alert:   'E03D6B', // Brake Light
    darkSoft:  '2C3966',
    tintDeep:  'DDE2F0',
    ink:       '141A30',
    inkSoft:   '5A6480',
    white:     'FFFFFF',
  },
};

/** Switch the active palette in place. Call before building any slides. */
function usePalette(name) {
  const next = PALETTES[name];
  if (!next) throw new Error(`unknown palette: ${name}`);
  Object.keys(PALETTE).forEach((k) => { delete PALETTE[k]; });
  Object.assign(PALETTE, next);
  return PALETTE;
}

module.exports = { PALETTE, PALETTES, usePalette, F, W, H, M, PILL_Y, PILL_H, TITLE_Y, BODY_Y, CONTENT_W };

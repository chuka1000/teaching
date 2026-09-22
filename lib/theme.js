// "Prasae Estuary" palette — one object, change here to reskin the whole deck.
//
// accentInk exists because `accent` is chosen to pop as a FILL (a pill, a
// badge, a highlighted box) — several accents sit close to white in
// luminance, so using accent itself as TEXT on a light background is often
// close to unreadable. accentInk is the same hue, darkened for exactly that
// case: card numbers, section letters, Answers numbering. accent stays for
// fills, badges and text on a dark background; accentInk is text on light.
// tools/check-contrast.js enforces this split on every palette.
const PALETTE = {
  dark:    '0E3A3F', // Deep Tidal
  accent:  'F5B301', // Prong Gold
  accentInk: 'B98400', // Prong Gold, darkened for text on light
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
    accentInk: 'B5701A',
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
    accentInk: 'A9741A',
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
    accentInk: 'C25A16', // Sodium Orange, darkened for text on light
    support: '1FB6BC', // Signal Cyan
    tint:    'F2F4FA', // Chalk
    alert:   'E03D6B', // Brake Light
    darkSoft:  '2C3966',
    tintDeep:  'DDE2F0',
    ink:       '141A30',
    inkSoft:   '5A6480',
    white:     'FFFFFF',
  },

  // "Signal" — Y7 Science, Scientific Research and Technology. Broadcast
  // colours from Chuka's own YouTube channel: study blue, verified green,
  // alert red, headline yellow.
  signal: {
    dark:      '15395C', // channel blue, darkened — navy
    accent:    'FFD921', // channel yellow, exact
    accentInk: '957D11', // channel yellow, darkened for text on light (AA9116 given was 2.86:1 on tint, under the 3:1 floor)
    support:   '00A33E', // channel green, exact
    alert:     'CD312F', // channel red, exact
    tint:      'F2F6FB',
    darkSoft:  '2C5C82',
    tintDeep:  'C7D9EA',
    ink:       '0E2A40',
    inkSoft:   '55708A',
    white:     'FFFFFF',
  },

  // "Ballast" — Y10 Science, Density. Water and cargo colours: deep water
  // navy, a buoy orange for pop, kelp green, warning-buoy red. A new unit
  // (matter, not kinematics), so a new palette rather than reusing 'motion'.
  density: {
    dark:      '0B3D4C', // Deep Water
    accent:    'FF8952', // Buoy Orange
    accentInk: 'C25A29', // Buoy Orange, darkened for text on light
    support:   '1FA37A', // Kelp Green
    alert:     'D63447', // Warning Buoy Red
    tint:      'EFF6F7',
    darkSoft:  '1C5A70',
    tintDeep:  'D7E8EA',
    ink:       '0C2730',
    inkSoft:   '4E6D74',
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

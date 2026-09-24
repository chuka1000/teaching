/**
 * Pre-render timer clips for every palette.
 *
 * You do NOT normally need to run this — lib/timer.js renders any missing clip
 * on demand during a build. This just warms the cache so the first build of a
 * new palette is not waiting on ffmpeg.
 *
 *   node tools/make-timers.js              # every palette, common durations
 *   node tools/make-timers.js nucleus      # one palette
 */
const THEME = require('../lib/theme');
const { timerClip, coverDataUri } = require('../lib/timer');

// Archetype phases (1,2,3,5,6,10,14) plus the CLIL ones (4,7,8) plus a little
// headroom for doubles.
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20];

const only = process.argv[2];
const names = only ? [only] : Object.keys(THEME.PALETTES);

let made = 0;
for (const name of names) {
  const palette = THEME.PALETTES[name];
  if (!palette) { console.error(`no such palette: ${name}`); process.exit(1); }
  for (const mode of ['light', 'dark']) {
    coverDataUri(name, palette, mode);
    for (const m of DURATIONS) { timerClip(name, palette, mode, m); made++; }
  }
  console.log(`${name}: ready`);
}
console.log(`${made} clips checked across ${names.length} palette(s)`);

/**
 * The phase timer.
 *
 * WHY THIS FILE EXISTS
 * Timer clips used to be pre-rendered by hand for whichever palette was in use
 * at the time. That silently produced decks with NO timer whenever a lesson
 * used a palette nobody had generated clips for — which was three of the five
 * palettes, including the CLIL one. Nothing failed; the bar just was not there.
 *
 * So the clip is now derived from the palette and generated on demand. Any
 * palette, any duration, always works. Clips are cached in assets/timers/ and
 * only rendered once.
 *
 * Remember: the timer is a VIDEO, not a shape animation, and the deck needs
 * lib/autoplay-media.js run over it afterwards or it will not play. See
 * CLAUDE.md, "Things that will bite you".
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = path.join(__dirname, '..', 'assets', 'timers');
const W = 88, H = 1200, FPS = 2;

/* ---------- colour helpers ---------- */
const hex2rgb = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgb2hex = (c) => '0x' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t);

/**
 * Timer colours for a palette. Both must be quiet: the bar is a background
 * instrument, not a feature. A saturated level competes with the content.
 */
function colours(palette, mode) {
  const { tint, dark, support, ink } = palette;
  if (mode === 'dark') {
    return {
      empty: rgb2hex(mix(dark, tint, 0.07)),      // barely lighter than the bg
      level: rgb2hex(mix(support, dark, 0.58)),   // muted support
    };
  }
  return {
    empty: rgb2hex(mix(tint, ink || '444444', 0.09)),
    level: rgb2hex(mix(support, tint, 0.68)),     // pale support
  };
}

/**
 * Path to the clip for this palette/mode/duration, rendering it if absent.
 * `key` is just a stable filename — usually the palette name.
 */
function timerClip(key, palette, mode, minutes) {
  fs.mkdirSync(DIR, { recursive: true });
  const theme = `${key}${mode === 'dark' ? 'dark' : 'light'}`;
  const file = path.join(DIR, `timer_${theme}_${minutes}.mp4`);
  if (fs.existsSync(file)) return file;

  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  } catch {
    throw new Error(
      'ffmpeg is not installed, so the timer bar cannot be rendered.\n' +
      '  Install it:  brew install ffmpeg\n' +
      '  Then either re-run the build, or warm the cache with:\n' +
      '    node tools/make-timers.js\n' +
      '  Do NOT build the deck without a timer — every lesson has one.');
  }

  const { empty, level } = colours(palette, mode);
  const secs = Math.round(minutes * 60);
  // drawbox evaluates its position once at init in some ffmpeg builds, so the
  // bar never moves. An overlay DOES take a time expression in y.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'lavfi', '-i', `color=c=${empty}:s=${W}x${H}:d=${secs}:r=${FPS}`,
    '-f', 'lavfi', '-i', `color=c=${level}:s=${W}x${H}:d=${secs}:r=${FPS}`,
    '-filter_complex', `[0][1]overlay=x=0:y='H*t/${secs}':shortest=1`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryslow', '-crf', '32',
    file]);
  console.log(`  timer rendered: ${path.basename(file)}`);
  return file;
}

/** The poster frame: the bar full. pptxgenjs needs it as a data URI. */
const COVERS = {};
function coverDataUri(key, palette, mode) {
  const theme = `${key}${mode === 'dark' ? 'dark' : 'light'}`;
  if (COVERS[theme]) return COVERS[theme];
  const file = path.join(DIR, `cover_${theme}.png`);
  if (!fs.existsSync(file)) {
    const { level } = colours(palette, mode);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
      '-f', 'lavfi', '-i', `color=c=${level}:s=${W}x${H}:d=1`,
      '-frames:v', '1', file]);
  }
  COVERS[theme] = `image/png;base64,${fs.readFileSync(file).toString('base64')}`;
  return COVERS[theme];
}

/**
 * Put the timer on a slide. Returns `minutes`, so a builder can collect the
 * phase lengths and assert they total 50 (or 95 for a double).
 *
 *   PHASES.push(addTimer(pptx, s, { key: 'nucleus', palette: C, minutes: 4 }));
 */
function addTimer(pptx, slide, o) {
  const mode = o.mode === 'dark' ? 'dark' : 'light';
  slide.addMedia({
    type: 'video',
    path: timerClip(o.key, o.palette, mode, o.minutes),
    cover: coverDataUri(o.key, o.palette, mode),
    x: o.x ?? 0.34, y: o.y ?? 0.34,
    w: o.w ?? 0.50, h: o.h ?? (o.slideH ? o.slideH - 0.68 : 6.82),
    objectName: 'timer_video',
  });
  return o.minutes;
}

module.exports = { addTimer, timerClip, coverDataUri, colours };

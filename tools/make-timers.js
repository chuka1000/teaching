/**
 * Renders one draining-bar video per phase length.
 *
 * A video is used instead of a shape animation because media plays on its own
 * clock: PowerPoint and Keynote put it in a <p:video> node that sits OUTSIDE
 * the click sequence, so advancing the builds cannot fast-forward or restart
 * it. A shape animation in the main sequence gets completed by the first
 * click, which is exactly the bug this replaces.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'timer_media');
fs.mkdirSync(OUT, { recursive: true });

const W = 88, H = 1200, FPS = 2;
const THEMES = {
  // Prasae (Y9 science)
  light: { empty: '0xEDE7D6', level: '0xC3D8CB' },
  dark:  { empty: '0x143F45', level: '0x1F5F58' },
  // Night Highway (Y10 motion)
  motionlight: { empty: '0xE3E7F1', level: '0xC6D5E2' },
  motiondark:  { empty: '0x212B4B', level: '0x2E4A66' },
};
const WANTED = { motionlight: [1, 2, 3, 5, 6, 10, 14], motiondark: [3] };

for (const [theme, mins] of Object.entries(WANTED)) {
  const { empty, level } = THEMES[theme];
  for (const m of mins) {
    const secs = m * 60;
    const file = path.join(OUT, `timer_${theme}_${m}.mp4`);
    // drawbox evaluates its expressions once at init in this ffmpeg build, so
    // the bar never moved. An overlay DOES take a time expression in y.
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
      '-f', 'lavfi', '-i', `color=c=${empty}:s=${W}x${H}:d=${secs}:r=${FPS}`,
      '-f', 'lavfi', '-i', `color=c=${level}:s=${W}x${H}:d=${secs}:r=${FPS}`,
      '-filter_complex', `[0][1]overlay=x=0:y='H*t/${secs}':shortest=1`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryslow', '-crf', '32',
      file]);
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`${theme} ${String(m).padStart(2)} min  ->  ${kb} KB`);
  }
}

/* Cover images: the bar full, so the slide looks right before playback starts. */
const { createCanvas } = (() => { try { return require('canvas'); } catch { return {}; } })();
const sharp = require('sharp');
(async () => {
  for (const [theme, { level }] of Object.entries(THEMES)) {
    const hex = level.replace('0x', '#');
    await sharp({ create: { width: W, height: H, channels: 3, background: hex } })
      .png().toFile(path.join(OUT, `cover_${theme}.png`));
  }
  console.log('covers written');
})();

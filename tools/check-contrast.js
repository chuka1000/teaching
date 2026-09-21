#!/usr/bin/env node
/**
 * tools/check-contrast.js [palette-name...]
 *
 * WCAG contrast check for every text/background role pair this toolkit
 * actually uses, run against every palette in lib/theme.js (or just the
 * ones named on the command line).
 *
 * WHY THIS EXISTS
 * Accent colours are chosen to pop as FILLS — a pill, a badge, a highlighted
 * box — not as text sitting directly on a light background. Several accents
 * (a sunflower yellow, for instance) are close to white in luminance, so
 * `color: C.accent` on a white card is often close to unreadable even though
 * it looks fine as a fill. accentInk exists for exactly that case. This
 * script is what stops a new palette shipping with one that fails it.
 *
 * Design-system level, not deck-specific: run it when a palette is added or
 * changed, not as part of every single lesson build.
 */
const path = require('path');
const THEME = require(path.join(__dirname, '..', 'lib', 'theme'));
const { PALETTES } = THEME;

function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(hexA, hexB) {
  const la = luminance(hexA), lb = luminance(hexB);
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * [foreground role, background role, isLargeText, what it is]
 * `large` follows the WCAG large-text rule (>=18pt, or >=14pt bold) — the
 * bar drops from 4.5:1 to 3:1. Titles qualify; pill labels and card numbers
 * at 11-18pt do not, so they get the stricter bar.
 */
const PAIRS = [
  ['dark', 'tint', true, 'title, light mode'],
  ['tint', 'dark', true, 'title, dark mode (plenary)'],
  ['tint', 'dark', false, 'pill text, light-mode fill — 11pt bold, not large'],
  // Same pair covers the Plenary FALSE label (accent-as-text on its dark
  // card) too — that instance is 17pt bold, so the stricter check here
  // covers both real uses.
  ['dark', 'accent', false, 'pill text / badge number / FALSE label — 11pt bold, not large'],
  ['inkSoft', 'tint', false, 'subtitle / footer, light mode'],
  ['tintDeep', 'dark', false, 'subtitle, dark mode'],
  ['ink', 'white', false, 'card body text'],
  ['inkSoft', 'white', false, 'card secondary text'],
  // Card numbers, section letters and Answers numbering are bold 15-22pt in
  // both existing decks — WCAG large text (>=14pt bold), so 3:1 applies.
  ['accentInk', 'tint', true, 'accent-coloured numbering, light mode (card numbers, section letters, Answers numbering)'],
  ['accentInk', 'white', true, 'accent-coloured numbering, on a white card'],
  // Every real support/alert-as-text instance in light mode (word-card
  // pronunciation, pill kickers, the red "Open Google Classroom" subtitle)
  // sits at 12-16pt and is not reliably bold — under the large-text line —
  // so this is the stricter bar, matching real usage.
  ['support', 'tint', false, 'support-coloured text, light mode (word-card pronunciation, kickers)'],
  ['alert', 'tint', false, 'alert-coloured text, light mode (option letters, red subtitle)'],
  // TRUE sits on a lightened card within a dark slide, close enough to
  // `dark` to check directly (see equations-of-motion.js Plenary, card
  // '1F2A52' vs dark '17203F'). Real instance is 17pt bold.
  ['support', 'dark', true, 'support-coloured text, dark mode (TRUE label)'],
];

const requested = process.argv.slice(2);
const names = requested.length ? requested : Object.keys(PALETTES);
let fail = 0;

names.forEach((name) => {
  const pal = PALETTES[name];
  if (!pal) { console.error(`unknown palette: "${name}"`); fail++; return; }
  console.log(`\n${name}`);
  PAIRS.forEach(([fgKey, bgKey, large, label]) => {
    const fg = pal[fgKey], bg = pal[bgKey];
    if (!fg || !bg) {
      console.log(`  ? ${label} — palette has no "${!fg ? fgKey : bgKey}"`);
      fail++;
      return;
    }
    const ratio = contrast(fg, bg);
    const need = large ? 3.0 : 4.5;
    const ok = ratio >= need;
    if (!ok) fail++;
    console.log(`  ${ok ? '✓' : '✗'} ${label.padEnd(66)} ${ratio.toFixed(2)}:1  (need ${need}:1)`);
  });
});

if (fail) {
  console.error(`\n${fail} contrast check(s) failed`);
  process.exit(1);
}
console.log('\n✓ all contrast checks passed');

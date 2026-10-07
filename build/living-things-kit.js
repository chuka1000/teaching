/**
 * T3 Unit 4, What is a living organism?: the slide furniture every deck in the unit shares, so a later lesson looks
 * exactly like the first (CLAUDE.md, "Sequences"). Meadow palette, the timer bar, the phase pill, the word cards, the
 * picture tiles, the living / non-living chips and the frame banner.
 *
 *   const K = require('./living-things-kit')({ lesson: 'Living Or Non-Living', subject: '... · Lesson 1 · T3' });
 *   const s = K.slide('light', 5, 'You say');   // background, timer and pill in one call
 *   ...
 *   K.write();                                   // out/<lesson>/<lesson>.pptx, and prints the phase minutes
 *
 * Pictures: a photograph from assets/photos/<key>.jpg when there is one (tools/fetch-photos.py), otherwise the colour
 * drawing in assets/pictures/<key>.png (tools/make-pictures.js). What each thing IS comes from build/living-things-words.js.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('meadow');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const WORDS = require('./living-things-words');

const ROOT = path.join(__dirname, '..');
const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LIVE = C.support, STONE = '5E6B78';             // living is leaf green, non-living is slate, in every deck
const LIVE_TINT = 'E6F2E3', STONE_TINT = 'ECEFF2';

/** The file for a picture key: the photograph if there is one, else the drawing. */
function picFile(key, o = {}) {
  const photo = path.join(ROOT, 'assets', 'photos', `${key}.jpg`);
  const drawing = path.join(ROOT, 'assets', 'pictures', `${key}.png`);
  const use = !o.drawing && fs.existsSync(photo) ? photo : fs.existsSync(drawing) ? drawing : null;
  // PICS_LOG=<file>: record which picture every key used, to check none fell back to a drawing by accident
  if (use && process.env.PICS_LOG) fs.appendFileSync(process.env.PICS_LOG, `${key}\t${use.endsWith('.jpg') ? 'photo' : 'drawing'}\n`);
  if (use) return use;
  throw new Error(`no picture for "${key}": add it to assets/photos/PHOTOS.tsv or tools/make-pictures.js`);
}
const isPhoto = (key) => picFile(key).endsWith('.jpg');

module.exports = function kit({ lesson, subject, title: deckTitle }) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'W16x9', width: W, height: H });
  pptx.layout = 'W16x9';
  pptx.author = 'Chuka';
  pptx.title = deckTitle || lesson;
  pptx.subject = subject;
  const S = pptx.ShapeType;
  const _addSlide = pptx.addSlide.bind(pptx);
  pptx.addSlide = function (...args) {
    const sl = _addSlide(...args);
    const _addText = sl.addText.bind(sl);
    sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
    return sl;
  };
  const PHASES = [];

  const bg = (s, mode) => { s.background = { color: mode === 'dark' ? C.dark : C.tint }; };
  /** The phase timer. `count: false` keeps a slide (the break) out of the phase total. */
  function timer(s, minutes, mode, o = {}) {
    const m = addTimer(pptx, s, { key: 'meadow', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H });
    if (o.count !== false) PHASES.push(m);
  }
  function pill(s, label, minutes, mode) {
    const text = minutes == null ? label.toUpperCase() : `${label.toUpperCase()} · ${minutes} MIN`;
    s.addText(text, {
      shape: S.roundRect, rectRadius: 0.16, x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
      fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : 'FFFFFF',
      fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
    });
  }
  /** A new slide with its background, timer and phase pill. */
  function slide(mode, minutes, label, o = {}) {
    const s = pptx.addSlide();
    bg(s, mode);
    timer(s, minutes, mode, o);
    if (label) pill(s, label, o.count === false ? null : minutes, mode);
    return s;
  }
  function keywords(s, words, mode = 'light') {
    s.addText(words.join('   ·   '), {
      x: RIGHT - 6.4, y: PILL_Y, w: 6.4, h: PILL_H, color: mode === 'dark' ? C.accent : C.support, fontFace: F.body,
      fontSize: 12, bold: true, italic: true, align: 'right', valign: 'middle', margin: 0, objectName: 'keyword_strip',
    });
  }
  const title = (s, text, mode = 'light', size = 34) => s.addText(text, {
    x: M, y: TITLE_Y, w: CW, h: 0.80, color: mode === 'dark' ? C.tint : C.dark,
    fontFace: F.title, fontSize: size, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  function card(s, o) {
    s.addShape(S.roundRect, {
      x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r || 0.12,
      fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || C.tintDeep, width: o.lineWidth || 1.3 }, objectName: `${o.name}_bg`,
    });
  }
  /** A square picture centred on (cx, cy): one object, so a spec can animate it by its name. */
  function pic(s, key, cx, cy, size, objName, o = {}) {
    s.addImage({ path: picFile(key, o), x: cx - size / 2, y: cy - size / 2, w: size, h: size, objectName: objName });
  }

  /** The living / non-living chip, in its colour. */
  function chip(s, key, x, y, w, h, objName, size = 15, text) {
    const col = WORDS.kind(key) === 'living' ? LIVE : STONE;
    s.addText(text || WORDS.kind(key), {
      shape: S.roundRect, rectRadius: 0.10, x, y, w, h, fill: { color: col }, line: { color: col, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: size, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: objName,
    });
  }
  /** A text chip in a given colour (an answer that is not living / non-living). */
  function tag(s, text, x, y, w, h, objName, col = LIVE, size = 15) {
    s.addText(text, {
      shape: S.roundRect, rectRadius: 0.10, x, y, w, h, fill: { color: col }, line: { color: col, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: size, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: objName,
    });
  }
  /** A picture tile: picture, its name, and an answer chip (hidden until its click) under that. */
  function tile(s, key, x, y, w, h, nm, o = {}) {
    card(s, { x, y, w, h, line: o.line, name: nm });
    const ps = Math.min(h - 1.02, w - 0.3);
    pic(s, key, x + w / 2, y + 0.08 + ps / 2, ps, `${nm}_img`);
    s.addText(o.label || WORDS.name(key), {
      x: x + 0.08, y: y + ps + 0.12, w: w - 0.16, h: 0.42, color: C.dark, fontFace: F.body, fontSize: 20,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${nm}_t`,
    });
    if (o.answer !== false) {
      if (o.answer) tag(s, o.answer, x + w / 2 - 0.85, y + ps + 0.56, 1.7, 0.38, `${nm}_chip`, o.answerColour || LIVE, 15);
      else chip(s, key, x + w / 2 - 0.78, y + ps + 0.56, 1.56, 0.38, `${nm}_chip`, 15);
    }
    if (o.tick) s.addImage({ path: picFile('tick', { drawing: true }), x: x + w - 0.52, y: y + 0.12, w: 0.4, h: 0.4, objectName: `${nm}_tick` });
  }
  /**
   * A dark banner. `parts` is a string or a list of [text, highlight?] pieces; highlighted pieces are in the accent.
   * The frame of the lesson goes in one of these, in the same place on every speaking slide.
   */
  function banner(s, parts, o = {}) {
    const list = typeof parts === 'string' ? [[parts, true]] : parts;
    s.addText(list.map(([t, hi]) => ({ text: t, options: { color: hi ? C.accent : C.tint } })), {
      shape: S.roundRect, rectRadius: 0.12, x: o.x ?? M, y: o.y ?? 6.12, w: o.w ?? CW, h: o.h ?? 0.86,
      fill: { color: C.dark }, line: { color: C.dark, width: 0 }, fontFace: F.title, fontSize: o.size || 26, bold: true,
      align: 'center', valign: 'middle', margin: 0.08, objectName: o.name || 'frame_banner',
    });
  }
  /**
   * New-word cards: two (or three) side by side, each with up to three pictures, the word, the syllables and a one-line
   * meaning. The word, syllables and meaning are one group (`wr<i>`), so a spec can bring them in and take them away.
   */
  function wordCards(s, cards, o = {}) {
    const n = cards.length, gap = 0.30, cw = (CW - (n - 1) * gap) / n, y = o.y ?? BODY_Y - 0.06, ch = o.h;
    const ps = o.picSize, spread = o.spread ?? ps + 0.27;
    cards.forEach((c, i) => {
      const x = M + i * (cw + gap);
      card(s, { x, y, w: cw, h: ch, line: c.colour || LIVE, lineWidth: 2.5, name: `w${i}` });
      c.pics.forEach((k, j) => {
        const cx = x + cw / 2 + (j - (c.pics.length - 1) / 2) * spread;
        pic(s, k, cx, y + 0.22 + ps / 2, ps, `w${i}_p${j}`);
        if (o.picNames !== false) {
          s.addText(c.picNames ? c.picNames[j] : WORDS.name(k), {
            x: cx - 0.85, y: y + 0.26 + ps, w: 1.7, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 14,
            bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_n${j}`,
          });
        }
      });
      const wy = y + (o.picNames === false ? 0.42 : 0.72) + ps;
      s.addText(c.word, {
        x: x + 0.1, y: wy, w: cw - 0.2, h: 0.75, color: c.colour || LIVE, fontFace: F.title, fontSize: o.wordSize || 42,
        bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_word`,
      });
      s.addText(c.say, {
        x: x + 0.1, y: wy + 0.78, w: cw - 0.2, h: 0.4, color: C.inkSoft, fontFace: F.body, fontSize: 18,
        bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_say`,
      });
      s.addText(c.meaning, {
        x: x + 0.2, y: wy + 1.22, w: cw - 0.4, h: 0.45, color: C.ink, fontFace: F.body, fontSize: 18,
        align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_mean`,
      });
    });
    return { cw, y, ch };
  }

  function write() {
    const outDir = path.join(ROOT, 'out', lesson);
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `${lesson}.pptx`);
    return pptx.writeFile({ fileName: out }).then(() => {
      console.log('deck written:', out);
      console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
    });
  }

  return {
    pptx, S, C, F, W, H, M, RIGHT, CW, PILL_Y, PILL_H, TITLE_Y, BODY_Y, LIVE, STONE, LIVE_TINT, STONE_TINT, PHASES, WORDS,
    bg, timer, pill, slide, keywords, title, card, pic, picFile, isPhoto, chip, tag, tile, banner, wordCards, write,
  };
};
module.exports.picFile = picFile;

/**
 * T3 Unit 8, The Periodic Table: the slide furniture every deck in the unit shares, so a later lesson looks like the
 * lesson taught on 9 October (the nucleus palette, the timer bar, the phase pill, the word cards, the element tiles and
 * the blue / grey / green chips that match the colours of the table).
 *
 *   const K = require('./periodic-kit')({ lesson: 'Metal Or Non-Metal', subject: '... · Lesson 2 · T3' });
 *   const s = K.slide('light', 5, 'You say');   // background, timer and pill in one call
 *   ...
 *   K.write();                                   // out/<lesson>/<lesson>.pptx, and prints the phase minutes
 *
 * Pictures: a photograph from assets/photos/<key>.jpg when there is one, otherwise the picture in assets/pictures/<key>.png
 * (the element tiles tile_<Symbol>.png and the table pictures pt_*.png come from tools/make-periodic-table.py).
 * What each thing IS comes from build/periodic-words.js.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('nucleus');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const WORDS = require('./periodic-words');

const ROOT = path.join(__dirname, '..');
const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

/** The chip colours are the colours of the boxes on the table: blue is a metal, grey is "other", green is a gas. */
const CHIP = {
  metal: { fill: '9CC4E4', text: C.dark, ink: '1F5F94', tint: 'E3EEF8' },
  'non-metal': { fill: 'DADFE3', text: C.dark, ink: '4B5963', tint: 'EEF1F3' },
  gas: { fill: '8FDCC0', text: C.dark, ink: '1B7E62', tint: 'E2F5EE' },
};
const INK = { metal: CHIP.metal.ink, 'non-metal': CHIP['non-metal'].ink, gas: CHIP.gas.ink };

/** The file for a picture key: the photograph if there is one, else the picture. */
/** Two keys that show the same photograph as another (the tank is the oxygen photograph, the balloons the helium one). */
const ALIAS = { tank: 'oxygen', balloons: 'helium' };
function picFile(key, o = {}) {
  key = ALIAS[key] || key;
  const photo = path.join(ROOT, 'assets', 'photos', `${key}.jpg`);
  const drawing = path.join(ROOT, 'assets', 'pictures', `${key}.png`);
  const use = !o.drawing && fs.existsSync(photo) ? photo : fs.existsSync(drawing) ? drawing : null;
  // PICS_LOG=<file>: record which picture every key used, to check none fell back to a drawing by accident
  if (use && process.env.PICS_LOG) fs.appendFileSync(process.env.PICS_LOG, `${key}\t${use.endsWith('.jpg') ? 'photo' : 'drawing'}\n`);
  if (use) return use;
  throw new Error(`no picture for "${key}": add it to assets/photos/PHOTOS.tsv or assets/pictures`);
}
const isPhoto = (key) => picFile(key).endsWith('.jpg');
/** width / height of a PNG (read from its header); photographs are square. */
function ratioOf(file) {
  if (!file.endsWith('.png')) return 1;
  const b = fs.readFileSync(file).subarray(16, 24);
  return b.readUInt32BE(0) / b.readUInt32BE(4);
}

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
    const m = addTimer(pptx, s, { key: 'nucleus', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H });
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
    const file = picFile(key, o);
    const r = ratioOf(file);
    // a wider or taller picture (the circuit drawings) is fitted INSIDE the square, never stretched
    const w = r >= 1 ? size : size * r, h = r >= 1 ? size / r : size;
    s.addImage({ path: file, x: cx - w / 2, y: cy - h / 2, w, h, objectName: objName });
  }
  /** A picture at its own proportions, fitted inside a w x h box (the periodic table, the circuit). */
  function wide(s, key, x, y, w, h, objName, ratio) {
    const f = picFile(key, { drawing: true });
    const r = ratio || 2341 / 1263;
    const pw = Math.min(w, h * r), ph = pw / r;
    s.addImage({ path: f, x: x + (w - pw) / 2, y: y + (h - ph) / 2, w: pw, h: ph, objectName: objName });
  }

  /** A silent film (assets/media/<file>.mp4, with <file>.png as its cover). It plays on click: the spec gives it that click. */
  function video(s, file, x, y, w, h, objName) {
    const f = (e) => path.join(ROOT, 'assets', 'media', `${file}.${e}`);
    s.addMedia({ type: 'video', path: f('mp4'), cover: 'data:image/png;base64,' + fs.readFileSync(f('png')).toString('base64'), x, y, w, h, objectName: objName });
  }

  /** The metal / non-metal / gas chip for a class name, in the table's colours. */
  function chip(s, cl, x, y, w, h, objName, size = 15) {
    const c = CHIP[cl];
    s.addText(cl, {
      shape: S.roundRect, rectRadius: 0.10, x, y, w, h, fill: { color: c.fill }, line: { color: cl === 'non-metal' ? '9AA6B0' : c.fill, width: cl === 'non-metal' ? 1 : 0 },
      color: c.text, fontFace: F.body, fontSize: size, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: objName,
    });
  }
  /** A text chip in a given colour (an answer that is not a class). */
  function tag(s, text, x, y, w, h, objName, col = C.support, size = 15, textCol = 'FFFFFF') {
    s.addText(text, {
      shape: S.roundRect, rectRadius: 0.10, x, y, w, h, fill: { color: col }, line: { color: col, width: 0 },
      color: textCol, fontFace: F.body, fontSize: size, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: objName,
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
      const cl = o.cls || WORDS.cls(key);
      if (o.answer) tag(s, o.answer, x + w / 2 - 0.85, y + ps + 0.56, 1.7, 0.38, `${nm}_chip`, CHIP[cl]?.fill || C.support, 15, C.dark);
      else chip(s, cl, x + w / 2 - 0.78, y + ps + 0.56, 1.56, 0.38, `${nm}_chip`, 15);
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
      card(s, { x, y, w: cw, h: ch, line: c.colour || C.support, lineWidth: 2.5, name: `w${i}` });
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
        x: x + 0.1, y: wy, w: cw - 0.2, h: 0.75, color: c.colour || C.support, fontFace: F.title, fontSize: o.wordSize || 42,
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

  /**
   * "PHOTO CREDITS" text for the speaker notes (CLAUDE.md: credits go in the notes, never on a slide). One line for
   * every photograph in `keys` that SOURCES.tsv knows, CC0 and public domain marked as needing none.
   */
  function credits(keys) {
    const rows = fs.readFileSync(path.join(ROOT, 'assets', 'photos', 'SOURCES.tsv'), 'utf8').split('\n').slice(1)
      .filter(Boolean).map((l) => l.split('\t'));
    const by = Object.fromEntries(rows.map((r) => [r[0], r]));
    const lines = [...new Set(keys)].filter((k) => by[k]).map((k) => {
      const [, file, author, lic] = by[k];
      const title = file.startsWith('ov:') ? '' : `"${file.replace(/\.(jpe?g|png)$/i, '')}", `;
      const none = /^(CC0|Public domain)/i.test(lic) ? ' (no credit needed)' : '';
      return `${k}: ${title}${author || 'unknown author'}, ${lic}${none}`;
    });
    return lines.length ? `PHOTO CREDITS (CC BY and BY-SA ask for them; CLAUDE.md puts credits in the notes, not on slides): ${lines.join('; ')}.` : '';
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
    pptx, S, C, F, W, H, M, RIGHT, CW, PILL_Y, PILL_H, TITLE_Y, BODY_Y, CHIP, INK, PHASES, WORDS,
    bg, timer, pill, slide, keywords, title, card, pic, wide, video, picFile, isPhoto, chip, tag, tile, banner, wordCards, credits, write,
  };
};
module.exports.picFile = picFile;
module.exports.CHIP = CHIP;

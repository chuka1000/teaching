/**
 * Y8 Science, Unit 3 Prokaryotes (class 8I): the slide furniture every deck in the unit shares, so a later lesson looks exactly like
 * the first (CLAUDE.md, "Sequences"). Culture palette, the timer bar, the phase pill, and one function for each of the slides that
 * TEMPLATE.md fixes: Do Now, Objectives, Hook, the three We Do modes, Cold Call, You Do, Mark and Plenary. The two I Do slides are
 * different in every lesson, so a lesson builds those itself with the primitives exported here (card, badge, sentence, video, ...).
 *
 *   const K = require('./prokaryotes-kit')({ lesson: 'Inside A Prokaryote', subject: 'Y8 Science · Prokaryotes · Lesson 1 · 8I', phases: [10, 1, 2, 6, 5, 4, 5, 11, 3, 3] });
 *   K.doNow({ qs, preview, notes });  K.today(...);  K.hook(...);  K.iDoSlide(minutes) ...;  K.write();
 *
 * Object names follow the Deep Time convention (d0_a, o0_bg, h0_k, wd0_v, c0_a, t0_h, mk_card_t, p0_v, pl_next) so that
 * build/prokaryotes-spec-kit.js can write the click builds for every standard slide.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('culture');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const ROOT = path.join(__dirname, '..');
const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LINE = 'D9C9D6', ANS = 'EEF5DB';                       // card outline; the answer-box tint
const PREVIEW_CARD = ANS, PREVIEW_LINE = C.accentInk;         // the Do Now's preview question: card and answer box swap (TEMPLATE.md)
const GC_LOGO = path.join(ROOT, 'assets', 'classroom.png');
const MEDIA = (f) => path.join(ROOT, 'assets', 'media', f);
const PHOTO = (k) => path.join(ROOT, 'assets', 'photos', `${k}.jpg`);
const PICTURE = (k) => path.join(ROOT, 'assets', 'pictures', `${k}.png`);

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
  function timer(s, minutes, mode) {
    PHASES.push(addTimer(pptx, s, { key: 'culture', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H }));
  }
  function pill(s, label, minutes, mode) {
    const text = `${label.toUpperCase()} · ${minutes} MIN`;
    s.addText(text, {
      shape: S.roundRect, rectRadius: 0.16, x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
      fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : 'FFFFFF',
      fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
    });
  }
  /** A new slide with its background, timer and phase pill. */
  function slide(mode, minutes, label) {
    const s = pptx.addSlide();
    bg(s, mode); timer(s, minutes, mode); pill(s, label, minutes, mode);
    return s;
  }
  const title = (s, text, mode = 'light', o = {}) => s.addText(text, {
    x: M, y: TITLE_Y, w: o.w ?? CW, h: 0.80, color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: o.size ?? 30, bold: true,
    valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  const sub = (s, text, mode = 'light') => s.addText(text, {
    x: M, y: TITLE_Y + 0.80, w: CW, h: 0.40, color: mode === 'dark' ? C.tintDeep : C.inkSoft, fontFace: F.body, fontSize: 16,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  function card(s, o) {
    s.addShape(S.roundRect, {
      x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r ?? 0.10, fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || LINE, width: o.lineWidth || 1.3 }, objectName: `${o.name}_bg`,
    });
  }
  function badge(s, o) {
    s.addShape(S.ellipse, { x: o.x, y: o.y, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.name}_badge` });
    s.addText(String(o.n), { x: o.x, y: o.y, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num` });
  }
  /** The dark banner with the key words underlined: `parts` is a list of [text, underline?]. */
  function sentence(s, parts, o) {
    s.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
      shape: S.roundRect, rectRadius: 0.12, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true, align: 'center', valign: 'middle', margin: 0.12, lineSpacing: (o.size ?? 16) + 5, objectName: o.name,
    });
  }
  /** A small heading in the card colour (NEW WORDS, WORKED EXAMPLE, ...). */
  const kicker = (s, text, x, y, w, name, o = {}) => s.addText(text, {
    x, y, w, h: 0.34, color: o.color || C.accentInk, fontFace: F.title, fontSize: o.size || 13, bold: true, charSpacing: o.spacing ?? 1, valign: 'middle', margin: 0, objectName: name,
  });
  const video = (s, file, x, y, w, h, name) => s.addMedia({
    type: 'video', path: MEDIA(`${file}.mp4`), cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'), x, y, w, h, objectName: name,
  });
  /** A photograph (assets/photos/<key>.jpg, square) or a picture (assets/pictures/<key>.png), as one named object. */
  function pic(s, key, x, y, w, h, name) {
    const file = fs.existsSync(PHOTO(key)) ? PHOTO(key) : PICTURE(key);
    if (!fs.existsSync(file)) throw new Error(`no picture "${key}" (assets/photos or assets/pictures)`);
    const hh = h ?? w;
    // a photograph is a square: shown in a wider or taller box it is CROPPED, never stretched
    if (file.endsWith('.jpg') && Math.abs(w - hh) > 0.01) {
      const big = Math.max(w, hh);
      s.addImage({ path: file, x, y, w: big, h: big, sizing: { type: 'crop', x: (big - w) / 2, y: (big - hh) / 2, w, h: hh }, objectName: name });
    } else s.addImage({ path: file, x, y, w, h: hh, objectName: name });
  }
  const hasPic = (key) => fs.existsSync(PHOTO(key)) || fs.existsSync(PICTURE(key));

  /* ----------------------------------------------------------------- 1. Do Now */
  /** Six questions in a 2 x 3 grid. `qs` is [question, answer] x 6; `preview` is the index of the question that previews today. */
  function qGrid(s, o) {
    const cw = (RIGHT - M - 0.30) / 2;
    o.qs.forEach(([q, a], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * (cw + 0.30), y = o.y0 + row * (o.ch + o.gap);
      const pv = i === o.preview;
      card(s, pv ? { x, y, w: cw, h: o.ch, fill: PREVIEW_CARD, line: PREVIEW_LINE, name: `${o.p}${i}` } : { x, y, w: cw, h: o.ch, name: `${o.p}${i}` });
      const qy = y + 0.14, cy = qy + o.qh / 2;
      s.addShape(S.ellipse, { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.p}${i}_badge` });
      s.addText(String(i + 1), { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.p}${i}_num` });
      s.addText(q, { x: x + 0.80, y: qy, w: cw - 1.02, h: o.qh, color: C.ink, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
      s.addText(a, {
        shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.64, w: cw - 0.44, h: 0.50, fill: { color: pv ? 'FFFFFF' : ANS }, line: { color: C.accentInk, width: 1.3 },
        color: C.dark, fontFace: F.body, fontSize: o.asize ?? 12.5, bold: true, align: 'left', valign: 'middle', margin: 6, objectName: `${o.p}${i}_a`,
      });
    });
  }
  function doNow({ qs, preview = 5, notes, size = 15, asize = 12 }) {
    const s = slide('light', 10, 'Do Now');
    s.addText(lesson, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
    // the date is left for the teacher to type (CHANGE IT: the speaker notes say so)
    s.addText('Date: ____________', { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
    s.addShape(S.rect, { x: M, y: 0.98, w: CW, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
    qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size, asize, preview, qs });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 2. Objectives */
  function today({ goals, banner, notes, minutes = 1 }) {
    const s = slide('light', minutes, 'Today');
    title(s, 'Objectives');
    const cw = (CW - 2 * 0.30) / 3;
    goals.forEach((g, i) => {
      const x = M + i * (cw + 0.30);
      card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
      badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
      s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
    });
    sentence(s, banner, { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 3. Hook */
  function hook({ question, opts, notes, minutes = 2, qSize = 21, picture }) {
    const s = slide('light', minutes, 'Hook');
    const pics = picture ? (Array.isArray(picture) ? picture : [picture]) : [];
    const picW = pics.reduce((a, b) => a + b.w + 0.12, 0);
    const tw = pics.length ? CW - picW - 0.18 : CW;
    s.addText(question, { x: M, y: 0.86, w: tw, h: 1.30, color: C.dark, fontFace: F.title, fontSize: qSize, bold: true, valign: 'middle', margin: 0, lineSpacing: qSize + 5, objectName: 'slide_title' });
    let px = RIGHT - picW + 0.12;
    pics.forEach((pc, i) => { pic(s, pc.key, px, pc.y ?? 0.66, pc.w, pc.h, pics.length > 1 ? `hook_pic${i}` : 'hook_pic'); px += pc.w + 0.12; });
    const cw = (CW - 2 * 0.30) / 3;
    opts.forEach((txt, i) => {
      const x = M + i * (cw + 0.30);
      card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
      s.addText('ABC'[i], { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
      s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'top', margin: 0, lineSpacing: 23, objectName: `h${i}_t` });
    });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 6. We Do (three modes) */
  /** Spot The Mistake: rows are [statement, 'RIGHT' | 'WRONG', correction]. One must already be RIGHT. */
  function weDoSTM({ rows, subtitle, notes, minutes = 5, size = 15.5 }) {
    const s = slide('light', minutes, 'We Do');
    title(s, 'Spot The Mistake'); sub(s, subtitle || 'Right or wrong? Hands up for your answer before each one is revealed.');
    const n = rows.length, gap = 0.12, rowH = Math.min(1.02, (H - 0.45 - (BODY_Y + 0.22) - (n - 1) * gap) / n), y0 = BODY_Y + 0.22, vw = 1.20, sw = 5.20;
    rows.forEach(([stmt, verdict, fix], i) => {
      const y = y0 + i * (rowH + gap);
      card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
      s.addText(stmt, { x: M + 0.28, y, w: sw, h: rowH, color: C.dark, fontFace: F.body, fontSize: size, bold: true, valign: 'middle', margin: 0, lineSpacing: size + 4.5, objectName: `wd${i}_q` });
      const ok = verdict === 'RIGHT';
      s.addText([{ text: verdict, options: { bold: true, color: ok ? C.support : C.alert, breakLine: false } }], {
        shape: S.roundRect, rectRadius: 0.10, x: M + 0.28 + sw + 0.16, y: y + 0.14, w: vw, h: rowH - 0.28, fill: { color: 'FFFFFF' }, line: { color: ok ? C.support : C.alert, width: 1.8 },
        fontFace: F.body, fontSize: 14, align: 'center', valign: 'middle', margin: 0, objectName: `wd${i}_v`,
      });
      const fx = M + 0.28 + sw + 0.16 + vw + 0.14;
      s.addText(fix, { shape: S.roundRect, rectRadius: 0.10, x: fx, y: y + 0.10, w: RIGHT - 0.14 - fx, h: rowH - 0.20, fill: { color: ANS }, line: { color: C.accentInk, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 16, objectName: `wd${i}_a` });
    });
    s.addNotes(notes);
    return s;
  }

  /** Finish It Off: rows are [the problem, the partly worked answer with ____ gaps, [the missing words, one per line]]. */
  function weDoFIO({ heading = 'Finish this', subtitle = 'Fill in the blanks.', rows, notes, minutes = 5, rowH = 1.42, size = 13.5, split = 6.70 }) {
    const s = slide('light', minutes, 'We Do');
    title(s, heading); sub(s, subtitle);
    const gap = 0.14, y0 = BODY_Y + 0.22;
    rows.forEach(([prob, work, fin], i) => {
      const y = y0 + i * (rowH + gap);
      card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
      s.addText([{ text: prob, options: { bold: true, color: C.dark, breakLine: true, paraSpaceAfter: 6 } }, { text: work, options: { color: C.ink } }],
        { x: M + 0.28, y, w: split, h: rowH, fontFace: F.body, fontSize: size, valign: 'middle', margin: 0, lineSpacing: size + 4, objectName: `wd${i}_q` });
      s.addText(fin.map((w, k) => ({ text: w, options: { breakLine: k < fin.length - 1 } })), {
        shape: S.roundRect, rectRadius: 0.10, x: M + split + 0.52, y: y + 0.12, w: CW - split - 0.52 - 0.14, h: rowH - 0.24, fill: { color: ANS }, line: { color: C.alert, width: 1.5 },
        color: C.dark, fontFace: F.body, fontSize: 13, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 17, objectName: `wd${i}_a`,
      });
    });
    s.addNotes(notes);
    return s;
  }

  /**
   * Rank And Conquer: four answers to one question, written to differ in quality. `answers` is [{ text, rank (1 = best), reason }] in the
   * order shown (A to D); `upgraded` is the improved version of the answer that holds the main misconception. Clicks: the four rankings (best
   * and worst first is the teacher's choice, so each card has its own click, in rank order), then the upgrade.
   */
  function weDoRC({ question, answers, upgraded, upgradedFrom, notes, minutes = 5 }) {
    const s = slide('light', minutes, 'We Do');
    title(s, 'Rank And Conquer');
    s.addText(question, { x: M, y: TITLE_Y + 0.78, w: CW, h: 0.50, color: C.inkSoft, fontFace: F.body, fontSize: 15.5, italic: true, valign: 'middle', margin: 0, lineSpacing: 19, objectName: 'slide_sub' });
    const gx = 0.26, gy = 0.14, cw = (CW - gx) / 2, ch = 1.74, y0 = TITLE_Y + 1.38;
    answers.forEach((a, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * (cw + gx), y = y0 + row * (ch + gy);
      card(s, { x, y, w: cw, h: ch, name: `rc${i}` });
      s.addShape(S.ellipse, { x: x + 0.18, y: y + 0.16, w: 0.42, h: 0.42, fill: { color: C.dark }, line: { color: C.dark, width: 0 }, objectName: `rc${i}_badge` });
      s.addText('ABCD'[i], { x: x + 0.18, y: y + 0.16, w: 0.42, h: 0.42, color: C.accent, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rc${i}_letter` });
      s.addText(a.text, { x: x + 0.74, y: y + 0.10, w: cw - 0.94, h: 0.98, color: C.ink, fontFace: F.body, fontSize: a.text.length > 140 ? 12.5 : 13.5, valign: 'top', margin: 0, lineSpacing: a.text.length > 140 ? 16 : 17.5, objectName: `rc${i}_t` });
      // the ranking (hidden until its click): a chip in the corner and the reason across the foot of the card
      const rankText = ['1st', '2nd', '3rd', '4th'][a.rank - 1];
      s.addText(rankText, {
        shape: S.roundRect, rectRadius: 0.10, x: x + cw - 0.92, y: y + ch - 0.62, w: 0.74, h: 0.44, fill: { color: a.rank === 1 ? C.support : a.rank === 4 ? C.alert : C.dark }, line: { color: 'FFFFFF', width: 0 },
        color: 'FFFFFF', fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rc${i}_rank`,
      });
      s.addText(a.reason, {
        shape: S.roundRect, rectRadius: 0.10, x: x + 0.18, y: y + ch - 0.66, w: cw - 1.34, h: 0.52, fill: { color: ANS }, line: { color: C.accentInk, width: 1.1 },
        color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true, align: 'left', valign: 'middle', margin: 6, lineSpacing: 14, objectName: `rc${i}_why`,
      });
    });
    const uy = y0 + 2 * ch + gy + 0.14;
    s.addText([{ text: `CONQUER: upgrade ${upgradedFrom}. `, options: { bold: true, color: C.accent } }, { text: upgraded, options: { color: C.tint, bold: true } }], {
      shape: S.roundRect, rectRadius: 0.12, x: M, y: uy, w: CW, h: H - 0.30 - uy, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      fontFace: F.body, fontSize: 13.5, align: 'left', valign: 'middle', margin: 12, lineSpacing: 18, objectName: 'rc_up',
    });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 7. Cold Call */
  function coldCall({ qs, notes, minutes = 6 }) {
    const s = slide('light', minutes, 'Cold Call');
    qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 8. You Do */
  /**
   * The worksheet (three tiers) or the game (three rounds). `cards` is [heading, subheading, body] x 3.
   * `kind`: 'worksheet' (BRONZE / SILVER / GOLD cards) or 'game' (ROUND 1 / 2 / 3, the last one red).
   */
  function youDo({ kind, cards, note, notes, minutes = 14, subtitle = 'Open Google Classroom now.', titleText }) {
    const s = slide('light', minutes, 'You Do');
    s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
    s.addText(titleText || `${lesson} ${kind === 'game' ? 'game' : 'worksheet'}`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, lineSpacing: 31, objectName: 'slide_title' });
    s.addText(subtitle, { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
    const TIER = [['BRONZE', C.alert, 'F8E4DF'], ['SILVER', '6B5B75', 'EFEAF1'], ['GOLD', C.accentInk, 'EEF5DB']];
    const g = 0.30, cw = (CW - 2 * g) / 3;
    cards.forEach(([head, subh, body], i) => {
      const x = M + i * (cw + g);
      const col = kind === 'game' ? (i === 2 ? C.alert : C.accentInk) : TIER[i][1];
      const fill = kind === 'game' ? (i === 2 ? 'F8E4DF' : 'FFFFFF') : TIER[i][2];
      card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill, line: col, lineWidth: 1.6, name: `t${i}` });
      s.addText(kind === 'game' ? head : TIER[i][0], { x: x + 0.26, y: BODY_Y + 0.60, w: cw - 0.52, h: 0.36, color: col, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `t${i}_h` });
      s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.00, w: cw - 0.52, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
      s.addText(body, { x: x + 0.26, y: BODY_Y + 1.46, w: cw - 0.52, h: 1.14, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
    });
    s.addText(note, { x: M, y: BODY_Y + 3.06, w: CW, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note' });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 9. Mark */
  function mark({ gameLine, bullets, notes, minutes = 3 }) {
    const s = slide('light', minutes, 'Mark');
    s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 1.00, w: CW, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 32, bold: true, valign: 'middle', margin: 0, lineSpacing: 38, objectName: 'slide_title' });
    const withGame = !!gameLine;
    if (withGame) {
      card(s, { x: M, y: BODY_Y + 0.52, w: CW, h: 1.20, name: 'mk_game' });
      s.addText([{ text: gameLine[0], options: { bold: true, color: C.accentInk } }, { text: gameLine[1], options: {} }], { x: M + 0.30, y: BODY_Y + 0.52, w: CW - 0.60, h: 1.20, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'mk_game_t' });
    }
    const cy = withGame ? BODY_Y + 1.94 : BODY_Y + 0.52, chh = withGame ? 2.62 : 3.30;
    card(s, { x: M, y: cy, w: CW, h: chh, name: 'mk_card' });
    s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: cy + 0.14, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
    s.addText(bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1, paraSpaceAfter: 6 } })), {
      x: M + 0.30, y: cy + 0.56, w: CW - 0.6, h: chh - 0.62, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t',
    });
    s.addNotes(notes);
    return s;
  }

  /* ----------------------------------------------------------------- 10. Plenary */
  /** `qs` is [statement, 'TRUE' | 'FALSE'] x 5; `closing` is the line along the foot. */
  function plenary({ qs, closing, notes, minutes = 3 }) {
    const s = slide('dark', minutes, 'Plenary');
    title(s, 'True or false?', 'dark');
    const rowH = 0.66, gap = 0.14;
    qs.forEach(([q, v], i) => {
      const y = BODY_Y + 0.20 + i * (rowH + gap);
      s.addShape(S.roundRect, { x: M, y, w: CW - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
      s.addText(q, { x: M + 0.28, y, w: CW - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
      s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? '4FD1C5' : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
    });
    s.addText(closing, { x: M, y: H - 0.86, w: CW, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
    s.addNotes(notes);
    return s;
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
    pptx, S, C, F, W, H, M, RIGHT, CW, PILL_Y, PILL_H, TITLE_Y, BODY_Y, LINE, ANS, PHASES,
    bg, timer, pill, slide, title, sub, card, badge, sentence, kicker, video, pic, hasPic, qGrid,
    doNow, today, hook, weDoSTM, weDoFIO, weDoRC, coldCall, youDo, mark, plenary, write,
  };
};

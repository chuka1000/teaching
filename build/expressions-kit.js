/**
 * Y8 Maths, Algebra: the shared slide furniture for the "Expressions" lessons (8CN), so Lesson 9 looks like
 * Lesson 8. Everything here was lifted from build/from-a-table-to-a-rule.js (Lesson 6) and kept as it was:
 * the 10 x 5.625 canvas, the Number Revision colours, the timer geometry, the Do Now / Cold Call grid with the
 * number and the question on one vertical centre, the worked-example card, the tier cards and the plenary rows.
 *
 *   const K = require('./expressions-kit')({ lesson: 'Area With A Bracket', date: null, subject: 'Y8 Maths · Algebra · Lesson 9 · 8CN' });
 *   const s = K.newSlide(10); K.pill(s, 'Do Now', 10); ...
 *   K.finish();                  // writes out/<lesson>/<lesson>.pptx and prints the phase minutes
 *
 * `date` is the lesson date as printed on the Do Now. null leaves "Date: ____" for the teacher to type.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
const { addTimer } = require('../lib/timer');

module.exports = function create({ lesson, date, subject }) {
  const PAL = THEME.PALETTES.maths;
  const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
  const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);

  const C = {
    dark: '2B2350', accent: 'EC6B58', answer: 'C0392B', card: 'F2F0F8', soft: '5E5A70',
    purple: '5B4FA0', green: '2E8B57', blue: '1F6FB2', white: 'FFFFFF', darkSoft: '3D3470', tintDeep: 'E1DDEF',
  };
  const F = { title: 'Georgia', body: 'Arial', mono: 'Courier New' };
  const W = 10, H = 5.625;
  const TIMER = { x: 0.20, y: 0.20, w: 0.34, h: H - 0.40 };
  const M = 0.85, RIGHT = W - 0.45, CW = RIGHT - M;
  const PILL_Y = 0.30, PILL_H = 0.32, TITLE_Y = 0.78, SUB_Y = 1.36;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Chuka';
  pptx.title = lesson;
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
  function newSlide(minutes, mode) {
    const s = pptx.addSlide();
    s.background = { color: mode === 'dark' ? C.dark : C.white };
    PHASES.push(addTimer(pptx, s, {
      key: 'maths', palette: PAL, minutes, mode: mode || 'light', slideH: H,
      x: TIMER.x, y: TIMER.y, w: TIMER.w, h: TIMER.h,
    }));
    return s;
  }

  function pill(slide, label, minutes, mode) {
    const text = `${label.toUpperCase()} · ${minutes} MIN`;
    slide.addText(text, {
      shape: S.roundRect, rectRadius: 0.14,
      x: M, y: PILL_Y, w: Math.max(1.35, 0.098 * text.length + 0.38), h: PILL_H,
      fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : C.white,
      fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1.2,
      align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
    });
  }
  const title = (slide, text, mode, o = {}) => slide.addText(text, {
    x: M, y: TITLE_Y, w: CW, h: 0.58, color: mode === 'dark' ? C.white : C.dark, fontFace: F.title, fontSize: o.size ?? 28,
    bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  const subtitle = (slide, text) => slide.addText(text, {
    x: M, y: SUB_Y, w: CW, h: 0.26, color: C.soft, fontFace: F.body, fontSize: 11,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  function card(slide, o) {
    slide.addShape(S.roundRect, {
      x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06,
      fill: { color: o.fill || C.card }, line: { color: o.line || o.fill || C.card, width: o.line ? 1.4 : 0 },
      objectName: `${o.name}_bg`,
    });
  }
  function badge(slide, o) {
    slide.addShape(S.ellipse, { x: o.x, y: o.y, w: 0.38, h: 0.38, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.name}_badge` });
    slide.addText(String(o.n), {
      x: o.x, y: o.y, w: 0.38, h: 0.38, color: C.dark, fontFace: F.body, fontSize: 10.5, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num`,
    });
  }
  /** One sentence, the key words underlined. parts = [[text, underline?], ...] */
  function banner(slide, parts, o) {
    slide.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
      shape: S.roundRect, rectRadius: 0.08, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.56,
      fill: { color: C.dark }, line: { color: C.dark, width: 0 }, color: C.white, fontFace: F.body,
      fontSize: o.size ?? 13.5, bold: true, align: 'center', valign: 'middle', margin: 0.08, objectName: o.name,
    });
  }
  /** A colour-coded line of algebra: runs in ONE text box. Arial, not Georgia. */
  function expr(slide, o) {
    slide.addText(o.parts.map(([text, col, size]) => ({
      text, options: { color: col || C.dark, bold: !size, fontFace: F.body, fontSize: size ?? o.size ?? 18 },
    })), { x: o.x, y: o.y, w: o.w, h: o.h ?? 0.34, align: o.align || 'left', valign: 'middle', margin: 0, objectName: o.name });
  }
  const N = (t) => [t, C.dark];
  const L = (t) => [t, C.blue];
  const V = (t) => [t, C.answer];
  const SOFTT = (t) => [t, C.soft];
  const G = (t) => [t, C.green];

  /** A worked example card: a header, then one line of working per click. A line may be {head: 'text'} for a sub-heading. */
  function worked(slide, o) {
    card(slide, { x: o.x, y: o.y, w: o.w, h: o.h, name: o.name });
    slide.addText(o.head, {
      x: o.x + 0.20, y: o.y + 0.08, w: o.w - 0.40, h: 0.30, color: C.soft, fontFace: F.body, fontSize: 11.5,
      bold: true, valign: 'middle', margin: 0, objectName: `${o.name}_h`,
    });
    o.lines.forEach((parts, i) => {
      if (parts.head) {
        slide.addText(parts.head, {
          x: o.x + 0.22, y: o.y + 0.42 + i * (o.step ?? 0.36), w: o.w - 0.40, h: 0.30, color: C.soft, fontFace: F.body, fontSize: 11,
          bold: true, valign: 'middle', margin: 0, objectName: `${o.name}_l${i}`,
        });
        return;
      }
      expr(slide, { x: o.x + 0.22, y: o.y + 0.42 + i * (o.step ?? 0.36), w: o.w - 0.40, h: 0.34, size: o.size ?? 16, parts, name: `${o.name}_l${i}` });
    });
  }
  /** A static two-row table of values: x on top, y underneath. Cells are shapes so it stays crisp. */
  function xyTable(slide, o) {
    const lw = o.lw ?? 0.46, cw = o.cw ?? 0.62, ch = o.ch ?? 0.38;
    [['x', o.xs, C.blue, 'FFFFFF'], ['y', o.ys, C.answer, 'FDEEDC']].forEach(([lab, vals, col, fill], r) => {
      const y = o.y + r * (ch + 0.06);
      slide.addText(lab, { x: o.x, y, w: lw, h: ch, color: col, fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_${lab}_lab` });
      vals.forEach((v, i) => slide.addText(String(v), {
        shape: S.roundRect, rectRadius: 0.05, x: o.x + lw + 0.06 + i * (cw + 0.06), y, w: cw, h: ch,
        fill: { color: fill }, line: { color: C.tintDeep, width: 1 }, color: col, fontFace: F.body, fontSize: o.size ?? 15, bold: true,
        align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_${lab}${i}`,
      }));
    });
  }
  /** The answer cards used by the Do Now and the Cold Call. The number and the question share ONE vertical centre. */
  function qGrid(s, o) {
    const cw = (CW - 0.24) / 2, ch = o.ch, gap = o.gap;
    o.qs.forEach(([q, a], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * (cw + 0.24), y = o.y0 + row * (ch + gap);
      const prev = o.preview === i;           // the preview card is SHADED: warm tint, darker border, white answer box (TEMPLATE.md)
      card(s, { x, y, w: cw, h: ch, name: `${o.p}${i}`, fill: prev ? 'F3E7CB' : undefined, line: prev ? 'A86E32' : undefined });
      const qy = y + 0.08, cy = qy + o.qh / 2;
      s.addText(String(i + 1), { x: x + 0.18, y: cy - 0.21, w: 0.40, h: 0.42, color: C.answer, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `${o.p}${i}_n` });
      s.addText(q, { x: x + 0.66, y: qy, w: cw - 0.86, h: o.qh, color: C.dark, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
      s.addText(a, {
        shape: S.roundRect, rectRadius: 0.09, x: x + 0.18, y: y + ch - 0.52, w: cw - 0.36, h: 0.42,
        fill: { color: prev ? 'FFFFFF' : 'FDEEDC' }, line: { color: prev ? 'A86E32' : C.accent, width: 1.2 }, color: C.dark, fontFace: F.body, fontSize: o.asize ?? 12, bold: true,
        align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
      });
    });
  }
  /** An animation. It starts ON CLICK (spec: effect "play"), so the teacher speaks first. */
  const video = (s, file, x, y, w, h, name) => s.addMedia({
    type: 'video', path: MEDIA(`${file}.mp4`),
    cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'),
    x, y, w, h, objectName: name,
  });

  /** The Do Now furniture: phase pill, lesson title, date, rule. */
  function doNowHead(s) {
    pill(s, 'Do Now', PHASES[PHASES.length - 1]);
    s.addText(lesson, {
      x: lesson.length > 30 ? 2.80 : 2.30, y: 0.14, w: lesson.length > 30 ? 4.60 : 5.40, h: 0.66, color: C.dark, fontFace: F.title, fontSize: lesson.length > 30 ? 17 : lesson.length > 24 ? 22 : 26, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
    });
    s.addText(date || 'Date: ____________', {
      x: RIGHT - 2.30, y: PILL_Y, w: 2.30, h: PILL_H, color: C.soft, fontFace: F.body, fontSize: 11,
      align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
    });
    s.addShape(S.rect, { x: M, y: 0.86, w: CW, h: 0.035, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  }

  /** The Today slide: three objective cards and a banner. */
  function today(goals, bannerParts, notes) {
    const s = newSlide(1);
    pill(s, 'Today', 1);
    title(s, 'Objectives');
    const cw = (CW - 2 * 0.24) / 3;
    goals.forEach((g, i) => {
      const x = M + i * (cw + 0.24);
      card(s, { x, y: 1.74, w: cw, h: 1.92, name: `o${i}` });
      badge(s, { x: x + 0.18, y: 1.92, n: i + 1, name: `o${i}` });
      s.addText(g, { x: x + 0.18, y: 2.44, w: cw - 0.36, h: 0.84, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'top', margin: 0, lineSpacing: 16, objectName: `o${i}_t` });
    });
    banner(s, bannerParts, { y: 3.96, h: 0.56, name: 'obj_banner' });
    s.addNotes(notes);
    return s;
  }

  /** The Hook slide: a question and three option cards. */
  function hook(q, opts, notes, extra) {
    const s = newSlide(2);
    pill(s, 'Hook', 2);
    title(s, 'Which one is right?');
    s.addText(q, { x: M, y: 1.40, w: extra ? CW - 3.30 : CW, h: 0.96, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, lineSpacing: 25, objectName: 'hook_q' });
    if (extra) extra(s);
    const cw = (CW - 2 * 0.24) / 3;
    opts.forEach(([k, txt], i) => {
      const x = M + i * (cw + 0.24);
      card(s, { x, y: 2.88, w: cw, h: 1.14, name: `h${i}` });
      s.addText(k, { x: x + 0.20, y: 3.00, w: 0.40, h: 0.36, color: C.answer, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
      s.addText(txt, { x: x + 0.20, y: 3.38, w: cw - 0.40, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t` });
    });
    s.addNotes(notes);
    return s;
  }

  /** The You Do slide: the three tiers and a note. tiers = [[NAME, head, body, fill], ...]; sub = the line under the title. */
  function youDo(minutes, name, tiers, note, notes, sub = 'Open Google Classroom now.') {
    const s = newSlide(minutes);
    pill(s, 'You Do', minutes);
    s.addImage({ path: GC_LOGO, x: RIGHT - 1.25, y: 0.66, w: 1.25, h: 1.08, transparency: 62, objectName: 'gc_logo' });
    s.addText(name, { x: M, y: 0.72, w: CW - 1.45, h: 0.70, color: C.dark, fontFace: F.title, fontSize: name.length > 40 ? 18 : name.length > 34 ? 20 : 25, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title' });
    s.addText(sub, { x: M, y: 1.44, w: CW - 1.45, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
    const cw = (CW - 2 * 0.24) / 3;
    tiers.forEach(([n, head, body, fill], i) => {
      const x = M + i * (cw + 0.24);
      card(s, { x, y: 2.02, w: cw, h: 1.86, fill, line: C.accent, name: `t${i}` });
      s.addText(n, { x: x + 0.20, y: 2.14, w: cw - 0.40, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
      s.addText(head, { x: x + 0.20, y: 2.46, w: cw - 0.40, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
      s.addText(body, { x: x + 0.20, y: 2.88, w: cw - 0.40, h: 0.90, color: C.soft, fontFace: F.body, fontSize: 11.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `t${i}_b` });
    });
    s.addText(note, { x: M, y: 4.12, w: CW, h: 0.50, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note' });
    s.addNotes(notes);
    return s;
  }

  /** The Mark slide: a checklist card. */
  function mark(items, notes) {
    const s = newSlide(3);
    pill(s, 'Mark', 3);
    s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 0.74, w: CW, h: 0.96, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title' });
    card(s, { x: M, y: 1.86, w: CW, h: 2.74, name: 'mk_card' });
    s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.24, y: 1.96, w: CW - 0.48, h: 0.30, color: C.soft, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
    s.addText(items.map((text, i) => ({ text, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: i < items.length - 1 ? 7 : 0 } })),
      { x: M + 0.24, y: 2.32, w: CW - 0.48, h: 2.16, color: C.dark, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
    s.addNotes(notes);
    return s;
  }

  /** The Plenary: five true/false rows on the dark background, then a closing line. qs = [[statement, 'TRUE'|'FALSE'], ...]. */
  function plenary(qs, closing, notes) {
    const s = newSlide(3, 'dark');
    pill(s, 'Plenary', 3, 'dark');
    title(s, 'True or false?', 'dark');
    const rowH = 0.56, gap = 0.12;
    qs.forEach(([q, v], i) => {
      const y = 1.56 + i * (rowH + gap);
      s.addShape(S.roundRect, { x: M, y, w: CW - 1.35, h: rowH, rectRadius: 0.07, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
      s.addText(q, { x: M + 0.20, y, w: CW - 1.70, h: rowH, color: C.white, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, objectName: `p${i}_q` });
      s.addText(v, { x: RIGHT - 1.20, y, w: 1.20, h: rowH, color: v === 'TRUE' ? '5FCB92' : C.accent, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
    });
    s.addText(closing, { x: M, y: H - 0.66, w: CW, h: 0.40, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
    s.addNotes(notes);
    return s;
  }

  /** The standard "Finish It Off" slide: four columns, '?' cells hide an answer that appears on a click. */
  function finishItOff(o) {
    const s = newSlide(5);
    pill(s, 'We Do', 5);
    title(s, o.title);
    subtitle(s, o.sub);
    const WIDTHS = o.widths, g = (CW - WIDTHS.reduce((a, b) => a + b, 0)) / (WIDTHS.length - 1);
    const xs = WIDTHS.map((_, j) => M + WIDTHS.slice(0, j).reduce((a, b) => a + b, 0) + j * g);
    const HY = 1.70, RY = 1.98, rowH = o.rowH ?? 0.92, rowG = 0.10;
    o.heads.forEach((h, j) => s.addText(h, { x: xs[j], y: HY, w: WIDTHS[j], h: 0.24, color: C.soft, fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1, align: 'center', valign: 'middle', margin: 0, objectName: `wf_h${j}` }));
    o.rows.forEach((row, i) => {
      const y = RY + i * (rowH + rowG);
      row.forEach((cell, j) => {
        const x = xs[j], w = WIDTHS[j];
        const missing = cell[0] === '?';
        const mono = !missing && cell[1] === 'mono';
        s.addText(missing ? '?' : cell[0], {
          shape: S.roundRect, rectRadius: 0.07, x, y, w, h: rowH, fill: { color: missing ? C.card : C.white }, line: { color: missing ? C.dark : C.tintDeep, width: missing ? 1.6 : 1.2, dashType: missing ? 'dash' : 'solid' },
          color: C.dark, fontFace: missing ? F.title : (mono ? F.mono : F.body), fontSize: missing ? 22 : (mono ? 12 : (o.size ?? 12)), bold: missing || mono, align: 'center', valign: 'middle', margin: 6,
          lineSpacing: mono ? 17 : 15, objectName: `wf${i}_${j}_q`,
        });
        if (missing) s.addText(cell[1], { shape: S.roundRect, rectRadius: 0.07, x, y, w, h: rowH, fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.4 }, color: C.dark, fontFace: F.body, fontSize: o.asize ?? 11.5, bold: true, align: 'center', valign: 'middle', margin: 6, lineSpacing: 14.5, objectName: `wf${i}_${j}_a` });
        if (j < WIDTHS.length - 1) s.addText('→', { x: x + w, y: y + rowH / 2 - 0.16, w: g, h: 0.32, color: C.accent, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `wf${i}_${j}_arrow` });
      });
    });
    s.addNotes(o.notes);
    return s;
  }

  function finish() {
    const outDir = path.join(__dirname, '..', 'out', lesson);
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `${lesson}.pptx`);
    return pptx.writeFile({ fileName: out }).then(() => {
      console.log('deck written:', out);
      console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
    });
  }

  return {
    pptx, S, C, F, W, H, M, RIGHT, CW, TIMER, PILL_Y, PILL_H, TITLE_Y, SUB_Y, PHASES,
    newSlide, pill, title, subtitle, card, badge, banner, expr, worked, xyTable, qGrid, video, doNowHead, today, hook, youDo, mark, plenary, finishItOff, finish,
    N, L, V, SOFTT, G, MEDIA, GC_LOGO,
  };
};

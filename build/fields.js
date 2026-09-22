/**
 * Y10 Science — Introduction to Fields.
 * Single, 50 minutes. NOT the standard 10-phase archetype: Chuka asked for
 * an introduction only, with no phase that tests understanding and no
 * worksheet. So this deck has no We Do, Cold Call, You Do or Answers, and
 * the closing slide recaps rather than quizzes.
 *
 * Continues the 'motion' palette from Mass and Weight and Gravitational
 * Fields and Free Fall — same unit, same visual language. Sits after those
 * two: it leans on gravitational field being already secure (W = mg, g in
 * N/kg) and generalises it to "field" as the wider idea, ahead of Electricity
 * and Magnetism being taught in full later.
 *
 * iGCSE-aligned vocabulary: forces are "contact" or "non-contact"; the three
 * non-contact forces at this level are gravitational, electrostatic and
 * magnetic. "Electric field" is the region; "electrostatic force" is what
 * acts in it — both terms appear, matching how the syllabus uses them.
 *
 * Images: assets/photos/iron-filings-bar-magnet.jpg, Benjamin Crowell,
 * CC BY-SA 2.0, via Wikimedia Commons — credited on the Hook slide, where
 * it is used. Icons: assets/icons/*_motion_*.png, rendered locally via
 * tools/make-icons.js (react-icons, no licence needed).
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 1 October 2026';
const LESSON = 'Introduction to Fields';
const PHOTO = path.join(__dirname, '..', 'assets', 'photos', 'iron-filings-bar-magnet.jpg');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_motion_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y10 Physics · Forces · Fields';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

const bg = (slide, mode) => { slide.background = { color: mode === 'dark' ? C.dark : C.tint }; };

function timer(slide, minutes, mode) {
  return addTimer(pptx, slide, {
    key: 'motion', palette: C, minutes, mode, slideH: H,
    x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H,
  });
}

function pill(slide, label, minutes, mode) {
  const text = `${label.toUpperCase()} · ${minutes} MIN`;
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.16,
    x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark },
    color: mode === 'dark' ? C.dark : 'FFFFFF',
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
}
const title = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y, w: RIGHT - M, h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: 32, bold: true,
  valign: 'middle', margin: 0, objectName: 'slide_title',
});
const sub = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y + 0.80, w: RIGHT - M, h: 0.40,
  color: mode === 'dark' ? C.tintDeep : C.inkSoft, fontFace: F.body, fontSize: 16,
  valign: 'middle', margin: 0, objectName: 'slide_sub',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.10,
    fill: { color: o.fill || 'FFFFFF' },
    line: { color: o.line || 'D8DEEC', width: o.lineWidth || 1.3 },
    objectName: `${o.name}_bg`,
  });
}
function badge(slide, o) {
  slide.addShape(S.ellipse, {
    x: o.x, y: o.y, w: 0.42, h: 0.42,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.name}_badge`,
  });
  slide.addText(String(o.n), {
    x: o.x, y: o.y, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num`,
  });
}

/** One radiating arrow, from (x1,y1) to (x2,y2), arrowhead at the end. */
function arrowLine(slide, x1, y1, x2, y2, o) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1) || 0.001, h = Math.abs(y2 - y1) || 0.001;
  let flipH = false, flipV = false;
  const dx = x2 - x1, dy = y2 - y1;
  if (Math.abs(dx) < 0.0001) {
    flipV = y1 > y2;
  } else if (Math.abs(dy) < 0.0001) {
    flipH = x1 > x2;
  } else if ((dx > 0) === (dy > 0)) {
    if (x1 > x2) { flipH = true; flipV = true; }
  } else if (x1 > x2) { flipH = true; } else { flipV = true; }
  slide.addShape(S.line, {
    x, y, w, h, flipH, flipV,
    line: { color: o.color, width: o.width || 2.2, endArrowType: 'triangle', beginArrowType: 'none' },
    objectName: o.name,
  });
}

/** A point source with n arrows radiating in ('in') or out ('out'). */
function fieldDiagram(slide, o) {
  const { cx, cy, r0, r1, n, dir, color, name, label } = o;
  slide.addShape(S.ellipse, {
    x: cx - r0, y: cy - r0, w: r0 * 2, h: r0 * 2,
    fill: { color }, line: { color, width: 0 }, objectName: `${name}_core`,
  });
  slide.addText(label, {
    x: cx - r0, y: cy - r0, w: r0 * 2, h: r0 * 2, color: 'FFFFFF', fontFace: F.body,
    fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${name}_lbl`,
  });
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * 2 * Math.PI;
    const ux = Math.cos(ang), uy = Math.sin(ang);
    const xA = cx + ux * r0, yA = cy + uy * r0;
    const xB = cx + ux * r1, yB = cy + uy * r1;
    if (dir === 'out') arrowLine(slide, xA, yA, xB, yB, { color, name: `${name}_ln${i}` });
    else arrowLine(slide, xB, yB, xA, yA, { color, name: `${name}_ln${i}` });
  }
}

const PHASES = [];

/* ================================================================== *
 * 1. DO NOW · 8
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 8, 'light'));
  pill(s, 'Do Now', 8, 'light');

  s.addText(LESSON, {
    x: 3.60, y: 0.22, w: 5.90, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 24,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText(DATE, {
    x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body,
    fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addShape(S.rect, {
    x: M, y: 0.98, w: RIGHT - M, h: 0.04,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule',
  });

  const QS = [
    ['State what g stands for, and its value near Earth\'s surface.', 'Gravitational field strength, g ≈ 9.8 N/kg.'],
    ['Find the weight of a 4 kg mass.', '4 × 9.8 = 39.2 N'],
    ['Name a force that needs objects to touch.', 'Friction (or any push or pull).'],
    ['State whether gravity needs objects to touch.', 'No. It acts without contact.'],
    ['Recall what surrounds every mass, from the last topic.', 'A gravitational field.'],
    ['State the unit of gravitational field strength.', 'N/kg'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `d${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 1.00, w: cw - 0.44, h: 0.48,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 8 minutes. Six clicks.\n\n'
    + 'Q3 AND Q4 ARE THE BRIDGE. "No contact" is the exact phrase today builds on. If it does not come up unprompted, say it yourself when you reveal Q4\'s answer.\n\n'
    + 'Q1, Q2, Q5 AND Q6 ARE STRAIGHT RETRIEVAL from Gravitational Fields and Free Fall. This lesson leans on all of it being secure. It does not re-teach mass, weight or g.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Learning Objectives', 'light');

  const GOALS = [
    'Explain what a field is, and the difference between contact and non-contact forces.',
    'Name the three fields studied at this level: gravitational, electric and magnetic.',
    'Interpret a field diagram: what the arrows and the spacing of the lines show.',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t`,
    });
  });
  s.addText('One idea. Three fields.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THIS IS AN INTRODUCTION, NOT A TEST OF IT. Say that plainly: no worksheet today, and nothing at the end checks recall. The point is to leave with the shape of the idea, ready for Electricity and Magnetism to fill it in properly.\n\n'
    + 'The banner is the whole lesson: one concept (a field), applied three times.'
  );
}

/* ================================================================== *
 * 3. HOOK · 4
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 4, 'light'));
  pill(s, 'Hook', 4, 'light');
  s.addText('Nothing is touching this pattern into place.', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.00, color: C.dark, fontFace: F.title, fontSize: 30,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 37, objectName: 'slide_title',
  });
  s.addText('What is making it?', {
    x: M, y: 1.92, w: RIGHT - M, h: 0.40, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const imgY = BODY_Y + 0.30;
  const imgW = 5.85, imgH = imgW * (903 / 1280);
  s.addImage({ path: PHOTO, x: M, y: imgY, w: imgW, h: imgH, objectName: 'hook_photo' });
  s.addText('Iron filings around a hidden bar magnet. Photo: Benjamin Crowell, CC BY-SA 2.0, via Wikimedia Commons.', {
    x: M, y: imgY + imgH + 0.06, w: imgW, h: 0.42, color: C.inkSoft, fontFace: F.body,
    fontSize: 9, italic: true, valign: 'top', margin: 0, objectName: 'hook_credit',
  });

  const rx = M + imgW + 0.45, rw = RIGHT - rx;
  card(s, { x: rx, y: imgY + 0.25, w: rw, h: 2.30, name: 'hook_reveal' });
  s.addText('A bar magnet, hidden under the paper.', {
    x: rx + 0.30, y: imgY + 0.50, w: rw - 0.60, h: 0.90, color: C.dark, fontFace: F.title,
    fontSize: 21, bold: true, valign: 'top', margin: 0, lineSpacing: 26, objectName: 'hook_reveal_t',
  });
  s.addText('The iron filings line up along its magnetic field. You are looking at a field.', {
    x: rx + 0.30, y: imgY + 1.38, w: rw - 0.60, h: 1.00, color: C.inkSoft, fontFace: F.body,
    fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'hook_reveal_n',
  });
  s.addNotes(
    'HOOK. 4 minutes. One click.\n\n'
    + 'LET THEM GUESS BEFORE THE CLICK. Iron filings, a hidden magnet, a compass under the paper. Most classes get there.\n\n'
    + 'THE POINT: nothing is touching the filings, yet something is clearly acting on them in a very precise pattern. That "something, acting without touching, in a pattern you can map" is the whole lesson in one photo.\n\n'
    + 'SAY THE WORD "FIELD" HERE, on this slide, before I Do defines it formally. They have just watched one.'
  );
}

/* ================================================================== *
 * 4. I DO · 6 — contact vs non-contact
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 6, 'light'));
  pill(s, 'I Do', 6, 'light');
  title(s, 'Some forces need contact. Some do not.', 'light');

  card(s, { x: M, y: BODY_Y + 0.05, w: RIGHT - M, h: 0.82, name: 'def' });
  s.addText('A field is a region of space where an object feels a force, without anything touching it.', {
    x: M + 0.28, y: BODY_Y + 0.05, w: RIGHT - M - 0.56, h: 0.82, color: C.dark, fontFace: F.body,
    fontSize: 16.5, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'def_t',
  });

  const cw = (RIGHT - M - 0.30) / 2, colY = BODY_Y + 1.08, colH = 2.55;
  card(s, { x: M, y: colY, w: cw, h: colH, name: 'ctA' });
  s.addText('CONTACT', {
    x: M + 0.26, y: colY + 0.20, w: cw - 0.52, h: 0.38, color: C.inkSoft, fontFace: F.body,
    fontSize: 14, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'ctA_h',
  });
  s.addText(
    '•  Friction\n•  A push or a pull\n•  The normal (support) force\n•  Tension in a string',
    {
      x: M + 0.26, y: colY + 0.66, w: cw - 0.52, h: 1.70, color: C.ink, fontFace: F.body,
      fontSize: 16, valign: 'top', margin: 0, lineSpacing: 30, objectName: 'ctA_list',
    },
  );

  const rx = M + cw + 0.30;
  card(s, { x: rx, y: colY, w: cw, h: colH, name: 'ctB' });
  s.addText('NON-CONTACT (FIELDS)', {
    x: rx + 0.26, y: colY + 0.20, w: cw - 0.52, h: 0.38, color: C.accentInk, fontFace: F.body,
    fontSize: 14, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'ctB_h',
  });
  const NC = [['globe', 'Gravitational force'], ['bolt', 'Electrostatic force'], ['magnet', 'Magnetic force']];
  NC.forEach(([icon, label], i) => {
    const ry = colY + 0.68 + i * 0.62;
    s.addImage({ path: ICON(icon, 'accentInk'), x: rx + 0.26, y: ry, w: 0.36, h: 0.36, objectName: `ctB_r${i}_icon` });
    s.addText(label, {
      x: rx + 0.74, y: ry, w: cw - 1.00, h: 0.36, color: C.ink, fontFace: F.body,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `ctB_r${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 6 minutes. Three clicks: the definition, then the two columns.\n\n'
    + '"WITHOUT ANYTHING TOUCHING IT" IS THE WHOLE DEFINITION. Point back at the Hook photo when you read it out. The filings and the magnet never touch.\n\n'
    + 'STUDENTS WILL WANT TO ADD AIR RESISTANCE OR UPTHRUST to the contact list, since they involve no obvious touching either. Both are contact forces (collisions with air or liquid molecules), worth a one-line aside if it comes up, but not the focus today.\n\n'
    + '"ELECTROSTATIC", NOT JUST "ELECTRIC", IS THE FORCE\'S NAME. Say both terms and note "electric field" is the region it acts in. That distinction matches how it will be worded in the Electricity unit.'
  );
}

/* ================================================================== *
 * 5. I DO · 9 — three fields compared
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 9, 'light'));
  pill(s, 'I Do', 9, 'light');
  title(s, 'Three fields at this level', 'light');

  const FIELDS = [
    {
      icon: 'globe', name: 'Gravitational', acts: 'Any mass',
      source: 'Any object with mass', example: 'Why planets orbit the Sun',
    },
    {
      icon: 'bolt', name: 'Electric', acts: 'Any electric charge',
      source: 'A charged object', example: 'A balloon sticking to a wall after rubbing it',
    },
    {
      icon: 'magnet', name: 'Magnetic', acts: 'Magnetic materials, or another magnet',
      source: 'A magnet, or a current-carrying wire', example: 'A compass needle pointing north',
    },
  ];
  const cw = (RIGHT - M - 2 * 0.24) / 3, cardY = BODY_Y + 0.05, cardH = 4.55;
  FIELDS.forEach((fd, i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: cardY, w: cw, h: cardH, name: `fc${i}` });
    s.addImage({ path: ICON(fd.icon, 'accentInk'), x: x + 0.24, y: cardY + 0.22, w: 0.52, h: 0.52, objectName: `fc${i}_icon` });
    s.addText(fd.name, {
      x: x + 0.90, y: cardY + 0.22, w: cw - 1.10, h: 0.52, color: C.dark, fontFace: F.title,
      fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `fc${i}_h`,
    });
    s.addShape(S.rect, {
      x: x + 0.24, y: cardY + 0.94, w: cw - 0.48, h: 0.02,
      fill: { color: 'D8DEEC' }, line: { color: 'D8DEEC', width: 0 }, objectName: `fc${i}_rule`,
    });
    const ROWS = [['Acts on', fd.acts], ['Source', fd.source], ['Example', fd.example]];
    ROWS.forEach(([label, val], j) => {
      const ry = cardY + 1.18 + j * 1.10;
      s.addText(label.toUpperCase(), {
        x: x + 0.24, y: ry, w: cw - 0.48, h: 0.30, color: C.inkSoft, fontFace: F.body,
        fontSize: 11, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `fc${i}_r${j}_l`,
      });
      s.addText(val, {
        x: x + 0.24, y: ry + 0.30, w: cw - 0.48, h: 0.70, color: C.ink, fontFace: F.body,
        fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 18, objectName: `fc${i}_r${j}_v`,
      });
    });
  });
  s.addNotes(
    'I DO. 9 minutes. Three clicks, one card at a time.\n\n'
    + 'READ EACH CARD IN THE SAME ORDER: acts on, source, example. That repetition is what lets "field" generalise instead of feeling like three unrelated facts.\n\n'
    + 'GRAVITATIONAL IS ALREADY FAMILIAR. Spend the least time there and use it as the anchor: "same idea as last lesson, new name for the general case."\n\n'
    + 'THE BALLOON EXAMPLE IS ONE MOST STUDENTS HAVE DONE. If anyone has a balloon, this is worth 30 seconds live rather than just described.\n\n'
    + 'A COMPASS NEEDLE IS A SMALL MAGNET. It turns to line up with the field it is sitting in. That is worth saying explicitly, it comes back in the next slide and in the Discuss activity.'
  );
}

/* ================================================================== *
 * 6. I DO · 7 — field lines
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 7, 'light'));
  pill(s, 'I Do', 7, 'light');
  title(s, 'Field lines show direction and strength', 'light');
  sub(s, 'Arrows show the direction of the force. Closer lines mean a stronger field.', 'light');

  const cw = (RIGHT - M - 2 * 0.24) / 3, colY = BODY_Y + 0.55;

  // Column 1 — gravitational, arrows in
  {
    const x = M, cx = x + cw / 2, cy = colY + 1.55;
    s.addText('Gravitational', {
      x, y: colY - 0.50, w: cw, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 16,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'fl0_h',
    });
    fieldDiagram(s, { cx, cy, r0: 0.30, r1: 1.35, n: 8, dir: 'in', color: C.accentInk, name: 'g', label: 'm' });
    s.addText('Lines point toward the mass.', {
      x, y: cy + 1.55, w: cw, h: 0.60, color: C.inkSoft, fontFace: F.body, fontSize: 12.5,
      align: 'center', valign: 'top', margin: 0, lineSpacing: 16, objectName: 'fl0_cap',
    });
  }

  // Column 2 — electric, arrows out
  {
    const x = M + cw + 0.24, cx = x + cw / 2, cy = colY + 1.55;
    s.addText('Electric', {
      x, y: colY - 0.50, w: cw, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 16,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'fl1_h',
    });
    fieldDiagram(s, { cx, cy, r0: 0.30, r1: 1.35, n: 8, dir: 'out', color: C.alert, name: 'e', label: '+' });
    s.addText('Lines point away from a positive charge.', {
      x, y: cy + 1.55, w: cw, h: 0.60, color: C.inkSoft, fontFace: F.body, fontSize: 12.5,
      align: 'center', valign: 'top', margin: 0, lineSpacing: 16, objectName: 'fl1_cap',
    });
  }

  // Column 3 — magnetic, the Hook photo again
  {
    const x = M + 2 * (cw + 0.24), cx = x + cw / 2;
    s.addText('Magnetic', {
      x, y: colY - 0.50, w: cw, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 16,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'fl2_h',
    });
    const tw = cw - 0.30, th = tw * (903 / 1280);
    s.addImage({ path: PHOTO, x: cx - tw / 2, y: colY + 0.10, w: tw, h: th, objectName: 'fl2_photo' });
    s.addText('Curved lines from north to south pole. This is what you saw in the Hook.', {
      x, y: colY + 0.10 + th + 0.10, w: cw, h: 0.70, color: C.inkSoft, fontFace: F.body, fontSize: 12.5,
      align: 'center', valign: 'top', margin: 0, lineSpacing: 16, objectName: 'fl2_cap',
    });
  }
  s.addNotes(
    'I DO. 7 minutes. Three clicks, one diagram at a time.\n\n'
    + 'THE ARROW\'S DIRECTION IS THE DIRECTION OF THE FORCE on a small test object placed there: a test mass for gravity, a small positive charge for electric. Say "test object" explicitly; it is the idea that makes the diagrams readable rather than decorative.\n\n'
    + 'WHY GRAVITY POINTS IN AND (POSITIVE) ELECTRIC POINTS OUT: gravity always attracts, so the force pulls a test mass toward the source; a positive charge repels another positive test charge, so the force pushes it away. Do not go further into negative charges today. That is Electricity\'s job.\n\n'
    + 'THE MAGNETIC COLUMN IS THE HOOK, NAMED. Point out that the curved iron-filing pattern IS a set of field lines, exactly like the two diagrams either side of it, just curved because a magnet has two poles instead of one point source.\n\n'
    + 'SPACING = STRENGTH: the lines are close together near the source and spread out further away. That spreading out is a stronger field near the source and a weaker one far from it.'
  );
}

/* ================================================================== *
 * 7. DISCUSS · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Discuss', 10, 'light');
  title(s, 'Where else have you seen a field?', 'light');
  sub(s, 'Talk with your table. Which type is each one?', 'light');

  const SCEN = [
    ['compass', 'A compass needle always points north.', 'MAGNETIC'],
    ['globe', 'The sea rises and falls with the tides.', 'GRAVITATIONAL'],
    ['bolt', 'Pulling off a jumper gives you a static shock.', 'ELECTRIC'],
    ['magnet', 'A magnet holds a note to the fridge.', 'MAGNETIC'],
    ['satellite', 'A satellite stays in orbit around the Earth.', 'GRAVITATIONAL'],
    ['atom', 'A charged balloon makes your hair stand up.', 'ELECTRIC'],
  ];
  const cw = (RIGHT - M - 2 * 0.24) / 3, ch = 1.92, gap = 0.18;
  SCEN.forEach(([icon, text, ans], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (cw + 0.24), y = BODY_Y + 0.55 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `sc${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + 0.20, y: y + 0.18, w: 0.40, h: 0.40, objectName: `sc${i}_icon` });
    s.addText(text, {
      x: x + 0.20, y: y + 0.66, w: cw - 0.40, h: 0.72, color: C.ink, fontFace: F.body,
      fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `sc${i}_t`,
    });
    s.addText(ans, {
      shape: S.roundRect, rectRadius: 0.08,
      x: x + 0.20, y: y + ch - 0.46, w: cw - 0.40, h: 0.34,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.2 },
      color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true, charSpacing: 0.6,
      align: 'center', valign: 'middle', margin: 0, objectName: `sc${i}_a`,
    });
  });
  s.addNotes(
    'DISCUSS. 10 minutes. Not marked, not on the worksheet, there isn\'t one today. Let the room talk before any reveal.\n\n'
    + 'GO TABLE BY TABLE FIRST, THEN REVEAL TOGETHER. The value is in the arguing, not the answer. A table that reasons "the shock happens when your hand gets close before it touches, so it can\'t be contact" has understood the lesson better than one that guesses right immediately.\n\n'
    + 'THE FRIDGE MAGNET AND THE COMPASS ARE BOTH MAGNETIC BUT LOOK DIFFERENT. One holds something up against gravity, one just turns. Worth asking directly: "what do they have in common?" Answer: both involve one magnet (or magnetic material) responding to another magnet\'s field.\n\n'
    + 'IF TIME IS SHORT, DROP TO FOUR CARDS rather than rushing all six. The discussion matters more than covering every example.'
  );
}

/* ================================================================== *
 * 8. CLOSING · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 5, 'dark'));
  pill(s, 'Closing', 5, 'dark');
  title(s, 'Where fields go from here', 'dark');

  const ROWS = [
    ['globe', 'Gravitational: you already know this one. W = mg, g ≈ 9.8 N/kg.'],
    ['bolt', 'Electric: full detail when we reach Electricity.'],
    ['magnet', 'Magnetic: full detail when we reach Magnetism.'],
  ];
  const rowH = 0.86, gap = 0.20;
  ROWS.forEach(([icon, text], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M, h: rowH, rectRadius: 0.10,
      fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `cl${i}_bg`,
    });
    s.addImage({ path: ICON(icon, 'white'), x: M + 0.24, y: y + (rowH - 0.44) / 2, w: 0.44, h: 0.44, objectName: `cl${i}_icon` });
    s.addText(text, {
      x: M + 0.90, y, w: RIGHT - M - 1.10, h: rowH, color: C.tint, fontFace: F.body,
      fontSize: 16, valign: 'middle', margin: 0, objectName: `cl${i}_t`,
    });
  });
  s.addText('Three different causes, one picture every time: a field, shown with field lines.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'CLOSING. 5 minutes. Four clicks. A recap, not a check, nothing here is scored.\n\n'
    + 'ROW 1 IS THE REASSURANCE: nothing new to learn about gravity today, it was the worked example for everything else.\n\n'
    + 'ROWS 2 AND 3 ARE A PROMISE, NOT A GAP. Say directly that electric and magnetic fields get their own full lessons later, with their own calculations. Today was only ever meant to introduce the shape of the idea.\n\n'
    + 'THE CLOSING LINE IS THE ONE SENTENCE WORTH THEM REMEMBERING. If nothing else survives the lesson, this should.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

/**
 * Y10 Science — Density.
 * Single, 50 minutes. Standard archetype, no deviation needed.
 *
 * Follows reference/Weight and Gravity.pptx (Gravitational Fields and Free
 * Fall). New unit — matter, not forces or kinematics — so a new palette,
 * 'density' ("Ballast"), rather than carrying 'motion' forward. Mass in kg
 * is already secure from the last two lessons; this deck leans on that
 * rather than re-teaching it.
 *
 * AVOID, per the brief: no mention of a practical this lesson — the density
 * methods (regular solid, liquid, irregular solid by displacement) are
 * taught as worked method + calculation, not as something done today. Every
 * numeric answer checked with sympy before it went on a slide or the
 * worksheet.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('density');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Tuesday 29 September 2026';
const LESSON = 'Density';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y10 Physics · Matter · Density';

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
    key: 'density', palette: C, minutes, mode, slideH: H,
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
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: 34, bold: true,
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

const PHASES = [];

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');

  s.addText(LESSON, {
    x: 4.20, y: 0.22, w: 5.20, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 26,
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
    ['Find the volume of a cuboid measuring 4 cm by 2 cm by 3 cm.', '4 × 2 × 3 = 24 cm³'],
    ['State the unit of mass.', 'Kilograms (kg).'],
    ['Find the weight of a 5 kg mass.', '5 × 9.8 = 49 N'],
    ['Name the equipment used to measure the volume of a liquid.', 'A measuring cylinder.'],
    ['Convert 2 m into cm.', '200 cm'],
    ['State the unit used for the volume of a small object.', 'cm³ (cubic centimetres).'],
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
      fill: { color: 'FFEEE4' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 15, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'Q1 IS THE ONE THAT MATTERS MOST. Cuboid volume comes straight back in I Do 1. If this stalls, that is the five minutes to spend before moving on.\n\n'
    + 'Q3 IS RETRIEVAL FROM GRAVITATIONAL FIELDS AND FREE FALL. g stays at 9.8, same as last lesson.\n\n'
    + 'Q4 AND Q6 seed today\'s vocabulary: measuring cylinder, cm³. Neither has been used yet this term.\n\n'
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
    'Define density as mass per unit volume, and use ρ = m ÷ V.',
    'Describe how to find the density of a liquid, a regular solid, and an irregular solid that sinks.',
    'Decide whether an object floats or sinks, from density data.',
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
  s.addText('Same size, different mass. That is density.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes('TODAY. 1 minute. Four clicks. The banner is the whole lesson in one line: two objects can be the same size and have very different masses. Density is what measures that.');
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('A steel ship floats. A steel marble sinks.', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 32,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 40, objectName: 'slide_title',
  });
  s.addText('Why?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'The ship is hollow. It is mostly air.'], ['B', 'Steel changes when it is shaped into a ship.'], ['C', 'The ship weighs less than the marble.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 0.66, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board.\n\n'
    + 'ANSWER: A. The ship\'s steel hull encloses a huge volume of air, so its average density (mass over the whole hull-plus-air volume) is less than water\'s. A solid marble is steel all the way through.\n\n'
    + 'C IS THE TRAP. The ship weighs far more than the marble in total, so "lighter" cannot be the reason it floats. That is the point to land before I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — defining density
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Density is mass per unit volume', 'light');

  card(s, { x: M, y: BODY_Y + 0.20, w: RIGHT - M, h: 1.10, name: 'eq' });
  s.addText('ρ = m ÷ V', {
    x: M + 0.30, y: BODY_Y + 0.20, w: 3.40, h: 1.10, color: C.dark, fontFace: F.title,
    fontSize: 34, bold: true, valign: 'middle', margin: 0, objectName: 'eq_e',
  });
  s.addText('mass ÷ volume', {
    x: M + 3.90, y: BODY_Y + 0.20, w: RIGHT - M - 3.90 - 0.30, h: 1.10, color: C.inkSoft,
    fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, objectName: 'eq_note',
  });

  const UNITS = [
    ['g/cm³', 'For small objects: a stone, a block, a small volume of liquid.'],
    ['kg/m³', 'For large objects: a room of air, a cubic metre of concrete.'],
  ];
  const cw = (RIGHT - M - 0.30) / 2;
  UNITS.forEach(([u, note], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 1.52;
    card(s, { x, y, w: cw, h: 1.30, name: `un${i}` });
    s.addText(u, {
      x: x + 0.24, y: y + 0.12, w: cw - 0.48, h: 0.48, color: C.accentInk, fontFace: F.title,
      fontSize: 22, bold: true, valign: 'middle', margin: 0, objectName: `un${i}_u`,
    });
    s.addText(note, {
      x: x + 0.24, y: y + 0.60, w: cw - 0.48, h: 0.64, color: C.ink, fontFace: F.body,
      fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 18, objectName: `un${i}_n`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the equation, then the two unit cards.\n\n'
    + '"MASS PER UNIT VOLUME" MEANS "how much mass is packed into each cm³ (or m³)". Say it that way at least once. The phrase alone does not land for most students.\n\n'
    + 'CONVERSION, IF IT COMES UP: 1 g/cm³ = 1000 kg/m³. Not needed for today\'s calculations, but worth having ready.\n\n'
    + 'THIS CLASS HAS ALREADY MET MASS (kg) FROM THE LAST TWO LESSONS. Do not re-teach it. Volume is the new idea here.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — three ways to find it
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Three ways to find volume', 'light');

  const METHODS = [
    {
      n: 'Regular solid', steps: ['Measure the sides with a ruler.', 'Calculate V (l × w × h).', 'Weigh it on a balance.'],
      calc: '180 g ÷ 24 cm³ = 7.5 g/cm³',
    },
    {
      n: 'Liquid', steps: ['Weigh the empty container.', 'Weigh the container and liquid.', 'Subtract, then measure V with a cylinder.'],
      calc: '80 g ÷ 100 cm³ = 0.8 g/cm³',
    },
    {
      n: 'Irregular solid (sinks)', steps: ['Note the water level in a cylinder.', 'Lower the object in fully.', 'The rise in level is its volume.'],
      calc: '26 g ÷ 10 cm³ = 2.6 g/cm³',
    },
  ];
  const cw = (RIGHT - M - 2 * 0.24) / 3;
  METHODS.forEach((m, i) => {
    const x = M + i * (cw + 0.24), y = BODY_Y + 0.10;
    card(s, { x, y, w: cw, h: 2.30, name: `me${i}` });
    s.addText(m.n, {
      x: x + 0.22, y: y + 0.14, w: cw - 0.44, h: 0.48, color: C.dark, fontFace: F.title,
      fontSize: 15.5, bold: true, valign: 'middle', margin: 0, objectName: `me${i}_h`,
    });
    const stepsText = m.steps.map((s2, j) => `${j + 1}. ${s2}`).join('\n');
    s.addText(stepsText, {
      x: x + 0.22, y: y + 0.66, w: cw - 0.44, h: 0.94, color: C.ink, fontFace: F.body,
      fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `me${i}_s`,
    });
    s.addText(m.calc, {
      shape: S.roundRect, rectRadius: 0.08,
      x: x + 0.18, y: y + 1.68, w: cw - 0.36, h: 0.48,
      fill: { color: 'FFEEE4' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.04, objectName: `me${i}_c`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks, one per method.\n\n'
    + 'THIS IS DESCRIBED, NOT DEMONSTRATED. The practical for this cannot happen before next week, so talk through each method with the numbers rather than running it live. Say that plainly if anyone asks.\n\n'
    + 'THE THIRD CARD IS THE ONE THAT NEEDS THE MOST TIME. "The rise in level IS the volume" is the idea students most often get backwards. Some will try to read the volume off the final level alone rather than the rise.\n\n'
    + 'ALL THREE METHODS END THE SAME WAY: mass ÷ volume. That repetition is deliberate.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"Density = volume ÷ mass."', 'Density = mass ÷ volume (ρ = m ÷ V).'],
    ['"The unit of density is kg."', 'The unit of density is g/cm³ or kg/m³.'],
    ['"A bigger object is always denser."', 'Size does not decide density. A big block of foam is less dense than a small pebble.'],
    ['"If an object is heavy, it sinks."', 'Whether it sinks depends on density compared with the liquid, not on weight alone.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 16,
      valign: 'middle', margin: 0, lineSpacing: 21, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 7.10, y: y + 0.10, w: RIGHT - (M + 7.10) - 0.10, h: 0.72,
      fill: { color: 'FFEEE4' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS THE FORMULA FLIP, the single most common error today. Some will confidently divide the wrong way round.\n\n'
    + 'ROW 3 AND ROW 4 BOTH ATTACK THE SAME MISCONCEPTION AS THE HOOK: size and weight are not density. Refer back to the ship if either row stalls.\n\n'
    + 'ROW 4 IS THE HOOK, IN WORDS. If this lands cleanly, the ship answer will make sense properly rather than just being memorised.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 6, 'light'));
  pill(s, 'Cold Call', 6, 'light');

  const QS = [
    ['Define density in one sentence.', 'Mass per unit volume.'],
    ['State the equation for density.', 'ρ = m ÷ V'],
    ['Find the density of a 63 g object with a volume of 9 cm³.', '63 ÷ 9 = 7 g/cm³'],
    ['Name the equipment used to find the volume of an irregular solid that sinks.', 'A measuring cylinder, by displacement.'],
    ['State what decides whether an object floats or sinks.', 'Its density compared with the liquid\'s density.'],
    ['Find the volume of a stone that raises a cylinder\'s level from 50 cm³ to 66 cm³.', '66 − 50 = 16 cm³'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'FFEEE4' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 15, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 WANTS THE DEFINITION, not the equation. If a student answers "ρ = m ÷ V" to Q1, that is Q2\'s answer. Push once: "say it in words."\n\n'
    + 'Q3 IS THE FIRST TIMED CALCULATION. Watch for the formula flip from We Do.\n\n'
    + 'Q6 CHECKS DISPLACEMENT SPECIFICALLY. They need this exact skill on the worksheet\'s Gold questions.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');

  s.addImage({
    path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47,
    transparency: 62, objectName: 'gc_logo',
  });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 30, bold: true, valign: 'middle', margin: 0, lineSpacing: 36, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FFEBE4', 'Substitute', 'Use ρ = m ÷ V directly.'],
    ['SILVER', '6E838A', 'F1F4F4', 'Rearrange', 'Find mass or volume from density, or find density from liquid data.'],
    ['GOLD', C.accentInk, 'FFEEE4', 'Decide', 'Use displacement to find volume, then compare densities to decide float or sink.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.00, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, {
      x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body,
      fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(subh, {
      x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 0.90, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Units every time: g/cm³ or kg/m³. Show your working line by line.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which way round does the divide go?"\n\n'
    + 'WHERE THEY WILL STALL: Gold Q9, reading the displacement rise from two given levels rather than the smaller one alone. Point them back to I Do 2\'s third card if they freeze.\n\n'
    + 'AT 3 MINUTES REMAINING, stop them. Answers are on the next slide.'
  );
}

/* ================================================================== *
 * 9. ANSWERS · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'Answers', 3, 'light');
  title(s, 'Answers', 'light');

  const ANS = [
    ['1', '24 ÷ 3 = 8.0 g/cm³'],
    ['2', '100 ÷ 20 = 5.0 g/cm³'],
    ['3', 'g/cm³ or kg/m³; mass packed into each unit of volume'],
    ['4', 'V = 96 ÷ 8 = 12 cm³'],
    ['5', 'm = 2.5 × 40 = 100 g'],
    ['6', 'mass = 118 − 38 = 80 g, so density = 80 ÷ 80 = 1.0 g/cm³'],
    ['7', '85 − 60 = 25 cm³'],
    ['8', '200 ÷ 25 = 8.0 g/cm³'],
    ['9', 'Ice floats (0.92 < 1.0). Aluminium sinks (2.7 > 1.0).'],
    ['10', 'The ship\'s shape spreads its mass over a much bigger volume, so its average density is less than water\'s.'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, rowH = 0.72, gap = 0.10;
  ANS.forEach(([n, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 2.00 + row * (rowH + gap);
    card(s, { x, y, w: cw, h: rowH, name: `a${i}` });
    s.addText(n, {
      x: x + 0.24, y, w: 0.50, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `a${i}_n`,
    });
    s.addText(a, {
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 13,
      valign: 'middle', margin: 0, lineSpacing: 17, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q9 AND Q10 ARE THE CONCEPTUAL PAYOFF. Q10 should come easily if the Hook and Row 4 of We Do both landed. If it does not, that is worth five minutes at the start of next lesson.\n\n'
    + 'Q7 AND Q8 use the same displacement data. Do not let anyone skip straight to Q8 without the working from Q7.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');

  const QS = [
    ['Density is mass per unit volume.', 'TRUE'],
    ['The unit of density can be written as g/cm³.', 'TRUE'],
    ['A heavier object always sinks.', 'FALSE'],
    ['The volume of an irregular solid can be found by displacement.', 'TRUE'],
    ['An object floats if its density is greater than the liquid\'s density.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
    });
    s.addText(q, {
      x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body,
      fontSize: 16, valign: 'middle', margin: 0, objectName: `p${i}_q`,
    });
    s.addText(v, {
      x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent,
      fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle',
      margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('Compare densities, not weights, to predict floating or sinking.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q3 AND Q5 ARE THE MISCONCEPTIONS FROM WE DO AND THE HOOK, ASKED DIRECTLY. If either is wrong, that is the first five minutes of next lesson.\n\n'
    + 'Q4 CHECKS THE METHOD, NOT JUST THE VOCABULARY. Ask a follow-up: "what do you actually measure to get that volume?"\n\n'
    + 'The closing line is the habit to leave them with.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

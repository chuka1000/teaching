/**
 * Y7 Science, Scientific Research and Technology, Lesson 3: Burning Food.
 * Single, 50 minutes. Class 7B. Signal palette, carried on from
 * Fair Tests and Variables (Lesson 2).
 *
 * PREVIOUS: read from reference/Fair Tests and Variables.pptx and .docx.
 * That deck ran 10+1+2+3+3+5+6+14+3+3 = 50. It taught independent/dependent
 * (with "manipulated/responding" beside them), controlled variables,
 * replication and the "if...then...because" shape. No aeroplane was ever
 * thrown: it was a design task only. Its I Do slide carried a BONUS line,
 * "We might investigate!", so this lesson keeps that promise with a real
 * investigation. Its closing line was "Change one thing. Measure one thing.
 * Keep the rest the same. Then do it again." and this lesson extends it.
 *
 * SHAPE. Deviates from the 10-phase archetype (11 slides). The burning food
 * practical and the printed recording sheet replace Cold Call and Google
 * Classroom: Do Now 6, Today 1, Hook 2, I Do 3, I Do 3, We Do 4, PLAN IT 4,
 * PRACTICAL 14, YOU DO 7, Answers 3, Plenary 3 = 50.
 *
 * THEY FOUND HARD (brief): the difference between independent and dependent
 * variables. Built in: Do Now Q1-4, the "depends on" test on I Do 1, We Do
 * rows 1 and 2 (both deliberately flipped), Plan It, Plenary Q1 and Q5.
 *
 * FACTS. Method is the brief's own. Crisps run about 500 to 540 kcal per
 * 100 g and white bread about 266 kcal per 100 g (nutrition databases), so
 * expect crisps near the top and bread near the bottom. Cornflakes and
 * crackers were not verified: check the packets. Safety points (eye
 * protection, never eat the food, let samples cool) follow the RSC "energy
 * content in foods" class experiment; metal containers transfer heat better
 * than boiling tubes.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const { arrow } = require('../lib/shapes');

const DATE = 'Friday 2 October 2026';
const LESSON = 'Burning Food';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_signal_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y7 Science · Scientific Research and Technology · Lesson 3';

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
    key: 'signal', palette: C, minutes, mode, slideH: H,
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
const title = (slide, text, mode, o = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: o.w ?? (RIGHT - M), h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: o.size ?? 30, bold: true,
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
function banner(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.12,
    x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true,
    align: 'center', valign: 'middle', margin: 0.1, objectName: o.name,
  });
}
function outline(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.12,
    x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.62, fill: { color: 'FFF6CC' }, line: { color: C.accent, width: 1.5 },
    color: C.dark, fontFace: F.body, fontSize: o.size ?? 15, bold: true, align: 'center', valign: 'middle', margin: 0.1,
    objectName: o.name,
  });
}


const PHASES = [];

/* ================================================================== *
 * 1. DO NOW · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 6, 'light'));
  pill(s, 'Do Now', 6, 'light');

  s.addText(LESSON, {
    x: 3.20, y: 0.22, w: 6.90, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22,
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
    ['State what the independent variable is.', 'The variable you change on purpose.'],
    ['State what the dependent variable is.', 'The variable you measure.'],
    ['In "does more sugar make ice melt faster", name the independent variable.', 'The amount of sugar.'],
    ['In the same test, name the dependent variable.', 'How fast the ice melts.'],
    ['State what a controlled variable is.', 'A variable kept the same, so the test is fair.'],
    ['Name a food that gives you energy.', 'Any: bread, pasta, rice, cereal, crisps.'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `d${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 1.00, w: cw - 0.44, h: 0.48,
      fill: { color: 'FFF6CC' }, line: { color: C.accentInk, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 13, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 6 minutes, not 10, to make room for a real practical. Six clicks.\n\n'
    + 'FROM Fair Tests and Variables. That lesson taught independent and dependent (with "manipulated" and "responding" beside them), controlled variables and repeating a test. It was a design task only, no aeroplane was thrown. Its I Do slide ended "We might investigate!", so today keeps that promise.\n\n'
    + 'Q1-4 ARE THE DIFFICULT PART, ON PURPOSE. The brief says independent versus dependent is what this class found hard, so four of the six questions are on it. Ask Q1 and Q2 in words, then Q3 and Q4 on a fresh example (sugar and ice, from last lesson\'s Cold Call). If Q3 and Q4 come out reversed, do not correct yet. Say "hold that thought, the I Do will give you a test".\n\n'
    + 'Q5 IS RETRIEVAL. Q6 IS PLANTED: bread, pasta and cereal are all fine. It leads straight into the Hook.\n\n'
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
  title(s, 'Today', 'light');

  const GOALS = [
    'Identify the independent variable in an investigation.',
    'Identify the dependent variable.',
    'Identify control variables.',
    'Record multiple results, and explain why replication matters.',
  ];
  const gap = 0.24, cw = (RIGHT - M - 3 * gap) / 4;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 2.10, name: `o${i}` });
    badge(s, { x: x + 0.24, y: BODY_Y + 0.50, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.24, y: BODY_Y + 1.04, w: cw - 0.48, h: 1.24, color: C.ink, fontFace: F.body,
      fontSize: 15, bold: true, valign: 'top', margin: 0, lineSpacing: 19, objectName: `o${i}_t`,
    });
  });
  s.addText('Change one thing. Measure one thing. Keep the rest the same.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.72, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Five clicks.\n\n'
    + 'THE BANNER IS LAST LESSON\'S CLOSING LINE, UNFINISHED. Last lesson ended "Change one thing. Measure one thing. Keep the rest the same. Then do it again." Today the class does all four, with real fire.\n\n'
    + 'SAY THE PRACTICAL NOW. "We are going to burn food and use it to heat water." It is the reason to pay attention for the next 20 minutes.\n\n'
    + 'OBJECTIVES 1 AND 2 ARE THE ONES THE CLASS FOUND HARD. Spend your attention there.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addImage({ path: ICON('flame', 'alert'), x: RIGHT - 0.90, y: 0.90, w: 0.75, h: 0.75, objectName: 'hook_icon' });
  s.addText('Which food will heat water the most when it burns?', {
    x: M, y: 0.86, w: RIGHT - M - 1.10, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 30,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 37, objectName: 'slide_title',
  });
  s.addText('Vote. Then think: how would you find out fairly?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'Bread', 'bread'], ['B', 'Corn flakes', 'cereal'], ['C', 'Crisps', 'potato'], ['D', 'Crackers', 'cracker']];
  const gap = 0.24, cw = (RIGHT - M - 3 * gap) / 4;
  OPTS.forEach(([k, txt, ic], i) => {
    const x = M + i * (cw + gap), y = BODY_Y + 0.62;
    card(s, { x, y, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, {
      x: x + 0.26, y: y + 0.18, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addImage({ path: ICON(ic, 'accentInk'), x: x + cw - 1.10, y: y + 0.18, w: 0.80, h: 0.80, objectName: `h${i}_icon` });
    s.addText(txt, {
      x: x + 0.26, y: y + 1.30, w: cw - 0.52, h: 0.60, color: C.dark, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four cards arrive together, then vote.\n\n'
    + 'Hands up for each, tally on the board. Nobody knows: this is a real question, and that is the point. Accept every reason ("it is oily", "it looks dry").\n\n'
    + 'DO NOT SETTLE IT. Say "let\'s find out, and this time we will do it fairly". Then ask the question on the slide: how would you find out fairly? Take two or three answers. Someone may say "burn the same amount of each", which is a control variable, and worth naming as one.\n\n'
    + 'WHAT TO EXPECT, FOR YOU. Crisps run at about 500 to 540 kcal per 100 g and white bread about 266, so expect crisps near the top and bread near the bottom. Check the packets for corn flakes and crackers. It is a class result, not a guarantee: bread may barely burn, and that is worth recording too.\n\n'
    + 'CRISPS: the brief said "potato chips". I have written "crisps" because that is the British word. Change it if you prefer.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — which is which
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Which is which?', 'light');

  // the example question
  const qy = 1.86;
  card(s, { x: M, y: qy, w: CW, h: 0.72, fill: 'FFF6CC', line: C.accentInk, name: 'ex' });
  s.addImage({ path: ICON('car', 'accentInk'), x: M + 0.24, y: qy + 0.14, w: 0.60, h: 0.44, objectName: 'ex_icon' });
  s.addText('Does a steeper ramp make a toy car roll further?', {
    x: M + 1.05, y: qy, w: CW - 1.25, h: 0.72, color: C.dark, fontFace: F.title, fontSize: 19,
    bold: true, valign: 'middle', margin: 0, objectName: 'ex_t',
  });

  const cw = 5.20, cy = 2.80, ch = 1.95;
  const box = (k, x, head, line, chip) => {
    card(s, { x, y: cy, w: cw, h: ch, name: `vb${k}` });
    s.addText(head, {
      x: x + 0.26, y: cy + 0.14, w: cw - 0.52, h: 0.44, color: C.dark, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `vb${k}_h`,
    });
    s.addText(line, {
      x: x + 0.26, y: cy + 0.62, w: cw - 0.52, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'top', margin: 0, lineSpacing: 19, objectName: `vb${k}_d`,
    });
    s.addText(chip, {
      shape: S.roundRect, rectRadius: 0.08,
      x: x + 0.26, y: cy + 1.34, w: cw - 0.52, h: 0.46, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `vb${k}_e`,
    });
  };
  box(0, M, 'INDEPENDENT (manipulated)', 'I choose it. I change it on purpose.', 'Height of the ramp');
  box(1, M + CW - cw, 'DEPENDENT (responding)', 'I measure it. It depends on the independent variable.', 'Distance the car rolls');
  arrow(pptx, s, M + cw + 0.10, cy + ch / 2, M + CW - cw - 0.10, cy + ch / 2, { colour: C.accentInk, thickness: 0.22, objectName: 'vb_arrow' });

  // the depends-on test
  const ty = cy + ch + 0.22;
  card(s, { x: M, y: ty, w: CW, h: 1.30, name: 'dep' });
  s.addText('THE "DEPENDS ON" TEST', {
    x: M + 0.26, y: ty + 0.08, w: 4.2, h: 0.36, color: C.accentInk, fontFace: F.body, fontSize: 12.5,
    bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'dep_h',
  });
  [['SENSIBLE', C.support, 'The distance depends on the ramp height.'], ['BACKWARDS', C.alert, 'The ramp height depends on the distance.']].forEach(([lab, col, txt], i) => {
    const y = ty + 0.46 + i * 0.38;
    s.addText(lab, {
      x: M + 0.26, y, w: 1.55, h: 0.32, color: col, fontFace: F.body, fontSize: 12.5, bold: true,
      charSpacing: 1, valign: 'middle', margin: 0, objectName: `dep${i}_l`,
    });
    s.addText(txt, {
      x: M + 1.95, y, w: CW - 2.2, h: 0.32, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, objectName: `dep${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the question, the two boxes and arrow together, then the depends-on test.\n\n'
    + 'THIS IS THE LESSON\'S HARD PART. The class found independent versus dependent difficult, so this slide gives them a test to use rather than a definition to remember.\n\n'
    + 'A NEW EXAMPLE, NOT FOOD. Ramp and car, so the food investigation is theirs to plan later. Do not use the burning food question here.\n\n'
    + 'SAY IT IN THIS ORDER EVERY TIME: "I change this, so this responds." The arrow runs from independent to dependent.\n\n'
    + 'THE TEST. Put the two variables into the sentence "X depends on Y". If it sounds right, X is dependent and Y is independent. "The distance depends on the ramp height" is sensible. Flip it and it is backwards. Ask the class to try the test on the sugar and ice question from the Do Now, and correct any reversed answers now.\n\n'
    + '"INDEPENDENT" AND "DEPENDENT" ARE THE EXAM WORDS. "Manipulated" and "responding" are the plain-English ones, both were taught last lesson. Say both together.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — control it, repeat it
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Keep it fair. Then do it again.', 'light');

  const cw = (CW - 0.30) / 2, cy = BODY_Y - 0.10, ch = 4.55;
  // left: controlled variables
  card(s, { x: M, y: cy, w: cw, h: ch, name: 'ctl' });
  s.addImage({ path: ICON('balance', 'accentInk'), x: M + 0.24, y: cy + 0.22, w: 0.48, h: 0.48, objectName: 'ctl_icon' });
  s.addText('CONTROL VARIABLES', {
    x: M + 0.86, y: cy + 0.22, w: cw - 1.1, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 17,
    bold: true, valign: 'middle', margin: 0, objectName: 'ctl_h',
  });
  s.addText('Kept exactly the same, so they cannot be the reason for the result.', {
    x: M + 0.26, y: cy + 0.92, w: cw - 0.52, h: 0.80, color: C.ink, fontFace: F.body, fontSize: 15,
    valign: 'top', margin: 0, lineSpacing: 19, objectName: 'ctl_d',
  });
  s.addText('For the ramp and car:', {
    x: M + 0.26, y: cy + 1.86, w: cw - 0.52, h: 0.36, color: C.inkSoft, fontFace: F.body, fontSize: 13.5,
    bold: true, valign: 'middle', margin: 0, objectName: 'ctl_lab',
  });
  s.addText('Same car\nSame ramp surface\nSame starting line\nSame person letting go', {
    x: M + 0.26, y: cy + 2.26, w: cw - 0.52, h: 1.90, color: C.ink, fontFace: F.body, fontSize: 15.5,
    bold: true, valign: 'top', margin: 0, lineSpacing: 26, objectName: 'ctl_l',
  });

  // right: replication
  const rx = M + cw + 0.30;
  card(s, { x: rx, y: cy, w: cw, h: ch, name: 'rep' });
  s.addImage({ path: ICON('repeat', 'accentInk'), x: rx + 0.24, y: cy + 0.22, w: 0.48, h: 0.48, objectName: 'rep_icon' });
  s.addText('REPLICATION', {
    x: rx + 0.86, y: cy + 0.22, w: cw - 1.1, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 17,
    bold: true, valign: 'middle', margin: 0, objectName: 'rep_h',
  });
  s.addText('Repeat the test. Take an average.', {
    x: rx + 0.26, y: cy + 0.92, w: cw - 0.52, h: 0.40, color: C.ink, fontFace: F.body, fontSize: 15,
    valign: 'top', margin: 0, objectName: 'rep_d',
  });
  s.addText('Temperature rise of the water:', {
    x: rx + 0.26, y: cy + 1.46, w: cw - 0.52, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 13.5,
    bold: true, valign: 'middle', margin: 0, objectName: 'rep_lab',
  });
  const chipW = (cw - 0.52 - 0.40) / 3;
  ['14 °C', '15 °C', '13 °C'].forEach((v, i) => {
    s.addText(v, {
      shape: S.roundRect, rectRadius: 0.08,
      x: rx + 0.26 + i * (chipW + 0.20), y: cy + 1.90, w: chipW, h: 0.52, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rep_c${i}`,
    });
  });
  s.addText('(14 + 15 + 13) ÷ 3 = 14 °C', {
    shape: S.roundRect, rectRadius: 0.10,
    x: rx + 0.26, y: cy + 2.62, w: cw - 0.52, h: 0.58, fill: { color: 'FFF6CC' }, line: { color: C.accentInk, width: 1.4 },
    color: C.dark, fontFace: F.body, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'rep_avg',
  });
  s.addText('One odd result, such as 25 °C, stands out. Do that one again.', {
    x: rx + 0.26, y: cy + 3.42, w: cw - 0.52, h: 0.80, color: C.ink, fontFace: F.body, fontSize: 14.5,
    valign: 'top', margin: 0, lineSpacing: 19, objectName: 'rep_odd',
  });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: control variables, then replication.\n\n'
    + 'CONTROL VARIABLES ARE THE EASIEST TO FORGET because nothing happens to them. Ask: "what if a different person let go of the car each time?" The result could be the person, not the ramp.\n\n'
    + 'REPLICATION: THE NUMBERS ARE CHECKED. 14, 15 and 13 add to 42, and 42 divided by 3 is 14. If a fourth result of 25 turns up among 14 and 15, it is the odd one out. It would drag an average of 14, 15 and 25 up to 18, which is not what the test was showing. Repeat that trial, and say so. Do not throw results away without a reason.\n\n'
    + 'LINK TO TODAY: the numbers are temperature rises, so the practical already looks familiar.'
  );
}

/* ================================================================== *
 * 6. WE DO · 4
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 4, 'light'));
  pill(s, 'We Do', 4, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"In the food test, the independent variable is the rise in water temperature."', 'The independent variable is the type of food. The temperature rise depends on it, so it is the dependent variable.'],
    ['"In the ramp test, the dependent variable is the height of the ramp."', 'The ramp height is the one you change, so it is independent. The distance the car rolls is dependent.'],
    ['"I will use 5 g of crisps and 1 g of bread."', 'The mass of food is a control variable. Use about 1 g of every food.'],
    ['"I will burn each food once. That is enough."', 'Repeat each food at least twice, then take an average.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 5.30, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 5.80, y: y + 0.09, w: RIGHT - (M + 5.80) - 0.10, h: 0.74,
      fill: { color: 'FFF6CC' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 4 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROWS 1 AND 2 ARE THE SAME MISTAKE IN TWO CONTEXTS: the pair reversed. Row 1 is the food test the class is about to run, so it is also the answer to the planning slide. Row 2 is the ramp, to check they can do it on something new. If either splits the room, apply the depends-on test out loud: "the temperature rise depends on the food".\n\n'
    + 'ROW 3 IS OBJECTIVE 3, AND A SET-UP FOR THE PRACTICAL. About 1 g of every food. Ask "what else must stay the same?" and take suggestions. They will be back on the next slide.\n\n'
    + 'ROW 4 IS OBJECTIVE 4. Practical time is short, so they will be tempted to do one burn. Say that this is why the practical has three burns for each food.'
  );
}

/* ================================================================== *
 * 7. PLAN IT · 4
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 4, 'light'));
  pill(s, 'Plan It', 4, 'light');
  title(s, 'Plan your investigation', 'light');

  // row 1: the question and the foods
  const qy = 1.86;
  card(s, { x: M, y: qy, w: CW, h: 0.92, fill: 'FFF6CC', line: C.accentInk, name: 'pq' });
  badge(s, { x: M + 0.20, y: qy + 0.25, n: 1, name: 'pq' });
  s.addText('Question: Which food heats the water the most when it burns?', {
    x: M + 0.80, y: qy, w: CW - 3.70, h: 0.92, color: C.dark, fontFace: F.title, fontSize: 17,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'pq_t',
  });
  ['bread', 'cereal', 'potato', 'cracker'].forEach((ic, i) => {
    s.addImage({ path: ICON(ic, 'accentInk'), x: M + CW - 2.80 + i * 0.68, y: qy + 0.24, w: 0.44, h: 0.44, objectName: `pq_f${i}` });
  });

  const CARDS = [
    ['INDEPENDENT VARIABLE', 'What will you change?'],
    ['DEPENDENT VARIABLE', 'What will you measure? It depends on the independent variable.'],
    ['CONTROL VARIABLES', 'What will you keep the same? Name three.'],
    ['HYPOTHESIS', 'If I burn ___, then the water ___, because ___.'],
  ];
  const gap = 0.20, cw = (CW - gap) / 2, ch = 1.62, y0 = qy + 0.92 + 0.20;
  CARDS.forEach(([h, t], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + gap), y = y0 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `pl${i}` });
    badge(s, { x: x + 0.22, y: y + 0.20, n: i + 2, name: `pl${i}` });
    s.addText(h, {
      x: x + 0.82, y: y + 0.20, w: cw - 1.05, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 15,
      bold: true, charSpacing: 0.8, valign: 'middle', margin: 0, objectName: `pl${i}_h`,
    });
    s.addText(t, {
      x: x + 0.28, y: y + 0.80, w: cw - 0.56, h: 0.72, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'top', margin: 0, lineSpacing: 19, objectName: `pl${i}_t`,
    });
  });
  s.addNotes(
    'PLAN IT. 4 minutes. Three clicks: the question, the two variables, then controls and hypothesis. Students write on the printed sheet, Bronze Q1 to 4 and Silver Q5.\n\n'
    + 'THE CLASS QUESTION IS GIVEN so everyone plans the same test and the class results can be pooled. They copy it into Q1.\n\n'
    + 'THE DEPENDENT VARIABLE IS THE ONE TO WATCH. The right answer is the RISE in water temperature, in °C. Some will write "the food" or "the temperature" without the rise. Accept "temperature of the water", but nudge: the starting temperature will differ a little, so the rise is fairer. It is highest temperature minus starting temperature.\n\n'
    + 'CONTROLS, ANY THREE OF: mass of food (about 1 g), volume of water, starting temperature of the water, same metal container, same gap between flame and container, same stirring. They can see most of them in the method on the next slide, so this is a good place to say "name it before you do it".\n\n'
    + 'HYPOTHESIS: any "if, then, because". A typical one is "If I burn crisps, then the water will heat the most, because they are oily". Accept any reason. If you want to steer, say "bread looks dry, does that matter?".\n\n'
    + 'IF THEY STALL ON INDEPENDENT AND DEPENDENT, point back to the depends-on test on I Do 1.'
  );
}

/* ================================================================== *
 * 8. PRACTICAL · 14 — burn the food
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 14, 'light'));
  pill(s, 'Practical', 14, 'light');
  title(s, 'Burn the food, heat the water', 'light');

  const cy = 1.86, dw = 4.90, dh = 3.80, dx = M;
  const dia = [];
  card(s, { x: dx, y: cy, w: dw, h: dh, name: 'dg' });
  dia.push('dg_bg');
  const shape = (name, type, opts) => { dia.push(name); s.addShape(type, { ...opts, objectName: name }); };
  const label = (name, text, opts) => {
    dia.push(name);
    s.addText(text, { fontFace: F.body, fontSize: 11.5, color: C.inkSoft, valign: 'middle', margin: 0, objectName: name, ...opts });
  };
  const cx = dx + 2.05;                                    // centre line of the rig
  // heatproof mat
  shape('dg_mat', S.roundRect, { x: dx + 0.5, y: cy + 3.20, w: 3.10, h: 0.20, rectRadius: 0.04, fill: { color: '6B7785' }, line: { color: '6B7785', width: 0 } });
  // metal container with water
  shape('dg_can', S.rect, { x: cx - 0.80, y: cy + 0.75, w: 1.60, h: 1.25, fill: { color: 'C5CED6' }, line: { color: C.dark, width: 1.5 } });
  shape('dg_water', S.rect, { x: cx - 0.74, y: cy + 1.20, w: 1.48, h: 0.74, fill: { color: '8CC8F0' }, line: { color: '8CC8F0', width: 0 } });
  // thermometer, reaching into the water
  shape('dg_thm', S.roundRect, { x: cx + 0.30, y: cy + 0.30, w: 0.11, h: 1.35, rectRadius: 0.05, fill: { color: 'FFFFFF' }, line: { color: C.alert, width: 1.5 } });
  shape('dg_thm_bulb', S.ellipse, { x: cx + 0.27, y: cy + 1.56, w: 0.17, h: 0.17, fill: { color: C.alert }, line: { color: C.alert, width: 0 } });
  // food on a holder, under the container, with a gap
  shape('dg_holder', S.rect, { x: cx - 0.02, y: cy + 3.00, w: 0.05, h: 0.20, fill: { color: '4A5563' }, line: { color: '4A5563', width: 0 } });
  shape('dg_food', S.ellipse, { x: cx - 0.24, y: cy + 2.78, w: 0.50, h: 0.26, fill: { color: '8A5A2B' }, line: { color: '5A3A1B', width: 1 } });
  dia.push('dg_flame');
  s.addImage({ path: ICON('flame', 'alert'), x: cx - 0.22, y: cy + 2.38, w: 0.44, h: 0.44, objectName: 'dg_flame' });
  // labels
  label('dg_l1', 'metal\ncontainer\nwith water', { x: dx + 0.08, y: cy + 0.98, w: 1.06, h: 0.62, align: 'right' });
  label('dg_l2', 'thermometer', { x: cx + 0.55, y: cy + 0.40, w: 1.30, h: 0.30 });
  label('dg_l3', 'small gap', { x: cx + 0.62, y: cy + 2.05, w: 1.10, h: 0.30 });
  label('dg_l4', 'burning food\non a holder', { x: cx + 0.55, y: cy + 2.58, w: 1.30, h: 0.50 });
  label('dg_l5', 'heatproof mat', { x: dx + 0.5, y: cy + 3.44, w: 3.10, h: 0.28, align: 'center' });
  // the gap marker
  shape('dg_gap', S.rect, { x: cx + 0.52, y: cy + 2.02, w: 0.03, h: 0.34, fill: { color: C.inkSoft }, line: { color: C.inkSoft, width: 0 } });

  const sx = M + dw + 0.28, sw = RIGHT - sx;
  const STEPS = [
    'Weigh about 1 g of your food. Record the mass.',
    'Pour the same volume of water into the metal container (20 to 50 mL).',
    'Record the starting temperature of the water.',
    'Light the food. Hold it under the container, leaving a small gap.',
    'Stir gently. Record the highest temperature.',
    'Let everything cool. Repeat twice more with the same food. Then find the average.',
  ];
  const stepH = 0.56, stepGap = 0.088;
  STEPS.forEach((t, i) => {
    const y = cy + i * (stepH + stepGap);
    card(s, { x: sx, y, w: sw, h: stepH, name: `ps${i}` });
    badge(s, { x: sx + 0.14, y: y + (stepH - 0.42) / 2, n: i + 1, name: `ps${i}` });
    s.addText(t, {
      x: sx + 0.68, y, w: sw - 0.82, h: stepH, color: C.ink, fontFace: F.body, fontSize: 13,
      bold: true, valign: 'middle', margin: 0, lineSpacing: 16, objectName: `ps${i}_t`,
    });
  });
  const by = cy + dh + 0.16;
  banner(s, 'Goggles on. Hair tied back. Never eat the food.', { y: by, h: 0.58, size: 16, name: 'safe_banner' });
  outline(s, 'Record every trial on your sheet. One food, three burns.', { y: by + 0.68, h: 0.52, size: 15, name: 'rec_banner' });

  s.addNotes(
    'PRACTICAL. 14 minutes. Four clicks: the rig, the six steps, the safety line, then the recording line. Students record on the printed sheet, Silver Q6.\n\n'
    + 'RISK ASSESSMENT FIRST. This is an open-flame practical. Use your school\'s approved method and risk assessment for burning food. The points below are the usual ones, not a substitute: goggles on for everyone at the bench; hair tied back and loose sleeves secured; heatproof mat under every rig; flammables cleared; a damp cloth or fire blanket within reach; the food is NEVER eaten; let food, holder and container cool before touching; keep the group at the bench, standing. Metal containers such as a small can transfer heat much better than a boiling tube.\n\n'
    + 'GROUPS AND FOODS. Groups of about four, one food per group, so every food is tested by at least one group. Two groups on the same food gives extra replicates for free. Each group does THREE burns of its own food, and the class pools averages on the board on the next slide. Write "bread, corn flakes, crisps, crackers" on the board and assign.\n\n'
    + 'ROLES IN A GROUP OF FOUR: one holds and lights the food, one stirs and reads the thermometer, one times and records, one checks the controls against the list. Swap for the next burn if time allows.\n\n'
    + 'TIMING. 2 minutes: click through and hand out the kit. 10 minutes: three burns at about 3 minutes each (weigh and set up, burn, read the highest temperature, cool). 2 minutes: clear up and find the average. If you are short, pre-cut samples to about 1 g so they only check the mass, or run two burns each and say so.\n\n'
    + 'WHAT WILL GO WRONG. Bread and corn flakes are hard to keep burning: the flame goes out, the water barely warms. That is a result, not a failure. Record "did not keep burning" and the small rise. Do NOT let them switch to a different food or add extra: that changes the independent variable. Also expect the mass to vary. Their sample will not be exactly 1 g, and it is a limitation for Gold Q10.\n\n'
    + 'THE FOOD IS A CONTROL AS WELL AS THE INDEPENDENT VARIABLE: the type of food changes between groups, and the same food is used within a group. Say that.\n\n'
    + 'ALLERGIES: no nuts are used, but check for gluten or other allergies if any student is sensitive to handling wheat products. No one eats anything.'
  );
}

/* ================================================================== *
 * 9. YOU DO · 7
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 7, 'light'));
  pill(s, 'You Do', 7, 'light');
  title(s, 'Class results, then finish your sheet', 'light');

  const cy = 1.86, tw = 5.20;
  card(s, { x: M, y: cy, w: tw, h: 4.55, name: 'cr' });
  s.addText('CLASS RESULTS: average rise (°C)', {
    x: M + 0.26, y: cy + 0.14, w: tw - 0.52, h: 0.46, color: C.dark, fontFace: F.title, fontSize: 15,
    bold: true, valign: 'middle', margin: 0, objectName: 'cr_h',
  });
  [['bread', 'Bread'], ['cereal', 'Corn flakes'], ['potato', 'Crisps'], ['cracker', 'Crackers']].forEach(([ic, name], i) => {
    const y = cy + 0.80 + i * 0.90;
    s.addShape(S.roundRect, {
      x: M + 0.24, y, w: tw - 0.48, h: 0.74, rectRadius: 0.08, fill: { color: 'F2F6FB' }, line: { color: 'D8DEEC', width: 1 },
      objectName: `cr${i}_bg`,
    });
    s.addImage({ path: ICON(ic, 'accentInk'), x: M + 0.40, y: y + 0.13, w: 0.48, h: 0.48, objectName: `cr${i}_icon` });
    s.addText(name, {
      x: M + 1.05, y, w: 2.10, h: 0.74, color: C.dark, fontFace: F.body, fontSize: 16, bold: true,
      valign: 'middle', margin: 0, objectName: `cr${i}_n`,
    });
    s.addText('______ °C', {
      x: M + 3.20, y, w: 1.80, h: 0.74, color: C.inkSoft, fontFace: F.body, fontSize: 16,
      valign: 'middle', margin: 0, objectName: `cr${i}_v`,
    });
  });

  const sx = M + tw + 0.30, sw = RIGHT - sx;
  const TASKS = [
    ['7', 'Work out the average rise for your food.', 'Add your three rises. Divide by 3.'],
    ['8', 'Copy the class averages. Say which food heated the water most.', 'Use the numbers.'],
    ['9', 'Explain why we repeated each burn.', 'Think: one odd result.'],
    ['10', 'State one thing that made the test less fair. Say how to improve it.', 'Think: mass, heat lost, flame.'],
  ];
  const th = 1.02, tg = 0.155;
  TASKS.forEach(([n, t, hint], i) => {
    const y = cy + i * (th + tg);
    card(s, { x: sx, y, w: sw, h: th, name: `yd${i}` });
    badge(s, { x: sx + 0.16, y: y + 0.10, n, name: `yd${i}` });
    s.addText(t, {
      x: sx + 0.74, y: y + 0.06, w: sw - 0.90, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 13.5,
      bold: true, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `yd${i}_t`,
    });
    s.addText(hint, {
      x: sx + 0.74, y: y + 0.66, w: sw - 0.90, h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 12,
      italic: true, valign: 'middle', margin: 0, objectName: `yd${i}_h`,
    });
  });
  s.addNotes(
    'YOU DO. 7 minutes. Five clicks: the results table, then each of the four tasks. The class works on the printed sheet, Silver Q7 then Gold Q8 to 10. There is no Google Classroom step today. The sheet is printed.\n\n'
    + 'FIRST MINUTE: COLLECT THE AVERAGES. Ask each group for the average rise for its food and write it on the board, or write it on the slide table. If two groups tested the same food, write both and take the average, and point out that this is more replication. Students copy the class numbers onto their sheet.\n\n'
    + 'THIS SHEET IS A SEQUENCE, NOT THREE DIFFICULTIES. Bronze was Plan it, Silver was Test it, Gold is Explain it. Everyone does all three. Q10 is the stretch.\n\n'
    + 'WHERE THEY WILL STALL. Q8: they say "crisps" without quoting the numbers. Ask for the number. Q9: "to be fair" instead of "so one odd result does not mislead us". Q10: "we did it wrong". Ask what specifically, and what they would change.\n\n'
    + 'IF THE RESULTS DO NOT MATCH THE HYPOTHESIS, that is fine and worth a sentence. A hypothesis can be wrong. It is still a good test if it was fair.\n\n'
    + 'AT 2 MINUTES REMAINING, stop them. Answers are on the next slide.'
  );
}

/* ================================================================== *
 * 10. ANSWERS · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'Answers', 3, 'light');
  title(s, 'Answers', 'light');

  const ANS = [
    ['1', 'Which food heats the water the most when it burns?'],
    ['2', 'The type of food.'],
    ['3', 'The rise in the water temperature (°C).'],
    ['4', 'Any three: mass of food, volume of water, starting temperature, same container, same gap, same stirring.'],
    ['5', 'Any "if, then, because". For example: if I burn crisps, the water will heat most, because they are oily.'],
    ['6', 'From your own table. Three trials for your food.'],
    ['7', 'Add your three rises and divide by 3.'],
    ['8', 'The food with the biggest class average. Quote the numbers.'],
    ['9', 'One result can be odd. Repeating shows the pattern, and the average is more reliable.'],
    ['10', 'Any one: mass not exactly 1 g, heat lost to the air, food went out. Improve: weigh carefully, shield the flame.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 12,
      valign: 'middle', margin: 0, lineSpacing: 14.5, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q1 TO Q4 ARE THE PLAN. Q2 AND Q3 are the pair the class found hard, so mark those aloud. If anyone has them reversed, use the depends-on test one more time: "the temperature rise depends on the food".\n\n'
    + 'Q5, Q6, Q8 AND Q10 HAVE NO SINGLE RIGHT ANSWER. Q6 comes from their own table, and Q8 from the class numbers. Take two or three answers aloud for Q5, Q8 and Q10 rather than reading the model answer.\n\n'
    + 'Q9 IS OBJECTIVE 4. Someone will say "to be fair". Repeating is for reliability: it is not about fairness. Controls make it fair.\n\n'
    + 'Q10 HAS SEVERAL RIGHT ANSWERS. The commonest is the mass: nobody weighs exactly 1 g. Heat lost to the air is the biggest error in this practical, and a good one to praise.'
  );
}

/* ================================================================== *
 * 11. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');

  const QS = [
    ['The dependent variable is the one you change.', 'FALSE'],
    ['In the food test, the independent variable is the type of food.', 'TRUE'],
    ['The mass of food can be different for each food.', 'FALSE'],
    ['Repeating each burn and taking an average makes the result more reliable.', 'TRUE'],
    ['The rise in the water temperature depends on the food.', 'TRUE'],
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
      fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q`,
    });
    s.addText(v, {
      x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent,
      fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle',
      margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('Change one thing. Measure one thing. Keep the rest the same. Then do it again.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 CHECKS THE PAIR ISN\'T REVERSED, the mistake this class makes most. Q5 checks it the other way round. If either splits the room, that is the first five minutes of next lesson.\n\n'
    + 'Q3 IS THE CONTROL MISCONCEPTION: "different foods are different, so the mass can differ". The food is the independent variable and everything else is controlled, including its mass.\n\n'
    + 'THE CLOSING LINE IS LAST LESSON\'S, COMPLETE. Last lesson ended without "Then do it again", because there was no practical. Today there was.\n\n'
    + 'THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on, calculating the energy released from these results (using the mass of food and the temperature rise) is the natural next step, but only if the class has met energy calculations. Your call.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

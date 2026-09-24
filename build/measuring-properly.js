/**
 * Y7 Science, Scientific Research and Technology, Lesson 4: Measuring Properly.
 * Single, 50 minutes. Class 7B. Signal palette, carried on from Burning Food.
 *
 * PREVIOUS: read from reference/Burning Food.pptx (the taught, edited deck).
 * It ran 6+1+2+3+3+4+4+14+7+3+3 = 50 across 11 slides. The class met: the
 * independent, dependent and control variables (Chuka dropped the
 * "manipulated/responding" words, so only independent and dependent are used
 * here), replication and averaging, and they used a balance (about 1 g of
 * food), a measure of water (20 to 50 mL) and a thermometer (temperature rise
 * in degrees Celsius). Kelvin, accuracy and choosing an instrument are all new.
 * The plenary made no promise for this lesson.
 *
 * SHAPE. Deviates from the 10-phase archetype (11 slides). The measurement
 * circuit replaces Cold Call, and Kelvin needs its own I Do: Do Now 6,
 * Today 1, Hook 2, I Do 3, I Do 3, I Do 3, We Do 4, PRACTICAL 13, YOU DO 9,
 * Answers 3, Plenary 3 = 50. The circuit tables and Q1-10 are one printed
 * sheet, so there is no Google Classroom step.
 *
 * THEY FOUND HARD was blank. Inferred, and said in the notes: (1) reading a
 * scale (what one small division is worth), (2) accuracy mixed up with
 * "lots of decimal places" or with readings that agree, (3) which way the
 * Celsius and kelvin conversion goes, and writing K not "degrees K".
 *
 * FACTS. Kelvin is written K, with no degree sign. 0 K is -273.15 degrees
 * Celsius, and K = C + 273.15 exactly. Key Stage 3 uses 273, so the slides
 * add and subtract 273, and the notes say so. Pendulum figures by sympy:
 * T = 2 pi sqrt(L/g), so 10 swings of a 50 cm pendulum take about 14 s and
 * of a 1 m pendulum about 20 s. Accuracy example numbers (50, 50, 51 and
 * 47, 47, 48; 96, 96, 97 and 99, 101, 100) checked by sympy.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Friday 9 October 2026';
const LESSON = 'Measuring Properly';
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
pptx.subject = 'Y7 Science · Scientific Research and Technology · Lesson 4';

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
    ['State what a control variable is.', 'A variable kept the same, so the test is fair.'],
    ['State the dependent variable in the burning food test.', 'The rise in the water temperature.'],
    ['Name the instrument that weighed the food.', 'A balance.'],
    ['State the unit for the temperature of the water.', 'Degrees Celsius, °C.'],
    ['State why we repeated each burn.', 'To spot an odd result, and to take an average.'],
    ['Name the instrument that measures the volume of a liquid.', 'A measuring cylinder.'],
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
    'DO NOW. 6 minutes. Six clicks.\n\n'
    + 'ALL SIX ARE FROM Burning Food, the lesson the class has just had. I read the deck you taught (reference/Burning Food.pptx). It used the independent, dependent and control variables, repeating and averaging, a balance for the food, a measured volume of water and a thermometer in °C. Q1, Q2 and Q5 are the ideas; Q3, Q4 and Q6 are the instruments, which is what today is about.\n\n'
    + 'Q4 AND Q6 ARE THE SETUP. Q4 gets "degrees Celsius", which lets you say "today there is another temperature scale". Q6 gets "measuring cylinder" or "beaker". If they say beaker, do not correct it yet: the Hook is about exactly that choice.\n\n'
    + 'THE BRIEF LEFT "THEY FOUND HARD" BLANK, so I have guessed: (1) reading a scale, meaning what one small division is worth; (2) accuracy, confused with "lots of decimal places" or with readings that agree; (3) which way the Celsius and kelvin conversion goes. All three are built into the lesson. Tell me if it was something else and I will rework it.\n\n'
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
    'Choose the right instrument for a measurement.',
    'Explain what accuracy means.',
    'Convert between the Celsius and Kelvin scales.',
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
  s.addText('Right instrument. Read it properly. Close to the true value.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'LAST LESSON THE CLASS DID A FAIR TEST. TODAY IS THE PART UNDERNEATH IT: how to measure properly. A fair test is only as good as the measurements in it.\n\n'
    + 'THE BANNER IS THE THREE OBJECTIVES IN ONE LINE, in order: right instrument, read it properly, close to the true value. Then say the circuit: "you will go round five stations, and each one has a table to fill in".'
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
  s.addText('You need exactly 8 mL of water. Which measuring cylinder do you pick?', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 35, objectName: 'slide_title',
  });
  s.addText('Vote. Then say why.', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', '1000 mL cylinder', 1.55], ['B', '100 mL cylinder', 1.20], ['C', '10 mL cylinder', 0.90]];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt, sz], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.55;
    card(s, { x, y, w: cw, h: 2.60, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: y + 0.18, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addImage({ path: ICON('cylinder', 'accentInk'), x: x + cw - 0.45 - sz, y: y + 0.10 + (1.55 - sz) / 2, w: sz, h: sz, objectName: `h${i}_icon` });
    s.addText(txt, {
      x: x + 0.28, y: y + 1.85, w: cw - 0.56, h: 0.56, color: C.dark, fontFace: F.title,
      fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards arrive together, then vote.\n\n'
    + 'Hands up for each. Tally on the board. Expect a spread, and some who say "it does not matter, they all measure 8 mL". That is the point.\n\n'
    + 'ANSWER, FOR YOU: C. The 10 mL cylinder has smaller divisions (often 0.2 mL), so you can read 8 mL more closely. On a 1000 mL cylinder one division can be 10 mL, so 8 mL is less than one division and you cannot read it at all. Check the divisions on your own cylinders before the lesson.\n\n'
    + 'DO NOT EXPLAIN. Ask one student why. Say "hold that, the first I Do shows how to choose". The cylinder pictures are not to scale.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — choose the instrument
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Choose the right instrument', 'light');

  const cols = [
    { x: M + 0.26, w: 2.55, h: 'MEASURE' },
    { x: M + 3.00, w: 2.40, h: 'INSTRUMENT' },
    { x: M + 5.55, w: 1.30, h: 'UNIT' },
    { x: M + 7.00, w: CW - 7.20, h: 'READ IT PROPERLY' },
  ];
  cols.forEach((c, i) => s.addText(c.h, {
    x: c.x + (i === 0 ? 0.62 : 0), y: 1.80, w: c.w - (i === 0 ? 0.62 : 0), h: 0.32, color: C.accentInk, fontFace: F.body, fontSize: 11.5,
    bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `hd${i}`,
  }));
  const ROWS = [
    ['ruler', 'Length', 'Ruler', 'cm, mm', 'Eye directly above the mark.'],
    ['cylinder', 'Volume of a liquid', 'Measuring cylinder', 'mL', 'Eye level. Read the bottom of the curve.'],
    ['thermometer', 'Temperature', 'Thermometer', '°C', 'Wait until the liquid stops moving.'],
    ['balance', 'Mass', 'Balance', 'g', 'Zero it before you start.'],
    ['stopwatch', 'Time', 'Stopwatch', 's', 'Start and stop on the event.'],
  ];
  const rh = 0.74, rg = 0.10, y0 = 2.16;
  ROWS.forEach(([ic, what, inst, unit, tip], i) => {
    const y = y0 + i * (rh + rg), n = `r${i}`;
    card(s, { x: M, y, w: CW, h: rh, name: n });
    s.addImage({ path: ICON(ic, 'accentInk'), x: M + 0.22, y: y + 0.13, w: 0.48, h: 0.48, objectName: `${n}_icon` });
    s.addText(what, { x: cols[0].x + 0.62, y, w: cols[0].w - 0.62, h: rh, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `${n}_w` });
    s.addText(inst, { x: cols[1].x, y, w: cols[1].w, h: rh, color: C.dark, fontFace: F.title, fontSize: 15.5, bold: true, valign: 'middle', margin: 0, objectName: `${n}_i` });
    s.addText(unit, { x: cols[2].x, y, w: cols[2].w, h: rh, color: C.dark, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'middle', margin: 0, objectName: `${n}_u` });
    s.addText(tip, { x: cols[3].x, y, w: cols[3].w, h: rh, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `${n}_t` });
  });
  banner(s, 'Use the smallest one that fits the job. For 8 mL, use the 10 mL cylinder.', { y: y0 + 5 * (rh + rg) + 0.06, h: 0.62, size: 16, name: 'ins_banner' });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: one row at a time, then the banner.\n\n'
    + 'THE FOURTH COLUMN IS OBJECTIVE 1 AS WELL. "Right instrument" includes using it properly, and every station in the circuit has a way to get it wrong. Say each tip out loud as you click the row: parallax on the ruler (look from directly above, not from the side), the meniscus (the water curves up at the edges, so read the bottom of the curve at eye level), the thermometer (a reading taken too early is too low), the balance (an unzeroed balance is out by the same amount every time), the stopwatch (start and stop on the event, not a beat late).\n\n'
    + 'THE BANNER LINKS TO THE HOOK: the 10 mL cylinder is the smallest that fits 8 mL. Ask the student from the Hook who said C to explain it now. The reason is the size of one division.\n\n'
    + 'THE GRAM IS THE UNIT OF MASS. Some will say "weight" out loud. Let it go, but write "mass" on the board, since a balance measures mass.\n\n'
    + 'WHAT IS ONE DIVISION? If the class found reading scales hard (my guess for the blank field), do one live example: hold up a 10 mL cylinder and ask "how much is the smallest gap worth?" Count the gaps between 0 and 10 mL out loud.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — accuracy
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'What accuracy means', 'light');

  card(s, { x: M, y: 1.84, w: CW, h: 0.92, fill: 'FFF6CC', line: C.accentInk, name: 'acc' });
  s.addText('ACCURATE', {
    x: M + 0.28, y: 1.84, w: 1.90, h: 0.92, color: C.accentInk, fontFace: F.title, fontSize: 19, bold: true,
    charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'acc_h',
  });
  s.addText('A measurement that is close to the true value.', {
    x: M + 2.30, y: 1.84, w: CW - 2.50, h: 0.92, color: C.dark, fontFace: F.title, fontSize: 19, bold: true,
    valign: 'middle', margin: 0, objectName: 'acc_t',
  });

  s.addText('The true mass of a block is 50 g. Two students weigh it three times.', {
    x: M, y: 2.90, w: CW, h: 0.40, color: C.inkSoft, fontFace: F.body, fontSize: 15, bold: true,
    valign: 'middle', margin: 0, objectName: 'tv_t',
  });
  const cw = (CW - 0.30) / 2, cy = 3.36, ch = 1.85;
  [
    ['STUDENT A', ['50 g', '50 g', '51 g'], 'Accurate. Close to 50 g.', C.support],
    ['STUDENT B', ['47 g', '47 g', '48 g'], 'Not accurate. Close together, but too low.', C.alert],
  ].forEach(([who, vals, verdict, col], i) => {
    const x = M + i * (cw + 0.30), n = `st${i}`;
    card(s, { x, y: cy, w: cw, h: ch, name: n });
    s.addText(who, {
      x: x + 0.26, y: cy + 0.12, w: cw - 0.52, h: 0.38, color: C.dark, fontFace: F.title, fontSize: 15, bold: true,
      charSpacing: 1, valign: 'middle', margin: 0, objectName: `${n}_h`,
    });
    const chipW = (cw - 0.52 - 0.40) / 3;
    vals.forEach((v, k) => s.addText(v, {
      shape: S.roundRect, rectRadius: 0.08,
      x: x + 0.26 + k * (chipW + 0.20), y: cy + 0.60, w: chipW, h: 0.50, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${n}_c${k}`,
    }));
    s.addText(verdict, {
      x: x + 0.26, y: cy + 1.24, w: cw - 0.52, h: 0.46, color: col, fontFace: F.body, fontSize: 15, bold: true,
      valign: 'middle', margin: 0, objectName: `${n}_v`,
    });
  });

  const by = cy + ch + 0.20;
  card(s, { x: M, y: by, w: CW, h: 1.28, name: 'how' });
  s.addText('TO BE MORE ACCURATE', {
    x: M + 0.26, y: by + 0.08, w: 4, h: 0.34, color: C.accentInk, fontFace: F.body, fontSize: 12.5, bold: true,
    charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'how_h',
  });
  const HOW = ['Choose the right instrument.', 'Read it properly.', 'Repeat it and take an average.'];
  const hw = (CW - 0.52 - 0.40) / 3;
  HOW.forEach((t, i) => s.addText(t, {
    shape: S.roundRect, rectRadius: 0.08,
    x: M + 0.26 + i * (hw + 0.20), y: by + 0.52, w: hw, h: 0.58, fill: { color: 'F2F6FB' }, line: { color: C.accentInk, width: 1.2 },
    color: C.dark, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `how_c${i}`,
  }));
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the definition, the two students together, then the three ways.\n\n'
    + 'THE DEFINITION IS ONE SENTENCE: close to the true value. Say it and have the class say it.\n\n'
    + 'THE TWO STUDENTS ARE THE MISCONCEPTION, MADE VISIBLE. Student B is very consistent, and consistently wrong: the readings agree with each other, and all are too low. A reading that agrees with the others is not the same as a reading that is close to the true value. The exam words are "precise" for readings that agree and "accurate" for close to the true value. Say "precise" once so they have heard it, but the lesson is only about accurate.\n\n'
    + 'NUMBERS CHECKED. A: 50, 50 and 51 add to 151, and the average is 50.3, very close to 50. B: 47, 47 and 48 add to 142, and the average is 47.3, well below 50. So B is consistent, and out by about 3 g each time. A balance that is not zeroed does exactly this.\n\n'
    + 'WHAT THEY WILL ALSO SAY: "the more decimal places, the more accurate". A reading of 47.328 g is not more accurate than 50 g if the true value is 50 g. We Do comes back to this.\n\n'
    + 'THE THREE WAYS TIE TO EARLIER LESSONS: right instrument (today), read properly (today), repeat and average (Burning Food).'
  );
}

/* ================================================================== *
 * 6. I DO · 3 — Celsius and kelvin
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Celsius and kelvin', 'light');

  const lw = 5.50, cy = 1.86, ch = 2.02;
  [
    ['°C  →  K', 'Add 273.', '25 °C + 273 = 298 K'],
    ['K  →  °C', 'Subtract 273.', '350 K − 273 = 77 °C'],
  ].forEach(([head, rule, ex], i) => {
    const y = cy + i * (ch + 0.20), n = `cv${i}`;
    card(s, { x: M, y, w: lw, h: ch, name: n });
    s.addText(head, {
      x: M + 0.26, y: y + 0.14, w: lw - 0.52, h: 0.46, color: C.accentInk, fontFace: F.title, fontSize: 19, bold: true,
      valign: 'middle', margin: 0, objectName: `${n}_h`,
    });
    s.addText(rule, {
      x: M + 0.26, y: y + 0.66, w: lw - 0.52, h: 0.52, color: C.dark, fontFace: F.title, fontSize: 24, bold: true,
      valign: 'middle', margin: 0, objectName: `${n}_r`,
    });
    s.addText(ex, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 0.26, y: y + 1.30, w: lw - 0.52, h: 0.56, fill: { color: 'FFF6CC' }, line: { color: C.accentInk, width: 1.4 },
      color: C.dark, fontFace: F.body, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${n}_e`,
    });
  });

  const rx = M + lw + 0.30, rw = CW - lw - 0.30;
  s.addText('LANDMARKS', {
    x: rx, y: cy - 0.04, w: rw, h: 0.30, color: C.accentInk, fontFace: F.body, fontSize: 12, bold: true,
    charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'lm_h',
  });
  const LM = [
    ['Water boils', '100 °C', '373 K'],
    ['Room temperature', '20 °C', '293 K'],
    ['Water freezes', '0 °C', '273 K'],
    ['Coldest possible', '−273 °C', '0 K'],
  ];
  const lh = 0.86, lg = 0.14;
  LM.forEach(([what, c, k], i) => {
    const y = cy + 0.34 + i * (lh + lg), n = `lm${i}`;
    card(s, { x: rx, y, w: rw, h: lh, name: n });
    s.addText(what, { x: rx + 0.24, y, w: rw - 3.30, h: lh, color: C.ink, fontFace: F.body, fontSize: 14.5, valign: 'middle', margin: 0, objectName: `${n}_w` });
    s.addText(c, { x: rx + rw - 3.05, y, w: 1.50, h: lh, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: `${n}_c` });
    s.addText(k, {
      shape: S.roundRect, rectRadius: 0.08,
      x: rx + rw - 1.40, y: y + 0.19, w: 1.16, h: 0.48, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: C.accent, fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${n}_k`,
    });
  });
  banner(s, 'Write K, not °K. No negative numbers on the kelvin scale.', { y: cy + 2 * ch + 0.20 + 0.22, h: 0.60, size: 16, name: 'k_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the two rules together, the landmarks, then the banner. Say the rule with the direction: "going UP to kelvin, ADD".\n\n'
    + 'THE NUMBERS ARE CHECKED. 25 + 273 = 298. 350 − 273 = 77. 100 + 273 = 373, 20 + 273 = 293, 0 + 273 = 273. The landmark for absolute zero is −273 °C = 0 K.\n\n'
    + 'THE EXACT VALUE IS 273.15. Key Stage 3 uses 273, so the slides do. Absolute zero is exactly −273.15 °C. If someone asks why "about", tell them: the true number has two decimal places, and 273 is close enough for this year.\n\n'
    + 'WHY KELVIN AT ALL? Zero on the kelvin scale is the coldest anything can be: absolute zero. Nothing can go below it, so no negative numbers. The size of one degree Celsius and one kelvin is the same. That is why we can just add 273: the scale has moved, not stretched.\n\n'
    + 'THE BANNER: "K", never "degrees K" or "°K". The kelvin is a unit like the metre, so it has no degree sign.\n\n'
    + 'THE DIRECTION IS THE COMMON SLIP, so We Do has one flipped. Ask for a memory tool: kelvin is the bigger number, so going to kelvin means the number gets bigger, so add.'
  );
}

/* ================================================================== *
 * 7. WE DO · 4
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 4, 'light'));
  pill(s, 'We Do', 4, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"A 100 mL cylinder is the best choice for measuring 8 mL."', 'Use the 10 mL cylinder. Its divisions are smaller, so you can read 8 mL more closely.'],
    ['"More decimal places means more accurate."', 'Accurate means close to the true value. A long number can still be wrong.'],
    ['"To change 25 °C to kelvin, subtract 273."', 'Add 273: 25 + 273 = 298 K. Going to kelvin, the number gets bigger.'],
    ['"Read the measuring cylinder from above, at the top of the water."', 'Eye level with the water. Read the bottom of the curve.'],
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
    + 'ROW 1 IS OBJECTIVE 1 AND THE HOOK, restated. If anyone still says 100 mL, ask "how big is one division on it?"\n\n'
    + 'ROW 2 IS OBJECTIVE 2 AND THE MOST LIKELY MISCONCEPTION. A digital balance showing 47.328 g feels very accurate. It is only accurate if the true value is close to 47.328. Ask "if the block really weighs 50 g, is 47.328 accurate?"\n\n'
    + 'ROW 3 IS OBJECTIVE 3, with the direction flipped on purpose. It is the mistake I expect most. The check is: 298 K should be a bigger number than 25 °C.\n\n'
    + 'ROW 4 IS THE READING SLIP the circuit will hit at Station 2. It costs nothing to say it again.'
  );
}

/* ================================================================== *
 * 8. PRACTICAL · 13 — the measurement circuit
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 13, 'light'));
  pill(s, 'Practical', 13, 'light');
  title(s, 'The measurement circuit', 'light');

  const STN = [
    ['ruler', 'RULER', 'Measure a pencil, a book and a beaker. Record in cm, to the nearest mm.'],
    ['cylinder', 'MEASURING CYLINDER', 'Measure 8 mL in the 10 mL and the 100 mL cylinder. Record both.'],
    ['thermometer', 'THERMOMETER', 'Read the cold water, the room and the warm water. Record in °C, then convert to K.'],
    ['balance', 'BALANCE', 'Zero it. Measure a coin, a pebble and the marked mass. Record in g.'],
    ['stopwatch', 'STOPWATCH', 'Time 10 swings of the pendulum, three times. Record each time in s.'],
  ];
  const gap = 0.18, cw = (CW - 4 * gap) / 5, cy = 1.86, ch = 3.50;
  STN.forEach(([ic, name, task], i) => {
    const x = M + i * (cw + gap), n = `stn${i}`;
    card(s, { x, y: cy, w: cw, h: ch, name: n });
    badge(s, { x: x + 0.18, y: cy + 0.18, n: i + 1, name: n });
    s.addImage({ path: ICON(ic, 'accentInk'), x: x + cw - 0.86, y: cy + 0.14, w: 0.64, h: 0.64, objectName: `${n}_icon` });
    s.addText(name, {
      x: x + 0.18, y: cy + 0.92, w: cw - 0.36, h: 0.56, color: C.dark, fontFace: F.title, fontSize: 13, bold: true,
      charSpacing: 0.6, valign: 'middle', margin: 0, lineSpacing: 15, objectName: `${n}_h`,
    });
    s.addText(task, {
      x: x + 0.18, y: cy + 1.56, w: cw - 0.36, h: ch - 1.70, color: C.ink, fontFace: F.body, fontSize: 14,
      valign: 'top', margin: 0, lineSpacing: 18, objectName: `${n}_t`,
    });
  });
  const by = cy + ch + 0.20;
  banner(s, 'Change station when you are told: about 2 minutes 30 seconds each.', { y: by, h: 0.58, size: 15.5, name: 'rot_banner' });
  outline(s, 'At every station: eye level, zero it, wait for the reading. Fill in that table.', { y: by + 0.68, h: 0.56, size: 15, name: 'rule_banner' });
  s.addNotes(
    'PRACTICAL. 13 minutes. Three clicks: the five stations, the rotation line, then the reading rule. Students record on the printed sheet, in the circuit tables.\n\n'
    + 'SET UP BEFORE THE LESSON (10 minutes). Five stations around the room, one results table each on the printed sheet. Groups of about five, one group per station. Rotate every 2 minutes 30 seconds, with about 30 seconds of that for moving. Five rotations of 2 minutes 30 seconds is 12 minutes 30 seconds, so there is no spare time: give the instructions in the first 30 seconds and start moving. Say "stop, move clockwise" and use your own clock, since the timer bar runs for the whole practical, not per station. If you have more than five groups, double up a station. If fewer, a group just misses a station and can do it at the end.\n\n'
    + 'STATION 1, RULER. A pencil, a textbook and a beaker (its height). Measure all three yourself first, so you know the true values. They read to the nearest mm, which is 0.1 cm. Watch for the ruler not starting from the zero mark and reading from the end of the ruler instead.\n\n'
    + 'STATION 2, MEASURING CYLINDER. A 10 mL and a 100 mL cylinder, a small beaker of coloured water, a dropper. Measure out 8 mL in each. They read the bottom of the curve at eye level. Check the divisions on your cylinders beforehand: the 10 mL is usually 0.2 mL and the 100 mL usually 1 mL. Q5 is answered from this.\n\n'
    + 'STATION 3, THERMOMETER. Three beakers: cold water (with a little ice, not solid ice), the room (a thermometer left on the bench), and warm water at about 50 °C from a flask. No kettles and no boiling water at the stations. The reading needs about 30 seconds to settle, so tell them to wait. They record °C and then convert to K, which is objective 3 with real numbers. Use your school\'s usual thermometers and follow its policy on glass ones. Keep them flat on the bench when not in use.\n\n'
    + 'STATION 4, BALANCE. A digital balance, a coin, a pebble and a marked 100 g mass (or another marked mass, whatever you have). Zero it first. The marked mass has a true value, so it is the accuracy check for Q6. If your balance reads 100.1 or 99.9, that is a good result: close to the true value.\n\n'
    + 'STATION 5, STOPWATCH. A pendulum: a string with a small mass, hung from a stand. Time 10 swings, three times, and average them. A 50 cm pendulum gives about 14 s for 10 swings, and a 1 m pendulum about 20 s (by T = 2π√(L/g), checked). If you have no pendulum, time a ball rolling down a ramp or 10 star jumps. Anything with a repeatable event works. Timing 10 swings and dividing is a good use of the average from Burning Food.\n\n'
    + 'WHAT WILL GO WRONG. They finish early and dawdle: give them "now do it again and see if you get the same number". Or a group is slow at the thermometer: it is fine to leave the conversion until they get back to their seats. Keep everyone standing at the stations, and hands off the glassware unless it is in use.\n\n'
    + 'NOTHING IS EATEN OR DRUNK. It is coloured water.'
  );
}

/* ================================================================== *
 * 9. YOU DO · 9
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 9, 'light'));
  pill(s, 'You Do', 9, 'light');

  s.addText('Finish your sheet', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Circuit tables first. Then questions 1 to 10.', {
    x: M, y: 2.04, w: RIGHT - M, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FBEAE6', 'Choose it', 'Name the instrument and unit. State what accuracy means. Convert 20 °C to K.'],
    ['SILVER', '6E8074', 'F1F2EE', 'Use it', 'Explain why the 10 mL cylinder is better. Judge your balance reading. Do three conversions.'],
    ['GOLD', C.accentInk, 'FFF6CC', 'Explain it', 'Explain whose readings are more accurate, why −20 K cannot be right, and how to measure in Burning Food.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, {
      x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body,
      fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(subh, {
      x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.20, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Check your units. °C and K, mL and g.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 9 minutes, not 14, because the circuit took the time. Four clicks. There is no Google Classroom step: the circuit tables and the ten questions are on one printed sheet.\n\n'
    + 'FIRST TWO MINUTES: let them finish any circuit table they did not complete. A gap in a table is a gap in Q4, Q6 or Q7.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what is one division worth on that scale?" It works for reading, for accuracy and for Q5.\n\n'
    + 'WHERE THEY WILL STALL: Q8, the two students. They see A\'s readings are close together and call A more accurate. Ask for the average of each, and compare it to the 100 °C true value. Q9: they know K cannot be negative but not why. The line is "0 K is the coldest anything can be, and that is −273 °C". Q10 wants three instruments and one reading tip each, which they should have from the I Do table.\n\n'
    + 'THE SHEET IS THREE TIERS AS USUAL, and this time they are three kinds of question, not a strict sequence, so a student can start Gold if Bronze is easy. Q4 and Q7 are quick to mark.\n\n'
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
    ['1', '(a) ruler, cm or mm. (b) measuring cylinder, mL. (c) stopwatch, s.'],
    ['2', 'Eye level with the water. Read the bottom of the curved surface.'],
    ['3', 'How close a measurement is to the true value.'],
    ['4', '293 K.'],
    ['5', 'Its divisions are smaller, so you can read the volume more closely.'],
    ['6', 'From your table. Accurate if your reading is very close to the marked mass.'],
    ['7', '(a) 273 K. (b) 373 K. (c) 27 °C.'],
    ['8', 'B. Its average is 100 °C, the true value. A is close together but too low.'],
    ['9', '0 K is −273 °C, the coldest possible. −20 K would be colder than that.'],
    ['10', 'Balance, zero it. Measuring cylinder, eye level. Thermometer, wait until it settles.'],
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
    + 'Q6 COMES FROM THE STATION 4 TABLE. Ask two groups what their balance said. Accurate means very close to the marked mass, so 99.9 g on a 100 g mass is accurate. If a reading is 3 or 4 g out, ask "did we zero it?"\n\n'
    + 'Q7 IS THREE CONVERSIONS: 0 + 273 = 273, 100 + 273 = 373, 300 − 273 = 27. Q4 is 20 + 273 = 293. Any answer with "°K" loses the mark for the unit: "K", not "°K".\n\n'
    + 'Q8 NUMBERS. A: 96, 96, 97 has an average of 96.3. B: 99, 101, 100 has an average of 100. The true value is 100 °C, so B is the accurate one. A\'s readings agree with each other, but they are all too low. This is the misconception from I Do 2 again.\n\n'
    + 'Q9 AND Q10 HAVE MORE THAN ONE WAY TO SAY IT. Take two or three student answers out loud. For Q10, accept any sensible reading tip for each instrument, from the I Do table.'
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
    ['A 100 mL cylinder is the best choice for measuring 8 mL.', 'FALSE'],
    ['Accurate means close to the true value.', 'TRUE'],
    ['To change °C to kelvin, you subtract 273.', 'FALSE'],
    ['0 °C is 273 K.', 'TRUE'],
    ['Readings that agree with each other must be accurate.', 'FALSE'],
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
  s.addText('Right instrument. Read it properly. Close to the true value.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'ALL THREE FALSES ARE REAL MISCONCEPTIONS FROM TODAY. Q1 is the Hook. Q3 is the direction of the conversion, the one I expect to slip. Q5 is the accuracy trap: readings that agree are consistent, and can be consistently wrong. If Q5 splits the room, that is the first five minutes of next lesson.\n\n'
    + 'Q2 AND Q4 ARE THE TWO FACTS TO LEAVE WITH: the definition and the one conversion to remember, 0 °C = 273 K.\n\n'
    + 'THE CLOSING LINE IS THE TODAY BANNER, in the same order as the objectives. That repetition is deliberate.\n\n'
    + 'THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on, a natural next question is how to show measurements on a graph or a table, but that is your call.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

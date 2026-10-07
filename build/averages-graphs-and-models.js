/**
 * Y7 Science, Averages, Graphs And Models. Class 7B. Single, 50 minutes. Signal palette, carried on
 * from the unit (Numbers In Science used it).
 *
 * DATE: the date the deck was BUILT on (standing preference: see the memory note), not a guessed
 * teaching day. Change it before you teach if the lesson falls on a different day.
 *
 * PREVIOUS, per the brief: reference/Numbers In Science.pptx. Read it. 50 minutes, nine slides,
 * no practical. Vocabulary already taught there: significant figures (count from the first
 * non-zero digit; leading zeros never count), standard form (a negative power means a SMALL
 * number), Celsius and Kelvin (K = degC + 273). Its Hook was 3.0 cm versus 3.00 cm. Its plenary
 * made no firm promise for the next lesson. Burning Food (two lessons earlier) taught repeating a
 * test and the average of 14, 15 and 13. I also read Measuring And Recording Honestly (built for
 * this class, in out/), which defined accuracy (close to the true value) and precision (results
 * close together) with a dartboard; this lesson keeps those definitions and links them to the
 * range.
 *
 * THEY FOUND HARD (brief): the difference between accuracy and precision. It is addressed five
 * times, each in a new shape: Do Now Q3 (a kitchen scale), I Do 1 (three thermometers, where the
 * RANGE shows precision and the MEAN against the true value shows accuracy), We Do row 2, Cold
 * Call Q3, Plenary Q2.
 *
 * THE PRACTICAL (brief): "plotting a set of results", with results FABRICATED for the lesson. It is
 * the You Do: students take three trials per ramp height, calculate means and ranges, choose the
 * graph, plot the means, draw a line of best fit and use it to predict. No equipment, no safety
 * issue. The numbers are in build/averages-graphs-and-models.data.json, used by the deck, the
 * worksheet and the answers, and checked with sympy in build/averages-graphs-and-models-check.py.
 * They are INVENTED, so the speaker notes say to tell the class so.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is the plotting practical, on a PRINTED worksheet (a
 * graph cannot be plotted in Google Classroom), so there is no Classroom logo. No game this lesson:
 * none was asked for.
 *
 * FACTS, checked with a web search: eclipse forecasts are accurate to under a minute over hundreds
 * of years, from mathematical models of the Sun, Moon and Earth's motion (NASA); dry air is about
 * 78% nitrogen, 21% oxygen and 1% other gases; water boils at 100 degC at sea level.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Sunday 4 October 2026';
const LESSON = 'Averages, Graphs And Models';
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
pptx.subject = 'Y7 Science · 7B';

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
    line: { color: o.line || 'D9C9A8', width: o.lineWidth || 1.3 },
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
function sentence(slide, parts, o) {
  slide.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
    shape: S.roundRect, rectRadius: 0.12, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true, align: 'center', valign: 'middle', margin: 0.12, lineSpacing: (o.size ?? 16) + 5, objectName: o.name,
  });
}

const PHASES = [];

/** The six-card grid used by the Do Now and the Cold Call. The number and the question share ONE vertical centre. */
function qGrid(s, o) {
  const cw = (RIGHT - M - 0.30) / 2;
  o.qs.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = o.y0 + row * (o.ch + o.gap);
    card(s, { x, y, w: cw, h: o.ch, name: `${o.p}${i}` });
    const qy = y + 0.14, cy = qy + o.qh / 2;
    s.addShape(S.ellipse, { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.p}${i}_badge` });
    s.addText(String(i + 1), { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.p}${i}_num` });
    s.addText(q, { x: x + 0.80, y: qy, w: cw - 1.02, h: o.qh, color: C.ink, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.62, w: cw - 0.44, h: 0.48,
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
  });
}


const DATA = require('./averages-graphs-and-models.data.json');
const MEAN = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const RANGE = (a) => Math.max(...a) - Math.min(...a);

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['Write 0.00072 in standard form.', '7.2 × 10⁻⁴. A small number has a negative power.'],
    ['Three plants grew 12 cm, 15 cm and 18 cm. Calculate the mean growth.', '15 cm. (12 + 15 + 18) ÷ 3 = 45 ÷ 3.'],
    ['A scale weighs a 500 g bag three times: 530 g, 531 g, 530 g. Is it accurate, precise, both or neither?', 'Precise, not accurate. Close together, but about 30 g too high.'],
    ['A student says 0.0405 has 5 significant figures. Explain the mistake.', 'Leading zeros do not count. It has 3: the 4, 0 and 5.'],
    ['A globe is a model of the Earth. Suggest one reason scientists use models instead of the real thing.', 'Any reasonable answer: too big, too small, too far away, too slow or too dangerous.'],
    ['A graph shows a room\'s temperature every hour for a day. Suggest the best type of graph.', 'A line graph. Both axes are numbers that change smoothly.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ reference/Numbers In Science.pptx (the stated PREVIOUS lesson) and checked every question against the last three Do Nows (Numbers In Science, Measuring And Recording Honestly, Burning Food). Nothing repeats: "why repeat a test", "controlled variable", rounding to a whole number and 3.0 cm against 3.00 cm have each been asked already, so none is asked again.\n\n'
    + 'Q1 AND Q4 RETRIEVE NUMBERS IN SCIENCE in a new shape. Q1 is standard form on a fresh small number (7.2 × 10⁻⁴; watch for 7.2 × 10⁴). Q4 is spot-the-error on significant figures: the leading zeros do not count, but the zero BETWEEN the 4 and the 5 does, so the answer is 3, not 2 and not 5.\n\n'
    + 'Q2 IS THE MEAN, PRIMED. Everyone has met it at primary school: 12 + 15 + 18 = 45, and 45 ÷ 3 = 15. It is a biology context on purpose. Watch for 45 (forgetting to divide), which is We Do row 1.\n\n'
    + 'Q3 IS THE ONE THE CLASS FOUND HARD, accuracy versus precision, in a new shape (not the dartboard). The readings 530, 531 and 530 are very close together, so PRECISE, but the true mass is 500 g, so they are about 30 g too high, so NOT accurate. Do not correct it yet if it comes out wrong. Say "hold that thought, I Do 1 gives you a way to tell".\n\n'
    + 'Q5 AND Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. Q5 primes objective 3 (models). Q6 primes objective 2 (graphs): a line graph, because both temperature and time are numbers that change smoothly.\n\n'
    + 'CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Objectives', 'light');
  const GOALS = ['Calculate the mean and the range of a set of results.', 'Choose the right graph for a set of data, and plot it.', 'Explain what a model is for in science.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['The ', false], ['mean', true], [' gives the typical result, a ', false], ['graph', true], [' shows the pattern, and a ', false], ['model', true], [' predicts.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The last two lessons were about getting good numbers: writing them exactly (Numbers In Science) and, before that, measuring fairly (Burning Food). Today is what a scientist does with a set of numbers once they have them: summarise them, draw them, and use them. Say "you have the numbers. Today we make them mean something."\n\n'
    + 'THE PRACTICAL TODAY IS PLOTTING A SET OF RESULTS. Say so now: it is the You Do, and it is on paper. The results are invented, so no one has to roll anything, and everyone gets the same numbers.\n\n'
    + 'THE BANNER IS THE THROUGHLINE: mean, then graph, then model. Point back at it when the room gets lost. The model "predicts" what you did not measure: that is today\'s last idea.'
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
  s.addText('On 21 August 2017 a total solar eclipse crossed the USA. The time it would reach each town had been published years earlier. How did scientists know?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('eclipse', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_eclipse' });
  const OPTS = [
    ['A', 'They looked at old records and guessed the same would happen'],
    ['B', 'They used a model of how the Sun, Moon and Earth move'],
    ['C', 'They sent a spacecraft ahead to check'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'top', margin: 0, lineSpacing: 23, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: I Do 2 does.\n\n'
    + 'ANSWER, FOR YOU: B. Eclipse times are calculated from a mathematical model of how the Sun, Moon and Earth move. NASA\'s forecasts are accurate to under a minute, hundreds of years ahead. Expect A to attract votes: it feels like "patterns" is how it works. It half is: the pattern is the model, written as maths.\n\n'
    + 'THE POINT FOR TODAY: the model did not exist first. People measured the Moon and Sun again and again, averaged and graphed the results, found the pattern, and wrote it as a model. That is the whole lesson in one sentence: mean, graph, model.\n\n'
    + 'DO NOT EXPLAIN YET. Say "a model that predicts the sky to within a minute. That is what a graph can turn into" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — mean and range
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Mean and range', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'The ', options: {} }, { text: 'mean', options: { bold: true, color: C.accentInk } },
    { text: ' is the results added up, then divided by how many there are. The ', options: {} }, { text: 'range', options: { bold: true, color: C.accentInk } },
    { text: ' is the highest result minus the lowest.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'def_t' });
  const TY = BODY_Y + 1.24, TH = 3.10;
  card(s, { x: M, y: TY, w: CW, h: TH, name: 'tbl' });
  s.addText('WATER BOILS AT 100 °C. THREE THERMOMETERS EACH READ IT THREE TIMES.', { x: M + 0.26, y: TY + 0.14, w: CW - 0.52, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'tbl_h' });
  const COLS = [[0.26, 1.75, 'Thermometer'], [2.10, 2.30, 'Readings (°C)'], [4.50, 1.10, 'Mean'], [5.70, 1.10, 'Range'], [6.95, CW - 6.95 - 0.26, 'What it shows']];
  COLS.forEach(([dx, w, label], ci) => s.addText(label, { x: M + dx, y: TY + 0.56, w, h: 0.32, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: `colh_${ci}` }));
  const TH_ROWS = [
    ['A', 'Accurate and precise.'],
    ['B', 'Precise, but not accurate.'],
    ['C', 'Accurate on average, but not precise.'],
  ];
  TH_ROWS.forEach(([k, verdict], i) => {
    const y = TY + 0.96 + i * 0.68, r = DATA.thermometers[k];
    s.addShape(S.roundRect, { x: M + 0.18, y, w: CW - 0.36, h: 0.58, rectRadius: 0.08, fill: { color: i === 1 ? 'FFF6CC' : C.tint }, line: { color: C.tintDeep, width: 1 }, objectName: `r${k}_bg` });
    const cells = [`Thermometer ${k}`, r.join(',  '), String(MEAN(r)), String(RANGE(r)), verdict];
    COLS.forEach(([dx, w], c) => s.addText(cells[c], { x: M + dx, y, w, h: 0.58, color: c === 4 ? C.dark : C.ink, fontFace: F.body, fontSize: c === 4 ? 13.5 : 15, bold: c !== 1, valign: 'middle', margin: 0, objectName: `r${k}_c${c}` }));
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the definitions, then thermometer A, B and C one at a time.\n\n'
    + 'OBJECTIVE 1, AND THE DIAGNOSTIC THE CLASS FOUND HARD. Calculate each mean and range aloud with them: A is (99 + 100 + 101) ÷ 3 = 300 ÷ 3 = 100, range 101 − 99 = 2. B is (95 + 96 + 97) ÷ 3 = 288 ÷ 3 = 96, range 2. C is (94 + 100 + 106) ÷ 3 = 300 ÷ 3 = 100, range 106 − 94 = 12. Every number on this slide is checked in build/averages-graphs-and-models-check.py.\n\n'
    + 'THE RANGE TELLS YOU ABOUT PRECISION. A small range means the results are close together: precise. A and B both have a range of 2, so both are precise. C has a range of 12, so it is not.\n\n'
    + 'THE MEAN, COMPARED WITH THE TRUE VALUE, TELLS YOU ABOUT ACCURACY. The true boiling point is 100 °C. A and C both average 100, so both are accurate ON AVERAGE. B averages 96, which is 4 degrees off, so it is not accurate.\n\n'
    + 'THE TRAP IS B. It looks like the best thermometer because the readings agree. Say it plainly: "agreeing with each other is not the same as agreeing with the truth". C is the opposite: the readings jump about, but the average is right.\n\n'
    + 'THE SECOND THING TO SAY: a mean can hide a wide spread, which is why we quote the range with it. Two sets of results can have the same mean (A and C) and be very different.\n\n'
    + 'IF ASKED WHY A THERMOMETER WOULD READ 94 AND 106: a poor or damaged one, or one read badly. It is a teaching example, not a typical thermometer.'
  );
  // timer reminder for the animation spec: rows are named rA, rB, rC
}

/* ================================================================== *
 * 5. I DO · 3 — graphs and models
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Graphs and models', 'light');
  const cw = (CW - 2 * 0.30) / 3, GY = BODY_Y, GH = 1.95;
  const TYPES = [
    ['bar', 'chartbar', 'BAR CHART', 'One variable is a category, a word: a type of soil, a material, a name.', 'Water held by sand, clay and loam.'],
    ['line', 'chartline', 'LINE GRAPH', 'Both variables are numbers that change smoothly, like time or height.', 'Temperature every minute as water cools.'],
    ['pie', 'chartpie', 'PIE CHART', 'Parts that make up a whole, shown as slices.', 'The gases in air: nitrogen, oxygen, other.'],
  ];
  TYPES.forEach(([k, icon, head, rule, ex], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: GY, w: cw, h: GH, name: `g_${k}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + cw - 0.74, y: GY + 0.16, w: 0.50, h: 0.50, objectName: `g_${k}_icon` });
    s.addText(head, { x: x + 0.24, y: GY + 0.16, w: cw - 1.0, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `g_${k}_h` });
    s.addText(rule, { x: x + 0.24, y: GY + 0.74, w: cw - 0.48, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `g_${k}_t` });
    s.addText([{ text: 'e.g. ', options: { bold: true, color: C.accentInk } }, { text: ex, options: {} }], { x: x + 0.24, y: GY + 1.38, w: cw - 0.48, h: 0.46, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 16, objectName: `g_${k}_e` });
  });
  const MY = GY + GH + 0.26;
  card(s, { x: M, y: MY, w: CW, h: 1.50, name: 'model' });
  s.addImage({ path: ICON('globe', 'accentInk'), x: M + CW - 0.80, y: MY + 0.16, w: 0.52, h: 0.52, objectName: 'model_icon' });
  s.addText('A MODEL', { x: M + 0.26, y: MY + 0.14, w: CW - 1.3, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'model_h' });
  s.addText([
    { text: 'A model is a simplified idea, picture or equation that helps us ', options: {} }, { text: 'explain or predict', options: { bold: true, color: C.accentInk } },
    { text: ' something we cannot easily see or test directly. The eclipse times came from a model of how the Sun, Moon and Earth move. A ', options: {} },
    { text: 'line of best fit is a model too', options: { bold: true, color: C.accentInk } }, { text: ': it predicts a result you never measured.', options: {} },
  ], { x: M + 0.26, y: MY + 0.54, w: CW - 0.52, h: 1.06, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'model_t' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the three graph types together, then the model.\n\n'
    + 'OBJECTIVE 2, THE CHOICE. The rule is the type of the independent variable. A word (a category): bar chart. A number that can take any value in between (time, height, temperature): line graph. Parts of a whole adding to 100%: pie chart. Ask "what is on the x-axis?" and the choice mostly makes itself.\n\n'
    + 'THE MISCONCEPTION TO WATCH: a bar chart for two continuous numbers because "bar charts look neat". Name it: bars are for separate categories, and a line shows that values in between exist.\n\n'
    + 'THE LINE GRAPH ALSO NEEDS THE RIGHT LINE. A line graph of experimental results is NOT dot-to-dot. It is a LINE OF BEST FIT: a ruler line (or smooth curve) through the middle of the points, with about as many points above as below. Say this now, because the You Do depends on it.\n\n'
    + 'OBJECTIVE 3, THE MODEL. Settle the Hook here: the eclipse model is B. A model is simplified on purpose: the eclipse model ignores the colour of the Moon, the weather, everything not needed to predict where the shadow falls. It is useful because it predicts, not because it is a copy. Other examples to have ready: a globe, a diagram of the particle model of a solid, a weather forecast, a model aeroplane in a wind tunnel.\n\n'
    + 'THE LINK TO TODAY\'S PRACTICAL: the straight line they draw through the ramp results is a model. They will use it to predict a ramp height nobody tested, and say how far to trust it. That is objective 3 in action.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — spot the mistake
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');
  const ROWS = [
    ['"The mean of 4, 7 and 13 is 24."', '24 is the total. Divide by 3: the mean is 8.'],
    ['"The results 95, 96 and 97 are close together, so the thermometer is accurate."', 'Close together means precise. The mean, 96, is far from the true 100, so it is not accurate.'],
    ['"Carpet, wood and tiles should be shown on a line graph."', 'They are categories, not numbers. Use a bar chart.'],
    ['"A model is useless unless it is exactly like the real thing."', 'A model is simplified on purpose. It is useful if it explains or predicts well, within its limits.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'FFF6CC' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 1, THE COMMONEST MEAN MISTAKE: stopping at the total. 4 + 7 + 13 = 24, and 24 ÷ 3 = 8. If anyone says 24 ÷ 4, ask "how many results are there?"\n\n'
    + 'ROW 2 IS THE ONE THE CLASS FOUND HARD, SAID AS A MISCONCEPTION. "Close together" is precision, not accuracy. Make them use both numbers: the range (2) says precise; the mean (96) against the true value (100) says not accurate. This is thermometer B from I Do 1.\n\n'
    + 'ROW 3 IS OBJECTIVE 2. Carpet, wood and tiles are words, so a bar chart. If they argue "but I could join the tops", ask what the point halfway between carpet and wood would mean.\n\n'
    + 'ROW 4 IS OBJECTIVE 3, THE COMMON ONE: students think a model has to be a perfect copy. A model that was a perfect copy would be as hard to use as the real thing. Say "a map as big as the country is no use".'
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
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, qs: [
    ['Calculate the mean of 5, 8, 9 and 14.', '9. (5 + 8 + 9 + 14) ÷ 4 = 36 ÷ 4.'],
    ['Calculate the range of 23, 31, 27 and 19.', '12. 31 − 19.'],
    ['One set of results has a range of 2. Another has a range of 12. State which is more precise.', 'The range of 2. Its results are closer together.'],
    ['Air is about 78% nitrogen, 21% oxygen and 1% other gases. State the best graph to show this.', 'A pie chart. These are parts of a whole.'],
    ['State which axis the independent variable goes on.', 'The x-axis, along the bottom.'],
    ['Explain what a model is for in science.', 'To explain or predict what is too big, small, fast, slow or dangerous to test directly.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1, FRESH NUMBERS, FOUR RESULTS THIS TIME. Q1: 5 + 8 + 9 + 14 = 36, and 36 ÷ 4 = 9. Watch for ÷ 3 (counting the results wrongly). Q2: 31 − 19 = 12. Watch for 31 (the highest only) or 8 (the middle gap).\n\n'
    + 'Q3 IS THE ACCURACY VERSUS PRECISION CHECK, now with the range doing the work. A smaller range is more precise. If a student says "more accurate", ask "accurate compared with what?" Nothing in the question gives a true value, so accuracy cannot be judged.\n\n'
    + 'Q4 AND Q5 ARE OBJECTIVE 2. Q4: parts of a whole adding to 100%, so a pie chart (78 + 21 + 1 = 100). Q5: the independent variable, the one you change, goes on the x-axis. "Dependent on the y-axis" is the other half if anyone asks.\n\n'
    + 'Q6 IS OBJECTIVE 3, COLD. Several right answers: too big (a planet), too small (an atom), too fast, too slow, too dangerous, too expensive. Take two or three. Push for "predict" as well as "explain".\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q6. IF SHORT OF TIME, cut Q1.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 17 — the plotting practical
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 17, 'light'));
  pill(s, 'You Do', 17, 'light');
  s.addText('Plot the ramp results', { x: M, y: 0.86, w: RIGHT - M, h: 0.70, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title' });
  s.addText('Take your printed worksheet.', { x: M, y: 1.52, w: RIGHT - M, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  /* the results, on the slide, so the whole room can see the same numbers */
  const RX = M, RY = 2.10, RW = 5.60, RH = 3.12;
  card(s, { x: RX, y: RY, w: RW, h: RH, name: 'res' });
  s.addText('DISTANCE A TOY CAR ROLLED (cm)', { x: RX + 0.22, y: RY + 0.12, w: RW - 0.44, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 11.5, bold: true, charSpacing: 0.6, valign: 'middle', margin: 0, objectName: 'res_h' });
  const TC = [[0.22, 1.50], [1.72, 1.20], [2.92, 1.20], [4.12, 1.20]], HEAD = ['Ramp height (cm)', 'Trial 1', 'Trial 2', 'Trial 3'];
  HEAD.slice(0, 4).forEach((h, c) => s.addText(h, { x: RX + TC[c][0], y: RY + 0.52, w: TC[c][1], h: 0.36, fill: { color: C.dark }, color: 'FFFFFF', fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `res_h${c}` }));
  DATA.heights.forEach((h, r) => {
    const y = RY + 0.92 + r * 0.42;
    [h, ...DATA.trials[r]].forEach((v, c) => s.addText(String(v), { x: RX + TC[c][0], y, w: TC[c][1], h: 0.38, fill: { color: r % 2 ? C.tint : 'FFFFFF' }, line: { color: C.tintDeep, width: 0.75 }, color: C.ink, fontFace: F.body, fontSize: 14, bold: c === 0, align: 'center', valign: 'middle', margin: 0, objectName: `res_${r}_${c}` }));
  });
  /* the three jobs */
  const JX = RX + RW + 0.30, JW = RIGHT - JX, JH = 0.94, JG = 0.15;
  const JOBS = [
    ['BRONZE', C.alert, 'FBE4E3', 'Mean and range', 'Work out the mean and the range for every ramp height.'],
    ['SILVER', C.support, 'DDF3E5', 'Plot it', 'Choose the graph. Plot the means. Draw a line of best fit.'],
    ['GOLD', C.accentInk, 'FFF6CC', 'Use your model', 'Predict a result you did not measure, and say how far to trust it.'],
  ];
  JOBS.forEach(([n, col, fill, h, body], i) => {
    const y = RY + i * (JH + JG);
    card(s, { x: JX, y, w: JW, h: JH, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: JX + 0.22, y: y + 0.08, w: 1.2, h: 0.32, color: col, fontFace: F.body, fontSize: 13, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(h, { x: JX + 1.40, y: y + 0.08, w: JW - 1.60, h: 0.32, color: C.dark, fontFace: F.body, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: JX + 0.22, y: y + 0.42, w: JW - 0.44, h: 0.46, color: C.inkSoft, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16, objectName: `t${i}_b` });
  });
  /* plot like a scientist */
  const SY = RY + RH + 0.26, SH = 1.30;
  card(s, { x: M, y: SY, w: CW, h: SH, name: 'steps' });
  s.addText('PLOT LIKE A SCIENTIST', { x: M + 0.24, y: SY + 0.10, w: 4, h: 0.30, color: C.dark, fontFace: F.title, fontSize: 12, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'steps_h' });
  const STEPS = ['Independent variable on the x\u2011axis.', 'Label both axes, with units.', 'Plot each MEAN with a small cross.', 'Ruler line of best fit, through the middle.', 'Never dot to dot.'];
  const sw = (CW - 0.48 - 4 * 0.14) / 5;
  STEPS.forEach((t, i) => {
    const x = M + 0.24 + i * (sw + 0.14);
    s.addShape(S.ellipse, { x, y: SY + 0.50, w: 0.34, h: 0.34, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `steps_b${i}` });
    s.addText(String(i + 1), { x, y: SY + 0.50, w: 0.34, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 12, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `steps_n${i}` });
    s.addText(t, { x: x + 0.42, y: SY + 0.44, w: sw - 0.44, h: SH - 0.54, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `steps_t${i}` });
  });
  s.addNotes(
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks: Bronze, Silver, Gold, then the plotting steps. THIS IS THE PRACTICAL: PLOTTING A SET OF RESULTS, on the PRINTED worksheet (a graph cannot be plotted in Google Classroom, so there is no Classroom step). Print the worksheet double-sided, two pages; page 2 has the graph grid and the upside-down answers.\n\n'
    + 'THE RESULTS ARE FABRICATED. No one rolled a car. The numbers were invented to look like a real class\'s results: three trials per ramp height, a little scatter, and a steady rise. Tell the students: "these results were made up so everyone starts with the same numbers. Real results look like this." That is honest, and it matches last lesson\'s message about recording what actually happened. If you want to run it for real another day: a toy car, a plank on books at 10, 20, 30, 40 and 50 cm, three rolls each, measure from the bottom of the ramp to the front wheel.\n\n'
    + 'NO EQUIPMENT AND NO SAFETY ISSUE beyond a sharp pencil. They need a pencil, a ruler and an eraser. A ruler line of best fit is the one skill that really needs the ruler.\n\n'
    + 'THE SHEET IS A SEQUENCE: Bronze, Silver, Gold, then everyone carries on. About 4 minutes on Bronze (the mean and range columns, 10 calculations), 8 on Silver (choose the graph, plot, draw the line), 5 on Gold (predict, and judge the prediction).\n\n'
    + 'WHERE THEY WILL STALL. BRONZE: dividing by 4 or by 5 instead of by 3 (there are three trials), and using the middle value as the range. SILVER: plotting all 15 results instead of the 5 MEANS; axes the wrong way round (height is the independent variable, so it goes on the x-axis); no axis titles or units; joining the dots; forcing the line through (0, 0). The line does not have to go through the origin: it should go through the middle of the points. GOLD Q8: reading the answer off the line, not guessing. Q9: they say the prediction is wrong; push for "less trustworthy, because 100 cm is far outside the heights tested".\n\n'
    + 'IF THEY FINISH EARLY: Gold Q10, then ask "what would you change about the practical to get more precise results?" (more trials; the same release method).\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which is the independent variable, and where does it go?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide: the answers are printed upside down at the end of the worksheet.'
  );
}

/* ================================================================== *
 * 9. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');
  const QS = [
    ['To find the mean, add the results and divide by how many there are.', 'TRUE'],
    ['Results that are close together must also be accurate.', 'FALSE'],
    ['A bar chart is the best graph for time and temperature.', 'FALSE'],
    ['A model has to be exactly like the real thing to be useful.', 'FALSE'],
    ['A line of best fit can predict a value you did not measure.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('The mean gives the typical result, a graph shows the pattern, and a model predicts.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE. Q2 IS THE ONE THE CLASS FOUND HARD, AND THE MOST IMPORTANT STATEMENT ON THE SLIDE: close together is precision. If this splits the room, that is the first five minutes of next lesson, not a footnote. Point back at thermometer B.\n\n'
    + 'Q3 IS OBJECTIVE 2: time and temperature are both numbers, so a line graph. Q4 IS OBJECTIVE 3 AND THE COMMONEST MISCONCEPTION. Q5 IS OBJECTIVE 3 IN ACTION, tied to their own line of best fit.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER, on purpose. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on: running the ramp practical for real, and comparing the class\'s results with the invented ones, is a natural next step.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

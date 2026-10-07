/**
 * Y7 Science, Numbers In Science. Class 7B. Single, 50 minutes. Signal palette, carried on from
 * the unit (Burning Food used it).
 *
 * PREVIOUS, per the brief: reference/Burning Food.pptx. Read it. It is a practical (Do Now 6,
 * Today 1, Hook 2, I Do 3, I Do 3, We Do 4, Plan It 4, Practical 14, You Do 7, Answers 3, Plenary
 * 3), so its shape does not transfer here — this lesson has no practical and follows the ordinary
 * nine-slide archetype instead. What DOES transfer: vocabulary (independent, dependent and
 * controlled variables; "temperature rise"; replication, checked with real arithmetic: 14, 15, 13
 * average to 14), and the Do Now callback in Q1-2 retrieves it. Burning Food's plenary flagged
 * "calculating the energy released" as the natural next step "if the class has met energy
 * calculations" — this lesson does not do that calculation, but it is the numeracy this class
 * would need first (rounding, standard form, unit conversion), so it is a plausible run-up to that
 * promise rather than a fulfilment of it. Said in the speaker notes, not invented as a fake promise.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, Numbers Drill ("your call"), with the
 * worksheet as the fallback, built every time.
 *
 * THE AVOID RULE, from the brief: no significant-figure example may be a whole number ending in
 * 0 (like 4500 to 2 s.f.) — genuinely ambiguous, since the trailing zero could be a real digit or
 * just a placeholder. Every rounding example, in the deck, the worksheet and the game, is checked
 * against this rule as well as for correctness: build/numbers-in-science-check.py for the deck
 * and worksheet, build/check-numbers-in-science-game.py for the game.
 *
 * FACTS used: human body temperature about 37 degC (Cold Call Q5); water boils at 373 K / 100 degC
 * and freezes at 273 K / 0 degC at standard pressure (Cold Call Q6, I Do 2); absolute zero is
 * 0 K = -273 degC on this class's rounded scale (Y7 uses +273, not +273.15).
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 8 October 2026';
const LESSON = 'Numbers In Science';
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
    line: { color: o.line || 'C7D9EA', width: o.lineWidth || 1.3 },
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
      fill: { color: 'E3EDF6' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
  });
}

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, { x: 2.60, y: 0.22, w: 8.10, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['State what the independent variable was in the food-burning test.', 'The food: which food was burned.'],
    ['Three temperature rises were measured: 14°C, 15°C and 13°C. State why the test was repeated three times.', 'So one odd result does not mislead. It checks the results are reliable.'],
    ['Round 7.8 to the nearest whole number.', '8.'],
    ['State which is bigger: 4,000,000 or 400,000.', '4,000,000.'],
    ['State the freezing point of water, in degrees Celsius.', '0°C.'],
    ['A number is written as 3 × 100. Work out its value.', '300.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ reference/Burning Food.pptx (the stated PREVIOUS lesson). It is a practical, so nothing here is repeated verbatim, but Q1 and Q2 retrieve its vocabulary and its checked arithmetic (14, 15, 13 average to 14) in a new shape.\n\n'
    + 'Q1 AND Q2 ARE RETRIEVAL. Q1 needs "the food", not just "food" vaguely; Q2 is replication, not fairness. If anyone says "to be fair", that is a live misconception from the same class Burning Food flagged — correct it now, gently, it will come back in We Do row 3\'s cousin next lesson if not.\n\n'
    + 'Q3 TO Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable working. Q3 primes rounding. Q4 primes magnitude, ahead of standard form. Q5 primes the Celsius scale, ahead of Kelvin. Q6 primes multiplying by a power of ten.\n\n'
    + 'CHANGE THE DATE before you teach.'
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
  const GOALS = ['Write a number to a given number of significant figures.', 'Write a large or small number in scientific notation.', 'Convert between the Celsius and Kelvin scales.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Significant figures, scientific notation and the Kelvin scale all make a number ', false], ['exact', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Burning Food was a practical about doing an investigation fairly. Today is different: it is the numeracy every science measurement needs, whatever the investigation. Say "today has no practical. Today is about writing numbers the way scientists write them."\n\n'
    + 'THE THREE OBJECTIVES ARE CHUKA\'S WORDING, TAUGHT IN ORDER: I Do 1 is significant figures, I Do 2 covers scientific notation and Kelvin together.\n\n'
    + 'THE BANNER IS THE THROUGHLINE. All three objectives are really one idea: a number in science has to be exact, not roughly right. Point back at it whenever a rounding or a unit gets sloppy.'
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
  s.addText('A scientist writes a measurement as 3.0 cm. Another writes 3.00 cm. Are these the same?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, lineSpacing: 29, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('ruler', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_ruler' });
  const OPTS = [
    ['A', 'Yes. Extra zeros do not change a number.'],
    ['B', 'No. 3.00 cm is more precise than 3.0 cm.'],
    ['C', 'No. 3.0 cm is more precise than 3.00 cm.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: the next slide does.\n\n'
    + 'ANSWER, FOR YOU: B. 3.0 cm means measured to the nearest tenth of a centimetre. 3.00 cm means measured to the nearest hundredth: a more precise measurement, even though the value is the same. Expect A to attract most of the votes: most students have never been told a zero can carry real information.\n\n'
    + 'DO NOT EXPLAIN SIGNIFICANT FIGURES YET. Say "that zero on the end is not decoration. It is telling you something. Let\'s find out what." and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — significant figures
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Significant figures', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'Significant figures are the digits in a number that carry real meaning about how ', options: {} },
    { text: 'precise', options: { bold: true, color: C.accentInk } },
    { text: ' it is.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'def_t' });
  const ROWS = [
    ['3.847', '2 s.f.', '3.8', 'Keep 3 and 8. The next digit, 4, rounds down.'],
    ['0.0526', '1 s.f.', '0.05', 'Leading zeros never count. The first real figure is 5.'],
    ['128.4', '3 s.f.', '128', 'Keep 1, 2 and 8. The next digit, 4, rounds down: nothing changes.'],
  ];
  const rowH = 0.62, gap = 0.12, ry0 = BODY_Y + 1.24;
  ROWS.forEach(([val, sf, ans, why], i) => {
    const y = ry0 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `sf${i}` });
    s.addText(val, { x: M + 0.24, y, w: 1.55, h: rowH, color: C.ink, fontFace: F.title, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `sf${i}_v` });
    s.addText(sf, { x: M + 1.85, y, w: 1.10, h: rowH, color: C.inkSoft, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, objectName: `sf${i}_s` });
    s.addText('→', { x: M + 2.95, y, w: 0.45, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sf${i}_arr` });
    s.addText(ans, {
      shape: S.roundRect, rectRadius: 0.08, x: M + 3.46, y: y + 0.09, w: 1.05, h: rowH - 0.18, fill: { color: 'E3EDF6' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.title, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sf${i}_a`,
    });
    s.addText(why, { x: M + 4.70, y, w: RIGHT - (M + 4.70) - 0.10, h: rowH, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, valign: 'middle', margin: 0, lineSpacing: 15, objectName: `sf${i}_w` });
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the definition, then the three rows.\n\n'
    + 'THE RULE FOR THIS LESSON, in plain words: count from the first non-zero digit. Leading zeros (before the first real digit) never count. Everything from the first real digit onwards counts, including zeros between other digits and zeros after the decimal point.\n\n'
    + 'ROW 1 IS THE ORDINARY CASE. ROW 2 IS WHY LEADING ZEROS DO NOT COUNT: 0.0526 has three real digits, 5, 2 and 6, and the two zeros in front are just holding the decimal point in place. ROW 3 IS A ROUNDS-DOWN CASE WHERE NOTHING VISIBLY CHANGES, worth including so students do not assume rounding always alters the digits.\n\n'
    + 'NONE OF THESE EXAMPLES END IN A ZERO THAT NEEDS TO BE A PLACEHOLDER. That is deliberate, per the brief: a number like 4500 to 2 s.f. is genuinely ambiguous, because you cannot tell whether the zeros are real or just holding the place value, and it is not worth that argument in Year 7. Every example today, on the worksheet and in the game, avoids it.\n\n'
    + 'IF ASKED ABOUT TRAILING ZEROS IN A WHOLE NUMBER (why is 4500 tricky?), say honestly that scientists usually solve it with standard form instead, which is exactly tomorrow\'s... today\'s next slide.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — scientific notation and Kelvin
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Scientific notation, and the Kelvin scale', 'light');
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y, w: rw, h: 3.30, name: 'sn' });
  s.addImage({ path: ICON('rocket', 'accentInk'), x: M + rw - 0.70, y: BODY_Y + 0.20, w: 0.50, h: 0.50, objectName: 'sn_icon' });
  s.addText('SCIENTIFIC NOTATION', { x: M + 0.26, y: BODY_Y + 0.16, w: rw - 0.90, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'sn_h' });
  s.addText('A × 10ⁿ, where A is between 1 and 10.', { x: M + 0.26, y: BODY_Y + 0.58, w: rw - 0.52, h: 0.36, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'sn_rule' });
  s.addText([
    { text: 'Large number: 8,200,000 = 8.2 × 10⁶', options: { bullet: true, breakLine: true, paraSpaceAfter: 8, bold: true } },
    { text: 'Small number: 0.000047 = 4.7 × 10⁻⁵', options: { bullet: true, breakLine: true, paraSpaceAfter: 8, bold: true } },
    { text: 'A negative power of 10 means the number is small, not negative.', options: { bullet: true } },
  ], { x: M + 0.26, y: BODY_Y + 1.02, w: rw - 0.52, h: 2.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'sn_t' });
  const kx = M + rw + 0.30;
  card(s, { x: kx, y: BODY_Y, w: rw, h: 3.30, name: 'kv' });
  s.addImage({ path: ICON('thermometer', 'accentInk'), x: kx + rw - 0.70, y: BODY_Y + 0.20, w: 0.50, h: 0.50, objectName: 'kv_icon' });
  s.addText('CELSIUS AND KELVIN', { x: kx + 0.26, y: BODY_Y + 0.16, w: rw - 0.90, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'kv_h' });
  s.addText('K = °C + 273', { x: kx + 0.26, y: BODY_Y + 0.58, w: rw - 0.52, h: 0.36, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'kv_rule' });
  s.addText([
    { text: 'Water freezes: 0°C = 273 K', options: { bullet: true, breakLine: true, paraSpaceAfter: 6, bold: true } },
    { text: 'A warm room: 25°C = 298 K', options: { bullet: true, breakLine: true, paraSpaceAfter: 6, bold: true } },
    { text: 'A cold night: −10°C = 263 K', options: { bullet: true, breakLine: true, paraSpaceAfter: 6, bold: true } },
    { text: '0 K is called absolute zero: the coldest anything can ever be, −273°C.', options: { bullet: true } },
  ], { x: kx + 0.26, y: BODY_Y + 1.02, w: rw - 0.52, h: 2.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: 'kv_t' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the scientific notation card, then the Celsius and Kelvin card.\n\n'
    + 'SCIENTIFIC NOTATION FIXES THE PROBLEM FROM THE END OF THE LAST SLIDE. A big number like 8,200,000 or a small one like 0.000047 is awkward to write and awkward to compare. Scientific notation always has exactly one non-zero digit before the decimal point, so it is never ambiguous the way a big whole number with trailing zeros can be.\n\n'
    + 'THE COMMON MISTAKE IS THE SIGN OF THE POWER. A NEGATIVE power means a SMALL number, not a negative one: 4.7 × 10⁻⁵ is 0.000047, a tiny positive number. Say it plainly: "negative power, small number".\n\n'
    + 'KELVIN. Celsius is set by water: 0 at freezing, 100 at boiling. Kelvin starts at absolute zero instead, the coldest anything can ever be, so Kelvin has no negative numbers in ordinary use. THE RULE FOR THIS CLASS IS K = °C + 273 (not 273.15: that refinement is for later years).\n\n'
    + 'THE MISCONCEPTION TO WATCH: 0°C is NOT 0 K. 0°C is 273 K. This is the single most common error in the topic and it is We Do row 3.'
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
    ['"3.847 rounded to 2 significant figures is 3.9."', 'The next digit is 4, which rounds down. The answer is 3.8.'],
    ['"670,000 in standard form is 6.7 × 10⁴."', 'Count the places: 670,000 = 6.7 × 10⁵, not 10⁴.'],
    ['"0°C is the same temperature as 0 K."', '0°C is 273 K. 0 K is −273°C, absolute zero.'],
    ['"0.0038 in standard form is 3.8 × 10³."', 'The number is small, so the power is negative: 3.8 × 10⁻³.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'E3EDF6' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 1. The rounding digit (4) is below 5, so it rounds down, not up. Ask "what is the digit AFTER the ones we keep?" every time this comes up.\n\n'
    + 'ROW 2 AND ROW 4 ARE BOTH OBJECTIVE 2, from opposite directions: row 2 is a big number with the wrong power, row 4 is a small number with the wrong SIGN on the power. Together they cover the two ways standard form goes wrong.\n\n'
    + 'ROW 3 IS OBJECTIVE 3 AND THE MOST IMPORTANT ROW ON THE SLIDE. This is the single most repeated mistake in the topic. Say the correction slowly: "zero degrees Celsius is two hundred and seventy-three kelvin". Ask a follow-up: "so what is zero kelvin, in Celsius?" (−273°C, absolute zero).'
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
    ['State how many significant figures are in the number 4.06.', '3. Zeros between other digits always count.'],
    ['Round 9.362 to 2 significant figures.', '9.4. The next digit, 6, rounds up.'],
    ['Write 52,000,000 in standard form.', '5.2 × 10⁷.'],
    ['Write 0.0091 in standard form.', '9.1 × 10⁻³.'],
    ['Convert 37°C, human body temperature, to kelvin.', '310 K.'],
    ['Convert 373 K, the boiling point of water, to Celsius.', '100°C.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q1 needs the reason, not just "3": zeros between digits count, unlike leading zeros. Q2 checks the rounding direction on a genuine round-up.\n\n'
    + 'Q3 AND Q4 ARE OBJECTIVE 2, ONE BIG AND ONE SMALL. Both need the coefficient between 1 and 10; "52 × 10⁶" is a common wrong answer for Q3, worth naming if it comes up.\n\n'
    + 'Q5 AND Q6 ARE OBJECTIVE 3, real numbers either way. Q5 is body temperature, Q6 is the boiling point of water read backwards from Kelvin: a good check that they can go both directions, not just add 273.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6, and ask "how would you check that answer?" (Add 273 back the other way.) IF SHORT OF TIME, cut Q1.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 17: the game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 17, 'light'));
  pill(s, 'You Do', 17, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', C.alert, 'F5E3E2', 'Significant figures', 'Round each number. No trailing-zero traps: every answer is clear either way.'],
    ['ROUND 2', C.support, 'DFF0E6', 'Standard form', 'Convert big and small numbers, both directions.'],
    ['ROUND 3', C.accentInk, 'E3EDF6', 'Celsius and Kelvin', 'Convert the scale. Very hard. The last two questions are meant to be almost impossible.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  ROUNDS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.10, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.00, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 2.86, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS NUMBERS DRILL ("your call"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Numbers In Science game" from Google Classroom. Three rounds of six questions, each on their own device, all multiple choice: tap or press 1 to 4. A wrong answer says what the mistake probably was. EVERY STUDENT GETS A DIFFERENT GAME: different numbers, in a different order. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 is rounding to significant figures, every one checked to avoid the trailing-zero ambiguity from the brief. Round 2 is standard form, converting in both directions (a plain number to standard form, and back). Round 3 is Celsius and Kelvin, and the last two questions are drawn from a small pool of genuinely hard templates that combine standard form, Kelvin and rounding in one question. Expect most students to fail those two. That is the design; tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that answer definitely not ambiguous?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['3.0 and 3.00 mean exactly the same thing.', 'FALSE'],
    ['670,000 in standard form is 6.7 × 10⁵.', 'TRUE'],
    ['0°C is the same temperature as 0 K.', 'FALSE'],
    ['Standard form is always a number between 1 and 10, times a power of 10.', 'TRUE'],
    ['9.362 rounded to 2 significant figures is 9.3.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Significant figures, scientific notation and the Kelvin scale all make a number exact.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS THE HOOK, SETTLED. Point back at the tally: 3.00 cm carries more information than 3.0 cm, even though the value is the same.\n\n'
    + 'Q2 IS OBJECTIVE 2, PLAINLY TRUE. Q3 IS THE MISCONCEPTION AND OBJECTIVE 3 DIRECTLY. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q4 IS THE DEFINITION OF STANDARD FORM, worth stating cleanly one more time before they go. Q5 IS THE SAME ROUNDING TRAP AS COLD CALL Q2, asked cold and in reverse: the honest answer is 9.4, not 9.3, because the digit after 6... after the 3 is a 6, which rounds UP.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER WORD FOR WORD, on purpose. THIS LESSON MAKES NO FIRM PROMISE FOR THE NEXT ONE. If you want to lead on: Burning Food\'s own plenary flagged calculating the energy released from the practical\'s results as a natural next step, and today\'s numeracy (rounding, standard form) is exactly what that calculation would need. Your call whether that is the next lesson.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

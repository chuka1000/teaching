/**
 * Y7 Science, Measuring And Recording Honestly. Class 7B. Single, 50 minutes. Signal palette,
 * carried on from the unit (Fair Tests and Variables and Numbers In Science both used it).
 *
 * PREVIOUS, per the brief, TWO decks: reference/Fair Tests and Variables.pptx and
 * reference/Numbers in Science.pptx. Both read. From Fair Tests: independent, dependent and
 * controlled variables, replication ("why repeat a test"), the manipulated/responding pair. From
 * Numbers In Science: significant figures, and specifically its own Hook — "A scientist writes a
 * measurement as 3.0 cm. Another writes 3.00 cm. Are these the same?" — which the brief names
 * directly as THEY FOUND HARD. This lesson exists to resolve that properly: the extra decimal
 * place is about PRECISION (how finely the instrument reads), not about whether the value is
 * CORRECT (accuracy). Do Now Q3 retrieves the exact question as a diagnostic before the lesson
 * reteaches it.
 *
 * SCOPE. The brief asks for accuracy explicitly (objective 1) and the game to drive home
 * "accuracy vs precision" — two different, easily confused words. Both are taught properly and
 * distinguished throughout (I Do 1 and 2), not just the one named in the objective list, because
 * the game instruction makes clear both are the point.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, Accuracy Or Precision ("your call"), with
 * the worksheet as the fallback, built every time.
 *
 * THE HOOK. Four dartboards, drawn as native shapes (no icon exists for this), showing dot
 * clusters: tight-and-centred, tight-and-off-centre, scattered-and-centred, scattered-and-off-
 * centre. This is the standard way this distinction is taught (accuracy = close to the bullseye;
 * precision = the darts landing close together, whatever the position) and it is genuinely
 * useful before any numbers are involved.
 *
 * NUMBERS. Every accuracy/precision example (deck, worksheet, game) is CONSTRUCTED, not
 * threshold-checked after the fact: a "precise" set of readings is built from small, symmetric
 * deltas that sum to zero around the stated centre; an "accurate" set has that centre exactly
 * equal to the true value; a systematic error is a fixed, deliberate offset. This is the same
 * discipline as the AVOID rule in Numbers In Science — build the unambiguous case by
 * construction, rather than deciding afterwards whether a coincidence counts. Checked in
 * build/measuring-and-recording-honestly-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 15 October 2026';
const LESSON = 'Measuring And Recording Honestly';
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

/** A small dartboard: four rings and five dots. `dots` are [dx, dy] offsets from the centre, in
 *  inches, where (0,0) is the bullseye. Used only on the Hook, before the words are defined. */
function dartboard(s, o) {
  const cx = o.x + o.size / 2, cy = o.y + o.size / 2, r = o.size / 2;
  const rings = [1, 0.72, 0.46, 0.22];
  const cols = [C.alert, C.tint, C.alert, C.tint];
  rings.forEach((f, i) => {
    s.addShape(S.ellipse, { x: cx - r * f, y: cy - r * f, w: r * f * 2, h: r * f * 2, fill: { color: cols[i] }, line: { color: C.dark, width: 1 }, objectName: `${o.name}_ring${i}` });
  });
  o.dots.forEach((d, i) => {
    const dr = 0.11;
    s.addShape(S.ellipse, { x: cx + d[0] - dr, y: cy + d[1] - dr, w: dr * 2, h: dr * 2, fill: { color: C.dark }, line: { color: C.tint, width: 1 }, objectName: `${o.name}_dot${i}` });
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
  s.addText(LESSON, { x: 2.10, y: 0.22, w: 9.10, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['State what a controlled variable is.', 'A variable kept the same, so it cannot affect the result.'],
    ['State one reason scientists repeat a test.', 'To check the result is reliable. One odd result should not mislead you.'],
    ['A student writes a length as 3.0 cm. Another writes 3.00 cm. State which is measured more precisely.', '3.00 cm. The extra decimal place shows a finer measurement.'],
    ['Round 6.4 to the nearest whole number.', '6.'],
    ['Name one piece of equipment used to measure length in science.', 'Any reasonable answer: ruler, tape measure, vernier calipers.'],
    ['A student\'s ruler is broken, so it starts measuring from the 1 cm mark instead of 0. Predict what happens to all their measurements.', 'They are all wrong by the same amount, about 1 cm.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ BOTH reference/Fair Tests and Variables.pptx AND reference/Numbers in Science.pptx (both stated PREVIOUS). Q1 and Q2 retrieve the first; Q3 and Q4 retrieve the second.\n\n'
    + 'Q3 IS THE DIAGNOSTIC. The brief names this exact question as what the class found hard. Ask it cold, before reteaching it, and see how many already have it. Do not correct wrong answers yet; say "hold that thought" and move on.\n\n'
    + 'Q5 AND Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. Q6 primes the whole lesson: a broken ruler gives WRONG answers, consistently. That is the idea I Do 1 names.\n\n'
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
  const GOALS = ['Choose the right instrument, and explain what accuracy means.', 'Record results in a clear, complete table.', 'Explain why a scientist records what actually happened.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['A good scientist chooses the right tool, records it exactly, and never changes ', false], ['what they actually saw', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 16, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Fair Tests gave the class the plan (what to change, what to measure, what to keep the same). Numbers In Science gave them a rule for writing numbers precisely. Today is what happens at the bench: choosing the right tool, and being honest about what the tool actually shows.\n\n'
    + 'OBJECTIVE 1 NAMES ACCURACY. The game also drills PRECISION, the word most students confuse with it, so both get real teaching time today even though only one is in the objective list.\n\n'
    + 'THE BANNER IS THE WHOLE LESSON, three clauses in order, matching the three objectives.'
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
  s.addText('Which board is closest to the bullseye on average, but the darts are spread furthest apart?', {
    x: M, y: 0.86, w: RIGHT - M, h: 0.92, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, valign: 'middle', margin: 0, lineSpacing: 27, objectName: 'slide_title',
  });
  const BOARDS = [
    { name: 'A', dots: [[-0.05, 0.03], [0.04, -0.06], [0.06, 0.05], [-0.08, -0.04], [0.02, 0.08]] },
    { name: 'B', dots: [[0.42, -0.34], [0.50, -0.30], [0.46, -0.40], [0.38, -0.30], [0.44, -0.38]] },
    { name: 'C', dots: [[-0.55, 0.50], [0.50, 0.45], [-0.10, -0.55], [0.45, -0.40], [0.15, 0.15]] },
    { name: 'D', dots: [[0.60, 0.45], [0.90, 0.75], [0.65, 0.85], [0.95, 0.50], [0.40, 0.65]] },
  ];
  const bs = 1.85, gap = 0.34, x0 = M + (CW - (4 * bs + 3 * gap)) / 2, y0 = BODY_Y + 0.30;
  BOARDS.forEach((b, i) => {
    const x = x0 + i * (bs + gap);
    dartboard(s, { x, y: y0, size: bs, name: `db${i}`, dots: b.dots });
    s.addText(b.name, { x, y: y0 + bs + 0.08, w: bs, h: 0.46, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `db${i}_label` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four boards on one click.\n\n'
    + 'Show of hands for each letter, and tally on the board. Do not use the words accuracy or precision yet: ask "which one?" and let them describe it however they like.\n\n'
    + 'ANSWER, FOR YOU: C. The darts in C are scattered widely (spread far apart from each other) but they surround the bullseye, so their AVERAGE position is close to it. A is close together AND on the bullseye. B is close together but off to one side. D is spread apart AND off to one side.\n\n'
    + 'DO NOT NAME THE WORDS YET. Say "there are two different ideas hiding in these four boards, and today gives you the words for both" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — accuracy
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Accuracy, and choosing the instrument', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'Accuracy is how close a measurement is to the ', options: {} },
    { text: 'true value', options: { bold: true, color: C.accentInk } },
    { text: '.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'def_t' });
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'br' });
  s.addImage({ path: ICON('ruler', 'accentInk'), x: M + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'br_icon' });
  s.addText('THE BROKEN RULER', { x: M + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'br_h' });
  s.addText('A ruler starts measuring from its 1 cm mark, not 0. Every reading comes out about 1 cm too long, every single time.', { x: M + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'br_t' });
  const rx = M + rw + 0.30;
  card(s, { x: rx, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'ch' });
  s.addImage({ path: ICON('cylinder', 'accentInk'), x: rx + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'ch_icon' });
  s.addText('CHOOSING THE INSTRUMENT', { x: rx + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ch_h' });
  s.addText('The right instrument still needs to be read and used correctly. Neither step alone is enough for an accurate result.', { x: rx + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'ch_t' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the definition, the broken ruler card, the instrument card.\n\n'
    + 'OBJECTIVE 1, FIRST HALF. Accuracy is about being CORRECT: close to the real, true value. It has nothing to do with how many decimal places you write.\n\n'
    + 'THE BROKEN RULER IS FROM THE DO NOW, POINT BACK AT IT. Every reading is wrong by the same amount, because the fault is in the tool itself, not in reading it carefully. That is a SYSTEMATIC error: consistent, and it does not average out no matter how many times you repeat it. This is the dartboard\'s board B, revisited: consistent, but off-target.\n\n'
    + 'CHOOSING THE INSTRUMENT MATTERS FOR OBJECTIVE 1 TOO, but differently: the wrong instrument (a metre ruler for a wire\'s diameter, a kitchen scale for a single grain of rice) cannot give an accurate reading at all, whatever care is taken. Right tool, used correctly: both needed.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — precision
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Precision, and the boards revisited', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'pdef' });
  s.addText([
    { text: 'Precision is how ', options: {} },
    { text: 'close together', options: { bold: true, color: C.accentInk } },
    { text: ' repeated measurements are, and how finely an instrument can read.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'pdef_t' });
  const BOARDS = [
    { name: 'A', label: 'Accurate AND precise', dots: [[-0.05, 0.03], [0.04, -0.06], [0.06, 0.05], [-0.08, -0.04], [0.02, 0.08]] },
    { name: 'B', label: 'Precise, not accurate', dots: [[0.42, -0.34], [0.50, -0.30], [0.46, -0.40], [0.38, -0.30], [0.44, -0.38]] },
    { name: 'C', label: 'Accurate, not precise', dots: [[-0.55, 0.50], [0.50, 0.45], [-0.10, -0.55], [0.45, -0.40], [0.15, 0.15]] },
    { name: 'D', label: 'Neither', dots: [[0.60, 0.45], [0.90, 0.75], [0.65, 0.85], [0.95, 0.50], [0.40, 0.65]] },
  ];
  const bs = 1.10, gap = 0.20, x0 = M, y0 = BODY_Y + 1.20;
  BOARDS.forEach((b, i) => {
    const x = x0 + i * (bs + gap + 1.20);
    dartboard(s, { x, y: y0, size: bs, name: `pb${i}`, dots: b.dots });
    s.addText(b.label, { x: x - 0.30, y: y0 + bs + 0.06, w: bs + 0.60, h: 0.66, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 14, objectName: `pb${i}_label` });
  });
  s.addText('3.0 cm and 3.00 cm show DIFFERENT PRECISION (a finer instrument), not different accuracy.', { x: M, y: BODY_Y + 2.60, w: CW, h: 0.40, color: C.accentInk, fontFace: F.body, fontSize: 13.5, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'p_note' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the definition, then the four boards with their labels.\n\n'
    + 'OBJECTIVE 1, SECOND HALF, THE WORD THE GAME NEEDS. Precision is about CONSISTENCY: darts landing close together, whatever the target says. Board B is precise, board C is not, even though C is more useful science (its average is right).\n\n'
    + 'SETTLE THE HOOK HERE. Board C was the answer: close to the bullseye ON AVERAGE, but scattered. Board B is the trap most students pick instead, because "close together" LOOKS like the better result.\n\n'
    + 'THE LAST LINE IS THE DIAGNOSTIC FROM THE DO NOW, RESOLVED. 3.00 cm is not "more correct" than 3.0 cm; it shows a finer instrument was used to get it. State it exactly this plainly, twice.'
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
    ['"A ruler that always reads 2 cm too long is still accurate, because it is precise."', 'Precise, not accurate. It gives the same wrong answer every time.'],
    ['"Any ruler is fine for measuring the width of a human hair."', 'A ruler cannot read finely enough. A more precise instrument is needed.'],
    ['"It is fine to write \'about 5\' in a table, without a unit, if everyone knows what you mean."', 'A table must be clear and complete on its own. Always include the unit.'],
    ['"If a result does not match what I expected, I should write down what I expected instead."', 'Always record what actually happened, never what was expected.'],
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
    + 'ROW 1 IS OBJECTIVE 1, THE EXACT DISTINCTION FROM I DO. Say it back the same way every time: precise means consistent, accurate means correct, and they are not the same thing.\n\n'
    + 'ROW 2 IS INSTRUMENT CHOICE. A hair is roughly 0.05 to 0.1 mm across; a ruler\'s millimetre marks cannot resolve that at all.\n\n'
    + 'ROW 3 IS OBJECTIVE 2. A table has to stand alone: someone reading it later, with no memory of the lesson, needs the unit on the page.\n\n'
    + 'ROW 4 IS OBJECTIVE 3 AND THE MOST IMPORTANT ROW ON THE SLIDE. This is the one habit the whole lesson is really about. Ask: "what SHOULD you do if a result surprises you?" (Record it as it actually happened. Repeat the measurement if you are unsure. Never substitute the expected value.)'
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
    ['State what accuracy means.', 'How close a measurement is to the true value.'],
    ['State what precision means.', 'How consistent repeated measurements are, and how finely an instrument reads.'],
    ['A thermometer is zeroed incorrectly and always reads 1°C too high. State whether it is accurate, precise, both, or neither.', 'Precise, not accurate.'],
    ['Name one thing a results table column heading should always include.', 'The unit.'],
    ['A result does not match the pattern of the rest of the data. State what a scientist should do.', 'Record it as it actually happened. It can be repeated to check, never deleted or changed.'],
    ['Explain why scientists record their raw results honestly, even when they are inconvenient.', 'Because conclusions must be based on what actually happened, not what was hoped for.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1, BOTH HALVES, COLD. Both need the reason, not just the label repeated.\n\n'
    + 'Q3 IS THE BROKEN RULER, A NEW CONTEXT (a thermometer, not a ruler). If Q1 and Q2 are secure, this is the real test.\n\n'
    + 'Q4 IS OBJECTIVE 2. Q5 AND Q6 ARE OBJECTIVE 3, ONE PRACTICAL AND ONE EXPLAINED. Q5 wants the action; Q6 wants the reason behind it.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, spend longer on Q5 and Q6. IF SHORT OF TIME, cut Q4.'
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
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, valign: 'middle', margin: 0, lineSpacing: 27, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', C.alert, 'F5E3E2', 'Accurate or precise?', 'Real repeated readings. Classify them: accurate, precise, both, or neither.'],
    ['ROUND 2', C.support, 'DFF0E6', 'Choose the instrument', 'The right tool for the job, and fine enough to read it properly.'],
    ['ROUND 3', C.accentInk, 'E3EDF6', 'Harder readings', 'Very hard. The last two questions are meant to be almost impossible.'],
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
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS ACCURACY OR PRECISION, built to the brief ("it should drive home accuracy vs precision"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Measuring And Recording Honestly game" from Google Classroom. Three rounds of six questions, each on their own device, all multiple choice: Accurate and precise, Precise not accurate, Accurate not precise, or Neither. A wrong answer says what the mistake probably was. EVERY STUDENT GETS A DIFFERENT GAME: different numbers, different instruments, in a different order. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 gives real repeated readings and a true value: every question is CONSTRUCTED so the category is unambiguous, the same discipline as Numbers In Science\'s AVOID rule. Round 2 is choosing the right instrument, sometimes for the wrong CATEGORY of measurement entirely, sometimes the right category but too coarse. Round 3 mixes harder arithmetic with recording judgement, and the last two questions (17 and 18) are drawn from a small pool: a genuinely equal-density-style calculation and a question about over-claiming precision the instrument cannot support. Expect most students to fail those two. That is the design; tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "are those readings close TO EACH OTHER, or close to the true value, or both?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['Choosing an instrument with finer markings makes your measurements more precise.', 'TRUE'],
    ['An instrument that gives the same wrong answer every time is accurate.', 'FALSE'],
    ['3.00 cm shows a more precise measurement than 3.0 cm.', 'TRUE'],
    ['If a result looks wrong, you should change it to match your prediction.', 'FALSE'],
    ['A results table needs its units in the column headings, not repeated in every cell.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Choose the right tool, record it exactly, and never change what you saw.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE. Q2 IS THE MISCONCEPTION AND OBJECTIVE 1 DIRECTLY. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q3 IS THE HOOK\'S DIAGNOSTIC, SETTLED ONE LAST TIME. Q4 IS OBJECTIVE 3, THE HABIT ITSELF, ASKED PLAINLY.\n\n'
    + 'Q5 IS OBJECTIVE 2. If it splits the room, that is worth five minutes at the start of the next practical, not a whole reteach.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER, on purpose. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

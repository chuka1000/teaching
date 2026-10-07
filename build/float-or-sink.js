/**
 * Y10 Co-ordinated Science (0654), Float Or Sink. Class 10A. Single, 50 minutes. Density palette,
 * carried on from the unit (Density used it).
 *
 * PREVIOUS, per the brief: reference/Density.pptx. Read it. It is an OLDER build (10 slides, an
 * Answers slide, a 14-minute You Do): earlier than the current standing rules (nine slides, no
 * Answers slide, You Do 17), so its shape is not copied, but its content is read and carried
 * forward, not reinvented: density = mass ÷ volume, g/cm³ and kg/m³ (1 g/cm³ = 1000 kg/m³),
 * volume by displacement (the rise in level IS the volume), and the steel ship / steel marble
 * hook, whose answer is "compare densities, not weights". THE PLENARY'S CLOSING LINE WAS
 * "Compare densities, not weights, to predict floating or sinking." — that is this lesson's
 * opening premise, restated as the Objectives banner, not a new idea.
 *
 * SYLLABUS. 0654 P1.4.3, "Determine whether an object floats or sinks based on density data"
 * (curriculum/0654-INDEX.md; python3 tools/syllabus.py P1.4). The scheme's own suggested activity
 * for this and P1.4.2 is the PhET Buoyancy simulation, which is the brief's PRACTICAL. It is NOT
 * embedded (a live sim needs the room's internet, same caution as a YouTube embed, CLAUDE.md
 * "Media"): it is signposted as an optional live demonstration in I Do 1's speaker notes, run at
 * the teacher's discretion, while the on-slide content stays self-contained with real, checked
 * density data so the lesson still works if the wifi is down.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, Float Or Sink ("your call"), with the
 * worksheet as the fallback, built every time.
 *
 * FACTS, checked with a web search: ice at 0°C is about 0.92 g/cm³ (0.9167 g/cm³) and water at 0°C
 * is about 1.00 g/cm³ (0.9998 g/cm³) — ice is roughly 8% less dense (Wikipedia, "Ice"; USGS Water
 * Science School). Ice is less dense because frozen water molecules lock into an open hexagonal
 * lattice, held apart by hydrogen bonds, with more space between them than in the liquid — not
 * because of trapped air. Cork about 0.25 g/cm³, oak wood about 0.85 g/cm³, aluminium about
 * 2.70 g/cm³, seawater about 1.03 g/cm³ (denser than fresh water). Every comparison used is
 * checked in build/float-or-sink-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('density');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Tuesday 6 October 2026';
const LESSON = 'Float Or Sink';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_density_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y10 Co-ordinated Science (0654) · 10A';

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
    line: { color: o.line || 'D7E8EA', width: o.lineWidth || 1.3 },
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
      fill: { color: 'D7E8EA' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
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
  s.addText(LESSON, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['State the equation for density.', 'Density = mass ÷ volume.'],
    ['Find the density of a 40 g object with a volume of 8 cm³.', '5 g/cm³. 40 ÷ 8.'],
    ['Convert 1 g/cm³ to kg/m³.', '1000 kg/m³.'],
    ['A student says: "The steel ship floats because it weighs less than the marble." Explain the mistake.', 'The ship weighs far more overall. Its average density, air included, is lower than water\'s.'],
    ['State whether you think an ice cube will float or sink in water, and why.', 'Any reasonable prediction and reason.'],
    ['Water has a density of 1 g/cm³. A block has a density of 0.9 g/cm³. Predict whether it floats or sinks.', 'Floats: any reasonable prediction, not marked on the reason yet.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ reference/Density.pptx (the stated PREVIOUS lesson). It is an older-style build, so its shape is not copied, but Q1 to Q4 retrieve its content directly: the equation, a fresh density calculation (new numbers, not the worksheet\'s 63 g and 9 cm³), the g/cm³-to-kg/m³ conversion it flagged as "worth having ready", and the ship/marble Hook\'s own conclusion, restated as a spot-the-error.\n\n'
    + 'Q4 IS THE HINGE QUESTION. It is Density\'s plenary promise, tested before the lesson starts: "compare densities, not weights". If most of the room gets this right unprompted, today is about applying that idea, not re-teaching it.\n\n'
    + 'Q5 AND Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable prediction with a reason. Q5 primes objective 3. Q6 primes the comparison rule in numbers, ahead of I Do 1.\n\n'
    + 'THEY FOUND HARD: not stated in the brief. Nothing guessed.\n\n'
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
  const GOALS = [
    ['Determine whether an object floats or sinks from density data.', 'P1.4.3'],
    ['Explain floating and sinking by comparing densities.', null],
    ['Explain why ice floats on water.', null],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach(([g, tag], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    if (tag) s.addText(tag, { x: x + cw - 1.00, y: BODY_Y + 0.56, w: 0.74, h: 0.34, color: C.accentInk, fontFace: F.body, fontSize: 11, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: `o${i}_tag` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Floating and sinking is decided by comparing ', false], ['densities', true], [', not weights.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Five clicks.\n\n'
    + 'WHERE THIS SITS. Density gave you the tool: mass ÷ volume. Today is the first thing that tool is actually FOR. Say "last lesson you learned to measure density. Today you use it."\n\n'
    + 'OBJECTIVE 1 IS TAGGED P1.4.3, quoted from the 0654 scheme of work almost exactly: "determine whether an object floats or sinks based on density data" (tools/syllabus.py P1.4). That is the wording the exam is written against.\n\n'
    + 'THE BANNER IS DENSITY\'S OWN CLOSING LINE, WORD FOR WORD. That repetition is deliberate: this lesson does not introduce a new idea, it applies last lesson\'s idea, twice (objective 2 in general, objective 3 to one specific, surprising case).'
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
  s.addText('Almost every solid sinks in its own liquid. Ice floats on water. Why?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('ice', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_ice' });
  const OPTS = [
    ['A', 'Ice weighs less than the water around it.'],
    ['B', 'Ice has a lower density than liquid water.'],
    ['C', 'Ice contains trapped air bubbles.'],
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
    + 'Show of hands for each, and tally on the board. Do not settle it: I Do 2 does.\n\n'
    + 'ANSWER, FOR YOU: B. Ice really is less dense than liquid water, about 0.92 g/cm³ against about 1.00 g/cm³. Expect A and C to attract most of the votes: "weighs less" repeats the exact misconception this class fixed last lesson (size and weight are not density), and "trapped air" is the single most common wrong explanation for this fact anywhere, including outside school.\n\n'
    + 'DO NOT EXPLAIN THE REAL REASON YET. Say "hold that thought, we will come back to the actual numbers" and move to I Do 1, which is the general rule this is one example of.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — comparing densities
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Compare the densities', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'An object floats if its density is ', options: {} },
    { text: 'lower', options: { bold: true, color: C.accentInk } },
    { text: ' than the liquid\'s. It sinks if its density is ', options: {} },
    { text: 'higher', options: { bold: true, color: C.accentInk } },
    { text: '.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 16.5, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'def_t' });
  const ROWS = [
    ['Cork', '0.25 g/cm³', 'Floats'], ['Oak wood', '0.85 g/cm³', 'Floats'],
    ['Aluminium', '2.70 g/cm³', 'Sinks'], ['Steel', '7.90 g/cm³', 'Sinks'],
  ];
  const rw = (CW - 3 * 0.16) / 4;
  ROWS.forEach(([name, d, verdict], i) => {
    const x = M + i * (rw + 0.16), y = BODY_Y + 1.24;
    card(s, { x, y, w: rw, h: 1.66, name: `fs${i}` });
    s.addText(name, { x: x + 0.16, y: y + 0.14, w: rw - 0.32, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `fs${i}_n` });
    s.addText(d, { x: x + 0.16, y: y + 0.54, w: rw - 0.32, h: 0.32, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, valign: 'middle', margin: 0, objectName: `fs${i}_d` });
    s.addText(verdict, {
      shape: S.roundRect, rectRadius: 0.08, x: x + 0.16, y: y + 1.02, w: rw - 0.32, h: 0.48, fill: { color: verdict === 'Floats' ? 'D7E8EA' : 'FBE4E4' }, line: { color: verdict === 'Floats' ? C.support : C.alert, width: 1.3 },
      color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `fs${i}_v`,
    });
  });
  s.addText('Water’s density is 1.00 g/cm³ throughout.', { x: M, y: BODY_Y + 3.06, w: CW, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, italic: true, valign: 'middle', margin: 0, objectName: 'fs_note' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the rule, then the four-card row.\n\n'
    + 'THE RULE IS OBJECTIVE 1, DIRECTLY: this is the whole of P1.4.3. It only needs the two densities compared, nothing else.\n\n'
    + 'RUN THIS LIVE IF YOU CAN: the syllabus\'s own suggested activity for this objective is the PhET Buoyancy simulation (phet.colorado.edu/en/simulation/legacy/buoyancy). It needs the room\'s internet, so it is not built into the slide, but if you have it, project it here: drop in a block, read its density off the sim, and ask the class to predict floats or sinks BEFORE you release it. Two or three objects is enough; do not let it eat I Do 2\'s time.\n\n'
    + 'THE FOUR MATERIALS ARE REAL, VERIFIED VALUES, not rounded for convenience: cork about 0.25 g/cm³, oak wood about 0.85 g/cm³, aluminium about 2.70 g/cm³, steel about 7.90 g/cm³, all compared against water at 1.00 g/cm³. Read each one as "compare it to water\'s 1.00 g/cm³" out loud, every time, until it is automatic.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — why ice floats
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Why ice floats on water', 'light');
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y, w: rw, h: 2.90, name: 'iw' });
  s.addImage({ path: ICON('ice', 'accentInk'), x: M + rw - 0.66, y: BODY_Y + 0.18, w: 0.46, h: 0.46, objectName: 'iw_icon' });
  s.addText('THE NUMBERS', { x: M + 0.26, y: BODY_Y + 0.16, w: rw - 0.86, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'iw_h' });
  const bx = M + 0.26, bw = rw - 0.52;
  const bar = (label, val, max, y, name, col) => {
    s.addText(label + '  ' + val.toFixed(2) + ' g/cm³', { x: bx, y: y - 0.32, w: bw, h: 0.28, color: C.ink, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: `${name}_l` });
    s.addShape(S.roundRect, { x: bx, y, w: bw, h: 0.30, rectRadius: 0.06, fill: { color: 'D7E8EA' }, line: { color: 'D7E8EA', width: 0 }, objectName: `${name}_track` });
    s.addShape(S.roundRect, { x: bx, y, w: bw * val / max, h: 0.30, rectRadius: 0.06, fill: { color: col }, line: { color: col, width: 0 }, objectName: `${name}_fill` });
  };
  bar('Water', 1.00, 1.00, BODY_Y + 0.90, 'iw_water', C.support);
  bar('Ice', 0.92, 1.00, BODY_Y + 1.60, 'iw_ice', C.accent);
  s.addText('Ice is about 8% less dense than water, so it floats with roughly 92% of itself underwater.', { x: bx, y: BODY_Y + 2.12, w: bw, h: 0.70, color: C.inkSoft, fontFace: F.body, fontSize: 12, valign: 'top', margin: 0, lineSpacing: 15, objectName: 'iw_fact' });
  const rx = M + rw + 0.30;
  card(s, { x: rx, y: BODY_Y, w: rw, h: 2.90, name: 'why' });
  s.addText('WHY', { x: rx + 0.26, y: BODY_Y + 0.16, w: rw - 0.52, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'why_h' });
  s.addText([
    { text: 'Liquid water: molecules are close together, packed at random.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Frozen water: molecules lock into a fixed, open pattern, held apart from each other.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'The same mass of water takes up MORE space as ice, so its density is LOWER.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8, bold: true } },
    { text: 'It is not trapped air. It is the arrangement of the water molecules themselves.', options: { bullet: true } },
  ], { x: rx + 0.26, y: BODY_Y + 0.58, w: rw - 0.52, h: 2.20, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'why_t' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the two bars, then the why card.\n\n'
    + 'THE HOOK IS SETTLED HERE. Ice is about 0.92 g/cm³, water is about 1.00 g/cm³, both real, checked values (0.9167 and 0.9998 at 0°C, rounded for the room). Ice is lower, so by yesterday\'s rule it floats. That is objective 3, done in one comparison.\n\n'
    + 'THE 92% UNDERWATER LINE IS WORTH SAYING SLOWLY: a floating object sinks until it displaces its own weight of liquid, so the fraction submerged is roughly its own density divided by the liquid\'s. An iceberg\'s "tip" being small is this fact, at scale.\n\n'
    + 'WHY IT HAPPENS AT ALL is the deeper point, for the strongest students: liquid water\'s molecules pack close and randomly, but frozen water molecules lock into an open, hexagonal pattern, held apart by hydrogen bonds, so the same mass spreads over more volume. Density is mass PER VOLUME, so more volume for the same mass means lower density. You do not need to name hydrogen bonds if this class has not met them; "the molecules lock into a pattern that holds them further apart" is enough.\n\n'
    + 'KILL THE TRAPPED-AIR MYTH EXPLICITLY, out loud, pointing at the last bullet. It is the Hook\'s option C and it will still be in the room.'
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
    ['"A material with a density of 3 g/cm³ will float in water."', '3 g/cm³ is higher than water\'s 1.00 g/cm³, so it sinks.'],
    ['"An object floats because it is lighter than the liquid."', 'It floats because its DENSITY is lower, not its weight. A floating log is heavier than a sinking pebble.'],
    ['"Ice floats because it has trapped air bubbles inside it."', 'Ice floats because its density, 0.92 g/cm³, is lower than water\'s, 1.00 g/cm³. That is the molecules, not air.'],
    ['"An object with a density of 0.95 g/cm³ will sink in water."', '0.95 g/cm³ is lower than water\'s 1.00 g/cm³, so it floats.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'D7E8EA' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 1, THE PLAIN CASE. Say the comparison out loud every time: "3 against 1".\n\n'
    + 'ROW 2 IS OBJECTIVE 2 AND THE MOST IMPORTANT ROW ON THE SLIDE. Weight is not density. A supertanker is far heavier than a paperclip and still floats; the paperclip sinks. If this lands, everything else on the slide is easier.\n\n'
    + 'ROW 3 IS OBJECTIVE 3, THE HOOK\'S TRAP, SPELLED OUT. Row 4 is objective 1 again, from the other direction (a number BELOW 1.00 for once), so students do not default to "big number sinks" without checking which way the comparison runs.'
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
    ['State the rule that decides whether an object floats or sinks in a liquid.', 'Compare the object\'s density to the liquid\'s. Lower floats, higher sinks.'],
    ['Aluminium has a density of 2.70 g/cm³. Determine whether it floats or sinks in water.', 'Sinks. 2.70 is higher than water\'s 1.00 g/cm³.'],
    ['Cork has a density of 0.25 g/cm³. Determine whether it floats or sinks in water.', 'Floats. 0.25 is lower than water\'s 1.00 g/cm³.'],
    ['State the density of ice and the density of water, in g/cm³.', 'Ice about 0.92 g/cm³. Water about 1.00 g/cm³.'],
    ['Explain, in terms of density, why ice floats on water.', 'Ice\'s density is lower than water\'s. Its molecules lock into a pattern that holds them further apart.'],
    ['A steel ship floats, even though steel itself is denser than water. Explain why, using density.', 'The hull traps a lot of air. The ship\'s average density, air included, is lower than water\'s.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 IS OBJECTIVE 1, STATED COLD. It needs both halves: compare TO the liquid, and which way round lower and higher go.\n\n'
    + 'Q2 AND Q3 ARE OBJECTIVE 1, APPLIED, ONE EACH WAY. Both are real values already seen on I Do 1; the test is recall plus the comparison, not new numbers.\n\n'
    + 'Q4 AND Q5 ARE OBJECTIVE 3. Q4 wants the numbers; Q5 wants the reason, not just "lower density" repeated.\n\n'
    + 'Q6 IS OBJECTIVE 2, THE HARDEST QUESTION ON THE SLIDE, closing the loop back to Density\'s own Hook. It needs "average density", not just "it has air in it". If the room stalls, ask "what is the ship\'s volume, if you count the air inside the hull as part of it?"\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6. IF SHORT OF TIME, cut Q2.'
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
    ['ROUND 1', C.alert, 'FBE4E4', 'Compare the densities', 'Given both densities directly. Floats, sinks, or not enough information.'],
    ['ROUND 2', C.support, 'D7EFE5', 'Calculate, then decide', 'Work out the density first, from mass and volume.'],
    ['ROUND 3', C.accentInk, 'D7E8EA', 'Harder shapes and liquids', 'Very hard. The last two questions are meant to be almost impossible.'],
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
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS FLOAT OR SINK ("your call"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Float Or Sink game" from Google Classroom. Three rounds of six questions, each on their own device, all multiple choice: Floats, Sinks, Stays suspended, or Not enough information. A wrong answer says what the mistake probably was. EVERY STUDENT GETS A DIFFERENT GAME: different materials, different numbers, in a different order. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 gives both densities directly. Round 2 gives mass and volume, so the density has to be calculated first, then compared. Round 3 is hollow and composite objects (a container with air inside, like the steel ship), and switching the liquid (the same object in fresh water and in seawater, which are different densities). The last two questions (17 and 18) are drawn from a small pool of very hard templates, including the case where an object\'s density exactly equals the liquid\'s and it neither floats nor sinks. Expect most students to fail those two. That is the design; tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which density is bigger, the object\'s or the liquid\'s?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['An object floats if its density is less than the liquid\'s density.', 'TRUE'],
    ['A heavier object always sinks.', 'FALSE'],
    ['Ice floats because it contains trapped air bubbles.', 'FALSE'],
    ['Water is one of very few substances where the solid is less dense than the liquid.', 'TRUE'],
    ['An object with a density of 0.95 g/cm³ will sink in water.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Compare the densities to know whether something floats or sinks. Weight never decides it alone.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE. Q2 IS THE MISCONCEPTION AND OBJECTIVE 2 DIRECTLY. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q3 IS THE HOOK, SETTLED ONE LAST TIME. Q4 IS OBJECTIVE 3, GENERALISED: water\'s solid-less-dense-than-liquid behaviour is genuinely unusual among substances, worth saying plainly.\n\n'
    + 'Q5 IS THE SAME CHECK AS WE DO ROW 4, asked cold: 0.95 is lower than 1.00, so it floats, not sinks.\n\n'
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

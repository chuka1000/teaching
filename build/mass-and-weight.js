/**
 * Y10 Science — Mass and Weight (P1.3.1-3).
 * Single, 50 minutes. Standard archetype, no deviation needed.
 *
 * Follows reference/Equations of Motion.pptx directly — same 'motion'
 * palette, same unit, carried forward per CLAUDE.md's "a second lesson
 * should look like the first". More than palette carries over: the gradient
 * skill from that deck's slide 4 (v = u + at from the gradient of a v-t
 * graph) is reused here for g = W/m from the gradient of a W-m graph. Say so
 * on I Do 2 — it is the same skill in a new place, not a new one.
 *
 * AVOID, per the brief: g = 10 N/kg (always 9.8), and any wording that lets
 * "weight" mean mass. Every numeric answer checked with sympy before it went
 * on a slide or the worksheet — see the check script this was built from.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 24 September 2026';
const LESSON = 'Mass and Weight';
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
pptx.subject = 'Y10 Physics · General Physics · Mass and weight';

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

/** A small mass-vs-weight graph, same visual language as the motion decks' velocity-time graphs. */
function graph(slide, o) {
  const { x, y, w, h, name } = o;
  slide.addShape(S.rect, {
    x, y: y - h, w, h, fill: { color: 'FFFFFF' },
    line: { color: 'D8DEEC', width: 1.2 }, objectName: `${name}_panel`,
  });
  for (let i = 1; i < 4; i++) {
    slide.addShape(S.line, {
      x, y: y - (i / 4) * h, w, h: 0,
      line: { color: 'EDF0F7', width: 1 }, objectName: `${name}_g${i}`,
    });
  }
  slide.addShape(S.line, { x, y: y - h, w: 0, h, line: { color: C.inkSoft, width: 1.6 }, objectName: `${name}_ay` });
  slide.addShape(S.line, { x, y, w, h: 0, line: { color: C.inkSoft, width: 1.6 }, objectName: `${name}_ax` });
  for (let i = 0; i < o.pts.length - 1; i++) {
    const [x1, y1] = o.pts[i], [x2, y2] = o.pts[i + 1];
    slide.addShape(S.line, {
      x: x + x1 * w, y: y - y1 * h, w: (x2 - x1) * w, h: -(y2 - y1) * h,
      line: { color: o.colour || C.accent, width: 4 }, objectName: `${name}_s${i}`,
    });
  }
  o.pts.forEach(([px, py], i) => {
    const r = 0.09;
    slide.addShape(S.ellipse, {
      x: x + px * w - r / 2, y: y - py * h - r / 2, w: r, h: r,
      fill: { color: C.dark }, line: { color: C.dark, width: 0 }, objectName: `${name}_pt${i}`,
    });
  });
  slide.addText(o.ylab, {
    x: x - 0.10, y: y - h - 0.44, w: 2.4, h: 0.34, color: C.inkSoft, fontFace: F.body,
    fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: `${name}_yl`,
  });
  slide.addText(o.xlab, {
    x: x + w - 1.30, y: y + 0.06, w: 1.30, h: 0.34, color: C.inkSoft, fontFace: F.body,
    fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: `${name}_xl`,
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
    ['What does the gradient of a velocity–time graph give you?', 'The acceleration.'],
    ['What is the unit of acceleration?', 'm s⁻²'],
    ['A car accelerates at 4 m s⁻² for 3 s from rest. Find v.', '12 m s⁻¹'],
    ['What is the unit of force?', 'The newton (N).'],
    ['What tool measures force directly?', 'A newtonmeter.'],
    ['v = u + at came from the gradient of which graph?', 'A velocity–time graph.'],
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
      color: C.dark, fontFace: F.body, fontSize: 15, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW — 10 minutes. Six clicks.\n\n'
    + 'Q1, Q3 AND Q6 are direct retrieval from Equations of Motion — same wording, same graph. Point that out: today reuses "gradient" for something new.\n\n'
    + 'Q4 AND Q5 bridge into today’s practical. If "newtonmeter" gets no response, that is worth knowing before the demo.\n\n'
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
    'Say what mass actually measures.',
    'Say what weight actually measures — and that it is not the same thing.',
    'Use g = W ÷ m, with g ≈ 9.8 N/kg.',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `o${i}_t`,
    });
  });
  s.addText('Same amount of stuff, different amount of pull. That is the whole lesson.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes('TODAY — 1 minute. Four clicks. The banner is the misconception the whole lesson is aimed at: mass and weight get treated as the same thing measured two ways. They are not.');
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('"I weigh 60 kg."', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 36,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 44, objectName: 'slide_title',
  });
  s.addText('What is wrong with this sentence?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'Nothing — that’s correct.'], ['B', 'Kilograms measure mass, not weight.'], ['C', 'You can’t weigh a number.']];
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
      fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK — 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board.\n\n'
    + 'ANSWER: B. 60 kg is a mass. Their weight is 60 × 9.8 = 588 N — say the number, do not reveal how yet, I Do 2 gets there.\n\n'
    + 'C IS A DISTRACTOR, not the point — "I weigh 60" without units would be the real problem with C’s reasoning; the sentence as given does have units, they are just the wrong quantity’s units.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — mass vs weight
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Mass and weight are not the same thing', 'light');

  const ROWS = [
    ['Mass', 'The amount of matter in something.', 'kilograms (kg)', 'Same everywhere — Earth, Moon, space.'],
    ['Weight', 'The gravitational force pulling on that mass.', 'newtons (N)', 'Changes with gravity — less on the Moon.'],
  ];
  ROWS.forEach(([n, def, unit, note], i) => {
    const y = BODY_Y + 0.20 + i * 1.55;
    card(s, { x: M, y, w: RIGHT - M, h: 1.35, fill: i === 1 ? 'FFEFE2' : 'FFFFFF', line: i === 1 ? C.accent : 'D8DEEC', name: `mw${i}` });
    s.addText(n, {
      x: M + 0.24, y: y + 0.14, w: 2.2, h: 0.50, color: C.dark, fontFace: F.title, fontSize: 22,
      bold: true, valign: 'middle', margin: 0, objectName: `mw${i}_n`,
    });
    s.addText(def, {
      x: M + 2.50, y: y + 0.14, w: 5.6, h: 0.50, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, objectName: `mw${i}_d`,
    });
    s.addText(unit, {
      shape: S.roundRect, rectRadius: 0.08,
      x: RIGHT - 2.60, y: y + 0.16, w: 1.40, h: 0.46, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `mw${i}_u`,
    });
    s.addText(note, {
      x: M + 0.24, y: y + 0.74, w: RIGHT - M - 0.48, h: 0.44, color: C.inkSoft, fontFace: F.body,
      fontSize: 13.5, italic: true, valign: 'middle', margin: 0, objectName: `mw${i}_note`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Four clicks: mass row, weight row, then talk through the demo.\n\n'
    + 'DEMO NOW: hang 100 g, then 200 g, then 500 g from a newtonmeter. Expect readings of about 1 N, 2 N and 5 N. Say the numbers out loud as you read them — do not just show the meter.\n\n'
    + 'THE POINT OF THE DEMO: mass goes up, weight goes up, but they are never the same number — 100 g gives about 1 N, not 100 N and not 0.1 N. That gap IS gravity.\n\n'
    + 'IF NO NEWTONMETER IS AVAILABLE: use the numbers anyway and say so — "these are real readings from this experiment" is worth more than a video, but a description with real numbers still beats skipping it.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — finding g
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The gradient gives you g', 'light');

  graph(s, {
    x: M + 0.20, y: 5.70, w: 4.60, h: 2.60, name: 'g1',
    pts: [[0.02, 0.05], [0.98, 0.95]], ylab: 'W / N', xlab: 'm / kg', colour: C.support,
  });

  const STEPS = [
    ['1', 'gradient of a W–m graph = W ÷ m', 'Same gradient skill as v = u + at.'],
    ['2', 'W ÷ m is called g', 'Weight per unit mass.'],
    ['3', 'g ≈ 9.8 N/kg', 'Not 10. Near the Earth’s surface.'],
    ['4', 'g = W ÷ m,   so   W = mg', 'Both forms, same equation.'],
  ];
  const tx = M + 5.30;
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: tx, y, w: RIGHT - tx, h: 0.86,
      fill: i === 3 ? 'FFEFE2' : 'FFFFFF', line: i === 3 ? C.accent : 'D8DEEC',
      lineWidth: i === 3 ? 1.7 : 1.3, name: `gr_${i}`,
    });
    s.addText(n, {
      x: tx + 0.22, y, w: 0.34, h: 0.86, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `gr_${i}_n`,
    });
    s.addText(eq, {
      x: tx + 0.64, y: y + 0.08, w: RIGHT - tx - 0.88, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `gr_${i}_e`,
    });
    s.addText(note, {
      x: tx + 0.64, y: y + 0.48, w: RIGHT - tx - 0.88, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `gr_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Six clicks: the graph, then the four steps.\n\n'
    + 'PLOT THE DEMO’S OWN THREE POINTS if you have time — (0.1, 0.98), (0.2, 1.96), (0.5, 4.9). They sit on a straight line through the origin, and that line’s gradient is g.\n\n'
    + 'THIS IS THE SAME SKILL AS EQUATIONS OF MOTION SLIDE 4. Say so directly: "you already know how to read a gradient off a graph — today it gives you g instead of a."\n\n'
    + 'STEP 3 IS THE ONE TO BE STRICT ABOUT. g ≈ 9.8 N/kg, never 10 — 10 is a shortcut some students bring from other resources. Correct it every time it appears today.\n\n'
    + 'CHECK AGAINST THE HOOK: 60 kg × 9.8 = 588 N. That is where that number came from.'
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
    ['"My mass is 70 N."', 'My mass is 70 kg.'],
    ['g = 10 N/kg', 'g ≈ 9.8 N/kg'],
    ['"A 2 kg mass weighs 2 N."', 'A 2 kg mass weighs about 19.6 N.'],
    ['"Weight is measured in kilograms."', 'Weight is in newtons. Mass is in kilograms.'],
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
      fill: { color: 'FFEFE2' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 14.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 AND ROW 4 ARE THE UNITS ROWS — kg for mass, N for weight, every time. This is the single most common exam slip at this level: writing "kg" where "N" belongs, or the reverse.\n\n'
    + 'ROW 2 IS THE g = 10 TRAP. Some students will insist this is what they were taught elsewhere. Hold the line: 9.8 here, always.\n\n'
    + 'ROW 3: 2 × 9.8 = 19.6 N, not 2 N. This is the Hook misconception again, with numbers.'
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
    ['What is mass?', 'The amount of matter in something.'],
    ['What is weight?', 'The gravitational force on a mass.'],
    ['What is the unit of mass?', 'kg'],
    ['What is the unit of weight?', 'N'],
    ['A 3 kg mass. Find its weight.', '3 × 9.8 = 29.4 N'],
    ['Complete: g = ___ ÷ ___', 'W ÷ m'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 16, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL — 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 AND Q2 want the DEFINITION, not the unit — if a student answers "kg" to Q1, that is the unit, not the definition. Push once: "what does mass actually measure?"\n\n'
    + 'Q5 IS THE FIRST TIMED CALCULATION. If they reach for 10 instead of 9.8, that is the moment to correct it, not later.\n\n'
    + 'Q6 checks the equation both ways — they need this rearranged on the worksheet.'
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
    ['BRONZE', C.alert, 'FFE9E0', 'Substitute', 'Use W = mg. g ≈ 9.8 N/kg, never 10.'],
    ['SILVER', '5A6480', 'F1F2F6', 'Rearrange', 'Find m or g when W is given.'],
    ['GOLD', C.accentInk, 'FFEFE2', 'Plot it', 'A data table of mass and weight — plot it, read off g from the gradient.'],
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
      fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 19, objectName: `t${i}_b`,
    });
  });
  s.addText('Units every time: kg for mass, N for weight. g ≈ 9.8 N/kg.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO — 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that a mass or a weight, and how do you know?"\n\n'
    + 'WHERE THEY WILL STALL: the Gold plot — reading a gradient off their own axes rather than a printed graph. Point them back to I Do 2 if they freeze.\n\n'
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
    ['1', 'W = 0.5 × 9.8 = 4.9 N'],
    ['2', 'W = 8 × 9.8 = 78.4 N'],
    ['3', 'kg for mass, N for weight'],
    ['4', 'm = 19.6 ÷ 9.8 = 2 kg'],
    ['5', 'm = 4.9 ÷ 9.8 = 0.5 kg'],
    ['6', 'g = 14.7 ÷ 1.5 = 9.8 N/kg'],
    ['7', 'g ≈ 9.8 N/kg (from the graph’s gradient)'],
    ['8', 'W = mg, so the graph is a straight line through the origin'],
    ['9', 'Mass stays the same — weight changes with gravity'],
    ['10', 'Any correct pair, e.g. 0.4 kg → 3.92 N'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14,
      valign: 'middle', margin: 0, lineSpacing: 18, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS — 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q6 AND Q7 use the Gold data table — both should land on 9.8, within rounding from reading the graph by eye.\n\n'
    + 'Q9 IS THE CONCEPTUAL ONE. If they can say this without you prompting, the lesson has landed.'
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
    ['Mass and weight are the same thing.', 'FALSE'],
    ['Weight is measured in newtons.', 'TRUE'],
    ['g ≈ 10 N/kg near the Earth’s surface.', 'FALSE'],
    ['A 5 kg mass has a weight of 49 N.', 'TRUE'],
    ['Your mass would change if you went to the Moon.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: '1F2A52' }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
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
  s.addText('Same mass everywhere. Different weight wherever gravity is different.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY — 3 minutes. Six clicks.\n\n'
    + 'Q3 IS THE AVOID POINT, asked directly. If this one is wrong, five minutes of retrieval next lesson before anything new.\n\n'
    + 'Q5 IS THE HONEST TEST of whether "mass vs weight" actually landed, not just the arithmetic. Ask a follow-up: "so what WOULD change?" — weight, because gravity is different.\n\n'
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

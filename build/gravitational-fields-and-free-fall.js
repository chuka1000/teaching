/**
 * Y10 Science — Gravitational fields and free fall (P1.3.4-5, unit proof).
 * DOUBLE, Tuesday: P2, then a REAL 20-minute institutional break (not the
 * 5-minute in-deck pause the other four doubles get — see TIMETABLE.md),
 * then P3. That changes the arithmetic: 100 real minutes of teaching, not
 * 95, and the break needs no on-slide content of its own since the school
 * bell handles it. One deck, one worksheet, but each period runs the full
 * standard archetype rather than splitting one 95-minute flow in half —
 * two real periods, each paced to fill itself properly, is a better fit for
 * a genuine bell-break than a stretched single flow with a gap in it.
 *
 * P2's closing slide is "Recap", not "Plenary" — light background, three
 * quick checks, not the dark five-statement close. That is reserved for the
 * true end of the double, at the end of P3.
 *
 * Follows reference/Mass and Weight.pptx directly: same 'motion' palette,
 * same unit, W = mg and g ≈ 9.8 N/kg carried forward rather than retaught.
 *
 * THEY FOUND HARD: multi-variable equations. Both We Do slides include a
 * row that is specifically a substitution slip (adding instead of
 * multiplying), not just a units or concept error.
 *
 * AVOID: air resistance and terminal velocity are not this section. Every
 * free-fall slide says "ignore air resistance" rather than explaining why.
 *
 * Every numeric answer checked with sympy before it went on a slide or the
 * worksheet.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const { arrow } = require('../lib/shapes');

const DATE = 'Tuesday 22 September 2026';
const LESSON = 'Gravitational Fields and Free Fall';
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
pptx.subject = 'Y10 Physics · General Physics · Gravitational fields and free fall';

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
const title = (slide, text, mode, opts = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: RIGHT - M, h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: opts.fontSize ?? 32, bold: true,
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

/** A mass in a field: the ground, a mass block, downward field lines, one labelled weight arrow. */
function fieldDiagram(slide, o) {
  const { x, y, w, name } = o;
  slide.addShape(S.rect, {
    x, y: y + 1.9, w, h: 0.10,
    fill: { color: C.inkSoft }, line: { color: C.inkSoft, width: 0 }, objectName: `${name}_ground`,
  });
  slide.addText('Earth’s surface', {
    x, y: y + 2.02, w, h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 11.5,
    align: 'center', valign: 'middle', margin: 0, objectName: `${name}_ground_lbl`,
  });
  // field lines either side of the mass, pointing down
  [-1.35, -0.85, 0.85, 1.35].forEach((dx, i) => {
    arrow(pptx, slide, x + w / 2 + dx, y, x + w / 2 + dx, y + 1.75, {
      colour: C.tintDeep, thickness: 0.045, objectName: `${name}_fld${i}`,
    });
  });
  slide.addShape(S.roundRect, {
    x: x + w / 2 - 0.55, y: y + 0.55, w: 1.10, h: 0.62, rectRadius: 0.08,
    fill: { color: 'FFFFFF' }, line: { color: C.dark, width: 1.6 }, objectName: `${name}_mass`,
  });
  slide.addText('mass', {
    x: x + w / 2 - 0.55, y: y + 0.55, w: 1.10, h: 0.62, color: C.dark, fontFace: F.body,
    fontSize: 13, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${name}_mass_t`,
  });
  arrow(pptx, slide, x + w / 2, y + 1.20, x + w / 2, y + 1.85, {
    colour: C.accent, thickness: 0.09, objectName: `${name}_weight`,
  });
  slide.addText('weight (the force)', {
    x: x + w / 2 + 0.20, y: y + 1.35, w: 2.0, h: 0.34, color: C.accentInk, fontFace: F.body,
    fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: `${name}_weight_lbl`,
  });
}

const PHASES_P2 = [];
const PHASES_P3 = [];

/* ==================================================================== *
 * PERIOD 2 — GRAVITATIONAL FIELD STRENGTH
 * ==================================================================== */

/* 1. DO NOW · 10 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');

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
    ['What does W = mg tell you?', 'Weight = mass × g.'],
    ['What is g near the Earth’s surface?', 'About 9.8 N/kg. Not 10.'],
    ['A 5 kg mass. Find its weight.', '5 × 9.8 = 49 N'],
    ['A weight of 78.4 N. Find the mass.', '78.4 ÷ 9.8 = 8 kg'],
    ['What is the unit of mass?', 'kg'],
    ['What is the unit of weight?', 'N'],
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
    'PERIOD 2, DO NOW — 10 minutes. Six clicks.\n\n'
    + 'ALL SIX ARE DIRECT RETRIEVAL from Mass and Weight — same equation, same rounding discipline. Say so: "today builds on this, it does not replace it."\n\n'
    + 'Q4 IS THE REARRANGEMENT they will need again today. If it is shaky, do it on the board before moving on — do not just reveal the answer and continue.\n\n'
    + 'THIS IS A DOUBLE. Tell them now: two periods, real break in the middle, one deck, one worksheet finished at the end of Period 3.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* 2. TODAY · 1 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Learning Objectives', 'light');

  const GOALS = [
    'Describe weight as the effect of a gravitational field on a mass.',
    'Say what g actually measures — the strength of that field.',
    'This afternoon: g is also an acceleration, and why N/kg = m/s².',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}`, fill: i === 2 ? 'F1F2F6' : 'FFFFFF' });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: i === 2 ? C.inkSoft : C.ink, fontFace: F.body,
      fontSize: 15, bold: i !== 2, italic: i === 2, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t`,
    });
  });
  s.addText('A field is a region where a mass feels a force. Weight is that force, on you.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 15.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes('TODAY — 1 minute. Four clicks. Goal 3 is greyed out on purpose — it is this afternoon’s target, said out loud now so the whole double has a shape from the start.');
}

/* 3. HOOK · 2 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('Astronauts on the Moon can jump much higher than on Earth.', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 36, objectName: 'slide_title',
  });
  s.addText('Why?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'They are stronger there.'], ['B', 'Their weight is less. Their mass is not.'], ['C', 'There is no gravity on the Moon.']];
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
    'HOOK — 2 minutes. Four clicks.\n\n'
    + 'ANSWER: B. Their mass on the Moon is identical. The Moon’s field is weaker, so the same mass feels less force — less weight, easier to jump.\n\n'
    + 'C IS A COMMON GUESS, worth taking seriously for a second: the Moon does have gravity, just a weaker field. That is exactly today’s idea.'
  );
}

/* 4. I DO · 3 — weight is a field effect */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Weight is a field effect', 'light');

  fieldDiagram(s, { x: M, y: 3.55, w: 4.6, name: 'fd1' });

  const STEPS = [
    ['1', 'A gravitational field surrounds any mass.', 'Earth has one. So do you — too weak to notice.'],
    ['2', 'Put a second mass in that field...', 'It feels a pull. That pull is a force.'],
    ['3', 'That force is called weight.', 'Not a property of the object alone — it needs the field too.'],
  ];
  const tx = M + 5.30;
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.30;
    card(s, { x: tx, y, w: RIGHT - tx, h: 1.10, name: `fw_${i}` });
    s.addText(n, {
      x: tx + 0.22, y, w: 0.34, h: 1.10, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `fw_${i}_n`,
    });
    s.addText(eq, {
      x: tx + 0.64, y: y + 0.10, w: RIGHT - tx - 0.88, h: 0.50, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `fw_${i}_e`,
    });
    s.addText(note, {
      x: tx + 0.64, y: y + 0.62, w: RIGHT - tx - 0.88, h: 0.42, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `fw_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Four clicks: the diagram, then three steps.\n\n'
    + 'POINT AT THE ARROWS. The field lines are not decoration — they are the reason the mass feels a force at all. No field, no weight, even with the same mass.\n\n'
    + 'THIS REFRAMES WHAT THEY ALREADY KNOW. W = mg is not new. What is new: g is not just "the number for Earth", it is the field’s own strength.'
  );
}

/* 5. I DO · 3 — g is the field strength */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'g is the strength of the field', 'light');

  const STEPS = [
    ['1', 'g = W ÷ m', 'You already know this from Mass and Weight.'],
    ['2', 'g is newtons of force, per kilogram of mass.', 'Not "the number you multiply by" — a property of the field itself.'],
    ['3', 'Near Earth’s surface, g ≈ 9.8 N/kg for every mass.', 'A 1 kg and a 50 kg object feel the same g here.'],
    ['4', 'On the Moon, g ≈ 1.6 N/kg.', 'Weaker field. Same mass, much less weight.'],
  ];
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: M, y, w: RIGHT - M, h: 0.86,
      fill: i === 2 ? 'FFEFE2' : 'FFFFFF', line: i === 2 ? C.accent : 'D8DEEC',
      lineWidth: i === 2 ? 1.7 : 1.3, name: `gf_${i}`,
    });
    s.addText(n, {
      x: M + 0.22, y, w: 0.34, h: 0.86, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `gf_${i}_n`,
    });
    s.addText(eq, {
      x: M + 0.64, y: y + 0.08, w: RIGHT - M - 0.88, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `gf_${i}_e`,
    });
    s.addText(note, {
      x: M + 0.64, y: y + 0.48, w: RIGHT - M - 0.88, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 12.5, valign: 'middle', margin: 0, objectName: `gf_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Four clicks.\n\n'
    + 'STEP 3 IS THE KEY IDEA of Period 2: g does not depend on the mass you put in the field. Double the mass, double the weight, but g itself is unchanged — it belongs to the field, not the object.\n\n'
    + 'STEP 4 (Moon) IS CONTEXT, not something to test them on today — no calculation is asked with it. It exists to make step 3 concrete: same idea, different field, different number.\n\n'
    + 'THIS ANSWERS THE HOOK. Go back to it: same mass on the Moon, weaker field, less weight, easier to jump.'
  );
}

/* 6. WE DO · 5 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"W = m + g, so a 5 kg mass weighs 5 + 9.8 = 14.8."', 'W = m × g = 5 × 9.8 = 49 N'],
    ['g = 10 N/kg', 'g ≈ 9.8 N/kg'],
    ['"My weight is 8 kg."', 'My mass is 8 kg. My weight is 78.4 N.'],
    ['"A bigger mass always has a bigger g."', 'g stays about the same near Earth — only weight changes with mass.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 20, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 7.10, y: y + 0.10, w: RIGHT - (M + 7.10) - 0.10, h: 0.72,
      fill: { color: 'FFEFE2' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS THE SUBSTITUTION SLIP TO WATCH FOR TODAY — adding where they should multiply. This is exactly the "multiple variables" struggle from Mass and Weight. Slow down here, do it on the board.\n\n'
    + 'ROW 2: the 9.8-not-10 rule, again. It will need repeating all double.\n\n'
    + 'ROW 4 IS NEW TODAY: confusing "weight increases with mass" (true) with "g increases with mass" (false). Draw the field diagram again if this splits the room.'
  );
}

/* 7. COLD CALL · 6 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 6, 'light'));
  pill(s, 'Cold Call', 6, 'light');

  const QS = [
    ['What is a gravitational field?', 'A region where a mass feels a force.'],
    ['What does g actually measure?', 'The strength of the field — force per unit mass.'],
    ['A 6 kg mass. Find its weight.', '6 × 9.8 = 58.8 N'],
    ['A weight of 78.4 N. Find the mass.', '78.4 ÷ 9.8 = 8 kg'],
    ['True or false: a bigger mass has a bigger g.', 'False.'],
    ['Complete: W = ___ × ___', 'm × g'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL — 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 AND Q2 want definitions, not units — "N/kg" alone does not answer Q2, push once for "force per unit mass" if that is all you get.\n\n'
    + 'Q3 AND Q4 are deliberately mirror-images of each other — one substitutes, one rearranges. Both need the same equation used two ways.'
  );
}

/* 8. YOU DO · 14 — Bronze + Silver */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');

  s.addImage({
    path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47,
    transparency: 62, objectName: 'gc_logo',
  });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 24, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now. Start with Bronze and Silver.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FFE9E0', 'Substitute', 'Use W = mg. g ≈ 9.8 N/kg, never 10.'],
    ['SILVER', '5A6480', 'F1F2F6', 'Rearrange', 'Find the mass when W is given.'],
    ['GOLD', C.accentInk, 'FFEFE2', 'This afternoon', 'Free fall and the unit proof — after the break.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.00, fill: i === 2 ? 'F1F2F6' : fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, {
      x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body,
      fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(subh, {
      x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 0.90, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, italic: i === 2, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Units every time: kg for mass, N for weight. g ≈ 9.8 N/kg.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO — 14 minutes. Four clicks.\n\n'
    + 'BRONZE AND SILVER ONLY this period — Gold is free-fall content they do not have yet. Say so, so nobody skips ahead confused.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that a substitution or a rearrangement, and which one is this question asking for?"\n\n'
    + 'AT 3 MINUTES REMAINING, stop them. Answers for these two tiers are on the next slide.'
  );
}

/* 9. ANSWERS · 3 — Bronze + Silver only */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 3, 'light'));
  pill(s, 'Answers', 3, 'light');
  title(s, 'Answers — Bronze and Silver', 'light');

  const ANS = [
    ['1', 'W = 0.5 × 9.8 = 4.9 N'],
    ['2', 'W = 12 × 9.8 = 117.6 N'],
    ['3', 'kg for mass, N for weight'],
    ['4', 'm = 19.6 ÷ 9.8 = 2 kg'],
    ['5', 'm = 88.2 ÷ 9.8 = 9 kg'],
    ['6', 'g does not depend on the mass — it is a property of the field, not the object'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, rowH = 0.98, gap = 0.14;
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
    'ANSWERS — 3 minutes. Three clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'ONLY BRONZE AND SILVER (worksheet Q1-6) are here. Gold answers come after the break, at the true end of the worksheet.\n\n'
    + 'Q6 has no number — mark it on reasoning: does it name the field, not the object, as what g belongs to?'
  );
}

/* 10. RECAP · 3 — light, not the final plenary */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P2.push(timer(s, 3, 'light'));
  pill(s, 'Recap', 3, 'light');
  title(s, 'Quick check before the break', 'light');

  const QS = [
    ['What does g actually measure?', 'The strength of a gravitational field.'],
    ['Complete: W = ___', 'm × g'],
    ['True or false: a bigger mass has a bigger g.', 'False — g belongs to the field.'],
  ];
  const rowH = 1.10, gap = 0.22;
  QS.forEach(([q, a], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `rc${i}` });
    s.addText(q, {
      x: M + 0.28, y: y + 0.14, w: RIGHT - M - 0.56, h: 0.42, color: C.ink, fontFace: F.body,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `rc${i}_q`,
    });
    s.addText(a, {
      x: M + 0.28, y: y + 0.58, w: RIGHT - M - 0.56, h: 0.40, color: C.accentInk, fontFace: F.body,
      fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: `rc${i}_a`,
    });
  });
  s.addNotes(
    'RECAP — 3 minutes. Not the lesson’s plenary — that comes at the true end, after Period 3. This is a light checkpoint before a real break.\n\n'
    + 'Three quick answers, out loud, no writing. If any of these three is shaky, say so before they leave — Period 3’s Do Now retrieves all three anyway, but do not let a wrong answer sit uncorrected for 20 minutes.\n\n'
    + 'THEN: real break. Not a slide. Let them go.'
  );
}

/* ==================================================================== *
 * PERIOD 3 — FREE FALL AND THE UNIT EQUIVALENCE
 * ==================================================================== */

/* 11. DO NOW · 10 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');
  s.addText('Welcome back to Period 3', {
    x: 3.60, y: 0.22, w: 6.10, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addShape(S.rect, {
    x: M, y: 0.98, w: RIGHT - M, h: 0.04,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule',
  });

  const QS = [
    ['What does g actually measure?', 'The strength of a gravitational field.'],
    ['g ≈ ___ N/kg near the Earth’s surface.', '9.8'],
    ['Find the weight of a 6 kg mass.', '6 × 9.8 = 58.8 N'],
    ['True or false: a bigger mass has a bigger g.', 'False.'],
    ['What is the unit of weight?', 'N'],
    ['Complete: W = ___', 'm × g'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `e${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `e${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `e${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 1.00, w: cw - 0.44, h: 0.48,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 15, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `e${i}_a`,
    });
  });
  s.addNotes(
    'PERIOD 3, DO NOW. 10 minutes. Six clicks.\n\n'
    + 'ALL SIX RETRIEVE PERIOD 2, on purpose. A real 20-minute break is enough to lose the thread. Do not skip this because "we just did it before break".\n\n'
    + 'IF Q4 (g does not depend on mass) IS SHAKY, reteach it here with the field diagram before starting free fall. Everything this period assumes it landed.'
  );
}

/* 12. TODAY · 1 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Learning Objectives', 'light');

  const GOALS = [
    'Say that g is also the acceleration of free fall.',
    'Show that N/kg and m/s² are the same unit.',
    'Use SUVAT for free fall, ignoring air resistance.',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `p2o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `p2o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `p2o${i}_t`,
    });
  });
  s.addText('9.8 N/kg and 9.8 m/s² are not two coincidences. They are the same fact.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 15.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner2',
  });
  s.addNotes('TODAY. 1 minute. Four clicks. The banner is this afternoon’s whole argument, said up front.');
}

/* 13. HOOK · 2 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('One ball is dropped. A second is thrown sideways from the same height, at the same moment.', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 26,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title',
  });
  s.addText('Which one hits the ground first? (Ignore air resistance.)', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 17,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'The dropped one.'], ['B', 'The thrown one.'], ['C', 'Both, at the same time.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `hk${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `hk${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 0.66, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `hk${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'ANSWER: C. Both feel the same downward acceleration g, regardless of any sideways motion. This is the Galileo result, and it only holds because we are ignoring air resistance. Say that explicitly.\n\n'
    + 'DO NOT GET DRAWN INTO A DISCUSSION OF AIR RESISTANCE. "That is a real effect, and it is a different topic" is the whole answer if it comes up.'
  );
}

/* 14. I DO · 3 — g as acceleration */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'g is also an acceleration', 'light');

  const STEPS = [
    ['1', 'Drop something. Ignore air resistance.', 'It speeds up as it falls. That is acceleration.'],
    ['2', 'That acceleration is g ≈ 9.8 m/s².', 'The same number as the field strength.'],
    ['3', 'This works for ANY falling object.', 'A pebble and a brick fall at the same rate.'],
  ];
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.40 + i * 1.30;
    card(s, {
      x: M, y, w: RIGHT - M, h: 1.10,
      fill: i === 1 ? 'FFEFE2' : 'FFFFFF', line: i === 1 ? C.accent : 'D8DEEC',
      lineWidth: i === 1 ? 1.7 : 1.3, name: `ff_${i}`,
    });
    s.addText(n, {
      x: M + 0.22, y, w: 0.34, h: 1.10, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `ff_${i}_n`,
    });
    s.addText(eq, {
      x: M + 0.64, y: y + 0.10, w: RIGHT - M - 0.88, h: 0.50, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `ff_${i}_e`,
    });
    s.addText(note, {
      x: M + 0.64, y: y + 0.62, w: RIGHT - M - 0.88, h: 0.42, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `ff_${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks.\n\n'
    + '"IGNORE AIR RESISTANCE" goes on the board, said out loud, every single time free fall comes up today. It is not a throwaway phrase. It is the condition that makes step 3 true.\n\n'
    + 'STEP 3 ANSWERS THE HOOK properly: same g for both balls, so same vertical acceleration, so same time to fall, whatever the sideways speed.'
  );
}

/* 15. I DO · 3 — the unit proof */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Why N/kg = m/s²', 'light');

  const STEPS = [
    ['1', 'F = ma', 'Force = mass × acceleration.'],
    ['2', 'So N = kg × m/s²', 'A newton, written out in base units.'],
    ['3', 'Divide both sides by kg:', 'N ÷ kg = m/s²'],
    ['4', 'g ≈ 9.8 N/kg = 9.8 m/s²', 'Same number. Same fact. Two units for it.'],
  ];
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: M, y, w: RIGHT - M, h: 0.86,
      fill: i === 3 ? 'FFEFE2' : 'FFFFFF', line: i === 3 ? C.accent : 'D8DEEC',
      lineWidth: i === 3 ? 1.7 : 1.3, name: `up_${i}`,
    });
    s.addText(n, {
      x: M + 0.22, y, w: 0.34, h: 0.86, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `up_${i}_n`,
    });
    s.addText(eq, {
      x: M + 0.64, y: y + 0.08, w: RIGHT - M - 0.88, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `up_${i}_e`,
    });
    s.addText(note, {
      x: M + 0.64, y: y + 0.48, w: RIGHT - M - 0.88, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 12.5, valign: 'middle', margin: 0, objectName: `up_${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks.\n\n'
    + 'THIS IS THE PROOF FOR OBJECTIVE 3. Write it on the board alongside the slide. The algebra is short enough that copying it themselves matters more than watching it appear.\n\n'
    + 'STEP 1 IS FROM AN EARLIER TOPIC (forces). If F = ma has not landed yet, this whole proof will not either. Check before going further.\n\n'
    + 'THE PAYOFF: g can be written either way, and neither is "more correct". N/kg when talking about a field, m/s² when talking about an acceleration.'
  );
}

/* 16. WE DO · 5 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"N/kg and m/s² are different units for different things."', 'They are the same unit. g can be written either way.'],
    ['"v = u + at, so v = 0 + 9.8 + 3 = 12.8."', 'v = 0 + 9.8 × 3 = 29.4 m/s'],
    ['"A heavier object falls faster (ignoring air resistance)."', 'They fall at the same rate. g does not depend on mass.'],
    ['g = 9.8 kg/N', 'g ≈ 9.8 N/kg, or equivalently 9.8 m/s²'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `we${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14.5,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `we${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 7.10, y: y + 0.10, w: RIGHT - (M + 7.10) - 0.10, h: 0.72,
      fill: { color: 'FFEFE2' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `we${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 2 IS TODAY’S SUBSTITUTION SLIP: the same "added instead of multiplied" mistake as Period 2’s We Do, now inside SUVAT instead of W = mg. Name the pattern: "this is the same kind of mistake as this morning, just in a new equation."\n\n'
    + 'ROW 3 EXTENDS PERIOD 2’S IDEA (g does not depend on mass) into motion: it is the reason free-fall time does not depend on mass either.\n\n'
    + 'ROW 4 IS A UNITS-ORDER SLIP, not a new idea. Quick to fix, worth catching.'
  );
}

/* 17. COLD CALL · 6 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 6, 'light'));
  pill(s, 'Cold Call', 6, 'light');

  const QS = [
    ['What is g equivalent to, in terms of motion?', 'The acceleration of free fall.'],
    ['In one sentence, why does N/kg = m/s²?', 'Because N = kg × m/s², from F = ma.'],
    ['Find the speed of an object dropped from rest after falling for 1 s.', 'v = 9.8 × 1 = 9.8 m/s'],
    ['Find how far the same object has fallen in that time.', 's = ½ × 9.8 × 1² = 4.9 m'],
    ['Why do we say "ignore air resistance"?', 'So every object falls with the same g. Otherwise it is a different, harder problem.'],
    ['Complete: g ≈ 9.8 ___ or 9.8 ___', 'N/kg or m/s²'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `cc${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `cc${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 14.5, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `cc${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'FFEFE2' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 13, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `cc${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q3 AND Q4 ARE THE FIRST TIMED SUVAT-STYLE CALCULATIONS today. Both use u = 0, so the substitution is as simple as it gets. Save the harder versions for the worksheet.\n\n'
    + 'Q5 CHECKS UNDERSTANDING, not just the phrase. Accept anything that says real objects would fall differently without it.'
  );
}

/* 18. YOU DO · 14 — Gold */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');

  s.addImage({
    path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47,
    transparency: 62, objectName: 'gc_logo2',
  });
  s.addText('Finish the worksheet: Gold', {
    x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 28, bold: true, valign: 'middle', margin: 0, lineSpacing: 34, objectName: 'slide_title2',
  });
  s.addText('Same worksheet as this morning. Same Google Classroom.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub2',
  });

  const STEPS = [
    ['7', 'Free fall, one variable.', 'Find v or s from u, a = g and t.'],
    ['8', 'Free fall, two steps.', 'Find v first, then use it, or the reverse.'],
    ['9', 'Show N/kg = m/s² yourself.', 'In your own words, starting from F = ma.'],
    ['10', 'Explain why g does not depend on mass.', 'One or two sentences. Use the field idea.'],
  ];
  const cw = (RIGHT - M - 3 * 0.20) / 4;
  STEPS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + 0.20);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 2.30, name: `gd${i}`, fill: 'FFEFE2', line: C.accentInk, lineWidth: 1.4 });
    s.addText(n, {
      x: x + 0.18, y: BODY_Y + 0.44, w: 0.5, h: 0.46, color: C.accentInk, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `gd${i}_n`,
    });
    s.addText(head, {
      x: x + 0.18, y: BODY_Y + 0.96, w: cw - 0.36, h: 0.60, color: C.dark, fontFace: F.body,
      fontSize: 13.5, bold: true, valign: 'top', margin: 0, lineSpacing: 17, objectName: `gd${i}_h`,
    });
    s.addText(body, {
      x: x + 0.18, y: BODY_Y + 1.56, w: cw - 0.36, h: 0.94, color: C.inkSoft, fontFace: F.body,
      fontSize: 12, valign: 'top', margin: 0, lineSpacing: 16, objectName: `gd${i}_b`,
    });
  });
  s.addText('Ignore air resistance in every question. g ≈ 9.8 N/kg = 9.8 m/s².', {
    x: M, y: BODY_Y + 2.90, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note2',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'GOLD ONLY. They should already have Bronze and Silver done from Period 2. Anyone who does not, give them the first five minutes to finish those instead; Gold can wait.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that a substitution or a two-step problem?" Same framing as Period 2, new content.\n\n'
    + 'AT 3 MINUTES REMAINING, stop them. Full answers, Bronze through Gold, are on the next slide.'
  );
}

/* 19. ANSWERS · 3 — Gold */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES_P3.push(timer(s, 3, 'light'));
  pill(s, 'Answers', 3, 'light');
  title(s, 'Answers: Gold', 'light');

  const ANS = [
    ['7', 'v = 9.8 × 3 = 29.4 m/s'],
    ['8', 's = ½ × 9.8 × 3² = 44.1 m'],
    ['9', 'F = ma → N = kg·m/s² → N ÷ kg = m/s²'],
    ['10', 'g belongs to the field, not the object. The field’s strength is the same for every mass placed in it.'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, rowH = 1.10, gap = 0.16;
  ANS.forEach(([n, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 2.00 + row * (rowH + gap);
    card(s, { x, y, w: cw, h: rowH, name: `ga${i}` });
    s.addText(n, {
      x: x + 0.24, y, w: 0.50, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `ga${i}_n`,
    });
    s.addText(a, {
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14,
      valign: 'middle', margin: 0, lineSpacing: 18, objectName: `ga${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Two clicks. They mark their own in a different colour. This is the second and final Answers slide, covering Q7-10.\n\n'
    + 'Q8 ASSUMES Q7’S v IS NOT NEEDED. s uses u, a, t directly. If someone used v to find s, the answer can still be right; the method just took a longer route.\n\n'
    + 'Q9 AND Q10 have no single wording. Mark on whether the physics is right, not whether it matches this card.'
  );
}

/* 20. PLENARY · 3 — the true close of the double */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES_P3.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');

  const QS = [
    ['Weight is the effect of a gravitational field on a mass.', 'TRUE'],
    ['g is bigger for a bigger mass.', 'FALSE'],
    ['N/kg and m/s² are different units.', 'FALSE'],
    ['In free fall, all objects accelerate at the same rate (ignoring air resistance).', 'TRUE'],
    ['A ball thrown sideways takes longer to fall than one just dropped, from the same height.', 'FALSE'],
  ];
  const rowH = 0.68, gap = 0.16;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: '1F2A52' }, line: { color: C.darkSoft, width: 1 }, objectName: `pl${i}_bg`,
    });
    s.addText(q, {
      x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body,
      fontSize: 14.5, valign: 'middle', margin: 0, objectName: `pl${i}_q`,
    });
    s.addText(v, {
      x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent,
      fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle',
      margin: 0, objectName: `pl${i}_v`,
    });
  });
  s.addText('One field. One g. Two units for the same fact: N/kg and m/s².', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next2',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks. This is the true close of the double, not Period 2’s Recap.\n\n'
    + 'Q2 AND Q3 ARE THE TWO IDEAS THE WHOLE DOUBLE WAS BUILT AROUND. If either is wrong, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q5 CHECKS THE HOOK LANDED PROPERLY, not just the vocabulary. "At the same time" is the only fully correct answer; "FALSE" alone without knowing why is not enough.\n\n'
    + 'The closing line is the whole double in one sentence.'
  );
}

const totalP2 = PHASES_P2.reduce((a, b) => a + b, 0);
const totalP3 = PHASES_P3.reduce((a, b) => a + b, 0);
const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('Period 2 phase minutes:', PHASES_P2.join(', '), '=', totalP2, 'min');
  console.log('Period 3 phase minutes:', PHASES_P3.join(', '), '=', totalP3, 'min');
  console.log('TOTAL (real break, not counted):', totalP2 + totalP3, 'min — two full 50-minute periods, not the usual 95');
});

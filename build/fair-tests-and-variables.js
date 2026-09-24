/**
 * Y7 Science — Scientific Research and Technology, Lesson 2.
 * Single, 50 minutes. Standard archetype.
 *
 * Follows reference/How Scientists Investigate.pptx. Two things worth
 * knowing before touching this file:
 *
 * 1. The DEPLOYED deck has no Cold Call slide — Chuka cut it when teaching,
 *    bringing the real runtime to 44 minutes, not 50. The build script still
 *    has one, and that cut Cold Call is exactly where "independent variable"
 *    and "dependent variable" were originally going to be introduced. They
 *    were not, in class.
 * 2. The WORKSHEET still asked for them anyway (Silver Q6-7: "the
 *    independent variable — the thing you change" / "the dependent
 *    variable — the thing you measure"), and the class answered them
 *    correctly for the one worked example (sunlight -> plant height). So the
 *    terms were seen once, in print, with a plain-English gloss attached and
 *    a successful concrete example — but never taught, drilled or discussed.
 *    That gap, not the vocabulary itself, is THEY FOUND HARD for this build:
 *    turning a vague idea into something testable and measurable (Silver/
 *    Gold stalled on this last time) is the real skill; naming what you
 *    change and what you measure is the tool that makes it possible. This
 *    lesson properly teaches manipulated/responding, and adds the third kind
 *    (controlled variables) that was never named at all, only gestured at
 *    via "change one variable at a time".
 *
 * Retrieval reuses the class's own correct worksheet answer (sunlight ->
 * plant height) rather than a new example, so Do Now opens on something they
 * already got right.
 *
 * PRACTICAL, per the brief: a design task, not a real practical — name the
 * three kinds of variable for a paper aeroplane question before anyone
 * builds anything. No aeroplanes are actually thrown this lesson.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const { arrow } = require('../lib/shapes');

const DATE = 'Friday 25 September 2026';
const LESSON = 'Fair Tests and Variables';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_signal_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y7 Science · Scientific Research and Technology · Lesson 2';

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
    x: 3.60, y: 0.22, w: 6.20, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 24,
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
    ['State what a hypothesis is.', 'A prediction you can test.'],
    ['State the rule for a fair test.', 'Change one thing at a time.'],
    ['In "plants grow taller with more sunlight", name the thing being changed.', 'The amount of sunlight.'],
    ['In "plants grow taller with more sunlight", name the thing being measured.', 'Plant height.'],
    ['State why scientists repeat a test.', 'To check the result is not a fluke.'],
    ['Complete: if [I change this], then [this ___].', 'happens'],
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
      fill: { color: 'FDF3DC' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'Q3 AND Q4 ARE THE CLASS\'S OWN WORKSHEET ANSWER, read back to them. They got this right last lesson without the formal terms. Say that: "you could already do this, today you get the words for it."\n\n'
    + 'Q1, Q2, Q5 AND Q6 are straight retrieval from How Scientists Investigate. None of it is new.\n\n'
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
    'Identify the manipulated (independent) variable, the one you change.',
    'Identify the responding (dependent) variable, the one you measure.',
    'Explain why controlled variables and repeating a test make it fair.',
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
  s.addText('One thing changes. One thing is measured. Everything else stays the same.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE BANNER IS THE WHOLE LESSON. Three clauses, three objectives, in order. Point at each clause as you name the matching objective.'
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
  s.addImage({ path: ICON('paperplane', 'accentInk'), x: RIGHT - 0.85, y: 0.86, w: 0.60, h: 0.60, objectName: 'hook_icon' });
  s.addText('Does a paper aeroplane fly further if it is heavier?', {
    x: M, y: 0.86, w: RIGHT - M - 1.00, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 30,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 37, objectName: 'slide_title',
  });
  s.addText('What would you need to do to find out?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'Heavier flies further.'], ['B', 'Lighter flies further.'], ['C', 'You cannot tell without testing it.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.32, w: cw - 0.56, h: 0.70, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board. There will be a real split between A and B: that is the point, not a problem to fix.\n\n'
    + 'ANSWER: C. This is a genuinely open question, real aeroplanes get more complicated (too heavy and it just drops), which is exactly why it needs a fair test rather than a guess.\n\n'
    + 'DO NOT SETTLE THE ARGUMENT. Say "let\'s find out how you would actually test this" and move to I Do. The paper aeroplane question carries through to You Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — manipulated and responding
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Two variables, every fair test', 'light');

  const ROWS = [
    {
      name: 'MANIPULATED (INDEPENDENT)', icon: 'sun', def: 'The one YOU choose to change.',
      example: 'Amount of sunlight',
    },
    {
      name: 'RESPONDING (DEPENDENT)', icon: 'ruler', def: 'The one that changes because of it, and that you measure.',
      example: 'Plant height',
    },
  ];
  ROWS.forEach((r, i) => {
    const y = BODY_Y + 0.20 + i * 1.55;
    card(s, { x: M, y, w: RIGHT - M, h: 1.35, fill: i === 1 ? 'FDF3DC' : 'FFFFFF', line: i === 1 ? C.accent : 'D8DEEC', name: `mv${i}` });
    s.addImage({ path: ICON(r.icon, 'accentInk'), x: M + 0.22, y: y + 0.20, w: 0.48, h: 0.48, objectName: `mv${i}_icon` });
    s.addText(r.name, {
      x: M + 0.86, y: y + 0.14, w: 3.6, h: 0.50, color: C.dark, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `mv${i}_n`,
    });
    s.addText(r.def, {
      x: M + 0.86, y: y + 0.62, w: RIGHT - M - 0.86 - 2.60, h: 0.60, color: C.ink, fontFace: F.body, fontSize: 14.5,
      valign: 'middle', margin: 0, lineSpacing: 18, objectName: `mv${i}_d`,
    });
    s.addText(r.example, {
      shape: S.roundRect, rectRadius: 0.08,
      x: RIGHT - 2.60, y: y + 0.44, w: 2.40, h: 0.46, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
      color: 'FFFFFF', fontFace: F.body, fontSize: 13.5, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `mv${i}_e`,
    });
  });
  arrow(pptx, s, W / 2, BODY_Y + 1.62, W / 2, BODY_Y + 1.75, { colour: C.accentInk, thickness: 0.14, objectName: 'mv_arrow' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: row 1, the arrow, row 2.\n\n'
    + 'THE ARROW MATTERS: manipulated causes a change in responding, not the other way round. Say it in that order every time: "I change this, so this responds."\n\n'
    + 'THE EXAMPLE CHIPS ARE THE CLASS\'S OWN WORKSHEET ANSWER FROM LAST LESSON. Point that out again here, it is worth repeating.\n\n'
    + '"INDEPENDENT" AND "DEPENDENT" ARE THE EXAM WORDS. "Manipulated" and "responding" are the plain-English ones. Use both together every time today so neither feels like the "real" one.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — controlled variables and replication
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Keep everything else the same. Then do it again.', 'light');

  const cw = (RIGHT - M - 0.30) / 2, colY = BODY_Y + 0.20, colH = 2.65;
  card(s, { x: M, y: colY, w: cw, h: colH, name: 'ctrl' });
  s.addImage({ path: ICON('paperplane', 'accentInk'), x: M + 0.24, y: colY + 0.20, w: 0.42, h: 0.42, objectName: 'ctrl_icon' });
  s.addText('CONTROLLED VARIABLES', {
    x: M + 0.80, y: colY + 0.22, w: cw - 1.00, h: 0.40, color: C.dark, fontFace: F.title,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'ctrl_h',
  });
  s.addText('Kept exactly the same, so they cannot be the reason for the result.', {
    x: M + 0.24, y: colY + 0.76, w: cw - 0.48, h: 0.56, color: C.ink, fontFace: F.body, fontSize: 14,
    valign: 'top', margin: 0, lineSpacing: 18, objectName: 'ctrl_def',
  });
  s.addText(
    'For the paper aeroplane:\n•  Same paper\n•  Same fold\n•  Same thrower\n•  Same launch height',
    {
      x: M + 0.24, y: colY + 1.36, w: cw - 0.48, h: 1.20, color: C.inkSoft, fontFace: F.body, fontSize: 13.5,
      valign: 'top', margin: 0, lineSpacing: 20, objectName: 'ctrl_list',
    },
  );

  const rx = M + cw + 0.30;
  card(s, { x: rx, y: colY, w: cw, h: colH, name: 'rep' });
  s.addImage({ path: ICON('repeat', 'accentInk'), x: rx + 0.24, y: colY + 0.20, w: 0.42, h: 0.42, objectName: 'rep_icon' });
  s.addText('REPLICATION', {
    x: rx + 0.80, y: colY + 0.22, w: cw - 1.00, h: 0.40, color: C.dark, fontFace: F.title,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'rep_h',
  });
  s.addText('Repeat the test and take an average, so one strange result does not fool you.', {
    x: rx + 0.24, y: colY + 0.76, w: cw - 0.48, h: 0.80, color: C.ink, fontFace: F.body, fontSize: 14,
    valign: 'top', margin: 0, lineSpacing: 18, objectName: 'rep_def',
  });
  s.addText('Throw the same aeroplane three times. If two throws land near each other and one lands far off, that one throw is the fluke, not the pattern.', {
    x: rx + 0.24, y: colY + 1.66, w: cw - 0.48, h: 0.90, color: C.inkSoft, fontFace: F.body, fontSize: 13.5,
    valign: 'top', margin: 0, lineSpacing: 18, objectName: 'rep_note',
  });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: controlled, then replication.\n\n'
    + 'CONTROLLED VARIABLES ARE THE EASIEST TO FORGET because nothing happens to them. Ask: "what would happen if a different person threw it each time?" to make the point live.\n\n'
    + 'REPLICATION CONNECTS STRAIGHT BACK TO THE DO NOW: "why do scientists repeat a test" was already a retrieval question. This is the same idea with a reason attached.\n\n'
    + 'BOTH IDEAS SERVE THE SAME GOAL: making sure the responding variable changed because of the manipulated variable, and nothing else.'
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
    ['"In the plant test, the responding variable is the amount of sunlight."', 'Sunlight is manipulated. Plant height is the responding variable.'],
    ['"For the aeroplane test, I will use a different thrower each time to save time."', 'The thrower should be controlled: the same person, every time.'],
    ['"I only need to throw the plane once."', 'Repeat the test and take an average.'],
    ['"Controlled variables are the ones I want to find out."', 'Controlled variables are kept the same. The thing you want to find out is the responding variable.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14.5,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 7.10, y: y + 0.10, w: RIGHT - (M + 7.10) - 0.10, h: 0.72,
      fill: { color: 'FDF3DC' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 13, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS THE SAME PAIR AS I DO 1, DELIBERATELY FLIPPED. If this trips people up, that is worth noticing, not skipping past.\n\n'
    + 'ROW 3 IS THE MISCONCEPTION THIS WHOLE LESSON IS BUILT AROUND, alongside row 4. Spend the extra few seconds on both.\n\n'
    + 'ROW 4 IS THE ONE MOST LIKELY TO GO WRONG. "Controlled" sounds like it should mean "the thing I am controlling for the result", which is backwards. Say the correct version twice.'
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
    ['What do you call the thing you choose to change?', 'The manipulated (independent) variable.'],
    ['What do you call the thing you measure?', 'The responding (dependent) variable.'],
    ['What do you call a variable that is kept the same?', 'A controlled variable.'],
    ['For "does more sugar make ice melt faster", name the manipulated variable.', 'The amount of sugar.'],
    ['For the same test, name the responding variable.', 'How fast the ice melts.'],
    ['State one reason to repeat a test.', 'To check the result was not a fluke.'],
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
      fill: { color: 'FDF3DC' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1-3 ARE THE VOCABULARY THIS LESSON EXISTS TO TEACH. This is the drilling that got cut from How Scientists Investigate. Do not rush it.\n\n'
    + 'Q4 AND Q5 ARE A FRESH EXAMPLE, not the plant or the aeroplane. If both of those are secure, a new context is the real test.\n\n'
    + 'Q6 is retrieval, should be fast.'
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
    fontSize: 27, bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FDEAE8', 'Name it', 'Name the manipulated and responding variable for the aeroplane question.'],
    ['SILVER', '5A6480', 'F1F2F6', 'Control it', 'List three variables you must control to make it a fair test.'],
    ['GOLD', C.accentInk, 'FDF3DC', 'Design it', 'Write the hypothesis and explain why you would repeat each throw.'],
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
  s.addText('Remember the shape: if [I change this], then [this happens], because [reason].', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'THIS IS A DESIGN TASK. No aeroplanes get built or thrown today, per the brief, only named and planned.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which one are you changing, and which one are you measuring?"\n\n'
    + 'WHERE THEY WILL STALL: Silver (naming three controlled variables, not just one) and Gold\'s "because" clause, giving a reason rather than just a prediction.\n\n'
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
    ['1', 'The weight of the paper aeroplane.'],
    ['2', 'The distance the aeroplane flies.'],
    ['3', 'Kept the same.'],
    ['4', 'To check the result is not a fluke, and to get a reliable average.'],
    ['5', 'Any three: same paper, same fold, same thrower, same launch height, no wind.'],
    ['6', 'So the throw itself is not the reason for any difference in distance.'],
    ['7', 'Manipulated: amount of sugar. Responding: how fast the ice melts.'],
    ['8', 'Accept any "if...then...because" hypothesis linking weight and distance.'],
    ['9', 'Repeat several times and take an average, so one unusual throw does not fool you.'],
    ['10', 'Answers vary. Must name a manipulated, a responding, and a controlled variable.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 12.5,
      valign: 'middle', margin: 0, lineSpacing: 16, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q8, Q9 AND Q10 have no single right answer. Take two or three out loud for each rather than reading a model answer.\n\n'
    + 'Q10 IS THE REAL TEST OF THE LESSON. Anyone who can name all three variables for their own chosen question, correctly, has understood today. If it is shaky, that is five minutes at the start of next lesson.'
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
    ['The manipulated variable is the one you measure.', 'FALSE'],
    ['The responding variable changes because of the manipulated variable.', 'TRUE'],
    ['A controlled variable is one you keep the same.', 'TRUE'],
    ['You only need to test something once to trust the result.', 'FALSE'],
    ['"How heavy the paper aeroplane is" could be a manipulated variable.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: '1E4A6B' }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
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
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q1 AND Q2 CHECK THE PAIR IS NOT REVERSED, the single most likely slip today.\n\n'
    + 'Q5 IS THE OPEN-ENDED ONE: any example of a manipulated variable is correct, this one just closes the loop on the Hook question.\n\n'
    + 'The closing line is the whole lesson, in order.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

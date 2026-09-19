/**
 * Y10 Motion: the equations of motion.
 *
 * Both equations are DERIVED from the velocity-time graph taught last lesson:
 * the gradient gives v = u + at, the area gives s = (u+v)t/2. That bridge is
 * the whole point, so the two I Do slides each show the graph beside it.
 *
 * Standard archetype: Do Now 10 · Today 1 · Hook 2 · I Do 3 · I Do 3 ·
 * We Do 5 · Cold Call 6 · You Do 14 · Answers 3 · Plenary 3 = 50.
 * Timer bars are videos so they run independently of the click sequence;
 * run lib/autoplay-media.js after lib/animate.js.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('./lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;

const DATE = 'Friday 18 September 2026';
const LESSON = 'Equations of Motion';
const GC_LOGO = path.join(__dirname, 'img_y9pop', 'classroom.png');

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y10 Physics · Motion · equations of motion';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

const bg = (slide, mode) => { slide.background = { color: mode === 'dark' ? C.dark : C.tint }; };

const COVER = {};
function coverDataUri(theme) {
  if (!COVER[theme]) {
    const b = fs.readFileSync(path.join(__dirname, 'timer_media', `cover_${theme}.png`));
    COVER[theme] = `image/png;base64,${b.toString('base64')}`;
  }
  return COVER[theme];
}
function timer(slide, minutes, mode) {
  const theme = mode === 'dark' ? 'motiondark' : 'motionlight';
  slide.addMedia({
    type: 'video',
    path: path.join(__dirname, 'timer_media', `timer_${theme}_${minutes}.mp4`),
    cover: coverDataUri(theme),
    x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H,
    objectName: 'timer_video',
  });
  return minutes;
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
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: 36, bold: true,
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

/**
 * A motion graph drawn from native shapes.
 * `pts` are fractions of the plot area, origin bottom-left, joined in order.
 */
function graph(slide, o) {
  const { x, y, w, h, name } = o;           // y is the BOTTOM of the plot area
  slide.addShape(S.rect, {
    x, y: y - h, w, h, fill: { color: 'FFFFFF' },
    line: { color: 'D8DEEC', width: 1.2 }, objectName: `${name}_panel`,
  });
  if (o.grid !== false) {
    for (let i = 1; i < 4; i++) {
      slide.addShape(S.line, {
        x, y: y - (i / 4) * h, w, h: 0,
        line: { color: 'EDF0F7', width: 1 }, objectName: `${name}_g${i}`,
      });
    }
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
    ['What does the gradient of a velocity\u2013time graph give you?', 'The acceleration.'],
    ['What does the area under a velocity\u2013time graph give you?', 'The displacement.'],
    ['In these equations, what does u stand for?', 'The starting velocity.'],
    ['What is the area of a trapezium?', '\u00BD (a + b) \u00D7 h'],
    ['A car goes from 4 to 20 m s\u207B\u00B9 in 4.0 s. Find a.', '4 m s\u207B\u00B2'],
    ['The same car. How far did it travel in those 4 s?', '48 m'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `d${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: `d${i}_q`,
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
    + 'Q1 to Q4 are the raw materials for today. Both equations come out of a gradient and an area, and Q4 is the shape of the area.\n\n'
    + 'Q4 SURPRISES THEM in a physics lesson. Tell them that is the point \u2014 they are about to build a physics equation out of a Year 8 area formula.\n\n'
    + 'Q5 AND Q6 are the same car. They can already do both without either equation, using last lesson\u2019s graph rules. Say so when you mark them.\n\n'
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
    'Get  v = u + at  from the gradient of a graph.',
    'Get  s = \u00BD(u + v)t  from the area under it.',
    'Choose the right equation and use it.',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 17, bold: true, valign: 'top', margin: 0, lineSpacing: 22, objectName: `o${i}_t`,
    });
  });
  s.addText('You are not being given these equations. You are going to build them.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes('TODAY — 1 minute. Four clicks. The banner matters: these are not formulae to memorise, they are last lesson\u2019s graph rules written as algebra.');
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('A train speeds up from 10 to 30 m s\u207B\u00B9 in 20 s.', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 32,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 40, objectName: 'slide_title',
  });
  s.addText('How far does it travel?', {
    x: M, y: 1.98, w: RIGHT - M, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', '600 m'], ['B', '400 m'], ['C', '200 m']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.40, w: cw - 0.56, h: 0.60, color: C.dark, fontFace: F.title,
      fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK — 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board.\n\n'
    + 'ANSWER: B, 400 m. Do not reveal it here \u2014 slide 5 gets it from the area.\n\n'
    + 'A IS 30 \u00D7 20: they used the final velocity for the whole journey. It was only going that fast at the very end.\n\n'
    + 'C IS 10 \u00D7 20: the starting velocity for the whole journey. Too slow.\n\n'
    + 'THE ANSWER IS BETWEEN THEM, and that is worth saying before you move on. The average of 10 and 30 is 20, and 20 \u00D7 20 = 400.'
  );
}

/* ================================================================== *
 * 4. I DO · 3  —  v = u + at
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The gradient gives you the first equation', 'light');

  graph(s, {
    x: M + 0.20, y: 5.70, w: 4.60, h: 2.60, name: 'g1',
    pts: [[0, 0.25], [1, 0.85]], ylab: 'v / m s\u207B\u00B9', xlab: 't / s', colour: C.support,
  });
  s.addText('u', {
    x: M - 0.16, y: 5.70 - 0.25 * 2.60 - 0.17, w: 0.34, h: 0.34, color: C.accent,
    fontFace: F.title, fontSize: 17, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'g1_u',
  });
  s.addText('v', {
    x: M - 0.16, y: 5.70 - 0.85 * 2.60 - 0.17, w: 0.34, h: 0.34, color: C.accent,
    fontFace: F.title, fontSize: 17, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'g1_v',
  });

  const STEPS = [
    ['1', 'gradient  =  acceleration', 'That was last lesson.'],
    ['2', 'gradient  =  (v \u2212 u) \u00F7 t', 'Rise over run, from u up to v.'],
    ['3', 'a  =  (v \u2212 u) \u00F7 t', 'So put the two together.'],
    ['4', 'v  =  u + at', 'Rearranged. That is the first equation.'],
  ];
  const tx = M + 5.30;
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: tx, y, w: RIGHT - tx, h: 0.86,
      fill: i === 3 ? 'FFEFE2' : 'FFFFFF', line: i === 3 ? C.accent : 'D8DEEC',
      lineWidth: i === 3 ? 1.7 : 1.3, name: `e1_${i}`,
    });
    s.addText(n, {
      x: tx + 0.22, y, w: 0.34, h: 0.86, color: C.accent, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `e1_${i}_n`,
    });
    s.addText(eq, {
      x: tx + 0.64, y: y + 0.08, w: RIGHT - tx - 0.88, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `e1_${i}_e`,
    });
    s.addText(note, {
      x: tx + 0.64, y: y + 0.48, w: RIGHT - tx - 0.88, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `e1_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Six clicks: the graph with u and v marked, then the four steps.\n\n'
    + 'THEY ALREADY KNOW STEP 1. Say so. All you are doing is writing it in symbols.\n\n'
    + 'STEP 2: the rise is from u up to v, so the rise is v \u2212 u. The run is t. Point at the graph.\n\n'
    + 'STEP 4 is one rearrangement: multiply both sides by t, then add u. Do it on the board, do not just show it.\n\n'
    + 'CHECK IT AGAINST DO NOW Q5: u = 4, a = 4, t = 4 gives v = 4 + 16 = 20. Which is what the question said.'
  );
}

/* ================================================================== *
 * 5. I DO · 3  —  s = ½(u+v)t
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The area gives you the second', 'light');

  graph(s, {
    x: M + 0.20, y: 5.70, w: 4.60, h: 2.60, name: 'g2',
    pts: [[0, 0.25], [1, 0.85]], ylab: 'v / m s\u207B\u00B9', xlab: 't / s', colour: C.support,
  });
  s.addText('This shape is a trapezium.', {
    x: M + 0.20, y: 5.86, w: 4.60, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 14,
    italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'g2_note',
  });

  const STEPS = [
    ['1', 'area  =  displacement', 'Also last lesson.'],
    ['2', 'area of a trapezium  =  \u00BD(a + b) \u00D7 h', 'The two parallel sides are u and v.'],
    ['3', 's  =  \u00BD(u + v) \u00D7 t', 'The height of the trapezium is the time.'],
    ['4', 'So the train travels  \u00BD(10 + 30) \u00D7 20  =  400 m', 'The hook, answered.'],
  ];
  const tx = M + 5.30;
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: tx, y, w: RIGHT - tx, h: 0.86,
      fill: i === 3 ? 'FFEFE2' : 'FFFFFF', line: i === 3 ? C.accent : 'D8DEEC',
      lineWidth: i === 3 ? 1.7 : 1.3, name: `e2_${i}`,
    });
    s.addText(n, {
      x: tx + 0.22, y, w: 0.34, h: 0.86, color: C.accent, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `e2_${i}_n`,
    });
    s.addText(eq, {
      x: tx + 0.64, y: y + 0.08, w: RIGHT - tx - 0.88, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: i === 3 ? 16 : 18, bold: true, valign: 'middle', margin: 0, objectName: `e2_${i}_e`,
    });
    s.addText(note, {
      x: tx + 0.64, y: y + 0.48, w: RIGHT - tx - 0.88, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `e2_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Six clicks.\n\n'
    + 'THE PARALLEL SIDES ARE u AND v. Turn the graph on its side in the air if it helps \u2014 the trapezium is lying down.\n\n'
    + 'STEP 4 SETTLES THE HOOK. Go back to the tally. \u00BD(10 + 30) is 20, the average velocity, and 20 \u00D7 20 = 400 m.\n\n'
    + 'THE USEFUL SENTENCE: this equation is just "average velocity \u00D7 time". If they remember nothing else, that gets them there.\n\n'
    + 'CHECK AGAINST DO NOW Q6: \u00BD(4 + 20) \u00D7 4 = 48 m. Same answer they got from the graph.'
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
  sub(s, 'Spot the mistake. The train goes from 10 to 30 m s\u207B\u00B9 in 20 s.', 'light');

  const ROWS = [
    ['s = 30 \u00D7 20 = 600 m', '400 m'],
    ['a = 30 \u00F7 20 = 1.5 m s\u207B\u00B2', '1.0 m s\u207B\u00B2'],
    ['u is always 0, so s = \u00BD \u00D7 30 \u00D7 20 = 300 m', 'u is 10 here'],
    ['A negative acceleration means a negative displacement.', 'It can still go forwards'],
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
      x: M + 7.10, y: y + 0.14, w: RIGHT - (M + 7.10) - 0.10, h: 0.64,
      fill: { color: 'FFEFE2' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 16, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 is hook answer A. It uses the final velocity for the whole journey.\n\n'
    + 'ROW 2 forgot u. a = (30 \u2212 10) \u00F7 20 = 1.0. Very common.\n\n'
    + 'ROW 3 is the "u is always zero" habit that forms when every early question starts from rest. Here u = 10.\n\n'
    + 'ROW 4 IS THE SUBTLE ONE. The train could be slowing down and still moving forwards the whole time. Negative a, positive s. This is last lesson\u2019s falling-line question wearing different clothes.'
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
    ['Write the equation linking v, u, a and t.', 'v = u + at'],
    ['Write the equation for s using u, v and t.', 's = \u00BD(u + v)t'],
    ['An object starts from rest. What is u?', 'Zero.'],
    ['A car goes from 0 to 18 m s\u207B\u00B9 in 6.0 s. Find a.', '3 m s\u207B\u00B2'],
    ['The same car. How far does it travel?', '\u00BD(0 + 18) \u00D7 6 = 54 m'],
    ['You are not told the acceleration. Which equation do you use?', 's = \u00BD(u + v)t'],
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
    + 'Q4 and Q5 are the same car, so Q5 should be quick once Q4 lands.\n\n'
    + 'Q6 IS THE ONE THAT MATTERS. Choosing the equation is the skill; doing the arithmetic is not. Ask two or three students how they decided.\n\n'
    + 'If a student cannot answer, take it elsewhere and come back for them to repeat it.'
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
    fontSize: 32, bold: true, valign: 'middle', margin: 0, lineSpacing: 40, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FFE9E0', 'Substitute', 'Numbers straight into the equation.'],
    ['SILVER', '5A6480', 'F1F2F6', 'Two steps', 'Find v first, then use it to find s.'],
    ['GOLD', C.accent, 'FFEFE2', 'Reason', 'Rearrange, derive, and say when these equations fail.'],
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
      fontSize: 15, valign: 'top', margin: 0, lineSpacing: 20, objectName: `t${i}_b`,
    });
  });
  s.addText('Write down u, v, a, s and t before you pick an equation.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO — 14 minutes. Four clicks.\n\n'
    + 'THE LIST FIRST. u, v, a, s, t down the side of the page, filled in from the question, with a gap for the unknown. It turns "which equation?" into "which one has three things I know?"\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what have you written down for u?"\n\n'
    + 'WHERE THEY WILL STALL: Q8, where s is given and v is the unknown, and the Gold rearrangements.\n\n'
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
    ['1', 'v = u + at'],
    ['2', 's = \u00BD(u + v)t'],
    ['3', '15 m s\u207B\u00B9'],
    ['4', '3 m s\u207B\u00B2'],
    ['5', '72 m'],
    ['6', 'v = 21 m s\u207B\u00B9,  then  s = 104 m'],
    ['7', 'a = \u22123 m s\u207B\u00B2,  s = 126 m'],
    ['8', '25 m s\u207B\u00B9  (100 = \u00BD \u00D7 v \u00D7 8)'],
    ['9', 'a = 0,  s = 120 m'],
    ['10', 'v = 13 m s\u207B\u00B9,  then  s = 51 m'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, rowH = 0.72, gap = 0.10;
  ANS.forEach(([n, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 2.00 + row * (rowH + gap);
    card(s, { x, y, w: cw, h: rowH, name: `a${i}` });
    s.addText(n, {
      x: x + 0.24, y, w: 0.50, h: rowH, color: C.accent, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `a${i}_n`,
    });
    s.addText(a, {
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS — 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q7 has a NEGATIVE acceleration and a POSITIVE displacement. That pairing is worth thirty seconds \u2014 it is We Do row 4.\n\n'
    + 'Q8 is the rearrangement. Show it on the board: 100 = \u00BD \u00D7 v \u00D7 8 gives 100 = 4v, so v = 25.\n\n'
    + 'Q9 has a = 0, so the object is at constant velocity. Some will think the question is broken.\n\n'
    + 'The Gold answers are not here \u2014 take two or three out loud.'
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
    ['s = \u00BD(u + v)t is just average velocity \u00D7 time.', 'TRUE'],
    ['u is always zero.', 'FALSE'],
    ['v = u + at comes from the area under a velocity\u2013time graph.', 'FALSE'],
    ['A negative acceleration always gives a negative displacement.', 'FALSE'],
    ['These equations only work when the acceleration is constant.', 'TRUE'],
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
  s.addText('Write down what you know first. Then pick the equation that has three of them in it.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY — 3 minutes. Six clicks.\n\n'
    + 'Q3 checks they know WHICH graph feature gave WHICH equation. The gradient gave v = u + at; the area gave s = \u00BD(u + v)t. If this splits the room, reteach the two I Do slides in the next Do Now.\n\n'
    + 'Q5 IS THE HONEST LIMIT of everything today. If the acceleration changes, neither equation works \u2014 and a curved velocity\u2013time graph is exactly that case.\n\n'
    + 'The closing line is the habit to leave them with.'
  );
}

const out = path.join(__dirname, 'out', `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

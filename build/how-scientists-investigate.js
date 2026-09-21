/**
 * Y7 Science — Scientific Research and Technology, Lesson 1.
 * Single, 50 minutes. Standard archetype — this content fits it cleanly,
 * no deviation needed the way Equations of Motion required one.
 *
 * Follows reference/Into The Lab.pptx (the World of Science unit's closing
 * lesson): they have used Bunsen burners and know the safety routine, and
 * their Do Now already touched "hypothesis" and "repeat measurements for
 * accuracy" as vocabulary — both get built on here, not redefined.
 *
 * AVOID, per the brief: do not present the steps of an investigation as a
 * rigid sequence. Unit 1 Lesson 1 taught science as evidence and logic, not
 * a recipe. That is why I Do 1 is drawn as a loop with a return arrow, not a
 * numbered staircase, and why both We Do row 3 and Plenary Q3 correct the
 * "always the same order" misconception directly rather than just avoiding it.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const { arrow } = require('../lib/shapes');

const DATE = 'Wednesday 23 September 2026';
const LESSON = 'How Scientists Investigate';
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
pptx.subject = 'Y7 Science · Scientific Research and Technology · Lesson 1';

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
const title = (slide, text, mode, opts = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: RIGHT - M, h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: opts.fontSize ?? 36, bold: true,
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
 * The five steps as a LOOP, not a staircase — the point of this slide.
 * Nodes sit on a line; one long return arrow above shows going back, so the
 * picture itself argues against "fixed order", not just the caption.
 */
function investigationLoop(slide, o) {
  const { x, y, w, name } = o;
  const steps = ['Question', 'Hypothesis', 'Test', 'Results', 'Conclusion'];
  const n = steps.length;
  const nodeW = 1.62, nodeH = 0.62;
  const gap = (w - n * nodeW) / (n - 1);
  const xs = steps.map((_, i) => x + i * (nodeW + gap));

  // return arrow, drawn first so the nodes sit on top of it
  arrow(pptx, slide, xs[n - 1] + nodeW * 0.5, y - 0.62, xs[0] + nodeW * 0.5, y - 0.62, {
    colour: C.tintDeep, thickness: 0.10, objectName: `${name}_loop`,
  });
  slide.addText('Scientists go back and repeat steps all the time.', {
    x: xs[0], y: y - 1.00, w: xs[n - 1] + nodeW - xs[0], h: 0.32,
    color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true,
    align: 'center', valign: 'middle', margin: 0, objectName: `${name}_loop_label`,
  });

  steps.forEach((label, i) => {
    slide.addShape(S.roundRect, {
      x: xs[i], y, w: nodeW, h: nodeH, rectRadius: 0.31,
      fill: { color: i === 1 || i === 2 ? C.accent : 'FFFFFF' },
      line: { color: C.dark, width: 1.4 }, objectName: `${name}_n${i}_bg`,
    });
    slide.addText(label, {
      x: xs[i], y, w: nodeW, h: nodeH, color: C.dark, fontFace: F.body, fontSize: 13,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${name}_n${i}_t`,
    });
    if (i < n - 1) {
      arrow(pptx, slide, xs[i] + nodeW + 0.03, y + nodeH / 2, xs[i + 1] - 0.03, y + nodeH / 2, {
        colour: C.dark, thickness: 0.07, objectName: `${name}_fwd${i}`,
      });
    }
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
    ['What must you check before lighting a Bunsen burner?', 'Goggles on, safety flame first, hair tied back.'],
    ['Which flame do you use when you are not heating?', 'The orange safety flame.'],
    ['What does the air hole control?', 'Open = hot blue flame. Closed = safety flame.'],
    ['What is a hypothesis?', 'A prediction about an observation.'],
    ['Why do scientists repeat measurements?', 'To get more accurate results.'],
    ['When can goggles come off?', 'When every burner in the room is out.'],
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
    'DO NOW — 10 minutes. Six clicks.\n\n'
    + 'Q1, Q2, Q3, Q6 ARE OBJECTIVE 3 — lab safety — done here and nowhere else in the lesson. Do not re-teach it later; if it is shaky, that is worth flagging but not re-run today.\n\n'
    + 'Q4 AND Q5 are deliberate retrieval from Into The Lab’s own Do Now — same definitions, same wording. Point that out: "you already know this word."\n\n'
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
    'List the steps scientists use to investigate.',
    'Write a hypothesis you can actually test.',
    'Lab safety — already checked, in the Do Now.',
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
  s.addText('Science is not a recipe. It is a toolkit.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY — 1 minute. Four clicks.\n\n'
    + 'THE BANNER IS THE THESIS OF THE LESSON. Say it, don’t just show it: today is a toolkit, not a set of instructions to follow in order.'
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
  s.addText('Which of these could you actually test?', {
    x: M, y: 0.88, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 32,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 40, objectName: 'slide_title',
  });

  const OPTS = [['A', 'Plants are important.'], ['B', 'Plants grow taller with more sunlight.'], ['C', 'Plants like sunshine.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.32, w: cw - 0.52, h: 0.70, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK — 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board.\n\n'
    + 'ANSWER: B. Do not reveal it here — I Do 2 gets there by fixing A and C.\n\n'
    + 'A AND C are both true-ish and both untestable as written: "important" and "like" are not measurable. That is the whole lesson in one slide.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — the loop
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The shape of an investigation', 'light');

  investigationLoop(s, { x: M + 0.30, y: 4.55, w: RIGHT - M - 0.60, name: 'loop' });

  s.addText('It is a loop, not a staircase. Real investigations jump back — a strange result sends you back to Test, or even back to Question.', {
    x: M, y: 5.85, w: RIGHT - M, h: 0.90, color: C.inkSoft, fontFace: F.body,
    fontSize: 15, valign: 'top', margin: 0, lineSpacing: 20, objectName: 'loop_note',
  });
  s.addNotes(
    'I DO — 3 minutes. Six clicks: the loop appears as one group, then the return arrow, then the note.\n\n'
    + 'DO NOT NUMBER THESE STEPS ON THE BOARD 1-2-3-4-5. That is exactly the "recipe" framing Unit 1 Lesson 1 already argued against — evidence and logic, not a fixed sequence.\n\n'
    + 'SAY OUT LOUD: "If your test gives a weird result, where do you go?" Answer: back to Test, sometimes back to Question. That is normal, not a failure.\n\n'
    + 'Hypothesis and Test are highlighted because those are today’s two working slides.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — hypothesis
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Writing a hypothesis you can test', 'light');

  const STEPS = [
    ['1', '"Plants like sunshine."', 'Not testable — "like" cannot be measured.'],
    ['2', 'Pick something you CAN measure.', 'Height. Number of leaves. Time to wilt.'],
    ['3', 'If [I change this], then [this happens].', 'The shape every testable hypothesis follows.'],
    ['4', '"Plants grow taller with more sunlight."', 'Testable. That was Hook option B.'],
  ];
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.02;
    card(s, {
      x: M, y, w: RIGHT - M, h: 0.86,
      fill: i === 3 ? 'FDF3DC' : 'FFFFFF', line: i === 3 ? C.accent : 'D8DEEC',
      lineWidth: i === 3 ? 1.7 : 1.3, name: `hy_${i}`,
    });
    s.addText(n, {
      x: M + 0.22, y, w: 0.34, h: 0.86, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `hy_${i}_n`,
    });
    s.addText(eq, {
      x: M + 0.68, y: y + 0.08, w: RIGHT - M - 0.92, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `hy_${i}_e`,
    });
    s.addText(note, {
      x: M + 0.68, y: y + 0.48, w: RIGHT - M - 0.92, h: 0.32, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'middle', margin: 0, objectName: `hy_${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 3 minutes. Six clicks.\n\n'
    + 'STEP 1 SAYS THE QUIET PART: "like" and "important" are opinions, not observations. Ask "how would you measure that?" and let the silence make the point.\n\n'
    + 'STEP 3 IS THE ONE SENTENCE THAT MATTERS TODAY. Write it on the board and leave it there for We Do and You Do.\n\n'
    + 'STEP 4 CLOSES THE HOOK. Go back to the tally — B was always testable, A and C needed fixing first.'
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
    ['"Music makes plants happy."', '"Plants grow taller with music than in silence."'],
    ['"I’ll change three things at once to save time."', 'Change one variable at a time.'],
    ['"The steps must be followed in the exact order, every time."', 'The steps are a flexible guide, not a fixed order.'],
    ['"My hypothesis is that this will be interesting."', '"If I add fertiliser, the plant grows taller, because it gets more nutrients."'],
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
      fill: { color: 'FDF3DC' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1: opinion dressed as a hypothesis. "Happy" cannot be measured; growth can.\n\n'
    + 'ROW 2: the fair-test rule from Into The Lab, restated for this context.\n\n'
    + 'ROW 3 IS THE MISCONCEPTION THE WHOLE LESSON IS BUILT AROUND. Spend the extra few seconds here. Ask: "so what should you do if a step doesn’t work?" — go back, not panic.\n\n'
    + 'ROW 4: "interesting" is not a hypothesis at all — there is no prediction in it.'
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
    ['What is a hypothesis?', 'A prediction you can test.'],
    ['Name one step in an investigation.', 'Any of: question, hypothesis, test, results, conclusion.'],
    ['True or false: every investigation follows the same order.', 'False.'],
    ['What do you call the thing you change on purpose?', 'The independent variable.'],
    ['What do you call the thing you measure?', 'The dependent variable.'],
    ['Why repeat an investigation?', 'To check the results are reliable.'],
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
      fill: { color: 'FDF3DC' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL — 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q2 HAS NO SINGLE RIGHT ANSWER — accept any of the five, and say so before you ask it, or you will get silence from students worried about picking the "wrong" step.\n\n'
    + 'Q4 AND Q5 are new vocabulary, but the concept came from Into The Lab’s own Do Now Q4 (temperature vs sugar dissolving). Point that out.\n\n'
    + 'Q6 echoes Into The Lab directly — same question, same answer. This one should be fast.'
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
    fontSize: 28, bold: true, valign: 'middle', margin: 0, lineSpacing: 34, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FDEAE8', 'Spot it', 'Which statements are actually testable?'],
    ['SILVER', '5A6480', 'F1F2F6', 'Fix it', 'Turn a vague idea into a testable hypothesis.'],
    ['GOLD', C.accentInk, 'FDF3DC', 'Design it', 'Write and justify your own investigation.'],
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
  s.addText('Remember the shape: If [I change this], then [this happens], because [reason].', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO — 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what could you actually measure?"\n\n'
    + 'WHERE THEY WILL STALL: Silver Q5-6 (rewriting a vague statement), and Gold entirely — designing their own is the stretch.\n\n'
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
    ['1', 'hypothesis'],
    ['2', 'Yes — you can time it.'],
    ['3', 'No — "best" is not measurable.'],
    ['4', 'The safety flame (orange).'],
    ['5', '"Plants grow taller with more sunlight than in the dark." (accept similar)'],
    ['6', 'Amount of sunlight.'],
    ['7', 'Plant height.'],
    ['8', 'So you know what actually caused the result — a fair test.'],
    ['9', 'Answers vary — must follow "if...then...because" and name something measurable.'],
    ['10', 'A strange result can send you back to an earlier step — investigations loop, they do not run once in fixed order.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 13,
      valign: 'middle', margin: 0, lineSpacing: 17, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS — 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q9 AND Q10 have no single right answer. Take two or three out loud for each rather than reading a model answer — the point is the reasoning, not matching a phrase.\n\n'
    + 'Q10 IS THE LESSON’S THESIS, restated as an answer. If it is shaky, that is worth five minutes at the start of next lesson.'
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
    ['A hypothesis is just a guess with no reasoning.', 'FALSE'],
    ['"Plants grow taller with more light" is a testable hypothesis.', 'TRUE'],
    ['Every scientist follows the same steps in the same order.', 'FALSE'],
    ['You should change one variable at a time.', 'TRUE'],
    ['Goggles come off as soon as your own burner is out.', 'FALSE'],
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
  s.addText('If a step does not work, go back to an earlier one. That is normal science, not a mistake.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY — 3 minutes. Six clicks.\n\n'
    + 'Q1 CHECKS THE CORE DISTINCTION: a hypothesis has reasoning behind it, a guess does not.\n\n'
    + 'Q3 IS THE LESSON’S MAIN POINT, asked directly. If this splits the room, reteach the loop diagram next lesson before anything new.\n\n'
    + 'Q5 IS A SAFETY CALLBACK to the Do Now, not new content — goggles stay on until every burner in the room is out, not just your own.\n\n'
    + 'The closing line is the habit to leave them with.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
require('fs').mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

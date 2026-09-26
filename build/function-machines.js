/**
 * Y8 Maths, Algebra, Lesson 5: Function machines. Class 8CN.
 * Single, 50 minutes. Maths track: 10 x 5.625 canvas, Number Revision palette.
 *
 * PREVIOUS: read from reference/Putting Numbers In.pptx. That deployed deck (teacher-edited)
 * has nine slides whose phase pills total 5+1+2+6+6+5+6+13+3 = 47 minutes, with NO Answers
 * slide (taken out after deployment; it is now a standing rule). The lesson was all positive whole numbers by
 * request ("avoid negatives and fractions"), taught substitution into one-step, two-step,
 * bracket and two-letter formulas, ran the Do Now at 5 minutes, and used a Drill rounds
 * game as the You Do. Its plenary made no promise, but its notes named "negative numbers
 * and fractions" as the natural next step. The vocabulary already taught: substitute,
 * formula, and "multiply before you add". The mistakes already named: 43 for 4n, adding
 * first, the bracket that reaches only the first term, letters swapped.
 *
 * THEY FOUND HARD: nothing. "It was too easy." So this lesson is pitched higher: it goes
 * straight to two-step machines, brackets appear in the rule when a step is "add first",
 * working backwards is a whole I Do, and the game climbs to questions that are meant to
 * be almost impossible (see GAMES.md, "Difficulty ramps, and the top is hard").
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 5, Objectives 1, Hook 2, I Do 6, I Do 6, We Do 5,
 * Cold Call 6, You Do 16, Plenary 3. There is NO Answers slide (a standing rule, set after this
 * lesson's first draft: the worksheet's answers go upside down on its last page, and the 3
 * minutes go to the You Do). The You Do is the game (Drill rounds); the worksheet is the
 * fallback. The Objectives slide was called "Today" before; the Hook has no "Vote!" line.
 * The three machine animations start ON CLICK, not when the slide opens.
 *
 * NEGATIVES. The previous brief's "avoid" was for that lesson only. Here negative numbers
 * appear in exactly one place, one possible last question of the game, and nowhere in the
 * deck or the worksheet: every step in the deck is positive whole numbers.
 *
 * Every number is checked in build/function-machines-check.py (sympy).
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
const { addTimer } = require('../lib/timer');
const PAL = THEME.PALETTES.maths;              // for the timer bar

const LESSON = 'Function Machines';
const DATE = 'Tuesday 6 October 2026';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);

// House colours from the school's Number Revision deck (see examples/maths-deck-10x5.625.js).
const C = {
  dark: '2B2350', accent: 'EC6B58', answer: 'C0392B', card: 'F2F0F8', soft: '5E5A70',
  purple: '5B4FA0', green: '2E8B57', blue: '1F6FB2', white: 'FFFFFF', darkSoft: '3D3470', tintDeep: 'E1DDEF',
};
const F = { title: 'Georgia', body: 'Arial' };

const W = 10, H = 5.625;
const TIMER = { x: 0.20, y: 0.20, w: 0.34, h: H - 0.40 };
const M = 0.85, RIGHT = W - 0.45, CW = RIGHT - M;
const PILL_Y = 0.30, PILL_H = 0.32, TITLE_Y = 0.78, SUB_Y = 1.36;

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y8 Maths · Algebra · Lesson 5';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

const PHASES = [];
function newSlide(minutes, mode) {
  const s = pptx.addSlide();
  s.background = { color: mode === 'dark' ? C.dark : C.white };
  PHASES.push(addTimer(pptx, s, {
    key: 'maths', palette: PAL, minutes, mode: mode || 'light', slideH: H,
    x: TIMER.x, y: TIMER.y, w: TIMER.w, h: TIMER.h,
  }));
  return s;
}

/* ---------------- furniture ---------------- */
function pill(slide, label, minutes, mode) {
  const text = `${label.toUpperCase()} · ${minutes} MIN`;
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.14,
    x: M, y: PILL_Y, w: Math.max(1.35, 0.098 * text.length + 0.38), h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : C.white,
    fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
}
const title = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y, w: CW, h: 0.58, color: mode === 'dark' ? C.white : C.dark, fontFace: F.title, fontSize: 28,
  bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
});
const subtitle = (slide, text) => slide.addText(text, {
  x: M, y: SUB_Y, w: CW, h: 0.26, color: C.soft, fontFace: F.body, fontSize: 11,
  valign: 'middle', margin: 0, objectName: 'slide_sub',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06,
    fill: { color: o.fill || C.card }, line: { color: o.line || o.fill || C.card, width: o.line ? 1.4 : 0 },
    objectName: `${o.name}_bg`,
  });
}
function badge(slide, o) {
  slide.addShape(S.ellipse, { x: o.x, y: o.y, w: 0.38, h: 0.38, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.name}_badge` });
  slide.addText(String(o.n), {
    x: o.x, y: o.y, w: 0.38, h: 0.38, color: C.dark, fontFace: F.body, fontSize: 10.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num`,
  });
}
function banner(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.08, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.56,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 }, color: C.white, fontFace: F.body,
    fontSize: o.size ?? 13.5, bold: true, align: 'center', valign: 'middle', margin: 0.08, objectName: o.name,
  });
}
/** A note in brick red on a pale card with a coral edge: the warnings. */
function warn(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.06, x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: 'FDF0EE' }, line: { color: C.accent, width: 1.3 },
    color: C.answer, fontFace: F.body, fontSize: o.size ?? 12, bold: true, align: 'center', valign: 'middle', margin: 0.08,
    lineSpacing: (o.size ?? 12) + 4, objectName: o.name,
  });
}
/**
 * A colour-coded line of algebra: terms are runs in ONE text box. Colour is the
 * teaching device: the number that has been put in is brick, the letter is blue.
 * Arial, not Georgia: Georgia's plus sign renders as a tiny star in LibreOffice and its
 * old-style figures sit at different heights, which is wrong for working with numbers.
 */
function expr(slide, o) {
  slide.addText(o.parts.map(([text, col]) => ({
    text, options: { color: col || C.dark, bold: true, fontFace: F.body, fontSize: o.size ?? 18 },
  })), { x: o.x, y: o.y, w: o.w, h: o.h ?? 0.34, align: o.align || 'left', valign: 'middle', margin: 0, objectName: o.name });
}
const N = (t) => [t, C.dark];       // operators, plain numbers
const L = (t) => [t, C.blue];       // a letter
const V = (t) => [t, C.answer];     // a number put in, and answers

/** A worked example card: a header, then one line of working per click. */
function worked(slide, o) {
  card(slide, { x: o.x, y: o.y, w: o.w, h: o.h, name: o.name });
  slide.addText(o.head, {
    x: o.x + 0.20, y: o.y + 0.08, w: o.w - 0.40, h: 0.32, color: C.soft, fontFace: F.body, fontSize: 12,
    bold: true, valign: 'middle', margin: 0, objectName: `${o.name}_h`,
  });
  o.lines.forEach((parts, i) => expr(slide, {
    x: o.x + 0.26, y: o.y + 0.44 + i * 0.36, w: o.w - 0.5, h: 0.34, size: o.size ?? 18, parts, name: `${o.name}_l${i}`,
  }));
}


/** The answer cards used by the Do Now and the Cold Call. */
function qGrid(s, o) {
  const cw = (CW - 0.24) / 2, ch = o.ch, gap = o.gap;
  o.qs.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = o.y0 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `${o.p}${i}` });
    // the number and the question share ONE vertical centre, so a one-line question sits level with its number
    const qy = y + 0.08, cy = qy + o.qh / 2;
    s.addText(String(i + 1), { x: x + 0.18, y: cy - 0.21, w: 0.40, h: 0.42, color: C.answer, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `${o.p}${i}_n` });
    s.addText(q, { x: x + 0.66, y: qy, w: cw - 0.86, h: o.qh, color: C.dark, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09, x: x + 0.18, y: y + ch - 0.52, w: cw - 0.36, h: 0.42,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.2 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
  });
}
/** A machine animation. It starts ON CLICK (spec: effect "play"), so the teacher speaks first. */
const machineVideo = (s, file, x, y, w, h, name) => s.addMedia({
  type: 'video', path: MEDIA(`${file}.mp4`),
  cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'),
  x, y, w, h, objectName: name,
});

/* ================================================================== *
 * 1. DO NOW · 5
 * ================================================================== */
{
  const s = newSlide(5);
  pill(s, 'Do Now', 5);
  s.addText(LESSON, {
    x: 2.55, y: 0.16, w: 4.90, h: 0.62, color: C.dark, fontFace: F.title, fontSize: 26, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText(DATE, {
    x: RIGHT - 2.30, y: PILL_Y, w: 2.30, h: PILL_H, color: C.soft, fontFace: F.body, fontSize: 11,
    align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addShape(S.rect, { x: M, y: 0.86, w: CW, h: 0.035, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.02, ch: 1.38, gap: 0.13, qh: 0.72, size: 13, qs: [
    ['Find 5n − 3 when n = 6.', '27'],
    ['Find 3(n + 4) when n = 2.', '18'],
    ['Find 2a + 3b when a = 7 and b = 4.', '26'],
    ['A student says that 3n + 2 = 20 when n = 4. Find the mistake and the correct answer.', '14. They added first.'],
    ['Expand and simplify 2(x + 3) + x.', '3x + 6'],
    ['Write “double n, then add 5” as a formula.', '2n + 5'],
  ] });
  s.addNotes(
    'DO NOW. 5 minutes, as in Putting Numbers In. Six clicks, one answer each.\n\n'
    + 'I READ reference/Putting Numbers In.pptx. Its phase pills total 47 minutes and the Answers slide is gone, so this deck is 50 minutes with no Answers slide either, the spare 3 minutes going to the You Do. The Do Now is NEW QUESTIONS, not last lesson\'s again, and it is pitched a step up because you said last lesson was too easy: two-step and bracket formulas at once, no one-step warm-up.\n\n'
    + 'THE SIX ARE SIX DIFFERENT SKILLS. Q1, Q2, Q3 are substitution (one, bracket, two letters). Q4 is spot the error: 3n + 2 = 20 when n = 4 is (3 + 2) × 4, adding first, and the answer is 3 × 4 + 2 = 14. Q5 goes back two lessons: 2(x + 3) + x = 2x + 6 + x = 3x + 6. Q6 IS THE PLANT: "double n, then add 5" is 2n + 5. Do not teach it. Say "we will come back to this one".\n\n'
    + 'WATCH Q2 AND Q5 (brackets). Q2 is 3 × (2 + 4) = 3 × 6 = 18; the bracket that reaches only the first term gives 3 × 2 + 4 = 10. Q5 expects 2x + 3 + x from anyone who stops after the first term.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
{
  const s = newSlide(1);
  pill(s, 'Objectives', 1);
  title(s, 'Objectives');
  const GOALS = [
    'Find the output of a two-step function machine.',
    'Write the rule for a machine as a formula.',
    'Find the input when given the output.',
  ];
  const cw = (CW - 2 * 0.24) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 1.74, w: cw, h: 1.60, name: `o${i}` });
    badge(s, { x: x + 0.18, y: 1.92, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.18, y: 2.44, w: cw - 0.36, h: 0.84, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      valign: 'top', margin: 0, lineSpacing: 16, objectName: `o${i}_t`,
    });
  });
  banner(s, 'A machine is a rule. To go backwards, undo the last step first.', { y: 3.68, h: 0.56, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING. Objective 1 is the output of a two-step machine, objective 2 is the rule as a formula, objective 3 is working backwards. They are in the order the lesson teaches them: I Do 1 covers the first two, I Do 2 the third.\n\n'
    + 'NEW WORDS: input, output, and function machine. Input is what goes in, output is what comes out. The formula uses n for the input. They already know "formula" and "substitute" from last lesson, so a machine is the same idea drawn as boxes: "you have been running machines all week without the name".\n\n'
    + 'THE BANNER IS THE WHOLE LESSON: a machine is a rule, and to go backwards you undo the last step first. Say it twice.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = newSlide(2);
  pill(s, 'Hook', 2);
  title(s, 'Which one is right?');
  s.addText('I think of a number. I multiply it by 3, then add 4. My answer is 19. What was my number?', {
    x: M, y: 1.42, w: CW, h: 0.90, color: C.dark, fontFace: F.title, fontSize: 19, bold: true,
    valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'hook_q',
  });
  const OPTS = [['A', '5'], ['B', '12'], ['C', '23']];
  const cw = (CW - 2 * 0.24) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.58, w: cw, h: 1.14, name: `h${i}` });
    s.addText(k, { x: x + 0.20, y: 2.72, w: 0.40, h: 0.36, color: C.answer, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.20, y: 3.10, w: cw - 0.40, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Two clicks: the question, then the three options together.\n\n'
    + 'Take a show of hands for each option and tally it on the board. Do not settle it. The Plenary settles it.\n\n'
    + 'ANSWER, FOR YOU: A. Work backwards: 19 − 4 = 15, then 15 ÷ 3 = 5. Check: 5 × 3 + 4 = 19. B is 12, from taking away both numbers, 19 − 3 − 4, which is the "just take everything off" idea. C is 23, from adding 4 instead of taking it away, which is doing the machine again instead of undoing it. Both are the mistakes the lesson names.\n\n'
    + 'MOST WILL GUESS AND CHECK, and that is fine: the hook is not meant to be hard. If a student gets 5, ask "how did you know?" and take "I undid it": that is the lesson\'s last objective, said by a student.\n\n'
    + 'THIS IS A TWO-STEP MACHINE IN WORDS. Multiply by 3, then add 4: the formula is 3n + 4. Do not write it yet: the I Do slides do that.'
  );
}

/* ================================================================== *
 * 4. I DO · 6: follow the machine, then write the rule
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'I Do', 6);
  title(s, 'Follow the machine, then write the rule');
  subtitle(s, 'Do the boxes in order. The formula uses n for the input.');
  worked(s, {
    name: 'ea', x: M, y: 1.74, w: 5.00, h: 1.54, head: 'Input 6 goes through × 4, then − 3', lines: [
      [N('6 × 4 =  '), V('24')],
      [N('24 − 3 =  '), V('21')],
      [V('Output: 21')],
    ],
  });
  worked(s, {
    name: 'eb', x: M, y: 3.40, w: 5.00, h: 1.98, size: 16, head: 'Write the rule as a formula. n is the input.', lines: [
      [N('× 4, then − 3     →     4'), L('n'), N(' − 3')],
      [N('− 3, then × 4     →     4('), L('n'), N(' − 3)')],
      [['the first box goes inside the brackets', C.soft]],
      [L('n'), N(' = 5:   4'), L('n'), N(' − 3 = '), V('17'), N(',   4('), L('n'), N(' − 3) = '), V('8')],
    ],
  });
  // two animations, one above the other. Each starts ON CLICK and pauses at every operation.
  const rx = M + 5.15, rw = CW - 5.15, vh = rw * 470 / 960;
  machineVideo(s, 'function-machines-forward', rx, 1.74, rw, vh, 'vid_forward');
  machineVideo(s, 'function-machines-bracket', rx, 1.74 + vh + 0.10, rw, vh, 'vid_bracket');
  s.addNotes(
    'I DO. 6 minutes. Nine clicks: each line of the first example (3), the first animation, each line of the rule card (4), then the second animation. Both animations START ON CLICK, so say the idea first and press play when you want them to look.\n\n'
    + 'THE FIRST ANIMATION (about 20 seconds) runs the rule 4n − 3 on the inputs 6, 2 and 5. It PAUSES at every operation: the number stops at a box, the box lights up, the working is written under the machine ("6 × 4 = 24") and the number changes. It shows that the SAME rule, in the SAME order, works for any input. Talk over the pauses. You can click it to play it again.\n\n'
    + 'THE SECOND ANIMATION runs 4(n − 3) on the inputs 5, 9 and 6, and it is the SAME two boxes in the OTHER order: subtract 3 first, then multiply by 4. Put the two side by side: for n = 5 the first rule gives 17 and the second gives 8. The order of the boxes changes the machine, and when the first box is + or − the formula needs brackets: 4(n − 3), not 4n − 3.\n\n'
    + 'EXAMPLE 1, INPUT 6. Say "input" for what goes in and "output" for what comes out. 6 × 4 = 24, then 24 − 3 = 21. The put-in numbers are brick red so the path is visible. Model a second on the board with new numbers: × 5, then + 2, input 7 gives 37.\n\n'
    + 'THE RULE AS A FORMULA. × 4 then − 3 is 4n − 3: n is the input, and 4n means 4 × n, which they know from last lesson. − 3 then × 4 is 4(n − 3): THE SUBTRACTING COMES FIRST, so it has to go inside brackets. Writing 4n − 3 would mean "multiply, then subtract", which is the OTHER machine. Prove it with the last line of the card: n = 5 gives 17 for one and 8 for the other.\n\n'
    + 'THE MISTAKE TO NAME: writing the numbers in the order they appear and not in the order of the steps. The formula must follow the boxes, not the reading order. Say it: "the first box is the first thing you do to n". The other classic: writing 2n + 5 for "add 5, then multiply by 2". It is not 2(n + 5); ask for n = 4 in both: 13 and 18.\n\n'
    + 'IF THEY ARE QUICK: ask for the rule for "add 5, then multiply by 2" (2(n + 5)) and ask which of 4n − 3 and 4(n − 3) is bigger for n = 3. (9 and 0.)'
  );
}

/* ================================================================== *
 * 5. I DO · 6: work backwards
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'I Do', 6);
  title(s, 'Work backwards');
  subtitle(s, 'Undo the last step first. Use the opposite: + and −, × and ÷.');
  worked(s, {
    name: 'ec', x: M, y: 1.74, w: 5.00, h: 1.70, size: 15, head: 'Rule 4n − 3. The output is 21. Find n.', lines: [
      [N('Undo − 3 with + 3:     21 + 3 =  '), V('24')],
      [N('Undo × 4 with ÷ 4:     24 ÷ 4 =  '), V('6')],
      [V('n = 6'), ['      Check: 4 × 6 − 3 = 21', C.soft]],
    ],
  });
  worked(s, {
    name: 'ed', x: M, y: 3.56, w: 5.00, h: 1.70, size: 15, head: 'Rule 2(n + 5). The output is 18. Find n.', lines: [
      [N('Undo × 2 with ÷ 2:     18 ÷ 2 =  '), V('9')],
      [N('Undo + 5 with − 5:     9 − 5 =  '), V('4')],
      [V('n = 4'), ['      Check: 2 × (4 + 5) = 18', C.soft]],
    ],
  });
  // ONE tall animation (twice the height of the ones on the last slide): 4n − 3 forwards on top,
  // and underneath the same machine run backwards, so the opposite steps line up under the ones they undo.
  const rx = M + 5.15, rw = CW - 5.15;
  machineVideo(s, 'function-machines-backward', rx, 1.74, rw, rw * 950 / 960, 'vid_backward');
  s.addNotes(
    'I DO. 6 minutes. Seven clicks: each line of each example (six), then the animation. The animation STARTS ON CLICK, so introduce the idea first and press play when you want them to watch.\n\n'
    + 'THE ANIMATION (about 17 seconds). The TOP half is the same 4n − 3 as the last slide, run forwards for the input 6: × 4 gives 24, − 3 gives 21. It pauses at each operation and writes the working. Then the BOTTOM half runs the SAME machine BACKWARDS: the 21 goes in at the right, meets a + 3 box (under the − 3 it undoes) and becomes 24, then a ÷ 4 box (under the × 4) and becomes 6, the number we started with. The boxes are lined up so the opposites sit under the steps they undo, and the small tags 6, 24 and 21 sit above both tracks in the same places. Ask before you press play: "what do you think has to happen to 21?" Then let it run. This is why we use the opposite, and why we undo the LAST step first: to get back to 6 you have to reverse the journey.\n\n'
    + 'EXAMPLE 1, RULE 4n − 3, OUTPUT 21. The last step of the machine was − 3, so undo THAT first, with + 3: 24. Then undo × 4 with ÷ 4: 6. Check by going forward: 4 × 6 − 3 = 21. Every question today can be checked, so ask them to check.\n\n'
    + 'EXAMPLE 2, RULE 2(n + 5), OUTPUT 18. The last step was × 2, so ÷ 2 first: 9. Then undo + 5: 4. Check: 2 × (4 + 5) = 18. THIS IS THE ONE WHERE THE ORDER MATTERS, because the brackets hide it: the + 5 is written first, but the × 2 happened last, so it is undone first.\n\n'
    + 'THE TWO MISTAKES TO NAME, said out loud since there are no warning boxes on the slide: (1) UNDOING IN THE ORDER THE STEPS WERE DONE. 18 − 5 = 13, then 13 ÷ 2 is not a whole number, which is a useful sign that something is wrong. (2) USING THE SAME OPERATION INSTEAD OF THE OPPOSITE: 21 − 3 = 18 for "undo − 3". And the hook is the same idea: 19 − 4 = 15, then 15 ÷ 3 = 5.\n\n'
    + 'MODEL A THIRD ON THE BOARD: rule 3n + 4, output 25. Undo + 4: 21. Undo × 3: 7. Check: 3 × 7 + 4 = 25.\n\n'
    + 'IF THEY ARE QUICK: ask for the input of a machine that does ÷ 2, then + 6, when the output is 10. Undo + 6: 4. Undo ÷ 2 with × 2: 8. The ÷ needs × to undo it, and it is the We Do row 4 next.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5
 * ================================================================== */
{
  const s = newSlide(5);
  pill(s, 'We Do', 5);
  title(s, 'What should be the correct answer?');
  subtitle(s, 'Spot the mistake.');
  const ROWS = [
    ['× 5, then − 2. Input 4. The student does 4 − 2 = 2, then 2 × 5 = 10.', 'Do the boxes in order: 4 × 5 = 20, then 20 − 2 = 18.'],
    ['+ 3, then × 2. The student writes the rule 2n + 3.', 'Add first, so the brackets: 2(n + 3).'],
    ['Rule 2n + 7. Output 19. The student does 19 + 7 = 26, then 26 ÷ 2 = 13.', 'Undo + 7 with − 7: 19 − 7 = 12, then 12 ÷ 2 = 6.'],
    ['÷ 2, then + 6. Output 10. The student does 10 × 2 = 20, then 20 − 6 = 14.', 'Undo the last step first: 10 − 6 = 4, then 4 × 2 = 8.'],
  ];
  const rowH = 0.80, gap = 0.10;
  ROWS.forEach(([wrong, right], i) => {
    const y = 1.74 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.20, y, w: 4.10, h: rowH, color: C.dark, fontFace: F.body, fontSize: 12.5, valign: 'middle', margin: 0, lineSpacing: 16, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.08, x: M + 4.45, y: y + 0.09, w: CW - 4.45 - 0.10, h: rowH - 0.18,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, lineSpacing: 15, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click. THEY MUST SAY WHAT THE STUDENT DID: "it is wrong" earns nothing.\n\n'
    + 'ROW 1: STEPS IN THE WRONG ORDER. The student did the − 2 first. The boxes are read left to right: × 5 first, 4 × 5 = 20, then − 2 = 18.\n\n'
    + 'ROW 2: BRACKETS FORGOTTEN. + 3 then × 2 is 2(n + 3). The student wrote the machine for "× 2, then + 3". Ask "what does your rule give for n = 5?" 2 × 5 + 3 = 13, but the machine gives (5 + 3) × 2 = 16.\n\n'
    + 'ROW 3: THE SAME OPERATION, NOT THE OPPOSITE. The student added 7 to undo + 7. The opposite of + is −. 19 − 7 = 12, then 12 ÷ 2 = 6. Check: 2 × 6 + 7 = 19.\n\n'
    + 'ROW 4: UNDONE IN THE WRONG ORDER. The machine did ÷ 2 first and + 6 last, so + 6 has to be undone FIRST. 10 − 6 = 4, then 4 × 2 = 8. Check: 8 ÷ 2 + 6 = 10. Ask "which step happened last?" and take the answer from the room.\n\n'
    + 'IF THEY ARE QUICK, ask them to write a wrong answer for a partner to diagnose.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'Cold Call', 6);
  qGrid(s, { p: 'c', y0: 0.86, ch: 1.44, gap: 0.10, qh: 0.84, size: 13.5, qs: [
    ['Find the output of a machine that does × 6, then − 5, when the input is 8.', '43'],
    ['Write the rule as a formula for a machine that adds 4, then multiplies by 3.', '3(n + 4)'],
    ['Find the input when the rule is 5n + 2 and the output is 37.', '7'],
    ['Find the input of a machine that does ÷ 4, then + 9, when the output is 14.', '20'],
    ['Find the input when the rule is 2(n − 3) and the output is 18.', '12'],
    ['Input 10. Machine A: × 3, then + 2. Machine B: + 2, then × 3. Which gives more, and by how much?', 'B, by 4. A = 32, B = 36.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Give thinking time, then ask for the working out loud: "which step do you do first, and why?" Students have no mini whiteboards, so the working is spoken.\n\n'
    + 'Q1 IS OBJECTIVE 1. 8 × 6 = 48, then 48 − 5 = 43. The wrong answer 8 − 5 = 3, then 3 × 6 = 18, is the steps in the wrong order.\n\n'
    + 'Q2 IS OBJECTIVE 2, THE BRACKET RULE. Add 4 first, so 3(n + 4). Wrong: 3n + 4. Ask for n = 5 in both: 27 and 19.\n\n'
    + 'Q3 TO Q5 ARE OBJECTIVE 3. Q3: 37 − 2 = 35, then 35 ÷ 5 = 7. Q4 needs × 4 to undo the ÷ 4: 14 − 9 = 5, then 5 × 4 = 20. Q5 IS THE HARDEST OF THE THREE, and the brackets are what make it hard: 2(n − 3) = 18 means the × 2 was last, so 18 ÷ 2 = 9, then undo − 3 with + 3: 12. Check: 2 × (12 − 3) = 18. Give it the longest wait.\n\n'
    + 'Q6 IS THE STRETCH AND THE LESSON IN ONE QUESTION. Machine A: 10 × 3 = 30, then + 2 = 32. Machine B: 10 + 2 = 12, then × 3 = 36. B is bigger by 4. The same two boxes in a different order are a different machine.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, spend longer on Q5 and Q6 and ask for a machine of their own to trade. IF SHORT OF TIME, cut Q1 and Q3.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 13: the game
 * ================================================================== */
{
  const s = newSlide(16);
  pill(s, 'You Do', 16);
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.25, y: 0.66, w: 1.25, h: 1.08, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, {
    x: M, y: 0.72, w: CW - 1.45, h: 0.70, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 1.44, w: CW - 1.45, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const ROUNDS = [
    ['ROUND 1', 'Machine outputs', 'Follow the boxes in order. One step, then two, then three.'],
    ['ROUND 2', 'Rules and reverses', 'Pick the rule for a machine. Then work backwards from the output.'],
    ['ROUND 3', 'Beat the machines', 'Very hard. The last questions are meant to be almost impossible. Do what you can.'],
  ];
  const cw = (CW - 2 * 0.24) / 3;
  ROUNDS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.02, w: cw, h: 1.86, fill: i === 2 ? 'F6D9D4' : 'FDF0EE', line: C.accent, name: `t${i}` });
    s.addText(n, { x: x + 0.20, y: 2.14, w: cw - 0.40, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.20, y: 2.46, w: cw - 0.40, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.20, y: 2.88, w: cw - 0.40, h: 0.90, color: C.soft, fontFace: F.body, fontSize: 11.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: 4.12, w: CW, h: 0.50, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 16 minutes. Four clicks. THIS LESSON\'S YOU DO IS A GAME, and the worksheet is the fallback.\n\n'
    + 'WHAT THEY DO. Open the file "Function Machines game" from Google Classroom. Three rounds of six questions, each on their own device. Each question shows the machine as a row of boxes. They type an answer with the on-screen keypad or the keyboard, or tap one of four rules, and press Check. A wrong answer says what the mistake probably was, in the same words as this deck, and shows the working. EVERY STUDENT GETS DIFFERENT MACHINES AND NUMBERS, so a neighbour\'s answers are no use: Round 1 question 1 might be "× 7, input 12" for one student and "+ 23, input 31" for another. The skills and their order are the same for everyone, so the end screen means the same thing for all of them. Each game has a six-character code, shown on the start and end screens. If a student says a question looked wrong, add #CODE to the end of the file\'s address and you will see exactly what they saw. There are no lives and no scores that punish slowness. The end screen shows what they got wrong by skill, not a single number.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. You said last lesson was too easy. Round 1 is this lesson (outputs of one, two and three steps). Round 2 is the rules as formulas (two multiple-choice questions) and working backwards, up to three steps. Round 3 goes far beyond it: a three-step reversal with a divide, then an input that equals its own output, a missing number, a rule found from a table, and finally two questions that are meant to be almost impossible. Question 17 is either two machines that give the same output for one input (find the input), or a three-step reversal with "subtract from" (which is its own opposite). Question 18 is one of a four-step reversal with "subtract from" and a divide, a three-step machine whose output equals its input, or a four-step machine with negative numbers on the way (the only place in the whole lesson that a negative number appears). Expect most of the room to fail question 17 and 18. That is the design, and the working shown after every answer is where the learning is. Tell them so before they start, so that nobody thinks a red dot at the end of round 3 means they are bad at maths.\n\n'
    + 'THERE IS A "STOP AND SEE MY RESULTS" BUTTON on every question. Sixteen minutes will not finish eighteen questions for most students, and it is not meant to. The end screen shows how many were answered and how many were not reached. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took, whether it was right, and, for a wrong one, what the student wrote and how to get to the right answer. Use it when you sit with a student: it is their errors on one page.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early, or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers upside down on the last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which step happens last?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide: the worksheet answers are printed UPSIDE DOWN on its last page, so students who used the paper mark it themselves.'
  );
}

/* ================================================================== *
 * 9. PLENARY · 3
 * ================================================================== */
{
  const s = newSlide(3, 'dark');
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');
  const QS = [
    ['A machine does × 3, then + 2. Its rule is 3(n + 2).', 'FALSE'],
    ['A machine does + 2, then × 3. Its rule is 3(n + 2).', 'TRUE'],
    ['To find the input, undo the first step first.', 'FALSE'],
    ['The rule is 2n + 5 and the output is 17. The input is 6.', 'TRUE'],
    ['To undo × 3, you subtract 3.', 'FALSE'],
  ];
  const rowH = 0.56, gap = 0.12;
  QS.forEach(([q, v], i) => {
    const y = 1.56 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: CW - 1.35, h: rowH, rectRadius: 0.07, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.20, y, w: CW - 1.70, h: rowH, color: C.white, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, {
      x: RIGHT - 1.20, y, w: 1.20, h: rowH, color: v === 'TRUE' ? '5FCB92' : C.accent, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1,
      valign: 'middle', margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('Follow the boxes in order. To go backwards, undo the last step first, with the opposite.', {
    x: M, y: H - 0.66, w: CW, h: 0.40, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q4 SETTLES THE HOOK, and it is TRUE. Go back to the tally first. 19 − 4 = 15, then 15 ÷ 3 = 5, so A was right. B, 12, was taking both numbers off. C, 23, was adding 4 again.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: × 3 then + 2 is 3n + 2, not 3(n + 2); the brackets mean the adding came first. Q3 IS THE ONE TO WATCH: you undo the LAST step first, not the first. If the room splits on Q3, that is the first thing to reteach next lesson. Q5: the opposite of × is ÷, not −.\n\n'
    + 'Q2 IS TRUE ON PURPOSE, the mirror of Q1, so students see the two orders side by side: + 2 then × 3 IS 3(n + 2). Q4 checks: 2 × 6 + 5 = 17.\n\n'
    + 'THE CLOSING LINE IS THE LESSON IN ONE SENTENCE. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on, what they have just done (undoing the steps to find the unknown) is solving an equation, and next comes writing those steps as equations. Negative numbers and fractions, which the last lesson held back, appear only in the last game round today, so they are also open for the next lesson.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

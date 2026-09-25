/**
 * Y8 Maths, Algebra, Lesson 4: Putting numbers in (substitution). Class 8CN.
 * Single, 50 minutes. Maths track: 10 x 5.625 canvas, Number Revision palette.
 *
 * PREVIOUS: read from reference/Expand and Simplify.pptx (and its worksheet).
 * That deck ran 5+1+4+6+6+5+6+14+3 = 50 across nine slides, with no Answers
 * slide and no timers (it predates both), and the class used a separate
 * answers document. The class can collect like terms and expand brackets,
 * including a minus in front of a bracket. That deck already taught a
 * substitution CHECK (put x = 2 into both sides), so "first time they put a
 * number in" means the first time it is taught as a skill of its own.
 *
 * SHAPE. Standard archetype, Do Now at 5 minutes as taught last time:
 * Do Now 5, Today 1, Hook 2, I Do 6, I Do 6, We Do 5, Cold Call 6,
 * You Do 13, Answers 3, Plenary 3 = 50. The You Do is a GAME (Drill rounds,
 * on devices), because Chuka said "your call". The worksheet is still built
 * and is the fallback.
 *
 * THEY FOUND HARD: multiplying each term in the brackets by the outside
 * factor. In substitution it turns up as 2(n + 3) with n = 4 worked as
 * 2 x 4 + 3 = 11. So it is built in at: Do Now Q1 and Q5 (expanding), I Do 2
 * (with a check by expanding), We Do row 3, Cold Call Q5, five game
 * questions with their own feedback, worksheet Gold Q9 and Q10, Plenary Q4.
 *
 * AVOID: negative numbers and fractions. Every number, every intermediate
 * step and every answer is a positive whole number, and there is no division.
 *
 * Every number is checked in build/putting-numbers-in-check.py (sympy).
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
const { addTimer } = require('../lib/timer');
const PAL = THEME.PALETTES.maths;              // for the timer bar

const LESSON = 'Putting Numbers In';
const DATE = 'Monday 5 October 2026';
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
pptx.subject = 'Y8 Maths · Algebra · Lesson 4';

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

  const QS = [
    ['Expand 4(m + 3).', '4m + 12'],
    ['Simplify 6a + 5 + 2a + 3.', '8a + 8'],
    ['Work out 3 + 4 × 5.', '23'],
    ['Work out 2 × (6 + 3).', '18'],
    ['Expand 2(3k + 5).', '6k + 10'],
    ['State what 5y means.', '5 × y, which is 5 lots of y.'],
  ];
  const cw = (CW - 0.24) / 2, ch = 1.38, gap = 0.13;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = 1.02 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    s.addText(String(i + 1), {
      x: x + 0.18, y: y + 0.12, w: 0.40, h: 0.42, color: C.answer, fontFace: F.title, fontSize: 20, bold: true,
      valign: 'middle', margin: 0, objectName: `d${i}_n`,
    });
    s.addText(q, {
      x: x + 0.66, y: y + 0.10, w: cw - 0.86, h: 0.62, color: C.dark, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09, x: x + 0.18, y: y + 0.80, w: cw - 0.36, h: 0.44,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.2 }, color: C.dark, fontFace: F.body, fontSize: 12.5,
      bold: true, align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 5 minutes, as in Expand and Simplify. Six clicks, one answer each.\n\n'
    + 'I READ reference/Expand and Simplify.pptx. That lesson ran 50 minutes and taught expanding, collecting and a minus in front of a bracket. The Do Now here is NEW QUESTIONS, not those ones again, and it is all positive numbers and no fractions, as you asked.\n\n'
    + 'Q1 AND Q5 ARE THE BRACKET SKILL THAT THEY FOUND HARD: multiply each term by the number outside. Q1 is easy. Q5 puts a number in front of the letter inside, 2(3k + 5), so 2 × 3k = 6k and 2 × 5 = 10. Expect 6k + 5 from the ones who stop after the first term. Do not fix it by telling them: say "check again, does the 2 reach both terms?"\n\n'
    + 'Q3 AND Q4 ARE PLAIN NUMBER ARITHMETIC, chosen on purpose. Q3 is 3 + 4 × 5 = 23, and 35 is the wrong answer from adding first. Q4 has the brackets first. Both are the order of operations that today runs on, with no letters to hide behind.\n\n'
    + 'Q2 IS COLLECTING LIKE TERMS, lesson 1. Q6 IS PLANTED: 5y means 5 × y. Expect "5 plus y" from some. Say that no sign between a number and a letter means times. The idea that a number next to a letter is multiplication is the first thing today teaches.\n\n'
    + 'THE BRIEF SAYS THIS IS THE FIRST TIME THEY PUT A NUMBER IN. The last lesson did teach a substitution check (put x = 2 into both sides), so they have done it as a check. Today it is a skill in its own right, and you can say "you did this last week as a check, today it is the whole lesson".\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
{
  const s = newSlide(1);
  pill(s, 'Today', 1);
  title(s, 'Today’s goals');
  const GOALS = [
    'Substitute a positive integer into a one-step formula.',
    'Substitute into a two-step formula, respecting order of operations.',
    'Substitute into a formula with two different letters.',
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
  banner(s, 'A formula is a rule. Put the number in, then work it out.', { y: 3.68, h: 0.56, name: 'obj_banner' });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE OBJECTIVES ARE YOUR WORDING. "Positive integer" is on the slide because that is what the objective says, and it is what you asked for. Do not say "negative" or "fraction" out loud today: there is plenty to go wrong without them.\n\n'
    + '"SUBSTITUTE" IS THE NEW WORD. Say it means swap: "swap the letter for the number." It is the only new vocabulary in the lesson.\n\n'
    + 'THE BANNER IS THE WHOLE LESSON. Formula, number in, work it out.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = newSlide(2);
  pill(s, 'Hook', 2);
  title(s, 'Which one is right?');
  s.addText('A taxi costs £5, plus £3 for every kilometre. How much is a 4 km journey?', {
    x: M, y: 1.42, w: CW, h: 0.90, color: C.dark, fontFace: F.title, fontSize: 19, bold: true,
    valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'hook_q',
  });
  const OPTS = [['A', '£17'], ['B', '£32'], ['C', '£12']];
  const cw = (CW - 2 * 0.24) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.58, w: cw, h: 1.14, name: `h${i}` });
    s.addText(k, { x: x + 0.20, y: 2.72, w: 0.40, h: 0.36, color: C.answer, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.20, y: 3.10, w: cw - 0.40, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t` });
  });
  s.addText('Vote! We come back to this at the end.', {
    x: M, y: 3.96, w: CW, h: 0.32, color: C.soft, fontFace: F.body, fontSize: 11, italic: true, valign: 'middle', margin: 0, objectName: 'hook_foot',
  });
  s.addNotes(
    'HOOK. 2 minutes. Two clicks: the question, then the three options together.\n\n'
    + 'Take the vote and tally it on the board. Do not settle it. The Plenary settles it.\n\n'
    + 'ANSWER, FOR YOU: A. £5 + 3 × 4 = 5 + 12 = £17. B is £32, from (5 + 3) × 4: adding the £5 and the £3 first, then multiplying. C is £12, from forgetting the £5. B is the order-of-operations error and C is the "only did part of it" error. Both come back.\n\n'
    + 'THIS IS A TWO-STEP FORMULA IN WORDS. Cost = 3 × (number of km) + 5. Do not write it as a formula yet: the I Do slides do that.\n\n'
    + 'THE VOTE WILL SPLIT BETWEEN A AND B. That is useful. Ask a B voter to say what they did.'
  );
}

/* ================================================================== *
 * 4. I DO · 6 — put the number in (one-step and two-step)
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'I Do', 6);
  title(s, 'Put the number in');
  subtitle(s, 'Substitute means swap the letter for its number.');

  worked(s, {
    name: 'ea', x: M, y: 1.74, w: 5.00, h: 1.54, head: 'Find 4n when n = 3', lines: [
      [N('4'), L('n'), N('  =  4 × '), L('n')],
      [N('=  4 × '), V('3')],
      [V('=  12')],
    ],
  });
  worked(s, {
    name: 'eb', x: M, y: 3.40, w: 5.00, h: 1.98, head: 'Find 3n + 2 when n = 4', lines: [
      [N('3'), L('n'), N(' + 2  =  3 × '), L('n'), N(' + 2')],
      [N('=  3 × '), V('4'), N(' + 2')],
      [N('=  12 + 2'), ['     multiply first', C.soft]],
      [V('=  14')],
    ],
  });
  const rx = M + 5.15, rw = CW - 5.15;
  // The machine animation (generated: build/media/putting-numbers-in-machine.py). `cover` must be a
  // base64 data URI, not a path (CLAUDE.md, "Things that will bite you", 4).
  s.addMedia({
    type: 'video', path: MEDIA('putting-numbers-in-machine.mp4'),
    cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA('putting-numbers-in-machine.png')).toString('base64'),
    x: rx, y: 1.74, w: rw, h: rw * 9 / 16,
  });
  warn(s, '4n means 4 × n. It is not 43.', { x: rx, y: 1.74 + rw * 9 / 16 + 0.12, w: rw, h: 0.62, size: 12.5, name: 'wa' });
  warn(s, 'Multiply before you add.', { x: rx, y: 1.74 + rw * 9 / 16 + 0.86, w: rw, h: 0.56, size: 12.5, name: 'wb' });
  s.addNotes(
    'I DO. 6 minutes. Nine clicks: each line of working for the first example, each line for the second, then the two warnings. The machine on the right plays by itself when the slide opens.\n\n'
    + 'THE MACHINE (10 seconds). It shows the rule 3n + 2 working for n = 1, 2, 3 and 4: each number goes through "× 3" first and then "+ 2", and the answers build up along the bottom: 5, 8, 11, 14. It shows what words cannot: the same rule, in the same order, works for any number. Let it run while you read the title, then say "a formula is a machine, and today we put numbers in". You can click the video to play it again.\n\n'
    + 'EXAMPLE 1, 4n WHEN n = 3. Write 4n as 4 × n first, then swap: 4 × 3 = 12. The put-in number is brick red on the slide so the swap is visible. THE MISTAKE TO NAME: 43. A number next to a letter is multiplication, and there is nothing to join. That is the Do Now Q6.\n\n'
    + 'EXAMPLE 2, 3n + 2 WHEN n = 4. Write out the multiplication, swap, then do the multiplication BEFORE the addition: 12 + 2 = 14. Say it as "multiply before you add" every time. The wrong answer, 20, comes from (3 + 2) × 4, adding first. It is also the taxi question B from the Hook, so point at the tally.\n\n'
    + 'MODEL A THIRD ON THE BOARD in the same layout, with new numbers: 5n + 1 when n = 6 gives 5 × 6 + 1 = 31. Keep the colours, and make them say the three steps: write the multiplication, swap, work it out.\n\n'
    + 'IF THEY ARE QUICK: ask for 2 + 3n when n = 4. The plus comes first on the page, but the multiplication still comes first in the working: 2 + 12 = 14.'
  );
}

/* ================================================================== *
 * 5. I DO · 6 — brackets, and two letters
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'I Do', 6);
  title(s, 'Brackets, and two letters');
  subtitle(s, 'The number outside the bracket multiplies everything inside.');

  const cw = (CW - 0.24) / 2, x2 = M + cw + 0.24;
  worked(s, {
    name: 'ec', x: M, y: 1.74, w: cw, h: 1.98, head: 'Find 2(n + 3) when n = 4', size: 16, lines: [
      [N('2('), L('n'), N(' + 3)  =  2 × ('), L('n'), N(' + 3)')],
      [N('=  2 × ('), V('4'), N(' + 3)')],
      [N('=  2 × 7'), ['     brackets first', C.soft]],
      [V('=  14')],
    ],
  });
  worked(s, {
    name: 'ed', x: x2, y: 1.74, w: cw, h: 1.98, head: 'Find 3a + 2b when a = 5 and b = 4', size: 16, lines: [
      [N('3'), L('a'), N(' + 2'), L('b'), N('  =  3 × '), L('a'), N(' + 2 × '), L('b')],
      [N('=  3 × '), V('5'), N(' + 2 × '), V('4')],
      [N('=  15 + 8')],
      [V('=  23')],
    ],
  });
  // the check by expanding, which ties this to last lesson
  card(s, { x: M, y: 3.84, w: cw, h: 0.70, fill: 'FFFFFF', line: C.dark, name: 'chk' });
  s.addText('Check: 2(n + 3) = 2n + 6, and 2 × 4 + 6 = 14. Same answer.', {
    x: M + 0.18, y: 3.84, w: cw - 0.36, h: 0.70, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
    valign: 'middle', margin: 0, lineSpacing: 15, objectName: 'chk_t',
  });
  warn(s, 'The 2 multiplies both terms. 2 × 4 + 3 = 11 is wrong.', { x: M, y: 4.66, w: cw, h: 0.72, size: 11.5, name: 'wc' });
  warn(s, 'Each letter gets its own number. Do not swap them.', { x: x2, y: 3.84, w: cw, h: 0.70, size: 11.5, name: 'wd' });
  warn(s, 'ab means a × b. If a = 2 and b = 3, ab is 6, not 23.', { x: x2, y: 4.66, w: cw, h: 0.72, size: 11.5, name: 'we' });
  s.addNotes(
    'I DO. 6 minutes. Twelve clicks: each line of the bracket example, each line of the two-letter example, the check, then the three warnings.\n\n'
    + 'THE BRACKET EXAMPLE IS THE ONE THEY FOUND HARD. 2(n + 3) with n = 4. Swap first: 2 × (4 + 3). Then the brackets: 2 × 7 = 14. The 2 multiplies the WHOLE bracket, which is the same idea as expanding 2(n + 3) = 2n + 6, and the wrong answer, 11, comes from 2 × 4 + 3, where the 2 only reached the first term. That is exactly the mistake from Expand and Simplify, so say so: "same mistake, new lesson".\n\n'
    + 'THE CHECK LINE IS LAST LESSON, USED. Expand 2(n + 3) to get 2n + 6, then put n = 4 into that: 2 × 4 + 6 = 8 + 6 = 14. Both routes give 14. It is the substitution check from Expand and Simplify, and it now has a purpose: two different methods that agree.\n\n'
    + 'THE TWO-LETTER EXAMPLE IS OBJECTIVE 3. 3a + 2b with a = 5 and b = 4: 3 × 5 + 2 × 4 = 15 + 8 = 23. Each letter gets its own number, and it is easy to swap them: 3 × 4 + 2 × 5 = 22. If the letters are the wrong way round, you get a different answer, so it is worth writing the values next to the letters first: a = 5, b = 4.\n\n'
    + '"ab" MEANS a × b. If a = 2 and b = 3, ab is 6, and 23 is the joined-up mistake from the first I Do, back again with two letters.\n\n'
    + 'MODEL A SECOND BRACKET on the board: 3(n + 1) when n = 5. 3 × (5 + 1) = 3 × 6 = 18. Check by expanding: 3n + 3, so 15 + 3 = 18.\n\n'
    + 'IF THE ROOM IS STRUGGLING WITH BRACKETS, stop here and do three more together. The Cold Call can be cut down to Q1 to Q4.'
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
    ['When n = 2, 5n = 52', '5n means 5 × n. So 5 × 2 = 10.'],
    ['When n = 5, 4n + 3 = 7 × 5 = 35', 'Multiply first: 4 × 5 + 3 = 20 + 3 = 23.'],
    ['When n = 3, 5(n + 2) = 5 × 3 + 2 = 17', 'The 5 multiplies the whole bracket: 5 × (3 + 2) = 5 × 5 = 25.'],
    ['When a = 6 and b = 3, 2a + 4b = 2 × 3 + 4 × 6 = 30', 'Each letter gets its own number: 2 × 6 + 4 × 3 = 12 + 12 = 24.'],
  ];
  const rowH = 0.80, gap = 0.10;
  ROWS.forEach(([wrong, right], i) => {
    const y = 1.74 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.20, y, w: 4.10, h: rowH, color: C.dark, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.08, x: M + 4.45, y: y + 0.09, w: CW - 4.45 - 0.10, h: rowH - 0.18,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, lineSpacing: 15, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click. THEY MUST SAY WHAT THE STUDENT DID: "it is wrong" earns nothing.\n\n'
    + 'ROW 1: DIGITS JOINED. 5n is 5 × n, so 52 is the two digits stuck together.\n\n'
    + 'ROW 2: ADDED FIRST. 4 + 3 = 7, then × 5. The multiplication has to come first: 4 × 5 = 20, then + 3.\n\n'
    + 'ROW 3 IS THE ONE THEY FOUND HARD, the bracket. 5 × 3 + 2 lets the 5 reach only the first term. Ask them to check it a second way: expand 5(n + 2) = 5n + 10, then put in n = 3: 15 + 10 = 25. If they get 25 both ways, they have proved it to themselves.\n\n'
    + 'ROW 4: LETTERS SWAPPED. They used 3 for a and 6 for b, the wrong way round. Ask "how could you have avoided that?" and take "write a = 6, b = 3 first".\n\n'
    + 'IF THEY ARE QUICK, ask them to write a wrong answer for a partner to diagnose.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'Cold Call', 6);
  const QS = [
    ['Find n + 7 when n = 5.', '12'],
    ['Find 6n when n = 4.', '24'],
    ['Find 3n + 4 when n = 5.', '19'],
    ['Find 20 − 2n when n = 6.', '8'],
    ['Find 2(n + 5) when n = 3.', '16'],
    ['Find 4a + 3b when a = 2 and b = 5.', '23'],
  ];
  const cw = (CW - 0.24) / 2, ch = 1.28, gap = 0.13;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = 0.86 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    s.addText(String(i + 1), { x: x + 0.18, y: y + 0.10, w: 0.40, h: 0.42, color: C.answer, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `c${i}_n` });
    s.addText(q, { x: x + 0.66, y: y + 0.08, w: cw - 0.86, h: 0.58, color: C.dark, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `c${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09, x: x + 0.18, y: y + 0.74, w: cw - 0.36, h: 0.40,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.2 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Give thinking time, then ask for the working out loud: "what do you swap in, and what do you do first?" Students have no mini whiteboards, so the working is spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q2 is 6 × 4 = 24. Wrong answer 64.\n\n'
    + 'Q3 AND Q4 ARE OBJECTIVE 2, ORDER OF OPERATIONS. Q3 is 3 × 5 + 4 = 15 + 4 = 19; adding first gives 35. Q4 is 20 − 2 × 6 = 20 − 12 = 8. The wrong answer, 108, comes from (20 − 2) × 6. Every step stays positive: 20 − 12 is 8.\n\n'
    + 'Q5 IS THE BRACKET. 2 × (3 + 5) = 2 × 8 = 16. The wrong answer is 2 × 3 + 5 = 11. This is the mistake they found hard, so give it the longest wait.\n\n'
    + 'Q6 IS OBJECTIVE 3. 4 × 2 + 3 × 5 = 8 + 15 = 23. If the letters are swapped, 4 × 5 + 3 × 2 = 26.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6 and ask for a second bracket on the board. IF SHORT OF TIME, cut Q1 and Q2.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 13 — the game
 * ================================================================== */
{
  const s = newSlide(13);
  pill(s, 'You Do', 13);
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.25, y: 0.66, w: 1.25, h: 1.08, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, {
    x: M, y: 0.72, w: CW - 1.45, h: 0.70, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 1.44, w: CW - 1.45, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const ROUNDS = [
    ['ROUND 1', 'One-step formulas', 'Six questions. Swap the letter for the number.'],
    ['ROUND 2', 'Two steps and brackets', 'Multiply before you add. The number outside multiplies everything inside.'],
    ['ROUND 3', 'Two letters', 'Each letter gets its own number.'],
  ];
  const cw = (CW - 2 * 0.24) / 3;
  ROUNDS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.02, w: cw, h: 1.86, fill: 'FDF0EE', line: C.accent, name: `t${i}` });
    s.addText(n, { x: x + 0.20, y: 2.14, w: cw - 0.40, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.20, y: 2.46, w: cw - 0.40, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.20, y: 2.88, w: cw - 0.40, h: 0.90, color: C.soft, fontFace: F.body, fontSize: 11.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Finished? The worksheet is there too.', {
    x: M, y: 4.12, w: CW, h: 0.40, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 13 minutes. Four clicks. THIS LESSON\'S YOU DO IS A GAME, and the worksheet is the fallback.\n\n'
    + 'WHAT THEY DO. Open the file "Putting Numbers In game" from Google Classroom. Three rounds of six questions, each on their own device. They type an answer with the on-screen keypad or the keyboard, and press Check. A wrong answer says what the mistake probably was, in the same words as this deck, and shows the working. EVERY STUDENT GETS DIFFERENT NUMBERS AND A DIFFERENT ORDER, so a neighbour\'s answers are no use: Round 1 question 1 might be n + 7 with n = 5 for one student and 4 + t with t = 9 for another. The skills and their difficulty order are the same for everyone, so the end screen means the same thing for all of them. Each game has a six-character code, shown on the start and end screens. If a student says a question looked wrong, add #CODE to the end of the file\'s address and you will see exactly what they saw. There are no lives and no scores that punish slowness. At the end it shows what they got wrong by topic, not a single number.\n\n'
    + 'ROUNDS. Round 1 is one-step formulas and everyone should get it. Round 2 is two steps and brackets: three order-of-operations questions, then three bracket questions. Round 3 is two letters and gets harder, with two more bracket questions. About 4 minutes a round.\n\n'
    + 'THE BRACKET QUESTIONS ARE THE ONES THEY FOUND HARD: five of the eighteen. If a student\'s end screen says brackets, that is where to sit with them.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, or finishes early, or is absent, the worksheet is the fallback: the same ten skills in Bronze, Silver and Gold.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what did you swap in, and what did you do first?" AT 3 MINUTES REMAINING, stop them. The Answers slide is for the worksheet.'
  );
}

/* ================================================================== *
 * 9. ANSWERS · 3
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'Answers', 3);
  title(s, 'Worksheet answers');
  const ANS = require('./putting-numbers-in-answers');   // one list: the slide and the worksheet's upside-down block
  const cw = (CW - 0.24) / 2, rowH = 0.62, gap = 0.10;
  ANS.forEach(([n, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = 1.60 + row * (rowH + gap);
    card(s, { x, y, w: cw, h: rowH, name: `a${i}` });
    s.addText(n, { x: x + 0.18, y, w: 0.44, h: rowH, color: C.answer, fontFace: F.title, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `a${i}_n` });
    s.addText(a, { x: x + 0.70, y, w: cw - 0.88, h: rowH, color: C.dark, fontFace: F.body, fontSize: 11.5, valign: 'middle', margin: 0, lineSpacing: 14, objectName: `a${i}_t` });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. These are the WORKSHEET answers, questions 1 to 10 in order. The same ten answers are printed UPSIDE DOWN at the end of the worksheet, so students who use the paper can check it without the answers being readable across a desk. Students mark their own in a different colour. The game marks itself.\n\n'
    + 'Q1 TO Q4 ARE THE FIRST TWO OBJECTIVES. Q4 is 2 + 6 × 3 with the plus first on the page. Check who wrote 24, from (2 + 6) × 3.\n\n'
    + 'Q5 AND Q6 ARE BRACKETS AND SUBTRACTION. Q6 is 30 − 4 × 5 = 30 − 20 = 10; 130 is the wrong answer from (30 − 4) × 5.\n\n'
    + 'Q7 AND Q8 ARE TWO LETTERS. Q8 is the perimeter of a rectangle, 2(l + w).\n\n'
    + 'Q9 AND Q10 ARE THE BRACKET SKILL, THE ONE THEY FOUND HARD. Q9: the student wrote 3 × 4 + 2 = 14, but the 3 multiplies both terms. Q10 is the substitution check from last lesson: expand first (5n + 15), then put in n = 4 both ways. Both routes give 35.\n\n'
    + 'TAKE TWO OR THREE STUDENT ANSWERS to Q9 out loud. The explanation matters more than the number.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = newSlide(3, 'dark');
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');
  const QS = [
    ['When n = 3, 4n = 43.', 'FALSE'],
    ['When n = 4, 3n + 2 = 14.', 'TRUE'],
    ['When n = 2, 5 + 3n = 16.', 'FALSE'],
    ['When n = 3, 2(n + 4) = 10.', 'FALSE'],
    ['A taxi costs £5 plus £3 a kilometre. A 4 km journey costs £17.', 'TRUE'],
  ];
  const rowH = 0.56, gap = 0.13;
  QS.forEach(([q, v], i) => {
    const y = 1.66 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: CW - 1.35, h: rowH, rectRadius: 0.07, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.20, y, w: CW - 1.70, h: rowH, color: C.white, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, {
      x: RIGHT - 1.20, y, w: 1.20, h: rowH, color: v === 'TRUE' ? '5FCB92' : C.accent, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1,
      valign: 'middle', margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('Swap the letter for the number. Multiply before you add. The bracket multiplies everything inside.', {
    x: M, y: H - 0.66, w: CW, h: 0.40, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q5 SETTLES THE HOOK. Go back to the tally first. £5 + 3 × 4 = £17, so A was right. B, £32, was adding first; C, £12, forgot the £5.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: the joined digits, 43. The answer is 12. Q3: adding first, 16 from (5 + 3) × 2. The answer is 5 + 6 = 11. Q4 IS THE ONE TO WATCH, the bracket that they found hard. 2 × 3 + 4 = 10 is the wrong answer, and 2 × (3 + 4) = 2 × 7 = 14 is right. If the room splits on Q4, that is the first thing to reteach next lesson.\n\n'
    + 'Q2 IS TRUE ON PURPOSE, the same example as I Do 1, to give some students a clean win.\n\n'
    + 'THE CLOSING LINE IS THE THREE MISTAKES IN ONE SENTENCE. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on, negative numbers and fractions are the natural next step, since today was kept to positive whole numbers.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

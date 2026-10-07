/**
 * Y8 Maths, Algebra, Lesson 6: From A Table To A Rule. Class 8CN. Single, 50 minutes.
 * Maths track: 10 x 5.625 canvas, Number Revision palette.
 *
 * DATE: the date the deck was BUILT on (Tuesday 6 October 2026), not a guessed teaching day.
 *
 * PREVIOUS, per the brief: reference/Function Machines.pptx (Lesson 5). Read in full. Nine slides, 50 minutes
 * (5 + 1 + 2 + 6 + 6 + 5 + 6 + 16 + 3: the old shape, from before TEMPLATE.md). It taught: input and output of
 * a two-step function machine, the rule as a formula (a letter for the input: 4n - 3, and 4(n - 3) when the
 * first box is + or -), and working backwards by undoing the LAST step first with the opposite. Its plenary
 * made no promise. It named two possible next steps in its notes: solving equations, and negative numbers
 * and fractions. THE NOTATION CHANGES TODAY: last lesson used n for the input, today it is x for the input and
 * y for the output, as the brief asks ("keep it to y and x"). The notes say so out loud, and nothing in the
 * deck or the worksheet uses n as a letter. The brief also asks to avoid one particular two-word phrase for
 * a sequences idea: it appears nowhere in the deck, the notes, the worksheet or the checks.
 *
 * THEY FOUND HARD (brief): "Expand means 'multiplicative distribution'". I could not tell whether that is a
 * student's phrase or a note of what the class struggled with, so it is handled in the way that is right
 * either way: expanding is taught and retrieved in PLAIN words ("multiply EVERY term inside the bracket by the
 * number outside"), in the Do Now (Q3, an error to explain), the Cold Call (Q6), and the worksheet (Gold Q10 and
 * Q12, where an expanded bracket and a rule found from a table turn out to be the same rule). It is flagged in
 * the notes. That is an ASSUMPTION; correct it if the brief meant something else.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6,
 * You Do 14, Mark 3, Plenary 3. The Do Now is spaced (2 last lesson, 2 earlier in the unit, 1 another topic,
 * 1 preview). I Do 1 teaches objective 1 and ends by writing the rule as a formula (objective 2, which is
 * notation they already own from last lesson). I Do 2 teaches objective 3, the new idea: a rule that fits one
 * pair may fail another. The We Do is "Finish this one" (the last lesson in the unit used spot-the-mistake, and
 * the template says to alternate) and practises all three. The You Do is the WORKSHEET; no game was asked for.
 *
 * NOT RESOLVABLE FROM THE FILES: TEMPLATE.md asks for a closing line that says what the NEXT lesson does. The next
 * lesson is not known, so the Plenary repeats the banner instead. Change it once the next lesson is decided.
 *
 * Every number is checked in build/from-a-table-to-a-rule-check.py (sympy), which also reads them back out of the
 * finished deck and worksheet.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
const { addTimer } = require('../lib/timer');
const PAL = THEME.PALETTES.maths;              // for the timer bar

const LESSON = 'From A Table To A Rule';
const DATE = 'Tuesday 6 October 2026';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);

// House colours from the school's Number Revision deck (see examples/maths-deck-10x5.625.js).
const C = {
  dark: '2B2350', accent: 'EC6B58', answer: 'C0392B', card: 'F2F0F8', soft: '5E5A70',
  purple: '5B4FA0', green: '2E8B57', blue: '1F6FB2', white: 'FFFFFF', darkSoft: '3D3470', tintDeep: 'E1DDEF',
};
const F = { title: 'Georgia', body: 'Arial', mono: 'Courier New' };

const W = 10, H = 5.625;
const TIMER = { x: 0.20, y: 0.20, w: 0.34, h: H - 0.40 };
const M = 0.85, RIGHT = W - 0.45, CW = RIGHT - M;
const PILL_Y = 0.30, PILL_H = 0.32, TITLE_Y = 0.78, SUB_Y = 1.36;

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y8 Maths · Algebra · Lesson 6 · 8CN';

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
const title = (slide, text, mode, o = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: CW, h: 0.58, color: mode === 'dark' ? C.white : C.dark, fontFace: F.title, fontSize: o.size ?? 28,
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
/** One sentence, the key words underlined. parts = [[text, underline?], ...] */
function banner(slide, parts, o) {
  slide.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
    shape: S.roundRect, rectRadius: 0.08, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.56,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 }, color: C.white, fontFace: F.body,
    fontSize: o.size ?? 13.5, bold: true, align: 'center', valign: 'middle', margin: 0.08, objectName: o.name,
  });
}
/** A colour-coded line of algebra: runs in ONE text box. Arial, not Georgia (see function-machines.js). */
function expr(slide, o) {
  slide.addText(o.parts.map(([text, col]) => ({
    text, options: { color: col || C.dark, bold: true, fontFace: F.body, fontSize: o.size ?? 18 },
  })), { x: o.x, y: o.y, w: o.w, h: o.h ?? 0.34, align: o.align || 'left', valign: 'middle', margin: 0, objectName: o.name });
}
const N = (t) => [t, C.dark];       // operators, plain numbers
const L = (t) => [t, C.blue];       // a letter
const V = (t) => [t, C.answer];     // an answer
const SOFTT = (t) => [t, C.soft];

/** A worked example card: a header, then one line of working per click. */
function worked(slide, o) {
  card(slide, { x: o.x, y: o.y, w: o.w, h: o.h, name: o.name });
  slide.addText(o.head, {
    x: o.x + 0.20, y: o.y + 0.08, w: o.w - 0.40, h: 0.30, color: C.soft, fontFace: F.body, fontSize: 11.5,
    bold: true, valign: 'middle', margin: 0, objectName: `${o.name}_h`,
  });
  o.lines.forEach((parts, i) => expr(slide, {
    x: o.x + 0.22, y: o.y + 0.42 + i * (o.step ?? 0.36), w: o.w - 0.40, h: 0.34, size: o.size ?? 16, parts, name: `${o.name}_l${i}`,
  }));
}
/** A static two-row table of values: x on top, y underneath. Cells are shapes so it stays crisp. */
function xyTable(slide, o) {
  const lw = o.lw ?? 0.46, cw = o.cw ?? 0.62, ch = o.ch ?? 0.38;
  [['x', o.xs, C.blue, 'FFFFFF'], ['y', o.ys, C.answer, 'FDEEDC']].forEach(([lab, vals, col, fill], r) => {
    const y = o.y + r * (ch + 0.06);
    slide.addText(lab, { x: o.x, y, w: lw, h: ch, color: col, fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_${lab}_lab` });
    vals.forEach((v, i) => slide.addText(String(v), {
      shape: S.roundRect, rectRadius: 0.05, x: o.x + lw + 0.06 + i * (cw + 0.06), y, w: cw, h: ch,
      fill: { color: fill }, line: { color: C.tintDeep, width: 1 }, color: col, fontFace: F.body, fontSize: 15, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_${lab}${i}`,
    }));
  });
}
/** The answer cards used by the Do Now and the Cold Call. The number and the question share ONE vertical centre. */
function qGrid(s, o) {
  const cw = (CW - 0.24) / 2, ch = o.ch, gap = o.gap;
  o.qs.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = o.y0 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `${o.p}${i}` });
    const qy = y + 0.08, cy = qy + o.qh / 2;
    s.addText(String(i + 1), { x: x + 0.18, y: cy - 0.21, w: 0.40, h: 0.42, color: C.answer, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `${o.p}${i}_n` });
    s.addText(q, { x: x + 0.66, y: qy, w: cw - 0.86, h: o.qh, color: C.dark, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09, x: x + 0.18, y: y + ch - 0.52, w: cw - 0.36, h: 0.42,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.2 }, color: C.dark, fontFace: F.body, fontSize: o.asize ?? 12, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
  });
}
/** An animation. It starts ON CLICK (spec: effect "play"), so the teacher speaks first. */
const video = (s, file, x, y, w, h, name) => s.addMedia({
  type: 'video', path: MEDIA(`${file}.mp4`),
  cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'),
  x, y, w, h, objectName: name,
});

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = newSlide(10);
  pill(s, 'Do Now', 10);
  s.addText(LESSON, {
    x: 2.55, y: 0.16, w: 4.90, h: 0.62, color: C.dark, fontFace: F.title, fontSize: 26, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText(DATE, {
    x: RIGHT - 2.30, y: PILL_Y, w: 2.30, h: PILL_H, color: C.soft, fontFace: F.body, fontSize: 11,
    align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addShape(S.rect, { x: M, y: 0.86, w: CW, h: 0.035, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.02, ch: 1.38, gap: 0.13, qh: 0.72, size: 13, asize: 11.5, qs: [
    ['A machine subtracts 2, then multiplies by 6. Write its rule as a formula for y.', 'y = 6(x − 2)'],
    ['The rule is y = 3x − 4 and the output is y = 20. Find x.', '8. 20 + 4 = 24, then 24 ÷ 3.'],
    ['A student expands 5(x + 3) and gets 5x + 3. Explain the mistake and give the correct answer.', 'The 5 multiplies every term inside: 5x + 15.'],
    ['A pen costs x pence. Write an expression for the cost of 4 pens and a 30p ruler.', '4x + 30'],
    ['Work out 15% of 80.', '12. 10% is 8, 5% is 4, and 8 + 4.'],
    ['x = 1, 2, 3, 4 gives y = 3, 5, 7, 9. What do you notice about the y values?', 'They go up by 2 each time.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/Function Machines.pptx (the stated PREVIOUS lesson) and checked every question against the last three Do Nows in the class (Function Machines, Putting Numbers In, Expand and Simplify). Nothing repeats: no substitution of two letters, no "Expand 4(m + 3)", no "Work out 3 + 4 x 5", and the backwards question is on a new rule and a new output.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (the rule as a formula, with the brackets for "do this first"; working backwards). Q3 and Q4 are earlier in the unit (expanding a bracket; writing an expression from words). Q5 is from another topic (percentages). Q6 previews today and is not taught yet.\n\n'
    + 'THE LETTERS CHANGE TODAY. Last lesson the input was n. From today it is x for the input and y for the output. Q1 and Q2 already use them: say "x is the input, y is the output, same machine, new letters" and move on.\n\n'
    + 'Q1: subtract 2 first, so the brackets: y = 6(x − 2). Wrong: y = 6x − 2 (the OTHER machine). Q2: undo the last step first: 20 + 4 = 24, then 24 ÷ 3 = 8. Check: 3 × 8 − 4 = 20.\n'
    + 'Q3 IS THE ONE YOU FLAGGED AS HARD, SO IT IS AN ERROR TO EXPLAIN, IN PLAIN WORDS. The student has multiplied only the first term. Take "the 5 multiplies EVERY term inside the bracket" from the room: it is the whole idea, and it is what the brief called "multiplicative distribution". If you meant something different by that phrase, say so and the lesson can change: the notes below do not use the long phrase, because the students will not meet it in an exam.\n'
    + 'Q4: 4 pens cost 4 × x = 4x, plus 30, so 4x + 30. Watch for 4x + 30x or 430x (the 30 attached to the x), and for 34x. It is the same move as writing a rule from words, with money. Q5: 10% of 80 is 8, 5% is half of that, 4, so 12.\n'
    + 'Q6 IS INTUITIVE. Accept "they go up by 2", "add 2" or "it is the odd numbers". It is the first step of finding a rule from a table, which is the whole lesson. Do not teach it. Say "we will find out how to turn that into a rule".\n\n'
    + 'THEY FOUND HARD: "Expand means \'multiplicative distribution\'". I read that as the class finding expanding hard, and used plain words. That is an assumption.\n\n'
    + 'CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = newSlide(1);
  pill(s, 'Today', 1);
  title(s, 'Objectives');
  const GOALS = [
    'Find the rule for a linear function from a table of values.',
    'Write the rule as a formula.',
    'Check a rule against a second pair of values.',
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
  banner(s, [['Find the ', false], ['multiplier', true], [', then the number added, and ', false], ['check', true], [' with another pair.', false]], { y: 3.68, h: 0.56, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING, in the order the lesson teaches them: I Do 1 finds the rule and writes it as a formula (objectives 1 and 2), I Do 2 checks it (objective 3).\n\n'
    + 'ONE NEW WORD: LINEAR. A linear function is one where y goes up by the SAME amount every time x goes up by 1. That is the thing to look for in a table. Say it plainly: "linear means the y values go up by the same step each time". They will meet the graph of one later; today it is a table and a formula only.\n\n'
    + 'LAST LESSON WAS A MACHINE WITH A LETTER, n. TODAY THE LETTERS ARE x AND y: x is the input and y is the output. Say it here once: "same machine, new letters". The formula still reads like last lesson\'s: y = 4x − 3 is "multiply by 4, then subtract 3".\n\n'
    + 'THE BANNER IS THE LESSON: find the multiplier, then the number added, then check with another pair. Say it twice, because it is also the method.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = newSlide(2);
  pill(s, 'Hook', 2);
  title(s, 'Which one is right?');
  s.addText('A machine has a secret rule. It turns 1 into 5, 2 into 8 and 3 into 11. What does it turn 10 into?', {
    x: M, y: 1.42, w: CW, h: 0.90, color: C.dark, fontFace: F.title, fontSize: 19, bold: true,
    valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'hook_q',
  });
  const OPTS = [['A', '14'], ['B', '50'], ['C', '32']];
  const cw = (CW - 2 * 0.24) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.58, w: cw, h: 1.14, name: `h${i}` });
    s.addText(k, { x: x + 0.20, y: 2.72, w: 0.40, h: 0.36, color: C.answer, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.20, y: 3.10, w: cw - 0.40, h: 0.48, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Two clicks: the question, then the three options together.\n\n'
    + 'Take a show of hands for each option and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 1 settles it, pointing at the tally.\n\n'
    + 'ANSWER, FOR YOU: C, 32. The rule is y = 3x + 2: 3 × 10 + 2 = 32. A (14) comes from "add 4" (1 + 4 = 5), and B (50) from "multiply by 5" (5 × 1 = 5). BOTH of those rules fit the FIRST pair, 1 into 5, and fail the second, 2 into 8: 2 + 4 = 6 and 5 × 2 = 10. That is today\'s third objective in one puzzle, and I Do 2 returns to it. Expect many votes for B, and some for A: the first pair is the obvious one to use.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md), so do not tell them. Ask "what did you do?" and let them say "I used the first pair" or "I saw it goes up by 3". Either is today\'s lesson said by a student.\n\n'
    + 'DO NOT WRITE THE RULE YET. Say "we will find it, and then we will check it".'
  );
}

/* ================================================================== *
 * 4. I DO · 3: find the rule from a table (objective 1), write it as a formula (objective 2)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Find the rule from a table');
  subtitle(s, 'The y values go up by the same step each time.');
  xyTable(s, { name: 'tb', x: M, y: 1.76, xs: [1, 2, 3, 4], ys: [5, 8, 11, 14] });
  worked(s, {
    name: 'ea', x: M, y: 2.72, w: 4.50, h: 2.62, size: 15, step: 0.37, head: 'Find the multiplier, then the number added.', lines: [
      [L('x'), N(' goes up by 1. '), L('y'), N(' goes up by 3.')],
      [N('So the rule multiplies '), L('x'), N(' by 3.')],
      [N('3 × 1 = 3, but '), L('y'), N(' is 5. Add '), V('2'), N('.')],
      [L('y'), N(' = 3'), L('x'), N(' + 2')],
      [N('Hook: '), L('x'), N(' = 10 gives 3 × 10 + 2 = '), V('32')],
    ],
  });
  const vx = M + 4.65, vw = RIGHT - vx, vh = vw * 540 / 960;
  video(s, 'from-a-table-to-a-rule-table', vx, 1.76, vw, vh, 'vid_table');
  banner(s, [['Multiplier', true], [' first, then the number ', false], ['added', true], ['.', false]], { x: vx, y: 1.76 + vh + 0.16, w: vw, h: 0.56, size: 12.5, name: 'ea_banner' });
  s.addNotes(
    'I DO. 3 minutes. Seven clicks: the five lines, the animation (ON CLICK, so say the idea first), then the banner.\n\n'
    + 'OBJECTIVE 1, THEN THE FORMULA (OBJECTIVE 2). The table is the Hook\'s: x = 1, 2, 3, 4 and y = 5, 8, 11, 14. THE METHOD IS TWO QUESTIONS. (1) How much does y go up each time x goes up by 1? Here 3, so the rule multiplies x by 3. (2) What is left over? 3 × 1 = 3 but y is 5, so ADD 2. Line 4 writes it as a formula, y = 3x + 2, which they know from last lesson with a new pair of letters: x is the input and y is the output. Line 5 SETTLES THE HOOK, POINTING AT THE TALLY: 3 × 10 + 2 = 32, so C.\n\n'
    + 'THE ANIMATION (about 22 seconds) does the same thing slowly and PAUSES at every step: the +1 arrows appear one at a time above the x row, then the +3 arrows under the y row; a row of 3x appears one cell at a time (3, 6, 9, 12); the gaps between 3x and y are marked, each "+ 2"; then the formula is written and the last pair is checked: 3 × 4 + 2 = 14. Talk over the pauses. You can click it to play it again. The check at the end is a PREVIEW of I Do 2: do not stop to teach it here.\n\n'
    + 'THE GAP TO LOOK FOR IS THE SAME EACH TIME. If the gaps between 3x and y are 2, 2, 2, 2 the multiplier is right; if they change, it is not. That is the quick check that the multiplier is correct, and it also shows why a table has to be LINEAR for this method.\n\n'
    + 'MODEL A SECOND ON THE BOARD, WITH A SUBTRACTION: x = 1, 2, 3, 4 and y = 2, 7, 12, 17. y goes up by 5, so × 5. 5 × 1 = 5 but y is 2, so SUBTRACT 3: y = 5x − 3. (This is We Do row 2.)\n\n'
    + 'THE MISTAKES TO NAME, said out loud: (1) using the y values themselves as the multiplier (the first y is 5, so "5x"); (2) saying the multiplier is the first y value minus the first x value; (3) forgetting to find the number added at all, and stopping at y = 3x. The cure for all three is the CHECK, which is I Do 2.\n\n'
    + 'THE NOTATION: the I Do 1 formula uses y and x, never n. IF THEY ARE QUICK: ask for the rule for x = 0, 1, 2, 3 and y = 4, 7, 10, 13 (y = 3x + 4), and what the number added is when x is 0.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: check the rule against another pair (objective 3)
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'I Do', 3);
  title(s, 'Check the rule against another pair');
  subtitle(s, 'The table: x = 1, 2, 3 and y = 5, 8, 11. Three students found a rule each.');
  const CARDS = [
    ['ck0', 'y = x + 4', [['Pair (1, 5): 1 + 4 = 5', 'fits', C.green], ['Pair (2, 8): 2 + 4 = 6', 'fails', C.answer]], 'Fails', C.answer, 'FDF0EE'],
    ['ck1', 'y = 5x', [['Pair (1, 5): 5 × 1 = 5', 'fits', C.green], ['Pair (2, 8): 5 × 2 = 10', 'fails', C.answer]], 'Fails', C.answer, 'FDF0EE'],
    ['ck2', 'y = 3x + 2', [['Pair (1, 5): 3 × 1 + 2 = 5', 'fits', C.green], ['Pair (2, 8): 3 × 2 + 2 = 8', 'fits', C.green], ['Pair (3, 11): 3 × 3 + 2 = 11', 'fits', C.green]], 'Fits every pair', C.green, 'EAF6EF'],
  ];
  const g = 0.20, cw = (CW - 2 * g) / 3;
  CARDS.forEach(([k, rule, lines, verdict, vcol, fill], i) => {
    const x = M + i * (cw + g), y0 = 1.78;
    card(s, { x, y: y0, w: cw, h: 2.74, fill, line: vcol, name: k });
    s.addText(rule, { x: x + 0.18, y: y0 + 0.10, w: cw - 0.36, h: 0.46, color: C.dark, fontFace: F.body, fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `${k}_rule` });
    lines.forEach(([work, res, col], j) => {
      s.addText([{ text: work + '   ', options: { color: C.dark } }, { text: res, options: { color: col, bold: true } }], {
        x: x + 0.18, y: y0 + 0.64 + j * 0.46, w: cw - 0.36, h: 0.42, fontFace: F.body, fontSize: 11.5, valign: 'middle', margin: 0, lineSpacing: 14, objectName: `${k}_l${j}`,
      });
    });
    s.addText(verdict, {
      shape: S.roundRect, rectRadius: 0.08, x: x + 0.18, y: y0 + 2.74 - 0.60, w: cw - 0.36, h: 0.42, fill: { color: vcol }, line: { color: vcol, width: 0 },
      color: C.white, fontFace: F.body, fontSize: 13, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${k}_v`,
    });
  });
  banner(s, [['Check', true], [' with a pair you ', false], ['did not use', true], [' to find the rule.', false]], { y: 4.74, h: 0.56, name: 'ck_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the three cards, one at a time, then the banner.\n\n'
    + 'OBJECTIVE 3 ONLY, per TEMPLATE.md. THIS IS THE NEW IDEA, so it has its own slide. A rule found from one pair of values can fit that pair and still be wrong. The only way to know is to test it on a pair you did NOT use to find it. The table is the Hook\'s (x = 1, 2, 3; y = 5, 8, 11).\n\n'
    + 'CARD 1, y = x + 4: it fits the first pair (1 + 4 = 5), so a student who stops there is happy. The second pair, (2, 8), gives 2 + 4 = 6, not 8. It FAILS. CARD 2, y = 5x: also fits the first pair (5 × 1 = 5), and also fails the second (5 × 2 = 10). CARD 3, y = 3x + 2: it fits the first, the second (3 × 2 + 2 = 8) and the third (3 × 3 + 2 = 11). Say "one pair that fits is not enough; every pair has to fit".\n\n'
    + 'POINT BACK AT THE HOOK. Option A (14) was card 1 at x = 10 (10 + 4) and option B (50) was card 2 at x = 10 (5 × 10): the wrong votes came from rules that only fit the first pair. Option C (32) was card 3. Say "if you voted A or B, you found a rule from one pair and did not check it".\n\n'
    + 'WHY IT WORKS (say this): a linear rule is one multiplier and one number added. The first pair gives you ONE fact about them; the second pair gives you another. One fact cannot pin down two unknowns, so more than one rule fits the first pair. It is exactly like last lesson\'s check on a backwards question: put the answer back in. Link to it: "every question last lesson could be checked, and so can every rule today".\n\n'
    + 'A CHECK THAT PASSES IS NOT A PROOF, but with a straight-line pattern, two pairs that agree (the pair you used and one you did not) is enough for today. If a student asks, say the proof comes later.\n\n'
    + 'THE MISTAKE TO NAME: checking with the SAME pair you used to find the rule. It always works, so it checks nothing. Use the last pair in the table.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: "Finish this one" (objectives 1, 2 and 3)
 * ================================================================== */
{
  const s = newSlide(5);
  pill(s, 'We Do', 5);
  title(s, 'What is the missing step?');
  subtitle(s, 'Finish this one.');
  const HEADS = ['TABLE', 'MULTIPLIER, THEN ADD', 'FORMULA', 'CHECK'];
  const mono = (xs, ys) => `x   ${xs.map((v) => String(v).padStart(2)).join('  ')}\ny   ${ys.map((v) => String(v).padStart(2)).join('  ')}`;
  /* [text] given, or ['?', answer] missing */
  const ROWS = [
    [[mono([1, 2, 3, 4], [4, 6, 8, 10])], ['× 2, then + 2'], ['y = 2x + 2'], ['?', 'x = 4: 2 × 4 + 2 = 10. It fits.']],
    [[mono([1, 2, 3, 4], [2, 7, 12, 17])], ['?', '× 5, then − 3'], ['?', 'y = 5x − 3'], ['x = 3: 5 × 3 − 3 = 12. It fits.']],
    [[mono([2, 4, 6, 8], [7, 11, 15, 19])], ['?', '× 2, then + 3'], ['?', 'y = 2x + 3'], ['?', 'x = 6: 2 × 6 + 3 = 15. It fits.']],
  ];
  const WIDTHS = [2.40, 1.95, 1.70, 1.95], g = (CW - WIDTHS.reduce((a, b) => a + b, 0)) / 3;
  const xs = WIDTHS.map((_, j) => M + WIDTHS.slice(0, j).reduce((a, b) => a + b, 0) + j * g);
  const HY = 1.70, RY = 1.98, rowH = 0.92, rowG = 0.10;
  HEADS.forEach((h, j) => s.addText(h, { x: xs[j], y: HY, w: WIDTHS[j], h: 0.24, color: C.soft, fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1, align: 'center', valign: 'middle', margin: 0, objectName: `wf_h${j}` }));
  ROWS.forEach((row, i) => {
    const y = RY + i * (rowH + rowG);
    row.forEach((cell, j) => {
      const x = xs[j], w = WIDTHS[j];
      const missing = cell[0] === '?';
      const isTable = j === 0;
      s.addText(missing ? '?' : cell[0], {
        shape: S.roundRect, rectRadius: 0.07, x, y, w, h: rowH, fill: { color: missing ? C.card : C.white }, line: { color: missing ? C.dark : C.tintDeep, width: missing ? 1.6 : 1.2, dashType: missing ? 'dash' : 'solid' },
        color: missing ? C.dark : C.dark, fontFace: missing ? F.title : (isTable ? F.mono : F.body), fontSize: missing ? 22 : (isTable ? 12 : 12.5), bold: missing || isTable, align: 'center', valign: 'middle', margin: 6, lineSpacing: isTable ? 18 : 15, objectName: `wf${i}_${j}_q`,
      });
      if (missing) s.addText(cell[1], { shape: S.roundRect, rectRadius: 0.07, x, y, w, h: rowH, fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.4 }, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true, align: 'center', valign: 'middle', margin: 6, lineSpacing: 14.5, objectName: `wf${i}_${j}_a` });
      if (j < 3) s.addText('→', { x: x + w, y: y + rowH / 2 - 0.16, w: g, h: 0.32, color: C.accent, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `wf${i}_${j}_arrow` });
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Three clicks, one per row. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked tables, and the class supplies the missing steps. The last lesson in the unit used spot-the-mistake, and the template says to alternate. It practises all three objectives: the multiplier and the number added (objective 1), the formula (objective 2), and the check (objective 3).\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL. Ask each pair to agree the missing step and say it, then click. ASK WHAT THEY DID, not just the answer: "how did you get the multiplier?" Naming the step is the point, and it is the same move as explaining a worked step.\n\n'
    + 'ROW 1, ONE MISSING: the check. The table is x = 1, 2, 3, 4 and y = 4, 6, 8, 10: y goes up by 2, so × 2, and 2 × 1 = 2 but y is 4, so + 2: y = 2x + 2. The missing step is the check: use a pair you did not use to find the rule. x = 4: 2 × 4 + 2 = 10. It fits. If anyone checks with x = 1, say it works by definition and checks nothing.\n\n'
    + 'ROW 2, TWO MISSING: the multiplier and the formula. x = 1, 2, 3, 4 and y = 2, 7, 12, 17 (the model from I Do 1): y goes up by 5, so × 5, and 5 × 1 = 5 but y is 2, so SUBTRACT 3: y = 5x − 3. The check is given: x = 3: 5 × 3 − 3 = 12.\n\n'
    + 'ROW 3, THREE MISSING, AND THE STRETCH: the x values go up by 2, not 1. y = 7, 11, 15, 19: y goes up by 4 when x goes up by 2, so it goes up by 2 for each 1 (4 ÷ 2). The multiplier is 2. THEN the number added: 2 × 2 = 4 (use the FIRST pair, x = 2, not 1) and y is 7, so + 3: y = 2x + 3. Check with x = 6: 2 × 6 + 3 = 15. THIS IS THE ROW THAT CATCHES "the multiplier is 4" (the gap in y without dividing by the gap in x). Give it the longest wait.\n\n'
    + 'THE EXPAND CONNECTION, if there is time: ask "a machine adds 1, then multiplies by 2: what is its rule?" (y = 2(x + 1)). Then "expand it" (y = 2x + 2). That is row 1\'s rule: the same rule in two forms. Say "expand means multiply every term inside the bracket by the number outside".\n\n'
    + 'IF THEY ARE QUICK, ask them to make up a table for a partner to find the rule of. IF SHORT OF TIME, do rows 2 and 3 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = newSlide(6);
  pill(s, 'Cold Call', 6);
  qGrid(s, { p: 'c', y0: 0.86, ch: 1.44, gap: 0.10, qh: 0.84, size: 13, asize: 11.5, qs: [
    ['x goes up by 2 and y goes up by 10. State the multiplier.', '5. 10 ÷ 2.'],
    ['Write “multiply by 6, then subtract 2” as a formula, using y and x.', 'y = 6x − 2'],
    ['A rule is y = 2x + 5. A student checks it with x = 3 and y = 12. Does it fit?', 'No. 2 × 3 + 5 = 11, not 12.'],
    ['x goes up by 1 and y goes up by 4. When x = 1, y = 7. Write the rule as a formula.', 'y = 4x + 3. 4 × 1 = 4, and 7 − 4 = 3.'],
    ['A machine does × 4, then + 6. The output is 30. Find the input.', '6. 30 − 6 = 24, then 24 ÷ 4.'],
    ['Expand 3(x − 4).', '3x − 12. Both terms get multiplied by 3.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Give thinking time, then ask for the working out loud: "which step do you do first, and why?" Students have no mini whiteboards, so the working is spoken.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (working backwards, from Function Machines; a new rule and a new output) and Q6 (expanding a bracket, from the expand lessons, and the topic you flagged as hard).\n\n'
    + 'Q1 IS OBJECTIVE 1, THE STRETCH: the gap in x is 2, so 10 ÷ 2 = 5. Wrong: 10. Ask "how much does y go up when x goes up by ONE?". Q2 IS OBJECTIVE 2: multiply first, then subtract, so y = 6x − 2. Wrong: y = 6(x − 2). Q3 IS OBJECTIVE 3: 2 × 3 + 5 = 11, but y is 12, so it does not fit. Ask "so is the rule right?" (no: one pair that fails is enough to show a rule is wrong). Q4 PUTS OBJECTIVES 1 AND 2 TOGETHER: the multiplier is 4, 4 × 1 = 4, and 7 − 4 = 3, so y = 4x + 3.\n\n'
    + 'Q5: undo the last step first: 30 − 6 = 24, then 24 ÷ 4 = 6. Check: 4 × 6 + 6 = 30. Q6: 3 × x = 3x and 3 × (−4) = −12, so 3x − 12. THE COMMON MISTAKE IS 3x − 4: the 3 has multiplied the first term only. Ask for "what did the 3 multiply?" and take "everything inside".\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q1 and Q3 and ask them to write a table of their own. IF SHORT OF TIME, cut Q5.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14: the worksheet
 * ================================================================== */
{
  const s = newSlide(14);
  pill(s, 'You Do', 14);
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.25, y: 0.66, w: 1.25, h: 1.08, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.72, w: CW - 1.45, h: 0.70, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 1.44, w: CW - 1.45, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const TIERS = [
    ['BRONZE', 'Find the rule', 'Tables where x goes up by 1. Read the worked example, finish the half-worked one, then do your own.', 'EEEAF8'],
    ['SILVER', 'Bigger steps', 'x goes up by 2 or more. Check a student’s rule that only fits one pair.', 'FDF0EE'],
    ['GOLD', 'Brackets and real life', 'Expand a bracket and find the same rule from a table. Work backwards. Where is this used?', 'F6D9D4'],
  ];
  const cw = (CW - 2 * 0.24) / 3;
  TIERS.forEach(([n, head, body, fill], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.02, w: cw, h: 1.86, fill, line: C.accent, name: `t${i}` });
    s.addText(n, { x: x + 0.20, y: 2.14, w: cw - 0.40, h: 0.30, color: C.answer, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.20, y: 2.46, w: cw - 0.40, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.20, y: 2.88, w: cw - 0.40, h: 0.90, color: C.soft, fontFace: F.body, fontSize: 11.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `t${i}_b` });
  });
  s.addText('Choose a tier. The questions are mixed on purpose: you have to decide which method each one needs.', {
    x: M, y: 4.12, w: CW, h: 0.50, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note. THE WORKSHEET IS THE TASK. There is no game today.\n\n'
    + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md). Each tier opens with a fully worked example, then a half-worked one, then blanks. BRONZE: tables where x goes up by 1, a formula from words, a substitution, and a check. SILVER: tables where x goes up by 2 or more (the multiplier is the gap in y divided by the gap in x), a "why does that step work?" prompt on exactly that division (Q8), and a student\'s rule that only fits the first pair (Q9). GOLD: an expanded bracket and a rule found from a table turning out to be the same rule (Q10), a harder table (Q11), two rules that look alike but are not (Q12), "where would you meet this outside the lesson?" (Q13), and working backwards (Q14). AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student. The class has found maths easy before, so Gold goes past the lesson on purpose.\n\n'
    + 'THE QUESTIONS ARE MIXED ON PURPOSE (interleaved): a table, then a formula from words, then a substitution, then a check, so each one needs a decision about which method. The sheet says so. It feels harder and is meant to.\n\n'
    + 'THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "how much does y go up when x goes up by ONE?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
  );
}

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
{
  const s = newSlide(3);
  pill(s, 'Mark', 3);
  s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 0.74, w: CW, h: 0.96, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title' });
  card(s, { x: M, y: 1.86, w: CW, h: 2.74, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.24, y: 1.96, w: CW - 0.48, h: 0.30, color: C.soft, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'You found the multiplier first, then the number added.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'When x went up by more than 1, you divided the gap in y by the gap in x.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'You checked with a pair you did not use to find the rule.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Write the correct answer next to anything wrong. Do not rub it out.', options: { bullet: true } },
  ], { x: M + 0.24, y: 2.32, w: CW - 0.48, h: 2.16, color: C.dark, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'THE ANSWERS ARE PRINTED UPSIDE DOWN at the foot of the worksheet\'s last page. Most are exact (the rules, the check values, the inputs); Q8 (why divide by the gap in x), Q12 (two rules that look alike) and Q13 (where would you meet this) say what a good answer contains. Q9 and Q12 are the two that teach the lesson\'s idea: a rule that fits one pair can still be wrong, and a bracket is not the same as its first term.\n\n'
    + 'WALK ROUND reading for the commonest mistake: a multiplier that is the gap in y with no division by the gap in x (Q7, Q11). If someone has made it, ask "how much does y go up when x goes up by ONE?" and let them find it themselves.'
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
    ['The table x = 1, 2, 3 and y = 4, 7, 10 gives the rule y = 3x + 1.', 'TRUE'],
    ['A rule that fits the first pair of values must be the right rule.', 'FALSE'],
    ['x goes up by 2 and y goes up by 6, so the multiplier is 6.', 'FALSE'],
    ['When x goes up by 1 and y goes up by 5, the rule starts y = 5x.', 'TRUE'],
    ['y = 2(x + 3) and y = 2x + 3 are the same rule.', 'FALSE'],
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
  s.addText('Find the multiplier, then the number added, and check with another pair.', {
    x: M, y: H - 0.66, w: CW, h: 0.40, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): it is a table, not a definition. y goes up by 3, 3 × 1 = 3 and y is 4, so + 1: y = 3x + 1. Check x = 3: 3 × 3 + 1 = 10, so it is TRUE. Ask them to say the check out loud.\n'
    + 'Q2 IS THE LESSON\'S MISCONCEPTION AND OBJECTIVE 3: a rule that fits one pair can fail the next. Point back at the Hook: A (add 4) and B (multiply by 5) both fit the first pair. It is FALSE.\n'
    + 'Q3 IS THE MULTIPLIER MISTAKE: the gap in x is 2, so the multiplier is 6 ÷ 2 = 3, not 6. FALSE. If the room splits on it, that is the first thing to reteach next lesson.\n'
    + 'Q4 IS THE MIRROR, TRUE ON PURPOSE: when x goes up by 1, the multiplier is exactly the gap in y, so the rule starts y = 5x (and then you find the number added).\n'
    + 'Q5 IS THE EXPAND MISTAKE, in a form that matters here: 2(x + 3) = 2x + 6, not 2x + 3, so they are different rules. FALSE. Ask "what did the 2 multiply?" and take "everything inside the bracket".\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER. TEMPLATE.md asks for what the NEXT lesson does, and the next lesson is not known, so it is not guessed: CHANGE THIS LINE once you have decided it. If you want to lead on: the rule gives a graph, and the check with a second pair becomes "is the point on the line?". That is a suggestion, not a promise made on the slide.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

/**
 * Y8 Algebra, Lesson 3: expand and simplify.
 *
 * Built to match Number_Revision.pptx, which is the Year 8 maths house style:
 * canvas 10 x 5.625 (pptxgenjs DEFAULT 16:9, not LAYOUT_WIDE), palette and
 * fonts lifted from its slide XML, card geometry measured off its rendered
 * Do Now slide. A second maths deck should look like the first one.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const C = {
  dark:   '2B2350',   // navy — titles, pills, question text
  accent: 'E85D4A',   // coral — badges
  answer: 'C0392B',   // brick red — revealed answers
  card:   'F2F0F8',   // lavender card fill
  soft:   '5E5A70',   // grey — instruction lines
  purple: '5B4FA0',
  green:  '2E8B57',   // the "a" terms
  blue:   '1F6FB2',   // the "b" terms
  white:  'FFFFFF',
};
const F = { title: 'Georgia', body: 'Arial' };

const W = 10, H = 5.625;
const M = 0.60;
const PILL_Y = 0.30, PILL_H = 0.32;
const TITLE_Y = 0.80;
const SUB_Y = 1.42;
const DATE = 'Friday 18 September 2026';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Chuka';
pptx.title = 'Expand and Simplify';
pptx.subject = 'Y8 Maths · Algebra · Lesson 3 of 3';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

/* ---------------- furniture ---------------- */
function pill(slide, label) {
  const text = label.toUpperCase();
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.14,
    x: M, y: PILL_Y, w: Math.max(1.35, 0.098 * text.length + 0.38), h: PILL_H,
    fill: { color: C.dark }, color: C.white,
    fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
}
const title = (slide, text) => slide.addText(text, {
  x: M, y: TITLE_Y, w: W - 2 * M, h: 0.58,
  color: C.dark, fontFace: F.title, fontSize: 30, bold: true,
  valign: 'middle', margin: 0, objectName: 'slide_title',
});
const subtitle = (slide, text) => slide.addText(text, {
  x: M, y: SUB_Y, w: W - 2 * M, h: 0.26,
  color: C.soft, fontFace: F.body, fontSize: 10.5,
  valign: 'middle', margin: 0, objectName: 'slide_sub',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06,
    fill: { color: o.fill || C.card },
    line: { color: o.line || o.fill || C.card, width: o.line ? 1.4 : 0 },
    objectName: `${o.name}_bg`,
  });
}
function badge(slide, o) {
  slide.addShape(S.ellipse, {
    x: o.x, y: o.y, w: 0.38, h: 0.38,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    objectName: `${o.name}_badge`,
  });
  slide.addText(String(o.n), {
    x: o.x, y: o.y, w: 0.38, h: 0.38,
    color: C.white, fontFace: F.body, fontSize: 10.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num`,
  });
}

/**
 * A colour-coded algebraic expression.
 *
 * Terms are separate runs in ONE text box, so pptxgenjs handles the spacing
 * and nothing has to be positioned by hand. Colour is the whole teaching
 * device here: like terms share a colour, so "which ones go together" is
 * answered by looking before it is answered by thinking.
 */
function expr(slide, o) {
  slide.addText(o.parts.map(([text, col]) => ({
    text,
    options: { color: col || C.dark, bold: true, fontFace: F.title, fontSize: o.size ?? 20 },
  })), {
    x: o.x, y: o.y, w: o.w, h: o.h ?? 0.46,
    align: o.align || 'left', valign: 'middle', margin: 0,
    objectName: o.name,
  });
}
const A = (t) => [t, C.green];      // the a-terms
const B = (t) => [t, C.blue];       // the b-terms
const N = (t) => [t, C.dark];       // operators and plain numbers
const R = (t) => [t, C.answer];     // answers

/* ------------------------------------------------------------------ *
 * The Do Now template, copied from the edited Into The Lab deck:
 * pill left, lesson title centred, date right, an accent rule beneath,
 * then six question cards in a 2 x 3 grid. Question text is the biggest
 * thing on the slide because it is read from the back of the room; the
 * "Do Now" label is the smallest.
 * ------------------------------------------------------------------ */
function doNowSlide(lessonTitle, questions) {
  const s = pptx.addSlide();
  s.background = { color: C.white };
  s.addText('DO NOW · 5 MIN', {
    shape: S.roundRect, rectRadius: 0.16,
    x: M, y: PILL_Y, w: 1.62, h: PILL_H,
    fill: { color: C.dark }, color: C.white,
    fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
  s.addText(lessonTitle, {
    x: 2.40, y: 0.16, w: 5.20, h: 0.62,
    color: C.dark, fontFace: F.title, fontSize: 28, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText(DATE, {
    x: W - M - 3.10, y: PILL_Y, w: 3.10, h: PILL_H,
    color: C.soft, fontFace: F.body, fontSize: 12,
    align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addShape(S.rect, {
    x: M, y: 0.86, w: W - 2 * M, h: 0.035,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule',
  });

  const cw = (W - 2 * M - 0.24) / 2, ch = 1.38, gap = 0.13;
  questions.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.24), y = 1.02 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    s.addText(String(i + 1), {
      x: x + 0.18, y: y + 0.12, w: 0.40, h: 0.42, color: C.accent, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `d${i}_n`,
    });
    s.addText(q, {
      x: x + 0.66, y: y + 0.10, w: cw - 0.86, h: 0.62, color: C.dark, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09,
      x: x + 0.18, y: y + 0.80, w: cw - 0.36, h: 0.44,
      fill: { color: 'FDEEDC' }, line: { color: C.accent, width: 1.2 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  return s;
}

/* ================================================================== *
 * 1. DO NOW
 * ================================================================== */
{
  const s = doNowSlide('Expand and simplify', [
    ['Simplify 4a + 3a \u2212 a', '6a'],
    ['Expand 3(x + 5)', '3x + 15'],
    ['Expand \u22122(y + 4)', '\u22122y \u2212 8'],
    ['What is x \u00d7 x?', 'x\u00b2'],
    ['Simplify 5b + 2 + 3b \u2212 7', '8b \u2212 5'],
    ['Expand 2(x + 3), then add 4x. What do you get?', 'Keep it! That\u2019s today\u2019s lesson.'],
  ]);
  s.addNotes(
    'DO NOW — 5 minutes. Six clicks, one answer each.\n\n'
    + 'Q1 is Lesson 1. Q2 and Q3 are Lesson 2. If Q3 is shaky, fix it now \u2014 today doubles the number of chances to lose a sign.\n\n'
    + 'Q4 catches anyone still writing 2x for x \u00d7 x.\n\n'
    + 'Q5 mixes letters and plain numbers, which is exactly what today\u2019s answers look like.\n\n'
    + 'Q6 IS THE LESSON. Do not settle it. Collect answers on the board \u2014 expect 6x + 6, 2x + 6 + 4x left unfinished, and 6x + 10. Come back to it on slide 4.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'Today · 1 min');
  title(s, 'Today\u2019s goals');

  const GOALS = [
    'Expand a bracket, then collect the like terms.',
    'Handle two brackets in the same question.',
    'Take a bracket away without losing a sign.',
  ];
  const cw = (W - 2 * M - 2 * 0.24) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 1.74, w: cw, h: 1.44, name: `o${i}` });
    badge(s, { x: x + 0.18, y: 1.92, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.18, y: 2.44, w: cw - 0.36, h: 0.64, color: C.dark, fontFace: F.body,
      fontSize: 13, bold: true, valign: 'top', margin: 0, lineSpacing: 17, objectName: `o${i}_t`,
    });
  });

  s.addText('Two skills you already have, in the same question. That\u2019s all this is!', {
    shape: S.roundRect, rectRadius: 0.08,
    x: M, y: 3.52, w: W - 2 * M, h: 0.56,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.white, fontFace: F.body, fontSize: 13.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes('TODAY — 1 minute. Four clicks. Goal 3 is the hard one and they will find out why on slide 5.');
}

/* ================================================================== *
 * 3. HOOK
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'Hook · 4 min');
  title(s, 'Which one is right?');

  expr(s, { x: M, y: 1.62, w: W - 2 * M, h: 0.72, size: 30, align: 'center', name: 'hook_q',
            parts: [['3', C.accent], N('('), A('x'), N(' + '), B('2'), N(')  +  '), A('5x'), N('  =  ?')] });

  const OPTS = [['A', '8x + 2'], ['B', '8x + 6'], ['C', '3x + 5x + 2']];
  const cw = (W - 2 * M - 2 * 0.24) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: 2.58, w: cw, h: 1.14, name: `h${i}` });
    s.addText(k, {
      x: x + 0.20, y: 2.72, w: 0.40, h: 0.36, color: C.accent, fontFace: F.title,
      fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.20, y: 3.10, w: cw - 0.40, h: 0.48, color: C.dark, fontFace: F.title,
      fontSize: i === 2 ? 17 : 21, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addText('Vote! We come back to this at the end.', {
    x: M, y: 3.96, w: W - 2 * M, h: 0.32, color: C.soft, fontFace: F.body, fontSize: 11,
    italic: true, valign: 'middle', margin: 0, objectName: 'hook_foot',
  });
  s.addNotes(
    'HOOK — 4 minutes. Four clicks: the question, then the three options.\n\n'
    + 'Take the vote and tally it on the board.\n\n'
    + 'ANSWER (slide 9, not now): B.\n\n'
    + 'A is the Lesson 2 error walking back in: the 3 never got to the 2.\n\n'
    + 'C is half-finished. It is not wrong, it is just not an answer yet \u2014 and that is a useful thing to say out loud, because plenty of students stop there.\n\n'
    + 'THIS IS DO NOW Q6. Point at the board.'
  );
}

/* ================================================================== *
 * 4. I DO — EXPAND THEN COLLECT
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'I Do · 6 min');
  title(s, 'Expand first. Collect second.');
  subtitle(s, 'Simplify  3(x + 2) + 4x');

  const STEPS = [
    ['1', 'Expand the bracket.', [A('3x'), N(' + '), B('6'), N('  +  '), A('4x')]],
    ['2', 'Find the like terms.', [A('3x'), N('  and  '), A('4x'), N('   |   '), B('6'), N(' is on its own')]],
    ['3', 'Collect them.', [A('3x + 4x = 7x')]],
    ['4', 'Write the answer.', [R('7x + 6')]],
  ];
  const rowH = 0.62, gap = 0.13;
  STEPS.forEach(([n, what, parts], i) => {
    const y = 1.86 + i * (rowH + gap);
    card(s, {
      x: M, y, w: W - 2 * M, h: rowH,
      fill: i === 3 ? 'FDF0EE' : C.card, line: i === 3 ? C.accent : null, name: `st${i}`,
    });
    s.addText(n, {
      x: M + 0.18, y, w: 0.30, h: rowH, color: C.accent, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `st${i}_n`,
    });
    s.addText(what, {
      x: M + 0.58, y, w: 2.60, h: rowH, color: C.dark, fontFace: F.body, fontSize: 12.5,
      bold: true, valign: 'middle', margin: 0, objectName: `st${i}_w`,
    });
    expr(s, { x: M + 3.34, y, w: W - M - (M + 3.34), h: rowH, size: 18, name: `st${i}_e`, parts });
  });

  s.addText('You can\u2019t collect anything while the bracket is still there. Expand first, every time!', {
    x: M, y: 4.86, w: W - 2 * M, h: 0.34, color: C.answer, fontFace: F.body, fontSize: 12,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'st_note',
  });
  s.addNotes(
    'I DO — 6 minutes. Nine clicks: each step\'s words then its maths, then the note.\n\n'
    + 'START FROM DO NOW Q6 on the board. This is the same question.\n\n'
    + 'STEP 2 LOOKS LIKE A WASTE OF A LINE and it is the step that stops the errors. Make them circle or underline the like terms in colour before collecting anything.\n\n'
    + 'THE 6 HAS NOTHING TO PAIR WITH. Say it. Students who expect everything to combine will try to force it into the x term.\n\n'
    + 'MODEL A SECOND ONE on the board with the same four steps: 5(a + 1) + 2a gives 7a + 5. Keep the colours.\n\n'
    + 'MISCONCEPTION: collecting before expanding. 3(x + 2) + 4x is not 3(5x + 2). The bracket has to go first.'
  );
}

/* ================================================================== *
 * 5. I DO — TAKING A BRACKET AWAY
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'I Do · 6 min');
  title(s, 'The hard one: a minus in front');
  subtitle(s, 'Simplify  5(a + 3) \u2212 2(a + 1)');

  const STEPS = [
    ['1', 'The minus belongs to the 2.', [N('It is  '), ['\u22122', C.answer], N('  multiplying  '), N('(a + 1)')]],
    ['2', 'Expand both brackets.', [A('5a'), N(' + '), B('15'), N('  '), A('\u2212 2a'), N('  '), B('\u2212 2')]],
    ['3', 'Collect.', [A('5a \u2212 2a = 3a'), N('        '), B('15 \u2212 2 = 13')]],
    ['4', 'Answer.', [R('3a + 13')]],
  ];
  const rowH = 0.62, gap = 0.13;
  STEPS.forEach(([n, what, parts], i) => {
    const y = 1.86 + i * (rowH + gap);
    card(s, {
      x: M, y, w: W - 2 * M, h: rowH,
      fill: i === 0 ? 'FDF0EE' : (i === 3 ? 'FDF0EE' : C.card),
      line: i === 0 || i === 3 ? C.accent : null, name: `mn${i}`,
    });
    s.addText(n, {
      x: M + 0.18, y, w: 0.30, h: rowH, color: C.accent, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `mn${i}_n`,
    });
    s.addText(what, {
      x: M + 0.58, y, w: 2.85, h: rowH, color: C.dark, fontFace: F.body, fontSize: 12.5,
      bold: true, valign: 'middle', margin: 0, objectName: `mn${i}_w`,
    });
    expr(s, { x: M + 3.58, y, w: W - M - (M + 3.58), h: rowH, size: 17, name: `mn${i}_e`, parts });
  });

  s.addText('\u22122 \u00d7 (+1) = \u22122.  Both terms in the second bracket change sign!', {
    x: M, y: 4.86, w: W - 2 * M, h: 0.34, color: C.answer, fontFace: F.body, fontSize: 12,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'mn_note',
  });
  s.addNotes(
    'I DO — 6 minutes, the hardest block in the topic. Nine clicks.\n\n'
    + 'STEP 1 IS HIGHLIGHTED because it is the whole thing. The minus is not floating between the brackets; it belongs to the 2. Rewrite it on the board as 5(a + 3) + (\u22122)(a + 1) if that helps \u2014 ugly, and it works.\n\n'
    + 'THE ERROR TO EXPECT is 5a + 15 \u2212 2a + 2. They multiply the a by \u22122 and then forget and multiply the 1 by +2.\n\n'
    + 'DO A NUMERICAL CHECK on the board, because it convinces them: put a = 4 into the original. 5 \u00d7 7 \u2212 2 \u00d7 5 = 35 \u2212 10 = 25. Now into 3a + 13: 12 + 13 = 25. Same. Then try it with the wrong answer 3a + 17 and watch it fail.\n\n'
    + 'THAT SUBSTITUTION CHECK is the most useful habit in this topic. Push it hard \u2014 the worksheet asks for it directly.\n\n'
    + 'IF THE ROOM IS STRUGGLING, stop after this slide and do three more like it together. Slide 7 can be cut.'
  );
}

/* ================================================================== *
 * 6. WE DO — SPOT THE MISTAKE
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'We Do · 5 min');
  title(s, 'Spot the mistake');
  subtitle(s, 'Each one is wrong. Say what they did.');

  const ROWS = [
    ['3(x + 2) + 5x  =  8x + 2', '8x + 6', 'The 3 never got to the 2.'],
    ['4(y + 1) \u2212 2(y + 3)  =  2y + 10', '2y \u2212 2', '\u22122 \u00d7 3 is \u22126, not +6.'],
    ['2(3x + 1) + x  =  7x + 1', '7x + 2', '2 \u00d7 1 is 2. They left it as 1.'],
    ['5(a + 2) \u2212 3a  =  8a + 10', '2a + 10', 'They added the 3a instead of subtracting it.'],
  ];
  const rowH = 0.66, gap = 0.14;
  const blockH = ROWS.length * rowH + (ROWS.length - 1) * gap;
  const top = 1.84 + ((H - 0.40) - 1.84 - blockH) / 2;
  ROWS.forEach(([wrong, right, why], i) => {
    const y = top + i * (rowH + gap);
    card(s, { x: M, y, w: W - 2 * M, h: rowH, name: `sm${i}` });
    s.addText(wrong, {
      x: M + 0.20, y, w: 3.70, h: rowH, color: C.dark, fontFace: F.title, fontSize: 14,
      bold: true, valign: 'middle', margin: 0, objectName: `sm${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.07,
      x: M + 4.04, y: y + 0.10, w: 1.36, h: 0.46,
      fill: { color: 'FDF0EE' }, line: { color: C.answer, width: 1.3 },
      color: C.answer, fontFace: F.title, fontSize: 15, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `sm${i}_r`,
    });
    s.addText(why, {
      x: M + 5.56, y, w: W - M - (M + 5.56), h: rowH, color: C.dark, fontFace: F.body,
      fontSize: 12, valign: 'middle', margin: 0, objectName: `sm${i}_w`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Eight clicks: correct answer then diagnosis, row by row.\n\n'
    + 'THEY MUST SAY WHAT THE STUDENT DID. "It\u2019s wrong" earns nothing. Naming the error is what stops them repeating it, and the worksheet asks for exactly this.\n\n'
    + 'ROW 1 is the hook answer A. Point at the tally.\n\n'
    + 'ROW 2 is the big one. Ask them to check it by substituting y = 2 into both: original gives 12 \u2212 10 = 2, and 2y \u2212 2 gives 2. The wrong answer gives 14.\n\n'
    + 'ROW 4: a bracket and a loose term, with a subtraction. Very common in tests.\n\n'
    + 'IF THEY ARE QUICK, ask them to write a wrong answer for a partner to diagnose.'
  );
}

/* ================================================================== *
 * 7. WE DO — YOUR TURN
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'We Do · 6 min');
  title(s, 'Your turn');
  subtitle(s, 'Whiteboards. Expand first, then collect. Four steps every time.');

  const QS = [
    [[['2', C.accent], N('('), A('x'), N(' + '), B('3'), N(') + '), A('4x')], '6x + 6'],
    [[['5', C.accent], N('('), A('a'), N(' + '), B('1'), N(') + '), A('2a')], '7a + 5'],
    [[['3', C.accent], N('('), A('y'), N(' + '), B('4'), N(') \u2212 '), A('y')], '2y + 12'],
    [[['4', C.accent], N('('), A('m'), N(' + '), B('2'), N(') + 3('), A('m'), N(' + '), B('1'), N(')')], '7m + 11'],
    [[['6', C.accent], N('('), A('p'), N(' + '), B('3'), N(') \u2212 2('), A('p'), N(' + '), B('4'), N(')')], '4p + 10'],
    [[['2', C.accent], N('(3'), A('k'), N(' \u2212 '), B('1'), N(') \u2212 3('), A('k'), N(' \u2212 '), B('4'), N(')')], '3k + 10'],
  ];
  const cw = (W - 2 * M - 2 * 0.20) / 3, ch = 1.30;
  QS.forEach(([parts, ans], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (cw + 0.20), y = 1.84 + row * (ch + 0.16);
    card(s, { x, y, w: cw, h: ch, name: `q${i}` });
    badge(s, { x: x + 0.16, y: y + 0.14, n: i + 1, name: `q${i}` });
    expr(s, { x: x + 0.56, y: y + 0.12, w: cw - 0.70, h: 0.46, size: 11.5, name: `q${i}_e`, parts });
    s.addText(ans, {
      x: x + 0.20, y: y + 0.66, w: cw - 0.40, h: 0.48, color: C.answer, fontFace: F.title,
      fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `q${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 6 minutes. Six clicks. Boards up BEFORE you click.\n\n'
    + 'Q3: subtracting a single term, not a bracket. Easier than it looks and worth the confidence.\n\n'
    + 'Q4: two brackets, both added. Expect 7m + 11. Some will write 7m + 5 by only expanding one.\n\n'
    + 'Q5 AND Q6 are the ones that matter. Both have a minus in front of the second bracket.\n\n'
    + 'Q6 IS THE HARDEST on the slide: \u22123 \u00d7 \u22124 = +12, so the answer goes UP. Expect 3k \u2212 14. Give them longer, and get them to check it with k = 2 (original: 2 \u00d7 5 \u2212 3 \u00d7 \u22122 = 10 + 6 = 16; answer: 6 + 10 = 16).\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT by Q4, set Q5 and Q6 as the first worksheet questions.'
  );
}

/* ================================================================== *
 * 8. YOU DO
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  pill(s, 'You Do · 14 min');
  title(s, 'Your turn: the worksheet');
  subtitle(s, 'Non-calculator. You do NOT need to finish every tier.');

  const TIERS = [
    ['BRONZE', 'CD7F52', 'Fluency', 'One bracket and a loose term. Signs included.'],
    ['SILVER', '78868E', 'Mixed practice', 'Two brackets. Work backwards. Check by substituting.'],
    ['GOLD', 'B98400', 'Reasoning', 'Equivalence, counterexamples, and proving it in general.'],
  ];
  const cw = (W - 2 * M - 2 * 0.22) / 3;
  TIERS.forEach(([n, col, sub, body], i) => {
    const x = M + i * (cw + 0.22);
    card(s, { x, y: 1.82, w: cw, h: 1.54, fill: i === 2 ? 'FBF3DF' : C.card, line: col, name: `t${i}` });
    s.addText(n, {
      x: x + 0.20, y: 1.96, w: cw - 0.40, h: 0.32, color: col, fontFace: F.body, fontSize: 11.5,
      bold: true, charSpacing: 1.1, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(sub, {
      x: x + 0.20, y: 2.28, w: cw - 0.40, h: 0.30, color: C.dark, fontFace: F.body, fontSize: 12,
      bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.20, y: 2.58, w: cw - 0.40, h: 0.66, color: C.soft, fontFace: F.body, fontSize: 10.5,
      valign: 'top', margin: 0, lineSpacing: 14, objectName: `t${i}_b`,
    });
  });

  card(s, { x: M, y: 3.58, w: W - 2 * M, h: 1.02, fill: 'EDF2F7', line: C.purple, name: 'gem' });
  s.addText('Check your own work!', {
    x: M + 0.22, y: 3.68, w: 6, h: 0.28, color: C.dark, fontFace: F.body, fontSize: 11.5,
    bold: true, valign: 'middle', margin: 0, objectName: 'gem_h',
  });
  s.addText('Put a number in. If the original and your answer give the same total when x = 2, you are probably right. If they disagree, you are definitely wrong. One matching value is not a proof \u2014 the Gold questions explain why.', {
    x: M + 0.22, y: 3.96, w: W - 2 * M - 0.44, h: 0.56, color: C.dark, fontFace: F.body,
    fontSize: 10, valign: 'top', margin: 0, lineSpacing: 13, objectName: 'gem_t',
  });
  s.addNotes(
    'YOU DO — 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "where did the minus go?"\n\n'
    + 'THE SUBSTITUTION CHECK makes them independent of you. Push it on every student who says "is this right?"\n\n'
    + 'WHERE THEY WILL STALL: the reverse-engineering questions in Silver, and the counterexample questions in Gold. Both are meant to be hard.\n\n'
    + 'THE STRETCH SECTION at the end is genuinely nasty. Nobody is expected to finish it.\n\n'
    + 'AT 3 MINUTES REMAINING, stop them. The plenary settles the hook.'
  );
}

/* ================================================================== *
 * 9. PLENARY
 * ================================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.dark };
  s.addText('PLENARY · 3 MIN', {
    shape: S.roundRect, rectRadius: 0.14,
    x: M, y: PILL_Y, w: 1.70, h: PILL_H,
    fill: { color: C.accent }, color: C.white,
    fontFace: F.body, fontSize: 9, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
  s.addText('True or false?', {
    x: M, y: TITLE_Y, w: W - 2 * M, h: 0.58, color: C.white, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });

  const QS = [
    ['You can collect like terms before expanding.', 'FALSE', 'The bracket has to go first.'],
    ['3(x + 2) + 4x = 7x + 6', 'TRUE', 'Expand, then collect.'],
    ['\u22122(y + 3) = \u22122y + 6', 'FALSE', '\u22122y \u2212 6. Both terms go negative.'],
    ['5(a + 1) \u2212 2(a + 1) = 3a + 3', 'TRUE', '5a + 5 \u2212 2a \u2212 2.'],
    ['4(x + 2) \u2212 (x + 1) = 3x + 9', 'FALSE', '3x + 7. The minus hits the 1 too.'],
  ];
  const rowH = 0.46, gap = 0.12;
  const blockH = QS.length * rowH + (QS.length - 1) * gap;
  const top = 1.70 + ((H - 0.50) - 1.70 - blockH) / 2;
  QS.forEach(([q, v, why], i) => {
    const y = top + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: 4.60, h: rowH, rectRadius: 0.07,
      fill: { color: '3A3168' }, line: { color: '4B4180', width: 1 }, objectName: `p${i}_bg`,
    });
    s.addText(q, {
      x: M + 0.18, y, w: 4.3, h: rowH, color: C.white, fontFace: F.title, fontSize: 12.5,
      bold: true, valign: 'middle', margin: 0, objectName: `p${i}_q`,
    });
    s.addText(v, {
      x: M + 4.84, y, w: 0.80, h: rowH, color: v === 'TRUE' ? '4CC38A' : C.accent,
      fontFace: F.body, fontSize: 11, bold: true, charSpacing: 0.8, valign: 'middle',
      margin: 0, objectName: `p${i}_v`,
    });
    s.addText(why, {
      x: M + 5.74, y, w: W - M - (M + 5.74), h: rowH, color: 'C9C3EA', fontFace: F.body,
      fontSize: 10, valign: 'middle', margin: 0, objectName: `p${i}_w`,
    });
  });

  s.addText('That\u2019s the topic. You can expand, you can collect, and now you can do both at once!', {
    x: M, y: H - 0.56, w: W - 2 * M, h: 0.32, color: C.accent, fontFace: F.body, fontSize: 11,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY — 3 minutes. Eleven clicks.\n\n'
    + 'Q2 SETTLES THE HOOK. Go back to the tally first.\n\n'
    + 'Q5 IS THE ONE TO WATCH. A bracket with nothing written in front of it still has an invisible 1, and the minus applies to everything inside. If the room splits here, it is the first thing to reteach.\n\n'
    + 'Every FALSE is a misconception from the last three lessons.\n\n'
    + 'STOP HERE.'
  );
}

const out = path.join(__dirname, 'Expand and Simplify.pptx');
pptx.writeFile({ fileName: out }).then(() => console.log('deck written:', out));

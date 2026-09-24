/**
 * Y8 Science — Natural Selection, Lesson 1: Darwin's big idea.
 * Single, 50 minutes. Standard archetype. First lesson of a brand new unit
 * for this class — no reference file, so a new palette ('galapagos') and no
 * retrieval from a previous deck. Do Now instead activates general prior
 * knowledge: variation, inheritance, competition, all things students have
 * informal experience of before the formal vocabulary goes on.
 *
 * AVOID, per the brief, governs almost every sentence in this file: no
 * wording that suggests an organism changes on purpose or in response to
 * need. The Hook exists specifically to surface that exact misconception
 * (Lamarckian "the giraffe stretched its neck because it needed to") and
 * then correct it directly in I Do, rather than avoiding the wrong idea and
 * hoping nobody brings it up. We Do and the worksheet's Gold question both
 * return to it, because this is the misconception the whole lesson is
 * built around, not a footnote.
 *
 * The giraffe is the one worked example taught in class. The worksheet
 * deliberately switches to a second organism (camouflage beetles) for
 * Silver and Gold, so students apply the framework rather than recall it.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Monday 28 September 2026';
const LESSON = 'Natural Selection';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_galapagos_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y8 Science · Natural Selection · Lesson 1';

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
    key: 'galapagos', palette: C, minutes, mode, slideH: H,
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
    ['Name the process by which offspring get features from their parents.', 'Inheritance.'],
    ['State what happens when there is not enough food for every animal in a group.', 'Some individuals will not get enough, and may not survive.'],
    ['State what "variation" means.', 'Differences between individuals of the same species.'],
    ['State whether every member of a species looks identical.', 'No. Individuals vary.'],
    ['Name the scientist famous for the theory of evolution.', 'Charles Darwin.'],
    ['State one feature that can be inherited from a parent.', 'Any real example, e.g. eye colour, height.'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `d${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 1.00, w: cw - 0.44, h: 0.48,
      fill: { color: 'F3E7CE' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 14, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'THIS CLASS HAS NO PREVIOUS LESSON IN THIS UNIT, so nothing here is retrieval from a deck. These are everyday ideas: differences between people, competition for resources, family resemblance. The point is to have the raw material on the table before the vocabulary arrives.\n\n'
    + 'Q5 IS A DELIBERATE PLANT. "Charles Darwin" primes the Today slide and the lesson\'s subtitle. Do not explain who he is yet, that is coming.\n\n'
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
    'State Darwin\'s theory of evolution by natural selection.',
    'Explain the four things natural selection needs: variation, competition, survival, inheritance.',
    'Explain why evolution happens to populations, not individuals.',
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 15, bold: true, valign: 'top', margin: 0, lineSpacing: 19, objectName: `o${i}_t`,
    });
  });
  s.addText('Nothing changes on purpose. What survives and reproduces changes the population.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 15.5, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE BANNER IS THE MISCONCEPTION-CORRECTION THIS WHOLE LESSON IS BUILT AROUND. Read it slowly. It is worth returning to word for word at the end.'
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
  s.addText('Giraffes have very long necks. Which explanation is correct?', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 34, objectName: 'slide_title',
  });

  const OPTS = [
    ['A', 'Giraffes needed to reach high leaves, so their necks grew longer over their lives.'],
    ['B', 'Some giraffes were born with slightly longer necks by chance. Those giraffes survived better and had more babies.'],
    ['C', 'Giraffes decided to grow longer necks to survive.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title,
      fontSize: 14.5, bold: true, valign: 'top', margin: 0, lineSpacing: 18, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board. Expect real votes for A, it is the most common misconception about evolution there is (it is essentially Lamarck\'s theory, which Darwin\'s own theory replaced).\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. Say "let\'s find out" and move to I Do, which closes this loop properly.\n\n'
    + 'ANSWER, FOR YOU: B. A describes an individual changing through effort within its own lifetime, which does not happen. C describes purposeful, intentional change, which also does not happen. Both are the exact misconceptions this lesson exists to correct.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — the theory, and closing the Hook
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Darwin\'s big idea: natural selection', 'light');

  card(s, { x: M, y: BODY_Y + 0.05, w: RIGHT - M, h: 1.10, name: 'def' });
  s.addText('Individuals vary. Those with a helpful variation are more likely to survive and reproduce. Over many generations, the population changes.', {
    x: M + 0.30, y: BODY_Y + 0.05, w: RIGHT - M - 0.60, h: 1.10, color: C.dark, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'def_t',
  });

  const cw = (RIGHT - M - 0.30) / 2, y2 = BODY_Y + 1.32, h2 = 1.30;
  card(s, { x: M, y: y2, w: cw, h: h2, fill: 'FBEAE6', line: C.alert, name: 'wrong' });
  s.addText('B was correct. A and C both describe an animal changing on purpose or through effort.', {
    x: M + 0.24, y: y2 + 0.16, w: cw - 0.48, h: h2 - 0.32, color: C.dark, fontFace: F.body,
    fontSize: 14, bold: true, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'wrong_t',
  });

  const rx = M + cw + 0.30;
  card(s, { x: rx, y: y2, w: cw, h: h2, fill: 'F3E7CE', line: C.accent, name: 'right' });
  s.addText('Longer necks already existed, by chance, before any giraffe needed them. Survival came after.', {
    x: rx + 0.24, y: y2 + 0.16, w: cw - 0.48, h: h2 - 0.32, color: C.dark, fontFace: F.body,
    fontSize: 14, bold: true, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'right_t',
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the definition, then the two Hook-closing cards.\n\n'
    + 'READ THE DEFINITION SLOWLY. Every word is doing work: "vary" (not "change"), "more likely" (not "definitely"), "over many generations" (not "in its lifetime").\n\n'
    + 'GO BACK TO THE TALLY FROM THE HOOK. Whoever voted A or C is not wrong to have thought it, it is the intuitive answer. Say that directly, it lowers the stakes of having got it wrong.\n\n'
    + 'THE ORDER MATTERS: variation comes FIRST, by chance, before any advantage exists. Survival is a consequence of variation that was already there, never a cause of it.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — the four requirements
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Four things natural selection needs', 'light');

  const ITEMS = [
    { icon: 'leaf', name: 'VARIATION', text: 'No two giraffes are the same. Some have slightly longer necks than others, by chance.' },
    { icon: 'balance', name: 'COMPETITION', text: 'There is not enough food for every giraffe. They compete for the same leaves.' },
    { icon: 'star', name: 'SURVIVAL', text: 'Giraffes with longer necks can reach more food, so they are more likely to survive.' },
    { icon: 'dna', name: 'INHERITANCE', text: 'Giraffes that survive can reproduce. Long necks are passed on to their offspring.' },
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.30, gapX = 0.30, gapY = 0.20;
  ITEMS.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + gapX), y = BODY_Y + 0.10 + row * (ch + gapY);
    card(s, { x, y, w: cw, h: ch, name: `vi${i}` });
    s.addImage({ path: ICON(it.icon, 'accentInk'), x: x + 0.20, y: y + 0.18, w: 0.40, h: 0.40, objectName: `vi${i}_icon` });
    s.addText(it.name, {
      x: x + 0.72, y: y + 0.14, w: cw - 0.94, h: 0.40, color: C.dark, fontFace: F.title,
      fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `vi${i}_n`,
    });
    s.addText(it.text, {
      x: x + 0.20, y: y + 0.62, w: cw - 0.40, h: 0.64, color: C.ink, fontFace: F.body,
      fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 16, objectName: `vi${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Four clicks, one item at a time.\n\n'
    + 'READ THEM IN ORDER, V-C-S-I, every time this framework is used for the rest of the unit. The order matters: variation and competition come first and do not depend on the others; survival and inheritance are consequences.\n\n'
    + 'THIS IS THE SLIDE STUDENTS WILL BE ASKED TO REPRODUCE FOR A NEW ORGANISM. Say that now: "You will do this exact thing for a different animal later today."\n\n'
    + 'THE INHERITANCE ICON IS DNA. It is fine to say "genes" here if the class has met the word; if not, "passed on to offspring" is enough for today.'
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
    ['"The giraffe stretched its neck to reach the leaves."', 'A giraffe cannot make its neck longer by trying. Longer necks come from variation, not effort.'],
    ['"The giraffe changed because it needed more food."', 'Needing something does not cause a change. Only individuals that already had an advantage survived better.'],
    ['"Evolution happens to one animal during its life."', 'Evolution happens to populations over many generations, not to one individual in its lifetime.'],
    ['"All giraffes have exactly the same neck length."', 'There is variation. Individual giraffes have slightly different neck lengths.'],
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
      fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROWS 1 AND 2 ARE THE HOOK\'S WRONG OPTIONS, RESTATED. If either still feels right to someone, that is worth stopping for.\n\n'
    + 'ROW 3 IS OBJECTIVE 3, ASKED DIRECTLY. Ask a follow-up: "so what actually changes, if not one animal?" Answer: the mix of variations across the whole population.\n\n'
    + 'ROW 4 CONNECTS BACK TO VARIATION. Every fair-test lesson vocabulary word (if this class has had one) applies here too: variation is the raw material, nothing else works without it.'
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
    ['State Darwin\'s theory in one sentence.', 'Individuals with helpful variations are more likely to survive, reproduce, and pass those variations on.'],
    ['Name the four things natural selection needs.', 'Variation, competition, survival, inheritance.'],
    ['State whether one animal can evolve during its own lifetime.', 'No. Evolution happens to populations, over generations.'],
    ['State where variation between individuals comes from.', 'Chance, not effort or need.'],
    ['For rabbits and speed, state which rabbits are more likely to survive foxes.', 'Faster rabbits, because they are more likely to escape.'],
    ['State what happens to a helpful variation over many generations.', 'It becomes more common in the population.'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'F3E7CE' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 AND Q2 ARE THE CORE CONTENT, cold. If these are shaky, that is worth five minutes at the start of next lesson, not something to push past.\n\n'
    + 'Q5 IS A FRESH ORGANISM. If it lands as easily as the giraffe, the framework has actually transferred, not just been memorised for one example.\n\n'
    + 'Q4 IS THE AVOID POINT, asked as directly as it will be all lesson.'
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
    ['BRONZE', C.alert, 'FBEAE6', 'Label it', 'Name variation, competition, survival and inheritance for the giraffe.'],
    ['SILVER', '6E8074', 'F1F2EE', 'Apply it', 'Explain natural selection for a new animal: camouflage beetles.'],
    ['GOLD', C.accentInk, 'F3E7CE', 'Correct it', 'Correct a wrong statement, and explain why evolution needs a population.'],
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
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Remember: variation comes first, by chance. Nothing changes on purpose.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "did that happen because it was needed, or was it already there by chance?"\n\n'
    + 'WHERE THEY WILL STALL: Silver, switching the framework to beetles rather than giraffes, and Gold Q9 (population vs individual), which is genuinely abstract for this age group.\n\n'
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
    ['1', 'Some giraffes have slightly longer necks than others, by chance.'],
    ['2', 'Giraffes compete with each other for the same food (leaves).'],
    ['3', 'Giraffes with longer necks can reach more food and are more likely to survive.'],
    ['4', 'Long necks are passed on to offspring.'],
    ['5', 'Beetle colour varies: some green, some brown.'],
    ['6', 'Green beetles are harder for birds to see, so less likely to be eaten.'],
    ['7', 'Green beetles survive and reproduce more, so green becomes more common.'],
    ['8', 'Beetles cannot change colour by trying. The variation already existed by chance.'],
    ['9', 'One beetle keeps the same colour its whole life. The mix across the population changes.'],
    ['10', 'Answers vary. Must use chance/advantage language, not need or purpose.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 12,
      valign: 'middle', margin: 0, lineSpacing: 15, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q8 AND Q9 ARE THE REAL TEST OF TODAY. Take two or three student answers out loud for each rather than reading the model answer straight off the slide.\n\n'
    + 'Q9 IS THE LESSON\'S THESIS, restated as an answer. If it is shaky, that is worth five minutes at the start of next lesson before anything new.'
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
    ['An animal can change its features because it needs to.', 'FALSE'],
    ['Variation exists before an animal needs it.', 'TRUE'],
    ['Evolution happens to one individual during its life.', 'FALSE'],
    ['Natural selection needs variation, competition, survival and inheritance.', 'TRUE'],
    ['A helpful variation can become more common in a population over many generations.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
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
  s.addText('Nothing changes on purpose. What survives and reproduces changes the population.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q1 AND Q3 ARE THE AVOID POINT AND OBJECTIVE 3, asked directly. If either splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q5 IS THE HONEST TEST of whether "population, not individual" actually landed. Ask a follow-up: "who changes, then?" Answer: nobody, the mix across the population shifts.\n\n'
    + 'The closing line is the banner from Today, word for word. That repetition is deliberate.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

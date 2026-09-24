/**
 * Y8 Science, Natural Selection, Lesson 3: Natural selection in action.
 * Single, 50 minutes. Class 8I. Galapagos palette, carried on from
 * Natural Selection and How Darwin Got There.
 *
 * SHAPE. The 10-phase archetype has no practical, so this deviates (same
 * move as Losing The Soil): Chuka asked for the beak game, and it takes the
 * time of the Cold Call. Do Now 8, Today 1, Hook 2, I Do 3, PRACTICAL 11,
 * I Do 3, We Do 5, You Do 11, Answers 3, Plenary 3 = 50.
 *
 * PREVIOUS. The brief named reference/How Darwin Got There.pptx, which is not
 * in reference/. This was built from the build in out/ instead. That lesson
 * ended on "a good idea rarely arrives alone" and told the class Darwin
 * barely noticed the finches and John Gould identified them in London in
 * 1837. This lesson picks that up: the finches ARE the best real example,
 * but of the Grants' work on Daphne Major, not Darwin's.
 *
 * THEY FOUND HARD was blank. Inferred, and said so in the notes: (1) any
 * wording that has an organism change on purpose, (2) population not
 * individual, (3) "my body got used to the antibiotic".
 *
 * FACTS checked against: Boag and Grant, Science, 1981 (1977 drought on
 * Daphne Major: about 85% of medium ground finches died; survivors' beak
 * depth 9.96 mm against 9.42 mm; next generation about 4% deeper); HHMI
 * BioInteractive; WHO GLASS report 2025 (1 in 6 lab-confirmed bacterial
 * infections resistant in 2023); methicillin introduced 1959, first MRSA
 * reported in the UK in 1961.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Friday 2 October 2026';
const LESSON = 'Natural Selection In Action';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_galapagos_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y8 Science · Natural Selection · Lesson 3';

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
const title = (slide, text, mode, o = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: o.w ?? (RIGHT - M), h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: o.size ?? 30, bold: true,
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
function banner(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.12,
    x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true,
    align: 'center', valign: 'middle', margin: 0.1, objectName: o.name,
  });
}
function outline(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.12,
    x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.62, fill: { color: 'F3E7CE' }, line: { color: C.accent, width: 1.5 },
    color: C.dark, fontFace: F.body, fontSize: o.size ?? 15, bold: true, align: 'center', valign: 'middle', margin: 0.1,
    objectName: o.name,
  });
}

const PHASES = [];

/* ================================================================== *
 * 1. DO NOW · 8
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 8, 'light'));
  pill(s, 'Do Now', 8, 'light');

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
    ['Name the four steps of natural selection.', 'Variation, competition, survival, inheritance.'],
    ['State what variation means.', 'Differences between individuals of the same species.'],
    ['State whether one animal can evolve during its own lifetime.', 'No. Populations change, over generations.'],
    ['State where variation comes from.', 'Chance, not effort or need.'],
    ['State who identified Darwin\'s finches as related species.', 'John Gould, an ornithologist, in London.'],
    ['Name a medicine that kills bacteria.', 'An antibiotic, for example penicillin.'],
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
      color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 8 minutes, not 10, to make room for the beak game. Six clicks.\n\n'
    + 'Q1-5 ARE RETRIEVAL from Natural Selection and How Darwin Got There. Q1 is the frame for the whole lesson: every example today is checked against those four steps. Q3 and Q4 are the two ideas most likely to have slipped. If Q3 gets "yes", stop and fix it now, because objective 3 depends on it.\n\n'
    + 'Q5 CLOSES LAST LESSON. Darwin barely noticed the finches and John Gould identified them in London in 1837. That is why today\'s finch example is not Darwin\'s. It is the work of two later scientists, Peter and Rosemary Grant.\n\n'
    + 'Q6 IS A PLANTED FACT for the second half. Accept "antibiotics", "penicillin", "medicine from the doctor". Do not explain resistance yet.\n\n'
    + 'THE BRIEF LEFT "THEY FOUND HARD" BLANK, so I have guessed, from how this unit has gone: (1) wording where an animal changes on purpose, (2) population, not individual, and (3) "my body got used to the antibiotic". All three are built into the lesson. Tell me if the class found something else hard and I will rework it.\n\n'
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
    'Explain a real example of natural selection using the four steps.',
    'Explain why antibiotic resistance is natural selection happening now.',
    'Write an explanation that does not say an organism changed on purpose.',
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
  s.addText('Nothing changes on purpose.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE FIRST TWO LESSONS WERE WHAT IT IS AND HOW DARWIN GOT THERE. TODAY IS EVIDENCE: natural selection in action, in a real place and a real hospital. Say that.\n\n'
    + 'OBJECTIVE 3 IS A WRITING SKILL, NOT A FACT. It is the one to spend your attention on. Every explanation students write today has to pass one test: does anything in it want, need, try, learn or decide? If so, rewrite.\n\n'
    + 'THE BANNER IS THE RULE FOR THE LESSON. Say it aloud, and quote it back the first time a student says "so that".'
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
  s.addText('In 1977 a drought killed most of the finches on a Galapagos island. The next generation had bigger beaks. Why?', {
    x: M, y: 0.86, w: RIGHT - M - 1.60, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 24,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('finch', 'accentInk'), x: RIGHT - 1.30, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_finch' });

  const OPTS = [
    ['A', 'The finches needed bigger beaks, so their beaks grew.'],
    ['B', 'Finches with bigger beaks survived more often and had chicks with bigger beaks.'],
    ['C', 'The drought made the beaks grow bigger.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.90, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.32, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Hands up for each. Tally on the board. Expect a strong vote for A: it is the most natural way to say it, and it is exactly the wording objective 3 is about. Some will pick C, which sounds scientific.\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. Say "the scientists who counted every bird will show us" and move on.\n\n'
    + 'ANSWER, FOR YOU: B. A has the finches doing something on purpose (needing, then growing). C has the environment changing individual birds directly. Neither is what happened. Nobody has to be told this on the slide: the next slide shows the counting, and We Do comes back to A.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — Daphne Major, four steps
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Daphne Major, 1977: the four steps', 'light', { w: RIGHT - M - 1.20, size: 28 });
  s.addImage({ path: ICON('finch', 'accentInk'), x: RIGHT - 0.95, y: 0.90, w: 0.95, h: 0.95, objectName: 'dm_finch' });

  const STEPS = [
    ['VARIATION', 'Medium ground finches on the island had beaks of different depths, top to bottom. Beak depth is inherited from parents.'],
    ['COMPETITION', 'In 1977 a drought hit. Few plants made seeds. The small, soft seeds ran out first, leaving mostly large, hard seeds.'],
    ['SURVIVAL', 'About 85% of the finches died. The survivors had deeper beaks: 9.96 mm on average, against 9.42 mm before.'],
    ['INHERITANCE', 'The survivors\' chicks had deeper beaks too. The next generation\'s average was about 4% deeper.'],
  ];
  const gap = 0.20, cw = (CW - gap) / 2, ch = 2.08, y0 = 1.90;
  STEPS.forEach(([name, text], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + gap), y = y0 + row * (ch + gap);
    card(s, { x, y, w: cw, h: ch, name: `st${i}` });
    badge(s, { x: x + 0.24, y: y + 0.20, n: i + 1, name: `st${i}` });
    s.addText(name, {
      x: x + 0.86, y: y + 0.20, w: cw - 1.1, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 16,
      bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `st${i}_h`,
    });
    s.addText(text, {
      x: x + 0.28, y: y + 0.76, w: cw - 0.56, h: ch - 0.92, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'top', margin: 0, lineSpacing: 20, objectName: `st${i}_t`,
    });
  });
  banner(s, 'No finch grew a bigger beak. The population changed.', { y: y0 + 2 * ch + gap + 0.20, h: 0.62, size: 17, name: 'dm_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks, one step at a time, then the banner.\n\n'
    + 'THIS IS THE REAL VERSION OF THE FINCH STORY. Last lesson the class learned Darwin barely noticed the finches. From 1973 Peter and Rosemary Grant (Princeton) tagged and measured the finches on Daphne Major, a small Galapagos island, year after year. When a drought hit in 1977 they were already there with the numbers. The data is Boag and Grant, Science, 1981.\n\n'
    + 'READ THE FOUR STEPS AS A CHECKLIST against the Do Now Q1 answer. Each card is one step with its evidence. Ask "which step is this?" before you click each card.\n\n'
    + 'WHAT "DEEPER" MEANS: the depth of a beak is how tall it is, top to bottom. A deeper beak can crack a bigger, harder seed. Hold a hand up and show it.\n\n'
    + 'THE NUMBERS ARE SMALL AND TRUE. 9.42 mm to 9.96 mm is about half a millimetre, and it was enough. Do not round them up for effect. The average moved because of who survived, not because any bird grew.\n\n'
    + 'THE BANNER IS OBJECTIVE 3 IN ONE LINE. It is also the answer to the Hook: B.\n\n'
    + 'IF ASKED "DID THE BEAKS KEEP GETTING BIGGER?": no. When wetter years came and small seeds returned, selection swung the other way in later years. That is a good point to leave for next time: selection follows the environment, it does not head anywhere.'
  );
}

/* ================================================================== *
 * 5. PRACTICAL · 11 — the beak game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 11, 'light'));
  pill(s, 'Practical', 11, 'light');
  title(s, 'The beak game', 'light');

  const cy = 1.95;
  const bw = 1.82, bgap = 0.22, bh = 1.80;
  [['tweezers', 'Tweezers'], ['spoon', 'Spoon'], ['fork', 'Fork']].forEach(([ic, label], i) => {
    const x = M + i * (bw + bgap);
    card(s, { x, y: cy, w: bw, h: bh, name: `bk${i}` });
    s.addImage({ path: ICON(ic, 'accentInk'), x: x + (bw - 0.92) / 2, y: cy + 0.16, w: 0.92, h: 0.92, objectName: `bk${i}_icon` });
    s.addText(label, {
      x, y: cy + 1.16, w: bw, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 16, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `bk${i}_h`,
    });
    s.addText('beak', {
      x, y: cy + 1.48, w: bw, h: 0.26, color: C.inkSoft, fontFace: F.body, fontSize: 11,
      align: 'center', valign: 'middle', margin: 0, objectName: `bk${i}_s`,
    });
  });
  const leftW = 3 * bw + 2 * bgap;
  card(s, { x: M, y: cy + bh + 0.20, w: leftW, h: 1.55, name: 'food' });
  s.addImage({ path: ICON('bean', 'accentInk'), x: M + 0.26, y: cy + bh + 0.20 + 0.38, w: 0.78, h: 0.78, objectName: 'food_icon' });
  s.addText('Food: dried beans in a tray.\nYour pot: one small pot.\nTime: 30 seconds a round.', {
    x: M + 1.26, y: cy + bh + 0.20, w: leftW - 1.46, h: 1.55, color: C.ink, fontFace: F.body, fontSize: 14,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'food_t',
  });

  const sx = M + leftW + 0.30, sw = RIGHT - sx;
  const STEPS = [
    'Groups of six. Take a beak from the bag. You do not choose.',
    '30 seconds: move beans from the tray to your pot. Beak only, one hand.',
    'Count your beans. Write your number in the table.',
    'The fewest beans is out. Play again. Three rounds.',
  ];
  const stepH = 0.80, stepGap = 0.145;
  STEPS.forEach((t, i) => {
    const y = cy + i * (stepH + stepGap);
    card(s, { x: sx, y, w: sw, h: stepH, name: `ps${i}` });
    badge(s, { x: sx + 0.16, y: y + (stepH - 0.42) / 2, n: i + 1, name: `ps${i}` });
    s.addText(t, {
      x: sx + 0.74, y, w: sw - 0.90, h: stepH, color: C.ink, fontFace: F.body, fontSize: 13.5,
      bold: true, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `ps${i}_t`,
    });
  });
  const by = cy + bh + 0.20 + 1.55 + 0.22;
  banner(s, 'A model: beaks are handed out by chance, beans are the food, and the player who is out did not survive.', { y: by, h: 0.66, size: 14.5, name: 'model_banner' });
  outline(s, 'Discuss: which beaks are left? Would the same beak win if the food were rice?', { y: by + 0.78, h: 0.62, size: 14.5, name: 'look_banner' });
  s.addNotes(
    'PRACTICAL. 11 minutes. Four clicks: the three beaks and the food, the steps, the model line, then the discussion line.\n\n'
    + 'BEFORE THE LESSON (5 minutes). Per group of six: one tray of dried beans (about 150, spread out), six small pots, and a bag holding two tweezers, two spoons and two forks. Use the same kind of bean in every tray. Small beans work best: kidney beans are too big for forks and tweezers to be a fair fight, mung or black-eyed beans are better. A student with a stopwatch, or the timer on your phone, runs the 30 seconds.\n\n'
    + 'THE RESULTS TABLE IS ON THE WORKSHEET, top of the Bronze section. It lists six players, their beak and their beans for rounds 1 to 3. Students write it in as they go, so the numbers are down before the discussion.\n\n'
    + 'TIMING. 2 minutes: click through the slide, hand out the equipment, and stress step 1: beaks are drawn from the bag, not picked. If they choose, it looks like the players are choosing, and that is exactly the wording we are trying to remove. 5 minutes: three rounds, roughly 30 seconds to play and 60 to count and record. 3 minutes: click the model line, then the discussion line. 1 minute: clear up.\n\n'
    + 'THE RULE: after each round the player with the fewest beans is out. They keep the stopwatch or the tally for the rest of the game. Keep going for three rounds, so three players are out and three remain.\n\n'
    + 'WHAT USUALLY HAPPENS. Spoons collect the most and forks the least, because beans slip through the tines. Tweezers are slow but steady. It is the pattern, not a guarantee: if your class result is different, that is a real result and it is worth discussing. Some variation is also the player, not the beak. Say so. It is a limitation of the model, and Silver and Gold work on limitations.\n\n'
    + 'THE DISCUSSION. Which beaks are left? Now ask: would the same beak win if the food were rice, or small seeds, or nectar? No. The best beak depends on the food, which is the real lesson: "best" is not fixed, it depends on the environment. If you have time, swap the beans for rice and run one more round.\n\n'
    + 'THE MODEL LEAVES ONE STEP OUT. Ask which of the four steps the game does not show. Answer: inheritance. The players who survive do not have chicks. That is Gold Q8.\n\n'
    + 'CLEAR UP: beans back in the tray, not the floor. Count the utensils.'
  );
}

/* ================================================================== *
 * 6. I DO · 3 — antibiotic resistance
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Antibiotic resistance: natural selection now', 'light', { w: RIGHT - M, size: 28 });

  const STAGES = [
    { head: 'VARIATION', text: 'Bacteria vary. By chance, one is resistant.', vis: 'mixed' },
    { head: 'ANTIBIOTIC', text: 'It kills the bacteria that are not resistant.', vis: 'pills' },
    { head: 'SURVIVAL', text: 'The resistant bacterium survives.', vis: 'one' },
    { head: 'INHERITANCE', text: 'It divides. Its offspring are resistant too. Soon most are.', vis: 'all' },
  ];
  const gap = 0.20, cw = (CW - 3 * gap) / 4, cy = 1.90, ch = 2.95;
  STAGES.forEach((st, i) => {
    const x = M + i * (cw + gap), n = `sg${i}`;
    card(s, { x, y: cy, w: cw, h: ch, name: n });
    badge(s, { x: x + 0.18, y: cy + 0.16, n: i + 1, name: n });
    s.addText(st.head, {
      x: x + 0.70, y: cy + 0.16, w: cw - 0.80, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14,
      bold: true, charSpacing: 0.8, valign: 'middle', margin: 0, objectName: `${n}_h`,
    });
    // visual area: 3 columns x 2 rows of bacteria, or a single large icon
    const vx = x + 0.30, vy = cy + 0.80, vs = 0.62, vg = 0.18;
    const bact = (col, row, role, k) => s.addImage({
      path: ICON('bacteria', role), x: vx + col * (vs + vg), y: vy + row * (vs + 0.06), w: vs, h: vs, objectName: `${n}_b${k}`,
    });
    if (st.vis === 'mixed') {
      for (let k = 0; k < 6; k++) bact(k % 3, Math.floor(k / 3), k === 4 ? 'alert' : 'dark', k);
    } else if (st.vis === 'all') {
      for (let k = 0; k < 6; k++) bact(k % 3, Math.floor(k / 3), 'alert', k);
    } else if (st.vis === 'one') {
      s.addImage({ path: ICON('bacteria', 'alert'), x: x + (cw - 1.0) / 2, y: vy + 0.06, w: 1.0, h: 1.0, objectName: `${n}_b0` });
    } else {
      s.addImage({ path: ICON('pills', 'accentInk'), x: x + (cw - 1.0) / 2, y: vy + 0.06, w: 1.0, h: 1.0, objectName: `${n}_b0` });
    }
    s.addText(st.text, {
      x: x + 0.24, y: cy + 2.16, w: cw - 0.48, h: 0.72, color: C.ink, fontFace: F.body, fontSize: 13,
      bold: true, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: `${n}_t`,
    });
  });

  const sy = cy + ch + 0.20, sh = 0.98, sw = (CW - 0.20) / 2;
  const STATS = [
    ['1959 to 1961', 'Methicillin was introduced in 1959. The first resistant infection, MRSA, was reported in the UK in 1961.', 'stat0'],
    ['2023', 'About 1 in 6 lab-confirmed bacterial infections worldwide was resistant to treatment. Source: WHO, 2025.', 'stat1'],
  ];
  STATS.forEach(([big, txt, n], i) => {
    const x = M + i * (sw + 0.20);
    card(s, { x, y: sy, w: sw, h: sh, name: n });
    s.addText(big, {
      x: x + 0.22, y: sy, w: 1.62, h: sh, color: C.accentInk, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `${n}_big`,
    });
    s.addText(txt, {
      x: x + 1.90, y: sy, w: sw - 2.06, h: sh, color: C.ink, fontFace: F.body, fontSize: 12,
      valign: 'middle', margin: 0, lineSpacing: 15.5, objectName: `${n}_t`,
    });
  });
  banner(s, 'Bacteria do not learn to resist. Resistant bacteria survive.', { y: sy + sh + 0.16, h: 0.58, size: 16, name: 'ab_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks, one stage at a time, then both facts together, then the banner.\n\n'
    + 'THIS IS THE SAME FOUR STEPS, IN A PLACE STUDENTS CAN SEE. Stage 2 is not "competition" for food. The antibiotic is what decides who survives, which is the job competition did on Daphne Major. If a student notices, say so: that is a good spot.\n\n'
    + 'STAGE 1 IS THE STEP MOST WORTH SLOWING FOR. The resistant bacterium is there BEFORE the antibiotic. The antibiotic does not create it and the bacteria do not respond to it. The red one is red from the start. Some genetic studies suggest the MRSA resistance gene was already around before methicillin was used at all. Hold that for a keen student.\n\n'
    + 'WHY IT IS "NOW". Some bacteria divide about every 20 minutes in good conditions, so a lifetime of generations fits inside a few days. The finches took decades of counting. Bacteria do it while a patient is ill.\n\n'
    + 'THE TWO FACTS. 1959 to 1961: two years from a new antibiotic to resistance, MRSA (methicillin-resistant Staphylococcus aureus). 2023: the World Health Organization\'s GLASS report (2025) says about 1 in 6 lab-confirmed bacterial infections was resistant. Both facts checked; the report also says resistance rose in over 40% of the antibiotics monitored between 2018 and 2023.\n\n'
    + 'THE COMMON MISCONCEPTION IS "MY BODY GOT USED TO IT". A person does not become resistant. The bacteria are resistant. Say it out loud; it comes back in We Do.\n\n'
    + 'ON MEDICAL ADVICE: do not tell students to "always finish the course". Current advice is that the prescriber decides how long. Say "follow the advice you are given". That is enough for this lesson.'
  );
}

/* ================================================================== *
 * 7. WE DO · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');

  const ROWS = [
    ['"The finches needed bigger beaks, so their beaks grew."', 'Finches with deeper beaks survived more often and passed them on. No finch grew a bigger beak.'],
    ['"My body got used to the antibiotic, so it stopped working."', 'Your body did not change. Some bacteria were already resistant. They survived and multiplied.'],
    ['"The tweezers changed to collect more beans."', 'Nothing changed. Some beaks collected fewer beans, so those players were out.'],
    ['"The giraffe stretched its neck, so its babies had longer necks."', 'Giraffes with longer necks survived more often and passed them on. Stretching is not inherited.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74,
      fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'THIS IS OBJECTIVE 3, PRACTISED FOUR TIMES. Every wrong statement has the same shape: something wants, needs, stretches or changes, so that something else happens. The correction has the same shape too: some already had it, they survived, they passed it on. Say the pattern out loud after row 2, and let the class finish it for rows 3 and 4.\n\n'
    + 'ROW 1 IS THE HOOK, ANSWER A. If anyone still defends it, ask "how would the finch know what beak to grow?"\n\n'
    + 'ROW 2 IS THE ONE THE CLASS IS MOST LIKELY TO BELIEVE, and it is the one people believe as adults. A person taking antibiotics does not become resistant. Their bacteria might be.\n\n'
    + 'ROW 3 IS THE BEAK GAME. It is a good place to ask "what did the players do to get a better beak?" Nothing: they were handed one.\n\n'
    + 'ROW 4 IS THE GIRAFFE, BROUGHT BACK from Natural Selection, to show the rule is the same for any animal. If it lands quickly, good.\n\n'
    + 'THE WORKSHEET REWRITE TASK IS THE SAME SKILL. If they can do it aloud here, Gold Q10 is fine.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 11
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 11, 'light'));
  pill(s, 'You Do', 11, 'light');

  s.addImage({
    path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47,
    transparency: 62, objectName: 'gc_logo',
  });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FBEAE6', 'Record it', 'Fill in your beak game results. Name the four steps.'],
    ['SILVER', '6E8074', 'F1F2EE', 'Explain it', 'Explain the finch example, and why some bacteria survive an antibiotic.'],
    ['GOLD', C.accentInk, 'F3E7CE', 'Rewrite it', 'Explain antibiotic resistance as natural selection. Rewrite a sentence so nothing changes on purpose.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.10, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, {
      x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body,
      fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(subh, {
      x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.00, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Check your writing: nothing wanted, needed, tried or learned.', {
    x: M, y: BODY_Y + 2.86, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 11 minutes, not 14, because the beak game took the time. Four clicks.\n\n'
    + 'THE RESULTS TABLE IS AT THE TOP OF THE BRONZE SECTION. They should already have filled it in during the game. If a group is missing numbers, let them copy from a neighbour, and note it is one class result, not their own.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "does anything in that sentence want, need, try or learn?" It works for every tier.\n\n'
    + 'WHERE THEY WILL STALL: Gold Q10. They can spot the wrong wording but rewrite it with a new "so" ("so they could survive"). The fix is the shape from We Do: some already had it, they survived, they passed it on.\n\n'
    + 'SILVER Q6 IS AN EASY MARK LOST. Students write "the chicks got deeper beaks" without saying why. It needs inheritance: the survivors had deeper beaks, so their chicks did.\n\n'
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
    ['1', 'Variation, competition, survival, inheritance.'],
    ['2', 'The food, the seeds a bird eats.'],
    ['3', 'A bird that did not survive, for example one that starved.'],
    ['4', 'From your own table. Often the spoon.'],
    ['5', 'The drought meant few seeds. Small seeds ran out, so finches competed for the hard seeds.'],
    ['6', 'Beak depth is inherited. Survivors had deeper beaks, so their chicks did too.'],
    ['7', 'Bacteria vary. By chance a few are already resistant, so the antibiotic does not kill them.'],
    ['8', 'Any one: no chicks inherit beaks in the game; beaks were handed out; it took minutes, not generations.'],
    ['9', 'Bacteria vary. The antibiotic kills most. The resistant survive and pass resistance on when they divide.'],
    ['10', 'A few bacteria were already resistant. They survived and passed resistance on.'],
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
      valign: 'middle', margin: 0, lineSpacing: 14.5, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q4 COMES FROM THE CLASS\'S OWN TABLE. Ask two or three groups. Usually the spoon collects most, but accept whatever the table says. If a group\'s answer disagrees with the table in front of them, that is the mark to fix.\n\n'
    + 'Q8 HAS SEVERAL RIGHT ANSWERS. Take two or three from the room. The best one is "no chicks": the game leaves out inheritance.\n\n'
    + 'Q9 AND Q10 ARE THE REAL TEST OF OBJECTIVES 2 AND 3. For Q10, read a student\'s rewrite aloud and ask the room whether anything in it wanted, needed, tried or learned. If yes, fix it together.'
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
    ['The drought made the finches\' beaks grow bigger.', 'FALSE'],
    ['Finches with deeper beaks survived the drought more often.', 'TRUE'],
    ['Antibiotics cause bacteria to become resistant.', 'FALSE'],
    ['Resistant bacteria pass resistance on when they divide.', 'TRUE'],
    ['Antibiotic resistance is natural selection happening now.', 'TRUE'],
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
  s.addText('Natural selection is happening now, and nobody is choosing.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'BOTH FALSES ARE MISCONCEPTIONS FROM TODAY. Q1 is Hook answer C: the environment changing individual birds. Q3 is the antibiotic version. People do believe the medicine causes the resistance. For Q3, the accurate line for this age group is: the resistant bacteria were already there, and the antibiotic removed the rest.\n\n'
    + 'Q2 AND Q4 ARE THE TWO KEY STEPS, survival and inheritance, one in each example. Q5 is objective 2 in one sentence.\n\n'
    + 'THE CLOSING LINE ENDS THE LESSON on the two things students are asked to remember: it is happening now, and nothing in it is a choice.\n\n'
    + 'THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on, a natural next question is what else in the room, the hospital or the farm is the same story. Your call.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

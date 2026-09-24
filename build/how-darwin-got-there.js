/**
 * Y8 Science — Natural Selection, Lesson 2: How Darwin got there.
 * Single, 50 minutes. Standard archetype. For 8I, same class as
 * Natural Selection (corrected 2026-09-24 — the brief originally
 * mislabelled this as a Y9 lesson).
 *
 * Follows reference/Natural Selection.pptx: the class already has the
 * V-C-S-I framework and the giraffe example secure, and already knows what
 * natural selection IS. This lesson is about HOW Darwin got there — the
 * history of the idea, not the mechanism again.
 *
 * AVOID, per the brief: the tidy legend of the finches. The popular
 * retelling has Darwin studying finch beaks on the Galapagos and
 * immediately seeing evolution in action. He did not: he barely attended to
 * the finches at the time and did not record which island each one came
 * from. It was the ornithologist John Gould, examining the specimens back
 * in London in 1837, who identified them as a closely related group of
 * distinct species — over a year after Darwin left the islands, and by
 * someone else. Rather than quietly avoiding the finches, the Hook puts the
 * legend on the table directly and I Do corrects it, the same pattern used
 * for the giraffe misconception last lesson.
 *
 * Facts checked against: CK-12 / LibreTexts on Darwin's influences,
 * Wikipedia's "Darwin's finches", and the Linnean Society / Wallace Fund
 * accounts of the 1858 joint paper. See the chat for search sources.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Wednesday 30 September 2026';
const LESSON = 'How Darwin Got There';
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 2';

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
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: 30, bold: true,
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
    ['State Darwin\'s theory in one sentence.', 'Individuals with helpful variations are more likely to survive, reproduce, and pass those variations on.'],
    ['Name the four things natural selection needs.', 'Variation, competition, survival, inheritance.'],
    ['State whether one animal can evolve during its own lifetime.', 'No. Evolution happens to populations, over generations.'],
    ['State where variation between individuals comes from.', 'Chance, not effort or need.'],
    ['Name the ship Darwin sailed on.', 'HMS Beagle.'],
    ['State roughly how many years the voyage lasted.', 'About five years.'],
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
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'Q1-4 ARE STRAIGHT RETRIEVAL from Natural Selection. This lesson does not re-teach the mechanism, it assumes it is secure.\n\n'
    + 'Q5 AND Q6 ARE NEW, PLANTED FACTS. HMS Beagle and "about five years" (1831 to 1836) both come back in I Do 1.\n\n'
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
    'Identify the influences on Darwin\'s thinking.',
    'Explain how artificial selection gave Darwin a model for natural selection.',
    'Describe the part Alfred Russel Wallace played.',
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
  s.addText('A good idea rarely arrives alone.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'LAST LESSON WAS WHAT NATURAL SELECTION IS. TODAY IS HOW DARWIN GOT THERE. Say that distinction out loud, it is the whole shape of the lesson.\n\n'
    + 'THE BANNER POINTS FORWARD TO WALLACE, without naming him yet.'
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
  s.addText('Darwin figured it all out by studying finch beaks in the Galapagos.', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 26,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title',
  });
  s.addText('True or false?', {
    x: M, y: 1.92, w: RIGHT - M, h: 0.40, color: C.inkSoft, fontFace: F.body, fontSize: 18,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [
    ['A', 'True. The finch beaks were the key clue Darwin needed.'],
    ['B', 'False. The real story is more complicated than that.'],
    ['C', 'Darwin never actually visited the Galapagos.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.32, w: cw - 0.56, h: 0.90, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board. Expect real votes for A: this is the version most documentaries and textbooks tell, and it is not quite right.\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. Say "let\'s find out what actually happened" and move to I Do.\n\n'
    + 'ANSWER, FOR YOU: B. C is a clear distractor, he did visit (1835). A is the tidy legend this lesson exists to correct: the finches mattered, but not in the way, or at the moment, most people think.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — where the pieces came from
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Where the pieces came from', 'light');

  const ITEMS = [
    {
      icon: 'compass', name: 'THE VOYAGE', text: 'Five years on HMS Beagle. Darwin saw huge variation between similar species in different places. He collected finches on the Galapagos too, but barely noticed them at the time, and did not record which island each came from. It was John Gould, an ornithologist, examining the specimens back in London in 1837, who identified them as closely related species. The insight came later, and from someone else.',
    },
    {
      icon: 'mountain', name: 'LYELL', text: '"Principles of Geology" argued the Earth was far older than people thought, and changed slowly, over huge spans of time. This gave Darwin enough time for gradual change to add up.',
    },
    {
      icon: 'book', name: 'MALTHUS', text: 'Read in 1838. Populations grow faster than their resources. This gave Darwin the idea of a "struggle for existence": competition for what is limited.',
    },
  ];
  const cw = (RIGHT - M - 2 * 0.24) / 3, cardY = BODY_Y + 0.05, cardH = 4.55;
  ITEMS.forEach((it, i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: cardY, w: cw, h: cardH, name: `pc${i}` });
    s.addImage({ path: ICON(it.icon, 'accentInk'), x: x + 0.22, y: cardY + 0.20, w: 0.46, h: 0.46, objectName: `pc${i}_icon` });
    s.addText(it.name, {
      x: x + 0.80, y: cardY + 0.20, w: cw - 1.00, h: 0.46, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `pc${i}_h`,
    });
    s.addText(it.text, {
      x: x + 0.22, y: cardY + 0.86, w: cw - 0.44, h: cardH - 1.05, color: C.ink, fontFace: F.body,
      fontSize: 12, valign: 'top', margin: 0, lineSpacing: 15.5, objectName: `pc${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks, one card at a time.\n\n'
    + 'THIS CLOSES THE HOOK. The voyage card is the correction: say plainly that the finches were a small, delayed piece of a much bigger picture, identified by somebody else, over a year after Darwin left the islands.\n\n'
    + 'LYELL AND MALTHUS ARE BOTH IDEAS DARWIN GOT FROM READING, not from the voyage. Worth saying directly: some of the most important influences were books, not fieldwork.\n\n'
    + 'MALTHUS IS THE KEYSTONE. 1838, two years after the voyage ended, is when the pieces properly connected. Point back to last lesson\'s "competition" requirement: this is where that idea came from, historically.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — the model, and a parallel discovery
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'A model, and a rival letter', 'light');

  const cw = (RIGHT - M - 0.30) / 2, colY = BODY_Y + 0.05, colH = 4.55;
  card(s, { x: M, y: colY, w: cw, h: colH, name: 'model' });
  s.addImage({ path: ICON('seedling', 'accentInk'), x: M + 0.24, y: colY + 0.22, w: 0.46, h: 0.46, objectName: 'model_icon' });
  s.addText('ARTIFICIAL SELECTION', {
    x: M + 0.82, y: colY + 0.22, w: cw - 1.02, h: 0.46, color: C.dark, fontFace: F.title,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'model_h',
  });
  s.addText(
    'Breeders had long chosen which pigeons, dogs or crops to breed from, and reshaped them over generations. Darwin bred pigeons himself.\n\nThis was proof: choosing who reproduces changes a population.\n\nDarwin\'s question: could nature select, without a human breeder?',
    {
      x: M + 0.24, y: colY + 0.90, w: cw - 0.48, h: colH - 1.10, color: C.ink, fontFace: F.body,
      fontSize: 13, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'model_t',
    },
  );

  const rx = M + cw + 0.30;
  card(s, { x: rx, y: colY, w: cw, h: colH, name: 'wallace' });
  s.addImage({ path: ICON('envelope', 'accentInk'), x: rx + 0.24, y: colY + 0.22, w: 0.46, h: 0.46, objectName: 'wallace_icon' });
  s.addText('ALFRED RUSSEL WALLACE', {
    x: rx + 0.82, y: colY + 0.22, w: cw - 1.02, h: 0.46, color: C.dark, fontFace: F.title,
    fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: 'wallace_h',
  });
  s.addText(
    'Working in the Malay Archipelago, Wallace reached almost the same theory independently.\n\nIn 1858, he sent Darwin an essay outlining it. Darwin had been sitting on his own theory for 20 years without publishing.\n\nTheir work was read together at the Linnean Society. Both were credited. Darwin finally published in 1859.',
    {
      x: rx + 0.24, y: colY + 0.90, w: cw - 0.48, h: colH - 1.10, color: C.ink, fontFace: F.body,
      fontSize: 13, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'wallace_t',
    },
  );
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the model, then Wallace.\n\n'
    + 'ARTIFICIAL SELECTION IS THE BRIDGE FROM "PEOPLE DO THIS ON PURPOSE" TO "NATURE DOES SOMETHING LIKE IT WITHOUT TRYING". That distinction is worth spelling out: a breeder chooses, nature does not choose, but the environment has the same effect as a choice.\n\n'
    + 'WALLACE IS THE MOST SURPRISING FACT IN THE LESSON FOR MOST STUDENTS. Two people, on opposite sides of the world, reaching the same idea at nearly the same time, is worth sitting with for a moment rather than rushing past.\n\n'
    + 'IF THERE IS TIME: Lyell and Hooker, Darwin\'s friends, arranged the joint reading, which avoided an ugly priority dispute. That is optional detail, not required for the objective.'
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
    ['"Darwin figured out evolution by studying finch beaks on the Galapagos."', 'The finches were identified as related species later, by John Gould in London, not by Darwin on the islands.'],
    ['"Darwin came up with the whole theory in a single flash of insight."', 'It came together slowly, over about 20 years, from several different influences.'],
    ['"Darwin invented the idea completely alone."', 'Alfred Russel Wallace reached an almost identical theory independently. They were credited together.'],
    ['"Artificial selection and natural selection are unrelated ideas."', 'Artificial selection gave Darwin a working model: choosing who reproduces can reshape a population.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14,
      valign: 'middle', margin: 0, lineSpacing: 18, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 7.10, y: y + 0.10, w: RIGHT - (M + 7.10) - 0.10, h: 0.72,
      fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS THE HOOK, RESTATED. If A still feels right to someone, that is worth stopping for, it is the whole point of today.\n\n'
    + 'ROW 3 IS OBJECTIVE 3, ASKED DIRECTLY. If Wallace\'s name does not come back here, that is worth a direct prompt before moving on.\n\n'
    + 'ROW 4 IS OBJECTIVE 2. Ask a follow-up: "who is doing the selecting, in nature?" Answer: nobody, survival does the same job a breeder does.'
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
    ['Name the ship Darwin sailed on.', 'HMS Beagle.'],
    ['Name the geologist whose book gave Darwin enough time for evolution to work.', 'Charles Lyell.'],
    ['Name the economist whose ideas gave Darwin the idea of a "struggle for existence".', 'Thomas Malthus.'],
    ['State what artificial selection gave Darwin a model for.', 'How choosing who reproduces can change a population over generations.'],
    ['Name the naturalist who independently reached the same theory as Darwin.', 'Alfred Russel Wallace.'],
    ['State who actually identified Darwin\'s finches as related species.', 'John Gould, an ornithologist, in London.'],
  ];
  const cw = (RIGHT - M - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10,
      x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'F3E7CE' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 12, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1-3 ARE NAMES AND FACTS, cold. If these are shaky, spend the time here rather than rushing to Q4-6.\n\n'
    + 'Q6 IS THE AVOID POINT, asked as directly as it will be all lesson.'
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
    fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'FBEAE6', 'Match it', 'Match each influence (Lyell, Malthus, the voyage, Wallace) to its role.'],
    ['SILVER', '6E8074', 'F1F2EE', 'Explain it', 'Explain artificial selection, and why it gave Darwin a model.'],
    ['GOLD', C.accentInk, 'F3E7CE', 'Describe it', 'Describe Wallace\'s role, and correct the finches legend yourself.'],
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
  s.addText('Remember: a good idea rarely arrives alone.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "was that Darwin\'s own observation, or something he read?"\n\n'
    + 'WHERE THEY WILL STALL: Gold Q9, correcting the finches legend in their own words rather than just repeating the slide.\n\n'
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
    ['1', 'Charles Lyell.'],
    ['2', 'Thomas Malthus.'],
    ['3', 'HMS Beagle, about five years.'],
    ['4', 'John Gould, in London, in 1837.'],
    ['5', 'Choosing which animals or plants to breed from, e.g. pigeon breeding.'],
    ['6', 'It showed selecting who reproduces can change a population over generations.'],
    ['7', 'It showed the Earth was old enough for gradual change to happen.'],
    ['8', 'Wallace reached almost the same theory independently in 1858. Their work was read together, and Darwin then published.'],
    ['9', 'Darwin barely noticed the finches at the time. Gould identified them as related species later, in London.'],
    ['10', 'Answers vary. Must reference at least two influences and the roughly 20-year timescale.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 11.5,
      valign: 'middle', margin: 0, lineSpacing: 14.5, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q8 AND Q9 ARE THE REAL TEST OF TODAY. Take two or three student answers out loud for each rather than reading the model answer straight off the slide.\n\n'
    + 'Q9 IS THE AVOID POINT, restated as an answer. If it is shaky, that is worth returning to before the unit moves on.'
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
    ['Darwin realised the significance of the finches while still on the Galapagos.', 'FALSE'],
    ['Charles Lyell\'s geology gave Darwin enough time for gradual change.', 'TRUE'],
    ['Thomas Malthus\'s ideas gave Darwin the idea of competition for resources.', 'TRUE'],
    ['Alfred Russel Wallace reached a very similar theory to Darwin\'s, independently.', 'TRUE'],
    ['Darwin published his theory the moment he first thought of it.', 'FALSE'],
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
      fontSize: 14.5, valign: 'middle', margin: 0, objectName: `p${i}_q`,
    });
    s.addText(v, {
      x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent,
      fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle',
      margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('A good idea rarely arrives alone. It takes time, other people\'s ideas, and often someone else reaching for it too.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 14,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q1 IS THE AVOID POINT, asked directly. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q4 IS THE HONEST TEST of whether Wallace actually landed as a real person, not a footnote. Ask a follow-up: "what would have happened if his letter had never arrived?"\n\n'
    + 'The closing line extends the Today banner. That repetition is deliberate.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

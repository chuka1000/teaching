/**
 * Y8 Science, Natural Selection, Lesson 4: Fossils and the fossil record. Class 8I.
 * Single, 50 minutes. Galapagos palette, carried on from Natural Selection, How Darwin
 * Got There and Natural Selection In Action.
 *
 * PREVIOUS: read from reference/Natural Selection In Action.pptx. It ran 8+1+2+3+11+3+5+11+3+3
 * = 50 minutes (a beak game took the Cold Call's time), had a Do Now of 8, and ended with
 * "natural selection is happening now, and nobody is choosing". It named its own next step as
 * "your call". Words already taught: variation, competition, survival, inheritance, population,
 * resistant. Its misconception rule ("nothing changes on purpose") still applies. This lesson
 * moves from evidence you can watch (finches, bacteria) to evidence left in rock, which is the
 * kind of evidence Darwin himself relied on and worried about (Origin, "On the Imperfection of
 * the Geological Record").
 *
 * THEY FOUND HARD: the brief left it blank. Nothing has been guessed at; the notes say where the
 * likely stumbling blocks are (the gaps, and "gaps mean evolution is wrong").
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5,
 * Cold Call 6, You Do 17, Plenary 3. There is no Answers slide (the worksheet's answers are
 * upside down on its last page). The You Do is a game, Dig Site (Chuka: "your call"), and the
 * worksheet is the fallback. Both I Do slides carry an animation that starts ON CLICK and
 * pauses at every stage.
 *
 * MEDIA. Everything is generated (build/media/fossils-animations.py) so nothing needs a licence
 * and every picture is exactly on the topic. No photograph is used; a real fossil photograph
 * from Wikimedia Commons would be a good addition to the Hook if you want one.
 *
 * FACTS checked against: Natural History Museum and museum guides (fossil formation needs hard
 * parts, quick burial and the right minerals); Nicolas Steno, 1669 (law of superposition);
 * William Smith, 1815 to 1819 (fossils identify strata); Tiktaalik, about 375 million years old,
 * found on Ellesmere Island, Canada, in 2004; Archaeopteryx, about 150 million years old,
 * first found in Germany in 1861; Darwin, On the Origin of Species, 1859, chapter "On the
 * Imperfection of the Geological Record"; estimates that fewer than 5% of all species that have
 * lived are known from fossils. Every number is checked in build/fossils-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Friday 9 October 2026';
const LESSON = 'Fossils And The Fossil Record';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 4';

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

/** The six-card grid used by the Do Now and the Cold Call. The number and the question share ONE vertical centre. */
function qGrid(s, o) {
  const cw = (RIGHT - M - 0.30) / 2;
  o.qs.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = o.y0 + row * (o.ch + o.gap);
    card(s, { x, y, w: cw, h: o.ch, name: `${o.p}${i}` });
    const qy = y + 0.14, cy = qy + o.qh / 2;
    s.addShape(S.ellipse, { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.p}${i}_badge` });
    s.addText(String(i + 1), { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.p}${i}_num` });
    s.addText(q, { x: x + 0.80, y: qy, w: cw - 1.02, h: o.qh, color: C.ink, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.62, w: cw - 0.44, h: 0.48,
      fill: { color: 'F3E7CE' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
  });
}
/** A machine or process animation. It starts ON CLICK (spec: effect "play"), so the teacher speaks first. */
const video = (s, file, x, y, w, h, name) => s.addMedia({
  type: 'video', path: MEDIA(`${file}.mp4`),
  cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'),
  x, y, w, h, objectName: name,
});

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
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['State how sedimentary rock forms.', 'Sand and mud settle in layers. Over a very long time they are squashed and stuck together.'],
    ['Explain why resistant bacteria become more common when antibiotics are used.', 'The antibiotic kills the others. Resistant bacteria survive and pass resistance on.'],
    ['A student says: “Evolution is only a theory, so it is just a guess.” Find the mistake.', 'A scientific theory is a well-tested explanation, backed by a huge amount of evidence.'],
    ['Sediment builds up at 2 cm every 1000 years. Calculate how long it takes to build 10 cm.', '5000 years. 10 ÷ 2 = 5, and 5 × 1000 = 5000.'],
    ['State one piece of evidence that natural selection is happening now.', 'Antibiotic resistance (MRSA), or the deeper beaks of the Daphne Major finches.'],
    ['Name two parts of an animal that could last a very long time after it dies.', 'Bones, teeth or shells.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length: there is no practical today. Six clicks.\n\n'
    + 'I READ reference/Natural Selection In Action.pptx and the two lessons before it, and checked every question against their Do Nows. Nothing here repeats them: no "name the four steps", no "what is variation", no John Gould, no "can one animal evolve". The six are six different skills.\n\n'
    + 'Q1 IS AN EARTH-SCIENCE LINK (chemistry at KS3): sedimentary rock. Today\'s lesson sits on it, because a fossil is a sedimentary-rock story. Accept "layers of sand and mud, squashed and cemented". Q2 LOOKS BACK TO LAST LESSON: the answer has to say survive AND pass on. Q3 IS A YEAR 7 IDEA BROUGHT BACK, and it matters today: students hear "just a theory" about evolution. The scientific meaning is a well-tested explanation backed by a huge amount of evidence, and fossils are part of that evidence.\n\n'
    + 'Q4 IS THE ONE NUMBER, and it plants deep time: 10 cm at 2 cm per 1000 years is 5000 years. Watch for 20 (10 × 2) and for 5 (they forgot the 1000). Rock layers take a very long time to build, and that idea returns in the We Do.\n\n'
    + 'Q5 ASKS FOR EVIDENCE, not the process. Any real example from last lesson is fine. Q6 IS PLANTED for the first half: bones, teeth, shells. Do not explain why yet.\n\n'
    + 'THE BRIEF LEFT "THEY FOUND HARD" BLANK. I have not guessed this time; the likely stumbling blocks (gaps, and "gaps disprove evolution") are flagged in the notes on slides 5, 6 and 9.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. OBJECTIVES · 1
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 1, 'light'));
  pill(s, 'Objectives', 1, 'light');
  title(s, 'Objectives', 'light');
  const GOALS = [
    'Describe how a fossil forms.',
    'Explain what the order of fossils in rock layers tells us.',
    'Explain why the fossil record has gaps.',
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
  s.addText('Few living things become fossils. The rocks give the order.', {
    shape: S.roundRect, rectRadius: 0.12, x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 }, color: C.accent, fontFace: F.body, fontSize: 17, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Lesson 1 was what natural selection is, lesson 2 how Darwin got there, lesson 3 evidence you can watch now (finches, bacteria). Today is evidence from the past, left in rock. Darwin knew fossils were both his best evidence and his biggest worry: a chapter of the Origin is called "On the Imperfection of the Geological Record". That is objective 3.\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING AND ARE TAUGHT IN ORDER: I Do 1 is how a fossil forms, I Do 2 is the order and the gaps.\n\n'
    + 'THE BANNER IS THE LESSON IN ONE LINE. Two halves: fossils are rare (so there are gaps), and the rocks give the order (so the fossils tell a story). Say both halves.'
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
  s.addText('Which of these is most likely to become a fossil?', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  const OPTS = [
    ['A', 'jellyfish', 'A jellyfish that dies in the open sea.'],
    ['B', 'clam', 'A clam that dies on the sea floor and is quickly covered in mud.'],
    ['C', 'fern', 'A leaf that falls on a forest floor and is left there.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3, cy = 2.30, ch = 3.90;
  OPTS.forEach(([k, ic, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: cy, w: cw, h: ch, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: cy + 0.20, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addImage({ path: ic === 'clam' ? MEDIA('clam-accentink.png') : ICON(ic, 'accentInk'), x: x + (cw - 1.50) / 2, y: cy + 0.55, w: 1.50, h: 1.50, objectName: `h${i}_icon` });
    s.addText(txt, {
      x: x + 0.30, y: cy + 2.28, w: cw - 0.60, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'top', margin: 0, lineSpacing: 22, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: the next slide does.\n\n'
    + 'ANSWER, FOR YOU: B. It has a hard shell, and it is buried quickly in mud. Every card has the same two questions hidden in it: does it have hard parts, and is it buried fast? A jellyfish is soft and drifts in open water, so it rots or is eaten. A leaf on a forest floor is left on the surface to rot. Only the clam has both.\n\n'
    + 'EXPECT A SPLIT BETWEEN A AND B. Students who pick A say "the sea is where fossils come from". Ask them what is left of a jellyfish on a beach after a day. That is objective 3 arriving early: it is the reason for most of the gaps.\n\n'
    + 'DO NOT SAY "HARD PARTS" OR "BURIED" YET. Those words are the first I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — how a fossil forms
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'How a fossil forms', 'light');
  const vw = 6.50, vh = vw * 600 / 960;
  video(s, 'fossils-formation', M, 1.90, vw, vh, 'vid_formation');
  banner(s, 'Hard parts, buried fast.', { x: M, y: 1.90 + vh + 0.20, w: vw, h: 0.66, size: 19, name: 'form_banner' });
  const STEPS = [
    'The animal dies.',
    'Mud and sand bury it quickly.',
    'The soft parts rot. The hard parts stay.',
    'The layers turn to rock. Minerals turn the hard parts to stone.',
    'The rock is lifted and worn away. The fossil is found.',
  ];
  const sx = M + vw + 0.30, sw = RIGHT - sx, sh = 0.86, sg = 0.13;
  STEPS.forEach((t, i) => {
    const y = 1.90 + i * (sh + sg);
    card(s, { x: sx, y, w: sw, h: sh, name: `fs${i}` });
    badge(s, { x: sx + 0.18, y: y + (sh - 0.42) / 2, n: i + 1, name: `fs${i}` });
    s.addText(t, { x: sx + 0.82, y, w: sw - 0.98, h: sh, color: C.ink, fontFace: F.body, fontSize: 13.5, bold: true, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `fs${i}_t` });
  });
  s.addNotes(
    'I DO. 3 minutes. Seven clicks: the animation first (click 1), then the five steps one at a time, then the banner. The animation STARTS ON CLICK, so say the question first and press play when you want them to watch.\n\n'
    + 'THE ANIMATION (about 27 seconds). One clam, five stages. It PAUSES at each one: nothing moves while the caption is being read. (1) The clam dies on the sea floor, the soft body pink inside the shell. (2) Mud and sand fall and cover it. (3) The soft body rots away, leaving an empty shell. (4) More layers build up, everything turns to rock, "millions of years", and minerals turn the shell to stone. (5) The sea has gone and the rock is worn away, so the fossil shows at the surface. Talk over the pauses, and click the video to play it again.\n\n'
    + 'THE TWO CONDITIONS ARE THE WHOLE OF OBJECTIVES 1 AND 3: HARD PARTS AND QUICK BURIAL. Hard parts (bones, teeth, shells, wood) last long enough to be buried. Quick burial protects the body from scavengers, from oxygen and from rotting. A body that has neither is gone in weeks. Say the banner three times. It is the answer to the Hook: the clam has both.\n\n'
    + 'MINERALS. Water in the rock is rich in dissolved minerals, and they fill or replace the hard parts, particle by particle, so the shell becomes stone in the shape of a shell. It is NOT the original shell, and it is not "bone that has gone hard". This is We Do row 4. Depending on the minerals it can take from a few years to much longer.\n\n'
    + 'ROCK, NOT MUD. Sediment turns to sedimentary rock as more layers press down and minerals glue it together. That is Do Now Q1: point back at it.\n\n'
    + 'STEP 5 IS EASY TO SKIP. A fossil in a rock nobody ever sees is not a discovery. The rock has to be lifted (movements of the Earth) and worn away (weather, rivers, sea) so that it shows. Sometimes that happens; often it does not, which is gap number three.\n\n'
    + 'IF THEY ASK "HOW LONG?": it varies. The shape of the shell can be preserved in a few thousand years; most fossils people find are millions of years old.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — the order, and the gaps
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'What the layers tell us', 'light');
  const vw = 4.60, vh = vw * 1040 / 960;
  video(s, 'fossils-layers', M, 1.90, vw, vh, 'vid_layers');
  const rx = M + vw + 0.30, rw = RIGHT - rx;
  // the order
  card(s, { x: rx, y: 1.90, w: rw, h: 2.80, name: 'ord' });
  s.addText('THE ORDER', { x: rx + 0.28, y: 2.00, w: rw - 0.56, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ord_h' });
  s.addText([
    { text: 'Deeper layers are older. Higher layers are younger.', options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Different layers hold different fossils. Living things change over time, and some die out.', options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Some fossils show the change. Tiktaalik (about 375 million years old) had fins and the bones of a limb. Archaeopteryx (about 150 million years old) had feathers and teeth.', options: { bullet: true } },
  ], { x: rx + 0.28, y: 2.44, w: rw - 0.56, h: 2.18, color: C.ink, fontFace: F.body, fontSize: 13, bold: true, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: 'ord_t' });
  // the gaps
  card(s, { x: rx, y: 4.85, w: rw, h: 2.05, name: 'gap' });
  s.addText('THE GAPS', { x: rx + 0.28, y: 4.93, w: 1.6, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'gap_h' });
  s.addText('Most living things never become fossils.', { x: rx + 1.95, y: 4.93, w: rw - 2.15, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'middle', margin: 0, objectName: 'gap_s' });
  const GAPS = ['Soft bodies rot before they can be buried.', 'Rock is worn away, squashed or melted.', 'Many fossils are not found yet.'];
  const gw = (rw - 0.56 - 2 * 0.14) / 3;
  GAPS.forEach((g, i) => {
    const x = rx + 0.28 + i * (gw + 0.14);
    s.addText(g, {
      shape: S.roundRect, rectRadius: 0.10, x, y: 5.45, w: gw, h: 1.30, fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.08, lineSpacing: 16, objectName: `gp${i}`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: the animation, the order card, the gaps header, then the three gaps. The animation STARTS ON CLICK.\n\n'
    + 'THE ANIMATION (about 29 seconds). Three layers form one on top of another, each burying a different fossil: a trilobite first, an ammonite next, a mammal bone last. It pauses on each. Then the layers are rock, labelled oldest, older, youngest, and an arrow says older at the bottom and younger at the top. It is a cross-section and NOT TO SCALE; say so.\n\n'
    + 'THE ORDER. Nicolas Steno stated it in 1669: in layers that have not been disturbed, the oldest is at the bottom, because it had to be there first. It sounds obvious and it is the key to everything. From the early 1800s William Smith showed that layers in different places could be matched by their fossils. Two things follow: (1) the fossils are in an order, and the order is time; (2) the fossils in the layers change from layer to layer, which is evidence that living things change, and that some kinds die out.\n\n'
    + 'THE TWO EXAMPLES. Tiktaalik was found on Ellesmere Island, in Arctic Canada, in 2004, and is about 375 million years old. It is a fish with a flat head, a neck, and the bones of a limb inside its fins. Archaeopteryx was found in Germany in 1861, two years after the Origin, and is about 150 million years old: feathers like a bird, teeth and a bony tail like a reptile. Both sit between two groups. Do not call them "missing links" (there is no single chain), say "they show the change".\n\n'
    + 'THE GAPS. Three reasons, one card each: soft bodies rot (Hook A, jellyfish); rock is worn away, squashed or melted (a fossil can form and then be destroyed); many fossils are simply not found yet (under the sea, under cities, in places nobody has dug). Fewer than one in twenty of all the kinds of living thing that have lived are known from fossils; the true figure is unknown and probably much lower.\n\n'
    + 'THE MISCONCEPTION TO PRE-EMPT: "gaps mean evolution is wrong". Say it out loud now, and We Do row 3 finishes it. Darwin raised the gaps himself in 1859 and gave the same reasons. Gaps are what you would expect if fossils are rare; a gap is not evidence against.'
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
    ['"The deepest layer has the youngest fossils."', 'Deeper layers were laid down first, so their fossils are the oldest.'],
    ['"Jellyfish are common fossils because there were millions of them."', 'Jellyfish have no hard parts. They rot before they can be buried, so they rarely fossilise.'],
    ['"There are gaps in the fossil record, so evolution did not happen."', 'Very few living things become fossils, so gaps are expected. The fossils we have show change over time.'],
    ['"A fossil is the animal\'s real body, unchanged."', 'Minerals replace the hard parts and turn them to stone. The shape stays.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74,
      fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 2. If a student defends it, ask "which layer was laid down first?" and let them answer with the animation in mind. The exception is worth one sentence for a keen student: mountain building can fold or turn rocks upside down, and then scientists use the fossils themselves to work out which way up the layers were. Hold it for a question.\n\n'
    + 'ROW 2 IS THE HOOK, WORKED. Do Now Q6 (bones, teeth, shells) and the banner from I Do 1 do the work. Ask which of the two conditions a jellyfish fails, and take both: it has no hard parts, and it is usually not buried before it rots.\n\n'
    + 'ROW 3 IS THE ONE THAT MATTERS MOST. It is objective 3, and it is the one people repeat as adults ("there are missing links, so it is not true"). Two moves: (1) gaps are expected, because fossils are rare; the record is a few pages torn out of a huge book; (2) the fossils we do have show change over time, and new fossils keep filling gaps (Tiktaalik was found by looking in rocks of the right age in the right kind of place). Darwin said the same thing in 1859.\n\n'
    + 'ROW 4 IS THE MINERALS POINT. The shape of the shell is real; the material is not. It is a stone copy. If a student says "petrified", accept it.'
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
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, qs: [
    ['State two parts of an animal that can become fossils.', 'Bones, teeth or shells.'],
    ['State why quick burial helps a fossil to form.', 'It protects the body from scavengers and from rotting away.'],
    ['A shell is in a higher layer than a fish bone. State which is older.', 'The fish bone. Deeper layers are older.'],
    ['State what different fossils in different layers show about living things.', 'They change over time, and some die out.'],
    ['Explain why jellyfish are rare in the fossil record.', 'No hard parts, so they rot before they can be buried.'],
    ['State one reason, other than soft bodies, why the fossil record has gaps.', 'Rock is worn away, squashed or melted, or fossils are not found yet.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q1 is Do Now Q6 again; it should be easy. For Q2, "so it does not rot" is a good answer; the best answers name the scavengers and the air.\n\n'
    + 'Q3 AND Q4 ARE OBJECTIVE 2. Q3 needs "deeper is older" and nothing else. Q4 needs two things: they change, and some die out (accept "go extinct").\n\n'
    + 'Q5 AND Q6 ARE OBJECTIVE 3. For Q5 the full answer is no hard parts, so they rot before they are buried. For Q6 accept either of the other two reasons: rock destroyed (worn away, squashed, melted), or not found yet. If someone says "they did not exist", ask them to say more: it is a common half-answer that confuses a gap in the record with a gap in life.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6, and ask "which of the gaps could scientists fix?" (Not found yet. Go and look.) IF SHORT OF TIME, cut Q1 and Q3.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 17: the game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 17, 'light'));
  pill(s, 'You Do', 17, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, {
    x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const ROUNDS = [
    ['ROUND 1', C.alert, 'FBEAE6', 'How fossils form', 'Hard parts, quick burial, and the steps in order.'],
    ['ROUND 2', '6E8074', 'F1F2EE', 'Reading the layers', 'Which layer is oldest? What lived when? How long between?'],
    ['ROUND 3', C.accentInk, 'F3E7CE', 'Beat the rock', 'Very hard. The last questions are meant to be almost impossible. Do what you can.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  ROUNDS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.10, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.00, color: C.inkSoft, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 2.86, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS DIG SITE, and the worksheet is the fallback.\n\n'
    + 'WHAT THEY DO. Open the file "Fossils And The Fossil Record game" from Google Classroom. Three rounds of six questions, each on their own device. Some are multiple choice (tap or press 1 to 4), some are numbers (type an answer and press Check). A wrong answer says what the mistake probably was and how to get to the right one. EVERY STUDENT GETS A DIFFERENT GAME: different organisms, different rock layers, different numbers, in a different order, so a neighbour\'s answers are no use. The skills and their order are the same for everyone, so the end screen means the same thing for all of them. Each game has a six-character code, shown on the start and end screens. If a student says a question looked wrong, add #CODE to the end of the file\'s address and you will see exactly what they saw. There are no lives and no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 is how a fossil forms (objective 1). Round 2 is reading a picture of rock layers (objective 2): which is oldest, which is older, how many layers came before, which lived at the same time as which, and how many years between two layers. Round 3 goes well past the lesson: matching layers at two different sites by their fossils, working out which layer contains X and Z but not Y, rock that has been turned upside down, how many stages of time are missing, and two puzzles that are meant to be almost impossible. Expect most students to fail questions 17 and 18. That is the design. Tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and whether it was right and, for a wrong one, what the student wrote and how to get to the answer. Use it when you sit with a student. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with a rock-layers diagram, and the answers printed UPSIDE DOWN on its last page for students to check.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which layer was laid down first?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
  );
}

/* ================================================================== *
 * 9. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');
  const QS = [
    ['A fossil is the whole body of an animal, unchanged.', 'FALSE'],
    ['In rock that has not been disturbed, the deepest layers are the oldest.', 'TRUE'],
    ['Gaps in the fossil record show that evolution did not happen.', 'FALSE'],
    ['Most living things become fossils.', 'FALSE'],
    ['An animal with a hard shell is more likely to become a fossil than a jellyfish.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Fossils are rare. The rocks give the order.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q5 SETTLES THE HOOK. Go back to the tally. The clam had a hard shell and was quickly covered; the jellyfish had neither. So B.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: a fossil is a stone copy, with the original replaced by minerals (We Do row 4). Q3 IS THE ONE TO WATCH, objective 3: gaps are expected because fossils are rare, and the fossils we have show change over time. If the room splits on Q3, that is the first thing to reteach. Q4: most living things leave nothing at all.\n\n'
    + 'Q2 IS OBJECTIVE 2 IN ONE SENTENCE, and it is TRUE with a condition: "not been disturbed". You do not have to raise the overturned-rock exception; the game does, in round 3.\n\n'
    + 'THE CLOSING LINE ENDS THE LESSON on the two halves of the banner. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on: fossils show that living things change, but how old are they? Dating rocks is the natural next question, and it uses the same layers.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

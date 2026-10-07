/**
 * Y8 Science, Natural Selection, Lesson 6: More evidence: bones, embryos and DNA. Class 8I.
 * Single, 50 minutes. Galapagos palette, carried on from the unit.
 *
 * PREVIOUS: read from reference/Fossils And The Fossil Record.pptx (your edited copy). Nine slides,
 * 10+1+2+3+3+5+6+17+3 = 50 minutes, a Do Now of 10, a game as the You Do, no Answers slide. It ended
 * on "fossils are rare, the rocks give the order" and made no promise. Your edits carried over: the
 * phase pill on the second slide says TODAY while the title says Objectives, and banners are one whole
 * sentence with the key words underlined. Vocabulary already taught: variation, competition, survival,
 * inheritance, population, resistant, fossil, sediment, layer, gap, extinct, evidence, theory.
 *
 * THEY FOUND HARD: not stated in the brief; nothing guessed. The notes flag the likely stumbling
 * blocks (similar job means related; a human embryo turns into a fish; humans evolved from chimpanzees).
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6,
 * You Do 17, Plenary 3. The You Do is a game, Family Tree ("your call"), with the worksheet as the
 * fallback. Both I Do slides carry an animation that starts ON CLICK and pauses at every stage.
 *
 * MEDIA. All generated (build/media/evidence-animations.py). The embryo pictures are a schematic drawn
 * from one shape, not Haeckel's drawings, which exaggerated how alike embryos are.
 *
 * FACTS checked against: museum and textbook sources for the pentadactyl limb (one upper bone, two
 * lower bones, wrist bones, hand and finger bones in human, cat, whale and bat); chordate embryo
 * features (a post-anal tail and pharyngeal arches in all vertebrate embryos); human and chimpanzee DNA
 * about 98.8% alike in the parts that can be lined up, and lower for whole-genome comparisons; mouse and
 * human protein-coding DNA about 85% alike (Mouse Genome Sequencing Consortium, Nature 2002); DNA
 * structure 1953 (Watson and Crick, with X-ray data from Rosalind Franklin and colleagues). Every number
 * is checked in build/more-evidence-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Monday 12 October 2026';
const LESSON = 'More Evidence';
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 5';

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


/** A banner that is one whole sentence with the key words underlined: [[text, underline], ...]. */
function sentence(slide, parts, o) {
  slide.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
    shape: S.roundRect, rectRadius: 0.12, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true, align: 'center', valign: 'middle', margin: 0.12, lineSpacing: (o.size ?? 16) + 5, objectName: o.name,
  });
}

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, { x: 3.20, y: 0.22, w: 6.90, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['Explain why the deepest layers of undisturbed rock hold the oldest fossils.', 'Layers are laid down one on top of another, so the bottom layer was laid down first.'],
    ['Name the molecule that carries the instructions for building a living thing.', 'DNA.'],
    ['Two species differ at 4 of 200 DNA letters. Calculate the percentage that is the same.', '98%. 200 − 4 = 196, and 196 ÷ 200 × 100 = 98.'],
    ['A student says: “Fossils are the only evidence for evolution.” Find the mistake.', 'There is more: we can watch natural selection now, in finches and bacteria.'],
    ['State what a vertebrate is.', 'An animal with a backbone.'],
    ['State whether the average beak depth of the finches went up or down after the 1977 drought.', 'Up: 9.42 mm to 9.96 mm. The survivors had deeper beaks.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length: there is no practical today. Six clicks.\n\n'
    + 'I READ reference/Fossils And The Fossil Record.pptx, your edited copy, and checked every question against the last three Do Nows (Fossils, Natural Selection In Action, Natural Selection). Nothing repeats: no "state how sedimentary rock forms", no "name the four steps", no "just a theory", no John Gould. The six are six different skills.\n\n'
    + 'Q1 LOOKS BACK to last lesson\'s objective 2 in a new shape: "why is the bottom layer the oldest". Q2 PLANTS THE THIRD OBJECTIVE: DNA (this is KS3 biology, from cells and inheritance). Accept "DNA" and, for a keen student, "a chemical in the nucleus". Q3 IS THE ONE CALCULATION and it plants how DNA gets compared: 4 differences out of 200 letters is 196 the same, and 196 ÷ 200 = 0.98, so 98%. Watch for 4% (they gave the differences, not the matches) and for 196.\n\n'
    + 'Q4 IS A SPOT-THE-ERROR that sets up the whole lesson: fossils are one kind of evidence, and today is three more. Q5 PLANTS "vertebrate" for the embryo slide. Q6 IS RETRIEVAL from two lessons ago (Daphne Major): the beak depth went UP, from 9.42 mm to 9.96 mm.\n\n'
    + 'NOTE ON YOUR EDITS. I copied two things from your edited fossils deck into this one: the phase pill on the second slide says TODAY while the title says Objectives, and banners are one whole sentence with the key words underlined. Both are now in CLAUDE.md.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Objectives', 'light');
  const GOALS = ['Explain what homologous structures show.', 'Describe what similarities in early development suggest.', 'Explain why DNA is the strongest evidence we have.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Bones, embryos and DNA all point to a ', false], ['shared ancestor', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Lessons 1 to 3 were natural selection, how Darwin got there, and evidence you can watch now. Last lesson was evidence from the past, in rock: fossils. Today is three more kinds of evidence that living things are related: the bones of living animals, their embryos, and their DNA. Say "last lesson the evidence was in rocks, today it is inside living things".\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING AND ARE TAUGHT IN ORDER: I Do 1 is the bones, I Do 2 is embryos and then DNA.\n\n'
    + 'THE BANNER IS THE LESSON IN ONE SENTENCE. Three different kinds of evidence, one conclusion. The phrase to underline in your head is "shared ancestor": every piece of evidence today is a way of showing it.'
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
  s.addText('A bat\'s wing and a human arm have the same bones. Why?', {
    x: M, y: 0.86, w: RIGHT - M - 3.00, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('bat', 'accentInk'), x: RIGHT - 2.85, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_bat' });
  s.addImage({ path: ICON('person', 'accentInk'), x: RIGHT - 1.30, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_person' });
  const OPTS = [
    ['A', 'By chance. Bats and humans just happen to have the same bones.'],
    ['B', 'Bats and humans share an ancestor. It had these bones, and its descendants inherited them.'],
    ['C', 'Bats needed arms to fly, so their wings grew arm bones.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.60, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.40, w: cw - 0.56, h: 1.70, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: the next slide does.\n\n'
    + 'ANSWER, FOR YOU: B. A says coincidence: the same bones, in the same order, in animals that live completely differently, is far too much to be chance. C is the wording this whole unit has been removing: "needed" and "so their wings grew". Nothing needs anything. Nothing grows on purpose. Expect A and C to attract votes; B is the least intuitive because it needs the word ancestor.\n\n'
    + 'DO NOT SAY "HOMOLOGOUS" YET. It is the first word on the next slide, and the banner there answers this question.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — homologous structures
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Same bones, different jobs', 'light');
  const vw = 6.50, vh = vw * 600 / 960;
  video(s, 'evidence-limbs', M, 1.90, vw, vh, 'vid_limbs');
  sentence(s, [['Homologous structures have the ', false], ['same bones', true], [' but ', false], ['different jobs', true], [', so the animals ', false], ['share an ancestor', true], ['.', false]], { x: M, y: 1.90 + vh + 0.20, w: vw, h: 0.86, size: 15, name: 'hom_banner' });
  const STEPS = [
    'Look at the bones. The same bones, in the same order, in all four limbs.',
    'Look at the jobs. Grasping, walking, swimming and flying are all different.',
    'Structures like this are called homologous.',
    'They were inherited from a common ancestor. The bones changed, over generations, to suit each way of life.',
  ];
  const sx = M + vw + 0.30, sw = RIGHT - sx, sh = 1.06, sg = 0.13;
  STEPS.forEach((t, i) => {
    const y = 1.90 + i * (sh + sg);
    card(s, { x: sx, y, w: sw, h: sh, name: `hs${i}` });
    badge(s, { x: sx + 0.18, y: y + (sh - 0.42) / 2, n: i + 1, name: `hs${i}` });
    s.addText(t, { x: sx + 0.82, y, w: sw - 0.98, h: sh, color: C.ink, fontFace: F.body, fontSize: 13, bold: true, valign: 'middle', margin: 0, lineSpacing: 16.5, objectName: `hs${i}_t` });
  });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: the animation first (click 1), then the four cards one at a time, then the banner. The animation STARTS ON CLICK, so ask "what do you notice?" and press play when you want them to look.\n\n'
    + 'THE ANIMATION (about 24 seconds). Four forelimbs: a human arm, a cat\'s foreleg, a whale\'s flipper and a bat\'s wing, in grey with the job underneath each. It pauses at every stage, and colours one group of bones at a time in all four: the upper-arm bone (red), the two lower-arm bones (amber), the wrist bones (teal), then the hand and finger bones (dark green and violet). By the end the same colours run in the same order down every limb. The lengths are very different (the bat\'s fingers are enormous, the whale\'s wrist is a small block) but the sequence is one, then two, then a wrist, then the hand. Click the video to play it again.\n\n'
    + 'THE NEW WORD IS HOMOLOGOUS. Say it means "the same underlying structure". Homologous structures share a plan, not a job. The everyday version of this, and the one to leave them with, is "same bones, different jobs".\n\n'
    + 'WHY THIS SUGGESTS AN ANCESTOR. If the four animals had been built separately for their jobs, there is no reason they would share a bone plan: a good flipper does not need a wrist. The simplest explanation is that they inherited the plan from a common ancestor with a four-limbed body, and natural selection changed the details for each way of life over many generations. This is the Hook answer B. Nothing was designed and nothing was needed: variation, survival, inheritance, again.\n\n'
    + 'THE COMMON MISCONCEPTION IS THE OPPOSITE ONE: "things that do the same job are related". A bird\'s wing and a butterfly\'s wing both fly, but they do not have the same structure (a butterfly wing is a thin sheet with no bones at all). Similar jobs with different structures are called analogous. You do not have to teach that word today; We Do row 2 uses the idea.\n\n'
    + 'IF THEY ASK "IS IT ONLY LIMBS?": no. The same plan appears in all land vertebrates and their relatives. The bones in the human middle ear (three) are homologous with jaw bones in reptiles. Hold that for a keen student.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — embryos, then DNA
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Early development, and DNA', 'light');
  const vw = 4.60, vh = vw * 1040 / 960;
  video(s, 'evidence-embryos', M, 1.90, vw, vh, 'vid_embryos');
  const rx = M + vw + 0.30, rw = RIGHT - rx;
  card(s, { x: rx, y: 1.90, w: rw, h: 2.20, name: 'emb' });
  s.addText('EARLY DEVELOPMENT', { x: rx + 0.28, y: 1.98, w: rw - 0.56, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'emb_h' });
  s.addText([
    { text: 'Early vertebrate embryos look alike. All have a tail and pharyngeal arches.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Later they become very different animals. A human never turns into a fish.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Similar early development suggests a shared ancestor.', options: { bullet: true } },
  ], { x: rx + 0.28, y: 2.40, w: rw - 0.56, h: 1.62, color: C.ink, fontFace: F.body, fontSize: 13, bold: true, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: 'emb_t' });
  card(s, { x: rx, y: 4.25, w: rw, h: 2.65, name: 'dna' });
  s.addText('DNA', { x: rx + 0.28, y: 4.33, w: 1.0, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'dna_h' });
  s.addText('The more alike two species\' DNA, the more closely related they are.', { x: rx + 1.10, y: 4.33, w: rw - 1.38, h: 0.40, color: C.inkSoft, fontFace: F.body, fontSize: 12, bold: true, valign: 'middle', margin: 0, objectName: 'dna_s' });
  const BARS = [['Human and chimpanzee', 98], ['Human and mouse', 85]];
  const bx = rx + 0.28, bw = rw - 0.56;
  BARS.forEach(([lab, pct], i) => {
    const y = 4.86 + i * 0.52;
    s.addText(lab, { x: bx, y, w: 2.0, h: 0.40, color: C.ink, fontFace: F.body, fontSize: 11.5, bold: true, valign: 'middle', margin: 0, objectName: `dna_l${i}` });
    s.addShape(S.roundRect, { x: bx + 2.05, y: y + 0.05, w: bw - 2.05 - 0.95, h: 0.30, rectRadius: 0.06, fill: { color: C.tintDeep }, line: { color: C.tintDeep, width: 0 }, objectName: `dna_t${i}` });
    s.addShape(S.roundRect, { x: bx + 2.05, y: y + 0.05, w: (bw - 2.05 - 0.95) * pct / 100, h: 0.30, rectRadius: 0.06, fill: { color: C.support }, line: { color: C.support, width: 0 }, objectName: `dna_b${i}` });
    s.addText(`about ${pct}%`, { x: bx + bw - 0.90, y, w: 0.90, h: 0.40, color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: `dna_p${i}` });
  });
  s.addText([
    { text: 'DNA can be compared for every living thing, even ones with no bones or fossils.', options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'It gives numbers, and it agrees with the bones and the fossils.', options: { bullet: true } },
  ], { x: rx + 0.28, y: 5.92, w: rw - 0.56, h: 0.90, color: C.ink, fontFace: F.body, fontSize: 12, bold: true, valign: 'top', margin: 0, lineSpacing: 15, objectName: 'dna_t' });
  s.addNotes(
    'I DO. 3 minutes. Eight clicks: the animation, the early-development card, the DNA card and its two bars, and the two lines under them. The animation STARTS ON CLICK.\n\n'
    + 'THE ANIMATION (about 23 seconds). Three early embryos, fish, chicken and human, drawn from ONE simple shape. Stage 2 marks the two features they share: a tail, and pharyngeal arches (the bulges on the neck). Stage 3 shows the three grown-up animals, very different. Stage 4 says: similar early development suggests a shared ancestor. These are our own schematic pictures, not the famous ones by Ernst Haeckel in the 1860s and 1870s, which exaggerated how alike embryos are. Real embryos are alike in those features, and in nothing like as many as his drawings claimed.\n\n'
    + 'WHAT THE EMBRYOS SHOW. All vertebrates start with a tail and pharyngeal arches. In a fish the arches become gills. In a human they become parts of the jaw, ear and neck, and the tail shrinks away before birth (what is left is the tailbone). We do NOT have gills as an embryo: they are arches that in fish become gills. So the sentence for students is "similar early development suggests a shared ancestor", and never "a human embryo turns into a fish". That is We Do row 3.\n\n'
    + 'DNA. Every living thing has DNA, and it can be compared letter by letter. The more alike two species\' DNA, the more closely related they are. THE TWO BARS ARE ABOUT AND NEED CARE: humans and chimpanzees are about 98% alike in the parts of the DNA that can be lined up letter by letter (the figure usually quoted is 98.8%; whole-genome comparisons that count insertions and deletions give a lower figure). Humans and mice are about 85% alike in the protein-coding parts of the DNA. Do not let the bars turn into "we are 98% chimpanzee": they mean the two species share a recent ancestor. Humans did NOT evolve from chimpanzees.\n\n'
    + 'WHY DNA IS THE STRONGEST EVIDENCE, the two lines under the bars. (1) It can be compared for every living thing, including ones that leave no fossils and have no bones. (2) It gives exact numbers, and a family tree built from DNA agrees with the ones built from bones and from fossils, which was not guaranteed. Two more, if you have time: Darwin knew nothing about DNA (its structure was worked out in 1953 by Watson and Crick, using X-ray images made by Rosalind Franklin and her colleagues), so it is independent evidence he could not have had; and changes in DNA build up at a roughly steady rate, so differences can be used as a clock.'
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
    ['"A bat wing and a human arm have the same bones by coincidence."', 'The same bones in the same order, in animals with different jobs, come from a shared ancestor.'],
    ['"A bird\'s wing and a butterfly\'s wing are homologous because both fly."', 'Homologous means the same bones, not the same job. A butterfly wing has no bones at all.'],
    ['"A human embryo turns into a fish, then into a human."', 'Early embryos share a tail and pharyngeal arches because of a shared ancestor. Nothing turns into another animal.'],
    ['"Humans evolved from chimpanzees, because their DNA is 98% the same."', 'Humans and chimpanzees share a common ancestor. Their DNA is alike because they are closely related.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'F3E7CE' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS THE HOOK, WORKED, and objective 1. If someone defends "coincidence", ask what the chance is of the same five groups of bones, in the same order, turning up in four unrelated animals.\n\n'
    + 'ROW 2 IS THE MOST COMMON CONFUSION IN THIS TOPIC: similar job means related. The correction is the definition of homologous (same structure) versus analogous (same job, different structure). The butterfly wing is a thin sheet of chitin with veins, the bird wing is a limb with bones. They evolved separately, and for the same job.\n\n'
    + 'ROW 3 IS OBJECTIVE 2 AND THE OLDEST MISCONCEPTION HERE ("ontogeny recapitulates phylogeny"). Say it plainly: nothing turns into a fish. A human embryo has pharyngeal arches, which in a fish become gills and in a human become parts of the jaw and ear. What the shared features show is a shared ancestor, not a ladder.\n\n'
    + 'ROW 4 IS OBJECTIVE 3 AND THE ONE PEOPLE REPEAT AS ADULTS. Similar DNA means recent shared ancestor, not descent. Humans and chimpanzees are like cousins, not parent and child: both descend from an ancestor that lived millions of years ago. The 98% figure is for the parts of DNA that can be lined up (see the notes for the last slide but one).'
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
    ['State what homologous structures are.', 'Structures with the same bones in the same order but different jobs.'],
    ['A human arm and a whale flipper have the same bones. Explain what this suggests.', 'They share a common ancestor that had these bones.'],
    ['State two features that early vertebrate embryos share.', 'A tail and pharyngeal arches.'],
    ['Explain why a human embryo does not turn into a fish.', 'The features are shared because of a shared ancestor. No animal turns into another.'],
    ['Species A and B share 99% of their DNA. Species A and C share 90%. State which pair is more closely related.', 'A and B.'],
    ['Explain why DNA is stronger evidence than bones.', 'It works for every living thing, even ones with no bones. It gives numbers and agrees with the bones and fossils.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q1 needs both halves of the definition: same bones, different jobs. Q2 needs the word ancestor; "they are related" is half an answer, so ask "related how?".\n\n'
    + 'Q3 AND Q4 ARE OBJECTIVE 2. Q3 is a tail and pharyngeal arches ("gill slits" is acceptable if they use the older name; say pharyngeal arches back). Q4 is the We Do row 3 idea: nothing turns into another animal; shared features come from a shared ancestor.\n\n'
    + 'Q5 AND Q6 ARE OBJECTIVE 3. Q5 is a reasoning step: 99% is more alike than 90%, so A and B are closer. Q6 is the answer to "why is DNA the strongest": it can be compared for every living thing, even ones that leave no bones or fossils; it gives exact numbers; and it agrees with the bones and the fossils. Two of the three is a good answer.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6, and ask "what could DNA tell us that bones cannot?" (How closely related two very different species are, for example a whale and a hippopotamus.) IF SHORT OF TIME, cut Q1 and Q3.'
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
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', C.alert, 'FBEAE6', 'Bones', 'Which structures are homologous? Same bones, or same job?'],
    ['ROUND 2', '6E8074', 'F1F2EE', 'Early development', 'What do early embryos share? What does it suggest?'],
    ['ROUND 3', C.accentInk, 'F3E7CE', 'DNA and family trees', 'DNA differences and trees. Very hard. The last questions are meant to be almost impossible.'],
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
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS FAMILY TREE, and the worksheet is the fallback.\n\n'
    + 'WHAT THEY DO. Open the file "More Evidence game" from Google Classroom. Three rounds of six questions, each on their own device. Some are multiple choice (tap or press 1 to 4), some are numbers (type an answer and press Check). A wrong answer says what the mistake probably was and how to get to the right one. EVERY STUDENT GETS A DIFFERENT GAME: different structures, different embryo tables, different DNA numbers and trees, in a different order, so a neighbour\'s answers are no use. The skills and their order are the same for everyone, so the end screen means the same thing for all of them. Each game has a six-character code, shown on the start and end screens. If a student says a question looked wrong, add #CODE to the end of the file\'s address and you will see exactly what they saw. There are no lives and no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 is bones (homologous or analogous, the order of the bones from the shoulder, which is the odd one out in a table of bone counts). Round 2 is embryos (which features are shared, which species has the most similar embryo, what nothing turns into). Round 3 is DNA: percentages, the closest relative from a table, the most recent common ancestor, a family tree, and then two questions drawn from small pools of very hard templates: adding branch lengths on a tree, working out a branch from three DNA differences, and using DNA differences as a clock (a difference builds up on BOTH lineages, so the time since the split is half of what most students first write). Expect most students to fail questions 17 and 18. That is the design. Tell them before they start. All the species in round 3 are invented and so are the numbers: the puzzles are about the reasoning.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and whether it was right and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with a diagram of the four limbs, and the answers printed UPSIDE DOWN on its last page for students to check.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that the same bones, or the same job?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['Homologous structures have the same bones and do the same job.', 'FALSE'],
    ['A bat\'s wing and a human arm have the same bones.', 'TRUE'],
    ['A human embryo turns into a fish and then into a human.', 'FALSE'],
    ['Humans evolved from chimpanzees.', 'FALSE'],
    ['The more alike two species\' DNA, the more closely related they are.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Bones, embryos and DNA all tell the same story: living things share ancestors.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q2 SETTLES THE HOOK. Go back to the tally. A bat\'s wing and a human arm have the same bones because bats and humans share an ancestor that had them. So B.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: homologous means same bones, DIFFERENT jobs (We Do row 2). Q3: nothing turns into another animal (row 3). Q4 IS THE ONE TO WATCH, objective 3 and the most repeated misconception in the topic: humans and chimpanzees share a recent common ancestor; neither came from the other (row 4). If the room splits on Q4, that is the first thing to reteach.\n\n'
    + 'Q5 IS OBJECTIVE 3 IN ONE SENTENCE and it is TRUE: more alike DNA, more closely related.\n\n'
    + 'THE CLOSING LINE ENDS THE LESSON on the one idea all three kinds of evidence share. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE. If you want to lead on: if living things share ancestors, how many years ago did they live? DNA as a clock (the game meets it in question 18), and how scientists date rocks, are the natural next steps.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

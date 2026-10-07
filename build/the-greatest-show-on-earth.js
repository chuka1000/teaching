/**
 * Y8 Science, Natural Selection, Lesson 8: The Greatest Show On Earth. Class 8I. Single, 50 minutes. Galapagos palette, carried on from the unit.
 *
 * DATE: Thursday 8 October 2026. The brief says "tomorrow" and this was built on Wednesday 7 October 2026, so the teaching date the brief
 * gives is used (the standing rule is the build date unless the brief says the lesson falls on another day).
 *
 * PREVIOUS, per the brief: "reference/Shuffling The Gene Pool.pptx", which EXISTS (your edited copy, dated Wednesday 7 October 2026). 50 minutes, ten
 * slides. It taught: four forces that change allele frequencies (mutation, gene flow, natural selection, genetic drift), drift as a RANDOM change
 * against natural selection as NOT random, and why drift matters more in a small population (the bead bags, the northern elephant seal). Its
 * plenary's last line was "Four forces change a gene pool, and one of them is pure chance": it made NO promise for this lesson. The lesson is
 * numbered 8 because the manifest records Shuffling The Gene Pool as Lesson 7 and the brief refers to the finches as "Lesson 2" (How Darwin Got
 * There), which fits the chain: 1 Natural Selection, 2 How Darwin Got There, 3 Natural Selection In Action, 4 Fossils, 5 More Evidence, 6 Small
 * Changes Big Changes, 7 Shuffling The Gene Pool. FLAGGED: the number 8 is inferred, not written down.
 *
 * THEY FOUND HARD (brief): "the relevance of pharyngeal arches". Lesson 5 taught THAT early vertebrate embryos share a tail and pharyngeal arches
 * (evidence of a shared ancestor). What students missed is WHY IT MATTERS. Today answers it with the lesson's own idea: speciation splits one line
 * into two, and each new line keeps what its ancestor had, so features present in the common ancestor of all vertebrates (the arches) turn up in
 * every vertebrate embryo, whatever the animal becomes. It is retrieved in the Do Now (Q3, in a new shape: what the arches become in a fish and in a
 * human), explained in I Do 2 ("the bigger picture"), asked in the Cold Call (Q5), in the worksheet (Q13), in the game, and it is a Plenary item.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14, Mark 3, Plenary 3.
 * I Do 1 teaches objective 1 (species, speciation, isolation; horse and donkey). I Do 2 teaches objectives 2 AND 3 together, because objective 3 is the
 * last step of objective 2's sequence: the finches animation builds the six steps and ends on "they no longer interbreed", and the card beside it
 * says WHY. The We Do is "Finish this one" (the last We Do in the unit was the bead activity), with the squirrels from the brief, a second real case
 * (snapping shrimp) and an imagined one. The You Do is the GAME (Sequencer, as the brief says), with the worksheet as the fallback.
 *
 * THE KAIBAB SQUIRREL IS NOT A FINISHED EXAMPLE, and the deck says so. It is the textbook case of speciation by geographic isolation, but checked
 * against the sources it is still ONE species: the Kaibab squirrel (Sciurus aberti kaibabensis) is a subspecies of Abert's squirrel, with a white tail
 * and a black belly; genome-wide data (Bono and others, BMC Evolutionary Biology, 2018) show it is highly divergent but also that it has interbred
 * with other Abert's squirrels in the past; and the isolation is credited mainly to changes in the ponderosa pine forests since the last Ice Age, not to
 * the canyon alone. So it is used as "speciation that has started", and it is the case that makes students ask what the TEST for a species is.
 *
 * FACTS (web search): Darwin's finches are about 15 species (counts range 14 to 18) from one ancestor species that reached the Galapagos from the mainland
 * roughly 1 to 3 million years ago; beak shape and song both matter for mate recognition (young males learn song from their fathers). Snapping shrimps
 * (Alpheus) of the Isthmus of Panama: the seaway closed about 3 million years ago, and pairs of sister species on the two coasts show strong reproductive
 * isolation (Knowlton and others). A mule has 63 chromosomes (horse 64, donkey 62) and is almost always sterile. Pharyngeal arches: they support the gills
 * in fish, and form the jaw, ear and throat structures in land vertebrates. Every number is checked in build/the-greatest-show-on-earth-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 8 October 2026';
const LESSON = 'The Greatest Show On Earth';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_galapagos_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LINE = 'D9C9A8', ANS = 'F6E7C8';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y8 Science · Natural Selection · Lesson 8 · 8I';

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
  return addTimer(pptx, slide, { key: 'galapagos', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H });
}
function pill(slide, label, minutes, mode) {
  const text = `${label.toUpperCase()} · ${minutes} MIN`;
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.16, x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : 'FFFFFF',
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
}
const title = (slide, text, mode, o = {}) => slide.addText(text, {
  x: M, y: TITLE_Y, w: o.w ?? (RIGHT - M), h: 0.80, color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: o.size ?? 30, bold: true,
  valign: 'middle', margin: 0, objectName: 'slide_title',
});
const sub = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y + 0.80, w: RIGHT - M, h: 0.40, color: mode === 'dark' ? C.tintDeep : C.inkSoft, fontFace: F.body, fontSize: 16,
  valign: 'middle', margin: 0, objectName: 'slide_sub',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.10, fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || LINE, width: o.lineWidth || 1.3 }, objectName: `${o.name}_bg`,
  });
}
function badge(slide, o) {
  slide.addShape(S.ellipse, { x: o.x, y: o.y, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.name}_badge` });
  slide.addText(String(o.n), { x: o.x, y: o.y, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num` });
}
function sentence(slide, parts, o) {
  slide.addText(parts.map(([text, u]) => ({ text, options: u ? { underline: true } : {} })), {
    shape: S.roundRect, rectRadius: 0.12, x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true, align: 'center', valign: 'middle', margin: 0.12, lineSpacing: (o.size ?? 16) + 5, objectName: o.name,
  });
}
const PHASES = [];
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
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.64, w: cw - 0.44, h: 0.50, fill: { color: ANS }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: o.asize ?? 12.5, bold: true, align: 'left', valign: 'middle', margin: 6, objectName: `${o.p}${i}_a`,
    });
  });
}
const video = (s, file, x, y, w, h, name) => s.addMedia({
  type: 'video', path: MEDIA(`${file}.mp4`), cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'), x, y, w, h, objectName: name,
});


/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 10, 'light')); pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, asize: 12, qs: [
    ['Explain why genetic drift has a bigger effect in a small population than in a large one.', 'A small group is a small random sample, so it is more likely to be far from the true mix.'],
    ['Name the force that moves alleles from one population to another when animals move and breed.', 'Gene flow.'],
    ['A pharyngeal arch becomes part of the gills in a fish embryo, and part of the jaw and ear in a human embryo. Explain what this suggests.', 'Fish and humans share an ancestor that had pharyngeal arches. Each kept them and changed how they are used.'],
    ['Explain why the fossil record is incomplete.', 'Most dead organisms rot or are eaten. Few are buried fast enough to become fossils.'],
    ['A runner covers 120 m in 20 s. Calculate the speed.', '6 m/s. 120 ÷ 20.'],
    ['A horse and a donkey can breed and have a mule. Suggest why they are still called different species.', 'A mule is almost always sterile, so they cannot have fertile young together. We define it today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/Shuffling The Gene Pool.pptx (your edited copy of the previous lesson) and the earlier lessons in the unit, and checked every question against the last three Do Nows in the class (Shuffling The Gene Pool, Small Changes Big Changes, More Evidence). Nothing repeats.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (drift in small populations; gene flow). Q3 and Q4 are EARLIER IN THE UNIT: Q3 is more evidence (the pharyngeal arches), Q4 is fossils. Q5 is another science (physics, speed). Q6 PREVIEWS TODAY and cannot be answered fully yet: it is objective 1 (a species is a group that can breed AND have fertile young), and it is settled in I Do 1.\n\n'
    + 'Q3 IS THE ONE THEY FOUND HARD, "the relevance of pharyngeal arches", in a NEW SHAPE. Last time they were told that fish, chicken and human embryos all have a tail and pharyngeal arches. This time it is about what the arches BECOME: in a fish they support the gills; in a human they form parts of the jaw and the ear. The same starting structure, used differently, is what you would expect from a shared ancestor. If anyone says "a human used to be a fish", correct it: no animal turns into another (Lesson 5). TODAY GIVES THEM THE REASON IT MATTERS: when a species splits in two, each new line keeps what the ancestor had. Say "hold that thought: it comes back in I Do 2".\n\n'
    + 'Q1: a small group is a small random sample (the bead bags). Q2: gene flow. Q4: most dead organisms rot or are eaten, and few are buried quickly. Q5: 120 ÷ 20 = 6 m/s. Q6: take any answer that mentions young, and write "fertile" on the board without explaining it.\n\n'
    + 'THEY FOUND HARD (arches): Q3 here, the Cold Call (Q5), the worksheet (Q13), the game and the Plenary (Q5) all return to it. CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Define a species and speciation.', 'Describe how geographic isolation can lead to speciation.', 'Explain why the isolated populations can no longer interbreed.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['A new species forms when two groups are kept ', false], ['apart', true], [' for so long that they can no longer ', false], ['interbreed', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The unit so far: how natural selection works (Lesson 1), how Darwin got there (2), evidence you can watch now (3), evidence from fossils (4) and from bones, embryos and DNA (5), the gene pool and what changes it (6 and 7). Today it joins up: how those changes, given enough time and a barrier, make NEW SPECIES. The lesson is called "The Greatest Show On Earth" after Richard Dawkins\'s 2009 book on the evidence for evolution; you may want to say so.\n\n'
    + 'TWO NEW WORDS, as the brief says: SPECIATION (the formation of a new species) and ISOLATION (two groups kept apart so they cannot breed together). The banner has both. Say "last lesson four forces changed a gene pool. Today we ask what happens when a barrier stops the genes mixing".\n\n'
    + 'OBJECTIVE 3 IS THE LAST STEP OF OBJECTIVE 2: both are taught on the second I Do, as one sequence.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('About 15 species of Darwin’s finches live on the Galápagos. They all came from ONE species that arrived from the mainland. How did one species become many?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('finch', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_finch' });
  const OPTS = [['A', 'Each finch changed its own beak to suit the food on its island.'], ['B', 'Groups were kept apart, and each group slowly changed in its own way.'], ['C', 'One mutation turned a finch into a new species in a single generation.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: I Do 2 does, pointing at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. THE FINCHES ARE LESSON 2 AND LESSON 3 COMING BACK. In Lesson 2 John Gould identified the Galapagos birds as related species. Darwin\'s finches are about 15 species (counts run from 14 to 18) that came from one ancestor species that reached the islands from the South American mainland, roughly one to three million years ago. Lesson 3 showed natural selection acting on one of them in one drought. Today asks how there came to be so many.\n\n'
    + 'A IS LAMARCK\'S IDEA, AND LESSON 3\'S WRONG ANSWER: individuals do not change their own beaks to suit the food. C IS THE MISCONCEPTION THE BRIEF NAMES, "speciation happens in one generation": expect a few votes for it from students who have heard "a mutation made a new species". A new species needs a lot of change to build up, and a mutation in one bird is one new allele in one gene pool.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): do not tell them. Say "write your vote".'
  );
}

/* ================================================================== *
 * 4. I DO · 3: species, speciation, isolation (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Species and speciation', 'light', { size: 30 });
  // the three cards are sized to their text (two lines, one line, three lines), so the same 4.18 in column holds them without overflow
  const y0 = BODY_Y - 0.10, lw = 6.45, g = 0.30, cg = 0.14, CH = [1.30, 1.00, 1.60];
  const DEFS = [
    ['SPECIES', 'A group of living things that can breed together and produce fertile offspring.'],
    ['SPECIATION', 'The formation of a new species from an existing one.'],
    ['ISOLATION', 'Two groups kept apart, so they cannot breed together. GEOGRAPHIC isolation: kept apart by a barrier such as sea, mountains or a river.'],
  ];
  DEFS.forEach(([h, t_], i) => {
    const ch = CH[i], y = y0 + CH.slice(0, i).reduce((a, b) => a + b + cg, 0);
    card(s, { x: M, y, w: lw, h: ch, name: `df${i}` });
    s.addText(h, { x: M + 0.26, y: y + 0.12, w: lw - 0.52, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `df${i}_h` });
    s.addText(t_, { x: M + 0.26, y: y + 0.48, w: lw - 0.52, h: ch - 0.56, color: C.ink, fontFace: F.body, fontSize: 15.5, valign: 'top', margin: 0, lineSpacing: 20, objectName: `df${i}_t` });
  });
  const RX = M + lw + g, RW = RIGHT - RX, RH = CH.reduce((a, b) => a + b) + 2 * cg;
  card(s, { x: RX, y: y0, w: RW, h: RH, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addText('WORKED EXAMPLE: ARE A HORSE AND A DONKEY THE SAME SPECIES?', { x: RX + 0.24, y: y0 + 0.12, w: RW - 0.48, h: 0.62, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.5, valign: 'middle', margin: 0, objectName: 'ex_h' });
  s.addImage({ path: ICON('horse', 'accentInk'), x: RX + 0.60, y: y0 + 0.86, w: 0.80, h: 0.80, objectName: 'ex_horse' });
  s.addImage({ path: ICON('donkey', 'accentInk'), x: RX + 1.80, y: y0 + 0.86, w: 0.80, h: 0.80, objectName: 'ex_donkey' });
  s.addText('→ a MULE', { x: RX + 2.70, y: y0 + 0.86, w: RW - 2.9, h: 0.80, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: 'ex_mule' });
  s.addText([
    { text: 'They can breed, and the young is a mule.', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: 'But a mule is almost always sterile: it cannot have young.', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: 'They cannot make fertile offspring together, so they are two species.', options: { bold: true, color: C.alert } },
  ], { x: RX + 0.24, y: y0 + 1.80, w: RW - 0.48, h: RH - 1.90, color: C.ink, fontFace: F.body, fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'ex_t' });
  const by = y0 + RH + 0.16;
  sentence(s, [['Same species: they can breed together and their young can ', false], ['breed too', true], ['.', false]], { y: by, h: 0.56, size: 16, name: 'bn' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the three definitions one at a time, the worked example, then the banner.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. A SPECIES is a group of living things that can breed together and produce FERTILE offspring. THE WORD FERTILE IS THE WHOLE DEFINITION: "can interbreed" is not enough, and it is the commonest mistake. SPECIATION is the formation of a new species from an existing one. ISOLATION is two groups kept apart so they cannot breed together; GEOGRAPHIC isolation is when the thing keeping them apart is a barrier on the map (sea, mountains, a river, a desert, a lava flow).\n\n'
    + 'THE WORKED EXAMPLE SETTLES DO NOW Q6. A horse (64 chromosomes) and a donkey (62) can breed. The young, a mule, has 63, an odd number, which makes the sex cells very hard to form, so mules are almost always sterile (a handful of cases are recorded in about 500 years; they do not change the rule). So horses and donkeys do not make fertile offspring together: two species. A poodle and a labrador do: one species, however different they look.\n\n'
    + 'HONEST LIMITS, IF A STUDENT PUSHES: the definition works well for animals that breed sexually, and it is hard to test for fossils or for bacteria. Biologists use the idea as a rule of thumb. You do not need to raise it.\n\n'
    + 'MISCONCEPTIONS. (1) "Same species means looks the same." Dogs vary hugely and are one species; some very similar birds are separate species. (2) "They can breed, so they are one species." Only if the young can breed too. (3) "A new species appears suddenly." Not yet: I Do 2.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: how one species becomes two (objectives 2 and 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'How one species becomes two', 'light', { size: 30 });
  const g = 0.30, lw = 5.55, y0 = BODY_Y - 0.14, vh = lw * 540 / 960;
  video(s, 'gse-finches', M, y0, lw, vh, 'vid_fin');
  card(s, { x: M, y: y0 + vh + 0.14, w: lw, h: 1.30, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'bp' });
  s.addText([
    { text: 'THE BIGGER PICTURE. ', options: { bold: true, color: C.accentInk } },
    { text: 'Each split keeps what the ancestor had. So fish, chickens and humans all have pharyngeal arches as embryos: their shared ancestor had them.', options: {} },
  ], { x: M + 0.24, y: y0 + vh + 0.14, w: lw - 0.48, h: 1.30, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'bp_t' });
  const RX = M + lw + g, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 2.40, name: 'st' });
  s.addText('THE STEPS (OBJECTIVE 2)', { x: RX + 0.24, y: y0 + 0.10, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'st_h' });
  s.addText([
    { text: '1.  One population, one gene pool.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: '2.  A barrier splits it: geographic isolation.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: '3.  Different conditions on each side.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: '4.  Different selection in each group.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: '5.  Differences build up over many generations.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: '6.  They can no longer interbreed: two species.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 0.50, w: RW - 0.48, h: 1.84, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'st_t' });
  card(s, { x: RX, y: y0 + 2.54, w: RW, h: 2.36, name: 'wy' });
  // the heading may run to two lines at this width, so it gets room for two and the list starts below it
  s.addText('WHY THEY CAN NO LONGER INTERBREED (OBJECTIVE 3)', { x: RX + 0.24, y: y0 + 2.64, w: RW - 0.48, h: 0.50, color: C.accentInk, fontFace: F.title, fontSize: 12.5, bold: true, charSpacing: 0.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: 'wy_h' });
  s.addText([
    { text: 'Over many generations each group differs in:', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'looks and behaviour, such as beak and song', options: { bullet: true, breakLine: true, paraSpaceAfter: 2 } },
    { text: 'breeding time', options: { bullet: true, breakLine: true, paraSpaceAfter: 2 } },
    { text: 'genes, so young do not form, or are sterile', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'They no longer recognise each other as mates.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 3.20, w: RW - 0.48, h: 1.64, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'wy_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the animation (ON CLICK, so say the idea first), the six steps, why they can no longer interbreed, then the bigger picture.\n\n'
    + 'OBJECTIVES 2 AND 3 TOGETHER, ON PURPOSE. TEMPLATE.md gives each I Do one objective, but objective 3 is the sixth step of objective 2\'s sequence, so they are one slide: the animation builds the sequence and the second card says why it ends where it does. Objective 1 had its own slide.\n\n'
    + 'THE ANIMATION (about 30 seconds) IS DARWIN\'S FINCHES, THE WORKED EXAMPLE, and a MODEL, not the real history. It PAUSES at each step and the captions are the six steps of the game\'s Sequencer: (1) one population of finches on one island; (2) a barrier: a few cross the sea to a new island, and the sea keeps the groups apart (geographic isolation); (3) different conditions: big hard seeds on one island, small soft seeds on the other; (4) different selection: deep beaks survive on the first, slim beaks on the second; (5) the generation counter runs to many thousands while the beaks drift apart; (6) they meet again and do not interbreed: two species. Talk over the pauses. You can click it to play it again.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: B. About 15 species came from one ancestor that reached the Galapagos from the mainland roughly one to three million years ago. A (each finch changes its own beak) is the Lamarck idea from Lesson 3: no finch grows a new beak; the population changes. C (one mutation, one generation) is the brief\'s misconception: say "how many generations does the counter show?" Speciation takes many thousands of generations, because each generation can change a gene pool only a little. It is a PROCESS, not an event.\n\n'
    + 'OBJECTIVE 3, THE WHY. Isolated groups cannot interbreed at the end because of the DIFFERENCES that built up. Finches are a good case: a young male finch learns his song from his father and keeps it for life, and the beak matters too, so a bird from one group does not sing the right song or look the right shape to a female of the other. Other differences: breeding time, courtship behaviour, and genes (eggs and sperm that will not join, or sterile young, as with the mule). Note it is NOT the distance that stops them: once the differences have built up, even birds in the same place do not interbreed (step 6).\n\n'
    + 'THE BIGGER PICTURE IS THE ANSWER TO "THE RELEVANCE OF PHARYNGEAL ARCHES". Every time a species splits in two, BOTH new lines keep what the ancestor had. The ancestor of all vertebrates had pharyngeal arches. So fish, chickens and humans, which split from each other at different times, all still build them as embryos, and each then uses them differently (gills in a fish; jaw and ear parts in a human). Features shared across many species are the footprints of the splits. Say "speciation makes the branches; the arches are on the trunk".\n\n'
    + 'MISCONCEPTIONS. (1) "Speciation happens in one generation." Many thousands. (2) "Each animal changes itself to suit its island." Selection acts on variation that is already there. (3) "They stopped interbreeding because they are far apart." Distance starts it; differences finish it.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: "Finish this one"
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'Finish this one', 'light'); sub(s, 'Say the missing step out loud before the answer appears.', 'light');
  const ROWS = [
    ['Kaibab squirrels live only on the north side of the Grand Canyon, apart from the other Abert’s squirrels.', 'Kept apart: ____ isolation. Selection works in its own way, so Kaibab squirrels have a white tail and a ____ belly. Still counted as ____ species.', 'Geographic. Black. One species: speciation may be starting, but they can still interbreed.'],
    ['About 3 million years ago the Isthmus of Panama rose and split sea animals into a Pacific group and a Caribbean group.', 'Each side had different ____. Over about 3 million years each group ____ in its own way. Today many pairs of snapping shrimp from the two sides are different ____.', 'Conditions. Changed. Species: the pairs rarely mate when put together.'],
    ['Imagine two groups of beetles, apart for 100,000 years, that meet again. They mate, but the eggs never hatch.', 'Can they produce fertile young? ____. So they are now ____ species. Speciation is ____.', 'No. Two species. Complete.'],
  ];
  const rowH = 1.42, gap = 0.14, y0 = BODY_Y + 0.22;   // four lines of 13.5 pt fit a row
  ROWS.forEach(([prob, work, fin], i) => {
    const y = y0 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText([{ text: prob, options: { bold: true, color: C.dark, breakLine: true, paraSpaceAfter: 6 } }, { text: work, options: { color: C.ink } }], { x: M + 0.28, y, w: 6.70, h: rowH, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17.5, objectName: `wd${i}_q` });
    s.addText(fin, { shape: S.roundRect, rectRadius: 0.10, x: M + 7.20, y: y + 0.12, w: CW - 7.20 - 0.14, h: rowH - 0.24, fill: { color: ANS }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 13, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 17, objectName: `wd${i}_a` });
  });
  s.addNotes(
    'WE DO. 5 minutes. Three clicks. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked cases, and they supply the missing step. The last We Do in the unit was an activity, and TEMPLATE.md says to alternate. A process lesson fits this mode.\n\n'
    + 'THEY SAY THE MISSING STEP OUT LOUD BEFORE EACH REVEAL, and you ask "which step of the six is that?" The rows are mixed on purpose.\n\n'
    + 'ROW 1 IS THE KAIBAB SQUIRREL FROM THE BRIEF, AND IT IS NOT A FINISHED SPECIATION. Check before you say otherwise. The Kaibab squirrel (Sciurus aberti kaibabensis) lives only in the ponderosa pine forests of the north rim of the Grand Canyon. It has a black belly and a white tail, unlike the other Abert\'s squirrels. It used to be called a species of its own, but it is now counted as a SUBSPECIES of Abert\'s squirrel, and a 2018 genome study (Bono and others, BMC Evolutionary Biology) found it is highly divergent but has also interbred with other Abert\'s squirrels in the past. One more correction: the canyon is often given as the barrier, but Wikipedia and the study credit changes in the pine forests since the last Ice Age, which left the Kaibab forest cut off (the canyon is part of the picture, not the whole). So the slide says "apart from the other Abert\'s squirrels". USE IT AS SPECIATION THAT HAS STARTED: steps 1 to 5 have begun, and step 6 has not happened. Ask "what test would show they have become two species?" (do they still produce fertile young together?). That is objective 1\'s definition doing work.\n\n'
    + 'ROW 2 IS A FINISHED CASE: the Isthmus of Panama (the seaway closed about 3 to 3.5 million years ago) split populations of sea animals into Pacific and Caribbean groups. Snapping shrimps of the genus Alpheus now form pairs of closely related species, one on each coast. Knowlton and others tested the pairs and found strong reproductive isolation: the sort of thing "they do not interbreed" means in practice. ROW 3 IS IMAGINED (say so): a test of the definition. Mating but no hatching means no fertile young, so two species, and the speciation is complete.\n\n'
    + 'IF THEY ARE QUICK, ask for one more barrier (a river changing course, a new mountain range, a lava flow). IF SHORT OF TIME, do rows 1 and 3 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Define a species.', 'A group of living things that can breed together and produce fertile offspring.'],
    ['Define speciation, and say what geographic isolation means.', 'Speciation: a new species forms from an existing one. Geographic isolation: kept apart by a barrier.'],
    ['Put in order: groups face different conditions, a barrier forms, differences build up.', 'A barrier forms. Different conditions. Differences build up.'],
    ['Explain why two isolated populations can no longer interbreed after many generations.', 'Differences built up (looks, song, breeding time, genes), so they are not mates, or the young are sterile.'],
    ['Explain why fish, chickens and humans all have pharyngeal arches as embryos.', 'They share an ancestor that had them. Each split in the family tree kept them.'],
    ['State what a gene pool is.', 'All the alleles of all the individuals in a population.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (pharyngeal arches, Lesson 5, the one they found hard) and Q6 (the gene pool, Lesson 6).\n\n'
    + 'Q1 IS OBJECTIVE 1: it needs "fertile". If a student says "can breed together", ask "what about a horse and a donkey?". Q2 IS OBJECTIVES 1 AND 2: both words. Q3 IS OBJECTIVE 2, THE SEQUENCE, AS A MINI PUZZLE (the game is made of these). Q4 IS OBJECTIVE 3: it needs "differences built up" AND a reason (they do not recognise each other as mates, or the young are sterile), not "they moved apart". Q5 IS THE RELEVANCE OF PHARYNGEAL ARCHES: "a shared ancestor" is half of it; the other half is "each split in the family tree kept them". If a student says "we used to be fish", correct it. Q6: all the alleles of all the individuals in a population (and each animal has two alleles for each gene).\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "what would have to be true for the Kaibab squirrels to count as two species?" IF SHORT OF TIME, cut Q6.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14: the game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 14, 'light')); pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', 'Put it in order', 'Put the steps of speciation in order, and say what a species is.'],
    ['ROUND 2', 'Why that order?', 'Steps that do not belong, steps in the wrong place, and why groups stop interbreeding.'],
    ['ROUND 3', 'Beat the game', 'Very hard. Longer sequences and tricks. The last questions are meant to be almost impossible.'],
  ];
  const g = 0.30, cw = (CW - 2 * g) / 3;
  ROUNDS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill: i === 2 ? 'F6D9D2' : 'FFFFFF', line: i === 2 ? C.alert : C.accentInk, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.60, w: cw - 0.52, h: 0.36, color: i === 2 ? C.alert : C.accentInk, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.26, y: BODY_Y + 1.00, w: cw - 0.52, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.46, w: cw - 0.52, h: 1.14, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks: the three rounds, then the note. THE GAME IS A SEQUENCER, as the brief says (one population, a barrier forms, different conditions, different selection, changes build up, can no longer interbreed). The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "The Greatest Show On Earth game" from Google Classroom. Three rounds of six questions. In a SEQUENCE question they TAP the steps in the order they happen, then Check; Undo (or tapping the last card again) takes the last one back. A wrong order is explained: it says which step was in the wrong place and why that step cannot come there. Other questions are multiple choice (the definitions, the next step, which step is missing, which step is in the wrong place, why they cannot interbreed). EVERY STUDENT GETS A DIFFERENT GAME: each game uses all eight examples of the same process (two real, Darwin\'s finches and the snapping shrimp of Panama; six invented, and every question says which), in a different order, with different cards that do not belong. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. There are no lives and no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1: four steps in order, the six steps in order (twice), what a species and speciation are, which pair is one species, and the next step. Round 2: which step is missing, a sequence with a card that does NOT belong (twice: the game says to leave it out), why the groups stop interbreeding, a step in the wrong place, and the pharyngeal arches. Round 3 goes far past the lesson: EIGHT steps (adding "gene flow stops" and "the groups now differ in looks, behaviour, breeding time or genes"), a barrier that DISAPPEARS before the groups have changed enough (they mix again: no speciation), the "one generation" trap, the breeding test (groups that still have fertile young are one species), then the two hardest: eight steps with TWO cards that do not belong, and a family tree of three splits (which living species are most closely related). In the eight-step questions, "gene flow stops" and "different conditions" can go either way round, because both follow straight from the barrier: the game accepts both and says so. Expect most of the room to miss some of the last two. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'EVERY QUESTION HAS EXACTLY ONE RIGHT ANSWER BY CONSTRUCTION. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each took, whether it was right and, for a wrong one, what the student chose and the reasoning. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what has to be true before the next step can happen?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
  );
}

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'Mark', 3, 'light');
  s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 1.00, w: CW, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 32, bold: true, valign: 'middle', margin: 0, lineSpacing: 38, objectName: 'slide_title' });
  card(s, { x: M, y: BODY_Y + 0.52, w: CW, h: 1.20, name: 'mk_game' });
  s.addText([{ text: 'Played the game? ', options: { bold: true, color: C.accentInk } }, { text: 'Open the drop-down for each round. Read what you got wrong, and why.', options: {} }], { x: M + 0.30, y: BODY_Y + 0.52, w: CW - 0.60, h: 1.20, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'mk_game_t' });
  card(s, { x: M, y: BODY_Y + 1.94, w: CW, h: 2.62, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: BODY_Y + 2.08, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'A species can breed together and produce FERTILE offspring. Speciation is the formation of a new species.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'The steps: one population, a barrier, different conditions, different selection, differences build up, can no longer interbreed.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'It takes many generations. It is never one generation, and distance alone does not make a new species.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Every split keeps what the ancestor had. That is why all vertebrate embryos have pharyngeal arches.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 2.0, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. Most are in words: check the KEY WORDS (fertile, barrier, selection, generations, differences build up, shared ancestor). The numbers are exact (Q10, Q11). ON THE GAME, the drop-down for each round shows the reasoning for every question.\n\n'
    + 'WALK ROUND for the three commonest mistakes: a definition of a species with no "fertile"; a sequence where the barrier comes AFTER selection (the groups cannot differ if they can still interbreed); and "they stopped interbreeding because they moved apart" without the differences that built up.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['A species is a group that can breed together and produce fertile offspring.', 'TRUE'],
    ['A horse and a donkey are the same species, because they can breed.', 'FALSE'],
    ['A new species can appear in a single generation.', 'FALSE'],
    ['Two beetle groups, split by a new mountain range 100,000 years ago, now do not mate when put together. They are now two species.', 'TRUE'],
    ['Fish, chickens and humans all have pharyngeal arches as embryos by coincidence.', 'FALSE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Natural selection, isolation and time: that is how one species becomes many.', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: "they can breed" is not enough: the young must be fertile (the mule). Q3: THE BRIEF\'S MISCONCEPTION, "speciation happens in one generation": it takes many thousands. Q5: THE ARCHES, the thing they found hard: it is not coincidence. They share an ancestor that had them, and every split kept them. Q1 is plainly TRUE (objective 1). Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): groups apart for a long time that no longer mate when put together are two species (objectives 2 and 3). Ask them to name the barrier and the test.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY, if you have not: B.\n\n'
    + 'THE CLOSING LINE DOES NOT NAME A NEXT LESSON, BECAUSE NONE IS WRITTEN DOWN (TEMPLATE.md asks for it, or, if this closes the unit, what the unit added up to). The line is the unit\'s idea in one sentence: natural selection, isolation and time. If this is the last lesson in the unit, it is the closing note; if it is not, CHANGE THE LINE.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

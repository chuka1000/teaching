/**
 * Y8 Science, Natural Selection, Lesson 6: Small Changes, Big Changes. Class 8I. Single, 50 minutes.
 * Galapagos palette, carried on from the unit.
 *
 * DATE: the date the deck was BUILT on (Tuesday 6 October 2026), not a guessed teaching day. Change it before you teach.
 *
 * PREVIOUS, per the brief: "reference/Bones Embryos And DNA.pptx". THAT FILE DOES NOT EXIST. The lesson with
 * those objectives (bones, embryos, DNA) was built as "More Evidence" (out/More Evidence/More Evidence.pptx,
 * subject "Y8 Science · Natural Selection · Lesson 5"; its builder's header comment says Lesson 6). It is not in
 * reference/, so this is the built copy, not a teacher-edited one: if your edited copy differs, tell me.
 * Read in full. Nine slides, 10+1+2+3+3+5+6+17+3 = 50 minutes (the old shape), a game (Family Tree) as the You Do.
 * It taught: homologous structures (same bones, different jobs); early vertebrate embryos share a tail and
 * pharyngeal arches, which suggests a common ancestor (nothing turns into another animal); DNA comparison as
 * percentages; humans did not evolve from chimpanzees. Its plenary made no promise.
 * The unit so far: natural selection (variation, competition, survival, inheritance; evolution happens to
 * populations), Darwin's influences, evidence you can watch (Daphne Major finches, antibiotic resistance),
 * fossils, then More Evidence. NOT yet taught: gene, allele, gene pool. The DNA lesson said "the molecule that
 * carries the instructions"; today a gene is defined as a section of DNA with one instruction.
 *
 * THEY FOUND HARD (brief): "embryo similarities as evidence of common ancestors". The lesson addresses it where it
 * belongs: it is a pattern of MACROevolution. It is retrieved in the Do Now (Q1, with the reasoning), explained in
 * I Do 2 (the evidence line of the macroevolution column), practised in the We Do and the Cold Call (Q5), and it is a
 * worksheet Gold reasoning task (Q10) and a Plenary statement.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6,
 * You Do 14, Mark 3, Plenary 3. I Do 1 teaches objective 1 (the gene pool). I Do 2 holds objectives 2 AND 3 on one
 * slide, ON PURPOSE: the lesson is the contrast (the title is "Small changes, big changes", and the game sorts items
 * into those two bins), so the two ideas sit side by side in the same layout, as TEMPLATE.md asks of contrasting I Dos.
 * The We Do is "Finish this one" (the last two lessons in the unit used spot-the-mistake; the template says to alternate).
 * The You Do is the GAME (Sorter, two bins), with the worksheet as the fallback.
 *
 * ALLELE FREQUENCY is a count turned into a proportion or a percentage, as the brief says. Hardy-Weinberg does not
 * appear. A beetle has TWO alleles for each gene, so a pool of 10 beetles is 20 alleles: that is a trap the worksheet
 * and the game both test.
 *
 * EYE COLOUR is the single picture of an allele, as the brief asks. It is a simplification: real eye colour depends on
 * several genes. The notes say so.
 *
 * FACTS checked with a web search: Berkeley's Understanding Evolution defines microevolution as evolution within a
 * population (a change in allele frequencies) and macroevolution as evolution above the species level; the
 * peppered moth's dark form went from rare (first collected in Manchester in 1848) to 98% of moths by 1895;
 * early whales (Pakicetus) lived about 50 million years ago, and cetacean ancestors went from land mammals to fully
 * aquatic swimmers in about 8 million years; Tiktaalik is about 375 million years old (taught last unit); the
 * earliest vertebrates are over 500 million years old. Every number is checked in
 * build/small-changes-big-changes-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Tuesday 6 October 2026';
const LESSON = 'Small Changes, Big Changes';
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 6 · 8I';

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
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, asize: 12.5, qs: [
    ['Fish, chicken and human embryos all have a tail and pharyngeal arches early on. Explain what this suggests.', 'They inherited the features from a common ancestor that had them.'],
    ['Two species are 96% the same in 200 DNA letters. Calculate how many letters are different.', '8. 4% of 200 = 200 × 4 ÷ 100.'],
    ['A student says: “The beetles turned green because they needed to hide.” Find the mistake.', 'Green already existed, by chance. Green beetles survived more and passed it on.'],
    ['After the 1977 drought the survivors’ chicks had deeper beaks too. Explain why.', 'Beak depth is inherited, so the survivors passed it on.'],
    ['Write 3 out of 20 as a percentage.', '15%. 3 ÷ 20 = 0.15.'],
    ['Say what you think a “gene pool” might be.', 'All the versions of genes in a population. We define it today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/More Evidence/More Evidence.pptx, the lesson the brief calls "Bones Embryos And DNA" (there is no such file in reference/, so I used the built copy), and the three before it, and checked every question against the last three Do Nows (More Evidence, Fossils And The Fossil Record, Natural Selection In Action). Nothing repeats: no "state how sedimentary rock forms", no "name the molecule", no "4 of 200 DNA letters, calculate the percentage the same" (this one runs the other way: from the percentage to the number of letters), no "beak depth went up or down".\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (embryos; DNA as a percentage, run the other way). Q3 and Q4 are earlier in the unit (a "needed to" mistake from Natural Selection; why the Daphne Major chicks had deeper beaks). Q5 is maths, another subject: a fraction as a percentage, which is the exact skill today needs (allele frequency). Q6 previews today and is not taught yet.\n\n'
    + 'Q1 IS THE ONE YOU SAID THEY FOUND HARD, so it asks for the REASONING, not the fact. The answer has two parts: the features are inherited, and they come from an ancestor that had them. If the answer is only "they are related", ask "related how?". Unrelated animals would have no reason to build the same early features. Do not explain more yet: the lesson comes back to it in I Do 2.\n'
    + 'Q2: the same 96% leaves 100 − 96 = 4% different, and 4% of 200 is 200 × 4 ÷ 100 = 8. Watch for 4 (the percentage, not the number of letters) and for 192 (the number that are the SAME). Q3: variation exists first, by chance; "needed" is the mistake. Q4: the beak depth is inherited. Q5: 3 ÷ 20 = 0.15. Q6 IS A GUESS: accept "the genes of a group". It is the first word of today.\n\n'
    + 'THEY FOUND HARD: "embryo similarities as evidence of common ancestors". Q1 is deliberate.\n\n'
    + 'CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Define a gene pool.', 'Explain microevolution as a change in allele frequencies within a population.', 'Explain macroevolution as large changes over long periods, above the species level.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Small changes in a ', false], ['gene pool', true], [', repeated over a ', false], ['very long time', true], [', add up to big changes.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The unit so far: how natural selection works, how Darwin got there, evidence you can watch (finches, bacteria), then the evidence from the past (fossils) and from living things (bones, embryos, DNA). Today it joins up. You have seen populations change, and you have seen that living things share ancestors. Today is the link: small changes in a population, repeated for a very long time, are what the big changes are. Say "last time the evidence was the DNA, today we look at what DNA is doing inside a population".\n\n'
    + 'THREE NEW WORDS, one picture each: GENE POOL, ALLELE and the pair MICROEVOLUTION and MACROEVOLUTION. Objective 1 gives them gene pool and allele; objectives 2 and 3 give them the two scales. Tell them the game at the end is a sorting game with two bins, micro and macro.\n\n'
    + 'THE BANNER IS THE LESSON IN ONE SENTENCE: small changes in a gene pool, repeated over a very long time, add up to big changes. Underline "gene pool" and "very long time" in your head.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('A bag holds 20 beads, green and brown. I looked at a handful of 5 and put them back: 4 green and 1 brown. What is in the whole bag?', {
    x: M, y: 0.86, w: RIGHT - M - 3.7, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: MEDIA('small-changes-handful.png'), x: RIGHT - 3.55, y: 0.92, w: 3.55, h: 0.82, objectName: 'hook_handful' });
  const OPTS = [['A', '16 green and 4 brown. The same share as my handful.'], ['B', 'More green than my handful. About 18 green.'], ['C', 'I cannot tell from a handful. Only counting every bead tells me.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 17, bold: true, valign: 'top', margin: 0, lineSpacing: 22, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'YOU NEED A BAG OF 20 BEADS: 15 green and 5 brown (any two colours; the slides use green and brown). Hold up a handful of 5 that you have arranged to be 4 green and 1 brown ("I took a handful out earlier"), then put it back. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 1 does, by counting the whole bag.\n\n'
    + 'ANSWER, FOR YOU: C. A handful of 5 is 80% green, but the whole bag is 15 green and 5 brown, which is 75% green. Nobody could have known that from the handful: it might have been 18, or 12. Expect most votes for A, because "the same share" feels like the fair guess. The point for today: THE ONLY WAY TO KNOW HOW COMMON SOMETHING IS IN A GROUP IS TO COUNT THE WHOLE GROUP. That count is called an allele frequency, and the bag is a gene pool.\n\n'
    + 'DO NOT EXPLAIN YET. Say "the beads are going to turn out to be something much more important than beads" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — the gene pool (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'The gene pool', 'light', { size: 30 });
  const LW = 6.55, y0 = BODY_Y - 0.14;
  card(s, { x: M, y: y0, w: LW, h: 0.98, name: 'gn' });
  s.addText([{ text: 'GENE   ', options: { bold: true, color: C.accentInk, charSpacing: 1 } }, { text: 'A section of DNA with one instruction, such as the instruction for eye colour.', options: {} }], { x: M + 0.24, y: y0, w: LW - 0.48, h: 0.98, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'gn_t' });
  card(s, { x: M, y: y0 + 1.12, w: LW, h: 1.96, name: 'al' });
  s.addText([{ text: 'ALLELE   ', options: { bold: true, color: C.accentInk, charSpacing: 1 } }, { text: 'A version of a gene.', options: {} }], { x: M + 0.24, y: y0 + 1.18, w: LW - 0.48, h: 0.46, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: 'al_t' });
  s.addImage({ path: MEDIA('small-changes-eyes.png'), x: M + 0.40, y: y0 + 1.68, w: 2.70, h: 0.82, objectName: 'al_eyes' });
  s.addText('One gene for eye colour. One allele gives brown eyes, another gives blue eyes.', { x: M + 3.25, y: y0 + 1.62, w: LW - 3.45, h: 0.92, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'al_cap' });
  s.addText('Each animal has two alleles for each gene.', { x: M + 0.24, y: y0 + 2.54, w: LW - 0.48, h: 0.42, color: C.ink, fontFace: F.body, fontSize: 13.5, bold: true, valign: 'middle', margin: 0, objectName: 'al_two' });
  card(s, { x: M, y: y0 + 3.22, w: LW, h: 1.10, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'gp' });
  s.addText([{ text: 'GENE POOL   ', options: { bold: true, color: C.accentInk, charSpacing: 1 } }, { text: 'All the alleles of all the individuals in a population.', options: {} }], { x: M + 0.24, y: y0 + 3.22, w: LW - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 15.5, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'gp_t' });
  /* right: the bag, counted */
  const RX = M + LW + 0.30, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 4.32, fill: 'FFFFFF', name: 'bg' });
  s.addImage({ path: MEDIA('small-changes-bag.png'), x: RX + 0.20, y: y0 + 0.14, w: 2.0, h: 1.62, objectName: 'bg_img' });
  s.addText('10 beetles, 2 alleles each: a gene pool of 20 alleles.', { x: RX + 2.35, y: y0 + 0.14, w: RW - 2.5, h: 1.62, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'bg_cap' });
  s.addText([
    { text: 'Count every bead.', options: { bold: true, color: C.accentInk, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Green: 15 out of 20 = 15 ÷ 20 = 0.75 = 75%', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'Brown: 5 out of 20 = 5 ÷ 20 = 0.25 = 25%', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'The two add up to 100%.', options: { color: C.inkSoft, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Allele frequency', options: { bold: true, color: C.accentInk } }, { text: ': how common an allele is in the gene pool.', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Hook answer: C. The handful said 80%; the bag says 75%.', options: { bold: true, color: C.alert } },
  ], { x: RX + 0.24, y: y0 + 1.84, w: RW - 0.48, h: 2.40, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'bg_t' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: gene, allele (with the eyes), gene pool, then the bag, then the count.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. Three words, in order, each built on the last. GENE: a section of DNA that carries one instruction (they met DNA last lesson as "the molecule that carries the instructions"). ALLELE: a version of a gene. THE PICTURE IS EYE COLOUR, as the brief asks: one gene for eye colour, with a version that gives brown eyes and a version that gives blue eyes. THAT IS A SIMPLIFICATION: real eye colour depends on several genes. Say so in one sentence if a student asks, and say the idea (one gene, different versions) is the same. GENE POOL: ALL the alleles of ALL the individuals in a population. A POPULATION is a group of the same species living in the same place, which can breed together (they used the word for the finches).\n\n'
    + 'EACH ANIMAL HAS TWO ALLELES FOR EACH GENE (one from each parent). So a pool of 10 beetles has 20 alleles. That is the commonest mistake of the lesson: dividing by the number of animals instead of the number of alleles. The worksheet (Q3, Q8, Q13) and the game both test it.\n\n'
    + 'THE BAG. Pour the beads out and COUNT THEM, class counting aloud: 15 green, 5 brown, 20 in all. A bead is an allele; the bag is the gene pool of a beetle population (green-shell and brown-shell alleles). Allele frequency is a count turned into a proportion or a percentage: 15 ÷ 20 = 0.75, so 75%, and the other allele is 5 ÷ 20 = 25%; they add to 100%. NEVER HARDY–WEINBERG: it does not appear in this lesson or the next.\n\n'
    + 'SETTLE THE HOOK NOW, POINTING AT THE TALLY: "most of you voted ...". The answer is C. The handful of 5 said 80% green; the whole bag says 75%. A sample can be misleading, and only counting the whole pool gives the frequency. (Tomorrow is about why a small group can wander away from the true value.)\n\n'
    + 'THEY FOUND HARD: nothing stated in the brief about the gene pool, but it is the new idea of the lesson: if the room is unsure, redo the count with a different mixture of beads.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — micro and macro (objectives 2 and 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Small changes, big changes', 'light', { size: 30 });
  const g = 0.30, cw = (CW - g) / 2, y0 = BODY_Y - 0.30;
  const COLS = [
    { k: 'mi', x: M, head: 'MICROEVOLUTION', def: 'A change in allele frequencies within a population.', ex: 'Watched directly: finch beaks, resistant bacteria, and the beetles, over a few generations.' },
    { k: 'ma', x: M + cw + g, head: 'MACROEVOLUTION', def: 'Large changes over long periods, above the species level.', ex: 'Shown by fossils, bones, DNA and embryos: fish, chickens and humans share a tail and pharyngeal arches because they share an ancestor that lived over 500 million years ago.' },
  ];
  COLS.forEach((c) => {
    card(s, { x: c.x, y: y0, w: cw, h: 0.46, fill: C.dark, line: C.dark, name: `${c.k}_hd` });
    s.addText(c.head, { x: c.x + 0.22, y: y0, w: cw - 0.44, h: 0.46, color: C.accent, fontFace: F.title, fontSize: 15, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `${c.k}_h` });
    s.addText(c.def, { x: c.x, y: y0 + 0.52, w: cw, h: 0.72, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `${c.k}_d` });
    s.addText(c.ex, { x: c.x, y: y0 + 3.98, w: cw, h: 0.92, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: `${c.k}_e` });
  });
  /* left: the animation; right: three real steps along a line of time */
  const vh = 2.60, vw = vh * 960 / 540;
  video(s, 'small-changes-generations', M + (cw - vw) / 2, y0 + 1.30, vw, vh, 'vid_gen');
  const STEPS = [['fish', '375 million years ago', 'A fish with limb bones'], ['archaeopteryx', '150 million years ago', 'A feathered dinosaur'], ['whale', '50 million years ago', 'An early whale ancestor']];
  const sx = M + cw + g, sw = (cw - 2 * 0.2) / 3;
  STEPS.forEach(([icon, when, what], i) => {
    const x = sx + i * (sw + 0.2);
    card(s, { x, y: y0 + 1.30, w: sw, h: vh, name: `ms${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + sw / 2 - 0.42, y: y0 + 1.46, w: 0.84, h: 0.84, objectName: `ms${i}_icon` });
    s.addText(when, { x: x + 0.10, y: y0 + 2.38, w: sw - 0.20, h: 0.50, color: C.accentInk, fontFace: F.body, fontSize: 12, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 14, objectName: `ms${i}_w` });
    s.addText(what, { x: x + 0.10, y: y0 + 2.90, w: sw - 0.20, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 12.5, align: 'center', valign: 'top', margin: 0, lineSpacing: 15, objectName: `ms${i}_t` });
  });
  sentence(s, [['The same process, with a lot more ', false], ['time', true], ['.', false]], { y: y0 + 4.98, h: 0.48, size: 16, name: 'mm_banner' });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: the micro column and the animation (ON CLICK, so say the idea first), then the macro column, the three steps, the example line, then the banner.\n\n'
    + 'OBJECTIVES 2 AND 3 TOGETHER, ON PURPOSE. TEMPLATE.md gives each I Do one objective, but it also says to use the same layout on both slides "where the two ideas contrast". The lesson IS the contrast (its title; the sorting game), so the two ideas sit side by side in two columns with the same shape: a definition, a picture, an example. Objective 1 had its own slide.\n\n'
    + 'MICROEVOLUTION (objective 2): a change in allele frequencies within a population. Berkeley\'s Understanding Evolution describes it as evolution within a population. THE ANIMATION (about 26 seconds) shows the beetle gene pool over three generations and PAUSES at every step: generation 1, the count (15 of 20 green, 75%), an arrow with the reason (birds eat more brown beetles, so fewer brown alleles are passed on), generation 2 (17, 85%), another arrow, generation 3 (19, 95%). The allele frequency of green has changed: that IS microevolution. Nothing in the pool is "trying": the brown beetles are eaten more, so fewer brown alleles reach the next generation. The numbers are small so you can count them; real pools are huge. Real examples they know or will like: the Daphne Major beaks, antibiotic resistance, and the peppered moth (the dark form was rare when first collected in Manchester in 1848 and was 98% of moths there by 1895).\n\n'
    + 'MACROEVOLUTION (objective 3): large changes over long periods, above the species level, such as the origin of new groups: whales from land mammals, birds from dinosaurs, land animals from fish. The three steps on the slide are ones they already know: Tiktaalik, a fish with limb bones, about 375 million years ago; Archaeopteryx, about 150 million years ago, with feathers and teeth; and an early whale ancestor, about 50 million years ago (Pakicetus, a four-legged land mammal; cetacean ancestors went from land mammals to fully aquatic swimmers in about 8 million years). THE LINE UNDER IT: THE SAME PROCESS, WITH A LOT MORE TIME. Small changes in gene pools, repeated for a very long time, add up to the big changes. Do not say "micro turns into macro" as if it were a different process.\n\n'
    + 'THE EXAMPLE LINE IS THE EMBRYO IDEA YOU SAID THEY FOUND HARD, SO SAY IT SLOWLY. Fish, chickens and humans all have a tail and pharyngeal arches as early embryos. WHY DOES THAT SUGGEST A COMMON ANCESTOR? Because the instructions to build those features are inherited. If the three kinds of animal were unrelated, there would be no reason for them to build the same early features. The simplest explanation is that they all inherited the instructions from an ancestor that had them (the earliest vertebrates are over 500 million years old). Later development changes the features: the arches become gills in a fish and parts of the jaw and ear in a human. NOTHING TURNS INTO ANOTHER ANIMAL. This is a macroevolution pattern: it shows a shared ancestor far above the species level.\n\n'
    + 'THE BOUNDARY. Where one species becomes two (speciation) sits between the two ideas, and some textbooks count it as macroevolution. Today uses the lesson\'s own line: within a population is micro; above the species level is macro. The game avoids the boundary on purpose, so that every answer is unambiguous. TIME AND SIZE ARE TRAPS: a change within one population stays microevolution however long it takes or however dramatic it looks.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — "Finish this one"
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'What is the missing step?', 'light'); sub(s, 'Finish this one.', 'light');
  const HEADS = ['WHAT HAPPENED', 'THE WORKING, OR THE REASON', 'WHAT IT IS'];
  const ROWS = [
    [['A beetle gene pool has 20 alleles: 15 green and 5 brown. Birds eat brown beetles. In the next generation 18 are green.'], ['Green before: 15 ÷ 20 = 75%. Green after: 18 ÷ 20 = 90%.'], ['?', 'Microevolution. The allele frequency changed in one population.']],
    [['A gene pool has 40 alleles, 10 of them brown. After many generations, 24 of the 40 are brown.'], ['?', 'Before: 10 ÷ 40 = 25%. After: 24 ÷ 40 = 60%.'], ['?', 'Microevolution. Brown rose from 25% to 60%.']],
    [['Over about 50 million years, the descendants of a small four-legged land mammal included whales.'], ['?', 'A large change, over a very long time, that made new groups. It is above the species level.'], ['?', 'Macroevolution.']],
  ];
  const WIDTHS = [4.40, 4.15, 2.30], g = (CW - WIDTHS.reduce((a, b) => a + b, 0)) / 2;
  const xs = WIDTHS.map((_, j) => M + WIDTHS.slice(0, j).reduce((a, b) => a + b, 0) + j * g);
  const HY = BODY_Y + 0.02, RY = BODY_Y + 0.40, rowH = 1.30, rowG = 0.16;
  HEADS.forEach((h, j) => s.addText(h, { x: xs[j], y: HY, w: WIDTHS[j], h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 11.5, bold: true, charSpacing: 1, align: 'center', valign: 'middle', margin: 0, objectName: `wf_h${j}` }));
  ROWS.forEach((row, i) => {
    const y = RY + i * (rowH + rowG);
    row.forEach((cell, j) => {
      const x = xs[j], w = WIDTHS[j], missing = cell[0] === '?';
      s.addText(missing ? '?' : cell[0], { shape: S.roundRect, rectRadius: 0.10, x, y, w, h: rowH, fill: { color: missing ? 'E8E0CC' : 'FFFFFF' }, line: { color: missing ? C.dark : LINE, width: missing ? 1.8 : 1.2, dashType: missing ? 'dash' : 'solid' },
        color: C.dark, fontFace: missing ? F.title : F.body, fontSize: missing ? 26 : 13.5, bold: missing, align: missing ? 'center' : 'left', valign: 'middle', margin: 9, lineSpacing: 17, objectName: `wf${i}_${j}_q` });
      if (missing) s.addText(cell[1], { shape: S.roundRect, rectRadius: 0.10, x, y, w, h: rowH, fill: { color: ANS }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 13, bold: true, align: 'left', valign: 'middle', margin: 9, lineSpacing: 16.5, objectName: `wf${i}_${j}_a` });
      if (j < 2) s.addText('→', { x: x + w, y: y + rowH / 2 - 0.2, w: g, h: 0.4, color: C.accentInk, fontFace: F.body, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `wf${i}_${j}_arrow` });
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Three clicks, one row each. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked cases, and the class supplies the missing steps. The last two lessons in the unit used spot-the-mistake, and the template says to alternate. It practises objectives 1 (the gene pool: allele frequency as a count over the whole pool), 2 and 3 (which scale?).\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL. Ask each pair to agree the missing step and say it, then click. ASK WHAT THEY DID, not just the answer: "what did you divide by, and why?" Naming the step is the point.\n\n'
    + 'ROW 1, ONE MISSING: the name. It is the beetles from the animation (15 green of 20, then 18 of 20): green went from 75% to 90%, so the allele frequency changed within one population: microevolution. It is the same pool as I Do 1, one generation on. ROW 2, TWO MISSING: the working and the name. 10 ÷ 40 = 25%, and 24 ÷ 40 = 60%. The pool is 40 ALLELES, so the divisor is 40, not the number of beetles. The frequency rose 35 percentage points: microevolution. ROW 3, TWO MISSING, AND THE SCALE CHANGE: no numbers. This is above the species level (new groups: whales), over a very long time, so macroevolution. About 50 million years is the age of the earliest whale ancestors (Pakicetus).\n\n'
    + 'THE MISTAKES TO NAME: (1) dividing by the number of beetles, not alleles (row 2 is a pool of 40 ALLELES); (2) calling row 3 microevolution because "evolution is a small change"; (3) calling a change that takes a long time macroevolution just because it takes a long time: the test is "within one population, or above the species level".\n\n'
    + 'IF THEY ARE QUICK, ask for a case of their own and a partner says micro or macro. IF SHORT OF TIME, do rows 2 and 3 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Define a gene pool.', 'All the alleles of all the individuals in a population.'],
    ['State what an allele is. Give an example.', 'A version of a gene, for example the brown-eye or the blue-eye allele.'],
    ['A gene pool has 50 alleles. 10 are brown. Calculate the allele frequency of brown, as a percentage.', '20%. 10 ÷ 50 = 0.2.'],
    ['Explain why fish giving rise to land animals is macroevolution, not microevolution.', 'It made new groups, above the species level, over a very long time.'],
    ['State two features that early vertebrate embryos share, and what they suggest.', 'A tail and pharyngeal arches. A common ancestor.'],
    ['Explain how antibiotic resistance spreads, using the word “allele”.', 'Resistant bacteria survive and reproduce, so the resistance allele becomes more common.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (embryos, from More Evidence, the topic they found hard) and Q6 (antibiotic resistance, from Natural Selection In Action, asked with today\'s new word).\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1: both need the whole definition. Q1 needs "ALL the alleles", "ALL the individuals" and "a population"; "all the genes" is half an answer. Q3 IS THE CALCULATION: 10 ÷ 50 = 0.2, so 20%. Watch for 10 (the count) and for 80% (the other allele). Q4 IS OBJECTIVES 2 AND 3 TOGETHER: ask "within one population, or above the species level?" The answer needs "new groups" or "above the species level" AND "a very long time". Q5: a tail and pharyngeal arches suggest a COMMON ANCESTOR; push for "inherited from an ancestor that had them". Q6: the resistance allele becomes more common in the bacteria population: that IS microevolution; the word "allele" is the new part.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5. IF SHORT OF TIME, cut Q2.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14 — the game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 14, 'light')); pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', 'Two bins', 'Microevolution or macroevolution? Sort each one.'],
    ['ROUND 2', 'Count and sort', 'Work out allele frequencies from a gene pool, and sort harder cases.'],
    ['ROUND 3', 'Beat the sorter', 'Very hard. The last questions are meant to be almost impossible.'],
  ];
  const g = 0.30, cw = (CW - 2 * g) / 3;
  ROUNDS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill: i === 2 ? 'F3D9D2' : 'FFFFFF', line: i === 2 ? C.alert : C.accentInk, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.60, w: cw - 0.52, h: 0.36, color: i === 2 ? C.alert : C.accentInk, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.26, y: BODY_Y + 1.00, w: cw - 0.52, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.46, w: cw - 0.52, h: 1.14, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks: the three rounds, then the note. THE GAME IS A SORTER, and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Small Changes, Big Changes game" from Google Classroom. Three rounds of six, each on their own device. Most questions are the two bins: a description appears, and they tap MICROEVOLUTION or MACROEVOLUTION (or press 1 or 2: the bins swap sides from question to question, so read the label). Round 2 adds allele-frequency questions where they count the alleles in a picture of a gene pool and TYPE a percentage. EVERY STUDENT GETS A DIFFERENT GAME: different cases from a bigger pool, different numbers, bins on different sides, so a neighbour\'s answers are no use. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. A wrong answer names the mistake (judging by how big the change looks, or by how long it took) and gives the reason. There are no lives and no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 is the lesson (obvious cases). Round 2 is the lesson plus one step (counting alleles; trickier cases). Round 3 goes far past the lesson: cases where the obvious cue is WRONG (a dramatic change over a few generations is still micro; a very long change inside one species is still micro; a small-sounding step that made a new group is macro), then a question where each beetle has TWO alleles, and then two questions from small pools of very hard puzzles (a frequency change measured in percentage points, and a pool that shrinks while alleles are lost). Expect most of the room to fail the last two. That is the design. Tell them before they start, so nobody reads a red dot as "I am bad at science". Some of the species in round 3 are invented, and the start screen says so.\n\n'
    + 'THE GAME AVOIDS THE BOUNDARY CASE (one species becoming two) so that every answer is unambiguous under today\'s definitions. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each question took, whether it was right and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "within one population, or above the species level?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
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
  s.addText([{ text: 'Played the game? ', options: { bold: true, color: C.accentInk } }, { text: 'Open the drop-down for each round. Read what you got wrong, and how to get to the answer.', options: {} }], { x: M + 0.30, y: BODY_Y + 0.52, w: CW - 0.60, h: 1.20, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'mk_game_t' });
  card(s, { x: M, y: BODY_Y + 1.94, w: CW, h: 2.50, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: BODY_Y + 2.08, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'A gene pool is ALL the alleles of ALL the individuals in a population, not one animal’s genes.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Allele frequency is the number of copies of one allele ÷ the total number of alleles in the pool.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Microevolution is a change in allele frequencies within one population, however long it takes.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Macroevolution is large changes over long periods, above the species level.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 1.86, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. The calculations have exact answers (Q1, Q3, Q4, Q9, Q13, Q14); the others say what a good answer contains. ON THE GAME, the drop-down for each round already shows how to get to each right answer; students read the ones they got wrong, then check their understanding against the four lines on the slide.\n\n'
    + 'WALK ROUND for the two commonest mistakes: dividing by the number of beetles instead of alleles (Q13), and sorting by how big or how slow a change is instead of by scale (Q7).'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['A gene pool is all the genes in one animal.', 'FALSE'],
    ['Microevolution is one animal changing during its life.', 'FALSE'],
    ['A pool of 40 alleles has 10 brown. Many generations later it has 20 brown. That is microevolution.', 'TRUE'],
    ['Macroevolution means one animal suddenly turns into a new kind of animal.', 'FALSE'],
    ['Fish, chickens and humans share early embryo features because they share a common ancestor.', 'TRUE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Next lesson: what else changes a gene pool? Natural selection is only one of four forces.', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: a gene pool is ALL the alleles of ALL the individuals in a POPULATION, not the genes of one animal (objective 1; the thing this lesson is built on). Q2: microevolution is a change in allele frequencies in a population over generations; one animal does not evolve in its life (the first lesson\'s idea, now with the new word). Q4: macroevolution is large changes over a very long time, above the species level; no animal suddenly turns into another (the same mistake as "a human embryo turns into a fish").\n'
    + 'Q3 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): it is a calculation, not a definition. 10 ÷ 40 = 25%, and 20 ÷ 40 = 50%, so the allele frequency changed within one population: TRUE. Ask them to say the two percentages.\n'
    + 'Q5 IS THE EMBRYO IDEA THEY FOUND HARD, ONE LAST TIME, and it is TRUE: the shared early features are inherited from an ancestor that had them.\n\n'
    + 'THE CLOSING LINE SAYS WHAT THE NEXT LESSON DOES. You told me the next lesson is Shuffling The Gene Pool: natural selection is not the only thing that changes a gene pool; there are four forces, and one of them is random. If the room splits on Q1, that is the first five minutes of next lesson, not a footnote.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

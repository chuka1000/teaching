/**
 * Y8 Science, Natural Selection, Lesson 7: Shuffling The Gene Pool. Class 8I. Single, 50 minutes.
 * Galapagos palette, carried on from the unit.
 *
 * DATE: Wednesday 7 October 2026. The brief says "tomorrow" and this was built on Tuesday 6 October 2026, so the teaching date
 * the brief gives is used (the standing rule is the build date unless the brief says the lesson falls on another day).
 *
 * PREVIOUS, per the brief: "reference/Small Changes Big Changes.pptx". THAT FILE DOES NOT EXIST YET: the lesson was built in this
 * same batch, as out/Small Changes, Big Changes/Small Changes, Big Changes.pptx (the title has commas), so that is the one read
 * (CLAUDE.md: "building several lessons in one go"). It is the built copy, not a teacher-edited one. 50 minutes, ten slides.
 * It taught: gene (a section of DNA with one instruction), allele (a version of a gene), gene pool (all the alleles of all the
 * individuals in a population), allele frequency (a count of one allele divided by the total number of alleles in the pool, as a
 * percentage; each animal has TWO alleles, so 10 beetles is 20 alleles), microevolution (a change in allele frequencies within
 * a population) and macroevolution (large changes over long periods, above the species level). The bead bag was its Hook and
 * its I Do 1 (15 green, 5 brown: 75%), and its animation showed green going 75%, 85%, 95% because birds ate brown beetles. Its
 * plenary promised this lesson: "what else changes a gene pool? Natural selection is only one of four forces." The brief calls
 * the bead bags "from Lesson 5": in the chain the unit has built, Small Changes is Lesson 6 (More Evidence is 5), so this is
 * Lesson 7. Flagged in the notes.
 *
 * THEY FOUND HARD (brief): "gene pools". Retrieved first in the Do Now (Q1, with the trap that each beetle has two alleles), explained
 * again in I Do 2 with the beads (a pool of 4 beetles is 8 alleles), and every scenario in the game is about a gene pool.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14, Mark 3,
 * Plenary 3. I Do 1 teaches objective 1 (the four forces). I Do 2 teaches objective 2 (drift is a random change, against natural
 * selection, which is not) and the idea behind objective 3 (a small sample can be far from the true mix, so chance matters more
 * in a small population). The We Do is the bead activity from the brief and is where objective 3 is seen with their own results.
 * The You Do is the GAME (Pairs: match each scenario to its force), with the worksheet as the fallback.
 *
 * THE BEAD ACTIVITY AS WRITTEN CANNOT SHOW DRIFT, and the notes say so. The brief says "draw 10 beads at random from a big bag and
 * from a small one". If both draws are 10 beads, the spread of the result is the same: it depends on the NUMBER of beads drawn,
 * not on the size of the bag, and drawing 10 beads from a bag of 10 is simply the whole bag, which does not move at all. What
 * makes a population "small" is the number of alleles that form the next generation. So the activity here draws 4 beads for the
 * small population and 20 for the big one, from the same 50:50 stock. The expected figures (computed with sympy in
 * build/shuffling-the-gene-pool-check.py): a population of 4 alleles lands on average 18.75 points from 50%, and 5 times in 8 at
 * least 25 points away; one of 20 lands on average 8.8 points away, and about once in 24 draws at least 25 points away.
 *
 * FACTS checked with a web search: genetic drift is the random change in allele frequencies from one generation to the next, caused
 * by chance and not by any helpful trait, and its effect is stronger in small populations; a bottleneck is a sudden fall in
 * population size after which the survivors carry only a random fraction of the original gene pool; the northern elephant seal
 * was hunted to about 20 animals by 1892 and has recovered to over 200,000 (over 220,000 in the latest genome study), with much
 * less genetic variation than before (Genomics of post-bottleneck recovery in the northern elephant seal, 2024, and others).
 * Every number is checked in build/shuffling-the-gene-pool-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Wednesday 7 October 2026';
const LESSON = 'Shuffling The Gene Pool';
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 7 · 8I';

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
    ['A population has 30 beetles. Each beetle has 2 alleles for shell colour. 24 of the alleles are brown. Calculate the allele frequency of brown, as a percentage.', '40%. 30 × 2 = 60 alleles, and 24 ÷ 60 × 100.'],
    ['Explain how you can tell microevolution from macroevolution.', 'Micro: allele frequencies change within one population. Macro: large changes over long periods, above the species level.'],
    ['Explain why evolution happens to populations, not to individuals.', 'An individual keeps the alleles it was born with. The mix of alleles in the population is what changes.'],
    ['A drought kills about 85% of the finches. State which finches were more likely to survive, and why.', 'Those with deeper beaks. They could crack the hard seeds that were left.'],
    ['A fair coin is flipped 10 times. State how many heads you expect, and whether you will always get exactly that.', '5. No. Chance means the result can vary.'],
    ['Name one thing, other than natural selection, that could change how common an allele is in a population.', 'Chance, a new mutation, or animals moving in from another population. We meet all four forces today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/Small Changes, Big Changes/Small Changes, Big Changes.pptx (the stated PREVIOUS lesson: there is no reference/Small Changes Big Changes.pptx yet, because it was built in this same batch) and the lessons before it, and checked every question against the last three Do Nows in the class (Small Changes Big Changes, More Evidence, Fossils And The Fossil Record). Nothing repeats: no "tail and pharyngeal arches", no "percentage the same in DNA", no "beaks went up or down", no "needed to hide". It is retrieval in new shapes.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (the gene pool, which you said they found hard; micro against macro). Q3 and Q4 are earlier in the unit (populations, not individuals; the finches and the drought, which is natural selection and is set up here to be told apart from drift). Q5 is another subject, maths: a fair coin and chance, which is the whole idea of today. Q6 previews today and is not taught yet.\n\n'
    + 'Q1 IS THE ONE ABOUT GENE POOLS: 30 beetles × 2 alleles = 60 alleles in the pool, and 24 ÷ 60 = 0.4, so 40%. THE TRAP IS DIVIDING BY 30, which gives 80%. If anyone makes it, ask "how many alleles does one beetle have?" Q2: micro is a change in allele frequencies within one population; macro is large changes over long periods above the species level. Q3: each animal keeps the alleles it was born with; the mix across the population changes. Q4: deeper beaks, because the hard seeds were what was left. Q5: 5 heads is the expected number, but a particular set of 10 flips often gives 4 or 6: chance makes results vary. Q6 IS A GUESS: accept "chance", "mutations", "animals moving". It is the first sentence of today.\n\n'
    + 'THE BRIEF CALLS THE BEAD BAGS "FROM LESSON 5". In the chain this unit has built, the bead-bag lesson is Small Changes, Big Changes, recorded as Lesson 6 (More Evidence is Lesson 5). This lesson is recorded as Lesson 7. If your own numbering differs, tell me and the manifest can be corrected.\n\n'
    + 'THEY FOUND HARD: "gene pools". Q1 is deliberate. CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Identify four forces that change allele frequencies.', 'Describe genetic drift as a random change.', 'Explain why genetic drift has more effect in small populations.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Four ', false], ['forces', true], [' change a gene pool, and one of them is pure ', false], ['chance', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Last lesson ended with the gene pool and with natural selection changing it: birds ate brown beetles, and green went 75%, 85%, 95%. It also promised this: natural selection is only one of four forces. Say "last time one thing changed the gene pool. Today there are four, and one of them has nothing to do with which animal is best".\n\n'
    + 'THREE NEW WORDS, one idea each: MUTATION, GENE FLOW and GENETIC DRIFT. (Natural selection they have.) Objective 1 names the four; objective 2 gives drift its one-word description, random; objective 3 says why it matters most when a population is small. The game is a matching game: a scenario, and which of the four forces it is.\n\n'
    + 'THE BANNER IS THE LESSON: four forces change a gene pool, and one of them is pure chance. Underline "forces" and "chance" in your head. THE KEY DISTINCTION OF THE LESSON, which the Cold Call tests: natural selection is NOT random, because the trait matters; genetic drift IS random, because the trait does not.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('A beetle population has 20 alleles: 10 green and 10 brown. No allele helps or harms a beetle, and nobody moves in or out. After five generations, what is the frequency of green?', {
    x: M, y: 0.86, w: RIGHT - M - 3.1, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 19, bold: true, valign: 'middle', margin: 0, lineSpacing: 25, objectName: 'slide_title',
  });
  s.addImage({ path: MEDIA('shuffling-hook.png'), x: RIGHT - 2.95, y: 0.86, w: 2.95, h: 1.52, objectName: 'hook_beads' });
  const OPTS = [['A', 'Exactly 50%. Nothing helps or harms, so nothing can change.'], ['B', 'More than 50%. Green will slowly win.'], ['C', 'Probably not 50%, and nobody can say which way it will move.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 17, bold: true, valign: 'top', margin: 0, lineSpacing: 22, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 2 does, and the bead activity shows it with their own results. If you have the bag from last lesson, hold it up (it was 15 green and 5 brown; today the model is 10 and 10).\n\n'
    + 'ANSWER, FOR YOU: C. With nothing helping or harming any allele, the frequency still wanders, because which alleles end up in the next generation is a matter of chance, like the flips of a coin. It will probably not be exactly 50% after five generations, and nobody can say which way it will move. That is GENETIC DRIFT. Expect most votes for A, because "nothing changes, so nothing can change" feels logical, and some for B. A is the misconception the lesson exists to correct: change does not need a cause that favours an allele.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): do not tell them. Say "write your vote, and be ready to be surprised".\n\n'
    + 'DO NOT EXPLAIN YET. Say "last time natural selection changed the pool because birds were choosing. Here nobody is choosing, and I think it still moves" and go to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — the four forces (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Four forces that change a gene pool', 'light', { size: 30 });
  const FORCES = [
    ['mut', 'dna', 'MUTATION', 'A copying mistake in DNA makes a NEW allele.', null],
    ['gf', 'exchange', 'GENE FLOW', 'Alleles move between populations when animals, or pollen, move and breed.', null],
    ['ns', 'finch', 'NATURAL SELECTION', 'Alleles that help survival and having young become more common.', 'NOT RANDOM: the trait matters'],
    ['gd', 'dice', 'GENETIC DRIFT', 'Allele frequencies change by chance, not because an allele helps.', 'RANDOM: the trait does not matter'],
  ];
  const g = 0.26, cw = (CW - g) / 2, ch = 1.62, y0 = BODY_Y - 0.14;
  FORCES.forEach(([k, icon, name, def, tag], i) => {
    const x = M + (i % 2) * (cw + g), y = y0 + Math.floor(i / 2) * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: k, fill: tag && tag.startsWith('RANDOM') ? ANS : 'FFFFFF', line: tag && tag.startsWith('RANDOM') ? C.accentInk : LINE });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + 0.22, y: y + 0.20, w: 0.62, h: 0.62, objectName: `${k}_icon` });
    s.addText(name, { x: x + 1.02, y: y + 0.14, w: cw - 1.24, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `${k}_h` });
    s.addText(def, { x: x + 1.02, y: y + 0.60, w: cw - 1.24, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 17.5, objectName: `${k}_t` });
    if (tag) s.addText(tag, { x: x + 1.02, y: y + 1.22, w: cw - 1.24, h: 0.32, color: tag.startsWith('RANDOM') ? C.alert : C.accentInk, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `${k}_tag` });
  });
  const EY = y0 + 2 * (ch + 0.20) + 0.04;
  card(s, { x: M, y: EY, w: CW, h: 0.96, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addText([{ text: 'WORKED EXAMPLE   ', options: { bold: true, color: C.accentInk, charSpacing: 1 } }, { text: 'A beetle is born with an allele for green that neither parent had. ', options: {} }, { text: 'Which force? ', options: { bold: true } }, { text: 'Mutation: a NEW allele appeared. Nothing moved in, nothing was chosen, nothing was chance.', options: {} }], {
    x: M + 0.26, y: EY, w: CW - 0.52, h: 0.96, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'ex_t',
  });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the four forces one at a time, then the worked example.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. FOUR FORCES THAT CHANGE ALLELE FREQUENCIES, each asked with one question. MUTATION: did a NEW allele appear, by a copying mistake in the DNA? It is the only way brand new alleles arise, and it is random in the sense that it does not happen because the animal needs it. GENE FLOW: did alleles MOVE between populations, because animals (or pollen, seeds, eggs) moved and bred? NATURAL SELECTION (they know it): does the TRAIT decide who survives and has young, so that helpful alleles become more common? IT IS NOT RANDOM. GENETIC DRIFT: is it CHANCE, with no allele helping or harming? IT IS RANDOM. The two on the bottom row are shaded because they are the pair students mix up, and the Cold Call tests it.\n\n'
    + 'THE FOUR QUESTIONS ARE THE METHOD (and the game): (1) a new allele appeared? mutation. (2) alleles moved between populations? gene flow. (3) the trait decides who survives? natural selection. (4) chance, and the trait does not matter? genetic drift. Ask them in that order.\n\n'
    + 'THE WORKED EXAMPLE is mutation, the one with the simplest cue. It also says what the other three are NOT: nothing moved in, nothing was chosen, nothing was chance. Do one more orally: "a few mice swim to an island and breed with the island mice" (gene flow).\n\n'
    + 'MISCONCEPTIONS. (1) "Mutations happen because an animal needs a new allele." They do not: they are copying mistakes, and most are neutral. Whether a new allele spreads depends on the other forces. (2) "Gene flow makes populations more different." It makes them more alike, because they share alleles. (3) "Genetic drift means evolution is aimless." Drift is aimless; natural selection is not. Both are real.\n\n'
    + 'THEY FOUND HARD: "gene pools". Every force is a change to the gene pool: mutation adds an allele to it, gene flow adds or removes alleles, natural selection and drift change how common each allele is. Say "all four are things that happen to the bag of beads".'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — genetic drift (objective 2, and the idea behind objective 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Genetic drift: change by chance', 'light', { size: 30 });
  const g = 0.30, cw = (CW - g) / 2, y0 = BODY_Y - 0.30, RX = M + cw + g;
  /* left: the contrast, then the worked example */
  const hw = (cw - 0.2) / 2;
  [['ns', 'NATURAL SELECTION', 'The trait decides who survives. Helpful alleles become more common.', 'NOT RANDOM', M], ['gd', 'GENETIC DRIFT', 'Chance decides. The trait makes no difference to who passes on alleles.', 'RANDOM', M + hw + 0.2]].forEach(([k, head, txt, tag, x]) => {
    card(s, { x, y: y0, w: hw, h: 1.78, name: `c${k}`, fill: k === 'gd' ? ANS : 'FFFFFF', line: k === 'gd' ? C.accentInk : LINE });
    s.addText(head, { x: x + 0.18, y: y0 + 0.10, w: hw - 0.36, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 0.8, valign: 'middle', margin: 0, objectName: `c${k}_h` });
    s.addText(txt, { x: x + 0.18, y: y0 + 0.50, w: hw - 0.36, h: 0.84, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16, objectName: `c${k}_t` });
    s.addText(tag, { x: x + 0.18, y: y0 + 1.38, w: hw - 0.36, h: 0.32, color: k === 'gd' ? C.alert : C.accentInk, fontFace: F.body, fontSize: 12.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `c${k}_tag` });
  });
  card(s, { x: M, y: y0 + 1.94, w: cw, h: 2.22, name: 'wx' });
  s.addText('WORKED EXAMPLE: A STORM', { x: M + 0.22, y: y0 + 2.02, w: cw - 0.44, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'wx_h' });
  s.addText([
    { text: '4 beetles = 8 alleles: 4 green, 4 brown. Green is 4 ÷ 8 = 50%.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'A storm kills 3 beetles. Colour does not matter: it is chance.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'The 1 survivor has 2 brown alleles. Green is now 0 ÷ 2 = 0%.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'No allele was better. The frequency changed anyway.', options: { bold: true, color: C.alert } },
  ], { x: M + 0.22, y: y0 + 2.40, w: cw - 0.44, h: 1.70, color: C.ink, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 15.5, objectName: 'wx_t' });
  /* right: the model, then the real example */
  const vw = cw, vh = vw * 540 / 960;
  video(s, 'shuffling-drift', RX, y0, vw, vh, 'vid_drift');
  const SY = y0 + vh + 0.14;
  card(s, { x: RX, y: SY, w: cw, h: y0 + 4.16 - SY, name: 'sl' });
  s.addImage({ path: ICON('seal', 'accentInk'), x: RX + 0.18, y: SY + 0.16, w: 0.62, h: 0.62, objectName: 'sl_icon' });
  s.addText([{ text: 'A real bottleneck: northern elephant seals. ', options: { bold: true, color: C.accentInk } }, { text: 'Hunted to about 20 animals by 1892. Now over 200,000, but with far less variation than before.', options: {} }], {
    x: RX + 0.96, y: SY + 0.06, w: cw - 1.14, h: y0 + 4.16 - SY - 0.12, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, lineSpacing: 16.5, objectName: 'sl_t',
  });
  sentence(s, [['The ', false], ['smaller', true], [' the population, the bigger the effect of chance.', false]], { y: y0 + 4.30, h: 0.52, size: 16, name: 'dr_banner' });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: natural selection, drift, the worked example, the animation (ON CLICK, so say the idea first), the seals, then the banner.\n\n'
    + 'OBJECTIVE 2, AND THE IDEA BEHIND OBJECTIVE 3. GENETIC DRIFT is a random change in allele frequencies from one generation to the next, caused by chance and not by any helpful trait. THE CONTRAST WITH NATURAL SELECTION IS THE KEY DISTINCTION OF THE LESSON: in natural selection the trait decides who survives (so it is not random, and the population becomes better suited); in drift chance decides (so it is random, and the population does not become better suited). Both are changes in the gene pool. SETTLE THE HOOK, POINTING AT THE TALLY: the answer was C. Nothing helped or harmed any allele, and the frequency still wandered.\n\n'
    + 'THE WORKED EXAMPLE USES THE PREVIOUS LESSON\'S TRAP: each beetle has two alleles. 4 beetles are 8 alleles, 4 of them green: 50%. A storm kills 3 beetles at random. The survivor happens to carry two brown alleles, so green falls from 50% to 0%: 0 ÷ 2 = 0. No allele was better. That is a drift event, and it is also a very small population, which is why the change is so big.\n\n'
    + 'THE ANIMATION (about 15 seconds) is a COMPUTER MODEL, not real data, and the slide says so. Both populations start at 50%. Each generation is formed by drawing, at random, the same number of alleles from the one before. Six runs each. THE LEFT PANEL (4 alleles): the lines swing wildly, and many reach 0% or 100%, which is a lost allele: it never comes back. THE RIGHT PANEL (200 alleles): the lines drift but stay much nearer 50%. It pauses while the lines are drawn, one generation at a time. (This is not the same as the bead activity, where the two populations are 4 and 20 alleles and there is one generation: the model uses 200 so that the lines for the big population are readable.) The numbers shown are in build/shuffling-the-gene-pool.sim.json and are checked.\n\n'
    + 'THE SEALS, THE EXAMPLE YOU ASKED FOR. In the 1800s northern elephant seals were hunted for their blubber oil, and by 1892 there may have been only about 20 left. With protection they recovered to over 200,000. But the survivors carried only some of the alleles of the old population, and the alleles they did not carry were lost for good. The recovered population is big, but it has far less genetic variation than before. A sudden fall in population size like this is called a BOTTLENECK. Do not say "inbreeding" unless asked.\n\n'
    + 'THE BANNER IS OBJECTIVE 3 IN ONE SENTENCE. The bead activity next shows it with their own results.\n\n'
    + 'MISCONCEPTIONS. (1) "Drift can only happen after a disaster." It happens every generation: which alleles end up in the next generation is always partly chance. (2) "Drift makes a population better adapted." It does not: a harmful allele can be lost, or become common, by chance. (3) "A big population is never affected by drift." It is, but much less.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — the bead activity: draw, count, compare (objective 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'Draw, count, compare', 'light'); sub(s, 'Pairs. One stock bag of beads, half green and half brown.', 'light');
  const g = 0.30, cw = (CW - g) / 2, y0 = BODY_Y + 0.02;
  const POPS = [
    ['sm', 'SMALL POPULATION: 4 ALLELES', ['Shake the bag. Without looking, draw 4 beads.', 'Count the green beads: ____ of 4.', 'Green as a percentage: ____ %.', 'Distance from 50%: ____ points.']],
    ['bg', 'BIG POPULATION: 20 ALLELES', ['Put the beads back. Shake. Draw 20 beads.', 'Count the green beads: ____ of 20.', 'Green as a percentage: ____ %.', 'Distance from 50%: ____ points.']],
  ];
  POPS.forEach(([k, head, steps], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: y0, w: cw, h: 2.50, name: k });
    s.addText(head, { x: x + 0.24, y: y0 + 0.10, w: cw - 0.48, h: 0.38, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `${k}_h` });
    s.addText(steps.map((t, j) => ({ text: `${j + 1}.  ${t}`, options: { breakLine: j < steps.length - 1, paraSpaceAfter: 6 } })), {
      x: x + 0.24, y: y0 + 0.54, w: cw - 0.48, h: 1.90, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `${k}_t`,
    });
  });
  card(s, { x: M, y: y0 + 2.66, w: CW, h: 0.82, name: 'pa', fill: 'FFFFFF' });
  s.addText([{ text: 'Do it twice, then write your two distances on the board. ', options: { bold: true, color: C.accentInk } }, { text: 'Which population moved further from 50%?', options: {} }], {
    x: M + 0.26, y: y0 + 2.66, w: CW - 0.52, h: 0.82, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: 'pa_t',
  });
  card(s, { x: M, y: y0 + 3.62, w: CW, h: 1.14, name: 'ex', fill: ANS, line: C.accentInk, lineWidth: 1.5 });
  s.addText([
    { text: 'What to expect. ', options: { bold: true, color: C.accentInk } },
    { text: 'A population of 4 alleles lands about 19 points from 50% on average, and 5 draws in 8 are at least 25 points away. A population of 20 lands about 9 points away, and only about 1 draw in 24 is 25 points away. ', options: {} },
    { text: 'A small sample is more likely to be far from the true mix, by chance.', options: { bold: true } },
  ], { x: M + 0.26, y: y0 + 3.62, w: CW - 0.52, h: 1.14, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'ex_t' });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks: the small population, the big population, the question, then what to expect. THE ACTIVITY IS THE ONE IN THE BRIEF, WITH ONE CHANGE THAT MAKES IT WORK. It is the objective 3 idea (a small population is affected more by chance) seen with their own results.\n\n'
    + 'THE CHANGE, AND WHY. The brief says "draw 10 beads at random from a big bag and from a small one, then compare how far each sample moves from the start". If both draws are 10 beads they move equally far: the spread of a random draw depends on HOW MANY beads are drawn, not on how big the bag is, and drawing 10 beads from a bag of only 10 is the whole bag, which does not move at all (it would show the opposite of drift). What makes a population small is the number of alleles that form the NEXT generation. So the SMALL population draws 4 beads and the BIG population draws 20, both from the same big stock bag that is half green and half brown. The expected figures are computed exactly (sympy): the mean distance from 50% is 18.75 points for 4 beads and 8.8 points for 20 beads, and the chance of being at least 25 points away is 5/8 for 4 beads and about 4.1% (1 in 24) for 20 beads. If you would rather keep 10 beads for one of them, use 10 (small) against 40 (big), but 4 and 20 is quick.\n\n'
    + 'SET UP BEFORE THE LESSON: for each pair a bag (or a cup) with about 100 beads, 50 green and 50 brown, well mixed, and the same stock for both draws. A bag of beads from last lesson will do if you add enough of the second colour. Draw with eyes away from the bag, then put the beads back before the second draw. Each pair does it twice (two small draws and two big draws): about 3 minutes. 4 beads is quick; 20 takes about 40 seconds.\n\n'
    + 'THE RECORDING: "green of 4", then ÷ 4 × 100 for a percentage (0, 25, 50, 75 or 100%), then the distance from 50 (0, 25 or 50 points). For 20 beads, green ÷ 20 × 100 and then the distance. Write the class\'s distances in two columns on the board (small and big) and look at the spread. Take the average if time allows: small should be about twice the big. THEY WILL SEE: the small column has some 25s and 50s; the big column is mostly small numbers. A pair that draws 2 green of 4 is exactly on 50%: say that happens about 3 times in 8 at random (6 of 16), so most pairs will not.\n\n'
    + 'THEN SAY WHY: each draw is a random sample. A small sample is much more likely to be unrepresentative (the true mix is 50%, but 4 beads cannot be 50% unless exactly 2 are green, and the other results are all 25% or further away). A big sample is much closer to the true mix. THE LINK TO GENETIC DRIFT: each generation\'s gene pool is a random sample of the previous one. In a small population the sample is small, so chance moves the frequency far; in a big one it moves it little. That is objective 3.\n\n'
    + 'IF A PAIR GETS A "WRONG" RESULT: there are no wrong results. Chance is the point. IF SHORT OF TIME, do one draw each and use the class data. THE ELEPHANT SEALS (I Do 2) are the same idea with real animals: about 20 survivors is a small sample of the old population.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Name the four forces that change allele frequencies.', 'Mutation, gene flow, natural selection and genetic drift.'],
    ['Birds eat more brown beetles because they are easier to see. Name the force, and say whether it is random.', 'Natural selection. Not random: the colour decides who is eaten.'],
    ['A storm kills 3 of 4 beetles in a tiny group, and the colour of a beetle makes no difference. Name the force, and say whether it is random.', 'Genetic drift. Random: chance decided.'],
    ['Explain why genetic drift has a bigger effect in a population of 10 than in a population of 10,000.', 'A small group is a small random sample, so it is more likely to be far from the true mix.'],
    ['A pool has 60 alleles and 15 are brown. Calculate the allele frequency of brown, as a percentage.', '25%. 15 ÷ 60 = 0.25.'],
    ['State what macroevolution is.', 'Large changes over long periods, above the species level.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (allele frequency, from Small Changes, Big Changes) and Q6 (macroevolution, from the same lesson).\n\n'
    + 'THE BRIEF SAYS TO TEST THE KEY DISTINCTION HERE: NATURAL SELECTION IS NOT RANDOM AND DRIFT IS. Q2 and Q3 test it with two scenarios that look alike and are not. Q2: birds eat more brown beetles BECAUSE they are easier to see. The colour decides who survives, so it is natural selection, and it is NOT random. Q3: a storm kills 3 of 4 beetles and the colour makes no difference. Chance decides, so it is genetic drift, and it IS random. For each, ask two things, "which force?" and "is it random, and how do you know?". The reason is the answer: "the colour decided" or "chance decided". Push anyone who says "drift" for Q2 because a few beetles died: ask "did the colour matter?".\n\n'
    + 'Q1 IS OBJECTIVE 1: all four. Q4 IS OBJECTIVE 3: needs "small group", "random sample" or "chance" AND the comparison with a big population. "Because it is smaller" is half an answer: ask "so what does chance do to a small group?". Q5: 15 ÷ 60 = 0.25, so 25%. Q6: large changes over long periods, above the species level.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, spend longer on Q4 and ask "what would change if it were 4,000 beetles?". IF SHORT OF TIME, cut Q6.'
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
    ['ROUND 1', 'Match the force', 'Match each scenario to its force: mutation, gene flow, natural selection or genetic drift.'],
    ['ROUND 2', 'No clue words', 'The scenarios describe what happened, and the force is not named.'],
    ['ROUND 3', 'Beat the game', 'Very hard. The obvious cue is often wrong. The last ones are meant to be almost impossible.'],
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
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks: the three rounds, then the note. THE GAME IS PAIRS ("your call"): match each scenario to its force. The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Shuffling The Gene Pool game" from Google Classroom. Three rounds. A round is three boards, and a board is four scenarios and four force buttons: tap a scenario, then tap the force it shows (mutation, gene flow, natural selection or genetic drift). Each scenario is a single go: a wrong answer says what the mistake probably was, names the right force, and gives the reason, and the pair is then locked. EVERY STUDENT GETS A DIFFERENT GAME: different animals, numbers and wording, drawn from a bigger set, in a different order, so a neighbour\'s answers are no use. The skills and their order are the same for everyone: every round has exactly three scenarios of each force. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. There are no lives and no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 names the cue ("a copying mistake", "swim to an island", "easier to see", "by chance"). Round 2 describes what happened and leaves the force unnamed. Round 3 goes far past the lesson: the obvious cue is WRONG. A bird eats the first moths it finds, but not by colour (drift, not selection). Chance blows seeds into a cold valley, but only the frost-resistant ones live (selection, not drift). A beetle is "born" green, but nothing came from outside and no ancestor was green (mutation). A farmer buys bulls from another herd (gene flow, with no cue word). Expect most of the room to miss some of the last board. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science". Some of the animals in the scenarios are invented, and the start screen says so.\n\n'
    + 'EVERY SCENARIO HAS EXACTLY ONE RIGHT FORCE BY CONSTRUCTION: a new allele appeared, OR alleles moved between populations, OR the trait decided who survived, OR it was chance with no trait involved. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each took, whether it was right and, for a wrong one, what the student chose and why. There is a "Stop and see my results" button on every board.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "did the trait decide it, or was it chance?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
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
  card(s, { x: M, y: BODY_Y + 1.94, w: CW, h: 2.50, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: BODY_Y + 2.08, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'You asked the four questions: a new allele? alleles moving? did the trait decide it? or chance?', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Natural selection is NOT random (the trait matters). Genetic drift IS random (the trait does not).', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'You turned each count into a percentage of its own population before you compared them.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'A small population is a small random sample, so chance moves its allele frequencies further.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 1.86, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. The calculations have exact answers (Q5, Q6, Q7, Q13); the others say what a good answer contains. ON THE GAME, the drop-down for each round already shows the right force and the reason for every scenario; students read the ones they got wrong, then check their understanding against the four lines on the slide.\n\n'
    + 'WALK ROUND for the two commonest mistakes: calling a chance event natural selection (or the other way round), and comparing the number of beads instead of the percentages.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['Natural selection is a random process.', 'FALSE'],
    ['Genetic drift is a change in allele frequencies caused by chance.', 'TRUE'],
    ['Five beetles survive a storm by chance. Their allele frequencies will probably match the original population exactly.', 'FALSE'],
    ['Mutations happen because an animal needs a new allele.', 'FALSE'],
    ['Gene flow happens when alleles move between populations.', 'TRUE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Four forces change a gene pool, and one of them is pure chance.', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q1: natural selection is NOT random, because the trait decides who survives (the key distinction, tested in the Cold Call). Q4: mutations are copying mistakes, and they do not happen because an animal needs them (I Do 1). Q3 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): five beetles are a small random sample of the population, so their allele frequencies will probably NOT match the original exactly: objective 3, applied. Ask "why?" and take "a small sample is more likely to be far from the true mix, by chance".\n'
    + 'Q2 and Q5 are TRUE: drift is a change caused by chance (objective 2), and gene flow is alleles moving between populations (objective 1). If the room splits on Q1, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER. TEMPLATE.md asks for what the NEXT lesson does, and the next lesson is not known, so it is not guessed: CHANGE THIS LINE once you have decided it. If you want to lead on: a bottleneck, such as the elephant seals, is where drift and extinction meet; and populations that stay apart long enough can become different species, which is how micro joins up with macro.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

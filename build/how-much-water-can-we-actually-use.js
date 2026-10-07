/**
 * Y9 Science, How Much Water Can We Actually Use. 9G and 9I (one group, Y9). Single, 50 minutes.
 * Unit "Water", Lesson 1. New palette "catchment" (lib/theme.js), because it is a new unit.
 *
 * DATE: the date the deck was BUILT on, not a guessed teaching day. Change it before you teach.
 *
 * PREVIOUS, per the brief: "reference/Running Out.pptx". That file does not exist. The lesson was built
 * as "Running Out" and deployed as reference/Resource Depletion.pptx (the manifest title), so that is
 * the one read. 50 minutes. It taught: resource depletion (using a resource faster than it can be
 * replaced), how a renewable resource can still run out (passenger pigeons), and what happens when one
 * runs low (helium, the Aral Sea, bluefin tuna, bison). Its Do Now used repeated fractional decline
 * ("loses a third of what remains"), its Cold Call halving three times, and its We Do the Aral Sea
 * (surface water drained faster than it refills). It made NO promise for this lesson. The brief says
 * "Unit 4 used groundwater"; the groundwater example (the Ogallala Aquifer, pumped 1.5 to 3 times faster
 * than it refills, 500 to 1,300 years to refill) is actually in reference/What The Earth Gives Us.pptx,
 * and Making It Last gave sustainable amounts and quotas. All three are built on here.
 *
 * Y7 (per the old Ecosystems 3 deck) already taught the water cycle (evaporation, condensation,
 * precipitation). Objective 3 therefore extends it: what the cycle RETURNS, and how fast.
 *
 * THEY FOUND HARD (brief): left blank, so nothing is guessed.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5,
 * Cold Call 6, You Do 14, Mark 3, Plenary 3. Do Now spaced (2 last lesson, 2 earlier, 1 another science,
 * 1 preview). I Do 1 teaches objective 1 and I Do 2 objective 2 (the litre demonstration). OBJECTIVE 3
 * HAS NO I DO OF ITS OWN (the template gives one objective to each of the two I Do slides): it is taught
 * in the We Do, as three half-worked journeys ("Finish this one"; the last two lessons in the unit used
 * spot-the-mistake), and drilled in the Cold Call, the worksheet and the Plenary.
 *
 * THE PRACTICAL: a litre stands for all the water on Earth, and the proportions are poured off. Every
 * figure was checked first (build/how-much-water-can-we-actually-use-check.py, from USGS / Gleick
 * volumes): salt water 97.5%, fresh water 2.5% (25 mL), of which about 70% is ice and about 30%
 * groundwater, and lakes, swamps and rivers are 0.3% of the fresh water: 0.075 mL, about 1.5 drops.
 * The two jars for Lesson 4 (eutrophication) are set up at the end: see the Plenary notes.
 *
 * NOT RESOLVABLE FROM THE FILES: TEMPLATE.md asks for a closing line saying what the NEXT lesson does.
 * Lessons 2 and 3 of the unit are not known, so the closing line points at the two jars (Lesson 4)
 * instead. Change it once they are decided. The unit name "Water" is also an assumption, flagged.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('catchment');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Monday 5 October 2026';
const LESSON = 'How Much Water Can We Actually Use';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_catchment_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LINE = 'B7D3E4';        // card border
const ANS = 'FFF6CC';          // answer / worked-example fill: warm, so it stands out from the blues

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y9 Science · Water · Lesson 1 · 9G and 9I';

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
    key: 'catchment', palette: C, minutes, mode, slideH: H,
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
    line: { color: o.line || LINE, width: o.lineWidth || 1.3 },
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
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.62, w: cw - 0.44, h: 0.48,
      fill: { color: ANS }, line: { color: C.accentInk, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: o.asize ?? 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `${o.p}${i}_a`,
    });
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
  s.addText(LESSON, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, asize: 13, qs: [
    ['A reservoir holds 625 million litres and loses a fifth of what remains each year. A student says it is empty after 5 years. Explain the mistake.', 'Each loss is a fifth of what is LEFT, so it shrinks. About 205 million litres remain.'],
    ['Atlantic bluefin tuna were fished far faster than they could breed. State one thing introduced to protect them.', 'Strict international catch limits (quotas).'],
    ['A town takes 4 million litres a day from a river that refills at 5 million litres a day. State whether this is sustainable, and why.', 'Yes. It takes less than the river replaces.'],
    ['A farmer pumps groundwater that took 1,000 years to collect. Explain why it behaves like a non-renewable resource.', 'It is used far faster than it refills, so it will not come back in our lifetimes.'],
    ['Name the substance dissolved in sea water that makes it taste salty.', 'Salt, which is sodium chloride.'],
    ['Where does the water in rain come from in the first place? Say as much as you can.', 'Mostly the sea: the Sun evaporates it, then it cools and condenses into cloud.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/Resource Depletion.pptx (the brief called it "Running Out", the name it was built under; there is no reference/Running Out.pptx), and checked every question against the last three Do Nows in the class (Resource Depletion, Making It Last, What The Earth Gives Us). Nothing repeats: no forest, fish-stock, helium, soil or oil question; the repeated-decline idea comes back as an error to explain (last lesson asked for the calculation); the "fresh water is always renewable" statement from What The Earth Gives Us is deliberately NOT reused as a spot-the-error.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (repeated decline; managing a resource that is being depleted). Q3 and Q4 are earlier in the class (Making It Last: a sustainable amount; What The Earth Gives Us: why deep groundwater counts as non-renewable). THIS IS A NEW UNIT, so there is no "earlier in the unit": they come from the previous unit instead. Q5 is another science (chemistry: a solution of salt in water). Q6 previews today and is not taught yet.\n\n'
    + 'Q1: 625 → 500 → 400 → 320 → 256 → 204.8, so about 205 million litres are left after 5 years, and the reservoir is not empty. The student has taken a fifth of the ORIGINAL each year (125 × 5 = 625 gone): the fifth is of what REMAINS, so each loss is smaller than the last. Last lesson asked for this calculation; today it is an error to explain. Q3: 4 < 5, so sustainable. Q4 is the groundwater idea from the Ogallala Aquifer; it is the bridge into today.\n'
    + 'Q5: sea water is a solution; the dissolved salt is mostly sodium chloride. Q6 IS INTUITIVE: accept "the sea", "clouds" or "evaporation". They did the water cycle in Year 7, so most will say clouds. It sets up objective 3.\n\n'
    + 'THEY FOUND HARD: left blank in the brief. Nothing guessed.\n\n'
    + 'CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
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
  const GOALS = ['Name the sources of freshwater.', 'Explain why only a small fraction of Earth’s water is usable.', 'Describe how the water cycle returns freshwater.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Only a ', false], ['tiny fraction', true], [' of Earth’s water is fresh and easy to reach, and the ', false], ['water cycle', true], [' refills it.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. This opens a new unit, Water, and it follows the resources lessons directly. The last three lessons gave them the rule: whether a resource is renewable is about the RATE. Say "we have talked about resources in general. Now one resource, the one nobody can live without, and how much of it there really is."\n\n'
    + 'THE LESSON IS BUILT AROUND A LITRE OF WATER. In a few minutes you will pour off the proportions of all the water on Earth, until there is almost nothing left. Tell them to watch for how much is left at the end, and to commit to a guess (the Hook).\n\n'
    + 'THE BANNER HAS TWO HALVES: only a tiny fraction is fresh and easy to reach (objectives 1 and 2), and the water cycle refills it (objective 3). Point back at each half as you reach it. The unit has more to come: Lesson 4 returns to what can go wrong with fresh water, and there is something to set up for it at the end of today.'
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
  s.addText('Imagine all the water on Earth in one litre bottle. How much of it is fresh water in lakes and rivers?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('bottle', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_bottle' });
  const OPTS = [['A', 'About a glass (250 mL)'], ['B', 'About a spoonful (5 mL)'], ['C', 'About one or two drops']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'top', margin: 0, lineSpacing: 23, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it: I Do 2 does, with the litre in your hands.\n\n'
    + 'ANSWER, FOR YOU: C. About one or two drops. Lakes, swamps and rivers hold about 0.0075% of all the water on Earth (USGS, from Shiklomanov and Gleick). In a litre that is 0.075 mL: about 1.5 drops from a dropper (a drop is about 0.05 mL). Lakes and rivers alone, leaving out the swamps, come to 0.067 mL, still about one and a half drops. Expect most of the room to vote A or B: "the lakes and rivers I can see" feels like a lot. Both are far too big, by a factor of about 3,000 and 70.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): do not tell them. Say "write down your vote, I am going to show you." The size of the surprise at the end is the lesson.\n\n'
    + 'DO NOT EXPLAIN YET. Say "all the water on Earth, the seas, the ice, the rain, everything, in one bottle" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — where fresh water is found (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Where fresh water is found', 'light');
  const SRC = [
    ['ice', 'iceberg', 'ICE CAPS AND GLACIERS', 'about 70%', 'Frozen, mostly in Antarctica and Greenland.'],
    ['gw', 'well', 'GROUNDWATER', 'about 30%', 'Underground, in the tiny gaps in rock and soil.'],
    ['sw', 'river', 'LAKES, RIVERS AND SWAMPS', 'about 0.3%', 'On the surface. Where most people get their water.'],
    ['ot', 'cloud', 'SOIL, AIR AND LIVING THINGS', 'about 0.1%', 'Soil moisture, vapour in the air, and water in living things.'],
  ];
  const g = 0.22, cw = (CW - 3 * g) / 4, SY = BODY_Y - 0.06, SH = 2.50;
  SRC.forEach(([k, icon, head, share, desc], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: SY, w: cw, h: SH, name: k });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + 0.20, y: SY + 0.18, w: 0.56, h: 0.56, objectName: `${k}_icon` });
    s.addText(head, { x: x + 0.20, y: SY + 0.82, w: cw - 0.40, h: 0.52, color: C.dark, fontFace: F.title, fontSize: 12.5, bold: true, charSpacing: 0.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `${k}_h` });
    s.addText(share, { x: x + 0.20, y: SY + 1.34, w: cw - 0.40, h: 0.50, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `${k}_pct` });
    s.addText(desc, { x: x + 0.20, y: SY + 1.86, w: cw - 0.40, h: 0.58, color: C.ink, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 15, objectName: `${k}_t` });
  });
  s.addText('share of all the fresh water', { x: M, y: SY + SH + 0.06, w: CW, h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true, valign: 'middle', margin: 0, objectName: 'share_note' });
  const BY = SY + SH + 0.46;
  card(s, { x: M, y: BY, w: CW, h: 1.72, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addImage({ path: ICON('faucet', 'accentInk'), x: M + CW - 0.84, y: BY + 0.16, w: 0.52, h: 0.52, objectName: 'ex_icon' });
  s.addText('WORKED EXAMPLE: WHERE DOES THIS TOWN’S TAP WATER COME FROM?', { x: M + 0.26, y: BY + 0.14, w: CW - 1.3, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ex_h' });
  s.addText([
    { text: 'The town pumps water from a well and takes some from a river. ', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'The well: ', options: { bold: true, color: C.accentInk } }, { text: 'groundwater.   ', options: {} },
    { text: 'The river: ', options: { bold: true, color: C.accentInk } }, { text: 'surface water.   ', options: {} },
    { text: 'The river is fed by a glacier: ', options: { bold: true, color: C.accentInk } }, { text: 'ice, melting.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Three sources behind one tap. Only the river and the well are easy to reach; the glacier is too far away.', options: {} },
  ], { x: M + 0.26, y: BY + 0.56, w: CW - 0.52, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'ex_t' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the four sources, one at a time, then the worked example.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. Fresh water is water with very little salt in it. There are FOUR places it is stored, and the slide gives each its share of ALL the fresh water on Earth. The figures are the USGS ones, built from Shiklomanov and Gleick: ice caps, glaciers and ice in frozen ground about 70% (69.6%), groundwater about 30% (30.1%), lakes, swamps and rivers about 0.3% (0.30%), soil moisture, the atmosphere and living things about 0.1% (0.09%). They add to a little over 100% because of rounding: say "about". Some sources give 68.7% for ice, because they count frozen ground separately. Both are right; the point is "about two thirds to seven tenths".\n\n'
    + 'THE SURPRISE TO LAND: the water we use most, rivers and lakes, is the SMALLEST of the three big stores: 0.3% of the fresh water. Ice is more than two hundred times bigger. Say it once and leave it. I Do 2 puts it in a bottle.\n\n'
    + 'THE WORKED EXAMPLE IS SORTING, not defining: given a real water supply, name the source behind each part. A river that is fed by a glacier is both surface water and, behind it, ice; that is the point of the last line. If a student asks about rain, rain is on its way into one of the four (the water cycle, today\'s objective 3).\n\n'
    + 'MISCONCEPTIONS. (1) "Groundwater is an underground river or lake." It is mostly water held in the gaps in rock and soil (an aquifer), like water in a sponge. Say so. (2) "Ice is not a source of fresh water." It is: it is just frozen and far away. (3) "Fresh water means safe to drink." It does not: fresh means not salty; it can still carry germs or pollution.\n\n'
    + 'WHERE THE IDEA REAPPEARS: the Ogallala Aquifer from What The Earth Gives Us is groundwater; the Aral Sea from last lesson was surface water. Name both.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — the litre (objective 2)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Why so little is usable', 'light');
  const STEPS = [
    ['bottle', 'ALL THE WATER ON EARTH', '1,000 mL', 'One litre stands for all of it.', 0.76],
    ['salt', 'POUR OFF THE SALT WATER', '25 mL left', '975 mL is salt water, too salty to drink or to water crops. The 25 mL is fresh.', 0.62],
    ['iceberg', 'POUR OFF THE ICE', '7.5 mL left', '17.5 mL is frozen in ice caps and glaciers, far from most people.', 0.50],
    ['dropper', 'POUR OFF THE GROUNDWATER', '0.075 mL left', '7.5 mL is deep underground: costly to reach, slow to refill. A tiny drop is left.', 0.40],
  ];
  const g = 0.38, sw = (CW - 3 * g) / 4, SY = BODY_Y - 0.06, SH = 3.30;
  STEPS.forEach(([icon, head, big, desc, isz], i) => {
    const x = M + i * (sw + g);
    card(s, { x, y: SY, w: sw, h: SH, name: `lt${i}` });
    s.addImage({ path: ICON(icon, i === 3 ? 'alert' : 'accentInk'), x: x + 0.20, y: SY + 0.16, w: isz, h: isz, objectName: `lt${i}_icon` });
    s.addText(head, { x: x + 0.20, y: SY + 0.96, w: sw - 0.36, h: 0.50, color: C.dark, fontFace: F.title, fontSize: 12, bold: true, charSpacing: 0.4, valign: 'top', margin: 0, lineSpacing: 14.5, objectName: `lt${i}_h` });
    s.addText(big, { x: x + 0.20, y: SY + 1.46, w: sw - 0.36, h: 0.56, color: i === 3 ? C.alert : C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `lt${i}_big` });
    s.addText(desc, { x: x + 0.20, y: SY + 2.08, w: sw - 0.36, h: 1.12, color: C.ink, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 15.5, objectName: `lt${i}_t` });
    if (i < 3) s.addText('→', { x: x + sw, y: SY + SH / 2 - 0.22, w: g, h: 0.44, color: C.accentInk, fontFace: F.body, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `lt${i}_arrow` });
  });
  const BY = SY + SH + 0.20;
  card(s, { x: M, y: BY, w: CW, h: 0.78, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'lw' });
  s.addText([{ text: 'The working: ', options: { bold: true, color: C.accentInk } }, { text: '1,000 × 2.5 ÷ 100 = 25 mL fresh.   25 × 30 ÷ 100 = 7.5 mL groundwater.   25 × 0.3 ÷ 100 = 0.075 mL in lakes, swamps and rivers.', options: {} }], {
    x: M + 0.26, y: BY, w: CW - 0.52, h: 0.78, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'lw_t',
  });
  s.addText([{ text: 'Hook answer: C. ', options: { bold: true, color: C.alert } }, { text: 'About 1.5 drops. Next: the water cycle refills that tiny share.', options: { bold: true } }], {
    x: M, y: BY + 0.92, w: CW, h: 0.42, color: C.dark, fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, objectName: 'lw_hook',
  });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the four steps, then the working and the Hook answer. THE LITRE DEMONSTRATION IS DONE LIVE, AS EACH STEP APPEARS. Rehearse it once: it must fit in 3 minutes.\n\n'
    + 'OBJECTIVE 2 ONLY, per TEMPLATE.md. Why is so little usable? Because most water is salty, most fresh water is frozen, and most of the rest is underground. Each step on the slide is one reason, and the working under it shows each is a fraction OF THE ONE BEFORE.\n\n'
    + 'THE FIGURES WERE CHECKED FIRST (build/how-much-water-can-we-actually-use-check.py, from the USGS volumes of Shiklomanov and Gleick). Exact values, for you: salt water 974.7 mL (97.5%), fresh water 25.3 mL (2.53%), ice 17.6 mL, groundwater 7.6 mL, lakes, swamps and rivers 0.0755 mL. The slide rounds: 975, 25, 17.5, 7.5 and 0.075, all within 2% of the exact values. If a sharp student adds 17.5 and 7.5 and 0.075 and gets slightly more than 25, say it is rounding: the sources are estimates. About 0.02 mL more is soil moisture, air and living things, under half a drop: too small to measure or show.\n\n'
    + 'THE DEMONSTRATION. SET UP BEFORE THE LESSON: a 1 L jug or cylinder of water with a little blue food colouring (all the water on Earth, 1,000 mL); a bucket or large bowl labelled SALT WATER; a 25 mL measuring cylinder; two small beakers labelled ICE and GROUNDWATER; a dropper; a watch glass or white saucer; paper towel. Work out beforehand how many drops of YOUR dropper make 1 mL (often about 20, so a drop is 0.05 mL), because 0.075 mL is then 1.5 drops.\n'
    + 'Step 2: pour the salt water into the bucket until about 25 mL is left (you cannot read a litre jug to 25 mL, so pour the last bit into the 25 mL cylinder and top up or pour off to exactly 25). Step 3: pour 17.5 mL into the ICE beaker. Step 4: pour the remaining 7.5 mL into the GROUNDWATER beaker. What is left clinging to the cylinder is the lakes and rivers: put one and a half drops from the dropper on the watch glass and say "that is all of it". IF SHORT OF TIME, pre-pour the 975 mL before the lesson and show only steps 3 and 4.\n\n'
    + 'THE WORKING LINE IS THE WORKED EXAMPLE. Each step is a percentage of the PREVIOUS amount (2.5% of 1,000, then 30% of 25, then 0.3% of 25). The common worksheet error is taking 70% or 30% of the whole litre instead of the 25 mL: the worksheet has a "why" prompt on exactly that.\n\n'
    + 'SETTLE THE HOOK NOW, POINTING AT THE TALLY: "most of you voted ..." and read it off the board. The answer is C. Be honest about the limit: "usable" is a line we draw. Some groundwater CAN be reached, and wells and boreholes use it, but much of it is deep, costly to pump and very slow to refill (Do Now Q4, the Ogallala Aquifer), so the slide draws the line at lakes, swamps and rivers. Fresh water we can REACH and REFILL QUICKLY is what is left.\n\n'
    + 'WHERE THE IDEA REAPPEARS: the last line points to the We Do. If water is this scarce, how does the small share we use get refilled, and how fast?'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — "Finish this one": objective 3 as three half-worked journeys
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What is the missing step?', 'light');
  sub(s, 'Finish this one.', 'light');
  const HEADS = ['START', 'THEN', 'THEN', 'END'];
  /* each cell: [text] given, or ['?', answer] missing */
  const ROWS = [
    [['The Sun warms the sea.'], ['Water evaporates: liquid becomes vapour.'], ['?', 'The vapour rises, cools and condenses into cloud.'], ['Rain and snow fall: precipitation.']],
    [['Rain falls on a hill.'], ['?', 'Some runs over the ground into a river (runoff).'], ['?', 'Some soaks into the ground (infiltration) and becomes groundwater.'], ['The river refills in months. Deep groundwater can take thousands of years.']],
    [['Snow falls on a mountain.'], ['?', 'It builds up as ice in a glacier.'], ['?', 'In summer some of the ice melts.'], ['?', 'Meltwater flows into rivers and lakes and refills them.']],
  ];
  const g = 0.34, cw = (CW - 3 * g) / 4, HY = BODY_Y + 0.02, RY = BODY_Y + 0.38, rowH = 1.06, rowG = 0.14;
  HEADS.forEach((h, j) => s.addText(h, { x: M + j * (cw + g), y: HY, w: cw, h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 11.5, bold: true, charSpacing: 1, align: 'center', valign: 'middle', margin: 0, objectName: `wf_h${j}` }));
  ROWS.forEach((row, i) => {
    const y = RY + i * (rowH + rowG);
    row.forEach((cell, j) => {
      const x = M + j * (cw + g);
      const missing = cell[0] === '?';
      s.addText(missing ? '?' : cell[0], { shape: S.roundRect, rectRadius: 0.10, x, y, w: cw, h: rowH, fill: { color: missing ? 'DCEEF8' : 'FFFFFF' }, line: { color: missing ? C.dark : LINE, width: missing ? 1.8 : 1.2, dashType: missing ? 'dash' : 'solid' },
        color: missing ? C.dark : C.ink, fontFace: missing ? F.title : F.body, fontSize: missing ? 26 : 13, bold: missing, align: 'center', valign: 'middle', margin: 9, lineSpacing: 16, objectName: `wf${i}_${j}_q` });
      if (missing) s.addText(cell[1], { shape: S.roundRect, rectRadius: 0.10, x, y, w: cw, h: rowH, fill: { color: ANS }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 9, lineSpacing: 15.5, objectName: `wf${i}_${j}_a` });
      if (j < 3) s.addText('→', { x: x + cw, y: y + rowH / 2 - 0.2, w: g, h: 0.4, color: C.accentInk, fontFace: F.body, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `wf${i}_${j}_arrow` });
    });
  });
  const SY = RY + 3 * (rowH + rowG) + 0.02;
  card(s, { x: M, y: SY, w: CW, h: 0.82, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'wfs' });
  s.addText([{ text: 'How long water stays, on average: ', options: { bold: true, color: C.accentInk } }, { text: 'air 9 days  ·  rivers 2 to 6 months  ·  lakes 50 to 100 years  ·  shallow groundwater 100 to 200 years  ·  deep groundwater about 10,000 years.', options: {} }], {
    x: M + 0.26, y: SY, w: CW - 0.52, h: 0.82, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'wfs_t',
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks: one per row, then the speeds. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked journeys, and the class supplies the missing steps. The last lessons in the unit used spot-the-mistake, and the template says to alternate. THIS IS WHERE OBJECTIVE 3 IS TAUGHT, because the template gives each I Do one objective.\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL. Ask each table to agree the missing steps and say them, then click. Ask WHAT THEY DID, not just the answer: "how did you know the vapour cools into cloud?" Naming the reasoning is the point. They met the cycle in Year 7, so most of Row 1 should come quickly: say "you own this. Today is what it RETURNS, and how fast."\n\n'
    + 'ROW 1, ONE MISSING: the sea to rain. Evaporation needs heat from the Sun; condensation is the vapour cooling and turning back to liquid droplets, which make cloud. Precipitation is rain, snow, sleet or hail. THE KEY IDEA FOR OBJECTIVE 3: the sea is salty but evaporation LEAVES THE SALT BEHIND, so the cloud and the rain are fresh. That is how the cycle returns fresh water: it distils it. Say it.\n'
    + 'ROW 2, TWO MISSING: rain on a hill. It splits: runoff to a river, or infiltration into the ground to become groundwater. The last box sets up the speeds: the river refills in months, deep groundwater in thousands of years.\n'
    + 'ROW 3, THREE MISSING: snow on a mountain. Only the start is given. Snow builds into a glacier over years, melts in summer, and the meltwater refills rivers and lakes. THE ICE LANE IS SLOW: glaciers hold water for 20 to 100 years or more, ice in Antarctica for about 20,000.\n\n'
    + 'THE FOURTH CLICK, THE SPEEDS, IS THE POINT OF THE LESSON. Average residence times (from Physical Geography, as cited by Wikipedia\'s Water cycle article): the atmosphere about 9 days, rivers 2 to 6 months, lakes 50 to 100 years, shallow groundwater 100 to 200 years, deep groundwater about 10,000 years. THE WATER CYCLE RETURNS FRESH WATER AT VERY DIFFERENT SPEEDS. A river is refilled quickly, so it can be taken from; deep groundwater is refilled so slowly that taking it faster is, in practice, mining it. Link back to the unit: renewable or not is about the rate. These are AVERAGES, and they vary a lot between places.\n\n'
    + 'MISCONCEPTIONS. (1) "The water cycle makes new water." It moves the same water around; the total stays the same. (2) "Rain falls straight into rivers." Most first meets the ground; some runs off, some soaks in. IF SHORT OF TIME, cut the speeds line to the river, the lake and the deep groundwater.'
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
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12.5, qs: [
    ['Name the main places fresh water is found.', 'Ice caps and glaciers, groundwater, and lakes, rivers and swamps.'],
    ['Explain why the ice caps hold most of Earth’s fresh water but cannot supply most cities.', 'It is frozen, and far from where most people live.'],
    ['In a 4,000 mL model of all Earth’s water, 2.5% is fresh. Calculate the volume of fresh water.', '100 mL. 4,000 × 2.5 ÷ 100.'],
    ['Explain why a river refills faster than deep groundwater.', 'Rain and runoff refill a river in months. Water moves through deep rock far more slowly: thousands of years.'],
    ['Explain how fresh water, a renewable resource, can still run out.', 'Taken faster than it refills, like the Aral Sea or deep groundwater.'],
    ['State what taking a sustainable amount of water from a river means.', 'Taking no more than the river can replace.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (a renewable resource can still be depleted, from Resource Depletion) and Q6 (a sustainable amount, from Making It Last). Both are asked about WATER, so they are retrieval in a new shape.\n\n'
    + 'Q1 IS OBJECTIVE 1: take all three. Q2 IS OBJECTIVE 2 and needs "frozen" AND "far away", not just one. Q3 IS THE CALCULATION, a different volume from the demonstration: 4,000 × 2.5 ÷ 100 = 100 mL. Watch for 4,000 × 2.5 = 10,000 with no division (they stop at the multiplication), or 2.5% read as 25%. Q4 IS OBJECTIVE 3, THE SPEEDS: push for a reason ("rain falls into rivers directly; deep water moves through rock") and for the contrast in time, not just "it is slower".\n\n'
    + 'Q5 and Q6 should be fluent: if they are not, it is the previous lessons, not today. If a student says "the Aral Sea" for Q5, ask "what was the rate that went wrong?"\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5. IF SHORT OF TIME, cut Q6.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14 — the worksheet
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} worksheet`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const TIERS = [
    ['BRONZE', C.dark, 'DCEEF8', 'Sources and fractions', 'Sort sources of fresh water and find a share of a volume. Read the worked example first.'],
    ['SILVER', C.accentInk, 'FFF6CC', 'Why so little is usable', 'Work out the pours, and explain why ice and deep groundwater are out of reach.'],
    ['GOLD', C.alert, 'FBE4E8', 'The cycle, rates and the jars', 'How the cycle refills water, when a lake runs dry, and your prediction for the two jars.'],
  ];
  const g = 0.30, cw = (CW - 2 * g) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.60, w: cw - 0.52, h: 0.36, color: col, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.00, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.44, w: cw - 0.52, h: 1.20, color: C.inkSoft, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: `t${i}_b` });
  });
  s.addText('Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions are mixed on purpose.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note. THE WORKSHEET IS THE TASK. There is no game today.\n\n'
    + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md). BRONZE: sorting the sources, and taking a percentage of a volume, with a fully worked example, a half-worked one and a blank one. SILVER: the pours from the litre (percentage of a percentage), why ice and deep groundwater are out of reach, and the "why does that step work?" prompt. GOLD: the water cycle (a half-worked journey), a lake that is being drained faster than it refills (the unit\'s rate idea with real numbers), "where would you meet this outside the lesson", and the PREDICTION for the two jars. AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student.\n\n'
    + 'THE QUESTIONS ARE MIXED ON PURPOSE (interleaved): a calculation, then a sorting, then an explanation, so each one needs a decision about which method. The sheet says so. It feels harder and is meant to.\n\n'
    + 'THE WORST MISTAKE TO LOOK FOR: taking 70% or 30% of the whole litre instead of the 25 mL (Q8 is the prompt for it). A second: forgetting to divide by 100.\n\n'
    + 'THE JAR PREDICTION IS COMMITTED IN WRITING before anyone sees the result (PEDAGOGY.md): collect a few to compare in Lesson 4. THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "70% of what?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
  );
}

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'Mark', 3, 'light');
  s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 1.00, w: CW, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 32, bold: true, valign: 'middle', margin: 0, lineSpacing: 38, objectName: 'slide_title' });
  card(s, { x: M, y: BODY_Y + 0.52, w: CW, h: 2.90, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: BODY_Y + 0.68, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'Every calculation shows the working, and the unit (mL).', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'You took the percentage of the right amount: the 25 mL of fresh water, not the whole litre.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Your reasons say what makes the water hard to use: salty, frozen, deep or slow to refill.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Write the correct answer next to anything wrong. Do not rub it out.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 1.12, w: CW - 0.6, h: 2.14, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'THE ANSWERS ARE PRINTED UPSIDE DOWN at the foot of the last worksheet page. The calculations have exact answers (Q1 75 mL, Q3 200 mL, Q6 30 mL, Q7 0.3 mL, Q12 20 years); the explanations say what a good answer contains. Q2 is the sorting. Q14, the jar prediction, has no wrong answer to mark, but they should have a reason, and they should keep it: you will ask for it in Lesson 4.\n\n'
    + 'WALK ROUND reading for the commonest mistake: 70% of 1,000 instead of 70% of 25. If someone has made it, ask "70% of WHAT?" and let them find it themselves.'
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
    ['Most of Earth’s fresh water is frozen in ice caps and glaciers.', 'TRUE'],
    ['Most of the water on Earth is fresh water.', 'FALSE'],
    ['Rain refills rivers and lakes, so fresh water cannot run out.', 'FALSE'],
    ['A lake gains 15 million litres a year from rain and rivers. Taking 10 million litres a year from it is sustainable.', 'TRUE'],
    ['Deep groundwater refills as quickly as a river, because rain falls every week.', 'FALSE'],
  ];
  const rowH = 0.64, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.10 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  const JY = H - 1.12;
  s.addImage({ path: ICON('jar', 'accent'), x: M, y: JY, w: 0.62, h: 0.62, objectName: 'pl_jar1' });
  s.addImage({ path: ICON('jar', 'accent'), x: M + 0.74, y: JY, w: 0.62, h: 0.62, objectName: 'pl_jar2' });
  s.addText('Two jars are on the windowsill: one with nothing added, one with a pinch of fertiliser. Which one will change? Write your prediction. We come back to them in Lesson 4.', {
    x: M + 1.62, y: JY - 0.06, w: RIGHT - M - 1.62, h: 0.74, color: C.accent, fontFace: F.body, fontSize: 14.5, bold: true, italic: true, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line about the jars.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE (about 70%). Q2 IS THE BIG MISCONCEPTION AND OBJECTIVE 2: the Earth looks like a blue planet, but 97.5% of its water is salt water. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n'
    + 'Q3 IS THE UNIT\'S MISCONCEPTION, "rain keeps falling, so it cannot run out", and OBJECTIVE 3: the cycle returns fresh water, but only at its own speed. Point at the We Do speeds.\n'
    + 'Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): it uses the unit\'s rate idea with numbers. Taking 10 million while 15 million is added is less than the lake replaces, so it is sustainable. Ask them to say "less than it replaces".\n'
    + 'Q5 IS OBJECTIVE 3 AGAIN, FLIPPED: rain does fall every week, but it does not reach deep groundwater quickly; it takes up to 10,000 years on average.\n\n'
    + 'THE CLOSING LINE IS NOT THE NEXT LESSON. TEMPLATE.md asks for what the next lesson does; Lessons 2 and 3 are not known, so it is not guessed. It points at the two jars (Lesson 4): CHANGE THIS LINE once Lessons 2 and 3 are decided.\n\n'
    + 'SET UP THE TWO JARS (about 2 minutes). THE LESSON IS TIMED TO 50 MINUTES AND THERE IS NO SPARE 2 MINUTES: do it as the class packs away, or ask two students to do it while the others finish marking. Do NOT take it from the plenary statements. YOU NEED two identical clear jars with lids, pond or aquarium (tank) water, not tap water (it must contain algae; tap water usually will not), and a general-purpose water-soluble plant fertiliser with nitrogen and phosphorus. Fill both jars to the same level with water from the same container. Add a pinch of fertiliser (about half a gram) to ONE jar and nothing to the other. Label them "Jar 1: nothing added" and "Jar 2: fertiliser added", with the date. Put them side by side on the same bright windowsill. Seal them and leave them. Do not open them.\n'
    + 'SAFETY. Follow your school\'s risk assessment (CLEAPSS hazard cards): pond water can carry germs, so wash hands after handling it, never open the jars once sealed, and handle the dry fertiliser with care and eye protection. It is an experiment with ONE difference, the fertiliser: say so, because it is a fair test, and they will meet the words independent variable and controlled variable again.\n'
    + 'WHAT SHOULD HAPPEN. The fertiliser feeds the algae already in the water, so they grow faster and the water turns green: eutrophication, in the room, over about two weeks. THIS IS LIKELY, NOT GUARANTEED. It depends on light and warmth, and on how much algae the water started with. Jar 1 may go slightly green too, only less: that is a comparison, not a failure. If neither changes by Lesson 4, say so honestly: nothing happening is still a result, and you can leave them another week. Keep the students\' predictions (Q14) to read out then.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

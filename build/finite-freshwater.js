/**
 * Y9 Science, Water, Finite Freshwater. 9G and 9I (one group, Y9). Single, 50 minutes. Palette "catchment" (the unit's, from Lesson 1).
 *
 * DATE: the date the deck was BUILT on (Wednesday 7 October 2026), not a guessed teaching day. Change it before you teach.
 *
 * PREVIOUS, per the brief: "reference/How Much Water Can We Actually Use.pptx". THAT FILE IS NOT IN reference/. The lesson was built under that
 * name and deployed as reference/How Much Water Is Available.pptx (your edited version), so THAT is the deck I opened and read: 50 minutes; it
 * taught the four stores of fresh water, why so little is usable (the litre of water), and the water cycle with how long water stays in each
 * store (air 9 days, rivers 2 to 6 months, lakes 50 to 100 years, shallow groundwater 100 to 200 years, deep groundwater about 10,000). Its
 * Plenary made no promise for this lesson (it said Lessons 2 and 3 were not known) and set up the two jars for the eutrophication lesson.
 * Everything here builds on those speeds. The lesson number and the order of Lessons 2 and 3 are NOT written down, so none is assumed.
 *
 * THE BRIEF'S AVOID: "Repeating Unit 3's river-abstraction content. Open that deck and build past it." Y9 Unit 3 is Human Actions and the Land
 * (units/Y9-Unit-3-Human-Actions-Land.md); its three decks (What The Land Gives Us, Losing The Soil, Cities And What Can Be Done) contain NO
 * river-abstraction material. The material of that kind that I can find is in Water Lesson 1: its Do Now Q3 (a town takes 4 million litres a day
 * from a river that refills at 5 million), its Cold Call Q6 (a sustainable amount from a river) and its Plenary Q4 (a lake gaining 15 million a year),
 * plus the lake in its worksheet Q12 (stock divided by net loss). So I treated THAT as the content to avoid: nothing here asks whether taking a
 * given amount from a river is sustainable. What is new today is a STORE rather than a flow: an aquifer, the water table, the time to EMPTY it against
 * the time to REFILL it, what happens as it falls, and then where and when. If you meant a different deck, tell me and I will check it.
 *
 * SYLLABUS: the Water unit has no scheme in the repo (Unit 3's plan is for land). The three objectives are your wording.
 *
 * THEY FOUND HARD (brief): left blank, so nothing is guessed.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14, Mark 3, Plenary 3.
 * I Do 1 is objective 1 (uses). I Do 2 is objective 2 (groundwater: the model aquifer animation). OBJECTIVE 3 HAS NO I DO OF ITS OWN, as in Lesson 1: it
 * is taught in the We Do, which is "What should be the correct answer?" because Lesson 1 used "Finish this one" and TEMPLATE.md says to alternate. NO GAME:
 * the brief does not ask for one, so the You Do is the worksheet.
 *
 * FIGURES, all checked first (build/finite-freshwater-check.py): FAO AQUASTAT withdrawals worldwide 69% agriculture, 12% municipal, 19% industrial (rounded
 * on the slides to 70, 10 and 20); Water Footprint Network, 2,400 litres for a hamburger and 2,700 for a cotton T-shirt; FAO and World Bank 2020 total
 * renewable water per person (Canada 73,469, Saudi Arabia 68.9 m3); about 75% of India's rain in June to September; WHO/UNICEF JMP 2025, 2.1 billion
 * people without safely managed drinking water; UNESCO 2022, about half the world drinks groundwater; USGS, the High Plains Aquifer down 8% by 2013.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('catchment');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Wednesday 7 October 2026';
const LESSON = 'Finite Freshwater';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);
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
pptx.subject = 'Y9 Science · Water · 9G and 9I';

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
    ['In a 6,000 mL model of all Earth’s water, 2.5% is fresh. Calculate the volume of fresh water.', '150 mL. 6,000 × 2.5 ÷ 100.'],
    ['Explain why deep groundwater refills far more slowly than a river.', 'Rain has to soak down through rock: thousands of years. A river refills in months.'],
    ['Explain why coal is described as a finite resource.', 'It formed over millions of years, so once it is used it is gone on a human timescale.'],
    ['State what “sustainable” means for a resource.', 'Used at a rate that does not run it down, so it can carry on.'],
    ['Name the process by which plants lose water vapour through their leaves.', 'Transpiration.'],
    ['Which uses more of the world’s fresh water: farming, industry or homes?', 'Farming, by a long way: about 70%. We see the figures today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'THE PREVIOUS LESSON IS NOT IN reference/ UNDER THE NAME IN THE BRIEF. The brief says reference/How Much Water Can We Actually Use.pptx; the deployed copy is reference/How Much Water Is Available.pptx, and that is the one I read. I checked every question against the Do Nows of the last Y9 lessons (that one, What The Earth Gives Us, Resource Depletion, Making It Last, Losing The Soil). Nothing repeats, and there is NOTHING about a town taking water from a river, which was last lesson\'s Do Now Q3 and the content the brief says to avoid.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (the litre model with new numbers; why deep groundwater refills slowly, which today\'s I Do 2 depends on). Q3 and Q4 are earlier (Resources: a finite resource; sustainable). Q3 plants the word FINITE, which today\'s banner uses. Q5 is another science (biology: transpiration, a use of water by plants). Q6 PREVIEWS TODAY and cannot be answered with certainty yet: it is objective 1, and it is settled in I Do 1.\n\n'
    + 'Q1: 6,000 × 2.5 ÷ 100 = 150 mL (watch for 15,000 with no division). Q2: rain soaks down through rock very slowly (deep groundwater about 10,000 years on average, against months for a river). Q3: it took millions of years to form, so it cannot be replaced in our lifetimes. Q4: used no faster than it is replaced. Q5: transpiration. Q6: take any answer, and write the votes on the board. Most will say homes, because that is the water they see. Do NOT correct it: I Do 1 does.\n\n'
    + 'THEY FOUND HARD: left blank in the brief. Nothing guessed. CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Describe what we use freshwater for.', 'Explain how groundwater can be used up even though it is renewable.', 'Explain why water shortage is about where and when, not just how much.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Fresh water is ', false], ['renewable but finite', true], [', and a shortage is about ', false], ['where and when', true], [', not just how much.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Last lesson said how much fresh water there is, why so little is usable, and how the cycle refills it, at very different speeds. Today asks what we DO with it, what happens when we take it faster than it comes back, and why a shortage is not just a total. Say "last lesson was the supply. Today is the demand, and the trouble in between."\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING. Objective 1 is the uses (I Do 1). Objective 2 is the model aquifer (I Do 2). Objective 3 has no I Do of its own, as in Lesson 1: the We Do teaches it. NEW WORDS: aquifer, water table, recharge, finite.\n\n'
    + 'THE BANNER HAS TWO HALVES: fresh water is renewable but FINITE (objective 2: renewable does not mean unlimited), and a shortage is about WHERE AND WHEN (objective 3). Point back at each half as you reach it.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('How much water is used to make one hamburger, counting the water that grew the food the cow ate?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('hamburger', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_burger' });
  const OPTS = [['A', 'About 10 litres, a bucket.'], ['B', 'About 150 litres, a bathtub.'], ['C', 'About 2,400 litres, more than ten bathtubs.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: I Do 1 does, pointing at the tally.\n\n'
    + 'ANSWER, FOR YOU: C. The Water Footprint Network\'s global average is about 2,400 litres for one 150 g hamburger (15,400 litres per kilogram of beef: the feed crops, the pasture, the animal\'s drinking water and the processing). Expect most votes for A or B, because "water in a burger" sounds like the bun and the lettuce. A bathtub is only a rough guide (a full bath is about 100 to 200 litres), so say "more than ten".\n\n'
    + 'AN HONEST CAVEAT, SAY IT IF ASKED: most of that water is RAIN that fell on the fields and pasture, not water taken from rivers and wells. It is still water that the food needed. The uses on I Do 1 are the water PEOPLE TAKE (rivers, lakes, wells); the footprint figure is a bigger, different count. Both show the same thing: farming is the big user.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): do not tell them. Say "write your vote".\n\n'
    + 'DO NOT EXPLAIN YET. Say "by the end of the next slide you will see where it goes".'
  );
}

/* ================================================================== *
 * 4. I DO · 3: what we use fresh water for (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'What we use fresh water for', 'light', { size: 30 });
  const y0 = BODY_Y - 0.10, WS = 3.30, rx = M + WS + 0.35, rw = RIGHT - rx;
  s.addImage({ path: MEDIA('ff-waffle-base.png'), x: M, y: y0, w: WS, h: WS, objectName: 'wf_base' });
  const USES = [
    ['agri', 'wheat', 'AGRICULTURE', 'about 70%', 'Irrigating crops and watering livestock.', C.support],
    ['ind', 'industry', 'INDUSTRY', 'about 20%', 'Cooling power stations and making things.', C.dark],
    ['home', 'home', 'HOMES', 'about 10%', 'Drinking, cooking, washing and toilets.', C.accentInk],
  ];
  const ch = 1.0, cg = 0.15;
  USES.forEach(([k, icon, head, pct, desc, col], i) => {
    s.addImage({ path: MEDIA(`ff-waffle-${k}.png`), x: M, y: y0, w: WS, h: WS, objectName: `wf_${k}` });
    const y = y0 + i * (ch + cg);
    card(s, { x: rx, y, w: rw, h: ch, line: col, lineWidth: 1.8, name: `u${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: rx + 0.22, y: y + 0.22, w: 0.56, h: 0.56, objectName: `u${i}_icon` });
    s.addText(head, { x: rx + 1.00, y: y + 0.10, w: rw - 3.2, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `u${i}_h` });
    s.addText(desc, { x: rx + 1.00, y: y + 0.52, w: rw - 3.2, h: 0.40, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, objectName: `u${i}_t` });
    s.addText(pct, { x: rx + rw - 2.20, y, w: 2.0, h: ch, color: col, fontFace: F.title, fontSize: 24, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: `u${i}_pct` });
  });
  s.addText('Each square is 1 of every 100 litres people take.', { x: M, y: y0 + WS + 0.04, w: WS, h: 0.26, color: C.inkSoft, fontFace: F.body, fontSize: 11, italic: true, valign: 'middle', margin: 0, objectName: 'wf_note' });
  const ey = y0 + WS + 0.38;
  card(s, { x: M, y: ey, w: CW, h: 6.98 - ey, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addText([
    { text: 'WORKED EXAMPLE: WHERE DOES THE WATER IN A COTTON T-SHIRT GO?', options: { bold: true, color: C.accentInk, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'Farming: ', options: { bold: true } }, { text: 'irrigating the cotton plants, most of the 2,700 litres.   ', options: {} },
    { text: 'Industry: ', options: { bold: true } }, { text: 'spinning, dyeing and finishing the cloth.   ', options: {} },
    { text: 'Homes: ', options: { bold: true } }, { text: 'washing it, again and again.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'All three uses are behind one T-shirt, and farming is the biggest.', options: { bold: true, color: C.alert } },
  ], { x: M + 0.26, y: ey, w: CW - 0.52, h: 6.98 - ey, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'ex_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: farming, industry, homes, then the worked example. EACH CLICK FILLS THAT USE\'S SQUARES ON THE GRID.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. The grid is 100 squares: every 100 litres of fresh water that people TAKE from rivers, lakes and wells. FAO AQUASTAT worldwide figures: agriculture 69%, industry 19%, municipal (homes and services) 12%. The slide rounds to 70, 20 and 10, which add to 100. The country average is different (59, 18 and 23) because a few big users dominate the world total, and the split varies a lot: in South Asia about 91% goes to farming. Say "about", and that it differs from place to place.\n\n'
    + 'THE SURPRISE TO LAND: homes, the water they see, are the SMALLEST of the three. Point at the Do Now Q6 votes: most said homes. Farming uses seven times as much.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: the hamburger is about 2,400 litres (C), and almost all of it is farming: the water that grew the cattle feed and the pasture, and the cattle\'s own drinking. The same is true of the cotton T-shirt (about 2,700 litres): the worked example traces it through all three uses. The footprint counts rain on the fields too, so it is bigger than the water people take; see the Hook notes.\n\n'
    + 'MISCONCEPTIONS. (1) "Fresh water is mostly for drinking." Drinking and cooking are a small part of the homes share. (2) "Industry is the big user." It is second. (3) "Water in a product is the water you can see in it." A T-shirt is dry; the water was used to make it.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: groundwater, renewable but finite (objective 2)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'How renewable groundwater gets used up', 'light', { size: 28 });
  const g = 0.30, lw = 5.55, y0 = BODY_Y - 0.14, vh = lw * 540 / 960;
  video(s, 'ff-aquifer', M, y0, lw, vh, 'vid_aq');
  card(s, { x: M, y: y0 + vh + 0.14, w: lw, h: 1.30, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'wx' });
  s.addText([
    { text: 'Recharge 10 a year. Pumping 50 a year.', options: { bold: true, color: C.dark, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'Net loss: ', options: { bold: true, color: C.accentInk } }, { text: '50 − 10 = 40 billion litres a year.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'To empty: 1,000 ÷ 40 = 25 years. To refill: 1,000 ÷ 10 = 100 years.', options: { bold: true, color: C.alert } },
  ], { x: M + 0.24, y: y0 + vh + 0.14, w: lw - 0.48, h: 1.30, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'wx_t' });
  const RX = M + lw + g, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 2.40, name: 'fb' });
  s.addText('WHY IT RUNS OUT', { x: RX + 0.24, y: y0 + 0.10, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'fb_h' });
  s.addText([
    { text: 'Rain recharges an aquifer slowly.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Wells take water out, often far faster.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Out faster than in: the water table falls.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Refilling takes far longer than emptying.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 0.52, w: RW - 0.48, h: 1.80, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'fb_t' });
  card(s, { x: RX, y: y0 + 2.54, w: RW, h: 2.36, name: 'rs' });
  s.addText('WHEN THE WATER TABLE FALLS', { x: RX + 0.24, y: y0 + 2.64, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'rs_h' });
  s.addText([
    { text: 'Wells dry up.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Wells and pumps must go deeper, and cost more.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Streams and lakes fed by groundwater shrink.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'The ground can sink: Mexico City has sunk by metres.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 3.04, w: RW - 0.48, h: 1.80, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'rs_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the animation (ON CLICK, so say the idea first), why it runs out, what happens when the water table falls, then the worked example.\n\n'
    + 'OBJECTIVE 2 ONLY, per TEMPLATE.md. BUILDING PAST LAST LESSON AND THE RESOURCES UNIT: they already know that deep groundwater refills over thousands of years (last lesson\'s speeds) and that some aquifers are pumped faster than they recharge (What The Earth Gives Us). What is NEW today is the store: an aquifer is rock holding water in its gaps, the top of the water is the WATER TABLE, rain soaking in is RECHARGE, and the amount in the store is changed by BOTH at once.\n\n'
    + 'THE ANIMATION (about 30 seconds, a MODEL, not a real aquifer) PAUSES at every step: the aquifer holds 1,000 billion litres; rain adds 10 a year (a thin arrow); wells take out 50 a year (a thick arrow: the widths are to scale); net loss 50 − 10 = 40 a year; then the years tick by, 0 to 25, the water table falls and the readout counts down to empty. THEN: if the pumping stopped, 1,000 ÷ 10 = 100 years to refill. Talk over the pauses. You can click it to play it again.\n\n'
    + 'THE TWO NUMBERS TO LAND: 25 years to EMPTY and 100 years to REFILL. It is not that the recharge stops. It never stops. It is just much smaller than the pumping. Renewable means it comes back; it does not mean it comes back as fast as we use it. That is why the banner says finite.\n\n'
    + 'THE REAL CASES (verified). The High Plains (Ogallala) Aquifer in the USA: by 2013 the USGS found about 8% of its stored water gone (267 million acre-feet), the average water level down 15.4 feet, and in places down 160 feet, mostly from pumping for irrigation. USGS lists the effects of groundwater depletion as drying wells, lower streams and lakes, higher pumping costs and land subsidence. Mexico City, pumped for over a century, has sunk by metres (up to about 10 m in places over the century, and up to 40 cm a year in the historic centre now). UNESCO: about half the world drinks groundwater, and it supplies about a quarter of the water used for irrigation.\n\n'
    + 'MISCONCEPTIONS. (1) "Renewable means it cannot run out." Renewable is about the rate of return. (2) "Recharge stops when we pump." It carries on; only the difference is lost. (3) "A deeper well fixes it." It buys time at a higher cost, and the store is still going down.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: "What should be the correct answer?" (objective 3 is taught here)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light'); sub(s, 'Spot the mistake. One of these is already right.', 'light');
  const ROWS = [
    ['“There is plenty of fresh water in the world, so nobody can be short of it.”', 'It is about WHERE. A person in Canada has about 73,000 m³ a year; in Saudi Arabia, about 69. That is over 1,000 times less.'],
    ['“A country with a lot of rain will never have a water shortage.”', 'It is about WHEN. In India about 75% of the rain falls in 4 months. For the other 8 months the water must be stored.'],
    ['“A water shortage means all the water has been used up.”', 'Not used up: it can be too far, too dirty or too costly. About 2.1 billion people lack safely managed drinking water.'],
    ['“Water that falls in the wet season can be stored for the dry season.”', 'Nothing to correct: this one is right. That is why reservoirs, tanks and groundwater matter.'],
  ];
  const rowH = 0.98, gap = 0.16, y0 = BODY_Y + 0.40;
  ROWS.forEach(([wrong, right], i) => {
    const y = y0 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.10, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, { shape: S.roundRect, rectRadius: 0.10, x: M + 5.60, y: y + 0.08, w: CW - 5.60 - 0.14, h: rowH - 0.16, fill: { color: ANS }, line: { color: i === 3 ? C.support : C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 13, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 16, objectName: `wd${i}_a` });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. THIS IS WHERE OBJECTIVE 3 IS TAUGHT, because the template gives each I Do one objective (as in Lesson 1). THE MODE IS "WHAT SHOULD BE THE CORRECT ANSWER?" (TEMPLATE.md): the topic has sharp misconceptions, and Lesson 1 used "Finish this one", so the template says to alternate. ONE OF THE FOUR IS ALREADY CORRECT (row 4): "this one is fine" is better work than inventing a flaw, so say so when it comes up.\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL, and they say WHAT THE STUDENT DID, not only the right answer. Each answer carries a number, so the reveal TEACHES the point.\n\n'
    + 'ROW 1 IS "WHERE": the world total is large, but it is not shared out evenly. Total renewable water per person per year (FAO and World Bank, 2020): Iceland about 498,000 m³, Canada about 73,000, Brazil about 41,000, China about 1,900, India about 1,400, Egypt about 560, Saudi Arabia about 69, Kuwait about 5. Canada has 73,469 ÷ 68.9, over 1,000 times more than Saudi Arabia per person. ROW 2 IS "WHEN": about 75% of India\'s rain falls in June to September (sources say 70 to 80%). For eight months there is very little, so storage (reservoirs, tanks, groundwater) carries the people through; the worksheet Q11 does the sum (18.75% a month against 3.125%, six times). ROW 3 IS THE DEEPER MISTAKE: "shortage" does not mean "none left". Water can exist but be too far, too dirty, too costly, or not there when needed. The WHO and UNICEF figure (2025) is 2.1 billion people without SAFELY MANAGED drinking water: water at home, when needed, free from contamination. Ask which of those three words is a WHEN. ROW 4 IS ALREADY RIGHT: it is the answer to "when".\n\n'
    + 'USE REAL ERRORS where you have them: the Do Now Q6 votes ("homes use the most") are a version of the same mistake, that the water we see is the water that is used.\n\n'
    + 'IF THEY ARE QUICK, ask for a place with plenty of water but a shortage in the dry season. IF SHORT OF TIME, do rows 1 and 2 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Name the three main uses of fresh water.', 'Agriculture (about 70%), industry (about 20%) and homes (about 10%).'],
    ['Explain how groundwater can be used up even though it is renewable.', 'Wells take it out faster than rain adds it, so the water table falls. Refilling takes far longer.'],
    ['An aquifer holds 600 billion litres. Rain adds 5 a year, wells take 35. How many years until it is empty?', '20 years. 35 − 5 = 30 a year lost. 600 ÷ 30.'],
    ['Explain why a country with plenty of rain can still have a water shortage.', 'The rain may fall in a few months, or far from where people live. It must be in the right place at the right time.'],
    ['Name the three places where most fresh water is found.', 'Ice caps and glaciers, groundwater, and lakes, rivers and swamps.'],
    ['Name the process that turns water vapour into cloud droplets.', 'Condensation.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (the stores of fresh water, last lesson) and Q6 (the water cycle, Year 7 and last lesson).\n\n'
    + 'Q1 IS OBJECTIVE 1: all three, with farming first. If they say "drinking", ask which of the three uses that belongs to. Q2 IS OBJECTIVE 2 and needs "faster than" AND "water table falls" (or "takes far longer to refill"), not just "it runs out". Q3 IS THE NEW CALCULATION: 35 − 5 = 30 a year, then 600 ÷ 30 = 20 years. Watch for 600 ÷ 35 = 17.1 (they forgot the recharge) and 600 ÷ 5 = 120 (they used the recharge alone, which is the REFILL time). Q4 IS OBJECTIVE 3 and needs where OR when, with an example (monsoon, or far from the people).\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, ask "how long would it take to refill?" (600 ÷ 5 = 120 years). IF SHORT OF TIME, cut Q6.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14: the worksheet
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 14, 'light')); pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} worksheet`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const TIERS = [
    ['BRONZE', C.dark, 'DCEEF8', 'What we use water for', 'Sort the uses, find a share of a volume, and explain where the water in a T-shirt goes. Read the worked example first.'],
    ['SILVER', C.accentInk, 'FFF6CC', 'Groundwater used up', 'Time to empty and time to refill a model aquifer, and what happens when the water table falls.'],
    ['GOLD', C.alert, 'FBE4E8', 'Where and when', 'Compare countries and seasons with real data, and explain why a shortage is not just about how much.'],
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
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note. THE WORKSHEET IS THE TASK. There is no game today (the brief does not ask for one).\n\n'
    + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md). BRONZE: sorting the uses, a percentage of a volume (70% of 4,000), the hamburger in buckets, and where the water in a T-shirt goes, with a fully worked example, a half-worked one and blank ones. SILVER: the model aquifer (net loss, time to empty, then time to REFILL, which is the new idea), the "why does that step work?" prompt (Q8: why subtract the recharge) and the problems when the water table falls. GOLD: reading real data (Brazil against Egypt; the monsoon, 18.75% a month against 3.125%), "where would you meet this outside the lesson" (Q12), why a reservoir helps and what could still go wrong (Q13), and the whole idea in their own words (Q14). THE DATA IS ON PAGE 1 so they do not hunt for it. AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student.\n\n'
    + 'THE QUESTIONS ARE MIXED ON PURPOSE (interleaved): a calculation, then a sorting, then an explanation. The sheet says so. THE WORST MISTAKES TO LOOK FOR: in Q6, dividing the stock by the pumping alone (900 ÷ 60 = 15) and forgetting the recharge; and in Q7, dividing by the net loss instead of the recharge. THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is the recharge going in or coming out?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
  );
}

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'Mark', 3, 'light');
  s.addText('Turn to the back. Mark your own in a different colour.', { x: M, y: 1.00, w: CW, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 32, bold: true, valign: 'middle', margin: 0, lineSpacing: 38, objectName: 'slide_title' });
  card(s, { x: M, y: BODY_Y + 0.52, w: CW, h: 3.20, name: 'mk_card' });
  s.addText('CHECK YOUR WORK AGAINST THIS', { x: M + 0.30, y: BODY_Y + 0.68, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'Every calculation shows the working, and the unit (litres, billion litres or years).', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Net loss = pumping − recharge. Time to empty = stock ÷ net loss. Time to refill = stock ÷ recharge.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Your reasons say where the water is, or when it falls, and not only how much there is.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Write the correct answer next to anything wrong. Do not rub it out.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 1.12, w: CW - 0.6, h: 2.50, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'THE ANSWERS ARE PRINTED UPSIDE DOWN at the foot of the last worksheet page. The calculations have exact answers (Q3 2,800 L; Q4 240 buckets; Q6 45 a year and 20 years; Q7 60 years; Q10 about 73 times; Q11 18.75%, 3.125% and 6 times); the explanations say what a good answer contains. Q12 has no single right answer: check it names a place or time, where the water is, and why people cannot use it.\n\n'
    + 'WALK ROUND reading for the commonest mistake: dividing the stock by the pumping and forgetting the recharge (Q6), and dividing by the net loss when the question asks about refilling (Q7). Ask "which number is going OUT, and which is coming IN?"'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['Farming uses more of the fresh water people take than industry and homes together.', 'TRUE'],
    ['Groundwater is renewable, so it cannot be used up.', 'FALSE'],
    ['A country with plenty of rain cannot have a water shortage.', 'FALSE'],
    ['An aquifer gains 10 billion litres a year and 30 billion litres a year are pumped out. It loses 20 billion litres a year.', 'TRUE'],
    ['A water shortage always means that all the water has been used up.', 'FALSE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('The two jars are still on the windowsill. Look at them. Has anything changed? Write down what you see.', { x: M, y: H - 0.90, w: RIGHT - M, h: 0.56, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2 IS OBJECTIVE 2: renewable is about the rate of return, not "unlimited". Q3 IS OBJECTIVE 3, "WHEN": rain can fall in a few months and far from the people. Q5 IS OBJECTIVE 3 TOO: a shortage can mean the water is too far, too dirty, too costly or not there when needed. Q1 is plainly TRUE (about 70% against about 30%). Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): 30 − 10 = 20 billion litres a year. Ask them to say "out minus in".\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY, if you have not: the hamburger was C, about 2,400 litres, and farming was the biggest use.\n\n'
    + 'THE CLOSING LINE DOES NOT NAME THE NEXT LESSON, BECAUSE THE UNIT\'S LESSON ORDER IS NOT WRITTEN DOWN (TEMPLATE.md asks for it). It points at the two jars set up at the end of last lesson (pond or tank water, one with a pinch of fertiliser, for the eutrophication lesson). If the jars were not set up, CHANGE THE LINE. If they were, take two or three of the written predictions and look at the jars together.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

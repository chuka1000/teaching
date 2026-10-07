/**
 * Y9 Science, What The Earth Gives Us. Classes 9G and 9I — taught identically (confirmed in
 * TIMETABLE.md and again by Chuka on 2026-09-28). One deck and worksheet serves both; only the
 * taught date differs.
 *
 * Single, 50 minutes. Topsoil palette, carried on from the unit (What The Land Gives Us, Losing
 * The Soil, Cities And What Can Be Done).
 *
 * PREVIOUS, per the brief: reference/What The Land Gives Us.pptx. Read it. It already establishes
 * soil as non-renewable ON A HUMAN TIMESCALE, and states the idea this lesson generalises: "not
 * whether it CAN reform, but whether it reforms fast enough to matter on a human timescale." I
 * also read Losing The Soil and Cities And What Can Be Done (the two lessons taught since, most
 * recent 8 Oct 2026) so the Do Now does not repeat their questions. Vocabulary already taught:
 * population, community, producer, organic matter, erosion, desertification, runoff,
 * urbanisation. This lesson does not continue the cities/erosion thread; it broadens from land
 * specifically back to natural resources in general, using the same rate-not-category idea.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, What's Wrong With This? ("Sorter would suit
 * this" was the brief; a first sort-into-bins build felt thin and was rebuilt as Spot The Error,
 * see the game's own header comment), with the worksheet as the fallback, built every time.
 *
 * MEDIA. This unit's other three lessons use icons and diagrams, no video, and this one follows
 * that: icons throughout (sun, wind, coal, oil, tree, water, fish, gem) plus one rate bar for the
 * aquifer example. No animation was generated because nothing here is a process that benefits from
 * one moving picture the way a limb or a graph does; the pictures needed are things (a resource),
 * which icons already show.
 *
 * FACTS checked with a web search: the Grand Banks northern cod stock fell from about 1.6 million
 * tonnes (1962) to about 110,000 tonnes (1992), when Canada closed the fishery (Britannica; Collapse
 * of the Atlantic northwest cod fishery, Wikipedia). The Ogallala Aquifer recharges by roughly an
 * inch of water a year in much of the region, while pumping removes water 1.5 to 3 times faster than
 * that, and a fully drained aquifer would take 500 to 1,300 years to refill (K-State Sunflower
 * District; USDA Climate Hubs; University of Colorado Law Review). Every number used in the deck,
 * game and worksheet is checked in build/what-the-earth-gives-us-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 15 October 2026';
const LESSON = 'What The Earth Gives Us';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_topsoil_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y9 Science · 9G and 9I';

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
    key: 'topsoil', palette: C, minutes, mode, slideH: H,
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
    line: { color: o.line || 'E4D8BE', width: o.lineWidth || 1.3 },
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
      fill: { color: 'F2EBDD' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
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
  s.addText(LESSON, { x: 2.60, y: 0.22, w: 8.10, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['Name two things soil is made of, other than weathered rock.', 'Any two: organic matter (dead plant and animal remains), living organisms, water, air.'],
    ['A country clears land for farming so it grows from 30% to 45% of the country\'s area. Calculate the increase, in percentage points.', '15 percentage points.'],
    ['A student says: "Soil is renewable, because new soil can form." Explain the mistake.', 'Soil can form again, but far slower than it is used or lost, so on a human timescale it counts as non-renewable.'],
    ['Name one thing you use today that came from under the ground.', 'Any reasonable answer: coal, oil, gas, a metal, a gemstone, water.'],
    ['Name one way we get energy from the Sun or the wind, without burning anything.', 'Any reasonable answer: solar panels, wind turbines.'],
    ['A fish population is caught faster than it can breed. Predict what happens to the number of fish over time.', 'It falls. Caught fast enough, it could run out.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length: there is no practical today. Six clicks.\n\n'
    + 'I READ reference/What The Land Gives Us.pptx (the stated PREVIOUS lesson) and checked every question against the last three Do Nows in the unit (Cities And What Can Be Done, Losing The Soil, What The Land Gives Us). Nothing repeats: soil formation time and coal formation time have each been asked twice already in the last two lessons, so neither is asked again directly, and "non-renewable on a human timescale" comes back in a new shape (Q3, spot-the-error) rather than as a straight repeat of Losing The Soil\'s Do Now Q4.\n\n'
    + 'Q1 IS RETRIEVAL, a new shape of an idea from the I Do slide of What The Land Gives Us (soil is not just crushed rock). Q2 IS THE ONE CALCULATION, unrelated in content but keeping the skill in rotation: 45 − 30 = 15 percentage points. Watch for 50% (dividing 45 by 30 instead of subtracting).\n\n'
    + 'Q3 IS THE HINGE QUESTION. It retrieves Losing The Soil\'s central idea in a new shape (spot-the-error, not recall) and is the whole of today\'s objective 3 in one sentence, stated before the lesson starts. If most of the room gets this right unprompted, today\'s job is showing it applies far beyond soil.\n\n'
    + 'Q4 TO Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. They prime today\'s three categories: things dug up (fossil fuels, ores), things that keep arriving (sunlight, wind), and a resource that can run out if used too fast (fish). Q6 IS THE HOOK\'S OWN IDEA, asked in general terms before the Hook makes it concrete and shocking.\n\n'
    + 'TAUGHT IDENTICALLY TO 9G AND 9I. CHANGE THE DATE before you teach.'
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
  const GOALS = ['Define a natural resource.', 'Sort resources into renewable and non-renewable.', 'Explain why the difference is about rate, not category.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Renewable or not is not about the resource. It is about the ', false], ['rate', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The last three lessons narrowed in: land, then soil, then cities. Today widens back out. Say "we have spent three lessons on land and soil. Today is every natural resource: what counts as one, and how we decide if it can run out."\n\n'
    + 'OBJECTIVE 3 IS WHY THIS LESSON EXISTS, exactly as with What The Land Gives Us. Objectives 1 and 2 set it up: you cannot sort resources until you can define one, and you cannot explain the rate idea until you have both bins to compare. Say objective 3 directly, once, up front.\n\n'
    + 'THE BANNER IS THE LESSON, stated as a claim before the evidence for it. It is also Do Now Q3, restated as the objective. Point back at it if anyone remembers answering that question.'
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
  s.addText('In 1962 there were about 1.6 million tonnes of cod off Newfoundland. About how many tonnes were left by 1992?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 23, bold: true, valign: 'middle', margin: 0, lineSpacing: 28, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('fish', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_fish' });
  const OPTS = [
    ['A', 'About 1 million tonnes'],
    ['B', 'About 500,000 tonnes'],
    ['C', 'About 110,000 tonnes'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: the next slide does.\n\n'
    + 'ANSWER, FOR YOU: C. About 110,000 tonnes, a fall of roughly 93% in thirty years. Canada closed the Grand Banks cod fishery in 1992, and it has still not recovered to anywhere near 1962 levels. The catch in 1962 alone was close to the entire 1992 stock. Expect A and B to attract most of the votes: a 93% fall in thirty years is far outside most students\' intuition for how fast a "renewable" resource can be lost.\n\n'
    + 'DO NOT EXPLAIN WHY YET. Say "cod can breed. Cod are not fossil fuel. So why did they nearly run out?" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — what a natural resource is
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'What counts as a natural resource', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.10, name: 'def' });
  s.addText([
    { text: 'A natural resource is ', options: {} },
    { text: 'anything from the Earth', options: { bold: true, color: C.accentInk } },
    { text: ', not made by people, that we use.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 18, valign: 'middle', margin: 0, lineSpacing: 24, objectName: 'def_t' });
  const ITEMS = [
    ['sun', 'Sunlight'], ['wind', 'Wind'], ['water', 'Fresh water'], ['tree', 'Forests'],
    ['coal', 'Coal'], ['oilcan', 'Oil'], ['gem', 'Minerals'], ['fish', 'Fish'],
  ];
  const cw2 = (RIGHT - M - 7 * 0.16) / 8;
  ITEMS.forEach(([icon, label], i) => {
    const x = M + i * (cw2 + 0.16), y = BODY_Y + 1.40;
    card(s, { x, y, w: cw2, h: 1.86, name: `r${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + (cw2 - 0.62) / 2, y: y + 0.20, w: 0.62, h: 0.62, objectName: `r${i}_icon` });
    s.addText(label, { x: x + 0.05, y: y + 0.96, w: cw2 - 0.10, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 12, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 14, objectName: `r${i}_t` });
  });
  sentence(s, [['A phone is not a natural resource. The oil, metal and minerals ', false], ['inside', true], [' it are.', false]], { y: BODY_Y + 3.44, h: 0.70, size: 15.5, name: 'nr_banner' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the definition and its row of examples, then the banner.\n\n'
    + 'THE DEFINITION HAS TWO PARTS: from the Earth, AND not made by people. Say both. Nothing on the row of eight was manufactured; every one of them is dug, grown, caught or arrives on its own (sunlight, wind).\n\n'
    + 'THIS SLIDE IS DELIBERATELY THIN. Name the eight, spend about a minute on the row, and say so: "you do not need to memorise this list, you need to reason about them next."\n\n'
    + 'THE BANNER IS THE SUBTLETY WORTH A SENTENCE. A phone, a chair, a road are not natural resources themselves, because people made them. But trace any of them back and there is always a natural resource underneath: plastic from oil, metal from ore, a wooden chair from a tree. If a keen student asks "so is everything a natural resource really", say yes, once you trace it back far enough, which is exactly why objective 2 matters: knowing which of those underlying resources can run out.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — renewable, non-renewable, and the rate
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Renewable, non-renewable, and the rate', 'light');
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y, w: rw, h: 2.30, name: 'ren' });
  s.addText('RENEWABLE', { x: M + 0.26, y: BODY_Y + 0.16, w: rw - 0.52, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ren_h' });
  s.addText([
    { text: 'Nature replaces it as fast as, or faster than, we use it.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Sunlight, wind and waves: replaced far faster than we could ever use them up.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'A forest, cut down no faster than it regrows.', options: { bullet: true } },
  ], { x: M + 0.26, y: BODY_Y + 0.58, w: rw - 0.52, h: 1.66, color: C.ink, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'top', margin: 0, lineSpacing: 16, objectName: 'ren_t' });
  const nx = M + rw + 0.30;
  card(s, { x: nx, y: BODY_Y, w: rw, h: 2.30, name: 'non' });
  s.addText('NON-RENEWABLE', { x: nx + 0.26, y: BODY_Y + 0.16, w: rw - 0.52, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'non_h' });
  s.addText([
    { text: 'It forms far slower than we use it, so on a human timescale the stock does not refill.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Coal, oil, gas and metal ores: they take millions of years, or do not form again at all.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Soil counts too, from last unit: it forms over centuries.', options: { bullet: true } },
  ], { x: nx + 0.26, y: BODY_Y + 0.58, w: rw - 0.52, h: 1.66, color: C.ink, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'top', margin: 0, lineSpacing: 16, objectName: 'non_t' });
  card(s, { x: M, y: BODY_Y + 2.46, w: CW, h: 1.60, name: 'aq' });
  s.addText('SAME KIND OF RESOURCE, DIFFERENT ANSWER', { x: M + 0.26, y: BODY_Y + 2.60, w: CW - 0.52, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.6, valign: 'middle', margin: 0, objectName: 'aq_h' });
  s.addText('Rain refills an ordinary well quickly. But some deep, old groundwater barely refills at all: pumped 1.5 to 3 times faster than it recharges, in some places. Drained, it could take 500 to 1,300 years to refill.', { x: M + 0.26, y: BODY_Y + 2.98, w: CW - 3.10, h: 0.96, color: C.ink, fontFace: F.body, fontSize: 12.5, bold: true, valign: 'top', margin: 0, lineSpacing: 16, objectName: 'aq_t' });
  const bx = RIGHT - 2.60, bw = 2.20;
  const bar = (label, pct, y, name) => {
    s.addText(label, { x: bx, y: y - 0.30, w: bw, h: 0.28, color: C.inkSoft, fontFace: F.body, fontSize: 10.5, bold: true, valign: 'middle', margin: 0, objectName: `${name}_l` });
    s.addShape(S.roundRect, { x: bx, y, w: bw, h: 0.26, rectRadius: 0.05, fill: { color: C.tintDeep }, line: { color: C.tintDeep, width: 0 }, objectName: `${name}_track` });
    s.addShape(S.roundRect, { x: bx, y, w: bw * pct / 100, h: 0.26, rectRadius: 0.05, fill: { color: C.support }, line: { color: C.support, width: 0 }, objectName: `${name}_fill` });
  };
  bar('Refills each year', 33, BODY_Y + 3.30, 'aq_recharge');
  bar('Pumped out each year', 100, BODY_Y + 3.78, 'aq_pump');
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the renewable card, the non-renewable card, the aquifer card, then its two bars.\n\n'
    + 'OBJECTIVES 2 AND 3 TOGETHER. The two cards give the categories (objective 2). The bottom card is objective 3, the whole point of the lesson: the SAME kind of resource, water, can be renewable in one place and non-renewable in another, because what decides it is the rate, not the kind of resource.\n\n'
    + 'THE FOREST LINE IN THE RENEWABLE CARD is the example to point back to all lesson: cut no faster than it regrows, a forest is renewable. Do not resolve it further here; We Do row 2 does.\n\n'
    + 'THE BARS ARE ILLUSTRATIVE, NOT TO SCALE ON THE SAME AXIS: they show pumping outpacing recharge, not an exact ratio. The numbers in the text (1.5 to 3 times faster, 500 to 1,300 years to refill) are the real figures, for the Ogallala Aquifer under the American Great Plains, used for irrigation. You do not need to name it unless asked.\n\n'
    + 'THE HEADLINE TO SAY OUT LOUD: "it is not what the resource is, it is whether we take it faster than it comes back." That sentence is the Objectives banner, and it is the answer to the Hook: cod can breed, but they were caught faster than they could.'
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
    ['"Coal is not a natural resource, because people have to mine it before we can use it."', 'A natural resource comes from the Earth, not made by people. Coal is the resource; mining just gets it out.'],
    ['"Wood is non-renewable, because once a tree is cut down, it is gone."', 'That tree is gone, but the forest can regrow. Wood is renewable if cut no faster than the forest regrows.'],
    ['"Fresh water is always renewable, because rain keeps falling."', 'Rain refills an ordinary well or river quickly. Deep, old groundwater can be pumped out far faster than it refills.'],
    ['"Fish are a renewable resource, so a fishery can never run out."', 'Renewable only if caught no faster than they breed and grow. Caught faster than that, a fishery can collapse.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'F2EBDD' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 1. It is the same confusion the definition slide pre-empted with the phone example: made FROM a natural resource is not the same as made BY people. Coal was not manufactured; it was dug up.\n\n'
    + 'ROWS 2 TO 4 ARE ALL OBJECTIVE 3, from three different resources, deliberately more airtime than objectives 1 and 2 combined, per the unit\'s own convention (see What The Land Gives Us).\n\n'
    + 'ROW 2 IS THE FOREST LINE FROM I DO, RESOLVED. "Non-renewable because it is gone" confuses one tree with the resource. The resource is the forest, and whether IT is renewable depends on the cutting rate against the regrowth rate.\n\n'
    + 'ROW 3 IS THE AQUIFER IDEA, restated for a general audience without the numbers. Ask a follow-up: "so is fresh water renewable or not?" Answer: depends which water, and how fast it is taken.\n\n'
    + 'ROW 4 IS THE HOOK, WORKED. Point back at the tally: cod could breed, and nearly ran out anyway, because the catch outran the breeding.'
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
    ['State what a natural resource is.', 'Something that comes from the Earth, not made by people, that we use.'],
    ['Name one natural resource that comes from under the ground.', 'Any reasonable answer: coal, oil, natural gas, a metal ore.'],
    ['Classify solar energy as renewable or non-renewable, and explain why.', 'Renewable: the Sun supplies energy far faster than we could ever use it up.'],
    ['Classify oil as renewable or non-renewable, and explain why.', 'Non-renewable: it takes millions of years to form, far slower than we use it.'],
    ['Explain why a forest can be renewable in one place and non-renewable in another.', 'Cut no faster than it regrows: renewable. Cut faster than that: non-renewable in practice.'],
    ['State what actually decides whether a resource counts as renewable.', 'Not whether it CAN be replaced, but whether it is replaced as fast as, or faster than, it is used up.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q1 needs both halves: from the Earth, not made by people. Q2 has several right answers; take two or three.\n\n'
    + 'Q3 AND Q4 ARE OBJECTIVE 2, ONE EACH WAY. Both need the reason, not just the label: "renewable" alone is half an answer.\n\n'
    + 'Q5 AND Q6 ARE OBJECTIVE 3, COLD, IN TWO PHRASINGS. Q5 is the forest, the running example all lesson. Q6 IS THE LESSON\'S THESIS, asked directly: this is the rehearsal for Gold on the worksheet and for the game\'s hardest round.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q5 and Q6, and ask "can you think of a resource that is renewable for one country and non-renewable for another?" (Fresh water is the easiest answer.) IF SHORT OF TIME, cut Q1 and Q2.'
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
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 23, bold: true, valign: 'middle', margin: 0, lineSpacing: 28, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const ROUNDS = [
    ['ROUND 1', C.alert, 'FBEAE2', 'Clear cases', 'A student makes a claim about a resource. Say what is wrong with it, or whether nothing is.'],
    ['ROUND 2', C.support, 'EAF0F1', 'Needs a reason', 'Harder claims. Two of them always confuse one example with the whole resource.'],
    ['ROUND 3', C.accentInk, 'F2EBDD', 'It depends, with numbers', 'Given the actual rates. Very hard. The last two questions are meant to be almost impossible.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  ROUNDS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.10, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.00, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 2.86, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS WHAT\'S WRONG WITH THIS?, a Spot The Error game (a first version sorted resources into bins; that felt thin and used "sort" where "categorise" would have read better, so it was rebuilt as this), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "What The Earth Gives Us game" from Google Classroom. Three rounds of six questions, each on their own device: a claim is shown ("A student says: ...") and they choose what is wrong with it from a fixed menu of named errors, or "Nothing is wrong with this claim." A wrong answer says what the mistake probably was. EVERY STUDENT GETS A DIFFERENT GAME: a different draw of claims, different numbers in round 3, in a different order. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 is claims about the eight clear cases from I Do 1 and the two cards on I Do 2: everyone should finish this round green. Round 2 is harder claims, always including two that confuse one example (one tree, one catch) with the whole resource. About a third of the claims in rounds 1 and 2 are actually correct, so "nothing is wrong" is a real answer, not a trap to avoid.\n\n'
    + 'ROUND 3 GIVES ACTUAL RATES: a student draws a conclusion (renewable or non-renewable) from two real numbers, and the game checks whether that conclusion actually follows. Once both rates are given, "ignores the rate" is the mistake if the conclusion is wrong, and the claim can genuinely be correct too. The last two questions (17 and 18) are numeric, drawn from a small pool: how far a catch or a cut exceeds what the resource can replace, and how many years an aquifer pumped faster than it recharges would take to lose half its water. Expect most students to fail these two. That is the design; tell them before they start. The numbers in round 3 are invented; the reasoning is the point.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. The "Your mistakes" summary groups by the misconception a question was testing, not by which wrong option was tapped, so "3 times" always means the same kind of mistake. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "does the reason given actually support the conclusion?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['A natural resource is something made in a factory.', 'FALSE'],
    ['Sunlight and wind are renewable resources.', 'TRUE'],
    ['If a resource can regrow, it is always renewable.', 'FALSE'],
    ['A forest cut faster than it regrows behaves like a non-renewable resource.', 'TRUE'],
    ['Coal is renewable, because plants can always grow again.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Renewable or not is not about the resource. It is about the rate.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY. Coal, ore and oil are all dug up, not made; a phone is made, from resources.\n\n'
    + 'Q2 IS OBJECTIVE 2, THE CLEAREST CASE. Q3 IS THE MISCONCEPTION AND OBJECTIVE 3 DIRECTLY: "can regrow" is not the same as "does regrow fast enough". If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q4 SETTLES THE FOREST LINE from I Do and We Do, one last time. Q5 IS THE MOST COMMON REAL-WORLD VERSION OF THE MISCONCEPTION, the exact wrong claim We Do row 2 corrected, now asked cold.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER WORD FOR WORD, on purpose, the same pattern as the rest of the unit. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

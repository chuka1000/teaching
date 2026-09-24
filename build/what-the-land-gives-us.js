/**
 * Y9 Science — Earth Resources, Lesson 1: What the land gives us.
 * Single, 50 minutes. Standard archetype. Taught identically to 9G and 9I
 * (per confirmed practice, see TIMETABLE.md); one deck serves both.
 *
 * Follows reference/Human Population Growth.pptx, the Ecosystems unit's
 * closing lesson. That deck's I Do 2 already covered "forest and grassland
 * are cleared to grow food" in one sentence — Do Now retrieves that fact
 * directly rather than re-teaching it, and I Do 1 (the land resources
 * overview) is deliberately thin for the same reason.
 *
 * AVOID, per the brief: listing resources as a memorisation exercise.
 * That is why I Do 1 is a single fast row of chips, not five cards worth
 * of detail, while I Do 2 (what soil is) and the whole second half of the
 * lesson give real weight to objective 3 — the one the brief says earns
 * the lesson. We Do, Cold Call, and the worksheet's Gold tier all return
 * to the same reasoning: soil forms over centuries, is lost over years,
 * and that gap is what "non-renewable on a human timescale" means.
 *
 * THEY FOUND HARD, inferred from Human Population Growth's own notes since
 * the brief left this blank: "the Gold graph question, and the one asking
 * them to judge a claim" were the stall points last lesson. Objective 3
 * asks for exactly that kind of comparative, judge-a-claim reasoning again
 * (formation rate vs loss rate), so Gold's Q9 here is scaffolded as an
 * explicit claim to judge, the same skill named as hard before, not a new
 * one sprung on them cold.
 *
 * Facts checked: FAO figures on topsoil formation (roughly 2-3 cm per
 * 1,000 years, varying 0.25-1.5 mm/year by climate) and erosion rates on
 * cropland (single-digit to low-double-digit tonnes/hectare/year, well
 * above the ~0.15 t/ha/year formation rate). The viral "60 harvests left"
 * claim was checked and deliberately NOT used — it traces to no credible
 * source and Our World in Data's review calls it overblown; the real,
 * sourced comparison (centuries to form, years to lose) makes the same
 * point without it. See the chat for search sources.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Monday 5 October 2026';
const LESSON = 'What The Land Gives Us';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_topsoil_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y9 Science · Earth Resources · Lesson 1';

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
const title = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y, w: RIGHT - M, h: 0.80,
  color: mode === 'dark' ? C.tint : C.dark, fontFace: F.title, fontSize: 32, bold: true,
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
    x: 3.20, y: 0.22, w: 6.90, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 21,
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
    ['State what an ecosystem is.', 'All the living things in an area, plus their environment.'],
    ['Name one thing that happens to forests as the population grows.', 'They are cleared to grow food.'],
    ['State what a producer does.', 'Makes its own food using light.'],
    ['State one thing a growing plant takes from soil.', 'Water and nutrients (any correct example).'],
    ['Name one material taken from the ground for building.', 'Any real example: stone, sand, metal ore.'],
    ['State one way land is used, other than growing food.', 'Any real example: mining, forestry, building, energy.'],
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
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'Q1-3 ARE STRAIGHT RETRIEVAL from Human Population Growth. Q2 in particular: that deck covered land clearing for food in one sentence, this lesson builds on it rather than re-teaching it.\n\n'
    + 'Q4-6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. They are priming today\'s vocabulary, not testing it.\n\n'
    + 'TAUGHT IDENTICALLY TO 9G AND 9I. CHANGE THE DATE before you teach.'
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
    'Identify the main land resources.',
    'Explain what soil is and why it matters.',
    'Explain why soil counts as a non-renewable resource on a human timescale.',
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
  s.addText('Land looks endless. What it takes to remake some of it is not.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.58, w: RIGHT - M, h: 0.70,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'OBJECTIVE 3 IS WHY THIS LESSON EXISTS. Say that directly: 1 and 2 set it up, 3 is the point. The banner is that promise, made once, up front.'
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
  s.addText('Coal took millions of years to form. How long does it take to form the soil we grow food in?', {
    x: M, y: 0.86, w: RIGHT - M, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 25,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });

  const OPTS = [
    ['A', 'A few years. Soil forms quickly.'],
    ['B', 'Much slower than you would think: hundreds to thousands of years.'],
    ['C', 'Soil does not form at all. It has just always been there.'],
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
    + 'Hands up for each. Tally on the board. Expect A: most students have never thought about soil having a formation time at all.\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. Say "let\'s find out" and move to I Do.\n\n'
    + 'ANSWER, FOR YOU: B. Not literally as slow as coal (millions of years), but far slower than anyone\'s intuition: roughly a few hundred to about a thousand years for a few centimetres, depending on climate.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — a fast overview, on purpose
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The main land resources', 'light');
  sub(s, 'Fast overview. The rest of the lesson is about one of these.', 'light');

  const ITEMS = [
    { icon: 'seedling', name: 'Food', note: 'Crops, grazing land' },
    { icon: 'gem', name: 'Minerals', note: 'Metals, dug from rock' },
    { icon: 'tree', name: 'Timber', note: 'Wood, from forests' },
    { icon: 'mountain', name: 'Building materials', note: 'Stone, sand, clay' },
    { icon: 'oilcan', name: 'Energy', note: 'Coal, oil, gas' },
  ];
  const cw = (RIGHT - M - 4 * 0.20) / 5, cardY = BODY_Y + 0.75, cardH = 2.30;
  ITEMS.forEach((it, i) => {
    const x = M + i * (cw + 0.20);
    card(s, { x, y: cardY, w: cw, h: cardH, name: `lr${i}` });
    s.addImage({ path: ICON(it.icon, 'accentInk'), x: x + cw / 2 - 0.24, y: cardY + 0.22, w: 0.48, h: 0.48, objectName: `lr${i}_icon` });
    s.addText(it.name, {
      x: x + 0.10, y: cardY + 0.86, w: cw - 0.20, h: 0.56, color: C.dark, fontFace: F.title,
      fontSize: 13.5, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 16, objectName: `lr${i}_n`,
    });
    s.addText(it.note, {
      x: x + 0.10, y: cardY + 1.44, w: cw - 0.20, h: 0.70, color: C.inkSoft, fontFace: F.body,
      fontSize: 11, align: 'center', valign: 'top', margin: 0, lineSpacing: 14, objectName: `lr${i}_t`,
    });
  });
  s.addNotes(
    'I DO. 3 minutes. One click, the whole row at once.\n\n'
    + 'THIS SLIDE IS DELIBERATELY THIN. Name the five, spend about two minutes total, and say so: "you do not need to memorise this list, you need to understand the next two slides properly."\n\n'
    + 'FOOD IS THE ONE THEY ALREADY PARTLY KNOW, from last lesson\'s land clearing. Do not re-explain it, just point at it and move on.\n\n'
    + 'ENERGY IS A USEFUL FORESHADOW: coal formed over millions of years, from the Hook. Point back at it.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — what soil actually is
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'What soil actually is', 'light');

  const PARTS = [
    ['Broken rock', 'Ground down by weather, over a very long time.'],
    ['Dead organic matter', 'Broken down by decomposers into humus.'],
    ['Water and air', 'Held in the gaps between particles.'],
    ['Living organisms', 'Bacteria, fungi, worms, insects.'],
  ];
  const cw = (RIGHT - M - 0.30) / 2, ch = 1.02, gapX = 0.30, gapY = 0.16;
  PARTS.forEach(([n, note], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + gapX), y = BODY_Y + 0.10 + row * (ch + gapY);
    card(s, { x, y, w: cw, h: ch, name: `sp${i}` });
    s.addText(n, {
      x: x + 0.22, y: y + 0.12, w: cw - 0.44, h: 0.38, color: C.dark, fontFace: F.title,
      fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `sp${i}_n`,
    });
    s.addText(note, {
      x: x + 0.22, y: y + 0.50, w: cw - 0.44, h: 0.46, color: C.inkSoft, fontFace: F.body,
      fontSize: 12, valign: 'top', margin: 0, lineSpacing: 15, objectName: `sp${i}_t`,
    });
  });
  s.addText('Nearly every land food chain starts here. Producers grow in soil, and get their water and nutrients from it.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.50, w: RIGHT - M, h: 0.78,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 15, bold: true,
    align: 'center', valign: 'middle', margin: 0.15, objectName: 'soil_banner',
  });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: four parts, then the banner.\n\n'
    + '"SOIL IS NOT JUST DIRT" IS THE LINE TO SAY OUT LOUD. Most students think of it as crushed-up rock. The organic matter and living organisms are the part that usually gets missed.\n\n'
    + 'THE BANNER CONNECTS BACK TO "PRODUCER", from Do Now Q3 and Human Population Growth. This is where that definition actually happens, physically.\n\n'
    + 'THIS SLIDE IS THE FOUNDATION FOR OBJECTIVE 3. If soil is just broken rock, it is hard to see why it would take so long to form. Once dead organic matter and living organisms are in the picture, "it takes time to build up" makes more sense.'
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
    ['"Soil is just dirt. It does not really do anything."', 'Soil is rock, dead organic matter, water, air and living things. Nearly every land food chain starts in it.'],
    ['"If soil gets used up, more will form again soon."', 'Soil forms extremely slowly, often centuries to a millennium for a few centimetres.'],
    ['"Coal, soil and vegetables all form at about the same speed."', 'Very different timescales: coal takes millions of years, soil centuries to a millennium, a vegetable months.'],
    ['"Erosion is not a problem, because soil is renewable."', 'Soil can be lost far faster than it forms. That is exactly why it counts as non-renewable on a human timescale.'],
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
      fill: { color: 'ECE1CB' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS OBJECTIVE 2. ROWS 2-4 ARE ALL OBJECTIVE 3, from different angles. That is deliberate, per the brief: objective 3 gets more airtime than 1 and 2 combined.\n\n'
    + 'ROW 3 USES THE HOOK\'S OWN COMPARISON. Point back at the tally.\n\n'
    + 'ROW 4 IS THE MOST COMMON REAL-WORLD VERSION OF THE MISCONCEPTION. Ask a follow-up: "so what actually makes something count as non-renewable?" Answer: not whether it CAN reform, but whether it reforms fast enough to matter on a human timescale.'
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
    ['Name one main land resource, other than food.', 'Any real example: minerals, timber, building materials, energy.'],
    ['State the four things soil is made of.', 'Broken rock, dead organic matter, water and air, living organisms.'],
    ['State why soil matters for food chains.', 'Producers grow in it, and get water and nutrients from it.'],
    ['State roughly how long it takes to form a few centimetres of soil.', 'A few hundred to about a thousand years.'],
    ['State whether soil can be lost faster than it forms.', 'Yes, through erosion, especially on poorly managed farmland.'],
    ['State why soil counts as non-renewable on a human timescale.', 'It forms far slower than we use or erode it, even though it eventually reforms.'],
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
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 HAS SEVERAL RIGHT ANSWERS, same pattern as Human Population Growth\'s Cold Call Q3. Take two or three, do not just accept the first and move on.\n\n'
    + 'Q4-6 ARE OBJECTIVE 3, cold, in three different phrasings. This is the rehearsal for Gold on the worksheet.'
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
    fontSize: 24, bold: true, valign: 'middle', margin: 0, lineSpacing: 29, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const TIERS = [
    ['BRONZE', C.alert, 'F5E5DE', 'Identify it', 'Name the main land resources and what soil is made of.'],
    ['SILVER', '81715F', 'F0EBE0', 'Explain it', 'Explain what soil is, and how it can be lost faster than it forms.'],
    ['GOLD', C.accentInk, 'ECE1CB', 'Judge it', 'Judge a claim about soil, using formation and loss timescales.'],
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
  s.addText('Formation takes centuries. Loss can take years. That gap is the whole answer.', {
    x: M, y: BODY_Y + 2.76, w: RIGHT - M, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "how fast does that happen, compared to how fast we use it?"\n\n'
    + 'WHERE THEY WILL STALL: Gold Q9, judging the farmer\'s claim, rather than just repeating the definition. Last lesson flagged "judging a claim" as a stall point too, this is deliberately the same skill, applied again.\n\n'
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
    ['1', 'Any three: minerals, timber, building materials, energy.'],
    ['2', 'Coal, oil, or gas (fossil fuels).'],
    ['3', 'Broken rock, dead organic matter, water and air, living organisms.'],
    ['4', 'Producers grow in soil and get water and nutrients from it.'],
    ['5', 'It also has dead organic matter, water, air and living things, not just rock.'],
    ['6', 'Roughly a few hundred to about a thousand years.'],
    ['7', 'Erosion, especially wind and water on farmland, can strip it away in years.'],
    ['8', 'It forms far slower (centuries+) than we use or erode it (years). Lost soil will not return within a human lifetime.'],
    ['9', 'Misleading. Soil forms too slowly for eventual reform to matter on a human timescale.'],
    ['10', 'Food regrows in one season. Soil takes centuries. Treating them the same risks permanent loss.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 11,
      valign: 'middle', margin: 0, lineSpacing: 14, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q8, Q9 AND Q10 ARE THE REAL TEST OF TODAY. Take two or three student answers out loud for each rather than reading the model answer straight off the slide, the reasoning is the point, not the exact wording.\n\n'
    + 'Q9 IS THE LESSON\'S THESIS, restated as a judgement. If it is shaky, that is worth five minutes at the start of next lesson before anything new.'
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
    ['Soil is just broken-up rock.', 'FALSE'],
    ['Soil forms much slower than most crops grow.', 'TRUE'],
    ['Because soil eventually reforms, losing it quickly is not a problem.', 'FALSE'],
    ['Nearly every land food chain starts with a producer growing in soil.', 'TRUE'],
    ['Soil can be lost by erosion faster than it forms.', 'TRUE'],
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
  s.addText('Land can look endless. What it takes to remake some of it is not.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q3 IS THE AVOID POINT AND OBJECTIVE 3, asked directly. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q5 IS THE HONEST TEST of whether the formation-vs-loss comparison actually landed. Ask a follow-up: "so is soil renewable or not?" Answer: technically yes, practically no, on any timescale a person lives through.\n\n'
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

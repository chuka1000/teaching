/**
 * Y9 Science, Making It Last. Classes 9G and 9I — taught identically (TIMETABLE.md; confirmed by
 * Chuka 2026-09-24 and again 2026-09-28). One deck and worksheet serves both; only the taught
 * date differs.
 *
 * Single, 50 minutes. Topsoil palette, carried on from the unit.
 *
 * DATE: per Chuka's instruction this session ("it would be better if the date was always
 * formatted to be the current date"), this is the date the deck was BUILT on, not a guessed
 * future teaching day. Still change it if the actual lesson falls on a different date.
 *
 * PREVIOUS: reference/What The Earth Gives Us.pptx. Read it. It ended on "renewable or not is not
 * about the resource. It is about the rate" and made no explicit promise for the next lesson, but
 * objective 3 there ("the difference is about rate") is exactly what this lesson acts on: now
 * that the class can tell whether a resource is being used faster than it renews, this lesson is
 * what people actually DO about that. Vocabulary already taught: natural resource (from the
 * Earth, not made by people), renewable, non-renewable, "cut no faster than it regrows" (the
 * running forest example), the Grand Banks cod collapse (1962 1.6 million tonnes to 1992 about
 * 110,000 tonnes), aquifers.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, Sustainable Yield ("your call"), with the
 * worksheet as the fallback, built every time.
 *
 * FACTS, checked with a web search: the Western South Atlantic humpback whale population fell to
 * about 450 by the 1950s and has recovered to about 25,000 today, roughly 93% of its pre-whaling
 * level, after the 1986 international whaling moratorium (ScienceNews, reporting a Royal Society
 * Open Science study). This is a deliberate contrast with the cod collapse from the previous
 * lesson: cod were not protected in time and still have not recovered; whales were, and have.
 * Every number is checked in build/making-it-last-check.py.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Saturday 3 October 2026';
const LESSON = 'Making It Last';
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
    line: { color: o.line || 'D9C9A8', width: o.lineWidth || 1.3 },
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
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true,
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
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, qs: [
    ['A forest is cut down no faster than it regrows. State whether it is renewable.', 'Yes. Renewable, because it is not used faster than it replaces itself.'],
    ['State roughly what happened to the number of cod off Newfoundland between 1962 and 1992.', 'It collapsed, falling by about 93%.'],
    ['A fish stock of 500,000 tonnes falls to 50,000 tonnes. Calculate the percentage decrease.', '90%. (500,000 − 50,000) ÷ 500,000 × 100.'],
    ['State why soil counts as non-renewable, even though new soil can form.', 'It forms far slower than it is used or lost.'],
    ['Name one thing you, or your family, do to make a resource last longer.', 'Any reasonable answer: recycling, turning off taps, using less.'],
    ['A fishing boat catches fewer fish each year than the stock can replace. Predict what happens to the fish stock over time.', 'It stays the same size, or grows.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ reference/What The Earth Gives Us.pptx (the stated PREVIOUS lesson). Q1, Q2 and Q4 retrieve it directly; Q2 reuses the cod figure as plain retrieval, which is fine two lessons on, it is a dramatic fact worth keeping live.\n\n'
    + 'Q3 IS THE ONE CALCULATION, fresh numbers, not the previous lesson\'s own worksheet figures. Watch for 10% (dividing the wrong way).\n\n'
    + 'Q5 AND Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. Q5 primes conservation from the student\'s own experience. Q6 primes the whole of objective 2 in a sentence, before the term "sustainable" is used.\n\n'
    + 'THEY FOUND HARD: not stated in the brief. Nothing guessed.\n\n'
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
  const GOALS = ['Explain what conservation means.', 'Explain what taking a sustainable amount means.', 'Describe two ways a resource is managed in practice.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Making a resource last means taking ', false], ['no more than it can replace', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The last lesson ended on "renewable or not is about the rate". Today is the other half: now you can tell whether a resource is being used too fast, what do people actually DO about it? Say "last lesson told you how to spot the problem. Today is the fix."\n\n'
    + 'OBJECTIVE 2 IS WHY THIS LESSON EXISTS. Objective 1 gives the general idea (conservation); objective 3 gives real examples (management in practice); objective 2, the sustainable amount, is the number underneath both of them.\n\n'
    + 'THE BANNER IS OBJECTIVE 2, SAID PLAINLY, and it is also the previous lesson\'s rate idea turned into an instruction rather than a description.'
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
  s.addText('By the 1950s, about 450 humpback whales were left off the coast of Brazil. Hunting them was banned in 1986. About how many are there today?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('whale', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_whale' });
  const OPTS = [
    ['A', 'About 2,000'],
    ['B', 'About 25,000'],
    ['C', 'About 100,000'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.00, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.10, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'top', margin: 0, lineSpacing: 23, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and tally on the board. Do not settle it: I Do 1 does.\n\n'
    + 'ANSWER, FOR YOU: B. About 25,000, roughly 93% of the population\'s size before whaling began. Ten of the fourteen known humpback populations worldwide have recovered since the 1986 international ban on commercial whaling. Expect A to attract a lot of votes: after a 93% collapse, most students will assume a species stays rare.\n\n'
    + 'THE DELIBERATE CONTRAST: last lesson\'s cod fell by about 93% and, thirty years on, still have not recovered. This whale population also fell hard, and then recovered, because hunting was banned in time and the stock was given the chance to regrow. Say that contrast directly: same size of collapse, different outcome.\n\n'
    + 'DO NOT EXPLAIN WHY YET. Say "something was done differently here. That is today\'s lesson" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — conservation
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Conservation', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'Conservation means protecting and managing a resource carefully, so it is ', options: {} },
    { text: 'still available in the future', options: { bold: true, color: C.accentInk } },
    { text: '.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 16.5, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'def_t' });
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'wh' });
  s.addImage({ path: ICON('whale', 'accentInk'), x: M + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'wh_icon' });
  s.addText('WHAT WORKED FOR THE WHALES', { x: M + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'wh_h' });
  s.addText('Hunting was banned, internationally, before the population hit zero. With nothing taking whales out, the population could grow back on its own.', { x: M + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'wh_t' });
  const rx = M + rw + 0.30;
  card(s, { x: rx, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'co' });
  s.addImage({ path: ICON('fish', 'accentInk'), x: rx + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'co_icon' });
  s.addText('WHAT DID NOT HAPPEN FOR COD', { x: rx + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'co_h' });
  s.addText('Fishing was not limited early enough. By the time it stopped completely, in 1992, there was very little stock left to regrow from.', { x: rx + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'co_t' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the definition, the whale card, the cod card.\n\n'
    + 'OBJECTIVE 1, SETTLED WITH THE HOOK. Conservation is not one single action; it is the general idea of managing use so a resource survives. A hunting ban is one form of it.\n\n'
    + 'THE CONTRAST CARDS ARE THE POINT OF THE SLIDE. Same starting problem (a population crashing from overuse), different timing of the response. Say it plainly: conservation works when it happens before the stock is gone, not after.\n\n'
    + 'IF ASKED WHY COD STILL HAS NOT RECOVERED EVEN WITH NO FISHING SINCE 1992: a population that has fallen this far recovers slowly even once protected, because there are so few breeding adults left. This is worth a sentence, not a detour.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — a sustainable amount
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Taking a sustainable amount', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'sdef' });
  s.addText([
    { text: 'A sustainable amount is ', options: {} },
    { text: 'no more than the resource can naturally replace', options: { bold: true, color: C.accentInk } },
    { text: '. The stock does not shrink.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'sdef_t' });
  card(s, { x: M, y: BODY_Y + 1.24, w: CW, h: 1.80, name: 'calc' });
  s.addText('A WORKED EXAMPLE', { x: M + 0.26, y: BODY_Y + 1.40, w: CW - 0.52, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'calc_h' });
  s.addText([
    { text: 'A fish stock of 200,000 tonnes grows by 10% a year.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'Maximum sustainable catch: 200,000 × 10 ÷ 100 = 20,000 tonnes a year.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6, bold: true } },
    { text: 'Catch exactly that much, and the stock stays 200,000 tonnes, year after year.', options: { bullet: true } },
  ], { x: M + 0.26, y: BODY_Y + 1.80, w: CW - 0.52, h: 1.15, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'calc_t' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the definition, then the worked example.\n\n'
    + 'OBJECTIVE 2, THE NUMBER UNDER EVERYTHING TODAY. This is the previous lesson\'s "cut no faster than it regrows" forest example, turned into an actual calculation.\n\n'
    + 'THE CALCULATION IS STOCK × GROWTH RATE. It is the same method as a function-machine rule and a density calculation: identify the two numbers, multiply, done. Say it slowly once: "ten per cent of two hundred thousand is twenty thousand".\n\n'
    + 'THE LAST LINE IS THE KEY IDEA: catch exactly the sustainable amount, and the stock does not shrink OR grow, it stays the same, indefinitely. Catch less, and it grows (this lesson\'s Do Now Q6). Catch more, and it shrinks (last lesson\'s whole point).'
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
    ['"Conservation means never using a resource at all."', 'Conservation means using it carefully, so it lasts, not avoiding it completely.'],
    ['"A forest cut at exactly its regrowth rate is not sustainable, because trees are still being cut down."', 'It is sustainable. The forest stays the same size, year after year.'],
    ['"Recycling is not resource management, because it does not stop a resource running out."', 'Recycling IS management. It cuts how much new, often non-renewable, material is needed.'],
    ['"Once a resource has collapsed, like cod, conservation can never help."', 'Conservation can allow recovery, as whale numbers show. It can just take decades.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.60, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 6.10, y: y + 0.09, w: RIGHT - (M + 6.10) - 0.10, h: 0.74, fill: { color: 'ECE1CB' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first, then click.\n\n'
    + 'ROW 1 IS OBJECTIVE 1, THE COMMONEST MISREADING OF THE WORD. Conservation is about rate, exactly like last lesson: using something AT a sustainable rate, not refusing to use it.\n\n'
    + 'ROW 2 IS OBJECTIVE 2, THE EXACT EXAMPLE FROM I DO 2, restated as a misconception. Push on this one: "sustainable" does not mean "nothing happens", it means "the stock does not shrink".\n\n'
    + 'ROW 3 IS OBJECTIVE 3, recycling named as a real management method, directly setting up Cold Call Q4.\n\n'
    + 'ROW 4 IS THE HOOK, THE WHOLE LESSON\'S MESSAGE. Be honest about the "decades" part: this is not a quick fix, which is exactly why acting early (objective 1) matters so much.'
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
    ['State what conservation means.', 'Protecting and managing a resource carefully, so it is still available in future.'],
    ['State what it means to take a sustainable amount of a resource.', 'No more than the resource can naturally replace.'],
    ['A fish stock of 300,000 tonnes grows by 8% a year. Calculate the maximum sustainable catch.', '24,000 tonnes. 300,000 × 8 ÷ 100.'],
    ['Name two ways a resource can be managed in practice.', 'Any two: limits or bans on how much is taken, replanting, recycling.'],
    ['Explain why cutting a forest at exactly its regrowth rate counts as sustainable.', 'The amount of forest stays the same. Nothing is lost overall.'],
    ['The humpback whale population recovered after hunting was banned in 1986. State what this shows about conservation.', 'Protecting a resource early enough can let it recover, even after a severe collapse.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVES 1 AND 2, COLD. Both need the reasoning, not just the word repeated.\n\n'
    + 'Q3 IS THE CALCULATION, FRESH NUMBERS. Watch for the formula flip (dividing instead of multiplying), the same slip this class met in Density.\n\n'
    + 'Q4 IS OBJECTIVE 3 DIRECTLY. There are several right answers; take two or three if time allows.\n\n'
    + 'Q5 AND Q6 CLOSE THE LOOP on I Do 2 and the Hook. If most of the room is right by Q4, spend longer here. IF SHORT OF TIME, cut Q1.'
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
    ['ROUND 1', C.alert, 'F3E0DB', 'Find the sustainable amount', 'Stock size and growth rate. Calculate the maximum that can be taken.'],
    ['ROUND 2', C.support, 'E2EEE8', 'Grows, shrinks, or stays the same?', 'Stock, growth rate, and what was actually taken. Work out what happens next.'],
    ['ROUND 3', C.accentInk, 'ECE1CB', 'Harder management', 'Very hard. The last two questions are meant to be almost impossible.'],
  ];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  ROUNDS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.10, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 1.00, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 2.86, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS SUSTAINABLE YIELD ("your call"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Making It Last game" from Google Classroom. Three rounds of six questions, each on their own device, all multiple choice. EVERY STUDENT GETS A DIFFERENT GAME: different stocks, growth rates and catches, in a different order. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 is the calculation from I Do 2: stock times growth rate. Round 2 adds what was actually taken, and asks whether the stock grows, shrinks, or stays the same, a direct extension of objective 2. Round 3 is harder numbers and management-method reasoning, and the last two questions (17 and 18) are drawn from a small pool: a multi-year "years until the stock is gone" calculation, and a scenario that needs the right MANAGEMENT METHOD chosen, not a number at all. Expect most students to fail those two. That is the design; tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is more being taken than the stock can replace?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['Conservation means never using a resource.', 'FALSE'],
    ['Taking a sustainable amount means taking no more than the resource can replace.', 'TRUE'],
    ['Recycling is a form of resource management.', 'TRUE'],
    ['A forest cut at exactly its regrowth rate is not sustainable.', 'FALSE'],
    ['Once a resource has collapsed, conservation can never help it recover.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Making it last means taking no more than a resource can replace.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS THE MISCONCEPTION AND OBJECTIVE 1 DIRECTLY. Q2 IS OBJECTIVE 2, PLAINLY TRUE.\n\n'
    + 'Q3 IS OBJECTIVE 3, ONE NAMED METHOD CONFIRMED. Q4 SETTLES I DO 2 ONE LAST TIME: cutting at the regrowth rate IS sustainable.\n\n'
    + 'Q5 IS THE HOOK, SETTLED. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER, on purpose. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

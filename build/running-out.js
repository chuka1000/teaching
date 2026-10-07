/**
 * Y9 Science, Running Out. Classes 9G and 9I — taught identically (TIMETABLE.md; confirmed by
 * Chuka 2026-09-24 and again 2026-09-28). One deck and worksheet serves both; only the taught
 * date differs.
 *
 * Single, 50 minutes. Topsoil palette, carried on from the unit.
 *
 * DATE: the date the deck was BUILT on (see the standing instruction in build/making-it-last.js
 * and the memory it created), not a guessed future teaching day. Still change it if the actual
 * lesson falls on a different date.
 *
 * PREVIOUS: reference/Making It Last.pptx. Read it. It ended on "making it last means taking no
 * more than a resource can replace" and made no explicit promise for the next lesson. Today picks
 * up the "stock shrinks" outcome from I Do 2 there and follows it to its endpoint: keep taking more
 * than a resource can replace, and eventually it is not just smaller, it is gone. Vocabulary
 * already taught: conservation, sustainable amount / sustainable yield (stock x growth rate),
 * renewable / non-renewable, the humpback whale recovery, the Grand Banks cod collapse (1962 1.6
 * million tonnes to 1992 about 110,000 tonnes, still not recovered).
 *
 * CHUKA ASKED FOR THE WE DO TO CHANGE from the standard "spot the mistake" format ("change the
 * spot the mistake activity to something potentially more enriching"). This is a deliberate,
 * one-off deviation from CLAUDE.md's fixed We Do shape, for this lesson. It is now four real,
 * verified case studies ("What really happened?") instead of four invented wrong statements,
 * which also gives objective 3 ("what happens when a resource runs low") real, specific content
 * instead of a vague "we should use less" (the brief's own AVOID note). Worth asking Chuka whether
 * this should become the new standard We Do shape, or stay a one-off for this lesson.
 *
 * SHAPE. Nine slides, 50 minutes: Do Now 10, Objectives 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold
 * Call 6, You Do 17, Plenary 3. The You Do is a game, Running Out ("your call"), with the
 * worksheet as the fallback, built every time.
 *
 * FACTS, checked with a web search (build/running-out-check.py):
 * - Passenger pigeons: 3-5 billion in North America before mass hunting, the most common bird on
 *   the continent; extinct by 1 September 1914 (Martha, Cincinnati Zoo). thecollector.com,
 *   scientificamerican.com, cincinnatizoo.org.
 * - Helium: non-renewable (forms by radioactive decay far slower than it is extracted); a sustained
 *   global shortage has pushed prices up sharply, and many hospitals now ration liquid helium for
 *   MRI scanners over party balloons. rockymountainair.com, greenmatters.com.
 * - The Aral Sea lost over 90% of its volume after rivers that fed it were diverted for irrigation
 *   from the 1960s; commercial fishing ended completely by 1982 and thousands of fishing jobs were
 *   lost. thenationalnews.com, nomadicbackpacker.com.
 * - Atlantic bluefin tuna stocks fell by about 60% between 1997 and 2007 from overfishing; strict
 *   international (ICCAT) quotas followed, and a single large tuna sold for a record $3.2 million
 *   at Tokyo's Toyosu market in January 2026. cnn.com, nbcnews.com.
 * - American bison numbered 60-70 million in 1853 and were reduced to a few hundred by 1889;
 *   Indigenous Plains nations, who had depended on bison for food, tools and shelter, lost their
 *   primary resource. ebsco.com, smea.uw.edu.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Saturday 3 October 2026';
const LESSON = 'Running Out';
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
    ['A forest of 70,000 hectares grows by 4% a year. Calculate the maximum sustainable amount that can be cut each year.', '2,800 hectares. 70,000 × 4 ÷ 100.'],
    ['A fish stock is caught at exactly its sustainable yield for ten years. State what happens to the size of the stock.', 'Nothing. It stays the same size, every year.'],
    ['A resource store of 90,000 tonnes loses a third of what remains every 5 years. Calculate how much is left after 10 years.', '40,000 tonnes. 90,000 → 60,000 → 40,000.'],
    ['Helium forms underground far slower than we extract and use it today. State whether it is renewable or non-renewable.', 'Non-renewable. It forms far slower than it is used.'],
    ['Name two ways a resource can be managed to stop it running out.', 'Any two: a catch limit or quota, a closed season, restocking, recycling, replanting.'],
    ['If a resource like oil became very scarce, suggest what might happen to its price.', 'Any reasonable answer: the price would rise.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks.\n\n'
    + 'I READ reference/Making It Last.pptx (the stated PREVIOUS lesson). Q1 and Q2 retrieve its central skill and key idea, with fresh numbers and a new scenario, not a repeat of its own Do Now or worksheet figures. Q5 retrieves its objective 3 in a new shape.\n\n'
    + 'Q3 IS A NEW SKILL: repeated fractional decline, not simple percentage decrease (already used twice in this unit). It is today\'s main calculation and comes back in Cold Call Q3 and the game.\n\n'
    + 'Q4 IS A CROSS-SCIENCE LINK (chemistry/geology): helium, classified with the renewable/non-renewable skill from What The Earth Gives Us, on fresh content. IT IS RESOLVED LATER, in We Do row 1, with the real consequence of the shortage.\n\n'
    + 'Q6 IS INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. It primes objective 3\'s real content (prices rising) before We Do makes it concrete.\n\n'
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
  const GOALS = ['Describe what resource depletion is.', 'Explain how a renewable resource can still be depleted.', 'Describe what happens when a resource runs low.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Resource depletion means using a resource ', false], ['faster than it can be replaced', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Last lesson ended on taking no more than a resource can replace. Today follows the OTHER outcome to its end: what happens if that is not done. Say "last lesson was how to make it last. Today is what happens if nobody does."\n\n'
    + 'OBJECTIVE 2 IS THE HARD PART, AND THE REASON THIS LESSON EXISTS. Most students will assume "renewable" means "cannot run out." It can, if used too fast for too long. Objective 1 is the general idea; objective 3 is what actually happens, in practice, when it does.\n\n'
    + 'THE BANNER IS OBJECTIVE 1, SAID PLAINLY, and it is the exact mirror of last lesson\'s banner.'
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
  s.addText('By the 1870s, a single flock of passenger pigeons was estimated at over 3 billion birds, the most common bird in North America. By 1914, how many were left in the world?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('dove', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_dove' });
  const OPTS = [
    ['A', 'About 1 million'],
    ['B', 'About 1,000'],
    ['C', 'Zero'],
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
    + 'ANSWER, FOR YOU: C. Zero. The passenger pigeon is extinct. The last known one, a female named Martha, died at the Cincinnati Zoo on 1 September 1914. Expect A to attract most votes: "billions" feels impossible to fully use up.\n\n'
    + 'THE POINT: this was a RENEWABLE resource, a species that could breed. It was not mined or drilled. It still ran out completely, because it was used faster than it could replace itself, for decades, without stopping.\n\n'
    + 'DO NOT EXPLAIN WHY YET. Say "a species that bred by the billion is completely gone. That is today\'s lesson" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — resource depletion
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Resource depletion', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'def' });
  s.addText([
    { text: 'Resource depletion means using up a resource faster than it can be replaced, until ', options: {} },
    { text: 'not enough is left to use as before', options: { bold: true, color: C.accentInk } },
    { text: '.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, lineSpacing: 20, objectName: 'def_t' });
  const rw = (CW - 0.30) / 2;
  card(s, { x: M, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'bel' });
  s.addImage({ path: ICON('dove', 'accentInk'), x: M + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'bel_icon' });
  s.addText('WHAT PEOPLE BELIEVED', { x: M + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'bel_h' });
  s.addText('There were so many pigeons that hunters assumed the species could never run out, no matter how many were shot.', { x: M + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'bel_t' });
  const rx = M + rw + 0.30;
  card(s, { x: rx, y: BODY_Y + 1.24, w: rw, h: 1.80, name: 'hap' });
  s.addImage({ path: ICON('dove', 'alert'), x: rx + rw - 0.62, y: BODY_Y + 1.40, w: 0.42, h: 0.42, objectName: 'hap_icon' });
  s.addText('WHAT ACTUALLY HAPPENED', { x: rx + 0.24, y: BODY_Y + 1.40, w: rw - 0.90, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'hap_h' });
  s.addText('Hunting never slowed down. As the flocks shrank, pigeons could not find each other to breed in the huge colonies they needed. The last one died in 1914.', { x: rx + 0.24, y: BODY_Y + 1.80, w: rw - 0.48, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'hap_t' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the definition, the belief card, the what-actually-happened card.\n\n'
    + 'OBJECTIVE 1, SETTLED WITH THE HOOK. Depletion is not one event; it is use outrunning replacement for long enough that the amount left stops being enough.\n\n'
    + 'THE CONTRAST CARDS ARE THE POINT OF THE SLIDE. "There are billions of them" felt like a reason it was safe. It was not a reason at all: a huge number falling faster than it can regrow still reaches zero, it just takes longer.\n\n'
    + 'THIS SETS UP I DO 2. The mechanism (why the colony could not recover before it hit zero) is next.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — how a renewable resource is depleted
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'How a renewable resource is depleted', 'light');
  card(s, { x: M, y: BODY_Y, w: CW, h: 1.00, name: 'mdef' });
  s.addText([
    { text: 'A renewable resource can still run out. Used faster than it replaces itself, for long enough, ', options: {} },
    { text: 'there are eventually too few left to recover', options: { bold: true, color: C.accentInk } },
    { text: '.', options: {} },
  ], { x: M + 0.30, y: BODY_Y, w: CW - 0.60, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, valign: 'middle', margin: 0, lineSpacing: 19, objectName: 'mdef_t' });
  card(s, { x: M, y: BODY_Y + 1.24, w: CW, h: 2.05, name: 'mech' });
  s.addText('THE PASSENGER PIGEON, AGAIN', { x: M + 0.26, y: BODY_Y + 1.40, w: CW - 0.52, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mech_h' });
  s.addText([
    { text: 'Passenger pigeons bred in enormous colonies. The size of the colony itself kept them safe from predators and helped them find mates.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'As hunting shrank the flocks, colonies became too small and scattered.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'By the time hunting mattered less, there were too few birds left, in groups too small, to breed successfully. The species could have renewed itself forever. It was not given the chance.', options: { bullet: true, bold: true } },
  ], { x: M + 0.26, y: BODY_Y + 1.78, w: CW - 0.52, h: 1.43, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16, objectName: 'mech_t' });
  s.addNotes(
    'I DO. 3 minutes. Two clicks: the definition, then the mechanism.\n\n'
    + 'OBJECTIVE 2, THE WHOLE POINT OF THE LESSON. "Renewable" describes the resource. Whether it actually gets the chance to renew depends on how fast it is used, exactly last lesson\'s rate idea, carried to its limit.\n\n'
    + 'THE THIRD BULLET IS THE KEY LINE. Say it twice if the room is quiet: the species COULD have carried on forever. What ended it was never being given the chance to recover, not some limit on how many pigeons could ever exist.\n\n'
    + 'THIS IS THE SAME SHAPE AS LAST LESSON\'S "STOCK SHRINKS" OUTCOME, taken all the way to zero. A resource that is merely shrinking can still recover, like the whales. One that has fallen too far, with too few left to find each other, cannot.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — "What really happened?" (changed from Spot The Mistake, by request)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What really happened?', 'light');
  sub(s, 'Four resources, pushed too far.', 'light');
  const ROWS = [
    ['balloon', 'Helium is non-renewable, and global demand has outpaced supply for years.', 'Prices rose sharply. Many hospitals now ration helium, keeping it for MRI scanners instead of party balloons.'],
    ['desert', "Rivers feeding Central Asia's Aral Sea were diverted for irrigation, starting in the 1960s.", 'The sea lost over 90% of its volume. Commercial fishing ended completely, and thousands of workers lost their jobs.'],
    ['fish', 'Atlantic bluefin tuna were fished far faster than they could breed, for decades.', 'Strict international quotas were introduced. A single large tuna can now sell for millions of dollars at auction.'],
    ['bison', 'American bison numbered tens of millions in the 1850s. By 1889, only a few hundred remained.', 'Indigenous Plains nations, who had depended on bison for food and survival, lost their main resource almost overnight.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([icon, caseTxt, real], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: RIGHT - M, h: rowH, name: `wd${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: M + 0.20, y: y + rowH / 2 - 0.27, w: 0.54, h: 0.54, objectName: `wd${i}_icon` });
    s.addText(caseTxt, { x: M + 0.90, y, w: 4.80, h: rowH, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `wd${i}_q` });
    s.addText(real, {
      shape: S.roundRect, rectRadius: 0.10, x: M + 5.90, y: y + 0.08, w: RIGHT - (M + 5.90) - 0.10, h: rowH - 0.16, fill: { color: 'ECE1CB' }, line: { color: C.accentInk, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 12, bold: true, align: 'left', valign: 'middle', margin: 0.08, lineSpacing: 15, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take guesses from the room first, then click.\n\n'
    + 'CHANGED FROM SPOT THE MISTAKE, AT CHUKA\'S REQUEST: four REAL, verified cases instead of invented wrong statements. Each is a resource used faster than it could be replaced, and what REALLY happened as a result, not a guessed or softened version.\n\n'
    + 'ROW 1 RESOLVES DO NOW Q4. Say "you already worked out helium is non-renewable. Here is what that is actually doing to hospitals right now."\n\n'
    + 'ROW 2 IS A RENEWABLE RESOURCE (water), extracted faster than it was replaced: the same mechanism as objective 2, applied to a place, not a species. 10,000 people lost their jobs when the fishing fleet had nothing left to catch.\n\n'
    + 'ROW 3 AND 4 ARE BOTH SPECIES, LIKE THE HOOK, but caught in time rather than lost completely: bluefin tuna populations have since partly recovered under the quotas, which is worth a sentence if time allows, since it previews that recovery is possible even after a severe fall, as it was for the whales.\n\n'
    + 'EVERY ROW HAS A DIFFERENT KIND OF REAL CONSEQUENCE: a price rising, an industry and its jobs disappearing, international regulation, and a community losing what it depended on. This is what Cold Call Q4 and the Plenary draw on, directly, not a vague "we should use less".'
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
    ['State what resource depletion means.', 'Using up a resource faster than it can be replaced, until not enough is left to use as before.'],
    ['Explain how a resource that can renew itself, like a fish stock, can still run out completely.', 'Used faster than it replaces itself for long enough, there are eventually too few left to recover.'],
    ['A resource store of 160,000 tonnes loses half of what remains every year. Calculate how much is left after 3 years.', '20,000 tonnes. 160,000 halved three times.'],
    ['Name one real consequence when a resource runs very low, from today\'s examples.', 'Any one: prices rise, an industry collapses, strict quotas are introduced, a community loses its main resource.'],
    ['Explain why passenger pigeons went extinct, even though billions once existed.', 'Hunted faster than they could breed for decades, until flocks were too small and scattered to recover.'],
    ['State one thing that could have been done differently to stop passenger pigeons going extinct.', 'Any reasonable answer: limiting hunting, or protecting colonies, before numbers fell too low.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Students have no mini whiteboards, so answers are spoken.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVES 1 AND 2, COLD. Both need the reasoning, not just the word repeated.\n\n'
    + 'Q3 IS THE CALCULATION, FRESH NUMBERS, the same repeated-decline skill as Do Now Q3 and the game\'s round 1. Watch for halving only once, or halving four times instead of three.\n\n'
    + 'Q4 IS OBJECTIVE 3 DIRECTLY, drawing on We Do. There are four right answers; take two or three if time allows.\n\n'
    + 'Q5 AND Q6 CLOSE THE LOOP on the Hook and I Do. Q6 is deliberately forward-looking: do not let the lesson end on "and then they all died". IF SHORT OF TIME, cut Q1.'
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
    ['ROUND 1', C.alert, 'F3E0DB', 'How much is left?', 'A resource store, and how much it loses each period. Calculate what remains.'],
    ['ROUND 2', C.support, 'E2EEE8', 'Being depleted, or sustainable?', 'Stock, growth rate, and what was actually taken. Decide what is happening to it.'],
    ['ROUND 3', C.accentInk, 'ECE1CB', 'Real cases', 'Very hard. The last two questions are meant to be almost impossible.'],
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
    'YOU DO. 17 minutes: the standard 14 and the 3 that used to be the Answers slide. Four clicks. THE GAME IS RUNNING OUT ("your call"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Running Out game" from Google Classroom. Three rounds of six questions, each on their own device, all multiple choice. EVERY STUDENT GETS A DIFFERENT GAME. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE. Round 1 is today\'s new calculation: a resource store, and a fraction lost each period, repeated. Round 2 is last lesson\'s sustainable-yield classification, reframed around depletion. Round 3 mixes two question types: matching a real case (helium, the Aral Sea, bluefin tuna, bison) to what REALLY happened, and choosing the right management method to prevent depletion. The last two questions (17 and 18) are drawn from a small pool: a harder, four-period decline calculation, and one more management scenario. Expect most students to fail those two. That is the design; tell them before they start.\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down for every round with how long each question took and, for a wrong one, what the student wrote and how to get to the answer. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: ten questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is more being taken than the resource can replace?" AT 3 MINUTES REMAINING, stop them. There is no Answers slide.'
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
    ['Resource depletion means using a resource up faster than it can be replaced.', 'TRUE'],
    ['A resource that is renewable can never be depleted.', 'FALSE'],
    ['When a resource becomes very scarce, its price usually falls.', 'FALSE'],
    ['A quota or catch limit can help stop a resource being depleted.', 'TRUE'],
    ['Passenger pigeons went extinct, even though billions once existed.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Resource depletion means using a resource faster than it can be replaced.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE. Q2 IS THE MAIN MISCONCEPTION AND OBJECTIVE 2 DIRECTLY: a resource being renewable is not a guarantee against running out.\n\n'
    + 'Q3 IS OBJECTIVE 3\'S ECONOMICS, FLIPPED: students who were right in Do Now Q6 should catch this is false immediately. Q4 IS OBJECTIVE 3, A REAL MANAGEMENT RESPONSE CONFIRMED, not a vague "use less".\n\n'
    + 'Q5 IS THE HOOK, SETTLED one last time.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER, on purpose. BY THIS POINT OBJECTIVE 3 HAS ALREADY HAD REAL, SPECIFIC CONTENT (We Do\'s four cases, Cold Call Q4, Q4 here): the lesson does not end on damage alone, it ends on the plain rule that explains all of it. THIS LESSON MAKES NO PROMISE FOR THE NEXT ONE.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

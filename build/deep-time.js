/**
 * Y8 Science, Natural Selection, Lesson 9: Deep Time. Class 8I. Single, 50 minutes. Galapagos palette, carried on from the unit.
 *
 * DATE: Friday 9 October 2026 ("this Friday" in the brief, built on Wednesday 7 October 2026).
 *
 * PREVIOUS, per the brief: reference/The Greatest Show On Earth.pptx (Chuka's taught copy). 50 minutes, ten slides. It taught species,
 * speciation and geographic isolation (new words: speciation, isolation), with the finches, the Kaibab squirrels and the Panama shrimp. Its plenary's
 * closing line ("Natural selection, isolation and time: that is how one species becomes many") made no promise for this lesson. The lesson is
 * numbered 9 because the manifest records The Greatest Show On Earth as Lesson 8. FLAGGED: the number 9 is inferred, not written down.
 *
 * THEY FOUND HARD (brief): gene flow. It comes back in a NEW SHAPE in the Do Now (Q2: mice that swim to an island every year will not become a new
 * species, because gene flow keeps the gene pools alike), in the Cold Call (Q5: how a barrier stops gene flow) and in the worksheet (Silver 9).
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes. I Do 1 teaches objectives 1 and 2 together (the time scale, and placing an event on it is the worked
 * example of ordering); I Do 2 teaches objective 3 (mass extinction). The We Do is SPOT THE MISTAKE (TEMPLATE.md's pool; the last lesson's was
 * Finish It Off). The You Do is the GAME (Number line, as the brief says), with the worksheet as the fallback.
 *
 * TEMPLATE.md rules from Chuka's edits of the last lesson: numeric Do Now answers as "4,600 × 12 ÷ 100 = 552 million years" with no full stop; the
 * preview question (Q6) says "Suggest" and has the shaded card.
 *
 * FACTS: every date is in build/deep-time.data.json with its source, and every number is checked in build/deep-time-check.py. The Precambrian is
 * strictly a supereon; the brief asks for it as the first era, as KS3 teaches it, and the notes say so.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('galapagos');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const DATA = require('./deep-time.data.json');

const DATE = 'Friday 9 October 2026';
const LESSON = 'Deep Time';
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
pptx.subject = 'Y8 Science · Natural Selection · Lesson 9 · 8I';

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
// The Do Now's preview question (answered for the first time later in the lesson) has its card and answer box swapped (TEMPLATE.md).
const PREVIEW_CARD = 'F3E7CB', PREVIEW_LINE = 'A86E32';
function qGrid(s, o) {
  const cw = (RIGHT - M - 0.30) / 2;
  o.qs.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = o.y0 + row * (o.ch + o.gap);
    const pv = i === o.preview;
    card(s, pv ? { x, y, w: cw, h: o.ch, fill: PREVIEW_CARD, line: PREVIEW_LINE, name: `${o.p}${i}` } : { x, y, w: cw, h: o.ch, name: `${o.p}${i}` });
    const qy = y + 0.14, cy = qy + o.qh / 2;
    s.addShape(S.ellipse, { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `${o.p}${i}_badge` });
    s.addText(String(i + 1), { x: x + 0.22, y: cy - 0.21, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.p}${i}_num` });
    s.addText(q, { x: x + 0.80, y: qy, w: cw - 1.02, h: o.qh, color: C.ink, fontFace: F.body, fontSize: o.size, valign: 'middle', margin: 0, lineSpacing: o.size + 4, objectName: `${o.p}${i}_q` });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + o.ch - 0.64, w: cw - 0.44, h: 0.50, fill: { color: pv ? 'FFFFFF' : ANS }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: o.asize ?? 12.5, bold: true, align: 'left', valign: 'middle', margin: 6, objectName: `${o.p}${i}_a`,
    });
  });
}
const video = (s, file, x, y, w, h, name) => s.addMedia({
  type: 'video', path: MEDIA(`${file}.mp4`), cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA(`${file}.png`)).toString('base64'), x, y, w, h, objectName: name,
});
const EV = (k) => DATA.events[k][1];


/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 10, 'light')); pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, { x: 2.90, y: 0.22, w: 7.50, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title' });
  s.addText(DATE, { x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addShape(S.rect, { x: M, y: 0.98, w: RIGHT - M, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule' });
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, asize: 12, preview: 5, qs: [
    ['Define a species.', 'A group of living things that can breed together and produce fertile offspring.'],
    ['Mice swim to an island every year and breed there. Explain why the island mice will not become a new species.', 'Gene flow: alleles keep moving between the groups, so their gene pools stay alike.'],
    ['Name the four things natural selection needs.', 'Variation, competition, survival and inheritance.'],
    ['A fish fossil is 30 m down a cliff and a fern fossil is 5 m down. State which is probably older, and why.', 'The fish: deeper layers were laid down first, so they are older.'],
    ['Earth is 4,600 million years old. Calculate 12% of that.', '4,600 × 12 ÷ 100 = 552 million years'],
    ['Suggest why no human ever saw a living T. rex.', 'T. rex died out about 66 million years ago, long before the first humans. We see the gap today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/The Greatest Show On Earth.pptx (your taught copy) and checked every question against the last three Do Nows in the class (The Greatest Show On Earth, Shuffling The Gene Pool, Small Changes Big Changes). Nothing repeats: last time gene flow was "name the force"; here it is applied.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (the definition of a species; why gene flow stops speciation). Q3 and Q4 are EARLIER IN THE UNIT: Q3 is Lesson 1 (the four things natural selection needs), Q4 is Lesson 4 (fossils in rock layers), and it sets up today: deeper is older. Q5 is maths (a percentage). Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q2 IS THE ONE THEY FOUND HARD, GENE FLOW, IN A NEW SHAPE. The mice keep arriving and breeding, so alleles keep moving between the mainland and the island. The two gene pools stay alike, and the groups never become different enough to stop interbreeding. If anyone says "the sea is a barrier", agree, and ask "does it stop the mice?". Speciation needs gene flow to STOP.\n\n'
    + 'Q1: a group that can breed together and produce FERTILE offspring (insist on fertile). Q3: variation, competition, survival, inheritance. Q4: the fish, because the layers lower down were laid down first (as long as the rocks have not been turned over). Q5: 4,600 × 12 ÷ 100 = 552 million years. Keep the number: it is about how long animals with shells and skeletons have been around, the last 539 million years, under 12% of Earth\'s history. Q6: accept any answer that says the dinosaurs died out long before people. The exact gap, about 66 million years, is I Do 2 and the We Do.\n\n'
    + 'CHANGE THE DATE before you teach, if the lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Describe the geologic time scale as a timeline of Earth’s history.', 'Order major events in the history of life.', 'Describe what a mass extinction is.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Earth’s history is split into ', false], ['eras', true], [', and on a one-day clock humans arrive in the ', false], ['last few seconds', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The unit so far: how natural selection works, the evidence for it (fossils, bones, embryos, DNA), what changes a gene pool, and last lesson how one species becomes two. All of that needs TIME, and today is how much time there has been. Say "last lesson speciation took many thousands of generations. Today: is there enough time for that? Yes: 4,600 million years".\n\n'
    + 'THREE NEW WORDS, as the brief says: GEOLOGIC TIME SCALE (a timeline of Earth\'s history, split into eras), ERA (a very long stretch of that history, hundreds of millions of years) and MASS EXTINCTION (I Do 2). The banner has the first two ideas; read it and move on.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('Squeeze all 4.6 billion years of Earth’s history into one day. Earth forms at midnight. At what time do the first humans appear?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('clock', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_clock' });
  const OPTS = [['A', 'About 6 pm.'], ['B', 'About 11 pm.'], ['C', 'A few seconds before midnight.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'top', margin: 0, lineSpacing: 23, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click. THE BRIEF\'S HOOK: Earth\'s history squeezed into one day.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the animation in I Do 1 does, with the clock running beside the timeline.\n\n'
    + 'ANSWER, FOR YOU: C. On a one-day clock, one hour is about 192 million years. The first humans (Homo sapiens, about 300,000 years ago) arrive at about 23:59:54, under 6 seconds before midnight (0.3 ÷ 4,600 × 24 × 60 × 60 = 5.6 seconds). For comparison: first life about 05:44, first animals 21:00, first dinosaurs 22:48, the asteroid 23:39.\n\n'
    + 'EXPECT MOST VOTES FOR B, some for A. Nobody will feel how late C is until they see it. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".'
  );
}

/* ================================================================== *
 * 4. I DO · 3: the geologic time scale (objectives 1 and 2)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'The geologic time scale', 'light', { size: 30 });
  // the film is wide (6.9 in) so that its labels read from the back of the room; the two cards share the narrower right column
  const g = 0.30, lw = 6.90, y0 = BODY_Y - 0.14, vh = lw * 540 / 960;
  video(s, 'deep-time-eras', M, y0, lw, vh, 'vid_eras');
  sentence(s, [['A bigger number of years ago is ', false], ['further back', true], [' in time.', false]], { x: M, y: y0 + vh + 0.14, w: lw, h: 0.56, size: 15, name: 'big_back' });
  const RX = M + lw + g, RW = RIGHT - RX, nh = 2.06, eh = vh + 0.14 + 0.56 - nh - 0.14;
  card(s, { x: RX, y: y0, w: RW, h: nh, name: 'nw' });
  s.addText('NEW WORDS', { x: RX + 0.22, y: y0 + 0.08, w: RW - 0.44, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'nw_h' });
  s.addText([
    { text: 'Geologic time scale: ', options: { bold: true } }, { text: 'a timeline of Earth’s history, split into eras.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Era: ', options: { bold: true } }, { text: 'a very long stretch of that history, hundreds of millions of years.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Palaeo- old, Meso- middle, Ceno- new; -zoic: life.', options: { italic: true, color: C.inkSoft } },
  ], { x: RX + 0.22, y: y0 + 0.44, w: RW - 0.44, h: nh - 0.50, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: 'nw_t' });
  const ey = y0 + nh + 0.14;
  card(s, { x: RX, y: ey, w: RW, h: eh, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addText('WORKED EXAMPLE', { x: RX + 0.22, y: ey + 0.08, w: RW - 0.90, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.5, valign: 'middle', margin: 0, objectName: 'ex_h' });
  s.addImage({ path: ICON('fern', 'accentInk'), x: RIGHT - 0.66, y: ey + 0.08, w: 0.50, h: 0.50, objectName: 'ex_fern' });
  s.addText([
    { text: `Which era? First plants on land: ${EV('plants')} million years ago.`, options: { bold: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: `The Palaeozoic ran from ${DATA.eras[1][1]} to ${DATA.eras[1][2]} million years ago.`, options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: `${EV('plants')} is between ${DATA.eras[1][1]} and ${DATA.eras[1][2]}.`, options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'So the first land plants are Palaeozoic.', options: { bold: true, color: C.alert } },
  ], { x: RX + 0.22, y: ey + 0.50, w: RW - 0.44, h: eh - 0.56, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17.5, objectName: 'ex_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the new words, the animation (ON CLICK, so say the idea first), the worked example, then the banner.\n\n'
    + 'OBJECTIVES 1 AND 2. THE GEOLOGIC TIME SCALE is a timeline of Earth\'s history, split into ERAS. Four eras, oldest first: PRECAMBRIAN (4,600 to 539 million years ago), PALAEOZOIC (539 to 252), MESOZOIC (252 to 66), CENOZOIC (66 to now). The names help: palaeo- means old, meso- middle, ceno- new, and -zoic means life: old life, middle life, new life. A NOTE FOR YOU ONLY: geologists rank the Precambrian above an era (a "supereon"); KS3 teaches it as the first era, and so does the brief. Do not raise it unless asked.\n\n'
    + 'THE ANIMATION (about 27 seconds) IS THE TIME SCALE DRAWN TO SCALE, and it SETTLES THE HOOK. A bar for all 4,600 million years fills era by era, and beside it a clock counts the same history as ONE DAY, from midnight. It pauses at each era: the Precambrian runs to 21:11 (nearly nine tenths of the bar), the Palaeozoic to 22:41, the Mesozoic to 23:39, the Cenozoic to midnight. Then the last 539 million years are stretched out, with a trilobite, a dinosaur and a person, and it ends on the first humans: 23:59:54. POINT AT THE TALLY: the answer was C, the last 6 seconds of the day. You can click the video to play it again.\n\n'
    + 'THE WORKED EXAMPLE IS OBJECTIVE 2, ORDERING: to place an event, find the era whose start and end it sits between. 470 is less than 539 and more than 252, so the first land plants are Palaeozoic. THE COMMONEST MISTAKE, WHICH THE BANNER IS FOR: "470 is smaller than 539, so it is earlier". In years AGO it is the other way round: the bigger number is further back. Do one more orally: "the first dinosaurs, 230 million years ago?" (between 252 and 66: Mesozoic).\n\n'
    + 'MISCONCEPTIONS. (1) "The eras are about the same length." The Precambrian is about 4,060 million years; the Mesozoic is 186. (2) "Life has been around for most of history, but people for a good part of it." People are the last 6 seconds of the day.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: mass extinctions (objective 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Mass extinctions', 'light', { size: 30 });
  const g = 0.30, lw = 5.55, y0 = BODY_Y - 0.14, ch = 4.30;
  // the Big Five, drawn to scale on the last 539 million years: era bands behind, one bar per extinction (height = share of species lost)
  card(s, { x: M, y: y0, w: lw, h: ch, name: 'ch' });
  s.addText('THE BIG FIVE: SHARE OF SPECIES LOST', { x: M + 0.24, y: y0 + 0.10, w: lw - 0.48, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.5, valign: 'middle', margin: 0, objectName: 'ch_h' });
  const px0 = M + 0.30, px1 = M + lw - 0.30, yb = y0 + ch - 0.78, hmax = 2.40, FROM = DATA.eras[1][1];
  const px = (t) => px0 + (FROM - t) / FROM * (px1 - px0);
  const BAND = { Palaeozoic: 'DCEDEF', Mesozoic: 'DDE7DE', Cenozoic: 'F6E7C8' };
  DATA.eras.slice(1).forEach(([name, a, b], i) => {
    s.addShape(S.rect, { x: px(a), y: yb - hmax - 0.10, w: px(b) - px(a), h: hmax + 0.10, fill: { color: BAND[name] }, line: { color: BAND[name], width: 0 }, objectName: `ch_band${i}` });
    const lw_ = Math.max(px(b) - px(a), 1.10), lx_ = Math.min((px(a) + px(b)) / 2 - lw_ / 2, M + lw - 0.12 - lw_);   // the Cenozoic band is narrow: give its label room
    s.addText(name, { x: lx_, y: yb + 0.30, w: lw_, h: 0.28, color: C.ink, fontFace: F.body, fontSize: 12, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ch_era${i}` });
  });
  s.addShape(S.line, { x: px0, y: yb, w: px1 - px0, h: 0, line: { color: C.ink, width: 1.25 }, objectName: 'ch_axis' });
  DATA.extinctions.forEach(([name, t, pct], i) => {
    const bw = 0.30, bh = pct / 100 * hmax, last = i === DATA.extinctions.length - 1;
    s.addShape(S.rect, { x: px(t) - bw / 2, y: yb - bh, w: bw, h: bh, fill: { color: last ? C.alert : C.dark }, line: { color: last ? C.alert : C.dark, width: 0 }, objectName: `ch_bar${i}` });
    s.addText(`${pct}%`, { x: px(t) - 0.40, y: yb - bh - 0.30, w: 0.80, h: 0.26, color: last ? C.alert : C.dark, fontFace: F.body, fontSize: 11.5, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ch_pct${i}` });
    s.addText(String(t), { x: px(t) - 0.40, y: yb + 0.03, w: 0.80, h: 0.24, color: C.ink, fontFace: F.body, fontSize: 11, align: 'center', valign: 'middle', margin: 0, objectName: `ch_t${i}` });
  });
  s.addImage({ path: ICON('asteroid', 'alert'), x: px(66) - 0.30, y: yb - 0.75 * hmax - 0.95, w: 0.60, h: 0.60, objectName: 'ch_ast' });
  s.addText('million years ago', { x: M, y: yb + 0.56, w: lw, h: 0.22, color: C.inkSoft, fontFace: F.body, fontSize: 10.5, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'ch_unit' });
  const RX = M + lw + g, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 1.62, name: 'df' });
  s.addText('MASS EXTINCTION', { x: RX + 0.24, y: y0 + 0.10, w: RW - 0.48, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'df_h' });
  s.addText('A large share of all species, about three quarters or more, die out in a short time, all over the Earth.', { x: RX + 0.24, y: y0 + 0.48, w: RW - 0.48, h: 1.06, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'df_t' });
  card(s, { x: RX, y: y0 + 1.76, w: RW, h: 2.54, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addText('WORKED EXAMPLE: 66 MILLION YEARS AGO', { x: RX + 0.24, y: y0 + 1.86, w: RW - 0.48, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.5, valign: 'middle', margin: 0, objectName: 'ex_h' });
  s.addText([
    { text: 'An asteroid about 10 km wide hits what is now Mexico.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'About 75% of species die out, all over the world, including every dinosaur except the birds.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'The Mesozoic ends. In the Cenozoic, mammals spread.', options: { bold: true, color: C.alert } },
  ], { x: RX + 0.24, y: y0 + 2.26, w: RW - 0.48, h: 1.98, color: C.ink, fontFace: F.body, fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'ex_t' });
  sentence(s, [['The last dinosaurs and the first humans are about ', false], ['66 million years', true], [' apart.', false]], { y: y0 + ch + 0.14, h: 0.56, size: 16, name: 'gap_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the definition, the chart, the worked example, then the banner.\n\n'
    + 'OBJECTIVE 3. A MASS EXTINCTION is when a large share of all species, about three quarters or more, die out in a short time (in geological terms: under about two million years), all over the Earth. Three parts, and students drop the last two: MANY species, SHORT time, WORLDWIDE. One species dying out is an extinction, not a mass extinction.\n\n'
    + 'THE CHART IS THE BIG FIVE DRAWN TO SCALE on the last 539 million years, bar height = share of species lost: end-Ordovician 445 million years ago (about 85%), Late Devonian 372 (about 70%), end-Permian 252 (about 90%, the worst, the "Great Dying"), end-Triassic 201 (about 75%), end-Cretaceous 66 (about 75%, red, the asteroid). Point at two of them: THE END-PERMIAN ENDS THE PALAEOZOIC AND THE END-CRETACEOUS ENDS THE MESOZOIC. The era names change where life changed most.\n\n'
    + 'THE WORKED EXAMPLE: 66 million years ago an asteroid about 10 km across hit what is now the Yucatán in Mexico (the Chicxulub crater). Dust and gas blocked sunlight, plants failed, food chains collapsed. About three quarters of species died out, including every dinosaur except the line that became birds. The Mesozoic ended; small mammals that survived spread in the Cenozoic. IF A STUDENT SAYS "birds are dinosaurs": they are right, and it is a good point. Say "the non-bird dinosaurs".\n\n'
    + 'THE BANNER IS THE BRIEF\'S MISCONCEPTION: "humans and dinosaurs lived together". The last (non-bird) dinosaurs died 66 million years ago; the first humans appeared about 0.3 million years ago, 65.7 million years later. On the one-day clock: 23:39 against 23:59:54. Settle Do Now Q6 here.\n\n'
    + 'WHERE IT COMES BACK: today species are being lost much faster than the normal background rate, and many scientists ask whether a sixth mass extinction has begun. That is SDG 15 (Life on Land), and it is worth a sentence, not a debate.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Spot The Mistake
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'Spot The Mistake', 'light'); sub(s, 'Right or wrong? Hands up for your answer before each one is revealed.', 'light');
  const ROWS = [
    ['Humans and dinosaurs lived at the same time.', 'WRONG', 'The last dinosaurs died out 66 million years ago. The first humans appeared about 300,000 years ago.'],
    ['Plants grew on land before the first dinosaurs.', 'RIGHT', `Land plants: ${EV('plants')} million years ago. Dinosaurs: ${EV('dinosaurs')} million years ago.`],
    ['The Mesozoic is the longest era.', 'WRONG', 'The Precambrian is: about 4,060 million years, nearly nine tenths of Earth’s history.'],
    ['A mass extinction is when one species dies out.', 'WRONG', 'It is when a large share of all species die out in a short time, all over the Earth.'],
  ];
  const rowH = 1.02, gap = 0.12, y0 = BODY_Y + 0.22, vw = 1.20, sw = 5.20;
  ROWS.forEach(([stmt, verdict, fix], i) => {
    const y = y0 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(stmt, { x: M + 0.28, y, w: sw, h: rowH, color: C.dark, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `wd${i}_q` });
    const ok = verdict === 'RIGHT';
    s.addText([{ text: verdict, options: { bold: true, color: ok ? C.support : C.alert, breakLine: false } }], {
      shape: S.roundRect, rectRadius: 0.10, x: M + 0.28 + sw + 0.16, y: y + 0.14, w: vw, h: rowH - 0.28, fill: { color: 'FFFFFF' }, line: { color: ok ? C.support : C.alert, width: 1.8 },
      fontFace: F.body, fontSize: 14, align: 'center', valign: 'middle', margin: 0, objectName: `wd${i}_v`,
    });
    const fx = M + 0.28 + sw + 0.16 + vw + 0.14;
    s.addText(fix, { shape: S.roundRect, rectRadius: 0.10, x: fx, y: y + 0.10, w: RIGHT - 0.14 - fx, h: rowH - 0.20, fill: { color: ANS }, line: { color: C.accent, width: 1.3 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 16, objectName: `wd${i}_a` });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks, one per row: each reveals RIGHT or WRONG and the correction together. THE MODE IS SPOT THE MISTAKE (TEMPLATE.md); last lesson\'s was Finish It Off. ONE ROW IS ALREADY RIGHT (row 2), so the task is to check, not to hunt for a flaw: a student who says "this one is fine" has done better work than one who invents an error.\n\n'
    + 'FOR EACH ROW: read it, hands up for "right" and then for "wrong", THEN click. For a wrong one, ask "what did the person who wrote it think?" Naming the error is what stops it coming back.\n\n'
    + 'ROW 1 IS THE BRIEF\'S MISCONCEPTION. Films and cartoons put cave people next to dinosaurs. The gap is about 66 million years (65.7). On the one-day clock: 23:39 against 23:59:54. ROW 2 IS RIGHT: 470 is a bigger number than 230, so it is further back (the I Do 1 banner). Ask a student to say why with the numbers. ROW 3: the thinking behind it is "the dinosaurs had the most time". The Mesozoic lasted 186 million years; the Precambrian about 4,060. ROW 4: the definition from I Do 2 needs MANY species, a SHORT time, WORLDWIDE.\n\n'
    + 'IF THEY ARE QUICK: "which era are you in right now?" (the Cenozoic). IF SHORT OF TIME, do rows 1, 2 and 4.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Name the four eras in order, oldest first.', 'Precambrian, Palaeozoic, Mesozoic, Cenozoic.'],
    ['State which era makes up most of Earth’s history.', 'The Precambrian: nearly nine tenths of it.'],
    ['Put in order, oldest first: dinosaurs, first life, first land plants.', 'First life, first land plants, dinosaurs.'],
    ['Describe what a mass extinction is.', 'Many species, about three quarters or more, die out in a short time, all over the Earth.'],
    ['Explain how a barrier stops gene flow.', 'Animals cannot cross it to breed, so alleles stop moving between the groups.'],
    ['State the test for whether two groups are one species.', 'Can they breed together and produce fertile offspring?'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (gene flow, the thing they found hard) and Q6 (the species test, last lesson).\n\n'
    + 'Q1 IS OBJECTIVE 1. If they stall, give the meanings: old life, middle life, new life. Q2: the Precambrian, about 88%. Q3 IS OBJECTIVE 2: first life (3,500 million years ago), land plants (470), dinosaurs (230). Ask "how do you know?" and want "the bigger number is further back". Q4 IS OBJECTIVE 3: listen for all three parts (many species, short time, worldwide). Q5: the barrier stops the animals meeting to breed, so alleles stop moving between the groups; that is gene flow stopping. Q6: can they breed together AND produce fertile offspring?\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "which two eras end with a mass extinction?" (the Palaeozoic, end-Permian; the Mesozoic, end-Cretaceous). IF SHORT OF TIME, cut Q6.'
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
    ['ROUND 1', 'The whole timeline', 'Place events on all 4,600 million years, with the eras shown.'],
    ['ROUND 2', 'Zoom in', 'The last 600 to 700 million years. Closer events and a tighter mark.'],
    ['ROUND 3', 'Beat the game', 'No eras shown, Earth as one day, and the last few seconds. Meant to be almost impossible.'],
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
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three rounds, then the note. THE GAME IS A NUMBER LINE, as the brief says: place events on a timeline. The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open "Deep Time game" from Google Classroom. Three rounds of six. Each question names an event; they TAP the timeline where it goes (or use the arrow keys), drag to adjust, then Check. The game shows where it really goes, how far out they were, and the working (for example "470 million years ago is 470 ÷ 4,600 of the way back from now"). A placement counts as right if it is inside the green band shown after checking. EVERY STUDENT GETS A DIFFERENT GAME: different events, a different zoom and a different order; the skills and their order are the same for everyone. Each game has a six-character code on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. No lives, no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1: the whole 4,600 million years, eras shown, a wide band (the brief\'s events: first life, first land plants, dinosaurs, the asteroid, first humans, and others). Round 2: zoomed in to the last 600, 650 or 700 million years, a tighter band, events closer together. Round 3: the whole line with NO eras shown; the last 10 million years (the Isthmus of Panama or the finches, from last lesson); the timeline as ONE DAY (place the event at its clock time); the LAST HOUR of the day; then the two that are meant to be almost impossible: the LAST MINUTE of the day (for example the first humans, 6 seconds before midnight) and the moment HALFWAY between an event and now, on the last hour. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'THE GAME NAMES THE MISTAKES, each with the sum behind it: counting FORWARDS from the left end instead of back from now (the mirror image of the right place); millions read as billions; the wrong era; on the clock, AFTER midnight instead of before; and, on the halfway question, the event itself instead of the halfway point. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each question took, whether it was right and, for a wrong one, where they put it and the working. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is a bigger number further back or more recent?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.'
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
    { text: 'Four eras, oldest first: Precambrian, Palaeozoic, Mesozoic, Cenozoic.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'A bigger number of years ago is further back in time.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'A mass extinction: a large share of all species die out in a short time, all over the Earth.', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: 'The last dinosaurs and the first humans are about 66 million years apart.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 2.0, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The Gold calculations have exact answers (the one-day clock, the 46 m timeline, the Precambrian\'s share); for the clock, accept 23:39 or 23:40 if a student rounded early. ON THE GAME, the drop-down for each round shows the working for every question.\n\n'
    + 'WALK ROUND for the three commonest mistakes: an event placed by counting forwards from Earth\'s formation; "470 comes after 539"; a mass extinction defined as one species dying out.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['The Precambrian makes up most of Earth’s history.', 'TRUE'],
    ['Early humans hunted dinosaurs.', 'FALSE'],
    ['A mass extinction is when a single species dies out.', 'FALSE'],
    ['A fossil of a flowering plant could be found in Palaeozoic rock.', 'FALSE'],
    ['The asteroid 66 million years ago ended the Mesozoic.', 'TRUE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('4,600 million years of Earth, and people for the last few seconds of the day.', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: THE BRIEF\'S MISCONCEPTION, humans and dinosaurs together: about 66 million years apart. Q3: one species dying out is an extinction; a MASS extinction is many species, a short time, worldwide. Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): flowering plants appeared about 130 million years ago, in the Mesozoic, so there are none in Palaeozoic rock (539 to 252 million years ago). Ask "how do you know?". Q1 and Q5 are TRUE (objectives 1 and 3).\n\n'
    + 'THE CLOSING LINE DOES NOT NAME A NEXT LESSON, BECAUSE NONE IS WRITTEN DOWN (TEMPLATE.md asks for it). It is the lesson in one sentence. CHANGE IT once the next lesson is decided.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

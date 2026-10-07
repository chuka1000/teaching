/**
 * Y10 Science, Forces, When The Resultant Is Zero. Class 10A (Cambridge IGCSE Co-ordinated Sciences 0654). Single, 50 minutes. 'motion' palette
 * (Night Highway), as the other Y10 forces and motion lessons use.
 *
 * DATE: the date the deck was BUILT on (Tuesday 6 October 2026). Change it before you teach.
 *
 * PREVIOUS, per the brief: "reference/Forces And The Resultant.pptx". THAT FILE DOES NOT EXIST. The lesson before this one, in the order you gave
 * them, is "Resultant Forces", which I built in this same session (out/Resultant Forces/), so I treated THAT as the previous lesson: I read its
 * Do Now, its phases and its plenary, and this lesson keeps the plenary's promise ("what does a resultant of zero tell us about how something
 * moves?"). If "Forces And The Resultant" is a different lesson that you taught, tell me and I will check this one against it.
 *
 * SYLLABUS (python3 tools/syllabus.py P1.5.1.6): "Know that an object either remains at rest or continues in a straight line at constant speed unless
 * there is a resultant force on the object". The scheme's activities: free-body diagrams; the straw-and-paper-ball activity (forces from various
 * ANGLES, so NOT used: this lesson is along one line); and, under P1.5.1.7, the tennis ball thrown in space ("it will travel for ever as there are no
 * forces to change its motion"), which is objective 3 and the Hook. The three objectives are YOUR wording, with the code you gave on objective 1.
 *
 * THE BRIEF'S AVOID, AND HOW THE LESSON HANDLES IT: "Letting 'no resultant force' collapse into 'no forces'." The two are kept apart in every phase:
 * I Do 2 puts them side by side ("the forces cancel" against "no forces at all"), the We Do and Cold Call each have a case of the collapse (a book
 * at rest "has no forces on it"), every game option that says "no forces" is a marked mistake except in deep space, and the Plenary's FALSE
 * statements are the collapse in both directions. Checked in build/when-the-resultant-is-zero-check.py.
 *
 * THEY FOUND HARD (brief): left blank, so nothing is guessed.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14, Mark 3, Plenary 3.
 * Three objectives, two I Do slides: I Do 1 holds objectives 1 AND 2 (the law, and its converse: a steady speed means no resultant force: they are
 * one idea read two ways, on one animation). I Do 2 is objective 3, alone, and is the slide the AVOID is about. The We Do is "Finish this one" (the
 * last lesson used "What should be the correct answer?", and TEMPLATE.md says to alternate). The You Do is the GAME, "your call": Zero Or Not.
 *
 * Every number is checked in build/when-the-resultant-is-zero-check.py, which also reads them back out of the finished deck and worksheet.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Tuesday 6 October 2026';
const LESSON = 'When The Resultant Is Zero';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_motion_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LINE = 'C3C8D8', ANS = 'FFE9D6';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y10 Science · Forces · 10A';

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
  return addTimer(pptx, slide, { key: 'motion', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H });
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
  qGrid(s, { p: 'd', y0: 1.24, ch: 1.62, gap: 0.20, qh: 0.78, size: 15, asize: 12.5, qs: [
    ['A force of 80 N acts to the right and a force of 35 N acts to the left on a box. Find the resultant force.', '45 N to the right. 80 − 35.'],
    ['Name the two forces on a book resting on a table. Say which way each one acts.', 'Weight, down. The reaction force from the table, up.'],
    ['A car accelerates from rest at 3 m/s² for 5 s. Find its final speed.', '15 m/s. 3 × 5.'],
    ['State what the gradient of a distance-time graph shows.', 'The speed. A steeper line means a faster speed.'],
    ['Name the two kinds of particle in the nucleus of an atom.', 'Protons and neutrons.'],
    ['A ball rolls along the floor and slowly stops. Why does it stop?', 'A force acts against it: friction and air resistance. We see what that means today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'THE PREVIOUS LESSON IS NOT ON FILE UNDER THE NAME IN THE BRIEF. The brief says reference/Forces And The Resultant.pptx and there is no such file. I took the lesson built just before this one, "Resultant Forces", as the previous lesson, and read it. If you taught something else, swap Q1 and Q2.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are from LAST LESSON (Resultant Forces): the resultant of two opposite forces, and the two forces on a book at rest. Q2 IS NOT FILLER: it is the seed of the collapse this lesson is about (a book at rest HAS forces on it). Q3 and Q4 are earlier in the physics (Equations of Motion, v = at; Motion Graphs, what the gradient of a distance-time graph shows). Q5 is another science (chemistry). Q6 PREVIEWS TODAY and cannot be answered fully yet: it is the ball that rolls and stops, and it is settled in Cold Call Q4 and in I Do 1 (a resultant force, friction, acts against the ball).\n\n'
    + 'I CHECKED EVERY QUESTION against the Do Nows of the last 10A lessons. Nothing repeats. I dropped a question on what g = 9.8 N/kg means, because Weight and Gravity already asked it.\n\n'
    + 'Q1: 80 − 35 = 45 N to the right. Q2: weight down, the reaction force up (say both directions). Q3: v = u + at = 0 + 3 × 5 = 15 m/s. Q4: the gradient is the speed (distance ÷ time); a straight sloping line is a steady speed, which is the idea of today. Q5: protons and neutrons. Q6: "friction", or "something is slowing it". Take any answer that names a force. Do NOT say "there is a resultant force" yet: they should reach that themselves in I Do 1.\n\n'
    + 'THEY FOUND HARD: left blank in the brief. Nothing guessed. CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['State Newton’s first law. (P1.5.1.6)', 'Explain why an object at constant speed has no resultant force.', 'Explain what happens to an object with no forces acting at all.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['No resultant force', true], [' means ', false], ['no change', true], [' in speed or direction, but the forces can still be there.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. Last lesson they drew free-body diagrams and found the resultant along a line, and the Plenary ended on a question: what does a resultant of zero tell us about how something moves? Today answers it. Say "last lesson you found the resultant. Today we find out what it DOES".\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING. Objective 1 is syllabus P1.5.1.6, which the 0654 scheme of work words as "Know that an object either remains at rest or continues in a straight line at constant speed unless there is a resultant force on the object". Objectives 2 and 3 are the two halves of using it.\n\n'
    + 'NEW WORDS: Newton\'s first law, constant speed (steady speed: the same thing, and the lesson uses both), at rest. THE BANNER IS THE WHOLE LESSON IN ONE SENTENCE, and its last clause is the answer to the brief\'s warning: the forces can still be there. A resultant of zero is NOT the same as no forces. Say it now, once, and then keep saying it.\n\n'
    + 'EVERY FORCE TODAY IS ALONG ONE STRAIGHT LINE, as last lesson. The scheme\'s paper-ball activity uses forces from different angles; it is not used.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('A probe is far from every star and planet, with its engine off. It is moving at 5 km/s. What happens next?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('rocket', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_rocket' });
  const OPTS = [['A', 'It slows down and stops, because nothing is pushing it.'], ['B', 'It keeps moving at 5 km/s in a straight line.'], ['C', 'It speeds up slowly, because nothing is holding it back.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: I Do 2 settles it, pointing at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. With no forces on the probe there is no resultant force, so its motion does not change: the same speed, in a straight line, for ever. Expect most votes for A, because everything they have ever seen slows down and stops. That is the oldest idea in the subject (Aristotle held it) and it is wrong, and the reason is the whole lesson: things on Earth stop because friction and air resistance act on them, not because motion needs a push. C is the other trap: speeding up needs a resultant force too.\n\n'
    + 'THIS IS THE SCHEME\'S OWN EXAMPLE (the tennis ball thrown in space), made into a probe so the speed is a number. In practice no place is completely free of forces (gravity reaches everywhere) but far from every star and planet they are too small to matter. Say so only if asked.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md), so do not tell them. Say "write your vote".\n\n'
    + 'DO NOT EXPLAIN YET. Say "by the end of today you will be able to prove which one it is".'
  );
}

/* ================================================================== *
 * 4. I DO · 3: Newton's first law, and a steady speed (objectives 1 and 2)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Newton’s first law', 'light', { size: 30 });
  const g = 0.30, lw = 5.55, y0 = BODY_Y - 0.14, vh = lw * 540 / 960;
  video(s, 'wtrz-motion', M, y0, lw, vh, 'vid_motion');
  card(s, { x: M, y: y0 + vh + 0.14, w: lw, h: 1.30, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'wx' });
  s.addText([
    { text: 'A crate slides at a steady speed. The push is 60 N.', options: { bold: true, color: C.dark, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'Steady speed: ', options: { bold: true, color: C.accentInk } }, { text: 'the resultant is 0 N.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'The friction equals the push: 60 N.', options: { bold: true, color: C.alert } },
  ], { x: M + 0.24, y: y0 + vh + 0.14, w: lw - 0.48, h: 1.30, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'wx_t' });
  const RX = M + lw + g, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 2.40, name: 'fb' });
  s.addText('NEWTON’S FIRST LAW', { x: RX + 0.24, y: y0 + 0.10, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'fb_h' });
  s.addText([
    { text: 'An object stays at rest, or keeps moving at a constant speed in a straight line, ', options: {} },
    { text: 'unless a resultant force acts on it.', options: { bold: true, color: C.alert, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'No resultant force: no change in motion.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 0.52, w: RW - 0.48, h: 1.80, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 20, objectName: 'fb_t' });
  card(s, { x: RX, y: y0 + 2.54, w: RW, h: 2.36, name: 'rs' });
  s.addText('THE OTHER WAY ROUND', { x: RX + 0.24, y: y0 + 2.64, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'rs_h' });
  s.addText([
    { text: 'At rest, or at a steady speed, the motion is not changing.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'So there is no resultant force: it is 0 N.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'The forces one way equal the forces the other way.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'If the speed or direction changes, there IS a resultant force.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 3.04, w: RW - 0.48, h: 1.80, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'rs_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the animation (ON CLICK, so say the idea first), the law, the other way round, then the worked example.\n\n'
    + 'OBJECTIVES 1 AND 2 TOGETHER, ON PURPOSE. TEMPLATE.md gives each I Do one objective, but with three objectives and two I Do slides, the law (objective 1) and its other half (objective 2) are one idea read two ways and share one animation. Objective 3 has the next slide to itself, because it is the one the brief warns about.\n\n'
    + 'THE ANIMATION (about 25 seconds) is ONE crate in three situations, with the arrows to scale and the speed on screen. (1) At rest: weight 100 N down, reaction force 100 N up, resultant 0 N, speed 0 m/s: it stays at rest. (2) Sliding at a steady 5 m/s: push 60 N right, friction 60 N left, resultant 0 N, and the speed stays 5 m/s (the ground scrolls past at a steady rate so the motion is SEEN). (3) The push stops: friction 60 N alone, a resultant of 60 N to the left, and the speed FALLS to 0. Pause it and ask before each: "what does the resultant say about the speed?" You can click it to play it again.\n\n'
    + 'THE LAW HAS TWO HALVES: at rest stays at rest; moving keeps going at a constant speed in a straight line. BOTH are "no change in motion". THE CONVERSE IS OBJECTIVE 2: if the motion is not changing, there is no resultant force. It is how the worked example works: the crate slides at a steady speed, so the resultant is 0 N, so the friction is exactly the push. THIS IS THE METHOD FOR EVERY MISSING-FORCE QUESTION TODAY.\n\n'
    + 'BACK TO THE DO NOW (Q6): the ball stops because a resultant force, friction, acts against it. It is not that motion "runs out". Frame 3 of the animation is the ball.\n\n'
    + 'MISCONCEPTIONS. (1) "A force is needed to keep something moving." The animation shows a steady speed with a resultant of ZERO. (2) "Any force changes the motion." A RESULTANT force does; forces that cancel do not. This is the word the brief wants watched. (3) "At a steady speed the forward force must be bigger." It is equal.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: zero resultant is not the same as no forces (objective 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'A zero resultant is not the same as no forces', 'light', { size: 27 });
  const y0 = BODY_Y - 0.10, hh = 0.44, lw = 6.20, g = 0.30, RX = M + lw + g, RW = RIGHT - RX;
  /* left: the resultant is zero (the forces are there and they cancel) */
  card(s, { x: M, y: y0, w: lw, h: hh, fill: C.dark, line: C.dark, name: 'lh' });
  s.addText('THE RESULTANT IS ZERO: the forces cancel', { x: M + 0.22, y: y0, w: lw - 0.3, h: hh, color: C.accent, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'lh_t' });
  const ROWS = [['book', 'A book on a table', 'Weight down, reaction force up. Equal.'], ['car', 'A car at a steady speed', 'Driving force = resistive forces.'], ['parachute', 'A skydiver at a steady speed', 'Weight = air resistance.']];
  const rh = 0.86, rg = 0.10;
  ROWS.forEach(([icon, head, desc], i) => {
    const y = y0 + hh + 0.12 + i * (rh + rg);
    card(s, { x: M, y, w: lw, h: rh, name: `lr${i}` });
    s.addImage({ path: ICON(icon, 'accentInk'), x: M + 0.20, y: y + 0.17, w: 0.52, h: 0.52, objectName: `lr${i}_icon` });
    s.addText(head, { x: M + 0.92, y: y + 0.08, w: lw - 1.1, h: 0.38, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `lr${i}_h` });
    s.addText(desc, { x: M + 0.92, y: y + 0.46, w: lw - 1.1, h: 0.34, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, objectName: `lr${i}_t` });
  });
  const fy = y0 + hh + 0.12 + 3 * (rh + rg);
  card(s, { x: M, y: fy, w: lw, h: 0.62, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'lf' });
  s.addText([{ text: 'Forces ARE acting. ', options: { bold: true, color: C.accentInk } }, { text: 'The resultant is 0 N, so the motion does not change.', options: {} }], { x: M + 0.22, y: fy, w: lw - 0.44, h: 0.62, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'lf_t' });
  /* right: no forces at all */
  card(s, { x: RX, y: y0, w: RW, h: hh, fill: C.dark, line: C.dark, name: 'rh' });
  s.addText('NO FORCES AT ALL: nothing pushes or pulls', { x: RX + 0.22, y: y0, w: RW - 0.3, h: hh, color: C.accent, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'rh_t' });
  const vy = y0 + hh + 0.12, vh = RW * 540 / 960;
  video(s, 'wtrz-probe', RX, vy, RW, vh, 'vid_probe');
  const cy = vy + vh + 0.10;
  card(s, { x: RX, y: cy, w: RW, h: fy + 0.62 - cy, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'rc' });
  s.addText([{ text: 'A probe in deep space. ', options: { bold: true, color: C.accentInk } }, { text: 'No forces: the motion does not change.', options: {} }], { x: RX + 0.22, y: cy, w: RW - 0.44, h: fy + 0.62 - cy, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'rc_t' });
  sentence(s, [['Two different reasons, ', false], ['the same result', true], ['. The first law is about the ', false], ['resultant', true], [' force.', false]], { y: fy + 0.80, h: 0.62, size: 16, name: 'bn' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the left card (forces that cancel), the probe animation (ON CLICK), the right card, then the banner. THE HEADERS ARE ON SCREEN FROM THE START.\n\n'
    + 'THIS IS OBJECTIVE 3, AND IT IS THE SLIDE THE BRIEF\'S WARNING IS ABOUT: "no resultant force" must not collapse into "no forces". Two different situations give the SAME result (the motion does not change) for two different reasons. LEFT: forces ARE acting and they cancel: a book on a table (weight down, reaction force up), a car at a steady speed (the driving force equals the resistive forces), a skydiver at a steady speed (weight equals air resistance). RIGHT: there are NO forces at all: a probe far from every star and planet. The layout is the same on both sides on purpose, so the difference is structural.\n\n'
    + 'POINT AT THE HOOK TALLY. It was a probe in deep space with the engine off: B. With no forces there is no resultant, so by the first law the motion does not change: 5 km/s, in a straight line, for ever. Ask the people who voted A: "what would slow it down?" Nothing is there to do it. Things on Earth stop because friction and air resistance act on them.\n\n'
    + 'THE ANIMATION (14 seconds) shows stars scrolling past a probe at a constant rate, with the speed on screen and no arrows at all, because there is nothing to draw. Click it to replay.\n\n'
    + 'HONEST CAVEAT, IF ASKED: nowhere is truly free of forces (gravity has no limit), but far from every star and planet they are too small to matter. The deep-space case is the cleanest picture of "no forces". The case students meet every day is the LEFT one.\n\n'
    + 'THE SENTENCE TO MAKE THEM SAY: "A resultant of zero does not mean there are no forces. It means the forces cancel."\n\n'
    + 'MISCONCEPTIONS. (1) "The book is not moving, so no forces act on it." Weight and the reaction force both act. (2) "Deep space is where things stop, because there is no air to carry them." Air only slows things down. (3) "No forces means it stops." No forces means NOTHING changes.'
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
    ['A car moves at a steady speed. The driving force is 1800 N. Find the total resistive force.', 'Steady speed, so the resultant is ____ N. The resistive force equals the ____ force.', '0 N. The driving force. So the total resistive force is 1800 N.'],
    ['A sledge is pulled at a steady speed with a pull of 45 N. The pull is then increased to 70 N.', 'The friction stays ____ N. Resultant: 70 − 45 = ____ N. The speed will ____.', '45 N. 25 N, forwards. The speed increases: the resultant is not zero.'],
    ['A probe in deep space has its engine off. Describe its motion.', 'No forces act, so the resultant is ____ N. By the first law the probe ____.', '0 N. It keeps moving at the same speed in a straight line.'],
  ];
  const rowH = 1.30, gap = 0.16, y0 = BODY_Y + 0.22;
  ROWS.forEach(([prob, work, fin], i) => {
    const y = y0 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText([{ text: prob, options: { bold: true, color: C.dark, breakLine: true, paraSpaceAfter: 6 } }, { text: work, options: { color: C.ink } }], { x: M + 0.28, y, w: 6.40, h: rowH, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(fin, { shape: S.roundRect, rectRadius: 0.10, x: M + 6.90, y: y + 0.12, w: CW - 6.90 - 0.14, h: rowH - 0.24, fill: { color: ANS }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 14, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 18, objectName: `wd${i}_a` });
  });
  s.addNotes(
    'WE DO. 5 minutes. Three clicks. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked solutions, and they supply the missing step. The last lesson used "what should be the correct answer?", and TEMPLATE.md says to alternate across a unit, so a unit of nothing but spot-the-mistake does not teach error-hunting. A method lesson fits this mode.\n\n'
    + 'THEY SAY THE MISSING STEP OUT LOUD BEFORE EACH REVEAL, and you ask "why?" every time. The three rows are mixed on purpose, so each one needs a decision.\n\n'
    + 'ROW 1 IS OBJECTIVE 2 AND THE METHOD: a steady speed means the resultant is zero, so the forces one way equal the forces the other way. 0 N, then the driving force, then 1800 N. Watch for "1800 + something". ROW 2 IS THE OTHER SIDE OF THE COIN: a resultant that is NOT zero changes the motion. The friction stays 45 N (it did not grow), so 70 − 45 = 25 N forwards, and the sledge SPEEDS UP. Before the pull went up the forces were balanced; the extra 25 N is what is left over. ROW 3 IS OBJECTIVE 3: no forces, resultant 0 N, the same speed in a straight line.\n\n'
    + 'WATCH THE WORD "NO". A student who writes "no resultant force" in row 1 and "no forces" in row 3 is fine. A student who says "no forces" in row 1 has made the collapse the brief warns about: the driving force and the resistive forces are both THERE. Ask "which forces are there?" and make them name them.\n\n'
    + 'IF THEY ARE QUICK, ask for a case with a resultant of zero where the object is moving, and another where it is at rest. IF SHORT OF TIME, do rows 1 and 3 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['State Newton’s first law.', 'An object stays at rest, or keeps moving at a constant speed in a straight line, unless a resultant force acts on it.'],
    ['A box slides at a steady speed. What is the resultant force on it? How do you know?', '0 N. A steady speed means the motion is not changing.'],
    ['A student says: “The book on the table is not moving, so there are no forces on it.” What is wrong?', 'Weight and the reaction force are both there. They are equal and opposite, so the resultant is 0 N.'],
    ['A ball rolls across the floor and slows down. Use the first law to explain why.', 'The speed changes, so there is a resultant force: friction acts against the motion.'],
    ['A force of 150 N acts to the right. Forces of 90 N and 35 N act to the left. Find the resultant force.', '25 N to the right. 150 − (90 + 35).'],
    ['A ball is dropped from rest and falls freely. Find its speed after 2 s. Use g = 9.8 m/s².', '19.6 m/s. 9.8 × 2.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards (the scheme suggests miniature whiteboards; this class does not have them, so every answer is spoken). If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (the resultant of three forces on a line, from Resultant Forces) and Q6 (free fall, from Gravitational Fields and Free Fall).\n\n'
    + 'Q1 IS OBJECTIVE 1: the law, in their own words, with "resultant". Listen for "unless a force acts on it": that is the collapse. Ask "any force?" Q2 IS OBJECTIVE 2: zero, because a steady speed is no change in motion. Q3 IS OBJECTIVE 3 AND THE BRIEF\'S WARNING, IN THE STUDENT\'S OWN VOICE: the book has two forces and they cancel. If a student says "the forces cancel", ask "so are there forces or not?" Q4 SETTLES THE DO NOW Q6: the ball changes speed, so a resultant force acts: friction. Q5: 90 + 35 = 125, then 150 − 125 = 25 N to the right; watch for a missing direction. Q6: v = u + at = 0 + 9.8 × 2 = 19.6 m/s.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, ask Q4 with a ball in deep space: what happens then? IF SHORT OF TIME, cut Q6.'
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
    ['ROUND 1', 'The first law', 'State the law, and read what a set of forces says about the motion.'],
    ['ROUND 2', 'Steady speed', 'Why things slow down, deep space, and missing forces at a steady speed.'],
    ['ROUND 3', 'Beat the game', 'Very hard. Zero resultant, or no forces? The last questions are meant to be almost impossible.'],
  ];
  const g = 0.30, cw = (CW - 2 * g) / 3;
  ROUNDS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill: i === 2 ? 'FBD9E1' : 'FFFFFF', line: i === 2 ? C.alert : C.accentInk, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.26, y: BODY_Y + 0.60, w: cw - 0.52, h: 0.36, color: i === 2 ? C.alert : C.accentInk, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1.5, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(head, { x: x + 0.26, y: BODY_Y + 1.00, w: cw - 0.52, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.26, y: BODY_Y + 1.46, w: cw - 0.52, h: 1.14, color: C.inkSoft, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `t${i}_b` });
  });
  s.addText('No timer on the questions. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks: the three rounds, then the note. THE GAME IS ZERO OR NOT ("your call"), and the worksheet is the fallback, built every time.\n\n'
    + 'WHY THIS GAME. The lesson is a concept with one sharp trap, so the game is built as questions where the wrong options ARE the misconceptions: "motion needs a force", "any force changes the motion", and above all "no resultant force means no forces". It is the same engine as Net Force, so they already know how it works. Some questions are multiple choice and some need a number on the on-screen keypad. Every force diagram is drawn to scale, and where an arrow is unknown it is labelled X.\n\n'
    + 'WHAT THEY DO. Open the file "When The Resultant Is Zero game" from Google Classroom. Three rounds of six questions. Each question is a single go: a wrong answer says what the mistake probably was and shows the working. EVERY STUDENT GETS A DIFFERENT GAME: different objects, forces, numbers and wording, in a different order, so a neighbour\'s answers are no use. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. There are no lives and no penalty for being slow. NOTHING IS SAID ABOUT ANGLES: every force is along one line.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1: the law, and what the forces say about the speed. Round 2: why a rolling ball stops, deep space, and the missing force at a steady speed. Round 3 goes far past the lesson: an odd one out, a car at a steady speed, a skydiver, a pull that is increased, then two very hard last questions (a ball at the top of its path, a lift, a probe whose engine switches off, or a parachute that opens). Expect most of the room to miss some of the last two. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'EVERY QUESTION HAS EXACTLY ONE RIGHT ANSWER BY CONSTRUCTION, and "there are no forces" is a MARKED MISTAKE everywhere except deep space. AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each question took, whether it was right and, for a wrong one, what the student chose and why it is a common mistake. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "are there forces on it, or is the resultant zero?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
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
    { text: 'Newton’s first law: an object stays at rest, or keeps moving at a constant speed in a straight line, unless a resultant force acts on it.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'At rest, or at a steady speed, the resultant force is 0 N. The forces one way equal the forces the other way.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'A resultant of 0 N does not mean there are no forces. A book on a table has weight and a reaction force.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'With no forces at all (far from everything in space) the motion does not change either.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 1.86, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. Q1, Q2, Q8, Q9, Q12 and Q14 are in words: check the KEY WORDS (resultant, constant speed, straight line, cancel). The numbers are exact: check the size, the unit, and a direction where there is one. ON THE GAME, the drop-down for each round shows the working for every question.\n\n'
    + 'WALK ROUND for the three commonest mistakes: writing "no forces" where it should be "no resultant force", saying the forward force must be bigger at a steady speed, and answering "the pull" instead of the leftover when the pull goes up (Q13).'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['An object at rest stays at rest unless a resultant force acts on it.', 'TRUE'],
    ['A force is needed to keep an object moving at a constant speed.', 'FALSE'],
    ['A book rests on a table, so there are no forces on it.', 'FALSE'],
    ['A sledge moves at a steady speed. The pull is 45 N, so the friction is 45 N.', 'TRUE'],
    ['A probe far from every star and planet, with its engine off, slows down and stops.', 'FALSE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Next lesson: what happens when the resultant force is NOT zero?', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY, AND TWO OF THEM ARE THE BRIEF\'S COLLAPSE IN EACH DIRECTION. Q2: no force is needed to keep a moving object going at a constant speed (Aristotle\'s idea, and the Hook\'s option A). Q3: THE COLLAPSE: a book at rest has weight and a reaction force, and they cancel. Q5: the other face of it: with no forces at all, a probe does NOT slow down; things stop on Earth because friction and air resistance act. Q1 is plainly TRUE (objective 1). Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): a steady speed means a resultant of zero, so the friction equals the pull.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: it was a probe in deep space with the engine off, and the answer was B (Q5 is the same idea again, in other words).\n\n'
    + 'THE CLOSING LINE SAYS WHAT THE NEXT LESSON DOES, BUT THE NEXT LESSON IS NOT WRITTEN DOWN, so I assumed it is the other half of the first law: what happens when the resultant is NOT zero (the scheme\'s next objective, P1.5.1.7, F = ma). CHANGE THE LINE if your next lesson is something else.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

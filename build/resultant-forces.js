/**
 * Y10 Science, Forces, Resultant Forces. Class 10A (Cambridge IGCSE Co-ordinated Sciences 0654). Single, 50 minutes. 'motion' palette
 * (Night Highway), as the other Y10 forces and motion lessons use.
 *
 * DATE: the date the deck was BUILT on (Tuesday 6 October 2026). Change it before you teach.
 *
 * PREVIOUS, per the brief: "reference/Density Practical.pptx". THAT FILE DOES NOT EXIST, and no lesson of that name is anywhere in the
 * repo. The closest are reference/Density.pptx (Matter, 10A) and reference/Float or Sink.pptx (the lesson after it). I read both, and
 * Mass and Weight, Gravitational Fields and Free Fall and Equations of Motion, which are the 10A physics lessons that this one
 * builds on. WHAT I COULD NOT READ is whatever "Density Practical" taught: the Do Now's two "last lesson" questions (Q1, Q2) use density
 * content from Density and Float Or Sink, and should be swapped if that practical covered something else. Nothing here depends
 * on it otherwise: today is a new topic. The lesson number and the unit name ("Forces") are not on file, so the lesson is recorded without
 * a number.
 *
 * SYLLABUS (python3 tools/syllabus.py P1.5): P1.5.1.2 (Effects of forces) "Determine the resultant of two or more forces acting along the same
 * straight line". Its suggested activities name the first two objectives: name as many forces as possible, all measured in newtons; sort them
 * into contact and non-contact (learners confuse air resistance because air is invisible: wave a hand quickly to feel it); and introduce free-body
 * diagrams (that one sits under P1.5.1.6). The three objectives on the slide are YOUR wording, and objective 3 carries its code as you wrote it.
 *
 * THEY FOUND HARD (brief): left blank, so nothing is guessed.
 * AVOID (brief): forces at angles. Every force in this lesson, in the game and on the worksheet is along ONE straight line (left and right, or up and
 * down, and never both in one resultant). The scheme's straw-and-paper-ball activity uses angles, so it is NOT used.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5, Cold Call 6, You Do 14, Mark 3, Plenary 3. I Do 1
 * teaches objective 1 (contact and non-contact). I Do 2 holds objectives 2 AND 3 on one slide, on purpose: you draw a free-body diagram IN ORDER to
 * find the resultant, so the animation builds the diagram one arrow at a time and then adds it up. The We Do is "What should be the correct answer?"
 * (misconceptions, with one row already correct). The You Do is the GAME (Net Force), with the worksheet as the fallback.
 *
 * THE HOOK AND THE NEXT LESSON. The Hook (a car at a steady speed) plants the idea that a steady speed means balanced forces. Today only settles
 * the first half (the forces are balanced, so the resultant is zero); WHY that means a steady speed is Newton's first law, the next lesson.
 *
 * Every number is checked in build/resultant-forces-check.py (sympy), which also reads them back out of the finished deck and worksheet.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('motion');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Tuesday 6 October 2026';
const LESSON = 'Resultant Forces';
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
    ['An object has a density of 8 g/cm³ and a volume of 5 cm³. Find its mass.', '40 g. 8 × 5.'],
    ['Explain why ice floats on water.', 'Ice is less dense than liquid water.'],
    ['Name the unit of force and the unit of mass.', 'Force: the newton (N). Mass: the kilogram (kg).'],
    ['An object has a weight of 29.4 N. Find its mass. Use g = 9.8 N/kg.', '3 kg. 29.4 ÷ 9.8.'],
    ['Name the particles that make up air.', 'Molecules, mostly nitrogen and oxygen.'],
    ['Name as many different forces as you can.', 'Weight, friction, air resistance, tension, upthrust, magnetic force, and more. We sort them today.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'THE PREVIOUS LESSON IS NOT ON FILE. The brief says reference/Density Practical.pptx, and there is no such file. I read Density and Float Or Sink (the two density lessons) and Mass and Weight, Gravitational Fields and Free Fall and Equations of Motion, and checked every question against the Do Nows of the last 10A lessons (Gravitational Fields and Free Fall, Weight and Gravity, Mass and Weight, Density, Float Or Sink, Equations of Motion). Nothing repeats: no "find the density", no "convert g/cm³", no "5 kg, find the weight", and "explain the difference between mass and weight" was dropped because Weight and Gravity already asked it. Q1 and Q2 are the two "last lesson" questions and are DENSITY content, in new shapes (rearrange to find mass; explain why ice floats). If your Density Practical taught something else, swap those two.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q3 and Q4 are earlier in the physics (Mass and Weight: the units of force and mass, which sets up newtons for the whole lesson; a weight turned back into a mass). Q5 is another science (chemistry): air is made of particles, which is what makes air resistance a CONTACT force later. Q6 previews today and is not taught yet: it is the scheme\'s first activity, "name as many different forces as you can", and the class\'s list is what I Do 1 sorts.\n\n'
    + 'Q1: 8 × 5 = 40 g. Q2: ice is less dense than liquid water (about 0.92 g/cm³ against 1.00). Q3: the newton (N) for force and the kilogram (kg) for mass. Make them say it: forces are in newtons. Q4: 29.4 ÷ 9.8 = 3 kg. Q5: nitrogen and oxygen molecules. Q6: take every force they offer, write them on the board (you need the list), and do not sort yet. All forces are measured in newtons: say it.\n\n'
    + 'THEY FOUND HARD: left blank in the brief. Nothing guessed. CHANGE THE DATE before you teach, if the actual lesson falls on a different day.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1 (title: Objectives)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 1, 'light')); pill(s, 'Today', 1, 'light'); title(s, 'Objectives', 'light');
  const GOALS = ['Name forces and sort them into contact and non-contact.', 'Draw a free-body diagram for a simple situation.', 'Determine the resultant of forces along a straight line. (P1.5.1.2)'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Along a straight line, forces that point the same way ', false], ['add', true], [', and forces that point opposite ways ', false], ['subtract', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The earlier lessons gave them weight as a force (W = mg), gravity as a field, and acceleration. Today starts what forces DO. Say "so far you have met forces one at a time. Today, several at once".\n\n'
    + 'THE THREE OBJECTIVES ARE YOUR WORDING. Objective 3 is syllabus P1.5.1.2, which the 0654 scheme of work words as "Determine the resultant of two or more forces acting along the same straight line". Objectives 1 and 2 come from its suggested activities: naming and sorting forces (under P1.5.1.2) and free-body diagrams (under P1.5.1.6).\n\n'
    + 'NEW WORDS: contact force, non-contact force, free-body diagram, resultant force, balanced. ALONG A STRAIGHT LINE IS THE LIMIT OF TODAY. Say it now: "every force today points left or right, or up or down, along ONE line. Forces at angles are for later." The vector work is not in this block.\n\n'
    + 'THE BANNER IS THE METHOD: forces that point the same way add; forces that point opposite ways subtract. Say it twice.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 2, 'light')); pill(s, 'Hook', 2, 'light');
  s.addText('A car drives along a flat road at a steady 20 m/s. What is true about the forces on the car?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('car', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_car' });
  const OPTS = [['A', 'The forward force is bigger than the backward forces. If it were not, the car would slow down.'], ['B', 'The forward force is equal to the backward forces.'], ['C', 'There are no forces on the car, because the speed is steady.']];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 2.30, name: `h${i}` });
    s.addText(k, { x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k` });
    s.addText(txt, { x: x + 0.28, y: BODY_Y + 1.36, w: cw - 0.56, h: 1.40, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `h${i}_t` });
  });
  s.addNotes(
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Show of hands for each, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: I Do 2 settles the half that is today\'s, and the next lesson settles the rest.\n\n'
    + 'ANSWER, FOR YOU: B. At a steady speed the forces on the car are BALANCED: the forward (driving) force equals the backward forces (air resistance and friction), so the RESULTANT force is zero. Expect most votes for A, because "it is moving, so something must be pushing it harder than anything is holding it back" feels obviously right; it is the oldest idea in the subject, and Aristotle held it. C is the other trap: there ARE forces, they cancel. THAT DIFFERENCE, A RESULTANT OF ZERO AGAINST NO FORCES AT ALL, IS THE NEXT LESSON\'S WHOLE POINT, and it is why this lesson only says "balanced".\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md), so do not tell them. Say "write your vote".\n\n'
    + 'DO NOT EXPLAIN YET. Say "by the end of today you will be able to prove which one it is, with a number".'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — contact and non-contact (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Contact and non-contact forces', 'light', { size: 30 });
  const CONTACT = [['road', 'Friction', 'Surfaces rub as they slide.'], ['wind', 'Air resistance', 'Air particles hit the object.'], ['tractor', 'Tension', 'A rope or string pulls.'], ['layers', 'Reaction force', 'A surface pushes back.'], ['ship', 'Upthrust', 'A liquid pushes up.'], ['rocket', 'Push or thrust', 'An engine or a hand pushes.']];
  const NON = [['apple', 'Weight', 'The pull of gravity.'], ['magnet', 'Magnetic force', 'Magnets pull or push.'], ['bolt', 'Electrostatic force', 'Charges pull or push.']];
  const y0 = BODY_Y - 0.10, hh = 0.44;
  const cw = 3.46, g = 0.18, nx = M + 2 * cw + g + 0.40, nw = RIGHT - nx, ch = 1.08, rg = 0.14;
  card(s, { x: M, y: y0, w: 2 * cw + g, h: hh, fill: C.dark, line: C.dark, name: 'ch' });
  s.addText('CONTACT FORCES: the objects touch', { x: M + 0.22, y: y0, w: 2 * cw, h: hh, color: C.accent, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ch_t' });
  card(s, { x: nx, y: y0, w: nw, h: hh, fill: C.dark, line: C.dark, name: 'nh' });
  s.addText('NON-CONTACT: across a gap', { x: nx + 0.22, y: y0, w: nw - 0.3, h: hh, color: C.accent, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'nh_t' });
  const cell = (k, x, y, w, [icon, name, desc]) => {
    card(s, { x, y, w, h: ch, name: k });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + 0.18, y: y + 0.28, w: 0.52, h: 0.52, objectName: `${k}_icon` });
    s.addText(name, { x: x + 0.86, y: y + 0.14, w: w - 1.0, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `${k}_h` });
    s.addText(desc, { x: x + 0.86, y: y + 0.56, w: w - 1.0, h: 0.44, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16, objectName: `${k}_t` });
  };
  CONTACT.forEach((c, i) => cell(`c${i}`, M + (i % 2) * (cw + g), y0 + hh + 0.14 + Math.floor(i / 2) * (ch + rg), cw, c));
  NON.forEach((c, i) => cell(`n${i}`, nx, y0 + hh + 0.14 + i * (ch + rg), nw, c));
  const BY = y0 + hh + 0.14 + 3 * (ch + rg) - 0.02;
  card(s, { x: M, y: BY, w: CW, h: 0.82, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'bn' });
  s.addText([{ text: 'All forces are measured in newtons (N). ', options: { bold: true, color: C.accentInk } }, { text: 'Air resistance is a CONTACT force: you cannot see air, but its particles touch you and push. Magnet and paper clip, no touching: non-contact.', options: {} }], {
    x: M + 0.26, y: BY, w: CW - 0.52, h: 0.82, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'bn_t',
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the contact forces (six cards together), the non-contact forces (three), then the line at the bottom.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. THE TEST IS ONE QUESTION: does it need the two things to TOUCH? If yes, contact. If no, non-contact. FIRST, GO BACK TO THE CLASS\'S OWN LIST from the Do Now (Q6) and sort THEIR forces, before you click: the slide is a check against it. All forces are measured in newtons (the scheme says to reinforce this).\n\n'
    + 'THE CONFUSION THE SCHEME EXPECTS: AIR RESISTANCE. Students call it non-contact because air is invisible. It is a contact force: the air is made of particles (they said "molecules" in the Do Now) that hit the object as it moves. THE DEMONSTRATION IN THE SCHEME COSTS NOTHING: ask them to wave a hand quickly in front of their face and feel the "wind" they make. Then ask "what is touching your hand?" REACTION FORCE is also easy to miss: a table pushes up on a book because the book touches it. UPTHRUST is the force of a liquid on a floating object (the density lessons): contact, because the water touches the object.\n\n'
    + 'THE THREE NON-CONTACT FORCES: weight (gravity pulls without touching: they met gravity as a field), magnetic force and electrostatic force (a rubbed balloon sticks to a wall). If a student offers "gravity", fine: it is the same force as weight, near the Earth. Say so.\n\n'
    + 'THE TWO WORDS FOR PUSHING: a push, or thrust (an engine or a rocket), is a force by contact. TENSION is the pull in a rope, string or cable.\n\n'
    + 'MISCONCEPTIONS. (1) "Weight is a contact force because you can feel it." You feel the reaction force from the floor, not gravity itself. (2) "A force always makes things move." Not today\'s point: today\'s point is that forces ADD, and that is next. (3) "Air resistance is not a force." It is, and it is measured in newtons.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — free-body diagram and resultant (objectives 2 and 3)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 3, 'light')); pill(s, 'I Do', 3, 'light');
  title(s, 'Draw it, then add it up', 'light', { size: 30 });
  const g = 0.30, lw = 5.55, y0 = BODY_Y - 0.14, vh = lw * 540 / 960;
  video(s, 'resultant-forces-fbd', M, y0, lw, vh, 'vid_fbd');
  card(s, { x: M, y: y0 + vh + 0.14, w: lw, h: 1.30, fill: ANS, line: C.accentInk, lineWidth: 1.5, name: 'wx' });
  s.addText([
    { text: 'Up and down: ', options: { bold: true, color: C.accentInk } }, { text: '100 − 100 = 0 N. Balanced.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'Left and right: ', options: { bold: true, color: C.accentInk } }, { text: '80 − 50 = 30 N to the right.', options: { breakLine: true, paraSpaceAfter: 3 } },
    { text: 'The resultant force on the crate is 30 N to the right.', options: { bold: true, color: C.alert } },
  ], { x: M + 0.24, y: y0 + vh + 0.14, w: lw - 0.48, h: 1.30, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'wx_t' });
  const RX = M + lw + g, RW = RIGHT - RX;
  card(s, { x: RX, y: y0, w: RW, h: 2.40, name: 'fb' });
  s.addText('A FREE-BODY DIAGRAM', { x: RX + 0.24, y: y0 + 0.10, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'fb_h' });
  s.addText([
    { text: 'Draw the object as a box.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'One arrow for each force, starting on the box.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'The arrow points the way the force acts.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'A longer arrow is a bigger force.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Label each one: name and size in N.', options: {} },
  ].map((o, i) => ({ text: `${i + 1}.  ${o.text}`, options: o.options })), { x: RX + 0.24, y: y0 + 0.50, w: RW - 0.48, h: 1.84, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'fb_t' });
  card(s, { x: RX, y: y0 + 2.54, w: RW, h: 2.36, name: 'rs' });
  s.addText('THE RESULTANT FORCE', { x: RX + 0.24, y: y0 + 2.64, w: RW - 0.48, h: 0.36, color: C.accentInk, fontFace: F.title, fontSize: 13.5, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'rs_h' });
  s.addText([
    { text: 'The one force that does the job of all of them.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Same direction: add.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Opposite directions: subtract.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'It points the way of the bigger total.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Equal and opposite: balanced. The resultant is 0 N.', options: { bold: true } },
  ], { x: RX + 0.24, y: y0 + 3.04, w: RW - 0.48, h: 1.80, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'rs_t' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the animation (ON CLICK, so say the idea first), the free-body diagram rules, the resultant rules, then the worked example.\n\n'
    + 'OBJECTIVES 2 AND 3 TOGETHER, ON PURPOSE. TEMPLATE.md gives each I Do one objective, but you draw a free-body diagram IN ORDER to find the resultant, so the two are one method and sit on one slide: the animation builds the diagram, then adds it up. Objective 1 had its own slide.\n\n'
    + 'THE ANIMATION (about 22 seconds) builds the diagram for a crate pushed along the floor and PAUSES at every step: the box; weight, down, 100 N; the reaction force from the floor, up, 100 N; the push, right, 80 N; the friction, left, 50 N. A longer arrow is a bigger force (the arrows are drawn to scale). Then the sums: up and down, 100 − 100 = 0 N, balanced; left and right, 80 − 50 = 30 N to the right. Talk over the pauses. You can click it to play it again.\n\n'
    + 'THE FREE-BODY DIAGRAM shows ONLY the forces on the object, as arrows on a box; it does not show forces the object exerts on other things. THE METHOD FOR THE RESULTANT, in this order: (1) sort the arrows into the two directions on the line; (2) add the arrows that point the same way; (3) subtract the smaller total from the bigger; (4) the resultant points the way of the bigger total. Two directions are never mixed: left and right never combine with up and down. EVERY FORCE TODAY IS ALONG ONE STRAIGHT LINE, as the objective says. If a student asks about a diagonal arrow, say that is next term.\n\n'
    + 'THE VERTICAL PAIR IS DELIBERATE, and it is how the lesson answers the Hook. Weight and the reaction force are equal and opposite: 100 − 100 = 0. THEY ARE BOTH STILL THERE. They cancel; the resultant is zero; the forces have not gone. Say it: "no resultant is not no forces". The next lesson is built on that sentence.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY (half of it): the car at a steady speed has a driving force equal to the backward forces, so the resultant is 0 N: B. WHY A ZERO RESULTANT MEANS A STEADY SPEED is Newton\'s first law, next lesson; today only say "balanced".\n\n'
    + 'MISCONCEPTIONS. (1) Adding forces that point opposite ways (80 + 50 = 130): the We Do row 2. (2) Forgetting the vertical pair: a book on a table has TWO forces, not one. (3) Arrow length: it is the size of the force; a bigger force is a longer arrow.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — "What should be the correct answer?"
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 5, 'light')); pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light'); sub(s, 'Spot the mistake. One of these is already right.', 'light');
  const ROWS = [
    ['“Air resistance is not a force, because you cannot see air.”', 'Air is made of particles that hit the object. Air resistance is a contact force, measured in newtons.'],
    ['“A force of 40 N to the right and a force of 25 N to the left give a resultant of 65 N to the right.”', 'Opposite directions: subtract. 40 − 25 = 15 N to the right.'],
    ['“A book resting on a table has only one force on it: its weight.”', 'Two forces: weight down and the reaction force from the table up. Equal and opposite, so the resultant is 0 N.'],
    ['“A force of 30 N to the right and a force of 30 N to the left are balanced. The resultant is 0 N.”', 'Nothing to correct: this one is right. Equal and opposite forces are balanced.'],
  ];
  const rowH = 0.98, gap = 0.16, y0 = BODY_Y + 0.40;
  ROWS.forEach(([wrong, right], i) => {
    const y = y0 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(wrong, { x: M + 0.28, y, w: 5.30, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `wd${i}_q` });
    s.addText(right, { shape: S.roundRect, rectRadius: 0.10, x: M + 5.80, y: y + 0.10, w: CW - 5.80 - 0.14, h: rowH - 0.20, fill: { color: ANS }, line: { color: i === 3 ? C.support : C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 13.5, bold: true, align: 'left', valign: 'middle', margin: 8, lineSpacing: 17, objectName: `wd${i}_a` });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. THE MODE IS "WHAT SHOULD BE THE CORRECT ANSWER?" (TEMPLATE.md): the lesson has sharp misconceptions, so it fits. ONE OF THE FOUR IS ALREADY CORRECT (row 4), so the task is "check this" and not "find a flaw". A student who says "this one is fine" has done better work than one who invents an error: say so when it comes up.\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL, and they say WHAT THE STUDENT DID, not only the right answer.\n\n'
    + 'ROW 1 IS OBJECTIVE 1 AND THE SCHEME\'S OWN EXPECTED CONFUSION: air resistance. The student thinks "invisible" means "not a force". Ask them to wave a hand and feel it. ROW 2 IS OBJECTIVE 3, THE COMMONEST MISTAKE: adding forces that point opposite ways. 40 + 25 = 65 is the sum of the sizes; the resultant is the DIFFERENCE, 15 N, and it points the way of the bigger force, to the right. Ask "what would 65 N mean?" (a bigger force than either: impossible when they oppose). ROW 3 IS OBJECTIVE 2: a book on a table has two forces (weight, and the reaction force from the table), not one. Draw the box and the two arrows. They are equal, so the resultant is zero. THE FORCES HAVE NOT GONE: they cancel. ROW 4 IS ALREADY RIGHT: equal and opposite forces are balanced and the resultant is 0 N. Use it to make the point that "balanced" and "no forces" are different things; the next lesson depends on it.\n\n'
    + 'USE REAL ERRORS where you have them: the class\'s Do Now Q6 list almost certainly contains "gravity" and "friction", and perhaps "speed" or "energy", which are not forces. Say so if they appear.\n\n'
    + 'IF THEY ARE QUICK, ask for a case where two forces are along a line and the resultant is bigger than either (same direction). IF SHORT OF TIME, do rows 2 and 3 only.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light'); PHASES.push(timer(s, 6, 'light')); pill(s, 'Cold Call', 6, 'light');
  qGrid(s, { p: 'c', y0: 1.05, ch: 1.72, gap: 0.16, qh: 0.90, size: 16, asize: 12, qs: [
    ['Name one contact force and one non-contact force.', 'Contact: friction, tension, air resistance. Non-contact: weight, magnetic, electrostatic.'],
    ['Explain why air resistance is a contact force.', 'Air is made of particles. They touch the object and push on it.'],
    ['A book rests on a table. Describe the forces on it, and the resultant.', 'Weight down, reaction force up. Equal and opposite. Resultant 0 N.'],
    ['A car has a driving force of 900 N forwards and resistive forces of 650 N backwards. Find the resultant.', '250 N forwards. 900 − 650.'],
    ['Find the weight of a 4 kg mass. Use g = 9.8 N/kg.', '39.2 N. 4 × 9.8.'],
    ['A car goes from 6 to 18 m/s in 3 s. Find the acceleration.', '4 m/s². (18 − 6) ÷ 3.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards (the scheme suggests miniature whiteboards; this class does not have them, so every answer is spoken). If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (weight, from Mass and Weight) and Q6 (acceleration, from Equations of Motion).\n\n'
    + 'Q1 IS OBJECTIVE 1: one of each, with the test ("does it need to touch?"). Q2 needs "particles" and "touch": "because it is a force" is not an answer. Q3 IS OBJECTIVES 2 AND 3: weight down, reaction force up, equal and opposite, resultant 0 N. If a student says only "weight", ask "what stops the book falling through the table?". Q4 IS THE CALCULATION: 900 − 650 = 250 N forwards. Watch for 1550 N (added), and for a missing direction: a resultant needs a direction. Q5: 4 × 9.8 = 39.2 N. Q6: v = u + at, so a = (18 − 6) ÷ 3 = 4 m/s².\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q3, spend longer on Q4 and ask for a car with a resultant to the BACK (braking). IF SHORT OF TIME, cut Q6.'
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
    ['ROUND 1', 'Forces and arrows', 'Contact or non-contact, and the resultant of two forces on a free-body diagram.'],
    ['ROUND 2', 'Add them up', 'Three or more forces, balanced or not, and a missing force.'],
    ['ROUND 3', 'Beat the game', 'Very hard. Distractors, lifts and tug of war. The last questions are meant to be almost impossible.'],
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
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks: the three rounds, then the note. THE GAME IS NET FORCE ("your call"): sort forces, read free-body diagrams and find the resultant. The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Resultant Forces game" from Google Classroom. Three rounds of six questions. Some are multiple choice and some need a number typed on the on-screen keypad. Most show a free-body diagram drawn to scale: a longer arrow is a bigger force. Each question is a single go: a wrong answer says what the mistake probably was ("you added all the forces", "you left a force out", "right size, wrong way") and shows the working. EVERY STUDENT GETS A DIFFERENT GAME: different forces, numbers and wording, in a different order, so a neighbour\'s answers are no use. The skills and their order are the same for everyone. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. There are no lives and no penalty for being slow.\n\n'
    + 'EVERY FORCE IS ALONG ONE STRAIGHT LINE, BY DESIGN (P1.5.1.2). Where a weight and a reaction force are drawn, they are equal and opposite, and the question says to find the resultant along the HORIZONTAL line. There are no angles anywhere. If a student asks "what if the force is diagonal?", say that is for a later lesson.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1: contact or non-contact, and the resultant of two forces. Round 2: three or more forces, "balanced or not?", and a missing force. Round 3 goes far past the lesson: an odd-one-out, a skydiver at a steady speed (the "no forces" trap is one of the options: the forces have not gone, they cancel), a missing force when the resultant is not zero, and two very hard last questions (a rope with a weight, a tug of war, a parachute, or a missing third force). Expect most of the room to miss some of the last two. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each question took, whether it was right and, for a wrong one, what the student typed and why it is a common mistake. There is a "Stop and see my results" button on every question.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers printed UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which way does each arrow point, and which total is bigger?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
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
    { text: 'Contact forces need the objects to touch. Air resistance, friction and tension are contact. Weight, magnetic and electrostatic are not.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Every arrow on a free-body diagram has a name, a direction and a size in N.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'Same direction: you added. Opposite directions: you subtracted. The answer has a size, a unit and a direction.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'A resultant of 0 N means balanced. It does not mean there are no forces.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 1.86, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. Almost all have exact answers: check the SIZE, the UNIT and the DIRECTION of every resultant. ON THE GAME, the drop-down for each round shows the working for every question.\n\n'
    + 'WALK ROUND for the three commonest mistakes: adding forces that point opposite ways, giving a resultant with no direction, and forgetting the vertical pair (weight and the reaction force).'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark'); PHASES.push(timer(s, 3, 'dark')); pill(s, 'Plenary', 3, 'dark'); title(s, 'True or false?', 'dark');
  const QS = [
    ['Friction is a contact force.', 'TRUE'],
    ['Weight is a contact force, because you can feel it.', 'FALSE'],
    ['Forces of 50 N to the right and 20 N to the left have a resultant of 70 N to the right.', 'FALSE'],
    ['A skydiver falls at a steady speed. The weight is 700 N and the air resistance is 700 N. The resultant force is 0 N.', 'TRUE'],
    ['In a free-body diagram, a longer arrow means a smaller force.', 'FALSE'],
  ];
  const rowH = 0.66, gap = 0.14;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.20 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Next lesson: what does a resultant of zero tell us about how something moves?', { x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next' });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: weight is a NON-contact force (you feel the reaction force from the floor, not gravity itself). Q3: opposite directions SUBTRACT: 50 − 20 = 30 N to the right. Q5: a longer arrow is a BIGGER force. Q1 is plainly TRUE (objective 1). Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one) and it settles the Hook: at a steady speed the forces are balanced, so the resultant is 0 N. If the room splits on Q3, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'THE CLOSING LINE SAYS WHAT THE NEXT LESSON DOES, and the next lesson IS known: you told me it is "When the resultant is zero" (Newton\'s first law). The line asks the question that lesson answers. Do not answer it now.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

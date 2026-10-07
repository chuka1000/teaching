/**
 * Y7 Science, Technology And Society. Class 7B. Single, 50 minutes. Signal palette, carried on from
 * the unit.
 *
 * DATE: the date the deck was BUILT on, not a guessed teaching day. Change it before you teach.
 *
 * PREVIOUS, per the brief: reference/Averages, Graphs, and Models.pptx (the brief wrote the name
 * without the commas; that is the file). Read it. 50 minutes, nine slides. It is Chuka's edited copy:
 * the click builds in it were added by hand, after a build that shipped without them (the cause is
 * fixed: see tools/check-builds.py and lib/guard-raw-write.js). Vocabulary already taught there:
 * mean, range, accuracy (close to the true value) and precision (results close together), bar
 * chart / line graph / pie chart, line of best fit, and MODEL (a simplified idea that explains or
 * predicts: the eclipse-prediction model was its Hook). Its plenary ended "the mean gives the
 * typical result, a graph shows the pattern, and a model predicts" and made no promise for this
 * lesson. Earlier in the unit: independent, dependent and controlled variables, and repeating a
 * test (Fair Tests And Variables, Burning Food).
 *
 * THEY FOUND HARD (brief): left blank, so nothing is guessed. Accuracy versus precision, which the
 * previous lesson flagged, comes back once in the Do Now (Q5) because it is cheap to check.
 *
 * AVOID (brief): Thailand-specific examples only. Every example is global: smallpox eradication,
 * fridges and the ozone layer, mobile phones, a school bag, a fertiliser test.
 *
 * SHAPE, per TEMPLATE.md: ten slides, 50 minutes: Do Now 10, Today 1, Hook 2, I Do 3, I Do 3, We Do 5,
 * Cold Call 6, You Do 14, Mark 3, Plenary 3. The Do Now is spaced (2 last lesson, 2 earlier in the
 * unit, 1 from last term, 1 preview); each I Do teaches ONE objective with a worked example; the We Do
 * is the "Finish this one" mode (the last lesson used spot-the-mistake, and the template says to
 * alternate); the Cold Call has two questions from earlier lessons.
 * The You Do is a scaffolded DESIGN TASK, built as a game ("Technology And Society game"): state a
 * problem, sketch a solution, say how it would be tested, then check the effect on society. The
 * worksheet is the same task on paper, as a fading scaffold: one fully worked example, one
 * half-worked, one blank.
 *
 * OBJECTIVE 3 HAS NO I DO OF ITS OWN (the template gives one objective to each of the two I Do slides).
 * It is taught in the We Do, as three half-worked cause-and-effect chains (the fridge, the mobile
 * phone, the printing press), and drilled in the Cold Call, the game and the Plenary.
 *
 * NOT RESOLVABLE FROM THE FILES: TEMPLATE.md asks for a closing line saying what the NEXT lesson does.
 * The next lesson is not known, so the Plenary repeats the objectives banner instead. Change it
 * once the next lesson is decided.
 *
 * FACTS, checked with a web search: the World Health Assembly declared smallpox eradicated on 8 May
 * 1980 after a vaccination and surveillance campaign (the last natural case was in 1977); CFCs
 * were used in fridges and aerosols, the Montreal Protocol of 1987 phased them out (about 99% gone),
 * and the Antarctic ozone layer is projected to recover by about 2066 (WMO/UNEP 2022).
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('signal');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Monday 5 October 2026';
const LESSON = 'Technology And Society';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'dark') => path.join(__dirname, '..', 'assets', 'icons', `${name}_signal_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y7 Science · Scientific Research and Technology · 7B';

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
    key: 'signal', palette: C, minutes, mode, slideH: H,
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
    ['Four results: 22, 25, 25 and 28. Calculate the mean and the range.', 'Mean 25 (100 ÷ 4). Range 6 (28 − 22).'],
    ['State the best graph to show how many students chose each school lunch.', 'A bar chart. The lunches are categories.'],
    ['A student tests whether a new fertiliser makes plants grow taller. Name the independent variable and the dependent variable.', 'Independent: the fertiliser. Dependent: the plant height.'],
    ['In the same fertiliser test, name two variables that must be kept the same.', 'Any two: water, light, soil, type of plant, pot size.'],
    ['State the difference between a scientific law and a scientific theory.', 'A law says what happens. A theory explains why it happens.'],
    ['Name one invention that has changed how people live. Say what it changed.', 'Any reasonable answer: the phone, the fridge, the car, vaccines.'],
  ] });
  s.addNotes(
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ reference/Averages, Graphs, and Models.pptx (the stated PREVIOUS lesson) and checked every question against the last three Do Nows (Averages, Numbers In Science, Measuring And Recording Honestly). Nothing repeats: standard form, rounding, 3.0 cm against 3.00 cm, "why repeat a test" and accuracy against precision have all been asked recently.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are last lesson (mean, range, choosing a graph) on new numbers and a new context. Q3 and Q4 are earlier in the unit (independent, dependent and controlled variables), both on one fresh example, a fertiliser test, because the design task later asks for exactly this thinking. Q5 is from last term: the difference between a law and a theory (Theory or law?). Q6 previews today and is not taught yet.\n\n'
    + 'Q1: 22 + 25 + 25 + 28 = 100, and 100 ÷ 4 = 25. The range is 28 − 22 = 6. Watch for dividing by 3 (counting 25 once).\n'
    + 'Q3 AND Q4: the independent variable is the fertiliser (the type, or the amount); the dependent variable is how tall the plants grow. Controlled: the water, the light, the soil, the type of plant, the pot size.\n'
    + 'Q5: a law says WHAT happens (the pattern, often as an equation); a theory explains WHY it happens. A theory does not turn into a law when it is proved.\n'
    + 'Q6 IS INTUITIVE. Accept any reasonable answer. It sets up the Hook and the whole lesson.\n\n'
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
  const GOALS = ['Define technology, and say how it differs from science.', 'Outline the technological design process.', 'Describe how technology and society change each other.'];
  const cw = (RIGHT - M - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, { x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body, fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t` });
  });
  sentence(s, [['Technology ', false], ['solves problems', true], [', and technology and society ', false], ['change each other', true], ['.', false]], { y: BODY_Y + 2.58, h: 0.70, size: 17, name: 'obj_banner' });
  s.addNotes(
    'OBJECTIVES. 1 minute. Four clicks.\n\n'
    + 'WHERE THIS SITS. The last lesson ended on models: a simplified idea that predicts. Today is the other half of what scientists do with knowledge: they build things with it. Say "last lesson was about using results to predict. Today is about using knowledge to make something that solves a problem."\n\n'
    + 'THE LESSON IS A DESIGN TASK AT THE END. The You Do is a game on the students\' own devices where each one gets a different design brief, states the problem, sketches a solution and says how they would test it. Tell them now: it is the reason to pay attention for the next half hour.\n\n'
    + 'THE BANNER HAS TWO HALVES: technology solves problems (objectives 1 and 2) and technology and society change each other (objective 3). Point back at each half when you reach it.'
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
  s.addText('Smallpox killed millions of people. In 1980 the world declared it gone for good. What technology did most of the work?', {
    x: M, y: 0.86, w: RIGHT - M - 1.55, h: 1.30, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, lineSpacing: 26, objectName: 'slide_title',
  });
  s.addImage({ path: ICON('syringe', 'accentInk'), x: RIGHT - 1.40, y: 0.90, w: 1.30, h: 1.30, objectName: 'hook_syringe' });
  const OPTS = [['A', 'A new antibiotic'], ['B', 'A vaccine'], ['C', 'Better hospitals']];
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
    + 'ANSWER, FOR YOU: B. The World Health Assembly declared smallpox eradicated on 8 May 1980, after a vaccination and surveillance campaign that began in earnest in 1967. The last natural case was in 1977. It is the only human disease ever eradicated. Expect A to attract votes: antibiotics are the technology students know best. Smallpox is caused by a virus, and antibiotics do not work on viruses.\n\n'
    + 'THE POINT FOR TODAY. A vaccine is technology: knowledge (Jenner\'s observations, later germ theory, which is science) turned into something that solves a problem. But the vaccine alone did not do it. Thousands of health workers, governments agreeing to cooperate, and a way of keeping vaccine cold in hot places did. Technology and society worked together. That is today\'s whole lesson in one story.\n\n'
    + 'DO NOT EXPLAIN YET. Say "a technology that changed what the whole world looks like, and it took people as well as a needle" and move to I Do.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — technology and science (objective 1)
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Technology, and how it differs from science', 'light', { size: 28 });
  const cw = (CW - 0.30) / 2, TY = BODY_Y - 0.06, TH = 1.86;
  const SIDES = [
    ['sci', 'flask', M, 'SCIENCE', [['Asks: ', 'why does this happen?'], ['Makes: ', 'knowledge and explanations.'], ['Judged by: ', 'is it true? What is the evidence?']]],
    ['tech', 'cogs', M + cw + 0.30, 'TECHNOLOGY', [['Asks: ', 'how can we solve this problem?'], ['Makes: ', 'tools, products and methods.'], ['Judged by: ', 'does it work, and is it safe and affordable?']]],
  ];
  SIDES.forEach(([k, icon, x, head, lines]) => {
    card(s, { x, y: TY, w: cw, h: TH, name: k });
    s.addImage({ path: ICON(icon, 'accentInk'), x: x + cw - 0.72, y: TY + 0.16, w: 0.46, h: 0.46, objectName: `${k}_icon` });
    s.addText(head, { x: x + 0.26, y: TY + 0.16, w: cw - 1.1, h: 0.40, color: C.dark, fontFace: F.title, fontSize: 14, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `${k}_h` });
    s.addText(lines.map(([a], i) => [{ text: a, options: { bold: true, color: C.accentInk } }, { text: lines[i][1], options: { breakLine: i < lines.length - 1, paraSpaceAfter: 5 } }]).reduce((acc, r) => acc.concat(r), []), {
      x: x + 0.26, y: TY + 0.66, w: cw - 0.52, h: 1.12, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: `${k}_t`,
    });
  });
  const BY = TY + TH + 0.24;
  card(s, { x: M, y: BY, w: CW, h: 1.74, fill: 'FFF6CC', line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  s.addImage({ path: ICON('syringe', 'accentInk'), x: M + CW - 0.84, y: BY + 0.16, w: 0.52, h: 0.52, objectName: 'ex_icon' });
  s.addText('WORKED EXAMPLE: THE SMALLPOX VACCINE (THE HOOK ANSWER IS B)', { x: M + 0.26, y: BY + 0.14, w: CW - 1.3, h: 0.36, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'ex_h' });
  s.addText([
    { text: 'Science asked: ', options: { bold: true, color: C.accentInk } }, { text: 'why do people catch smallpox? Answer: a virus spreads from person to person.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Technology made: ', options: { bold: true, color: C.accentInk } }, { text: 'a vaccine, a way to make it in large amounts, and a way to keep it cold.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Together: ', options: { bold: true, color: C.accentInk } }, { text: 'science explained the problem, technology solved it, and in 1980 smallpox was declared gone.', options: {} },
  ], { x: M + 0.26, y: BY + 0.56, w: CW - 0.52, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'ex_t' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: science, technology, then the worked example.\n\n'
    + 'OBJECTIVE 1 ONLY, per TEMPLATE.md. Technology is using knowledge, often science, to design tools, products and methods that solve people\'s problems. Science asks "why", technology asks "how can we fix this". The test for science is evidence; the test for technology is "does it work, and is it safe and affordable".\n\n'
    + 'SETTLE THE HOOK NOW, POINTING AT THE TALLY. The answer is B, a vaccine. Say "most of you voted ..." and read the tally off the board. The slide shows why the vaccine is both: science explained how smallpox spreads; technology made the vaccine in large amounts and kept it cold in hot places. Antibiotics (option A) do not work on viruses.\n\n'
    + 'TECHNOLOGY IS NOT JUST GADGETS. This is the commonest misconception and it is the Plenary\'s Q2. The wheel, bread-making, irrigation, a water filter and a vaccine are all technology. Ask "is a pencil technology?" Yes.\n\n'
    + 'THE TWO NEED EACH OTHER, in both directions. Science makes technology possible (knowing about electricity made the bulb possible) and technology makes science possible (telescopes and microscopes let scientists see what nobody had seen). Say it once.\n\n'
    + 'WHERE THE IDEA REAPPEARS: the vaccine example also had thousands of health workers and governments cooperating. That is today\'s third objective, technology and society, and it is the We Do.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — the design process
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'The design process', 'light');
  const STEPS = [
    ['PROBLEM', 'Who needs what?', 'Heavy school bags hurt backs.'],
    ['IDEAS', 'Many ideas. Do not judge yet.', 'Wheels, padded straps, lighter books.'],
    ['DESIGN', 'Choose one. Sketch it. Label the parts.', 'A bag with wheels and a handle.'],
    ['MAKE', 'Build a prototype: a rough first version.', 'Card, string and tape.'],
    ['TEST', 'Try it. Measure how well it works.', 'Pull 5 kg for 100 m. Three students, three times each.'],
    ['IMPROVE', 'Fix what failed. Then test again.', 'The handle is too low. Raise it. Test again.'],
  ];
  const g = 0.14, sw = (CW - 5 * g) / 6, SY = BODY_Y - 0.06, SH = 3.04;
  STEPS.forEach(([name, what, ex], i) => {
    const x = M + i * (sw + g);
    card(s, { x, y: SY, w: sw, h: SH, name: `st${i}` });
    badge(s, { x: x + 0.16, y: SY + 0.16, n: i + 1, name: `st${i}` });
    s.addText(name, { x: x + 0.16, y: SY + 0.66, w: sw - 0.28, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 0.5, valign: 'middle', margin: 0, objectName: `st${i}_h` });
    s.addText(what, { x: x + 0.16, y: SY + 1.06, w: sw - 0.28, h: 0.92, color: C.ink, fontFace: F.body, fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 15.5, objectName: `st${i}_t` });
    s.addText(ex, { x: x + 0.16, y: SY + 2.02, w: sw - 0.28, h: 0.96, color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true, valign: 'top', margin: 0, lineSpacing: 15, objectName: `st${i}_e` });
  });
  const BY = SY + SH + 0.22;
  card(s, { x: M, y: BY, w: CW, h: 0.82, fill: 'FFF6CC', line: C.accentInk, lineWidth: 1.5, name: 'loop' });
  s.addImage({ path: ICON('repeat', 'accentInk'), x: M + 0.24, y: BY + 0.16, w: 0.50, h: 0.50, objectName: 'loop_icon' });
  s.addText([{ text: 'Testing is not the end. ', options: { bold: true } }, { text: 'Improve it, then ', options: {} }, { text: 'test again', options: { bold: true, underline: true } }, { text: ', and go round until it works.', options: {} }], {
    x: M + 0.92, y: BY, w: CW - 1.2, h: 0.82, color: C.dark, fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, objectName: 'loop_t',
  });
  s.addText('Next: you will use steps 1, 3 and 5 in the game, on a brief of your own.', { x: M, y: BY + 0.96, w: CW, h: 0.40, color: C.inkSoft, fontFace: F.body, fontSize: 14, italic: true, valign: 'middle', margin: 0, objectName: 'loop_fwd' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: steps 1 to 3, steps 4 to 6, then the loop line.\n\n'
    + 'OBJECTIVE 2 ONLY, per TEMPLATE.md. The technological design process is a cycle, not a straight line. Walk it with ONE example the whole way, a school bag that is too heavy: the problem (who needs what: students need to carry books without hurting their backs); many ideas; choose one and sketch it with labels; make a prototype (the first rough version, from card and string, not the finished thing); test it with a number (pull 5 kg for 100 m, three students, three times each, so there is a mean); improve it and test again.\n\n'
    + 'THE TWO STEPS THE TASK DEPENDS ON ARE 1 AND 5. A problem statement says what is wrong or needed WITHOUT saying how to fix it ("heavy bags hurt backs", not "make a bag with wheels", which is a solution). A test is fair if it repeats (three times, so you can take a mean) and keeps everything else the same. Both are last lessons\' ideas: variables, repeating and the mean.\n\n'
    + 'THE COMMON MISTAKE IS TO STOP AT MAKE, or to treat the first version as the finished product. Say "the first version is almost never the best version". Engineers call the rough first version a prototype and expect to rebuild it.\n\n'
    + 'THE LINK TO THE YOU DO: the game walks them through steps 1, 3 and 5 on a brief of their own, and then asks the objective 3 question about who is affected.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5 — "Finish this one": objective 3 as three half-worked chains
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What is the missing step?', 'light');
  sub(s, 'Finish this one.', 'light');
  const HEADS = ['SOCIETY\'S NEED', 'TECHNOLOGY', 'HOW SOCIETY CHANGED', 'SOCIETY\'S RESPONSE'];
  /* each cell: [text, null] given, or ['?', answer] missing */
  const ROWS = [
    [['People needed to keep food fresh.'], ['The fridge.'], ['People shop less often and eat more fresh food.'], ['?', 'A law banned the CFC fridge gases (1987), so fridges changed.']],
    [['People wanted to talk while away from home.'], ['?', 'Mobile phones.'], ['?', 'People can bank, read the news and call from almost anywhere.'], ['Governments wrote new rules for mobile banking.']],
    [['Copying books by hand was slow and costly.'], ['?', 'The printing press.'], ['?', 'Books became cheaper, and more people learned to read.'], ['?', 'Some rulers made laws to control what could be printed.']],
  ];
  const g = 0.34, cw = (CW - 3 * g) / 4, HY = BODY_Y + 0.28, RY = BODY_Y + 0.66, rowH = 1.20, rowG = 0.18;
  HEADS.forEach((h, j) => s.addText(h, { x: M + j * (cw + g), y: HY, w: cw, h: 0.30, color: C.inkSoft, fontFace: F.body, fontSize: 11.5, bold: true, charSpacing: 1, align: 'center', valign: 'middle', margin: 0, objectName: `wf_h${j}` }));
  ROWS.forEach((row, i) => {
    const y = RY + i * (rowH + rowG);
    row.forEach((cell, j) => {
      const x = M + j * (cw + g);
      const missing = cell[0] === '?';
      s.addText(missing ? '?' : cell[0], { shape: S.roundRect, rectRadius: 0.10, x, y, w: cw, h: rowH, fill: { color: missing ? 'E3EDF6' : 'FFFFFF' }, line: { color: missing ? C.dark : 'D9C9A8', width: missing ? 1.8 : 1.2, dashType: missing ? 'dash' : 'solid' },
        color: missing ? C.dark : C.ink, fontFace: missing ? F.title : F.body, fontSize: missing ? 26 : 13.5, bold: missing, align: 'center', valign: 'middle', margin: 0.10, lineSpacing: 17, objectName: `wf${i}_${j}_q` });
      if (missing) s.addText(cell[1], { shape: S.roundRect, rectRadius: 0.10, x, y, w: cw, h: rowH, fill: { color: 'FFF6CC' }, line: { color: C.alert, width: 1.5 }, color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: 0.08, lineSpacing: 16, objectName: `wf${i}_${j}_a` });
      if (j < 3) s.addText('\u2192', { x: x + cw, y: y + rowH / 2 - 0.2, w: g, h: 0.4, color: C.accentInk, fontFace: F.body, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `wf${i}_${j}_arrow` });
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Three clicks, one row each. THE MODE IS "FINISH THIS ONE" (TEMPLATE.md): three partly worked chains, and the class supplies the missing steps. The last lesson used spot-the-mistake, and the template says to alternate. THIS IS WHERE OBJECTIVE 3 IS TAUGHT, because the template gives each I Do one objective.\n\n'
    + 'THEY COMMIT BEFORE EACH REVEAL. Ask each table to agree the missing steps and say them, then click. Ask WHAT THEY DID, not just the answer: "how did you know the next step was a law?" Naming the reasoning is the point.\n\n'
    + 'ROW 1, ONE MISSING: the fridge. Technology changed society (people shop less often, eat more fresh food), then the fridge gases (CFCs) damaged the ozone layer, and society changed the technology back: the 1987 Montreal Protocol phased CFCs out (about 99% have gone), and fridges now use other gases. The ozone layer over Antarctica is projected to recover by about 2066. THIS IS A GOOD-NEWS STORY: say so.\n\n'
    + 'ROW 2, TWO MISSING: mobile phones. A need led to the technology, and the technology changed how people bank and get news; governments then wrote rules for mobile banking. Society and technology both moved.\n\n'
    + 'ROW 3, THREE MISSING: the printing press. Only the need is given. Accept any sensible answers; the model answers are on the slide. Rulers and churches did try to control what could be printed.\n\n'
    + 'THE POINT TO LAND: every chain goes both ways. A need shapes the technology, the technology changes society, and society then responds and changes the technology again. If someone says "technology just happens to us", point at the third column and the fourth.'
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
    ['Define technology, and say how it differs from science.', 'Technology uses knowledge to make things that solve problems. Science finds out how and why.'],
    ['A thermometer reads 21.0 °C, 21.1 °C and 20.9 °C in a room that is really 25 °C. Is it accurate, precise, both or neither?', 'Precise, not accurate. Close together, but 4 °C too low.'],
    ['A prototype fails its test. State what happens next in the design process.', 'Improve the design, then test it again.'],
    ['Calculate the mean of 4, 6, 8 and 10.', '7. (4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4.'],
    ['Give one example of technology changing how people live.', 'Any reasonable answer: fridges, phones, vaccines, cars.'],
    ['Give one example of society changing a technology.', 'Any reasonable answer: the ozone law changing fridge gases, or safety laws changing cars.'],
  ] });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q2 (accuracy against precision, from the last two lessons, the one the class found hard) and Q4 (the mean). Q2: the readings are close together (a range of 0.2 °C), so PRECISE; their mean is 21.0 °C and the true value is 25 °C, so they are 4 °C too low: NOT accurate. Q4: 4 + 6 + 8 + 10 = 28, and 28 ÷ 4 = 7.\n\n'
    + 'Q1 IS OBJECTIVE 1 and needs "solve problems" and "knowledge", not just "machines". Q3 IS OBJECTIVE 2: improve it and test again; if a student says "start again", ask "from the beginning, or just the part that failed?" Q5 AND Q6 ARE OBJECTIVE 3, BOTH DIRECTIONS: Q6 is the harder one, society changing technology. If the room has nothing for Q6, give the ozone law and ask for one more. Push for a SPECIFIC example, not "technology gets better".\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, spend longer on Q6. IF SHORT OF TIME, cut Q4.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14 — the design task, as a game
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} game`, { x: M, y: 0.86, w: RIGHT - M - 2.00, h: 1.14, color: C.dark, fontFace: F.title, fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title' });
  s.addText('Open Google Classroom now.', { x: M, y: 2.04, w: RIGHT - M - 2.00, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const STEPS = [
    ['STEP 1', C.alert, 'FBE4E3', 'State the problem', 'Who needs what, and why? Say the problem. Do not say the fix.'],
    ['STEP 2', C.support, 'DDF3E5', 'Sketch a solution', 'Draw your idea. Label three parts and say what each one does.'],
    ['STEP 3', C.accentInk, 'FFF6CC', 'Test it', 'How will you test it? What will you measure? What must stay the same?'],
    ['STEP 4', C.dark, 'DCE8F4', 'Society check', 'Who gains? Who might lose out? How could daily life change?'],
  ];
  const g = 0.22, cw = (CW - 3 * g) / 4;
  STEPS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + g);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.30, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, { x: x + 0.22, y: BODY_Y + 0.60, w: cw - 0.44, h: 0.36, color: col, fontFace: F.body, fontSize: 14, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(subh, { x: x + 0.22, y: BODY_Y + 0.98, w: cw - 0.44, h: 0.36, color: C.dark, fontFace: F.body, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s` });
    s.addText(body, { x: x + 0.22, y: BODY_Y + 1.40, w: cw - 0.44, h: 1.24, color: C.inkSoft, fontFace: F.body, fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16.5, objectName: `t${i}_b` });
  });
  s.addText('Everyone gets a different design brief. Draw on the screen or on paper. Stop and see your results any time. Finished? The worksheet has the same steps.', {
    x: M, y: BODY_Y + 3.06, w: RIGHT - M, h: 0.80, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Five clicks. THE GAME IS A SCAFFOLDED DESIGN TASK ("Technology And Society game"), and the worksheet is the same task on paper, built every time.\n\n'
    + 'WHAT THEY DO. Open the file "Technology And Society game" from Google Classroom. EVERY STUDENT GETS A DIFFERENT DESIGN BRIEF (a person with a problem, and a rule their design must follow, such as "it must work without electricity"). The steps are the same for everyone. They state the problem using a sentence frame, sketch a solution on a drawing pad on the screen (or on paper) and label three parts, write a test plan, and finish with a society check. Along the way there are five short questions with feedback that names the mistake: is this a problem or a solution, which test is fair, and three about technology changing society and society changing technology. The end screen shows their design card and what to practise. Each game has a six-character code, shown on the start and end screens; add #CODE to the file\'s address to see the brief a student had.\n\n'
    + 'THE SCAFFOLD FADES ON PURPOSE. The first step gives the sentence frame; the sketch gives the three labels; the test plan gives the four things a fair test needs. Nothing is graded by the computer: the questions are checks, and the design card is for you to look at. Walk round and read cards over shoulders.\n\n'
    + 'THE WORST MISTAKE TO LOOK FOR: a problem statement that is really a solution ("make a bag with wheels"). The game catches it in the first question, but read their own sentence too.\n\n'
    + 'THE PRINTED WORKSHEET IS THE FALLBACK for anyone whose device will not open the file (an HTML file attached in Google Classroom can be awkward on an iPad: check before relying on it), who finishes early or is absent. It has one fully worked example, one half-worked, and one blank, then the test plan and the society check. Answers are printed UPSIDE DOWN on the last page.\n\n'
    + 'THREE TIERS, THEY CHOOSE (TEMPLATE.md): on the worksheet, Bronze is the problem and the sketch, Silver is the test plan, Gold is the improvement and the society check. In the game everyone does all four steps. AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on the first tier: if Bronze is producing lots of errors, the problem is the I Do, not the student.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that the problem, or the fix?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.'
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
  card(s, { x: M, y: BODY_Y + 0.52, w: CW, h: 1.20, name: 'mk_game' });
  s.addText([{ text: 'Played the game? ', options: { bold: true, color: C.accentInk } }, { text: 'Open \u201CYour five questions\u201D on the last screen. Read what you got wrong, and why.', options: {} }], { x: M + 0.30, y: BODY_Y + 0.52, w: CW - 0.60, h: 1.20, color: C.ink, fontFace: F.body, fontSize: 17, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'mk_game_t' });
  card(s, { x: M, y: BODY_Y + 1.94, w: CW, h: 2.30, name: 'mk_card' });
  s.addText('CHECK YOUR DESIGN AGAINST THIS', { x: M + 0.30, y: BODY_Y + 2.08, w: CW - 0.6, h: 0.34, color: C.dark, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'mk_card_h' });
  s.addText([
    { text: 'My problem statement says who, what and why, and does not say the fix.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'My sketch has three labelled parts, each with a job.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'My test repeats at least 3 times, keeps the rest the same, and says what result means it works.', options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: 'I named who it helps and who it might harm.', options: { bullet: true } },
  ], { x: M + 0.30, y: BODY_Y + 2.50, w: CW - 0.6, h: 1.66, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'mk_card_t' });
  s.addNotes(
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once.\n\n'
    + 'ON THE WORKSHEET the answers are printed UPSIDE DOWN at the foot of the last page. This is a design task, so most answers are "what a good answer contains" with an example, not a single right answer: students tick each of their own against it, and read the model next to theirs. The questions with exact answers are the problem-or-solution question, the mean and range (3 and 2), and the three directions.\n\n'
    + 'ON THE GAME, the five questions have already given feedback one at a time; the end screen\'s "Your five questions" drop-down shows each again with what they wrote and the better answer. They then check their own design card against the four lines on the slide.\n\n'
    + 'WALK ROUND reading cards over shoulders for the commonest mistake: a problem statement that is really a fix.'
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
    ['Technology uses knowledge to design things that solve problems.', 'TRUE'],
    ['Technology means only computers and electronic gadgets.', 'FALSE'],
    ['A student tests their design once, it works, and they say the design is finished.', 'FALSE'],
    ['A test that shows what failed helps you improve the design.', 'TRUE'],
    ['Technology changes society, but society never changes technology.', 'FALSE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, { x: M, y, w: RIGHT - M - 2.10, h: rowH, rectRadius: 0.10, fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg` });
    s.addText(q, { x: M + 0.28, y, w: RIGHT - M - 2.50, h: rowH, color: C.tint, fontFace: F.body, fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q` });
    s.addText(v, { x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent, fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v` });
  });
  s.addText('Technology solves problems, and technology and society change each other.', {
    x: M, y: H - 0.86, w: RIGHT - M, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'Q1 IS OBJECTIVE 1, PLAINLY TRUE. Q2 IS THE MISCONCEPTION AND OBJECTIVE 1: a pencil and a vaccine are technology too. If this splits the room, that is the first five minutes of next lesson, not a footnote.\n\n'
    + 'Q3 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): it is a student, not a definition. One test is not enough (repeat it, take a mean) and testing is not the end (improve it, test again). Q4 IS THE OPPOSITE SIDE: a failed test is useful because it tells you what to improve. Both are objective 2.\n\n'
    + 'Q5 IS OBJECTIVE 3, THE ONE-WAY MISCONCEPTION. Point back at the fridge and the ozone law.\n\n'
    + 'THE CLOSING LINE REPEATS THE OBJECTIVES BANNER. TEMPLATE.md asks for what the NEXT lesson does, and the next lesson is not known, so it is not guessed: CHANGE THIS LINE once you have decided it. If you want to lead on: running a real design task, with a prototype and a measured test, would use everything from the last three lessons (variables, the mean, graphs and models).'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

/**
 * T3 Developing Science (CLIL) — Atoms, Lesson 3.
 * Single, Thursday P3, 50 minutes. Not a double — no break slide.
 *
 * Follows on from reference/Drawing an Atom.pptx (Lesson 2), which already
 * taught nucleus, centre, electron, outside — so today's fresh word budget is
 * just proton and neutron. No TPR gesture exists for location words (Lesson 2
 * used pointing instead); proton/neutron are named things, like atom was in
 * Lesson 1, so they get one proposed gesture each — flagged in the notes as
 * mine to confirm, not fixed.
 *
 * KNOWN GAP: this deck has no timer bar. That was written down at the time
 * as "neither T3 reference deck uses one" — CLAUDE.md has since confirmed
 * that absence was itself the bug lib/timer.js was built to close (CLIL was
 * one of the three palettes that silently shipped with no timer). Adding one
 * now means re-laying every slide for the TIMER_X gutter, which is bigger
 * than this pass's scope — flagged, not fixed, here.
 */
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const THEME = require('../lib/theme');
THEME.usePalette('nucleus');
const { PALETTE: C, F, W, H, M, PILL_Y, PILL_H, TITLE_Y, BODY_Y, CONTENT_W } = THEME;
const FUR = require('../lib/furniture');
const { bg, pill, keywords, title, card, textCard } = FUR;

const LESSON = 'The Nucleus';
const RIGHT = W - M;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = 'The nucleus: protons and neutrons';
pptx.subject = 'T3 Developing Science · CLIL · Atoms · Lesson 3';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

/** One picture-word card: coloured dot icon, the word, syllable split, meaning. */
function wordCard(s, o) {
  card(pptx, s, { x: o.x, y: o.y, w: o.w, h: o.h, objectName: `${o.name}_bg` });
  s.addShape(S.ellipse, {
    x: o.x + 0.30, y: o.y + 0.30, w: 0.62, h: 0.62,
    fill: { color: o.dot }, line: { color: o.dot, width: 0 }, objectName: `${o.name}_icon`,
  });
  s.addText(o.word, {
    x: o.x + 1.10, y: o.y + 0.22, w: o.w - 1.30, h: 0.46, color: C.dark, fontFace: F.title,
    fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `${o.name}_word`,
  });
  s.addText(o.say, {
    x: o.x + 1.10, y: o.y + 0.66, w: o.w - 1.30, h: 0.32, color: C.support, fontFace: F.body,
    fontSize: 13.5, bold: true, italic: true, valign: 'middle', margin: 0, objectName: `${o.name}_say`,
  });
  s.addText(o.meaning, {
    x: o.x + 0.30, y: o.y + 1.06, w: o.w - 0.56, h: o.h - 1.26, color: C.ink, fontFace: F.body,
    fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `${o.name}_meaning`,
  });
}

/**
 * Circle atom, filled centre nucleus, a small cluster of proton/neutron dots.
 * Deliberately not tied to a real element — same "simple model" framing as
 * Lesson 2. `reveal` controls how much is drawn: 'atom' | 'nucleus' | 'full'.
 */
function nucleusDiagram(s, o) {
  const { cx, cy, r, name, reveal } = o;
  s.addShape(S.ellipse, {
    x: cx - r, y: cy - r, w: r * 2, h: r * 2,
    fill: { color: 'FFFFFF' }, line: { color: C.inkSoft, width: 1.6 },
    objectName: `${name}_atom`,
  });
  if (reveal === 'atom') return;

  const nr = r * 0.44;
  s.addShape(S.ellipse, {
    x: cx - nr, y: cy - nr, w: nr * 2, h: nr * 2,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    objectName: `${name}_nucleus`,
  });
  if (reveal === 'nucleus') return;

  const dotR = nr * 0.30;
  const spots = [
    [-0.42, -0.28, 'p'], [0.30, -0.42, 'n'], [-0.06, 0.06, 'p'],
    [0.40, 0.20, 'n'], [-0.46, 0.30, 'p'], [0.08, -0.02, 'n'],
  ];
  spots.forEach(([fx, fy, kind], i) => {
    const colour = kind === 'p' ? C.accent : C.alert;
    s.addShape(S.ellipse, {
      x: cx + fx * nr - dotR, y: cy + fy * nr - dotR, w: dotR * 2, h: dotR * 2,
      fill: { color: colour }, line: { color: colour, width: 0 },
      objectName: `${name}_${kind}${i}`,
    });
  });
}

const PHASES = [];
const phase = (label, mins) => { PHASES.push(mins); return mins; };

/* ================================================================== *
 * 1. TITLE
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  s.addText('ATOMS · LESSON 3', {
    x: M, y: PILL_Y, w: 3.2, h: PILL_H, color: C.support, fontFace: F.body,
    fontSize: 12, bold: true, charSpacing: 1.4, valign: 'middle', margin: 0, objectName: 'kicker',
  });
  s.addText('The nucleus', {
    x: M, y: 1.9, w: CONTENT_W, h: 1.0, color: C.dark, fontFace: F.title,
    fontSize: 46, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText('protons and neutrons', {
    x: M, y: 2.9, w: CONTENT_W, h: 0.5, color: C.inkSoft, fontFace: F.body,
    fontSize: 20, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_sub',
  });
  nucleusDiagram(s, { cx: W / 2, cy: 5.35, r: 1.35, name: 'hero', reveal: 'full' });
  s.addText('One centre. Two small parts.', {
    x: M, y: 6.95, w: CONTENT_W, h: 0.4, color: C.inkSoft, fontFace: F.body,
    fontSize: 14, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_tag',
  });
  s.addNotes(
    'TITLE — 1 minute. No pill; this is the cover.\n\n'
    + 'Read the title slowly. Point to the picture: "This is the atom we drew last lesson. Today: what is in the middle?"\n\n'
    + 'Do not name proton or neutron yet — that is the New Words slide.'
  );
}

/* ================================================================== *
 * 2. TODAY · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'Today', phase('Today', 2), 'light');
  keywords(pptx, s, ['nucleus', 'proton', 'neutron'], 'light');
  title(pptx, s, 'Today', 'light');

  const GOALS = [
    ['Point to the nucleus.', C.dark],
    ['Meet two new words: proton, neutron.', C.accent],
    ['Say: "The nucleus is made of protons and neutrons."', C.alert],
  ];
  const cw = (CONTENT_W - 2 * 0.28) / 3;
  GOALS.forEach(([text, dot], i) => {
    const x = M + i * (cw + 0.28);
    const y = BODY_Y + 0.30;
    card(pptx, s, { x, y, w: cw, h: 2.1, objectName: `g${i}_bg` });
    s.addShape(S.ellipse, {
      x: x + 0.26, y: y + 0.26, w: 0.5, h: 0.5,
      fill: { color: dot }, line: { color: dot, width: 0 }, objectName: `g${i}_dot`,
    });
    s.addText(String(i + 1), {
      x: x + 0.26, y: y + 0.26, w: 0.5, h: 0.5, color: 'FFFFFF', fontFace: F.title,
      fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `g${i}_n`,
    });
    s.addText(text, {
      x: x + 0.26, y: y + 0.94, w: cw - 0.52, h: 1.0, color: C.ink, fontFace: F.body,
      fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `g${i}_t`,
    });
  });
  s.addText('The nucleus is not empty. Today we find out what is inside it.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: BODY_Y + 2.62, w: CONTENT_W, h: 0.7,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true,
    align: 'center', valign: 'middle', margin: 0, objectName: 'obj_banner',
  });
  s.addNotes(
    'TODAY — 2 minutes. Four clicks.\n\n'
    + 'Read each goal, class repeats the key words only (nucleus, proton, neutron) — not the whole sentence yet.\n\n'
    + 'THE BANNER MATTERS: it is the hook question restated as a promise. Do not answer it here.'
  );
}

/* ================================================================== *
 * 3. DO NOW · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'Do Now', phase('Do Now', 6), 'light');
  keywords(pptx, s, ['atom', 'centre', 'outside', 'nucleus', 'electron'], 'light');
  title(pptx, s, 'Answer first. Then we check.', 'light');

  const QS = [
    ['Is an atom tiny?', 'Yes.'],
    ['Is the nucleus the centre or the outside of the atom?', 'The centre.'],
    ['Are electrons in the centre or outside?', 'Outside.'],
    ['Say this word: nucleus.', 'NEW-clee-us'],
    ['Complete: "The nucleus is in the ___ of the atom."', 'centre'],
  ];
  const rowH = 0.78, gap = 0.14;
  QS.forEach(([q, a], i) => {
    const y = BODY_Y + 0.10 + i * (rowH + gap);
    card(pptx, s, { x: M, y, w: CONTENT_W, h: rowH, objectName: `d${i}_bg` });
    s.addText(String(i + 1), {
      x: M + 0.22, y, w: 0.44, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 17,
      bold: true, valign: 'middle', margin: 0, objectName: `d${i}_n`,
    });
    s.addText(q, {
      x: M + 0.74, y, w: 7.6, h: rowH, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.09,
      x: M + 8.5, y: y + 0.13, w: CONTENT_W - 8.5 - 0.10, h: rowH - 0.26,
      fill: { color: 'FDF3DC' }, line: { color: C.accent, width: 1.2 },
      color: C.dark, fontFace: F.body, fontSize: 14.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW — 6 minutes. One extra minute today, spent on Q4.\n\n'
    + 'Q1-Q3 are yes/no and either/or — closed, no open questions yet.\n\n'
    + 'Q4 IS THE ONE THAT MATTERS. Nucleus and electron were hard last lesson — both are three beats with the stress NOT on the first syllable, unlike atom/matter/tiny/part. Model it slowly first: NEW-clee-us. Whole class. Half the class. Three individuals. Do not rush past this even though it is retrieval, not new content.\n\n'
    + 'Q5 sets up today: they already know the answer is "centre" — today adds what is IN that centre.'
  );
}

/* ================================================================== *
 * 4. HOOK · 4
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'Hook', phase('Hook', 4), 'light');
  keywords(pptx, s, ['nucleus'], 'light');
  s.addText('What is inside the nucleus?', {
    x: M, y: 0.98, w: CONTENT_W, h: 0.9, color: C.dark, fontFace: F.title, fontSize: 32,
    bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
  });
  s.addText('The nucleus is not empty.', {
    x: M, y: 1.88, w: CONTENT_W, h: 0.42, color: C.inkSoft, fontFace: F.body, fontSize: 17,
    valign: 'middle', margin: 0, objectName: 'slide_sub',
  });

  const OPTS = [['A', 'Nothing'], ['B', 'Smaller parts'], ['C', 'Another atom']];
  const cw = (CONTENT_W - 2 * 0.28) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.28);
    card(pptx, s, { x, y: BODY_Y + 0.60, w: cw, h: 1.6, objectName: `h${i}_bg` });
    s.addText(k, {
      x: x + 0.26, y: BODY_Y + 0.82, w: 0.6, h: 0.5, color: C.alert, fontFace: F.title,
      fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.26, y: BODY_Y + 1.36, w: cw - 0.52, h: 0.6, color: C.dark, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK — 4 minutes. Four clicks: the question, then A/B/C.\n\n'
    + 'Vote with hands. Tally on the board. Do not reveal the answer — I Do answers it.\n\n'
    + 'ANSWER (do not say yet): B, smaller parts.\n\n'
    + 'Point back to this tally after I Do slide 6.'
  );
}

/* ================================================================== *
 * 5. NEW WORDS · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'New Words', phase('New Words', 5), 'light');
  title(pptx, s, 'New words', 'light');

  const cw = (CONTENT_W - 0.30) / 2;
  wordCard(s, {
    x: M, y: BODY_Y + 0.20, w: cw, h: 2.3, name: 'w0', dot: C.accent,
    word: 'proton', say: 'PRO-ton',
    meaning: 'A small part inside the nucleus.',
  });
  wordCard(s, {
    x: M + cw + 0.30, y: BODY_Y + 0.20, w: cw, h: 2.3, name: 'w1', dot: C.alert,
    word: 'neutron', say: 'NEW-tron',
    meaning: 'Another small part inside the nucleus.',
  });
  s.addNotes(
    'NEW WORDS — 5 minutes. Two clicks, one card each. FULL DRILL ON BOTH: you say it, whole class, half the class, three individuals, then point at the picture and say it alone. Thirty seconds each.\n\n'
    + 'PROTON: two beats, stress on PRO — the same front-stress pattern as atom, matter, tiny, part. Should land easier than nucleus did.\n\n'
    + 'NEUTRON: two beats, stress on NEW. WATCH THIS ONE — it starts with the same sound as nucleus. Say the pair side by side once: "nucleus... neutron" and point out they are different words before drilling neutron on its own.\n\n'
    + 'GESTURE (proposed — confirm or change it in the room, this was not agreed with the class): proton = thumbs up. neutron = flat palm, held level. No gesture is fixed here the way atom/tiny/part/made-of were in Lesson 1; pick these or your own before teaching.\n\n'
    + 'CHECK, pointing at each dot: "Proton or neutron?" Either/or only, no open questions yet.'
  );
}

/* ================================================================== *
 * 6. I DO · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'I Do', phase('I Do', 6), 'light');
  keywords(pptx, s, ['nucleus', 'proton', 'neutron'], 'light');
  title(pptx, s, 'The nucleus is made of protons and neutrons', 'light', { fontSize: 26 });

  nucleusDiagram(s, { cx: 3.2, cy: 5.5, r: 1.55, name: 'ido', reveal: 'full' });
  s.addText('proton', {
    x: 4.95, y: 4.55, w: 1.9, h: 0.4, color: C.accentInk, fontFace: F.body, fontSize: 15,
    bold: true, valign: 'middle', margin: 0, objectName: 'ido_plabel',
  });
  s.addText('neutron', {
    x: 4.95, y: 5.0, w: 1.9, h: 0.4, color: C.alert, fontFace: F.body, fontSize: 15,
    bold: true, valign: 'middle', margin: 0, objectName: 'ido_nlabel',
  });

  const STEPS = [
    ['1', 'This is the atom.', 'One big circle — same as last lesson.'],
    ['2', 'This is the nucleus.', 'The centre. We already know this.'],
    ['3', 'The nucleus is made of protons and neutrons.', 'Small parts, packed into the centre.'],
  ];
  const tx = 7.1;
  STEPS.forEach(([n, eq, note], i) => {
    const y = BODY_Y + 0.30 + i * 1.15;
    card(pptx, s, { x: tx, y, w: RIGHT - tx, h: 1.0, objectName: `i${i}_bg` });
    s.addText(n, {
      x: tx + 0.22, y, w: 0.34, h: 1.0, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `i${i}_n`,
    });
    s.addText(eq, {
      x: tx + 0.64, y: y + 0.10, w: RIGHT - tx - 0.88, h: 0.5, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `i${i}_e`,
    });
    s.addText(note, {
      x: tx + 0.64, y: y + 0.62, w: RIGHT - tx - 0.88, h: 0.34, color: C.inkSoft, fontFace: F.body,
      fontSize: 12.5, valign: 'middle', margin: 0, objectName: `i${i}_t`,
    });
  });
  s.addNotes(
    'I DO — 6 minutes. Model drawing live: circle, then centre, then the dots.\n\n'
    + 'Click 1: the atom circle. Click 2: the nucleus. Click 3: the protons and neutrons together, as one reveal — do not separate the colours yet, that is We Do.\n\n'
    + 'SAY THE FULL SENTENCE and point at the picture as you say each part: "The nucleus... is made of... protons and neutrons."\n\n'
    + 'THIS ANSWERS THE HOOK. Go back to the tally: B was right.\n\n'
    + 'MISCONCEPTION: this is still a simple model, not to scale and not a real element. Say so if asked "how many protons does an atom have" — that is a later lesson.'
  );
}

/* ================================================================== *
 * 7. WE DO · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'We Do', phase('We Do', 5), 'light');
  title(pptx, s, 'Build one together', 'light');

  nucleusDiagram(s, { cx: 3.2, cy: 5.3, r: 1.5, name: 'wedo', reveal: 'full' });

  const STEPS = [
    ['Where are the protons?', '"In the nucleus."'],
    ['Where are the neutrons?', '"In the nucleus."'],
    ['Say the whole sentence.', '"The nucleus is made of protons and neutrons."'],
  ];
  const tx = 7.1;
  STEPS.forEach(([q, a], i) => {
    const y = BODY_Y + 0.40 + i * 1.2;
    card(pptx, s, { x: tx, y, w: RIGHT - tx, h: 1.0, objectName: `wd${i}_bg` });
    s.addText(q, {
      x: tx + 0.26, y: y + 0.10, w: RIGHT - tx - 0.52, h: 0.42, color: C.ink, fontFace: F.body,
      fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `wd${i}_q`,
    });
    s.addText(a, {
      x: tx + 0.26, y: y + 0.52, w: RIGHT - tx - 0.52, h: 0.4, color: C.support, fontFace: F.body,
      fontSize: 14.5, italic: true, valign: 'middle', margin: 0, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO — 5 minutes. Class builds with you, chanting each fragment.\n\n'
    + 'Click 1: circle. Click 2: nucleus. Click 3: dots. Then the two call-and-response questions, then the full sentence together.\n\n'
    + 'CHECK: ask two or three individuals to repeat the full sentence alone before moving on.'
  );
}

/* ================================================================== *
 * 8. ACTIVITY · 9
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'Activity', phase('Activity', 9), 'light');
  title(pptx, s, 'Build the nucleus', 'light');

  const STEPS = [
    ['1', 'Build', 'Place small circles into the nucleus outline: one colour for protons, one for neutrons.'],
    ['2', 'Point', 'Point to a proton. Point to a neutron.'],
    ['3', 'Say', '"The nucleus is made of protons and neutrons."'],
  ];
  const cw = (CONTENT_W - 2 * 0.28) / 3;
  STEPS.forEach(([n, head, body], i) => {
    const x = M + i * (cw + 0.28);
    card(pptx, s, { x, y: BODY_Y + 0.30, w: cw, h: 2.5, objectName: `a${i}_bg` });
    s.addText(n, {
      x: x + 0.24, y: BODY_Y + 0.48, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `a${i}_n`,
    });
    s.addText(head, {
      x: x + 0.24, y: BODY_Y + 1.06, w: cw - 0.48, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `a${i}_h`,
    });
    s.addText(body, {
      x: x + 0.24, y: BODY_Y + 1.54, w: cw - 0.48, h: 1.1, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 19, objectName: `a${i}_b`,
    });
  });
  s.addText('Partner routine: build, then point, then say.', {
    x: M, y: BODY_Y + 2.98, w: CONTENT_W, h: 0.42, color: C.dark, fontFace: F.body,
    fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: 'a_note',
  });
  s.addNotes(
    'ACTIVITY — 9 minutes. Pairs. Counters or drawn dots, not the model kits — those are saved for Lesson 4\'s practical, so today does not spend that novelty early.\n\n'
    + 'ROUTINE: build, point, say — same order Lesson 2 used for the model-kit activity, so the pattern is already familiar.\n\n'
    + 'Teacher oral check starts here: circulate and ask "Point to a proton" / "Point to a neutron" of individual students.\n\n'
    + 'WATCH FOR: students placing protons and neutrons outside the nucleus circle, or drawing only one colour. Both mean "made of" has not landed yet — go back to I Do with that pair.'
  );
}

/* ================================================================== *
 * 9. YOU DO · 9
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  pill(pptx, s, 'You Do', phase('You Do', 9), 'light');
  title(pptx, s, 'Your worksheet', 'light');

  const STEPS = [
    ['A', 'DRAW', 'Draw a simple atom with a nucleus.'],
    ['B', 'COLOUR + LABEL', 'Colour the protons and neutrons. Label: nucleus, proton, neutron.'],
    ['C', 'SAY', 'Point and say: "The nucleus is made of protons and neutrons."'],
  ];
  const rowH = 0.86, gap = 0.18;
  STEPS.forEach(([k, head, body], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    card(pptx, s, { x: M, y, w: CONTENT_W, h: rowH, objectName: `y${i}_bg` });
    s.addText(k, {
      x: M + 0.24, y, w: 0.5, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 22,
      bold: true, valign: 'middle', margin: 0, objectName: `y${i}_k`,
    });
    s.addText(head, {
      x: M + 0.86, y: y + 0.10, w: 2.6, h: 0.4, color: C.dark, fontFace: F.body, fontSize: 15,
      bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `y${i}_h`,
    });
    s.addText(body, {
      x: M + 0.86, y: y + 0.42, w: CONTENT_W - 1.1, h: 0.4, color: C.inkSoft, fontFace: F.body,
      fontSize: 13.5, valign: 'middle', margin: 0, objectName: `y${i}_b`,
    });
  });
  s.addNotes(
    'YOU DO — 9 minutes. Hand out worksheet.\n\n'
    + 'Circulate with one question: "Point to the nucleus. Now say the sentence."\n\n'
    + 'SUCCESS CRITERION: correct locations (dots inside the nucleus) and the full sentence, not just the words in isolation.\n\n'
    + 'FAST FINISHERS: draw a second atom and label it without the word bank.\n\n'
    + 'AT 2 MINUTES REMAINING, stop them. Plenary checks it together.'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  pill(pptx, s, 'Plenary', phase('Plenary', 3), 'dark');
  title(pptx, s, 'Point and say', 'dark');

  const STEPS = ['Point to the nucleus.', 'Point to a proton.', 'Point to a neutron.', 'Say the sentence.'];
  const rowH = 0.66, gap = 0.16;
  STEPS.forEach((txt, i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: CONTENT_W - 2.0, h: rowH, rectRadius: 0.1,
      fill: { color: '1B4A63' }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
    });
    s.addText(String(i + 1), {
      x: M + 0.2, y, w: 0.4, h: rowH, color: C.accent, fontFace: F.title, fontSize: 16,
      bold: true, valign: 'middle', margin: 0, objectName: `p${i}_n`,
    });
    s.addText(txt, {
      x: M + 0.64, y, w: CONTENT_W - 2.7, h: rowH, color: C.tint, fontFace: F.body,
      fontSize: 15.5, valign: 'middle', margin: 0, objectName: `p${i}_t`,
    });
  });
  s.addText('The nucleus is made of protons and neutrons.', {
    x: M, y: BODY_Y + 0.30 + 4 * (rowH + gap) + 0.1, w: CONTENT_W, h: 0.5,
    color: C.accent, fontFace: F.body, fontSize: 16, bold: true, italic: true,
    valign: 'middle', margin: 0, objectName: 'pl_sentence',
  });
  s.addText('Next lesson: we build a real model.', {
    x: M, y: H - 0.7, w: CONTENT_W, h: 0.42, color: C.tintDeep, fontFace: F.body,
    fontSize: 13.5, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY — 3 minutes. Six clicks: four pointing prompts, then the sentence, then the closing line.\n\n'
    + 'Pairs do the pointing round first — every student points before anyone speaks, same order as the whole unit.\n\n'
    + 'WATCH: nucleus/proton mix-ups — some will point to the whole centre for both. Recast once: "the nucleus is the whole centre; a proton is one part inside it."\n\n'
    + 'THE PROMISE: Lesson 4 is the model-kit practical, after the 7-day gap. It opens with heavy retrieval of today\'s two words before anything new — plan that lesson expecting proton and neutron to need re-drilling, the way nucleus did today.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', 1 + PHASES.reduce((a, b) => a + b, 0), 'min (incl. 1 for title)');
});

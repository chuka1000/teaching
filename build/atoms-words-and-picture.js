/**
 * T3 Developing Science (CLIL) — Atoms: the words and the picture.
 * Single, Week 2 Thursday P3, 50 minutes. A REVISION lesson after the 7-day
 * gap: it revises Atoms 1 (Atoms.pptx), Atoms 2 (Drawing an Atom.pptx) and
 * Atoms 3 (The nucleus.pptx). CLIL shape, not the 10-phase archetype.
 *
 * AVOID, per the brief: any new vocabulary, any picture they have not seen.
 * So every picture here is one of theirs: the L1 icons and the L2 pictures are
 * copied out of the reference decks by tools/extract-atoms-assets.py into
 * assets/atoms/, and the two atom drawings are rebuilt in the same style as
 * Drawing an Atom (circle, yellow centre, green electrons) and The nucleus
 * (dark nucleus, yellow proton and rose neutron dots). The two drawings are
 * kept SEPARATE on purpose: joining them would be a picture nobody has seen.
 * Words used on screen were checked against those three decks; "revision" is
 * deliberately not on any student-facing slide.
 *
 * THEY FOUND HARD, from the brief:
 *  - pronunciation of electron and nucleus  -> slides 4 and 5 drill both
 *    with a clap-the-beats routine and get the biggest word-slide budget;
 *  - how to use 'part' and 'matter', and the difference between them and
 *    between atom / atoms -> slide 6 is one slide about exactly that.
 *
 * No timer existed on any earlier T3 deck (the known gap CLAUDE.md records);
 * this one has it on every slide, as CLIL.md requires.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('nucleus');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 1 October 2026';
const LESSON = 'Atoms The Words And The Picture';
const IMG = (n) => path.join(__dirname, '..', 'assets', 'atoms', n);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const GREEN = '2E8B57'; // the electron dots and "outside" label in Drawing an Atom

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = 'Atoms: the words and the picture';
pptx.subject = 'T3 Developing Science · CLIL · Atoms · words, picture, sentences';

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
    key: 'nucleus', palette: C, minutes, mode, slideH: H,
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
function keywords(slide, words, mode) {
  slide.addText(words.join('   ·   '), {
    x: RIGHT - 6.4, y: PILL_Y, w: 6.4, h: PILL_H,
    color: mode === 'dark' ? C.accent : C.support, fontFace: F.body, fontSize: 11.5,
    bold: true, italic: true, align: 'right', valign: 'middle', margin: 0, objectName: 'keyword_strip',
  });
}
const title = (slide, text, mode, size = 32) => slide.addText(text, {
  x: M, y: TITLE_Y, w: CW, h: 0.80, color: mode === 'dark' ? C.tint : C.dark,
  fontFace: F.title, fontSize: size, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.12,
    fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || C.tintDeep, width: o.lineWidth || 1.3 },
    objectName: `${o.name}_bg`,
  });
}

/** Read a PNG's pixel size from its header, so pictures keep their shape. */
function pngSize(file) {
  const b = fs.readFileSync(file);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
/** Place a picture inside a box, centred, keeping its proportions. */
function fit(slide, file, x, y, bw, bh, name) {
  const [iw, ih] = pngSize(IMG(file));
  const k = Math.min(bw / iw, bh / ih);
  const w = iw * k, h = ih * k;
  slide.addImage({ path: IMG(file), x: x + (bw - w) / 2, y: y + (bh - h) / 2, w, h, objectName: name });
}

/**
 * The atom as Drawing an Atom drew it: a circle, a yellow centre, green
 * electrons on the edge, and "outside" written in the area around the centre.
 */
function atomDiagram(slide, o) {
  const { cx, cy, r, name, dark } = o;
  slide.addShape(S.ellipse, {
    x: cx - r, y: cy - r, w: 2 * r, h: 2 * r,
    fill: { color: dark ? '174A67' : 'EDF5F8' }, line: { color: dark ? 'DCE7EE' : C.dark, width: 1.6 },
    objectName: `${name}_ring`,
  });
  const cr = r * 0.30;
  slide.addShape(S.ellipse, {
    x: cx - cr, y: cy - cr, w: 2 * cr, h: 2 * cr,
    fill: { color: C.accent }, line: { color: dark ? C.accent : C.dark, width: 1.2 },
    objectName: `${name}_centre`,
  });
  slide.addText('centre', {
    x: cx - cr, y: cy - cr, w: 2 * cr, h: 2 * cr, color: C.dark, fontFace: F.body, fontSize: 14,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${name}_centre_t`,
  });
  slide.addText('outside', {
    x: cx - 0.9 + r * 0.12, y: cy + r * 0.56, w: 1.8, h: 0.4, color: dark ? C.accent : GREEN,
    fontFace: F.body, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0,
    objectName: `${name}_outside_t`,
  });
  [-58, 18, 140, 212].forEach((deg, i) => {
    const a = (deg * Math.PI) / 180, er = r * 0.07;
    slide.addShape(S.ellipse, {
      x: cx + r * Math.cos(a) - er, y: cy + r * Math.sin(a) - er, w: 2 * er, h: 2 * er,
      fill: { color: dark ? 'FFFFFF' : GREEN }, line: { color: dark ? 'FFFFFF' : GREEN, width: 0 },
      objectName: `${name}_e${i}`,
    });
  });
}

/** The atom as The nucleus drew it: dark nucleus, yellow protons, rose neutrons. */
function nucleusDiagram(slide, o) {
  const { cx, cy, r, name } = o;
  slide.addShape(S.ellipse, {
    x: cx - r, y: cy - r, w: 2 * r, h: 2 * r,
    fill: { color: 'FFFFFF' }, line: { color: C.inkSoft, width: 1.6 }, objectName: `${name}_atom`,
  });
  const nr = r * 0.44;
  slide.addShape(S.ellipse, {
    x: cx - nr, y: cy - nr, w: 2 * nr, h: 2 * nr,
    fill: { color: C.dark }, line: { color: C.dark, width: 0 }, objectName: `${name}_nucleus`,
  });
  const dr = nr * 0.30;
  [[-0.42, -0.28, 'p'], [0.30, -0.42, 'n'], [-0.06, 0.06, 'p'], [0.40, 0.20, 'n'], [-0.46, 0.30, 'p'], [0.08, -0.02, 'n']]
    .forEach(([fx, fy, kind], i) => {
      const colour = kind === 'p' ? C.accent : C.alert;
      slide.addShape(S.ellipse, {
        x: cx + fx * nr - dr, y: cy + fy * nr - dr, w: 2 * dr, h: 2 * dr,
        fill: { color: colour }, line: { color: colour, width: 0 }, objectName: `${name}_${kind}${i}`,
      });
    });
}

const PHASES = [];

/* ================================================================== *
 * 1. TITLE · 1
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 1, 'dark'));
  s.addText('ATOMS', {
    x: M, y: PILL_Y, w: 3, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true,
    charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker',
  });
  s.addText(DATE, {
    x: RIGHT - 3.6, y: PILL_Y, w: 3.6, h: PILL_H, color: C.tintDeep, fontFace: F.body, fontSize: 13,
    align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addText('Atoms:\nthe words and\nthe picture', {
    x: M, y: 1.75, w: 6.6, h: 2.5, color: C.tint, fontFace: F.title, fontSize: 40, bold: true,
    valign: 'top', margin: 0, lineSpacing: 50, objectName: 'lesson_title',
  });
  s.addText('Words. Picture. Sentences.', {
    x: M, y: 4.55, w: 6.6, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 22, bold: true,
    valign: 'middle', margin: 0, objectName: 'lesson_sub',
  });
  atomDiagram(s, { cx: 10.15, cy: 4.05, r: 2.1, name: 'hero', dark: true });
  s.addNotes(
    'TITLE. 1 minute. No English needed.\n\n'
    + 'READ THE TITLE slowly, pointing at each line. The class reads it with you, then again without you.\n\n'
    + 'THIS LESSON COMES AFTER THE 7-DAY GAP AND ITS JOB IS TO GET THE WORDS BACK. Nothing here is new: no new word, no new picture. Every picture on every slide was in Atoms 1, Drawing an Atom or The Nucleus. If a student says "I have not seen this", that is a fault in the deck, not in the student.\n\n'
    + 'Point at the atom picture and say: "This is the atom we drew." Do not name the parts yet. That is the next ten minutes.\n\n'
    + 'GESTURES, fixed in Atoms 1 and kept all unit: atom = fingers circling. tiny = finger and thumb pinched together. part = chop one hand into the other palm. made of = hands building. Use them from the first minute today, they are the fastest way to get a word back.\n\n'
    + 'CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Today', 2, 'light');
  title(s, 'Today', 'light');

  const GOALS = [['eye.png', 'Match the words to the pictures.'], ['atom_green.png', 'Draw an atom. Label the centre and the outside.'], ['pencil.png', 'Write the sentences.']];
  const cw = (CW - 2 * 0.30) / 3;
  GOALS.forEach(([img, text], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.25;
    card(s, { x, y, w: cw, h: 3.5, name: `o${i}` });
    s.addText(String(i + 1), {
      x: x + 0.24, y: y + 0.18, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24,
      bold: true, valign: 'middle', margin: 0, objectName: `o${i}_num`,
    });
    s.addImage({ path: IMG(img), x: x + cw / 2 - 0.55, y: y + 0.42, w: 1.1, h: 1.1, objectName: `o${i}_img` });
    s.addText(text, {
      x: x + 0.28, y: y + 1.85, w: cw - 0.56, h: 1.4, color: C.ink, fontFace: F.body, fontSize: 17,
      bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 22, objectName: `o${i}_t`,
    });
  });
  s.addNotes(
    'TODAY. 2 minutes. Three clicks.\n\n'
    + 'Read each goal, the class repeats the key words only: "match", "draw", "write". Do the action with each one: point at a picture, draw a circle in the air, write in the air.\n\n'
    + 'THIS IS THE ORDER OF THE LESSON. Goal 1 is the next 12 minutes (words and pictures). Goal 2 is the drawing. Goal 3 is the sentences, said first and written on the worksheet.\n\n'
    + 'DO NOT READ LONG OBJECTIVES OUT. Three pictures, three short lines, move on.'
  );
}

/* ================================================================== *
 * word slides: pictures first, then the word, on a click
 * ================================================================== */
function wordSlide(o) {
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, o.mins, 'light'));
  pill(s, 'Look and say', o.mins, 'light');
  keywords(s, o.cards.map((c) => c.word), 'light');
  title(s, 'Say the words', 'light');
  const n = o.cards.length, gap = 0.24, cw = (CW - (n - 1) * gap) / n, y = BODY_Y - 0.02, ch = 4.55;
  o.cards.forEach((c, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y, w: cw, h: ch, name: `w${i}` });
    fit(s, c.img, x + 0.25, y + 0.28, cw - 0.5, 1.95, `w${i}_img`);
    s.addText(c.word, {
      x: x + 0.1, y: y + 2.42, w: cw - 0.2, h: 0.62, color: C.dark, fontFace: F.title, fontSize: 30,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_word`,
    });
    s.addText(c.say, {
      x: x + 0.1, y: y + 3.05, w: cw - 0.2, h: 0.36, color: C.support, fontFace: F.body, fontSize: 15,
      bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_say`,
    });
    s.addText(c.meaning, {
      x: x + 0.2, y: y + 3.46, w: cw - 0.4, h: 0.9, color: C.ink, fontFace: F.body, fontSize: 14,
      align: 'center', valign: 'top', margin: 0, lineSpacing: 18, objectName: `w${i}_mean`,
    });
    s.addImage({ path: IMG('speech_yellow.png'), x: x + cw / 2 - 0.2, y: y + ch - 0.56, w: 0.4, h: 0.4, objectName: `w${i}_bubble` });
  });
  s.addNotes(o.notes);
  return s;
}

/* 3. LOOK AND SAY · Atoms 1 words · 4 */
wordSlide({
  mins: 4,
  cards: [
    { img: 'atom_green.png', word: 'atom', say: 'A-tom', meaning: 'A very, very small part.' },
    { img: 'matter.png', word: 'matter', say: 'MAT-ter', meaning: 'Anything you can touch.' },
    { img: 'tiny.png', word: 'tiny', say: 'TY-nee', meaning: 'Very, very small.' },
    { img: 'part.png', word: 'part', say: 'PART', meaning: 'One piece of something.' },
  ],
  notes:
    'LOOK AND SAY, ATOMS 1 WORDS. 4 minutes. Four clicks, one word each.\n\n'
    + 'THE ORDER MATTERS. The picture is on screen and the word is hidden. Point at the picture and WAIT. Let them try to say it. Only then click, and the word appears so they can check themselves. This is the drill\'s last step ("they say it off the picture alone") done first, because after a week it is the only real test of whether the word is still there.\n\n'
    + 'IF THE ROOM IS SILENT, run the full drill on that word: you say it, whole class, half the class, three individuals, then back to the picture. Thirty seconds. Do the gesture with it: atom = fingers circling, tiny = pinch, part = chop, matter = hold up a pen, then wave a hand through the air ("air is matter too").\n\n'
    + 'PRONUNCIATION: A-tom, stress on the FIRST beat, tap the desk twice. Thai speakers reach for "a-TOM". MAT-ter, two beats. TY-nee, two beats. PART, one beat, say the T at the end.\n\n'
    + 'PLURAL: they will say "atom" for "atoms" and leave the s off. Slide 9 needs "atoms" every time, so get the s in here: say "atom... atoms" and have them hiss the s.\n\n'
    + 'CHECK with either/or only, pointing at the pictures: "Atom or matter?" "Tiny or part?" No open questions yet.'
});

/* 4. LOOK AND SAY · Atoms 2 words · 5 */
wordSlide({
  mins: 5,
  cards: [
    { img: 'nucleus.png', word: 'nucleus', say: 'NEW-clee-us', meaning: 'It is in the centre of the atom.' },
    { img: 'centre.png', word: 'centre', say: 'SEN-ter', meaning: 'The middle of something.' },
    { img: 'electron.png', word: 'electron', say: 'eh-LEK-tron', meaning: 'A part of the atom.' },
    { img: 'outside.png', word: 'outside', say: 'OWT-side', meaning: 'The electron is outside the nucleus.' },
  ],
  notes:
    'LOOK AND SAY, ATOMS 2 WORDS. 5 minutes, one more than the last slide on purpose. Four clicks. Same order: picture, wait, click.\n\n'
    + 'NUCLEUS AND ELECTRON ARE THE TWO THEY FOUND HARD. Both are three beats. Spend the extra minute on them, and drill them BEFORE centre and outside.\n\n'
    + 'NUCLEUS: NEW-clee-us. Three beats, the loudest on NEW. Clap it: CLAP-clap-clap. Thai speakers often lose the middle beat ("NEW-kus") or say "nuclear". Have them hold up three fingers as they say it so the middle beat is counted. (The Nucleus lesson notes say the stress on nucleus is not on the first syllable. That is true of electron only. Nucleus is stressed on NEW.)\n\n'
    + 'ELECTRON: eh-LEK-tron. Three beats, the loudest on the MIDDLE one. Clap it: clap-CLAP-clap. That is the opposite of atom, matter, tiny, part, and it is why it sticks. Tap the desk lightly, lightly, hard, lightly. Common slips: stress on the first beat ("EL-ek-tron"), or a vowel dropped into the middle ("eh-lek-e-tron"). Then link it to a word they can already say: "eh-LEK-tron... NEW-tron", both end in -tron. That comes back on the next slide.\n\n'
    + 'THE PICTURES: nucleus is the cluster, centre is the four arrows pointing in, electron is the atom with the dots going round, outside is the hills and sky. The outside picture is a real outdoors scene, so say "outside the nucleus", pointing at the atom on slide 7, not just "outside".\n\n'
    + 'CENTRE: SEN-ter, two beats. Say it British: "centre", never "center".\n\n'
    + 'CHECK with either/or, pointing: "Centre or outside?" "Nucleus or electron?" Then yes/no: "Is the nucleus in the centre?"'
});

/* 5. LOOK AND SAY · Atoms 3 words · 2 */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Look and say', 2, 'light');
  keywords(s, ['proton', 'neutron'], 'light');
  title(s, 'Say the words', 'light');
  const cw = (CW - 0.30) / 2, y = BODY_Y - 0.02, ch = 3.05;
  [['proton', 'PRO-ton', 'A small part inside the nucleus.', C.accent], ['neutron', 'NEW-tron', 'Another small part inside the nucleus.', C.alert]].forEach(([w, say, mean, dot], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: ch, name: `w${i}` });
    s.addShape(S.ellipse, {
      x: x + 0.55, y: y + 0.55, w: 1.3, h: 1.3, fill: { color: dot }, line: { color: dot, width: 0 }, objectName: `w${i}_img`,
    });
    s.addText(w, {
      x: x + 2.15, y: y + 0.55, w: cw - 2.4, h: 0.7, color: C.dark, fontFace: F.title, fontSize: 32,
      bold: true, valign: 'middle', margin: 0, objectName: `w${i}_word`,
    });
    s.addText(say, {
      x: x + 2.15, y: y + 1.25, w: cw - 2.4, h: 0.4, color: C.support, fontFace: F.body, fontSize: 16,
      bold: true, italic: true, valign: 'middle', margin: 0, objectName: `w${i}_say`,
    });
    s.addText(mean, {
      x: x + 0.55, y: y + 2.05, w: cw - 1.1, h: 0.8, color: C.ink, fontFace: F.body, fontSize: 15,
      valign: 'top', margin: 0, lineSpacing: 19, objectName: `w${i}_mean`,
    });
  });
  const wy = y + ch + 0.30;
  card(s, { x: M, y: wy, w: CW, h: 1.05, fill: 'FDF3DC', line: C.accent, name: 'pair' });
  s.addText('nucleus   NEW-clee-us          neutron   NEW-tron          electron   eh-LEK-tron', {
    x: M + 0.3, y: wy, w: CW - 0.6, h: 1.05, color: C.dark, fontFace: F.body, fontSize: 17,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'pair_t',
  });
  s.addNotes(
    'LOOK AND SAY, ATOMS 3 WORDS. 2 minutes. Three clicks: proton, neutron, then the pair strip.\n\n'
    + 'THE DOTS ARE THE SAME YELLOW AND ROSE DOTS FROM THE NUCLEUS LESSON. Yellow is proton, rose is neutron. Point at a dot first, wait, then click.\n\n'
    + 'PROTON: PRO-ton, two beats, loudest on PRO. This one should come back easily, it stresses the first beat like atom and matter.\n\n'
    + 'NEUTRON: NEW-tron, two beats. It starts with the same sound as nucleus, and that is the trap. The strip at the bottom is there for it: say "nucleus... neutron" side by side, three beats then two, and point out they are different words.\n\n'
    + 'THE STRIP ALSO PUTS ELECTRON NEXT TO NEUTRON, because they end the same way: -tron. Say the two together twice. That is the quickest fix for the stress on electron.\n\n'
    + 'GESTURES: the nucleus lesson only PROPOSED thumbs up for proton and a flat palm for neutron, it never fixed them. Use them if you kept them last time, and if you did not, pick them now and keep them for the rest of the unit.\n\n'
    + 'CHECK, pointing at each dot: "Proton or neutron?" Either/or only.'
  );
}

/* ================================================================== *
 * 6. PART, MATTER, ATOM · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'Look and say', 5, 'light');
  keywords(s, ['matter', 'part', 'atom'], 'light');
  title(s, 'Matter. Part. Atom.', 'light');

  const COLS = [
    { img: 'matter.png', word: 'matter', mean: 'Anything you can touch.', say: '"Water is matter."', small: ['water.png', 'air.png', 'apple.png', 'you.png'] },
    { img: 'part.png', word: 'part', mean: 'One piece of something.', say: '"A leg is a part of a chair."', small: [] },
    { img: 'atom_green.png', word: 'atom', mean: 'A tiny part of matter.', say: '"An atom is a tiny part."', small: [] },
  ];
  const cw = (CW - 2 * 0.30) / 3, y = BODY_Y - 0.02, ch = 3.75;
  COLS.forEach((c, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: ch, name: `pm${i}` });
    s.addImage({ path: IMG(c.img), x: x + cw / 2 - 0.5, y: y + 0.22, w: 1.0, h: 1.0, objectName: `pm${i}_img` });
    s.addText(c.word, {
      x: x + 0.1, y: y + 1.30, w: cw - 0.2, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 28,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `pm${i}_word`,
    });
    s.addText(c.mean, {
      x: x + 0.2, y: y + 1.88, w: cw - 0.4, h: 0.4, color: C.ink, fontFace: F.body, fontSize: 15,
      align: 'center', valign: 'middle', margin: 0, objectName: `pm${i}_mean`,
    });
    c.small.forEach((f, j) => {
      const sw = 0.5, gx = (cw - c.small.length * sw - (c.small.length - 1) * 0.16) / 2;
      s.addImage({ path: IMG(f), x: x + gx + j * (sw + 0.16), y: y + 2.38, w: sw, h: sw, objectName: `pm${i}_s${j}` });
    });
    s.addText(c.say, {
      x: x + 0.2, y: y + 3.05, w: cw - 0.4, h: 0.5, color: C.support, fontFace: F.body, fontSize: 15,
      bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `pm${i}_say`,
    });
  });
  const by = y + ch + 0.25;
  s.addText('An atom is a tiny part of matter.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: by, w: CW, h: 0.85, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.title, fontSize: 25, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'pm_banner',
  });
  s.addNotes(
    'MATTER, PART, ATOM. 5 minutes. Four clicks: matter, part, atom, then the sentence.\n\n'
    + 'THIS SLIDE EXISTS BECAUSE THEY MIX THESE THREE UP. All three mean something small or something material, and they are used in the same sentences ("an atom is a tiny part of matter"). Slow this slide down, it matters more than any other in the lesson.\n\n'
    + 'THE THREE IDEAS, in the plainest words: MATTER is the STUFF. Water, air, a rock, you. PART is a PIECE of something, any size. A leg is a part of a chair. ATOM is a tiny part of the stuff.\n\n'
    + 'MATTER: hold up a pen and say "this is matter". Wave a hand through the air: "this is matter too". The four small pictures (water, air, apple, you) are the same four from Atoms 1. Do not define matter as solid, liquid, gas, they do not have those words.\n\n'
    + 'PART: chop gesture. Point at the chair leg, then at the back: "a part of the chair". Part goes with "of": a part OF something. Have them say "a part of a chair" three times.\n\n'
    + 'ATOM: circling fingers. "An atom is a tiny part of matter": tiny, part, matter, atom, all four words from Atoms 1 in one sentence. Say it and do the gesture for each word as you say it.\n\n'
    + 'EITHER/OR CHECKS, pointing at the pictures: "Water. Matter or part?" (matter). "A leg of a chair. Matter or part?" (part). Then yes/no: "Is air matter?" (yes, and it surprises them). "Is an atom matter?" (an atom is a tiny part OF matter, so a good answer is "no, it is a part"). Take that one slowly, it is the hard one.\n\n'
    + 'ATOM AND ATOMS: one atom, two atoms. They drop the s. Say "an atom" with one finger up, "atoms" with a handful of fingers, and hiss the s. The plural is on every sentence in the lesson ("is made of atoms").'
  );
}

/* ================================================================== *
 * 7. DRAW AN ATOM · 7
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 7, 'light'));
  pill(s, 'Draw', 7, 'light');
  keywords(s, ['atom', 'centre', 'outside', 'electron'], 'light');
  title(s, 'Draw an atom', 'light');

  const STEPS = ['Draw one big circle.', 'Draw the centre.', 'Label the centre. Label the outside.'];
  STEPS.forEach((t, i) => {
    const y = BODY_Y + 0.05 + i * 1.25, w = 5.3;
    card(s, { x: M, y, w, h: 1.05, name: `st${i}` });
    s.addText(String(i + 1), {
      x: M + 0.25, y, w: 0.5, h: 1.05, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true,
      valign: 'middle', margin: 0, objectName: `st${i}_n`,
    });
    s.addText(t, {
      x: M + 0.9, y, w: w - 1.1, h: 1.05, color: C.dark, fontFace: F.title, fontSize: 18, bold: true,
      valign: 'middle', margin: 0, lineSpacing: 22, objectName: `st${i}_t`,
    });
  });
  atomDiagram(s, { cx: 10.15, cy: 4.2, r: 1.85, name: 'dr', dark: false });
  s.addText('The nucleus is in the centre of the atom.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: 6.35, w: CW, h: 0.62, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.title, fontSize: 19, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'dr_banner',
  });
  s.addNotes(
    'DRAW AN ATOM. 7 minutes. Four clicks: circle, centre, outside, then the sentence. The class draws WITH you, on paper or mini boards, one step per click.\n\n'
    + 'THIS IS THE SAME DRAWING AS DRAWING AN ATOM: a circle, a yellow centre, green dots on the edge, the word "outside" in the area around the centre. Draw it live on the board as the slide builds so they see the hand move.\n\n'
    + 'CLICK 1: one big circle. "This is the atom." CLICK 2: the centre. "This is the centre." Point at it. "The nucleus is in the centre." CLICK 3: "outside" appears, and the four green dots. Point at the area around the centre: "This is the outside." Point at a dot: "This is an electron."\n\n'
    + 'THE MISCONCEPTIONS FROM DRAWING AN ATOM STILL APPLY. The centre is INSIDE the atom, never outside it. "Outside" means the area around the centre, still inside the circle, not another atom. And this is a simple picture, not a real-size atom: if someone asks why the centre is so big, that is exactly why it is only a picture.\n\n'
    + 'POINT FIRST, THEN SAY. Ask: "Point to the centre." "Point to the outside." "Point to an electron." Every student points before anyone speaks. Then the sentence from the banner, whole class, then pairs.\n\n'
    + 'WATCH FOR centre and outside swapped, and for a nucleus drawn touching the edge. Recast with the point routine, not more words: "the nucleus sits in the middle".'
  );
}

/* ================================================================== *
 * 8. INSIDE THE NUCLEUS · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Look and say', 2, 'light');
  keywords(s, ['nucleus', 'proton', 'neutron'], 'light');
  title(s, 'Inside the nucleus', 'light');

  nucleusDiagram(s, { cx: 3.7, cy: 4.45, r: 1.75, name: 'in' });
  const tx = 6.5, tw = RIGHT - tx;
  [['proton', 'PRO-ton', C.accent, 'p'], ['neutron', 'NEW-tron', C.alert, 'n']].forEach(([w, say, dot], i) => {
    const y = BODY_Y + 0.15 + i * 1.3;
    card(s, { x: tx, y, w: tw, h: 1.1, name: `ip${i}` });
    s.addShape(S.ellipse, { x: tx + 0.3, y: y + 0.27, w: 0.56, h: 0.56, fill: { color: dot }, line: { color: dot, width: 0 }, objectName: `ip${i}_dot` });
    s.addText(w, {
      x: tx + 1.1, y, w: 2.6, h: 1.1, color: C.dark, fontFace: F.title, fontSize: 26, bold: true,
      valign: 'middle', margin: 0, objectName: `ip${i}_w`,
    });
    s.addText(say, {
      x: tx + 3.7, y, w: tw - 3.9, h: 1.1, color: C.support, fontFace: F.body, fontSize: 16, bold: true,
      italic: true, valign: 'middle', margin: 0, objectName: `ip${i}_say`,
    });
  });
  s.addText('The nucleus is made of protons and neutrons.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: tx, y: BODY_Y + 0.15 + 2 * 1.3 + 0.15, w: tw, h: 1.15, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.title, fontSize: 21, bold: true, align: 'center', valign: 'middle',
    margin: 0.15, objectName: 'in_sentence',
  });
  s.addNotes(
    'INSIDE THE NUCLEUS. 2 minutes. Three clicks: proton, neutron, then the sentence. The picture is on screen from the start.\n\n'
    + 'THIS IS THE PICTURE FROM THE NUCLEUS LESSON: the dark nucleus with the yellow and rose dots. It is kept SEPARATE from the atom on slide 7 on purpose. Putting the electrons and the nucleus dots in one picture would be a picture they have not seen.\n\n'
    + 'POINT AT THE DARK CIRCLE: "the nucleus". Point at a yellow dot: "proton". Point at a rose dot: "neutron". Then the sentence, with the gesture for made of (hands building): "The nucleus... is made of... protons and neutrons." Whole class, twice.\n\n'
    + 'THE PLURAL AGAIN: protons and neutrons, with the s. There is more than one of each in the picture. Point at the dots as you hiss the s.\n\n'
    + 'WATCH FOR nucleus and proton mixed up: some students point at the whole dark circle for both. Recast once: "the nucleus is the whole dark circle, a proton is one yellow dot inside it".\n\n'
    + 'KEEP IT MODEL-ONLY. If someone asks how many protons an atom has, say it is a simple picture, not a real atom, and that is for a later lesson.'
  );
}

/* ================================================================== *
 * 9. YOU SAY A · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'You say', 5, 'light');
  keywords(s, ['atoms', 'matter', 'tiny', 'part'], 'light');
  title(s, 'Your turn. Say the sentence.', 'light');

  s.addText('___  is made of atoms.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M + 1.5, y: 1.85, w: CW - 3.0, h: 0.85, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.title, fontSize: 26, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'fr_banner',
  });
  const PICS = [['water.png', 'Water'], ['apple.png', 'An apple'], ['air.png', 'Air'], ['hand.png', 'My hand']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, y = 3.05;
  PICS.forEach(([img, label], i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y, w: cw, h: 2.45, name: `ms${i}` });
    fit(s, img, x + 0.4, y + 0.22, cw - 0.8, 1.2, `ms${i}_img`);
    s.addText(label, {
      x: x + 0.1, y: y + 1.5, w: cw - 0.2, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 20,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ms${i}_t`,
    });
    s.addImage({ path: IMG('speech_yellow.png'), x: x + cw / 2 - 0.19, y: y + 1.98, w: 0.38, h: 0.38, objectName: `ms${i}_bubble` });
  });
  s.addText('An atom is a tiny part of matter.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M + 1.5, y: 5.85, w: CW - 3.0, h: 0.85, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.title, fontSize: 24, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'fr2_banner',
  });
  s.addNotes(
    'YOU SAY, PART A. 5 minutes, the first half of the biggest block in the lesson. Six clicks: the frame, the four pictures, then the second sentence.\n\n'
    + 'THE FRAME GOES UP FIRST AND STAYS UP. Point at the gap, then at the picture, then wait. Do not say it for them.\n\n'
    + 'ORDER OF DIFFICULTY, and keep to it: 1) whole class together. 2) half the class. 3) PAIRS, turn and tell your partner. 4) individuals, the strongest first so the shy ones have heard it four times before their turn.\n\n'
    + 'PAIRS IS WHERE THE SPEAKING MINUTES ARE. Every student says the sentence out loud four times to one other person, far more than any whole-class round.\n\n'
    + 'THE SENTENCE MUST BE WHOLE, and the s must be on "atoms". They will say "Water is made of atom." Recast, do not explain: "atoms", with the hiss. Make the "made of" gesture (hands building) each time. They will say "made from": recast to "made of" and move on.\n\n'
    + 'THE SECOND SENTENCE, "An atom is a tiny part of matter", is the one from slide 6. Do the four gestures as they say it: atom (circle), tiny (pinch), part (chop), matter (hold up a pen). This is the sentence they found hardest, so it gets the most repeats.\n\n'
    + 'EXTENSION for anyone flying: point at anything in the room and they make the sentence. The window, the light, the air conditioning. All atoms.'
  );
}

/* ================================================================== *
 * 10. YOU SAY B · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'You say', 5, 'light');
  keywords(s, ['nucleus', 'centre', 'outside', 'electron', 'proton', 'neutron'], 'light');
  title(s, 'Look. Say the sentence.', 'light');

  const ROWS = [
    { img: 'centre.png', pre: 'The nucleus is in the ', gap: '______', post: ' of the atom.', ans: 'centre' },
    { img: 'electron.png', pre: 'The electron is ', gap: '______', post: ' the nucleus.', ans: 'outside' },
    { img: null, pre: 'The nucleus is made of ', gap: '________', post: ' and ' + '________' + '.', ans: 'protons · neutrons' },
  ];
  const rh = 1.32, gap = 0.20;
  ROWS.forEach((r, i) => {
    const y = BODY_Y + 0.02 + i * (rh + gap);
    card(s, { x: M, y, w: CW, h: rh, name: `sr${i}` });
    if (r.img) fit(s, r.img, M + 0.25, y + 0.14, 1.3, rh - 0.28, `sr${i}_img`);
    else {
      s.addShape(S.ellipse, { x: M + 0.35, y: y + 0.33, w: 0.62, h: 0.62, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'sr2_p' });
      s.addShape(S.ellipse, { x: M + 0.92, y: y + 0.33, w: 0.62, h: 0.62, fill: { color: C.alert }, line: { color: C.alert, width: 0 }, objectName: 'sr2_n' });
    }
    s.addText(r.pre + r.gap + r.post, {
      x: M + 1.85, y, w: 6.9, h: rh, color: C.dark, fontFace: F.title, fontSize: 21, bold: true,
      valign: 'middle', margin: 0, lineSpacing: 27, objectName: `sr${i}_t`,
    });
    s.addText(r.ans, {
      shape: S.roundRect, rectRadius: 0.10,
      x: RIGHT - 3.05, y: y + 0.36, w: 2.8, h: 0.6, fill: { color: 'FDF3DC' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0.06,
      objectName: `sr${i}_a`,
    });
  });
  s.addNotes(
    'YOU SAY, PART B. 5 minutes, the second half of the biggest block. Three clicks, one answer each.\n\n'
    + 'EACH ROW: point at the picture, point at the gap, wait. They say the WHOLE sentence with the missing word in it. Then click and the word appears so they can check themselves.\n\n'
    + 'ROW 1, the centre picture (the four arrows pointing in): "The nucleus is in the centre of the atom." ROW 2, the electron picture: "The electron is outside the nucleus." ROW 3, the yellow and rose dots: "The nucleus is made of protons and neutrons." All three are sentences they have already said in Drawing an Atom and The Nucleus.\n\n'
    + 'SAME ORDER OF DIFFICULTY AS THE LAST SLIDE: whole class, half the class, pairs, then individuals. Pairs first for anyone who was quiet on the last slide.\n\n'
    + 'THE GAP WORD IS WHAT THEY GET WRONG. Row 1: "outside" for "centre" means centre and outside are swapped, go back to slide 7 and point at the atom. Row 2: they say "inside" or "in", recast to "outside". Row 3: they name only one of the two, usually proton, neutron is the one they are least sure of. Prompt with "and what else?" and do not supply the word.\n\n'
    + 'END THE BLOCK WITH ALL FIVE SENTENCES said in a row, whole class, without the screen. That is objective 3 said aloud, and it is what the worksheet asks them to write.'
  );
}

/* ================================================================== *
 * 11. YOU DO · 9
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 9, 'light'));
  pill(s, 'You do', 9, 'light');
  title(s, 'Your worksheet', 'light');

  const CARDS = [['A', 'eye.png', 'Look and write.', 'Write the word for each picture.'], ['B', 'atom_green.png', 'Draw and label.', 'Draw an atom. Label the centre and the outside.'], ['C', 'pencil.png', 'Write the sentences.', 'Use the picture. Use the word bank.']];
  const cw = (CW - 2 * 0.30) / 3, y = BODY_Y + 0.05;
  CARDS.forEach(([k, img, head, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: 2.75, name: `t${i}` });
    s.addImage({ path: IMG(img), x: x + 0.3, y: y + 0.28, w: 0.7, h: 0.7, objectName: `t${i}_img` });
    s.addText(k, {
      x: x + cw - 0.9, y: y + 0.2, w: 0.6, h: 0.7, color: C.accentInk, fontFace: F.title, fontSize: 32, bold: true,
      align: 'right', valign: 'middle', margin: 0, objectName: `t${i}_k`,
    });
    s.addText(head, {
      x: x + 0.3, y: y + 1.15, w: cw - 0.6, h: 0.5, color: C.dark, fontFace: F.title, fontSize: 21, bold: true,
      valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(body, {
      x: x + 0.3, y: y + 1.68, w: cw - 0.6, h: 0.95, color: C.inkSoft, fontFace: F.body, fontSize: 15,
      valign: 'top', margin: 0, lineSpacing: 19, objectName: `t${i}_b`,
    });
  });
  const wy = y + 2.75 + 0.22;
  s.addText('Word bank', {
    x: M, y: wy, w: 1.8, h: 0.5, color: C.support, fontFace: F.body, fontSize: 13, bold: true, charSpacing: 1,
    valign: 'middle', margin: 0, objectName: 'wb_label',
  });
  s.addText('atom · matter · tiny · part · nucleus · centre · electron · outside · proton · neutron', {
    x: M + 1.8, y: wy, w: CW - 1.8, h: 0.5, color: C.ink, fontFace: F.body, fontSize: 16, bold: true,
    valign: 'middle', margin: 0, objectName: 'wb_words',
  });
  s.addText('Point first. Then say the whole sentence.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: wy + 0.7, w: CW, h: 0.75, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 19, bold: true, align: 'center', valign: 'middle',
    margin: 0, objectName: 'yd_banner',
  });
  s.addNotes(
    'YOU DO. 9 minutes. Four clicks: A, B, C, then the banner. The word bank stays on the screen.\n\n'
    + 'THE WORKSHEET HAS FOUR SECTIONS. A: ten pictures, write the word under each (objective 1). B: draw an atom, label the centre and the outside (objective 2). C: write the five sentences, filling the gaps from the word bank (objective 3). D: point and say with a partner.\n\n'
    + 'NO LINES TO DRAW. It is a word bank and a writing line, per the CLIL rules. Section A is copying with a picture to look at, and that is fine at this level.\n\n'
    + 'CIRCULATE AND ASK ONE THING: point at a picture on their sheet and wait. They say the word. Then point at a sentence: they say it. That is the oral check, started early.\n\n'
    + 'WHERE THEY WILL STALL: section C row 1, "an atom is a tiny ___ of ___", where part and matter get swapped. Send them back to slide 6, not to a new explanation.\n\n'
    + 'FAST FINISHERS: the back of the sheet has the same sentence about three more pictures. No new words.\n\n'
    + 'AT 2 MINUTES REMAINING, stop them. The last slide checks it together.'
  );
}

/* ================================================================== *
 * 12. SAY IT TOGETHER · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Together', 3, 'dark');
  title(s, 'Say it together', 'dark');
  s.addText('An atom is a tiny part of matter.', {
    x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true,
    valign: 'middle', margin: 0, objectName: 'tg_sentence',
  });

  const TILES = [
    ['atom_green.png', 'atom'], ['matter.png', 'matter'], ['tiny.png', 'tiny'], ['part.png', 'part'], ['nucleus.png', 'nucleus'],
    ['centre.png', 'centre'], ['electron.png', 'electron'], ['outside.png', 'outside'], ['proton.png', 'proton'], ['neutron.png', 'neutron'],
  ];
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 2.0;
  TILES.forEach(([img, word], i) => {
    const col = i % 5, row = Math.floor(i / 5);
    const x = M + col * (cw + gap), y = 2.55 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, line: C.darkSoft, name: `tl${i}` });
    if (img === 'proton.png' || img === 'neutron.png') {
      const dot = img === 'proton.png' ? C.accent : C.alert;
      s.addShape(S.ellipse, { x: x + cw / 2 - 0.4, y: y + 0.2, w: 0.8, h: 0.8, fill: { color: dot }, line: { color: dot, width: 0 }, objectName: `tl${i}_img` });
    } else {
      fit(s, img, x + 0.25, y + 0.18, cw - 0.5, 0.95, `tl${i}_img`);
    }
    s.addText(word, {
      x: x + 0.05, y: y + 1.2, w: cw - 0.1, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 20, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `tl${i}_w`,
    });
    s.addImage({ path: IMG('tick.png'), x: x + cw / 2 - 0.16, y: y + 1.66, w: 0.3, h: 0.3, objectName: `tl${i}_tick` });
  });
  s.addText('Next lesson: we build a real model.', {
    x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 13.5, italic: true,
    valign: 'middle', margin: 0, objectName: 'tg_next',
  });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Five clicks, two pictures at a time, each with its word and a tick.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the four gestures.\n\n'
    + 'THEN THE PICTURES: point at each and the class says the word BEFORE the click. Every answer is right on purpose, so every student says ten correct words out loud and leaves having succeeded. If a word is weak, say it three times, do not correct it, and move on.\n\n'
    + 'THE TWO HARD ONES COME IN THE MIDDLE of the grid (nucleus, electron), where the room is warmed up and loud. Clap the beats once more as they say them.\n\n'
    + 'BEFORE THEY GO: ask two or three individuals to point at the atom picture from slide 7 and say where the centre is and where the outside is. Yes/no first if they hesitate: "Is the nucleus in the centre?"\n\n'
    + 'THE PROMISE ON THE SCREEN. The Nucleus lesson ended with "Next lesson: we build a real model", and today was a revision lesson instead, so that line is still owed. It is repeated here. CHANGE THIS LINE if the model-kit practical is not the next lesson.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

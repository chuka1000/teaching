/**
 * T3 Developing Science (CLIL), Unit 4: What is a living organism? Lesson 1: Living Or Non-Living.
 * Single, Week 1 Thursday P3, Thursday 8 October 2026, 50 minutes. CLIL shape (CLIL.md), not the 10-phase archetype.
 *
 * The first lesson of a new unit, straight after the Atoms unit, so a new palette ('meadow') and a fresh word budget.
 * Four new words, the ceiling: living, non-living, plant, animal. One sentence frame: "A ___ is living. / A ___ is
 * non-living." Unit objective 1 (sort things into living and non-living groups). Needs (food, water, air) and
 * growing and changing are later lessons; "because" is not used yet.
 *
 * The TPR gestures for the unit's words are fixed HERE and kept all unit (CLIL.md). They are in the notes on slides 3
 * and 4, and in units/T3-Unit-4-Living-Organisms.md.
 *
 * Pictures: photographs from Wikimedia Commons (assets/photos/, tools/fetch-photos.py), the same ones all unit; the
 * park scene on slide 8 and the routine icons are colour drawings (assets/pictures/, tools/make-pictures.js). No stereomicroscopes, soil, seeds or terrariums: Chuka will not have them.
 * Every classification comes from build/living-or-non-living-answers.js, which the worksheet reads too.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('meadow');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const ANS = require('./living-or-non-living-answers');
const { KIND, WORDS, name, kind } = ANS;

const DATE = 'Thursday 8 October 2026';
const LESSON = 'Living Or Non-Living';
// a photograph (assets/photos) when there is one, else the colour drawing (assets/pictures): the unit kit's rule
const { picFile } = require('./living-things-kit');
const PIC = (n, o) => picFile(n, o);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const LIVE = C.support, STONE = '5E6B78';            // living is leaf green, non-living is slate, on every slide
const LIVE_TINT = 'E6F2E3', STONE_TINT = 'ECEFF2';
const colourOf = (k) => (kind(k) === 'living' ? LIVE : STONE);

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'T3 Developing Science · Unit 4 Living Organisms · Lesson 1 · T3';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

const bg = (slide, mode) => { slide.background = { color: mode === 'dark' ? C.dark : C.tint }; };
const PHASES = [];
function timer(slide, minutes, mode) {
  PHASES.push(addTimer(pptx, slide, {
    key: 'meadow', palette: C, minutes, mode, slideH: H, x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H,
  }));
}
function pill(slide, label, minutes, mode) {
  const text = `${label.toUpperCase()} · ${minutes} MIN`;
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.16,
    x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark }, color: mode === 'dark' ? C.dark : 'FFFFFF',
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, align: 'center', valign: 'middle', margin: 0,
    objectName: 'phase_pill',
  });
}
function keywords(slide, words, mode) {
  slide.addText(words.join('   ·   '), {
    x: RIGHT - 6.4, y: PILL_Y, w: 6.4, h: PILL_H, color: mode === 'dark' ? C.accent : C.support, fontFace: F.body,
    fontSize: 12, bold: true, italic: true, align: 'right', valign: 'middle', margin: 0, objectName: 'keyword_strip',
  });
}
const title = (slide, text, mode, size = 34) => slide.addText(text, {
  x: M, y: TITLE_Y, w: CW, h: 0.80, color: mode === 'dark' ? C.tint : C.dark,
  fontFace: F.title, fontSize: size, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r || 0.12,
    fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || C.tintDeep, width: o.lineWidth || 1.3 },
    objectName: `${o.name}_bg`,
  });
}
/** A square picture, centred on (cx, cy). */
const pic = (slide, key, cx, cy, size, objName, o) => slide.addImage({
  path: PIC(key, o), x: cx - size / 2, y: cy - size / 2, w: size, h: size, objectName: objName,
});
/** The living / non-living chip: the answer, in its colour. */
function chip(slide, k, x, y, w, h, objName, size = 15) {
  slide.addText(kind(k), {
    shape: S.roundRect, rectRadius: 0.10, x, y, w, h, fill: { color: colourOf(k) }, line: { color: colourOf(k), width: 0 },
    color: 'FFFFFF', fontFace: F.body, fontSize: size, bold: true, align: 'center', valign: 'middle', margin: 0,
    objectName: objName,
  });
}
/** A picture tile: the picture, its name under it, and the answer chip (hidden until its click) under that. */
function tile(slide, k, x, y, w, h, nm, o = {}) {
  card(slide, { x, y, w, h, line: o.line, name: nm });
  pic(slide, k, x + w / 2, y + 0.08 + 0.47, 0.94, `${nm}_img`);
  slide.addText(name(k), {
    x: x + 0.08, y: y + 1.06, w: w - 0.16, h: 0.42, color: C.dark, fontFace: F.body, fontSize: 20,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${nm}_t`,
  });
  chip(slide, k, x + w / 2 - 0.78, y + 1.5, 1.56, 0.38, `${nm}_chip`, 15);
  if (o.tick) slide.addImage({ path: PIC('tick'), x: x + w - 0.52, y: y + 0.12, w: 0.4, h: 0.4, objectName: `${nm}_tick` });
}
/** The one sentence frame of the lesson. It goes up on slide 5 and stays in the same place on every speaking slide. */
function frame(slide, y = 6.12, pre = '') {
  slide.addText([
    { text: `${pre}A ___ is `, options: { color: C.tint } },
    { text: 'living', options: { color: C.accent } },
    { text: '.        ', options: { color: C.tint } },
    { text: `${pre ? 'No. ' : ''}A ___ is `, options: { color: C.tint } },
    { text: 'non-living', options: { color: C.accent } },
    { text: '.', options: { color: C.tint } },
  ], {
    shape: S.roundRect, rectRadius: 0.12, x: M, y, w: CW, h: 0.86, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    fontFace: F.title, fontSize: 26, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'frame_banner',
  });
}

/* ================================================================== *
 * 1. TITLE · 1
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  timer(s, 1, 'dark');
  s.addText('LIVING THINGS', {
    x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true,
    charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker',
  });
  s.addText(DATE, {
    x: RIGHT - 3.6, y: PILL_Y, w: 3.6, h: PILL_H, color: C.tintDeep, fontFace: F.body, fontSize: 13,
    align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addText('Living or\nnon-living?', {
    x: M, y: 1.75, w: 6.2, h: 2.5, color: C.tint, fontFace: F.title, fontSize: 48, bold: true,
    valign: 'top', margin: 0, lineSpacing: 60, objectName: 'lesson_title',
  });
  s.addText('Look. Sort. Say.', {
    x: M, y: 4.55, w: 6.2, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true,
    valign: 'middle', margin: 0, objectName: 'lesson_sub',
  });
  const cs = 2.05, gap = 0.28, x0 = 7.75, y0 = 1.45;
  ['dog', 'rock', 'tree', 'chair'].forEach((k, i) => {
    const x = x0 + (i % 2) * (cs + gap), y = y0 + Math.floor(i / 2) * (cs + gap);
    card(s, { x, y, w: cs, h: cs, line: C.darkSoft, r: 0.16, name: `hero${i}` });
    pic(s, k, x + cs / 2, y + cs / 2, 1.5, `hero${i}_img`);
  });
  s.addNotes(
    'TITLE. 1 minute. A NEW UNIT: What is a living organism? This is Lesson 1 of 6, and the last lesson before half-term.\n\n'
    + 'READ THE TITLE slowly, pointing at each word. The class reads it with you, then again without you. Do not explain "living" yet. That is the next slide.\n\n'
    + 'POINT AT THE FOUR PICTURES and name them, the class repeats: "a dog", "a rock", "a tree", "a chair". These are the first examples of the lesson and they come back on slide 5. Then ask one question and do not answer it: "Dog... rock... the same? Different?" Let them point and guess.\n\n'
    + 'NEW PICTURES THIS UNIT. Real photographs, and the same photograph is used for the same thing on every slide, on the worksheet and in every later lesson, so a dog is always this dog. That is what makes the pictures work for retrieval after half-term.\n\n'
    + 'THE GESTURES for this unit are agreed in the next two slides and kept for all six lessons. The Atoms gestures (atom, tiny, part, made of) are not used in this unit.'
  );
}

/* ================================================================== *
 * 2. TODAY · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 2, 'light');
  pill(s, 'Today', 2, 'light');
  title(s, 'Today', 'light');
  const GOALS = [[['speech'], 'Say the new words.'], [['dog', 'rock'], 'Sort: living or\nnon-living.'], [['writing'], 'Write the sentence.']];
  const cw = (CW - 2 * 0.30) / 3;
  GOALS.forEach(([imgs, text], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.25;
    card(s, { x, y, w: cw, h: 3.5, name: `o${i}` });
    s.addText(String(i + 1), {
      x: x + 0.24, y: y + 0.18, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24,
      bold: true, valign: 'middle', margin: 0, objectName: `o${i}_num`,
    });
    imgs.forEach((k, j) => pic(s, k, x + cw / 2 + (j - (imgs.length - 1) / 2) * 1.3, y + 1.0, 1.15, `o${i}_img${j}`));
    s.addText(text, {
      x: x + 0.28, y: y + 1.9, w: cw - 0.56, h: 1.3, color: C.ink, fontFace: F.body, fontSize: 19,
      bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 24, objectName: `o${i}_t`,
    });
  });
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + 'Read each goal. The class repeats the KEY WORD only, with an action: "say" (hand from your mouth), "sort" (two hands putting things into two piles), "write" (write in the air).\n\n'
    + 'THIS IS THE ORDER OF THE LESSON. Goal 1 is the next 10 minutes: four new words. Goal 2 is the middle: you sort first, then they do. Goal 3 is the worksheet.\n\n'
    + 'DO NOT READ OBJECTIVES OUT. Three pictures, three short lines, move on.'
  );
}

/* ================================================================== *
 * New words: two cards, three pictures each. The word arrives on a click, then leaves, so they say it off the pictures.
 * ================================================================== */
function wordSlide(o) {
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, o.mins, 'light');
  pill(s, 'New words', o.mins, 'light');
  keywords(s, o.cards.map((c) => c.word), 'light');
  title(s, 'Say the words', 'light');
  const cw = (CW - 0.30) / 2, y = BODY_Y - 0.06, ch = o.ch;
  o.cards.forEach((c, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: ch, line: c.colour, lineWidth: 2.5, name: `w${i}` });
    const ps = o.picSize;
    WORDS[c.word].forEach((k, j) => {
      const cx = x + cw / 2 + (j - 1) * o.spread;
      pic(s, k, cx, y + 0.22 + ps / 2, ps, `w${i}_p${j}`);
      s.addText(name(k), {
        x: cx - 0.8, y: y + 0.26 + ps, w: 1.6, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 14,
        bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_n${j}`,
      });
    });
    const wy = y + 0.72 + ps;
    s.addText(c.word, {
      x: x + 0.1, y: wy, w: cw - 0.2, h: 0.75, color: c.colour, fontFace: F.title, fontSize: 42,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_word`,
    });
    s.addText(c.say, {
      x: x + 0.1, y: wy + 0.78, w: cw - 0.2, h: 0.4, color: C.inkSoft, fontFace: F.body, fontSize: 18,
      bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_say`,
    });
    s.addText(c.meaning, {
      x: x + 0.3, y: wy + 1.22, w: cw - 0.6, h: 0.45, color: C.ink, fontFace: F.body, fontSize: 18,
      align: 'center', valign: 'middle', margin: 0, objectName: `w${i}_mean`,
    });
  });
  if (o.banner) {
    s.addText(o.banner, {
      shape: S.roundRect, rectRadius: 0.12, x: M, y: y + ch + 0.22, w: CW, h: 0.82,
      fill: { color: C.dark }, line: { color: C.dark, width: 0 }, color: C.accent, fontFace: F.title, fontSize: 27,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'w_banner',
    });
  }
  s.addNotes(o.notes);
}

/* 3. NEW WORDS · living, non-living · 5 */
wordSlide({
  mins: 5, ch: 4.25, picSize: 1.45, spread: 1.72,
  cards: [
    { word: 'living', say: 'LIV-ing', meaning: 'Like you, a dog and a tree.', colour: LIVE },
    { word: 'non-living', say: 'non-LIV-ing', meaning: 'Not living. Like a rock.', colour: STONE },
  ],
  notes:
    'NEW WORDS: LIVING, NON-LIVING. 5 minutes. Three clicks: "living" appears, "non-living" appears, then BOTH WORDS LEAVE so they say them off the pictures.\n\n'
    + 'BEFORE THE FIRST CLICK, point at the left pictures: "dog, tree, girl". Then the right: "rock, chair, ball". Ask: "Same? Different?" Let them try. Then click.\n\n'
    + 'THE DRILL, 30 seconds a word: you say it, whole class, half the class, three individuals, then off the picture with no prompt (that is the third click).\n\n'
    + 'PRONUNCIATION. LIV-ing: two beats, loudest on LIV. A short "i", as in "sit". Not "leaving", which is a different word: hold up the dog picture and say "LIV-ing", then wave goodbye for "leaving", once, so they hear the difference. Thai speakers often turn v into w ("li-wing"): top teeth on the bottom lip, and feel it buzz. The end is "-ing", no k. non-LIV-ing: three beats, still loudest on LIV, "non" like "on" with an n in front.\n\n'
    + 'GESTURES, FIXED TODAY AND KEPT ALL UNIT. Agree them now and use them every time the word is said, by you and by them.\n'
    + '  living = both hands up, wiggle all ten fingers (busy, alive).\n'
    + '  non-living = two fists, one on top of the other, held completely still (a stone).\n'
    + 'Do the gesture with the drill. By the third round they should do it before you do.\n\n'
    + 'THE GIRL IS THEM. Point at the girl picture, then at the class: "You are living!" Point at yourself: "I am living." That gets a laugh and fixes the word.\n\n'
    + 'CHECK with yes/no first, pointing: "Is a dog living?" (yes). "Is a rock living?" (no). Then either/or: "Chair: living or non-living?" No open questions yet.\n\n'
    + 'THE CHAIR IS WOOD. A sharp student may say "a chair is a tree". Say: "It WAS a tree. Now it is non-living." Do not open "dead" or "once living" today.'
});

/* 4. NEW WORDS · plant, animal · 5 */
wordSlide({
  mins: 5, ch: 3.86, picSize: 1.3, spread: 1.72,
  cards: [
    { word: 'plant', say: 'PLANT', meaning: 'A tree is a plant.', colour: LIVE },
    { word: 'animal', say: 'AN-i-mal', meaning: 'A dog is an animal.', colour: LIVE },
  ],
  banner: 'Plants and animals are living.',
  notes:
    'NEW WORDS: PLANT, ANIMAL. 5 minutes. Four clicks: "plant", "animal", both words leave (say them off the pictures), then the sentence.\n\n'
    + 'BOTH CARDS ARE GREEN ON PURPOSE. Green means living, on every slide today. Point at the green border: "plant: living. animal: living."\n\n'
    + 'PRONUNCIATION. PLANT: one beat. Thai speakers may add a vowel ("pa-lant") or drop the t: keep it one beat and finish on a crisp t. AN-i-mal: three beats, loudest on AN. Clap it: CLAP-clap-clap. Thai speakers often turn the final l into n ("a-ni-man"): tongue up behind the top teeth at the end, and hold it.\n\n'
    + '"AN ANIMAL", NOT "A ANIMAL". Teach it as one chunk: "an-animal", said fast, like one word. The meaning lines say "a plant" and "an animal": point at the n.\n\n'
    + 'GESTURES, FIXED TODAY AND KEPT ALL UNIT:\n'
    + '  plant = palms together at the chest, then open them upwards like two leaves.\n'
    + '  animal = hands as paws, scratch the air twice.\n\n'
    + 'THE SENTENCE IS THE POINT OF THE SLIDE. "Plants and animals are living." The misconception to expect is that PLANTS ARE NOT LIVING, because they do not move. Say it with the gestures: plant (open palms), animal (paws), living (wiggle). Then ask yes/no: "Is a tree living?" Many will say no. Do not argue: point at the green border and the banner, and say it together again. It comes back on slide 7 with the cactus.\n\n'
    + 'PEOPLE ARE ANIMALS. If someone asks "Am I an animal?", the answer is yes. Keep it to that. Do not put people into the plant or animal groups on the worksheet: the sheet does not ask.\n\n'
    + 'MUSHROOMS. If anyone asks, a mushroom is living but it is not a plant or an animal. Say "living, yes" and leave it there. There are no mushrooms in this unit on purpose.'
});

/* ================================================================== *
 * 5. SORT THEM · the frame, and the teacher sorts · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 6, 'light');
  pill(s, 'Sentence', 6, 'light');
  keywords(s, ['living', 'non-living', 'plant', 'animal'], 'light');
  title(s, 'Sort them', 'light');

  const ty = 1.95, th = 3.95, gap = 0.30;
  const lw = 7.0, nw = CW - lw - gap, nx = M + lw + gap;
  const tray = (x, w, label, colour, tint, nm) => {
    card(s, { x, y: ty, w, h: th, fill: tint, line: colour, lineWidth: 2.5, name: nm });
    s.addText(label, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.2, y: ty + 0.18, w: w - 0.4, h: 0.6,
      fill: { color: colour }, line: { color: colour, width: 0 }, color: 'FFFFFF', fontFace: F.title, fontSize: 26,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${nm}_label`,
    });
  };
  tray(M, lw, 'living', LIVE, LIVE_TINT, 'tl');
  tray(nx, nw, 'non-living', STONE, STONE_TINT, 'tn');
  // the living tray splits into plants and animals
  const colW = (lw - 0.4) / 2;
  [['plants', 0], ['animals', 1]].forEach(([lab, j]) => {
    s.addText(lab, {
      x: M + 0.2 + j * colW, y: ty + 0.92, w: colW, h: 0.42, color: LIVE, fontFace: F.body, fontSize: 18,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `tl_${lab}`,
    });
  });
  s.addShape(S.line, {
    x: M + lw / 2, y: ty + 1.0, w: 0, h: th - 1.2, line: { color: LIVE, width: 1.2, dashType: 'dash' }, objectName: 'tl_split',
  });
  const ps = 1.45, py = ty + 1.45 + ps / 2;
  const SLOTS = {
    tree: M + 0.2 + colW / 2 - 0.85, flower: M + 0.2 + colW / 2 + 0.85,
    dog: M + 0.2 + colW * 1.5 - 0.85, bird: M + 0.2 + colW * 1.5 + 0.85,
    rock: nx + nw / 2 - 1.35, chair: nx + nw / 2, ball: nx + nw / 2 + 1.35,
  };
  const ORDER = ['dog', 'rock', 'tree', 'chair', 'bird', 'ball', 'flower'];
  ORDER.forEach((k) => {
    const sz = kind(k) === 'living' ? ps : 1.15;
    pic(s, k, SLOTS[k], py, sz, `it_${k}_img`);
    s.addText(name(k), {
      x: SLOTS[k] - 0.75, y: py + ps / 2 + 0.08, w: 1.5, h: 0.4, color: C.ink, fontFace: F.body, fontSize: 17,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `it_${k}_t`,
    });
  });
  frame(s);
  s.addNotes(
    'SORT THEM. 6 minutes. YOU sort; they watch, then join in. Seven clicks, one picture each: dog, rock, tree, chair, bird, ball, flower. The frame at the bottom is on screen from the start and STAYS on every speaking slide from now on.\n\n'
    + 'THE FRAME IS THE ONE SENTENCE OF THE LESSON: "A ___ is living." "A ___ is non-living." Point at it, read it with the gap, and do the gestures on "living" and "non-living".\n\n'
    + 'EACH CLICK, the same routine: hold up the picture card in your head, say the name, then the sentence, then click so the picture lands in its box. "A dog. A dog is living." Click. Point at the box. By the third picture, stop saying the sentence: point at the gap in the frame and let THEM say it before you click.\n\n'
    + 'THE LIVING BOX HAS TWO SIDES: plants and animals. Say it as the tree lands: "A tree is living. A tree is a plant." And the dog: "A dog is living. A dog is an animal." This is the sentence from slide 4 again: plants and animals are living.\n\n'
    + 'WATCH FOR "A dog is live" or "A dog living". Recast, do not explain: "A dog IS LIV-ING", with the gesture, and they repeat. And "a rock is not living" is fine meaning but not today\'s word: recast to "non-living".\n\n'
    + 'THIS IS THE SORTING CHART FROM THE UNIT PLAN. The worksheet\'s section B is the same two boxes, so they meet the layout here first.'
  );
}

/* ================================================================== *
 * 6. YOU SAY A · yes/no · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 5, 'light');
  pill(s, 'You say', 5, 'light');
  keywords(s, ['living', 'non-living'], 'light');
  title(s, 'Is a ___ living?', 'light');
  const ITEMS = ['cat', 'phone', 'flower', 'car', 'snail', 'book'];
  const gap = 0.22, cw = (CW - 5 * gap) / 6, y = 1.95, ch = 3.85;
  ITEMS.forEach((k, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y, w: cw, h: ch, name: `ys${i}` });
    pic(s, k, x + cw / 2, y + 0.25 + 0.72, 1.44, `ys${i}_img`);
    s.addText(name(k), {
      x: x + 0.05, y: y + 1.85, w: cw - 0.1, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 24,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ys${i}_t`,
    });
    s.addText(kind(k) === 'living' ? 'Yes' : 'No', {
      x: x + 0.05, y: y + 2.5, w: cw - 0.1, h: 0.45, color: colourOf(k), fontFace: F.title, fontSize: 22,
      bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ys${i}_yn`,
    });
    chip(s, k, x + 0.12, y + 3.05, cw - 0.24, 0.55, `ys${i}_chip`);
  });
  frame(s, 6.12, 'Yes. ');
  s.addNotes(
    'YOU SAY, PART A: YES OR NO. 5 minutes. Six clicks, one answer each. Yes/no questions come first because they need the least English.\n\n'
    + 'THE ROUTINE FOR EACH PICTURE: point at it and ask "Is a cat living?" They answer "Yes!" with the gesture. Then they say the WHOLE sentence from the frame: "Yes. A cat is living." Then click, and the answer appears so they can check themselves.\n\n'
    + 'ORDER OF DIFFICULTY, and keep to it: 1) whole class. 2) half the class (windows side, then door side). 3) PAIRS: one asks, one answers, then swap. 4) individuals, the confident ones first.\n\n'
    + 'THE CAR IS THE TRAP. "It moves!" Yes, a car moves, and it is non-living. Say: "A car moves. A car is non-living." Do the non-living gesture (still fists) while you say "moves" and let them see the joke. Moving is not the test.\n\n'
    + 'THE SNAIL is small and slow, and it is living. "Small. Slow. Living!"\n\n'
    + 'THE PHONE AND THE BOOK are things they hold every day. If anyone says the phone is living because it talks or lights up, same answer as the car: "It talks. It is non-living."\n\n'
    + 'ANSWERS (from the answers module): ' + ['cat', 'phone', 'flower', 'car', 'snail', 'book'].map((k) => `${name(k)} ${kind(k)}`).join(', ') + '.'
  );
}

/* ================================================================== *
 * 7. YOU SAY B · either/or, in pairs · 7
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 7, 'light');
  pill(s, 'You say', 7, 'light');
  title(s, 'Living or non-living?', 'light');
  pic(s, 'pair', RIGHT - 3.0, PILL_Y + 0.75, 0.75, 'pair_img');
  s.addText('A points. B says.', {
    x: RIGHT - 2.55, y: PILL_Y + 0.5, w: 2.55, h: 0.5, color: C.support, fontFace: F.body, fontSize: 17, bold: true,
    valign: 'middle', margin: 0, objectName: 'pair_t',
  });
  const ITEMS = ['frog', 'robot', 'cactus', 'teddy', 'butterfly', 'bicycle', 'horse', 'clock'];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96, y0 = 1.9;
  ITEMS.forEach((k, i) => tile(s, k, M + (i % 4) * (cw + gap), y0 + Math.floor(i / 4) * (ch + 0.16), cw, ch, `eo${i}`));
  frame(s);
  s.addNotes(
    'YOU SAY, PART B: EITHER/OR, IN PAIRS. 7 minutes, the biggest block. Four clicks, two answers each.\n\n'
    + 'THE QUESTION IS NOW EITHER/OR: "Frog: living or non-living?" They answer with the whole frame: "A frog is living."\n\n'
    + 'RUN IT LIKE THIS. Do the first two pictures with the whole class. Then PAIRS: A points at a picture, B says the sentence. Swap after four pictures. Pairs is where the speaking minutes are: every student says eight sentences. Walk the room and listen; do not click yet. Then click the answers two at a time and they check themselves. Then individuals, two or three, the quieter ones now that they have said it twice.\n\n'
    + 'THE TRAPS ARE ON PURPOSE, one per pair of pictures:\n'
    + '  robot: moves and talks, non-living.\n'
    + '  cactus: does not move, LIVING. It is a plant. This is the plants-are-not-living misconception again: point back to "Plants and animals are living" with the gestures.\n'
    + '  teddy: looks like an animal, non-living.\n'
    + '  bicycle and clock: they move, non-living.\n'
    + 'Never argue a wrong answer: ask the either/or again with the picture and the gesture, and let a partner answer.\n\n'
    + '"A TEDDY" is enough. Do not teach "teddy bear" today.\n\n'
    + 'EXTENSION for anyone flying: plant or animal? "A frog is an animal." "A cactus is a plant." The worksheet asks it twice.\n\n'
    + 'ANSWERS (from the answers module): ' + ['frog', 'robot', 'cactus', 'teddy', 'butterfly', 'bicycle', 'horse', 'clock'].map((k) => `${name(k)} ${kind(k)}`).join(', ') + '.'
  );
}

/* ================================================================== *
 * 8. YOU SAY C · open: what can you see? · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 6, 'light');
  pill(s, 'You say', 6, 'light');
  title(s, 'What can you see?', 'light');
  const sx = M, sy = 1.85, sw = CW, sh = 4.05, ground = 2.55;
  s.addShape(S.roundRect, { x: sx, y: sy, w: sw, h: sh, rectRadius: 0.14, fill: { color: 'DDEFFA' }, line: { color: C.tintDeep, width: 1.3 }, objectName: 'sc_sky' });
  s.addShape(S.rect, { x: sx, y: sy + ground, w: sw, h: sh - ground - 0.14, fill: { color: 'B5DC98' }, line: { color: 'B5DC98', width: 0 }, objectName: 'sc_grass' });
  s.addShape(S.roundRect, { x: sx, y: sy + sh - 0.3, w: sw, h: 0.3, rectRadius: 0.14, fill: { color: 'B5DC98' }, line: { color: 'B5DC98', width: 0 }, objectName: 'sc_grass2' });
  // [key, centre x, centre y (both from the scene's top left), size]
  const SCENE = [
    ['sun', 0.85, 0.75, 1.05], ['cloud', 2.25, 0.62, 1.0], ['tree', 3.95, 1.95, 2.15], ['bird', 6.15, 0.6, 0.78],
    ['kite', 10.2, 0.75, 1.1], ['butterfly', 5.65, 1.55, 0.62], ['walker', 6.95, 2.3, 1.75], ['dog', 8.55, 3.0, 1.05],
    ['ball', 9.65, 3.25, 0.58], ['rock', 10.75, 3.05, 0.9], ['bicycle', 1.4, 3.0, 1.3], ['flower', 2.75, 3.3, 0.75],
  ];
  SCENE.forEach(([ka, ax, ay, as], i) => SCENE.slice(i + 1).forEach(([kb, bx, by, bs]) => {
    if (Math.hypot(ax - bx, ay - by) < as / 2 + bs / 2 + 0.2) throw new Error(`scene: the rings round ${ka} and ${kb} overlap`);
  }));
  SCENE.forEach(([k, cx, cy, size]) => pic(s, k, sx + cx, sy + cy, size, `sc_${k}`, { drawing: true }));
  SCENE.forEach(([k, cx, cy, size]) => {
    const r = size / 2 + 0.1;
    s.addShape(S.ellipse, {
      x: sx + cx - r, y: sy + cy - r, w: 2 * r, h: 2 * r, fill: { type: 'none' },
      line: { color: colourOf(k), width: 4, dashType: kind(k) === 'living' ? 'solid' : 'dash' }, objectName: `ring_${k}`,
    });
  });
  frame(s);
  s.addNotes(
    'YOU SAY, PART C: OPEN. 6 minutes. Two clicks: green rings round everything living, then grey rings round everything non-living.\n\n'
    + 'NOW THE QUESTION IS OPEN: "What can you see?" They name a thing and say the sentence: "A dog is living." "A kite is non-living." There is no wrong thing to pick, so everyone can answer.\n\n'
    + 'BUILD UP TO IT. If the room is quiet, go back one step: point at the tree and ask either/or, "Tree: living or non-living?" Then let them choose their own thing.\n\n'
    + 'PAIRS FOR 2 MINUTES: "Say three living things. Say three non-living things." Then individuals, and then the clicks to check.\n\n'
    + 'THE HARD ONES: the SUN and the CLOUD move across the sky, and the sun is warm. Both are non-living. Same answer as the car: "It moves. It is non-living." The KITE flies, non-living. The GRASS is green and everywhere, and it is a plant, so it is living: a good one for a student who has found everything else.\n\n'
    + 'THE PERSON: accept "a man", "a boy", "a girl", "a person". All living.\n\n'
    + 'COUNT AT THE END, with the rings on: "How many living?" (six, seven with the grass). "How many non-living?" (six).\n\n'
    + 'LOOK AROUND THE ROOM if there is time: point at a window, a bag, a classmate. Same sentence.'
  );
}

/* ================================================================== *
 * 9. YOU DO · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  timer(s, 10, 'light');
  pill(s, 'You do', 10, 'light');
  title(s, 'Your worksheet', 'light');
  const CARDS = [['A', ['eyes'], 'Look and write.', 'Write the word for each set of pictures.'],
    ['B', ['dog', 'rock'], 'Sort.', 'Write each word in the right box.'],
    ['C', ['writing'], 'Write.', 'Write the sentence: A dog is living.']];
  const cw = (CW - 2 * 0.30) / 3, y = BODY_Y - 0.05;
  CARDS.forEach(([k, imgs, head, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: 2.85, name: `t${i}` });
    imgs.forEach((im, j) => pic(s, im, x + 0.62 + j * 0.85, y + 0.65, 0.78, `t${i}_img${j}`));
    s.addText(k, {
      x: x + cw - 0.9, y: y + 0.2, w: 0.6, h: 0.7, color: C.accentInk, fontFace: F.title, fontSize: 34, bold: true,
      align: 'right', valign: 'middle', margin: 0, objectName: `t${i}_k`,
    });
    s.addText(head, {
      x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 23, bold: true,
      valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(body, {
      x: x + 0.3, y: y + 1.8, w: cw - 0.6, h: 0.9, color: C.inkSoft, fontFace: F.body, fontSize: 17,
      valign: 'top', margin: 0, lineSpacing: 21, objectName: `t${i}_b`,
    });
  });
  const wy = y + 2.85 + 0.25;
  s.addText('Word bank', {
    x: M, y: wy, w: 1.9, h: 0.6, color: C.support, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1,
    valign: 'middle', margin: 0, objectName: 'wb_label',
  });
  s.addText('living   ·   non-living   ·   plant   ·   animal', {
    x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 22, bold: true,
    valign: 'middle', margin: 0, objectName: 'wb_words',
  });
  s.addText('Point first. Then say the whole sentence.', {
    shape: S.roundRect, rectRadius: 0.12, x: M, y: wy + 0.85, w: CW, h: 0.8, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: 21, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'yd_banner',
  });
  const A = Object.fromEntries(ANS.map(([n, a]) => [n, a]));
  s.addNotes(
    'YOU DO. 10 minutes. Four clicks: A, B, C, then the banner. The word bank stays on screen.\n\n'
    + 'THE WORKSHEET. A: four sets of pictures, the same sets as slides 3 and 4, in a different order: write the word (living, non-living, plant or animal). B: twelve pictures with their names; write each name in the living box or the non-living box. That is the sorting chart from the unit plan. C: nine sentences from the frame. Rows 1 to 7 have one gap; rows 8 and 9 are the whole sentence, written from the picture. D: point and say with a partner.\n\n'
    + 'NO LINES TO DRAW, per the CLIL rules: a word bank and writing lines. Copying the names in B is fine at this level, the thinking is which box.\n\n'
    + 'CIRCULATE AND ASK ONE THING: point at a picture on their sheet and wait. They say the sentence. That is the oral check, and it rehearses the unit assessment.\n\n'
    + 'WHERE THEY WILL STALL: B, the cactus and the robot. Send them back to slide 7, not to a new explanation. C5 and C6: plant or animal, not living. Point at the gap: "a ___" wants a thing, "plant" or "animal".\n\n'
    + 'THE ANSWERS are printed upside down at the foot of page 2, so they can check C themselves at the end.\n'
    + `  A: ${A.A}\n  B: ${A.B}\n  C: ${ANS.filter(([n]) => n.startsWith('C')).map(([n, a]) => `${n} ${a}`).join('  ')}\n\n`
    + 'FAST FINISHERS: the box at the end, two more sentences about things in the room.\n\n'
    + 'AT 2 MINUTES REMAINING, stop them. The last slide says it all together.'
  );
}

/* ================================================================== *
 * 10. SAY IT TOGETHER · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  timer(s, 3, 'dark');
  pill(s, 'Together', 3, 'dark');
  title(s, 'Say it together', 'dark');
  s.addText('Plants and animals are living.', {
    x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true,
    valign: 'middle', margin: 0, objectName: 'tg_sentence',
  });
  const TILES = ['tree', 'rock', 'dog', 'car', 'flower', 'phone', 'fish', 'robot'];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach((k, i) => tile(s, k, M + (i % 4) * (cw + gap), 2.5 + Math.floor(i / 4) * (ch + 0.16), cw, ch, `tl${i}`, { line: C.darkSoft, tick: true }));
  s.addText('Next lesson: what do living things need?', {
    x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true,
    valign: 'middle', margin: 0, objectName: 'tg_next',
  });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Four clicks, two answers each, with a tick.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the gestures: plant (open palms), animal (paws), living (wiggle).\n\n'
    + 'THEN THE PICTURES: point at each and the class says the whole sentence BEFORE the click: "A tree is living." Every one of these has been answered today, including the two traps (car, robot), so every answer is right and every student leaves having said eight correct sentences out loud.\n\n'
    + 'IF A SENTENCE IS WEAK, say it three times together, do not correct anyone, and move on.\n\n'
    + 'THE PROMISE ON THE SCREEN: next lesson is what living things need (food, water, air). It comes after half-term, so it opens with these four words and their gestures before anything new.\n\n'
    + 'BEFORE THEY GO: two or three individuals point at something in the room and say the sentence. That is the exit ticket.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});

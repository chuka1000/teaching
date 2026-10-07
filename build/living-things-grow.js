/**
 * T3 Developing Science (CLIL), Unit 4: What is a living organism? Lesson 3: Living Things Grow.
 * Single, Week 2 Friday P7 (14:10 to 15:00, the last lesson of the week), Friday 23 October 2026, 50 minutes. CLIL shape.
 *
 * PREVIOUS: What Living Things Need (Lesson 2, yesterday). Its plenary promised "Next lesson: living things grow."
 * Friday P7 is the slot for the most active thing (CLIL.md): so a crouch-and-stand ordering game and a stand-up sort, and
 * a short worksheet. No long writing.
 *
 * New words (two): grow, change. Frame: "A ___ grows into a ___." Banner sentence: "Living things grow and change."
 * The I Do is a generated animation (build/media/living-things-grow-media.py): a seed grows over 20 days beside a rock
 * that does not. It PLAYS ON CLICK. Unit objective 3. "Because" and "does not" wait for Lesson 4.
 *
 * Every answer comes from build/living-things-grow-answers.js; what each thing is, from build/living-things-words.js.
 */
const fs = require('fs');
const path = require('path');
const ANS = require('./living-things-grow-answers');
const K = require('./living-things-kit')({
  lesson: 'Living Things Grow',
  subject: 'T3 Developing Science · Unit 4 Living Organisms · Lesson 3 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, LIVE, STONE, WORDS } = K;
const { name, kind } = WORDS;
const DATE = 'Friday 23 October 2026';
const G = (w) => WORDS.gesture(w);
const MEDIA = (f) => path.join(__dirname, '..', 'assets', 'media', f);

/** An arrow between two pictures in a sequence. */
const arrow = (s, x, y, w, nm) => s.addShape(S.rightArrow, { x, y, w, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: nm });

/* ================================================================== *
 * 1. TITLE · 1
 * ================================================================== */
{
  const s = K.slide('dark', 1);
  s.addText('LIVING THINGS', { x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker' });
  s.addText(DATE, { x: RIGHT - 3.6, y: PILL_Y, w: 3.6, h: PILL_H, color: C.tintDeep, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addText('Living things\ngrow', { x: M, y: 1.75, w: 6.2, h: 2.5, color: C.tint, fontFace: F.title, fontSize: 48, bold: true, valign: 'top', margin: 0, lineSpacing: 60, objectName: 'lesson_title' });
  s.addText('Small. Big. Change!', { x: M, y: 4.55, w: 6.2, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: 'lesson_sub' });
  const cs = 2.05, gap = 0.28, x0 = 7.75, y0 = 1.45;
  ['puppy', 'dog', 'seedling', 'sunflower'].forEach((k, i) => {
    const x = x0 + (i % 2) * (cs + gap), y = y0 + Math.floor(i / 2) * (cs + gap);
    K.card(s, { x, y, w: cs, h: cs, line: C.darkSoft, r: 0.16, name: `hero${i}` });
    K.pic(s, k, x + cs / 2, y + cs / 2, 1.75, `hero${i}_img`);
  });
  s.addNotes(
    'TITLE. 1 minute. Lesson 3 of 6. FRIDAY P7, the last lesson of the week: this lesson is the active one, and the writing is short.\n\n'
    + 'POINT AT THE PUPPY, THEN THE DOG. Wait. Then the seedling and the sunflower. Ask "Same? Different?" Somebody will say "small... big". That is the idea of the lesson.\n\n'
    + 'READ THE TITLE together. "Grow" is new: do the grow gesture as you say it (' + G('grow') + '). Do not drill it yet.\n\n'
    + 'STANDING UP IS ALLOWED TODAY. Tell them now, with a smile: there are two games where they stand.'
  );
}

/* ================================================================== *
 * 2. TODAY · 2
 * ================================================================== */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  const GOALS = [[['seedling'], 'Say: grow, change.'], [['puppy', 'dog'], 'Put the pictures\nin order.'], [['writing'], 'Write: A puppy\ngrows into a dog.']];
  const cw = (CW - 2 * 0.30) / 3;
  GOALS.forEach(([imgs, text], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.25;
    K.card(s, { x, y, w: cw, h: 3.5, name: `o${i}` });
    s.addText(String(i + 1), { x: x + 0.24, y: y + 0.18, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `o${i}_num` });
    imgs.forEach((k, j) => K.pic(s, k, x + cw / 2 + (j - (imgs.length - 1) / 2) * 1.3, y + 1.0, 1.15, `o${i}_img${j}`));
    s.addText(text, { x: x + 0.28, y: y + 1.9, w: cw - 0.56, h: 1.3, color: C.ink, fontFace: F.body, fontSize: 19, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 24, objectName: `o${i}_t` });
  });
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + 'Read each goal. The class repeats the key word with its action: "grow" (' + G('grow') + '), "order" (point left, middle, right), "write" (write in the air).\n\n'
    + 'DO NOT READ OBJECTIVES OUT. Three pictures, three short lines, move on.'
  );
}

/* ================================================================== *
 * 3. REMEMBER · Lessons 1 and 2, picture first · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'Remember');
  K.keywords(s, ['living', 'non-living', 'plant', 'animal', 'need', 'food', 'water', 'air']);
  K.title(s, 'Do you remember?');
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 2.02, y0 = 1.9;
  ANS.REMEMBER.forEach(([k, word], i) => {
    const x = M + (i % 4) * (cw + gap), y = y0 + Math.floor(i / 4) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rm${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.62, 1.24, `rm${i}_img`);
    s.addText(word, { x: x + 0.08, y: y + 1.46, w: cw - 0.16, h: 0.48, color: word === 'non-living' ? STONE : LIVE, fontFace: F.title, fontSize: 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word` });
  });
  K.banner(s, [['Living things ', false], ['need', true], [' food, water and air.', false]]);
  s.addNotes(
    'REMEMBER. 5 minutes. Four clicks, two words each. The pictures are the photographs from Lessons 1 and 2; the words are hidden.\n\n'
    + 'POINT AT A PICTURE AND WAIT. They say the word, and the GESTURE, before you click. The click lets them check.\n'
    + `  living = ${G('living')}.  non-living = ${G('non-living')}.\n  plant = ${G('plant')}.  animal = ${G('animal')}.\n`
    + `  need = ${G('need')}.  food = ${G('food')}.\n  water = ${G('water')}.  air = ${G('air')}.\n\n`
    + 'THE "NEED" PICTURE is the plant being watered from Lesson 2. They may say "water" for it: fair. Ask "Plants... ?" and wait for "need".\n\n'
    + 'THEN THE BANNER, whole class, with the gestures: "Living things need food, water and air." Yesterday\'s sentence. Today adds a new one about living things.'
  );
}

/* ================================================================== *
 * 4. NEW WORDS · grow, change · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'New words');
  K.keywords(s, ['grow', 'change']);
  K.title(s, 'Say the words');
  const { cw, y } = K.wordCards(s, [
    { word: 'grow', say: 'GROW', meaning: 'A puppy grows into a dog.', pics: ANS.GROW },
    { word: 'change', say: 'CHANGE', meaning: 'A caterpillar changes into a butterfly.', pics: ANS.CHANGE },
  ], { h: 3.86, picSize: 1.5, spread: 2.2 });
  [0, 1].forEach((i) => arrow(s, M + i * (cw + 0.30) + cw / 2 - 0.3, y + 0.22 + 0.75 - 0.21, 0.6, `w${i}_arrow`));
  K.banner(s, 'Living things grow and change.', { name: 'w_banner', size: 27 });
  s.addNotes(
    'NEW WORDS: GROW, CHANGE. 5 minutes. Four clicks: "grow", "change", both words leave (say them off the pictures), then the sentence.\n\n'
    + 'POINT AT THE PUPPY, THEN ALONG THE ARROW TO THE DOG. "Small... big. It grows." Then the caterpillar to the butterfly: "It changes." The arrow is the idea: first this, then that.\n\n'
    + 'THE DRILL, 30 seconds a word: you say it, whole class, half the class, three individuals, then off the pictures.\n\n'
    + 'GESTURES, FIXED TODAY AND KEPT ALL UNIT:\n'
    + `  grow = ${G('grow')}.\n  change = ${G('change')}.\n\n`
    + 'PRONUNCIATION. GROW: one beat, "gr" together, and it rhymes with "go". Thai speakers may say "ga-row": no vowel between g and r. CHANGE: one beat, "ch" as in "chair", the end is a soft "j", not "chan".\n\n'
    + 'GROW AND CHANGE ARE NOT THE SAME. A puppy grows: it gets bigger and stays a dog. A caterpillar changes: it becomes a different shape. Do not push the difference hard: both are true of living things, and the banner says so.\n\n'
    + 'THE MEANING LINES are the frame for today, "A puppy grows into a dog." Do not drill "into" as a word. It lives in the frame.'
  );
}

/* ================================================================== *
 * 5. WATCH IT GROW · the animation, on click · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'Look');
  K.keywords(s, ['grow', 'living', 'non-living']);
  K.title(s, 'Watch it grow');
  const vw = 7.8, vh = vw * 9 / 16, vx = M + (CW - vw) / 2, vy = 1.82;
  s.addShape(S.rect, { x: vx - 0.06, y: vy - 0.06, w: vw + 0.12, h: vh + 0.12, fill: { color: 'FFFFFF' }, line: { color: C.tintDeep, width: 1.3 }, objectName: 'vid_bg' });
  s.addMedia({
    type: 'video', path: MEDIA('living-things-grow.mp4'), cover: 'data:image/png;base64,' + fs.readFileSync(MEDIA('living-things-grow.png')).toString('base64'),
    x: vx, y: vy, w: vw, h: vh, objectName: 'grow_video',
  });
  K.banner(s, [['Living things ', false], ['grow', true], ['.', false]], { y: 6.36, h: 0.72, name: 'grow_banner' });
  s.addNotes(
    'WATCH IT GROW. 5 minutes. Click 1 PLAYS THE FILM (22 seconds). Click 2 brings the sentence.\n\n'
    + 'BEFORE THE CLICK: point at the two pots. "A seed. A rock. The same?" They look alike on day 1. Ask: "Which one grows?" Let them guess, and do not say.\n\n'
    + 'THE FILM IS SLOW AND IT STOPS at each stage: seed, root, shoot, leaves, plant. Say each word as it appears and point at it, but DO NOT DRILL root, shoot and leaves: they are not unit words. The word to say is "grow": do the grow gesture with the plant every time it moves.\n\n'
    + 'THE ROCK NEVER CHANGES. At the end the plant has "grows" under it, and the rock has a cross. Point at the rock: "The rock?" Let them answer with the non-living gesture. "A rock is non-living." Say "does not grow" yourself if you like: it is next lesson\'s structure, and hearing it first helps.\n\n'
    + 'PLAY IT TWICE. The second time, the class does the grow gesture with the plant, slowly, from the desk to above their heads. That is the first stand-up moment.\n\n'
    + 'A SEED IS LIVING. If anyone asks, a seed is living: it is a plant waiting to grow. Keep it to that.'
  );
}

/* ================================================================== *
 * 6. THE FRAME · the teacher puts two in order · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'Sentence');
  K.keywords(s, ['grow', 'change']);
  K.title(s, 'First... then...');
  ANS.MODEL.forEach((m, r) => {
    const y = 1.9 + r * 2.08, ph = 1.5;
    K.card(s, { x: M, y, w: CW, h: 1.92, name: `sq${r}` });
    m.seq.forEach((k, j) => {
      const cx = M + 1.15 + j * 2.6;
      K.pic(s, k, cx, y + 0.12 + ph / 2, ph, `sq${r}_p${j}`);
      if (j) arrow(s, cx - 1.6, y + 0.12 + ph / 2 - 0.21, 0.6, `sq${r}_a${j}`);
    });
    s.addText(m.say, { x: M + 7.1, y, w: CW - 7.3, h: 1.92, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sq${r}_t` });
  });
  K.banner(s, [['A ___ ', false], ['grows into', true], [' a ___.', false]]);
  s.addNotes(
    'FIRST... THEN... 5 minutes. YOU put two sets in order; they watch, then join in. Six clicks: three pictures for the plant, three for the chicken, each with its sentence on the last click.\n\n'
    + 'THE FRAME at the bottom is today\'s one sentence: "A ___ grows into a ___." It stays on every speaking slide.\n\n'
    + 'EACH CLICK: point, name it ("a seed", "a seedling", "a plant"), point along the arrow with the grow gesture. On the last picture, say the sentence and point at the frame: "A seed grows into a plant." The class repeats with the gesture.\n\n'
    + 'THE CHICKEN: egg, chick, chicken. "A chick grows into a chicken." If they say "an egg grows into a chicken", that is fine meaning; recast to "a chick grows into a chicken" only if it comes easily.\n\n'
    + '"SEEDLING" is said, not drilled. "A baby plant" is a fine gloss if a student asks.'
  );
}

/* ================================================================== *
 * 7. YOU SAY A · yes or no · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['grow', 'living', 'non-living']);
  K.title(s, 'Do ___ grow?');
  const gap = 0.22, cw = (CW - 5 * gap) / 6, y = 1.9, ch = 3.95;
  ANS.YES_NO.forEach((q, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `yn${i}` });
    K.pic(s, q.key, x + cw / 2, y + 0.15 + 0.72, 1.44, `yn${i}_img`);
    s.addText(`${q.plural}?`, { x: x + 0.05, y: y + 1.85, w: cw - 0.1, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `yn${i}_t` });
    K.tag(s, q.yes ? 'Yes' : 'No', x + 0.15, y + 2.6, cw - 0.3, 0.5, `yn${i}_chip`, q.yes ? LIVE : STONE, 20);
    s.addText(q.yes ? 'living' : 'non-living', { x: x + 0.05, y: y + 3.2, w: cw - 0.1, h: 0.45, color: q.yes ? LIVE : STONE, fontFace: F.body, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `yn${i}_k` });
  });
  K.banner(s, [['Yes. ___ ', false], ['grow', true], ['.      No. A ___ is ', false], ['non-living', true], ['.', false]], { size: 24 });
  s.addNotes(
    'YOU SAY, PART A: YES OR NO. 5 minutes. Six clicks, one answer each.\n\n'
    + 'THE QUESTION: "Do trees grow?" They answer "Yes!" with the grow gesture, and the stronger ones add "Trees grow." "Do rocks grow?" "No! A rock is non-living." Every living thing grows; no non-living thing does.\n\n'
    + 'THE CAR: it gets dirty, it gets old. It does not grow. If anyone says "a car is big", that is a different idea: "Big, yes. It does not grow."\n\n'
    + 'THE BALL: you can blow a ball up and make it bigger. That is not growing: "You make it big. It does not grow." Smile, and move on.\n\n'
    + 'ORDER: whole class, half the class, PAIRS (one asks, one answers), then individuals.\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.YES_NO.map((q) => `${q.plural}: ${q.yes ? 'yes' : 'no'}`).join('; ') + '.'
  );
}

/* ================================================================== *
 * 8. YOU SAY B · which is first? crouch and stand · 7
 * ================================================================== */
{
  const s = K.slide('light', 7, 'You say');
  K.title(s, 'Which is first?');
  s.addText([{ text: 'small: crouch down', options: { color: C.support } }, { text: '     big: stand up!', options: { color: C.accentInk } }], {
    x: RIGHT - 6.0, y: 1.0, w: 6.0, h: 0.6, fontFace: F.body, fontSize: 18, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: 'tpr_line',
  });
  const gap = 0.28, cw = (CW - gap) / 2, ch = 1.95, y0 = 1.85;
  ANS.ORDER.forEach((o, i) => {
    const x = M + (i % 2) * (cw + gap), y = y0 + Math.floor(i / 2) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `fo${i}` });
    const shown = o.flip ? [o.grown, o.young] : [o.young, o.grown];
    shown.forEach((k, j) => {
      const cx = x + cw / 2 + (j ? 1 : -1) * 1.45;
      K.pic(s, k, cx, y + 0.1 + 0.68, 1.36, `fo${i}_p${j}`);
      s.addText(name(k), { x: cx - 1.0, y: y + 1.5, w: 2.0, h: 0.38, color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `fo${i}_n${j}` });
      const first = k === o.young;
      s.addText(first ? '1' : '2', {
        shape: S.ellipse, x: cx - 0.68 - 0.6, y: y + 0.08, w: 0.52, h: 0.52, fill: { color: first ? C.accent : C.dark }, line: { color: 'FFFFFF', width: 1.5 },
        color: first ? C.dark : C.accent, fontFace: F.title, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `fo${i}_b${j}`,
      });
    });
    s.addText('or', { x: x + cw / 2 - 0.3, y: y + 0.6, w: 0.6, h: 0.4, color: C.inkSoft, fontFace: F.title, fontSize: 18, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `fo${i}_or` });
  });
  K.banner(s, [['A ___ ', false], ['grows into', true], [' a ___.', false]]);
  s.addNotes(
    'YOU SAY, PART B: WHICH IS FIRST? 7 minutes, the active one. Four clicks: the numbers 1 and 2 appear on each pair.\n\n'
    + 'THE GAME, everyone standing: point at a picture. If it is the SMALL one, the first one, the class CROUCHES DOWN. If it is the BIG one, they STAND UP with the grow gesture. Then the either/or question: "Which is first: the frog or the tadpole?" "The tadpole!" Then the frame: "A tadpole grows into a frog."\n\n'
    + 'THREE OF THE FOUR PAIRS ARE THE WRONG WAY ROUND on purpose (the frog before the tadpole, the butterfly before the caterpillar, the sunflower before the seedling), so they have to think, not read left to right.\n\n'
    + 'PAIRS FOR TWO MINUTES before the clicks: A points, B crouches or stands and says the frame. Swap.\n\n'
    + 'THE TADPOLE AND THE CATERPILLAR are the surprises: they do not look like the frog or the butterfly. "It changes!" with the change gesture.\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.ORDER.map((o) => ANS.frame(o.young, o.grown)).join(' ')
  );
}

/* ================================================================== *
 * 9. YOU SAY C · stand up, sit still · 6
 * ================================================================== */
{
  const s = K.slide('light', 6, 'You say');
  K.title(s, 'Stand up or sit still?');
  s.addText([{ text: 'living: stand up and grow', options: { color: C.support } }, { text: '     non-living: sit still', options: { color: STONE } }], {
    x: RIGHT - 6.6, y: 1.0, w: 6.6, h: 0.6, fontFace: F.body, fontSize: 18, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: 'tpr_line',
  });
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 1.95, y0 = 1.85;
  ANS.STAND.forEach((k, i) => {
    const x = M + (i % 5) * (cw + gap), y = y0 + Math.floor(i / 5) * (ch + 0.16);
    K.tile(s, k, x, y, cw, ch, `st${i}`, { answer: kind(k) === 'living' ? 'grows' : 'non-living', answerColour: kind(k) === 'living' ? LIVE : STONE });
  });
  K.banner(s, [['A ___ is ', false], ['living', true], ['. It ', false], ['grows', true], ['.', false]]);
  s.addNotes(
    'YOU SAY, PART C: STAND UP OR SIT STILL. 6 minutes. Five clicks, two answers each.\n\n'
    + 'THE GAME: point at a picture. LIVING: they stand up and do the grow gesture. NON-LIVING: they sit completely still with the non-living gesture (still fists). Fast. Anyone who moves on a non-living thing sits out for one picture, then rejoins.\n\n'
    + 'THEN THE OPEN PART: "Tell me: what grows?" Individuals name anything, from the slide or from the room: "A tree grows." "I grow!" Every true answer wins a point for their side of the room.\n\n'
    + 'EVERY PICTURE IS FROM LESSONS 1 AND 2, including the traps: the car moves and does not grow; the teddy looks like an animal and does not grow.\n\n'
    + 'THE FRAME for this slide joins Lesson 1 to today: "A tree is living. It grows." That is next lesson\'s "because" sentence, in two pieces.\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.STAND.map((k) => `${name(k)} ${kind(k) === 'living' ? 'grows' : 'non-living'}`).join(', ') + '.'
  );
}

/* ================================================================== *
 * 10. YOU DO · 6
 * ================================================================== */
{
  const s = K.slide('light', 6, 'You do');
  K.title(s, 'Your worksheet');
  const CARDS = [['A', ['seed', 'sunflower'], 'Put in order.', 'Write 1, 2, 3 under the pictures.'],
    ['B', ['puppy', 'dog'], 'Write.', 'A puppy grows into a dog.'],
    ['C', ['tree', 'rock'], 'Yes or no?', 'Circle yes or no.']];
  const cw = (CW - 2 * 0.30) / 3, y = BODY_Y - 0.05;
  CARDS.forEach(([k, imgs, head, body], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: 2.85, name: `t${i}` });
    imgs.forEach((im, j) => K.pic(s, im, x + 0.62 + j * 0.85, y + 0.65, 0.78, `t${i}_img${j}`));
    s.addText(k, { x: x + cw - 0.9, y: y + 0.2, w: 0.6, h: 0.7, color: C.accentInk, fontFace: F.title, fontSize: 34, bold: true, align: 'right', valign: 'middle', margin: 0, objectName: `t${i}_k` });
    s.addText(head, { x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 23, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_h` });
    s.addText(body, { x: x + 0.3, y: y + 1.8, w: cw - 0.6, h: 0.9, color: C.inkSoft, fontFace: F.body, fontSize: 17, valign: 'top', margin: 0, lineSpacing: 21, objectName: `t${i}_b` });
  });
  const wy = y + 2.85 + 0.25;
  s.addText('Word bank', { x: M, y: wy, w: 1.9, h: 0.6, color: C.support, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'wb_label' });
  s.addText('grow   ·   change   ·   living   ·   non-living', { x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 21, bold: true, valign: 'middle', margin: 0, objectName: 'wb_words' });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  const A = ANS.map(([n, a]) => `${n} ${a}`).join('\n  ');
  s.addNotes(
    'YOU DO. 6 minutes, short on purpose: it is Friday P7. Four clicks: A, B, C, then the banner.\n\n'
    + 'THE WORKSHEET. A: three sets of photographs, jumbled; write 1, 2, 3 under them. B: three picture pairs; write the frame, "A ___ grows into a ___." C: circle yes or no, "Do trees grow?"\n\n'
    + 'CIRCULATE AND ASK ONE THING: point at a pair on their sheet and wait for the sentence.\n\n'
    + 'WHERE THEY WILL STALL: A2, the egg. It goes first. B3, the tadpole: point back to slide 8.\n\n'
    + 'THE ANSWERS are printed upside down at the foot of the sheet:\n  ' + A + '\n\n'
    + 'AT 1 MINUTE REMAINING, stop them. Finish together.'
  );
}

/* ================================================================== *
 * 11. SAY IT TOGETHER · 3
 * ================================================================== */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('Living things grow and change.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const PAIRS = [['seed', 'sunflower'], ['puppy', 'dog'], ['tadpole', 'frog'], ['caterpillar', 'butterfly']];
  const gap = 0.26, cw = (CW - gap) / 2, ch = 1.96;
  PAIRS.forEach(([a, b], i) => {
    const x = M + (i % 2) * (cw + gap), y = 2.5 + Math.floor(i / 2) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, line: C.darkSoft, name: `tg${i}` });
    K.pic(s, a, x + 0.78, y + ch / 2, 1.3, `tg${i}_a`);
    arrow(s, x + 1.53, y + ch / 2 - 0.21, 0.5, `tg${i}_arr`);
    K.pic(s, b, x + 2.73, y + ch / 2, 1.3, `tg${i}_b`);
    s.addText(ANS.frame(a, b), { x: x + 3.48, y, w: cw - 3.56, h: ch, color: C.dark, fontFace: F.title, fontSize: 19, bold: true, align: 'center', valign: 'middle', margin: 0.05, objectName: `tg${i}_t` });
  });
  s.addText('Next lesson: why is a dog living?', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tg_next' });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Four clicks, one sentence each.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the gestures: living (wiggle), grow (palm rising), change (rolling hands).\n\n'
    + 'THEN EACH PAIR: point, and the class says the frame BEFORE the click: "A seed grows into a sunflower." Every one has been said today, so every answer is right.\n\n'
    + 'THE PROMISE ON THE SCREEN: next lesson (Tuesday, the double) is "why?": "A dog is living because it grows." Say "because" once, with a smile, and leave it.\n\n'
    + 'END OF THE WEEK: the last thing they do is stand, crouch, and grow up slowly to standing, together. Then they go.'
  );
}

K.write();

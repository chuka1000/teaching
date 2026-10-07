/**
 * T3 Developing Science (CLIL), Unit 4: What is a living organism? Lesson 2: What Living Things Need.
 * Single, Week 2 Thursday P3, Thursday 22 October 2026, 50 minutes. CLIL shape (CLIL.md).
 *
 * PREVIOUS: Living Or Non-Living (Lesson 1, Thursday 8 October). Its plenary promised "Next lesson: what do living things
 * need?", and this keeps it. Between the two is half-term: two weeks with no T3 lesson. CLIL.md says the lesson after a
 * long gap opens with heavy retrieval, so the first 15 minutes are Lesson 1 again: the same four words, the same
 * photographs, the same gestures and the same frame. Only then the new words.
 *
 * New words (four, the ceiling): need, food, water, air. Frame: "Living things need ___." (and "Plants need water.",
 * "Animals need food."). "Plants need food" is avoided on purpose: plants make their own food and do not eat; the notes
 * say what to do if it comes up. "Because" waits for Lesson 4. Unit objective 2.
 *
 * Every answer comes from build/what-living-things-need-answers.js; what each thing is, from build/living-things-words.js.
 */
const ANS = require('./what-living-things-need-answers');
const K = require('./living-things-kit')({
  lesson: 'What Living Things Need',
  subject: 'T3 Developing Science · Unit 4 Living Organisms · Lesson 2 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, LIVE, STONE, WORDS } = K;
const { name, kind } = WORDS;
const DATE = 'Thursday 22 October 2026';
const G = (w) => WORDS.gesture(w);

/* ================================================================== *
 * 1. TITLE · 1
 * ================================================================== */
{
  const s = K.slide('dark', 1);
  s.addText('LIVING THINGS', {
    x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1.6,
    valign: 'middle', margin: 0, objectName: 'kicker',
  });
  s.addText(DATE, {
    x: RIGHT - 3.6, y: PILL_Y, w: 3.6, h: PILL_H, color: C.tintDeep, fontFace: F.body, fontSize: 13, align: 'right',
    valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addText('What do\nliving things\nneed?', {
    x: M, y: 1.55, w: 6.2, h: 3.2, color: C.tint, fontFace: F.title, fontSize: 46, bold: true, valign: 'top', margin: 0,
    lineSpacing: 58, objectName: 'lesson_title',
  });
  s.addText('Food. Water. Air.', {
    x: M, y: 4.95, w: 6.2, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0,
    objectName: 'lesson_sub',
  });
  const cs = 2.05, gap = 0.28, x0 = 7.75, y0 = 1.45;
  ['dog', 'tree', 'food', 'water'].forEach((k, i) => {
    const x = x0 + (i % 2) * (cs + gap), y = y0 + Math.floor(i / 2) * (cs + gap);
    K.card(s, { x, y, w: cs, h: cs, line: C.darkSoft, r: 0.16, name: `hero${i}` });
    K.pic(s, k, x + cs / 2, y + cs / 2, 1.75, `hero${i}_img`);
  });
  s.addNotes(
    'TITLE. 1 minute. Lesson 2 of 6. THE FIRST LESSON AFTER HALF-TERM: the last T3 lesson was two weeks ago.\n\n'
    + 'POINT AT THE DOG AND THE TREE FIRST and wait. Do not say anything. Somebody will say "living". If they do, wiggle your fingers (the living gesture) and the room will copy. If nobody does, do the gesture yourself and wait again. That is the whole of the first minute.\n\n'
    + 'THEN THE FOOD AND THE WATER. Name them, the class repeats. They are two of today\'s new words: do not drill them yet.\n\n'
    + 'READ THE TITLE together, slowly. "Need" is new: do the need gesture as you say it (' + G('need') + ').\n\n'
    + 'THE PLAN FOR TODAY: 15 minutes getting Lesson 1 back (slides 3 and 4), then the new words. Do not skip the first part to save time. After two weeks, a word nobody has said is a word nobody has.'
  );
}

/* ================================================================== *
 * 2. TODAY · 2
 * ================================================================== */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  const GOALS = [[['dog', 'rock'], 'Sort: living or\nnon-living.'], [['food', 'water'], 'Say what living\nthings need.'], [['writing'], 'Write the sentence.']];
  const cw = (CW - 2 * 0.30) / 3;
  GOALS.forEach(([imgs, text], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.25;
    K.card(s, { x, y, w: cw, h: 3.5, name: `o${i}` });
    s.addText(String(i + 1), {
      x: x + 0.24, y: y + 0.18, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true,
      valign: 'middle', margin: 0, objectName: `o${i}_num`,
    });
    imgs.forEach((k, j) => K.pic(s, k, x + cw / 2 + (j - (imgs.length - 1) / 2) * 1.3, y + 1.0, 1.15, `o${i}_img${j}`));
    s.addText(text, {
      x: x + 0.28, y: y + 1.9, w: cw - 0.56, h: 1.3, color: C.ink, fontFace: F.body, fontSize: 19, bold: true,
      align: 'center', valign: 'top', margin: 0, lineSpacing: 24, objectName: `o${i}_t`,
    });
  });
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + 'Read each goal. The class repeats the KEY WORD only, with its action: "sort" (two hands putting things into two piles, as in Lesson 1), "need" (' + G('need') + '), "write" (write in the air).\n\n'
    + 'GOAL 1 IS LESSON 1 AGAIN, and it is first on purpose. Say so with a smile: "We remember!"\n\n'
    + 'DO NOT READ OBJECTIVES OUT. Three pictures, three short lines, move on.'
  );
}

/* ================================================================== *
 * 3. REMEMBER · the Lesson 1 words, picture first · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'Remember');
  K.keywords(s, ['living', 'non-living', 'plant', 'animal']);
  K.title(s, 'Do you remember?');
  const cw = (CW - 0.30) / 2, ch = 2.28, gapY = 0.2, y0 = BODY_Y - 0.12;
  ANS.REMEMBER.forEach(([word, pics], i) => {
    const x = M + (i % 2) * (cw + 0.30), y = y0 + Math.floor(i / 2) * (ch + gapY);
    const col = word === 'non-living' ? STONE : LIVE;
    K.card(s, { x, y, w: cw, h: ch, line: col, lineWidth: 2.5, name: `rm${i}` });
    pics.forEach((k, j) => K.pic(s, k, x + cw / 2 + (j - 1) * 1.3, y + 0.14 + 0.55, 1.1, `rm${i}_p${j}`));
    s.addText([{ text: word, options: { color: col, fontSize: 32 } }, { text: `   ${WORDS.UNIT_WORDS.find((u) => u[0] === word)[2]}`, options: { color: C.inkSoft, fontSize: 17, italic: true } }], {
      x: x + 0.1, y: y + 1.38, w: cw - 0.2, h: 0.7, fontFace: F.title, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word`,
    });
  });
  s.addNotes(
    'REMEMBER. 5 minutes. Four clicks, one word each. THE PICTURES ARE THE SAME PHOTOGRAPHS AS LESSON 1, and the words are hidden.\n\n'
    + 'THE ORDER MATTERS: point at a set of pictures and WAIT. Let them try the word. Only then click, and the word appears so they can check themselves. After two weeks this is the real test of whether the word is still there.\n\n'
    + 'IF THE ROOM IS SILENT on a word, run the Lesson 1 drill: you say it, whole class, half the class, three individuals, then back to the pictures. Thirty seconds.\n\n'
    + 'THE GESTURES FROM LESSON 1, every time the word is said:\n'
    + `  living = ${G('living')}.\n  non-living = ${G('non-living')}.\n  plant = ${G('plant')}.\n  animal = ${G('animal')}.\n`
    + 'Do the gesture BEFORE you click and see who says the word from the gesture alone.\n\n'
    + 'PRONUNCIATION TO LISTEN FOR (from Lesson 1): LIV-ing with a v, not "li-wing" and not "leaving". AN-i-mal with an l at the end, not "a-ni-man". PLANT in one beat.\n\n'
    + 'THE TREE AND THE DOG ARE IN TWO SETS: tree is living AND a plant; dog is living AND an animal. If anyone points that out, that is the idea of Lesson 1: plants and animals are living.'
  );
}

/* ================================================================== *
 * 4. SORT AGAIN · Lesson 1's frame · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'You say');
  K.title(s, 'Living or non-living?');
  K.pic(s, 'pair', RIGHT - 3.0, PILL_Y + 0.75, 0.75, 'pair_img', { drawing: true });
  s.addText('A points. B says.', {
    x: RIGHT - 2.55, y: PILL_Y + 0.5, w: 2.55, h: 0.5, color: C.support, fontFace: F.body, fontSize: 17, bold: true,
    valign: 'middle', margin: 0, objectName: 'pair_t',
  });
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96, y0 = 1.9;
  ANS.SORT_AGAIN.forEach((k, i) => K.tile(s, k, M + (i % 4) * (cw + gap), y0 + Math.floor(i / 4) * (ch + 0.16), cw, ch, `sa${i}`));
  K.banner(s, [['A ___ is ', false], ['living', true], ['.        A ___ is ', false], ['non-living', true], ['.', false]]);
  s.addNotes(
    'SORT AGAIN. 5 minutes. Four clicks, two answers each. Lesson 1\'s frame is back at the bottom: "A ___ is living. / A ___ is non-living."\n\n'
    + 'EVERY PICTURE WAS ON A LESSON 1 SLIDE, including the traps. The robot and the kite move and are non-living. The cactus does not move and is living. The fish, the horse and the tree are living.\n\n'
    + 'RUN IT: whole class on the first two, then PAIRS (A points, B says the whole sentence; swap after four), then the clicks to check, then two or three individuals.\n\n'
    + 'LISTEN FOR THE WHOLE SENTENCE, not just "living". "A tree is living." If they say "tree living", recast once with the frame and point at it.\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.SORT_AGAIN.map((k) => `${name(k)} ${kind(k)}`).join(', ') + '.'
  );
}

/* ================================================================== *
 * 5. NEW WORDS · food, water, air · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'New words');
  K.keywords(s, ['food', 'water', 'air']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'food', say: 'FOOD', meaning: 'We eat food.', pics: ['food'] },
    { word: 'water', say: 'WA-ter', meaning: 'We drink water.', pics: ['water'] },
    { word: 'air', say: 'AIR', meaning: 'We breathe air.', pics: ['air'] },
  ], { h: 4.6, picSize: 2.1, picNames: false, wordSize: 40 });
  s.addNotes(
    'NEW WORDS: FOOD, WATER, AIR. 5 minutes. Four clicks: food, water, air, then all three words leave and they say them off the pictures.\n\n'
    + 'THE DRILL, 30 seconds a word: you say it, whole class, half the class, three individuals, then off the picture.\n\n'
    + 'GESTURES, FIXED TODAY AND KEPT ALL UNIT:\n'
    + `  food = ${G('food')}.\n  water = ${G('water')}.\n  air = ${G('air')}.\n`
    + 'The meaning lines are the gestures in words: "We eat food" (fingers to mouth), "We drink water" (drink), "We breathe air" (big breath). Do not drill eat, drink and breathe as words. The gesture carries them.\n\n'
    + 'PRONUNCIATION. FOOD: one long "oo", as in "moon". WA-ter: two beats, loudest on WA; British "WAW-tuh", the t is clear, not "wadder". AIR: one beat, open the mouth wide, no r sound at the end in British English. Thai speakers may say "ae": hold the vowel.\n\n'
    + 'AIR IS THE HARD ONE because you cannot see it. The balloon is full of air. Breathe in hard with the gesture, then breathe out on your hand: "air". Have them feel their own breath on their hand.\n\n'
    + 'CHECK with either/or, pointing: "Food or water?" "Water or air?"'
  );
}

/* ================================================================== *
 * 6. NEED · the frame, and the teacher models · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'Sentence');
  K.keywords(s, ['need', 'food', 'water', 'air']);
  K.title(s, 'Living things need...');
  s.addText([{ text: 'need', options: { color: LIVE, bold: true } }, { text: '   NEED', options: { color: C.inkSoft, italic: true, bold: true, fontSize: 18 } }], {
    x: RIGHT - 3.4, y: 1.0, w: 3.4, h: 0.65, fontFace: F.title, fontSize: 32, align: 'right', valign: 'middle', margin: 0, objectName: 'need_word',
  });
  const cw = (CW - 2 * 0.30) / 3, y = 1.85, ch = 4.05;
  ANS.MODEL.forEach(([k, sentence], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: ch, line: LIVE, lineWidth: 2.5, name: `md${i}` });
    K.pic(s, k, x + cw / 2, y + 0.2 + 1.45, 2.9, `md${i}_img`);
    s.addText(sentence, {
      x: x + 0.1, y: y + 3.25, w: cw - 0.2, h: 0.6, color: C.dark, fontFace: F.title, fontSize: 21, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `md${i}_t`,
    });
  });
  K.banner(s, [['Living things ', false], ['need', true], [' ___ .', false]]);
  s.addNotes(
    'NEED, AND THE FRAME. 5 minutes. Three clicks, one sentence each. The frame at the bottom, "Living things need ___.", is on screen from the start and stays on every speaking slide today.\n\n'
    + `NEED is the fourth new word. Gesture: ${G('need')}. Say it with the gesture every time. NEED: one long "ee".\n\n`
    + 'EACH PHOTOGRAPH, the same routine: point, say what you see ("a plant... water"), then the sentence with the gestures ("Plants (open palms) need (pull in) water (drink)."), then click. By the third one, point at the gap in the frame and let THEM say it before you click.\n\n'
    + '"PLANTS NEED", NOT "PLANTS NEEDS". All of today\'s sentences are plural, so "need" never takes an s. If someone says "needs", recast: "plants need".\n\n'
    + 'THE TRAP TO AVOID: "Plants need food." Plants make their own food from light; they do not eat. The slides never say it. If a student says it, say "Plants make food. They need water and air." and move on. Do not teach light: it is not a unit word.\n\n'
    + 'AIR IS FOR EVERYONE: "We need air" is said with the breath gesture. Hold your breath for three seconds with the class: "We need air!" It works.'
  );
}

/* ================================================================== *
 * 7. YOU SAY A · yes or no · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['need', 'food', 'water', 'air']);
  K.title(s, 'Do ___ need ___?');
  const gap = 0.22, cw = (CW - 5 * gap) / 6, y = 1.9, ch = 3.95;
  ANS.YES_NO.forEach((q, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `yn${i}` });
    K.pic(s, q.key, x + cw / 2, y + 0.15 + 0.7, 1.4, `yn${i}_img`);
    s.addText('+', { x, y: y + 1.6, w: cw, h: 0.35, color: C.inkSoft, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `yn${i}_plus` });
    K.pic(s, q.need, x + cw / 2, y + 2.35, 0.75, `yn${i}_need`);
    s.addText(`${q.plural}\nneed ${q.need}?`, {
      x: x + 0.05, y: y + 2.75, w: cw - 0.1, h: 0.62, color: C.dark, fontFace: F.body, fontSize: 15, bold: true,
      align: 'center', valign: 'middle', margin: 0, lineSpacing: 18, objectName: `yn${i}_t`,
    });
    K.tag(s, q.yes ? 'Yes' : 'No', x + 0.15, y + 3.42, cw - 0.3, 0.42, `yn${i}_chip`, q.yes ? LIVE : STONE, 18);
  });
  K.banner(s, [['Yes. ', false], ['Living things need ___.', true], ['      No. A ___ is ', false], ['non-living', true], ['.', false]], { size: 24 });
  s.addNotes(
    'YOU SAY, PART A: YES OR NO. 5 minutes. Six clicks, one answer each.\n\n'
    + 'THE QUESTION IS "Do ___ need ___?" Read the first one to them, pointing at the two pictures: "Do flowers need water?" They answer "Yes!" with the need gesture. Then the stronger ones add the sentence: "Yes. Flowers need water."\n\n'
    + 'THE NO ANSWERS ARE THE POINT OF THE SLIDE. "Do rocks need water?" "No! A rock is non-living." Non-living things do not need food, water or air. That links today to Lesson 1, and it is the idea Lesson 4 will build the "because" sentences on.\n\n'
    + 'THE TEDDY: it looks like an animal (Lesson 1). It does not need food. Pretend to feed it and look disappointed.\n\n'
    + 'THE CAR: a sharp student may say "a car needs petrol". True, and petrol is not food: "A car is non-living." Do not teach petrol.\n\n'
    + 'ORDER: whole class, half the class, PAIRS (one asks, one answers), then individuals.\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.YES_NO.map((q) => `${q.plural} + ${q.need}: ${q.yes ? 'yes' : 'no'}`).join('; ') + '.'
  );
}

/* ================================================================== *
 * 8. YOU SAY B · either/or, in pairs · 6
 * ================================================================== */
{
  const s = K.slide('light', 6, 'You say');
  K.title(s, 'Living things need...');
  K.pic(s, 'pair', RIGHT - 3.0, PILL_Y + 0.75, 0.75, 'pair_img', { drawing: true });
  s.addText('A asks. B says.', {
    x: RIGHT - 2.55, y: PILL_Y + 0.5, w: 2.55, h: 0.5, color: C.support, fontFace: F.body, fontSize: 17, bold: true,
    valign: 'middle', margin: 0, objectName: 'pair_t',
  });
  const gap = 0.28, cw = (CW - 2 * gap) / 3, ch = 1.95, y0 = 1.9;
  ANS.EITHER.forEach((q, i) => {
    const x = M + (i % 3) * (cw + gap), y = y0 + Math.floor(i / 3) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `eo${i}` });
    [q.a, q.b].forEach((k, j) => {
      const cx = x + cw / 2 + (j ? 1 : -1) * 1.08;
      if (k === q.answer) {
        s.addShape(S.roundRect, { x: cx - 0.74, y: y + 0.08, w: 1.48, h: 1.82, rectRadius: 0.12, fill: { color: 'E6F2E3' }, line: { color: LIVE, width: 3.5 }, objectName: `eo${i}_ring` });
      }
      K.pic(s, k, cx, y + 0.78, 1.2, `eo${i}_p${j}`);
      s.addText(name(k), {
        x: cx - 0.8, y: y + 1.45, w: 1.6, h: 0.38, color: C.dark, fontFace: F.body, fontSize: 18, bold: true,
        align: 'center', valign: 'middle', margin: 0, objectName: `eo${i}_n${j}`,
      });
    });
    s.addText('or', { x: x + cw / 2 - 0.3, y: y + 0.6, w: 0.6, h: 0.4, color: C.inkSoft, fontFace: F.title, fontSize: 18, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `eo${i}_or` });
  });
  K.banner(s, [['Living things ', false], ['need', true], [' ___ .', false]]);
  s.addNotes(
    'YOU SAY, PART B: EITHER/OR, IN PAIRS. 6 minutes. Six clicks: a green box lands on the right answer each time.\n\n'
    + 'THE QUESTION: "Water or a phone?" The answer is the whole frame: "Living things need water." The wrong one is always a non-living thing from Lesson 1, so the silly answer gets a laugh ("Living things need a phone?" Some of them will argue for the phone).\n\n'
    + 'RUN IT: do the first two with the whole class. Then PAIRS: A asks the either/or question, B says the sentence; swap halfway. Walk the room and listen. Then the clicks to check, then individuals.\n\n'
    + 'THE KITE AND THE AIR, the last one: a kite flies in the air, so both pictures are about air. The answer is air. If anyone says "a kite needs air", that is clever and true: "Yes! And a kite is non-living."\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.EITHER.map((q) => `${name(q.a)} or ${name(q.b)}: ${name(q.answer)}`).join('; ') + '.'
  );
}

/* ================================================================== *
 * 9. YOU SAY C · open: what do they need? · 5
 * ================================================================== */
{
  const s = K.slide('light', 5, 'You say');
  K.title(s, 'What do they need?');
  const gap = 0.26, cw = (CW - 3 * gap) / 4, y = 1.9, ch = 3.95;
  ANS.OPEN.forEach((k, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `op${i}` });
    K.pic(s, k, x + cw / 2, y + 0.18 + 1.12, 2.24, `op${i}_img`);
    s.addText(name(k), {
      x: x + 0.1, y: y + 2.55, w: cw - 0.2, h: 0.5, color: C.dark, fontFace: F.title, fontSize: 24, bold: true,
      align: 'center', valign: 'middle', margin: 0, objectName: `op${i}_t`,
    });
    const living = kind(k) === 'living';
    if (living) {
      ANS.NEEDS.forEach((nd, j) => K.pic(s, nd, x + cw / 2 + (j - 1) * 0.72, y + 3.45, 0.6, `op${i}_n${j}`));
    } else {
      K.tag(s, 'non-living', x + 0.3, y + 3.2, cw - 0.6, 0.5, `op${i}_n0`, STONE, 17);
    }
  });
  K.banner(s, [['Living things ', false], ['need', true], [' ___ .', false]]);
  s.addNotes(
    'YOU SAY, PART C: OPEN. 5 minutes. Four clicks, one answer each.\n\n'
    + 'THE OPEN QUESTION: point at the cow and ask "What do cows need?" Any of food, water or air is right, so every student can answer: "Cows need food." "Cows need water." Collect all three from different students before you click. The click shows all three.\n\n'
    + 'THE SUNFLOWER: water and air, yes. If they say food, see slide 6: "Plants make food." The click shows all three needs for every living thing, so do not fight it; that line is in the notes for you, not for them.\n\n'
    + 'THE ROBOT IS THE LAST ONE, and there is no right need. "What do robots need?" Wait. Somebody says "No!" or "non-living". That is the answer: "A robot is non-living." If anyone says "electricity", it is true and it is not food, water or air.\n\n'
    + 'PAIRS FOR ONE MINUTE before the clicks: "Tell your partner: cows need..., birds need..."\n\n'
    + 'EXTENSION for anyone flying: "What do YOU need?" "I need water." "I need food."'
  );
}

/* ================================================================== *
 * 10. YOU DO · 8
 * ================================================================== */
{
  const s = K.slide('light', 8, 'You do');
  K.title(s, 'Your worksheet');
  const CARDS = [['A', ['eyes'], 'Look and write.', 'Write the word for each picture.'],
    ['B', ['dog', 'rock'], 'Sort.', 'Living or non-living? Write each word in the right box.'],
    ['C', ['writing'], 'Write.', 'Write the sentence: Plants need water.']];
  const cw = (CW - 2 * 0.30) / 3, y = BODY_Y - 0.05;
  CARDS.forEach(([k, imgs, head, body], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: 2.85, name: `t${i}` });
    imgs.forEach((im, j) => K.pic(s, im, x + 0.62 + j * 0.85, y + 0.65, 0.78, `t${i}_img${j}`));
    s.addText(k, {
      x: x + cw - 0.9, y: y + 0.2, w: 0.6, h: 0.7, color: C.accentInk, fontFace: F.title, fontSize: 34, bold: true,
      align: 'right', valign: 'middle', margin: 0, objectName: `t${i}_k`,
    });
    s.addText(head, {
      x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 0.55, color: C.dark, fontFace: F.title, fontSize: 23, bold: true,
      valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(body, {
      x: x + 0.3, y: y + 1.8, w: cw - 0.6, h: 0.9, color: C.inkSoft, fontFace: F.body, fontSize: 17, valign: 'top', margin: 0,
      lineSpacing: 21, objectName: `t${i}_b`,
    });
  });
  const wy = y + 2.85 + 0.25;
  s.addText('Word bank', {
    x: M, y: wy, w: 1.9, h: 0.6, color: C.support, fontFace: F.body, fontSize: 15, bold: true, charSpacing: 1, valign: 'middle',
    margin: 0, objectName: 'wb_label',
  });
  s.addText('need   ·   food   ·   water   ·   air   ·   living   ·   non-living', {
    x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 21, bold: true, valign: 'middle', margin: 0,
    objectName: 'wb_words',
  });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  const A = Object.fromEntries(ANS.map(([n, a]) => [n, a]));
  s.addNotes(
    'YOU DO. 8 minutes. Four clicks: A, B, C, then the banner. The word bank stays on screen.\n\n'
    + 'THE WORKSHEET. A: three photographs (water, air, food), write the word. B: eight Lesson 1 things to sort into the living and non-living boxes, more retrieval after the break. C: seven sentences from today\'s frame, the last one written whole.\n\n'
    + 'CIRCULATE AND ASK ONE THING: point at a picture on their sheet and wait. They say the sentence.\n\n'
    + 'WHERE THEY WILL STALL: A2, air, because the picture is the hardest; point at the balloon and breathe. C4, "Cats need ___": food, water or air are all right. C5 is Lesson 1\'s frame, not today\'s.\n\n'
    + 'THE ANSWERS are printed upside down at the foot of the sheet.\n'
    + `  A: ${A.A}\n  B: ${A.B}\n  C: ${ANS.filter(([n]) => n.startsWith('C')).map(([n, a]) => `${n} ${a}`).join('  ')}\n\n`
    + 'AT 2 MINUTES REMAINING, stop them. The last slide says it all together.'
  );
}

/* ================================================================== *
 * 11. SAY IT TOGETHER · 3
 * ================================================================== */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('Living things need food, water and air.', {
    x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0,
    objectName: 'tg_sentence',
  });
  const TILES = [['tree', 'water'], ['dog', 'food'], ['rock', null], ['cat', 'air'], ['bird', 'water'], ['phone', null], ['horse', 'food'], ['flower', 'air']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach(([k, need], i) => {
    const x = M + (i % 4) * (cw + gap), y = 2.5 + Math.floor(i / 4) * (ch + 0.16);
    const answer = need ? `need ${need}` : 'non-living';
    K.tile(s, k, x, y, cw, ch, `tl${i}`, { line: C.darkSoft, tick: true, label: need ? `${name(k)}s` : name(k), answer, answerColour: need ? LIVE : STONE });
  });
  s.addText('Next lesson: living things grow.', {
    x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0,
    objectName: 'tg_next',
  });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Four clicks, two answers each, with a tick.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the gestures: living (wiggle), need (pull in), food (fingers to mouth), water (drink), air (big breath).\n\n'
    + 'THEN THE PICTURES: point at each and the class says a sentence BEFORE the click. "Trees need water." "A rock is non-living." The click shows one right answer; any of food, water or air is right for a living thing. Every student leaves having said eight correct sentences.\n\n'
    + 'THE PROMISE ON THE SCREEN: tomorrow, Friday, is Lesson 3, living things grow. It is the last lesson of the week, so it is the active one.\n\n'
    + 'BEFORE THEY GO: two or three individuals say "I need..." with a gesture. That is the exit ticket.'
  );
}

K.write();

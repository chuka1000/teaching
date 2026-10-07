/**
 * T3 Developing Science (CLIL), Unit 4: What is a living organism? Lessons 4 and 5: Why Is It Living?
 * The DOUBLE: Week 1 Tuesday P3 to P4, 10:00 to 11:40, Tuesday 27 October 2026. ONE deck (CLIL.md, TIMETABLE.md):
 *   first half   50 min   "because": why a thing is living or non-living
 *   break         5 min   the slide carries the unit's gestures, so the break recalls them (CLIL.md)
 *   second half  45 min   the hands-on part: a living-things hunt round the room, Life on Land (SDG 15), and a
 *                         rehearsal of Thursday's assessment in its own formats
 * The split follows CLIL.md's worked arithmetic for the Atoms double (50 + 5 + 45); the phase timers total 95.
 *
 * PREVIOUS: Living Things Grow (Lesson 3, Friday 23 October). Its plenary promised "Next lesson: why is a dog living?"
 * NEXT: the unit assessment, Thursday 29 October; the last slide says so.
 *
 * New words: eat, because (and the structure "does not"). Frame: "A ___ is living because it ___." The reasons are the
 * unit's verbs only (grows, eats, changes, needs ...); "it moves" is never a reason (build/why-is-it-living-answers.js).
 * Every answer comes from that module; what each thing is, from build/living-things-words.js.
 */
const ANS = require('./why-is-it-living-answers');
const K = require('./living-things-kit')({
  lesson: 'Why Is It Living',
  title: 'Why Is It Living?',
  subject: 'T3 Developing Science · Unit 4 Living Organisms · Lesson 4 and 5 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, LIVE, STONE, LIVE_TINT, STONE_TINT, WORDS } = K;
const { name, kind } = WORDS;
const DATE = 'Tuesday 27 October 2026';
const G = (w) => WORDS.gesture(w);
const EAT = 'fingers to the mouth, then chew';
const BECAUSE = 'hook the two index fingers together, like two links of a chain';
const FRAME = [['A ___ is living ', false], ['because', true], [' it ___.', false]];

function titleSlide(text, sub, heroes, notes, mins = 1, label) {
  const s = K.slide('dark', mins, label);
  if (!label) s.addText('LIVING THINGS', { x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker' });
  s.addText(DATE, { x: RIGHT - 3.6, y: PILL_Y, w: 3.6, h: PILL_H, color: C.tintDeep, fontFace: F.body, fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date' });
  s.addText(text, { x: M, y: 1.75, w: 6.2, h: 2.5, color: C.tint, fontFace: F.title, fontSize: 46, bold: true, valign: 'top', margin: 0, lineSpacing: 58, objectName: 'lesson_title' });
  s.addText(sub, { x: M, y: 4.55, w: 6.2, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: 'lesson_sub' });
  const cs = 2.05, gap = 0.28, x0 = 7.75, y0 = 1.45;
  heroes.forEach((k, i) => {
    const x = x0 + (i % 2) * (cs + gap), y = y0 + Math.floor(i / 2) * (cs + gap);
    K.card(s, { x, y, w: cs, h: cs, line: C.darkSoft, r: 0.16, name: `hero${i}` });
    K.pic(s, k, x + cs / 2, y + cs / 2, 1.75, `hero${i}_img`);
  });
  s.addNotes(notes);
  return s;
}
function goals(s, list) {
  const cw = (CW - 2 * 0.30) / 3;
  list.forEach(([imgs, text], i) => {
    const x = M + i * (cw + 0.30), y = BODY_Y + 0.25;
    K.card(s, { x, y, w: cw, h: 3.5, name: `o${i}` });
    s.addText(String(i + 1), { x: x + 0.24, y: y + 0.18, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `o${i}_num` });
    imgs.forEach((k, j) => K.pic(s, k, x + cw / 2 + (j - (imgs.length - 1) / 2) * 1.3, y + 1.0, 1.15, `o${i}_img${j}`));
    s.addText(text, { x: x + 0.28, y: y + 1.9, w: cw - 0.56, h: 1.3, color: C.ink, fontFace: F.body, fontSize: 19, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 24, objectName: `o${i}_t` });
  });
}
/** A reason chip: green for a living reason, slate for a non-living one. */
const reason = (s, text, living, x, y, w, h, nm, size = 16) => K.tag(s, text, x, y, w, h, nm, living ? LIVE : STONE, size);

/* ================================================================== *
 * FIRST HALF · 50 minutes · because
 * ================================================================== */

/* 1. TITLE · 1 */
titleSlide('Why is it\nliving?', 'Because...', ['dog', 'rock', 'tree', 'car'],
  'TITLE. 1 minute. Lessons 4 and 5 of 6: THE DOUBLE, 100 minutes in one deck. First half "because" (50 min), a 5-minute break (slide 11), then the hunt (45 min). Thursday is the assessment.\n\n'
  + 'POINT AT THE DOG AND ASK "Living or non-living?" (Lesson 1). They answer. Then ask "WHY?" with open hands, and wait. That is the question of the whole lesson. Do not answer it yet.\n\n'
  + 'THE ROCK, THE TREE, THE CAR: the same two questions, quickly. If somebody says "it moves" for the dog, smile and point at the car: it moves too. Moving is not the reason. The lesson gives them the real reasons.');

/* 2. TODAY · 2 */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  goals(s, [[['dog', 'rock'], 'Say why:\nbecause...'], [['magnifier'], 'Hunt for living\nthings.'], [['writing'], 'Write: A dog is living\nbecause it grows.']]);
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + `Read each goal. The class repeats the key word with its action: "because" (${BECAUSE}), "hunt" (a hand over the eyes, looking round), "write" (write in the air).\n\n`
    + 'GOAL 1 IS THE FIRST HALF, GOAL 2 IS AFTER THE BREAK. Say so, and point at the break: "First because. Then a break. Then the hunt!"'
  );
}

/* 3. REMEMBER · all ten unit words, picture first · 6 */
{
  const s = K.slide('light', 6, 'Remember');
  K.title(s, 'Do you remember?');
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 1.98, y0 = 1.85;
  ANS.REMEMBER.forEach(([k, word], i) => {
    const x = M + (i % 5) * (cw + gap), y = y0 + Math.floor(i / 5) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rm${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.62, 1.24, `rm${i}_img`);
    s.addText(word, { x: x + 0.05, y: y + 1.44, w: cw - 0.1, h: 0.46, color: word === 'non-living' ? STONE : LIVE, fontFace: F.title, fontSize: word.length > 7 ? 20 : 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word` });
  });
  K.banner(s, [['Living things ', false], ['grow', true], [' and ', false], ['need', true], [' food, water and air.', false]], { size: 24 });
  s.addNotes(
    'REMEMBER. 6 minutes. Five clicks, two words each: all TEN words of the unit, with the photographs they were taught with.\n\n'
    + 'POINT AT A PICTURE AND WAIT. They say the word and do its gesture before you click. The gestures, all fixed in Lessons 1 to 3:\n'
    + WORDS.UNIT_WORDS.map(([w, , , g]) => `  ${w} = ${g}.`).join('\n') + '\n\n'
    + 'THIS IS ALSO THURSDAY\'S WORD LIST. The assessment uses these ten words and these photographs. A word that is weak today: drill it now, 30 seconds.\n\n'
    + 'THE BANNER joins Lessons 2 and 3 into one sentence: "Living things grow and need food, water and air." Say it together with the gestures.'
  );
}

/* 4. NEW WORDS · eat, because · 5 */
{
  const s = K.slide('light', 5, 'New words');
  K.keywords(s, ['eat', 'because']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'eat', say: 'EAT', meaning: 'A cow eats grass.', pics: ['grazing'] },
    { word: 'because', say: 'be-CAUSE', meaning: 'Why is a dog living? Because it grows.', pics: ['question', 'dog'] },
  ], { h: 4.1, picSize: 1.75, spread: 2.0, picNames: false });
  s.addNotes(
    'NEW WORDS: EAT, BECAUSE. 5 minutes. Three clicks: "eat", "because", then both words leave and they say them off the pictures.\n\n'
    + 'EAT: they have done the food gesture since Lesson 2 ("We eat food"). Now it is a word. Gesture: ' + EAT + '. EAT: one long "ee". Thai speakers may cut it short ("it"): "it" is a different word, so hold the "ee".\n\n'
    + 'BECAUSE: be-CAUSE, two beats, loudest on the second. Gesture: ' + BECAUSE + '. It joins two ideas: "Living..." (link) "...it grows."\n\n'
    + 'BOTH GESTURES ARE FIXED TODAY AND KEPT FOR THURSDAY.\n\n'
    + '"IT GROWS", WITH AN S. Until now they have said "trees grow", "plants need" (no s). With "it", the verb takes an s: "it grows", "it eats", "it needs". Hiss the s and point at it in the meaning lines. Recast "it grow" to "it grows" every time; do not explain the rule.\n\n'
    + 'DOES NOT: the non-living side needs "it does not grow", "it does not eat". Shake your head with the non-living gesture. It is on the next slide.'
  );
}

/* 5. THE FRAME · the teacher builds three sentences · 6 */
{
  const s = K.slide('light', 6, 'Sentence');
  K.keywords(s, ['because', 'eat', 'grow']);
  K.title(s, 'Why?');
  const rowH = 1.28, y0 = 1.85;
  const W4 = [2.15, 2.35, 1.75, 3.35], gapX = 0.16;
  ANS.MODEL.forEach(([k, parts], r) => {
    const y = y0 + r * (rowH + 0.14);
    const living = kind(k) === 'living';
    K.pic(s, k, M + 0.6, y + rowH / 2, 1.2, `md${r}_img`);
    let x = M + 1.45;
    parts.forEach((t, j) => {
      const fill = j === 2 ? C.dark : (j === 1 || j === 3) ? (living ? LIVE_TINT : STONE_TINT) : 'FFFFFF';
      const col = j === 2 ? C.accent : (j === 1 || j === 3) ? (living ? LIVE : STONE) : C.dark;
      s.addText(t, {
        shape: S.roundRect, rectRadius: 0.1, x, y: y + 0.2, w: W4[j], h: rowH - 0.4, fill: { color: fill }, line: { color: j === 2 ? C.dark : C.tintDeep, width: 1.2 },
        color: col, fontFace: F.title, fontSize: 23, bold: true, align: 'center', valign: 'middle', margin: 0.04, objectName: `md${r}_c${j}`,
      });
      x += W4[j] + gapX;
    });
  });
  K.banner(s, FRAME);
  s.addNotes(
    'WHY? 6 minutes. YOU build three sentences, one piece per click (four clicks each, twelve in all). The frame at the bottom, "A ___ is living because it ___.", stays on every speaking slide today.\n\n'
    + 'EACH SENTENCE: point at the photograph. Click the first piece ("A dog"), then "is living" (Lesson 1), then the dark BECAUSE with the link gesture, then the reason. Say each piece as it lands; the class repeats the whole sentence at the end with all the gestures.\n\n'
    + 'THE REASONS ARE THE UNIT\'S WORDS: it grows (Lesson 3), it eats (today), it needs water / food / air (Lesson 2), it changes (Lesson 3). Nothing else. NOT "it moves": the car, the robot and the kite all move and are non-living.\n\n'
    + 'THE ROCK: "A rock is non-living because it does not eat." Shake your head on "does not". This is the sentence from the unit plan.\n\n'
    + 'GREEN PIECES ARE LIVING, GREY ARE NON-LIVING, the colours from Lesson 1. "Because" is always the dark piece in the middle.'
  );
}

/* 6. YOU SAY A · right or wrong? · 5 */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['because']);
  K.title(s, 'Right or wrong?');
  const gap = 0.24, cw = (CW - 2 * gap) / 3, ch = 1.95, y0 = 1.85;
  ANS.RIGHT.forEach((q, i) => {
    const x = M + (i % 3) * (cw + gap), y = y0 + Math.floor(i / 3) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rw${i}` });
    K.pic(s, q.key, x + 0.8, y + 0.72, 1.2, `rw${i}_img`);
    s.addText(q.say, { x: x + 1.55, y: y + 0.1, w: cw - 1.65, h: 1.3, color: C.dark, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, lineSpacing: 20, objectName: `rw${i}_t` });
    K.tag(s, q.yes ? 'Yes, right' : 'No, wrong', x + 1.55, y + 1.42, 1.8, 0.42, `rw${i}_chip`, q.yes ? LIVE : C.alert, 16);
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART A: RIGHT OR WRONG? (YES OR NO). 5 minutes. Six clicks, one answer each.\n\n'
    + 'READ A SENTENCE ALOUD, pointing at the photograph. The class answers "Yes!" (thumbs up) or "No!" (thumbs down). That is the whole answer at this stage. The stronger ones then FIX the wrong ones: "No. A rock is non-living because it does not eat."\n\n'
    + 'THE CAR, "because it moves", is the one to slow down on. Moving is not a reason (the robot and the kite move too). "A car is non-living because it does not grow."\n\n'
    + 'THE CAT, "non-living because it eats": the reason is true, the first half is wrong. Fix: "A cat is living because it eats."\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.RIGHT.map((q) => `${name(q.key)} ${q.yes ? 'right' : 'wrong'}`).join(', ') + '.'
  );
}

/* 7. YOU SAY B · grows or does not grow? pairs · 8 */
{
  const s = K.slide('light', 8, 'You say');
  K.title(s, 'Grows or does not grow?');
  K.pic(s, 'pair', RIGHT - 3.0, PILL_Y + 0.75, 0.75, 'pair_img', { drawing: true });
  s.addText('A points. B says.', { x: RIGHT - 2.55, y: PILL_Y + 0.5, w: 2.55, h: 0.5, color: C.support, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'pair_t' });
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96, y0 = 1.9;
  ANS.EITHER.forEach((q, i) => {
    const x = M + (i % 4) * (cw + gap), y = y0 + Math.floor(i / 4) * (ch + 0.16);
    K.tile(s, q.key, x, y, cw, ch, `eo${i}`, { answer: q.living ? 'grows' : 'does not grow', answerColour: q.living ? LIVE : STONE });
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART B: EITHER/OR, IN PAIRS. 8 minutes, the biggest block of the first half. Four clicks, two answers each.\n\n'
    + 'THE QUESTION: "Horse: grows or does not grow?" The answer is the WHOLE frame: "A horse is living because it grows." "A ball is non-living because it does not grow."\n\n'
    + 'RUN IT: the first two with the whole class. Then PAIRS: A points, B says the whole sentence; swap after four. Walk the room and listen for the s on "grows" and for "because". Then the clicks to check, then individuals.\n\n'
    + 'THE ROBOT AND THE KITE move, the teddy looks like an animal (Lesson 1): all three "do not grow". The fish and the bird grow.\n\n'
    + 'EXTENSION for anyone flying: use another reason. "A horse is living because it eats." "A fish is living because it needs water."\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.EITHER.map((q) => q.say).join(' ')
  );
}

/* 8. YOU SAY C · open: why? · 6 */
{
  const s = K.slide('light', 6, 'You say');
  K.title(s, 'Why? You choose.');
  s.addText('grows   ·   eats   ·   changes   ·   needs water   ·   needs food   ·   needs air', { x: M, y: 1.72, w: CW, h: 0.45, color: C.support, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'reasons' });
  const gap = 0.26, cw = (CW - 3 * gap) / 4, y = 2.3, ch = 3.6;
  ANS.OPEN.forEach((q, i) => {
    const x = M + i * (cw + gap);
    const living = kind(q.key) === 'living';
    K.card(s, { x, y, w: cw, h: ch, name: `op${i}` });
    K.pic(s, q.key, x + cw / 2, y + 0.15 + 0.95, 1.9, `op${i}_img`);
    s.addText(name(q.key), { x: x + 0.1, y: y + 2.12, w: cw - 0.2, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `op${i}_t` });
    q.why.forEach((w, j) => reason(s, w.replace(/\.$/, ''), living, x + 0.2, y + 2.65 + j * 0.45, cw - 0.4, 0.38, `op${i}_r${j}`, 14));
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART C: OPEN. 6 minutes. Four clicks, two good reasons each.\n\n'
    + 'NOW THEY CHOOSE THE REASON. The strip under the title lists all the reasons the unit has. Point at the cow: "Why is a cow living?" Any true reason is right: "because it eats", "because it needs water", "because it grows". Collect three different reasons from three students BEFORE you click. The click shows two of them; theirs may be different and still right.\n\n'
    + 'THE BICYCLE is the non-living one: "because it does not grow", "because it does not eat". If someone says "because it does not move", it does move: point at the wheels.\n\n'
    + 'THE BUTTERFLY: "because it changes" is the best answer here (Lesson 3: a caterpillar changes into a butterfly).\n\n'
    + 'PAIRS FOR ONE MINUTE first: "Tell your partner two reasons for the cow."\n\n'
    + 'GOOD ANSWERS (from the answers module): ' + ANS.OPEN.map((q) => q.say.join(' ')).join(' ')
  );
}

/* 9. YOU DO · part 1 · 8 */
{
  const s = K.slide('light', 8, 'You do');
  K.title(s, 'Your worksheet: part 1');
  const CARDS = [['A', ['cat'], 'Finish it.', 'grows or does not grow?'], ['B', ['horse', 'phone'], 'Write why.', 'A horse is living because...'], ['C', ['kite'], 'Right or wrong?', 'Circle. Then fix the wrong ones.']];
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
  s.addText('because   ·   grows   ·   eats   ·   does not grow   ·   living   ·   non-living', { x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: 'wb_words' });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  s.addNotes(
    'YOU DO, PART 1. 8 minutes. Four clicks: A, B, C, then the banner. Page 1 of the worksheet; page 2 is the hunt, after the break.\n\n'
    + 'A: four sentences, finish with "grows" or "does not grow". B: three photographs, write the whole because sentence. C: three sentences, circle right or wrong, and fix the wrong ones.\n\n'
    + 'CIRCULATE AND ASK ONE THING: point at a photograph and wait for the because sentence.\n\n'
    + 'WHERE THEY WILL STALL: B, the whole sentence. Point at the frame on the slide and let them copy its shape. C2, the kite "moves": wrong, and they must say why.\n\n'
    + 'THE ANSWERS are upside down at the foot of page 2:\n  ' + ANS.map(([n, a]) => `${n} ${a}`).join('\n  ')
  );
}

/* 10. SAY IT TOGETHER · before the break · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('A ___ is living because it ___.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const TILES = [['dog', 'grows'], ['rock', 'does not grow'], ['cow', 'eats'], ['phone', 'does not eat'], ['flower', 'needs water'], ['robot', 'does not grow'], ['butterfly', 'changes'], ['teddy', 'does not eat']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach(([k, why], i) => {
    const x = M + (i % 4) * (cw + gap), y = 2.5 + Math.floor(i / 4) * (ch + 0.16);
    K.tile(s, k, x, y, cw, ch, `tl${i}`, { line: C.darkSoft, tick: true, answer: why, answerColour: kind(k) === 'living' ? LIVE : STONE });
  });
  s.addText('Next: a break. Then the hunt!', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tg_next' });
  s.addNotes(
    'SAY IT TOGETHER, BEFORE THE BREAK. 3 minutes. Four clicks, two answers each.\n\n'
    + 'POINT AT EACH PHOTOGRAPH and the class says the whole sentence BEFORE the click: "A dog is living because it grows." The click shows one reason; any true reason is right. Every one is from today.\n\n'
    + 'THEN THE BREAK. Go straight to the next slide.'
  );
}

/* ================================================================== *
 * BREAK · 5 · the unit's gestures
 * ================================================================== */
{
  const s = K.slide('dark', 5, 'Break', { count: false });
  K.title(s, 'Break. Stand up and stretch!', 'dark');
  const LIST = [['dog', 'living'], ['rock', 'non-living'], ['tree', 'plant'], ['cat', 'animal'], ['watering', 'need'], ['food', 'food'], ['water', 'water'], ['air', 'air'], ['puppy', 'grow'], ['caterpillar', 'change'], ['grazing', 'eat'], ['question', 'because']];
  const SHORT = { living: 'wiggle your fingers', 'non-living': 'still fists', plant: 'open your palms', animal: 'paws, scratch', need: 'pull in', food: 'fingers to mouth', water: 'drink', air: 'big breath', grow: 'palm up, slowly', change: 'roll your hands', eat: 'chew', because: 'link fingers' };
  const gap = 0.18, cw = (CW - 5 * gap) / 6, ch = 2.3, y0 = 1.85;
  LIST.forEach(([k, w], i) => {
    const x = M + (i % 6) * (cw + gap), y = y0 + Math.floor(i / 6) * (ch + 0.18);
    K.card(s, { x, y, w: cw, h: ch, line: C.darkSoft, name: `bk${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.55, 1.1, `bk${i}_img`);
    s.addText(w, { x: x + 0.05, y: y + 1.28, w: cw - 0.1, h: 0.42, color: w === 'non-living' ? STONE : LIVE, fontFace: F.title, fontSize: w.length > 7 ? 17 : 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `bk${i}_w` });
    s.addText(SHORT[w], { x: x + 0.05, y: y + 1.72, w: cw - 0.1, h: 0.5, color: C.inkSoft, fontFace: F.body, fontSize: 13, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 15, objectName: `bk${i}_g` });
  });
  s.addNotes(
    'BREAK. 5 minutes. Not counted in the 95 minutes of phases: the timer runs, the pill says BREAK. Nothing to click.\n\n'
    + 'THE BREAK CARRIES THE GESTURES (CLIL.md). Everyone stands. Point at each card in turn: say the word, the class does the gesture. Then go faster. Then point without speaking: they say the word AND do the gesture. Two rounds, then let them breathe, drink water ("we need water!") and sit down.\n\n'
    + 'THE TWELVE GESTURES, all fixed in this unit:\n'
    + WORDS.UNIT_WORDS.map(([w, , , g]) => `  ${w} = ${g}.`).join('\n') + `\n  eat = ${EAT}.\n  because = ${BECAUSE}.\n\n`
    + 'THE SHORT LINES ON THE CARDS are reminders for you and for them, not words to teach.'
  );
}

/* ================================================================== *
 * SECOND HALF · 45 minutes · the living-things hunt
 * ================================================================== */

/* 12. PART 2 · 2 */
titleSlide('The living\nthings hunt', 'Look. Find. Say why.', ['magnifier', 'girl', 'cactus', 'chair'],
  'PART 2. 2 minutes. THE HANDS-ON HALF of the double (CLIL.md: the second half is where the practical goes). No equipment: the classroom is the specimen tray.\n\n'
  + 'READ THE TITLE together. "Hunt" is said, not drilled: a hand over the eyes, looking round the room.\n\n'
  + 'POINT AT THE FOUR PICTURES: "A magnifying glass: we look. A girl: living. A cactus: living. A chair: non-living." These are the things they will find in the room.\n\n'
  + 'THIS HALF ENDS WITH A PRACTICE OF THURSDAY\'S ASSESSMENT (slide 17), so keep the hunt to its time.', 2, 'The hunt');

/* 13. HOW TO HUNT · 3 */
{
  const s = K.slide('light', 3, 'Hunt');
  K.title(s, 'How to hunt');
  const STEPS = [['magnifier', 'Look round the room.'], ['dog', 'Find 3 living things.'], ['rock', 'Find 3\nnon-living things.'], ['writing', 'Write them in the boxes.'], ['speech', 'Say why: because...']];
  const gap = 0.2, cw = (CW - 4 * gap) / 5, y = 1.9, ch = 3.4;
  STEPS.forEach(([k, t], i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `hs${i}` });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `hs${i}_n` });
    K.pic(s, k, x + cw / 2, y + 1.15, 1.35, `hs${i}_img`);
    s.addText(t, { x: x + 0.12, y: y + 2.05, w: cw - 0.24, h: 1.2, color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 22, objectName: `hs${i}_t` });
  });
  K.banner(s, [['Walk. ', true], ['Look. Do not touch the living things. Stay in the room.', false]], { size: 22 });
  s.addNotes(
    'HOW TO HUNT. 3 minutes. Five clicks, one step each, then the rules.\n\n'
    + 'PAIRS, ONE WORKSHEET EACH (page 2, the hunt sheet). Model it: walk to a student, point: "A girl! Living!" Walk to the window: "A window. Non-living." Write both in the boxes on your own sheet under the visualiser if you have one.\n\n'
    + 'THE RULES ON THE BANNER: walk, look, do not touch living things (a plant on the windowsill, an insect), stay in the room. If you can take them into the school garden or a corridor with plants, that is better: your call.\n\n'
    + 'WHAT THEY WILL FIND. Living: each other, you, a plant if there is one, an ant or a fly, grass through the window. Non-living: desks, chairs, pens, bags, the board, the window, a bottle.\n\n'
    + 'THE TRICKY ONES, decide now how you will answer them: a WOODEN desk or a pencil (wood was a tree; it is non-living now, "it does not grow"), FOOD in a lunch box (leave it out: "find something else"), a PICTURE of an animal on a poster (non-living: "it is a picture"), HAIR and FINGERNAILS (part of a living person; keep it to "you are living").'
  );
}

/* 14. THE HUNT · 14 */
{
  const s = K.slide('light', 14, 'Hunt');
  K.title(s, 'Hunt!');
  const ty = 1.85, th = 3.95, gap = 0.30, tw = (CW - gap) / 2;
  [['living', LIVE, LIVE_TINT, ['girl', 'cactus', 'ant']], ['non-living', STONE, STONE_TINT, ['chair', 'pencil', 'bag']]].forEach(([label, col, tint, pics], i) => {
    const x = M + i * (tw + gap);
    K.card(s, { x, y: ty, w: tw, h: th, fill: tint, line: col, lineWidth: 2.5, name: `hb${i}` });
    s.addText(label, { shape: S.roundRect, rectRadius: 0.1, x: x + 0.2, y: ty + 0.18, w: tw - 0.4, h: 0.6, fill: { color: col }, line: { color: col, width: 0 }, color: 'FFFFFF', fontFace: F.title, fontSize: 26, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `hb${i}_label` });
    [1, 2, 3].forEach((n, j) => {
      const yy = ty + 1.0 + j * 0.95;
      s.addText(`${n}`, { x: x + 0.3, y: yy, w: 0.4, h: 0.75, color: col, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `hb${i}_n${j}` });
      s.addShape(S.line, { x: x + 0.8, y: yy + 0.68, w: tw - 2.1, h: 0, line: { color: col, width: 1.5 }, objectName: `hb${i}_l${j}` });
      K.pic(s, pics[j], x + tw - 0.7, yy + 0.36, 0.72, `hb${i}_p${j}`);
    });
  });
  K.banner(s, [['We found a ___. It is living ', false], ['because', true], [' it ___.', false]], { size: 24 });
  s.addNotes(
    'HUNT! 14 minutes. Nothing to click: the timer is the instruction. The boxes on the slide are the same as the boxes on their sheet; the small pictures are examples, not answers to copy.\n\n'
    + 'GO ROUND THE PAIRS AND ASK THE THREE QUESTIONS, in the order they know: yes/no first ("Is a desk living?"), then either/or ("Living or non-living?"), then open ("Why?"). Every pair should say at least two because sentences to you.\n\n'
    + 'THE BANNER is the sentence for the sharing slide next: "We found a ___. It is living because it ___."\n\n'
    + 'AT 10 MINUTES: "Two more things, then write the because sentence at the bottom of the sheet." AT 14: back to seats.\n\n'
    + 'FAST PAIRS: find a living thing nobody else will find (an ant, a spider web, moss, the teacher) and write two reasons for it.'
  );
}

/* 15. SHARE · 7 */
{
  const s = K.slide('light', 7, 'You say');
  K.title(s, 'What did you find?');
  const tw = (CW - 0.3) / 2;
  [['living', LIVE, LIVE_TINT], ['non-living', STONE, STONE_TINT]].forEach(([label, col, tint], i) => {
    const x = M + i * (tw + 0.3);
    K.card(s, { x, y: 1.85, w: tw, h: 3.95, fill: tint, line: col, lineWidth: 2.5, name: `sh${i}` });
    s.addText(label, { shape: S.roundRect, rectRadius: 0.1, x: x + 0.2, y: 2.03, w: tw - 0.4, h: 0.6, fill: { color: col }, line: { color: col, width: 0 }, color: 'FFFFFF', fontFace: F.title, fontSize: 26, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sh${i}_label` });
    s.addText('Write the class list here on the board.', { x: x + 0.3, y: 3.3, w: tw - 0.6, h: 1.0, color: C.inkSoft, fontFace: F.body, fontSize: 16, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `sh${i}_hint` });
  });
  K.banner(s, [['We found a ___. It is living ', false], ['because', true], [' it ___.', false]], { size: 24 });
  s.addNotes(
    'SHARE. 7 minutes. Nothing to click. The two boxes are a frame for the class list: write their finds on the board (or on the slide in edit mode) as each pair reports.\n\n'
    + 'EACH PAIR SAYS ONE SENTENCE from the banner: "We found a plant. It is living because it needs water." The other pairs answer "Yes!" or "No!" with thumbs.\n\n'
    + 'ORDER: the quieter pairs first, while the easy finds are still available; the confident pairs last, with the tricky ones (the wooden desk, the ant).\n\n'
    + 'COUNT AT THE END: "How many living things did the class find? How many non-living?" Usually more non-living. That is the bridge to the next slide: living things are fewer, and they need looking after.'
  );
}

/* 16. LIFE ON LAND · SDG 15 · 6 */
{
  const s = K.slide('light', 6, 'Life on land');
  K.title(s, 'Life on land');
  const cw = (CW - 2 * 0.30) / 3, y = 1.85, ch = 3.9;
  [['forest', 'Plants and animals live on land.'], ['watering', 'They need water, food and air.'], ['tree', 'We plant trees. We look after them.']].forEach(([k, t], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: ch, line: LIVE, lineWidth: 2, name: `ll${i}` });
    K.pic(s, k, x + cw / 2, y + 0.15 + 1.3, 2.6, `ll${i}_img`);
    s.addText(t, { x: x + 0.2, y: y + 2.95, w: cw - 0.4, h: 0.85, color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 22, objectName: `ll${i}_t` });
  });
  K.banner(s, [['Goal 15: ', true], ['Life on Land. We look after living things.', false]], { size: 24 });
  s.addNotes(
    'LIFE ON LAND. 6 minutes. Three clicks, one picture each, then the goal. This is the unit plan\'s SDG 15.\n\n'
    + 'KEEP THE LANGUAGE TO THE UNIT. Plants and animals (Lesson 1) live on land. They need water, food and air (Lesson 2). They grow (Lesson 3). New and said, not drilled: "look after", "plant (a tree)".\n\n'
    + 'THE GOAL: the United Nations has 17 goals for the world; number 15 is Life on Land: forests, plants and animals. One sentence is enough: "We look after living things."\n\n'
    + 'THINKING (the unit plan\'s ATL skill), one open question, in pairs, then share: "What can WE do?" Accept anything sensible with the frame they have: "We give plants water." "We do not cut trees." "We give a dog food."\n\n'
    + 'DO NOT TURN IT INTO A LECTURE. Three pictures, three sentences, one question.'
  );
}

/* 17. PRACTICE FOR THURSDAY · 10 */
{
  const s = K.slide('light', 10, 'Practice');
  K.title(s, 'Practice for Thursday');
  const R = ANS.REHEARSE;
  const cw = (CW - 0.3) / 2, ch = 1.92;
  const box = (i, title) => {
    const x = M + (i % 2) * (cw + 0.3), y = 1.85 + Math.floor(i / 2) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `pr${i}` });
    s.addText(title, { x: x + 0.2, y: y + 0.1, w: cw - 0.4, h: 0.4, color: C.accentInk, fontFace: F.body, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `pr${i}_h` });
    return { x, y };
  };
  { const { x, y } = box(0, '1  Circle yes or no.'); K.pic(s, R.yesNo.key, x + 0.85, y + 1.15, 1.2, 'pr0_img'); s.addText(`${R.yesNo.q}\nyes      no`, { x: x + 1.65, y: y + 0.5, w: cw - 1.8, h: 0.85, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, objectName: 'pr0_t' }); K.tag(s, R.yesNo.a, x + cw - 1.3, y + 1.4, 1.1, 0.4, 'pr0_a', LIVE, 16); }
  { const { x, y } = box(1, '2  Circle the right word.'); K.pic(s, R.either.key, x + 0.85, y + 1.15, 1.2, 'pr1_img'); s.addText(R.either.q.replace('non-living', 'non\u2011living'), { x: x + 1.65, y: y + 0.5, w: cw - 1.8, h: 0.85, color: C.dark, fontFace: F.title, fontSize: 21, bold: true, valign: 'middle', margin: 0, objectName: 'pr1_t' }); K.tag(s, R.either.a, x + cw - 1.6, y + 1.4, 1.4, 0.4, 'pr1_a', STONE, 16); }
  { const { x, y } = box(2, '3  Write the word.'); K.pic(s, R.because.key, x + 0.85, y + 1.15, 1.2, 'pr2_img'); s.addText(R.because.q, { x: x + 1.65, y: y + 0.5, w: cw - 1.8, h: 0.85, color: C.dark, fontFace: F.title, fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: 'pr2_t' }); K.tag(s, 'grows', x + cw - 1.3, y + 1.4, 1.1, 0.4, 'pr2_a', LIVE, 16); }
  { const { x, y } = box(3, '4  Sort: living or non-living?'); R.sort.forEach((k, j) => { K.pic(s, k, x + 0.75 + j * 1.35, y + 1.05, 0.95, `pr3_p${j}`); K.chip(s, k, x + 0.2 + j * 1.35, y + 1.58, 1.1, 0.3, `pr3_c${j}`, 11); }); }
  K.banner(s, 'Point. Wait. Answer. Thursday is the same!', { size: 22 });
  s.addNotes(
    'PRACTICE FOR THURSDAY. 10 minutes. Four clicks: one answer per box (the last click shows all four sort answers).\n\n'
    + 'THURSDAY\'S PAPER USES EXACTLY THESE FOUR FORMATS: circle yes or no; circle the right word; write the word in a because sentence; sort pictures into living and non-living. It also asks them to put pictures in order (Lesson 3) and to fix a wrong sentence ("a car is living because it moves"). Do every box here the way Thursday will do it, so nothing on the paper is new.\n\n'
    + 'BOX BY BOX: read the instruction, point at the picture, give them 20 seconds to think, then they answer aloud (or with thumbs for yes or no), then click. Box 3 has many right answers: grows, eats, changes, needs water / food / air.\n\n'
    + 'THEN SAY IT, as a last round: point at a photograph anywhere in the deck, wait, and an individual answers with a because sentence. Do six students, quickly. Saying it first is what makes the writing possible on Thursday.\n\n'
    + 'THE ANT, THE CUP, THE PENCIL, THE SUNFLOWER: the pencil is wood (non-living now), the ant is small and living.\n\n'
    + 'SAY IT PLAINLY: "Thursday: the same. Words, pictures, because. You can do it."'
  );
}

/* 18. SAY IT TOGETHER · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('Living things grow, eat and need water.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const TILES = [['horse', 'eats'], ['cup', 'does not grow'], ['cactus', 'needs water'], ['kite', 'does not eat'], ['frog', 'grows'], ['clock', 'does not grow'], ['snail', 'eats'], ['ball', 'does not grow']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach(([k, why], i) => {
    const x = M + (i % 4) * (cw + gap), y = 2.5 + Math.floor(i / 4) * (ch + 0.16);
    K.tile(s, k, x, y, cw, ch, `tz${i}`, { line: C.darkSoft, tick: true, answer: why, answerColour: kind(k) === 'living' ? LIVE : STONE });
  });
  s.addText('Next lesson: show what you know.', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tz_next' });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Four clicks, two answers each.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the gestures: living (wiggle), grow (palm rising), eat (chew), need (pull in), water (drink).\n\n'
    + 'THEN EACH PICTURE: the class says the whole because sentence BEFORE the click. Any true reason is right; the click shows one.\n\n'
    + 'THE PROMISE ON THE SCREEN: Thursday is the assessment, "show what you know". Say it with a smile: it is everything they have just said.'
  );
}

K.write();

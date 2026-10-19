/**
 * T3 Developing Science (CLIL), Unit 8: The Periodic Table. Lessons 4 and 5 of 5: What Is It Made Of?
 * THE DOUBLE: Week 1 Tuesday P3 to P4, 10:00 to 11:40, Tuesday 10 November 2026. ONE deck (CLIL.md, TIMETABLE.md):
 *   first half   50 min   "made of": what a nail, a ring, a wire, a pan, a tank and a balloon are made of; sort by element
 *   break         5 min   the slide carries the unit's gestures, so the break recalls them (CLIL.md)
 *   second half  45 min   Goal 12 (recycle metal), the sentence-builder game, and the oral check of the four vials
 * The split follows CLIL.md's arithmetic for a double (50 + 5 + 45); the phase timers total 95.
 *
 * PREVIOUS: Does It Light Up? (Lesson 3, Friday 6 November, 4 days ago): electricity, bulb, circuit, conduct; "Metals conduct
 * electricity"; the pencil lead surprise. Before that Metal Or Non-Metal (non-metal, shiny, hard, soft) and Lesson 1 (element, symbol,
 * metal, gas; He, O, Fe, Cu, Au). NEXT: nothing in this unit: the last slide says so. Unit 8 is five hours and this is the fifth.
 *
 * New words: sort, full (first half); recycle (second half). Frames: "A ___ is made of ___." / "A ___ is full of ___." and, for
 * the check, "This is ___. It is a ___. It is ___." The unit plan's assessment is the oral check (teacher points to a sample,
 * the student describes it) plus a worksheet or game: the worksheet is page 2 and the game is the sentence builder.
 * Every answer comes from build/what-is-it-made-of-answers.js; what each thing is, from build/periodic-words.js.
 */
const ANS = require('./what-is-it-made-of-answers');
const K = require('./periodic-kit')({
  lesson: 'What Is It Made Of',
  title: 'What Is It Made Of?',
  subject: 'T3 Developing Science · Unit 8 The Periodic Table · Lesson 4 and 5 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, CHIP, INK, WORDS } = K;
const { name, symbolOf, EL } = WORDS;
const DATE = 'Tuesday 10 November 2026';
const G = (w) => WORDS.gesture(w);
const SAY = (w) => WORDS.say(w);
const FRAME1 = [['A ___ ', false], ['is made of', true], [' ___.', false]];
const FRAME2 = [['A ___ is made of ___.   A ___ ', false], ['is full of', true], [' ___.', false]];
const FRAME3 = [['This is ___. It is a ___. ', false], ['It is ___.', true]];
const LABEL = { gold: 'gold bars' };
const label = (k) => LABEL[k] || ANS.objName?.(k) || name(k);

function titleSlide(text, sub, heroes, notes, mins = 1, pillLabel) {
  const s = K.slide('dark', mins, pillLabel);
  if (!pillLabel) s.addText('ELEMENTS', { x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker' });
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
const gestureLines = (words) => words.map((w) => `  ${w} = ${G(w)}.`).join('\n');
const ELEM_COLOUR = (k) => (ANS.isGas(k) ? CHIP.gas.fill : CHIP.metal.fill);

/* ================================================================== *
 * FIRST HALF · 50 minutes · made of
 * ================================================================== */

/* 1. TITLE · 1 */
titleSlide('What is it\nmade of?', 'Look. Sort. Say.', ['nail', 'ring', 'wire', 'tank'],
  'TITLE. 1 minute. Lessons 4 and 5 of 5 in The Periodic Table: THE DOUBLE, 100 minutes in one deck. First half "made of" (50 min), a 5-minute break (slide 12), then Goal 12, the game and the oral check (45 min). THIS IS THE LAST LESSON OF THE UNIT: the assessment is in the second half (the oral check of the four vials, plus the game and worksheet page 2).\n\n'
  + 'POINT AT THE NAIL AND ASK "What is it?" (a nail), then "What is it made of?" with open hands, and wait. They will say "metal" or "iron". That is the question of the whole first half. Do not answer it yet.\n\n'
  + 'THE RING, THE WIRE, THE TANK: the same two questions, quickly. If somebody says "it is metal" for the ring, smile: "Yes! Which metal?" and point at the colour: gold.\n\n'
  + 'BEFORE THE LESSON: THE FOUR SEALED VIALS (copper, carbon, sulfur, silicon) on a table at the front for the second half, and the checklist (What Is It Made Of oral check.docx) printed. THE DEVICES for the game: the sentence-builder game (What Is It Made Of game.html) uploaded to Google Classroom, tested on one device. CHANGE THE DATE before you teach, if the lesson falls on a different day.\n\n'
  + K.credits(['nail', 'ring', 'wire', 'tank']));

/* 2. TODAY · 2 */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  goals(s, [[['nail', 'ring'], 'Say: What is it\nmade of?'], [['sort'], 'Sort things.'], [['writing'], 'Write: A nail is\nmade of iron.']]);
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + `Read each goal. The class repeats the key word with its action: "made of" (${G('made of')}), "sort" (${G('sort')}), "write" (write in the air). Three pictures, three short lines, move on.\n\n`
    + 'Point at goal 1 and say: "This question. All lesson. What is it made of?" They should not be surprised by it when it comes (slide 5).\n\n'
    + 'GOALS 1 AND 2 AND 3 ARE THE FIRST HALF. Say so and point at the break: "First: made of. Then a break. Then the game and a check for me!"\n\n'
    + 'DO NOT READ LONG OBJECTIVES OUT.'
  );
}

/* 3. REMEMBER · Lessons 2 and 3 · 6 */
{
  const s = K.slide('light', 6, 'Remember');
  K.title(s, 'Do you remember?');
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 1.98, y0 = 1.85;
  ANS.REMEMBER.forEach(([k, word], i) => {
    const x = M + (i % 5) * (cw + gap), y = y0 + Math.floor(i / 5) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rm${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.62, 1.24, `rm${i}_img`);
    s.addText(word, { x: x + 0.05, y: y + 1.44, w: cw - 0.1, h: 0.46, color: C.dark, fontFace: F.title, fontSize: word.length > 8 ? 20 : 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word` });
  });
  K.banner(s, [['Metals ', false], ['conduct', true], [' electricity.', false]], { size: 26 });
  s.addNotes(
    'REMEMBER. 6 minutes. Five clicks, two words each: the last two lessons, picture first. IT IS FOUR DAYS SINCE FRIDAY: this is retrieval, and it must be spoken, not read.\n\n'
    + 'POINT AT A PICTURE AND WAIT. They say the word and do its gesture before you click. The gestures, all fixed in Lessons 1 to 3:\n'
    + gestureLines(['metal', 'non-metal', 'shiny', 'hard', 'soft', 'electricity', 'bulb', 'circuit', 'conduct', 'symbol']) + '\n\n'
    + 'THEN THE FRAMES FROM THE LAST TWO LESSONS, a quick round with pictures: "This is copper. It is a metal. It is shiny." / "Copper conducts electricity." / "Sulfur does not conduct electricity."\n\n'
    + 'A WORD THAT IS WEAK: drill it now, thirty seconds (you, whole class, half, three individuals, off the picture). "Electricity" and "conduct" are the ones most often lost.\n\n'
    + 'THE BANNER is Friday\'s big idea: "Metals conduct electricity." Say it together, with the gestures (and the pencil surprise, if somebody remembers: carbon conducts).\n\n'
    + K.credits(ANS.REMEMBER.map(([k]) => k))
  );
}

/* 4. NEW WORDS · sort, full · 3 */
{
  const s = K.slide('light', 3, 'New words');
  K.keywords(s, ['sort', 'full']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'sort', say: SAY('sort'), meaning: 'Sort the things.', pics: ['sort'] },
    { word: 'full', say: SAY('full'), meaning: 'A balloon is full of helium.', pics: ['balloons'] },
  ], { h: 4.1, picSize: 1.75, spread: 2.0, picNames: false, wordSize: 40 });
  K.banner(s, [['We ', false], ['sort', true], [' the things. A tank is ', false], ['full', true], [' of oxygen.', false]], { size: 24, name: 'w_banner' });
  s.addNotes(
    'NEW WORDS: SORT, FULL. 3 minutes. Four clicks: "sort", "full", both leave and they say them off the pictures, then the sentence. The picture is on screen and the word is hidden: point at it and WAIT. Only then click.\n\n'
    + 'FULL DRILL ON BOTH, thirty seconds each: you say it, whole class, half the class, three individuals, then back to the picture with no prompt.\n\n'
    + `SORT: one beat, and the T at the end must be heard ("sort", not "saw"). GESTURE (new, agreed today): ${G('sort')}. Do it with real things: put the nail and the ring on the desk and sort them into two piles. They have SORTED before, in the living-things unit, so this is a new word for a known job.\n\n`
    + `FULL: one beat, with the double L at the end ("fool" is a different word: keep the vowel short). GESTURE (new): ${G('full')}. Hold up a full cup, then an empty one. THE FRAME "IS FULL OF" IS FOR GASES ONLY: a balloon is FULL OF helium, a tank is FULL OF oxygen. A solid is MADE OF something. The next slides use both.\n\n`
    + 'CHECK with yes/no and either/or only: "Is the balloon full?" "Sort or full?" (pointing at each picture). No open questions yet.\n\n'
    + K.credits(['balloons'])
  );
}

/* 5. LOOK AND SAY · six objects · 6 */
{
  const s = K.slide('light', 6, 'Look and say');
  K.keywords(s, ['made of', 'full of', 'metal']);
  K.title(s, 'What is it made of?');
  const gap = 0.24, cw = (CW - 2 * gap) / 3, ch = 1.9, y0 = 1.8;
  ANS.OBJECTS.forEach((k, i) => {
    const x = M + (i % 3) * (cw + gap), y = y0 + Math.floor(i / 3) * (ch + 0.14);
    K.card(s, { x, y, w: cw, h: ch, name: `lk${i}` });
    K.pic(s, k, x + 0.85, y + ch / 2, 1.55, `lk${i}_img`);
    s.addImage({ path: K.picFile(`tile_${symbolOf(k)}`), x: x + cw - 0.95, y: y + 0.1, w: 0.8, h: 0.8, objectName: `lk${i}_tile` });
    s.addText(`A ${ANS.objName(k)}\n${ANS.verb(k)}\n${ANS.element(k)}.`, { x: x + 1.8, y: y + 0.9, w: cw - 1.9, h: 0.95, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `lk${i}_t` });
  });
  K.banner(s, FRAME2, { size: 22 });
  s.addNotes(
    'LOOK AND SAY. 6 minutes. Six clicks, one object each: the sentence appears. THE FRAME AT THE BOTTOM, "A ___ is made of ___. A ___ is full of ___.", STAYS ON EVERY SLIDE FROM HERE. The element tile is already on the card: that is the clue.\n\n'
    + 'POINT AT THE OBJECT, THEN THE TILE: "A nail. Iron." Then the sentence, with the gestures (made of: hands building; full: round arms). YOU SAY EACH SENTENCE, THEY REPEAT. The six:\n  '
    + ANS.OBJECTS.map((k) => `${ANS.sentence(k)}   (${EL[symbolOf(k)].say}; ${symbolOf(k)})`).join('\n  ') + '\n\n'
    + 'THE FIRST FOUR ARE SOLIDS ("made of"): the nail, the ring, the wire, the pan. The pan and the nail are both iron: "Two things. One element." A real nail is steel (mostly iron) and a real pan is cast iron: for this class it is IRON; if a student asks, say "mostly iron". The tank and the balloon are gases ("full of"). The ring is gold: "a gold ring".\n\n'
    + 'SAY THE CLASS EVERY TIME: iron is a metal, copper is a metal, gold is a metal; oxygen and helium are non-metals (gases). The tiles help: the table colours are on the next slides.\n\n'
    + 'PRONUNCIATION: iron EYE-un; copper KOP-er; gold GOHLD (the D at the end); oxygen OK-si-jen; helium HEE-lee-um. Symbols are LETTER NAMES: Fe "eff-ee", Cu "see-you", Au "ay-you", O "oh", He "aitch-ee".\n\n'
    + K.credits(ANS.OBJECTS)
  );
}

/* 6. YOU SAY A · yes or no? · 4 */
{
  const s = K.slide('light', 4, 'You say');
  K.keywords(s, ['made of', 'full of']);
  K.title(s, 'Yes or no?');
  const gap = 0.24, cw = (CW - 2 * gap) / 3, ch = 1.9, y0 = 1.8;
  ANS.YES_NO.forEach((q, i) => {
    const x = M + (i % 3) * (cw + gap), y = y0 + Math.floor(i / 3) * (ch + 0.14);
    K.card(s, { x, y, w: cw, h: ch, name: `yn${i}` });
    K.pic(s, q.key, x + 0.8, y + 0.78, 1.3, `yn${i}_img`);
    s.addText(q.q, { x: x + 1.55, y: y + 0.1, w: cw - 1.65, h: 0.95, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `yn${i}_t` });
    K.tag(s, q.yes ? 'YES' : 'NO', x + 1.55, y + 1.2, 1.5, 0.5, `yn${i}_chip`, q.yes ? C.support : C.alert, 18);
  });
  K.banner(s, FRAME2, { size: 22 });
  s.addNotes(
    'YOU SAY, PART A: YES OR NO. 4 minutes. Six clicks, one answer each. Yes/no questions come first because they need the least English.\n\n'
    + 'THE ROUTINE FOR EACH QUESTION: point at the picture and ask. They answer "Yes!" or "No!" with a nod or a shake. The stronger ones add the sentence: "Yes. A nail is made of iron." / "No. A ring is made of gold." Take the sentence from one student, then the whole class repeats it. Click: the answer.\n\n'
    + 'THE SIX, MIXED ON PURPOSE (answers from the answers module):\n  ' + ANS.YES_NO.map((q) => `${q.q} ${q.say}`).join('\n  ') + '\n\n'
    + 'THE TRAPS: "Is a balloon full of oxygen?" is NO: the balloon in the photograph is helium (Lesson 1). "Is a pan made of gold?" is NO: iron. Do not let a "no" end without the right sentence.\n\n'
    + 'IF THE ROOM IS SILENT, go back to slide 5 for that object. IF IT IS FLUENT, skip to the next slide: they are ready to stand.\n\n'
    + K.credits(ANS.YES_NO.map((q) => q.key))
  );
}

/* 7. YOU SAY B · iron or gold? standing, pairs · 6 */
{
  const s = K.slide('light', 6, 'You say');
  K.keywords(s, ['made of', 'full of']);
  K.title(s, 'Iron, gold, copper or gas?');
  s.addText([
    { text: 'metal: ', options: { bold: true, color: INK.metal } }, { text: 'stand tall and knock', options: { color: C.inkSoft } },
    { text: '          gas: ', options: { bold: true, color: INK.gas } }, { text: 'float your hands up', options: { color: C.inkSoft } },
  ], { x: M, y: 1.62, w: CW, h: 0.4, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'rule' });
  const gap = 0.18, cw = (CW - 5 * gap) / 6, ch = 2.8, y0 = 2.55;
  ANS.EITHER.forEach((q, i) => {
    K.tile(s, q.key, M + i * (cw + gap), y0, cw, ch, `eo${i}`, { label: ANS.objName(q.key), answer: q.element, cls: q.cls });
  });
  K.banner(s, FRAME2, { size: 22 });
  s.addNotes(
    'YOU SAY, PART B: EITHER/OR, STANDING, IN PAIRS. 6 minutes, the active block. Six clicks, one answer each. THE FRAME STAYS AT THE BOTTOM.\n\n'
    + 'THE GAME, everyone standing, then pairs. Point at an object and ask: "Iron or gold?" "Oxygen or helium?" If the answer is a METAL they stand tall and knock twice; if it is a GAS, they float their hands up. They all do it at the same time and the whole sentence follows: "A ring is made of gold." "A tank is full of oxygen." Click: the element appears in blue (a metal) or green (a gas), the colours of the table.\n\n'
    + 'THE ORDER IS MIXED ON PURPOSE: ' + ANS.EITHER.map((q) => ANS.objName(q.key)).join(', ') + ': so nobody can guess a pattern. Wait a beat before they move: they should decide first.\n\n'
    + 'THEN PAIRS (the last three minutes): A points at an object, B says the whole sentence with the gesture, then they swap. This is where the speaking minutes are (CLIL.md). Walk round and listen for the "made of" and the "is full of", the D on "gold" and the S on "gas".\n\n'
    + 'ANSWERS (from the answers module): ' + ANS.EITHER.map((q) => q.say).join(' ') + '\n\n'
    + K.credits(ANS.EITHER.map((q) => q.key))
  );
}

/* 8. YOU SAY C · open: what is it made of? · 5 */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['made of', 'metal']);
  K.title(s, 'What is it made of?');
  s.addText('iron   ·   gold   ·   copper   ·   oxygen   ·   helium   ·   metal   ·   non-metal', { x: M, y: 1.72, w: CW, h: 0.45, color: C.support, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'words' });
  const gap = 0.24, cw = (CW - 3 * gap) / 4, y = 2.3, ch = 3.65;
  ANS.OPEN.forEach((q, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `op${i}` });
    K.pic(s, q.key, x + cw / 2, y + 0.12 + 1.0, 2.0, `op${i}_img`);
    s.addText(ANS.objName(q.key), { x: x + 0.1, y: y + 2.2, w: cw - 0.2, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `op${i}_t` });
    s.addText(`${ANS.sentence(q.key)}\n${WORDS.capital(ANS.element(q.key))} is a metal.`, {
      x: x + 0.12, y: y + 2.7, w: cw - 0.24, h: 0.9, color: INK.metal, fontFace: F.body, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 19, objectName: `op${i}_a`,
    });
  });
  K.banner(s, FRAME2, { size: 22 });
  s.addNotes(
    'YOU SAY, PART C: OPEN. 5 minutes. Four clicks, one object each. NOW THE QUESTION IS OPEN: "What is it made of? Tell me about it." The frame and the word strip carry them.\n\n'
    + 'PAIRS FOR TWO MINUTES FIRST. One picture between two. A asks "What is it made of?", B answers with the whole sentence and then adds the class: "Iron is a metal." They swap. Walk round: LISTEN FIRST, correct by repeating it back correctly.\n\n'
    + 'THEN ONE STUDENT PER OBJECT says both sentences to the class before you click. The click shows the model.\n\n'
    + 'THE ANSWERS (from the answers module):\n  ' + ANS.OPEN.map((q) => q.say).join('\n  ') + '\n\n'
    + 'THE STRONGEST ADD A PROPERTY from Lesson 2 ("Copper is shiny.") or from Lesson 3 ("Copper conducts electricity."): both are right, and they join today\'s sentence to the unit.\n\n'
    + 'IF SOMEONE ASKS "A PAN IS IRON? IT IS BLACK": say "yes: the pan is iron, and iron is dark when it is not clean". A real pan is cast iron. Enough.\n\n'
    + K.credits(ANS.OPEN.map((q) => q.key))
  );
}

/* 9. SORT · by what they are made of · 6 */
{
  const s = K.slide('light', 6, 'Sort');
  K.keywords(s, ['sort', 'made of', 'full of']);
  K.title(s, 'Sort the things');
  const pw = CW / 6, py = 1.75;
  ANS.SORT_POOL.forEach((k, i) => {
    K.pic(s, k, M + i * pw + pw / 2, py + 0.55, 1.05, `pool${i}_img`);
    s.addText(label(k), { x: M + i * pw, y: py + 1.15, w: pw, h: 0.32, color: C.dark, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `pool${i}_t` });
  });
  const gap = 0.2, bw = (CW - 2 * gap) / 3, by = 3.4, bh = 2.4;
  const COL = [CHIP.metal, CHIP.metal, CHIP.gas];
  ANS.SORT.forEach((b, i) => {
    const x = M + i * (bw + gap);
    K.card(s, { x, y: by, w: bw, h: bh, fill: COL[i].tint, line: COL[i].fill, lineWidth: 3, name: `sb${i}` });
    b.tiles.forEach((sym, j) => s.addImage({ path: K.picFile(`tile_${sym}`), x: x + 0.15 + j * 0.8, y: by + 0.12, w: 0.72, h: 0.72, objectName: `sb${i}_tile${j}` }));
    s.addText(b.head, { x: x + 0.15 + b.tiles.length * 0.8, y: by + 0.12, w: bw - 0.3 - b.tiles.length * 0.8, h: 0.72, color: COL[i].ink, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `sb${i}_head` });
    b.items.forEach((k, j) => {
      const cx = x + bw / 4 + j * (bw / 2);
      K.pic(s, k, cx, by + 1.5, 1.0, `sb${i}_p${j}`);
      s.addText(label(k), { x: cx - 0.8, y: by + 2.02, w: 1.6, h: 0.3, color: C.dark, fontFace: F.body, fontSize: 13, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sb${i}_n${j}` });
    });
  });
  K.banner(s, FRAME2, { size: 22, y: 6.0, h: 0.85 });
  s.addNotes(
    'SORT. 6 minutes. Three clicks: the iron box, the gold box, the gas box, each filling with its two things. THIS IS THE UNIT PLAN\'S "SORT OBJECTS BY WHAT THEY ARE MADE OF (IRON, GOLD, OXYGEN)".\n\n'
    + 'THE SIX THINGS ARE ON THE TOP ROW, MIXED UP: ' + ANS.SORT_POOL.map(label).join(', ') + '. THE CLASS SORTS BEFORE YOU CLICK: first as a whole class (you point at a thing, they point at the box and say the box: "iron!"), then IN PAIRS WITH THE REAL THINGS if you have them (a nail, a spoon, a ring, a balloon: put them on the desk and sort them into three trays).\n\n'
    + 'THE THREE BOXES: IRON (nail, pan), GOLD (ring, gold bars), GAS (tank, balloon: oxygen and helium together, the two green boxes on the table). Click each box and say the sentences: "A nail is made of iron." "A pan is made of iron." "A ring is made of gold." "Gold bars are made of gold." "A tank is full of oxygen." "A balloon is full of helium."\n\n'
    + 'ASK THE EITHER/OR EVERY TIME: "Iron or gold?" Never an open question before the pairs have had it.\n\n'
    + 'THE GOLD BARS ARE PLURAL: "Gold bars are made of gold." Say it once, and move on. It is the picture from Lesson 1.\n\n'
    + 'FAST PAIRS: add a fourth box, copper, with the wire. Or find something in the room that is made of iron.\n\n'
    + K.credits(ANS.SORT_POOL)
  );
}

/* 10. YOU DO · worksheet page 1 · 8 */
{
  const s = K.slide('light', 8, 'You do');
  K.title(s, 'Your worksheet: part 1');
  const CARDS = [['A', ['nail', 'ring'], 'Write.', 'A ___ is made of ___.'], ['B', ['pan', 'tank'], 'Sort.', 'Write each thing in its box.'], ['C', ['balloons'], 'Right or wrong?', 'Circle. Then fix the wrong one.']];
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
  s.addText('made of   ·   full of   ·   iron   ·   gold   ·   copper   ·   oxygen   ·   helium', { x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'wb_words' });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  s.addNotes(
    'YOU DO, PART 1. 8 minutes. Four clicks: A, B, C, then the banner. Page 1 of the worksheet; page 2 is after the break. The word bank stays on screen.\n\n'
    + 'THE WORKSHEET (picture-led; no matching lines; a word bank and a writing line). A: four pictures (nail, ring, wire, tank), write the whole sentence. B: six pictures, write each thing in the right box: iron, gold, copper or gas. C: three sentences, circle right or wrong, and fix the wrong one.\n\n'
    + 'BEFORE THEY WRITE, EVERY TIME: "Point first. Then say the whole sentence." They point at the picture, say the sentence aloud, THEN write it. Walk round and listen first, read second.\n\n'
    + 'COMMON SLIPS: "A nail made of iron" (the missing "is"); "is made off"; "A tank is made of oxygen" (it is FULL of oxygen: they will want to use "made of" for everything: point at the banner); "Gold" with a small g at the start of a sentence; "Cu" and "Au" written as capitals.\n\n'
    + 'THE ANSWERS are upside down at the foot of page 2, for you:\n  ' + ANS.map(([n, a]) => `${n} ${a}`).join('\n  ')
  );
}

/* 11. SAY IT TOGETHER · before the break · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('A ___ is made of ___.   A ___ is full of ___.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const TILES = ['nail', 'ring', 'wire', 'pan', 'tank', 'balloons'];
  const gap = 0.2, cw = (CW - 5 * gap) / 6, ch = 3.0;
  TILES.forEach((k, i) => {
    K.tile(s, k, M + i * (cw + gap), 2.55, cw, ch, `tg${i}`, { label: ANS.objName(k), line: C.darkSoft, tick: true, answer: ANS.element(k), cls: ANS.chipClass(k) });
  });
  s.addText('Next: a break. Then recycle, a game and a check!', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tg_next' });
  s.addNotes(
    'SAY IT TOGETHER, BEFORE THE BREAK. 3 minutes. Six clicks, one object each. THE PLENARY EVERYONE CAN WIN (CLIL.md): every answer is correct, so everyone succeeds out loud.\n\n'
    + 'THE TWO SENTENCES FIRST, whole class, twice, with the gestures (made of: hands building; full: round arms).\n\n'
    + 'THEN EACH PICTURE: point, and the class says the whole sentence BEFORE the click: "A nail is made of iron." The click shows the element. Every one is from today.\n\n'
    + 'THEN THE BREAK. Go straight to the next slide.\n\n'
    + K.credits(TILES)
  );
}

/* ================================================================== *
 * BREAK · 5 · the unit's gestures
 * ================================================================== */
{
  const s = K.slide('dark', 5, 'Break', { count: false });
  K.title(s, 'Break. Stand up and stretch!', 'dark');
  const LIST = [['tile_Au', 'element', 'a box with both hands'], ['tile_Fe', 'symbol', 'write a letter'], ['gold', 'metal', 'knock-knock'], ['helium', 'non-metal', 'knock, then sweep'],
    ['oxygen', 'gas', 'floating hands'], ['aluminium', 'shiny', 'sparkle'], ['rock', 'hard', 'tight fist'],
    ['teddy', 'soft', 'squeeze a sponge'], ['lightning', 'electricity', 'a zigzag'], ['bulb', 'bulb', 'fist, then open'], ['circuit_gap', 'circuit', 'draw a square'],
    ['circuit_on', 'conduct', 'finger along the arm'], ['sort', 'sort', 'sweep left and right'], ['balloons', 'full', 'round arms']];
  const gap = 0.14, cw = (CW - 6 * gap) / 7, ch = 2.3, y0 = 1.85;
  LIST.forEach(([k, w, g], i) => {
    const x = M + (i % 7) * (cw + gap), y = y0 + Math.floor(i / 7) * (ch + 0.18);
    K.card(s, { x, y, w: cw, h: ch, line: C.darkSoft, name: `bk${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.55, 1.1, `bk${i}_img`);
    s.addText(w, { x: x + 0.03, y: y + 1.26, w: cw - 0.06, h: 0.42, color: C.dark, fontFace: F.title, fontSize: w.length > 8 ? 15 : 19, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `bk${i}_w` });
    s.addText(g, { x: x + 0.05, y: y + 1.7, w: cw - 0.1, h: 0.52, color: C.inkSoft, fontFace: F.body, fontSize: 12, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 14, objectName: `bk${i}_g` });
  });
  s.addNotes(
    'BREAK. 5 minutes. Not counted in the 95 minutes of phases: the timer runs, the pill says BREAK. Nothing to click.\n\n'
    + 'THE BREAK CARRIES THE GESTURES (CLIL.md). Everyone stands. Point at each card in turn: say the word, the class does the gesture. Then go faster. Then point without speaking: they say the word AND do the gesture. Two rounds, then let them breathe, drink water and sit down. THE SECOND HALF NEEDS THEM: the check asks for the words, not the gestures, but the gestures are what bring the words back.\n\n'
    + 'THE FOURTEEN GESTURES OF THE UNIT, all fixed in Lessons 1 to 5:\n'
    + gestureLines(['element', 'symbol', 'metal', 'gas', 'non-metal', 'shiny', 'hard', 'soft', 'electricity', 'bulb', 'circuit', 'conduct', 'sort', 'full']) + '\n\n'
    + 'THE SHORT LINES ON THE CARDS are reminders for you and for them, not words to teach.\n\n'
    + 'DURING THE BREAK, SET UP THE SECOND HALF: the four vials on the sample table, the checklist, the game open on one device, the worksheet page 2 on the desks.'
  );
}

/* ================================================================== *
 * SECOND HALF · 45 minutes · recycle, the game and the oral check
 * ================================================================== */

/* 13. PART 2 · 2 */
titleSlide('Use it\nagain!', 'Recycle. Play. Show me.', ['recycle', 'game', 'magnifier', 'checklist'],
  'PART 2. 2 minutes. THE LONG HALF OF THE DOUBLE (CLIL.md): Goal 12 first (6 minutes), then the game and the oral check run TOGETHER (34 minutes): the class plays the game and does worksheet page 2 while you take pairs to the sample table. The last 3 minutes are the plenary.\n\n'
  + 'READ THE TITLE together. "Again": hold up a hand and do the flat-palm repeat. "Recycle" is on the next slide.\n\n'
  + 'POINT AT THE FOUR PICTURES: "Recycle. A game. Look (the magnifying glass). A list (the checklist): I check you." Say it with a smile, not a warning: "Show me what you know. You can do it."\n\n'
  + 'THE OLD UNIT PLAN\'S ASSESSMENTS ARE ALL HERE: the worksheet (page 2), the game, and the descriptive sentences (the teacher points to a sample and the student says: "This is copper. It is a metal. It is shiny.").', 2, 'Part 2');

/* 14. GOAL 12 · recycle · 6 */
{
  const s = K.slide('light', 6, 'Goal 12');
  K.keywords(s, ['recycle']);
  K.title(s, 'Use metal again');
  const cw = (CW - 2 * 0.30) / 3, y = 1.85, ch = 3.9;
  [['cans', 'We use metal things.'], ['bale', 'Metal can be used again.']].forEach(([k, t], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: ch, line: C.support, lineWidth: 2, name: `gl${i}` });
    K.pic(s, k, x + cw / 2, y + 0.15 + 1.3, 2.6, `gl${i}_img`);
    s.addText(t, { x: x + 0.2, y: y + 2.95, w: cw - 0.4, h: 0.85, color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 22, objectName: `gl${i}_t` });
  });
  {
    const x = M + 2 * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: ch, line: C.accent, lineWidth: 3, name: 'gl2' });
    K.pic(s, 'recycle', x + cw / 2, y + 0.15 + 1.1, 2.0, 'gl2_img');
    s.addText('recycle', { x: x + 0.1, y: y + 2.3, w: cw - 0.2, h: 0.75, color: C.dark, fontFace: F.title, fontSize: 38, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'gl2_word' });
    s.addText(SAY('recycle'), { x: x + 0.1, y: y + 3.05, w: cw - 0.2, h: 0.4, color: C.inkSoft, fontFace: F.body, fontSize: 18, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'gl2_say' });
  }
  K.banner(s, [['Goal 12: ', true], ['We ', false], ['recycle', true], [' metal.', false]], { size: 26 });
  s.addNotes(
    'GOAL 12. 6 minutes. Three clicks, one card each, then the goal. THIS IS THE UNIT PLAN\'S SDG 12, RESPONSIBLE CONSUMPTION AND PRODUCTION. THE ATL SKILL IS RESEARCH: one question at the end, in pairs.\n\n'
    + 'KEEP THE LANGUAGE TO THE UNIT. We use metal things (nails, pans, rings, cans: they know these now). Metal can be used again: it is the same iron, the same aluminium, the same copper, because an element does not wear out (do NOT say that: say "the same iron"). RECYCLE is the one new word.\n\n'
    + `RECYCLE: re-CY-cle, three beats, loudest on the middle one; the L at the end must be heard. GESTURE (new, agreed today): ${G('recycle')}. Drill it for thirty seconds: you, whole class, half, three individuals, off the picture. The picture is the recycling symbol.\n\n`
    + 'THE TWO PHOTOGRAPHS: aluminium cans in a collection cage, and pressed bales of aluminium cans ready to be melted and made into new cans. Point and say: "Cans. Metal. Press. New cans." They do not need "melt".\n\n'
    + 'THE GOAL: the United Nations has 17 goals for the world; number 12 is Responsible Consumption and Production: using things well and not wasting them. One sentence is enough: "We recycle metal."\n\n'
    + 'RESEARCH, ONE OPEN QUESTION IN PAIRS (the unit plan\'s ATL skill), then share: "What metal things do you use? Can we recycle them?" Accept anything sensible with the frame they have: "A can is made of aluminium." "A nail is made of iron." "We recycle cans."\n\n'
    + 'DO NOT TURN IT INTO A LECTURE. Three pictures, three sentences, one question.\n\n'
    + K.credits(['cans', 'bale'])
  );
}

/* 15. GAME · 14 */
{
  const s = K.slide('light', 14, 'Game');
  K.title(s, 'Play. Build. Say.');
  const STEPS = [['game', 'Open the game.'], ['writing', 'Build the sentence.'], ['speech', 'Say it. Then check.']];
  const cw = (CW - 2 * 0.30) / 3, y = 1.85, ch = 3.0;
  STEPS.forEach(([k, t], i) => {
    const x = M + i * (cw + 0.30);
    K.card(s, { x, y, w: cw, h: ch, name: `gm${i}` });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `gm${i}_n` });
    K.pic(s, k, x + cw / 2, y + 1.25, 1.55, `gm${i}_img`);
    s.addText(t, { x: x + 0.15, y: y + 2.1, w: cw - 0.3, h: 0.75, color: C.dark, fontFace: F.body, fontSize: 21, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `gm${i}_t` });
  });
  K.banner(s, [['Not on a device? ', false], ['Worksheet, part 2.', true]], { size: 26, y: 5.2, h: 0.85, name: 'gm_banner' });
  s.addText('Wait for your turn: I call you to the samples.', { x: M, y: 6.25, w: CW, h: 0.5, color: C.inkSoft, fontFace: F.body, fontSize: 18, italic: true, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'gm_hint' });
  s.addNotes(
    'GAME. 14 minutes. Nothing to click: the timer is the instruction. THE GAME IS THE SENTENCE BUILDER (What Is It Made Of game.html, from the unit plan: "Worksheet/Game"), and it is on devices through Google Classroom. Each student plays alone and at their own speed; the game finishes with a score and a list of the sentences they built.\n\n'
    + 'THE GAME HAS THREE ROUNDS OF SIX, in the order of the CLIL questions and spread over the WHOLE UNIT (half the words are from today and Friday, half from Lessons 1 and 2): ROUND 1, WORDS: a picture and a word, yes or no, then two words and tap the right one. ROUND 2, SAMPLES: metal or non-metal for three samples (silicon is always one: shiny, and a non-metal), then "does the bulb light up?" for three (sulfur and the pencil lead are always in: the pencil is the surprise). ROUND 3, SENTENCES: tap the word tiles into the gaps: "A nail is made of iron." "A tank is full of oxygen." "This is silicon. It is a non-metal. It is shiny." After every answer it shows the word split into syllables and the gesture, so they keep saying it. Every game is different (a six-letter code is on the start screen), nothing is stored, and there is no sound. THEY SAY EVERY SENTENCE ALOUD BEFORE THEY TAP IT: "Point first, say the sentence." Walk round and listen for that.\n\n'
    + 'THE END SCREEN SHOWS WHAT EACH STUDENT MISSED, by topic and by word, and every round has a drop-down review (right or wrong, the time, what they chose and the right answer). The time does not count. Ask a student who finished: "Which word did the game say again?" and have them say it with its gesture.\n\n'
    + 'IF A STUDENT HAS NO DEVICE OR THE GAME WILL NOT LOAD, THEY DO WORKSHEET PAGE 2 (describing the four samples) right away: that is the banner. The two are the same job in different forms.\n\n'
    + 'THE ORAL CHECK RUNS DURING THIS SLIDE AND THE NEXT (see the next slide\'s notes): you call pairs to the sample table, one pair at a time, about a minute each. The rest play. If a student is waiting, they do not wait: they play or write.\n\n'
    + 'AT 12 MINUTES: "Finish your round. Two more minutes." AT 14: the game slide goes, the check slide comes; the students who have not played finish worksheet page 2.'
  );
}

/* 16. THE CHECK · 20 */
{
  const s = K.slide('light', 20, 'Show me');
  K.keywords(s, ['metal', 'non-metal', 'shiny']);
  K.title(s, 'Show me what you know');
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 3.0, y0 = 1.85;
  ANS.SAMPLES.forEach((k, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, name: `ck${i}` });
    K.pic(s, k, x + cw / 2, y0 + 0.12 + 1.0, 1.95, `ck${i}_img`);
    s.addText(name(k), { x: x + 0.1, y: y0 + 2.2, w: cw - 0.2, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ck${i}_t` });
    s.addImage({ path: K.picFile(`tile_${symbolOf(k)}`), x: x + 0.12, y: y0 + 0.12, w: 0.62, h: 0.62, objectName: `ck${i}_tile` });
  });
  K.banner(s, FRAME3, { size: 26, y: 5.15, h: 0.9 });
  s.addText('Your turn: look at the sample. Point. Say the whole sentence.', { x: M, y: 6.25, w: CW, h: 0.5, color: C.inkSoft, fontFace: F.body, fontSize: 18, italic: true, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'ck_hint' });
  s.addNotes(
    'SHOW ME WHAT YOU KNOW. 20 minutes, with the game slide before it. NOTHING TO CLICK. THIS IS THE UNIT\'S ASSESSMENT: THE DESCRIPTIVE SENTENCES (the unit plan: "Teacher points to a sample and student describes it using target structures, for example: It is a metal. It is shiny.").\n\n'
    + 'THE ROUTINE (about 40 seconds a student, pairs together, 12 to 14 pairs in the time): the pair comes to the sample table. You point at ONE vial and say "What is this?" The student answers with the whole frame: "This is copper. It is a metal. It is shiny." You then point at a SECOND vial for the partner. A student who stalls gets the picture prompt: the frame on the slide. Tick the checklist (What Is It Made Of oral check.docx): name, metal or non-metal, shiny or not shiny, whole sentence, each 2 (said alone), 1 (said with help), 0 (not yet). THE TICKS ARE FOR YOU: they never see them.\n\n'
    + 'WHAT A GOOD ANSWER LOOKS LIKE: "This is sulfur. It is a non-metal. It is not shiny." For the stronger: "This is silicon. It is a non-metal. It is shiny." (the one that tests whether they use the table or the look), and "Sulfur does not conduct electricity." (a Lesson 3 sentence, if you want to push). Any true sentence from the unit is right.\n\n'
    + 'THE FOUR SAMPLES AND THEIR ANSWERS (the same as Lesson 2): ' + ANS.SAMPLES.map(ANS.describe).join(' ') + ' CHECK YOUR VIALS BEFORE THE LESSON (Lesson 2 notes): if a vial looks different from the photograph, accept what the student SEES.\n\n'
    + 'THE REST OF THE CLASS plays the game or does worksheet page 2 (describe the four samples in writing). When a student is called back, they leave the game. A student who finishes both early: write a sentence about the pan or the ring from the first half.\n\n'
    + 'DO NOT HURRY A QUIET STUDENT: let them point, let them look at the frame, give them time. Saying it is the whole point of the unit.\n\n'
    + K.credits(ANS.SAMPLES)
  );
}

/* 17. SAY IT TOGETHER · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('Metals conduct electricity.   We recycle metal.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const TILES = [['copper', 'It is a metal.'], ['sulfur', 'It is a non-metal.'], ['nail', 'A nail is made of iron.'], ['ring', 'A ring is made of gold.'], ['tank', 'A tank is full of oxygen.'], ['silicon', 'It is shiny.'], ['wire', 'Copper conducts electricity.'], ['cans', 'We recycle cans.']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach(([k, said], i) => {
    const x = M + (i % 4) * (cw + gap), y = 2.5 + Math.floor(i / 4) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, line: C.darkSoft, name: `tz${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.52, 1.04, `tz${i}_img`);
    s.addText(said, { x: x + 0.1, y: y + 1.2, w: cw - 0.2, h: 0.7, color: C.dark, fontFace: F.body, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 18, objectName: `tz${i}_t` });
    s.addImage({ path: K.picFile('tick', { drawing: true }), x: x + cw - 0.45, y: y + 0.08, w: 0.34, h: 0.34, objectName: `tz${i}_tick` });
  });
  s.addText('That is the unit. Well done: you can say what things are made of!', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tz_next' });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Eight clicks, one picture each. THE PLENARY EVERYONE CAN WIN (CLIL.md): every answer is correct, so everyone succeeds out loud.\n\n'
    + 'THE TWO BIG SENTENCES FIRST, whole class, twice, with the gestures: "Metals conduct electricity." (conduct, electricity) and "We recycle metal." (recycle). THEY ARE THE UNIT IN TWO LINES.\n\n'
    + 'THEN EACH PICTURE: point, and the class says a sentence from the unit BEFORE the click. The click shows one right answer; any true sentence is right ("It is a metal. It is shiny.").\n\n'
    + 'THERE IS NO "NEXT LESSON": this is the last lesson of the unit. End on it: "Everything is made of atoms. There are 118 elements. We know nine of them now: He, O, C, Al, Si, S, Fe, Cu, Au. Well done." If you have a minute, point at the table: "Which box is iron? Which is gold?"\n\n'
    + 'AFTER THE LESSON: the checklist. Keep it with the unit file; the class\'s marks are yours.\n\n'
    + K.credits(['cans', 'copper', 'sulfur', 'nail', 'ring', 'tank', 'silicon', 'wire'])
  );
}

K.write();

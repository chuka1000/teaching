/**
 * T3 Developing Science (CLIL), Unit 8: The Periodic Table. Lesson 2 of 5: Metal Or Non-Metal?
 * Week 2 Thursday P3, Thursday 5 November 2026. A SINGLE: 50 minutes.
 *
 * PREVIOUS: The Periodic Table (Lesson 1, Friday 9 October, taught from a deck that is not in this repository): element,
 * symbol, metal, gas; the five elements He, O, Fe, Cu, Au; the frame "___ is a ___. Its symbol is ___."; the table colours
 * (blue metal, green gas, grey other). 27 days ago, with Unit 4 in between, and a 7-day gap since the last lesson
 * (CLIL.md): so the lesson OPENS with heavy retrieval and spends its practical on the four sealed vials.
 * NEXT: Does It Light Up? (Friday 6 November): the circuit boards.
 *
 * New words: non-metal, shiny, hard, soft. Frame: "This is ___. It is a ___. It is ___." (the unit plan's frame, with the
 * look added). "Non-metal" means "not a metal": the green and the grey boxes on the table. Silicon is shiny and a
 * non-metal on purpose: the table decides, not the look.
 * Every answer comes from build/metal-or-non-metal-answers.js; what each thing is, from build/periodic-words.js.
 */
const ANS = require('./metal-or-non-metal-answers');
const K = require('./periodic-kit')({
  lesson: 'Metal Or Non-Metal',
  title: 'Metal Or Non-Metal?',
  subject: 'T3 Developing Science · Unit 8 The Periodic Table · Lesson 2 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, CHIP, INK, WORDS } = K;
const { name, cls } = WORDS;
const G = (w) => WORDS.gesture(w);
const DATE = 'Thursday 5 November 2026';
const FRAME = [['This is ___. It is a ___. ', false], ['It is ___.', true]];
const SAY = (w) => WORDS.say(w);

function titleSlide(text, sub, heroes, notes, mins = 1) {
  const s = K.slide('dark', mins);
  s.addText('ELEMENTS', { x: M, y: PILL_Y, w: 4, h: PILL_H, color: C.accent, fontFace: F.body, fontSize: 12, bold: true, charSpacing: 1.6, valign: 'middle', margin: 0, objectName: 'kicker' });
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
const ALL_PHOTOS = ['copper', 'carbon', 'sulfur', 'silicon', 'gold', 'iron', 'helium', 'oxygen', 'rock', 'teddy'];

/* 1. TITLE · 1 */
titleSlide('Metal or\nnon-metal?', 'Look. Find. Say.', ['copper', 'carbon', 'sulfur', 'silicon'],
  'TITLE. 1 minute. Lesson 2 of 5 in The Periodic Table. A SINGLE lesson, after a 7-day gap and 27 days after Lesson 1: the first 12 minutes are retrieval, and the practical is the four sealed vials (CLIL.md: recover the vocabulary by using it).\n\n'
  + 'READ THE TITLE slowly, pointing: "Metal... or... non-metal?" The class reads it with you. Then point at the four photographs and ask, with no English needed: "What colour?" (orange, black, yellow, grey). Do not name them yet: that is slide 6.\n\n'
  + 'BEFORE THE LESSON: get the four sealed vials (copper, carbon, sulfur, silicon) and, for Friday, the circuit boards. LOOK AT YOUR VIALS NOW. The slides show a lump of native copper, charcoal, a lump of sulfur and a chunk of silicon; the vials may look different (carbon as black powder or as grey graphite flakes, silicon as grey chips or a dull powder). The slides, the worksheet and the answers say copper is shiny, carbon is not shiny, sulfur is not shiny and silicon is shiny. If a vial looks different from that, trust the vial: tell them what they SEE, and change that answer on the worksheet.\n\n'
  + 'CHANGE THE DATE before you teach, if the lesson falls on a different day.');

/* 2. TODAY · 2 */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  goals(s, [[['gold', 'sulfur'], 'Say: metal or\nnon-metal.'], [['magnifier'], 'Look at the\nsamples.'], [['speech'], 'Say: This is copper.\nIt is a metal.']]);
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + `Read each goal. The class repeats the key word with its action: "metal" (${G('metal')}), "look" (a hand above the eyes), "say" (a hand from the mouth). Three pictures, three short lines, move on.\n\n`
    + 'Point at goal 3 and say: "This sentence. All lesson. You will say it many times." They should not be surprised by it when it comes (slide 6).\n\n'
    + 'DO NOT READ LONG OBJECTIVES OUT.'
  );
}

/* 3. REMEMBER · Lesson 1, picture first · 6 */
{
  const s = K.slide('light', 6, 'Remember');
  K.title(s, 'Do you remember?');
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 1.98, y0 = 1.85;
  ANS.REMEMBER.forEach(([k, word], i) => {
    const x = M + (i % 5) * (cw + gap), y = y0 + Math.floor(i / 5) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rm${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.62, 1.24, `rm${i}_img`);
    s.addText(word, { x: x + 0.05, y: y + 1.44, w: cw - 0.1, h: 0.46, color: C.dark, fontFace: F.title, fontSize: 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word` });
  });
  K.banner(s, [['Gold is a ', false], ['metal', true], ['. Its ', false], ['symbol', true], [' is Au.', false]], { size: 24 });
  s.addNotes(
    'REMEMBER. 6 minutes. Five clicks, two words each: everything from Lesson 1 (Friday 9 October), picture first. THE BIGGEST PART OF TODAY\'S RETRIEVAL, and it must be spoken, not read.\n\n'
    + 'POINT AT A PICTURE AND WAIT. They say the word and do its gesture before you click. The gestures, all fixed in Lesson 1 and in the Atoms unit:\n'
    + gestureLines(['atom', 'element', 'symbol', 'metal', 'gas']) + '\n\n'
    + 'THE FIVE ELEMENT TILES (He, O, Fe, Cu, Au): they say the whole Lesson 1 sentence off the tile, with the symbol as LETTER NAMES (He is "aitch-ee", never "he"; Fe is "eff-ee"; Cu is "see-you"; Au is "ay-you"; O is "oh"):\n  '
    + Object.values(ANS.REMEMBER_SENTENCE).join('\n  ') + '\n\n'
    + 'A WORD THAT IS WEAK: drill it now, thirty seconds (you, whole class, half, three individuals, off the picture). "Gas" and "symbol" are the ones most often lost: the S on gas, the L on symbol.\n\n'
    + 'THE BANNER is the sentence they finished Lesson 1 with. Say it together, with the gestures.\n\n'
    + 'FIRST PICTURE: the atom, from the Atoms unit ("everything is made of atoms": fingers circling). Lesson 1 said an ELEMENT is one kind of atom.'
  );
}

/* 4. NEW WORDS A · non-metal, shiny · 4 */
{
  const s = K.slide('light', 4, 'New words');
  K.keywords(s, ['non-metal', 'shiny']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'non-metal', say: SAY('non-metal'), meaning: 'Not a metal.', pics: ['sulfur', 'carbon'], colour: INK['non-metal'] },
    { word: 'shiny', say: SAY('shiny'), meaning: 'Gold is shiny.', pics: ['gold'], colour: INK.metal },
  ], { h: 4.1, picSize: 1.75, spread: 2.0, picNames: false, wordSize: 40 });
  K.banner(s, [['Sulfur is a ', false], ['non-metal', true], ['. Gold is ', false], ['shiny', true], ['.', false]], { size: 24, name: 'w_banner' });
  s.addNotes(
    'NEW WORDS: NON-METAL, SHINY. 4 minutes. Four clicks: "non-metal", "shiny", then both words leave and they say them off the pictures, then the sentence. The picture is on screen and the word is hidden: point at the picture and WAIT. Only then click.\n\n'
    + 'FULL DRILL ON BOTH, thirty seconds each: you say it, whole class, half the class, three individuals, then back to the picture with no prompt.\n\n'
    + `NON-METAL: non-MET-al, three beats, loudest on the middle one: the same MET-al as Lesson 1 with "non" in front. Thai speakers often drop the final L ("non-met-ow"): tongue behind the top teeth. GESTURE (new, agreed today): ${G('non-metal')}. IT MEANS "NOT A METAL", and nothing more. Say it with the gesture: knock-knock (metal), then the hands sweep apart: no. The pictures are sulfur (yellow) and carbon (black): neither is a metal.\n\n`
    + 'THE BIG IDEA, say it once: a non-metal is every element that is NOT blue on the table. That includes the green gases from Lesson 1 (helium, oxygen: gases are non-metals) AND the grey ones (carbon, sulfur, silicon). Do not say "solid" or "liquid": they do not have those words.\n\n'
    + `SHINY: SHY-ni, two beats. GESTURE (new): ${G('shiny')}. Point at the gold bars: "shiny". Hold up something real and shiny if you can (a spoon, a coin, the foil from a pen): "shiny". Then something that is not: "not shiny". "Not shiny" is just the word "not" in front, with the shake of the head.\n\n`
    + 'CHECK with yes/no and either/or only: "Is gold shiny?" Yes. "Sulfur: metal or non-metal?" No open questions yet.\n\n'
    + K.credits(['sulfur', 'carbon', 'gold'])
  );
}

/* 5. NEW WORDS B · hard, soft · 4 */
{
  const s = K.slide('light', 4, 'New words');
  K.keywords(s, ['hard', 'soft']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'hard', say: SAY('hard'), meaning: 'A rock is hard.', pics: ['rock'], colour: INK.metal },
    { word: 'soft', say: SAY('soft'), meaning: 'A teddy is soft.', pics: ['teddy'], colour: INK['non-metal'] },
  ], { h: 4.1, picSize: 1.75, spread: 2.0, picNames: false, wordSize: 40 });
  K.banner(s, [['Iron is ', false], ['hard', true], ['. A teddy is ', false], ['soft', true], ['.', false]], { size: 24, name: 'w_banner' });
  s.addNotes(
    'NEW WORDS: HARD, SOFT. 4 minutes. Four clicks, the same as the last slide: point, wait, click; then both words leave; then the sentence.\n\n'
    + 'DO THIS ONE WITH YOUR HANDS. Pass round three real things (a key, a spoon, a rubber, a sponge, cotton wool): they press each one and say "hard" or "soft" with the gesture. TOUCH, NOT LOOK: you cannot tell hard from soft from a photograph.\n\n'
    + `HARD: one beat, and the D must be heard ("har"). GESTURE (new): ${G('hard')}. Thai speakers often swallow the final D: say "hard-d" with a tap of the tongue. A rock is hard; iron is hard (the iron bar in the Lesson 1 photograph).\n\n`
    + `SOFT: one beat, with a clear T at the end. GESTURE (new): ${G('soft')}. A teddy is soft; cotton wool is soft.\n\n`
    + 'BOTH ARE ONLY FOR THINGS THEY CAN TOUCH: the sealed vials cannot be pressed, so today the vials are described by what they LOOK like (shiny or not shiny). "Hard" and "soft" come back with the real things on Friday and Tuesday.\n\n'
    + 'DO NOT SAY "gold is soft" (it is, a little, but to a beginner it will undo "gold is shiny and hard"). The class sentence is "Iron is hard."\n\n'
    + K.credits(['rock', 'teddy', 'iron'])
  );
}

/* 6. LOOK AND SAY · the four samples · 4 */
{
  const s = K.slide('light', 4, 'Look and say');
  K.keywords(s, ['metal', 'non-metal', 'shiny']);
  K.title(s, 'Look at the samples');
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 3.85, y0 = 1.85;
  ANS.SAMPLES.forEach((k, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, name: `ls${i}` });
    K.pic(s, k, x + cw / 2, y0 + 0.12 + 1.05, 2.1, `ls${i}_img`);
    const sym = WORDS.symbolOf(k);
    s.addImage({ path: K.picFile(`tile_${sym}`), x: x + 0.12, y: y0 + 1.5, w: 0.95, h: 0.95, objectName: `ls${i}_tile` });
    s.addText([
      { text: `This is ${name(k)}.`, options: { breakLine: true, color: C.dark } },
      { text: `It is ${cls(k) === 'metal' ? 'a metal' : 'a non-metal'}.`, options: { breakLine: true, color: INK[cls(k)] } },
      { text: `It is ${WORDS.EL[sym].look}.`, options: { color: C.inkSoft } },
    ], { x: x + 0.12, y: y0 + 2.5, w: cw - 0.24, h: 1.2, fontFace: F.body, fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 21, objectName: `ls${i}_t` });
  });
  K.banner(s, FRAME);
  s.addNotes(
    'LOOK AND SAY. 4 minutes. Four clicks, one sample each: the sentence appears. THE FRAME AT THE BOTTOM, "This is ___. It is a ___. It is ___.", STAYS ON EVERY SLIDE FROM HERE.\n\n'
    + 'PASS THE REAL VIALS ROUND (one set per group of four if you can, or one set that travels). Point at the vial, then at the photograph, then at the tile. LOOK FIRST: "What colour? Is it shiny?" Then click: the sentence.\n\n'
    + 'YOU SAY EACH SENTENCE, THEY REPEAT, WITH THE GESTURES:\n'
    + ANS.SAMPLES.map((k) => `  ${ANS.sentence(k)}   (${WORDS.EL[WORDS.symbolOf(k)].say}; symbol ${WORDS.symbolOf(k)}, "${[...WORDS.symbolOf(k)].join('-')}")`).join('\n') + '\n\n'
    + 'COPPER: KOP-er, shiny and orange-brown, a metal (blue on the table). CARBON: KAR-bon, black, not shiny, a non-metal. SULFUR: SUL-fer, yellow, not shiny, a non-metal; British spelling is "sulfur" (they will see "sulphur" in older books: say "same word"). SILICON: SIL-i-kon, grey and SHINY, and a non-metal.\n\n'
    + 'THE ONE THAT SURPRISES: SILICON LOOKS LIKE A METAL (grey, shiny) AND IT IS A NON-METAL. Say so: "Look: shiny. But it is a non-metal." Do not explain why. The next slide shows who decides: the table. (Silicon is really between a metal and a non-metal; for this class it is a non-metal, because its box on the table is not blue.)\n\n'
    + 'DO NOT PRESS OR OPEN THE VIALS. They are sealed glass: look, do not shake.\n\n'
    + 'SYMBOLS are said as LETTER NAMES, every time: C is "see", S is "ess", Si is "ess-eye", Cu is "see-you".\n\n'
    + K.credits(ANS.SAMPLES)
  );
}

/* 7. THE TABLE · the table decides · 4 */
{
  const s = K.slide('light', 4, 'Look');
  K.keywords(s, ['metal', 'non-metal', 'symbol']);
  K.title(s, 'Find them on the table');
  const tx = M, ty = 1.72, tw = 8.0, th = 4.3;
  K.wide(s, 'pt_full', tx, ty, tw, th, 'pt_all');
  K.wide(s, 'pt_vials_ring', tx, ty, tw, th, 'pt_four');
  const px = M + tw + 0.2, pw = CW - tw - 0.2;
  [['Cu', 'metal'], ['C', 'non-metal'], ['S', 'non-metal'], ['Si', 'non-metal']].forEach(([sym, cl], i) => {
    const y = 1.85 + i * 1.05;
    K.card(s, { x: px, y, w: pw, h: 0.92, name: `kr${i}` });
    s.addImage({ path: K.picFile(`tile_${sym}`), x: px + 0.1, y: y + 0.1, w: 0.72, h: 0.72, objectName: `kr${i}_tile` });
    K.chip(s, cl, px + 0.92, y + 0.22, pw - 1.04, 0.48, `kr${i}_chip`, 16);
  });
  K.banner(s, [['Blue is a ', false], ['metal', true], ['. Not blue is a ', false], ['non-metal', true], ['.', false]], { size: 24, name: 'table_banner' });
  s.addNotes(
    'FIND THEM ON THE TABLE. 4 minutes. Three clicks: the four boxes light up; their answers; the sentence. THE TABLE IS ON SCREEN FROM THE START, the same table as Lesson 1 (blue, green, grey).\n\n'
    + 'POINT AT THE TABLE AND WAIT: "Colours?" (blue, green, grey). Then name them with the gestures: blue = METAL (knock-knock). Green = GAS (floating hands), the same green as Lesson 1. Grey = the one they shrugged at last time. TODAY THE GREY HAS A NAME.\n\n'
    + 'CLICK 1: four boxes light up with a yellow edge: Cu, C, S, Si. "Find Cu." They point on the worksheet picture or come to the board. Copper is BLUE. Carbon, sulfur and silicon are GREY.\n\n'
    + 'CLICK 2: the answers. Cu: blue, metal. C, S, Si: not blue, non-metal. Say each with the gestures. SILICON AGAIN: shiny, grey on the table, so a non-metal: "THE TABLE DECIDES. Not the look."\n\n'
    + 'CLICK 3, THE BIG SENTENCE: "Blue is a metal. Not blue is a non-metal." Say it together, twice. GREEN IS NOT BLUE: so helium and oxygen are non-metals too. Point at green boxes: "gas, and a non-metal". The only job of the green boxes today is to be "not blue".\n\n'
    + 'THEY WILL NOT READ THE WHOLE TABLE. The only goal is "I can find my four boxes and say the colour".'
  );
}

/* 8. YOU SAY A · yes or no? · 4 */
{
  const s = K.slide('light', 4, 'You say');
  K.keywords(s, ['metal', 'non-metal', 'shiny', 'hard']);
  K.title(s, 'Yes or no?');
  const gap = 0.24, cw = (CW - 2 * gap) / 3, ch = 1.9, y0 = 1.8;
  ANS.YES_NO.forEach((q, i) => {
    const x = M + (i % 3) * (cw + gap), y = y0 + Math.floor(i / 3) * (ch + 0.14);
    K.card(s, { x, y, w: cw, h: ch, name: `yn${i}` });
    K.pic(s, q.key, x + 0.8, y + 0.78, 1.3, `yn${i}_img`);
    s.addText(q.q, { x: x + 1.55, y: y + 0.1, w: cw - 1.65, h: 0.95, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: `yn${i}_t` });
    K.tag(s, q.yes ? 'YES' : 'NO', x + 1.55, y + 1.2, 1.5, 0.5, `yn${i}_chip`, q.yes ? C.support : C.alert, 18);
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART A: YES OR NO. 4 minutes. Six clicks, one answer each. Yes/no questions come first because they need the least English.\n\n'
    + 'THE ROUTINE FOR EACH QUESTION: point at the picture and ask. They answer "Yes!" or "No!" with a nod or a shake. The stronger ones add the sentence: "Yes. Copper is a metal." / "No. Sulfur is a non-metal." Take the sentence from one student, then the whole class repeats it. Click: the answer.\n\n'
    + 'THE SIX, MIXED ON PURPOSE (answers from the answers module):\n  '
    + ANS.YES_NO.map((q) => `${q.q} ${q.say}`).join('\n  ') + '\n\n'
    + 'THE TRAPS: "Is silicon shiny?" is YES (and it is still a non-metal: ask the next question, "Is silicon a metal?" and wait for "No"). "Is helium a non-metal?" is YES: green is not blue, so a gas is a non-metal. Do not let a "no" end without the right sentence.\n\n'
    + 'IF THE ROOM IS SILENT, go back to slide 6 for that sample. IF IT IS FLUENT, skip to the next slide: they are ready to stand.\n\n'
    + K.credits(['copper', 'sulfur', 'silicon', 'iron', 'gold', 'helium'])
  );
}

/* 9. YOU SAY B · metal or non-metal? standing, pairs · 5 */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['metal', 'non-metal']);
  K.title(s, 'Metal or non-metal?');
  s.addText([
    { text: 'metal: ', options: { bold: true, color: INK.metal } }, { text: 'stand tall and knock', options: { color: C.inkSoft } },
    { text: '          non-metal: ', options: { bold: true, color: INK['non-metal'] } }, { text: 'sweep your hands apart', options: { color: C.inkSoft } },
  ], { x: M, y: 1.62, w: CW, h: 0.4, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'rule' });
  const gap = 0.18, cw = (CW - 5 * gap) / 6, ch = 2.8, y0 = 2.55;
  ANS.EITHER.forEach((q, i) => {
    K.tile(s, q.key, M + i * (cw + gap), y0, cw, ch, `eo${i}`, { cls: q.cls });
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART B: EITHER/OR, STANDING, IN PAIRS. 5 minutes, the active block. Six clicks, one answer each. THE FRAME STAYS AT THE BOTTOM.\n\n'
    + 'THE GAME, everyone standing, then pairs. Point at a picture and ask: "Metal or non-metal?" If it is a METAL they stand tall and knock twice on the desk. If it is a NON-METAL they sweep their hands apart ("no"). They all do it at the same time and the sentence follows: "Gold is a metal." "Sulfur is a non-metal." Click: the answer appears in blue (metal) or grey (non-metal), the colours of the table.\n\n'
    + 'THE ORDER IS MIXED ON PURPOSE: ' + ANS.EITHER.map((q) => name(q.key)).join(', ') + ': so nobody can guess a pattern. Wait a beat before they move: they should decide first. Silicon is the one to wait on: it is shiny and the hands will want to knock.\n\n'
    + 'THEN PAIRS (the last two minutes): A points at a picture, B says the whole sentence with the gesture, then they swap. This is where the speaking minutes are (CLIL.md). Walk round and listen for the S on "gas", the D on "gold" and the L on "metal".\n\n'
    + 'HELIUM: "a non-metal, a gas." Say it once, with both gestures: floating hands, then the sweep.\n\n'
    + K.credits(ANS.EITHER.map((q) => q.key))
  );
}

/* 10. YOU SAY C · open: look and say · 5 */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['metal', 'non-metal', 'shiny', 'not shiny']);
  K.title(s, 'Look. Say.');
  s.addText('metal   ·   non-metal   ·   shiny   ·   not shiny   ·   hard   ·   soft', { x: M, y: 1.72, w: CW, h: 0.45, color: C.support, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'words' });
  const gap = 0.24, cw = (CW - 3 * gap) / 4, y = 2.3, ch = 3.7;
  ANS.OPEN.forEach((q, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `op${i}` });
    K.pic(s, q.key, x + cw / 2, y + 0.12 + 1.0, 2.0, `op${i}_img`);
    s.addText(name(q.key), { x: x + 0.1, y: y + 2.2, w: cw - 0.2, h: 0.45, color: C.dark, fontFace: F.title, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `op${i}_t` });
    const sym = WORDS.symbolOf(q.key);
    s.addText(`It is ${cls(q.key) === 'metal' ? 'a metal' : 'a non-metal'}.\nIt is ${WORDS.EL[sym].look}.`, {
      x: x + 0.15, y: y + 2.7, w: cw - 0.3, h: 0.9, color: INK[cls(q.key)], fontFace: F.body, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, lineSpacing: 21, objectName: `op${i}_a`,
    });
  });
  K.banner(s, FRAME);
  s.addNotes(
    'YOU SAY, PART C: OPEN. 5 minutes. Four clicks, one sample each. NOW THE QUESTION IS OPEN: "What is this? Tell me about it." The frame carries them.\n\n'
    + 'PAIRS FOR TWO MINUTES FIRST, WITH THE REAL VIALS. One vial between two. A holds the vial and points, B says the three sentences, then they swap. Walk round: LISTEN FIRST, correct by repeating it back correctly.\n\n'
    + 'THEN ONE STUDENT PER SAMPLE says all three sentences to the class before you click. The click shows the last two lines, the model.\n\n'
    + 'THE ANSWERS (from the answers module):\n  ' + ANS.OPEN.map((q) => q.say).join('\n  ') + '\n\n'
    + 'THE STRONGEST ADD A COLOUR ("It is yellow.") or the symbol ("Its symbol is S."): both are right, and both come from Lesson 1.\n\n'
    + 'THIS IS THE LAST SPEAKING BEFORE THE WORKSHEET. If the room is quiet, run the either/or again for two minutes.\n\n'
    + K.credits(ANS.SAMPLES)
  );
}

/* 11. YOU DO · 8 */
{
  const s = K.slide('light', 8, 'You do');
  K.title(s, 'Your worksheet');
  const CARDS = [['A', ['copper', 'sulfur'], 'Look. Write.', 'Write the name. Circle metal or non-metal.'], ['B', ['silicon'], 'Shiny?', 'Circle shiny or not shiny.'], ['C', ['speech'], 'Write.', 'Copy the sentence. Then write one of your own.']];
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
  s.addText('metal   ·   non-metal   ·   shiny   ·   not shiny   ·   copper   ·   carbon   ·   sulfur   ·   silicon', { x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'wb_words' });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  s.addNotes(
    'YOU DO. 8 minutes. Four clicks: A, B, C, then the banner. The word bank stays on screen.\n\n'
    + 'THE WORKSHEET (picture-led; no matching lines; a word bank and a writing line). A: four photographs (carbon, copper, silicon, sulfur) with their tiles: write the name from the word bank and circle metal or non-metal. B: the same four, circle shiny or not shiny. C: copy "This is copper. It is a metal. It is shiny." then write one of their own with the frame.\n\n'
    + 'BEFORE THEY WRITE, EVERY TIME: "Point first. Then say the whole sentence." They point at the picture, say the sentence aloud, THEN write it. Walk round and listen first, read second.\n\n'
    + 'COMMON SLIPS: "non metal" with no hyphen; "sulphur" (older spelling: accept it, say "sulfur"); the capital letter on "Copper" at the start of a sentence; "Si" written "SI". Silicon is the one they will circle "metal" for, because it is shiny: ask them to look at the colour of its box on the table picture.\n\n'
    + 'THE ANSWERS are upside down at the end of the worksheet, for you.\n\n'
    + 'FAST FINISHERS: write the symbol under each photograph.'
  );
}

/* 12. SAY IT TOGETHER · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('This is ___. It is a ___.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const TILES = ['copper', 'sulfur', 'gold', 'carbon', 'silicon', 'iron', 'helium', 'oxygen'];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 1.96;
  TILES.forEach((k, i) => {
    const x = M + (i % 4) * (cw + gap), y = 2.5 + Math.floor(i / 4) * (ch + 0.16);
    K.tile(s, k, x, y, cw, ch, `tg${i}`, { line: C.darkSoft, tick: true });
  });
  s.addText('Tomorrow: does it light up?', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tg_next' });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Eight clicks, one element each: the chip shows metal or non-metal. THE PLENARY EVERYONE CAN WIN (CLIL.md): every answer is correct, so everyone succeeds out loud.\n\n'
    + 'THE SENTENCE FIRST, whole class, twice, with the gestures: metal (knock-knock), non-metal (knock, then sweep), shiny (sparkle).\n\n'
    + 'THEN EACH PICTURE: point, and the class says "This is copper. It is a metal." BEFORE the click. Any true extra is right: "It is shiny." The click shows the class.\n\n'
    + 'TOMORROW (Friday P7, the last lesson of the week): the circuit boards. Say it with a smile: "Tomorrow: does it light up? We test them!" Show a bulb and a battery if you have them. Do not teach the circuit today.\n\n'
    + K.credits(TILES)
  );
}

K.write();

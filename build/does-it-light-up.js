/**
 * T3 Developing Science (CLIL), Unit 8: The Periodic Table. Lesson 3 of 5: Does It Light Up?
 * Week 2 Friday P7, Friday 6 November 2026 (14:10 to 15:00, the last lesson of the week). A SINGLE: 50 minutes.
 * Friday P7 gets the most active thing (CLIL.md) and no assessment: this is the circuit-board practical.
 *
 * PREVIOUS: Metal Or Non-Metal (Lesson 2, Thursday 5 November, yesterday): non-metal, shiny, hard, soft; the four samples
 * (copper, carbon, sulfur, silicon); "blue is a metal, not blue is a non-metal"; the frame "This is ___. It is a ___. It is ___."
 * NEXT: What Is It Made Of? (the Tuesday 10 November double): objects, the elements they are made of, Goal 12, the check.
 *
 * New words: electricity, bulb, circuit, conduct. Frame: "___ conducts electricity." / "___ does not conduct electricity."
 * ("on" and "off" are shown on the bulb pictures, not drilled.) What conducts is in build/does-it-light-up-answers.js.
 */
const ANS = require('./does-it-light-up-answers');
const K = require('./periodic-kit')({
  lesson: 'Does It Light Up',
  title: 'Does It Light Up?',
  subject: 'T3 Developing Science · Unit 8 The Periodic Table · Lesson 3 · T3',
});
const { S, C, F, H, M, RIGHT, CW, PILL_Y, PILL_H, BODY_Y, CHIP, INK, WORDS } = K;
const DATE = 'Friday 6 November 2026';
const G = (w) => WORDS.gesture(w);
const SAY = (w) => WORDS.say(w);
const ON = C.support, OFF = '8A98A4';
const FRAME_Y = 5.98, FRAME_H = 1.0;

/** The two-line frame, on every speaking slide from "Predict" on. */
function frame(s, o = {}) {
  s.addText([
    { text: '___ conducts electricity.', options: { color: C.accent, breakLine: true } },
    { text: '___ does not conduct electricity.', options: { color: C.tint } },
  ], {
    shape: S.roundRect, rectRadius: 0.12, x: M, y: o.y ?? FRAME_Y, w: CW, h: o.h ?? FRAME_H, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    fontFace: F.title, fontSize: o.size || 22, bold: true, align: 'center', valign: 'middle', margin: 0.08, lineSpacing: 30, objectName: o.name || 'frame_banner',
  });
}
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
    imgs.forEach((k, j) => K.pic(s, k, x + cw / 2 + (j - (imgs.length - 1) / 2) * 1.3, y + 1.0, 1.35, `o${i}_img${j}`));
    s.addText(text, { x: x + 0.28, y: y + 1.9, w: cw - 0.56, h: 1.3, color: C.ink, fontFace: F.body, fontSize: 19, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 24, objectName: `o${i}_t` });
  });
}
const gestureLines = (words) => words.map((w) => `  ${w} = ${G(w)}.`).join('\n');
const el = ANS.element;

/* 1. TITLE · 1 */
titleSlide('Does it\nlight up?', 'Test. Look. Say.', ['bulb', 'circuit_on', 'wire', 'nail'],
  'TITLE. 1 minute. Lesson 3 of 5 in The Periodic Table. FRIDAY P7, the last lesson of the week: the most active lesson of the unit, no assessment (CLIL.md). Yesterday was the samples; today the class TESTS something.\n\n'
  + 'READ THE TITLE slowly, pointing: "Does... it... light... up?" The class reads it with you. Point at the lit bulb: "Light." Point at the circuit picture and say nothing about it yet: it is on slide 5.\n\n'
  + 'BEFORE THE LESSON, SET UP ONE CIRCUIT BOARD PER GROUP OF FOUR (a small low-voltage battery pack or 1.5 V to 4.5 V, a 2.5 V or 3.8 V bulb, two crocodile clips): TEST EACH BOARD BEFORE THEY COME IN, with a metal object, so a flat battery is not a lesson. SAMPLES FOR EACH GROUP, LABELLED: a strip or length of copper wire, an iron nail, a strip of aluminium foil folded to a strip, a stick or lump of SULFUR (from the prep room: the sealed vial cannot be tested), and a PENCIL SHARPENED AT BOTH ENDS (the clips go on the black lead). THE SULFUR AND THE PENCIL ARE THE ONES TO CHECK ON YOUR BOARD FIRST: sulfur must keep the bulb OFF, and the pencil lead must light it. Everything in this deck is for a normal school board; if yours behaves differently, change that answer on the slide notes, the worksheet and the answers.\n\n'
  + 'CHANGE THE DATE before you teach, if the lesson falls on a different day.\n\n'
  + K.credits(['bulb', 'wire', 'nail']));

/* 2. TODAY · 2 */
{
  const s = K.slide('light', 2, 'Today');
  K.title(s, 'Today');
  goals(s, [[['circuit_on'], 'Test: does the\nbulb light up?'], [['speech'], 'Say: Copper conducts\nelectricity.'], [['writing'], 'Write the results.']]);
  s.addNotes(
    'TODAY. 2 minutes. Three clicks, one goal each.\n\n'
    + `Read each goal. The class repeats the key word with its action: "test" (point at the bulb, then look), "say" (a hand from the mouth), "write" (write in the air). Point at goal 2 and say: "This sentence. Today you will say it. Conducts electricity."\n\n`
    + 'THE PRACTICAL IS GOAL 1, AND IT IS THE BIGGEST BLOCK (13 minutes). Say so: "First words. Then a film. Then YOU test!" Hold up a bulb, a battery and a clip if you have them.\n\n'
    + 'DO NOT READ LONG OBJECTIVES OUT.'
  );
}

/* 3. REMEMBER · yesterday, picture first · 4 */
{
  const s = K.slide('light', 4, 'Remember');
  K.title(s, 'Do you remember?');
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 1.98, y0 = 1.85;
  ANS.REMEMBER.forEach(([k, word], i) => {
    const x = M + (i % 5) * (cw + gap), y = y0 + Math.floor(i / 5) * (ch + 0.16);
    K.card(s, { x, y, w: cw, h: ch, name: `rm${i}` });
    K.pic(s, k, x + cw / 2, y + 0.1 + 0.62, 1.24, `rm${i}_img`);
    s.addText(word, { x: x + 0.05, y: y + 1.44, w: cw - 0.1, h: 0.46, color: C.dark, fontFace: F.title, fontSize: word.length > 8 ? 21 : 24, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rm${i}_word` });
  });
  K.banner(s, [['Blue is a ', false], ['metal', true], ['. Not blue is a ', false], ['non-metal', true], ['.', false]], { size: 24 });
  s.addNotes(
    'REMEMBER. 4 minutes. Five clicks, two words each. Yesterday\'s lesson, picture first. THE GAP IS ONE DAY, so this is quick: point, they say, click.\n\n'
    + 'ROW 1, THE FIVE SAMPLES: they say the whole sentence off the photograph, with the gestures:\n  ' + Object.values(ANS.REMEMBER_SENTENCE).join('\n  ') + '\n\n'
    + 'ROW 2, THE WORDS, with the gestures from yesterday and Lesson 1:\n' + gestureLines(['metal', 'non-metal', 'shiny', 'hard', 'soft']) + '\n'
    + '(The non-metal picture is the helium balloons: a gas is a non-metal too. The shiny picture is aluminium foil.)\n\n'
    + 'THE BANNER is yesterday\'s big idea: "Blue is a metal. Not blue is a non-metal." Say it together, with the knock and the sweep.\n\n'
    + K.credits(ANS.REMEMBER.map(([k]) => k))
  );
}

/* 4. NEW WORDS A · electricity, bulb · 3 */
{
  const s = K.slide('light', 3, 'New words');
  K.keywords(s, ['electricity', 'bulb']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'electricity', say: SAY('electricity'), meaning: 'Lightning is electricity.', pics: ['lightning'] },
    { word: 'bulb', say: SAY('bulb'), meaning: 'The bulb is on.', pics: ['bulb'] },
  ], { h: 4.1, picSize: 1.75, spread: 2.0, picNames: false, wordSize: 38 });
  K.banner(s, [['Lightning is ', false], ['electricity', true], ['. The ', false], ['bulb', true], [' is on.', false]], { size: 24, name: 'w_banner' });
  s.addNotes(
    'NEW WORDS: ELECTRICITY, BULB. 3 minutes. Four clicks: "electricity", "bulb", both leave and they say them off the pictures, then the sentence. The picture is on screen and the word is hidden: point at it and WAIT. Only then click.\n\n'
    + 'FULL DRILL ON BOTH, thirty seconds each: you say it, whole class, half the class, three individuals, then back to the picture with no prompt.\n\n'
    + `ELECTRICITY: five beats, loudest on the FOURTH: e-lec-TRIS-i-ty. Clap it: clap-clap-CLAP-clap-clap. Thai speakers often put the stress early or drop the middle ("elec-TRI-ty"): say it slowly, in chunks, e-lec... TRIS... i-ty, and let them join it. GESTURE (new, agreed today): ${G('electricity')}. Do not say "energy", "current" or "volts": they do not have those words. "Lightning is electricity" and "electricity makes the bulb light" are the only ideas.\n\n`
    + `BULB: one beat, and the B at the end must be heard ("bulb", not "bul"). GESTURE (new): ${G('bulb')}. Hold up a real bulb. "The bulb is on" (the light is on) and "the bulb is off": say them with the gesture and the click of a switch. ON and OFF are shown beside the bulb pictures all lesson: they are used, not drilled; most of them already have "on" and "off" from the classroom.\n\n`
    + 'CHECK with yes/no and either/or only: "Is this lightning?" "Electricity or bulb?" (pointing at each picture). No open questions yet.\n\n'
    + K.credits(['lightning', 'bulb'])
  );
}

/* 5. NEW WORDS B · circuit, conduct · 3 */
{
  const s = K.slide('light', 3, 'New words');
  K.keywords(s, ['circuit', 'conduct']);
  K.title(s, 'Say the words');
  K.wordCards(s, [
    { word: 'circuit', say: SAY('circuit'), meaning: 'Electricity goes round.', pics: ['circuit_gap'] },
    { word: 'conduct', say: SAY('conduct'), meaning: 'Copper conducts electricity.', pics: ['circuit_on'] },
  ], { h: 4.1, picSize: 1.8, spread: 2.0, picNames: false, wordSize: 40 });
  K.banner(s, [['Electricity goes round a ', false], ['circuit', true], ['. Copper ', false], ['conducts', true], [' electricity.', false]], { size: 22, name: 'w_banner' });
  s.addNotes(
    'NEW WORDS: CIRCUIT, CONDUCT. 3 minutes. Four clicks, the same as the last slide: point, wait, click; then both words leave; then the sentence.\n\n'
    + `CIRCUIT: SUR-kit, two beats, loudest on the first. The R is silent in British speech ("sir-kit"). Thai speakers often say "sir-cuit" with a long vowel or add a vowel at the end: keep it short, "kit" like the kit they use. GESTURE (new): ${G('circuit')}. It is the loop from the battery, round the bulb, back to the battery. The picture has a GAP in the bottom wire: "no sample, no circuit, the bulb is off." Point at the gap.\n\n`
    + `CONDUCT: con-DUCT, two beats, loudest on the SECOND, and the T at the end must be heard ("con-duct", not "con-duck"). GESTURE (new): ${G('conduct')}. THE MEANING: if the sample is in the gap, the loop is whole and electricity can go round. If electricity goes through the sample, the sample CONDUCTS electricity, and the bulb lights up. The second picture shows copper in the gap and the dots running: the bulb is on.\n\n`
    + 'THE S ON "CONDUCTS": with one thing ("copper conducts", "sulfur does not conduct") the verb takes an s, and "does not" takes it away again. Hiss the s and point at it in the banner. Recast "copper conduct" to "copper conducts" every time; do not explain the rule. They have met this with "it grows" in the Living Things unit.\n\n'
    + 'DO NOT SAY "current", "wire", "metal wire" or "insulator". If someone asks what does NOT conduct: "does not conduct". That is the frame.'
  );
}

/* 6. THE FILM · how it works · 4 */
{
  const s = K.slide('light', 4, 'Look');
  K.keywords(s, ['circuit', 'conduct', 'bulb']);
  K.title(s, 'Look at the circuit');
  K.video(s, 'circuit-test', M, 1.78, 7.3, 4.1, 'circuit_video');
  const cx = M + 7.55, cw = CW - 7.55, ch = 1.9;
  [['wire', 'copper', true], ['sulfur', 'sulfur', false]].forEach(([k, label, yes], i) => {
    const y = 1.78 + i * (ch + 0.3);
    K.card(s, { x: cx, y, w: cw, h: ch, line: yes ? ON : OFF, lineWidth: 2.5, name: `fm${i}` });
    K.pic(s, k, cx + 0.85, y + 0.85, 1.35, `fm${i}_img`);
    s.addText(`${label[0].toUpperCase()}${label.slice(1)}\n${yes ? 'conducts' : 'does not conduct'}`, { x: cx + 1.65, y: y + 0.15, w: cw - 1.75, h: 1.0, color: C.dark, fontFace: F.title, fontSize: 18, bold: true, valign: 'middle', margin: 0, lineSpacing: 23, objectName: `fm${i}_t` });
    K.tag(s, yes ? 'bulb ON' : 'bulb OFF', cx + 1.65, y + 1.2, 1.7, 0.45, `fm${i}_chip`, yes ? ON : OFF, 16);
  });
  frame(s);
  s.addNotes(
    'THE FILM. 4 minutes. Three clicks: the film plays (25 seconds, silent); then the copper card; then the sulfur card. THE FILM PLAYS ON CLICK, after you have said the idea (CLIL.md media rule).\n\n'
    + 'BEFORE YOU CLICK, point at the picture: "A battery. A bulb. A circuit. A gap." The class says the words and does the gestures (point at the battery and the gap). "What is in the gap?" Nothing yet. Then click.\n\n'
    + 'WHILE IT PLAYS (the film stops at every step, on purpose): the copper strip slides into the gap; WAIT, a second of nothing; then the bulb comes on and the yellow dots run round the circuit. The dots are the electricity. Say nothing over the dots: let them look. When the bulb is on, ask: "On or off?" "Does it light up?" (yes). Then the copper goes out and the bulb goes off. Then the sulfur slides in: the dots do not move, the bulb stays OFF. "On or off?" (off).\n\n'
    + 'CLICK 2 AND 3, THE SENTENCES: "Copper conducts electricity." (the gestures: conduct, electricity); "Sulfur does not conduct electricity." (shake the head on "does not"). The whole class repeats. THIS IS THE FRAME THEY WILL USE ALL LESSON; it stays at the bottom of every speaking slide.\n\n'
    + 'THE FILM IS ONE PICTURE OF WHAT THEY ARE ABOUT TO DO. Do not say why copper works and sulfur does not: that is Year 9 (and beyond, for the keen ones). "Some things conduct. Some do not. We test."\n\n'
    + 'IT IS A DRAWING, NOT A RECORDING: the real board will look different, which is why the slide after the prediction shows how to test. It is silent, so you do the talking. Click the video again to replay it if they ask.'
  );
}

/* 7. PREDICT · thumbs · 4 */
{
  const s = K.slide('light', 4, 'You say');
  K.keywords(s, ['conduct', 'electricity']);
  K.title(s, 'Will the bulb light up?');
  s.addText([
    { text: 'Yes: ', options: { bold: true, color: ON } }, { text: 'thumbs up', options: { color: C.inkSoft } },
    { text: '          No: ', options: { bold: true, color: OFF } }, { text: 'thumbs down', options: { color: C.inkSoft } },
  ], { x: M, y: 1.62, w: CW, h: 0.4, fontFace: F.body, fontSize: 17, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'rule' });
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 3.65, y0 = 2.1;
  ANS.PREDICT.forEach((k, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, name: `pd${i}` });
    K.pic(s, k, x + cw / 2, y0 + 0.12 + 0.97, 1.94, `pd${i}_img`);
    s.addText(WORDS.name(k), { x: x + 0.05, y: y0 + 2.2, w: cw - 0.1, h: 0.5, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `pd${i}_t` });
    s.addText('?', { x: x + 0.05, y: y0 + 2.8, w: cw - 0.1, h: 0.65, color: C.accentInk, fontFace: F.title, fontSize: 34, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `pd${i}_q` });
  });
  frame(s);
  s.addNotes(
    'YOU SAY, PART A: WILL THE BULB LIGHT UP? 4 minutes. NO CLICKS: the answers are NOT on this slide. The test gives them (slide 9).\n\n'
    + 'THIS IS THE YES/NO STAGE, DONE WITH THUMBS. Point at a sample: "Will the bulb light up?" Hold up the real sample. Everyone puts a thumb up (yes) or down (no) AT THE SAME TIME on your count of three. Count the thumbs aloud. They write their guess on the worksheet (A, the column "I think"), then say it: "Copper conducts electricity." or "I think: yes."\n\n'
    + 'DO NOT CORRECT A WRONG GUESS. Wrong guesses are the point: the bulb will tell them. Take a few "why?" answers in any language, and move on: "We test!"\n\n'
    + 'THE FIVE: copper wire, an iron nail, aluminium foil, sulfur, and a pencil. YOU ALREADY KNOW what the pencil lead (graphite, a form of CARBON) does: it conducts, and it is the surprise. Most students think carbon is a non-metal so it will not: they are right about the group and wrong about this one. Do not say.\n\n'
    + 'IF THE ROOM IS SILENT, ask either/or: "Copper: on or off?" and hold the bulb up.\n\n'
    + K.credits(ANS.PREDICT)
  );
}

/* 8. HOW TO TEST · 3 */
{
  const s = K.slide('light', 3, 'Test');
  K.keywords(s, ['circuit', 'bulb']);
  K.title(s, 'How to test');
  const STEPS = [['circuit_gap', 'Put the sample in the clips.'], ['magnifier', 'Look at the bulb.'], ['bulb', 'On or off?'], ['writing', 'Write it on your sheet.']];
  const gap = 0.24, cw = (CW - 3 * gap) / 4, y = 1.85, ch = 3.4;
  STEPS.forEach(([k, t], i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y, w: cw, h: ch, name: `hs${i}` });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.5, color: C.accentInk, fontFace: F.title, fontSize: 24, bold: true, valign: 'middle', margin: 0, objectName: `hs${i}_n` });
    K.pic(s, k, x + cw / 2, y + 1.3, 1.9, `hs${i}_img`);
    s.addText(t, { x: x + 0.15, y: y + 2.4, w: cw - 0.3, h: 0.9, color: C.dark, fontFace: F.body, fontSize: 18, bold: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 22, objectName: `hs${i}_t` });
  });
  K.banner(s, [['Be careful. ', true], ['Do not touch the bulb.', false]], { size: 24, y: 5.6, h: 0.9 });
  s.addNotes(
    'HOW TO TEST. 3 minutes. Four clicks, one step each, then the safety line. DEMONSTRATE ON YOUR OWN BOARD, in front of the class (under the visualiser if you have one), saying each step as you do it.\n\n'
    + 'STEP BY STEP: 1 THE SAMPLE GOES IN THE GAP: one clip on each end of the sample, so the sample is part of the loop. 2 LOOK AT THE BULB. 3 ON OR OFF? They say the word. 4 WRITE: a tick for ON, a cross for OFF, in the right row of the worksheet. THEN TAKE THE SAMPLE OUT BEFORE THE NEXT ONE, so the board starts the same each time.\n\n'
    + 'GROUPS OF FOUR, ONE BOARD, ONE SET OF SAMPLES. Roles, shown with the hands: A holds the clips, B holds the sample, C says "on" or "off", D writes. They swap for every sample. Everyone says the sentence at the end of each test: "Copper conducts electricity." / "Sulfur does not conduct electricity."\n\n'
    + 'SAFETY, ON THE BANNER: the battery is small and the bulb can get warm after a minute. Be careful, do not touch the bulb. If a bulb does not come on with ANY sample, the clips are loose or the battery is flat: swap the board, not the lesson.\n\n'
    + 'THE PENCIL: the clips go on the black lead at the two sharpened ends, not on the wood. Show them. THE SULFUR: the lump or stick sulfur from the prep room, in a dish; wash hands afterwards. IF YOU DO NOT HAVE LOOSE SULFUR, test the SEALED VIAL by holding it between the clips: it will stay OFF, but say so ("the glass is in the gap too").'
  );
}

/* 9. THE TEST · 13 */
{
  const s = K.slide('light', 13, 'Test');
  K.keywords(s, ['conduct', 'electricity', 'bulb']);
  K.title(s, 'Test! Look. Write.');
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 3.85, y0 = 1.85;
  ANS.RESULTS.forEach((r, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, name: `ts${i}` });
    K.pic(s, r.key, x + cw / 2, y0 + 0.12 + 0.97, 1.94, `ts${i}_img`);
    s.addText(WORDS.name(r.key), { x: x + 0.05, y: y0 + 2.2, w: cw - 0.1, h: 0.5, color: C.dark, fontFace: F.title, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `ts${i}_t` });
    K.tag(s, `bulb ${r.chip}`, x + cw / 2 - 0.8, y0 + 2.95, 1.6, 0.55, `ts${i}_chip`, r.on ? ON : OFF, 17);
  });
  frame(s);
  s.addNotes(
    'TEST! 13 minutes, THE PRACTICAL. Five clicks at the END, one per sample: the bulb chips. Nothing is clicked while they test: the timer is the instruction. THE CHIPS ARE THE ANSWERS FOR WHEN THEY HAVE FINISHED: click them one at a time and the class says the sentence.\n\n'
    + 'THE ROUTINE (from the last slide): clip in, look, say on or off, write a tick or a cross, take it out. Five samples, four of them quick. Groups finish at different speeds: FAST GROUPS test a second thing from their own pencil case (a coin, a key, a rubber, a paper clip) and write it at the bottom of the sheet; ask them "conducts or does not conduct?" The rubber will not conduct and the key will: both are fine.\n\n'
    + 'GO ROUND THE GROUPS AND ASK THE THREE QUESTIONS, in the order they know: yes/no first ("Is the bulb on?"), then either/or ("On or off?"), then open ("Tell me: copper..." and they finish the frame). Every group should say at least three of the sentences to you. LISTEN FOR THE S: "conducts", and "does not conduct" with no s on the second.\n\n'
    + 'WHAT YOU SHOULD SEE: ' + ANS.RESULTS.map((r) => `${WORDS.name(r.key)}: bulb ${r.chip}`).join('; ') + '. THE SURPRISE IS THE PENCIL: the graphite in a pencil conducts, so the bulb comes on (a little dimmer than with the wire, if your board is old: still ON). If a group says "the pencil is a non-metal and the bulb is on, that is wrong", say: "Good! It is a surprise. Write what you see." The next slide says it.\n\n'
    + 'AT 10 MINUTES: "Two more, then finish the sheet." AT 13: back to seats, the boards switched off.\n\n'
    + 'PHOTO FOR THE RECORD: if you like, photograph one group\'s finished sheet for Tuesday\'s oral check.'
  );
}

/* 10. RESULTS · what did we find · 5 */
{
  const s = K.slide('light', 5, 'You say');
  K.keywords(s, ['conduct', 'electricity']);
  K.title(s, 'What did we find?');
  const lw = 7.1, rw = CW - lw - 0.3, y0 = 1.8, h = 3.95;
  K.card(s, { x: M, y: y0, w: lw, h, fill: 'E6F4EE', line: ON, lineWidth: 2.5, name: 'rs0' });
  K.tag(s, 'The bulb is ON', M + 0.2, y0 + 0.15, lw - 0.4, 0.5, 'rs0_label', ON, 20);
  K.card(s, { x: M + lw + 0.3, y: y0, w: rw, h, fill: 'EEF1F3', line: OFF, lineWidth: 2.5, name: 'rs1' });
  K.tag(s, 'The bulb is OFF', M + lw + 0.5, y0 + 0.15, rw - 0.4, 0.5, 'rs1_label', OFF, 20);
  const ons = ['wire', 'nail', 'aluminium'];
  ons.forEach((k, i) => {
    const x = M + 0.2 + i * 2.2;
    K.pic(s, k, x + 1.0, y0 + 1.7, 1.65, `rs_p${i}`);
    s.addText(WORDS.name(k), { x, y: y0 + 2.65, w: 2.0, h: 0.4, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `rs_n${i}` });
  });
  K.pic(s, 'sulfur', M + lw + 0.3 + rw / 2, y0 + 1.7, 1.65, 'rs_p3');
  s.addText('sulfur', { x: M + lw + 0.3, y: y0 + 2.65, w: rw, h: 0.4, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'rs_n3' });
  // the surprise: pencil lead
  K.card(s, { x: M + 0.2, y: y0 + 3.1, w: lw - 0.4, h: 0.75, fill: 'FFF4D6', line: C.accent, lineWidth: 2, name: 'sp' });
  K.pic(s, 'pencil', M + 0.2 + 0.5, y0 + 3.1 + 0.375, 0.6, 'sp_img');
  s.addText('Surprise! Carbon is a non-metal. The bulb is on.', { x: M + 1.0, y: y0 + 3.1, w: lw - 1.3, h: 0.75, color: C.dark, fontFace: F.body, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'sp_t' });
  s.addText([{ text: 'Metals ', options: { color: C.tint } }, { text: 'conduct', options: { color: C.accent } }, { text: ' electricity.', options: { color: C.tint } }], {
    shape: S.roundRect, rectRadius: 0.12, x: M, y: 5.9, w: CW, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 }, fontFace: F.title, fontSize: 28, bold: true, align: 'center', valign: 'middle', margin: 0.08, objectName: 'res_banner',
  });
  s.addNotes(
    'YOU SAY, PART B AND C: WHAT DID WE FIND? 5 minutes. Four clicks: the three metals in the ON box; the sulfur in the OFF box; the pencil surprise; the sentence. THE CLASS SORTS BEFORE YOU CLICK: each group points to the box where their own result belongs.\n\n'
    + 'EITHER/OR, THEN OPEN. Point at the copper wire: "On or off?" (on). "Copper conducts electricity." Click. The nail, the aluminium foil: the same sentences, the whole class. Then sulfur: "On or off?" (off). "Sulfur does not conduct electricity." Shake the head. Click.\n\n'
    + 'THE SURPRISE, WITH THE CLASS: the pencil lead is graphite, a kind of CARBON. Carbon is a NON-METAL (yesterday, grey box) and it still lit the bulb. "A surprise!" Do not go further than that: it is one exception, and a good one to remember. The sentence for the class is "Carbon conducts electricity" (it is an exception). IF SOMEONE ASKS WHY: "Graphite is a special kind of carbon." That is enough, and it is true.\n\n'
    + 'THE BIG SENTENCE: "Metals conduct electricity." Say it together, with the gestures (metal knock, conduct, electricity). It is true of every metal they tested today, and it is what the unit plan wants them to carry. THE LANGUAGE POINT IS THE FRAME: the sentence for each sample, with or without "does not".\n\n'
    + 'PAIRS FOR TWO MINUTES: A points at a picture on the slide, B says the whole sentence with the right gestures; swap.\n\n'
    + 'SILICON, if someone asks about yesterday\'s grey shiny sample: "We did not test silicon. It is between. It conducts a little." Say it only if asked.\n\n'
    + K.credits(['wire', 'nail', 'aluminium', 'sulfur', 'pencil'])
  );
}

/* 11. YOU DO · 5 */
{
  const s = K.slide('light', 5, 'You do');
  K.title(s, 'Your worksheet');
  const CARDS = [['A', ['circuit_on'], 'Test. Write.', 'Tick ON or cross OFF for each sample.'], ['B', ['wire', 'sulfur'], 'Finish.', 'conducts or does not conduct?'], ['C', ['aluminium', 'sulfur'], 'Sort.', 'Write the five names in two boxes.']];
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
  s.addText('conducts   ·   does not conduct   ·   electricity   ·   bulb   ·   circuit   ·   ON   ·   OFF', { x: M + 1.9, y: wy, w: CW - 1.9, h: 0.6, color: C.ink, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'wb_words' });
  K.banner(s, 'Point first. Then say the whole sentence.', { y: wy + 0.85, h: 0.8, size: 21, name: 'yd_banner' });
  s.addNotes(
    'YOU DO. 5 minutes, short on purpose: it is Friday P7 and they have already written their results during the test. Four clicks: A, B, C, then the banner. The word bank stays on screen.\n\n'
    + 'THE WORKSHEET (picture-led; no matching lines; a word bank and a writing line). A: THE RESULTS TABLE, already filled in during the test: check the ticks and crosses against the board. B: four sentences, finish each with "conducts" or "does not conduct". C: write the five names in two boxes, conducts electricity and does not conduct electricity.\n\n'
    + 'BEFORE THEY WRITE, EVERY TIME: "Point first. Then say the whole sentence." They point at the picture, say the sentence aloud, THEN write it. Walk round and listen first, read second.\n\n'
    + 'COMMON SLIPS: "conduct" with no s after a name; "does not conducts" (the s goes with "does": "does not conduct"); "electricty"; the pencil (they will want to write it in the OFF box: look at their own test result and ask "On or off?").\n\n'
    + 'THE ANSWERS are upside down at the end of the worksheet, for you.\n\n'
    + 'FAST FINISHERS: write one more sentence about the thing from their pencil case.'
  );
}

/* 12. SAY IT TOGETHER · 3 */
{
  const s = K.slide('dark', 3, 'Together');
  K.title(s, 'Say it together', 'dark');
  s.addText('___ conducts electricity.   ___ does not conduct electricity.', { x: M, y: 1.72, w: CW, h: 0.6, color: C.accent, fontFace: F.title, fontSize: 22, bold: true, valign: 'middle', margin: 0, objectName: 'tg_sentence' });
  const gap = 0.2, cw = (CW - 4 * gap) / 5, ch = 3.0, y0 = 2.55;
  ANS.RESULTS.forEach((r, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, line: C.darkSoft, name: `tg${i}` });
    K.pic(s, r.key, x + cw / 2, y0 + 0.12 + 0.85, 1.7, `tg${i}_img`);
    s.addText(el(r.key), { x: x + 0.05, y: y0 + 1.95, w: cw - 0.1, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 19, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `tg${i}_t` });
    K.tag(s, r.on ? 'conducts' : 'does not conduct', x + 0.1, y0 + 2.42, cw - 0.2, 0.42, `tg${i}_chip`, r.on ? ON : OFF, 14);
    s.addImage({ path: K.picFile('tick', { drawing: true }), x: x + cw - 0.52, y: y0 + 0.12, w: 0.4, h: 0.4, objectName: `tg${i}_tick` });
  });
  s.addText('Next lesson: what is it made of?', { x: M, y: H - 0.62, w: CW, h: 0.4, color: C.tintDeep, fontFace: F.body, fontSize: 15, italic: true, valign: 'middle', margin: 0, objectName: 'tg_next' });
  s.addNotes(
    'SAY IT TOGETHER. 3 minutes. Five clicks, one sample each. THE PLENARY EVERYONE CAN WIN (CLIL.md): every answer is correct, so everyone succeeds out loud.\n\n'
    + 'THE TWO SENTENCES FIRST, whole class, twice, with the gestures: conduct (finger along the arm), electricity (zigzag), and the head shake for "does not".\n\n'
    + 'THEN EACH PICTURE: point, and the class says the whole sentence BEFORE the click: "Copper conducts electricity." The click shows the chip. Anyone can say any of them. THE LAST ONE IS THE PENCIL, and the class says "Carbon conducts electricity."\n\n'
    + 'NEXT: the Tuesday double. Say it with a smile: "Tuesday: what is it made of? Ring, nail, wire. We find out!" There is no "well done, you finished" line: it is Friday P7, so a "well done, have a good weekend" is the best.\n\n'
    + K.credits(ANS.TESTED)
  );
}

K.write();

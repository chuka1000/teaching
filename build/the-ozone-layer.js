/**
 * Y9 Science, Atmosphere, Lesson 3: The Ozone Layer. Class Y9 (9G and 9I, one deck). Single, 50 minutes. Upper Air palette.
 *
 * PREVIOUS: What It Does To Us (Lesson 2, built in this batch: build/what-it-does-to-us.js): I Do 1 the three ways pollutants harm the body, I Do 2 acid rain and
 * the four ways pollution is reduced; We Do Rank And Conquer on acid rain; the particulate traps were read in the You Do (the class has a ranking of six places and
 * trap counts, so the Do Now's mean uses their kind of data). Its plenary promised: "Next: the ozone layer, which is high up and has nothing to do with acid rain."
 * Lesson 1 planted "ozone high up protects us, ozone at ground level is a pollutant" twice; today keeps that promise and says it again.
 *
 * THE LAST THREE Y9 DO NOWS (What It Does To Us, What Gets Into The Air, Pollution Pandemic) were read: nothing here repeats.
 * WE DO: SPOT THE MISTAKE (Lesson 2's was Rank And Conquer). The numbers are checked in build/atmosphere-check.py from the real NASA Ozone Watch table
 * (build/atmosphere-data/ozone_annual_data.txt). NO CHLORINE RADICAL MECHANISM anywhere (the unit plan): "one chlorine atom destroys thousands of ozone molecules
 * without being used up" is the correct and sufficient Year 9 version.
 */
const K = require('./atmosphere-kit')({ lesson: 'The Ozone Layer', subject: 'Y9 Science · Atmosphere · Lesson 3 · 9G and 9I' });
const DATA = require('./atmosphere.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H, LINE, ANS } = K;
const D3 = DATA.l3;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Describe how carbon monoxide harms the body.', 'It sticks to haemoglobin in place of oxygen, so the blood carries less oxygen.'],
    [`A trap shows ${D3.traps.counts[0]}, ${D3.traps.counts[1]} and ${D3.traps.counts[2]} specks in three fields of view. Calculate the mean.`, `(${D3.traps.counts[0]} + ${D3.traps.counts[1]} + ${D3.traps.counts[2]}) ÷ 3 = ${D3.traps.mean} specks`],
    ['State two natural sources of air pollution.', 'Any two of: volcanoes, wildfires, dust storms.'],
    ['Explain why a forest cut at exactly its regrowth rate is sustainable.', 'The forest stays the same size every year, because it grows back as fast as it is cut.'],
    ['Name the type of radiation in sunlight that causes sunburn.', 'Ultraviolet (UV) light.'],
    ['Suggest how a gas that is harmless to breathe at ground level could damage a layer 30 km above our heads.', 'It drifts up. High up, ultraviolet light breaks it apart and releases chlorine, which destroys ozone.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ What It Does To Us (the previous lesson, built in this batch) and checked every question against the last three Do Nows in the year group (What It Does To Us, What Gets Into The Air, Pollution Pandemic). Nothing repeats. THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (carbon monoxide and the blood; the mean of the trap counts, which is the same kind of number the class collected). Q3 and Q4 are EARLIER (Lesson 1: natural sources; Making It Last: a sustainable amount). Q5 is another science (physics: ultraviolet is the part of sunlight that burns, which today\'s whole lesson is about). Q6 IS THE PREVIEW: NOT RETRIEVAL. ITS CARD IS SHADED so the room can see the answer is new. They have not been taught it, so they SUGGEST. Take two or three ideas, write them on the board, then click, and say "that is objectives 1 and 2 today".\n\n'
    + `Q1: it takes the place of oxygen on haemoglobin. Q2: (${D3.traps.counts.join(' + ')}) = ${D3.traps.counts.reduce((a, b) => a + b, 0)}, ÷ 3 = ${D3.traps.mean} (watch for ${D3.traps.counts.reduce((a, b) => a + b, 0)}: they forgot to divide). Q3: volcanoes, wildfires, dust storms. Q4: it grows back as fast as it is cut, so the forest stays the same size. Q5: ultraviolet (UV). Q6: accept any idea that the gas gets up high and something breaks it apart (a student may say "the Sun"); settle it in I Do 2.\n\n`
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Describe what the ozone layer does.', 'Explain how CFCs damage the ozone layer.', 'Describe what was done about it, and what has happened since.'],
  banner: [['The ozone layer ', false], ['protects', true], [' us from ultraviolet light. It was damaged by ', false], ['CFCs', true], [', and it is now ', false], ['recovering', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'ONE NEW WORD: OZONE LAYER. THE BANNER IS THE WHOLE LESSON, AND THE GOOD ENDING IS IN IT. Say it plainly: "of all the problems in this unit, this is the one that we are fixing". Do not say more; the lesson earns it.\n\n'
    + 'TWO CORRECTIONS, MADE EARLY BECAUSE BOTH WILL BE IN THE ROOM. (1) IT IS A THINNING, NOT A HOLE: nothing is missing, the layer is stretched thin over Antarctica each spring. (2) IT HAS NOTHING TO DO WITH THE GREENHOUSE EFFECT: different gases, a different part of the atmosphere, a different harm. "The hole in the ozone layer lets the heat in" is the sentence to listen for, and it will be said. Do not argue with it now: the We Do is built on it.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'CFCs were safe to breathe, did not burn and poisoned nobody. In 1985 scientists found the ozone layer, 30 km above our heads, was thinning. CFCs were the cause. How can a harmless gas do that?',
  qSize: 18,
  picture: { key: 'atm_aerosol', w: 1.80, h: 1.80, y: 0.50 },
  opts: ['It reacts with ozone as soon as it escapes from a fridge or a can.', 'Ultraviolet light high up breaks it apart and releases chlorine.', 'It makes the air so warm that the ozone layer melts.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'THE PICTURE is an old refrigerator, one of the two things CFCs were used in (the other was aerosol spray cans). Read the question. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the second I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. CFCs (chlorofluorocarbons) are very unreactive, which is exactly why they seemed safe: they did not burn, poison anyone or react with anything at ground level, so they lasted. They slowly drift up into the stratosphere, where strong ultraviolet light breaks them apart and releases chlorine atoms. That is the damage. A is the tempting wrong one: if CFCs reacted with ozone at ground level, they would have been noticed (and ozone is only a thin trace gas there). C is the confusion with the greenhouse effect: a warmer air does not "melt" ozone, and ozone depletion is NOT a heating problem. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: what the ozone layer does (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'What the ozone layer does');
  const dw = 4.90, dh = dw * 760 / 1000, dy = 1.80;
  K.card(s, { x: M - 0.06, y: dy - 0.06, w: dw + 0.12, h: dh + 0.12, name: 'ly' });
  K.pic(s, 'atm-layers', M, dy, dw, dh, 'ly_pic');
  const rx = M + dw + 0.36, rw = RIGHT - rx;
  K.card(s, { x: rx, y: dy, w: rw, h: 1.18, fill: ANS, line: C.accentInk, lineWidth: 1.8, name: 'uv' });
  s.addText([{ text: 'The ozone layer absorbs the most harmful ultraviolet (UV) light from the Sun.', options: { bold: true, color: C.dark, fontSize: 17 } }], { x: rx + 0.24, y: dy, w: rw - 0.48, h: 1.18, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 22, objectName: 'uv_t' });
  s.addText('WITHOUT IT, MORE UV REACHES THE GROUND', { x: rx, y: dy + 1.34, w: rw, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'wo_h' });
  const EFF = [['Skin cancer', 'and burns'], ['Cataracts', 'clouding of the eye'], ['Damaged crops', 'smaller harvests'], ['Damaged plankton', 'the base of the ocean food chain']];
  const ew = (rw - 0.16) / 2, eh = 0.98;
  EFF.forEach(([a, b], i) => {
    const x = rx + (i % 2) * (ew + 0.16), y = dy + 1.74 + Math.floor(i / 2) * (eh + 0.14);
    K.card(s, { x, y, w: ew, h: eh, name: `ef${i}` });
    s.addText([{ text: a, options: { bold: true, color: C.dark, fontSize: 15, breakLine: true } }, { text: b, options: { color: C.inkSoft, fontSize: 12 } }], { x: x + 0.18, y, w: ew - 0.36, h: eh, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `ef${i}_t` });
  });
  const ty = dy + dh + 0.20;
  K.card(s, { x: M, y: ty, w: dw, h: 0.78, fill: 'FFFFFF', line: C.alert, lineWidth: 1.6, name: 'thin' });
  s.addText([{ text: 'A thinning, not a hole. ', options: { bold: true, color: C.alert } }, { text: 'Nothing is missing. The layer gets very thin over Antarctica each spring.', options: { color: C.ink } }], { x: M + 0.20, y: ty, w: dw - 0.40, h: 0.78, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'thin_t' });
  K.sentence(s, [['The ozone layer is ', false], ['high up', true], [' and it ', false], ['protects', true], [' us. Ozone at ground level is a pollutant.', false]], { y: ty + 0.92, h: 0.54, size: 15.5, name: 'oz_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the diagram, the one-line job, the four effects, then the thinning and the banner.\n\n'
    + 'OBJECTIVE 1. WHAT THE OZONE LAYER DOES. THE DIAGRAM: the lowest 50 km of the air. Weather, clouds, aeroplanes and air pollution are all in the lowest layer (the troposphere, up to about 12 km). Above it is the stratosphere, and in it, roughly 15 to 35 km up, is the OZONE LAYER: ozone (O₃) is a rare gas there, a few parts in ten million, but it is enough: it absorbs all of the Sun\'s UV-C and most of its UV-B (the most harmful kinds) before they reach the ground. Most UV-A, the least harmful kind, gets through. It is roughly 15 to 35 km up (the sources differ a little at the edges). If all of it were squashed to ground-level pressure it would be a layer only about 3 mm thick. Say "it is a layer even though it is a trace gas, because it is concentrated in one band". IT IS THE REASON OZONE HIGH UP IS PROTECTION AND OZONE AT GROUND LEVEL IS A POLLUTANT: same substance, opposite verdict, purely because of where it is (Lesson 1). Say it again.\n\n'
    + 'ASK BEFORE YOU CLICK THE EFFECTS: "what would happen if more UV got through? to people? to plants? to the sea?" Take answers. They will say skin cancer. FEW WILL SAY PLANKTON, and that is the one worth waiting for: UV-B penetrates the top metres of the ocean and damages the tiny plants and animals (plankton) that are the base of the ocean food chain, and they also take in carbon dioxide and make oxygen. THE FOUR: skin cancer and burns; cataracts (clouding of the eye lens); damaged crops (smaller harvests); damaged plankton.\n\n'
    + 'THE TWO CORRECTIONS, if not already made: IT IS A THINNING, NOT A HOLE (the layer over Antarctica falls to less than half its normal thickness each spring, and recovers); and IT IS NOT THE GREENHOUSE EFFECT. Do not take the second further yet: it is the We Do.',
  );
}

/* ================================================================== *
 * 5. I DO · 3: how CFCs damaged it, and what was done (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'How CFCs damaged it, and what was done');
  const vw = 5.60, vh = vw * 9 / 16, vy = 1.82;
  K.card(s, { x: M - 0.06, y: vy - 0.06, w: vw + 0.12, h: vh + 0.12, name: 'vid_bg' });
  K.video(s, 'atm-ozone-hole', M, vy, vw, vh, 'vid_hole');   // underneath: it is uncovered when the CFC film exits
  K.video(s, 'atm-cfc', M, vy, vw, vh, 'vid_cfc');
  const rx = M + vw + 0.30, rw = RIGHT - rx;
  K.card(s, { x: rx, y: vy, w: rw, h: 1.52, name: 'how' });
  s.addText([
    { text: 'HOW', options: { bold: true, color: C.accentInk, fontSize: 12, breakLine: true } },
    { text: 'CFCs rise. Ultraviolet light breaks them apart and releases chlorine. One chlorine atom destroys thousands of ozone molecules, and is not used up.', options: { color: C.ink, fontSize: 13.5 } },
  ], { x: rx + 0.22, y: vy, w: rw - 0.44, h: 1.52, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 17.5, objectName: 'how_t' });
  const TL = [['1985', 'British scientists report the Antarctic ozone loss.'], ['1987', 'The Montreal Protocol is signed.'], ['1996', 'CFCs are banned in rich countries.'], ['Now', 'Every country has joined. The layer is recovering.']];
  const th = 0.66, tg = 0.10, ty0 = vy + 1.66;
  TL.forEach(([yr, text], i) => {
    const y = ty0 + i * (th + tg);
    K.card(s, { x: rx, y, w: rw, h: th, fill: ANS, line: C.support, lineWidth: 1.5, name: `tl${i}` });
    s.addText(yr, { x: rx + 0.14, y, w: 0.96, h: th, color: C.support, fontFace: F.title, fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `tl${i}_y` });
    s.addText(text, { x: rx + 1.12, y, w: rw - 1.26, h: th, color: C.ink, fontFace: F.body, fontSize: 13, valign: 'middle', margin: 0, lineSpacing: 16, objectName: `tl${i}_t` });
  });
  const by = vy + vh + 0.40;
  K.card(s, { x: M, y: by, w: vw, h: 0.90, name: 'why' });
  s.addText([{ text: 'It worked because ', options: { bold: true, color: C.dark } }, { text: 'the science was clear enough to act, industry had replacements, and the risk felt real: skin cancer, and a hole you could see from space.', options: { color: C.ink } }], { x: M + 0.20, y: by, w: vw - 0.40, h: 0.90, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'why_t' });
  K.sentence(s, [['CFCs are ', false], ['banned', true], [', and the ozone layer is ', false], ['recovering', true], ['.', false]], { y: ty0 + 4 * (th + tg) + 0.10, h: 0.56, size: 16, name: 'rec_banner' });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: the CFC animation plays (ON CLICK, so say the idea first), the "how" card, the four-step timeline, the data animation, the "it worked because" card, then the banner. THE TWO FILMS ARE STACKED IN THE SAME PLACE: the CFC film is on top, and on the fourth click it fades out and the data film (underneath) plays.\n\n'
    + 'OBJECTIVE 2. HOW CFCs DAMAGED IT (the first animation, about 30 seconds; it PAUSES at five steps; talk over the pauses): (1) CFCs are harmless at ground level, and drift up; (2) HIGH UP, ultraviolet light breaks the molecule apart and a CHLORINE ATOM breaks off; (3) the chlorine atom takes an oxygen atom from an ozone molecule, so ozone becomes ordinary oxygen; (4) the chlorine atom is free again; (5) so ONE CHLORINE ATOM DESTROYS THOUSANDS OF OZONE MOLECULES, over and over, and is not used up. THAT IS THE WHOLE MECHANISM AND IT IS ENOUGH: NO FREE RADICALS, NO EQUATIONS (they are A-level). SOURCES DIFFER ON THE NUMBER: NASA Ozone Watch and the WMO say "thousands" (the WMO says "many thousands"); NASA\'s 2013 poster, UNEP and the EPA say about, up to or over 100,000. "Thousands" is safe and true.\n\n'
    + 'OBJECTIVE 3, THE REASON THIS LESSON MATTERS: THE TIMELINE. 1985 (16 May): scientists of the British Antarctic Survey (Farman, Gardiner and Shanklin) report in Nature that the springtime ozone over Halley station in Antarctica has fallen sharply: by 1984 it was about two thirds as thick as in earlier decades. (Mario Molina and Sherwood Rowland had warned in 1974 that CFCs would destroy ozone, and won the 1995 Nobel Prize in Chemistry with Paul Crutzen.) 1987: the MONTREAL PROTOCOL is signed. 1996: CFC production ends in the rich countries (the developing countries followed by 2010). 2009: the Montreal Protocol became the first environmental agreement to be ratified by every country (198 parties now). NOW: CFCs are phased out (over 99% of the controlled substances), and the layer is slowly recovering. NOTE: CFCs last 50 to 100 years in the air, so the chlorine in the stratosphere is only about 11% below its peak: recovery takes decades. THE SECOND FILM IS THE STORY IN HALF A MINUTE, the real NASA satellite record (NASA Scientific Visualization Studio, public domain): the Antarctic ozone on the day each year when the hole was largest, 1979 to 2025, with a growing chart of its area. It grows from the 1980s to about 2000, then it stops growing and varies from year to year with the weather in the stratosphere. SAY WHAT THE DATA SHOW, NOT MORE: it has stopped getting bigger, and the trend in the season averages since 2000 is too small to tell from the year-to-year changes (2002 and 2019 were small because of unusual warm weather high up; 2020 to 2023 were large and long-lasting). The signal of recovery is clearest in September. NASA says the layer "appears to be slowly recovering and is on track to rebound by later this century"; the WMO and UN assessment of 2022 projects Antarctic ozone back to 1980 levels around 2066, the Arctic around 2045 and the near-global average around 2040. (The 2026 hole is running larger than recent years, so far: a provisional 24.9 million km² average to 15 October. The next WMO and UN assessment is due at the end of 2026, and the dates may change.)\n\n'
    + 'THE TRANSFERABLE POINT, which is also the plenary: it WORKED because (1) THE SCIENCE WAS CLEAR ENOUGH TO ACT (the 1985 discovery and 1986 satellite maps were in hand at the signing; the aircraft evidence that tied chlorine to the ozone loss came in 1988 and 1989; the treaty was built to tighten as the evidence grew), (2) INDUSTRY HAD REPLACEMENTS IT COULD ACTUALLY USE (for household fridges: HFC-134a, then isobutane; for aerosols: propane and butane), and (3) THE RISK FELT PERSONAL: skin cancer, and a hole you could see on a satellite map (do NOT say "the damage was visible": the risks were not easily observable and the hole itself was only visible in satellite data). The richer countries also paid to help the poorer ones (the Multilateral Fund), and trade rules pushed everyone to join. Say that "next lesson has the first of those and not the others". That comparison is the framing for Lesson 4, not despair.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: B. Ultraviolet light high up breaks the CFC apart and releases chlorine.',
  );
}

/* ================================================================== *
 * 6. WE DO · 5: spot the mistake
 * ================================================================== */
K.weDoSTM({
  subtitle: 'Right or wrong? Hands up for your answer before each one is revealed.',
  rows: [
    ['“The hole in the ozone layer lets the Sun’s heat in.”', 'WRONG', 'It lets more ultraviolet light in, not more heat. Heat trapped by gases is climate change, which is next lesson.'],
    ['“CFCs damage the ozone layer because they are poisonous at ground level.”', 'WRONG', 'They are harmless at ground level. High up, ultraviolet light breaks them apart and releases chlorine.'],
    ['“The ozone layer gets very thin over Antarctica each spring.”', 'RIGHT', 'It does. The layer is thinner each spring and then recovers a little, and nothing is missing.'],
    ['“The ozone hole is a place where there is no ozone at all.”', 'WRONG', 'It is a thinning, not a hole. The layer is much thinner there, but some ozone is always left.'],
  ],
  notes:
    'WE DO. 5 minutes. Four clicks, one row each. THE MODE IS "SPOT THE MISTAKE" (TEMPLATE.md): the last We Do was Rank And Conquer, so rotate. Four statements, each with its correction. ONE OF THE FOUR IS ALREADY CORRECT (row 3), SO THE TASK IS "CHECK THIS", NOT "FIND A FLAW": a student who says "this one is fine" has done better work than one who invents an error. THEY COMMIT BEFORE EACH REVEAL: show of hands for right or wrong, then click.\n\n'
    + 'ASK WHAT THE STUDENT DID, NOT WHAT THE RIGHT ANSWER IS (TEMPLATE.md): "what has the person who said that confused?" Naming the error is what stops it being repeated.\n\n'
    + 'ROW 1 IS THE UNIT\'S MISCONCEPTION: THE OZONE HOLE LETS THE HEAT IN. The mix-up is natural: both are about the atmosphere and both are blamed on pollution. Ask "what comes through the thin ozone: heat or ultraviolet light?" Then draw the three-way table on the board (ozone depletion, climate change, air pollution: gas, where, harm): you will use it all of next lesson. ROW 2 is the hook\'s answer in a wrong costume ("poisonous"). ROW 3 IS CORRECT: do not rush it. ROW 4 is the "hole": a thinning, not a hole; the layer over Antarctica falls to less than half its normal thickness, but is never zero.\n\n'
    + 'IF SHORT OF TIME, cut row 4.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Describe what the ozone layer does.', 'It absorbs the most harmful ultraviolet light before it reaches the ground.'],
    ['Name two harms caused by more ultraviolet light.', 'Any two of: skin cancer, cataracts, damaged crops, damaged plankton.'],
    ['Explain why CFCs were not noticed as a danger for years.', 'They were harmless at ground level. They did damage only high up, in the stratosphere.'],
    ['State what was done about CFCs.', 'The Montreal Protocol (1987): countries agreed to phase them out, and every country has now joined.'],
    ['Explain why ozone near the ground is a pollutant but the ozone layer is not.', 'Near the ground it irritates lungs. High up it absorbs ultraviolet light.'],
    ['Name the two acids in acid rain.', 'Sulfuric acid and nitric acid.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, THEN ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (Lesson 1: ozone near the ground against the ozone layer: it is the unit\'s sentence, third time) and Q6 (Lesson 2: the two acids). Q1 is OBJECTIVE 1. Q2 wants TWO different harms. Q3 is OBJECTIVE 2 AND IT IS THE HARDEST: the answer is "harmless where we were, harmful where we were not". Q4 is OBJECTIVE 3. IF THE ROOM IS RIGHT BY Q4, ask "why did every country join?" (the science was clear enough to act, there were replacements, and the risk felt real: say it, then hold the thought for the plenary).\n\n'
    + 'IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Layer and harm', 'Say what the ozone layer does, name the harms of more UV, and put the CFC story in order. Read the worked example first.'],
    ['SILVER', 'How CFCs do it', 'Explain how CFCs damage ozone, spot what the Montreal Protocol did, and say why the ozone layer is not the greenhouse effect.'],
    ['GOLD', 'Read the record', 'Use the real data on the size of the Antarctic ozone hole, and explain why the Montreal Protocol worked.'],
  ],
  note: 'Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions are mixed on purpose.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note.\n\n'
    + 'THE WORKSHEET IS THE TASK. THREE TIERS, THEY CHOOSE (TEMPLATE.md). BRONZE: a worked example of what the layer does, a half-worked one, the four harms, and the CFC story in order (Q4). SILVER: how CFCs damage ozone (the "why does that step work?" prompt, Q7: why is it harmless at ground level but harmful up high?), what the Montreal Protocol did, and why this is not the greenhouse effect. GOLD: reading the real NASA data (a table of the size of the Antarctic ozone hole in selected years), a calculation (Q11), a description of the trend (Q12), why the Montreal Protocol worked (Q13) and "where would you meet this outside the lesson?" (Q14). AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student. THE QUESTIONS ARE MIXED ON PURPOSE (interleaved), and the sheet says so.\n\n'
    + 'THE WORST MISTAKES: "the hole lets heat in" (Silver Q9 asks it directly); "CFCs are poisonous"; "the ozone hole is a hole"; and in Gold Q11, subtracting the wrong way round, or describing the data as "it keeps shrinking" when it does not (it levelled off and now varies). THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page. AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'The ozone layer is high up in the stratosphere. It absorbs the most harmful ultraviolet light from the Sun.',
    'More ultraviolet light means more skin cancer, cataracts, damaged crops and damaged plankton.',
    'CFCs are harmless near the ground. High up, ultraviolet light breaks them apart and the chlorine destroys thousands of ozone molecules each.',
    'The Montreal Protocol (1987) phased CFCs out and the ozone layer is recovering. It is a thinning, not a hole, and it is not the greenhouse effect.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do. The answers are printed UPSIDE DOWN at the foot of the last worksheet page.\n\n'
    + 'WALK ROUND for three mistakes: the ozone hole described as letting heat in; "CFCs are poisonous"; and, in Gold Q11, the data subtracted the wrong way round. Tell them to write the correct answer next to anything wrong and not rub it out.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['The ozone layer absorbs the most harmful ultraviolet light from the Sun.', 'TRUE'],
    ['The hole in the ozone layer is the cause of global warming.', 'FALSE'],
    ['CFCs are poisonous gases that harm people at ground level.', 'FALSE'],
    ['The ozone layer is recovering, because CFCs were phased out.', 'TRUE'],
    ['A new gas is found to destroy ozone. The Montreal Protocol shows what to do: agree a ban, and have a replacement ready.', 'TRUE'],
  ],
  closing: 'Next: climate change. Same sky, a different problem, and a different gas.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line. EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: the unit\'s misconception, "the ozone hole causes global warming": ozone depletion lets in more ultraviolet light, and climate change is heat trapped by greenhouse gases (next lesson). Q3: CFCs are harmless at ground level, which is why nobody worried. Q1 and Q4 are plainly TRUE (objectives 1 and 3). Q5 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): take what worked in the Montreal Protocol (agreement, a ban with dates, a replacement ready) and apply it. Ask "and what else did it need?" (the science had to be clear).\n\n'
    + 'THE POINT TO LEAVE THEM WITH, the one the unit plan asks for: IT IS THE ONLY UNAMBIGUOUS SUCCESS IN FOUR UNITS OF HUMAN IMPACT, AND THE CLASS SHOULD LEAVE KNOWING IT. It worked because the science was clear enough to act, there were replacements industry could use, and the risk felt personal (skin cancer, and a hole you could see on a satellite map). Climate change has the first condition and not yet the others, and "what is different about climate change?" is a far better frame for Lesson 4 than despair.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY, if you have not: B. THE CLOSING LINE POINTS FORWARD: climate change, the gas is carbon dioxide (not CFCs), and the part of the atmosphere is all of it.',
});

K.write().catch((e) => { console.error(e); process.exit(1); });

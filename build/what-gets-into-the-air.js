/**
 * Y9 Science, Atmosphere, Lesson 1: What Gets Into The Air. Class Y9 (9G and 9I, one deck). Single, 50 minutes. Upper Air palette (new for the unit).
 *
 * PREVIOUS: Pollution Pandemic (Water, Lesson 4; reference/Pollution Pandemic.pptx), read in full: its Do Now (a share of a total, point sources, rain and shortage,
 * usable fresh water, respiration, fertiliser and fish), its We Do (Rank And Conquer), its two I Do slides (the eutrophication chain and disease; treat it at the
 * pipe, stop it where it starts) and its plenary, which closed the Water unit on the good news that the Thames recovered. THE UNIT 4 DECKS (What The Earth Gives Us,
 * Resource Depletion, Making It Last) were read too: coal, oil and gas appear only as examples of non-renewable resources ("millions of years"), and burning is
 * not taught. There is NO dedicated fossil-fuels deck in reference/, so today does not assume combustion beyond "burning fuel", and it picks up at the exhaust pipe.
 * HPG (Human Population Growth) said only: "Burning fuel for energy changes the atmosphere for every ecosystem at once."
 *
 * THE LAST THREE Y9 DO NOWS (Pollution Pandemic, What The Earth Gives Us, Resource Depletion) were read: nothing here repeats.
 * WE DO: FINISH IT OFF (Pollution Pandemic's was Rank And Conquer). Numbers are checked in build/atmosphere-check.py.
 */
const K = require('./atmosphere-kit')({ lesson: 'What Gets Into The Air', subject: 'Y9 Science · Atmosphere · Lesson 1 · 9G and 9I' });
const DATA = require('./atmosphere.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H, LINE, ANS } = K;
const D1 = DATA.l1;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    [`A grass strip catches ${D1.strip.pct}% of the ${D1.strip.runoff} kg of fertiliser that runs off a field. Calculate how much it catches.`, `${D1.strip.runoff} × ${D1.strip.pct} ÷ 100 = ${D1.strip.caught} kg`],
    ['Explain why treating sewage at a works does not stop all water pollution.', 'Farms, roads and gardens add pollution from many places, and a works treats only what comes through its pipe.'],
    ['Explain how a renewable resource, such as fish, can still run out.', 'If it is used faster than it replaces itself, for long enough, too few are left to recover.'],
    ['A lake gains 12 million litres a year from rain and rivers. People take out 15 million litres a year. State what happens to the lake.', '12 − 15 = −3 million litres a year, so the lake shrinks'],
    ['Name the gas that makes up most of the air.', 'Nitrogen, about 78% of the air.'],
    ['Suggest how a gas can pollute the air even though no chimney or exhaust releases it.', 'Sunlight can make it in the air from other gases. Ozone near the ground is made from nitrogen oxides and VOCs.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ Pollution Pandemic (the previous lesson, the last of the Water unit) and the three Unit 4 decks, and checked every question against the last three Do Nows in the year group (Pollution Pandemic, What The Earth Gives Us, Resource Depletion). Nothing repeats. THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (Pollution Pandemic: a share of a total with new numbers, and why a works does not stop nonpoint pollution). Q3 and Q4 are EARLIER (Resource Depletion: a renewable resource can still run out; Water: a store that loses more than it gains). Q5 is another science (the air: it is also the sentence that makes nitrogen oxides make sense later: the nitrogen in a hot engine comes from the air). Q6 IS THE PREVIEW: NOT RETRIEVAL. ITS CARD IS SHADED so the room can see the answer is new. They have not been taught it, so they SUGGEST. Take two or three ideas, write them on the board, then click, and say "that is objective 2 today".\n\n'
    + `Q1: ${D1.strip.runoff} × ${D1.strip.pct} ÷ 100 = ${D1.strip.caught} kg (watch for 40 kg, from dividing by 100 and stopping: 250 × 0.4 = 100). Q2: the point-versus-nonpoint idea from last lesson. Q3: faster than it replaces itself, for long enough. Q4: 12 − 15 = −3: the lake loses 3 million litres a year, so it shrinks. Q5: nitrogen, about 78%; oxygen is about 21%. Q6: sunlight makes ozone from other gases: accept any idea that a pollutant can be made in the air rather than released (a student may say "it comes from a car, but not out of the pipe": that is a good start).\n\n`
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Name the main air pollutants and say where each comes from.', 'Explain the difference between a primary and a secondary pollutant.', 'Explain how smog forms.'],
  banner: [['Air pollution is harmful gas or dust in the air. Some is released ', false], ['as itself', true], [', and some is ', false], ['made in the air', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'THE UNIT. Four lessons and an assessment on what people do to the atmosphere. Today: what gets into the air. Next: what it does to us. Then the ozone layer. Then a warming planet. SAY WHAT THE UNIT IS FOR: "three different problems in the sky, and most people think they are one problem. By the end you will be able to tell them apart, and you will sort them in a game." Do not say more yet.\n\n'
    + 'TWO NEW WORDS TODAY: AIR POLLUTION and SMOG. Smog is smoke and fog, and now any thick haze of air pollution over a city. The banner is the whole lesson in one sentence: read it and move on.\n\n'
    + 'THE PARTICULATE TRAPS GO OUT TODAY (two minutes, see the You Do notes). Six slides smeared with petroleum jelly, put in six places, and read in Lesson 2. Tell them now so they start predicting.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'From 5 to 9 December 1952 a thick smog covered London. About how many people died because of it, in the days and weeks that followed?',
  qSize: 21,
  opts: ['About 40.', 'About 400.', 'About 4,000.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'THERE IS NO PHOTOGRAPH ON THIS SLIDE: no photograph of the 1952 smog could be found under a free licence, and a drawing would only decorate it. If you have one, put it on the slide before the lesson. Say how thick it was: in places the visibility fell to a few metres, and some buses were led through the streets by someone walking in front with a torch. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the second I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: C. The smog lasted from Friday 5 to Tuesday 9 December 1952. A government committee counted between 3,500 and 4,000 more deaths than normal in the two weeks to 20 December, with about 4,000 the best estimate (the Met Office says "about 4,000 people were known to have died"). A later study of December 1952 to February 1953 estimated about 12,000 excess deaths. SAY WHICH IS WHICH if a student asks, and DO NOT SAY "4,000 in four days": that is a common mistake. The smog lasted about four days, but the 4,000 is counted over two weeks.\n\n'
    + 'EXPECT most votes for B. A is the "fog cannot kill" idea. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down". The gap is "what was in the fog?", and I Do 2 answers it.',
});

/* ================================================================== *
 * 4. I DO · 3: the pollutants and where they come from (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'What gets into the air');
  const ROWS = [
    ['Carbon monoxide', 'CO', 'Fuel burns with too little oxygen: car engines, coal fires, faulty boilers.'],
    ['Sulfur dioxide', 'SO₂', 'Coal and oil that contain sulfur are burned: power stations, ships, factories.'],
    ['Nitrogen oxides', 'NOx', 'Very hot flames: the nitrogen and oxygen of the air react in engines and furnaces.'],
    ['Particulates', 'PM', 'Soot, dust and smoke: diesel engines, fires, building sites.'],
    ['VOCs', 'VOC', 'Volatile organic compounds: gases that evaporate from fuels, paint and solvents.'],
  ];
  const y0 = 1.80, rh = 0.66, gap = 0.08, ps = 1.45, pg = 0.16, lw = CW - 2 * ps - pg - 0.26;
  ROWS.forEach(([name, formula, where], i) => {
    const y = y0 + i * (rh + gap);
    K.card(s, { x: M, y, w: lw, h: rh, name: `pr${i}` });
    s.addText(formula, { x: M + 0.14, y: y + 0.10, w: 0.86, h: rh - 0.20, shape: S.roundRect, rectRadius: 0.08, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, color: C.dark, fontFace: F.title, fontSize: formula.length > 2 ? 13 : 15, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `pr${i}_f` });
    s.addText([{ text: name, options: { bold: true, color: C.dark, fontSize: 15.5, breakLine: true } }, { text: where, options: { color: C.ink, fontSize: 12.5 } }], { x: M + 1.14, y, w: lw - 1.28, h: rh, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 15.5, objectName: `pr${i}_t` });
  });
  // the four sources, as photographs
  const PH = [['atm_exhaust', 'Vehicle exhaust'], ['atm_powerstation', 'Power station'], ['atm_soot', 'Smoke and soot'], ['atm_solvent', 'Paint and solvents']];
  const px = M + lw + 0.26, py = y0;
  PH.forEach(([key, cap], i) => {
    const x = px + (i % 2) * (ps + pg), y = py + Math.floor(i / 2) * (ps + 0.40 + 0.06);
    K.pic(s, key, x, y, ps, ps, `ph${i}`);
    s.addText(cap, { x, y: y + ps + 0.02, w: ps, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `ph${i}_c` });
  });
  const ey = y0 + 5 * (rh + gap) + 0.06;
  K.card(s, { x: M, y: ey, w: CW, h: 0.62, fill: ANS, line: C.accentInk, name: 'wk' });
  s.addText([{ text: 'WORKED EXAMPLE  ', options: { bold: true, color: C.accentInk } }, { text: 'A coal power station. The coal contains sulfur, so burning it makes sulfur dioxide. Coal also leaves ash and soot, so particulates leave the chimney too.', options: { color: C.ink } }], { x: M + 0.24, y: ey, w: CW - 0.48, h: 0.62, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: 'wk_t' });
  K.sentence(s, [['Not all of it is us', true], [': volcanoes, wildfires and dust storms put the same substances into the air.', false]], { y: ey + 0.74, h: 0.56, size: 15, name: 'nat_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the first three pollutants, the last two and the photographs, the worked example, then the banner.\n\n'
    + 'OBJECTIVE 1. THE FIVE POLLUTANTS WORTH NAMING, EACH WITH ITS SOURCE, and the worked example shows the reasoning: SOURCE, THEN POLLUTANT (what is in the fuel or the flame decides what comes out). Say each name AND its source together.\n\n'
    + '(1) CARBON MONOXIDE, CO: made when a fuel burns with TOO LITTLE OXYGEN ("incomplete combustion"): a petrol engine, a coal fire, a faulty gas boiler. It has no colour and no smell. It matters in Lesson 2. (2) SULFUR DIOXIDE, SO₂: coal and oil contain a little sulfur; burning it makes SO₂. Power stations, ships and factories burning coal or heavy oil are the big sources; volcanoes too. It is the cause of acid rain (Lesson 2). (3) NITROGEN OXIDES, written NOx: NOT from the fuel mostly (coal is the exception, where fuel nitrogen matters). In a very hot flame (an engine, a furnace) the NITROGEN AND OXYGEN IN THE AIR react. That is why the Do Now asked what the air is made of. (4) PARTICULATES: tiny bits of soot, dust and smoke; diesel engines, fires, building sites. Lesson 2 gives their sizes. (5) VOCs, volatile organic compounds: carbon compounds that EVAPORATE easily: solvents (in paints, cleaning products and sprays) are the biggest UK source, about a quarter of the UK\'s VOC emissions, and unburnt fuel from vehicles is now a small share (about 4%, down from a third in 1990 because of catalytic converters).\n\n'
    + 'THE WORKED EXAMPLE AND THE BANNER. The example is the method: a coal power station. The coal has sulfur in it, so SO₂; coal leaves ash and soot, so particulates. Then "NOT ALL OF IT IS US": volcanoes, wildfires and dust storms put the same sort of substances into the air. Say it in one sentence and do not dwell: the lesson is about what people add, and a student who says "so it is natural, so it does not matter" should hear "natural or not, the lungs react the same; it is the amount that people add that has changed".\n\n'
    + 'LANGUAGE TO WATCH: "NOx" is said "en-oh-ex" or "nitrogen oxides". "Particulates" and "particulate matter" are the same thing. Do NOT put carbon dioxide on this list: it is not an air pollutant in the sense of this lesson (it does not harm lungs at normal levels), and it is the gas that matters in Lesson 4. If a student asks, say "carbon dioxide is next time, and it is a different problem".\n\n'
    + 'PHOTOGRAPHS: vehicle exhaust, a coal-fired power station, black smoke, and a painter spraying (VOCs).',
  );
}

/* ================================================================== *
 * 5. I DO · 3: primary, secondary and smog (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Primary, secondary and smog');
  const vw = 6.30, vh = vw * 9 / 16, vy = 1.84;
  K.card(s, { x: M - 0.06, y: vy - 0.06, w: vw + 0.12, h: vh + 0.12, name: 'vid_bg' });
  K.video(s, 'atm-smog', M, vy, vw, vh, 'vid_smog');
  const rx = M + vw + 0.30, rw = RIGHT - rx;
  K.card(s, { x: rx, y: vy, w: rw, h: 1.50, fill: 'FFFFFF', line: C.accentInk, lineWidth: 1.8, name: 'prim' });
  s.addText([{ text: 'PRIMARY pollutant', options: { bold: true, color: C.accentInk, fontSize: 14, breakLine: true } }, { text: 'Released as itself.', options: { bold: true, color: C.dark, fontSize: 16, breakLine: true } }, { text: 'Carbon monoxide from an exhaust.', options: { color: C.ink, fontSize: 13.5 } }], { x: rx + 0.22, y: vy, w: rw - 0.44, h: 1.50, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'prim_t' });
  K.card(s, { x: rx, y: vy + 1.64, w: rw, h: 1.78, fill: ANS, line: C.alert, lineWidth: 1.8, name: 'sec' });
  s.addText([{ text: 'SECONDARY pollutant', options: { bold: true, color: C.alert, fontSize: 14, breakLine: true } }, { text: 'Made in the air from other pollutants.', options: { bold: true, color: C.dark, fontSize: 16, breakLine: true } }, { text: 'Ozone in smog. Ozone high up protects us. Ozone at ground level is a pollutant.', options: { color: C.ink, fontSize: 13.5 } }], { x: rx + 0.22, y: vy + 1.64, w: rw - 0.44, h: 1.78, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'sec_t' });
  const sy = vy + vh + 0.28, sw = (CW - 0.30) / 2;
  K.card(s, { x: M, y: sy, w: sw, h: 1.06, name: 'lon' });
  s.addText([{ text: 'London, 1952: ', options: { bold: true, color: C.dark } }, { text: 'coal smoke and sulfur dioxide trapped under cold, still air.', options: { color: C.ink } }], { x: M + 0.22, y: sy, w: sw - 0.44, h: 1.06, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'lon_t' });
  K.card(s, { x: M + sw + 0.30, y: sy, w: sw, h: 1.06, name: 'la' });
  s.addText([{ text: 'Los Angeles: ', options: { bold: true, color: C.dark } }, { text: 'sunlight makes ozone from nitrogen oxides and VOCs.', options: { color: C.ink } }], { x: M + sw + 0.52, y: sy, w: sw - 0.44, h: 1.06, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 18, objectName: 'la_t' });
  K.sentence(s, [['Smog forms when pollution ', false], ['builds up', true], [' near the ground, or when ', false], ['sunlight', true], [' turns it into new pollutants.', false]], { y: sy + 1.20, h: 0.58, size: 16, name: 'smog_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the two definitions, the animation (ON CLICK, so say the idea first), the two kinds of smog, then the banner.\n\n'
    + 'OBJECTIVES 2 AND 3. FIRST THE TWO WORDS. A PRIMARY pollutant is released as itself: it leaves the chimney or the exhaust as the pollutant (carbon monoxide, sulfur dioxide, soot). A SECONDARY pollutant is MADE IN THE AIR out of something else. Ask "can you think of one that nobody releases?" and let them guess before the animation.\n\n'
    + 'THE ANIMATION (about 24 seconds, it PAUSES at four steps; talk over the pauses; click it again to replay): (1) cars release nitrogen oxides (orange NOx) and VOCs (purple); (2) sunlight shines on the gases; (3) they react and make OZONE, O₃ (three joined circles), and a haze forms; (4) THE POINT: ozone is made in the air, it does not come out of the exhaust. This is PHOTOCHEMICAL smog. It is worst on a hot, still, sunny afternoon in a city full of traffic: heat and sunlight drive the reactions, and still air means nothing blows the pollution away.\n\n'
    + 'SAY THIS OUT LOUD AND AGAIN IN LESSON 3: OZONE HIGH UP IS PROTECTION. OZONE AT GROUND LEVEL IS A POLLUTANT. The same substance, opposite verdict, purely because of where it is. If a student says "I thought ozone was good", say "yes, high up, and we meet that in Lesson 3".\n\n'
    + 'THE TWO SMOGS (objective 3: explain how smog forms): LONDON 1952 is the first kind. Coal fires and factories put smoke, soot and sulfur dioxide into the air. A cold, still anticyclone (high pressure) pushed air down and made a temperature inversion: a layer of warm air lay over the cold air at the ground, so the smoke from coal fires, which Londoners were burning in large quantities to keep warm, could not rise away. The Met Office calculates that every day the smog contained about 1,000 tonnes of smoke particles, and that 370 tonnes of sulfur dioxide were turned into 800 tonnes of sulfuric acid. Everyone breathed it. LOS ANGELES is the second kind: not coal smoke, but traffic exhaust plus sunlight, which makes secondary pollutants. TWO DIFFERENT MECHANISMS: one is pollution trapped, the other is pollution turned into something new. Both smogs are better examples than any single city because they show it.\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: C, about 4,000 in the days and weeks that followed (the official estimate; a later study put it at about 12,000 from December to February). The Clean Air Act 1956 came four years after, which is Lesson 2.',
  );
}

/* ================================================================== *
 * 6. WE DO · 5: finish it off
 * ================================================================== */
K.weDoFIO({
  heading: 'Finish this',
  subtitle: 'Fill in the blanks. Say each one out loud, and say why.',
  rowH: 1.40,
  rows: [
    ['A coal power station burns coal that contains sulfur.', 'It releases ____ . That is a ____ pollutant, because it leaves the chimney as itself.', ['sulfur dioxide', 'primary']],
    ['A hot, sunny afternoon in a city full of traffic.', 'The cars release nitrogen oxides and ____ . Sunlight makes them react to form ____ , a ____ pollutant.', ['VOCs', 'ozone', 'secondary']],
    ['Why is smog worst on a hot, still, sunny day?', 'Sunlight drives the ____ . Still air means the pollution is not ____ away.', ['reactions', 'blown']],
  ],
  notes:
    'WE DO. 5 minutes. Three clicks, one row each. THE MODE IS "FINISH IT OFF" (TEMPLATE.md): the last We Do in the year group was Pollution Pandemic\'s Rank And Conquer, so rotate. Three partly worked answers in the pattern the I Do showed: SOURCE, THEN POLLUTANT, THEN KIND.\n\n'
    + 'THE BLANKS ARE SHORT, SO EVERY BLANK GETS A FOLLOW-UP THAT NEEDS THINKING (TEMPLATE.md). Students commit by saying the answer out loud (no whiteboards) BEFORE you click.\n\n'
    + 'ROW 1. "Sulfur dioxide": ask "WHERE DID THE SULFUR COME FROM?" (it was in the coal; burning joins it to oxygen). "Primary": ask "WHAT WOULD MAKE IT SECONDARY?" (if it were made in the air from other pollutants instead of leaving the chimney as itself). ROW 2. "VOCs": ask "WHICH TWO POLLUTANTS DOES THE SUNLIGHT ACT ON?" (nitrogen oxides and VOCs). "Ozone": ask "WHY CAN\'T WE MEASURE OZONE AT THE EXHAUST PIPE?" (it has not been made yet: it forms later, in the air). "Secondary": ask "HOW DO YOU KNOW?" (made in the air, not released as itself). ROW 3. "Reactions": ask "WHAT WOULD HAPPEN ON A DULL, COLD DAY?" (fewer reactions, less ozone). "Blown": ask "WHAT WOULD A WINDY DAY DO?" (carry the pollution away, so the smog is thinner).\n\n'
    + 'IF A STUDENT SAYS "the cars release ozone": do not say "wrong". Say "show me where it comes out", and point back to the animation. THE COMMONEST ERROR is calling ozone a primary pollutant. If short of time, cut row 3.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Name three air pollutants.', 'Any three of: carbon monoxide, sulfur dioxide, nitrogen oxides, particulates, VOCs.'],
    ['State where sulfur dioxide comes from.', 'Burning coal or oil that contains sulfur, for example in power stations.'],
    ['Explain the difference between a primary and a secondary pollutant.', 'A primary pollutant is released as itself. A secondary pollutant is made in the air from other pollutants.'],
    ['Explain why ground-level ozone is not found in car exhaust.', 'It is not released. Sunlight makes it in the air from nitrogen oxides and VOCs.'],
    ['State what taking a sustainable amount of a resource means.', 'Taking no more than the resource can naturally replace.'],
    ['Describe two ways to reduce water pollution.', 'Treat sewage and waste at the pipe. Use less fertiliser, or plant strips of grass along rivers.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, THEN ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (Making It Last: sustainable amount) and Q6 (Pollution Pandemic: two fixes, one at the pipe and one where it starts). Q1 is OBJECTIVE 1, and a wrong list shows who has not learnt the five. Q2 is OBJECTIVE 1 (the source decides the pollutant). Q3 is OBJECTIVE 2 AND IT NEEDS A SENTENCE, not a word. Q4 IS OBJECTIVE 2 AND 3 TOGETHER and it is the hardest: the answer is "it is not released: it is made". IF THE ROOM IS RIGHT BY Q4, ask "so is ozone primary or secondary?" and "is that ozone the one that protects us?" (no: the one at ground level).\n\n'
    + 'IF SHORT OF TIME, cut Q5.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Sources and kinds', 'Match each pollutant to where it comes from, then sort pollutants into primary and secondary. Read the worked example first.'],
    ['SILVER', 'How smog forms', 'Explain how ozone forms in smog, work out a number about sulfur in coal, and explain why the weather matters.'],
    ['GOLD', 'Smogs and traps', 'Compare London in 1952 with Los Angeles, and predict which of the six particulate traps will be dirtiest.'],
  ],
  note: 'Choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions are mixed on purpose.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note.\n\n'
    + 'THE WORKSHEET IS THE TASK. THREE TIERS, THEY CHOOSE (TEMPLATE.md). BRONZE: a worked match of source to pollutant, a half-worked one, a full match, the primary or secondary sort, and the two kinds of smog named. SILVER: why ozone forms in smog (the "why does that step work?" prompt, Q7), a calculation (the mass of sulfur in a day\'s coal, Q8), why the weather matters and "where would you meet this outside the lesson?" (Q10). GOLD: London 1952 against Los Angeles in a table, a short explanation, and the PREDICTION for the six particulate traps. AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student. THE QUESTIONS ARE MIXED ON PURPOSE (interleaved), and the sheet says so. THE WORST MISTAKES: "ozone comes out of the exhaust" (primary and secondary swapped); "smog is only fog"; and, in Q8, taking 2% of the wrong number or forgetting to divide by 100.\n\n'
    + 'THE PARTICULATE TRAPS (TWO MINUTES, THIS IS THE PRACTICAL THAT YOU READ IN LESSON 2). PREPARE BEFORE THE LESSON: six microscope slides, each with a thin even film of petroleum jelly (a cotton bud or your finger), labelled A to F on a sticker on the BACK, and a record of which letter goes where. SUGGESTED PLACES: A beside the car park or a road; B near the kitchen or canteen extractor; C inside a classroom; D outside on a windowsill; E in a quiet corridor or the science lab; F SEALED IN A ZIP BAG, the control (it travels but is never exposed). During the You Do, send six students (one trap each) to put the slides out, jelly side up, in the six places and tape them down (a lid or a card shelter over each if rain is likely). It should take two minutes. If you would rather not send students round the school, place them yourself before the lesson and show the class the labelled slide. LEAVE THEM AT LEAST A WEEK (5 SCHOOL DAYS): a day or two gives too few specks to count. ASK EVERYONE TO PREDICT (it is Q13 on the Gold tier, and ask the room anyway): which place will be dirtiest? why? which is the control and why do we need it?\n\n'
    + 'THE WORKSHEET HAS A RAG GRID at the top: students colour the start column now and the end column at the end. Answers are printed UPSIDE DOWN on the last page. CIRCULATE WITH ONE QUESTION: "primary or secondary, and how do you know?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide. It does not get absorbed into the You Do.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'Each pollutant matched to its source: CO (burning with too little oxygen), SO₂ (coal and oil with sulfur), NOx (very hot flames), particulates (soot, dust, smoke), VOCs (fuels, paints, solvents).',
    'Primary: released as itself. Secondary: made in the air from other pollutants.',
    'Smog: pollution trapped near the ground (London 1952), or ozone made by sunlight from nitrogen oxides and VOCs (Los Angeles).',
    'Ozone at ground level is a pollutant. Ozone high up protects us.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do: marking straight after doing is a retrieval event and a feedback event at once. The answers are printed UPSIDE DOWN at the foot of the last worksheet page. The checklist is on the slide so they check the IDEAS as well as the answers.\n\n'
    + 'WALK ROUND for three mistakes: ozone put on the primary list; "smog" explained as "fog" only; and, in Q8, the percentage taken of the wrong number. Tell them to write the correct answer next to anything wrong and not rub it out.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Carbon monoxide forms when fuel burns with too little oxygen.', 'TRUE'],
    ['The ozone in smog comes out of car exhausts.', 'FALSE'],
    ['All air pollution is caused by people.', 'FALSE'],
    ['Ozone is a pollutant wherever it is found.', 'FALSE'],
    ['A hot, still, sunny afternoon in a city full of traffic is likely to have high ozone.', 'TRUE'],
  ],
  closing: 'Next: what these pollutants do to our bodies, to lakes and to buildings.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line. EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: ozone is made in the air, not released (objective 2: say "secondary"). Q3: volcanoes, wildfires and dust storms (the "Not all of it is us" line); what has changed is how much people add. Q4: the unit\'s sentence, "ozone high up is protection, ozone at ground level is a pollutant": same substance, opposite verdict. Q1 is plainly TRUE (objective 1). Q5 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): heat and sunlight drive the reactions, traffic supplies nitrogen oxides and VOCs, and still air keeps it there. Ask "which of the smogs is that?" (Los Angeles: the photochemical one).\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY, if you have not: C. THE CLOSING LINE POINTS FORWARD: next lesson gives the effects (the lungs, carbon monoxide in the blood, acid rain, the lakes from Water, the marble). And the traps: "in a week you will read the traps, and they will tell you who breathes the dirtiest air at this school".',
});

K.write().catch((e) => { console.error(e); process.exit(1); });

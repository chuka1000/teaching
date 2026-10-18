/**
 * Y9 Science, Atmosphere, Lesson 4: A Warming Planet. Class Y9 (9G and 9I, one deck). Single, 50 minutes. Upper Air palette.
 * THE LAST LESSON OF THE UNIT, AND OF THE FOUR HUMAN-IMPACT UNITS: the plenary closes the whole sequence, not just this hour, and it does not end on catastrophe.
 *
 * PREVIOUS: The Ozone Layer (Lesson 3, built in this batch: build/the-ozone-layer.js): I Do 1 what the layer does, I Do 2 how CFCs damaged it and the Montreal
 * Protocol; We Do Spot The Mistake, whose first row was "the hole lets the heat in"; plenary "it worked because the science was clear, there was a replacement and the
 * harm was visible". Its closing line promised "Next: climate change. Same sky, a different problem, and a different gas." Today keeps that promise and ends on the
 * comparison the unit plan asks for. THE UNIT PLAN'S "HOLE LETS HEAT IN" TABLE (gas, where, harm, fixed?) is on the You Do slide, where the game sorts into it.
 *
 * THE LAST THREE Y9 DO NOWS (The Ozone Layer, What It Does To Us, What Gets Into The Air) were read: nothing here repeats.
 * WE DO: RANK AND CONQUER (Lesson 3's was Spot The Mistake). The four answers are within a quarter of each other's length and the best is neither the longest nor the
 * shortest (TEMPLATE.md; the kit checks it). Numbers are checked in build/atmosphere-check.py from the real NOAA and NASA files in build/atmosphere-data/.
 */
const K = require('./atmosphere-kit')({ lesson: 'A Warming Planet', subject: 'Y9 Science · Atmosphere · Lesson 4 · 9G and 9I' });
const DATA = require('./atmosphere.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H, LINE, ANS } = K;
const D3 = DATA.l3, D4 = DATA.l4;
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Describe what the ozone layer does.', 'It absorbs most of the Sun’s ultraviolet light, so less reaches the ground.'],
    [`The mean area of the ozone hole was ${D3.area['2006']} million km² in 2006 and ${D3.area['2025']} million km² in 2025. Calculate the fall.`, `${D3.area['2006']} − ${D3.area['2025']} = ${D3.fall_2006_2025} million km²`],
    ['Explain why a taller chimney does not solve the acid rain problem.', 'It only spreads the gases further. They still make acid rain, which falls somewhere else.'],
    ['Explain why smog is worst on a hot, still, sunny day.', 'Sunlight drives the reactions that make ozone, and still air does not blow the pollution away.'],
    ['Name the gas that plants take in for photosynthesis.', 'Carbon dioxide.'],
    ['Suggest why the Earth would be a ball of ice if the air had no greenhouse gases.', 'Heat from the ground would escape into space. The average would be about −18 °C instead of about 15 °C.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ The Ozone Layer (the previous lesson, built in this batch) and checked every question against the last three Do Nows in the year group (The Ozone Layer, What It Does To Us, What Gets Into The Air). Nothing repeats. THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (what the layer does; a difference with the real NASA numbers from the worksheet table). Q3 and Q4 are EARLIER (Lesson 2: why a taller chimney does not stop acid rain; Lesson 1: why smog is worst on a hot, still, sunny day). Q5 is another science (biology: plants take in carbon dioxide, which is also why the Keeling curve zigzags). Q6 IS THE PREVIEW: NOT RETRIEVAL. ITS CARD IS SHADED so the room can see the answer is new. They have not been taught it, so they SUGGEST. Take two or three ideas, write them on the board, then click, and say "that is objective 1 today".\n\n'
    + `Q1: absorbs ultraviolet light. Q2: ${D3.area['2006']} − ${D3.area['2025']} = ${D3.fall_2006_2025} (watch for the sign: the area FELL). Q3: spreads it further, it does not remove it. Q4: sunlight drives the reactions; still air keeps the pollution there. Q5: carbon dioxide. Q6: accept any idea that heat would be lost to space; the answer is the greenhouse effect, and the numbers are about −18 °C and about 15 °C.\n\n`
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Explain the greenhouse effect.', 'Describe the evidence that the climate is changing.', 'Describe the impacts of global climate change.'],
  banner: [['The ', false], ['greenhouse effect', true], [' keeps Earth warm. We are making it ', false], ['stronger', true], [', and we can see the ', false], ['evidence', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'ONE NEW WORD: GREENHOUSE EFFECT. THE BANNER IS THE WHOLE LESSON, AND ITS TWO HALVES ARE THE POINT: the greenhouse effect is NOT the problem, and not having one would be. What has changed is the AMOUNT, so say "enhanced greenhouse effect" at least once.\n\n'
    + 'THIS IS THE LAST LESSON OF THE UNIT AND OF THE FOUR HUMAN-IMPACT UNITS: land, resources, water and the air. SAY THAT AT THE START and say that the plenary pulls them together. THE TONE: three objectives, and the third is "describe the impacts". Describe them accurately and stop: a Year 9 who leaves believing it is hopeless has learnt something false as well as something unkind. The lesson ends with the comparison with the ozone success, and with what is being done.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'Without the greenhouse effect, Earth’s average temperature would be about −18 °C. With it, it is about 15 °C. So is the greenhouse effect a problem?',
  qSize: 20,
  opts: ['Yes. It is what causes global warming, so we should get rid of it.', 'No. It keeps Earth warm. The problem is that we are adding more greenhouse gases.', 'It makes no difference to the climate. It is a different problem.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question. The two temperatures are in it, so they have the numbers. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the first I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. The greenhouse effect is natural and it is why Earth is liveable: the surface averages about 15 °C, and without it, about −18 °C. THE PROBLEM IS THE AMOUNT: people have added carbon dioxide and methane, which makes the effect stronger ("the enhanced greenhouse effect"). A is the commonest wrong answer: "greenhouse effect" and "global warming" used as if they were one thing. C is the ozone confusion from last lesson in a different costume: ozone and greenhouse gases are different problems.\n\n'
    + 'A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: the greenhouse effect (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'The greenhouse effect');
  const vw = 6.10, vh = vw * 9 / 16, vy = 1.84;
  K.card(s, { x: M - 0.06, y: vy - 0.06, w: vw + 0.12, h: vh + 0.12, name: 'vid_bg' });
  K.video(s, 'atm-greenhouse', M, vy, vw, vh, 'vid_gh');
  const rx = M + vw + 0.30, rw = RIGHT - rx, cw2 = (rw - 0.18) / 2;
  K.card(s, { x: rx, y: vy, w: cw2, h: 1.46, fill: 'FFFFFF', line: C.accentInk, lineWidth: 1.8, name: 'cold' });
  s.addText([{ text: `${D4.gh.without} °C`, options: { bold: true, color: C.accentInk, fontSize: 30, breakLine: true } }, { text: 'without the greenhouse effect', options: { color: C.ink, fontSize: 12.5 } }], { x: rx + 0.14, y: vy, w: cw2 - 0.28, h: 1.46, fontFace: F.title, align: 'center', valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'cold_t' });
  K.card(s, { x: rx + cw2 + 0.18, y: vy, w: cw2, h: 1.46, fill: ANS, line: C.alert, lineWidth: 1.8, name: 'warm' });
  s.addText([{ text: `${D4.gh.with_} °C`, options: { bold: true, color: C.alert, fontSize: 30, breakLine: true } }, { text: 'with it: the average today', options: { color: C.ink, fontSize: 12.5 } }], { x: rx + cw2 + 0.32, y: vy, w: cw2 - 0.28, h: 1.46, fontFace: F.title, align: 'center', valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'warm_t' });
  K.card(s, { x: rx, y: vy + 1.62, w: rw, h: 1.80, name: 'gases' });
  s.addText([
    { text: 'GREENHOUSE GASES', options: { bold: true, color: C.accentInk, fontSize: 12, breakLine: true } },
    { text: 'Carbon dioxide: burning fossil fuels.', options: { color: C.ink, fontSize: 14, breakLine: true } },
    { text: 'Methane: cattle, rice fields, rubbish tips.', options: { color: C.ink, fontSize: 14, breakLine: true } },
    { text: 'We have added more. That is the enhanced greenhouse effect.', options: { bold: true, color: C.dark, fontSize: 14 } },
  ], { x: rx + 0.22, y: vy + 1.62, w: rw - 0.44, h: 1.80, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 20, paraSpaceAfter: 3, objectName: 'gases_t' });
  const by = vy + vh + 0.50;
  K.card(s, { x: M, y: by, w: CW, h: 0.98, fill: ANS, line: C.accentInk, name: 'mech' });
  s.addText([{ text: 'IN: ', options: { bold: true, color: C.accentInk } }, { text: 'sunlight (short waves) passes through the air and warms the ground.   ', options: { color: C.ink } }, { text: 'OUT: ', options: { bold: true, color: C.alert } }, { text: 'the ground gives out infrared (longer waves). Greenhouse gases absorb it and send it out in all directions, some back down.', options: { color: C.ink } }], { x: M + 0.24, y: by, w: CW - 0.48, h: 0.98, fontFace: F.body, fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 19, objectName: 'mech_t' });
  K.sentence(s, [['More greenhouse gas means more infrared sent ', false], ['back down', true], [', so the Earth gets ', false], ['warmer', true], ['.', false]], { y: by + 1.12, h: 0.56, size: 16, name: 'gh_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the animation (ON CLICK, so say the idea first), the two temperatures, the gases, the one-line mechanism, then the banner.\n\n'
    + 'OBJECTIVE 1. THE GREENHOUSE EFFECT IS NOT THE PROBLEM: NOT HAVING ONE WOULD BE. START THERE. Settle the hook, pointing at the tally: B. Without it, the Earth would average about −18 °C and would be a ball of ice; with it, about 15 °C. That is a difference of 33 °C, and every living thing depends on it. WHAT HAS CHANGED IS THE AMOUNT: from the extra carbon dioxide and methane we have added. "ENHANCED GREENHOUSE EFFECT" is the honest name and it is worth using.\n\n'
    + 'THE MECHANISM, AT YEAR 9 (the animation, about 32 seconds; it PAUSES at four steps; talk over the pauses): (1) SHORT-WAVELENGTH radiation from the Sun (mostly visible light) passes through the atmosphere and warms the ground; (2) the warm ground gives out LONGER-WAVELENGTH radiation, INFRARED; (3) GREENHOUSE GASES (carbon dioxide, methane, water vapour) ABSORB the infrared and send it out again IN ALL DIRECTIONS, so some goes up to space and some goes back down to the ground; (4) MORE GAS, MORE INFRARED RETURNED, SO THE GROUND IS WARMER. IN GOES THROUGH, OUT DOES NOT. Nitrogen and oxygen, which are nearly all of the air, do not absorb infrared, so they are not greenhouse gases. THE PHYSICS IS EMISSION AND ABSORPTION OF INFRARED RADIATION: Year 10 meets it as a thermal physics topic with no mention of climate, and this is the lesson that says it.\n\n'
    + 'A NOTE FOR YOU, NOT FOR THE SLIDE: the name is an imperfect analogy. NOAA and the IPCC say a real greenhouse works mainly by stopping warm air rising and escaping (convection), while the atmosphere works by absorbing infrared; some sources, such as NASA JPL, say a greenhouse\'s glass also filters infrared, so the physics of the real thing is still argued. DO NOT RAISE IT, and do not build a slide on it. But if a sharp student pushes, say: "a real greenhouse also keeps warm air in, but the atmosphere works differently: the gases absorb heat radiation and send some back".\n\n'
    + 'WATCH FOR: "the greenhouse effect is caused by the hole in the ozone layer". It is the unit\'s misconception: say "different gases, a different part of the atmosphere, a different harm", and point at the table on the next slides.',
  );
}

/* ================================================================== *
 * 5. I DO · 3: the evidence and the impacts (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'How we know, and what it does');
  const gw = 5.70, gh = gw * 620 / 1100, gy = 1.80;
  K.card(s, { x: M - 0.06, y: gy - 0.06, w: gw + 0.12, h: gh + 0.12, name: 'gr' });
  K.pic(s, 'atm-temp', M, gy, gw, gh, 'gr_pic');
  s.addText('Global temperature compared with 1951 to 1980 (NASA)', { x: M, y: gy + gh + 0.10, w: gw, h: 0.34, color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'gr_cap' });
  const ey = gy + gh + 0.58;
  K.card(s, { x: M, y: ey, w: gw, h: 1.84, name: 'ev' });
  s.addText([
    { text: 'MORE EVIDENCE', options: { bold: true, color: C.accentInk, fontSize: 12, breakLine: true } },
    { text: `Ice cores: carbon dioxide stayed between about 170 and 300 ppm for 800,000 years. Today it is about ${Math.round(D4.co2.y2025)} ppm.`, options: { color: C.ink, fontSize: 13, breakLine: true } },
    { text: 'Arctic sea ice and glaciers are shrinking. Sea level is rising.', options: { color: C.ink, fontSize: 13 } },
  ], { x: M + 0.22, y: ey, w: gw - 0.44, h: 1.84, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 18.5, paraSpaceAfter: 4, objectName: 'ev_t' });
  const rx = M + gw + 0.34, rw = RIGHT - rx, ih = 0.86, ig = 0.10;
  s.addText('IMPACTS', { x: rx, y: gy - 0.04, w: rw, h: 0.34, color: C.accentInk, fontFace: F.title, fontSize: 13, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: 'im_h' });
  const IMP = [
    ['Sea level rise', 'Warm water expands and land ice melts. Coasts flood.', 'atm_flood'],
    ['More extreme weather', 'More heatwaves, droughts and heavy rain.', null],
    ['Species on the move', 'Towards the poles and uphill. Some have nowhere left to go.', null],
    ['Coral bleaching', 'Warm sea water makes corals lose the algae that feed them.', 'atm_coral'],
    ['Crops and water', 'Rainfall changes, so harvests and water supplies change.', null],
  ];
  IMP.forEach(([head, text, ph], i) => {
    const y = gy + 0.38 + i * (ih + ig);
    K.card(s, { x: rx, y, w: rw, h: ih, name: `im${i}` });
    if (ph) K.pic(s, ph, rx + 0.10, y + 0.09, ih - 0.18, ih - 0.18, `im${i}_pic`);
    else s.addShape(S.roundRect, { x: rx + 0.10, y: y + 0.09, w: 0.14, h: ih - 0.18, rectRadius: 0.05, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: `im${i}_pic` });
    const tx = ph ? rx + ih + 0.04 : rx + 0.40;
    s.addText([{ text: head, options: { bold: true, color: C.dark, fontSize: 14.5, breakLine: true } }, { text, options: { color: C.ink, fontSize: 12 } }], { x: tx, y, w: rx + rw - tx - 0.12, h: ih, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 15.5, objectName: `im${i}_t` });
  });
  K.sentence(s, [['Several ', false], ['independent records', true], [' show the same thing: Earth is ', false], ['warming', true], [', and the extra carbon dioxide is ours.', false]], { y: ey + 1.98, h: 0.56, size: 15, name: 'evid_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the temperature graph, the other evidence, the five impacts, then the banner.\n\n'
    + 'OBJECTIVE 2. HOW WE KNOW. THE GRAPH IS THE REAL NASA RECORD (GISTEMP), each bar one year, 1880 to 2025, compared with the 1951 to 1980 average. READ IT WITH THE CLASS: "what do you notice?" Cool bars before about 1940, warm bars after about 1980, and the eleven warmest years on record are 2015 to 2025 (the WMO, in all eight datasets it uses); 2023, 2024 and 2025 are the three warmest, and 2025 was one of the three (NASA puts it second, NOAA, the Met Office and Berkeley Earth put it third, so say "one of the three warmest"). NASA, NOAA, the UK Met Office, Berkeley Earth and Copernicus use different methods and get the same picture. THE BASELINE MATTERS: this graph is compared with 1951 to 1980, so its numbers (about +1.2 °C for 2025) are smaller than the figures you may quote against the late 1800s: the IPCC gives 1.09 °C for 2011 to 2020 against 1850 to 1900, and the WMO\'s long-term warming level is about 1.4 °C; the WMO said 2024 was likely the first calendar year more than 1.5 °C above 1850 to 1900 (one year over 1.5 °C does not mean the Paris goal is lost: that is measured over decades). SAY THE UNITS AND THE BASELINE. MORE EVIDENCE: ICE CORES are long cylinders of ice drilled in Antarctica; bubbles of ancient air are trapped in them, so they give the carbon dioxide of the past. For 800,000 years it stayed between about 170 and 300 ppm (the saved record has a low of 174 and a high of 299 before industry). Today: about 427 ppm, about 50% above the 280 ppm before industry, and higher than at any time in at least 2 million years (IPCC). (The Keeling curve, on the worksheet, is the modern measurement from Mauna Loa, Hawaii, since 1958: it zigzags with the seasons because Northern Hemisphere plants take in carbon dioxide in summer.) And shrinking Arctic sea ice, retreating glaciers and rising sea level.\n\n'
    + 'OBJECTIVE 3. THE IMPACTS, which are the examinable objective: (1) SEA LEVEL RISE, from thermal expansion of the water AND melting land ice (not sea ice: floating ice melting does not raise the level). Sea level has risen about 10 cm since satellites began measuring in 1993 (about 21 to 24 cm since 1880), and the rate has more than doubled; in recent years melting land ice has been the bigger share of the rise, though warm water expanding was bigger in 2024 (NASA). (2) MORE FREQUENT AND INTENSE EXTREME WEATHER: heatwaves, droughts, heavy rain (the IPCC says it is virtually certain that hot extremes have become more frequent and more intense, and that human-induced climate change is the main driver of that). (3) SPECIES RANGES SHIFTING towards the poles and uphill (about half of the species assessed have shifted, says the IPCC), and extinction risk where they cannot keep up or have nowhere left to go. (4) CORAL BLEACHING: warm water makes corals expel the algae that live in their tissues (they turn white; bleached coral is not dead, but it is under stress and may die). NOAA confirmed the fourth global bleaching event: from early 2023 to mid-2025 bleaching-level heat stress hit 84% of the world\'s reef area; it has now likely ended, so do not say it is ongoing. THIS REACHES BACK TO THE WATER UNIT: say so. (5) CHANGES IN RAINFALL, crops and water supply: THIS REACHES BACK TO THE RESOURCES UNIT. This is the lesson where the four units become one picture, and the plenary says so. DESCRIBE THEM ACCURATELY AND THEN STOP: do not add to the list, and do not ask "what do you think will happen to your city?".',
  );
}

/* ================================================================== *
 * 6. WE DO · 5: rank and conquer
 * ================================================================== */
K.weDoRC({
  question: 'Explain how the greenhouse effect keeps the Earth warm. (4 marks: sunlight warms the ground, the ground gives out infrared, greenhouse gases absorb it, they send it out in all directions, some back down.)',
  answers: [
    { text: 'The Earth is covered by a layer of greenhouse gases that works like the glass of a greenhouse. The Sun’s heat gets in through a hole in the ozone layer, and the gas layer stops the heat from escaping, so the planet warms up.', rank: 4, reason: '0 marks. Heat does not come in through the ozone layer, and the gases absorb infrared; they are not glass.' },
    { text: 'The Sun sends light and heat to the Earth, and the ground warms up in the sunshine. Greenhouse gases are in the air and they are warm too, which is what keeps the Earth at a comfortable temperature for living things.', rank: 3, reason: '1 mark. Sunlight warms the ground, but nothing about infrared or what the gases do.' },
    { text: 'Sunlight passes through the air and warms the ground. The warm ground gives out infrared radiation, and greenhouse gases such as carbon dioxide absorb it. This is why the Earth is warm, and why adding more of these gases makes it warmer still.', rank: 2, reason: '3 marks. The sunlight, the infrared and the absorbing. It never says the gases send the infrared back down.' },
    { text: 'Sunlight passes through the air and warms the ground. The ground gives out infrared radiation, which greenhouse gases absorb. They send it out in all directions, and some goes back down to the ground, so the Earth is warmer than it would be.', rank: 1, reason: '4 marks. In goes through, out does not: all four steps.' },
  ],
  upgradedFrom: 'A',
  upgraded: 'Sunlight passes through the air and warms the ground. The ground gives out infrared radiation. Greenhouse gases absorb it and send it out in all directions, and some goes back down, so the Earth is warmer. The ozone layer has nothing to do with it.',
  notes:
    'WE DO. 5 minutes. Five clicks: the four ranks (weakest and strongest first), then the upgrade. THE MODE IS "RANK AND CONQUER" (TEMPLATE.md): the last We Do was Spot The Mistake, so rotate. Four answers to one exam-style question, written to differ in quality in known ways.\n\n'
    + 'THE RANKING COMES FROM THE MARK SCHEME, NOT TASTE. The question is out of 4. ONE MARK EACH FOR: (1) sunlight (short-wave radiation) passes through the air and warms the ground; (2) the ground gives out infrared (longer-wave) radiation; (3) greenhouse gases absorb the infrared; (4) they send it out in all directions, some back down to the ground, so the Earth is warmer. THE COUNTS: D has all four = 4 marks (1st). C has (1), (2) and (3) but never says the infrared is sent back down = 3 marks (2nd). B has (1) only ("the ground warms in the sunshine"); the rest is vague = 1 mark (3rd). A has none: the glass, and the hole in the ozone layer = 0 marks (4th).\n\n'
    + 'THE ANSWERS ARE THE SAME LENGTH ON PURPOSE, within about a quarter of each other, and THE BEST ONE IS NOT THE LONGEST (TEMPLATE.md, Chuka\'s rule of 2026-10-18): C is the longest, and its extra words are true but score nothing ("this is why the Earth is warm, and why adding more... warmer still"); A and B are padded with believable filler. SAY SO if a student ranks by length: "length is not marks; show me the mark points". RANK. Read the four out. THE CLASS COMMITS BY A SHOW OF HANDS: who thinks the WEAKEST is A, B, C or D? Then the STRONGEST? Write the tallies. Then CLICK: the slide reveals the ranking, one card at a time, each with ONE reason.\n\n'
    + 'CONQUER. A HOLDS THE LESSON\'S MAIN MISCONCEPTION (it is glass, and the ozone hole lets heat in). TAKE IT AND UPGRADE IT TOGETHER until it would rank first: ask "what comes in?" (sunlight, which passes through), "what does the ground do?" (warms, and gives out infrared), "what do the gases do with it?" (absorb it and send it out in all directions), "where does some of it go?" (back down), and "so what has the ozone layer got to do with it?" (nothing: a different gas, a different part of the atmosphere, a different harm). The upgraded answer is the last click.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Explain why we need the greenhouse effect.', 'Without it the Earth would average about −18 °C. With it, about 15 °C.'],
    ['Name two greenhouse gases and one human source of each.', 'Carbon dioxide: burning fossil fuels. Methane: cattle, rice fields or rubbish tips.'],
    ['Describe two pieces of evidence that the climate is changing.', 'Any two of: the temperature record, ice cores, shrinking Arctic sea ice, retreating glaciers, rising sea level.'],
    ['Describe two impacts of climate change.', 'Any two of: sea level rise, more extreme weather, species moving, coral bleaching, changes to crops and water.'],
    ['Explain why the Montreal Protocol worked.', 'The science was clear enough to act, industry had replacements, and the risk felt real.'],
    ['Describe two ways air pollution is reduced.', 'Any two of: catalytic converters, scrubbers, low-sulfur fuel, laws.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, THEN ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (Lesson 3: why the Montreal Protocol worked) and Q6 (Lesson 2: two ways pollution is reduced). Q1 is OBJECTIVE 1 and the hook\'s answer. Q2 wants TWO gases and a source each. Q3 is OBJECTIVE 2 and a wrong answer shows who has lost "ice cores". Q4 is OBJECTIVE 3 and needs TWO DIFFERENT impacts. IF THE ROOM IS RIGHT BY Q4, ask the question the plenary uses: "which of the things that made the Montreal Protocol work does climate change have?" (clear science: yes; replacements: not at the start, though solar, wind and batteries are now cheap; a risk that feels personal and close: the harm is spread across many places and many years).\n\n'
    + 'IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14: the game, with the three problems on the slide
 * ================================================================== */
{
  const s = K.slide('light', 14, 'You Do');
  s.addImage({ path: path.join(ROOT, 'assets', 'classroom.png'), x: RIGHT - 1.46, y: 0.80, w: 1.46, h: 1.26, transparency: 62, objectName: 'gc_logo' });
  s.addText('A Warming Planet game', { x: M, y: 0.80, w: RIGHT - M - 1.70, h: 0.70, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title' });
  s.addText('Open Google Classroom now. Sort every item into one of three problems.', { x: M, y: 1.50, w: RIGHT - M - 1.70, h: 0.40, color: C.alert, fontFace: F.body, fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub' });
  const lw = 1.50, gap = 0.12, cw = (CW - lw - 3 * gap) / 3, ty = 2.16, hh = 0.56, rh = 0.84;
  const COL = [['Ozone depletion', '5B4A9E'], ['Climate change', 'B23A27'], ['Air pollution', '6A5A3C']];
  COL.forEach(([name, fill], i) => {
    s.addText(name, { shape: S.roundRect, rectRadius: 0.10, x: M + lw + gap + i * (cw + gap), y: ty, w: cw, h: hh, fill: { color: fill }, line: { color: fill, width: 0 }, color: 'FFFFFF', fontFace: F.title, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `tb_h${i}` });
  });
  const ROWS = [
    ['Gas', ['CFCs', 'carbon dioxide, methane', 'sulfur dioxide, nitrogen oxides, particulates']],
    ['Where', ['high up, in the stratosphere', 'the whole atmosphere', 'near the ground, local']],
    ['Harm', ['more ultraviolet light reaches the ground', 'heat is trapped, so the Earth warms', 'harm to lungs, acid rain, smog']],
    ['Fixed?', ['largely, yes (Montreal Protocol)', 'not yet', 'partly, in many places']],
  ];
  ROWS.forEach(([lab, cells], r) => {
    const y = ty + hh + 0.10 + r * (rh + 0.08);
    s.addText(lab, { x: M, y, w: lw, h: rh, color: C.accentInk, fontFace: F.title, fontSize: 15, bold: true, valign: 'middle', margin: 0, objectName: `tb_l${r}` });
    cells.forEach((c, i) => {
      const x = M + lw + gap + i * (cw + gap);
      K.card(s, { x, y, w: cw, h: rh, fill: r === 3 ? ANS : 'FFFFFF', line: r === 3 ? C.support : LINE, lineWidth: 1.3, name: `tb_c${r}${i}` });
      s.addText(c, { x: x + 0.14, y, w: cw - 0.28, h: rh, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `tb_t${r}${i}` });
    });
  });
  s.addText('Round 1: the unit. Round 2: the look-alikes. Round 3: very hard, meant to be almost impossible. No timer on the items. Stop and see your results any time. The worksheet is there too.', { x: M, y: ty + hh + 0.10 + 4 * (rh + 0.08) + 0.04, w: CW, h: 0.70, color: C.dark, fontFace: F.body, fontSize: 14.5, bold: true, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'yd_note' });
  s.addNotes(
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Two clicks: the table, then the note. THE GAME REPLACES THE WORKSHEET FOR THESE 14 MINUTES (GAMES.md); THE WORKSHEET IS THE FALLBACK for absentees, early finishers and anyone the game does not suit. Both are on Google Classroom.\n\n'
    + 'THE TABLE ON THE SLIDE IS THE UNIT\'S WHOLE POINT, AND THE GAME SORTS INTO IT. Three different atmospheric problems, and most of the class thinks they are one. Read it down one column at a time (gas, where, harm, fixed?), and ask "which column is the odd one out on the last row?" (climate change: not yet fixed). THE GAME IS A SORTER: items come up, students put each in ozone depletion, climate change or air pollution. About half the items are today\'s and the rest are from Lessons 1 to 3. ROUND 1 is the unit; ROUND 2 is the look-alikes (carbon dioxide from an exhaust is climate change, not air pollution; ozone that irritates the lungs on a hot day in a city is air pollution, not ozone depletion); ROUND 3 GOES FAR PAST THE LESSON and is meant to be almost impossible: say so before they start (the start screen says it too). THEY CAN STOP AND SEE THEIR RESULTS AT ANY TIME. The game is different for every student (a code on the start and end screens, and #CODE on the address shows you what a student saw), has no timer on the items, stores nothing and works offline.\n\n'
    + 'WHILE THEY PLAY, CIRCULATE WITH ONE QUESTION: "where is it, and what is the harm?" The drop-down on each round\'s screen shows how long each item took, what they chose, and how to get to the right bin. AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide: they review their drop-downs, with the table in front of them. IF THE GAME CANNOT RUN (no devices, no wifi is fine, but no devices is not), give out the worksheet.',
  );
}

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  gameLine: ['Open the drop-down for round 1 and round 2. ', 'For each red mark, find the item in the table above and say which problem it belongs to and why.'],
  bullets: [
    'The greenhouse effect keeps Earth warm. Greenhouse gases absorb infrared from the ground and send some back down. We have made it stronger.',
    'Evidence: the temperature record, ice cores, shrinking sea ice and glaciers, rising sea level.',
    'Impacts: sea level rise, more extreme weather, species moving, coral bleaching, changes to crops and water.',
    'Ozone depletion, climate change and air pollution are three different problems.',
  ],
  notes:
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). The game marks itself, so the marking here is the REVIEW: students open the drop-down for each round and look at every red mark: what they chose, how long it took, and how to get to the right bin. The answers to the worksheet, if they did that, are printed UPSIDE DOWN at the foot of its last page.\n\n'
    + 'WALK ROUND for the three mistakes the game names: carbon dioxide from an exhaust put in air pollution; ozone depletion put in climate change ("it lets the heat in"); and ozone near the ground put in ozone depletion. Tell them to write the correct answer next to anything wrong and not rub it out.',
});

/* ================================================================== *
 * 10. PLENARY · 3: the last of the unit, and of the four human-impact units
 * ================================================================== */
K.plenary({
  qs: [
    ['Without the greenhouse effect, the Earth would be much colder.', 'TRUE'],
    ['The hole in the ozone layer is the main cause of climate change.', 'FALSE'],
    ['Acid rain and global warming are the same problem.', 'FALSE'],
    ['Sea level is rising partly because sea water expands as it warms.', 'TRUE'],
    ['A power station fits scrubbers. That cuts its sulfur dioxide, but it does not stop climate change.', 'TRUE'],
  ],
  closing: 'Three problems, one sky: ozone is recovering, air pollution has improved, and climate change is the one we are still solving.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line. THIS CLOSES THE UNIT, AND THE FOUR HUMAN-IMPACT UNITS, and the unit plan asks that it does not end on catastrophe. EVERY FALSE IS A MISCONCEPTION FROM TODAY OR THE UNIT. Q2: the unit\'s misconception, "the hole in the ozone layer lets the heat in / causes global warming": ozone depletion lets in ultraviolet light, climate change is heat trapped by greenhouse gases. Q3: acid rain is sulfur dioxide and nitrogen oxides; global warming is carbon dioxide and methane. Q1 and Q4 are plainly TRUE (objectives 1 and 3). Q5 IS THE APPLIED ITEM AND IT CROSSES THE UNIT: a scrubber removes sulfur dioxide and does nothing about carbon dioxide, so it cuts air pollution and not climate change. Ask "which of the three problems did the scrubber help?"\n\n'
    + 'THE COMPARISON THE LESSON ENDS ON, which is far better than despair: THE MONTREAL PROTOCOL WORKED BECAUSE THE SCIENCE WAS CLEAR ENOUGH TO ACT, INDUSTRY HAD REPLACEMENTS IT COULD USE, AND THE RISK FELT PERSONAL (skin cancer, and a hole you could see on a satellite map); the problem was also simple: few chemicals, a few companies (DuPont made about a quarter of the world\'s CFCs), and substitutes close at hand. CLIMATE CHANGE HAS THE FIRST CONDITION AND NOT YET THE OTHERS: the science is clear, but fossil fuels are built into how the world makes energy, the replacements (solar, wind, batteries) have only recently become cheap, and the harm is spread out over time and places, with many causes and almost every activity involved (GESDA, 2026), and the harm is spread out over time and place. AND THE GOOD NEWS IS REAL AND CHECKED (2026 figures): IRENA found that more than 90% of the new renewable power stations built in 2025 made electricity more cheaply than the cheapest new fossil-fuel alternative, and that solar power now costs 89% less than in 2010; Ember reports that in 2025 renewables overtook coal as the world\'s biggest source of electricity for the first time in a century; and the UK\'s greenhouse gas emissions are down 54% since 1990, with the last coal power station shut in 2024. Projected warming this century has also come down from about 3 °C to about 2.3 to 2.8 °C, which is still too high, so say both. THE WMO: every fraction of a degree matters. Say it plainly and stop.\n\n'
    + 'WHAT THE FOUR UNITS ADDED UP TO (TEMPLATE.md asks for it): THE FOUR UNITS BECAME ONE PICTURE. Land and resources: soil, fossil fuels and what we take. Water: coral bleaching is Unit 5, and rainfall and crops depend on water and soil. The air: three problems, one sky. Say it in three sentences if there is a moment: people change the land, the water and the air; each change shows up somewhere else; and some of them have been fixed because people acted. That last sentence is the one to finish on.',
});

K.write().catch((e) => { console.error(e); process.exit(1); });

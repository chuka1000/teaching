/**
 * Y9 Science, Atmosphere, Lesson 2: What It Does To Us. Class Y9 (9G and 9I, one deck). Single, 50 minutes. Upper Air palette.
 *
 * PREVIOUS: What Gets Into The Air (Lesson 1, built in this batch: build/what-gets-into-the-air.js, 50 minutes: I Do 1 the five pollutants and their sources, I Do 2
 * primary, secondary and smog; We Do Finish It Off; the particulate traps were set out in the You Do). Its plenary promised: "Next: what these pollutants do to our
 * bodies, to lakes and to buildings", and the traps read this lesson. The Water decks (Pollution Pandemic) supply the lakes: acid rain is Unit 5's content arriving
 * from the air. The AVOID line of the unit plan is kept: carbon dioxide is NOT in the list of health-damaging pollutants.
 *
 * THE LAST THREE Y9 DO NOWS (What Gets Into The Air, Pollution Pandemic, What The Earth Gives Us) were read: nothing here repeats.
 * WE DO: RANK AND CONQUER (Lesson 1's was Finish It Off). The four answers are within a quarter of each other's length and the best is neither the longest nor the
 * shortest (TEMPLATE.md; the kit checks it). Numbers are checked in build/atmosphere-check.py.
 */
const K = require('./atmosphere-kit')({ lesson: 'What It Does To Us', subject: 'Y9 Science · Atmosphere · Lesson 2 · 9G and 9I' });
const DATA = require('./atmosphere.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H, LINE, ANS } = K;
const D2 = DATA.l2;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['State where sulfur dioxide comes from.', 'Burning coal or oil that contains sulfur, for example in a power station.'],
    ['Explain why the ozone in smog is a secondary pollutant.', 'It is not released. It is made in the air, in sunlight, from nitrogen oxides and VOCs.'],
    ['Explain why a polluted river can recover faster than polluted deep groundwater.', 'A river refills in months. Deep groundwater takes thousands of years to refill.'],
    [`A lake has ${D2.fish.fish} fish. A pollutant kills ${D2.fish.pct}% of them. Calculate how many fish are left.`, `${D2.fish.fish} − (${D2.fish.fish} × ${D2.fish.pct} ÷ 100) = ${D2.fish.left} fish`],
    ['Is a solution with a pH of 4 acidic, neutral or alkaline?', 'Acidic, because it is below 7.'],
    ['Suggest how a gas from a power station in one country could harm a lake in another country.', 'The wind carries the gas. It dissolves in cloud water and falls far away as acid rain.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ What Gets Into The Air (the previous lesson, built in this batch) and checked every question against the last three Do Nows in the year group (What Gets Into The Air, Pollution Pandemic, What The Earth Gives Us). Nothing repeats. THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (the source of sulfur dioxide, which today\'s acid rain needs; why ozone in smog is secondary). Q3 and Q4 are EARLIER (Pollution Pandemic: rivers and groundwater refill at different speeds; a percentage with new numbers, which is also the shape of today\'s "how many fish are left"). Q5 is another science (chemistry: the pH scale, which the acid rain chemistry needs). Q6 IS THE PREVIEW: NOT RETRIEVAL. ITS CARD IS SHADED so the room can see the answer is new. They have not been taught it, so they SUGGEST. Take two or three ideas, write them on the board, then click, and say "that is objective 2 today, and the answer to the hook".\n\n'
    + `Q1: coal or oil that contains sulfur. Q2: it is made, not released. Q3: months against thousands of years. Q4: ${D2.fish.fish} × ${D2.fish.pct} ÷ 100 = ${D2.fish.dead} killed, so ${D2.fish.left} left (watch for the answer ${D2.fish.dead}, which is the number killed). Q5: below 7 is acidic. Q6: the wind carries it, it dissolves in cloud water, it falls as acid rain.\n\n`
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Describe the effects of air pollution on human health.', 'Explain how acid rain forms, and what it damages.', 'Describe three ways air pollution is reduced.'],
  banner: [['Air pollution ', false], ['harms', true], [' lungs, lakes, trees and buildings, but it can be ', false], ['reduced', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'THE UNIT, in one line: last lesson was what gets into the air; today is what it does, and how it has been reduced. The banner says both halves, and the lesson ends on the second one: AIR POLLUTION IS THE PROBLEM IN THIS UNIT THAT HAS MEASURABLY IMPROVED IN RICH COUNTRIES. Say so, and why it matters before Lesson 4.\n\n'
    + 'NO NEW VOCABULARY TODAY: the lesson spends its time on mechanism. THE TRAPS: "today you read the six traps from last lesson". They are read during the You Do.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'In the 1970s thousands of lakes in Sweden and Norway lost their fish. The factories and power stations causing it were hundreds of kilometres away. How did the pollution reach the lakes?',
  qSize: 19,
  opts: ['Rivers carried it from the factories.', 'The wind carried the gases, and they fell in the rain.', 'It leaked out of the rocks under the lakes.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the second I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. Sulfur dioxide and nitrogen oxides from power stations, factories and traffic in other countries (UK government: emissions of sulfur dioxide from the UK landed as acid rain in Scandinavia in the 1970s and 1980s) were carried by the wind, sometimes for hundreds of kilometres, and fell as acid rain on Scandinavian lakes, whose thin soils and hard rock could not neutralise it. The Swedish scientist Svante Odén showed it in the 1960s. It was the first big case of pollution that CROSSED BORDERS: the UN conference in Stockholm in 1972 made it an international issue, and countries signed the Convention on Long-range Transboundary Air Pollution in 1979. (Sources: see the unit file.)\n\n'
    + 'A is the tempting wrong one: the lakes were not on the same rivers. C is the "natural" idea: the rocks of Scandinavia are hard and do not neutralise acid well, which is why the lakes were so badly hit, but the acid did not come from the rocks. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: what air pollution does to our bodies (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'What air pollution does to our bodies');
  const gap = 0.26, cw = (CW - 2 * gap) / 3, y0 = 1.80, ch = 4.10, ph = 1.92;
  const cards = [
    { name: 'pt', head: 'Particulates', pic: 'atm-particles', body: 'Particles smaller than 2.5 µm (PM2.5) go deep into the lungs, and can reach the blood. Asthma, heart disease and lung cancer.' },
    { name: 'co', head: 'Carbon monoxide', pic: 'atm-haemoglobin', body: 'It sticks to haemoglobin in place of oxygen. The blood carries less oxygen, so you feel dizzy, and a lot can kill.' },
  ];
  cards.forEach((c, i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, name: c.name });
    s.addText(c.head, { x: x + 0.22, y: y0 + 0.10, w: cw - 0.44, h: 0.46, color: C.dark, fontFace: F.title, fontSize: 19, bold: true, valign: 'middle', margin: 0, objectName: `${c.name}_h` });
    K.pic(s, c.pic, x + 0.16, y0 + 0.62, cw - 0.32, (cw - 0.32) * 620 / 1100, `${c.name}_pic`);
    s.addText(c.body, { x: x + 0.22, y: y0 + 0.62 + (cw - 0.32) * 620 / 1100 + 0.10, w: cw - 0.44, h: ch - 0.72 - (cw - 0.32) * 620 / 1100 - 0.14, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17.5, objectName: `${c.name}_t` });
  });
  {
    const x = M + 2 * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, fill: ANS, line: C.accentInk, lineWidth: 1.6, name: 'oz' });
    s.addText('Ozone, nitrogen dioxide, sulfur dioxide', { x: x + 0.22, y: y0 + 0.10, w: cw - 0.44, h: 0.80, color: C.dark, fontFace: F.title, fontSize: 17, bold: true, valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'oz_h' });
    s.addText('They irritate the airways. Coughing, a sore throat, asthma attacks, and bronchitis.', { x: x + 0.22, y: y0 + 1.00, w: cw - 0.44, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: 'oz_t' });
    s.addText([{ text: 'About 4 million', options: { bold: true, color: C.alert, fontSize: 24, breakLine: true } }, { text: 'early deaths in 2019 were caused by outdoor air pollution (WHO).', options: { color: C.ink, fontSize: 13.5 } }], { x: x + 0.22, y: y0 + 2.20, w: cw - 0.44, h: 1.70, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 24, objectName: 'oz_stat' });
  }
  K.sentence(s, [['Pollutants harm health in ', false], ['different ways', true], [': particulates reach deep, carbon monoxide blocks oxygen, ozone irritates.', false]], { y: y0 + ch + 0.22, h: 0.60, size: 15.5, name: 'health_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: particulates, carbon monoxide, the third card, then the banner.\n\n'
    + 'OBJECTIVE 1. THREE WAYS POLLUTANTS HARM US, each different, and each is a mechanism, not a list. (1) PARTICULATES. PM10 is particles up to 10 micrometres across; PM2.5 up to 2.5 micrometres. A human hair is about 70 micrometres wide, so a PM2.5 particle is about 28 times narrower than a hair (the picture shows it to scale). They are small enough to get past the nose and throat and deep into the lungs, and PM2.5 can even enter the blood (WHO). Long-term exposure is linked to asthma, heart disease, stroke and lung cancer. (Chronic bronchitis is linked in the UK government\'s sources to sulfur dioxide, so it is on the third card, not this one.) The picture is to scale, and the EPA says an average hair is about 30 times wider than the largest fine particle; 70 ÷ 2.5 = 28. Hair width varies, so say "about 30". (2) CARBON MONOXIDE. THIS IS THE CALLBACK TO RESPIRATION AND BLOOD: haemoglobin in red blood cells carries oxygen; carbon monoxide binds to it much more strongly than oxygen does (the UK Health Security Agency says 245 times; other sources say 200 to 250), so it takes the places oxygen needs, and the blood is carrying carboxyhaemoglobin instead of oxyhaemoglobin. The blood carries less oxygen and the tissues starve: headache, dizziness, and at high levels death. It has no colour or smell, which is why faulty gas boilers and blocked flues are dangerous. Ask "what is haemoglobin for?" before you click. (3) OZONE, NITROGEN DIOXIDE AND SULFUR DIOXIDE irritate the airways: coughing, a sore throat, and they set off asthma attacks. THE WHO FIGURE: outdoor air pollution caused an estimated 4.2 million premature deaths worldwide in 2019 (WHO fact sheet, 2024). It is NOT the 6.7 or 7 million you may see: that adds household air pollution, such as cooking fires. About two thirds of the outdoor deaths were from heart disease and stroke. 99% of people live where the WHO guideline levels are not met.\n\n'
    + 'AVOID: CARBON DIOXIDE IS NOT ON THIS SLIDE. It does not damage lungs at normal levels. It matters in Lesson 4 as a greenhouse gas. If a student says "but carbon dioxide is a pollutant", say "yes in Lesson 4, for a different reason: it traps heat; it does not damage lungs". Mixing the two is exactly the confusion the unit is trying to prevent.\n\n'
    + 'WORKED EXAMPLE: the haemoglobin picture is the worked example. Left, oxygen in the four places. Right, carbon monoxide in them, and oxygen left outside. Walk it left to right.',
  );
}

/* ================================================================== *
 * 5. I DO · 3: acid rain and how pollution is reduced (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Acid rain, and how it is reduced');
  const vw = 5.20, vh = vw * 9 / 16, vy = 1.82;
  K.card(s, { x: M - 0.06, y: vy - 0.06, w: vw + 0.12, h: vh + 0.12, name: 'vid_bg' });
  K.video(s, 'atm-acid-rain', M, vy, vw, vh, 'vid_acid');
  const rx = M + vw + 0.30, rw = RIGHT - rx, dg = 0.10, dh = (vh - 2 * dg) / 3;
  const DAM = [
    ['Lakes', 'The water becomes too acid. Fish and other animals die.', null],
    ['Trees', 'Leaves are damaged and nutrients wash out of the soil.', 'atm_deadforest'],
    ['Buildings', 'Limestone and marble slowly dissolve.', 'atm_statue'],
  ];
  DAM.forEach(([head, text, ph], i) => {
    const y = vy + i * (dh + dg);
    K.card(s, { x: rx, y, w: rw, h: dh, name: `dm${i}` });
    if (ph) K.pic(s, ph, rx + 0.12, y + 0.10, dh - 0.20, dh - 0.20, `dm${i}_pic`);
    else s.addText('pH', { x: rx + 0.12, y: y + 0.10, w: dh - 0.20, h: dh - 0.20, shape: S.roundRect, rectRadius: 0.08, fill: { color: C.alert }, line: { color: C.alert, width: 0 }, color: 'FFFFFF', fontFace: F.title, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `dm${i}_pic` });
    s.addText([{ text: head, options: { bold: true, color: C.dark, fontSize: 16, breakLine: true } }, { text, options: { color: C.ink, fontSize: 13 } }], { x: rx + dh + 0.10, y, w: rw - dh - 0.22, h: dh, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 16.5, objectName: `dm${i}_t` });
  });
  const ry = vy + vh + 0.32, rcw = (CW - 3 * 0.18) / 4, rch = 1.30;
  const RED = [
    ['Catalytic converters', 'Clean the exhaust of a car.', 'atm_converter'],
    ['Scrubbers on chimneys', 'Remove sulfur dioxide with limestone.', 'atm_powerstation'],
    ['Low-sulfur fuel', 'Less sulfur in the fuel, less sulfur dioxide.', null],
    ['Laws', 'The Clean Air Act 1956 came four years after the Great Smog.', null],
  ];
  RED.forEach(([head, text, ph], i) => {
    const x = M + i * (rcw + 0.18);
    K.card(s, { x, y: ry, w: rcw, h: rch, fill: ANS, line: C.support, lineWidth: 1.5, name: `rd${i}` });
    if (ph) K.pic(s, ph, x + 0.10, y0r(ry), 0.74, 0.74, `rd${i}_pic`);
    s.addText([{ text: head, options: { bold: true, color: C.dark, fontSize: 13.5, breakLine: true } }, { text, options: { color: C.ink, fontSize: 11.5 } }], { x: x + (ph ? 0.92 : 0.16), y: ry, w: rcw - (ph ? 1.02 : 0.28), h: rch, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 14.5, objectName: `rd${i}_t` });
  });
  function y0r(y) { return y + (rch - 0.74) / 2; }
  K.sentence(s, [['Acid rain falls from ', false], ['sulfur dioxide and nitrogen oxides', true], ['. Cutting those cuts the acid rain.', false]], { y: ry + rch + 0.16, h: 0.56, size: 15.5, name: 'acid_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the animation (ON CLICK, so say the idea first), the three things acid rain damages, the four ways pollution is reduced, then the banner.\n\n'
    + 'OBJECTIVE 2. HOW ACID RAIN FORMS (the animation, about 26 seconds, it PAUSES at four steps; talk over the pauses; click it again to replay): (1) a coal power station burns coal that contains sulfur, and releases sulfur dioxide (and nitrogen oxides, from the hot flame); (2) the gases rise and dissolve in the water of the clouds; (3) they make sulfuric acid (from sulfur dioxide) and nitric acid (from nitrogen oxides); (4) the acid falls as rain, snow or mist. THE LAST FRAME SHOWS THE DAMAGE: the lake gets more acid (the pH number falls) and the fish disappear; the tree\'s needles go brown; the statue loses its detail. NORMAL RAIN IS ALREADY SLIGHTLY ACID (about pH 5.6, from carbon dioxide dissolved in it), so acid rain is rain MORE acid than that: usually pH 4.2 to 4.4 (US EPA), and every pH unit is a factor of ten in acidity. Rain as acid as vinegar (pH 2.4) fell in Scotland in 1974. ACID RAIN IS NOT DANGEROUS TO STAND IN: the EPA says walking in acid rain is no more dangerous than walking in normal rain; the harm to people comes from the sulfur dioxide, nitrogen oxides and fine particles in the air. THE COMMON MISTAKE: "acid rain is caused by carbon dioxide". It is sulfur dioxide and nitrogen oxides. Carbon dioxide is next time, and a different problem.\n\n'
    + 'WHAT IT DAMAGES, one line each: LAKES, where the water becomes too acid for fish and other animals: at pH 5 most fish eggs cannot hatch, and some acid lakes have no fish (and the acid washes aluminium out of the soil, which also harms fish); TREES, which are weakened because leaves are damaged and nutrients wash out of the soil, so they die more easily from drought, cold or disease. BE CAREFUL HERE: the clearest case is the "Black Triangle" on the border of the Czech Republic, Germany and Poland, where more than 40,000 hectares of forest died in the 1970s and 1980s mainly from very high sulfur dioxide in the air; the wider forest damage in Germany had several causes (acid deposition, ozone, nitrogen), and scientists still disagree about how much each did. Say "weakened", not "killed"; and BUILDINGS, because limestone and marble are made of calcium carbonate, which reacts with acid and slowly dissolves. Marble chips with dilute acid make that fizz in twenty seconds. THE LINK TO THE WATER UNIT: it is the same lakes, reached through the air: Pollution Pandemic\'s lakes, with a different cause. Say that in one sentence.\n\n'
    + 'OBJECTIVE 3. THREE WAYS POLLUTION IS REDUCED (and a fourth): a CATALYTIC CONVERTER in a car\'s exhaust turns carbon monoxide into carbon dioxide, nitrogen oxides into nitrogen, and unburnt fuel into carbon dioxide and water; SCRUBBERS ("flue-gas desulfurisation") on power-station chimneys react the sulfur dioxide with limestone and take most of it out; LOW-SULFUR FUELS put less sulfur in, so less sulfur dioxide comes out; and LAWS (the Clean Air Act of 1956, four years after the Great Smog; later laws on cars, chimneys and fuels). THE HOPEFUL POINT, which is the tone of the unit: air pollution is the problem in this unit that HAS improved in rich countries. London\'s air has not done what it did in 1952 since. Say that, and say "next lessons are the other two problems, and they are harder".\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY: B. The wind carried the gases from other countries, and they fell as acid rain on Scandinavian lakes, which could not neutralise it.',
  );
}

/* ================================================================== *
 * 6. WE DO · 5: rank and conquer
 * ================================================================== */
K.weDoRC({
  question: 'Explain how acid rain forms and what it damages. (4 marks: burning releases sulfur dioxide and nitrogen oxides, they dissolve in cloud water, they make acids that fall as rain, one thing damaged.)',
  answers: [
    { text: 'Acid rain happens when carbon dioxide from factories and cars mixes with the clouds. The extra carbon dioxide makes the rain acidic, and it also burns a hole in the ozone layer, so more acid falls through.', rank: 4, reason: '0 marks. It is not carbon dioxide, and it has nothing to do with the ozone layer.' },
    { text: 'Burning coal and oil in power stations releases sulfur dioxide. The sulfur dioxide makes the rain acidic, and acid rain is very bad for the environment because it harms a lot of living things and spoils many places.', rank: 3, reason: '2 marks. Source and acid rain, but no dissolving in cloud water and no named damage.' },
    { text: 'Power stations burn coal and oil, which sends sulfur dioxide and nitrogen oxides up tall chimneys. They dissolve in cloud water to make sulfuric and nitric acid, and the wind carries them far away before they fall as rain.', rank: 2, reason: '3 marks. Every step of how it forms, but no damage is named.' },
    { text: 'Burning coal and oil releases sulfur dioxide and nitrogen oxides. They dissolve in cloud water and make sulfuric and nitric acid, which fall as acid rain. It kills fish in lakes and slowly dissolves limestone buildings.', rank: 1, reason: '4 marks. The source, the dissolving, the acids, and damage to lakes and buildings.' },
  ],
  upgradedFrom: 'A',
  upgraded: 'Acid rain forms when burning coal and oil releases sulfur dioxide and nitrogen oxides. They dissolve in cloud water to make sulfuric and nitric acid, which fall as rain. It kills fish in lakes and dissolves limestone and marble. Carbon dioxide is not the cause.',
  notes:
    'WE DO. 5 minutes. Five clicks: the four ranks (weakest and strongest first), then the upgrade. THE MODE IS "RANK AND CONQUER" (TEMPLATE.md): the last We Do in the unit was Finish It Off, so rotate. Four answers to one exam-style question, written to differ in quality in known ways.\n\n'
    + 'THE RANKING COMES FROM THE MARK SCHEME, NOT TASTE. The question is out of 4. ONE MARK EACH FOR: (1) burning coal or oil releases sulfur dioxide and nitrogen oxides; (2) the gases dissolve in water in clouds; (3) they form sulfuric and nitric acid, which fall as acid rain; (4) a named thing it damages (fish or lakes, trees, buildings). THE COUNTS: D has all four = 4 marks (1st). C has (1), (2) and (3) but names no damage = 3 marks (2nd). B has (1) and (3) in thin form (sulfur dioxide, "makes the rain acidic") with no dissolving and no named damage ("harms a lot of living things" is too vague) = 2 marks (3rd). A names carbon dioxide and the ozone layer: 0 marks (4th).\n\n'
    + 'THE ANSWERS ARE THE SAME LENGTH ON PURPOSE, within about a quarter of each other, and THE BEST ONE IS NOT THE LONGEST (TEMPLATE.md, Chuka\'s rule of 2026-10-18). THE LONG ONE IS C: its extra words are true but score nothing ("tall chimneys", "the wind carries them far away"), and B and A are padded with believable filler. SAY SO if a student ranks by length: "length is not marks; show me the mark points". RANK. Read the four out. THE CLASS COMMITS BY A SHOW OF HANDS: who thinks the WEAKEST is A, B, C or D? Then the STRONGEST? Write the tallies. Then CLICK: the slide reveals the ranking, one card at a time, each with ONE reason.\n\n'
    + 'CONQUER. A HOLDS THE LESSON\'S MAIN MISCONCEPTION (it is carbon dioxide, and the ozone layer is involved). TAKE IT AND UPGRADE IT TOGETHER until it would rank first: ask "which gas?" (sulfur dioxide, and nitrogen oxides), "what happens to it in the clouds?" (dissolves), "what does it make?" (sulfuric and nitric acid), "and what does it damage?" (fish, trees, buildings), and "so what has carbon dioxide got to do with it?" (nothing: that is Lesson 4). The upgraded answer is the last click.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Name the gas that carbon monoxide takes the place of in the blood.', 'Oxygen. Carbon monoxide binds to haemoglobin instead.'],
    ['Describe how particulates harm health.', 'They go deep into the lungs, and some reach the blood. Linked to asthma, heart disease and lung cancer.'],
    ['Name the two acids in acid rain.', 'Sulfuric acid and nitric acid.'],
    ['Describe two ways air pollution is reduced.', 'Any two of: catalytic converters, scrubbers on chimneys, low-sulfur fuel, laws.'],
    ['Name three air pollutants.', 'Any three of: carbon monoxide, sulfur dioxide, nitrogen oxides, particulates, VOCs.'],
    ['Describe how fertiliser running into a lake can lead to fish dying.', 'It feeds the algae. They die. Bacteria use up the oxygen. The fish die for lack of oxygen.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, THEN ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (last lesson: the five pollutants) and Q6 (Pollution Pandemic: the eutrophication chain: it is the other way a lake loses its fish, and the answer is oxygen, not acid). Q1 is OBJECTIVE 1, and the callback to the blood. Q2 is OBJECTIVE 1 and wants "deep into the lungs". Q3 is OBJECTIVE 2 and a wrong answer shows who has "carbonic acid" or "carbon dioxide" in their head. Q4 is OBJECTIVE 3 and needs two DIFFERENT ones. IF THE ROOM IS RIGHT BY Q4, ask "which of those has made the biggest difference to London since 1952?" (the law, and the fuel it changed; acceptable answers vary: it is a debate).\n\n'
    + 'IF SHORT OF TIME, cut Q5.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Effects and traps', 'Say how each pollutant harms us, record what the six traps show, and rank the six places. Read the worked example first.'],
    ['SILVER', 'How acid rain forms', 'Put the acid rain steps in order, explain why the ozone layer and carbon dioxide are not the cause, and work out a number.'],
    ['GOLD', 'Cause, effect, fix', 'Link each pollutant to its harm and its fix, and explain why a taller chimney does not solve acid rain.'],
  ],
  note: 'Choose a tier. Take turns at the trap station, by eye first and then under the microscope. The questions are mixed on purpose.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three tiers, then the note.\n\n'
    + 'THE WORKSHEET IS THE TASK, AND THE TRAPS ARE A STATION INSIDE IT. THREE TIERS, THEY CHOOSE (TEMPLATE.md). All three tiers share the TRAP RESULTS TABLE on the first page (the data from the six slides); the questions differ. BRONZE: the effects of each pollutant, the trap table, and ranking the six places. SILVER: the acid rain steps in order, why carbon dioxide and the ozone layer are not the cause (the "why does that step work?" prompt, Q7), and a number (Q8). GOLD: cause, effect and fix in a table, why a taller chimney does not solve acid rain, and "where would you meet this outside the lesson?" AIM FOR ABOUT FOUR RIGHT OUT OF FIVE on Bronze: if Bronze is producing lots of errors, the problem is the I Do, not the student. THE QUESTIONS ARE MIXED ON PURPOSE (interleaved), and the sheet says so.\n\n'
    + 'THE TRAP STATION (run it while they work): collect the six slides BEFORE the lesson and put them on a bench with a microscope or two. Pairs come in turn, about three minutes each. FIRST BY EYE: is the film clean, a little dirty or dirty? THEN UNDER THE MICROSCOPE (x40 or x100): count the specks in one field of view, three different fields, and write the average. Each pair records the six places in the table on the sheet. Trap F, the sealed one, is the CONTROL: it tells you what was on a slide before it went out, so any specks on the others come from the place, not the slide. Expect the car park slide to be the dirtiest, the sealed one cleanest. If one pair finds a surprising result (a windowsill dirtier than the car park), that is the best discussion of the lesson: ask what differed (dust from a building site, a south-facing sill, sheltered or not). COMPILE THE CLASS RANKING ON THE BOARD in the Mark phase and keep the slides.\n\n'
    + 'WHAT TO EXPECT: dust, fibres, pollen, and black specks (soot or ash), most of all outdoors and by roads; a school building with good air filters may show almost nothing indoors, which is a result too. A petroleum-jelly slide collects mostly the larger particles that settle. It will NOT show individual PM2.5 particles, which are too small for a school microscope, so describe the practical as "evidence that particles are in the air", not a PM2.5 measurement. Sources disagree on the exposure time (24 hours to a week; a week shows more), so a week is a safe minimum. Gloves or care with the glass slides, wash hands after, and keep slides out of the rain.\n\n'
    + 'MARBLE CHIPS (if there is time, as a demonstration, not a task): dilute acid on marble chips fizzes: that is acid rain dissolving a building, at speed. Safety: dilute acid, eye protection, and the usual care. THE WORST MISTAKES to look for: "acid rain is carbon dioxide"; "the ozone layer makes acid rain"; trap data with no unit or no average. AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'Particulates reach deep into the lungs. Carbon monoxide takes the place of oxygen in the blood. Ozone and nitrogen dioxide irritate the airways.',
    'Acid rain: sulfur dioxide and nitrogen oxides dissolve in cloud water, make sulfuric and nitric acid, and fall as rain. It harms lakes, trees and limestone buildings.',
    'Carbon dioxide and the ozone layer are not the cause of acid rain.',
    'Pollution is reduced by catalytic converters, scrubbers, low-sulfur fuel and laws.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). This phase is not optional and is not absorbed into the You Do. The answers are printed UPSIDE DOWN at the foot of the last worksheet page.\n\n'
    + 'WHILE THEY MARK, put the class\'s ranking of the six places on the board (the dirtiest by eye and by count), and ask the one question: "what does that tell you about where the pollution comes from?" WALK ROUND for three mistakes: carbon dioxide in the health list or the acid rain explanation; the ozone layer mixed into acid rain; and trap counts with no average. Tell them to write the correct answer next to anything wrong and not rub it out.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Carbon monoxide harms us by taking the place of oxygen in the blood.', 'TRUE'],
    ['Acid rain is caused by carbon dioxide.', 'FALSE'],
    ['Carbon dioxide damages the lungs in the same way as soot.', 'FALSE'],
    ['A power station builds a taller chimney. That stops the acid rain.', 'FALSE'],
    ['Fitting scrubbers to power stations reduces the sulfur dioxide in the air, so it should reduce acid rain.', 'TRUE'],
  ],
  closing: 'Next: the ozone layer, which is high up and has nothing to do with acid rain.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line. EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: acid rain is sulfur dioxide and nitrogen oxides, not carbon dioxide (the commonest mix-up; and rain is slightly acid anyway from carbon dioxide, which is not what "acid rain" means). Q3: the AVOID line of the unit: carbon dioxide matters for a different reason, in Lesson 4. Q4: a taller chimney spreads the gases further, it does not remove them, and that is part of how acid rain crossed borders (the hook). Q1 is plainly TRUE (objective 1). Q5 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): a fix that works because it removes the cause. Ask "which of the four ways is that?" (scrubbers: removing it from the chimney).\n\n'
    + 'SETTLE THE HOOK, POINTING AT THE TALLY, if you have not: B. THE CLOSING LINE POINTS FORWARD: Lesson 3 is the ozone layer, which is high up, and which students mix up with air pollution. It is a different problem, and it has a good ending.',
});

K.write().catch((e) => { console.error(e); process.exit(1); });

/**
 * Y8 Science, Prokaryotes, Lesson 5: The Bacteria We Need. Class 8I. Single, 50 minutes. Culture palette, carried on from the unit.
 *
 * PREVIOUS: Archaea And Extreme Places (built in the same batch, out/Archaea And Extreme Places). 50 minutes, ten slides, a Sorter game as the You Do. It taught
 * archaea, the three domains, and the three habitats (thermophiles, halophiles, methanogens); its plenary promised "next lesson: the bacteria we need".
 *
 * THE LAST THREE 8I DO NOWS (Archaea And Extreme Places, The Bacteria, How Prokaryotes Live) were read: nothing here repeats.
 * WE DO: FINISH IT OFF (the last We Do was Rank And Conquer): three chains, insulin, nitrogen and decomposers.
 * THE PRACTICAL is the YOGHURT one (Chuka's choice): set up in the You Do, read at the start of Lesson 6. Safety is in the You Do notes.
 * THE OPENING CLAIM changes from the unit plan's "without bacteria you would be dead within days" (checked: not true on that timescale) to
 * "life on Earth could not carry on without bacteria", which is defensible and still provokes an argument.
 */
const K = require('./prokaryotes-kit')({ lesson: 'The Bacteria We Need', subject: 'Y8 Science · Prokaryotes · Lesson 5 · 8I' });
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const U = DATA.useful;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Name the archaea that live where there is no oxygen and make methane.', 'Methanogens.'],
    ['A microbe with no nucleus lives in a hot spring. Explain why it might not be an archaean.', 'Bacteria, such as cyanobacteria, live in hot springs too. The place does not decide the group.'],
    ['Explain why the fossil record is incomplete.', 'Most dead organisms rot or are eaten. Few are buried fast enough to become fossils.'],
    ['Name two things a prokaryote has that your cells do not.', 'Any two of: a cell wall, plasmids, a flagellum.'],
    ['A recipe uses 2 spoonfuls of live yoghurt for 500 mL of milk. Calculate how many spoonfuls you need for 2 litres (2,000 mL).', `2,000 ÷ 500 = 4, and 4 × 2 = ${U.spoons_2l} spoonfuls`],
    ['Suggest one way that bacteria could be useful to people.', 'They make some foods, recycle dead plants and animals, and help to make medicines.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/Archaea And Extreme Places (Lesson 4, built in the same batch) and checked every question against the last three Do Nows in the class (Archaea And Extreme Places, The Bacteria, How Prokaryotes Live). Nothing repeats.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (methanogens; a hot spring does not mean an archaean). Q3 and Q4 are EARLIER (the fossil record, the evolution unit; the parts a prokaryote has that your cells do not, Lesson 1). Q5 is maths: scaling the yoghurt recipe you will use in the You Do. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: methanogens. Q2: cyanobacteria and other bacteria live in hot springs. Q3: most dead things rot or are eaten. Q4: a cell wall, plasmids or a flagellum. Q5: 2,000 ÷ 500 = 4, 4 × 2 = 8 spoonfuls. Q6: accept any: food, recycling, medicine. If a student says "none", say "wait for the lesson".\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Describe how bacteria recycle nutrients.', 'Describe how bacteria are used in food and medicine.', 'Explain what the bacteria in your gut do for you.'],
  banner: [['Life on Earth could not carry on without ', false], ['bacteria', true], ['. Most of them are ', false], ['helpful', true], [' or harmless.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'THE CLAIM TO ARGUE WITH. The unit plan opens this lesson with "without bacteria you would be dead within days, and so would every other living thing". I CHECKED IT, AND IT IS TOO STRONG: germ-free animals live in sterile conditions, and nobody dies of lost gut bacteria in days. What is true, and still provokes an argument, is that LIFE ON EARTH COULD NOT CARRY ON WITHOUT BACTERIA: over months and years the food chains, the soil and the oceans would fail. That is what the banner says. Say "the claim is on the screen, and you are going to argue with it for fifty minutes".\n\n'
    + 'WHERE THIS SITS. This is the surprising lesson of the unit: after Lessons 1 to 4 most students think "bacteria means germs". Today is the other side, and it goes first, because that is the order that changes minds. Disease is next lesson, and it gets a whole lesson of its own: do not dwell on it today.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'A pot of yoghurt, the lumps on a pea root, and a vial of insulin. What do all three have in common?',
  qSize: 21,
  picture: [{ key: 'bac_yoghurt', w: 1.30, h: 1.30, y: 0.72 }, { key: 'bac_nodules', w: 1.30, h: 1.30, y: 0.72 }, { key: 'bac_insulin', w: 1.30, h: 1.30, y: 0.72 }],
  opts: ['All three are made by animals.', 'Bacteria are behind all three.', 'All three are free of bacteria.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Point at the three photographs: a pot of yoghurt, the round lumps (nodules) on the roots of a plant of the pea family, and a vial of insulin (an old one, labelled with the name of a laboratory and from before human insulin was made by bacteria: insulin used to be taken from the pancreas of cattle and pigs). Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the lesson does, and you will point at the tally on the second I Do.\n\n'
    + 'ANSWER, FOR YOU: B. Yoghurt is milk fermented by bacteria. The nodules on pea roots are full of nitrogen-fixing bacteria that feed the plant. Human insulin is made by bacteria that carry the human insulin gene. (Insulin is also made in yeast today; do not raise it unless asked.)\n\n'
    + 'EXPECT MOST VOTES FOR A OR C. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: recycling and nitrogen (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Recycling: decomposers and nitrogen');
  const arrow = (x1, x2, y, name) => s.addShape(S.line, { x: x1, y, w: x2 - x1, h: 0, line: { color: C.accentInk, width: 2.5, endArrowType: 'triangle' }, objectName: name });
  // row A: the recycling loop
  const cw = 2.05, gap = 0.30, y0 = 1.84, ch = 1.88;
  const A = [['1', 'Plants take nutrients from the soil.'], ['2', 'Animals eat the plants.'], ['3', 'Plants and animals die.'], ['4', 'Decomposers break them down. The nutrients go back to the soil.']];
  A.forEach(([nn, txt], i) => {
    const x = M + i * (cw + gap);
    K.card(s, { x, y: y0, w: cw, h: ch, line: i === 3 ? C.alert : undefined, lineWidth: i === 3 ? 2.2 : 1.3, name: `rc${i}` });
    K.badge(s, { x: x + 0.16, y: y0 + 0.14, n: nn, name: `rc${i}` });
    s.addText(txt, { x: x + 0.14, y: y0 + 0.62, w: cw - 0.28, h: ch - 0.70, color: i === 3 ? C.alert : C.dark, fontFace: F.body, fontSize: 15, bold: true, valign: 'top', margin: 0, lineSpacing: 19, objectName: `rc${i}_t` });
    if (i < 3) arrow(x + cw + 0.02, x + cw + gap - 0.02, y0 + ch / 2, `rc${i}_arrow`);
  });
  K.pic(s, 'bac_decomp', M + 4 * (cw + gap) + 0.10, y0, ch, ch, 'rc_photo');
  // row B: nitrogen
  const y1 = y0 + ch + 0.18, cw2 = 2.55, gap2 = 0.30, ch2 = 1.90;
  const B = [['Air is 78% nitrogen gas. Plants cannot use it.', false], ['Nitrogen-fixing bacteria in root nodules change it into a form plants can use.', true], ['Plants use it to make protein. Animals eat the protein.', false]];
  B.forEach(([txt, hi], i) => {
    const x = M + i * (cw2 + gap2);
    K.card(s, { x, y: y1, w: cw2, h: ch2, line: hi ? C.alert : undefined, lineWidth: hi ? 2.2 : 1.3, name: `nt${i}` });
    s.addText(txt, { x: x + 0.18, y: y1, w: cw2 - 0.36, h: ch2, color: hi ? C.alert : C.dark, fontFace: F.body, fontSize: 15, bold: true, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `nt${i}_t` });
    if (i < 2) arrow(x + cw2 + 0.02, x + cw2 + gap2 - 0.02, y1 + ch2 / 2, `nt${i}_arrow`);
  });
  K.pic(s, 'bac_nodules', M + 4 * (cw + gap) + 0.10, y1, ch2, ch2, 'nt_photo');
  K.sentence(s, [['Without ', false], ['decomposers', true], [', dead things would stay dead and the nutrients would never return to the soil.', false]], { y: y1 + ch2 + 0.14, h: 0.62, size: 15.5, name: 'rec_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the recycling loop, its photograph, the nitrogen chain, its photograph, then the banner.\n\n'
    + 'OBJECTIVE 1. HOW BACTERIA RECYCLE NUTRIENTS, in two examples. (1) DECOMPOSERS. The loop: plants take nutrients from the soil, animals eat the plants, plants and animals die, and DECOMPOSERS break the dead material down and return the nutrients (nitrogen, phosphorus, and carbon as carbon dioxide) to the soil and the air. The new word is DECOMPOSER. They are BACTERIA AND FUNGI: fungi matter a great deal in a forest, especially for wood, so do not say "the nutrient cycle is bacterial". WITHOUT THEM, DEAD THINGS WOULD PILE UP AND NOTHING WOULD GROW: say the banner. The photograph is a rotting log with the bracket fungi and the damp wood where decomposers are at work. (2) NITROGEN FIXATION. About 78 percent of the air is nitrogen gas, but plants cannot use it. Bacteria in the root nodules of peas, beans and clover (the genus is Rhizobium; you can say it, and it is not for the test) change nitrogen gas into ammonium, a form the plant can use. The plant uses it to make protein, and animals eat the protein. Free-living bacteria and cyanobacteria fix nitrogen too. No nitrogen-fixing bacteria, no protein, no food chain.\n\n'
    + 'THE WORKED EXAMPLE IS THE BANNER: say it as "a leaf falls: decomposers feed on it, and the nutrients go back to the soil". The We Do uses the same chain.\n\n'
    + 'ONE TIMESCALE POINT, IF ASKED "WOULD WE REALLY DIE WITHOUT BACTERIA?": not in days. Over weeks the ocean\'s tiny photosynthesisers (many are cyanobacteria) would fall away; over months, dead material and waste would build up; over seasons and years, the soil would run short of usable nitrogen. That is why "life could not carry on".'
  );
}

/* ================================================================== *
 * 5. I DO · 3: food, medicine and your gut (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Food, medicine and your gut');
  const vw = 5.95, vh = vw * 540 / 960, y0 = 1.84;
  K.video(s, 'prok-insulin', M, y0, vw, vh, 'vid_insulin');
  K.sentence(s, [['Bacteria with the human ', false], ['insulin gene', true], [' on a ', false], ['plasmid', true], [' make human insulin.', false]], { x: M, y: y0 + vh + 0.14, w: vw, h: 0.78, size: 15, name: 'ins_banner' });
  const RX = M + vw + 0.24, RW = RIGHT - RX;
  const fh = 2.62;
  K.card(s, { x: RX, y: y0, w: RW, h: fh, name: 'food' });
  K.kicker(s, 'FOOD', RX + 0.20, y0 + 0.08, RW - 0.4, 'food_h', { size: 13.5 });
  const ps = 1.20;
  ['bac_yoghurt', 'bac_cheese', 'bac_kimchi'].forEach((k, i) => K.pic(s, k, RX + 0.20 + i * (ps + 0.18), y0 + 0.44, ps, ps, `food_p${i}`));
  s.addText([
    { text: 'With bacteria: ', options: { bold: true, color: C.accentInk } }, { text: 'yoghurt, most cheeses, fermented pickles such as kimchi.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'With yeast, a fungus: ', options: { bold: true, color: C.accentInk } }, { text: 'bread.' },
  ], { x: RX + 0.20, y: y0 + 1.72, w: RW - 0.4, h: fh - 1.78, color: C.ink, fontFace: F.body, fontSize: 14, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'food_t' });
  const gy = y0 + fh + 0.14, gh = vh + 0.14 + 0.78 - fh - 0.14;
  K.card(s, { x: RX, y: gy, w: RW, h: gh, fill: K.ANS, line: C.accentInk, lineWidth: 1.5, name: 'gut' });
  K.kicker(s, 'YOUR GUT', RX + 0.20, gy + 0.08, RW - 0.4, 'gut_h', { size: 13.5 });
  s.addText([
    { text: 'About 38 trillion bacterial cells: about as many as your own cells (30 trillion). Most are in your large intestine.', options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'They help break down fibre and make vitamin K.', options: { bold: true, color: C.alert } },
  ], { x: RX + 0.20, y: gy + 0.44, w: RW - 0.4, h: gh - 0.5, color: C.ink, fontFace: F.body, fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 17, objectName: 'gut_t' });
  K.sentence(s, [['Bacteria that help us are ', false], ['much more common', true], [' than bacteria that harm us.', false]], { y: y0 + vh + 0.14 + 0.78 + 0.14, h: 0.56, size: 15.5, name: 'help_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the animation (ON CLICK, so say the idea first), the food card, the gut card, then the two banners. POINT AT THE HOOK TALLY: the answer was B, bacteria are behind all three.\n\n'
    + 'OBJECTIVES 2 AND 3. FOOD, MEDICINE AND YOUR GUT. (1) MEDICINE: INSULIN. People with diabetes need insulin. Insulin is a protein made from the instructions in the human insulin GENE. THE ANIMATION (about 33 seconds, you can click it to play again) shows it in six steps, and the We Do uses them: cut the human gene out; put it into a PLASMID (the part they met in Lesson 1 without knowing what it was for); put the plasmid into a bacterium; the bacterium follows the instructions and makes human insulin; it divides every 20 minutes, so there are soon billions of them, in a tank; the insulin is collected, cleaned and put in a pen or vial. THE FIRST TIME THIS WAS DONE: scientists put the human insulin genes into a plasmid in E. coli in 1978, and the first insulin made this way, Humulin, was approved for patients in 1982. Today bacteria or yeast carrying the human gene make insulin; do not go into it. THE GENE GOES IN ON A PLASMID, NOT INTO A NUCLEUS (the bacterium has none): it is a good check on Lesson 1. (2) FOOD. Yoghurt is milk fermented by bacteria: they turn the milk sugar (lactose) into lactic acid, which makes the milk set and taste sour. Most cheeses start with bacteria; sauerkraut and kimchi are fermented by bacteria. BREAD IS NOT BACTERIAL: it rises because of yeast, a fungus. Soy sauce and sourdough use both. THE YOGHURT YOU ARE ABOUT TO MAKE IS THE PRACTICAL. (3) YOUR GUT. There are about 38 trillion bacterial cells in a typical adult and about 30 trillion human cells: about 1.3 to 1, so about as many. THE OLD "TEN TO ONE" IS WRONG (it is still in some textbooks): say so if a student has seen it. Most live in the large intestine. Some help to break down fibre that you cannot digest on your own; some make vitamin K and some B vitamins. Scientists are not sure exactly how much that adds to what you need, so say "help".\n\n'
    + 'THE SECOND BANNER SETS UP LESSON 6: only a small fraction of bacteria cause disease in people (about 540 species are known pathogens). The ones that harm us are the ones we hear about.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Finish It Off
 * ================================================================== */
K.weDoFIO({
  heading: 'Finish this', subtitle: 'Fill in the blanks. Say each one out loud, and say why.',
  rows: [
    ['Insulin: how bacteria are made to produce it.', 'Cut out the human ____ gene. Put it into a ____. Put that into a ____. The bacteria divide and make human ____.', ['insulin', 'plasmid', 'bacterium', 'insulin']],
    ['Nitrogen: how bacteria feed plants.', 'Air is mostly ____ gas, which plants cannot use. Bacteria in root ____ change it into a form they can use. The plant then makes ____.', ['nitrogen', 'nodules', 'protein']],
    ['Decomposers: what happens to a dead leaf.', '____ feed on the leaf and break it down. They release ____ into the soil. A new plant takes them up, so the nutrients are ____, not lost.', ['Decomposers', 'nutrients', 'recycled']],
  ],
  rowH: 1.42,
  notes:
    'WE DO. 5 minutes. Three clicks. THE MODE IS "FINISH IT OFF" (TEMPLATE.md): three partly worked chains, and they fill in the blanks. The last We Do was Rank And Conquer, so the mode changes. A chain of steps suits it. EVERY BLANK GETS A FOLLOW-UP THAT NEEDS THINKING, because single words would read as a word game.\n\n'
    + 'THEY SAY THE MISSING WORDS OUT LOUD BEFORE EACH REVEAL, then you ask the follow-up. ROW 1 (INSULIN): "why a PLASMID?" (it is a small loop that bacteria can take in and copy: when the bacterium divides, the plasmid is copied, so every new cell has the gene); "why does the bacterium make HUMAN insulin?" (it follows the instructions of the gene it was given: a bacterium has no insulin gene of its own); "why does it matter that they divide every 20 minutes?" (billions of insulin-makers from one). ROW 2 (NITROGEN): "which gas is 78 percent of the air?" (nitrogen); "why can a plant not just use it?" (the nitrogen atoms in the gas are held together too tightly; plants need them in a different form); "what is the nitrogen used for?" (protein, which animals eat). ROW 3 (DECOMPOSERS): "why DO the nutrients go back?" (the bacteria and fungi release them as they break down dead material); "what would happen with no decomposers?" (dead things pile up, nutrients stay locked in them, and new plants would run short).\n\n'
    + 'IF THEY ARE QUICK, ask "which of the three jobs is the most important?" and make them argue it: there is no single right answer, and every one of them is a link in the same chain. IF SHORT OF TIME, do rows 1 and 3.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Describe how decomposers recycle nutrients.', 'They break down dead plants and animals and release the nutrients into the soil.'],
    ['Explain why plants need nitrogen-fixing bacteria.', 'Plants cannot use nitrogen gas. The bacteria change it into a form they can use.'],
    ['Name two foods that are made with bacteria.', 'Any two of: yoghurt, cheese, sauerkraut, kimchi.'],
    ['Explain how bacteria are made to produce human insulin.', 'The human insulin gene is put into a plasmid, and the plasmid into a bacterium, which then makes insulin.'],
    ['State what a thermophile is.', 'A heat-loving microbe, one that lives in very hot places such as hot springs.'],
    ['Name the three shapes of bacteria.', 'Coccus, bacillus and spirillum.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (thermophiles, Lesson 4) and Q6 (the three shapes, Lesson 3).\n\n'
    + 'Q1 IS OBJECTIVE 1 (decomposers): listen for nutrients going back to the soil. Q2 IS OBJECTIVE 1 (nitrogen): plants cannot use nitrogen gas. Q3 AND Q4 ARE OBJECTIVE 2: two foods (not bread); the plasmid. Objective 3 (the gut) is in the Mark checklist and the worksheet: if a student asks, say "about as many bacterial cells as human cells". If a student answers Q3 with "bread", ask "what makes bread rise?" (yeast, a fungus).\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "what does a gut bacterium do for you?" (breaks down fibre; makes vitamin K). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Match it', 'Say what each kind of helpful bacteria does. Put the insulin steps in order.'],
    ['SILVER', 'Explain it', 'Explain what would happen with no decomposers, and why a plasmid is used.'],
    ['GOLD', 'Work it out', 'Numbers from the gut and the yoghurt, and a claim to argue with.'],
  ],
  note: 'First, your group sets up the yoghurt flask. Wash your hands. No tasting. Then choose a tier.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark. Four clicks: the three tiers, then the note. THE FIRST PART IS THE PRACTICAL (the yoghurt, about 5 minutes, one flask per group of four), and the worksheet is the rest of the time.\n\n'
    + 'THE PRACTICAL: MAKE YOGHURT, SET UP NOW AND READ AT THE START OF LESSON 6. (You chose yoghurt over agar plates: no biosafety overhead.) KIT PER GROUP: a clean flask or beaker with a lid or cover, a 500 mL measure of UHT full-fat milk (UHT is sterile; optionally add 2 tablespoons of skimmed milk powder per 500 mL for a firmer set), 1 to 2 spoonfuls of PLAIN LIVE yoghurt from a freshly opened pot (no sugar or fruit, no preservatives; the label must say "live"), a thermometer, a clean spoon, a label, and pH paper or universal indicator paper. METHOD: (1) Wash hands. Wear safety glasses. (2) Use clean containers and spoons. (3) Warm the milk to 40 to 43 °C in a water bath, checking with a thermometer. If it is above 45 °C, wait: hot milk kills the bacteria. (4) Stir in the live yoghurt (1 to 2 spoonfuls for each 500 mL). (5) Test the pH of the milk with pH paper and write it on the worksheet (about 6.6 to 6.7). (6) Cover and label it. (7) Keep it at 40 to 43 °C for 9 to 24 hours (an incubator or a water bath; a pre-warmed vacuum flask often holds it for 8 to 12 hours but varies: ask the technician to trial one first). It sets when the bacteria turn the milk sugar into lactic acid. Next lesson: look, waft to smell (do not put your nose over the flask), and test the pH again (about 4.3 to 4.6).\n\n'
    + 'SAFETY, IN THE NOTES AND NOT TO BE LEFT OUT: NO TASTING in a laboratory. Eye protection. Wash hands before and after. Pour away or dispose of the culture as microbiological waste (disinfectant, or autoclave through the technician), never down a sink without disinfecting. The recipe follows the Microbiology Society and UKHSA e-Bug school guidance; please check it against your CLEAPSS guidance (MRAT-135, the microorganisms used in food preparation) and with your technician: I could not read CLEAPSS first-hand. An agar-plate version is possible, but it needs more safety care: tape with two short strips on opposite sides, incubate at 20 to 25 °C and never above 30 °C, and nobody opens a plate. Yoghurt avoids all that.\n\n'
    + 'THEN THE WORKSHEET. THEY CHOOSE A TIER, and the choice is deliberate. Bronze is matching each kind of helpful bacteria to its job, and the insulin steps in order (aim for about four right out of five). Silver is explaining what would happen with no decomposers, and why a plasmid is used. Gold is numbers from the gut and the yoghurt, and a claim to argue with. EVERY TIER HAS A WORKED EXAMPLE AND A HALF-WORKED ONE, and the questions are mixed on purpose. The worksheet\'s last page has a small table to record the milk pH now and the yoghurt next lesson.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what job does it do for us?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'Decomposers (bacteria and fungi) break down dead things and return nutrients to the soil.',
    'Nitrogen-fixing bacteria in root nodules change nitrogen gas into a form plants can use.',
    'Yoghurt, most cheeses and fermented pickles are made with bacteria. Bread is made with yeast.',
    'Bacteria with the human insulin gene on a plasmid make human insulin.',
    'Your gut holds about as many bacterial cells as you have human cells. They help break down fibre and make vitamin K.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The numbers: 38 ÷ 30 = 1.3, 6.7 − 4.3 = 2.4, and 12 spoonfuls for 3 litres (checked in build/prokaryotes-check.py). The explanations (Q6 to Q9 and Q14) have a list of points in the answers: mark each point.\n\n'
    + 'WALK ROUND for the three commonest mistakes: bread listed as a food made with bacteria; the insulin steps out of order; and "all bacteria are germs" still on the page.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Bacteria and fungi are decomposers.', 'TRUE'],
    ['Plants can use the nitrogen gas in the air directly.', 'FALSE'],
    ['Bread rises because of bacteria.', 'FALSE'],
    ['A person has about ten times as many bacterial cells as human cells.', 'FALSE'],
    ['A farmer grows peas, and the soil gets richer in nitrogen. Bacteria in the root nodules could explain this.', 'TRUE'],
  ],
  closing: 'Next lesson: pathogens and antibiotics. Read your yoghurt, and find out how bacteria become resistant.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: plants cannot use nitrogen gas; bacteria change it. Q3: bread is made with yeast, a fungus; yoghurt is the bacterial food. Q4: the old "ten to one" is wrong; careful counts give about 38 trillion bacterial cells and 30 trillion human cells, roughly 1.3 to 1. Q5 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): peas have nitrogen-fixing bacteria in their root nodules, so some nitrogen stays in the soil. Ask "how do you know?". Q1 is TRUE (objective 1).\n\n'
    + 'THE CLOSING LINE POINTS FORWARD: Lesson 6 starts by reading the yoghurt, then it is pathogens and antibiotics, and it closes the unit. The Do Now will be a natural selection retrieval, so the mechanism is in the room before resistance is named. Ask on the way out: "if most bacteria are helpful, what happens to the ones that are not?"',
});

K.write();

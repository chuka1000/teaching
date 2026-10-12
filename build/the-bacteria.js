/**
 * Y8 Science, Prokaryotes, Lesson 3: The Bacteria. Class 8I. Single, 50 minutes. Culture palette, carried on from the unit.
 *
 * PREVIOUS: How Prokaryotes Live (built in the same batch, out/How Prokaryotes Live). 50 minutes, ten slides. It taught the five characteristics, binary fission
 * (the new word) and the doubling calculation, and its plenary promised "next lesson: the bacteria, their shapes, and how they get their energy". The unit plan
 * says THE DO NOW IS A DOUBLING CALCULATION (it needs spacing and this is the gap), so Q1 is one, with a new number (every 15 minutes).
 *
 * THE LAST THREE 8I DO NOWS (How Prokaryotes Live, Inside A Prokaryote, Deep Time) were read: nothing here repeats.
 * WE DO: SPOT THE MISTAKE (the last We Do was Finish It Off), with one row already correct. Objectives 2 and 3 are taught together on I Do 2, because the
 * major groups ARE the ways bacteria get their energy. No Latin names beyond the three shape words. Photographs and facts: see the notes.
 */
const K = require('./prokaryotes-kit')({ lesson: 'The Bacteria', subject: 'Y8 Science · Prokaryotes · Lesson 3 · 8I' });
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const Z = DATA.shapes, UM = DATA.size.um_per_mm;
const n = (x) => x.toLocaleString('en-GB');

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    [`A bacterium divides every ${Z.q1.gen} minutes. Calculate how many bacteria there are after 2 hours.`, `2 × 60 = ${Z.q1.minutes} minutes. ${Z.q1.minutes} ÷ ${Z.q1.gen} = ${Z.q1.divisions} divisions, and 2^${Z.q1.divisions} = ${Z.q1.cells} bacteria`],
    ['State why a population of bacteria cannot keep doubling for ever.', 'Food and space run out, so the cells stop dividing and many die.'],
    ['Name the part of a prokaryote that is a tail which spins and pushes the cell along.', 'The flagellum.'],
    ['Describe one way scientists use DNA to show that two species are related.', 'They compare the DNA. The more of it that matches, the more closely the species are related.'],
    [`A spiral bacterium is ${Z.spiral_um} µm long. Calculate how many fit end to end across 1 mm (${n(UM)} µm).`, `${n(UM)} ÷ ${Z.spiral_um} = ${Z.spiral_across} bacteria`],
    ['Suggest where a bacterium that lives deep in the ocean, in the dark, gets its energy.', 'Not from light. It can use the energy in chemicals around it.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/How Prokaryotes Live (Lesson 2, built in the same batch) and checked every question against the last three Do Nows in the class (How Prokaryotes Live, Inside A Prokaryote, Deep Time). Nothing repeats. Q1 is the doubling calculation the unit plan asked for: it needs spacing, and this is the gap. The number is new (every 15 minutes) so it cannot be recalled, only worked.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (the doubling sum; why it cannot go on for ever). Q3 and Q4 are EARLIER (the flagellum, Lesson 1; DNA as evidence, the evolution unit). Q5 is maths: the unit conversion again, with a spiral bacterium. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: 2 × 60 = 120 minutes, 120 ÷ 15 = 8 divisions, 2^8 = 256. If a student writes 8 × 2 = 16, ask them to draw 1, 2, 4, 8. Q2: food and space run out. Q3: the flagellum. Q4: they compare DNA letters (the more that match, the closer the relationship). Q5: 1,000 ÷ 8 = 125. Q6: the real answer is in I Do 2 (chemosynthesis). Accept "from the food that drifts down" and say we test that today.\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Describe the three shapes of bacterial cell.', 'Describe the major groups of bacteria.', 'Explain how bacteria get their energy.'],
  banner: [['Bacteria come in three ', false], ['shapes', true], [', and they fall into four groups by how they get their ', false], ['energy', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'WHERE THIS SITS. Lessons 1 and 2 were prokaryotes in general. Today is the bacteria, one of the two kinds of prokaryote (the other, the archaea, is Lesson 4). It is the spine of the back half of the unit: each of the four groups on the second I Do is the start of a later lesson (the chemosynthetic ones are in Lesson 4, the decomposers in Lesson 5, the parasites in Lesson 6).\n\n'
    + 'OBJECTIVES 2 AND 3 ARE TAUGHT TOGETHER on the second I Do: the major groups of bacteria are the four ways they get their energy. Read the banner and move on.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'Giant tube worms live 2 km down in the dark. They have no mouth and no gut. How do they get their food?',
  qSize: 21,
  picture: { key: 'bac_vent', w: 1.75, h: 1.75, y: 0.60 },
  opts: ['They catch tiny animals that drift past.', 'Bacteria inside them make food for them.', 'They absorb sunlight through their skin.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question, and let the photograph do some of the work: those red-tipped tubes are a giant tube worm colony at a hydrothermal vent on the sea floor, in total darkness. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the second I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. An adult giant tube worm (Riftia) has no mouth, no gut and no anus. A special organ inside it, the trophosome, is packed with billions of chemosynthetic bacteria. The bacteria use the energy in hydrogen sulfide from the vent to make food, and the worm lives on it. The worms\' red tips carry the sulfide to the bacteria. Say "adult": the young larvae do have a gut, which they lose when the bacteria move in.\n\n'
    + 'EXPECT MOST VOTES FOR A OR C. C is the interesting wrong answer: no sunlight reaches 2 km down, so light cannot be the energy. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: the three shapes (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'The three shapes of bacteria');
  const SHAPES = [
    ['coccus', 'plural: cocci', 'a sphere', 'bac_cocci', 'shape_coccus'],
    ['bacillus', 'plural: bacilli', 'a rod', 'bac_bacilli', 'shape_bacillus'],
    ['spirillum', 'plural: spirilla', 'a spiral', 'bac_spirilla', 'shape_spirillum'],
  ];
  const g = 0.28, cw = (CW - 2 * g) / 3, y0 = 1.86, ch = 4.50;
  SHAPES.forEach(([word, plural, meaning, photo, drawing], i) => {
    const x = M + i * (cw + g);
    K.card(s, { x, y: y0, w: cw, h: ch, line: C.accentInk, lineWidth: 1.8, name: `sh${i}` });
    K.pic(s, photo, x + 0.18, y0 + 0.18, 2.06, 2.06, `sh${i}_photo`);
    s.addImage({ path: require('path').join(__dirname, '..', 'assets', 'pictures', `${drawing}.png`), x: x + 2.30, y: y0 + 0.62, w: cw - 2.48, h: (cw - 2.48) * 2 / 3, objectName: `sh${i}_draw` });
    s.addText(word, { x: x + 0.18, y: y0 + 2.40, w: cw - 0.36, h: 0.80, color: C.dark, fontFace: F.title, fontSize: 38, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `sh${i}_word` });
    s.addText(plural, { x: x + 0.18, y: y0 + 3.18, w: cw - 0.36, h: 0.42, color: C.accentInk, fontFace: F.body, fontSize: 18, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `sh${i}_pl` });
    s.addText(meaning, { x: x + 0.18, y: y0 + 3.66, w: cw - 0.36, h: 0.60, color: C.ink, fontFace: F.body, fontSize: 21, align: 'center', valign: 'middle', margin: 0, objectName: `sh${i}_mean` });
  });
  K.sentence(s, [['A rod-shaped bacterium is a ', false], ['bacillus', true], ['. Two or more are ', false], ['bacilli', true], ['.', false]], { y: y0 + ch + 0.16, h: 0.62, size: 17, name: 'shape_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the three shapes, one per click, then the banner.\n\n'
    + 'OBJECTIVE 1. BACTERIA COME IN THREE BASIC SHAPES, and the shape is THE ONE FEATURE A SCHOOL MICROSCOPE DOES SHOW (you saw in Lesson 1 that it shows nothing inside). Each card has a light micrograph, a drawing of one cell, the word, its plural and its meaning. (1) COCCUS: a sphere (plural cocci). (2) BACILLUS: a rod (plural bacilli). (3) SPIRILLUM: a spiral (plural spirilla). WRITE THE PLURALS UP: they will meet them in the assessment. Say each word twice, and ask the room to say it. Saying the plurals: cocci is "kok-sigh", bacilli is "ba-sil-eye", spirilla is "spy-ril-a".\n\n'
    + 'THE WORKED EXAMPLE IS THE BANNER: a rod is a bacillus; more than one are bacilli. NAMING FROM THE PICTURE is the skill; the plural is the extra step.\n\n'
    + 'AN ASIDE, NOT FOR THE TEST: cocci often stay joined after dividing, in chains (Streptococcus) or clusters (Staphylococcus). Say it once if a student notices the chains in the micrograph, and do not name the species on a slide. A SECOND ASIDE: some bacteria are curved rods (a "comma", the vibrio shape). Today there are three shapes, and curved rods count as a kind of spiral for now. Note: the shape word "bacillus" is not the same as a genus called Bacillus. Do not go into it.\n\n'
    + 'MISCONCEPTIONS. (1) "Bacteria are all round": most people picture a dot. Rods are very common (E. coli is a rod). IF A STUDENT ASKS "WHY DO THEY HAVE DIFFERENT SHAPES?": the honest answer is that shape helps with moving, feeding and sticking to surfaces, and scientists are still working out the details.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: the four groups (objectives 2 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Four groups, by how they get energy');
  const GROUPS = [
    ['Photosynthetic', 'make their own food using light', 'Cyanobacteria. They made oxygen billions of years before plants.', 'bac_cyano', ''],
    ['Decomposers', 'feed on dead plants and animals', 'They break dead material down.', 'bac_decomp', 'Lesson 5'],
    ['Parasites', 'feed on a living host and harm it', 'The host is a plant or an animal.', 'bac_pathogen', 'Lesson 6'],
    ['Chemosynthetic', 'make food using energy from chemicals', 'No light needed. Some live inside tube worms.', 'bac_vent', 'Lesson 4'],
  ];
  const gx = 0.26, gy = 0.14, cw = (CW - gx) / 2, ch = 2.12, y0 = 1.84;
  GROUPS.forEach(([name, how, ex, photo, later], i) => {
    const x = M + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy);
    K.card(s, { x, y, w: cw, h: ch, name: `g${i}` });
    K.pic(s, photo, x + 0.16, y + 0.16, 1.80, 1.80, `g${i}_photo`);
    s.addText([
      { text: name, options: { bold: true, fontSize: 20, color: C.dark, breakLine: true, fontFace: F.title } },
      { text: how, options: { bold: true, fontSize: 14.5, color: C.accentInk, breakLine: true } },
      { text: ex, options: { fontSize: 13, color: C.inkSoft } },
    ], { x: x + 2.10, y: y + 0.10, w: cw - 2.26, h: ch - 0.20, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 17, paraSpaceAfter: 3, objectName: `g${i}_t` });
    if (later) s.addText(`${later}`, { shape: S.roundRect, rectRadius: 0.08, x: x + cw - 1.22, y: y + ch - 0.42, w: 1.08, h: 0.30, fill: { color: C.accent }, line: { color: C.accentInk, width: 1 }, color: C.dark, fontFace: F.body, fontSize: 11, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `g${i}_later` });
  });
  K.sentence(s, [['A bacterium living in a dead log and feeding on it is a ', false], ['decomposer', true], ['.', false]], { y: y0 + 2 * ch + gy + 0.14, h: 0.58, size: 16, name: 'grp_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: one group each, then the banner. POINT AT THE HOOK TALLY on the fourth.\n\n'
    + 'THE FOUR PHOTOGRAPHS: cyanobacteria under a fluorescence microscope (the pink and red are false colour, from the glow of their pigments); dead leaves rotting on the ground (decomposers are bacteria and fungi, and the leaves are being broken down); MRSA bacteria, a kind of coccus that can infect people, in a false-colour electron micrograph; and a colony of tube worms at a deep-sea vent.\n\n'
    + 'OBJECTIVES 2 AND 3. THE MAJOR GROUPS OF BACTERIA ARE THE WAYS THEY GET THEIR ENERGY. This is the more scientific classification, and the one the objective asks for: how an organism feeds says a great deal about where it lives and what it does. Four groups, and each is the start of a later lesson (the labels say which).\n\n'
    + '(1) PHOTOSYNTHETIC: make their own food using light, as plants do. The group to know is the CYANOBACTERIA. They make oxygen as a waste product, and they were doing it billions of years before the first plants or animals. About 2.4 billion years ago the oxygen they made began to build up in the air. WHAT NOT TO SAY: "before anything else was alive" (the unit plan\'s words, which are wrong: other bacteria lived first). Cyanobacteria are among the oldest living things, and tiny photosynthesising organisms in the ocean, including cyanobacteria, make about half of the oxygen produced by photosynthesis. (2) DECOMPOSERS: feed on dead plants and animals and break them down. Bacteria and fungi both do it. This is the hook for Lesson 5. (3) PARASITES: feed on a living host and harm it. Only a small fraction of bacteria are parasites that cause disease in people. This is the hook for Lesson 6. (4) CHEMOSYNTHETIC: make their own food using the energy in chemicals, such as hydrogen sulfide, instead of light. No light needed. SETTLE THE HOOK: the bacteria inside the giant tube worm are chemosynthetic. They live at deep-sea vents, where the water that comes out can be hotter than 350 °C, and the worms live where it mixes with cold sea water. Lesson 4 meets other microbes in extreme places.\n\n'
    + 'THE WORKED EXAMPLE IS THE BANNER: decide the group from the energy source. A bacterium that lives in a dead log and feeds on it is a decomposer. Then ask: "and one that makes food using light?" (photosynthetic).\n\n'
    + 'THE KEY WORDS ARE ON THE WORKSHEET (Q3 is the table). MISCONCEPTIONS. (1) "All bacteria are parasites, or germs": parasites are one of four groups, and a small one. (2) "Cyanobacteria are algae or plants": they are bacteria; the old name "blue-green algae" is where the idea came from. (3) "Chemosynthetic means they eat chemicals": they use the ENERGY in chemicals to make their own food.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Spot The Mistake
 * ================================================================== */
K.weDoSTM({
  rows: [
    ['All bacteria are spheres.', 'WRONG', 'There are three shapes: spheres (cocci), rods (bacilli) and spirals (spirilla).'],
    ['A rod-shaped bacterium is called a bacillus.', 'RIGHT', 'Rods are bacilli, and one is a bacillus.'],
    ['Cyanobacteria feed on dead plants and animals.', 'WRONG', 'They make their own food from light, by photosynthesis. Decomposers feed on dead things.'],
    ['A bacterium deep in the ocean, in the dark, must feed on other living things.', 'WRONG', 'Chemosynthetic bacteria make food from the energy in chemicals. They do not need light or a host.'],
  ],
  notes:
    'WE DO. 5 minutes. Four clicks, one per row: each reveals RIGHT or WRONG and the correction together. THE MODE IS SPOT THE MISTAKE (TEMPLATE.md); the last We Do was Finish It Off. ONE ROW IS ALREADY RIGHT (row 2), so the task is to check, not to hunt for a flaw: a student who says "this one is fine" has done better work than one who invents an error.\n\n'
    + 'FOR EACH ROW: read it, hands up for "right" and then for "wrong", THEN click. For a wrong one, ask "what did the person who wrote it think?" Naming the error is what stops it coming back. THEY NEED A REASON, NOT JUST A VERDICT: for each WRONG row, ask "what would make it right?".\n\n'
    + 'ROW 1: the thinking is "bacteria are dots". The cocci are spheres, but there are three shapes (use the micrographs from the first I Do if you need them). ROW 2 IS RIGHT: ask a student to say the plural (bacilli). ROW 3 mixes up photosynthetic and decomposer: a cyanobacterium makes its own food from light, and a decomposer feeds on dead things. ROW 4 MIXES UP DEPTH AND FEEDING: the thinking is "no light, so it must eat something". Chemosynthetic bacteria do not need a host or a meal; they use the energy in chemicals. That is the hook again.\n\n'
    + 'IF THEY ARE QUICK, ask "which group is a bacterium that lives in your gut and feeds on the food you eat?" (it feeds on material, not on a living cell of yours: that is the Lesson 5 question). IF SHORT OF TIME, do rows 1, 2 and 4.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Name the three shapes of bacteria.', 'Coccus (sphere), bacillus (rod), spirillum (spiral).'],
    ['State the shape of a bacillus, and what more than one are called.', 'A rod. Bacilli.'],
    ['Name the four groups of bacteria, by how they get energy.', 'Photosynthetic, decomposers, parasites and chemosynthetic.'],
    ['Explain what a decomposer does.', 'It feeds on dead plants and animals and breaks them down.'],
    ['Explain why a bacterium that divides every 20 minutes does not fill the whole Earth.', 'Food and space run out, so the cells stop dividing and many die.'],
    ['Define a prokaryote.', 'An organism whose cell has no nucleus. Its DNA is loose in the cytoplasm.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (why bacteria do not take over the Earth, Lesson 2) and Q6 (the definition of a prokaryote, Lesson 1).\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1: listen for the plural (cocci, bacilli, spirilla); a student who says "bacillis" has not got it. Q3 IS OBJECTIVE 2: all four. Q4 IS OBJECTIVE 3 for one group: they feed on dead material and break it down. If a student says "they eat dead things", say "yes: and what do they give back?" (a hook for Lesson 5). Q5: food and space. Q6: no nucleus, DNA loose.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "how does a cyanobacterium get its energy?" (light) and "what does it give out?" (oxygen). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Name it', 'Name the shapes. Say what each group of bacteria does. Sort the descriptions.'],
    ['SILVER', 'Explain it', 'Compare two groups. Explain why light is not needed deep in the ocean. Check a claim.'],
    ['GOLD', 'Work it out', 'Sizes and growth in numbers, and what cyanobacteria did to the air.'],
  ],
  note: 'Choose a tier. Read the worked example first. The questions are mixed on purpose.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark. Four clicks: the three tiers, then the note.\n\n'
    + 'THEY CHOOSE A TIER, and the choice is deliberate. Bronze is naming the shapes, the four groups and sorting descriptions (aim for about four right out of five). Silver is comparing two groups, a "why does that step work?" and checking a claim. Gold is numbers (sizes in a row across 1 mm, growth rates) and an explanation of what cyanobacteria changed. EVERY TIER HAS A WORKED EXAMPLE TO READ AND A HALF-WORKED ONE TO FINISH, and the questions are mixed on purpose. Say so; it looks like a mistake otherwise.\n\n'
    + 'THE WORKSHEET IS ON GOOGLE CLASSROOM, and the answers are UPSIDE DOWN on the last page. The drawings on the worksheet are the same cells as on the slides.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "what is its energy source: light, dead material, a living host, or chemicals?" That is the whole classification. If Bronze is producing lots of errors, the problem is the I Do: go back to the four energy sources. AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'Three shapes: coccus (sphere, cocci), bacillus (rod, bacilli), spirillum (spiral, spirilla).',
    'Four groups by how they get energy: photosynthetic, decomposers, parasites, chemosynthetic.',
    'Photosynthetic and chemosynthetic bacteria make their own food. Decomposers and parasites feed on other things.',
    'Chemosynthetic bacteria use energy from chemicals, so they need no light.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The numbers: 1,000 ÷ 1 = 1,000, 180 ÷ 15 = 12 divisions and 2^12 = 4,096, and 2^10 = 1,024 (checked in build/prokaryotes-check.py). The explanations (Q6 to Q9 and Q14) have a list of points in the answers: mark each point.\n\n'
    + 'WALK ROUND for the three commonest mistakes: "bacillus" given as the plural (it is the singular); decomposer and parasite swapped (dead material against a living host); and "chemosynthetic bacteria eat chemicals".',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Rod-shaped bacteria are called bacilli.', 'TRUE'],
    ['All bacteria are parasites that make you ill.', 'FALSE'],
    ['Cyanobacteria feed on dead plants and animals.', 'FALSE'],
    ['A bacterium that needs no light and no host could use the energy in chemicals.', 'TRUE'],
    ['Cyanobacteria use photosynthesis, like plants, so they are plants.', 'FALSE'],
  ],
  closing: 'Next lesson: archaea, and the extreme places where they live.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: parasites are one small group of four (and the other lessons in this unit are about bacteria that help us). Q3: cyanobacteria make their own food from light; decomposers are the ones that feed on dead things. Q5: cyanobacteria carry out photosynthesis like plants, but they are bacteria with no nucleus, not plants. Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): ask "which group?" (chemosynthetic) and "how do you know?" (no light, no host). Q1 is TRUE (objective 1).\n\n'
    + 'THE CLOSING LINE POINTS FORWARD: Lesson 4 is the archaea. They look like bacteria under a school microscope and they are a different kind of prokaryote; many live in extreme places. Ask on the way out: "what could be so different that you could not tell from a photograph?"',
});

K.write();

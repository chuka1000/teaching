/**
 * Y8 Science, Prokaryotes, Lesson 4: Archaea And Extreme Places. Class 8I. Single, 50 minutes. Culture palette, carried on from the unit.
 *
 * PREVIOUS: The Bacteria (built in the same batch, out/The Bacteria). 50 minutes, ten slides. It taught the three shapes and the four groups by how they get energy
 * (photosynthetic, decomposers, parasites, chemosynthetic), and its plenary promised "next lesson: archaea, and the extreme places where they live". The
 * chemosynthetic bacteria at deep-sea vents were its hook for this lesson.
 *
 * THE LAST THREE 8I DO NOWS (The Bacteria, How Prokaryotes Live, Inside A Prokaryote) were read: nothing here repeats.
 * WE DO: RANK AND CONQUER (the last We Do was Spot The Mistake). You Do: the SORTER game (bacterium / archaean / neither), with the worksheet as the fallback.
 * Objectives 1 and 3 are taught together on I Do 1 (what archaea are, and how they differ from bacteria); objective 2 (three habitats) is I Do 2.
 * FACTS (all checked this session): see the notes. The plan's "the ribosomes are like ours" is not safe and is not used; "the ancient ones" is the misconception.
 */
const K = require('./prokaryotes-kit')({ lesson: 'Archaea And Extreme Places', subject: 'Y8 Science · Prokaryotes · Lesson 4 · 8I' });
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const A4 = DATA.archaea;
const n = (x) => x.toLocaleString('en-GB');
const PICS = require('path').join(__dirname, '..', 'assets', 'pictures');

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Describe how a cyanobacterium gets its energy.', 'It makes its own food using light, by photosynthesis, and gives out oxygen.'],
    ['Name the group of bacteria that make food using energy from chemicals.', 'Chemosynthetic bacteria.'],
    ['Define binary fission.', 'One cell copies its DNA, grows and splits into two identical cells.'],
    ['Explain why a variation that helps an animal survive becomes more common.', 'Animals with it survive longer, so they have more offspring and pass it on.'],
    [`Sea water is about ${A4.dead_sea.sea_pct}% salt. The Dead Sea is about ${A4.dead_sea.pct}% salt. Calculate how many times saltier the Dead Sea is, to the nearest whole number.`, `${A4.dead_sea.pct} ÷ ${A4.dead_sea.sea_pct} = ${A4.dead_sea.exact}, so about ${A4.dead_sea.times} times`],
    ['Suggest one place on Earth where you would not expect any living things.', 'A boiling hot spring, a very salty lake or deep underground. Microbes live in all of them.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/The Bacteria (Lesson 3, built in the same batch) and checked every question against the last three Do Nows in the class (The Bacteria, How Prokaryotes Live, Inside A Prokaryote). Nothing repeats.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (photosynthetic; chemosynthetic). Q3 and Q4 are EARLIER (binary fission, Lesson 2; natural selection, the evolution unit). Q5 is maths: a ratio that gives them the saltiness of the Dead Sea before the lesson uses it. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: light, photosynthesis, oxygen. Q2: chemosynthetic. Q3: DNA copies, grows, two identical cells. Q4: survive, reproduce, pass on. Q5: 34 ÷ 3.5 = 9.7, about 10 times (the Dead Sea is about 30 to 34 percent salt, depending on the year and the depth). Q6: any of: boiling water, ice, a very salty lake, deep rock, a volcano. Say "wait for the lesson: all of them have microbes".\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Describe what archaea are.', 'Describe three habitats where archaea live.', 'Explain how archaea differ from bacteria.'],
  banner: [['Archaea look like bacteria, but they are a ', false], ['different group', true], [', and we can tell from their ', false], ['chemistry and DNA', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'WHERE THIS SITS. Lessons 1 to 3 were prokaryotes and the bacteria. Today is the other kind of prokaryote, the ARCHAEA. One new word (archaea), and three habitat words: THERMOPHILE, HALOPHILE and METHANOGEN. The lesson ends with the three domains of life, once.\n\n'
    + 'OBJECTIVES 1 AND 3 ARE TAUGHT TOGETHER on the first I Do (what archaea are, and how they differ from bacteria); OBJECTIVE 2 (three habitats) is the second. Read the banner and move on.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'Under a microscope, these two cells look the same. One is a bacterium and one is an archaean. How do scientists tell them apart?',
  qSize: 20,
  picture: { key: 'shape_bacillus', w: 2.55, h: 1.70, y: 0.62 },
  opts: ['By their size.', 'By their chemistry and their DNA.', 'By the colour of the cell.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question and point at the drawing: "these two look the same". Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the first I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. Archaea and bacteria are often a similar size and shape, and neither has a nucleus. What separates them is molecular: the chemistry of the cell wall and the cell membrane, and the DNA and the way genes are read. That is how classification works now: not by looks, but by comparing chemistry and DNA. The first person to see the split was Carl Woese, in 1977, comparing a molecule in ribosomes (it is called ribosomal RNA).\n\n'
    + 'EXPECT MOST VOTES FOR A (size). Size does not separate them (both are tiny); colour is not a feature of a cell in a photograph. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 3: what archaea are, and how they differ from bacteria (objectives 1 and 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Archaea: a group of their own');
  const DOM = [
    ['Bacteria', 'prokaryote: no nucleus', 'cyanobacteria, the bacteria in yoghurt', 'shape_bacillus', C.accentInk],
    ['Archaea', 'prokaryote: no nucleus', 'microbes of hot springs, salt lakes and cows’ stomachs', 'shape_bacillus', C.accentInk],
    ['Eukarya', 'cells with a nucleus', 'animals, plants, fungi and amoebae', 'euk_full', C.dark],
  ];
  const g = 0.28, cw = (CW - 2 * g) / 3, y0 = 1.84, ch = 2.20;
  DOM.forEach(([name, tag, ex, img, col], i) => {
    const x = M + i * (cw + g);
    K.card(s, { x, y: y0, w: cw, h: ch, line: col, lineWidth: 2, name: `d${i}` });
    s.addImage({ path: require('path').join(PICS, `${img}.png`), x: x + 0.14, y: y0 + 0.14, w: 1.40, h: 0.93, objectName: `d${i}_img` });
    s.addText(name, { x: x + 1.62, y: y0 + 0.14, w: cw - 1.76, h: 0.93, color: C.dark, fontFace: F.title, fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `d${i}_name` });
    s.addText([{ text: tag, options: { bold: true, color: col, fontSize: 14.5, breakLine: true } }, { text: ex, options: { color: C.inkSoft, fontSize: 13.5 } }], { x: x + 0.20, y: y0 + 1.14, w: cw - 0.40, h: 0.98, fontFace: F.body, valign: 'top', margin: 0, lineSpacing: 18, paraSpaceAfter: 4, objectName: `d${i}_t` });
  });
  const y1 = y0 + ch + 0.16, ch2 = 2.00, hw = (CW - g) / 2;
  K.card(s, { x: M, y: y1, w: hw, h: ch2, fill: K.ANS, line: C.accentInk, lineWidth: 1.5, name: 'same' });
  K.kicker(s, 'THE SAME', M + 0.24, y1 + 0.10, hw - 0.48, 'same_h', { size: 13.5 });
  s.addText([
    { text: 'One cell. No nucleus. Very small.', options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: 'They look alike under a microscope, so you cannot tell from a photograph.', options: { bullet: true } },
  ], { x: M + 0.24, y: y1 + 0.50, w: hw - 0.48, h: ch2 - 0.58, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'same_t' });
  K.card(s, { x: M + hw + g, y: y1, w: hw, h: ch2, fill: 'FFFFFF', line: C.alert, lineWidth: 1.5, name: 'diff' });
  K.kicker(s, 'DIFFERENT', M + hw + g + 0.24, y1 + 0.10, hw - 0.48, 'diff_h', { size: 13.5, color: C.alert });
  s.addText([
    { text: 'The chemistry of the cell wall.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'The chemistry of the cell membrane.', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Their DNA.', options: { bullet: true } },
  ], { x: M + hw + g + 0.24, y: y1 + 0.50, w: hw - 0.48, h: ch2 - 0.58, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'diff_t' });
  K.sentence(s, [['We know archaea are different from their ', false], ['chemistry and DNA', true], [', not from their looks.', false]], { y: y1 + ch2 + 0.14, h: 0.56, size: 16, name: 'dom_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: the three domains (together), the same, the different, then the banner. POINT AT THE HOOK TALLY on the banner: the answer was B.\n\n'
    + 'OBJECTIVES 1 AND 3. WHAT ARCHAEA ARE: prokaryotes (one cell, no nucleus, very small) that are NOT bacteria: a group of their own. The slide shows THE THREE DOMAINS, once: BACTERIA, ARCHAEA, EUKARYA. Everything with a nucleus (animals, plants, fungi, amoebae) is Eukarya, so TWO of the three domains are prokaryotes. The drawing of a bacterium is used for BOTH Bacteria and Archaea on purpose: they look the same. (The word "domain" was proposed in 1990 by Woese, Kandler and Wheelis; in 1977 Woese and Fox had already shown there were three lines of life.)\n\n'
    + 'THE SAME: one cell, no nucleus, very small, and they look alike under any microscope a school owns. THE DIFFERENT: the chemistry of the cell wall (bacteria have a wall of peptidoglycan; archaea do not), the chemistry of the cell membrane (the molecules in it are joined by a different bond), and their DNA and the way their genes are read. At Year 8, the honest version is: THEY LOOK THE SAME, AND THEY ARE NOT THE SAME, AND WE KNOW BECAUSE OF THEIR CHEMISTRY AND THEIR DNA. That is how classification works now.\n\n'
    + 'THE WORKED EXAMPLE IS THE BANNER: given a cell with no nucleus, you cannot say bacterium or archaean from the picture. You compare chemistry and DNA.\n\n'
    + 'THE MISCONCEPTION TO KILL: "ARCHAEA ARE THE ANCIENT ONES." The name comes from a Greek word for ancient, and the first archaea found were in places like the early Earth, which fed the idea. It is wrong in two ways: archaea are alive now, and they are not the ancestors of bacteria. Archaea and bacteria are both very old, and neither group came from the other. (Many scientists think the first cells with a nucleus arose from within the archaea: say that if someone asks "so where did we come from?".) Do not say "primitive": it is not a scientific word.\n\n'
    + 'ONE FACT TO USE IN LESSON 6: no archaean is known to cause disease in people.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: three habitats (objective 2)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Three places where archaea live');
  const HAB = [
    ['thermophile', 'a heat-loving microbe', 'Hot springs and deep-sea vents. Some grow best above 80 °C.', 'bac_hotspring'],
    ['halophile', 'a salt-loving microbe', 'Salt lakes and salt ponds, far saltier than the sea.', 'bac_saltlake'],
    ['methanogen', 'a methane-making microbe', 'Places with no oxygen: swamp mud, sewage and cows’ stomachs.', 'bac_cow'],
  ];
  const g = 0.28, cw = (CW - 2 * g) / 3, y0 = 1.84, ch = 4.55;
  HAB.forEach(([word, meaning, where, photo], i) => {
    const x = M + i * (cw + g);
    K.card(s, { x, y: y0, w: cw, h: ch, line: C.accentInk, lineWidth: 1.8, name: `hb${i}` });
    K.pic(s, photo, x + 0.18, y0 + 0.18, cw - 0.36, 2.04, `hb${i}_photo`);
    s.addText(word, { x: x + 0.18, y: y0 + 2.34, w: cw - 0.36, h: 0.62, color: C.dark, fontFace: F.title, fontSize: 30, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `hb${i}_word` });
    s.addText(meaning, { x: x + 0.18, y: y0 + 2.94, w: cw - 0.36, h: 0.36, color: C.accentInk, fontFace: F.body, fontSize: 15, bold: true, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: `hb${i}_mean` });
    s.addText(where, { x: x + 0.22, y: y0 + 3.36, w: cw - 0.44, h: 1.10, color: C.ink, fontFace: F.body, fontSize: 15, align: 'center', valign: 'top', margin: 0, lineSpacing: 19, objectName: `hb${i}_where` });
  });
  K.sentence(s, [['Where a microbe lives does ', false], ['not', true], [' tell you its group: bacteria live in hot springs too.', false]], { y: y0 + ch + 0.14, h: 0.58, size: 16, name: 'hab_banner' });
  s.addNotes(
    'I DO. 3 minutes. Four clicks: one habitat each, then the banner.\n\n'
    + 'OBJECTIVE 2. THREE HABITATS, and the right word for each. (1) THERMOPHILES, "heat lovers": hot springs and deep-sea vents. The photograph is Grand Prismatic Spring in Yellowstone (about 110 m across). The very hot centre is about 70 °C; the coloured rings at the edge are mats of microbes, many of them CYANOBACTERIA, which are bacteria, so say "archaea live in hot springs too" and not "the colours are archaea". Hyperthermophiles grow best above 80 °C. The record is 122 °C, for an archaean (Methanopyrus) grown in a laboratory under very high pressure, which is what stops the water boiling. (2) HALOPHILES, "salt lovers": very salty lakes and salt ponds. The photograph is of salt-making ponds beside San Francisco Bay, taken from a plane: sea water is left in shallow ponds to dry so that the salt can be collected. The pink and red ponds are the saltiest, and their colour comes from salt-loving microbes (archaea, bacteria and algae). The Dead Sea is about 30 to 34 percent salt, nearly ten times as salty as sea water (3.5 percent); the Great Salt Lake\'s northern arm is about 25 percent. Some salt-loving microbes make red and pink pigments, and in very salty ponds the water can look pink (Lake Hillier in Western Australia is pink: scientists think its colour comes from salt-loving bacteria, archaea and algae together). DO NOT SAY "archaea turn salt lakes pink". (3) METHANOGENS, "methane makers": places with NO OXYGEN, such as swamp mud, rice paddies, sewage works, and the guts of cows (a cow makes roughly 250 to 500 litres of methane a day) and termites; also the human gut. ALL methanogens are archaea. Methane is a greenhouse gas about 27 to 30 times stronger than carbon dioxide over 100 years, which is why cow burps matter (SDG 13, Climate Action, in one sentence).\n\n'
    + 'THE BANNER IS THE MISCONCEPTION ABOUT HABITAT, and it is the whole of the game: bacteria live in hot springs and vents too (cyanobacteria in the springs; the bacteria in tube worms). The habitat does not decide the group. A second point, said once: NOT ALL ARCHAEA ARE EXTREMOPHILES. Many live in ordinary soil and sea water, and in the deep ocean roughly a third of the cells are archaea.\n\n'
    + 'THE WORKED EXAMPLE: a microbe that lives in water at 85 °C could be a thermophile. A microbe that makes methane in a swamp is a methanogen, and so is an archaean. Say "a methanogen is an archaean, every time".\n\n'
    + 'SYNOPTIC, AND WORTH THIRTY SECONDS: if microbes can live in hot, acidic water and deep under ice, scientists cannot rule out life in places that seem too extreme, such as the oceans under the ice of Europa and Enceladus. We have not found life anywhere except Earth.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Rank And Conquer
 * ================================================================== */
K.weDoRC({
  minutes: 5,
  question: 'Explain how archaea differ from bacteria. (3 marks: a different group, they look the same, and different chemistry and DNA.)',
  answers: [
    { text: 'Archaea are the ancient ones. They are bacteria that have hardly changed for billions of years.', rank: 4, reason: '0 marks. Archaea are not bacteria, and they are not ancestors of them.' },
    { text: 'Archaea are a different group from bacteria.', rank: 3, reason: '1 mark. True, but it does not say how they differ.' },
    { text: 'Archaea are a different group from bacteria. They look the same, so scientists use chemistry such as the cell wall to tell them apart.', rank: 2, reason: '2 marks. It does not mention the DNA.' },
    { text: 'Archaea are a different group from bacteria. They look the same under a microscope, but the chemistry of their cell wall and membrane is different, and so is their DNA.', rank: 1, reason: '3 marks. All three points.' },
  ],
  upgradedFrom: 'A',
  upgraded: 'Archaea are not bacteria and they are not the ancient ones: both groups are very old, and neither came from the other. They look the same under a microscope, but their cell walls and membranes have different chemistry and their DNA is different.',
  notes:
    'WE DO. 5 minutes. Five clicks. THE MODE IS RANK AND CONQUER (TEMPLATE.md): four answers to one question, and they rank them. The last We Do was Spot The Mistake. It needs a REASON from the room, not a word.\n\n'
    + 'THE RANKING COMES FROM THE MARK SCHEME, NOT TASTE. Three marks: (1) archaea are a different group from bacteria (not a type of bacteria), (2) they look the same under a microscope, so you cannot tell by looking (different chemistry: cell wall or membrane), (3) their DNA is different. COUNT WHAT EACH ANSWER HAS. D has all three: 3 marks, first. C has the group and the chemistry: 2 marks, second. B has the group only: 1 mark, third. A has none and holds the main misconception, "the ancient ones" and "they are bacteria": 0 marks, fourth.\n\n'
    + 'RANK. Read the four answers. Ask the class to commit by a show of hands: which is the WEAKEST, which is the STRONGEST. Ask a student for the reason and for the mark point that is missing. Then click: the screen reveals the ranking one card at a time, weakest and strongest first (A, then D), then C, then B.\n\n'
    + 'CONQUER. The last click shows the UPGRADED version of A, the answer that holds the lesson\'s main misconception. Build it with them first: "what is wrong with A?" (archaea are not bacteria; they are alive today; neither came from the other), then click and compare with theirs.\n\n'
    + 'IF A STUDENT SAYS "A IS RIGHT, THE NAME MEANS ANCIENT": the name does come from a word meaning ancient, which is where the idea started. It is only a name. IF SHORT OF TIME, skip the reasons for B and C.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Explain why you cannot tell an archaean from a bacterium by looking at it.', 'Both are tiny cells with no nucleus, and they look alike. We use chemistry and DNA.'],
    ['Name the three domains of life.', 'Bacteria, Archaea and Eukarya.'],
    ['Name the archaea that live in very hot places, and give one habitat.', 'Thermophiles. Hot springs or deep-sea vents.'],
    ['Describe where methanogens live, and what they make.', 'Places with no oxygen, such as swamp mud and cows’ stomachs. They make methane.'],
    ['Name the group of bacteria that feed on dead plants and animals.', 'Decomposers.'],
    ['Describe what happens in binary fission.', 'The DNA copies. The cell grows. A new wall forms. It splits into two identical cells.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (decomposers, Lesson 3) and Q6 (binary fission, Lesson 2).\n\n'
    + 'Q1 IS OBJECTIVE 3: listen for "they look the same" AND "chemistry and DNA". Q2 IS OBJECTIVE 1: all three domains; ask "which two are prokaryotes?" (Bacteria and Archaea). Q3 AND Q4 ARE OBJECTIVE 2: thermophile, hot; methanogen, no oxygen, methane. Q5: decomposers. Q6: DNA copies, grows, splits.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "a microbe lives in a hot spring: is it an archaean?" (not necessarily: cyanobacteria live there too). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14: the game
 * ================================================================== */
K.youDo({
  kind: 'game',
  cards: [
    ['ROUND 1', 'Sort the lesson', 'Put each microbe in a bin: bacterium, archaean or neither.'],
    ['ROUND 2', 'The traps', 'Where it lives does not decide it. Names and places will try to fool you.'],
    ['ROUND 3', 'Beat the game', 'Very hard. Meant to be almost impossible. Use the clues.'],
  ],
  note: 'No timer on the items. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three rounds, then the note. THE GAME IS THE SORTER: each microbe goes into one of three bins. The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open "Archaea And Extreme Places game" from Google Classroom. Three rounds of eight. Each round shows eight microbes (or cells, or viruses); they tap a card, then tap a bin: BACTERIUM, ARCHAEAN or NEITHER. A placement is a single go: the game says whether it is right, why, and names the mistake (for example, "where it lives does not decide it"). A "Clues" button shows the rules: no nucleus and a cell means bacterium or archaean; a nucleus, or no cell (a virus), means neither; a methanogen (a microbe that lives by making methane) is always an archaean. EVERY STUDENT GETS A DIFFERENT GAME: a different draw of items from a bigger bank, in a different order, with the bins in different places; the skills and their order are the same for everyone, and the items that carry the misconceptions are always there. Each game has a six-character code on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. No lives, no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 is the lesson: the methanogens, the yeast, the virus, the cheek cell, the 113 °C microbe. Round 2 is where-it-lives traps: a heat-loving BACTERIUM from a hot spring, a radiation-proof bacterium, a salt-loving microbe whose name says "bacterium" (Halobacterium, an archaean), a methane-maker in the human gut, a red ALGA in a hot spring, a YEAST in soy sauce brine, a virus that infects bacteria. Round 3 goes far past the lesson: chemistry clues (a cell wall of peptidoglycan means bacterium), an oxygen-releasing cell with no nucleus (cyanobacterium), a mitochondrion (it is part of a cell, not a cell: neither), a protist in a termite\'s gut. Expect most of the room to miss some of the last board. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each took, whether it was right and, for a wrong one, what the student chose and why. There is a "Stop and see my results" button on every board.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "does it have a nucleus?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  gameLine: ['Played the game? ', 'Open the drop-down for each round. Read what you got wrong, and why.'],
  bullets: [
    'Three domains: Bacteria, Archaea, Eukarya. Two of them are prokaryotes.',
    'Archaea look like bacteria. Their cell wall chemistry, membrane chemistry and DNA are different.',
    'Thermophiles live in the heat. Halophiles live in salt. Methanogens live with no oxygen and make methane.',
    'Where a microbe lives does not tell you its group.',
  ],
  notes:
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The numbers: 34 ÷ 3.5 = 9.7 (about 10 times saltier), 250 × 7 = 1,750 and 500 × 7 = 3,500 litres, and 122 − 100 = 22 °C (checked in build/prokaryotes-check.py). ON THE GAME, the drop-down for each round shows the reason for every item.\n\n'
    + 'WALK ROUND for the three commonest mistakes: "archaea are a type of bacteria"; "extreme place, so archaean"; and a virus or a yeast put in a prokaryote bin.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Archaea are prokaryotes.', 'TRUE'],
    ['Archaea are a type of bacteria.', 'FALSE'],
    ['Archaea are the ancient ones: they are the ancestors of bacteria.', 'FALSE'],
    ['Any microbe that lives in a hot spring must be an archaean.', 'FALSE'],
    ['Methanogens live where there is no oxygen.', 'TRUE'],
  ],
  closing: 'Next lesson: the bacteria we need. Life on Earth could not carry on without them.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: a different group, a different domain. Q3: "the ancient ones": archaea are alive now, and neither group came from the other. Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): cyanobacteria and other bacteria live in hot springs too, so the habitat does not decide the group. Ask "how would you find out?" (its chemistry and its DNA). Q1 and Q5 are TRUE (objectives 1 and 2).\n\n'
    + 'THE CLOSING LINE POINTS FORWARD, AND IT IS A CLAIM TO ARGUE WITH: Lesson 5 is the bacteria we need. The unit plan\'s opening claim was "without bacteria you would be dead within days". That is too strong (people and animals do not die within days of losing gut bacteria), so the slide says what is true: life on Earth could not carry on without bacteria. Ask on the way out: "could we live on a planet with no bacteria?"',
});

K.write();

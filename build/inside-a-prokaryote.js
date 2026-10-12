/**
 * Y8 Science, Prokaryotes, Lesson 1: Inside A Prokaryote. Class 8I. Single, 50 minutes. Culture palette (new for the unit).
 *
 * PREVIOUS: the last 8I lesson built was Deep Time (Natural Selection, Lesson 9). reference/INDEX.md has NO cells lesson for 8I (nor any Year 7 cells lesson),
 * and Chuka's answer was "no, or not sure", so this lesson builds the eukaryotic cell first (I Do 1) and the structure content tightens to fit, as the unit
 * plan says. THE SHAPE CHANGES FOR THAT, AND IS FLAGGED: Do Now 10, Today 1, Hook 2, I Do 6, I Do 5, We Do 4, Cold Call 5, You Do 11, Mark 3, Plenary 3 = 50.
 *
 * THE LAST THREE 8I DO NOWS (Deep Time, The Greatest Show On Earth, Shuffling The Gene Pool) were read, and nothing here repeats. The unit has met antibiotic
 * resistance already (Natural Selection In Action, the Fossils Do Now), which Lesson 6 extends.
 *
 * WE DO: RANK AND CONQUER (the last We Do in 8I was Deep Time's Spot The Mistake). FACTS: the numbers are checked in build/prokaryotes-check.py.
 */
const K = require('./prokaryotes-kit')({ lesson: 'Inside A Prokaryote', subject: 'Y8 Science · Prokaryotes · Lesson 1 · 8I' });
const DIAG = require('./prokaryotes-diagram')(K);
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const Z = DATA.size;

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Describe what a mass extinction is.', 'A large share of all species, about three quarters or more, die out in a short time, all over the Earth.'],
    ['Put these in order, oldest first: first humans, first life, first dinosaurs.', 'First life, first dinosaurs, first humans.'],
    ['Describe how geographic isolation can lead to a new species.', 'A barrier splits a population. Each group changes in its own way over many generations, until they cannot breed together.'],
    ['State one piece of evidence for evolution, other than fossils.', 'Similar DNA, similar embryos or similar bones in different species.'],
    [`A bacterium is ${Z.bact_um} µm long. 1 mm is ${Z.um_per_mm.toLocaleString('en-GB')} µm. Calculate how many bacteria fit end to end across 1 mm.`, `${Z.um_per_mm.toLocaleString('en-GB')} ÷ ${Z.bact_um} = ${Z.across_mm} bacteria`],
    ['Suggest why you cannot see a bacterium in detail with a school microscope.', 'It is too small. A light microscope shows it only as a dot. We need an electron microscope.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I CHECKED reference/INDEX.md and the Natural Selection decks: THERE IS NO CELLS LESSON for 8I (nor for Year 7), and you said "no, or not sure", so today builds a cell with a nucleus first. Nothing in this Do Now needs cells. I also checked every question against the last three Do Nows (Deep Time, The Greatest Show On Earth, Shuffling The Gene Pool): none repeats.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON (Deep Time: mass extinction; ordering events on the time scale). Q3 and Q4 are EARLIER IN THE UNIT (isolation and speciation, Lesson 8; the evidence for evolution, Lessons 5 and 6). Q5 is maths: a unit conversion that also gives them the size of a bacterium. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: many species, a short time, worldwide. Q2: first life (3,500 million years ago), first dinosaurs (230), first humans (0.3). Q3: a barrier, different conditions on each side, many generations, until they cannot interbreed. Q4: accept DNA, embryos or bones. Q5: 1,000 ÷ 2 = 500. Say the number out loud: five hundred bacteria across one millimetre, the smallest division on a ruler. Q6: the real answer is in I Do 2. Accept "too small". The first micrograph shows why a school microscope shows only a dot.\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Define a prokaryote.', 'Label the parts of a prokaryotic cell.', 'Name two things a prokaryote has that your cells do not.'],
  banner: [['A prokaryote is a cell with ', false], ['no nucleus', true], [', and its DNA sits ', false], ['loose', true], [' in the cell.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'THE UNIT. Six lessons, then an assessment: today the structure of a prokaryote; then how prokaryotes live (and why there are so many); the bacteria; the archaea; the bacteria we need; and pathogens and antibiotics. Say "by the last lesson you will be able to explain how a hospital infection becomes resistant to a drug, using what you learned in the evolution unit". The unit ends where it starts: an unseen cell.\n\n'
    + 'ONE NEW WORD TO WATCH: PROKARYOTE. It comes from Greek: pro, before, and karyon, nucleus. Today also gives you its opposite, EUKARYOTE (eu, true: a true nucleus). The banner is the whole lesson in one sentence: read it and move on.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'Your cells keep their DNA in a nucleus. A bacterium is a living cell with no nucleus. Where does it keep its DNA?',
  qSize: 20,
  picture: { key: 'prok_full', w: 2.55, h: 1.70, y: 0.62 },
  opts: ['It has no DNA at all.', 'Loose inside the cell.', 'Packed into the cell wall.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question and give them the first fact: "your cells keep their DNA in a part called the nucleus; we will see it in a minute". Then show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: I Do 2 does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. The DNA of a bacterium is one long loop, loose in the cytoplasm, with no membrane round it. That is the whole difference, and everything else in the lesson follows from it.\n\n'
    + 'EXPECT most votes for A or C. A is the commonest idea: "no nucleus, so no DNA". It is wrong: every living cell has DNA, or it could not make copies of itself. C is a good guess: the cell wall is the toughest part. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".',
});

/* ================================================================== *
 * 4. I DO · 6: a cell with a nucleus (your cells)
 * ================================================================== */
{
  const s = K.slide('light', 6, 'I Do');
  K.title(s, 'A cell with a nucleus: your cells');
  const box = { x: M + 2.55, y: 1.88, w: 6.0 };
  const cols = { left: [M, 2.35], right: [M + 2.55 + 6.0 + 0.20, RIGHT - (M + 2.55 + 6.0 + 0.20)] };
  const G = DIAG.place(s, 'euk', box, [
    { part: 'membrane', text: 'cell membrane', sub: 'controls what goes in and out', layers: ['euk_cell'] },
    { part: 'cytoplasm', sub: 'where reactions happen' },
    { part: 'nucleus', sub: 'holds the DNA', layers: ['euk_nuc'] },
    { part: 'mitochondrion', text: 'mitochondria', sub: 'release energy from food', layers: ['euk_mito'] },
    { part: 'ribosomes', sub: 'make proteins', layers: ['euk_ribo'] },
  ], { cols });
  K.sentence(s, [['Your cells have a ', false], ['nucleus', true], ['. They are ', false], ['eukaryotic', true], [' cells.', false]], { y: 6.30, h: 0.66, size: 18, name: 'euk_banner' });
  s.addText('about 10 to 100 µm across', { x: box.x, y: box.y + 4.02, w: box.w, h: 0.26, color: C.inkSoft, fontFace: F.body, fontSize: 12, italic: true, align: 'center', valign: 'middle', margin: 0, objectName: 'euk_size' });
  s.addNotes(
    'I DO. 6 minutes (the standard 3, plus 3 because the class has no cells to build on). Five clicks: the cell, the nucleus, the mitochondria, the ribosomes, then the banner.\n\n'
    + 'WHY THIS IS HERE. The definition of a prokaryote is "a cell with no nucleus", and that is empty unless they have met a cell WITH one. The unit plan asked me to check what 8I had: there is no cells lesson in reference/, you were not sure, so I built the eukaryotic cell. IF YOUR CLASS HAS DONE CELLS, tell them to shout the labels and spend 2 minutes here, then give the time to the You Do.\n\n'
    + 'THIS IS THE WORKED EXAMPLE OF LABELLING: every part gets its name AND its job, said together. That is how the next slide works too. Click by click. (1) THE CELL MEMBRANE: a thin skin that controls what goes in and out. THE CYTOPLASM: the jelly inside, where most of the cell\'s chemical reactions happen. (2) THE NUCLEUS: the part that holds the DNA, the instructions. THIS IS THE ONE THAT MATTERS TODAY: say "remember the nucleus". Point at the coiled green line: that is DNA, and they already know DNA from the evolution unit (the 4% of 200 letters, alleles). (3) MITOCHONDRIA: they release energy from food. (4) RIBOSOMES: tiny dots that make proteins. Do not go further: today these five are the whole animal cell. (5) The banner. YOUR CELLS ARE EUKARYOTIC (eu means true, karyon means nucleus: a true nucleus). New word, said once.\n\n'
    + 'SIZE: a typical animal cell is 10 to 100 µm across (a micrometre, µm, is a thousandth of a millimetre). Tell them you will need that number in a minute.\n\n'
    + 'EXPECT: "which part is the brain?" The nucleus is the control centre in the sense that it holds the instructions. Do not call it the brain. "Does every cell have a nucleus?" Not every kind. That is the point of the next slide.',
  );
  K._euk = G;
}

/* ================================================================== *
 * 5. I DO · 5: a prokaryotic cell
 * ================================================================== */
{
  const s = K.slide('light', 5, 'I Do');
  K.title(s, 'A prokaryotic cell');
  const box = { x: M - 0.15, y: 1.74, w: 7.35 };
  const mic = { x: 8.95, y: 1.84, w: 3.50 };
  K.pic(s, 'bac_tem', mic.x, mic.y, mic.w, mic.w, 'mic_photo');
  s.addText('A real bacterium under an electron microscope (the colour is added). The long wavy threads are flagella.', { x: mic.x, y: mic.y + mic.w + 0.06, w: mic.w, h: 0.62, color: C.inkSoft, fontFace: F.body, fontSize: 13, italic: true, align: 'center', valign: 'top', margin: 0, lineSpacing: 16, objectName: 'mic_cap' });
  const G = DIAG.place(s, 'prok', box, [
    { part: 'cell wall', layers: ['prok_wall'] },
    { part: 'cell membrane', layers: ['prok_cyto'] },
    { part: 'cytoplasm', w: 1.6 },
    { part: 'ribosomes', layers: ['prok_ribo'], w: 1.7 },
    { part: 'main DNA loop', layers: ['prok_dna'], w: 2.1 },
    { part: 'plasmid', layers: ['prok_plasmid'], hi: true, sub: 'a small spare loop of DNA', w: 2.3, lx: 790 },
    { part: 'flagellum', layers: ['prok_flag'], hi: true, sub: 'a tail that spins', w: 1.9, lx: 1340 },
  ]);
  K.sentence(s, [['A ', false], ['prokaryote', true], [' is an organism whose cell has ', false], ['no nucleus', true], ['. Its DNA is loose in the cytoplasm.', false]], { y: 6.72, h: 0.56, size: 16, name: 'def_banner' });
  K._prok = G;
  s.addNotes(
    'I DO. 5 minutes. Five clicks: the micrograph, the wall, membrane and cytoplasm, the ribosomes and the DNA, the plasmid and flagellum, then the banner.\n\n'
    + 'OBJECTIVES 1, 2 AND 3. THE MICROGRAPH FIRST, ON PURPOSE: "this is a real bacterium, photographed with an ELECTRON microscope. The microscope gives only grey, and the colour was added afterwards. You can see the rough surface of the cell, and the long wavy threads are its flagella. The diagram is clean and the micrograph is messy, and you need both." (The photograph is a close-up of one end of a rod-shaped cell about 2 µm long. It shows the outside only: you cannot see the DNA or the ribosomes in it, which is why the diagram shows the inside.) BE STRAIGHT ABOUT WHY YOU CANNOT DO THIS WITH A SCHOOL MICROSCOPE: at x400 a bacterium 2 µm long looks 0.8 mm long, a dot with no structure. Light itself limits what a light microscope can show, and no budget changes that: at x400 the smallest detail is about 0.4 µm, and even the best light microscope, with a drop of oil at x1000, reaches only about 0.2 µm. An electron microscope uses beams of electrons, which can show much smaller things. THAT IS THE ANSWER TO DO NOW Q6: settle it here. It is also why we use micrographs and diagrams today.\n\n'
    + 'THE DIAGRAM, PART BY PART. Say each name AND each job, as on the last slide. (1) THE CELL WALL: a tough outer layer that holds the shape. THE CELL MEMBRANE: the thin skin inside it, as in your cells. THE CYTOPLASM: the jelly inside. (2) RIBOSOMES: make proteins, as in your cells. THE MAIN DNA LOOP: USUALLY ONE LONG LOOP OF DNA, LYING LOOSE IN THE CYTOPLASM (loose means not inside a nucleus: it is packed into one region of the cell, so say "not in a nucleus" if a student pictures it floating about). THERE IS NO NUCLEUS: THAT IS WHAT MAKES IT A PROKARYOTE. POINT AT THE HOOK TALLY: the answer was B, loose inside the cell. (3) THE TWO NEW WORDS, highlighted: A PLASMID is a small spare loop of DNA, separate from the main one. A FLAGELLUM is a tail that spins round and round (an E. coli flagellum turns about 100 times a second) and pushes the cell along. Some bacteria have one, some have several and many have none; the cell in the diagram has one, and the one in the photograph has several. Your cells have neither a plasmid nor a flagellum. SAY THE SENTENCE FOR OBJECTIVE 3: "A prokaryote has a ____, which your cells do not." Cell wall, plasmids, flagellum: any two. (4) The banner is the definition: a prokaryote is an organism whose cell has no nucleus.\n\n'
    + 'PLANT ONE IDEA AND DO NOT EXPLAIN IT: SOME PLASMIDS CAN BE PASSED FROM ONE BACTERIUM TO ANOTHER, SOMETIMES TO A DIFFERENT SPECIES. "That is DNA moving sideways, not just from parent to child." It matters in Lesson 6 (resistance spreads on plasmids), and the unit comes back to it.\n\n'
    + 'LANGUAGE TO AVOID: "simple" and "primitive". Prokaryotes are different, not simpler: they are the most numerous cells on Earth and live almost everywhere. Say "different structure", never "simpler". (The unit plan words the flagellum as spinning like a propeller; house style has no similes, so the slide says it spins.) The We Do is built on this.\n\n'
    + 'SIZE: most bacteria are about 1 to 5 µm long (E. coli is about 2 µm long and 1 µm wide); your cells are 10 to 100 µm across. A very few bacteria are huge: one kind is about 1 cm long. Say that if someone asks "are they all tiny?".\n\n'
    + 'MISCONCEPTIONS. (1) "No nucleus means no DNA." (2) "The flagellum is a tail like a sperm\'s": a human sperm cell has a tail that is also called a flagellum, but it works differently, and your other cells have none. If a student raises it, say "most of your cells have none". (3) "The cell wall is the cell membrane": the wall is outside and tough, the membrane is the thin skin inside it.'
  );
}

/* ================================================================== *
 * 6. WE DO · 4: Rank And Conquer
 * ================================================================== */
K.weDoRC({
  minutes: 4,
  question: 'Describe how a prokaryotic cell is different from one of your cells. (3 marks: no nucleus, DNA loose, and a part your cells do not have.)',
  answers: [
    { text: 'A prokaryote is a simple cell with no DNA. It is just a smaller version of your cells.', rank: 4, reason: '0 marks. It has DNA. It is different, not simple.' },
    { text: 'A prokaryote has no nucleus.', rank: 3, reason: '1 mark. True, but it is only the first point.' },
    { text: 'A prokaryote has no nucleus, so its DNA is loose in the cytoplasm.', rank: 2, reason: '2 marks. It does not name a part that your cells lack.' },
    { text: 'A prokaryote has no nucleus, so its DNA is loose in the cytoplasm. It also has a cell wall and may have a flagellum, which your cells do not.', rank: 1, reason: '3 marks. All three points.' },
  ],
  upgradedFrom: 'A',
  upgraded: 'A prokaryote does have DNA, but no nucleus, so its DNA is loose in the cytoplasm as one loop. It is different, not simpler: it also has a cell wall, plasmids and a flagellum that your cells do not.',
  notes:
    'WE DO. 4 minutes. Five clicks. THE MODE IS RANK AND CONQUER (TEMPLATE.md): four answers to one question, and they rank them. The last We Do in 8I was Deep Time\'s Spot The Mistake, so the mode changes. It needs a REASON from the room, not a word.\n\n'
    + 'THE RANKING COMES FROM THE MARK SCHEME, NOT TASTE. Three marks: (1) no nucleus, (2) the DNA is loose in the cytoplasm, (3) a part your cells do not have (cell wall, plasmid or flagellum). COUNT WHAT EACH ANSWER HAS. D has all three: 3 marks, first. C has points 1 and 2: 2 marks, second. B has point 1 only: 1 mark, third. A has none and has two WRONG ideas: "no DNA" and "simple": 0 marks, fourth.\n\n'
    + 'RANK. Read the four answers. Ask the class to commit by a show of hands: which is the WEAKEST, which is the STRONGEST. Ask a student for the reason, and ask "which mark point is missing?". Then click: the screen reveals the ranking one card at a time, weakest and strongest first (A, then D), then C, then B.\n\n'
    + 'CONQUER. The last click shows the UPGRADED version of A, the answer that holds the lesson\'s main misconception ("no DNA", "simple"). Build it with them first: "what is wrong with A? What would you change?" (it has DNA; it is different, not simple), then click and compare with theirs.\n\n'
    + 'IF A STUDENT SAYS "C is wrong because plasmid is not mentioned": point out the question asks for three marks; C is a good answer that stops one point short. IF SHORT OF TIME, skip the reasons for B and C.',
});

/* ================================================================== *
 * 7. COLD CALL · 5
 * ================================================================== */
K.coldCall({
  minutes: 5,
  qs: [
    ['Define a prokaryote.', 'An organism whose cell has no nucleus. Its DNA is loose in the cytoplasm.'],
    ['Name the part of your cells that holds the DNA.', 'The nucleus.'],
    ['State where the DNA is in a prokaryote.', 'Loose in the cytoplasm, as one main loop.'],
    ['Name two things a prokaryote has that your cells do not.', 'Any two of: a cell wall, plasmids, a flagellum.'],
    ['Some insects are resistant to a poison by chance. Explain why more of them are resistant later.', 'The resistant ones survive, reproduce and pass resistance on, so it becomes more common.'],
    ['Define a gene pool.', 'All the versions of genes (alleles) in a population.'],
  ],
  notes:
    'COLD CALL. 5 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (natural selection applied to a poison, Natural Selection In Action) and Q6 (the gene pool, Small Changes, Big Changes). Q5 is the seed of Lesson 6: bacteria and antibiotics are the same story.\n\n'
    + 'Q1 IS OBJECTIVE 1: listen for the nucleus AND the DNA being loose. Q2 and Q3 are the two halves of it. Q4 IS OBJECTIVE 3: accept any two of the three. If a student says "no nucleus", ask "that is something it LACKS. What does it HAVE?". Q5: listen for variation (some already resistant, by chance), survival, and inheritance. Q6: alleles.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "which of the three is a tail?" and "what does the plasmid do?" (it is a spare loop of DNA; bacteria can swap them). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 11
 * ================================================================== */
K.youDo({
  kind: 'worksheet', minutes: 11,
  cards: [
    ['BRONZE', 'Label it', 'Say what a prokaryote is, then label a prokaryotic cell and a cell of your own.'],
    ['SILVER', 'Compare it', 'Compare the two kinds of cell. Sort the parts. Explain a common mistake.'],
    ['GOLD', 'Work it out', 'Sizes under the microscope, why “different” beats “simple”, and what a plasmid can do.'],
  ],
  note: 'Choose a tier. Read the worked example first. The questions are mixed on purpose.',
  notes:
    'YOU DO. 11 minutes (3 less than the standard, to make room for the eukaryotic cell in I Do 1), then 3 to mark. Four clicks: the three tiers, then the note.\n\n'
    + 'THEY CHOOSE A TIER, and the choice is deliberate. Bronze is labelling and the definition (aim for about four right out of five). Silver is a comparison table, a sorting task and the commonest error. Gold is numbers (sizes under the microscope), an explanation, and a seed for Lesson 6. EVERY TIER HAS A WORKED EXAMPLE TO READ AND A HALF-WORKED ONE TO FINISH, and the questions are interleaved, so they have to choose what to do each time. Say so; it looks like a mistake otherwise.\n\n'
    + 'THE WORKSHEET IS ON GOOGLE CLASSROOM, and the answers are UPSIDE DOWN on the last page. There are no mini whiteboards in this room, so everything is on paper or on the screen.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "is that a nucleus, or is that where the DNA is?" The commonest error is writing "no DNA" for a prokaryote. If Bronze is producing lots of errors, the problem is the I Do: go back to the diagram. AT THE END OF 11 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'A prokaryote is an organism whose cell has no nucleus.',
    'Its DNA is loose in the cytoplasm, as one main loop.',
    'Seven parts: cell wall, cell membrane, cytoplasm, ribosomes, main DNA loop, plasmids, flagellum.',
    'Your cells do not have a cell wall, plasmids or a flagellum.',
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The labelling answers are exact. For Q2 and Q13 accept any real part or reason. The numbers are 1,000 ÷ 2 = 500 (Do Now), 50 ÷ 2 = 25, and 2 × 400 = 800 µm = 0.8 mm.\n\n'
    + 'WALK ROUND for the three commonest mistakes: "no nucleus means no DNA"; the cell wall and the cell membrane swapped; and "simple" or "primitive" written anywhere.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['A prokaryote is an organism whose cell has no nucleus.', 'TRUE'],
    ['A prokaryote has no DNA.', 'FALSE'],
    ['A prokaryote is a simple, primitive cell.', 'FALSE'],
    ['A plasmid is a small spare loop of DNA.', 'TRUE'],
    ['With a school microscope you could see the flagellum of a bacterium.', 'FALSE'],
  ],
  closing: 'Next lesson: how a single prokaryote becomes billions.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: "no nucleus means no DNA": every cell has DNA, in a prokaryote it is loose. Q3: "simple" and "primitive": prokaryotes are different, and they live almost everywhere. Q5 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): at x400 a bacterium is a dot of about 0.8 mm; a flagellum is far too thin for any light microscope. Ask "how do you know?" (the micrograph on the I Do slide came from an electron microscope). Q1 and Q4 are TRUE (objectives 1 and 3).\n\n'
    + 'THE CLOSING LINE POINTS FORWARD: Lesson 2 is how prokaryotes live, and the number at its centre: one bacterium that divides every 20 minutes. Put it as a question on the way out: "how many after four hours?"',
});

K.write();

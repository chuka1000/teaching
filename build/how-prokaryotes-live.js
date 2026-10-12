/**
 * Y8 Science, Prokaryotes, Lesson 2: How Prokaryotes Live. Class 8I. Single, 50 minutes. Culture palette, carried on from Lesson 1.
 *
 * PREVIOUS: Inside A Prokaryote (built in the same batch, out/Inside A Prokaryote). 50 minutes, ten slides. It defined a prokaryote (no nucleus, DNA loose in the
 * cytoplasm), labelled the seven parts, introduced plasmid and flagellum (and planted: some plasmids pass from one bacterium to another), and ended on the
 * promise "next lesson: how a single prokaryote becomes billions".
 *
 * THE LAST THREE 8I DO NOWS (Inside A Prokaryote, Deep Time, The Greatest Show On Earth) were read: nothing here repeats.
 * WE DO: FINISH IT OFF (it is a method lesson; the last We Do was Rank And Conquer). The doubling arithmetic is checked in build/prokaryotes-check.py.
 * FACTS: fact-checked in this session. 20 minutes is the best case in the lab ("as little as"), not what happens in nature; "most" prokaryotes divide by binary fission.
 */
const K = require('./prokaryotes-kit')({ lesson: 'How Prokaryotes Live', subject: 'Y8 Science · Prokaryotes · Lesson 2 · 8I' });
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const D = DATA.doubling;
const n = (x) => x.toLocaleString('en-GB');

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['A cell has its DNA inside a nucleus. State whether it is a prokaryote, and why.', 'No. A prokaryote has no nucleus. A cell with a nucleus is eukaryotic, like your cells.'],
    ['State what a plasmid is.', 'A small spare loop of DNA, separate from the main loop.'],
    ['Describe how a fossil forms.', 'An organism is buried quickly in sediment. Over a very long time the sediment becomes rock and the hard parts are replaced by minerals.'],
    ['Name the process that makes a brand new allele.', 'Mutation: a change in the DNA.'],
    ['Calculate how many 20-minute periods fit into 3 hours.', '3 × 60 = 180 minutes, and 180 ÷ 20 = 9 periods'],
    ['Suggest how one bacterium could make a copy of itself.', 'It copies its DNA, grows, and splits into two cells.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'I READ out/Inside A Prokaryote (Lesson 1, built in the same batch) and checked every question against the last three Do Nows in the class (Inside A Prokaryote, Deep Time, The Greatest Show On Earth). Nothing repeats. Lesson 1\'s Cold Call asked for the definition of a prokaryote and the two things it has that your cells lack, so the Do Now asks the same ideas in new shapes (a cell with a nucleus; what a plasmid is).\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md. Q1 and Q2 are LAST LESSON. Q3 and Q4 are EARLIER IN THE UNIT (how fossils form, Lesson 4; where new alleles come from, Lesson 7). Q5 is maths: the first step of the doubling sum, so that the I Do 2 working has nothing new in it. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: not a prokaryote (it has a nucleus); it is eukaryotic, like your cells. Q2: a small spare loop of DNA. Q3: buried quickly, sediment, rock, minerals. Q4: mutation. Q5: 3 × 60 = 180, 180 ÷ 20 = 9. Say the 9 out loud: it comes back in the I Do. Q6: any answer that copies the DNA and splits is a good start: the first minute of the I Do settles it. If a student says "it mates", ask "with what?".\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['List the characteristics all prokaryotes share.', 'Describe how a prokaryote reproduces.', 'Explain why prokaryotes are found almost everywhere.'],
  banner: [['Prokaryotes are tiny and they ', false], ['divide fast', true], [', so they live in ', false], ['almost every', true], [' habitat.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'WHERE THIS SITS. Last lesson was the structure of a prokaryote. Today: what they have in common, how one becomes two, and a calculation that explains why there are so many of them. One new word, BINARY FISSION. Objective 3 answers itself out of the other two (small, fast, and undemanding about where they live), so it is built up through the lesson and finished in the We Do.\n\n'
    + 'The banner is the lesson in one sentence: read it and move on.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'One bacterium divides into two every 20 minutes. It has plenty of food and warmth, and none of them die. How many bacteria are there after 12 hours?',
  qSize: 20,
  picture: { key: 'bac_plate', w: 1.75, h: 1.75, y: 0.60 },
  opts: ['About 100.', 'About 1 million.', 'About 69 billion.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'Read the question slowly, and stress the conditions: plenty of food, warm, none die, one division every 20 minutes. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the I Do and the We Do do, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: C. 12 hours is 720 minutes, which is 36 divisions of 20 minutes, and 2 multiplied by itself 36 times is 68,719,476,736: about 69 billion. EXPECT MOST VOTES FOR A OR B. People think "12 hours, 36 divisions, so about 36 times as many", or add instead of multiplying. THE NUMBER IS THE LESSON. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".\n\n'
    + 'THE PHOTOGRAPH is a Petri dish with bacterial colonies growing on agar: each dot is a colony of millions of cells that started from one.',
});

/* ================================================================== *
 * 4. I DO · 3: what all prokaryotes share (objective 1)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'What all prokaryotes share');
  const ROWS = [
    ['One cell', 'The whole organism is a single cell.'],
    ['No nucleus', 'The DNA is not inside a nucleus.'],
    ['Very small', 'Most are about 1 to 5 µm long.'],
    ['Divide in two', 'Most reproduce by binary fission.'],
    ['Almost every habitat', 'Even hot springs, ice and rock deep underground.'],
  ];
  const lw = 6.30, rowH = 0.80, gap = 0.08, y0 = 1.92;
  ROWS.forEach(([head, body], i) => {
    const y = y0 + i * (rowH + gap);
    K.card(s, { x: M, y, w: lw, h: rowH, name: `r${i}` });
    K.badge(s, { x: M + 0.20, y: y + (rowH - 0.42) / 2, n: i + 1, name: `r${i}` });
    s.addText([{ text: head, options: { bold: true, fontSize: 17, color: C.dark, breakLine: true } }, { text: body, options: { fontSize: 13, color: C.inkSoft } }], {
      x: M + 0.80, y, w: lw - 0.95, h: rowH, fontFace: F.body, valign: 'middle', margin: 0, lineSpacing: 18, objectName: `r${i}_t`,
    });
  });
  K.sentence(s, [['Test a cell: 2 µm long, one cell, no nucleus, lives in a hot spring. It is a ', false], ['prokaryote', true], ['.', false]], { x: M, y: y0 + 5 * (rowH + gap) + 0.04, w: lw, h: 0.62, size: 14, name: 'test_banner' });
  const ps = 2.08, px0 = M + lw + 0.28, py0 = 1.92;
  [['bac_hotspring', 'a hot spring'], ['bac_ice', 'Antarctic ice'], ['bac_soil', 'soil'], ['bac_vent', 'a deep-sea vent']].forEach(([key, cap], i) => {
    const x = px0 + (i % 2) * (ps + 0.20), y = py0 + Math.floor(i / 2) * (ps + 0.40);
    K.pic(s, key, x, y, ps, ps, `hab${i}_img`);
    s.addText(cap, { x, y: y + ps + 0.04, w: ps, h: 0.30, color: C.dark, fontFace: F.body, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `hab${i}_cap` });
  });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the first three characteristics, the last two with the habitats, then the test.\n\n'
    + 'OBJECTIVE 1. THE FIVE THINGS PROKARYOTES SHARE. They know the first two from last lesson, so this is quick. (1) ONE CELL: a prokaryote is a whole organism in one cell. (Some stick together in chains or films, but each cell is a complete prokaryote.) (2) NO NUCLEUS. (3) VERY SMALL: most are about 1 to 5 µm long; E. coli is about 2 µm long. A very few are huge (one kind is about 1 cm long): say it if someone asks "are they all tiny?". (4) DIVIDE IN TWO: most reproduce by binary fission, the word for the next slide. (Some use other methods, such as budding; "most" is the honest word.) (5) ALMOST EVERY HABITAT: the photographs show a hot spring, Antarctic ice, soil and a deep-sea vent. Some live in rock deep underground, and the record for a microbe growing in heat is 122 °C, under high pressure. This is the claim the lesson explains.\n\n'
    + 'THE TEST IS THE WORKED EXAMPLE OF OBJECTIVE 1: to decide if a cell is a prokaryote, check the list. A cell that is 2 µm long, one cell, has no nucleus and lives in a hot spring matches, so it is a prokaryote.\n\n'
    + 'Say "keep all five in your head: the We Do needs them". Do not teach the habitats in detail: Lesson 4 gives archaea and their extreme places.'
  );
}

/* ================================================================== *
 * 5. I DO · 3: binary fission and doubling (objective 2)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Binary fission');
  const vw = 6.55, vh = vw * 540 / 960, y0 = 1.84;
  K.video(s, 'prok-fission', M, y0, vw, vh, 'vid_fission');
  K.sentence(s, [['The two new cells are ', false], ['identical', true], ['. There is no mixing of DNA.', false]], { x: M, y: y0 + vh + 0.12, w: vw, h: 0.56, size: 15, name: 'ident_banner' });
  const RX = M + vw + 0.28, RW = RIGHT - RX;
  K.card(s, { x: RX, y: y0, w: RW, h: 1.48, name: 'nw' });
  K.kicker(s, 'NEW WORD', RX + 0.22, y0 + 0.08, RW - 0.44, 'nw_h', { size: 13.5 });
  s.addText([
    { text: 'Binary fission: ', options: { bold: true } },
    { text: 'one cell copies its DNA, grows and splits into two cells.' },
  ], { x: RX + 0.22, y: y0 + 0.46, w: RW - 0.44, h: 0.96, color: C.ink, fontFace: F.body, fontSize: 15, valign: 'top', margin: 0, lineSpacing: 19, objectName: 'nw_t' });
  const ey = y0 + 1.62, eh = vh + 0.12 + 0.56 - 1.62;
  K.card(s, { x: RX, y: ey, w: RW, h: eh, fill: K.ANS, line: C.accentInk, lineWidth: 1.5, name: 'ex' });
  K.kicker(s, 'WORKED EXAMPLE', RX + 0.22, ey + 0.08, RW - 0.44, 'ex_h', { size: 13 });
  s.addText([
    { text: 'One bacterium divides every 20 minutes. How many after 1 hour?', options: { bold: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: `${D.h1.minutes} ÷ ${D.h1.gen} = ${D.h1.divisions} divisions.`, options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: `2 × 2 × 2 = ${D.h1.cells} bacteria.`, options: { bold: true, color: C.alert } },
  ], { x: RX + 0.22, y: ey + 0.46, w: RW - 0.44, h: eh - 0.52, color: C.ink, fontFace: F.body, fontSize: 14.5, valign: 'top', margin: 0, lineSpacing: 18.5, objectName: 'ex_t' });
  K.sentence(s, [['So where does ', false], ['variation', true], [' come from? Copying mistakes (', false], ['mutations', true], [') and swapped plasmids.', false]], { x: M, y: y0 + vh + 0.12 + 0.56 + 0.14, w: CW, h: 0.62, size: 15, name: 'var_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the new word, the animation (ON CLICK, so say the idea first), the worked example, the first banner, the second banner.\n\n'
    + 'OBJECTIVE 2. BINARY FISSION is how most prokaryotes reproduce: one cell becomes two. Binary means two; fission means splitting.\n\n'
    + 'THE ANIMATION (about 30 seconds, you can click it to play again). SCENE ONE is one cell dividing, in four steps, each held for a moment: (1) THE DNA COPIES ITSELF, so there are now two loops. (2) THE CELL GROWS LONGER and the copies move to opposite ends. (3) A NEW WALL GROWS ACROSS THE MIDDLE. (4) THE CELL SPLITS INTO TWO CELLS, and they are identical (apart from a rare copying mistake). SCENE TWO IS THE SAME THING COUNTED: 1 cell, then 2 after 20 minutes, 4 after 40, 8 after 60. The number doubles each time.\n\n'
    + 'THE WORKED EXAMPLE IS THE METHOD, and the We Do uses it three times. (1) Divide the time by the time for one division: 60 ÷ 20 = 3 divisions. (2) Each division doubles the number, so multiply 2 by itself that many times: 2 × 2 × 2 = 8. SAY THE COMMON ERROR BEFORE THEY MAKE IT: "not 3 × 2 = 6, and not 2 + 2 + 2". Each division makes every cell two, so doubling is multiplying by 2, again and again. (For big counts, 2^12 means 12 twos multiplied: a calculator is fine; the worksheet says so.) IMPORTANT: 20 minutes is the BEST case, in the lab, with plenty of food and warmth. Most bacteria in nature divide far more slowly (days, or even years). The doubling is "what could happen", and that matters in the We Do.\n\n'
    + 'THE FIRST BANNER: identical cells. There is no sex in binary fission, so there is no mixing of DNA from two parents. THAT RAISES THE RIGHT QUESTION, which is the SECOND BANNER: so where does variation come from, if every new cell is a copy? TWO ANSWERS, one line each, and bank them for Lesson 6: (1) COPYING MISTAKES, mutations: rare (about one in a thousand divisions for E. coli) but so many cells divide that new mutations appear all the time; (2) PLASMIDS: some plasmids can be passed from one bacterium to another, so a cell can gain genes sideways. Both are the raw material for natural selection, which they already know. Say "Lesson 6 puts this together".\n\n'
    + 'MISCONCEPTIONS. (1) "Binary fission is like a cell having a baby": there is no parent and child, two new equal cells. (2) "The cell splits in half and each half is half a cell": each new cell has a full copy of the DNA and then grows.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Finish It Off
 * ================================================================== */
K.weDoFIO({
  heading: 'Finish this', subtitle: 'Fill in the blanks. Say each one out loud, and say why.',
  rows: [
    ['One bacterium divides every 20 minutes. Find how many bacteria there are after 2 hours.', '2 hours = ____ minutes. ____ ÷ 20 = ____ divisions. 2 × 2 × 2 × 2 × 2 × 2 = ____ bacteria.', ['120 minutes', '120 ÷ 20 = 6 divisions', `${D.h2.cells} bacteria`]],
    ['A different bacterium divides every 30 minutes. Find how many there are after 4 hours.', '4 hours = ____ minutes. ____ ÷ 30 = ____ divisions. Multiply 2 by itself that many times = ____ bacteria.', [`${D.h4_30.minutes} minutes`, `${D.h4_30.minutes} ÷ 30 = ${D.h4_30.divisions} divisions`, `${D.h4_30.cells} bacteria`]],
    ['Explain why prokaryotes are found almost everywhere.', 'They are very ____, so they fit into tiny places. They divide ____, so a few cells become millions. But they cannot keep dividing for ever, because ____ runs out.', ['small', 'fast', 'food']],
  ],
  notes:
    'WE DO. 5 minutes. Three clicks. THE MODE IS "FINISH IT OFF" (TEMPLATE.md): three partly worked cases, and they fill in the blanks. The last We Do was Rank And Conquer, so the mode changes. It is a METHOD lesson, so this is the right mode. EVERY BLANK GETS A FOLLOW-UP THAT NEEDS THINKING, because single words would read as a word game.\n\n'
    + 'THEY SAY THE MISSING WORDS OUT LOUD BEFORE EACH REVEAL, then you ask the follow-up. ROW 1: "which step is the 120 for?" (turning hours into minutes: 2 × 60); "why divide by 20?" (it is how many minutes one division takes: the sum counts divisions); "why is it six 2s and not 6 × 2?" (each division doubles the number; 6 × 2 = 12, but 64 is right). THE ANSWER IS 64. ROW 2: the same method, a different bacterium: 4 hours = 240 minutes, 240 ÷ 30 = 8 divisions, and 2 multiplied by itself 8 times is 256. Ask "which bacterium is faster, and how can you tell?" (the one that divides every 20 minutes: it makes 64 after 2 hours, while this one needs 3 hours for the same). ROW 3 IS OBJECTIVE 3, an explanation, finished in three words: small, fast, food. Ask "which of the five characteristics is that?" for each blank (very small; divide in two; and the point that nothing can keep doubling). THE LAST BLANK IS THE HONEST FOLLOW-UP TO THE WHOLE LESSON: the hook said 69 billion after 12 hours, and it does not really happen, because food and space run out. How big would it get? 69 billion E. coli weigh less than a quarter of a gram (about 0.07 g, at about one trillionth of a gram each), far less than a paperclip. But if the doubling never stopped, after about 44 hours (133 divisions, at that mass) the bacteria would outweigh the whole Earth, and in a real flask growth stops long before: it levels off at about a billion cells in each millilitre. That is why the planet is not covered in bacteria. POINT AT THE HOOK TALLY: the answer was C, about 69 billion, if nothing stopped them.\n\n'
    + 'IF THEY ARE QUICK, ask for a prediction: "what happens to the bacteria when the food runs out?" (the cells stop dividing, and many die). IF SHORT OF TIME, do rows 1 and 3 only.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Name three characteristics of prokaryotes.', 'Any three: one cell, no nucleus, very small, divide in two, found in almost every habitat.'],
    ['Describe what happens in binary fission.', 'The DNA copies. The cell grows. A new wall forms across the middle. It splits into two identical cells.'],
    ['A bacterium divides every 20 minutes. Calculate how many there are after 1 hour.', '60 ÷ 20 = 3 divisions, and 2 × 2 × 2 = 8 bacteria'],
    ['Explain why prokaryotes are found almost everywhere.', 'They are tiny, divide fast and need little, so they reach and fill almost any place.'],
    ['State one example of evidence that natural selection is happening now.', 'Bacteria that become resistant to antibiotics, or the changing beaks of the Daphne Major finches.'],
    ['State two parts of a prokaryotic cell that your cells also have.', 'Any two of: cell membrane, cytoplasm, ribosomes, DNA.'],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (natural selection happening now, from the evolution unit: it is the seed of Lesson 6) and Q6 (the parts of a prokaryote, Lesson 1).\n\n'
    + 'Q1 IS OBJECTIVE 1: any three of the five. Q2 IS OBJECTIVE 2: listen for the DNA copying and the identical cells; a student who says "it divides in half" has missed the DNA. Q3 IS THE METHOD: 60 ÷ 20 = 3 divisions, then 2 × 2 × 2 = 8. If they say 6, ask them to draw it (1, 2, 4, 8). Q4 IS OBJECTIVE 3: small, fast and little needed. Q5: antibiotic resistance or the beaks. If a student names resistance, say "that is the last lesson of this unit". Q6: cell membrane, cytoplasm, ribosomes and DNA are shared.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "what stops them taking over the world?" (food and space run out). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
K.youDo({
  kind: 'worksheet',
  cards: [
    ['BRONZE', 'Count it', 'Finish the doubling table. List what prokaryotes share. Describe binary fission.'],
    ['SILVER', 'Compare it', 'Two bacteria that divide at different speeds. Why the sum multiplies. Why they do not take over.'],
    ['GOLD', 'Go bigger', 'Hours of growth and very big numbers, and an explanation using all five characteristics.'],
  ],
  note: 'Choose a tier. Read the worked example first. A calculator is fine.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark. Four clicks: the three tiers, then the note.\n\n'
    + 'THEY CHOOSE A TIER, and the choice is deliberate. Bronze is the doubling table and the facts (aim for about four right out of five). Silver is two bacteria at different speeds, a "why does that step work?" and the honest question about why they do not take over. Gold is bigger numbers (hours of growth, 2^30) and an explanation. EVERY TIER HAS A WORKED EXAMPLE TO READ AND A HALF-WORKED ONE TO FINISH, and the questions are mixed on purpose, so they have to choose what to do each time. Say so; it looks like a mistake otherwise.\n\n'
    + 'THE WORKSHEET IS ON GOOGLE CLASSROOM, and the answers are UPSIDE DOWN on the last page. There are no mini whiteboards in this room, and a calculator is fine for the big powers (the 2^x button).\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "are you counting minutes, or divisions?" The commonest error is multiplying 2 by the number of minutes, or by the number of divisions, instead of multiplying 2 by itself. If Bronze is producing lots of errors, the problem is the I Do: go back to 1, 2, 4, 8. AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  bullets: [
    'Five things prokaryotes share: one cell, no nucleus, very small, divide in two, almost every habitat.',
    'Binary fission: the DNA copies, the cell grows, a new wall forms across the middle, and it splits into two identical cells.',
    'Divisions = minutes ÷ time for one division. Bacteria = 2 multiplied by itself that many times.',
    `1 bacterium, 1 division every 20 minutes: ${D.h1.cells} after 1 hour, ${n(D.h4.cells)} after 4 hours, about 69 billion after 12 hours.`,
  ],
  notes:
    'MARK. 3 minutes. One click: the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. Every number is checked in build/prokaryotes-check.py: 8, 64, 512, 4,096, 262,144, 1,073,741,824 and 68,719,476,736. For the big ones accept a number rounded sensibly (about 4,100). The explanations (Q4, Q9, Q14) have a list of points in the answers: mark each point.\n\n'
    + 'WALK ROUND for the three commonest mistakes: multiplying by the number of divisions (3 × 2 = 6) instead of 2 multiplied by itself; counting minutes, not divisions; and writing that bacteria "divide in half" without the DNA being copied.',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['Most prokaryotes reproduce by binary fission.', 'TRUE'],
    ['A bacterium that divides every 20 minutes makes 6 bacteria in 1 hour.', 'FALSE'],
    ['Binary fission makes two cells that are different from each other.', 'FALSE'],
    ['Bacteria could keep doubling every 20 minutes for ever.', 'FALSE'],
    ['Prokaryotes live almost everywhere because they are small and divide fast.', 'TRUE'],
  ],
  closing: 'Next lesson: the bacteria. Their shapes, and how they get their energy.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): 3 divisions, so 2 × 2 × 2 = 8, not 3 × 2 = 6. Ask "how do you know?" (1, 2, 4, 8). Q3: the two cells are identical (apart from a rare copying mistake): there is no mixing of DNA in binary fission. Q4: food, space and other things run out; the cells stop dividing and many die. That is why the Earth is not covered in bacteria. Q1 and Q5 are TRUE (objectives 2 and 3).\n\n'
    + 'THE CLOSING LINE POINTS FORWARD: Lesson 3 is the bacteria: three shapes, and how they get their energy (some make food using light, some feed on dead things, some on living hosts, some use chemicals). The Do Now will be a doubling calculation again, because that needs spacing.',
});

K.write();

/**
 * Y8 Science, Prokaryotes, Lesson 6: Pathogens And Antibiotics. Class 8I. Single, 50 minutes. Culture palette, carried on from the unit. THE LAST TEACHING LESSON:
 * the plenary closes the unit.
 *
 * PREVIOUS (per the unit plan): objective 3 is natural selection applied, so the Do Now is a natural selection retrieval (Q3 and Q4), and this lesson EXTENDS what
 * the class already knows: antibiotic resistance appeared in Natural Selection In Action and the Fossils And The Fossil Record Do Now. The previous lesson in the unit is
 * The Bacteria We Need (built in the same batch, out/The Bacteria We Need): it set up the YOGHURT flask, to be read at the start of this lesson, and promised
 * "pathogens and antibiotics".
 *
 * THE LAST THREE 8I DO NOWS (The Bacteria We Need, Archaea And Extreme Places, The Bacteria) were read: nothing here repeats.
 * WE DO: RANK AND CONQUER on the 6-mark style question "Explain how bacteria become resistant" (the last We Do was Finish It Off). You Do: the TRUE OR FALSE BLITZ.
 * FACTS (checked this session): "feeling better means most of them are dead" is NOT used (see the notes); resistance takes weeks to months in a patient, not days.
 */
const K = require('./prokaryotes-kit')({ lesson: 'Pathogens And Antibiotics', subject: 'Y8 Science · Prokaryotes · Lesson 6 · 8I' });
const DATA = require('./prokaryotes.data.json');
const { S, C, F, M, RIGHT, CW, BODY_Y, TITLE_Y, W, H } = K;
const A = DATA.antibiotics, D2 = DATA.doubling;
const n = (x) => x.toLocaleString('en-GB');

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
K.doNow({
  preview: 5,
  qs: [
    ['Explain why a plasmid is used to carry the human insulin gene into a bacterium.', 'A plasmid is a small loop of DNA that bacteria take in and copy, so every new cell has the gene.'],
    ['State where most of your gut bacteria live, and how many there are compared with your own cells.', 'The large intestine. About as many bacterial cells as human cells.'],
    ['Name the four things natural selection needs.', 'Variation, competition, survival and inheritance.'],
    ['Most beetles are brown, and birds eat brown ones more often. Explain why green beetles become more common.', 'Green ones survive more often and reproduce, so they pass on green. The variation was already there by chance.'],
    [`A population of ${n(A.million.total)} bacteria has 1 resistant bacterium in every ${n(A.million.one_in)}. Calculate how many are resistant.`, `${n(A.million.total)} ÷ ${n(A.million.one_in)} = ${A.million.resistant} bacteria`],
    ['Suggest why a doctor will not give antibiotics for a cold.', 'A cold is caused by a virus, and antibiotics do not work on viruses.'],
  ],
  notes:
    'DO NOW. 10 minutes, the standard length. Six clicks, one answer each.\n\n'
    + 'FIRST, THE YOGHURT. Before they start, put each group\'s flask on its table. One person per group looks at it, smells it from a distance (do not put your nose over it), tests the pH with pH paper, and writes the result in the table on the last page of last lesson\'s worksheet (it should be about 4.3 to 4.6; the milk was about 6.7). Warm and set: success, the bacteria turned the milk sugar into lactic acid. Runny and still smelling of milk: it was too cool or too hot, or the yoghurt was not live: that is a result too. NO TASTING. When the others are done, dispose of the cultures as microbiological waste (disinfectant, or the technician). Two minutes. Then the Do Now.\n\n'
    + 'I READ out/The Bacteria We Need (Lesson 5, built in the same batch) and checked every question against the last three Do Nows in the class (The Bacteria We Need, Archaea And Extreme Places, The Bacteria). Nothing repeats.\n\n'
    + 'THE MIX FOLLOWS TEMPLATE.md AND THE UNIT PLAN. Q1 and Q2 are LAST LESSON (why a plasmid; the gut). Q3 and Q4 ARE A NATURAL SELECTION RETRIEVAL, as the plan asks: the four things it needs, and a beetle case with a bird as the selection pressure. The mechanism is in the room before resistance is named, and the class has already met antibiotic resistance (Natural Selection In Action, Fossils And The Fossil Record). Q5 is maths: a resistant fraction that the I Do uses again. Q6 PREVIEWS TODAY and cannot be answered fully yet: its card is shaded and it says "Suggest".\n\n'
    + 'Q1: a plasmid is a small loop that bacteria can take in and copy; it is copied when they divide. Q2: large intestine; about as many. Q3: variation, competition, survival, inheritance. Q4: the variation was already there; birds select; green survive and reproduce. Q5: 1,000,000 ÷ 100,000 = 10. Q6: a cold is viral and antibiotics do not work on viruses: the second I Do explains why.\n\n'
    + 'CHANGE THE DATE (top right) before you teach: it is left blank for you to type.',
});

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
K.today({
  goals: ['Define a pathogen, and name two bacterial diseases.', 'Explain how an antibiotic works, and what it cannot treat.', 'Explain how bacteria become resistant to an antibiotic.'],
  banner: [['Antibiotic resistance is ', false], ['natural selection', true], [' in bacteria, and it is happening ', false], ['now', true], ['.', false]],
  notes:
    'OBJECTIVES. 1 minute. Four clicks: the three objectives, then the banner.\n\n'
    + 'WHERE THIS SITS. THE LAST TEACHING LESSON OF THE UNIT. Lessons 1 to 5 were what a prokaryote is, how it lives, the bacteria, the archaea and the bacteria we need. Today is the other side: the few that make us ill, and what happens when the medicines stop working. FOUR LESSONS CONVERGE ON THE THIRD OBJECTIVE, which is why it comes last: the plasmid (Lesson 1), the doubling number (Lesson 2), binary fission (Lesson 2) and natural selection (the evolution unit).\n\n'
    + 'SAY IT OUT LOUD: "RESISTANCE IS NOT A NEW MECHANISM. IT IS NATURAL SELECTION, WHICH YOU ALREADY KNOW, HAPPENING IN BACTERIA." Read the banner and move on.',
});

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
K.hook({
  question: 'Some bacteria now survive almost every antibiotic we have. How do bacteria become resistant?',
  qSize: 21,
  picture: { key: 'bac_discs', w: 1.75, h: 1.75, y: 0.60 },
  opts: ['They learn to cope with the drug.', 'A few were already resistant, and the drug leaves them.', 'The drug changes them into resistant bacteria.'],
  notes:
    'HOOK. 2 minutes. Three cards on one click.\n\n'
    + 'The photograph is a Petri dish with discs of different antibiotics on a lawn of bacteria: the clear rings round some discs are where the drug killed the bacteria. Show of hands for each option, and WRITE THE TALLY ON THE BOARD. Do not settle it yet: the second I Do does, and you will point at the tally.\n\n'
    + 'ANSWER, FOR YOU: B. A few bacteria in a population were already resistant, because of a chance change (a mutation) in their DNA, BEFORE the drug arrived. The drug does not cause the change. It kills the others, so the resistant ones are left and reproduce. (This was shown in the 1940s and 1950s: Luria and Delbrück found the resistant mutants arise before the selecting agent, and the Lederbergs found resistant colonies on plates that had never met the drug.)\n\n'
    + 'EXPECT MOST VOTES FOR A AND C. A is the commonest idea: "they learn" or "they adapt". Nothing learns, and the individual bacterium does not change. A COMMITMENT THAT IS WRONG IS CORRECTED MORE STRONGLY (PEDAGOGY.md): say "write your vote down".\n\n'
    + 'A FEW NUMBERS TO HAVE READY, FOR WHY IT MATTERS: in 2021 about 1.1 million people died directly because of drug-resistant bacterial infections, and these infections were linked to about 4.7 million deaths (Lancet, 2024); WHO reports that about 1 in 6 laboratory-confirmed bacterial infections worldwide in 2023 was resistant to antibiotics.',
});

/* ================================================================== *
 * 4. I DO · 3: pathogens and antibiotics (objectives 1 and 2)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'Pathogens and antibiotics');
  const g = 0.28, hw = (CW - g) / 2, y0 = 1.84, ch = 2.72;
  // pathogen card
  K.card(s, { x: M, y: y0, w: hw, h: ch, line: C.alert, lineWidth: 1.8, name: 'path' });
  K.kicker(s, 'NEW WORD: PATHOGEN', M + 0.24, y0 + 0.10, hw - 0.48, 'path_h', { size: 13.5, color: C.alert });
  s.addText([
    { text: 'A pathogen is a microorganism that causes disease.', options: { bold: true, color: C.dark, fontSize: 18, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Tuberculosis (TB): ', options: { bold: true, color: C.alert } }, { text: `spreads through the air. In ${A.tb.year}, ${A.tb.ill_m} million people fell ill and ${A.tb.died_m} million died.`, options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Cholera: ', options: { bold: true, color: C.alert } }, { text: 'spreads in water that has been contaminated.' },
  ], { x: M + 0.24, y: y0 + 0.50, w: hw - 0.48, h: ch - 0.58, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'top', margin: 0, lineSpacing: 20, objectName: 'path_t' });
  // antibiotic card
  K.card(s, { x: M + hw + g, y: y0, w: hw, h: ch, line: C.accentInk, lineWidth: 1.8, name: 'anti' });
  K.kicker(s, 'NEW WORD: ANTIBIOTIC', M + hw + g + 0.24, y0 + 0.10, hw - 0.48, 'anti_h', { size: 13.5 });
  s.addText([
    { text: 'An antibiotic is a medicine that kills bacteria, or stops them multiplying.', options: { bold: true, color: C.dark, fontSize: 18, breakLine: true, paraSpaceAfter: 8 } },
    { text: 'Penicillin stops bacteria building their cell wall. Your cells have no cell wall, so they are not harmed.' },
  ], { x: M + hw + g + 0.24, y: y0 + 0.50, w: hw - 0.48, h: ch - 0.58, color: C.ink, fontFace: F.body, fontSize: 16, valign: 'top', margin: 0, lineSpacing: 20, objectName: 'anti_t' });
  // bacteria / viruses
  const y1 = y0 + ch + 0.16, ch2 = 1.18;
  s.addText([{ text: 'BACTERIA: antibiotics work. ', options: { bold: true, color: C.support } }, { text: 'Tuberculosis, cholera.', options: { color: C.ink } }], {
    shape: S.roundRect, rectRadius: 0.10, x: M, y: y1, w: hw, h: ch2, fill: { color: 'FFFFFF' }, line: { color: C.support, width: 2 }, fontFace: F.body, fontSize: 17, align: 'center', valign: 'middle', margin: 0.12, objectName: 'yes_chip',
  });
  s.addText([{ text: 'VIRUSES: antibiotics do nothing. ', options: { bold: true, color: C.alert } }, { text: 'Colds, flu.', options: { color: C.ink } }], {
    shape: S.roundRect, rectRadius: 0.10, x: M + hw + g, y: y1, w: hw, h: ch2, fill: { color: 'FFFFFF' }, line: { color: C.alert, width: 2 }, fontFace: F.body, fontSize: 17, align: 'center', valign: 'middle', margin: 0.12, objectName: 'no_chip',
  });
  K.sentence(s, [['Most bacteria are ', false], ['not', true], [' pathogens: only about 540 species are known to cause disease in people.', false]], { y: y1 + ch2 + 0.14, h: 0.58, size: 16, name: 'most_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the pathogen card, the antibiotic card, the bacteria chip, the viruses chip, then the banner.\n\n'
    + 'OBJECTIVES 1 AND 2. (1) PATHOGEN: a microorganism that causes disease. Bacteria, viruses, fungi and protists can all be pathogens. (Viruses are not bacteria and not cells, and scientists disagree about whether they count as living, because it depends how you define life. Say that once if a student raises it and move on.) TWO BACTERIAL DISEASES, named and not detailed: TUBERCULOSIS (TB), caused by a bacterium, which most often affects the lungs and spreads through the air when a person with TB coughs; in 2024 about 10.7 million people fell ill and 1.23 million died (WHO; if the new WHO report is out before the lesson, use its figures). CHOLERA, caused by a bacterium in contaminated food or water. (Tetanus and food poisoning would do as well.) THE BANNER IS THE POINT FROM LAST LESSON: MOST BACTERIA ARE NOT PATHOGENS; about 540 species are known to cause disease in people, a small fraction. After Lesson 5 they should find that unremarkable. (2) ANTIBIOTIC: a medicine that kills bacteria or stops them multiplying. How it works, the example everyone has heard of: PENICILLIN stops bacteria building their cell wall, so the cell bursts. Your cells have no cell wall, so it does not harm them: that is why the medicine can be strong against bacteria and gentle on you. NO TEACHING OF "bactericidal" or "bacteriostatic" TODAY.\n\n'
    + 'THE BIG POINT, THE SINGLE MOST USEFUL PIECE OF PUBLIC-HEALTH KNOWLEDGE IN THE YEAR 8 COURSE: ANTIBIOTICS KILL BACTERIA. THEY DO NOTHING TO VIRUSES. Colds and flu are caused by viruses, so antibiotics do not treat them. (A doctor may prescribe an antibiotic for a bacterial complication, such as pneumonia after flu, so say "antibiotics do not treat the virus", not "antibiotics never help someone with flu".) That settles DO NOW Q6. Hand gel is not an antibiotic: it contains alcohol (and it does not kill every germ: norovirus is one that it does not reliably kill).\n\n'
    + 'THE WORKED EXAMPLE IS THE TWO CHIPS: a bacterial infection (TB) can be treated with antibiotics; a viral one (a cold) cannot. Ask "which would you give for strep throat?" (a bacterial infection: an antibiotic) and "for a cold?" (none).'
  );
}

/* ================================================================== *
 * 5. I DO · 3: resistance (objective 3)
 * ================================================================== */
{
  const s = K.slide('light', 3, 'I Do');
  K.title(s, 'How bacteria become resistant');
  const vw = 6.15, vh = vw * 540 / 960, y0 = 1.84;
  K.video(s, 'prok-resistance', M, y0, vw, vh, 'vid_resist');
  K.sentence(s, [['The ', false], ['population', true], [' changes, not the individual bacterium.', false]], { x: M, y: y0 + vh + 0.14, w: vw, h: 0.60, size: 15.5, name: 'pop_banner' });
  const RX = M + vw + 0.26, RW = RIGHT - RX, rh = vh + 0.14 + 0.60;
  K.card(s, { x: RX, y: y0, w: RW, h: rh, name: 'steps' });
  K.kicker(s, 'THE FOUR STEPS YOU KNOW', RX + 0.20, y0 + 0.08, RW - 0.4, 'steps_h', { size: 13 });
  const STEPS = [
    ['Variation', `A few bacteria are already resistant, by chance: ${A.million.resistant} in a million.`],
    ['Selection', 'The antibiotic kills the bacteria that are not resistant.'],
    ['Survival', `The ${A.million.resistant} survivors reproduce, by binary fission.`],
    ['Inheritance', 'Their offspring are resistant too, so resistance becomes common.'],
  ];
  const rowH = (rh - 0.52) / 4;
  STEPS.forEach(([head, body], i) => {
    const y = y0 + 0.46 + i * rowH;
    K.badge(s, { x: RX + 0.18, y: y + (rowH - 0.42) / 2, n: i + 1, name: `st${i}` });
    s.addText([{ text: head + ': ', options: { bold: true, color: C.accentInk } }, { text: body, options: { color: C.ink } }], { x: RX + 0.74, y, w: RW - 0.90, h: rowH, fontFace: F.body, fontSize: 13.5, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `st${i}_t` });
  });
  K.sentence(s, [['Resistance can also pass to other bacteria on a ', false], ['plasmid', true], ['. Take antibiotics ', false], ['exactly as the doctor says', true], ['.', false]], { y: y0 + rh + 0.16, h: 0.62, size: 16, name: 'adv_banner' });
  s.addNotes(
    'I DO. 3 minutes. Seven clicks: the animation (ON CLICK, so say the idea first), then the four steps one at a time (the first brings in the heading too), the first banner, then the second banner. POINT AT THE HOOK TALLY: the answer was B.\n\n'
    + 'OBJECTIVE 3, AND THE MOST IMPORTANT PIECE OF THE UNIT. RESISTANCE IS NATURAL SELECTION, WITH THE SAME FOUR STEPS THEY KNOW, AND YOU SAY SO OUT LOUD. DO NOT TEACH IT AS A NEW MECHANISM. (1) VARIATION: in any large population of bacteria, a few happen to carry a mutation that lets them survive the drug. IT WAS THERE BEFORE THE DRUG. With the numbers from the Do Now: in a million bacteria, one in every 100,000 is resistant: 10 bacteria. (2) SELECTION: the antibiotic is the SELECTION PRESSURE. It kills the bacteria that are not resistant (999,990 of them). (3) SURVIVAL: the 10 survivors reproduce by binary fission, which they have met (Lesson 2): each division doubles the number. In the best case, 20 minutes a division with plenty of food, 10 survivors become 5,120 in 3 hours (10 × 2^9). (4) INHERITANCE: binary fission makes copies, so the offspring are resistant too, and the resistant bacteria become the whole population. HOW LONG DOES IT REALLY TAKE? Not 3 hours: in a patient, bacteria divide much more slowly than in the best laboratory conditions, and resistance takes weeks to months to take over (and in a laboratory dish it can build up in days to weeks). Do not say "days" for a patient. MRSA was first found within about a year of methicillin being introduced, but do not say the drug caused it: the resistant lineage may have existed already.\n\n'
    + 'THE ANIMATION (about 40 seconds, you can click it to play again) SHOWS EXACTLY THIS: a patient sample of about 40 bacteria, two of them already resistant (marked in a way that survives a black-and-white print); the antibiotic arrives and the others die; the survivors divide and their offspring carry the same mark; later the whole sample is resistant. Then a SECOND SCENE: a resistant bacterium passes a copy of a plasmid to a neighbour, and the neighbour is resistant too. THAT IS DNA MOVING SIDEWAYS, NOT PARENT TO CHILD, from Lesson 1. That is how resistance can spread even between different species (the 2023 reports of a plasmid moving from one species to another are well documented), and it is why the plasmid in Lesson 1 mattered. Not every resistance gene is on a plasmid, so say "can".\n\n'
    + 'THE FIRST BANNER IS THE KEY IDEA: THE POPULATION CHANGES, NOT THE INDIVIDUAL BACTERIUM. WORDS TO AVOID, AND CORRECT IF YOU HEAR THEM: "the bacteria BECAME IMMUNE" (immunity is what your body develops; resistance is what a population of bacteria evolves), "the bacteria LEARNED to resist", "ADAPTED" and "got used to it", "FOUGHT BACK" (nothing decides anything), and "YOUR BODY GETS RESISTANT" (bacteria become resistant, people do not; a person can carry resistant bacteria).\n\n'
    + 'THE PRACTICAL CONSEQUENCE, THE SECOND BANNER, REWORDED AFTER FACT-CHECKING. The unit plan said "finish the course, because feeling better means most of them are dead, not all". That is partly accurate but it is not what the NHS says, and it is debated (a 2017 BMJ paper argued that the evidence for "always finish the course" is weak, and that shorter courses may be better). THE SAFE, TRUE, YEAR 8 MESSAGE: take antibiotics exactly as the doctor or pharmacist tells you. Do not stop early, change the dose, save the leftovers or share them unless a health professional says so. Antibiotics do not kill every bacterium at once, and you can feel better while some bacteria are still alive; the doctor chooses the length of the course to suit the infection. Every use of an antibiotic is a selection pressure, which is why they should only be used when needed.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5: Rank And Conquer
 * ================================================================== */
K.weDoRC({
  minutes: 5,
  question: 'Explain how bacteria become resistant to an antibiotic. (4 marks: variation, selection, survival and inheritance.)',
  answers: [
    { text: 'The bacteria learn to cope with the antibiotic, so they become immune and can survive it.', rank: 4, reason: '0 marks. Nothing learns, and the bacteria do not become immune.' },
    { text: 'The antibiotic kills the bacteria that are not resistant, so the resistant ones are left.', rank: 3, reason: '2 marks. Selection and survival, but no variation or inheritance.' },
    { text: 'A few bacteria were already resistant. The antibiotic kills the rest, so the resistant ones survive and become more common.', rank: 2, reason: '3 marks. Variation, selection and survival. It does not say they reproduce.' },
    { text: 'A few bacteria were already resistant, by chance. The antibiotic kills the rest. The survivors reproduce and pass resistance on, so the population becomes resistant.', rank: 1, reason: '4 marks. Variation, selection, survival and inheritance.' },
  ],
  upgradedFrom: 'A',
  upgraded: 'A few bacteria were already resistant, by chance. The antibiotic kills the ones that are not resistant. The resistant bacteria survive, reproduce and pass resistance on to their offspring, so the population changes. No individual learns anything.',
  notes:
    'WE DO. 5 minutes. Five clicks. THE MODE IS RANK AND CONQUER (TEMPLATE.md): four answers to one question, and they rank them. The last We Do was Finish It Off. It needs a REASON from the room, not a word. THIS IS THE EXAM-STYLE EXPLANATION THE ASSESSMENT WILL USE: the same four points are its mark scheme, so what they rank today is what they will write later.\n\n'
    + 'THE RANKING COMES FROM THE MARK SCHEME, NOT TASTE. Four marks: (1) VARIATION: a few were already resistant, by chance, before the drug; (2) SELECTION: the antibiotic kills the ones that are not resistant; (3) SURVIVAL: the resistant ones survive and reproduce; (4) INHERITANCE: they pass resistance on, so it becomes common. COUNT WHAT EACH ANSWER HAS. D has all four: 4 marks, first. C has variation, selection and survival: 3 marks, second. B has selection and survival only: 2 marks, third. A has none and holds the two misconceptions, "learn" and "immune": 0 marks, fourth.\n\n'
    + 'RANK. Read the four answers. Ask the class to commit by a show of hands: which is the WEAKEST, which is the STRONGEST. Ask a student for the reason and for the mark point that is missing. Then click: the screen reveals the ranking one card at a time, weakest and strongest first (A, then D), then C, then B.\n\n'
    + 'CONQUER. The last click shows the UPGRADED version of A, the answer that holds the lesson\'s main misconception ("learn", "immune"). Build it with them first: "what is wrong with A?" (nothing learns; it is not immunity; and it leaves out variation), then click and compare with theirs.\n\n'
    + 'IF A STUDENT SAYS "B IS RIGHT, THAT IS WHAT HAPPENS": B is true, and it is a good answer that stops two points short. Ask "where did the resistant ones come from?" IF SHORT OF TIME, skip the reasons for B and C.',
});

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
K.coldCall({
  qs: [
    ['Define a pathogen.', 'A microorganism that causes disease.'],
    ['Name two bacterial diseases.', 'Any two of: tuberculosis, cholera, tetanus, food poisoning.'],
    ['Explain why an antibiotic will not help a cold.', 'A cold is caused by a virus. Antibiotics kill bacteria and do nothing to viruses.'],
    ['Explain how bacteria become resistant to an antibiotic.', 'A few are already resistant. The drug kills the rest. The survivors reproduce and pass resistance on.'],
    ['Name two ways bacteria help us.', 'Any two of: recycling dead things, fixing nitrogen, helping digestion, making food, making insulin.'],
    ['A bacterium divides every 20 minutes. Calculate how many there are after 2 hours.', `120 ÷ 20 = ${D2.h2.divisions} divisions, and 2^${D2.h2.divisions} = ${D2.h2.cells} bacteria`],
  ],
  notes:
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask: thinking time first, no hands up, no whiteboards. If a student cannot answer, take it elsewhere and come back to them to repeat it.\n\n'
    + 'TWO OF THE SIX ARE FROM EARLIER LESSONS (TEMPLATE.md): Q5 (the helpful bacteria, Lesson 5) and Q6 (the doubling sum, Lesson 2).\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVE 1. Q3 IS OBJECTIVE 2: listen for "virus" AND "antibiotics kill bacteria". Q4 IS OBJECTIVE 3: listen for all four steps, and for the words "learn" and "immune": if you hear one, ask "what did the antibiotic actually do?". Q5: two jobs. Q6: 120 ÷ 20 = 6 divisions, 2^6 = 64.\n\n'
    + 'IF MOST OF THE ROOM IS RIGHT BY Q4, ask "how can resistance spread to a bacterium that has not met the drug?" (a resistance plasmid passed from another bacterium). IF SHORT OF TIME, cut Q6.',
});

/* ================================================================== *
 * 8. YOU DO · 14: the game
 * ================================================================== */
K.youDo({
  kind: 'game',
  cards: [
    ['ROUND 1', 'The unit so far', 'True or false, from all six lessons. Seven statements.'],
    ['ROUND 2', 'Antibiotics', 'The mistakes people make about medicines. Seven statements.'],
    ['ROUND 3', 'Beat the game', 'Very hard. Careful wording, and some are meant to be almost impossible. Six statements.'],
  ],
  note: 'No timer on the statements. Read the feedback. Stop and see your results any time. Finished? The worksheet is there too.',
  notes:
    'YOU DO. 14 minutes, then 3 to mark (the next slide). Four clicks: the three rounds, then the note. THE GAME IS THE TRUE OR FALSE BLITZ (the unit plan asked for it here: twenty statements built from the misconceptions, spanning the whole unit). The worksheet is the fallback, built every time.\n\n'
    + 'WHAT THEY DO. Open "Pathogens And Antibiotics game" from Google Classroom. Twenty statements in three rounds (seven, seven and six). One statement at a time: TRUE or FALSE (the T and F keys, or 1 and 2). After each, the game says whether it was right and why, and names the slip. A stopwatch runs for each round, and it does not count for anything. EVERY STUDENT GETS A DIFFERENT GAME: each idea is written two ways, one true and one false, drawn from a bigger bank, so a neighbour\'s statement may be the opposite of yours; ten statements are true and ten false for everyone. The skills and their order are the same for everyone. Each game has a six-character code on the start and end screens; add #CODE to the file\'s address to see exactly what a student saw. No lives, no penalty for being slow.\n\n'
    + 'THE DIFFICULTY RAMPS ON PURPOSE, AND THE TOP IS MEANT TO BE HARD. Round 1 spans the whole unit: no nucleus, plasmids, binary fission, the doubling sum, archaea, cyanobacteria, the gut, nitrogen, insulin, bread, methanogens. Round 2 is built from today\'s misconceptions: "antibiotics cure colds", "keep leftovers", "your body becomes resistant", "the drug makes them resistant", "they learn", plasmids, viruses, "all bacteria are harmful", TB, cholera, hand gel, and resistance as natural selection. Round 3 goes far past the lesson: careful wording (a single bacterium does not change in its lifetime; why bacteria evolve faster than animals; a plasmid to another species; why unneeded antibiotics matter; a virus that infects bacteria; the insulin gene on a plasmid and not in a nucleus). Expect most of the room to miss some of the last six. That is the design. Tell them before they start, so nobody reads a red mark as "I am bad at science".\n\n'
    + 'AT THE END OF EACH ROUND, and again on the last screen, there is a drop-down with how long each took, whether it was right and, for a wrong one, what the student answered and why. There is a "Stop and see my results" button on every statement.\n\n'
    + 'ON AN iPAD, an HTML file attached in Google Classroom can be awkward to open. Check before relying on it. If a student cannot open it, finishes early or is absent, the worksheet is the fallback: fourteen questions in Bronze, Silver and Gold, with the answers UPSIDE DOWN on its last page.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "did the bacterium change, or did the population change?" AT THE END OF 14 MINUTES, stop them and go straight to the Mark slide.',
});

/* ================================================================== *
 * 9. MARK · 3
 * ================================================================== */
K.mark({
  gameLine: ['Played the game? ', 'Open the drop-down for each round. Read what you got wrong, and why.'],
  bullets: [
    'A pathogen is a microorganism that causes disease. Most bacteria are not pathogens.',
    'Antibiotics kill bacteria, or stop them multiplying. They do nothing to viruses, such as colds and flu.',
    'Resistance: a few bacteria are already resistant, the antibiotic kills the rest, the survivors reproduce, their offspring are resistant.',
    'Take antibiotics exactly as the doctor says.',
  ],
  notes:
    'MARK. 3 minutes. Two clicks: the game line, then the checklist. THE INSTRUCTION ON THE SLIDE IS "Turn to the back. Mark your own in a different colour." (TEMPLATE.md). Not optional, and not absorbed into the You Do.\n\n'
    + 'ON THE WORKSHEET the answers are UPSIDE DOWN at the foot of the last page. The numbers: 1,000,000 ÷ 100,000 = 10, 2,000,000 ÷ 500,000 = 4, 4 × 2^6 = 256, 10 × 2^9 = 5,120 and 1.23 ÷ 10.7 × 100 = 11% (checked in build/prokaryotes-check.py). ON THE GAME, the drop-down for each round shows the reason for every statement.\n\n'
    + 'WALK ROUND for the three commonest mistakes: "the bacteria learned"; "my body got resistant"; and "antibiotics for a cold".',
});

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
K.plenary({
  qs: [
    ['A pathogen is a microorganism that causes disease.', 'TRUE'],
    ['Antibiotics cure colds.', 'FALSE'],
    ['Your body becomes resistant to antibiotics.', 'FALSE'],
    ['Keeping leftover antibiotics for the next time you feel ill is a good idea.', 'FALSE'],
    ['Resistant bacteria become common because the antibiotic kills the ones that are not resistant.', 'TRUE'],
  ],
  closing: 'No nucleus. More of them than anything else. And most of them keep you alive.',
  notes:
    'PLENARY. 3 minutes. Eleven clicks: each statement, then its answer, then the closing line. THE LAST TEACHING LESSON, SO THE PLENARY CLOSES THE UNIT.\n\n'
    + 'EVERY FALSE IS A MISCONCEPTION FROM TODAY. Q2: colds are viral and antibiotics do not work on viruses. Q3: bacteria become resistant, people do not; a person can carry resistant bacteria. Q4 IS THE APPLIED ITEM (TEMPLATE.md asks for at least one): leftovers are the wrong drug for the wrong infection, and every use is a selection pressure on all the bacteria in and on you. Ask "what should you do?" (take them exactly as the doctor says; never save or share them). Q1 and Q5 are TRUE (objectives 1 and 3).\n\n'
    + 'THE CLOSING LINE CLOSES THE UNIT, as the unit plan asks, in three parts: A PROKARYOTE IS A CELL WITH NO NUCLEUS (Lesson 1); THERE ARE MORE OF THEM THAN ANYTHING ELSE (Lesson 2: about 10^30 bacteria and archaea on Earth); AND MOST OF THEM KEEP YOU ALIVE (Lesson 5). Say it, and say the sentence the unit started on: "a prokaryote is not simple; it is different, and it is everywhere". The unit assessment is next: it covers all six lessons.',
});

K.write();

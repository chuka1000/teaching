/**
 * Prokaryotes assessment (8I): the questions, the mark scheme and the feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full before writing anything): Inside A Prokaryote, How Prokaryotes Live, The Bacteria, Archaea And Extreme Places, The Bacteria We Need and
 * Pathogens And Antibiotics (all built in this batch, out/). Nothing is tested that is not in them. NOTES from the unit plan: weight it towards objective 3
 * of Lesson 6 (Q9: six marks, credited as four ideas with six mark points so partial credit works); include a prokaryote diagram to label (Q2), a doubling
 * calculation (Q4), a bacterium / archaean / neither classification (Q3), two uses of bacteria (Q7), a short question on why an antibiotic will not help a
 * cold (Q8), and the definitions as quick recall marks in the opening (Q1). The Extend variant of the resistance question asks why resistance spreads
 * between different species of bacteria (plasmids); Support and Consolidate do not. NO LATIN SPECIES NAMES anywhere in the paper.
 *
 * 45 marks in 45 minutes. Numbers come from prokaryotes-assessment.numbers.json (written by prokaryotes-assessment-check.py with sympy).
 */
const NUM = require('./prokaryotes-assessment.numbers.json');
const n = (x) => Number(x).toLocaleString('en-GB').replace(/,/g, ' ');     // 1 000 000

const T = NUM.q4_table, Q4 = NUM.q4, Q9 = NUM.q9, FB = NUM.feedback;

/* --------------------------------------------------------------------- *
 * The paper. Each part: label, text, marks, and the answer space.
 * `space`: number of ruled lines (one mark, one line; four marks, five or six).
 * `kind`: labels (letters to name), classify (a table to tick), tablefill (the doubling table), calc (working lines and an answer line).
 * --------------------------------------------------------------------- */
const QUESTIONS = [
  { n: 1, marks: 5, lesson: 'Inside A Prokaryote; Pathogens And Antibiotics',
    stem: null,
    parts: [
      { l: '(a)', t: 'Define the term prokaryote.', m: 2, space: 3 },
      { l: '(b)', t: 'Define the term pathogen.', m: 1, space: 2 },
      { l: '(c)', t: 'State what an antibiotic is.', m: 1, space: 2 },
      { l: '(d)', t: 'State what a plasmid is.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['an organism whose cell has no nucleus (a single-celled organism with no nucleus);', 'its DNA is loose in the cytoplasm (not inside a membrane);'],
        note: 'Accept "a cell with no nucleus" for the first mark. Accept "the DNA is in the cytoplasm" or "DNA is in a loop in the cell" for the second. Reject "a simple cell" or "a bacterium" on its own (an archaean is a prokaryote too).' },
      { l: '(b)', pts: ['a microorganism (or organism) that causes disease;'], note: 'Accept "a germ that makes you ill". Reject "a bacterium that causes disease" for a definition with bacteria only, since viruses are pathogens too.' },
      { l: '(c)', pts: ['a medicine (drug) that kills bacteria (or stops them multiplying);'], note: 'Accept "a drug used to treat bacterial infections". Reject "kills germs" or "kills viruses".' },
      { l: '(d)', pts: ['a small loop (ring) of DNA, separate from the main DNA (an extra loop of DNA in a bacterium);'], note: 'Accept "a spare circle of DNA". Reject "part of the main DNA".' },
    ],
    wrong: '(a): "a simple cell" or "a cell with no DNA"; (b): "a bacterium"; (c): "kills germs" with no mention of bacteria; (d): "a bacterium that carries a gene".' },

  { n: 2, marks: 5, lesson: 'Inside A Prokaryote',
    stem: 'The diagram shows a bacterial cell. Some of the parts are labelled with letters.',
    image: 'prok_bw_lettered.png', imageW: 5.6,
    parts: [
      { l: '(a)', t: 'Write the name of the parts labelled A, C, E and F.', m: 4, kind: 'labels', letters: ['A', 'C', 'E', 'F'] },
      { l: '(b)', t: 'Part B, part D and part G are all found in the cells of your body too. State the name of one of them.', m: 1, space: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['A: cell wall;', 'C: plasmid;', 'E: main DNA loop (the DNA, the chromosome);', 'F: flagellum (tail);'],
        note: 'One mark each. Accept "DNA" for E. Reject "nucleus" for E (a bacterium has none), and reject "cell membrane" for A.' },
      { l: '(b)', pts: ['one of: ribosomes (B); cell membrane (D); cytoplasm (G);'], note: 'Accept the letter with the name, or the name alone. Reject "DNA" (it is not one of B, D or G).' },
    ],
    wrong: '(a): E written as "nucleus"; A written as "membrane", because the wall and the membrane are swapped; F written as "tail" is accepted.' },

  { n: 3, marks: 5, lesson: 'Archaea And Extreme Places',
    stem: 'Microbes can be bacteria or archaea. Some cells are neither.',
    parts: [
      { l: '(a)', t: 'Tick one box in each row to show whether the cell is a bacterium, an archaean or neither.', m: 3, kind: 'classify',
        rows: ['A methane-making microbe in a cow’s stomach', 'A yeast cell', 'A cyanobacterium in a pond'] },
      { l: '(b)', t: 'A scientist finds a cell with no nucleus in a hot spring. She says: “It must be an archaean.” Explain why she cannot be sure.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['methane-making microbe: archaean;', 'yeast cell: neither;', 'cyanobacterium: bacterium;'],
        note: 'One mark for each row. More than one tick in a row scores 0 for that row.' },
      { l: '(b)', pts: ['bacteria (for example cyanobacteria) live in hot springs too (a hot place does not decide the group);', 'she would need to find out its chemistry (cell wall, cell membrane) or its DNA;'],
        note: 'Accept "archaea and bacteria look the same" for the second point if it leads to "so you cannot tell by looking". Reject "because it has no nucleus" on its own (both groups have none).' },
    ],
    wrong: '(a): the yeast cell ticked as a bacterium ("it is a tiny single cell"); (b): "it has no nucleus" or "it could be a virus".' },

  { n: 4, marks: 4, lesson: 'How Prokaryotes Live',
    stem: 'One bacterium divides into two every 20 minutes. It has plenty of food and none of the bacteria die.',
    parts: [
      { l: '(a)', t: 'Complete the table.', m: 2, kind: 'tablefill', given: [0, 20], missing: [40, 60, 80] },
      { l: '(b)', t: `Calculate how many bacteria there will be after ${Q4.minutes / 60} hours. Show your working.`, m: 2, kind: 'calc' },
    ],
    ms: [
      { l: '(a)', pts: [`${T[40]}, ${T[60]} and ${T[80]} (all three correct, 2 marks); two of the three correct (1 mark);`], note: 'The number doubles each row: 1, 2, 4, 8, 16.' },
      { l: '(b)', pts: [`method: ${Q4.minutes} ÷ ${Q4.gen} = ${Q4.divisions} divisions (and 2 multiplied by itself ${Q4.divisions} times, or 2^${Q4.divisions});`, `${n(Q4.bacteria)} bacteria;`],
        note: `Allow error carried forward: a wrong number of divisions that is then doubled correctly scores the second mark. ${n(Q4.bacteria)} on its own scores both marks. A number of bacteria is a count, so no unit is needed.` },
    ],
    wrong: `(a): 3, 4, 5 (adding one each time), or 4, 6, 8 (adding 2); (b): ${Q4.divisions} × 2 = ${Q4.divisions * 2}, or 3 hours × 3 divisions × 2 = 18.` },

  { n: 5, marks: 4, lesson: 'How Prokaryotes Live',
    stem: null,
    parts: [
      { l: '(a)', t: 'State two characteristics that all prokaryotes share.', m: 2, space: 2 },
      { l: '(b)', t: 'Describe how a prokaryote reproduces.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['one characteristic, from: one cell; no nucleus; very small; divide in two (binary fission); found in almost every habitat;', 'a second, different one;'],
        note: 'One mark each. Accept any two of the five. Reject "has DNA" and "alive" (not characteristics that separate prokaryotes) and "bacteria are small" without a link to prokaryotes.' },
      { l: '(b)', pts: ['the DNA is copied (the cell grows);', 'the cell splits (divides) into two identical cells (binary fission);'],
        note: 'Accept "it divides in two" for the second mark. The word "binary fission" alone, with no description, scores 1 mark at most. Reject "it mates" or "it has babies".' },
    ],
    wrong: '(a): "they are alive" and "they have DNA"; (b): "it divides in half" with no mention of the DNA being copied.' },

  { n: 6, marks: 3, lesson: 'The Bacteria',
    stem: 'Bacteria are grouped by how they get their energy.',
    parts: [
      { l: '(a)', t: 'Cyanobacteria make their own food using light. State the name for this group of bacteria.', m: 1, space: 1 },
      { l: '(b)', t: 'Some bacteria live in a dead log and feed on it. State the name for this group of bacteria.', m: 1, space: 1 },
      { l: '(c)', t: 'Giant tube worms live at a deep-sea vent where there is no light. Bacteria inside the worms make food. State the source of energy that these bacteria use.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['photosynthetic (photosynthesis);'], note: 'Accept "photosynthesising bacteria". Reject "producers" on its own.' },
      { l: '(b)', pts: ['decomposers;'], note: 'Accept "saprotrophs". Reject "parasites" and "consumers".' },
      { l: '(c)', pts: ['chemicals (the energy in chemicals, for example hydrogen sulfide);'], note: 'Accept "chemosynthesis". Reject "heat" and "the vent" with no mention of chemicals.' },
    ],
    wrong: '(b): "parasites" (the confusion of dead and living hosts); (c): "heat" or "the sea water".' },

  { n: 7, marks: 5, lesson: 'The Bacteria We Need',
    stem: null,
    parts: [
      { l: '(a)', t: 'Explain how decomposers help new plants to grow.', m: 2, space: 3 },
      { l: '(b)', t: 'Give two ways in which bacteria are useful to people. Do not use decomposers as one of your answers.', m: 2, space: 3 },
      { l: '(c)', t: 'State one thing that the bacteria in your gut do for you.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['they break down dead plants and animals (waste);', 'releasing nutrients (for example nitrogen) into the soil, which the new plants take up;'],
        note: 'Accept "they recycle nutrients". Reject "they feed the plants" with no mention of breaking down dead material.' },
      { l: '(b)', pts: ['one use, from: making food (yoghurt, cheese, sauerkraut, kimchi); making medicine (insulin, made by bacteria that carry the human gene); fixing nitrogen for plants; helping digestion in the gut;', 'a second, different use;'],
        note: 'One mark each. Reject "bread" (made with yeast, a fungus). Reject two uses that are the same idea (yoghurt and cheese score 1 mark).' },
      { l: '(c)', pts: ['helps to break down (digest) food, or fibre; or makes vitamin K;'], note: 'Accept "keeps harmful bacteria out" only if the lesson notes were used; otherwise reject. Reject "makes you ill".' },
    ],
    wrong: '(a): "they eat dead things" with no mention of nutrients going back; (b): "bread" and "yoghurt" together (bread is not made by bacteria).' },

  { n: 8, marks: 3, lesson: 'Pathogens And Antibiotics',
    stem: null,
    parts: [
      { l: '(a)', t: 'A patient has a cold. They ask the doctor for antibiotics. The doctor says no. Explain why.', m: 2, space: 3 },
      { l: '(b)', t: 'Name one disease that is caused by a bacterium.', m: 1, space: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['a cold is caused by a virus (not a bacterium);', 'antibiotics kill bacteria and do nothing to viruses;'],
        note: 'Accept "antibiotics only work on bacteria" for the second mark. Reject "the cold will go away by itself" with no mention of viruses.' },
      { l: '(b)', pts: ['one of: tuberculosis; cholera; tetanus; food poisoning (or any other genuine bacterial disease);'], note: 'Reject flu, a cold, COVID-19 and chickenpox (all viral).' },
    ],
    wrong: '(a): "antibiotics are too strong" or "the cold is not serious"; (b): flu.' },

  { n: 9, marks: 7, lesson: 'Pathogens And Antibiotics',
    stem: `A patient has an infection with ${n(Q9.total)} bacteria. One in every ${n(Q9.one_in)} of these bacteria is resistant to antibiotic X. The patient takes antibiotic X.`,
    parts: [
      { l: '(a)', t: 'Calculate how many of the bacteria are resistant to antibiotic X before the patient takes it.', m: 1, kind: 'calc1' },
      { l: '(b)', t: 'Explain how the bacteria in the patient become a population that is resistant to antibiotic X.', m: 6, space: 8 },
    ],
    ms: [
      { l: '(a)', pts: [`${n(Q9.total)} ÷ ${n(Q9.one_in)} = ${Q9.resistant};`], note: `${Q9.resistant} bacteria. A count, so no unit is needed.` },
      { l: '(b)', pts: ['VARIATION: a few of the bacteria were already resistant (before the antibiotic was taken);', 'VARIATION: this is by chance (a random mutation); the antibiotic did not cause it;',
        'SELECTION: the antibiotic kills the bacteria that are not resistant;', 'SURVIVAL: the resistant bacteria survive;', 'REPRODUCTION: the survivors reproduce (divide, by binary fission);',
        'INHERITANCE: they pass resistance on to their offspring, so most (all) of the population is resistant;'],
        note: 'Six mark points in four ideas: variation (2), selection (1), survival (1), reproduction and inheritance (2). Award each mark point separately, so a student who has two of the four ideas can score up to 3 or 4. Accept "the resistant ones live and have children" for survival and reproduction. REJECT, and do not credit: "the bacteria learned", "adapted to the drug", "became immune", "the antibiotic made them resistant", "the bacteria changed" (an individual bacterium does not change). A "weaker" or "stronger" bacterium is accepted only if the explanation makes clear it means resistant.' },
    ],
    wrong: '(a): 100 000 ÷ 1 000 000 = 0.1, or 10 000; (b): "the bacteria learned to resist", "the bacteria became immune", or "the antibiotic changed them", which score 0 or 1 (the survivors).' },

  { n: 10, marks: 4, lesson: 'Pathogens And Antibiotics; Inside A Prokaryote',
    stem: 'Two students make statements.',
    parts: [
      { l: '(a)', t: 'Student A says: “The bacteria learned to resist the antibiotic.” Explain what is wrong with this statement.', m: 2, space: 3 },
      { l: '(b)', t: 'Student B says: “Prokaryotes are simple, primitive cells.” Give two reasons why “different” is a better word than “simple”.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['bacteria cannot learn (an individual bacterium does not change);', 'a few were already resistant, by chance, and the antibiotic killed the rest, so the resistant ones were left (and reproduced);'],
        note: 'Accept "the population changes, not one bacterium" for the first mark. Reject any answer that uses "learned", "adapted" or "became immune" as a correct idea.' },
      { l: '(b)', pts: ['one reason, from: they have parts that your cells do not (cell wall, plasmids, flagellum); they live in almost every habitat; there are more of them than any other cells; they are very successful (have lived on Earth for billions of years);', 'a second, different reason;'],
        note: 'One mark each. Reject "they are small" and "they have no nucleus", which describe the difference without saying why "simple" is wrong.' },
    ],
    wrong: '(a): "they got used to the drug" (the same idea); (b): "they are very small".' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => { const s = q.parts.reduce((a, p) => a + p.m, 0); if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`); });
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S: same skill, smaller numbers, more scaffold
 *   C: same demand, fresh context
 *   E: harder, an extra step, a reversal or an unfamiliar context
 * Answers go at the end of the mark scheme.
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: { t: ['Complete the sentences. Use the words in the box.', 'A prokaryote is an organism whose cell has no ________. A pathogen is a microorganism that causes ________. An antibiotic is a medicine that kills ________. A plasmid is a small ________ of DNA.', 'Box: nucleus, disease, bacteria, loop'], a: ['nucleus; disease; bacteria; loop (ring);'] },
    C: { t: ['Define the term eukaryote. Give one example of a eukaryote.', 'State what binary fission is.'], a: ['an organism whose cells have a nucleus; for example a human, a yeast, a plant;', 'one cell copies its DNA and splits into two identical cells;'] },
    E: { t: ['A virus can be a pathogen. Explain why a virus is not a prokaryote.'], a: ['a virus is not a cell, so it cannot have a nucleus or no nucleus; it cannot reproduce on its own and has to use a host cell;'] } },
  { n: 2,
    S: { img: 'prok_bw_lettered.png', imgW: 3.0, t: ['Look at the diagram of the bacterial cell. Write the name of part C and part F. Choose from the box.', 'Box: plasmid, nucleus, flagellum, cell wall'], a: ['C: plasmid; F: flagellum;'] },
    C: { t: ['Draw a labelled diagram of a bacterial cell. Include and label the cell wall, the main DNA loop, a plasmid and a flagellum.'], a: ['a rod or oval cell with a wall and a membrane; a loop of DNA drawn loose in the cytoplasm (no nucleus); a small separate ring (plasmid); a tail (flagellum) on the outside; four labels correct;'] },
    E: { t: ['Your cells have a nucleus. A bacterium does not.', 'Describe two other differences between a bacterial cell and one of your cells.'], a: ['any two from: bacteria have a cell wall and your cells do not; bacteria may have plasmids; bacteria may have a flagellum; your cells have mitochondria and a bacterium does not; bacteria are much smaller;'] } },
  { n: 3,
    S: { t: ['Circle bacterium, archaean or neither for each.', 'A methane-making microbe in swamp mud: bacterium / archaean / neither', 'A human cheek cell: bacterium / archaean / neither', 'Hint: no nucleus and a cell means bacterium or archaean. Methane-making means archaean.'], a: ['archaean;', 'neither;'] },
    C: { t: ['Circle bacterium, archaean or neither for each.', 'A cell with no nucleus that makes yoghurt: bacterium / archaean / neither', 'A microbe that makes methane in a termite’s gut: bacterium / archaean / neither', 'A mushroom cell: bacterium / archaean / neither'], a: ['bacterium;', 'archaean;', 'neither;'] },
    E: { t: ['A cell with no nucleus lives in a salt lake. State whether it is a bacterium or an archaean, or whether you cannot tell. Explain your answer.', 'A flu virus is found in a hot spring. Explain why it is neither a bacterium nor an archaean.'], a: ['you cannot tell: some bacteria and some archaea live in salt lakes; you would need its chemistry or its DNA;', 'a virus is not a cell;'] } },
  { n: 4,
    S: { t: [`One bacterium divides every 20 minutes. Calculate how many there are after ${FB.q4s.minutes / 60} hour.`, `Step 1: ${FB.q4s.minutes} ÷ 20 = ____ divisions. Step 2: 2 × 2 × 2 = ____ bacteria.`], a: [`${FB.q4s.divisions} divisions; ${FB.q4s.bacteria} bacteria;`] },
    C: { t: [`One bacterium divides every ${FB.q4c.gen} minutes. Calculate how many there are after ${FB.q4c.minutes / 60} hours. Show your working.`], a: [`${FB.q4c.minutes} ÷ ${FB.q4c.gen} = ${FB.q4c.divisions} divisions; 2^${FB.q4c.divisions} = ${FB.q4c.bacteria} bacteria;`] },
    E: { t: [`One bacterium divides every ${FB.q4e.gen} minutes. Calculate how many there are after ${FB.q4e.minutes / 60} hours.`, 'Explain why, in real life, the number would be much lower.'], a: [`${FB.q4e.minutes} ÷ ${FB.q4e.gen} = ${FB.q4e.divisions} divisions; 2^${FB.q4e.divisions} = ${n(FB.q4e.bacteria)} bacteria;`, 'food and space run out, and waste builds up, so the cells stop dividing and many die;'] } },
  { n: 5,
    S: { t: ['Complete the sentences. Use the words in the box.', 'In binary fission the ________ is copied. The cell grows and splits into ________ identical cells.', 'Box: DNA, two, four, nucleus'], a: ['DNA; two;'] },
    C: { t: ['Name three characteristics of prokaryotes.', 'State what the word “binary” tells you about how many cells are made.'], a: ['any three of: one cell; no nucleus; very small; divide in two; found almost everywhere;', 'two;'] },
    E: { t: ['Binary fission makes two identical cells. Explain where the variation in a population of bacteria comes from.'], a: ['mutations (rare copying mistakes in the DNA, but so many cells divide that they happen often); and some plasmids can pass from one bacterium to another, so a cell can gain new genes;'] } },
  { n: 6,
    S: { t: ['Join each group to how it gets energy. Write the letter.', 'photosynthetic ___   decomposers ___   chemosynthetic ___', 'A: feeds on dead material   B: uses light   C: uses chemicals'], a: ['B; A; C;'] },
    C: { t: ['State the name of the group of bacteria that make food using light.', 'State the name of the group that live in a living animal, feed on it and harm it.'], a: ['photosynthetic (cyanobacteria);', 'parasites (pathogens);'] },
    E: { t: ['Explain why chemosynthetic bacteria can live at a deep-sea vent but photosynthetic bacteria cannot.'], a: ['there is no light at a deep-sea vent, so photosynthesis cannot happen; chemosynthetic bacteria use the energy in chemicals from the vent instead;'] } },
  { n: 7,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Decomposers break down ________ plants and animals. They return ________ to the soil.', 'Box: dead, living, nutrients, water'], a: ['dead; nutrients;'] },
    C: { t: ['Explain why a farmer who grows peas may find the soil richer in nitrogen afterwards.'], a: ['peas have nitrogen-fixing bacteria in their root nodules; they change nitrogen gas from the air into a form plants can use, and some stays in the soil;'] },
    E: { t: ['Human insulin is made by bacteria. Explain how bacteria are made to produce it. Include the word plasmid.'], a: ['the human insulin gene is cut out (and put into a plasmid);', 'the plasmid is put into a bacterium;', 'the bacterium follows the instructions and makes human insulin; it divides, so there are very many;'] } },
  { n: 8,
    S: { t: ['Circle the correct words.', 'Antibiotics kill bacteria / viruses.', 'A cold is caused by a bacterium / virus.'], a: ['bacteria;', 'virus;'] },
    C: { t: ['A patient has flu. Explain why antibiotics would not help.'], a: ['flu is caused by a virus; antibiotics kill bacteria and do nothing to viruses;'] },
    E: { t: ['A patient with flu gets very ill and a doctor prescribes an antibiotic. Suggest why the doctor does this when antibiotics do not treat flu.'], a: ['the patient may have caught a second infection caused by bacteria (for example pneumonia), which an antibiotic can treat; the antibiotic does not treat the flu virus;'] } },
  { n: 9,
    S: { t: [`A population has ${n(FB.q9s.total)} bacteria. One in every ${n(FB.q9s.one_in)} is resistant to an antibiotic.`, 'Calculate how many are resistant.', 'Put these four steps in order. Write the letters.', 'a The resistant bacteria reproduce.  b The antibiotic kills the bacteria that are not resistant.  c A few bacteria are already resistant.  d The offspring are resistant too.'], a: [`${n(FB.q9s.total)} ÷ ${n(FB.q9s.one_in)} = ${FB.q9s.resistant};`, 'c, b, a, d;'] },
    C: { t: ['A farmer sprays a field with a pesticide. Most of the insects die, but after a few years the pesticide stops working.', 'Explain how the insects have become resistant to the pesticide.'], a: ['a few insects were already resistant, by chance; the pesticide killed the rest; the resistant insects survived and reproduced and passed resistance on; so the population became resistant;'] },
    E: { t: ['Resistance can spread between different species of bacteria.', 'Explain how resistance can pass to a species that has never met the antibiotic.'], a: ['the resistance gene is on a plasmid; a bacterium can pass a copy of the plasmid to another bacterium it touches, even a different species; the new bacterium is resistant without dividing;'] } },
  { n: 10,
    S: { t: ['Circle the correct words.', 'Bacteria learn to resist an antibiotic / A few bacteria are already resistant by chance.', 'Prokaryotes are simple / different.'], a: ['a few are already resistant;', 'different;'] },
    C: { t: ['Student A says: “The antibiotic made the bacteria resistant by changing them.” Explain what is wrong.'], a: ['the antibiotic does not cause the change; a few were already resistant by chance and the antibiotic killed the others;'] },
    E: { t: ['Student B says: “An individual bacterium never becomes resistant, but a population of bacteria can.” Is the student right? Explain your answer.'], a: ['yes; an individual does not change (apart from a rare mutation); the population changes because the non-resistant die and the resistant survive and reproduce, so the proportion of resistant bacteria rises;'] } },
];

module.exports = { QUESTIONS, FEEDBACK, TOTAL, n };

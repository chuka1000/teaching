/**
 * Ecosystems assessment (9I and 9G): the questions, the mark scheme and the
 * feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full before writing anything): Ecosystems1 OLD, Ecosystems2
 * OLD, Ecosystems3 OLD and Human Population Growth. Nothing is tested that is
 * not in them. NOTES from the brief: no references that could isolate a
 * demographic, for example named locations in Thailand. So every context here
 * is generic (an estuary, a mangrove forest, a farmer's field), there are no
 * place names, person names or local-language words, and the population data
 * is the world as a whole.
 *
 * 45 marks in 45 minutes. Numbers come from ecosystem-assessment.numbers.json
 * (written by ecosystem-assessment-check.py with sympy).
 */
const NUM = require('./ecosystem-assessment.numbers.json');
const kJ = (n) => Number(n).toLocaleString('en-GB').replace(/,/g, ' ');     // 20 000

const S = NUM.q5.steps;                       // [20000, 2000, 200, 20]
const P = NUM.q6, FB = NUM.feedback;

/* --------------------------------------------------------------------- *
 * The paper. Each part: label, text, marks, and the answer space.
 * `space`: number of ruled lines (one mark, one line; four marks, five or six).
 * --------------------------------------------------------------------- */
const QUESTIONS = [
  { n: 1, marks: 4, lesson: 'Ecosystems 1',
    stem: null,
    parts: [
      { l: '(a)', t: 'Define the term ecosystem.', m: 2, space: 3 },
      { l: '(b)', t: 'A dead leaf lies in the mud of a mangrove forest. State whether the leaf is a biotic factor or an abiotic factor. Give a reason for your answer.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['all the living things (organisms, plants and animals, the community) in an area;', 'plus the non-living surroundings (abiotic factors, for example water, salt, sunlight) that they interact with;'],
        note: 'Accept "living and non-living things in one area interacting" for both marks. Accept "plants and animals" for the first mark. Reject a definition with living things only.' },
      { l: '(b)', pts: ['biotic;', 'it was once alive (it was made by a living tree, it is part of the living world);'],
        note: 'The second mark needs a reason. Reject "abiotic" with any reason. Reject "because it is dead" as the reason for biotic.' },
    ],
    wrong: 'Most wrong answers will define an ecosystem as living things only (1 mark at most), and will say the dead leaf is abiotic "because it is dead".' },

  { n: 2, marks: 3, lesson: 'Ecosystems 1',
    stem: 'Three organisms that live in an estuary are shown on the left. Three jobs that living things do in an ecosystem are shown on the right. Draw one straight line from each organism to its job.',
    parts: [{ l: '', t: '', m: 3, kind: 'match' }],
    ms: [{ l: '', pts: ['mangrove tree to producer;', 'crab that eats fallen mangrove leaves to consumer;', 'bacteria that live in the mud to decomposer;'], note: 'One mark for each correct line. If an organism has two lines, it scores 0.' }],
    wrong: 'The bacteria joined to consumer ("they eat dead things") or the crab joined to decomposer ("it eats dead leaves").' },

  { n: 3, marks: 3, lesson: 'Ecosystems 3',
    stem: null,
    parts: [
      { l: '(a)', t: 'Write the word equation for photosynthesis.', m: 2, space: 2 },
      { l: '(b)', t: 'State where most of the mass of a mangrove tree comes from.', m: 1, space: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['carbon dioxide + water (on the left);', 'glucose + oxygen (on the right, after the arrow);'], note: 'Accept the equation with "light" written above the arrow. Reject "carbon" for carbon dioxide. Allow one mark if both sides are correct but reversed. Symbols accepted: CO₂, H₂O, O₂.' },
      { l: '(b)', pts: ['the air (carbon dioxide in the air);'], note: 'Reject "the soil" and "water" on its own.' },
    ],
    wrong: 'Oxygen written as a reactant; and "the soil" for (b), the most common belief about where a tree gets its mass.' },

  { n: 4, marks: 6, lesson: 'Ecosystems 2',
    stem: 'The diagram shows six organisms that live in an estuary.',
    image: 'foodweb_main.png', imageW: 5.6,
    parts: [
      { l: '(a)', t: 'The egret eats crabs. Give the name for an animal that eats only other animals.', m: 1, space: 1 },
      { l: '(b)', t: 'Draw arrows on the diagram to show these four feeding relationships. Copepods eat phytoplankton. Small fish eat copepods. Large fish eat small fish. Egrets eat crabs.', m: 2, kind: 'drawn' },
      { l: '(c)', t: 'Use the arrows you have drawn to write out a food chain with four organisms.', m: 2, space: 2 },
      { l: '(d)', t: 'State what an arrow in a food chain shows.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['carnivore;'], note: 'Accept "meat-eater". Reject herbivore, omnivore and predator (predator describes what happens in one encounter, not the diet).' },
      { l: '(b)', pts: ['phytoplankton to copepod, copepod to small fish, small fish to large fish, and crab to egret, all four drawn with the head at the eater (2 marks);', 'two or three of the four arrows correct (1 mark);'],
        note: 'The four arrows run left, down, right and up on the diagram, so the direction cannot be guessed from the layout. An arrow drawn from the eater to the food scores 0.' },
      { l: '(c)', pts: ['four different organisms, in the order given by the arrows the candidate drew in (b);', 'each arrow pointing from the food to the eater;'],
        note: 'Allow error carried forward: the chain is marked against the candidate\'s own arrows. The expected chain is phytoplankton → copepod → small fish → large fish. A chain that follows reversed arrows scores the first mark only. A chain of fewer than four organisms scores a maximum of 1 mark. Accept the arrows written as "gives energy to".' },
      { l: '(d)', pts: ['the direction the energy moves (from the organism that is eaten to the organism that eats it);'], note: 'Accept "energy goes from the food to the eater" and "gives energy to". Reject "what eats what" or "who is eaten by whom" with no reference to energy.' },
    ],
    wrong: 'Arrows drawn from the eater to its food (the direction of eating, not of energy), or all drawn in one direction across the page; and "what eats what" for part (d).' },

  { n: 5, marks: 4, lesson: 'Ecosystems 2',
    stem: `A food chain in an estuary is: phytoplankton → copepod → small fish → large fish. The phytoplankton contain ${kJ(S[0])} kJ of energy. Assume that 90% of the energy is lost at each step of the food chain.`,
    parts: [
      { l: '(a)', t: 'Calculate the energy passed to the copepods.', m: 1, kind: 'calcA' },
      { l: '(b)', t: 'Calculate the energy passed to the large fish. Show your working.', m: 2, kind: 'calcB' },
      { l: '(c)', t: 'State one way in which energy is lost between one link in the chain and the next.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: [`${kJ(S[1])} kJ;`], note: `${kJ(S[0])} × 10% (or ÷ 10). The unit is printed on the answer line.` },
      { l: '(b)', pts: [`method: ${kJ(S[0])} → ${kJ(S[1])} → ${kJ(S[2])} → ${kJ(S[3])}, or ${kJ(S[0])} × 0.1 × 0.1 × 0.1 (three steps);`, `${kJ(S[3])} kJ;`],
        note: `The unit is required for the second mark: ${kJ(S[3])} on its own scores the method mark only. Allow error carried forward: the candidate's answer to (a) multiplied by 0.1 twice scores both marks.` },
      { l: '(c)', pts: ['lost as heat (from respiration or movement);'], note: 'Accept "waste", "not eaten (bones, shell)" and "used for movement". Reject "used up" or "destroyed" with no other detail, and reject "eaten".' },
    ],
    wrong: `(b): ${kJ(S[2])} (only two steps counted) or ${kJ(S[1])} (one step counted); some will subtract 90% once and give 2 000 then stop.` },

  { n: 6, marks: 5, lesson: 'Human Population Growth',
    stem: 'The graph shows the population of the world from 1950, with a projection to 2100. The figures are rounded.',
    image: 'population_graph.png', imageW: 5.9,
    parts: [
      { l: '(a)', t: 'Use the graph to find the year in which the world population was 4 billion.', m: 1, space: 1 },
      { l: '(b)', t: 'The population in 1950 was 2.6 billion. Use the graph to find the population in 2022. Then calculate the increase in the population from 1950 to 2022. Give your answer in billions.', m: 2, space: 3 },
      { l: '(c)', t: 'Describe how the shape of the graph changes between 1950 and 2100.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: [`${P.y4};`], note: 'Accept 1973 to 1977.' },
      { l: '(b)', pts: [`reads ${P.p2022.toFixed(1)} billion for 2022 (accept 7.9 to 8.1);`, `${P.increase} billion;`], note: `${P.p2022.toFixed(1)} − 2.6 = ${P.increase}. Allow error carried forward: (their reading − 2.6) scores the second mark. Units: "billion" is asked for in the question, so accept ${P.increase} with or without the word.` },
      { l: '(c)', pts: ['from 1950 the line gets steeper (the population grows faster and faster, exponential growth);', 'after about 2050 (in the projection) the line flattens or levels off (growth slows, a plateau at about 10 billion);'], note: 'Accept "curves upwards" for the first point. Reject "it goes up" with no change in shape described. Accept "it stops growing" for the second point.' },
    ],
    wrong: '(a): 1970 read from the wrong gridline. (c): "it goes up all the time", with no change in shape described.' },

  { n: 7, marks: 5, lesson: 'Human Population Growth',
    stem: 'The human population has grown very quickly since 1950.',
    parts: [
      { l: '(a)', t: 'State one reason why fewer people die young now than in the past.', m: 1, space: 1 },
      { l: '(b)', t: 'A student says: "The population grew because people started having more babies." Explain why the student is wrong.', m: 2, space: 3 },
      { l: '(c)', t: 'Explain one effect of a growing human population on ecosystems.', m: 2, space: 4 },
    ],
    ms: [
      { l: '(a)', pts: ['clean water, or more food, or vaccines, or medicine;'], note: 'Accept any one. Reject "better lives" or "people are healthier" with no detail.' },
      { l: '(b)', pts: ['birth rates have fallen (they did not rise);', 'the population grew because fewer people died (the death rate fell faster), so more people survived and lived longer;'], note: 'Accept "more people survive" for the second point.' },
      { l: '(c)', pts: ['an effect, for example: land (forest or grassland) is cleared to grow food; water is taken from rivers for farms and cities; burning fuel changes the air and climate;', 'the consequence for the ecosystem, for example: habitats and food chains are lost, so populations of wild animals fall; less water is left for other species; every ecosystem is affected;'],
        note: 'One mark for the effect and one for the consequence. Both must be linked. Reject "pollution" or "it destroys nature" with no detail.' },
    ],
    wrong: '(b): repeating that "more people were born"; (c): "it is bad for the environment" with no effect and no consequence.' },

  { n: 8, marks: 5, lesson: 'Ecosystems 2 and Ecosystems 3',
    stem: 'Two students make statements about ecosystems.',
    parts: [
      { l: '(a)', t: 'Student A says: "Decomposers belong at the end of a food chain." Explain what is wrong with this statement.', m: 2, space: 3 },
      { l: '(b)', t: 'Student B says: "Energy is recycled round and round an ecosystem, just like carbon." Explain what is wrong with this statement.', m: 3, space: 5 },
    ],
    ms: [
      { l: '(a)', pts: ['decomposers feed on (break down) dead material from every level of the food chain, not only from the last one;', 'so they are shown beside the chain (or web), not at the end of it;'], note: 'Accept "they break down dead plants and dead animals from all the organisms" for the first point. Accept "they release nutrients back for the producers" for the second.' },
      { l: '(b)', pts: ['energy flows through an ecosystem in one direction (from the Sun, once);', 'the energy is lost as heat and cannot be used again;', 'it is matter (carbon, nitrogen atoms) that is cycled, and is used again;'], note: 'Accept "energy is not recycled but carbon is". Reject "energy is destroyed" (it leaves as heat, it is not destroyed).' },
    ],
    wrong: '(a): "decomposers eat what is left at the end", which agrees with the student; (b): "energy is not lost" or "energy goes round like carbon".' },

  { n: 9, marks: 5, lesson: 'Ecosystems 3',
    stem: 'The diagram shows part of the carbon cycle in an estuary.',
    image: 'carbon_main.png', imageW: 5.2,
    parts: [
      { l: '(a)', t: 'The arrow labelled "feeding" is shown. Write the name of the process shown by each of the arrows A, B and C.', m: 3, kind: 'abc' },
      { l: '(b)', t: 'Explain why carbon can stay in waterlogged mud for hundreds of years.', m: 2, space: 4 },
    ],
    ms: [
      { l: '(a)', pts: ['A: photosynthesis;', 'B: death (and waste);', 'C: respiration and decomposition;'], note: 'Accept for B: dying, waste, excretion, egestion. Accept for C: respiration, decomposition or decay, on their own. The diagram shows one route only; producers and consumers also respire, and there is no mark for saying so.' },
      { l: '(b)', pts: ['there is almost no oxygen in waterlogged mud;', 'decomposers need oxygen to break the dead material down (decomposition nearly stops), so the carbon is not returned to the air as carbon dioxide;'], note: 'Accept "bacteria cannot respire without oxygen". Reject "the mud is too wet" or "too cold" with no mention of oxygen.' },
    ],
    wrong: '(a): A and C swapped, or "respiration" for A; (b): "the mud is too wet for decomposers", with no mention of oxygen.' },

  { n: 10, marks: 5, lesson: 'Ecosystems 1 and Ecosystems 3',
    stem: 'A farmer grows wheat. In one corner of the field the wheat plants are short and their leaves are pale yellow. A soil test shows that the soil in this corner is low in nitrates. The soil in this corner is sandy. Water drains quickly through it and it holds very little dead plant material.',
    parts: [
      { l: '(a)', t: 'Name the type of organism in the soil that changes nitrogen gas from the air into a form that plants can use.', m: 1, space: 1 },
      { l: '(b)', t: 'Explain why a lack of nitrates makes the leaves pale yellow.', m: 2, space: 3 },
      { l: '(c)', t: 'Suggest why the sandy soil is low in nitrates.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['nitrogen-fixing bacteria;'], note: 'Accept "bacteria that fix nitrogen". Reject "decomposers" and "fungi" on their own.' },
      { l: '(b)', pts: ['plants need nitrogen (nitrates) to make chlorophyll;', 'less chlorophyll (the green pigment), so the leaves are yellow;'], note: 'Accept "nitrogen is needed for chlorophyll and protein". Reject "the plants are dying" and "nitrogen makes leaves green" with no mention of chlorophyll.' },
      { l: '(c)', pts: ['little dead plant material for decomposers to break down;', 'so little nitrogen (nitrate) is released back into the soil;'], note: 'Accept "nitrates are washed away as the water drains". This is valid science that was not taught; give the mark. Reject "no water".' },
    ],
    wrong: '(b): "the plants are dying" or "they need nitrogen to be green"; (c): "there is not enough water".' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => { const s = q.parts.reduce((a, p) => a + p.m, 0); if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`); });
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* Q2 matching data: organisms on the left, jobs (in a different order) on the right */
const MATCH = { left: ['A mangrove tree', 'A crab that eats fallen mangrove leaves', 'Bacteria that live in the mud'], right: ['Decomposer', 'Producer', 'Consumer'] };

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S: same skill, smaller numbers, more scaffold
 *   C: same demand, fresh context
 *   E: harder, an extra step, a reversal or an unfamiliar context
 * `img` is a file in assets/assessment/. Answers go at the end of the mark scheme.
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: { t: ['Complete the definition. Use the words in the box.', 'An ecosystem is all the ________ things in an area, plus the ________ surroundings that they interact with.', 'Box: living, non-living, dead', 'A dead leaf was once alive. Circle the correct word: biotic / abiotic.'], a: ['living; non-living;', 'biotic;'] },
    C: { t: ['Define the term ecosystem, using a rock pool as your example.', 'A dead insect floats in a pond. State whether it is biotic or abiotic. Give a reason.'], a: ['Living things (for example snails, seaweed, crabs) plus the non-living surroundings (for example salt water, sunlight, rock) in one area, interacting;', 'Biotic, because it was once alive;'] },
    E: { t: ['A crab digs a hole in the mud. Is the hole biotic or abiotic?', 'Give one argument for each answer. Then decide, and justify your decision.'], a: ['Either answer scores with a good justification;', 'Abiotic argument: the hole is a shape in mud, and mud was never alive;', 'Biotic argument: it exists only because a living thing made it;'] } },
  { n: 2,
    S: { t: ['Circle the correct job for each organism.', 'A tree: producer / consumer / decomposer', 'A fungus growing on a dead log: producer / consumer / decomposer'], a: ['producer;', 'decomposer;'] },
    C: { t: ['Draw one straight line from each organism to its job.'], match: { left: ['Seaweed', 'A snail that eats seaweed', 'A fungus on a dead log'], right: ['Consumer', 'Decomposer', 'Producer'] }, a: ['seaweed to producer; snail to consumer; fungus to decomposer;'] },
    E: { t: ['An oyster does not chase its food. It filters tiny phytoplankton out of the water.', 'State whether the oyster is a producer, a consumer or a decomposer. Explain your answer.'], a: ['Consumer;', 'It eats other living things (phytoplankton). Filtering is still eating;'] } },
  { n: 3,
    S: { t: ['Complete the word equation for photosynthesis. Use the words in the box.', 'carbon dioxide + ________ → glucose + ________', 'Box: water, oxygen, nitrogen'], a: ['water; oxygen;'] },
    C: { t: ['Write the word equation for respiration.'], a: ['glucose + oxygen → carbon dioxide + water (releasing energy);'] },
    E: { t: ['Photosynthesis and respiration are almost the same equation written backwards.', 'Explain why this is not a contradiction.'], a: ['They are different processes in different conditions: photosynthesis stores energy from light and happens in producers; respiration releases energy from glucose and happens in all living things, all the time;'] } },
  { n: 4,
    S: { img: 'foodweb_support.png', imgW: 3.0, t: ['Draw arrows on the diagram to show these feeding relationships. Rabbits eat grass. Foxes eat rabbits. Hawks eat rabbits.', 'Use your arrows to write a food chain with three organisms.'], a: ['arrows from grass to rabbit, from rabbit to fox and from rabbit to hawk (heads at the eater);', 'for example grass → rabbit → fox;'] },
    C: { img: 'foodweb_consolidate.png', imgW: 3.0, t: ['Draw arrows on the diagram to show these feeding relationships. Water fleas eat algae. Minnows eat water fleas. Perch eat minnows. Herons eat water snails.', 'Use your arrows to write a food chain with four organisms.', 'State what an arrow in a food chain shows.'], a: ['arrows from algae to water flea, water flea to minnow, minnow to perch and water snail to heron (heads at the eater);', 'algae → water flea → minnow → perch;', 'the direction the energy moves, from the eaten to the eater;'] },
    E: { img: 'foodweb_main_complete.png', imgW: 3.0, t: ['A disease kills nearly all of the small fish.', 'Predict what happens to the number of (i) large fish, (ii) copepods, (iii) egrets. Explain each prediction.'], a: ['(i) large fish fall, they lose their only food;', '(ii) copepods rise, fewer are eaten;', '(iii) egrets fall a little, but they can still eat crabs, so they fall by less than the large fish (a web gives alternative routes);'] } },
  { n: 5,
    S: { t: [`A food chain is: grass → rabbit → fox. The grass contains ${kJ(FB.q5s[0])} kJ of energy. 90% of the energy is lost at each step.`, 'Calculate the energy passed to (a) the rabbit and (b) the fox.'], a: [`(a) ${kJ(FB.q5s[1])} kJ; (b) ${kJ(FB.q5s[2])} kJ;`] },
    C: { t: [`A food chain is: algae → water flea → minnow → perch. The algae contain ${kJ(FB.q5c[0])} kJ of energy. 90% of the energy is lost at each step.`, 'Calculate the energy passed to (a) the water fleas and (b) the perch.'], a: [`(a) ${kJ(FB.q5c[1])} kJ; (b) ${kJ(FB.q5c[3])} kJ;`] },
    E: { t: [`The large fish at the end of a four-link food chain contains ${FB.q5e / 1000} kJ of energy. 90% of the energy is lost at each step.`, 'Calculate the energy in the phytoplankton at the start of the chain.', 'Explain why food chains rarely have more than five links.'], a: [`${kJ(FB.q5e)} kJ (three steps back, ${FB.q5e / 1000} × 10 × 10 × 10);`, 'so much energy is lost at each step that there is too little left to support another consumer;'] } },
  { n: 6,
    S: { table: [['Year', 'Population (billions)'], ['1950', '2.6'], ['2000', '6.1'], ['2022', '8.0']], t: ['Use the table to state the population in 2000.', 'Calculate the increase in the population from 2000 to 2022.'], a: ['6.1 billion;', `${FB.q6s} billion (8.0 − 6.1);`] },
    C: { table: [['Year', 'Population (billions)'], ['1975', '4.0'], ['2022', '8.0'], ['2050 (projection)', '9.7']], t: ['Calculate the increase in the population from 1975 to 2022.', 'The increase from 2022 to 2050 is smaller than the increase from 1975 to 2022. Describe what this tells you about how fast the population is growing.'], a: [`${FB.q6c} billion (8.0 − 4.0);`, 'it is still rising but more slowly, so growth is slowing down;'] },
    E: { t: ['The population is projected to rise from 8.0 billion in 2022 to 9.7 billion in 2050.', 'Calculate the percentage increase. Give your answer to the nearest whole number.', 'A headline says: "The population will keep rising for ever." Explain why a scientist would want to see evidence before agreeing.'], a: [`${Math.round(FB.q6e)}% ((9.7 − 8.0) ÷ 8.0 × 100 = ${FB.q6e});`, 'the projection levels off at about 10.3 billion in the mid-2080s; birth rates are falling; growth is slowing;'] } },
  { n: 7,
    S: { t: ['Circle the correct words.', 'The human population grew because more babies were born / fewer people died.', 'Give one reason why fewer people die young now. Use the box.', 'Box: clean water, vaccines, medicine, more food'], a: ['fewer people died;', 'any one from the box;'] },
    C: { t: ['A student says: "Humans are outside ecosystems because we build cities."', 'Explain why the student is wrong.'], a: ['Humans are part of the ecosystem: we are living things (consumers), and everything we eat and use comes out of a food chain or the environment;'] },
    E: { t: ['Birth rates have fallen, but the human population is still rising.', 'Explain how both can be true.'], a: ['People live longer, because fewer people die, so the number of people alive keeps rising as long as more are born than die;'] } },
  { n: 8,
    S: { t: ['Circle the correct words.', 'Decomposers feed on dead material at only the end / every level of a food chain.', 'Energy flows through an ecosystem once / round and round.'], a: ['every level;', 'once;'] },
    C: { t: ['Student A says: "A habitat and an ecosystem are the same thing." Explain what is wrong.', 'Student B says: "Plants take their nitrogen straight from the air." Explain what is wrong.'], a: ['A habitat is where one species lives; an ecosystem is all the species plus the non-living surroundings;', 'Plants cannot use nitrogen gas; bacteria have to fix it into a form (nitrates) in the soil first;'] },
    E: { t: ['Write your own incorrect statement about the carbon cycle that a student might make.', 'Then write the correction, and explain the science.'], a: ['Open answer. For example: "The mass of a tree comes from the soil." Correction: it comes from carbon dioxide in the air, taken in by photosynthesis;'] } },
  { n: 9,
    S: { img: 'carbon_support.png', imgW: 3.0, t: ['Write the name of the process shown by arrow A and by arrow C. Choose from the box.', 'Box: photosynthesis, feeding, respiration and decomposition'], a: ['A: photosynthesis; C: respiration and decomposition;'] },
    C: { img: 'nitrogen_consolidate.png', imgW: 3.0, t: ['Write what happens at arrow A and at arrow B. Choose from the box.', 'Box: nitrogen-fixing bacteria, decomposers, photosynthesis, feeding'], a: ['A: nitrogen-fixing bacteria (change nitrogen gas into nitrates);', 'B: decomposers (break down dead matter and put the nitrogen back);'] },
    E: { t: ['A mangrove forest is drained so that the mud is no longer waterlogged.', 'Explain what happens to the carbon stored in the mud, and why.'], a: ['Oxygen can now get into the mud; decomposers can respire and break down the dead material; the carbon is released to the air as carbon dioxide;'] } },
  { n: 10,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Plants need nitrogen to make ________. With less of it the leaves are ________.', 'Box: chlorophyll, glucose, green, yellow'], a: ['chlorophyll; yellow (pale);'] },
    C: { t: ['A gardener grows lettuces in a pot of sand. The lettuces are small and pale.', 'Explain why. Use the words: nitrates, decomposers, chlorophyll.'], a: ['Sand holds little dead plant material, so decomposers have little to break down and few nitrates are released; the lettuces cannot make enough chlorophyll, so the leaves are pale;'] },
    E: { t: ['A farmer adds fertiliser containing nitrates to the pale wheat.', 'Explain why the leaves turn green faster than if the farmer waited for bacteria to add the nitrogen.'], a: ['The fertiliser supplies nitrates directly, so the slow steps (fixation by bacteria, or decomposition of dead matter) are skipped; the plants can make chlorophyll straight away;'] } },
];

module.exports = { QUESTIONS, FEEDBACK, MATCH, TOTAL, kJ };

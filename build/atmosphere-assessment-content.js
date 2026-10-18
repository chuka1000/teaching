/**
 * Atmosphere assessment (Y9, 9G and 9I): the questions, the mark scheme and the feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full before writing anything): What Gets Into The Air, What It Does To Us, The Ozone Layer and A Warming Planet (all built in this batch,
 * out/). Nothing is tested that is not in them. NOTES from the unit plan: weight it towards telling the three problems apart (Q10: four described
 * situations, which problem and a reason, 8 marks on its own; Q6(b) puts two of the problems side by side); include a source-to-pollutant
 * matching set (Q1), a four-mark acid rain question (Q4: which gases, which acids, what is damaged), a graph of carbon dioxide to read with one mark for a
 * value and one for the trend (Q8), a short question on why ozone is harmful at ground level and protective high up (Q5), three impacts of climate change
 * for three marks (Q7), and a question on why the Montreal Protocol worked, near the end (Q11: clear science, an available replacement, international
 * agreement). The Extend variant of the greenhouse question asks for short waves in and long waves out; Support and Consolidate ask only that the gases
 * trap heat. NO CHLORINE RADICAL MECHANISM anywhere in the paper, and carbon dioxide is never listed as a pollutant that harms the lungs (it appears only
 * in a question that asks a student to correct that idea).
 *
 * 45 marks in 45 minutes. Numbers come from atmosphere-assessment.numbers.json (written by atmosphere-assessment-check.py with sympy).
 */
const NUM = require('./atmosphere-assessment.numbers.json');
const n = (x) => Number(x).toLocaleString('en-GB').replace(/,/g, ' ');

const G = NUM.q7, FB = NUM.feedback;

/* --------------------------------------------------------------------- *
 * The paper. Each part: label, text, marks, and the answer space.
 * `space`: number of ruled lines (one mark, one line; four marks, five or six).
 * `kind`: match (draw lines), calc (working lines and an answer line with a unit), situations (the tick-and-reason table).
 * --------------------------------------------------------------------- */
const SOURCES = [
  'A faulty gas boiler, where the gas burns with too little oxygen',
  'A power station that burns coal containing sulfur',
  'A car engine, where the flame is so hot that the nitrogen and oxygen of the air react',
  'Soot and dust from a building site',
  'Paint and cleaning fluid evaporating from an open tin',
];
const POLLUTANTS = ['Particulates', 'Nitrogen oxides', 'Carbon monoxide', 'Volatile organic compounds (VOCs)', 'Sulfur dioxide'];   // shuffled on purpose; the answers are 3, 5, 2, 1, 4

const SITUATIONS = [
  { l: 'A', t: 'In winter, cold air sits still over a city for a week. The sky has a brown haze, and more people go to hospital with coughs and asthma.', ans: 'Air pollution' },
  { l: 'B', t: 'People in southern Chile are told in the spring to wear hats and sunglasses, because more ultraviolet light is reaching the ground.', ans: 'Ozone depletion' },
  { l: 'C', t: 'A mountain lake far from any factory has no fish, and its water is acidic. A power station burns coal 300 km away.', ans: 'Air pollution' },
  { l: 'D', t: 'Glaciers around the world have shrunk over the last 50 years, and low-lying islands now flood more often.', ans: 'Climate change' },
];

const QUESTIONS = [
  { n: 1, marks: 5, lesson: 'What Gets Into The Air',
    stem: 'Pollutants come from different sources.',
    parts: [
      { l: '', t: 'Draw one line from each source to the pollutant that it mainly produces.', m: 5, kind: 'match', left: SOURCES, right: POLLUTANTS },
    ],
    ms: [
      { l: '', pts: ['faulty gas boiler: carbon monoxide;', 'coal with sulfur: sulfur dioxide;', 'very hot car engine: nitrogen oxides;', 'soot and dust from a building site: particulates;', 'paint and cleaning fluid: volatile organic compounds (VOCs);'],
        note: 'One mark for each source, so 5 marks. A source with two lines drawn from it scores 0. A power station also makes particulates and a car engine also makes carbon monoxide, but the question says "mainly" and each description points to one pollutant.' },
    ],
    wrong: 'the car engine matched to carbon monoxide (engines do make it, but the description is about the very hot flame); the power station matched to particulates (it does make soot, but the description says sulfur).' },

  { n: 2, marks: 3, lesson: 'What Gets Into The Air',
    stem: null,
    parts: [
      { l: '(a)', t: 'State the difference between a primary pollutant and a secondary pollutant.', m: 2, space: 3 },
      { l: '(b)', t: 'In December 1952 thick smog covered London for several days. State one weather condition that kept the smog close to the ground.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['a primary pollutant is released straight into the air (as itself);', 'a secondary pollutant is made in the air (by reactions, for example in sunlight) from other pollutants;'],
        note: 'Accept "made in the air" for the second mark. Reject "the first one and the second one", and "a primary pollutant is worse".' },
      { l: '(b)', pts: ['still air (no wind, so the smoke is not blown away); or cold air trapped under a layer of warmer air;'],
        note: 'Accept "calm" and "no wind". Reject "fog", "rain" and "it was winter" on its own.' },
    ],
    wrong: '(a): "primary pollutants are the main ones" or "secondary pollutants are less harmful"; (b): "it was foggy".' },

  { n: 3, marks: 4, lesson: 'What It Does To Us',
    stem: 'Air pollution harms the human body in different ways.',
    parts: [
      { l: '(a)', t: 'Describe how carbon monoxide harms the body.', m: 2, space: 3 },
      { l: '(b)', t: 'Particulates smaller than 2.5 micrometres (PM2.5) are more dangerous than larger dust. Explain why.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['it sticks to haemoglobin (in the red blood cells) in place of oxygen;', 'so the blood carries less oxygen to the body (you feel dizzy, and a lot can kill);'],
        note: 'Accept "it takes the place of oxygen in the blood" for the first mark. Reject "it stops you breathing" and "it burns the lungs" with no mention of the blood.' },
      { l: '(b)', pts: ['they are small enough to go deep into the lungs;', 'some can reach the blood; they are linked to asthma, heart disease and lung cancer;'],
        note: 'Accept any one of asthma, heart disease or lung cancer for the second mark. Reject "they block the nose" and "they are poisonous" with no reference to the lungs or the blood.' },
    ],
    wrong: '(a): "it stops you breathing" or "you cannot breathe it in"; (b): "they are heavier" or "they block the nose".' },

  { n: 4, marks: 4, lesson: 'What It Does To Us',
    stem: 'Burning coal and oil in power stations can cause acid rain.',
    parts: [
      { l: '(a)', t: 'Name the two gases that cause acid rain.', m: 2, space: 2 },
      { l: '(b)', t: 'Name the two acids that make rain acidic.', m: 1, space: 1 },
      { l: '(c)', t: 'Give one thing that acid rain damages. Describe the damage.', m: 1, space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['sulfur dioxide;', 'nitrogen oxides (nitrogen dioxide);'],
        note: 'One mark each. Reject "carbon dioxide" and "ozone" (the lesson says "carbon dioxide is not the cause") and "CFCs".' },
      { l: '(b)', pts: ['sulfuric acid and nitric acid (both needed);'], note: 'Reject "carbonic acid" and "hydrochloric acid".' },
      { l: '(c)', pts: ['one of: lakes, and fish and other animals die (the water becomes too acid); trees, whose leaves are damaged and nutrients wash out of the soil; buildings, where limestone or marble slowly dissolves;'],
        note: 'The thing and the damage are both needed for the mark. Accept "statues" for buildings. Reject "the ozone layer" and "people".' },
    ],
    wrong: '(a): "carbon dioxide and ozone"; (b): "carbonic acid"; (c): "it harms the environment" with no thing named.' },

  { n: 5, marks: 4, lesson: 'What Gets Into The Air; The Ozone Layer',
    stem: 'Ozone is a gas. It is useful high in the atmosphere, but a pollutant near the ground.',
    parts: [
      { l: '(a)', t: 'Explain why ozone high in the atmosphere is useful to us.', m: 2, space: 3 },
      { l: '(b)', t: 'Explain why ozone near the ground, in a city, is harmful.', m: 2, space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['it absorbs the most harmful ultraviolet light from the Sun;', 'so less ultraviolet reaches the ground, and there is less skin cancer (or sunburn, cataracts, damage to plants);'],
        note: 'Accept "UV" for ultraviolet. Reject "it absorbs heat" and "it gives us oxygen to breathe".' },
      { l: '(b)', pts: ['it irritates the airways (coughing, a sore throat, asthma attacks);', 'it is a (secondary) pollutant, made in sunlight from nitrogen oxides and VOCs from vehicles and fuels (so it builds up in smog);'],
        note: 'Accept "damages the lungs" for the first mark, and accept "damages plants" as an alternative to it. Reject "it causes the ozone hole" and "it traps heat".' },
    ],
    wrong: '(a): "it gives us oxygen" or "it keeps us warm"; (b): "it makes the hole in the ozone layer bigger".' },

  { n: 6, marks: 4, lesson: 'The Ozone Layer',
    stem: null,
    parts: [
      { l: '(a)', t: 'Name the group of chemicals that damaged the ozone layer. They were once used in fridges and spray cans.', m: 1, space: 1 },
      { l: '(b)', t: 'A student says: “The hole in the ozone layer is what causes global warming.” Explain why the student is wrong.', m: 3, space: 4 },
    ],
    ms: [
      { l: '(a)', pts: ['CFCs (chlorofluorocarbons);'], note: 'Accept "CFC". Reject "CO₂" and "chlorine" on its own.' },
      { l: '(b)', pts: ['the ozone layer is a thinning layer high up, caused by CFCs (it is a different problem from global warming);', 'the harm from a thinner ozone layer is more ultraviolet light reaching the ground (not more heat);', 'global warming is caused by greenhouse gases (carbon dioxide, methane) that trap heat;'],
        note: 'Award each mark point separately. "They are two different problems with different causes" scores 1 mark at most. Reject any answer that agrees with the student, and any answer that says the hole "lets heat in".' },
    ],
    wrong: '(a): "CO₂" or "carbon dioxide"; (b): "the hole lets more heat in" (the glass misconception), which scores 0 or 1.' },

  { n: 7, marks: 3, lesson: 'A Warming Planet',
    stem: null,
    parts: [
      { l: '', t: 'State three impacts of climate change.', m: 3, space: 3 },
    ],
    ms: [
      { l: '', pts: ['one impact;', 'a second, different impact;', 'a third, different impact;'],
        note: 'Any three of: sea level rise (coasts and islands flood); more extreme weather (heatwaves, droughts, heavy rain); species moving (towards the poles and uphill); coral bleaching; changes to crops and water supplies; melting glaciers and ice. One mark each. Reject "the Earth gets hotter" (it is the climate change, not an impact), "the ozone hole", "skin cancer" and "acid rain".' },
    ],
    wrong: '"global warming", "it gets hotter" and "more skin cancer" (the impacts of the other two problems).' },

  { n: 8, marks: 4, lesson: 'A Warming Planet',
    stem: 'The graph shows the concentration of carbon dioxide in the air from 1960 to 2020. It was measured on a mountain in Hawaii.',
    image: 'atm_co2_bw.png', imageW: 5.6,
    parts: [
      { l: '(a)', t: `Use the graph to find the concentration of carbon dioxide in ${G.y1}.`, m: 1, kind: 'calc1', unit: 'ppm' },
      { l: '(b)', t: 'Describe the trend shown by the graph.', m: 1, space: 2 },
      { l: '(c)', t: `Calculate the increase in the concentration between ${G.y1} and ${G.y2}.`, m: 1, kind: 'calc1', unit: 'ppm', inc: true },
      { l: '(d)', t: 'State one human activity that has caused this trend.', m: 1, space: 1 },
    ],
    ms: [
      { l: '(a)', pts: [`${G.v1} ppm;`], note: `Accept ${G.read_lo} to ${G.read_hi} ppm. The unit is not needed for the mark because it is on the axis.` },
      { l: '(b)', pts: ['it rises (increases) every year (steadily, and faster in recent years);'], note: 'Accept "it goes up" or "increases over time". Reject "it fluctuates" and a description that does not say which way it goes.' },
      { l: '(c)', pts: [`${G.v2} − ${G.v1} = ${G.rise} ppm;`], note: `Accept ${G.rise_lo} to ${G.rise_hi} ppm. Allow error carried forward from a wrong reading in (a), if the subtraction is right and the second reading is within 2 ppm of ${G.v2}. The unit ppm is needed for the mark.` },
      { l: '(d)', pts: ['burning fossil fuels (coal, oil and gas, in power stations, cars and factories); or cutting down forests (deforestation);'], note: 'Accept "burning fuels" and "cutting down trees". Reject "air pollution" and "factories" on their own.' },
    ],
    wrong: `(a): ${G.v1 + 10} (a gridline misread); (c): ${G.rise} with no unit, or ${G.v2} + ${G.v1}; (d): "pollution" or "the ozone hole".` },

  { n: 9, marks: 3, lesson: 'A Warming Planet',
    stem: null,
    parts: [
      { l: '', t: 'Describe how greenhouse gases keep the Earth warm.', m: 3, space: 4 },
    ],
    ms: [
      { l: '', pts: ['sunlight (short-wave radiation) passes through the air and warms the ground;', 'the warm ground gives out infrared (longer-wave) radiation;', 'greenhouse gases absorb the infrared and send it out in all directions, some back down, so the Earth is warmer;'],
        note: 'One mark each. Accept "heat" for infrared. "The gases trap the heat" with nothing else scores 1 mark (the third point, in part). Reject "the ozone layer traps the heat" and "the gases act like glass".' },
    ],
    wrong: '"the gases trap the Sun’s heat" with no ground and no infrared (1 mark at most), or "the hole in the ozone layer lets the heat in".' },

  { n: 10, marks: 8, lesson: 'What Gets Into The Air; What It Does To Us; The Ozone Layer; A Warming Planet',
    stem: 'There are three different problems in the atmosphere: air pollution, ozone depletion and climate change. Four situations are described below.',
    parts: [
      { l: '(a)', t: 'Tick one box for each situation to show which problem it belongs to.', m: 4, kind: 'situations' },
      { l: '(b)', t: 'Give one reason for each answer.', m: 4, kind: 'reasons' },
    ],
    ms: [
      { l: '(a)', pts: ['A: air pollution;', 'B: ozone depletion;', 'C: air pollution;', 'D: climate change;'],
        note: 'One mark each. More than one tick in a row scores 0 for that row. Situation C is the likely trap: acid rain is air pollution (sulfur dioxide and nitrogen oxides), not climate change.' },
      { l: '(b)', pts: ['A: pollutants (smoke, particulates, nitrogen oxides) are trapped near the ground by the still air, and harm the lungs (smog);', 'B: the ozone layer is thinner (damaged by CFCs), so more ultraviolet light reaches the ground;', 'C: sulfur dioxide and nitrogen oxides from the power station dissolve in cloud water, are carried by the wind and fall as acid rain;', 'D: extra greenhouse gases (carbon dioxide) trap more heat, so the planet warms, the ice melts and the sea level rises;'],
        note: 'The reasons are marked on their own, not from the ticks: the mark is for correct science that explains why the situation belongs to the correct problem. A reason that is true but does not link to the situation scores 0. Reject for A "greenhouse gases", for B "heat" or "global warming", for C "the ozone layer" or "carbon dioxide", and for D "the ozone hole".' },
    ],
    wrong: 'C ticked as climate change (acid rain from a power station) or as ozone depletion (it is "high up"); A ticked as climate change because the city was "hot"; D given the reason "the ozone hole lets the heat in".' },

  { n: 11, marks: 3, lesson: 'The Ozone Layer',
    stem: 'In 1987 countries signed the Montreal Protocol, which banned CFCs. The ozone layer is now slowly recovering.',
    parts: [
      { l: '', t: 'Explain why the Montreal Protocol worked.', m: 3, space: 4 },
    ],
    ms: [
      { l: '', pts: ['the science was clear (clear enough to act): scientists showed that CFCs were damaging the ozone layer (and satellite maps showed the hole);', 'there was a replacement: industry had other chemicals it could use instead of CFCs;', 'countries agreed together (an international agreement): they signed and followed the same rules, and richer countries helped poorer ones to pay;'],
        note: 'One mark each. Accept "people could see the hole" or "people were afraid of skin cancer" for the first mark. Accept "there were alternatives" for the second. Accept "countries all agreed" or "it was an international law" for the third. Reject "people stopped using spray cans" with no reason why they could and "it was banned" on its own, because that is what it did, not why it worked.' },
    ],
    wrong: '"because it banned CFCs" (what it did, not why it worked); "because people were scared" with no mention of the science, the replacement or the agreement.' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => { const s = q.parts.reduce((a, p) => a + p.m, 0); if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`); });
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S: same skill, more scaffold
 *   C: same demand, fresh context
 *   E: harder, an extra step, a reversal or an unfamiliar context
 * Answers go at the end of the mark scheme.
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: { t: ['Circle the pollutant for each source.', 'A faulty gas boiler, with too little oxygen: carbon monoxide / sulfur dioxide / particulates', 'Burning coal that contains sulfur: carbon monoxide / sulfur dioxide / particulates', 'Soot and dust from a building site: carbon monoxide / sulfur dioxide / particulates'], a: ['carbon monoxide;', 'sulfur dioxide;', 'particulates;'] },
    C: { t: ['Name the pollutant that each source mainly produces.', 'A can of paint left open in a room.', 'Smoke and soot from a wood fire.', 'Coal containing sulfur burned in a factory.'], a: ['volatile organic compounds (VOCs);', 'particulates;', 'sulfur dioxide;'] },
    E: { t: ['Carbon dioxide is made whenever a fuel burns, but it is not on the list of the five air pollutants. Explain why it is treated as a different problem.'], a: ['carbon dioxide does not harm the lungs at normal levels, so it is not an air pollutant in this sense; it is a greenhouse gas, which traps heat and causes climate change (a different problem);'] } },
  { n: 2,
    S: { t: ['Complete the sentences. Use the words in the box.', 'A ________ pollutant is released straight into the air. A ________ pollutant is made in the air from other pollutants.', 'Circle one: Smog stays near the ground when the air is still / windy.', 'Box: primary, secondary, still, windy'], a: ['primary; secondary;', 'still;'] },
    C: { t: ['Name one secondary pollutant in the smog of Los Angeles.', 'Explain why it is called a secondary pollutant.'], a: ['ozone;', 'it is not released by a car or a factory; it is made in the air, by sunlight, from nitrogen oxides and VOCs;'] },
    E: { t: ['Los Angeles has its worst smog on hot, sunny days. London in 1952 had its smog on a cold winter day. Explain why the weather was so different.'], a: ['Los Angeles smog is made by sunlight, which drives the reactions that make ozone from nitrogen oxides and VOCs;', 'London’s smog was coal smoke and sulfur dioxide trapped by cold, still air, and needed no sunlight;'] } },
  { n: 3,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Carbon monoxide takes the place of ________ in the blood. Particulates smaller than 2.5 micrometres go deep into the ________.', 'Box: oxygen, lungs, nitrogen, nose'], a: ['oxygen; lungs;'] },
    C: { t: ['Describe one way in which breathing in carbon monoxide is different from breathing in soot particles.'], a: ['carbon monoxide gets into the blood and takes the place of oxygen on haemoglobin, so the blood carries less oxygen; soot particles go deep into the lungs and cause asthma, heart disease or lung cancer;'] },
    E: { t: ['A student says: “Carbon dioxide harms the body in the same way as carbon monoxide, because the two gases are almost the same.” Explain what is wrong with this.'], a: ['carbon monoxide sticks to haemoglobin and blocks oxygen, but carbon dioxide does not do this;', 'at normal levels carbon dioxide is not a health pollutant; it matters because it is a greenhouse gas;'] } },
  { n: 4,
    S: { t: ['Put these three steps in order. Write the letters.', 'A  Acid rain falls on a lake.   B  Sulfur dioxide dissolves in cloud water.   C  Coal that contains sulfur is burned.'], a: ['C, B, A;'] },
    C: { t: ['A lake in Norway has no fish. The nearest factories are in another country. Explain how the pollution reached the lake.'], a: ['the factories and power stations released sulfur dioxide and nitrogen oxides; the wind carried them far away; they dissolved in cloud water and fell as acid rain on the lake;'] },
    E: { t: ['A power station fits scrubbers that use limestone. A second power station builds a taller chimney. Explain why the first stops acid rain better than the second.'], a: ['scrubbers remove the sulfur dioxide from the gas before it leaves the chimney, so less acid rain forms anywhere;', 'a taller chimney only spreads the gases further, and they still make acid rain somewhere else;'] } },
  { n: 5,
    S: { t: ['Circle the correct word.', 'Ozone high in the atmosphere absorbs ultraviolet light / infrared. It protects / harms us.', 'Ozone near the ground irritates the airways. It protects / harms us.'], a: ['ultraviolet; protects;', 'harms;'] },
    C: { t: ['Explain why people with asthma are told to stay indoors on hot, sunny days in a city with a lot of traffic.'], a: ['sunlight makes ozone from the nitrogen oxides and VOCs from the traffic, so there is more of it in the air; ozone irritates the airways and can trigger asthma attacks;'] },
    E: { t: ['The same gas, ozone, is called “good” in one place and “bad” in another. A student says: “So the gas must be changing.” Explain what is wrong with this.'], a: ['it is the same gas in both places; what matters is where it is;', 'high up it absorbs ultraviolet light before it reaches us; at ground level it is breathed in and irritates the airways;'] } },
  { n: 6,
    S: { t: ['Complete the sentences. Use the words in the box.', 'CFCs damage the ________ layer. This lets more ________ light reach the ground.', 'Circle: The hole in the ozone layer causes global warming. True / False', 'Box: ozone, ultraviolet, infrared, greenhouse'], a: ['ozone; ultraviolet;', 'false;'] },
    C: { t: ['A student says: “Ozone depletion and climate change are the same problem.” Give two differences between them.'], a: ['any two of: ozone depletion is caused by CFCs, climate change by greenhouse gases such as carbon dioxide; ozone depletion is high up and climate change is the whole atmosphere; ozone depletion lets more ultraviolet light through and climate change traps heat;'] },
    E: { t: ['Banning CFCs helped the ozone layer to recover. Explain why it did not stop climate change.'], a: ['climate change is caused mainly by carbon dioxide (and methane) from burning fossil fuels, not by CFCs, so banning CFCs does not remove its cause;'] } },
  { n: 7,
    S: { t: ['Circle the three impacts of climate change.', 'sea level rise     more skin cancer     coral bleaching     smog     more heatwaves and droughts     the ozone hole'], a: ['sea level rise; coral bleaching; more heatwaves and droughts;'] },
    C: { t: ['Describe two ways in which climate change affects the sea.'], a: ['any two of: sea level rises (warm water expands and land ice melts); coral bleaching (warm water makes corals lose the algae that feed them); species move to cooler water;'] },
    E: { t: ['Explain two different ways in which climate change can make flooding in coastal cities more likely.'], a: ['the sea level rises (the water expands as it warms and land ice melts), so coasts flood;', 'more extreme weather: heavier rain and stronger storms bring floods;'] } },
  { n: 8,
    S: { img: 'atm_co2_bw.png', imgW: 3.2, t: [`Use the graph. Find the concentration of carbon dioxide in ${FB.q7s.y1} and in ${FB.q7s.y2}. Then calculate the increase.`, `Step 1: ${FB.q7s.y1} = ______ ppm. ${FB.q7s.y2} = ______ ppm.`, 'Step 2: increase = ______ − ______ = ______ ppm.'], a: [`${FB.q7s.v1} ppm and ${FB.q7s.v2} ppm (accept 1 either side); ${FB.q7s.v2} − ${FB.q7s.v1} = ${FB.q7s.rise} ppm;`] },
    C: { img: 'atm_co2_bw.png', imgW: 3.2, t: [`Use the graph to calculate the increase in the concentration of carbon dioxide between ${FB.q7c.y1} and ${FB.q7c.y2}.`], a: [`${FB.q7c.v2} − ${FB.q7c.v1} = ${FB.q7c.rise} ppm (accept 35 to 39 ppm);`] },
    E: { img: 'atm_co2_bw.png', imgW: 3.2, t: [`Between ${FB.q7e.y1} and ${FB.q7e.y2} the concentration rose from ${FB.q7e.v1} ppm to ${FB.q7e.v2} ppm. Calculate the percentage increase, to the nearest whole number.`, `For 800 000 years before 1900 the concentration never went above about ${FB.q7e.ice} ppm. Calculate how much higher the ${FB.q7e.y2} value is.`], a: [`${FB.q7e.rise} ÷ ${FB.q7e.v1} × 100 = ${FB.q7e.pct}%;`, `${FB.q7e.v2} − ${FB.q7e.ice} = ${FB.q7e.above_ice} ppm;`] } },
  { n: 9,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Sunlight warms the ground. Greenhouse gases ________ the heat near the Earth, so the Earth stays ________.', 'Box: trap, warm, lose, cold'], a: ['trap; warm;'] },
    C: { t: ['Without greenhouse gases the Earth’s average temperature would be about −18 °C. Explain why it is about 15 °C instead.'], a: ['the greenhouse gases trap heat near the Earth (they absorb the heat given out by the ground and send some back down), so less heat escapes into space;'] },
    E: { t: ['Use the words “short-wave” and “long-wave” to explain why sunlight gets in but the heat from the ground does not easily get out.'], a: ['short-wave radiation from the Sun (mostly visible light) passes through the atmosphere and warms the ground;', 'the warm ground gives out long-wave radiation (infrared), which greenhouse gases absorb and send out in all directions, some back down;'] } },
  { n: 10,
    S: { t: ['Circle the problem for each situation.', 'More ultraviolet light reaches the ground in southern Chile: air pollution / ozone depletion / climate change', 'A city under a brown haze, with more people coughing: air pollution / ozone depletion / climate change'], a: ['ozone depletion;', 'air pollution;'] },
    C: { t: ['Name the problem for each situation, and give a reason.', 'Sea water is seeping into the fields of a low island as the sea level rises.', 'Satellite maps show the ozone layer over Antarctica is thinner each September.', 'In a valley, cold air traps smoke from burning fuel and children cough.'], a: ['climate change; warming melts land ice and expands the water, so the sea level rises;', 'ozone depletion; CFCs have damaged the ozone layer;', 'air pollution; pollutants trapped near the ground harm the lungs (smog);'] },
    E: { t: ['A government says: “We banned CFCs, so we have solved all three problems in the atmosphere.” Explain which problem the ban helped, and why it did not solve the other two.'], a: ['it helped ozone depletion, because CFCs were what damaged the ozone layer;', 'climate change is caused by greenhouse gases such as carbon dioxide from burning fossil fuels, and air pollution by sulfur dioxide, nitrogen oxides and particulates, so banning CFCs does not stop them;'] } },
  { n: 11,
    S: { t: ['Complete the sentences. Use the words in the box.', 'The Montreal Protocol banned CFCs. It worked because the science was ________, there was a ________ chemical to use instead, and countries ________ together.', 'Box: clear, replacement, agreed, hidden'], a: ['clear; replacement; agreed;'] },
    C: { t: ['Describe what the Montreal Protocol did, and what has happened to the ozone layer since.'], a: ['it banned (phased out) CFCs;', 'the ozone hole stopped growing and the ozone layer is slowly recovering;'] },
    E: { t: ['Climate change has been harder to solve than ozone depletion. Use what you know about why the Montreal Protocol worked to suggest two reasons.'], a: ['any two of: carbon dioxide comes from burning fossil fuels that everyone uses for energy, so there is no single easy replacement; far more industries and countries are involved, with different interests; the cause and the harm are spread out and slower, so the risk feels less urgent;'] } },
];

module.exports = { QUESTIONS, FEEDBACK, TOTAL, SITUATIONS, n };

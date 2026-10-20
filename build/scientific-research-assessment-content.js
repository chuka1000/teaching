/**
 * Scientific Research and Technology assessment (7B): the questions, the mark scheme and the feedback variants, in ONE place so the three
 * documents cannot disagree.
 *
 * COVERS (read in full before writing anything): How Scientists Investigate (Lesson 1), Fair Tests and Variables (Lesson 2),
 * Measuring And Recording Honestly, Numbers in Science, Averages, Graphs and Models. Burning Food and Technology And Society are not in the
 * brief and are not tested.
 *
 * NOTES from the brief: WEIGHTED TOWARDS LESSON 2 (identifying the independent, dependent and control variables in a described investigation is
 * "the skill that transfers"): 17 of the 45 marks, including the one question (Q5) where they name all three kinds of variable. A table of results
 * to find the mean of, and a graph to read or complete (Q10). Significant figures and Kelvin are quick-recall marks in the opening section (Q1).
 *
 * New contexts throughout, so nothing is the deck's own example repeated: a tea bag and hot water (Q5), a parachute (Q4), bean plants and fertiliser
 * (Q7), four balances (Q8), a toy car on a ramp (Q9) and a bouncing ball (Q10). The decks used plants and sunlight, the paper aeroplane, ice and
 * sugar, thermometers, the ramp practical and the broken ruler.
 *
 * 45 marks in 45 minutes. Numbers come from scientific-research-assessment.numbers.json (written by scientific-research-assessment-check.py with
 * sympy). Markup: **bold** in any string is bold in the paper.
 */
const NUM = require('./scientific-research-assessment.numbers.json');
const FB = NUM.feedback;
const LET = 'ABCD';

/* --------------------------------------------------------------------- *
 * Part kinds (see the renderer):
 *   text      the part line, then `space` writing lines
 *   circle    the part line, then `opts` on one line to circle from
 *   each      each item: a statement, then `opts` to circle
 *   mcq       each item: a question, then four lettered options (`ans` = right one)
 *   blank     each item: a question, then "label ____"
 *   answer    the part line, then one "prefix ____ unit" line
 *   cross     the part line, then a reminder "Draw on the graph."
 * `image` on a part puts a picture after its line (Q10's graph).
 * --------------------------------------------------------------------- */
const QUESTIONS = [
  { n: 1, marks: 4, lesson: 'Numbers in Science', skill: 'quick recall: significant figures, standard form, Kelvin',
    parts: [{ l: '', t: 'Write each answer. Use **K = °C + 273**.', m: 4, kind: 'blank', label: 'Answer:', items: [
      'Round 7.463 to **2 significant figures**.',
      'Write 0.00062 in **standard form**.',
      'Convert 20 °C to **kelvin** (K).',
      'Convert 330 K to **degrees Celsius** (°C).',
    ] }],
    ms: [{ l: '', pts: ['1 7.5;', '2 6.2 × 10⁻⁴;', '3 293 (K);', '4 57 (°C);'], note: 'One mark each. Accept 6.2 x 10^-4 and 6.2E-4. A unit is not required, but reject a wrong unit (293 °C). Reject 62 × 10⁻⁵ and 0.62 × 10⁻³ (the first number must be between 1 and 10).' }],
    wrong: 'Item 1: 7.4 (the 6 was ignored and the number rounded down). Item 2: 6.2 × 10⁴ (the sign of the power wrong) or 0.62 × 10⁻³. Item 3: 253 (273 taken away instead of added). Item 4: 603 (273 added instead of taken away).' },

  { n: 2, marks: 4, lesson: 'How Scientists Investigate, Fair Tests and Variables, Measuring And Recording Honestly, Averages Graphs and Models', skill: 'key word definitions (multiple choice)',
    parts: [{ l: '', t: 'Circle **ONE** letter for each question.', m: 4, kind: 'mcq', items: [
      { q: 'What is a hypothesis?', opts: ['A fact that has been proved.', 'A prediction that you can test.', 'The results of an investigation.', 'A guess that nobody can test.'], ans: 1 },
      { q: 'What is a controlled variable?', opts: ['The variable that you measure.', 'The variable that you change.', 'A variable that you keep the same.', 'The result of the test.'], ans: 2 },
      { q: 'What does it mean if a set of measurements is precise?', opts: ['They are all close to the true value.', 'They are close together.', 'They were made with the wrong instrument.', 'They are all the same as the mean.'], ans: 1 },
      { q: 'What is a model in science?', opts: ['A simplified idea, picture or equation that helps to explain or predict.', 'An exact copy of the real thing.', 'A table of results.', 'A test that has been repeated.'], ans: 0 },
    ] }],
    ms: [{ l: '', pts: ['1 B;', '2 C;', '3 B;', '4 A;'], note: 'One mark each. If two letters are circled, score 0 for that question. Accept the answer written out instead of the letter.' }],
    wrong: 'Item 1: D (confusing "a prediction" with "a guess"). Item 2: B (controlled confused with independent). Item 3: A (precise confused with accurate, the one the class found hard). Item 4: B (a model has to be an exact copy).' },

  { n: 3, marks: 3, lesson: 'How Scientists Investigate', skill: 'decide what is testable',
    parts: [{ l: '', t: 'Could you test the statement by **measuring** something? Circle **YES** or **NO**.', m: 3, kind: 'each', opts: ['YES', 'NO'], items: [
      'Butterflies are the most beautiful insects.',
      'Seeds sprout faster in warm soil than in cold soil.',
      'Basketball is more fun than football.',
    ] }],
    ms: [{ l: '', pts: ['1 NO;', '2 YES;', '3 NO;'], note: 'One mark each. If both words are circled, score 0 for that statement.' }],
    wrong: 'Statement 1 or 3 circled YES (it sounds like a statement about the real world, but "beautiful" and "fun" cannot be measured).' },

  { n: 4, marks: 4, lesson: 'How Scientists Investigate', skill: 'write a testable hypothesis; investigations loop; lab safety',
    stem: 'A student wants to find out whether the size of a paper parachute changes how quickly it falls.',
    parts: [
      { l: '(a)', t: 'Write a hypothesis for the investigation. Start with the words **"If I make the parachute bigger, then ..."** and finish with a reason that starts with **"because"**.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: 'The test gives a strange result. **State** what a scientist could do next.', m: 1, kind: 'text', space: 2 },
      { l: '(c)', t: '**State ONE** thing you must do before you light a Bunsen burner.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['a prediction you could measure (for example: it will fall more slowly, it will take longer to reach the ground);', 'a reason that starts with because and makes sense (for example: because more air pushes up against it);'], note: 'The prediction must say what happens to the fall time or speed. Reject "it will be better". Accept any sensible reason about air catching the parachute. Do not award the second mark for a reason with no prediction.' },
      { l: '(b)', pts: ['go back and repeat the test (or check how it was done, or go back to an earlier step);'], note: 'Accept "repeat it", "do it again" and "check what went wrong". Reject "ignore it", "delete it" and "start a new project".' },
      { l: '(c)', pts: ['any one of: put on goggles; tie back long hair; check that the safety (orange) flame is on with the air hole closed;'], note: 'Reject "wash your hands" and "wear a coat". Accept "set the burner to the safety flame".' },
    ],
    wrong: '(a): "if I make it bigger it will be better" (not measurable) or a prediction with no because. (b): "ignore it" or "do not worry". (c): "wash my hands" or "put on a coat".' },

  { n: 5, marks: 9, lesson: 'Fair Tests and Variables', skill: 'name the independent, dependent and control variables in a described investigation; explain fairness and repeating',
    stem: 'A student wants to find out whether the temperature of the water changes how quickly a tea bag turns the water brown. She puts a tea bag into a cup of water and times how many seconds it takes for the water to turn deep brown. She tests water at 20 °C, 40 °C, 60 °C and 80 °C. She tests each temperature three times and takes the mean.',
    parts: [
      { l: '(a)', t: '**Name** the independent variable.', m: 1, kind: 'text', space: 1 },
      { l: '(b)', t: '**Name** the dependent variable.', m: 1, kind: 'text', space: 1 },
      { l: '(c)', t: '**Name TWO** control variables. These are things she must keep the same.', m: 2, kind: 'text', space: 2 },
      { l: '(d)', t: '**Explain** why the control variables must be kept the same.', m: 2, kind: 'text', space: 3 },
      { l: '(e)', t: '**Explain** why she tests each temperature three times and takes the mean.', m: 2, kind: 'text', space: 3 },
      { l: '(f)', t: 'For the 80 °C test she runs out of tea bags and uses a different type. **Explain** how this affects her investigation.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['the temperature of the water;'], note: 'Accept "water temperature" and "temperature". Reject "the time" and "the tea bag".' },
      { l: '(b)', pts: ['the time (taken) for the water to turn brown (in seconds);'], note: 'Accept "how quickly the water turns brown" and "the number of seconds". Reject "the temperature" and "the colour of the water" on its own.' },
      { l: '(c)', pts: ['one control variable;', 'a second, different control variable;'], note: 'Any two from: the same type (and size) of tea bag; the same volume of water; the same cup; the same stirring (or none); the same colour that counts as "deep brown"; the same person timing. Reject "the temperature" (that is the independent variable) and "the time" (that is the dependent variable). Do not accept the same answer in two wordings.' },
      { l: '(d)', pts: ['so that only the independent variable (the temperature) can be the reason for any change in the result;', 'so the test is fair (so she knows what caused the difference in the time);'], note: 'Accept "otherwise she would not know which thing made the difference" for either point. Reject "to make the result accurate" on its own.' },
      { l: '(e)', pts: ['one odd (unusual) result would not mislead her; it checks the result is not a fluke;', 'the mean gives a more reliable (typical) result;'], note: 'Reject "to make the test fair" and "to make it more accurate" on their own: a repeat does not make a test fair. Accept "so she can spot an anomaly".' },
      { l: '(f)', pts: ['the test is no longer fair (two things changed: the temperature and the tea bag), so she cannot tell which one caused the difference;'], note: 'Accept "the tea bag could be the reason for the result". Reject "it makes the result wrong" with no reason.' },
    ],
    wrong: '(a) and (b) the wrong way round, or (a) "the tea bag". (c): "the temperature" or "the time". (d): "to make it accurate". (e): "to make it fair", the confusion between replication and control that the lesson warns about. (f): "the results would be wrong" with no mention of two things changing.' },

  { n: 6, marks: 4, lesson: 'Fair Tests and Variables', skill: 'diagnose a misconception about variables and repeating',
    parts: [
      { l: '(a)', t: 'A student says: "A controlled variable is one that changes during the test." **Explain** what is wrong with this.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: 'A student says: "I only need to do each test once if I measure carefully." **Explain** what is wrong with this.', m: 2, kind: 'text', space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['a controlled variable is kept the same (it does not change);', 'it is kept the same so that it cannot be the reason for the result (so the test is fair);'], note: 'Accept "the variable that changes is the independent variable" for the first point if the student also says that a controlled variable stays the same. Reject "it is the variable you measure".' },
      { l: '(b)', pts: ['careful measuring does not remove a one-off odd result (a fluke can still happen);', 'repeating the test and taking the mean gives a more reliable result;'], note: 'Reject "you need to repeat to be accurate" on its own. Accept "one result could be a mistake and you would not know".' },
    ],
    wrong: '(a): "a controlled variable is the one you measure" or "the one you control, which means you change it". (b): "you repeat to make it accurate", with no mention of a fluke or a reliable mean.' },

  { n: 7, marks: 3, lesson: 'Fair Tests and Variables', skill: 'spot an unfair test and fix it',
    stem: 'A student wants to find out whether fertiliser makes bean plants grow taller. She puts plant A on a sunny windowsill and gives it fertiliser. She puts plant B in a dark cupboard and gives it no fertiliser. She waters both plants every day. After two weeks plant A is taller.',
    parts: [
      { l: '(a)', t: '**Explain** why this is **not** a fair test.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: '**Suggest ONE** change that would make the test fair.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['two things are different (the fertiliser and the amount of light);', 'so she cannot tell which one made plant A taller;'], note: 'Accept "light" and "fertiliser" both named, or "more than one thing changed". Reject "she only used two plants" as the only reason.' },
      { l: '(b)', pts: ['put both plants in the same place (both on the windowsill, or both in the cupboard) so the light is the same;'], note: 'Accept any change that keeps the light the same. Reject "use more plants" and "give plant B fertiliser" (that removes the independent variable).' },
    ],
    wrong: '(a): "plant B was in the dark so it could not grow", which says the light matters but does not say that two things changed. (b): "use more plants".' },

  { n: 8, marks: 4, lesson: 'Measuring And Recording Honestly', skill: 'classify readings: accurate, precise, both, neither',
    stem: 'The true mass of a metal block is **50.0 g**. Four balances each measure it three times.',
    image: 'balances_table.png', imageW: 5.6,
    box: ['**BOTH**||accurate and precise', '**PRECISE**||precise, but not accurate', '**ACCURATE**||accurate, but not precise', '**NEITHER**||not accurate and not precise'],
    parts: [{ l: '', t: 'Circle **ONE** word for each balance.', m: 4, kind: 'each', bare: true, opts: ['BOTH', 'PRECISE', 'ACCURATE', 'NEITHER'], items: ['**Balance A**', '**Balance B**', '**Balance C**', '**Balance D**'] }],
    ms: [{ l: '', pts: ['A ACCURATE;', 'B BOTH;', 'C NEITHER;', 'D PRECISE;'], note: `One mark each. Balance A: mean ${NUM.q8.A.mean} g, range ${NUM.q8.A.range} g (right on average, spread out). Balance B: mean ${NUM.q8.B.mean} g, range ${NUM.q8.B.range} g (close together and right). Balance C: mean ${NUM.q8.C.mean} g, range ${NUM.q8.C.range} g (spread out and about 5 g low). Balance D: mean ${NUM.q8.D.mean} g, range ${NUM.q8.D.range} g (close together but about 2 g low). If two words are circled, score 0 for that balance.` }],
    wrong: 'Balance D circled BOTH, because the readings are close together ("close together must mean accurate"), the one the class found hard. Balance A circled NEITHER, because the readings are spread out and the mean was not checked against 50.0 g.' },

  { n: 9, marks: 2, lesson: 'Measuring And Recording Honestly', skill: 'record what actually happened',
    stem: 'A student times how long a toy car takes to roll down a ramp. Her three results are **2.1 s**, **2.2 s** and **3.4 s**. She expected about 2.1 s, so she crosses out 3.4 s and writes 2.1 s in her table.',
    parts: [
      { l: '(a)', t: '**Explain** what is wrong with what she did.', m: 1, kind: 'text', space: 2 },
      { l: '(b)', t: '**State** what she should do instead.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['she changed a result to match what she expected, instead of recording what actually happened;'], note: 'Accept "she was not honest" and "she must record what she saw". Reject "3.4 s is the wrong answer" and "she should not have crossed it out neatly".' },
      { l: '(b)', pts: ['record 3.4 s as it happened and repeat the measurement (to check it);'], note: 'Accept "keep the 3.4 s in the table and do the test again". Reject "delete the 3.4 s" and "change it to the mean".' },
    ],
    wrong: '(a): "it is not accurate" or "she should use a better stopwatch". (b): "she should measure it again and write the new result over the old one".' },

  { n: 10, marks: 8, lesson: 'Averages, Graphs and Models', skill: 'mean and range from a table; plot, draw a line of best fit and read a value; choose a graph; what a model is for',
    stem: 'A student drops a ball from four different heights and measures how high it bounces. She drops the ball three times from each height. Her results are in the table. The means for 20 cm and 40 cm are already worked out and plotted on the graph.',
    image: 'ball_table.png', imageW: 4.3,
    parts: [
      { l: '(a)', t: '**Calculate** the mean bounce height for a drop height of **60 cm**.', m: 1, kind: 'answer', prefix: 'Mean:', unit: 'cm' },
      { l: '(b)', t: '**Calculate** the mean bounce height for a drop height of **80 cm**.', m: 1, kind: 'answer', prefix: 'Mean:', unit: 'cm' },
      { l: '(c)', t: '**Calculate** the range of the bounce heights for a drop height of **80 cm**.', m: 1, kind: 'answer', prefix: 'Range:', unit: 'cm' },
      { l: '(d)', t: 'On the graph, plot the means for **60 cm** and **80 cm** with small crosses. Then draw a **line of best fit** with a ruler.', m: 2, kind: 'cross', image: 'ball_graph.png', imageW: 3.9 },
      { l: '(e)', t: 'Use your line of best fit to **estimate** the bounce height for a drop height of **50 cm**.', m: 1, kind: 'answer', prefix: 'Estimate:', unit: 'cm' },
      { l: '(f)', t: 'The student also wants to show the mean bounce height of the ball on carpet, wood and tiles. Circle the **best** type of graph.', m: 1, kind: 'circle', opts: ['bar chart', 'line graph', 'pie chart'] },
      { l: '(g)', t: 'A line of best fit is a **model**. **State ONE** thing that it lets the student do that the table of results cannot.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: [`${NUM.q10.means['60']} (cm);`], note: '(34 + 38 + 36) ÷ 3 = 108 ÷ 3 = 36. Unit not required. If the unit is wrong or the working is shown but the answer is wrong, score 0.' },
      { l: '(b)', pts: [`${NUM.q10.means['80']} (cm);`], note: '(45 + 49 + 50) ÷ 3 = 144 ÷ 3 = 48.' },
      { l: '(c)', pts: [`${NUM.q10.range80} (cm);`], note: '50 − 45 = 5. Reject 50 (the highest only) and 4 (the gap between the two closest results).' },
      { l: '(d)', pts: ['both means plotted correctly: (60, 36) and (80, 48), each within half a small square;', 'a ruler line of best fit through the middle of the four means (about as many points above as below), not dot to dot;'], note: 'Allow error carried forward: if (a) or (b) was wrong, award the plotting mark for the points plotted at the student\'s own answers. A line that passes through all four means or very close to all of them is correct. Reject a line joined dot to dot and a line forced through (0, 0) that misses the points.' },
      { l: '(e)', pts: ['30 (cm); accept 29 to 32;'], note: `Read from the line at 50 cm. The least-squares line through the four means gives ${NUM.q10.est50.toFixed(2)} cm. Allow error carried forward from the student's own line: accept any value within 1 cm of where their line crosses 50 cm.` },
      { l: '(f)', pts: ['bar chart;'], note: 'Carpet, wood and tiles are categories (words), not numbers.' },
      { l: '(g)', pts: ['predict a result that was not measured (for example the bounce for a drop height of 50 cm);'], note: 'Accept "estimate a value between the points" and "show the pattern". Reject "it makes the results more accurate" and "it shows the mean".' },
    ],
    msImage: 'ball_graph_answer.png',
    wrong: '(a) and (b): 108 and 144 (the total, the division forgotten) or ÷ 4. (c): 50 (the highest). (d): all twelve results plotted, or dot to dot. (f): line graph.' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => { const s = q.parts.reduce((a, pt) => a + pt.m, 0); if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`); });
QUESTIONS.forEach((q) => q.parts.filter((pt) => pt.kind === 'mcq').forEach((pt) => pt.items.forEach((it) => {
  if (it.opts.length !== 4 || !(it.ans >= 0 && it.ans < 4)) throw new Error(`Q${q.n}: bad multiple-choice item "${it.q}"`);
  if (pt.items.length !== pt.m) throw new Error(`Q${q.n}: one mark per multiple-choice item`);
})));
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);
QUESTIONS.forEach((q) => q.parts.filter((pt) => pt.kind === 'mcq').forEach((pt) => {
  const want = pt.items.map((it, i) => `${i + 1} ${LET[it.ans]};`);
  if (JSON.stringify(q.ms[0].pts) !== JSON.stringify(want)) throw new Error(`Q${q.n}: mark scheme ${q.ms[0].pts} does not match the options, expected ${want}`);
}));
/* the Lesson 2 weighting the brief asked for: question 5 is the one described investigation, and Lesson 2 carries the most marks */
const L2 = 1 + 9 + 4 + 3;
if (L2 !== 17) throw new Error('Lesson 2 should carry 17 marks');

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S: same skill, smaller numbers, more scaffold
 *   C: same demand, fresh context
 *   E: harder, an extra step, a reversal or an unfamiliar context
 * `table` is a small two-column data list. `a` are the answers, shown only in the mark scheme. Text uses **bold** markup.
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: { t: ['Use **K = °C + 273**. The first significant figure is the first digit that is not zero.', '1  Round 4.32 to 2 significant figures.   ________', '2  Write 0.004 in standard form.   ________', '3  Convert 10 °C to kelvin.   ________ K', '4  Convert 300 K to °C.   ________ °C'], a: ['4.3;', '4 × 10⁻³;', '283 (K);', '27 (°C);'] },
    C: { t: ['1  Round 8.157 to 2 significant figures.   ________', '2  Write 0.00047 in standard form.   ________', '3  Convert 40 °C to kelvin.   ________ K', '4  Convert 280 K to °C.   ________ °C'], a: ['8.2;', '4.7 × 10⁻⁴;', '313 (K);', '7 (°C);'] },
    E: { t: ['1  Write 0.00003062 in standard form, to 2 significant figures.', '2  A freezer is at 250 K. Convert this to °C.', '3  A student says a sample is at −300 °C. **Explain** why this is impossible.'], lines: 4, a: ['3.1 × 10⁻⁵;', '−23 (°C);', 'the lowest possible temperature is absolute zero, 0 K or −273 °C, and −300 °C is colder than that;'] } },
  { n: 2,
    S: { t: ['Complete the sentences. Use the words in the box.', 'A hypothesis is a ______________ that you can test.', 'A controlled variable is kept the ______________.', 'Precise measurements are close ______________.', 'Box: prediction, same, together'], a: ['prediction;', 'same;', 'together;'] },
    C: { t: ['Circle **ONE** letter for each question.', '1  What is the independent variable?   A  the one you measure   B  the one you change   C  the one you keep the same', '2  What is the dependent variable?   A  the one you measure   B  the one you change   C  the one you keep the same', '3  What does accurate mean?   A  close together   B  close to the true value   C  the same every time'], a: ['1 B;', '2 A;', '3 B;'] },
    E: { t: ['A bathroom scale always reads 2 kg too high.', '**Explain** the difference between accurate and precise, using the scale as your example.'], lines: 4, a: ['accurate means close to the true value; precise means repeated readings are close together;', 'the scale gives the same wrong answer every time, so it is precise but not accurate;'] } },
  { n: 3,
    S: { t: ['Key: you can test an idea if you could **measure** something.', 'Circle YES or NO.', '1  "Ice melts faster in warm water than in cold water."   YES   NO', '2  "Pink is the nicest colour."   YES   NO'], a: ['YES;', 'NO;'] },
    C: { t: ['Circle YES or NO for each statement.', '1  "Metal spoons get hot faster than wooden spoons in hot water."   YES   NO', '2  "Jazz is better than rock music."   YES   NO', '3  "Cress seeds sprout faster on wet paper than on dry paper."   YES   NO'], a: ['YES; NO; YES;'] },
    E: { t: ['"Dogs are friendlier than cats."', 'This cannot be tested as it is written. Rewrite it as a hypothesis that you **could** test. Say what you would measure.'], lines: 3, a: ['for example: if I count how many times a stranger is greeted in 5 minutes, then dogs will greet more often than cats;', 'a clear measurement (a count or a time) is named;'] } },
  { n: 4,
    S: { t: ['Complete the hypothesis. Use the words in the box.', 'If I use a bigger sail, then the boat will move ______________, because there is more ______________ for the wind to push.', 'Box: faster, slower, surface, colour', 'A scientist gets a strange result. Circle one: **go back and repeat the test** / **ignore the result**', 'Name the flame to use when you are not heating: ______________'], a: ['faster; surface;', 'go back and repeat the test;', 'the safety flame (orange);'] },
    C: { t: ['A student wants to find out whether a thicker rubber band stretches further.', 'Write a hypothesis. Start with **"If I use a thicker rubber band, then ..."** and finish with **"because ..."**', 'A test gives a strange result. **State** what to do next.', '**State** one safety rule for using a Bunsen burner.'], lines: 4, a: ['a measurable prediction (it stretches less, or further) and a reason with because;', 'repeat the test, or check how it was done;', 'any one: goggles on; hair tied back; safety flame when not heating; stand while using it;'] },
    E: { t: ['Write a hypothesis, starting with **If ... then ... because ...**, about a question of your own on plants.', 'Then **explain** why a scientist goes back to an earlier step when a test goes wrong, instead of giving up.'], lines: 5, a: ['a hypothesis with a change, a measurable effect and a reason;', 'investigations are a loop, not a staircase; a strange result can be a mistake in the test or a new question, so the scientist repeats or rethinks;'] } },
  { n: 5,
    S: { t: ['A student tests whether the amount of water changes how tall a bean plant grows.', 'Complete the sentences. Use the words in the box.', 'The independent variable is the ______________ of water.', 'The dependent variable is the ______________ of the plant.', 'One controlled variable is the type of ______________.', 'Box: amount, height, seed, colour'], a: ['amount;', 'height;', 'seed (accept soil, pot, light);'] },
    C: { t: ['A student investigates whether the mass of an ice cube changes how long it takes to melt in a cup of warm water. She uses ice cubes of 10 g, 20 g and 30 g and times how long each takes to melt.', '**Name** the independent variable, the dependent variable and **TWO** control variables.', '**Explain** why she repeats each test three times.'], lines: 6, a: ['independent: the mass of the ice cube;', 'dependent: the time to melt;', 'two control variables, for example: the temperature of the water; the volume of water; the same cup; the same shape of ice;', 'to check one odd result is not a fluke and to take a more reliable mean;'] },
    E: { t: ['A student says: "This is a fair test." She grows bean plants with 0 cm³, 5 cm³ and 10 cm³ of fertiliser. The plants are in different rooms. She measures the height of each plant after a week.', '**Name** the independent variable and the dependent variable. **Name TWO** variables that she has not controlled. Then **write** one sentence to say how to make it a fair test.'], lines: 6, a: ['independent: the volume of fertiliser; dependent: the height of the plant;', 'two uncontrolled variables, for example: the room (the light or the temperature); the type of plant or the size of the pot;', 'keep everything except the fertiliser the same, for example by putting all the plants in the same room;'] } },
  { n: 6,
    S: { t: ['Key: a controlled variable is **kept the same**.', 'Circle TRUE or FALSE.', '1  "A controlled variable changes during the test."   TRUE   FALSE', '2  "Repeating a test helps you to spot a strange result."   TRUE   FALSE'], a: ['FALSE;', 'TRUE;'] },
    C: { t: ['A student says: "The dependent variable is the one I change."', '**Explain** what is wrong with this.', 'A student says: "My first result looks right, so I do not need to repeat it." **Explain** what is wrong with this.'], lines: 5, a: ['the one you change is the independent variable; the dependent variable is the one you measure (it changes because of the independent variable);', 'a result can look right and still be a fluke; repeating and taking a mean gives a more reliable result;'] },
    E: { t: ['A student says: "I kept everything the same, so there is no independent variable."', '**Explain** what is wrong with this.'], lines: 4, a: ['a fair test needs one thing that is changed on purpose, the independent variable;', 'if nothing changes there is nothing to compare, so no pattern can be found; only the control variables stay the same;'] } },
  { n: 7,
    S: { t: ['Plant A is on a windowsill and has fertiliser. Plant B is on the same windowsill and has no fertiliser.', 'Circle YES or NO: is this a fair test?   YES   NO', 'Complete the sentence: only the ______________ is different between the plants.', 'Box: fertiliser, light, pot'], a: ['YES;', 'fertiliser;'] },
    C: { t: ['A student tests whether a bigger magnet picks up more paper clips. She puts a small magnet on the bench. She holds a big magnet 5 cm above a box of paper clips.', '**Explain** why this is not a fair test. **Suggest** one change.'], lines: 4, a: ['two things are different (the size of the magnet and how close it is to the clips), so she cannot tell which one caused the difference;', 'hold both magnets at the same distance from the clips;'] },
    E: { t: ['Plan a fair test to find out whether the thickness of a rope changes how much weight it can hold before it breaks.', '**Name** what you change, what you measure and **TWO** things you keep the same.'], lines: 5, a: ['change: the thickness of the rope;', 'measure: the weight it holds before it breaks;', 'keep the same, two of: the length of the rope; the type of rope material; how the weight is added; the way it is tied;'] } },
  { n: 8,
    S: { t: ['Key: **precise** means close together. **Accurate** means close to the true value.', 'The true mass is 10 g. A balance reads 12 g, 12 g and 12 g.', 'Circle: the readings are close together.   YES   NO', 'Circle: the readings are close to the true value.   YES   NO', 'Circle one word: the balance is   ACCURATE   /   PRECISE'], a: ['YES;', 'NO;', 'PRECISE;'] },
    C: { t: ['The true length of a stick is **20.0 cm**. Four students measure it three times.', `P: ${FB.q8c.P.join(', ')}      Q: ${FB.q8c.Q.join(', ')}`, `R: ${FB.q8c.R.join(', ')}      S: ${FB.q8c.S.join(', ')}`, 'For each student, circle ONE: BOTH / PRECISE / ACCURATE / NEITHER', 'P   Q   R   S'], lines: 2, a: ['P BOTH;', 'Q PRECISE;', 'R ACCURATE;', 'S NEITHER;'] },
    E: { t: ['A thermometer reads 102 °C, 102 °C and 102 °C in boiling water. Water boils at 100 °C.', '**State** whether it is accurate, precise, both or neither. Then **explain** how the student can still use it to get the right temperature.'], lines: 4, a: ['precise but not accurate;', 'it is 2 °C too high every time, so take 2 °C off every reading (check it against a known value);'] } },
  { n: 9,
    S: { t: ['A student measures 2.1 s, 2.2 s and 3.4 s. She expects about 2.1 s.', 'Circle one: she should   RECORD 3.4 s and repeat   /   CHANGE 3.4 s to 2.1 s'], a: ['RECORD 3.4 s and repeat;'] },
    C: { t: ['A student weighs a bag of sand three times: 250 g, 251 g and 262 g. She writes 250 g, 251 g and 251 g in her table because the last result "looked wrong".', '**Explain** what is wrong, and **state** what she should do.'], lines: 3, a: ['she changed a result because of what she expected, instead of recording what happened;', 'record 262 g and repeat the weighing;'] },
    E: { t: ['**Explain** why a scientist who deletes inconvenient results is not doing good science, even if the result they keep looks neater.'], lines: 4, a: ['conclusions must be based on what actually happened, not on what was hoped for;', 'the odd result may be a mistake, or it may be a new discovery; deleting it means nobody can check;'] } },
  { n: 10,
    S: { table: [['Drop height (cm)', 'Bounce 1, 2, 3 (cm)'], ['20', '12, 14, 16'], ['40', '24, 26, 28']], t: ['**Calculate** the mean bounce for 20 cm.   ________ cm', '**Calculate** the range of the bounce heights for 20 cm.   ________ cm', 'Hint: the mean is the total divided by the number of results. The range is the highest take away the lowest.'], a: ['14 (cm), (12 + 14 + 16) ÷ 3;', '4 (cm), 16 − 12;'] },
    C: { table: [['Drop height (cm)', 'Bounce 1, 2, 3 (cm)'], ['10', `${FB.q10c['10'].join(', ')}`], ['20', `${FB.q10c['20'].join(', ')}`], ['30', `${FB.q10c['30'].join(', ')}`], ['40', `${FB.q10c['40'].join(', ')}`]], t: ['**Calculate** the mean bounce height for 20 cm and for 30 cm.', '**Calculate** the range for 30 cm.', 'Which type of graph would you use to plot the means against the drop height? Circle one: bar chart / line graph / pie chart'], lines: 3, a: ['20 cm: 16 (cm); 30 cm: 24 (cm);', 'range for 30 cm: 3 (cm);', 'line graph (both are numbers);'] },
    E: { table: [['Drop height (cm)', 'Four bounces (cm)'], ['20', `${FB.q10e['20'].join(', ')}`], ['40', `${FB.q10e['40'].join(', ')}`], ['60', `${FB.q10e['60'].join(', ')}`]], t: ['**Calculate** the mean bounce for each drop height.', 'The means lie on a straight line through (0, 0). Use this pattern to **predict** the bounce for a drop height of 100 cm.', '**Explain** why you should trust your prediction for 50 cm more than your prediction for 100 cm.'], lines: 5, a: ['16 (cm), 32 (cm), 48 (cm);', 'the bounce is 0.8 of the drop height, so 0.8 × 100 = 80 (cm);', '50 cm is between measured heights; 100 cm is outside the range that was tested, and the pattern may change;'] } },
];
FEEDBACK.forEach((f) => { if (!f.S || !f.C || !f.E) throw new Error(`feedback Q${f.n} is missing a variant`); });
if (FEEDBACK.length !== QUESTIONS.length) throw new Error('every question needs a feedback row');

module.exports = { QUESTIONS, FEEDBACK, TOTAL, LET };

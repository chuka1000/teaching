/**
 * How Science Works assessment (7B): the questions, the mark scheme and the
 * feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full before writing anything): Theories and Laws OLD,
 * Scientific Theories OLD, Inductive Reasoning OLD, How Do You Know OLD and Who
 * Got Left Out OLD.
 *
 * NOTES from the brief: this is their first exam of the year, so the
 * instructions are plain and each question says what to do. Revised after the
 * first draft: the instructions were cut right back (a short list on the cover,
 * no command-word table, no boxes), and the history questions from Who Got Left
 * Out were dropped as nice to know rather than essential. The paper now opens
 * with multiple-choice definitions of the key words (evidence, logic, inductive
 * and deductive reasoning, law, theory, counterexample).
 *
 * Contexts avoid named places in Thailand: the "everyone says so" claim is a
 * generic one (carrots), not the durian claim from the deck.
 *
 * 45 marks in 45 minutes. Numbers come from how-science-works-assessment.numbers.json
 * (written by how-science-works-assessment-check.py with sympy).
 *
 * Markup: **bold** in any string is bold in the paper.
 */
const NUM = require('./how-science-works-assessment.numbers.json');
const FB = NUM.feedback;

/* --------------------------------------------------------------------- *
 * Part kinds (see the renderer):
 *   text      the part line, then `space` writing lines
 *   circle    the part line, then `opts` on one line to circle from
 *   each      each item: a statement, then `opts` to circle (YES/NO, HUNCH/...)
 *   mcq       each item: a question, then four lettered options (`ans` = right one)
 *   answer    the part line, then one "prefix ____ unit" line
 *   cross     the part line, then a reminder "Draw on the graph."
 * --------------------------------------------------------------------- */
const LET = 'ABCD';

const QUESTIONS = [
  { n: 1, marks: 4, lesson: 'How Do You Know and Inductive Reasoning', skill: 'key word definitions (multiple choice)',
    parts: [{ l: '', t: 'Circle **ONE** letter for each question.', m: 4, kind: 'mcq', items: [
      { q: 'Which sentence describes science best?', opts: ['A list of facts that you learn by heart.', 'What scientists do in white coats in a laboratory.', 'A way of learning about the natural world, based on evidence and logic.', 'Any idea that many people believe.'], ans: 2 },
      { q: 'What is evidence?', opts: ['Something that many people say is true.', 'Something you measure or observe in the natural world.', 'A guess about what will happen.', 'An old saying that has been passed down.'], ans: 1 },
      { q: 'What is logic?', opts: ['The path from the evidence to a conclusion.', 'A measurement made in a test.', 'A big explanation for why something happens.', 'A rule that says what always happens.'], ans: 0 },
      { q: 'What is a counterexample?', opts: ['An example that supports a general rule.', 'The second time you repeat an experiment.', 'A conclusion that has been proved.', 'One observation that does not fit a general rule.'], ans: 3 },
    ] }],
    ms: [{ l: '', pts: ['1 C;', '2 B;', '3 A;', '4 D;'], note: 'One mark each. If two letters are circled, score 0 for that question. Accept the answer written out instead of the letter.' }],
    wrong: 'Q1: D (a popular belief counted as science). Q2: A or D (what people say counted as evidence). Q3: C (logic confused with theory), because both are big new words.' },

  { n: 2, marks: 4, lesson: 'Inductive Reasoning, Theories and Laws', skill: 'key word definitions (multiple choice)',
    parts: [{ l: '', t: 'Circle **ONE** letter for each question.', m: 4, kind: 'mcq', items: [
      { q: 'What is inductive reasoning?', opts: ['Applying a general rule to one case.', 'Guessing without any evidence.', 'Drawing a general conclusion from many observations.', 'Proving that a rule is true for ever.'], ans: 2 },
      { q: 'What is deductive reasoning?', opts: ['Drawing a general conclusion from many observations.', 'Applying a general rule to one case.', 'Repeating an experiment to check it.', 'Working out who did it.'], ans: 1 },
      { q: 'What is a scientific law?', opts: ['An explanation of why something happens.', 'A rule that people must obey.', 'A theory that has been proved.', 'A description of what always happens under the same conditions.'], ans: 3 },
      { q: 'What is a scientific theory?', opts: ['A big explanation, backed by a huge amount of evidence.', 'A guess.', 'A law that has been proved.', 'An idea that nobody has tested.'], ans: 0 },
    ] }],
    ms: [{ l: '', pts: ['1 C;', '2 B;', '3 D;', '4 A;'], note: 'One mark each. If two letters are circled, score 0 for that question. Accept the answer written out instead of the letter.' }],
    wrong: 'Q1: A (inductive and deductive swapped). Q3: A (a law "explains", the everyday mistake) or B ("law means a rule you must obey"). Q4: B ("a theory is a guess").' },

  { n: 3, marks: 3, lesson: 'Theories and Laws', skill: 'classify: law or theory',
    parts: [{ l: '', t: 'Circle **LAW** or **THEORY** for each statement.', m: 3, kind: 'each', opts: ['LAW', 'THEORY'], items: [
      'Two north poles push each other apart.',
      'Everything is made of tiny particles that never stop moving.',
      'Everything falls at the same rate in a vacuum.',
    ] }],
    ms: [{ l: '', pts: ['1 LAW;', '2 THEORY;', '3 LAW;'], note: 'One mark each. Accept L and T. If both words are circled, score 0 for that statement.' }],
    wrong: 'Statement 2 circled LAW because "it is a fact about particles"; statements 1 and 3 circled THEORY because they sound like big ideas.' },

  { n: 4, marks: 4, lesson: 'How Do You Know', skill: 'decide what science can answer',
    parts: [{ l: '', t: 'Can science answer it? Circle **YES** or **NO**. Ask: could you **measure** something?', m: 4, kind: 'each', opts: ['YES', 'NO'], items: [
      'How far away is the Moon?',
      'Is chocolate the best flavour of ice cream?',
      'Does a plant grow taller in a dark cupboard than on a windowsill?',
      'Is it fair to set homework at the weekend?',
    ] }],
    ms: [{ l: '', pts: ['1 YES;', '2 NO;', '3 YES;', '4 NO;'], note: 'One mark each. If both words are circled, score 0 for that question.' }],
    wrong: 'Question 3 circled NO ("it sounds like a silly thing to test"); question 4 circled YES ("science can find out if homework is good for you"). Science can measure what homework does to results. It cannot say what is fair.' },

  { n: 5, marks: 5, lesson: 'Scientific Theories and Theories and Laws', skill: 'classify; explain the difference in a word',
    box: ['**HUNCH**||a guess. No evidence is needed.', '**HYPOTHESIS**||an idea you can test, with a reason.', '**THEORY**||a well-tested explanation, backed by a huge amount of evidence.'],
    parts: [
      { l: '(a)', t: 'Circle **ONE** word for each statement.', m: 3, kind: 'each', letters: true, opts: ['HUNCH', 'HYPOTHESIS', 'THEORY'], items: [
        '"My theory is that the bus is late because the driver overslept."',
        '"Puddles dry faster on a windy day, because the wind carries the water away."',
        '"Everything is made of tiny particles that never stop moving."',
      ] },
      { l: '(b)', t: 'In statement A the person uses the word "theory". **Explain** how this is different from the way scientists use the word "theory".', m: 2, kind: 'text', space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['A hunch;', 'B hypothesis;', 'C theory;'], note: 'One mark each. Statement B has a reason and could be tested, so it is a hypothesis.' },
      { l: '(b)', pts: ['in everyday speech "theory" means a guess or a hunch (with no evidence needed);', 'a scientific theory is a well-tested explanation, backed by a huge amount of evidence;'], note: 'Accept "the best explanation we have" for the second point. Reject "a scientific theory is a guess that has been proved" and "a theory becomes a law".' },
    ],
    wrong: '(a): A circled THEORY because the word is in the sentence; B circled HUNCH. (b): "a theory is a guess" repeated for the scientific meaning.' },

  { n: 6, marks: 4, lesson: 'Theories and Laws', skill: 'diagnose a misconception; law and theory doing different jobs',
    parts: [
      { l: '(a)', t: 'A student says: "A theory becomes a law once it has been proved." **Explain** what is wrong with this.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: 'Water boils at 100 °C at sea level. Particle theory says that water boils when its particles have enough energy to escape from the liquid. **Explain** why the first is a law and the second is a theory.', m: 2, kind: 'text', space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['a law and a theory do different jobs (a law describes what happens, a theory explains why);', 'more evidence does not turn an explanation into a description, so neither one turns into the other;'], note: 'Accept "they answer different questions" for the first point and "a theory never becomes a law" for the second, if the reason is also given. Reject "a theory is a guess" and "a law is a theory that has been proved".' },
      { l: '(b)', pts: ['the first says what happens (it gives the number) and does not say why, so it is a law;', 'the second says why it happens (an explanation), so it is a theory;'], note: 'Both points need the words "what" and "why", or clear equivalents such as "describes" and "explains". Reject "a law is always true and a theory can be wrong".' },
    ],
    wrong: '(a): "a theory is a guess that gets proved", which repeats the misconception; (b): "the law is a fact and the theory is an idea", with no reference to what and why.' },

  { n: 7, marks: 4, lesson: 'Scientific Theories', skill: 'read a diagram; explain why; conclusion',
    stem: 'In the 1600s most people believed that rotting meat turned into maggots all by itself. In 1668 Francesco Redi put meat in three jars. Flies could reach the meat in jar A. Flies could not get through the gauze on jar B, but air could. Jar C was sealed.',
    image: 'redi_jars.png', imageW: 6.0,
    stem2: '**Results.** Jar A: maggots on the meat. Jar B: maggots on the gauze, but none on the meat. Jar C: no maggots at all.',
    parts: [
      { l: '(a)', t: 'The **control** is the jar that shows what normally happens. Write the letter of the control jar.', m: 1, kind: 'answer', prefix: 'Control jar:' },
      { l: '(b)', t: 'Redi covered jar B with gauze instead of a lid. **Explain** why.', m: 2, kind: 'text', space: 3 },
      { l: '(c)', t: '**State** what Redi concluded about where maggots come from.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['A;'], note: 'Accept "the open jar". Reject B and C.' },
      { l: '(b)', pts: ['air can get in through the gauze (so nobody can say the meat needed air);', 'flies cannot get in (only the flies are kept out);'], note: 'Accept "so the only thing that changed was whether flies could reach the meat". Reject "so the maggots could get out".' },
      { l: '(c)', pts: ['maggots hatch from eggs laid by flies (they come from flies, life comes from life);'], note: 'Reject "meat turns into maggots" and "maggots come from air".' },
    ],
    wrong: '(a): C ("it is the one with nothing changed"); (b): "so the flies could get in", which is the opposite of what the gauze does.' },

  { n: 8, marks: 3, lesson: 'Scientific Theories', skill: 'what evidence shows and what a theory explains',
    stem: 'In the 1840s in a hospital in Vienna, far more new mothers died of a fever on the ward run by doctors than on the ward run by midwives. In 1847 Dr Ignaz Semmelweis made the doctors wash their hands in chlorine solution. The number of deaths fell. His results showed that handwashing worked, but nobody could say why it worked. Many doctors still refused to believe him.',
    parts: [
      { l: '(a)', t: 'Semmelweis\'s evidence showed one of these things. Circle **ONE**.', m: 1, kind: 'circle', opts: ['WHAT happened', 'WHY it happened'] },
      { l: '(b)', t: '**Explain** why some doctors still refused to believe him.', m: 1, kind: 'text', space: 2 },
      { l: '(c)', t: '**State** what a scientific theory of handwashing would have told the doctors that the results did not.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['WHAT happened;'], note: 'His evidence showed what happened (deaths fell); it did not explain why.' },
      { l: '(b)', pts: ['he could show what happened but could not explain why (results alone do not convince people without an explanation); OR the doctors did not like being told they were causing deaths;'], note: 'Accept any one. Reject "he was not a real doctor" and "handwashing does not work".' },
      { l: '(c)', pts: ['why handwashing works (the explanation, the reason, the mechanism);'], note: 'Accept "why it saves lives" and "what causes the fever". Do not require the word "germs": that is history, and the question tests what a theory does. Reject "what happens when the hands are washed" (that is what the results show).' },
    ],
    wrong: '(a): WHY it happened, because the passage is about a reason; (c): "that handwashing works", which is what the results already show.' },

  { n: 9, marks: 3, lesson: 'Inductive Reasoning and How Do You Know', skill: 'unfamiliar context; conclusion from observations',
    stem: 'A student drops a stone, a coin, a marble, a key and a battery into a bowl of water. All five sink.',
    parts: [
      { l: '(a)', t: 'Write **ONE** conclusion. Start with the words "In general".', m: 1, kind: 'text', space: 2 },
      { l: '(b)', t: 'The student then puts a wooden block in the water. It floats. **Explain** what this shows about the conclusion in part (a).', m: 2, kind: 'text', space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['a general statement that covers all five objects, beginning "In general" (for example: In general, objects sink in water; In general, things made of metal or stone sink);'], note: 'Accept any general rule that fits the five observations. Reject a statement about only one object ("the stone sinks"). Ignore a missing capital letter.' },
      { l: '(b)', pts: ['the conclusion is wrong (too broad, it does not always hold);', 'one counterexample (one observation that does not fit) is enough to break a general rule, however many observations support it;'], note: 'Accept "not everything sinks" for the first point and "even five sinking things cannot prove it" for the second.' },
    ],
    wrong: '(b): "the student made a mistake in the experiment" or "wood is different", with no statement about the conclusion.' },

  { n: 10, marks: 4, lesson: 'Inductive Reasoning', skill: 'read a graph; plot a point; describe a trend; improve an argument',
    stem: 'A farmer feeds a turkey every morning. The graph shows how sure the turkey is that it will be fed tomorrow, after each number of days. On day 101 something different happens, and the turkey\'s conclusion turns out to be wrong.',
    image: 'turkey_graph.png', imageW: 5.4,
    parts: [
      { l: '(a)', t: 'Use the graph to find how sure the turkey is after 20 days.', m: 1, kind: 'answer', prefix: 'Answer:', unit: '%' },
      { l: '(b)', t: 'After 50 days the turkey is 98% sure. Draw a cross (**×**) on the graph at 50 days and 98%.', m: 1, kind: 'cross' },
      { l: '(c)', t: '**Describe** how the turkey\'s confidence changes as the days go by.', m: 1, kind: 'text', space: 2 },
      { l: '(d)', t: '**State ONE** thing the turkey could have done to make its conclusion stronger.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['95 (accept 94 to 96);'], note: `From the curve: ${NUM.q10.day20.toFixed(1)}% after 20 days. The unit is printed on the answer line.` },
      { l: '(b)', pts: ['a cross at 50 days and 98% (accept 97 to 99), on the curve;'], note: `The curve passes through ${NUM.q10.day50.toFixed(1)}% at 50 days, so the cross sits on the line. A dot or a tick is accepted if the position is right.` },
      { l: '(c)', pts: ['it rises quickly at first, then more and more slowly (levelling off near 100%);'], note: 'Accept "it goes up fast then slows down" and "it never quite reaches 100". Reject "it goes up" with no change of speed described.' },
      { l: '(d)', pts: ['any one of: look for different conditions (not the same situation every day); find out why it is being fed (a mechanism); look for a counterexample (what happened to earlier turkeys);'], note: 'Reject "more days" or "a bigger sample": the turkey already had 100 days, and the lesson\'s point is that a big sample was not enough.' },
    ],
    wrong: '(c): "it goes up all the time"; (d): "the turkey should have watched for more days".' },

  { n: 11, marks: 4, lesson: 'How Do You Know', skill: 'unfamiliar context; explain why; describe a test',
    stem: 'Everyone in a town says that eating carrots helps you to see in the dark.',
    parts: [
      { l: '(a)', t: 'A student says: "It must be true because everyone says so." **Explain** why this is not good scientific evidence.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: '**Describe** how you could find out whether eating carrots really helps people to see in the dark. Say what you would **measure** and how you would make your test **fair**.', m: 2, kind: 'text', space: 3 },
    ],
    ms: [
      { l: '(a)', pts: ['how many people say something is not evidence (nobody has measured anything, many people can be wrong);', 'evidence has to be measured or observed in a test;'], note: 'Accept "people can all believe something that is not true" for the first point. Reject "because it is an old saying" on its own.' },
      { l: '(b)', pts: ['a measurement of seeing in the dark, for example the number of letters read or the distance at which something can be seen in dim light;', 'a fair comparison, for example one group eats carrots and one group does not, with everything else kept the same (same light, same age, same time);'], note: 'The first mark needs something that can be measured. Reject "ask people if they feel they see better" as the measurement. Accept "repeat the test" as an addition, not as a substitute for the comparison.' },
    ],
    wrong: '(a): "because it might be wrong", with no reference to measuring; (b): "ask everyone" or "give carrots to one person and see".' },

  { n: 12, marks: 3, lesson: 'Scientific Theories', skill: 'diagnose a misconception; apply new evidence to a theory',
    stem: 'For a long time people believed that the Earth sat still at the centre and that everything orbited it. Then Copernicus said that the Earth orbits the Sun. In 1610 Galileo looked through a telescope and saw moons orbiting Jupiter.',
    parts: [
      { l: '(a)', t: 'A student says: "The old idea changed, so the scientists who believed it were stupid and their theory was never any good." **Explain** what is wrong with this.', m: 2, kind: 'text', space: 3 },
      { l: '(b)', t: '**Explain** why seeing moons orbit Jupiter was a problem for the idea that everything orbits the Earth.', m: 1, kind: 'text', space: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['a theory is the best explanation we have with the evidence we have so far (the scientists reasoned properly on what they knew), so they were not stupid;', 'when new evidence arrives the theory is improved; changing a theory is science working, not failing (a strength);'], note: 'Accept "science corrects its own mistakes" or "you would not want a map that is never updated" for the second point. Reject "they were stupid but it does not matter".' },
      { l: '(b)', pts: ['something orbits a planet, not the Earth, so not everything orbits the Earth;'], note: 'Accept "the moons go round Jupiter, not round us". Reject "Jupiter is bigger" and "the telescope was better".' },
    ],
    wrong: '(a): "they had no telescope" (true, but does not answer the misconception); (b): "Jupiter is a planet", with no link to what orbits what.' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => { const s = q.parts.reduce((a, pt) => a + pt.m, 0); if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`); });
QUESTIONS.forEach((q) => q.parts.filter((pt) => pt.kind === 'mcq').forEach((pt) => pt.items.forEach((it) => {
  if (it.opts.length !== 4 || !(it.ans >= 0 && it.ans < 4)) throw new Error(`Q${q.n}: bad multiple-choice item "${it.q}"`);
  if (pt.items.length !== pt.m) throw new Error(`Q${q.n}: one mark per multiple-choice item`);
})));
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* The multiple-choice answers in the mark scheme must agree with the `ans` fields. */
QUESTIONS.forEach((q) => q.parts.filter((pt) => pt.kind === 'mcq').forEach((pt) => {
  const want = pt.items.map((it, i) => `${i + 1} ${LET[it.ans]};`);
  if (JSON.stringify(q.ms[0].pts) !== JSON.stringify(want)) throw new Error(`Q${q.n}: mark scheme ${q.ms[0].pts} does not match the options, expected ${want}`);
}));

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S: same skill, smaller numbers, more scaffold
 *   C: same demand, fresh context
 *   E: harder, an extra step, a reversal or an unfamiliar context
 * `table` is a small two-column data list. `a` are the answers, shown only in
 * the mark scheme. Text uses **bold** markup.
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: { t: ['Complete the sentence. Use the words in the box.', 'Science is a way of learning about the natural world, based on ______________ and ______________.', 'Box: evidence, logic, luck'], a: ['evidence; logic;'] },
    C: { t: ['Write what each word means.', '**evidence**', '**logic**'], lines: 2, a: ['evidence: something you measure or observe in the natural world;', 'logic: the path from the evidence to the conclusion;'] },
    E: { t: ['A rule says: "All birds can fly."', 'Give a **counterexample**. Then **explain** what it does to the rule.'], lines: 3, a: ['a penguin (or an ostrich, a kiwi);', 'one observation that does not fit is enough to break a general rule, however many flying birds you have seen;'] } },
  { n: 2,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Inductive reasoning goes from many ______________ to one general ______________.', 'Box: observations, conclusion, guess'], a: ['observations; conclusion;'] },
    C: { t: ['Write one sentence to say what a **law** is.', 'Write one sentence to say what a **theory** is.'], lines: 3, a: ['a law describes what always happens under the same conditions (it does not say why);', 'a theory is a big explanation, backed by a huge amount of evidence (it says why);'] },
    E: { t: ['Write one inductive statement and one deductive statement about metals.', '**Explain** the difference in direction between them.'], lines: 4, a: ['inductive: copper, iron and zinc all conduct electricity, so in general all metals conduct;', 'deductive: all metals conduct electricity, steel is a metal, so steel conducts;', 'inductive goes from specific to general; deductive goes from general to specific;'] } },
  { n: 3,
    S: { t: ['Key: a law says WHAT happens. A theory says WHY it happens.', 'Circle LAW or THEORY.', '"Water boils at 100 °C at sea level."   LAW / THEORY', '"Every living thing is made of cells."   LAW / THEORY'], a: ['LAW; THEORY;'] },
    C: { t: ['Circle **LAW** or **THEORY** for each statement.', '1  Two objects pull on each other with a force you can work out.   LAW / THEORY', '2  Living things change over many generations to suit where they live.   LAW / THEORY', '3  Water boils at 100 °C at sea level.   LAW / THEORY'], a: ['LAW; THEORY; LAW;'] },
    E: { t: ['Water boils at 100 °C at sea level, and at a lower temperature high up a mountain.', 'Write one law and one theory about this. Then explain why the theory is more useful on a mountain nobody has measured yet.'], lines: 4, a: ['law: water boils at 100 °C at sea level and lower as you go up (describes what happens);', 'theory: particle theory: with less air pressing down the particles need less energy to escape (explains why);', 'the theory tells you what will happen somewhere nobody has measured; the law only describes what has been measured;'] } },
  { n: 4,
    S: { t: ['Complete the sentence. Use the words in the box.', 'Science can answer a question if you can ______________ something.', 'Box: measure, guess, vote', 'Circle YES or NO: Can science answer "How hot is the water?"'], a: ['measure;', 'YES;'] },
    C: { t: ['Circle YES or NO for each question.', '1  How long does a phone battery last?   YES   NO', '2  Which colour is the prettiest?   YES   NO', '3  Does salt dissolve faster in hot water than in cold water?   YES   NO'], a: ['YES; NO; YES;'] },
    E: { t: ['Should the school build a new car park?', 'Science cannot decide this on its own. Write what science **can** tell you and what people must decide.'], lines: 3, a: ['science can measure the effects (traffic, noise, air, the land it would cover);', 'people must decide whether it is worth it and what matters most (that is about values, not measurements);'] } },
  { n: 5,
    S: { t: ['Key: a HUNCH is a guess with no evidence. A THEORY is a well-tested explanation.', 'Circle the correct word.', '"I think it will rain because my knee hurts."   HUNCH / THEORY', '"Every living thing is made of cells."   HUNCH / THEORY'], a: ['HUNCH; THEORY;'] },
    C: { t: ['Circle **ONE** word for each statement: HUNCH, HYPOTHESIS or THEORY.', '1  "My theory is that the cat likes me best."', '2  "Ice melts faster on a metal tray than on a plastic tray, because metal carries heat faster."', '3  "Living things change over many generations."'], a: ['1 hunch; 2 hypothesis; 3 theory;'] },
    E: { t: ['"My theory is that the cat knocked the vase over."', 'Rewrite this hunch as a hypothesis with a reason. Then say what you would look for to test it.'], lines: 3, a: ['for example: the cat knocked the vase over, because there are paw prints in the spilled flour;', 'check whether the paw prints match the cat;'] } },
  { n: 6,
    S: { t: ['Complete the sentences. Use the words in the box.', 'A law describes ______________ happens. A theory explains ______________ it happens.', 'Box: what, why', 'Circle TRUE or FALSE: "A theory becomes a law once it is proved."   TRUE / FALSE'], a: ['what; why;', 'FALSE;'] },
    C: { t: ['A student says: "It is only a theory, so you can ignore it."', '**Explain** what is wrong with this.'], lines: 3, a: ['a scientific theory is not a guess: it is the best-evidenced kind of idea there is;', 'the student is using the everyday meaning of "theory", not the scientific one;'] },
    E: { t: ['Write one law and one theory about the **same** thing (for example water boiling, or falling objects).', '**Explain** why the law and the theory are both useful.'], lines: 4, a: ['a law describing what happens and a theory explaining why, about the same thing;', 'the law gives you the number or the pattern; the theory tells you why, and lets you predict where nobody has measured;'] } },
  { n: 7,
    S: { t: ['Complete the sentence. Use the words in the box.', 'Redi covered jar B with gauze because air could get in but ______________ could not.', 'Box: flies, air, light', 'Redi\'s open jar shows what normally happens. It is called the ______________.', 'Box: control, cover, result'], a: ['flies;', 'control;'] },
    C: { t: ['A student tests whether plants need light. Plant X is on a windowsill. Plant Y is in a dark cupboard.', 'Which plant is the control? **Explain** your answer.'], lines: 2, a: ['plant X;', 'it shows what normally happens (with light);'] },
    E: { t: ['A critic says: "Jar C had no maggots because there was no air inside, not because flies were kept out."', '**Explain** how jar B answers the critic.'], lines: 3, a: ['air could get into jar B through the gauze, but there were still no maggots on the meat;', 'so air is not what was needed; only keeping the flies out changed the result;'] } },
  { n: 8,
    S: { t: ['Complete the sentences. Use the words in the box.', 'Semmelweis\'s evidence showed ______________ happened. It did not explain ______________ it happened.', 'Box: what, why', 'Circle YES or NO: Do results alone always convince people?   YES   NO'], a: ['what; why;', 'NO (people also want an explanation);'] },
    C: { t: ['**Explain** why the evidence alone did not persuade many doctors.'], lines: 3, a: ['he could not explain why handwashing worked; some doctors did not like being told they had caused deaths;'] },
    E: { t: ['**Explain** why a theory that says WHY handwashing works is more useful to a doctor in a hospital that nobody has studied than the Vienna results are.'], lines: 4, a: ['the results describe what happened in one hospital;', 'a theory explains why, so it can be applied to any hospital, including one nobody has measured;'] } },
  { n: 9,
    S: { t: ['A student tests four magnets. All four attract iron.', 'Write a conclusion. Start with: "In general, magnets ..."'], lines: 2, a: ['In general, magnets attract iron;'] },
    C: { t: ['Every morning this week the school bus arrived before 8:00. Write a conclusion. Start with "In general".', 'On Friday the bus arrives at 8:20. **Explain** what this shows.'], lines: 4, a: ['In general, the school bus arrives before 8:00;', 'one observation that does not fit shows the conclusion is not always true (it may need to change);'] },
    E: { t: ['"Every swan in my local park is white, so all swans are white."', '**Explain** why this is a weak argument. Use the words: sample, counterexample.'], lines: 4, a: ['the sample is small and all from one place (one park);', 'a counterexample exists (black swans were found in Australia), and one counterexample breaks the rule;'] } },
  { n: 10,
    S: { table: [['Days fed', 'How sure (%)'], ['0', '50'], ['1', '67'], ['5', '86'], ['20', '95']], t: ['Use the table to find how sure the turkey is after 5 days.', 'Is the turkey more sure after 20 days or after 5 days? Circle one: 5 days / 20 days'], a: [`${FB.q10s['5']}% (86);`, '20 days (95 is more than 86);'] },
    C: { table: [['Days fed', 'How sure (%)'], ['0', '50'], ['2', '75'], ['10', '92'], ['50', '98']], t: ['Between which two numbers of days does the confidence rise by the most? Circle one: 0 and 2 / 2 and 10 / 10 and 50', '**Describe** the pattern in the table.'], lines: 2, a: ['0 and 2 (it rises by 25);', 'it rises quickly at first, then more slowly, and never reaches 100;'] },
    E: { t: ['A turkey\'s confidence, as a percentage, is (n + 1) ÷ (n + 2) × 100, where n is the number of days it has been fed.', '**Calculate** the confidence after 8 days and after 98 days. Then **explain** why 99% is not the same as certain.'], lines: 4, a: [`8 days: 9 ÷ 10 × 100 = ${FB.q10e[0]}%;`, `98 days: 99 ÷ 100 × 100 = ${FB.q10e[1]}%;`, 'a general rule from observations can never be proved; one counterexample (day 101) can break it;'] } },
  { n: 11,
    S: { t: ['Complete the sentences. Use the words in the box.', 'How many people say something is ______________ evidence.', 'To find out if it is true, I would ______________ something.', 'Box: not, measure, guess'], a: ['not;', 'measure;'] },
    C: { t: ['Everyone in a school says that plants grow better if you talk to them.', '**Describe** how you could find out. Say what you would measure and how you would make it fair.'], lines: 4, a: ['measure the height of the plants after some days;', 'compare plants that are talked to with plants that are not, with the same light, water and soil;'] },
    E: { t: ['Use the carrot claim from the paper. Write a hypothesis with a reason. Then name the variable you change, the variable you measure, and **two** variables you keep the same.'], lines: 5, a: ['hypothesis with a reason, for example: eating carrots improves seeing in dim light, because carrots contain something the eye needs;', 'change: eating carrots or not; measure: how many letters are read in dim light;', 'keep the same, two of: the light, the age of the people, the time, the distance to the letters;'] } },
  { n: 12,
    S: { t: ['Circle the correct words.', 'When new evidence arrives, a theory can be IMPROVED / IGNORED.', 'A theory that changes when new evidence arrives is a STRENGTH / WEAKNESS.'], a: ['IMPROVED;', 'STRENGTH;'] },
    C: { t: ['A student says: "A theory that can change is weak."', 'Give **one** reason why a theory that can change is a strength.'], lines: 3, a: ['it means science can correct its own mistakes; the theory is the best explanation so far and gets better with new evidence;'] },
    E: { t: ['Would you rather use a map that is never updated? Use this idea to **explain** why changing a theory is science working, not failing.'], lines: 4, a: ['a map that is never updated becomes wrong when things change;', 'a theory that is updated when new evidence arrives gets closer to how things really are;'] } },
];
FEEDBACK.forEach((f) => { if (!f.S || !f.C || !f.E) throw new Error(`feedback Q${f.n} is missing a variant`); });
if (FEEDBACK.length !== QUESTIONS.length) throw new Error('every question needs a feedback row');

module.exports = { QUESTIONS, FEEDBACK, TOTAL, LET };

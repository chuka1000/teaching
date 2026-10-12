/**
 * Y8 Science, Pathogens And Antibiotics, worksheet (8I). The fallback for the True or false blitz. Per TEMPLATE.md, in each tier a fully worked example, a
 * half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet
 * this outside the lesson?" (Q10). Every number comes from build/prokaryotes.data.json through build/pathogens-and-antibiotics-answers.js.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./pathogens-and-antibiotics-answers');
const { DATA } = A;
const X = DATA.antibiotics;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./prokaryotes-sheet')({
  lesson: 'Pathogens And Antibiotics', header: 'Prokaryotes, Lesson 6', answers: A,
  banner: 'Antibiotic resistance is natural selection in bacteria, and it is happening now.',
  criteria: ['I can define a pathogen, and name two bacterial diseases.', 'I can explain how an antibiotic works, and what it cannot treat.', 'I can explain how bacteria become resistant to an antibiotic.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow } = WS;
const { HeightRule } = WS.DP.D;
const k = WS.begin();

function sortTable() {
  const w1 = 2000, w2 = Math.floor((PAGE_W - w1) / 2);
  const hd = (x, w) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const out = [new TableRow({ children: [hd('Illness', w1), hd('Bacterial or viral?', w2), hd('Will an antibiotic help?', w2)] })];
  [['a cold', ''], ['tuberculosis', ''], ['flu', ''], ['cholera', '']].forEach(([g]) => out.push(new TableRow({ cantSplit: true, height: { value: 460, rule: HeightRule.ATLEAST }, children: [
    cell(p(g, { size: 10.5, bold: true, after: 0 }), { w: w1 }), cell(p('', { after: 0 }), { w: w2 }), cell(p('', { after: 0 }), { w: w2 }),
  ] })));
  return table(out, [w1, w2, w2]);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'Pathogens, antibiotics and the four steps.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Tuberculosis is caused by a bacterium. Can it be treated with an antibiotic?',
  'Yes. An antibiotic kills bacteria, and TB is a bacterial infection.',
]));
k.push(q('1', 'Half-worked. A pathogen is a microorganism that causes ______________.', { marks: 1 }));
k.push(ruled(1));
k.push(q('2', 'Name two bacterial diseases.', { marks: 2 }));
k.push(ruled(1));
k.push(q('3', 'Complete the table. Write bacterial or viral, and yes or no.', { marks: 4 }));
k.push(sortTable());
k.push(WS.sp());
k.push(q('4', 'Put the four steps of resistance in order. Write the letters.', { marks: 4 }));
k.push(...box('STEPS', [
  'a  The antibiotic kills the bacteria that are not resistant.', 'b  The offspring are resistant too.',
  'c  A few bacteria are already resistant, by chance.', 'd  The resistant survivors reproduce.',
], { fill: 'FFF8E1' }));
k.push(ruled(1));
k.push(q('5', 'Penicillin stops bacteria building their cell wall. Explain why it does not harm your cells.', { marks: 2 }));
k.push(ruled(2));

/* ---- SILVER ---- */
k.push(...WS.tier('SILVER', 'Numbers, reasons and a friend with leftovers.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `A population has ${n(X.million.total)} bacteria. 1 in every ${n(X.million.one_in)} is resistant. How many are resistant?`,
  `${n(X.million.total)} ÷ ${n(X.million.one_in)} = ${X.million.resistant} resistant bacteria.`,
]));
k.push(q('6', `Half-worked. A population has ${n(X.two_million.total)} bacteria and 1 in every ${n(X.two_million.one_in)} is resistant. ${n(X.two_million.total)} ÷ ${n(X.two_million.one_in)} = ______ resistant bacteria.`, { marks: 1 }));
k.push(ruled(1));
k.push(q('7', `The resistant bacteria survive and divide every 20 minutes (a best case). Calculate how many there are after 2 hours. Start with your answer to Q6.`, { marks: 3 }));
k.push(ruled(3));
k.push(q('8', 'Why does that step work? The antibiotic does not make bacteria resistant. Explain what the antibiotic does.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'A student writes: “The bacteria learned to resist the antibiotic.” Find the mistake and write the correct explanation.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'A friend feels better after two days and wants to save the rest of their antibiotics for next time. Write what you would say, and why.', { marks: 3 }));
k.push(ruled(3));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Numbers, plasmids and the whole argument.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `${X.million.resistant} resistant bacteria survive and divide every 20 minutes. How many after 3 hours (a best case)?`,
  `3 × 60 = 180 minutes. 180 ÷ 20 = ${X.grow.div_3h} divisions. ${X.grow.survivors} × 2^${X.grow.div_3h} = ${n(X.grow.after_3h)} bacteria.`,
]));
k.push(q('11', `Half-worked. The ${X.grow.survivors} survivors divide for 6 hours. 6 × 60 = ______ minutes. ______ ÷ 20 = ______ divisions. ${X.grow.survivors} × 2^${X.grow.div_6h} = ______ bacteria.`, { marks: 3 }));
k.push(ruled(2));
k.push(q('12', `In ${X.tb.year}, ${X.tb.ill_m} million people fell ill with tuberculosis and ${X.tb.died_m} million died. Calculate the percentage who died, to the nearest whole number.`, { marks: 3 }));
k.push(ruled(2));
k.push(q('13', 'Explain how a harmless bacterium can become resistant without dividing, and why this is a problem.', { marks: 3 }));
k.push(ruled(3));
k.push(q('14', 'Use the four steps of natural selection to explain why using antibiotics when they are not needed makes resistance more common.', { marks: 4 }));
k.push(ruled(4));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q14. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

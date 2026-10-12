/**
 * Y8 Science, Archaea And Extreme Places, worksheet (8I). The fallback for the Sorter game. Per TEMPLATE.md, in each tier a fully worked example, a
 * half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you
 * meet this outside the lesson?" (Q10). Every number comes from build/prokaryotes.data.json through build/archaea-and-extreme-places-answers.js.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./archaea-and-extreme-places-answers');
const { DATA } = A;
const X = DATA.archaea;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./prokaryotes-sheet')({
  lesson: 'Archaea And Extreme Places', header: 'Prokaryotes, Lesson 4', answers: A,
  banner: 'Archaea look like bacteria, but they are a different group, and we can tell from their chemistry and DNA.',
  criteria: ['I can describe what archaea are.', 'I can describe three habitats where archaea live.', 'I can explain how archaea differ from bacteria.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow } = WS;
const { HeightRule } = WS.DP.D;
const k = WS.begin();

function habitatTable(rows) {
  const w1 = 2200, w2 = Math.floor((PAGE_W - w1) / 2);
  const hd = (x, w) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const out = [new TableRow({ children: [hd('Name', w1), hd('Where it lives', w2), hd('What is special', w2)] })];
  rows.forEach(([g, a, b]) => out.push(new TableRow({ cantSplit: true, height: { value: 560, rule: HeightRule.ATLEAST }, children: [
    cell(p(g, { size: 10.5, bold: true, after: 0 }), { w: w1 }),
    cell(p(a || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: a ? 'EFE6EF' : undefined }),
    cell(p(b || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: b ? 'EFE6EF' : undefined }),
  ] })));
  return table(out, [w1, w2, w2]);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The three habitats and the three domains.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A microbe lives in a hot spring where the water is very hot. What kind of archaean is it?',
  'It loves heat, so it is a thermophile. Thermo means heat.',
]));
k.push(q('1', 'Half-worked. A methanogen lives where there is no ______________, and it makes the gas ______________.', { marks: 2 }));
k.push(ruled(1));
k.push(q('2', 'Complete the table. The first row is done for you.', { marks: 4 }));
k.push(habitatTable([
  ['thermophile', 'hot springs and deep-sea vents', 'loves very hot water'],
  ['halophile', '', ''],
  ['methanogen', '', ''],
]));
k.push(WS.sp());
k.push(q('3', 'Name the three domains of life.', { marks: 3 }));
k.push(ruled(1));
k.push(q('4', 'Write true or false. (a) Archaea are a type of bacteria. (b) Archaea have a nucleus. (c) Archaea look like bacteria under a microscope.', { marks: 3 }));
k.push(ruled(2));
k.push(q('5', 'You are in a domain too. Which one, and how do you know?', { marks: 2 }));
k.push(ruled(1));

/* ---- SILVER ---- */
k.push(...WS.tier('SILVER', 'Explain, sort and check.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Is a microbe from a hot spring an archaean?',
  'Not necessarily. Some bacteria, such as cyanobacteria, live in hot springs too. The place does not decide the group. You check its chemistry and DNA.',
]));
k.push(q('6', 'Half-worked. Archaea and bacteria look the ______________ under a microscope. Scientists tell them apart by their ______________ and their ______________.', { marks: 3 }));
k.push(ruled(1));
k.push(q('7', 'A scientist finds a microbe with no nucleus in a hot spring. Explain why she cannot yet say it is an archaean.', { marks: 2 }));
k.push(ruled(2));
k.push(q('8', 'Why does that step work? We tell archaea from bacteria by chemistry and DNA, not by looking. Explain why looking does not work.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'Write bacterium, archaean or neither for each. (a) A methane-making microbe in a swamp. (b) A cyanobacterium. (c) A flu virus. (d) A microbe that grows at 113 °C at a deep-sea vent. (e) A yeast cell. (f) A microbe that turns milk into yoghurt.', { marks: 6 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet methane-making archaea outside the lesson? Name a place and say why there is no oxygen there.', { marks: 3 }));
k.push(ruled(3));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Numbers, and what it means for life elsewhere.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A microbe grows at 113 °C. A hot spring is at 70 °C. How much hotter is the microbe\'s home?',
  `${X.temps.vent} − ${X.temps.spring} = ${X.temps.over_spring} °C hotter.`,
]));
k.push(q('11', `Half-worked. Sea water is ${X.dead_sea.sea_pct}% salt and the Dead Sea is ${X.dead_sea.pct}% salt. ${X.dead_sea.pct} ÷ ${X.dead_sea.sea_pct} = ______. So the Dead Sea is about ______ times saltier.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('12', `A cow makes between ${X.cow.low} and ${X.cow.high} litres of methane a day. Calculate how much that is in a week. Give both numbers.`, { marks: 3 }));
k.push(ruled(3));
k.push(q('13', `The hottest microbe grows at ${X.temps.record} °C, under very high pressure. Water boils at ${X.temps.boil} °C at sea level. Calculate how far above that ${X.temps.record} °C is, and explain why the water does not boil.`, { marks: 3 }));
k.push(ruled(3));
k.push(q('14', 'Explain why finding microbes in hot springs and under ice makes scientists think about life on other worlds.', { marks: 3 }));
k.push(ruled(3));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q7 and Q14. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

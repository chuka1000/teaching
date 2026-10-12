/**
 * Y8 Science, The Bacteria We Need, worksheet (8I). Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on purpose
 * (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q10).
 * Every number comes from build/prokaryotes.data.json through build/the-bacteria-we-need-answers.js. The last page carries the YOGHURT record (the practical
 * is set up in this lesson and read at the start of Lesson 6). Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./the-bacteria-we-need-answers');
const { DATA } = A;
const U = DATA.useful;
const WS = require('./prokaryotes-sheet')({
  lesson: 'The Bacteria We Need', header: 'Prokaryotes, Lesson 5', answers: A,
  banner: 'Life on Earth could not carry on without bacteria. Most of them are helpful or harmless.',
  criteria: ['I can describe how bacteria recycle nutrients.', 'I can describe how bacteria are used in food and medicine.', 'I can explain what the bacteria in my gut do for me.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow } = WS;
const { HeightRule } = WS.DP.D;
const k = WS.begin();

function jobTable(rows) {
  const w1 = 2300, w2 = Math.floor((PAGE_W - w1) / 2);
  const hd = (x, w) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const out = [new TableRow({ children: [hd('Bacteria', w1), hd('Where or how', w2), hd('What they do for us', w2)] })];
  rows.forEach(([g, a, b]) => out.push(new TableRow({ cantSplit: true, height: { value: 560, rule: HeightRule.ATLEAST }, children: [
    cell(p(g, { size: 10.5, bold: true, after: 0 }), { w: w1 }),
    cell(p(a || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: a ? 'EFE6EF' : undefined }),
    cell(p(b || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: b ? 'EFE6EF' : undefined }),
  ] })));
  return table(out, [w1, w2, w2]);
}
const stepsBox = (lines) => box('STEPS', lines, { fill: 'FFF8E1' });

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The jobs bacteria do, and the insulin steps.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A leaf falls to the ground. What happens to it?',
  'Decomposers feed on the leaf and break it down. They release the nutrients into the soil, so a new plant can take them up.',
]));
k.push(q('1', 'Half-worked. ______________ break down dead plants and animals and return ______________ to the ______________.', { marks: 3 }));
k.push(ruled(1));
k.push(q('2', 'Complete the table. The first row is done for you.', { marks: 6 }));
k.push(jobTable([
  ['decomposers', 'in soil and compost', 'break down dead things and return nutrients'],
  ['nitrogen fixers', '', ''],
  ['gut bacteria', '', ''],
  ['food makers', '', ''],
  ['insulin bacteria', '', ''],
]));
k.push(WS.sp());
k.push(q('3', 'Name two foods made with bacteria, and one made with yeast.', { marks: 3 }));
k.push(ruled(2));
k.push(q('4', 'Put the insulin steps in the right order. Write the letters.', { marks: 5 }));
k.push(...stepsBox([
  'a  Put the plasmid into a bacterium.', 'b  Cut the human insulin gene out of human DNA.', 'c  Collect and clean the insulin.',
  'd  Put the gene into a plasmid.', 'e  The bacteria divide and make insulin.',
]));
k.push(ruled(1));
k.push(q('5', 'True or false: bread rises because of bacteria. Explain.', { marks: 2 }));
k.push(ruled(1));

/* ---- SILVER ---- */
k.push(...WS.tier('SILVER', 'Explain and compare.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Why do peas make the soil richer in nitrogen?',
  'Peas have nitrogen-fixing bacteria in their root nodules. The bacteria change nitrogen gas into a form plants can use, and some stays in the soil.',
]));
k.push(q('6', 'Half-worked. Explain what would happen to dead leaves with no decomposers. The leaves would ______________ and the ______________ in them would never return to the ______________.', { marks: 3 }));
k.push(ruled(2));
k.push(q('7', 'Explain why a farmer might grow peas before a crop that needs a lot of nitrogen.', { marks: 2 }));
k.push(ruled(2));
k.push(q('8', 'Why does that step work? The human insulin gene is put into a plasmid before it goes into the bacterium. Explain why a plasmid is used.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'Explain two ways the bacteria in your gut help you.', { marks: 2 }));
k.push(ruled(2));
k.push(q('10', 'Where would you meet bacteria doing something useful outside the lesson? Describe one real example and what they do.', { marks: 3 }));
k.push(ruled(3));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Numbers and a claim to argue with.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A recipe uses 2 spoonfuls of live yoghurt for 500 mL of milk. How many for 2 litres?',
  `2 litres = 2,000 mL. 2,000 ÷ 500 = 4. 4 × 2 = ${U.spoons_2l} spoonfuls.`,
]));
k.push(q('11', 'Half-worked. A person has about 38 trillion bacterial cells and 30 trillion human cells. 38 ÷ 30 = ______ (to 1 decimal place). So there are about ______ bacterial cells for each human cell.', { marks: 2 }));
k.push(ruled(1));
k.push(q('12', 'Milk has a pH of about 6.7. Yoghurt has a pH of about 4.3. Calculate how much the pH falls, and say what the bacteria make that lowers it.', { marks: 3 }));
k.push(ruled(2));
k.push(q('13', 'Scale the recipe. Calculate how many spoonfuls of live yoghurt you need for 3 litres of milk.', { marks: 3 }));
k.push(ruled(2));
k.push(q('14', 'A student says: “All bacteria are germs.” Use three examples from this lesson to explain why that is wrong.', { marks: 3 }));
k.push(ruled(3));

/* ---- THE PRACTICAL ---- */
k.push(WS.pageBreak());
k.push(...box('THE YOGHURT PRACTICAL: SET UP TODAY, READ NEXT LESSON', [
  '1  Wash your hands. Wear safety glasses.   2  Pour 500 mL of UHT milk into a clean flask.   3  Warm it to 40 to 43 °C. Check with the thermometer.',
  '4  Stir in 1 to 2 spoonfuls of plain live yoghurt.   5  Test the pH of the milk and write it below.   6  Cover and label it. Keep it warm for 9 to 24 hours.',
  'NEXT LESSON: look at it, smell it from a distance, and test the pH again. DO NOT TASTE IT. It is a laboratory. Follow your teacher’s instructions for clearing up.',
], { fill: 'FFF8E1' }));
{
  const w = Math.floor(PAGE_W / 3);
  const hd = (x) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const row = (a) => new TableRow({ cantSplit: true, height: { value: 520, rule: HeightRule.ATLEAST }, children: [cell(p(a, { size: 10.5, bold: true, after: 0 }), { w }), cell(p('', { after: 0 }), { w }), cell(p('', { after: 0 }), { w })] });
  k.push(table([new TableRow({ children: [hd(''), hd('Milk, today'), hd('Yoghurt, next lesson')] }), row('pH (pH paper)'), row('What it looks like'), row('What it smells like')], [w, w, w]));
}

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q8 and Q14. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

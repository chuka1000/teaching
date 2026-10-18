/**
 * Y9 Science, The Ozone Layer, worksheet. Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on
 * purpose, with a RAG grid, one "why does that step work?" prompt (Q7) and one "where would you meet this outside the lesson?" (Q10, Q14).
 * Every number comes from build/atmosphere.data.json (the real NASA Ozone Watch table) through build/the-ozone-layer-answers.js.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./the-ozone-layer-answers');
const { DATA } = A;
const Z = DATA.l3;
const WS = require('./atmosphere-sheet')({
  lesson: 'The Ozone Layer', header: 'Atmosphere, Lesson 3', answers: A,
  banner: 'The ozone layer protects us from ultraviolet light. CFCs damaged it, the world acted, and it is recovering.',
  criteria: ['I can describe what the ozone layer does.', 'I can explain how CFCs damage the ozone layer.', 'I can describe what was done about it, and what has happened since.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow, VerticalAlign } = WS;
const { D } = WS.DP;
const { HeightRule } = D;
const HEAD = 'DCE9F1', GREY = 'E9F1F6';
const k = WS.begin();

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The layer and the harm.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'What does the ozone layer do?',
  'It absorbs most of the Sun’s ultraviolet light, so less ultraviolet light reaches the ground.',
]));
k.push(q('1', 'Half-worked. The ozone layer is high up in the ______________. It absorbs most of the Sun’s ______________ light.', { marks: 2 }));
k.push(q('2', 'Name two harms caused by more ultraviolet light reaching the ground.', { marks: 2 }));
k.push(ruled(2));
k.push(q('3', 'Write T (true) or F (false) for each. The ozone layer is at ground level ___   It absorbs ultraviolet light ___   It is a thinning, not a hole ___   A thinner layer lets in more heat ___', { marks: 4 }));
k.push(q('4', 'Put the CFC story in order. Write 1 to 5.   ____ ultraviolet light breaks the CFC apart and chlorine is released   ____ CFCs are used in fridges and aerosol cans   ____ chlorine atoms destroy ozone   ____ CFCs drift up into the stratosphere   ____ the ozone over Antarctica gets very thin each spring', { marks: 5 }));
k.push(q('5', 'In which year was the Montreal Protocol signed? Give one reason it is called a success.', { marks: 2 }));
k.push(ruled(2));

/* ---- SILVER ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('SILVER', 'How CFCs do it.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Why were CFCs thought to be safe?',
  'They did not burn, poison anyone or react with anything at ground level, so nobody saw a danger.',
]));
k.push(q('6', 'Half-worked. Ultraviolet light high up breaks a CFC apart and releases ______________ atoms. One ______________ atom destroys thousands of ozone molecules.', { marks: 2 }));
k.push(q('7', 'Why does that step work? CFCs are harmless at ground level. Explain why they still damage the ozone layer.', { marks: 3 }));
k.push(ruled(3));
k.push(q('8', 'State two things the Montreal Protocol did.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'A student says: “The hole in the ozone layer is causing global warming.” Explain what is wrong.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet ultraviolet light outside the lesson? Say how you protect yourself from it.', { marks: 2 }));
k.push(ruled(2));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Read the record.'));
{
  const yrs = ['1979', '1985', '1990', '2000', '2006', '2010', '2015', '2020', '2025'];
  const w1 = 2800, w = Math.floor((PAGE_W - w1) / yrs.length);
  const hd = (x, ww) => cell(p(x, { size: 9.5, bold: true, after: 0 }), { w: ww, fill: HEAD });
  const row = new TableRow({ children: [cell(p('Mean area of the hole (million km²)', { size: 9.5, bold: true, after: 0 }), { w: w1, fill: GREY, valign: VerticalAlign.CENTER }), ...yrs.map((y) => cell(p(String(Z.area[y]), { size: 10, after: 0 }), { w, valign: VerticalAlign.CENTER }))] });
  k.push(...box('THE REAL RECORD. NASA Ozone Watch: the mean area of the Antarctic ozone hole, 7 September to 13 October, in selected years.', ['A bigger area means a thinner ozone layer.'], { fill: 'FFF8E1' }));
  k.push(table([new TableRow({ children: [hd('Year', w1), ...yrs.map((y) => hd(y, w))] }), row], [w1, ...yrs.map(() => w)]));
  k.push(WS.sp());
}
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `Between 1985 and 2006, by how much did the area grow? Area in 2006 − area in 1985.`,
  `${Z.area['2006']} − ${Z.area['1985']} = ${Z.rise_1985_2006} million km².`,
]));
k.push(q('11', `Half-worked. Between 1979 and 2000 the area grew from ${Z.area['1979']} to ${Z.area['2000']} million km². ${Z.area['2000']} − ${Z.area['1979']} = ______ million km².`, { marks: 2 }));
k.push(q('12', 'Describe the trend in the area of the hole from 1979 to 2000, and from 2000 to 2025. Use numbers from the table.', { marks: 3 }));
k.push(ruled(4));
k.push(q('13', 'Explain why the Montreal Protocol worked. Give three reasons.', { marks: 3 }));
k.push(ruled(3));
k.push(q('14', 'Where would you meet this outside the lesson? Name another product or habit that a law changed everywhere, and say why a law was needed.', { marks: 2 }));
k.push(ruled(2));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q13. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

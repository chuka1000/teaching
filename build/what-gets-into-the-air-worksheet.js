/**
 * Y9 Science, What Gets Into The Air, worksheet. Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on
 * purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q7) and one "where would you meet this outside the lesson?" (Q10).
 * Every number comes from build/atmosphere.data.json through build/what-gets-into-the-air-answers.js, so the sheet and the answers cannot disagree.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./what-gets-into-the-air-answers');
const { DATA } = A;
const Z = DATA.l1;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./atmosphere-sheet')({
  lesson: 'What Gets Into The Air', header: 'Atmosphere, Lesson 1', answers: A,
  banner: 'Air pollution: some is released as itself (primary), and some is made in the air (secondary).',
  criteria: ['I can name the main air pollutants and say where each comes from.', 'I can explain the difference between a primary and a secondary pollutant.', 'I can explain how smog forms.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow, VerticalAlign } = WS;
const { D } = WS.DP;
const { HeightRule } = D;
const HEAD = 'DCE9F1', GREY = 'E9F1F6';
const k = WS.begin();

/** A two- or three-column grid with the first column written and the rest blank (or pre-filled). */
function grid(headers, rows, widths) {
  const hd = (x, w) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: HEAD });
  const body = rows.map((r) => new TableRow({ cantSplit: true, height: { value: 470, rule: HeightRule.ATLEAST }, children: r.map((x, i) => (
    i === 0 ? cell(p(x, { size: 10.5, bold: true, after: 0 }), { w: widths[i], valign: VerticalAlign.CENTER })
      : cell(p(x || '', { size: 10, italic: !!x, color: x ? C.soft : C.ink, after: 0 }), { w: widths[i], fill: x ? GREY : undefined, valign: VerticalAlign.CENTER }))) }));
  return table([new TableRow({ children: headers.map((h, i) => hd(h, widths[i])) }), ...body], widths);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'Sources and kinds.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A coal power station burns coal that contains sulfur. Which pollutant does it release?',
  'Sulfur dioxide. Burning sulfur makes sulfur dioxide. It leaves the chimney as itself, so it is a primary pollutant.',
]));
k.push(q('1', 'Half-worked. A coal power station releases sulfur dioxide because the coal contains ______________.', { marks: 1 }));
k.push(ruled(1));
{
  const w1 = 2700;
  k.push(q('2', 'Match each pollutant to where it comes from. Write the letter of the source.', { marks: 5 }));
  k.push(...box('SOURCES', ['A  paint, solvents and fuels evaporating', 'B  burning coal and oil that contain sulfur', 'C  very hot flames in engines and furnaces', 'D  soot from diesel engines and fires', 'E  fuel burning with too little oxygen'], { fill: 'FFF8E1' }));
  k.push(grid(['Pollutant', 'Source (letter)'], [['carbon monoxide', ''], ['sulfur dioxide', ''], ['nitrogen oxides', ''], ['particulates', ''], ['VOCs', '']], [w1, PAGE_W - w1]));
}
k.push(WS.sp());
k.push(q('3', 'Write P (primary) or S (secondary) for each: carbon monoxide ____   ozone in smog ____   sulfur dioxide ____   soot ____', { marks: 4 }));
k.push(q('4', 'Two cities are famous for smog. Say how the smog formed in each.', { marks: 4 }));
k.push(ruled(3));
k.push(q('5', 'State two natural sources of air pollution.', { marks: 2 }));
k.push(ruled(1));

/* ---- SILVER ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('SILVER', 'How smog forms.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A power station burns 1,500 tonnes of coal a day. The coal is 3% sulfur by mass. How much sulfur does it burn each day?',
  '1,500 × 3 ÷ 100 = 45 tonnes of sulfur.',
]));
k.push(q('6', `Half-worked. A power station burns ${n(Z.coal.coal)} tonnes of coal a day. The coal is ${Z.coal.pct}% sulfur by mass. ${n(Z.coal.coal)} × ${Z.coal.pct} ÷ 100 = ______ tonnes of sulfur.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('7', 'Why does that step work? A student says: “Ozone is a pollutant, so I can measure it at the exhaust pipe.” Explain why ozone cannot be found there.', { marks: 2 }));
k.push(ruled(2));
k.push(q('8', 'Explain how ozone forms in photochemical smog. Use the words sunlight, nitrogen oxides and VOCs.', { marks: 3 }));
k.push(ruled(3));
k.push(q('9', 'Explain why smog is worst on a hot, still, sunny afternoon in a city full of traffic.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet air pollution outside the lesson? Describe one place or time in your own words, and name one pollutant you might breathe there.', { marks: 2 }));
k.push(ruled(2));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Smogs and traps.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Is the sulfur dioxide from a power station a primary or a secondary pollutant? How do you know?',
  'Primary. It leaves the chimney as sulfur dioxide. It is not made later in the air from anything else.',
]));
{
  const w1 = 2100, w2 = Math.floor((PAGE_W - w1) / 2);
  k.push(q('11', 'Half-worked. Complete the table. The first row is done for you.', { marks: 6 }));
  k.push(grid(['', 'London, 1952', 'Los Angeles'], [['what made the pollution', 'coal smoke and sulfur dioxide', ''], ['the weather', '', ''], ['the main harmful substance', '', ''], ['primary or secondary?', '', '']], [w1, w2, w2]));
}
k.push(WS.sp());
k.push(q('12', 'A student says: “The 1952 London smog was just fog.” Explain what is wrong with that.', { marks: 2 }));
k.push(ruled(2));
k.push(q('13', 'You put six traps (slides smeared with petroleum jelly) in six places. Trap F is sealed in a zip bag and never opened. (a) Which of A (beside the car park) and D (a windowsill) will collect more particles? Give a reason. (b) Why is trap F there?', { marks: 4 }));
k.push(ruled(4));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q12. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

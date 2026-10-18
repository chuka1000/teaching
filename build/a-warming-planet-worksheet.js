/**
 * Y9 Science, A Warming Planet, worksheet (the fallback when the game cannot run, and for absentees and early finishers). Per TEMPLATE.md, in each tier a fully
 * worked example, a half-worked one, then blanks, mixed on purpose, with a RAG grid, one "why does that step work?" prompt (Q7) and one "where would you meet
 * this outside the lesson?" (Q10). The graphs are the real NOAA and NASA data (build/media/a-warming-planet-graphs.py). Every number comes from
 * build/atmosphere.data.json through build/a-warming-planet-answers.js. Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./a-warming-planet-answers');
const { DATA } = A;
const Z = DATA.l4;
const WS = require('./atmosphere-sheet')({
  lesson: 'A Warming Planet', header: 'Atmosphere, Lesson 4', answers: A,
  banner: 'The greenhouse effect keeps Earth warm. We are making it stronger. It is a different problem from ozone depletion and air pollution.',
  criteria: ['I can explain the greenhouse effect.', 'I can describe the evidence that the climate is changing.', 'I can describe the impacts of global climate change.'],
});
const { p, runs, t, q, ruled, box, cell, table, image, C, PAGE_W, TableRow, VerticalAlign } = WS;
const { D } = WS.DP;
const { HeightRule } = D;
const HEAD = 'DCE9F1', GREY = 'E9F1F6';
const k = WS.begin();

function grid(headers, rows, widths, o = {}) {
  const hd = (x, w) => cell(p(x, { size: 10, bold: true, after: 0 }), { w, fill: HEAD });
  const body = rows.map((r) => new TableRow({ cantSplit: true, height: { value: o.h || 470, rule: HeightRule.ATLEAST }, children: r.map((x, i) => (
    i === 0 ? cell(p(x, { size: 10, bold: true, after: 0 }), { w: widths[i], valign: VerticalAlign.CENTER })
      : cell(p(x || '', { size: 9.5, italic: !!x, color: x ? C.soft : C.ink, after: 0 }), { w: widths[i], fill: x ? GREY : undefined, valign: VerticalAlign.CENTER }))) }));
  return table([new TableRow({ children: headers.map((h, i) => hd(h, widths[i])) }), ...body], widths);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The greenhouse effect and the evidence.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Name two greenhouse gases and one human source of each.',
  'Carbon dioxide, from burning fossil fuels. Methane, from cattle and rice fields.',
]));
k.push(q('1', `Half-worked. Without the greenhouse effect the Earth would average about ______ °C. With it, the average is about ______ °C.`, { marks: 2 }));
k.push(q('2', 'Name two greenhouse gases.', { marks: 2 }));
k.push(ruled(1));
k.push(q('3', 'Write T (true) or F (false). The greenhouse effect is bad for the Earth ___   More greenhouse gases make the effect stronger ___   The hole in the ozone layer causes climate change ___   Greenhouse gases absorb infrared radiation ___', { marks: 4 }));
k.push(q('4', 'Give two pieces of evidence that the climate is changing.', { marks: 2 }));
k.push(ruled(2));
k.push(q('5', 'Name two impacts of climate change.', { marks: 2 }));
k.push(ruled(2));

/* ---- SILVER ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('SILVER', 'Reading the graphs.'));
k.push(image('atm-keeling.png', 400, { keepNext: true }));
k.push(p('Carbon dioxide in the air at Mauna Loa, Hawaii, each month (NOAA).', { size: 9.5, italic: true, color: C.soft, align: WS.AlignmentType.CENTER, after: 60 }));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Read the graph. In 1959 the carbon dioxide level was about 316 ppm. In 2025 it was about 427 ppm. What is the rise?',
  '427 − 316 = 111 ppm.',
]));
k.push(q('6', `Half-worked. The rise was ${Z.ws.rise} ppm. ${Z.ws.rise} ÷ ${Z.ws.y1959} × 100 = ______ % (to the nearest whole number).`, { marks: 2 }));
k.push(q('7', 'Why does that step work? The line zigzags up and down each year as well as climbing. Explain the zigzag, and the climb.', { marks: 3 }));
k.push(ruled(3));
k.push(image('atm-temp.png', 400, { keepNext: true }));
k.push(p('Global temperature compared with the 1951 to 1980 average (NASA). Red bars are warmer, blue bars are cooler.', { size: 9.5, italic: true, color: C.soft, align: WS.AlignmentType.CENTER, after: 60 }));
k.push(q('8', 'Describe the trend in the temperature graph. Use years in your answer.', { marks: 3 }));
k.push(ruled(3));
k.push(q('9', 'Explain how greenhouse gases keep the Earth warm.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet this outside the lesson? Name one thing you or your family use that burns fossil fuels, and one way to use less of it.', { marks: 2 }));
k.push(ruled(2));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Ice, impacts and the three problems.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Which problem is sulfur dioxide from a power station: ozone depletion, climate change or air pollution?',
  'Air pollution. It is a gas near the ground that harms lungs and makes acid rain.',
]));
{
  const w1 = 4800, w2 = Math.floor((PAGE_W - w1) / 1);
  k.push(q('11', 'Half-worked. Write ozone depletion, climate change or air pollution for each. The first is done for you.', { marks: 5 }));
  k.push(grid(['Item', 'Which problem?'], [
    ['sulfur dioxide from a power station', 'air pollution'], ['methane from cattle', ''], ['CFCs from old fridges', ''], ['sea level rise', ''], ['smog on a hot, sunny day', ''], ['more ultraviolet light reaching Antarctica in spring', ''],
  ], [w1, w2], { h: 430 }));
}
k.push(WS.sp());
k.push(image('atm-icecore.png', 400, { keepNext: true }));
k.push(p('Carbon dioxide for the last 800,000 years, from air in Antarctic ice. The dashed line is today (NOAA).', { size: 9.5, italic: true, color: C.soft, align: WS.AlignmentType.CENTER, after: 60 }));
k.push(q('12', `The highest value in the ice-core record before industry was about ${Z.ws.ice_max} ppm. Today it is about ${Z.ws.y2025} ppm. Calculate how much higher today is.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('13', 'Explain why the Montreal Protocol worked for ozone, but climate change is harder. Give two reasons for each.', { marks: 4 }));
k.push(ruled(4));
k.push(q('14', 'A student says: “The hole in the ozone layer is causing climate change.” Use two differences from the table on the lesson slide (gas, where, harm) to explain what is wrong.', { marks: 3 }));
k.push(ruled(3));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q13. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

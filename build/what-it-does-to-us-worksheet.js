/**
 * Y9 Science, What It Does To Us, worksheet. Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on
 * purpose, with a RAG grid, one "why does that step work?" prompt (Q7) and one "where would you meet this outside the lesson?" (Q12).
 * The TRAP RESULTS TABLE (the six particulate traps, read this lesson) is shared by all three tiers. Every number comes from build/atmosphere.data.json
 * through build/what-it-does-to-us-answers.js. Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./what-it-does-to-us-answers');
const { DATA } = A;
const Z = DATA.l2;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./atmosphere-sheet')({
  lesson: 'What It Does To Us', header: 'Atmosphere, Lesson 2', answers: A,
  banner: 'Air pollution harms lungs, lakes, trees and buildings, but it can be reduced.',
  criteria: ['I can describe the effects of air pollution on human health.', 'I can explain how acid rain forms and what it damages.', 'I can describe three ways air pollution is reduced.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow, VerticalAlign } = WS;
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

/* ---- the trap results, shared by all three tiers ---- */
k.push(...box('THE SIX TRAPS. Read them at the trap station: by eye first, then under the microscope.', [
  'By eye: clean (C), a little dirty (L) or dirty (D). Under the microscope: count the specks in one field of view, three different fields, then work out the average.',
], { fill: 'FFF8E1' }));
{
  const w0 = 2500, w = Math.floor((PAGE_W - w0) / 6);
  k.push(grid(['Trap and place', 'By eye', 'Field 1', 'Field 2', 'Field 3', 'Average', 'Rank'], [
    ['A  beside the car park', '', '', '', '', '', ''], ['B  by the kitchen extractor', '', '', '', '', '', ''], ['C  inside a classroom', '', '', '', '', '', ''],
    ['D  outside on a windowsill', '', '', '', '', '', ''], ['E  a quiet corridor or the lab', '', '', '', '', '', ''], ['F  sealed in a bag (the control)', '', '', '', '', '', ''],
  ], [w0, w, w, w, w, w, w], { h: 400 }));
}
k.push(WS.sp());

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'Effects and traps.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'How does carbon monoxide harm the body?',
  'It sticks to haemoglobin in the blood in place of oxygen. The blood carries less oxygen, so the body gets less.',
]));
k.push(q('1', 'Half-worked. Particulates harm health because they are so small that they go deep into the ______________.', { marks: 1 }));
k.push(ruled(1));
k.push(q('2', 'Write one way that each of these harms health: particulates, carbon monoxide, ozone.', { marks: 3 }));
k.push(ruled(3));
k.push(q('3', 'Rank the six traps from dirtiest (1) to cleanest (6) in the table above.', { marks: 2 }));
k.push(q('4', 'Which trap collected the most particles? Suggest where they came from.', { marks: 2 }));
k.push(ruled(2));
k.push(q('5', 'Name two ways air pollution is reduced.', { marks: 2 }));
k.push(ruled(2));

/* ---- SILVER ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('SILVER', 'How acid rain forms.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A lake has 600 fish. Acid rain kills 25% of them. How many are left?',
  '600 × 25 ÷ 100 = 150 die. 600 − 150 = 450 fish left.',
]));
k.push(q('6', `Half-worked. A lake has ${Z.ws_fish.fish} fish. Acid rain kills ${Z.ws_fish.pct}% of them. ${Z.ws_fish.fish} × ${Z.ws_fish.pct} ÷ 100 = ______ die. ${Z.ws_fish.fish} − ______ = ______ fish left.`, { marks: 2 }));
k.push(q('7', 'Why does that step work? A student writes: “Acid rain is caused by carbon dioxide from car exhausts.” Explain what is wrong, and say which gases cause it.', { marks: 3 }));
k.push(ruled(3));
k.push(q('8', 'Put the acid rain steps in order. Write 1 to 5. ____ the gases dissolve in cloud water   ____ acid rain falls   ____ coal containing sulfur is burned   ____ sulfuric acid forms   ____ sulfur dioxide is released', { marks: 5 }));
k.push(q('9', 'Explain why acid rain damages a marble statue. Then say what you would see.', { marks: 2 }));
k.push(ruled(2));
k.push(q('10', 'Explain why a taller chimney does not solve the acid rain problem.', { marks: 2 }));
k.push(ruled(2));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Cause, effect and fix.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Particulates from diesel exhausts. Harm? Fix?',
  'Harm: they go deep into the lungs and cause asthma and heart disease. Fix: filters on the exhaust, and cleaner fuels.',
]));
{
  const w1 = 2300, w2 = Math.floor((PAGE_W - w1) / 3);
  k.push(q('11', 'Half-worked. Complete the table. The first row is done for you.', { marks: 6 }));
  k.push(grid(['Pollutant', 'Where it comes from', 'Harm', 'One fix'], [
    ['carbon monoxide', 'burning with too little oxygen', 'it takes the place of oxygen in the blood', 'catalytic converter'],
    ['sulfur dioxide', '', '', ''],
    ['nitrogen oxides', '', '', ''],
  ], [w1, w2, w2, w2], { h: 560 }));
}
k.push(WS.sp());
k.push(q('12', 'Where would you meet this outside the lesson? Describe one real place or time where you or your family are near air pollution, and say what you could do or ask for to cut it.', { marks: 3 }));
k.push(ruled(3));
k.push(q('13', 'The Clean Air Act 1956 was passed four years after the Great Smog. Explain why a law can work better than asking people to pollute less.', { marks: 3 }));
k.push(ruled(3));

k.push(q('14', `Fine particles. In 2025 the average PM2.5 in Delhi was ${Z.pm.delhi} µg/m³ (IQAir). The WHO guideline is ${Z.pm.who} µg/m³. Example: 40 ÷ 5 = 8 times. Calculate how many times higher Delhi was. Then do the same for the UK’s city average, ${Z.pm.uk} µg/m³ (Defra).`, { marks: 3 }));
k.push(ruled(2));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q7 and Q13. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

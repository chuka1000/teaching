/**
 * Y9 Science, Finite Freshwater, worksheet (9G and 9I). The You Do. Per TEMPLATE.md, in each tier a fully worked example, a half-worked
 * one, then blank, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you
 * meet this outside the lesson?" (Q12). The numbers come from build/finite-freshwater-answers.js, so the sheet, the animation and the
 * answers cannot disagree. Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('catchment');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, TableRow, AlignmentType, Header, Footer, PageNumber, TextRun, PageBreak } = D;
const A = require('./finite-freshwater-answers');
const { D: N, R, USES, FOOT, PERCAP, MONSOON } = A;

const LESSON = 'Finite Freshwater';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const n = (x) => x.toLocaleString('en-GB');
const head = (right) => new Header({ children: [runs([t('Y9 Science  ·  Water  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'E3F1F8' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Fresh water is renewable but finite, and a shortage is about where and when as well as how much.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'DFF3FB' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can describe what we use freshwater for.', 'I can explain how groundwater can be used up even though it is renewable.', 'I can explain why water shortage is about where and when, not just how much.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. Show your working and give the unit.', { size: 10.5 })], { before: 160, after: 100 }));

  const W2 = [3900, PAGE_W - 3900];
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const row = (a, b) => new TableRow({ children: [cell(p(a, { size: 9.5, after: 0 }), { w: W2[0] }), cell(p(b, { size: 9.5, after: 0 }), { w: W2[1] })] });
  k.push(p('DATA 1: what people use fresh water for, and how much water is behind some things (FAO AQUASTAT; Water Footprint Network)', { size: 10, bold: true, color: C.dark, after: 40 }));
  k.push(table([new TableRow({ children: [hdr('Use', W2[0]), hdr('Share of the fresh water people take', W2[1])] }),
    row('Agriculture (farming: irrigation, livestock)', `about ${USES.agri}%`), row('Industry (power stations, factories)', `about ${USES.industry}%`), row('Homes (drinking, washing, toilets)', `about ${USES.homes}%`),
    row('Water used to make one hamburger', `about ${n(FOOT.burger)} litres`), row('Water used to make one cotton T-shirt', `about ${n(FOOT.shirt)} litres`),
  ], W2));
  k.push(p('', { after: 60 }));
  k.push(p('DATA 2: fresh water per person per year, in cubic metres (FAO and World Bank, 2020, rounded)', { size: 10, bold: true, color: C.dark, after: 40 }));
  const entries = Object.entries(PERCAP), half = Math.ceil(entries.length / 2), W4 = [1900, 1400, 1900, PAGE_W - 5200];
  const r2 = (i) => { const a = entries[i], b = entries[i + half]; return new TableRow({ children: [cell(p(a[0], { size: 9.5, after: 0 }), { w: W4[0] }), cell(p(n(a[1]), { size: 9.5, after: 0 }), { w: W4[1] }), cell(p(b ? b[0] : '', { size: 9.5, after: 0 }), { w: W4[2] }), cell(p(b ? n(b[1]) : '', { size: 9.5, after: 0 }), { w: W4[3] })] }); };
  k.push(table(Array.from({ length: half }, (_, i) => r2(i)), W4));
  k.push(p('', { after: 40 }));
  k.push(p(`DATA 3: in India, about ${MONSOON.share}% of the year’s rain falls in the ${MONSOON.months} months of the monsoon (June to September).`, { size: 10, bold: true, color: C.dark, after: 60 }));

  /* ---- BRONZE ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('BRONZE'));
  k.push(p('What we use fresh water for.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`Of every ${n(N.w.litres)} litres of fresh water people take, how many go to each use?`, `Agriculture: ${n(N.w.litres)} × ${USES.agri} ÷ 100 = ${n(R.w.agri)} L.   Industry: ${n(N.w.litres)} × ${USES.industry} ÷ 100 = ${n(R.w.industry)} L.   Homes: ${n(N.w.litres)} × ${USES.homes} ÷ 100 = ${n(R.w.homes)} L.`]));
  k.push(q('1', 'Half-worked. Sort each into AGRICULTURE, INDUSTRY or HOMES.  (a) irrigating a wheat field: AGRICULTURE (done for you)  (b) cooling a power station: ________  (c) washing clothes at home: ________  (d) giving drinks to cattle: ________  (e) making paper in a factory: ________', { marks: 4 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State the three main uses of fresh water. Say which uses the most.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', `Calculate how many of every ${n(N.q3.total)} litres of fresh water that people take go to agriculture.`, { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', `A hamburger takes about ${n(FOOT.burger)} litres of water to make. A bucket holds ${N.q4.bucket} litres. Calculate how many buckets that is.`, { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', `A cotton T-shirt takes about ${n(FOOT.shirt)} litres of water to make, but there is no water in it when you buy it. Explain where the water was used.`, { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- SILVER ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('SILVER'));
  k.push(p('Groundwater: renewable, but not unlimited.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A model aquifer holds ${n(N.sw.stock)} billion litres. Rain adds ${N.sw.recharge} billion litres a year (recharge). Wells take out ${N.sw.pump} billion litres a year.`, `Net loss: ${N.sw.pump} − ${N.sw.recharge} = ${R.swNet} billion litres a year. Time to empty: ${n(N.sw.stock)} ÷ ${R.swNet} = ${R.swEmpty} years.`]));
  k.push(q('6', `Half-worked. A model aquifer holds ${n(N.q6.stock)} billion litres. Recharge is ${N.q6.recharge} a year and wells take out ${N.q6.pump} a year. Net loss: ${N.q6.pump} − ${N.q6.recharge} = ____ a year. Time to empty: ${N.q6.stock} ÷ ____ = ____ years.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('7', `The pumping in Q6 stops, and the aquifer is empty. Rain keeps adding ${N.q6.recharge} billion litres a year. Calculate how long it takes to refill. Compare it with your answer to Q6 and say what this shows.`, { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('8', 'Why does that step work? In the worked example the net loss is 50 − 10, not 50. Why do we take the recharge away from the pumping?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'The water table falls because wells take out more than the rain adds. Describe two problems this causes.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Where and when. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`How many times more fresh water per person does ${N.gw.a} have than ${N.gw.b}?`, `${n(PERCAP[N.gw.a])} ÷ ${PERCAP[N.gw.b]} = ${(PERCAP[N.gw.a] / PERCAP[N.gw.b]).toFixed(0)}. ${N.gw.a} has over 1,000 times more. The world has plenty of fresh water; it is not shared out evenly.`]));
  k.push(q('10', `Half-worked. How many times more fresh water per person does ${N.q10.a} have than ${N.q10.b}? ${n(PERCAP[N.q10.a])} ÷ ____ = ____ , so about ____ times as much.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('11', `In India about ${MONSOON.share}% of the year’s rain falls in the ${MONSOON.months} months of the monsoon. Calculate the average share of the year’s rain that falls each month during the monsoon, and each month in the other eight months. How many times bigger is the first?`, { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Describe a real place or time of year where people are short of water even though water exists somewhere. Say where the water is, when it falls, and why people cannot use it.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('13', 'A city builds a reservoir to store the rain that falls in the wet months. Explain how this helps in the dry months, and what could still go wrong.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('14', 'Explain why a water shortage is about where and when, not just how much. Use an example in your answer.', { marks: 4 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q13 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E3F1F8' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./finite-freshwater-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

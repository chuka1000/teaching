/**
 * Y9 Science, How Much Water Can We Actually Use, worksheet (9G and 9I). The You Do. Per TEMPLATE.md, in each
 * tier a fully worked example, a half-worked one, then blank, mixed on purpose (interleaved), with a RAG grid,
 * one "why does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q13).
 * The answers are printed UPSIDE DOWN on the last page (there is no Answers slide) and come from
 * build/how-much-water-can-we-actually-use-answers.js, the same constants the worked examples here read.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('catchment');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, ragGrid, q, boxed, blankBox } = DP;
const { Document, Packer, Paragraph, TableRow, AlignmentType, Header, Footer, PageNumber, TextRun } = D;
const { CONST: K } = require('./how-much-water-can-we-actually-use-answers');

const LESSON = 'How Much Water Can We Actually Use';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const n = (x) => x.toLocaleString('en-GB');

const head = (right) => new Header({ children: [runs([t('Y9 Science  ·  Water  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'EAF4FA' });
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 160 }));
  k.push(boxed(p('Only a tiny fraction of Earth’s water is fresh and easy to reach, and the water cycle refills it.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'DCEBF4' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can name the sources of freshwater.', 'I can explain why only a small fraction of Earth’s water is usable.', 'I can describe how the water cycle returns freshwater.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour.', { size: 10.5 })], { before: 160, after: 100 }));

  const W2 = [3300, PAGE_W - 3300];
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const row = (a, b) => new TableRow({ children: [cell(p(a, { size: 9.5, after: 0 }), { w: W2[0] }), cell(p(b, { size: 9.5, after: 0 }), { w: W2[1] })] });
  k.push(p('DATA: all the water on Earth (USGS)', { size: 10, bold: true, color: C.dark, after: 40 }));
  k.push(table([new TableRow({ children: [hdr('Water', W2[0]), hdr('Share', W2[1])] }),
    row('Salt water', 'about 97.5% of all the water'),
    row('Fresh water', 'about 2.5% of all the water'),
    row('Of the fresh water: ice caps and glaciers', 'about 70% of the fresh water'),
    row('Of the fresh water: groundwater', 'about 30% of the fresh water'),
    row('Of the fresh water: lakes, rivers and swamps', 'about 0.3% of the fresh water'),
  ], W2));
  const W3 = [3300, PAGE_W - 3300];
  k.push(p('', { after: 60 }));
  k.push(p('DATA: how long water stays, on average', { size: 10, bold: true, color: C.dark, after: 40 }));
  k.push(table([new TableRow({ children: [hdr('Where the water is', W3[0]), hdr('Average time it stays', W3[1])] }),
    row('The air', '9 days'), row('Rivers', '2 to 6 months'), row('Lakes', '50 to 100 years'),
    row('Shallow groundwater', '100 to 200 years'), row('Deep groundwater', 'about 10,000 years'),
  ], W3));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Sources of fresh water, and a share of a volume.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: fresh water in a model. Read it; do not solve it.', [`A model uses ${n(K.W.all)} mL for all the water on Earth. About ${K.FRESH_SHARE}% of it is fresh water.`, `${n(K.W.all)} × ${K.FRESH_SHARE} ÷ 100 = ${n(K.W.all * K.FRESH_SHARE)} ÷ 100 = ${K.W.fresh} mL of fresh water.`, 'The unit goes on the answer: mL.']));
  k.push(p('', { after: 60 }));
  k.push(q('1', `Half-worked. A model uses ${n(K.B1.all)} mL for all the water on Earth. Calculate the fresh water. ${n(K.B1.all)} × ${K.FRESH_SHARE} ÷ 100 = ______ ÷ 100 = ______ mL.`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Half-worked. Sort each into ICE, GROUNDWATER or SURFACE WATER.  (a) The Greenland ice sheet: ICE (done for you).  (b) A well.  (c) A river.  (d) A glacier in the Alps.  (e) Lake Victoria.', { marks: 4 }));
  k.push(ruledBox(2));
  k.push(q('3', `A model uses ${n(K.B3.all)} mL for all the water on Earth. Calculate the volume of fresh water.`, { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'State why people cannot drink sea water or use it to water most crops.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'Name the three main places fresh water is found, and say which one holds the most.', { marks: 3 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Why so little is usable.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: the pours. Read it; do not solve it.', [`Of the ${K.SW.fresh} mL of fresh water in the litre, about ${K.ICE_SHARE}% is ice: ${K.SW.fresh} × ${K.ICE_SHARE} ÷ 100 = ${K.SW.ice} mL.`, `That leaves ${K.SW.fresh} − ${K.SW.ice} = ${K.SW.rest} mL that is not ice (mostly groundwater).`]));
  k.push(p('', { after: 60 }));
  k.push(q('6', `Half-worked. A 4,000 mL model has ${K.S6.fresh} mL of fresh water. About ${K.GROUND_SHARE}% of the fresh water is groundwater. ${K.S6.fresh} × ${K.GROUND_SHARE} ÷ 100 = ______ mL.`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('7', `In the same model, lakes, rivers and swamps hold ${K.SURFACE_SHARE}% of the fresh water. Calculate the volume, in mL.`, { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('8', `Why does the working use ${K.ICE_SHARE}% of the ${K.SW.fresh} mL of fresh water, and NOT ${K.ICE_SHARE}% of the whole 1,000 mL litre?`, { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Explain why the ice caps hold most of the fresh water but cannot supply most cities.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('10', 'Deep groundwater is fresh and liquid. Explain why it is still not an easy source to rely on.', { marks: 3 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('The water cycle, rates, and the two jars.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: snow to river. Read it; do not solve it.', ['Snow falls on a mountain (precipitation). It builds up as ice in a glacier. In summer some of the ice melts. The meltwater flows into a river and refills it.', 'The ice lane is slow: glaciers hold water for 20 to 100 years or more. The river lane is fast: months.']));
  k.push(p('', { after: 60 }));
  k.push(q('11', 'Half-worked. Rain falls on a hill. Some of it runs over the ground into a river (runoff). Finish: the rest soaks into the ground, which is called ______________ , and becomes ______________ . Which refills faster, the river or deep groundwater? Use the data table.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('12', `A lake holds ${K.LAKE.holds} million litres. A town takes ${K.LAKE.take} million litres a year from it. Rain and rivers add ${K.LAKE.add} million litres a year. (a) Is this sustainable? (b) Calculate how many years until the lake is empty, if nothing changes.`, { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('13', 'Where would you meet this idea outside the lesson? Say where you, or your family, get fresh water, which source it is (ice, groundwater or surface water), and one thing that could make it run short. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('14', 'The two jars on the windowsill both hold pond water. Jar 2 has a pinch of fertiliser added; Jar 1 has nothing. (a) Predict what you will see in each after two weeks, and why. (b) Name the ONE thing that is different between the jars.', { marks: 4 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q12 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'DCEBF4' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./how-much-water-can-we-actually-use-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

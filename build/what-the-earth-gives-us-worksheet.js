/**
 * Y9 Science, What The Earth Gives Us, worksheet. Same worksheet for 9G and 9I (taught
 * identically). The fallback for the game. Answers UPSIDE DOWN on the last page (no Answers
 * slide). Q1-4 Bronze (definition, sorting), Q5-7 Silver (classifying, one calculation),
 * Q8-10 Gold (the rate idea, a sustainable-yield calculation, judging a claim).
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed, table, cell } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TableRow } = D;

const LESSON = 'What The Earth Gives Us';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y9 Science  ·  What The Earth Gives Us  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** Bronze Q3: eight items to sort, a blank table for the answer. */
function sortTable() {
  const w1 = 3200, w2 = 2600;
  const items = ['Sunlight', 'Wind', 'Coal', 'Oil', 'Wave energy', 'Metal ore', 'A well-managed forest', 'Natural gas'];
  const head_ = new TableRow({ children: [cell(p('Resource', { size: 10.5, bold: true, after: 0 }), { w: w1, fill: 'F2EBDD' }), cell(p('Renewable or non-renewable?', { size: 10.5, bold: true, after: 0, align: AlignmentType.CENTER }), { w: w2, fill: 'F2EBDD' })] });
  const rows = items.map((n) => new TableRow({ children: [cell(p(n, { size: 10.5, after: 0 }), { w: w1 }), cell(p('', { after: 0 }), { w: w2 })] }));
  return table([head_, ...rows], [w1, w2]);
}
/** Silver Q7: an aquifer's recharge and pumping rates. */
function aquiferTable() {
  const w1 = 3400, w2 = 2400;
  const row = (a, b, bold) => new TableRow({ children: [cell(p(a, { size: 10.5, bold, after: 0 }), { w: w1, fill: bold ? 'F2EBDD' : undefined }), cell(p(b, { size: 10.5, bold, after: 0, align: AlignmentType.CENTER }), { w: w2, fill: bold ? 'F2EBDD' : undefined })] });
  return table([row('', 'Million litres a year', true), row('Recharges (refills)', '20,000'), row('Pumped out', '55,000')], [w1, w2]);
}

function worksheet(answers) {
  const k = [];
  k.push(h1('What The Earth Gives Us'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Renewable or not is not about the resource. It is about the rate.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F2EBDD' }));
  k.push(runs([t('Natural resources: ', { bold: true, size: 10.5 }), t('what counts as one, and whether it is renewable. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(q('1', 'State what a natural resource is.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'A student says: "Coal is not a natural resource, because people have to mine it before we can use it." Explain the mistake.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Sort each resource into renewable or non-renewable.', { marks: 2 }));
  k.push(sortTable());
  k.push(p('', { after: 100 }));
  k.push(q('4', 'A student says: "Wood is non-renewable, because once a tree is cut down, it is gone." Explain the mistake.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(q('5', 'Classify solar energy as renewable or non-renewable, and explain why.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Classify oil as renewable or non-renewable, and explain why.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'The table shows an aquifer\'s recharge and pumping rates. Calculate how many more million litres are pumped than recharge each year. Explain why this aquifer is non-renewable in practice, even though rain does refill it. Show your working.', { marks: 3 }));
  k.push(aquiferTable());
  k.push(p('', { after: 60 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(q('8', 'Explain why a forest can be renewable in one place and non-renewable in another.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'A fish stock of 40,000 tonnes grows by 5% a year. Calculate the largest catch, in tonnes, that keeps the stock the same size next year. Show your working.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A farmer says: "Our fishery cannot be a problem. Fish are a renewable resource." Judge this claim, and explain what actually decides whether the fishery is renewable.', { marks: 3 }));
  k.push(ruledBox(5));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check your Q10 answer against the idea that renewable depends on rate, not category. Do not ask it to write the answer for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2EBDD' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./what-the-earth-gives-us-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

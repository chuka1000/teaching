/**
 * Y8 Science — Natural Selection worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Bronze stays
 * with the giraffe example taught in class; Silver and Gold switch to
 * camouflage beetles, so students apply the V-C-S-I framework rather than
 * recall it.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'Natural Selection';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y8 Science  ·  Natural Selection  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Natural Selection'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('Variation, competition, survival, inheritance. Nothing changes on purpose.', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'F3E7CE' }));

  k.push(runs([
    t('Chance, not need. ', { bold: true, size: 10.5 }),
    t('A variation exists before it is useful. Survival happens because of it, never the other way round. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Label it, for the giraffe.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Name the variation in the giraffe example.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Name the competition in the giraffe example.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Name the survival advantage in the giraffe example.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Name what is inherited in the giraffe example.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Apply it, to camouflage beetles.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(p('Some beetles are green. Some are brown. Birds find brown beetles more easily on green leaves.', {
    size: 10, italic: true, color: C.soft, after: 100,
  }));

  k.push(q('5', 'Name the variation in this example.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('6', 'Explain why green beetles are more likely to survive on green leaves.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Explain what happens to the population of beetles over many generations.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Correct it, and explain why.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('8', 'Explain why it is wrong to say "the beetles changed colour because they needed to hide".', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Explain why evolution happens to a population, not to one beetle.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Choose your own animal or plant. Describe its variation, competition, survival advantage, and what is inherited.', { marks: 4 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q8 or Q9 answer uses chance and advantage language rather than need or purpose. Do not ask it to write Q10 for you. Choosing your own example and applying the framework yourself is the point.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'EFE9D6' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

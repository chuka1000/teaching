/**
 * Y8 Science — How Darwin Got There, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. For 8I.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'How Darwin Got There';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y8 Science  ·  How Darwin Got There  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('How Darwin Got There'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('The voyage, Lyell, Malthus, artificial selection, Wallace. A good idea rarely arrives alone.', {
    size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'F3E7CE' }));

  k.push(runs([
    t('Not a single moment. ', { bold: true, size: 10.5 }),
    t('Darwin\'s theory took about 20 years, and several other people\'s ideas, to come together. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Match it, to the influence.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Name the geologist who showed Darwin the Earth was far older than people thought.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Name the economist whose ideas gave Darwin the idea of a "struggle for existence".', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Name the ship Darwin sailed on, and roughly how long the voyage lasted.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State who actually identified Darwin\'s finches as related species, and when.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Explain it, using the model.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('5', 'Explain what artificial selection is, using an example.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Explain how artificial selection gave Darwin a model for natural selection.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Explain why Lyell\'s ideas about geology mattered for Darwin\'s theory.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Describe it, and correct the legend.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('8', 'Describe the part Alfred Russel Wallace played in the story of natural selection.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Explain why "Darwin figured it all out by studying finch beaks in the Galapagos" is not quite right.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Explain why Darwin\'s theory is described as coming together over many years, from many influences, rather than from one single moment.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q9 answer actually explains what went wrong with the finches story, not just that it is wrong. Do not ask it to write Q10 for you. Explaining the shape of the whole story yourself is the point.', {
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

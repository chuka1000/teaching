/**
 * Y9 Science — What The Land Gives Us, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Same worksheet
 * for 9G and 9I. Bronze and Silver are deliberately short; Gold is where
 * objective 3 earns the lesson, per the brief.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'What The Land Gives Us';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y9 Science  ·  What The Land Gives Us  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('What The Land Gives Us'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('Formation takes centuries. Loss can take years. That gap is the whole answer.', {
    size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'ECE1CB' }));

  k.push(runs([
    t('Not just dirt. ', { bold: true, size: 10.5 }),
    t('Soil is rock, dead organic matter, water, air and living things, and it takes far longer to form than to lose. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Identify it, quickly.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Name three main land resources, other than food.', { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Name one land resource that takes millions of years to form.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Name the four things soil is made of.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State why food chains on land usually start in soil.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Explain it, in your own words.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('5', 'Explain why soil is not the same thing as just "dirt" or crushed rock.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Explain roughly how long it takes to form a few centimetres of fertile soil.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('7', 'Explain how soil can be lost much faster than it forms.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Judge it. This is the one that earns the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('8', 'Explain why soil counts as a non-renewable resource on a human timescale, even though it does eventually reform.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'A farmer says: "Soil eventually reforms, so it does not matter how much we lose to erosion now." Judge this claim.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Explain why treating soil the way we treat food, something we can simply grow more of quickly, is a mistake.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q9 answer actually engages with the farmer\'s claim, not just restates the definition of non-renewable. Do not ask it to write the judgement for you. Weighing the claim yourself is the point.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'ECE1CB' }));

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

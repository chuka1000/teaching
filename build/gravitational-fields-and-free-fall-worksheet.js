/**
 * Y10 Science — Gravitational Fields and Free Fall worksheet.
 * One worksheet for the whole double: Bronze + Silver in Period 2,
 * Gold in Period 3. Questions 1-10 match the two Answers slides exactly,
 * in order (Q1-6 on the Period 2 Answers slide, Q7-10 on Period 3's).
 * Every numeric answer checked with sympy before it went into either file.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'Gravitational Fields and Free Fall';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y10 Physics  ·  Gravitational Fields and Free Fall  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Gravitational Fields and Free Fall'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('W = mg          g ≈ 9.8 N/kg = 9.8 m/s²          ignore air resistance', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FFEFE2' }));

  k.push(runs([
    t('One worksheet, two periods. ', { bold: true, size: 10.5 }),
    t('Bronze and Silver this morning. Gold this afternoon, after the break. Units every time — kg for mass, N for weight. g ≈ 9.8, never 10.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE (Period 2) ---- */
  k.push(tier('BRONZE'));
  k.push(p('Substitute — use W = mg.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'A 0.5 kg mass. Find its weight.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'A 12 kg mass. Find its weight.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Complete: mass is measured in ___. Weight is measured in ___.', { marks: 2 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER (Period 2) ---- */
  k.push(tier('SILVER'));
  k.push(p('Rearrange — find the mass when W is given.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('4', 'A weight of 19.6 N. Find the mass.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'A weight of 88.2 N. Find the mass.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Explain why g does not get bigger for a bigger mass.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD (Period 3) ---- */
  k.push(tier('GOLD'));
  k.push(p('Free fall and the unit proof — this afternoon.', { size: 10, italic: true, color: C.alert, after: 60 }));

  k.push(q('7', 'A ball is dropped from rest and falls for 3 s. Ignore air resistance. Find its speed.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('8', 'The same ball. Find how far it has fallen in that time.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Show that N/kg and m/s² are the same unit. Start from F = ma.', { marks: 3 }));
  k.push(ruledBox(4));
  k.push(q('10', 'Explain why g does not depend on the mass of the object in the field.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check your working for Q7 or Q8, or to explain any step of the Q9 proof you are stuck on. Do not ask it to write Q10 for you — explaining it yourself is the point.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E4E8F2' }));

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

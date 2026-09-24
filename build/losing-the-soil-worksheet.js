/**
 * Y9 Science — Losing The Soil, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Same worksheet for
 * 9G and 9I. The erosion-trays results table sits between Bronze and Silver
 * because Silver Q5 and Q6 are answered from it. Q4 and Q9 carry the soil and
 * coal timescales the class found hard.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Losing The Soil';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y9 Science  ·  Losing The Soil  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** The erosion trays results table: colour of runoff and soil in the pot. */
function resultsTable() {
  const w1 = 2600, w2 = Math.floor((PAGE_W - w1) / 2);
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const rowFor = (name) => new TableRow({
    height: { value: 700, rule: HeightRule.ATLEAST },
    children: [
      cell(p(name, { bold: true, size: 10.5, after: 0, color: C.dark }), { w: w1 }),
      cell(p('', { after: 0 }), { w: w2 }),
      cell(p('', { after: 0 }), { w: w2 }),
    ],
  });
  return table([
    new TableRow({ children: [hdr('Tray', w1), hdr('Colour of the runoff', w2), hdr('Soil in the catch pot', w2)] }),
    rowFor('A   Bare soil'),
    rowFor('B   Grass cover'),
  ], [w1, w2, w2]);
}

function worksheet() {
  const k = [];
  k.push(h1('Losing The Soil'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('Centuries to make. Years to lose.', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'ECE1CB' }));

  k.push(runs([
    t('Cover protects soil. ', { bold: true, size: 10.5 }),
    t('Soil takes a few hundred to about a thousand years to form a few centimetres. Coal takes millions of years. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Describe it, quickly.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Describe what erosion is.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Name two things that cause erosion.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Describe what desertification is.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'State roughly how long a few centimetres of soil take to form, and how long coal takes.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Explain it. Fill in your tray results first.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(resultsTable());
  k.push(p('', { after: 100 }));
  k.push(q('5', 'State which tray lost more soil, and how you know.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Explain why the covered tray lost less soil.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Explain one way ploughing can cause erosion.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Judge it. Use your tray results and the two timescales.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'Explain how farming can cause both erosion and desertification.', { marks: 3 }));
  k.push(ruledBox(4));
  k.push(q('9', 'A farmer loses soil to erosion in a few years. Explain why this matters, using how long soil takes to form.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Someone says: "Our trays were only a small model, so they tell us nothing about real farms." Judge this claim.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q10 answer says what was fair about the trays and what was limited. Do not ask it to judge the claim for you. Weighing it yourself is the point.', {
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

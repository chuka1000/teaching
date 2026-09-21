/**
 * Y10 Science — Mass and Weight worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Every numeric
 * answer checked with sympy before it went into either file — see the
 * build/mass-and-weight.js header for the check.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, blankBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber } = D;

const LESSON = 'Mass and Weight';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y10 Physics  ·  Mass and Weight  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** The mass/weight data table for the Gold plot. */
function dataTable() {
  const cols = ['mass / kg', '0.1', '0.2', '0.3', '0.4', '0.5'];
  const wLabel = 2400, wCell = Math.floor((PAGE_W - wLabel) / 5);
  const massRow = ['mass / kg', '0.1', '0.2', '0.3', '0.4', '0.5'];
  const weightRow = ['weight / N', '0.98', '1.96', '2.94', '3.92', '4.9'];
  const row = (cells, header) => new TableRow({
    children: cells.map((c, i) => cell(
      p(c, { bold: header || i === 0, size: 10, after: 0, align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER, color: C.dark }),
      { w: i === 0 ? wLabel : wCell, fill: i === 0 ? C.headFill : undefined })),
  });
  return table([row(massRow, false), row(weightRow, false)], [wLabel, wCell, wCell, wCell, wCell, wCell]);
}

function worksheet() {
  const k = [];
  k.push(h1('Mass and Weight'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('g ≈ 9.8 N/kg          W = mg          g = W ÷ m', {
    size: 16, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FFEFE2' }));

  k.push(runs([
    t('Units every time. ', { bold: true, size: 10.5 }),
    t('kg for mass, N for weight. g ≈ 9.8 N/kg — never 10. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Substitute — use W = mg.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'A 0.5 kg mass. Find its weight.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'An 8 kg mass. Find its weight.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Complete: mass is measured in ___. Weight is measured in ___.', { marks: 2 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Rearrange — find m or g when W is given.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('4', 'A weight of 19.6 N. Find the mass.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'A weight of 4.9 N. Find the mass.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'A newtonmeter reads 14.7 N for a 1.5 kg mass. Use this to find g.', { marks: 3 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Plot it — the data below is from the demo.', { size: 10, italic: true, color: C.alert, after: 60 }));

  k.push(q('7', 'Plot mass (x-axis) against weight (y-axis) using the data below. Draw a line of best fit through the origin, then use its gradient to find g.', { marks: 4 }));
  k.push(dataTable());
  k.push(p('', { after: 100 }));
  k.push(blankBox(3200));

  k.push(q('8', 'Explain why the graph is a straight line through the origin.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Explain why your mass would stay the same on the Moon, but your weight would not.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A 0.4 kg mass. Predict its weight, then check your prediction against your graph.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check your gradient calculation from Q7, or to explain why the line should pass through the origin. Do not ask it for the value of g — finding it yourself is the point.', {
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

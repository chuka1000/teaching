/**
 * Y7 Science, Measuring Properly, printed sheet (7B).
 * The five circuit results tables come first, then Q1-10. Questions 1-10
 * match the Answers slide exactly, in order. Q6 uses the Station 4 table
 * (the marked mass is the true value). Q4 and Q7 are conversions.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Measuring Properly';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can choose the right instrument for a measurement.',
  'I can explain what accuracy means.',
  'I can convert between Celsius and kelvin.',
];

const head = (right) => new Header({ children: [runs([
  t('Y7 Science  ·  Measuring Properly  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

const stationHead = (n, name, tip) => runs([
  t(`Station ${n}  `, { bold: true, size: 11, color: C.accent }),
  t(name, { bold: true, size: 11, color: C.dark }),
  t(`   ${tip}`, { size: 9, italic: true, color: C.soft }),
], { before: 140, after: 50, keepNext: true });

/** A results table: header labels, first-column row labels, the rest blank. */
function grid(headers, rowLabels, widths, o = {}) {
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const rows = [new TableRow({ children: headers.map((h, i) => hdr(h, widths[i])) })];
  rowLabels.forEach((lab) => rows.push(new TableRow({
    height: { value: o.h || 460, rule: HeightRule.ATLEAST },
    cantSplit: true,
    children: widths.map((w, i) => cell(i === 0 ? p(lab, { bold: true, size: 10, after: 0, color: C.dark }) : p('', { after: 0 }), { w })),
  })));
  return table(rows, widths);
}
const W3 = (a) => [a, Math.floor((PAGE_W - a) / 2), PAGE_W - a - Math.floor((PAGE_W - a) / 2)];

function worksheet() {
  const k = [];
  k.push(h1('Measuring Properly'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 140 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 80 }));
  k.push(ragGrid(SUCCESS));

  k.push(runs([t('The circuit. ', { bold: true, size: 11 }), t('Fill in each table at its station. Eye level, zero it, wait for the reading.', { size: 10.5 })], { before: 180, after: 40 }));

  k.push(stationHead(1, 'Ruler', 'To the nearest mm.'));
  k.push(grid(['Object', 'Length (cm)', 'Length (mm)'], ['Pencil', 'Book', 'Beaker'], W3(3000)));

  k.push(stationHead(2, 'Measuring cylinder', 'Measure 8 mL in each.'));
  k.push(grid(['Cylinder', 'Smallest division (mL)', 'Volume you read (mL)'], ['10 mL', '100 mL'], W3(3000)));

  k.push(stationHead(3, 'Thermometer', 'Wait until it settles. Then convert.'));
  k.push(grid(['Sample', 'Temperature (°C)', 'Temperature (K)'], ['Cold water', 'Room', 'Warm water'], W3(3000)));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  k.push(stationHead(4, 'Balance', 'Zero it first.'));
  k.push(grid(['Object', 'Mass (g)', 'Label on the mass (g)'], ['Coin', 'Pebble', 'Marked mass'], W3(3000)));

  k.push(stationHead(5, 'Stopwatch', 'Time 10 swings each time.'));
  k.push(grid(['Try', 'Time for 10 swings (s)'], ['1', '2', '3', 'Average'], [3000, PAGE_W - 3000]));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Choose it.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Name the best instrument, and its unit, for: (a) the length of a pencil, (b) 8 mL of water, (c) the time for a 100 m run.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('2', 'State where your eye should be, and which part of the water you read, on a measuring cylinder.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'State what accuracy means.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Convert 20 °C to kelvin.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Use it. Use your circuit tables.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Explain why a 10 mL cylinder gives a more accurate reading than a 100 mL cylinder for 8 mL of water.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Look at the marked mass in Station 4. State the label and your reading, then say whether your balance was accurate.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Convert: (a) 0 °C to kelvin, (b) 100 °C to kelvin, (c) 300 K to °C.', { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Explain it.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'The true boiling point of water is 100 °C. Student A reads 96, 96 and 97 °C. Student B reads 99, 101 and 100 °C. Explain whose readings are more accurate.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'A student writes "It was −20 K in the freezer." Explain why this cannot be right.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('10', 'In Burning Food the class measured mass, volume and temperature. Name the instrument for each, and give one way to read it properly.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 60 }));
  k.push(boxed(p('Gemini: ask it to check your Q8 explanation uses the words "close to the true value". Do not ask it to explain Q8 for you.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F2F6FB' }));

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

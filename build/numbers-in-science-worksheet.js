/**
 * Y7 Science, Numbers In Science, worksheet (7B). The fallback for the game. Non-calculator.
 * Every number checked in build/numbers-in-science-check.py, including the brief's AVOID rule:
 * no significant-figure answer is a whole number ending in 0.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Numbers In Science';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y7 Science  ·  Numbers In Science  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Numbers In Science'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Significant figures, scientific notation and the Kelvin scale all make a number exact.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'E3EDF6' }));
  k.push(runs([t('Non-calculator. ', { bold: true, size: 10.5 }), t('Show your working. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Significant figures and standard form.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Round 6.238 to 2 significant figures.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Round 0.0475 to 1 significant figure.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Write 3,400,000 in standard form.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Write 0.00029 in standard form.', { marks: 1 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Celsius, Kelvin, and one more rounding.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Convert 18°C to kelvin.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Convert 300 K to Celsius.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Round 245.7 to 3 significant figures.', { marks: 1 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A thermometer reads 3.05 × 10² K. Convert this to degrees Celsius. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Two students write the same measurement in standard form. Student A writes 47 × 10⁻⁴. Student B writes 4.7 × 10⁻³. State which student has written it correctly, and explain why.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A measurement of 0.00650 has been written to 3 significant figures. Explain how you know it is 3 significant figures, and not 2.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q9 and Q10. Do not ask it to solve a question you have not tried yourself first.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E3EDF6' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./numbers-in-science-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

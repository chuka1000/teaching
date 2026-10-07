/**
 * Y7 Science, Measuring And Recording Honestly, worksheet (7B). The fallback for the game. Every
 * accuracy/precision example is checked in build/measuring-and-recording-honestly-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Measuring And Recording Honestly';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y7 Science  ·  Measuring And Recording Honestly  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Measuring And Recording Honestly'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Choose the right tool, record it exactly, and never change what you saw.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'E3EDF6' }));
  k.push(runs([t('For every question below: ', { bold: true, size: 10.5 }), t('accurate means close to the true value, precise means the readings are close together. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The two words.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'State what accuracy means.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State what precision means.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'A thermometer is zeroed incorrectly and always reads 1°C too high. State whether it is accurate, precise, both, or neither.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State two things a results table column heading should include.', { marks: 2 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Real readings, and honest recording.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Three repeated length readings are 20.1 cm, 20.0 cm and 19.9 cm. The true length is 20.0 cm. Determine whether these readings are accurate, precise, both, or neither. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Three repeated mass readings are 12.8 g, 15.3 g and 17.8 g. The true mass is 15.3 g. Determine whether these readings are accurate, precise, both, or neither. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Explain why a scientist should never change a result to match their prediction.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A ruler is marked every 1 mm. A student says a length is "exactly on the 45 mm mark" and records it as "45.00 mm". Explain why this is dishonest, even though the number might be correct.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Two students measure the boiling point of the same water sample five times. The true value is 100°C. Student A: 99°C, 100°C, 101°C, 99°C, 101°C. Student B: 97°C, 97°C, 98°C, 97°C, 98°C. Compare their accuracy and precision. Show your working.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('10', 'A group\'s stopwatch timings always start 0.4 seconds late, because of human reaction time, but the delay is almost exactly the same every time. Explain, using the words accuracy and precision, what this means for their timing data.', { marks: 3 }));
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
  const answers = await DP.answersBlock(require('./measuring-and-recording-honestly-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

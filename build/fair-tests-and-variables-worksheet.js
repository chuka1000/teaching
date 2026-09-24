/**
 * Y7 Science — Fair Tests and Variables, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'Fair Tests and Variables';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can name the manipulated (independent) variable.',
  'I can name the responding (dependent) variable.',
  'I can list variables that should be controlled.',
  'I can explain why we repeat a test.',
];

const head = (right) => new Header({ children: [runs([
  t('Y7 Science  ·  Fair Tests and Variables  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Fair Tests and Variables'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 120 }));
  k.push(ragGrid(SUCCESS));

  k.push(boxed(p('If [I change this], then [this happens], because [reason].', {
    size: 15, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FDF3DC' }));

  k.push(runs([
    t('The question: ', { bold: true, size: 10.5 }),
    t('does a paper aeroplane fly further if it is heavier? Name it, control it, design it. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Name it, for the aeroplane question.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Name the manipulated variable.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Name the responding variable.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Circle the correct word: a controlled variable is kept the same / changed on purpose.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State why scientists repeat a test.', { marks: 1 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Control it, so the test is fair.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('5', 'List three variables that must be controlled to make the aeroplane test fair.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Explain why the thrower should stay the same every time.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'For "does more sugar make ice melt faster", name the manipulated variable and the responding variable.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Design it, and justify your choices.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('8', 'Write a testable hypothesis for the aeroplane question. Use the "if...then...because" shape.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Explain why you should throw the aeroplane more than once at each weight, and what you would do with the results.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Choose your own question to test. Name all three kinds of variable for it.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether the variables you named in Q10 are actually manipulated, responding, or controlled. Do not ask it to choose your question for you. Choosing and justifying it is the skill being assessed.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E3EDF6' }));

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

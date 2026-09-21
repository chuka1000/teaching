/**
 * Y7 Science — How Scientists Investigate, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'How Scientists Investigate';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const SUCCESS = [
  'I can list the steps of a scientific investigation.',
  'I can say why the steps are a guide, not a fixed order.',
  'I can write a hypothesis that can actually be tested.',
  'I can identify the independent and dependent variable.',
];

const head = (right) => new Header({ children: [runs([
  t('Y7 Science  ·  How Scientists Investigate  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('How Scientists Investigate'));
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
    t('Remember: the steps of an investigation are a guide, not a fixed order. ', { bold: true, size: 10.5 }),
    t('Real investigations loop back when a result is strange. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Spot it — which statements are actually testable?', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Circle the word that means "a prediction you can test": guess / hypothesis / opinion.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Is this testable? "Sugar dissolves faster in hot water than in cold water."', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Is this testable? "Chemistry is the best science."', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Which flame do you use when you are not heating something?', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Fix it — turn a vague idea into a testable hypothesis.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('5', 'Rewrite this so it can be tested: "Plants like sunshine."', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'In your hypothesis from Q5, what is the independent variable — the thing you change?', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('7', 'In your hypothesis from Q5, what is the dependent variable — the thing you measure?', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('8', 'Why should you only change one variable at a time?', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Design it — write and justify your own investigation.', { size: 10, italic: true, color: C.alert, after: 60 }));

  k.push(q('9', 'Write your own testable hypothesis about something in this room. Use the "if...then...because" shape.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Explain why the steps of an investigation are not always done in the same order. Give an example of when you might go back to an earlier step.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your hypothesis from Q5 or Q9 is actually testable, and why. Do not ask it to write the hypothesis for you — that is the skill being assessed.', {
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

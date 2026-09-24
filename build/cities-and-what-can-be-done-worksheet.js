/**
 * Y9 Science — Cities And What Can Be Done, worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Same worksheet for
 * 9G and 9I. "Runoff" is defined in brackets wherever it appears, because it
 * was the word that did not land last lesson. Silver Q6-7 and Gold Q9-10 ask
 * for the real places (Wuhan, London), so the worksheet ends on what can be
 * done, not on the damage.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Cities And What Can Be Done';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y9 Science  ·  Cities And What Can Be Done  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Cities And What Can Be Done'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('Cities change land. They can also be built to protect it.', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'ECE1CB' }));

  k.push(runs([
    t('Runoff ', { bold: true, size: 10.5 }),
    t('is rain that flows over the surface instead of soaking in. ', { size: 10.5 }),
    t('Permeable ', { bold: true, size: 10.5 }),
    t('means water can pass through. ', { size: 10.5 }),
    t('Brownfield ', { bold: true, size: 10.5 }),
    t('is land that has been built on before. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Describe it, quickly.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Describe what urbanisation is.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Name two ways building on land changes it.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'State what runoff is.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State what happens to soil that is sealed under concrete or tarmac.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Explain it. Use real places.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Explain why a city floods more than a field in the same rain.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Describe how a sponge city reduces damage to land. Give one real example.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Describe how a green belt reduces damage to land. Give one real example.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Judge it. Name the place, and use a fact.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A council can tarmac a car park or use permeable paving. Compare the two.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Someone says: "Cities are bad for land, and nothing can be done." Judge this claim using a real example. What is true in it? What is not?', { marks: 3 }));
  k.push(ruledBox(4));
  k.push(q('10', 'Explain why protecting land before it is built on is better than repairing it later. Use how long soil takes to form.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q9 answer names a real place and a real fact, and whether it says what is true in the claim as well as what is not. Do not ask it to judge the claim for you. Weighing it yourself is the point.', {
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

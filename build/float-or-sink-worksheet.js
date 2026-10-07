/**
 * Y10 Co-ordinated Science (0654), Float Or Sink, worksheet (10A). The fallback for the game.
 * Every comparison checked in build/float-or-sink-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('density');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Float Or Sink';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y10 Co-ordinated Science (0654)  ·  Float Or Sink  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Float Or Sink'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Floating and sinking is decided by comparing densities, not weights.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'D7E8EA' }));
  k.push(runs([t('P1.4.3. ', { bold: true, size: 10.5 }), t('Water’s density is 1.00 g/cm³ unless stated otherwise. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Comparing given densities.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'State the rule that decides whether an object floats or sinks in a liquid.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'A block has a density of 0.7 g/cm³. Determine whether it floats or sinks in water.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'A stone has a density of 2.5 g/cm³. Determine whether it floats or sinks in water.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State the density of ice and the density of water, in g/cm³.', { marks: 2 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Calculating a density, and explaining ice.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'A metal cube has a mass of 54 g and a volume of 20 cm³. Calculate its density, then determine whether it floats or sinks in water. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Explain, in terms of density, why ice floats on water.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'A student says: "Ice floats because it has trapped air inside it." Explain what is wrong with this statement.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A hollow ball has a total mass of 45 g and a total volume of 90 cm³, including the air inside. Calculate its average density and determine whether it floats or sinks in water. Then explain why a SOLID ball of the same material (density 3.0 g/cm³) would sink.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('9', 'A ship is made of steel (density about 7.9 g/cm³), which is denser than water. Explain, using the idea of average density, why the ship still floats.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'An object has a density of 1.01 g/cm³. It sinks in fresh water (density 1.00 g/cm³). Predict, with a reason, what would happen to the same object in seawater (density 1.03 g/cm³).', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q8 and Q9. Do not ask it to solve a question you have not tried yourself first.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'D7E8EA' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./float-or-sink-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

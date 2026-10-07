/**
 * Y8 Science, Fossils And The Fossil Record, worksheet (8I). The fallback for the game.
 * Questions 1-10 have their answers UPSIDE DOWN on the last page (no Answers slide).
 * Q1-4 Bronze (how a fossil forms), Q5-7 Silver (reading the layers, with a diagram), Q8-10 Gold
 * (the gaps). Q10 is the "gaps mean evolution is wrong" misconception as an explanation.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun, ImageRun } = D;

const LESSON = 'Fossils And The Fossil Record';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y8 Science  ·  Fossils And The Fossil Record  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** the rock-layers diagram, an inline picture (type: 'png' is required or Word shows nothing) */
function strata() {
  const data = fs.readFileSync(path.join(__dirname, '..', 'assets', 'media', 'fossils-worksheet-strata.png'));
  const w = 470, h = Math.round(w * 640 / 900);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120 }, keepNext: true, children: [
    new ImageRun({ type: 'png', data, transformation: { width: w, height: h }, altText: { name: 'rock layers', title: 'Rock layers', description: 'Five rock layers, A at the top to E at the bottom. Layer A has a mammal bone, B dinosaur bones, C a clam shell, D an ammonite and E a trilobite.' } }),
  ] });
}

/** an ordering item: a blank to write the number in, then the statement */
const step = (label, text) => runs([t(`${label}   `, { bold: true, size: 10.5, color: C.dark }), t('____', { size: 10.5, color: C.rule }), t(`   ${text}`, { size: 10.5 })], { after: 70, indent: { left: 280 } });

function worksheet(answers) {
  const k = [];
  k.push(h1('Fossils And The Fossil Record'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));
  k.push(boxed(p('Hard parts, buried fast. Fossils are rare. The rocks give the order.', {
    size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'F3E7CE' }));
  k.push(runs([
    t('Three ideas: ', { bold: true, size: 10.5 }),
    t('how a fossil forms, what the layers tell us, and why there are gaps. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('How a fossil forms.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Put these five steps in order. Write 1 to 5 on the lines.', { marks: 3 }));
  k.push(step('a', 'The soft parts rot away.'));
  k.push(step('b', 'The rock is worn away and the fossil is found.'));
  k.push(step('c', 'The animal dies.'));
  k.push(step('d', 'Minerals turn the hard parts to stone as the layers become rock.'));
  k.push(step('e', 'Mud and sand bury the animal quickly.'));
  k.push(p('', { after: 60 }));
  k.push(q('2', 'Name two parts of an animal that can become fossils.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Circle the animal that is most likely to become a fossil.   a jellyfish   /   a snail with a shell   /   an earthworm', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'State why quick burial helps a fossil to form.', { marks: 1 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Reading the layers. Use the diagram.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(strata());
  k.push(q('5', 'State which layer is the oldest.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('6', 'The trilobite is in layer E. The clam shell is in layer C. State which lived first, and explain how you know.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('7', 'The fossils are different in each layer. State two things this shows about living things.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('The gaps.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'Explain why there are many fossils of shellfish but very few of jellyfish.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Give two reasons why the fossil record has gaps.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A student says: "There are gaps in the fossil record, so evolution did not happen." Explain what is wrong with this.', { marks: 3 }));
  k.push(ruledBox(5));

  k.push(p('', { after: 120 }));
  k.push(boxed(p('Gemini: ask it to check your Q10 answer against the two halves of the banner (fossils are rare; the fossils we have show change). Do not ask it to write the answer for you.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F3E7CE' }));
  k.push(...answers);                       // the answers, upside down, at the end

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./fossils-and-the-fossil-record-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

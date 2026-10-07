/**
 * Y8 Science, More Evidence, worksheet (8I). The fallback for the game. Answers UPSIDE DOWN on the
 * last page (no Answers slide). Q1-4 Bronze (bones), Q5-7 Silver (bones, embryos), Q8-10 Gold (DNA).
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed, table, cell } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun, ImageRun, TableRow } = D;

const LESSON = 'More Evidence';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y8 Science  ·  More Evidence  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** the four limbs, an inline picture (type: 'png' is required or Word shows nothing) */
function limbs() {
  const data = fs.readFileSync(path.join(__dirname, '..', 'assets', 'media', 'evidence-worksheet-limbs.png'));
  const w = 480, h = Math.round(w * 560 / 900);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120 }, keepNext: true, children: [
    new ImageRun({ type: 'png', data, transformation: { width: w, height: h }, altText: { name: 'four limbs', title: 'Four limbs', description: 'The forelimbs of a human, a cat, a whale and a bat. The bones are coloured: humerus red, radius and ulna amber, wrist bones teal, hand bones dark green, finger bones violet.' } }),
  ] });
}
/** a small three-row DNA table (a top-level table, so it survives Google Docs) */
function dnaTable() {
  const w1 = 2600, w2 = 2000;
  const row = (a, b, bold) => new TableRow({ children: [cell(p(a, { size: 10.5, bold, after: 0 }), { w: w1, fill: bold ? 'F3E7CE' : undefined }), cell(p(b, { size: 10.5, bold, after: 0, align: AlignmentType.CENTER }), { w: w2, fill: bold ? 'F3E7CE' : undefined })] });
  return table([row('Pair of species', 'DNA letters that differ (out of 1000)', true), row('P and Q', '12'), row('P and R', '30'), row('Q and R', '28')], [w1, w2 + 1400]);
}

function worksheet(answers) {
  const k = [];
  k.push(h1('More Evidence'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Bones, embryos and DNA all point to a shared ancestor.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F3E7CE' }));
  k.push(runs([t('Three kinds of evidence: ', { bold: true, size: 10.5 }), t('bones, early development and DNA. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Bones. Use the diagram of four limbs.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(limbs());
  k.push(q('1', 'Name the bone that is coloured red in every limb.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State how the bones of the four limbs are the same.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'State how the jobs of the four limbs are different.', { marks: 1 }));
  k.push(ruledBox(2));
  k.push(q('4', 'State what we call structures that have the same bones but do different jobs.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Bones and early development.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'A human arm and a bat\'s wing have the same bones. Explain what this suggests.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('6', 'State two features that early vertebrate embryos share.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'A student says: "A human embryo turns into a fish." Explain what is wrong with this.', { marks: 2 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('DNA.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'Two species differ at 6 of 300 DNA letters. Calculate the percentage of the DNA letters that is the same. Show your working.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('9', 'The table shows how many DNA letters differ between three species. State which two species are most closely related, and explain how you know.', { marks: 2 }));
  k.push(dnaTable());
  k.push(p('', { after: 60 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Explain why DNA is the strongest evidence we have. Give two reasons.', { marks: 3 }));
  k.push(ruledBox(5));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check your Q10 answer against the three reasons DNA is strong. Do not ask it to write the answer for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F3E7CE' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./more-evidence-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

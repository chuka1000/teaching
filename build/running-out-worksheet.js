/**
 * Y9 Science, Running Out, worksheet (9G and 9I, taught identically). The fallback for the
 * game. Every number checked in build/running-out-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Running Out';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y9 Science  ·  Running Out  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Running Out'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Resource depletion means using a resource faster than it can be replaced.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'ECE1CB' }));
  k.push(runs([t('Sustainable yield: ', { bold: true, size: 10.5 }), t('stock × growth rate. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The idea, and one calculation.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'State what resource depletion means.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State one thing that must be true for a resource to count as non-renewable.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'A resource store of 40,000 tonnes loses half of what remains every year. Calculate how much is left after 2 years.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'Name one real consequence of a resource running very low, from today’s lesson.', { marks: 1 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Applying the idea, and the passenger pigeon.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'A seal colony of 50,000 seals grows by 4% a year. 2,500 seals are taken each year. Determine whether the colony is being depleted, staying the same, or growing. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Explain why the passenger pigeon could not recover, even though billions once existed.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Using one of today’s real cases, explain what happened when a resource was used faster than it could be replaced.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A resource store of 250,000 tonnes loses a fifth of what remains every year. Calculate how much is left after 3 years.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'A fish stock of 90,000 tonnes grows by 6% a year, and 7,000 tonnes are caught each year. Determine whether the stock is being depleted, staying the same, or growing. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Describe two things that could be done to stop a renewable resource from being depleted, and explain how each one works.', { marks: 4 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q9 and Q10. Do not ask it to solve a question you have not tried yourself first.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'ECE1CB' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./running-out-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

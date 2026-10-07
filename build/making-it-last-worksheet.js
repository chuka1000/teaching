/**
 * Y9 Science, Making It Last, worksheet (9G and 9I, taught identically). The fallback for the
 * game. Every number checked in build/making-it-last-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('topsoil');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Making It Last';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y9 Science  ·  Making It Last  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

function worksheet(answers) {
  const k = [];
  k.push(h1('Making It Last'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Making it last means taking no more than a resource can replace.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'ECE1CB' }));
  k.push(runs([t('Sustainable yield: ', { bold: true, size: 10.5 }), t('stock × growth rate. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The two ideas.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'State what conservation means.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State what it means to take a sustainable amount of a resource.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'A fish stock of 150,000 tonnes grows by 6% a year. Calculate the maximum sustainable catch.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'Name two ways a resource can be managed in practice.', { marks: 2 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Applying the idea, and the whale and cod contrast.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'A forest of 80,000 hectares grows by 5% a year. Loggers cut 3,000 hectares a year. Determine whether the forest grows, shrinks, or stays the same. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Explain why a forest cut faster than its regrowth rate will eventually run out, even though trees can still regrow.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Using the whale and cod examples, explain why timing matters in conservation.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'A fish stock of 120,000 tonnes grows by 5% a year, and 9,000 tonnes are caught each year. Determine whether the stock grows, shrinks, or stays the same. Show your working.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('9', 'A stock of 60,000 tonnes is caught at a steady 2,000 tonnes a year more than its sustainable yield. Calculate how many years it would take for the stock to reach zero, assuming this net loss stays the same.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'A fishery has collapsed. Describe two different management methods that could be used together to help the stock recover, and explain what each one does.', { marks: 4 }));
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
  const answers = await DP.answersBlock(require('./making-it-last-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

/**
 * Y8 Science, Natural Selection In Action, worksheet (8I).
 * Questions 1-10 match the Answers slide exactly, in order. The beak game
 * results table sits at the top of Bronze because Q4 is answered from it.
 * Q1-4 Bronze, Q5-7 Silver, Q8-10 Gold. Q10 is objective 3 as a writing task.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, TableRow, AlignmentType, HeightRule, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'Natural Selection In Action';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y8 Science  ·  Natural Selection In Action  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

/** Beak game results: six players, beak and beans for rounds 1 to 3, and the round they were out. */
function resultsTable() {
  const wA = 1300, wB = 2000, wR = 1500, wO = PAGE_W - wA - wB - 3 * wR;
  const widths = [wA, wB, wR, wR, wR, wO];
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  const rowFor = (n) => new TableRow({
    height: { value: 520, rule: HeightRule.ATLEAST },
    children: [
      cell(p(`Player ${n}`, { bold: true, size: 10.5, after: 0, color: C.dark }), { w: wA }),
      ...[wB, wR, wR, wR, wO].map((w) => cell(p('', { after: 0 }), { w })),
    ],
  });
  return table([
    new TableRow({ children: [hdr('', wA), hdr('Beak', wB), hdr('Round 1', wR), hdr('Round 2', wR), hdr('Round 3', wR), hdr('Out in round', wO)] }),
    ...[1, 2, 3, 4, 5, 6].map(rowFor),
  ], widths);
}

function worksheet() {
  const k = [];
  k.push(h1('Natural Selection In Action'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('Nothing changes on purpose.', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'F3E7CE' }));

  k.push(runs([
    t('The four steps: ', { bold: true, size: 10.5 }),
    t('variation, competition, survival, inheritance. Questions 1 to 10 are on the board at the end.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Record it. Fill in your beak game results first.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(resultsTable());
  k.push(p('', { after: 100 }));
  k.push(q('1', 'Name the four steps of natural selection.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'In the beak game, state what the beans stood for.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('3', 'In the beak game, state what it stood for when a player was out.', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Use your table. State which beak collected the most beans in round 1.', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Explain it. Use the four steps.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Explain how competition happened on Daphne Major in 1977.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Explain why the finches\' chicks had deeper beaks.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('7', 'Explain why an antibiotic kills most bacteria but not all of them.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Rewrite it. Nothing wants, needs, tries or learns.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'The beak game is a model. State one way it is different from the real finches.', { marks: 2 }));
  k.push(ruledBox(3));
  k.push(q('9', 'Explain why antibiotic resistance is natural selection, using the four steps.', { marks: 3 }));
  k.push(ruledBox(5));
  k.push(q('10', 'A student writes: "The bacteria wanted to survive, so they became resistant." Rewrite the sentence so the bacteria do not change on purpose.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check whether your Q10 answer says any bacterium wanted, needed, tried or learned anything. Do not ask it to write the answer for you.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F3E7CE' }));

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

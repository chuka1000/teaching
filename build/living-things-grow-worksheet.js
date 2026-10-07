/**
 * T3 Developing Science (CLIL), Unit 4 Lesson 3: Living Things Grow, worksheet. Short: it is Friday P7 (CLIL.md).
 * A: number jumbled photographs 1, 2, 3. B: the frame from a picture pair. C: circle yes or no.
 * Every answer comes from build/living-things-grow-answers.js, which also gives the answers printed UPSIDE DOWN.
 */
const ANS = require('./living-things-grow-answers');
const WS = require('./living-things-sheet')({ lesson: 'Living Things Grow', header: 'Living things, Lesson 3' });
const { p, runs, t, cell, table, picPara, C, PAGE_W, TableRow, AlignmentType, VerticalAlign } = WS;

/** A: each set of pictures in a row, with an empty box under each for the number. */
function orderRows() {
  return ANS.SHEET_A.map((r, i) => {
    const w0 = 700, w = Math.floor((PAGE_W - w0) / 3);
    return table([new TableRow({
      cantSplit: true,
      children: [
        cell(runs([t(`${i + 1}`, { bold: true, size: 14, color: C.accent })], { after: 0, align: AlignmentType.CENTER }), { w: w0, valign: VerticalAlign.CENTER }),
        ...[0, 1, 2].map((j) => cell(r.shown[j] ? [
          picPara([r.shown[j]], 82, { before: 30, after: 30 }),
          p(ANS.name(r.shown[j]), { size: 12, bold: true, align: AlignmentType.CENTER, after: 40 }),
          table([new TableRow({ children: [cell(p(' ', { size: 16, after: 0 }), { w: 700 })] })], [700]),
        ] : [p('', { after: 0 })], { w, valign: VerticalAlign.TOP })),
      ],
    })], [w0, w, w, w]);
  });
}

/** C: a picture, the question, and "yes   no" to circle. */
function yesNo() {
  const w1 = 1500, w2 = PAGE_W - w1 - 2600, w3 = 2600;
  return table(ANS.SHEET_C.map((r, i) => new TableRow({
    cantSplit: true,
    children: [
      cell(picPara([r.key], 46, { before: 20, after: 20 }), { w: w1 }),
      cell(runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t(`Do ${r.plural} grow?`, { size: 14 })], { after: 0 }), { w: w2, valign: VerticalAlign.CENTER }),
      cell(p('yes          no', { size: 16, bold: true, align: AlignmentType.CENTER, after: 0 }), { w: w3, valign: VerticalAlign.CENTER }),
    ],
  })), [w1, w2, w3]);
}

(async () => {
  const k = [];
  k.push(...WS.top('Living things grow', [
    'I can say grow and change.',
    'I can put the pictures in order.',
    'I can write: A puppy grows into a dog.',
  ], ['grow', 'change', 'living', 'non-living']));

  k.push(WS.sect('A', 'Put in order'));
  k.push(WS.how('What is first? Write 1, 2, 3 in the boxes.'));
  orderRows().forEach((tb) => { k.push(tb); k.push(p('', { size: 4, after: 60 })); });

  k.push(new WS.Paragraph({ children: [new WS.PageBreak()] }));
  k.push(WS.sect('B', 'Write the sentence'));
  k.push(WS.how('Look at the pictures. Write the two words.'));
  k.push(WS.sentences(ANS.SHEET_B.map(([y, g]) => ({ key: [y, g], pre: 'A ', post: ` grows into a ${'_'.repeat(14)}.` }))));

  k.push(WS.sect('C', 'Yes or no?'));
  k.push(WS.how('Circle yes or no. Then say the sentence.'));
  k.push(yesNo());
  k.push(p('', { size: 4, after: 100 }));
  k.push(...await WS.tail(ANS, 'Finished? Write one more: A ______ grows into a ______.'));
  await WS.write(k);
})();

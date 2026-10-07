/**
 * T3 Developing Science (CLIL), Unit 4 Lessons 4 and 5 (the Tuesday double): Why Is It Living?, worksheet.
 * Page 1, before the break: because sentences. A: finish with grows / does not grow. B: write the whole sentence.
 * C: right or wrong, then fix it. Page 2, after the break: the hunt sheet (the unit plan's sorting chart, filled from the
 * room) and one Life on Land sentence. Answers printed UPSIDE DOWN at the end, from build/why-is-it-living-answers.js.
 */
const ANS = require('./why-is-it-living-answers');
const WS = require('./living-things-sheet')({ lesson: 'Why Is It Living', header: 'Living things, Lessons 4 and 5' });
const { p, runs, t, cell, table, picPara, writeLines, C, PAGE_W, TableRow, AlignmentType, VerticalAlign } = WS;

/** C: a picture, a sentence, and "right   wrong" to circle; a line under it to fix a wrong one. */
function rightWrong() {
  const w1 = 1500, w3 = 2300, w2 = PAGE_W - w1 - w3;
  return table(ANS.SHEET_C.map((r, i) => new TableRow({
    cantSplit: true,
    children: [
      cell(picPara([r.key], 46, { before: 20, after: 20 }), { w: w1 }),
      cell([runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t(r.say, { size: 13 })], { after: 60 }), ...writeLines(1, w2 - 300, { keepNext: false })], { w: w2, valign: VerticalAlign.CENTER }),
      cell(p('right      wrong', { size: 15, bold: true, align: AlignmentType.CENTER, after: 0 }), { w: w3, valign: VerticalAlign.CENTER }),
    ],
  })), [w1, w2, w3]);
}

/** The hunt sheet: two boxes, three numbered lines in each. */
function huntBoxes() {
  const half = Math.floor(PAGE_W / 2);
  const head = (label, fill) => cell(p(label, { size: 13, bold: true, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 }), { w: half, fill });
  const lines = () => cell([1, 2, 3].flatMap((n) => [runs([t(`${n}`, { bold: true, size: 12, color: C.accent })], { before: 120, after: 0 }), ...writeLines(1, half - 300, { keepNext: false })]), { w: half });
  return table([new TableRow({ cantSplit: true, children: [head('living', '237D38'), head('non-living', '5E6B78')] }), new TableRow({ cantSplit: true, children: [lines(), lines()] })], [half, half]);
}

(async () => {
  const k = [];
  k.push(...WS.top('Why is it living?', [
    'I can say why a thing is living: because it grows.',
    'I can say why a thing is non-living: because it does not grow.',
    'I can find living and non-living things around me.',
  ], ['because', 'grows', 'eats', 'does not grow', 'living', 'non-living'], 13));

  k.push(WS.sect('A', 'Finish it'));
  k.push(WS.how('Write grows or does not grow.'));
  k.push(WS.sentences(ANS.SHEET_A.map((r) => ({ key: r.key, pre: r.pre, gapLen: 12 }))));

  k.push(WS.sect('B', 'Write why'));
  k.push(WS.how('Look at the picture. Write the whole sentence: A ___ is ___ because it ___.'));
  k.push(WS.sentences(ANS.SHEET_B.map((r) => ({ key: r.key, whole: true, prompt: `Why is a ${ANS.name(r.key)} ${ANS.kind(r.key)}?` })), 1));

  k.push(new WS.Paragraph({ children: [new WS.PageBreak()] }));
  k.push(WS.sect('C', 'Right or wrong?'));
  k.push(WS.how('Circle right or wrong. If it is wrong, write it again so it is right.'));
  k.push(rightWrong());

  k.push(WS.sect('D', 'The living things hunt'));
  k.push(WS.how('After the break. Find 3 living things and 3 non-living things in the room. Write them here.'));
  k.push(huntBoxes());
  k.push(runs([t('Choose one. Write: ', { size: 11.5, bold: true }), t('We found a ___. It is living because it ___.', { size: 11.5, italic: true })], { before: 140, after: 40, keepNext: true }));
  k.push(...writeLines(1, PAGE_W - 200, { keepNext: false }));

  k.push(WS.sect('E', 'Life on land'));
  k.push(WS.how('What can we do for living things? Write one sentence: We ...'));
  k.push(...writeLines(1, PAGE_W - 200, { keepNext: false }));
  k.push(p('', { size: 4, after: 80 }));
  k.push(...await WS.tail(ANS));
  await WS.write(k);
})();

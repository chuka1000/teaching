/**
 * T3 Developing Science (CLIL), Unit 8 Lessons 4 and 5: What Is It Made Of, worksheet. THE DOUBLE: page 1 is the first half
 * (A write the sentence, B sort by element, C right or wrong), page 2 is the second half (D describe the four samples, the
 * written form of the oral check). Picture-led, a word bank and writing lines (CLIL.md).
 * Every answer comes from build/what-is-it-made-of-answers.js, which also gives the answers printed UPSIDE DOWN.
 */
const ANS = require('./what-is-it-made-of-answers');
const WS = require('./periodic-sheet')({ lesson: 'What Is It Made Of', header: 'The Periodic Table, Lessons 4 and 5' });
const { p, runs, t, C, PAGE_W, TableRow, AlignmentType, VerticalAlign } = WS;

(async () => {
  const k = [];
  k.push(...WS.top('What is it made of?', [
    'I can say what a thing is made of.',
    'I can sort things by what they are made of.',
    'I can write: A nail is made of iron.',
  ], ['made of', 'full of', 'iron', 'gold', 'copper', 'oxygen', 'helium', 'metal', 'non-metal'], 11));

  k.push(WS.sect('A', 'Write the sentence'));
  k.push(WS.how('Look at the picture. Write the whole sentence: A ___ is made of ___.'));
  k.push(WS.sentences(ANS.SHEET_A.map((key) => ({ key, whole: true, prompt: `Write: A ___ ${ANS.verb(key)} ___.` }))));

  k.push(WS.sect('B', 'Sort'));
  k.push(WS.how('Write the name of each thing in the right box.'));
  {
    const w = Math.floor(PAGE_W / 6);
    k.push(WS.table([new TableRow({ cantSplit: true, children: ANS.SHEET_B.map((key) => WS.cell([
      WS.picPara([key], 46, { before: 20, after: 20 }), p(ANS.objName(key), { size: 11, bold: true, align: AlignmentType.CENTER, after: 0 }),
    ], { w })) })], Array(6).fill(w)));
  }
  k.push(p('', { size: 4, after: 80 }));
  k.push(WS.sortBoxes(ANS.SHEET_B_BOXES, 2, ['DCE9F5', 'DCE9F5', 'DCE9F5', 'DDF3EA']));

  k.push(WS.sect('C', 'Right or wrong?'));
  k.push(WS.how('Circle right or wrong. If it is wrong, write the right sentence.'));
  k.push(WS.rows(ANS.SHEET_C.map((r) => ({ key: r.key, text: r.text })), (r, i) => [
    runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t(r.text, { size: 14 })], { after: 60 }),
    runs([t('right          wrong', { size: 14, bold: true, color: C.dark }), t('      ' + '_'.repeat(22), { size: 12, color: C.rule })], { after: 0 }),
  ], { px: 46, minH: 760, w1: 1300 }));

  k.push(WS.sect('D', 'Describe the samples'));
  k.push(WS.how('Look at the picture and at the sample. Write the whole sentence: This is ___. It is a ___. It is ___.'));
  k.push(WS.sentences(ANS.SAMPLES.map((key) => ({ key, whole: true, prompt: 'This is ___. It is a ___. It is ___.' })), 1));
  k.push(p('', { size: 4, after: 100 }));
  k.push(...await WS.tail(ANS, 'Finished? Write one more: A ______ is made of ______. / Metals conduct ______.'));
  await WS.write(k);
})();

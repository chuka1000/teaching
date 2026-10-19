/**
 * T3 Developing Science (CLIL), Unit 8 Lesson 3: Does It Light Up, worksheet. Short: it is Friday P7 (CLIL.md).
 * A: predict, test, record (circle yes or no, ON or OFF). B: finish the sentence. C: sort the five names into two boxes.
 * Every answer comes from build/does-it-light-up-answers.js, which also gives the answers printed UPSIDE DOWN.
 */
const ANS = require('./does-it-light-up-answers');
const WS = require('./periodic-sheet')({ lesson: 'Does It Light Up', header: 'The Periodic Table, Lesson 3' });
const { p, runs, t, C, PAGE_W, TableRow, AlignmentType } = WS;

(async () => {
  const k = [];
  k.push(...WS.top('Does it light up?', [
    'I can say conducts and does not conduct.',
    'I can test with a circuit.',
    'I can write: Copper conducts electricity.',
  ], ANS.BANK, 12));

  k.push(WS.sect('A', 'Test. Look. Write.'));
  k.push(WS.how('First circle yes or no: I think the bulb will light up. Then test. Then circle ON or OFF.'));
  k.push(WS.rows(ANS.SHEET_A.map((key) => ({ key, label: ANS.name(key) })), (r, i) => [
    runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t('I think:   ', { size: 13 }), t('yes          no', { size: 15, bold: true, color: C.dark })], { after: 100 }),
    runs([t('    ', { size: 12 }), t('The bulb:   ', { size: 13 }), t('ON          OFF', { size: 15, bold: true, color: C.dark })], { after: 0 }),
  ], { px: 58, minH: 800 }));

  k.push(new WS.Paragraph({ children: [new WS.PageBreak()] }));
  k.push(WS.sect('B', 'Finish the sentence'));
  k.push(WS.how('Look at the bulb. Write conducts or does not conduct.'));
  k.push(WS.sentences(ANS.SHEET_B.map((key) => ({ key, pre: `${ANS.element(key)[0].toUpperCase()}${ANS.element(key).slice(1)} `, post: ' electricity.', gapLen: 18 }))));

  k.push(WS.sect('C', 'Sort'));
  k.push(WS.how('Write the five names in the two boxes.'));
  {
    const w = Math.floor(PAGE_W / 5);
    k.push(WS.table([new TableRow({ cantSplit: true, children: ANS.SHEET_C.map((key) => WS.cell([
      WS.picPara([key], 52, { before: 20, after: 20 }), p(ANS.name(key), { size: 11, bold: true, align: AlignmentType.CENTER, after: 0 }),
    ], { w })) })], Array(5).fill(w)));
  }
  k.push(p('', { size: 4, after: 100 }));
  k.push(WS.sortBoxes(['conducts electricity', 'does not conduct electricity'], 4, ['D9EFE6', 'E3E8EC']));
  k.push(p('', { size: 4, after: 100 }));
  k.push(...await WS.tail(ANS, 'Finished? Test one more thing. Write: ______ conducts electricity. / ______ does not conduct electricity.'));
  await WS.write(k);
})();

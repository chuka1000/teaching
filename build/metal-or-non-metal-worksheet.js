/**
 * T3 Developing Science (CLIL), Unit 8 Lesson 2: Metal Or Non-Metal, worksheet. Picture-led, a word bank and writing lines
 * (CLIL.md). A: look and write the name, circle metal or non-metal (the table picture at the top shows the colours).
 * B: circle shiny or not shiny. C: copy the sentence, then write one of their own.
 * Every answer comes from build/metal-or-non-metal-answers.js, which also gives the answers printed UPSIDE DOWN.
 */
const ANS = require('./metal-or-non-metal-answers');
const WS = require('./periodic-sheet')({ lesson: 'Metal Or Non-Metal', header: 'The Periodic Table, Lesson 2' });
const { p, runs, t, C, writeLines, PAGE_W } = WS;

(async () => {
  const k = [];
  k.push(...WS.top('Metal or non-metal?', [
    'I can say metal and non-metal.',
    'I can say shiny.',
    'I can write: This is copper. It is a metal.',
  ], ANS.BANK.concat(['metal', 'non-metal', 'shiny', 'not shiny']), 11));

  k.push(WS.sect('A', 'Look and write'));
  k.push(WS.how('Look at the colour of the box on the table. Write the name. Circle metal or non-metal.'));
  k.push(WS.tablePic('pt_vials_ring', 430));
  k.push(WS.rows(ANS.SHEET_A.map((key) => ({ key })), (r, i) => [
    runs([t(`${i + 1}   `, { bold: true, size: 12, color: C.accent }), t('Name:  ', { size: 14 }), t('_'.repeat(20), { size: 14, color: C.dark })], { after: 80 }),
    WS.choice('metal', 'non-metal'),
  ], { px: 60, minH: 760 }));

  k.push(new WS.Paragraph({ children: [new WS.PageBreak()] }));
  k.push(WS.sect('B', 'Shiny or not shiny?'));
  k.push(WS.how('Look at the picture. Circle shiny or not shiny.'));
  k.push(WS.rows(ANS.SHEET_B.map((key) => ({ key })), (r, i) => [
    runs([t(`${i + 1}`, { bold: true, size: 12, color: C.accent })], { after: 60 }),
    WS.choice('shiny', 'not shiny', 16),
  ], { px: 74, minH: 820 }));

  k.push(WS.sect('C', 'Write the sentence'));
  k.push(WS.how('1. Copy the sentence. 2. Look at the picture and write your own.'));
  k.push(WS.sentences([
    { key: 'copper', whole: true, prompt: 'Copy: This is copper. It is a metal. It is shiny.' },
    { key: 'sulfur', whole: true, prompt: 'Write: This is ___. It is a ___. It is ___.' },
  ]));
  k.push(p('', { size: 4, after: 100 }));
  k.push(...await WS.tail(ANS, 'Finished? Write one more: This is ______. It is a ______.'));
  await WS.write(k);
})();

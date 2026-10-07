/**
 * T3 Developing Science (CLIL), Unit 4 Lesson 2: What Living Things Need, worksheet.
 * Picture-led, a word bank and writing lines (CLIL.md). A: the three needs from their photographs. B: Lesson 1's sort
 * again, with eight things the class saw in Lesson 1 (retrieval after half-term). C: today's frame, one gap, then whole.
 * Every answer comes from build/what-living-things-need-answers.js, which also gives the answers printed UPSIDE DOWN.
 */
const ANS = require('./what-living-things-need-answers');
const WS = require('./living-things-sheet')({ lesson: 'What Living Things Need', header: 'Living things, Lesson 2' });

(async () => {
  const k = [];
  k.push(...WS.top('What do living things need?', [
    'I can sort things: living or non-living.',
    'I can say what living things need: food, water, air.',
    'I can write the sentence: Plants need water.',
  ], ['need', 'food', 'water', 'air', 'living', 'non-living']));

  k.push(WS.sect('A', 'Look and write'));
  k.push(WS.how('Look at the picture. Write the word. Use the word bank.'));
  k.push(WS.writeGrid(ANS.SHEET_A, 3, 96));

  k.push(WS.sect('B', 'Sort'));
  k.push(WS.how('Is it living or non-living? Write each word in the right box.'));
  k.push(...WS.sortChart(ANS.SHEET_B, 4));

  k.push(new WS.Paragraph({ children: [new WS.PageBreak()] }));
  k.push(WS.sect('C', 'Write the sentence'));
  k.push(WS.how('Look at the picture. Write the missing word. Say the sentence.'));
  k.push(WS.sentences(ANS.SHEET_C.map((r) => (r.whole ? { key: r.key, whole: true, prompt: 'What do dogs need? Write the whole sentence.' } : { key: r.key, pre: r.pre, post: r.post }))));

  k.push(WS.sect('D', 'Point and say'));
  k.push(WS.p('Point at a picture. Your partner says the sentence. Then swap.', { size: 12, after: 40 }));
  k.push(WS.p('Partner check: did they say the whole sentence?', { size: 10, italic: true, color: WS.C.soft, after: 120 }));
  k.push(...await WS.tail(ANS, 'Finished? What do YOU need? Write two sentences: I need ...'));
  await WS.write(k);
})();

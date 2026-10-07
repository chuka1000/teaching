/**
 * Y8 Science, Deep Time, worksheet (8I). The fallback for the game. Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then
 * blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet this outside the
 * lesson?" (Q12). Gene flow, which 8I found hard, is Q9. Every date and number comes from build/deep-time.data.json through
 * build/deep-time-answers.js, so the sheet and the answers cannot disagree. Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, PageBreak } = D;
const A = require('./deep-time-answers');
const { N, DATA } = A;
const EV = (k) => DATA.events[k][1];

const LESSON = 'Deep Time';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const n = (x) => x.toLocaleString('en-GB');
const head = (right) => new Header({ children: [runs([t('Y8 Science  ·  Natural Selection, Lesson 9  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F2EBDD' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('Earth’s history is split into eras, and on a one-day clock humans arrive in the last few seconds.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F6E7C8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can describe the geologic time scale as a timeline of Earth’s history.', 'I can order major events in the history of life.', 'I can describe what a mass extinction is.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour.', { size: 10.5 })], { before: 160, after: 80 }));
  // the dates the questions need, so the sheet works without the slides
  k.push(...box('DATES YOU NEED (millions of years ago)', [
    `The eras:  Precambrian ${n(DATA.eras[0][1])} to ${DATA.eras[0][2]}   ·   Palaeozoic ${DATA.eras[1][1]} to ${DATA.eras[1][2]}   ·   Mesozoic ${DATA.eras[2][1]} to ${DATA.eras[2][2]}   ·   Cenozoic ${DATA.eras[3][1]} to now`,
    `Events:  first life ${n(EV('life'))}  ·  first fish ${EV('fish')}  ·  first plants on land ${EV('plants')}  ·  first dinosaurs ${EV('dinosaurs')}  ·  first mammals ${EV('mammals')}  ·  first birds ${EV('birds')}  ·  first flowering plants ${EV('flowers')}  ·  the asteroid ${EV('asteroid')}  ·  first humans ${EV('humans')}`,
  ]));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The eras and the order of events.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`Which era did the first land plants appear in? They appeared ${EV('plants')} million years ago.`, `The Palaeozoic ran from ${N.palaeo[0]} to ${N.palaeo[1]} million years ago. ${EV('plants')} is between ${N.palaeo[0]} and ${N.palaeo[1]}, so the Palaeozoic.`]));
  k.push(q('1', `Half-worked. Which era did the first dinosaurs appear in? They appeared ${EV('dinosaurs')} million years ago. The Mesozoic ran from ______ to ______ million years ago. ${EV('dinosaurs')} is between them, so the ______________.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Name the four eras in order, oldest first.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Put these in order, oldest first: first humans, first life, first fish, first land plants.', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('4', 'Describe what a mass extinction is.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'Which era do we live in now? Which era did the first birds appear in?', { marks: 2 }));
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Gaps, mistakes and reasons.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['A film shows people hunting dinosaurs. What is wrong?', `The last dinosaurs died out ${EV('asteroid')} million years ago. The first humans appeared ${EV('humans')} million years ago. ${EV('asteroid')} − ${EV('humans')} = ${N.dinoUs}, so they are about 66 million years apart. They never met.`]));
  k.push(q('6', `Half-worked. Stegosaurus lived about ${DATA.stegosaurus} million years ago and T. rex about ${DATA.trex} million years ago. ${DATA.stegosaurus} − ${DATA.trex} = ______ million years. T. rex to the first humans: ${DATA.trex} − ${EV('humans')} = ______ million years. So T. rex lived closer in time to ______________ than to Stegosaurus.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('7', 'Explain why the asteroid 66 million years ago counts as a mass extinction, not just an extinction.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('8', 'Why does that step work? In the worked examples a bigger number of years ago is further back in time. Explain why.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Use the words barrier and gene flow to explain how one population can become two species.', { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Deep time to scale. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`Squeeze ${n(DATA.earth_age)} million years into one 24-hour day, starting at midnight. When do the first dinosaurs appear (${EV('dinosaurs')} million years ago)?`, `${EV('dinosaurs')} ÷ ${n(DATA.earth_age)} × 24 = ${N.dinoHours} hours before midnight. ${N.dinoHours} × 60 = ${N.dinoMin} minutes. 24:00 − ${N.dinoMin} minutes = ${N.dinoClock}.`]));
  k.push(q('10', `Half-worked. The asteroid struck ${EV('asteroid')} million years ago. ${EV('asteroid')} ÷ ${n(DATA.earth_age)} × 24 = ______ hours before midnight. × 60 = ______ minutes, about 21 minutes. So the asteroid strikes at about ______.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('11', `The first humans appeared ${EV('humans')} million years ago. Calculate how many seconds before midnight that is on the one-day clock.`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Describe a place, or a film, where you could see deep time, and say what it shows about how long Earth’s history is.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('13', `A timeline ${n(DATA.earth_age / 100)} m long shows all of Earth’s history, so 1 m stands for 100 million years. How far from the "now" end is the asteroid? How far from it are the first humans?`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('14', `The Precambrian ran from ${n(DATA.eras[0][1])} to ${DATA.eras[0][2]} million years ago. Calculate what percentage of Earth’s history it covers.`, { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q9 and Q12. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F6E7C8' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./deep-time-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

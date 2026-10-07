/**
 * Y8 Science, The Greatest Show On Earth, worksheet (8I). The fallback for the game. Per TEMPLATE.md, in each tier a fully worked example,
 * a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you
 * meet this outside the lesson?" (Q12). The numbers and the ordering question come from build/the-greatest-show-on-earth-answers.js, so the sheet and
 * the answers cannot disagree. Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, PageBreak } = D;
const A = require('./the-greatest-show-on-earth-answers');
const { D: N, R, STEPS, ORDER, SHOWN } = A;

const LESSON = 'The Greatest Show On Earth';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const n = (x) => x.toLocaleString('en-GB');
const head = (right) => new Header({ children: [runs([t('Y8 Science  ·  Natural Selection, Lesson 8  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F2EBDD' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('A new species forms when two groups are kept apart for so long that they can no longer interbreed.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F6E7C8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can define a species and speciation.', 'I can describe how geographic isolation can lead to speciation.', 'I can explain why the isolated populations can no longer interbreed.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. The six steps: one population, a barrier, different conditions, different selection, differences build up, can no longer interbreed.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Species, speciation and isolation.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['Are a poodle and a labrador the same species?', 'They can breed, and their puppies can breed too. So they are one species, even though they look very different.']));
  k.push(q('1', 'Half-worked. Same species or different species?  (a) poodle and labrador: SAME (done for you)  (b) a horse and a donkey, whose young, a mule, cannot have young: __________  (c) a cat and a dog, which cannot have young together at all: __________  (d) two groups of oak trees whose seeds grow into oaks that can make seeds: __________', { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Define a species.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Define speciation, and say what geographic isolation means.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('4', 'Name two barriers that can cause geographic isolation.', { marks: 2 }));
  k.push(ruledBox(1));
  const lines = SHOWN.map((kk, i) => `(${'abcdef'[i]}) ${STEPS[ORDER[kk]]}`);
  k.push(q('5', 'A population of beetles lives in one valley. These six steps of what happens next are in the wrong order. Write the numbers 1 to 6 in the order they happen.', { marks: 3 }));
  lines.forEach((l, i) => k.push(p(l + '  ____', { size: 10, after: 30, keepNext: true })));   // the six lines stay on one page with their question
  k.push(ruledBox(1));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Darwin’s finches: isolation and selection.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['A few finches fly to a new island. The sea between the islands is a barrier, so the two groups no longer meet. The new island has small, soft seeds, so finches with slim beaks survive and have more young. On the first island the seeds are big and hard, so deep beaks survive. Over many thousands of generations the groups change in different ways. When they meet again they do not interbreed: there are now two species.']));
  k.push(q('6', 'Half-worked. On island A the seeds are big and hard. Finches with ________ beaks survive and have more young. So the allele for deep beaks becomes ________ common on island A. On island B slim beaks survive, so the allele for slim beaks becomes more common there. Selection works ________ on each island.', { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('7', 'A student says: “One mutation can turn a finch into a new species in a single generation.” Explain what is wrong.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('8', 'Why does that step work? In the worked example the sea (the barrier) comes before the two different beak types. Why must the barrier come first?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Describe three ways that isolated groups can become so different that they can no longer interbreed.', { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Time, ancestors and evidence. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`The Isthmus of Panama rose about ${n(N.gen.years)} years ago and split sea animals into two groups. Suppose a generation takes ${N.gen.length} years. How many generations is that?`, `${n(N.gen.years)} ÷ ${N.gen.length} = ${n(R.gen)} generations. Speciation takes a very large number of generations.`]));
  k.push(q('10', `Half-worked. Darwin’s finches came from one ancestor that reached the Galápagos about ${n(N.q10.years)} years ago. Suppose a generation takes ${N.q10.length} years. ${n(N.q10.years)} ÷ ____ = ____ generations.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('11', `Two groups of beetles have been apart for ${n(N.q11.years)} years. A generation takes ${N.q11.length} years. Calculate the number of generations, and say why speciation cannot be watched in one lifetime.`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Describe a real place where a barrier could split a population, such as an island, a lake, a mountain range or a new road, and say what could build up on each side.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('13', 'Fish, chickens and humans all have pharyngeal arches as embryos. Use what you know about speciation to explain why.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('14', 'Kaibab squirrels live only on the north side of the Grand Canyon. They have a white tail and a black belly, but they are still counted as the same species as Abert’s squirrels. Say which steps of speciation have started, and what test would show they are two species.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q13 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F6E7C8' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./the-greatest-show-on-earth-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

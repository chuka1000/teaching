/**
 * Y8 Science, Small Changes, Big Changes, worksheet (8I). The fallback for the game. Per TEMPLATE.md, in each tier a
 * fully worked example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why
 * does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q12). The numbers come
 * from build/small-changes-big-changes-answers.js, so sheet and answers cannot disagree. Answers are printed UPSIDE DOWN on
 * the last page. Allele frequency is a proportion or a percentage; there is no Hardy-Weinberg.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;
const A = require('./small-changes-big-changes-answers');
const { D: N, R } = A;

const LESSON = 'Small Changes, Big Changes';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const head = (right) => new Header({ children: [runs([t('Y8 Science  ·  Natural Selection, Lesson 6  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F2EBDD' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 160 }));
  k.push(boxed(p('Small changes in a gene pool, repeated over a very long time, add up to big changes.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F6E7C8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can define a gene pool.', 'I can explain microevolution as a change in allele frequencies within a population.', 'I can explain macroevolution as large changes over long periods, above the species level.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. An allele frequency is a count turned into a fraction or a percentage: the number of copies of one allele ÷ the total number of alleles in the gene pool.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The gene pool, and allele frequency.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A gene pool has ${N.w.n} alleles for fur colour: ${N.w.a} are for black and ${N.w.b} are for grey.`, `Black: ${N.w.a} ÷ ${N.w.n} = ${N.w.a / N.w.n} = ${R.w[0]}%.  Grey: ${N.w.b} ÷ ${N.w.n} = ${N.w.b / N.w.n} = ${R.w[1]}%.  ${R.w[0]}% + ${R.w[1]}% = 100%.`]));
  k.push(q('1', `Half-worked. A gene pool has ${N.q1.n} alleles for tail length: ${N.q1.a} are for long tails and ${N.q1.b} are for short tails. Long: ${N.q1.a} ÷ ${N.q1.n} = ____ = ____ %.  Short: ____ ÷ ____ = ____ = ____ %.`, { marks: 4 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Define a gene pool.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', `A population has ${N.q3.beetles} beetles. Each beetle has 2 alleles for shell colour. How many alleles are in the gene pool?`, { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('4', `In that gene pool, ${N.q4.brown} of the alleles are for brown shells. Calculate the allele frequency of brown, as a percentage.`, { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('5', 'State what an allele is. Use eye colour as your example.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Microevolution or macroevolution?', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['The percentage of resistant bacteria in a hospital rises from 10% to 60% in 2 years. Ask: is it inside one population, or above the species level? It is one population of bacteria, and what changed is how common an allele is. It is MICROEVOLUTION, even though the change is large.']));
  k.push(q('6', 'Half-worked. Fossils show that over about 375 million years, some fish-like animals gave rise to animals that walk on land. Scale: inside one population, or ____________ ? Time: ____________ . It is ____________ evolution.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Sort each into microevolution or macroevolution.  (a) In a beetle population, the allele for green shells rises from 25% to 60% in 30 generations.  (b) Over millions of years, dinosaurs gave rise to birds.  (c) In Manchester, the dark form of the peppered moth went from rare in 1848 to 98% by 1895.  (d) Over tens of millions of years, small land mammals gave rise to whales.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('8', 'Why does that step work? In Q4 we divide by the number of ALLELES in the pool, not by the number of beetles. Why?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', `A gene pool has ${N.q9.n} alleles. In generation 1, ${N.q9.before} are brown. In generation 20, ${N.q9.after} are brown. Calculate the allele frequency of brown each time, and the change in percentage points. Say which kind of evolution this shows.`, { marks: 4 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning, and past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['Fish, chicken and human embryos all have a tail and pharyngeal arches. If the three kinds of animal were unrelated, there would be no reason for all of them to build the same early features. The simplest explanation is that they all inherited the instructions from a common ancestor that had them. That ancestor lived over 500 million years ago, so this is a pattern of MACROevolution. Later development changes the features: the arches become gills in a fish and parts of the jaw and ear in a human.']));
  k.push(q('10', 'Half-worked. Early fish, chicken and human embryos share a ____________ and ____________ . This suggests they inherited the instructions from a ____________ . A human embryo does not turn into a fish, because ____________________________ .', { marks: 4 }));
  k.push(ruledBox(2));
  k.push(q('11', 'A student says: “Microevolution and macroevolution are two different processes. Macroevolution never happens, because nobody can watch it.” Explain what is wrong, using today’s ideas.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Name a real case where a gene pool changed (for example in bacteria, insects or rats), and say what became more common. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('13', `A population has ${N.q13.beetles} beetles. Each beetle has 2 alleles for shell colour. ${N.q13.brown} of the alleles in the gene pool are brown. Calculate the allele frequency of brown, as a percentage.`, { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('14', `A gene pool has ${N.q14.n} alleles, ${N.q14.brown} of them brown. Birds eat some beetles and ${N.q14.lost} brown alleles are lost. No other alleles are lost and none are added, so the pool gets smaller. What percentage of the new pool is brown?`, { marks: 4 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q11 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F6E7C8' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./small-changes-big-changes-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

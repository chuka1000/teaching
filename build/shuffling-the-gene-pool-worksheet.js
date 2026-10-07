/**
 * Y8 Science, Shuffling The Gene Pool, worksheet (8I). The fallback for the game. Per TEMPLATE.md, in each tier a fully worked
 * example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt
 * (Q8) and one "where would you meet this outside the lesson?" (Q12). The numbers come from build/shuffling-the-gene-pool-answers.js,
 * so sheet and answers cannot disagree. Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('galapagos');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun } = D;
const A = require('./shuffling-the-gene-pool-answers');
const { D: N } = A;

const LESSON = 'Shuffling The Gene Pool';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const head = (right) => new Header({ children: [runs([t('Y8 Science  ·  Natural Selection, Lesson 7  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F2EBDD' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 160 }));
  k.push(boxed(p('Four forces change a gene pool, and one of them is pure chance.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'F6E7C8' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can identify four forces that change allele frequencies.', 'I can describe genetic drift as a random change.', 'I can explain why genetic drift has more effect in small populations.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour. Ask four questions of any scenario: Did a NEW allele appear (mutation)? Did alleles MOVE between populations (gene flow)? Did the TRAIT decide who survived (natural selection)? Or was it CHANCE, with no trait involved (genetic drift)?', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('The four forces.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['Which force? “A storm kills 3 of 4 beetles at random.”', 'A new allele appeared? No. Alleles moved between populations? No. Did the trait decide who survived? No: it was random. So it is chance: GENETIC DRIFT.']));
  k.push(q('1', 'Half-worked. Which force? “Wind blows pollen from one field of flowers to another and carries a new allele with it.” A new allele appeared by a copying mistake? ______. Do alleles move between populations? ______. Force: ______________.', { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Define genetic drift.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'Match each to a force: mutation, gene flow, natural selection or genetic drift.  (a) A beetle is born with an allele neither parent had.  (b) Dark moths survive better against dark trees, so the dark allele becomes common.  (c) A few mice sail to an island and breed with the island mice.  (d) In a tiny group, one pair happens to have many more young than the others, by luck, and no allele helps.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('4', 'Natural selection is not random, but genetic drift is. Explain the difference in one sentence each.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('5', `A gene pool has ${N.q5.before[1]} alleles: ${N.q5.before[0]} are brown. A storm leaves 2 beetles, with ${N.q5.after[1]} alleles, and all ${N.q5.after[0]} are brown. Calculate the allele frequency of brown before and after, as percentages. Name the force.`, { marks: 4 }));
  k.push(ruledBox(3));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Drift, and the size of a population.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A stock bag is half green and half brown. A small population draws 4 beads and gets ${N.w.small[0]} green: ${N.w.small[0]} ÷ ${N.w.small[1]} = 0.75 = 75%, which is 25 points from 50%.`, `A big population draws 20 beads and gets ${N.w.big[0]} green: ${N.w.big[0]} ÷ ${N.w.big[1]} = 0.6 = 60%, which is 10 points from 50%. The small population moved further.`]));
  k.push(q('6', `Half-worked. A small population draws ${N.q6.n} beads and gets ${N.q6.green} green. ____ ÷ ____ = ____ = ____ %.  Distance from 50%: ____ points.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('7', `A big population draws ${N.q7.n} beads and gets ${N.q7.green} green. Calculate the percentage of green, and the distance from 50%.`, { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('8', 'Why does that step work? We turn each count into a percentage before comparing the two populations. Why not compare the number of green beads?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Natural selection or genetic drift?  (a) In a drought, seedlings with an allele for deep roots survive and the others die.  (b) A tree falls on 3 of the 5 mice in a small group. The mice it hits are no different from the others.  Give one question that tells the two apart.', { marks: 4 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Reasoning, and past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['By 1892, hunting had left only about 20 northern elephant seals. With protection there are now over 200,000. Yet they have far less genetic variation than before. Why? The 20 survivors carried only some of the alleles of the original population (a bottleneck). The alleles they did not carry were lost, by chance. The population grew from those 20, so the variation stayed low.']));
  k.push(q('10', 'Half-worked. A population of 50 beetles is cut to 5 by a fire that kills at random. The 5 survivors are a small ____________ sample of the original population, so their allele frequencies will probably ____________ . An allele that none of the 5 carries is ____________ for good, unless it comes back by mutation or ____________ .', { marks: 4 }));
  k.push(ruledBox(2));
  k.push(q('11', 'A student says: “Natural selection and genetic drift both make a population better suited to its environment.” Explain what is wrong.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Name a real small or endangered population, or an isolated island population, where chance could matter, and say why chance matters more when a population is small. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('13', `A gene pool has ${N.q13.n} alleles and ${N.q13.green} are green. A storm kills 5 beetles, taking ${N.q13.lostAlleles} alleles with it, of which ${N.q13.lostGreen} are green. No other alleles are lost and none are added. What percentage of the pool that is left is green? Name the force, and say whether it is random.`, { marks: 5 }));
  k.push(ruledBox(3));
  k.push(q('14', 'The elephant seals have grown back to over 200,000. Explain why a bigger population cannot bring back the alleles that were lost in the bottleneck.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q11 and Q13. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F6E7C8' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./shuffling-the-gene-pool-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

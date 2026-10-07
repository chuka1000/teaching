/**
 * Y7 Science, Technology And Society, worksheet (7B). The same design task as the game, on paper,
 * as a fading scaffold (TEMPLATE.md): in each tier a worked example, a half-worked one, then blank, with a RAG grid,
 * a why prompt and a where-would-you-meet-this question. The answers are
 * printed UPSIDE DOWN on the last page; there is no Answers slide. Briefs come from
 * build/technology-and-society.data.json, the same file the game uses.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, ragGrid, q, boxed, blankBox } = DP;
const { Document, Packer, Paragraph, TableRow, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun } = D;
const DATA = require('./technology-and-society.data.json');

const LESSON = 'Technology And Society';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const B = (id) => DATA.briefs.find((b) => b.id === id);

const head = (right) => new Header({ children: [runs([t('Y7 Science  ·  Technology And Society  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

const list = (items, o = {}) => items.map((x) => p(x, { size: 10.5, after: 20, ...o }));
const frame = (label, lines = 1) => [p(label, { size: 10.5, bold: true, after: 30, color: C.dark }), ruledBox(lines)];

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'F5F8FC' });
  k.push(h1('Technology And Society'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 160 }));
  k.push(boxed(p('Technology solves problems, and technology and society change each other.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'E3EDF6' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can define technology, and say how it differs from science.', 'I can outline the technological design process.', 'I can describe how technology and society change each other.']));
  k.push(runs([t('The task: ', { bold: true, size: 10.5 }), t('design a solution to a problem, the same steps as the game. In each tier read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour.', { size: 10.5 })], { before: 160, after: 100 }));
  k.push(p('Choose ONE design brief and circle it:', { size: 10.5, bold: true, color: C.dark, after: 40 }));
  k.push(...list(['farmer', 'medicine', 'light', 'vaccine', 'canteen', 'water'].map((id, i) => `${String.fromCharCode(65 + i)}   ${B(id).user} needs to ${B(id).need}.`)));
  k.push(p('Choose ONE rule that fits your brief:', { size: 10.5, bold: true, color: C.dark, before: 80, after: 40 }));
  k.push(...list(Object.values(DATA.constraints).map((c, i) => `${i + 1}   ${c}`)));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('State the problem and sketch a solution.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: a heavy school bag. Read it; do not solve it.', ['Problem: students need a way to carry heavy books to school, because a heavy bag strains the back and shoulders.', 'It says who, what is needed, and why. It does NOT say "make a bag with wheels": that is a fix.', 'Sketch labels: wheels (roll the weight along the ground), a handle (lets you pull it), padded straps (spread the load when you must carry it).']));
  k.push(p('', { after: 60 }));
  k.push(q('1', 'Half-worked. Problem, solution or too vague?  (a) "Heavy bags strain students\' backs."  (b) "Make a bag with wheels."  (c) "School bags are bad."   (a) is done for you: it is a PROBLEM.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Half-worked. Finish the problem statement: "A cyclist who rides at night needs a way to be seen by drivers in the dark, because ______________."', { marks: 2 }));
  k.push(ruledBox(1));
  k.push(q('3', 'Write the problem statement for YOUR brief: ______ needs a way to ______, because ______.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('4', 'Why does a problem statement say what is needed, but NOT how to fix it?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'Sketch your solution in the box. Label at least three parts, and say what each part does.', { marks: 4 }));
  k.push(blankBox(2900));
  k.push(p('', { after: 40 }));
  const W3 = [2600, PAGE_W - 2600];
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, after: 0, color: C.dark }), { w, fill: C.headFill });
  k.push(table([new TableRow({ children: [hdr('Part', W3[0]), hdr('What it does', W3[1])] }),
    ...[0, 1, 2].map(() => new TableRow({ height: { value: 420, rule: D.HeightRule.ATLEAST }, children: [cell(p('', { after: 0 }), { w: W3[0] }), cell(p('', { after: 0 }), { w: W3[1] })] }))], W3));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Say how you would test it.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: testing the school bag. Read it; do not solve it.', ['Test it by loading the bag with 5 kg and pulling it 100 m. Measure how tired the carrier feels, from 1 to 5. Repeat 3 times, with the same student and the same path.', 'It works if the mean score is 2 or less. Scores 2, 1 and 3: mean = (2 + 1 + 3) ÷ 3 = 6 ÷ 3 = 2. The mean is 2, so it works.']));
  k.push(p('', { after: 60 }));
  k.push(q('6', 'Half-worked. A different tester scores the bag 3, 4, 2 and 3. Mean = (3 + 4 + 2 + 3) ÷ ___ = ___ ÷ ___ = ___.  Does it meet "mean of 2 or less"? Say how you know.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('7', 'Half-worked. Finish the test plan for the cyclist\'s reflective jacket. The first two parts are done.', { marks: 3 }));
  k.push(p('I will test it by: walking away from a driver in the dark.', { size: 10.5, after: 20 }));
  k.push(p('I will measure: the distance, in metres, at which the driver can see me.', { size: 10.5, after: 40 }));
  k.push(...frame('I will repeat it ___ times, and keep the same ______________________________.', 1));
  k.push(...frame('It works if (give a number) ______________________________.', 1));
  k.push(q('8', 'Now write a test plan for YOUR design. Include all five parts.', { marks: 5 }));
  k.push(...frame('I will test it by', 1));
  k.push(...frame('I will measure (with a unit)', 1));
  k.push(...frame('I will repeat it ___ times, and keep the same', 1));
  k.push(...frame('It works if (give a number)', 1));
  k.push(q('9', 'Explain how your design follows the rule you chose.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Think about society, and improve it.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(box('WORKED EXAMPLE: the fridge. Read it; do not solve it.', ['Society\'s need: people needed to keep food fresh. Technology: the fridge. How society changed: people shop less often and eat more fresh food.', 'Society\'s response: fridge gases (CFCs) damaged the ozone layer, so a law, the 1987 Montreal Protocol, banned them and fridges now use other gases. Technology changed society, then society changed the technology.']));
  k.push(p('', { after: 60 }));
  k.push(q('10', 'Half-worked. Mobile phones. Need: people wanted to talk while away from home. Technology: mobile phones.  How society changed: ______________________.  Society\'s response: ______________________.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('11', 'Your test shows your design works in dry weather but fails when it is wet. Say how you would improve it, and what you would test again.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('12', 'For YOUR design: name one person it would help and one who might be harmed or left out, and say how it could change daily life.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('13', 'Where would you meet this idea outside the lesson? Name a technology you use, the problem it solves, and one way it changed life or one way society changed it. Use your own words.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q8 and Q12. Do not ask it to design your solution for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E3EDF6' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./technology-and-society-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

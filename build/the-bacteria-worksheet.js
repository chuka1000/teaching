/**
 * Y8 Science, The Bacteria, worksheet (8I). Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on purpose
 * (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q10).
 * Every number comes from build/prokaryotes.data.json through build/the-bacteria-answers.js. The three shape drawings are the ones on the slides.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./the-bacteria-answers');
const { DATA } = A;
const S3 = DATA.shapes;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./prokaryotes-sheet')({
  lesson: 'The Bacteria', header: 'Prokaryotes, Lesson 3', answers: A,
  banner: 'Bacteria come in three shapes, and fall into four groups by how they get their energy.',
  criteria: ['I can describe the three shapes of bacterial cell.', 'I can describe the major groups of bacteria.', 'I can explain how bacteria get their energy.'],
});
const { p, runs, t, q, ruled, box, image, cell, table, C, PAGE_W, TableRow, VerticalAlign, AlignmentType } = WS;
const { HeightRule } = WS.DP.D;
const k = WS.begin();

/** Three shape drawings, each with two write-on lines (the name and the plural). */
function shapeRow() {
  const w = Math.floor(PAGE_W / 3);
  const fs = require('fs'), path = require('path');
  const cells = ['shape_coccus', 'shape_bacillus', 'shape_spirillum'].map((f, i) => {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'assets', 'pictures', `${f}.png`));
    return cell([
      new WS.Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new (WS.DP.D.ImageRun)({ type: 'png', data: buf, transformation: { width: 150, height: 100 } })] }),
      runs([t(`${'ABC'[i]}  name: `, { bold: true, size: 10.5, color: C.dark }), t('_'.repeat(14), { color: C.rule, size: 10.5 })], { after: 40 }),
      runs([t('   plural: ', { size: 10.5, color: C.soft }), t('_'.repeat(14), { color: C.rule, size: 10.5 })], { after: 0 }),
    ], { w, valign: VerticalAlign.TOP });
  });
  return table([new TableRow({ cantSplit: true, children: cells })], [w, w, w]);
}

/** A table of rows: [group, how, where]; `given` rows are filled in, the others are blank for the student. */
function groupTable(rows) {
  const w1 = 2100, w2 = Math.floor((PAGE_W - w1) / 2);
  const hd = (x, w) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const out = [new TableRow({ children: [hd('Group', w1), hd('How it gets energy', w2), hd('Example or where it lives', w2)] })];
  rows.forEach(([g, a, b]) => out.push(new TableRow({ cantSplit: true, height: { value: 560, rule: HeightRule.ATLEAST }, children: [
    cell(p(g, { size: 10.5, bold: true, after: 0 }), { w: w1 }),
    cell(p(a || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: a ? 'EFE6EF' : undefined }),
    cell(p(b || '', { size: 10, italic: true, color: C.soft, after: 0 }), { w: w2, fill: b ? 'EFE6EF' : undefined }),
  ] })));
  return table(out, [w1, w2, w2]);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The shapes, the groups and sorting.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'A bacterium is shaped like a ball. What is it called?',
  'A ball is a sphere, so it is a coccus. More than one are cocci.',
]));
k.push(q('1', 'Half-worked. A rod-shaped bacterium is a ______________. More than one are ______________.', { marks: 2 }));
k.push(ruled(1));
k.push(q('2', 'Name each shape and write the plural.', { marks: 6 }));
k.push(shapeRow());
k.push(WS.sp());
k.push(q('3', 'Complete the table. The first row is done for you.', { marks: 6 }));
k.push(groupTable([
  ['photosynthetic', 'makes its own food using light', 'cyanobacteria'],
  ['decomposers', '', ''],
  ['parasites', '', ''],
  ['chemosynthetic', '', ''],
]));
k.push(WS.sp());
k.push(q('4', 'Name the four groups of bacteria.', { marks: 4 }));
k.push(ruled(2));
k.push(q('5', 'Write the group for each. (a) It lives in a rotting log and feeds on it. (b) It makes food using sunlight and gives out oxygen. (c) It lives inside an animal, feeds on it and makes it ill. (d) It lives at a deep-sea vent and makes food using hydrogen sulfide.', { marks: 4 }));
k.push(ruled(3));

/* ---- SILVER ---- */
k.push(...WS.tier('SILVER', 'Compare, explain and check.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'How is a decomposer different from a cyanobacterium?',
  'A decomposer feeds on dead plants and animals. A cyanobacterium makes its own food using light. One takes food from other things, and one makes its own.',
]));
k.push(q('6', 'Half-worked. How is a parasite different from a decomposer? A parasite feeds on a ______________ host. A decomposer feeds on ______________ material.', { marks: 2 }));
k.push(ruled(2));
k.push(q('7', 'Explain why a cyanobacterium does not need to feed on other organisms.', { marks: 2 }));
k.push(ruled(2));
k.push(q('8', 'Why does that step work? Bacteria at a deep-sea vent make food in total darkness. Explain why this is possible.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'A student writes: “A coccus is a rod. The bacteria inside a giant tube worm are parasites.” Find the two mistakes.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet decomposer bacteria outside the lesson? Describe a real place and say what they are feeding on.', { marks: 3 }));
k.push(ruled(3));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Numbers, and what cyanobacteria changed.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `A bacillus is ${S3.rod_um} µm long. How many fit end to end across 1 mm (${n(DATA.size.um_per_mm)} µm)?`,
  `${n(DATA.size.um_per_mm)} ÷ ${S3.rod_um} = ${S3.rod_across} bacilli.`,
]));
k.push(q('11', `Half-worked. A coccus is ${S3.coccus_um} µm across. ${n(DATA.size.um_per_mm)} ÷ ${S3.coccus_um} = ______. So ______ cocci fit in a row across 1 mm.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('12', `A bacterium divides every ${S3.gold_div.gen} minutes. Calculate how many bacteria there are after 3 hours. A calculator is fine.`, { marks: 4 }));
k.push(ruled(3));
k.push(q('13', `A cyanobacterium divides once a day. One cell starts. Calculate how many there are after ${S3.daily.days} days.`, { marks: 3 }));
k.push(ruled(2));
k.push(q('14', 'Cyanobacteria released oxygen for billions of years. Explain why this mattered for animals.', { marks: 3 }));
k.push(ruled(3));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q14. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

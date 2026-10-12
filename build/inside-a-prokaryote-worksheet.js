/**
 * Y8 Science, Inside A Prokaryote, worksheet (8I). Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on
 * purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q10).
 * Every number comes from build/prokaryotes.data.json through build/inside-a-prokaryote-answers.js, so the sheet and the answers cannot disagree.
 * The two cell diagrams are the ones on the slides (build/media/prokaryotes_cells.py), lettered. Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./inside-a-prokaryote-answers');
const { DATA } = A;
const Z = DATA.size;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./prokaryotes-sheet')({
  lesson: 'Inside A Prokaryote', header: 'Prokaryotes, Lesson 1', answers: A,
  banner: 'A prokaryote is an organism whose cell has no nucleus. Its DNA is loose in the cytoplasm.',
  criteria: ['I can define a prokaryote.', 'I can label the parts of a prokaryotic cell.', 'I can name two things a prokaryote has that your cells do not.'],
});
const { p, runs, t, q, ruled, box, image, cell, table, C, PAGE_W, Paragraph, AlignmentType, TableRow, VerticalAlign } = WS;
const { D } = WS.DP;
const { HeightRule } = D;

/** A row of "B ______" blanks for lettered labels. `done` is a { letter: text } map of labels already filled in. */
function blanks(letters, perRow, done = {}) {
  const w = Math.floor(PAGE_W / perRow);
  const rows = [];
  for (let i = 0; i < letters.length; i += perRow) {
    rows.push(new TableRow({ cantSplit: true, height: { value: 520, rule: HeightRule.ATLEAST }, children: letters.slice(i, i + perRow).map((L) => cell(
      runs([t(`${L}  `, { bold: true, size: 12, color: C.dark }), done[L] ? t(done[L], { size: 11, color: C.soft, italic: true }) : t('_'.repeat(17), { color: C.rule, size: 11 })], { after: 0 }), { w, valign: VerticalAlign.CENTER, fill: done[L] ? 'EFE6EF' : undefined })) }));
  }
  return table(rows, Array(perRow).fill(w));
}

const wordBank = (words) => [WS.sp(), ...box('WORD BANK', [words.join('   ·   ')], { fill: 'FFF8E1' })];
const k = WS.begin();

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'The definition and the labels.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'This cell has no nucleus. Its DNA is loose in the cytoplasm. That makes it a prokaryote.',
  'A prokaryote is an organism whose cell has no nucleus. Its DNA is loose in the cytoplasm.',
]));
k.push(q('1', 'Half-worked. A prokaryote is an organism whose cell has no ______________. Its DNA is ______________ in the cytoplasm.', { marks: 2 }));
k.push(ruled(1));
k.push(q('2', 'Name two things a prokaryote has that your cells do not.', { marks: 2 }));
k.push(ruled(1));
k.push(WS.pageBreak());
k.push(q('3', 'Label the prokaryotic cell. A is done for you. Use the word bank.', { marks: 6 }));
k.push(...wordBank(['ribosomes', 'plasmid', 'cell membrane', 'main DNA loop', 'flagellum', 'cytoplasm']));
k.push(image('prok_lettered.png', 390, { keepNext: true }));
k.push(blanks(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 4, { A: 'cell wall' }));
k.push(q('4', 'Label one of your cells. This cell does have a nucleus. Use the word bank.', { marks: 5 }));
k.push(...wordBank(['nucleus', 'cell membrane', 'cytoplasm', 'mitochondrion', 'ribosomes']));
k.push(image('euk_lettered.png', 300, { keepNext: true }));
k.push(blanks(['A', 'B', 'C', 'D', 'E'], 5));
k.push(q('5', 'Which has a nucleus: a prokaryote or one of your cells?', { marks: 1 }));
k.push(ruled(1));

/* ---- SILVER ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('SILVER', 'Compare, sort and explain.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'Is a ribosome in a prokaryote only (P), in your cells only (E), or in both (B)?',
  'Both. Prokaryotes and your cells both make proteins on ribosomes, so the answer is B.',
]));
{
  const w1 = 2400, w2 = Math.floor((PAGE_W - w1) / 2);
  const hd = (x) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w: x === 'Feature' ? w1 : w2, fill: 'EBDDEA' });
  const g = (x) => cell(p(x, { size: 10.5, italic: true, color: C.soft, after: 0 }), { w: w2, fill: 'EFE6EF' });
  const blank = () => cell(p('', { after: 0 }), { w: w2 });
  const f = (x) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w: w1 });
  const row = (a, b, c) => new TableRow({ cantSplit: true, height: { value: 480, rule: HeightRule.ATLEAST }, children: [f(a), b, c] });
  k.push(q('6', 'Half-worked. Complete the table. The first two rows are done for you.', { marks: 5 }));
  k.push(table([
    new TableRow({ children: [hd('Feature'), hd('A prokaryote'), hd('One of your cells')] }),
    row('a nucleus', g('no'), g('yes')),
    row('where the DNA is', g('loose in the cytoplasm'), blank()),
    row('a cell wall', blank(), blank()),
    row('plasmids', blank(), blank()),
    row('a flagellum', blank(), blank()),
    row('size (µm across)', blank(), blank()),
  ], [w1, w2, w2]));
}
k.push(WS.sp());
{
  const items = [['cell membrane'], ['plasmid'], ['nucleus'], ['DNA'], ['cell wall'], ['cytoplasm'], ['mitochondrion'], ['flagellum']];
  const wp = 2700, wl = Math.floor((PAGE_W - 2 * wp) / 2);
  const rows = [];
  for (let i = 0; i < 4; i++) rows.push(new TableRow({ cantSplit: true, height: { value: 460, rule: HeightRule.ATLEAST }, children: [
    cell(p(items[i][0], { size: 10.5, bold: true, after: 0 }), { w: wp }), cell(p('', { after: 0 }), { w: wl }),
    cell(p(items[i + 4][0], { size: 10.5, bold: true, after: 0 }), { w: wp }), cell(p('', { after: 0 }), { w: wl }),
  ] }));
  k.push(q('7', 'Write P (a prokaryote only), E (your cells only) or B (both) for each part.', { marks: 8 }));
  k.push(table(rows, [wp, wl, wp, wl]));
}
k.push(WS.sp());
k.push(q('8', 'Why does that step work? A student writes: “A prokaryote has no nucleus, so it has no DNA.” Explain the mistake.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'Explain why a school microscope cannot show the plasmids or the flagellum of a bacterium.', { marks: 2 }));
k.push(ruled(2));
k.push(q('10', 'Where would you meet prokaryotes outside the lesson? Name two places. Could you see a single cell there?', { marks: 3 }));
k.push(ruled(2));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Sizes, reasons and a question for next time.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `A bacterium is ${Z.bact_um} µm long. 1 mm is ${n(Z.um_per_mm)} µm. How many bacteria fit end to end across 1 mm?`,
  `${n(Z.um_per_mm)} ÷ ${Z.bact_um} = ${Z.across_mm} bacteria.`,
]));
k.push(q('11', `Half-worked. One of your cells is ${Z.cheek_um} µm across. A bacterium is ${Z.bact_um} µm long. ${Z.cheek_um} ÷ ${Z.bact_um} = ______. So ______ bacteria fit across the cell.`, { marks: 3 }));
k.push(ruled(1));
k.push(q('12', `Under a school microscope with a magnification of ×${Z.mag}, a bacterium that is ${Z.bact_um} µm long looks ${Z.bact_um} × ${Z.mag} as long. Calculate how long it looks, in µm and then in mm.`, { marks: 3 }));
k.push(ruled(2));
k.push(q('13', 'A scientist says: “Prokaryotes are simple cells.” Explain why “different” is a better word.', { marks: 3 }));
k.push(ruled(3));
k.push(q('14', 'A bacterium gains a plasmid from another bacterium. Suggest one way this could change the bacterium.', { marks: 2 }));
k.push(ruled(2));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q8 and Q13. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

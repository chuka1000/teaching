/**
 * Y8 Science, How Prokaryotes Live, worksheet (8I). Per TEMPLATE.md, in each tier a fully worked example, a half-worked one, then blanks, mixed on
 * purpose (interleaved), with a RAG grid, one "why does that step work?" prompt (Q8) and one "where would you meet this outside the lesson?" (Q10).
 * Every number comes from build/prokaryotes.data.json through build/how-prokaryotes-live-answers.js, so the sheet and the answers cannot disagree.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const A = require('./how-prokaryotes-live-answers');
const { DATA } = A;
const D = DATA.doubling;
const n = (x) => x.toLocaleString('en-GB');
const WS = require('./prokaryotes-sheet')({
  lesson: 'How Prokaryotes Live', header: 'Prokaryotes, Lesson 2', answers: A,
  banner: 'Prokaryotes are tiny and they divide fast, so they live in almost every habitat.',
  criteria: ['I can list the characteristics all prokaryotes share.', 'I can describe how a prokaryote reproduces.', 'I can explain why prokaryotes are found almost everywhere.'],
});
const { p, runs, t, q, ruled, box, cell, table, C, PAGE_W, TableRow, VerticalAlign } = WS;
const { HeightRule } = WS.DP.D;
const k = WS.begin();

/** The doubling table: time, divisions, bacteria. `given` is how many rows are filled in. */
function doublingTable(given) {
  const w = Math.floor(PAGE_W / 3);
  const hd = (x) => cell(p(x, { size: 10.5, bold: true, after: 0 }), { w, fill: 'EBDDEA' });
  const rows = [new TableRow({ children: [hd('Time (minutes)'), hd('Divisions'), hd('Bacteria')] })];
  D.table.forEach(([m, c], i) => {
    const done = i < given;
    rows.push(new TableRow({ cantSplit: true, height: { value: 420, rule: HeightRule.ATLEAST }, children: [
      cell(p(String(m), { size: 10.5, bold: true, after: 0 }), { w, fill: done ? 'EFE6EF' : undefined }),
      cell(p(done ? String(m / 20) : '', { size: 10.5, color: C.soft, italic: true, after: 0 }), { w, fill: done ? 'EFE6EF' : undefined }),
      cell(p(done ? String(c) : '', { size: 10.5, color: C.soft, italic: true, after: 0 }), { w, fill: done ? 'EFE6EF' : undefined }),
    ] }));
  });
  return table(rows, [w, w, w]);
}

/* ---- BRONZE ---- */
k.push(...WS.tier('BRONZE', 'Doubling, the five characteristics and binary fission.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'One bacterium divides every 20 minutes. How many bacteria are there after 40 minutes?',
  '40 ÷ 20 = 2 divisions. Each division doubles the number, so 2 × 2 = 4 bacteria.',
]));
k.push(q('1', `Half-worked. How many after 1 hour? ${D.h1.minutes} ÷ 20 = ______ divisions. 2 × 2 × 2 = ______ bacteria.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('2', 'Complete the table. The first four rows are done for you. Look for the pattern.', { marks: 3 }));
k.push(doublingTable(4));
k.push(WS.sp());
k.push(q('3', 'List the five things prokaryotes share. One is done for you: very small.', { marks: 4 }));
k.push(ruled(3));
k.push(q('4', 'Describe how a prokaryote reproduces. Use the words DNA, grows and splits.', { marks: 3 }));
k.push(ruled(3));
k.push(q('5', 'Which characteristic is the reason you cannot see a single bacterium without a microscope?', { marks: 1 }));
k.push(ruled(1));

/* ---- SILVER ---- */
k.push(...WS.tier('SILVER', 'Two speeds, a why, and a limit.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  `A bacterium divides every 30 minutes. How many are there after 3 hours?`,
  `3 hours = 180 minutes. ${D.h3_30.minutes} ÷ 30 = ${D.h3_30.divisions} divisions. 2 multiplied by itself ${D.h3_30.divisions} times = ${D.h3_30.cells} bacteria.`,
]));
k.push(q('6', `Half-worked. A bacterium divides every 30 minutes. How many after 2 hours? ${D.h2_30.minutes} ÷ 30 = ______ divisions. 2 × 2 × 2 × 2 = ______ bacteria.`, { marks: 2 }));
k.push(ruled(1));
k.push(q('7', 'Bacterium A divides every 20 minutes. Bacterium B divides every 30 minutes. Each starts as one cell. After 3 hours, which has more, and how many more?', { marks: 4 }));
k.push(ruled(4));
k.push(q('8', 'Why does that step work? In the sums we multiply 2 by itself, once for each division. Explain why we do not add 2 each time.', { marks: 2 }));
k.push(ruled(2));
k.push(q('9', 'A bacterium that divides every 20 minutes does not cover the Earth. Explain why not.', { marks: 3 }));
k.push(ruled(3));
k.push(q('10', 'Where would you meet bacteria multiplying outside the lesson? Describe one real place or time, and say why it happens fast there.', { marks: 3 }));
k.push(ruled(3));

/* ---- GOLD ---- */
k.push(WS.pageBreak());
k.push(...WS.tier('GOLD', 'Big numbers and a full explanation. A calculator is fine.'));
k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [
  'One bacterium divides every 20 minutes. How many after 12 hours?',
  `12 × 60 = ${D.h12.minutes} minutes. ${D.h12.minutes} ÷ 20 = ${D.h12.divisions} divisions. 2^${D.h12.divisions} = ${n(D.h12.cells)}, about 69 billion bacteria.`,
]));
k.push(q('11', `Half-worked. How many after 6 hours? 6 × 60 = ______ minutes. ______ ÷ 20 = ______ divisions. 2^${D.h6.divisions} = ______ bacteria.`, { marks: 3 }));
k.push(ruled(1));
k.push(q('12', 'One bacterium divides every 20 minutes. Calculate how many bacteria there are after 4 hours.', { marks: 3 }));
k.push(ruled(3));
k.push(q('13', 'Show that after 10 hours there are more than a billion (1,000,000,000) bacteria.', { marks: 3 }));
k.push(ruled(3));
k.push(q('14', 'Use the five characteristics to explain why prokaryotes are found in so many places.', { marks: 4 }));
k.push(ruled(4));

WS.write(k, 'Gemini: ask it to check a finished answer, especially Q9 and Q14. Do not ask it to do the question for you.').catch((e) => { console.error(e); process.exit(1); });

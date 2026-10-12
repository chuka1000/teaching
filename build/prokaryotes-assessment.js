/**
 * Prokaryotes assessment for 8I. Three documents, all A4, all BLACK AND WHITE (ASSESSMENT.md):
 *
 *   out/Prokaryotes assessment/Prokaryotes assessment.docx    students sit this
 *   out/Prokaryotes assessment/Prokaryotes mark scheme.docx   TEACHER ONLY
 *   out/Prokaryotes assessment/Prokaryotes feedback.docx      the follow-up lesson
 *
 * 45 marks, 45 minutes. No palette, no media, no timer. The one diagram is the bacterial cell drawn in grey and black
 * (build/media/prokaryotes_cells.py, prok_bw_lettered.png). Content is in prokaryotes-assessment-content.js; numbers were checked
 * with sympy in prokaryotes-assessment-check.py. Run `python3 build/media/prokaryotes_cells.py` first if the diagram is missing.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('bw');
const { D, C, FONT, PAGE_W, p, runs, t } = DP;
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
        TabStopType, LeaderType, LineRuleType, ImageRun, Header, Footer, PageNumber, HeightRule, VerticalAlign, PageBreak } = D;
const { QUESTIONS, FEEDBACK, TOTAL, n: fmt } = require('./prokaryotes-assessment-content');

const TITLE = 'Prokaryotes';
const OUT = path.join(__dirname, '..', 'out', `${TITLE} assessment`);
fs.mkdirSync(OUT, { recursive: true });
const IMG = (f) => path.join(__dirname, '..', 'assets', /^prok_|^euk_/.test(f) ? 'pictures' : 'assessment', f);

const NB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NONE4 = { top: NB, bottom: NB, left: NB, right: NB };
const BOX = (sz = 6, col = '000000') => ({ style: BorderStyle.SINGLE, size: sz, color: col });
const BOX4 = (sz, col) => ({ top: BOX(sz, col), bottom: BOX(sz, col), left: BOX(sz, col), right: BOX(sz, col) });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const header = (text) => new Header({ children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: 17, color: '444444' })] })] });
const footer = (extra = '') => new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }],
  children: [new TextRun({ text: extra, font: FONT, size: 16, color: '444444' }), new TextRun({ text: '\tPage ', font: FONT, size: 16, color: '444444' }),
             new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '444444' })],
})] });

/** a picture as an inline image; `type: 'png'` is required or Word shows nothing */
function pic(file, widthIn) {
  const b = fs.readFileSync(IMG(file));
  const iw = b.readUInt32BE(16), ih = b.readUInt32BE(20);
  const w = Math.round(widthIn * 96), h = Math.round(w * ih / iw);
  return new ImageRun({ type: 'png', data: b, transformation: { width: w, height: h },
    altText: { name: file, title: file.replace('.png', '').replace(/_/g, ' '), description: 'Diagram for the question' } });
}
const picPara = (file, widthIn, o = {}) => new Paragraph({ alignment: o.align ?? AlignmentType.CENTER, spacing: { before: o.before ?? 60, after: o.after ?? 80 }, keepNext: o.keepNext, children: [pic(file, widthIn)] });

/** one question kept in one piece: a one-cell table whose row cannot split across a page break */
function block(children, width = PAGE_W) {
  return new Table({
    columnWidths: [width], width: { size: width, type: WidthType.DXA },
    borders: { ...NONE4, insideHorizontal: NB, insideVertical: NB },
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: width, type: WidthType.DXA }, borders: NONE4, margins: { top: 0, bottom: 40, left: 0, right: 0 }, children })] })],
  });
}
const spacer = (after = 200) => new Paragraph({ spacing: { before: 0, after }, children: [] });

/** "(a) text ....... [2]" with the marks right-aligned at the end of the part */
function partLine(label, text, marks, o = {}) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: o.width ?? PAGE_W }],
    spacing: { before: 100, after: 60 }, keepNext: true, keepLines: true,
    indent: label ? { left: 520, hanging: 520 } : undefined,
    children: [
      ...(label ? [new TextRun({ text: `${label}\t`, font: FONT, size: 22, bold: true })] : []),
      new TextRun({ text, font: FONT, size: 22 }),
      ...(marks ? [new TextRun({ text: `\t[${marks}]`, font: FONT, size: 22, bold: true })] : []),
    ],
  });
}
const stemPara = (text) => new Paragraph({ spacing: { before: 0, after: 80 }, keepNext: true, keepLines: true, children: [new TextRun({ text, font: FONT, size: 22 })] });
const qNumPara = (n, marks) => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 0, after: 80 }, keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 2 } },
  children: [new TextRun({ text: `Question ${n}`, font: FONT, size: 24, bold: true }), new TextRun({ text: `\t${marks} marks`, font: FONT, size: 20, color: '444444' })],
});
const answerLine = (prefix, unit = '') => new Paragraph({ spacing: { before: 100, after: 60 }, children: [
  new TextRun({ text: prefix, font: FONT, size: 22 }), new TextRun({ text: ' ' + '_'.repeat(22) + (unit ? ' ' : ''), font: FONT, size: 22, color: '444444' }), ...(unit ? [new TextRun({ text: unit, font: FONT, size: 22 })] : [])] });

/** Writing lines are pictures (see DP.writeLines): tab leaders and borders vanish in Google Docs and Pages. */
const writeLines = DP.writeLines;

/**
 * The matching list as a real table with invisible borders: organisms on the left, the
 * jobs on the right, left-justified as a second column, with a gap to draw lines across.
 * It sits at the top level of the page (never inside another table: nested tables are
 * flattened by some viewers).
 */
function matchTable(left, right, width = PAGE_W) {
  const side = Math.floor(width * 0.42), gap = width - 2 * side;
  const cellP = (text, bold) => new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text, font: FONT, size: 23, bold })] });
  const tc = (w, text, bold) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: NONE4, verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 60, right: 60 }, children: [cellP(text, bold)] });
  return new Table({ columnWidths: [side, gap, side], width: { size: width, type: WidthType.DXA }, borders: { ...NONE4, insideHorizontal: NB, insideVertical: NB },
    rows: left.map((l, i) => new TableRow({ cantSplit: true, height: { value: 900, rule: HeightRule.ATLEAST }, children: [tc(side, l, false), tc(gap, '', false), tc(side, right[i], true)] })) });
}

/** the same list in a narrow feedback cell (no nesting allowed): the job on its own line, right-aligned */
function stackMatch(left, right, o = {}) {
  const size = o.size ?? 19;
  return left.flatMap((l, i) => [
    new Paragraph({ spacing: { before: 60, after: 0 }, keepNext: true, children: [new TextRun({ text: l, font: FONT, size })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 100 }, children: [new TextRun({ text: right[i], font: FONT, size, bold: true })] }),
  ]);
}

/** a small two-column data list (year, population) in the same tab-aligned way */
function tabTable(rows, o = {}) {
  const pos = o.pos ?? 1800;
  return rows.map((r, i) => new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: pos }], spacing: { before: 0, after: 40 }, keepLines: true,
    children: [new TextRun({ text: r[0], font: FONT, size: 19, bold: i === 0 }), new TextRun({ text: '\t', font: FONT, size: 19 }), new TextRun({ text: r[1], font: FONT, size: 19, bold: i === 0 })],
  }));
}


/** Q3(a): a table, one row per cell, with an empty box to tick under each heading (no colour: borders only). */
function classifyTable(rows) {
  const w1 = PAGE_W - 520 - 3 * 1500, cols = ['Bacterium', 'Archaean', 'Neither'];
  const tc = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 80, bottom: 80, left: 90, right: 90 },
    children: [new Paragraph({ alignment: o.center ? AlignmentType.CENTER : AlignmentType.LEFT, children: [new TextRun({ text: txt, font: FONT, size: 21, bold: o.bold })] })] });
  return new Table({ columnWidths: [520, w1, 1500, 1500, 1500], width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    new TableRow({ children: [tc('', 520, { fill: 'E6E6E6' }), tc('Cell', w1, { fill: 'E6E6E6', bold: true }), ...cols.map((c) => tc(c, 1500, { fill: 'E6E6E6', bold: true, center: true }))] }),
    ...rows.map((r, i) => new TableRow({ cantSplit: true, height: { value: 640, rule: HeightRule.ATLEAST }, children: [tc(`${i + 1}`, 520, { bold: true, center: true }), tc(r, w1), tc('', 1500), tc('', 1500), tc('', 1500)] })),
  ] });
}
/** Q4(a): the doubling table with two rows given and the rest to complete. */
function doublingTable(given, missing) {
  const NUMS = { 0: 1, 20: 2, 40: 4, 60: 8, 80: 16 };
  const w = Math.floor(PAGE_W * 0.34);
  const tc = (txt, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 70, bottom: 70, left: 90, right: 90 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: txt, font: FONT, size: 21, bold: o.bold })] })] });
  return new Table({ columnWidths: [w, w], width: { size: 2 * w, type: WidthType.DXA }, rows: [
    new TableRow({ children: [tc('Time (minutes)', { fill: 'E6E6E6', bold: true }), tc('Number of bacteria', { fill: 'E6E6E6', bold: true })] }),
    ...[...given, ...missing].map((m) => new TableRow({ cantSplit: true, height: { value: 520, rule: HeightRule.ATLEAST }, children: [tc(String(m)), tc(given.includes(m) ? String(NUMS[m]) : '')] })),
  ] });
}

/* =================================================================== *
 * 1. THE PAPER
 * =================================================================== */
function paper() {
  const k = [];
  // ---- front page ----
  k.push(new Paragraph({ spacing: { before: 400, after: 60 }, children: [new TextRun({ text: 'Year 8 Science', font: FONT, size: 26, color: '444444' })] }));
  k.push(new Paragraph({ spacing: { before: 0, after: 200 }, children: [new TextRun({ text: `${TITLE} assessment`, font: 'Georgia', size: 64, bold: true })] }));
  const fld = (label) => new Paragraph({ spacing: { before: 160, after: 60 }, children: [
    new TextRun({ text: `${label}  `, font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(48), font: FONT, size: 24, color: '666666' })] });
  k.push(fld('Name'));
  k.push(new Paragraph({ spacing: { before: 160, after: 60 }, children: [
    new TextRun({ text: 'Class  ', font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(16), font: FONT, size: 24, color: '666666' }),
    new TextRun({ text: '      Date  ', font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(22), font: FONT, size: 24, color: '666666' })] }));
  k.push(spacer(240));
  const info = (a, b) => new TableRow({ children: [
    new TableCell({ width: { size: 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: a, font: FONT, size: 22, bold: true })] })] }),
    new TableCell({ width: { size: PAGE_W - 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: b, font: FONT, size: 22 })] })] }) ] });
  k.push(new Table({ columnWidths: [3200, PAGE_W - 3200], width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    info('Total marks', `${TOTAL}`), info('Time allowed', '45 minutes'), info('Materials', 'Blue or black pen, pencil, ruler') ] }));
  k.push(spacer(200));
  k.push(p('Answer all questions.', { size: 12, bold: true, after: 40 }));
  k.push(p('Show your working.', { size: 12, bold: true, after: 40 }));
  k.push(p('The number of marks for each part is shown in brackets at the end of the part. One mark is worth about one minute. The number of lines is a guide to how much to write.', { size: 11, after: 240 }));
  // marks grid
  const w1 = 2300, wq = Math.floor((PAGE_W - w1 - 1100) / QUESTIONS.length), wt = PAGE_W - w1 - wq * QUESTIONS.length;
  const gcell = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 70, bottom: 70, left: 60, right: 60 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text: String(txt), font: FONT, size: 19, bold: o.bold })] })] });
  k.push(new Table({ columnWidths: [w1, ...QUESTIONS.map(() => wq), wt], width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    new TableRow({ children: [gcell('Question', w1, { bold: true, fill: 'E6E6E6', left: true }), ...QUESTIONS.map((q) => gcell(q.n, wq, { bold: true, fill: 'E6E6E6' })), gcell('Total', wt, { bold: true, fill: 'E6E6E6' })] }),
    new TableRow({ children: [gcell('Marks available', w1, { left: true }), ...QUESTIONS.map((q) => gcell(q.marks, wq)), gcell(TOTAL, wt, { bold: true })] }),
    new TableRow({ height: { value: 640, rule: HeightRule.ATLEAST }, children: [gcell('Marks awarded', w1, { left: true }), ...QUESTIONS.map(() => gcell('', wq)), gcell('', wt)] }),
  ] }));
  k.push(new Paragraph({ children: [new PageBreak()] }));

  // ---- the questions ----
  QUESTIONS.forEach((q, qi) => {
    const c = [qNumPara(q.n, q.marks)];
    if (q.stem) c.push(stemPara(q.stem));
    if (q.image) c.push(picPara(q.image, q.imageW, { keepNext: true }));
        q.parts.forEach((pt) => {
      if (pt.kind === 'match') return;
      c.push(partLine(pt.l, pt.t, pt.m));
      if (pt.kind === 'labels') pt.letters.forEach((L) => c.push(answerLine(`${L}`)));
      else if (pt.kind === 'classify') c.push(classifyTable(pt.rows));
      else if (pt.kind === 'tablefill') c.push(doublingTable(pt.given, pt.missing));
      else if (pt.kind === 'calc') { c.push(...writeLines(2)); c.push(answerLine('Number of bacteria =')); }
      else if (pt.kind === 'calc1') c.push(answerLine('Number of resistant bacteria ='));
      else if (pt.space) c.push(...writeLines(pt.space));
    });
    k.push(block(c));
    k.push(spacer(qi === QUESTIONS.length - 1 ? 120 : 260));
  });
  k.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Total for this paper: ${TOTAL} marks`, font: FONT, size: 22, bold: true })] }));
  k.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'END OF PAPER', font: FONT, size: 20, bold: true, color: '444444' })] }));

  return new Document({
    creator: 'Chuka', title: `${TITLE} assessment`,
    styles: { default: { document: { run: { font: FONT, size: 22, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header(`Year 8 Science  ·  ${TITLE} assessment`) }, footers: { default: footer() }, children: k }],
  });
}

/* =================================================================== *
 * 2. THE MARK SCHEME (TEACHER ONLY)
 * =================================================================== */
function markScheme() {
  const k = [];
  k.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'TEACHER ONLY. DO NOT GIVE TO STUDENTS.', font: FONT, size: 22, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `${TITLE} assessment: mark scheme`, font: 'Georgia', size: 40, bold: true })] }));
  k.push(p(`Year 8 Science, class 8I. ${TOTAL} marks, 45 minutes. One mark point per line, each ending in a semicolon. "Accept" and "Reject" lists apply where the wording varies. Allow error carried forward (ECF) only where the question says so. Every numeric answer was checked with sympy (build/prokaryotes-assessment-check.py).`, { size: 10.5, after: 160 }));

  // coverage and skills
  const cw = [700, 900, 3100, PAGE_W - 4700];
  const head = (txts, ws) => new TableRow({ tableHeader: true, children: txts.map((x, i) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders: BOX4(4, '000000'),
    shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text: x, font: FONT, size: 19, bold: true })] })] })) });
  const cellT = (lines, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, verticalAlign: VerticalAlign.TOP,
    children: (Array.isArray(lines) ? lines : [lines]).map((x) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: x, font: FONT, size: o.size || 20, bold: o.bold })] })) });
  const SKILL = { 1: 'definitions (recall)', 2: 'read and label a diagram; recall', 3: 'classify (table); explain in an unfamiliar context', 4: 'complete a table; calculation',
    5: 'recall; describe a process', 6: 'recall; apply to three contexts', 7: 'explain why; recall', 8: 'explain why; recall', 9: 'calculation; extended explanation (6 marks)', 10: 'diagnose two misconceptions' };
  k.push(p('Coverage', { size: 12, bold: true, after: 60, keepNext: true }));
  k.push(new Table({ columnWidths: cw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    head(['Q', 'Marks', 'Lesson tested', 'Skill'], cw),
    ...QUESTIONS.map((q) => new TableRow({ cantSplit: true, children: [cellT(String(q.n), cw[0], { bold: true }), cellT(String(q.marks), cw[1]), cellT(q.lesson, cw[2]), cellT(SKILL[q.n], cw[3])] })),
  ] }));
  k.push(p('The paper opens with recall (Q1 and Q2, 10 marks), moves to classification, calculation and the groups and uses of bacteria (Q3 to Q7, 21 marks) and ends with antibiotics, the explanation of resistance (Q9, 7 marks, the heaviest question) and two misconceptions to diagnose (Q8 to Q10, 14 marks). Each of the six lessons is tested and nothing outside them is. There are no Latin species names anywhere in the paper.', { size: 10, italic: true, before: 100, after: 200 }));

  // one block per question
  const mw = [700, PAGE_W - 700 - 900, 900];
  QUESTIONS.forEach((q) => {
    const rows = [head(['Part', 'Mark points', 'Marks'], mw)];
    q.ms.forEach((m) => {
      const part = q.parts.find((x) => x.l === m.l) || q.parts[0];
      const lines = [...m.pts, ...(m.note ? [m.note] : [])];
      rows.push(new TableRow({ cantSplit: true, children: [
        cellT(m.l || '', mw[0], { bold: true }),
        new TableCell({ width: { size: mw[1], type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: [
          ...m.pts.map((x) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: x, font: FONT, size: 20 })] })),
          ...(m.note ? [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: m.note, font: FONT, size: 18, italics: true, color: '333333' })] })] : []) ] }),
        cellT(String(part.m), mw[2], { bold: true }) ] }));
    });
    k.push(new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 200, after: 80 }, keepNext: true,
      children: [new TextRun({ text: `Question ${q.n}`, font: FONT, size: 24, bold: true }), new TextRun({ text: `\t${q.marks} marks  ·  ${q.lesson}`, font: FONT, size: 19, color: '444444' })] }));
    k.push(new Table({ columnWidths: mw, width: { size: PAGE_W, type: WidthType.DXA }, rows }));
    k.push(new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Likely wrong answer: ', font: FONT, size: 19, bold: true }), new TextRun({ text: q.wrong, font: FONT, size: 19 })] }));
  });

  // feedback routing and variant answers
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Feedback variants: answers', font: 'Georgia', size: 36, bold: true })] }));
  k.push(p('Send each student to the variant that matches their mark on that question. Full marks: Extend (E). At least two thirds of the marks: Consolidate (C). Fewer than two thirds: Support (S). The "likely wrong answer" lines above tell you which questions to expect trouble on, so you can plan the lesson before the papers are marked. The sheet is a bank, not a worklist: a student does the two or three variants that match their errors.', { size: 10, after: 100 }));
  const fw = [600, Math.floor((PAGE_W - 600) / 3), Math.floor((PAGE_W - 600) / 3), PAGE_W - 600 - 2 * Math.floor((PAGE_W - 600) / 3)];
  k.push(new Table({ columnWidths: fw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    head(['Q', 'Support (S)', 'Consolidate (C)', 'Extend (E)'], fw),
    ...FEEDBACK.map((f) => new TableRow({ cantSplit: true, children: [cellT(String(f.n), fw[0], { bold: true }), cellT(f.S.a, fw[1], { size: 17 }), cellT(f.C.a, fw[2], { size: 17 }), cellT(f.E.a, fw[3], { size: 17 })] })),
  ] }));

  return new Document({
    creator: 'Chuka', title: `${TITLE} mark scheme`,
    styles: { default: { document: { run: { font: FONT, size: 20, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header('TEACHER ONLY  ·  Year 8 Science  ·  Prokaryotes mark scheme') }, footers: { default: footer('TEACHER ONLY') }, children: k }],
  });
}

/* =================================================================== *
 * 3. THE FEEDBACK SHEET (student-facing, landscape, no answers)
 * =================================================================== */
function feedback() {
  const LW = 16838 - 2 * 900;                    // usable width in landscape
  const qw = 700, vw = Math.floor((LW - qw) / 3), last = LW - qw - 2 * vw;
  const k = [];
  k.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${TITLE}: feedback lesson`, font: 'Georgia', size: 44, bold: true })] }));
  k.push(p('Find your question number down the left. Do the variant your teacher tells you: S (Support) if you lost several marks, C (Consolidate) if you were close, E (Extend) if you got full marks. Answer in your book. You will not do every question. Do the two or three that match your mistakes.', { size: 11, after: 100 }));
  const gc = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 60, bottom: 60, left: 70, right: 70 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text: String(txt), font: FONT, size: 19, bold: o.bold })] })] });
  const gw = Math.floor((LW - 2400) / QUESTIONS.length);
  k.push(new Table({ columnWidths: [2400, ...QUESTIONS.map(() => gw)], width: { size: 2400 + gw * QUESTIONS.length, type: WidthType.DXA }, rows: [
    new TableRow({ children: [gc('Question', 2400, { fill: 'E6E6E6', bold: true, left: true }), ...QUESTIONS.map((q) => gc(q.n, gw, { fill: 'E6E6E6', bold: true }))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My mark', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My variant (S, C or E)', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] }),
  ] }));
  k.push(spacer(140));

  const small = (txt, o = {}) => new Paragraph({ spacing: { before: 0, after: 70 }, keepLines: true, children: [new TextRun({ text: txt, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italic })] });
  const variantCell = (v, w) => {
    const kids = [];
    if (v.img) kids.push(picPara(v.img, v.imgW || 3.0, { before: 0, after: 60 }));
    if (v.table) kids.push(...tabTable(v.table), new Paragraph({ spacing: { after: 60 }, children: [] }));
    v.t.forEach((x, i) => kids.push(small(x, { italic: /^Box:/.test(x), size: /^Box:/.test(x) ? 18 : 20 })));
    if (v.match) kids.push(...stackMatch(v.match.left, v.match.right));
    return new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 90, bottom: 90, left: 120, right: 120 }, verticalAlign: VerticalAlign.TOP, children: kids });
  };
  const headRow = new TableRow({ tableHeader: true, children: [gc('Q', qw, { fill: 'E6E6E6', bold: true }), gc('S  Support', vw, { fill: 'E6E6E6', bold: true }), gc('C  Consolidate', vw, { fill: 'E6E6E6', bold: true }), gc('E  Extend', last, { fill: 'E6E6E6', bold: true })] });
  const rows = FEEDBACK.map((f) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: qw, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.TOP, margins: { top: 90, bottom: 90, left: 60, right: 60 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(f.n), font: FONT, size: 30, bold: true })] })] }),
    variantCell(f.S, vw), variantCell(f.C, vw), variantCell(f.E, last) ] }));
  k.push(new Table({ columnWidths: [qw, vw, vw, last], width: { size: LW, type: WidthType.DXA }, rows: [headRow, ...rows] }));

  return new Document({
    creator: 'Chuka', title: `${TITLE} feedback`,
    styles: { default: { document: { run: { font: FONT, size: 20, color: '000000' } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838, orientation: D.PageOrientation.LANDSCAPE }, margin: { top: 900, bottom: 900, left: 900, right: 900 } } },
      headers: { default: header('Year 8 Science  ·  Prokaryotes feedback') }, footers: { default: footer() }, children: k }],
  });
}

(async () => {
  for (const [name, doc] of [['assessment', paper()], ['mark scheme', markScheme()], ['feedback', feedback()]]) {
    const buf = await Packer.toBuffer(doc);
    const file = `${TITLE} ${name}.docx`;
    fs.writeFileSync(path.join(OUT, file), buf);
    console.log('written:', file, Math.round(buf.length / 1024) + ' KB');
  }
})();

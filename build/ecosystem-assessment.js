/**
 * Ecosystems assessment for 9I and 9G (same course, same paper). Three
 * documents, all A4, all BLACK AND WHITE (ASSESSMENT.md):
 *
 *   out/Ecosystems assessment/Ecosystems assessment.docx    students sit this
 *   out/Ecosystems assessment/Ecosystems mark scheme.docx   TEACHER ONLY
 *   out/Ecosystems assessment/Ecosystems feedback.docx      the follow-up lesson
 *
 * 45 marks, 45 minutes. No palette, no media, no timer. Diagrams are pure black
 * on white (build/ecosystem-assessment-diagrams.py). Content is in
 * ecosystem-assessment-content.js; numbers were checked with sympy in
 * ecosystem-assessment-check.py.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('bw');
const { D, C, FONT, PAGE_W, p, runs, t } = DP;
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
        TabStopType, LeaderType, LineRuleType, ImageRun, Header, Footer, PageNumber, HeightRule, VerticalAlign, PageBreak } = D;
const { QUESTIONS, FEEDBACK, MATCH, TOTAL } = require('./ecosystem-assessment-content');

const TITLE = 'Ecosystems';
const OUT = path.join(__dirname, '..', 'out', `${TITLE} assessment`);
fs.mkdirSync(OUT, { recursive: true });
const IMG = (f) => path.join(__dirname, '..', 'assets', 'assessment', f);

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

/**
 * Writing lines. NOT a table: each line is one paragraph with a right tab whose
 * leader is an underscore, so the line is drawn by the tab and needs no border
 * or nested table. (Nested tables with borders did not render in every viewer:
 * students saw empty space where the lines should be.)
 */
function writeLines(n, width = PAGE_W, o = {}) {
  return Array.from({ length: n }, (_, i) => new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: width, leader: LeaderType.UNDERSCORE }],
    spacing: { before: 0, after: 0, line: 480, lineRule: LineRuleType.EXACT },
    keepNext: o.keepNext ?? true, keepLines: true,
    children: [new TextRun({ text: '\t', font: FONT, size: 22, color: '595959' })],
  }));
}

/**
 * A two-column list with the second column left-justified at a fixed tab stop,
 * used for matching questions. Also not a table: the students draw a line
 * across the gap from each item on the left to its partner on the right.
 */
function tabMatch(left, right, o = {}) {
  const pos = o.pos ?? 6200, size = o.size ?? 22, after = o.after ?? 440;
  return left.map((l, i) => new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: pos }],
    spacing: { before: 0, after }, keepNext: true, keepLines: true,
    children: [new TextRun({ text: l, font: FONT, size }), new TextRun({ text: '\t', font: FONT, size }), new TextRun({ text: right[i], font: FONT, size, bold: true })],
  }));
}

/** a small two-column data list (year, population) in the same tab-aligned way */
function tabTable(rows, o = {}) {
  const pos = o.pos ?? 1800;
  return rows.map((r, i) => new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: pos }], spacing: { before: 0, after: 40 }, keepLines: true,
    children: [new TextRun({ text: r[0], font: FONT, size: 19, bold: i === 0 }), new TextRun({ text: '\t', font: FONT, size: 19 }), new TextRun({ text: r[1], font: FONT, size: 19, bold: i === 0 })],
  }));
}

/* =================================================================== *
 * 1. THE PAPER
 * =================================================================== */
function paper() {
  const k = [];
  // ---- front page ----
  k.push(new Paragraph({ spacing: { before: 400, after: 60 }, children: [new TextRun({ text: 'Year 9 Science', font: FONT, size: 26, color: '444444' })] }));
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
    if (q.n === 2) c.push(...tabMatch(MATCH.left, MATCH.right));
    q.parts.forEach((pt) => {
      if (pt.kind === 'match') return;
      c.push(partLine(pt.l, pt.t, pt.m));
      if (pt.kind === 'calcA') c.push(answerLine('Energy =', 'kJ'));
      else if (pt.kind === 'calcB') { c.push(...writeLines(3)); c.push(answerLine('Energy =')); }
      else if (pt.kind === 'abc') ['A', 'B', 'C'].forEach((L) => c.push(answerLine(`${L}`)));
      else if (pt.kind === 'drawn') c.push(new Paragraph({ spacing: { before: 0, after: 40 }, indent: { left: 520 }, children: [new TextRun({ text: 'Draw on the diagram.', font: FONT, size: 18, italics: true, color: '444444' })] }));
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
    sections: [{ properties: { page: A4 }, headers: { default: header(`Year 9 Science  ·  ${TITLE} assessment`) }, footers: { default: footer() }, children: k }],
  });
}

/* =================================================================== *
 * 2. THE MARK SCHEME (TEACHER ONLY)
 * =================================================================== */
function markScheme() {
  const k = [];
  k.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'TEACHER ONLY. DO NOT GIVE TO STUDENTS.', font: FONT, size: 22, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `${TITLE} assessment: mark scheme`, font: 'Georgia', size: 40, bold: true })] }));
  k.push(p(`Year 9 Science, classes 9I and 9G. ${TOTAL} marks, 45 minutes. One mark point per line, each ending in a semicolon. "Accept" and "Reject" lists apply where the wording varies. Allow error carried forward (ECF) only where the question says so. Every numeric answer was checked with sympy (build/ecosystem-assessment-check.py).`, { size: 10.5, after: 160 }));

  // coverage and skills
  const cw = [700, 900, 3100, PAGE_W - 4700];
  const head = (txts, ws) => new TableRow({ tableHeader: true, children: txts.map((x, i) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders: BOX4(4, '000000'),
    shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text: x, font: FONT, size: 19, bold: true })] })] })) });
  const cellT = (lines, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, verticalAlign: VerticalAlign.TOP,
    children: (Array.isArray(lines) ? lines : [lines]).map((x) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: x, font: FONT, size: o.size || 20, bold: o.bold })] })) });
  const SKILL = { 1: 'definition; explain (biotic or abiotic)', 2: 'classify (drawn lines)', 3: 'recall an equation; where mass comes from', 4: 'read a diagram; draw arrows; food chain',
    5: 'calculation with units', 6: 'read a graph; calculation; describe a shape', 7: 'explain why; diagnose a misconception', 8: 'diagnose two misconceptions',
    9: 'complete a diagram; explain why', 10: 'unfamiliar context; explain why' };
  k.push(p('Coverage', { size: 12, bold: true, after: 60, keepNext: true }));
  k.push(new Table({ columnWidths: cw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    head(['Q', 'Marks', 'Lesson tested', 'Skill'], cw),
    ...QUESTIONS.map((q) => new TableRow({ cantSplit: true, children: [cellT(String(q.n), cw[0], { bold: true }), cellT(String(q.marks), cw[1]), cellT(q.lesson, cw[2]), cellT(SKILL[q.n], cw[3])] })),
  ] }));
  k.push(p('The paper opens with recall (Q1 to Q3, 10 marks), moves to application, calculation and data (Q4 to Q7, 20 marks) and ends with diagnosis, explanation and an unfamiliar context (Q8 to Q10, 15 marks). Each lesson is tested and nothing outside them is. There are no place names, person names or local-language words anywhere in the paper, and the population data is for the world as a whole.', { size: 10, italic: true, before: 100, after: 200 }));

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
    sections: [{ properties: { page: A4 }, headers: { default: header('TEACHER ONLY  ·  Year 9 Science  ·  Ecosystems mark scheme') }, footers: { default: footer('TEACHER ONLY') }, children: k }],
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
    if (v.match) kids.push(...tabMatch(v.match.left, v.match.right, { pos: 2700, size: 19, after: 200 }));
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
      headers: { default: header('Year 9 Science  ·  Ecosystems feedback') }, footers: { default: footer() }, children: k }],
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

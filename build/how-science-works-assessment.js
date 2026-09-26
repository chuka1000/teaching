/**
 * How Science Works assessment for 7B. Three documents, all A4, all BLACK AND
 * WHITE (ASSESSMENT.md):
 *
 *   out/How Science Works assessment/How Science Works assessment.docx   students sit this
 *   out/How Science Works assessment/How Science Works mark scheme.docx  TEACHER ONLY
 *   out/How Science Works assessment/How Science Works feedback.docx     the follow-up lesson
 *
 * 45 marks, 45 minutes. No palette, no media, no timer. It is their FIRST exam of

 * the year, so the cover carries a short list of instructions and every part says what to do. Content is in how-science-works-assessment-content.js;
 * numbers were checked with sympy in how-science-works-assessment-check.py.
 *
 * Viewer-safe (Google Docs and Pages drop tab leaders and cell borders inside
 * tables): writing lines are pictures (DP.writeLines), gap lines are underscores,
 * the tick box is a picture, and each question is a one-cell wrapper holding
 * only paragraphs and pictures, never a table inside a table.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('bw');
const { D, FONT, PAGE_W, p } = DP;
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
        TabStopType, ImageRun, Header, Footer, PageNumber, HeightRule, VerticalAlign, PageBreak } = D;
const { QUESTIONS, FEEDBACK, TOTAL, LET } = require('./how-science-works-assessment-content');

const TITLE = 'How Science Works';
const OUT = path.join(__dirname, '..', 'out', `${TITLE} assessment`);
fs.mkdirSync(OUT, { recursive: true });
const IMG = (f) => path.join(__dirname, '..', 'assets', 'assessment', 'hsw', f);

const NB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NONE4 = { top: NB, bottom: NB, left: NB, right: NB };
const BOX = (sz = 6, col = '000000') => ({ style: BorderStyle.SINGLE, size: sz, color: col });
const BOX4 = (sz, col) => ({ top: BOX(sz, col), bottom: BOX(sz, col), left: BOX(sz, col), right: BOX(sz, col) });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const SZ = 22;                                    // 11 pt body

const header = (text) => new Header({ children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: 17, color: '444444' })] })] });
const footer = (extra = '') => new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }],
  children: [new TextRun({ text: extra, font: FONT, size: 16, color: '444444' }), new TextRun({ text: '\tPage ', font: FONT, size: 16, color: '444444' }),
             new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '444444' })],
})] });

/** text with **bold** markup */
function rich(text, o = {}) {
  return String(text).split('**').map((seg, i) => new TextRun({ text: seg, font: FONT, size: o.size ?? SZ, bold: o.bold || i % 2 === 1, italics: o.italics, color: o.color }))
    .filter((r, i, a) => !(i === a.length - 1 && r.root && false));
}

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

const IND = 520;
const partLine = (label, text, marks, o = {}) => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 110, after: 60 }, keepNext: true, keepLines: true,
  indent: label ? { left: IND, hanging: IND } : undefined,
  children: [...(label ? [new TextRun({ text: `${label}\t`, font: FONT, size: SZ, bold: true })] : []), ...rich(text),
             ...(marks ? [new TextRun({ text: `\t[${marks}]`, font: FONT, size: SZ, bold: true })] : [])],
});
const stemPara = (text) => new Paragraph({ spacing: { before: 60, after: 90 }, keepNext: true, keepLines: true, children: rich(text) });
const qNumPara = (n, marks) => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 0, after: 80 }, keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 2 } },
  children: [new TextRun({ text: `Question ${n}`, font: FONT, size: 24, bold: true }), new TextRun({ text: `\t${marks} marks`, font: FONT, size: 20, color: '444444' })],
});
/** the "What to do" box: paragraph shading and a rule on the left survive every viewer */
const doBox = (text) => new Paragraph({
  spacing: { before: 40, after: 100 }, keepNext: true, keepLines: true,
  shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' },
  border: { left: { style: BorderStyle.SINGLE, size: 24, color: '000000', space: 6 } },
  indent: { left: 140 },
  children: [new TextRun({ text: 'What to do:  ', font: FONT, size: 21, bold: true }), ...rich(text, { size: 21 })],
});
/** a key or word bank: one shaded paragraph per line */
const keyBox = (lines) => lines.map((l, i) => new Paragraph({
  spacing: { before: i === 0 ? 60 : 0, after: i === lines.length - 1 ? 100 : 0 }, keepNext: true, keepLines: true,
  shading: { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' }, indent: { left: 2300, hanging: 2160 }, alignment: AlignmentType.LEFT,
  tabStops: [{ type: TabStopType.LEFT, position: 2300 }],
  children: l.includes('||') ? [...rich(l.split('||')[0], { size: 21 }), new TextRun({ text: '\t', size: 21, font: FONT }), ...rich(l.split('||')[1], { size: 21 })] : rich(l, { size: 21 }),
}));
const answerLine = (prefix, unit = '') => new Paragraph({ spacing: { before: 100, after: 60 }, indent: { left: IND }, children: [
  new TextRun({ text: prefix + ' ', font: FONT, size: SZ, bold: true }), new TextRun({ text: '_'.repeat(16), font: FONT, size: SZ, color: '444444' }), ...(unit ? [new TextRun({ text: ' ' + unit, font: FONT, size: SZ })] : [])] });
const optLine = (opts) => new Paragraph({ spacing: { before: 40, after: 100 }, indent: { left: IND }, keepNext: true, keepLines: true,
  children: opts.flatMap((o, i) => [new TextRun({ text: o, font: FONT, size: SZ, bold: true }), ...(i < opts.length - 1 ? [new TextRun({ text: '          ', font: FONT, size: SZ })] : [])]) });
const itemLine = (num, text, o = {}) => new Paragraph({ spacing: { before: 80, after: 20 }, indent: { left: IND + 380, hanging: 380 }, keepNext: true, keepLines: true,
  children: [new TextRun({ text: `${num}\t`, font: FONT, size: SZ, bold: true }), ...rich(text)],
  tabStops: [{ type: TabStopType.LEFT, position: IND + 380 }] });

const writeLines = DP.writeLines;

/** the question body */
function questionBlock(q) {
  const c = [qNumPara(q.n, q.marks)];
  if (q.wordbank) c.push(...keyBox([`**Word bank:**     ${q.wordbank.join('     ')}`]));
  if (q.box) c.push(...keyBox(q.box));
  if (q.stem) c.push(stemPara(q.stem));
  if (q.image) c.push(picPara(q.image, q.imageW, { keepNext: true }));
  if (q.stem2) c.push(stemPara(q.stem2));
  q.parts.forEach((pt) => {
    c.push(partLine(pt.l, pt.t, pt.m));
    if (pt.kind === 'mcq') pt.items.forEach((it, i) => {
      c.push(itemLine(String(i + 1), `**${it.q}**`));
      it.opts.forEach((o, j) => c.push(new Paragraph({ spacing: { before: 0, after: 0 }, indent: { left: IND + 380 + 420, hanging: 420 }, keepNext: true, keepLines: true,
        tabStops: [{ type: TabStopType.LEFT, position: IND + 380 + 420 }], children: [new TextRun({ text: `${LET[j]}\t`, font: FONT, size: SZ, bold: true }), new TextRun({ text: o, font: FONT, size: SZ })] })));
    });
    if (pt.kind === 'text') c.push(...writeLines(pt.space));
    else if (pt.kind === 'circle') c.push(optLine(pt.opts));
    else if (pt.kind === 'each') pt.items.forEach((x, i) => { c.push(itemLine(pt.letters ? 'ABCDEF'[i] : String(i + 1), x)); c.push(optLine(pt.opts)); });
    else if (pt.kind === 'blank') pt.items.forEach((x, i) => { c.push(itemLine(String(i + 1), x)); c.push(new Paragraph({ spacing: { before: 20, after: 60 }, indent: { left: IND + 380 }, keepNext: true,
      children: [new TextRun({ text: pt.label + '  ', font: FONT, size: SZ, bold: true }), new TextRun({ text: '_'.repeat(pt.label.startsWith('Name') ? 34 : 8), font: FONT, size: SZ, color: '444444' })] })); });
    else if (pt.kind === 'order') pt.items.forEach((x) => c.push(new Paragraph({ spacing: { before: 80, after: 40 }, indent: { left: IND + 620, hanging: 620 }, keepNext: true, keepLines: true,
      children: [pic('box.png', 0.3), new TextRun({ text: '\t', font: FONT, size: SZ }), ...rich(x)], tabStops: [{ type: TabStopType.LEFT, position: IND + 620 }] })));
    else if (pt.kind === 'answer') c.push(answerLine(pt.prefix, pt.unit || ''));
    else if (pt.kind === 'calc') { c.push(...writeLines(pt.space)); c.push(answerLine('Answer:', pt.unit)); }
    else if (pt.kind === 'cross') c.push(new Paragraph({ spacing: { before: 0, after: 40 }, indent: { left: IND }, children: [new TextRun({ text: 'Draw on the graph above.', font: FONT, size: 18, italics: true, color: '444444' })] }));
  });
  return block(c);
}

/* =================================================================== *
 * 1. THE PAPER
 * =================================================================== */
function paper() {
  const k = [];
  // ---- page 1: the cover ----
  k.push(new Paragraph({ spacing: { before: 300, after: 60 }, children: [new TextRun({ text: 'Year 7 Science', font: FONT, size: 26, color: '444444' })] }));
  k.push(new Paragraph({ spacing: { before: 0, after: 200 }, children: [new TextRun({ text: `${TITLE} assessment`, font: 'Georgia', size: 64, bold: true })] }));
  const fld = (label) => new Paragraph({ spacing: { before: 160, after: 60 }, children: [
    new TextRun({ text: `${label}  `, font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(48), font: FONT, size: 24, color: '666666' })] });
  k.push(fld('Name'));
  k.push(new Paragraph({ spacing: { before: 160, after: 60 }, children: [
    new TextRun({ text: 'Class  ', font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(16), font: FONT, size: 24, color: '666666' }),
    new TextRun({ text: '      Date  ', font: FONT, size: 24, bold: true }), new TextRun({ text: '_'.repeat(22), font: FONT, size: 24, color: '666666' })] }));
  k.push(spacer(200));
  const info = (a, b) => new TableRow({ children: [
    new TableCell({ width: { size: 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: a, font: FONT, size: 22, bold: true })] })] }),
    new TableCell({ width: { size: PAGE_W - 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: b, font: FONT, size: 22 })] })] }) ] });
  k.push(new Table({ columnWidths: [3200, PAGE_W - 3200], width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    info('Total marks', `${TOTAL}`), info('Time allowed', '45 minutes'), info('Number of questions', `${QUESTIONS.length}`), info('You need', 'A blue or black pen, a pencil, a ruler') ] }));
  k.push(spacer(160));
  k.push(p('Answer **ALL** the questions.'.replace(/\*\*/g, ''), { size: 12, bold: true, after: 60 }));
  const ins = (t) => new Paragraph({ spacing: { before: 0, after: 50 }, indent: { left: 300, hanging: 300 }, tabStops: [{ type: TabStopType.LEFT, position: 300 }], keepLines: true,
    children: [new TextRun({ text: '\u2022\t', font: FONT, size: 21 }), ...rich(t, { size: 21 })] });
  [
    'Read each question carefully. The **bold words** tell you what to do.',
    'Write your answers on the lines, or circle your answer where the question says **circle**.',
    'The number in brackets, for example **[2]**, is the number of marks. A **[2]** answer needs two points.',
    'Where the question asks you to **explain**, give a reason. Use the word "because".',
    'If you make a mistake, put one line through it and write the new answer next to it.',
    'If you are stuck, go on to the next question and come back. Leave time to check.',
  ].forEach((t) => k.push(ins(t)));
  k.push(spacer(200));
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
    k.push(questionBlock(q));
    k.push(spacer(qi === QUESTIONS.length - 1 ? 120 : 260));
  });
  k.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Total for this paper: ${TOTAL} marks`, font: FONT, size: 22, bold: true })] }));
  k.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'END OF PAPER', font: FONT, size: 20, bold: true, color: '444444' })] }));
  k.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [new TextRun({ text: 'If you have time left, go back and check your answers.', font: FONT, size: 20, color: '444444' })] }));

  return new Document({
    creator: 'Chuka', title: `${TITLE} assessment`,
    styles: { default: { document: { run: { font: FONT, size: 22, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header(`Year 7 Science  ·  ${TITLE} assessment`) }, footers: { default: footer() }, children: k }],
  });
}

/* =================================================================== *
 * 2. THE MARK SCHEME (TEACHER ONLY)
 * =================================================================== */
const plain = (s) => String(s).replace(/\*\*/g, '');
function markScheme() {
  const k = [];
  k.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'TEACHER ONLY. DO NOT GIVE TO STUDENTS.', font: FONT, size: 22, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `${TITLE} assessment: mark scheme`, font: 'Georgia', size: 40, bold: true })] }));
  k.push(p(`Year 7 Science, class 7B. ${TOTAL} marks, 45 minutes. One mark point per line, each ending in a semicolon. "Accept" and "Reject" lists apply where the wording varies. Allow error carried forward (ECF) only where the mark scheme says so. Ignore spelling unless the word cannot be read. Every number was checked with sympy (build/how-science-works-assessment-check.py).`, { size: 10, after: 100 }));
  k.push(p('Before you set it: question 8 describes new mothers dying of a fever after childbirth, as the Scientific Theories lesson does. That lesson flags it for sensitive handling if you know of a recent family loss in the class. Every person named is one taught in the lessons. The only place named is Vienna, from the Semmelweis story. Nothing refers to a location in Thailand.', { size: 10, after: 100 }));
  k.push(p('This is their first exam. The cover has six short instructions. Read them aloud before they begin, and check that they know what [2] means.', { size: 10, after: 160 }));

  const cw = [700, 900, 3100, PAGE_W - 4700];
  const head = (txts, ws) => new TableRow({ tableHeader: true, children: txts.map((x, i) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders: BOX4(4, '000000'),
    shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text: x, font: FONT, size: 19, bold: true })] })] })) });
  const cellT = (lines, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, verticalAlign: VerticalAlign.TOP,
    children: (Array.isArray(lines) ? lines : [lines]).map((x) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: plain(x), font: FONT, size: o.size || 20, bold: o.bold })] })) });
  k.push(p('Coverage', { size: 12, bold: true, after: 60, keepNext: true }));
  k.push(new Table({ columnWidths: cw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    head(['Q', 'Marks', 'Lesson tested', 'Skill'], cw),
    ...QUESTIONS.map((q) => new TableRow({ cantSplit: true, children: [cellT(String(q.n), cw[0], { bold: true }), cellT(String(q.marks), cw[1]), cellT(q.lesson, cw[2]), cellT(q.skill, cw[3])] })),
  ] }));
  k.push(p('The paper opens with multiple-choice definitions of the key words and simple decisions (Q1 to Q4, 15 marks), moves to applying the ideas and reading a diagram (Q5 to Q8, 16 marks), and ends with induction, a graph, an unfamiliar claim and a misconception to diagnose (Q9 to Q12, 14 marks). Four of the five lessons are tested and nothing outside them is. Who Got Left Out is not tested: it was judged nice-to-know history rather than essential for this paper. The claim in question 11 is a new one (carrots) so that the durian example from the first lesson is not simply recalled.', { size: 10, after: 160 }));

  const mw = [700, PAGE_W - 700 - 900, 900];
  QUESTIONS.forEach((q) => {
    const rows = [head(['Part', 'Mark points', 'Marks'], mw)];
    q.ms.forEach((m) => {
      const marks = m.l ? (q.parts.find((x) => x.l === m.l) || q.parts[0]).m : q.marks;
      rows.push(new TableRow({ cantSplit: true, children: [
        cellT(m.l || '', mw[0], { bold: true }),
        new TableCell({ width: { size: mw[1], type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: [
          ...m.pts.map((x) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: x, font: FONT, size: 20 })] })),
          ...(m.note ? [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: m.note, font: FONT, size: 18, italics: true, color: '333333' })] })] : []) ] }),
        cellT(String(marks), mw[2], { bold: true }) ] }));
    });
    k.push(new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 200, after: 80 }, keepNext: true,
      children: [new TextRun({ text: `Question ${q.n}`, font: FONT, size: 24, bold: true }), new TextRun({ text: `\t${q.marks} marks  ·  ${q.lesson}`, font: FONT, size: 19, color: '444444' })] }));
    k.push(new Table({ columnWidths: mw, width: { size: PAGE_W, type: WidthType.DXA }, rows }));
    k.push(new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Likely wrong answer: ', font: FONT, size: 19, bold: true }), new TextRun({ text: q.wrong, font: FONT, size: 19 })] }));
  });

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Feedback variants: answers', font: 'Georgia', size: 36, bold: true })] }));
  k.push(p('Send each student to the variant that matches their mark on that question. Full marks: Extend (E). At least two thirds of the marks: Consolidate (C). Fewer than two thirds: Support (S). The "likely wrong answer" lines above tell you which questions to expect trouble on, so you can plan the lesson before the papers are marked.', { size: 10, after: 120 }));
  const fw = [600, Math.floor((PAGE_W - 600) / 3), Math.floor((PAGE_W - 600) / 3), PAGE_W - 600 - 2 * Math.floor((PAGE_W - 600) / 3)];
  k.push(new Table({ columnWidths: fw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    head(['Q', 'Support (S)', 'Consolidate (C)', 'Extend (E)'], fw),
    ...FEEDBACK.map((f) => new TableRow({ cantSplit: true, children: [cellT(String(f.n), fw[0], { bold: true }), cellT(f.S.a, fw[1], { size: 17 }), cellT(f.C.a, fw[2], { size: 17 }), cellT(f.E.a, fw[3], { size: 17 })] })),
  ] }));

  return new Document({
    creator: 'Chuka', title: `${TITLE} mark scheme`,
    styles: { default: { document: { run: { font: FONT, size: 20, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header(`TEACHER ONLY  ·  Year 7 Science  ·  ${TITLE} mark scheme`) }, footers: { default: footer('TEACHER ONLY') }, children: k }],
  });
}

/* =================================================================== *
 * 3. THE FEEDBACK SHEET (student-facing, landscape, no answers)
 * =================================================================== */
function feedback() {
  const LW = 16838 - 2 * 900;
  const qw = 700, vw = Math.floor((LW - qw) / 3), last = LW - qw - 2 * vw;
  const k = [];
  k.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${TITLE}: feedback lesson`, font: 'Georgia', size: 44, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 120 }, children: rich('Find your question number down the left. Do the box your teacher tells you. **S** (Support) is for when you lost several marks. **C** (Consolidate) is for when you were close. **E** (Extend) is for when you got full marks. Write your answers in your book, with the question number and the letter. You will not do every question. Do the two or three that match your mistakes.', { size: 20 }) }));
  const gc = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 60, bottom: 60, left: 70, right: 70 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text: String(txt), font: FONT, size: 19, bold: o.bold })] })] });
  const gw = Math.floor((LW - 2400) / QUESTIONS.length);
  k.push(new Table({ columnWidths: [2400, ...QUESTIONS.map(() => gw)], width: { size: 2400 + gw * QUESTIONS.length, type: WidthType.DXA }, rows: [
    new TableRow({ children: [gc('Question', 2400, { fill: 'E6E6E6', bold: true, left: true }), ...QUESTIONS.map((q) => gc(q.n, gw, { fill: 'E6E6E6', bold: true }))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My mark', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My box (S, C or E)', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] }),
  ] }));
  k.push(spacer(140));

  const small = (txt) => new Paragraph({ spacing: { before: 0, after: 70 }, keepLines: true, children: rich(txt, { size: /^Box:/.test(txt) ? 18 : 20, italics: /^Box:/.test(txt) }) });
  const tabTable = (rows) => rows.map((r, i) => new Paragraph({ tabStops: [{ type: TabStopType.LEFT, position: 1500 }], spacing: { before: 0, after: 30 }, keepLines: true,
    children: [new TextRun({ text: r[0], font: FONT, size: 19, bold: i === 0 }), new TextRun({ text: '\t', font: FONT, size: 19 }), new TextRun({ text: r[1], font: FONT, size: 19, bold: i === 0 })] }));
  const variantCell = (v, w) => {
    const kids = [];
    if (v.table) kids.push(...tabTable(v.table), new Paragraph({ spacing: { after: 50 }, children: [] }));
    v.t.forEach((x) => kids.push(small(x)));
    if (v.lines) kids.push(...writeLines(v.lines, w - 300, { keepNext: false }));
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
      headers: { default: header(`Year 7 Science  ·  ${TITLE} feedback`) }, footers: { default: footer() }, children: k }],
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

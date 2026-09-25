/**
 * Atoms assessment for T3 Developing Science (CLIL, beginner EAL). Three documents,
 * all A4, all BLACK AND WHITE (ASSESSMENT.md):
 *
 *   out/Atoms assessment/Atoms assessment.docx    students sit this
 *   out/Atoms assessment/Atoms mark scheme.docx   TEACHER ONLY
 *   out/Atoms assessment/Atoms feedback.docx      the follow-up lesson
 *
 * 45 marks, 45 minutes. No palette, no timer, no colour. Pictures are the taught
 * icons in greyscale plus black-and-white drawings (build/atoms-assessment-diagrams.py).
 * Content is in atoms-assessment-content.js. No nested tables and no table borders
 * for writing lines: lines are underscore-leader tabs, so they render in every viewer.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('bw');
const { D, FONT, PAGE_W } = DP;
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
        TabStopType, LeaderType, LineRuleType, ImageRun, Header, Footer, PageNumber, HeightRule, VerticalAlign, PageBreak } = D;
const { QUESTIONS, FEEDBACK, BANK, PIC, TOTAL } = require('./atoms-assessment-content');

const TITLE = 'Atoms';
const OUT = path.join(__dirname, '..', 'out', `${TITLE} assessment`);
fs.mkdirSync(OUT, { recursive: true });
const IMGDIR = path.join(__dirname, '..', 'assets', 'assessment', 'atoms');

const NB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NONE4 = { top: NB, bottom: NB, left: NB, right: NB };
const BOX = (sz = 6, col = '000000') => ({ style: BorderStyle.SINGLE, size: sz, color: col });
const BOX4 = (sz, col) => ({ top: BOX(sz, col), bottom: BOX(sz, col), left: BOX(sz, col), right: BOX(sz, col) });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 22, bold: o.bold, italics: o.italic, color: o.color });

const header = (text) => new Header({ children: [new Paragraph({ children: [run(text, { size: 17, color: '444444' })] })] });
const footer = (extra = '') => new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }],
  children: [run(extra, { size: 16, color: '444444' }), run('\tPage ', { size: 16, color: '444444' }),
             new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '444444' })],
})] });

/** an inline picture; `type: 'png'` is required or Word shows nothing */
function pic(name, widthIn) {
  const b = fs.readFileSync(path.join(IMGDIR, `${name}.png`));
  const iw = b.readUInt32BE(16), ih = b.readUInt32BE(20);
  const w = Math.round(widthIn * 96), h = Math.round(w * ih / iw);
  return new ImageRun({ type: 'png', data: b, transformation: { width: w, height: h },
    altText: { name, title: name.replace(/_/g, ' '), description: 'Picture for the question' } });
}
/** Writing lines are pictures (DP.writeLines): tab leaders and borders vanish in Google Docs and Pages. */
const writeLines = DP.writeLines;
/** one grey rule as an inline picture, for a line that sits next to a picture */
function lineRun(widthPx) {
  const data = fs.readFileSync(path.join(__dirname, '..', 'assets', 'assessment', 'line.png'));
  return new ImageRun({ type: 'png', data, transformation: { width: widthPx, height: 34 }, altText: { name: 'writing line', title: 'writing line', description: 'A line to write on' } });
}

/** a question kept in one piece: a one-cell table whose row cannot split across a page */
function block(children, width = PAGE_W, after = 40) {
  return new Table({ columnWidths: [width], width: { size: width, type: WidthType.DXA }, borders: { ...NONE4, insideHorizontal: NB, insideVertical: NB },
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: width, type: WidthType.DXA }, borders: NONE4, margins: { top: 0, bottom: after, left: 0, right: 0 }, children })] })] });
}
const spacer = (after = 200) => new Paragraph({ spacing: { before: 0, after }, children: [] });

/* ---- one renderer for the paper and the feedback sheet ---- */
function render(blocks, width = PAGE_W, o = {}) {
  const sz = o.size ?? 22, out = [];
  blocks.forEach((b) => {
    if (typeof b === 'string') b = { k: 'stem', t: b };
    if (b.k === 'stem') out.push(new Paragraph({ spacing: { before: 0, after: 90 }, keepNext: true, keepLines: true, children: [run(b.t, { size: sz })] }));
    else if (b.k === 'note') out.push(new Paragraph({ spacing: { before: 30, after: 100 }, keepNext: true, keepLines: true, indent: { left: o.noteIndent ?? 0 }, children: [run(b.t, { size: sz - 2 })] }));
    else if (b.k === 'bank') out.push(new Paragraph({ spacing: { before: 40, after: 100 }, keepNext: true, keepLines: true, shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, children: [run(' ' + b.t, { size: sz - 1, bold: true })] }));
    else if (b.k === 'part') {
      out.push(new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: width }], spacing: { before: 110, after: 70 }, keepNext: true, keepLines: true,
        indent: b.l ? { left: 520, hanging: 520 } : undefined,
        children: [...(b.l ? [run(`${b.l}\t`, { size: sz, bold: true })] : []), run(b.t, { size: sz }), ...(b.m ? [run(`\t[${b.m}]`, { size: sz, bold: true })] : [])] }));
      if (b.space) out.push(...writeLines(b.space, width));
    } else if (b.k === 'lines') out.push(...writeLines(b.n, width));
    else if (b.k === 'img') out.push(new Paragraph({ alignment: b.align === 'left' ? AlignmentType.LEFT : AlignmentType.CENTER, spacing: { before: 40, after: 80 }, keepNext: true, children: [pic(b.f, b.w)] }));
    else if (b.k === 'imgs') out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 100 }, keepNext: true, children: b.fs.flatMap((f, i) => (i ? [run('     '), pic(f, b.w)] : [pic(f, b.w)])) }));
    else if (b.k === 'yn') b.items.forEach((it) => {
      const narrow = width < 6000;
      if (narrow) { out.push(new Paragraph({ spacing: { before: 40, after: 0 }, keepNext: true, keepLines: true, children: [pic(it.pic, 0.42), run('  ' + it.t, { size: sz })] }));
                    out.push(new Paragraph({ spacing: { before: 0, after: 100 }, indent: { left: 700 }, children: [run('YES          NO', { size: sz, bold: true })] })); }
      else out.push(new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: width - 1500 }, { type: TabStopType.RIGHT, position: width }], spacing: { before: 60, after: 140 }, keepNext: true, keepLines: true,
        children: [pic(it.pic, 0.62), run('   ' + it.t, { size: sz }), run('\tYES', { size: sz, bold: true }), run('\tNO', { size: sz, bold: true })] }));
    });
    else if (b.k === 'either') b.items.forEach((it) => {
      const narrow = width < 6000;
      out.push(new Paragraph({ tabStops: narrow ? [{ type: TabStopType.LEFT, position: 1300 }, { type: TabStopType.LEFT, position: 2700 }] : [{ type: TabStopType.LEFT, position: 1900 }, { type: TabStopType.LEFT, position: 4300 }],
        spacing: { before: 60, after: 140 }, keepNext: true, keepLines: true,
        children: [pic(it.pic, narrow ? 0.5 : 0.75), run('\t' + it.a, { size: sz + 2, bold: true }), run('\t' + it.b, { size: sz + 2, bold: true })] }));
    });
    else if (b.k === 'wordrow') b.items.forEach((it) => {
      const narrow = width < 6000, pw = it.big ? (narrow ? 0.95 : 1.3) : (narrow ? 0.55 : 0.8), used = Math.round(pw * 96) + (it.hint ? 150 : 24);
      out.push(new Paragraph({ spacing: { before: 60, after: 140 }, keepNext: true, keepLines: true,
        children: [pic(it.pic, pw), ...(it.hint ? [run('   ' + it.hint, { size: sz, color: '444444' })] : [run('  ')]), lineRun(Math.max(80, Math.floor(width / 15) - used - 20))] }));
    });
  });
  return out;
}

/* =================================================================== *
 * 1. THE PAPER
 * =================================================================== */
function paper() {
  const k = [];
  k.push(new Paragraph({ spacing: { before: 300, after: 60 }, children: [run('T3 Developing Science', { size: 26, color: '444444' })] }));
  k.push(new Paragraph({ spacing: { before: 0, after: 200 }, children: [new TextRun({ text: `${TITLE} assessment`, font: 'Georgia', size: 64, bold: true })] }));
  k.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [run('Name  ', { size: 24, bold: true }), run('_'.repeat(48), { size: 24, color: '666666' })] }));
  k.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [run('Class  ', { size: 24, bold: true }), run('_'.repeat(14), { size: 24, color: '666666' }), run('      Date  ', { size: 24, bold: true }), run('_'.repeat(22), { size: 24, color: '666666' })] }));
  k.push(spacer(200));
  const info = (a, b) => new TableRow({ children: [
    new TableCell({ width: { size: 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 90, bottom: 90, left: 140, right: 140 }, children: [new Paragraph({ children: [run(a, { bold: true })] })] }),
    new TableCell({ width: { size: PAGE_W - 3200, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), margins: { top: 90, bottom: 90, left: 140, right: 140 }, children: [new Paragraph({ children: [run(b)] })] })] });
  k.push(new Table({ columnWidths: [3200, PAGE_W - 3200], width: { size: PAGE_W, type: WidthType.DXA }, rows: [info('Total marks', String(TOTAL)), info('Time', '45 minutes'), info('You need', 'A pencil and an eraser')] }));
  k.push(spacer(160));
  ['Answer all the questions.', 'Look at the pictures.', 'Use the word bank below.'].forEach((t) => k.push(new Paragraph({ spacing: { before: 0, after: 40 }, children: [run(t, { size: 26, bold: true })] })));
  k.push(new Paragraph({ spacing: { before: 60, after: 200 }, children: [run('The number in [ ] is the number of marks. One mark is about one minute.', { size: 22 })] }));

  // word bank: ten words, each with its picture (top-level table, no nesting)
  k.push(new Paragraph({ spacing: { before: 0, after: 60 }, keepNext: true, children: [run('Word bank', { size: 24, bold: true })] }));
  const cw = Math.floor(PAGE_W / 5);
  const cellFor = (w) => new TableCell({ width: { size: cw, type: WidthType.DXA }, borders: BOX4(4, '8C8C8C'), verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 40, right: 40 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [pic(PIC[w], w === 'part' ? 0.9 : 0.55)] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [run(w, { size: 24, bold: true })] })] });
  k.push(new Table({ columnWidths: Array(5).fill(cw), width: { size: cw * 5, type: WidthType.DXA }, rows: [
    new TableRow({ cantSplit: true, children: BANK.slice(0, 5).map(cellFor) }), new TableRow({ cantSplit: true, children: BANK.slice(5).map(cellFor) })] }));
  k.push(spacer(220));
  const w1 = 2300, wq = Math.floor((PAGE_W - w1 - 1100) / QUESTIONS.length), wt = PAGE_W - w1 - wq * QUESTIONS.length;
  const gcell = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 70, bottom: 70, left: 50, right: 50 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: [run(String(txt), { size: 19, bold: o.bold })] })] });
  k.push(new Table({ columnWidths: [w1, ...QUESTIONS.map(() => wq), wt], width: { size: PAGE_W, type: WidthType.DXA }, rows: [
    new TableRow({ children: [gcell('Question', w1, { bold: true, fill: 'E6E6E6', left: true }), ...QUESTIONS.map((q) => gcell(q.n, wq, { bold: true, fill: 'E6E6E6' })), gcell('Total', wt, { bold: true, fill: 'E6E6E6' })] }),
    new TableRow({ children: [gcell('Marks', w1, { left: true }), ...QUESTIONS.map((q) => gcell(q.marks, wq)), gcell(TOTAL, wt, { bold: true })] }),
    new TableRow({ height: { value: 600, rule: HeightRule.ATLEAST }, children: [gcell('Your marks', w1, { left: true }), ...QUESTIONS.map(() => gcell('', wq)), gcell('', wt)] })] }));
  k.push(new Paragraph({ children: [new PageBreak()] }));

  QUESTIONS.forEach((q, qi) => {
    const c = [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 0, after: 100 }, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 2 } },
      children: [run(`Question ${q.n}`, { size: 26, bold: true }), run(`\t${q.marks} marks`, { size: 20, color: '444444' })] }), ...render(q.blocks)];
    k.push(block(c, PAGE_W, qi === QUESTIONS.length - 1 ? 120 : 420));
  });
  k.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(`Total for this paper: ${TOTAL} marks`, { bold: true })] }));
  k.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [run('END OF PAPER', { size: 20, bold: true, color: '444444' })] }));
  return new Document({ creator: 'Chuka', title: `${TITLE} assessment`, styles: { default: { document: { run: { font: FONT, size: 22, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header(`T3 Developing Science  ·  ${TITLE} assessment`) }, footers: { default: footer() }, children: k }] });
}

/* =================================================================== *
 * 2. THE MARK SCHEME (TEACHER ONLY)
 * =================================================================== */
function markScheme() {
  const k = [];
  const head = (txts, ws) => new TableRow({ tableHeader: true, children: txts.map((x, i) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders: BOX4(4, '000000'), shading: { type: ShadingType.CLEAR, fill: 'E6E6E6', color: 'auto' }, margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: [new Paragraph({ children: [run(x, { size: 19, bold: true })] })] })) });
  const cellT = (lines, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, verticalAlign: VerticalAlign.TOP,
    children: (Array.isArray(lines) ? lines : [lines]).map((x) => new Paragraph({ spacing: { after: 40 }, children: [run(x, { size: o.size || 20, bold: o.bold })] })) });
  k.push(new Paragraph({ spacing: { after: 40 }, children: [run('TEACHER ONLY. DO NOT GIVE TO STUDENTS.', { bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `${TITLE} assessment: mark scheme`, font: 'Georgia', size: 40, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 140 }, children: [run(`T3 Developing Science. ${TOTAL} marks, 45 minutes. One mark point per line, each ending in a semicolon. There is no calculation in this unit, so there is no arithmetic to check. Every answer is a word, a place in a picture or a sentence.`, { size: 21 })] }));

  k.push(new Paragraph({ spacing: { before: 60, after: 60 }, keepNext: true, children: [run('How to mark the language', { size: 24, bold: true })] }));
  ['These students are beginners in English, and the unit is about saying and writing four to ten words and five sentences. Mark the science first, and be generous with the English that carries it.',
   'Ignore spelling, capital letters and full stops if the word can be read as the right word ("nuclus" is nucleus; "centre" spelt "center" is accepted).',
   'Sentence questions (Q8, Q10b, Q11) have two marks each: one for the science, one for a whole sentence. The language mark is given only if the science mark is given. A whole sentence has a verb (is, are) and the key words in order. A word or a fragment, such as "centre" or "in the centre", scores the science mark only.',
   'Atoms needs its s in Q8 ("made of atom" loses the language mark). The frame in Atoms 1 is "___ is made of atoms", so the s is part of the sentence they learned.',
   'Accept "made from" for "made of".',
   'Q4 to Q7 use the pictures and a key. On paper a proton is a solid dot and a neutron an open dot, because yellow and rose cannot be told apart in black and white.'].forEach((t) =>
    k.push(new Paragraph({ spacing: { after: 50 }, indent: { left: 300, hanging: 300 }, children: [run('•\t' + t, { size: 20 })] })));

  const cw = [700, 900, 3300, PAGE_W - 4900];
  k.push(new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: [run('Coverage', { size: 24, bold: true })] }));
  k.push(new Table({ columnWidths: cw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [head(['Q', 'Marks', 'Lessons tested', 'Skill'], cw),
    ...QUESTIONS.map((q) => new TableRow({ cantSplit: true, children: [cellT(String(q.n), cw[0], { bold: true }), cellT(String(q.marks), cw[1]), cellT(q.lesson, cw[2]), cellT(q.skill, cw[3])] }))] }));
  k.push(new Paragraph({ spacing: { before: 100, after: 200 }, children: [run('The paper opens with yes or no, either/or and writing single words (Q1 to Q3, 10 marks), then labelling, key sentences, an atom drawn from memory and a nucleus picture (Q4 to Q7, 18 marks), then whole sentences, a wrong statement to correct and a three-sentence task (Q8 to Q11, 17 marks). The order follows the CLIL order: yes/no, then either/or, then open. The demand is high because Q4 to Q11 need students to produce: label, draw, write, correct. The pencil in Q8(b) is the one object they have not met in class. All three lessons are tested, nothing else is, and there are no place names anywhere.', { size: 19, italic: true })] }));

  const mw = [900, PAGE_W - 900 - 900, 900];
  QUESTIONS.forEach((q) => {
    const rows = [head(['Part', 'Mark points', 'Marks'], mw)];
    const partMarks = (l) => { const p = q.blocks.find((b) => b.k === 'part' && b.l === l); return p ? p.m : ''; };
    q.ms.forEach((m) => {
      const marks = m.l && !m.l.includes('to') ? partMarks(m.l) || m.pts.length : m.pts.length;
      rows.push(new TableRow({ cantSplit: true, children: [cellT(m.l || '', mw[0], { bold: true }),
        new TableCell({ width: { size: mw[1], type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: [
          ...m.pts.map((x) => new Paragraph({ spacing: { after: 40 }, children: [run(x, { size: 20 })] })),
          ...(m.note ? [new Paragraph({ spacing: { before: 40, after: 40 }, children: [run(m.note, { size: 18, italic: true, color: '333333' })] })] : [])] }),
        cellT(String(marks), mw[2], { bold: true })] }));
    });
    k.push(new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: PAGE_W }], spacing: { before: 200, after: 80 }, keepNext: true, children: [run(`Question ${q.n}`, { size: 24, bold: true }), run(`\t${q.marks} marks  ·  ${q.lesson}`, { size: 19, color: '444444' })] }));
    k.push(new Table({ columnWidths: mw, width: { size: PAGE_W, type: WidthType.DXA }, rows }));
    k.push(new Paragraph({ spacing: { before: 60, after: 60 }, children: [run('Likely wrong answer: ', { size: 19, bold: true }), run(q.wrong, { size: 19 })] }));
  });

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Feedback variants: answers', font: 'Georgia', size: 36, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 140 }, children: [run('Send each student to the variant that matches their mark on that question. Full marks: Extend (E). At least two thirds of the marks: Consolidate (C). Fewer than two thirds: Support (S). The "likely wrong answer" lines above tell you which questions to expect trouble on, so you can plan the lesson before the papers are marked. It is a bank, not a worklist: each student does the two or three variants that match their mistakes. The word bank on page 1 of the paper is available for all variants.', { size: 20 })] }));
  const fw = [600, Math.floor((PAGE_W - 600) / 3), Math.floor((PAGE_W - 600) / 3), PAGE_W - 600 - 2 * Math.floor((PAGE_W - 600) / 3)];
  k.push(new Table({ columnWidths: fw, width: { size: PAGE_W, type: WidthType.DXA }, rows: [head(['Q', 'Support (S)', 'Consolidate (C)', 'Extend (E)'], fw),
    ...FEEDBACK.map((f) => new TableRow({ cantSplit: true, children: [cellT(String(f.n), fw[0], { bold: true }), cellT(f.a.S, fw[1], { size: 17 }), cellT(f.a.C, fw[2], { size: 17 }), cellT(f.a.E, fw[3], { size: 17 })] }))] }));
  return new Document({ creator: 'Chuka', title: `${TITLE} mark scheme`, styles: { default: { document: { run: { font: FONT, size: 20, color: '000000' } } } },
    sections: [{ properties: { page: A4 }, headers: { default: header('TEACHER ONLY  ·  T3 Developing Science  ·  Atoms mark scheme') }, footers: { default: footer('TEACHER ONLY') }, children: k }] });
}

/* =================================================================== *
 * 3. THE FEEDBACK SHEET (student-facing, landscape, no answers)
 * =================================================================== */
function feedback() {
  const LW = 16838 - 2 * 900, qw = 700, vw = Math.floor((LW - qw) / 3), last = LW - qw - 2 * vw;
  const k = [];
  k.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${TITLE}: feedback lesson`, font: 'Georgia', size: 44, bold: true })] }));
  k.push(new Paragraph({ spacing: { after: 100 }, children: [run('Find your question number. Do the box your teacher tells you. S = Support. C = Consolidate. E = Extend. Write in your book. Use the word bank on page 1 of your paper. You do not do every question: do the two or three for your mistakes.', { size: 22 })] }));
  const gc = (txt, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), verticalAlign: VerticalAlign.CENTER, shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined, margins: { top: 60, bottom: 60, left: 70, right: 70 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: [run(String(txt), { size: 19, bold: o.bold })] })] });
  const gw = Math.floor((LW - 2400) / QUESTIONS.length);
  k.push(new Table({ columnWidths: [2400, ...QUESTIONS.map(() => gw)], width: { size: 2400 + gw * QUESTIONS.length, type: WidthType.DXA }, rows: [
    new TableRow({ children: [gc('Question', 2400, { fill: 'E6E6E6', bold: true, left: true }), ...QUESTIONS.map((q) => gc(q.n, gw, { fill: 'E6E6E6', bold: true }))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My mark', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] }),
    new TableRow({ height: { value: 460, rule: HeightRule.ATLEAST }, children: [gc('My box (S, C or E)', 2400, { left: true }), ...QUESTIONS.map(() => gc('', gw))] })] }));
  k.push(spacer(140));
  const cell = (blocks, w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 90, bottom: 90, left: 120, right: 120 }, verticalAlign: VerticalAlign.TOP, children: render(blocks, w - 240, { size: 20, noteIndent: 0 }) });
  const headRow = new TableRow({ tableHeader: true, children: [gc('Q', qw, { fill: 'E6E6E6', bold: true }), gc('S  Support', vw, { fill: 'E6E6E6', bold: true }), gc('C  Consolidate', vw, { fill: 'E6E6E6', bold: true }), gc('E  Extend', last, { fill: 'E6E6E6', bold: true })] });
  const rows = FEEDBACK.map((f) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: qw, type: WidthType.DXA }, borders: BOX4(4, '000000'), margins: { top: 90, bottom: 90, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run(String(f.n), { size: 30, bold: true })] })] }),
    cell(f.S, vw), cell(f.C, vw), cell(f.E, last)] }));
  k.push(new Table({ columnWidths: [qw, vw, vw, last], width: { size: LW, type: WidthType.DXA }, rows: [headRow, ...rows] }));
  return new Document({ creator: 'Chuka', title: `${TITLE} feedback`, styles: { default: { document: { run: { font: FONT, size: 20, color: '000000' } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838, orientation: D.PageOrientation.LANDSCAPE }, margin: { top: 900, bottom: 900, left: 900, right: 900 } } },
      headers: { default: header('T3 Developing Science  ·  Atoms feedback') }, footers: { default: footer() }, children: k }] });
}

(async () => {
  for (const [name, doc] of [['assessment', paper()], ['mark scheme', markScheme()], ['feedback', feedback()]]) {
    const buf = await Packer.toBuffer(doc); const file = `${TITLE} ${name}.docx`;
    fs.writeFileSync(path.join(OUT, file), buf); console.log('written:', file, Math.round(buf.length / 1024) + ' KB');
  }
})();

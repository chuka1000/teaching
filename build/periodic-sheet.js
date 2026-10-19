/**
 * T3 Unit 8, The Periodic Table: worksheet furniture every lesson in the unit shares (CLIL.md: picture-led, a word bank
 * and writing lines, no line-drawing matching). Nucleus print palette.
 *
 *   const WS = require('./periodic-sheet')({ lesson: 'Metal Or Non-Metal', header: 'The Periodic Table, Lesson 2' });
 *   WS.write(children)      // out/<lesson>/<lesson> worksheet.docx, A4, header and page numbers
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, PAGE_W, p, runs, t, h1, cell, table, ragGrid, boxed, writeLines } = DP;
const { Document, Packer, Paragraph, TableRow, ImageRun, AlignmentType, HeightRule, VerticalAlign, Header, Footer, PageNumber, TextRun } = D;
const { picFile, CHIP } = require('./periodic-kit');
const WORDS = require('./periodic-words');

const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 964, right: 964 } };

module.exports = function sheet({ lesson, header }) {
  const OUT = path.join(__dirname, '..', 'out', lesson);
  fs.mkdirSync(OUT, { recursive: true });

  /** A picture as an inline image: the photograph if there is one. `type` is required or Word shows nothing. */
  const pic = (k, px, o = {}) => {
    const file = picFile(k, o);
    return new ImageRun({ type: file.endsWith('.jpg') ? 'jpg' : 'png', data: fs.readFileSync(file), transformation: { width: px, height: px } });
  };
  const picPara = (keys, px, o = {}) => new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: o.before ?? 40, after: o.after ?? 20 },
    children: keys.flatMap((k, i) => (i ? [new TextRun({ text: '   ' }), pic(k, px, o)] : [pic(k, px, o)])),
  });
  /** The periodic table picture (2341 x 1263), `w` pixels wide, centred. */
  const tablePic = (k, w = 560) => new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(picFile(k, { drawing: true })), transformation: { width: w, height: Math.round(w * 1263 / 2341) } })],
  });
  const head = () => new Header({ children: [runs([
    t(`T3 Developing Science  ·  ${header}  ·  `, { size: 8.5, color: C.soft }), t('Worksheet', { size: 8.5, color: C.soft, bold: true }),
  ], { after: 0 })] });
  const foot = () => new Footer({ children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
  })] });
  const sect = (letter, text) => runs([
    t(`${letter}  `, { bold: true, size: 14, color: C.accent }), t(text, { bold: true, size: 13, color: C.dark }),
  ], { before: 160, after: 40, keepNext: true });
  const how = (text) => p(text, { size: 11, italic: true, color: C.soft, after: 60, keepNext: true });

  /** Title, name line, the RAG grid and the word bank. */
  function top(titleText, criteria, bank, bankSize = 15) {
    return [
      h1(titleText),
      runs([
        t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
        t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
        t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
      ], { after: 140 }),
      p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, after: 80 }),
      ragGrid(criteria),
      p('', { size: 4, after: 60 }),
      boxed(p(bank.join('   ·   '), { size: bankSize, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 8, fill: 'FFF4D6' }),
      runs([t('Word bank. ', { bold: true, size: 11 }), t('Point first, then say the whole sentence.', { size: 11 })], { before: 80, after: 40 }),
    ];
  }

  /** "metal   non-metal" or "shiny   not shiny": two words to circle, in the colours of the table. */
  const choice = (a, b, size = 15) => p(`${a}          ${b}`, { size, bold: true, align: AlignmentType.CENTER, after: 0, color: C.dark });

  /** A row per picture: a number, the picture (and its tile), then a prompt cell. cells(r, i) returns the content of the right-hand cell. */
  function rows(items, cells, { px = 70, w1 = 1700, minH = 900 } = {}) {
    const w2 = PAGE_W - w1;
    return table(items.map((r, i) => new TableRow({
      cantSplit: true,
      height: { value: minH, rule: HeightRule.ATLEAST },
      children: [
        cell([
          picPara(Array.isArray(r.keys) ? r.keys : [r.key], px, { before: 20, after: 20 }),
          ...(r.label ? [p(r.label, { size: 11, bold: true, align: AlignmentType.CENTER, after: 0 })] : []),
        ], { w: w1, valign: VerticalAlign.CENTER }),
        cell(cells(r, i), { w: w2, valign: VerticalAlign.CENTER }),
      ],
    })), [w1, w2]);
  }

  /**
   * Sentences: a picture, then the sentence with one gap; a row with `whole` is a whole sentence to write.
   * rows: { key, pre, post } or { key, whole: true, prompt }.
   */
  function sentences(list, start = 1) {
    const w1 = 1500, w2 = PAGE_W - w1;
    return table(list.map((r, i) => new TableRow({
      cantSplit: true,
      height: { value: 860, rule: HeightRule.ATLEAST },
      children: [
        cell(r.key ? picPara(Array.isArray(r.key) ? r.key : [r.key], 46, { before: 20, after: 20 }) : p('', { after: 0 }), { w: w1, valign: VerticalAlign.CENTER }),
        cell(r.whole
          ? [runs([t(`${start + i}   `, { bold: true, size: 12, color: C.accent }), t(r.prompt || 'Write the whole sentence.', { size: 11, italic: true, color: C.soft })], { after: 40 }),
             ...writeLines(1, w2 - 400, { keepNext: false })]
          : [runs([t(`${start + i}   `, { bold: true, size: 12, color: C.accent }), t(r.pre, { size: 14 }),
                   t('_'.repeat(r.gapLen || 14), { size: 14, color: C.dark }), t(r.post ?? '.', { size: 14 })], { after: 0, line: 320 })],
        { w: w2, valign: VerticalAlign.CENTER }),
      ],
    })), [w1, w2]);
  }

  /** Two boxes to sort words into, one slot per word. `labels` are the headings; `slots` the number of lines in each. */
  function sortBoxes(labels, slots, fills) {
    const n = labels.length, w = Math.floor(PAGE_W / n);
    const head = new TableRow({ cantSplit: true, children: labels.map((l, i) => cell([p(l, { size: 13, bold: true, color: i === 0 && fills[i] === 'DADFE3' ? C.dark : C.dark, align: AlignmentType.CENTER, after: 0 })], { w, fill: fills[i] })) });
    const body = Array.from({ length: slots }, () => new TableRow({ cantSplit: true, children: labels.map(() => cell(writeLines(1, w - 300, { keepNext: false, height: 40 }), { w })) }));
    return table([head, ...body], Array(n).fill(w));
  }

  /** The finished box, the Gemini line, and the answers, upside down. */
  async function tail(answers, finished) {
    const k = [];
    if (finished) {
      k.push(boxed([p(finished, { size: 11.5, bold: true, after: 60 }), ...writeLines(2, PAGE_W - 400, { keepNext: false })], { colour: C.rule, weight: 4, fill: 'F4F8FA' }));
      k.push(p('', { size: 4, after: 80 }));
    }
    k.push(boxed(p('Gemini: ask it to check your sentences. Do not ask it to write them for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F8FA' }));
    k.push(...await DP.answersBlock(answers, { before: 200 }));
    return k;
  }

  async function write(children, suffix = 'worksheet') {
    const doc = new Document({
      styles: { default: { document: { run: { font: FONT, size: 22, color: C.ink } } } },
      sections: [{ properties: { page: A4 }, headers: { default: head() }, footers: { default: foot() }, children }],
    });
    const buf = await Packer.toBuffer(doc);
    const file = `${lesson} ${suffix}.docx`;
    fs.writeFileSync(path.join(OUT, file), buf);
    console.log('written:', file, Math.round(buf.length / 1024) + ' KB');
  }

  return { DP, C, CHIP, PAGE_W, p, runs, t, cell, table, boxed, writeLines, pic, picPara, tablePic, sect, how, top, choice, rows, sentences, sortBoxes, tail, write, Paragraph, PageBreak: D.PageBreak, TableRow, AlignmentType, VerticalAlign, HeightRule };
};

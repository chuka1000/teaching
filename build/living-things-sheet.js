/**
 * T3 Unit 4, What is a living organism?: worksheet furniture every lesson in the unit shares (CLIL.md: picture-led,
 * a word bank and writing lines, no line-drawing matching). Meadow print palette.
 *
 *   const WS = require('./living-things-sheet')({ lesson: 'What Living Things Need', header: 'Living things, Lesson 2' });
 *   WS.write(children)      // out/<lesson>/<lesson> worksheet.docx, A4, header and page numbers
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('meadow');
const { D, C, FONT, PAGE_W, p, runs, t, h1, cell, table, ragGrid, boxed, writeLines } = DP;
const { Document, Packer, Paragraph, TableRow, ImageRun, AlignmentType, HeightRule, VerticalAlign, Header, Footer, PageNumber, TextRun } = D;
const { picFile } = require('./living-things-kit');
const WORDS = require('./living-things-words');

const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 964, right: 964 } };
const LIVE_FILL = '237D38', STONE_FILL = '5E6B78';

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
  function top(titleText, criteria, bank, bankSize = 16) {
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

  /** Pictures in a row (or rows) of `per`, each with a number and a writing line under it. */
  function writeGrid(keys, per = 3, px = 74) {
    const w = Math.floor(PAGE_W / per);
    const rows = [];
    for (let r = 0; r < keys.length; r += per) {
      rows.push(new TableRow({
        cantSplit: true,
        children: keys.slice(r, r + per).map((k, j) => cell([
          runs([t(`${r + j + 1}`, { bold: true, size: 12, color: C.accent })], { after: 0 }),
          picPara(Array.isArray(k) ? k : [k], px, { before: 0, after: 30 }),
          ...writeLines(1, w - 700, { keepNext: false }),
        ], { w, valign: VerticalAlign.TOP })),
      }));
    }
    return table(rows, Array(per).fill(w));
  }

  /** Named pictures to sort, then the two boxes (living / non-living) with one slot per word. */
  function sortChart(keys, per = Math.min(keys.length, 6)) {
    const w = Math.floor(PAGE_W / per);
    const rows = [];
    for (let r = 0; r < keys.length; r += per) {
      rows.push(new TableRow({
        cantSplit: true,
        children: keys.slice(r, r + per).map((k) => cell([
          picPara([k], 44, { before: 20, after: 60 }), p(WORDS.name(k), { size: 12, bold: true, align: AlignmentType.CENTER, after: 0 }),
        ], { w })),
      }));
    }
    const q4 = Math.floor(PAGE_W / 4);
    const box = (label, fill) => cell([p(label, { size: 13, bold: true, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 })], { w: 2 * q4, span: 2, fill });
    const slot = () => cell(writeLines(1, q4 - 300, { keepNext: false, height: 40 }), { w: q4 });
    const slotRows = Math.ceil(Math.max(...['living', 'non-living'].map((k) => keys.filter((x) => WORDS.kind(x) === k).length)) / 2);
    return [
      table(rows, Array(per).fill(w)),
      p('', { size: 4, after: 100, keepNext: true }),
      table([new TableRow({ cantSplit: true, children: [box('living', LIVE_FILL), box('non-living', STONE_FILL)] }),
             ...Array.from({ length: slotRows }, () => new TableRow({ cantSplit: true, children: [slot(), slot(), slot(), slot()] }))], [q4, q4, q4, q4]),
    ];
  }

  /**
   * Sentences: a picture, then the sentence with one gap; a row with `whole` is a whole sentence to write.
   * rows: { key, pre, post } or { key, whole: true }.
   */
  function sentences(rows, start = 1) {
    const w1 = 1500, w2 = PAGE_W - w1;
    return table(rows.map((r, i) => new TableRow({
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

  /** The finished box, the Gemini line, and the answers, upside down. */
  async function tail(answers, finished) {
    const k = [];
    if (finished) {
      k.push(boxed([p(finished, { size: 11.5, bold: true, after: 60 }), ...writeLines(2, PAGE_W - 400, { keepNext: false })], { colour: C.rule, weight: 4, fill: 'F4F8EF' }));
      k.push(p('', { size: 4, after: 80 }));
    }
    k.push(boxed(p('Gemini: ask it to check your sentences. Do not ask it to write them for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F8EF' }));
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

  return { DP, C, PAGE_W, p, runs, t, cell, table, boxed, writeLines, pic, picPara, sect, how, top, writeGrid, sortChart, sentences, tail, write, Paragraph, PageBreak: D.PageBreak, TableRow, AlignmentType, VerticalAlign, HeightRule };
};

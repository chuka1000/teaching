/**
 * Y8 Science, Unit 3 Prokaryotes: worksheet furniture every lesson in the unit shares (TEMPLATE.md, "The worksheet": three tiers, each a fully
 * worked example, a half-worked one, then blanks, mixed on purpose; a RAG grid; a "why does that step work?" prompt; a "where would you meet this?"
 * prompt; the answers UPSIDE DOWN at the foot of the last page). Culture print palette.
 *
 *   const WS = require('./prokaryotes-sheet')({ lesson: 'Inside A Prokaryote', header: 'Prokaryotes, Lesson 1', banner: '...', criteria: [...], answers: ANS });
 *   const k = WS.begin();                                // title, name line, banner, RAG grid, how-to
 *   k.push(WS.tier('BRONZE'), WS.note('...'), ...WS.box('WORKED EXAMPLE', [...]), WS.q('1', '...', 2), WS.ruled(1), ...);
 *   await WS.write(k);                                    // appends the Gemini line and the answers, writes out/<lesson>/<lesson> worksheet.docx
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('culture');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed, cell, table } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, PageBreak, ImageRun, TableRow, VerticalAlign } = D;

const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const PICS = path.join(__dirname, '..', 'assets', 'pictures');
const PHOTOS = path.join(__dirname, '..', 'assets', 'photos');


/** Width and height of a PNG or JPEG, read from the file header (no async metadata call needed). */
function imgDims(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('not a PNG or JPEG');
}

module.exports = function sheet({ lesson, header, banner, criteria, answers, how }) {
  const OUT = path.join(__dirname, '..', 'out', lesson);
  fs.mkdirSync(OUT, { recursive: true });
  const head = (right) => new Header({ children: [runs([t(`Y8 Science  ·  ${header}  ·  `, { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
  const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
  const sp = () => p('', { size: 4, after: 40, keepNext: true });
  const FILL = 'EFE6EF';

  /** A shaded box: a bold title, then lines (a line may be a string or a list of runs). */
  const box = (title, lines, o = {}) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => (typeof l === 'string'
    ? p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }) : l))], { colour: C.rule, weight: 4, fill: o.fill || FILL }), sp()];

  /** An image as an inline picture (width in px at 96 dpi; the file's aspect ratio is kept). `type` is required or Word shows nothing. */
  function image(file, widthPx, o = {}) {
    const full = path.isAbsolute(file) ? file : fs.existsSync(path.join(PICS, file)) ? path.join(PICS, file) : path.join(PHOTOS, file);
    const buf = fs.readFileSync(full);
    const dims = imgDims(buf);
    return new Paragraph({
      alignment: o.align ?? AlignmentType.CENTER, spacing: { before: o.before ?? 40, after: o.after ?? 60 }, keepNext: o.keepNext ?? true, keepLines: true,
      children: [new ImageRun({ type: full.endsWith('.jpg') ? 'jpg' : 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * dims.h / dims.w) } })],
    });
  }

  /** The tier heading. */
  const tierHead = (name, blurb) => [tier(name), p(blurb, { size: 10, italic: true, color: C.soft, after: 60 })];

  function begin() {
    const k = [];
    k.push(h1(lesson));
    k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
    k.push(boxed(p(banner, { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'EEF5DB' }));
    k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
    k.push(ragGrid(criteria));
    k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t(how || 'choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Model answers are on the last page, upside down. Mark your own in a different colour.', { size: 10.5 })], { before: 160, after: 80 }));
    return k;
  }

  async function write(children, geminiLine) {
    children.push(p('', { after: 80 }));
    children.push(boxed(p(geminiLine || 'Gemini: ask it to check a finished answer. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'EEF5DB' }));
    children.push(...await DP.answersBlock(answers));
    const doc = new Document({
      styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
      sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children }],
    });
    const buf = await Packer.toBuffer(doc);
    const name = `${lesson} worksheet.docx`;
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
  }

  return { DP, C, PAGE_W, imgDims, p, runs, t, q, ruled: ruledBox, boxed, cell, table, box, image, begin, write, tier: tierHead, sp,
    note: (s) => p(s, { size: 10, italic: true, color: C.soft, after: 60 }), pageBreak: () => new Paragraph({ children: [new PageBreak()] }),
    Paragraph, AlignmentType, TableRow, VerticalAlign, TextRun };
};

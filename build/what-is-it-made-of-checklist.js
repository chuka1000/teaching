/**
 * T3 Developing Science (CLIL), Unit 8 Lessons 4 and 5: the teacher's oral-check sheet, "What Is It Made Of oral check.docx".
 * THE UNIT PLAN'S ASSESSMENT: "Descriptive Sentences: teacher points to a sample and the student describes it using the target structures".
 * For the teacher only (students never see it): one row a student, four things to tick at 2 (alone), 1 (with help) or 0 (not yet).
 * The four samples and their model sentences come from build/what-is-it-made-of-answers.js, the same module as the deck and the worksheet.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, p, runs, t, h1, cell, table, boxed } = DP;
const { Document, Packer, Paragraph, TableRow, AlignmentType, VerticalAlign, HeightRule, Header, Footer, PageNumber, TextRun, PageOrientation } = D;
const ANS = require('./what-is-it-made-of-answers');

const OUT = path.join(__dirname, '..', 'out', 'What Is It Made Of');
const W = 16838 - 2 * 900;           // landscape A4 minus margins, in twips

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const k = [];
  k.push(h1('Oral check: describe a sample'));
  k.push(runs([t('T3 Developing Science · The Periodic Table · Lessons 4 and 5 · Tuesday 10 November 2026 · ', { size: 10, color: C.soft }), t('for the teacher only', { size: 10, bold: true, color: C.soft })], { after: 100 }));
  k.push(boxed([
    runs([t('How it runs. ', { bold: true, size: 10.5 }), t('A pair comes to the sample table (about 40 seconds each). Point at ONE vial and ask: "What is this?" The student says the whole sentence: ', { size: 10.5 }), t('This is ___. It is a ___. It is ___.', { size: 10.5, bold: true }), t(' Then point at a second vial for the partner. A student who stalls gets the frame on the slide, then you tick 1.', { size: 10.5 })], { after: 60 }),
    runs([t('Score each box. ', { bold: true, size: 10.5 }), t('2 = said alone.   1 = said with help (the frame, a repeat, a point).   0 = not yet. Any true sentence from the unit is right ("Sulfur does not conduct electricity." counts as the whole sentence).', { size: 10.5 })], { after: 0 }),
  ], { colour: C.rule, weight: 4, fill: 'F4F8FA' }));
  k.push(p('', { size: 4, after: 60 }));

  // the four vials and what to expect
  const sw = [1700, 1700, W - 3400 - 4200 - 0, 4200];
  const hdr = (s, w) => cell(p(s, { size: 9.5, bold: true, color: C.dark, after: 0 }), { w, fill: C.headFill });
  k.push(table([
    new TableRow({ tableHeader: true, children: [hdr('Vial', sw[0]), hdr('Class', sw[1]), hdr('The sentence to listen for', sw[2]), hdr('Check against your vial', sw[3])] }),
    ...ANS.SAMPLES.map((key) => new TableRow({ cantSplit: true, children: [
      cell(p(ANS.name(key), { size: 10, bold: true, after: 0 }), { w: sw[0] }),
      cell(p(ANS.cls(key), { size: 10, after: 0 }), { w: sw[1] }),
      cell(p(ANS.describe(key), { size: 10, after: 0 }), { w: sw[2] }),
      cell(p(key === 'silicon' ? 'Shiny, and a non-metal: the one that tests the table.' : key === 'carbon' ? 'Black, not shiny (if it is shiny graphite, accept "shiny").' : 'Accept what the student SEES in the vial.', { size: 9.5, color: C.soft, after: 0 }), { w: sw[3] }),
    ] })),
  ], sw));
  k.push(p('', { size: 4, after: 80 }));

  // the class list
  const w0 = 3400, wc = 1900, wn = W - w0 - 4 * wc - 1500, ws = 1500;
  const cols = [w0, wc, wc, wc, wc, ws, wn];
  const H = ['Name', 'Says the name', 'Metal or non-metal', 'Shiny or not shiny', 'Whole sentence', 'Vial', 'Notes'];
  const circle = () => p('2      1      0', { size: 11, bold: true, align: AlignmentType.CENTER, after: 0, color: C.dark });
  const rowsOut = [new TableRow({ tableHeader: true, cantSplit: true, children: H.map((s, i) => hdr(s, cols[i])) })];
  for (let i = 0; i < 25; i++) {
    rowsOut.push(new TableRow({ cantSplit: true, height: { value: 480, rule: HeightRule.ATLEAST }, children: cols.map((w, c) => cell(c >= 1 && c <= 4 ? circle() : p('', { after: 0 }), { w, valign: VerticalAlign.CENTER })) }));
  }
  k.push(table(rowsOut, cols));
  k.push(p('', { size: 4, after: 60 }));
  k.push(p('Total the four boxes for each student (out of 8). 7 or 8: ready. 5 or 6: say the frame again with the gestures next time. 4 or under: pair with a stronger speaker and use the pictures first. The ticks are yours: students never see this sheet.', { size: 9.5, italic: true, color: C.soft }));

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 22, color: C.ink } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 800, bottom: 800, left: 900, right: 900 } } },
      headers: { default: new Header({ children: [runs([t('T3 Developing Science  ·  The Periodic Table  ·  ', { size: 8.5, color: C.soft }), t('Oral check', { size: 8.5, color: C.soft, bold: true })], { after: 0 })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] }) },
      children: k,
    }],
  });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT, 'What Is It Made Of oral check.docx'), buf);
  console.log('written: What Is It Made Of oral check.docx', Math.round(buf.length / 1024) + ' KB');
})();

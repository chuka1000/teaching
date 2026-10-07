/**
 * Y7 Science, Averages, Graphs And Models, worksheet (7B). The PRACTICAL is plotting a set of
 * FABRICATED results, so this is a printed sheet with a real graph grid (the grid is drawn to a PNG
 * with PIL, because docx cannot draw). Every number comes from build/averages-graphs-and-models.data.json
 * and is checked in build/averages-graphs-and-models-check.py. Answers are printed UPSIDE DOWN on the
 * last page; there is no Answers slide.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const DP = require('../lib/docparts');
DP.useDocPalette('signal');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, cell, table, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, ImageRun, TableRow, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun } = D;
const DATA = require('./averages-graphs-and-models.data.json');

const LESSON = 'Averages, Graphs And Models';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

/* the blank graph grid: x 0 to 60 (a line every 5, labelled every 10), y 0 to 200 (a line every 10, labelled every 20) */
const GRID = path.join(os.tmpdir(), 'ago_grid.png');
const GW = 1800, GH = 1260;
const PY = `
import sys
from PIL import Image, ImageDraw, ImageFont
W, H = ${GW}, ${GH}
L, B, T, R = 200, 170, 40, 50
fp = None
for f in ["/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
    try: ImageFont.truetype(f, 20); fp = f; break
    except Exception: pass
font = ImageFont.truetype(fp, 40); small = ImageFont.truetype(fp, 34)
im = Image.new("RGB", (W, H), (255, 255, 255)); d = ImageDraw.Draw(im)
pw, ph = W - L - R, H - T - B
X = lambda v: L + pw * v / 60.0
Y = lambda v: T + ph - ph * v / 200.0
for v in range(0, 61, 5): d.line([(X(v), T), (X(v), T + ph)], fill=(150, 170, 198) if v % 10 == 0 else (214, 224, 238), width=3 if v % 10 == 0 else 2)
for v in range(0, 201, 10): d.line([(L, Y(v)), (L + pw, Y(v))], fill=(150, 170, 198) if v % 20 == 0 else (214, 224, 238), width=3 if v % 20 == 0 else 2)
d.line([(L, T), (L, T + ph)], fill=(21, 57, 92), width=6); d.line([(L, T + ph), (L + pw, T + ph)], fill=(21, 57, 92), width=6)
for v in range(0, 61, 10):
    s = str(v); w = d.textlength(s, font=font); d.text((X(v) - w / 2, T + ph + 14), s, fill=(14, 42, 64), font=font)
for v in range(0, 201, 20):
    s = str(v); w = d.textlength(s, font=font); d.text((L - 22 - w, Y(v) - 22), s, fill=(14, 42, 64), font=font)
msg = "x-axis title and units"; w = d.textlength(msg, font=small); d.text((L + pw / 2 - w / 2, H - 62), msg, fill=(170, 178, 190), font=small)
msg = "y-axis title and units"; w = d.textlength(msg, font=small)
tmp = Image.new("RGBA", (int(w) + 10, 50), (255, 255, 255, 0)); ImageDraw.Draw(tmp).text((5, 4), msg, fill=(170, 178, 190), font=small)
tmp = tmp.rotate(90, expand=True); im.paste(tmp, (6, int(T + ph / 2 - tmp.size[1] / 2)), tmp)
im.save(sys.argv[1])
`;
fs.writeFileSync(path.join(os.tmpdir(), 'ago_grid.py'), PY);
execFileSync('python3', [path.join(os.tmpdir(), 'ago_grid.py'), GRID]);

/** An image. `type` is required by docx 9.x or the media part is ".undefined". */
const fig = (file, w, hOverW) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, keepNext: false,
  children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: w, height: Math.round(w * hOverW) } })],
});

const head = (right) => new Header({ children: [runs([t('Y7 Science  ·  Averages, Graphs And Models  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/* the results table: Mean and Range are left blank for the students */
function resultsTable() {
  const W6 = [1900, 1380, 1380, 1380, 1969, 1969];
  const hdr = (txt, w) => cell(p(txt, { bold: true, size: 9.5, align: AlignmentType.CENTER, after: 0, color: C.dark }), { w, fill: C.headFill });
  const body = (txt, w, bold) => cell(p(String(txt), { size: 11, bold, align: AlignmentType.CENTER, after: 0 }), { w });
  const rows = [new TableRow({ children: [hdr('Ramp height (cm)', W6[0]), hdr('Trial 1 (cm)', W6[1]), hdr('Trial 2 (cm)', W6[2]), hdr('Trial 3 (cm)', W6[3]), hdr('Mean (cm)', W6[4]), hdr('Range (cm)', W6[5])] })];
  DATA.heights.forEach((h, i) => rows.push(new TableRow({ height: { value: 480, rule: D.HeightRule.ATLEAST }, children: [
    body(h, W6[0], true), ...DATA.trials[i].map((v, c) => body(v, W6[c + 1])), body('', W6[4]), body('', W6[5])] })));
  return table(rows, W6);
}

function worksheet(answers) {
  const k = [];
  k.push(h1('Averages, Graphs And Models'));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('The mean gives the typical result, a graph shows the pattern, and a model predicts.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'E3EDF6' }));
  k.push(runs([t('The practical: ', { bold: true, size: 10.5 }), t('a group rolled a toy car down ramps of different heights. They rolled it three times from each height and measured how far it travelled. These results were made up for today, but real results look like this. Questions 1 to 10 have their answers on the last page, upside down.', { size: 10.5 })], { before: 160, after: 120 }));
  k.push(p('Distance the car rolled', { size: 9.5, bold: true, color: C.dark, after: 40 }));
  k.push(resultsTable());

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Mean and range.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('1', 'Complete the Mean column of the table. Show your working for the 10 cm ramp here.', { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Complete the Range column of the table.', { marks: 3 }));
  k.push(q('3', 'Which ramp height gave the most precise results? Explain your answer using the range.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('4', 'State the independent variable and the dependent variable in this practical.', { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('SILVER'));
  k.push(p('Choose the graph, plot it, draw the line.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('5', 'Choose the best graph for each set of data: bar chart, line graph or pie chart.  (a) The temperature of a cup of tea every minute for 20 minutes.  (b) The number of students who chose each of four favourite sports.  (c) The percentage of air that is nitrogen, oxygen and other gases.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'Plot the five MEAN distances on the grid. Write a title and units on each axis. The independent variable goes on the x-axis.', { marks: 4 }));
  k.push(fig(GRID, 600, GH / GW));
  k.push(q('7', 'Draw a line of best fit on the same grid, with a ruler.', { marks: 2 }));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Reasoning. This goes past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(q('8', 'Use your line of best fit to predict how far the car would roll from a 35 cm ramp. Show on the graph how you found it.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Predict how far it would roll from a 100 cm ramp. Explain why this prediction is less trustworthy than your answer to Q8.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Your line of best fit is a model. Explain what the model is for, and give one limit.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q9 and Q10. Do not ask it to solve a question you have not tried yourself first.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E3EDF6' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./averages-graphs-and-models-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

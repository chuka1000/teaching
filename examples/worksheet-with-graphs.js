/**
 * Y10 Motion Graphs worksheet.
 *
 * Questions 1 to 10 are the ones answered on the ANSWERS slide, in that exact
 * order and with the same numbers, so students mark their own. The graphs are
 * rendered to PNG first (docx cannot draw), and ImageRun needs an explicit
 * `type` or Word shows nothing.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const DP = require('./lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, PAGE_W, p, runs, t, h1, h2, tier, cell, table, ruledBox, ragGrid, q,
        line, none, boxed } = DP;
const { Document, Packer, Paragraph, TextRun, ImageRun, TableRow, PageBreak,
        AlignmentType, HeightRule, VerticalAlign, Header, Footer, PageNumber } = D;

const OUT = path.join(__dirname, 'out');
const GDIR = path.join(__dirname, 'ws_graphs');
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

/* ------------------------------------------------------------------ *
 * Graph rendering. Python + PIL, because the worksheet needs real
 * gridded axes students can read values off.
 * ------------------------------------------------------------------ */
fs.mkdirSync(GDIR, { recursive: true });
const PY = `
import json, sys
from PIL import Image, ImageDraw, ImageFont
W,H = 900, 620
PAD_L, PAD_B, PAD_T, PAD_R = 115, 90, 58, 34
INK=(20,26,48); GRID=(222,228,240); LINE=(31,182,188); AX=(90,100,128)
try:
    f  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    fs_= ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
except Exception:
    f = fs_ = ImageFont.load_default()

def draw(spec, out):
    xs, ys = spec["xmax"], spec["ymax"]
    im = Image.new("RGB",(W,H),(255,255,255)); d = ImageDraw.Draw(im)
    pw, ph = W-PAD_L-PAD_R, H-PAD_T-PAD_B
    X = lambda v: PAD_L + pw*v/xs
    Y = lambda v: PAD_T + ph - ph*v/ys
    for i in range(spec["xdiv"]+1):
        x = X(xs*i/spec["xdiv"]); d.line([(x,PAD_T),(x,PAD_T+ph)], fill=GRID, width=2)
    for i in range(spec["ydiv"]+1):
        y = Y(ys*i/spec["ydiv"]); d.line([(PAD_L,y),(PAD_L+pw,y)], fill=GRID, width=2)
    d.line([(PAD_L,PAD_T),(PAD_L,PAD_T+ph)], fill=AX, width=4)
    d.line([(PAD_L,PAD_T+ph),(PAD_L+pw,PAD_T+ph)], fill=AX, width=4)
    for i in range(spec["xdiv"]+1):
        v = xs*i/spec["xdiv"]; lab = ("%g"%v)
        d.text((X(v)-8, PAD_T+ph+10), lab, fill=INK, font=fs_)
    for i in range(spec["ydiv"]+1):
        v = ys*i/spec["ydiv"]; lab = ("%g"%v)
        d.text((PAD_L-18-10*len(lab), Y(v)-12), lab, fill=INK, font=fs_)
    if spec.get("pts"):
        d.line([(X(a),Y(b)) for a,b in spec["pts"]], fill=LINE, width=6, joint="curve")
    d.text((10, 8), spec["ylab"], fill=INK, font=f)
    d.text((W-PAD_R-90, H-34), spec["xlab"], fill=INK, font=f)
    im.save(out)

for spec in json.load(open(sys.argv[1])):
    draw(spec, spec["file"])
print("graphs drawn")
`;
fs.writeFileSync('/tmp/ws_graph.py', PY);

const GRAPHS = [
  { file: path.join(GDIR, 'g3.png'), ylab: 's / m', xlab: 't / s', xmax: 10, ymax: 40,
    xdiv: 5, ydiv: 4, pts: [[0, 0], [5, 15], [10, 30]] },
  { file: path.join(GDIR, 'g4.png'), ylab: 's / m', xlab: 't / s', xmax: 10, ymax: 40,
    xdiv: 5, ydiv: 4, pts: [[0, 0], [3, 24], [7, 24], [10, 0]] },
  { file: path.join(GDIR, 'g5.png'), ylab: 'v / m s\u207B\u00B9', xlab: 't / s', xmax: 8, ymax: 20,
    xdiv: 4, ydiv: 4, pts: [[0, 0], [4, 10], [8, 10]] },
  { file: path.join(GDIR, 'g6.png'), ylab: 'v / m s\u207B\u00B9', xlab: 't / s', xmax: 8, ymax: 20,
    xdiv: 4, ydiv: 4, pts: [[0, 0], [4, 15], [8, 15]] },
  { file: path.join(GDIR, 'g7.png'), ylab: 'v / m s\u207B\u00B9', xlab: 't / s', xmax: 10, ymax: 20,
    xdiv: 5, ydiv: 4, pts: [[0, 18], [10, 4]] },
  { file: path.join(GDIR, 'g10.png'), ylab: 's / m', xlab: 't / s', xmax: 10, ymax: 40,
    xdiv: 5, ydiv: 4, pts: [[0, 0], [2, 2], [4, 7], [6, 16], [8, 27], [10, 40]] },
  { file: path.join(GDIR, 'blank_vt.png'), ylab: 'v / m s\u207B\u00B9', xlab: 't / s', xmax: 10, ymax: 20,
    xdiv: 5, ydiv: 4, pts: null },
];
fs.writeFileSync('/tmp/ws_graphs.json', JSON.stringify(GRAPHS));
console.log(execFileSync('python3', ['/tmp/ws_graph.py', '/tmp/ws_graphs.json']).toString().trim());

/** An image. `type` is required by docx 9.x or the media part is ".undefined". */
const fig = (file, w = 340) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 80, after: 80 },
  children: [new ImageRun({
    type: 'png', data: fs.readFileSync(file),
    transformation: { width: w, height: Math.round(w * 620 / 900) },
  })],
});

const SUCCESS = [
  'I can find a velocity from the gradient of a displacement\u2013time graph.',
  'I can find an acceleration from the gradient of a velocity\u2013time graph.',
  'I can find a displacement from the area under a velocity\u2013time graph.',
  'I can put the right units on every answer.',
  'I can sketch a graph from a description of a motion.',
];

const head = (right) => new Header({ children: [runs([
  t('Y10 Physics  \u00b7  Motion Graphs  \u00b7  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Motion Graphs'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(34), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.',
    { size: 9.5, italic: true, color: C.soft, after: 120 }));
  k.push(ragGrid(SUCCESS));
  k.push(runs([
    t('Non-calculator. Units on every answer. ', { bold: true, size: 10.5 }),
    t('Questions 1 to 10 are on the board at the end \u2014 mark them yourself in a different colour.', { size: 10.5 }),
  ], { before: 200, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Read it \u2014 take values straight off the axes.',
    { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'What does the gradient of a displacement\u2013time graph tell you?', { marks: 1 }));
  k.push(ruledBox(1));
  k.push(q('2', 'What does the gradient of a velocity\u2013time graph tell you?', { marks: 1 }));
  k.push(ruledBox(1));

  k.push(q('3', 'Find the velocity from this graph. Show your working.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'g3.png')));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('4', 'Describe what is happening between 3 s and 7 s on this graph.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'g4.png')));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Calculate \u2014 gradients and areas.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('5', 'Find the acceleration during the first 4 s. Show your working.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'g5.png')));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('6', 'Find the total displacement over the 8 s. Split the area into shapes and show each one.', { marks: 3 }));
  k.push(fig(path.join(GDIR, 'g6.png')));
  k.push(ruledBox(4));

  k.push(q('7', 'Describe the motion shown by this graph. Be careful \u2014 the line falls but stays above the axis.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'g7.png')));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(q('8', 'A velocity\u2013time graph has an area of 45 under it. What quantity is that, and what are its units? Explain how you know from the axes.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(q('9', 'Sketch the acceleration\u2013time graph for an object with a constant acceleration of 3 m s\u207B\u00B2 for 6 s.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'blank_vt.png')));
  k.push(p('(Relabel the y-axis before you sketch.)', { size: 9.5, italic: true, color: C.soft, after: 160 }));

  k.push(q('10', 'This displacement\u2013time graph is a curve. Describe the motion and explain how the graph shows it.', { marks: 2 }));
  k.push(fig(path.join(GDIR, 'g10.png')));
  k.push(ruledBox(2));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Reason \u2014 these are not on the answer slide. We will take them out loud.',
    { size: 10, italic: true, color: C.alert, after: 60 }));

  k.push(q('11', 'A cyclist rides away from home at a steady speed for 20 s, stops for 10 s, then returns home faster than she left. Sketch the displacement\u2013time graph and label all three parts.', { marks: 4 }));
  k.push(fig(path.join(GDIR, 'blank_vt.png')));
  k.push(p('(Relabel the axes.)', { size: 9.5, italic: true, color: C.soft, after: 160 }));

  k.push(q('12', ['A student says: ', t('"The steeper the line, the faster the object, on any motion graph."', { italic: true, size: 10.5 }), t(' Explain why this is only sometimes true.', { size: 10.5 })], { marks: 3 }));
  k.push(ruledBox(4));

  k.push(q('13', 'Two velocity\u2013time graphs have exactly the same area but different shapes. What is the same about the two journeys, and what is different?', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(q('14', 'Explain why the area under a displacement\u2013time graph is of no use to a physicist. Use units in your answer.', { marks: 3 }));
  k.push(ruledBox(4));

  k.push(q('15', 'An object has a positive velocity and a negative acceleration. Describe its motion, and sketch the velocity\u2013time graph that shows it.', { marks: 4 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check a completed calculation or challenge your reasoning. Do not ask it to read a graph for you \u2014 it is unreliable at that, and the graph is the whole skill.',
    { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'F4F6FB' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = 'Motion Graphs worksheet.docx';
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

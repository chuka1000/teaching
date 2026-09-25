const D = require('docx');
const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
        ShadingType, HeightRule, AlignmentType, VerticalAlign } = D;

// Print palette. Darker than the on-screen deck colours on purpose: thin text
// on white needs more contrast than fat text on a coloured slide.
const C = {
  dark: '0E3A3F', accent: 'B98400', support: '227A53', alert: 'C0431F',
  ink: '14282B', soft: '5C7175', rule: 'C9C4B4', tint: 'FAF4E6', headFill: 'EFE7D4',
  bronze: 'CD7F52', silver: '78868E', gold: 'B98400',
};

const DOC_PALETTES = {
  prasae: { ...C },
  // "First Question" — Y7 Unit 1
  firstq: {
    dark: '4A2C6F', accent: 'B5701A', support: '1C7C78', alert: 'B3324C',
    ink: '241535', soft: '6A6180', rule: 'D5CEE2', tint: 'F7F4FB', headFill: 'EDE6F5',
    bronze: 'A8552E', silver: '6F6880', gold: 'B5701A',
  },


  // "Nucleus" — Y7 CLIL Atoms
  nucleus: {
    dark: '123B54', accent: 'A9741A', support: '05795C', alert: 'C42B50',
    ink: '0E2A3B', soft: '5B7484', rule: 'C4D5DE', tint: 'F4F8FA', headFill: 'DFEBF1',
    bronze: 'A85C3C', silver: '6D7F8A', gold: 'A9741A',
  },

  // "Night Highway" — A.1 Kinematics
  motion: {
    dark: '17203F', accent: 'C25A16', support: '0E7E83', alert: 'B32450',
    ink: '141A30', soft: '5A6480', rule: 'C3C8D8', tint: 'F2F4FA', headFill: 'E4E8F2',
    bronze: 'B3455F', silver: '6B7490', gold: 'C25A16',
  },

  // "Signal" — Y7 Science, Scientific Research and Technology
  signal: {
    dark: '15395C', accent: '957D11', support: '00822F', alert: 'A32220',
    ink: '0E2A40', soft: '55708A', rule: 'C7D9EA', tint: 'F2F6FB', headFill: 'E3EDF6',
    bronze: 'A3512A', silver: '6A7E90', gold: '957D11',
  },

  // "Ballast" — Y10 Science, Density
  density: {
    dark: '0B3D4C', accent: 'C25A29', support: '167A5C', alert: 'B22A3A',
    ink: '0C2730', soft: '4E6D74', rule: 'C6D9DB', tint: 'EFF6F7', headFill: 'DEEBEC',
    bronze: 'A85030', silver: '6E838A', gold: 'C25A29',
  },

  // "Galapagos" — Y8 Science, Natural Selection
  galapagos: {
    dark: '1F3D2B', accent: 'A8651F', support: '327682', alert: '9A3624',
    ink: '182B1E', soft: '52685A', rule: 'CFC7A8', tint: 'F5F1E6', headFill: 'EFE9D6',
    bronze: 'A85830', silver: '6E8074', gold: 'A8651F',
  },

  // "Topsoil" — Y9 Science, Earth Resources
  topsoil: {
    dark: '3D2B1F', accent: '8F6D2A', support: '55707B', alert: '913A25',
    ink: '2A1D14', soft: '6B5A48', rule: 'D9C9A8', tint: 'F2EBDD', headFill: 'ECE1CB',
    bronze: 'A24A28', silver: '81715F', gold: '8F6D2A',
  },

  // "Number Revision" — Y8 Maths (8CN); matches examples/maths-worksheet.js
  maths: {
    dark: '2B2350', accent: 'B9531F', support: '1F6FB2', alert: 'C0392B',
    ink: '221C3C', soft: '5E5A70', rule: 'CFCADF', tint: 'F2F0F8', headFill: 'E7E3F2',
    bronze: 'A8632F', silver: '6C7680', gold: '9A6B00',
  },

  // Assessments are printed in BLACK AND WHITE (ASSESSMENT.md). No colour at all:
  // black text, grey rules and shading only.
  bw: {
    dark: '000000', accent: '000000', support: '000000', alert: '000000',
    ink: '000000', soft: '444444', rule: '8C8C8C', tint: 'FFFFFF', headFill: 'E6E6E6',
    bronze: '000000', silver: '000000', gold: '000000',
  },
};

/** Switch the print palette in place — helpers hold a reference to C. */
function useDocPalette(name) {
  const next = DOC_PALETTES[name];
  if (!next) throw new Error(`unknown doc palette: ${name}`);
  Object.keys(C).forEach((k) => { delete C[k]; });
  Object.assign(C, next);
  return C;
}
const FONT = 'Arial', HEAD = 'Georgia';

// A4 portrait minus 2cm margins = 9979 DXA of usable width
const PAGE_W = 9979;

const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const line = (color = C.rule, size = 4) => ({ style: BorderStyle.SINGLE, size, color });

function p(text, o = {}) {
  return new Paragraph({
    alignment: o.align,
    spacing: { before: o.before ?? 0, after: o.after ?? 80, line: o.line ?? 260 },
    indent: o.indent,
    keepNext: o.keepNext,
    keepLines: o.keepNext,
    border: o.border,
    children: [new TextRun({
      text, font: o.font || FONT, size: (o.size || 10.5) * 2,
      bold: o.bold, italics: o.italic, color: o.color || C.ink,
    })],
  });
}

function runs(children, o = {}) {
  // A bare string in children serialises as raw character content inside <w:p>,
  // which is element-only — Word rejects it. Coerce to a TextRun.
  const kids = children.map((c) => (typeof c === 'string'
    ? new TextRun({ text: c, font: FONT, size: (o.size || 10.5) * 2, color: C.ink })
    : c));
  return new Paragraph({
    alignment: o.align,
    spacing: { before: o.before ?? 0, after: o.after ?? 80, line: o.line ?? 260 },
    indent: o.indent,
    keepNext: o.keepNext,
    keepLines: o.keepNext,
    children: kids,
  });
}

const t = (text, o = {}) => new TextRun({
  text, font: o.font || FONT, size: (o.size || 10.5) * 2,
  bold: o.bold, italics: o.italic, color: o.color || C.ink, subScript: o.sub, superScript: o.sup,
});

function h1(text) {
  return new Paragraph({
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text, font: HEAD, size: 40, bold: true, color: C.dark })],
  });
}
function h2(text) {
  return new Paragraph({
    spacing: { before: 260, after: 100 },
    keepNext: true,
    border: { bottom: line(C.dark, 8) },
    children: [new TextRun({ text, font: HEAD, size: 26, bold: true, color: C.dark })],
  });
}

/** BRONZE / SILVER / GOLD band. */
function tier(name) {
  const colour = { BRONZE: C.bronze, SILVER: C.silver, GOLD: C.gold }[name];
  const blurb = { BRONZE: 'fluency', SILVER: 'mixed practice', GOLD: 'reasoning' }[name];
  return new Paragraph({
    spacing: { before: 180, after: 90 },
    keepNext: true,
    children: [
      new TextRun({ text: `${name}  `, font: FONT, size: 20, bold: true, color: colour }),
      new TextRun({ text: `(${blurb})`, font: FONT, size: 18, italics: true, color: C.soft }),
    ],
  });
}

function cell(children, o = {}) {
  return new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    columnSpan: o.span,
    verticalAlign: o.valign || VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    borders: o.borders,
    children: Array.isArray(children) ? children : [children],
  });
}

function table(rows, columnWidths, o = {}) {
  return new Table({
    columnWidths,
    width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: o.borders || {
      top: line(), bottom: line(), left: line(), right: line(),
      insideHorizontal: line(), insideVertical: line(),
    },
    rows,
  });
}

/**
 * A bordered box of ruled lines with room to write.
 * `lines` rows at ~7mm each — enough for Y9 handwriting.
 */
function ruledBox(lines = 4, width = PAGE_W) {
  const rows = [];
  for (let i = 0; i < lines; i++) {
    rows.push(new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.EXACT },
      children: [cell(new Paragraph({ children: [], keepNext: i < lines - 1 }), {
        w: width,
        borders: {
          top: i === 0 ? line(C.soft, 6) : none,
          bottom: i === lines - 1 ? line(C.soft, 6) : line(C.rule, 3),
          left: line(C.soft, 6), right: line(C.soft, 6),
        },
      })],
    }));
  }
  return new Table({ columnWidths: [width], width: { size: width, type: WidthType.DXA },
    borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
    rows });
}

/** Red / amber / green self-rating grid against the success criteria. */
function ragGrid(criteria) {
  const wCrit = 5179, wCell = 800;
  const hdrCell = (txt, w, span) => cell(
    p(txt, { bold: true, size: 8.5, align: AlignmentType.CENTER, after: 0, color: C.dark }),
    { w, span, fill: C.headFill });

  const rows = [
    new TableRow({ children: [
      cell(p('Success criteria: colour or circle one', { bold: true, size: 9, after: 0, color: C.dark }), { w: wCrit, fill: C.headFill }),
      hdrCell('START of lesson', wCell * 3, 3),
      hdrCell('END of lesson', wCell * 3, 3),
    ] }),
    new TableRow({ children: [
      cell(p('', { after: 0 }), { w: wCrit, fill: C.headFill }),
      ...['R', 'A', 'G', 'R', 'A', 'G'].map((L, i) => cell(
        p(L, { bold: true, size: 9, align: AlignmentType.CENTER, after: 0,
               color: [C.alert, C.accent, C.support][i % 3] }),
        { w: wCell, fill: C.headFill })),
    ] }),
  ];
  criteria.forEach((c) => {
    rows.push(new TableRow({
      height: { value: 520, rule: HeightRule.ATLEAST },
      children: [
        cell(p(c, { size: 9.5, after: 0 }), { w: wCrit }),
        ...Array.from({ length: 6 }, () => cell(p('', { after: 0 }), { w: wCell })),
      ],
    }));
  });
  return table(rows, [wCrit, wCell, wCell, wCell, wCell, wCell, wCell]);
}

/** Numbered question stem. */
function q(code, text, o = {}) {
  return runs([
    t(`${code}  `, { bold: true, color: C.dark, size: 10.5 }),
    ...(Array.isArray(text) ? text : [t(text, { size: 10.5 })]),
    ...(o.marks ? [t(`\u00A0\u00A0[${o.marks}]`, { size: 9, color: C.soft, bold: true })] : []),
  ], { after: 90, indent: { left: 0 }, keepNext: true });
}

/**
 * The answers, at the end of the worksheet and UPSIDE DOWN.
 *
 * Students mark their own work, so the answers have to be on the page, but
 * upside down they cannot be read across a desk or copied down by mistake. The
 * text is rendered to a PNG with sharp and rotated 180 degrees, then placed as
 * an inline image (`type: 'png'` is required, see CLAUDE.md, Things that will
 * bite you, 3). A caption above it, the right way up, says what it is.
 *
 *   const block = await DP.answersBlock([['1', '28. 4 x 7.'], ...]);
 *   children.push(...block);
 *
 * Feed it the SAME list the Answers slide uses (keep the list in one module),
 * so the slide and the sheet cannot disagree.
 */
async function answersBlock(items, o = {}) {
  const sharp = require('sharp');
  const scale = 3, dispW = o.width || 640, gap = 24;             // display px; rendered at 3x
  const colW = Math.floor((dispW - gap) / 2) * scale;
  const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const half = Math.ceil(items.length / 2);
  const render = async (list) => {
    const markup = list.map(([n, a]) => `<b>${esc(n)}</b>   ${esc(a)}`).join('\n');
    return sharp({ text: { text: markup, font: 'Arial 9', width: colW, dpi: 96 * scale, rgba: true, spacing: 10 } }).png().toBuffer();
  };
  const [left, right] = [await render(items.slice(0, half)), await render(items.slice(half))];
  const [lm, rm] = [await sharp(left).metadata(), await sharp(right).metadata()];
  const canvasW = colW * 2 + gap * scale, canvasH = Math.max(lm.height, rm.height) + 16 * scale;
  const flat = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: '#FFFFFF' } })
    .composite([{ input: left, left: 0, top: 8 * scale }, { input: right, left: colW + gap * scale, top: 8 * scale }])
    .png().toBuffer();
  // rotate in a SECOND pass: sharp applies rotate() before composite() whatever the call order
  const png = await sharp(flat).rotate(180).png().toBuffer();
  const dispH = Math.round(canvasH * dispW / canvasW);
  return [
    new Paragraph({ spacing: { before: o.before ?? 240, after: 40 }, keepNext: true, children: [
      new TextRun({ text: 'Answers. ', font: FONT, size: 17, bold: true, color: C.soft }),
      new TextRun({ text: 'Turn the page upside down to check your work.', font: FONT, size: 17, italics: true, color: C.soft }),
    ] }),
    new Paragraph({ keepLines: true, children: [new D.ImageRun({
      type: 'png', data: png, transformation: { width: dispW, height: dispH },
      altText: { name: 'answers', title: 'Answers, printed upside down', description: items.map(([n, a]) => `${n} ${a}`).join(' ') },
    })] }),
  ];
}

module.exports = { D, C, FONT, HEAD, PAGE_W, p, runs, t, h1, h2, tier, cell, table,
                   ruledBox, ragGrid, q, line, none, answersBlock };

/**
 * A bordered callout box.
 *
 * Deliberately a one-cell table rather than a paragraph border: docx 9.7.1
 * emits <w:pBdr> children as top, bottom, left, right, but CT_PBdr requires
 * top, left, bottom, right — so any four-sided paragraph border produces a
 * file Word rejects. Cell borders are emitted in the right order.
 */
function boxed(children, o = {}) {
  const col = o.colour || C.rule;
  const w = o.w || PAGE_W;
  const b = { top: line(col, o.weight || 6), bottom: line(col, o.weight || 6),
              left: line(col, o.weight || 6), right: line(col, o.weight || 6) };
  return new Table({
    columnWidths: [w],
    width: { size: w, type: WidthType.DXA },
    borders: { top: b.top, bottom: b.bottom, left: b.left, right: b.right,
               insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({
      cantSplit: true,
      children: [cell(Array.isArray(children) ? children : [children],
                      { w, fill: o.fill, valign: VerticalAlign.TOP })],
    })],
  });
}

module.exports.boxed = boxed;

/**
 * An empty box to draw in. ruledBox() is for prose; horizontal rules get in
 * the way of a diagram, so a drawing answer gets one open rectangle instead.
 */
function blankBox(heightTwips = 2600, width = PAGE_W) {
  return new Table({
    columnWidths: [width],
    width: { size: width, type: WidthType.DXA },
    borders: {
      top: line(C.soft, 6), bottom: line(C.soft, 6),
      left: line(C.soft, 6), right: line(C.soft, 6),
      insideHorizontal: none, insideVertical: none,
    },
    rows: [new TableRow({
      cantSplit: true,
      height: { value: heightTwips, rule: HeightRule.EXACT },
      children: [cell(new Paragraph({ children: [] }), { w: width })],
    })],
  });
}

module.exports.blankBox = blankBox;

module.exports.useDocPalette = useDocPalette;
module.exports.DOC_PALETTES = DOC_PALETTES;

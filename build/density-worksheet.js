/**
 * Y10 Science — Density worksheet.
 * Questions 1-10 match the Answers slide exactly, in order. Every numeric
 * answer checked with sympy before it went into either file — see the
 * build/density.js header for the check.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('density');
const { D, C, FONT, PAGE_W, p, runs, t, h1, tier, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber } = D;

const LESSON = 'Density';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([
  t('Y10 Physics  ·  Density  ·  ', { size: 8.5, color: C.soft }),
  t(right, { size: 8.5, color: C.soft, bold: true }),
], { after: 0 })] });

const foot = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new (require('docx').TextRun)({ text: 'Page ', size: 16, color: C.soft, font: FONT }),
             new (require('docx').TextRun)({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })],
})] });

function worksheet() {
  const k = [];
  k.push(h1('Density'));
  k.push(runs([
    t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }),
    t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
    t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }),
  ], { after: 200 }));

  k.push(boxed(p('ρ = m ÷ V          units: g/cm³ or kg/m³          water = 1.0 g/cm³', {
    size: 14, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark,
  }), { colour: C.accent, weight: 10, fill: 'FFEEE4' }));

  k.push(runs([
    t('Show your working. ', { bold: true, size: 10.5 }),
    t('Every answer needs mass and volume in the right place. Units every time: g/cm³ or kg/m³.', { size: 10.5 }),
  ], { before: 160, after: 40 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Substitute, using ρ = m ÷ V.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('1', 'Find the density of a 24 g object with a volume of 3 cm³.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('2', 'Find the density of a 100 g object with a volume of 20 cm³.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', 'State the units of density, and explain what mass per unit volume means.', { marks: 2 }));
  k.push(ruledBox(2));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Rearrange, or work from liquid data.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('4', 'Find the volume of an object with a mass of 96 g and a density of 8 g/cm³.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('5', 'Find the mass of a piece of wood with a density of 2.5 g/cm³ and a volume of 40 cm³.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('6', 'Find the density of a liquid. An empty container has a mass of 38 g. The container and liquid together have a mass of 118 g. The liquid has a volume of 80 cm³.', { marks: 3 }));
  k.push(ruledBox(3));

  k.push(new Paragraph({ children: [new PageBreak()] }));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Displacement, then float or sink.', { size: 10, italic: true, color: C.soft, after: 60 }));

  k.push(q('7', 'Find the volume of a stone that raises a measuring cylinder\'s water level from 60 cm³ to 85 cm³.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('8', 'Find the density of the stone in Q7, given its mass is 200 g.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'Decide whether each of these floats or sinks in water, and explain your reasoning: ice (0.92 g/cm³) and aluminium (2.7 g/cm³).', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('10', 'Explain how a steel ship can float, even though steel itself sinks in water.', { marks: 2 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 160 }));
  k.push(boxed(p('Gemini: ask it to check your working for Q7 or Q8, or to explain why density (not weight) decides floating and sinking. Do not ask it to answer Q10 for you. Explaining it yourself is the point.', {
    size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'DEEBEC' }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(worksheet());
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

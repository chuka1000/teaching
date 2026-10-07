/**
 * Y10 Co-ordinated Science (0654), When The Resultant Is Zero, worksheet (10A). The fallback for the game. Per TEMPLATE.md, in each tier a fully
 * worked example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt
 * (Q8) and one "where would you meet this outside the lesson?" (Q12). Every number comes from build/when-the-resultant-is-zero-answers.js, so the
 * sheet and the answers cannot disagree; build/when-the-resultant-is-zero-check.py re-derives them. Newton's first law (P1.5.1.6). The two ideas kept apart on purpose: a ZERO RESULTANT (forces present, cancelling) and NO FORCES AT ALL.
 * Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, ImageRun, PageBreak } = D;
const A = require('./when-the-resultant-is-zero-answers');
const { D: N, R } = A;

const LESSON = 'When The Resultant Is Zero';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const head = (right) => new Header({ children: [runs([t('Y10 Co-ordinated Science (0654)  ·  When The Resultant Is Zero  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });
const sp = () => p('', { size: 4, after: 40, keepNext: true });

/** A free-body diagram picture. `type` is required by docx 9.x or the media part is ".undefined". */
const fig = (name, w) => {
  const file = path.join(__dirname, '..', 'assets', 'media', name + '.png');
  const b = fs.readFileSync(file); const iw = b.readUInt32BE(16), ih = b.readUInt32BE(20);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 60 }, keepNext: true,
    children: [new ImageRun({ type: 'png', data: b, transformation: { width: w, height: Math.round(w * ih / iw) } })] });
};
const sum = (a) => a.reduce((x, y) => x + y, 0);

function worksheet(answers) {
  const k = [];
  const box = (title, lines) => [boxed([p(title, { size: 9.5, bold: true, color: C.dark, after: 30 }), ...lines.map((l, i) => p(l, { size: 10, after: i === lines.length - 1 ? 0 : 20 }))], { colour: C.rule, weight: 4, fill: 'E4E8F2' }), sp()];
  k.push(h1(LESSON));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 200 }));
  k.push(boxed(p('No resultant force means no change in speed or direction. The forces can still be there.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'FFEFE2' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can state Newton’s first law.', 'I can explain why an object at constant speed has no resultant force.', 'I can explain what happens to an object with no forces acting at all.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Watch two phrases: “the resultant force is zero” (forces are there, and they cancel) and “there are no forces” (nothing pushes or pulls). They are not the same. Model answers are on the last page, upside down. Mark your own in a different colour. Units every time: N for force, and g = 9.8 N/kg.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Stating the law, and a steady speed.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A box slides along the floor at a steady speed. The push is ${N.w.push} N. Find the friction.`, `A steady speed means the speed is not changing, so the resultant force is 0 N. The forces cancel: the friction equals the push. Friction = ${N.w.friction} N.`]));
  k.push(q('1', 'Half-worked. Complete Newton’s first law. An object at ________ stays at rest, and a moving object keeps moving at a ________ ________ in a ________ line, unless a ________ force acts on it.', { marks: 5 }));
  k.push(ruledBox(1));
  k.push(q('2', 'State Newton’s first law in your own words, without looking at the line above.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', `A book with a weight of ${N.q3.weight} N rests on a table. Find the reaction force from the table, and the resultant force. Then say what happens to the book, and why.`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('4', 'The trolley moves at a steady speed. Find the resultant force on it. Say what happens to its speed.', { marks: 3 }));
  k.push(fig('wtrz-ws-q4', 270));
  k.push(ruledBox(2));
  k.push(q('5', `A car moves at a steady speed. The driving force is ${N.q5.driving} N. Find the total resistive force.`, { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Missing forces, and explaining.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A skydiver with a weight of ${N.sw.weight} N falls at a steady speed. Find the air resistance.`, `Steady speed: the resultant is 0 N, so the upward force equals the downward force. ${N.sw.weight} − air resistance = 0, so the air resistance is ${N.sw.weight} N. Weight and air resistance are both there: they cancel.`]));
  k.push(q('6', `Half-worked. The boat moves at a steady speed. Find the force X. The resultant is ____ N. Right: ${N.q6.right[0]} N. Left: ${N.q6.left[0]} + X. So ${N.q6.right[0]} = ${N.q6.left[0]} + X, and X = ____ − ____ = ____ N.`, { marks: 3 }));
  k.push(fig('wtrz-ws-q6', 340));
  k.push(ruledBox(1));
  k.push(q('7', 'A puck slides across ice and slows down until it stops. Explain, using forces, why it slows down.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('8', 'Why does that step work? In the worked example the skydiver falls at a steady speed, so we say the resultant force is 0 N. Why does a steady speed mean the resultant force is zero?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', 'A student says: “The book on the table is not moving, so there are no forces on it.” Explain what is wrong.', { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(new Paragraph({ children: [new PageBreak()] }));
  k.push(tier('GOLD'));
  k.push(p('Past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A probe is in deep space, far from every star and planet, moving at ${N.gw.speed} km/s with its engine off. Describe its motion.`, `Almost no forces act on it, so there is no resultant force. By the first law its motion does not change: it keeps moving at ${N.gw.speed} km/s in a straight line, for ever.`]));
  k.push(q('10', `Half-worked. The probe fires its engine and speeds up from ${N.q10.before} km/s to ${N.q10.after} km/s. Then the engine switches off. While the engine is on, the resultant force is ________ zero. After it switches off, the resultant force is ________. The probe then moves at ________ km/s in a ________ line.`, { marks: 4 }));
  k.push(ruledBox(1));
  k.push(q('11', `A lift of mass ${N.q11.mass} kg moves upwards at a steady speed. Use g = ${N.q11.g} N/kg. Find the tension in the cable.`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Describe a real situation where something moves at a steady speed, or stays at rest, even though forces act on it. Name the forces and say which way each acts.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('13', `A crate is pushed along the floor at a steady speed with a force of ${N.q13.steady} N. The push is then increased to ${N.q13.new} N. Find the resultant force on the crate, and say what happens to its speed.`, { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('14', 'Explain the difference between “the resultant force is zero” and “there are no forces”. Give one example of each.', { marks: 4 }));
  k.push(ruledBox(4));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q13 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E4E8F2' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./when-the-resultant-is-zero-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

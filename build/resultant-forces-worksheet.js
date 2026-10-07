/**
 * Y10 Co-ordinated Science (0654), Resultant Forces, worksheet (10A). The fallback for the game. Per TEMPLATE.md, in each tier a fully
 * worked example, a half-worked one, then blanks, mixed on purpose (interleaved), with a RAG grid, one "why does that step work?" prompt
 * (Q8) and one "where would you meet this outside the lesson?" (Q12). Every number comes from build/resultant-forces-answers.js, so the
 * sheet and the answers cannot disagree; build/resultant-forces-check.py re-derives them. Everything is along ONE straight line (P1.5.1.2).
 * Answers are printed UPSIDE DOWN on the last page.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('motion');
const { D, C, FONT, p, runs, t, h1, tier, ruledBox, ragGrid, q, boxed } = DP;
const { Document, Packer, Paragraph, AlignmentType, Header, Footer, PageNumber, TextRun, ImageRun } = D;
const A = require('./resultant-forces-answers');
const { D: N, R } = A;

const LESSON = 'Resultant Forces';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };
const head = (right) => new Header({ children: [runs([t('Y10 Co-ordinated Science (0654)  ·  Resultant Forces  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
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
  k.push(boxed(p('Resultant force = the forces one way, minus the forces the other way.', { size: 13, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'FFEFE2' }));
  k.push(p('Colour the START column now and the END column at the end of the lesson.', { size: 9.5, italic: true, color: C.soft, before: 120, after: 80 }));
  k.push(ragGrid(['I can name forces and sort them into contact and non-contact.', 'I can draw a free-body diagram for a simple situation.', 'I can determine the resultant of forces along a straight line.']));
  k.push(runs([t('How to use this sheet: ', { bold: true, size: 10.5 }), t('choose a tier. In each one read the worked example, finish the half-worked one, then do your own. The questions in a tier are mixed on purpose: you have to decide which method each one needs. That feels harder, and it is meant to. Every force here acts along one straight line. Model answers are on the last page, upside down. Mark your own in a different colour. Always give a size AND a direction. Units every time: N.', { size: 10.5 })], { before: 160, after: 80 }));

  /* ---- BRONZE ---- */
  k.push(tier('BRONZE'));
  k.push(p('Naming forces and drawing arrows.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', ['Contact or non-contact? “The push of your hand on a door.”', 'Do the two things touch? Yes: the hand touches the door. So it is a contact force.']));
  k.push(q('1', 'Half-worked. Sort each force: contact or non-contact. Friction: contact (done for you). Weight: __________. Tension in a rope: __________. Force between two magnets: __________.', { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('2', 'Air resistance is a contact force, but you cannot see anything touching. Explain why it is a contact force.', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('3', `A ${N.q3.weight} N book rests on a table. Draw the forces on the book as arrows from the box. Label each one with its name and its size. Then write the resultant force.`, { marks: 4 }));
  k.push(fig('rf-ws-q3-blank', 400));
  k.push(ruledBox(1));
  k.push(q('4', `Find the resultant force on the trolley.`, { marks: 2 }));
  k.push(fig('rf-ws-q4', 270));
  k.push(ruledBox(2));
  k.push(q('5', `Two forces act on a box. A push of ${N.q5.right[0]} N and a pull of ${N.q5.right[1]} N both act to the right. Find the resultant force.`, { marks: 2 }));
  k.push(ruledBox(2));

  /* ---- SILVER ---- */
  k.push(tier('SILVER'));
  k.push(p('Several forces, and why we subtract.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A cart has a ${N.w.right[0]} N force to the right and two forces to the left, ${N.w.left[0]} N and ${N.w.left[1]} N.`, `Right: ${N.w.right[0]} N.  Left: ${N.w.left[0]} + ${N.w.left[1]} = ${sum(N.w.left)} N.  Resultant: ${N.w.right[0]} − ${sum(N.w.left)} = ${R.w} N to the right.`]));
  k.push(q('6', 'Half-worked. Find the resultant force on the car. Right: ____ N. Left: ____ + ____ = ____ N. Resultant: ____ − ____ = ____ N, to the ________.', { marks: 3 }));
  k.push(fig('rf-ws-q6', 290));
  k.push(ruledBox(1));
  k.push(q('7', 'Find the resultant force on the boat. Give its size and its direction.', { marks: 3 }));
  k.push(fig('rf-ws-q7', 340));
  k.push(ruledBox(2));
  k.push(q('8', 'Why does that step work? In the worked example we subtract the forces that point left from the forces that point right. Why do we subtract forces that point opposite ways?', { marks: 2 }));
  k.push(ruledBox(2));
  k.push(q('9', `A ${N.q9.down[0]} N weight hangs at rest from a rope. The rope pulls up with ${N.q9.up[0]} N. A student says: “Nothing is moving, so no forces are acting.” Find the resultant force, and explain what the student gets wrong.`, { marks: 3 }));
  k.push(ruledBox(3));

  /* ---- GOLD ---- */
  k.push(tier('GOLD'));
  k.push(p('Working backwards, and past the lesson.', { size: 10, italic: true, color: C.soft, after: 60 }));
  k.push(...box('WORKED EXAMPLE. Read it; do not solve it.', [`A force of ${N.gw.right[0]} N acts to the right and an unknown force X acts to the left. The resultant is ${N.gw.resultant} N to the right.`, `The resultant is what is left over after X takes some away: ${N.gw.right[0]} − X = ${N.gw.resultant}. So X = ${N.gw.right[0]} − ${N.gw.resultant} = ${R.gwX} N.`]));
  k.push(q('10', `Half-worked. A force of ${N.q10.right[0]} N acts to the right and an unknown force Y acts to the left. The resultant is ${N.q10.resultant} N to the right. ${N.q10.right[0]} − Y = ____, so Y = ____ − ____ = ____ N.`, { marks: 3 }));
  k.push(ruledBox(1));
  k.push(q('11', `The lift in a hotel pulls a cage upwards with a force of ${N.q11.up[0]} N. The cage and its passengers weigh ${N.q11.down[0]} N. Find the resultant force on the cage, and say which way it points.`, { marks: 3 }));
  k.push(ruledBox(2));
  k.push(q('12', 'Where would you meet this idea outside the lesson? Describe a real situation where forces on an object balance, and one where they do not. Name the forces and say which way each acts.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('13', `Team A has ${N.q13.a[0]} people, each pulling with ${N.q13.a[1]} N. Team B has ${N.q13.b[0]} people, each pulling with ${N.q13.b[1]} N. They pull a rope in opposite directions. Find the resultant force on the rope and say which team is winning.`, { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('14', `A ${N.q14.mass} kg box hangs from a rope. The rope pulls up with a force of ${N.q14.tension} N. Use g = ${N.q14.g} N/kg. Find the resultant force on the box.`, { marks: 4 }));
  k.push(ruledBox(3));

  k.push(p('', { after: 80 }));
  k.push(boxed(p('Gemini: ask it to check a finished answer, especially Q13 and Q14. Do not ask it to do the question for you.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E4E8F2' }));
  k.push(...answers);
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./resultant-forces-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON} worksheet.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

/**
 * The Algebra Challenge (8CN). Not tied to one lesson: a cumulative, deliberately very hard
 * worksheet drawing on every Y8 Maths Algebra lesson so far — reference/Like Terms OLD.pptx,
 * Expanding Brackets OLD.pptx, Expand and Simplify.pptx (and its own worksheet/answers, which this
 * does not repeat: none of its numbers or scenarios are reused here), Putting Numbers In.pptx and
 * Function Machines.pptx. Asked for directly in chat, not the ASSESSMENT: template, so it follows
 * the ordinary worksheet build (colour, docparts, maths palette) rather than ASSESSMENT.md's
 * black-and-white pipeline — but borrows that document's good habits anyway: total marks and time
 * on the front page, answer space sized to marks, and every number checked with sympy
 * (build/algebra-challenge-check.py) before it went into the paper.
 *
 * EVERY QUESTION IS DELIBERATELY HARD, per the brief ("only very challenging questions... to
 * extremely, terrifyingly difficult"), so there is no easy opening section the way a lesson
 * worksheet has a Bronze tier. Difficulty still ramps, from "hard, one topic" (Part 1) to "hard,
 * two topics stitched together" (Part 2) to "hard, and you have to see why, not just compute"
 * (Part 3). Deliberately cross-topic wherever the maths allows it (substitute AND expand, simplify
 * a function-machine rule before reversing it, spot a genuinely correct claim as well as a wrong
 * one), because that is what "assesses skills from every lesson" means: not each topic's own worst
 * question repeated, but the topics actually meeting each other.
 *
 * No separate answers document (standing rule): the answers are printed upside down on the last
 * page, from build/algebra-challenge-answers.js, so the paper and the key cannot disagree.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('maths');
const { D, C, FONT, PAGE_W, p, runs, t, h1, ruledBox, q, boxed } = DP;
const { Document, Packer, Paragraph, PageBreak, AlignmentType, Header, Footer, PageNumber, TextRun } = D;

const LESSON = 'The Algebra Challenge';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const head = (right) => new Header({ children: [runs([t('Y8 Maths  ·  Algebra so far  ·  ', { size: 8.5, color: C.soft }), t(right, { size: 8.5, color: C.soft, bold: true })], { after: 0 })] });
const foot = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ text: 'Page ', size: 16, color: C.soft, font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.soft, font: FONT })] })] });

/** A part heading in the same visual weight as docparts' tier(), but for a custom title and blurb
 *  rather than the fixed BRONZE/SILVER/GOLD set, since nothing here is meant to read as easy. */
function partHeading(title, blurb) {
  return new Paragraph({
    spacing: { before: 260, after: 90 }, keepNext: true,
    children: [
      new TextRun({ text: `${title}  `, font: FONT, size: 20, bold: true, color: C.dark }),
      new TextRun({ text: `(${blurb})`, font: FONT, size: 18, italics: true, color: C.soft }),
    ],
  });
}

function worksheet(answers) {
  const k = [];
  k.push(h1('The Algebra Challenge'));
  k.push(p('Every skill from Collecting Like Terms, Expanding Brackets, Expand and Simplify, Putting Numbers In and Function Machines — pushed as hard as it goes.', { size: 10, italic: true, color: C.soft, after: 120 }));
  k.push(runs([t('Name: ', { bold: true, size: 10 }), t('_'.repeat(30), { color: C.rule, size: 10 }), t('  Class: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 }), t('  Date: ', { bold: true, size: 10 }), t('_'.repeat(10), { color: C.rule, size: 10 })], { after: 140 }));
  k.push(boxed(p('Time allowed: 60 minutes.  Total marks: 72.  Non-calculator.', { size: 12, bold: true, after: 0, align: AlignmentType.CENTER, color: C.dark }), { colour: C.accent, weight: 10, fill: 'E7E3F2' }));
  k.push(runs([
    t('Answer every question, in order. ', { bold: true, size: 10.5 }),
    t('There is no easy section to warm up on: every question here is meant to be hard, and the last few are meant to be very hard indeed. Show full working — a skipped step is usually where both the mark and the minute go missing. If a question asks you to explain or check, a correct final answer with no reasoning does not get full marks.', { size: 10.5 }),
  ], { before: 160, after: 60 }));

  /* ============================== PART 1 ============================== */
  k.push(partHeading('PART 1 — EXECUTE', 'one topic, but not a short one'));
  k.push(q('1', 'Expand and simplify: −3(2x − 5) + 4(x + 1)', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('2', 'Expand and simplify: 5(2a − 3b) − 2(a − 4b)', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('3', 'Simplify fully: 3p − 2q + 5p² − p + 4q − p²', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('4', 'The perimeter of a shape is 2(3x + 2y) − (x − y). Simplify this fully. Then find its value when x = 4 and y = −3.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('5', 'Find the value of 3(2n − 1) + 4n when n = −2.', { marks: 3 }));
  k.push(ruledBox(3));
  k.push(q('6', 'A function machine\'s rule is 3(n − 4) + 2n. Write the rule as a single simplified expression, then find the output when the input is 5.', { marks: 4 }));
  k.push(ruledBox(4));

  /* ============================== PART 2 ============================== */
  k.push(partHeading('PART 2 — REVERSE AND VERIFY', 'two topics, stitched together'));
  k.push(q('7', 'A function machine\'s rule, unsimplified, is 4(n + 2) − n. The output is 23. Simplify the rule, then find the input n.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('8', 'A student says the rule 3(n − 2) + 4 gives 16 when n = 6. Check this by substitution. Then, using the same simplified rule as a machine, find the input that gives an output of 40.', { marks: 5 }));
  k.push(ruledBox(5));
  k.push(q('9', 'Find the missing number: ____(3n − 2) + 5n = 14n − 6', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('10', 'Find the missing number in the bracket: 5(2p − ____) + 3p = 13p − 30', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('11', 'A student says: "4(3n − 1) − 2(n + 5) simplifies to 10n + 6." Check their answer. If it is wrong, name the mistake and give the correct simplified expression.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('12', 'A student says: "5(2m + 3) − 3(m + 5) simplifies to 7m." Check their working and state whether they are right.', { marks: 4 }));
  k.push(ruledBox(3));

  /* ============================== PART 3 ============================== */
  k.push(partHeading('PART 3 — PROVE AND GENERALISE', 'you have to see why, not just compute'));
  k.push(q('13', 'Show that 3(n + 2) − 3(n − 4) is always equal to 18, whatever the value of n. Then state, without recalculating from scratch, its value when n = −407.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('14', 'A function machine\'s rule is 2(n − 5) + 13. A second machine\'s rule is 2n + c, and the two machines always give the same output as each other, for every input. Find c.', { marks: 4 }));
  k.push(ruledBox(3));
  k.push(q('15', 'Machine A: "multiply by 3, then add 12." Machine B: "add 4, then multiply by 3." The same number is put into both machines. For which value, or values, of the input do the two machines give the same output? Explain fully.', { marks: 5 }));
  k.push(ruledBox(5));
  k.push(q('16', 'Expand and simplify 4(n + 3) − (n + 7). Then, treating your answer as a machine rule, find the input that gives an output of 26.', { marks: 5 }));
  k.push(ruledBox(5));
  k.push(q('17', 'A student says: "Since 3n + 3 and 3(n + 1) always give the same output for every input, they must just be the same machine, described in two different ways." Explain whether the student is correct. Give one other example of your own, with different numbers, that shows the same idea.', { marks: 4 }));
  k.push(ruledBox(4));
  k.push(q('18', 'Find all pairs of positive whole numbers a and b for which a(2n + b) − 4n simplifies to an expression with no n term at all, and that expression equals exactly 10.', { marks: 5 }));
  k.push(ruledBox(5));

  k.push(p('', { after: 100 }));
  k.push(boxed(p('Gemini: ask it to check a finished solution, or to test whether your Q17 example really works. Do not ask it to solve a question you have not tried yourself first. It is careless with minus signs — check anything it gives you against your own working.', { size: 10, after: 0 }), { colour: C.rule, weight: 4, fill: 'E7E3F2' }));
  k.push(...answers);

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, headers: { default: head('Challenge worksheet') }, footers: { default: foot() }, children: k }],
  });
}

(async () => {
  const answers = await DP.answersBlock(require('./algebra-challenge-answers'));
  const buf = await Packer.toBuffer(worksheet(answers));
  const name = `${LESSON}.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

/**
 * T3 Developing Science (CLIL) — Atoms, Lesson 3. Teacher answers.
 * Matches the format reference/Drawing an Atom worksheet ANSWERS.docx used:
 * answer + a column of what to listen for and the common wrong answer.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, p, runs, t, h1, cell, table } = DP;
const { Document, Packer, Paragraph, TableRow, WidthType } = D;

const LESSON = 'The Nucleus';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const ROWS = [
  ['A1', 'Yes.', 'Gesture with finger and thumb if they hesitate — same as Lesson 1.'],
  ['A2', 'The centre.', 'If they say "outside", they have nucleus and electron reversed. Recast with the point routine, not more words.'],
  ['A3', 'centre', 'Accept the word alone; the full sentence is not required until section D.'],
  ['B', 'One circle, with a smaller filled circle inside it for the nucleus.', 'Common wrong: nucleus drawn touching the edge of the atom. Recast: "the nucleus sits in the middle."'],
  ['C', 'Protons and neutrons each a different, consistent colour; both placed inside the nucleus, not scattered across the whole atom.', 'The location is the mark, not the colour choice. Any two colours are fine as long as they are used consistently.'],
  ['D', 'The nucleus is made of protons and neutrons.', 'Common error: naming only one of the two, usually proton — neutron is the one still being learned. Prompt with "and what else?" rather than supplying the word.'],
  ['E', 'Answers will vary — accept anything naming protons and neutrons in the pupil’s own words.', 'This is the open question, asked last on purpose. Do not mark down non-standard phrasing that is still correct.'],
  ['F', 'A second atom with 3 protons and 2 neutrons, labelled unaided.', 'This is the stretch. Success here means the word bank was scaffolding, not a crutch.'],
];

function answers() {
  const k = [];
  k.push(h1('The nucleus — teacher answers'));
  k.push(p('Point + say assessment: expect the correct location as well as the sentence, same as Lesson 2.',
    { size: 10, italic: true, color: C.soft, after: 160 }));

  const w1 = 900, w2 = 4200, w3 = 4879;
  const rows = [
    new TableRow({ children: [
      cell(p('Q', { bold: true, size: 9, after: 0, color: C.dark }), { w: w1, fill: C.headFill }),
      cell(p('Answer', { bold: true, size: 9, after: 0, color: C.dark }), { w: w2, fill: C.headFill }),
      cell(p('What to listen for, and common wrong answers', { bold: true, size: 9, after: 0, color: C.dark }), { w: w3, fill: C.headFill }),
    ] }),
    ...ROWS.map(([code, ans, note]) => new TableRow({
      children: [
        cell(p(code, { bold: true, size: 9.5, after: 0, color: C.accent }), { w: w1 }),
        cell(p(ans, { size: 9.5, after: 0 }), { w: w2 }),
        cell(p(note, { size: 9, after: 0, color: C.soft }), { w: w3 }),
      ],
    })),
  ];
  k.push(table(rows, [w1, w2, w3]));

  k.push(p('', { before: 200, after: 80 }));
  k.push(runs([
    t('Teacher note: ', { bold: true, size: 10 }),
    t('the model is deliberately generic — not tied to a real element, and no proton/neutron count is claimed as scientifically accurate for anything specific. That is intentional at this level; a real count is not part of the objective.', { size: 10 }),
  ], { after: 100 }));
  k.push(runs([
    t('Also flagging: ', { bold: true, size: 10 }),
    t('reference/Drawing an Atom worksheet ANSWERS.docx records that the "nuclear bomb" line was meant to be cut from the nucleus word card, but it is still on the live Lesson 2 slide. Lesson 3 does not use that association anywhere.', { size: 10 }),
  ], { after: 0 }));

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 21, color: C.ink } } } },
    sections: [{ properties: { page: A4 }, children: k }],
  });
}

(async () => {
  const buf = await Packer.toBuffer(answers());
  const name = `${LESSON} worksheet ANSWERS.docx`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('written:', name, Math.round(buf.length / 1024) + ' KB');
})();

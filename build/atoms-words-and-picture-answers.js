/**
 * T3 Developing Science (CLIL) — Atoms: the words and the picture. Teacher answers.
 * Same format as the earlier T3 answer sheets: the answer, then what to listen
 * for and the common wrong answer.
 */
const fs = require('fs');
const path = require('path');
const DP = require('../lib/docparts');
DP.useDocPalette('nucleus');
const { D, C, FONT, p, runs, t, h1, cell, table } = DP;
const { Document, Packer, TableRow } = D;

const LESSON = 'Atoms The Words And The Picture';
const OUT = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(OUT, { recursive: true });
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 964, right: 964 } };

const ROWS = [
  ['A1-10', '1 part · 2 proton · 3 electron · 4 matter · 5 outside · 6 atom · 7 neutron · 8 nucleus · 9 tiny · 10 centre',
    'The pictures are the ones from Atoms 1, Drawing an Atom and The nucleus, in a mixed order. Watch nucleus and neutron (same first sound) and centre and outside. If they write "sky" or "hills" for picture 5, that is a fair reading of the photograph: recast with "in the atom, outside is the area around the centre".'],
  ['B', 'One big circle, the centre drawn in the middle of it, "centre" and "outside" labelled. Nucleus and electron labels are also correct if placed properly.',
    'Common wrong: the centre touching the edge of the circle, or "outside" written beyond the circle. Recast with the point routine: "the centre sits in the middle, the outside is the area around it."'],
  ['C1', 'An atom is a tiny part of matter.', 'Part and matter swapped is the mistake to expect. Send them to slide 6, not to a new explanation.'],
  ['C2', 'Water is made of atoms.', 'Accept "the water". Watch for a missing s on "atoms": recast, do not mark down.'],
  ['C3', 'An apple is made of atoms.', 'Accept "the apple" or "apple". "Made from" instead of "made of": recast to "made of".'],
  ['C4', 'The nucleus is in the centre of the atom.', 'If they write "outside", centre and outside are reversed.'],
  ['C5', 'The electron is outside the nucleus.', 'Common wrong: "inside". Point at the picture, not more words.'],
  ['C6', 'The nucleus is made of protons and neutrons.', 'Either order is fine. Naming only one is common, usually proton. Prompt with "and what else?" and do not supply the word.'],
  ['D', 'Points to the correct part first, then says the whole sentence.', 'The pointing is the mark, not the fluency. Partner check as in the earlier lessons.'],
  ['Finished?', 'A rock is made of atoms. A chair is made of atoms. My hand is made of atoms.', 'Any of the three pictures with the same frame is correct. No new words.'],
];

function answers() {
  const k = [];
  k.push(h1('Atoms: the words and the picture, teacher answers'));
  k.push(p('Point + say assessment: expect the correct location as well as the sentence, same as Lessons 2 and 3.',
    { size: 10, italic: true, color: C.soft, after: 160 }));

  const w1 = 1000, w2 = 4300, w3 = 4679;
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
    t('Part, matter, atom. ', { bold: true, size: 10 }),
    t('This is what the class found hard, so read the answers with it in mind. Matter is the stuff (water, air, a rock, you). A part is a piece of something, any size (a leg is a part of a chair). An atom is a tiny part of matter. "An atom is a tiny part of matter" is correct, and it is the sentence that mixes all three.', { size: 10 }),
  ], { after: 100 }));
  k.push(runs([
    t('Stress. ', { bold: true, size: 10 }),
    t('NEW-clee-us is stressed on the first beat and eh-LEK-tron on the middle beat. The Nucleus lesson notes say the stress is not on the first syllable for both words; that is right for electron only.', { size: 10 }),
  ], { after: 100 }));
  k.push(runs([
    t('Still live in Drawing an Atom. ', { bold: true, size: 10 }),
    t('The nucleus card there still carries the "nuclear bomb" line and the electron card the "electricity" line. Neither is used today.', { size: 10 }),
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

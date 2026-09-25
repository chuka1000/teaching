/**
 * Atoms assessment (T3 Developing Science, CLIL): the questions, the mark scheme
 * and the feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full first): Atoms.pptx, Drawing an Atom.pptx, The nucleus.pptx.
 * Nothing is tested that is not in them. There is no calculation: the unit has none.
 * (The one number in it, 300 000 atoms across a hair, sits on the slide the deck itself
 * says to cut first, so it is not tested.) Two lines on the Drawing an Atom slides are
 * scientifically loose, "the largest part of an atom" for the nucleus and "the smallest
 * part" for the electron, so they are NOT tested; the paper tests where things are.
 *
 * NOTES from the brief: they struggled, so the language is plain; but expectations stay
 * high. So: every instruction is short and starts with one verb (Circle, Write, Draw);
 * every item has a picture; there is a word bank; and the ramp is the CLIL one (yes or
 * no, then either/or, then open). The demand stays high because from Q4 on students must
 * label, draw an atom from memory, write whole sentences, spot and correct a wrong
 * statement, and write about an object they have not seen in class (a pencil).
 *
 * 45 marks in 45 minutes.
 */
const BANK = ['atom', 'matter', 'tiny', 'part', 'nucleus', 'centre', 'electron', 'outside', 'proton', 'neutron'];
const PIC = { atom: 'g_atom_green', matter: 'g_matter', tiny: 'g_tiny', part: 'g_part_arrow', nucleus: 'g_nucleus', centre: 'g_centre',
  electron: 'g_electron', outside: 'g_outside', proton: 'g_proton', neutron: 'g_neutron' };
const G = (n) => `g_${n}`;      // a greyscale copy of a taught picture

/* --------------------------------------------------------------------- *
 * The paper.
 * Blocks: {k:'stem'|'part'|'yn'|'either'|'wordrow'|'img'|'imgs'|'bank'|'gap'|'lines'|'note'}
 * `space` on a part is the number of ruled lines (one mark, one line).
 * --------------------------------------------------------------------- */
const QUESTIONS = [
  { n: 1, marks: 4, lesson: 'Atoms 1, Drawing an Atom', skill: 'yes or no (true or false)',
    blocks: [
      { k: 'stem', t: 'Circle YES or NO.' },
      { k: 'yn', items: [
        { pic: G('apple'), t: 'An apple is made of atoms.' },
        { pic: G('hand'), t: 'A hand is tiny.' },
        { pic: G('centre'), t: 'The nucleus is in the centre of the atom.' },
        { pic: G('electron'), t: 'Electrons are in the nucleus.' } ] },
    ],
    ms: [{ l: '(a) to (d)', pts: ['(a) YES;', '(b) NO;', '(c) YES;', '(d) NO;'], note: 'One mark each. Circle or tick or underline is fine. A student who circles both scores 0 for that item.' }],
    wrong: '(d): YES. Some students hear "electron" and "nucleus" as one idea and place the electrons in the middle.' },

  { n: 2, marks: 3, lesson: 'Drawing an Atom, The nucleus', skill: 'either/or, picture to word',
    blocks: [
      { k: 'stem', t: 'Look at the picture. Circle the right word.' },
      { k: 'either', items: [
        { pic: G('centre'), a: 'centre', b: 'outside' },
        { pic: G('electron'), a: 'electron', b: 'neutron' },
        { pic: G('nucleus'), a: 'nucleus', b: 'proton' } ] },
    ],
    ms: [{ l: '(a) to (c)', pts: ['(a) centre;', '(b) electron;', '(c) nucleus;'], note: 'One mark each.' }],
    wrong: '(b): neutron ("electron" and "neutron" both end in -tron). (c): proton, from the cluster of dots.' },

  { n: 3, marks: 3, lesson: 'Atoms 1', skill: 'write the word',
    blocks: [
      { k: 'stem', t: 'Look at the picture. Write the word.' },
      { k: 'bank', t: 'Word bank:  atom  ·  matter  ·  tiny  ·  part' },
      { k: 'wordrow', items: [{ pic: G('matter') }, { pic: G('tiny') }, { pic: G('part_arrow'), big: true }] },
    ],
    ms: [{ l: '(a) to (c)', pts: ['(a) matter;', '(b) tiny;', '(c) part;'], note: 'One mark each. Ignore spelling if the word can be read. Reject "chair" and "leg" for (c): they are not in the word bank.' }],
    wrong: '(c): "chair" or "leg" (the arrow points at a leg of a chair, which is a part of it); (a): "atom".' },

  { n: 4, marks: 5, lesson: 'Drawing an Atom', skill: 'label a diagram; complete sentences',
    blocks: [
      { k: 'part', l: '(a)', t: 'Write the words in the boxes.', m: 3 },
      { k: 'bank', t: 'Word bank:  nucleus  ·  electron  ·  outside  ·  proton' },
      { k: 'img', f: 'd_atom_label', w: 5.6 },
      { k: 'part', l: '(b)', t: 'Write the missing word.  The nucleus is in the ____________ of the atom.', m: 1 },
      { k: 'part', l: '(c)', t: 'Write the missing word.  The electron is ____________ the nucleus.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['electron (top box, joined to a dot);', 'nucleus (middle box, joined to the middle);', 'outside (bottom box, joined to the space around the middle);'], note: 'One mark each. Accept "centre" for the nucleus box (Drawing an Atom labelled both). Reject "proton" for any box.' },
      { l: '(b)', pts: ['centre;'], note: 'Accept "middle". Reject "outside".' },
      { l: '(c)', pts: ['outside;'], note: 'Accept "outside of". Reject "in", "inside" and "centre".' },
    ],
    wrong: '(a): "proton" for the dot, and "centre" for the outside. (b) and (c): centre and outside swapped, the mix-up the deck warns about.' },

  { n: 5, marks: 4, lesson: 'Atoms 1, The nucleus', skill: 'complete key sentences (statements)',
    blocks: [
      { k: 'stem', t: 'Write the missing words. Use the word bank on page 1.' },
      { k: 'part', l: '(a)', t: 'An atom is a tiny ____________ of ____________.', m: 2 },
      { k: 'part', l: '(b)', t: 'The nucleus is made of ____________ and ____________.', m: 2 },
    ],
    ms: [
      { l: '(a)', pts: ['part;', 'matter;'], note: 'One mark each, in this order. If part and matter are swapped, 0.' },
      { l: '(b)', pts: ['protons;', 'neutrons;'], note: 'One mark each, in either order. Accept "proton" and "neutron" without the s. Reject "electrons".' },
    ],
    wrong: '(a): "matter" and "part" swapped (the mix-up the deck built a slide for). (b): "electrons and protons".' },

  { n: 6, marks: 4, lesson: 'Drawing an Atom', skill: 'draw an atom from memory',
    blocks: [
      { k: 'stem', t: 'Draw a simple atom in the box.' },
      { k: 'stem', t: '1.  Draw a big circle.' },
      { k: 'stem', t: '2.  Draw the nucleus in the centre.' },
      { k: 'stem', t: '3.  Draw two electrons outside the nucleus.' },
      { k: 'stem', t: '4.  Label your drawing. Write the name of each part.' },
      { k: 'img', f: 'draw_box', w: 6.2 },
    ],
    ms: [{ l: '', pts: ['a big circle (the atom);', 'the nucleus drawn in the centre, inside the circle;', 'two electrons outside the nucleus (inside the circle or on it);', 'each part labelled with the right word (nucleus, electron), next to the right part;'],
      note: 'One mark each. Any clear way of drawing the parts is fine (the class drew a small circle or a shaded circle for the nucleus and dots for electrons). Ignore neatness and spelling if the word can be read. An electron drawn inside the nucleus scores 0 for the third point.' }],
    wrong: 'The nucleus drawn touching the edge, or the electrons drawn inside the nucleus. Some will write "centre" instead of "nucleus".' },

  { n: 7, marks: 5, lesson: 'The nucleus', skill: 'read a diagram; mark and choose',
    blocks: [
      { k: 'stem', t: 'The picture shows a nucleus in an atom.' },
      { k: 'img', f: 'd_nucleus', w: 4.4 },
      { k: 'part', l: '(a)', t: 'Write P on one proton. Write N on one neutron.', m: 2 },
      { k: 'part', l: '(b)', t: 'Circle the right word.   The nucleus is made of protons and   neutrons  /  electrons.', m: 1 },
      { k: 'part', l: '(c)', t: 'Is the nucleus empty?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(d)', t: 'Where are the protons and neutrons?   Circle one.   in the nucleus  /  outside the nucleus', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['P written on (or beside) a solid black dot;', 'N written on (or beside) an open dot;'], note: 'One mark each. Use the key under the picture.' },
      { l: '(b)', pts: ['neutrons;'], note: '' },
      { l: '(c)', pts: ['NO;'], note: 'This is the hook from The nucleus: the nucleus is not empty.' },
      { l: '(d)', pts: ['in the nucleus;'], note: '' },
    ],
    wrong: '(a): P and N the wrong way round (the key is new: on paper a proton is a solid dot); (c): YES.' },

  { n: 8, marks: 4, lesson: 'Atoms 1', skill: 'write a whole sentence; unfamiliar object',
    blocks: [
      { k: 'part', l: '(a)', t: 'This is air. Write a sentence: what is air made of?', m: 2 },
      { k: 'img', f: G('air'), w: 0.9, align: 'left' },
      { k: 'lines', n: 1 },
      { k: 'part', l: '(b)', t: 'A pencil is made of wood. It is also made of something tiny. Write a sentence about it.', m: 2 },
      { k: 'img', f: G('pencil'), w: 0.9, align: 'left' },
      { k: 'lines', n: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['says that air is made of atoms;', 'a whole sentence, with atoms with an s;'], note: 'Accept "Air is made of atoms", "It is made of atoms" and "Air is made of tiny parts" (the title of Atoms 1). Language mark: only if the first mark is given. Ignore spelling, capital letters and full stops. Reject a single word or a fragment such as "atoms" or "air atoms".' },
      { l: '(b)', pts: ['says that the pencil is made of atoms (or tiny parts);', 'a whole sentence, with atoms with an s;'], note: 'Accept "A pencil is made of atoms", "It is made of atoms too" and "It is made of tiny parts". Accept "made from". Reject another material on its own (for example graphite): the question says "something tiny". Language mark: only if the first mark is given.' },
    ],
    wrong: '(a) and (b): "made of atom" without the s; a fragment ("air atoms"); or, in (b), a second material such as "made of paint".' },

  { n: 9, marks: 2, lesson: 'Atoms 1, Drawing an Atom', skill: 'a simple why',
    blocks: [
      { k: 'part', l: '(a)', t: 'Can you see an atom with your eyes?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(b)', t: 'Finish the sentence.  We draw a simple picture of an atom because an atom is ____________.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['NO;'], note: '' },
      { l: '(b)', pts: ['tiny (very small, too small to see);'], note: 'Accept "small", "very, very small" and "too small to see". Reject "big" and "hard".' },
    ],
    wrong: '(b): "difficult" or "hard to draw". The idea to look for is that it is too small to see.' },

  { n: 10, marks: 5, lesson: 'Drawing an Atom, The nucleus', skill: 'diagnose a wrong statement',
    blocks: [
      { k: 'stem', t: 'Read what the students say.' },
      { k: 'part', l: '(a)', t: 'Tom says: "The nucleus is outside the atom."   Is Tom right?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(b)', t: 'Write one correct sentence about where the nucleus is.', m: 2 },
      { k: 'lines', n: 2 },
      { k: 'part', l: '(c)', t: 'Sara points at the whole nucleus. She says: "This is a proton."   Is Sara right?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(d)', t: 'Finish the sentence.  A proton is one small ____________ inside the nucleus.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['NO;'], note: '' },
      { l: '(b)', pts: ['says that the nucleus is in the centre (of the atom);', 'a whole sentence;'], note: 'Example: "The nucleus is in the centre of the atom." Accept "middle" for centre. Reject "outside" and "in the electron". Language mark: only if the first mark is given.' },
      { l: '(c)', pts: ['NO;'], note: '' },
      { l: '(d)', pts: ['part;'], note: 'Accept "piece". Reject "atom".' },
    ],
    wrong: '(c): YES. The whole centre is the nucleus; a proton is one small part inside it. This is the nucleus and proton mix-up the deck records.' },

  { n: 11, marks: 6, lesson: 'Drawing an Atom, The nucleus', skill: 'write three sentences from two pictures',
    blocks: [
      { k: 'stem', t: 'Look at pictures A and B. Answer in a whole sentence.' },
      { k: 'imgs', fs: ['d_pic_A', 'd_pic_B'], w: 2.9 },
      { k: 'part', l: '1', t: 'Picture A.  Where is the nucleus?', m: 2 },
      { k: 'lines', n: 1 },
      { k: 'part', l: '2', t: 'Picture A.  Where are the electrons?', m: 2 },
      { k: 'lines', n: 1 },
      { k: 'part', l: '3', t: 'Picture B.  What is the nucleus made of?', m: 2 },
      { k: 'lines', n: 1 },
    ],
    ms: [
      { l: '1', pts: ['the nucleus is in the centre (of the atom);', 'a whole sentence;'], note: 'Example: "The nucleus is in the centre of the atom." Accept "middle". Language mark: only if the first mark is given. Ignore spelling and capital letters.' },
      { l: '2', pts: ['the electrons are outside (the nucleus);', 'a whole sentence;'], note: 'Example: "The electrons are outside the nucleus." Accept "The electron is outside". Reject "in the atom" on its own.' },
      { l: '3', pts: ['the nucleus is made of protons and neutrons;', 'a whole sentence;'], note: 'Example: "The nucleus is made of protons and neutrons." Accept the singular for either word. Accept "made from". Reject "electrons".' },
    ],
    wrong: 'A fragment ("centre") instead of a sentence, or "in the centre" with no verb; "made of proton neutron"; electrons "inside".' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => {
  const s = q.blocks.filter((b) => b.k === 'part').reduce((a, b) => a + b.m, 0) || (q.blocks.some((b) => b.k === 'yn' || b.k === 'either' || b.k === 'wordrow') ? q.blocks.find((b) => b.items).items.length : 0);
  const fromMs = q.ms.reduce((a, m) => a + m.pts.length, 0);
  if (q.n === 6 ? fromMs !== q.marks : (q.n === 11 ? fromMs !== q.marks : false)) throw new Error(`Q${q.n}: mark points ${fromMs} vs ${q.marks}`);
  if (s && s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`);
});
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S support: same skill, smaller, more scaffold   C consolidate: fresh context
 *   E extend: harder (write it, correct it, no options)
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: [{ k: 'stem', t: 'Circle YES or NO.' }, { k: 'yn', items: [{ pic: G('water'), t: 'Water is made of atoms.' }, { pic: G('atom_green'), t: 'An atom is tiny.' }] }],
    C: [{ k: 'stem', t: 'Circle YES or NO.' }, { k: 'yn', items: [{ pic: G('air'), t: 'Air is made of atoms.' }, { pic: G('atom_green'), t: 'An atom is big.' }, { pic: G('electron'), t: 'Electrons are outside the nucleus.' }, { pic: G('nucleus'), t: 'The nucleus is outside the atom.' }] }],
    E: [{ k: 'stem', t: 'Each sentence is wrong. Write the right sentence.' }, { k: 'note', t: '1. An atom is big.   2. Electrons are in the nucleus.   3. The nucleus is made of electrons.' }, { k: 'lines', n: 3 }],
    a: { S: ['YES;', 'YES;'], C: ['YES; NO; YES; NO;'], E: ['1. An atom is tiny (very small);', '2. Electrons are outside the nucleus;', '3. The nucleus is made of protons and neutrons;'] } },
  { n: 2,
    S: [{ k: 'stem', t: 'Look. Circle the right word.' }, { k: 'either', items: [{ pic: G('atom_green'), a: 'atom', b: 'matter' }, { pic: G('tiny'), a: 'tiny', b: 'part' }] }],
    C: [{ k: 'stem', t: 'Look. Circle the right word.' }, { k: 'either', items: [{ pic: G('nucleus'), a: 'nucleus', b: 'neutron' }, { pic: G('outside'), a: 'outside', b: 'centre' }, { pic: G('electron'), a: 'electron', b: 'nucleus' }] }],
    E: [{ k: 'stem', t: 'Look. Write the word. Use the word bank on page 1.' }, { k: 'wordrow', items: [{ pic: G('nucleus') }, { pic: G('electron') }, { pic: G('outside') }] }],
    a: { S: ['atom; tiny;'], C: ['nucleus; outside; electron;'], E: ['nucleus; electron; outside;'] } },
  { n: 3,
    S: [{ k: 'stem', t: 'Write the word. The first letter is there to help you.' }, { k: 'wordrow', items: [{ pic: G('matter'), hint: 'm ___ ___ ___ ___ ___' }, { pic: G('part_arrow'), big: true, hint: 'p ___ ___ ___' }] }],
    C: [{ k: 'stem', t: 'Write the word.' }, { k: 'bank', t: 'Word bank:  atom  ·  centre  ·  outside  ·  neutron' }, { k: 'wordrow', items: [{ pic: G('atom_green') }, { pic: G('centre') }, { pic: G('outside') }] }],
    E: [{ k: 'stem', t: 'Write the word. Then write a sentence with the word.' }, { k: 'wordrow', items: [{ pic: G('electron') }] }, { k: 'lines', n: 1 }],
    a: { S: ['matter; part;'], C: ['atom; centre; outside;'], E: ['electron; a whole sentence that uses electron correctly, for example "The electron is outside the nucleus";'] } },
  { n: 4,
    S: [{ k: 'stem', t: 'Write the words in the boxes. Use the word bank.' }, { k: 'bank', t: 'Word bank:  nucleus  ·  electron' }, { k: 'img', f: 'd_f4_S', w: 3.0 }],
    C: [{ k: 'stem', t: 'Write the words in the boxes. Use the word bank.' }, { k: 'bank', t: 'Word bank:  nucleus  ·  electron  ·  outside  ·  proton' }, { k: 'img', f: 'd_f4_C', w: 3.0 }],
    E: [{ k: 'stem', t: 'Write the words in the boxes. Then write one sentence about the picture.' }, { k: 'bank', t: 'Word bank:  nucleus  ·  proton  ·  neutron' }, { k: 'img', f: 'd_f4_E', w: 3.0 }, { k: 'lines', n: 1 }],
    a: { S: ['electron (top box); nucleus (bottom box);'], C: ['nucleus (top box); outside (middle box); electron (bottom box);'], E: ['nucleus (top box); proton (middle box, joined to a solid dot); neutron (bottom box, joined to an open dot);', 'a true sentence, for example "The nucleus is made of protons and neutrons";'] } },
  { n: 5,
    S: [{ k: 'stem', t: 'Circle the right word.' }, { k: 'note', t: 'An atom is a tiny  (part / matter)  of matter.        The nucleus is made of protons and  (neutrons / electrons).' }],
    C: [{ k: 'stem', t: 'Write the missing words.' }, { k: 'note', t: 'A chair leg is a ____________ of a chair.     Atoms are a tiny ____________ of matter.     The nucleus is in the ____________ of the atom.' }],
    E: [{ k: 'stem', t: 'Put the words in the right order. Write the sentence.' }, { k: 'note', t: 'made  /  is  /  of  /  water  /  atoms        nucleus  /  the  /  of  /  centre  /  in  /  is  /  the  /  atom  /  the' }, { k: 'lines', n: 2 }],
    a: { S: ['part; neutrons;'], C: ['part; part; centre;'], E: ['Water is made of atoms;', 'The nucleus is in the centre of the atom;'] } },
  { n: 6,
    S: [{ k: 'stem', t: 'Finish the drawing. Draw two electrons outside the nucleus. Write nucleus and electron.' }, { k: 'img', f: 'd_f6_S', w: 3.0 }],
    C: [{ k: 'stem', t: 'Draw a simple atom with three electrons. Write the words nucleus and electron.' }, { k: 'img', f: 'draw_box_small', w: 3.1 }],
    E: [{ k: 'stem', t: 'Draw an atom. Draw the protons and neutrons inside the nucleus. Draw a key. Write the words.' }, { k: 'img', f: 'draw_box_small', w: 3.1 }],
    a: { S: ['two electrons drawn outside the nucleus; both words written next to the right parts;'], C: ['a big circle; the nucleus in the centre; three electrons outside the nucleus; both parts labelled;'], E: ['a big circle with the nucleus in the centre; protons and neutrons drawn inside the nucleus, in two different ways; a key that matches the drawing; the words nucleus, proton and neutron written;'] } },
  { n: 7,
    S: [{ k: 'img', f: 'd_f7_S', w: 3.0 }, { k: 'stem', t: 'Write P on one proton. Write N on one neutron. Are they inside the nucleus? Circle YES or NO.' }],
    C: [{ k: 'img', f: 'd_f7_C', w: 3.0 }, { k: 'stem', t: 'Write P on one proton. Write N on one neutron. Circle the right words: The nucleus is made of protons and  neutrons / electrons.' }],
    E: [{ k: 'stem', t: 'Draw a nucleus with 3 protons and 2 neutrons. Draw a key. Write one sentence about your picture.' }, { k: 'img', f: 'draw_box_small', w: 3.1 }, { k: 'lines', n: 1 }],
    a: { S: ['P on a solid dot, N on an open dot; YES;'], C: ['P on a solid dot, N on an open dot; neutrons;'], E: ['3 solid dots and 2 open dots inside a nucleus; a key that matches; a whole sentence such as "The nucleus is made of protons and neutrons";'] } },
  { n: 8,
    S: [{ k: 'stem', t: 'Copy the sentence. Then write it again for the apple.' }, { k: 'img', f: G('water'), w: 0.8, align: 'left' }, { k: 'note', t: 'Water is made of atoms.' }, { k: 'img', f: G('apple'), w: 0.8, align: 'left' }, { k: 'lines', n: 1 }],
    C: [{ k: 'stem', t: 'Write a sentence for each picture. Use:  ______ is made of atoms.' }, { k: 'img', f: G('hand'), w: 0.8, align: 'left' }, { k: 'lines', n: 1 }, { k: 'img', f: G('apple'), w: 0.8, align: 'left' }, { k: 'lines', n: 1 }],
    E: [{ k: 'stem', t: 'A chair is made of wood. A chair is made of atoms. Both are true. Write two sentences like this about a ruler.' }, { k: 'lines', n: 2 }],
    a: { S: ['Water is made of atoms (copied); An apple is made of atoms;'], C: ['A hand (My hand) is made of atoms; An apple is made of atoms;'], E: ['A ruler is made of plastic (or wood, or metal); A ruler is made of atoms;'] } },
  { n: 9,
    S: [{ k: 'stem', t: 'Circle the right word.  An atom is  tiny / big.   Can you see an atom?  YES / NO' }],
    C: [{ k: 'stem', t: 'Finish the sentence.   We cannot see an atom because it is ____________.' }],
    E: [{ k: 'stem', t: 'We draw a simple picture of an atom. Write two sentences. Say why we draw a picture. Say what the picture is not.' }, { k: 'lines', n: 2 }],
    a: { S: ['tiny; NO;'], C: ['tiny (too small, very small);'], E: ['We draw a picture because an atom is tiny (too small to see);', 'The picture is simple: it is not a real atom, or not the real size, or it leaves things out;'] } },
  { n: 10,
    S: [{ k: 'stem', t: 'Tom says: "The nucleus is outside the atom." Circle the right sentence.' }, { k: 'note', t: 'A.  The nucleus is in the centre of the atom.        B.  The nucleus is outside the atom.' }],
    C: [{ k: 'stem', t: 'Ana says: "The electron is in the centre." Is Ana right? Circle YES or NO. Write the right sentence.' }, { k: 'lines', n: 1 }],
    E: [{ k: 'stem', t: 'Ben says: "The nucleus is made of electrons." Say what is wrong. Write the right sentence.' }, { k: 'lines', n: 2 }],
    a: { S: ['A;'], C: ['NO;', 'The electron is outside the nucleus (not in the centre);'], E: ['Electrons are not in the nucleus (they are outside it);', 'The nucleus is made of protons and neutrons;'] } },
  { n: 11,
    S: [{ k: 'imgs', fs: ['d_pic_A', 'd_pic_B'], w: 1.5 }, { k: 'stem', t: 'Finish the sentences.' }, { k: 'note', t: 'The nucleus is in the ____________ of the atom.   The electrons are ____________ the nucleus.   The nucleus is made of ____________ and ____________.' }],
    C: [{ k: 'imgs', fs: ['d_f11_A', 'd_f11_B'], w: 1.5 }, { k: 'stem', t: 'Look at A and B. Write three sentences.' }, { k: 'note', t: '1. Picture A: where is the nucleus?   2. Picture A: where are the electrons?   3. Picture B: what is the nucleus made of?' }, { k: 'lines', n: 3 }],
    E: [{ k: 'imgs', fs: ['d_f11_A', 'd_f11_B'], w: 1.5 }, { k: 'stem', t: 'Write four sentences about the pictures. Use these words: tiny, part, made of, outside.' }, { k: 'lines', n: 4 }],
    a: { S: ['centre; outside; protons; neutrons (last two in either order);'], C: ['The nucleus is in the centre of the atom; The electrons are outside the nucleus; The nucleus is made of protons and neutrons;'], E: ['Four true whole sentences that use tiny, part, made of and outside, for example "An atom is a tiny part of matter", "The nucleus is made of protons and neutrons", "The electrons are outside the nucleus";'] } },
];

module.exports = { QUESTIONS, FEEDBACK, BANK, PIC, TOTAL };

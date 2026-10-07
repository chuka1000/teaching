/**
 * Living things assessment (T3 Developing Science, CLIL, Unit 4: What is a living organism?): the questions, the mark
 * scheme and the feedback variants, in ONE place so the three documents cannot disagree.
 *
 * COVERS (read in full first): Living Or Non-Living (L1), What Living Things Need (L2), Living Things Grow (L3), Why Is It
 * Living? (L4 and L5, the double). Nothing is tested that is not in them. What each pictured thing IS comes from
 * build/living-things-words.js, the same list the decks used, so a picture cannot change sides between lesson and paper.
 * There is no calculation: the unit has none.
 *
 * The formats are the ones the double rehearsed on its "Practice for Thursday" slide: circle yes or no, circle the right
 * word, write the word, sort into the living / non-living boxes (the unit plan's sorting chart), and the because sentence
 * (the unit plan's assessment). The ramp is the CLIL one: yes or no, then either/or, then open. Q9 is the unfamiliar
 * context (a goat and an umbrella, neither seen in class). The "it moves" misconception is diagnosed in Q8.
 *
 * 45 marks in 45 minutes. Every picture is a greyscale copy of the photograph the class saw (G()); two are new (Q9).
 */
const W = require('./living-things-words');
const G = (k) => `g_${k}`;
const A = (k) => (W.article(k) === 'an' ? 'An' : 'A');

const BANK = ['living', 'non-living', 'plant', 'animal', 'need', 'food', 'water', 'air', 'grow', 'change', 'eat', 'because'];
const PIC = { living: G('dog'), 'non-living': G('rock'), plant: G('tree'), animal: G('fish'), need: G('watering'), food: G('food'), water: G('water'),
  air: G('air'), grow: G('puppy'), change: G('caterpillar'), eat: G('grazing'), because: G('question') };

/* --------------------------------------------------------------------- *
 * The paper. Blocks: {k:'stem'|'part'|'yn'|'either'|'wordrow'|'img'|'imgs'|'bank'|'lines'|'note'|'sort'|'order'}
 * --------------------------------------------------------------------- */
const SORT = ['horse', 'phone', 'sunflower', 'kite', 'snail', 'clock'];
const sortAns = (want) => SORT.filter((k) => W.kind(k) === want).map(W.name).join(', ');

const QUESTIONS = [
  { n: 1, marks: 4, lesson: 'L1 Living Or Non-Living, L2 What Living Things Need', skill: 'yes or no',
    blocks: [
      { k: 'stem', t: 'Circle YES or NO.' },
      { k: 'yn', items: [
        { pic: G('dog'), t: 'A dog is living.' },
        { pic: G('rock'), t: 'A rock is living.' },
        { pic: G('tree'), t: 'A tree needs water.' },
        { pic: G('teddy'), t: 'A teddy needs food.' }] },
    ],
    ms: [{ l: '(a) to (d)', pts: ['(a) YES;', '(b) NO;', '(c) YES;', '(d) NO;'], note: 'One mark each. Circle, tick or underline is fine. Both circled scores 0 for that item.' }],
    wrong: '(d): YES. The teddy looks like an animal (the Lesson 1 trap), and a student who decides by looks says it needs food.' },

  { n: 2, marks: 4, lesson: 'L1 Living Or Non-Living', skill: 'either/or, picture to word',
    blocks: [
      { k: 'stem', t: 'Look at the picture. Circle the right word.' },
      { k: 'either', items: [
        { pic: G('tree'), a: 'plant', b: 'animal' },
        { pic: G('horse'), a: 'plant', b: 'animal' },
        { pic: G('car'), a: 'living', b: 'non-living' },
        { pic: G('cactus'), a: 'living', b: 'non-living' }] },
    ],
    ms: [{ l: '(a) to (d)', pts: ['(a) plant;', '(b) animal;', '(c) non-living;', '(d) living;'], note: 'One mark each.' }],
    wrong: '(c): living, because a car moves. (d): non-living, because a cactus does not move. Both are the misconceptions Lesson 1 planted traps for.' },

  { n: 3, marks: 3, lesson: 'L2 What Living Things Need', skill: 'write the word',
    blocks: [
      { k: 'stem', t: 'Look at the picture. Write the word.' },
      { k: 'bank', t: 'Word bank:  food  ·  water  ·  air' },
      { k: 'wordrow', items: [{ pic: G('water') }, { pic: G('food') }, { pic: G('air') }] },
    ],
    ms: [{ l: '(a) to (c)', pts: ['(a) water;', '(b) food;', '(c) air;'], note: 'One mark each. Ignore spelling if the word can be read. Reject "fruit" for (b) and "wind" for (c): the question says use the word bank.' }],
    wrong: '(c): "wind" or "breathe" for air: the picture shows breath, the word is air.' },

  { n: 4, marks: 6, lesson: 'L1 Living Or Non-Living (the sorting chart), L4 and L5 (the hunt)', skill: 'sort into a chart',
    blocks: [
      { k: 'stem', t: 'Is it living or non-living? Write each word in the right box.' },
      { k: 'sort', items: SORT },
    ],
    ms: [{ l: '', pts: SORT.map((k) => `${W.name(k)} in the ${W.kind(k)} box;`), note: `One mark for each word in the right box. Living: ${sortAns('living')}. Non-living: ${sortAns('non-living')}. Ignore spelling if the word can be read. A word written in both boxes scores 0.` }],
    wrong: 'The kite and the clock in the living box (they move: the kite flies, the clock ticks). The snail in the non-living box is rarer.' },

  { n: 5, marks: 4, lesson: 'L3 Living Things Grow', skill: 'put pictures in order; complete a frame',
    blocks: [
      { k: 'part', l: '(a)', t: 'Which is first? Circle one.', m: 1 },
      { k: 'either', items: [{ pic: G('frog'), a: 'the frog', b: 'the tadpole', pic2: G('tadpole') }] },
      { k: 'part', l: '(b)', t: 'Put them in order. Write 1, 2, 3 under the pictures.', m: 2 },
      { k: 'order', items: ['chick', 'chicken', 'egg'] },
      { k: 'part', l: '(c)', t: 'Finish the sentence.   A puppy grows into a ____________.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['the tadpole;'], note: '' },
      { l: '(b)', pts: ['egg 1;', 'chick 2 and chicken 3;'], note: 'One mark for the egg first. One mark for chick before chicken. So egg 1, chicken 2, chick 3 scores 1.' },
      { l: '(c)', pts: ['dog;'], note: 'Accept "big dog". Reject "animal" on its own.' },
    ],
    wrong: '(a): the frog (it looks more like the first picture they think of). (b): chick before egg.' },

  { n: 6, marks: 4, lesson: 'L2 What Living Things Need', skill: 'complete key sentences (statements)',
    blocks: [
      { k: 'stem', t: 'Write the missing word. Use the word bank on page 1.' },
      { k: 'part', l: '(a)', t: 'Plants need ____________.', m: 1 },
      { k: 'part', l: '(b)', t: 'Animals need ____________.', m: 1 },
      { k: 'part', l: '(c)', t: 'Living things need food, water and ____________.', m: 1 },
      { k: 'part', l: '(d)', t: 'Do rocks need water?   Circle YES or NO.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['water (or air);'], note: 'Accept water or air. Reject food: plants make their own food, and the deck never says "plants need food". (If you taught it otherwise, accept it.)' },
      { l: '(b)', pts: ['food (or water, or air);'], note: 'Any of the three.' },
      { l: '(c)', pts: ['air;'], note: '' },
      { l: '(d)', pts: ['NO;'], note: 'Non-living things do not need food, water or air (Lesson 2, slide 7).' },
    ],
    wrong: '(a): "food". (c): "living" or "grow", from the frame of the next lesson.' },

  { n: 7, marks: 6, lesson: 'L4 and L5 Why Is It Living?', skill: 'because sentences (the unit plan\'s assessment)',
    blocks: [
      { k: 'part', l: '(a)', t: 'A cow is living because it ____________.', m: 1 },
      { k: 'img', f: G('grazing'), w: 0.8, align: 'left' },
      { k: 'part', l: '(b)', t: 'A ball is non-living because it does not ____________.', m: 1 },
      { k: 'img', f: G('ball'), w: 0.8, align: 'left' },
      { k: 'part', l: '(c)', t: 'Look at the bird. Write a whole sentence: A bird is living because ...', m: 2 },
      { k: 'img', f: G('bird'), w: 0.8, align: 'left' },
      { k: 'lines', n: 1 },
      { k: 'part', l: '(d)', t: 'Look at the bicycle. Write a whole sentence: A bicycle is non-living because ...', m: 2 },
      { k: 'img', f: G('bicycle'), w: 1.1, align: 'left' },
      { k: 'lines', n: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['eats (or grows, changes, needs food / water / air);'], note: 'Any of the unit\'s reasons. Accept "eat" without the s. Reject "moves".' },
      { l: '(b)', pts: ['grow (or eat, need water / food / air);'], note: 'Accept "grows". Reject "move": a ball moves.' },
      { l: '(c)', pts: ['a true reason: grows, eats, changes or needs food / water / air;', 'a whole sentence with "because" and "it";'], note: 'Example: "A bird is living because it grows." The language mark only if the science mark is given. Reject "because it flies" or "because it moves" for the science mark: moving is not a reason in this unit.' },
      { l: '(d)', pts: ['a true reason: does not grow, does not eat, or does not need food / water / air;', 'a whole sentence with "because" and "it does not";'], note: 'Example: "A bicycle is non-living because it does not grow." Language mark only with the science mark. Reject "because it is metal" and "because it does not move" (it moves).' },
    ],
    wrong: '"Because it moves" (c) or "because it does not move" (d). The deck spent a slide on exactly this (Why Is It Living?, slide 6).' },

  { n: 8, marks: 5, lesson: 'L1 Living Or Non-Living, L4 Why Is It Living?', skill: 'diagnose a wrong statement',
    blocks: [
      { k: 'stem', t: 'Read what the students say.' },
      { k: 'part', l: '(a)', t: 'Sam says: "A car is living because it moves."   Is Sam right?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(b)', t: 'Write the right sentence about the car.', m: 2 },
      { k: 'lines', n: 1 },
      { k: 'part', l: '(c)', t: 'Mia says: "A tree is non-living. It does not move."   Is Mia right?   Circle YES or NO.', m: 1 },
      { k: 'part', l: '(d)', t: 'Finish the sentence.   A tree is living because it ____________.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['NO;'], note: '' },
      { l: '(b)', pts: ['says that a car is non-living (with a true reason, or none);', 'a whole sentence;'], note: 'Best: "A car is non-living because it does not grow." Accept "A car is non-living." for both marks. Language mark only with the science mark.' },
      { l: '(c)', pts: ['NO;'], note: '' },
      { l: '(d)', pts: ['grows (or needs water / air, changes);'], note: 'Reject "moves".' },
    ],
    wrong: '(a) YES and (c) YES: deciding by movement. This is the misconception the whole unit built traps for.' },

  { n: 9, marks: 4, lesson: 'All lessons, in a new context', skill: 'apply the idea to things not seen in class',
    blocks: [
      { k: 'stem', t: 'You did not see these in class.' },
      { k: 'img', f: G('goat'), w: 0.9, align: 'left' },
      { k: 'part', l: '(a)', t: 'This is a goat. Circle one.   A goat is   living  /  non-living.', m: 1 },
      { k: 'part', l: '(b)', t: 'Finish the sentence.   A goat is living because it ____________.', m: 1 },
      { k: 'img', f: G('umbrella'), w: 1.1, align: 'left' },
      { k: 'part', l: '(c)', t: 'This is an umbrella. Circle one.   An umbrella is   living  /  non-living.', m: 1 },
      { k: 'part', l: '(d)', t: 'Finish the sentence.   An umbrella is non-living because it does not ____________.', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['living;'], note: '' },
      { l: '(b)', pts: ['grows (or eats, changes, needs food / water / air);'], note: 'Reject "moves".' },
      { l: '(c)', pts: ['non-living;'], note: '' },
      { l: '(d)', pts: ['grow (or eat, need water / food / air);'], note: 'Reject "move": an umbrella opens and closes.' },
    ],
    wrong: '(c): living, because an umbrella opens and closes. (b) and (d): a reason about movement.' },

  { n: 10, marks: 5, lesson: 'L2 What Living Things Need, L3 Living Things Grow', skill: 'write sentences from pictures',
    blocks: [
      { k: 'part', l: '(a)', t: 'Write the two words.   A ____________ grows into a ____________.', m: 2 },
      { k: 'imgs', fs: [G('seedling'), G('sunflower')], w: 1.0 },
      { k: 'part', l: '(b)', t: 'Look at the picture. Write a sentence. Use the word need.', m: 2 },
      { k: 'img', f: G('watering'), w: 1.0, align: 'left' },
      { k: 'lines', n: 1 },
      { k: 'part', l: '(c)', t: 'Living things grow and change. Circle the thing that changes into a butterfly.   a caterpillar  /  a rock', m: 1 },
    ],
    ms: [
      { l: '(a)', pts: ['seedling (or seed, or plant);', 'sunflower (or plant, or flower);'], note: 'One mark for a young plant word in the first gap, one for a grown plant word in the second. "A plant grows into a plant" scores 1.' },
      { l: '(b)', pts: ['says that plants need water;', 'a whole sentence with "need";'], note: 'Example: "Plants need water." Accept "The plant needs water." and "Plants need air." Language mark only with the science mark.' },
      { l: '(c)', pts: ['a caterpillar;'], note: '' },
    ],
    wrong: '(a): the two words swapped ("a sunflower grows into a seedling"). (b): a fragment ("water").' },
];

const TOTAL = QUESTIONS.reduce((a, q) => a + q.marks, 0);
QUESTIONS.forEach((q) => {
  const parts = q.blocks.filter((b) => b.k === 'part').reduce((a, b) => a + b.m, 0);
  const items = q.blocks.filter((b) => ['yn', 'either', 'wordrow', 'sort'].includes(b.k)).reduce((a, b) => a + b.items.length, 0);
  const s = parts || items;
  if (s !== q.marks) throw new Error(`Q${q.n}: parts sum to ${s}, not ${q.marks}`);
});
if (TOTAL !== 45) throw new Error(`total is ${TOTAL}, not 45`);

/* --------------------------------------------------------------------- *
 * The feedback sheet: three variants of every question.
 *   S support: same skill, smaller, more scaffold   C consolidate: fresh context   E extend: harder
 * --------------------------------------------------------------------- */
const FEEDBACK = [
  { n: 1,
    S: [{ k: 'stem', t: 'Circle YES or NO.' }, { k: 'yn', items: [{ pic: G('cat'), t: 'A cat is living.' }, { pic: G('chair'), t: 'A chair is living.' }] }],
    C: [{ k: 'stem', t: 'Circle YES or NO.' }, { k: 'yn', items: [{ pic: G('fish'), t: 'A fish needs water.' }, { pic: G('robot'), t: 'A robot is living.' }, { pic: G('flower'), t: 'A flower needs air.' }] }],
    E: [{ k: 'stem', t: 'Each sentence is wrong. Write it again so it is right.' }, { k: 'note', t: '1. A phone needs food.   2. A horse is non-living.   3. A rock grows.' }, { k: 'lines', n: 3 }],
    a: { S: ['YES; NO;'], C: ['YES; NO; YES;'], E: ['1. A phone is non-living (it does not need food);', '2. A horse is living;', '3. A rock does not grow;'] } },
  { n: 2,
    S: [{ k: 'stem', t: 'Look. Circle the right word.' }, { k: 'either', items: [{ pic: G('flower'), a: 'plant', b: 'animal' }, { pic: G('rock'), a: 'living', b: 'non-living' }] }],
    C: [{ k: 'stem', t: 'Look. Circle the right word.' }, { k: 'either', items: [{ pic: G('horse'), a: 'plant', b: 'animal' }, { pic: G('robot'), a: 'living', b: 'non-living' }, { pic: G('tree'), a: 'living', b: 'non-living' }] }],
    E: [{ k: 'stem', t: 'Write two words for each picture: plant or animal, and living or non-living.' }, { k: 'wordrow', items: [{ pic: G('snail') }, { pic: G('sunflower') }] }],
    a: { S: ['plant; non-living;'], C: ['animal; non-living; living;'], E: ['snail: animal, living;', 'sunflower: plant, living;'] } },
  { n: 3,
    S: [{ k: 'stem', t: 'Write the word. The first letter is there to help you.' }, { k: 'wordrow', items: [{ pic: G('water'), hint: 'w ___ ___ ___ ___' }, { pic: G('food'), hint: 'f ___ ___ ___' }] }],
    C: [{ k: 'stem', t: 'Write the word.' }, { k: 'bank', t: 'Word bank:  need  ·  grow  ·  eat' }, { k: 'wordrow', items: [{ pic: G('puppy') }, { pic: G('grazing') }] }],
    E: [{ k: 'stem', t: 'Write the word. Then write a sentence with it.' }, { k: 'wordrow', items: [{ pic: G('air') }] }, { k: 'lines', n: 1 }],
    a: { S: ['water; food;'], C: ['grow; eat;'], E: ['air; a whole sentence with air, for example "We need air";'] } },
  { n: 4,
    S: [{ k: 'stem', t: 'Write each word in the right box: living or non-living.' }, { k: 'sort', items: ['dog', 'rock', 'tree', 'chair'] }],
    C: [{ k: 'stem', t: 'Write each word in the right box: living or non-living.' }, { k: 'sort', items: ['butterfly', 'robot', 'cactus', 'teddy', 'bird', 'car'] }],
    E: [{ k: 'stem', t: 'Find three living and three non-living things in the room. Write them in the boxes. Write one because sentence.' }, { k: 'sort', items: [] }, { k: 'lines', n: 1 }],
    a: { S: ['living: dog, tree; non-living: rock, chair;'], C: ['living: butterfly, cactus, bird; non-living: robot, teddy, car;'], E: ['any three true of each; a whole because sentence with a unit reason;'] } },
  { n: 5,
    S: [{ k: 'stem', t: 'Which is first? Circle one.' }, { k: 'either', items: [{ pic: G('puppy'), a: 'the puppy', b: 'the dog', pic2: G('dog') }] }],
    C: [{ k: 'stem', t: 'Put them in order. Write 1, 2, 3 under the pictures.' }, { k: 'order', items: ['sunflower', 'seed', 'seedling'] }],
    E: [{ k: 'stem', t: 'Write two sentences: A ___ grows into a ___.' }, { k: 'imgs', fs: [G('kitten'), G('cat'), G('tadpole'), G('frog')], w: 0.7 }, { k: 'lines', n: 2 }],
    a: { S: ['the puppy;'], C: ['seed 1, seedling 2, sunflower 3;'], E: ['A kitten grows into a cat; A tadpole grows into a frog;'] } },
  { n: 6,
    S: [{ k: 'stem', t: 'Circle the right word.   Living things need  water / phones.     Living things need  air / books.' }],
    C: [{ k: 'stem', t: 'Write the missing word.   Fish need ____________.     Cows need ____________.     Do teddies need food?  YES / NO' }],
    E: [{ k: 'stem', t: 'Write three sentences. Say what living things need. Say what non-living things do not need.' }, { k: 'lines', n: 3 }],
    a: { S: ['water; air;'], C: ['water (or food, air); food (or water, air); NO;'], E: ['Living things need food, water and air (any three true sentences); one sentence such as "A rock does not need water";'] } },
  { n: 7,
    S: [{ k: 'stem', t: 'Circle the right reason.' }, { k: 'note', t: 'A dog is living because it   grows / is brown.        A rock is non-living because it   does not grow / is grey.' }],
    C: [{ k: 'stem', t: 'Finish the sentences.' }, { k: 'note', t: 'A horse is living because it ____________.     A clock is non-living because it does not ____________.' }],
    E: [{ k: 'stem', t: 'Write two because sentences: one for a living thing, one for a non-living thing. Use two different reasons.' }, { k: 'lines', n: 2 }],
    a: { S: ['grows; does not grow;'], C: ['grows (or eats, changes, needs ...); grow (or eat, need ...);'], E: ['two whole because sentences, one living and one non-living, with two different unit reasons;'] } },
  { n: 8,
    S: [{ k: 'stem', t: 'Tom says: "A kite is living because it flies." Circle the right sentence.' }, { k: 'note', t: 'A.  A kite is non-living because it does not grow.        B.  A kite is living because it moves.' }],
    C: [{ k: 'stem', t: 'Ana says: "A cactus is non-living. It does not move." Is Ana right? Circle YES or NO. Write the right sentence.' }, { k: 'lines', n: 1 }],
    E: [{ k: 'stem', t: 'Ben says: "Things that move are living." Write one thing that moves and is non-living, and one living thing that does not move much. Write a because sentence for each.' }, { k: 'lines', n: 2 }],
    a: { S: ['A;'], C: ['NO;', 'A cactus is living because it grows (or needs water);'], E: ['a moving non-living thing (car, robot, kite, bicycle, clock) with "does not grow";', 'a living thing that hardly moves (tree, cactus, flower, snail) with a unit reason;'] } },
  { n: 9,
    S: [{ k: 'stem', t: 'Circle one.' }, { k: 'note', t: 'A goat is   living / non-living.        An umbrella is   living / non-living.' }],
    C: [{ k: 'stem', t: 'Finish the sentences.' }, { k: 'note', t: 'A sheep is living because it ____________.     A spoon is non-living because it does not ____________.' }],
    E: [{ k: 'stem', t: 'Choose one living thing and one non-living thing from your home. Write a because sentence for each.' }, { k: 'lines', n: 2 }],
    a: { S: ['living; non-living;'], C: ['grows (or eats ...); grow (or eat ...);'], E: ['two whole because sentences about real things, each true;'] } },
  { n: 10,
    S: [{ k: 'stem', t: 'Finish the sentences.' }, { k: 'note', t: 'A puppy grows into a ____________.     Plants need ____________.' }],
    C: [{ k: 'stem', t: 'Write the sentence for each pair of pictures.' }, { k: 'imgs', fs: [G('kitten'), G('cat')], w: 0.8 }, { k: 'lines', n: 1 }, { k: 'imgs', fs: [G('grazing')], w: 0.8 }, { k: 'lines', n: 1 }],
    E: [{ k: 'stem', t: 'Write three sentences about a sunflower: it is living, what it needs, and how it grows.' }, { k: 'lines', n: 3 }],
    a: { S: ['dog; water (or air);'], C: ['A kitten grows into a cat;', 'Cows (animals) need food;'], E: ['A sunflower is living (because it grows); A sunflower needs water (or air); A seed grows into a sunflower;'] } },
];

module.exports = { QUESTIONS, FEEDBACK, BANK, PIC, TOTAL, SORT, G };

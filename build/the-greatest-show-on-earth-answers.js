/**
 * The Greatest Show On Earth: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no
 * Answers slide). The numbers are the data the worksheet prints; build/the-greatest-show-on-earth-check.py re-derives them independently.
 */
const STEPS = {                                    // the Silver/Bronze ordering question (Q5): the beetles on a lava flow, in the RIGHT order
  one: 'One population of beetles lives in one valley and breeds together.',
  barrier: 'A lava flow splits the valley in two, so the two groups cannot meet (geographic isolation).',
  cond: 'The two groups now live in different conditions: one side is hot and dry, the other cool and damp.',
  sel: 'Natural selection works differently on each side: different alleles help survival.',
  build: 'Over many generations the differences build up in each gene pool.',
  split: 'The groups can no longer interbreed: they are two species.',
};
const ORDER = ['one', 'barrier', 'cond', 'sel', 'build', 'split'];
const SHOWN = [3, 1, 5, 0, 4, 2];                   // the jumbled order the worksheet prints: ORDER[SHOWN[i]] is printed as line a, b, c ...
const D = {
  gen: { years: 3000000, length: 2 },              // Gold worked example: 3 million years, 2 years a generation
  q10: { years: 2000000, length: 4 },              // Gold 10: Darwin's finches, a generation of 4 years
  q11: { years: 120000, length: 2 },               // Gold 11: beetles apart for 120,000 years
};
const R = { gen: D.gen.years / D.gen.length, q10: D.q10.years / D.q10.length, q11: D.q11.years / D.q11.length };
// for each printed line (a to f), the step number (1 to 6) it should be given
const NUMBERS = SHOWN.map((k) => ORDER.indexOf(ORDER[k]) + 1);
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', '(b) horse and donkey: different species (the mule is almost always sterile). (c) cat and dog: different species (no young at all). (d) the oaks: the same species (fertile young).'],
  ['2', 'A group of living things that can breed together and produce fertile offspring.'],
  ['3', 'Speciation is the formation of a new species from an existing one. Geographic isolation is when two groups are kept apart by a barrier, so they cannot breed together.'],
  ['4', 'Any two: sea, mountain range, river, desert, canyon, lava flow, a new road or dam.'],
  ['5', `Line a = ${NUMBERS[0]}, b = ${NUMBERS[1]}, c = ${NUMBERS[2]}, d = ${NUMBERS[3]}, e = ${NUMBERS[4]}, f = ${NUMBERS[5]}. (One population, a barrier, different conditions, different selection, differences build up, can no longer interbreed.)`],
  ['6', 'Deep beaks survive and have more young. The allele for deep beaks becomes more common on island A. On island B slim beaks survive, so the allele for slim beaks becomes more common. Selection works differently on each island.'],
  ['7', 'A mutation is one new allele in one gene pool. A new species needs the two gene pools to differ so much that the groups cannot interbreed, and that takes many thousands of generations of different selection. It is a process, not an event.'],
  ['8', 'While the groups can still interbreed, alleles keep moving between them (gene flow), so their gene pools stay mixed and stay the same. Only a barrier lets each group change in its own way.'],
  ['9', 'Any three: they look different or sing different songs, so they do not choose each other as mates; they breed at different times; their genes differ so much that eggs and sperm do not join; any young are sterile.'],
  ['10', `${n(D.q10.years)} ÷ ${D.q10.length} = ${n(R.q10)} generations.`],
  ['11', `${n(D.q11.years)} ÷ ${D.q11.length} = ${n(R.q11)} generations. It is far too long to see in one life: speciation is slow because each generation changes a gene pool only a little.`],
  ['12', 'Any real example in your own words: animals on islands or in separate lakes, a population split by a new road, dam or mountain range, plants on different sides of a valley. Say the barrier, how the groups are different, and what the test for two species is.'],
  ['13', 'Speciation splits one line into two, and each new line keeps what its ancestor had. The common ancestor of the vertebrates had pharyngeal arches, so fish, chickens and humans, which split from each other at different times, all still build them as embryos. Each then uses them differently: gills in a fish, parts of the jaw and ear in a human. Shared features like this are evidence of the splits.'],
  ['14', 'Steps 1 to 5 have started: one population, a barrier (the forest gaps and the canyon), different conditions and selection, some differences (a white tail and a black belly). Step 6 has not happened. The test: put the two groups together and see whether they breed and have fertile young. If they do not, they are two species.'],
];
Object.assign(module.exports, { D, R, STEPS, ORDER, SHOWN, NUMBERS });

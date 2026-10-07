/**
 * Shuffling The Gene Pool: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page
 * (there is no Answers slide). The numbers are computed here from the data the worksheet prints, and re-derived independently
 * in build/shuffling-the-gene-pool-check.py.
 */
const pc = (k, n) => Math.round((k * 1000) / n) / 10;
const D = {
  q5: { before: [5, 10], after: [4, 4] },                 // Bronze 5: 5 brown of 10 alleles; after the storm 4 brown of 4
  w:  { small: [3, 4], big: [12, 20] },                   // Silver worked: 3 green of 4 beads; 12 green of 20 beads
  q6: { n: 4, green: 1 },                                 // Silver 6: 1 green of 4
  q7: { n: 20, green: 13 },                               // Silver 7: 13 green of 20
  q13: { n: 20, green: 10, lostAlleles: 10, lostGreen: 8 }, // Gold 13: 10 of 20 green; a storm takes 10 alleles, 8 of them green
};
D.q13.left = D.q13.n - D.q13.lostAlleles; D.q13.greenLeft = D.q13.green - D.q13.lostGreen;
const R = {
  q5: [pc(...D.q5.before), pc(...D.q5.after)],
  w: [pc(...D.w.small), Math.abs(pc(...D.w.small) - 50), pc(...D.w.big), Math.abs(pc(...D.w.big) - 50)],
  q6: [pc(D.q6.green, D.q6.n), Math.abs(pc(D.q6.green, D.q6.n) - 50)],
  q7: [pc(D.q7.green, D.q7.n), Math.abs(pc(D.q7.green, D.q7.n) - 50)],
  q13: pc(D.q13.greenLeft, D.q13.left),
};
R.q13change = R.q13 - 50;

module.exports = [
  ['1', 'New allele by a copying mistake? No. Do alleles move between populations? Yes: pollen carries them. Force: GENE FLOW.'],
  ['2', 'Genetic drift is a random change in allele frequencies, caused by chance events and not by any helpful trait.'],
  ['3', '(a) mutation (a brand new allele). (b) natural selection (the trait decides who survives). (c) gene flow (alleles move between populations). (d) genetic drift (chance, and no allele helps).'],
  ['4', 'Natural selection is NOT random: the trait matters, and alleles that help survival and reproduction become more common. Genetic drift IS random: the trait does not matter, and chance decides which alleles pass on.'],
  ['5', `Before: ${D.q5.before[0]} ÷ ${D.q5.before[1]} = ${R.q5[0] / 100} = ${R.q5[0]}%. After: ${D.q5.after[0]} ÷ ${D.q5.after[1]} = ${R.q5[1] / 100} = ${R.q5[1]}%. The storm was random, so this is genetic drift.`],
  ['6', `${D.q6.green} ÷ ${D.q6.n} = ${D.q6.green / D.q6.n} = ${R.q6[0]}%. Distance from 50%: 50 − ${R.q6[0]} = ${R.q6[1]} points.`],
  ['7', `${D.q7.green} ÷ ${D.q7.n} = ${D.q7.green / D.q7.n} = ${R.q7[0]}%. Distance from 50%: ${R.q7[0]} − 50 = ${R.q7[1]} points.`],
  ['8', 'The two populations have different numbers of beads (4 and 20), so their counts cannot be compared fairly. A percentage is a share of its own population, so two percentages can be compared.'],
  ['9', '(a) Natural selection: the allele for deep roots decides who survives. (b) Genetic drift: the mice the tree hits are no different from the others, so it is chance. To tell them apart ask: does the trait decide who survives, or is it chance?'],
  ['10', 'The 20 survivors carried only some of the alleles of the original population. The alleles the survivors did not carry were lost, by chance. The population grew from those 20, so the variation stayed low.'],
  ['11', 'Natural selection makes a population better suited to its environment, because helpful alleles become more common. Genetic drift does not: it is random, so an allele can become common or disappear whether it helps, harms or makes no difference.'],
  ['12', 'Any real case in your own words: a species reduced to a few animals (a bottleneck), a small island population, or a rare species in a zoo. Say why chance matters more when the population is small.'],
  ['13', `Storm: ${D.q13.n} − ${D.q13.lostAlleles} = ${D.q13.left} alleles left, and ${D.q13.green} − ${D.q13.lostGreen} = ${D.q13.greenLeft} green. ${D.q13.greenLeft} ÷ ${D.q13.left} = ${D.q13.greenLeft / D.q13.left} = ${R.q13}%. It fell from 50% to ${R.q13}%, a change of ${Math.abs(R.q13change)} percentage points. Genetic drift, because the storm was random.`],
  ['14', 'After the bottleneck only about 20 animals carried alleles to the next generation. Alleles they did not carry were lost for good, and a bigger population cannot bring them back, because new alleles only come from mutation or gene flow. The population grew, but it grew from a small, unrepresentative sample of the old gene pool.'],
];
Object.assign(module.exports, { D, R });

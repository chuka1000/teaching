/**
 * Small Changes, Big Changes: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's
 * last page (there is no Answers slide). The numbers are computed here from the data the worksheet prints, and
 * re-derived independently in build/small-changes-big-changes-check.py.
 */
const pc = (k, n) => Math.round((k * 1000) / n) / 10;      // k out of n, as a percentage to one decimal place
const D = {
  w:  { n: 25, a: 10, b: 15 },                 // Bronze worked: 25 alleles, 10 black, 15 grey
  q1: { n: 50, a: 15, b: 35 },                 // Bronze 1: 50 alleles, 15 long, 35 short
  q3: { beetles: 10 },                         // Bronze 3: 10 beetles, 2 alleles each
  q4: { brown: 7 },                            // Bronze 4: 7 brown alleles in that pool
  q9: { n: 40, before: 10, after: 24 },        // Silver 9: brown 10 of 40, later 24 of 40
  q13: { beetles: 30, brown: 21 },             // Gold 13: 30 beetles, 21 brown alleles
  q14: { n: 50, brown: 20, lost: 10 },         // Gold 14: 20 of 50, 10 lost and the pool shrinks
};
D.q3.alleles = D.q3.beetles * 2;
D.q13.alleles = D.q13.beetles * 2;
D.q14.newN = D.q14.n - D.q14.lost; D.q14.newBrown = D.q14.brown - D.q14.lost;
const R = {
  w: [pc(D.w.a, D.w.n), pc(D.w.b, D.w.n)],
  q1: [pc(D.q1.a, D.q1.n), pc(D.q1.b, D.q1.n)],
  q4: pc(D.q4.brown, D.q3.alleles),
  q9: [pc(D.q9.before, D.q9.n), pc(D.q9.after, D.q9.n)],
  q13: pc(D.q13.brown, D.q13.alleles),
  q14: pc(D.q14.newBrown, D.q14.newN),
};
R.q9diff = R.q9[1] - R.q9[0];
const f = (x) => String(Number.isInteger(x) ? x : x);

module.exports = [
  ['1', `Long: ${D.q1.a} ÷ ${D.q1.n} = ${D.q1.a / D.q1.n} = ${R.q1[0]}%. Short: ${D.q1.b} ÷ ${D.q1.n} = ${D.q1.b / D.q1.n} = ${R.q1[1]}%. (${R.q1[0]}% + ${R.q1[1]}% = 100%.)`],
  ['2', 'A gene pool is all the alleles of all the individuals in one population.'],
  ['3', `${D.q3.beetles} × 2 = ${D.q3.alleles} alleles. Each beetle has two alleles for each gene.`],
  ['4', `${D.q4.brown} ÷ ${D.q3.alleles} = ${D.q4.brown / D.q3.alleles} = ${R.q4}%.`],
  ['5', 'An allele is a version of a gene. For eye colour: the version that gives brown eyes, and the version that gives blue eyes.'],
  ['6', 'Scale: above the species level (new groups of animals). Time: a very long time (about 375 million years). It is macroevolution.'],
  ['7', '(a) microevolution (one population, an allele frequency changes). (b) macroevolution (a new group, above the species level). (c) microevolution (one population, over about 50 years). (d) macroevolution (new groups, millions of years).'],
  ['8', 'Because the frequency is a share of the ALLELES in the pool, and each beetle carries two alleles. Dividing by the number of beetles would count each beetle once and give a number that is too big.'],
  ['9', `Before: ${D.q9.before} ÷ ${D.q9.n} = ${R.q9[0]}%. After: ${D.q9.after} ÷ ${D.q9.n} = ${R.q9[1]}%. The change is ${R.q9[1]} − ${R.q9[0]} = ${R.q9diff} percentage points. It is microevolution: an allele frequency changed within one population.`],
  ['10', 'A tail and pharyngeal arches. A common ancestor that had them. Nothing turns into another animal: the features are shared, and they develop into different things (gills in a fish; parts of the jaw and ear in a human).'],
  ['11', 'They are not two different processes. Microevolution is small changes in a gene pool, and macroevolution is what those changes add up to over a very long time. We cannot watch macroevolution happen, but fossils, bones, embryos and DNA all show its results.'],
  ['12', 'Any real example in your own words: antibiotic-resistant bacteria, insects that become resistant to a spray, or rats that become resistant to poison. Say what became more common in the population.'],
  ['13', `${D.q13.beetles} beetles × 2 = ${D.q13.alleles} alleles. ${D.q13.brown} ÷ ${D.q13.alleles} = ${D.q13.brown / D.q13.alleles} = ${R.q13}%. (Not ${D.q13.brown} ÷ ${D.q13.beetles} = ${pc(D.q13.brown, D.q13.beetles)}%: that divides by the beetles, not the alleles.)`],
  ['14', `${D.q14.brown} − ${D.q14.lost} = ${D.q14.newBrown} brown alleles left, and the pool is now ${D.q14.n} − ${D.q14.lost} = ${D.q14.newN} alleles. ${D.q14.newBrown} ÷ ${D.q14.newN} = ${D.q14.newBrown / D.q14.newN} = ${R.q14}%.`],
];
Object.assign(module.exports, { D, R });

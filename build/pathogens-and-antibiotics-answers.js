/**
 * Pathogens And Antibiotics: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const A = DATA.antibiotics;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', 'disease.'],
  ['2', 'Any two bacterial diseases, such as tuberculosis, cholera, tetanus or food poisoning.'],
  ['3', 'cold: viral, no. TB: bacterial, yes. flu: viral, no. cholera: bacterial, yes.'],
  ['4', 'c, a, d, b (variation, the antibiotic kills the rest, the survivors reproduce, the offspring are resistant).'],
  ['5', 'Penicillin stops bacteria building their cell wall. Your cells have no cell wall, so it does not harm them.'],
  ['6', `${n(A.million.total)} ÷ ${n(A.million.one_in)} = ${A.million.resistant} resistant bacteria.`],
  ['7', `${n(A.two_million.total)} ÷ ${n(A.two_million.one_in)} = ${A.two_million.resistant} resistant. After ${A.two_million.divisions} divisions: ${A.two_million.resistant} × 2^${A.two_million.divisions} = ${A.two_million.after}. (A best case: bacteria in a patient divide more slowly.)`],
  ['8', 'The antibiotic does not make the resistance. It kills the bacteria that are not resistant, so the resistant ones survive and reproduce. That is selection.'],
  ['9', 'Nothing learns. A few bacteria were already resistant by chance. The antibiotic killed the others and the resistant survivors passed resistance on to their offspring.'],
  ['10', 'Take antibiotics exactly as the doctor says and do not save leftovers. Saving them means taking the wrong drug for the wrong infection, and every use selects for resistant bacteria.'],
  ['11', `${A.grow.survivors} × 2^${A.grow.div_3h} = ${n(A.grow.after_3h)} resistant bacteria (a best case, with plenty of food).`],
  ['12', `${A.tb.died_m} ÷ ${A.tb.ill_m} × 100 = ${A.tb.pct}% (to the nearest whole number).`],
  ['13', 'A resistance plasmid can be passed from a resistant bacterium to another bacterium that touches it, even of a different species. The second bacterium then has the resistance gene, without dividing.'],
  ['14', 'Variation: a few bacteria are already resistant. Selection: every use of an antibiotic kills the others. Survival: the resistant ones reproduce. Inheritance: so resistance becomes more common. More use means more selection.'],
];
module.exports.DATA = DATA;

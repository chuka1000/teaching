/**
 * The Bacteria: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const S = DATA.shapes;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', 'bacillus. bacilli.'],
  ['2', 'A coccus (cocci). B bacillus (bacilli). C spirillum (spirilla).'],
  ['3', 'Photosynthetic: makes its own food using light (cyanobacteria). Decomposer: feeds on dead plants and animals. Parasite: feeds on a living host and harms it. Chemosynthetic: makes its own food using energy from chemicals.'],
  ['4', 'photosynthetic, decomposers, parasites, chemosynthetic.'],
  ['5', 'a decomposer. b photosynthetic. c parasite. d chemosynthetic.'],
  ['6', 'A parasite feeds on a living host. A decomposer feeds on dead material. (Both take their food from other organisms.)'],
  ['7', 'It makes its own food by photosynthesis, using light, so it does not need to feed on other organisms.'],
  ['8', 'There is no sunlight deep in the ocean, so photosynthesis is not possible. Chemosynthetic bacteria use the energy in chemicals, such as hydrogen sulfide, instead of light.'],
  ['9', 'A coccus is a sphere, not a rod (a rod is a bacillus). The bacteria inside a tube worm make food from chemicals (chemosynthetic). They help the worm, so they are not parasites.'],
  ['10', 'Any real place with dead material: a compost heap, a rotting log, fallen leaves, soil. The bacteria feed on the dead material and break it down.'],
  ['11', `${n(DATA.size.um_per_mm)} ÷ ${S.coccus_um} = ${n(S.coccus_across)} cocci across 1 mm.`],
  ['12', `3 × 60 = ${S.gold_div.minutes} minutes. ${S.gold_div.minutes} ÷ ${S.gold_div.gen} = ${S.gold_div.divisions} divisions. 2^${S.gold_div.divisions} = ${n(S.gold_div.cells)} bacteria.`],
  ['13', `One division a day for ${S.daily.days} days is ${S.daily.days} divisions. 2^${S.daily.days} = ${n(S.daily.cells)} cyanobacteria.`],
  ['14', 'Cyanobacteria released oxygen by photosynthesis. Over a very long time it built up in the air. Animals need oxygen to release energy from their food, so animals could not live without it. (Any two linked points.)'],
];
module.exports.DATA = DATA;

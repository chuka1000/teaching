/**
 * Archaea And Extreme Places: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const A = DATA.archaea;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', 'oxygen. methane.'],
  ['2', 'Thermophile: very hot places. Halophile: very salty places. Methanogen: places with no oxygen, and it makes methane.'],
  ['3', 'Bacteria, Archaea, Eukarya.'],
  ['4', 'Archaea are a different group from bacteria: false for “a type of bacteria”. Archaea have no nucleus. They look like bacteria under a microscope. (Answers: F, F, T.)'],
  ['5', 'Eukarya. Your cells have a nucleus.'],
  ['6', 'They look the same under a microscope, so scientists use their chemistry (cell wall and membrane) and their DNA to tell them apart.'],
  ['7', 'Bacteria live in hot springs too, for example cyanobacteria. Being in a hot spring does not decide the group. She needs to check its chemistry or its DNA.'],
  ['8', 'Archaea and bacteria are about the same size and shape and both lack a nucleus, so looking cannot tell them apart. Their chemistry and DNA differ.'],
  ['9', 'a archaean. b bacterium. c neither (a virus). d archaean. e neither (a yeast has a nucleus). f bacterium.'],
  ['10', 'Any real place with no oxygen: a cow’s stomach, a swamp or bog, a rice paddy, a sewage works, a landfill site. Methane-making archaea live there.'],
  ['11', `${A.dead_sea.pct} ÷ ${A.dead_sea.sea_pct} = ${A.dead_sea.exact}, so about ${A.dead_sea.times} times saltier.`],
  ['12', `${A.cow.low} × 7 = ${n(A.cow.week_low)} litres. ${A.cow.high} × 7 = ${n(A.cow.week_high)} litres. So between ${n(A.cow.week_low)} and ${n(A.cow.week_high)} litres in a week.`],
  ['13', `${A.temps.record} − ${A.temps.boil} = ${A.temps.above_boil} °C above the boiling point of water at sea level. High pressure stops the water boiling.`],
  ['14', 'Life exists in extreme places on Earth, in hot water and under ice. So places in the Solar System that look too extreme, such as the oceans under the ice of Europa and Enceladus, cannot be ruled out. We have not found life anywhere except Earth.'],
];
module.exports.DATA = DATA;

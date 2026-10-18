/**
 * What It Does To Us: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/atmosphere.data.json (written by build/atmosphere-check.py, which re-derives each with sympy).
 */
const DATA = require('./atmosphere.data.json');
const Z = DATA.l2;

module.exports = [
  ['1', 'lungs.'],
  ['2', 'Particulates: deep into the lungs (asthma, heart disease). Carbon monoxide: takes the place of oxygen in the blood. Ozone: irritates the airways (coughing, asthma).'],
  ['3', 'Your own ranking, from the table. The sealed trap F should be cleanest (rank 6). A (the car park) is likely to be among the dirtiest.'],
  ['4', 'Your own trap. Likely A or B: vehicle exhaust and soot, or cooking and the extractor. Any sensible source.'],
  ['5', 'Any two of: catalytic converters, scrubbers on chimneys, low-sulfur fuel, laws.'],
  ['6', `${Z.ws_fish.fish} × ${Z.ws_fish.pct} ÷ 100 = ${Z.ws_fish.dead} die. ${Z.ws_fish.fish} − ${Z.ws_fish.dead} = ${Z.ws_fish.left} fish left.`],
  ['7', 'Acid rain is caused by sulfur dioxide and nitrogen oxides, not carbon dioxide. They dissolve in cloud water and make sulfuric and nitric acid.'],
  ['8', 'coal containing sulfur is burned 1, sulfur dioxide is released 2, the gases dissolve in cloud water 3, sulfuric acid forms 4, acid rain falls 5.'],
  ['9', 'Marble is calcium carbonate, which reacts with acid and slowly dissolves. The statue loses its detail and gets rough and worn.'],
  ['10', 'A taller chimney only spreads the gases further. They still make acid rain, which falls somewhere else. The gases must be removed.'],
  ['11', 'SO₂: burning coal and oil that contain sulfur; acid rain, and irritates the airways; scrubbers or low-sulfur fuel. NOx: very hot flames in engines; acid rain and irritates the airways; catalytic converter.'],
  ['12', 'Your own place or time (a busy road, a bonfire, a factory, cooking). A sensible idea: walk or cycle, cleaner buses, ask for a rule or a clean-air zone.'],
  ['13', 'A law applies to everyone and is enforced, so no one is at a disadvantage for cleaning up. One person asking others to pollute less has no effect on the total.'],
];
module.exports.DATA = DATA;

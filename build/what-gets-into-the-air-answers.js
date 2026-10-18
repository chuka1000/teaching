/**
 * What Gets Into The Air: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/atmosphere.data.json (written by build/atmosphere-check.py, which re-derives each with sympy).
 */
const DATA = require('./atmosphere.data.json');
const Z = DATA.l1;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', 'sulfur. The coal contains sulfur, so burning it makes sulfur dioxide.'],
  ['2', 'CO: E. SO₂: B. NOx: C. Particulates: D. VOCs: A.'],
  ['3', 'carbon monoxide P, ozone in smog S, sulfur dioxide P, soot P.'],
  ['4', 'London 1952: coal smoke and sulfur dioxide trapped under cold, still air. Los Angeles: sunlight makes ozone from nitrogen oxides and VOCs.'],
  ['5', 'Any two of: volcanoes, wildfires, dust storms.'],
  ['6', `${n(Z.coal.coal)} × ${Z.coal.pct} ÷ 100 = ${Z.coal.sulfur} tonnes of sulfur.`],
  ['7', 'Ozone is not released. It is made later, in the air, from other pollutants, so there is none at the exhaust pipe.'],
  ['8', 'Cars release nitrogen oxides and VOCs. Sunlight makes them react. The reaction makes ozone.'],
  ['9', 'Heat and sunlight drive the reactions that make ozone. Still air means the pollution is not blown away, so it builds up. Traffic supplies the nitrogen oxides and VOCs.'],
  ['10', 'Any real place or time in your own words: a hazy day over a city, behind a bus, a bonfire, a barbecue. You could not see the gas itself, only the haze.'],
  ['11', 'Cause: London coal smoke and sulfur dioxide; Los Angeles traffic exhaust and sunlight. Weather: London cold, still, foggy; Los Angeles hot, sunny, still. Main harmful substances: London soot and sulfur dioxide (primary); Los Angeles ozone (secondary).'],
  ['12', 'It was smoke and sulfur dioxide trapped by fog and still air, so it was full of pollutants. The fog only held them near the ground.'],
  ['13', 'Likely dirtiest: A (beside the car park), because of vehicle exhaust and soot. Likely cleanest outdoors: D or E. F is the control: it shows what is on a slide before it is put out, so any specks on the others come from where they were.'],
];
module.exports.DATA = DATA;

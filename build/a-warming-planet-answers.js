/**
 * A Warming Planet: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/atmosphere.data.json (written by build/atmosphere-check.py from the real NOAA and NASA files).
 */
const DATA = require('./atmosphere.data.json');
const Z = DATA.l4;

module.exports = [
  ['1', `${Z.gh.without}. ${Z.gh.with_}.`],
  ['2', 'Any two of: carbon dioxide, methane, nitrous oxide, water vapour.'],
  ['3', 'F, T, F, T. The greenhouse effect is natural and needed. The ozone hole is a different problem.'],
  ['4', 'Any two of: the temperature record, ice cores, shrinking Arctic sea ice, retreating glaciers, rising sea level.'],
  ['5', 'Any two of: sea level rise, more extreme weather, species moving, coral bleaching, changes to crops and water.'],
  ['6', `${Z.ws.y2025} − ${Z.ws.y1959} = ${Z.ws.rise} ppm. ${Z.ws.rise} ÷ ${Z.ws.y1959} × 100 = ${Z.ws.pct}%.`],
  ['7', 'Plants take in carbon dioxide when they grow in the Northern Hemisphere summer, so it falls, and it rises again in winter. The climb is the extra carbon dioxide from people.'],
  ['8', 'The temperature has gone up. Cooler than the 1951 to 1980 average before about 1940, warmer after about 1980, and the warmest years are all recent.'],
  ['9', 'Sunlight passes through the air and warms the ground. The ground gives out infrared. Greenhouse gases absorb it and send it out in all directions, some back down, so the Earth is warmer.'],
  ['10', 'Your own example: a car, a bus, a gas cooker, a power station. Something that burns fossil fuels, and a way to use less (walk, cycle, switch it off, use renewable power).'],
  ['11', 'Air pollution. Climate change. Ozone depletion. Climate change. Air pollution. Ozone depletion (in the order of the items on the sheet).'],
  ['12', `${Z.ws.y2025} − ${Z.ws.ice_max} = ${Z.ws.above_ice} ppm higher than the highest value in 800,000 years.`],
  ['13', 'Montreal: a few chemicals, a few companies, replacements close at hand, and the risk felt personal. Climate change: carbon dioxide comes from almost everything we do, fossil fuels are built into how we make energy, and the harm is spread over many places and years.'],
  ['14', 'Different gases (CFCs, not carbon dioxide and methane). Different place (the stratosphere, not the whole atmosphere). Different harm (more ultraviolet light, not trapped heat).'],
];
module.exports.DATA = DATA;

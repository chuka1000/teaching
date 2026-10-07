/**
 * Finite Freshwater: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * The numbers are the data the worksheet prints and the model aquifer animation draws; build/finite-freshwater-check.py re-derives every one
 * independently, and checks the data tables against the sources (FAO AQUASTAT, World Bank / FAO per-capita water, Water Footprint Network, IMD).
 */
const USES = { agri: 70, industry: 20, homes: 10 };               // % of the fresh water people take (FAO AQUASTAT: 69, 19, 12 worldwide)
const FOOT = { burger: 2400, shirt: 2700 };                        // litres, Water Footprint Network global averages
const PERCAP = { Canada: 73000, Brazil: 41000, China: 1900, India: 1400, Egypt: 560, 'Saudi Arabia': 69, Kuwait: 5 };   // m3 per person per year, rounded (FAO / World Bank, 2020)
const MONSOON = { share: 75, months: 4 };                          // about 75% of India's rain falls in June to September

const D = {
  w:  { litres: 1000 },                                            // Bronze worked example: of every 1,000 L taken
  q3: { total: 4000 },                                             // Bronze 3: 4,000 L taken, how much goes to farming
  q4: { bucket: 10 },                                              // Bronze 4: hamburger, in 10 L buckets
  sw: { stock: 1000, recharge: 10, pump: 50 },                     // Silver worked example (also the animation)
  q6: { stock: 900, recharge: 15, pump: 60 },                      // Silver 6 and 7
  gw: { a: 'Canada', b: 'Saudi Arabia' },                          // Gold worked example
  q10: { a: 'Brazil', b: 'Egypt' },                                // Gold 10
};
const R = {
  w: { agri: D.w.litres * USES.agri / 100, industry: D.w.litres * USES.industry / 100, homes: D.w.litres * USES.homes / 100 },
  q3: D.q3.total * USES.agri / 100,
  q4: FOOT.burger / D.q4.bucket,
  swNet: D.sw.pump - D.sw.recharge, swEmpty: D.sw.stock / (D.sw.pump - D.sw.recharge), swRefill: D.sw.stock / D.sw.recharge,
  q6Net: D.q6.pump - D.q6.recharge, q6Empty: D.q6.stock / (D.q6.pump - D.q6.recharge), q6Refill: D.q6.stock / D.q6.recharge,
  gwTimes: Math.round(PERCAP[D.gw.a] / PERCAP[D.gw.b]),
  q10Times: Math.round(PERCAP[D.q10.a] / PERCAP[D.q10.b]),
  monsoonIn: MONSOON.share / MONSOON.months,                       // 18.75 % of the year's rain per month
  monsoonOut: (100 - MONSOON.share) / (12 - MONSOON.months),       // 3.125 % per month
};
R.monsoonTimes = R.monsoonIn / R.monsoonOut;                       // 6
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', '(a) irrigating a wheat field: agriculture. (b) cooling a power station: industry. (c) washing clothes at home: homes. (d) giving drinks to cattle: agriculture. (e) making paper in a factory: industry.'],
  ['2', 'Agriculture (farming), industry and homes. Agriculture uses the most: about 70% of the fresh water people take.'],
  ['3', `${n(D.q3.total)} × ${USES.agri} ÷ 100 = ${n(R.q3)} litres.`],
  ['4', `${n(FOOT.burger)} ÷ ${D.q4.bucket} = ${R.q4} buckets.`],
  ['5', 'Most of the water is used to grow the cotton: it is irrigated (agriculture). More is used in factories to spin, dye and finish the cloth (industry). The water is not in the T-shirt: it was used to make it.'],
  ['6', `Net loss: ${D.q6.pump} − ${D.q6.recharge} = ${R.q6Net} billion litres a year. Time to empty: ${D.q6.stock} ÷ ${R.q6Net} = ${R.q6Empty} years.`],
  ['7', `${D.q6.stock} ÷ ${D.q6.recharge} = ${R.q6Refill} years to refill, ${R.q6Refill / R.q6Empty} times as long as the ${R.q6Empty} years it took to empty. Refilling is much slower than emptying, so a renewable resource can still be used up.`],
  ['8', 'The rain still adds water while the pumps take it out. Only the difference is lost from the aquifer each year, so the net loss is pumping minus recharge.'],
  ['9', 'Any two: wells dry up; wells and pumps must go deeper, which costs more; streams and lakes fed by groundwater shrink; the ground sinks.'],
  ['10', `${n(PERCAP[D.q10.a])} ÷ ${PERCAP[D.q10.b]} = ${(PERCAP[D.q10.a] / PERCAP[D.q10.b]).toFixed(1)}, so Brazil has about ${R.q10Times} times as much.`],
  ['11', `In the monsoon: ${MONSOON.share} ÷ ${MONSOON.months} = ${R.monsoonIn}% a month. In the other eight months: ${100 - MONSOON.share} ÷ ${12 - MONSOON.months} = ${R.monsoonOut}% a month. ${R.monsoonIn} ÷ ${R.monsoonOut} = ${R.monsoonTimes} times as much.`],
  ['12', 'Any real example in your own words: a dry season, a drought, a city far from a river, a farm that irrigates from a well. Say where the water is, when it falls, and why the people cannot use it.'],
  ['13', 'A reservoir or tank stores the water that falls in the wet months, so it can be used in the dry months. It can still run out if the dry season is longer than usual, or if the rains fail, or if more is used than the store holds.'],
  ['14', 'A good answer says: where (the world has plenty, but it is far from some people: Canada has about 1,000 times more per person than Saudi Arabia) and when (the rain can fall in a few months, as in India, or the water may not be there when needed). So how much is not the whole story: the water has to be in the right place at the right time.'],
];
Object.assign(module.exports, { D, R, USES, FOOT, PERCAP, MONSOON });

/**
 * How Much Water Can We Actually Use: the worksheet answers, in ONE place. They are printed UPSIDE DOWN
 * at the foot of the last page, and the numbers are checked in
 * build/how-much-water-can-we-actually-use-check.py (which recomputes every one from the USGS volumes).
 * The worksheet's worked examples are read out of the same constants, so the sheet and the answers
 * cannot disagree.
 */
const FRESH_SHARE = 2.5;         // % of all water that is fresh
const ICE_SHARE = 70;            // % of fresh water frozen in ice caps and glaciers
const GROUND_SHARE = 30;         // % of fresh water that is groundwater
const SURFACE_SHARE = 0.3;       // % of fresh water in lakes, swamps and rivers
const pct = (v, p) => Math.round(v * p * 1000) / 100000;   // v x p / 100, free of float noise

const W = { all: 2000, fresh: pct(2000, FRESH_SHARE) };                 // the Bronze worked example: 50 mL
const B1 = { all: 3000, fresh: pct(3000, FRESH_SHARE) };                // 75 mL
const B3 = { all: 8000, fresh: pct(8000, FRESH_SHARE) };                // 200 mL
const SW = { fresh: 25, ice: pct(25, ICE_SHARE), rest: 25 - pct(25, ICE_SHARE) };   // 17.5 and 7.5
const S6 = { fresh: pct(4000, FRESH_SHARE) };                           // the 4,000 mL model has 100 mL of fresh water
S6.ground = pct(S6.fresh, GROUND_SHARE);                                // 30 mL
const S7 = { surface: pct(S6.fresh, SURFACE_SHARE) };                   // 0.3 mL
const LAKE = { holds: 60, take: 12, add: 9 };                           // million litres, and per year
LAKE.net = LAKE.take - LAKE.add;                                        // 3 million a year
LAKE.years = LAKE.holds / LAKE.net;                                     // 20 years

module.exports = [
  ['1', `${B1.all.toLocaleString('en-GB')} × ${FRESH_SHARE} ÷ 100 = ${(B1.all * FRESH_SHARE).toLocaleString('en-GB')} ÷ 100 = ${B1.fresh} mL.`],
  ['2', '(b) a well: groundwater. (c) a river: surface water. (d) a glacier in the Alps: ice. (e) Lake Victoria: surface water.'],
  ['3', `${B3.all.toLocaleString('en-GB')} × ${FRESH_SHARE} ÷ 100 = ${B3.fresh} mL.`],
  ['4', 'Sea water has too much salt dissolved in it. People cannot drink it, and it harms most crops.'],
  ['5', 'Ice caps and glaciers, groundwater, and lakes, rivers and swamps. Ice caps and glaciers hold the most (about 70% of fresh water).'],
  ['6', `${S6.fresh} × ${GROUND_SHARE} ÷ 100 = ${S6.ground} mL.`],
  ['7', `${S6.fresh} × ${SURFACE_SHARE} ÷ 100 = ${S7.surface} mL. That is about 6 drops, out of a 4,000 mL model.`],
  ['8', 'Because 70% is the share of the FRESH water, not of all the water. The fresh water is only 25 mL, so 70% of 1,000 mL would be far too big.'],
  ['9', 'The ice is frozen, and it is far away, mostly in Antarctica and Greenland. A city cannot pipe it in, and it is not liquid until it melts.'],
  ['10', 'It is deep underground, so it costs a lot to pump out. Deep water can take thousands of years to refill, so if it is pumped faster than that it behaves like a non-renewable resource.'],
  ['11', 'Some soaks into the ground (infiltration) and becomes groundwater. The river refills faster: months, against 100 to 200 years for shallow groundwater and about 10,000 years for deep groundwater.'],
  ['12', `(a) No. The town takes ${LAKE.take} million litres a year and only ${LAKE.add} million are added. (b) ${LAKE.take} − ${LAKE.add} = ${LAKE.net} million litres lost each year. ${LAKE.holds} ÷ ${LAKE.net} = ${LAKE.years} years.`],
  ['13', 'Any real example in your own words: where you or your family get water (a tap supplied by a river, a well, a bottle of mineral water), which source it is (ice melt, groundwater, surface water), and one thing that could make it run short, such as a dry year or taking it faster than it refills.'],
  ['14', 'Jar 2, the one with the fertiliser, should be greener: the fertiliser feeds the tiny algae in the pond water, so they grow faster. The one thing different between the jars is the fertiliser (the independent variable). Jar 1 may go slightly green too, only less. Say what you predicted, and why.'],
];
module.exports.CONST = { FRESH_SHARE, ICE_SHARE, GROUND_SHARE, SURFACE_SHARE, W, B1, B3, SW, S6, S7, LAKE };

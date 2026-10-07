/**
 * Deep Time: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number is computed here from build/deep-time.data.json and exported as N; build/deep-time-check.py re-derives each one with sympy.
 */
const DATA = require('./deep-time.data.json');
const EV = (k) => DATA.events[k][1];
const ERA = Object.fromEntries(DATA.eras.map(([n, a, b]) => [n, [a, b]]));
const AGE = DATA.earth_age;
const r1 = (x) => Math.round(x * 10) / 10, r3 = (x) => Math.round(x * 1000) / 1000;
const hhmm = (minsBeforeMidnight) => { const m = 24 * 60 - Math.round(minsBeforeMidnight); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

const N = {
  meso: ERA.Mesozoic, palaeo: ERA.Palaeozoic,
  dinoHours: r1(EV('dinosaurs') / AGE * 24), dinoMin: Math.round(EV('dinosaurs') / AGE * 24 * 60), dinoClock: hhmm(EV('dinosaurs') / AGE * 24 * 60),
  astHours: r3(EV('asteroid') / AGE * 24),
  astMin: r1(r3(EV('asteroid') / AGE * 24) * 60),                     // from the rounded hours, as a student will work it
  astClock: hhmm(Math.round(r1(r3(EV('asteroid') / AGE * 24) * 60))),
  humanSec: r1(EV('humans') / AGE * 24 * 60 * 60),
  astM: EV('asteroid') / 100, humanMm: Math.round(EV('humans') / 100 * 1000),
  preShare: r1((AGE - ERA.Palaeozoic[0]) / AGE * 100), preLen: AGE - ERA.Palaeozoic[0],
  trexSteg: DATA.stegosaurus - DATA.trex, trexUs: r1(DATA.trex - EV('humans')), dinoUs: r1(EV('asteroid') - EV('humans')),
};
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', `The Mesozoic ran from ${N.meso[0]} to ${N.meso[1]} million years ago. ${EV('dinosaurs')} is between them, so the Mesozoic.`],
  ['2', 'Precambrian, Palaeozoic, Mesozoic, Cenozoic.'],
  ['3', `First life (${n(EV('life'))}), first fish (${EV('fish')}), first land plants (${EV('plants')}), first humans (${EV('humans')}).`],
  ['4', 'A large share of all species, about three quarters or more, die out in a short time, all over the Earth.'],
  ['5', `The Cenozoic. The first birds: the Mesozoic (${EV('birds')} is between ${N.meso[0]} and ${N.meso[1]}).`],
  ['6', `${DATA.stegosaurus} − ${DATA.trex} = ${N.trexSteg} million years. ${DATA.trex} − ${EV('humans')} = ${N.trexUs} million years. So T. rex lived closer in time to us than to Stegosaurus.`],
  ['7', 'About three quarters of all species died out, not just one, in a short time and all over the world, including every dinosaur except the birds. Many species, a short time, worldwide.'],
  ['8', '"Years ago" counts backwards from now. 539 million years ago is further from now than 470 million years ago, so it is older.'],
  ['9', 'A barrier splits the population, so the groups cannot meet to breed. Gene flow stops: alleles no longer move between them. Different selection on each side changes each gene pool over many generations, until they can no longer interbreed.'],
  ['10', `${EV('asteroid')} ÷ ${n(AGE)} × 24 = ${N.astHours} hours. ${N.astHours} × 60 = ${N.astMin} minutes, about 21 minutes. 24:00 − 21 minutes = ${N.astClock} (accept 23:40 if you rounded early).`],
  ['11', `${EV('humans')} ÷ ${n(AGE)} × 24 × 60 × 60 = ${N.humanSec} seconds before midnight, about 6 seconds: 23:59:54.`],
  ['12', 'Any real example in your own words: rock layers in a cliff or a road cutting, a museum fossil gallery, a film that puts people with dinosaurs (and why that is wrong). Say what it shows about how long Earth’s history is.'],
  ['13', `${EV('asteroid')} ÷ 100 = ${N.astM} m (66 cm) from the "now" end. ${EV('humans')} ÷ 100 = 0.003 m = ${N.humanMm} mm from the end.`],
  ['14', `${n(AGE)} − ${N.palaeo[0]} = ${n(N.preLen)} million years. ${n(N.preLen)} ÷ ${n(AGE)} × 100 = ${N.preShare}%, almost nine tenths.`],
];
Object.assign(module.exports, { N, DATA });

/**
 * Averages, Graphs And Models: the worksheet answers, in ONE place. They are printed UPSIDE DOWN on
 * the last page of the worksheet (there is no Answers slide). Every number is computed here from
 * the results file and checked independently in build/averages-graphs-and-models-check.py.
 */
const DATA = require('./averages-graphs-and-models.data.json');
const sum = (a) => a.reduce((x, y) => x + y, 0);
const MEANS = DATA.trials.map((t) => sum(t) / t.length);
const RANGES = DATA.trials.map((t) => Math.max(...t) - Math.min(...t));
const n = DATA.heights.length, mx = sum(DATA.heights) / n, my = sum(MEANS) / n;
const SLOPE = sum(DATA.heights.map((x, i) => (x - mx) * (MEANS[i] - my))) / sum(DATA.heights.map((x) => (x - mx) ** 2));
const INTERCEPT = my - SLOPE * mx;
const PRED = (h) => SLOPE * h + INTERCEPT;
const list = (a) => a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

module.exports = [
  ['1', `${list(MEANS)} cm. For 10 cm: (${DATA.trials[0].join(' + ')}) ÷ 3 = ${MEANS[0]}.`],
  ['2', `${list(RANGES)} cm. For 10 cm: ${Math.max(...DATA.trials[0])} − ${Math.min(...DATA.trials[0])} = ${RANGES[0]}.`],
  ['3', `10 cm. Its range, ${RANGES[0]} cm, is the smallest, so its results are closest together.`],
  ['4', 'Independent variable: the height of the ramp. Dependent variable: the distance the car rolled.'],
  ['5', '(a) Line graph. (b) Bar chart. (c) Pie chart.'],
  ['6', `Height of ramp (cm) on the x-axis, mean distance rolled (cm) on the y-axis. Points at ${DATA.heights.map((h, i) => `(${h}, ${MEANS[i]})`).join(', ')}.`],
  ['7', 'One straight line, drawn with a ruler, through the middle of the points, with about as many points above it as below. Not dot to dot.'],
  ['8', `About ${Math.round(PRED(35))} cm. Accept 130 to 140 cm.`],
  ['9', `About ${Math.round(PRED(100))} cm. Accept 350 to 400 cm. Less trustworthy: 100 cm is far outside the heights tested (10 to 50 cm), and the pattern may not carry on.`],
  ['10', 'It is a simplified picture of how the distance depends on the height. It is used to predict results we did not measure. One limit: it is only reliable for heights close to the ones tested.'],
];
module.exports.DATA = DATA; module.exports.MEANS = MEANS; module.exports.RANGES = RANGES; module.exports.PRED = PRED; module.exports.SLOPE = SLOPE; module.exports.INTERCEPT = INTERCEPT;

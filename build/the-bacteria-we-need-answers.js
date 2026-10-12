/**
 * The Bacteria We Need: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const U = DATA.useful;

module.exports = [
  ['1', 'Decomposers. nutrients. soil.'],
  ['2', 'Nitrogen fixers: in root nodules, change nitrogen gas into a form plants can use. Gut bacteria: help to break down fibre, make vitamin K. Food makers: make yoghurt, cheese and fermented pickles. Insulin bacteria: carry the human gene and make human insulin.'],
  ['3', 'Any two of: yoghurt, cheese, sauerkraut, kimchi, fermented pickles. Bread is made with yeast.'],
  ['4', 'b, d, a, e, c (cut out the gene, put it in a plasmid, put the plasmid in a bacterium, the bacteria divide, collect the insulin).'],
  ['5', 'False. Bread rises because of yeast, which is a fungus.'],
  ['6', 'Dead leaves would pile up and stay, and the nutrients in them would never go back into the soil, so new plants would run short.'],
  ['7', 'Peas have nitrogen-fixing bacteria in their root nodules. They turn nitrogen gas from the air into a form plants can use, and some of it stays in the soil.'],
  ['8', 'A plasmid is a small loop of DNA that bacteria can take in and copy. When the bacterium divides, the plasmid is copied too, so every new cell has the gene and makes insulin.'],
  ['9', 'Any two: they help break down fibre that you cannot digest, they make vitamin K, and they make it harder for harmful bacteria to settle. (Say what each does.)'],
  ['10', 'Any real example: yoghurt or cheese at home, compost in a garden, soil under peas or beans. Say what the bacteria do.'],
  ['11', `38 ÷ 30 = ${U.gut_ratio} (to 1 decimal place), so about ${U.gut_ratio} bacterial cells for every human cell. About as many.`],
  ['12', `6.7 − 4.3 = ${U.ph_fall}. The pH falls by ${U.ph_fall}.`],
  ['13', `3 litres = 3,000 mL. 3,000 ÷ 500 = 6. 6 × 2 = ${U.spoons_3l} spoonfuls.`],
  ['14', 'Examples: decomposers recycle nutrients, nitrogen fixers feed plants, gut bacteria help digestion, bacteria make yoghurt and insulin. Only a small fraction of bacteria cause disease. (Three examples with a job each.)'],
];
module.exports.DATA = DATA;

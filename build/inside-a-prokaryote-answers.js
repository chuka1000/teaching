/**
 * Inside A Prokaryote: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/prokaryotes.data.json (written by build/prokaryotes-check.py, which re-derives each with sympy).
 */
const DATA = require('./prokaryotes.data.json');
const Z = DATA.size;
const n = (x) => x.toLocaleString('en-GB');

module.exports = [
  ['1', 'nucleus. Loose (in the cytoplasm).'],
  ['2', 'Any two of: a cell wall, plasmids, a flagellum.'],
  ['3', 'B ribosomes, C plasmid, D cell membrane, E main DNA loop, F flagellum, G cytoplasm.'],
  ['4', 'A nucleus, B cell membrane, C cytoplasm, D mitochondrion, E ribosomes.'],
  ['5', 'One of your cells has a nucleus. A prokaryote has none.'],
  ['6', 'DNA: in the nucleus. Cell wall: yes / no. Plasmids: yes / no. Flagellum: some have one / no. Size: about 1 to 5 µm / about 10 to 100 µm.'],
  ['7', 'cell membrane B, plasmid P, nucleus E, DNA B, cell wall P, cytoplasm B, mitochondrion E, flagellum P.'],
  ['8', 'A prokaryote does have DNA. A nucleus is only where the DNA is kept in your cells. In a prokaryote the DNA is loose in the cytoplasm.'],
  ['9', 'A school microscope is limited by light. Plasmids and a flagellum are too small and thin to show, so a bacterium looks like a dot. An electron microscope is needed.'],
  ['10', 'Any two real places in your own words: your skin, your gut, soil, yoghurt, a pond, a kitchen bin. You could not see a single cell there: it is too small.'],
  ['11', `${Z.cheek_um} ÷ ${Z.bact_um} = ${Z.across_cheek}. So ${Z.across_cheek} bacteria fit across the cell.`],
  ['12', `${Z.bact_um} × ${Z.mag} = ${n(Z.at_mag_um)} µm. ${n(Z.at_mag_um)} ÷ ${n(Z.um_per_mm)} = ${Z.at_mag_mm} mm.`],
  ['13', 'Different, not simpler: it has a cell wall, plasmids and a flagellum that your cells do not, and it lives in almost every habitat on Earth. (Any two reasons.)'],
  ['14', 'The plasmid carries genes, so the bacterium gets new genes and can do something it could not do before. (Any sensible change.)'],
];
module.exports.DATA = DATA;

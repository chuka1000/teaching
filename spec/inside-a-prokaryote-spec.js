/** Emits spec/inside-a-prokaryote.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('inside-a-prokaryote', 'Inside A Prokaryote');
const { slug } = require('../build/prokaryotes-diagram');
const { click, zoom, S } = SP;
/** The objects one part brings in: its picture layers, its label, its leader line and its dot. */
const part = (kind, name, layers = []) => [...layers.map((l) => `ly_${l}`), `lb_${kind}_${slug(name)}`, `ln_${kind}_${slug(name)}`, `dt_${kind}_${slug(name)}`];

SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the cell and its two labels, the nucleus, the mitochondria, the ribosomes, then the banner */
S(4, {
  groups: [
    { name: 'e_cell', members: [...part('euk', 'membrane', ['euk_cell']), ...part('euk', 'cytoplasm'), 'euk_size'] },
    { name: 'e_nuc', members: part('euk', 'nucleus', ['euk_nuc']) },
    { name: 'e_mito', members: part('euk', 'mitochondrion', ['euk_mito']) },
    { name: 'e_ribo', members: part('euk', 'ribosomes', ['euk_ribo']) },
  ],
  builds: [click('e_cell'), click('e_nuc'), click('e_mito'), click('e_ribo'), zoom('euk_banner')],
});
/* 5. I Do 2: the micrograph, wall + membrane + cytoplasm, ribosomes + DNA, plasmid + flagellum, then the definition */
S(5, {
  groups: [
    { name: 'p_mic', members: ['mic_photo', 'mic_cap'] },
    { name: 'p_out', members: [...part('prok', 'cell wall', ['prok_wall']), ...part('prok', 'cell membrane', ['prok_cyto']), ...part('prok', 'cytoplasm')] },
    { name: 'p_in', members: [...part('prok', 'ribosomes', ['prok_ribo']), ...part('prok', 'main DNA loop', ['prok_dna'])] },
    { name: 'p_new', members: [...part('prok', 'plasmid', ['prok_plasmid']), ...part('prok', 'flagellum', ['prok_flag'])] },
  ],
  builds: [click('p_mic'), click('p_out'), click('p_in'), click('p_new'), zoom('def_banner')],
});
SP.weDoRC(6, [0, 3, 2, 1]);      // weakest (A), strongest (D), then C, then B
SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

/** Emits spec/a-warming-planet.anim.json. Flat 150 ms. */
const SP = require('../build/atmosphere-spec-kit')('a-warming-planet', 'A Warming Planet');
const { click, beat, zoom, S, range } = SP;

SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the animation (on click), the two temperatures, the gases, the one-line mechanism, then the banner */
S(4, {
  groups: [
    { name: 'g_num', members: ['cold_bg', 'cold_t', 'cold_l', 'warm_bg', 'warm_t', 'warm_l'] },
    { name: 'g_gas', members: ['gases_bg', 'gases_t'] },
    { name: 'g_mech', members: ['mech_bg', 'mech_t'] },
  ],
  builds: [click({ target: 'vid_gh', effect: 'play' }), click('g_num'), click('g_gas'), click('g_mech'), zoom('gh_banner')],
});
/* 5. I Do 2: the temperature graph, the other evidence, the five impacts, then the banner */
S(5, {
  groups: [
    { name: 'e_gr', members: ['gr_bg', 'gr_pic', 'gr_cap'] },
    { name: 'e_ev', members: ['ev_bg', 'ev_t'] },
    { name: 'e_im', members: ['im_h', ...range(5).flatMap((i) => [`im${i}_bg`, `im${i}_pic`, `im${i}_t`])] },
  ],
  builds: [click('e_gr'), click('e_ev'), click('e_im'), zoom('evid_banner')],
});
SP.weDoRC(6, [0, 3, 2, 1]);      // weakest (A), strongest (D), then C, then B
SP.coldCall(7);
/* 8. You Do: the three problems table, then the note */
S(8, {
  groups: [{ name: 'tb', members: [...range(3).map((i) => `tb_h${i}`), ...range(4).map((i) => `tb_l${i}`), ...range(4).flatMap((r) => range(3).flatMap((i) => [`tb_c${r}${i}_bg`, `tb_t${r}${i}`]))] }],
  builds: [click('tb'), click('yd_note')],
});
SP.mark(9, true); SP.plenary(10);
SP.write();

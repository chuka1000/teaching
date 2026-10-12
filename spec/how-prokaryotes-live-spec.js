/** Emits spec/how-prokaryotes-live.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('how-prokaryotes-live', 'How Prokaryotes Live');
const { click, zoom, beat, S, range } = SP;
SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the first three characteristics, the last two with the habitats, then the test */
S(4, {
  groups: [
    ...range(5).map((i) => ({ name: `row${i}`, members: [`r${i}_bg`, `r${i}_badge`, `r${i}_num`, `r${i}_t`] })),
    { name: 'habs', members: range(4).flatMap((i) => [`hab${i}_img`, `hab${i}_cap`]) },
  ],
  builds: [beat(['row0', 'row1', 'row2']), beat(['row3', 'row4', 'habs']), zoom('test_banner')],
});
/* 5. I Do 2: the new word, the animation (ON CLICK), the worked example, the two banners */
S(5, {
  groups: [
    { name: 'nwg', members: ['nw_bg', 'nw_h', 'nw_t'] },
    { name: 'exg', members: ['ex_bg', 'ex_h', 'ex_t'] },
  ],
  builds: [click('nwg'), click({ target: 'vid_fission', effect: 'play' }), click('exg'), zoom('ident_banner'), zoom('var_banner')],
});
SP.weDoFIO(6, 3); SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

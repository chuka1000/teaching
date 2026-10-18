/** Emits spec/what-gets-into-the-air.anim.json. Flat 150 ms. */
const SP = require('../build/atmosphere-spec-kit')('what-gets-into-the-air', 'What Gets Into The Air');
const { click, beat, zoom, S, range } = SP;

SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the first three pollutants, the last two with the photographs, the worked example, then the banner */
S(4, {
  groups: [
    { name: 'pr_a', members: range(3).flatMap((i) => [`pr${i}_bg`, `pr${i}_f`, `pr${i}_t`]) },
    { name: 'pr_b', members: [...range(2).flatMap((i) => [`pr${i + 3}_bg`, `pr${i + 3}_f`, `pr${i + 3}_t`]), ...range(4).flatMap((i) => [`ph${i}`, `ph${i}_c`])] },
    { name: 'pr_w', members: ['wk_bg', 'wk_t'] },
  ],
  builds: [click('pr_a'), click('pr_b'), click('pr_w'), zoom('nat_banner')],
});
/* 5. I Do 2: the two definitions, the animation (on click), the two smogs, then the banner */
S(5, {
  groups: [
    { name: 'df', members: ['prim_bg', 'prim_t', 'sec_bg', 'sec_t'] },
    { name: 'sm', members: ['lon_bg', 'lon_t', 'la_bg', 'la_t'] },
  ],
  builds: [click('df'), click({ target: 'vid_smog', effect: 'play' }), click('sm'), zoom('smog_banner')],
});
SP.weDoFIO(6, 3); SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

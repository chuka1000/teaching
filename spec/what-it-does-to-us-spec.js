/** Emits spec/what-it-does-to-us.anim.json. Flat 150 ms. */
const SP = require('../build/atmosphere-spec-kit')('what-it-does-to-us', 'What It Does To Us');
const { click, beat, zoom, S, range } = SP;

SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: particulates, carbon monoxide, the third card, then the banner */
S(4, {
  groups: [
    { name: 'h_pt', members: ['pt_bg', 'pt_h', 'pt_pic', 'pt_t'] },
    { name: 'h_co', members: ['co_bg', 'co_h', 'co_pic', 'co_t'] },
    { name: 'h_oz', members: ['oz_bg', 'oz_h', 'oz_t', 'oz_stat'] },
  ],
  builds: [click('h_pt'), click('h_co'), click('h_oz'), zoom('health_banner')],
});
/* 5. I Do 2: the animation (on click), what it damages, the four ways it is reduced, then the banner */
S(5, {
  groups: [
    { name: 'a_dm', members: range(3).flatMap((i) => [`dm${i}_bg`, `dm${i}_pic`, `dm${i}_t`]) },
    { name: 'a_rd', members: range(4).flatMap((i) => [`rd${i}_bg`, ...(i < 2 ? [`rd${i}_pic`] : []), `rd${i}_t`]) },
  ],
  builds: [click({ target: 'vid_acid', effect: 'play' }), click('a_dm'), click('a_rd'), zoom('acid_banner')],
});
SP.weDoRC(6, [0, 3, 1, 2]);      // weakest (A), strongest (D), then B, then C
SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

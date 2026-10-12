/** Emits spec/the-bacteria-we-need.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('the-bacteria-we-need', 'The Bacteria We Need');
const { click, zoom, beat, S, range } = SP;
SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the recycling loop (one beat), the photograph, the nitrogen chain (one beat), then the banner */
S(4, {
  groups: [
    { name: 'loop', members: range(4).flatMap((i) => [`rc${i}_bg`, `rc${i}_badge`, `rc${i}_num`, `rc${i}_t`, ...(i < 3 ? [`rc${i}_arrow`] : [])]) },
    { name: 'chain', members: range(3).flatMap((i) => [`nt${i}_bg`, `nt${i}_t`, ...(i < 2 ? [`nt${i}_arrow`] : [])]) },
  ],
  builds: [click('loop'), click('rc_photo'), click('chain'), click('nt_photo'), zoom('rec_banner')],
});
/* 5. I Do 2: the animation (ON CLICK), the food card, the gut card, then the two banners */
S(5, {
  groups: [
    { name: 'foodg', members: ['food_bg', 'food_h', 'food_p0', 'food_p1', 'food_p2', 'food_t'] },
    { name: 'gutg', members: ['gut_bg', 'gut_h', 'gut_t'] },
  ],
  builds: [click({ target: 'vid_insulin', effect: 'play' }), click('foodg'), click('gutg'), zoom('ins_banner'), zoom('help_banner')],
});
SP.weDoFIO(6, 3); SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

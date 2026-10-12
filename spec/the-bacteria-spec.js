/** Emits spec/the-bacteria.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('the-bacteria', 'The Bacteria');
const { click, zoom, S, range } = SP;
SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the three shapes, one per click, then the banner */
S(4, {
  groups: range(3).map((i) => ({ name: `shape${i}`, members: [`sh${i}_bg`, `sh${i}_photo`, `sh${i}_draw`, `sh${i}_word`, `sh${i}_pl`, `sh${i}_mean`] })),
  builds: [...range(3).map((i) => click(`shape${i}`)), zoom('shape_banner')],
});
/* 5. I Do 2: the four groups, one per click, then the banner */
S(5, {
  groups: range(4).map((i) => ({ name: `grp${i}`, members: [`g${i}_bg`, `g${i}_photo`, `g${i}_t`, ...(i > 0 ? [`g${i}_later`] : [])] })),
  builds: [...range(4).map((i) => click(`grp${i}`)), zoom('grp_banner')],
});
SP.weDoSTM(6, 4); SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

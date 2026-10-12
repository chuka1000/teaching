/** Emits spec/archaea-and-extreme-places.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('archaea-and-extreme-places', 'Archaea And Extreme Places');
const { click, zoom, beat, S, range } = SP;
SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the three domains (one beat), the same, the different, then the banner */
S(4, {
  groups: [
    ...range(3).map((i) => ({ name: `dom${i}`, members: [`d${i}_bg`, `d${i}_img`, `d${i}_name`, `d${i}_t`] })),
    { name: 'sameg', members: ['same_bg', 'same_h', 'same_t'] },
    { name: 'diffg', members: ['diff_bg', 'diff_h', 'diff_t'] },
  ],
  builds: [beat(['dom0', 'dom1', 'dom2']), click('sameg'), click('diffg'), zoom('dom_banner')],
});
/* 5. I Do 2: the three habitats, one per click, then the banner */
S(5, {
  groups: range(3).map((i) => ({ name: `hab${i}`, members: [`hb${i}_bg`, `hb${i}_photo`, `hb${i}_word`, `hb${i}_mean`, `hb${i}_where`] })),
  builds: [...range(3).map((i) => click(`hab${i}`)), zoom('hab_banner')],
});
SP.weDoRC(6, [0, 3, 2, 1]); SP.coldCall(7); SP.youDo(8); SP.mark(9, true); SP.plenary(10);
SP.write();

/** Emits spec/pathogens-and-antibiotics.anim.json. Flat 150 ms. */
const SP = require('../build/prokaryotes-spec-kit')('pathogens-and-antibiotics', 'Pathogens And Antibiotics');
const { click, zoom, beat, S, range } = SP;
SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the pathogen card, the antibiotic card, the bacteria chip, the viruses chip, then the banner */
S(4, {
  groups: [
    { name: 'pathg', members: ['path_bg', 'path_h', 'path_t'] },
    { name: 'antig', members: ['anti_bg', 'anti_h', 'anti_t'] },
  ],
  builds: [click('pathg'), click('antig'), zoom('yes_chip'), zoom('no_chip'), zoom('most_banner')],
});
/* 5. I Do 2: the animation (ON CLICK), the four steps one at a time, the two banners */
S(5, {
  groups: [
    { name: 'stepsg', members: ['steps_bg', 'steps_h'] },
    ...range(4).map((i) => ({ name: `st${i}g`, members: [`st${i}_badge`, `st${i}_num`, `st${i}_t`] })),
  ],
  builds: [click({ target: 'vid_resist', effect: 'play' }), click('stepsg', 'st0g'), click('st1g'), click('st2g'), click('st3g'), zoom('pop_banner'), zoom('adv_banner')],
});
SP.weDoRC(6, [0, 3, 2, 1]); SP.coldCall(7); SP.youDo(8); SP.mark(9, true); SP.plenary(10);
SP.write();

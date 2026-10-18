/** Emits spec/the-ozone-layer.anim.json. Flat 150 ms. */
const SP = require('../build/atmosphere-spec-kit')('the-ozone-layer', 'The Ozone Layer');
const { click, beat, zoom, S, range } = SP;

SP.doNow(1); SP.today(2); SP.hook(3);
/* 4. I Do 1: the diagram, the one-line job, the four effects, the thinning, then the banner */
S(4, {
  groups: [
    { name: 'o_ly', members: ['ly_bg', 'ly_pic'] },
    { name: 'o_uv', members: ['uv_bg', 'uv_t'] },
    { name: 'o_ef', members: ['wo_h', ...range(4).flatMap((i) => [`ef${i}_bg`, `ef${i}_t`])] },
    { name: 'o_thin', members: ['thin_bg', 'thin_t'] },
  ],
  builds: [click('o_ly'), click('o_uv'), click('o_ef'), click('o_thin'), zoom('oz_banner')],
});
/* 5. I Do 2: the CFC film (on click), the "how" card, the timeline, the data film (the CFC film fades out), the "why it worked" card, then the banner */
S(5, {
  groups: [
    { name: 'c_how', members: ['how_bg', 'how_t'] },
    { name: 'c_tl', members: range(4).flatMap((i) => [`tl${i}_bg`, `tl${i}_y`, `tl${i}_t`]) },
    { name: 'c_why', members: ['why_bg', 'why_t'] },
  ],
  builds: [click({ target: 'vid_cfc', effect: 'play' }), click('c_how'), beat(['c_tl']), click({ target: 'vid_cfc', effect: 'exit' }, { target: 'vid_hole', effect: 'play' }), click('c_why'), zoom('rec_banner')],
});
SP.weDoSTM(6, 4); SP.coldCall(7); SP.youDo(8); SP.mark(9, false); SP.plenary(10);
SP.write();

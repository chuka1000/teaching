/** Emits spec/does-it-light-up.anim.json. Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Title */
S(1);

/* 2. Today */
{
  const imgs = [['o0_img0'], ['o1_img0'], ['o2_img0']];
  const groups = imgs.map((im, i) => ({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_num`, ...im, `o${i}_t`] }));
  S(2, { groups, builds: groups.map((g) => click(g.name)) });
}

/* 3. Remember: two words per click */
S(3, { builds: [0, 2, 4, 6, 8].map((i) => beat([{ target: `rm${i}_word`, effect: 'zoom' }, { target: `rm${i + 1}_word`, effect: 'zoom' }])) });

/* 4, 5. New words: the first word, the second, both leave, then the sentence */
for (const n of [4, 5]) {
  const groups = [0, 1].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  S(n, { groups, builds: [click('wr0'), click('wr1'), beat([{ target: 'wr0', effect: 'exit' }, { target: 'wr1', effect: 'exit' }]), click({ target: 'w_banner', effect: 'zoom' })] });
}

/* 6. The film plays on click, then the copper card, then the sulfur card */
{
  const groups = [0, 1].map((i) => ({ name: `fmg${i}`, members: [`fm${i}_bg`, `fm${i}_img`, `fm${i}_t`, `fm${i}_chip`] }));
  S(6, { groups, builds: [click({ target: 'circuit_video', effect: 'play' }), click('fmg0'), click('fmg1')] });
}

/* 7. Predict: nothing to click, the answers come from the test */
S(7);

/* 8. How to test: one step per click, then the safety line */
{
  const groups = [0, 1, 2, 3].map((i) => ({ name: `hsg${i}`, members: [`hs${i}_bg`, `hs${i}_n`, `hs${i}_img`, `hs${i}_t`] }));
  S(8, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'frame_banner', effect: 'zoom' })] });
}

/* 9. The test: the answers, one sample per click, at the end */
S(9, { builds: [0, 1, 2, 3, 4].map((i) => click({ target: `ts${i}_chip`, effect: 'zoom' })) });

/* 10. What did we find */
{
  const groups = [
    { name: 'rsOn', members: ['rs_p0', 'rs_n0', 'rs_p1', 'rs_n1', 'rs_p2', 'rs_n2'] },
    { name: 'rsOff', members: ['rs_p3', 'rs_n3'] },
    { name: 'spg', members: ['sp_bg', 'sp_img', 'sp_t'] },
  ];
  S(10, { groups, builds: [click('rsOn'), click('rsOff'), click('spg'), click({ target: 'res_banner', effect: 'zoom' })] });
}

/* 11. You do */
{
  const imgs = [['t0_img0'], ['t1_img0', 't1_img1'], ['t2_img0', 't2_img1']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(11, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 12. Say it together */
{
  const groups = [0, 1, 2, 3, 4].map((i) => ({ name: `tgg${i}`, members: [`tg${i}_chip`, `tg${i}_tick`] }));
  S(12, { groups, transition: { type: 'push', dir: 'up', speed: 'med' }, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) });
}

fs.writeFileSync(path.join(__dirname, 'does-it-light-up.anim.json'), JSON.stringify({
  deck: 'out/Does It Light Up/Does It Light Up.pptx',
  output: 'out/Does It Light Up/Does It Light Up.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

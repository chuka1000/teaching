/** Emits spec/metal-or-non-metal.anim.json. Flat 150 ms between staggered steps. */
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
  const imgs = [['o0_img0', 'o0_img1'], ['o1_img0'], ['o2_img0']];
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

/* 6. Look and say: the sentence for each sample */
S(6, { builds: [0, 1, 2, 3].map((i) => click(`ls${i}_t`)) });

/* 7. The table: the four boxes light up, their answers, the sentence */
{
  const groups = [0, 1, 2, 3].map((i) => ({ name: `krg${i}`, members: [`kr${i}_bg`, `kr${i}_tile`, `kr${i}_chip`] }));
  S(7, { groups, builds: [click('pt_four'), beat(groups.map((g) => g.name)), click({ target: 'table_banner', effect: 'zoom' })] });
}

/* 8. Yes or no */
S(8, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `yn${i}_chip`, effect: 'zoom' })) });

/* 9. Metal or non-metal? */
S(9, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `eo${i}_chip`, effect: 'zoom' })) });

/* 10. Look. Say. */
S(10, { builds: [0, 1, 2, 3].map((i) => click(`op${i}_a`)) });

/* 11. You do */
{
  const imgs = [['t0_img0', 't0_img1'], ['t1_img0'], ['t2_img0']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(11, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 12. Say it together */
S(12, { transition: { type: 'push', dir: 'up', speed: 'med' }, builds: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => click({ target: `tg${i}_chip`, effect: 'zoom' })) });

fs.writeFileSync(path.join(__dirname, 'metal-or-non-metal.anim.json'), JSON.stringify({
  deck: 'out/Metal Or Non-Metal/Metal Or Non-Metal.pptx',
  output: 'out/Metal Or Non-Metal/Metal Or Non-Metal.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

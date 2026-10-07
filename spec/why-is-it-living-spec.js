/** Emits spec/why-is-it-living.anim.json (the Tuesday double, one deck). Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const ANS = require('../build/why-is-it-living-answers');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const goalGroups = (imgs, prefix = 'o') => imgs.map((im, i) => ({ name: `${prefix}${i}`, members: [`${prefix}${i}_bg`, `${prefix}${i}_num`, ...im, `${prefix}${i}_t`] }));

/* ---- first half ---- */
S(1);
{ const groups = goalGroups([['o0_img0', 'o0_img1'], ['o1_img0'], ['o2_img0']]); S(2, { groups, builds: groups.map((g) => click(g.name)) }); }
S(3, { builds: [0, 2, 4, 6, 8].map((i) => beat([{ target: `rm${i}_word`, effect: 'zoom' }, { target: `rm${i + 1}_word`, effect: 'zoom' }])) });
{
  const groups = [0, 1].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  S(4, { groups, builds: [click('wr0'), click('wr1'), beat([{ target: 'wr0', effect: 'exit' }, { target: 'wr1', effect: 'exit' }])] });
}
S(5, { builds: ANS.MODEL.flatMap((_, r) => [0, 1, 2, 3].map((j) => click({ target: `md${r}_c${j}`, effect: j === 2 ? 'zoom' : 'fade' }))) });
S(6, { builds: ANS.RIGHT.map((_, i) => click({ target: `rw${i}_chip`, effect: 'zoom' })) });
S(7, { builds: [0, 2, 4, 6].map((i) => beat([{ target: `eo${i}_chip`, effect: 'zoom' }, { target: `eo${i + 1}_chip`, effect: 'zoom' }])) });
{ const groups = ANS.OPEN.map((_, i) => ({ name: `opr${i}`, members: [`op${i}_r0`, `op${i}_r1`] })); S(8, { groups, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) }); }
{
  const imgs = [['t0_img0'], ['t1_img0', 't1_img1'], ['t2_img0']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(9, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}
{
  const groups = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ name: `ta${i}`, members: [`tl${i}_chip`, `tl${i}_tick`] }));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds: [0, 2, 4, 6].map((i) => beat([`ta${i}`, `ta${i + 1}`])) });
}

/* ---- break: nothing to click ---- */
S(11, { transition: { type: 'push', dir: 'up', speed: 'med' } });

/* ---- second half ---- */
S(12);
{
  const groups = [0, 1, 2, 3, 4].map((i) => ({ name: `hs${i}`, members: [`hs${i}_bg`, `hs${i}_n`, `hs${i}_img`, `hs${i}_t`] }));
  S(13, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'frame_banner', effect: 'zoom' })] });
}
S(14);
S(15);
{
  const groups = [0, 1, 2].map((i) => ({ name: `ll${i}`, members: [`ll${i}_bg`, `ll${i}_img`, `ll${i}_t`] }));
  S(16, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'frame_banner', effect: 'zoom' })] });
}
{
  const groups = [{ name: 'pr3a', members: [0, 1, 2, 3].map((j) => `pr3_c${j}`) }];
  S(17, { groups, builds: [click({ target: 'pr0_a', effect: 'zoom' }), click({ target: 'pr1_a', effect: 'zoom' }), click({ target: 'pr2_a', effect: 'zoom' }), click({ target: 'pr3a', effect: 'zoom' })] });
}
{
  const groups = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ name: `tza${i}`, members: [`tz${i}_chip`, `tz${i}_tick`] }));
  S(18, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds: [0, 2, 4, 6].map((i) => beat([`tza${i}`, `tza${i + 1}`])) });
}

fs.writeFileSync(path.join(__dirname, 'why-is-it-living.anim.json'), JSON.stringify({
  deck: 'out/Why Is It Living/Why Is It Living.pptx',
  output: 'out/Why Is It Living/Why Is It Living.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

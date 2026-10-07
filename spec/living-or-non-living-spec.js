/** Emits spec/living-or-non-living.anim.json. Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Title: nothing to click */
S(1);

/* 2. Today: one goal per click */
{
  const imgs = [['o0_img0'], ['o1_img0', 'o1_img1'], ['o2_img0']];
  const groups = imgs.map((im, i) => ({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_num`, ...im, `o${i}_t`] }));
  S(2, { groups, builds: groups.map((g) => click(g.name)) });
}

/* 3 and 4. New words: the pictures are there; each word arrives on a click; then both words leave (say it off the picture) */
const wordReveal = (banner) => {
  const groups = [0, 1].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  const builds = [click('wr0'), click('wr1'), beat([{ target: 'wr0', effect: 'exit' }, { target: 'wr1', effect: 'exit' }])];
  if (banner) builds.push(click({ target: 'w_banner', effect: 'zoom' }));
  return { groups, builds };
};
S(3, wordReveal(false));
S(4, wordReveal(true));

/* 5. Sort them: each picture lands in its box */
{
  const ORDER = ['dog', 'rock', 'tree', 'chair', 'bird', 'ball', 'flower'];
  const groups = ORDER.map((k) => ({ name: `it_${k}`, members: [`it_${k}_img`, `it_${k}_t`] }));
  S(5, { groups, builds: ORDER.map((k) => click({ target: `it_${k}`, effect: 'zoom' })) });
}

/* 6. Yes or no: one answer per click */
{
  const groups = [0, 1, 2, 3, 4, 5].map((i) => ({ name: `ysa${i}`, members: [`ys${i}_yn`, `ys${i}_chip`] }));
  S(6, { groups, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) });
}

/* 7. Either/or, in pairs: two answers per click */
S(7, { builds: [0, 2, 4, 6].map((i) => beat([{ target: `eo${i}_chip`, effect: 'zoom' }, { target: `eo${i + 1}_chip`, effect: 'zoom' }])) });

/* 8. What can you see? Green rings round the living things, then grey rings round the non-living */
{
  const living = ['tree', 'bird', 'butterfly', 'walker', 'dog', 'flower'];
  const non = ['sun', 'cloud', 'kite', 'ball', 'rock', 'bicycle'];
  S(8, { builds: [beat(living.map((k) => `ring_${k}`)), beat(non.map((k) => `ring_${k}`))] });
}

/* 9. You do: A, B, C, then the banner */
{
  const imgs = [['t0_img0'], ['t1_img0', 't1_img1'], ['t2_img0']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(9, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 10. Say it together: two answers per click, each with its tick */
{
  const groups = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ name: `ta${i}`, members: [`tl${i}_chip`, `tl${i}_tick`] }));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds: [0, 2, 4, 6].map((i) => beat([`ta${i}`, `ta${i + 1}`])) });
}

fs.writeFileSync(path.join(__dirname, 'living-or-non-living.anim.json'), JSON.stringify({
  deck: 'out/Living Or Non-Living/Living Or Non-Living.pptx',
  output: 'out/Living Or Non-Living/Living Or Non-Living.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

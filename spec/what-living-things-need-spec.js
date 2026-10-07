/** Emits spec/what-living-things-need.anim.json. Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const ANS = require('../build/what-living-things-need-answers');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Title */
S(1);

/* 2. Today: one goal per click */
{
  const imgs = [['o0_img0', 'o0_img1'], ['o1_img0', 'o1_img1'], ['o2_img0']];
  const groups = imgs.map((im, i) => ({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_num`, ...im, `o${i}_t`] }));
  S(2, { groups, builds: groups.map((g) => click(g.name)) });
}

/* 3. Remember: the pictures are there, each word arrives on a click */
{
  S(3, { builds: [0, 1, 2, 3].map((i) => click({ target: `rm${i}_word`, effect: 'zoom' })) });
}

/* 4. Sort again: two answers per click */
S(4, { builds: [0, 2, 4, 6].map((i) => beat([{ target: `sa${i}_chip`, effect: 'zoom' }, { target: `sa${i + 1}_chip`, effect: 'zoom' }])) });

/* 5. New words: food, water, air, then all three leave */
{
  const groups = [0, 1, 2].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  S(5, { groups, builds: [click('wr0'), click('wr1'), click('wr2'), beat(['wr0', 'wr1', 'wr2'].map((t) => ({ target: t, effect: 'exit' })))] });
}

/* 6. The model sentences */
S(6, { builds: [0, 1, 2].map((i) => click({ target: `md${i}_t`, effect: 'zoom' })) });

/* 7. Yes or no */
S(7, { builds: ANS.YES_NO.map((_, i) => click({ target: `yn${i}_chip`, effect: 'zoom' })) });

/* 8. Either/or: the green box lands on the need */
S(8, { builds: ANS.EITHER.map((_, i) => click({ target: `eo${i}_ring`, effect: 'zoom' })) });

/* 9. Open: what do they need? */
{
  const groups = ANS.OPEN.map((k, i) => ({ name: `opa${i}`, members: ANS.kind(k) === 'living' ? [`op${i}_n0`, `op${i}_n1`, `op${i}_n2`] : [`op${i}_n0`] }));
  S(9, { groups, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) });
}

/* 10. You do: A, B, C, then the banner */
{
  const imgs = [['t0_img0'], ['t1_img0', 't1_img1'], ['t2_img0']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(10, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 11. Say it together: two answers per click, each with its tick */
{
  const groups = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ name: `ta${i}`, members: [`tl${i}_chip`, `tl${i}_tick`] }));
  S(11, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds: [0, 2, 4, 6].map((i) => beat([`ta${i}`, `ta${i + 1}`])) });
}

fs.writeFileSync(path.join(__dirname, 'what-living-things-need.anim.json'), JSON.stringify({
  deck: 'out/What Living Things Need/What Living Things Need.pptx',
  output: 'out/What Living Things Need/What Living Things Need.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

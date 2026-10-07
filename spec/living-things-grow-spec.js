/** Emits spec/living-things-grow.anim.json. Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const ANS = require('../build/living-things-grow-answers');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Title */
S(1);

/* 2. Today */
{
  const imgs = [['o0_img0'], ['o1_img0', 'o1_img1'], ['o2_img0']];
  const groups = imgs.map((im, i) => ({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_num`, ...im, `o${i}_t`] }));
  S(2, { groups, builds: groups.map((g) => click(g.name)) });
}

/* 3. Remember: two words per click */
S(3, { builds: [0, 2, 4, 6].map((i) => beat([{ target: `rm${i}_word`, effect: 'zoom' }, { target: `rm${i + 1}_word`, effect: 'zoom' }])) });

/* 4. New words: grow, change, both leave, then the sentence */
{
  const groups = [0, 1].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  S(4, { groups, builds: [click('wr0'), click('wr1'), beat([{ target: 'wr0', effect: 'exit' }, { target: 'wr1', effect: 'exit' }]), click({ target: 'w_banner', effect: 'zoom' })] });
}

/* 5. The film plays on click, then the sentence */
S(5, { builds: [click({ target: 'grow_video', effect: 'play' }), click({ target: 'grow_banner', effect: 'zoom' })] });

/* 6. First... then...: each picture on a click, the sentence with the last */
{
  const groups = [], builds = [];
  ANS.MODEL.forEach((m, r) => {
    builds.push(click({ target: `sq${r}_p0`, effect: 'zoom' }));
    for (let j = 1; j < m.seq.length; j++) {
      const members = [`sq${r}_a${j}`, `sq${r}_p${j}`];
      if (j === m.seq.length - 1) members.push(`sq${r}_t`);
      groups.push({ name: `sq${r}_g${j}`, members });
      builds.push(click({ target: `sq${r}_g${j}`, effect: 'fade' }));
    }
  });
  S(6, { groups, builds });
}

/* 7. Yes or no */
{
  const groups = ANS.YES_NO.map((_, i) => ({ name: `yna${i}`, members: [`yn${i}_chip`, `yn${i}_k`] }));
  S(7, { groups, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) });
}

/* 8. Which is first? The 1 and 2 badges land on each pair */
{
  const groups = ANS.ORDER.map((_, i) => ({ name: `foa${i}`, members: [`fo${i}_b0`, `fo${i}_b1`] }));
  S(8, { groups, builds: groups.map((g) => click({ target: g.name, effect: 'zoom' })) });
}

/* 9. Stand up or sit still: two answers per click */
S(9, { builds: [0, 2, 4, 6, 8].map((i) => beat([{ target: `st${i}_chip`, effect: 'zoom' }, { target: `st${i + 1}_chip`, effect: 'zoom' }])) });

/* 10. You do */
{
  const imgs = [['t0_img0', 't0_img1'], ['t1_img0', 't1_img1'], ['t2_img0', 't2_img1']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(10, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 11. Say it together: each sentence on a click */
S(11, { transition: { type: 'push', dir: 'up', speed: 'med' }, builds: [0, 1, 2, 3].map((i) => click({ target: `tg${i}_t`, effect: 'zoom' })) });

fs.writeFileSync(path.join(__dirname, 'living-things-grow.anim.json'), JSON.stringify({
  deck: 'out/Living Things Grow/Living Things Grow.pptx',
  output: 'out/Living Things Grow/Living Things Grow.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

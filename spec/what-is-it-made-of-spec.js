/** Emits spec/what-is-it-made-of.anim.json. Flat 150 ms between staggered steps. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

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

/* 4. New words: sort, full, both leave, then the sentence */
{
  const groups = [0, 1].map((i) => ({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] }));
  S(4, { groups, builds: [click('wr0'), click('wr1'), beat([{ target: 'wr0', effect: 'exit' }, { target: 'wr1', effect: 'exit' }]), click({ target: 'w_banner', effect: 'zoom' })] });
}

/* 5. Look and say: the sentence for each object */
S(5, { builds: range(6).map((i) => click(`lk${i}_t`)) });

/* 6. Yes or no */
S(6, { builds: range(6).map((i) => click({ target: `yn${i}_chip`, effect: 'zoom' })) });

/* 7. Iron, gold, copper or gas? */
S(7, { builds: range(6).map((i) => click({ target: `eo${i}_chip`, effect: 'zoom' })) });

/* 8. Open: what is it made of? */
S(8, { builds: range(4).map((i) => click(`op${i}_a`)) });

/* 9. Sort: each box fills on its click */
{
  const groups = range(3).map((i) => ({ name: `sbg${i}`, members: [`sb${i}_p0`, `sb${i}_n0`, `sb${i}_p1`, `sb${i}_n1`] }));
  S(9, { groups, builds: groups.map((g) => click(g.name)) });
}

/* 10. You do */
{
  const imgs = [['t0_img0', 't0_img1'], ['t1_img0', 't1_img1'], ['t2_img0']];
  const groups = imgs.map((im, i) => ({ name: `t${i}`, members: [`t${i}_bg`, ...im, `t${i}_k`, `t${i}_h`, `t${i}_b`] }));
  S(10, { groups, builds: [...groups.map((g) => click(g.name)), click({ target: 'yd_banner', effect: 'zoom' })] });
}

/* 11. Say it together, before the break */
S(11, { builds: range(6).map((i) => click({ target: `tg${i}_chip`, effect: 'zoom' })) });

/* 12. Break: nothing to click */
S(12);

/* 13. Part 2 */
S(13);

/* 14. Goal 12: the three cards, then the goal */
{
  const groups = [
    { name: 'glg0', members: ['gl0_bg', 'gl0_img', 'gl0_t'] },
    { name: 'glg1', members: ['gl1_bg', 'gl1_img', 'gl1_t'] },
    { name: 'glg2', members: ['gl2_bg', 'gl2_img', 'gl2_word', 'gl2_say'] },
  ];
  S(14, { groups, builds: [click('glg0'), click('glg1'), click('glg2'), click({ target: 'frame_banner', effect: 'zoom' })] });
}

/* 15. The game: nothing to click, the timer is the instruction */
S(15);

/* 16. The check: nothing to click */
S(16);

/* 17. Say it together: the sentence for each picture */
S(17, { transition: { type: 'push', dir: 'up', speed: 'med' }, builds: range(8).map((i) => click(`tz${i}_t`)) });

fs.writeFileSync(path.join(__dirname, 'what-is-it-made-of.anim.json'), JSON.stringify({
  deck: 'out/What Is It Made Of/What Is It Made Of.pptx',
  output: 'out/What Is It Made Of/What Is It Made Of.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

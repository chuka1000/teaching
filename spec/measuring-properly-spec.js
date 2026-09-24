/** Emits spec/measuring-properly.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Today */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: three cylinders together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_icon`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: five rows, then banner */
{
  const groups = range(5).map((i) => ({ name: `r${i}`, members: [`r${i}_bg`, `r${i}_icon`, `r${i}_w`, `r${i}_i`, `r${i}_u`, `r${i}_t`] }));
  S(4, { groups, builds: [...range(5).map((i) => click(`r${i}`)), click({ target: 'ins_banner', effect: 'zoom' })] });
}

/* 5. I Do 2: definition, two students, three ways */
{
  const groups = [
    { name: 'acc', members: ['acc_bg', 'acc_h', 'acc_t'] },
    { name: 'tv', members: ['tv_t'] },
    ...range(2).map((i) => ({ name: `st${i}`, members: [`st${i}_bg`, `st${i}_h`, `st${i}_c0`, `st${i}_c1`, `st${i}_c2`, `st${i}_v`] })),
    { name: 'how', members: ['how_bg', 'how_h', 'how_c0', 'how_c1', 'how_c2'] },
  ];
  S(5, { groups, builds: [click('acc'), beat(['tv', 'st0', 'st1']), click('how')] });
}

/* 6. I Do 3: two rules, landmarks, banner */
{
  const groups = [
    ...range(2).map((i) => ({ name: `cv${i}`, members: [`cv${i}_bg`, `cv${i}_h`, `cv${i}_r`, `cv${i}_e`] })),
    { name: 'lm', members: ['lm_h', ...range(4).flatMap((i) => [`lm${i}_bg`, `lm${i}_w`, `lm${i}_c`, `lm${i}_k`])] },
  ];
  S(6, { groups, builds: [beat(['cv0', 'cv1']), click('lm'), click({ target: 'k_banner', effect: 'zoom' })] });
}

/* 7. We Do */
S(7, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 8. Practical: five stations together, rotation line, reading rule */
{
  const groups = range(5).map((i) => ({ name: `stn${i}`, members: [`stn${i}_bg`, `stn${i}_badge`, `stn${i}_num`, `stn${i}_icon`, `stn${i}_h`, `stn${i}_t`] }));
  S(8, {
    groups,
    builds: [beat(range(5).map((i) => `stn${i}`)), click({ target: 'rot_banner', effect: 'zoom' }), click({ target: 'rule_banner', effect: 'zoom' })],
  });
}

/* 9. You Do */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] });
    builds.push(click(`t${i}`));
  }
  builds.push(click('yd_note'));
  S(9, { groups, builds });
}

/* 10. Answers */
{
  const groups = [], builds = [];
  for (let i = 0; i < 10; i++) groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_t`] });
  for (let i = 0; i < 10; i += 2) builds.push(beat([`a${i}`, `a${i + 1}`]));
  S(10, { groups, builds });
}

/* 11. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) {
    groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] });
    builds.push(click(`p${i}_stmt`));
    builds.push(click({ target: `p${i}_v`, effect: 'zoom' }));
  }
  builds.push(click('pl_next'));
  S(11, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'measuring-properly.anim.json'), JSON.stringify({
  deck: 'out/Measuring Properly/Measuring Properly.pptx',
  output: 'out/Measuring Properly/Measuring Properly.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

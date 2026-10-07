/** Emits spec/the-greatest-show-on-earth.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] }); builds.push(click(`o${i}`)); }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}
/* 4. I Do 1: the three definitions, the worked example, the banner */
{
  const groups = [
    ...range(3).map((i) => ({ name: `dfg${i}`, members: [`df${i}_bg`, `df${i}_h`, `df${i}_t`] })),
    { name: 'exg', members: ['ex_bg', 'ex_h', 'ex_horse', 'ex_donkey', 'ex_mule', 'ex_t'] },
    { name: 'bng', members: ['bn'] },
  ];
  S(4, { groups, builds: [click('dfg0'), click('dfg1'), click('dfg2'), click('exg'), click({ target: 'bn', effect: 'zoom' })] });
}
/* 5. I Do 2: the animation (ON CLICK), the steps, why they cannot interbreed, the bigger picture */
{
  const groups = [
    { name: 'stg', members: ['st_bg', 'st_h', 'st_t'] },
    { name: 'wyg', members: ['wy_bg', 'wy_h', 'wy_t'] },
    { name: 'bpg', members: ['bp_bg', 'bp_t'] },
  ];
  S(5, { groups, builds: [click({ target: 'vid_fin', effect: 'play' }), click('stg'), click('wyg'), click('bpg')] });
}
S(6, { builds: range(3).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}
{
  const groups = [{ name: 'mkg', members: ['mk_game_bg', 'mk_game_t'] }, { name: 'mkc', members: ['mk_card_bg', 'mk_card_h', 'mk_card_t'] }];
  S(9, { groups, builds: [click('mkg'), click('mkc')] });
}
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}
fs.writeFileSync(path.join(__dirname, '..', 'spec', 'the-greatest-show-on-earth.anim.json'), JSON.stringify({
  deck: 'out/The Greatest Show On Earth/The Greatest Show On Earth.pptx', output: 'out/The Greatest Show On Earth/The Greatest Show On Earth.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

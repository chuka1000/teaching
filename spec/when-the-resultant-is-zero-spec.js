/** Emits spec/when-the-resultant-is-zero.anim.json. Flat 150 ms. */
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
/* 4. I Do 1: the animation (ON CLICK), the law, the other way round, the worked example */
{
  const groups = [
    { name: 'fbg', members: ['fb_bg', 'fb_h', 'fb_t'] },
    { name: 'rsg', members: ['rs_bg', 'rs_h', 'rs_t'] },
    { name: 'wxg', members: ['wx_bg', 'wx_t'] },
  ];
  S(4, { groups, builds: [click({ target: 'vid_motion', effect: 'play' }), click('fbg'), click('rsg'), click('wxg')] });
}
/* 5. I Do 2: the left card (rows together), the probe animation (ON CLICK), the right card, the banner */
{
  const groups = [
    ...range(3).map((i) => ({ name: `lr${i}g`, members: [`lr${i}_bg`, `lr${i}_icon`, `lr${i}_h`, `lr${i}_t`] })),
    { name: 'lfg', members: ['lf_bg', 'lf_t'] },
    { name: 'rcg', members: ['rc_bg', 'rc_t'] },
    { name: 'bng', members: ['bn'] },
  ];
  S(5, { groups, builds: [beat(['lr0g', 'lr1g', 'lr2g', 'lfg']), click({ target: 'vid_probe', effect: 'play' }), click('rcg'), click({ target: 'bn', effect: 'zoom' })] });
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
fs.writeFileSync(path.join(__dirname, '..', 'spec', 'when-the-resultant-is-zero.anim.json'), JSON.stringify({
  deck: 'out/When The Resultant Is Zero/When The Resultant Is Zero.pptx', output: 'out/When The Resultant Is Zero/When The Resultant Is Zero.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

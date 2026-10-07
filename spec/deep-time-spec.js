/** Emits spec/deep-time.anim.json. Flat 150 ms. */
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
/* 4. I Do 1: the new words, the animation (ON CLICK), the worked example, the banner */
{
  const groups = [
    { name: 'nwg', members: ['nw_bg', 'nw_h', 'nw_t'] },
    { name: 'exg', members: ['ex_bg', 'ex_h', 'ex_fern', 'ex_t'] },
  ];
  S(4, { groups, builds: [click('nwg'), click({ target: 'vid_eras', effect: 'play' }), click('exg'), click({ target: 'big_back', effect: 'zoom' })] });
}
/* 5. I Do 2: the definition, the chart, the worked example, the banner */
{
  const chart = ['ch_bg', 'ch_h', ...range(3).flatMap((i) => [`ch_band${i}`, `ch_era${i}`]), 'ch_axis', ...range(5).flatMap((i) => [`ch_bar${i}`, `ch_pct${i}`, `ch_t${i}`]), 'ch_ast', 'ch_unit'];
  const groups = [
    { name: 'dfg', members: ['df_bg', 'df_h', 'df_t'] },
    { name: 'chg', members: chart },
    { name: 'exg', members: ['ex_bg', 'ex_h', 'ex_t'] },
  ];
  S(5, { groups, builds: [click('dfg'), click('chg'), click('exg'), click({ target: 'gap_banner', effect: 'zoom' })] });
}
/* 6. We Do: each click reveals the verdict and the correction for one row */
{
  const groups = range(4).map((i) => ({ name: `wdr${i}`, members: [`wd${i}_v`, `wd${i}_a`] }));
  S(6, { groups, builds: range(4).map((i) => click({ target: `wdr${i}`, effect: 'zoom' })) });
}
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
fs.writeFileSync(path.join(__dirname, '..', 'spec', 'deep-time.anim.json'), JSON.stringify({
  deck: 'out/Deep Time/Deep Time.pptx', output: 'out/Deep Time/Deep Time.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

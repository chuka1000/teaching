/** Emits spec/resultant-forces.anim.json. Flat 150 ms. */
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
/* 4. I Do 1: the contact forces, the non-contact forces, then the line */
{
  const cg = (k) => ({ name: `${k}g`, members: [`${k}_bg`, `${k}_icon`, `${k}_h`, `${k}_t`] });
  const groups = [...range(6).map((i) => cg(`c${i}`)), ...range(3).map((i) => cg(`n${i}`)), { name: 'chg', members: ['ch_bg', 'ch_t'] }, { name: 'nhg', members: ['nh_bg', 'nh_t'] }, { name: 'bng', members: ['bn_bg', 'bn_t'] }];
  S(4, { groups, builds: [beat(['chg', ...range(6).map((i) => `c${i}g`)]), beat(['nhg', ...range(3).map((i) => `n${i}g`)]), click('bng')] });
}
/* 5. I Do 2: the animation (ON CLICK), the free-body diagram rules, the resultant rules, the worked example */
{
  const groups = [
    { name: 'fbg', members: ['fb_bg', 'fb_h', 'fb_t'] },
    { name: 'rsg', members: ['rs_bg', 'rs_h', 'rs_t'] },
    { name: 'wxg', members: ['wx_bg', 'wx_t'] },
  ];
  S(5, { groups, builds: [click({ target: 'vid_fbd', effect: 'play' }), click('fbg'), click('rsg'), click('wxg')] });
}
S(6, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });
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
fs.writeFileSync(path.join(__dirname, '..', 'spec', 'resultant-forces.anim.json'), JSON.stringify({
  deck: 'out/Resultant Forces/Resultant Forces.pptx', output: 'out/Resultant Forces/Resultant Forces.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

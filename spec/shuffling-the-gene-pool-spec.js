/** Emits spec/shuffling-the-gene-pool.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Objectives */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] }); builds.push(click(`o${i}`)); }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: the four forces one at a time, then the worked example */
{
  const groups = [
    { name: 'mutg', members: ['mut_bg', 'mut_icon', 'mut_h', 'mut_t'] },
    { name: 'gfg', members: ['gf_bg', 'gf_icon', 'gf_h', 'gf_t'] },
    { name: 'nsg', members: ['ns_bg', 'ns_icon', 'ns_h', 'ns_t', 'ns_tag'] },
    { name: 'gdg', members: ['gd_bg', 'gd_icon', 'gd_h', 'gd_t', 'gd_tag'] },
    { name: 'exg', members: ['ex_bg', 'ex_t'] },
  ];
  S(4, { groups, builds: [click('mutg'), click('gfg'), click('nsg'), click('gdg'), click('exg')] });
}

/* 5. I Do 2: natural selection, drift, the storm, the animation (ON CLICK), the seals, the banner */
{
  const groups = [
    { name: 'cnsg', members: ['cns_bg', 'cns_h', 'cns_t', 'cns_tag'] },
    { name: 'cgdg', members: ['cgd_bg', 'cgd_h', 'cgd_t', 'cgd_tag'] },
    { name: 'wxg', members: ['wx_bg', 'wx_h', 'wx_t'] },
    { name: 'slg', members: ['sl_bg', 'sl_icon', 'sl_t'] },
  ];
  S(5, { groups, builds: [click('cnsg'), click('cgdg'), click('wxg'), click({ target: 'vid_drift', effect: 'play' }), click('slg'), click({ target: 'dr_banner', effect: 'zoom' })] });
}

/* 6. We Do: the small population, the big population, the question, what to expect */
{
  const groups = [
    { name: 'smg', members: ['sm_bg', 'sm_h', 'sm_t'] },
    { name: 'bgg', members: ['bg_bg', 'bg_h', 'bg_t'] },
    { name: 'pag', members: ['pa_bg', 'pa_t'] },
    { name: 'exg', members: ['ex_bg', 'ex_t'] },
  ];
  S(6, { groups, builds: [click('smg'), click('bgg'), click('pag'), click('exg')] });
}

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do: the three rounds, then the note */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Mark: the game line, then the checklist */
{
  const groups = [{ name: 'mkg', members: ['mk_game_bg', 'mk_game_t'] }, { name: 'mkc', members: ['mk_card_bg', 'mk_card_h', 'mk_card_t'] }];
  S(9, { groups, builds: [click('mkg'), click('mkc')] });
}

/* 10. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'shuffling-the-gene-pool.anim.json'), JSON.stringify({
  deck: 'out/Shuffling The Gene Pool/Shuffling The Gene Pool.pptx', output: 'out/Shuffling The Gene Pool/Shuffling The Gene Pool.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

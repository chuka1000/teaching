/** Emits spec/mass-and-weight.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

const graphParts = (name) => {
  const m = [`${name}_panel`, `${name}_ay`, `${name}_ax`, `${name}_yl`, `${name}_xl`, `${name}_g1`, `${name}_g2`, `${name}_g3`, `${name}_s0`, `${name}_pt0`, `${name}_pt1`];
  return m;
};

S(1, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* I Do 1 — mass row, weight row */
{
  const groups = [0, 1].map((i) => ({ name: `mw${i}`, members: [`mw${i}_bg`, `mw${i}_n`, `mw${i}_d`, `mw${i}_u`, `mw${i}_note`] }));
  S(4, { groups, builds: [click('mw0'), click('mw1')] });
}

/* I Do 2 — graph, then four step cards */
{
  const groups = [{ name: 'g1_graph', members: graphParts('g1') }];
  const builds = [click('g1_graph')];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `gr_${i}`, members: [`gr_${i}_bg`, `gr_${i}_n`, `gr_${i}_e`, `gr_${i}_t`] });
    builds.push(click(`gr_${i}`));
  }
  S(5, { groups, builds });
}

S(6, { builds: [0, 1, 2, 3].map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });
S(7, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] });
    builds.push(click(`t${i}`));
  }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

{
  const groups = [], builds = [];
  for (let i = 0; i < 10; i++) groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_t`] });
  for (let i = 0; i < 10; i += 2) builds.push(beat([`a${i}`, `a${i + 1}`]));
  S(9, { groups, builds });
}

{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) {
    groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] });
    builds.push(click(`p${i}_stmt`));
    builds.push(click({ target: `p${i}_v`, effect: 'zoom' }));
  }
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'mass-and-weight.anim.json'), JSON.stringify({
  deck: 'out/Mass and Weight/Mass and Weight.pptx',
  output: 'out/Mass and Weight/Mass and Weight.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

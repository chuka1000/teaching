/** Emits spec/equations.anim.json. Flat 150 ms; timers are video, handled separately. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/** Every shape a graph() call made, so it can be revealed as one unit. */
const graphParts = (name, segs) => {
  const m = [`${name}_panel`, `${name}_ay`, `${name}_ax`, `${name}_yl`, `${name}_xl`];
  for (let i = 1; i < 4; i++) m.push(`${name}_g${i}`);
  for (let i = 0; i < segs; i++) m.push(`${name}_s${i}`);
  return m;
};

S(1, { builds: [0,1,2,3,4,5].map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

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
  const builds = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  builds.push(beat(['h0', 'h1', 'h2']));
  S(3, { groups, builds });
}

/* 4 and 5 — each derivation beside its graph */
[[4, 'g1', 'e1_', ['g1_u', 'g1_v']], [5, 'g2', 'e2_', ['g2_note']]].forEach(([idx, g, pre, extras]) => {
  const groups = [{ name: `${g}_graph`, members: [...graphParts(g, 1), ...extras] }];
  const builds = [click(`${g}_graph`)];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `${pre}${i}`, members: [`${pre}${i}_bg`, `${pre}${i}_n`, `${pre}${i}_e`, `${pre}${i}_t`] });
    builds.push(click(`${pre}${i}`));
  }
  S(idx, { groups, builds });
});

S(6, { builds: [0,1,2,3].map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });
S(7, { builds: [0,1,2,3,4,5].map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'equations.anim.json'), JSON.stringify({
  deck: 'out/Equations of Motion.pptx', output: 'out/Equations of Motion.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

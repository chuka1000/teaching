/** Emits spec/fair-tests-and-variables.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Do Now */
S(1, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

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

/* 3. Hook */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1 — manipulated row, arrow, responding row */
{
  const groups = [
    { name: 'mv0', members: ['mv0_bg', 'mv0_icon', 'mv0_n', 'mv0_d', 'mv0_e'] },
    { name: 'mv1', members: ['mv1_bg', 'mv1_icon', 'mv1_n', 'mv1_d', 'mv1_e'] },
  ];
  S(4, { groups, builds: [click('mv0'), click({ target: 'mv_arrow', effect: 'fade' }), click('mv1')] });
}

/* 5. I Do 2 — controlled, then replication */
{
  const groups = [
    { name: 'ctrl', members: ['ctrl_bg', 'ctrl_icon', 'ctrl_h', 'ctrl_def', 'ctrl_list'] },
    { name: 'rep', members: ['rep_bg', 'rep_icon', 'rep_h', 'rep_def', 'rep_note'] },
  ];
  S(5, { groups, builds: [click('ctrl'), click('rep')] });
}

S(6, { builds: [0, 1, 2, 3].map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });
S(7, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] });
    builds.push(click(`t${i}`));
  }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Answers */
{
  const groups = [], builds = [];
  for (let i = 0; i < 10; i++) groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_t`] });
  for (let i = 0; i < 10; i += 2) builds.push(beat([`a${i}`, `a${i + 1}`]));
  S(9, { groups, builds });
}

/* 10. Plenary */
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'fair-tests-and-variables.anim.json'), JSON.stringify({
  deck: 'out/Fair Tests and Variables/Fair Tests and Variables.pptx',
  output: 'out/Fair Tests and Variables/Fair Tests and Variables.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

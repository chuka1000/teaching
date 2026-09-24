/** Emits spec/burning-food.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Today: four goals, then banner */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: four foods arrive together */
{
  const groups = range(4).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_icon`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2', 'h3'])] });
}

/* 4. I Do 1: the question, the two boxes and arrow, the test */
{
  const groups = [
    { name: 'ex', members: ['ex_bg', 'ex_icon', 'ex_t'] },
    { name: 'vb0', members: ['vb0_bg', 'vb0_h', 'vb0_d', 'vb0_e'] },
    { name: 'vb1', members: ['vb1_bg', 'vb1_h', 'vb1_d', 'vb1_e'] },
    { name: 'dep', members: ['dep_bg', 'dep_h', 'dep0_l', 'dep0_t', 'dep1_l', 'dep1_t'] },
  ];
  S(4, { groups, builds: [click('ex'), beat(['vb0', 'vb_arrow', 'vb1']), click('dep')] });
}

/* 5. I Do 2: control variables, replication */
{
  const groups = [
    { name: 'ctl', members: ['ctl_bg', 'ctl_icon', 'ctl_h', 'ctl_d', 'ctl_lab', 'ctl_l'] },
    { name: 'rep', members: ['rep_bg', 'rep_icon', 'rep_h', 'rep_d', 'rep_lab', 'rep_c0', 'rep_c1', 'rep_c2', 'rep_avg', 'rep_odd'] },
  ];
  S(5, { groups, builds: [click('ctl'), click('rep')] });
}

/* 6. We Do */
S(6, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 7. Plan It: question and foods, the two variables, controls and hypothesis */
{
  const groups = [
    { name: 'pq', members: ['pq_bg', 'pq_badge', 'pq_num', 'pq_t', 'pq_f0', 'pq_f1', 'pq_f2', 'pq_f3'] },
    ...range(4).map((i) => ({ name: `pl${i}`, members: [`pl${i}_bg`, `pl${i}_badge`, `pl${i}_num`, `pl${i}_h`, `pl${i}_t`] })),
  ];
  S(7, { groups, builds: [click('pq'), beat(['pl0', 'pl1']), beat(['pl2', 'pl3'])] });
}

/* 8. Practical: the rig, the steps, safety, recording */
{
  const rig = ['dg_bg', 'dg_mat', 'dg_can', 'dg_water', 'dg_thm', 'dg_thm_bulb', 'dg_holder', 'dg_food', 'dg_flame', 'dg_gap',
    'dg_l1', 'dg_l2', 'dg_l3', 'dg_l4', 'dg_l5'];
  const groups = [{ name: 'rig', members: rig }];
  for (let i = 0; i < 6; i++) groups.push({ name: `ps${i}`, members: [`ps${i}_bg`, `ps${i}_badge`, `ps${i}_num`, `ps${i}_t`] });
  S(8, {
    groups,
    builds: [
      click('rig'),
      beat(range(6).map((i) => `ps${i}`)),
      click({ target: 'safe_banner', effect: 'zoom' }),
      click({ target: 'rec_banner', effect: 'zoom' }),
    ],
  });
}

/* 9. You Do: class results table, then four tasks */
{
  const groups = [{ name: 'cr', members: ['cr_bg', 'cr_h', ...range(4).flatMap((i) => [`cr${i}_bg`, `cr${i}_icon`, `cr${i}_n`, `cr${i}_v`])] }];
  const builds = [click('cr')];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `yd${i}`, members: [`yd${i}_bg`, `yd${i}_badge`, `yd${i}_num`, `yd${i}_t`, `yd${i}_h`] });
    builds.push(click(`yd${i}`));
  }
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'burning-food.anim.json'), JSON.stringify({
  deck: 'out/Burning Food/Burning Food.pptx',
  output: 'out/Burning Food/Burning Food.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

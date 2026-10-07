/** Emits spec/how-much-water-can-we-actually-use.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now: each answer on its own click */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Objectives */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] }); builds.push(click(`o${i}`)); }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: the three options together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1 (objective 1): the four sources one at a time, then the worked example */
{
  const K = ['ice', 'gw', 'sw', 'ot'];
  const groups = [
    ...K.map((k) => ({ name: `${k}g`, members: [`${k}_bg`, `${k}_icon`, `${k}_h`, `${k}_pct`, `${k}_t`] })),
    { name: 'exg', members: ['ex_bg', 'ex_icon', 'ex_h', 'ex_t'] },
  ];
  S(4, { groups, builds: [...K.map((k) => click(`${k}g`)), click('exg')] });
}

/* 5. I Do 2 (objective 2): the four pours, then the working, then the hook answer */
{
  const groups = [
    ...range(4).map((i) => ({ name: `ltg${i}`, members: [`lt${i}_bg`, `lt${i}_icon`, `lt${i}_h`, `lt${i}_big`, `lt${i}_t`, ...(i < 3 ? [`lt${i}_arrow`] : [])] })),
    { name: 'lwg', members: ['lw_bg', 'lw_t'] },
  ];
  S(5, { groups, builds: [click('ltg0'), click('ltg1'), click('ltg2'), click('ltg3'), click('lwg', 'lw_hook')] });
}

/* 6. We Do, "Finish this one": each row's missing steps appear together, one click per row, then the speeds */
S(6, { groups: [{ name: 'wfsg', members: ['wfs_bg', 'wfs_t'] }], builds: [
  click({ target: 'wf0_2_a', effect: 'zoom' }),
  click({ target: 'wf1_1_a', effect: 'zoom' }, { target: 'wf1_2_a', effect: 'zoom' }),
  click({ target: 'wf2_1_a', effect: 'zoom' }, { target: 'wf2_2_a', effect: 'zoom' }, { target: 'wf2_3_a', effect: 'zoom' }),
  click('wfsg'),
] });

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do: the three tiers, then the note */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Mark: the checklist */
{
  const groups = [{ name: 'mkc', members: ['mk_card_bg', 'mk_card_h', 'mk_card_t'] }];
  S(9, { groups, builds: [click('mkc')] });
}

/* 10. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  groups.push({ name: 'pl_jars', members: ['pl_jar1', 'pl_jar2', 'pl_next'] });
  builds.push(click('pl_jars'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'how-much-water-can-we-actually-use.anim.json'), JSON.stringify({
  deck: 'out/How Much Water Can We Actually Use/How Much Water Can We Actually Use.pptx', output: 'out/How Much Water Can We Actually Use/How Much Water Can We Actually Use.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

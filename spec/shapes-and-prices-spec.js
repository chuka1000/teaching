/** Emits spec/shapes-and-prices.anim.json. Flat 150 ms. */
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

/* 3. Hook: the question with its rectangle, then the three options together */
{
  const groups = [
    { name: 'hkq', members: ['hook_q', 'hk_rect', 'hk_t', 'hk_b', 'hk_l', 'hk_r'] },
    ...range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] })),
  ];
  S(3, { groups, builds: [click('hkq'), beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: route 1 (two clicks), route 2 (two), the check, the animation (ON CLICK), then the banner */
S(4, { builds: [
  beat(['ea_l0', 'ea_l1']),
  click('ea_l2'),
  beat(['ea_l3', 'ea_l4']),
  click('ea_l5'),
  beat(['ea_l6', 'ea_l7']),
  click({ target: 'vid_perim', effect: 'play' }),
  click({ target: 'ea_banner', effect: 'zoom' }),
] });

/* 5. I Do 2: the cost card (two lines), its total and check, the age card (three lines), its total and check, the banner */
{
  const groups = [
    { name: 'coC', members: ['co_bg', 'co_h', 'co_s'] },
    { name: 'agC', members: ['ag_bg', 'ag_h', 'ag_s'] },
  ];
  S(5, { groups, builds: [
    beat(['coC', 'co_l0', 'co_l1']),
    beat(['co_l2', 'co_l3']),
    beat(['agC', 'ag_l0', 'ag_l1', 'ag_l2']),
    beat(['ag_l3', 'ag_l4']),
    click({ target: 'co_banner', effect: 'zoom' }),
  ] });
}

/* 6. We Do, "Finish it off": each row's missing steps appear together, one click per row */
S(6, { builds: [
  click({ target: 'wf0_2_a', effect: 'zoom' }, { target: 'wf0_3_a', effect: 'zoom' }),
  click({ target: 'wf1_1_a', effect: 'zoom' }, { target: 'wf1_2_a', effect: 'zoom' }),
  click({ target: 'wf2_1_a', effect: 'zoom' }, { target: 'wf2_2_a', effect: 'zoom' }),
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
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'shapes-and-prices.anim.json'), JSON.stringify({
  deck: 'out/Expressions From Shapes And Prices/Expressions From Shapes And Prices.pptx', output: 'out/Expressions From Shapes And Prices/Expressions From Shapes And Prices.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

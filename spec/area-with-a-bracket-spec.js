/** Emits spec/area-with-a-bracket.anim.json. Flat 150 ms. */
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

/* 4. I Do 1: the area card (two lines), its check and unit, the perimeter card (two lines), its check and unit, then the banner */
{
  const groups = [
    { name: 'arC', members: ['ar_bg', 'ar_h', 'ar_s'] },
    { name: 'peC', members: ['pe_bg', 'pe_h', 'pe_s'] },
  ];
  S(4, { groups, builds: [
    beat(['arC', 'ar_l0', 'ar_l1']),
    beat(['ar_l2', 'ar_l3']),
    beat(['peC', 'pe_l0', 'pe_l1']),
    beat(['pe_l2', 'pe_l3']),
    click({ target: 'ar_banner', effect: 'zoom' }),
  ] });
}

/* 5. I Do 2: the plus example (three clicks), the minus example (two), the animation (ON CLICK), then the banner */
S(5, { builds: [
  beat(['ex_l0', 'ex_l1']),
  click('ex_l2'),
  click('ex_l3'),
  beat(['ex_l4', 'ex_l5']),
  beat(['ex_l6', 'ex_l7']),
  click({ target: 'vid_split', effect: 'play' }),
  click({ target: 'ex_banner', effect: 'zoom' }),
] });

/* 6. We Do, Rank And Conquer: card C, card D, card A, card B (best first), then the upgrade */
S(6, { builds: [
  click({ target: 'rc2_rank', effect: 'zoom' }, { target: 'rc2_why', effect: 'fade' }),
  click({ target: 'rc3_rank', effect: 'zoom' }, { target: 'rc3_why', effect: 'fade' }),
  click({ target: 'rc0_rank', effect: 'zoom' }, { target: 'rc0_why', effect: 'fade' }),
  click({ target: 'rc1_rank', effect: 'zoom' }, { target: 'rc1_why', effect: 'fade' }),
  click({ target: 'rc_conquer', effect: 'zoom' }),
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'area-with-a-bracket.anim.json'), JSON.stringify({
  deck: 'out/Area With A Bracket/Area With A Bracket.pptx', output: 'out/Area With A Bracket/Area With A Bracket.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

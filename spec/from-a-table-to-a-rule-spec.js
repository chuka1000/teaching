/** Emits spec/from-a-table-to-a-rule.anim.json. Flat 150 ms. */
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

/* 3. Hook: the question, then the three options together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [click('hook_q'), beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: the five lines, the animation (ON CLICK), then the banner */
S(4, { builds: [
  ...range(5).map((i) => click(`ea_l${i}`)),
  click({ target: 'vid_table', effect: 'play' }),
  click({ target: 'ea_banner', effect: 'zoom' }),
] });

/* 5. I Do 2: the three cards one at a time, then the banner */
{
  const groups = [
    { name: 'ck0g', members: ['ck0_bg', 'ck0_rule', 'ck0_l0', 'ck0_l1', 'ck0_v'] },
    { name: 'ck1g', members: ['ck1_bg', 'ck1_rule', 'ck1_l0', 'ck1_l1', 'ck1_v'] },
    { name: 'ck2g', members: ['ck2_bg', 'ck2_rule', 'ck2_l0', 'ck2_l1', 'ck2_l2', 'ck2_v'] },
  ];
  S(5, { groups, builds: [click('ck0g'), click('ck1g'), click('ck2g'), click({ target: 'ck_banner', effect: 'zoom' })] });
}

/* 6. We Do, "Finish this one": each row's missing steps appear together, one click per row */
S(6, { builds: [
  click({ target: 'wf0_3_a', effect: 'zoom' }),
  click({ target: 'wf1_1_a', effect: 'zoom' }, { target: 'wf1_2_a', effect: 'zoom' }),
  click({ target: 'wf2_1_a', effect: 'zoom' }, { target: 'wf2_2_a', effect: 'zoom' }, { target: 'wf2_3_a', effect: 'zoom' }),
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'from-a-table-to-a-rule.anim.json'), JSON.stringify({
  deck: 'out/From A Table To A Rule/From A Table To A Rule.pptx', output: 'out/From A Table To A Rule/From A Table To A Rule.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

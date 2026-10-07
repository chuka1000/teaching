/** Emits spec/technology-and-society.anim.json. Flat 150 ms. */
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

/* 4. I Do 1 (objective 1): science, technology, then the worked example */
{
  const groups = [
    { name: 'scig', members: ['sci_bg', 'sci_icon', 'sci_h', 'sci_t'] },
    { name: 'techg', members: ['tech_bg', 'tech_icon', 'tech_h', 'tech_t'] },
    { name: 'exg', members: ['ex_bg', 'ex_icon', 'ex_h', 'ex_t'] },
  ];
  S(4, { groups, builds: [click('scig'), click('techg'), click('exg')] });
}

/* 5. I Do 2 (objective 2): steps 1 to 3, steps 4 to 6, then the loop line and the pointer forward */
{
  const groups = [
    ...range(6).map((i) => ({ name: `step${i}`, members: [`st${i}_bg`, `st${i}_badge`, `st${i}_num`, `st${i}_h`, `st${i}_t`, `st${i}_e`] })),
    { name: 'loopg', members: ['loop_bg', 'loop_icon', 'loop_t', 'loop_fwd'] },
  ];
  S(5, { groups, builds: [beat(['step0', 'step1', 'step2']), beat(['step3', 'step4', 'step5']), click('loopg')] });
}

/* 6. We Do, "Finish this one": each row's missing steps appear together, one click per row */
S(6, { builds: [
  click({ target: 'wf0_3_a', effect: 'zoom' }),
  click({ target: 'wf1_1_a', effect: 'zoom' }, { target: 'wf1_2_a', effect: 'zoom' }),
  click({ target: 'wf2_1_a', effect: 'zoom' }, { target: 'wf2_2_a', effect: 'zoom' }, { target: 'wf2_3_a', effect: 'zoom' }),
] });

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do: the four steps, then the note */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Mark: the game line, then the checklist */
{
  const groups = [
    { name: 'mkg', members: ['mk_game_bg', 'mk_game_t'] },
    { name: 'mkc', members: ['mk_card_bg', 'mk_card_h', 'mk_card_t'] },
  ];
  S(9, { groups, builds: [click('mkg'), click('mkc')] });
}

/* 10. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'technology-and-society.anim.json'), JSON.stringify({
  deck: 'out/Technology And Society/Technology And Society.pptx', output: 'out/Technology And Society/Technology And Society.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

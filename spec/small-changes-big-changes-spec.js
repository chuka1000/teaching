/** Emits spec/small-changes-big-changes.anim.json. Flat 150 ms. */
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

/* 4. I Do 1: gene, allele (with the eyes), gene pool, the bag, then the count */
{
  const groups = [
    { name: 'gng', members: ['gn_bg', 'gn_t'] },
    { name: 'alg', members: ['al_bg', 'al_t', 'al_eyes', 'al_cap', 'al_two'] },
    { name: 'gpg', members: ['gp_bg', 'gp_t'] },
    { name: 'bgg', members: ['bg_bg', 'bg_img', 'bg_cap'] },
  ];
  S(4, { groups, builds: [click('gng'), click('alg'), click('gpg'), click('bgg'), click('bg_t')] });
}

/* 5. I Do 2: the micro column, the animation (ON CLICK), the macro column, the three steps, the macro example, the banner */
{
  const groups = [
    { name: 'mig', members: ['mi_hd_bg', 'mi_h', 'mi_d', 'mi_e'] },
    { name: 'mag', members: ['ma_hd_bg', 'ma_h', 'ma_d'] },
    ...range(3).map((i) => ({ name: `msg${i}`, members: [`ms${i}_bg`, `ms${i}_icon`, `ms${i}_w`, `ms${i}_t`] })),
  ];
  S(5, { groups, builds: [click('mig'), click({ target: 'vid_gen', effect: 'play' }), click('mag'), beat(['msg0', 'msg1', 'msg2']), click('ma_e'), click({ target: 'mm_banner', effect: 'zoom' })] });
}

/* 6. We Do: each row's missing steps together */
S(6, { builds: [
  click({ target: 'wf0_2_a', effect: 'zoom' }),
  click({ target: 'wf1_1_a', effect: 'zoom' }, { target: 'wf1_2_a', effect: 'zoom' }),
  click({ target: 'wf2_1_a', effect: 'zoom' }, { target: 'wf2_2_a', effect: 'zoom' }),
] });

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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'small-changes-big-changes.anim.json'), JSON.stringify({
  deck: 'out/Small Changes, Big Changes/Small Changes, Big Changes.pptx', output: 'out/Small Changes, Big Changes/Small Changes, Big Changes.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');

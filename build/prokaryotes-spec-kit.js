/**
 * Y8 Science, Unit 3 Prokaryotes: the animation spec for every standard slide (the object names are set by build/prokaryotes-kit.js).
 * A lesson's spec file calls the standard slides by index and writes its two I Do slides by hand. Flat 150 ms between builds in a beat.
 *
 *   const SP = require('../build/prokaryotes-spec-kit')('inside-a-prokaryote', 'Inside A Prokaryote');
 *   SP.doNow(1); SP.today(2); SP.hook(3); SP.S(4, {...}); SP.S(5, {...}); SP.weDoRC(6, [3, 0, 1, 2]); SP.coldCall(7); SP.youDo(8); SP.mark(9); SP.plenary(10);
 *   SP.write();
 */
const fs = require('fs');
const path = require('path');

module.exports = function specKit(slug, deckName) {
  const STEP = 150;
  const slides = [];
  const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
  const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
  const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const wipe = (t) => click({ target: t, effect: 'wipe', dir: 'left' });
  const zoom = (t) => click({ target: t, effect: 'zoom' });

  const api = {
    click, beat, S, range, wipe, zoom,
    doNow: (i) => S(i, { builds: range(6).map((k) => wipe(`d${k}_a`)) }),
    today: (i) => {
      const groups = range(3).map((k) => ({ name: `o${k}`, members: [`o${k}_bg`, `o${k}_badge`, `o${k}_num`, `o${k}_t`] }));
      S(i, { groups, builds: [...range(3).map((k) => click(`o${k}`)), zoom('obj_banner')] });
    },
    hook: (i) => {
      const groups = range(3).map((k) => ({ name: `h${k}`, members: [`h${k}_bg`, `h${k}_k`, `h${k}_t`] }));
      S(i, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
    },
    weDoSTM: (i, n = 4) => {
      const groups = range(n).map((k) => ({ name: `wdr${k}`, members: [`wd${k}_v`, `wd${k}_a`] }));
      S(i, { groups, builds: range(n).map((k) => zoom(`wdr${k}`)) });
    },
    weDoFIO: (i, n = 3) => S(i, { builds: range(n).map((k) => zoom(`wd${k}_a`)) }),
    /** order: the card indices in the order they are ranked on screen (weakest and strongest first is the usual choice) */
    weDoRC: (i, order) => {
      const groups = range(4).map((k) => ({ name: `rcr${k}`, members: [`rc${k}_rank`, `rc${k}_why`] }));
      S(i, { groups, builds: [...order.map((k) => zoom(`rcr${k}`)), zoom('rc_up')] });
    },
    coldCall: (i) => S(i, { builds: range(6).map((k) => wipe(`c${k}_a`)) }),
    youDo: (i) => {
      const groups = range(3).map((k) => ({ name: `t${k}`, members: [`t${k}_bg`, `t${k}_h`, `t${k}_s`, `t${k}_b`] }));
      S(i, { groups, builds: [...range(3).map((k) => click(`t${k}`)), click('yd_note')] });
    },
    mark: (i, withGame = true) => {
      const groups = [...(withGame ? [{ name: 'mkg', members: ['mk_game_bg', 'mk_game_t'] }] : []), { name: 'mkc', members: ['mk_card_bg', 'mk_card_h', 'mk_card_t'] }];
      S(i, { groups, builds: (withGame ? [click('mkg')] : []).concat([click('mkc')]) });
    },
    plenary: (i) => {
      const groups = [], builds = [];
      for (let k = 0; k < 5; k++) { groups.push({ name: `p${k}_stmt`, members: [`p${k}_bg`, `p${k}_q`] }); builds.push(click(`p${k}_stmt`)); builds.push(zoom(`p${k}_v`)); }
      builds.push(click('pl_next'));
      S(i, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
    },
    write: () => {
      slides.sort((a, b) => a.index - b.index);
      fs.writeFileSync(path.join(__dirname, '..', 'spec', `${slug}.anim.json`), JSON.stringify({
        deck: `out/${deckName}/${deckName}.pptx`, output: `out/${deckName}/${deckName}.pptx`,
        defaults: { transition: 'fade', dur: 400 }, slides,
      }, null, 2));
      console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
    },
  };
  return api;
};

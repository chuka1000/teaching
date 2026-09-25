/**
 * Playwright test for the Atoms game, at 1280x800 and 390x844. Needs playwright
 * (not in this repo; see build/test-putting-numbers-in-game.js for how):
 *
 *   NODE_PATH=/path/to/node_modules node build/test-atoms-words-and-picture-game.js [shots-dir]
 *
 * Checks generation (300 games), variation, that every question has one right
 * answer and only taught words, then plays whole games: every answer right, every
 * answer wrong (each with its own message), keyboard only, and edge cases.
 */
const { chromium } = require('playwright');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Atoms The Words And The Picture', 'Atoms The Words And The Picture game.html');
const SHOTS = process.argv[2];
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };

const WORDS = ['atom', 'matter', 'tiny', 'part', 'nucleus', 'centre', 'electron', 'outside', 'proton', 'neutron'];
const CONFUSE = {
  nucleus: ['neutron', 'electron', 'proton'], electron: ['neutron', 'nucleus', 'atom'], neutron: ['nucleus', 'proton', 'electron'],
  proton: ['neutron', 'electron'], centre: ['outside'], outside: ['centre'], matter: ['part', 'atom'], part: ['matter', 'tiny'],
  atom: ['matter', 'nucleus'], tiny: ['part', 'atom'],
};
const NOUNS = ['Water', 'An apple', 'Air', 'My hand'];
const NOUN_PIC = { Water: 'water', 'An apple': 'apple', Air: 'air', 'My hand': 'hand' };
const PICS = new Set(['atom', 'matter', 'tiny', 'part', 'nucleus', 'centre', 'electron', 'outside', 'proton', 'neutron', 'water', 'apple', 'air', 'hand']);
const TAUGHT = new Set([...WORDS, 'protons', 'neutrons', 'atoms', ...NOUNS]);

/* --------- invariants for one generated game --------- */
function checkGame(qs, code) {
  const w = (s) => `${code}: ${s}`;
  ok(qs.length === 18, w('18 questions'));
  const r1 = qs.slice(0, 6), r2 = qs.slice(6, 12), r3 = qs.slice(12, 18);
  ok(r1.every((q) => q.round === 1) && r2.every((q) => q.round === 2) && r3.every((q) => q.round === 3), w('rounds'));
  // Round 1: yes/no first, then either/or; nucleus and electron always in; distractors are real and different
  ok(r1[0].type === 'yn' && r1[1].type === 'yn' && r1.slice(2).every((q) => q.type === 'eo'), w('R1 order: yes/no, then either/or'));
  const t1 = r1.map((q) => q.word);
  ok(t1.includes('nucleus') && t1.includes('electron') && new Set(t1).size === 6, w('R1 has the two hard words and six different words'));
  r1.forEach((q) => {
    ok(WORDS.includes(q.word), w('R1 word is taught'));
    if (q.type === 'yn') { ok(WORDS.includes(q.shown) && (q.truth === (q.shown === q.word)), w('yes/no truth matches')); ok(q.truth || CONFUSE[q.word].includes(q.shown), w('yes/no wrong word is a confusable one')); }
    else { ok(q.options.length === 2 && q.options.includes(q.word) && new Set(q.options).size === 2, w('either/or has the answer once')); ok(q.options.every((o) => WORDS.includes(o)), w('either/or options taught')); }
  });
  ok(r1[0].truth !== r1[1].truth, w('one yes and one no'));
  // Round 2: the atom board then the nucleus board, three prompts each
  ok(r2.slice(0, 3).map((q) => q.word).sort().join() === 'centre,electron,outside' && r2.slice(0, 3).every((q) => q.board === 'atom'), w('R2 atom board prompts'));
  ok(r2.slice(3).map((q) => q.word).sort().join() === 'neutron,nucleus,proton' && r2.slice(3).every((q) => q.board === 'nucleus'), w('R2 nucleus board prompts'));
  const el = r2[0].layout.electrons, dots = r2[3].layout.dots;
  ok(el.length >= 3 && el.length <= 5, w('3 to 5 electrons'));
  ok(dots.length === 6 && dots.filter((d) => d.k === 'p').length === 3 && dots.filter((d) => d.k === 'n').length === 3, w('3 protons and 3 neutrons'));
  ok(dots.every((d) => Math.hypot(d.x, d.y) <= 0.67), w('dots inside the nucleus'));
  ok(dots.every((a, i) => dots.every((b, j) => i === j || Math.hypot(a.x - b.x, a.y - b.y) > 0.35)), w('dots do not overlap'));
  // Round 3: six sentences, every answer is among the tiles, all tiles are taught words, pictures exist
  ok(r3.every((q) => q.type === 'build'), w('R3 build'));
  const ids = r3.map((q) => q.id);
  ok(ids[4] === 'protons' && ids[5] === 'tinypart' && new Set(ids.slice(0, 4)).size === 4, w('R3 order and set'));
  ok(ids.filter((i) => i.startsWith('madeof')).length === 2, w('two made-of sentences'));
  const mo = r3.filter((q) => q.id.startsWith('madeof'));
  ok(mo[0].gaps[0][0] !== mo[1].gaps[0][0], w('the two made-of sentences use different things'));
  r3.forEach((q) => {
    const need = q.gaps.flat();
    ok(need.every((n) => q.tiles.includes(n)), w(`R3 ${q.id} tiles contain the answers`));
    ok(new Set(q.tiles).size === q.tiles.length && q.tiles.every((t) => TAUGHT.has(t)), w(`R3 ${q.id} tiles unique and taught`));
    ok((q.pics || [q.pic]).every((p) => PICS.has(p)), w(`R3 ${q.id} pictures exist`));
    const built = q.segs.map((s) => (typeof s === 'string' ? s : q.gaps[s.gap][0])).join('');
    ok(built === q.full || (q.id === 'protons' && built.replace('protons and protons', 'protons and neutrons') === q.full) || (q.id === 'protons' && q.full === 'The nucleus is made of protons and neutrons.'), w(`R3 ${q.id} sentence reads right: ${built}`));
    if (q.id.startsWith('madeof')) { ok(NOUN_PIC[q.gaps[0][0]] === q.pic, w('the noun tile matches its picture')); ok(q.tiles.includes('atom') && q.tiles.includes('atoms'), w('atom and atoms both offered')); }
  });
}

/* --------- helpers to play --------- */
async function box(page, sel, i = 0) { return page.locator(sel).nth(i).boundingBox(); }
async function tapPart(page, part, mode = 'right') {
  // click a place that belongs to `part`, away from anything on top of it
  if (part === 'electron' || part === 'proton' || part === 'neutron') { await page.locator(`svg [data-part="${part}"]`).first().click(); return; }
  const b = await box(page, `svg [data-part="${part}"]`);
  const cx = b.x + b.width / 2, cy = b.y + b.height / 2, R = b.width / 2;
  if (part === 'centre') await page.mouse.click(cx, cy);
  else if (part === 'outside') await page.mouse.click(cx + 0.64 * R, cy);
  else if (part === 'nucleus') await page.mouse.click(cx, cy + 0.985 * R);
  else if (part === 'atom') await page.mouse.click(cx + 0.985 * R * 1.0, cy - 0.05 * R);   // the white ring outside the nucleus
}
async function tapTile(page, text) { await page.locator(`.tile:not([disabled])`).filter({ hasText: new RegExp(`^${text}$`) }).first().click(); }
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => { const o = {}; const seen = new Set(); while (Object.keys(o).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); o[c] = window.__game.generate(c); } } return o; });
    Object.entries(games).forEach(([c, qs]) => checkGame(qs, c));
    const sig = (qs) => JSON.stringify(qs.map((q) => [q.type, q.word, q.shown, q.options, q.id, q.tiles, q.layout]));
    const sigs = new Set(Object.values(games).map(sig));
    ok(sigs.size === 300, `300 different games (${sigs.size})`);
    const first = new Set(Object.values(games).map((qs) => qs[0].word + qs[0].type)); ok(first.size >= 6, 'many different first questions');
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9'))), b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    ok(a === b, 'same code, same game');
    console.log(`generation: 300 games checked, ${sigs.size} different`);
    await page.close();
  }

  /* ---- two students, and a teacher's #CODE ---- */
  {
    const ctx = await browser.newContext(); const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const c1 = await p1.evaluate(() => window.__game.code()), c2 = await p2.evaluate(() => window.__game.code());
    ok(c1 !== c2, 'two students, two codes');
    ok((await p1.evaluate(() => JSON.stringify(window.__game.questions()))) !== (await p2.evaluate(() => JSON.stringify(window.__game.questions()))), 'two students, two games');
    await p3.goto(FILE + '#' + c1);
    ok((await p3.evaluate(() => window.__game.code())) === c1, '#CODE gives that game');
    ok((await p3.locator('#code').innerText()) === c1, 'the start screen shows the code');
    await ctx.close();
  }

  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: name.startsWith('phone'), isMobile: name.startsWith('phone') });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const short = name.split(' ')[0], tag = (s) => `[${name}] ${s}`;
    const shot = async (n) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-${n}.png`, fullPage: true }); };

    await page.goto(FILE + '#ATOM22');
    ok(await noOverflow(page), tag('start no overflow'));
    await shot('start');

    /* ---- play 1: every answer right, mixing tapping and the keyboard ---- */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    for (let i = 0; i < 18; i++) {
      const q = Qs[i];
      if (q.type === 'yn') {
        if (i === 0) await shot('yesno');
        ok(await page.locator('.word').first().innerText() === q.shown, tag(`Q${i + 1} shows ${q.shown}`));
        if (i % 2) await page.keyboard.press(q.truth ? 'y' : 'n'); else await page.click(`.yn .choice[data-k="${q.truth ? 'yes' : 'no'}"]`);
      } else if (q.type === 'eo') {
        if (i === 2) await shot('eitheror');
        const idx = q.options.indexOf(q.word) + 1;
        if (i % 2) await page.keyboard.press(String(idx)); else await page.locator('.choices .choice').filter({ hasText: new RegExp(`^${q.word}$`) }).click();
      } else if (q.type === 'point') {
        ok((await page.locator('.card .word').first().innerText()) === q.word, tag(`Q${i + 1} asks for ${q.word}`));
        if (i === 6) await shot('atom-board'); if (i === 9) await shot('nucleus-board');
        if (i === 7) { await page.locator(`svg [data-part="${q.word}"]`).first().focus(); await page.keyboard.press('Enter'); }   // keyboard path
        else await tapPart(page, q.word);
      } else {
        if (i === 14) await shot('build-empty');
        for (const g of q.gaps) { const want = q.id === 'protons' ? ['protons', 'neutrons'][q.gaps.indexOf(g)] : g[0]; await tapTile(page, want); }
        ok(await page.locator('#check').isEnabled(), tag(`Q${i + 1} Check enabled when full`));
        if (i % 2) await page.keyboard.press('Enter'); else await page.click('#check');
      }
      ok(await page.locator('#feedback.right').count() === 1, tag(`Q${i + 1} right feedback`));
      ok(await noOverflow(page), tag(`Q${i + 1} no overflow`));
      if (i === 17) await shot('build-right');
      await page.keyboard.press('Enter');                                    // Next, or Finish round
      if (i % 6 === 5) { ok((await page.locator('.score').innerText()) === '6 of 6', tag(`round ${(i + 1) / 6} shows 6 of 6`)); await page.click('#roundnext'); }
    }
    ok((await page.locator('.score').innerText()) === '18 of 18', tag('final 18 of 18'));
    ok((await page.locator('body').innerText()).includes('Every word was right'), tag('final: every word right'));
    ok(await noOverflow(page), tag('final no overflow'));

    /* ---- play 2: every answer wrong, each with its own message ---- */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const POINT = { centre: ['outside', 'That is the outside. The centre is the middle.'], outside: ['centre', 'That is the centre. The outside is around the centre.'], electron: ['centre', 'That is the centre. An electron is a green dot.'],
      nucleus: ['proton', 'That is a proton. The nucleus is the whole dark circle.'], proton: ['neutron', 'That is a neutron. A proton is a yellow dot.'], neutron: ['proton', 'That is a proton. A neutron is a rose dot.'] };
    const BUILD_WRONG = { madeof1: { tiles: (q) => [q.gaps[0][0], 'atom'], msg: 'More than one atom: atoms, with an s.' },
      madeof2: { tiles: (q) => [q.tiles.find((t) => NOUNS.includes(t) && t !== q.gaps[0][0]), 'atoms'], msg: 'Look at the picture.' },
      centre: { tiles: () => ['outside'], msg: 'The centre is the middle. Outside is around the centre.' }, outside: { tiles: () => ['centre'], msg: 'The centre is the middle. Outside is around the centre.' },
      protons: { tiles: (q) => ['protons', q.tiles.find((t) => t !== 'protons' && t !== 'neutrons')], msg: 'Read the sentence again.' }, tinypart: { tiles: () => ['matter', 'part'], msg: 'A part is a piece OF the stuff. Matter is the stuff.' } };
    for (let i = 0; i < 18; i++) {
      const q = Qs[i];
      if (q.type === 'yn') await page.click(`.yn .choice[data-k="${q.truth ? 'no' : 'yes'}"]`);
      else if (q.type === 'eo') await page.locator('.choices .choice').filter({ hasText: new RegExp(`^${q.options.find((o) => o !== q.word)}$`) }).click();
      else if (q.type === 'point') { const [t] = POINT[q.word]; if (t === 'atom') await tapPart(page, 'atom'); else await tapPart(page, t); }
      else {
        const spec = q.id.startsWith('madeof') ? BUILD_WRONG[q.id] : BUILD_WRONG[q.id];
        const tiles = spec.tiles(q).map((t, gi) => t);
        // madeof1 must keep gap1 right; madeof2 must put a different noun in gap1
        for (const tt of tiles) await tapTile(page, tt);
        await page.click('#check');
      }
      ok(await page.locator('#feedback.wrong').count() === 1, tag(`Q${i + 1} wrong feedback`));
      const fb = await page.locator('#feedback').innerText();
      if (q.type === 'point') ok(fb.includes(POINT[q.word][1]), tag(`Q${i + 1} message for tapping ${POINT[q.word][0]} when asked ${q.word}`));
      if (q.type === 'build') ok(fb.includes(BUILD_WRONG[q.id].msg) && fb.includes(q.full), tag(`Q${i + 1} ${q.id} message and full sentence`));
      if (q.type === 'yn' || q.type === 'eo') ok(fb.toLowerCase().includes(q.word) && fb.includes(WORDS_SAY(q.word)), tag(`Q${i + 1} shows the word and how to say it`));
      if (i === 0) await shot('wrong-word'); if (i === 7) await shot('wrong-point'); if (i === 17) await shot('wrong-build');
      await page.click('#next');
      if (i % 6 === 5) { ok((await page.locator('.score').innerText()) === '0 of 6', tag(`round ${(i + 1) / 6} 0 of 6`)); if (i === 5) await shot('round-end'); await page.click('#roundnext'); }
    }
    ok((await page.locator('.score').innerText()) === '0 of 18', tag('final 0 of 18'));
    const finalText = await page.locator('body').innerText();
    ok(finalText.includes('Say these words again') && finalText.includes('Look again'), tag('final lists the words and the slips'));
    ok(['part and matter', 'atoms, with an s', 'centre and outside'].every((s) => finalText.includes(s)), tag('final names the slips'));
    await shot('final');

    /* ---- edge cases ---- */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const buttons = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).length);
    ok(buttons === 0, tag('every button is at least 44 px'));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    await ctx.close();
  }
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
function WORDS_SAY(w) { return { atom: 'A-tom', matter: 'MAT-ter', tiny: 'TY-nee', part: 'PART', nucleus: 'NEW-clee-us', centre: 'SEN-ter', electron: 'eh-LEK-tron', outside: 'OWT-side', proton: 'PRO-ton', neutron: 'NEW-tron' }[w]; }

/**
 * Playwright test for the Putting Numbers In game, at 1280x800 and 390x844.
 * Needs playwright (not in this repo: `npm i playwright && npx playwright install
 * chromium` somewhere else, and run with NODE_PATH pointing at it).
 *
 *   NODE_PATH=/path/to/node_modules node build/test-putting-numbers-in-game.js [shots-dir]
 *
 * It also dumps 300 generated games to /tmp for build/check-putting-numbers-in-game.py.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Putting Numbers In', 'Putting Numbers In game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/putting-numbers-in-games.json';
const MSG = {
  join: 'A number next to a letter means times. Do not join the digits.',
  addsub: 'Look at the sign in the formula, and use it.',
  addfirst: 'Multiply before you add.',
  subfirst: 'Multiply before you take away.',
  bracket: 'The number outside the bracket multiplies everything inside.',
  swapped: 'Each letter gets its own number. Do not swap them.',
};
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const typeKeys = async (page, s) => { for (const ch of String(s)) await page.click(`button.key[data-k="${ch}"]`); };

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for sympy ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = window.__game.generate(c); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game');
    ok(a !== c, 'a different code gives a different game');
    ok(Object.keys(games).length === 300, '300 games generated');
    await page.close();
  }

  /* ---- two students open the file: different games; a teacher's #CODE reproduces one ---- */
  {
    const ctx = await browser.newContext();
    const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const code1 = await p1.evaluate(() => window.__game.code()), code2 = await p2.evaluate(() => window.__game.code());
    ok(code1 !== code2, `two students get different codes (${code1}, ${code2})`);
    const q1 = await p1.evaluate(() => JSON.stringify(window.__game.questions())), q2 = await p2.evaluate(() => JSON.stringify(window.__game.questions()));
    ok(q1 !== q2, 'two students get different questions');
    await p3.goto(FILE + '#' + code1);
    ok(await p3.evaluate(() => window.__game.code()) === code1, 'teacher opens #CODE and gets that code');
    ok(await p3.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'teacher sees exactly the first student\'s questions');
    ok(await p3.locator('#code').innerText() === code1, 'start screen shows the code');
    await ctx.close();
  }

  /* ---- playing it, both viewports ---- */
  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: name.startsWith('phone'), isMobile: name.startsWith('phone') });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`;
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const short = name.split(' ')[0];

    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-start.png` });

    /* play 1: all correct, keyboard only; the question on screen is the generated one */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    for (let i = 0; i < 18; i++) {
      const Q = Qs[i];
      const shown = (await page.locator('.formula').innerText()).replace(/\s+/g, ' ').trim();
      ok(shown === Q.formula, tag(`Q${i + 1} shows ${Q.formula} (got ${shown})`));
      if (i === 3 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-question.png` });
      await page.keyboard.type(String(Q.answer)); await page.keyboard.press('Enter');
      ok(await page.locator('#feedback.right').count() === 1, tag(`Q${i + 1} correct feedback`));
      ok(await noOverflow(), tag(`Q${i + 1} no overflow`));
      await page.keyboard.press('Enter');
      if (i % 6 === 5) { ok((await page.locator('.score').innerText()) === '6 of 6', tag(`round ${(i + 1) / 6} 6 of 6`)); await page.click('#roundnext'); }
    }
    ok((await page.locator('.score').innerText()) === '18 of 18', tag('final 18 of 18'));
    ok((await page.locator('body').innerText()).includes('No mistakes'), tag('no mistakes'));
    ok(await noOverflow(), tag('final no overflow'));

    /* play 2: a known mistake wherever there is one, by tapping the keypad */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const seenTags = new Set(); let known = 0;
    for (let i = 0; i < 18; i++) {
      const Q = Qs[i], ws = Object.entries(Q.wrong);
      const [val, w] = ws.length ? ws[0] : [String(Q.answer + 1), null];
      await typeKeys(page, val);
      ok((await page.locator('#answer').innerText()) === val, tag(`Q${i + 1} typed ${val}`));
      await page.click('button.key.go');
      ok(await page.locator('#feedback.wrong').count() === 1, tag(`Q${i + 1} wrong feedback`));
      const fb = await page.locator('#feedback').innerText();
      ok(fb.includes(`The answer is ${Q.answer}.`) && fb.includes(Q.worked), tag(`Q${i + 1} answer and working shown`));
      if (w) { known++; seenTags.add(w.tag); ok(fb.includes(w.msg || MSG[w.tag]), tag(`Q${i + 1} message for ${w.tag}`)); }
      else ok(fb.includes('Write out each step'), tag(`Q${i + 1} generic message`));
      await page.click('button.key.go');
      if (i % 6 === 5) { ok((await page.locator('.score').innerText()) === '0 of 6', tag(`round ${(i + 1) / 6} 0 of 6`)); await page.click('#roundnext'); }
    }
    ok(known >= 15, tag(`at least 15 of 18 questions carry a known mistake (${known})`));
    ok((await page.locator('.score').innerText()) === '0 of 18', tag('final 0 of 18'));
    const finalText = await page.locator('body').innerText();
    ok(/Brackets\s+0 of 5/.test(finalText), tag('brackets 0 of 5'));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22', tag('Play again gives a new game'));
    ok(finalText.includes('Game code ' + nowCode), tag('final shows the code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final.png`, fullPage: true });

    /* play 3: edge cases */
    await page.click('#again'); await page.click('#start');
    await page.click('button.key.go');
    ok(await page.locator('#feedback.right, #feedback.wrong').count() === 0, tag('empty Check ignored'));
    await typeKeys(page, '13579');
    ok((await page.locator('#answer').innerText()) === '1357', tag('capped at 4 digits'));
    await page.click('button.key[data-k="back"]'); await page.click('button.key[data-k="back"]');
    ok((await page.locator('#answer').innerText()) === '13', tag('Delete works'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-typing.png` });

    const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).length);
    ok(small === 0, tag('every button at least 44 px'));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    await ctx.close();
  }
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();

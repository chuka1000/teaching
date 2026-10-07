/**
 * Playwright test for the Pairs game (Shuffling The Gene Pool), at 1280x800 and 390x844.
 *
 *   NODE_PATH=/path/to/node_modules node build/test-shuffling-the-gene-pool-game.js [shots-dir]
 *
 * It also dumps 300 generated games to /tmp for build/check-shuffling-the-gene-pool-game.py.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Shuffling The Gene Pool', 'Shuffling The Gene Pool game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/shuffling-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for the checker ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = window.__game.generate(c).map((q) => Object.assign({}, q, { disp: window.__game.display(q) })); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    await page.close();
  }

  /* ---- two students: different games; a teacher's #CODE reproduces one ---- */
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
    ok(await p3.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'teacher sees exactly the first student\'s scenarios');
    ok(await p3.locator('#code').innerText() === code1, 'start screen shows the code');
    await ctx.close();
  }

  const NAME = { mutation: 'Mutation', geneflow: 'Gene flow', selection: 'Natural selection', drift: 'Genetic drift' };
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

    /* play 1: all correct. Boards 1 and 3 of each round by tapping, board 2 by the keyboard (1 to 4, then A to D). */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    for (let r = 0; r < 3; r++) {
      for (let b = 0; b < 3; b++) {
        const base = r * 12 + b * 4, order = Qs[base].order;
        const shown = await page.locator('#qcard').getAttribute('data-display');
        ok(shown === [0, 1, 2, 3].map((k) => Qs[base + k].text).join(' || ') + ' | ' + order.map((f) => NAME[f]).join(' / '), tag(`round ${r + 1} board ${b + 1} shows the generated scenarios and force order`));
        ok(await page.locator('.scen').count() === 4 && await page.locator('.force').count() === 4, tag('four scenarios, four force buttons'));
        const labels = await page.locator('.force span').allInnerTexts();
        ok(JSON.stringify(labels) === JSON.stringify(order.map((f) => NAME[f])), tag('the force buttons are in the generated order'));
        if (r === 2 && b === 2 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-r3b3.png`, fullPage: true });
        for (let k = 0; k < 4; k++) {
          const Q = Qs[base + k];
          if (b === 1) { await page.keyboard.press(String(k + 1)); await page.keyboard.press('ABCD'[order.indexOf(Q.force)]); }
          else { await page.click(`.scen[data-s="${k}"]`); await page.click(`.force[data-f="${Q.force}"]`); }
          ok(await page.locator('.scenwrap').nth(k).locator('.fb.right').count() === 1, tag(`R${r + 1} B${b + 1} S${k + 1} correct feedback (${Q.tid})`));
          ok((await page.locator('.scenwrap').nth(k).locator('.fb').innerText()).includes(Q.why), tag('the reason is shown'));
        }
        ok(await page.locator('#nextbtn:not(.hide)').count() === 1, tag('Next appears when all four are answered'));
        ok(await noOverflow(), tag(`R${r + 1} B${b + 1} no overflow`));
        if (r === 0 && b === 0 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-r1b1-done.png`, fullPage: true });
        await page.click('#nextbtn');
      }
      ok((await page.locator('.score').innerText()) === '12 of 12', tag(`round ${r + 1} 12 of 12`));
      const det = page.locator('details.review');
      ok(await det.count() === 1 && (await det.locator('summary').innerText()).includes(`Round ${r + 1}`), tag(`round ${r + 1}: one review drop-down`));
      ok(await det.evaluate((d) => !d.open), tag('the round drop-down starts closed'));
      await det.locator('summary').click();
      ok(await det.locator('.rq').count() === 12 && await det.locator('.verdict.ok').count() === 12, tag('twelve scenarios, all correct, in the drop-down'));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').innerText()) === '36 of 36', tag('final 36 of 36'));
    ok(await page.locator('details.review').count() === 3, tag('final: a drop-down for each of the three rounds'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.rq .meta').count() === 12 && (await det.locator('.rq .meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)), tag(`round ${r}: every scenario shows how long it took`));
    }
    const fin = await page.locator('body').innerText();
    ok(['Mutation', 'Gene flow', 'Natural selection', 'Genetic drift'].every((f) => new RegExp(`${f}\\s+9 of 9`).test(fin)), tag('nine of each force, all right'));
    ok(fin.includes('No mistakes'), tag('no mistakes')); ok(await noOverflow(), tag('final no overflow'));

    /* play 2: a wrong answer everywhere */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const tags = new Set(); const wrote = {};
    for (let r = 0; r < 3; r++) {
      for (let b = 0; b < 3; b++) {
        const base = r * 12 + b * 4;
        for (let k = 0; k < 4; k++) {
          const Q = Qs[base + k], wrong = Q.order.find((f) => f !== Q.force);
          await page.click(`.scen[data-s="${k}"]`); await page.click(`.force[data-f="${wrong}"]`);
          wrote[base + k] = NAME[wrong]; tags.add(`${wrong}-for-${Q.force}`);
          const fb = await page.locator('.scenwrap').nth(k).locator('.fb').innerText();
          ok(await page.locator('.scenwrap').nth(k).locator('.fb.wrong').count() === 1 && fb.includes('Not quite') && fb.includes(NAME[Q.force]) && fb.includes(Q.why), tag(`R${r + 1} B${b + 1} S${k + 1} wrong feedback names the answer and the reason`));
          if (Q.trap) ok(fb.includes(Q.trap), tag('the trap is explained'));
          ok(await page.locator('.scenwrap').nth(k).locator('button.scen').isDisabled(), tag('a scenario is one go: it locks'));
        }
        await page.click('#nextbtn');
      }
      ok((await page.locator('.score').innerText()) === '0 of 12', tag(`round ${r + 1} 0 of 12`));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').innerText()) === '0 of 36', tag('final 0 of 36'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === 12, tag(`round ${r}: twelve wrong`));
      for (let k = 0; k < 12; k++) {
        const i = (r - 1) * 12 + k, Q = Qs[i]; const t = await det.locator(`.rq[data-q="${i + 1}"]`).innerText();
        ok(t.includes('You chose') && t.includes(wrote[i]) && t.includes('The answer is') && t.includes(NAME[Q.force]) && t.includes('How to get there') && t.includes(Q.why) && /\d+ (s|min)/.test(t), tag(`review ${i + 1}: what was chosen, the answer, the reason, the time`));
      }
    }
    const fin2 = await page.locator('body').innerText();
    ok(['Mutation', 'Gene flow', 'Natural selection', 'Genetic drift'].every((f) => new RegExp(`${f}\\s+0 of 9`).test(fin2)), tag('0 of 9 for every force'));
    ok(tags.size >= 6, tag(`several kinds of mistake were named (${tags.size})`));
    ok((await page.locator('ul.tips li').count()) === tags.size, tag('every kind of mistake has its tip'));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22' && fin2.includes('Game code ' + nowCode), tag('Play again gives a new game and shows its code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final.png`, fullPage: true });

    /* play 3: edge cases */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    await page.click(`.force[data-f="${Qs[0].order[0]}"]`);
    ok((await page.locator('#hint').innerText()).includes('Tap a scenario first') && await page.locator('.scenwrap .fb:not(.hide)').count() === 0, tag('tapping a force before a scenario does nothing and says so'));
    await page.click('.scen[data-s="0"]'); await page.click(`.force[data-f="${Qs[0].force}"]`);
    await page.click('.scen[data-s="0"]', { force: true }).catch(() => {});
    ok(await page.locator('.scenwrap .fb:not(.hide)').count() === 1, tag('an answered scenario cannot be answered again'));
    await page.click('#stop');
    const stopText = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '1 of 36' && stopText.includes('1 of 36 scenarios answered') && /not reached/.test(stopText), tag('stopped: 1 of 36, and it says how many were not reached'));
    await page.locator('details.review[data-round="1"] summary').click();
    ok(await page.locator('details.review[data-round="1"] .verdict.na').count() === 11 && await page.locator('details.review[data-round="1"] .verdict.ok').count() === 1, tag('stopped: the review says which were not reached'));
    await page.click('#again'); await page.click('#start'); await page.click('#stop');
    ok((await page.locator('.score').innerText()) === '0 of 36' && (await page.locator('body').innerText()).includes('You did not answer any scenarios'), tag('stopping at once: 0 of 36'));
    ok(await noOverflow(), tag('stopped: no overflow'));

    await page.goto(FILE + '#TEST22'); await page.reload(); await page.click('#start');
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

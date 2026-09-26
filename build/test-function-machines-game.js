/**
 * Playwright test for the Function Machines game, at 1280x800 and 390x844.
 * Needs playwright (not in this repo: `npm i playwright && npx playwright install
 * chromium` somewhere else, and run with NODE_PATH pointing at it).
 *
 *   NODE_PATH=/path/to/node_modules node build/test-function-machines-game.js [shots-dir]
 *
 * It also dumps 300 generated games to /tmp for build/check-function-machines-game.py.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Function Machines', 'Function Machines game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/function-machines-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const typeKeys = async (page, s) => { for (const ch of String(s)) await page.click(`button.key[data-k="${ch === '-' ? 'neg' : ch}"]`); };

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for sympy ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) {
        const c = window.__game.newCode();
        if (!seen.has(c)) { seen.add(c); out[c] = window.__game.generate(c).map((q) => Object.assign({}, q, { disp: window.__game.display(q) })); }
      }
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
    const shown = () => page.locator('#qcard').getAttribute('data-display');

    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-start.png` });

    /* play 1: all correct. Numbers by keyboard, multiple choice by 1 to 4. The screen shows the generated machine. */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    let rounds = [];
    for (let i = 0; i < 18; i++) {
      const Q = Qs[i];
      const want = await page.evaluate((k) => window.__game.display(window.__game.questions()[k]), i);
      ok((await shown()) === want, tag(`Q${i + 1} shows ${want}`));
      if ([0, 7, 13, 16, 17].includes(i) && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q${i + 1}.png`, fullPage: true });
      if (Q.kind === 'rule') await page.keyboard.press(String(Q.correctIndex + 1));
      else { await page.keyboard.type(String(Q.answer)); await page.keyboard.press('Enter'); }
      ok(await page.locator('#feedback.right').count() === 1, tag(`Q${i + 1} correct feedback (${Q.kind}, answer ${Q.answer})`));
      ok(await noOverflow(), tag(`Q${i + 1} no overflow`));
      await page.keyboard.press('Enter');
      if (i % 6 === 5) {
        ok((await page.locator('.score').innerText()) === '6 of 6', tag(`round ${(i + 1) / 6} 6 of 6`));
        const det = page.locator('details.review');
        ok(await det.count() === 1 && (await det.locator('summary').innerText()).includes(`Round ${(i + 1) / 6}`), tag(`round ${(i + 1) / 6}: one review drop-down`));
        ok(await det.evaluate((d) => !d.open), tag('the round drop-down starts closed'));
        await det.locator('summary').click();
        ok(await det.evaluate((d) => d.open), tag('the round drop-down opens'));
        ok(await det.locator('.rq').count() === 6 && await det.locator('.verdict.ok').count() === 6, tag('six questions, all correct, in the round drop-down'));
        await page.click('#roundnext');
      }
    }
    ok((await page.locator('.score').innerText()) === '18 of 18', tag('final 18 of 18'));
    ok(await page.locator('details.review').count() === 3, tag('final: a drop-down for each of the three rounds'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`);
      await det.locator('summary').click();
      const txt = await det.innerText();
      ok(/\d+ (s|min)/.test(txt), tag(`round ${r} summary shows a time`));
      ok((await det.locator('.rq .meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)) && await det.locator('.rq .meta').count() === 6, tag(`round ${r}: every question shows how long it took`));
      ok(await det.locator('.verdict.ok').count() === 6 && await det.locator('.verdict.no').count() === 0, tag(`round ${r}: six correct, none wrong`));
      ok(!(await det.innerText()).includes('You wrote'), tag(`round ${r}: no "You wrote" for a correct answer`));
    }
    ok((await page.locator('body').innerText()).includes('No mistakes'), tag('no mistakes'));
    ok(await noOverflow(), tag('final no overflow'));

    /* play 2: a known mistake wherever there is one, by tapping the keypad or a wrong option */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    let known = 0; const seenTags = new Set(); const wroteAt = {};
    for (let i = 0; i < 18; i++) {
      const Q = Qs[i];
      let msg = null, wantVal = null;
      if (Q.kind === 'rule') {
        const wrongIdx = Q.options.findIndex((o) => o.tag);
        await page.click(`button.opt[data-o="${wrongIdx + 1}"]`);
        msg = Q.options[wrongIdx].msg; seenTags.add(Q.options[wrongIdx].tag); known++; wroteAt[i] = Q.options[wrongIdx].text;
      } else {
        const ws = Object.entries(Q.wrong);
        const [val, w] = ws.length ? ws[0] : [String(Q.answer + 1), null];
        await typeKeys(page, val.replace('−', '-'));
        ok((await page.locator('#answer').innerText()).replace(/\s/g, '') === val.replace('-', '−'), tag(`Q${i + 1} typed ${val}`));
        await page.click('button.key.go');
        wroteAt[i] = val.replace('-', '−');
        if (w) { known++; seenTags.add(w.tag); msg = w.msg; } else msg = 'Write out each step and check the order.';
      }
      ok(await page.locator('#feedback.wrong').count() === 1, tag(`Q${i + 1} wrong feedback`));
      const fb = await page.locator('#feedback').innerText();
      ok(fb.includes(msg), tag(`Q${i + 1} message: ${msg}`));
      ok(fb.includes(Q.kind === 'rule' ? Q.formula : `The answer is ${Q.answer < 0 ? '−' + (-Q.answer) : Q.answer}.`), tag(`Q${i + 1} answer shown`));
      for (const l of Q.worked) ok(fb.includes(l.replace(/^-/, '−')), tag(`Q${i + 1} working line ${l}`));
      await page.click(Q.kind === 'rule' ? '#nextbtn' : 'button.key.go');
      if (i % 6 === 5) { ok((await page.locator('.score').innerText()) === '0 of 6', tag(`round ${(i + 1) / 6} 0 of 6`)); await page.click('#roundnext'); }
    }
    // the review on the last screen: what was written, and how to get there, for every wrong answer
    ok(await page.locator('details.review').count() === 3, tag('final: three round drop-downs (all wrong game)'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`);
      await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === 6, tag(`round ${r}: six wrong`));
      for (let k = 0; k < 6; k++) {
        const i = (r - 1) * 6 + k, Q = Qs[i];
        const item = det.locator(`.rq[data-q="${i + 1}"]`);
        const t = await item.innerText();
        const right = Q.kind === 'rule' ? Q.formula : (Q.answer < 0 ? '−' + (-Q.answer) : String(Q.answer));
        ok(t.includes('You wrote') && t.includes(wroteAt[i]) && t.includes('The answer is') && t.includes(right), tag(`review Q${i + 1}: what was written (${wroteAt[i]}) and the answer (${right})`));
        ok(Q.worked.every((l) => t.includes(l.replace(/^-/, '−'))), tag(`review Q${i + 1}: every line of working`));
        ok(/\d+ (s|min)/.test(t) && t.includes('How to get there'), tag(`review Q${i + 1}: the time and how to get there`));
      }
    }
    ok(known >= 17, tag(`at least 17 of 18 questions carry a known mistake (${known})`));
    ok((await page.locator('.score').innerText()) === '0 of 18', tag('final 0 of 18'));
    const finalText = await page.locator('body').innerText();
    ok(/Machine outputs\s+0 of 6/.test(finalText) && /Rules as formulas\s+0 of 2/.test(finalText) && /Working backwards\s+0 of 5/.test(finalText) && /Machine puzzles\s+0 of 5/.test(finalText), tag('the four categories: 6, 2, 5, 5'));
    ok(seenTags.size >= 3, tag(`several kinds of mistake were named (${[...seenTags].join(', ')})`));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22', tag('Play again gives a new game'));
    ok(finalText.includes('Game code ' + nowCode), tag('final shows the code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final.png`, fullPage: true });

    /* play 3: edge cases, and Stop and see my results */
    await page.click('#again'); await page.click('#start');
    await page.click('button.key.go');
    ok(await page.locator('#feedback.right, #feedback.wrong').count() === 0, tag('empty Check ignored'));
    await typeKeys(page, '135792');
    ok((await page.locator('#answer').innerText()) === '13579', tag('capped at 5 digits'));
    await page.click('button.key[data-k="back"]'); await page.click('button.key[data-k="back"]');
    ok((await page.locator('#answer').innerText()) === '135', tag('Delete works'));
    for (let k = 0; k < 3; k++) await page.click('button.key[data-k="back"]');
    await page.click('button.key[data-k="neg"]');
    ok((await page.locator('#answer').innerText()) === '−', tag('minus key'));
    await page.click('button.key.go');
    ok(await page.locator('#feedback.right, #feedback.wrong').count() === 0, tag('a lone minus is ignored'));
    await page.keyboard.press('Backspace');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-typing.png` });
    // answer two questions correctly, then stop
    Qs = await page.evaluate(() => window.__game.questions());
    for (let i = 0; i < 2; i++) { await page.keyboard.type(String(Qs[i].answer)); await page.keyboard.press('Enter'); await page.keyboard.press('Enter'); }
    await page.click('#stop');
    const stopText = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '2 of 18', tag('stopped: 2 of 18'));
    ok(stopText.includes('2 of 18 questions answered') && /not reached/.test(stopText), tag('stopped: says how many were not reached'));
    ok(await noOverflow(), tag('stopped: no overflow'));
    await page.locator('details.review[data-round="1"] summary').click();
    ok((await page.locator('details.review[data-round="1"] .verdict.na').count()) === 4 && (await page.locator('details.review[data-round="1"] .verdict.ok').count()) === 2, tag('stopped: the review says which questions were not reached'));

    /* a negative answer, typed, in a generated game that has one */
    let negCode = null;
    for (let t = 0; t < 400 && !negCode; t++) {
      const c = await page.evaluate(() => window.__game.newCode());
      const has = await page.evaluate((cc) => window.__game.generate(cc).some((q) => q.answer < 0), c);
      if (has) negCode = c;
    }
    ok(!!negCode, tag('some games have a negative answer'));
    if (negCode) {
      await page.goto(FILE + '#' + negCode); await page.reload();
      await page.click('#start');
      const Ns = await page.evaluate(() => window.__game.questions());
      for (let i = 0; i < 18; i++) {
        if (Ns[i].kind === 'rule') await page.keyboard.press(String(Ns[i].correctIndex + 1));
        else { await page.keyboard.type(String(Ns[i].answer)); await page.keyboard.press('Enter'); }
        ok(await page.locator('#feedback.right').count() === 1, tag(`negative game Q${i + 1} (${Ns[i].answer})`));
        await page.keyboard.press('Enter');
        if (i % 6 === 5) await page.click('#roundnext');
      }
      ok((await page.locator('.score').innerText()) === '18 of 18', tag('the negative-answer game: 18 of 18'));
    }

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

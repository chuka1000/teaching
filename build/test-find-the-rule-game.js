/**
 * Playwright test for the Find The Rule game, at 1280x800 and 390x844.
 * Needs playwright (not in this repo: `npm i playwright && npx playwright install
 * chromium` somewhere else, and run with NODE_PATH pointing at it).
 *
 *   NODE_PATH=/path/to/node_modules node build/test-find-the-rule-game.js [shots-dir]
 *
 * It also dumps 300 generated games to /tmp for build/check-find-the-rule-game.py.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Find The Rule', 'Find The Rule game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/find-the-rule-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const typeKeys = async (page, s) => { for (const ch of String(s)) await page.click(`button.key[data-k="${ch === '-' ? 'neg' : ch}"]`); };
const N = (v) => (v < 0 ? '−' + -v : String(v));
const ruleText = (m, c) => 'y = ' + (m === 1 ? 'x' : m === -1 ? '−x' : N(m) + 'x') + (c === 0 ? '' : c < 0 ? ' − ' + -c : ' + ' + c);
const bracketText = (m, k) => 'y = ' + N(m) + '(x ' + (k < 0 ? '− ' + -k : '+ ' + k) + ')';
const isRule = (Q) => Q.kind === 'rule' || Q.kind === 'bracket';
/** type a rule on the keyboard: the multiplier, Enter, the number added, Enter (which checks) */
async function typeRule(page, m, c) {
  await page.keyboard.type((m < 0 ? '-' : '') + Math.abs(m)); await page.keyboard.press('Enter');
  await page.keyboard.type((c < 0 ? '-' : '') + Math.abs(c)); await page.keyboard.press('Enter');
}

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
    ok(Object.values(games).every((g) => g.length === 40), 'every game has 40 questions');
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
    ok((await page.locator('body').innerText()).includes('meant to be too hard'), tag('the start screen says level 5 is meant to be too hard'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-start.png` });

    /* play 1: all correct. Numbers and rules by keyboard, multiple choice by 1 to 4. */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    for (let i = 0; i < 40; i++) {
      const Q = Qs[i];
      const want = await page.evaluate((k) => window.__game.display(window.__game.questions()[k]), i);
      ok((await shown()) === want, tag(`Q${i + 1} shows its table`));
      if ([0, 5, 12, 20, 27, 35, 39].includes(i) && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q${i + 1}.png`, fullPage: true });
      if (Q.kind === 'mc') await page.keyboard.press(String(Q.correctIndex + 1));
      else if (isRule(Q)) await typeRule(page, Q.answer.m, Q.answer.c);
      else { await page.keyboard.type(String(Q.answer)); await page.keyboard.press('Enter'); }
      ok(await page.locator('#feedback.right').count() === 1, tag(`Q${i + 1} correct feedback (${Q.kind}, ${JSON.stringify(Q.answer)})`));
      ok(await noOverflow(), tag(`Q${i + 1} no overflow`));
      await page.keyboard.press('Enter');
      if (i % 8 === 7) {
        const lv = (i + 1) / 8;
        ok((await page.locator('.score').innerText()) === '8 of 8', tag(`level ${lv} 8 of 8`));
        const det = page.locator('details.review');
        ok(await det.count() === 1 && (await det.locator('summary').innerText()).includes(`Level ${lv}`), tag(`level ${lv}: one review drop-down`));
        ok(await det.evaluate((d) => !d.open), tag('the level drop-down starts closed'));
        await det.locator('summary').click();
        ok(await det.evaluate((d) => d.open), tag('the level drop-down opens'));
        ok(await det.locator('.rq').count() === 8 && await det.locator('.verdict.ok').count() === 8, tag('eight questions, all correct, in the level drop-down'));
        await page.click('#roundnext');
      }
    }
    ok((await page.locator('.score').innerText()) === '40 of 40', tag('final 40 of 40'));
    ok(await page.locator('details.review').count() === 5, tag('final: a drop-down for each of the five levels'));
    for (const r of [1, 2, 3, 4, 5]) {
      const det = page.locator(`details.review[data-round="${r}"]`);
      await det.locator('summary').click();
      const txt = await det.innerText();
      ok(/\d+ (s|min)/.test(txt), tag(`level ${r} summary shows a time`));
      ok((await det.locator('.rq .meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)) && await det.locator('.rq .meta').count() === 8, tag(`level ${r}: every question shows how long it took`));
      ok(await det.locator('.verdict.ok').count() === 8 && await det.locator('.verdict.no').count() === 0, tag(`level ${r}: eight correct, none wrong`));
    }
    ok((await page.locator('body').innerText()).includes('No mistakes'), tag('no mistakes'));
    ok(await noOverflow(), tag('final no overflow'));

    /* play 2: a known mistake wherever there is one */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    let known = 0; const seenTags = new Set(); const wroteAt = {};
    for (let i = 0; i < 40; i++) {
      const Q = Qs[i];
      let msg = null;
      if (Q.kind === 'mc') {
        const wrongIdx = Q.options.findIndex((o, k) => k !== Q.correctIndex);
        await page.click(`button.opt[data-o="${wrongIdx + 1}"]`);
        const o = Q.options[wrongIdx]; msg = o.msg || 'Write out each step and check it with another pair from the table.'; if (o.msg) { known++; seenTags.add(o.tag); }
        wroteAt[i] = o.text;
      } else if (isRule(Q)) {
        const [key, w] = Object.entries(Q.wrong)[0];
        const [wm, wc] = key.split('|').map(Number);
        await typeRule(page, wm, wc);
        msg = w.msg; known++; seenTags.add(w.tag);
        wroteAt[i] = Q.kind === 'bracket' ? bracketText(wm, wc) : ruleText(wm, wc);
      } else {
        const ws = Object.entries(Q.wrong);
        const [val, w] = ws.length ? ws[0] : [String(Q.answer + 1), null];
        await typeKeys(page, val.replace('−', '-'));
        ok((await page.locator('#answer').innerText()).replace(/\s/g, '') === val.replace('-', '−'), tag(`Q${i + 1} typed ${val}`));
        await page.click('button.key.go');
        wroteAt[i] = val.replace('-', '−');
        if (w) { known++; seenTags.add(w.tag); msg = w.msg; } else msg = 'Write out each step and check it with another pair from the table.';
      }
      ok(await page.locator('#feedback.wrong').count() === 1, tag(`Q${i + 1} wrong feedback`));
      const fb = await page.locator('#feedback').innerText();
      ok(fb.includes(msg), tag(`Q${i + 1} message: ${msg}`));
      const right = Q.kind === 'mc' || isRule(Q) ? Q.formula : N(Q.answer);
      ok(fb.includes(right), tag(`Q${i + 1} answer shown (${right})`));
      for (const l of Q.worked) ok(fb.includes(l.replace(/^-/, '−')), tag(`Q${i + 1} working line ${l}`));
      await page.click(Q.kind === 'mc' ? '#nextbtn' : 'button.key.go');
      if (i % 8 === 7) { ok((await page.locator('.score').innerText()) === '0 of 8', tag(`level ${(i + 1) / 8} 0 of 8`)); await page.click('#roundnext'); }
    }
    ok(await page.locator('details.review').count() === 5, tag('final: five level drop-downs (all wrong game)'));
    for (const r of [1, 2, 3, 4, 5]) {
      const det = page.locator(`details.review[data-round="${r}"]`);
      await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === 8, tag(`level ${r}: eight wrong`));
      for (let k = 0; k < 8; k++) {
        const i = (r - 1) * 8 + k, Q = Qs[i];
        const item = det.locator(`.rq[data-q="${i + 1}"]`);
        const t = await item.innerText();
        const right = Q.kind === 'mc' || isRule(Q) ? Q.formula : N(Q.answer);
        ok(t.includes('You wrote') && t.includes(wroteAt[i]) && t.includes('The answer is') && t.includes(right), tag(`review Q${i + 1}: what was written (${wroteAt[i]}) and the answer (${right})`));
        ok(Q.worked.every((l) => t.includes(l.replace(/^-/, '−'))), tag(`review Q${i + 1}: every line of working`));
        ok(/\d+ (s|min)/.test(t) && t.includes('How to get there'), tag(`review Q${i + 1}: the time and how to get there`));
      }
    }
    ok(known >= 36, tag(`at least 36 of 40 questions carry a known mistake (${known})`));
    ok((await page.locator('.score').innerText()) === '0 of 40', tag('final 0 of 40'));
    const finalText = await page.locator('body').innerText();
    ok(/Reading the steps\s+0 of 4/.test(finalText) && /The number added \(y at x = 0\)\s+0 of 5/.test(finalText) && /Finding the rule\s+0 of 12/.test(finalText) && /Using the rule\s+0 of 8/.test(finalText) && /Checking a rule\s+0 of 3/.test(finalText) && /Past the lesson\s+0 of 8/.test(finalText), tag('the six categories: 4, 5, 12, 8, 3, 8'));
    ok(seenTags.size >= 6, tag(`several kinds of mistake were named (${[...seenTags].join(', ')})`));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22', tag('Play again gives a new game'));
    ok(finalText.includes('Game code ' + nowCode), tag('final shows the code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final.png`, fullPage: true });

    /* play 3: edge cases, the rule boxes, and Stop and see my results */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
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
    // answer Q1 to Q4 correctly, then go to the first rule question and test the two boxes
    for (let i = 0; i < 4; i++) { await page.keyboard.type(String(Qs[i].answer)); await page.keyboard.press('Enter'); await page.keyboard.press('Enter'); }
    // Q5 is a rule question
    ok(await page.locator('#slot-m').count() === 1 && await page.locator('#slot-c').count() === 1, tag('a rule question shows two boxes'));
    ok((await page.locator('#slot-m').getAttribute('class')).includes('on') && !(await page.locator('#slot-c').getAttribute('class')).includes('on'), tag('the first box is active'));
    await page.click('button.key.go');
    ok((await page.locator('#slot-m').getAttribute('class')).includes('on'), tag('Next with an empty box does not move on'));
    await typeKeys(page, '4');
    ok((await page.locator('#slot-m').innerText()) === '4', tag('digits go in the active box'));
    await page.click('button.key[data-k="neg"]');
    ok((await page.locator('#slot-m').innerText()) === '−4', tag('minus makes the multiplier negative'));
    await page.click('button.key[data-k="neg"]');
    await page.click('button.key.go');
    ok((await page.locator('#slot-c').getAttribute('class')).includes('on'), tag('Next moves to the second box'));
    ok((await page.locator('button.key.go').innerText()) === 'Check', tag('the key now says Check'));
    await page.click('button.key.go');
    ok(await page.locator('#feedback.right, #feedback.wrong').count() === 0, tag('Check with an empty second box is ignored'));
    await typeKeys(page, '7');
    await page.click('button.key[data-k="neg"]');
    ok((await page.locator('#conn').innerText()) === '−' && (await page.locator('#slot-c').innerText()) === '7', tag('minus on the second box turns the + into a −'));
    await page.click('button.key[data-k="neg"]');
    ok((await page.locator('#conn').innerText()) === '+', tag('minus again turns it back'));
    await page.click('#slot-m');
    ok((await page.locator('#slot-m').getAttribute('class')).includes('on'), tag('tapping a box makes it active'));
    await page.keyboard.press('Tab');
    ok((await page.locator('#slot-c').getAttribute('class')).includes('on'), tag('Tab moves to the other box'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-rule.png` });
    // finish this question correctly by tapping, then stop
    for (let k = 0; k < 2; k++) await page.click('button.key[data-k="back"]');
    await page.click('#slot-m'); for (let k = 0; k < 2; k++) await page.click('button.key[data-k="back"]');
    const Q5 = Qs[4];
    await page.click('#slot-m'); await typeKeys(page, String(Q5.answer.m)); await page.click('button.key.go'); await typeKeys(page, String(Math.abs(Q5.answer.c))); await page.click('button.key.go');
    ok(await page.locator('#feedback.right').count() === 1, tag('a rule typed by tapping the keypad is marked right'));
    await page.click('button.key.go');   // next
    await page.click('#stop');
    const stopText = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '5 of 40', tag('stopped: 5 of 40'));
    ok(stopText.includes('5 of 40 questions answered') && /not reached/.test(stopText), tag('stopped: says how many were not reached'));
    ok(await noOverflow(), tag('stopped: no overflow'));
    await page.locator('details.review[data-round="1"] summary').click();
    ok((await page.locator('details.review[data-round="1"] .verdict.na').count()) === 3 && (await page.locator('details.review[data-round="1"] .verdict.ok').count()) === 5, tag('stopped: the review says which questions were not reached'));

    /* a game with a falling rule: level 5 question 1 has a negative multiplier typed with the minus key */
    await page.goto(FILE + '#TEST22'); await page.reload(); await page.click('#start');
    const Ns = await page.evaluate(() => window.__game.questions());
    ok(Ns[32].answer.m < 0, tag('level 5 question 1 has a negative multiplier'));
    for (let i = 0; i < 40; i++) {
      const Q = Ns[i];
      if (Q.kind === 'mc') await page.keyboard.press(String(Q.correctIndex + 1));
      else if (isRule(Q)) { await page.click('#slot-m'); await typeKeys(page, (Q.answer.m < 0 ? '-' : '') + Math.abs(Q.answer.m)); await page.click('button.key.go'); await typeKeys(page, (Q.answer.c < 0 ? '-' : '') + Math.abs(Q.answer.c)); await page.click('button.key.go'); }
      else { await typeKeys(page, String(Q.answer)); await page.click('button.key.go'); }
      ok(await page.locator('#feedback.right').count() === 1, tag(`tapped game Q${i + 1} right`));
      await page.click(Q.kind === 'mc' ? '#nextbtn' : 'button.key.go');
      if (i % 8 === 7) await page.click('#roundnext');
    }
    ok((await page.locator('.score').innerText()) === '40 of 40', tag('the all-tapped game: 40 of 40'));

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

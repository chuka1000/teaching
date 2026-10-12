/**
 * Playwright test for the Sorter game (Archaea And Extreme Places), at 1280x800 and 390x844.
 *
 *   python3 build/archaea-and-extreme-places-game.py
 *   NODE_PATH=/path/to/node_modules node build/test-archaea-and-extreme-places-game.js [shots-dir]
 *   python3 build/check-archaea-and-extreme-places-game.py /tmp/archaea-games.json
 *
 * Chromium is the one in PLAYWRIGHT_BROWSERS_PATH (/opt/pw-browsers here); nothing is installed.
 *
 * It dumps 300 generated games for the checker (DUMP, default /tmp/archaea-games.json) and the feedback an all-wrong game showed
 * (DUMP + '.play.json'). Three plays per viewport: all right (items placed in a different order each round, by tap or click, by the
 * keyboard, and by dragging on the desktop), all wrong (a different wrong bin for each kind of item, so every named mistake is shown, then
 * every drop-down is read back), and the edge cases (stopping at once, stopping part-way, the Clues button, Escape, a locked item, a drop
 * that misses every bin).
 */
const fs = require('fs');
const path = require('path');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = require('playwright');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Archaea And Extreme Places', 'Archaea And Extreme Places game.html');
const BANK = JSON.parse(fs.readFileSync(path.join(__dirname, 'archaea-and-extreme-places.bank.json'), 'utf8'));
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/archaea-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const BINS = BANK.bins, L = BANK.bin_labels, N = 8, ROUNDS = 3;
const IS = { bacterium: 'It is a bacterium.', archaean: 'It is an archaean.', neither: 'It is neither a bacterium nor an archaean.' };
const TIME = /^\d+ (s|min)/;
const allVisible = [];                                                   // every screen's text, for the em dash check

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for the checker ---- */
  {
    const page = await (await browser.newContext()).newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(FILE);
    ok(errs.length === 0, 'the page loads with no error ' + errs.join(' | '));
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = JSON.parse(JSON.stringify(window.__game.generate(c))); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    const html = fs.readFileSync(FILE.replace('file://', ''), 'utf8');
    ok(!html.includes('/*DATA*/null/*END*/'), 'the bank was written into the game');
    ok(JSON.stringify(await page.evaluate(() => window.__game.data)) === JSON.stringify((({ _comment, ...rest }) => rest)(BANK)), 'the game holds exactly the bank (items, reasons and mistakes)');
    ok(!html.includes('—'), 'no em dash anywhere in the game file');
    await page.close();
  }

  /* ---- two students: different games; a teacher's #CODE reproduces one, on screen too ---- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage(), p4 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const code1 = await p1.evaluate(() => window.__game.code()), code2 = await p2.evaluate(() => window.__game.code());
    ok(code1 !== code2, `two students get different codes (${code1}, ${code2})`);
    ok(/^[A-HJ-NP-Z2-9]{6}$/.test(code1), 'the code is six characters from the clear alphabet');
    const q1 = await p1.evaluate(() => JSON.stringify(window.__game.game())), q2 = await p2.evaluate(() => JSON.stringify(window.__game.game()));
    ok(q1 !== q2, 'two students get different games');
    await p3.goto(FILE + '#' + code1);
    ok(await p3.evaluate(() => window.__game.code()) === code1, 'teacher opens #CODE and gets that code');
    ok(await p3.evaluate(() => JSON.stringify(window.__game.game())) === q1, 'teacher sees exactly the first student\'s game');
    ok(await p3.locator('#code').innerText() === code1, 'start screen shows the code');
    await p1.click('#start'); await p3.click('#start');
    const screenOf = (p) => p.evaluate(() => ({ items: [...document.querySelectorAll('.itembtn')].map((b) => b.textContent), bins: [...document.querySelectorAll('.bin')].map((b) => b.dataset.bin) }));
    const s1 = await screenOf(p1), s3 = await screenOf(p3);
    ok(JSON.stringify(s1) === JSON.stringify(s3), 'the same code shows the same items in the same order and the same bins in the same places');
    await p4.goto(FILE + '#' + code1.toLowerCase());
    ok(await p4.evaluate(() => window.__game.code()) === code1, 'a lower-case #code works too');
    await p4.goto(FILE + '#nope!'); await p4.reload();
    ok(/^[A-HJ-NP-Z2-9]{6}$/.test(await p4.evaluate(() => window.__game.code())), 'a bad #code is ignored and a new code is made');
    await ctx.close();
  }

  const playLog = [];
  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const phone = name.startsWith('phone');
    const ctx = await browser.newContext({ viewport: vp, hasTouch: phone, isMobile: phone });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`;
    const short = name.split(' ')[0];
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const tap = (sel) => (phone ? page.locator(sel).tap() : page.locator(sel).click());
    const text = () => page.locator('body').innerText();
    const shot = async (n, full) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-${n}.png`, fullPage: !!full }); };
    const game = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__game.game())));
    const results = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__game.results())));
    const itemSel = (idx) => `.item[data-idx="${idx}"] .itembtn`;
    const seen = async (what) => { allVisible.push(await text()); ok(await noOverflow(), tag(`${what}: no horizontal overflow`)); };
    const smallTargets = () => page.evaluate(() => [...document.querySelectorAll('button, summary, a[href]')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).map((b) => b.id || b.className || b.tagName));
    let G;

    /** Place item Q in a bin by 'tap' (a tap or a click), 'key' (Enter on the item, then 1, 2 or 3) or 'drag' (a mouse, desktop only). */
    async function place(Q, bin, method) {
      const pos = G.binOrder.indexOf(bin) + 1;
      if (method === 'key') {
        await page.locator(itemSel(Q.idx)).focus(); await page.keyboard.press('Enter');
        ok(await page.locator(itemSel(Q.idx)).getAttribute('aria-pressed') === 'true' && await page.evaluate(() => window.__game.selected()) === Q.idx, tag(`item ${Q.idx + 1}: Enter on the item selects it`));
        await page.keyboard.press(String(pos));
      } else if (method === 'drag' && !phone) {
        await page.locator(itemSel(Q.idx)).scrollIntoViewIfNeeded();
        const b = await page.locator(itemSel(Q.idx)).boundingBox(), bb = await page.locator(`.bin[data-bin="${bin}"]`).boundingBox();
        await page.mouse.move(b.x + 40, b.y + b.height / 2); await page.mouse.down();
        await page.mouse.move(b.x + 90, b.y + b.height / 2 + 12, { steps: 3 });
        await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 8 });
        ok(await page.locator('.ghost-drag').count() === 1 && await page.locator(`.bin.over[data-bin="${bin}"]`).count() === 1, tag(`item ${Q.idx + 1}: while dragging, a ghost follows the mouse and the bin under it lights up`));
        await page.mouse.up();
        ok(await page.locator('.ghost-drag').count() === 0 && await page.locator('.bin.over').count() === 0, tag(`item ${Q.idx + 1}: the ghost goes when the item is dropped`));
      } else { await tap(itemSel(Q.idx)); await tap(`.bin[data-bin="${bin}"]`); }
    }

    /** One round: place every item (in `order`), checking the item, the progress and the dots after each. choose(Q) gives the bin. */
    async function playRound(r, order, choose, methodFor, log) {
      const items = G.qs.slice(r * N, r * N + N);
      ok(JSON.stringify(await page.locator('.itembtn').allInnerTexts()) === JSON.stringify(items.map((q) => q.text)), tag(`round ${r + 1}: the eight items on screen are the generated ones, in order`));
      ok(JSON.stringify(await page.locator('.bin').evaluateAll((bs) => bs.map((b) => b.dataset.bin))) === JSON.stringify(G.binOrder), tag(`round ${r + 1}: the bins are in the same places as in round 1`));
      ok(JSON.stringify(await page.locator('.bin .key').allInnerTexts()) === JSON.stringify(['1', '2', '3']), tag(`round ${r + 1}: the bins show the keys 1, 2, 3`));
      ok(await page.locator('#prog').innerText() === 'Item 1 of 8' && await page.locator('.pill').innerText() !== '', tag(`round ${r + 1}: starts at item 1 of 8`));
      ok(new RegExp(`round ${r + 1} of 3`, 'i').test(await page.locator('.pill').innerText()), tag(`round ${r + 1}: the pill says round ${r + 1} of 3`));
      ok(await page.locator('.pill.hard').count() === (r === 2 ? 1 : 0), tag(`round ${r + 1}: only round 3 has the red pill`));
      ok(await page.locator('#stop').count() === 1 && await page.locator('#cluesbtn').count() === 1, tag(`round ${r + 1}: Stop and Clues are on the board`));
      let placed = 0;
      for (const k of order) {
        const Q = items[k], bin = choose(Q), method = methodFor(placed);
        await place(Q, bin, method);
        placed++;
        const res = (await results())[Q.idx], right = bin === Q.answer;
        ok(res && res.ok === right && res.chosen === bin && res.secs >= 1, tag(`item ${Q.idx + 1}: the answer was recorded (${bin}, ${right ? 'right' : 'wrong'}, ${res && res.secs} s) by ${method}`));
        const li = page.locator(`.item[data-idx="${Q.idx}"]`), fb = await li.locator('.fb').innerText();
        ok(await li.locator('.fb').isVisible() && await li.getAttribute('data-state') === (right ? 'right' : 'wrong') && await li.locator('.itembtn').isDisabled(), tag(`item ${Q.idx + 1}: the feedback shows at once and the item is locked`));
        ok(fb.includes(right ? 'Right' : 'Not quite') && fb.includes(Q.why), tag(`item ${Q.idx + 1}: ${right ? 'Right' : 'Not quite'} and the item's reason`));
        ok(fb.includes(`Bin ${G.binOrder.indexOf(Q.answer) + 1}: ${L[Q.answer]}`), tag(`item ${Q.idx + 1}: the tag shows the right bin and where it is`));
        ok(await li.locator('.tag').getAttribute('data-bin') === Q.answer, tag(`item ${Q.idx + 1}: the tag is the right bin's colour`));
        if (!right) {
          const m = BANK.mistakes[`${Q.answer}>${bin}`];
          ok(fb.includes(IS[Q.answer]) && fb.includes(`You chose ${L[bin]}.`) && fb.includes(m), tag(`item ${Q.idx + 1}: what it is, what was chosen, and the named mistake ${Q.answer}>${bin}`));
          log.push({ idx: Q.idx, id: Q.id, answer: Q.answer, chosen: bin, key: `${Q.answer}>${bin}`, shown: (await li.locator('.slip').innerText()).replace(/^Watch out:\s*/, ''), why: await li.locator('.why').innerText() });
        } else ok(!fb.includes('Watch out') && !fb.includes('You chose'), tag(`item ${Q.idx + 1}: a right answer shows no mistake`));
        const dots = await page.locator('#dots .dot').evaluateAll((ds) => ds.map((d) => d.className));
        ok(await page.locator('#prog').innerText() === (placed < N ? `Item ${placed + 1} of ${N}` : `All ${N} sorted`), tag(`round ${r + 1}: progress after ${placed} placed`));
        ok(dots.filter((d) => /right|wrong/.test(d)).length === placed && /right|wrong/.test(dots[k]) && dots[k].includes(right ? 'right' : 'wrong'), tag(`round ${r + 1}: dot ${k + 1} shows item ${k + 1}'s result`));
        ok(await noOverflow(), tag(`item ${Q.idx + 1}: no overflow`));
        if (r === 0 && placed === 3 && log === playLog.__right) await shot('feedback-right');
      }
      ok(await page.locator('#finishround').isVisible() && await page.locator('#bins').isHidden(), tag(`round ${r + 1}: when all eight are placed, the bins give way to the finish button`));
      ok((await page.locator('#finishround').innerText()) === (r < 2 ? `Finish round ${r + 1}` : 'See round 3 results'), tag(`round ${r + 1}: finish button text`));
    }

    /* =========================================================== the start screen */
    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    const startText = await text(); allVisible.push(startText);
    ok(/meant to be too hard/.test(startText) && /not mean you are bad at science/.test(startText), tag('the start screen says round 3 is meant to be too hard'));
    ok(startText.includes('Game code TEST22') && await page.locator('#code').innerText() === 'TEST22', tag('the start screen shows the game code'));
    ok(BINS.every((b) => startText.includes(L[b]) && startText.includes(BANK.bin_hints[b])), tag('the start screen names the three bins and says what each means'));
    ok(/stop and see your results at any time/.test(startText) && /no timer/.test(startText), tag('the start screen says there is no timer and you can stop'));
    const sc = page.locator('details.clues');
    ok(await sc.count() === 1 && await sc.evaluate((d) => !d.open) && (await sc.locator('summary').innerText()) === 'Clues', tag('start: a closed Clues drop-down'));
    await (phone ? sc.locator('summary').tap() : sc.locator('summary').click());
    const clueText = await sc.innerText();
    ok(await sc.evaluate((d) => d.open) && BANK.rules.every((r) => clueText.includes(r)), tag(`start: the Clues drop-down opens and shows the ${BANK.rules.length} rules`));
    await shot('start', true);
    if (phone) { const small = await smallTargets(); ok(small.length === 0, tag('start: every button and summary at least 44 px ' + small.join(','))); }

    /* =========================================================== play 1: all right */
    await tap('#start');
    G = await game();
    ok(G.qs.length === 24 && G.binOrder.slice().sort().join() === BINS.slice().sort().join(), tag('24 items and the three bins in some order'));
    await shot('board');
    ok(await page.locator('#hint').innerText() === 'Tap an item, then tap a bin.' && await page.locator('li.item').count() === N && await page.locator('button.bin').count() === 3, tag('board: eight items, three bins, and the hint'));
    ok((await page.locator('button.bin').evaluateAll((bs) => bs.map((b) => b.getAttribute('aria-label')))).every((a, i) => a.includes(`Bin ${i + 1}`) && a.includes(`Key ${i + 1}`)), tag('board: each bin says its number and key to a screen reader'));
    await seen('board');
    const methods = phone ? ['tap', 'key', 'tap'] : ['tap', 'key', 'drag'];
    const orders = [[0, 1, 2, 3, 4, 5, 6, 7], [7, 6, 5, 4, 3, 2, 1, 0], [1, 3, 5, 7, 0, 2, 4, 6]];
    playLog.__right = [];
    for (let r = 0; r < ROUNDS; r++) {
      if (r === 0) {                                                // a selection by tap, shown, then the real play
        await tap(itemSel(G.qs[2].idx));
        ok(await page.locator(`.item[data-idx="${G.qs[2].idx}"].sel`).count() === 1 && (await page.locator('#hint').innerText()).startsWith('Now tap a bin for:') && await page.locator('#bins.armed').count() === 1, tag('selecting an item highlights it and says what to do next'));
        await shot('selected');
        await tap(itemSel(G.qs[2].idx));
        ok(await page.locator('.item.sel').count() === 0 && await page.evaluate(() => window.__game.selected()) === null, tag('tapping the selected item again lets it go'));
      }
      await playRound(r, orders[r], (Q) => Q.answer, (n) => methods[n % 3], playLog.__right);
      if (r === 2) await shot('round3-done', true);
      await seen(`round ${r + 1} done`);
      await tap('#finishround');
      ok((await page.locator('.score').innerText()) === '8 of 8', tag(`round ${r + 1}: 8 of 8`));
      const rt = await text(); allVisible.push(rt);
      ok(rt.includes('The time does not count for anything') && /Round time \d+ min \d+ s/.test(rt), tag('the round screen says the time does not count for anything'));
      const det = page.locator('details.review');
      ok(await det.count() === 1 && await det.evaluate((d) => !d.open) && (await det.locator('summary').innerText()).includes(BANK.rounds[r].name), tag(`round ${r + 1}: one closed drop-down, named after the round`));
      await (phone ? det.locator('summary').tap() : det.locator('summary').click());
      ok(await det.evaluate((d) => d.open), tag('the round drop-down opens'));
      ok(await det.locator('.rq').count() === N && await det.locator('.verdict.ok').count() === N && await det.locator('.rq .meta').count() === N, tag('eight items, all right, each with a time'));
      ok((await det.locator('.rq .meta').allInnerTexts()).every((m) => TIME.test(m)), tag('every time is in seconds or minutes and seconds'));
      ok(await det.locator('.rq').evaluateAll((rs, want) => rs.map((x) => x.querySelector('.txt').textContent).join('|') === want, G.qs.slice(r * N, r * N + N).map((q) => q.text).join('|')), tag('the drop-down lists the eight items in the order they were on screen'));
      if (r === 0) await shot('round-end', true);
      ok(await noOverflow(), tag('round end: no overflow'));
      if (r === 1) ok(/Next is round 3\. It is meant to be too hard/.test(rt), tag('the round 2 screen warns that round 3 is meant to be too hard'));
      if (phone) { const small = await smallTargets(); ok(small.length === 0, tag(`round ${r + 1} end: every button and summary at least 44 px ${small.join(',')}`)); }
      await tap('#roundnext');
    }
    ok((await page.locator('.score').innerText()) === '24 of 24', tag('final: 24 of 24'));
    const fin1 = await text(); allVisible.push(fin1);
    ok(fin1.includes('No mistakes') && BANK.rounds.every((rd) => fin1.includes(rd.name)), tag('final: no mistakes, and a row for every round'));
    ok((await page.locator('#endcode').innerText()) === 'TEST22' && fin1.includes('Game code TEST22'), tag('final: shows the game code'));
    ok(await page.locator('details.review').count() === 3 && await page.locator('#again').innerText() === 'Play again with a new code', tag('final: a drop-down for each of the three rounds, and Play again with a new code'));
    ok(await page.locator('.score').count() === 1 && await page.locator('h2').allInnerTexts().then((h) => h.join('|') === 'Your results|Your mistakes|Every item'), tag('final: results, then mistakes, then the drop-downs, then the code'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await (phone ? det.locator('summary').tap() : det.locator('summary').click());
      ok(await det.locator('.rq .meta').count() === N && (await det.locator('.rq .meta').allInnerTexts()).every((m) => TIME.test(m)) && await det.locator('.verdict.ok').count() === N, tag(`final, round ${r}: eight right, every item shows how long it took`));
      ok(!(await det.innerText()).includes('You chose'), tag(`final, round ${r}: nothing chosen wrongly`));
    }
    await seen('final (all right)');
    if (phone) { const small = await smallTargets(); ok(small.length === 0, tag('final: every button and summary at least 44 px ' + small.join(','))); }

    /* =========================================================== play 2: all wrong, a different wrong bin for each kind of item */
    await tap('#again'); await tap('#start');
    G = await game();
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22' && /^[A-HJ-NP-Z2-9]{6}$/.test(nowCode), tag('Play again gives a new game with a new code'));
    ok(await page.locator('#hint').innerText() === 'Tap an item, then tap a bin.', tag('the new game starts at the board'));
    const wrongLog = [], perClass = {}, wroteBy = {};
    for (let r = 0; r < ROUNDS; r++) {
      await playRound(r, [0, 1, 2, 3, 4, 5, 6, 7], (Q) => { const ws = BINS.filter((b) => b !== Q.answer); perClass[Q.answer] = (perClass[Q.answer] || 0) + 1; return ws[perClass[Q.answer] % 2]; }, (n) => ['tap', 'key', 'tap'][n % 3], wrongLog);
      if (r === 0) {                                               // a locked item cannot be changed, and a bin with nothing selected does nothing
        const before = JSON.stringify(await results());
        await page.evaluate(() => document.querySelector('.item .itembtn').click());
        ok(await page.evaluate(() => window.__game.selected()) === null, tag('a placed item cannot be selected again'));
        await page.keyboard.press('1');
        ok(JSON.stringify(await results()) === before, tag('pressing a bin key with nothing selected changes nothing'));
      }
      if (r === 2) { await shot('round3-wrong', true); await shot('round3-wrong-view'); }
      await seen(`round ${r + 1} done (wrong)`);
      await tap('#finishround');
      ok((await page.locator('.score').innerText()) === '0 of 8', tag(`round ${r + 1}: 0 of 8`));
      const det = page.locator('details.review'); await (phone ? det.locator('summary').tap() : det.locator('summary').click());
      ok(await det.locator('.verdict.no').count() === N, tag(`round ${r + 1}: eight wrong in the drop-down`));
      for (let k = 0; k < N; k++) {
        const i = r * N + k, Q = G.qs[i], entry = wrongLog.find((x) => x.idx === i), t = await det.locator(`.rq[data-q="${i + 1}"]`).innerText();
        ok(t.includes(Q.text) && t.includes(`You chose ${L[entry.chosen]}. The answer is ${L[Q.answer]}.`) && t.includes('How to get there') && t.includes(Q.why) && t.includes(BANK.mistakes[entry.key]) && /\d+ (s|min)/.test(t),
          tag(`review item ${i + 1}: what was chosen, the answer, how to get there (the reason and the named mistake), and the time`));
      }
      if (r === 2) await shot('round-end-wrong', true);
      await tap('#roundnext');
    }
    ok((await page.locator('.score').innerText()) === '0 of 24', tag('final: 0 of 24'));
    ok(wrongLog.length === 24 && new Set(wrongLog.map((x) => x.key)).size === 6, tag(`all six named mistakes were exercised (${new Set(wrongLog.map((x) => x.key)).size})`));
    ok(wrongLog.every((x) => x.shown === BANK.mistakes[x.key]), tag('every named mistake shown is the bank\'s text for its key'));
    playLog.push(...wrongLog.map((x) => Object.assign({ viewport: short }, x)));
    const fin2 = await text(); allVisible.push(fin2);
    const counts = {}; wrongLog.forEach((x) => { counts[x.key] = (counts[x.key] || 0) + 1; });
    const lis = await page.locator('ul.tips li').allInnerTexts();
    ok(lis.length === Object.keys(counts).length, tag(`final: a line for every kind of mistake made (${lis.length})`));
    for (const [key, n] of Object.entries(counts)) {
      const [right, chosen] = key.split('>'), li = lis.find((t) => t.includes(`You chose ${L[chosen]} when the answer was ${L[right]}.`));   // two keys share one message, so find the line by its first sentence
      ok(li && li.startsWith(`${n} time${n === 1 ? '' : 's'}.`) && li.includes(BANK.mistakes[key]), tag(`final: ${key} made ${n} time(s), with its text`));
    }
    ok(Object.values(counts).reduce((a, b) => a + b, 0) === 24, tag('final: the counts add up to 24'));
    ok(fin2.includes('Game code ' + nowCode), tag('final: shows the new code'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await (phone ? det.locator('summary').tap() : det.locator('summary').click());
      ok(await det.locator('.verdict.no').count() === N && await det.locator('.rq .meta').count() === N, tag(`final, round ${r}: eight wrong, each with a time`));
    }
    await shot('final-wrong', true);
    await seen('final (all wrong)');
    if (phone) { const small = await smallTargets(); ok(small.length === 0, tag('final (wrong): every button and summary at least 44 px ' + small.join(','))); }

    /* =========================================================== play 3: stopping, and the edge cases */
    await tap('#again'); await tap('#start'); await tap('#stop');
    ok((await page.locator('.score').innerText()) === '0 of 24' && (await text()).includes('You did not answer any items') && (await text()).includes('24 not reached'), tag('stopping at once: 0 of 24, nothing answered, 24 not reached'));
    for (const r of [1, 2, 3]) { const det = page.locator(`details.review[data-round="${r}"]`); await (phone ? det.locator('summary').tap() : det.locator('summary').click()); ok(await det.locator('.verdict.na').count() === N && (await det.innerText()).split('Not reached').length - 1 === N, tag(`stopped at once, round ${r}: every item says Not reached`)); }
    await seen('stopped at once');

    await tap('#again'); await tap('#start');
    G = await game();
    const items1 = G.qs.slice(0, N);
    await tap('#cluesbtn');                                          // the Clues button during play: no penalty
    const panel = page.locator('#cluespanel'), cluesT = await panel.innerText();
    ok(await panel.isVisible() && BANK.rules.every((r) => cluesT.includes(r)) && await page.locator('#cluesbtn').getAttribute('aria-expanded') === 'true', tag('the Clues button opens the panel with every rule'));
    ok((await results()).filter(Boolean).length === 0, tag('looking at the clues costs nothing'));
    await shot('clues-open');
    ok(await noOverflow(), tag('Clues open: no overflow'));
    await page.keyboard.press('Escape');
    ok(await panel.isHidden() && await page.locator('#cluesbtn').getAttribute('aria-expanded') === 'false', tag('Escape closes the Clues panel'));
    await tap('#cluesbtn'); await tap('#cluesbtn');
    ok(await panel.isHidden(), tag('the Clues button opens and closes the panel'));
    await tap('#bins .bin >> nth=0');                                // a bin with nothing selected
    ok((await page.locator('#hint').innerText()).startsWith('Tap an item first') && (await results()).filter(Boolean).length === 0, tag('a bin tapped with no item selected only gives a hint'));
    await tap(itemSel(items1[0].idx)); await tap(itemSel(items1[1].idx));
    ok(await page.locator('.item.sel').count() === 1 && await page.evaluate(() => window.__game.selected()) === items1[1].idx, tag('choosing a second item replaces the first'));
    await page.keyboard.press('Escape');
    ok(await page.evaluate(() => window.__game.selected()) === null && await page.locator('.item.sel').count() === 0, tag('Escape lets the selected item go'));
    await page.keyboard.press('2');
    ok((await page.locator('#hint').innerText()).startsWith('Choose an item first') && (await results()).filter(Boolean).length === 0, tag('a number key with nothing selected only gives a hint'));
    // Tab reaches the first item; Enter selects; a number key places it; focus moves on to the next open item
    await page.evaluate(() => { window.scrollTo(0, 0); const s = document.createElement('span'); s.tabIndex = -1; document.querySelector('header.top').prepend(s); s.focus(); });   // start the Tab order just before the first item
    await page.keyboard.press('Tab'); await page.evaluate(() => document.querySelector('header.top > span:not(.pill)').remove());
    ok(await page.evaluate(() => document.activeElement.className) === 'itembtn' && await page.evaluate(() => document.activeElement.textContent) === items1[0].text, tag('Tab reaches the first item'));
    await page.keyboard.press('Enter'); await page.keyboard.press(String(G.binOrder.indexOf(items1[0].answer) + 1));
    ok((await results())[items1[0].idx] && (await results())[items1[0].idx].ok, tag('Tab, Enter, then the number of the right bin places it right'));
    ok(await page.evaluate(() => document.activeElement.textContent) === items1[1].text, tag('after a keyboard placement, focus moves to the next open item'));
    await place(items1[1], items1[1].answer, 'tap');
    const wrongBin = BINS.find((b) => b !== items1[2].answer);
    await place(items1[2], wrongBin, 'tap');
    await seen('three placed');
    await shot('feedback');
    if (!phone) {                                                    // dragging: a miss places nothing; a drop on a bin places it
      await page.locator(itemSel(items1[3].idx)).scrollIntoViewIfNeeded();
      const b = await page.locator(itemSel(items1[3].idx)).boundingBox();
      await page.mouse.move(b.x + 40, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 120, b.y + 150, { steps: 6 }); await page.mouse.move(40, 780, { steps: 4 });
      ok(await page.locator('.ghost-drag').count() === 1, tag('a drag shows a ghost'));
      await page.mouse.up();
      ok(!(await results())[items1[3].idx] && await page.locator('.ghost-drag').count() === 0 && await page.evaluate(() => window.__game.selected()) === null, tag('a drop that misses every bin places nothing and selects nothing'));
      await place(items1[3], items1[3].answer, 'drag');
      ok((await results())[items1[3].idx] && (await results())[items1[3].idx].ok, tag('dragging an item onto its bin places it'));
    } else await place(items1[3], items1[3].answer, 'tap');
    const stopped = (await results()).filter(Boolean).length;
    // the bins stay in view however far the list is scrolled
    await page.evaluate(() => window.scrollTo(0, 1e5));
    const inView = await page.evaluate(() => { const r = document.getElementById('bins').getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; });
    ok(inView, tag('the bins stay in view when the list is scrolled to the end'));
    await page.evaluate(() => window.scrollTo(0, 0));
    const small = await smallTargets(); if (phone) ok(small.length === 0, tag('board: every button and summary at least 44 px ' + small.join(',')));
    await tap('#stop');
    const stopText = await text(); allVisible.push(stopText);
    ok((await page.locator('.score').innerText()) === '3 of 24' && stopText.includes(`${stopped} of 24 items answered. ${24 - stopped} not reached.`), tag('stopped part-way: 3 of 24, and it says how many were not reached'));
    const d1 = page.locator('details.review[data-round="1"]'); await (phone ? d1.locator('summary').tap() : d1.locator('summary').click());
    ok(await d1.locator('.verdict.na').count() === N - stopped && await d1.locator('.verdict.ok').count() === 3 && await d1.locator('.verdict.no').count() === 1, tag('stopped: the drop-down shows 3 right, 1 wrong, the rest Not reached'));
    ok((await d1.locator('summary').innerText()).includes(`3 right of ${stopped} answered`), tag('stopped: the drop-down summary says how many were answered'));
    const rest = page.locator('details.review[data-round="2"]'); await (phone ? rest.locator('summary').tap() : rest.locator('summary').click());
    ok(await rest.locator('.verdict.na').count() === N && (await rest.locator('summary').innerText()).includes('not reached'), tag('stopped: a round never reached says Not reached for every item'));
    const tips = await page.locator('ul.tips li').allInnerTexts();
    ok(tips.length === 1 && tips[0].startsWith('1 time.') && tips[0].includes(BANK.mistakes[`${items1[2].answer}>${wrongBin}`]), tag('stopped: the one mistake is listed once, with its text'));
    ok((await page.locator('.row').count()) === 3 && (await page.locator('.row').first().innerText()).includes(`${3} of ${N}`) && (await page.locator('.row').nth(1).innerText()).includes(`(${N} not reached)`), tag('stopped: per-round scores with the number not reached'));
    await seen('stopped part-way');

    // stop in the middle of round 2: round 1 is complete, round 2 is part done
    await tap('#again'); await tap('#start'); G = await game();
    await playRound(0, [0, 1, 2, 3, 4, 5, 6, 7], (Q) => Q.answer, () => 'tap', []);
    await tap('#finishround'); await tap('#roundnext');
    ok((await page.locator('.pill').innerText()).toLowerCase().includes('round 2 of 3'), tag('round 2 begins after round 1'));
    await place(G.qs[8], BINS.find((b) => b !== G.qs[8].answer), 'tap'); await place(G.qs[9], G.qs[9].answer, 'tap');
    await tap('#stop');
    ok((await page.locator('.score').innerText()) === '9 of 24' && (await text()).includes('10 of 24 items answered. 14 not reached.'), tag('stopped in round 2: 9 of 24, 10 answered, 14 not reached'));
    ok((await page.locator('.row').nth(1).innerText()).includes(`1 of ${N} (6 not reached)`), tag('stopped in round 2: round 2 shows 1 of 8 and 6 not reached'));

    /* =========================================================== layout and the rest */
    await page.goto(FILE + '#TEST22'); await page.reload(); await tap('#start');
    const binH = await page.evaluate(() => [...document.querySelectorAll('.bin')].map((b) => b.getBoundingClientRect().height));
    ok(binH.every((h) => h >= 44), tag(`the bins are big enough targets (${binH.map(Math.round).join(', ')} px)`));
    const itemH = await page.evaluate(() => [...document.querySelectorAll('.itembtn')].map((b) => b.getBoundingClientRect().height));
    ok(itemH.every((h) => h >= 44), tag(`the items are big enough targets (${Math.round(Math.min(...itemH))} px at least)`));
    const fonts = await page.evaluate(() => ({ body: getComputedStyle(document.body).fontFamily, h: getComputedStyle(document.querySelector('.pill')).fontFamily }));
    ok(/Arial/.test(fonts.body), tag('body text is Arial'));
    await tap('#stop'); ok(/Georgia/.test(await page.evaluate(() => getComputedStyle(document.querySelector('h2')).fontFamily)), tag('titles are Georgia'));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    await ctx.close();
  }

  ok(allVisible.length > 20 && allVisible.every((t) => !t.includes('—')), 'no em dash in any visible text on any screen (' + allVisible.length + ' screens read)');
  fs.writeFileSync(DUMP + '.play.json', JSON.stringify(playLog));
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();

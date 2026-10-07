/**
 * The Algebra Challenge: the answers, in ONE place, printed UPSIDE DOWN on the last page of the
 * worksheet (no separate answers document, per the standing rule). Every value is checked
 * symbolically in build/algebra-challenge-check.py.
 */
module.exports = [
  ['1', '−2x + 19. −3(2x − 5) = −6x + 15. Both terms of the first bracket change sign.'],
  ['2', '8a − 7b. 5(2a − 3b) = 10a − 15b, then −2(a − 4b) = −2a + 8b.'],
  ['3', '4p² + 2p + 2q. p² terms: 5p² − p² = 4p². p terms: 3p − p = 2p. q terms: −2q + 4q = 2q. p and p² do NOT collect together.'],
  ['4', 'Simplified: 5x + 5y. Value: 5. 2(3x + 2y) − (x − y) = 6x + 4y − x + y = 5x + 5y, then 5(4) + 5(−3) = 20 − 15.'],
  ['5', '−23. 3(2n − 1) + 4n = 10n − 3, then 10(−2) − 3 = −20 − 3.'],
  ['6', 'Simplified rule: 5n − 12. Output: 13. 3(n − 4) + 2n = 5n − 12, then 5(5) − 12 = 25 − 12.'],
  ['7', 'Simplified rule: 3n + 8. Input: 5. 4(n + 2) − n = 3n + 8. Undo + 8 (23 − 8 = 15), then undo × 3 (15 ÷ 3 = 5).'],
  ['8', 'Simplified rule: 3n − 2. At n = 6: 3(6) − 2 = 16, so the check is correct. For output 40: undo − 2 (40 + 2 = 42), then undo × 3 (42 ÷ 3 = 14). Input = 14.'],
  ['9', '3. 3(3n − 2) + 5n = 9n − 6 + 5n = 14n − 6.'],
  ['10', '6. 5(2p − 6) + 3p = 10p − 30 + 3p = 13p − 30.'],
  ['11', 'Wrong. Correct answer: 10n − 14. 4(3n − 1) = 12n − 4, and −2(n + 5) = −2n − 10, so 12n − 4 − 2n − 10 = 10n − 14, not 10n + 6. Most likely mistake: −2 was multiplied by +5 as if it were −5, turning −10 into +10.'],
  ['12', 'Right. 5(2m + 3) − 3(m + 5) = 10m + 15 − 3m − 15 = 7m. The constants cancel exactly.'],
  ['13', '18 for every n, including n = −407. 3(n + 2) − 3(n − 4) = 3n + 6 − 3n + 12 = 18. The n terms always cancel, so the value never depends on n.'],
  ['14', 'c = 3. 2(n − 5) + 13 simplifies to 2n + 3. For 2n + c to equal 2n + 3 for every n, c must be 3.'],
  ['15', 'Every value. Machine A is 3n + 12. Machine B is 3(n + 4), which expands to 3n + 12 as well: the same expression written two ways, so the outputs match for every input, not just one.'],
  ['16', 'Simplified rule: 3n + 5. Input: 7. 4(n + 3) − (n + 7) = 4n + 12 − n − 7 = 3n + 5 (the invisible −1 in front of the second bracket flips both its signs). Undo + 5 (26 − 5 = 21), then undo × 3 (21 ÷ 3 = 7).'],
  ['17', 'Correct. 3(n + 1) expands to 3n + 3, so the two are the same expression, just written differently — that is why they always agree. Any correctly matching pair is accepted as the student\'s own example, for instance 5(n + 2) and 5n + 10.'],
  ['18', 'a = 2, b = 5 (the only pair). a(2n + b) − 4n = (2a − 4)n + ab. No n term needs 2a − 4 = 0, so a = 2. Then ab = 10 needs b = 5.'],
];

#!/usr/bin/env python3
"""
Every number and every claim in The Algebra Challenge, checked symbolically before it went into
the worksheet or the answers module (CLAUDE.md, "Every numeric answer... must be checked with
sympy"). Covers all 18 questions: every expansion, every substitution, every missing-coefficient
search, every "is this claim true" check, and the two "always equal for every n" identities.

    python3 build/algebra-challenge-check.py
"""
from sympy import symbols, expand, Eq, solve

n, x, y, a, b, m, p, q, c, d, k = symbols('n x y a b m p q c d k')

checks = 0
def fail(msg): print('FAIL:', msg); import sys; sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
def same(label, lhs, rhs):
    diff = expand(lhs - rhs)
    ok(diff == 0, f'{label}: {expand(lhs)} != {expand(rhs)} (diff {diff})')

# Q1
same('Q1', -3 * (2 * x - 5) + 4 * (x + 1), -2 * x + 19)
# Q2
same('Q2', 5 * (2 * a - 3 * b) - 2 * (a - 4 * b), 8 * a - 7 * b)
# Q3 — p and p^2 must not collect together
same('Q3', 3 * p - 2 * q + 5 * p**2 - p + 4 * q - p**2, 4 * p**2 + 2 * p + 2 * q)
# Q4 — simplify, then substitute a negative value
expr4 = 2 * (3 * x + 2 * y) - (x - y)
same('Q4 simplify', expr4, 5 * x + 5 * y)
ok(expr4.subs({x: 4, y: -3}) == 5, 'Q4 value at x=4, y=-3 should be 5')
# Q5 — substitute a negative value into an unsimplified expression
ok((3 * (2 * n - 1) + 4 * n).subs(n, -2) == -23, 'Q5 value at n=-2 should be -23')
# Q6 — simplify a machine rule, then evaluate it
rule6 = 3 * (n - 4) + 2 * n
same('Q6 simplify', rule6, 5 * n - 12)
ok(rule6.subs(n, 5) == 13, 'Q6 output at n=5 should be 13')
# Q7 — simplify, then reverse (solve for n)
rule7 = 4 * (n + 2) - n
same('Q7 simplify', rule7, 3 * n + 8)
sol7 = solve(Eq(3 * n + 8, 23), n)
ok(sol7 == [5], f'Q7: n should be 5, got {sol7}')
ok(rule7.subs(n, 5) == 23, 'Q7: the unsimplified rule must also give 23 at n=5')
# Q8 — check a substitution, then reverse the same rule for a different output
rule8 = 3 * (n - 2) + 4
same('Q8 simplify', rule8, 3 * n - 2)
ok(rule8.subs(n, 6) == 16, 'Q8: the claimed check (n=6 -> 16) must actually be true')
sol8 = solve(Eq(3 * n - 2, 40), n)
ok(sol8 == [14], f'Q8: input for output 40 should be 14, got {sol8}')
# Q9 — find the missing multiplier
lhs9 = expand(k * (3 * n - 2) + 5 * n)
sol9 = solve(Eq(lhs9.coeff(n), 14), k)
ok(len(sol9) == 1, f'Q9: expected exactly one value of k, got {sol9}')
same('Q9 full', lhs9.subs(k, sol9[0]), 14 * n - 6)
ok(sol9[0] == 3, f'Q9: k should be 3, got {sol9[0]}')
# Q10 — find the missing number inside the bracket
lhs10 = expand(5 * (2 * p - d) + 3 * p)
sol10 = solve(Eq(lhs10, 13 * p - 30), d)
ok(len(sol10) == 1, f'Q10: expected exactly one value of d, got {sol10}')
same('Q10 full', lhs10.subs(d, sol10[0]), 13 * p - 30)
ok(sol10[0] == 6, f'Q10: d should be 6, got {sol10[0]}')
# Q11 — the claim is WRONG; the real simplified expression is different
claim11 = 10 * n + 6
real11 = 4 * (3 * n - 1) - 2 * (n + 5)
ok(expand(real11) != claim11, 'Q11: the claim is supposed to be false, but it matches the real answer')
same('Q11 real', real11, 10 * n - 14)
# Q12 — the claim is RIGHT
same('Q12', 5 * (2 * m + 3) - 3 * (m + 5), 7 * m)
# Q13 — an identity: true for every n, including a wild one
expr13 = 3 * (n + 2) - 3 * (n - 4)
same('Q13 identity', expr13, 18)
ok(expr13.subs(n, -407) == 18, 'Q13: must still be 18 at n=-407')
# Q14 — two machines equal for every n forces a unique constant
simp14 = expand(2 * (n - 5) + 13)
ok(simp14 == 2 * n + 3, f'Q14: 2(n-5)+13 should simplify to 2n+3, got {simp14}')
sol14 = solve(Eq(simp14, 2 * n + c), c)
ok(sol14 == [3], f'Q14: c should be 3, got {sol14}')
# Q15 — two machines that LOOK different are the same expression, so equal for every input
same('Q15 identical', 3 * n + 12, 3 * (n + 4))
# Q16 — the "invisible -1" trap, then reverse
expr16 = 4 * (n + 3) - (n + 7)
same('Q16 simplify', expr16, 3 * n + 5)
sol16 = solve(Eq(3 * n + 5, 26), n)
ok(sol16 == [7], f'Q16: n should be 7, got {sol16}')
# Q17 — the two forms are the same expression
same('Q17', 3 * n + 3, 3 * (n + 1))
# Q18 — the unique positive-integer pair that kills the n term and hits the target
a_, b_ = symbols('a b', positive=True, integer=True)
expr18 = expand(a_ * (2 * n + b_) - 4 * n)
coeff_n = expr18.coeff(n)
sol_a = solve(Eq(coeff_n, 0), a_)
ok(sol_a == [2], f'Q18: a should be forced to 2, got {sol_a}')
const18 = (expr18 - coeff_n * n).subs(a_, sol_a[0])
sol_b = solve(Eq(const18, 10), b_)
ok(sol_b == [5], f'Q18: b should be forced to 5, got {sol_b}')
same('Q18 full', expr18.subs({a_: sol_a[0], b_: sol_b[0]}), 10)

print(f'{checks} checks passed')

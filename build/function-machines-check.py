#!/usr/bin/env python3
"""
Function Machines (8CN). Every number in the deck, the worksheet and the notes
is checked here with sympy BEFORE it is written anywhere (CLAUDE.md, "Things
that will bite you", 7). The game is checked separately, over 300 generated
games, by build/check-function-machines-game.py.

    python3 build/function-machines-check.py
"""
from sympy import symbols, Eq, solve, expand, Rational as R

n, x = symbols('n x')
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

def run(steps, v):
    """Put v through a machine: steps are ('mul', 4), ('add', 5), ('sub', 3), ('div', 2)."""
    for op, a in steps:
        v = {'mul': v * a, 'add': v + a, 'sub': v - a, 'div': R(v, a)}[op]
    return v
def undo(steps, out):
    """Work backwards: the last step first, each with its opposite."""
    for op, a in reversed(steps):
        out = {'mul': R(out, a), 'add': out - a, 'sub': out + a, 'div': out * a}[op]
    return out

# ---- Do Now ---------------------------------------------------------------
eq(5 * 6 - 3, 27, 'DN1: 5n - 3, n = 6')
eq(3 * (2 + 4), 18, 'DN2: 3(n + 4), n = 2')
eq(2 * 7 + 3 * 4, 26, 'DN3: 2a + 3b')
eq(3 * 4 + 2, 14, 'DN4: correct 3n + 2, n = 4'); eq((3 + 2) * 4, 20, 'DN4: the student added first')
eq(expand(2 * (x + 3) + x), 3 * x + 6, 'DN5: 2(x + 3) + x')
eq(2 * n + 5, 2 * n + 5, 'DN6: double, then add 5')

# ---- Hook: multiply by 3, then add 4, answer 19 ----------------------------
M = [('mul', 3), ('add', 4)]
eq(undo(M, 19), 5, 'hook: the number is 5'); eq(run(M, 5), 19, 'hook check')
eq(19 - 3 - 4, 12, 'hook B: took both away'); eq(19 + 4, 23, 'hook C: added again')

# ---- I Do 1 ---------------------------------------------------------------
F1 = [('mul', 4), ('sub', 3)]
eq(run(F1, 6), 21, 'I Do 1: 6 -> x4 -> 24 -> -3 -> 21'); eq(6 * 4, 24, 'I Do 1 first step')
eq([run(F1, i) for i in (2, 3, 5, 6)], [5, 9, 17, 21], 'video: 4n - 3 for 2, 3, 5, 6')
eq(4 * n - 3, 4 * n - 3, 'I Do 1 rule')
F2 = [('add', 5), ('mul', 2)]
eq(run(F2, 4), 18, 'I Do 1: +5 then x2 with 4'); eq((2 * (n + 5)).subs(n, 4), 18, 'I Do 1 rule 2(n + 5)')
eq((2 * n + 5).subs(n, 4), 13, 'I Do 1 wrong rule 2n + 5 gives 13, not 18')

# ---- I Do 2 ---------------------------------------------------------------
eq(undo(F1, 21), 6, 'I Do 2: 21 -> +3 -> 24 -> /4 -> 6'); eq(21 + 3, 24, 'I Do 2 step'); eq(R(24, 4), 6, 'I Do 2 step')
eq(undo(F2, 18), 4, 'I Do 2: 18 -> /2 -> 9 -> -5 -> 4'); eq(R(18, 2), 9, 'I Do 2 step'); eq(9 - 5, 4, 'I Do 2 step')
eq([undo(F1, m) for m in (21, 17, 9)], [6, 5, 3], 'backward video')
eq(solve(Eq(4 * n - 3, 21), n), [6], 'I Do 2 by solving')

# ---- We Do ----------------------------------------------------------------
W1 = [('mul', 5), ('sub', 2)]
eq(run(W1, 4), 18, 'We Do 1'); eq((4 - 2) * 5, 10, 'We Do 1 student: did -2 first')
eq((2 * (n + 3)).subs(n, 5), 16, 'We Do 2 correct'); eq((2 * n + 3).subs(n, 5), 13, 'We Do 2 wrong is a different machine')
W3 = [('mul', 2), ('add', 7)]
eq(undo(W3, 19), 6, 'We Do 3'); eq(run(W3, 6), 19, 'We Do 3 check'); eq(R(19 + 7, 2), 13, 'We Do 3 student added 7')
W4 = [('div', 2), ('add', 6)]
eq(undo(W4, 10), 8, 'We Do 4'); eq(run(W4, 8), 10, 'We Do 4 check'); eq(10 * 2 - 6, 14, 'We Do 4 student undid in the wrong order')

# ---- Cold Call ------------------------------------------------------------
eq(run([('mul', 6), ('sub', 5)], 8), 43, 'CC1')
eq(3 * (n + 4), 3 * (n + 4), 'CC2 rule')
eq(undo([('mul', 5), ('add', 2)], 37), 7, 'CC3'); eq(5 * 7 + 2, 37, 'CC3 check')
eq(undo([('div', 4), ('add', 9)], 14), 20, 'CC4'); eq(R(20, 4) + 9, 14, 'CC4 check')
eq(solve(Eq(2 * (n - 3), 18), n), [12], 'CC5'); eq(2 * (12 - 3), 18, 'CC5 check')
A = [('mul', 3), ('add', 2)]; B = [('add', 2), ('mul', 3)]
eq((run(A, 10), run(B, 10), run(B, 10) - run(A, 10)), (32, 36, 4), 'CC6')

# ---- Plenary ---------------------------------------------------------------
eq(expand(3 * (n + 2)) == 3 * n + 2, False, 'PL1: x3 then +2 is not 3(n + 2)')
eq(run(B, 5) == 3 * (5 + 2), True, 'PL2: +2 then x3 is 3(n + 2)')
eq(solve(Eq(2 * n + 5, 17), n), [6], 'PL4: input 6'); eq(17 - 5 - 2, 10, 'PL5: the wrong path gives 10')

# ---- Worksheet -------------------------------------------------------------
eq(run([('mul', 5), ('add', 3)], 6), 33, 'WS1')
eq(run([('div', 3), ('sub', 2)], 21), 5, 'WS2')
eq(4 * n - 5, 4 * n - 5, 'WS3 rule')
eq((3 * n + 4).subs(n, 9), 31, 'WS4')
eq(5 * (n + 3), 5 * (n + 3), 'WS5 rule')
eq(undo([('mul', 4), ('add', 7)], 39), 8, 'WS6'); eq(4 * 8 + 7, 39, 'WS6 check')
eq(solve(Eq(2 * (n - 5), 14), n), [12], 'WS7'); eq(2 * (12 - 5), 14, 'WS7 check')
eq((run([('mul', 3), ('add', 4)], 5), run([('add', 4), ('mul', 3)], 5)), (19, 27), 'WS8')
eq(solve(Eq(3 * n - 8, n), n), [4], 'WS9'); eq(3 * 4 - 8, 4, 'WS9 check')
pairs = {2: 7, 5: 16, 8: 25}
sol = solve([Eq(2 * symbols('a') + symbols('b'), 7), Eq(5 * symbols('a') + symbols('b'), 16)], symbols('a b'))
eq(sol, {symbols('a'): 3, symbols('b'): 1}, 'WS10 fit from two pairs')
eq(all(3 * k + 1 == v for k, v in pairs.items()), True, 'WS10 the third pair agrees'); eq(3 * 20 + 1, 61, 'WS10 n = 20')

print(f'{checks} sympy checks passed')

"""
Helpers for the Earth Resources revision game's question bank (build/earth-resources-bank.py). Every item says where in the unit its facts come from
(`src`), so the review can point a student back to the lesson. Nothing here is a fact: the facts are in the bank files, and every one of them is
taken from the six decks (What The Land Gives Us, Losing The Soil, Cities And What Can Be Done, What The Earth Gives Us, Making It Last, Resource
Depletion).
"""


def W(text, tag, msg):
    """a wrong option: its text, the named mistake it stands for, and what to tell the student"""
    return {'t': text, 'tag': tag, 'm': msg}


def mc(stem, right, wrongs, explain, src):
    assert len(wrongs) == 3, stem
    return {'stem': stem, 'right': right, 'wrongs': [W(*w) for w in wrongs], 'explain': explain, 'src': src}


def assign(stem, rows, options, explain, src, tag, note=None):
    """rows: [(text, answer)]; every answer is one of `options`. A select per row."""
    assert all(a in options for _, a in rows), stem
    return {'stem': stem, 'rows': [{'t': t, 'a': a} for t, a in rows], 'options': options, 'explain': explain, 'src': src, 'tag': tag, 'note': note}


def order(stem, items, explain, src, tag, first='first', last='last'):
    """items: the correct order, first to last"""
    return {'stem': stem, 'items': items, 'explain': explain, 'src': src, 'tag': tag, 'first': first, 'last': last}


def build(stem, right, distractors, draw, explain, src, tag):
    """tap-all-that-apply: `right` always shown, `draw` distractors drawn from `distractors`"""
    return {'stem': stem, 'right': right, 'distractors': distractors, 'draw': draw, 'explain': explain, 'src': src, 'tag': tag}


def written(stem, points, model, src, tips=None):
    """a self-marked written answer: `points` is [(mark point, what to do next time if it was missed)]"""
    return {'stem': stem, 'marks': len(points), 'points': [{'t': t, 'miss': m} for t, m in points], 'model': model, 'src': src}


def tpl(name):
    """a numeric template that the game builds itself (the formulas are in the game, and re-derived by build/check-earth-resources-game.py)"""
    return {'tpl': name}


def slot(strand, skill, kind, pool):
    return {'strand': strand, 'skill': skill, 'kind': kind, 'pool': pool}

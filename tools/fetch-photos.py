#!/usr/bin/env python3
"""
Real photographs from Wikimedia Commons, for the decks and worksheets (CLAUDE.md, "Media": a photograph first).

Two jobs:

  python3 tools/fetch-photos.py search "domestic dog" [more queries...]
      Lists CC / public-domain candidates for each query and writes a numbered contact sheet to
      tools/.photo-search/<query>.png, so the pictures can be LOOKED AT before one is chosen.

  python3 tools/fetch-photos.py fetch [key ...]
      Downloads every photo listed in assets/photos/PHOTOS.tsv (or just the keys named), square-crops it
      to 800 x 800 and saves assets/photos/<key>.jpg. Writes assets/photos/SOURCES.tsv: the Commons file,
      the author and the licence of every photo, so where each one came from is never lost (there is no
      credits slide, CLAUDE.md).

PHOTOS.tsv columns: key, Commons file name (without "File:"), crop. The crop is "cx,cy,size" as fractions of
the image (centre x, centre y, side as a fraction of the shorter edge); empty means a centred square; "fit" keeps the
whole picture and pads it to a square with white (for a wide subject, such as a fish, on a plain background).

A file whose licence is not CC (BY, BY-SA, CC0) or public domain is refused.

SECOND SOURCE: Openverse (openverse.org, an index of openly licensed images, mostly Flickr). Commons rate-limits the
build machine's shared address hard (HTTP 429), so most of Unit 4 came from here:

  python3 tools/fetch-photos.py search-ov "glass of water"      # contact sheet, numbered, with Openverse ids
  PHOTOS.tsv: key <tab> ov:<openverse id> <tab> crop            # fetched the same way, same licence check
"""
import json, pathlib, sys, urllib.parse, urllib.request, urllib.error, io, csv, re, time

ROOT = pathlib.Path(__file__).parent.parent
OUT = ROOT / 'assets' / 'photos'
SEARCH = pathlib.Path(__file__).parent / '.photo-search'
API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'LessonToolkit/1.0 (classroom lesson builder; contact via github.com/chuka1000/teaching)'}
SIZE = 800


PAUSE = 1.5     # seconds between requests: Commons rate-limits (HTTP 429), and the build machine shares its address


def get(url, tries=6):
    """Polite GET: pause between requests, and back off (honouring Retry-After) when Commons says too many."""
    for i in range(tries):
        try:
            time.sleep(PAUSE)
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if i == tries - 1 or e.code not in (429, 500, 502, 503, 504):
                raise
            time.sleep(max(int(e.headers.get('Retry-After') or 0), 20 * 2 ** i))
        except OSError:
            if i == tries - 1:
                raise
            time.sleep(3 * 2 ** i)


def api(**params):
    params.update(format='json', formatversion='2')
    return json.loads(get(API + '?' + urllib.parse.urlencode(params)))


def licence_ok(meta):
    lic = (meta.get('LicenseShortName', {}) or {}).get('value', '')
    return bool(re.search(r'^(CC BY|CC-BY|CC0|Public domain|PD)', lic, re.I)), lic


def strip(html):
    return re.sub(r'<[^>]+>', '', html or '').strip()


def info(titles, width):
    """imageinfo for File: titles, with a thumbnail URL at `width`."""
    d = api(action='query', titles='|'.join(titles), prop='imageinfo', iiprop='url|extmetadata|size|mime', iiurlwidth=width)
    return d['query']['pages']


OV = 'https://api.openverse.org/v1/images/'
OV_LICENCES = {'by': 'CC BY', 'by-sa': 'CC BY-SA', 'cc0': 'CC0', 'pdm': 'Public domain'}


def ov_meta(r):
    """An Openverse result as (full url, licence text, author, landing page)."""
    lic = OV_LICENCES.get(r.get('license', ''), '')
    if lic and r.get('license_version') and lic not in ('CC0', 'Public domain'):
        lic = f"{lic} {r['license_version']}"
    return r['url'], lic, (r.get('creator') or '')[:120], r.get('foreign_landing_url') or ''


def search_ov(query, n=12):
    from PIL import Image, ImageDraw, ImageFont
    d = json.loads(get(OV + '?' + urllib.parse.urlencode({'q': query, 'license': 'by,by-sa,cc0,pdm', 'page_size': 20})))
    keep = [r for r in d.get('results', []) if min(r.get('width') or 0, r.get('height') or 0) >= 600
            and 'wikimedia' not in (r.get('url') or '')][:n]
    SEARCH.mkdir(exist_ok=True)
    font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', 18)
    cols, cell = 4, 300
    sheet = Image.new('RGB', (cols * cell, max(1, (len(keep) + cols - 1) // cols) * (cell + 30)), 'white')
    draw = ImageDraw.Draw(sheet)
    lines = []
    for i, r in enumerate(keep):
        url, lic, author, landing = ov_meta(r)
        small = re.sub(r'_[bco]\.jpg$', '_n.jpg', url) if 'staticflickr' in url else url    # Flickr's 320 px copy for the sheet
        try:
            im = Image.open(io.BytesIO(get(small))).convert('RGB')
        except Exception:
            continue
        im.thumbnail((cell - 10, cell - 10))
        x, y = (i % cols) * cell, (i // cols) * (cell + 30)
        sheet.paste(im, (x + 5, y + 5))
        draw.text((x + 8, y + cell - 2), f'{i}  {lic}', fill='black', font=font)
        lines.append(f'{i:2d}  {lic:16s} {r["width"]}x{r["height"]}  ov:{r["id"]}  {(r.get("title") or "")[:60]}')
    name = 'ov-' + re.sub(r'[^a-z0-9]+', '-', query.lower()).strip('-')
    sheet.save(SEARCH / f'{name}.png')
    (SEARCH / f'{name}.txt').write_text('\n'.join(lines) + '\n')
    print('\n'.join(lines))
    print(f'-> {SEARCH / (name + ".png")}')


def search(query, n=12):
    from PIL import Image, ImageDraw, ImageFont
    d = api(action='query', generator='search', gsrsearch=f'{query} filetype:bitmap', gsrnamespace=6, gsrlimit=40,
            prop='imageinfo', iiprop='url|extmetadata|size|mime', iiurlwidth=250)
    pages = sorted(d.get('query', {}).get('pages', []), key=lambda p: p.get('index', 0))
    keep = []
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        ok, lic = licence_ok(ii.get('extmetadata', {}))
        if not ok or ii.get('mime') not in ('image/jpeg', 'image/png'):
            continue
        if min(ii.get('width', 0), ii.get('height', 0)) < 600:
            continue
        keep.append((p['title'][5:], lic, ii))
        if len(keep) == n:
            break
    SEARCH.mkdir(exist_ok=True)
    font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', 18)
    cols, cell = 4, 300
    sheet = Image.new('RGB', (cols * cell, ((len(keep) + cols - 1) // cols) * (cell + 30)), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, (title, lic, ii) in enumerate(keep):
        try:
            im = Image.open(io.BytesIO(get(ii['thumburl']))).convert('RGB')
        except Exception:
            continue
        im.thumbnail((cell - 10, cell - 10))
        x, y = (i % cols) * cell, (i // cols) * (cell + 30)
        sheet.paste(im, (x + 5, y + 5))
        draw.text((x + 8, y + cell - 2), f'{i}  {lic}', fill='black', font=font)
        print(f'{i:2d}  {lic:16s} {ii["width"]}x{ii["height"]}  {title}')
    name = re.sub(r'[^a-z0-9]+', '-', query.lower()).strip('-')
    sheet.save(SEARCH / f'{name}.png')
    print(f'-> {SEARCH / (name + ".png")}')


def fetch(keys):
    from PIL import Image
    rows = [r for r in csv.reader(open(OUT / 'PHOTOS.tsv'), delimiter='\t') if r and not r[0].startswith('#')]
    want = [r for r in rows if not keys or r[0] in keys]
    missing = set(keys) - {r[0] for r in rows}
    if missing:
        sys.exit(f'not in PHOTOS.tsv: {", ".join(sorted(missing))}')
    src = {}
    if (OUT / 'SOURCES.tsv').exists():
        src = {r[0]: r for r in csv.reader(open(OUT / 'SOURCES.tsv'), delimiter='\t') if r and r[0] != 'key'}
    if not keys:   # with no keys named, skip photos already fetched from the same file with the same crop
        want = [r for r in want if not ((OUT / f'{r[0]}.jpg').exists() and r[0] in src and src[r[0]][1] == r[1] and src[r[0]][5:6] == [(r[2] if len(r) > 2 else '').strip()])]
    meta = {}
    commons = [r for r in want if not r[1].startswith('ov:')]
    for i in range(0, len(commons), 40):      # one API call per 40 files, not one each
        for pg in info([f'File:{r[1]}' for r in commons[i:i + 40]], 1280):
            meta[pg['title'][5:]] = (pg.get('imageinfo') or [None])[0]
    norm = lambda x: x.replace('_', ' ')
    meta = {norm(k): v for k, v in meta.items()}
    for key, title, *rest in want:
        crop = (rest[0] if rest else '').strip()
        if title.startswith('ov:'):
            r = json.loads(get(f'{OV}{title[3:]}/'))
            url, lic, author, landing = ov_meta(r)
            if not lic:
                sys.exit(f'{key}: licence "{r.get("license")}" is not CC or public domain: {title}')
            ii = {'thumburl': url, 'descriptionurl': landing, 'extmetadata': {'Artist': {'value': author}}}
        else:
            ii = meta.get(norm(title))
            if not ii:
                sys.exit(f'{key}: no such file on Commons: {title}')
            ok, lic = licence_ok(ii['extmetadata'])
            if not ok:
                sys.exit(f'{key}: licence "{lic}" is not CC or public domain: {title}')
        im = Image.open(io.BytesIO(get(ii['thumburl']))).convert('RGB')
        w, h = im.size
        if crop == 'fit':      # the whole picture, on white: for a wide subject on a plain background
            from PIL import ImageOps
            im = ImageOps.pad(im, (SIZE, SIZE), method=Image.LANCZOS, color=(255, 255, 255))
        else:
            cx, cy, s = (float(v) for v in crop.split(',')) if crop else (0.5, 0.5, 1.0)
            side = s * min(w, h)
            x0 = min(max(cx * w - side / 2, 0), w - side)
            y0 = min(max(cy * h - side / 2, 0), h - side)
            im = im.crop((round(x0), round(y0), round(x0 + side), round(y0 + side))).resize((SIZE, SIZE), Image.LANCZOS)
        im.save(OUT / f'{key}.jpg', quality=86)
        author = strip(ii['extmetadata'].get('Artist', {}).get('value', ''))[:120]
        src[key] = [key, title, author, lic, ii['descriptionurl'], crop]
        print(f'{key:12s} {lic:14s} {title}', flush=True)
        save_sources(src)       # after every photo, so an interrupted run keeps what it fetched


def save_sources(src):
    with open(OUT / 'SOURCES.tsv', 'w', newline='') as f:
        wr = csv.writer(f, delimiter='\t', lineterminator='\n')
        wr.writerow(['key', 'file', 'author', 'licence', 'url', 'crop'])
        for k in sorted(src):
            wr.writerow(src[k])


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('search', 'search-ov', 'fetch'):
        sys.exit(__doc__)
    if sys.argv[1] == 'search':
        for q in sys.argv[2:]:
            search(q)
    elif sys.argv[1] == 'search-ov':
        for q in sys.argv[2:]:
            search_ov(q)
            time.sleep(3.5)      # Openverse allows 20 searches a minute without a key
    else:
        fetch(sys.argv[2:])

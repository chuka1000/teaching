/**
 * Y8 Science, Unit 3 Prokaryotes: the two cell diagrams on a slide (drawn by build/media/prokaryotes_cells.py), with REAL text labels and
 * leader lines (TEMPLATE.md: labels on the diagram itself, never a key). Each part is a group a spec can bring in on a click:
 *
 *   const D = require('./prokaryotes-diagram')(K);
 *   const g = D.place(s, 'prok', { x: 1.28, y: 1.80, w: 7.2 }, [
 *     { part: 'cell wall', layers: ['prok_wall'] }, { part: 'plasmid', layers: ['prok_plasmid'], sub: 'a small spare loop of DNA', hi: true }, ...
 *   ]);                                                  // returns { cell wall: ['ly_prok_wall', 'lb_...', 'ln_...', 'dt_...'], ... }
 *
 * Prokaryote labels sit above and below the cell (inside the picture's own empty bands). Eukaryote labels sit in a left and a right column,
 * each with a one-line job under its name.
 */
const fs = require('fs');
const path = require('path');
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'pictures', 'prok-cells.json'), 'utf8'));
const PICS = path.join(__dirname, '..', 'assets', 'pictures');
const slug = (x) => x.replace(/[^a-z0-9]+/gi, '_').toLowerCase();

module.exports = function diagram(K) {
  const { S, C, F } = K;

  function line(s, x1, y1, x2, y2, name) {
    const dx = x2 - x1, dy = y2 - y1;
    s.addShape(S.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(dx), h: Math.abs(dy), flipV: dx * dy < 0, line: { color: C.dark, width: 1.5 }, objectName: name });
  }

  /**
   * kind: 'prok' or 'euk'; box: { x, y, w } (the canvas is 3:2); items: [{ part, layers, sub?, hi?, text? }].
   * opts.cols (euk): { left: [x, w], right: [x, w] } the label columns, in inches.
   */
  function place(s, kind, box, items, opts = {}) {
    const sc = box.w / J.canvas[0];
    const groups = {};
    for (const it of items) {
      const key = slug(it.part), A = J.anchors[kind][it.part];
      const g = (groups[it.part] = []);
      (it.layers || []).forEach((ly) => {
        const nm = `ly_${ly}`;
        s.addImage({ path: path.join(PICS, `${ly}.png`), x: box.x, y: box.y, w: box.w, h: box.w * J.canvas[1] / J.canvas[0], objectName: nm });
        g.push(nm);
      });
      if (it.noLabel) continue;
      const ax = box.x + A.ax * sc, ay = box.y + A.ay * sc;
      const text = it.text || it.part;
      let bx, by, bw, bh, align, lx, ly;
      if (kind === 'prok') {
        bw = it.w || 2.0; bh = it.sub ? 0.64 : 0.38;
        const cx = box.x + (it.lx ?? A.lx) * sc, cy = box.y + A.ly * sc;
        bx = cx - bw / 2;
        if (A.side === 'T') { by = cy - 0.19; lx = cx; ly = by + bh + 0.02; }
        else { by = cy - 0.19; lx = cx; ly = by - 0.02; }
        align = 'center';
      } else {
        const col = A.side === 'L' ? opts.cols.left : opts.cols.right;
        bw = col[1]; bh = it.sub ? 0.78 : 0.40; bx = col[0];
        by = box.y + A.ly_slide * (box.w * J.canvas[1] / J.canvas[0] / J.canvas[1]) - bh / 2;
        align = A.side === 'L' ? 'right' : 'left';
        lx = A.side === 'L' ? bx + bw + 0.06 : bx - 0.06; ly = by + 0.20;
      }
      const runs = [{ text, options: { bold: true, fontSize: it.size || 17, color: C.dark, breakLine: !!it.sub } }];
      if (it.sub) runs.push({ text: it.sub, options: { fontSize: 12.5, italic: true, color: C.inkSoft } });
      s.addText(runs, {
        shape: it.hi ? S.roundRect : undefined, rectRadius: 0.08,
        x: bx, y: by, w: bw, h: bh, align, valign: it.sub ? 'top' : 'middle', margin: it.hi ? [3, 6, 3, 6] : 0, lineSpacing: it.sub ? 16 : undefined,
        fill: it.hi ? { color: C.accent } : undefined, line: it.hi ? { color: C.accentInk, width: 1.2 } : undefined, objectName: `lb_${kind}_${key}`,
      });
      g.push(`lb_${kind}_${key}`);
      line(s, lx, ly, ax, ay, `ln_${kind}_${key}`); g.push(`ln_${kind}_${key}`);
      s.addShape(S.ellipse, { x: ax - 0.05, y: ay - 0.05, w: 0.10, h: 0.10, fill: { color: C.dark }, line: { color: C.dark, width: 0 }, objectName: `dt_${kind}_${key}` });
      g.push(`dt_${kind}_${key}`);
    }
    return groups;
  }
  return { place, slug };
};
module.exports.slug = slug;

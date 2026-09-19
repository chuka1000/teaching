/**
 * Native-shape geometry helpers.
 *
 * pptxgenjs rotates a shape about its own centre, so drawing a leaning strut by
 * guessing x/y/rotate is how you end up with prop roots floating in mid-air.
 * segment() takes the two endpoints you actually want and works the rest out.
 */

/**
 * A thin rectangle drawn from (x1,y1) to (x2,y2).
 *
 * A vertical rect's "down" vector is (0,1). PowerPoint's positive rotation is
 * clockwise on screen (y pointing down), which maps (0,1) -> (-sin φ, cos φ).
 * Setting that proportional to (dx,dy) gives φ = atan2(-dx, dy).
 */
function segment(pptx, slide, x1, y1, x2, y2, thickness, colour, objectName) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const rot = (Math.atan2(-dx, dy) * 180) / Math.PI;
  slide.addShape(pptx.ShapeType.rect, {
    x: cx - thickness / 2, y: cy - len / 2, w: thickness, h: len,
    rotate: rot, fill: { color: colour }, line: { color: colour, width: 0 },
    objectName,
  });
  return { len, rot };
}

/**
 * A mangrove tree: canopy blobs, a trunk that reaches the mud, prop roots that
 * actually touch both the trunk and the ground, and pneumatophores poking up out
 * of the mud (which is the detail that makes it read as a mangrove and not a lollipop).
 *
 * o = { cx, canopyTop, trunkTop, mudLine, scale, canopyA, canopyB, woodColour, prefix }
 */
function mangrove(pptx, slide, o) {
  const s = o.scale ?? 1;
  const p = o.prefix;
  const wood = o.woodColour;
  const names = [];
  const push = (n) => { names.push(n); return n; };

  // canopy — five ellipses of different sizes at different offsets. Three
  // concentric ones read as a lily pad; an irregular clump reads as foliage.
  const blob = (dx, dy, w, h, col, i) => slide.addShape(pptx.ShapeType.ellipse, {
    x: o.cx + dx * s, y: o.canopyTop + dy * s, w: w * s, h: h * s,
    fill: { color: col }, line: { color: col, width: 0 }, objectName: push(`${p}_leaf${i}`),
  });
  blob(-1.34, 0.44, 1.42, 0.90, o.canopyB, 0);
  blob( 0.02, 0.48, 1.30, 0.86, o.canopyB, 1);
  blob(-0.96, 0.14, 1.32, 1.00, o.canopyA, 2);
  blob(-0.10, 0.00, 1.26, 1.04, o.canopyA, 3);
  blob(-0.54, 0.36, 1.18, 0.94, o.canopyA, 4);

  // trunk — from inside the canopy down to the mud line, so it is visibly attached at both ends
  const tw = 0.17 * s;
  slide.addShape(pptx.ShapeType.rect, {
    x: o.cx - tw / 2, y: o.trunkTop, w: tw, h: o.mudLine - o.trunkTop,
    fill: { color: wood }, line: { color: wood, width: 0 }, objectName: push(`${p}_trunk`),
  });

  // prop roots — four struts from a point on the trunk out to the mud line
  const forkY = o.mudLine - 0.92 * s;
  [[-0.86, 0], [-0.42, 1], [0.42, 2], [0.86, 3]].forEach(([spread, i]) => {
    segment(pptx, slide, o.cx, forkY - Math.abs(spread) * 0.32 * s,
            o.cx + spread * s, o.mudLine + 0.04 * s,
            0.085 * s, wood, push(`${p}_root${i}`));
  });

  // pneumatophores — the little breathing spikes that give mangrove mud its look
  [-1.32, -1.08, 1.10, 1.36].forEach((dx, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: o.cx + dx * s - 0.028 * s, y: o.mudLine - 0.22 * s, w: 0.056 * s, h: 0.24 * s,
      fill: { color: wood }, line: { color: wood, width: 0 }, objectName: push(`${p}_pneu${i}`),
    });
  });

  return names;
}

module.exports = { segment, mangrove };

/**
 * A block arrow from (x1,y1) to (x2,y2).
 *
 * Food-chain arrows encode a rule — energy travels THIS way — so the head must
 * land on the eater. A rightArrow points along +x before rotation, and
 * PowerPoint rotates clockwise on a y-down canvas, so the on-screen bearing is
 * simply atan2(dy, dx). Build the box centred on the midpoint, then rotate.
 */
function arrow(pptx, slide, x1, y1, x2, y2, o = {}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const th = o.thickness ?? 0.30;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const rot = (Math.atan2(dy, dx) * 180) / Math.PI;
  slide.addShape(pptx.ShapeType.rightArrow, {
    x: cx - len / 2, y: cy - th / 2, w: len, h: th,
    rotate: rot,
    fill: { color: o.colour },
    line: { color: o.line || o.colour, width: o.lineWidth ?? 0 },
    objectName: o.objectName,
  });
  return { len, rot };
}

module.exports.arrow = arrow;

/**
 * A strobe trail: dots at growing intervals, the way a ticker tape or a
 * multi-flash photograph records accelerated motion. Motif for the A.1
 * Kinematics decks.
 *
 * Returns the x of the last dot so a caller can put an arrowhead after it.
 */
function strobe(pptx, slide, o) {
  const n = o.n ?? 7;
  const r = o.r ?? 0.17;
  let x = o.x0;
  let gap = o.gap0 ?? 0.42;
  const xs = [];
  for (let i = 0; i < n; i++) {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x - r / 2, y: o.y - r / 2, w: r, h: r,
      fill: { color: i === n - 1 ? (o.lastColour || o.colour) : o.colour },
      line: { color: o.colour, width: 0 },
      objectName: `${o.prefix}_dot${i}`,
    });
    xs.push(x);
    x += gap;
    gap *= o.growth ?? 1.22;
  }
  return xs;
}

module.exports.strobe = strobe;

/**
 * A scatter of observations with a trend line through them — induction drawn
 * as a picture. Motif for the Y7 "What is science?" deck.
 *
 * Dots are jittered about the line by a fixed pseudo-random sequence rather
 * than Math.random, so the same spec always produces the same slide.
 */
function scatter(pptx, slide, o) {
  const n = o.n ?? 12;
  const r = o.r ?? 0.15;
  const jit = [0.34, -0.52, 0.18, -0.28, 0.61, -0.14, 0.42, -0.66, 0.09,
               -0.39, 0.55, -0.21, 0.30, -0.47, 0.12];
  const names = [];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0 : i / (n - 1);
    const x = o.x0 + f * (o.x1 - o.x0);
    const y = o.y0 + f * (o.y1 - o.y0) + jit[i % jit.length] * (o.spread ?? 0.5);
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x - r / 2, y: y - r / 2, w: r, h: r,
      fill: { color: o.colour },
      line: { color: o.colour, width: 0 },
      objectName: `${o.prefix}_obs${i}`,
    });
    names.push(`${o.prefix}_obs${i}`);
  }
  return names;
}

module.exports.scatter = scatter;

/**
 * A row of observation dots feeding an arrow into a single conclusion.
 * Motif for the Y7 "World of Science" decks: many individual observations,
 * one general rule. Pass `oddIndex` to make one dot the exception — that is
 * the black swan, and it is why the rule is never safe.
 */
function observations(pptx, slide, o) {
  const n = o.n ?? 9;
  const r = o.r ?? 0.22;
  const gap = o.gap ?? 0.12;
  for (let i = 0; i < n; i++) {
    const odd = o.oddIndex === i;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: o.x0 + i * (r + gap), y: o.y - r / 2, w: r, h: r,
      fill: { color: odd ? (o.oddColour || o.colour) : o.colour },
      line: { color: odd ? (o.oddColour || o.colour) : o.colour, width: 0 },
      objectName: `${o.prefix}_obs${i}`,
    });
  }
  return o.x0 + n * (r + gap) - gap;
}

module.exports.observations = observations;

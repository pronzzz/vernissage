import { createNoise2D } from 'simplex-noise';
import { byLightness, withAlpha } from '@/lib/palettes';

// Every artwork on the site is drawn here, from a seed and the live palette.
// Same seed + same palette = the same picture, so works are "collectable".

export type ArtKind = 'flow' | 'grid' | 'orbit' | 'strata' | 'bloom' | 'weave' | 'shards' | 'dots';
export type Ground = 'dark' | 'light';

export interface ArtSpec {
  kind: ArtKind;
  seed: number;
  ground?: Ground;
}

export const KIND_LABEL: Record<ArtKind, string> = {
  flow: 'Flow field',
  grid: 'Bauhaus grid',
  orbit: 'Orbital',
  strata: 'Strata',
  bloom: 'Bloom',
  weave: 'Op-art weave',
  shards: 'Shards',
  dots: 'Halftone',
};

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Ctx = CanvasRenderingContext2D;
type Rand = () => number;
interface Pal {
  bg: string;
  inks: string[]; // never includes bg
  all: string[];
}

const TAU = Math.PI * 2;
const pick = <T,>(r: Rand, arr: T[]) => arr[Math.floor(r() * arr.length)];

function makePal(colors: string[], ground: Ground): Pal {
  const sorted = byLightness(colors);
  const bg = ground === 'dark' ? sorted[0] : sorted[sorted.length - 1];
  return { bg, inks: sorted.filter((c) => c !== bg), all: sorted };
}

// ---- renderers ----------------------------------------------------------

function flow(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const noise = createNoise2D(r);
  const s = Math.min(w, h);
  const freq = 0.0018 + r() * 0.0025;
  const twist = 1.5 + r() * 2.5;
  const count = Math.floor((w * h) / 140);
  const steps = 40 + Math.floor(r() * 50);
  const step = s / 260;
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    let x = r() * w;
    let y = r() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let k = 0; k < steps; k++) {
      const a = noise((x / s) * 1000 * freq, (y / s) * 1000 * freq) * Math.PI * twist;
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      ctx.lineTo(x, y);
    }
    const band = (noise(x * 0.002, y * 0.002) + 1) / 2;
    ctx.strokeStyle = withAlpha(p.inks[Math.floor(band * p.inks.length) % p.inks.length], 0.35 + r() * 0.5);
    ctx.lineWidth = (0.6 + r() * 2.2) * (s / 520);
    ctx.stroke();
  }
}

function grid(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const cols = 4 + Math.floor(r() * 4);
  const size = w / cols;
  const rows = Math.ceil(h / size);
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * size;
      const y = gy * size;
      const [c1, c2] = [pick(r, p.all), pick(r, p.inks)];
      ctx.fillStyle = c1;
      ctx.fillRect(x, y, size + 1, size + 1);
      ctx.fillStyle = c2 === c1 ? p.bg : c2;
      const kind = Math.floor(r() * 6);
      const rot = Math.floor(r() * 4) * (Math.PI / 2);
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.rotate(rot);
      ctx.translate(-size / 2, -size / 2);
      ctx.beginPath();
      if (kind === 0) {
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, size, 0, Math.PI / 2);
      } else if (kind === 1) {
        ctx.arc(size / 2, size / 2, size * 0.36, 0, TAU);
      } else if (kind === 2) {
        ctx.arc(size / 2, 0, size / 2, 0, Math.PI);
      } else if (kind === 3) {
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
      } else if (kind === 4) {
        ctx.rect(0, 0, size / 2, size);
      } else {
        ctx.arc(size / 2, size / 2, size * 0.42, 0, TAU);
        ctx.arc(size / 2, size / 2, size * 0.2, 0, TAU, true);
      }
      ctx.fill();
      ctx.restore();
    }
  }
}

function orbit(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const cx = w * (0.3 + r() * 0.4);
  const cy = h * (0.3 + r() * 0.4);
  const max = Math.hypot(w, h) * 0.7;
  const sun = pick(r, p.inks);
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * (0.08 + r() * 0.08), 0, TAU);
  ctx.fill();
  let rad = Math.min(w, h) * 0.2;
  while (rad < max) {
    const lw = Math.min(w, h) * (0.008 + r() * 0.04);
    const arcs = 1 + Math.floor(r() * 3);
    for (let a = 0; a < arcs; a++) {
      const start = r() * TAU;
      const len = (0.3 + r() * 0.65) * (TAU / arcs);
      ctx.strokeStyle = pick(r, p.inks);
      ctx.lineWidth = lw;
      ctx.lineCap = r() > 0.5 ? 'round' : 'butt';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, start, start + len);
      ctx.stroke();
    }
    if (r() > 0.75) {
      const a = r() * TAU;
      ctx.fillStyle = pick(r, p.inks);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, lw * 1.6, 0, TAU);
      ctx.fill();
    }
    rad += lw * (1.6 + r() * 2.4);
  }
}

function strata(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const noise = createNoise2D(r);
  const layers = 6 + Math.floor(r() * 6);
  if (r() > 0.4) {
    ctx.fillStyle = pick(r, p.inks);
    ctx.beginPath();
    ctx.arc(w * (0.2 + r() * 0.6), h * (0.15 + r() * 0.2), Math.min(w, h) * (0.1 + r() * 0.1), 0, TAU);
    ctx.fill();
  }
  const amp = h * (0.03 + r() * 0.08);
  for (let i = 0; i < layers; i++) {
    const base = h * (0.3 + (i / layers) * 0.75);
    ctx.fillStyle = p.inks[i % p.inks.length];
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += w / 120) {
      const y = base + noise(x * 0.0025, i * 0.7) * amp + noise(x * 0.012, i * 3.1) * amp * 0.25;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }
}

function bloom(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const circles: [number, number, number][] = [];
  const maxR = Math.min(w, h) * (0.12 + r() * 0.12);
  const minR = Math.min(w, h) * 0.008;
  let tries = 0;
  while (tries < 5000 && circles.length < 600) {
    tries++;
    const x = r() * w;
    const y = r() * h;
    let rad = maxR;
    for (const [cx, cy, cr] of circles) {
      rad = Math.min(rad, Math.hypot(x - cx, y - cy) - cr - minR * 0.6);
      if (rad < minR) break;
    }
    if (rad < minR) continue;
    circles.push([x, y, rad]);
  }
  for (const [x, y, rad] of circles) {
    const style = r();
    const c = pick(r, p.inks);
    if (style < 0.5) {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, TAU);
      ctx.fill();
      if (rad > minR * 4) {
        ctx.fillStyle = pick(r, p.all);
        ctx.beginPath();
        ctx.arc(x + rad * 0.15, y - rad * 0.15, rad * 0.45, 0, TAU);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = c;
      ctx.lineWidth = Math.max(1, rad * 0.12);
      for (let k = rad; k > ctx.lineWidth; k -= ctx.lineWidth * 2.2) {
        ctx.beginPath();
        ctx.arc(x, y, k - ctx.lineWidth / 2, 0, TAU);
        ctx.stroke();
      }
    }
  }
}

function weave(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const noise = createNoise2D(r);
  const bands = 24 + Math.floor(r() * 30);
  const bw = w / bands;
  const amp = bw * (1 + r() * 4);
  const freq = 0.002 + r() * 0.006;
  const colors = [pick(r, p.inks), pick(r, p.inks)];
  if (colors[0] === colors[1]) colors[1] = p.bg;
  for (let i = -4; i < bands + 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? colors[0] : colors[1];
    ctx.beginPath();
    const x0 = i * bw;
    for (let y = 0; y <= h; y += h / 160) {
      ctx.lineTo(x0 + noise(i * 0.05, y * freq) * amp + Math.sin(y * 0.01 + i * 0.2) * amp * 0.3, y);
    }
    for (let y = h; y >= 0; y -= h / 160) {
      ctx.lineTo(x0 + bw + noise((i + 1) * 0.05, y * freq) * amp + Math.sin(y * 0.01 + (i + 1) * 0.2) * amp * 0.3, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  if (r() > 0.4) {
    ctx.fillStyle = pick(r, p.inks.filter((c) => !colors.includes(c)).concat(p.bg));
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.22, 0, TAU);
    ctx.fill();
  }
}

function shards(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  type Poly = [number, number][];
  let polys: Poly[] = [[[0, 0], [w, 0], [w, h], [0, h]]];
  const depth = 7 + Math.floor(r() * 4);
  for (let d = 0; d < depth; d++) {
    const next: Poly[] = [];
    for (const poly of polys) {
      if (r() < 0.15 && d > 2) {
        next.push(poly);
        continue;
      }
      const n = poly.length;
      const i = Math.floor(r() * n);
      let j = (i + 1 + Math.floor(r() * (n - 1))) % n;
      if (j === i) j = (i + 2) % n;
      const t1 = 0.3 + r() * 0.4;
      const t2 = 0.3 + r() * 0.4;
      const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const pA = lerp(poly[i], poly[(i + 1) % n], t1);
      const pB = lerp(poly[j], poly[(j + 1) % n], t2);
      const a: Poly = [pA];
      for (let k = (i + 1) % n; k !== (j + 1) % n; k = (k + 1) % n) a.push(poly[k]);
      a.push(pB);
      const b: Poly = [pB];
      for (let k = (j + 1) % n; k !== (i + 1) % n; k = (k + 1) % n) b.push(poly[k]);
      b.push(pA);
      next.push(a, b);
    }
    polys = next;
  }
  for (const poly of polys) {
    ctx.fillStyle = pick(r, p.all);
    ctx.beginPath();
    poly.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = p.bg;
  ctx.lineWidth = Math.min(w, h) * 0.006;
  for (const poly of polys) {
    ctx.beginPath();
    poly.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.stroke();
  }
}

function dots(ctx: Ctx, w: number, h: number, r: Rand, p: Pal) {
  const noise = createNoise2D(r);
  const cell = Math.min(w, h) / (28 + Math.floor(r() * 26));
  const f = 0.0015 + r() * 0.003;
  const rot = r() * 0.6 - 0.3;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rot);
  const ext = Math.hypot(w, h) / 2 + cell;
  for (let y = -ext; y < ext; y += cell) {
    for (let x = -ext; x < ext; x += cell) {
      const n = (noise(x * f, y * f) + 1) / 2;
      const n2 = (noise(x * f * 0.5 + 40, y * f * 0.5) + 1) / 2;
      const rad = (cell / 2) * Math.pow(n, 1.4) * 1.05;
      if (rad < 0.4) continue;
      ctx.fillStyle = p.inks[Math.floor(n2 * p.inks.length) % p.inks.length];
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

const RENDERERS: Record<ArtKind, (ctx: Ctx, w: number, h: number, r: Rand, p: Pal) => void> = {
  flow,
  grid,
  orbit,
  strata,
  bloom,
  weave,
  shards,
  dots,
};

// ---- grain --------------------------------------------------------------

let grainCanvas: HTMLCanvasElement | null = null;
function grain() {
  if (grainCanvas) return grainCanvas;
  const c = document.createElement('canvas');
  c.width = c.height = 160;
  const g = c.getContext('2d')!;
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  grainCanvas = c;
  return c;
}

/** Draws an artwork into a 2D context sized w×h (CSS pixels). */
export function paint(ctx: Ctx, w: number, h: number, spec: ArtSpec, colors: string[]) {
  const r = mulberry32(spec.seed);
  const pal = makePal(colors, spec.ground ?? 'dark');
  ctx.save();
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);
  RENDERERS[spec.kind](ctx, w, h, r, pal);
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(grain(), 'repeat')!;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Renders to an offscreen canvas (call .toDataURL() for <img>-based components). */
export function paintToCanvas(spec: ArtSpec, colors: string[], w: number, h: number, scale = 1) {
  const c = document.createElement('canvas');
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  paint(ctx, w, h, spec, colors);
  return c;
}

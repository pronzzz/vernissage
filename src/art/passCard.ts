import { hashString, mulberry32, paint, type ArtKind } from './engine';
import { byLightness } from '@/lib/palettes';

export interface PassInfo {
  name: string;
  discipline: string;
  city: string;
}

const KINDS: ArtKind[] = ['flow', 'orbit', 'bloom', 'shards', 'grid', 'strata', 'dots', 'weave'];
export const PASS_W = 640;
export const PASS_H = 900;

export async function drawPass(info: PassInfo, colors: string[]): Promise<string> {
  await Promise.all([
    document.fonts.load('400 80px "Instrument Serif"'),
    document.fonts.load('italic 400 80px "Instrument Serif"'),
    document.fonts.load('500 20px "JetBrains Mono Variable"'),
  ]).catch(() => {});

  const scale = 2;
  const c = document.createElement('canvas');
  c.width = PASS_W * scale;
  c.height = PASS_H * scale;
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);

  const seed = hashString(info.name.trim().toLowerCase() || 'guest');
  const r = mulberry32(seed);
  const kind = KINDS[seed % KINDS.length];
  const [dark, , , , light] = byLightness(colors);
  const W = PASS_W;
  const H = PASS_H;

  // artwork fills the top
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  paint(ctx, W, H * 0.62, { kind, seed, ground: r() > 0.5 ? 'dark' : 'light' }, colors);
  ctx.restore();

  // lower panel
  ctx.fillStyle = dark;
  ctx.fillRect(0, H * 0.62, W, H * 0.38);

  // header strip
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(28, 28, W - 56, 44);
  ctx.fillStyle = light;
  ctx.font = '500 15px "JetBrains Mono Variable", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('VERNISSAGE® PASS', 46, 50);
  ctx.textAlign = 'right';
  ctx.fillText('SEASON 04', W - 46, 50);
  ctx.textAlign = 'left';

  // name, auto-fitting
  const name = info.name.trim() || 'Your Name';
  let size = 84;
  ctx.font = `400 ${size}px "Instrument Serif", serif`;
  while (ctx.measureText(name).width > W - 80 && size > 34) {
    size -= 2;
    ctx.font = `400 ${size}px "Instrument Serif", serif`;
  }
  ctx.fillStyle = light;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(name, 40, H * 0.62 + 40 + size * 0.8);

  ctx.font = 'italic 400 30px "Instrument Serif", serif';
  ctx.globalAlpha = 0.75;
  ctx.fillText(info.discipline || 'Artist', 40, H * 0.62 + 60 + size * 0.8 + 18);
  ctx.globalAlpha = 1;

  // meta row
  ctx.font = '500 13px "JetBrains Mono Variable", monospace';
  ctx.globalAlpha = 0.6;
  const member = `Nº ${String(seed % 100000).padStart(5, '0')}`;
  ctx.fillText((info.city || 'Anywhere').toUpperCase(), 40, H - 46);
  ctx.fillText(member, 40, H - 26);
  ctx.globalAlpha = 1;

  // QR-ish code
  const cells = 11;
  const cs = 9;
  const qx = W - 40 - cells * cs;
  const qy = H - 40 - cells * cs;
  ctx.fillStyle = light;
  ctx.fillRect(qx - 8, qy - 8, cells * cs + 16, cells * cs + 16);
  ctx.fillStyle = dark;
  for (let y = 0; y < cells; y++)
    for (let x = 0; x < cells; x++) {
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      if (finder || r() > 0.52) ctx.fillRect(qx + x * cs, qy + y * cs, cs, cs);
    }

  return c.toDataURL('image/png');
}

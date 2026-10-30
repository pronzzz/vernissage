import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import { usePalette } from '@/state/palette';
import { byLightness, hexToRgb } from '@/lib/palettes';
import { mulberry32 } from './engine';

/**
 * The hero piece: a living flow field. Particles ride a slowly changing
 * noise wind; the cursor stirs a vortex into it. Colours follow the palette.
 */
export default function LiveField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { colors, motionPaused } = usePalette();
  const colorsRef = useRef(colors);
  const pausedRef = useRef(motionPaused);
  useEffect(() => {
    colorsRef.current = colors;
    pausedRef.current = motionPaused;
  }, [colors, motionPaused]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const noise = createNoise3D(mulberry32(31));
    const rand = mulberry32(7);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: { x: number; y: number; life: number; c: number; speed: number }[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let visible = true;
    let lastPal = '';

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(2400, Math.floor((w * h) / 520));
      particles = Array.from({ length: count }, () => ({
        x: rand() * w,
        y: rand() * h,
        life: rand() * 200,
        c: Math.floor(rand() * 4),
        speed: 0.6 + rand() * 1.4,
      }));
      lastPal = '';
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.y > 0 && mouse.y < r.height;
    };
    addEventListener('pointermove', onMove, { passive: true });

    let t = 0;
    let id = 0;
    let inks: string[] = [];
    let bgRgb = [0, 18, 28];

    const frame = () => {
      id = requestAnimationFrame(frame);
      const key = colorsRef.current.join();
      if (key !== lastPal) {
        const sorted = byLightness(colorsRef.current);
        bgRgb = hexToRgb('#00121C');
        inks = sorted.slice(1).map((c) => {
          const [r, g, b] = hexToRgb(c);
          return `rgba(${r},${g},${b},0.55)`;
        });
        ctx.fillStyle = '#00121C';
        ctx.fillRect(0, 0, w, h);
        lastPal = key;
        // when paused, paint a few hundred steps at once so a still image remains
        if (pausedRef.current) for (let k = 0; k < 160; k++) step(true);
      }
      if (!visible || pausedRef.current) return;
      step(false);
    };

    const step = (fast: boolean) => {
      t += 0.0016;
      ctx.fillStyle = `rgba(${bgRgb[0]},${bgRgb[1]},${bgRgb[2]},${fast ? 0.02 : 0.045})`;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1.1;
      const f = 0.0016;
      for (let c = 0; c < inks.length; c++) {
        ctx.strokeStyle = inks[c];
        ctx.beginPath();
        for (const p of particles) {
          if (p.c % inks.length !== c) continue;
          let a = noise(p.x * f, p.y * f, t) * Math.PI * 2.2;
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 32000) {
              // swirl around the cursor
              const k = 1 - d2 / 32000;
              a = a * (1 - k) + (Math.atan2(dy, dx) + Math.PI / 2) * k;
            }
          }
          const nx = p.x + Math.cos(a) * p.speed * 1.6;
          const ny = p.y + Math.sin(a) * p.speed * 1.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx, ny);
          p.x = nx;
          p.y = ny;
          p.life -= 1;
          if (p.life < 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
            p.x = rand() * w;
            p.y = rand() * h;
            p.life = 80 + rand() * 220;
          }
        }
        ctx.stroke();
      }
    };
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}

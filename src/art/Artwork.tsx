import { useEffect, useRef, useState } from 'react';
import { paint, type ArtSpec } from './engine';
import { usePalette } from '@/state/palette';
import { cn } from '@/lib/utils';

interface Props extends ArtSpec {
  className?: string;
  /** Override the live palette (e.g. for preview swatches). */
  colors?: string[];
  label?: string;
}

/**
 * A canvas that paints itself from a seed. It only renders once it is near
 * the viewport and repaints (debounced) when its size or the palette changes.
 */
export default function Artwork({ kind, seed, ground, className, colors, label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { colors: live } = usePalette();
  const palette = colors ?? live;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current!;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: '400px' });
    io.observe(el);
    let t: number;
    const ro = new ResizeObserver(([e]) => {
      clearTimeout(t);
      const { width, height } = e.contentRect;
      t = window.setTimeout(() => setSize({ w: Math.round(width), h: Math.round(height) }), 80);
    });
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  const key = palette.join();
  useEffect(() => {
    if (!visible || !size || size.w < 2 || size.h < 2) return;
    const id = requestAnimationFrame(() => {
      const c = canvas.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = size.w * dpr;
      c.height = size.h * dpr;
      const ctx = c.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(ctx, size.w, size.h, { kind, seed, ground }, palette);
      c.dataset.ready = '1';
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, size, key, kind, seed, ground]);

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-ink-3', className)} role="img" aria-label={label}>
      <canvas ref={canvas} className="art-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}

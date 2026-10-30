import { useEffect, useRef, useState } from 'react';

/**
 * Dot + trailing ring cursor. Any element with data-cursor="Label" swells the
 * ring and shows the label inside it (a classic awwwards gesture).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('has-cursor');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let id = 0;
    let shown = false;
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        shown = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dot.current!.style.opacity = ring.current!.style.opacity = '1';
      }
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      setLabel(t ? t.dataset.cursor || '' : null);
      const interactive = (e.target as HTMLElement).closest('a,button,input,select,textarea,[role="button"]');
      ring.current!.dataset.hover = interactive && !t ? '1' : '';
    };
    const leave = () => {
      shown = false;
      dot.current!.style.opacity = ring.current!.style.opacity = '0';
    };
    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      dot.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.current!.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.body.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  const big = label !== null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 mix-blend-difference" aria-hidden>
        <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-bone transition-[width,height] duration-300 ${big ? 'h-0 w-0' : 'h-1.5 w-1.5'}`} />
      </div>
      <div ref={ring} className="group/cursor pointer-events-none fixed left-0 top-0 z-[99] opacity-0" aria-hidden>
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ease-[var(--ease-expo)] ${
            big
              ? 'h-24 w-24 border-transparent bg-saffron text-ink'
              : 'h-9 w-9 border-bone/40 group-data-[hover=1]/cursor:h-14 group-data-[hover=1]/cursor:w-14 group-data-[hover=1]/cursor:border-saffron'
          }`}
        >
          {big && <span className="kicker a-focus text-[10px] font-semibold">{label}</span>}
        </div>
      </div>
    </>
  );
}

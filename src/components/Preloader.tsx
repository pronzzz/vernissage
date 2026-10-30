import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { usePalette } from '@/state/palette';

/** "Doors open" counter, then five palette curtains lift away. Shown once per session. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const { colors } = usePalette();
  const [skip] = useState(() => {
    try {
      return sessionStorage.getItem('vernissage:seen') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(!skip);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setOpen(false);
          onDone();
          try {
            sessionStorage.setItem('vernissage:seen', '1');
          } catch {
            /* ignore */
          }
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[200] flex" exit={{ pointerEvents: 'none' }} transition={{ duration: 1.2 }}>
          {colors.map((c, i) => (
            <motion.div
              key={i}
              className="h-full flex-1"
              style={{ background: i === 0 ? '#00121C' : c }}
              initial={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: [0.76, 0, 0.24, 1] }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-6 text-bone md:p-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between kicker">
              <span>Vernissage®</span>
              <span>Season 04</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="display a-tracking max-w-sm text-3xl italic md:text-5xl">Doors are opening…</p>
              <span className="display text-[22vw] leading-[0.8] tabular-nums md:text-[14vw]">{String(n).padStart(3, '0')}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

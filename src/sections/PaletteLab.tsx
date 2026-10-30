import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Lock, LockOpen, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import Artwork from '@/art/Artwork';
import ShinyText from '@/components/reactbits/ShinyText';
import { usePalette, PRESETS } from '@/state/palette';
import { colorName, onColor } from '@/lib/palettes';
import { copy, cn } from '@/lib/utils';
import { SectionHead } from './Manifesto';

/** A Coolors homage: press space to generate, lock what you love. Every work on the site repaints. */
export default function PaletteLab() {
  const { colors, name, locked, shuffle, toggleLock, setPreset, reset } = usePalette();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [jello, setJello] = useState<number | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag)) {
        e.preventDefault();
        shuffle();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [inView, shuffle]);

  return (
    <section id="palette" ref={ref} className="bg-ink px-5 py-28 md:px-10 md:py-36">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionHead index="04" label="Palette lab" className="text-saffron" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Repaint the <em className="text-saffron">whole show.</em>
          </h2>
        </div>
        <div className="max-w-sm text-bone/70">
          <p>
            Every artwork on this site is drawn live from these five colours. Shuffle, lock what you love, or start from a
            trending palette on{' '}
            <a href="https://coolors.co" target="_blank" rel="noreferrer" className="text-bone underline decoration-bone/30 underline-offset-4 hover:decoration-saffron">
              Coolors
            </a>
            .
          </p>
          <p className="kicker mt-4 text-mute">
            <ShinyText text={inView ? 'Press space to generate' : 'Scroll here, then press space'} speed={3} color="#8fa3ad" shineColor="#FCBF49" />
          </p>
        </div>
      </div>

      {/* the five columns */}
      <div className="mt-12 flex h-[56vh] min-h-[360px] flex-col overflow-hidden rounded-2xl md:flex-row">
        {colors.map((c, i) => (
          <motion.div
            key={i}
            layout
            className="group relative flex flex-1 flex-row items-center justify-between gap-2 px-5 transition-[flex] duration-500 hover:flex-[1.4] md:flex-col md:justify-end md:px-0 md:pb-8"
            animate={{ backgroundColor: c }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: onColor(c) }}
          >
            <div className="flex items-center gap-1 opacity-100 transition-opacity md:mb-6 md:flex-col md:opacity-0 md:group-hover:opacity-100">
              <button
                onClick={async () => {
                  setJello(i);
                  if (await copy(c)) toast(`${c} copied to clipboard`, { description: colorName(c) });
                }}
                className="rounded-lg p-2.5 hover:bg-black/10"
                aria-label={`Copy ${c}`}
              >
                <Copy size={18} />
              </button>
              <button onClick={() => toggleLock(i)} className={cn('rounded-lg p-2.5 hover:bg-black/10', locked[i] && 'md:!opacity-100')} aria-pressed={locked[i]} aria-label={locked[i] ? 'Unlock colour' : 'Lock colour'}>
                {locked[i] ? <Lock size={18} /> : <LockOpen size={18} />}
              </button>
            </div>
            <div className={cn('text-right md:text-center', jello === i && 'a-jello')} onAnimationEnd={() => setJello(null)}>
              <p className="font-mono text-xl font-semibold tracking-wider md:text-2xl">{c.replace('#', '')}</p>
              <p className="text-xs opacity-70">{colorName(c)}</p>
            </div>
            {locked[i] && <Lock size={14} className="absolute left-3 top-3 hidden opacity-60 md:block" />}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={shuffle} className="flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink hover:bg-saffron">
          <Shuffle size={15} /> Generate
        </button>
        <button onClick={reset} className="flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3 text-sm hover:border-bone/60">
          <RotateCcw size={15} /> House colours
        </button>
        <span className="kicker ml-auto text-mute">Now: {name}</span>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="kicker mb-4 text-mute">Trending on Coolors</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setPreset(p)}
                className={cn('group rounded-xl border p-2 text-left transition-colors', name === p.name ? 'border-saffron' : 'border-bone/10 hover:border-bone/30')}
              >
                <span className="flex h-8 overflow-hidden rounded-md">
                  {p.colors.map((c) => (
                    <i key={c} className="block flex-1 transition-[flex] duration-300 group-hover:[&:hover]:flex-[2]" style={{ background: c }} />
                  ))}
                </span>
                <span className="mt-2 block text-xs text-bone/70">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="kicker mb-4 text-mute">Live preview</p>
          <div className="grid grid-cols-4 gap-2">
            {(['grid', 'orbit', 'shards', 'weave'] as const).map((k, i) => (
              <Artwork key={k} kind={k} seed={300 + i * 17} ground={i % 2 ? 'light' : 'dark'} className="aspect-[3/4] rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

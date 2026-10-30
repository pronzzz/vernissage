import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { Heart } from 'lucide-react';
import Artwork from '@/art/Artwork';
import { KIND_LABEL, type ArtKind } from '@/art/engine';
import { WORKS, type Work } from '@/data/content';
import { useUI } from '@/state/ui';
import { SectionHead } from './Manifesto';
import { cn } from '@/lib/utils';

const RATIO = { portrait: 'aspect-[4/5]', square: 'aspect-square', landscape: 'aspect-[5/4]' };

function Tile({ w }: { w: Work }) {
  const { openWork, saved } = useUI();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  return (
    <motion.figure
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="mb-5 break-inside-avoid [perspective:900px]"
    >
      <motion.button
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        onClick={() => openWork(w)}
        data-cursor="View"
        className="group relative block w-full overflow-hidden rounded-sm bg-ink shadow-lg shadow-ink/20"
        aria-label={`Open ${w.title}`}
      >
        <Artwork {...w} className={cn('w-full', RATIO[w.ratio])} />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-4 text-left text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <p className="font-serif text-xl italic">{w.title}</p>
          <p className="text-xs text-bone/70">
            {w.artist} · {w.price}
          </p>
        </div>
        {saved.has(w.id) && (
          <span className="absolute right-3 top-3 rounded-full bg-paper/90 p-1.5 text-vermilion">
            <Heart size={12} className="fill-current" />
          </span>
        )}
      </motion.button>
      <figcaption className="mt-2 flex justify-between text-xs text-ink/60">
        <span>{w.artist}</span>
        <span className="kicker">{KIND_LABEL[w.kind]}</span>
      </figcaption>
    </motion.figure>
  );
}

export default function Collection() {
  const [filter, setFilter] = useState<ArtKind | 'all' | 'saved'>('all');
  const { saved } = useUI();
  const kinds = useMemo(() => [...new Set(WORKS.map((w) => w.kind))], []);
  const list = WORKS.filter((w) => (filter === 'all' ? true : filter === 'saved' ? saved.has(w.id) : w.kind === filter));

  const chip = (key: typeof filter, label: string, count: number) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={cn(
        'relative rounded-full border px-4 py-2 text-sm transition-colors',
        filter === key ? 'border-ink text-paper' : 'border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink',
      )}
      aria-pressed={filter === key}
    >
      {filter === key && <motion.span layoutId="chip" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
      <span className="relative">
        {label} <sup className="opacity-60">{count}</sup>
      </span>
    </button>
  );

  return (
    <section id="collection" className="bg-paper px-5 py-28 text-ink md:px-10 md:py-36">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionHead index="03" label="The collection" className="text-vermilion" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Sixteen works, <br />
            <em className="text-vermilion">infinite colourways.</em>
          </h2>
        </div>
        <p className="max-w-sm text-ink/70">
          Filter by technique, tilt a frame, open a piece to reserve an edition or download a full-size print file in your
          current palette.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        {chip('all', 'All', WORKS.length)}
        {kinds.map((k) => chip(k, KIND_LABEL[k], WORKS.filter((w) => w.kind === k).length))}
        {chip('saved', '♥ Saved', saved.size)}
      </div>

      <motion.div layout className="mt-10 columns-2 gap-5 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {list.map((w) => (
            <Tile key={w.id} w={w} />
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <p className="mt-10 font-serif text-3xl italic text-ink/50">Nothing saved yet. Open a work and tap the heart.</p>
      )}
    </section>
  );
}

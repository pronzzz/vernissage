import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Artwork from '@/art/Artwork';
import { SEASON, type Work } from '@/data/content';
import { useUI } from '@/state/ui';
import { SectionHead } from './Manifesto';
import { cn } from '@/lib/utils';
import { useMedia } from '@/lib/hooks';

const RATIO = { portrait: 'aspect-[4/5] h-[min(54vh,620px)]', square: 'aspect-square h-[min(46vh,540px)]', landscape: 'aspect-[5/4] h-[min(42vh,500px)]' };

function Frame({ w, i }: { w: Work; i: number }) {
  const { openWork } = useUI();
  return (
    <button
      onClick={() => openWork(w)}
      className={cn('group shrink-0 text-left', i % 2 ? 'self-end' : 'self-start')}
      data-cursor="View"
      aria-label={`Open ${w.title} by ${w.artist}`}
    >
      <div className="overflow-hidden rounded-sm shadow-2xl shadow-black/50">
        <Artwork {...w} className={cn('max-w-[80vw] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]', RATIO[w.ratio])} />
      </div>
      {/* museum wall label */}
      <div className="mt-4 flex items-start justify-between gap-6">
        <div>
          <p className="font-serif text-2xl italic leading-tight">{w.title}</p>
          <p className="mt-1 text-sm text-bone/60">
            {w.artist} · {w.year}
          </p>
        </div>
        <span className="kicker mt-1 text-mute">{String(i + 1).padStart(2, '0')}</span>
      </div>
    </button>
  );
}

/** A pinned room you scroll sideways through, like walking past a wall of work. */
export default function Season() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, (v) => {
    const el = track.current;
    if (!el) return 0;
    return -v * Math.max(0, el.scrollWidth - innerWidth);
  });
  const bar = useTransform(smooth, [0, 1], ['0%', '100%']);
  const desktop = useMedia('(min-width: 768px)');

  return (
    <section id="season" ref={ref} className="relative bg-ink-2 md:h-[420vh]">
      <div className="top-0 flex flex-col overflow-hidden py-24 md:sticky md:h-screen md:py-0">
        <div className="flex items-end justify-between px-5 pt-0 md:px-10 md:pt-28">
          <div>
            <SectionHead index="02" label="Now showing" className="text-saffron" />
            <h2 className="display mt-6 text-6xl md:text-7xl 2xl:text-8xl">
              Season 04: <em className="text-saffron">Weather Systems</em>
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-bone/60 lg:block">
            Eight artists, one shared room. Each work is generated from a seed, so it will look the same every time you
            come back, until you change the palette.
          </p>
        </div>

        <motion.div
          ref={track}
          style={desktop ? { x } : undefined}
          className="mt-12 flex flex-1 items-center gap-12 overflow-x-auto px-5 pb-6 max-md:snap-x max-md:snap-mandatory md:mt-6 md:gap-24 md:overflow-visible md:px-10 md:py-6 md:will-change-transform [&>*]:max-md:snap-center"
        >
          {SEASON.map((w, i) => (
            <Frame key={w.id} w={w} i={i} />
          ))}
          <div className="flex shrink-0 flex-col justify-center pr-[10vw] md:w-[30vw]">
            <p className="display text-5xl italic">That&rsquo;s the wall.</p>
            <a href="#collection" className="draw-underline mt-4 self-start text-bone/70">
              See the full collection →
            </a>
          </div>
        </motion.div>

        <div className="mx-10 mb-10 hidden h-px bg-bone/10 md:block">
          <motion.div className="h-px bg-saffron" style={{ width: bar }} />
        </div>
      </div>
    </section>
  );
}

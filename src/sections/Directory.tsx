import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import Artwork from '@/art/Artwork';
import { PEOPLE, type Person, type Role } from '@/data/content';
import type { ArtKind } from '@/art/engine';
import { SectionHead } from './Manifesto';
import { cn } from '@/lib/utils';

const KINDS: ArtKind[] = ['flow', 'grid', 'orbit', 'strata', 'bloom', 'weave', 'shards', 'dots'];
const TABS: (Role | 'All')[] = ['All', 'Artist', 'Curator', 'Collective'];

export default function Directory() {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [openOnly, setOpenOnly] = useState(false);
  const [hover, setHover] = useState<Person | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PEOPLE.filter(
      (p) =>
        (tab === 'All' || p.role === tab) &&
        (!openOnly || p.open) &&
        (!s || [p.name, p.city, p.discipline, p.country].some((v) => v.toLowerCase().includes(s))),
    );
  }, [q, tab, openOnly]);

  return (
    <section id="directory" className="bg-ink px-5 py-28 md:px-10 md:py-36">
      <div className="grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <SectionHead index="06" label="The Directory" className="text-saffron" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Find who you need. <br />
            <em className="text-saffron">Get found.</em>
          </h2>
        </div>
        <p className="max-w-md text-bone/70 md:justify-self-end">
          Think of it as the yellow pages for the art world. No algorithm, no paywall, no boosted posts. Search by name, city
          or discipline, and see whose studio is open right now.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-full border border-bone/15 px-5 focus-within:border-saffron">
          <Search size={16} className="text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “Lagos”, “textile” or “curator”" className="h-12 flex-1 bg-transparent outline-none placeholder:text-mute" aria-label="Search the directory" />
          {q && (
            <button onClick={() => setQ('')} className="kicker text-mute hover:text-bone">
              clear
            </button>
          )}
        </label>
        <div className="flex gap-1 rounded-full border border-bone/15 p-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('relative rounded-full px-4 py-2 text-sm', tab === t ? 'text-ink' : 'text-bone/70 hover:text-bone')}>
              {tab === t && <motion.span layoutId="dir-tab" className="absolute inset-0 rounded-full bg-bone" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{t === 'All' ? 'All' : t + 's'}</span>
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-bone/70">
          <button role="switch" aria-checked={openOnly} onClick={() => setOpenOnly(!openOnly)} className="switch" aria-label="Open studios only" />
          Open studios
        </label>
      </div>

      <div
        ref={area}
        className="relative mt-10"
        onPointerMove={(e) => {
          const r = area.current!.getBoundingClientRect();
          x.set(e.clientX - r.left + 24);
          y.set(e.clientY - r.top - 90);
        }}
        onPointerLeave={() => setHover(null)}
      >
        <div className="kicker hidden grid-cols-[3rem_2fr_1fr_1.5fr_1fr_8rem] gap-4 border-b border-bone/10 pb-3 text-mute md:grid">
          <span>Nº</span>
          <span>Name</span>
          <span>Role</span>
          <span>Discipline</span>
          <span>City</span>
          <span className="text-right">Studio</span>
        </div>
        <AnimatePresence initial={false}>
          {list.map((p, i) => (
            <motion.button
              key={p.name}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={() => setHover(p)}
              onClick={() => toast(`${p.name}`, { description: `${p.discipline} · ${p.city} · ${p.works} works. Profile pages are part of the full product. (Demo)` })}
              className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-bone/10 py-5 text-left transition-colors hover:bg-bone/[0.03] md:grid-cols-[3rem_2fr_1fr_1.5fr_1fr_8rem]"
            >
              <span className="kicker text-mute">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex flex-col">
                <span className="display text-3xl transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">{p.name}</span>
                <span className="text-xs text-mute md:hidden">
                  {p.role} · {p.discipline} · {p.city}
                </span>
              </span>
              <span className="hidden text-sm text-bone/70 md:block">{p.role}</span>
              <span className="hidden text-sm text-bone/70 md:block">{p.discipline}</span>
              <span className="hidden text-sm text-bone/70 md:block">
                {p.city}, {p.country}
              </span>
              <span className="flex items-center justify-end gap-2 text-xs">
                <span className={cn('h-2 w-2 rounded-full', p.open ? 'bg-[#4ade80] shadow-[0_0_10px_#4ade80]' : 'bg-bone/25')} />
                <span className="hidden sm:inline">{p.open ? 'Open now' : 'By appt.'}</span>
                <ArrowUpRight size={16} className="ml-2 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-saffron" />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
        {list.length === 0 && <p className="py-16 text-center font-serif text-3xl italic text-bone/50">No one matches that yet. Maybe it&rsquo;s you?</p>}

        {/* floating preview that follows the cursor */}
        <motion.div style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block">
          <AnimatePresence>
            {hover && (
              <motion.div
                key={hover.name}
                initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                <Artwork kind={KINDS[hover.seed % KINDS.length]} seed={hover.seed} ground={hover.seed % 2 ? 'light' : 'dark'} className="h-48 w-40 rounded-md shadow-2xl shadow-black/60" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Download, Heart, X } from 'lucide-react';
import { toast } from 'sonner';
import Artwork from '@/art/Artwork';
import { KIND_LABEL, paintToCanvas } from '@/art/engine';
import { WORKS } from '@/data/content';
import { useUI } from '@/state/ui';
import { usePalette } from '@/state/palette';
import { colorName, onColor } from '@/lib/palettes';
import { copy, cn } from '@/lib/utils';
import { lockScroll } from '@/lib/scroll';

const RATIO = { portrait: 'aspect-[4/5]', square: 'aspect-square', landscape: 'aspect-[5/4]' };

export default function ArtworkDialog() {
  const { work, openWork, saved, toggleSaved } = useUI();
  const { colors } = usePalette();
  const [pulse, setPulse] = useState(0);
  const [jello, setJello] = useState<number | null>(null);

  useEffect(() => {
    lockScroll(!!work);
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      const i = WORKS.findIndex((w) => w.id === work.id);
      if (e.key === 'Escape') openWork(null);
      if (e.key === 'ArrowRight') openWork(WORKS[(i + 1) % WORKS.length]);
      if (e.key === 'ArrowLeft') openWork(WORKS[(i - 1 + WORKS.length) % WORKS.length]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [work, openWork]);

  const step = (d: number) => {
    if (!work) return;
    const i = WORKS.findIndex((w) => w.id === work.id);
    openWork(WORKS[(i + d + WORKS.length) % WORKS.length]);
  };

  const download = () => {
    if (!work) return;
    const [w, h] = work.ratio === 'portrait' ? [1600, 2000] : work.ratio === 'landscape' ? [2000, 1600] : [1800, 1800];
    const c = paintToCanvas(work, colors, w, h);
    const a = document.createElement('a');
    a.download = `vernissage-${work.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
    toast.success('Print file saved', { description: 'Rendered at full size with your current palette.' });
  };

  const isSaved = work ? saved.has(work.id) : false;

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-[120] overflow-y-auto bg-ink/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openWork(null)}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={work.title}
        >
          <div className="mx-auto flex min-h-full max-w-6xl items-center px-4 py-16 md:px-8">
            <motion.div
              key={work.id}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="grid w-full gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Artwork {...work} className={cn('w-full rounded-sm shadow-2xl shadow-black/60', RATIO[work.ratio])} label={work.title} />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="kicker text-mute">{KIND_LABEL[work.kind]} · {work.id.toUpperCase()}</span>
                  <button onClick={() => openWork(null)} className="rounded-full border border-bone/20 p-2 hover:bg-bone hover:text-ink" aria-label="Close">
                    <X size={16} />
                  </button>
                </div>
                <h2 className="display mt-6 text-5xl md:text-6xl">{work.title}</h2>
                <p className="mt-3 text-lg text-bone/80">
                  {work.artist}, <span className="text-mute">{work.city}</span>
                </p>
                <p className="mt-6 max-w-md text-bone/70">{work.note}</p>

                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-bone/10 py-5 text-sm">
                  {[['Year', work.year], ['Size', work.size], ['Edition', work.edition]].map(([k, v]) => (
                    <div key={k}>
                      <dt className="kicker text-mute">{k}</dt>
                      <dd className="mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6">
                  <p className="kicker mb-3 text-mute">Painted with · click to copy</p>
                  <div className="flex overflow-hidden rounded-lg">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        className={cn('group h-14 flex-1 transition-[flex] duration-500 hover:flex-[2]', jello === i && 'a-jello')}
                        style={{ background: c, color: onColor(c) }}
                        onAnimationEnd={() => setJello(null)}
                        onClick={async () => {
                          setJello(i);
                          if (await copy(c)) toast(`${c} copied`, { description: colorName(c) });
                        }}
                        aria-label={`Copy ${c}`}
                      >
                        <span className="kicker opacity-0 transition-opacity group-hover:opacity-100">{c.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="display mr-auto text-3xl">{work.price}</span>
                  <button
                    onClick={() => {
                      const added = toggleSaved(work.id);
                      setPulse((p) => p + 1);
                      toast(added ? 'Saved to your collection' : 'Removed from your collection');
                    }}
                    className="rounded-full border border-bone/20 p-3 hover:border-vermilion"
                    aria-pressed={isSaved}
                    aria-label="Save to collection"
                  >
                    <Heart key={pulse} size={18} className={cn(pulse && 'a-heartbeat', isSaved && 'fill-vermilion text-vermilion')} />
                  </button>
                  <button onClick={download} className="rounded-full border border-bone/20 p-3 hover:border-saffron" aria-label="Download print file">
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => toast.success('Edition reserved', { description: `${work.title} is held for you for 48 hours. (Demo)` })}
                    className="btn-fill"
                  >
                    Reserve edition <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-auto flex justify-between pt-10 text-sm text-mute">
                  <button onClick={() => step(-1)} className="flex items-center gap-2 hover:text-bone">
                    <ArrowLeft size={14} /> Previous
                  </button>
                  <span className="kicker hidden md:block">← → to browse · esc to close</span>
                  <button onClick={() => step(1)} className="flex items-center gap-2 hover:text-bone">
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

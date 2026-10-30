import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import StarBorder from '@/components/reactbits/StarBorder';
import { FAQ, TIERS } from '@/data/content';
import { usePalette } from '@/state/palette';
import { SectionHead } from './Manifesto';
import { cn } from '@/lib/utils';

function Price({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
          {value === 0 ? 'Free' : `€${value}`}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Membership() {
  const [yearly, setYearly] = useState(true);
  const { colors } = usePalette();
  return (
    <section id="membership" className="bg-ink-2 px-5 py-28 md:px-10 md:py-36">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionHead index="08" label="Membership" className="text-saffron" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Pick your <em className="text-saffron">wall.</em>
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className={cn(!yearly ? 'text-bone' : 'text-mute')}>Monthly</span>
          <button role="switch" aria-checked={yearly} onClick={() => setYearly(!yearly)} className="switch" aria-label="Bill yearly" />
          <span className={cn(yearly ? 'text-bone' : 'text-mute')}>Yearly</span>
          <span className="a-wobble rounded-full bg-vermilion px-2 py-0.5 text-xs text-bone" key={String(yearly)}>
            −25%
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => {
          const body = (
            <div className="flex h-full flex-col p-8 text-left">
              <div className="flex items-center justify-between">
                <h3 className="display text-4xl">{t.name}</h3>
                {t.featured && <span className="kicker rounded-full bg-saffron px-2.5 py-1 text-[10px] text-ink">Most loved</span>}
              </div>
              <p className="mt-2 text-sm text-bone/60">{t.blurb}</p>
              <p className="display mt-8 text-7xl">
                <Price value={yearly ? t.yearly : t.monthly} />
                {t.monthly > 0 && <span className="ml-2 font-sans text-sm text-mute">/ month</span>}
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-bone/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-saffron" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toast.success(`${t.name} selected`, { description: 'Checkout is not part of this demo.' })}
                className={cn('mt-10 rounded-full py-3.5 text-sm font-medium transition-colors', t.featured ? 'bg-saffron text-ink hover:bg-bone' : 'border border-bone/20 hover:border-bone hover:bg-bone hover:text-ink')}
              >
                {t.cta}
              </button>
            </div>
          );
          return t.featured ? (
            <StarBorder key={t.name} as="div" color={colors[3]} backgroundColor="#03283b" textColor="#EAE2B7" radius={24} className="!block !p-0 lg:-my-4">
              {body}
            </StarBorder>
          ) : (
            <div key={t.name} className="rounded-3xl border border-bone/10 bg-ink">
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-paper px-5 py-28 text-ink md:px-10 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHead index="09" label="FAQ" className="text-vermilion" />
          <h2 className="display mt-6 text-6xl md:text-7xl">
            Questions <em className="text-vermilion">at the bar.</em>
          </h2>
        </div>
        <div className="border-t border-ink/15">
          {FAQ.map((f, i) => (
            <div key={i} className="border-b border-ink/15">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i}>
                <span className="font-serif text-2xl md:text-3xl">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors', open === i ? 'border-vermilion bg-vermilion text-paper' : 'border-ink/20')}>
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-ink/70">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

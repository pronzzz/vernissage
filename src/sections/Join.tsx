import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowUp, Send } from 'lucide-react';
import { toast } from 'sonner';
import Artwork from '@/art/Artwork';
import TextPressure from '@/components/reactbits/TextPressure';
import { WORKS, NAV } from '@/data/content';
import { scrollTo } from '@/lib/scroll';
import { useClock } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Logo } from './Nav';

const FLOATERS = [
  { w: WORKS[2], cls: 'left-[3%] top-[10%] h-40 w-32 -rotate-6', speed: -120 },
  { w: WORKS[6], cls: 'right-[6%] top-[8%] h-48 w-40 rotate-6', speed: -200 },
  { w: WORKS[9], cls: 'left-[6%] bottom-[8%] h-36 w-36 rotate-3', speed: -80 },
  { w: WORKS[13], cls: 'right-[5%] bottom-[10%] h-40 w-32 -rotate-3', speed: -160 },
];

function Floater({ f, progress }: { f: (typeof FLOATERS)[number]; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const y = useTransform(progress, [0, 1], [0, f.speed]);
  return (
    <motion.div style={{ y }} className={cn('absolute hidden overflow-hidden rounded-md shadow-2xl shadow-black/40 xl:block', f.cls)}>
      <Artwork {...f.w} className="h-full w-full" />
    </motion.div>
  );
}

export default function Join() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section id="join" ref={ref} className="relative overflow-hidden bg-vermilion px-5 py-32 text-bone md:px-10 md:py-48">
      {FLOATERS.map((f) => (
        <Floater key={f.w.id} f={f} progress={scrollYProgress} />
      ))}
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="kicker a-flicker">Doors open at seven</p>
        <h2 className="display mt-6 text-[17vw] leading-[0.85] md:text-[9vw]">
          Your opening <em>night</em> starts here.
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg text-bone/85">
          Join the waitlist for Season 05. We send one letter a month: new openings, open calls and the occasional palette.
        </p>
        <form
          className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full bg-bone p-1.5 text-ink"
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              toast.error('That email looks unfinished.');
              return;
            }
            setSent(true);
            toast.success("You're on the list", { description: 'See you at the opening. (Demo, nothing was sent.)' });
            setTimeout(() => {
              setSent(false);
              setEmail('');
            }, 2200);
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="h-12 flex-1 bg-transparent px-4 outline-none placeholder:text-ink/40"
            aria-label="Email address"
          />
          <button className={cn('send h-12 rounded-full bg-ink px-6 text-sm font-medium text-bone', sent && 'sent')}>
            <span>{sent ? 'Sent' : 'Join'}</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const paris = useClock('Europe/Paris');
  const ny = useClock('America/New_York');
  const tokyo = useClock('Asia/Tokyo');
  return (
    <footer className="bg-ink px-5 pb-8 pt-20 md:px-10">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo className="text-4xl" />
          <p className="mt-4 max-w-xs text-sm text-bone/60">The opening night for every artist. A design demo, not a real platform; all artists and works are fictional.</p>
        </div>
        <div>
          <p className="kicker mb-4 text-mute">Explore</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }} className="draw-underline text-bone/80 hover:text-bone">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker mb-4 text-mute">Made with</p>
          <ul className="space-y-2 text-sm text-bone/80">
            {[
              ['Coolors', 'https://coolors.co'],
              ['React Bits', 'https://reactbits.dev'],
              ['Animista', 'https://animista.net'],
              ['Uiverse', 'https://uiverse.io'],
              ['21st.dev', 'https://21st.dev'],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} target="_blank" rel="noreferrer" className="draw-underline hover:text-bone">
                  {l} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker mb-4 text-mute">Openings tonight</p>
          <ul className="space-y-2 font-mono text-sm text-bone/80">
            <li className="flex justify-between"><span>Paris</span><span>{paris}</span></li>
            <li className="flex justify-between"><span>New York</span><span>{ny}</span></li>
            <li className="flex justify-between"><span>Tokyo</span><span>{tokyo}</span></li>
          </ul>
        </div>
      </div>

      <div className="relative mt-16 h-[22vw] min-h-[90px] select-none" data-cursor="Press">
        <TextPressure text="VERNISSAGE" textColor="#EAE2B7" minFontSize={48} italic={false} idle="wave" />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 text-xs text-mute md:flex-row md:items-center">
        <span>© 2026 Vernissage. Built by Pranav Dwivedi · MIT licensed.</span>
        <a href="https://github.com/pronzzz/vernissage" target="_blank" rel="noreferrer" className="draw-underline hover:text-bone">
          Source on GitHub ↗
        </a>
        <button onClick={() => scrollTo(0)} className="flex items-center gap-2 hover:text-bone">
          Back to the entrance <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}

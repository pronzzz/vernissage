import { motion } from 'motion/react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import LiveField from '@/art/LiveField';
import RotatingText from '@/components/reactbits/RotatingText';
import CircularText from '@/components/reactbits/CircularText';
import StarBorder from '@/components/reactbits/StarBorder';
import CountUp from '@/components/reactbits/CountUp';
import { scrollTo } from '@/lib/scroll';
import { usePalette } from '@/state/palette';

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const { colors, name } = usePalette();
  const d = 0;
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      <LiveField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_20%,var(--color-ink)_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      {ready && (
        <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-8 pt-28 md:px-10 md:pb-10">
          <motion.p className="kicker mb-6 flex items-center gap-3 text-bone/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.2 }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vermilion opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-vermilion" />
            </span>
            Season 04 · Weather Systems · Now open
          </motion.p>

          <h1 className="display text-[15vw] leading-[0.86] md:text-[9.5vw]">
            <Line delay={d + 0.05}>Every artist</Line>
            <Line delay={d + 0.15}>
              deserves <em className="text-bone/60">a</em>
            </Line>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span className="flex" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: d + 0.25, ease }}>
                <RotatingText
                  texts={['full room.', 'white wall.', 'first night.', 'second look.', 'full house.']}
                  mainClassName="italic text-saffron"
                  splitLevelClassName="overflow-hidden pb-[0.1em]"
                  effect="slide"
                  staggerDuration={0.025}
                  staggerFrom="last"
                  rotationInterval={2600}
                />
              </motion.span>
            </span>
          </h1>

          <div className="mt-10 grid items-end gap-8 md:grid-cols-[1fr_auto_auto]">
            <motion.p className="max-w-md text-lg text-bone/75" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.6, duration: 0.8 }}>
              Vernissage is the network where artists and curators find each other, hang their work in shared rooms,
              and throw an opening night for anyone, anywhere.
            </motion.p>

            <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.75, duration: 0.8 }}>
              <StarBorder
                as="a"
                href="#pass"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  scrollTo('#pass');
                }}
                color={colors[3]}
                backgroundColor="#00121C"
                textColor="#EAE2B7"
                radius={999}
                className="!px-6 !py-3.5 text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  Get your Pass <ArrowRight size={15} />
                </span>
              </StarBorder>
              <button onClick={() => scrollTo('#season')} className="btn-fill text-sm" data-cursor="">
                Browse the season <ArrowDownRight size={15} />
              </button>
            </motion.div>

            <motion.div className="hidden md:block" initial={{ opacity: 0, scale: 0.6, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: d + 0.9, duration: 1.2, ease }}>
              <button onClick={() => scrollTo('#manifesto')} aria-label="Scroll down" data-cursor="Enter">
                <CircularText text="DOORS OPEN ✺ SEASON 04 ✺ VERNISSAGE ✺ " size={132} fontSize={12} onHover="speedUp" spinDuration={18} color="#EAE2B7">
                  <span className="display text-4xl text-saffron">↓</span>
                </CircularText>
              </button>
            </motion.div>
          </div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-y-4 border-t border-bone/15 pt-5 text-sm md:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d + 1, duration: 1 }}
          >
            {[
              { n: 48210, l: 'artists hanging work' },
              { n: 6904, l: 'curators looking' },
              { n: 312, l: 'openings this week' },
            ].map((s) => (
              <div key={s.l}>
                <CountUp to={s.n} separator="," duration={2.2} className="display text-3xl tabular-nums" trigger="load" />
                <p className="kicker mt-1 text-mute">{s.l}</p>
              </div>
            ))}
            <div className="text-right md:text-left">
              <p className="font-serif text-lg italic text-bone/80">“Hero Field”, 2026</p>
              <p className="kicker mt-1 text-mute">Live generative · {name} · move your cursor</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

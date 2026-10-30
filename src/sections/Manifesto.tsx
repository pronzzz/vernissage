import ScrollVelocity from '@/components/reactbits/ScrollVelocity';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import Artwork from '@/art/Artwork';
import { PILLARS, WORKS } from '@/data/content';
import { usePalette } from '@/state/palette';

export function SectionHead({ index, label, className = '' }: { index: string; label: string; className?: string }) {
  return (
    <div className={`kicker flex items-center gap-4 ${className}`}>
      <span className="opacity-60">{index}</span>
      <span className="h-px w-10 bg-current opacity-30" />
      <span>{label}</span>
    </div>
  );
}

export function NameMarquee() {
  const names = WORKS.map((w) => w.artist);
  return (
    <div className="border-y border-bone/10 bg-ink py-6" aria-label="Artists showing this season">
      <ScrollVelocity
        texts={[
          <span key="a" className="display italic">{names.slice(0, 8).join('  ✺  ')}  ✺  </span>,
          <span key="b" className="display">{names.slice(8).join('  ✺  ')}  ✺  </span>,
        ]}
        velocity={40}
        numCopies={4}
        className="px-4 text-5xl md:text-7xl"
        fadeEdges
        outlineAlternate
        skewWithVelocity={6}
      />
    </div>
  );
}

export default function Manifesto() {
  const { colors } = usePalette();
  return (
    <section id="manifesto" className="relative bg-ink px-5 py-28 md:px-10 md:py-40">
      <SectionHead index="01" label="Manifesto" className="text-saffron" />
      <div className="mt-10 max-w-6xl">
        <ScrollReveal
          baseOpacity={0.12}
          enableBlur
          blurStrength={6}
          baseRotation={2}
          textClassName="display !text-[clamp(2.2rem,5.4vw,5.6rem)] !leading-[1.02]"
        >
          The art world runs on rooms most artists never get into. So we built the room: open to anyone, lit for everyone, and
          never more than a link away.
        </ScrollReveal>
      </div>

      <div className="mt-24 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <SpotlightCard key={p.n} className="group !rounded-2xl !p-0" spotlightColor={colors[3] + '40'} theme="dark">
            <div className="flex h-full flex-col">
              <Artwork kind={p.kind} seed={p.seed} ground="dark" className="aspect-[16/10] w-full rounded-t-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex flex-1 flex-col p-6">
                <span className="kicker text-mute">{p.n}</span>
                <h3 className="display mt-3 text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{p.body}</p>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

import Artwork from '@/art/Artwork';
import BlurText from '@/components/reactbits/BlurText';
import { QUOTES } from '@/data/content';
import { SectionHead } from './Manifesto';

function Quote({ q }: { q: (typeof QUOTES)[number] }) {
  return (
    <figure className="mb-4 rounded-2xl bg-ink p-6 text-bone">
      <blockquote className="font-serif text-xl leading-snug xl:text-2xl">&ldquo;{q.text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Artwork kind="orbit" seed={q.seed} className="h-10 w-10 rounded-full" />
        <span>
          <span className="block text-sm font-medium">{q.name}</span>
          <span className="block text-xs text-mute">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Voices() {
  const cols = [QUOTES.slice(0, 3), QUOTES.slice(3, 6), QUOTES.slice(6, 9)];
  return (
    <section id="voices" className="overflow-hidden bg-saffron px-5 py-28 text-ink md:px-10 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead index="07" label="Voices" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            <BlurText text="Heard at the opening." animateBy="words" delay={90} className="!m-0" />
          </h2>
          <p className="mt-6 max-w-sm text-ink/70">What members say after the lights go down. Hover a column to pause it.</p>
        </div>
        <div className="relative grid h-[80vh] grid-cols-1 gap-4 overflow-hidden [mask-image:linear-gradient(transparent,black_12%,black_88%,transparent)] md:grid-cols-2 xl:grid-cols-3">
          {cols.map((c, i) => (
            <div key={i} className={i === 1 ? 'hidden md:block' : i === 2 ? 'hidden xl:block' : ''}>
              <div className="marquee-y" style={{ ['--dur' as string]: `${36 + i * 8}s`, animationDirection: i === 1 ? 'reverse' : 'normal' }}>
                {[...c, ...c].map((q, k) => (
                  <Quote key={k} q={q} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

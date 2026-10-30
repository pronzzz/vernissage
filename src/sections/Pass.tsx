import { useEffect, useState } from 'react';
import { Wallet, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import HoloCard from '@/components/reactbits/HoloCard';
import CountUp from '@/components/reactbits/CountUp';
import DecryptedText from '@/components/reactbits/DecryptedText';
import { drawPass, type PassInfo } from '@/art/passCard';
import { usePalette } from '@/state/palette';
import { useMedia } from '@/lib/hooks';
import { SectionHead } from './Manifesto';

const DISCIPLINES = ['Painter', 'Sculptor', 'Photographer', 'Curator', 'Generative artist', 'Printmaker', 'Textile artist'];

export default function Pass() {
  const { colors } = usePalette();
  const [info, setInfo] = useState<PassInfo>({ name: 'Inès Kovač', discipline: 'Generative artist', city: 'Lyon' });
  const [img, setImg] = useState<string>();
  const small = useMedia('(max-width: 640px)');

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => drawPass(info, colors).then((u) => alive && setImg(u)), 120);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [info, colors]);

  const field = 'w-full rounded-xl border border-bone/15 bg-ink/40 px-4 py-3 text-bone outline-none transition-colors placeholder:text-mute focus:border-saffron';

  return (
    <section id="pass" className="relative overflow-hidden bg-prussian px-5 py-28 md:px-10 md:py-36">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[var(--p2)] opacity-20 blur-[120px]" />
      <div className="relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHead index="05" label="The Pass" className="text-saffron" />
          <h2 className="display mt-6 text-6xl md:text-8xl">
            Your portfolio, <br />
            <em className="text-saffron">in your pocket.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg text-bone/75">
            No more &ldquo;find me on Insta&rdquo;. The Vernissage Pass holds your work, bio and studio hours. Add it to your
            wallet and share it with one tap. Type below and watch yours print.
          </p>

          <form className="mt-10 grid max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="grid gap-1.5">
              <span className="kicker text-mute">Name</span>
              <input className={field} value={info.name} maxLength={28} onChange={(e) => setInfo({ ...info, name: e.target.value })} placeholder="Your name" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5">
                <span className="kicker text-mute">Discipline</span>
                <select className={field} value={info.discipline} onChange={(e) => setInfo({ ...info, discipline: e.target.value })}>
                  {DISCIPLINES.map((d) => (
                    <option key={d} className="bg-ink">
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="kicker text-mute">City</span>
                <input className={field} value={info.city} maxLength={18} onChange={(e) => setInfo({ ...info, city: e.target.value })} placeholder="City" />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toast.success('Added to Wallet', { description: `${info.name || 'Your'} Pass is ready to share. (Demo)` })}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium hover:bg-black"
              >
                <Wallet size={16} /> Add to Wallet
              </button>
              <button
                type="button"
                onClick={() => toast('Share link copied', { description: `vernissage.art/${(info.name || 'you').toLowerCase().replace(/\s+/g, '-')}` })}
                className="btn-fill text-sm"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center">
          <div className="min-h-[300px]" data-cursor="Tilt">
            {img && <HoloCard image={img} width={small ? 280 : 380} preset="rainbow" intensity={0.3} glare={0.35} edgeSparkle={0.4} radius={18} foilColor={colors[4]} />}
          </div>
          <p className="kicker mt-6 text-bone/60">
            <DecryptedText text="Each Pass is generated from your name" animateOn="view" sequential revealDirection="start" speed={40} />
          </p>
        </div>
      </div>

      <div className="relative mt-24 grid grid-cols-2 gap-8 border-t border-bone/15 pt-10 md:grid-cols-4">
        {[
          { to: 1.2, suffix: 'M', l: 'Pass shares this year', dec: 1 },
          { to: 112, l: 'countries' },
          { to: 2431, l: 'openings hosted', sep: ',' },
          { to: 0, suffix: '%', l: 'commission on Salon' },
        ].map((s) => (
          <div key={s.l}>
            <CountUp to={s.to} decimals={s.dec} suffix={s.suffix} separator={s.sep} className="display text-6xl" mode="roll" />
            <p className="kicker mt-2 text-bone/60">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

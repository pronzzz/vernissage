import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Command } from 'lucide-react';
import Magnet from '@/components/reactbits/Magnet';
import StaggeredMenu from '@/components/reactbits/StaggeredMenu';
import { NAV } from '@/data/content';
import { scrollTo } from '@/lib/scroll';
import { useUI } from '@/state/ui';
import { usePalette } from '@/state/palette';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('display flex items-baseline gap-1 text-2xl', className)}>
      Vernissage<sup className="font-sans text-[10px]">®</sup>
    </span>
  );
}

export default function Nav() {
  const { setCommandOpen } = useUI();
  const { colors } = usePalette();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setSolid(y > 40);
      setHidden(y > 400 && y > last);
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 hidden md:block"
        animate={{ y: hidden ? '-110%' : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            'mx-4 mt-4 flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500',
            solid ? 'border border-bone/10 bg-ink/70 backdrop-blur-xl' : 'border border-transparent',
          )}
        >
          <a href="#top" onClick={go('#top')} aria-label="Vernissage home">
            <Logo />
          </a>
          <nav className="flex items-center gap-7 text-sm">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={go(n.href)} className="roll text-bone/80 hover:text-bone">
                <span>{n.label}</span>
                <span aria-hidden className="italic font-serif text-base leading-[1.05] text-saffron">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 rounded-full border border-bone/15 px-3 py-2 text-xs text-bone/70 hover:border-bone/40 hover:text-bone"
              aria-label="Open command menu"
            >
              <Command size={13} /> K
            </button>
            <Magnet padding={40} magnetStrength={3}>
              <a href="#pass" onClick={go('#pass')} className="block rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-saffron">
                Get your Pass
              </a>
            </Magnet>
          </div>
        </div>
      </motion.header>

      {/* mobile: React Bits StaggeredMenu */}
      <div className="md:hidden">
        <StaggeredMenu
          isFixed
          position="right"
          colors={[colors[1], colors[3]]}
          accentColor={colors[2]}
          menuButtonColor="#EAE2B7"
          openMenuButtonColor="#00121C"
          changeMenuColorOnOpen
          closeOnClickAway
          displayItemNumbering
          items={[...NAV, { label: 'Join', href: '#join' }].map((n) => ({ label: n.label, ariaLabel: `Go to ${n.label}`, link: n.href }))}
          socialItems={[
            { label: 'GitHub', link: 'https://github.com/pronzzz/vernissage' },
            { label: 'Coolors', link: 'https://coolors.co' },
          ]}
          logoUrl="/logo.svg"
        />
      </div>
    </>
  );
}

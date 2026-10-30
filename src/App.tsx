import { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import ClickSpark from '@/components/reactbits/ClickSpark';
import Cursor from '@/components/Cursor';
import Preloader from '@/components/Preloader';
import CommandMenu from '@/components/CommandMenu';
import ArtworkDialog from '@/components/ArtworkDialog';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import Manifesto, { NameMarquee } from '@/sections/Manifesto';
import Season from '@/sections/Season';
import Collection from '@/sections/Collection';
import PaletteLab from '@/sections/PaletteLab';
import Pass from '@/sections/Pass';
import Directory from '@/sections/Directory';
import Voices from '@/sections/Voices';
import Membership, { Faq } from '@/sections/Membership';
import Join, { Footer } from '@/sections/Join';
import { usePalette } from '@/state/palette';
import { startSmoothScroll } from '@/lib/scroll';

export default function App() {
  const [ready, setReady] = useState(false);
  const { colors, motionPaused } = usePalette();
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => startSmoothScroll(), []);

  return (
    <ClickSpark sparkColor={colors.slice(1)} sparkCount={10} sparkRadius={26} shape="star" disabled={motionPaused}>
      <div className={motionPaused ? 'paused' : ''}>
        <Preloader onDone={onDone} />
        <Cursor />
        <Nav />
        <main>
          <Hero ready={ready} />
          <NameMarquee />
          <Manifesto />
          <Season />
          <Collection />
          <PaletteLab />
          <Pass />
          <Directory />
          <Voices />
          <Membership />
          <Faq />
          <Join />
        </main>
        <Footer />
        <ArtworkDialog />
        <CommandMenu />
        <div className="grain" aria-hidden />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { background: '#011c2b', color: '#EAE2B7', border: '1px solid rgba(234,226,183,0.15)', fontFamily: 'var(--font-sans)' },
          }}
        />
      </div>
    </ClickSpark>
  );
}

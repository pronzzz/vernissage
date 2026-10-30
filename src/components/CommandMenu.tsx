import { useEffect } from 'react';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Image, Palette as PaletteIcon, Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { usePalette, PRESETS } from '@/state/palette';
import { useUI } from '@/state/ui';
import { NAV, WORKS } from '@/data/content';
import { scrollTo } from '@/lib/scroll';

const item =
  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bone/80 data-[selected=true]:bg-bone/10 data-[selected=true]:text-bone';

export default function CommandMenu() {
  const { commandOpen: open, setCommandOpen: setOpen, openWork } = useUI();
  const { shuffle, setPreset, reset, motionPaused, setMotionPaused } = usePalette();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 60);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center bg-ink/70 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 16, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-bone/10 bg-ink-2 shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Command menu" loop>
              <div className="flex items-center gap-3 border-b border-bone/10 px-4">
                <span className="kicker text-mute">⌘K</span>
                <Command.Input autoFocus placeholder="Jump to a section, a work, or a palette…" className="h-14 flex-1 bg-transparent text-bone outline-none placeholder:text-mute" />
              </div>
              <Command.List className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent>
                <Command.Empty className="px-3 py-6 text-center text-sm text-mute">Nothing on the walls by that name.</Command.Empty>
                <Command.Group heading="Go to" className="[&_[cmdk-group-heading]]:kicker [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-mute">
                  {[...NAV, { label: 'FAQ', href: '#faq' }, { label: 'Join', href: '#join' }].map((n) => (
                    <Command.Item key={n.href} className={item} onSelect={() => run(() => scrollTo(n.href))}>
                      <ArrowRight size={15} /> {n.label}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Palette" className="[&_[cmdk-group-heading]]:kicker [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-mute">
                  <Command.Item className={item} onSelect={() => run(() => { shuffle(); toast('Palette shuffled. Every work repainted.'); })}>
                    <Shuffle size={15} /> Shuffle palette
                  </Command.Item>
                  <Command.Item className={item} onSelect={() => run(reset)}>
                    <RotateCcw size={15} /> Back to house colours
                  </Command.Item>
                  {PRESETS.map((p) => (
                    <Command.Item key={p.name} value={`palette ${p.name}`} className={item} onSelect={() => run(() => setPreset(p))}>
                      <PaletteIcon size={15} />
                      <span className="flex-1">{p.name}</span>
                      <span className="flex overflow-hidden rounded">
                        {p.colors.map((c) => (
                          <i key={c} className="block h-4 w-3" style={{ background: c }} />
                        ))}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Works" className="[&_[cmdk-group-heading]]:kicker [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-mute">
                  {WORKS.map((w) => (
                    <Command.Item key={w.id} value={`${w.title} ${w.artist}`} className={item} onSelect={() => run(() => openWork(w))}>
                      <Image size={15} />
                      <span className="flex-1 truncate">
                        <em className="font-serif text-base">{w.title}</em> <span className="text-mute">· {w.artist}</span>
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Settings" className="[&_[cmdk-group-heading]]:kicker [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-mute">
                  <Command.Item className={item} onSelect={() => run(() => setMotionPaused(!motionPaused))}>
                    {motionPaused ? <Play size={15} /> : <Pause size={15} />} {motionPaused ? 'Resume ambient motion' : 'Pause ambient motion'}
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

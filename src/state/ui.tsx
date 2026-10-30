import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Work } from '@/data/content';

interface UI {
  work: Work | null;
  openWork: (w: Work | null) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  saved: Set<string>;
  toggleSaved: (id: string) => boolean;
}

const Ctx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [work, openWork] = useState<Work | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('vernissage:saved') || '[]'));
    } catch {
      return new Set();
    }
  });

  const value = useMemo<UI>(
    () => ({
      work,
      openWork,
      commandOpen,
      setCommandOpen,
      saved,
      toggleSaved: (id) => {
        const next = new Set(saved);
        const added = !next.has(id);
        if (added) next.add(id);
        else next.delete(id);
        setSaved(next);
        try {
          localStorage.setItem('vernissage:saved', JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return added;
      },
    }),
    [work, commandOpen, saved],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useUI outside provider');
  return v;
}

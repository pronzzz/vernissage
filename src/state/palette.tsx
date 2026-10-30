import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { HOUSE, PRESETS, generatePalette, type Palette } from '@/lib/palettes';

interface PaletteState {
  colors: string[];
  name: string;
  locked: boolean[];
  setPreset: (p: Palette) => void;
  shuffle: () => void;
  toggleLock: (i: number) => void;
  reset: () => void;
  /** Pauses ambient animation (cursor, hero field, marquees). */
  motionPaused: boolean;
  setMotionPaused: (v: boolean) => void;
}

const Ctx = createContext<PaletteState | null>(null);
const KEY = 'vernissage:palette:v1';

function load(): { colors: string[]; name: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw);
      if (Array.isArray(v.colors) && v.colors.length === 5) return v;
    }
  } catch {
    /* private mode etc. */
  }
  return { colors: HOUSE.colors, name: HOUSE.name };
}

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [{ colors, name }, set] = useState(load);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [motionPaused, setMotionPaused] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ colors, name }));
    } catch {
      /* ignore */
    }
    // expose the palette to CSS so decorative accents follow it
    const root = document.documentElement;
    colors.forEach((c, i) => root.style.setProperty(`--p${i}`, c));
  }, [colors, name]);

  const setPreset = useCallback((p: Palette) => set({ colors: p.colors, name: p.name }), []);
  const shuffle = useCallback(
    () => set((s) => ({ colors: generatePalette(s.colors, locked), name: 'Your mix' })),
    [locked],
  );
  const toggleLock = useCallback((i: number) => setLocked((l) => l.map((v, k) => (k === i ? !v : v))), []);
  const reset = useCallback(() => {
    setLocked([false, false, false, false, false]);
    set({ colors: HOUSE.colors, name: HOUSE.name });
  }, []);

  const value = useMemo(
    () => ({ colors, name, locked, setPreset, shuffle, toggleLock, reset, motionPaused, setMotionPaused }),
    [colors, name, locked, setPreset, shuffle, toggleLock, reset, motionPaused],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePalette() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePalette outside provider');
  return v;
}

export { PRESETS };

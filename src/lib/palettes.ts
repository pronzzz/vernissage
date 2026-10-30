// Palettes pulled from Coolors' trending list (coolors.co/palettes/trending).
// "Opening Night" is the house palette the whole site is designed around.

export type Palette = { name: string; colors: string[] };

export const PRESETS: Palette[] = [
  { name: 'Opening Night', colors: ['#003049', '#D62828', '#F77F00', '#FCBF49', '#EAE2B7'] },
  { name: 'Terra', colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'] },
  { name: 'Harbor', colors: ['#780000', '#C1121F', '#FDF0D5', '#003049', '#669BBC'] },
  { name: 'Saturday', colors: ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF'] },
  { name: 'Abyss', colors: ['#001219', '#0A9396', '#94D2BD', '#EE9B00', '#AE2012'] },
  { name: 'Orchard', colors: ['#283618', '#606C38', '#FEFAE0', '#DDA15E', '#BC6C25'] },
  { name: 'Sorbet', colors: ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF'] },
  { name: 'Nautical', colors: ['#1D3557', '#457B9D', '#A8DADC', '#F1FAEE', '#E63946'] },
  { name: 'Ember', colors: ['#03071E', '#6A040F', '#D00000', '#F48C06', '#FFBA08'] },
  { name: 'Marmalade', colors: ['#023047', '#219EBC', '#8ECAE6', '#FFB703', '#FB8500'] },
  { name: 'Fig', colors: ['#5F0F40', '#9A031E', '#FB8B24', '#E36414', '#0F4C5C'] },
  { name: 'Garden', colors: ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749'] },
];

export const HOUSE = PRESETS[0];

// ---- colour maths -------------------------------------------------------

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

export function withAlpha(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** Readable text colour (ink or bone) for a swatch. */
export function onColor(hex: string) {
  return luminance(hex) > 0.36 ? '#00121C' : '#F5F0DA';
}

/** Sorted darkest → lightest, used by the art engine to pick grounds. */
export function byLightness(colors: string[]) {
  return [...colors].sort((a, b) => luminance(a) - luminance(b));
}

/** A rough, friendly name for a hex – shown in the Palette Lab like Coolors does. */
export function colorName(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d < 0.08) return l > 0.85 ? 'Gallery White' : l > 0.55 ? 'Plaster' : l > 0.25 ? 'Graphite' : 'Ink';
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  const dark = l < 0.3;
  const light = l > 0.75;
  const names: [number, string, string, string][] = [
    [15, 'Oxblood', 'Vermilion', 'Blush'],
    [36, 'Rust', 'Tangerine', 'Apricot'],
    [65, 'Ochre', 'Saffron', 'Butter'],
    [95, 'Olive', 'Chartreuse', 'Lime Cream'],
    [160, 'Forest', 'Viridian', 'Mint'],
    [195, 'Deep Teal', 'Cerulean', 'Seafoam'],
    [235, 'Prussian', 'Cobalt', 'Powder'],
    [275, 'Indigo', 'Violet', 'Lavender'],
    [330, 'Plum', 'Magenta', 'Orchid'],
    [361, 'Oxblood', 'Crimson', 'Rose'],
  ];
  const row = names.find(([limit]) => h < limit)!;
  return dark ? row[1] : light ? row[3] : row[2];
}

/**
 * Coolors-style generator: respects locked slots, builds a loose harmony
 * around a random base hue and guarantees one dark and one light colour.
 */
export function generatePalette(current: string[], locked: boolean[], rand = Math.random): string[] {
  const base = rand() * 360;
  const schemes = [
    [0, 30, 60, 180, 210],
    [0, 120, 240, 30, 200],
    [0, 150, 210, 20, 180],
    [0, 15, 30, 45, 200],
    [0, 180, 20, 200, 40],
  ];
  const offsets = schemes[Math.floor(rand() * schemes.length)];
  const lights = [0.14 + rand() * 0.08, 0.38 + rand() * 0.1, 0.52 + rand() * 0.08, 0.66 + rand() * 0.08, 0.86 + rand() * 0.06];
  // shuffle lightness slots so the dark isn't always first
  const order = [0, 1, 2, 3, 4].sort(() => rand() - 0.5);
  return current.map((c, i) => {
    if (locked[i]) return c;
    const hue = base + offsets[i] + (rand() - 0.5) * 16;
    const l = lights[order[i]];
    const s = l < 0.2 || l > 0.85 ? 0.35 + rand() * 0.3 : 0.6 + rand() * 0.35;
    return hslToHex(hue, s, l);
  });
}

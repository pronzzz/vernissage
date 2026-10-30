import type { ArtKind, Ground } from '@/art/engine';

// All people, works and quotes below are fictional demo content.

export interface Work {
  id: string;
  title: string;
  artist: string;
  city: string;
  year: number;
  kind: ArtKind;
  seed: number;
  ground: Ground;
  size: string;
  edition: string;
  price: string;
  note: string;
  ratio: 'portrait' | 'square' | 'landscape';
}

export const WORKS: Work[] = [
  { id: 'w01', title: 'Weather for Two Rooms', artist: 'Inès Kovač', city: 'Lyon', year: 2026, kind: 'flow', seed: 1184, ground: 'dark', size: '120 × 150 cm', edition: '1 / 1', price: '€4,200', note: 'Ten thousand strands follow a wind that only exists in the gallery. Every visitor gets a slightly different breeze.', ratio: 'portrait' },
  { id: 'w02', title: 'Bauhaus, Rearranged', artist: 'Tomás Ferreira', city: 'Porto', year: 2025, kind: 'grid', seed: 77, ground: 'light', size: '100 × 100 cm', edition: '3 / 12', price: '€1,850', note: 'A tile set borrowed from a 1923 workshop and shuffled by a die that never lands the same way twice.', ratio: 'square' },
  { id: 'w03', title: 'Slow Planet', artist: 'Amara Okafor', city: 'Lagos', year: 2026, kind: 'orbit', seed: 2203, ground: 'dark', size: '140 × 110 cm', edition: '1 / 1', price: '€5,600', note: 'Orbits that never close. The sun sits off-centre because nothing in the studio was ever level.', ratio: 'landscape' },
  { id: 'w04', title: 'Sediment, Late Summer', artist: 'Yuki Tanabe', city: 'Kyoto', year: 2024, kind: 'strata', seed: 9051, ground: 'light', size: '90 × 120 cm', edition: '2 / 8', price: '€2,300', note: 'Layered hillsides from a train window, compressed into twelve bands of memory.', ratio: 'portrait' },
  { id: 'w05', title: 'Garden of Small Arguments', artist: 'Léa Marchetti', city: 'Milan', year: 2026, kind: 'bloom', seed: 4410, ground: 'dark', size: '110 × 110 cm', edition: '1 / 1', price: '€3,900', note: 'Six hundred circles, each one refusing to touch its neighbour.', ratio: 'square' },
  { id: 'w06', title: 'Vibrato', artist: 'Jonah Weiss', city: 'Berlin', year: 2025, kind: 'weave', seed: 318, ground: 'dark', size: '150 × 100 cm', edition: '5 / 20', price: '€1,400', note: 'Op-art stripes that hum when you walk past them. Best viewed while slightly moving.', ratio: 'landscape' },
  { id: 'w07', title: 'Broken Window Theory', artist: 'Priya Raman', city: 'Mumbai', year: 2026, kind: 'shards', seed: 6612, ground: 'light', size: '100 × 130 cm', edition: '1 / 1', price: '€4,750', note: 'A pane of glass, split eight times by chance, then reassembled in colour.', ratio: 'portrait' },
  { id: 'w08', title: 'Signal / Noise', artist: 'Mateo Ruiz', city: 'Mexico City', year: 2025, kind: 'dots', seed: 5120, ground: 'dark', size: '120 × 120 cm', edition: '4 / 10', price: '€1,950', note: 'A newspaper halftone of a photograph that was never taken.', ratio: 'square' },
  { id: 'w09', title: 'Night Bus Lines', artist: 'Freya Lindqvist', city: 'Stockholm', year: 2026, kind: 'flow', seed: 803, ground: 'light', size: '90 × 130 cm', edition: '1 / 1', price: '€2,800', note: 'Routes traced on a fogged window, from the last bus home.', ratio: 'portrait' },
  { id: 'w10', title: 'Quarter Circles for Anni', artist: 'Noor Haddad', city: 'Beirut', year: 2024, kind: 'grid', seed: 1901, ground: 'dark', size: '80 × 80 cm', edition: '6 / 15', price: '€1,200', note: 'A quiet homage to weaving: arcs as threads, the grid as the loom.', ratio: 'square' },
  { id: 'w11', title: 'Equinox Machine', artist: 'Sam Achterberg', city: 'Rotterdam', year: 2025, kind: 'orbit', seed: 37, ground: 'light', size: '130 × 100 cm', edition: '1 / 1', price: '€3,300', note: 'A clock with no numbers, keeping time for a planet with a longer year.', ratio: 'landscape' },
  { id: 'w12', title: 'Coastline (Unfinished)', artist: 'Chloé Dubois', city: 'Marseille', year: 2026, kind: 'strata', seed: 7777, ground: 'dark', size: '160 × 90 cm', edition: '1 / 1', price: '€5,100', note: 'The sea keeps rewriting the edge of the land. So does the algorithm.', ratio: 'landscape' },
  { id: 'w13', title: 'Pollen Count', artist: 'Kwame Mensah', city: 'Accra', year: 2025, kind: 'bloom', seed: 120, ground: 'light', size: '100 × 120 cm', edition: '2 / 6', price: '€2,650', note: 'Spring, measured in rings. Allergy sufferers, approach with caution.', ratio: 'portrait' },
  { id: 'w14', title: 'Moiré Lullaby', artist: 'Hana Sato', city: 'Osaka', year: 2026, kind: 'weave', seed: 2468, ground: 'light', size: '100 × 100 cm', edition: '1 / 1', price: '€2,200', note: 'Stripes that rock back and forth like a cot at 3am.', ratio: 'square' },
  { id: 'w15', title: 'Stained Glass for Atheists', artist: 'Oskar Nowak', city: 'Kraków', year: 2024, kind: 'shards', seed: 1357, ground: 'dark', size: '110 × 150 cm', edition: '1 / 1', price: '€4,000', note: 'Cathedral light without the cathedral.', ratio: 'portrait' },
  { id: 'w16', title: 'Crowd at a Distance', artist: 'Aisha Bello', city: 'Abuja', year: 2026, kind: 'dots', seed: 8642, ground: 'light', size: '140 × 100 cm', edition: '3 / 9', price: '€2,100', note: 'From far away, a festival. Up close, every dot is on its own.', ratio: 'landscape' },
];

export const SEASON = WORKS.slice(0, 8);

export type Role = 'Artist' | 'Curator' | 'Collective';
export interface Person {
  name: string;
  role: Role;
  discipline: string;
  city: string;
  country: string;
  open: boolean;
  seed: number;
  works: number;
}

export const PEOPLE: Person[] = [
  { name: 'Inès Kovač', role: 'Artist', discipline: 'Generative painting', city: 'Lyon', country: 'FR', open: true, seed: 1184, works: 42 },
  { name: 'Thomas Oosterhof', role: 'Curator', discipline: 'Digital & net art', city: 'Amsterdam', country: 'NL', open: false, seed: 902, works: 18 },
  { name: 'Amara Okafor', role: 'Artist', discipline: 'Installation', city: 'Lagos', country: 'NG', open: true, seed: 2203, works: 27 },
  { name: 'Isabela Galeano', role: 'Curator', discipline: 'Latin American modernism', city: 'New York', country: 'US', open: true, seed: 450, works: 31 },
  { name: 'Studio Halftone', role: 'Collective', discipline: 'Print & risograph', city: 'Glasgow', country: 'UK', open: false, seed: 5120, works: 64 },
  { name: 'Yuki Tanabe', role: 'Artist', discipline: 'Landscape, plotter', city: 'Kyoto', country: 'JP', open: false, seed: 9051, works: 19 },
  { name: 'Alberto Balocca', role: 'Artist', discipline: 'Sculpture', city: 'Turin', country: 'IT', open: true, seed: 3301, works: 23 },
  { name: 'Priya Raman', role: 'Artist', discipline: 'Glass & light', city: 'Mumbai', country: 'IN', open: true, seed: 6612, works: 15 },
  { name: 'Marguerite Sall', role: 'Curator', discipline: 'Contemporary African art', city: 'Dakar', country: 'SN', open: true, seed: 2716, works: 22 },
  { name: 'Jonah Weiss', role: 'Artist', discipline: 'Op art', city: 'Berlin', country: 'DE', open: false, seed: 318, works: 38 },
  { name: 'Collectif Marée', role: 'Collective', discipline: 'Public space', city: 'Marseille', country: 'FR', open: true, seed: 7777, works: 12 },
  { name: 'Mateo Ruiz', role: 'Artist', discipline: 'Photography, halftone', city: 'Mexico City', country: 'MX', open: true, seed: 8810, works: 51 },
  { name: 'Ingrid Solberg', role: 'Curator', discipline: 'Nordic design', city: 'Oslo', country: 'NO', open: false, seed: 640, works: 9 },
  { name: 'Noor Haddad', role: 'Artist', discipline: 'Textile', city: 'Beirut', country: 'LB', open: true, seed: 1901, works: 33 },
  { name: 'The Long Table', role: 'Collective', discipline: 'Food & performance', city: 'Melbourne', country: 'AU', open: false, seed: 4040, works: 7 },
  { name: 'Kwame Mensah', role: 'Artist', discipline: 'Painting', city: 'Accra', country: 'GH', open: true, seed: 120, works: 29 },
  { name: 'Elena Rossi', role: 'Curator', discipline: 'Art direction', city: 'Rome', country: 'IT', open: true, seed: 5555, works: 14 },
  { name: 'Hana Sato', role: 'Artist', discipline: 'Kinetic art', city: 'Osaka', country: 'JP', open: false, seed: 2468, works: 21 },
  { name: 'Oskar Nowak', role: 'Artist', discipline: 'Stained glass', city: 'Kraków', country: 'PL', open: true, seed: 1357, works: 17 },
  { name: 'Wen Li', role: 'Curator', discipline: 'Media art', city: 'Shanghai', country: 'CN', open: true, seed: 8124, works: 26 },
];

export const QUOTES = [
  { text: 'I had a studio full of work and no room to show it. Three weeks after joining, a curator in Lisbon found me through the Directory.', name: 'Inès Kovač', role: 'Generative painter, Lyon', seed: 1184 },
  { text: 'The Pass replaced my PDF portfolio, my Linktree and about forty awkward emails.', name: 'Mateo Ruiz', role: 'Photographer, Mexico City', seed: 8810 },
  { text: 'No algorithm, no paywall. I search by city and discipline and actually find people.', name: 'Isabela Galeano', role: 'Curator, New York', seed: 450 },
  { text: 'Our first online opening had 2,300 people in the room. Our physical one had 60.', name: 'Collectif Marée', role: 'Collective, Marseille', seed: 7777 },
  { text: 'It feels like a gallery built by people who have actually hung a show.', name: 'Thomas Oosterhof', role: 'Curator, Amsterdam', seed: 902 },
  { text: 'I recoloured my whole portfolio with one palette. My gallerist thought I had made a new series.', name: 'Jonah Weiss', role: 'Op artist, Berlin', seed: 318 },
  { text: 'The Salons are the art school seminar I never could afford.', name: 'Kwame Mensah', role: 'Painter, Accra', seed: 120 },
  { text: 'Finally a place where curators and artists meet as equals.', name: 'Marguerite Sall', role: 'Curator, Dakar', seed: 2716 },
  { text: 'Sold two editions on opening night. To a dentist in Helsinki. Love that for me.', name: 'Priya Raman', role: 'Glass artist, Mumbai', seed: 6612 },
];

export const TIERS = [
  {
    name: 'Studio',
    blurb: 'For artists getting their work seen.',
    monthly: 0,
    yearly: 0,
    cta: 'Start free',
    features: ['Your Vernissage Pass', 'Directory listing', 'Up to 24 works', 'Join any opening'],
  },
  {
    name: 'Salon',
    blurb: 'For working artists and independent curators.',
    monthly: 12,
    yearly: 9,
    cta: 'Get Salon',
    featured: true,
    features: ['Everything in Studio', 'Unlimited works & editions', 'Host 2 openings a month', 'Monthly Salon seminars', 'Sales with 0% commission'],
  },
  {
    name: 'Institution',
    blurb: 'For galleries, schools and collectives.',
    monthly: 59,
    yearly: 49,
    cta: 'Talk to us',
    features: ['Everything in Salon', 'Up to 25 member Passes', 'Unlimited openings', 'Open calls & submissions', 'Priority curation support'],
  },
];

export const FAQ = [
  { q: 'Is Vernissage a real platform?', a: 'This site is a design demo. Everything you see, from the artists and artworks to the prices, is made up. The artworks are generated live in your browser from a seed and the current palette.' },
  { q: 'What is a Vernissage Pass?', a: 'A shareable card that holds your portfolio, bio, links and availability. Add it to your phone wallet and share it with a tap, so nobody has to say "find me on Insta" at an opening again.' },
  { q: 'How do openings work?', a: 'Hosts schedule a date, hang up to 30 works in a virtual room and invite people. Guests walk the room together, chat with the artist and can reserve editions live.' },
  { q: 'Do you take a commission on sales?', a: 'Not on Salon or Institution plans. Studio members pay a flat 5% on sales to keep the lights on.' },
  { q: 'Can curators use it for free?', a: 'Yes. Curators get Salon features free for their first season. We want more people discovering work, not fewer.' },
  { q: 'Why does every artwork change colour?', a: 'Because you changed the palette. Try the Palette Lab, or press ⌘K and choose "Shuffle palette". Each work is a seed, so the composition stays the same while the colours change.' },
];

export const PILLARS = [
  { n: '01', title: 'The Pass', body: 'A living portfolio card that fits in your wallet and opens on any phone.', kind: 'shards' as ArtKind, seed: 41 },
  { n: '02', title: 'The Directory', body: 'Find curators and artists by city, discipline and studio hours. Nobody pays to be found.', kind: 'dots' as ArtKind, seed: 92 },
  { n: '03', title: 'Openings', body: 'Host a vernissage online. The room is shared, the chat is live, and editions sell on the night.', kind: 'orbit' as ArtKind, seed: 13 },
  { n: '04', title: 'Salons', body: 'Monthly seminars and critiques from working artists and curators, open to every member.', kind: 'grid' as ArtKind, seed: 58 },
];

export const NAV = [
  { label: 'Season', href: '#season' },
  { label: 'Collection', href: '#collection' },
  { label: 'Pass', href: '#pass' },
  { label: 'Directory', href: '#directory' },
  { label: 'Membership', href: '#membership' },
];

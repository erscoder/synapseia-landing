// Hard-coded sample distribution of Synapseia nodes for the
// `WorldMap` landing visualization. Picked to look visually
// plausible — major data-center metros + a few consumer hotspots
// across NA / EU / APAC / LATAM. Swapped for a real coordinator
// endpoint in a future slice; for now the landing is purely
// marketing and renders this static set on every page load.
//
// Tier mapping matches the landing palette:
//   cpu       → cyan-400
//   gpu       → fuchsia-500  (closest Tailwind color to "magenta")
//   inference → emerald-400  (consistent with EarnBand / KnowledgeGraph)

export type SampleNodeTier = 'cpu' | 'gpu' | 'inference';

export interface SampleNode {
  id: string;
  lat: number;
  lon: number;
  tier: SampleNodeTier;
}

export const SAMPLE_NODES: SampleNode[] = [
  // North America
  { id: 'sf',   lat: 37.7749, lon: -122.4194, tier: 'gpu' },
  { id: 'sea', lat: 47.6062, lon: -122.3321, tier: 'cpu' },
  { id: 'la',   lat: 34.0522, lon: -118.2437, tier: 'inference' },
  { id: 'dal', lat: 32.7767, lon: -96.7970,  tier: 'cpu' },
  { id: 'chi', lat: 41.8781, lon: -87.6298,  tier: 'gpu' },
  { id: 'atl', lat: 33.7490, lon: -84.3880,  tier: 'inference' },
  { id: 'ash', lat: 39.0438, lon: -77.4874,  tier: 'gpu' },
  { id: 'nyc', lat: 40.7128, lon: -74.0060,  tier: 'gpu' },
  { id: 'tor', lat: 43.6532, lon: -79.3832,  tier: 'cpu' },
  // Europe
  { id: 'lon', lat: 51.5074, lon: -0.1278,   tier: 'gpu' },
  { id: 'dub', lat: 53.3498, lon: -6.2603,   tier: 'cpu' },
  { id: 'par', lat: 48.8566, lon: 2.3522,    tier: 'inference' },
  { id: 'ams', lat: 52.3676, lon: 4.9041,    tier: 'gpu' },
  { id: 'fra', lat: 50.1109, lon: 8.6821,    tier: 'gpu' },
  { id: 'mad', lat: 40.4168, lon: -3.7038,   tier: 'cpu' },
  { id: 'bcn', lat: 41.3851, lon: 2.1734,    tier: 'inference' },
  { id: 'mil', lat: 45.4642, lon: 9.1900,    tier: 'cpu' },
  { id: 'sto', lat: 59.3293, lon: 18.0686,   tier: 'inference' },
  // Asia / Oceania
  { id: 'tyo', lat: 35.6762, lon: 139.6503,  tier: 'gpu' },
  { id: 'sgp', lat: 1.3521,  lon: 103.8198,  tier: 'gpu' },
  { id: 'hkg', lat: 22.3193, lon: 114.1694,  tier: 'inference' },
  { id: 'mum', lat: 19.0760, lon: 72.8777,   tier: 'cpu' },
  { id: 'syd', lat: -33.8688, lon: 151.2093, tier: 'inference' },
  // South America
  { id: 'sao', lat: -23.5505, lon: -46.6333, tier: 'cpu' },
  { id: 'bsb', lat: -15.8267, lon: -47.9218, tier: 'inference' },
];

export interface SampleEdge {
  from: string;
  to: string;
}

// Sparse mesh — picked by hand to look balanced across
// continents and to highlight typical NA↔EU and EU↔APAC
// long-haul links the real network already exhibits.
export const SAMPLE_EDGES: SampleEdge[] = [
  // NA intra
  { from: 'sf', to: 'sea' }, { from: 'sf', to: 'la' },
  { from: 'la', to: 'dal' }, { from: 'dal', to: 'atl' },
  { from: 'chi', to: 'nyc' }, { from: 'ash', to: 'nyc' },
  { from: 'tor', to: 'nyc' }, { from: 'chi', to: 'dal' },
  // EU intra
  { from: 'lon', to: 'dub' }, { from: 'lon', to: 'par' },
  { from: 'par', to: 'ams' }, { from: 'ams', to: 'fra' },
  { from: 'fra', to: 'mil' }, { from: 'mad', to: 'bcn' },
  { from: 'par', to: 'mad' }, { from: 'sto', to: 'fra' },
  // NA ↔ EU
  { from: 'nyc', to: 'lon' }, { from: 'ash', to: 'fra' },
  { from: 'tor', to: 'dub' },
  // EU ↔ APAC
  { from: 'fra', to: 'mum' }, { from: 'fra', to: 'sgp' },
  // APAC intra
  { from: 'tyo', to: 'sgp' }, { from: 'sgp', to: 'hkg' },
  { from: 'hkg', to: 'tyo' }, { from: 'sgp', to: 'syd' },
  { from: 'mum', to: 'sgp' },
  // NA ↔ APAC
  { from: 'sf', to: 'tyo' }, { from: 'la', to: 'syd' },
  // SA
  { from: 'sao', to: 'bsb' }, { from: 'sao', to: 'atl' },
];

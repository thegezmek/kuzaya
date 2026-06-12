export type Country = 'kenya' | 'rwanda';

export type LandCoverClass =
  | 'water'
  | 'trees'
  | 'flooded'
  | 'crops'
  | 'built'
  | 'bare'
  | 'range';

function formatElevation(meters: number): string {
  return `${meters.toLocaleString('en-GB')} m`;
}

export interface Location {
  id: string;
  name: string;
  region: string;
  country: Country;
  lat: number;
  lng: number;
  elevationM: number;
  elevation: string;
  landCover: LandCoverClass;
  featured: boolean;
  contributor?: string;
  fragment: string;
  story: string;
  focus: string[];
  photo: {
    src: string;
    alt: string;
    caption: string;
  };
}

function loc(
  base: Omit<Location, 'elevation'> & { elevationM: number },
): Location {
  return { ...base, elevation: formatElevation(base.elevationM) };
}

const rawLocations: Location[] = [
  loc({
    id: 'homa-bay',
    name: 'Homa Bay',
    region: 'Homa Bay County',
    country: 'kenya',
    lat: -0.5273,
    lng: 34.4571,
    elevationM: 1131,
    landCover: 'water',
    featured: true,
    contributor: 'BioSorra',
    fragment:
      'Smallholders hold red laterite in their palms — soil that has fed generations and now asks something back.',
    story:
      'Along the shores of Lake Victoria, farmers navigate soil degradation, pest pressure, and economic constraints while maintaining food production. BioSorra and local practitioners experiment with methods designed to rebuild soil life and restore long-term fertility without escalating chemical dependency.',
    focus: ['Soil health', 'Circular farming', 'Rural livelihoods'],
    photo: {
      src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
      alt: 'Farmer in field at dawn, East Africa',
      caption: 'Field observation — Homa Bay County',
    },
  }),
  loc({
    id: 'uasin-gishu',
    name: 'Uasin Gishu',
    region: 'Uasin Gishu County',
    country: 'kenya',
    lat: 0.5143,
    lng: 35.2698,
    elevationM: 2100,
    landCover: 'crops',
    featured: true,
    contributor: 'ICIPE',
    fragment:
      'Insect farming operations hum beside maize belts — science and practice sharing the same highland air.',
    story:
      "Researchers at ICIPE study soil health, pest management, and alternative farming practices in one of Kenya's most productive cereal regions. The film follows investigations into biological foundations of soil and enterprises exploring new production models at the edge of conventional agriculture.",
    focus: ['Agricultural innovation', 'Pest management', 'Research environments'],
    photo: {
      src: 'https://images.unsplash.com/photo-1574943329829-7571bea4f1da?w=800&q=80',
      alt: 'Agricultural research field, highland Kenya',
      caption: 'Research fieldwork — Uasin Gishu',
    },
  }),
  loc({
    id: 'nairobi',
    name: 'Nairobi',
    region: 'Nairobi County',
    country: 'kenya',
    lat: -1.2864,
    lng: 36.8172,
    elevationM: 1795,
    landCover: 'built',
    featured: false,
    contributor: 'Marula · Nairobi University',
    fragment:
      'Policy, academia, and supply chains converge where the city meets the question of what feeds our food.',
    story:
      "Institutional and commercial perspectives anchor the film's wider context — scientists and practitioners from universities, government agencies, and private sector organisations articulate how agricultural knowledge moves between field practice and policy.",
    focus: ['Agricultural policy', 'Academic research', 'Supply chain'],
    photo: {
      src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
      alt: 'Urban edge meeting agricultural landscape',
      caption: 'Institutional context — Nairobi',
    },
  }),
  loc({
    id: 'kirinyaga',
    name: 'Kirinyaga',
    region: 'Kirinyaga County',
    country: 'kenya',
    lat: -0.498,
    lng: 37.2804,
    elevationM: 1280,
    landCover: 'crops',
    featured: false,
    fragment:
      'Terraced slopes carry tea and maize — fertility measured in seasons, not spreadsheets.',
    story:
      "Central Kenya's high-potential farming country, where declining soil fertility and rising input costs press against traditions of intensive smallholder production.",
    focus: ['Soil fertility', 'Smallholder farming'],
    photo: {
      src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      alt: 'Terraced agricultural landscape',
      caption: 'Central highlands — Kirinyaga',
    },
  }),
  loc({
    id: 'embu',
    name: 'Embu',
    region: 'Embu County',
    country: 'kenya',
    lat: -0.5395,
    lng: 37.4574,
    elevationM: 1500,
    landCover: 'crops',
    featured: false,
    fragment: 'Coffee and maize on eastern slopes — rain arrives like a decision deferred.',
    story:
      'Eastern foothills of Mount Kenya, documenting how farmers confront climate pressures and input dependency in mixed cropping systems.',
    focus: ['Climate pressures', 'Mixed cropping'],
    photo: {
      src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      alt: 'Rain over cultivated hills',
      caption: 'Eastern slopes — Embu',
    },
  }),
  loc({
    id: 'kajiado',
    name: 'Kajiado',
    region: 'Kajiado County',
    country: 'kenya',
    lat: -2.098,
    lng: 36.782,
    elevationM: 1700,
    landCover: 'range',
    featured: false,
    fragment: 'Rangeland meets cultivation — the weight of soil changes with every horizon.',
    story:
      "Southern Kenya's transition zone between pastoral and agricultural livelihoods, where land cover shifts and production models are reconsidered.",
    focus: ['Rangeland', 'Rural livelihoods'],
    photo: {
      src: 'https://images.unsplash.com/photo-1500595046743-cd2713086c8e?w=800&q=80',
      alt: 'Open rangeland and distant hills',
      caption: 'Southern transition — Kajiado',
    },
  }),
  loc({
    id: 'thika',
    name: 'Thika',
    region: 'Kiambu County',
    country: 'kenya',
    lat: -1.0333,
    lng: 37.0693,
    elevationM: 1631,
    landCover: 'crops',
    featured: false,
    contributor: 'OFIMAK',
    fragment: 'Industrial agriculture and innovation share the same red earth.',
    story:
      'Agricultural enterprises and processing operations where commercial production meets experiments in regenerative and circular systems.',
    focus: ['Agricultural enterprises', 'Circular systems'],
    photo: {
      src: 'https://images.unsplash.com/photo-1464226184883-fa280b87d399?w=800&q=80',
      alt: 'Commercial farming operation',
      caption: 'Enterprise — Thika corridor',
    },
  }),
  loc({
    id: 'kigali',
    name: 'Kigali',
    region: 'Kigali',
    country: 'rwanda',
    lat: -1.9403,
    lng: 30.0588,
    elevationM: 1567,
    landCover: 'built',
    featured: false,
    contributor: "Solid'Africa",
    fragment:
      "Rwanda's capital holds the policy and practice of a nation rebuilding its relationship to land.",
    story:
      "Urban and institutional vantage points on Rwanda's agricultural transition — connecting East African narratives of soil health and food security across borders.",
    focus: ['Policy context', 'Food security', 'Cross-border practice'],
    photo: {
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      alt: 'Hills surrounding Kigali at dusk',
      caption: 'Capital vantage — Kigali',
    },
  }),
  loc({
    id: 'kinigi',
    name: 'Kinigi',
    region: 'Northern Province',
    country: 'rwanda',
    lat: -1.4721,
    lng: 29.5564,
    elevationM: 2400,
    landCover: 'trees',
    featured: true,
    fragment:
      'Volcanic soils at the forest edge — where altitude sharpens every question about what the land can sustain.',
    story:
      "Northern Rwanda's highland farming country near the Virunga range. The film traces regenerative experiments and field practice where altitude, biodiversity, and soil biology intersect — a counterpoint to Kenya's cereal belts and lake shores.",
    focus: ['Regenerative practice', 'Highland agriculture', 'Soil biology'],
    photo: {
      src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      alt: 'Misty highland agriculture near forest',
      caption: 'Volcanic highlands — Kinigi',
    },
  }),
];

export const locations: Location[] = rawLocations;

export const centralQuestion = 'What feeds our food?';

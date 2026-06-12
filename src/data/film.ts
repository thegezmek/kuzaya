import { getVisiblePeople, voicesSectionCopy } from './voices';

export type { Voice } from './voices';

export const film = {
  title: 'KUZAYA',
  version: '2.0',
  countries: 'Kenya · Rwanda',
  tagline: 'To know. To understand.',
  instruction: 'drag kenya → rwanda · explore production locations',
  status: 'Post-Production',
  runtime: '60 minutes',
  year: '2026',

  headline: 'What feeds our food?',
  subheading:
    'A feature documentary exploring the connection between soil, food and human health.',
  heroBody:
    'Through the voices of farmers, scientists, journalists and innovators, Kuzaya investigates how declining soil health may be shaping the quality of our food and the health of future generations.',

  trailer: {
    headline: 'TRAILER',
    subheading: 'Filmed across nine locations in Kenya and Rwanda.',
    runtime: '24″',
    caption: 'Two years in the field, condensed into twenty-four seconds.',
    videoSrc: '/trailer/trailer.mp4',
    posterSrc: '/hero/poster.jpg',
    /** Paste a YouTube or Vimeo embed URL to override the local file */
    embedUrl: 'https://vimeo.com/1170298182/86b5767828',
    watchUrl: 'https://vimeo.com/1170298182/86b5767828',
  },

  map: {
    headlineLines: ['FILMED ACROSS', 'EAST AFRICA'],
    subheading: 'Explore the locations, landscapes and people behind the film.',
    body: 'Produced across nine locations in Kenya and Rwanda, Kuzaya moves between rural farming communities, urban research centres, local markets and food enterprises, revealing the diverse network of people connected by the future of the region\'s soils.',
  },

  story:
    'Across East Africa, the ground that grows the region\'s food is quietly changing. Built on decades of increasing chemical inputs, today\'s food system faces a growing question: what happens when the health of the soil begins to decline? Kuzaya explores what is at stake for the future of food, farming and human wellbeing.',

  whyNow:
    'The relationship between soil, food and human health is only beginning to enter public conversation. As questions around food quality, agricultural resilience and environmental change grow more urgent, the choices being made today may shape the health of future generations.',

  approach:
    'Kuzaya takes an observational approach, connecting perspectives from across agriculture, science, industry and civil society. By bringing together voices that rarely share the same conversation, the film seeks to build a more complete picture of the relationship between soil, food and human health.',

  pullQuote: {
    kicker: 'From the field',
    text: 'Once you lose a centimetre of soil, restoring it takes close to a hundred years. The loss of soil is a silent killer.',
    name: 'Boaz Wasser',
    role: 'Senior Scientist, Alliance of Bioversity International & CIAT',
    photoSrc: '/voices/boaz-wasser.jpg',
  },

  focusAreas: [
    'Soil Health',
    'Circular Farming Systems',
    'Agricultural Innovation',
    'Rural Livelihoods',
    'Agricultural Policy',
    'Food Safety & Human Health',
  ],

  directorNote: {
    name: 'Lewis Levent',
    role: 'Director, Kuzaya',
    photoSrc: '/team/lewis-levent.jpg',
    paragraphs: [
      'Kuzaya belongs to a body of work concerned with how communities sustain themselves as the environmental and social systems they depend on come under pressure. Here, that inquiry turns toward the ground beneath East Africa\'s food systems, and toward what can still be restored once soil begins to fail.',
      'Its structure mirrors its subject. A problem distributed across an entire system could not honestly be carried by a single protagonist, so the film is composed to hold many positions at once and to find its meaning in the relationships between them. The result is not a crisis with one cause or one cure, but a set of tensions the film keeps open rather than resolves.',
      'What it ultimately documents is a question of time, knowledge and collective will: whether the foundations of food production can be rebuilt at their source, and what that would mean not only for the land but for the people whose lives are built on it.',
    ],
  },

  stills: {
    subheading: 'From the field — Kenya and Rwanda, 2024–2026.',
  },

  voices: {
    ...voicesSectionCopy,
    people: getVisiblePeople(),
  },

  marula: {
    headline: 'In co-production with',
    logoSrc: '/partners/marula-logo.png',
    subheading:
      'A film made from inside East Africa\'s agricultural sector — not about it from a distance.',
    body: 'Kuzaya is co-produced with Marula, an East Africa-based agribusiness that turns organic waste into organic and organo-mineral fertilizers for the region\'s farming systems. Their access and technical expertise place the film inside the sector it documents, alongside the people and institutions shaping its future.',
    url: 'https://weareproteen.com/',
    cta: 'Learn more about Marula',
  },

  partners: {
    headline: 'Featured organizations',
    subheading: 'The institutions and enterprises whose work made this film possible.',
    items: [
      {
        id: 'biosorra',
        name: 'BioSorra',
        url: 'https://www.biosorra.com/',
        logoSrc: '/partners/logos/biosorra.png',
      },
      {
        id: 'icipe',
        name: 'ICIPE',
        url: 'https://www.icipe.org/',
        logoSrc: '/partners/logos/icipe.png',
      },
      {
        id: 'uon',
        name: 'University of Nairobi',
        url: 'https://www.uonbi.ac.ke/',
        logoSrc: '/partners/logos/uon.png',
      },
      {
        id: 'solidafrica',
        name: "Solid'Africa",
        url: 'https://www.solidafrica.org/',
        logoSrc: '/partners/logos/solidafrica.png',
      },
      {
        id: 'ofimak',
        name: 'OFIMAK',
        url: 'https://ofimak.co.ke/',
        logoSrc: '/partners/logos/ofimak.png',
      },
    ],
  },

  credits: {
    director: { name: 'Lewis Levent', role: 'Director · Editor' },
    producer: { name: 'Vigilance Atieno', role: 'Producer' },
    executive: ['Tommie Hooft', 'Julian Oliver'],
    production: 'Gez Studio',
    productionUrl: 'https://gez.studio/',
    coProduction: 'Marula',
  },

  contact: {
    intro:
      'For inquiries regarding Kuzaya — screenings, partnership, funding or press — please reach the team directly.',
    people: [
      {
        name: 'Lewis Levent',
        role: 'Director',
        linkedin: 'https://www.linkedin.com/in/lewislevent',
      },
      {
        name: 'Tommie Hooft',
        role: 'Executive Producer',
        linkedin: 'https://www.linkedin.com/in/tommie-hooft',
      },
    ],
  },

  support: {
    headline: 'Help finish KUZAYA',
    heroCta: 'Partner with the film',
    body: [
      'Completion funding now carries Kuzaya, filmed across Kenya and Rwanda, through its final stages: edit, score, sound design, colour and distribution, and out to the audiences it was made for.',
      'We are building it with a small group of funders and partners who believe a film about the future of food in East Africa is worth finishing, and finishing well.',
    ],
    cta: {
      label: 'Partner with the film',
      href: 'mailto:hi@gez.studio?subject=Kuzaya%20Partnership',
    },
  },

  footer: {
    headline: 'Subscribe to follow Kuzaya to completion.',
    newsletter:
      'Dispatches from the edit and the field, the people behind the film, and the first word on screenings and release. A few times a year.',
    newsletterPlaceholder: 'Email address',
    newsletterCta: 'Sign up',
    social: {
      instagram: 'https://www.instagram.com/gez.studio/',
      linkedin: 'https://www.linkedin.com/company/gez-studio/',
    },
    legal: 'A Gez Studio Production · © 2026',
    legalUrl: 'https://gez.studio/',
  },

  branding: {
    production: 'A Gez Studio Production',
    copyright: '© 2026 Gez Studio Ltd.',
    footer: 'A Gez Studio Production · © 2026',
  },
} as const;

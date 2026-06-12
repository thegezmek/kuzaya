import type { VoiceMapPosition } from './voiceMapPlaces';
import { assignVoiceMapPositions } from './voiceMapPlaces';

export interface VoiceCategory {
  id: string;
  label: string;
  lens: string;
}

export interface Voice {
  id: string;
  name: string;
  role: string;
  categoryId: string;
  location: string;
  map: VoiceMapPosition;
  bio: string;
  photoSrc?: string;
  linkedin?: string;
  isPlaceholder?: boolean;
}

export const voiceCategories: VoiceCategory[] = [
  { id: 'farmers', label: 'Farmers & Growers', lens: 'Working the land.' },
  { id: 'scientists', label: 'Scientists & Researchers', lens: 'Measuring the soil.' },
  { id: 'industry', label: 'Innovators & Industry', lens: 'Financing its future.' },
  { id: 'public', label: 'Policy & Government', lens: 'Governing the change.' },
  { id: 'journalists', label: 'Journalists & Media', lens: 'Reporting what it means.' },
];

type VoiceSeed = Omit<Voice, 'map'>;

function withPortrait(seeds: VoiceSeed[]): VoiceSeed[] {
  return seeds.map((person) => ({
    ...person,
    photoSrc: person.photoSrc ?? `/voices/${person.id}.jpg`,
  }));
}

/** Source: kuzaya-voices-profiles.md — Part 1 locations + Part 2 one-liner bios. */
const voicePeopleSeed: VoiceSeed[] = withPortrait([
  // Farmers & Growers
  {
    id: 'noah-nasiali',
    name: 'Noah Nasiali',
    role: 'Founder, Africa Farmers ("Home of African Farmers")',
    categoryId: 'farmers',
    location: 'Kajiado (Tinga)',
    bio: 'Built one of Africa\'s largest farming networks, one smallholder at a time.',
    linkedin: 'https://www.linkedin.com/in/noah-nasiali',
  },
  {
    id: 'john-roche',
    name: 'John Roche',
    role: 'Smallholder BSF Farmer',
    categoryId: 'farmers',
    location: 'Homa Bay',
    bio: 'Turns a town\'s waste into living soil with the Black Soldier Fly.',
  },
  {
    id: 'blessing',
    name: 'Blessing',
    role: 'Smallholder farmer (young / "Gen Z")',
    categoryId: 'farmers',
    location: 'Eldoret (Uasin Gishu)',
    bio: 'A Gen-Z farmer proving the future of food can start young.',
  },
  {
    id: 'vishakha-jani',
    name: 'Vishakha Jani',
    role: 'Managing Director, Jagannath Growers',
    categoryId: 'farmers',
    location: 'Embu (Bata)',
    bio: 'Left charity kitchens for the field, and never looked back.',
  },
  {
    id: 'nelly-mbita',
    name: 'Nelly Mbita',
    role: 'Smallholder farmer',
    categoryId: 'farmers',
    location: 'Homa Bay',
    bio: 'Swapped costly chemicals for cow dung, and grew more.',
  },
  {
    id: 'emmanuel',
    name: 'Emmanuel',
    role: 'Smallholder farmer (benefits from Marula fertiliser)',
    categoryId: 'farmers',
    location: 'Embu',
    bio: 'A smallholder already reaping the gains of better soil.',
  },
  {
    id: 'arufan',
    name: 'Arufan',
    role: 'Smallholder farmer (newly switching to Marula fertiliser)',
    categoryId: 'farmers',
    location: 'Embu',
    bio: 'Low yields and hope, making the switch to richer soil.',
  },

  // Scientists & Researchers
  {
    id: 'boaz-wasser',
    name: 'Boaz Wasser',
    role: 'Soil scientist, Alliance of Bioversity International & CIAT (CGIAR), hosted at ICIPE',
    categoryId: 'scientists',
    location: 'Nairobi (ICIPE, Kasarani)',
    bio: 'A centimetre of topsoil takes a hundred years to rebuild.',
    linkedin: 'https://www.linkedin.com/in/boaz-waswa-72083018',
  },
  {
    id: 'dennis-beesigamukama',
    name: 'Dr. Dennis Beesigamukama',
    role: 'Research scientist, ICIPE',
    categoryId: 'scientists',
    location: 'Nairobi (ICIPE)',
    bio: 'Proves insect frass can out-feed factory fertiliser.',
  },
  {
    id: 'chrysantus-mbi-tanga',
    name: 'Prof. Chrysantus Mbi Tanga',
    role: 'Senior Scientist & Head, Insects for Food, Feed & Other Uses programme, ICIPE',
    categoryId: 'scientists',
    location: 'Nairobi (ICIPE)',
    bio: 'Small creatures, big impact, scaled to the grassroots.',
  },
  {
    id: 'loraine-kabaka',
    name: 'Loraine Kabaka',
    role: 'Graduate Research Fellow, ICIPE; lead of Project Shambani',
    categoryId: 'scientists',
    location: 'Nairobi (Mukuru & Githurai)',
    bio: 'Uses flies and mushrooms to heal poisoned city soil.',
  },
  {
    id: 'anne-karuma',
    name: 'Dr. Anne Karuma',
    role: 'Soil scientist & researcher (soil & water management)',
    categoryId: 'scientists',
    location: 'Nairobi (likely University of Nairobi — not confirmed)',
    bio: 'Reads the soil the way a doctor reads a patient.',
  },
  {
    id: 'catherine-kunyanga',
    name: 'Prof. Catherine N. Kunyanga',
    role: 'Associate Professor & Associate Dean, Faculty of Agriculture; Coordinator, Food Security Centre — University of Nairobi',
    categoryId: 'scientists',
    location: 'Nairobi (UoN Kabete)',
    bio: 'Traces the line from the soil to what\'s on your plate.',
  },
  {
    id: 'andrew-ngetich',
    name: 'Andrew Ngetich',
    role: 'Soil scientist / agronomist, Crop Nuts',
    categoryId: 'scientists',
    location: 'Eldoret (Uasin Gishu)',
    bio: 'Tests the ground and tells farmers what it\'s really missing.',
  },
  {
    id: 'avinash-mokate',
    name: 'Avinash Mokate',
    role: 'Organic / natural-farming practitioner, Sunfloritech',
    categoryId: 'farmers',
    location: 'Naivasha',
    bio: '"The gut of the plant is the soil."',
    linkedin: 'https://www.linkedin.com/in/avinash-mokate',
  },

  // Innovators & Industry
  {
    id: 'philipp-straub',
    name: 'Philipp Straub',
    role: 'Chief Technology Officer / Co-founder, Marula (Proteen) — the film\'s funder',
    categoryId: 'industry',
    location: 'Nairobi (also Rwanda)',
    bio: 'Engineers the biology that turns waste into living soil.',
  },
  {
    id: 'jan-taeke-galama',
    name: 'Jan Taeke Galama',
    role: 'Country Manager, Holland Greentech Kenya',
    categoryId: 'industry',
    location: 'Nairobi (Holland Greentech HQ)',
    bio: 'Reads the whole agri-input industry from the inside.',
  },
  {
    id: 'grace-mugo',
    name: 'Grace Mugo',
    role: 'Project Lead, Holland Greentech Kenya',
    categoryId: 'industry',
    location: 'Nairobi (and Busia nursery)',
    bio: 'Brings clean seed and soil solutions to the field.',
  },
  {
    id: 'pascal',
    name: 'Pascal',
    role: 'Greenhouse agronomist / manager, Holland Greentech',
    categoryId: 'industry',
    location: 'Kinigi, Rwanda',
    bio: 'Grows high-value crops in disease-free, imported soil.',
  },
  {
    id: 'antony-mureithi',
    name: 'Antony Mureithi',
    role: 'Business Development Lead, BioSorra',
    categoryId: 'industry',
    location: 'Nairobi area (Kiambu)',
    bio: 'Makes biochar, "a bank for the soil."',
  },
  {
    id: 'junnie-wangari',
    name: 'Junnie Wangari',
    role: 'Chairperson, OFIMAK (Organic Fertiliser & Input Manufacturers Association of Kenya)',
    categoryId: 'industry',
    location: 'Nairobi (Riverside)',
    bio: 'Organic is under 2% of the market. She wants a revolution.',
  },
  {
    id: 'betty-kibaara',
    name: 'Betty Kibaara',
    role: 'Director, The Rockefeller Foundation',
    categoryId: 'industry',
    location: 'Nairobi (Karen)',
    bio: 'Reversed her own diabetes, and reads the whole food system.',
  },
  {
    id: 'grace-kelly-muvunyi',
    name: 'Grace Kelly Muvunyi',
    role: 'Head of Strategic Partnership Communications, Solid\'Africa',
    categoryId: 'industry',
    location: 'Kigali, Rwanda',
    bio: 'Connects Solid\'Africa\'s farms to the hospital beds they feed.',
  },
  {
    id: 'fred-kwizera',
    name: 'Dr. Fred Kwizera',
    role: 'Program Manager for Sustainable Agriculture, Solid\'Africa',
    categoryId: 'industry',
    location: 'Kigali, Rwanda',
    bio: 'Grows regenerative crops that become patients\' meals in Kigali.',
  },
  {
    id: 'dennis-andayem',
    name: 'Dennis Andayem',
    role: 'Founder, Nairobi Farmers Market',
    categoryId: 'industry',
    location: 'Nairobi (Rosslyn)',
    bio: 'Built a market where every stall is the grower.',
  },

  // Policy & Government
  {
    id: 'benedict-oduor',
    name: 'Benedict Oduor',
    role: 'Lawyer — natural-resources / ESG & sustainable finance (independent advocate)',
    categoryId: 'public',
    location: 'Nairobi',
    bio: 'Connects the soil to law, finance and accountability.',
  },
  {
    id: 'kelvin-kubai',
    name: 'Kelvin Kubai',
    role: 'Advocate of the High Court of Kenya',
    categoryId: 'public',
    location: 'Nairobi',
    bio: 'Taking the case against toxic pesticides to the High Court.',
  },
  {
    id: 'joel-rutto',
    name: 'Joel Rutto',
    role: 'Director of Agribusiness, Uasin Gishu County Government (Department of Agriculture)',
    categoryId: 'public',
    location: 'Eldoret (Uasin Gishu)',
    bio: 'Runs agriculture in Kenya\'s breadbasket county.',
  },
  {
    id: 'diana-anyango-ongere',
    name: 'Diana Anyango Ongere',
    role: 'County Chief Officer, Environment — Homa Bay County Government',
    categoryId: 'public',
    location: 'Homa Bay',
    bio: 'Confronts the hidden danger of reused pesticide containers.',
  },
  {
    id: 'wilson-juma-ochola',
    name: 'Wilson Juma Ochola',
    role: 'Chief Officer, Water & Sanitation — Homa Bay County Government',
    categoryId: 'public',
    location: 'Homa Bay',
    bio: 'Writes the rules where water, waste and farming meet.',
  },
  {
    id: 'ombok-mildred-judith',
    name: 'Ombok Mildred Judith',
    role: 'Chief Officer, Agriculture & Irrigation — Homa Bay County Government',
    categoryId: 'public',
    location: 'Homa Bay',
    bio: 'Steering a county toward feeding itself within a decade.',
  },

  // Journalists & Media
  {
    id: 'mary-mwendwa',
    name: 'Mary Mwendwa',
    role: 'Investigative journalist & editor, Talk Africa',
    categoryId: 'journalists',
    location: 'Nairobi',
    bio: 'Asks the food-and-health questions institutions would rather avoid.',
    linkedin: 'https://www.linkedin.com/in/mary-mwendwa-4949a615',
  },
  {
    id: 'mercy-chelangat',
    name: 'Mercy Chelangat',
    role: 'Investigative journalist',
    categoryId: 'journalists',
    location: 'Nairobi',
    bio: 'Reports on what\'s in our food from where cameras rarely reach.',
    linkedin: 'https://www.linkedin.com/in/mercy-chelang-at-900680165',
  },
  {
    id: 'omoke-brian',
    name: 'Omoke Brian',
    role: 'Podcaster / host — "The Organic Guy"',
    categoryId: 'journalists',
    location: 'Nairobi (Rosslyn Farmers Market)',
    bio: '"The Organic Guy" bringing soil stories to a generation.',
  },
]);

export const voicePeople: Voice[] = assignVoiceMapPositions(voicePeopleSeed);

export const voicesSectionCopy = {
  headline: 'VOICES IN THE FILM',
  subheading: 'The people closest to the problem are often closest to the solution.',
  intro:
    'Kuzaya is built around the people who understand this ground first-hand — the ones measuring it, working it, financing its future and reporting on what it means for everyone who eats. These are some of the voices the film follows.',
};

export function isVisibleVoice(person: Voice): boolean {
  return !person.isPlaceholder;
}

export function getVisibleCategories(): VoiceCategory[] {
  const activeIds = new Set(
    voicePeople.filter(isVisibleVoice).map((person) => person.categoryId),
  );
  return voiceCategories.filter((category) => activeIds.has(category.id));
}

export function getPeopleForCategory(categoryId: string): Voice[] {
  return voicePeople.filter(
    (person) => person.categoryId === categoryId && isVisibleVoice(person),
  );
}

export function getVisiblePeople(): Voice[] {
  return voicePeople.filter(isVisibleVoice);
}

export interface Still {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export function stillPath(num: number): string {
  return `/stills/still-${String(num).padStart(2, '0')}.png`;
}

/** Curated set — similar frames removed. */
export const galleryStills: Still[] = [
  { id: 'still-41', src: stillPath(41), alt: 'Farmer in maize field at golden hour', caption: 'Kenya — field observation' },
  { id: 'still-46', src: stillPath(46), alt: 'Terraced hillside agriculture', caption: 'Rwanda highlands' },
  { id: 'still-3', src: stillPath(3), alt: 'BioSorra practitioner in wooded field', caption: 'BioSorra — Homa Bay' },
  { id: 'still-23', src: stillPath(23), alt: 'Community discussion beside Lake Victoria', caption: 'Lake Victoria shores' },
  { id: 'still-39', src: stillPath(39), alt: 'ICIPE scientist in laboratory', caption: 'ICIPE — research' },
  { id: 'still-35', src: stillPath(35), alt: 'Insect rearing facility', caption: 'Agricultural innovation' },
  { id: 'still-17', src: stillPath(17), alt: 'Conservation agriculture overlooking terraces', caption: 'Conservation agriculture' },
  { id: 'still-27', src: stillPath(27), alt: 'OFIMAK representative speaking', caption: 'OFIMAK — organic inputs' },
  { id: 'still-37', src: stillPath(37), alt: 'Agribusiness leader in warehouse', caption: 'Supply chain — Nairobi' },
  { id: 'still-30', src: stillPath(30), alt: 'Researcher in laboratory', caption: 'Research environment' },
  { id: 'still-25', src: stillPath(25), alt: 'Practitioner in greenhouse facility', caption: 'Enterprise — Thika' },
  { id: 'still-2', src: stillPath(2), alt: 'Terraced farming in Rwanda', caption: 'Rwanda — hillside cultivation' },
  { id: 'still-44', src: stillPath(44), alt: 'Green shoots in cracked soil', caption: 'Soil and renewal' },
  { id: 'still-6', src: stillPath(6), alt: 'Student eating a meal', caption: 'What feeds our food' },
  { id: 'still-28', src: stillPath(28), alt: 'Sun through clouds over landscape', caption: 'East African landscape' },
  { id: 'still-11', src: stillPath(11), alt: 'Cultivated hills', caption: 'Embu County' },
];

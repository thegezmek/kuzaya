export interface BtsStill {
  id: string;
  src: string;
  alt: string;
}

function btsPath(num: number): string {
  return `/bts/bts-${String(num).padStart(2, '0')}.png`;
}

export const approachBtsStills: BtsStill[] = [
  { id: 'bts-01', src: btsPath(1), alt: 'Crew with boom mic on location in Kenya' },
  { id: 'bts-02', src: btsPath(2), alt: 'Filming beside a river near a landfill site' },
  { id: 'bts-03', src: btsPath(3), alt: 'Interview in a herb garden field' },
  { id: 'bts-04', src: btsPath(4), alt: 'Filming inside an agricultural greenhouse facility' },
  { id: 'bts-05', src: btsPath(5), alt: 'Camera crew filming a farmer in the field' },
  { id: 'bts-06', src: btsPath(6), alt: 'Behind-the-scenes in a maize field' },
  { id: 'bts-07', src: btsPath(7), alt: 'Production crew travelling by boat' },
  { id: 'bts-08', src: btsPath(8), alt: 'Filming at an outdoor market stall' },
  { id: 'bts-09', src: btsPath(9), alt: 'Crew filming at a strawberry market stand' },
];

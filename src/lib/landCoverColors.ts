/** ESRI / Impact Observatory Sentinel-2 10m land cover class colors. */
export const LAND_COVER_COLORS = [
  { id: 'water', label: 'Water', classValue: 1, color: '#1565b8' },
  { id: 'trees', label: 'Trees', classValue: 2, color: '#1b5e20' },
  { id: 'flooded', label: 'Flooded vegetation', classValue: 4, color: '#66bb6a' },
  { id: 'crops', label: 'Crops', classValue: 5, color: '#fdd835' },
  { id: 'built', label: 'Built area', classValue: 7, color: '#c62828' },
  { id: 'bare', label: 'Bare ground', classValue: 8, color: '#efebe9' },
  { id: 'range', label: 'Rangeland', classValue: 11, color: '#c4a574' },
] as const;

/** Classes rendered on the map but omitted from the legend. */
const HIDDEN_LAND_COVER_COLORS = [
  { classValue: 9, color: '#f2faff' }, // snow / ice
  { classValue: 10, color: '#c8c8c8' }, // clouds
] as const;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

export function buildLandCoverColormap(): number[][] {
  const entries = [
    ...LAND_COVER_COLORS.map(({ classValue, color }) => ({
      classValue,
      color,
    })),
    ...HIDDEN_LAND_COVER_COLORS,
  ];

  return entries.map(({ classValue, color }) => {
    const [r, g, b] = hexToRgb(color);
    return [classValue, r, g, b];
  });
}

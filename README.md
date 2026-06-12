# Kuzaya

Observational documentary website — Kenya & Rwanda. The homepage is an illustrated topographic map; navigation is geographic.

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/components/GeoMap.tsx` — MapLibre dark base + OpenTopoMap contours, real coordinates
- `src/lib/geo.ts` — bearing, elevation scale, journey order, corridor bounds
- `src/data/locations.ts` — lat/lng, elevation (m), land cover class per location
- `src/data/film.ts` — synopsis, credits, contact from editorial brief

Replace Unsplash placeholder images in `locations.ts` with production stills when available.

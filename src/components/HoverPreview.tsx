import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { Location } from '../data/locations';
import { projectLatLngToContainer } from '../lib/mapProjection';
import './HoverPreview.css';

interface HoverPreviewProps {
  location: Location | null;
  map: GoogleMap | null;
}

export function HoverPreview({ location, map }: HoverPreviewProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!location || !map) {
      setPos(null);
      return;
    }

    const update = () => {
      try {
        const p = projectLatLngToContainer(map, location.lat, location.lng);
        if (!p) {
          setPos(null);
          return;
        }
        setPos({ x: p.x, y: p.y });
      } catch {
        setPos(null);
      }
    };

    update();
    const listeners = [
      map.addListener('idle', update),
      map.addListener('bounds_changed', update),
      map.addListener('center_changed', update),
      map.addListener('zoom_changed', update),
    ];
    window.addEventListener('resize', update);

    return () => {
      listeners.forEach((listener) => listener.remove());
      window.removeEventListener('resize', update);
    };
  }, [location, map]);

  return (
    <AnimatePresence>
      {location && pos && (
        <motion.figure
          className="hover-preview"
          style={{ left: pos.x, top: pos.y }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35 }}
        >
          <img src={location.photo.src} alt={location.photo.alt} loading="lazy" />
          <figcaption className="field-label">{location.elevation}</figcaption>
          <span className="hover-preview__region field-label">{location.region}</span>
        </motion.figure>
      )}
    </AnimatePresence>
  );
}

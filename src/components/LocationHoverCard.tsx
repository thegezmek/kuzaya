import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { Location } from '../data/locations';
import { useMapCardPortalTarget } from '../context/mapOverlays';
import { useMarkerCardViewportPosition } from '../hooks/useMarkerCardViewportPosition';
import '../styles/mapCardAnchor.css';
import './LocationHoverCard.css';

interface LocationHoverCardProps {
  location: Location | null;
  map: GoogleMap | null;
}

const CARD_W = 220;
const CARD_H = 180;

interface LocationHoverCardInnerProps {
  location: Location;
  map: GoogleMap;
}

function LocationHoverCardInner({ location, map }: LocationHoverCardInnerProps) {
  const portalTarget = useMapCardPortalTarget();
  const pos = useMarkerCardViewportPosition(map, location.lng, location.lat, {
    cardW: CARD_W,
    cardH: CARD_H,
  });

  if (!pos) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key={location.id}
        className="map-card-anchor map-card-anchor--hover map-card-anchor--portal"
        style={{ left: pos.x, top: pos.y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.article
          className={`hover-card ${pos.flipX ? 'hover-card--flip-x' : ''} ${pos.flipY ? 'hover-card--flip-y' : ''}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.33, 0, 0.2, 1] }}
        >
          <div className="hover-card__body">
            <span className="hover-card__region field-label">{location.region}</span>
            <span className="hover-card__elevation field-label">{location.elevation}</span>
            <p className="hover-card__fragment">{location.fragment}</p>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>,
    portalTarget,
  );
}

export function LocationHoverCard({ location, map }: LocationHoverCardProps) {
  if (!location || !map) return null;
  return <LocationHoverCardInner location={location} map={map} />;
}

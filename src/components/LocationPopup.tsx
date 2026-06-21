import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { Location } from '../data/locations';
import type { Voice } from '../data/voices';
import { voicesForProductionLocation } from '../data/voicesByProductionLocation';
import { VoiceRoleLines } from './VoiceRoleLines';
import { useMapCardPortalTarget } from '../context/mapOverlays';
import { useMarkerCardViewportPosition } from '../hooks/useMarkerCardViewportPosition';
import { useMediaQuery } from '../hooks/useMediaQuery';
import '../styles/mapCardAnchor.css';
import './LocationPopup.css';

interface LocationPopupProps {
  location: Location;
  map: GoogleMap;
  onClose: () => void;
}

const CARD_W = 320;
const CARD_H = 480;

interface LocationPopupBodyProps {
  location: Location;
  voices: Voice[];
}

function LocationPopupChrome({
  location,
  onClose,
}: {
  location: Location;
  onClose: () => void;
}) {
  return (
    <div className="location-popup__chrome">
      <span className="location-popup__handle" aria-hidden="true" />
      <div className="location-popup__chrome-row">
        <header className="location-popup__header">
          <span className="field-label">
            {location.country === 'kenya' ? 'Kenya' : 'Rwanda'}
          </span>
          <h2 id="location-popup-title" className="location-popup__title">
            {location.name}
          </h2>
        </header>
        <button
          type="button"
          className="location-popup__close"
          onClick={onClose}
          aria-label="Close location"
        >
          <span className="location-popup__close-icon" aria-hidden="true">
            ×
          </span>
          <span className="location-popup__close-label field-label">Close</span>
        </button>
      </div>
    </div>
  );
}

function LocationPopupBody({ location, voices }: LocationPopupBodyProps) {
  return (
    <div className="location-popup__body">
      <p className="location-popup__story">{location.story}</p>

      {voices.length > 0 && (
        <section
          className="location-popup__voices"
          aria-label={`Voices from ${location.name}`}
        >
          <h3 className="location-popup__voices-label">Voices from {location.name}</h3>
          <ul className="location-popup__voices-list">
            {voices.map((voice) => (
              <li key={voice.id} className="location-popup__voice">
                <p className="location-popup__voice-name">{voice.name}</p>
                <VoiceRoleLines role={voice.role} className="voice-role-lines--location" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function LocationPopupMobileSheet({
  location,
  voices,
  onClose,
}: LocationPopupBodyProps & { onClose: () => void }) {
  const portalTarget = useMapCardPortalTarget();

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={location.id}
        className="location-popup-sheet"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          className="location-popup-sheet__scrim"
          aria-label="Close location"
          onClick={onClose}
        />
        <div
          className="location-popup-sheet__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-popup-title"
        >
          <LocationPopupChrome location={location} onClose={onClose} />
          <div className="location-popup-sheet__scroll">
            <LocationPopupBody location={location} voices={voices} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    portalTarget,
  );
}

function LocationPopupDesktopCard({
  location,
  map,
  voices,
  onClose,
}: LocationPopupProps & { voices: Voice[] }) {
  const portalTarget = useMapCardPortalTarget();
  const pos = useMarkerCardViewportPosition(map, location.lng, location.lat, {
    cardW: CARD_W,
    cardH: CARD_H,
  });

  if (!pos) return null;

  return createPortal(
    <AnimatePresence>
      <>
        <motion.button
          key="location-scrim"
          type="button"
          className="map-panel-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Close location"
          onClick={onClose}
        />
        <motion.div
          key={location.id}
          className="map-card-anchor map-card-anchor--panel map-card-anchor--portal"
          style={{ left: pos.x, top: pos.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.33, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <article
            className={`location-popup ${pos.flipX ? 'location-popup--flip-x' : ''} ${pos.flipY ? 'location-popup--flip-y' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-popup-title"
          >
            <LocationPopupChrome location={location} onClose={onClose} />
            <LocationPopupBody location={location} voices={voices} />
          </article>
        </motion.div>
      </>
    </AnimatePresence>,
    portalTarget,
  );
}

export function LocationPopup({ location, map, onClose }: LocationPopupProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const voices = useMemo(
    () => voicesForProductionLocation(location.id),
    [location.id],
  );

  if (isMobile) {
    return (
      <LocationPopupMobileSheet location={location} voices={voices} onClose={onClose} />
    );
  }

  return (
    <LocationPopupDesktopCard
      location={location}
      map={map}
      voices={voices}
      onClose={onClose}
    />
  );
}

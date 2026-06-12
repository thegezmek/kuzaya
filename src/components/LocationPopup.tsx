import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { Location } from '../data/locations';
import { voicesForProductionLocation } from '../data/voicesByProductionLocation';
import { VoiceRoleLines } from './VoiceRoleLines';
import { useMapCardPortalTarget } from '../context/mapOverlays';
import { useMarkerCardViewportPosition } from '../hooks/useMarkerCardViewportPosition';
import '../styles/mapCardAnchor.css';
import './LocationPopup.css';

interface LocationPopupProps {
  location: Location;
  map: GoogleMap;
  onClose: () => void;
}

const CARD_W = 320;
const CARD_H = 480;

export function LocationPopup({ location, map, onClose }: LocationPopupProps) {
  const portalTarget = useMapCardPortalTarget();
  const voices = useMemo(
    () => voicesForProductionLocation(location.id),
    [location.id],
  );

  const pos = useMarkerCardViewportPosition(map, location.lng, location.lat, {
    cardW: CARD_W,
    cardH: CARD_H,
  });

  const anchor = pos ?? { x: -9999, y: -9999, flipX: false, flipY: false };
  const positioned = pos !== null;

  return createPortal(
    <AnimatePresence>
      <motion.button
        key="scrim"
        type="button"
        className="map-panel-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: positioned ? 1 : 0 }}
        exit={{ opacity: 0 }}
        aria-label="Close location"
        onClick={onClose}
      />
      <motion.div
        key={location.id}
        className="map-card-anchor map-card-anchor--panel map-card-anchor--portal"
        style={{ left: anchor.x, top: anchor.y, visibility: positioned ? 'visible' : 'hidden' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: positioned ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.article
          className={`location-popup ${anchor.flipX ? 'location-popup--flip-x' : ''} ${anchor.flipY ? 'location-popup--flip-y' : ''}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: positioned ? 1 : 0, scale: positioned ? 1 : 0.94 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.33, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-popup-title"
        >
          <button type="button" className="location-popup__close field-label" onClick={onClose}>
            Close
          </button>

          <header className="location-popup__header">
            <span className="field-label">{location.country === 'kenya' ? 'Kenya' : 'Rwanda'}</span>
            <h2 id="location-popup-title" className="location-popup__title">
              {location.name}
            </h2>
          </header>

          <div className="location-popup__body">
            <p className="location-popup__story">{location.story}</p>

            {voices.length > 0 && (
              <section
                className="location-popup__voices"
                aria-label={`Voices from ${location.name}`}
              >
                <h3 className="location-popup__voices-label">
                  Voices from {location.name}
                </h3>
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
        </motion.article>
      </motion.div>
    </AnimatePresence>,
    portalTarget,
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { VoiceMapPoint } from '../data/voiceLocations';
import { useMapCardPortalTarget } from '../context/mapOverlays';
import { VoiceRoleLines } from './VoiceRoleLines';
import { useMarkerCardViewportPosition } from '../hooks/useMarkerCardViewportPosition';
import '../styles/mapCardAnchor.css';
import './VoicePopup.css';

interface VoicePopupProps {
  voice: VoiceMapPoint;
  map: GoogleMap;
  onClose: () => void;
}

const CARD_W = 300;
const CARD_H = 380;

function voiceInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function VoicePopupPortrait({ voice }: { voice: VoiceMapPoint }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = voice.photoSrc && !photoFailed;

  return (
    <div className="voice-popup__portrait" aria-hidden={!showPhoto}>
      {showPhoto ? (
        <img
          src={voice.photoSrc}
          alt=""
          className="voice-popup__photo"
          loading="lazy"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <span className="voice-popup__initials">{voiceInitials(voice.name)}</span>
      )}
    </div>
  );
}

export function VoicePopup({ voice, map, onClose }: VoicePopupProps) {
  const portalTarget = useMapCardPortalTarget();
  const pos = useMarkerCardViewportPosition(map, voice.lng, voice.lat, {
    cardW: CARD_W,
    cardH: CARD_H,
  });

  if (!pos) return null;

  return createPortal(
    <AnimatePresence>
      <motion.button
        key="scrim"
        type="button"
        className="map-panel-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-label="Close voice"
        onClick={onClose}
      />
      <motion.div
        key={voice.id}
        className="map-card-anchor map-card-anchor--panel map-card-anchor--portal"
        style={{ left: pos.x, top: pos.y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.article
          className={`voice-popup ${pos.flipX ? 'voice-popup--flip-x' : ''} ${pos.flipY ? 'voice-popup--flip-y' : ''}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.33, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-popup-title"
        >
          <button type="button" className="voice-popup__close field-label" onClick={onClose}>
            Close
          </button>

          <header className="voice-popup__header">
            <div className="voice-popup__intro">
              <VoicePopupPortrait voice={voice} />
              <div className="voice-popup__identity">
                <span className="field-label">Voice in the film</span>
                <h2 id="voice-popup-title" className="voice-popup__title">
                  {voice.name}
                </h2>
                <VoiceRoleLines role={voice.role} className="voice-role-lines--popup" />
              </div>
            </div>
          </header>

          <div className="voice-popup__body">
            <p className="voice-popup__bio">{voice.bio}</p>
            {voice.linkedin && (
              <a
                href={voice.linkedin}
                className="voice-popup__link field-label"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>,
    portalTarget,
  );
}

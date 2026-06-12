import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GoogleMap } from '../types/map';
import type { VoiceMapPoint } from '../data/voiceLocations';
import { computeMarkerCardPosition, type MarkerCardPosition } from '../lib/mapCardPosition';
import { VoiceRoleLines } from './VoiceRoleLines';
import '../styles/mapCardAnchor.css';
import './VoiceHoverCard.css';

interface VoiceHoverCardProps {
  voice: VoiceMapPoint | null;
  map: GoogleMap | null;
}

const CARD_W = 220;
const CARD_H = 150;

export function VoiceHoverCard({ voice, map }: VoiceHoverCardProps) {
  const [pos, setPos] = useState<MarkerCardPosition | null>(null);

  useEffect(() => {
    if (!voice || !map) {
      setPos(null);
      return;
    }

    const update = () => {
      setPos(
        computeMarkerCardPosition(map, voice.lng, voice.lat, {
          cardW: CARD_W,
          cardH: CARD_H,
        }),
      );
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
  }, [voice, map]);

  if (!voice || !map || !pos) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={voice.id}
        className="map-card-anchor map-card-anchor--hover"
        style={{ left: pos.x, top: pos.y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.article
          className={`voice-hover-card ${pos.flipX ? 'voice-hover-card--flip-x' : ''} ${pos.flipY ? 'voice-hover-card--flip-y' : ''}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.33, 0, 0.2, 1] }}
        >
          <div className="voice-hover-card__body">
            <span className="voice-hover-card__tag field-label">Voice</span>
            <p className="voice-hover-card__name">{voice.name}</p>
            <VoiceRoleLines role={voice.role} className="voice-role-lines--hover" />
            <p className="voice-hover-card__bio">{voice.bio}</p>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}

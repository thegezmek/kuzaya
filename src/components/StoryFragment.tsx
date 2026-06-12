import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '../data/locations';
import './StoryFragment.css';

interface StoryFragmentProps {
  location: Location | null;
}

export function StoryFragment({ location }: StoryFragmentProps) {
  return (
    <AnimatePresence mode="wait">
      {location && (
        <motion.div
          key={location.id}
          className="fragment"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5, ease: [0.33, 0, 0.2, 1] }}
        >
          <span className="fragment__label field-label">{location.region}</span>
          <p className="fragment__text">{location.fragment}</p>
          {location.contributor && (
            <span className="fragment__contrib field-label">{location.contributor}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';
import { film } from '../data/film';
import './Sheet.css';
import './ContactSheet.css';

interface ContactSheetProps {
  onClose: () => void;
}

export function ContactSheet({ onClose }: ContactSheetProps) {
  return (
    <motion.div
      className="sheet-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sheet sheet--contact"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.75, ease: [0.33, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="contact-sheet-title"
      >
        <button type="button" className="sheet__close field-label" onClick={onClose}>
          Close
        </button>

        <div className="sheet__content">
          <h2 id="contact-sheet-title" className="sheet__title">
            Contact
          </h2>
          <p className="contact__intro">
            For screenings, partnerships, and press inquiries regarding Kuzaya.
          </p>

          {film.contact.people.map((person) => (
            <address key={person.linkedin} className="contact__card">
              <h3>{person.name}</h3>
              <p className="field-label">{person.role}</p>
              <p>
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </p>
            </address>
          ))}

          <p className="sheet__footer field-label">
            {film.title} — {film.branding.production}
            <br />
            {film.branding.copyright}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useState } from 'react';
import { film } from '../data/film';
import { RevealSection } from './RevealSection';
import './DirectorsNoteSection.css';

export function DirectorsNoteSection() {
  const [open, setOpen] = useState(false);
  const excerpt = film.directorNote.paragraphs[0];

  return (
    <RevealSection
      id="directors-note"
      className={`directors-note funnel__section${open ? ' directors-note--open' : ''}`}
    >
      <div className="directors-note__portrait">
        <img
          src={film.directorNote.photoSrc}
          alt={film.directorNote.name}
          className="directors-note__photo"
        />
      </div>

      <div className="directors-note__intro">
        <h2 className="funnel__section-title">Director&apos;s Note</h2>
        <p className="directors-note__byline field-label">
          {film.directorNote.name} · {film.directorNote.role}
        </p>
        {!open && (
          <>
            <p className="directors-note__excerpt funnel__prose">{excerpt}</p>
            <button
              type="button"
              className="directors-note__toggle field-label"
              onClick={() => setOpen(true)}
              aria-expanded={false}
              aria-controls="directors-note-body"
            >
              More
            </button>
          </>
        )}
      </div>

      <div
        id="directors-note-body"
        className="directors-note__panel"
        aria-hidden={!open}
      >
        <div className="directors-note__panel-inner">
          <div className="directors-note__body">
            {film.directorNote.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="funnel__prose">
                {paragraph}
              </p>
            ))}
            <button
              type="button"
              className="directors-note__toggle directors-note__toggle--close field-label"
              onClick={() => setOpen(false)}
              aria-expanded={true}
              aria-controls="directors-note-body"
            >
              Less
            </button>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

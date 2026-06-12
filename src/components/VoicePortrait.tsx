import { useState } from 'react';
import type { Voice } from '../data/voices';

function voiceInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface VoicePortraitProps {
  person: Voice;
}

export function VoicePortrait({ person }: VoicePortraitProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = person.photoSrc && !photoFailed;
  const initials = voiceInitials(person.name);

  const portrait = (
    <div className="funnel__voice-portrait">
      {showPhoto ? (
        <img
          src={person.photoSrc}
          alt={`${person.name}, ${person.role}`}
          className="funnel__voice-photo"
          loading="lazy"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <span className="funnel__voice-initials">{initials}</span>
      )}
    </div>
  );

  if (person.linkedin) {
    return (
      <a
        href={person.linkedin}
        className="funnel__voice-portrait-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${person.name} on LinkedIn`}
      >
        {portrait}
      </a>
    );
  }

  return portrait;
}

import { RevealSection } from './RevealSection';
import { StillsGallery } from './StillsGallery';
import './StillsSection.css';

export function StillsSection() {
  return (
    <RevealSection id="stills" className="stills-section">
      <StillsGallery />
    </RevealSection>
  );
}

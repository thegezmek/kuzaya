import { galleryStills } from '../data/stills';
import { StillsSlider } from './StillsSlider';

export function StillsGallery() {
  return <StillsSlider title="Film Stills" stills={galleryStills} />;
}

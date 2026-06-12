import { approachBtsStills } from '../data/bts';
import { StillsSlider } from './StillsSlider';

export function ApproachBtsOpener() {
  return (
    <div className="film-section__approach-bts">
      <StillsSlider
        className="stills-slider--align-start"
        title="Kenya & Rwanda"
        stills={approachBtsStills}
        prevLabel="Previous behind-the-scenes stills"
        nextLabel="Next behind-the-scenes stills"
        viewLabel={(alt) => `View behind the scenes: ${alt}`}
      />
    </div>
  );
}

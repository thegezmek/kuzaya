import { ScaleOfLoss } from './ScaleOfLoss';
import { FertilizerDependence } from './FertilizerDependence';
import { HumanStakes } from './HumanStakes';
import './WhyNowSection.css';

const INTRO =
  'The future of food in East Africa is being decided now, in the soil beneath it.';

export function WhyNowSection() {
  return (
    <section id="why-now" className="why-now why-now--in-film" aria-labelledby="why-now-title">
      <div className="why-now__panel">
        <header className="why-now__header">
          <h3 id="why-now-title" className="why-now__title">
            WHY NOW
          </h3>
        </header>

        <p className="why-now__intro">{INTRO}</p>

        <div className="why-now__beats">
          <ScaleOfLoss />
          <div className="why-now__beats-row">
            <FertilizerDependence beatsLayout />
            <HumanStakes beatsLayout />
          </div>
        </div>
      </div>
    </section>
  );
}

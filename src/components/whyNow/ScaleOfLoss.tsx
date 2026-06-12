import { scaleOfLossView } from '../../data/whyNow/scaleOfLoss';
import { useReveal } from '../../hooks/useReveal';
import { FootballPitchCycle } from './FootballPitchCycle';
import { SubSaharanAfricaMap } from './SubSaharanAfricaMap';
import './ScaleOfLoss.css';

const { footballPitch, degradedLand } = scaleOfLossView;
const DEGRADED_MID = (degradedLand.valueMin + degradedLand.valueMax) / 2;

export function ScaleOfLoss() {
  const { ref, visible } = useReveal({ threshold: 0.25 });

  return (
    <section
      ref={ref}
      className={`scale-loss${visible ? ' scale-loss--animate' : ''}`}
      aria-labelledby="scale-loss-title"
    >
      <header className="scale-loss__header">
        <h3 id="scale-loss-title" className="scale-loss__title">
          The Scale of Loss
        </h3>
      </header>

      <div className="scale-loss__grid">
        <article className="scale-loss__col">
          <div className="scale-loss__figure scale-loss__figure--pitch">
            <FootballPitchCycle
              active={visible}
              intervalSeconds={footballPitch.intervalSeconds}
            />
          </div>
          <p className="scale-loss__statement">{footballPitch.statement}</p>
          <p className="scale-loss__source field-label">
            Source:{' '}
            <a href={footballPitch.url} target="_blank" rel="noopener noreferrer">
              {footballPitch.source}
            </a>
          </p>
        </article>

        <article className="scale-loss__col">
          <div className="scale-loss__figure scale-loss__figure--map">
            <p className="scale-loss__degraded-hero" aria-hidden="true">
              {degradedLand.valueMin}–{degradedLand.valueMax}%
            </p>
            <SubSaharanAfricaMap
              degradedPercent={DEGRADED_MID}
              animate={visible}
              label={`${degradedLand.valueMin} to ${degradedLand.valueMax} percent of cultivated land in Sub-Saharan Africa is degraded`}
            />
          </div>
          <p className="scale-loss__degraded-statement">{degradedLand.statement}</p>
          <p className="scale-loss__source field-label">
            Source:{' '}
            <a href={degradedLand.url} target="_blank" rel="noopener noreferrer">
              {degradedLand.source}
            </a>
          </p>
        </article>
      </div>
    </section>
  );
}

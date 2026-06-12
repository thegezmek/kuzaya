import { useEffect, useRef, useState } from 'react';
import { humanStakesView } from '../../data/whyNow/humanStakes';
import { useReveal } from '../../hooks/useReveal';
import type { NutritionDeficiency } from '../../data/whyNow/types';
import './HumanStakes.css';

const { affectedPeople, nutritionKenya } = humanStakesView;

function useCountUp(target: number, active: boolean, delayMs: number) {
  const [value, setValue] = useState(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    if (reducedMotion.current) {
      setValue(target);
      return;
    }

    let frame = 0;
    const timeout = window.setTimeout(() => {
      const start = performance.now();
      const duration = 1100;

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        setValue(Math.round(target * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [active, target, delayMs]);

  return value;
}

function DeficiencyIndicator({
  item,
  index,
  animate,
  immediate = false,
}: {
  item: NutritionDeficiency;
  index: number;
  animate: boolean;
  immediate?: boolean;
}) {
  const delay = 120 + index * 140;
  const countedValue = useCountUp(item.value, animate && !immediate, delay);
  const displayValue = immediate ? item.value : countedValue;

  return (
    <li
      className="human-stakes__deficiency"
      style={{ ['--indicator-delay' as string]: `${delay}ms` }}
    >
      <div className="human-stakes__deficiency-head">
        <span className="human-stakes__deficiency-label">{item.label}</span>
        <span className="human-stakes__deficiency-value">
          {displayValue}
          {item.unit}
        </span>
      </div>
      <div className="human-stakes__deficiency-bar" aria-hidden="true">
        <div
          className="human-stakes__deficiency-fill"
          style={{ ['--bar-width' as string]: `${item.value}%` }}
        />
      </div>
      <span className="human-stakes__deficiency-pop field-label">{item.population}</span>
    </li>
  );
}

export function HumanStakes({ beatsLayout = false }: { beatsLayout?: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.25 });
  return (
    <section
      ref={ref}
      className={`human-stakes${visible ? ' human-stakes--animate' : ''}${beatsLayout ? ' human-stakes--beats' : ''}`}
      aria-labelledby="human-stakes-title"
    >
      <h3 id="human-stakes-title" className="human-stakes__title">
        The Human Stakes
      </h3>

      <div className="human-stakes__grid">
        <div className="human-stakes__people-block">
          <div className="human-stakes__hero" aria-hidden="true">
            <span className="human-stakes__hero-value">{affectedPeople.value}</span>
            <span className="human-stakes__hero-unit field-label">{affectedPeople.unit}</span>
          </div>
          <p className="human-stakes__statement">{affectedPeople.statement}</p>
          <p className="human-stakes__source field-label">
            Source:{' '}
            <a href={affectedPeople.url} target="_blank" rel="noopener noreferrer">
              {affectedPeople.source}
            </a>
          </p>
        </div>

        <div className="human-stakes__nutrition-block">
          <h4 className="human-stakes__nutrition-title">{nutritionKenya.title}</h4>
          <p className="human-stakes__nutrition-note">{nutritionKenya.contextNote}</p>

          <ul className="human-stakes__deficiency-list" aria-label="Micronutrient deficiency prevalence in Kenya">
            {nutritionKenya.deficiencies.map((item, index) => (
              <DeficiencyIndicator
                key={item.id}
                item={item}
                index={index}
                animate={visible}
                immediate={beatsLayout}
              />
            ))}
          </ul>

          <p className="human-stakes__source field-label">
            Source:{' '}
            <a href={nutritionKenya.url} target="_blank" rel="noopener noreferrer">
              {nutritionKenya.source}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

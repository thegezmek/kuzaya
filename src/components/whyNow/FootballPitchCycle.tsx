import { useEffect, useRef, useState } from 'react';
import './FootballPitchCycle.css';

const HOLD_AT_ZERO_MS = 700;
const REVEAL_MS = 650;
const TICK_MS = 1000;

type Phase = 'countdown' | 'resetting';

interface FootballPitchCycleProps {
  active: boolean;
  intervalSeconds: number;
}

function PitchSvg() {
  return (
    <svg viewBox="0 0 105 68" className="pitch-cycle__svg" aria-hidden="true">
      <rect className="pitch-cycle__grass" x="0.5" y="0.5" width="104" height="67" rx="1" />
      <rect
        className="pitch-cycle__line"
        x="0.5"
        y="0.5"
        width="104"
        height="67"
        rx="1"
        fill="none"
      />
      <line className="pitch-cycle__line" x1="52.5" y1="0.5" x2="52.5" y2="67.5" />
      <circle className="pitch-cycle__line" cx="52.5" cy="34" r="9.15" fill="none" />
      <circle className="pitch-cycle__spot" cx="52.5" cy="34" r="0.55" />
      <rect className="pitch-cycle__line" x="0.5" y="16.5" width="16.5" height="35" fill="none" />
      <rect className="pitch-cycle__line" x="88" y="16.5" width="16.5" height="35" fill="none" />
      <rect className="pitch-cycle__line" x="0.5" y="24.5" width="5.5" height="19" fill="none" />
      <rect className="pitch-cycle__line" x="99" y="24.5" width="5.5" height="19" fill="none" />
    </svg>
  );
}

export function FootballPitchCycle({ active, intervalSeconds }: FootballPitchCycleProps) {
  const [phase, setPhase] = useState<Phase>('countdown');
  const [count, setCount] = useState(intervalSeconds);
  const [cycle, setCycle] = useState(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const pitchVisible =
    !active || phase === 'resetting' || intervalSeconds <= 0
      ? 1
      : count / intervalSeconds;

  useEffect(() => {
    if (!active || reducedMotion.current) {
      setPhase('countdown');
      setCount(intervalSeconds);
      return;
    }

    const timeouts: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timeouts.push(window.setTimeout(fn, ms));
    };

    const runCycle = () => {
      let remaining = intervalSeconds;
      setPhase('countdown');
      setCount(remaining);

      const tick = () => {
        schedule(() => {
          remaining -= 1;
          setCount(remaining);

          if (remaining <= 0) {
            schedule(() => {
              setPhase('resetting');
              setCycle((c) => c + 1);
              schedule(() => runCycle(), REVEAL_MS);
            }, HOLD_AT_ZERO_MS);
            return;
          }

          tick();
        }, TICK_MS);
      };

      schedule(tick, TICK_MS);
    };

    runCycle();

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [active, intervalSeconds]);

  if (reducedMotion.current) {
    return (
      <div className="pitch-cycle pitch-cycle--static" aria-hidden="true">
        <div className="pitch-cycle__field-shell">
          <div className="pitch-cycle__field-layer pitch-cycle__field-layer--visible">
            <PitchSvg />
          </div>
          <div className="pitch-cycle__countdown" aria-live="off">
            <span className="pitch-cycle__count">
              {intervalSeconds}
              <span className="pitch-cycle__count-unit">s</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pitch-cycle pitch-cycle--${phase}${active ? '' : ' pitch-cycle--idle'}`}
      aria-hidden="true"
    >
      <div className="pitch-cycle__field-shell">
        <div
          key={cycle}
          className={`pitch-cycle__field-layer${
            active || phase === 'resetting' ? ' pitch-cycle__field-layer--visible' : ''
          }${phase === 'resetting' ? ' pitch-cycle__field-layer--enter' : ''}`}
          style={{ '--pitch-visible': pitchVisible } as React.CSSProperties}
        >
          <div className="pitch-cycle__pitch-clip">
            <PitchSvg />
          </div>
        </div>

        {(phase === 'countdown' || !active) && (
          <div className="pitch-cycle__countdown" aria-live="off">
            <span
              key={count}
              className={`pitch-cycle__count${count === 0 ? ' pitch-cycle__count--lost' : ''}`}
            >
              {count}
              <span className="pitch-cycle__count-unit">s</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

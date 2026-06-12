import './ExplorePrompt.css';

interface ExplorePromptProps {
  visible: boolean;
  onExplore: () => void;
  label?: string;
}

export function ExplorePrompt({ visible, onExplore, label = 'Continue' }: ExplorePromptProps) {
  return (
    <button
      type="button"
      className={`explore-prompt ${visible ? 'explore-prompt--visible' : 'explore-prompt--hidden'}`}
      onClick={onExplore}
      aria-label={label}
    >
      <span className="explore-prompt__line" aria-hidden="true" />
      <span className="field-label">{label}</span>
    </button>
  );
}

import { splitVoiceCardRole } from '../lib/mapVoiceRole';
import './VoiceRoleLines.css';

interface VoiceRoleLinesProps {
  role: string;
  className?: string;
}

export function VoiceRoleLines({ role, className }: VoiceRoleLinesProps) {
  const { title, org } = splitVoiceCardRole(role);

  return (
    <div className={['voice-role-lines', className].filter(Boolean).join(' ')}>
      <p className="voice-role-lines__title">{title}</p>
      {org ? <p className="voice-role-lines__org">{org}</p> : null}
    </div>
  );
}

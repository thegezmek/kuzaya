function stripParentheticals(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
}

/** Voice card / list role — keeps org context; strips trailing editorial notes after an em dash. */
export function formatVoiceCardRole(role: string): string {
  const emDash = role.indexOf(' — ');
  return emDash > 0 ? role.slice(0, emDash).trim() : role.trim();
}

export function splitVoiceCardRole(role: string): { title: string; org?: string } {
  const label = formatVoiceCardRole(role);
  const comma = label.indexOf(',');

  if (comma <= 0) {
    return { title: stripParentheticals(label) };
  }

  const org = stripParentheticals(label.slice(comma + 1));

  return {
    title: label.slice(0, comma).trim(),
    org: org || undefined,
  };
}

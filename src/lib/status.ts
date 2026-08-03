export function statusClass(status: string | undefined | null): 'disponible' | 'complet' | 'a-venir' | 'default' {
  const s = (status || '').toLowerCase().trim();
  if (s.includes('dispo')) return 'disponible';
  if (s.includes('complet') || s.includes('vendu')) return 'complet';
  if (s.includes('venir') || s.includes('attente')) return 'a-venir';
  return 'default';
}

export function isAvailable(status: string | undefined | null) {
  return statusClass(status) === 'disponible';
}

export function formatDateFr(value: string | undefined | null) {
  if (!value) return null;
  // Sanity date fields are plain "YYYY-MM-DD" with no time component; parsing that
  // directly with `new Date()` reads it as UTC midnight, which can render as the
  // previous day on a build machine set to a negative UTC offset. Anchor to local noon.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

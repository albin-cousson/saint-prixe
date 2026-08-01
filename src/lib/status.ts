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
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

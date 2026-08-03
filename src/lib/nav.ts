export type NavItem = { label: string; href: string; children?: NavItem[] };

/** Matches the live site's real menu, with the three breed/sex roster links
 * grouped under "Nos Chiens" (was 10 flat items; critique flagged it as
 * exceeding working-memory chunking guidance, 3 of them near-duplicates). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'A propos', href: '/a-propos' },
  { label: 'Actualités', href: '/actualites' },
  {
    label: 'Nos Chiens',
    href: '/nos-chiens',
    children: [
      { label: 'Nos Mâles', href: '/nos-males' },
      { label: 'Nos Femelles', href: '/nos-femelles' },
    ],
  },
  { label: 'Nos Portées', href: '/nos-portees' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

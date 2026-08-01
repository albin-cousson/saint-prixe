export type NavItem = { label: string; href: string };

/** Matches the live site's real menu, in the same order, with clean new-site slugs. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'A propos', href: '/a-propos' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Nos Chiens', href: '/nos-chiens' },
  { label: 'Nos Mâles', href: '/nos-males' },
  { label: 'Nos Femelles', href: '/nos-femelles' },
  { label: 'Nos Chiots', href: '/nos-chiots' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
  { label: 'Nos Shih tzu', href: '/nos-shih-tzu' },
];

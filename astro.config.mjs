// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// astro.config.mjs runs before Astro's own env loading, so PUBLIC_* vars
// must be read via Vite's loadEnv here rather than import.meta.env.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

// https://astro.build/config
export default defineConfig({
  site: 'https://elevagedesaintprixe.com',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2026-01-01',
      useCdn: true,
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
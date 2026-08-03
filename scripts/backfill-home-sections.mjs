// One-shot migration: converts the homePage document's `sections` array from
// the old single `linkedSection` type (with a `source` enum field) to the new
// dedicated types (`mariagesSection`, `actualitesSection`, `malesSection`,
// `femellesSection`), and drops the Shih Tzu banner entry (no longer a
// supported section type — removed by design decision).
// Safe to re-run: no-op once every entry has already been migrated.

import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('Missing SANITY_API_TOKEN in .env — aborting.');
  process.exit(1);
}

const SOURCE_TO_TYPE = {
  mariages: 'mariagesSection',
  actualites: 'actualitesSection',
  males: 'malesSection',
  femelles: 'femellesSection',
  // shihtzu: intentionally omitted — dropped from the sections array below.
};

async function run() {
  const home = await client.fetch('*[_type == "homePage"][0]{sections}');
  const sections = home?.sections || [];

  const alreadyMigrated = sections.every((s) => s._type !== 'linkedSection');
  if (alreadyMigrated) {
    console.log('Already migrated (no linkedSection entries left) — nothing to do.');
    return;
  }

  const newSections = sections
    .filter((s) => s._type !== 'linkedSection' || s.source !== 'shihtzu')
    .map((s) => {
      if (s._type !== 'linkedSection') return s;
      const { source, ...rest } = s;
      return { ...rest, _type: SOURCE_TO_TYPE[source] };
    });

  await client.patch('homePage').set({ sections: newSections }).commit();
  console.log(`Patched homePage.sections: ${sections.length} -> ${newSections.length} entries (shihtzu removed, rest re-typed).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

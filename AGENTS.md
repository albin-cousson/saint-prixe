# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Astro + Sanity rebuild of the "De Saint Prixe" dog-breeding site (Bearded Collie & Shih Tzu), replacing the previous Wix site (`elevagedesaintprixe.com`). All page content was migrated verbatim from the live Wix site (see `../saint-prixe-web-content/` for the raw extracted JSON and `scripts/import-content.mjs` for the one-shot migration script that pushed it into Sanity) — content in Sanity is real, not placeholder, except where explicitly noted (see Known gaps below).

## Commands

Run from the project root unless noted:

```bash
npm run dev              # astro dev — local dev server
astro dev --background   # run dev server in background; astro dev stop/status/logs to manage it
npm run build             # astro build — static build to dist/
npm run preview           # astro preview — serve the built dist/
```

Sanity Studio (a separate app under `studio/`, deployed independently — not part of the Astro build):

```bash
cd studio && npm run dev     # sanity dev — local Studio UI
cd studio && npm run deploy  # sanity deploy — publish Studio to <project>.sanity.studio
```

Content migration script (idempotent — safe to re-run, uses `createOrReplace`; re-running re-uploads images as new Sanity assets each time rather than deduping):

```bash
node scripts/import-content.mjs
```

No test suite exists yet.

## Documentation

Full Astro documentation: https://docs.astro.build. Consult before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)

## Architecture

**Two independent apps in one repo:**
- `/` — the Astro site (this is what deploys as the public website)
- `studio/` — a standalone Sanity Studio app with its own `package.json`/`node_modules`, config at `studio/sanity.config.ts`, schemas in `studio/schemaTypes/`. It is *not* embedded into Astro (no `/admin` route) — Studio is deployed and hosted separately via `sanity deploy`.

**Rendering model:** fully static (`output: 'static'` default). All Sanity data is fetched at *build time* via GROQ in `.astro` frontmatter — publishing changes in Studio does not update the live site until the site is rebuilt. Wire a Sanity webhook to the hosting provider's deploy-hook URL to auto-rebuild on publish (not yet configured).

**Sanity access pattern:**
- `astro.config.mjs` configures the `@sanity/astro` integration (`projectId`/`dataset` read via Vite's `loadEnv`, since this file runs before Astro's own env loading — see the comment there before changing it).
- Pages import the client via the virtual module `sanity:client`, never instantiate their own client.
- All GROQ queries live in `src/lib/sanity/queries.ts` (`defineQuery` from `groq`) — add new queries there rather than inlining GROQ strings in page frontmatter.
- `src/lib/sanity/image.ts` exports `urlFor()` (wraps `@sanity/image-url`'s named export `createImageUrlBuilder` — the default export is deprecated and triggers a build warning) for all Sanity image rendering.
- Rich text fields (`blogPost.body`, `aboutPage.sections[].body`) are Portable Text, rendered via `astro-portabletext`'s `<PortableText value={...} />`; paragraph/heading spacing for it lives in the `.prose-body` utility class in `src/styles/global.css`, not in the component.

**Dynamic routes** (`getStaticPaths`) exist for: `/nos-chiots/[slug]` (a `mariage` document + its `chiot` children), `/nos-chiens/[slug]` (a `dog` document — pedigree detail page), `/actualites/[slug]` (a `blogPost`). Per `@sanity/astro`'s known gotcha, GROQ query consts used only inside `getStaticPaths()` must be defined/imported such that they're reachable there — see the existing pattern in those three files before adding a new dynamic route.

**The "Mariages/Chiots" feature** (`/nos-chiots`) is the site's breeding-pair showcase: a `mariage` document (a breeding couple, playful "wedding" framing — `dogGroomName`/`dogGroomPhoto` is the male, `dogBrideName`/`dogBridePhoto` the female) references `chiot` documents (individual puppies) via `chiot.mariage`. The listing page (`src/pages/nos-chiots/index.astro`) queries all mariages with their puppies inlined (`MARIAGES_WITH_CHIOTS_QUERY`) and renders `MariageCard.astro` — fully static, no client JS. The detail page renders each puppy via the `PuppyCarousel` React island (`client:visible`) for the multi-photo prev/next carousel; everything else on that page is static Astro. If a mariage has zero linked chiots, the card shows "Naissance prévue le {litterDate}" instead of a puppy grid — there is intentionally no "status" badge on the couple itself (removed by design decision), only per-puppy status (grey-out + label for anything other than "Disponible").

**Design tokens are extracted from the real Wix site's CSS**, not invented — see the header comment in `src/styles/global.css`. Sharp corners (`border-radius: 0`) are the deliberate brand convention everywhere except genuine circular photo framing (dog avatars, the "&" badge) — don't add rounded corners to cards/buttons/images without a specific reason. The body font `din-next-w01-light` is self-hosted from Wix's own public font CDN (`static.parastorage.com`) via `@font-face` — not a Google Font, don't try to `@import` it from Google Fonts.

## Known gaps (intentional, not oversights)

- Only one `mariage` document exists (`Romy & Maverick`), seeded from a real blog post announcement — it has no `chiot` children because that litter hadn't been born on the source site at migration time. Don't invent additional mariages/chiots; the client adds real ones via Sanity Studio.
- The 5 Shih Tzu `dog` documents have `sex` left unset (the source site never published it) and no `sire`/`dam`/`titles` (structurally, Shih Tzu on the source site are a plain photo grid, not pedigree-backed like the Bearded Collies).
- Portfolio images have no alt text (source site had none either) — accessibility follow-up needed if the client wants real captions.
- Contact page's form submits via a `mailto:` link (no backend) — fine for current scale, revisit if that's ever a real limitation.

---
target: Homepage (src/pages/index.astro)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-01T23-05-32Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review, isolated sub-agent with live browser access · B: detector + browser evidence, isolated sub-agent, CLI scan completed; browser step skipped — no browser tool exposed in B's session)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Active nav state (gold) works well; no other status concerns for a static page. |
| 2 | Match Between System and Real World | 3/4 | Correct French pedigree vocabulary is authentic; live hero headline/subheadline read as stock breeder-site copy, not this kennel's voice. |
| 3 | User Control and Freedom | 3/4 | Free navigation, no traps, working hamburger toggle with correct ARIA; no skip-to-content link. |
| 4 | Consistency and Standards | 2/4 | Homepage diverges from sibling pages: no "see all" CTA under Nos Mâles/Femelles (present on nos-chiens.astro); no post date on Actualités cards (present on actualites/index.astro). |
| 5 | Error Prevention | 3/4 | No destructive actions; but the blank Actualités card reads as an unintentional error state with nothing preventing it. |
| 6 | Recognition Rather Than Recall | 3/4 | Clear CTA labels; pedigree abbreviations ("Ch.") assume prior knowledge. |
| 7 | Flexibility and Efficiency of Use | n/a | Marketing/Persuade surface — no power-user shortcuts genuinely apply. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Real restraint in palette/type, but a blurry hero photo, a blank white card, and an empty "Nos Chiots" section puncture the composition. |
| 9 | Error Recovery | 2/4 | The missing-cover-image Actualités card has no fallback (unlike DogCard's placeholder), so a content gap looks like a broken build. |
| 10 | Help and Documentation | n/a | Not applicable to a static informational/persuade page. |
| **Total** | | **21/32** | **Acceptable (65.6%)** |

## Design Specificity Verdict

**LLM assessment**: Partially authored, partially generic — and the split is telling. The brand tokens are real and consistently applied (ink/cream/gold palette, Libre Baskerville, sharp corners, the heart-and-line flourish), and `DogCard`'s pedigree block (Père/Mère/Né(e) le/titles) genuinely executes "pedigree transparency as the norm" with real data. But the homepage's most distinctive idea — "breeding pairs framed as relationships, not inventory" — is **not implemented on this page at all**. The "Nos Chiots" section is a bare heading and button with no query against Sanity's mariage data and no reference to the one real Mariage that exists, even though the fully-built `MariageCard` component (circular double portraits, gold "&" badge, flourish, puppy grid) already exists in the codebase and renders beautifully on `/nos-chiots`. The rendered hero headline is literally the code's generic fallback string ("Découvrez notre élevage"), naming neither the kennel nor the breed. The design *system* is specific; the homepage's *execution* regresses to generic in exactly the two places that should carry the most brand differentiation.

**Deterministic scan**: `detect.mjs` returned **0 findings** (exit code 0) across all 5 scanned files (index.astro, Layout.astro, Header.astro, Footer.astro, DogCard.astro) — a genuinely clean mechanical scan, not a no-op (files confirmed non-empty). No detector/LLM disagreement to reconcile and no false positives to flag, because the detector's checks (structural/mechanical patterns) don't cover what the LLM review found: missing data wiring, image quality, and copy fidelity are outside a static code scanner's reach. This is a case where "clean scan" and "real problems" both hold at once — a clean detector never overrides visual/product judgment.

**Visual overlays**: Not available this run — Assessment B had no browser/screenshot tool in its isolated session, so no overlay is showing in a `[Human]` tab. Assessment A did have browser access and independently verified its findings against live screenshots (desktop 1440px, mobile 390px) and the live-rendered HTML, including fetching the actual Sanity hero image asset to confirm its real source resolution (123×125px, requested at 900×1100 — a ~7x upscale).

## Overall Impression

The design *system* (tokens, DogCard, MariageCard) is genuinely specific to this kennel and well-executed where it's used. The *homepage* under-uses it: the page's single biggest differentiator (Mariages-as-relationships) gets zero visual investment, the hero photo is visibly blurry, and one content card renders as a blank box. The single biggest opportunity: wire the homepage's "Nos Chiots" section to the same `MariageCard`/query already built and proven on `/nos-chiots` — this alone would fix the P0 and materially improve the emotional arc of the page.

## What's Working

1. **Header lockup + flourish** — "DE SAINT PRIXE" / "ÉLEVAGE DE BEARDED COLLIE" / the gold heart-and-line SVG directly executes the brand-commitment language and appears on every page — could not be dropped into another breeder's site unchanged.
2. **DogCard pedigree block** — showing Père/Mère/Né(e) le/titles inline on every roster card, instead of a photo-and-price tile, is a faithful execution of "every dog shown must trace to real pedigree data."
3. **Alternating section backgrounds** (ink → white → cream → white → cream → white) — a restrained, palette-only way to chunk six sections without extra chrome, consistent with the "visual restraint over cuteness" principle.

## Priority Issues

**[P0] "Nos Chiots" section is fully disconnected from real data**
- **Why it matters**: PRODUCT.md names "breeding pairs framed as relationships" as one of only two things that separate this site from a generic puppies-for-sale template — the highest-traffic page gives it zero visual investment, less than the roster preview sections above it.
- **Fix**: Fetch `MARIAGES_WITH_CHIOTS_QUERY` (already used identically in `nos-chiots/index.astro`) and render at least the first `MariageCard` on the homepage.
- **Suggested command**: `/impeccable layout` (or direct implementation)

**[P1] Hero image is severely upscaled and visibly blurry**
- **Why it matters**: The source asset is ~123×125px, requested at 900×1100 (~7x upscale) — this is the largest image on the site and it undermines trust in the first three seconds, contradicting the "real photography, never decoration" principle.
- **Fix**: Replace with a properly-sized image in Sanity Studio; consider a minimum-resolution guard.
- **Suggested command**: content fix (Sanity Studio), no code command needed

**[P1] The Mariage blog post's Actualités card renders as a blank white box**
- **Why it matters**: `{p.coverImage && (...)}` has no fallback when the image is missing — confirmed live, this is the card about the site's core differentiator, and it's the one that looks broken, right where it should be building excitement.
- **Fix**: Reuse `DogCard`'s existing `bg-placeholder` fallback pattern; add `publishedAt` to the homepage cards too (already used on `/actualites`).
- **Suggested command**: `/impeccable harden`

**[P2] No "see all" link under Nos Mâles / Nos Femelles teasers**
- **Why it matters**: A visitor drawn in by the 2 dogs shown has no direct path to the rest of the roster from that section.
- **Fix**: Port the "Tous les découvrir" CTA pattern already used in `nos-chiens.astro`.
- **Suggested command**: `/impeccable layout`

**[P2] Nav has 10 flat items with 3 overlapping roster links**
- **Why it matters**: Exceeds working-memory chunking guidance; becomes a 10-item vertical list on mobile, 3 of which are near-duplicates (Nos Chiens / Nos Mâles / Nos Femelles).
- **Fix**: Group the roster links under a submenu/dropdown. Site-wide fix, not homepage-only.
- **Suggested command**: `/impeccable layout`

## Persona Red Flags

**First-timer puppy buyer**: Sees "Père : Ch. Seagull Let's Talk about It" with zero explanation of "Ch." (Champion title). No stated bridge from "here are our breeding dogs" to "here's how to get a puppy" — and the actual availability/contact path (Nos Chiots) is the emptiest, least reassuring section on the page.

**Impatient show-circuit follower**: Homepage Actualités cards show title + image only, no date — "PERIGUEUX" alone tells this persona nothing about recency without a click. All posts render identically regardless of type (show result vs. litter announcement). The one card without a photo is the Mariage announcement — looks unmaintained to the exact audience whose trust depends on the site looking current.

**Mobile user**: Hero is 100% text on a flat dark rectangle — the hero image is hidden below 1024px (`hidden lg:block`), the single biggest loss of emotional hook on the primary device. The blank Mariage card is the literal first card in the mobile Actualités stack.

## Minor Observations

- Live hero headline has accents stripped ("DECOUVREZ" not "DÉCOUVREZ") — a Sanity content-entry nuance from migration, not a code bug; fixable directly in Studio.
- `gold-deep` (#b9895a) on white/cream measures ~2.9–3.1:1 contrast — below WCAG AA's 4.5:1 for normal text. Affects the "En savoir plus ›" link and DogCard's titles line.
- `Flourish.astro` — the brand's one bespoke decorative motif — is used under the header tagline and Mariage couple names, but never under the homepage's own section headings (Actualités, Nos Mâles, Nos Femelles, Nos Chiots).
- No zero-result guard on the Nos Mâles/Nos Femelles sections (unlike Actualités' `.length > 0` check and `/nos-chiots`'s empty-state message) — if a query ever returns zero, the heading renders over an empty grid.
- Shih Tzu is entirely absent from the homepage (query hardcoded to `breed: 'Bearded Collie'`) — no card, section, or mention.

## Questions to Consider

1. Why does the roster preview get more visual investment on the homepage than "Nos Chiots," when PRODUCT.md names the Mariage-as-relationship framing as one of only two things separating this site from a generic template?
2. The homepage's "Nos Chiots" section doesn't query Sanity at all — was the static button a deliberate lightweight placeholder, or was it simply never wired up?
3. PRODUCT.md asks for the puppy-buyer and show-circuit audiences to be served at equal priority. Given the Actualités preview strips dates, doesn't distinguish show-results from litter announcements, and renders its one Mariage post as a blank box — does this homepage actually treat the show community as equal, or as an afterthought?

import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Image | undefined | null) {
  // auto('format') lets Sanity's CDN negotiate WebP/AVIF per-browser instead of
  // always serving the original upload format.
  return source ? builder.image(source).auto('format') : null;
}

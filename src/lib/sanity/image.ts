import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Image | undefined | null) {
  return source ? builder.image(source) : null;
}

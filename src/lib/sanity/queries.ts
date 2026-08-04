import { defineQuery } from 'groq';

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]`);
export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]`);
export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]`);
export const PORTFOLIO_PAGE_QUERY = defineQuery(`
  *[_type == "portfolioPage"][0] {
    ...,
    "images": images[]{
      ...,
      "width": asset->metadata.dimensions.width
    }
  }
`);
export const ACTUALITES_PAGE_QUERY = defineQuery(`*[_type == "actualitesPage"][0]`);
export const NOS_CHIENS_PAGE_QUERY = defineQuery(`*[_type == "nosChiensPage"][0]`);
export const NOS_MALES_PAGE_QUERY = defineQuery(`*[_type == "nosMalesPage"][0]`);
export const NOS_FEMELLES_PAGE_QUERY = defineQuery(`*[_type == "nosFemellesPage"][0]`);
export const NOS_PORTEES_PAGE_QUERY = defineQuery(`*[_type == "nosPorteesPage"][0]`);

export const DOGS_BY_SEX_QUERY = defineQuery(
  `*[_type == "dog" && sex == $sex] | order(birthDate desc)`,
);
export const DOG_SLUGS_QUERY = defineQuery(`*[_type == "dog" && defined(slug.current)]{ "slug": slug.current }`);
export const DOG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "dog" && slug.current == $slug][0] {
    ...,
    pedigreeFile {
      ...,
      "url": asset->url,
      "filename": asset->originalFilename
    }
  }
`);

export const MARIAGES_WITH_CHIOTS_QUERY = defineQuery(`
  *[_type == "mariage"] | order(litterDate desc) {
    ...,
    "puppies": *[_type == "chiot" && references(^._id)]
  }
`);

export const MARIAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "mariage" && slug.current == $slug][0] {
    ...,
    "puppies": *[_type == "chiot" && references(^._id)]
  }
`);

export const MARIAGE_SLUGS_QUERY = defineQuery(
  `*[_type == "mariage" && defined(slug.current)]{ "slug": slug.current }`,
);

export const BLOG_POSTS_QUERY = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc)`,
);
export const BLOG_POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "blogPost" && slug.current == $slug][0]`,
);
export const BLOG_POST_SLUGS_QUERY = defineQuery(
  `*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`,
);

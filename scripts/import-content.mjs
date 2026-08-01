// One-shot content migration: reads the extracted Wix content JSON
// (../saint-prixe-web-content/) and pushes real Sanity documents.
// Every image is downloaded from wixstatic and re-uploaded as a Sanity asset.
// Safe to re-run: it looks up existing documents by a stable _id before creating.

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../../saint-prixe-web-content');

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

const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, ...p), 'utf8'));

// ---------- image upload (cached by source URL so repeats don't re-upload) ----------
const imageCache = new Map();
async function uploadImage(url, filenameHint) {
  if (!url) return null;
  if (imageCache.has(url)) return imageCache.get(url);
  try {
    const buffer = await withRetry(async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    });
    const filename = (filenameHint || url.split('/').pop() || 'image').split('?')[0].slice(0, 100);
    const asset = await withRetry(() => client.assets.upload('image', buffer, { filename }));
    const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    imageCache.set(url, ref);
    process.stdout.write('.');
    return ref;
  } catch (err) {
    console.warn(`\n  ! image upload failed for ${url}: ${err.message}`);
    return null;
  }
}

function blocks(text) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: line }],
    }));
}

async function withRetry(fn, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const transient = /ENOTFOUND|ETIMEDOUT|ECONNRESET|EAI_AGAIN/.test(String(err?.code || err?.message || ''));
      if (!transient || i === attempts - 1) throw err;
      const delay = 1500 * (i + 1);
      console.warn(`\n  (transient network error, retrying in ${delay}ms: ${err.code || err.message})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function upsert(doc) {
  await withRetry(() => client.createOrReplace(doc));
  console.log(`  ✔ ${doc._type} ${doc._id}`);
}

// ---------- pedigree text parser: "Né(e) le DD/MM/YYYY Père: X Mère: Y Palmarès: Z1 Z2 Z3" ----------
function parsePedigree(text) {
  const out = { birthDate: null, sire: null, dam: null, titles: [] };
  if (!text) return out;
  const born = text.match(/N[ée]e? le (\d{2})\/(\d{2})\/(\d{4})/i);
  if (born) out.birthDate = `${born[3]}-${born[2]}-${born[1]}`;
  const sire = text.match(/P[èe]re\s*:\s*(.+?)(?=\s+M[èe]re\s*:|\s+Palmar[èe]s\s*:|$)/i);
  if (sire) out.sire = sire[1].trim();
  const dam = text.match(/M[èe]re\s*:\s*(.+?)(?=\s+Palmar[èe]s\s*:|$)/i);
  if (dam) out.dam = dam[1].trim();
  const titlesMatch = text.match(/Palmar[èe]s\s*:\s*(.+)$/i);
  if (titlesMatch) {
    // Titles are space-separated "Champion ..." phrases with no reliable delimiter in the
    // source text; split on a title-starting keyword boundary instead of guessing punctuation.
    const raw = titlesMatch[1].trim();
    const parts = raw.split(/(?=\bCh(?:ampion(?:ne)?)?\.?\s|Cotation|Best of|Vice\s|BOS\b|CAC\b)/g)
      .map((s) => s.trim())
      .filter(Boolean);
    out.titles = parts.length ? parts : [raw];
  }
  return out;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
async function importSiteSettings() {
  console.log('\n— siteSettings —');
  const chrome = readJSON('pages', 'site-chrome.json');
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'De Saint Prixe',
    tagline: 'Élevage de Bearded Collie',
    navItems: chrome.nav.map((n) => ({
      _key: slugify(n.label),
      label: n.label,
      href: n.href.replace('https://www.elevagedesaintprixe.com', '') || '/',
    })),
    email: chrome.footer.email,
    phone: chrome.footer.phone,
    address: chrome.footer.address_lines.join('\n'),
    socialLinks: chrome.footer.social.map((s) => ({
      _key: slugify(s.platform),
      platform: s.platform,
      url: s.href,
    })),
    footerText: chrome.footer.copyright,
  });
}

async function importHomePage() {
  console.log('\n— homePage —');
  const home = readJSON('pages', 'accueil.json');
  const heroSection = home.sections.find((s) => s.heading === 'DECOUVREZ NOTRE ELEVAGE');
  const aboutTeaser = home.sections.find((s) => s.heading === 'À PROPOS DE NOTRE ÉLEVAGE');
  const heroImage = await uploadImage(home.images[0]?.src, 'hero.jpg');
  await upsert({
    _id: 'homePage',
    _type: 'homePage',
    heroHeadline: heroSection?.heading || 'DECOUVREZ NOTRE ELEVAGE',
    heroSubheadline: heroSection?.text || '',
    heroImage: heroImage || undefined,
    heroButtonLabel: 'Nos Portées',
    heroButtonHref: '/nos-chiots',
    sections: aboutTeaser
      ? [{ _key: 'about', heading: aboutTeaser.heading, body: blocks(aboutTeaser.text) }]
      : [],
  });
}

async function importAboutPage() {
  console.log('\n— aboutPage —');
  const about = readJSON('pages', 'a-propos.json');
  const realSections = about.sections.filter((s) => s.heading && s.text);
  await upsert({
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: 'À propos',
    sections: realSections.map((s, i) => ({
      _key: `s${i}`,
      heading: s.heading,
      body: blocks(s.text),
    })),
  });
}

async function importContactPage() {
  console.log('\n— contactPage —');
  await upsert({
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact',
    intro: '',
  });
}

async function importInquiryPage() {
  console.log('\n— inquiryPage —');
  await upsert({
    _id: 'inquiryPage',
    _type: 'inquiryPage',
    title: 'Explorez nos services et contactez-nous',
    intro: 'Nos services',
  });
}

async function importActualitesPage() {
  console.log('\n— actualitesPage —');
  await upsert({
    _id: 'actualitesPage',
    _type: 'actualitesPage',
    title: 'Actualités',
    intro: '',
  });
}

async function importPortfolioPage() {
  console.log('\n— portfolioPage —');
  const p = readJSON('pages', 'portfolio.json');
  console.log(`  uploading ${p.images.length} portfolio photos…`);
  const images = [];
  for (const img of p.images) {
    const ref = await uploadImage(img.src);
    if (ref) images.push({ ...ref, _key: `img-${images.length}` });
  }
  await upsert({
    _id: 'portfolioPage',
    _type: 'portfolioPage',
    title: 'Portfolio',
    intro: '',
    images,
  });
}

// ---------- dogs (Nos Mâles / Nos Femelles / Nos Shih Tzu) ----------
async function importDogs() {
  console.log('\n— dogs —');
  const males = readJSON('pages', 'nos-males.json');
  const femelles = readJSON('pages', 'nos-femelles.json');
  const shihTzu = readJSON('pages', 'nos-shih-tzu.json');

  let order = 0;
  for (const d of males.dogs || []) {
    const pedigree = parsePedigree(d.pedigree_excerpt);
    const photo = await uploadImage(d.image, `${d.slug}.jpg`);
    await upsert({
      _id: `dog-${slugify(d.name)}`,
      _type: 'dog',
      name: d.name,
      breed: 'Bearded Collie',
      sex: 'Mâle',
      photo: photo || undefined,
      birthDate: pedigree.birthDate,
      sire: pedigree.sire,
      dam: pedigree.dam,
      titles: pedigree.titles,
      slug: { _type: 'slug', current: d.slug },
      displayOrder: order++,
    });
  }

  order = 0;
  for (const d of femelles.dogs || []) {
    const pedigree = parsePedigree(d.pedigree_excerpt);
    const photo = await uploadImage(d.image, `${d.slug}.jpg`);
    await upsert({
      _id: `dog-${slugify(d.name)}`,
      _type: 'dog',
      name: d.name,
      breed: 'Bearded Collie',
      sex: 'Femelle',
      photo: photo || undefined,
      birthDate: pedigree.birthDate,
      sire: pedigree.sire,
      dam: pedigree.dam,
      titles: pedigree.titles,
      slug: { _type: 'slug', current: d.slug },
      displayOrder: order++,
    });
  }

  order = 0;
  for (const d of shihTzu.dogs || []) {
    const photo = await uploadImage(d.image, `shih-tzu-${slugify(d.name)}.jpg`);
    await upsert({
      _id: `dog-shihtzu-${slugify(d.name)}`,
      _type: 'dog',
      name: d.name,
      breed: 'Shih Tzu',
      // sex intentionally left unset — the live site's "Nos Shih tzu" grid does not publish it
      // for any of the 5 dogs, so guessing would be inventing data. Set it in Sanity Studio.
      photo: photo || undefined,
      slug: { _type: 'slug', current: slugify(d.name) },
      displayOrder: order++,
    });
  }
  console.log(
    '\n  NOTE: sex was left empty for the 5 Shih Tzu (NAF NAF, NESQUICK, NIKITA, OLLY, OLGA) —' +
      ' not published on the source site. Set it in Sanity Studio if you want them split like the Bearded Collies.',
  );
}

// ---------- blog posts (Actualités) ----------
async function importBlogPosts() {
  console.log('\n— blogPosts —');
  const postsDir = path.join(CONTENT_DIR, 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const rawSlug = file.replace(/\.json$/, '');
    const slug = slugify(rawSlug); // Sanity document IDs must be ASCII; URLs stay simple too.
    const post = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf8'));
    const cover = post.images?.[0]?.src ? await uploadImage(post.images[0].src, `${slug}-cover.jpg`) : null;

    const bodyBlocks = [];
    for (const s of post.sections || []) {
      if (s.heading) {
        bodyBlocks.push({
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: s.heading }],
        });
      }
      bodyBlocks.push(...blocks(s.text));
    }

    await upsert({
      _id: `blogPost-${slug}`,
      _type: 'blogPost',
      title: post.title?.split('|')[0]?.trim() || post.headings?.[0] || slug,
      slug: { _type: 'slug', current: slug },
      publishedAt: post.date ? post.date.slice(0, 10) : undefined,
      coverImage: cover || undefined,
      excerpt: post.sections?.[0]?.text?.slice(0, 200) || '',
      body: bodyBlocks,
      sourceUrl: post.url,
    });
  }
}

// ---------- one real, verifiable mariage (see project notes: intentionally not fabricated) ----------
async function importMariage() {
  console.log('\n— mariage (Romy & Maverick, from the real blog announcement) —');
  const post = readJSON('posts', 'mariage-romy-maverick.json');
  const femelles = readJSON('pages', 'nos-femelles.json');
  const romy = femelles.dogs.find((d) => d.name === 'ROMY');
  const description = (post.sections || []).map((s) => s.text).filter(Boolean).join(' ');
  const bridePhoto = romy ? await uploadImage(romy.image, 'romy.jpg') : null;
  const cover = post.images?.[0]?.src ? await uploadImage(post.images[0].src, 'mariage-romy-maverick.jpg') : null;

  await upsert({
    _id: 'mariage-romy-maverick',
    _type: 'mariage',
    title: 'Romy & Maverick',
    slug: { _type: 'slug', current: 'romy-maverick' },
    dogBrideName: 'Romy',
    dogBridePhoto: bridePhoto || undefined,
    dogGroomName: 'Maverick',
    // No individual photo of Maverick exists on the source site (he is not part of the
    // De Saint Prixe roster) — only the joint announcement graphic, used as coverImage below.
    coverImage: cover || undefined,
    description,
    weddingDate: post.date ? post.date.slice(0, 10) : undefined,
    status: 'À venir',
  });
  console.log(
    '\n  NOTE: no chiot documents were created for this mariage — the litter has not been born yet' +
      ' on the source site, so there is no real puppy data to import.',
  );
}

// ============================================================================
async function main() {
  console.log(`Importing into Sanity project ${process.env.PUBLIC_SANITY_PROJECT_ID} / dataset ${process.env.PUBLIC_SANITY_DATASET || 'production'}`);
  await importSiteSettings();
  await importHomePage();
  await importAboutPage();
  await importContactPage();
  await importInquiryPage();
  await importActualitesPage();
  await importPortfolioPage();
  await importDogs();
  await importBlogPosts();
  await importMariage();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

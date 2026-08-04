import type {SlugValidationContext} from 'sanity'

/** Async slug-uniqueness check scoped to one document type, with a clear French error
 * message telling the editor to add a number — used by blogPost/dog/mariage slug fields. */
export function isUniqueSlug(docType: string) {
  return async (slug: string | undefined, context: SlugValidationContext) => {
    if (!slug) return true
    const {document, getClient} = context
    const client = getClient({apiVersion: '2024-01-01'})
    const id = document?._id.replace(/^drafts\./, '')
    const params = {docType, slug, draft: `drafts.${id}`, published: id}
    const query = `!defined(*[_type == $docType && slug.current == $slug && !(_id in [$draft, $published])][0]._id)`
    const isUnique = await client.fetch(query, params)
    return isUnique || 'Ce slug existe déjà — ajoutez un chiffre à la fin (ex : mon-titre-2).'
  }
}

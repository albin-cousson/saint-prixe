import type {DocumentActionComponent, DocumentActionProps, SanityClient} from 'sanity'

// Which field holds the "main" photo per document type, and which array
// field should have it as its first element — mirrors the site's own
// "gallery[0] = main photo" display convention (see queries.ts).
const COVER_FIELD_BY_TYPE: Record<string, string> = {
  blogPost: 'coverImage',
  dog: 'photo',
}

/** Wraps the default Publish action for blogPost/dog: before publishing, makes sure the
 * cover field is gallery[0], so new content never needs a manual reorder. Leaves every
 * other document type's Publish action completely untouched. */
export function createGallerySyncPublishAction(
  originalAction: DocumentActionComponent,
  getClient: (options: {apiVersion: string}) => SanityClient,
): DocumentActionComponent {
  return function GallerySyncPublishAction(props: DocumentActionProps) {
    const original = originalAction(props)
    const coverField = COVER_FIELD_BY_TYPE[props.type]
    if (!original || !coverField) return original

    return {
      ...original,
      onHandle: async () => {
        // Only the draft can be patched here — if there's no pending draft (e.g. re-publish
        // with nothing changed), there's nothing to sync, so just fall through to publish.
        const doc = props.draft as Record<string, any> | null
        const cover = doc?.[coverField]
        const gallery = Array.isArray(doc?.gallery) ? doc.gallery : []

        const alreadyFirst = cover?.asset?._ref && gallery[0]?.asset?._ref === cover.asset._ref
        if (doc && cover?.asset?._ref && !alreadyFirst) {
          const rest = gallery.filter((img: any) => img?.asset?._ref !== cover.asset._ref)
          const client = getClient({apiVersion: '2024-01-01'})
          await client.patch(`drafts.${props.id}`).set({gallery: [cover, ...rest]}).commit()
        }

        original.onHandle?.()
      },
    }
  }
}

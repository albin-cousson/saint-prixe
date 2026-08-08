import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

// Which field holds the "main" photo per document type, and which array
// field should have it as its first element — mirrors the site's own
// "gallery[0] = main photo" display convention (see queries.ts).
const COVER_FIELD_BY_TYPE: Record<string, string> = {
  blogPost: 'coverImage',
  dog: 'photo',
}

/** Wraps the default Publish action for blogPost/dog: before publishing, makes sure the
 * cover field is gallery[0], so new content never needs a manual reorder. Leaves every
 * other document type's Publish action completely untouched.
 *
 * Uses useDocumentOperation's patch (not a raw client.patch over HTTP) so the sync goes
 * through Studio's own document store — the built-in publish that fires right after reads
 * from that same store, so it can never race against or overwrite an out-of-band HTTP patch. */
export function createGallerySyncPublishAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function GallerySyncPublishAction(props: DocumentActionProps) {
    const {patch} = useDocumentOperation(props.id, props.type)
    const original = originalAction(props)
    const coverField = COVER_FIELD_BY_TYPE[props.type]
    if (!original || !coverField) return original

    return {
      ...original,
      onHandle: () => {
        const doc = props.draft as Record<string, any> | null
        const cover = doc?.[coverField]
        const gallery = Array.isArray(doc?.gallery) ? doc.gallery : []

        const alreadyFirst = cover?.asset?._ref && gallery[0]?.asset?._ref === cover.asset._ref
        if (doc && cover?.asset?._ref && !alreadyFirst) {
          const rest = gallery.filter((img: any) => img?.asset?._ref !== cover.asset._ref)
          patch.execute([{set: {gallery: [cover, ...rest]}}])
        }

        original.onHandle?.()
      },
    }
  }
}

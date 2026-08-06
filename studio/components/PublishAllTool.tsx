import {useState} from 'react'
import {useClient} from 'sanity'
import {Button, Card, Stack, Text, Spinner, Badge} from '@sanity/ui'
import {Icon} from '@sanity/icons'

const API_VERSION = '2024-01-01'

export function PublishAllIcon() {
  return <Icon symbol="publish" />
}

export function PublishAllTool() {
  const client = useClient({apiVersion: API_VERSION})
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [publishedCount, setPublishedCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  async function publishAll() {
    setStatus('loading')
    setErrorMessage('')
    try {
      const drafts: {_id: string}[] = await client.fetch('*[_id in path("drafts.**")]{_id}')
      let count = 0
      for (const draft of drafts) {
        const publishedId = draft._id.replace(/^drafts\./, '')
        const doc = await client.getDocument(draft._id)
        if (!doc) continue
        const {_id, _rev, ...rest} = doc
        await client.createOrReplace({...rest, _id: publishedId})
        await client.delete(draft._id)
        count++
      }
      setPublishedCount(count)
      setStatus('done')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }

  return (
    <Card padding={5} height="fill">
      <Stack space={4} style={{maxWidth: 480}}>
        <Text size={3} weight="bold">
          Publier toutes les modifications
        </Text>
        <Text size={1} muted>
          Publie en une seule fois tous les brouillons en attente sur toutes les pages et fiches —
          plus besoin de retourner sur chaque page une par une pour cliquer sur "Publish".
        </Text>
        <Text size={1} muted>
          Ce bouton ne vérifie pas les champs obligatoires comme le fait le "Publish" habituel —
          vérifiez que vos fiches sont complètes avant de publier en masse.
        </Text>

        <Button
          text={status === 'loading' ? 'Publication en cours…' : 'Publier tout'}
          tone="positive"
          disabled={status === 'loading'}
          onClick={publishAll}
        />

        {status === 'loading' && <Spinner />}
        {status === 'done' && (
          <Badge tone={publishedCount > 0 ? 'positive' : 'default'} padding={3}>
            {publishedCount > 0
              ? `${publishedCount} document(s) publié(s) avec succès.`
              : 'Rien à publier — aucune modification en attente.'}
          </Badge>
        )}
        {status === 'error' && (
          <Badge tone="critical" padding={3}>
            Erreur : {errorMessage}
          </Badge>
        )}
      </Stack>
    </Card>
  )
}

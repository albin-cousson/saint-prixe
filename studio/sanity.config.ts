import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {PublishAllTool, PublishAllIcon} from './components/PublishAllTool'
import {createGallerySyncPublishAction} from './actions/gallerySyncPublishAction'

export default defineConfig({
  name: 'default',
  title: 'saint-prixe',

  projectId: 'cixbo9ah',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev) =>
      prev.map((action) =>
        action.action === 'publish' ? createGallerySyncPublishAction(action) : action,
      ),
  },

  tools: (prev) => [
    ...prev,
    {
      name: 'publish-all',
      title: 'Publier tout',
      icon: PublishAllIcon,
      component: PublishAllTool,
    },
  ],
})

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'actualitesPage',
  title: 'Page Actualités (liste du blog)',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'text'}),
  ],
  preview: {
    prepare: () => ({title: 'Page Actualités'}),
  },
})

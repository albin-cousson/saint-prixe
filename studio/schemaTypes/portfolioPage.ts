import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'portfolioPage',
  title: 'Page Portfolio',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'text'}),
    defineField({
      name: 'images',
      title: 'Galerie',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Portfolio'}),
  },
})

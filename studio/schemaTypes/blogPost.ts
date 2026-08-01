import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Article (Actualités)',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'publishedAt', title: 'Date de publication', type: 'date'}),
    defineField({name: 'coverImage', title: 'Image de couverture', type: 'image', options: {hotspot: true}}),
    defineField({name: 'excerpt', title: 'Résumé (liste des articles)', type: 'text'}),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}},
      ],
    }),
    defineField({
      name: 'sourceUrl',
      title: 'URL Wix d\'origine (référence, non affichée)',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'coverImage'},
  },
  orderings: [
    {
      title: 'Date de publication, récent en premier',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})

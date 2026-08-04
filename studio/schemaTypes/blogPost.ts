import {defineField, defineType} from 'sanity'
import {isUniqueSlug} from '../lib/isUniqueSlug'

export default defineType({
  name: 'blogPost',
  title: 'Article (Actualités)',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le titre. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('blogPost')),
    }),
    defineField({name: 'publishedAt', title: 'Date de publication', type: 'date'}),
    defineField({name: 'coverImage', title: 'Image de couverture', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos secondaires)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
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

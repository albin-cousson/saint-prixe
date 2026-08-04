import {defineField, defineType} from 'sanity'
import {isUniqueSlug} from '../lib/isUniqueSlug'

export default defineType({
  name: 'mariage',
  title: 'Mariage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (ex: Romy & Maverick)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le titre. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('mariage')),
    }),
    defineField({name: 'dogGroomName', title: 'Nom du mâle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'dogGroomPhoto', title: 'Photo du mâle', type: 'image', options: {hotspot: true}}),
    defineField({name: 'dogBrideName', title: 'Nom de la femelle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'dogBridePhoto', title: 'Photo de la femelle', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'litterDate', title: 'Date de naissance des chiots', type: 'date'}),
  ],
  preview: {
    select: {title: 'title', media: 'dogGroomPhoto'},
  },
})

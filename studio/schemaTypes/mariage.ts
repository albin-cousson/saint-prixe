import {defineField, defineType} from 'sanity'

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
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'dogGroomName', title: 'Nom du mâle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'dogGroomPhoto', title: 'Photo du mâle', type: 'image', options: {hotspot: true}}),
    defineField({name: 'dogBrideName', title: 'Nom de la femelle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'dogBridePhoto', title: 'Photo de la femelle', type: 'image', options: {hotspot: true}}),
    defineField({name: 'coverImage', title: 'Photo de couverture', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'weddingDate', title: "Date d'union", type: 'date'}),
    defineField({name: 'litterDate', title: 'Date de naissance des chiots', type: 'date'}),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {list: ['Disponible', 'Complet', 'À venir']},
    }),
  ],
  preview: {
    select: {title: 'title', media: 'coverImage'},
  },
})

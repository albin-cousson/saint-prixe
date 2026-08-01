import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dog',
  title: 'Chien (Nos Chiens / Mâles / Femelles / Shih Tzu)',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'breed',
      title: 'Race',
      type: 'string',
      options: {list: ['Bearded Collie', 'Shih Tzu']},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sex',
      title: 'Sexe',
      type: 'string',
      options: {list: ['Mâle', 'Femelle']},
      description: 'Laisser vide si non confirmé plutôt que de deviner.',
    }),
    defineField({name: 'photo', title: 'Photo principale', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'birthDate', title: 'Date de naissance', type: 'date'}),
    defineField({name: 'sire', title: 'Père', type: 'string'}),
    defineField({name: 'dam', title: 'Mère', type: 'string'}),
    defineField({
      name: 'titles',
      title: 'Palmarès',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Un titre par ligne (facultatif — les Shih Tzu n\'en ont pas)',
    }),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({
      name: 'displayOrder',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Plus petit = affiché en premier',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'breed', media: 'photo'},
  },
  orderings: [
    {title: "Ordre d'affichage", name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]},
  ],
})

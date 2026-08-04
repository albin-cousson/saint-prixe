import {defineField, defineType} from 'sanity'
import {isUniqueSlug} from '../lib/isUniqueSlug'

export default defineType({
  name: 'dog',
  title: 'Chien (Nos Chiens / Mâles / Femelles)',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom', type: 'string', validation: (Rule) => Rule.required()}),
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
      description: 'Un titre par ligne (facultatif)',
    }),
    defineField({
      name: 'pedigreeFile',
      title: 'Document pedigree (PDF)',
      type: 'file',
      description: 'Facultatif — si présent, un bouton de téléchargement apparaît sur la fiche du chien.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le nom. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('dog')),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'sex', media: 'photo'},
  },
})

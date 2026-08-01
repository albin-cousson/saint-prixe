import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Page Accueil',
  type: 'document',
  fields: [
    defineField({name: 'heroHeadline', title: 'Titre du hero', type: 'string'}),
    defineField({name: 'heroSubheadline', title: 'Sous-titre du hero', type: 'string'}),
    defineField({name: 'heroImage', title: 'Image du hero', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroButtonLabel', title: 'Texte du bouton', type: 'string'}),
    defineField({name: 'heroButtonHref', title: 'Lien du bouton', type: 'string'}),
    defineField({
      name: 'sections',
      title: 'Sections additionnelles',
      type: 'array',
      of: [{type: 'pageSection'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Accueil'}),
  },
})

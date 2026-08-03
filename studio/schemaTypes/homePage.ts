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
      title: 'Sections de la page',
      description:
        'Sections additionnelles (texte libre) et sections liées à une page (contenus dynamiques : actualités, portées, mâles, femelles). L\'ordre ici détermine l\'ordre d\'affichage sur la page.',
      type: 'array',
      of: [
        {type: 'pageSection', title: 'Section additionnelle'},
        {type: 'actualitesSection', title: 'Actualités'},
        {type: 'mariagesSection', title: 'Nos portées'},
        {type: 'malesSection', title: 'Nos mâles'},
        {type: 'femellesSection', title: 'Nos femelles'},
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Accueil'}),
  },
})

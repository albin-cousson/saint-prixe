import {defineField, defineType} from 'sanity'

/** Homepage section listing Bearded Collie femelles. */
export default defineType({
  name: 'femellesSection',
  title: 'Nos femelles',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Titre de la section', type: 'string'}),
    defineField({name: 'limit', title: "Nombre d'éléments affichés", type: 'number'}),
    defineField({name: 'ctaLabel', title: 'Texte du bouton "voir plus"', type: 'string'}),
    defineField({name: 'ctaHref', title: 'Lien du bouton "voir plus"', type: 'string'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Nos femelles', subtitle: 'Nos femelles'}
    },
  },
})

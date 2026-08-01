import {defineField, defineType} from 'sanity'

/** Reusable flexible content block used by the simpler pages (About, Contact, Portfolio, Inquiry). */
export default defineType({
  name: 'pageSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Titre', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
})

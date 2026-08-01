import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: 'Texte d\'introduction', type: 'text'}),
    defineField({name: 'sections', title: 'Sections additionnelles', type: 'array', of: [{type: 'pageSection'}]}),
  ],
  preview: {
    prepare: () => ({title: 'Page Contact'}),
  },
})

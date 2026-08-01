import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'Page À propos',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'heroImage', title: 'Image principale', type: 'image', options: {hotspot: true}}),
    defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'pageSection'}]}),
  ],
  preview: {
    prepare: () => ({title: 'Page À propos'}),
  },
})

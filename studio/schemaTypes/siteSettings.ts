import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Nom du site', type: 'string', initialValue: 'De Saint Prixe'}),
    defineField({name: 'tagline', title: 'Slogan (sous le logo)', type: 'string'}),
    defineField({
      name: 'navItems',
      title: 'Menu de navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Libellé', type: 'string'},
            {name: 'href', title: 'Lien', type: 'string'},
          ],
        },
      ],
    }),
    defineField({name: 'email', title: 'Email de contact', type: 'string'}),
    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'address', title: 'Adresse', type: 'text'}),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Plateforme', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
    }),
    defineField({name: 'footerText', title: 'Texte de pied de page / copyright', type: 'string'}),
  ],
})

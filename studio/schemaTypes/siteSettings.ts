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
      description: 'Ordre = ordre d\'affichage dans le menu. Ajoutez des sous-liens pour créer un sous-menu (ex : "Nos Chiens" > "Nos Mâles"/"Nos Femelles").',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Lien de menu',
          fields: [
            {name: 'label', title: 'Libellé', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'href', title: 'Lien (ex : /a-propos)', type: 'string', validation: (Rule) => Rule.required()},
            {
              name: 'children',
              title: 'Sous-menu',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navSubItem',
                  title: 'Sous-lien',
                  fields: [
                    {name: 'label', title: 'Libellé', type: 'string', validation: (Rule) => Rule.required()},
                    {name: 'href', title: 'Lien (ex : /nos-males)', type: 'string', validation: (Rule) => Rule.required()},
                  ],
                  preview: {select: {title: 'label', subtitle: 'href'}},
                },
              ],
            },
          ],
          preview: {
            select: {title: 'label', subtitle: 'href', children: 'children'},
            prepare({title, subtitle, children}) {
              return {title, subtitle: children?.length ? `${subtitle} (+${children.length} sous-lien${children.length > 1 ? 's' : ''})` : subtitle}
            },
          },
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
  ],
})

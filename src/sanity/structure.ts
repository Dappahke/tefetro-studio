// src/sanity/structure.ts - COMPLETE FIXED VERSION
import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Blog Section
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
              S.divider(),
              S.documentTypeListItem('guestSubmission').title('Guest Submissions'),
            ])
        ),
      
      // Divider
      S.divider(),
      
      // All other document types (auto-detected)
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'category', 'author', 'guestSubmission'].includes(listItem.getId() as string)
      ),
    ])
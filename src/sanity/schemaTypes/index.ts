// src/sanity/schemaTypes/index.ts - FIXED EXPORT NAME
import { postType } from './postType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { blockContentType } from './blockContentType'
import { guestSubmissionType } from './guestSubmissionType'

// Export as 'schema' to match what sanity.config.ts expects
export const schema = {
  types: [
    postType,
    authorType,
    categoryType,
    blockContentType,
    guestSubmissionType,
  ],
}
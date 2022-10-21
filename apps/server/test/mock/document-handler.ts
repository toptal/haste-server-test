import { DocumentHandlerInterface } from '~/types/document-handler'

export const mockDocumentHandler = {
  getDocument: 'get-document',
  addDocument: 'add-document',
  getRawDocument: 'getRawDocument'
} as unknown as DocumentHandlerInterface

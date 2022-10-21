import { Router } from 'express'

import type { DocumentHandlerInterface } from '~/types/document-handler'

import documentRecorderMiddleware from '~/middleware/document-recorder'
import blockedOwnerCheckerMiddleware from '~/middleware/blocked-owner-checker'

const routes = (documentHandler: DocumentHandlerInterface): Router => {
  const router = Router()

  router.get('/:id', blockedOwnerCheckerMiddleware, documentHandler.getDocument)

  router.head(
    '/:id',
    blockedOwnerCheckerMiddleware,
    documentHandler.getDocument
  )

  router.post('/', documentHandler.addDocument, documentRecorderMiddleware)

  return router
}

export default routes

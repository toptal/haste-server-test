import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import healthcheck from '~/lib/healthcheck'

const routes = (): Router => {
  const router = Router()

  router.get('/', async (req, res): Promise<void> => {
    const result = await healthcheck()

    res.status(StatusCodes.OK).json(result)
  })

  return router
}

export default routes

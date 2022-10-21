import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next'
import { NotFoundError } from '@prisma/client/runtime'

import { authOptions } from '~/pages/api/auth/[...nextauth]'

import { updateUserApiToken, findUserByEmail } from '~/lib/repositories/user'
import log from '~/lib/log'

const generateToken = async (
  res: NextApiResponse,
  userEmail: string
): Promise<void> => {
  const user = await updateUserApiToken(userEmail)

  res.status(StatusCodes.OK).json({ apiToken: user.apiToken })
}

const getToken = async (
  res: NextApiResponse,
  userEmail: string
): Promise<void> => {
  const user = await findUserByEmail(userEmail)

  res.status(StatusCodes.OK).json({ apiToken: user.apiToken })
}

const tokenAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    const userEmail = session?.user?.email

    if (!session || !userEmail) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: true })

      return
    }

    if (req.method === 'POST') {
      return await generateToken(res, userEmail)
    }

    if (req.method === 'GET') {
      return await getToken(res, userEmail)
    }

    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ error: true })
  } catch (e) {
    log.error(e)

    if (e instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).end()
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    }
  }
}

export default tokenAPI

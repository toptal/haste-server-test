import { ErrorType } from '@hastebin/data-store-helper'

import db from '~/lib/db'
import tables from '~/lib/db/tables'

import type { User } from '~/types'

const getUserByToken = async (apiToken: string): Promise<User> => {
  const user = await db(tables.USERS).where({ apiToken }).first()

  if (!user) {
    throw new Error(ErrorType.USER_NOT_FOUND)
  }

  return user
}

export default getUserByToken

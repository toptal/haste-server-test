import { ErrorType } from '@hastebin/data-store-helper'

import db from '~/lib/db'
import tables from '~/lib/db/tables'

import type { User } from '~/types'

const getUserByBin = async (binId: string): Promise<User> => {
  const user = await db(tables.USERS)
    .join(tables.DOCUMENTS, `${tables.DOCUMENTS}.userId`, `${tables.USERS}.id`)
    .where(`${tables.DOCUMENTS}.id`, binId)
    .distinct()
    .first()

  if (!user) {
    throw new Error(ErrorType.USER_NOT_FOUND)
  }

  return user
}

export default getUserByBin

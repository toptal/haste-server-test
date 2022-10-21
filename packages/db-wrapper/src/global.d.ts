/* eslint-disable camelcase */
import type { Knex } from 'knex'

import { User, Document } from '~/types'

declare module 'knex/types/tables' {
  interface Tables {
    users: User
    users_composite: Knex.CompositeTableType<
      User,
      Pick<User, 'name' | 'email'>,
      Partial<Omit<User, 'id'>>
    >
    documents: Document
    documents_composite: Knex.CompositeTableType<Document>
  }
}

import { StoreNames } from '@hastebin/data-store-helper'

import { Config } from '~/types/config'

export const mockConfig: Config = {
  host: '0.0.0.0',
  port: 7777,
  basePath: '',
  userAuthEnabled: false,
  emailContact: 'contact@mail.com',
  documentationUrl: 'http://localhost:3000',

  keyLength: 10,

  maxLength: 400000,

  logging: [
    {
      level: 'verbose',
      type: 'Console'
    }
  ],

  keyGenerator: {
    type: 'phonetic'
  },

  rateLimits: {
    categories: {
      normal: {
        totalRequests: 500,
        every: 60000
      }
    }
  },

  storage: {
    type: StoreNames.Postgres,
    connectionUrl: 'postgres://postgres:postgrespw@localhost:55000'
  }
}

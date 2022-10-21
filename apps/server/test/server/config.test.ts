import { StoreNames } from '@hastebin/data-store-helper'

import { isStoreName } from '../../config/config'

const defaultState = {
  host: '0.0.0.0',
  port: 7777,
  basePath: '',
  userAuthEnabled: false,
  emailContact: '',
  documentationUrl: 'http://localhost:3000/documentation',
  keyLength: 10,
  maxLength: 400000,
  logging: [{ level: 'verbose', type: 'Console', colorize: true }],
  keyGenerator: { type: 'phonetic' },
  rateLimits: {
    categories: {
      normal: {
        totalRequests: 500,
        every: 60000
      }
    }
  },
  storage: { type: 'file-data-store' }
}

describe('config', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  it('returns config with default values', () => {
    const config = require('../../config/config').config

    expect(config).toEqual(defaultState)
  })

  it('returns config with env variables', () => {
    process.env = {
      ...env,
      HOST: 'localhost.test',
      SERVER_PORT: '2000',
      NEXT_PUBLIC_BASE_PATH: '/base'
    }

    const config = require('../../config/config').config

    expect(config).toEqual({
      ...defaultState,
      host: process.env.HOST,
      port: 2000,
      basePath: process.env.NEXT_PUBLIC_BASE_PATH
    })
  })

  it('sets storage type by STORAGE_TYPE env', () => {
    process.env = { ...env, STORAGE_TYPE: 'amazon-s3-data-store' }

    const config = require('../../config/config').config

    expect(config).toEqual({
      ...defaultState,
      storage: {
        type: StoreNames.AmazonS3,
        bucket: '',
        region: ''
      }
    })
  })

  it('fallbacks to file storage if invalid storage name provided', () => {
    process.env = { ...env, STORAGE_TYPE: 'invalid' }

    const config = require('../../config/config').config

    expect(config).toEqual({
      ...defaultState,
      storage: {
        type: StoreNames.File
      }
    })
  })

  it('sets storage config from env variables', () => {
    process.env = {
      ...env,
      STORAGE_TYPE: 'amazon-s3-data-store',
      S3_BUCKET: 'bucket_name',
      S3_REGION: 's3-region-1'
    }

    const config = require('../../config/config').config

    expect(config).toEqual({
      ...defaultState,
      storage: {
        type: StoreNames.AmazonS3,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION
      }
    })
  })

  afterEach(() => {
    process.env = env
  })
})

describe('isStoreName', () => {
  it('returns true if store name given', () => {
    expect(isStoreName('amazon-s3-data-store')).toEqual(true)
  })

  it('returns false if string is not store name', () => {
    expect(isStoreName('invalid')).toEqual(false)
  })

  it('returns false if string is undefined', () => {
    expect(isStoreName(undefined)).toEqual(false)
  })
})

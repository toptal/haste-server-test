import { PassThrough } from 'stream'
import consumers from 'stream/consumers'
import promises from 'stream/promises'

import * as winston from 'winston'
import { Store, ErrorType } from '@hastebin/data-store-helper'
import { Storage, Bucket } from '@google-cloud/storage'

import type { GoogleStorageConfig } from '~/types'

class GoogleCloudStorage extends Store {
  bucket: Bucket
  storageBasePath: string

  constructor(options: GoogleStorageConfig) {
    super(options)
    const storage = new Storage()

    this.storageBasePath = options.path
    this.bucket = storage.bucket(options.bucket)
  }

  set = async (key: string, data: string): Promise<boolean> => {
    try {
      const file = this.bucket.file(this.storageBasePath + key)
      const passthroughStream = new PassThrough()

      passthroughStream.write(data)

      await promises.pipeline(passthroughStream.end(), file.createWriteStream())

      return true
    } catch (err) {
      winston.error('failed to add data', { error: err })
      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    }
  }

  get = async (key: string): Promise<string> => {
    let result: string

    try {
      const file = this.bucket.file(this.storageBasePath + key)

      const readStream = file.createReadStream()

      result = await consumers.text(readStream)
    } catch (err) {
      winston.error('failed to get data', { error: err })
      throw new Error(ErrorType.GET_DOCUMENT_ERROR)
    }

    if (!result) {
      throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
    }

    return result
  }
}

export default GoogleCloudStorage

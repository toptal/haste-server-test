import consumers from 'stream/consumers'

import * as winston from 'winston'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'
import { Store, ErrorType } from '@hastebin/data-store-helper'

import type { AmazonS3DataStoreConfig } from '~/types'

class AmazonS3DataStore extends Store {
  bucket: string
  client: S3Client

  constructor(options: AmazonS3DataStoreConfig) {
    super(options)
    this.bucket = options.bucket
    this.client = new S3Client({
      region: options.region
    })
  }

  get = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    })

    try {
      const response = await this.client.send(command)

      return consumers.text(response.Body as NodeJS.ReadableStream)
    } catch (error) {
      winston.error('error retrieving value from s3', {
        error
      })

      throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
    }
  }

  set = async (key: string, data: string): Promise<boolean> => {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data
    })

    try {
      await this.client.send(command)

      return true
    } catch (error) {
      winston.error('error setting value in s3', {
        error
      })

      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    }
  }
}
export default AmazonS3DataStore

import * as winston from 'winston'
import { ErrorType } from '@hastebin/data-store-helper'
import { MongoClient } from 'mongodb'

const connect = async (url: string): Promise<MongoClient> => {
  try {
    return await MongoClient.connect(url)
  } catch (error) {
    winston.error('error connecting to mongodb', { error: error })
    throw new Error(ErrorType.CONNECTION_ERROR)
  }
}

export default connect

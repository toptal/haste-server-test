import * as fs from 'fs'

import * as winston from 'winston'
import { Store, ErrorType, md5 } from '@hastebin/data-store-helper'

import type { FileStoreConfig } from '~/types'

class FileDocumentStore extends Store {
  basePath: string

  constructor(options: FileStoreConfig) {
    super(options)
    this.basePath = options.basePath || './data'
  }

  get = async (key: string, skipExpire?: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const filePath = `${this.basePath}/${md5(key)}`

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            reject(new Error(ErrorType.DOCUMENT_NOT_FOUND))
          } else {
            reject(new Error(ErrorType.GET_DOCUMENT_ERROR))
          }
        } else {
          resolve(data)
          if (this.expire && !skipExpire) {
            winston.warn('file store cannot set expirations on keys')
          }
        }
      })
    })
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      fs.mkdir(this.basePath, '700', err => {
        if (err && !err.message.includes('EEXIST')) {
          reject(new Error(err.message))
        }

        const filePath = `${this.basePath}/${md5(key)}`

        fs.writeFile(filePath, data, 'utf8', err => {
          if (err) {
            reject(new Error(ErrorType.ADD_DOCUMENT_ERROR))
          } else {
            resolve(true)
            if (this.expire && !skipExpire) {
              winston.warn('file store cannot set expirations on keys')
            }
          }
        })
      })
    })
  }
}

export default FileDocumentStore

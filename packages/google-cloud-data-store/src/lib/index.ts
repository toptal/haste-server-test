import * as winston from 'winston'
import { Store, ErrorType } from '@hastebin/data-store-helper'
import { Datastore, Entity, Key } from '@google-cloud/datastore'

import type { GoogleStoreConfig } from '~/types'

class GoogleDatastoreDocumentStore extends Store {
  kind: string

  datastore: Datastore

  constructor(options: GoogleStoreConfig) {
    super(options)
    this.kind = 'Haste'
    this.datastore = new Datastore()
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean
  ): Promise<boolean> => {
    try {
      const expireTime =
        skipExpire || this.expire === undefined
          ? null
          : new Date(Date.now() + this.expire * 1000)

      const taskKey = this.datastore.key([this.kind, key])
      const task = {
        key: taskKey,
        data: [
          {
            name: 'value',
            value: data,
            excludeFromIndexes: true
          },
          {
            name: 'expiration',
            value: expireTime
          }
        ]
      }

      const result = await this.datastore.insert(task)

      return !!(
        result &&
        result.length > 0 &&
        result[0].indexUpdates &&
        result[0].indexUpdates > 0
      )
    } catch (err) {
      winston.error('failed to get data', { error: err })
      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    }
  }

  get = async (key: string, skipExpire?: boolean): Promise<string> => {
    let entity: [Entity | Entity[]]
    let taskKey: Key

    try {
      taskKey = this.datastore.key([this.kind, key])

      entity = await this.datastore.get(taskKey)
    } catch (err) {
      winston.error('failed to get data', { error: err })
      throw new Error(ErrorType.GET_DOCUMENT_ERROR)
    }

    if (!entity || !entity[0]) {
      throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
    }

    if (skipExpire || entity[0]?.expiration == null) {
      return entity[0].value
    }

    if (entity[0].expiration < new Date()) {
      throw new Error(ErrorType.DATA_EXPIRED)
    }

    const task = {
      key: taskKey,
      data: [
        {
          name: 'value',
          value: entity[0]?.value,
          excludeFromIndexes: true
        },
        {
          name: 'expiration',
          value: new Date(Date.now() + (this.expire ? this.expire * 1000 : 0))
        }
      ]
    }

    this.datastore.update(task).catch(err => {
      winston.error('failed to update expiration', { error: err })
    })

    return entity[0].value
  }
}

export default GoogleDatastoreDocumentStore

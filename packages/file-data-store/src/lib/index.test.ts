import * as fs from 'fs'

import { ErrorType, StoreNames } from '~/../../data-store-helper'
import * as winston from 'winston'

import FileDocumentStore from '.'

const mockKey = 'key'

const expirationWarning = 'file store cannot set expirations on keys'

jest.mock('winston', () => ({
  warn: jest.fn()
}))

jest.mock('~/../../data-store-helper/src/utils/md5', () => ({
  md5: jest.fn()
}))

let fileStore: FileDocumentStore

jest.mock('fs', () => ({
  readFile: jest.fn((_path, _a, callback) => callback(null, 'data')),
  writeFile: jest.fn((_path, _data, _a, callback) => callback(null)),
  mkdir: jest.fn((_path, a, callback) => callback(null))
}))

describe('File Data Store', () => {
  beforeEach(() => {
    fileStore = new FileDocumentStore({ type: StoreNames.File })
  })

  it('uses defualt basePath if not given', () => {
    expect(fileStore.basePath).toEqual('./data')
  })

  it('returns data on get', async () => {
    const data = await fileStore.get(mockKey)

    expect(data).toEqual('data')
  })

  it('creates file on set', async () => {
    const file = await fileStore.set(mockKey, 'data')

    expect(file).toEqual(true)
  })

  describe('Shows warning for expiration', () => {
    beforeEach(() => {
      fileStore = new FileDocumentStore({ type: StoreNames.File, expire: 10 })
    })

    it('on get ', async () => {
      await fileStore.get(mockKey)

      expect(winston.warn).toHaveBeenCalledWith(expirationWarning)
    })

    it('on set', async () => {
      await fileStore.set(mockKey, 'data')

      expect(winston.warn).toHaveBeenCalledWith(expirationWarning)
    })
  })

  describe('Throws error', () => {
    let mkdirMock

    beforeEach(() => {
      fileStore = new FileDocumentStore({ type: StoreNames.File })
    })

    it('on invalid get path', async () => {
      const readFileMock = fs.readFile as unknown as jest.Mock

      readFileMock.mockImplementation(
        (
          _path: string,
          _a: string,
          callback: (err: any, data: Buffer) => void
        ) => callback(new Error(ErrorType.GET_DOCUMENT_ERROR), Buffer.from(''))
      )

      const result = fileStore.get('')

      await expect(result).rejects.toEqual(
        new Error(ErrorType.GET_DOCUMENT_ERROR)
      )
    })

    it('on failed directory create', async () => {
      mkdirMock = fs.mkdir as unknown as jest.Mock

      mkdirMock.mockImplementationOnce(
        (_path: string, _a: string, callback: (err: any) => void) =>
          callback(new Error(ErrorType.ADD_DOCUMENT_ERROR))
      )
      const result = fileStore.set('/', 'data')

      await expect(result).rejects.toEqual(
        new Error(ErrorType.ADD_DOCUMENT_ERROR)
      )
    })

    it('on invalid set path', async () => {
      const writeFileMock = fs.writeFile as unknown as jest.Mock

      writeFileMock.mockImplementationOnce(
        (
          _path: string,
          _data: string,
          _a: string,
          callback: (err: any) => void
        ) => callback(new Error(ErrorType.ADD_DOCUMENT_ERROR))
      )

      const result = fileStore.set('', 'data')

      await expect(result).rejects.toEqual(
        new Error(ErrorType.ADD_DOCUMENT_ERROR)
      )
    })

    it('does not throw error if directory exists', async () => {
      mkdirMock = fs.mkdir as unknown as jest.Mock

      mkdirMock.mockImplementationOnce(
        (_path: string, _a: string, callback: (err: any) => void) =>
          callback(new Error('EEXIST: file already exists'))
      )

      const result = fileStore.set(mockKey, 'data')

      await expect(result).resolves.toEqual(true)
    })
  })
})

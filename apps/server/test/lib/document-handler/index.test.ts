import { ErrorType } from '@hastebin/data-store-helper'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import winston from 'winston'

import DocumentHandler from '~/lib/document-handler'
import { Config } from '~/types/config'
import {
  InternalServerError,
  MissingInputError,
  NotFoundError
} from '~/lib/error'
import { contentType } from '~/lib/document-handler/content-type'

import { mockConfig } from '~/test/mock/config'

const spiedWinstonInfo = jest.spyOn(winston, 'info')

const storeGetMock = jest.fn()
const storeSetMock = jest.fn()
const mockNext: NextFunction = jest.fn()

const maxLength = 100
const key = 'test-key'

const requestOnMock = jest.fn()

const config: Config = mockConfig

const createKeyMock = jest.fn()

describe('Document handler', () => {
  let documentHandler: DocumentHandler
  let mockRequest: Request<{ id: string }>
  let mockResponse: Response

  const createDocumentHandler = ({
    setMock = storeSetMock,
    getMock = storeGetMock
  }) => {
    const storeMock = {
      set: setMock,
      get: getMock,
      type: 'postgres'
    }

    documentHandler = new DocumentHandler({
      maxLength,
      store: storeMock,
      config,
      keyGenerator: {
        type: 'phonetic',
        createKey: createKeyMock
      }
    })
  }

  beforeEach(() => {
    mockRequest = {
      params: {
        id: 'hello.there'
      },
      on: requestOnMock,
      headers: { 'content-type': 'application/json' },
      method: 'GET'
    } as unknown as Request<{ id: string }>

    mockResponse = {
      end: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(() => mockResponse)
    } as unknown as Response
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('get raw document', () => {
    it('calls "getDocumentInternal" with raw parameter', async () => {
      createDocumentHandler({})
      documentHandler.getDocumentInternal = jest.fn()

      await documentHandler.getRawDocument(mockRequest, mockResponse, mockNext)

      expect(documentHandler.getDocumentInternal).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        mockNext,
        true
      )
    })
  })

  describe('get document', () => {
    it('calls "getDocumentInternal" without raw parameter', async () => {
      createDocumentHandler({})
      documentHandler.getDocumentInternal = jest.fn()

      await documentHandler.getDocument(mockRequest, mockResponse, mockNext)

      expect(documentHandler.getDocumentInternal).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        mockNext
      )
    })
  })

  describe('get document internal', () => {
    const mockDocument = 'mock-document'
    let getMock: jest.Mock<unknown, unknown[]>

    beforeEach(() => {
      getMock = jest.fn().mockReturnValue(mockDocument)
      createDocumentHandler({ getMock })
    })

    it('handles raw GET request successfully', async () => {
      await documentHandler.getDocumentInternal(
        mockRequest,
        mockResponse,
        mockNext,
        true
      )

      expect(getMock).toHaveBeenCalledWith('hello', false)
      expect(spiedWinstonInfo).toHaveBeenCalledWith('retrieved raw document', {
        key: 'hello'
      })
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'content-type',
        contentType.text
      )
      expect(mockResponse.send).toHaveBeenCalledWith(mockDocument)
    })

    it('handles GET request successfully', async () => {
      await documentHandler.getDocumentInternal(
        mockRequest,
        mockResponse,
        mockNext
      )

      expect(spiedWinstonInfo).toHaveBeenCalledWith('retrieved document', {
        key: 'hello'
      })

      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockDocument,
        key: 'hello'
      })
    })

    it('handles raw HEAD request successfully', async () => {
      await documentHandler.getDocumentInternal(
        { ...mockRequest, method: 'HEAD' } as unknown as Request<{
          id: string
        }>,
        mockResponse,
        mockNext,
        true
      )

      expect(mockResponse.send).toHaveBeenCalled()
    })

    it('handles HEAD request successfully', async () => {
      await documentHandler.getDocumentInternal(
        { ...mockRequest, method: 'HEAD' } as unknown as Request<{
          id: string
        }>,
        mockResponse,
        mockNext
      )

      expect(mockResponse.json).toHaveBeenCalledWith({})
    })

    it('throws "Internal Server Error" if there is an internal error', async () => {
      const error = 'Server Error'
      const getMock = jest.fn().mockImplementation(() => {
        throw new Error(error)
      })

      createDocumentHandler({ getMock })

      await documentHandler.getDocumentInternal(
        mockRequest,
        mockResponse,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(new InternalServerError(error))
    })

    it('throws "NotFound Error" if document is not found', async () => {
      const getMock = jest.fn().mockImplementation(() => {
        throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
      })

      createDocumentHandler({ getMock })

      await documentHandler.getDocumentInternal(
        mockRequest,
        mockResponse,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        new NotFoundError('Document is not found.')
      )
    })
  })

  describe('add document', () => {
    it('returns response successfully for text input', async () => {
      mockRequest = {
        body: 'text input',
        on: requestOnMock,
        headers: { 'content-type': 'application/json' }
      } as unknown as Request<{ id: string }>

      createDocumentHandler({})

      documentHandler.getUniqueKey = jest.fn().mockResolvedValue(key)
      await documentHandler.addDocument(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.json).toHaveBeenCalledWith({ key })
    })

    it('returns response successfully for form data input', async () => {
      mockRequest = {
        body: {
          data: 'form data input'
        },
        on: requestOnMock,
        headers: { 'content-type': 'multipart/form-data' }
      } as unknown as Request<{ id: string }>

      createDocumentHandler({})

      documentHandler.getUniqueKey = jest.fn().mockResolvedValue(key)

      await documentHandler.addDocument(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.json).toHaveBeenCalledWith({ key })
    })

    it('sets document key', async () => {
      mockRequest = {
        body: 'text input',
        on: requestOnMock,
        headers: { 'content-type': 'application/json' },
        documentKey: ''
      } as unknown as Request<{ id: string }>

      createDocumentHandler({})

      documentHandler.getUniqueKey = jest.fn().mockResolvedValueOnce(key)
      await documentHandler.addDocument(mockRequest, mockResponse, mockNext)

      expect(mockRequest.documentKey).toEqual(key)
    })

    it('throws "Missing Input Error" if request input if not found', async () => {
      const setMock = jest.fn().mockImplementation(() => {
        throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
      })

      createDocumentHandler({ setMock })

      await documentHandler.addDocument(mockRequest, mockResponse, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new MissingInputError(ErrorType.EMPTY_BODY)
      )
    })

    it('throws "Internal Server Error" if there is an internal error', async () => {
      mockRequest = {
        body: 'test input',
        on: requestOnMock,
        headers: { 'content-type': 'application/json' }
      } as unknown as Request<{ id: string }>

      const setMock = jest.fn().mockImplementation(() => {
        throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
      })

      createDocumentHandler({ setMock })

      await documentHandler.addDocument(mockRequest, mockResponse, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new InternalServerError(ErrorType.ADD_DOCUMENT_ERROR)
      )
    })
  })

  describe('get unique key', () => {
    it('returns empty string if no acceptable key is generated', async () => {
      createKeyMock.mockReturnValueOnce(undefined)

      const key = await documentHandler.getUniqueKey()

      expect(key).toEqual('')
    })

    it('returns a unique key', async () => {
      const uniqueKey = 'uniqueKey'
      const keys = ['usedKey1', 'usedKey2', uniqueKey]

      createKeyMock.mockImplementation(() => keys.shift())

      storeGetMock.mockImplementation((key: string) => {
        if (key === uniqueKey) {
          throw new Error()
        } else {
          return key
        }
      })

      const key = await documentHandler.getUniqueKey()

      expect(key).toEqual(uniqueKey)
    })
  })

  describe('create key', () => {
    it('invokes key generator with correct props', () => {
      documentHandler.createKey()

      expect(documentHandler.keyGenerator.createKey).toHaveBeenCalledTimes(1)
      expect(documentHandler.keyGenerator.createKey).toHaveBeenCalledWith(
        config.keyLength
      )
    })
  })
})

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { config } from '~/config/config'
import documentRecorder from '~/middleware/document-recorder'

jest.mock('~/config/config')
jest.mock('@hastebin/db-wrapper')
const recordDocumentSpy = jest.spyOn(
  require('@hastebin/db-wrapper'),
  'recordDocument'
)

const winstonErrorSpy = jest.spyOn(require('winston'), 'error')

const requestOnMock = jest.fn()
const mockResponse: Response = {
  statusCode: StatusCodes.OK,
  end: jest.fn(),
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  sendStatus: jest.fn(() => mockResponse)
} as unknown as Response

type RequestType = Request<{ userId: string; documentKey: string }>

const userId = 'userid'
const documentKey = 'documentKey'
const ipaddress = '127.0.0.1'

describe('Document Recorder', () => {
  let mockRequest: RequestType
  const mockNext = jest.fn()

  describe('when user auth is disabled', () => {
    beforeEach(async () => {
      jest.clearAllMocks()

      config.userAuthEnabled = false

      mockRequest = {
        on: requestOnMock,
        ip: ipaddress,
        headers: {},
        userId: '',
        documentKey: ''
      } as unknown as RequestType

      await documentRecorder(mockRequest, mockResponse, mockNext)
    })

    it('does not record document', () => {
      expect(recordDocumentSpy).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('when user auth is enabled', () => {
    beforeEach(async () => {
      jest.clearAllMocks()

      config.userAuthEnabled = true

      mockRequest = {
        on: requestOnMock,
        ip: ipaddress,
        headers: {},
        userId: userId,
        documentKey: documentKey
      } as unknown as RequestType

      await documentRecorder(mockRequest, mockResponse, mockNext)
    })

    it('records the document', () => {
      expect(recordDocumentSpy).toHaveBeenCalledWith(
        documentKey,
        userId,
        ipaddress
      )
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('when an unexpected error is encountered', () => {
    beforeEach(async () => {
      jest.clearAllMocks()

      config.userAuthEnabled = true

      mockRequest = {
        on: requestOnMock,
        ip: ipaddress,
        headers: {},
        userId: userId,
        documentKey: documentKey
      } as unknown as RequestType

      recordDocumentSpy.mockRejectedValueOnce(new Error('error'))

      await documentRecorder(mockRequest, mockResponse, mockNext)
    })

    it('logs the error and continues', async () => {
      expect(winstonErrorSpy).toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })
  })
})

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { config } from '~/config/config'
import blockedOwnerChecker from '~/middleware/blocked-owner-checker'

jest.mock('~/config/config')
jest.mock('@hastebin/db-wrapper')

const getUserByBinIdSpy = jest.spyOn(
  require('@hastebin/db-wrapper'),
  'getUserByBinId'
)
const winstonErrorSpy = jest.spyOn(require('winston'), 'error')

const blockedUserMock = jest.fn(() => ({
  blocked: true
}))

const unblockedUserMock = jest.fn(() => ({
  blocked: false
}))

const requestOnMock = jest.fn()
const mockResponse: Response = {
  statusCode: StatusCodes.OK,
  end: jest.fn(),
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  sendStatus: jest.fn(() => mockResponse)
} as unknown as Response

type RequestType = Request<{ userId: string; documentKey: string }>

const documentKey = 'documentKey'

describe('Blocked User Checker', () => {
  let mockRequest: RequestType
  const mockNext = jest.fn()

  describe('when user auth is disabled', () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      config.userAuthEnabled = false

      mockRequest = {
        on: requestOnMock,
        headers: {},
        params: { id: '' }
      } as unknown as RequestType

      await blockedOwnerChecker(mockRequest, mockResponse, mockNext)
    })

    it('does not check whether or not user is blocked', () => {
      expect(getUserByBinIdSpy).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('when user auth is enabled', () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      config.userAuthEnabled = true

      mockRequest = {
        on: requestOnMock,
        headers: {},
        params: {
          id: documentKey
        }
      } as unknown as RequestType
    })

    describe('and user is blocked', () => {
      beforeEach(async () => {
        getUserByBinIdSpy.mockImplementationOnce(blockedUserMock)
        await blockedOwnerChecker(mockRequest, mockResponse, mockNext)
      })

      it('responds with forbidden', () => {
        expect(getUserByBinIdSpy).toHaveBeenCalledWith(documentKey)
        expect(mockNext).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      })
    })

    describe('and user is not blocked', () => {
      beforeEach(async () => {
        getUserByBinIdSpy.mockImplementationOnce(unblockedUserMock)
        await blockedOwnerChecker(mockRequest, mockResponse, mockNext)
      })

      it('continues', () => {
        expect(getUserByBinIdSpy).toHaveBeenCalledWith(documentKey)
        expect(mockNext).toHaveBeenCalled()
      })
    })
  })

  describe('when an unexpected error is encountered', () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      config.userAuthEnabled = true

      mockRequest = {
        on: requestOnMock,
        headers: {},
        params: {
          id: documentKey
        }
      } as unknown as RequestType

      getUserByBinIdSpy.mockRejectedValueOnce(new Error('error'))

      await blockedOwnerChecker(mockRequest, mockResponse, mockNext)
    })

    it('responds with internal server error', async () => {
      expect(winstonErrorSpy).toHaveBeenCalled()
      expect(mockNext).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    })
  })
})

import { ErrorType } from '@hastebin/data-store-helper'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import tokenValidator from '~/middleware/token-validator'

jest.mock('@hastebin/db-wrapper')
const userId = 'thisisauserid'
const mockUser = { id: userId, blocked: false }
const mockBlockedUser = { id: userId, blocked: true }
const getUserSpy = jest.spyOn(require('@hastebin/db-wrapper'), 'getUserByToken')

const requestOnMock = jest.fn()
const mockResponse: Response = {
  end: jest.fn(),
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  sendStatus: jest.fn(() => mockResponse)
} as unknown as Response

describe('Token Validator', () => {
  let mockRequest: Request<{ userId: string }>
  const mockNext = jest.fn()

  describe('when token is not present', () => {
    beforeEach(async () => {
      mockRequest = {
        on: requestOnMock,
        headers: {},
        userId: ''
      } as unknown as Request<{ userId: string }>

      await tokenValidator(mockRequest, mockResponse, mockNext)
    })

    it('returns 401 error', () => {
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('does not hit the database', () => {
      expect(getUserSpy).not.toHaveBeenCalled()
    })
  })

  describe('when token is present', () => {
    describe('and user is not blocked', () => {
      beforeEach(async () => {
        mockRequest = {
          on: requestOnMock,
          headers: { authorization: 'Bearer validtoken' },
          userId: ''
        } as unknown as Request<{ userId: string }>

        getUserSpy.mockReturnValueOnce(Promise.resolve(mockUser))

        await tokenValidator(mockRequest, mockResponse, mockNext)
      })

      it('assigns user id to request', () => {
        expect(mockRequest.userId).toEqual(userId)
        expect(mockNext).toHaveBeenCalled()
      })

      it('hits the database', () => {
        expect(getUserSpy).toHaveBeenCalledWith('validtoken')
      })

      it('proceeds with request', () => {
        expect(mockNext).toHaveBeenCalled()
      })
    })

    describe('and user is blocked', () => {
      beforeEach(async () => {
        mockRequest = {
          on: requestOnMock,
          headers: { authorization: 'Bearer invalidtoken' },
          userId: ''
        } as unknown as Request<{ userId: string }>

        getUserSpy.mockReturnValueOnce(Promise.resolve(mockBlockedUser))

        await tokenValidator(mockRequest, mockResponse, mockNext)
      })

      it('hits the database', () => {
        expect(getUserSpy).toHaveBeenCalledWith('invalidtoken')
      })

      it('does not assign user id to request', () => {
        expect(mockRequest.userId).toEqual('')
      })

      it('responds with unauthorized status', () => {
        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      })
    })

    describe('and user is not found', () => {
      beforeEach(async () => {
        mockRequest = {
          on: requestOnMock,
          headers: { authorization: 'Bearer invalidtoken' },
          userId: ''
        } as unknown as Request<{ userId: string }>

        getUserSpy.mockRejectedValueOnce(new Error(ErrorType.USER_NOT_FOUND))

        await tokenValidator(mockRequest, mockResponse, mockNext)
      })

      it('hits the database', () => {
        expect(getUserSpy).toHaveBeenCalledWith('invalidtoken')
      })

      it('does not assign user id to request', () => {
        expect(mockRequest.userId).toEqual('')
      })

      it('responds with unauthorized status', () => {
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(
          StatusCodes.UNAUTHORIZED
        )
      })
    })
  })

  describe('when an unexpected error is encountered', () => {
    beforeEach(async () => {
      mockRequest = {
        on: requestOnMock,
        headers: { authorization: 'Bearer invalidtoken' },
        userId: ''
      } as unknown as Request<{ userId: string }>

      getUserSpy.mockRejectedValueOnce(new Error('Unexpected error'))
      await tokenValidator(mockRequest, mockResponse, mockNext)
    })

    it('does not assign user id to request', () => {
      expect(mockRequest.userId).toEqual('')
    })

    it('responds with internal server error status', () => {
      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    })
  })
})

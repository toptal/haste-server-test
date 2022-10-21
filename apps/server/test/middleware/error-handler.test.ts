import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { MissingInputError, NotFoundError } from '~/lib/error'

import errorHandler from '~/middleware/error-handler'

describe('Error Handler', () => {
  const mockNext = jest.fn()
  let mockRequest: Request
  let mockResponse: Response

  beforeEach(async () => {
    mockRequest = {
      method: ''
    } as Request

    mockResponse = {
      end: jest.fn(),
      json: jest.fn(),
      status: jest.fn(() => mockResponse)
    } as unknown as Response
  })

  it('returns "Internal Server Error" status code when error is string', async () => {
    const error = 'error'

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    )
    expect(mockResponse.json).toHaveBeenCalledWith({ message: error })
  })

  it('returns response with status code and message of error', async () => {
    const error = new MissingInputError('error')

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'error' })
  })

  it('returns status code with NotFoundError', async () => {
    const error = new NotFoundError('error')

    mockRequest.method = 'HEAD'
    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(mockResponse.end).toHaveBeenCalled()
  })

  it('returns status code with "Request too long" error', async () => {
    const error = new Error('request entity too large')

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(
      StatusCodes.REQUEST_TOO_LONG
    )

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Request Entity Too Large'
    })
  })

  it('returns "Internal Server Error" status code', async () => {
    const error = new Error('error')

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    )
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'error' })
  })
})

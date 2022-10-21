import winston from 'winston'

import { server } from '~/server/server'
import { startServer } from '~/server/start-server'

const spiedErrorLog = jest.spyOn(winston, 'error')

jest.mock('~/server/server')

const mockServer = server as jest.MockedFunction<typeof server>

describe('Start server', () => {
  it('starts the server', () => {
    startServer()

    expect(mockServer).toHaveBeenCalledTimes(1)
  })

  it('logs an error if server throws', async () => {
    const errorMessage = 'error-message'

    mockServer.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    startServer()

    expect(spiedErrorLog).toHaveBeenCalledWith(
      `server couldn't start as an error occurred: ${errorMessage}`
    )
  })
})

import winston from 'winston'

import addLogging from '~/lib/helpers/log'
import { Config } from '~/types/config'

import { config } from '../../../config/config'

jest.mock('winston', () => ({
  __esModule: true,
  default: {
    remove: jest.fn(),
    add: jest.fn(),
    transports: {
      transportA: 'a',
      transportB: 'b',
      Console: 'console'
    }
  }
}))

const spiedRemove = jest.spyOn(winston, 'remove')
const spiedAdd = jest.spyOn(winston, 'add')

describe('Add logging', () => {
  it('quits if logging is disabled', () => {
    const result = addLogging({ logging: undefined } as unknown as Config)

    expect(result).toEqual(false)
  })

  it('removes console transport', () => {
    addLogging(config)

    expect(spiedRemove).toHaveBeenCalledWith('console')
  })

  it('adds configured logging types', () => {
    jest.clearAllMocks()

    const logging1 = { type: 'transportA' }
    const logging2 = { type: 'transportB' }

    addLogging({
      logging: [logging1, logging2]
    } as unknown as Config)

    expect(spiedAdd).toHaveBeenCalledTimes(2)
    expect(spiedAdd).toHaveBeenNthCalledWith(1, 'a', logging1)
    expect(spiedAdd).toHaveBeenNthCalledWith(2, 'b', logging2)
  })
})

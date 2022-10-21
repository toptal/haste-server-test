import winston from 'winston'

import type { Config } from '~/types/config'
import { Logging, LoggingType } from '~/types/log'

const addLogging = (config: Config): boolean => {
  if (!config.logging) {
    return false
  }

  try {
    winston.remove(winston.transports.Console)
  } catch (e) {
    /* was not present */
  }

  let detail: Logging
  let type: LoggingType

  for (let i = 0; i < config.logging.length; i += 1) {
    detail = config.logging[i]
    type = detail.type
    const transport = winston.transports[type]

    winston.add(transport, detail)
  }

  return true
}

export default addLogging

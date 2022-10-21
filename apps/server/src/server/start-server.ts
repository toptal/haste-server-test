import winston from 'winston'

import { server } from './server'

export const startServer = (): void => {
  try {
    server()
  } catch (error) {
    let errorMessage = "server couldn't start as an error occurred"

    if (error instanceof Error) {
      errorMessage += `: ${error.message}`
    }

    winston.error(errorMessage)
  }
}

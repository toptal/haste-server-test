import { Pool, PoolClient } from 'pg'
import * as winston from 'winston'

let pool: Pool

const createPool = (connectionString: string): void => {
  pool = new Pool({
    connectionString,
    idleTimeoutMillis: 30000
  })
}

const connect = async (): Promise<PoolClient | undefined> => {
  try {
    return await pool.connect()
  } catch (error) {
    winston.error('error connecting to postgres', { error })

    return undefined
  }
}

export default {
  connect,
  createPool
}

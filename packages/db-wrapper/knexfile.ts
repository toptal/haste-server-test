import type { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config()

type Options = { pool?: { min: number; max: number } }
type Config = {
  environment: string
  connection: string | undefined
  options: Options
}
type EnvironmentConfig = [string, string | undefined, Options]

const getConfig = ({
  environment,
  connection,
  options = {}
}: Config): Knex.Config => ({
  client: 'pg',
  connection,
  debug: environment === 'development',
  ...options
})

const environmentConfigs: EnvironmentConfig[] = [
  [
    'test',
    process.env.TEST_DATABASE_URL,
    {
      pool: { min: 1, max: 1 }
    }
  ],
  ['development', process.env.DATABASE_URL, {}],
  [
    'production',
    process.env.DATABASE_URL,
    {
      pool: { min: 0, max: 10 }
    }
  ]
]

const config: { [key: string]: Knex.Config } = environmentConfigs.reduce(
  (
    result: { [key: string]: Knex.Config },
    [environment, connection, options = {}]
  ) => {
    result[environment] = getConfig({ environment, connection, options })

    return result
  },
  {}
)

export default config

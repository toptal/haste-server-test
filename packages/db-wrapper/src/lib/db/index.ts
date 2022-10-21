import knex from 'knex'

import * as config from '~/../knexfile'

const environment = process.env.NODE_ENV || 'development'

export default knex(config.default[environment])

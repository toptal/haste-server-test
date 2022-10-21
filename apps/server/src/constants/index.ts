import { config } from '../../config/config'

const DEFAULT_KEY_LENGTH = 10
const BASE_API_URL = 'http://localhost:7777'
const KEYSPACE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const VOWELS = 'aeiou'
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'

const responseMessages = {
  binOwnerBlocked: (): string =>
    'The author of this bin was blocked and all bins created by them were removed for not following the terms and conditions of this website.',
  userBlocked: (email: string): string =>
    `Your account is blocked and you are not allowed to create bins. If you have any questions, please contact ${email}`,
  unauthorizedRequest: (): string =>
    `Unauthorized request: missing access token. To generate a token, go to ${config.documentationUrl} and follow the instructions.`
}

export {
  DEFAULT_KEY_LENGTH,
  BASE_API_URL,
  KEYSPACE,
  VOWELS,
  CONSONANTS,
  responseMessages
}

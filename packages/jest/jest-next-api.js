module.exports = {
  ...require('./jest-common'),
  displayName: 'api',
  globals: {},
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.(t|j)(s|sx)?$': ['@swc/jest']
  },
  moduleNameMapper: {
    '~/(.*)': ['<rootDir>/$1']
  },
  rootDir: '../',
  testRegex: '\\.api.test\\.(js|jsx|ts|tsx)$',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-api.html',
        publicPath: './reports'
      }
    ]
  ]
}

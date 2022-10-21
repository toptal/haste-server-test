module.exports = {
  ...require('./jest-common'),
  globals: {
    BASE_API_URL: 'http://localhost:7777'
  },
  moduleNameMapper: {
    '^~/lib/(.*)': '<rootDir>/src/lib/$1',
    '^~/middleware/(.*)': '<rootDir>/src/middleware/$1',
    '^~/types/(.*)': '<rootDir>/src/types/$1',
    '^~/constants/(.*)': '<rootDir>/src/constants/$1',
    '^~/test/(.*)': '<rootDir>/test/$1'
  },
  testPathIgnorePatterns: [],
  testRegex: '\\.api.test\\.(ts|tsx)$',
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

module.exports = {
  ...require('./jest-common'),
  testEnvironment: 'node',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^~/config/(.*)': '<rootDir>/config/$1',
    '^~/constants/(.*)': '<rootDir>/src/constants/$1',
    '^~/test/(.*)': '<rootDir>/test/$1',
    '^~/routes/(.*)': '<rootDir>/src/routes/$1',
    '^~/server/(.*)': '<rootDir>/src/server/$1',
    '^~/lib/(.*)': '<rootDir>/src/lib/$1',
    '^~/middleware/(.*)': '<rootDir>/src/middleware/$1',
    '^~/types/(.*)': '<rootDir>/src/types/$1'
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '\\.api.test.(ts|tsx)$',
    '\\.e2e.test.(ts|tsx)$'
  ],
  coverageDirectory: '../../test-coverage/unit',
  collectCoverageFrom: ['src/**/*.ts', '!src/constants/*.ts', '!src/types/*.ts']
}

module.exports = {
  ...require('./jest-common'),
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/test/mock/svg-mock.tsx',
    'pages/(.*)': ['<rootDir>/pages/$1'],
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '~/(.*)': ['<rootDir>/$1'],
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-hastebin-app.html',
        publicPath: '../../reports',
      },
    ],
  ],
  coverageDirectory: '../../test-coverage/unit',
  collectCoverageFrom: [
    'components/**/*.(ts|tsx)',
    'lib/**/*.(ts|tsx)',
    'pages/**/*.(ts|tsx)',
    '!lib/constants/*.(ts|tsx)'
  ],
}

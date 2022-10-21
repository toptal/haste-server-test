module.exports = {
  ...require('jest-config/jest-api.js'),
  displayName: 'api',
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/config/expect-schema.js']
}

module.exports = {
  ...require('jest-config/jest-next-api.js'),
  displayName: 'api',
  rootDir: '../',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-hastebin-app.html',
        publicPath: '../../reports'
      }
    ]
  ]
}

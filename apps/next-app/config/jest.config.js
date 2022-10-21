module.exports = {
  ...require('jest-config/jest-next'),
  displayName: 'app:unit',
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

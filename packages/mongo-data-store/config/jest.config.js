module.exports = {
  ...require('jest-config/jest-node.js'),
  displayName: 'mongo-data-store:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['src'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-mongo-data-store.html',
        publicPath: '../../reports'
      }
    ]
  ]
}

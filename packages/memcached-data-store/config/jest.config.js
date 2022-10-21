/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...require('jest-config/jest-node.js'),
  displayName: 'memcached-data-store:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['src'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-memcached-data-store.html',
        publicPath: '../../reports'
      }
    ]
  ]
}

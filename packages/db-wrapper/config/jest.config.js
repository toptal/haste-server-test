/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...require('jest-config/jest-node.js'),
  displayName: 'db-wrapper:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['src'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-db-wrapper.html',
        publicPath: '../../reports'
      }
    ]
  ]
}

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...require('jest-config/jest-node.js'),
  displayName: 'file-data-store:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['src'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-file-data-store.html',
        publicPath: '../../reports'
      }
    ]
  ]
}

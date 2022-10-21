const config = require('jest-config/jest-node.js')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...config,
  displayName: 'server:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['test', 'src'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'jest-report-unit-hastebin-server.html',
        publicPath: '../../reports'
      }
    ]
  ],
  collectCoverageFrom: [...config.collectCoverageFrom, '!src/server/index.ts', '!src/lib/document-handler/content-type.ts']
}

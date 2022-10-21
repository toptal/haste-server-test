/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...require('jest-config/jest-node.js'),
  displayName: 'google-cloud-storage:unit',
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['src'],
  coverageDirectory: 'test-coverage/unit'
}

module.exports = {
  transform: {
    '^.+\\.(t|j)(s|sx)?$': ['@swc/jest']
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '\\.e2e.test.(ts|tsx)$',
    '\\.api.test.(ts|tsx)$'
  ],
  transformIgnorePatterns: [`/node_modules/(?!@toptal)`]
}

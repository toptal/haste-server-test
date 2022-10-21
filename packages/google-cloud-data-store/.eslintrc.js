module.exports = {
  ...require('eslint-config/eslint-node.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json'
  }
}

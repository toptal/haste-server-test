module.exports = {
  ...require('eslint-config/eslint-node.js'),
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json'
  }
}

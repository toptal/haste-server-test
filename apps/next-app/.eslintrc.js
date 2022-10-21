module.exports = {
  ...require('eslint-config/eslint-next.js'),
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json'
  }
}

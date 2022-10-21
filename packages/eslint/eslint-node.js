module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'standard',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  globals: {
    BASE_URL: 'readonly'
  },
  plugins: ['@typescript-eslint', 'prettier', 'standard', 'import', 'jest'],
  settings: {
    'import/resolver': {
      alias: [['~', './']],
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/']
      },
      typescript: {
        alwaysTryTypes: true,
        project: '.'
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    }
  },
  rules: {
    'node/no-callback-literal': 'off', //TODO: remove this after callback improvement
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'arrow-parens': ['error', 'as-needed'],
    'space-in-parens': ['error', 'never'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'unknown',
          'parent',
          'sibling',
          'index'
        ],
        pathGroups: [
          {
            pattern: '~/{lib,types,constants}/**',
            group: 'unknown',
            position: 'after'
          }
        ]
      }
    ],
    'import/no-cycle': 'error',
    'import/first': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/newline-after-import': 'error',
    'space-before-blocks': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'no-template-curly-in-string': 'off',
    'standard/no-callback-literal': 'off',
    'no-prototype-builtins': 'off',
    'import/no-webpack-loader-syntax': 'off',
    curly: ['error', 'all'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['const', 'let']
      },
      {
        blankLine: 'always',
        prev: 'multiline-expression',
        next: 'multiline-expression'
      }
    ],
    '@typescript-eslint/no-var-requires': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/lowercase-name': [
      'error',
      {
        ignore: ['describe']
      }
    ]
  },
  ignorePatterns: [
    'node_modules',
    'public',
    'styles',
    '.next',
    '.nyc_output',
    'coverage',
    'dist',
    '.turbo',
    'happo-tmp',
    'test-coverage',
    'reports',
    'static'
  ]
}

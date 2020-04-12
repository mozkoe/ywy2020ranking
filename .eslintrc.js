module.exports = {
  'globals': {
    'document': false,
    'navigator': false,
    'window': false,
  },

  'extends': [
    './lintRules/eslint.js',
  ],

  'env': {
    'es6': true,
    'node': true,
    'browser': true,
  },

  'settings': {
    'import/resolver': {
      'typescript': {},
    },
  },

  'overrides': [{
    'files': [
      '*.ts',
      '*.tsx',
    ],

    'parser': '@typescript-eslint/parser',
    'parserOptions': {
      'project': 'tsconfig.json',
      'createDefaultProgram': true,
    },

    'plugins': [
      '@typescript-eslint',
    ],

    'rules': {
      '@typescript-eslint/no-unused-vars-experimental': ['error', {
        'ignoredNamesRegex': '^h$',
      }],
      '@typescript-eslint/no-unused-vars': ['off', {
        'varsIgnorePattern': '^h$',
      }],

      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  }],
}

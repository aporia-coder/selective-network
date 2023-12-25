module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript',
    'next',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
  ],
  ignorePatterns: ['.eslintrc.js'],
  env: {
    jest: true,
  },
  rules: {
    // Make prettier code formatting suggestions more verbose.
    'prettier/prettier': ['warn'],
    // Disable <Fragment> => <> replacement. Feel free to change
    'react/jsx-fragments': 'off',
    // Disable prefer default export
    'import/prefer-default-export': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    'react/jsx-filename-extension': [0],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        ecmaVersion: 12,
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
}

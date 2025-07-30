import eslintConfigLove from 'eslint-config-love'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/', 'node_modules/', '**/*.d.ts'],
  },
  eslintConfigLove,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: typescriptEslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
]

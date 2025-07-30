import eslintConfigLove from 'eslint-config-love'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import vueEslintParser from 'vue-eslint-parser'

import eslintPluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/', 'node_modules/', '**/*.d.ts'],
  },
  eslintConfigLove,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parser: vueEslintParser,
      parserOptions: {
        parser: typescriptEslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
  {
    rules: {
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      // You might also consider turning off other Vue formatting rules if they cause issues:
      // 'vue/html-indent': 'off',
      // 'vue/html-self-closing': 'off',
      // 'vue/html-closing-bracket-newline': 'off',
      // 'vue/html-closing-bracket-spacing': 'off',
      // 'vue/html-end-tags': 'off',
      // 'vue/html-quotes': 'off',
      // 'vue/html-semicolon-newline': 'off',
      // 'vue/html-table-comma': 'off',
      // 'vue/mustache-interpolation-spacing': 'off',
    },
  },
]

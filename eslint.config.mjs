// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,astro}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },

  // Base configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,

  // Custom rules and overrides
  {
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General JavaScript rules
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error', // Changed to 'error' for Google Ads compliance

      // Import rules
      'no-unused-imports': 'off', // Will be handled by unused vars

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'build/**',
      '*.min.js',
      '*.config.js',
      '.netlify/**',
      'coverage/**',
    ],
  },

  // Astro-specific overrides
  {
    files: ['**/*.astro'],
    rules: {
      // Allow any type in Astro files for props (common pattern)
      '@typescript-eslint/no-explicit-any': 'off',
      // Enforce no console statements in Astro files for Google Ads compliance
      'no-console': 'error',
      // Disable Prettier for script content in Astro files (parsing issues)
      'prettier/prettier': 'off',
      // Allow unused variables in script tags (often false positives)
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // Specific override for env.d.ts (standard Astro pattern)
  {
    files: ['**/env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Script files overrides
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    rules: {
      // Scripts may use console for logging
      'no-console': 'off',
      // Scripts may have unused vars for development
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

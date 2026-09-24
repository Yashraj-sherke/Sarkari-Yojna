import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  { ignores: ['dist/**', '.vinext/**', '.wrangler/**', 'vendor/**', '.sites-runtime/**', 'scratch/**', 'scripts/**', '**/*.cjs', '**/*.mjs', 'vite.config.ts'] },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off'
    }
  },
];
export default eslintConfig;

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/graphql/generated/**', 'src/components/ui']),
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'react-hooks/exhaustive-deps': 'off',
		},
	},
]);

export default eslintConfig;

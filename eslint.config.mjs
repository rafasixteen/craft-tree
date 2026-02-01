import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	betterTailwindcss.configs.recommended,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/graphql/generated/**', 'src/components/ui']),
	{
		settings: {
			'better-tailwindcss': {
				entryPoint: 'src/app/globals.css',
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
			'better-tailwindcss/no-unknown-classes': 'off',
		},
	},
]);

export default eslintConfig;

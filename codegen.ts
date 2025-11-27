import { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const config: CodegenConfig = {
	schema: path.join(process.cwd(), 'src', 'graphql', 'typeDefs', '**', '*.graphql').replace(/\\/g, '/'),
	documents: 'src/**/*.{ts,tsx,js,jsx,graphql}',
	generates: {
		'./src/graphql/generated/graphql.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
		},
	},
	ignoreNoDocuments: true,
};

export default config;

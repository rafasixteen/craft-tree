import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'src/graphql/schema/**/*.{gql,graphql}',
	generates: {
		'src/graphql/generated/types.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
			config: {
				contextType: '../context#GraphQLContext',
			},
		},
	},
};

export default config;

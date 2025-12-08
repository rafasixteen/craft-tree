import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'src/graphql/typeDefs/**/*.{graphql,gql}',
	documents: 'src/**/*.{ts,tsx,js,jsx,graphql}',
	generates: {
		'./generated/graphql/types.ts': {
			plugins: ['typescript', 'typescript-resolvers'],
			config: {
				mappers: {
					Item: '@prisma/client#Item as PrismaItem',
					Recipe: '@prisma/client#Recipe as PrismaRecipe',
					Ingredient: '@prisma/client#Ingredient as PrismaIngredient',
				},
				contextType: '@/graphql/context#GraphQLContext',
				enumValues: {
					NodeType: '@prisma/client#NodeType',
				},
			},
		},
	},
	ignoreNoDocuments: true,
};

export default config;

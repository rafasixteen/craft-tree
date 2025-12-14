import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: './src/graphql/types/*{.gql,.graphql}',
	documents: ['src/graphql/types/*{.gql,.graphql}'],
	generates: {
		'./generated/graphql/types.ts': {
			documents: 'src/graphql/types/*{.gql,.graphql}',
			plugins: ['typescript', 'typescript-resolvers'],
			config: {
				mappers: {
					Item: '@prisma/client#Item as PrismaItem',
					Recipe: '@prisma/client#Recipe as PrismaRecipe',
					Ingredient: '@prisma/client#Ingredient as PrismaIngredient',
					Node: '@prisma/client#Node as PrismaNode',
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

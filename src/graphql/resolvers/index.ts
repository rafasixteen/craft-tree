import { itemResolvers } from './item';
import { recipeResolvers } from './recipe';
import { nodeResolvers } from './node';

export const resolvers = {
	Query: {
		...itemResolvers.Query,
		...recipeResolvers.Query,
		...nodeResolvers.Query,
	},
	Mutation: {
		...itemResolvers.Mutation,
		...recipeResolvers.Mutation,
		...nodeResolvers.Mutation,
	},
	Item: {
		...itemResolvers.Item,
	},
	Recipe: {
		...recipeResolvers.Recipe,
	},
	Node: {
		...nodeResolvers.Node,
	},
};

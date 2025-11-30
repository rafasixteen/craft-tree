import { itemResolvers } from './item';
import { recipeResolvers } from './recipe';

export const resolvers = {
	Query: {
		...itemResolvers.Query,
		...recipeResolvers.Query,
	},
	Mutation: {
		...itemResolvers.Mutation,
		...recipeResolvers.Mutation,
	},
	Item: {
		...itemResolvers.Item,
	},
	Recipe: {
		...recipeResolvers.Recipe,
	},
};

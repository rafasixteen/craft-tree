import { itemResolvers } from './item';
import { recipeResolvers } from './recipe';
import { craftingTreeResolvers } from './crafting-tree';

export const resolvers = {
	Query: {
		...itemResolvers.Query,
		...recipeResolvers.Query,
		...craftingTreeResolvers.Query,
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

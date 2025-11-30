import { itemResolvers } from './item';
import { recipeResolvers } from './recipe';
import { billOfMaterialsResolvers } from './bill-of-materials';

export const resolvers = {
	Query: {
		...itemResolvers.Query,
		...recipeResolvers.Query,
		...billOfMaterialsResolvers.Query,
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

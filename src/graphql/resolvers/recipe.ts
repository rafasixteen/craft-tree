import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { createRecipe, deleteRecipe, getRecipeById, getRecipeBySlug, updateRecipe } from '@domain/recipe';

export const recipeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		recipeById: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return getRecipeById(id);
		},
		recipeBySlug: async (_parent, args, ctx) =>
		{
			const { slug } = args;
			return getRecipeBySlug(slug);
		},
	},
	Mutation: {
		createRecipe: async (_parent, args, ctx) =>
		{
			return createRecipe(args.data);
		},
		updateRecipe: async (_parent, args, ctx) =>
		{
			const { id, data } = args;

			return updateRecipe(id, {
				name: data.name!,
				quantity: data.quantity!,
				time: data.time!,
				ingredients: data.ingredients!,
			});
		},
		deleteRecipe: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return deleteRecipe(id);
		},
	},
	Recipe: {
		ingredients: async (recipe, _args, ctx) =>
		{
			return getRecipeById(recipe.id).then((r) => r?.ingredients || []);
		},
	},
};

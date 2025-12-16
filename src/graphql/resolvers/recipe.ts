import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';
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
};

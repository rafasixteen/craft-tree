import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';

export const recipeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		recipeById: async (_parent, args, ctx) =>
		{
			return ctx.prisma.recipe.findUnique({
				where: {
					id: args.id,
				},
			});
		},
		recipeBySlug: async (_parent, args, ctx) =>
		{
			return ctx.prisma.recipe.findUnique({
				where: {
					slug: args.slug,
				},
			});
		},
	},
	Mutation: {
		createRecipe: async (_parent, args, ctx) =>
		{
			const { name, itemId, quantity, time } = args.data;

			const parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.recipe.create({
				data: {
					name: parsedName,
					item: { connect: { id: itemId } },
					quantity,
					time,
				},
			});
		},
		updateRecipe: async (_parent, args, ctx) =>
		{
			const { id, data } = args;
			const { name, quantity, time, ingredients } = data;

			const parsedName = name ? await nameSchema.parseAsync(name) : undefined;

			let ingredientsToConnect;

			if (ingredients)
			{
				ingredientsToConnect = await Promise.all(
					ingredients.map(async (ing) =>
					{
						return ctx.prisma.ingredient.upsert({
							where: {
								itemId_quantity: {
									itemId: ing.itemId,
									quantity: ing.quantity,
								},
							},
							update: {},
							create: {
								itemId: ing.itemId,
								quantity: ing.quantity,
							},
						});
					}),
				);
			}

			return ctx.prisma.recipe.update({
				where: {
					id,
				},
				data: {
					name: parsedName ?? undefined,
					quantity: quantity ?? undefined,
					time: time ?? undefined,
					ingredients: ingredientsToConnect ? { set: ingredientsToConnect.map((ingredient) => ({ id: ingredient.id })) } : undefined,
				},
			});
		},
		deleteRecipe: async (_parent, args, ctx) =>
		{
			return ctx.prisma.recipe.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};

import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';

export const recipeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		recipes: async (_parent, _args, ctx) =>
		{
			return ctx.prisma.recipe.findMany();
		},
		recipe: async (_parent, args, ctx) =>
		{
			return ctx.prisma.recipe.findUnique({
				where: {
					id: args.id,
				},
			});
		},
	},
	Mutation: {
		createRecipe: async (_parent, args, ctx) =>
		{
			const { itemId, quantity, time } = args.data;

			return ctx.prisma.recipe.create({
				data: {
					item: { connect: { id: itemId } },
					quantity,
					time,
				},
				include: {
					item: true,
				},
			});
		},
		updateRecipe: async (_parent, args, ctx) =>
		{
			const { id, data } = args;
			const { quantity, time, ingredients } = data;

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
					quantity: quantity ?? undefined,
					time: time ?? undefined,
					ingredients: ingredientsToConnect ? { set: ingredientsToConnect.map((ingredient) => ({ id: ingredient.id })) } : undefined,
				},
				include: {
					item: true,
					ingredients: { include: { item: true } },
				},
			});
		},
		deleteRecipe: async (_parent, args, ctx) =>
		{
			return ctx.prisma.recipe.delete({
				where: {
					id: args.id,
				},
				include: {
					item: true,
					ingredients: { include: { item: true } },
				},
			});
		},
	},
};

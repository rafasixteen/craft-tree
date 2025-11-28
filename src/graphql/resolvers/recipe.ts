import { Resolvers } from '@/graphql/generated/graphql';
import { GraphQLContext } from '../context';

export const recipeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		recipes: async (_parent, _args, ctx) => {
			return ctx.prisma.recipe.findMany();
		},
		recipeById: async (_parent, args, ctx) => {
			return ctx.prisma.recipe.findUnique({ where: { id: args.id } });
		},
	},
	Mutation: {
		createRecipe: async (_parent, args, ctx) => {
			const { itemId, quantity, time, ingredients } = args.data;
			return ctx.prisma.recipe.create({
				data: {
					itemId,
					quantity,
					time,
					ingredients: {
						create: ingredients.map((ing) => ({
							itemId: ing.itemId,
							quantity: ing.quantity,
						})),
					},
				},
			});
		},
		updateRecipe: async (_parent, args, ctx) => {
			const { id, quantity, time, ingredients } = args.data;
			
			const data: any = {};
			if (quantity !== undefined && quantity !== null) data.quantity = quantity;
			if (time !== undefined && time !== null) data.time = time;
			
			if (ingredients) {
				return ctx.prisma.$transaction(async (prisma) => {
					await prisma.ingredient.deleteMany({ where: { recipeId: id } });
					return prisma.recipe.update({
						where: { id },
						data: {
							...data,
							ingredients: {
								create: ingredients.map((ing) => ({
									itemId: ing.itemId,
									quantity: ing.quantity,
								})),
							},
						},
					});
				});
			}

			return ctx.prisma.recipe.update({
				where: { id },
				data,
			});
		},
		deleteRecipe: async (_parent, args, ctx) => {
			return ctx.prisma.recipe.delete({ where: { id: args.id } });
		},
	},
	Recipe: {
		item: async (parent, _args, ctx) => {
			if ((parent as any).item) return (parent as any).item;
			return ctx.prisma.item.findUniqueOrThrow({ where: { id: parent.itemId } });
		},
		ingredients: async (parent, _args, ctx) => {
			if ((parent as any).ingredients) return (parent as any).ingredients;
			return ctx.prisma.ingredient.findMany({ where: { recipeId: parent.id } });
		},
	},
	Ingredient: {
		item: async (parent, _args, ctx) => {
			if ((parent as any).item) return (parent as any).item;
			return ctx.prisma.item.findUniqueOrThrow({ where: { id: parent.itemId } });
		},
		recipe: async (parent, _args, ctx) => {
			if ((parent as any).recipe) return (parent as any).recipe;
			return ctx.prisma.recipe.findUniqueOrThrow({ where: { id: parent.recipeId } });
		},
	},
};

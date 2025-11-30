import { Resolvers } from '@/graphql/generated/graphql';
import { GraphQLContext } from '../context';

export const billOfMaterialsResolvers: Resolvers<GraphQLContext> = {
	Query: {
		billOfMaterials: async (_parent, args, ctx) =>
		{
			const { itemId } = args;

			// Fetch recipes for the item
			const recipes = await ctx.prisma.recipe.findMany({
				where: { itemId },
				include: { ingredients: { include: { item: true } } },
			});

			// Flatten ingredients from all recipes
			const bomMap = new Map<string, { item: (typeof recipes)[0]['item']; quantity: number }>();

			for (const recipe of recipes)
			{
				for (const ing of recipe.ingredients)
				{
					const existing = bomMap.get(ing.itemId);
					if (existing)
					{
						existing.quantity += ing.quantity;
					}
					else
					{
						bomMap.set(ing.itemId, { item: ing.item, quantity: ing.quantity });
					}
				}
			}

			// Return as array
			return Array.from(bomMap.values()).map((v) => ({
				item: v.item,
				quantity: v.quantity,
			}));
		},
	},
};

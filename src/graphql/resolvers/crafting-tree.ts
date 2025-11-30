import { Resolvers } from '@/graphql/generated/graphql';
import { GraphQLContext } from '../context';
import { Item } from '@prisma/client';

interface CraftingRecipeNode
{
	id: string;
	quantity: number;
	time: number;
	ingredients: CraftingTreeNode[];
}

interface CraftingTreeNode
{
	item: Item;
	recipes: CraftingRecipeNode[];
}

export const productionResolvers: Resolvers<GraphQLContext> = {
	Query: {
		craftingTree: async (_parent, args: { itemId: string }, ctx: GraphQLContext): Promise<CraftingTreeNode> =>
		{
			async function buildNode(itemId: string): Promise<CraftingTreeNode>
			{
				const item = await ctx.prisma.item.findUniqueOrThrow({
					where: { id: itemId },
				});

				const recipes = await ctx.prisma.recipe.findMany({
					where: { itemId },
					include: { ingredients: true },
				});

				// Build recipe nodes
				const recipeNodes: CraftingRecipeNode[] = await Promise.all(
					recipes.map(async (recipe): Promise<CraftingRecipeNode> =>
					{
						const ingredientNodes: CraftingTreeNode[] = await Promise.all(recipe.ingredients.map((ing) => buildNode(ing.itemId)));

						return {
							id: recipe.id,
							quantity: recipe.quantity,
							time: recipe.time,
							ingredients: ingredientNodes,
						};
					}),
				);

				return {
					item,
					recipes: recipeNodes,
				};
			}

			return buildNode(args.itemId);
		},
	},
};

import { Resolvers, CraftingNode, RecipeNode, Item, Recipe, Ingredient } from '@/graphql/generated/graphql';
import { GraphQLContext } from '../context';

export const craftingTreeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		craftingTree: async (_parent, { itemId }, ctx) =>
		{
			async function getItem(itemId: string): Promise<Item>
			{
				return ctx.prisma.item.findUniqueOrThrow({
					where: { id: itemId },
				});
			}

			async function getRecipes(item: Item): Promise<Recipe[]>
			{
				const recipes = await ctx.prisma.recipe.findMany({
					where: { itemId: item.id },
					include: { item: true },
				});

				const recipesWithIngredients = await Promise.all(
					recipes.map(async (recipe) =>
					{
						const ingredients = await ctx.prisma.ingredient.findMany({
							where: {
								recipes: {
									some: { id: recipe.id },
								},
							},
							include: { item: true },
						});

						return {
							...recipe,
							ingredients,
						};
					}),
				);

				return recipesWithIngredients;
			}

			async function buildRecipeNode(recipe: Recipe): Promise<RecipeNode>
			{
				const ingredientNodes: CraftingNode[] = await Promise.all((recipe.ingredients ?? []).map(async (ingredient) => buildCraftingNode(ingredient.item.id)));

				return {
					quantity: recipe.quantity,
					time: recipe.time,
					ingredients: ingredientNodes,
				};
			}

			async function buildCraftingNode(itemId: string): Promise<CraftingNode>
			{
				const item = await getItem(itemId);
				const recipesWithIngredients = await getRecipes(item);

				const recipes: RecipeNode[] = await Promise.all(recipesWithIngredients.map((recipe) => buildRecipeNode(recipe)));

				return {
					item,
					recipes,
				};
			}

			return buildCraftingNode(itemId);
		},
	},
};

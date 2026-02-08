import { Ingredient } from '@/domain/ingredient';
import { RecipeTreeData, RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';

export function parseRecipeTreeData(data: RecipeTreeData): RecipeTreeState
{
	const { items, recipes, ingredients } = data;

	if (items.length === 0)
	{
		throw new Error('parseRecipeTreeData: No items found in recipe tree data.');
	}

	const itemsById = new Map(items.map((item) => [item.id, item]));
	const recipesByItemId = new Map<string, RecipeTreeNode['recipes']>();
	const ingredientsByRecipeId = new Map<string, Ingredient[]>();

	for (const recipe of recipes)
	{
		const existing = recipesByItemId.get(recipe.itemId) ?? [];
		recipesByItemId.set(recipe.itemId, [...existing, recipe]);
	}

	for (const ingredient of ingredients)
	{
		const existing = ingredientsByRecipeId.get(ingredient.recipeId) ?? [];
		ingredientsByRecipeId.set(ingredient.recipeId, [...existing, ingredient]);
	}

	const ingredientItemIds = new Set(ingredients.map((ingredient) => ingredient.itemId));
	const rootItem = items.find((item) => !ingredientItemIds.has(item.id)) ?? items[0];

	const nodes: Record<RecipeTreeNode['id'], RecipeTreeNode> = {};
	let nodeCounter = 0;

	function buildNode(itemId: string, parentId: RecipeTreeNode['id'] | null): RecipeTreeNode
	{
		const item = itemsById.get(itemId);

		if (!item)
		{
			throw new Error(`parseRecipeTreeData: Building node with itemId "${itemId}" not found in recipe tree data.`);
		}

		const nodeId = `node-${++nodeCounter}`;
		const nodeRecipes = recipesByItemId.get(itemId) ?? [];
		const nodeIngredients: RecipeTreeNode['ingredients'] = {};

		for (const recipe of nodeRecipes)
		{
			nodeIngredients[recipe.id] = ingredientsByRecipeId.get(recipe.id) ?? [];
		}

		const node: RecipeTreeNode = {
			id: nodeId,
			item,
			recipes: nodeRecipes,
			ingredients: nodeIngredients,
			selectedRecipeIndex: nodeRecipes.length > 0 ? 0 : -1,
			parentId,
			children: [],
		};

		nodes[nodeId] = node;

		for (const recipe of nodeRecipes)
		{
			const ingredients = nodeIngredients[recipe.id] ?? [];

			for (const ingredient of ingredients)
			{
				const childItem = itemsById.get(ingredient.itemId);

				if (childItem)
				{
					const childNode = buildNode(childItem.id, nodeId);
					node.children?.push(childNode.id);
				}
			}
		}

		if (node.children && node.children.length === 0)
		{
			delete node.children;
		}

		return node;
	}

	const rootNode = buildNode(rootItem.id, null);

	return { rootNodeId: rootNode.id, nodes };
}

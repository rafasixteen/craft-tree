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
	const rootItemId = rootItem.id;

	const nodes: Record<RecipeTreeNode['id'], RecipeTreeNode> = {};
	let nodeCounter = 0;

	function buildNode(itemId: string, parentId: RecipeTreeNode['id'] | null, path: Set<string>): RecipeTreeNode | null
	{
		const item = itemsById.get(itemId);

		if (!item)
		{
			return null;
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
			selectedRecipeIndex: nodeRecipes.length > 0 ? 0 : null,
			parentId,
			children: [],
		};

		nodes[nodeId] = node;

		if (path.has(itemId))
		{
			return node;
		}

		const nextPath = new Set(path);
		nextPath.add(itemId);

		const childItemIds = new Set<string>();

		for (const recipe of nodeRecipes)
		{
			const recipeIngredients = nodeIngredients[recipe.id] ?? [];

			for (const ingredient of recipeIngredients)
			{
				childItemIds.add(ingredient.itemId);
			}
		}

		for (const childItemId of childItemIds)
		{
			const childNode = buildNode(childItemId, nodeId, nextPath);

			if (childNode)
			{
				node.children?.push(childNode.id);
			}
		}

		if (node.children && node.children.length === 0)
		{
			delete node.children;
		}

		return node;
	}

	const rootNode = buildNode(rootItemId, null, new Set());

	if (!rootNode)
	{
		throw new Error('parseRecipeTreeData: Root item not found in recipe tree data.');
	}

	return { rootNodeId: rootNode.id, nodes };
}

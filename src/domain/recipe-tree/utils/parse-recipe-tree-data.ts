import { RecipeTreeData, RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';

export function parseRecipeTreeData(data: RecipeTreeData): RecipeTreeState
{
	const { items, recipes, ingredients } = data;

	if (items.length === 0)
	{
		throw new Error('parseRecipeTreeData: No items found in recipe tree data.');
	}

	const itemsById = new Map(items.map((item) => [item.id, item]));
	const recipesByItemId = groupBy(recipes, (r) => r.itemId);
	const ingredientsByRecipeId = groupBy(ingredients, (i) => i.recipeId);

	const nodes: Record<RecipeTreeNode['id'], RecipeTreeNode> = {};
	let nodeCounter = 0;

	function buildNode(itemId: string, parentId: RecipeTreeNode['id'] | null): RecipeTreeNode
	{
		const item = itemsById.get(itemId);

		if (!item)
		{
			throw new Error(`parseRecipeTreeData: Item with id "${itemId}" not found.`);
		}

		const nodeId = `node-${++nodeCounter}`;
		const nodeRecipes = recipesByItemId[itemId] ?? [];

		const nodeIngredients: RecipeTreeNode['ingredients'] = {};
		const nodeChildren: RecipeTreeNode['children'] = {};

		for (const recipe of nodeRecipes)
		{
			nodeIngredients[recipe.id] = ingredientsByRecipeId[recipe.id] ?? [];
			nodeChildren[recipe.id] = [];
		}

		const node: RecipeTreeNode = {
			id: nodeId,
			item,
			recipes: nodeRecipes,
			ingredients: nodeIngredients,
			selectedRecipeId: nodeRecipes[0]?.id ?? null,
			parentId,
			children: nodeChildren,
		};

		nodes[nodeId] = node;

		for (const recipe of nodeRecipes)
		{
			const recipeIngredients = nodeIngredients[recipe.id];

			for (const ingredient of recipeIngredients)
			{
				if (!itemsById.has(ingredient.itemId))
				{
					throw new Error(`parseRecipeTreeData: Ingredient refers to unknown item "${ingredient.itemId}" (recipe "${recipe.id}", parent item "${item.id}").`);
				}

				const childNode = buildNode(ingredient.itemId, nodeId);
				node.children[recipe.id].push(childNode.id);
			}
		}

		return node;
	}

	const rootItemId = findRootItemId(items, ingredients);
	const rootNode = buildNode(rootItemId, null);

	return {
		rate: { amount: 1, per: 'second' },
		rootNodeId: rootNode.id,
		nodes: nodes,
	};
}

function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K): Record<K, T[]>
{
	return items.reduce(
		(acc, item) =>
		{
			const key = keyFn(item);
			(acc[key] ??= []).push(item);
			return acc;
		},
		{} as Record<K, T[]>,
	);
}

function findRootItemId(items: RecipeTreeData['items'], ingredients: RecipeTreeData['ingredients']): string
{
	const ingredientItemIds = new Set(ingredients.map((i) => i.itemId));
	const rootItem = items.find((item) => !ingredientItemIds.has(item.id));

	if (!rootItem)
	{
		throw new Error('parseRecipeTreeData: Could not determine root item.');
	}

	return rootItem.id;
}

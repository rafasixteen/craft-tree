import { RecipeTreeState, RecipeTreeNode } from '@/domain/recipe-tree';
import { produce } from 'immer';

export type DfsOrder = 'pre' | 'post';

export type DfsCallback = (node: RecipeTreeNode) => void;

export type DfsGetChildren = (node: RecipeTreeNode) => RecipeTreeNode['id'][];

export function dfs(
	state: RecipeTreeState,
	startNodeId: RecipeTreeNode['id'],
	callback: DfsCallback,
	getChildren: DfsGetChildren = (n) => n.children || [],
	order: DfsOrder = 'pre',
): void
{
	visit(ensureNode(state, startNodeId));

	function visit(node: RecipeTreeNode): void
	{
		if (order === 'pre')
		{
			callback(node);
		}

		for (const childId of getChildren(node))
		{
			visit(ensureNode(state, childId));
		}

		if (order === 'post')
		{
			callback(node);
		}
	}
}

export function changeRecipe(state: RecipeTreeState, nodeId: RecipeTreeNode['id'], delta: number): RecipeTreeState
{
	return produce(state, (draft) =>
	{
		const node = ensureNode(draft, nodeId);

		if (node.selectedRecipeIndex === null)
		{
			throw new Error(`Node with id "${nodeId}" has no selected recipe to change.`);
		}

		const length = node.recipes.length;
		const newIndex = (((node.selectedRecipeIndex + delta) % length) + length) % length;
		node.selectedRecipeIndex = newIndex;
	});
}

export function getResolvedQuantity(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): number
{
	const node = ensureNode(state, nodeId);

	if (node.parentId)
	{
		const parentNode = ensureNode(state, node.parentId);
		const parentRequiredQuantity = getResolvedQuantity(state, parentNode.id);
		const parentSelectedRecipeIndex = parentNode.selectedRecipeIndex;

		if (parentSelectedRecipeIndex === -1)
		{
			throw new Error(`Parent node with id "${parentNode.id}" has no selected recipe.`);
		}

		const parentSelectedRecipe = parentNode.recipes[parentSelectedRecipeIndex];
		const parentSelectedRecipeIngredients = parentNode.ingredients[parentSelectedRecipe.id];
		const ingredient = parentSelectedRecipeIngredients.find((ing) => ing.itemId === node.item.id);

		if (!ingredient)
		{
			throw new Error(`Ingredient for item "${node.item.id}" not found in parent node with id "${parentNode.id}".`);
		}

		return parentRequiredQuantity * ingredient.quantity;
	}
	else
	{
		const selectedRecipeIndex = node.selectedRecipeIndex;

		if (selectedRecipeIndex === -1)
		{
			throw new Error(`Node with id "${node.id}" has no selected recipe.`);
		}

		return node.recipes[selectedRecipeIndex].quantity;
	}
}

function ensureNode(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): RecipeTreeNode
{
	const node = state.nodes[nodeId];

	if (!node)
	{
		throw new Error(`Node with id "${nodeId}" not found in the tree.`);
	}

	return node;
}

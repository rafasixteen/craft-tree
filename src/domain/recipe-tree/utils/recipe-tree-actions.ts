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
	visit(ensureNode(startNodeId));

	function visit(node: RecipeTreeNode): void
	{
		if (order === 'pre')
		{
			callback(node);
		}

		for (const childId of getChildren(node))
		{
			visit(ensureNode(childId));
		}

		if (order === 'post')
		{
			callback(node);
		}
	}

	function ensureNode(nodeId: RecipeTreeNode['id']): RecipeTreeNode
	{
		const node = state.nodes[nodeId];

		if (!node)
		{
			throw new Error(`Node with id "${nodeId}" not found in the tree.`);
		}

		return node;
	}
}

export function changeRecipe(state: RecipeTreeState, nodeId: RecipeTreeNode['id'], delta: number): RecipeTreeState
{
	return produce(state, (draft) =>
	{
		const node = draft.nodes[nodeId];

		if (!node)
		{
			throw new Error(`Node with id "${nodeId}" not found in the tree.`);
		}

		if (node.selectedRecipeIndex === null)
		{
			throw new Error(`Node with id "${nodeId}" has no selected recipe to change.`);
		}

		const length = node.recipes.length;
		const newIndex = (((node.selectedRecipeIndex + delta) % length) + length) % length;
		node.selectedRecipeIndex = newIndex;
	});
}

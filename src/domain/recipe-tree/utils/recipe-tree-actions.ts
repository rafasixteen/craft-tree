import { RecipeTreeState, RecipeTreeNode, ProductionRate } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';
import { produce } from 'immer';

export type DfsOrder = 'pre' | 'post';

export type DfsCallback = (node: RecipeTreeNode) => void;

export type DfsGetChildren = (node: RecipeTreeNode) => RecipeTreeNode['id'][];

export function dfs(state: RecipeTreeState, startNodeId: RecipeTreeNode['id'], callback: DfsCallback, getChildren: DfsGetChildren, order: DfsOrder = 'pre'): void
{
	visit(NodeHelpers.ensureNode(state, startNodeId));

	function visit(node: RecipeTreeNode): void
	{
		if (order === 'pre')
		{
			callback(node);
		}

		for (const childId of getChildren(node))
		{
			visit(NodeHelpers.ensureNode(state, childId));
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
		const node = NodeHelpers.ensureNode(draft, nodeId);
		const selectedRecipeIndex = NodeHelpers.findSelectedRecipeIndex(node);

		if (selectedRecipeIndex === -1)
		{
			throw new Error(`Node with id "${nodeId}" has no selected recipe to change.`);
		}

		const length = node.recipes.length;
		const newIndex = (((selectedRecipeIndex + delta) % length) + length) % length;
		node.selectedRecipeId = node.recipes[newIndex].id;
	});
}

export function setRate(state: RecipeTreeState, rate: ProductionRate): RecipeTreeState
{
	return produce(state, (draft) =>
	{
		draft.rate = rate;
	});
}

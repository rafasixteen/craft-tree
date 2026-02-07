import { RecipeTreeState, RecipeTreeNode } from '@/domain/recipe-tree';

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

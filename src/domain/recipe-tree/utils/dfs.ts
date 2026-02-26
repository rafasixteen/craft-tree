import { RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';

interface DfsParams
{
	state: RecipeTreeState;
	startNodeId: RecipeTreeNode['id'];
	visit: (node: RecipeTreeNode) => void;
	getChildren: (node: RecipeTreeNode) => string[];
	order?: 'pre' | 'post';
}

export function dfs({ state, startNodeId, visit, getChildren, order = 'pre' }: DfsParams)
{
	function visitInternal(node: RecipeTreeNode)
	{
		if (order === 'pre')
		{
			visit(node);
		}

		for (const childId of getChildren(node))
		{
			const child = state.nodes[childId];

			if (child)
			{
				visitInternal(child);
			}
		}

		if (order === 'post')
		{
			visit(node);
		}
	}

	const startNode = state.nodes[startNodeId];

	if (startNode)
	{
		visitInternal(startNode);
	}
}

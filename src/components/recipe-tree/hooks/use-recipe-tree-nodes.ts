import { useEffect, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useRecipeTree, RecipeTreeNode } from '@/domain/recipe-tree';
import { buildEdge, buildNode } from '@/components/recipe-tree';
import type { NodeType } from '@/components/recipe-tree';

export function useRecipeTreeNodes(): { nodes: Node[]; edges: Edge[] }
{
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const { recipeTree, dfs } = useRecipeTree();

	useEffect(() =>
	{
		if (!recipeTree)
		{
			return;
		}

		const nodes: Node[] = [];
		const edges: Edge[] = [];

		function callback(node: RecipeTreeNode): void
		{
			const type: NodeType = node.recipes.length > 0 ? 'processed-material' : 'raw-material';

			nodes.push(
				buildNode(node.id, type, {
					item: node.item,
					recipes: node.recipes,
					ingredients: node.ingredients,
					selectedRecipeId: node.selectedRecipeId,
				}),
			);

			if (node.parentId)
			{
				edges.push(buildEdge(node.parentId, node.id));
			}
		}

		function getSelectedRecipeChildren(node: RecipeTreeNode): RecipeTreeNode['id'][]
		{
			if (node.selectedRecipeId === null)
			{
				return [];
			}
			else
			{
				return node.children[node.selectedRecipeId];
			}
		}

		dfs(recipeTree.rootNodeId, callback, getSelectedRecipeChildren, 'pre');

		setNodes(nodes);
		setEdges(edges);
	}, [recipeTree, dfs]);

	return { nodes, edges };
}

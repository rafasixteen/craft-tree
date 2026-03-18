'use client';

import { useEffect, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree/hooks/use-recipe-tree';
import { buildEdge, buildNode } from '@/components/recipe-tree/utils';
import type { RecipeTreeNodeType } from '@/components/recipe-tree/types';
import { RecipeTreeNode } from '@/domain/recipe-tree';

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
			const type: RecipeTreeNodeType =
				node.producers.length > 0
					? 'processed-material'
					: 'raw-material';

			nodes.push(
				buildNode({
					nodeId: node.id,
					type,
				}),
			);

			if (node.parentId)
			{
				edges.push(
					buildEdge({ parentId: node.parentId, childId: node.id }),
				);
			}
		}

		function getSelectedProducerChildren(node: RecipeTreeNode): string[]
		{
			if (!node.selectedProducerId)
			{
				return [];
			}

			return node.children[node.selectedProducerId] || [];
		}

		dfs(
			recipeTree.rootNodeId,
			callback,
			getSelectedProducerChildren,
			'pre',
		);

		setNodes(nodes);
		setEdges(edges);
	}, [recipeTree, dfs]);

	return { nodes, edges };
}

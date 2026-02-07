'use client';

import '@xyflow/react/dist/style.css';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, DefaultEdgeOptions } from '@xyflow/react';
import { RecipeTreeInternalNode, RecipeTreeRootNode, RecipeTreeLeafNode, RecipeTreeNodeData, RecipeTreeEdge } from '@/components/recipe-tree';
import { useRecipeTree, RecipeTreeNode, DfsCallback, DfsGetChildren } from '@/domain/recipe-tree';

type NodeType = 'root-node' | 'internal-node' | 'leaf-node';

const nodeTypes = {
	'root-node': RecipeTreeRootNode,
	'internal-node': RecipeTreeInternalNode,
	'leaf-node': RecipeTreeLeafNode,
} satisfies Record<NodeType, React.ComponentType<any>>;

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
	type: 'smoothstep',
};

export function RecipeTreeFlow()
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node<RecipeTreeNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { recipeTree, dfs } = useRecipeTree();

	useEffect(() =>
	{
		if (!recipeTree)
		{
			return;
		}

		const newNodes: Node<RecipeTreeNodeData>[] = [];
		const newEdges: Edge[] = [];

		const getChildren: DfsGetChildren = (node) =>
		{
			// no selected recipe → no children
			if (node.selectedRecipeIndex === null) return [];

			const recipe = node.recipes[node.selectedRecipeIndex];
			const ingredients = node.ingredients[recipe.id] ?? [];

			// map child item IDs → child node IDs
			const childrenNodeIds = ingredients
				.map((ingredient) => ingredient.itemId)
				.map((itemId) =>
				{
					const childNode = Object.values(recipeTree.nodes).find((n) => n.item.id === itemId);
					return childNode ? childNode.id : null;
				})
				.filter((id): id is string => id !== null);

			return childrenNodeIds;
		};

		const callback: DfsCallback = (node) =>
		{
			const type: NodeType = node.parentId === null ? 'root-node' : node.recipes.length > 0 ? 'internal-node' : 'leaf-node';

			// Build the React Flow node
			const flowNode = buildNode(node, type);

			if (node.parentId)
			{
				newEdges.push(buildEdge(node.parentId, node.id));
			}

			newNodes.push(flowNode);
		};

		dfs(recipeTree.rootNodeId, callback, getChildren, 'pre');

		setNodes(newNodes);
		setEdges(newEdges);
	}, [recipeTree]);

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	if (!mounted)
	{
		return null;
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				fitView
				fitViewOptions={fitViewOptions}
				defaultEdgeOptions={defaultEdgeOptions}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				<Controls />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}

function buildNode(node: RecipeTreeNode, type: NodeType): Node<RecipeTreeNodeData>
{
	return {
		id: node.id,
		type: type,
		position: { x: 0, y: 0 },
		data: {
			item: node.item,
			recipes: node.recipes,
			ingredients: node.ingredients,
			selectedRecipeIndex: node.selectedRecipeIndex,
		},
	};
}

function buildEdge(parentId: RecipeTreeNode['id'], childId: RecipeTreeNode['id']): Edge
{
	return {
		id: `edge_${parentId}_${childId}`,
		source: parentId,
		target: childId,
	};
}

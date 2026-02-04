'use client';

import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { RecipeTreeRootNode, RecipeTreeNodeComp, RecipeTreeLeafNode, RecipeTreeEdge } from '@/components/item/recipe-tree/components';
import { RecipeTreeNodeData, RecipeTreeNodeType } from '@/components/item/recipe-tree/types';
import { buildEdge, buildNode } from '@/components/item/recipe-tree/utils';
import { useRecipeTreeContext } from '@/components/item/recipe-tree/providers';
import {
	ReactFlow,
	type Node,
	type Edge,
	type NodeTypes,
	type EdgeTypes,
	type FitViewOptions,
	type DefaultEdgeOptions,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
} from '@xyflow/react';

const nodeTypes: NodeTypes = {
	[RecipeTreeNodeType.ROOT]: RecipeTreeRootNode,
	[RecipeTreeNodeType.NODE]: RecipeTreeNodeComp,
	[RecipeTreeNodeType.LEAF]: RecipeTreeLeafNode,
};

const edgeTypes: EdgeTypes = {
	'flow-edge': RecipeTreeEdge,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
	type: 'flow-edge',
};

export function RecipeTreeFlow()
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node<RecipeTreeNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { loading, tree } = useRecipeTreeContext();

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	useEffect(() =>
	{
		function buildRecipeTree()
		{
			if (loading)
			{
				return;
			}

			if (!tree)
			{
				return;
			}

			const nextNodes: Node<RecipeTreeNodeData>[] = [];
			const nextEdges: Edge[] = [];

			tree.dfs(tree.root, (node) =>
			{
				function getNodeType(): RecipeTreeNodeType
				{
					if (node.id === tree!.root.id)
					{
						return RecipeTreeNodeType.ROOT;
					}

					if (node.recipes.length > 0)
					{
						return RecipeTreeNodeType.NODE;
					}

					return RecipeTreeNodeType.LEAF;
				}

				const flowNode = buildNode({
					nodeId: node.id,
					nodeType: getNodeType(),
					data: {
						item: node.item,
					},
				});

				nextNodes.push(flowNode);

				const parentNode = node.getParent();

				if (parentNode)
				{
					nextEdges.push(buildEdge(parentNode.id, node.id));
				}
			});

			calculateTreePositions(nextNodes, nextEdges);

			setNodes(nextNodes);
			setEdges(nextEdges);
		}

		function calculateTreePositions(nodes: Node<RecipeTreeNodeData>[], edges: Edge[]): void
		{
			// Build parent-child relationships
			const childrenMap = new Map<string, string[]>();
			edges.forEach((edge) =>
			{
				if (!childrenMap.has(edge.source))
				{
					childrenMap.set(edge.source, []);
				}
				childrenMap.get(edge.source)!.push(edge.target);
			});

			// Calculate tree layout based on node dimensions
			const nodeWidth = 200; // w-40 in Tailwind = 10rem = 160px
			const nodeHeight = 180; // Estimated average height
			const horizontalOffset = 80; // Space between nodes horizontally
			const verticalOffset = 60; // Space between levels

			const horizontalSpacing = nodeWidth + horizontalOffset;
			const verticalSpacing = nodeHeight + verticalOffset;
			const nodeMap = new Map(nodes.map((n) => [n.id, n]));

			// Calculate subtree width for each node (bottom-up)
			function getSubtreeWidth(nodeId: string): number
			{
				const children = childrenMap.get(nodeId) || [];
				if (children.length === 0)
				{
					return 1; // Leaf node has width of 1
				}

				const childWidths = children.map((childId) => getSubtreeWidth(childId));
				return childWidths.reduce((sum, width) => sum + width, 0);
			}

			// Position nodes (top-down, left-to-right)
			function positionNode(nodeId: string, x: number, y: number): void
			{
				const node = nodeMap.get(nodeId);
				if (!node) return;

				node.position = { x, y };

				const children = childrenMap.get(nodeId) || [];
				if (children.length === 0) return;

				// Calculate total width needed for all children
				const childWidths = children.map((childId) => getSubtreeWidth(childId));
				const totalWidth = childWidths.reduce((sum, width) => sum + width, 0);

				// Position children centered under parent
				let currentX = x - ((totalWidth - 1) * horizontalSpacing) / 2;

				children.forEach((childId, index) =>
				{
					const childWidth = childWidths[index];
					const childCenterOffset = ((childWidth - 1) * horizontalSpacing) / 2;

					positionNode(childId, currentX + childCenterOffset, y + verticalSpacing);

					currentX += childWidth * horizontalSpacing;
				});
			}

			// Find root node (node with no incoming edges)
			const rootNode = nodes.find((node) => !edges.some((edge) => edge.target === node.id));
			if (rootNode)
			{
				positionNode(rootNode.id, 0, 0);
			}
		}

		buildRecipeTree();
	}, [loading, tree]);

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
				edgeTypes={edgeTypes}
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

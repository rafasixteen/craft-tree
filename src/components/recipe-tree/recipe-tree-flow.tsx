'use client';

import '@xyflow/react/dist/style.css';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, useNodesInitialized, useReactFlow } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, DefaultEdgeOptions } from '@xyflow/react';
import type { NodeType } from '@/components/recipe-tree';
import { buildNode, buildEdge, useRecipeTreeNodes } from '@/components/recipe-tree';
import { ProcessedMaterialNode, RawMaterialNode, RateControlNode, BillOfMaterialsOverlay, getLayoutedElements } from '@/components/recipe-tree';

const nodeTypes = {
	'rate-control': RateControlNode,
	'processed-material': ProcessedMaterialNode,
	'raw-material': RawMaterialNode,
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

	const { nodes: baseNodes, edges: baseEdges } = useRecipeTreeNodes();

	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { getNodes, getEdges } = useReactFlow<Node, Edge>();

	const nodesInitialized = useNodesInitialized();

	useEffect(() =>
	{
		if (nodesInitialized)
		{
			getLayoutedElements(getNodes(), getEdges()).then(({ nodes: layoutedNodes, edges: layoutedEdges }) =>
			{
				setNodes(layoutedNodes);
				setEdges(layoutedEdges);
			});
		}
	}, [nodesInitialized]);

	useEffect(() =>
	{
		if (baseNodes.length === 0 || baseEdges.length === 0) return;

		const rateControlNodeId = 'rate-control-node';
		const rateControlNode = buildNode(rateControlNodeId, 'rate-control', {});

		const mergedNodes = [
			rateControlNode,
			...baseNodes.map((newNode) =>
			{
				const existingNode = nodes.find((n) => n.id === newNode.id);
				return existingNode ? { ...newNode, position: existingNode.position } : newNode;
			}),
		];

		const rateControlEdge = buildEdge(rateControlNodeId, baseNodes[0].id);

		setNodes(mergedNodes);
		setEdges([...baseEdges, rateControlEdge]);
	}, [baseNodes, baseEdges]);

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	if (!mounted)
	{
		return null;
	}

	return (
		<div className="size-full">
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
				nodesDraggable={false}
				deleteKeyCode={null}
			>
				<BillOfMaterialsOverlay />
				<Controls />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}

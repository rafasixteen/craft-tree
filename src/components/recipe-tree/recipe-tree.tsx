'use client';

import '@xyflow/react/dist/style.css';
import { ReactFlow, Controls, Background, useNodesState, Edge, Node, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { config, layoutRecipeTree, BillOfMaterialsOverlay, ProducersOverlay } from '@/components/recipe-tree';
import { buildNode, buildEdge } from '@/components/recipe-tree/utils';
import { useRecipeTreeNodes } from '@/components/recipe-tree/hooks';
import { useEffect } from 'react';

interface RecipeTreeProps
{
	initialTheme: 'light' | 'dark';
}

export function RecipeTree({ initialTheme }: RecipeTreeProps)
{
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme ?? initialTheme;

	const { nodes: baseNodes, edges: baseEdges } = useRecipeTreeNodes();

	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	useEffect(() =>
	{
		if (baseNodes.length === 0 || baseEdges.length === 0)
		{
			return;
		}

		const rateControlNodeId = 'rate-control-node';
		const rateControlNode = buildNode({ nodeId: rateControlNodeId, type: 'rate-control' });
		const rateControlEdge = buildEdge({ parentId: rateControlNodeId, childId: baseNodes[0].id });

		const mergedNodes = [
			rateControlNode,
			...baseNodes.map((newNode) =>
			{
				const existingNode = nodes.find((n) => n.id === newNode.id);
				return existingNode ? { ...newNode, position: existingNode.position } : newNode;
			}),
		];

		const mergedEdges = [...baseEdges, rateControlEdge];

		setNodes(mergedNodes);
		setEdges(mergedEdges);
	}, [baseNodes, baseEdges]);

	const { getNodes, getEdges } = useReactFlow<Node, Edge>();

	const nodesInitialized = useNodesInitialized();

	useEffect(() =>
	{
		if (nodesInitialized)
		{
			layoutRecipeTree(getNodes(), getEdges()).then(({ nodes: layoutedNodes, edges: layoutedEdges }) =>
			{
				setNodes(layoutedNodes);
				setEdges(layoutedEdges);
			});
		}
	}, [nodesInitialized]);

	return (
		<div className="size-full">
			<ReactFlow {...config} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} colorMode={theme === 'dark' ? 'dark' : 'light'}>
				<Controls />
				<Background gap={20} size={1} />
				<BillOfMaterialsOverlay position="top-right" />
				<ProducersOverlay />
			</ReactFlow>
		</div>
	);
}

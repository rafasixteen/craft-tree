'use client';

import '@xyflow/react/dist/style.css';
import { ReactFlow, Controls, Background, useNodesState, Edge, Node, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { config, layoutRecipeTree, BillOfMaterialsOverlay } from '@/components/recipe-tree';
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

	const { getNodes, getEdges } = useReactFlow<Node, Edge>();
	const nodesInitialized = useNodesInitialized();

	useEffect(() =>
	{
		if (baseNodes.length === 0 || baseEdges.length === 0)
		{
			return;
		}

		setNodes(baseNodes);
		setEdges(baseEdges);
	}, [baseNodes, baseEdges]);

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
			</ReactFlow>
		</div>
	);
}

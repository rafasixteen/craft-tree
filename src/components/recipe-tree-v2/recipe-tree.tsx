'use client';

import '@xyflow/react/dist/style.css';
import { ReactFlow, Controls, Background, useNodesState, Edge, Node, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { config, getLayoutedElements } from '@/components/recipe-tree-v2';
import { useRecipeTreeNodes } from '@/components/recipe-tree-v2/hooks';
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
		setNodes(baseNodes);
	}, [baseNodes, setNodes]);

	useEffect(() =>
	{
		setEdges(baseEdges);
	}, [baseEdges, setEdges]);

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

	return (
		<div className="size-full">
			<ReactFlow {...config} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} colorMode={theme === 'dark' ? 'dark' : 'light'}>
				<Controls />
				<Background gap={20} size={1} />
			</ReactFlow>
		</div>
	);
}

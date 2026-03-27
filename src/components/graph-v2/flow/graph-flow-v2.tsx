'use client';

import { Background, Controls, ReactFlow } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { graphConfig, useGraph } from '@/components/graph-v2';
import { GraphData as GraphDataOld } from '@/domain/graph';
import { GraphData as GraphDataV2 } from '@/domain/graph-v2';

interface GraphFlowProps
{
	initialTheme: 'light' | 'dark';
	initialNodes: GraphDataOld['nodes'];
	initialEdges: GraphDataOld['edges'];
	initialViewport: GraphDataOld['viewport'];
}

export function GraphFlowV2({ initialTheme, initialNodes, initialEdges, initialViewport }: GraphFlowProps)
{
	const { resolvedTheme } = useTheme();

	const theme = resolvedTheme ?? initialTheme;

	const normalizedData: GraphDataV2 = {
		nodes: initialNodes.map((node) => ({
			id: node.id,
			type: node.type,
			position: node.position,
			data: node.data ?? {},
		})),
		edges: initialEdges.map((edge) => ({
			id: edge.id,
			type: edge.type ?? 'default',
			source: edge.source,
			sourceHandle: edge.sourceHandle ?? '',
			target: edge.target,
			targetHandle: edge.targetHandle ?? '',
			data: edge.data ?? {},
		})),
		viewport: initialViewport,
	};

	const { nodes, edges, viewport, setViewport, onNodesChange, onEdgesChange, onConnect } = useGraph({
		nodes: normalizedData.nodes,
		edges: normalizedData.edges,
		viewport: normalizedData.viewport,
	});

	return (
		<div className="size-full">
			<ReactFlow
				{...graphConfig}
				nodes={nodes}
				edges={edges}
				viewport={viewport}
				onViewportChange={setViewport}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				<Controls />
				<Background gap={20} size={1} />
			</ReactFlow>
		</div>
	);
}

'use client';

import { Background, Controls, Node, ReactFlow } from '@xyflow/react';
import { useTheme } from 'next-themes';
import {
	graphConfig,
	GraphContextMenu,
	GraphContextMenuProps,
	NodeContextMenu,
	NodeContextMenuProps,
	toGraphData,
	useGraph,
} from '@/components/graph-v2';
import { GraphData } from '@/domain/graph-v2';
import { useCallback, useEffect, useState } from 'react';
import { updateGraph } from '@/domain/graph';
import { useParams } from 'next/navigation';

interface GraphFlowProps
{
	initialTheme: 'light' | 'dark';
	data: GraphData;
}

export function GraphFlowV2({ initialTheme, data }: GraphFlowProps)
{
	const params = useParams();
	const graphId = params['graph-id'] as string;

	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme ?? initialTheme;

	const [contextMenuState, setContextMenuState] = useState<GraphContextMenuProps | NodeContextMenuProps | null>(null);

	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useGraph({
		nodes: data.nodes,
		edges: data.edges,
	});

	const openGraphContextMenu = useCallback(
		function openGraphContextMenu(event: MouseEvent | React.MouseEvent)
		{
			// Prevent native context menu from showing.
			event.preventDefault();

			setContextMenuState({
				type: 'graph',
				position: { x: event.clientX, y: event.clientY },
				close: () => setContextMenuState(null),
			});
		},
		[setContextMenuState],
	);

	const openNodeContextMenu = useCallback(
		function openNodeContextMenu(event: MouseEvent | React.MouseEvent, node: Node)
		{
			// Prevent native context menu from showing.
			event.preventDefault();

			// Stop the event from propagating to the pane's context menu handler.
			event.stopPropagation();

			setContextMenuState({
				type: 'node',
				nodeId: node.id,
				position: { x: event.clientX, y: event.clientY },
				close: () => setContextMenuState(null),
			});
		},
		[setContextMenuState],
	);

	const closeContextMenu = useCallback(
		function closeContextMenu()
		{
			setContextMenuState(null);
		},
		[setContextMenuState],
	);

	useEffect(() =>
	{
		const saveIntervalMs = 500;

		const timeout = setTimeout(() =>
		{
			updateGraph({
				id: graphId,
				data: toGraphData(nodes, edges),
			});
		}, saveIntervalMs);

		return () => clearTimeout(timeout);
	}, [nodes, edges]);

	// TODO: Show some kind of "Saving..." indicator when changes are being saved.
	// TODO: Add a shortcut for layouting the graph (e.g. Ctrl+L) and show a "Laying out..." indicator when the layout is being calculated.

	return (
		<div className="size-full">
			<ReactFlow
				{...graphConfig}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onPaneContextMenu={openGraphContextMenu}
				onNodeContextMenu={openNodeContextMenu}
				onPaneClick={closeContextMenu}
				onNodeClick={closeContextMenu}
				onMove={closeContextMenu}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				{contextMenuState && <ContextMenu {...contextMenuState} />}
				<Controls />
				<Background gap={20} size={1} />
			</ReactFlow>
		</div>
	);
}

function ContextMenu(props: GraphContextMenuProps | NodeContextMenuProps)
{
	if (props.type === 'graph')
	{
		return <GraphContextMenu {...props} />;
	}

	return <NodeContextMenu {...props} />;
}

'use client';

import '@xyflow/react/dist/style.css';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, Controls, Background, useReactFlow, Panel, getOutgoers } from '@xyflow/react';
import type { ReactFlowInstance, Connection, NodeChange, EdgeChange, Viewport } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { PaneContextMenu, NodeContextMenu } from '@/components/production-graph/flow/context-menus';
import { ProductionGraphNode, ProductionGraphEdge } from '@/components/production-graph/flow/types';
import { graphConfig } from '@/components/production-graph/flow/production-graph.config';
import { useProductionGraph } from '@/domain/production-graph';
import { useParams } from 'next/navigation';

type PaneMenu = {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
} | null;

type NodeMenu = {
	id: string;
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
} | null;

interface ProductionGraphProps
{
	initialNodes: ProductionGraphNode[];
	initialEdges: ProductionGraphEdge[];
	initialViewport?: Viewport;
	initialTheme: 'light' | 'dark';
}

export function ProductionGraph({ initialNodes, initialEdges, initialViewport, initialTheme }: ProductionGraphProps)
{
	const { resolvedTheme } = useTheme();

	const theme = resolvedTheme ?? initialTheme;

	const [nodes, setNodes] = useState<ProductionGraphNode[]>(initialNodes);
	const [edges, setEdges] = useState<ProductionGraphEdge[]>(initialEdges);
	const [viewport, setViewport] = useState<Viewport>(initialViewport || { x: 0, y: 0, zoom: 1 });

	const [rfInstance, setRfInstance] = useState<ReactFlowInstance<ProductionGraphNode, ProductionGraphEdge> | null>(null);
	const { getNodes, getEdges } = useReactFlow<ProductionGraphNode, ProductionGraphEdge>();

	const params = useParams();
	const graphId = params['production-graph-id'] as string;

	const { updateProductionGraph } = useProductionGraph(graphId);

	const [paneMenu, setPaneMenu] = useState<PaneMenu>(null);
	const [nodeMenu, setNodeMenu] = useState<NodeMenu>(null);

	const ref = useRef<HTMLDivElement>(null);

	const onNodesChange = useCallback(
		function onNodesChange(changes: NodeChange<ProductionGraphNode>[])
		{
			setNodes((nds) => applyNodeChanges(changes, nds));
		},
		[setNodes],
	);

	const onEdgesChange = useCallback(
		function onEdgesChange(changes: EdgeChange<ProductionGraphEdge>[])
		{
			setEdges((eds) => applyEdgeChanges(changes, eds));
		},
		[setEdges],
	);

	const onConnect = useCallback(
		function onConnect(connection: Connection)
		{
			setEdges((eds) => addEdge(connection, eds));
		},
		[setEdges],
	);

	const onPaneContextMenu = useCallback(
		function onPaneContextMenu(event: React.MouseEvent)
		{
			// Prevent native context menu from showing.
			event.preventDefault();

			if (!ref.current)
			{
				return;
			}

			const pane = ref.current.getBoundingClientRect();

			const clickX = event.clientX - pane.left;
			const clickY = event.clientY - pane.top;

			const MENU_WIDTH = 200;
			const MENU_HEIGHT = 150;

			const horizontal = clickX > pane.width - MENU_WIDTH ? 'right' : 'left';
			const vertical = clickY > pane.height - MENU_HEIGHT ? 'bottom' : 'top';

			const menu: PaneMenu = {
				top: vertical === 'top' ? clickY : undefined,
				bottom: vertical === 'bottom' ? pane.height - clickY : undefined,
				left: horizontal === 'left' ? clickX : undefined,
				right: horizontal === 'right' ? pane.width - clickX : undefined,
			};

			setNodeMenu(null);
			setPaneMenu(menu);
		},
		[setPaneMenu, setNodeMenu],
	);

	const onNodeContextMenu = useCallback(
		function onNodeContextMenu(event: React.MouseEvent, node: ProductionGraphNode)
		{
			// Prevent native context menu from showing.
			event.preventDefault();

			// Stop the event from propagating to the pane's context menu handler.
			event.stopPropagation();

			if (!ref.current)
			{
				return;
			}

			const pane = ref.current.getBoundingClientRect();

			const clickX = event.clientX - pane.left;
			const clickY = event.clientY - pane.top;

			const MENU_WIDTH = 200;
			const MENU_HEIGHT = 150;

			const horizontal = clickX > pane.width - MENU_WIDTH ? 'right' : 'left';
			const vertical = clickY > pane.height - MENU_HEIGHT ? 'bottom' : 'top';

			const menu: NodeMenu = {
				id: node.id,
				top: vertical === 'top' ? clickY : undefined,
				bottom: vertical === 'bottom' ? pane.height - clickY : undefined,
				left: horizontal === 'left' ? clickX : undefined,
				right: horizontal === 'right' ? pane.width - clickX : undefined,
			};

			setPaneMenu(null);
			setNodeMenu(menu);
		},
		[setNodeMenu, setPaneMenu],
	);

	const onPaneClick = useCallback(
		function onPaneClick()
		{
			setPaneMenu(null);
			setNodeMenu(null);
		},
		[setPaneMenu, setNodeMenu],
	);

	const saveGraph = useCallback(
		function saveGraph()
		{
			if (rfInstance)
			{
				updateProductionGraph({ data: rfInstance.toObject() });
			}
		},
		[rfInstance],
	);

	const isValidConnection = useCallback(function isValidConnection(connection: ProductionGraphEdge | Connection): boolean
	{
		const nodes = getNodes();
		const edges = getEdges();

		const target = nodes.find((node) => node.id === connection.target);

		function hasCycle(node: ProductionGraphNode, visited = new Set()): boolean
		{
			if (visited.has(node.id))
			{
				return false;
			}

			visited.add(node.id);

			for (const outgoer of getOutgoers(node, nodes, edges))
			{
				if (outgoer.id === connection.source)
				{
					return true;
				}

				if (hasCycle(outgoer, visited))
				{
					return true;
				}
			}

			return false;
		}

		if (!target || target.id === connection.source)
		{
			return false;
		}

		return !hasCycle(target);
	}, []);

	return (
		<div className="size-full">
			<ReactFlow<ProductionGraphNode, ProductionGraphEdge>
				{...graphConfig}
				ref={ref}
				nodes={nodes}
				edges={edges}
				viewport={viewport}
				onViewportChange={setViewport}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				isValidConnection={isValidConnection}
				onInit={setRfInstance}
				onNodeContextMenu={onNodeContextMenu}
				onContextMenu={onPaneContextMenu}
				onPaneClick={onPaneClick}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				{paneMenu && <PaneContextMenu {...paneMenu} onClick={onPaneClick} />}
				{nodeMenu && <NodeContextMenu {...nodeMenu} onClick={onPaneClick} />}
				<Controls />
				<Background gap={20} size={1} />
				<Panel position="top-right">
					<Button onClick={saveGraph}>save</Button>
				</Panel>
			</ReactFlow>
		</div>
	);
}

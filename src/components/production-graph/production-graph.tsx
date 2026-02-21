'use client';

import '@xyflow/react/dist/style.css';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, Controls, Background, useReactFlow, Panel } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, OnConnect, OnNodesChange, OnEdgesChange, DefaultEdgeOptions, ReactFlowInstance, Connection } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { NodeType, ProducerNode, ItemFlowEdge, PaneContextMenu, NodeContextMenu, EdgeType, ItemNode, ProductionRateNode, ProducerNodeData } from '@/components/production-graph';
import { Button } from '@/components/ui/button';

const nodeTypes: Record<NodeType, React.ComponentType<any>> = {
	producer: ProducerNode,
	item: ItemNode,
	'production-rate': ProductionRateNode,
};

const edgeTypes: Record<EdgeType, React.ComponentType<any>> = {
	'item-flow': ItemFlowEdge,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
	type: 'item-flow',
};

interface ProductionGraphProps
{
	initialTheme: 'light' | 'dark';
}

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

// TODO: Use custom handles to facilitate getting production rate data without having to search through the node's inputs/outputs for the correct handle id.
// https://reactflow.dev/learn/advanced-use/computing-flows

export function ProductionGraph({ initialTheme }: ProductionGraphProps)
{
	const { resolvedTheme } = useTheme();

	const theme = resolvedTheme ?? initialTheme;

	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
	const { setViewport } = useReactFlow();

	const [paneMenu, setPaneMenu] = useState<PaneMenu>(null);
	const [nodeMenu, setNodeMenu] = useState<NodeMenu>(null);

	const ref = useRef<HTMLDivElement>(null);

	const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
	const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
	const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

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
		function onNodeContextMenu(event: React.MouseEvent, node: Node)
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

	function saveGraph()
	{
		if (!rfInstance)
		{
			return;
		}

		const flow = rfInstance.toObject();
		localStorage.setItem('production-graph', JSON.stringify(flow));
	}

	function loadGraph()
	{
		const saved = localStorage.getItem('production-graph');

		if (!saved)
		{
			return;
		}

		const flow = JSON.parse(saved);

		if (flow)
		{
			const { x = 0, y = 0, zoom = 1 } = flow.viewport;
			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);
			setViewport({ x, y, zoom });
		}
	}

	function isValidConnection(connection: Edge | Connection): boolean
	{
		const sourceNode = nodes.find((n) => n.id === connection.source);
		const targetNode = nodes.find((n) => n.id === connection.target);

		if (!sourceNode || !targetNode)
		{
			throw new Error('Source or target node not found');
		}

		const sourceType = sourceNode.type as NodeType;
		const targetType = targetNode.type as NodeType;

		switch (sourceType)
		{
			case 'item':
				return targetType === 'production-rate';
			case 'producer':
				return targetType === 'production-rate' || targetType === 'producer';
			case 'production-rate':
				return targetType === 'producer';
			default:
				throw new Error(`Unknown source node type: ${sourceType}`);
		}
	}

	useEffect(() =>
	{
		loadGraph();
	}, []);

	return (
		<div className="size-full">
			<ReactFlow
				ref={ref}
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeContextMenu={onNodeContextMenu}
				onContextMenu={onPaneContextMenu}
				onPaneClick={onPaneClick}
				isValidConnection={isValidConnection}
				onInit={setRfInstance}
				fitView
				snapToGrid
				fitViewOptions={fitViewOptions}
				defaultEdgeOptions={defaultEdgeOptions}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				{paneMenu && <PaneContextMenu {...paneMenu} onClick={onPaneClick} />}
				{nodeMenu && <NodeContextMenu {...nodeMenu} onClick={onPaneClick} />}
				<Controls />
				<Background gap={20} size={1} />
				<Panel position="top-right">
					<Button onClick={saveGraph}>save</Button>
					<Button onClick={loadGraph}>restore</Button>
				</Panel>
			</ReactFlow>
		</div>
	);
}

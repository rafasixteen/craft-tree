'use client';

import '@xyflow/react/dist/style.css';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, Controls, Background, useReactFlow, Panel } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, OnConnect, OnNodesChange, OnEdgesChange, DefaultEdgeOptions, ReactFlowInstance, Connection } from '@xyflow/react';
import { useTheme } from 'next-themes';
import { NodeType, ProducerNode, ItemFlowEdge, PaneContextMenu, NodeContextMenu, EdgeType, ItemNode, ItemFlowEdgeData } from '@/components/production-graph';
import { Button } from '@/components/ui/button';

const nodeTypes: Record<NodeType, React.ComponentType<any>> = {
	producer: ProducerNode,
	item: ItemNode,
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
	// const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	const onConnect: OnConnect = useCallback(
		(connection) =>
		{
			// ...existing code to get nodes...
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);

			let sourceItemId, targetItemId;
			if (sourceNode?.type === 'producer')
			{
				sourceItemId = sourceNode.data.outputs?.find((o) => o.id === connection.sourceHandle)?.itemId;
			}
			else if (sourceNode?.type === 'item')
			{
				sourceItemId = sourceNode.data.item?.id;
			}
			if (targetNode?.type === 'producer')
			{
				targetItemId = targetNode.data.inputs?.find((i) => i.id === connection.targetHandle)?.itemId;
			}
			else if (targetNode?.type === 'item')
			{
				targetItemId = targetNode.data.item?.id;
			}

			const invalid = !sourceItemId || !targetItemId || sourceItemId !== targetItemId;

			const data: ItemFlowEdgeData = {
				rate: 0,
				invalid,
			};

			setEdges((eds) => addEdge({ ...connection, data }, eds));
		},
		[nodes, setEdges],
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
		return true;

		const sourceNode = nodes.find((n) => n.id === connection.source);
		const targetNode = nodes.find((n) => n.id === connection.target);

		if (!sourceNode || !targetNode) return false;

		// Get itemId from source handle
		let sourceItemId: string | undefined;
		if (sourceNode.type === 'producer')
		{
			const output = sourceNode.data.outputs?.find((o) => o.id === connection.sourceHandle);
			sourceItemId = output?.itemId;
		}
		else if (sourceNode.type === 'item')
		{
			sourceItemId = sourceNode.data.item?.id;
		}

		// Get itemId from target handle
		let targetItemId: string | undefined;
		if (targetNode.type === 'producer')
		{
			const input = targetNode.data.inputs?.find((i) => i.id === connection.targetHandle);
			targetItemId = input?.itemId;
		}
		else if (targetNode.type === 'item')
		{
			targetItemId = targetNode.data.item?.id;
		}

		// Only allow if both itemIds exist and match
		return !!sourceItemId && !!targetItemId && sourceItemId === targetItemId;
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

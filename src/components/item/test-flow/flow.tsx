'use client';

import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import {
	ReactFlow,
	addEdge,
	applyNodeChanges,
	applyEdgeChanges,
	type Node,
	type Edge,
	type NodeTypes,
	type FitViewOptions,
	type OnConnect,
	type OnNodesChange,
	type OnEdgesChange,
	type OnNodeDrag,
	type DefaultEdgeOptions,
	Controls,
	MiniMap,
	Background,
} from '@xyflow/react';
import { useTheme } from 'next-themes';
import { FlowNode } from '@/components/item/test-flow';

const initialNodes: Node[] = [
	{ id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 }, type: 'flowNode' },
	{ id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 }, type: 'flowNode' },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes: NodeTypes = {
	flowNode: FlowNode,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) =>
{
	console.log('drag event', node.data);
};

export function Flow()
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
	const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
	const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	// Prevent hydration mismatch by only rendering theme-dependent content after mount
	if (!mounted)
	{
		return <div style={{ width: '100%', height: '100%' }} />;
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeDrag={onNodeDrag}
				fitView
				fitViewOptions={fitViewOptions}
				defaultEdgeOptions={defaultEdgeOptions}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				<Controls />
				<MiniMap />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}

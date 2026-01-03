'use client';

import { useState, useCallback } from 'react';
import { BaseNodeFullDemo } from './Node';
import {
	ReactFlow,
	addEdge,
	applyNodeChanges,
	applyEdgeChanges,
	type Node,
	type Edge,
	type FitViewOptions,
	type OnConnect,
	type OnNodesChange,
	type OnEdgesChange,
	type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
	{ id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 }, type: 'baseNodeFull' },
	{ id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 }, type: 'baseNodeFull' },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
};

const nodeTypes = {
	baseNodeFull: BaseNodeFullDemo,
};

export function RecipeTree()
{
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);

	const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
	const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
	const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			fitView
			fitViewOptions={fitViewOptions}
			defaultEdgeOptions={defaultEdgeOptions}
		/>
	);
}

'use client';

import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Viewport } from '@xyflow/react';
import { NodeType, GraphData } from '@/domain/graph-v2';
import { toFlowNodes, toFlowEdges } from '@/components/graph-v2';

export function useGraph(initial: GraphData)
{
	const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(initial.nodes));
	const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(initial.edges));
	const [viewport, setViewport] = useState<Viewport>(initial.viewport);

	const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	const addNode = useCallback(
		(type: NodeType, position: { x: number; y: number }) =>
		{
			const id = crypto.randomUUID();
			setNodes((nds) => [...nds, { id, type, position, data: {} }]);
		},
		[setNodes],
	);

	return { nodes, edges, viewport, setViewport, onNodesChange, onEdgesChange, onConnect, addNode };
}

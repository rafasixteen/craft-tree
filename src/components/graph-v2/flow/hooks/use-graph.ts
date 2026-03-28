'use client';

import { useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection } from '@xyflow/react';
import { GraphData } from '@/domain/graph-v2';
import { toFlowNodes, toFlowEdges } from '@/components/graph-v2';

export function useGraph(initial: GraphData)
{
	const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(initial.nodes));
	const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(initial.edges));

	const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	return { nodes, edges, onNodesChange, onEdgesChange, onConnect };
}

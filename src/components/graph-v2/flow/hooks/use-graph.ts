'use client';

import { useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection } from '@xyflow/react';
import { GraphData, resolveEdgeType, isNodeType } from '@/domain/graph-v2';
import { toFlowNodes, toFlowEdges } from '@/components/graph-v2';

export function useGraph(initial: GraphData)
{
	const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(initial.nodes));
	const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(initial.edges));

	const onConnect = useCallback(
		function onConnect(connection: Connection)
		{
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);

			if (isNodeType(sourceNode?.type) && isNodeType(targetNode?.type))
			{
				const edgeType = resolveEdgeType(sourceNode?.type, targetNode?.type) ?? undefined;
				setEdges((eds) => addEdge({ ...connection, type: edgeType }, eds));
			}

			setEdges((eds) => addEdge(connection, eds));
		},
		[nodes, setEdges],
	);

	return { nodes, edges, onNodesChange, onEdgesChange, onConnect };
}

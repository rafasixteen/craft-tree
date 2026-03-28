'use client';

import { useCallback } from 'react';
import { Edge, Node, useNodesInitialized, useReactFlow } from '@xyflow/react';
import { ElkNode } from 'elkjs/lib/elk-api';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const layoutOptions = {
	'elk.algorithm': 'layered',
	'elk.direction': 'RIGHT',

	'elk.spacing.nodeNode': '120',
	'elk.layered.spacing.nodeNodeBetweenLayers': '240',
};

export function useLayoutGraph()
{
	const nodesInitialized = useNodesInitialized();

	const { getNodes, getEdges, setNodes } = useReactFlow();

	const layout = useCallback(
		function layout()
		{
			if (!nodesInitialized)
			{
				return;
			}

			getLayoutedNodes(getNodes(), getEdges()).then(setNodes);
		},
		[nodesInitialized, getNodes, getEdges, setNodes],
	);

	return { layout };
}

async function getLayoutedNodes(nodes: Node[], edges: Edge[]): Promise<Node[]>
{
	// TODO: Figure out how to make this work with ports.
	// Maybe this will solve the intersection edges issue.

	const graph: ElkNode = {
		id: 'root',
		layoutOptions: layoutOptions,
		children: nodes.map((node) =>
		{
			// const targetPorts = edges
			// 	.filter((edge) => edge.target === node.id)
			// 	.map((edge) => edge.targetHandle || edge.target);

			// const sourcePorts = edges
			// 	.filter((edge) => edge.source === node.id)
			// 	.map((edge) => edge.sourceHandle || edge.source);

			return {
				id: node.id,
				width: node.measured?.width ?? 400,
				height: node.measured?.height ?? 200,
				// properties: {
				// 	'elk.portConstraints': 'FIXED_ORDER',
				// },
				// ports: [
				// 	...targetPorts.map((portId) => ({
				// 		id: portId,
				// 		properties: {
				// 			'elk.port.side': 'WEST',
				// 		},
				// 	})),
				// 	...sourcePorts.map((portId) => ({
				// 		id: portId,
				// 		properties: {
				// 			'elk.port.side': 'EAST',
				// 		},
				// 	})),
				// ],
			};
		}),
		edges: edges.map((edge) => ({
			id: edge.id,
			// sources: [edge.sourceHandle || edge.source],
			sources: [edge.source],
			// targets: [edge.targetHandle || edge.target],
			targets: [edge.target],
		})),
	};

	const layoutedGraph = await elk.layout(graph);

	return nodes.map((node) =>
	{
		const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);

		return {
			...node,
			position: {
				x: layoutedNode?.x ?? node.position.x,
				y: layoutedNode?.y ?? node.position.y,
			},
		};
	});
}

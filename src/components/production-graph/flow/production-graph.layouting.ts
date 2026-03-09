import type { Node } from '@xyflow/react';
import { Position } from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import { ProductionGraphEdge, ProductionGraphNode } from '@/components/production-graph';

const elk = new ELK();

// Reference: https://eclipse.dev/elk/reference/options.html

const elkOptions = {
	'org.eclipse.elk.algorithm': 'layered',
	'org.eclipse.elk.direction': 'RIGHT',
	'org.eclipse.elk.edgeRouting': 'POLYLINE',

	'org.eclipse.elk.layered.layering.strategy': 'NETWORK_SIMPLEX',

	'org.eclipse.elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
	'org.eclipse.elk.layered.crossingMinimization.iterations': '24',
	'org.eclipse.elk.layered.crossingMinimization.forceNodeModelOrder': 'false',

	'org.eclipse.elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
	'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',

	'org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers': '240',
	'org.eclipse.elk.spacing.nodeNode': '120',
};

interface LayoutedElements
{
	nodes: ProductionGraphNode[];
	edges: ProductionGraphEdge[];
}

export async function layoutProductionGraph(nodes: ProductionGraphNode[], edges: ProductionGraphEdge[]): Promise<LayoutedElements>
{
	const graph = {
		id: 'root',
		layoutOptions: elkOptions,
		children: nodes.map((node) => ({
			...node,
			targetPosition: Position.Top,
			sourcePosition: Position.Bottom,
			width: getNodeWidth(node),
			height: getNodeHeight(node),
		})),
		edges: edges.map((edge) => ({
			id: edge.id,
			sources: [edge.source],
			targets: [edge.target],
		})),
	};

	try
	{
		const layoutedGraph = await elk.layout(graph);

		if (!layoutedGraph.children)
		{
			throw new Error('No children in layouted graph.');
		}

		const layoutedNodes = layoutedGraph.children.map((node) => ({
			...node,
			position: {
				x: node.x!,
				y: node.y!,
			},
		}));

		return { nodes: layoutedNodes, edges };
	}
	catch (error)
	{
		console.error('Layout error:', error);
		return { nodes, edges };
	}
}

function getNodeWidth(node: Node): number
{
	if (!node.measured)
	{
		throw new Error(`Node ${node.id} is not measured yet.`);
	}

	if (!node.measured.width)
	{
		throw new Error(`Node ${node.id} has no measured width.`);
	}

	return node.measured.width;
}

function getNodeHeight(node: Node): number
{
	if (!node.measured)
	{
		throw new Error(`Node ${node.id} is not measured yet.`);
	}

	if (!node.measured.height)
	{
		throw new Error(`Node ${node.id} has no measured height.`);
	}

	return node.measured.height;
}

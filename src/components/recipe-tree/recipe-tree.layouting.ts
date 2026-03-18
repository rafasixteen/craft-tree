import type { Node, Edge } from '@xyflow/react';
import { Position } from '@xyflow/react';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

// Reference: https://eclipse.dev/elk/reference/options.html

const elkOptions = {
	'elk.algorithm': 'layered',
	'elk.direction': 'DOWN',
	'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
	'elk.layered.considerModelOrder': 'true',
	'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
	'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
	'elk.layered.spacing.nodeNodeBetweenLayers': '60',
	'elk.spacing.nodeNode': '50',
};

interface LayoutedElements
{
	nodes: Node[];
	edges: Edge[];
}

export async function layoutRecipeTree(
	nodes: Node[],
	edges: Edge[],
): Promise<LayoutedElements>
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

		const rootNode = findRootNode(layoutedGraph.children, edges);

		if (!rootNode)
		{
			throw new Error('Root node not found in layouted graph.');
		}

		const layoutedNodes = layoutedGraph.children.map((node) => ({
			...node,
			position: {
				x: node.x! - rootNode.x!,
				y: node.y! - rootNode.y!,
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

function findRootNode(nodes: ElkNode[], edges: Edge[]): ElkNode | undefined
{
	return nodes.find((node) =>
	{
		const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
		return !hasIncomingEdge;
	});
}

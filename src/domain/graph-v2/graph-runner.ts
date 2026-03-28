import { GraphData, nodeRegistry, NodeType } from '@/domain/graph-v2';
import { Node } from '@xyflow/react';

type Result = Map<Node['id'], Record<string, unknown>>;

export async function runGraph(graph: GraphData): Promise<Result>
{
	const outputs = new Map<string, Record<string, unknown>>();

	// Build adjacency for topological sort
	const inDegree = new Map(graph.nodes.map((n) => [n.id, 0]));
	const dependents = new Map<string, string[]>();

	for (const edge of graph.edges)
	{
		inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
		dependents.set(edge.source, [...(dependents.get(edge.source) ?? []), edge.target]);
	}

	const queue = graph.nodes.filter((n) => inDegree.get(n.id) === 0);

	while (queue.length > 0)
	{
		const node = queue.shift()!;
		const def = nodeRegistry[node.type as NodeType];

		if (!def) throw new Error(`Unknown node type: "${node.type}"`);

		// Build this node's input from upstream outputs, keyed by targetHandle
		const input: Record<string, unknown> = {};

		for (const edge of graph.edges.filter((e) => e.target === node.id))
		{
			const sourceOutput = outputs.get(edge.source);

			if (!sourceOutput)
			{
				throw new Error(`Node "${edge.source}" has no output — possible cycle or missing node`);
			}

			// sourceHandle = key in the upstream node's output
			// targetHandle = key in this node's input
			input[edge.targetHandle] = sourceOutput[edge.sourceHandle];
		}

		console.log(`Executing node ${node.id} of type ${node.type} with input:`, input);

		const output = await def.executor(input as any, node.data as any);
		outputs.set(node.id, output as Record<string, unknown>);

		console.log(`Node ${node.id} output:`, output);

		// Decrement inDegree for dependents and enqueue newly unblocked ones
		for (const dependentId of dependents.get(node.id) ?? [])
		{
			const next = (inDegree.get(dependentId) ?? 1) - 1;
			inDegree.set(dependentId, next);
			if (next === 0) queue.push(graph.nodes.find((n) => n.id === dependentId)!);
		}
	}

	return outputs;
}

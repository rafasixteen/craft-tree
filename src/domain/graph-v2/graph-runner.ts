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

		if (!def)
		{
			console.error(`[GraphRunner] ❌ Unknown node type: "${node.type}"`);
			throw new Error(`Unknown node type: "${node.type}"`);
		}

		const input: Record<string, unknown> = {};
		const incomingEdges = graph.edges.filter((e) => e.target === node.id);

		console.group(`[GraphRunner] ▶ ${node.type} (${node.id})`);
		console.log('  config:', node.data);
		console.log('  incoming edges:', incomingEdges.length);

		for (const edge of incomingEdges)
		{
			const sourceOutput = outputs.get(edge.source);

			console.group(`  edge ${edge.source} → ${edge.target}`);
			console.log('    sourceHandle:', edge.sourceHandle);
			console.log('    targetHandle:', edge.targetHandle);
			console.log('    sourceOutput:', sourceOutput);
			console.log('    resolved value:', sourceOutput?.[edge.sourceHandle]);
			console.groupEnd();

			if (!sourceOutput)
			{
				console.error(`  ❌ No output found for source node "${edge.source}"`);
				throw new Error(`Node "${edge.source}" has no output — possible cycle or missing node`);
			}

			input[edge.targetHandle] = sourceOutput[edge.sourceHandle];
		}

		console.log('  final input:', input);

		const output = await def.executor(input as any, node.data as any);

		console.log('  output:', output);
		console.groupEnd();

		outputs.set(node.id, output as Record<string, unknown>);

		for (const dependentId of dependents.get(node.id) ?? [])
		{
			const next = (inDegree.get(dependentId) ?? 1) - 1;
			inDegree.set(dependentId, next);
			if (next === 0) queue.push(graph.nodes.find((n) => n.id === dependentId)!);
		}
	}

	return outputs;
}

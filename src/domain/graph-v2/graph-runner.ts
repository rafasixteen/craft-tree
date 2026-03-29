import { GraphData, nodeRegistry, NodeType } from '@/domain/graph-v2';

type NodeOutputs = Map<string, any>;

export async function runGraph(graph: GraphData): Promise<NodeOutputs>
{
	const outputs = new Map<string, any>();

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

		const rawInputs: any[] = graph.edges.filter((e) => e.target === node.id).map((e) => outputs.get(e.source));

		const input = def.parseInputs ? def.parseInputs(rawInputs) : (rawInputs[0] ?? {});

		console.group(`[GraphRunner] ▶ ${node.type} (${node.id})`);
		console.log('  config:', JSON.stringify(node.data, null, 2));
		console.log('  input:', JSON.stringify(input, null, 2));

		const output = await def.executor(input as any, node.data as any);

		console.log('  output:', JSON.stringify(output, null, 2));
		console.groupEnd();

		outputs.set(node.id, { type: node.type, ...(output as any) });

		for (const dependentId of dependents.get(node.id) ?? [])
		{
			const next = (inDegree.get(dependentId) ?? 1) - 1;
			inDegree.set(dependentId, next);
			if (next === 0) queue.push(graph.nodes.find((n) => n.id === dependentId)!);
		}
	}

	return outputs;
}

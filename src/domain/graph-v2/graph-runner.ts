import { GraphData, getNodeDefinition, NodeType, NodeOutputs, NodeConfigs } from '@/domain/graph-v2';

type ExecutionOutputs = Map<string, NodeOutputs>;

export async function runGraph(graph: GraphData): Promise<ExecutionOutputs>
{
	const outputs: ExecutionOutputs = new Map();

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
		const def = getNodeDefinition(node.type as NodeType);

		if (!def) throw new Error(`Unknown node type: "${node.type}"`);

		const rawInputs = graph.edges
			.filter((e) => e.target === node.id)
			.map((e) => outputs.get(e.source))
			.filter((o): o is NodeOutputs => o !== undefined);

		// TODO: Fix this compilation error with input.

		const input = def.parseInputs ? def.parseInputs(rawInputs) : (rawInputs[0] ?? {});
		const output = await def.executor(input, node.data as NodeConfigs);

		outputs.set(node.id, { type: node.type, ...output } as NodeOutputs);

		for (const dependentId of dependents.get(node.id) ?? [])
		{
			const next = (inDegree.get(dependentId) ?? 1) - 1;
			inDegree.set(dependentId, next);
			if (next === 0) queue.push(graph.nodes.find((n) => n.id === dependentId)!);
		}
	}

	return outputs;
}

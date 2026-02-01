import { Node, NodeMap } from '@/domain/tree';

export function getNodePath(nodes: NodeMap, nodeId: string): string[]
{
	const path: string[] = [];
	let current: Node | null = nodes[nodeId] || null;

	while (current)
	{
		// Skip registering path for dummy node
		if (current.type !== 'dummy')
		{
			path.unshift(current.slug);
		}

		let parent: Node | null = null;

		// Find parent by scanning all node's children
		for (const candidate of Object.values(nodes))
		{
			const children = candidate.children || [];

			if (children.includes(current.id))
			{
				parent = candidate;
				break;
			}
		}

		current = parent;
	}

	return path;
}

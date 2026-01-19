import { Node, NodeMap } from '@/domain/tree';

export function getNodePath(nodes: NodeMap, node: Node): string[]
{
	const path: string[] = [];
	let current: Node | null = node;

	while (current)
	{
		// Skip registering path for collection and dummy nodes
		if (current.type !== 'collection' && current.type !== 'dummy')
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

import { Node, NodeMap } from '@/domain/tree';

export function findNodeByPath(nodes: NodeMap, pathSegments: string[]): Node | null
{
	let currentNode: Node | null = null;

	for (const segment of pathSegments)
	{
		let nextNode: Node | null = null;

		if (currentNode)
		{
			const children: string[] = currentNode.children || [];

			// If 'currentNode' has no children, return null.
			if (children !== undefined && children.length === 0)
			{
				return null;
			}

			// In 'currentNode', look for a child with matching slug.
			for (const childId of children)
			{
				const childNode: Node | null = nodes[childId];

				if (childNode && childNode.slug === segment)
				{
					nextNode = childNode;
					break;
				}
			}
		}
		else
		{
			// At root level, look for a node with matching slug.
			for (const node of Object.values(nodes))
			{
				// Skip dummy node at root level because it shouldn't be matched to any path segment.
				// This is to prevent matching the dummy node when looking for root-level nodes
				// if a path segment happens to be "root" (or whatever the dummy node's slug is).
				if (node.type === 'dummy') continue;

				if (node.slug === segment)
				{
					nextNode = node;
					break;
				}
			}
		}

		if (!nextNode)
		{
			return null;
		}

		currentNode = nextNode;
	}

	return currentNode;
}

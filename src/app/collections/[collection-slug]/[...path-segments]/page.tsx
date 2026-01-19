'use client';

import { NodeMap, useCollectionsContext, useTreeNodes } from '@/providers';
import { notFound, useParams } from 'next/navigation';
import { Node } from '@/domain/tree';

export default function Page()
{
	const { 'path-segments': pathSegments } = useParams();

	const { activeCollection } = useCollectionsContext();
	const { nodes, isLoading } = useTreeNodes();

	if (!Array.isArray(pathSegments))
	{
		return notFound();
	}

	const node = findNodeByPath(nodes, pathSegments);

	if (isLoading)
	{
		return <p>Loading...</p>;
	}

	if (!node)
	{
		return <p>Node not found for path: {pathSegments.join('/')}</p>;
	}

	return (
		<p>
			Item Page: {pathSegments.join('/')} at {activeCollection.slug}
			Node ID: {node.id}, Node Slug: {node.slug}
		</p>
	);
}

function findNodeByPath(nodes: NodeMap, pathSegments: string[]): Node | null
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

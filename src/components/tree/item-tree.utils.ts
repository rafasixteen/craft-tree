import { Node } from '@/domain/tree';

/**
 * Get children IDs for a node
 */
export function getItemChildren(id: string, nodes: Record<string, Node>): string[]
{
	const node = nodes[id];

	if (!node)
	{
		return [];
	}

	// Recipes can't have children
	if (node.type === 'recipe')
	{
		return [];
	}

	return node.children || [];
}

/**
 * Get a node by ID
 */
export function getItem(id: string, nodes: Record<string, Node>): Node
{
	return nodes[id] || { name: 'Loading...', children: [] };
}

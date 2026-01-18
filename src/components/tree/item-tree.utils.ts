import { Node } from '@/domain/tree';

/**
 * Replace a URL segment with a new slug
 * e.g., /collections/old-name -> /collections/new-name
 */
export function replaceSegment(pathname: string, segmentKey: 'collections' | 'folders' | 'items' | 'recipes', newSlug: string): string
{
	const parts = pathname.split('/');

	const index = parts.indexOf(segmentKey);
	if (index === -1) return pathname;

	// Replace the slug right after the segment key
	parts[index + 1] = newSlug;

	return parts.join('/');
}

/**
 * Get the name of a node
 */
export function getItemName(item: Node): string
{
	return item.name;
}

/**
 * Check if a node is a folder (can have children)
 */
export function isItemFolder(item: Node): boolean
{
	if (item.type === 'folder' || item.type === 'collection')
	{
		return true;
	}

	if (item.type === 'item' && item.children && item.children.length > 0)
	{
		return true;
	}

	return false;
}

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

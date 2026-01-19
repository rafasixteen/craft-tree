import { Node } from '@/domain/tree';

/**
 * Replace a node in the URL path with a new slug
 * Takes the current node path and replaces the last segment with the new slug
 * e.g., /collections/col1/folder1/item-old -> /collections/col1/folder1/item-new
 */
export function replaceSegment(pathname: string, currentNodePath: string[], newSlug: string): string
{
	// Replace the last segment of the node path with the new slug
	const newNodePath = [...currentNodePath.slice(0, -1), newSlug];

	// Reconstruct the URL: /collections/{newNodePath.join('/')}
	const pathParts = pathname.split('/').filter(Boolean);

	if (pathParts.length === 0) return pathname;

	// The first part is 'collections', then we add all the path segments
	const collectionsPart = pathParts[0];
	return '/' + collectionsPart + '/' + newNodePath.join('/');
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

import { InventoryTreeNode, InventoryTreeState } from '@/domain/inventory';

interface CanAddChildArgs
{
	parentNode: InventoryTreeNode;
	childNode: InventoryTreeNode;
}

export function canAddChild({ parentNode, childNode }: CanAddChildArgs): boolean
{
	switch (parentNode.type)
	{
		case 'dummy':
			return childNode.type === 'collection';
		case 'collection':
		case 'folder':
			return ['item', 'folder'].includes(childNode.type);
		case 'item':
			return childNode.type === 'recipe';
		case 'recipe':
			return false;
		default:
			return false;
	}
}

interface CanMoveNodeArgs
{
	node: InventoryTreeNode;
	newParent: InventoryTreeNode;
}

export function canMoveNode({ node, newParent }: CanMoveNodeArgs): boolean
{
	switch (newParent.type)
	{
		case 'dummy':
			return node.type === 'collection';
		case 'collection':
		case 'folder':
			return ['item', 'folder'].includes(node.type);
		case 'item':
			// Assume that the 'newParent' is already the current parent of the 'node'.
			// The headless tree UI won't allow dropping a recipe onto a different item.
			// But if we can enforce that rule here as well, it adds an extra layer of safety in case the UI rules change in the future.
			return node.type === 'recipe';
		case 'recipe':
			return false;
		default:
			return false;
	}
}

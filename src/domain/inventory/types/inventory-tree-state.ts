interface InventoryTreeNode
{
	id: string;
	name: string;
	slug: string;
	type: 'collection' | 'folder' | 'item' | 'recipe' | 'dummy';
	children?: InventoryTreeNode['id'][];
}

interface InventoryTreeState
{
	rootNodeId: InventoryTreeNode['id'];
	nodes: Record<InventoryTreeNode['id'], InventoryTreeNode>;
}

export type { InventoryTreeNode, InventoryTreeState };

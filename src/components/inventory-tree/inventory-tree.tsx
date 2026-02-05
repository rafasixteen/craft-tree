import { useMemo } from 'react';
import { useInventory, InventoryTreeNode } from '@/domain/inventory';
import { useTree } from '@headless-tree/react';
import { syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature, propMemoizationFeature } from '@headless-tree/core';
import { InventoryTreeNodeComp } from '@/components/inventory-tree';

export function InventoryTree()
{
	const { inventory } = useInventory();

	const headlessTreeData = useMemo(() =>
	{
		const dummyNode: InventoryTreeNode = {
			id: `dummy-${inventory.rootNodeId}`,
			name: 'Inventory',
			slug: 'dummy-root',
			type: 'dummy',
			children: [inventory.rootNodeId],
		};

		return {
			...inventory,
			rootNodeId: dummyNode.id,
			nodes: { ...inventory.nodes, [dummyNode.id]: dummyNode },
		};
	}, [inventory]);

	const headlessTree = useTree<InventoryTreeNode>({
		rootItemId: headlessTreeData.rootNodeId,
		dataLoader: {
			getItem: (id) => headlessTreeData.nodes[id],
			getChildren: (itemId) => headlessTreeData.nodes[itemId].children ?? [],
		},
		features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature, propMemoizationFeature],
		getItemName(item)
		{
			const node = item.getItemData();
			return node.name;
		},
		isItemFolder(item)
		{
			const node = item.getItemData();

			if (node.children && node.children.length > 0)
			{
				return true;
			}

			if (node.type === 'folder' || node.type === 'collection')
			{
				return true;
			}

			return false;
		},
	});

	return (
		<div {...headlessTree.getContainerProps()} className="flex flex-col">
			{headlessTree.getItems().map((item) => (
				<InventoryTreeNodeComp key={item.getId()} item={item} />
			))}
		</div>
	);
}

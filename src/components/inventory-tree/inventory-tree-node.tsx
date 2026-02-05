import { InventoryTreeNode } from '@/domain/inventory';
import { ItemInstance } from '@headless-tree/core';

interface InventoryTreeNodeProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function InventoryTreeNodeComp({ item }: InventoryTreeNodeProps)
{
	const style: React.CSSProperties = {
		paddingLeft: `${item.getItemMeta().level * 20}px`,
	};

	return (
		<button {...item.getProps()} style={style} className="flex">
			<div>{item.getItemName()}</div>
		</button>
	);
}

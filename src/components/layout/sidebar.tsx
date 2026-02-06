import { Collections } from '@/components/collections';
import { InventoryTree } from '@/components/inventory-tree';

export function Sidebar()
{
	return (
		<div className="flex h-full flex-col gap-2 p-2">
			<Collections />
			<InventoryTree />
		</div>
	);
}

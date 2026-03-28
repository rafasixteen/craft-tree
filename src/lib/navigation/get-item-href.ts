import { Inventory } from '@/domain';
import { Item } from '@/domain/item';
import { getInventoryHref } from '@/lib/navigation';

interface GetItemHrefParams
{
	inventoryId: Inventory['id'];
	itemId: Item['id'];
	path?: string[];
}

export function getItemHref({ inventoryId, itemId, path = [] }: GetItemHrefParams)
{
	const graphPath = ['items', itemId];
	const fullPath = [...graphPath, ...(path || [])];
	return getInventoryHref({ inventoryId, path: fullPath });
}

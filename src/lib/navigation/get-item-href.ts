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
	const base = getInventoryHref({ inventoryId, path: ['inventory', 'items', itemId] });
	return path.length > 0 ? `${base}/${path.join('/')}` : base;
}

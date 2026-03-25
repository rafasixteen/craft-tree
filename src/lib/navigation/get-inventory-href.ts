import { Inventory } from '@/domain/inventory';

interface GetInventoryHrefParams
{
	inventoryId: Inventory['id'];
	path?: string[];
}

export function getInventoryHref({ inventoryId, path = [] }: GetInventoryHrefParams)
{
	const base = `/inventories/${inventoryId}`;
	return path.length > 0 ? `${base}/${path.join('/')}` : base;
}

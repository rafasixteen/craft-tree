import { Inventory } from '@/domain/inventory';

export function getInventoryHref(inventory: Inventory)
{
	return `/inventories/${inventory.id}`;
}

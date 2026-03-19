import { Inventory } from '@/domain/inventory';

export function getInventoryHref(inventory: Inventory, action?: string)
{
	const base = `/inventories/${inventory.id}`;
	return action ? `${base}/${action}` : base;
}

import { Inventory } from '@/domain/inventory';

export function getInventoryHref(inventory: Inventory, path?: string[])
{
	const base = `/inventories/${inventory.id}`;
	return path ? `${base}/${path.join('/')}` : base;
}

import { Item } from '@/domain/item';

export function getItemHref(item: Item, action?: string)
{
	const base = `/inventories/${item.inventoryId}/items/${item.id}`;
	return action ? `${base}/${action}` : base;
}

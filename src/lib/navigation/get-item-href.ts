import { Item } from '@/domain/item';

export function getItemHref(item: Item)
{
	return `/inventories/${item.inventoryId}/items/${item.id}`;
}

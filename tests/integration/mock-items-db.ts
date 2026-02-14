// Mock DB for useItems integration tests
// This mock DB will simulate basic CRUD for items in-memory

import { Item } from '@/domain/item';
import { Inventory } from '@/domain/inventory';

let items: Item[] = [];

export function resetMockDb()
{
	items = [];
}

export function mockGetInventoryItems(inventoryId: Inventory['id']): Item[]
{
	return items.filter((item) => item.inventoryId === inventoryId);
}

export function mockCreateItem({ name, icon, inventoryId }: { name: string; icon: string | null; inventoryId: Inventory['id'] }): Item
{
	const newItem: Item = {
		id: crypto.randomUUID(),
		name,
		icon,
		inventoryId,
	};
	items.push(newItem);
	return newItem;
}

export function mockDeleteItem({ itemId }: { itemId: Item['id'] })
{
	items = items.filter((item) => item.id !== itemId);
}

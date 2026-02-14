import { Inventory } from '@/domain/inventory';

let inventories: Inventory[] = [];

export function resetMockInventoriesDb()
{
	inventories = [];
}

export function mockGetInventories(userId: string): Inventory[]
{
	return inventories.filter((inv) => inv.userId === userId);
}

export function mockCreateInventory({ name, userId }: { name: string; userId: string }): Inventory
{
	const newInventory: Inventory = {
		id: crypto.randomUUID(),
		name,
		userId,
	};

	inventories.push(newInventory);
	return newInventory;
}

export function mockUpdateInventory({ inventoryId, newName }: { inventoryId: string; newName: string }): Inventory
{
	inventories = inventories.map((inv) => (inv.id === inventoryId ? { ...inv, name: newName } : inv));
	return inventories.find((inv) => inv.id === inventoryId)!;
}

export function mockDeleteInventory({ inventoryId }: { inventoryId: string })
{
	inventories = inventories.filter((inv) => inv.id !== inventoryId);
}

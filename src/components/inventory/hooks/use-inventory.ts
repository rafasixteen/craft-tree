'use client';

import { useParams } from 'next/navigation';
import { Inventory, useInventories } from '@/domain/inventory';

export function useInventory(): Inventory
{
	const { inventories } = useInventories();

	const params = useParams();
	const inventoryId = params['inventory-id'];

	const inventory = inventories.find((inventory) => inventory.id === inventoryId) || null;

	if (inventory === null)
	{
		throw new Error(`Inventory with id "${inventoryId}" was not found. ` + `Make sure you are inside a valid /inventory/[inventory-id] route and that the inventory exists.`);
	}

	return inventory;
}

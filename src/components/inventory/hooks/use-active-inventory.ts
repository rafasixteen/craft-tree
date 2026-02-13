'use client';

import { useParams } from 'next/navigation';
import { Inventory, useInventories } from '@/domain/inventory';

export function useActiveInventory(): Inventory | null
{
	const { inventories } = useInventories();

	const params = useParams();
	const inventoryId = params['inventory-id'];

	const inventory = inventories.find((inventory) => inventory.id === inventoryId) || null;

	if (inventory === null)
	{
		console.warn(`Active inventory with ID ${inventoryId} not found`);
		console.warn('Available inventories:', inventories);
		console.warn('URL params:', params);
	}

	return inventory;
}

'use client';

import { useParams } from 'next/navigation';
import { Inventory, useInventories } from '@/domain/inventory';

export function useActiveInventory(): Inventory
{
	const { inventories } = useInventories();

	const params = useParams();
	const inventoryId = params['inventory-id'];

	const inventory = inventories.find((inventory) => inventory.id === inventoryId) || null;

	if (inventory === null)
	{
		throw new Error('Active inventory not found');
	}

	return inventory;
}

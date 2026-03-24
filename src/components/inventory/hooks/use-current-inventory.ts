'use client';

import { Inventory, useInventory } from '@/domain/inventory';

import { useParams } from 'next/navigation';

export function useCurrentInventory(): Inventory
{
	const params = useParams();
	const inventoryId = params['inventory-id'] as string;

	const { inventory } = useInventory({ inventoryId });

	if (!inventory)
	{
		throw new Error('Inventory not found');
	}

	return inventory;
}

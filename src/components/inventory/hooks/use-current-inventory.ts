'use client';

import { Inventory, useInventory } from '@/domain/inventory';

import { useParams } from 'next/navigation';

export function useCurrentInventory(): Inventory
{
	const params = useParams();
	const inventoryId = params['inventory-id'] as string;

	const { inventory } = useInventory(inventoryId);

	return inventory;
}

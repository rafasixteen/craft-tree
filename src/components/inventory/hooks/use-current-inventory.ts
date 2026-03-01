'use client';

import { useParams } from 'next/navigation';
import { Inventory, useInventory } from '@/domain/inventory';

export function useCurrentInventory(): Inventory
{
	const params = useParams();
	const inventoryId = params['inventory-id'] as string;

	const { inventory } = useInventory(inventoryId);

	return inventory;
}

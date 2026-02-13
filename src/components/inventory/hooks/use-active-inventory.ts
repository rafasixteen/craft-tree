'use client';

import { useParams } from 'next/navigation';
import { Inventory, useInventories } from '@/domain/inventory';

export function useActiveInventory(): Inventory | null
{
	const { inventories } = useInventories();

	const params = useParams();
	const inventoryId = params['inventory-id'];

	return inventories.find((inv) => inv.id === inventoryId) || null;
}

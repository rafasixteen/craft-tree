'use client';

import { Inventory } from '@/domain/inventory';
import { useCallback } from 'react';
import * as InventoryServerActions from '@/domain/inventory/server';
import useSWR from 'swr';

type UpdateInventoryParams = Omit<
	Parameters<typeof InventoryServerActions.updateInventory>[0],
	'id'
>;

export function useInventory(inventoryId: Inventory['id'])
{
	const swrKey = ['inventory', inventoryId];
	const fetcher = () => InventoryServerActions.getInventoryById(inventoryId);

	const { data: inventory, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	if (!inventory)
	{
		throw new Error(
			`Inventory with id ${inventoryId} not found. This hook must be used within a component wrapped by a <InventoryLayout> that provides the inventory data via SWR fallback.`,
		);
	}

	const updateInventory = useCallback(
		async function updateInventory({ name }: UpdateInventoryParams)
		{
			await mutate(
				async () =>
				{
					return await InventoryServerActions.updateInventory({
						id: inventory.id,
						name,
					});
				},
				{
					optimisticData: (current) => ({
						...current!,
						name,
					}),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventory.id, inventory.userId, mutate],
	);

	return {
		inventory: inventory,
		updateInventory,
	};
}

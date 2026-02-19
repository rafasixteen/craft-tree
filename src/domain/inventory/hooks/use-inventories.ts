'use client';

import { useUserId } from '@/domain/user';
import { getInventoriesByUserId, Inventory } from '@/domain/inventory';
import { useCallback } from 'react';
import * as InventoryServerActions from '@/domain/inventory/server';
import useSWR from 'swr';

export function useInventories()
{
	const { userId } = useUserId();

	const swrKey = userId ? ['inventories', userId] : null;
	const fetcher = () => getInventoriesByUserId(userId!);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createInventory = useCallback(
		async function createInventory(name: string)
		{
			if (!userId)
			{
				throw new Error('User ID is not available');
			}

			const optimistic: Inventory = {
				id: crypto.randomUUID(),
				name,
				userId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await InventoryServerActions.createInventory({ name, userId });
					return [...current, created];
				},
				{
					optimisticData: (current: Inventory[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[userId, mutate],
	);

	const updateInventory = useCallback(
		async function updateInventory(id: Inventory['id'], newName: string)
		{
			if (!userId)
			{
				throw new Error('User ID is not available');
			}

			await mutate(
				async (current = []) =>
				{
					const updated = await InventoryServerActions.updateInventory({
						inventoryId: id,
						newName: newName,
					});

					return current.map((inventory) => (inventory.id === id ? updated : inventory));
				},
				{
					optimisticData: (current: Inventory[] = []) => current.map((inv) => (inv.id === id ? { ...inv, name: newName } : inv)),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[userId, mutate],
	);

	const deleteInventory = useCallback(
		async function deleteInventory(id: Inventory['id'])
		{
			await mutate(
				async (current = []) =>
				{
					await InventoryServerActions.deleteInventory({ inventoryId: id });
					return current.filter((inv) => inv.id !== id);
				},
				{
					optimisticData: (current: Inventory[] = []) => current.filter((inv) => inv.id !== id),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[mutate],
	);

	return {
		inventories: data ?? [],
		createInventory,
		updateInventory,
		deleteInventory,
	};
}

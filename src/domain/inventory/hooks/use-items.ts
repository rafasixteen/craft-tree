'use client';

import { Inventory, getInventoryItems } from '@/domain/inventory';
import { Item } from '@/domain/item';
import * as ItemServerActions from '@/domain/item/server';
import { useCallback } from 'react';
import useSWR from 'swr';

export function useItems(inventoryId: Inventory['id'])
{
	const swrKey = inventoryId ? ['inventory-items', inventoryId] : null;
	const fetcher = () => getInventoryItems(inventoryId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const createItem = useCallback(
		async function createItem(name: string, icon: string | null)
		{
			const optimistic: Item = {
				id: crypto.randomUUID(),
				name,
				icon,
				inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ItemServerActions.createItem({ name, icon, inventoryId });
					return [...current, created];
				},
				{
					optimisticData: (current: Item[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const deleteItem = useCallback(
		async function deleteItem(id: Item['id'])
		{
			await mutate(
				async (current = []) =>
				{
					await ItemServerActions.deleteItem({ itemId: id });
					return current.filter((item) => item.id !== id);
				},
				{
					optimisticData: (current: Item[] = []) => current.filter((item) => item.id !== id),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	return {
		items: data ?? [],
		createItem,
		deleteItem,
	};
}

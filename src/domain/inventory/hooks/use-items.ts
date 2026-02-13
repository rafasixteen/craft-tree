'use client';

import { Inventory, getInventoryItems } from '@/domain/inventory';
import { Item } from '@/domain/item';
import * as ItemServerActions from '@/domain/item/server';
import useSWR from 'swr';

export function useItems(inventoryId: Inventory['id'])
{
	const swrKey = inventoryId ? ['inventory-items', inventoryId] : null;
	const fetcher = () => getInventoryItems(inventoryId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

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
				revalidate: false,
			},
		);
	}

	return {
		items: data ?? [],
		createItem,
	};
}
